'use client';
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint { label: string; value: number; }

interface Props {
  data: DataPoint[];
  color?: string;
  height?: number;
  valueFormatter?: (v: number) => string;
  yDomain?: [number | 'auto', number | 'auto'];
}

interface TipProps { active?: boolean; payload?: { value?: number }[]; label?: string; }

function CustomTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #E8ECF4', borderRadius: 10, padding: '8px 12px', boxShadow: '0 4px 12px rgba(15,23,42,.08)' }}>
      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{payload[0].value?.toLocaleString()}</div>
    </div>
  );
}

export function ReAreaChart({ data, color = '#4F46E5', height = 140, valueFormatter, yDomain }: Props) {
  const chartData = data.map(d => ({ name: d.label, value: d.value }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`ag-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.15}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="0" stroke="#F1F5F9" vertical={false}/>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#94A3B8' }}
          tickLine={false}
          axisLine={false}
          domain={yDomain}
          tickFormatter={valueFormatter || ((v: number) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v))}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}/>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#ag-${color.replace('#','')})`}
          dot={false}
          activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: '#fff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
