'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMediumProfileUrl } from '@/lib/medium';

interface MediumProfileCardProps {
  username: string;
  className?: string;
}

export default function MediumProfileCard({ username, className = '' }: MediumProfileCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<{
    displayName?: string;
    bio?: string;
    followers?: number;
    posts?: number;
  } | null>(null);

  const profileUrl = getMediumProfileUrl(username);

  useEffect(() => {
    // Simulate loading profile data
    // In a real implementation, you might fetch this from an API
    const timer = setTimeout(() => {
      setProfileData({
        displayName: 'Humza Malak',
        bio: 'DevOps Engineer & Cloud Architect',
        followers: 150,
        posts: 25
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [username]);

  if (isLoading) {
    return (
      <div className={`bg-background-secondary rounded-xl border border-border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-foreground-muted rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-foreground-muted rounded w-32"></div>
              <div className="h-3 bg-foreground-muted rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-foreground-muted rounded w-full"></div>
            <div className="h-3 bg-foreground-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-background-secondary rounded-xl border border-border p-6 hover:border-primary-500/50 transition-colors ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75S24 8.83 24 12z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {profileData?.displayName || username}
            </h3>
            <p className="text-sm text-foreground-muted">Medium Writer</p>
          </div>
        </div>
        
        <Link 
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>

      {profileData?.bio && (
        <p className="text-sm text-foreground-muted mb-4">
          {profileData.bio}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-foreground-muted mb-4">
        <div className="flex items-center space-x-4">
          {profileData?.followers && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {profileData.followers} followers
            </span>
          )}
          {profileData?.posts && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              {profileData.posts} posts
            </span>
          )}
        </div>
      </div>

      <Link 
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center w-full justify-center px-4 py-2 bg-primary-600 text-primary-foreground rounded-lg hover:bg-primary-500 transition-colors font-medium"
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75S24 8.83 24 12z"/>
        </svg>
        Follow on Medium
      </Link>
    </div>
  );
}
