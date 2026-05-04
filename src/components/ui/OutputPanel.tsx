'use client';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import {
  IconBarChart, IconDatabase, IconNetwork, IconReport,
  IconCode, IconCopy, IconDownload, IconChevronRight,
  IconAlertTriangle, IconShield, IconSparkles,
} from '@/components/ui/Icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';

/* ── Shared types ────────────────────────────────────────────────── */
export type ResultRow = {
  ncpdp: string; name: string; city: string; state: string;
  type: string; status: string; dea: string; phone: string;
};

export type InsightItem = { text: string; type: 'danger' | 'warning' | 'success' | 'info' };
export type SummaryStat = { label: string; value: string; color: string; bg: string };
export type BarDatum = { label: string; value: number };
export type PieDatum = { name: string; value: number; color: string };
export type TrendDatum = { month: string; primary: number; secondary: number };

export interface QueryContext {
  rows: ResultRow[];
  sql: string;
  insights: InsightItem[];
  stats: SummaryStat[];
  barData: BarDatum[];
  barLabel: string;
  pieData: PieDatum[];
  pieLabel: string;
  trendData: TrendDatum[];
  trendLabel: string;
  trendKeys: [string, string];
  totalResults: number;
  execTime: string;
  followUps: string[];
  canvasLabel: string;
  chatInsights: { icon: 'warning' | 'info' | 'location' | 'stat'; text: string; color: string }[];
}

export type OutputTab = 'results' | 'sql' | 'charts' | 'export';

/* ── Insight colors ──────────────────────────────────────────────── */
const insightStyle: Record<string, { icon: React.ReactNode; bg: string; border: string; color: string }> = {
  danger:  { icon: <IconAlertTriangle size={14} color="#DC2626"/>, bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
  warning: { icon: <IconBarChart size={14} color="#D97706"/>,      bg: '#FFF7ED', border: '#FDE68A', color: '#92400E' },
  success: { icon: <IconBarChart size={14} color="#449055"/>,      bg: '#ECFDF5', border: '#A7F3D0', color: '#2A6936' },
  info:    { icon: <IconShield size={14} color="#005C8D"/>,        bg: '#E8F3F9', border: '#8FC2D8', color: '#1E40AF' },
};

/* ── Insights Banner ─────────────────────────────────────────────── */
function InsightsBanner({ insights }: { insights: InsightItem[] }) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const visible = insights.filter((_, i) => !dismissed.has(i));
  if (visible.length === 0) return null;
  return (
    <div style={{ marginBottom: 16, padding: '14px 16px', borderRadius: 12, background: 'linear-gradient(135deg, #FAFBFC 0%, #E8F3F9 50%, #FAFBFC 100%)', border: '1px solid #E8EFF8' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>
        <IconSparkles size={12} color="#005C8D"/> AI Insights
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map((ins, idx) => {
          const s = insightStyle[ins.type] || insightStyle.info;
          const origIdx = insights.indexOf(ins);
          return (
            <div key={origIdx} onClick={() => setDismissed(d => new Set([...d, origIdx]))} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: s.bg, border: `1px solid ${s.border}`, cursor: 'pointer', fontSize: 12, color: s.color, lineHeight: 1.4 }}>
              {s.icon}
              <span style={{ flex: 1 }}>{ins.text}</span>
              <span style={{ fontSize: 10, color: '#94A3B8' }}>dismiss</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Results Tab ─────────────────────────────────────────────────── */
export function ResultsTab({ ctx }: { ctx: QueryContext }) {
  const deaBadge = (s: string) =>
    s === 'Valid' ? <Badge variant="success">Valid</Badge> :
    s === 'Expiring' ? <Badge variant="warning">Expiring</Badge> :
    s === 'Expired' ? <Badge variant="danger">Expired</Badge> :
    <Badge variant="neutral">{s}</Badge>;
  return (
    <div>
      <InsightsBanner insights={ctx.insights}/>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${ctx.stats.length},1fr)`, gap: 10, marginBottom: 18 }}>
        {ctx.stats.map(s => (
          <div key={s.label} style={{ padding: '12px 16px', borderRadius: 8, background: s.bg, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden', background: '#fff' }}>
        <table>
          <thead>
            <tr>{['NCPDP ID','Pharmacy Name','City','State','Type','DEA','Phone','Status'].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {ctx.rows.map(r => (
              <tr key={r.ncpdp} style={{ transition: 'background .08s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#E8F3F9')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#005C8D', fontSize: 13 }}>{r.ncpdp}</td>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td style={{ color: '#64748B' }}>{r.city}</td>
                <td style={{ fontWeight: 600 }}>{r.state}</td>
                <td><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: '#F1F5F9', color: '#475569' }}>{r.type}</span></td>
                <td>{deaBadge(r.dea)}</td>
                <td style={{ color: '#94A3B8', fontSize: 13 }}>{r.phone}</td>
                <td><Badge variant={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '8px 16px', borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#94A3B8', textAlign: 'right' }}>
          Showing <strong style={{ color: '#334155' }}>{ctx.rows.length}</strong> of <strong style={{ color: '#334155' }}>{ctx.totalResults.toLocaleString()}</strong> entries
        </div>
      </div>
    </div>
  );
}

/* ── SQL Tab ──────────────────────────────────────────────────────── */
export function SqlTab({ ctx }: { ctx: QueryContext }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <pre style={{
          background: 'var(--surface-2)', color: 'var(--text-primary)',
          fontFamily: 'ui-monospace, "Cascadia Code", Menlo, monospace',
          fontSize: 13, lineHeight: 1.7, padding: '24px 28px',
          borderRadius: 12, overflowX: 'auto', margin: 0,
          border: '1px solid var(--border)',
        }}>{ctx.sql}</pre>
        <button onClick={() => { navigator.clipboard.writeText(ctx.sql).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }} style={{
          position: 'absolute', top: 12, right: 14,
          background: copied ? '#449055' : 'rgba(0,92,141,.15)',
          border: '1px solid rgba(0,92,141,.25)', borderRadius: 6,
          padding: '4px 16px', fontSize: 12, fontWeight: 600,
          color: copied ? '#fff' : '#005C8D', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <IconCopy size={12}/> {copied ? 'Copied!' : 'Copy SQL'}
        </button>
      </div>
      <div style={{ marginTop: 12, padding: '10px 16px', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', gap: 20, fontSize: 12, color: '#64748B' }}>
        <span>Execution: <strong style={{ color: '#76C799' }}>{ctx.execTime}</strong></span>
        <span>Scanned: <strong style={{ color: '#334155' }}>81,500</strong></span>
        <span>Returned: <strong style={{ color: '#005C8D' }}>{ctx.totalResults.toLocaleString()} rows</strong></span>
        <span>Engine: <strong style={{ color: '#334155' }}>PostgreSQL 16</strong></span>
      </div>
    </div>
  );
}

/* ── Charts Tab ──────────────────────────────────────────────────── */
export function ChartsTab({ ctx }: { ctx: QueryContext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '18px 20px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>{ctx.barLabel}</div>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ctx.barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }}/>
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }}/>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}/>
              <Bar dataKey="value" fill="#005C8D" radius={[4, 4, 0, 0]} barSize={32}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: '18px 20px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>{ctx.pieLabel}</div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ctx.pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                  {ctx.pieData.map(d => <Cell key={d.name} fill={d.color}/>)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}/>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ padding: '18px 20px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>{ctx.trendLabel}</div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ctx.trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }}/>
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }}/>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}/>
                <Area type="monotone" dataKey="primary" stackId="1" stroke="#76C799" fill="#D1FAE5" strokeWidth={2} name={ctx.trendKeys[0]}/>
                <Area type="monotone" dataKey="secondary" stackId="2" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} name={ctx.trendKeys[1]}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Export Tab ───────────────────────────────────────────────────── */
export function ExportTab({ title, ctx }: { title?: string; ctx: QueryContext }) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const label = title || 'Smart_Search';

  function downloadCSV() {
    setDownloading('csv');
    const headers = ['NCPDP ID','Pharmacy Name','City','State','Type','DEA Status','Status','Phone'];
    const csvRows = [headers.join(','), ...ctx.rows.map(r => [r.ncpdp, `"${r.name}"`, r.city, r.state, r.type, r.dea, r.status, r.phone].join(','))];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${label.replace(/\s+/g, '_')}_results.csv`; a.click(); URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(null), 1000);
  }
  function downloadJSON() {
    setDownloading('json');
    const blob = new Blob([JSON.stringify(ctx.rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${label.replace(/\s+/g, '_')}_results.json`; a.click(); URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(null), 1000);
  }
  function downloadSQL() {
    setDownloading('sql');
    const blob = new Blob([ctx.sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${label.replace(/\s+/g, '_')}_query.sql`; a.click(); URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(null), 1000);
  }
  function copyEndpoint() {
    setDownloading('api');
    navigator.clipboard.writeText(`https://api.dataq.ai/v1/search/results?format=json&limit=${ctx.totalResults}`).catch(() => {});
    setTimeout(() => setDownloading(null), 1500);
  }

  const formats = [
    { key: 'csv',  icon: <IconReport size={22} color="#005C8D"/>,  label: 'CSV',          desc: 'Comma-separated values for Excel, Google Sheets.', size: `~${(ctx.rows.length * 120 / 1024).toFixed(0)} KB`, action: 'Download CSV',  fn: downloadCSV,  gradient: '#E8F3F9' },
    { key: 'json', icon: <IconCode size={22} color="#76C799"/>,    label: 'JSON',         desc: 'Structured JSON for programmatic access.',          size: `~${(ctx.rows.length * 200 / 1024).toFixed(0)} KB`, action: 'Download JSON', fn: downloadJSON, gradient: '#ECFDF5' },
    { key: 'sql',  icon: <IconDatabase size={22} color="#F59E0B"/>,label: 'SQL Query',    desc: 'Run directly against your database.',                size: '~1 KB',                                            action: 'Download SQL',  fn: downloadSQL,  gradient: '#FFF7ED' },
    { key: 'api',  icon: <IconNetwork size={22} color="#005C8D"/>, label: 'API Endpoint', desc: 'REST endpoint for live results.',                    size: 'Live',                                             action: 'Copy Endpoint', fn: copyEndpoint, gradient: '#E8F3F9' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {formats.map(f => (
        <div key={f.key} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#fff' }}>
          <div style={{ padding: '16px 20px', background: f.gradient }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>{f.icon}<div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>{f.label}</div></div>
            <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{f.desc}</div>
          </div>
          <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{f.size}</span>
            <button onClick={f.fn} disabled={downloading === f.key} className="btn-primary" style={{ fontSize: 12, padding: '6px 16px', gap: 5 }}>
              {downloading === f.key ? (f.key === 'api' ? 'Copied!' : 'Downloading...') : <><IconDownload size={12} color="#fff"/> {f.action}</>}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Output Panel (tabs) ──────────────────────────────────────────── */
export function OutputPanel({ ctx, title }: { ctx: QueryContext; title?: string }) {
  const [activeTab, setActiveTab] = useState<OutputTab>('results');
  const tabs: { id: OutputTab; label: string; icon: React.ReactNode }[] = [
    { id: 'results', label: 'Results',   icon: <IconChevronRight size={12}/> },
    { id: 'sql',     label: 'SQL Query', icon: <IconCode size={12}/> },
    { id: 'charts',  label: 'Charts',    icon: <IconBarChart size={12}/> },
    { id: 'export',  label: 'Export',    icon: <IconDownload size={12}/> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#FAFBFC', height: '100%', minWidth: 0 }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#fff', flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '10px 18px', border: 'none', cursor: 'pointer',
            background: activeTab === t.id ? '#fff' : 'transparent',
            borderBottom: activeTab === t.id ? '2px solid #005C8D' : '2px solid transparent',
            color: activeTab === t.id ? '#005C8D' : '#64748B',
            fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500,
            display: 'flex', alignItems: 'center', gap: 6, transition: 'all .15s',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {activeTab === 'results' && <ResultsTab ctx={ctx}/>}
        {activeTab === 'sql'     && <SqlTab ctx={ctx}/>}
        {activeTab === 'charts'  && <ChartsTab ctx={ctx}/>}
        {activeTab === 'export'  && <ExportTab title={title} ctx={ctx}/>}
      </div>
    </div>
  );
}
