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

/* ─── DataTable ──────────────────────────────────────────────────── */
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
    <div style={{ borderRadius: 8, border: '1px solid #E5E7EB', overflow: 'hidden', background: '#fff' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
                {hg.headers.map((header, hi) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      padding: '9px 14px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#6B7280',
                      whiteSpace: 'nowrap',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                      borderRight: hi < hg.headers.length - 1 ? '1px solid #E5E7EB' : 'none',
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <svg width="7" height="10" viewBox="0 0 7 10" style={{ flexShrink: 0, opacity: header.column.getIsSorted() ? 1 : 0.3 }}>
                          <path d="M3.5 0L6.5 3.5H0.5L3.5 0Z" fill={header.column.getIsSorted() === 'asc' ? '#4F46E5' : '#9CA3AF'}/>
                          <path d="M3.5 10L0.5 6.5H6.5L3.5 10Z" fill={header.column.getIsSorted() === 'desc' ? '#4F46E5' : '#9CA3AF'}/>
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
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px 20px', color: '#D1D5DB', fontSize: 13 }}>
                  No records to display.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, ri) => (
                <tr
                  key={row.id}
                  style={{
                    background: ri % 2 === 1 ? '#FAFAFA' : '#fff',
                    borderBottom: '1px solid #F3F4F6',
                    transition: 'background .08s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F3F4FF')}
                  onMouseLeave={e => (e.currentTarget.style.background = ri % 2 === 1 ? '#FAFAFA' : '#fff')}
                >
                  {row.getVisibleCells().map((cell, ci) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '8px 14px',
                        fontSize: 13,
                        color: '#374151',
                        borderRight: ci < row.getVisibleCells().length - 1 ? '1px solid #F3F4F6' : 'none',
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

      {/* Pagination */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px', borderTop: '1px solid #E5E7EB', fontSize: 12.5, color: '#9CA3AF',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PgBtn label="Previous" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}/>
          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => (
            <button key={i} onClick={() => table.setPageIndex(i)} style={{
              width: 28, height: 28, borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600,
              background: i === pageIndex ? '#4F46E5' : 'transparent',
              color: i === pageIndex ? '#fff' : '#6B7280',
              cursor: 'pointer',
            }}>{i + 1}</button>
          ))}
          {pageCount > 5 && <span style={{ padding: '0 4px', color: '#D1D5DB' }}>...</span>}
          {pageCount > 5 && (
            <button onClick={() => table.setPageIndex(pageCount - 1)} style={{
              width: 28, height: 28, borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600,
              background: pageIndex === pageCount - 1 ? '#4F46E5' : 'transparent',
              color: pageIndex === pageCount - 1 ? '#fff' : '#6B7280',
              cursor: 'pointer',
            }}>{pageCount}</button>
          )}
          <PgBtn label="Next" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}/>
        </div>
        <span>
          Showing <strong style={{ color: '#374151' }}>{totalRows === 0 ? 0 : from}-{to}</strong> of <strong style={{ color: '#374151' }}>{totalRows.toLocaleString()}</strong> entries
        </span>
      </div>
    </div>
  );
}

function PgBtn({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '4px 10px', borderRadius: 6, border: 'none', background: 'none',
      color: disabled ? '#D1D5DB' : '#6B7280', fontSize: 12.5, fontWeight: 500,
      cursor: disabled ? 'default' : 'pointer',
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
      border: '1px solid #E5E7EB', borderRadius: 8, background: '#FAFAFA',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: '#EEF2FF', border: '1px solid #E0E7FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px',
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#9CA3AF' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: '#D1D5DB', marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

/* ─── Cell renderers ─────────────────────────────────────────────── */
export const CellText = ({ children, bold }: { children: React.ReactNode; bold?: boolean }) => (
  <span style={{ fontWeight: bold ? 500 : 400, color: '#111827' }}>{children}</span>
);
export const CellMono = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: 'ui-monospace, monospace', color: '#4F46E5', fontWeight: 500, fontSize: 12.5 }}>{children}</span>
);
export const CellMuted = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: '#6B7280' }}>{children}</span>
);
export const CellBold = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontWeight: 600, color: '#111827' }}>{children}</span>
);
export const CellStatus = ({ active }: { active: boolean }) => (
  <Badge variant={active ? 'success' : 'neutral'}>{active ? 'Active' : 'Inactive'}</Badge>
);
export const CellViewBtn = ({ onClick }: { onClick?: () => void }) => (
  <button onClick={onClick} style={{
    padding: '2px 8px', borderRadius: 5, border: '1px solid #E5E7EB',
    background: '#fff', color: '#4F46E5', fontSize: 11, fontWeight: 500,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3,
  }}>
    View <IconExternalLink size={9}/>
  </button>
);

/* ─── Re-export column helper type ───────────────────────────────── */
export type { ColumnDef };
