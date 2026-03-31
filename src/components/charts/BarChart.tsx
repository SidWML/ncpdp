'use client';
import React from 'react';

interface BarItem {
  label: string;
  value: number;
  pct: number;
  color?: string;
}

interface BarChartProps {
  data: BarItem[];
  height?: number;
  color?: string;
  showValues?: boolean;
}

export function BarChart({ data, height = 120, color = 'var(--brand-600)', showValues = true }: BarChartProps) {
  const max = Math.max(...data.map(d => d.pct));
  const barW = 100 / data.length;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${data.length * 40} ${height}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        {data.map((item, i) => {
          const barH = (item.pct / max) * (height - 20);
          const x = i * 40 + 4;
          const y = height - barH - 2;
          const c = item.color || color;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={32}
                height={barH}
                rx={4}
                fill={c}
                opacity={0.85}
                style={{ transition: 'height .4s ease, y .4s ease' }}
              />
              {showValues && (
                <text
                  x={x + 16}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize={8}
                  fill="var(--text-muted)"
                  fontWeight="600"
                >
                  {item.value.toLocaleString()}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {data.map((item, i) => (
          <div
            key={i}
            style={{
              width: `${barW}%`,
              textAlign: 'center',
              fontSize: 10,
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
