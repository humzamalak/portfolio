import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogPostMeta } from '@/types/blog';

const blogDirectory = path.join(process.cwd(), 'src/content/blog');

export function getAllBlogPosts(): BlogPostMeta[] {
  try {
    if (!fs.existsSync(blogDirectory)) {
      console.warn('Blog directory does not exist:', blogDirectory);
      return [];
    }

    const fileNames = fs.readdirSync(blogDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        try {
          const slug = fileName.replace(/\.mdx$/, '');
          const fullPath = path.join(blogDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContents);

          return {
            slug,
            title: data.title || 'Untitled',
            excerpt: data.excerpt || 'No excerpt available',
            date: data.date || new Date().toISOString(),
            tags: data.tags || [],
            readingTime: data.readingTime || 5,
            thumbnail: data.thumbnail,
            author: data.author,
          };
        } catch (error) {
          console.error(`Error processing blog post ${fileName}:`, error);
          return null;
        }
      })
      .filter((post): post is NonNullable<typeof post> => post !== null);

    // Sort posts by date
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error reading blog directory:', error);
    return [];
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || 'No excerpt available',
      content,
      date: data.date || new Date().toISOString(),
      tags: data.tags || [],
      readingTime: data.readingTime || 5,
      thumbnail: data.thumbnail,
      author: data.author,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export function getBlogPostsByTag(tag: string): BlogPostMeta[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

export function getAllTags(): string[] {
  const allPosts = getAllBlogPosts();
  const tags = allPosts.flatMap((post) => post.tags);
  return [...new Set(tags)].sort();
}

export function searchBlogPosts(query: string): BlogPostMeta[] {
  const allPosts = getAllBlogPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return allPosts.filter((post) => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
