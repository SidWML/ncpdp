'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/Badge';
import { agents } from '@/lib/mockData';
import {
  IconSearch, IconCpu, IconShield, IconDatabase,
  IconNetwork, IconBarChart, IconCheck, IconZap, IconSparkles,
  IconChevronRight, IconReport, IconDownload, IconCode, IconCopy,
} from '@/components/ui/Icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { AgentChat } from '@/components/ui/AgentChat';
import { useCallback, useRef } from 'react';

/* ── Category helpers ────────────────────────────────────────────── */
const catColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  'Search & Discovery':      { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE', gradient: 'linear-gradient(135deg,#4F46E5,#818CF8)' },
  'Network Management':      { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', gradient: 'linear-gradient(135deg,#059669,#34D399)' },
  'Compliance & Regulatory': { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', gradient: 'linear-gradient(135deg,#DC2626,#F87171)' },
  'Data Delivery':           { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE', gradient: 'linear-gradient(135deg,#2563EB,#60A5FA)' },
  'Credentialing (resQ)':    { bg: '#FFF7ED', text: '#D97706', border: '#FDE68A', gradient: 'linear-gradient(135deg,#D97706,#FBBF24)' },
  'Analytics & Prediction':  { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE', gradient: 'linear-gradient(135deg,#7C3AED,#A78BFA)' },
  'Claims & Routing':        { bg: '#ECFDF5', text: '#10B981', border: '#6EE7B7', gradient: 'linear-gradient(135deg,#10B981,#6EE7B7)' },
  'NCPDP Internal':          { bg: '#F0F9FF', text: '#0284C7', border: '#BAE6FD', gradient: 'linear-gradient(135deg,#0284C7,#38BDF8)' },
};

const catIcon = (cat: string, size = 16) => {
  const icons: Record<string, React.ReactElement> = {
    'Search & Discovery':      <IconSearch size={size}/>,
    'Network Management':      <IconNetwork size={size}/>,
    'Compliance & Regulatory': <IconShield size={size}/>,
    'Data Delivery':           <IconDatabase size={size}/>,
    'Credentialing (resQ)':    <IconCheck size={size}/>,
    'Analytics & Prediction':  <IconBarChart size={size}/>,
    'Claims & Routing':        <IconZap size={size}/>,
    'NCPDP Internal':          <IconCpu size={size}/>,
  };
  return icons[cat] || <IconSparkles size={size}/>;
};

const suggestions: Record<string, string[]> = {
  'Search & Discovery': [
    'Find all pharmacies in Texas with expiring DEA registrations',
    'Show retail pharmacies in Miami within 10 miles',
    'List specialty pharmacies with URAC accreditation in CA',
    'Find LTC pharmacies added in the last 30 days',
  ],
  'Compliance & Regulatory': [
    'Show all pharmacies with expired DEA in the South region',
    'List critical compliance alerts from the past 7 days',
    'Which pharmacies have incomplete FWA attestations?',
    'Find No Surprises Act violations in Q1 2026',
  ],
  'Network Management': [
    'Analyze network coverage gaps in Southeast states',
    'Show CMS adequacy status for all contracted networks',
    'Which states fall below 90% network adequacy?',
    'Compare network composition for Q1 vs Q4 2025',
  ],
  'Analytics & Prediction': [
    'Predict pharmacy closures in rural Texas counties',
    'Show API usage trends for the past 6 months',
    'Identify pharmacy desert risk zones in Midwest',
    'Generate closure risk report for LTC pharmacies',
  ],
  'Data Delivery': [
    'Build a feed of all specialty pharmacies with DEA status',
    'Export network changes from the past 30 days',
    'Configure daily compliance alert delivery for Aetna',
    'Create e-prescribing router feed for BlueCross',
  ],
  'Credentialing (resQ)': [
    'Check credentialing status for Wellness Pharmacy #0842',
    'List pharmacies with incomplete resQ profiles',
    'Show credential renewal queue for next 90 days',
    'Find networks available for MedPlus Pharmacy #1204',
  ],
  'Claims & Routing': [
    'Validate NPI identifiers for claims batch #4821',
    'Show routing recommendations for specialty claims',
    'Find pharmacies eligible for bulk download optimization',
    'Analyze claim rejection patterns in Q1 2026',
  ],
  'NCPDP Internal': [
    'Generate audit trail for Aetna data access last 30 days',
    'Show subscriber usage patterns for Q1 2026',
    'List accounts with declining API activity',
    'Package standard dataset for enterprise subscriber',
  ],
};

const sqlByCategory: Record<string, string> = {
  'Search & Discovery': `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state,
       p.provider_type, c.dea_expires, c.dea_status,
       c.license_status, c.fwa_complete,
       COUNT(n.network_id) AS network_count
FROM pharmacies p
LEFT JOIN credentials c ON p.ncpdp_id = c.ncpdp_id
LEFT JOIN network_memberships n ON p.ncpdp_id = n.ncpdp_id
WHERE p.state = 'TX' AND c.dea_status = 'expiring'
GROUP BY p.ncpdp_id ORDER BY c.dea_expires ASC
LIMIT 247`,
  default: `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state,
       p.provider_type, c.dea_status, c.license_status
FROM pharmacies p
LEFT JOIN credentials c ON p.ncpdp_id = c.ncpdp_id
WHERE p.active = true
ORDER BY p.pharmacy_name ASC
LIMIT 247`,
};

type Tab = 'results' | 'sql' | 'charts' | 'export';

/* ── Shared result data ──────────────────────────────────────────── */
const RESULT_ROWS = [
  { ncpdp: '1234567', name: 'CareRx Pharmacy #0842',       city: 'Los Angeles', state: 'CA', type: 'Retail',      status: 'Active',   dea: 'Valid',    phone: '(213) 555-0198' },
  { ncpdp: '2345678', name: 'SpecialtyRx Partners LLC',     city: 'Houston',     state: 'TX', type: 'Specialty',   status: 'Active',   dea: 'Expiring', phone: '(713) 555-0412' },
  { ncpdp: '3456789', name: 'MediCare Express Pharmacy',    city: 'Phoenix',     state: 'AZ', type: 'Retail',      status: 'Active',   dea: 'Valid',    phone: '(602) 555-0837' },
  { ncpdp: '4567890', name: 'Coastal Health Pharmacy',      city: 'Miami',       state: 'FL', type: 'Compounding', status: 'Active',   dea: 'Valid',    phone: '(305) 555-0291' },
  { ncpdp: '5678901', name: 'Alpine Specialty Dispensary',  city: 'Denver',      state: 'CO', type: 'Specialty',   status: 'Inactive', dea: 'Expired',  phone: '(720) 555-0543' },
  { ncpdp: '6789012', name: 'Midwest Chain Pharmacy #44',   city: 'Chicago',     state: 'IL', type: 'Chain',       status: 'Active',   dea: 'Valid',    phone: '(312) 555-0871' },
  { ncpdp: '7890123', name: 'SunHealth Compounding Center', city: 'Orlando',     state: 'FL', type: 'Compounding', status: 'Active',   dea: 'Valid',    phone: '(407) 555-0654' },
  { ncpdp: '8901234', name: 'Pacific Infusion Services',    city: 'Seattle',     state: 'WA', type: 'Infusion',    status: 'Active',   dea: 'Valid',    phone: '(206) 555-0923' },
  { ncpdp: '9012345', name: 'Capital Area Pharmacy Group',  city: 'Washington',  state: 'DC', type: 'Retail',      status: 'Active',   dea: 'Valid',    phone: '(202) 555-0182' },
  { ncpdp: '0123456', name: 'Northeast Specialty Rx',       city: 'Boston',      state: 'MA', type: 'Specialty',   status: 'Inactive', dea: 'Expiring', phone: '(617) 555-0764' },
];
type ResultRow = typeof RESULT_ROWS[number];

const BAR_DATA = [
  { state: 'TX', count: 89 }, { state: 'CA', count: 72 }, { state: 'FL', count: 41 },
  { state: 'NY', count: 28 }, { state: 'OH', count: 17 }, { state: 'IL', count: 14 },
  { state: 'PA', count: 12 }, { state: 'WA', count: 9 },
];
const PIE_DATA = [
  { name: 'Community/Retail', value: 136, color: '#4F46E5' },
  { name: 'Specialty',        value: 59,  color: '#10B981' },
  { name: 'Compounding',      value: 25,  color: '#F59E0B' },
  { name: 'Chain',            value: 18,  color: '#EF4444' },
  { name: 'Infusion',         value: 9,   color: '#8B5CF6' },
];
const TREND_DATA = [
  { month: 'Oct', active: 64200, new: 320, closed: 180 },
  { month: 'Nov', active: 64900, new: 410, closed: 210 },
  { month: 'Dec', active: 65400, new: 380, closed: 190 },
  { month: 'Jan', active: 66100, new: 520, closed: 240 },
  { month: 'Feb', active: 67200, new: 610, closed: 290 },
  { month: 'Mar', active: 68247, new: 580, closed: 310 },
];

/* ── Results Tab ─────────────────────────────────────────────────── */
function ResultsTab({ agentName, resultRows }: { agentName: string; resultRows: ResultRow[] }) {
  const deaBadge = (s: string) =>
    s === 'Valid' ? <Badge variant="success">Valid</Badge> :
    s === 'Expiring' ? <Badge variant="warning">Expiring</Badge> :
    <Badge variant="danger">Expired</Badge>;

  return (
    <div>
      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 18 }}>
        {[
          { label: 'Records Found',  value: '247',    color: '#4F46E5', bg: '#EEF2FF' },
          { label: 'Execution Time', value: '0.83s',  color: '#10B981', bg: '#ECFDF5' },
          { label: 'Records Scanned',value: '68,247', color: '#334155', bg: '#F8FAFC' },
          { label: 'Active',         value: '218',    color: '#10B981', bg: '#ECFDF5' },
          { label: 'Inactive',       value: '29',     color: '#EF4444', bg: '#FEF2F2' },
        ].map(s => (
          <div key={s.label} style={{ padding: '12px 14px', borderRadius: 10, background: s.bg, textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Results table */}
      <div style={{ borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden', background: '#fff' }}>
        <table>
          <thead>
            <tr>
              {['NCPDP ID','Pharmacy Name','City','State','Type','DEA','Phone','Status'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resultRows.map(r => (
              <tr key={r.ncpdp}>
                <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#4F46E5', fontSize: 12.5 }}>{r.ncpdp}</td>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td style={{ color: '#64748B' }}>{r.city}</td>
                <td style={{ fontWeight: 600 }}>{r.state}</td>
                <td>
                  <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' }}>{r.type}</span>
                </td>
                <td>{deaBadge(r.dea)}</td>
                <td style={{ color: '#94A3B8', fontSize: 12.5 }}>{r.phone}</td>
                <td><Badge variant={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '8px 16px', borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#94A3B8', textAlign: 'right' }}>
          Showing <strong style={{ color: '#334155' }}>{resultRows.length}</strong> of <strong style={{ color: '#334155' }}>247</strong> entries
        </div>
      </div>
    </div>
  );
}

/* ── SQL Tab ──────────────────────────────────────────────────────── */
function SqlTab({ sql }: { sql: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <pre style={{
          background: '#0F1A3E', color: '#A5B4FC',
          fontFamily: 'ui-monospace, "Cascadia Code", Menlo, monospace',
          fontSize: 12.5, lineHeight: 1.7, padding: '24px 28px',
          borderRadius: 12, overflowX: 'auto', margin: 0,
          border: '1px solid rgba(165,180,252,.12)',
        }}>{sql}</pre>
        <button onClick={() => { navigator.clipboard.writeText(sql).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }} style={{
          position: 'absolute', top: 12, right: 14,
          background: copied ? '#059669' : 'rgba(165,180,252,.15)',
          border: '1px solid rgba(165,180,252,.25)', borderRadius: 6,
          padding: '5px 14px', fontSize: 11, fontWeight: 600,
          color: copied ? '#fff' : '#A5B4FC', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <IconCopy size={12}/> {copied ? 'Copied!' : 'Copy SQL'}
        </button>
      </div>
      <div style={{ marginTop: 12, padding: '10px 16px', background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', gap: 20, fontSize: 12, color: '#64748B' }}>
        <span>Execution: <strong style={{ color: '#10B981' }}>0.83s</strong></span>
        <span>Scanned: <strong style={{ color: '#334155' }}>68,247</strong></span>
        <span>Returned: <strong style={{ color: '#4F46E5' }}>247 rows</strong></span>
        <span>Engine: <strong style={{ color: '#334155' }}>PostgreSQL 16</strong></span>
      </div>
    </div>
  );
}

/* ── Charts Tab ──────────────────────────────────────────────────── */
function ChartsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Bar chart — Results by State */}
      <div style={{ padding: '18px 20px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Results by State</div>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BAR_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
              <XAxis dataKey="state" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }}/>
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }}/>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}/>
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Pie chart — Distribution by Type */}
        <div style={{ padding: '18px 20px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Distribution by Type</div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map(d => <Cell key={d.name} fill={d.color}/>)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}/>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area chart — Trend over time */}
        <div style={{ padding: '18px 20px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Network Trend (6 months)</div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }}/>
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }}/>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}/>
                <Area type="monotone" dataKey="new" stackId="1" stroke="#10B981" fill="#D1FAE5" strokeWidth={2}/>
                <Area type="monotone" dataKey="closed" stackId="2" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Export Tab ───────────────────────────────────────────────────── */
function ExportTab({ agentName, resultRows, sql }: { agentName: string; resultRows: ResultRow[]; sql: string }) {
  const [downloading, setDownloading] = useState<string | null>(null);

  function downloadCSV() {
    setDownloading('csv');
    const headers = ['NCPDP ID','Pharmacy Name','City','State','Type','DEA Status','Status','Phone'];
    const csvRows = [
      headers.join(','),
      ...resultRows.map(r => [r.ncpdp, `"${r.name}"`, r.city, r.state, r.type, r.dea, r.status, r.phone].join(',')),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${agentName.replace(/\s+/g, '_')}_results.csv`; a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(null), 1000);
  }

  function downloadJSON() {
    setDownloading('json');
    const blob = new Blob([JSON.stringify(resultRows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${agentName.replace(/\s+/g, '_')}_results.json`; a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(null), 1000);
  }

  function downloadSQL() {
    setDownloading('sql');
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${agentName.replace(/\s+/g, '_')}_query.sql`; a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(null), 1000);
  }

  function copyEndpoint() {
    setDownloading('api');
    navigator.clipboard.writeText(`https://api.dataq.ai/v1/agents/${agentName.toLowerCase().replace(/\s+/g, '-')}/results?format=json&limit=247`).catch(() => {});
    setTimeout(() => setDownloading(null), 1500);
  }

  const formats = [
    { key: 'csv',  icon: <IconReport size={22} color="#4F46E5"/>,  label: 'CSV',             desc: 'Comma-separated values. Compatible with Excel, Google Sheets, and any data tool.', size: `~${(resultRows.length * 120 / 1024).toFixed(0)} KB`, action: 'Download CSV',     fn: downloadCSV,   gradient: '#EEF2FF' },
    { key: 'json', icon: <IconCode size={22} color="#10B981"/>,    label: 'JSON',            desc: 'Structured JSON array. Ideal for programmatic access and API integrations.',        size: `~${(resultRows.length * 200 / 1024).toFixed(0)} KB`, action: 'Download JSON',    fn: downloadJSON,  gradient: '#ECFDF5' },
    { key: 'sql',  icon: <IconDatabase size={22} color="#F59E0B"/>,label: 'SQL Query',       desc: 'Download the generated SQL query to run directly against your database.',           size: '~1 KB',                                              action: 'Download SQL',     fn: downloadSQL,   gradient: '#FFF7ED' },
    { key: 'api',  icon: <IconNetwork size={22} color="#8B5CF6"/>, label: 'API Endpoint',    desc: 'Copy the REST endpoint URL to fetch these results programmatically.',               size: 'Live',                                               action: 'Copy Endpoint',    fn: copyEndpoint,  gradient: '#F5F3FF' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {formats.map(f => (
        <div key={f.key} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#fff' }}>
          <div style={{ padding: '16px 20px', background: f.gradient }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              {f.icon}
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>{f.label}</div>
            </div>
            <div style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.5 }}>{f.desc}</div>
          </div>
          <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{f.size}</span>
            <button onClick={f.fn} disabled={downloading === f.key} className="btn-primary" style={{ fontSize: 12, padding: '6px 16px', gap: 5 }}>
              {downloading === f.key
                ? (f.key === 'api' ? 'Copied!' : 'Downloading...')
                : <><IconDownload size={12} color="#fff"/> {f.action}</>
              }
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main inner component ────────────────────────────────────────── */
function AgentRunInner() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent') ?? 'agt-01';
  const agent = agents.find(a => a.id.toLowerCase() === agentId.toLowerCase()) ?? agents[0];
  const cc = catColors[agent.category] ?? catColors['Search & Discovery'];
  const agentSuggestions = suggestions[agent.category] ?? suggestions['Search & Discovery'];
  const sql = sqlByCategory[agent.category] ?? sqlByCategory['default'];

  const [activeTab, setActiveTab] = useState<Tab>('results');
  const [sqlCopied, setSqlCopied] = useState(false);
  const [chatWidth, setChatWidth] = useState(480);
  const [showOutput, setShowOutput] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(420);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = chatWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const delta = ev.clientX - startX.current;
      const next = Math.max(300, Math.min(800, startW.current + delta));
      setChatWidth(next);
    };
    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [chatWidth]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'results', label: 'Results' },
    { id: 'sql',     label: 'SQL Query' },
    { id: 'charts',  label: 'Charts' },
    { id: 'export',  label: 'Export' },
  ];

  function handleBotReply(msg: string) {
    setTimeout(() => setHasResults(true), 0);
    return `Analyzed 68,247 pharmacy records across 50 states.\nFound 247 matching results for: "${msg.slice(0, 80)}${msg.length > 80 ? '...' : ''}"`;
  }

  function handleOpenCanvas() {
    setShowOutput(true);
    setActiveTab('results');
  }

  return (
    <>
      <Topbar
        title={agent.name}
        subtitle={`${agent.id.toUpperCase()} · ${agent.category}`}
        actions={
          <button
            className={showOutput ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setShowOutput(o => !o)}
            style={{ fontSize: 12, gap: 5 }}
          >
            <IconBarChart size={13} color={showOutput ? '#fff' : undefined}/>
            {showOutput ? 'Hide Output' : 'Show Output'}
          </button>
        }
      />
      <main style={{ display: 'flex', height: `calc(100vh - var(--topbar-h))` }}>

        {/* ── LEFT: Chat ── */}
        <div style={{ display: 'flex', flexDirection: 'column', width: showOutput ? chatWidth : '100%', flexShrink: showOutput ? 0 : undefined, flex: showOutput ? undefined : 1, minHeight: 0, overflow: 'hidden', transition: 'width .2s ease' }}>
          {/* Back link */}
          <div style={{ padding: '8px 18px', borderBottom: '1px solid #F3F4F6', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/agents" style={{ display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none', color: '#9CA3AF', fontSize: 12, fontWeight: 500 }}>
              <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}><IconChevronRight size={12}/></span>
              Back to Agents
            </Link>
          </div>

          {/* Chat area — uses AgentChat internally but we build inline for tighter integration */}
          <AgentChat
            agentName={agent.name}
            agentId={agent.id.toUpperCase()}
            gradient={cc.gradient}
            icon={catIcon(agent.category, 18)}
            welcomeMessage={`Hi Sarah! I'm ${agent.name}. ${agent.desc}\n\nAsk me anything or pick a suggested query below to get started.`}
            suggestions={agentSuggestions}
            getBotReply={handleBotReply}
            onOpenCanvas={handleOpenCanvas}
            hideHeader
            fluid
          />
        </div>

        {showOutput && (
          <>
            {/* ── Resize handle ── */}
            <div
              onMouseDown={onMouseDown}
              style={{
                width: 6, flexShrink: 0, cursor: 'col-resize',
                background: 'transparent', position: 'relative', zIndex: 10,
              }}
              onMouseEnter={e => { const line = e.currentTarget.firstElementChild as HTMLElement; if (line) line.style.background = '#818CF8'; }}
              onMouseLeave={e => { const line = e.currentTarget.firstElementChild as HTMLElement; if (line) line.style.background = '#E2E8F0'; }}
            >
              <div style={{
                position: 'absolute', left: 2, top: 0, bottom: 0, width: 2,
                background: '#E2E8F0', transition: 'background .15s',
              }}/>
              <div style={{
                position: 'absolute', left: -2, top: '50%', transform: 'translateY(-50%)',
                width: 10, height: 40, borderRadius: 5,
                background: '#CBD5E1', opacity: 0.6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="4" height="16" viewBox="0 0 4 16" fill="#94A3B8">
                  <circle cx="2" cy="3" r="1.2"/><circle cx="2" cy="8" r="1.2"/><circle cx="2" cy="13" r="1.2"/>
                </svg>
              </div>
            </div>

            {/* ── RIGHT: Results panel ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FAFBFC', minWidth: 0 }}>



              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#fff', flexShrink: 0 }}>
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                    padding: '10px 18px', fontSize: 12.5, fontWeight: activeTab === t.id ? 600 : 500,
                    color: activeTab === t.id ? '#1B2B6B' : '#9CA3AF',
                    background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: activeTab === t.id ? '2px solid #4F46E5' : '2px solid transparent',
                    marginBottom: -1,
                  }}>{t.label}</button>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {!hasResults ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 16, background: '#EEF2FF', border: '1px solid #E0E7FF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                    }}>
                      <IconCpu size={28} color="#818CF8"/>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8', marginBottom: 6 }}>Ready to run</div>
                    <div style={{ fontSize: 13, color: '#CBD5E1', maxWidth: 320, lineHeight: 1.6 }}>
                      Send a message in the chat to run this agent. Results will appear here.
                    </div>
                  </div>
                ) : (
                  <>
                    {activeTab === 'results' && <ResultsTab agentName={agent.name} resultRows={RESULT_ROWS}/>}
                    {activeTab === 'sql' && <SqlTab sql={sql}/>}
                    {activeTab === 'charts' && <ChartsTab/>}
                    {activeTab === 'export' && <ExportTab agentName={agent.name} resultRows={RESULT_ROWS} sql={sql}/>}
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
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>Loading agent...</div>}>
      <AgentRunInner/>
    </Suspense>
  );
}
