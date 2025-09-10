import { supabase, QueryCache } from './supabase';
import { generateChatResponseWithModel } from './openai';
import crypto from 'crypto';

// Cost management configuration
export const COST_CONFIG = {
  RATE_LIMIT_PER_HOUR: 20,
  CACHE_HIT_THRESHOLD: 0.8, // Cache queries with >80% confidence
  LOW_CONFIDENCE_THRESHOLD: 0.8, // Use GPT-3.5 for <80% confidence
  CACHE_EXPIRY_HOURS: 24,
  TOP_QUERIES_PERCENTAGE: 0.1 // Cache top 10% of queries
};

// Generate hash for query caching
export function generateQueryHash(query: string): string {
  return crypto.createHash('sha256').update(query.toLowerCase().trim()).digest('hex');
}

// Check if query exists in cache
export async function getCachedResponse(query: string): Promise<QueryCache | null> {
  try {
    const queryHash = generateQueryHash(query);
    const cacheExpiry = new Date(Date.now() - COST_CONFIG.CACHE_EXPIRY_HOURS * 3600000).toISOString();

    const { data, error } = await supabase
      .from('query_cache')
      .select('*')
      .eq('query_hash', queryHash)
      .gte('timestamp', cacheExpiry)
      .single();

    if (error || !data) {
      return null;
    }

    return data as QueryCache;
  } catch (error) {
    console.error('Error getting cached response:', error);
    return null;
  }
}

// Store response in cache
export async function cacheResponse(
  query: string,
  response: string,
  confidence: number,
  modelUsed: string
): Promise<void> {
  try {
    const queryHash = generateQueryHash(query);

    // Only cache high-confidence responses
    if (confidence < COST_CONFIG.CACHE_HIT_THRESHOLD) {
      return;
    }

    await supabase
      .from('query_cache')
      .upsert({
        query_hash: queryHash,
        query: query.toLowerCase().trim(),
        response,
        confidence,
        model_used: modelUsed,
        timestamp: new Date().toISOString()
      });

    // Clean up old cache entries
    await cleanupOldCache();
  } catch (error) {
    console.error('Error caching response:', error);
    // Don't throw - caching is optional
  }
}

// Clean up old cache entries
async function cleanupOldCache(): Promise<void> {
  try {
    const cacheExpiry = new Date(Date.now() - COST_CONFIG.CACHE_EXPIRY_HOURS * 3600000).toISOString();
    
    await supabase
      .from('query_cache')
      .delete()
      .lt('timestamp', cacheExpiry);
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
}

// Get model to use based on confidence
export function getModelForConfidence(confidence: number): string {
  return confidence <= COST_CONFIG.LOW_CONFIDENCE_THRESHOLD ? 'gpt-3.5-turbo' : 'gpt-4o-mini';
}

// Generate response with appropriate model
export async function generateResponseWithCostControl(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  context: string,
  confidence: number
): Promise<string> {
  try {
    const model = getModelForConfidence(confidence);
    
    console.log(`Using model: ${model} for confidence: ${confidence}`);
    
    return await generateChatResponseWithModel(messages, model, context);
  } catch (error) {
    console.error('Error generating response with cost control:', error);
    throw error;
  }
}

// Get cache statistics for monitoring
export async function getCacheStats(): Promise<{
  totalCachedQueries: number;
  cacheHitRate: number;
  averageConfidence: number;
}> {
  try {
    const { data: cacheData, error } = await supabase
      .from('query_cache')
      .select('confidence, timestamp');

    if (error || !cacheData) {
      return { totalCachedQueries: 0, cacheHitRate: 0, averageConfidence: 0 };
    }

    const totalCachedQueries = cacheData.length;
    const averageConfidence = cacheData.reduce((sum, item) => sum + item.confidence, 0) / totalCachedQueries;
    
    // Calculate cache hit rate (this would need to be tracked separately in production)
    const cacheHitRate = 0; // Placeholder - would need request tracking

    return {
      totalCachedQueries,
      cacheHitRate,
      averageConfidence: averageConfidence || 0
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { totalCachedQueries: 0, cacheHitRate: 0, averageConfidence: 0 };
  }
}

// Log cost management metrics
export async function logCostMetrics(
  query: string,
  confidence: number,
  modelUsed: string,
  fromCache: boolean,
  sessionId?: string
): Promise<void> {
  try {
    // This could be stored in a separate analytics table
    console.log(`Cost metrics - Query: ${query.substring(0, 50)}..., Confidence: ${confidence}, Model: ${modelUsed}, From Cache: ${fromCache}, Session: ${sessionId}`);
  } catch (error) {
    console.error('Error logging cost metrics:', error);
  }
}
