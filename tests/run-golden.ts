import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from '../src/lib/openai';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Types for test results
interface TestResult {
  queryId: string;
  query: string;
  success: boolean;
  latency: number;
  accuracy: number;
  expectedProjectIds: string[];
  actualProjectIds: string[];
  response: any;
  error?: string;
  timestamp: string;
}

interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageLatency: number;
  overallAccuracy: number;
  alertsTriggered: string[];
  timestamp: string;
}

// Load golden test configuration
const goldenTests = require('./golden.json');

// Test configuration
const TEST_CONFIG = goldenTests.test_config;
const ALERT_THRESHOLDS = goldenTests.alert_thresholds;

/**
 * Run a single golden test against the chat API
 */
async function runSingleTest(testCase: any): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    // Make request to chat API
    const response = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: testCase.query }],
        sessionId: `test_${Date.now()}`,
        ctaClicked: null,
        lastMessages: []
      }),
    });

    const latency = Date.now() - startTime;
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract project IDs from response
    const actualProjectIds = data.projects?.map((p: any) => p.title) || [];
    
    // Calculate accuracy based on expected vs actual project IDs
    const accuracy = calculateAccuracy(testCase.expected_project_ids, actualProjectIds);
    
    return {
      queryId: testCase.id,
      query: testCase.query,
      success: accuracy >= ALERT_THRESHOLDS.min_response_quality,
      latency,
      accuracy,
      expectedProjectIds: testCase.expected_project_ids,
      actualProjectIds,
      response: data,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    const latency = Date.now() - startTime;
    
    return {
      queryId: testCase.id,
      query: testCase.query,
      success: false,
      latency,
      accuracy: 0,
      expectedProjectIds: testCase.expected_project_ids,
      actualProjectIds: [],
      response: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Calculate accuracy between expected and actual project IDs
 */
function calculateAccuracy(expectedIds: string[], actualIds: string[]): number {
  if (expectedIds.length === 0) {
    // For queries that don't expect specific projects, check if response is meaningful
    return actualIds.length > 0 ? 1.0 : 0.5;
  }
  
  if (actualIds.length === 0) {
    return 0;
  }
  
  // Calculate intersection of expected and actual project IDs
  const intersection = expectedIds.filter(id => actualIds.includes(id));
  
  // Accuracy is the ratio of correctly identified projects
  return intersection.length / expectedIds.length;
}

/**
 * Store test results in Supabase
 */
async function storeTestResults(results: TestResult[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('test_results')
      .insert(results.map(result => ({
        query_id: result.queryId,
        query_text: result.query,
        success: result.success,
        latency_ms: result.latency,
        accuracy: result.accuracy,
        expected_project_ids: result.expectedProjectIds,
        actual_project_ids: result.actualProjectIds,
        response_data: result.response,
        error_message: result.error,
        timestamp: result.timestamp
      })));
    
    if (error) {
      console.error('Error storing test results:', error);
    }
  } catch (error) {
    console.error('Error storing test results:', error);
  }
}

/**
 * Trigger alerts for failed tests or performance issues
 */
async function triggerAlerts(summary: TestSummary): Promise<void> {
  const alerts: any[] = [];
  
  // Check accuracy threshold
  if (summary.overallAccuracy < ALERT_THRESHOLDS.min_accuracy) {
    alerts.push({
      type: 'accuracy',
      severity: 'high',
      message: `Accuracy below threshold: ${(summary.overallAccuracy * 100).toFixed(1)}% (threshold: ${(ALERT_THRESHOLDS.min_accuracy * 100)}%)`,
      value: summary.overallAccuracy,
      timestamp: new Date().toISOString()
    });
  }
  
  // Check latency threshold
  if (summary.averageLatency > ALERT_THRESHOLDS.max_latency_ms) {
    alerts.push({
      type: 'latency',
      severity: 'medium',
      message: `Average latency above threshold: ${summary.averageLatency}ms (threshold: ${ALERT_THRESHOLDS.max_latency_ms}ms)`,
      value: summary.averageLatency,
      timestamp: new Date().toISOString()
    });
  }
  
  // Check individual test failures
  if (summary.failedTests > 0) {
    alerts.push({
      type: 'test_failures',
      severity: 'high',
      message: `${summary.failedTests} out of ${summary.totalTests} tests failed`,
      value: summary.failedTests,
      timestamp: new Date().toISOString()
    });
  }
  
  // Store alerts in Supabase
  if (alerts.length > 0) {
    try {
      const { error } = await supabase
        .from('alerts')
        .insert(alerts);
      
      if (error) {
        console.error('Error storing alerts:', error);
      } else {
        console.log(`✅ Triggered ${alerts.length} alerts`);
      }
    } catch (error) {
      console.error('Error storing alerts:', error);
    }
  }
}

/**
 * Run all golden tests
 */
async function runGoldenTests(): Promise<TestSummary> {
  console.log('🚀 Starting golden tests...');
  console.log(`📊 Running ${goldenTests.queries.length} test cases`);
  
  const results: TestResult[] = [];
  
  // Run tests with retry logic
  for (const testCase of goldenTests.queries) {
    let result: TestResult | null = null;
    let attempts = 0;
    
    while (attempts < TEST_CONFIG.retry_attempts && !result?.success) {
      attempts++;
      console.log(`🔄 Running test: ${testCase.id} (attempt ${attempts})`);
      
      result = await runSingleTest(testCase);
      
      if (!result.success && attempts < TEST_CONFIG.retry_attempts) {
        console.log(`⏳ Retrying test: ${testCase.id} in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    if (result) {
      results.push(result);
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${testCase.id}: ${result.accuracy.toFixed(2)} accuracy, ${result.latency}ms latency`);
    }
  }
  
  // Calculate summary
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  const averageLatency = results.reduce((sum, r) => sum + r.latency, 0) / totalTests;
  const overallAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests;
  
  const summary: TestSummary = {
    totalTests,
    passedTests,
    failedTests,
    averageLatency,
    overallAccuracy,
    alertsTriggered: [],
    timestamp: new Date().toISOString()
  };
  
  // Store results and trigger alerts
  await storeTestResults(results);
  await triggerAlerts(summary);
  
  // Log summary
  console.log('\n📈 Test Summary:');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Average Latency: ${averageLatency.toFixed(0)}ms`);
  console.log(`Overall Accuracy: ${(overallAccuracy * 100).toFixed(1)}%`);
  
  return summary;
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Validate environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      throw new Error('Missing required environment variables: SUPABASE_URL, SUPABASE_KEY');
    }
    
    // Run golden tests
    const summary = await runGoldenTests();
    
    // Exit with appropriate code
    if (summary.failedTests > 0 || summary.overallAccuracy < ALERT_THRESHOLDS.min_accuracy) {
      console.log('❌ Tests failed or accuracy below threshold');
      process.exit(1);
    } else {
      console.log('✅ All tests passed!');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { runGoldenTests, TestResult, TestSummary };
