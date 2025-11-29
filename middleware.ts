import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route (except login)
  if (request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {

    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session');

    // If no valid session, redirect to login
    if (!adminSession || adminSession.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/admin/:path*',
};
