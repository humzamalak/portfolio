# 09 Flagship Project Task File

## Overview
Showcase the AI assistant as a flagship project on Humza’s portfolio to highlight technical and product skills.

## Phase
Phase 4

## Tasks
1. **Create Portfolio Page**:
   - Add `/portfolio/assistant` page in Next.js with description, tech stack (React, Supabase, GPT-4o), and PRD link.
2. **Embed Demo**:
   - Record 30-second screencast of assistant answering a query (e.g., “Show me a React project”).
   - Host on YouTube and embed via `<iframe>`.
3. **Highlight Metrics**:
   - Display PRD metrics (e.g., ≥3 queries/session, ≥95% accuracy) in a table.

## Code Snippets
```tsx
// pages/portfolio/assistant.tsx
export default function AssistantPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1>Portfolio AI Assistant</h1>
      <p>Built with React, Supabase, and GPT-4o, this assistant showcases Humza’s full-stack and product skills.</p>
      <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Assistant Demo" className="w-full h-64" />
      <table className="table-auto">
        <thead>
          <tr><th>Metric</th><th>Target</th></tr>
        </thead>
        <tbody>
          <tr><td>Queries per Session</td><td>≥3</td></tr>
          <tr><td>Accuracy</td><td>≥95%</td></tr>
        </tbody>
      </table>
    </div>
  );
}
```

## Acceptance Criteria
- `/portfolio/assistant` page is live with description and tech stack.
- Screencast shows a sample conversation and is embedded correctly.
- Metrics table matches PRD targets (≥3 queries, ≥95% accuracy).

## Dependencies
- Chatbot UI (`01_chatbot_ui.md`) for demo.
- Analytics (`03_analytics.md`) for metrics.

## Estimated Effort
- 6–8 hours (page: 3h, screencast: 2h, metrics: 1–3h).

## Error Handling
- Ensure YouTube iframe loads; fallback to static image if unavailable.