import { generateEmbedding, generateChatResponse } from '@/lib/openai';
import { retrieveProjects, generateRAGResponse } from '@/lib/rag';

// Mock Supabase with proper chain methods
const mockSupabaseChain = {
  data: [
    {
      id: '1',
      title: 'Test Project',
      description: 'A test DevOps project',
      demo_url: 'https://github.com/test',
      image_url: null,
      embedding: [0.1, 0.2, 0.3]
    }
  ],
  error: null
};

const mockSupabaseChainLowConfidence = {
  data: [
    {
      id: '1',
      title: 'Unrelated Project',
      description: 'Not related to query',
      demo_url: 'https://github.com/test',
      image_url: null,
      embedding: [0.9, 0.8, 0.7] // Low similarity
    }
  ],
  error: null
};

const mockSupabaseChainEmpty = {
  data: [],
  error: null
};

const mockSupabaseChainError = {
  data: null,
  error: new Error('Supabase error')
};

// Mock the dependencies
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        not: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              set: jest.fn(() => mockSupabaseChain)
            }))
          }))
        }))
      })),
      insert: jest.fn(() => ({
        data: { id: '1' },
        error: null
      }))
    }))
  }
}));

jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
  generateChatResponse: jest.fn().mockResolvedValue('Test response'),
  openai: jest.fn()
}));

describe('RAG System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateEmbedding', () => {
    it('should generate embedding for text', async () => {
      const text = 'Test query';
      const embedding = await generateEmbedding(text);
      
      expect(embedding).toEqual([0.1, 0.2, 0.3]);
    });

    it('should handle errors gracefully', async () => {
      (generateEmbedding as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
      
      await expect(generateEmbedding('test')).rejects.toThrow('API Error');
    });
  });

  describe('retrieveProjects', () => {
    it('should retrieve projects based on query', async () => {
      const result = await retrieveProjects('DevOps projects');
      
      expect(result.projects).toHaveLength(1);
      expect(result.projects[0].title).toBe('Test Project');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.context).toContain('Test Project');
    });

    it('should handle empty results', async () => {
      // Mock empty results
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          not: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                set: jest.fn(() => mockSupabaseChainEmpty)
              }))
            }))
          }))
        }))
      });

      const result = await retrieveProjects('Non-existent query');
      
      expect(result.projects).toHaveLength(0);
      expect(result.confidence).toBe(0);
      expect(result.context).toBe('');
    });
  });

  describe('generateRAGResponse', () => {
    it('should generate response with high confidence', async () => {
      // Mock high confidence result (same embedding = high similarity)
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          not: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                set: jest.fn(() => ({
                  data: [
                    {
                      id: '1',
                      title: 'Test Project',
                      description: 'A test DevOps project',
                      demo_url: 'https://github.com/test',
                      image_url: null,
                      embedding: [0.1, 0.2, 0.3] // Same as query embedding = high confidence
                    }
                  ],
                  error: null
                }))
              }))
            }))
          }))
        }))
      });

      const messages = [
        { role: 'user' as const, content: 'Tell me about DevOps projects' }
      ];

      const result = await generateRAGResponse('DevOps projects', messages);
      
      expect(result.message).toBe('Test response');
      expect(result.projects).toHaveLength(1);
    });

    it('should handle low confidence queries', async () => {
      // Mock low confidence result with very different embedding
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          not: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                set: jest.fn(() => ({
                  data: [
                    {
                      id: '1',
                      title: 'Unrelated Project',
                      description: 'Not related to query',
                      demo_url: 'https://github.com/test',
                      image_url: null,
                      embedding: [1.0, 0.0, 0.0] // Very different from [0.1, 0.2, 0.3] = low confidence
                    }
                  ],
                  error: null
                }))
              }))
            }))
          }))
        }))
      });

      const messages = [
        { role: 'user' as const, content: 'Random query' }
      ];

      const result = await generateRAGResponse('Random query', messages);
      
      expect(result.message).toContain("couldn't find an exact match");
      expect(result.message).toContain('Portfolio');
    });
  });

  describe('Error Handling', () => {
    it('should handle Supabase errors', async () => {
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          not: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                set: jest.fn(() => mockSupabaseChainError)
              }))
            }))
          }))
        }))
      });

      const result = await retrieveProjects('test query');
      
      expect(result.projects).toHaveLength(0);
      expect(result.confidence).toBe(0);
    });

    it('should handle OpenAI errors gracefully', async () => {
      // Mock the embedding generation to fail
      (generateEmbedding as jest.Mock).mockRejectedValueOnce(new Error('OpenAI API Error'));
      
      const messages = [
        { role: 'user' as const, content: 'Test query' }
      ];

      const result = await generateRAGResponse('test query', messages);
      
      // When embedding fails, it should return empty projects and fallback message
      expect(result.projects).toHaveLength(0);
      expect(result.message).toContain("couldn't find an exact match");
    });
  });
});
