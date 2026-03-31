import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  label?: string;
}

export function Input({ icon, iconRight, label, className = '', style, ...props }: InputProps) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: 6,
            letterSpacing: '.02em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {icon}
          </span>
        )}
        <input
          className={`input-base ${className}`}
          style={{
            paddingLeft: icon ? 34 : undefined,
            paddingRight: iconRight ? 34 : undefined,
            ...style,
          }}
          {...props}
        />
        {iconRight && (
          <span
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            {iconRight}
          </span>
        )}
      </div>
    </div>
  );
}
