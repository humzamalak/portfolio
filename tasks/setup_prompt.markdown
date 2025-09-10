# Prompt for Creating Skeleton for Humza’s Portfolio AI Assistant

## Objective
Generate a project skeleton for Humza’s Portfolio AI Assistant in a new Git branch off the master branch in an existing Next.js portfolio repository. The skeleton should support the MVP (Phase 1) requirements: a React-based chatbot UI with TailwindCSS and Vercel AI SDK, a text-based RAG system using Supabase pgvector and OpenAI embeddings, and basic analytics logging. The setup should be minimal, with placeholder files and configurations to align with the PRD and task files (`01_chatbot_ui.md`, `02_rag_knowledge_base.md`, `03_analytics.md`).

## Instructions for Cursor

1. **Repository Setup**:
   - Assume the portfolio repository is a Next.js project located at `~/portfolio`.
   - Create a new Git branch named `ai-assistant` off the master branch:
     ```bash
     cd ~/portfolio
     git checkout master
     git branch ai-assistant
     git checkout ai-assistant
     ```
   - Ensure the branch is clean and ready for new files.

2. **Project Structure**:
   - Use the existing Next.js project structure (`app` directory for App Router).
   - Create the following files and directories:
     - `app/api/chat/route.ts`: API route for handling chat queries.
     - `app/api/overview/route.ts`: API route for the “overview” command.
     - `components/ChatBox.tsx`: React component for the chatbot UI.
     - `lib/supabase.ts`: Supabase client initialization.
     - `lib/openai.ts`: OpenAI client initialization.
     - `.env.local`: Environment variables for Supabase and OpenAI.
     - `pages/portfolio/assistant.tsx`: Page to showcase the assistant (placeholder for Phase 4).
     - `tests/golden.json`: Placeholder for golden test queries (Phase 4).
     - `tailwind.config.js`: Update with custom theme.
     - `package.json`: Add required dependencies.

3. **Dependencies**:
   - Install dependencies in `package.json`:
     ```bash
     npm install ai @supabase/supabase-js openai @types/node typescript
     ```
   - Update `tailwind.config.js` with:
     ```js
     module.exports = {
       content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
       theme: {
         extend: {
           colors: {
             primary: '#2563eb',
             secondary: '#1f2937',
           },
         },
       },
       plugins: [],
     };
     ```

4. **Environment Variables**:
   - Create `.env.local` with:
     ```env
     SUPABASE_URL=your-supabase-url
     SUPABASE_KEY=your-supabase-anon-key
     OPENAI_API_KEY=your-openai-api-key
     ```

5. **Chatbot UI Skeleton** (`components/ChatBox.tsx`):
   - Create a React component with TailwindCSS for a chat interface.
   - Include a welcome message and sample query buttons.
   - Use Vercel AI SDK’s `useChat` hook for streaming responses.
   - Placeholder for media display (images, demo links).

6. **API Routes**:
   - `app/api/chat/route.ts`: Placeholder for query embedding, RAG retrieval, and GPT-4o response.
   - `app/api/overview/route.ts`: Placeholder for listing all projects.

7. **Supabase Setup** (`lib/supabase.ts`):
   - Initialize Supabase client with pgvector support.
   - Create a `projects` table schema (placeholder).

8. **OpenAI Setup** (`lib/openai.ts`):
   - Initialize OpenAI client for `text-embedding-3-small` and `gpt-4o`.

9. **Analytics Logging**:
   - Add a `queries` table schema in `lib/supabase.ts` (placeholder for logging).

10. **Constraints**:
    - Keep the skeleton minimal; only include placeholders for non-MVP features (e.g., monitoring, flagship project).
    - Ensure compatibility with Next.js App Router (no `pages` directory except for `/portfolio/assistant`).
    - Use TypeScript for all files.
    - Avoid generating full implementations; provide stubs with TODO comments.
    - Ensure no external dependencies beyond those listed (e.g., no Prisma, no MongoDB).

## Expected Output
- A new `ai-assistant` branch with the above files.
- `package.json` updated with dependencies.
- `.env.local` template with placeholder variables.
- `components/ChatBox.tsx` with a basic UI structure.
- `app/api/chat/route.ts` and `app/api/overview/route.ts` with stubs.
- `lib/supabase.ts` and `lib/openai.ts` with client initialization.
- `pages/portfolio/assistant.tsx` and `tests/golden.json` as placeholders.

## Example File Content

### `components/ChatBox.tsx`
```tsx
import { useChat } from 'ai/react';

export default function ChatBox() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({ api: '/api/chat' });

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto p-4">
      <div className="bg-gray-100 p-4 rounded">
        <p>Hi, I’m Humza’s AI assistant! Ask about his projects or type ‘overview’ for a tour.</p>
        <div className="flex gap-2 mt-2">
          <button className="bg-blue-600 text-white p-2 rounded">What’s Humza’s best backend project?</button>
          {/* TODO: Add more sample query buttons */}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className={`p-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            {m.content}
            {/* TODO: Add media display for images/demo links */}
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

### `app/api/chat/route.ts`
```ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  // TODO: Embed query, retrieve from Supabase, call GPT-4o
  return NextResponse.json({ message: 'Placeholder response', media: null });
}
```

### `lib/supabase.ts`
```ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// TODO: Create projects table: id, title, description, demo_url, image_url, embedding
// TODO: Create queries table: id, query_text, embedding, project_ids, cta_clicked, session_id, timestamp
```

### `.env.local`
```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

## Acceptance Criteria
- `ai-assistant` branch is created and checked out.
- All specified files exist with correct structure and TypeScript.
- Dependencies are installed and listed in `package.json`.
- TailwindCSS is configured with custom theme.
- `.env.local` includes required variables.
- `ChatBox.tsx` renders a basic UI with welcome message and input.
- API routes return placeholder responses.
- Supabase and OpenAI clients initialize without errors.

## Notes
- Commit changes with: `git add . && git commit -m "Initial skeleton for AI assistant"`.
- Push to remote: `git push origin ai-assistant`.
- Test setup by running `npm run dev` and verifying UI at `localhost:3000`.