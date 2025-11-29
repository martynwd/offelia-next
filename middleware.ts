import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: We can't use the full auth.ts in Edge Runtime due to Node.js crypto
// So we'll do a simpler check here - just verify the cookie exists
// The actual validation happens in server components via checkAuth()
export function middleware(request: NextRequest) {
  // Check if the request is for an admin route (except login)
  if (request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {

    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session');

    // If no session cookie, redirect to login
    // Detailed validation happens server-side
    if (!adminSession?.value) {
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
