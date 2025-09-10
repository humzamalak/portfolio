import { 
  storeQueryEmbedding, 
  boostRetrieval, 
  retrieveProjects,
  generateRAGResponse 
} from '@/lib/rag';
import { supabase } from '@/lib/supabase';

// Mock the OpenAI functions
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2, 0.3, 0.4, 0.5]),
  generateChatResponse: jest.fn().mockResolvedValue('Mock response')
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        // Mock successful insert
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          not: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn().mockResolvedValue({
                data: [
                  { embedding: [0.1, 0.2, 0.3, 0.4, 0.5] },
                  { embedding: [0.2, 0.3, 0.4, 0.5, 0.6] }
                ],
                error: null
              })
            }))
          }))
        }))
      })),
      order: jest.fn(() => ({
        limit: jest.fn().mockResolvedValue({
          data: [
            {
              id: '1',
              title: 'Test Project',
              description: 'A test project',
              demo_url: 'https://example.com',
              image_url: 'https://example.com/image.jpg',
              embedding: [0.1, 0.2, 0.3, 0.4, 0.5]
            }
          ],
          error: null
        })
      }))
    }))
  }
}));

describe('Memory System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storeQueryEmbedding', () => {
    it('should store query embedding successfully', async () => {
      const mockInsert = jest.fn().mockResolvedValue({ data: null, error: null });
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert
      });

      await storeQueryEmbedding(
        'test query',
        [0.1, 0.2, 0.3, 0.4, 0.5],
        'session_123',
        ['project_1', 'project_2'],
        'portfolio'
      );

      expect(mockInsert).toHaveBeenCalledWith({
        query_text: 'test query',
        embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
        session_id: 'session_123',
        project_ids: ['project_1', 'project_2'],
        cta_clicked: 'portfolio',
        timestamp: expect.any(String)
      });
    });

    it('should handle Supabase errors gracefully', async () => {
      const mockInsert = jest.fn().mockRejectedValue(new Error('Database error'));
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert
      });

      // Should not throw
      await expect(storeQueryEmbedding(
        'test query',
        [0.1, 0.2, 0.3, 0.4, 0.5],
        'session_123'
      )).resolves.not.toThrow();
    });
  });

  describe('boostRetrieval', () => {
    it('should return original embedding when no session ID provided', async () => {
      const result = await boostRetrieval([0.1, 0.2, 0.3, 0.4, 0.5], '');
      expect(result).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
    });

    it('should return original embedding when no past queries found', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: [],
        error: null
      });
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            not: jest.fn(() => ({
              order: jest.fn(() => ({
                limit: mockSelect
              }))
            }))
          }))
        }))
      });

      const result = await boostRetrieval([0.1, 0.2, 0.3, 0.4, 0.5], 'session_123');
      expect(result).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
    });

    it('should average embeddings when past queries exist', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: [
          { embedding: [0.2, 0.3, 0.4, 0.5, 0.6] },
          { embedding: [0.3, 0.4, 0.5, 0.6, 0.7] }
        ],
        error: null
      });
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            not: jest.fn(() => ({
              order: jest.fn(() => ({
                limit: mockSelect
              }))
            }))
          }))
        }))
      });

      const result = await boostRetrieval([0.1, 0.2, 0.3, 0.4, 0.5], 'session_123');
      
      // Should average: [0.1,0.2,0.3,0.4,0.5] + [0.2,0.3,0.4,0.5,0.6] + [0.3,0.4,0.5,0.6,0.7]
      // Average: [0.2, 0.3, 0.4, 0.5, 0.6] (with floating point precision)
      expect(result[0]).toBeCloseTo(0.2, 5);
      expect(result[1]).toBeCloseTo(0.3, 5);
      expect(result[2]).toBeCloseTo(0.4, 5);
      expect(result[3]).toBeCloseTo(0.5, 5);
      expect(result[4]).toBeCloseTo(0.6, 5);
    });

    it('should handle Supabase errors gracefully', async () => {
      const mockSelect = jest.fn().mockRejectedValue(new Error('Database error'));
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            not: jest.fn(() => ({
              order: jest.fn(() => ({
                limit: mockSelect
              }))
            }))
          }))
        }))
      });

      const result = await boostRetrieval([0.1, 0.2, 0.3, 0.4, 0.5], 'session_123');
      expect(result).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
    });
  });

  describe('retrieveProjects with memory', () => {
    it('should use boosted embedding when session ID provided', async () => {
      const mockOrder = jest.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Test Project',
            description: 'A test project',
            demo_url: 'https://example.com',
            image_url: 'https://example.com/image.jpg',
            embedding: [0.1, 0.2, 0.3, 0.4, 0.5]
          }
        ],
        error: null
      });
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          not: jest.fn(() => ({
            order: mockOrder
          }))
        }))
      });

      const result = await retrieveProjects('test query', 3, 'session_123');
      
      expect(result.projects).toHaveLength(1);
      expect(result.projects[0].title).toBe('Test Project');
      expect(mockOrder).toHaveBeenCalled();
    });
  });

  describe('generateRAGResponse with memory', () => {
    it('should store query embedding and use memory boost', async () => {
      const mockInsert = jest.fn().mockResolvedValue({ data: null, error: null });
      const mockOrder = jest.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Test Project',
            description: 'A test project',
            demo_url: 'https://example.com',
            image_url: 'https://example.com/image.jpg',
            embedding: [0.1, 0.2, 0.3, 0.4, 0.5]
          }
        ],
        error: null
      });

      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'queries') {
          return { insert: mockInsert };
        }
        return {
          select: jest.fn(() => ({
            not: jest.fn(() => ({
              order: mockOrder
            }))
          }))
        };
      });

      const result = await generateRAGResponse(
        'test query',
        [{ role: 'user', content: 'test query' }],
        'session_123'
      );

      expect(result.message).toBe('Mock response');
      expect(mockInsert).toHaveBeenCalled();
      expect(mockOrder).toHaveBeenCalled();
    });
  });
});
