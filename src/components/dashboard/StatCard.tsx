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

const colorMap: Record<Color, { grad: string; spark: string; iconBg: string }> = {
  brand:   { grad: 'linear-gradient(135deg,#4F46E5,#8B5CF6)', spark: '#818CF8', iconBg: 'rgba(79,70,229,.1)'  },
  success: { grad: 'linear-gradient(135deg,#10B981,#06B6D4)', spark: '#34D399', iconBg: 'rgba(16,185,129,.1)' },
  warning: { grad: 'linear-gradient(135deg,#F59E0B,#EF4444)', spark: '#FCD34D', iconBg: 'rgba(245,158,11,.1)' },
  violet:  { grad: 'linear-gradient(135deg,#8B5CF6,#EC4899)', spark: '#C4B5FD', iconBg: 'rgba(139,92,246,.1)' },
  teal:    { grad: 'linear-gradient(135deg,#06B6D4,#3B82F6)', spark: '#67E8F9', iconBg: 'rgba(6,182,212,.1)'  },
};

const iconColors: Record<Color, string> = {
  brand: '#4F46E5', success: '#10B981', warning: '#F59E0B', violet: '#8B5CF6', teal: '#06B6D4',
};

export function StatCard({
  label, value, delta, deltaDir = 'up', deltaPeriod, icon, color = 'brand', sparkData,
}: StatCardProps) {
  const c = colorMap[color];
  const ic = iconColors[color];
  const isUp = deltaDir === 'up';
  const defaultSpark = [40,52,45,60,55,68,62,72,70,78];

  return (
    <div className="card" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: c.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: ic,
        }}>
          {icon}
        </div>
        <MiniSparkline data={sparkData || defaultSpark} color={c.spark} height={26}/>
      </div>

      <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-.6px', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, fontWeight: 500 }}>
        {label}
      </div>

      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            fontSize: 11,
            fontWeight: 700,
            color: isUp ? '#059669' : '#DC2626',
            background: isUp ? '#ECFDF5' : '#FEF2F2',
            border: `1px solid ${isUp ? '#A7F3D0' : '#FECACA'}`,
            padding: '2px 6px',
            borderRadius: 6,
          }}>
            {isUp ? <IconTrendUp size={10} color="#059669"/> : <IconTrendDown size={10} color="#DC2626"/>}
            {delta}
          </span>
          {deltaPeriod && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{deltaPeriod}</span>}
        </div>
      )}
    </div>
  );
}
