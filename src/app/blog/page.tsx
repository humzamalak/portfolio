import { LayoutWrapper } from '@/components/layout-wrapper';
import { getAllBlogPosts } from '@/lib/blog';
import { FiArrowLeft, FiClock, FiTag, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <LayoutWrapper>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Technical Blog
          </h1>
          <p className="text-xl text-foreground-muted">
            Exploring the latest in web development, TypeScript, and modern technologies
          </p>
        </div>

        {/* Blog Posts List */}
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-background-secondary border border-border rounded-xl p-6 hover:bg-background-tertiary transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Thumbnail */}
                {post.thumbnail && (
                  <div className="flex-shrink-0">
                    <div className="w-32 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                      <div className="text-primary-foreground text-2xl font-bold opacity-80">
                        {post.title.charAt(0)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-background text-xs text-foreground-muted rounded-full border border-border"
                      >
                        <FiTag className="inline mr-1 w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-foreground-muted mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
                    {post.author && (
                      <span>By {post.author}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {post.readingTime} min read
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground-muted text-lg">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}
