import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // TODO: Retrieve all projects from Supabase
    // const { data: projects, error } = await supabase
    //   .from('projects')
    //   .select('id, title, description, demo_url, image_url')
    //   .order('created_at', { ascending: false });

    // if (error) {
    //   console.error('Supabase error:', error);
    //   return NextResponse.json({ error: 'Failed to retrieve projects' }, { status: 500 });
    // }

    // Placeholder data for now - will be replaced with Supabase data
    const projects = [
      {
        id: '1',
        title: 'Portfolio Website',
        description: 'A modern, responsive portfolio built with Next.js, TypeScript, and TailwindCSS. Features dark mode, smooth animations, and mobile-first design.',
        demo_url: 'https://humzamalak.dev',
        image_url: null,
      },
      {
        id: '2',
        title: 'AI Assistant (This Project)',
        description: 'An AI-powered chatbot for portfolio interaction using OpenAI GPT-4, Vercel AI SDK, and streaming responses. Enables recruiters to explore projects dynamically.',
        demo_url: null,
        image_url: null,
      },
      {
        id: '3',
        title: 'Full-Stack E-commerce Platform',
        description: 'Complete e-commerce solution with React frontend, Node.js backend, PostgreSQL database, and Stripe payment integration.',
        demo_url: 'https://demo-ecommerce.humzamalak.dev',
        image_url: null,
      },
      {
        id: '4',
        title: 'Real-time Chat Application',
        description: 'WebSocket-based chat app with React, Socket.io, and Redis for real-time messaging and user presence.',
        demo_url: 'https://demo-chat.humzamalak.dev',
        image_url: null,
      },
      {
        id: '5',
        title: 'AI Content Generator',
        description: 'Full-stack application using OpenAI API for content generation, ElevenLabs for voice synthesis, and DALL-E for image creation.',
        demo_url: 'https://demo-ai-content.humzamalak.dev',
        image_url: null,
      },
      {
        id: '6',
        title: 'Task Management Dashboard',
        description: 'Project management tool with drag-and-drop functionality, team collaboration features, and real-time updates using Supabase.',
        demo_url: 'https://demo-tasks.humzamalak.dev',
        image_url: null,
      },
    ];

    return NextResponse.json({ 
      projects,
      total: projects.length,
      message: `Here are all ${projects.length} of Humza's projects:`
    });

  } catch (error) {
    console.error('Overview API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}