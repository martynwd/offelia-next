import { NextRequest, NextResponse } from 'next/server';
import { getSliderById, updateSlider } from '@/lib/db';
import { validateSessionToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sliderId = parseInt(id, 10);

    if (isNaN(sliderId)) {
      return NextResponse.json(
        { error: 'Invalid slider ID' },
        { status: 400 }
      );
    }

    const slider = getSliderById(sliderId);

    if (!slider) {
      return NextResponse.json(
        { error: 'Slider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(slider);

  } catch (error) {
    console.error('Error fetching slider:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slider' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const result = validateSessionToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const sliderId = parseInt(id, 10);

    if (isNaN(sliderId)) {
      return NextResponse.json(
        { error: 'Invalid slider ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { image_url, title, description, link_url, order_index, is_active } = body;

    if (!image_url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    updateSlider(
      sliderId,
      image_url,
      title || null,
      description || null,
      link_url || null,
      order_index || 0,
      is_active !== false
    );

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error updating slider:', error);
    return NextResponse.json(
      { error: 'Failed to update slider' },
      { status: 500 }
    );
  }
}
