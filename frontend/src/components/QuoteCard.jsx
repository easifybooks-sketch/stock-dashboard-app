import React from "react";

export default function QuoteCard({ quote, inWatchlist, onToggleWatchlist }) {
  const isPositive = quote.change >= 0;
  const changeColor = isPositive ? "var(--green)" : "var(--red)";
  const arrow = isPositive ? "▲" : "▼";

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div>
          <div style={styles.symbolRow}>
            <span style={styles.symbol}>{quote.symbol}</span>
            <button
              onClick={onToggleWatchlist}
              style={styles.starBtn}
              title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {inWatchlist ? "★" : "☆"}
            </button>
          </div>
          <div style={styles.date}>Latest: {quote.latest_day}</div>
        </div>
        <div style={styles.priceBlock}>
          <div style={styles.price}>${quote.price.toFixed(2)}</div>
          <div style={{ ...styles.change, color: changeColor }}>
            {arrow} {Math.abs(quote.change).toFixed(2)} ({quote.change_percent})
          </div>
        </div>
      </div>
      <div style={styles.meta}>
        <div style={styles.metaItem}>
          <span style={styles.metaLabel}>Volume</span>
          <span style={styles.metaValue}>{quote.volume.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    padding: "24px",
    marginBottom: 20,
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  symbolRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  symbol: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  starBtn: {
    background: "none",
    border: "none",
    color: "#facc15",
    fontSize: 22,
    lineHeight: 1,
    padding: 0,
  },
  date: {
    fontSize: 13,
    color: "var(--text-muted)",
    marginTop: 4,
  },
  priceBlock: {
    textAlign: "right",
  },
  price: {
    fontSize: 28,
    fontWeight: 700,
  },
  change: {
    fontSize: 14,
    fontWeight: 600,
    marginTop: 2,
  },
  meta: {
    display: "flex",
    gap: 32,
    borderTop: "1px solid var(--border)",
    paddingTop: 14,
  },
  metaItem: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  metaLabel: {
    fontSize: 12,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  metaValue: {
    fontSize: 15,
    fontWeight: 600,
  },
};
