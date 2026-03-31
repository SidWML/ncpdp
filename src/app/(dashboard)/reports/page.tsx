'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import {
  IconSparkles, IconSend, IconDownload, IconRefresh, IconCheck,
  IconSearch, IconChevronDown, IconFilter,
} from '@/components/ui/Icons';
import { FieldLabel, TextInput, Select, MultiSelect, DateRange } from '@/components/ui/FormFields';
import { EmptyState } from '@/components/ui/DataTable';
import {
  DISPENSER_CLASSES, PROVIDER_TYPES, RELATIONSHIPS, SERVICES,
  SEARCH_BY_OPTIONS, ORDER_BY_OPTIONS, LANGUAGES, PARENT_ORGS,
} from '@/lib/filter-options';

/* ─── Types ──────────────────────────────────────────────────────── */
type MainTab = 'ondemand' | 'ai';
type Role = 'bot' | 'user';
interface Message { id: number; role: Role; text: string; }

/* ─── OnDemand result data ───────────────────────────────────────── */
const ONDEMAND_RESULTS = [
  { ncpdp: '1234567', name: 'CareRx Pharmacy #0842',       relType: 'Member',  city: 'Los Angeles',   state: 'CA', dispClass: 'Chain Pharmacy',      openDate: '2018-03-12', status: 'Active'   },
  { ncpdp: '2345678', name: 'SpecialtyRx Partners LLC',     relType: 'Member',  city: 'Houston',       state: 'TX', dispClass: 'Specialty Pharmacy',  openDate: '2019-07-24', status: 'Active'   },
  { ncpdp: '3456789', name: 'MediCare Express Pharmacy',    relType: 'Member',  city: 'Phoenix',       state: 'AZ', dispClass: 'Independent Pharmacy',openDate: '2020-01-09', status: 'Active'   },
  { ncpdp: '4567890', name: 'Coastal Health Pharmacy',      relType: 'Member',  city: 'Miami',         state: 'FL', dispClass: 'Compounding Pharmacy',openDate: '2017-11-03', status: 'Active'   },
  { ncpdp: '5678901', name: 'Alpine Specialty Dispensary',  relType: 'Member',  city: 'Denver',        state: 'CO', dispClass: 'Specialty Pharmacy',  openDate: '2021-06-18', status: 'Inactive' },
  { ncpdp: '6789012', name: 'Midwest Chain Pharmacy #44',   relType: 'Member',  city: 'Chicago',       state: 'IL', dispClass: 'Chain Pharmacy',      openDate: '2016-04-22', status: 'Active'   },
  { ncpdp: '7890123', name: 'SunHealth Compounding Center', relType: 'Member',  city: 'Orlando',       state: 'FL', dispClass: 'Compounding Pharmacy',openDate: '2019-09-14', status: 'Active'   },
  { ncpdp: '8901234', name: 'Pacific Infusion Services',    relType: 'Member',  city: 'Seattle',       state: 'WA', dispClass: 'Mail Service Pharmacy',openDate: '2020-02-28', status: 'Active'   },
  { ncpdp: '9012345', name: 'Capital Area Pharmacy Group',  relType: 'Member',  city: 'Washington',    state: 'DC', dispClass: 'Independent Pharmacy',openDate: '2015-08-30', status: 'Active'   },
  { ncpdp: '0123456', name: 'Northeast Specialty Rx',       relType: 'Member',  city: 'Boston',        state: 'MA', dispClass: 'Specialty Pharmacy',  openDate: '2018-12-11', status: 'Inactive' },
  { ncpdp: '1234568', name: 'Valley Pharmacy Solutions',    relType: 'Network', city: 'Nashville',     state: 'TN', dispClass: 'Independent Pharmacy',openDate: '2022-03-05', status: 'Active'   },
  { ncpdp: '2345679', name: 'Lone Star Rx Network',         relType: 'Network', city: 'Dallas',        state: 'TX', dispClass: 'Chain Pharmacy',      openDate: '2017-06-19', status: 'Active'   },
  { ncpdp: '3456790', name: 'Golden Gate Pharmacy',         relType: 'Network', city: 'San Francisco', state: 'CA', dispClass: 'Independent Pharmacy',openDate: '2021-10-07', status: 'Active'   },
  { ncpdp: '4567891', name: 'Desert Sun Dispensary',        relType: 'Member',  city: 'Tucson',        state: 'AZ', dispClass: 'Independent Pharmacy',openDate: '2020-05-22', status: 'Active'   },
  { ncpdp: '5678902', name: 'Great Lakes Clinical Pharmacy',relType: 'Member',  city: 'Detroit',       state: 'MI', dispClass: 'Chain Pharmacy',      openDate: '2019-01-16', status: 'Active'   },
];

/* filter options imported from @/lib/filter-options */

/* ─── AI chat data ───────────────────────────────────────────────── */
const INITIAL_MSGS: Message[] = [
  { id: 1, role: 'bot',  text: "Hello Sarah! I'm AGT-25, your AI Report Builder. Describe the report you need and I'll build it instantly — any combination of pharmacy data, credentials, compliance status, or network metrics." },
  { id: 2, role: 'user', text: 'Generate a Q1 2026 credential expiry report for all pharmacies in my network, grouped by state, showing DEA, license, and accreditation status' },
  { id: 3, role: 'bot',  text: 'Report generated: Q1 2026 Credential Expiry Report\n\n68,247 pharmacies analyzed across 50 states. 234 credentials expiring identified. Report loaded in the preview panel.' },
];
const BOT_REPLY = 'Done! Report updated with your changes. The preview panel has been refreshed.';
const SUGGESTIONS = ['Q1 credential expiry report by state','FWA attestation status for Medicare Part D','Network adequacy gaps by region'];
const RECENT_REPORTS = [
  { name: 'Q1 Credential Expiry Report', date: 'Today',  format: 'PDF' },
  { name: 'Weekly Network Changes',      date: 'Mar 21', format: 'PDF' },
  { name: 'FWA Attestation Status',      date: 'Mar 15', format: 'PDF' },
];

/* Form components imported from @/components/ui/FormFields */

/* ─── Main page ──────────────────────────────────────────────────── */
export default function ReportsPage() {
  const [mainTab, setMainTab] = useState<MainTab>('ondemand');

  /* OnDemand state */
  const [reporting, setReporting] = useState(false);
  const [reported,  setReported]  = useState(false);
  const [orderBy, setOrderBy]     = useState('Pharmacy NCPDP No');
  const [statusFilter, setStatusFilter] = useState('Active NCPDP IDs');
  const [perPage, setPerPage]     = useState(20);
  const [page, setPage]           = useState(0);

  /* AI chat state */
  const [msgs, setMsgs]     = useState<Message[]>(INITIAL_MSGS);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const [fmt, setFmt]       = useState('PDF');
  const [recentOpen, setRecentOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  function sendMsg(text: string) {
    if (!text.trim() || typing) return;
    setMsgs(m => [...m, { id: Date.now(), role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { id: Date.now() + 1, role: 'bot', text: BOT_REPLY }]);
    }, 1200);
  }

  function handleViewReport() {
    setReporting(true);
    setTimeout(() => { setReporting(false); setReported(true); setPage(0); }, 1000);
  }

  const total = ONDEMAND_RESULTS.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const visible = ONDEMAND_RESULTS.slice(page * perPage, page * perPage + perPage);

  return (
    <>
      <Topbar
        title="Reports"
        subtitle="dataQ OnDemand reporting and AI-powered report builder"
        actions={
          <button className="btn-secondary" style={{ fontSize: 12, gap: 5 }}>
            <IconDownload size={13}/> Download All
          </button>
        }
      />
      <main style={{ display: 'flex', flexDirection: 'column', height: `calc(100vh - var(--topbar-h))`, padding: '0 20px' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', background: '#fff', flexShrink: 0 }}>
          {([['ondemand','OnDemand Query'],['ai','AI Report Builder']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setMainTab(key)} style={{
              padding: '12px 24px', fontSize: 13, fontWeight: mainTab === key ? 700 : 500,
              color: mainTab === key ? '#1B2B6B' : '#64748B',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: mainTab === key ? '2px solid #1B2B6B' : '2px solid transparent',
              marginBottom: -2,
            }}>{label}</button>
          ))}
        </div>

        {/* ── ONDEMAND TAB ── */}
        {mainTab === 'ondemand' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>

            {/* Filter form */}
            <Card style={{ marginBottom: 16 }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1B2B6B' }}>dataQ OnDemand</div>
              </div>
              <CardBody style={{ padding: '18px 24px' }}>

                {/* Row 1: Relationship Type / Provider Type / Languages */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <FieldLabel>Relationship Type</FieldLabel>
                    <Select><option>--All--</option><option>Member</option><option>Network</option><option>Preferred</option></Select>
                  </div>
                  <div>
                    <FieldLabel>Provider Type</FieldLabel>
                    <Select><option>--Select Provider Type--</option>{PROVIDER_TYPES.map(o => <option key={o}>{o}</option>)}</Select>
                  </div>
                  <div>
                    <FieldLabel>Languages</FieldLabel>
                    <Select><option>--Select--</option><option>English</option><option>Spanish</option><option>Chinese</option><option>French</option></Select>
                  </div>
                </div>

                {/* Row 2: Group Keys / Payment Center / City */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 6 }}>
                  <div>
                    <FieldLabel>Group Keys</FieldLabel>
                    <TextInput placeholder="Enter group key(s)"/>
                  </div>
                  <div>
                    <FieldLabel>Payment Center</FieldLabel>
                    <Select><option>--All--</option><option>CVS CAREMARK</option><option>EXPRESS SCRIPTS</option><option>OPTUMRX</option></Select>
                  </div>
                  <div>
                    <FieldLabel>City</FieldLabel>
                    <TextInput placeholder="City"/>
                  </div>
                </div>

                {/* OR divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1, height: 1, background: '#E2E8F0' }}/>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', padding: '0 4px' }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: '#E2E8F0' }}/>
                </div>

                {/* Row 3: Relationship Name / Parent Organization / State */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <FieldLabel>Relationship Name</FieldLabel>
                    <Select><option>--All--</option>{RELATIONSHIPS.map(o => <option key={o}>{o}</option>)}</Select>
                  </div>
                  <div>
                    <FieldLabel>Parent Organization</FieldLabel>
                    <Select><option>--All--</option><option>CVS Health</option><option>Walgreens Boots Alliance</option><option>Rite Aid</option></Select>
                  </div>
                  <div>
                    <FieldLabel>State</FieldLabel>
                    <Select><option>--Select--</option><option>Alabama</option><option>Alaska</option><option>Arizona</option><option>California</option><option>Colorado</option><option>Florida</option><option>Georgia</option><option>Illinois</option><option>Michigan</option><option>New York</option><option>Ohio</option><option>Pennsylvania</option><option>Texas</option><option>Washington</option></Select>
                  </div>
                </div>

                {/* Row 4: Dispenser Class / Services Available / Zip + County */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <FieldLabel>Dispenser Class</FieldLabel>
                    <Select><option>--All--</option>{DISPENSER_CLASSES.map(o => <option key={o}>{o}</option>)}</Select>
                  </div>
                  <div>
                    <FieldLabel>Services Available</FieldLabel>
                    <Select><option>--Select Service--</option>{SERVICES.map(o => <option key={o}>{o}</option>)}</Select>
                  </div>
                  <div>
                    <FieldLabel>Zip</FieldLabel>
                    <TextInput placeholder="ZIP Code"/>
                  </div>
                  <div>
                    <FieldLabel>County Code</FieldLabel>
                    <TextInput placeholder="County Code"/>
                  </div>
                </div>

                {/* Row 5: 24/7 + MSA/PMSA + Include Inactive */}
                <div style={{ display: 'grid', gridTemplateColumns: '180px 180px 180px 1fr', gap: 14, alignItems: 'end', marginBottom: 14 }}>
                  <div>
                    <FieldLabel>24/7</FieldLabel>
                    <Select><option>--All--</option><option>Yes</option><option>No</option></Select>
                  </div>
                  <div>
                    <FieldLabel>MSA</FieldLabel>
                    <TextInput placeholder="MSA Code"/>
                  </div>
                  <div>
                    <FieldLabel>PMSA</FieldLabel>
                    <TextInput placeholder="PMSA Code"/>
                  </div>
                  <div style={{ paddingBottom: 6 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#334155', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ width: 14, height: 14 }}/>
                      Include Inactive Relation
                    </label>
                  </div>
                </div>

                {/* Row 6: Date ranges */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <DateRange label="Relationship Start"/>
                  <DateRange label="Relationship End"/>
                  <DateRange label="Open Date"/>
                  <DateRange label="Close Date"/>
                </div>

                {/* Row 7: Order By / Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 14, marginBottom: 20 }}>
                  <div>
                    <FieldLabel>Order By</FieldLabel>
                    <Select value={orderBy} onChange={e => setOrderBy(e.target.value)}>
                      {ORDER_BY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </Select>
                  </div>
                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                      <option>Active NCPDP IDs</option>
                      <option>Inactive NCPDP IDs</option>
                      <option>All NCPDP IDs</option>
                    </Select>
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                  <button
                    className="btn-primary"
                    onClick={handleViewReport}
                    disabled={reporting}
                    style={{ gap: 6, padding: '8px 28px', minWidth: 130 }}
                  >
                    {reporting ? (
                      <><IconRefresh size={14} color="#fff"/> Querying...</>
                    ) : (
                      <><IconSearch size={14} color="#fff"/> View Report</>
                    )}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => { setReported(false); setPage(0); }}
                    style={{ gap: 6, padding: '8px 24px' }}
                  >
                    <IconRefresh size={14}/> Reset
                  </button>
                </div>
              </CardBody>
            </Card>

            {/* Results section */}
            {reported && (
              <div>
                {/* Results header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>
                    Report Results —{' '}
                    <span style={{ color: '#10B981' }}>{total.toLocaleString()} records found</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" style={{ fontSize: 12, gap: 4 }}><IconDownload size={12}/> Export CSV</button>
                    <button className="btn-secondary" style={{ fontSize: 12, gap: 4 }}><IconDownload size={12}/> Export PDF</button>
                  </div>
                </div>

                {/* Results table */}
                <div style={{ borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden', background: '#fff' }}>
                  <table>
                    <thead>
                      <tr>
                        {['Pharmacy DBA Name','NCPDP Provider ID','Rel. Type','City','State','Dispenser Class','Open Date','Status'].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map(r => (
                        <tr key={r.ncpdp}>
                          <td style={{ fontWeight: 500 }}>{r.name}</td>
                          <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#4F46E5', fontSize: 12.5 }}>{r.ncpdp}</td>
                          <td style={{ color: '#64748B' }}>{r.relType}</td>
                          <td>{r.city}</td>
                          <td style={{ fontWeight: 600 }}>{r.state}</td>
                          <td style={{ color: '#64748B' }}>{r.dispClass}</td>
                          <td style={{ color: '#94A3B8' }}>{r.openDate}</td>
                          <td><Badge variant={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 14px', background: '#F8FAFC',
                  border: '1px solid #E2E8F0', borderTop: 'none', borderRadius: '0 0 8px 8px', fontSize: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
                    <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(0); }}
                      style={{ padding: '3px 6px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, color: '#334155' }}>
                      {[20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <span>items per page</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748B' }}>
                    <span>{page * perPage + 1} – {Math.min(page * perPage + perPage, total)} of {total} items</span>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[
                        { lbl: '«', fn: () => setPage(0),             dis: page === 0              },
                        { lbl: '‹', fn: () => setPage(page - 1),      dis: page === 0              },
                        { lbl: '›', fn: () => setPage(page + 1),      dis: page >= totalPages - 1  },
                        { lbl: '»', fn: () => setPage(totalPages - 1), dis: page >= totalPages - 1 },
                      ].map(b => (
                        <button key={b.lbl} onClick={b.fn} disabled={b.dis} style={{
                          width: 26, height: 26, borderRadius: 4, border: '1px solid #CBD5E1',
                          background: b.dis ? '#F1F5F9' : '#fff', color: b.dis ? '#CBD5E1' : '#334155',
                          fontSize: 13, fontWeight: 700, cursor: b.dis ? 'default' : 'pointer',
                        }}>{b.lbl}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!reported && !reporting && (
              <div style={{
                textAlign: 'center', padding: '48px 20px',
                border: '1px solid #E2E8F0', borderRadius: 8, background: '#FAFAFA',
              }}>
                <IconSearch size={36} color="#CBD5E1"/>
                <div style={{ marginTop: 12, fontSize: 13, color: '#CBD5E1', fontWeight: 600 }}>
                  Set your query criteria above and click View Report
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AI REPORT BUILDER TAB ── */}
        {mainTab === 'ai' && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '400px 1fr', minHeight: 0 }}>

            {/* Left: chat */}
            <div style={{
              display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)',
              background: 'var(--surface)', height: '100%',
            }}>
              {/* Header */}
              <div style={{
                padding: '14px 18px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#4F46E5,#818CF8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconSparkles size={16} color="#fff"/>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>AGT-25 — Report Builder</div>
                  <div style={{ fontSize: 11, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}/>
                    Active
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {msgs.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '85%', padding: '8px 12px', borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      background: m.role === 'user' ? '#4F46E5' : 'var(--surface-2)',
                      color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                      fontSize: 12.5, lineHeight: 1.5, border: m.role === 'bot' ? '1px solid var(--border-light)' : 'none',
                    }}>
                      {m.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div style={{ display: 'flex', gap: 4, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: '12px 12px 12px 2px', width: 52, border: '1px solid var(--border-light)' }}>
                    {[0,1,2].map(i => (
                      <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8', display: 'inline-block', animation: `bounce 1s ${i * 0.15}s infinite` }}/>
                    ))}
                  </div>
                )}
                <div ref={bottomRef}/>
              </div>

              {/* Suggestions */}
              {!typing && (
                <div style={{ padding: '0 16px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => sendMsg(s)} style={{
                      padding: '5px 10px', borderRadius: 20, border: '1px solid var(--border)',
                      background: 'var(--surface-2)', color: 'var(--text-secondary)', fontSize: 11,
                      cursor: 'pointer', fontWeight: 500,
                    }}>{s}</button>
                  ))}
                </div>
              )}

              {/* Format + Input */}
              <div style={{ padding: '10px 16px 14px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  {['PDF','Excel','CSV','API'].map(f => (
                    <button key={f} onClick={() => setFmt(f)} style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      border: '1px solid',
                      borderColor: fmt === f ? '#4F46E5' : 'var(--border)',
                      background: fmt === f ? '#EEF2FF' : 'var(--surface-2)',
                      color: fmt === f ? '#4F46E5' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}>{f}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMsg(input)}
                    placeholder="Describe the report you need..."
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)',
                      fontSize: 12.5, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none',
                    }}
                  />
                  <button onClick={() => sendMsg(input)} disabled={!input.trim() || typing} style={{
                    width: 36, height: 36, borderRadius: 8, background: '#4F46E5',
                    border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                    opacity: input.trim() ? 1 : 0.4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IconSend size={14} color="#fff"/>
                  </button>
                </div>
              </div>

              {/* Recent Reports */}
              <div style={{ borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                <button onClick={() => setRecentOpen(o => !o)} style={{
                  width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em',
                }}>
                  Recent Reports
                  <IconChevronDown size={13} color="var(--text-muted)"/>
                </button>
                {recentOpen && (
                  <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {RECENT_REPORTS.map(r => (
                      <div key={r.name} style={{
                        padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'var(--surface-2)', cursor: 'pointer',
                      }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{r.name}</div>
                          <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{r.date} · {r.format}</div>
                        </div>
                        <IconDownload size={12} color="var(--text-muted)"/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: live report preview */}
            <div style={{ overflowY: 'auto', padding: '20px 24px', background: 'var(--surface-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>Q1 2026 Credential Expiry Report</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Generated Mar 31, 2026 · 68,247 pharmacies · 50 states</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-secondary" style={{ fontSize: 12, gap: 4 }}><IconDownload size={12}/> PDF</button>
                  <button className="btn-secondary" style={{ fontSize: 12, gap: 4 }}><IconDownload size={12}/> Excel</button>
                </div>
              </div>

              {/* Summary stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
                {[
                  { label: 'Total Pharmacies',    value: '68,247', color: '#4F46E5' },
                  { label: 'Credentials Expiring',value: '234',    color: '#F59E0B' },
                  { label: 'Multi-Expiry Risk',   value: '12',     color: '#EF4444' },
                  { label: 'States with Issues',  value: '23',     color: '#10B981' },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: '14px 16px', borderRadius: 10, background: '#fff',
                    border: '1px solid var(--border-light)',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Expiring by type */}
              <div style={{ background: '#fff', borderRadius: 10, border: '1px solid var(--border-light)', padding: '14px 18px', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Expiring by Credential Type</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[
                    { type: 'DEA Registration', expiring: 89, total: 68247, color: '#4F46E5' },
                    { type: 'State License',     expiring: 112, total: 68247, color: '#F59E0B' },
                    { type: 'Accreditation',     expiring: 33,  total: 68247, color: '#10B981' },
                  ].map(c => (
                    <div key={c.type} style={{ padding: '12px 14px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 6 }}>{c.type}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: c.color, marginBottom: 4 }}>{c.expiring}</div>
                      <div style={{ height: 4, borderRadius: 2, background: '#E2E8F0', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(c.expiring / c.total) * 100 * 50}%`, background: c.color, borderRadius: 2 }}/>
                      </div>
                      <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 4 }}>of {c.total.toLocaleString()} total</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* At-risk states */}
              <div style={{ background: '#fff', borderRadius: 10, border: '1px solid var(--border-light)', marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ padding: '12px 18px', borderBottom: '1px solid #F1F5F9', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  At-Risk States (Top 5)
                </div>
                <table>
                  <thead>
                    <tr>
                      {['State','DEA','License','Accreditation','Total'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { state: 'Texas',        dea: 12, lic: 9,  acc: 7,  total: 28 },
                      { state: 'California',   dea: 10, lic: 8,  acc: 6,  total: 24 },
                      { state: 'Florida',      dea: 8,  lic: 6,  acc: 5,  total: 19 },
                      { state: 'New York',     dea: 7,  lic: 5,  acc: 4,  total: 16 },
                      { state: 'Pennsylvania', dea: 5,  lic: 5,  acc: 4,  total: 14 },
                    ].map(r => (
                      <tr key={r.state}>
                        <td style={{ fontWeight: 500 }}>{r.state}</td>
                        <td style={{ color: '#4F46E5', fontWeight: 700 }}>{r.dea}</td>
                        <td style={{ color: '#F59E0B', fontWeight: 700 }}>{r.lic}</td>
                        <td style={{ color: '#10B981', fontWeight: 700 }}>{r.acc}</td>
                        <td><span style={{ fontWeight: 800, color: '#EF4444' }}>{r.total}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Multi-expiry risk */}
              <div style={{ background: '#FEF2F2', borderRadius: 10, border: '1px solid #FECACA', padding: '14px 18px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', marginBottom: 10 }}>Multiple Expiry Risk — 12 Pharmacies</div>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>Pharmacies with 2+ credentials expiring within 60 days — highest priority action items.</div>
                {[
                  { ncpdp: '1234567', name: 'CareRx Pharmacy #0842',     days: 12, count: 3 },
                  { ncpdp: '5678901', name: 'Alpine Specialty Dispensary',days: 18, count: 2 },
                  { ncpdp: '9012345', name: 'Capital Area Pharmacy Group',days: 24, count: 2 },
                ].map(r => (
                  <div key={r.ncpdp} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', marginBottom: 6, borderRadius: 8, background: '#fff',
                    border: '1px solid #FCA5A5',
                  }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1E293B' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>{r.ncpdp}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge variant="danger">{r.count} expiring</Badge>
                      <div style={{ fontSize: 11, color: '#DC2626', marginTop: 3, fontWeight: 600 }}>First: {r.days} days</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </>
  );
}
