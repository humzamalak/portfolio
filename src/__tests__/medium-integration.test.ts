import { 
  fetchMediumPosts, 
  fetchMediumProfile, 
  getMediumProfileUrl, 
  formatMediumDate, 
  extractReadingTime 
} from '@/lib/medium';
import { 
  MEDIUM_CONFIG, 
  getMediumProfileUrl as configGetProfileUrl,
  getMediumRssUrl,
  truncateText,
  cleanHtml,
  isValidMediumUsername,
  isValidMediumUrl 
} from '@/lib/medium-config';

// Mock fetch for testing
global.fetch = jest.fn();

describe('Medium Integration', () => {
  const mockUsername = 'humzamalak';
  const mockRssUrl = `https://medium.com/feed/@${mockUsername}`;
  const mockProfileUrl = `https://medium.com/@${mockUsername}`;

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('fetchMediumPosts', () => {
    it('should fetch and parse Medium RSS feed successfully', async () => {
      const mockXml = `
        <rss>
          <item>
            <title><![CDATA[Test Post Title]]></title>
            <link>https://medium.com/@humzamalak/test-post</link>
            <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
            <description><![CDATA[This is a test post description with 5 min read]]></description>
            <dc:creator><![CDATA[Humza Malak]]></dc:creator>
            <category><![CDATA[DevOps]]></category>
            <category><![CDATA[Cloud]]></category>
          </item>
        </rss>
      `;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockXml),
      });

      const posts = await fetchMediumPosts(mockUsername, 1);

      expect(global.fetch).toHaveBeenCalledWith(mockRssUrl, expect.objectContaining({
        next: { revalidate: 3600 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Portfolio Bot/1.0)',
        }
      }));

      expect(posts).toHaveLength(1);
      expect(posts[0]).toEqual({
        title: 'Test Post Title',
        link: 'https://medium.com/@humzamalak/test-post',
        pubDate: 'Mon, 01 Jan 2024 00:00:00 GMT',
        description: 'This is a test post description with 5 min read',
        author: 'Humza Malak',
        categories: ['DevOps', 'Cloud'],
      });
    });

    it('should handle RSS feed fetch errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const posts = await fetchMediumPosts(mockUsername);

      expect(posts).toEqual([]);
    });

    it('should handle empty RSS feed', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      });

      const posts = await fetchMediumPosts(mockUsername);

      expect(posts).toEqual([]);
    });

    it('should handle malformed RSS items gracefully', async () => {
      const mockXml = `
        <rss>
          <item>
            <title>Incomplete item</title>
            <!-- Missing link -->
          </item>
        </rss>
      `;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockXml),
      });

      const posts = await fetchMediumPosts(mockUsername);

      expect(posts).toEqual([]);
    });

    it('should respect post limit', async () => {
      const mockXml = `
        <rss>
          <item><title>Post 1</title><link>https://example.com/1</link><pubDate>2024-01-01</pubDate></item>
          <item><title>Post 2</title><link>https://example.com/2</link><pubDate>2024-01-02</pubDate></item>
          <item><title>Post 3</title><link>https://example.com/3</link><pubDate>2024-01-03</pubDate></item>
        </rss>
      `;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockXml),
      });

      const posts = await fetchMediumPosts(mockUsername, 2);

      expect(posts).toHaveLength(2);
    });
  });

  describe('fetchMediumProfile', () => {
    it('should fetch Medium profile information', async () => {
      const mockHtml = '<title>Humza Malak - Medium</title>';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      });

      const profile = await fetchMediumProfile(mockUsername);

      expect(global.fetch).toHaveBeenCalledWith(mockProfileUrl, expect.objectContaining({
        next: { revalidate: 86400 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Portfolio Bot/1.0)',
        }
      }));

      expect(profile).toEqual({
        username: mockUsername,
        displayName: 'Humza Malak',
      });
    });

    it('should handle profile fetch errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const profile = await fetchMediumProfile(mockUsername);

      expect(profile).toBeNull();
    });
  });

  describe('Utility Functions', () => {
    describe('getMediumProfileUrl', () => {
      it('should generate correct Medium profile URL', () => {
        const url = getMediumProfileUrl(mockUsername);
        expect(url).toBe(`https://medium.com/@${mockUsername}`);
      });
    });

    describe('formatMediumDate', () => {
      it('should format valid date strings', () => {
        const formatted = formatMediumDate('Mon, 01 Jan 2024 00:00:00 GMT');
        expect(formatted).toBe('Jan 1, 2024');
      });

      it('should handle invalid date strings', () => {
        const formatted = formatMediumDate('invalid-date');
        expect(formatted).toBe('Invalid Date');
      });
    });

    describe('extractReadingTime', () => {
      it('should extract reading time from description', () => {
        const description = 'This is a post description with 5 min read';
        const readingTime = extractReadingTime(description);
        expect(readingTime).toBe('5 min read');
      });

      it('should handle descriptions without reading time', () => {
        const description = 'This is a post description without reading time';
        const readingTime = extractReadingTime(description);
        expect(readingTime).toBeNull();
      });

      it('should handle case insensitive reading time', () => {
        const description = 'This is a post description with 10 MIN READ';
        const readingTime = extractReadingTime(description);
        expect(readingTime).toBe('10 min read');
      });
    });
  });

  describe('Medium Configuration', () => {
    it('should have correct configuration values', () => {
      expect(MEDIUM_CONFIG.USERNAME).toBe('humzamalak');
      expect(MEDIUM_CONFIG.PROFILE_URL).toBe('https://medium.com/@humzamalak');
      expect(MEDIUM_CONFIG.RSS_URL).toBe('https://medium.com/feed/@humzamalak');
      expect(MEDIUM_CONFIG.DISPLAY.POST_LIMIT).toBe(3);
      expect(MEDIUM_CONFIG.DISPLAY.SHOW_PROFILE).toBe(true);
    });

    describe('configGetProfileUrl', () => {
      it('should use default username from config', () => {
        const url = configGetProfileUrl();
        expect(url).toBe('https://medium.com/@humzamalak');
      });

      it('should use provided username', () => {
        const url = configGetProfileUrl('testuser');
        expect(url).toBe('https://medium.com/@testuser');
      });
    });

    describe('getMediumRssUrl', () => {
      it('should generate correct RSS URL', () => {
        const url = getMediumRssUrl();
        expect(url).toBe('https://medium.com/feed/@humzamalak');
      });
    });

    describe('truncateText', () => {
      it('should truncate long text', () => {
        const longText = 'A'.repeat(200);
        const truncated = truncateText(longText, 100);
        expect(truncated).toHaveLength(103); // 100 + '...'
        expect(truncated.endsWith('...')).toBe(true);
      });

      it('should not truncate short text', () => {
        const shortText = 'Short text';
        const truncated = truncateText(shortText, 100);
        expect(truncated).toBe('Short text');
      });
    });

    describe('cleanHtml', () => {
      it('should remove HTML tags', () => {
        const html = '<p>This is <strong>bold</strong> text</p>';
        const cleaned = cleanHtml(html);
        expect(cleaned).toBe('This is bold text');
      });

      it('should handle empty HTML', () => {
        const cleaned = cleanHtml('');
        expect(cleaned).toBe('');
      });
    });

    describe('isValidMediumUsername', () => {
      it('should validate correct usernames', () => {
        expect(isValidMediumUsername('humzamalak')).toBe(true);
        expect(isValidMediumUsername('user123')).toBe(true);
        expect(isValidMediumUsername('user-name')).toBe(true);
        expect(isValidMediumUsername('user_name')).toBe(true);
      });

      it('should reject invalid usernames', () => {
        expect(isValidMediumUsername('')).toBe(false);
        expect(isValidMediumUsername('user@domain')).toBe(false);
        expect(isValidMediumUsername('user space')).toBe(false);
        expect(isValidMediumUsername('user.name')).toBe(false);
      });
    });

    describe('isValidMediumUrl', () => {
      it('should validate Medium URLs', () => {
        expect(isValidMediumUrl('https://medium.com/@humzamalak')).toBe(true);
        expect(isValidMediumUrl('https://medium.com/@user/post')).toBe(true);
      });

      it('should reject non-Medium URLs', () => {
        expect(isValidMediumUrl('https://example.com')).toBe(false);
        expect(isValidMediumUrl('https://medium.com')).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const posts = await fetchMediumPosts(mockUsername);

      expect(posts).toEqual([]);
    });

    it('should handle timeout errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Timeout'));

      const posts = await fetchMediumPosts(mockUsername);

      expect(posts).toEqual([]);
    });
  });

  describe('Integration Tests', () => {
    it('should work with real Medium RSS feed structure', async () => {
      const mockXml = `
        <rss version="2.0">
          <channel>
            <title>Humza Malak - Medium</title>
            <item>
              <title><![CDATA[Building Scalable DevOps Pipelines]]></title>
              <link>https://medium.com/@humzamalak/building-scalable-devops-pipelines</link>
              <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
              <description><![CDATA[Learn how to build scalable DevOps pipelines that can handle enterprise workloads. This comprehensive guide covers CI/CD, automation, and monitoring. 8 min read]]></description>
              <dc:creator><![CDATA[Humza Malak]]></dc:creator>
              <category><![CDATA[DevOps]]></category>
              <category><![CDATA[CI/CD]]></category>
              <category><![CDATA[Automation]]></category>
            </item>
          </channel>
        </rss>
      `;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockXml),
      });

      const posts = await fetchMediumPosts(mockUsername, 1);

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Building Scalable DevOps Pipelines');
      expect(posts[0].categories).toEqual(['DevOps', 'CI/CD', 'Automation']);
      
      const readingTime = extractReadingTime(posts[0].description || '');
      expect(readingTime).toBe('8 min read');
    });
  });
});
