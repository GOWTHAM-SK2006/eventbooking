import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminPath = pathname.startsWith('/admin')

  // Get the session from cookies
  const session = request.cookies.get('sb:token')?.value

  // Redirect logic
  if (isAdminPath && !session) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/bookings/:path*', '/profile/:path*'],
}