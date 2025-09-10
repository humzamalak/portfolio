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

    // Placeholder data for now
    const projects = [
      {
        id: '1',
        title: 'Portfolio Website',
        description: 'A modern, responsive portfolio built with Next.js, TypeScript, and TailwindCSS',
        demo_url: 'https://humzamalak.dev',
        image_url: null,
      },
      {
        id: '2',
        title: 'AI Assistant (This Project)',
        description: 'An AI-powered chatbot for portfolio interaction using OpenAI and Supabase',
        demo_url: null,
        image_url: null,
      },
      // TODO: Add more projects from actual database
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