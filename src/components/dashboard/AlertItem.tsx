import React from 'react';
import { IconAlertTriangle, IconInfo, IconShieldCheck } from '@/components/ui/Icons';

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
  critical: { dot: '#EF4444', bg: 'rgba(239,68,68,.03)', label: 'Critical', badgeBg: '#FEF2F2', badgeColor: '#DC2626', badgeBorder: '#FECACA', Icon: IconAlertTriangle },
  warning:  { dot: '#F59E0B', bg: 'rgba(245,158,11,.03)', label: 'Warning',  badgeBg: '#FFFBEB', badgeColor: '#B45309', badgeBorder: '#FDE68A', Icon: IconAlertTriangle },
  info:     { dot: '#3B82F6', bg: 'transparent',          label: 'Info',     badgeBg: '#EFF6FF', badgeColor: '#2563EB', badgeBorder: '#BFDBFE', Icon: IconInfo },
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
        padding: compact ? '7px 0' : '10px 0',
        borderBottom: '1px solid var(--border-light)',
        background: !read ? c.bg : 'transparent',
        cursor: 'pointer',
        transition: 'background .1s',
      }}
    >
      {/* Indicator */}
      <div style={{ flexShrink: 0, paddingTop: compact ? 0 : 2, display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: c.dot,
            display: 'block',
            boxShadow: !read && severity === 'critical' ? `0 0 0 3px ${c.dot}22` : 'none',
          }}
          className={!read && severity === 'critical' ? 'pulse-dot' : undefined}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{
            fontSize: 12.5,
            fontWeight: read ? 500 : 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: c.badgeColor,
              background: c.badgeBg,
              border: `1px solid ${c.badgeBorder}`,
              padding: '1px 7px',
              borderRadius: 9999,
            }}>{c.label}</span>
            <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{time}</span>
          </div>
        </div>
        {!compact && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 500 }}>{pharmacy}</span>
            <span style={{ color: 'var(--border)', fontSize: 10 }}>·</span>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{location}</span>
            <span style={{ color: 'var(--border)', fontSize: 10 }}>·</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{networks} network{networks !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
