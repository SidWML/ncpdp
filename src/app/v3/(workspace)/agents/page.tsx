'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/v3/TopbarV3';
import { agents } from '@/lib/mockData';
import {
  IconSearch, IconBot, IconShield, IconNetwork, IconDatabase,
  IconBarChart, IconStar, IconStore, IconBuilding, IconPlay,
  IconGlobe, IconKey, IconFilter,
} from '@/components/ui/Icons';

// -------------------------------------------------------------------
// Category color mapping
// -------------------------------------------------------------------
const catColors: Record<string, string> = {
  'Search & Discovery':      '#6366F1',
  'Network Management':      '#059669',
  'Compliance & Regulatory': '#DC2626',
  'Data Delivery':           '#2563EB',
  'Credentialing (resQ)':    '#D97706',
  'Analytics & Prediction':  '#7C3AED',
  'Claims & Routing':        '#10B981',
  'NCPDP Internal':          '#0284C7',
};

// -------------------------------------------------------------------
// Category icons
// -------------------------------------------------------------------
const catIcons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'Search & Discovery':      IconSearch,
  'Network Management':      IconNetwork,
  'Compliance & Regulatory': IconShield,
  'Data Delivery':           IconDatabase,
  'Credentialing (resQ)':    IconKey,
  'Analytics & Prediction':  IconBarChart,
  'Claims & Routing':        IconStore,
  'NCPDP Internal':          IconBuilding,
};

// -------------------------------------------------------------------
// Filter categories
// -------------------------------------------------------------------
const CATEGORIES = [
  'All', 'Search', 'Network', 'Compliance', 'Data',
  'Credentialing', 'Analytics', 'Claims', 'Internal',
];

const PHASES = ['All', '1a', '1b', '1c'];

// Map short filter label to the full category name
const catFilterMap: Record<string, string> = {
  'Search':        'Search & Discovery',
  'Network':       'Network Management',
  'Compliance':    'Compliance & Regulatory',
  'Data':          'Data Delivery',
  'Credentialing': 'Credentialing (resQ)',
  'Analytics':     'Analytics & Prediction',
  'Claims':        'Claims & Routing',
  'Internal':      'NCPDP Internal',
};

// ===================================================================
// Main page
// ===================================================================
export default function AgentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [activePhase, setActivePhase] = useState('All');

  // Filtered agents
  const filtered = useMemo(() => {
    return agents.filter(a => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.desc.toLowerCase().includes(q) && !a.category.toLowerCase().includes(q)) {
          return false;
        }
      }
      // Category filter
      if (activeCat !== 'All') {
        const fullCat = catFilterMap[activeCat];
        if (fullCat && a.category !== fullCat) return false;
      }
      // Phase filter
      if (activePhase !== 'All' && a.phase !== activePhase) return false;
      return true;
    });
  }, [search, activeCat, activePhase]);

  return (
    <>
      <Topbar
        title="AI Agents"
        subtitle={`${agents.length} agents across ${Object.keys(catColors).length} categories`}
      />
      <div style={{ padding: 24 }}>
        {/* Search + Filters row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', width: 320, flexShrink: 0 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
              <IconSearch size={14} color="var(--v3-text-3)"/>
            </span>
            <input
              className="v3-input"
              placeholder="Search agents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 38, height: 40 }}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`v3-btn ${activeCat === cat ? 'v3-btn-accent' : 'v3-btn-soft'}`}
                style={{ padding: '6px 14px', fontSize: 12, borderRadius: 20 }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Phase toggle */}
          <div style={{
            display: 'flex', gap: 2, background: 'var(--v3-surface-2)', borderRadius: 10, padding: 3,
          }}>
            {PHASES.map(p => (
              <button
                key={p}
                onClick={() => setActivePhase(p)}
                style={{
                  padding: '5px 14px', border: 'none', borderRadius: 8,
                  fontSize: 12, fontWeight: activePhase === p ? 600 : 450,
                  background: activePhase === p ? '#fff' : 'transparent',
                  color: activePhase === p ? 'var(--v3-accent)' : 'var(--v3-text-3)',
                  boxShadow: activePhase === p ? 'var(--v3-shadow-xs)' : 'none',
                  cursor: 'pointer', transition: 'all .1s',
                }}
              >
                {p === 'All' ? 'All Phases' : `Phase ${p}`}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="v3-sub" style={{ marginBottom: 16 }}>
          Showing {filtered.length} of {agents.length} agents
        </div>

        {/* 3-column agent grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filtered.map(agent => {
            const color = catColors[agent.category] || '#6366F1';
            const CatIcon = catIcons[agent.category] || IconBot;

            return (
              <div
                key={agent.id}
                className="v3-card v3-card-hover"
                style={{ padding: 20, cursor: 'pointer' }}
                onClick={() => router.push(`/v3/agents/run?agent=${agent.id}`)}
              >
                {/* Header: icon + name */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    background: color + '14',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CatIcon size={20} color={color}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 650, fontSize: 14, color: 'var(--v3-text)', marginBottom: 6 }}>
                      {agent.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span
                        className="v3-badge"
                        style={{ background: color + '14', color }}
                      >
                        {agent.category}
                      </span>
                      <span className="v3-badge v3-badge-gray">
                        Phase {agent.phase}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div style={{
                  fontSize: 12.5, lineHeight: 1.55, color: 'var(--v3-text-2)',
                  marginBottom: 14,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {agent.desc}
                </div>

                {/* Footer: run count + action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 12, color: 'var(--v3-text-3)' }}>
                    <IconPlay size={11} color="var(--v3-text-3)"/> {agent.uses.toLocaleString()} runs
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 12, fontWeight: 550, color: 'var(--v3-accent)',
                  }}>
                    Run Agent
                    <IconPlay size={12} color="var(--v3-accent)"/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px', color: 'var(--v3-text-3)',
          }}>
            <IconBot size={40} color="var(--v3-text-4)"/>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 12, color: 'var(--v3-text-2)' }}>
              No agents match your filters
            </div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Try adjusting your search or filter criteria
            </div>
          </div>
        )}
      </div>
    </>
  );
}
