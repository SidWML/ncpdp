'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FieldLabel, TextInput, Select } from '@/components/ui/FormFields';
import { IconSearch, IconRefresh, IconDownload, IconSparkles } from '@/components/ui/Icons';
import { AgentChat } from '@/components/ui/AgentChat';
import { US_STATES } from '@/lib/filter-options';

/* ─── CHOW data (matches legacy screenshot) ─────────────────────── */
const CHOW_RESULTS = [
  { oldNcpdp: '4443076', oldName: 'Minnis Down Home Pharmacy',     oldClose: '02/01/2026', newNcpdp: '4443076', newName: 'Down Home Pharmacy',            newOpen: '02/02/2026' },
  { oldNcpdp: '5832818', oldName: '101 RX PHARMACY INC',           oldClose: '03/31/2024', newNcpdp: '5832818', newName: '101 rx pharmacy inc',           newOpen: '04/01/2024' },
  { oldNcpdp: '5832818', oldName: '101 RX PHARMACY INC',           oldClose: '03/31/2021', newNcpdp: '5832818', newName: '101 RX PHARMACY INC',           newOpen: '04/01/2021' },
  { oldNcpdp: '5817056', oldName: '103 PHARMACY INC',              oldClose: '09/15/2021', newNcpdp: '5833606', newName: '103 pharmacy',                  newOpen: '09/16/2021' },
  { oldNcpdp: '1436826', oldName: '111TH PHARMA CARE CORP',        oldClose: '08/20/2013', newNcpdp: '1436826', newName: '111th Pharma Family',           newOpen: '08/21/2013' },
  { oldNcpdp: '3343934', oldName: '12 CORNERS APOTHECARY',         oldClose: '08/05/2015', newNcpdp: '3343934', newName: 'Pine Pharmacey at Twelve Corners LLC', newOpen: '08/06/2015' },
  { oldNcpdp: '5665394', oldName: '12422 Central Pharmacy',        oldClose: '08/31/2022', newNcpdp: '5665394', newName: 'Illuminate Health Inc',         newOpen: '09/01/2022' },
  { oldNcpdp: '5832488', oldName: '14th street pharmacy',          oldClose: '01/09/2022', newNcpdp: '5832488', newName: '14th ST PHARMACY',              newOpen: '01/10/2022' },
  { oldNcpdp: '1178070', oldName: '15 MIN RX',                     oldClose: '11/30/2023', newNcpdp: '1178070', newName: 'OMEGA PHARMACY',                newOpen: '12/01/2023' },
  { oldNcpdp: '1178082', oldName: '15 MIN RX',                     oldClose: '12/25/2023', newNcpdp: '1179971', newName: 'OMEGA PHARMACY',                newOpen: '12/26/2023' },
  { oldNcpdp: '2918374', oldName: 'AAA PHARMACY',                  oldClose: '06/15/2024', newNcpdp: '2918374', newName: 'AAA Health Solutions',          newOpen: '06/16/2024' },
  { oldNcpdp: '3847291', oldName: 'ACME DRUGSTORE #12',            oldClose: '04/10/2025', newNcpdp: '3847291', newName: 'Rite Aid Corporation',          newOpen: '04/11/2025' },
];

type QueueTab = 'processed' | 'unprocessed';
type SearchMode = 'old' | 'new';

export default function ChowPage() {
  const [queue, setQueue]         = useState<QueueTab>('processed');
  const [searchMode, setSearchMode] = useState<SearchMode>('old');
  const [searched, setSearched]   = useState(true); // show results by default
  const [page, setPage]           = useState(0);
  const [agentOpen, setAgentOpen] = useState(false);
  const perPage = 10;

  const total = CHOW_RESULTS.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const visible = CHOW_RESULTS.slice(page * perPage, page * perPage + perPage);

  return (
    <>
      <Topbar
        title="CHOW Tracker"
        subtitle="Change of Ownership — Track pharmacy ownership transfers"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" onClick={() => setAgentOpen(o => !o)} style={{ fontSize: 12, gap: 5 }}>
              <IconSparkles size={14}/> {agentOpen ? 'Hide' : 'Ask'} Agent
            </button>
            <button className="btn-secondary" style={{ fontSize: 12, gap: 5 }}>
              <IconDownload size={13}/> Export
            </button>
          </div>
        }
      />
      <main style={{ padding: '0 20px 40px' }}>

        {/* Horizontal tabs — Processed / Unprocessed */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', background: '#fff', marginBottom: 16 }}>
          {([['processed', 'Processed', '15,086'], ['unprocessed', 'Unprocessed', '247']] as const).map(([key, label, count]) => (
            <button key={key} onClick={() => setQueue(key)} style={{
              padding: '12px 20px', fontSize: 13, fontWeight: queue === key ? 700 : 500,
              color: queue === key ? '#1B2B6B' : '#6B7280',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: queue === key ? '2px solid #4F46E5' : '2px solid transparent',
              marginBottom: -2, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {label}
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 9999,
                background: queue === key ? '#EEF2FF' : '#F3F4F6',
                color: queue === key ? '#4F46E5' : '#9CA3AF',
              }}>{count}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Header */}
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1B2B6B', marginBottom: 4 }}>
            Ownership Changed Pharmacies
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>
            {queue === 'processed' ? '15,086 processed records' : '247 unprocessed records'}
          </div>

          {/* Search form */}
          <Card style={{ marginBottom: 16 }}>
            <CardBody style={{ padding: '18px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><FieldLabel>NCPDP ID</FieldLabel><TextInput placeholder="NCPDP ID"/></div>
                <div><FieldLabel>DBA Name</FieldLabel><TextInput placeholder="DBA Name"/></div>
                <div>
                  <FieldLabel>State</FieldLabel>
                  <Select>
                    <option>--Select--</option>
                    {US_STATES.map(s => <option key={s}>{s}</option>)}
                  </Select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div><FieldLabel>NPI Number</FieldLabel><TextInput placeholder="NPI"/></div>
                <div><FieldLabel>Pharmacy Key</FieldLabel><TextInput placeholder="Pharmacy Key"/></div>
                <div/>
              </div>

              {/* Old / New pharmacy toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                {(['old', 'new'] as const).map(mode => (
                  <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      border: searchMode === mode ? '2px solid #4F46E5' : '2px solid #CBD5E1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {searchMode === mode && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F46E5' }}/>}
                    </div>
                    <span style={{ fontWeight: searchMode === mode ? 700 : 500, color: searchMode === mode ? '#1B2B6B' : '#64748B' }}
                      onClick={() => setSearchMode(mode)}>
                      {mode === 'old' ? 'Old Pharmacy' : 'New Pharmacy'}
                    </span>
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <button className="btn-primary" onClick={() => { setSearched(true); setPage(0); }} style={{ gap: 6, fontSize: 13, padding: '7px 24px' }}>
                  <IconSearch size={14} color="#fff"/> Search
                </button>
                <button className="btn-secondary" style={{ gap: 6, fontSize: 13, padding: '7px 20px' }}>
                  <IconRefresh size={14}/> Reset
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Results table — Old -> New pharmacy mapping */}
          <div style={{ borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden', background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Old Pharmacy NCPDPNo','Old Pharmacy Name','Old Store CloseDate','New Pharmacy NCPDPNo','New Pharmacy Name','New Store OpenDate'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((r, i) => (
                  <tr key={`${r.oldNcpdp}-${r.oldClose}-${i}`}>
                    <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#6B7280' }}>{r.oldNcpdp}</td>
                    <td><span style={{ color: '#4F46E5', fontWeight: 500, cursor: 'pointer' }}>{r.oldName}</span></td>
                    <td style={{ color: '#9CA3AF' }}>{r.oldClose}</td>
                    <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#6B7280' }}>{r.newNcpdp}</td>
                    <td><span style={{ color: '#4F46E5', fontWeight: 500, cursor: 'pointer' }}>{r.newName}</span></td>
                    <td style={{ color: '#9CA3AF' }}>{r.newOpen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          {/* Pagination */}
          <div style={{

            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 16px', borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#94A3B8',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: 'none', color: page === 0 ? '#CBD5E1' : '#64748B', fontSize: 12, cursor: page === 0 ? 'default' : 'pointer', fontWeight: 500 }}>
                Previous
              </button>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, background: '#4F46E5', color: '#fff', cursor: 'pointer' }}>{page + 1}</button>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: 'none', color: page >= totalPages - 1 ? '#CBD5E1' : '#64748B', fontSize: 12, cursor: page >= totalPages - 1 ? 'default' : 'pointer', fontWeight: 500 }}>
                Next
              </button>
            </div>
            <span>Showing <strong style={{ color: '#334155' }}>{page * perPage + 1}-{Math.min(page * perPage + perPage, total)}</strong> of <strong style={{ color: '#334155' }}>{total.toLocaleString()}</strong> entries</span>
          </div>
          </div>
        </div>

        {agentOpen && (
          <AgentChat
            agentName="CHOW Agent"
            agentId="AGT-09"
            gradient="linear-gradient(135deg,#F59E0B,#EF4444)"
            welcomeMessage="Hi Sarah! I'm your Change of Ownership Agent. I can track pharmacy ownership transfers, identify affected networks, and help you process CHOW records. What would you like to look up?"
            suggestions={[
              'Show all unprocessed CHOW records from 2025',
              'Find ownership changes for NCPDP 5832818',
              'List pharmacies that changed hands 3+ times',
              'Which networks are affected by recent CHOW activity?',
            ]}
          />
        )}
        </div>
      </main>
    </>
  );
}
