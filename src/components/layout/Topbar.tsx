'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconBell, IconSearch, IconUser, IconSettings, IconDatabase, IconLogoBrain } from '@/components/ui/Icons';
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

  function handleSearch(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-w)',
      right: 0,
      height: 56,
      transition: 'left .2s ease',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
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
      <div style={{ position: 'relative', width: 260 }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', color: 'var(--text-muted)' }}>
          <IconSearch size={14}/>
        </span>
        <input
          className="input-base"
          placeholder="Search pharmacies, agents…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          style={{ paddingLeft: 32, height: 36, fontSize: 13 }}
        />
      </div>

      {actions}

      {/* Notifications */}
      <Link href="/alerts" style={{
        position: 'relative',
        width: 36,
        height: 36,
        borderRadius: 6,
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
        <IconBell size={16}/>
        <span style={{
          position: 'absolute',
          top: -4,
          right: -4,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#DC2626',
          color: '#fff',
          fontSize: 10,
          fontWeight: 600,
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
            width: 36, height: 36, borderRadius: 6,
            background: 'var(--brand-600)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
          }}
        >
          <IconUser size={16} color="#fff"/>
        </button>
        {userMenuOpen && (
          <>
            <div onClick={() => setUserMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }}/>
            <div style={{
              position: 'absolute', top: 44, right: 0, width: 240, zIndex: 100,
              background: '#fff', borderRadius: 8, border: '1px solid var(--border)',
              boxShadow: '0 8px 24px rgba(0,0,0,.1)', overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Sarah Chen</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Network Director</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>sarah.chen@ncpdp.org</div>
              </div>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconDatabase size={14} color="var(--brand-600)"/>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-700)' }}>Enterprise Tier</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>99.9% SLA · Real-time · 33 Agents</div>
                </div>
              </div>
              {[
                { label: 'Settings', icon: IconSettings, href: '/settings' },
                { label: 'Agent Library', icon: IconLogoBrain, href: '/agents' },
              ].map(item => (
                <Link key={item.label} href={item.href} onClick={() => setUserMenuOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                  fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'background .1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <item.icon size={14} color="var(--text-muted)"/>
                  {item.label}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid var(--border-light)' }}>
                <button style={{
                  width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 14, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer',
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
  );
}
