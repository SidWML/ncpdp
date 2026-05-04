'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/v3/TopbarV3';
import {
  IconSearch, IconReport, IconShield, IconFileCheck, IconGlobe, IconDownload,
  IconSparkles, IconSend, IconTrendUp, IconTrendDown, IconAlertTriangle,
  IconCheck, IconStore, IconChevronRight, IconBarChart,
} from '@/components/ui/Icons';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

/* Data */
const TREND = [{ m: 'O', v: 65800 },{ m: 'N', v: 66100 },{ m: 'D', v: 66700 },{ m: 'J', v: 67200 },{ m: 'F', v: 67800 },{ m: 'M', v: 81500 }];
const CRED = [{ n: 'Active', v: 64238, c: '#76C799' },{ n: 'Expiring', v: 2841, c: '#FBBF24' },{ n: 'Expired', v: 1168, c: '#EF4444' }];
const HEALTH = [
  { l: 'DEA',     v: 98, c: '#449055' }, { l: 'Network', v: 96, c: '#449055' },
  { l: 'FWA',     v: 91, c: '#D97706' }, { l: 'NSA',     v: 99, c: '#449055' },
];
const EXAMPLES = [
  { title: 'DEA Expirations', desc: 'Show pharmacies with DEA expiring in 30 days across all networks', icon: IconShield, color: '#DC2626' },
  { title: 'Network Adequacy', desc: 'Analyze coverage gaps and adequacy status by state', icon: IconGlobe, color: '#449055' },
  { title: 'FWA Attestation', desc: 'Which pharmacies have overdue fraud, waste & abuse attestations?', icon: IconAlertTriangle, color: '#D97706' },
  { title: 'Ownership Changes', desc: 'Show recent pharmacy ownership transfers and affected networks', icon: IconStore, color: '#005C8D' },
];
const ACTIVITY = [
  { icon: IconAlertTriangle, c: '#DC2626', bg: '#FEF2F2', t: 'DEA Expiring: CareRx Pharmacy #0842', s: '12 days remaining -- 3 networks affected', time: '2m' },
  { icon: IconStore,         c: '#D97706', bg: '#FFFBEB', t: 'Ownership Changed: Valley Rx Solutions', s: 'Smith Family Pharmacy to Rite Aid Corp', time: '14m' },
  { icon: IconSparkles,      c: '#005C8D', bg: '#E8F3F9', t: 'Agent completed: Weekly network scan', s: '247 pharmacies flagged across 12 states', time: '28m' },
  { icon: IconCheck,         c: '#449055', bg: '#ECFDF5', t: 'NSA Q1 report validated', s: '38,569 pharmacies ready for regulatory submission', time: '2h' },
  { icon: IconAlertTriangle, c: '#DC2626', bg: '#FEF2F2', t: 'FWA Overdue: 6 pharmacies', s: 'Midwest Chain #44, SunHealth + 4 more', time: '3h' },
];
const SHORTCUTS = [
  { l: 'Search',     i: IconSearch,    h: '/v3/search',     c: '#005C8D', bg: '#E8F3F9' },
  { l: 'Reports',    i: IconReport,    h: '/v3/reports',    c: '#449055', bg: '#ECFDF5' },
  { l: 'Compliance', i: IconShield,    h: '/v3/compliance', c: '#DC2626', bg: '#FEF2F2' },
  { l: 'Geographic', i: IconGlobe,     h: '/v3/search',     c: '#005C8D', bg: '#E8F3F9' },
  { l: 'Downloads',  i: IconDownload,  h: '/v3/admin',      c: '#004870', bg: '#E8F3F9' },
  { l: 'Analytics',  i: IconBarChart,  h: '/v3/reports',    c: '#D97706', bg: '#FFFBEB' },
];

export default function DashboardV3() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSubmit() {
    if (query.trim()) router.push(`/v3/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <>
      <Topbar title="Home" actions={
        <Link href="/" style={{ fontSize: 12, color: 'var(--v3-text-3)', textDecoration: 'none' }}>V1</Link>
      }/>
      <main style={{ padding: '0 24px 40px' }}>

        {/* AI HERO */}
        <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 48, paddingBottom: 36, textAlign: 'center' }}>
          {/* Sparkle icon */}
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#005C8D,#76C799)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 20px rgba(0,92,141,.25)' }}>
            <IconSparkles size={28} color="#fff"/>
          </div>
          <div style={{ fontSize: 13, color: 'var(--v3-accent)', fontWeight: 600, marginBottom: 6 }}>Good to see you!</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--v3-text)', margin: '0 0 8px', letterSpacing: '-.4px', lineHeight: 1.3 }}>
            What would you like to know about<br/>your pharmacy network?
          </h1>
          <p style={{ fontSize: 14, color: 'var(--v3-text-3)', margin: '0 0 24px', lineHeight: 1.5 }}>
            Search 81,500 pharmacies, generate reports, check compliance, and more
          </p>

          {/* AI Prompt */}
          <div className="v3-prompt" style={{ textAlign: 'left' }}>
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              placeholder="Ask anything..."
              rows={1}
              style={{
                width: '100%', border: 'none', outline: 'none', resize: 'none',
                fontSize: 15, color: 'var(--v3-text)', background: 'transparent',
                fontFamily: 'inherit', lineHeight: 1.5, minHeight: 24, maxHeight: 120,
              }}
              onInput={e => { const el = e.currentTarget; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="v3-btn v3-btn-ghost" style={{ padding: '4px 8px', borderRadius: 8, fontSize: 12, color: 'var(--v3-text-3)' }}>
                  <IconSearch size={13}/> Search
                </button>
                <button className="v3-btn v3-btn-ghost" style={{ padding: '4px 8px', borderRadius: 8, fontSize: 12, color: 'var(--v3-text-3)' }}>
                  <IconReport size={13}/> Reports
                </button>
                <button className="v3-btn v3-btn-ghost" style={{ padding: '4px 8px', borderRadius: 8, fontSize: 12, color: 'var(--v3-text-3)' }}>
                  <IconShield size={13}/> Compliance
                </button>
              </div>
              <button onClick={handleSubmit} className="v3-btn v3-btn-accent" style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12.5 }}>
                <IconSend size={13} color="#fff"/> Send
              </button>
            </div>
          </div>

          {/* Example prompts */}
          <div style={{ marginTop: 20, textAlign: 'left' }}>
            <div style={{ fontSize: 12, color: 'var(--v3-text-3)', fontWeight: 500, marginBottom: 10 }}>Get started with an example</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {EXAMPLES.map(ex => (
                <button key={ex.title} onClick={() => { setQuery(ex.desc); }}
                  className="v3-card v3-card-hover" style={{
                    padding: '14px 16px', textAlign: 'left', cursor: 'pointer',
                    border: 'none', display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${ex.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <ex.icon size={16} color={ex.color}/>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v3-text)', marginBottom: 2 }}>{ex.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--v3-text-3)', lineHeight: 1.4 }}>{ex.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* METRICS + HEALTH STRIP */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
          {/* Hero stat card */}
          <div className="v3-hero-card" style={{ padding: '18px 24px', flex: 1.2, position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.6)', marginBottom: 4 }}>Total Pharmacies</div>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.5px', marginBottom: 2 }}>81,500</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <IconTrendUp size={10} color="rgba(255,255,255,.7)"/> +312 this month
            </div>
            <div style={{ position: 'absolute', right: 16, bottom: 8, width: 120, height: 50, opacity: .4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND}><defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff" stopOpacity={.4}/><stop offset="100%" stopColor="#fff" stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="v" stroke="rgba(255,255,255,.6)" strokeWidth={1.5} fill="url(#hg)"/></AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Credential donut */}
          <div className="v3-card" style={{ padding: '14px 18px', flex: 1, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={CRED} cx="50%" cy="50%" innerRadius={20} outerRadius={28} paddingAngle={2} dataKey="v" strokeWidth={0}>{CRED.map((d,i) => <Cell key={i} fill={d.c}/>)}</Pie></PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'var(--v3-text)' }}>94%</div>
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--v3-text)', marginBottom: 4 }}>Credentials</div>
              {CRED.map(d => (
                <div key={d.n} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, marginBottom: 1 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: d.c }}/>
                  <span style={{ color: 'var(--v3-text-2)' }}>{d.n}</span>
                  <span style={{ color: 'var(--v3-text-3)', marginLeft: 'auto' }}>{d.v.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Health scores */}
          <div className="v3-card" style={{ padding: '14px 18px', flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
            {HEALTH.map(h => (
              <div key={h.l} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ position: 'relative', width: 38, height: 38, margin: '0 auto 4px' }}>
                  <svg width={38} height={38} viewBox="0 0 38 38">
                    <circle cx="19" cy="19" r="15" fill="none" stroke="var(--v3-surface-2)" strokeWidth="3"/>
                    <circle cx="19" cy="19" r="15" fill="none" stroke={h.c} strokeWidth="3" strokeDasharray={`${h.v * .942} 94.2`} strokeLinecap="round" transform="rotate(-90 19 19)"/>
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700, color: h.c }}>{h.v}</div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--v3-text-3)', fontWeight: 500 }}>{h.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SHORTCUTS + ACTIVITY */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Quick shortcuts */}
          <div>
            <div className="v3-section">Quick Access</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {SHORTCUTS.map(s => (
                <Link key={s.l} href={s.h} className="v3-card v3-card-hover" style={{
                  padding: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <s.i size={16} color={s.c}/>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 550, color: 'var(--v3-text)' }}>{s.l}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="v3-section" style={{ marginBottom: 0 }}>Activity</div>
              <button className="v3-btn v3-btn-ghost" style={{ fontSize: 11, marginBottom: 12 }}>View All</button>
            </div>
            <div className="v3-card" style={{ overflow: 'hidden' }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '10px 14px', alignItems: 'flex-start',
                  borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--v3-border-lt)' : 'none',
                  cursor: 'pointer', transition: 'background .06s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFBFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <a.icon size={13} color={a.c}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--v3-text)' }}>{a.t}</div>
                    <div style={{ fontSize: 11, color: 'var(--v3-text-3)' }}>{a.s}</div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--v3-text-4)', flexShrink: 0, marginTop: 2 }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
