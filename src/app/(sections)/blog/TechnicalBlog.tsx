import { BlogPostMeta } from '@/types/blog';
import { getAllBlogPosts, getAllTags } from '@/lib/blog';
import BlogClient from '@/components/BlogClient';

interface TechnicalBlogProps {
  initialPosts?: BlogPostMeta[];
}

export default function TechnicalBlog({ initialPosts }: TechnicalBlogProps) {
  // Get posts server-side
  const posts = initialPosts || getAllBlogPosts();
  const tags = getAllTags();

  return (
    <section
      id="blog"
      className="w-full bg-background text-foreground py-16 px-4"
      aria-label="Technical Blog"
    >
      <BlogClient posts={posts} tags={tags} />
    </section>
  );
}
