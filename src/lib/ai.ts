// src/lib/ai.ts

export async function fetchGeminiAPI(prompt: string, history: string[] = []): Promise<string> {
  try {
    const res = await fetch("/api/ai/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, history })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API error");
    return data.reply;
  } catch (e: unknown) {
    return `Gagal menghubungi Gemini: ${(e as Error).message}`;
  }
} 