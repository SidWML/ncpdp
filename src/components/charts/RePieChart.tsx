'use client';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Segment { label: string; value: number; color: string; pct: number; }

interface Props {
  segments: Segment[];
  size?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
  centerSub?: string;
}

interface TipEntry { name?: string; value?: number; payload?: { color?: string; pct?: number }; }
interface TipProps { active?: boolean; payload?: TipEntry[]; }

function CustomTooltip({ active, payload }: TipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div style={{ background: '#fff', border: '1px solid #E8ECF4', borderRadius: 10, padding: '8px 12px', boxShadow: '0 4px 12px rgba(15,23,42,.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.payload?.color, display: 'inline-block' }}/>
        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{p.name}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
        {p.value?.toLocaleString()} <span style={{ fontSize: 11, color: '#94A3B8' }}>({p.payload?.pct}%)</span>
      </div>
    </div>
  );
}

export function RePieChart({ segments, innerRadius = 52, outerRadius = 72, centerLabel, centerSub }: Props) {
  const data = segments.map(s => ({ name: s.label, value: s.value, color: s.color, pct: s.pct }));
  const size = (outerRadius + 10) * 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color}/>
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />}/>
          </PieChart>
        </ResponsiveContainer>
        {(centerLabel || centerSub) && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            {centerLabel && <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{centerLabel}</span>}
            {centerSub && <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>{centerSub}</span>}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }}/>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#374151' }}>{s.label}</span>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>{s.value.toLocaleString()} · {s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
