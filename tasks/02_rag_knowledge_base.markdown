# 02 RAG Knowledge Base Task File

## Overview
Implement the Retrieval-Augmented Generation (RAG) system with text and image embeddings to ensure accurate, grounded responses about Humza’s projects.

## Phase
Phase 1 (text embeddings), Phase 3 (multimodal)

## Tasks
1. **Configure Supabase pgvector**:
   - Create a Supabase project and enable pgvector extension.
   - Create a `projects` table: columns for `id`, `title`, `description`, `demo_url`, `image_url`, `embedding` (vector).
   - Create a `versions` table: columns for `project_id`, `version_id`, `embedding`, `created_at`.
2. **Integrate Text Embeddings**:
   - Use OpenAI `text-embedding-3-small` to embed `description` field.
   - Store embeddings in `projects.embedding` using Supabase client.
3. **Implement Versioning**:
   - On project update, generate new `version_id` and store in `versions`.
   - Create `/api/rollback` endpoint to revert to previous embedding.
4. **Define Retrieval Logic**:
   - Create `/api/chat` endpoint to embed query and retrieve top-3 chunks using cosine similarity.
   - Phase 3: Use CLIP for image embeddings; prioritize demos for functionality queries (e.g., “Show me a working app”) and images for design queries.
5. **Handle Ambiguous Queries**:
   - For queries with <80% confidence, return: “I couldn’t find an exact match. Here’s a related project or try the portfolio index: [link].”

## Code Snippets
```ts
// pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body;
  const { data: embedding } = await openai.createEmbedding({
    model: 'text-embedding-3-small',
    input: query,
  });
  const { data: chunks } = await supabase
    .from('projects')
    .select('id, title, description, demo_url, image_url')
    .orderBy('embedding <-> :query_embedding', { ascending: true })
    .limit(3)
    .set('query_embedding', embedding.data[0].embedding);
  if (chunks.length === 0 || chunks[0].score < 0.8) {
    return res.status(200).json({ message: 'No exact match. Try the portfolio index: /portfolio', media: null });
  }
  const response = await openai.createChatCompletion({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are Humza’s AI assistant...' },
      { role: 'user', content: `Query: ${query}\nContext: ${JSON.stringify(chunks)}` },
    ],
  });
  res.status(200).json({ message: response.data.choices[0].message.content, media: chunks[0].image_url || chunks[0].demo_url });
}
```

## Acceptance Criteria
- Supabase stores project data and text embeddings (Phase 1).
- Queries retrieve top-3 chunks with ≥95% accuracy (verified with 10 test queries).
- Versioning stores new embeddings; rollback endpoint reverts to prior version.
- Phase 3: Demos/images retrieved based on query intent (e.g., demo for “working app”).
- Ambiguous queries trigger fallback response with portfolio link.

## Dependencies
- Supabase account and OpenAI API key.
- Chatbot UI (`01_chatbot_ui.md`) for response display.
- Analytics (`03_analytics.md`) for logging retrieval metadata.

## Estimated Effort
- Phase 1: 15–18 hours (Supabase: 4h, embeddings: 6h, retrieval: 5h).
- Phase 3: 10–12 hours (image embeddings: 5h, demo logic: 5h).

## Error Handling
- Handle API rate limits by retrying with exponential backoff.
- Log Supabase errors and fallback to default response if retrieval fails.