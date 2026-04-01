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

const colorMap: Record<Color, { spark: string; iconBg: string; iconColor: string }> = {
  brand:   { spark: '#5B9BD5', iconBg: 'rgba(41,104,176,.08)',  iconColor: '#2968B0' },
  success: { spark: '#34D399', iconBg: 'rgba(5,150,105,.08)',   iconColor: '#059669' },
  warning: { spark: '#FBBF24', iconBg: 'rgba(217,119,6,.08)',   iconColor: '#D97706' },
  violet:  { spark: '#A78BFA', iconBg: 'rgba(109,40,217,.08)',  iconColor: '#6D28D9' },
  teal:    { spark: '#2DD4BF', iconBg: 'rgba(13,148,136,.08)',  iconColor: '#0D9488' },
};

export function StatCard({
  label, value, delta, deltaDir = 'up', deltaPeriod, icon, color = 'brand', sparkData,
}: StatCardProps) {
  const c = colorMap[color];
  const isUp = deltaDir === 'up';
  const defaultSpark = [40,52,45,60,55,68,62,72,70,78];

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: c.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: c.iconColor,
        }}>
          {icon}
        </div>
        <MiniSparkline data={sparkData || defaultSpark} color={c.spark} height={28}/>
      </div>

      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-.5px', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontWeight: 400 }}>
        {label}
      </div>

      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            fontSize: 12,
            fontWeight: 500,
            color: isUp ? '#059669' : '#DC2626',
            background: isUp ? '#ECFDF5' : '#FEF2F2',
            padding: '2px 8px',
            borderRadius: 4,
          }}>
            {isUp ? <IconTrendUp size={11} color="#059669"/> : <IconTrendDown size={11} color="#DC2626"/>}
            {delta}
          </span>
          {deltaPeriod && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{deltaPeriod}</span>}
        </div>
      )}
    </div>
  );
}
