'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconBell, IconSearch, IconUser, IconList, IconSettings, IconDatabase, IconLogoBrain, IconSparkles } from '@/components/ui/Icons';
import { tickerMessages } from '@/lib/mockData';
import { useSidebarVersion } from '@/lib/sidebar-context';

interface TopbarProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  const [query, setQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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


        {/* V2 Product Link */}
        {/* <Link href="/v2" style={{
          height: 34, padding: '0 12px', borderRadius: 8,
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          color: '#fff', fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
          textDecoration: 'none',
        }}>
          <IconSparkles size={12} color="#fff"/> Try V2
        </Link> */}

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

        {/* Avatar + dropdown */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setUserMenuOpen(o => !o)}
            style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            <IconUser size={15} color="#fff"/>
          </button>
          {userMenuOpen && (
            <>
              <div onClick={() => setUserMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }}/>
              <div style={{
                position: 'absolute', top: 42, right: 0, width: 240, zIndex: 100,
                background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB',
                boxShadow: '0 8px 24px rgba(0,0,0,.1)', overflow: 'hidden',
              }}>
                {/* User info */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Sarah Chen</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>Network Director</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>sarah.chen@ncpdp.org</div>
                </div>
                {/* Tier */}
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconDatabase size={13} color="#4F46E5"/>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5' }}>Enterprise Tier</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>99.9% SLA · Real-time · 33 Agents</div>
                  </div>
                </div>
                {/* Menu items */}
                {[
                  { label: 'Settings', icon: IconSettings, href: '/settings' },
                  { label: 'Agent Library', icon: IconLogoBrain, href: '/agents' },
                ].map(item => (
                  <Link key={item.label} href={item.href} onClick={() => setUserMenuOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
                    fontSize: 13, color: '#374151', textDecoration: 'none', transition: 'background .1s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <item.icon size={14} color="#6B7280"/>
                    {item.label}
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid #F3F4F6' }}>
                  <button style={{
                    width: '100%', padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 13, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}
