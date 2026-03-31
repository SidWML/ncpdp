'use client';
import React from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  fillOpacity?: number;
  showDots?: boolean;
  showLabels?: boolean;
}

export function LineChart({
  data,
  height = 100,
  color = '#4F46E5',
  fillOpacity = 0.12,
  showDots = true,
  showLabels = true,
}: LineChartProps) {
  const W = 400;
  const H = height;
  const pad = { top: 10, bottom: showLabels ? 20 : 4, left: 4, right: 4 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const vals = data.map(d => d.value);
  const min = Math.min(...vals) * 0.98;
  const max = Math.max(...vals) * 1.01;

  const pts = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * innerW,
    y: pad.top + innerH - ((d.value - min) / (max - min)) * innerH,
    label: d.label,
    value: d.value,
  }));

  // Build smooth path using cubic bezier
  const path = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${acc} C ${cpx} ${prev.y}, ${cpx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${path} L ${pts[pts.length - 1].x} ${H - pad.bottom} L ${pts[0].x} ${H - pad.bottom} Z`;

  const gradId = `lg-${color.replace('#', '')}`;

  return (
    <div style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots &&
          pts.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={i === pts.length - 1 ? 4 : 3}
              fill={i === pts.length - 1 ? color : '#fff'}
              stroke={color}
              strokeWidth={2}
            />
          ))}

        {/* Labels */}
        {showLabels &&
          pts.map((pt, i) => (
            <text
              key={i}
              x={pt.x}
              y={H - 4}
              textAnchor="middle"
              fontSize={9}
              fill="var(--text-muted)"
              fontWeight="600"
            >
              {pt.label}
            </text>
          ))}
      </svg>
    </div>
  );
}
