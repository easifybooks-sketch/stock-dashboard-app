import React from "react";

export default function Watchlist({ symbols, activeSymbol, onSelect, onRemove }) {
  if (!symbols.length) return null;

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>Watchlist</h3>
      <div style={styles.list}>
        {symbols.map((sym) => (
          <div
            key={sym}
            style={{
              ...styles.item,
              ...(sym === activeSymbol ? styles.itemActive : {}),
            }}
          >
            <button onClick={() => onSelect(sym)} style={styles.symBtn}>
              {sym}
            </button>
            <button onClick={() => onRemove(sym)} style={styles.removeBtn} title="Remove">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    padding: "20px",
    marginTop: 8,
  },
  heading: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 14,
    color: "var(--text)",
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  item: {
    display: "flex",
    alignItems: "center",
    background: "var(--bg)",
    borderRadius: 8,
    border: "1px solid var(--border)",
    overflow: "hidden",
    transition: "border-color 0.15s",
  },
  itemActive: {
    borderColor: "var(--accent)",
  },
  symBtn: {
    padding: "8px 14px",
    background: "none",
    border: "none",
    color: "var(--text)",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.3px",
  },
  removeBtn: {
    padding: "8px 10px",
    background: "none",
    border: "none",
    borderLeft: "1px solid var(--border)",
    color: "var(--text-muted)",
    fontSize: 16,
    lineHeight: 1,
  },
};
