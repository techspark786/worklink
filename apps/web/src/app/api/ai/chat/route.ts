import { NextRequest, NextResponse } from 'next/server';
import { processAiMessage, handleConversationalQuery } from '@/lib/aiChatEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = body?.message;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, message: 'A valid message string is required.' },
        { status: 400 }
      );
    }

    const aiResponse = await processAiMessage(message);
    return NextResponse.json(aiResponse);
  } catch (error: any) {
    console.error('Error in /api/ai/chat route:', error);
    // Graceful fallback: never let the chat route fail with 500
    const fallback = handleConversationalQuery(
      typeof req.body === 'string' ? req.body : 'Hello'
    );
    return NextResponse.json(fallback);
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    service: 'WorkLink AI Chat Engine',
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY),
    version: '2.0.0',
  });
}
