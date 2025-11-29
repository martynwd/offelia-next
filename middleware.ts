import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware now just checks if authorization header exists
// Actual token validation happens server-side in checkAuth()
export function middleware(request: NextRequest) {
  // Check if the request is for an admin route (except login and API routes)
  if (request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login') &&
      !request.nextUrl.pathname.startsWith('/api/')) {

    // Check for Authorization header (set by client from localStorage)
    const authHeader = request.headers.get('authorization');

    console.log('Middleware check:', {
      path: request.nextUrl.pathname,
      hasAuth: !!authHeader
    });

    // If no auth header, this is a direct navigation - allow it
    // The page component will handle auth check and redirect if needed
    // This is because middleware can't access localStorage
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/admin/:path*',
};
