'use client';
import React from 'react';
import Link from 'next/link';
import { TopbarV2 } from '@/components/v2/TopbarV2';
import {
  IconTrendUp, IconTrendDown, IconChevronRight, IconAlertTriangle,
  IconCheck, IconSparkles, IconStore, IconSearch, IconReport,
  IconFileCheck, IconGlobe, IconDownload, IconShield, IconBell,
} from '@/components/ui/Icons';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from 'recharts';

/* Data */
const TREND = [
  { m: 'Oct', v: 65800 }, { m: 'Nov', v: 66100 }, { m: 'Dec', v: 66700 },
  { m: 'Jan', v: 67200 }, { m: 'Feb', v: 67800 }, { m: 'Mar', v: 81500 },
];
const CRED = [
  { name: 'Active', value: 64238, color: '#76C799' },
  { name: 'Expiring', value: 2841, color: '#FBBF24' },
  { name: 'Expired', value: 1168, color: '#EF4444' },
];
const BY_TYPE = [
  { type: 'Retail', count: 38420 }, { type: 'Specialty', count: 12840 },
  { type: 'Chain', count: 8960 },   { type: 'Compounding', count: 4210 },
  { type: 'Mail', count: 2180 },    { type: 'LTC', count: 1637 },
];
const ACTIVITY = [
  { icon: IconAlertTriangle, c: '#DC2626', bg: '#FEF2F2', t: 'DEA Expiring: CareRx Pharmacy #0842', s: '12 days remaining', time: '2m ago' },
  { icon: IconStore,         c: '#D97706', bg: '#FFFBEB', t: 'Ownership Changed: Valley Rx Solutions', s: 'Smith Family to Rite Aid Corp', time: '14m ago' },
  { icon: IconSparkles,      c: '#005C8D', bg: '#E8F3F9', t: 'Agent completed: Weekly network scan', s: '247 pharmacies flagged', time: '28m ago' },
  { icon: IconAlertTriangle, c: '#DC2626', bg: '#FEF2F2', t: 'FWA Overdue: 6 pharmacies', s: 'Midwest Chain #44 + 5 more', time: '1h ago' },
  { icon: IconCheck,         c: '#449055', bg: '#ECFDF5', t: 'NSA Q1 report validated', s: '38,569 pharmacies ready', time: '2h ago' },
  { icon: IconSparkles,      c: '#005C8D', bg: '#E8F3F9', t: 'Agent completed: Credential audit', s: '89 DEA, 112 license issues', time: '3h ago' },
];
const CHANGES = [
  { id: '1234567', name: 'CareRx Pharmacy #0842',     type: 'DEA Expiring',     impact: '3 networks', s: 'urgent' },
  { id: '3987234', name: 'Valley Rx Solutions #2',    type: 'Ownership Change', impact: '2 networks', s: 'pending' },
  { id: '5021847', name: 'Sunrise Compounding Ctr',   type: 'License Renewed',  impact: '1 network',  s: 'ok' },
  { id: '6789013', name: 'Bayou Pharmacy Partners',   type: 'Closed',           impact: '2 networks', s: 'urgent' },
  { id: '9012847', name: 'Mountain View Clinical Rx', type: 'Accreditation Due',impact: '6 networks', s: 'pending' },
];
const HEALTH = [
  { l: 'DEA Compliance',   v: 98, c: '#449055', total: '64,238 active' },
  { l: 'Network Adequacy', v: 96, c: '#449055', total: '64/67 pass' },
  { l: 'FWA Attestation',  v: 91, c: '#D97706', total: '6 under review' },
  { l: 'NSA Readiness',    v: 99, c: '#449055', total: '38,522 validated' },
];
const LAUNCH = [
  { l: 'Search',        i: IconSearch,    h: '/v2/search',     c: '#005C8D', b: '#E8F3F9' },
  { l: 'Reports',       i: IconReport,    h: '/v2/reports',    c: '#449055', b: '#ECFDF5' },
  { l: 'Compliance',    i: IconShield,    h: '/v2/compliance', c: '#DC2626', b: '#FEF2F2' },
  { l: 'No Surprises',  i: IconFileCheck, h: '/v2/compliance', c: '#D97706', b: '#FFFBEB' },
  { l: 'Geographic',    i: IconGlobe,     h: '/v2/search',     c: '#005C8D', b: '#E8F3F9' },
  { l: 'Downloads',     i: IconDownload,  h: '/v2/admin',      c: '#004870', b: '#E8F3F9' },
];

const sb = (s: string) => s === 'urgent' ? <span className="v2g v2g-err">Urgent</span> : s === 'pending' ? <span className="v2g v2g-w">Pending</span> : <span className="v2g v2g-ok">Done</span>;

export default function DashboardV2() {
  return (
    <>
      <TopbarV2 title="Dashboard" actions={
        <Link href="/" style={{ fontSize: 12, color: 'var(--v2-text-3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Switch to V1 <IconChevronRight size={11}/>
        </Link>
      }/>
      <main style={{ padding: '16px 20px 40px' }}>

        {/* ROW 1: Greeting + Metrics inline */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--v2-text)', margin: 0, letterSpacing: '-.3px' }}>Good morning, Sarah</h2>
            <p style={{ fontSize: 13, color: 'var(--v2-text-3)', margin: '2px 0 0' }}>Tuesday, March 31, 2026</p>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { l: 'Pharmacies', v: '81,500', d: '+312', up: true },
              { l: 'Compliant', v: '94.2%', d: '+1.3%', up: true },
              { l: 'Alerts', v: '47', d: '-8', up: false },
              { l: 'API Calls', v: '1.24M', d: '+18%', up: true },
            ].map(m => (
              <div key={m.l} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10.5, color: 'var(--v2-text-3)', fontWeight: 500, marginBottom: 2 }}>{m.l}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--v2-text)', letterSpacing: '-.3px' }}>{m.v}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: m.up ? 'var(--v2-green)' : 'var(--v2-red)', display: 'flex', alignItems: 'center', gap: 2 }}>
                    {m.up ? <IconTrendUp size={9}/> : <IconTrendDown size={9}/>} {m.d}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Health strip */}
        <div className="v2c" style={{ display: 'flex', padding: 0, marginBottom: 16, overflow: 'hidden' }}>
          {HEALTH.map((h, i) => (
            <div key={h.l} style={{
              flex: 1, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14,
              borderRight: i < HEALTH.length - 1 ? '1px solid var(--v2-border-lt)' : 'none',
            }}>
              <div style={{ position: 'relative', width: 42, height: 42, flexShrink: 0 }}>
                <svg width={42} height={42} viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="17" fill="none" stroke="var(--v2-surface-2)" strokeWidth="3"/>
                  <circle cx="21" cy="21" r="17" fill="none" stroke={h.c} strokeWidth="3" strokeDasharray={`${h.v * 1.068} 106.8`} strokeLinecap="round" transform="rotate(-90 21 21)"/>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: h.c }}>{h.v}</div>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--v2-text)' }}>{h.l}</div>
                <div style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>{h.total}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 3: Charts 3-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
          {/* Network trend */}
          <div className="v2c" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--v2-text)' }}>Network Growth</div>
              <span className="v2g v2g-ok" style={{ fontSize: 10 }}>Live</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--v2-text)', letterSpacing: '-.3px', marginBottom: 6 }}>81,500</div>
            <div style={{ height: 80 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#005C8D" stopOpacity={0.15}/><stop offset="100%" stopColor="#005C8D" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#A1A1AA' }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[65000, 69000]} hide/>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E4E4E7', boxShadow: '0 4px 12px rgba(0,0,0,.06)' }}/>
                  <Area type="monotone" dataKey="v" stroke="#005C8D" strokeWidth={2} fill="url(#g1)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Credential donut */}
          <div className="v2c" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 4 }}>Credentials</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CRED} cx="50%" cy="50%" innerRadius={30} outerRadius={42} paddingAngle={2} dataKey="value" strokeWidth={0}>
                      {CRED.map((d, i) => <Cell key={i} fill={d.color}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--v2-text)' }}>94.2%</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {CRED.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: d.color, flexShrink: 0 }}/>
                    <span style={{ color: 'var(--v2-text-2)', fontWeight: 500 }}>{d.name}</span>
                    <span style={{ color: 'var(--v2-text-3)', marginLeft: 'auto' }}>{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* By type bar */}
          <div className="v2c" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 4 }}>By Type</div>
            <div style={{ height: 110 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BY_TYPE} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F2" vertical={false}/>
                  <XAxis dataKey="type" tick={{ fontSize: 9.5, fill: '#A1A1AA' }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 9, fill: '#A1A1AA' }} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E4E4E7' }}/>
                  <Bar dataKey="count" fill="#005C8D" radius={[3, 3, 0, 0]} barSize={20}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 4: Quick Launch strip */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {LAUNCH.map(q => (
            <Link key={q.l} href={q.h} className="v2c" style={{
              flex: 1, padding: '12px 14px', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'box-shadow .12s, transform .12s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--v2-shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--v2-shadow-sm)'; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: q.b, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <q.i size={16} color={q.c}/>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 550, color: 'var(--v2-text)' }}>{q.l}</span>
            </Link>
          ))}
        </div>

        {/* ROW 5: Activity + Changes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 14 }}>
          {/* Activity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)' }}>Activity</span>
              <button className="v2b v2b-g" style={{ fontSize: 11 }}>View All</button>
            </div>
            <div className="v2c" style={{ overflow: 'hidden' }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '10px 14px', alignItems: 'flex-start',
                  borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--v2-border-lt)' : 'none',
                  cursor: 'pointer', transition: 'background .06s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFBFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <a.icon size={13} color={a.c}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--v2-text)' }}>{a.t}</div>
                    <div style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>{a.s}</div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--v2-text-3)', flexShrink: 0, marginTop: 2 }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent changes */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)' }}>Network Changes</span>
              <button className="v2b v2b-g" style={{ fontSize: 11 }}>View All</button>
            </div>
            <div className="v2c" style={{ overflow: 'hidden' }}>
              {CHANGES.map((r, i) => (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                  borderBottom: i < CHANGES.length - 1 ? '1px solid var(--v2-border-lt)' : 'none',
                  cursor: 'pointer', transition: 'background .06s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFBFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--v2-text)' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--v2-text-3)', display: 'flex', gap: 6 }}>
                      <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5, color: 'var(--v2-primary)' }}>{r.id}</span>
                      <span>{r.type}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--v2-text-3)', flexShrink: 0 }}>{r.impact}</span>
                  {sb(r.s)}
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
