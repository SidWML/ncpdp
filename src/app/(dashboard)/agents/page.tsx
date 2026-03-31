'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { agents, agentCategories, pharmacyResults, alerts } from '@/lib/mockData';
import {
  IconSearch, IconPlay, IconX, IconCpu, IconShield, IconDatabase,
  IconNetwork, IconBarChart, IconReport, IconSend, IconCheck,
  IconAlertTriangle, IconChevronRight, IconZap, IconBot,
} from '@/components/ui/Icons';

/* ── Category color map ───────────────────────────────────────────── */
const catColors: Record<string, { bg: string; text: string; border: string }> = {
  'Search & Discovery':      { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' },
  'Network Management':      { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  'Compliance & Regulatory': { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  'Data Delivery':           { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  'Credentialing (resQ)':    { bg: '#FFF7ED', text: '#D97706', border: '#FDE68A' },
  'Analytics & Prediction':  { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  'Claims & Routing':        { bg: '#ECFDF5', text: '#10B981', border: '#6EE7B7' },
  'NCPDP Internal':          { bg: '#F0F9FF', text: '#0284C7', border: '#BAE6FD' },
};

const catIcon = (cat: string) => {
  const icons: Record<string, React.ReactElement> = {
    'Search & Discovery':      <IconSearch size={13}/>,
    'Network Management':      <IconNetwork size={13}/>,
    'Compliance & Regulatory': <IconShield size={13}/>,
    'Data Delivery':           <IconDatabase size={13}/>,
    'Credentialing (resQ)':    <IconCheck size={13}/>,
    'Analytics & Prediction':  <IconBarChart size={13}/>,
    'Claims & Routing':        <IconZap size={13}/>,
    'NCPDP Internal':          <IconCpu size={13}/>,
  };
  return icons[cat] || <IconBot size={13}/>;
};

/* ── Demo responses per agent ─────────────────────────────────────── */
function getDemoResponse(agent: typeof agents[0]) {
  if (agent.category === 'Search & Discovery') {
    return {
      text: `Found ${pharmacyResults.length} pharmacies matching your query. Showing top results with credential status and network coverage.`,
      rows: pharmacyResults.slice(0, 4).map(p => ({
        label: p.name,
        value: `${p.city}, ${p.state}`,
        badge: p.dea,
        badgeColor: p.dea === 'Active' ? 'success' : p.dea === 'Expiring' ? 'warning' : 'danger',
      })),
    };
  }
  if (agent.category === 'Compliance & Regulatory') {
    return {
      text: `Compliance scan complete. Reviewed 68,247 pharmacy records. Found 47 active alerts requiring attention.`,
      rows: alerts.slice(0, 4).map(a => ({
        label: a.title,
        value: `${a.pharmacy} · ${a.location}`,
        badge: a.severity,
        badgeColor: a.severity === 'critical' ? 'danger' : a.severity === 'warning' ? 'warning' : 'info',
      })),
    };
  }
  if (agent.category === 'Network Management') {
    return {
      text: `Network analysis complete. Evaluated CMS adequacy standards across 8 states. 3 coverage gaps identified.`,
      rows: [
        { label: 'California',  value: '8,420 pharmacies · 96% adequate', badge: 'Pass',    badgeColor: 'success' as const },
        { label: 'Texas',       value: '7,180 pharmacies · 93% adequate', badge: 'Pass',    badgeColor: 'success' as const },
        { label: 'Florida',     value: '6,340 pharmacies · 88% adequate', badge: 'Review',  badgeColor: 'warning' as const },
        { label: 'Illinois',    value: '3,750 pharmacies · 86% adequate', badge: 'Review',  badgeColor: 'warning' as const },
      ],
    };
  }
  if (agent.category === 'Analytics & Prediction') {
    return {
      text: `Predictive model run complete. Analyzed 24 months of historical data. Identified 12 pharmacies at elevated risk.`,
      rows: [
        { label: 'Closure Risk (High)',   value: '3 pharmacies flagged',  badge: 'Action',  badgeColor: 'danger' as const  },
        { label: 'Closure Risk (Medium)', value: '9 pharmacies flagged',  badge: 'Monitor', badgeColor: 'warning' as const },
        { label: 'Desert Risk Zones',     value: '4 counties identified', badge: 'Alert',   badgeColor: 'warning' as const },
        { label: 'API Usage Trend',       value: '+18% MoM growth',       badge: 'Healthy', badgeColor: 'success' as const },
      ],
    };
  }
  return {
    text: `Agent "${agent.name}" executed successfully. ${agent.uses.toLocaleString()} total runs · Phase ${agent.phase} · ${agent.desc}`,
    rows: [
      { label: 'Status',      value: 'Completed in 0.8s',       badge: 'Done',    badgeColor: 'success' as const },
      { label: 'Records',     value: '68,247 processed',         badge: 'Full',    badgeColor: 'brand' as const   },
      { label: 'Alerts',      value: '47 items flagged',         badge: 'Review',  badgeColor: 'warning' as const },
      { label: 'Output',      value: 'Ready for export',         badge: 'Export',  badgeColor: 'neutral' as const },
    ],
  };
}

type AgentType = typeof agents[0];

/* ── Agent card (inline, no import) ──────────────────────────────── */
function AgentGridCard({ agent, onLaunch }: { agent: AgentType; onLaunch: () => void }) {
  const cc = catColors[agent.category] || catColors['Search & Discovery'];
  const phaseColors: Record<string, string> = { '1a': '#10B981', '1b': '#4F46E5', '1c': '#94A3B8' };
  const phaseColor = phaseColors[agent.phase] || '#94A3B8';

  return (
    <div className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: cc.bg, border: `1px solid ${cc.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: cc.text,
          }}>
            {catIcon(agent.category)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{agent.name}</div>
            <div style={{ fontSize: 10.5, color: cc.text, marginTop: 2 }}>{agent.category}</div>
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: phaseColor, background: `${phaseColor}18`, border: `1px solid ${phaseColor}30`, padding: '2px 7px', borderRadius: 9999, flexShrink: 0 }}>
          {agent.phase === '1a' ? 'Live' : agent.phase === '1b' ? 'Q2' : 'Q3'}
        </span>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, flex: 1 }}>{agent.desc}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
          {agent.uses.toLocaleString()} runs
        </span>
        <button
          className={agent.phase === '1a' ? 'btn-primary' : 'btn-secondary'}
          onClick={onLaunch}
          style={{ fontSize: 11.5, gap: 5, padding: '5px 12px' }}
        >
          <IconPlay size={11} color={agent.phase === '1a' ? '#fff' : 'var(--text-secondary)'}/>
          {agent.phase === '1a' ? 'Launch' : 'Preview'}
        </button>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function AgentsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePhase, setActivePhase]       = useState('All');
  const [search, setSearch]                 = useState('');

  const filtered = agents.filter(a => {
    if (activeCategory !== 'All' && a.category !== activeCategory) return false;
    if (activePhase !== 'All' && a.phase !== activePhase) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) &&
        !a.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const phaseCount = (p: string) => agents.filter(a => a.phase === p).length;

  return (
    <>
      <Topbar
        title="Agent Library"
        subtitle="33 purpose-built AI agents · Real-time pharmacy intelligence"
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <Badge variant="success" dot>Phase 1a Live</Badge>
            <Badge variant="brand">Phase 1b Coming</Badge>
          </div>
        }
      />
      <main style={{ padding: '16px 20px 40px' }}>

        {/* Phase summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { phase: '1a', label: 'Phase 1a — Live',        count: phaseCount('1a'), color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0', desc: 'Core agents deployed & running' },
            { phase: '1b', label: 'Phase 1b — In Progress', count: phaseCount('1b'), color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE', desc: 'Mid-tier agents, Q2 2026' },
            { phase: '1c', label: 'Phase 1c — Roadmap',     count: phaseCount('1c'), color: '#94A3B8', bg: '#F8FAFC', border: '#E2E8F0', desc: 'Advanced agents, Q3 2026' },
          ].map(({ phase, label, count, color, bg, border, desc }) => (
            <button
              key={phase}
              onClick={() => setActivePhase(activePhase === phase ? 'All' : phase)}
              style={{
                background: activePhase === phase ? bg : 'var(--surface)',
                border: `1px solid ${activePhase === phase ? border : 'var(--border)'}`,
                borderRadius: 14, padding: '14px 18px', textAlign: 'left', cursor: 'pointer',
                transition: 'all .15s', boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
                <span style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{count}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</div>
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 220 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
              <IconSearch size={13}/>
            </span>
            <input
              className="input-base"
              placeholder="Search agents…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 32, height: 36, fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {agentCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 9999,
                  border: '1px solid', cursor: 'pointer',
                  background: activeCategory === cat ? 'var(--brand-600)' : 'var(--surface)',
                  color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                  borderColor: activeCategory === cat ? 'var(--brand-600)' : 'var(--border)',
                  transition: 'all .15s', whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
            {filtered.length} agents
          </span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <IconCpu size={32} color="var(--border)"/>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 10 }}>No agents match your filters</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Try clearing the search or category filter</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {filtered.map(agent => (
              <AgentGridCard key={agent.id} agent={agent} onLaunch={() => router.push('/agents/run?agent=' + agent.id)}/>
            ))}
          </div>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
