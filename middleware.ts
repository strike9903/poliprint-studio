import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const intlMiddleware = createMiddleware({
  locales: ['uk', 'ru'],
  defaultLocale: 'uk',
  localePrefix: 'as-needed'
});

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if accessing admin routes
  if (pathname.includes('/admin')) {
    // Get auth token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL('/uk', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      // Decode and verify token
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired
      if (decoded.exp < Date.now()) {
        const loginUrl = new URL('/uk', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('auth-token');
        return response;
      }
      
      // Check admin role (in real app, fetch user from DB)
      if (decoded.email !== 'admin@poliprint.ua') {
        // Redirect to home if not admin
        return NextResponse.redirect(new URL('/uk', request.url));
      }
      
    } catch (error) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/uk', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth-token');
      return response;
    }
  }
  
  // Apply internationalization middleware for other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/((?!api|_next|.*\..*).*)'],
  runtime: 'nodejs'
};
