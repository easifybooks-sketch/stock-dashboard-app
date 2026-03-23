"""FastAPI backend – proxies Alpha Vantage and serves stock data."""

from __future__ import annotations

import os
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

AV_KEY = os.getenv("ALPHA_VANTAGE_KEY", "demo")
AV_BASE = "https://www.alphavantage.co/query"

app = FastAPI(title="Stock Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic models ────────────────────────────────────────────────
class QuoteResponse(BaseModel):
    symbol: str
    price: float
    change: float
    change_percent: str
    volume: int
    latest_day: str


class TimeSeriesPoint(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int


class SearchResult(BaseModel):
    symbol: str
    name: str
    type: str
    region: str
    currency: str


# ── Helpers ─────────────────────────────────────────────────────────
async def _av_get(params: dict) -> dict:
    """Call Alpha Vantage and return JSON, raising on errors."""
    params["apikey"] = AV_KEY
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(AV_BASE, params=params)
        resp.raise_for_status()
        data = resp.json()
    if "Error Message" in data:
        raise HTTPException(status_code=400, detail=data["Error Message"])
    if "Note" in data:
        raise HTTPException(status_code=429, detail="Alpha Vantage rate limit hit. Try again in ~60 s.")
    if "Information" in data and "rate" in data["Information"].lower():
        raise HTTPException(status_code=429, detail=data["Information"])
    return data


# ── Routes ──────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.get("/api/quote", response_model=QuoteResponse)
async def get_quote(symbol: str = Query(..., min_length=1)):
    """Return the latest global quote for a symbol."""
    data = await _av_get({"function": "GLOBAL_QUOTE", "symbol": symbol.upper()})
    gq = data.get("Global Quote", {})
    if not gq:
        raise HTTPException(status_code=404, detail=f"No quote found for {symbol}")
    return QuoteResponse(
        symbol=gq.get("01. symbol", symbol.upper()),
        price=float(gq.get("05. price", 0)),
        change=float(gq.get("09. change", 0)),
        change_percent=gq.get("10. change percent", "0%"),
        volume=int(gq.get("06. volume", 0)),
        latest_day=gq.get("07. latest trading day", ""),
    )


@app.get("/api/timeseries", response_model=list[TimeSeriesPoint])
async def get_timeseries(
    symbol: str = Query(..., min_length=1),
    interval: str = Query("daily", pattern="^(daily|weekly|monthly)$"),
):
    """Return historical price data (up to 100 most recent points)."""
    fn_map = {
        "daily": "TIME_SERIES_DAILY",
        "weekly": "TIME_SERIES_WEEKLY",
        "monthly": "TIME_SERIES_MONTHLY",
    }
    ts_key_map = {
        "daily": "Time Series (Daily)",
        "weekly": "Weekly Time Series",
        "monthly": "Monthly Time Series",
    }
    data = await _av_get({
        "function": fn_map[interval],
        "symbol": symbol.upper(),
        "outputsize": "compact",
    })
    ts = data.get(ts_key_map[interval], {})
    points: list[TimeSeriesPoint] = []
    for date_str in sorted(ts.keys(), reverse=True)[:100]:
        d = ts[date_str]
        points.append(
            TimeSeriesPoint(
                date=date_str,
                open=float(d["1. open"]),
                high=float(d["2. high"]),
                low=float(d["3. low"]),
                close=float(d["4. close"]),
                volume=int(d["5. volume"]),
            )
        )
    return points


@app.get("/api/search", response_model=list[SearchResult])
async def search_symbols(q: str = Query(..., min_length=1)):
    """Search for ticker symbols by keyword."""
    data = await _av_get({"function": "SYMBOL_SEARCH", "keywords": q})
    matches = data.get("bestMatches", [])
    return [
        SearchResult(
            symbol=m.get("1. symbol", ""),
            name=m.get("2. name", ""),
            type=m.get("3. type", ""),
            region=m.get("4. region", ""),
            currency=m.get("8. currency", ""),
        )
        for m in matches
    ]


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
