import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Auth.jsのAPIハンドラーを作成
const handler = NextAuth(authOptions);

// GETとPOSTリクエストに対応
export { handler as GET, handler as POST };