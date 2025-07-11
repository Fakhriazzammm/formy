// src/lib/ai.ts

// Definisi tipe untuk pesan dalam riwayat chat
export type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

/**
 * Mengambil respons dari API Gemini
 * @param prompt - Prompt yang akan dikirim ke API
 * @param history - Riwayat chat sebelumnya (opsional)
 * @returns Promise yang menyelesaikan ke string respons dari API
 */
export async function fetchGeminiAPI(prompt: string, history: string[] = []): Promise<string> {
  try {
    // Konversi history dari array string ke format ChatMessage
    const formattedHistory: ChatMessage[] = history.map((message, index) => ({
      role: index % 2 === 0 ? 'user' : 'model',
      content: message
    }));

    const res = await fetch("/api/ai/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, history: formattedHistory })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API error");
    return data.reply;
  } catch (e: unknown) {
    console.error('Error fetching Gemini API:', e);
    return `Gagal menghubungi Gemini: ${(e as Error).message}`;
  }
}