import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * セッションユーザーの型を拡張
   */
  interface Session {
    user: {
      id: string;
      lineId: string;
    } & DefaultSession['user'];
  }

  /**
   * ユーザーの型を拡張
   */
  interface User extends DefaultUser {
    lineId: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * JWTトークンの型を拡張
   */
  interface JWT {
    id: string;
    lineId: string;
  }
}