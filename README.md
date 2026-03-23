# Stock Dashboard

A full-stack stock price dashboard with a **React** frontend and **Python / FastAPI** backend, powered by [Alpha Vantage](https://www.alphavantage.co/) market data.

![screenshot](https://img.shields.io/badge/stack-React%20%2B%20FastAPI-6366f1)

## Features

- **Live stock quotes** — price, change, volume
- **Interactive charts** — price history (area) and volume (bar) via Recharts
- **Daily / Weekly / Monthly** intervals
- **Watchlist** — persisted in localStorage
- **Symbol search** — ticker autocomplete from Alpha Vantage

## Quick Start

### 1. Clone & configure

```bash
git clone https://github.com/<your-user>/stock-dashboard.git
cd stock-dashboard
cp .env.example .env
# Edit .env and add your Alpha Vantage API key
```

### 2. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — the Vite dev server proxies `/api` requests to the FastAPI backend on port 8000.

## API Endpoints

| Method | Path             | Description                  |
| ------ | ---------------- | ---------------------------- |
| GET    | `/api/health`    | Health check                 |
| GET    | `/api/quote`     | Latest quote for a symbol    |
| GET    | `/api/timeseries`| Historical OHLCV data        |
| GET    | `/api/search`    | Search tickers by keyword    |

## Tech Stack

- **Frontend**: React 18, Vite, Recharts
- **Backend**: Python 3.11+, FastAPI, httpx
- **Data**: Alpha Vantage (free tier — 25 req/day)

## License

MIT
