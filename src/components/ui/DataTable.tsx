'use client';
import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Badge } from './Badge';
import { IconExternalLink } from './Icons';

/* ─── DataTable — Linear/Notion-style ───────────────────────────── */
interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  pageSize?: number;
}

export function DataTable<T>({ columns, data, pageSize = 20 }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalRows = data.length;
  const from = pageIndex * table.getState().pagination.pageSize + 1;
  const to = Math.min(from + table.getState().pagination.pageSize - 1, totalRows);

  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      padding: '7px 16px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <svg width="7" height="10" viewBox="0 0 7 10" style={{ flexShrink: 0, opacity: header.column.getIsSorted() ? 1 : 0.25 }}>
                          <path d="M3.5 0L6.5 3.5H0.5L3.5 0Z" fill={header.column.getIsSorted() === 'asc' ? 'var(--text-primary)' : 'currentColor'}/>
                          <path d="M3.5 10L0.5 6.5H6.5L3.5 10Z" fill={header.column.getIsSorted() === 'desc' ? 'var(--text-primary)' : 'currentColor'}/>
                        </svg>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
                  No records to display.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, ri) => (
                <tr
                  key={row.id}
                  style={{
                    background: ri % 2 === 1 ? 'var(--surface-2)' : 'transparent',
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background .06s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--brand-50)')}
                  onMouseLeave={e => (e.currentTarget.style.background = ri % 2 === 1 ? 'var(--surface-2)' : '')}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '8px 16px',
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination — minimal */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', borderTop: '1px solid var(--border-light)', fontSize: 13, color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PgBtn label="← Prev" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}/>
          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => (
            <button key={i} onClick={() => table.setPageIndex(i)} style={{
              width: 28, height: 28, borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 500,
              background: i === pageIndex ? 'var(--surface-3)' : 'transparent',
              color: i === pageIndex ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}>{i + 1}</button>
          ))}
          {pageCount > 5 && <span style={{ padding: '0 4px', color: 'var(--text-muted)' }}>…</span>}
          {pageCount > 5 && (
            <button onClick={() => table.setPageIndex(pageCount - 1)} style={{
              width: 28, height: 28, borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 500,
              background: pageIndex === pageCount - 1 ? 'var(--surface-3)' : 'transparent',
              color: pageIndex === pageCount - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}>{pageCount}</button>
          )}
          <PgBtn label="Next →" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}/>
        </div>
        <span style={{ fontSize: 12 }}>
          {totalRows === 0 ? 0 : from}–{to} of {totalRows.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function PgBtn({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '4px 8px', borderRadius: 6, border: 'none', background: 'none',
      color: disabled ? 'var(--border)' : 'var(--text-muted)', fontSize: 13, fontWeight: 500,
      cursor: disabled ? 'default' : 'pointer', transition: 'color .1s',
    }}>{label}</button>
  );
}

/* ─── EmptyState ─────────────────────────────────────────────────── */
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div style={{
      textAlign: 'center', padding: '56px 20px',
      borderRadius: 10, background: 'var(--surface-2)',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: 'var(--surface-3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px',
        color: 'var(--text-muted)',
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, opacity: .7 }}>{subtitle}</div>}
    </div>
  );
}

/* ─── Cell renderers ─────────────────────────────────────────────── */
export const CellText = ({ children, bold }: { children: React.ReactNode; bold?: boolean }) => (
  <span style={{ fontWeight: bold ? 500 : 400, color: 'var(--text-primary)' }}>{children}</span>
);
export const CellMono = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', color: 'var(--text-secondary)', fontWeight: 500, fontSize: 12 }}>{children}</span>
);
export const CellMuted = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: 'var(--text-muted)' }}>{children}</span>
);
export const CellBold = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{children}</span>
);
export const CellStatus = ({ active }: { active: boolean }) => (
  <Badge variant={active ? 'success' : 'neutral'}>{active ? 'Active' : 'Inactive'}</Badge>
);
export const CellViewBtn = ({ onClick }: { onClick?: () => void }) => (
  <button onClick={onClick} style={{
    padding: '3px 8px', borderRadius: 5, border: 'none',
    background: 'var(--surface-3)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
    transition: 'background .1s',
  }}>
    View <IconExternalLink size={10}/>
  </button>
);

/* ─── Re-export column helper type ───────────────────────────────── */
export type { ColumnDef };
