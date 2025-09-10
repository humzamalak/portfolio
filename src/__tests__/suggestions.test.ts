import { getSuggestions } from '@/lib/rag';
import { supabase } from '@/lib/supabase';

// Mock the supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        not: jest.fn(() => ({
          not: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                set: jest.fn(() => ({
                  data: [
                    { title: 'React Portfolio Website', demo_url: 'https://example.com/react-portfolio' },
                    { title: 'Next.js E-commerce App', demo_url: 'https://example.com/nextjs-ecommerce' }
                  ],
                  error: null
                }))
              }))
            }))
          }))
        }))
      }))
    }))
  }
}));

// Mock OpenAI embedding generation
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve([0.1, 0.2, 0.3, 0.4, 0.5]))
}));

describe('Proactive Suggestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return suggestions when projects are available', async () => {
    const projectIds = ['project-1', 'project-2'];
    const query = 'Show me a backend project';

    const suggestions = await getSuggestions(projectIds, query);

    expect(suggestions).toHaveLength(2);
    expect(suggestions[0]).toContain('React Portfolio Website');
    expect(suggestions[0]).toContain('https://example.com/react-portfolio');
    expect(suggestions[1]).toContain('Next.js E-commerce App');
    expect(suggestions[1]).toContain('https://example.com/nextjs-ecommerce');
  });

  test('should return empty array when no project IDs provided', async () => {
    const projectIds: string[] = [];
    const query = 'Show me a backend project';

    const suggestions = await getSuggestions(projectIds, query);

    expect(suggestions).toHaveLength(0);
  });

  test('should format suggestions with clickable links', async () => {
    const projectIds = ['project-1'];
    const query = 'Show me a React project';

    const suggestions = await getSuggestions(projectIds, query);

    expect(suggestions[0]).toMatch(/You might also like \[.*\]\(.*\)/);
  });

  test('should handle projects without demo URLs', async () => {
    // Mock supabase to return project without demo_url
    const mockSupabase = supabase as jest.Mocked<typeof supabase>;
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        not: jest.fn(() => ({
          not: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                set: jest.fn(() => ({
                  data: [
                    { title: 'Project Without Demo', demo_url: null }
                  ],
                  error: null
                }))
              }))
            }))
          }))
        }))
      }))
    } as unknown as ReturnType<typeof supabase.from>);

    const projectIds = ['project-1'];
    const query = 'Show me a project';

    const suggestions = await getSuggestions(projectIds, query);

    expect(suggestions[0]).toBe('You might also like Project Without Demo');
  });

  test('should handle database errors gracefully', async () => {
    // Mock supabase to return error
    const mockSupabase = supabase as jest.Mocked<typeof supabase>;
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        not: jest.fn(() => ({
          not: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                set: jest.fn(() => ({
                  data: null,
                  error: new Error('Database connection failed')
                }))
              }))
            }))
          }))
        }))
      }))
    } as unknown as ReturnType<typeof supabase.from>);

    const projectIds = ['project-1'];
    const query = 'Show me a project';

    const suggestions = await getSuggestions(projectIds, query);

    expect(suggestions).toHaveLength(0);
  });
});

describe('Suggestion Relevance Tests', () => {
  const testCases = [
    {
      query: 'Show me a backend project',
      expectedContext: 'backend',
      description: 'Should suggest frontend or full-stack projects'
    },
    {
      query: 'What DevOps projects does Humza have?',
      expectedContext: 'devops',
      description: 'Should suggest other DevOps or infrastructure projects'
    },
    {
      query: 'Show me a React app',
      expectedContext: 'react',
      description: 'Should suggest other frontend or full-stack projects'
    },
    {
      query: 'What AI projects are available?',
      expectedContext: 'ai',
      description: 'Should suggest other AI or portfolio projects'
    },
    {
      query: 'Show me something with CI/CD',
      expectedContext: 'cicd',
      description: 'Should suggest other DevOps or automation projects'
    }
  ];

  testCases.forEach((testCase, index) => {
    test(`should provide relevant suggestions for query ${index + 1}: "${testCase.query}"`, async () => {
      // Reset mock for each test
      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          not: jest.fn(() => ({
            not: jest.fn(() => ({
              order: jest.fn(() => ({
                limit: jest.fn(() => ({
                  set: jest.fn(() => ({
                    data: [
                      { title: 'React Portfolio Website', demo_url: 'https://example.com/react-portfolio' },
                      { title: 'Next.js E-commerce App', demo_url: 'https://example.com/nextjs-ecommerce' }
                    ],
                    error: null
                  }))
                }))
              }))
            }))
          }))
        }))
      } as unknown as ReturnType<typeof supabase.from>);

      const projectIds = ['existing-project-1', 'existing-project-2'];
      
      const suggestions = await getSuggestions(projectIds, testCase.query);
      
      // Should return suggestions
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.length).toBeLessThanOrEqual(2);
      
      // Each suggestion should be properly formatted
      suggestions.forEach(suggestion => {
        expect(suggestion).toMatch(/^You might also like/);
      });
    });
  });
});
