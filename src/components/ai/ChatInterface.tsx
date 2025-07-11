import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import QuickSuggestions, { QUICK_SUGGESTIONS } from "./QuickSuggestions";
import { fetchGeminiAPI } from "@/lib/ai";
import { useFormStore } from "@/stores/useFormStore";
import { FormField } from '@/types';
import { FormComponent } from '@/stores/useFormStore';

interface ChatInterfaceProps {
  initialPrompt?: string | null;
}

function tryParseComponentsFromAI(text: string): FormComponent[] | null {
  try {
    const arr = JSON.parse(text);
    if (!Array.isArray(arr)) return null;
    // Map Partial<FormField> ke FormComponent
    return arr.map((field: Partial<FormField>, idx: number) => ({
      id: field.id || `ai-${idx}`,
      type: field.type || 'text',
      props: field
    }));
  } catch {
    return null;
  }
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialPrompt }) => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState(initialPrompt || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const setComponents = useFormStore.setState;
  const initialPromptSent = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    setMessages((prev) => [...prev, { text, isUser: true }]);
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const aiReply = await fetchGeminiAPI(text, messages.map(m => m.text));
      setMessages((prev) => [...prev, { text: aiReply, isUser: false }]);
      // Coba update live preview jika balasan AI mengandung array komponen
      const parsed = tryParseComponentsFromAI(aiReply);
      if (parsed) {
        setComponents({ components: parsed });
        setInfo("Live preview form berhasil diupdate dari AI!");
      }
    } catch {
      setError("Gagal mendapatkan balasan dari AI.");
    } finally {
      setLoading(false);
    }
  }, [messages, setComponents]);

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt && !initialPromptSent.current) {
      initialPromptSent.current = true;
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, sendMessage, initialPromptSent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleQuickSuggestion = (text: string) => {
    setInput(text);
    sendMessage(text);
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
    setError(null);
    setInfo(null);
  };

  // Feedback (opsional, dummy)
  const handleFeedback = (idx: number, value: "up" | "down") => {
    // TODO: Kirim feedback ke backend jika perlu
    alert(`Feedback untuk pesan #${idx + 1}: ${value}`);
  };

  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: 12,
      maxWidth: 500,
      margin: "0 auto",
      padding: 24,
      background: "#fafbfc"
    }}>
      <h3>AI Chat Form Builder</h3>
      <QuickSuggestions onSelect={handleQuickSuggestion} />
      <div style={{ minHeight: 200, maxHeight: 320, overflowY: "auto", marginBottom: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ position: "relative" }}>
            <ChatMessage message={msg.text} isUser={msg.isUser} />
            {!msg.isUser && (
              <div style={{ position: "absolute", right: 0, top: 0, display: "flex", gap: 4 }}>
                <button onClick={() => handleFeedback(i, "up")} title="Bagus" style={{ background: "none", border: "none", color: "#4caf50", cursor: "pointer" }}>👍</button>
                <button onClick={() => handleFeedback(i, "down")} title="Kurang" style={{ background: "none", border: "none", color: "#f44336", cursor: "pointer" }}>👎</button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {loading && <div style={{ color: "#888" }}>AI sedang mengetik...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {info && <div style={{ color: "#4caf50" }}>{info}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Tulis prompt..."
          style={{ flex: 1, borderRadius: 8, border: "1px solid #ccc", padding: 8 }}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{
          background: "#00bcd4",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 16px",
          cursor: loading ? "not-allowed" : "pointer"
        }}>Kirim</button>
        <button type="button" onClick={handleReset} style={{
          background: "#fff",
          color: "#888",
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: "8px 12px",
          cursor: "pointer"
        }}>Reset</button>
      </form>
      <div style={{ marginTop: 16, fontSize: 12, color: "#888" }}>
        Contoh prompt: <br />
        <ul>
          {QUICK_SUGGESTIONS.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default ChatInterface; 