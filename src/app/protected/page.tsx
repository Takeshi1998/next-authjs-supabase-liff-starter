import { getCurrentUserOrThrow } from '@/lib/auth-helpers';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function ProtectedPage() {
  // サーバーコンポーネントからユーザー情報を取得
  const authUser = await getCurrentUserOrThrow();

  // supabaseのテーブルからprisma経由でユーザー情報を取得
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: authUser.id,
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">保護されたページ</h1>
        
        {user ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 text-green-700">
              <p className="font-medium">認証済みユーザー</p>
            </div>
            
            <div className="space-y-2">
              <p><span className="font-semibold">ID:</span> {user.id}</p>
              <p><span className="font-semibold">LINE ID:</span> {user.lineId}</p>
              <p><span className="font-semibold">名前:</span> {user.name}</p>
              {user.email && (
                <p><span className="font-semibold">メール:</span> {user.email}</p>
              )}
            </div>
            
            <div className="pt-4">
              <Link
                href="/api/auth/signout?callbackUrl=/"
                className="block w-full rounded-md bg-red-600 px-4 py-2 text-center text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                ログアウト
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-yellow-50 p-4 text-yellow-700">
            <p>ユーザー情報を取得できませんでした。</p>
          </div>
        )}
        
        <div className="mt-6">
          <Link
            href="/"
            className="block text-center text-blue-600 hover:text-blue-800"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}