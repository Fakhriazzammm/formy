import React from "react";

const QUICK_SUGGESTIONS = [
  "Buat form pendaftaran event dengan upload foto",
  "Form survei kepuasan pelanggan",
  "Form lamaran kerja dengan CV upload"
];

const QuickSuggestions: React.FC<{ onSelect: (text: string) => void }> = ({ onSelect }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
    {QUICK_SUGGESTIONS.map((s, i) => (
      <button key={i} onClick={() => onSelect(s)} style={{
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: "4px 12px",
        cursor: "pointer"
      }}>{s}</button>
    ))}
  </div>
);

export default QuickSuggestions;
export { QUICK_SUGGESTIONS }; 