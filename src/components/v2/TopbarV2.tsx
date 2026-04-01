'use client';
import React from 'react';
import Link from 'next/link';
import { IconBell, IconSearch, IconSparkles } from '@/components/ui/Icons';

interface Props { title?: string; subtitle?: string; actions?: React.ReactNode; }

export function TopbarV2({ title, subtitle, actions }: Props) {
  return (
    <header style={{
      position: 'sticky', top: 0, height: 52, background: 'rgba(255,255,255,.8)',
      backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--v2-border)',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12, zIndex: 30,
    }}>
      <div style={{ flex: 1 }}>
        {title && <h1 className="v2-title" style={{ fontSize: 15 }}>{title}</h1>}
        {subtitle && <div className="v2-sub">{subtitle}</div>}
      </div>

      {actions}

      {/* Search pill */}
      <div style={{ position: 'relative', width: 200 }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
          <IconSearch size={12} color="var(--v2-text-3)"/>
        </span>
        <input className="v2i" placeholder="Search..." style={{ paddingLeft: 30, height: 32, fontSize: 12, borderRadius: 20, background: 'var(--v2-surface-2)', border: 'none' }}/>
      </div>

      <button className="v2b v2b-p" style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12 }}>
        <IconSparkles size={13} color="#fff"/> Ask AI
      </button>

      <Link href="/v2" style={{ position: 'relative', width: 32, height: 32, borderRadius: 9, background: 'var(--v2-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'var(--v2-text-2)', flexShrink: 0 }}>
        <IconBell size={14}/>
        <span style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: 7, background: '#EF4444', color: '#fff', fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>47</span>
      </Link>

      <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0, cursor: 'pointer' }}>SC</div>
    </header>
  );
}
