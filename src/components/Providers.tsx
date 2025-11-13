'use client';

import { ThemeProvider } from '@lobehub/ui';
import type { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
