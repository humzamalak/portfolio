# 08 Accessibility Compliance Task File

## Overview
Ensure the chatbot UI meets WCAG 2.1 AA standards for inclusivity.

## Phase
Phase 2

## Tasks
1. **Add Screen Reader Support**:
   - Add ARIA labels to `ChatBox` inputs and messages (`aria-label`, `aria-live`).
2. **Enable Keyboard Navigation**:
   - Ensure input, buttons, and links are focusable (`tabindex`).
3. **Implement High-Contrast Mode**:
   - Add CSS toggle for high-contrast theme (`bg-black text-white`).
   - Store preference in localStorage.

## Code Snippets
```tsx
// components/ChatBox.tsx (accessibility snippet)
<div className="flex flex-col gap-4" role="region" aria-live="polite">
  {messages.map((m) => (
    <div key={m.id} className={`p-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
      <span>{m.content}</span>
      {m.media && <img src={m.media} alt="Project screenshot" className="mt-2 max-w-full" />}
    </div>
  ))}
  <input
    type="text"
    value={input}
    onChange={handleInputChange}
    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
    className="border p-2 rounded"
    aria-label="Ask about Humza’s projects"
  />
</div>
```

## Acceptance Criteria
- Lighthouse audit scores ≥90 for WCAG 2.1 AA.
- Screen readers narrate messages and inputs correctly (test with NVDA).
- Keyboard navigation works for all UI elements.
- High-contrast mode toggles via button and persists across sessions.

## Dependencies
- Chatbox UI (`01_chatbot_ui.md`).

## Estimated Effort
- 8–10 hours (ARIA: 3h, keyboard: 3h, high-contrast: 2–4h).

## Error Handling
- Test with screen readers to avoid ARIA conflicts.
- Ensure high-contrast mode doesn’t break Tailwind styles.