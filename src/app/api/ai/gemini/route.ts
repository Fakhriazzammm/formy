import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, history } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key not set" }, { status: 500 });
  }

  try {
    // Contoh endpoint Gemini (update sesuai dokumentasi Gemini API)
    const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          ...((history || []).map((h: string) => ({ role: "user", parts: [{ text: h }] }))),
          { role: "user", parts: [{ text: prompt }] }
        ]
      })
    });
    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "(Tidak ada balasan dari Gemini)";
    return NextResponse.json({ reply });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message || "Gemini API error" }, { status: 500 });
  }
} 