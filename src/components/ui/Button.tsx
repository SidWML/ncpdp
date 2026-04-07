import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-primary',
};

const sizeStyle: Record<Size, React.CSSProperties> = {
  sm: { fontSize: 12, padding: '4px 8px' },
  md: {},
  lg: { fontSize: 14, padding: '8px 16px' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading,
  children,
  style,
  ...props
}: ButtonProps) {
  const cls = variant === 'danger'
    ? 'btn-primary'
    : variantClass[variant];

  const dangerStyle: React.CSSProperties =
    variant === 'danger' ? { background: '#DC2626' } : {};

  return (
    <button
      className={cls}
      style={{ ...sizeStyle[size], ...dangerStyle, ...style }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
