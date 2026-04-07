import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { RootShell } from '@/components/layout/RootShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DataSolutions.ai — Pharmacy Data Intelligence Platform',
  description: 'AI-powered pharmacy network management, credentialing, and compliance monitoring by NCPDP.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, minHeight: '100vh', background: 'var(--bg)' }}>
        <RootShell>
          {children}
        </RootShell>
      </body>
    </html>
  );
}
