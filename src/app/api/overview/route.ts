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
    //   throw error;
    // }

    // Placeholder response with sample project data
    const placeholderProjects = [
      {
        id: 1,
        title: 'AI-Powered Portfolio Assistant',
        description: 'An intelligent chatbot that helps visitors explore Humza\'s projects and skills using RAG and GPT-4o.',
        demo_url: '/assistant',
        image_url: '/og-image.jpg',
      },
      {
        id: 2,
        title: 'Full-Stack E-commerce Platform',
        description: 'A complete e-commerce solution built with React, Node.js, and PostgreSQL.',
        demo_url: 'https://example.com',
        image_url: '/og-image.jpg',
      },
      {
        id: 3,
        title: 'Real-time Chat Application',
        description: 'A scalable chat application with WebSocket support and message persistence.',
        demo_url: 'https://example.com',
        image_url: '/og-image.jpg',
      },
    ];

    return NextResponse.json({
      projects: placeholderProjects,
      message: 'Here are all of Humza\'s projects. Click on any project to learn more!',
    });

  } catch (error) {
    console.error('Overview API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve projects overview' },
      { status: 500 }
    );
  }
}
