'use client';
import React from 'react';
import Link from 'next/link';
import { IconBell, IconSearch, IconSettings } from '@/components/ui/Icons';

interface Props { title?: string; subtitle?: string; actions?: React.ReactNode; }

export function Topbar({ title, subtitle, actions }: Props) {
  return (
    <header style={{
      position: 'sticky', top: 0, height: 54,
      background: 'rgba(248,248,250,.85)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--v3-border)',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14, zIndex: 30,
    }}>
      <div style={{ flex: 1 }}>
        {title && <h1 className="v3-title" style={{ fontSize: 15 }}>{title}</h1>}
        {subtitle && <div className="v3-sub" style={{ fontSize: 11.5 }}>{subtitle}</div>}
      </div>

      {actions}

      {/* Global search */}
      <div style={{ position: 'relative', width: 200 }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
          <IconSearch size={12} color="var(--v3-text-3)"/>
        </span>
        <input className="v3-input" placeholder="Search..." style={{ paddingLeft: 30, height: 34, fontSize: 12, borderRadius: 20, background: 'var(--v3-surface-2)', border: 'none', padding: '0 12px 0 30px' }}/>
      </div>

      <Link href="/v3" style={{ position: 'relative', width: 34, height: 34, borderRadius: 10, background: 'var(--v3-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'var(--v3-text-2)', flexShrink: 0 }}>
        <IconBell size={15}/>
        <span style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: 7, background: '#EF4444', color: '#fff', fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--v3-bg)' }}>47</span>
      </Link>

      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0, cursor: 'pointer' }}>SC</div>
    </header>
  );
}
