import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

// LINE IDトークンを検証する関数
async function verifyLINEIdToken(idToken: string) {
  try {
    // LINE IDトークン検証エンドポイント
    const verifyEndpoint = 'https://api.line.me/oauth2/v2.1/verify';
    
    // IDトークンを検証
    const response = await fetch(verifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        id_token: idToken,
        client_id: process.env.LINE_CHANNEL_ID || '',
      }),
    });

    if (!response.ok) {
      throw new Error('IDトークンの検証に失敗しました');
    }

    // 検証結果を取得
    const data = await response.json();
    
    return {
      lineId: data.sub,
      name: data.name,
      email: data.email || null,
    };
  } catch (error) {
    console.error('LINE IDトークン検証エラー:', error);
    throw new Error('IDトークンの検証に失敗しました');
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'liff',
      name: 'LINE LIFF',
      credentials: {
        idToken: { label: 'ID Token', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.idToken) {
            return null;
          }

          // IDトークンを検証
          const userInfo = await verifyLINEIdToken(credentials.idToken);
          
          if (!userInfo || !userInfo.lineId) {
            return null;
          }

          // ユーザー情報をデータベースに保存（アップサート）
          const user = await prisma.user.upsert({
            where: { lineId: userInfo.lineId },
            update: {
              name: userInfo.name,
              email: userInfo.email,
            },
            create: {
              lineId: userInfo.lineId,
              name: userInfo.name,
              email: userInfo.email,
            },
          });

          return {
            id: user.id,
            lineId: user.lineId,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error('認証エラー:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7日間
  },
  callbacks: {
    async jwt({ token, user }) {
      // 初回ログイン時にユーザー情報をトークンに追加
      if (user) {
        token.id = user.id;
        token.lineId = user.lineId;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // トークンからセッションにユーザー情報を追加
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.lineId = token.lineId as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};