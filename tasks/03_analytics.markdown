# 03 Analytics Task File

## Overview
Build an analytics pipeline to log recruiter interactions and generate insights for portfolio optimization.

## Phase
Phase 1 (basic logging), Phase 3 (reports, gap detection)

## Tasks
1. **Set Up Logging**:
   - Create a `queries` table in Supabase: columns for `id`, `query_text`, `embedding`, `project_ids`, `cta_clicked`, `session_id`, `timestamp`.
   - Log queries and CTA clicks in `/api/chat` and `/api/overview`.
2. **Create Dashboards**:
   - Set up Metabase with Supabase connection.
   - Create dashboards for: top projects mentioned, avg session duration, CTA click rates.
3. **Implement Gap Detection**:
   - Flag queries with <80% retrieval confidence (from `/api/chat`).
   - Generate weekly report of top 5 unanswered skills/topics.
4. **Export Reports**:
   - Create `/api/analytics/export` endpoint using `pdfkit` to generate PDF reports.

## Code Snippets
```ts
// pages/api/chat.ts (logging snippet)
async function logQuery(query: string, projectIds: string[], ctaClicked: string | null, sessionId: string) {
  const { data: embedding } = await openai.createEmbedding({
    model: 'text-embedding-3-small',
    input: query,
  });
  await supabase.from('queries').insert({
    query_text: query,
    embedding: embedding.data[0].embedding,
    project_ids: projectIds,
    cta_clicked: ctaClicked,
    session_id: sessionId,
    timestamp: new Date().toISOString(),
  });
}
```

## Acceptance Criteria
- Queries and CTAs logged in Supabase with session ID (Phase 1).
- Metabase dashboards display top 5 projects, session duration, and click rates.
- Weekly gap report lists top 5 unanswered queries with <80% confidence (Phase 3).
- PDF export includes project mentions and gap insights, downloadable via `/api/analytics/export`.

## Dependencies
- Supabase (`02_rag_knowledge_base.md`).
- Chatbot UI (`01_chatbot_ui.md`) for CTA tracking.
- OpenAI API for query embeddings.

## Estimated Effort
- Phase 1: 8–10 hours (logging: 5h, dashboards: 3h).
- Phase 3: 8–10 hours (gap detection: 4h, PDF export: 4h).

## Error Handling
- Handle Supabase insert failures by logging to console and retrying once.
- Ensure session IDs are anonymized to comply with GDPR/CCPA.