'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconDashboard, IconSearch, IconAgents, IconAnalytics,
  IconBell, IconShield, IconReport, IconDelivery, IconSettings,
  IconChevronLeft, IconChevronRight,
  IconCode, IconBook, IconFileCheck, IconLock, IconShieldCheck,
  IconGlobe, IconStore, IconDownload, IconFolder, IconLogoBrain,
} from '@/components/ui/Icons';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const navSections: { section: string; items: NavItem[] }[] = [
    {
    section: 'Main',
    items: [
      { href: '/',             label: 'Dashboard',       icon: IconDashboard },
      { href: '/ai-search',   label: 'AI Smart Search',  icon: IconLogoBrain, badge: 'AI', badgeColor: '#449055' },
      { href: '/ai-reports',  label: 'AI Report Builder', icon: IconReport, badge: 'AI', badgeColor: '#449055' },
      { href: '/agents',       label: 'Agent Library',   icon: IconAgents, badge: '33' },
      { href: '/analytics',    label: 'Analytics',       icon: IconAnalytics },
      { href: '/alerts',       label: 'Alerts',          icon: IconBell, badge: '47', badgeColor: '#DC2626' },
    ],
  },

  {
    section: 'Tools',
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
  const w = collapsed ? 60 : 248;

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
        background: '#0A1628',
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
          padding: '0 14px',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255,255,255,.06)',
          flexShrink: 0,
        }}
      >
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            style={{
              background: 'rgba(255,255,255,.06)', border: 'none', cursor: 'pointer',
              padding: 0, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, overflow: 'hidden',
            }}
          >
            {/* Globe-only crop via background-image positioning */}
            <div style={{
              width: 28, height: 28,
              backgroundImage: 'url(/pharmacyfocus-logo.png)',
              backgroundSize: 'auto 28px',          /* match container height */
              backgroundPosition: 'left center',     /* show leftmost portion (the globe) */
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0) invert(1)',
            }}/>
          </button>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/pharmacyfocus-logo.png"
                alt="PharmacyFocus"
                style={{ height: 32, width: 'auto', filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <button
              onClick={() => setCollapsed(true)}
              style={{
                background: 'rgba(255,255,255,.06)', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,.4)', padding: 5, borderRadius: 6,
                display: 'flex', alignItems: 'center', flexShrink: 0,
              }}
            >
              <IconChevronLeft size={13} color="rgba(255,255,255,.4)"/>
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navSections.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 2 }}>
            {!collapsed && (
              <div style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'rgba(255,255,255,.25)',
                letterSpacing: '.04em',
                textTransform: 'uppercase',
                padding: '14px 12px 6px',
              }}>
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
                  style={{ justifyContent: collapsed ? 'center' : undefined, marginBottom: 1 }}
                >
                  <span style={{ flexShrink: 0, color: active ? '#76C799' : 'rgba(148,163,184,.7)', transition: 'color .12s' }}>
                    <Icon size={16} strokeWidth={active ? 2 : 1.7}/>
                  </span>
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, lineHeight: 1 }}>{label}</span>
                      {badge && (
                        <span style={{
                          background: badgeColor ? badgeColor : 'rgba(0,92,141,.25)',
                          color: badgeColor ? '#fff' : '#8FC2D8',
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: 4,
                          lineHeight: 1.7,
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

      <div style={{ height: 8, flexShrink: 0 }}/>
    </aside>
  );
}
