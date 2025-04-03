import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 認証トークンを取得
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const isAuthenticated = !!token;
  
  // 保護されたルートへのアクセスで未認証の場合、ログインページにリダイレクト
  if (pathname.startsWith('/protected') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // 認証済みユーザーがログインページにアクセスした場合、保護されたページにリダイレクト
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/protected', request.url));
  }
  
  return NextResponse.next();
}

// ミドルウェアを適用するパスを設定
export const config = {
  matcher: ['/protected/:path*', '/login'],
};