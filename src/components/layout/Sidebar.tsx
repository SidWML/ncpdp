'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconDashboard, IconSearch, IconAgents, IconAnalytics,
  IconBell, IconShield, IconReport, IconDelivery, IconSettings,
  IconChevronLeft, IconChevronRight,
  IconCode, IconBook, IconFileCheck, IconLock, IconShieldCheck,
  IconGlobe, IconStore, IconDownload, IconFolder,
} from '@/components/ui/Icons';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const navSections: { section: string; highlighted?: boolean; items: NavItem[] }[] = [
    {
    section: 'Main',
    items: [
      { href: '/',             label: 'Dashboard',      icon: IconDashboard },
      { href: '/agents',       label: 'Agent Library',  icon: IconAgents, badge: '33' },
      { href: '/analytics',    label: 'Analytics',      icon: IconAnalytics },
      { href: '/alerts',       label: 'Alerts',         icon: IconBell, badge: '47', badgeColor: '#EF4444' },
    ],
  },
  
  {
    section: 'Tools',
    highlighted: true,
    items: [
      { href: '/search',        label: 'WebConnect',        icon: IconSearch },
      { href: '/reports',       label: 'OnDemand Query',    icon: IconReport },
      { href: '/no-surprises',  label: 'No Surprises Report', icon: IconFileCheck },
      { href: '/pharmacy-audit',label: 'Pharmacy Audit',    icon: IconShieldCheck },
      { href: '/chow',          label: 'CHOW Tracker',      icon: IconStore },
      { href: '/geographic-search', label: 'Geographic Search', icon: IconGlobe },
      { href: '/batch-download',label: 'Batch Download',    icon: IconDownload },
    ],
  },

  {
    section: 'Data',
    items: [
      { href: '/delivery',    label: 'Data Feeds',     icon: IconDelivery },
      { href: '/api',          label: 'API Access',     icon: IconCode },
    ],
  },
  {
    section: 'Compliance',
    items: [
      { href: '/compliance',    label: 'Compliance',      icon: IconShield },
      { href: '/credentialing', label: 'Credentialing',   icon: IconShieldCheck },
      { href: '/fwa',           label: 'FWA Attestation', icon: IconLock },
    ],
  },
  {
    section: 'Account',
    items: [
      { href: '/settings',      label: 'Settings',       icon: IconSettings },
      { href: '/starter-kits',  label: 'Starter Kits',   icon: IconBook },
    ],
  },
];

export function Sidebar() {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? 60 : 240;

  // Sync CSS variable so layout responds to collapse
  React.useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', `${w}px`);
  }, [w]);

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: w,
        background: '#0A1128',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        transition: 'width .2s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,.05)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255,255,255,.06)',
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px', lineHeight: 1 }}>
                dataQ<span style={{ color: '#818CF8' }}>.ai</span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 1 }}>
                by NCPDP
              </div>
            </div>
          </div>
        )}
        {collapsed && <LogoMark />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(255,255,255,.06)',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,.4)',
            padding: 5,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            transition: 'background .15s',
            flexShrink: 0,
            marginLeft: collapsed ? 0 : 4,
          }}
        >
          {collapsed
            ? <IconChevronRight size={13} color="rgba(255,255,255,.4)"/>
            : <IconChevronLeft size={13} color="rgba(255,255,255,.4)"/>
          }
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navSections.map(({ section, highlighted, items }) => (
          <div key={section} style={{ marginBottom: 2 }}>
            {!collapsed && (
              <div style={{
                fontSize: 10.5,
                fontWeight: 600,
                color: highlighted ? '#818CF8' : 'rgba(255,255,255,.25)',
                letterSpacing: '.04em',
                textTransform: 'uppercase',
                padding: '12px 10px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                {highlighted && (
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%', background: '#818CF8',
                    display: 'inline-block', flexShrink: 0,
                  }}/>
                )}
                {section}
              </div>
            )}
            {collapsed && <div style={{ height: 10 }} />}
            {items.map(({ href, label, icon: Icon, badge, badgeColor }) => {
              const active = path === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`sidebar-item ${active ? 'active' : ''}`}
                  title={collapsed ? label : undefined}
                  style={{ justifyContent: collapsed ? 'center' : undefined, marginBottom: 2 }}
                >
                  <span style={{ flexShrink: 0, color: active ? '#818CF8' : 'rgba(148,163,184,.7)', transition: 'color .12s' }}>
                    <Icon size={16} strokeWidth={active ? 2.2 : 1.8}/>
                  </span>
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, lineHeight: 1 }}>{label}</span>
                      {badge && (
                        <span style={{
                          background: badgeColor ? badgeColor : 'rgba(99,102,241,.25)',
                          color: badgeColor ? '#fff' : '#a5b4fc',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 9999,
                          lineHeight: 1.7,
                          letterSpacing: 0,
                        }}>
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom spacer */}
      <div style={{ height: 8, flexShrink: 0 }}/>
    </aside>
  );
}

function LogoMark() {
  return (
    <div style={{
      width: 30,
      height: 30,
      borderRadius: 8,
      background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M3 5h18M3 12h12M3 19h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
