import React from "react";
import { ThemeConfig } from "./ThemeGenerator";

const templates: ThemeConfig[] = [
  {
    name: "Minimalis",
    primary: "#222",
    secondary: "#888",
    background: "#fff",
    font: "Inter, sans-serif",
  },
  {
    name: "Modern Blue",
    primary: "#0070f3",
    secondary: "#00bcd4",
    background: "#f4f8fb",
    font: "Roboto, sans-serif",
  },
  {
    name: "Corporate",
    primary: "#2d3e50",
    secondary: "#e67e22",
    background: "#f9f9f9",
    font: "Segoe UI, sans-serif",
  },
  {
    name: "Dark Mode",
    primary: "#fff",
    secondary: "#90caf9",
    background: "#222",
    font: "Montserrat, sans-serif",
  },
  // Template baru
  {
    name: "Pastel Soft",
    primary: "#a3c9a8",
    secondary: "#f7cac9",
    background: "#fef6e4",
    font: "Quicksand, sans-serif",
  },
  {
    name: "Sunset Orange",
    primary: "#ff7043",
    secondary: "#ffd180",
    background: "#fff3e0",
    font: "Nunito, sans-serif",
  },
  {
    name: "Nature Green",
    primary: "#388e3c",
    secondary: "#c8e6c9",
    background: "#f1f8e9",
    font: "Lato, sans-serif",
  },
  {
    name: "Elegant Purple",
    primary: "#7c4dff",
    secondary: "#b39ddb",
    background: "#ede7f6",
    font: "Poppins, sans-serif",
  },
  {
    name: "Oceanic",
    primary: "#0288d1",
    secondary: "#4dd0e1",
    background: "#e0f7fa",
    font: "Open Sans, sans-serif",
  },
];

const ThemeTemplates: React.FC<{ onSelect: (tpl: ThemeConfig) => void }> = ({ onSelect }) => (
  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
    {templates.map((tpl, i) => (
      <div key={i} style={{ border: `2px solid ${tpl.primary}`, borderRadius: 8, padding: 12, minWidth: 100, cursor: "pointer", background: tpl.background, marginBottom: 8 }} onClick={() => onSelect(tpl)}>
        <div style={{ fontWeight: 600, color: tpl.primary }}>{tpl.name}</div>
        <div style={{ fontSize: 12, color: tpl.secondary }}>{tpl.font}</div>
        <div style={{ marginTop: 8, height: 16, background: tpl.primary, borderRadius: 4 }} />
        <div style={{ marginTop: 4, height: 8, background: tpl.secondary, borderRadius: 4 }} />
      </div>
    ))}
  </div>
);

export default ThemeTemplates; 