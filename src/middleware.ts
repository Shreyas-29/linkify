import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Bảo vệ admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }

    // Kiểm tra quyền admin sẽ được thực hiện ở client-side
    // vì cần decode JWT và kiểm tra isAdmin
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ]
}