import { NextResponse } from 'next/server';

export async function POST() {
  // localStorage is cleared on client-side
  // Just redirect to login
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}

export async function GET() {
  // localStorage is cleared on client-side
  // Just redirect to login
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}
