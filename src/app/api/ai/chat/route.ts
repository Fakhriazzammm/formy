import { NextRequest, NextResponse } from 'next/server';
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

/**
 * Konversi pesan dari format Vercel AI SDK ke format LangChain
 */
const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

/**
 * Handler untuk endpoint chat AI
 */
export async function POST(req: NextRequest) {
  try {
    // Ambil pesan dari request body
    const { messages } = await req.json();
    
    // Validasi input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    // Ambil API key dari environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Inisialisasi model LLM
    const llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      streaming: true,
    });

    // Pisahkan pesan terakhir dari riwayat chat
    const currentMessage = messages[messages.length - 1];
    const currentMessageContent = currentMessage.content;

    // Format pesan sebelumnya untuk konteks
    const formattedPreviousMessages = messages
      .slice(0, -1)
      .map(formatMessage)
      .join('\n');

    // Buat template prompt untuk AI
    const prompt = PromptTemplate.fromTemplate(`
      Kamu adalah asisten AI yang membantu membuat formulir.
      
      Riwayat percakapan:
      {chat_history}
      
      Pertanyaan pengguna: {question}
      
      Berikan respons yang membantu dan relevan untuk membuat formulir yang diminta.
    `);

    // Buat chain untuk pemrosesan
    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(llm).pipe(outputParser);

    // Jalankan chain dengan streaming
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages,
      question: currentMessageContent,
    });

    // Kembalikan respons streaming
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}