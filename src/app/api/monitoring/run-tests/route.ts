import { NextRequest, NextResponse } from 'next/server';
import { runGoldenTests } from '../../../../../tests/run-golden';

export async function POST(req: NextRequest) {
  try {
    // Verify this is a cron job request (optional security check)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('🚀 Starting automated golden tests...');
    
    // Run golden tests
    const summary = await runGoldenTests();
    
    // Return summary
    return NextResponse.json({
      success: true,
      summary,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Automated test runner error:', error);
    return NextResponse.json({ 
      error: 'Failed to run automated tests',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Manual trigger for testing
    console.log('🚀 Starting manual golden tests...');
    
    const summary = await runGoldenTests();
    
    return NextResponse.json({
      success: true,
      summary,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Manual test runner error:', error);
    return NextResponse.json({ 
      error: 'Failed to run manual tests',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
