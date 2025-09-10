import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { openai } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage?.content) {
      return new Response('No message content provided', { status: 400 });
    }

    const query = lastMessage.content.toLowerCase().trim();

    // Handle overview command
    if (query === 'overview') {
      return new Response('overview', { status: 200 });
    }

    // TODO: Implement RAG pipeline
    // For now, provide intelligent responses based on common queries
    let context = '';
    
    if (query.includes('backend') || query.includes('server')) {
      context = `Humza has extensive backend experience with Node.js, Express, PostgreSQL, Supabase, and serverless architectures. His notable backend projects include API development, database design, and cloud deployment.`;
    } else if (query.includes('frontend') || query.includes('react')) {
      context = `Humza specializes in modern frontend development using React, Next.js, TypeScript, and TailwindCSS. He builds responsive, accessible web applications with excellent user experience.`;
    } else if (query.includes('skill') || query.includes('technolog')) {
      context = `Humza's key skills include: Frontend (React, Next.js, TypeScript, TailwindCSS), Backend (Node.js, Express, PostgreSQL, Supabase), AI/ML (OpenAI, ElevenLabs), DevOps (Netlify, CI/CD), and Testing (Jest, Cypress).`;
    } else if (query.includes('project')) {
      context = `Humza has built several impressive projects including this AI-powered portfolio assistant, responsive web applications, and full-stack solutions. Each project demonstrates his ability to solve real-world problems with modern technology.`;
    } else {
      context = `Humza is a full-stack developer with expertise in React, Node.js, AI integration, and modern web technologies. He builds scalable applications and has experience with both frontend and backend development.`;
    }

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: `You are Humza's AI assistant. You help recruiters and visitors learn about Humza's skills, projects, and experience. Be helpful, professional, and concise. Use the provided context to answer questions accurately.`
        },
        ...messages,
        {
          role: 'system',
          content: `Context about Humza: ${context}`
        }
      ],
      maxTokens: 500,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}