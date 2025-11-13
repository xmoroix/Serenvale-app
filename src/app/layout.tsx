import type { Metadata } from 'next';
import { ReactNode } from 'react';

import GlobalProvider from '@/layout/GlobalProvider';

export const metadata: Metadata = {
  title: 'Serenvale - AI Radiology Reporting',
  description: 'AI-Powered Radiology Reporting System',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>
        <GlobalProvider
          appearance="auto"
          isMobile={false}
          locale="fr"
        >
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
