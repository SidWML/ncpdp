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
  'Search & Discovery':      { bg: '#F0F7FF', text: '#2968B0', border: '#B8D5F5' },
  'Network Management':      { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  'Compliance & Regulatory': { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  'Data Delivery':           { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  'Credentialing (resQ)':    { bg: '#FFF7ED', text: '#D97706', border: '#FDE68A' },
  'Analytics & Prediction':  { bg: '#F0F7FF', text: '#2968B0', border: '#B8D5F5' },
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
      text: `Compliance scan complete. Reviewed 81,500 pharmacy records. Found 2 subscriptions nearing expiration.`,
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
      text: `Network analysis complete. Evaluated adequacy standards across 8 states. 3 coverage gaps identified.`,
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
      { label: 'Records',     value: '81,500 processed',         badge: 'Full',    badgeColor: 'brand' as const   },
      { label: 'Alerts',      value: '47 items flagged',         badge: 'Review',  badgeColor: 'warning' as const },
      { label: 'Output',      value: 'Ready for export',         badge: 'Export',  badgeColor: 'neutral' as const },
    ],
  };
}

type AgentType = typeof agents[0];

/* ── Agent card (inline, no import) ──────────────────────────────── */
function AgentGridCard({ agent, onLaunch }: { agent: AgentType; onLaunch: () => void }) {
  const cc = catColors[agent.category] || catColors['Search & Discovery'];
  const phaseColors: Record<string, string> = { '1a': '#10B981', '1b': '#2968B0', '1c': '#94A3B8' };
  const phaseColor = phaseColors[agent.phase] || '#94A3B8';

  return (
    <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: cc.bg, border: `1px solid ${cc.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: cc.text,
          }}>
            {catIcon(agent.category)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{agent.name}</div>
            <div style={{ fontSize: 12, color: cc.text, marginTop: 2 }}>{agent.category}</div>
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: phaseColor, background: `${phaseColor}18`, padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
          {agent.phase === '1a' ? 'Live' : agent.phase === '1b' ? 'Q2' : 'Q3'}
        </span>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, flex: 1 }}>{agent.desc}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
          {agent.uses.toLocaleString()} runs
        </span>
        <button
          className={agent.phase === '1a' ? 'btn-primary' : 'btn-secondary'}
          onClick={onLaunch}
          style={{ fontSize: 12, gap: 5, padding: '4px 12px' }}
        >
          <IconPlay size={12} color={agent.phase === '1a' ? '#fff' : 'var(--text-secondary)'}/>
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
                  fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 4,
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
