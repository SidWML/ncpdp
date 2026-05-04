import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { IconPlay, IconChevronRight, IconBarChart } from '@/components/ui/Icons';

interface AgentCardProps {
  id: string;
  name: string;
  category: string;
  phase: string;
  priority: string;
  icon: string;
  desc: string;
  uses: number;
  compact?: boolean;
  onClick?: () => void;
}

const phaseColor: Record<string, 'success' | 'brand' | 'neutral'> = {
  '1a': 'success', '1b': 'brand', '1c': 'neutral',
};
const priorityColor: Record<string, 'danger' | 'warning' | 'neutral'> = {
  P0: 'danger', P1: 'warning', P2: 'neutral',
};
const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  'Search & Discovery':      { bg: '#E8F3F9', text: '#005C8D', icon: '#005C8D' },
  'Network Management':      { bg: '#ECFEFF', text: '#0891B2', icon: '#0891B2' },
  'Compliance & Regulatory': { bg: '#FEF2F2', text: '#DC2626', icon: '#DC2626' },
  'Data Delivery':           { bg: '#FFFBEB', text: '#B45309', icon: '#D97706' },
  'Credentialing (resQ)':    { bg: '#ECFDF5', text: '#449055', icon: '#449055' },
  'Analytics & Prediction':  { bg: '#E8F3F9', text: '#1474A4', icon: '#1474A4' },
  'Claims & Routing':        { bg: '#E8F3F9', text: '#004870', icon: '#004870' },
  'NCPDP Internal':          { bg: '#E8F3F9', text: '#004870', icon: '#004870' },
};

function CategoryIcon({ category }: { category: string }) {
  const color = categoryColors[category]?.icon || '#005C8D';
  const icons: Record<string, React.ReactNode> = {
    'Search & Discovery':      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>,
    'Network Management':      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4M12 11l-6.5 6M12 11l6.5 6"/></svg>,
    'Compliance & Regulatory': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
    'Data Delivery':           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
    'Credentialing (resQ)':    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    'Analytics & Prediction':  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    'Claims & Routing':        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    'NCPDP Internal':          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  };
  return <>{icons[category] || <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>}</>;
}

export function AgentCard({ name, category, phase, priority, desc, uses, compact, onClick }: AgentCardProps) {
  const catStyle = categoryColors[category] || categoryColors['Search & Discovery'];

  if (compact) {
    return (
      <div
        className="card card-hover"
        onClick={onClick}
        style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border-light)' }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: catStyle.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <CategoryIcon category={category}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 0 }}>
            <IconBarChart size={9} color="var(--text-muted)"/>
            {uses.toLocaleString()} uses
          </div>
        </div>
        <IconChevronRight size={13} color="var(--text-muted)"/>
      </div>
    );
  }

  return (
    <div
      className="card card-hover"
      onClick={onClick}
      style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: catStyle.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <CategoryIcon category={category}/>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Badge variant={phaseColor[phase]}>Phase {phase}</Badge>
          <Badge variant={priorityColor[priority]}>{priority}</Badge>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{name}</div>
        <span style={{
          fontSize: 12,
          fontWeight: 500,
          color: catStyle.text,
          background: catStyle.bg,
          padding: '2px 8px',
          borderRadius: 4,
          display: 'inline-block',
          marginBottom: 8,
        }}>{category}</span>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{desc}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconBarChart size={11} color="var(--text-muted)"/>
          {uses.toLocaleString()} uses/mo
        </span>
        <button className="btn-primary" style={{ padding: '6px 14px', borderRadius: 6, gap: 5 }}>
          <IconPlay size={11} color="#fff"/>
          Launch
        </button>
      </div>
    </div>
  );
}
