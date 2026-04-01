'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconDashboard, IconSearch, IconReport, IconShield, IconSettings, IconChevronLeft, IconChevronRight, IconAgents } from '@/components/ui/Icons';

const NAV = [
  { href: '/v2',            label: 'Dashboard',  icon: IconDashboard },
  { href: '/v2/search',     label: 'Search',     icon: IconSearch },
  { href: '/v2/reports',    label: 'Reports',    icon: IconReport },
  { href: '/v2/compliance', label: 'Compliance', icon: IconShield },
  { href: '/v2/agents',     label: 'Agents',     icon: IconAgents, badge: '33' },
  { href: '/v2/admin',      label: 'Admin',      icon: IconSettings },
];

export function SidebarV3() {
  const path = usePathname();
  const [col, setCol] = useState(false);
  const w = col ? 64 : 220;
  useEffect(() => { document.documentElement.style.setProperty('--sidebar-w', `${w}px`); }, [w]);

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: w,
      background: '#0C0F1A', borderRadius: '0 16px 16px 0',
      display: 'flex', flexDirection: 'column', zIndex: 40,
      transition: 'width .2s ease', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: col ? '0' : '0 16px', justifyContent: col ? 'center' : 'space-between', flexShrink: 0 }}>
        <Link href="/v2" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 5h18M3 12h12M3 19h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          {!col && <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.3px' }}>dataQ<span style={{ color: '#A5B4FC' }}>.ai</span></span>}
        </Link>
        {!col && (
          <button onClick={() => setCol(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 6 }}>
            <IconChevronLeft size={14} color="rgba(255,255,255,.3)"/>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: col ? '12px 8px' : '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(n => {
          const active = path === n.href || (n.href !== '/v2' && path.startsWith(n.href));
          return (
            <Link key={n.href} href={n.href} className={`v2n ${active ? 'active' : ''}`} title={col ? n.label : undefined} style={{ justifyContent: col ? 'center' : undefined }}>
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

      {/* Collapse expand */}
      {col && (
        <div style={{ padding: '12px 8px', flexShrink: 0 }}>
          <button onClick={() => setCol(false)} className="v2n" style={{ width: '100%', justifyContent: 'center' }}>
            <IconChevronRight size={16} color="rgba(255,255,255,.4)"/>
          </button>
        </div>
      )}

      {/* User */}
      {!col && (
        <div style={{ padding: '12px 12px', flexShrink: 0 }}>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#fff' }}>SC</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 550, color: '#E4E4E7' }}>Sarah Chen</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>Enterprise</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
