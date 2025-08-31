export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  readingTime: number;
  thumbnail?: string;
  author?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readingTime: number;
  thumbnail?: string;
  author?: string;
}

export interface BlogFilters {
  tags: string[];
  search: string;
}
