import { NextRequest, NextResponse } from 'next/server';
import { StreamingTextResponse, LangChainStream } from 'ai';
import { FormComponent } from '@/stores/useFormStore';

// Simpan import OpenAI untuk penggunaan di masa depan
// import { OpenAI } from 'openai';
// import { ChatCompletionMessageParam } from 'openai/resources/chat';
// import { ChatOpenAI } from '@langchain/openai';

// Fungsi untuk generate form components menggunakan Gemini
async function generateFormComponents(prompt: string, currentComponents: FormComponent[], streaming: boolean) {
  const systemPrompt = `You are an AI assistant specialized in creating form components based on user requirements.
  Generate JSON for form components based on the user's description.
  Each component should have these properties:
  - type: The component type (text, email, number, textarea, select, radio, checkbox, heading, paragraph, divider)
  - id: A unique string ID
  - properties: An object containing component-specific properties like label, placeholder, helpText, required, etc.
  
  Current form components: ${JSON.stringify(currentComponents)}
  
  Return ONLY a valid JSON array of components without any explanation or markdown.`;

  // Gunakan Gemini API untuk streaming dan non-streaming
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key not set" }, { status: 500 });
  }

  try {
    if (streaming) {
      // Implementasi streaming untuk Gemini
      // Catatan: Implementasi streaming akan bergantung pada dukungan Gemini API
      // Ini adalah implementasi placeholder
      const { stream, handlers } = LangChainStream();
      
      // Panggil Gemini API dengan streaming
      fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=" + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\nUser: ${prompt}` }] }
          ],
          streamingOptions: { streamEvents: true }
        })
      }).then(async (response) => {
        if (!response.body) {
          handlers.error(new Error("Response body is null"));
          return;
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            handlers.token(chunk);
          }
          handlers.done();
        } catch (e) {
          handlers.error(e as Error);
        }
      }).catch(handlers.error);
      
      return new StreamingTextResponse(stream);
    } else {
      // Non-streaming response menggunakan Gemini
      const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\nUser: ${prompt}` }] }
          ]
        })
      });
      
      const data = await geminiRes.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      
      try {
        // Mencoba parse hasil sebagai JSON
        return NextResponse.json(JSON.parse(reply));
      } catch (parseError) {
        console.error('Error parsing Gemini response as JSON:', parseError);
        return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 422 });
      }
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// Function to handle requests for Google Gemini model (sudah ada sebelumnya)
async function handleGeminiRequest(prompt: string, currentComponents: FormComponent[]) {
  // This is a placeholder for Gemini integration
  // In a real implementation, you would use the Gemini API here
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
          { role: "user", parts: [{ text: `Generate form components based on this description: ${prompt}. Current components: ${JSON.stringify(currentComponents)}` }] }
        ]
      })
    });
    
    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
    try {
      // Mencoba parse hasil sebagai JSON
      const parsedComponents = JSON.parse(reply);
      return NextResponse.json(parsedComponents);
    } catch (parseError) {
      console.error('Error parsing Gemini response as JSON:', parseError);
      // Fallback jika parsing gagal
      return NextResponse.json([{
        type: 'heading',
        id: 'gemini-placeholder',
        properties: {
          text: 'Gemini response could not be parsed as components',
          level: 'h2'
        }
      }]);
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json([{
      type: 'heading',
      id: 'gemini-error',
      properties: {
        text: 'Error connecting to Gemini API',
        level: 'h2'
      }
    }]);
  }
}

// Simpan fungsi OpenAI dan Anthropic untuk penggunaan di masa depan
// async function handleOpenAIRequest(prompt: string, currentComponents: FormComponent[], streaming: boolean) {...}
// async function handleAnthropicRequest(prompt: string, currentComponents: FormComponent[]) {...}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'gemini', streaming = false, currentComponents = [] } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Route to the appropriate model handler
    switch (model) {
      case 'gemini':
      default: // Default ke Gemini
        return generateFormComponents(prompt, currentComponents, streaming);
      // Simpan case untuk OpenAI dan Anthropic untuk penggunaan di masa depan
      // case 'openai':
      //   return handleOpenAIRequest(prompt, currentComponents, streaming);
      // case 'anthropic':
      //   return handleAnthropicRequest(prompt, currentComponents);
    }
  } catch (error) {
    console.error('Error in form assistant API:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}