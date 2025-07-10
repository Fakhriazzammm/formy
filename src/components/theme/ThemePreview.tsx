import React from "react";
import { ThemeConfig } from "./ThemeGenerator";

const ThemePreview: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  return (
    <div style={{
      border: `2px solid ${theme.primary}`,
      borderRadius: 12,
      padding: 24,
      background: theme.background,
      color: theme.primary,
      fontFamily: theme.font,
      minHeight: 180,
      textAlign: "center"
    }}>
      {theme.logo && <img src={theme.logo} alt="Logo" style={{ maxHeight: 48, marginBottom: 12 }} />}
      <h3 style={{ color: theme.primary }}>{theme.name}</h3>
      <p style={{ color: theme.secondary }}>Contoh judul form</p>
      <input placeholder="Input contoh" style={{ padding: 8, borderRadius: 6, border: `1px solid ${theme.secondary}`, width: "80%", marginBottom: 8 }} />
      <br />
      <button style={{ background: theme.primary, color: "#fff", border: 0, borderRadius: 8, padding: "8px 16px" }}>Tombol</button>
    </div>
  );
};

export default ThemePreview; 