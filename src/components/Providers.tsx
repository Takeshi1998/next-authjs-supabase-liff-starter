'use client';

import { SessionProvider } from 'next-auth/react';
import { LiffProvider } from '@/contexts/LiffContext';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <LiffProvider>
        {children}
      </LiffProvider>
    </SessionProvider>
  );
}