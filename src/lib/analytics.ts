import { supabase, QueryLog } from './supabase';
import { generateEmbedding } from './openai';

export interface AnalyticsData {
  totalQueries: number;
  topProjects: Array<{ projectId: string; count: number; title: string }>;
  averageSessionDuration: number;
  ctaClickRate: number;
  lowConfidenceQueries: Array<{ query: string; confidence: number; timestamp: string }>;
}

export interface GapReport {
  topUnansweredSkills: string[];
  lowConfidenceQueries: Array<{ query: string; confidence: number; timestamp: string }>;
  recommendations: string[];
  generatedAt: string;
}

// Enhanced query logging with analytics data
export async function logQueryWithAnalytics(
  queryText: string,
  projectIds: string[],
  sessionId?: string,
  ctaClicked?: string | null
): Promise<void> {
  try {
    const queryEmbedding = await generateEmbedding(queryText);
    
    await supabase
      .from('queries')
      .insert({
        query_text: queryText,
        embedding: queryEmbedding,
        project_ids: projectIds,
        cta_clicked: ctaClicked,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error logging query with analytics:', error);
    // Retry once on failure
    try {
        await supabase
        .from('queries')
        .insert({
          query_text: queryText,
          embedding: null, // Skip embedding on retry to avoid API costs
          project_ids: projectIds,
          cta_clicked: ctaClicked,
          session_id: sessionId,
          timestamp: new Date().toISOString()
        });
    } catch (retryError) {
      console.error('Retry failed for query logging:', retryError);
    }
  }
}

// Generate session ID for anonymous tracking
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get analytics data for dashboard
export async function getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total queries
    const { count: totalQueries } = await supabase
      .from('queries')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', startDate.toISOString());

    // Get top projects mentioned
    const { data: projectMentions } = await supabase
      .from('queries')
      .select('project_ids')
      .gte('timestamp', startDate.toISOString())
      .not('project_ids', 'is', null);

    const projectCounts: Record<string, number> = {};
    projectMentions?.forEach(query => {
      query.project_ids?.forEach((projectId: string) => {
        projectCounts[projectId] = (projectCounts[projectId] || 0) + 1;
      });
    });

    const topProjects = Object.entries(projectCounts)
      .map(([projectId, count]) => ({ projectId, count, title: `Project ${projectId}` }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get CTA click rate
    const { count: totalClicks } = await supabase
      .from('queries')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', startDate.toISOString())
      .not('cta_clicked', 'is', null);

    const ctaClickRate = totalQueries ? (totalClicks || 0) / totalQueries : 0;

    // Get average session duration (simplified - based on query frequency)
    const { data: sessionData } = await supabase
      .from('queries')
      .select('session_id, timestamp')
      .gte('timestamp', startDate.toISOString())
      .not('session_id', 'is', null);

    const sessionDurations: number[] = [];
    const sessionMap: Record<string, string[]> = {};
    
    sessionData?.forEach(query => {
      if (query.session_id) {
        if (!sessionMap[query.session_id]) {
          sessionMap[query.session_id] = [];
        }
        sessionMap[query.session_id].push(query.timestamp);
      }
    });

    Object.values(sessionMap).forEach(timestamps => {
      if (timestamps.length > 1) {
        const sorted = timestamps.sort();
        const duration = new Date(sorted[sorted.length - 1]).getTime() - new Date(sorted[0]).getTime();
        sessionDurations.push(duration / 1000 / 60); // Convert to minutes
      }
    });

    const averageSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length 
      : 0;

    // Get low confidence queries (queries with <80% confidence)
    const lowConfidenceQueries = await getLowConfidenceQueries(startDate);

    return {
      totalQueries: totalQueries || 0,
      topProjects,
      averageSessionDuration,
      ctaClickRate,
      lowConfidenceQueries
    };
  } catch (error) {
    console.error('Error getting analytics data:', error);
    throw new Error('Failed to retrieve analytics data');
  }
}

// Get queries with low confidence (<80%)
export async function getLowConfidenceQueries(startDate: Date): Promise<Array<{ query: string; confidence: number; timestamp: string }>> {
  try {
    // This would require confidence scores to be stored in the database
    // For now, we'll identify queries that returned no projects as low confidence
    const { data: queries } = await supabase
      .from('queries')
      .select('query_text, project_ids, timestamp')
      .gte('timestamp', startDate.toISOString())
      .or('project_ids.is.null,project_ids.eq.{}');

    return queries?.map(query => ({
      query: query.query_text,
      confidence: 0.5, // Placeholder - would need actual confidence calculation
      timestamp: query.timestamp
    })) || [];
  } catch (error) {
    console.error('Error getting low confidence queries:', error);
    return [];
  }
}

// Generate gap detection report
export async function generateGapReport(): Promise<GapReport> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days

    const lowConfidenceQueries = await getLowConfidenceQueries(startDate);
    
    // Extract common themes from low confidence queries
    const commonTerms = extractCommonTerms(lowConfidenceQueries.map(q => q.query));
    
    // Generate recommendations based on gaps
    const recommendations = generateRecommendations(commonTerms);

    return {
      topUnansweredSkills: commonTerms.slice(0, 5),
      lowConfidenceQueries: lowConfidenceQueries.slice(0, 10),
      recommendations,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating gap report:', error);
    throw new Error('Failed to generate gap report');
  }
}

// Extract common terms from queries (simplified)
export function extractCommonTerms(queries: string[]): string[] {
  const termCounts: Record<string, number> = {};
  
  queries.forEach(query => {
    const words = query.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3); // Filter out short words
    
    words.forEach(word => {
      termCounts[word] = (termCounts[word] || 0) + 1;
    });
  });

  return Object.entries(termCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([term]) => term);
}

// Generate recommendations based on gaps
export function generateRecommendations(terms: string[]): string[] {
  const recommendations: string[] = [];
  
  if (terms.includes('react') || terms.includes('frontend')) {
    recommendations.push('Add more React/frontend projects to portfolio');
  }
  
  if (terms.includes('backend') || terms.includes('api')) {
    recommendations.push('Include more backend/API development examples');
  }
  
  if (terms.includes('database') || terms.includes('sql')) {
    recommendations.push('Showcase database design and optimization skills');
  }
  
  if (terms.includes('ai') || terms.includes('machine')) {
    recommendations.push('Add AI/ML project examples');
  }
  
  if (terms.includes('mobile') || terms.includes('app')) {
    recommendations.push('Consider adding mobile development projects');
  }

  return recommendations.length > 0 ? recommendations : ['Review portfolio content based on common query patterns'];
}

// Export analytics data as JSON
export async function exportAnalyticsData(days: number = 30): Promise<any> {
  try {
    const analyticsData = await getAnalyticsData(days);
    const gapReport = await generateGapReport();
    
    return {
      analytics: analyticsData,
      gapReport,
      exportDate: new Date().toISOString(),
      period: `${days} days`
    };
  } catch (error) {
    console.error('Error exporting analytics data:', error);
    throw new Error('Failed to export analytics data');
  }
}
