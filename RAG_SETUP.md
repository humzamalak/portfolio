# RAG Knowledge Base Setup Guide

This guide explains how to set up and use the Retrieval-Augmented Generation (RAG) system for the AI Assistant.

## Overview

The RAG system provides accurate, grounded responses about Humza's projects by:
- Storing project descriptions as vector embeddings in Supabase
- Retrieving relevant projects based on query similarity
- Generating contextual responses using OpenAI GPT-4o
- Handling ambiguous queries with fallback responses
- Supporting project versioning and rollback functionality

## Database Setup

### 1. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Enable the pgvector extension in your Supabase SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Create Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Projects table with vector embeddings
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  demo_url TEXT,
  image_url TEXT,
  embedding vector(1536), -- OpenAI text-embedding-3-small dimensions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Versions table for project versioning
CREATE TABLE versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  version_id TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queries table for analytics logging
CREATE TABLE queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query_text TEXT NOT NULL,
  embedding vector(1536),
  project_ids UUID[],
  cta_clicked BOOLEAN DEFAULT FALSE,
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for vector similarity search
CREATE INDEX ON projects USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON versions USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON queries USING ivfflat (embedding vector_cosine_ops);
```

### 3. Environment Variables

Add these to your `.env.local` file:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

## API Endpoints

### 1. Chat Endpoint (`/api/chat`)

**POST** `/api/chat`

Handles chat queries with RAG-powered responses.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Tell me about Humza's DevOps projects"
    }
  ],
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "message": "Humza has several impressive DevOps projects...",
  "media": "https://github.com/humzamalak/project-demo",
  "projects": [
    {
      "id": "uuid",
      "title": "Project Title",
      "description": "Project description",
      "demo_url": "https://github.com/...",
      "image_url": "https://..."
    }
  ]
}
```

### 2. Seed Projects (`/api/seed-projects`)

**POST** `/api/seed-projects`

Populates the database with project data and generates embeddings.

**Response:**
```json
{
  "success": true,
  "message": "Successfully seeded 6 projects with embeddings"
}
```

### 3. Rollback (`/api/rollback`)

**POST** `/api/rollback`

Reverts a project to a previous version.

**Request Body:**
```json
{
  "projectId": "project-uuid",
  "versionId": "version-identifier"
}
```

**Response:**
```json
{
  "success": true,
  "project": { /* updated project data */ },
  "message": "Successfully rolled back project to version v1.0"
}
```

## Usage Examples

### 1. Initial Setup

```bash
# 1. Set up environment variables
cp env.example .env.local
# Edit .env.local with your actual values

# 2. Seed the database
curl -X POST http://localhost:3000/api/seed-projects

# 3. Test the chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What DevOps projects has Humza built?"
      }
    ]
  }'
```

### 2. Adding New Projects

```typescript
import { storeProjectWithEmbedding } from '@/lib/rag';

const newProject = {
  title: "New Project",
  description: "Project description...",
  demo_url: "https://github.com/...",
  image_url: "https://..."
};

await storeProjectWithEmbedding(newProject);
```

### 3. Updating Projects with Versioning

```typescript
import { updateProjectWithVersioning } from '@/lib/rag';

await updateProjectWithVersioning(
  'project-uuid',
  { description: 'Updated description...' },
  'v2.0'
);
```

## Key Features

### 1. Vector Similarity Search

- Uses cosine similarity to find relevant projects
- Retrieves top 3 most similar projects
- Confidence threshold of 0.8 for exact matches

### 2. Ambiguous Query Handling

- Queries with <80% confidence trigger fallback responses
- Provides portfolio link for manual browsing
- Shows related projects even for low-confidence matches

### 3. Project Versioning

- Automatically creates versions when projects are updated
- Stores previous embeddings for rollback capability
- Supports semantic versioning (v1.0, v2.0, etc.)

### 4. Analytics Logging

- Logs all queries with embeddings
- Tracks project IDs returned
- Records session information for analysis

## Performance Considerations

### 1. Embedding Generation

- Uses OpenAI's `text-embedding-3-small` model (1536 dimensions)
- Batch processing available for multiple texts
- Caching recommended for production

### 2. Vector Search

- IVFFlat index for fast similarity search
- Cosine distance for relevance scoring
- Configurable result limits

### 3. Error Handling

- Graceful fallbacks for API failures
- Retry logic with exponential backoff
- Comprehensive error logging

## Testing

### 1. Unit Tests

```bash
npm run test
```

### 2. Integration Tests

```bash
# Test RAG functionality
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Show me projects with CI/CD"
      }
    ]
  }'
```

### 3. Confidence Testing

Test queries with different confidence levels:
- High confidence: "DevOps pipeline projects"
- Medium confidence: "automation tools"
- Low confidence: "random query"

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify SUPABASE_URL and SUPABASE_KEY
   - Check network connectivity

2. **OpenAI API Error**
   - Verify OPENAI_API_KEY
   - Check API rate limits

3. **Vector Search Not Working**
   - Ensure pgvector extension is enabled
   - Verify indexes are created
   - Check embedding dimensions (1536)

4. **Low Confidence Results**
   - Review project descriptions
   - Consider adding more descriptive text
   - Adjust confidence threshold if needed

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Future Enhancements

### Phase 3: Multimodal Support

- Image embeddings using CLIP
- Demo prioritization for functionality queries
- Image prioritization for design queries

### Additional Features

- Real-time project updates
- Advanced analytics dashboard
- A/B testing for response quality
- Multi-language support

## Security Considerations

- API rate limiting
- Input validation and sanitization
- Secure embedding storage
- Access control for admin endpoints

## Monitoring

- Query performance metrics
- Embedding generation costs
- User engagement tracking
- Error rate monitoring
