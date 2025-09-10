import { NextRequest, NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/cost-management';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Get cache statistics
    const cacheStats = await getCacheStats();

    // Get rate limit statistics
    const { data: rateLimitData, error } = await supabase
      .from('rate_limits')
      .select('ip, count, timestamp')
      .gte('timestamp', new Date(Date.now() - 3600000).toISOString()); // Last hour

    if (error) {
      console.error('Error fetching rate limit stats:', error);
    }

    // Calculate rate limit stats
    const totalRequests = rateLimitData?.reduce((sum, record) => sum + record.count, 0) || 0;
    const uniqueIPs = new Set(rateLimitData?.map(record => record.ip) || []).size;

    // Get query cache hit rate (simplified calculation)
    const { data: totalQueries, error: queryError } = await supabase
      .from('queries')
      .select('id')
      .gte('timestamp', new Date(Date.now() - 3600000).toISOString()); // Last hour

    const totalQueriesCount = totalQueries?.length || 0;
    const cacheHitRate = totalQueriesCount > 0 ? 
      (cacheStats.totalCachedQueries / totalQueriesCount) * 100 : 0;

    const stats = {
      cache: {
        totalCachedQueries: cacheStats.totalCachedQueries,
        cacheHitRate: Math.round(cacheHitRate * 100) / 100,
        averageConfidence: Math.round(cacheStats.averageConfidence * 100) / 100
      },
      rateLimiting: {
        totalRequestsLastHour: totalRequests,
        uniqueIPsLastHour: uniqueIPs,
        averageRequestsPerIP: uniqueIPs > 0 ? Math.round((totalRequests / uniqueIPs) * 100) / 100 : 0
      },
      costOptimization: {
        lowConfidenceThreshold: 0.8,
        cacheThreshold: 0.8,
        fallbackModel: 'gpt-3.5-turbo',
        primaryModel: 'gpt-4o-mini'
      }
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching cost stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cost statistics' },
      { status: 500 }
    );
  }
}
