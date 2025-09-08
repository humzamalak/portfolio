'use server';

import { fetchMediumPosts, fetchMediumProfile, getMediumProfileUrl, formatMediumDate, extractReadingTime } from '@/lib/medium';
import { Section } from '@/components/ui/section';
import Link from 'next/link';

interface MediumFeedProps {
  username: string;
  limit?: number;
  showProfile?: boolean;
}

export default async function MediumFeed({ username, limit = 3, showProfile = true }: MediumFeedProps) {
  const [posts, profile] = await Promise.all([
    fetchMediumPosts(username, limit),
    showProfile ? fetchMediumProfile(username) : null
  ]);

  const profileUrl = getMediumProfileUrl(username);

  return (
    <Section id="blog" className="py-20 bg-background-secondary/30">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Latest on Medium
            {profile?.displayName && (
              <span className="block text-lg font-normal text-foreground-muted mt-2">
                by {profile.displayName}
              </span>
            )}
          </h2>
          <p className="text-foreground-muted">Thoughts on DevOps, cloud, automation, and reliability</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => {
              const readingTime = post.description ? extractReadingTime(post.description) : null;
              const formattedDate = formatMediumDate(post.pubDate);
              
              return (
                <article key={post.link} className="bg-background rounded-xl border border-border p-6 transition-all duration-200 hover:border-primary-500/50 hover:shadow-lg group">
                  {/* Categories */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.slice(0, 2).map((category) => (
                        <span 
                          key={category} 
                          className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <h3 className="text-lg font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    <Link 
                      href={post.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  
                  {/* Description preview */}
                  {post.description && (
                    <p className="text-sm text-foreground-muted mb-4 line-clamp-3">
                      {post.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-foreground-muted mb-4">
                    <span>{formattedDate}</span>
                    {readingTime && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {readingTime}
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium group-hover:underline"
                  >
                    Read on Medium 
                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-foreground-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-lg font-semibold text-foreground mb-2">No posts available</h3>
              <p className="text-foreground-muted mb-6">
                Couldn&apos;t load latest posts right now. This might be due to:
              </p>
              <ul className="text-sm text-foreground-muted space-y-1 mb-6">
                <li>• RSS feed temporarily unavailable</li>
                <li>• Network connectivity issues</li>
                <li>• Medium API rate limiting</li>
              </ul>
            </div>
            <Link 
              href={profileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-primary-foreground rounded-lg hover:bg-primary-500 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75S24 8.83 24 12z"/>
              </svg>
              Visit Medium Profile
            </Link>
          </div>
        )}

        <div className="text-center mt-10">
          <Link 
            href={profileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-sm text-foreground hover:text-primary font-medium transition-colors"
          >
            View all posts on Medium
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </Section>
  );
}


