import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple mock authentication middleware
export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value

  // Protected routes: anything that isn't /login or an API/asset route
  if (!currentUser && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/_next') && !request.nextUrl.pathname.startsWith('/assets')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin route protection: only users with 'admin' role can access /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      if (currentUser) {
        const user = JSON.parse(currentUser)
        if (user.role !== 'admin') {
          // Redirect standard users to dashboard if trying to access admin
          return NextResponse.redirect(new URL('/', request.url))
        }
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users away from /login
  if (currentUser && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
}
