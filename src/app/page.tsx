import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth-helpers';

export default async function Home() {
  // サーバーコンポーネントからユーザー情報を取得
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold">
          LINE LIFF + Auth.js + Supabase サンプル
        </h1>
        
        <div className="mb-8 space-y-4">
          <p className="text-lg">
            このサンプルアプリケーションは、LINE LIFFを使用してユーザー認証を行い、Auth.jsでセッション管理し、
            Supabase（PostgreSQL）にユーザー情報を保存する構成を示しています。
          </p>
          
          <div className="rounded-md bg-blue-50 p-4 text-blue-700">
            <h2 className="mb-2 font-semibold">主な機能</h2>
            <ul className="list-inside list-disc space-y-1">
              <li>LINE LIFFによるIDトークン取得</li>
              <li>Auth.jsによるセッション管理</li>
              <li>Prisma ORMを使用したSupabaseとの連携</li>
              <li>Next.js App Routerのサーバーコンポーネントでのユーザー情報取得</li>
              <li>ミドルウェアによる認証保護</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          {user ? (
            <>
              <div className="rounded-md bg-green-50 p-4 text-green-700">
                <p className="font-medium">ログイン済み: {user.name}</p>
              </div>
              
              <Link
                href="/protected"
                className="rounded-md bg-blue-600 px-6 py-3 text-center text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                保護されたページへ
              </Link>
              
              <Link
                href="/api/auth/signout?callbackUrl=/"
                className="rounded-md bg-red-600 px-6 py-3 text-center text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                ログアウト
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-6 py-3 text-center text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              LIFFでログインするために/loginへ遷移する
            </Link>
          )}
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          <p>
            このサンプルは、Next.js 14 App Router、TypeScript、Auth.js、LINE LIFF、Prisma、Supabaseを使用しています。
          </p>
        </div>
      </div>
    </div>
  );
}
