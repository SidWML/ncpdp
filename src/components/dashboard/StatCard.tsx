import React from 'react';
import { MiniSparkline } from '@/components/charts/MiniSparkline';
import { IconTrendUp, IconTrendDown } from '@/components/ui/Icons';

type Color = 'brand' | 'success' | 'warning' | 'violet' | 'teal';

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaDir?: 'up' | 'down';
  deltaPeriod?: string;
  icon: React.ReactNode;
  color?: Color;
  sparkData?: number[];
}

const colorMap: Record<Color, { spark: string; iconColor: string }> = {
  brand:   { spark: '#2D8AB5', iconColor: '#005C8D' },
  success: { spark: '#A6DFB8', iconColor: '#449055' },
  warning: { spark: '#FBBF24', iconColor: '#D97706' },
  violet:  { spark: '#76C799', iconColor: '#004870' },
  teal:    { spark: '#2DD4BF', iconColor: '#0D9488' },
};

export function StatCard({
  label, value, delta, deltaDir = 'up', deltaPeriod, icon, color = 'brand', sparkData,
}: StatCardProps) {
  const c = colorMap[color];
  const isUp = deltaDir === 'up';
  const defaultSpark = [40,52,45,60,55,68,62,72,70,78];

  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'var(--surface-3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: c.iconColor,
        }}>
          {icon}
        </div>
        <MiniSparkline data={sparkData || defaultSpark} color={c.spark} height={24}/>
      </div>

      <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-.4px', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
        {label}
      </div>

      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            fontSize: 12,
            fontWeight: 500,
            color: isUp ? '#449055' : '#B91C1C',
          }}>
            {isUp ? <IconTrendUp size={11} color="#449055"/> : <IconTrendDown size={11} color="#B91C1C"/>}
            {delta}
          </span>
          {deltaPeriod && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{deltaPeriod}</span>}
        </div>
      )}
    </div>
  );
}
