import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// TODO: Create projects table schema
// CREATE TABLE projects (
//   id SERIAL PRIMARY KEY,
//   title VARCHAR(255) NOT NULL,
//   description TEXT,
//   demo_url VARCHAR(500),
//   image_url VARCHAR(500),
//   embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimensions
//   created_at TIMESTAMP DEFAULT NOW(),
//   updated_at TIMESTAMP DEFAULT NOW()
// );

// TODO: Create queries table schema for analytics
// CREATE TABLE queries (
//   id SERIAL PRIMARY KEY,
//   query_text TEXT NOT NULL,
//   embedding VECTOR(1536),
//   project_ids INTEGER[],
//   cta_clicked BOOLEAN DEFAULT FALSE,
//   session_id VARCHAR(255),
//   timestamp TIMESTAMP DEFAULT NOW()
// );

// TODO: Create indexes for better performance
// CREATE INDEX ON projects USING ivfflat (embedding vector_cosine_ops);
// CREATE INDEX ON queries USING ivfflat (embedding vector_cosine_ops);
// CREATE INDEX ON queries (timestamp);
// CREATE INDEX ON queries (session_id);
