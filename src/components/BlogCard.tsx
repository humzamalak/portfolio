'use client';

import { BlogPostMeta } from '@/types/blog';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

interface BlogCardProps {
  post: BlogPostMeta;
  index: number;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="group bg-background-secondary rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="aspect-video bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
            <div className="text-primary-foreground text-4xl font-bold opacity-80">
              {post.title.charAt(0)}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Source label */}
          <div className="mb-2 text-xs text-foreground-muted">
            Source: MDX (local content)
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-background-tertiary text-xs text-foreground-muted rounded-full transition-colors cursor-pointer hover:bg-primary-600 hover:text-primary-foreground focus:outline-none"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary-500 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-foreground-muted text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-foreground-muted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                {post.readingTime} min read
              </span>
              <span>{formatDate(post.date)}</span>
            </div>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </article>
  );
}
