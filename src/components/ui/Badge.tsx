import React from 'react';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'violet' | 'neutral';

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantMap: Record<Variant, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger:  'badge-danger',
  info:    'badge-info',
  brand:   'badge-brand',
  violet:  'badge-violet',
  neutral: 'badge-neutral',
};

const dotColors: Record<Variant, string> = {
  success: '#10B981',
  warning: '#F59E0B',
  danger:  '#EF4444',
  info:    '#3B82F6',
  brand:   '#2968B0',
  violet:  '#6D28D9',
  neutral: '#94A3B8',
};

export function Badge({ variant = 'neutral', children, dot, className = '' }: BadgeProps) {
  return (
    <span className={`badge ${variantMap[variant]} ${className}`}>
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: dotColors[variant],
            flexShrink: 0,
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </span>
  );
}
