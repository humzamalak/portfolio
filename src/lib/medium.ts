export interface MediumPostMeta {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  author?: string;
  categories?: string[];
}

export interface MediumProfile {
  username: string;
  displayName?: string;
  bio?: string;
  followers?: number;
  following?: number;
  posts?: number;
}

// Enhanced Medium RSS feed fetcher with better error handling and metadata extraction
export async function fetchMediumPosts(username: string, limit: number = 3): Promise<MediumPostMeta[]> {
  try {
    const rssUrl = `https://medium.com/feed/@${username}`;

    const res = await fetch(rssUrl, { 
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Portfolio Bot/1.0)',
      }
    });
    
    if (!res.ok) {
      console.warn(`Failed to fetch Medium RSS for @${username}: ${res.status}`);
      return [];
    }
    
    const xml = await res.text();
    
    if (!xml || xml.length === 0) {
      console.warn(`Empty RSS feed for @${username}`);
      return [];
    }

    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const posts: MediumPostMeta[] = [];

    for (const item of items.slice(0, limit)) {
      try {
        // Extract title (handle both CDATA and regular format)
        const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
        const linkMatch = item.match(/<link>(.*?)<\/link>/);
        const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
        const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/);
        const authorMatch = item.match(/<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>|<dc:creator>(.*?)<\/dc:creator>/);
        const categoryMatches = item.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>|<category>(.*?)<\/category>/g);

        const title = (titleMatch?.[1] || titleMatch?.[2] || '').trim();
        const link = (linkMatch?.[1] || '').trim();
        const pubDate = (dateMatch?.[1] || '').trim();
        const description = (descMatch?.[1] || descMatch?.[2] || '').trim();
        const author = (authorMatch?.[1] || authorMatch?.[2] || '').trim();
        
        // Extract categories
        const categories: string[] = [];
        if (categoryMatches) {
          categoryMatches.forEach(match => {
            const categoryMatch = match.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>|<category>(.*?)<\/category>/);
            const category = (categoryMatch?.[1] || categoryMatch?.[2] || '').trim();
            if (category) {
              categories.push(category);
            }
          });
        }

        if (title && link) {
          posts.push({ 
            title, 
            link, 
            pubDate,
            description: description || undefined,
            author: author || undefined,
            categories: categories.length > 0 ? categories : undefined
          });
        }
      } catch (itemError) {
        console.warn(`Error parsing Medium post item:`, itemError);
        continue;
      }
    }

    return posts;
  } catch (error) {
    console.error(`Error fetching Medium posts for @${username}:`, error);
    return [];
  }
}

// Fetch Medium profile information (basic implementation)
export async function fetchMediumProfile(username: string): Promise<MediumProfile | null> {
  try {
    const profileUrl = `https://medium.com/@${username}`;
    
    const res = await fetch(profileUrl, {
      next: { revalidate: 86400 }, // Cache for 24 hours
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Portfolio Bot/1.0)',
      }
    });
    
    if (!res.ok) {
      return null;
    }
    
    const html = await res.text();
    
    // Basic profile extraction (this is a simplified version)
    // In a real implementation, you might want to use a more robust HTML parser
    const displayNameMatch = html.match(/<title>(.*?) - Medium<\/title>/);
    const displayName = displayNameMatch?.[1]?.trim();
    
    return {
      username,
      displayName: displayName || username,
    };
  } catch (error) {
    console.error(`Error fetching Medium profile for @${username}:`, error);
    return null;
  }
}

// Get Medium profile URL
export function getMediumProfileUrl(username: string): string {
  return `https://medium.com/@${username}`;
}

// Format date for display
export function formatMediumDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

// Extract reading time estimate from description
export function extractReadingTime(description: string): string | null {
  const readingTimeMatch = description.match(/(\d+)\s*min\s*read/i);
  return readingTimeMatch ? `${readingTimeMatch[1]} min read` : null;
}


