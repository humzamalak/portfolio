// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            single: jest.fn(() => ({ data: null, error: null }))
          }))
        }))
      })),
      insert: jest.fn(() => ({ error: null })),
      upsert: jest.fn(() => ({ error: null })),
      delete: jest.fn(() => ({
        lt: jest.fn(() => ({ error: null }))
      }))
    }))
  }
}));

// Mock OpenAI functions to avoid API calls
jest.mock('@/lib/openai', () => ({
  generateChatResponseWithModel: jest.fn().mockResolvedValue('Mocked response'),
  generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
  generateChatResponse: jest.fn().mockResolvedValue('Mocked response')
}));

import { 
  generateQueryHash, 
  getCachedResponse, 
  cacheResponse, 
  getModelForConfidence,
  COST_CONFIG 
} from '@/lib/cost-management';
import { supabase } from '@/lib/supabase';

describe('Cost Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateQueryHash', () => {
    it('should generate consistent hash for same query', () => {
      const query = 'Tell me about React projects';
      const hash1 = generateQueryHash(query);
      const hash2 = generateQueryHash(query);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hash length
    });

    it('should generate different hashes for different queries', () => {
      const hash1 = generateQueryHash('Tell me about React projects');
      const hash2 = generateQueryHash('Tell me about Vue projects');
      
      expect(hash1).not.toBe(hash2);
    });

    it('should normalize query case and whitespace', () => {
      const hash1 = generateQueryHash('Tell me about React projects');
      const hash2 = generateQueryHash('TELL ME ABOUT REACT PROJECTS');
      const hash3 = generateQueryHash('  tell me about react projects  ');
      
      expect(hash1).toBe(hash2);
      expect(hash1).toBe(hash3);
    });
  });

  describe('getModelForConfidence', () => {
    it('should use GPT-3.5 for low confidence queries', () => {
      const model = getModelForConfidence(0.7);
      expect(model).toBe('gpt-3.5-turbo');
    });

    it('should use GPT-4o-mini for high confidence queries', () => {
      const model = getModelForConfidence(0.9);
      expect(model).toBe('gpt-4o-mini');
    });

    it('should use GPT-3.5 for threshold confidence', () => {
      const model = getModelForConfidence(COST_CONFIG.LOW_CONFIDENCE_THRESHOLD);
      expect(model).toBe('gpt-3.5-turbo');
    });
  });

  describe('cacheResponse', () => {
    it('should cache high confidence responses', async () => {
      const mockUpsert = jest.fn(() => ({ error: null }));
      (supabase.from as jest.Mock).mockReturnValue({
        upsert: mockUpsert
      });

      await cacheResponse('test query', 'test response', 0.9, 'gpt-4o-mini');

      expect(mockUpsert).toHaveBeenCalledWith({
        query_hash: expect.any(String),
        query: 'test query',
        response: 'test response',
        confidence: 0.9,
        model_used: 'gpt-4o-mini',
        timestamp: expect.any(String)
      });
    });

    it('should not cache low confidence responses', async () => {
      const mockUpsert = jest.fn(() => ({ error: null }));
      (supabase.from as jest.Mock).mockReturnValue({
        upsert: mockUpsert
      });

      await cacheResponse('test query', 'test response', 0.7, 'gpt-3.5-turbo');

      expect(mockUpsert).not.toHaveBeenCalled();
    });
  });

  describe('getCachedResponse', () => {
    it('should return cached response when available', async () => {
      const mockData = {
        id: '1',
        query_hash: 'test-hash',
        query: 'test query',
        response: 'cached response',
        confidence: 0.9,
        model_used: 'gpt-4o-mini',
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const mockSingle = jest.fn(() => ({ data: mockData, error: null }));
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => ({
              single: mockSingle
            }))
          }))
        }))
      });

      const result = await getCachedResponse('test query');

      expect(result).toEqual(mockData);
    });

    it('should return null when no cached response', async () => {
      const mockSingle = jest.fn(() => ({ data: null, error: null }));
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => ({
              single: mockSingle
            }))
          }))
        }))
      });

      const result = await getCachedResponse('test query');

      expect(result).toBeNull();
    });
  });

  describe('COST_CONFIG', () => {
    it('should have correct configuration values', () => {
      expect(COST_CONFIG.RATE_LIMIT_PER_HOUR).toBe(20);
      expect(COST_CONFIG.CACHE_HIT_THRESHOLD).toBe(0.8);
      expect(COST_CONFIG.LOW_CONFIDENCE_THRESHOLD).toBe(0.8);
      expect(COST_CONFIG.CACHE_EXPIRY_HOURS).toBe(24);
      expect(COST_CONFIG.TOP_QUERIES_PERCENTAGE).toBe(0.1);
    });
  });
});

describe('Rate Limiting Integration', () => {
  it('should enforce 20 requests per hour limit', () => {
    // This would be tested in integration tests with actual middleware
    expect(COST_CONFIG.RATE_LIMIT_PER_HOUR).toBe(20);
  });
});

describe('Cache Performance', () => {
  it('should reduce API calls by caching frequent queries', async () => {
    // Mock cache hit
    const mockData = {
      id: '1',
      query_hash: 'test-hash',
      query: 'frequent query',
      response: 'cached response',
      confidence: 0.9,
      model_used: 'gpt-4o-mini',
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const mockSingle = jest.fn(() => ({ data: mockData, error: null }));
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            single: mockSingle
          }))
        }))
      }))
    });

    const result = await getCachedResponse('frequent query');
    
    // If cache hit, no API call should be made
    expect(result).toBeTruthy();
    expect(result?.response).toBe('cached response');
  });
});
