import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get test results
    const { data: testResults, error } = await supabase
      .from('test_results')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching test results:', error);
      return NextResponse.json({ error: 'Failed to fetch test results' }, { status: 500 });
    }
    
    // Calculate summary statistics
    const totalTests = testResults?.length || 0;
    const passedTests = testResults?.filter(r => r.success).length || 0;
    const averageLatency = testResults?.reduce((sum, r) => sum + r.latency_ms, 0) / totalTests || 0;
    const averageAccuracy = testResults?.reduce((sum, r) => sum + r.accuracy, 0) / totalTests || 0;
    
    return NextResponse.json({
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        averageLatency: Math.round(averageLatency),
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        successRate: totalTests > 0 ? (passedTests / totalTests) : 0
      },
      results: testResults,
      period: `${days} days`
    });
    
  } catch (error) {
    console.error('Monitoring API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { queryId, query, success, latency, accuracy, expectedProjectIds, actualProjectIds, response, error } = body;
    
    // Store test result
    const { data, error: insertError } = await supabase
      .from('test_results')
      .insert({
        query_id: queryId,
        query_text: query,
        success,
        latency_ms: latency,
        accuracy,
        expected_project_ids: expectedProjectIds,
        actual_project_ids: actualProjectIds,
        response_data: response,
        error_message: error,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error storing test result:', insertError);
      return NextResponse.json({ error: 'Failed to store test result' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Monitoring API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
