# 06 Memory Task File

## Overview
Implement short- and long-term memory to personalize recruiter interactions.

## Phase
Phase 2

## Tasks
1. **Short-Term Memory**:
   - Store session context in React state (`useChat` from Vercel AI SDK).
   - Pass last 3 messages to `/api/chat` as context.
2. **Long-Term Memory**:
   - Store anonymized query embeddings in `queries` table (`timestamp`, `embedding`, `session_id`).
   - Retrieve similar past queries to boost retrieval.
3. **Retrieval Boost**:
   - Use past query embeddings to weight current query retrieval.

## Code Snippets
```ts
// pages/api/chat.ts (memory snippet)
async function boostRetrieval(queryEmbedding: number[], sessionId: string) {
  const { data: pastQueries } = await supabase
    .from('queries')
    .select('embedding')
    .eq('session_id', sessionId)
    .orderBy('timestamp', { ascending: false })
    .limit(5);
  const weightedEmbedding = averageEmbeddings([queryEmbedding, ...pastQueries.map(q => q.embedding)]);
  return weightedEmbedding;
}
```

## Acceptance Criteria
- Session context persists for multi-turn conversations (3 messages).
- Anonymized query embeddings stored/retrieved for repeat sessions.
- Retrieval accuracy improves by ≥5% for repeat visitors (test with 5 sessions).

## Dependencies
- Supabase (`02_rag_knowledge_base.md`).
- Chatbot UI (`01_chatbot_ui.md`) for session state.

## Estimated Effort
- 10–12 hours (short-term: 3h, long-term: 4h, retrieval boost: 3–5h).

## Error Handling
- If session ID is missing, treat as new session.
- Handle Supabase query failures by falling back to current query embedding.