import React, { useState } from 'react';
import { useChat } from 'ai/react';
import { useFormStore } from '@/stores/useFormStore';
import { FormField } from '@/types';
import type { FormComponent } from '@/types/form';
import ChatMessage from './ChatMessage';
import QuickSuggestions, { QUICK_SUGGESTIONS } from './QuickSuggestions';

interface ChatInterfaceAIProps {
  initialPrompt?: string | null;
}

// Fungsi untuk mencoba mengurai komponen dari respons AI
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

const ChatInterfaceAI: React.FC<ChatInterfaceAIProps> = ({ initialPrompt }) => {
  const [info, setInfo] = useState<string | null>(null);
  const setComponents = useFormStore.setState;
  
  // Gunakan hook useChat dari AI SDK
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/ai/chat',
    initialMessages: initialPrompt ? [
      { id: '1', role: 'user', content: initialPrompt }
    ] : [],
    onFinish: (message) => {
      // Coba update live preview jika balasan AI mengandung array komponen
      const parsed = tryParseComponentsFromAI(message.content);
      if (parsed) {
        setComponents({ components: parsed });
        setInfo("Live preview form berhasil diupdate dari AI!");
      }
    }
  });

  const handleQuickSuggestion = (text: string) => {
    // Gunakan pendekatan yang lebih sederhana dengan API useChat
    // Cukup set input dan kirim pesan secara manual
    handleInputChange({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>);
    
    // Gunakan API useChat untuk mengirim pesan secara manual
    setTimeout(() => {
      // @ts-expect-error - Kita mengakses API internal useChat
      handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
    }, 100);
  };

  const handleReset = () => {
    // Reset percakapan dengan me-refresh halaman
    window.location.reload();
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
        {messages.map((msg) => (
          <div key={msg.id} style={{ position: "relative" }}>
            <ChatMessage 
              message={msg.content} 
              isUser={msg.role === 'user'} 
            />
          </div>
        ))}
      </div>
      {isLoading && <div style={{ color: "#888" }}>AI sedang mengetik...</div>}
      {error && <div style={{ color: "red" }}>{error.message || 'Terjadi kesalahan'}</div>}
      {info && <div style={{ color: "#4caf50" }}>{info}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Tulis prompt..."
          style={{ flex: 1, borderRadius: 8, border: "1px solid #ccc", padding: 8 }}
        />
        <button type="submit" disabled={isLoading || !input.trim()} style={{
          background: "#00bcd4",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 16px",
          cursor: isLoading ? "not-allowed" : "pointer"
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

export default ChatInterfaceAI;