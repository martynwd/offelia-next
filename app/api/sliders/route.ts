import { NextRequest, NextResponse } from 'next/server';
import { createSlider } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { image_url, title, description, link_url, order_index, is_active } = body;

    if (!image_url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const sliderId = createSlider(
      image_url,
      title || null,
      description || null,
      link_url || null,
      order_index || 0,
      1, // user_id
      is_active !== false
    );

    return NextResponse.json({
      success: true,
      id: sliderId
    });

  } catch (error) {
    console.error('Error creating slider:', error);
    return NextResponse.json(
      { error: 'Failed to create slider' },
      { status: 500 }
    );
  }
}
