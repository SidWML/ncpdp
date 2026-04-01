'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopbarV2 } from '@/components/v2/TopbarV2';
import { agents } from '@/lib/mockData';
import {
  IconSearch, IconShield, IconDatabase, IconNetwork, IconBarChart,
  IconCheck, IconZap, IconCpu, IconSparkles, IconChevronRight,
} from '@/components/ui/Icons';

const catColors: Record<string, { c: string; bg: string }> = {
  'Search & Discovery':      { c: '#6366F1', bg: '#EEF2FF' },
  'Network Management':      { c: '#059669', bg: '#ECFDF5' },
  'Compliance & Regulatory': { c: '#DC2626', bg: '#FEF2F2' },
  'Data Delivery':           { c: '#2563EB', bg: '#EFF6FF' },
  'Credentialing (resQ)':    { c: '#D97706', bg: '#FFFBEB' },
  'Analytics & Prediction':  { c: '#7C3AED', bg: '#F5F3FF' },
  'Claims & Routing':        { c: '#10B981', bg: '#ECFDF5' },
  'NCPDP Internal':          { c: '#0284C7', bg: '#F0F9FF' },
};

const catIcon = (cat: string) => {
  const m: Record<string, React.ReactElement> = {
    'Search & Discovery': <IconSearch size={16}/>, 'Network Management': <IconNetwork size={16}/>,
    'Compliance & Regulatory': <IconShield size={16}/>, 'Data Delivery': <IconDatabase size={16}/>,
    'Credentialing (resQ)': <IconCheck size={16}/>, 'Analytics & Prediction': <IconBarChart size={16}/>,
    'Claims & Routing': <IconZap size={16}/>, 'NCPDP Internal': <IconCpu size={16}/>,
  };
  return m[cat] || <IconSparkles size={16}/>;
};

const CATEGORIES = ['All', ...Object.keys(catColors)];
const PHASES = ['All', '1a', '1b', '1c'];

export default function AgentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [phaseFilter, setPhaseFilter] = useState('All');

  const filtered = agents.filter(a => {
    if (catFilter !== 'All' && a.category !== catFilter) return false;
    if (phaseFilter !== 'All' && a.phase !== phaseFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const phaseLabel = (p: string) => p === '1a' ? 'Live' : p === '1b' ? 'Q2 2026' : 'Q3 2026';
  const phaseColor = (p: string) => p === '1a' ? 'var(--v2-green)' : p === '1b' ? 'var(--v2-primary)' : 'var(--v2-text-3)';

  return (
    <>
      <TopbarV2 title="Agents" subtitle={`${agents.length} AI agents across ${Object.keys(catColors).length} categories`}/>
      <main style={{ padding: '16px 20px 40px' }}>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
              <IconSearch size={14} color="var(--v2-text-3)"/>
            </span>
            <input className="v2i" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..." style={{ paddingLeft: 34 }}/>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className="v2b" style={{
                padding: '4px 10px', fontSize: 11, borderRadius: 20,
                background: catFilter === c ? 'var(--v2-primary)' : 'var(--v2-surface-2)',
                color: catFilter === c ? '#fff' : 'var(--v2-text-2)',
                fontWeight: 500,
              }}>{c === 'All' ? 'All' : c.split(' ')[0]}</button>
            ))}
          </div>

          {/* Phase filter */}
          <div style={{ display: 'flex', gap: 2, background: 'var(--v2-surface-2)', borderRadius: 8, padding: 2 }}>
            {PHASES.map(p => (
              <button key={p} onClick={() => setPhaseFilter(p)} className="v2b" style={{
                padding: '4px 10px', fontSize: 11, borderRadius: 6,
                background: phaseFilter === p ? 'var(--v2-surface)' : 'transparent',
                color: phaseFilter === p ? 'var(--v2-text)' : 'var(--v2-text-3)',
                boxShadow: phaseFilter === p ? 'var(--v2-shadow-sm)' : 'none',
                fontWeight: 500,
              }}>{p === 'All' ? 'All Phases' : `Phase ${p}`}</button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--v2-text-3)' }}>{filtered.length} agents</div>
        </div>

        {/* Agent grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {filtered.map(a => {
            const cc = catColors[a.category] || catColors['Search & Discovery'];
            return (
              <div key={a.id} className="v2c" style={{ padding: '16px 18px', cursor: 'pointer', transition: 'box-shadow .12s, transform .12s' }}
                onClick={() => router.push(`/v2/agents/run?agent=${a.id}`)}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--v2-shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--v2-shadow-sm)'; e.currentTarget.style.transform = ''; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: cc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cc.c, flexShrink: 0 }}>
                    {catIcon(a.category)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 2 }}>{a.name}</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span className="v2g" style={{ background: cc.bg, color: cc.c, fontSize: 10 }}>{a.category.split(' ')[0]}</span>
                      <span className="v2g" style={{ background: `${phaseColor(a.phase)}12`, color: phaseColor(a.phase), fontSize: 10 }}>{phaseLabel(a.phase)}</span>
                    </div>
                  </div>
                  <IconChevronRight size={14} color="var(--v2-text-3)"/>
                </div>
                <div style={{ fontSize: 12, color: 'var(--v2-text-2)', lineHeight: 1.5, marginBottom: 10 }}>{a.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>{a.uses.toLocaleString()} runs</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--v2-primary)' }}>{a.id.toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
