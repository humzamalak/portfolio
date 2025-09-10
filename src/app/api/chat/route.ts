import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { openai } from '@/lib/openai';
import { generateRAGResponse } from '@/lib/rag';
import { logQueryWithAnalytics } from '@/lib/analytics';
import { SYSTEM_PROMPT } from '@/lib/prompt';

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId, ctaClicked } = await req.json();
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage?.content) {
      return new Response('No message content provided', { status: 400 });
    }

    const query = lastMessage.content.toLowerCase().trim();

    // Handle overview command
    if (query === 'overview') {
      // Log overview command
      await logQueryWithAnalytics(query, [], sessionId, ctaClicked);
      return new Response('overview', { status: 200 });
    }

    // Use RAG system to generate response
    const ragResponse = await generateRAGResponse(query, messages, sessionId);

    // Log the query with analytics data
    const projectIds = ragResponse.projects?.map(p => p.id) || [];
    await logQueryWithAnalytics(query, projectIds, sessionId, ctaClicked);

    // If we have a specific response from RAG, return it
    if (ragResponse.message) {
      return new Response(JSON.stringify({
        message: ragResponse.message,
        media: ragResponse.media,
        projects: ragResponse.projects,
        suggestions: ragResponse.suggestions
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fallback to streaming response for general queries
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        ...messages
      ],
      maxTokens: 500,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}