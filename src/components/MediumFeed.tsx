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
    showProfile ? fetchMediumProfile(username) : null,
  ]);

  const profileUrl = getMediumProfileUrl(username);

  return (
    <Section id="blog" className="relative overflow-hidden bg-slate-950 py-28 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_26%_20%,rgba(168,85,247,0.12),transparent_28rem),radial-gradient(circle_at_76%_76%,rgba(34,211,238,0.10),transparent_28rem)]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.34em] text-fuchsia-200">thinking layer</p>
            <h2 className="mt-4 text-balance text-5xl font-black leading-[0.92] tracking-[-0.07em] text-white md:text-7xl">
              Latest on Medium
              {profile?.displayName && <span className="block text-xl font-bold tracking-normal text-slate-400">by {profile.displayName}</span>}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-300 lg:justify-self-end">
            Notes on DevOps, cloud automation, reliability, and the practical judgment behind operating production systems.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {posts.map((post) => {
              const readingTime = post.description ? extractReadingTime(post.description) : null;
              const formattedDate = formatMediumDate(post.pubDate);

              return (
                <article key={post.link} className="premium-card group flex min-h-[22rem] flex-col rounded-[2rem] p-6 transition hover:-translate-y-1">
                  {post.categories && post.categories.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {post.categories.slice(0, 2).map((category) => (
                        <span key={category} className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-xs font-bold text-fuchsia-100">
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="text-2xl font-black tracking-[-0.04em] text-white transition group-hover:text-cyan-100">
                    <Link href={post.link} target="_blank" rel="noopener noreferrer" className="rounded focus:outline-none focus:ring-2 focus:ring-cyan-200">
                      {post.title}
                    </Link>
                  </h3>
                  {post.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                      {post.description.replace(/<[^>]*>/g, '').substring(0, 140)}...
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-xs font-bold text-slate-500">
                    <span>{formattedDate}</span>
                    {readingTime && <span>{readingTime}</span>}
                  </div>
                  <Link href={post.link} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex font-bold text-cyan-100 transition hover:text-cyan-200">
                    Read on Medium →
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="premium-card mt-12 grid gap-6 rounded-[2.4rem] p-7 md:grid-cols-[0.75fr_1.25fr] md:items-center md:p-10">
            <div className="grid aspect-square max-w-[12rem] place-items-center rounded-[2rem] border border-white/10 bg-white/[0.045]">
              <svg className="h-14 w-14 text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">feed telemetry</p>
              <h3 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white">No posts available</h3>
              <p className="mt-3 max-w-2xl text-slate-300">
                Couldn&apos;t load latest posts right now. This usually means the RSS endpoint is unavailable, network access is blocked, or Medium is rate limiting the feed.
              </p>
              <Link href={profileUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white px-5 py-3 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-100">
                Visit Medium Profile
              </Link>
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href={profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-cyan-200/60 hover:text-cyan-100">
            View all posts on Medium ↗
          </Link>
        </div>
      </div>
    </Section>
  );
}
