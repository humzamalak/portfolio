# 07 Cost Management Task File

## Overview
Implement cost controls to ensure the assistant is sustainable for Humza’s portfolio.

## Phase
Phase 2

## Tasks
1. **Set Up Rate Limiting**:
   - Use Next.js middleware to limit queries to 20 per IP/hour.
   - Store IP counts in Supabase `rate_limits` table.
2. **Cache Frequent Queries**:
   - Cache top 10% of queries in Supabase `query_cache` table (`query`, `response`, `timestamp`).
   - Check cache before calling OpenAI API.
3. **Configure Fallback Model**:
   - Use GPT-3.5 for queries with <80% retrieval confidence.

## Code Snippets
```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
export async function middleware(req: NextRequest) {
  const ip = req.ip || 'unknown';
  const { data } = await supabase
    .from('rate_limits')
    .select('count')
    .eq('ip', ip)
    .gte('timestamp', new Date(Date.now() - 3600000).toISOString());
  if (data && data[0].count >= 20) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  await supabase.from('rate_limits').insert({ ip, count: 1, timestamp: new Date().toISOString() });
  return NextResponse.next();
}
```

## Acceptance Criteria
- Queries limited to 20/IP/hour; excess returns 429 error.
- Cache reduces API calls by ≥20% (verified via logs).
- GPT-3.5 used for low-confidence queries without accuracy loss.

## Dependencies
- Next.js API routes (`02_rag_knowledge_base.md`).
- Supabase for caching and rate limiting.

## Estimated Effort
- 8–10 hours (rate limiting: 3h, caching: 3h, fallback: 2–4h).

## Error Handling
- Handle cache misses by proceeding to API call.
- Log rate limit violations for monitoring.