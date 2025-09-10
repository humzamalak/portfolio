import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const query = lastMessage?.content || '';

    // TODO: Embed query using OpenAI text-embedding-3-small
    // const embedding = await openai.embeddings.create({
    //   model: 'text-embedding-3-small',
    //   input: query,
    // });

    // TODO: Retrieve relevant projects from Supabase using pgvector
    // const { data: projects } = await supabase
    //   .from('projects')
    //   .select('*')
    //   .limit(5);

    // TODO: Call GPT-4o with retrieved context
    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-4o',
    //   messages: [
    //     {
    //       role: 'system',
    //       content: 'You are Humza\'s AI assistant. Help users learn about his projects and skills.',
    //     },
    //     ...messages,
    //   ],
    // });

    // TODO: Log query to analytics table
    // await supabase.from('queries').insert({
    //   query_text: query,
    //   session_id: req.headers.get('x-session-id') || 'anonymous',
    //   timestamp: new Date().toISOString(),
    // });

    // Placeholder response
    return NextResponse.json({
      message: `I received your query: "${query}". This is a placeholder response. The AI assistant will be fully implemented with RAG and GPT-4o integration.`,
      media: null,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
