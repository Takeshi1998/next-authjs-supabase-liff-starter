'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import liff from '@line/liff';

// LIFFコンテキストの型定義
interface LiffContextType {
  isInitialized: boolean;
  isLoggedIn: boolean;
  liffObject: typeof liff | null;
  error: Error | null;
  getIdToken: () => Promise<string | null>;
}

// デフォルト値
const defaultContextValue: LiffContextType = {
  isInitialized: false,
  isLoggedIn: false,
  liffObject: null,
  error: null,
  getIdToken: async () => null,
};

// コンテキストの作成
const LiffContext = createContext<LiffContextType>(defaultContextValue);

// コンテキストプロバイダーのprops型
interface LiffProviderProps {
  children: ReactNode;
}

// LIFFプロバイダーコンポーネント
export function LiffProvider({ children }: LiffProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // LIFF SDKの初期化
  useEffect(() => {
    // すでに初期化されている場合は何もしない
    if (isInitialized) return;

    // LIFF IDが設定されていない場合はエラー
    const myLiffId = process.env.NEXT_PUBLIC_LIFF_ID;

    if (!myLiffId) {
      setError(new Error('LIFF IDが設定されていません'));
      return;
    }

    // LIFF SDKの初期化処理
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: myLiffId });
        setIsInitialized(true);
        setIsLoggedIn(liff.isLoggedIn());
      } catch (err) {
        setError(err instanceof Error ? err : new Error('LIFF初期化エラー'));
      }
    };

    initializeLiff();
  }, [isInitialized]);

  // IDトークンを取得する関数
  const getIdToken = async (): Promise<string | null> => {
    if (!isInitialized || !isLoggedIn) {
      return null;
    }
    try {
      return liff.getIDToken() || null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('IDトークン取得エラー'));
      return null;
    }
  };

  // コンテキスト値
  const contextValue: LiffContextType = {
    isInitialized,
    isLoggedIn,
    liffObject: isInitialized ? liff : null,
    error,
    getIdToken,
  };

  return <LiffContext.Provider value={contextValue}>{children}</LiffContext.Provider>;
}

// LIFFコンテキストを使用するためのカスタムフック
export function useLiff() {
  const context = useContext(LiffContext);
  if (context === undefined) {
    throw new Error('useLiff must be used within a LiffProvider');
  }
  return context;
}