// Medium Integration Configuration
// This file contains all Medium-related settings and constants

export const MEDIUM_CONFIG = {
  // Your Medium username
  USERNAME: 'humzamalak',
  
  // Medium profile URL
  PROFILE_URL: 'https://medium.com/@humzamalak',
  
  // RSS feed URL
  RSS_URL: 'https://medium.com/feed/@humzamalak',
  
  // Display settings
  DISPLAY: {
    // Number of posts to show in feed
    POST_LIMIT: 3,
    
    // Show profile information
    SHOW_PROFILE: true,
    
    // Show categories/tags
    SHOW_CATEGORIES: true,
    
    // Show reading time
    SHOW_READING_TIME: true,
    
    // Show description preview
    SHOW_DESCRIPTION: true,
    
    // Description character limit
    DESCRIPTION_LIMIT: 120,
  },
  
  // Cache settings
  CACHE: {
    // RSS feed cache duration (in seconds)
    RSS_CACHE_DURATION: 3600, // 1 hour
    
    // Profile cache duration (in seconds)
    PROFILE_CACHE_DURATION: 86400, // 24 hours
  },
  
  // Error handling
  ERROR_HANDLING: {
    // Retry attempts for failed requests
    MAX_RETRIES: 3,
    
    // Retry delay (in milliseconds)
    RETRY_DELAY: 1000,
    
    // Fallback behavior when RSS fails
    FALLBACK_TO_PROFILE: true,
  },
  
  // Content filtering
  FILTERS: {
    // Minimum post length (in characters)
    MIN_POST_LENGTH: 100,
    
    // Exclude posts with certain keywords
    EXCLUDE_KEYWORDS: ['draft', 'test', 'private'],
    
    // Include only posts with certain categories
    INCLUDE_CATEGORIES: ['DevOps', 'Cloud', 'Automation', 'Technology'],
  },
  
  // Analytics and tracking
  ANALYTICS: {
    // Track Medium link clicks
    TRACK_CLICKS: true,
    
    // Track feed load events
    TRACK_FEED_LOADS: true,
    
    // Track error events
    TRACK_ERRORS: true,
  },
  
  // UI/UX settings
  UI: {
    // Animation duration (in milliseconds)
    ANIMATION_DURATION: 200,
    
    // Hover effects
    ENABLE_HOVER_EFFECTS: true,
    
    // Loading states
    SHOW_LOADING_STATES: true,
    
    // Error states
    SHOW_ERROR_STATES: true,
  },
} as const;

// Helper functions for Medium integration
export const getMediumProfileUrl = (username: string = MEDIUM_CONFIG.USERNAME): string => {
  return `https://medium.com/@${username}`;
};

export const getMediumRssUrl = (username: string = MEDIUM_CONFIG.USERNAME): string => {
  return `https://medium.com/feed/@${username}`;
};

export const formatMediumDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const extractReadingTime = (description: string): string | null => {
  const readingTimeMatch = description.match(/(\d+)\s*min\s*read/i);
  return readingTimeMatch ? `${readingTimeMatch[1]} min read` : null;
};

export const truncateText = (text: string, limit: number = MEDIUM_CONFIG.DISPLAY.DESCRIPTION_LIMIT): string => {
  if (text.length <= limit) return text;
  return text.substring(0, limit).trim() + '...';
};

export const cleanHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

// Validation functions
export const isValidMediumUsername = (username: string): boolean => {
  return /^[a-zA-Z0-9_-]+$/.test(username) && username.length > 0;
};

export const isValidMediumUrl = (url: string): boolean => {
  return url.includes('medium.com') && url.includes('@');
};

// Error messages
export const MEDIUM_ERRORS = {
  RSS_FETCH_FAILED: 'Failed to fetch Medium RSS feed',
  PROFILE_FETCH_FAILED: 'Failed to fetch Medium profile',
  INVALID_USERNAME: 'Invalid Medium username',
  NETWORK_ERROR: 'Network error occurred',
  PARSE_ERROR: 'Failed to parse Medium data',
  RATE_LIMITED: 'Rate limited by Medium API',
} as const;

// Success messages
export const MEDIUM_SUCCESS = {
  POSTS_LOADED: 'Medium posts loaded successfully',
  PROFILE_LOADED: 'Medium profile loaded successfully',
  CACHE_UPDATED: 'Medium cache updated successfully',
} as const;
