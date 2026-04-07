'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/lib/sidebar-context';
import { SidebarSwitch } from '@/components/layout/SidebarSwitch';
import { NCPDPBuddy } from '@/components/dashboard/NCPDPBuddy';

export function RootShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isV2 = path.startsWith('/v2') || path.startsWith('/v3');

  if (isV2) {
    // V2 has its own layout — render children directly, no V1 chrome
    return <>{children}</>;
  }

  const hideBuddy = path === '/ai-search' || path === '/ai-reports';

  return (
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
            paddingTop: 56,
            transition: 'margin-left .2s ease, width .2s ease, max-width .2s ease',
          }}
        >
          {children}
        </div>
        {!hideBuddy && <NCPDPBuddy />}
      </div>
    </SidebarProvider>
  );
}
