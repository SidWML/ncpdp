'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconBell, IconSearch, IconUser, IconList } from '@/components/ui/Icons';
import { tickerMessages } from '@/lib/mockData';
import { useSidebarVersion } from '@/lib/sidebar-context';

interface TopbarProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { version, toggle: toggleSidebar } = useSidebarVersion();
  const doubled = [...tickerMessages, ...tickerMessages];

  function handleSearch(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <>
      {/* Ticker */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 'var(--sidebar-w)',
        right: 0,
        height: 28,
        background: '#0F1A3E',
        display: 'flex',
        alignItems: 'center',
        zIndex: 39,
        overflow: 'hidden',
        transition: 'left .2s ease',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 14px',
          borderRight: '1px solid rgba(255,255,255,.07)',
          flexShrink: 0,
          height: '100%',
        }}>
          <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}/>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,.45)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Live</span>
        </div>
        <div className="ticker-wrap" style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
          <span className="animate-ticker" style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'inline-flex', alignItems: 'center' }}>
            {doubled.map((msg, i) => (
              <span key={i} style={{ marginRight: 56, whiteSpace: 'nowrap' }}>{msg}</span>
            ))}
          </span>
        </div>
      </div>

      {/* Topbar */}
      <header style={{
        position: 'fixed',
        top: 28,
        left: 'var(--sidebar-w)',
        right: 0,
        height: 56,
        transition: 'left .2s ease',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 12,
        zIndex: 39,
      }}>
        <div style={{ flex: 1 }}>
          {title && (
            <div>
              <div className="page-title">{title}</div>
              {subtitle && <div className="page-subtitle">{subtitle}</div>}
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 240 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', color: 'var(--text-muted)' }}>
            <IconSearch size={13}/>
          </span>
          <input
            className="input-base"
            placeholder="Search pharmacies, agents…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            style={{ paddingLeft: 30, height: 34, fontSize: 12.5 }}
          />
        </div>

        {actions}

        {/* Sidebar version toggle */}
        <button
          onClick={toggleSidebar}
          title={version === 'v1' ? 'Switch to V2 sidebar' : 'Switch to V1 sidebar'}
          style={{
            height: 34, padding: '0 10px', borderRadius: 8,
            background: version === 'v2' ? '#EEF2FF' : 'var(--surface-2)',
            border: `1px solid ${version === 'v2' ? '#C7D2FE' : 'var(--border)'}`,
            color: version === 'v2' ? '#4F46E5' : 'var(--text-secondary)',
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
          }}
        >
          <IconList size={13}/> {version === 'v2' ? 'V2' : 'V1'}
        </button>

        {/* Notifications */}
        <Link href="/alerts" style={{
          position: 'relative',
          width: 34,
          height: 34,
          borderRadius: 8,
          background: 'var(--surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border)',
          textDecoration: 'none',
          color: 'var(--text-secondary)',
          flexShrink: 0,
          transition: 'border-color .15s',
        }}>
          <IconBell size={15}/>
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 15,
            height: 15,
            borderRadius: '50%',
            background: '#EF4444',
            color: '#fff',
            fontSize: 9,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--surface)',
          }}>47</span>
        </Link>

        {/* Avatar */}
        <Link href="/settings" style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          textDecoration: 'none',
        }}>
          <IconUser size={15} color="#fff"/>
        </Link>
      </header>
    </>
  );
}
