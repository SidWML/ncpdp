import React from 'react';

type Severity = 'critical' | 'warning' | 'info';

interface AlertItemProps {
  severity: Severity;
  title: string;
  pharmacy: string;
  location: string;
  time: string;
  networks: number;
  read?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

const cfg = {
  critical: { dot: '#DC2626', bg: 'rgba(220,38,38,.02)', label: 'Critical', badgeBg: '#FEF2F2', badgeColor: '#DC2626' },
  warning:  { dot: '#D97706', bg: 'rgba(217,119,6,.02)',  label: 'Warning',  badgeBg: '#FFFBEB', badgeColor: '#B45309' },
  info:     { dot: '#1474A4', bg: 'transparent',           label: 'Info',     badgeBg: '#E8F3F9', badgeColor: '#1474A4' },
};

export function AlertItem({ severity, title, pharmacy, location, time, networks, read, compact, onClick }: AlertItemProps) {
  const c = cfg[severity];

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: compact ? 'center' : 'flex-start',
        gap: 10,
        padding: compact ? '8px 0' : '10px 0',
        borderBottom: '1px solid var(--border-light)',
        background: !read ? c.bg : 'transparent',
        cursor: 'pointer',
        transition: 'background .1s',
      }}
    >
      <div style={{ flexShrink: 0, paddingTop: compact ? 0 : 2, display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: c.dot,
            display: 'block',
          }}
          className={!read && severity === 'critical' ? 'pulse-dot' : undefined}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{
            fontSize: 13,
            fontWeight: read ? 400 : 500,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{
              fontSize: 12,
              fontWeight: 500,
              color: c.badgeColor,
              background: c.badgeBg,
              padding: '2px 8px',
              borderRadius: 4,
            }}>{c.label}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{time}</span>
          </div>
        </div>
        {!compact && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{pharmacy}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>·</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{location}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>·</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{networks} network{networks !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
