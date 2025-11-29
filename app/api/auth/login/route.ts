import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, generateSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create a secure session token
    const sessionToken = generateSessionToken(username);

    console.log('API: Generated token for', username);

    // Return token to be stored in localStorage
    return NextResponse.json({
      success: true,
      token: sessionToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
