import { PrismaClient } from '@prisma/client';

// PrismaClientのグローバルインスタンスを宣言
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 開発環境でのホットリロードによる多重インスタンス化を防ぐ
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// 開発環境でのみグローバル変数にPrismaClientを保存
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}