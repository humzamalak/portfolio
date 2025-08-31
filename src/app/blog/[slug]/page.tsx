import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog';
import BlogPostContent from '@/components/BlogPostContent';
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
    <article className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
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
                className="px-3 py-1 bg-blue-600 text-sm text-white rounded-full"
              >
                <FiTag className="inline mr-1 w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-neutral-400 text-sm">
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
            <p className="text-xl text-neutral-300 mt-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <BlogPostContent content={post.content} />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-neutral-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2 text-neutral-400">
              <span>Share this post:</span>
              <div className="flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
            
            <Link
              href="/#blog"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              View All Posts
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
}
