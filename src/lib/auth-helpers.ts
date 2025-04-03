import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

/**
 * サーバーコンポーネントからセッション情報を取得するヘルパー関数
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * サーバーコンポーネントから現在のユーザー情報を取得するヘルパー関数
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * 認証後のみアクセスできるページのサーバーコンポーネントから現在のユーザー情報を取得するヘルパー関数
 */
export async function getCurrentUserOrThrow() {
  const session = await getSession();
  if (!session) {
    throw new Error('ログインしていません');
  }
  return session.user;
}