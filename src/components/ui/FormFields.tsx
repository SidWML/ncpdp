'use client';
import React, { useState } from 'react';

/* ─── Shared styles ──────────────────────────────────────────────── */
const fieldInput: React.CSSProperties = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: 6,
  border: '1px solid #CBD5E1',
  fontSize: 12.5,
  color: '#1E293B',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
};

/* ─── FieldLabel ─────────────────────────────────────────────────── */
interface FieldLabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export function FieldLabel({ children, required }: FieldLabelProps) {
  return (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
      {children}
      {required && <span style={{ color: '#DC2626', marginLeft: 2 }}>*</span>}
    </label>
  );
}

/* ─── TextInput ──────────────────────────────────────────────────── */
interface TextInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  type?: string;
}

export function TextInput({ placeholder, value, onChange, onKeyDown, style, type = 'text' }: TextInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      style={{ ...fieldInput, ...style }}
    />
  );
}

/* ─── Select ─────────────────────────────────────────────────────── */
interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  style?: React.CSSProperties;
}

export function Select({ children, value, onChange, style }: SelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{ ...fieldInput, appearance: 'auto', ...style }}
    >
      {children}
    </select>
  );
}

/* ─── MultiSelect (checkbox list) ────────────────────────────────── */
interface MultiSelectProps {
  options: string[];
  height?: number;
  value?: string[];
  onChange?: (selected: string[]) => void;
}

export function MultiSelect({ options, height = 96, value, onChange }: MultiSelectProps) {
  const [internal, setInternal] = useState<string[]>([]);
  const selected = value ?? internal;
  const setSelected = onChange ?? setInternal;

  function toggle(o: string) {
    setSelected(selected.includes(o) ? selected.filter(x => x !== o) : [...selected, o]);
  }

  return (
    <div style={{
      height, overflowY: 'auto', border: '1px solid #CBD5E1', borderRadius: 6,
      background: '#fff', padding: '2px 0',
    }}>
      {options.map(o => {
        const active = selected.includes(o);
        return (
          <label
            key={o}
            onClick={() => toggle(o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px',
              fontSize: 12, color: active ? 'var(--text-primary)' : '#475569', cursor: 'pointer',
              background: active ? '#F0F7FF' : 'transparent',
              fontWeight: active ? 600 : 400,
              transition: 'background .1s',
            }}
          >
            <div style={{
              width: 15, height: 15, borderRadius: 3, flexShrink: 0,
              border: active ? '1.5px solid #2968B0' : '1.5px solid #CBD5E1',
              background: active ? '#2968B0' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {active && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            {o}
          </label>
        );
      })}
    </div>
  );
}

/* ─── DateRange ──────────────────────────────────────────────────── */
interface DateRangeProps {
  label: string;
  required?: boolean;
  fromValue?: string;
  toValue?: string;
  onFromChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DateRange({ label, required, fromValue, toValue, onFromChange, onToChange }: DateRangeProps) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div style={{ display: 'flex', gap: 6 }}>
        <input type="text" placeholder="From" value={fromValue} onChange={onFromChange} style={fieldInput}/>
        <input type="text" placeholder="To" value={toValue} onChange={onToChange} style={fieldInput}/>
      </div>
    </div>
  );
}

/* ─── SectionTitle (form section header) ─────────────────────────── */
interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: '#94A3B8',
      textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

/* ─── Accordion (collapsible filter section) ────────────────────── */
interface AccordionProps {
  title: string;
  /** Number of active filters in this section — shown as a badge */
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Accordion({ title, count, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{
      border: '1px solid #E8ECF2',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 10,
      background: '#fff',
      transition: 'box-shadow .15s',
      boxShadow: open ? '0 1px 4px rgba(15,23,42,.04)' : 'none',
    }}>
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '11px 16px',
          border: 'none',
          cursor: 'pointer',
          background: open ? '#FAFBFC' : '#fff',
          transition: 'background .12s',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = '#FAFBFC'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = '#fff'; }}
      >
        {/* Chevron */}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{
            transition: 'transform .2s ease',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        >
          <polyline points="9 18 15 12 9 6"/>
        </svg>

        {/* Title */}
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: open ? '#1E293B' : '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '.04em',
          flex: 1,
          textAlign: 'left',
        }}>
          {title}
        </span>

        {/* Count badge */}
        {count !== undefined && count > 0 && (
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#2968B0',
            background: '#F0F7FF',
            border: '1px solid #DFEEFF',
            padding: '1px 7px',
            borderRadius: 10,
            lineHeight: '16px',
          }}>
            {count}
          </span>
        )}
      </button>

      {/* Body — collapsible */}
      <div style={{
        maxHeight: open ? 600 : 0,
        opacity: open ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height .25s ease, opacity .2s ease, padding .25s ease',
        padding: open ? '4px 16px 16px' : '0 16px',
      }}>
        {children}
      </div>
    </div>
  );
}
