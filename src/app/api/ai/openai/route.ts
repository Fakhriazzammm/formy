import { StreamingTextResponse } from 'ai';

// Konfigurasi Gemini API
export async function POST(req: Request) {
  // Ekstrak pesan dari request
  const { messages } = await req.json();

  // Pastikan API key tersedia
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Gemini API key not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Konversi format pesan untuk Gemini API
    const geminiMessages = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Buat permintaan ke Gemini API dengan streaming
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiMessages,
          streamingOptions: { streamEvents: true }
        }),
      }
    );

    // Kembalikan streaming response
    return new StreamingTextResponse(response.body!);
  } catch (error) {
    console.error('Gemini API error:', error);
    return new Response(JSON.stringify({ error: 'Error calling Gemini API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}