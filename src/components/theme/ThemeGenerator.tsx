import React, { useState, useEffect, useRef } from "react";
import { fetchGeminiAPI } from "@/lib/ai";
import ThemePreview from "./ThemePreview";
import ThemeTemplates from "./ThemeTemplates";
import { useFormStore } from "@/stores/useFormStore";

export type ThemeConfig = {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  font: string;
  logo?: string;
};

const DEFAULT_THEME: ThemeConfig = {
  name: "Default",
  primary: "#0070f3",
  secondary: "#f50057",
  background: "#fff",
  font: "Inter, sans-serif",
  logo: undefined,
};

const ThemeGenerator: React.FC = () => {
  const themeConfig = useFormStore(s => s.themeConfig);
  const setThemeConfig = useFormStore(s => s.setThemeConfig);
  const [theme, setTheme] = useState<ThemeConfig>(themeConfig || DEFAULT_THEME);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [aiPrompt, setAIPrompt] = useState("Buatkan tema UI modern untuk aplikasi form builder. Balas hanya JSON dengan key: name, primary, secondary, background, font. Contoh: {\"name\":\"Modern\",\"primary\":\"#123456\",...}");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTheme(themeConfig);
  }, [themeConfig]);

  useEffect(() => {
    setThemeConfig(theme);
    // eslint-disable-next-line
  }, [theme.name, theme.primary, theme.secondary, theme.background, theme.font, theme.logo]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme({ ...theme, [e.target.name]: e.target.value });
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setTheme((t) => ({ ...t, logo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleTemplate = (tpl: ThemeConfig) => {
    setTheme(tpl);
    setInfo("Template diterapkan!");
  };

  const handleAIGenerate = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const prompt = aiPrompt;
      const aiReply = await fetchGeminiAPI(prompt);
      const match = aiReply.match(/\{[\s\S]*\}/);
      if (match) {
        const aiTheme = JSON.parse(match[0]);
        setTheme((t) => ({ ...t, ...aiTheme }));
        setInfo("Theme dari AI berhasil diterapkan!");
      } else {
        setError("AI tidak mengembalikan format tema yang valid.");
      }
    } catch {
      setError("Gagal generate tema dari AI");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(theme, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name || 'theme'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string);
        setTheme(imported);
        setInfo("Theme berhasil di-import!");
      } catch {
        setError("File tidak valid!");
      }
    };
    reader.readAsText(file);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setTheme(DEFAULT_THEME);
    setInfo("Theme direset ke default.");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, background: "#fafbfc", borderRadius: 12 }}>
      <h2>Theme Generator</h2>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <label>Nama Tema
            <input name="name" value={theme.name} onChange={handleInput} style={{ width: "100%" }} />
          </label>
          <label>Warna Utama
            <input name="primary" type="color" value={theme.primary} onChange={handleInput} />
          </label>
          <label>Warna Sekunder
            <input name="secondary" type="color" value={theme.secondary} onChange={handleInput} />
          </label>
          <label>Background
            <input name="background" type="color" value={theme.background} onChange={handleInput} />
          </label>
          <label>Font
            <input name="font" value={theme.font} onChange={handleInput} style={{ width: "100%" }} />
          </label>
          <label>Logo (opsional)
            <input type="file" accept="image/*" onChange={handleLogo} />
          </label>
          <label>Custom AI Prompt
            <textarea value={aiPrompt} onChange={e => setAIPrompt(e.target.value)} style={{ width: "100%", minHeight: 48, marginBottom: 8 }} />
          </label>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={handleAIGenerate} disabled={loading} style={{ background: "#0070f3", color: "#fff", border: 0, borderRadius: 8, padding: "8px 16px" }}>Generate with AI</button>
            <button onClick={handleExport} style={{ background: "#fff", color: "#0070f3", border: "1px solid #0070f3", borderRadius: 8, padding: "8px 16px" }}>Export</button>
            <button onClick={handleImportClick} style={{ background: "#fff", color: "#0070f3", border: "1px solid #0070f3", borderRadius: 8, padding: "8px 16px" }}>Import</button>
            <input ref={fileInputRef} type="file" accept="application/json" style={{ display: "none" }} onChange={handleImport} />
            <button onClick={handleReset} style={{ background: "#f44336", color: "#fff", border: 0, borderRadius: 8, padding: "8px 16px" }}>Reset</button>
          </div>
          {loading && <div style={{ color: "#888" }}>AI sedang membuat tema...</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}
          {info && <div style={{ color: "#4caf50" }}>{info}</div>}
        </div>
        <div style={{ flex: 1 }}>
          <ThemePreview theme={theme} />
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <h4>Pilih Template</h4>
        <ThemeTemplates onSelect={handleTemplate} />
      </div>
    </div>
  );
};

export default ThemeGenerator; 