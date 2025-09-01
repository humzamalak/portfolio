'use client';

import { useEffect } from 'react';

// Analytics wrapper component that prevents hydration mismatches
export function AnalyticsWrapper() {
  return (
    <>
      <Analytics />
      <GoogleAnalytics />
    </>
  );
}

// Simple analytics component - you can replace with your preferred analytics service
export function Analytics() {
  useEffect(() => {
    // Initialize analytics here
    // Example: Google Analytics, Plausible, Umami, etc.
    
    // Track page views
    const trackPageView = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          page_path: window.location.pathname,
        });
      }
    };

    // Track custom events
    const trackEvent = (action: string, category: string, label?: string) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
        });
      }
    };

    // Track contact form submissions
    const handleContactSubmit = () => {
      trackEvent('submit', 'contact_form', 'portfolio_contact');
    };

    // Add event listeners
    const contactForm = document.querySelector('form[data-analytics="contact"]');
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Track initial page view
    trackPageView();

    // Cleanup
    return () => {
      if (contactForm) {
        contactForm.removeEventListener('submit', handleContactSubmit);
      }
    };
  }, []);

  return null;
}

// Google Analytics script loader
export function GoogleAnalytics() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_ID) {
      // Load Google Analytics
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  return null;
}

// Declare global types
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
