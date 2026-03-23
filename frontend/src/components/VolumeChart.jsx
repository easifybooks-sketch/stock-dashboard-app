import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function VolumeChart({ data, symbol }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>{symbol} — Volume</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3d" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8b8fa3", fontSize: 11 }}
            tickFormatter={(d) => d.slice(5)}
            minTickGap={40}
          />
          <YAxis
            tick={{ fill: "#8b8fa3", fontSize: 11 }}
            tickFormatter={(v) =>
              v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1_000).toFixed(0)}K`
            }
          />
          <Tooltip
            contentStyle={{
              background: "#1a1d27",
              border: "1px solid #2a2e3d",
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: "#8b8fa3" }}
            formatter={(v) => [v.toLocaleString(), "Volume"]}
          />
          <Bar dataKey="volume" fill="#6366f1" opacity={0.7} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    padding: "20px",
    marginBottom: 20,
  },
  heading: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 16,
    color: "var(--text)",
  },
};
