import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Exclude login page and API routes from authentication check
  if (request.nextUrl.pathname.startsWith('/login') || 
      request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  try {
    const isAuthenticated = await auth.isAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};