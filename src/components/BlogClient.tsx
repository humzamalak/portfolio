'use client';

import { useState } from 'react';
import { BlogPostMeta } from '@/types/blog';
import BlogCard from '@/components/BlogCard';
import BlogSearch from '@/components/BlogSearch';

interface BlogClientProps {
  posts: BlogPostMeta[];
  tags: string[];
}

export default function BlogClient({ posts, tags }: BlogClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPostMeta[]>(posts);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const handleFilterChange = (newFilteredPosts: BlogPostMeta[]) => {
    setFilteredPosts(newFilteredPosts);
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          DevOps Insights & Technical Deep Dives
        </h2>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
          Sharing knowledge on Kubernetes, cloud infrastructure, CI/CD automation, and modern DevOps practices
        </p>
      </div>

      {/* Search and Filters */}
      <BlogSearch 
        posts={posts} 
        tags={tags} 
        onFilterChange={handleFilterChange}
      />

      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground-muted text-lg">
            No blog posts found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts
              .slice(0, page * pageSize)
              .map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))}
          </div>

          {filteredPosts.length > page * pageSize && (
            <div className="text-center mt-8">
              <button
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors text-primary-foreground"
                onClick={() => setPage((p) => p + 1)}
              >
                Load More Posts
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
