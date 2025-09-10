# 01 Chatbot UI Task File

## Overview
Implement a React-based chatbot UI for Humza’s Portfolio AI Assistant using TailwindCSS and Vercel AI SDK. This is the core user-facing component for the MVP, enabling recruiters to interact with the assistant.

## Phase
Phase 1 (MVP)

## Tasks
1. **Set Up Next.js Project**:
   - Run `npx create-next-app@latest humza-portfolio --typescript --tailwind --eslint`.
   - Install Vercel AI SDK: `npm install ai`.
   - Configure TailwindCSS with custom theme (primary: #2563eb, secondary: #1f2937).
2. **Create Chatbox Component**:
   - Build a `ChatBox` React component in `components/ChatBox.tsx`.
   - Use Vercel AI SDK to stream responses from `/api/chat` endpoint.
   - Render messages in a scrollable div with Tailwind classes (`flex flex-col gap-4`).
   - Support inline media: display images via `<img>` and demo links via `<a>`.
3. **Add Welcome Message**:
   - On component mount, display: “Hi, I’m Humza’s AI assistant! Ask about his projects or type ‘overview’ for a tour.”
   - Show 3 sample queries as buttons: “What’s Humza’s best backend project?”, “Show me a React app”, “What skills does Humza have?”.
   - Use Tailwind for styling (`bg-blue-600 text-white p-2 rounded`).
4. **Implement Overview Command**:
   - Handle “overview” input by calling `/api/overview` endpoint.
   - Display project list in a grid (`grid grid-cols-1 md:grid-cols-2 gap-4`).

## Code Snippets
```tsx
// components/ChatBox.tsx
import { useState } from 'react';
import { useChat } from 'ai/react';

export default function ChatBox() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });
  const [welcomeShown, setWelcomeShown] = useState(true);

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto p-4">
      {welcomeShown && (
        <div className="bg-gray-100 p-4 rounded">
          <p>Hi, I’m Humza’s AI assistant! Ask about his projects or type ‘overview’ for a tour.</p>
          <div className="flex gap-2 mt-2">
            {['What’s Humza’s best backend project?', 'Show me a React app', 'What skills does Humza have?'].map((q) => (
              <button key={q} className="bg-blue-600 text-white p-2 rounded" onClick={() => handleSubmit({ target: { value: q } })}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className={`p-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            {m.content}
            {m.media && <img src={m.media} alt="Project screenshot" className="mt-2 max-w-full" />}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
        className="border p-2 rounded"
        placeholder="Ask about Humza’s projects..."
      />
    </div>
  );
}
```

## Acceptance Criteria
- Chatbox renders with Tailwind styling, responsive on mobile/desktop.
- Welcome message displays on load with 3 clickable sample queries.
- User queries stream responses with text and media (images/links).
- “overview” command returns a grid of all projects with titles and links.
- No UI glitches (e.g., scroll issues, misaligned media).

## Dependencies
- `/api/chat` and `/api/overview` endpoints (from `02_rag_knowledge_base.md`).
- Supabase for project data (`02_rag_knowledge_base.md`).
- Basic query logging (`03_analytics.md`).

## Estimated Effort
- 12–15 hours (setup: 3h, chatbox: 6h, welcome message: 3h, overview: 3h).

## Error Handling
- Handle API errors by displaying: “Sorry, something went wrong. Try again or check the portfolio index.”
- Sanitize user input to prevent XSS (use `DOMPurify`).