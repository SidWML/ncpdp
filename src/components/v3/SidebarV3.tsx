'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconDashboard, IconSearch, IconReport, IconShield, IconSettings, IconAgents, IconChevronLeft, IconChevronRight } from '@/components/ui/Icons';

const NAV = [
  { href: '/v3',            label: 'Home',       icon: IconDashboard },
  { href: '/v3/search',     label: 'Search',     icon: IconSearch },
  { href: '/v3/reports',    label: 'Reports',    icon: IconReport },
  { href: '/v3/compliance', label: 'Compliance', icon: IconShield },
  { href: '/v3/agents',     label: 'Agents',     icon: IconAgents, badge: '33' },
  { href: '/v3/admin',      label: 'Admin',      icon: IconSettings },
];

export function Sidebar() {
  const path = usePathname();
  const [col, setCol] = useState(false);
  const w = col ? 64 : 230;
  useEffect(() => { document.documentElement.style.setProperty('--sidebar-w', `${w}px`); }, [w]);

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: w,
      background: '#0C0F1E', borderRadius: '0 20px 20px 0',
      display: 'flex', flexDirection: 'column', zIndex: 40,
      transition: 'width .2s ease', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: col ? '0' : '0 18px', justifyContent: col ? 'center' : 'space-between', flexShrink: 0 }}>
        <Link href="/v3" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 5h18M3 12h12M3 19h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          {!col && <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>dataQ<span style={{ color: '#A5B4FC' }}>.ai</span></span>}
        </Link>
        {!col && <button onClick={() => setCol(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 6 }}><IconChevronLeft size={14} color="rgba(255,255,255,.25)"/></button>}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: col ? '12px 8px' : '12px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV.map(n => {
          const active = path === n.href || (n.href !== '/v3' && path.startsWith(n.href));
          return (
            <Link key={n.href} href={n.href} className={`v3-nav ${active ? 'active' : ''}`} title={col ? n.label : undefined} style={{ justifyContent: col ? 'center' : undefined }}>
              <n.icon size={18} strokeWidth={active ? 2.2 : 1.8}/>
              {!col && (
                <>
                  <span style={{ flex: 1 }}>{n.label}</span>
                  {n.badge && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20, background: 'rgba(99,102,241,.2)', color: '#A5B4FC' }}>{n.badge}</span>}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Expand btn when collapsed */}
      {col && (
        <div style={{ padding: '12px 8px', flexShrink: 0 }}>
          <button onClick={() => setCol(false)} className="v3-nav" style={{ width: '100%', justifyContent: 'center' }}>
            <IconChevronRight size={16} color="rgba(255,255,255,.35)"/>
          </button>
        </div>
      )}

      {/* User */}
      {!col && (
        <div style={{ padding: '14px 14px', flexShrink: 0 }}>
          <div style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#fff' }}>SC</div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 550, color: '#E4E4E7' }}>Sarah Chen</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>Enterprise</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
