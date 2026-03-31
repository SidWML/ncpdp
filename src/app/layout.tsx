import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/lib/sidebar-context';
import { SidebarSwitch } from '@/components/layout/SidebarSwitch';
import { NCPDPBuddy } from '@/components/dashboard/NCPDPBuddy';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'dataQ.ai — Pharmacy Data Intelligence Platform',
  description: 'AI-powered pharmacy network management, credentialing, and compliance monitoring by NCPDP.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, minHeight: '100vh', background: 'var(--bg)' }}>
        <SidebarProvider>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SidebarSwitch />
            <div
              style={{
                marginLeft: 'var(--sidebar-w)',
                width: 'calc(100vw - var(--sidebar-w))',
                maxWidth: 'calc(100vw - var(--sidebar-w))',
                overflowX: 'hidden',
                minWidth: 0,
                paddingTop: 84, /* 28px ticker + 56px topbar */
                transition: 'margin-left .2s ease, width .2s ease, max-width .2s ease',
              }}
            >
              {children}
            </div>
            <NCPDPBuddy />
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
