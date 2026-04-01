'use client';
import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface Props {
  data: number[];
  color?: string;
  height?: number;
}

export function MiniSparkline({ data, color = '#2968B0', height = 28 }: Props) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width={64} height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`sp-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8} fill={`url(#sp-${color.replace('#','')})`} dot={false}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}
