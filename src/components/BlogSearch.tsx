'use client';

import { useState, useEffect } from 'react';
import { BlogPostMeta } from '@/types/blog';
import { FiSearch, FiTag } from 'react-icons/fi';

interface BlogSearchProps {
  posts: BlogPostMeta[];
  tags: string[];
  onFilterChange: (filteredPosts: BlogPostMeta[]) => void;
}

export default function BlogSearch({ posts, tags, onFilterChange }: BlogSearchProps) {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let results = posts;

    // Filter by tag
    if (selectedTag) {
      results = results.filter(post => post.tags.includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    onFilterChange(results);
  }, [selectedTag, searchQuery, posts, onFilterChange]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
  };

  const clearFilters = () => {
    setSelectedTag('');
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTag === tag
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <FiTag className="inline mr-1" />
            {tag}
          </button>
        ))}
      </div>

      {/* Clear Filters */}
      {(selectedTag || searchQuery) && (
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
