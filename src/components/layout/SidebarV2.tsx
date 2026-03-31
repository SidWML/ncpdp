'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconDashboard, IconSearch, IconAgents, IconAnalytics,
  IconBell, IconShield, IconReport, IconDelivery, IconSettings,
  IconChevronLeft, IconChevronRight, IconChevronDown,
  IconCode, IconBook, IconFileCheck, IconLock, IconShieldCheck,
  IconGlobe, IconStore, IconDownload,
} from '@/components/ui/Icons';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  section: string;
  accordion?: boolean;
  defaultOpen?: boolean;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    section: 'Main',
    items: [
      { href: '/',        label: 'Dashboard',    icon: IconDashboard },
      { href: '/agents',  label: 'Agent Library', icon: IconAgents, badge: '33' },
      { href: '/alerts',  label: 'Alerts',       icon: IconBell, badge: '47', badgeColor: '#EF4444' },
    ],
  },
  {
    section: 'Search & Lookup',
    accordion: true,
    defaultOpen: true,
    items: [
      { href: '/search',           label: 'WebConnect',       icon: IconSearch },
      { href: '/pharmacy-audit',   label: 'Pharmacy Audit',   icon: IconShieldCheck },
      { href: '/geographic-search',label: 'Geographic Search', icon: IconGlobe },
      { href: '/chow',            label: 'CHOW Tracker',     icon: IconStore },
      { href: '/batch-download',   label: 'Batch Download',   icon: IconDownload },
    ],
  },
  {
    section: 'Reports & Data',
    accordion: true,
    items: [
      { href: '/reports',   label: 'OnDemand Query', icon: IconReport },
      { href: '/analytics', label: 'Analytics',      icon: IconAnalytics },
      { href: '/delivery',  label: 'Data Feeds',     icon: IconDelivery },
      { href: '/api',       label: 'API Access',     icon: IconCode },
    ],
  },
  {
    section: 'Compliance',
    accordion: true,
    items: [
      { href: '/no-surprises',  label: 'No Surprises',    icon: IconFileCheck },
      { href: '/credentialing', label: 'Credentialing',   icon: IconShieldCheck },
      { href: '/fwa',           label: 'FWA Attestation', icon: IconLock },
      { href: '/compliance',    label: 'Compliance',      icon: IconShield },
    ],
  },
  {
    section: 'Account',
    accordion: true,
    items: [
      { href: '/settings',     label: 'Settings',     icon: IconSettings },
      { href: '/starter-kits', label: 'Starter Kits', icon: IconBook },
    ],
  },
];

export function SidebarV2() {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? 60 : 240;

  // Auto-expand the accordion that contains the active page
  const getInitialOpen = () => {
    const open: Record<string, boolean> = {};
    navSections.forEach(s => {
      if (!s.accordion) return;
      const hasActive = s.items.some(i => path === i.href);
      open[s.section] = hasActive || !!s.defaultOpen;
    });
    return open;
  };
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(getInitialOpen);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', `${w}px`);
  }, [w]);

  // When path changes, auto-expand the matching accordion
  useEffect(() => {
    setOpenSections(prev => {
      const next = { ...prev };
      navSections.forEach(s => {
        if (s.accordion && s.items.some(i => path === i.href)) {
          next[s.section] = true;
        }
      });
      return next;
    });
  }, [path]);

  function toggleSection(name: string) {
    setOpenSections(prev => ({ ...prev, [name]: !prev[name] }));
  }

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: w,
      background: '#0A1128', display: 'flex', flexDirection: 'column',
      zIndex: 40, transition: 'width .2s cubic-bezier(.4,0,.2,1)',
      overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,.05)',
    }}>
      {/* Logo */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center', padding: '0 12px',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark/>
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
        {collapsed && <LogoMark/>}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: 'rgba(255,255,255,.06)', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,.4)', padding: 5, borderRadius: 6,
          display: 'flex', alignItems: 'center', transition: 'background .15s',
          flexShrink: 0, marginLeft: collapsed ? 0 : 4,
        }}>
          {collapsed ? <IconChevronRight size={13} color="rgba(255,255,255,.4)"/> : <IconChevronLeft size={13} color="rgba(255,255,255,.4)"/>}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navSections.map(({ section, accordion, items }) => {
          const isOpen = !accordion || openSections[section];
          const hasActive = items.some(i => path === i.href);

          return (
            <div key={section} style={{ marginBottom: 6 }}>
              {!collapsed && (
                accordion ? (
                  /* Accordion header — clickable */
                  <button
                    onClick={() => toggleSection(section)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 10px 6px', background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <span style={{
                      fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase',
                      color: hasActive ? '#A5B4FC' : 'rgba(255,255,255,.4)',
                    }}>
                      {section}
                    </span>
                    <span style={{
                      display: 'flex', transition: 'transform .2s',
                      transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                    }}>
                      <IconChevronDown
                        size={12}
                        color={hasActive ? '#A5B4FC' : 'rgba(255,255,255,.3)'}
                        className=""
                        strokeWidth={2}
                      />
                    </span>
                  </button>
                ) : (
                  /* Static header — not clickable */
                  <div style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,.4)', padding: '10px 10px 6px',
                  }}>
                    {section}
                  </div>
                )
              )}
              {collapsed && <div style={{ height: 8 }}/>}

              {/* Items — show if open or not accordion */}
              <div style={{
                maxHeight: collapsed ? 'none' : isOpen ? '400px' : '0px',
                overflow: 'hidden',
                transition: 'max-height .2s ease',
              }}>
                {items.map(({ href, label, icon: Icon, badge, badgeColor }) => {
                  const active = path === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`sidebar-item ${active ? 'active' : ''}`}
                      title={collapsed ? label : undefined}
                      style={{ justifyContent: collapsed ? 'center' : undefined, marginBottom: 2, padding: '7px 10px' }}
                    >
                      <span style={{ flexShrink: 0, color: active ? '#818CF8' : 'rgba(148,163,184,.65)', transition: 'color .12s' }}>
                        <Icon size={16} strokeWidth={active ? 2.2 : 1.8}/>
                      </span>
                      {!collapsed && (
                        <>
                          <span style={{ flex: 1, lineHeight: 1 }}>{label}</span>
                          {badge && (
                            <span style={{
                              background: badgeColor || 'rgba(99,102,241,.25)',
                              color: badgeColor ? '#fff' : '#a5b4fc',
                              fontSize: 10, fontWeight: 700, padding: '1px 6px',
                              borderRadius: 9999, lineHeight: 1.7,
                            }}>{badge}</span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div style={{ height: 8, flexShrink: 0 }}/>
    </aside>
  );
}

function LogoMark() {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: 8,
      background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M3 5h18M3 12h12M3 19h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
