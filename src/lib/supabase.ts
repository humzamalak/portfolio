import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Database schema for AI Assistant
// Run these SQL commands in your Supabase SQL editor:

// 1. Enable pgvector extension:
// CREATE EXTENSION IF NOT EXISTS vector;

// 2. Create projects table with pgvector support:
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

// 3. Create versions table for project versioning:
// CREATE TABLE versions (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
//   version_id TEXT NOT NULL,
//   embedding vector(1536),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// 4. Create queries table for analytics logging and memory:
// CREATE TABLE queries (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   query_text TEXT NOT NULL,
//   embedding vector(1536),
//   project_ids UUID[],
//   cta_clicked TEXT, -- Store which CTA was clicked (e.g., 'portfolio', 'contact', 'demo')
//   session_id TEXT,
//   timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// 5. Create indexes for vector similarity search:
// CREATE INDEX ON projects USING ivfflat (embedding vector_cosine_ops);
// CREATE INDEX ON versions USING ivfflat (embedding vector_cosine_ops);
// CREATE INDEX ON queries USING ivfflat (embedding vector_cosine_ops);

// 6. Create rate_limits table for cost management:
// CREATE TABLE rate_limits (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   ip TEXT NOT NULL,
//   count INTEGER DEFAULT 1,
//   timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// 7. Create query_cache table for caching frequent queries:
// CREATE TABLE query_cache (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   query_hash TEXT UNIQUE NOT NULL,
//   query TEXT NOT NULL,
//   response TEXT NOT NULL,
//   confidence REAL NOT NULL,
//   model_used TEXT NOT NULL,
//   timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// 8. Create indexes for cost management tables:
// CREATE INDEX ON rate_limits (ip, timestamp);
// CREATE INDEX ON query_cache (query_hash);
// CREATE INDEX ON query_cache (timestamp);

// 9. Create test_results table for monitoring:
// CREATE TABLE test_results (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   query_id TEXT NOT NULL,
//   query_text TEXT NOT NULL,
//   success BOOLEAN NOT NULL,
//   latency_ms INTEGER NOT NULL,
//   accuracy REAL NOT NULL,
//   expected_project_ids TEXT[],
//   actual_project_ids TEXT[],
//   response_data JSONB,
//   error_message TEXT,
//   timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// 10. Create alerts table for monitoring:
// CREATE TABLE alerts (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   type TEXT NOT NULL, -- 'accuracy', 'latency', 'test_failures'
//   severity TEXT NOT NULL, -- 'low', 'medium', 'high'
//   message TEXT NOT NULL,
//   value REAL,
//   timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// 11. Create indexes for monitoring tables:
// CREATE INDEX ON test_results (timestamp);
// CREATE INDEX ON test_results (query_id);
// CREATE INDEX ON test_results (success);
// CREATE INDEX ON alerts (timestamp);
// CREATE INDEX ON alerts (severity);
// CREATE INDEX ON alerts (type);

// Types for TypeScript
export interface Project {
  id: string;
  title: string;
  description: string;
  demo_url?: string;
  image_url?: string;
  embedding?: number[];
  created_at: string;
  updated_at: string;
}

export interface ProjectVersion {
  id: string;
  project_id: string;
  version_id: string;
  embedding?: number[];
  created_at: string;
}

export interface QueryLog {
  id: string;
  query_text: string;
  embedding?: number[];
  project_ids: string[];
  cta_clicked?: string;
  session_id?: string;
  timestamp: string;
}

export interface RateLimit {
  id: string;
  ip: string;
  count: number;
  timestamp: string;
  created_at: string;
}

export interface QueryCache {
  id: string;
  query_hash: string;
  query: string;
  response: string;
  confidence: number;
  model_used: string;
  timestamp: string;
  created_at: string;
}

export interface TestResult {
  id: string;
  query_id: string;
  query_text: string;
  success: boolean;
  latency_ms: number;
  accuracy: number;
  expected_project_ids: string[];
  actual_project_ids: string[];
  response_data: any;
  error_message?: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  value?: number;
  timestamp: string;
}