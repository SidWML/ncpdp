import React from 'react';

interface ProgressProps {
  value: number; // 0-100
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function Progress({
  value,
  color = 'var(--brand-600)',
  height = 6,
  showLabel,
  label,
}: ProgressProps) {
  const clamp = Math.min(100, Math.max(0, value));
  return (
    <div>
      {(showLabel || label) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          {label && (
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 400 }}>
              {label}
            </span>
          )}
          {showLabel && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              {clamp}%
            </span>
          )}
        </div>
      )}
      <div
        className="progress-bar"
        style={{ height }}
        role="progressbar"
        aria-valuenow={clamp}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-fill"
          style={{ width: `${clamp}%`, background: color }}
        />
      </div>
    </div>
  );
}
