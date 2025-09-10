import { SYSTEM_PROMPT } from '@/lib/prompt';

// Mock the OpenAI module to test the brand voice integration
jest.mock('@/lib/openai', () => ({
  generateChatResponse: jest.fn(),
  openai: jest.fn(),
  EMBEDDING_MODEL: 'text-embedding-3-small',
  CHAT_MODEL: 'gpt-4o',
  generateEmbedding: jest.fn(),
  generateEmbeddings: jest.fn(),
}));

// Mock the RAG module
jest.mock('@/lib/rag', () => ({
  generateRAGResponse: jest.fn(),
  retrieveProjects: jest.fn(),
  storeProjectWithEmbedding: jest.fn(),
  updateProjectWithVersioning: jest.fn(),
  rollbackProjectVersion: jest.fn(),
}));

describe('Brand Voice Integration', () => {
  test('system prompt should be imported correctly', () => {
    expect(SYSTEM_PROMPT).toBeDefined();
    expect(typeof SYSTEM_PROMPT).toBe('string');
  });

  test('system prompt should contain all required brand elements', () => {
    const prompt = SYSTEM_PROMPT.toLowerCase();
    
    // Check for key brand voice elements
    expect(prompt).toContain("humza's ai assistant");
    expect(prompt).toContain("friendly and confident");
    expect(prompt).toContain("full-stack problem-solver");
    expect(prompt).toContain("approachability");
    expect(prompt).toContain("hey there");
    
    // Check for professional elements
    expect(prompt).toContain("professionally");
    expect(prompt).toContain("grounding responses");
    expect(prompt).toContain("provided context");
  });

  test('system prompt should include example response style', () => {
    expect(SYSTEM_PROMPT).toContain("Example response style:");
    expect(SYSTEM_PROMPT).toContain("Hey there! I'm Humza's AI assistant");
    expect(SYSTEM_PROMPT).toContain("full-stack problem-solver who loves");
  });

  test('system prompt should emphasize avoiding hallucinations', () => {
    expect(SYSTEM_PROMPT).toContain("Avoid hallucinations");
    expect(SYSTEM_PROMPT).toContain("avoid making up information");
    expect(SYSTEM_PROMPT).toContain("grounding responses in provided context");
  });

  test('system prompt should be comprehensive enough for AI guidance', () => {
    // The prompt should be substantial enough to provide clear guidance
    expect(SYSTEM_PROMPT.length).toBeGreaterThan(200);
    
    // Should contain multiple sentences and guidance points
    const sentences = SYSTEM_PROMPT.split(/[.!?]+/).filter(s => s.trim().length > 0);
    expect(sentences.length).toBeGreaterThan(5);
  });
});
