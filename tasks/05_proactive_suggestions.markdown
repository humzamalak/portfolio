# 05 Proactive Suggestions Task File

## Overview
Add proactive project suggestions to enhance portfolio discoverability for recruiters.

## Phase
Phase 2

## Tasks
1. **Implement Suggestion Logic**:
   - In `/api/chat`, retrieve 1–2 related projects based on skill/project type using vector similarity.
   - Append suggestions to response: “You might also like [project title]: [link].”
2. **Test Relevance**:
   - Create test script with 5 queries (e.g., “Show me a backend project”).
   - Verify suggestions match context (e.g., frontend project after backend).

## Code Snippets
```ts
// pages/api/chat.ts (suggestion snippet)
async function getSuggestions(projectIds: string[]) {
  const { data: suggestions } = await supabase
    .from('projects')
    .select('title, demo_url')
    .not('id', 'in', `(${projectIds.join(',')})`)
    .orderBy('embedding <-> :last_project_embedding', { ascending: true })
    .limit(2);
  return suggestions.map(s => `You might also like ${s.title}: ${s.demo_url}`);
}
```

## Acceptance Criteria
- Suggestions append to each response with 1–2 relevant projects.
- ≥90% of suggestions match query context (verified via test script).
- Suggestions include clickable links in chatbot UI.

## Dependencies
- RAG Knowledge Base (`02_rag_knowledge_base.md`) for retrieval.
- Chatbot UI (`01_chatbot_ui.md`) for display.

## Estimated Effort
- 6–8 hours (logic: 4h, testing: 2–4h).

## Error Handling
- If no suggestions found, skip appending to avoid empty responses.