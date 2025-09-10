import { SYSTEM_PROMPT } from '@/lib/prompt';

describe('Brand Voice System Prompt', () => {
  test('should contain key brand voice elements', () => {
    expect(SYSTEM_PROMPT).toContain("Humza's AI assistant");
    expect(SYSTEM_PROMPT).toContain("friendly and confident");
    expect(SYSTEM_PROMPT).toContain("full-stack problem-solver");
    expect(SYSTEM_PROMPT).toContain("approachability");
    expect(SYSTEM_PROMPT).toContain("Hey there!");
  });

  test('should emphasize grounding responses in context', () => {
    expect(SYSTEM_PROMPT).toContain("grounding responses");
    expect(SYSTEM_PROMPT).toContain("provided context");
    expect(SYSTEM_PROMPT).toContain("avoid making up information");
  });

  test('should include example response style', () => {
    expect(SYSTEM_PROMPT).toContain("Example response style:");
    expect(SYSTEM_PROMPT).toContain("Hey there! I'm Humza's AI assistant");
  });

  test('should be properly formatted as a string', () => {
    expect(typeof SYSTEM_PROMPT).toBe('string');
    expect(SYSTEM_PROMPT.length).toBeGreaterThan(100);
  });
});
