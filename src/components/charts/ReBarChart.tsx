'use client';
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

interface BarItem { label: string; value: number; color?: string; }

interface Props {
  data: BarItem[];
  height?: number;
  color?: string;
  showValues?: boolean;
}

interface TipProps { active?: boolean; payload?: { value?: number }[]; label?: string; }

function CustomTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #E8ECF4', borderRadius: 10, padding: '8px 12px', boxShadow: '0 4px 12px rgba(15,23,42,.08)' }}>
      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{payload[0].value?.toLocaleString()}</div>
    </div>
  );
}

export function ReBarChart({ data, height = 140, color = '#005C8D' }: Props) {
  const chartData = data.map(d => ({ name: d.label, value: d.value, color: d.color || color }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="0" stroke="#F1F5F9" vertical={false}/>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} tickLine={false} axisLine={false}/>
        <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)}/>
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,92,141,.05)' }}/>
        <Bar dataKey="value" radius={[5, 5, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.9}/>
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
