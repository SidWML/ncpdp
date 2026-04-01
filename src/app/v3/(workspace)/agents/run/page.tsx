'use client';
import React, { useState, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Topbar } from '@/components/v3/TopbarV3';
import { agents } from '@/lib/mockData';
import { AgentChat } from '@/components/ui/AgentChat';
import {
  IconSearch, IconCpu, IconShield, IconDatabase, IconNetwork, IconBarChart,
  IconCheck, IconZap, IconSparkles, IconChevronRight, IconReport,
  IconDownload, IconCode, IconCopy,
} from '@/components/ui/Icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';

const CC: Record<string, { c: string; bg: string; g: string }> = {
  'Search & Discovery':      { c: '#6366F1', bg: '#EEF2FF', g: 'linear-gradient(135deg,#6366F1,#818CF8)' },
  'Network Management':      { c: '#059669', bg: '#ECFDF5', g: 'linear-gradient(135deg,#059669,#34D399)' },
  'Compliance & Regulatory': { c: '#DC2626', bg: '#FEF2F2', g: 'linear-gradient(135deg,#DC2626,#F87171)' },
  'Data Delivery':           { c: '#2563EB', bg: '#EFF6FF', g: 'linear-gradient(135deg,#2563EB,#60A5FA)' },
  'Credentialing (resQ)':    { c: '#D97706', bg: '#FFFBEB', g: 'linear-gradient(135deg,#D97706,#FBBF24)' },
  'Analytics & Prediction':  { c: '#7C3AED', bg: '#F5F3FF', g: 'linear-gradient(135deg,#7C3AED,#A78BFA)' },
  'Claims & Routing':        { c: '#10B981', bg: '#ECFDF5', g: 'linear-gradient(135deg,#10B981,#6EE7B7)' },
  'NCPDP Internal':          { c: '#0284C7', bg: '#F0F9FF', g: 'linear-gradient(135deg,#0284C7,#38BDF8)' },
};
const CI = (cat: string, sz = 16) => {
  const m: Record<string, React.ReactElement> = {
    'Search & Discovery': <IconSearch size={sz}/>, 'Network Management': <IconNetwork size={sz}/>,
    'Compliance & Regulatory': <IconShield size={sz}/>, 'Data Delivery': <IconDatabase size={sz}/>,
    'Credentialing (resQ)': <IconCheck size={sz}/>, 'Analytics & Prediction': <IconBarChart size={sz}/>,
    'Claims & Routing': <IconZap size={sz}/>, 'NCPDP Internal': <IconCpu size={sz}/>,
  };
  return m[cat] || <IconSparkles size={sz}/>;
};
const SUGS: Record<string, string[]> = {
  'Search & Discovery': ['Find pharmacies in TX with expiring DEA', 'Show retail pharmacies in Miami', 'List specialty with URAC in CA', 'Find LTC added last 30 days'],
  'Network Management': ['Analyze coverage gaps Southeast', 'CMS adequacy all networks', 'States below 90% adequacy', 'Compare Q1 vs Q4 2025'],
  'Compliance & Regulatory': ['Expired DEA all regions', 'Critical alerts past 7 days', 'Incomplete FWA attestations', 'NSA violations Q1 2026'],
  'Analytics & Prediction': ['Predict closures rural TX', 'API usage trends 6 months', 'Pharmacy desert risk zones', 'Closure risk report LTC'],
  'Data Delivery': ['Build specialty DEA feed', 'Export changes 30 days', 'Daily alert delivery config', 'E-prescribing router feed'],
  'Credentialing (resQ)': ['Credentialing status Wellness', 'Incomplete resQ profiles', 'Renewal queue 90 days', 'Networks for MedPlus'],
  'Claims & Routing': ['Validate NPI batch #4821', 'Routing specialty claims', 'Bulk download eligible', 'Rejection patterns Q1'],
  'NCPDP Internal': ['Audit trail Aetna 30 days', 'Subscriber usage Q1 2026', 'Declining API accounts', 'Enterprise dataset package'],
};
const ROWS = [
  { id: '1234567', n: 'CareRx Pharmacy #0842',       ci: 'Los Angeles', st: 'CA', t: 'Retail',      d: 'Valid' },
  { id: '2345678', n: 'SpecialtyRx Partners LLC',     ci: 'Houston',     st: 'TX', t: 'Specialty',   d: 'Expiring' },
  { id: '3456789', n: 'MediCare Express Pharmacy',    ci: 'Phoenix',     st: 'AZ', t: 'Retail',      d: 'Valid' },
  { id: '4567890', n: 'Coastal Health Pharmacy',      ci: 'Miami',       st: 'FL', t: 'Compounding', d: 'Valid' },
  { id: '5678901', n: 'Alpine Specialty Dispensary',  ci: 'Denver',      st: 'CO', t: 'Specialty',   d: 'Expired' },
  { id: '6789012', n: 'Midwest Chain Pharmacy #44',   ci: 'Chicago',     st: 'IL', t: 'Chain',       d: 'Valid' },
  { id: '7890123', n: 'SunHealth Compounding Center', ci: 'Orlando',     st: 'FL', t: 'Compounding', d: 'Valid' },
  { id: '8901234', n: 'Pacific Infusion Services',    ci: 'Seattle',     st: 'WA', t: 'Infusion',    d: 'Valid' },
];
const BD = [{ s: 'TX', c: 89 },{ s: 'CA', c: 72 },{ s: 'FL', c: 41 },{ s: 'NY', c: 28 },{ s: 'OH', c: 17 },{ s: 'IL', c: 14 }];
const PD = [{ n: 'Retail', v: 136, c: '#6366F1' },{ n: 'Specialty', v: 59, c: '#10B981' },{ n: 'Compounding', v: 25, c: '#FBBF24' },{ n: 'Chain', v: 18, c: '#EF4444' }];
const TD = [{ m: 'Oct', v: 64200 },{ m: 'Nov', v: 64900 },{ m: 'Dec', v: 65400 },{ m: 'Jan', v: 66100 },{ m: 'Feb', v: 67200 },{ m: 'Mar', v: 68247 }];

type Tab = 'results' | 'sql' | 'charts' | 'export';
const SQL = `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state,
       c.dea_status, c.license_status
FROM pharmacies p
LEFT JOIN credentials c ON p.ncpdp_id = c.ncpdp_id
WHERE p.active = true
ORDER BY p.pharmacy_name ASC
LIMIT 247`;

function Inner() {
  const sp = useSearchParams();
  const agent = agents.find(a => a.id === (sp.get('agent') ?? 'agt-01')) ?? agents[0];
  const cc = CC[agent.category] ?? CC['Search & Discovery'];
  const sug = SUGS[agent.category] ?? SUGS['Search & Discovery'];

  const [tab, setTab] = useState<Tab>('results');
  const [hasRes, setHasRes] = useState(false);
  const [showOut, setShowOut] = useState(false);
  const [chatW, setChatW] = useState(500);
  const [copied, setCopied] = useState(false);

  const drag = useRef(false); const sx = useRef(0); const sw = useRef(500);
  const onMD = useCallback((e: React.MouseEvent) => {
    drag.current = true; sx.current = e.clientX; sw.current = chatW;
    document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
    const mv = (ev: MouseEvent) => { if (drag.current) setChatW(Math.max(340, Math.min(800, sw.current + ev.clientX - sx.current))); };
    const up = () => { drag.current = false; document.body.style.cursor = ''; document.body.style.userSelect = ''; document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
  }, [chatW]);

  const reply = (msg: string) => { setTimeout(() => setHasRes(true), 0); return `Analyzed 68,247 records.\nFound 247 results for: "${msg.slice(0, 50)}${msg.length > 50 ? '...' : ''}"`; };
  const openCanvas = () => { setShowOut(true); setTab('results'); };
  const deaB = (s: string) => s === 'Valid' ? <span className="v3-badge v3-badge-green">Valid</span> : s === 'Expiring' ? <span className="v3-badge v3-badge-amber">Expiring</span> : <span className="v3-badge v3-badge-red">Expired</span>;
  const tabs: { id: Tab; l: string }[] = [{ id: 'results', l: 'Results' },{ id: 'sql', l: 'SQL' },{ id: 'charts', l: 'Charts' },{ id: 'export', l: 'Export' }];

  return (
    <>
      <Topbar title={agent.name} subtitle={`${agent.id.toUpperCase()} - ${agent.category}`} actions={
        <button className={`v3-btn ${showOut ? 'v3-btn-accent' : 'v3-btn-soft'}`} onClick={() => setShowOut(o => !o)} style={{ fontSize: 12 }}>
          <IconBarChart size={13} color={showOut ? '#fff' : undefined}/> {showOut ? 'Hide Output' : 'Show Output'}
        </button>
      }/>
      <main style={{ display: 'flex', height: 'calc(100vh - 54px)' }}>
        {/* Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', width: showOut ? chatW : '100%', flex: showOut ? undefined : 1, flexShrink: showOut ? 0 : undefined, minHeight: 0, overflow: 'hidden', transition: 'width .15s ease' }}>
          <div style={{ padding: '6px 16px', borderBottom: '1px solid var(--v3-border-lt)', flexShrink: 0 }}>
            <Link href="/v3/agents" style={{ fontSize: 12, color: 'var(--v3-text-3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'flex', transform: 'rotate(180deg)' }}><IconChevronRight size={11}/></span> Agents
            </Link>
          </div>
          <AgentChat agentName={agent.name} agentId={agent.id.toUpperCase()} gradient={cc.g} icon={CI(agent.category, 18)} welcomeMessage={`Hi Sarah! I'm ${agent.name}. ${agent.desc}\n\nAsk me anything or pick a suggestion.`} suggestions={sug} getBotReply={reply} onOpenCanvas={openCanvas} hideHeader fluid/>
        </div>

        {/* Output */}
        {showOut && (
          <>
            <div onMouseDown={onMD} style={{ width: 5, flexShrink: 0, cursor: 'col-resize', position: 'relative' }}
              onMouseEnter={e => { const l = e.currentTarget.firstElementChild as HTMLElement; if (l) l.style.background = 'var(--v3-accent)'; }}
              onMouseLeave={e => { const l = e.currentTarget.firstElementChild as HTMLElement; if (l) l.style.background = 'var(--v3-border)'; }}
            ><div style={{ position: 'absolute', left: 2, top: 0, bottom: 0, width: 1, background: 'var(--v3-border)', transition: 'background .1s' }}/></div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--v3-bg)', minWidth: 0 }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--v3-border)', background: 'var(--v3-surface)', flexShrink: 0 }}>
                {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`v3-tab ${tab === t.id ? 'active' : ''}`}>{t.l}</button>)}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                {!hasRes ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--v3-text-3)' }}>
                    <IconCpu size={32} color="var(--v3-border)"/>
                    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 10 }}>Ready</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Send a message to see results</div>
                  </div>
                ) : (
                  <>
                    {tab === 'results' && (
                      <div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                          {[{ l: 'Found', v: '247', c: 'var(--v3-accent)' },{ l: 'Time', v: '0.83s', c: 'var(--v3-green)' },{ l: 'Scanned', v: '68,247', c: 'var(--v3-text)' }].map(s => (
                            <div key={s.l} className="v3-card" style={{ padding: '10px 14px', textAlign: 'center', flex: 1 }}>
                              <div style={{ fontSize: 10, color: 'var(--v3-text-3)', fontWeight: 500 }}>{s.l}</div>
                              <div style={{ fontSize: 17, fontWeight: 700, color: s.c, marginTop: 2 }}>{s.v}</div>
                            </div>
                          ))}
                        </div>
                        <div className="v3-table-wrap">
                          <table><thead><tr><th>NCPDP</th><th>PHARMACY</th><th>CITY</th><th>STATE</th><th>TYPE</th><th>DEA</th></tr></thead>
                          <tbody>{ROWS.map(r => (
                            <tr key={r.id}><td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: 'var(--v3-accent)', fontSize: 12 }}>{r.id}</td><td style={{ fontWeight: 500 }}>{r.n}</td><td style={{ color: 'var(--v3-text-2)' }}>{r.ci}</td><td style={{ fontWeight: 600 }}>{r.st}</td><td><span className="v3-badge v3-badge-gray">{r.t}</span></td><td>{deaB(r.d)}</td></tr>
                          ))}</tbody></table>
                        </div>
                      </div>
                    )}
                    {tab === 'sql' && (
                      <div>
                        <div style={{ position: 'relative' }}>
                          <pre style={{ background: '#0C0F1E', color: '#A5B4FC', fontFamily: 'ui-monospace, monospace', fontSize: 12.5, lineHeight: 1.7, padding: '20px 24px', borderRadius: 12, overflowX: 'auto', margin: 0 }}>{SQL}</pre>
                          <button onClick={() => { navigator.clipboard.writeText(SQL).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }} style={{ position: 'absolute', top: 10, right: 12, background: copied ? '#059669' : 'rgba(165,180,252,.15)', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: copied ? '#fff' : '#A5B4FC', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><IconCopy size={11}/> {copied ? 'Copied!' : 'Copy'}</button>
                        </div>
                      </div>
                    )}
                    {tab === 'charts' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="v3-card" style={{ padding: 16 }}>
                          <div className="v3-section">By State</div>
                          <div style={{ height: 200 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={BD}><CartesianGrid strokeDasharray="3 3" stroke="#F0F0F2" vertical={false}/><XAxis dataKey="s" tick={{ fontSize: 11, fill: '#A1A1AA' }} axisLine={false} tickLine={false}/><YAxis tick={{ fontSize: 10, fill: '#A1A1AA' }} axisLine={false} tickLine={false}/><Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E4E4E7' }}/><Bar dataKey="c" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={28}/></BarChart></ResponsiveContainer></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div className="v3-card" style={{ padding: 16 }}>
                            <div className="v3-section">By Type</div>
                            <div style={{ height: 180 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={PD} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="v">{PD.map((d,i) => <Cell key={i} fill={d.c}/>)}</Pie><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }}/></PieChart></ResponsiveContainer></div>
                          </div>
                          <div className="v3-card" style={{ padding: 16 }}>
                            <div className="v3-section">Trend</div>
                            <div style={{ height: 180 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={TD}><defs><linearGradient id="v3ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity={.15}/><stop offset="100%" stopColor="#6366F1" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="m" tick={{ fontSize: 10, fill: '#A1A1AA' }} axisLine={false} tickLine={false}/><YAxis domain={[63000, 69000]} hide/><Area type="monotone" dataKey="v" stroke="#6366F1" strokeWidth={2} fill="url(#v3ag)"/></AreaChart></ResponsiveContainer></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {tab === 'export' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {[
                          { l: 'CSV', d: 'Comma-separated for Excel', ic: <IconReport size={18} color="var(--v3-accent)"/>, s: '~48 KB' },
                          { l: 'JSON', d: 'Structured data for APIs', ic: <IconCode size={18} color="var(--v3-green)"/>, s: '~96 KB' },
                          { l: 'SQL', d: 'Download the query', ic: <IconDatabase size={18} color="var(--v3-amber)"/>, s: '~1 KB' },
                          { l: 'API', d: 'Copy REST endpoint', ic: <IconNetwork size={18} color="#7C3AED"/>, s: 'Live' },
                        ].map(f => (
                          <div key={f.l} className="v3-card" style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>{f.ic}<div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v3-text)' }}>{f.l}</div></div>
                            <div style={{ fontSize: 12, color: 'var(--v3-text-3)', marginBottom: 12 }}>{f.d}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 11, color: 'var(--v3-text-3)' }}>{f.s}</span>
                              <button className="v3-btn v3-btn-accent" style={{ fontSize: 11, padding: '5px 12px', gap: 4 }}><IconDownload size={11} color="#fff"/> Download</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default function Page() {
  return <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--v3-text-3)' }}>Loading...</div>}><Inner/></Suspense>;
}
