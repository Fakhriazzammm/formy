import { NextRequest, NextResponse } from "next/server";

// Definisi tipe untuk pesan dalam riwayat chat
type ChatMessage = {
  role: string; // 'user' atau 'model'
  content: string;
};

export async function POST(req: NextRequest) {
  const { prompt, history } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key not set" }, { status: 500 });
  }

  try {
    // Konversi riwayat chat ke format yang diharapkan oleh Gemini API
    const formattedHistory = (history || []).map((message: ChatMessage) => ({
      role: message.role === 'model' ? 'model' : 'user',
      parts: [{ text: message.content }]
    }));

    // Contoh endpoint Gemini (update sesuai dokumentasi Gemini API)
    const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          ...formattedHistory,
          { role: "user", parts: [{ text: prompt }] }
        ]
      })
    });
    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "(Tidak ada balasan dari Gemini)";
    return NextResponse.json({ reply });
  } catch (e: unknown) {
    console.error('Error calling Gemini API:', e);
    return NextResponse.json({ error: (e as Error).message || "Gemini API error" }, { status: 500 });
  }
}