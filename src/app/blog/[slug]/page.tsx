import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog';
import BlogPostContent from '@/components/BlogPostContent';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { FiArrowLeft, FiClock, FiTag, FiCalendar } from 'react-icons/fi';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <LayoutWrapper>
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary text-sm text-primary-foreground rounded-full"
              >
                <FiTag className="inline mr-1 w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-foreground-muted text-sm">
            {post.author && (
              <span className="flex items-center gap-2">
                <span>By {post.author}</span>
              </span>
            )}
            <span className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-2">
              <FiClock className="w-4 h-4" />
              {post.readingTime} min read
            </span>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-foreground-muted mt-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground-muted prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-background-secondary prose-pre:border prose-pre:border-border">
          <BlogPostContent content={post.content} />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2 text-foreground-muted">
              <span>Share this post:</span>
              <div className="flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  LinkedIn
                </a>
              </div>
            </div>
            
            <Link
              href="/#blog"
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              View All Posts
            </Link>
          </div>
        </footer>
      </div>
    </LayoutWrapper>
  );
}
