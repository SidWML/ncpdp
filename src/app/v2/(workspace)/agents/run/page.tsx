'use client';
import React, { useState, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TopbarV2 } from '@/components/v2/TopbarV2';
import { Badge } from '@/components/ui/Badge';
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

const catColors: Record<string, { c: string; bg: string; gradient: string }> = {
  'Search & Discovery':      { c: '#005C8D', bg: '#E8F3F9', gradient: 'linear-gradient(135deg,#005C8D,#76C799)' },
  'Network Management':      { c: '#449055', bg: '#ECFDF5', gradient: 'linear-gradient(135deg,#449055,#A6DFB8)' },
  'Compliance & Regulatory': { c: '#DC2626', bg: '#FEF2F2', gradient: 'linear-gradient(135deg,#DC2626,#F87171)' },
  'Data Delivery':           { c: '#1474A4', bg: '#E8F3F9', gradient: 'linear-gradient(135deg,#1474A4,#60A5FA)' },
  'Credentialing (resQ)':    { c: '#D97706', bg: '#FFFBEB', gradient: 'linear-gradient(135deg,#D97706,#FBBF24)' },
  'Analytics & Prediction':  { c: '#004870', bg: '#E8F3F9', gradient: 'linear-gradient(135deg,#004870,#76C799)' },
  'Claims & Routing':        { c: '#76C799', bg: '#ECFDF5', gradient: 'linear-gradient(135deg,#76C799,#A6DFB8)' },
  'NCPDP Internal':          { c: '#005C8D', bg: '#E8F3F9', gradient: 'linear-gradient(135deg,#005C8D,#38BDF8)' },
};
const catIcon = (cat: string, sz = 16) => {
  const m: Record<string, React.ReactElement> = {
    'Search & Discovery': <IconSearch size={sz}/>, 'Network Management': <IconNetwork size={sz}/>,
    'Compliance & Regulatory': <IconShield size={sz}/>, 'Data Delivery': <IconDatabase size={sz}/>,
    'Credentialing (resQ)': <IconCheck size={sz}/>, 'Analytics & Prediction': <IconBarChart size={sz}/>,
    'Claims & Routing': <IconZap size={sz}/>, 'NCPDP Internal': <IconCpu size={sz}/>,
  };
  return m[cat] || <IconSparkles size={sz}/>;
};

const suggestions: Record<string, string[]> = {
  'Search & Discovery':      ['Find all pharmacies in Texas with expiring DEA', 'Show retail pharmacies in Miami', 'List compounding pharmacies in CA', 'Find LTC pharmacies added last 30 days'],
  'Compliance & Regulatory': ['Show pharmacies with expired DEA', 'List critical compliance alerts past 7 days', 'Which pharmacies have incomplete FWA?', 'Independent pharmacies missing FWA attestation 2026'],
  'Network Management':      ['Analyze coverage gaps in Southeast', 'Show adequacy score for all networks', 'Which states below 90% adequacy?', 'Compare network Q1 vs Q4 2025'],
  'Analytics & Prediction':  ['Predict closures in rural Texas', 'Show API usage trends 6 months', 'Identify pharmacy desert risk zones', 'Generate closure risk report'],
  'Data Delivery':           ['Build feed of specialty pharmacies with DEA', 'Export network changes past 30 days', 'Configure daily alert delivery', 'Build daily profile change feed'],
  'Credentialing (resQ)':    ['Check credentialing status Wellness Pharmacy', 'List incomplete resQ profiles', 'Show renewal queue next 90 days', 'Find networks for MedPlus Pharmacy'],
  'Claims & Routing':        ['Validate NPI for claims batch #4821', 'Show routing for specialty claims', 'Find pharmacies for bulk download', 'Analyze rejection patterns Q1'],
  'NCPDP Internal':          ['Generate audit trail Aetna 30 days', 'Show subscriber usage Q1 2026', 'List accounts declining API activity', 'Package dataset for enterprise'],
};

const RESULT_ROWS = [
  { ncpdp: '1234567', name: 'CareRx Pharmacy #0842',       city: 'Los Angeles', state: 'CA', type: 'Retail',      dea: 'Valid',    phone: '(213) 555-0198' },
  { ncpdp: '2345678', name: 'SpecialtyRx Partners LLC',     city: 'Houston',     state: 'TX', type: 'Specialty',   dea: 'Expiring', phone: '(713) 555-0412' },
  { ncpdp: '3456789', name: 'MediCare Express Pharmacy',    city: 'Phoenix',     state: 'AZ', type: 'Retail',      dea: 'Valid',    phone: '(602) 555-0837' },
  { ncpdp: '4567890', name: 'Coastal Health Pharmacy',      city: 'Miami',       state: 'FL', type: 'Compounding', dea: 'Valid',    phone: '(305) 555-0291' },
  { ncpdp: '5678901', name: 'Alpine Specialty Dispensary',  city: 'Denver',      state: 'CO', type: 'Specialty',   dea: 'Expired',  phone: '(720) 555-0543' },
  { ncpdp: '6789012', name: 'Midwest Chain Pharmacy #44',   city: 'Chicago',     state: 'IL', type: 'Chain',       dea: 'Valid',    phone: '(312) 555-0871' },
  { ncpdp: '7890123', name: 'SunHealth Compounding Center', city: 'Orlando',     state: 'FL', type: 'Compounding', dea: 'Valid',    phone: '(407) 555-0654' },
  { ncpdp: '8901234', name: 'Pacific Infusion Services',    city: 'Seattle',     state: 'WA', type: 'Infusion',    dea: 'Valid',    phone: '(206) 555-0923' },
];
const BAR_DATA = [{ s: 'TX', c: 89 },{ s: 'CA', c: 72 },{ s: 'FL', c: 41 },{ s: 'NY', c: 28 },{ s: 'OH', c: 17 },{ s: 'IL', c: 14 }];
const PIE_DATA = [{ n: 'Retail', v: 136, c: '#005C8D' },{ n: 'Specialty', v: 59, c: '#76C799' },{ n: 'Compounding', v: 25, c: '#FBBF24' },{ n: 'Chain', v: 18, c: '#EF4444' },{ n: 'Infusion', v: 9, c: '#005C8D' }];
const TREND = [{ m: 'Oct', v: 64200 },{ m: 'Nov', v: 64900 },{ m: 'Dec', v: 65400 },{ m: 'Jan', v: 66100 },{ m: 'Feb', v: 67200 },{ m: 'Mar', v: 81500 }];

type Tab = 'results' | 'sql' | 'charts' | 'export';

function AgentRunInner() {
  const sp = useSearchParams();
  const agentId = sp.get('agent') ?? 'agt-01';
  const agent = agents.find(a => a.id === agentId) ?? agents[0];
  const cc = catColors[agent.category] ?? catColors['Search & Discovery'];
  const agentSugs = suggestions[agent.category] ?? suggestions['Search & Discovery'];

  const [tab, setTab] = useState<Tab>('results');
  const [hasResults, setHasResults] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [chatWidth, setChatWidth] = useState(480);
  const [sqlCopied, setSqlCopied] = useState(false);

  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(480);
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true; startX.current = e.clientX; startW.current = chatWidth;
    document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
    const move = (ev: MouseEvent) => { if (!dragging.current) return; setChatWidth(Math.max(320, Math.min(800, startW.current + ev.clientX - startX.current))); };
    const up = () => { dragging.current = false; document.body.style.cursor = ''; document.body.style.userSelect = ''; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
  }, [chatWidth]);

  function handleReply(msg: string) {
    setTimeout(() => { setHasResults(true); }, 0);
    return `Analyzed 81,500 records.\nFound 247 results for: "${msg.slice(0, 60)}${msg.length > 60 ? '...' : ''}"`;
  }
  function handleCanvas() { setShowOutput(true); setTab('results'); }

  const tabs: { id: Tab; l: string }[] = [{ id: 'results', l: 'Results' },{ id: 'sql', l: 'SQL Query' },{ id: 'charts', l: 'Charts' },{ id: 'export', l: 'Export' }];
  const deaB = (s: string) => s === 'Valid' ? <span className="v2g v2g-ok">Valid</span> : s === 'Expiring' ? <span className="v2g v2g-w">Expiring</span> : <span className="v2g v2g-err">Expired</span>;
  const sql = `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state,\n       c.dea_status, c.license_status\nFROM pharmacies p\nLEFT JOIN credentials c ON p.ncpdp_id = c.ncpdp_id\nWHERE p.active = true\nORDER BY p.pharmacy_name ASC\nLIMIT 247`;

  return (
    <>
      <TopbarV2 title={agent.name} subtitle={`${agent.id.toUpperCase()} - ${agent.category}`} actions={
        <button className={`v2b ${showOutput ? 'v2b-p' : 'v2b-s'}`} onClick={() => setShowOutput(o => !o)} style={{ fontSize: 12 }}>
          <IconBarChart size={13} color={showOutput ? '#fff' : undefined}/> {showOutput ? 'Hide Output' : 'Show Output'}
        </button>
      }/>
      <main style={{ display: 'flex', height: 'calc(100vh - 52px)' }}>

        {/* Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', width: showOutput ? chatWidth : '100%', flex: showOutput ? undefined : 1, flexShrink: showOutput ? 0 : undefined, minHeight: 0, overflow: 'hidden', transition: 'width .15s ease' }}>
          <div style={{ padding: '6px 16px', borderBottom: '1px solid var(--v2-border-lt)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href="/v2/agents" style={{ fontSize: 12, color: 'var(--v2-text-3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'flex', transform: 'rotate(180deg)' }}><IconChevronRight size={11}/></span> Agents
            </Link>
          </div>
          <AgentChat
            agentName={agent.name} agentId={agent.id.toUpperCase()} gradient={cc.gradient}
            icon={catIcon(agent.category, 18)}
            welcomeMessage={`Hi Sarah! I'm ${agent.name}. ${agent.desc}\n\nAsk me anything or pick a suggestion below.`}
            suggestions={agentSugs} getBotReply={handleReply} onOpenCanvas={handleCanvas}
            hideHeader fluid
          />
        </div>

        {/* Resize + Output */}
        {showOutput && (
          <>
            <div onMouseDown={onMouseDown} style={{ width: 5, flexShrink: 0, cursor: 'col-resize', position: 'relative' }}
              onMouseEnter={e => { const l = e.currentTarget.firstElementChild as HTMLElement; if (l) l.style.background = 'var(--v2-primary)'; }}
              onMouseLeave={e => { const l = e.currentTarget.firstElementChild as HTMLElement; if (l) l.style.background = 'var(--v2-border)'; }}
            >
              <div style={{ position: 'absolute', left: 2, top: 0, bottom: 0, width: 1, background: 'var(--v2-border)', transition: 'background .1s' }}/>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--v2-bg)', minWidth: 0 }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--v2-border-lt)', background: 'var(--v2-surface)', flexShrink: 0 }}>
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} className={`v2-tab ${tab === t.id ? 'active' : ''}`}>{t.l}</button>
                ))}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                {!hasResults ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--v2-text-3)' }}>
                    <IconCpu size={32} color="var(--v2-border)"/>
                    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 10 }}>Ready</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Send a message to see results</div>
                  </div>
                ) : (
                  <>
                    {tab === 'results' && (
                      <div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                          {[{ l: 'Found', v: '247', c: 'var(--v2-primary)' },{ l: 'Time', v: '0.83s', c: 'var(--v2-green)' },{ l: 'Scanned', v: '81,500', c: 'var(--v2-text)' }].map(s => (
                            <div key={s.l} style={{ padding: '8px 14px', borderRadius: 8, background: 'var(--v2-surface-2)', textAlign: 'center', flex: 1 }}>
                              <div style={{ fontSize: 10, color: 'var(--v2-text-3)', fontWeight: 500 }}>{s.l}</div>
                              <div style={{ fontSize: 16, fontWeight: 700, color: s.c, marginTop: 2 }}>{s.v}</div>
                            </div>
                          ))}
                        </div>
                        <div className="v2-tw">
                          <table>
                            <thead><tr><th>NCPDP ID</th><th>PHARMACY</th><th>CITY</th><th>STATE</th><th>TYPE</th><th>DEA</th></tr></thead>
                            <tbody>
                              {RESULT_ROWS.map(r => (
                                <tr key={r.ncpdp}>
                                  <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: 'var(--v2-primary)', fontSize: 12 }}>{r.ncpdp}</td>
                                  <td style={{ fontWeight: 500 }}>{r.name}</td>
                                  <td style={{ color: 'var(--v2-text-2)' }}>{r.city}</td>
                                  <td style={{ fontWeight: 600 }}>{r.state}</td>
                                  <td><span className="v2g v2g-n">{r.type}</span></td>
                                  <td>{deaB(r.dea)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    {tab === 'sql' && (
                      <div>
                        <div style={{ position: 'relative' }}>
                          <pre style={{ background: '#0C0F1A', color: '#8FC2D8', fontFamily: 'ui-monospace, monospace', fontSize: 12.5, lineHeight: 1.7, padding: '20px 24px', borderRadius: 10, overflowX: 'auto', margin: 0 }}>{sql}</pre>
                          <button onClick={() => { navigator.clipboard.writeText(sql).catch(() => {}); setSqlCopied(true); setTimeout(() => setSqlCopied(false), 1500); }} style={{ position: 'absolute', top: 10, right: 12, background: sqlCopied ? '#449055' : 'rgba(143,194,216,.15)', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: sqlCopied ? '#fff' : '#8FC2D8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <IconCopy size={11}/> {sqlCopied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <div style={{ marginTop: 10, padding: '8px 14px', background: 'var(--v2-surface)', borderRadius: 8, fontSize: 12, color: 'var(--v2-text-3)', display: 'flex', gap: 16, boxShadow: 'var(--v2-shadow-sm)' }}>
                          <span>Time: <strong style={{ color: 'var(--v2-green)' }}>0.83s</strong></span>
                          <span>Scanned: <strong style={{ color: 'var(--v2-text)' }}>81,500</strong></span>
                          <span>Returned: <strong style={{ color: 'var(--v2-primary)' }}>247</strong></span>
                        </div>
                      </div>
                    )}
                    {tab === 'charts' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="v2c" style={{ padding: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 12 }}>Results by State</div>
                          <div style={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={BAR_DATA}><CartesianGrid strokeDasharray="3 3" stroke="#F0F0F2" vertical={false}/><XAxis dataKey="s" tick={{ fontSize: 11, fill: '#A1A1AA' }} axisLine={false} tickLine={false}/><YAxis tick={{ fontSize: 10, fill: '#A1A1AA' }} axisLine={false} tickLine={false}/><Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E4E4E7' }}/><Bar dataKey="c" fill="#005C8D" radius={[4, 4, 0, 0]} barSize={28}/></BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div className="v2c" style={{ padding: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 12 }}>By Type</div>
                            <div style={{ height: 180 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart><Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="v">{PIE_DATA.map((d,i) => <Cell key={i} fill={d.c}/>)}</Pie><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }}/></PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          <div className="v2c" style={{ padding: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 12 }}>Trend</div>
                            <div style={{ height: 180 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={TREND}><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#005C8D" stopOpacity={.15}/><stop offset="100%" stopColor="#005C8D" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="m" tick={{ fontSize: 10, fill: '#A1A1AA' }} axisLine={false} tickLine={false}/><YAxis domain={[63000, 69000]} hide/><Area type="monotone" dataKey="v" stroke="#005C8D" strokeWidth={2} fill="url(#ag)"/></AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {tab === 'export' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {[
                          { l: 'CSV', d: 'Comma-separated for Excel', s: '~48 KB', ic: <IconReport size={18} color="var(--v2-primary)"/> },
                          { l: 'JSON', d: 'Structured data for APIs', s: '~96 KB', ic: <IconCode size={18} color="var(--v2-green)"/> },
                          { l: 'SQL', d: 'Download the query file', s: '~1 KB', ic: <IconDatabase size={18} color="var(--v2-amber)"/> },
                          { l: 'API Endpoint', d: 'Copy REST endpoint URL', s: 'Live', ic: <IconNetwork size={18} color="#004870"/> },
                        ].map(f => (
                          <div key={f.l} className="v2c" style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                              {f.ic}
                              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>{f.l}</div>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--v2-text-3)', marginBottom: 12 }}>{f.d}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>{f.s}</span>
                              <button className="v2b v2b-p" style={{ fontSize: 11, padding: '5px 12px', gap: 4 }}><IconDownload size={11} color="#fff"/> Download</button>
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

export default function AgentRunPage() {
  return <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--v2-text-3)' }}>Loading...</div>}><AgentRunInner/></Suspense>;
}
