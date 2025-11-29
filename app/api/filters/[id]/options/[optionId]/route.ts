import { NextRequest, NextResponse } from 'next/server';
import { deleteFilterOption } from '@/lib/db';
import { cookies } from 'next/headers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; optionId: string }> }
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

    const { optionId } = await params;
    const optionIdNum = parseInt(optionId, 10);

    if (isNaN(optionIdNum)) {
      return NextResponse.json(
        { error: 'Invalid option ID' },
        { status: 400 }
      );
    }

    deleteFilterOption(optionIdNum);

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error deleting filter option:', error);
    return NextResponse.json(
      { error: 'Failed to delete filter option' },
      { status: 500 }
    );
  }
}
