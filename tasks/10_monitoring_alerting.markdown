# 10 Monitoring & Alerting Task File

## Overview
Set up monitoring to ensure assistant accuracy and performance, with alerts for drift or latency issues.

## Phase
Phase 4

## Tasks
1. **Create Golden Test Set**:
   - Define 10–15 queries in `tests/golden.json` (e.g., “Show me a project with AWS”, “What’s Humza’s experience with APIs?”).
2. **Schedule Tests**:
   - Set up Vercel cron job to run nightly tests against `/api/chat`.
   - Compare responses to expected project IDs.
3. **Configure Alerts**:
   - Use Supabase functions to trigger alerts (via email/Slack) for <90% accuracy or >5s latency.

## Code Snippets
```ts
// tests/run-golden.ts
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

async function runGoldenTests() {
  const goldenTests = require('./golden.json');
  let accuracy = 0;
  for (const { query, expectedProjectId } of goldenTests) {
    const start = Date.now();
    const { data } = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ query }) });
    const latency = Date.now() - start;
    const response = await data.json();
    if (response.projectId === expectedProjectId) accuracy++;
    if (latency > 5000) await supabase.from('alerts').insert({ type: 'latency', value: latency });
  }
  if (accuracy / goldenTests.length < 0.9) {
    await supabase.from('alerts').insert({ type: 'accuracy', value: accuracy / goldenTests.length });
  }
}
```

## Acceptance Criteria
- Golden test set includes 10–15 recruiter-like queries.
- Nightly tests achieve ≥95% accuracy (matching expected project IDs).
- Alerts trigger for <90% accuracy or >5s latency (verified via logs).

## Dependencies
- RAG Knowledge Base (`02_rag_knowledge_base.md`) for testing.
- Supabase (`03_analytics.md`) for alert storage.

## Estimated Effort
- 8–10 hours (test set: 3h, cron job: 3h, alerts: 2–4h).

## Error Handling
- Log test failures with query details for debugging.
- Handle cron job failures by retrying once.