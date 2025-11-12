import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Serenvale - AI Radiology Reporting',
  description: 'AI-Powered Radiology Reporting System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
