// Mock Supabase to avoid environment variable requirements in tests
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(),
      select: jest.fn(),
      gte: jest.fn(),
      not: jest.fn(),
      eq: jest.fn(),
      or: jest.fn(),
      order: jest.fn(),
      limit: jest.fn(),
      single: jest.fn()
    }))
  }
}));

// Mock OpenAI to avoid API calls in tests
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2, 0.3])
}));

import { generateSessionId, extractCommonTerms, generateRecommendations } from '@/lib/analytics';

describe('Analytics Module', () => {
  describe('generateSessionId', () => {
    it('should generate unique session IDs', () => {
      const sessionId1 = generateSessionId();
      const sessionId2 = generateSessionId();
      
      expect(sessionId1).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(sessionId2).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(sessionId1).not.toBe(sessionId2);
    });
  });

  describe('extractCommonTerms', () => {
    it('should extract common terms from queries', () => {
      const queries = [
        'react frontend development',
        'react components and hooks',
        'frontend javascript framework',
        'backend api development',
        'backend database queries'
      ];
      
      const terms = extractCommonTerms(queries);
      
      expect(terms).toContain('react');
      expect(terms).toContain('frontend');
      expect(terms).toContain('backend');
      expect(terms).toContain('development');
    });

    it('should filter out short words', () => {
      const queries = ['a the react app'];
      const terms = extractCommonTerms(queries);
      
      expect(terms).toContain('react');
      expect(terms).not.toContain('a');
      expect(terms).not.toContain('the');
    });
  });

  describe('generateRecommendations', () => {
    it('should generate recommendations for React/frontend gaps', () => {
      const terms = ['react', 'frontend', 'components'];
      const recommendations = generateRecommendations(terms);
      
      expect(recommendations).toContain('Add more React/frontend projects to portfolio');
    });

    it('should generate recommendations for backend gaps', () => {
      const terms = ['backend', 'api', 'server'];
      const recommendations = generateRecommendations(terms);
      
      expect(recommendations).toContain('Include more backend/API development examples');
    });

    it('should generate default recommendation for unknown terms', () => {
      const terms = ['unknown', 'random'];
      const recommendations = generateRecommendations(terms);
      
      expect(recommendations).toContain('Review portfolio content based on common query patterns');
    });
  });
});
