'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLiff } from '@/contexts/LiffContext';

export default function LoginPage() {
  const router = useRouter();
  
  const { isInitialized, isLoggedIn, liffObject, error, getIdToken } = useLiff();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // LIFF初期化後の処理
  useEffect(() => {
    // LIFF初期化中または未ログインの場合は何もしない
    if (!isInitialized) return;

    // LINEにログインしていない場合はLINEログインを実行
    if (!isLoggedIn && liffObject) {
      liffObject.login({ redirectUri: window.location.href });
      return;
    }

    // LINEにログイン済みの場合はIDトークンを取得してサインイン
    const handleSignIn = async () => {
      try {
        setIsLoading(true);
        setAuthError(null);

        // IDトークンを取得
        const idToken = await getIdToken();
        if (!idToken) {
          setAuthError('IDトークンの取得に失敗しました');
          return;
        }

        // Auth.jsでサインイン
        const result = await signIn('liff', {
          idToken,
          redirect: false,
        });

        if (result?.error) {
          setAuthError(result.error);
        } else if (result?.url) {
          // 認証成功時はリダイレクト
          router.push(result.url);
        }
      } catch (err) {
        setAuthError('認証中にエラーが発生しました');
        console.error('認証エラー:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // 自動サインイン実行
    handleSignIn();
  }, [isInitialized, isLoggedIn, liffObject, getIdToken, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">LINEでログイン</h1>
        
        {/* ローディング表示 */}
        {isLoading && (
          <div className="mb-4 text-center">
            <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
            <p>認証中...</p>
          </div>
        )}
        
        {/* エラー表示 */}
        {(error || authError) && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
            <p>{error?.message || authError}</p>
          </div>
        )}
        
        {/* LIFF初期化待ち */}
        {!isInitialized && !error && (
          <p className="text-center text-gray-600">LINEと通信中...</p>
        )}
        
        {/* 手動ログインボタン */}
        {isInitialized && isLoggedIn && !isLoading && !authError && (
          <button
            onClick={() => router.push('/protected')}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            続行する
          </button>
        )}
      </div>
    </div>
  );
}
