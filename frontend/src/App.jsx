import React, { useState, useCallback } from "react";
import SearchBar from "./components/SearchBar.jsx";
import QuoteCard from "./components/QuoteCard.jsx";
import PriceChart from "./components/PriceChart.jsx";
import VolumeChart from "./components/VolumeChart.jsx";
import Watchlist from "./components/Watchlist.jsx";

const API = "/api";

export default function App() {
  const [symbol, setSymbol] = useState("");
  const [quote, setQuote] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [interval, setInterval_] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("watchlist")) || ["AAPL", "MSFT", "GOOGL"];
    } catch {
      return ["AAPL", "MSFT", "GOOGL"];
    }
  });

  const fetchStock = useCallback(
    async (sym, intv) => {
      const s = (sym || symbol).toUpperCase().trim();
      const i = intv || interval;
      if (!s) return;
      setLoading(true);
      setError("");
      try {
        // Fetch quote first
        const qRes = await fetch(`${API}/quote?symbol=${s}`);
        if (!qRes.ok) {
          const err = await qRes.json();
          throw new Error(err.detail || "Failed to fetch quote");
        }
        const qData = await qRes.json();
        setQuote(qData);
        setSymbol(s);

        // Wait 1.5s to avoid Alpha Vantage rate limit (1 req/sec on free tier)
        await new Promise((r) => setTimeout(r, 1500));

        // Then fetch time series
        const tRes = await fetch(`${API}/timeseries?symbol=${s}&interval=${i}`);
        if (!tRes.ok) {
          const err = await tRes.json();
          throw new Error(err.detail || "Failed to fetch time series");
        }
        const tData = await tRes.json();
        setTimeseries(tData.reverse());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [symbol, interval]
  );

  const handleSearch = (sym) => {
    setSymbol(sym);
    fetchStock(sym, interval);
  };

  const handleIntervalChange = (intv) => {
    setInterval_(intv);
    if (symbol) fetchStock(symbol, intv);
  };

  const toggleWatchlist = (sym) => {
    setWatchlist((prev) => {
      const next = prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym];
      localStorage.setItem("watchlist", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          <h1 style={styles.title}>Stock Dashboard</h1>
        </div>
        <span style={styles.subtitle}>Powered by Alpha Vantage</span>
      </header>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && <div style={styles.error}>{error}</div>}

      {quote && (
        <>
          <QuoteCard
            quote={quote}
            inWatchlist={watchlist.includes(quote.symbol)}
            onToggleWatchlist={() => toggleWatchlist(quote.symbol)}
          />

          <div style={styles.intervalRow}>
            {["daily", "weekly", "monthly"].map((intv) => (
              <button
                key={intv}
                onClick={() => handleIntervalChange(intv)}
                style={{
                  ...styles.intervalBtn,
                  ...(interval === intv ? styles.intervalBtnActive : {}),
                }}
              >
                {intv.charAt(0).toUpperCase() + intv.slice(1)}
              </button>
            ))}
          </div>

          {timeseries.length > 0 && (
            <>
              <PriceChart data={timeseries} symbol={symbol} />
              <VolumeChart data={timeseries} symbol={symbol} />
            </>
          )}
        </>
      )}

      <Watchlist
        symbols={watchlist}
        activeSymbol={symbol}
        onSelect={handleSearch}
        onRemove={toggleWatchlist}
      />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "24px 20px 60px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "var(--text)",
  },
  subtitle: {
    fontSize: 13,
    color: "var(--text-muted)",
  },
  error: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "var(--red)",
    padding: "12px 16px",
    borderRadius: "var(--radius)",
    marginBottom: 16,
    fontSize: 14,
  },
  intervalRow: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
  },
  intervalBtn: {
    padding: "8px 18px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text-muted)",
    fontSize: 13,
    fontWeight: 500,
    transition: "all 0.15s",
  },
  intervalBtnActive: {
    background: "var(--accent)",
    borderColor: "var(--accent)",
    color: "#fff",
  },
};
