'use client';
import React from 'react';

interface Segment {
  label: string;
  value: number;
  color: string;
  pct: number;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSub?: string;
}

export function DonutChart({
  segments,
  size = 140,
  strokeWidth = 22,
  centerLabel,
  centerSub,
}: DonutChartProps) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* background ring */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg, i) => {
            const dash = (seg.pct / 100) * circumference;
            const gap  = circumference - dash;
            const offset = -(cumulative / 100) * circumference;
            cumulative += seg.pct;
            return (
              <circle
                key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray .5s ease' }}
              />
            );
          })}
        </svg>
        {(centerLabel || centerSub) && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {centerLabel && (
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                {centerLabel}
              </span>
            )}
            {centerSub && (
              <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                {centerSub}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: seg.color,
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {seg.label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {seg.value.toLocaleString()} · {seg.pct}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
