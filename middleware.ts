import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function middleware(req: NextRequest) {
  // Only apply rate limiting to chat API routes
  if (req.nextUrl.pathname.startsWith('/api/chat')) {
    try {
      // Get client IP address
      const ip = req.ip || 
        req.headers.get('x-forwarded-for') || 
        req.headers.get('x-real-ip') || 
        'unknown';

      // Check current rate limit for this IP in the last hour
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
      
      const { data: rateLimitData, error } = await supabase
        .from('rate_limits')
        .select('count')
        .eq('ip', ip)
        .gte('timestamp', oneHourAgo);

      if (error) {
        console.error('Rate limit check error:', error);
        // Allow request to proceed if rate limit check fails
        return NextResponse.next();
      }

      // Calculate total requests in the last hour
      const totalRequests = rateLimitData?.reduce((sum, record) => sum + record.count, 0) || 0;

      // Check if rate limit exceeded (20 requests per hour)
      if (totalRequests >= 20) {
        console.log(`Rate limit exceeded for IP: ${ip}, requests: ${totalRequests}`);
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded', 
            message: 'Too many requests. Please try again in an hour.',
            retryAfter: 3600 
          }, 
          { status: 429 }
        );
      }

      // Record this request
      await supabase
        .from('rate_limits')
        .insert({
          ip,
          count: 1,
          timestamp: new Date().toISOString()
        });

      // Clean up old rate limit records (older than 24 hours)
      await supabase
        .from('rate_limits')
        .delete()
        .lt('timestamp', new Date(Date.now() - 86400000).toISOString());

    } catch (error) {
      console.error('Middleware error:', error);
      // Allow request to proceed if middleware fails
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/chat/:path*'
};
