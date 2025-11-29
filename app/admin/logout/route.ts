import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();

  // Delete the cookie (session validation is stateless with signed tokens)
  cookieStore.delete('admin_session');

  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}

export async function GET() {
  const cookieStore = await cookies();

  // Delete the cookie (session validation is stateless with signed tokens)
  cookieStore.delete('admin_session');

  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}
