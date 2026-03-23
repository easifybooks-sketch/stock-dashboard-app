import React, { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim().toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter ticker symbol (e.g. AAPL, TSLA, 0005.HK)"
        style={styles.input}
      />
      <button type="submit" disabled={loading || !input.trim()} style={styles.btn}>
        {loading ? (
          <span style={styles.spinner} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: 10,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    padding: "14px 18px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.15s",
  },
  btn: {
    padding: "0 20px",
    borderRadius: "var(--radius)",
    border: "none",
    background: "var(--accent)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 52,
    transition: "background 0.15s",
  },
  spinner: {
    display: "inline-block",
    width: 18,
    height: 18,
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
};
