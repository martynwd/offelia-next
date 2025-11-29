import { NextRequest, NextResponse } from 'next/server';
import { deleteFilterDefinition } from '@/lib/db';
import { cookies } from 'next/headers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const filterId = parseInt(id, 10);

    if (isNaN(filterId)) {
      return NextResponse.json(
        { error: 'Invalid filter ID' },
        { status: 400 }
      );
    }

    deleteFilterDefinition(filterId);

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error deleting filter:', error);
    return NextResponse.json(
      { error: 'Failed to delete filter' },
      { status: 500 }
    );
  }
}
