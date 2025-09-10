import { NextRequest, NextResponse } from 'next/server';
import { rollbackProjectVersion } from '@/lib/rag';

export async function POST(req: NextRequest) {
  try {
    const { projectId, versionId } = await req.json();

    if (!projectId || !versionId) {
      return NextResponse.json(
        { error: 'Project ID and Version ID are required' },
        { status: 400 }
      );
    }

    const updatedProject = await rollbackProjectVersion(projectId, versionId);

    return NextResponse.json({
      success: true,
      project: updatedProject,
      message: `Successfully rolled back project to version ${versionId}`
    });

  } catch (error) {
    console.error('Rollback API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
