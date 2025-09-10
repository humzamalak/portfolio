import { NextRequest, NextResponse } from 'next/server';
import { runSeeding } from '@/lib/seed-projects';

export async function POST(req: NextRequest) {
  try {
    // Optional: Add authentication/authorization here
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const result = await runSeeding();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Seed projects API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
