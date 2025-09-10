import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Database schema for AI Assistant
// TODO: Create projects table with pgvector support:
// CREATE TABLE projects (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   title TEXT NOT NULL,
//   description TEXT NOT NULL,
//   demo_url TEXT,
//   image_url TEXT,
//   embedding vector(1536), -- OpenAI text-embedding-3-small dimensions
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// TODO: Create queries table for analytics logging:
// CREATE TABLE queries (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   query_text TEXT NOT NULL,
//   embedding vector(1536),
//   project_ids UUID[],
//   cta_clicked BOOLEAN DEFAULT FALSE,
//   session_id TEXT,
//   timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// TODO: Enable pgvector extension:
// CREATE EXTENSION IF NOT EXISTS vector;

// TODO: Create indexes for vector similarity search:
// CREATE INDEX ON projects USING ivfflat (embedding vector_cosine_ops);
// CREATE INDEX ON queries USING ivfflat (embedding vector_cosine_ops);