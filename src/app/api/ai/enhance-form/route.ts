import { NextRequest, NextResponse } from 'next/server';

// Simpan import OpenAI untuk penggunaan di masa depan
// import { OpenAI } from 'openai';
// import { ChatCompletionMessageParam } from 'openai/resources/chat';

// Function to enhance existing form components using Gemini
async function enhanceFormComponents(components: Record<string, unknown>[], model: string) {
  const systemPrompt = `You are an AI assistant specialized in improving form components.
  Enhance the provided form components by:
  1. Improving labels and placeholders for clarity
  2. Adding helpful validation messages
  3. Adding appropriate help text where missing
  4. Ensuring logical grouping and order
  5. Suggesting better options for select/radio/checkbox components
  
  Keep the same component IDs and types, but enhance their properties.
  Return ONLY a valid JSON array of the enhanced components without any explanation or markdown.`;

  // Default ke Gemini
  return await enhanceWithGemini(components, systemPrompt);
}

// Function to enhance components using Gemini
async function enhanceWithGemini(components: Record<string, unknown>[], systemPrompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Gemini API key not set');
    return components; // Return original components if API key is missing
  }

  try {
    // Contoh endpoint Gemini (update sesuai dokumentasi Gemini API)
    const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nHere are the components to enhance: ${JSON.stringify(components)}` }] }
        ]
      })
    });
    
    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
    try {
      const enhancedComponents = JSON.parse(reply);
      
      // Ensure we preserve the original IDs
      return enhancedComponents.map((enhancedComp: Record<string, unknown>, index: number) => {
        if (index < components.length) {
          return {
            ...enhancedComp,
            id: components[index].id // Preserve the original ID
          };
        }
        return enhancedComp;
      });
    } catch (parseError) {
      console.error('Error parsing Gemini response as JSON:', parseError);
      return components; // Return original components on error
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return components; // Return original components on error
  }
}

// Simpan fungsi OpenAI dan Anthropic untuk penggunaan di masa depan
// async function enhanceWithOpenAI(components: Record<string, unknown>[], systemPrompt: string) {...}
// async function enhanceWithAnthropic(components: Record<string, unknown>[], systemPrompt: string) {...}

export async function POST(request: NextRequest) {
  try {
    const { components, model = 'gemini' } = await request.json();

    if (!components || !Array.isArray(components) || components.length === 0) {
      return NextResponse.json({ error: 'Valid components array is required' }, { status: 400 });
    }

    const enhancedComponents = await enhanceFormComponents(components, model);
    return NextResponse.json(enhancedComponents);
  } catch (error) {
    console.error('Error in enhance-form API:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}