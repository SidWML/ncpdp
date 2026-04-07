'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/v3/TopbarV3';
import {
  IconSend, IconSparkles, IconFilter, IconDownload, IconRefresh,
  IconChevronLeft, IconChevronRight, IconCalendar, IconTrendUp,
  IconAlertTriangle, IconShield, IconCheck, IconReport,
} from '@/components/ui/Icons';
import { AgentChat } from '@/components/ui/AgentChat';
import { FieldLabel, Select, TextInput, MultiSelect, DateRange } from '@/components/ui/FormFields';
import {
  DISPENSER_CLASSES, PROVIDER_TYPES, RELATIONSHIPS, SERVICES,
  US_STATES, STATUS_OPTIONS, ORDER_BY_OPTIONS, LANGUAGES, PARENT_ORGS,
} from '@/lib/filter-options';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts';

// -- Tab definitions --
const TABS = ['OnDemand Query', 'AI Report Builder', 'Analytics'] as const;
type Tab = typeof TABS[number];

// -- Mock data: OnDemand results --
const OD_ROWS = Array.from({ length: 15 }, (_, i) => ({
  ncpdp: `${1800000 + i * 1137}`,
  npi: `${1234567890 + i * 31}`,
  name: [
    'Valley Care Pharmacy', 'Sunridge Rx Solutions', 'Metro Health Rx', 'Lakeview Pharmacy',
    'CareFirst Drugs', 'PrimeCare Pharmacy', 'Coastal Rx Center', 'Summit Pharmacy',
    'Heritage Drug Store', 'CrossRoads Pharmacy', 'Pinnacle Rx', 'Beacon Health Pharmacy',
    'Riverside Drug Co', 'Golden Gate Rx', 'Evergreen Pharmacy',
  ][i],
  city: ['Phoenix', 'Dallas', 'Miami', 'Chicago', 'Denver', 'Seattle', 'Portland', 'Atlanta', 'Boston', 'Austin', 'Tampa', 'Raleigh', 'San Jose', 'San Francisco', 'Columbus'][i],
  state: ['AZ', 'TX', 'FL', 'IL', 'CO', 'WA', 'OR', 'GA', 'MA', 'TX', 'FL', 'NC', 'CA', 'CA', 'OH'][i],
  zip: ['85001', '75201', '33101', '60601', '80201', '98101', '97201', '30301', '02101', '73301', '33601', '27601', '95101', '94101', '43201'][i],
  type: ['Community', 'Specialty', 'Community', 'Mail Service', 'Community', 'Specialty', 'LTC', 'Community', 'Nuclear', 'Community', 'Specialty', 'Community', 'Compounding', 'Community', 'Community'][i],
  status: i === 3 || i === 11 ? 'Inactive' : 'Active',
  dea: `2026-${String(((i * 2) % 12) + 1).padStart(2, '0')}-15`,
}));

// -- Mock data: AI Report Builder preview --
const EXPIRY_STATS = [
  { label: 'Total Expiring', value: '1,247', color: '#EF4444', bg: '#FEF2F2', icon: IconAlertTriangle },
  { label: '30-Day Critical', value: '312', color: '#DC2626', bg: '#FEE2E2', icon: IconShield },
  { label: 'Renewed This Qtr', value: '2,891', color: '#059669', bg: '#ECFDF5', icon: IconCheck },
  { label: 'Avg Days to Expiry', value: '47', color: '#6366F1', bg: '#EEF2FF', icon: IconCalendar },
];
const EXPIRY_BY_TYPE = [
  { type: 'DEA Registration', count: 489, pct: 39 },
  { type: 'State License', count: 341, pct: 27 },
  { type: 'NPI Certification', count: 218, pct: 18 },
  { type: 'FWA Attestation', count: 199, pct: 16 },
];
const AT_RISK_STATES = [
  { state: 'California', expiring: 187, critical: 42, networks: 14 },
  { state: 'Texas', expiring: 156, critical: 38, networks: 11 },
  { state: 'Florida', expiring: 134, critical: 31, networks: 12 },
  { state: 'New York', expiring: 121, critical: 28, networks: 9 },
  { state: 'Illinois', expiring: 98, critical: 22, networks: 8 },
];

// -- Mock data: Analytics --
const NET_CHANGES = [
  { month: 'Oct', added: 420, removed: -180 },
  { month: 'Nov', added: 380, removed: -210 },
  { month: 'Dec', added: 510, removed: -150 },
  { month: 'Jan', added: 460, removed: -190 },
  { month: 'Feb', added: 530, removed: -170 },
  { month: 'Mar', added: 490, removed: -200 },
];
const PHARM_TYPES = [
  { name: 'Community', value: 41200, color: '#6366F1' },
  { name: 'Specialty', value: 8400, color: '#A78BFA' },
  { name: 'Mail Service', value: 5100, color: '#EC4899' },
  { name: 'LTC', value: 4800, color: '#F59E0B' },
  { name: 'Compounding', value: 3200, color: '#10B981' },
  { name: 'Other', value: 5547, color: '#94A3B8' },
];
const NETWORK_TREND = [
  { month: 'Jul', pharmacies: 63800 },
  { month: 'Aug', pharmacies: 64200 },
  { month: 'Sep', pharmacies: 64900 },
  { month: 'Oct', pharmacies: 65600 },
  { month: 'Nov', pharmacies: 66100 },
  { month: 'Dec', pharmacies: 66700 },
  { month: 'Jan', pharmacies: 67200 },
  { month: 'Feb', pharmacies: 67800 },
  { month: 'Mar', pharmacies: 81500 },
];
const COVERAGE_BY_STATE = [
  { state: 'California', pharmacies: 6842, coverage: 98.2, change: '+1.4%' },
  { state: 'Texas', pharmacies: 5931, coverage: 97.1, change: '+0.8%' },
  { state: 'Florida', pharmacies: 4817, coverage: 96.9, change: '+1.1%' },
  { state: 'New York', pharmacies: 4203, coverage: 99.1, change: '+0.3%' },
  { state: 'Pennsylvania', pharmacies: 3194, coverage: 97.6, change: '+0.6%' },
  { state: 'Illinois', pharmacies: 2987, coverage: 96.4, change: '+1.2%' },
  { state: 'Ohio', pharmacies: 2741, coverage: 95.8, change: '+0.9%' },
  { state: 'Georgia', pharmacies: 2568, coverage: 94.7, change: '+1.7%' },
];
const COMPLIANCE_TARGETS = [
  { metric: 'DEA Registration', target: 99.5, actual: 98.2, status: 'warning' },
  { metric: 'State Licensure', target: 99.0, actual: 99.4, status: 'met' },
  { metric: 'NPI Validation', target: 98.0, actual: 98.7, status: 'met' },
  { metric: 'FWA Attestation', target: 95.0, actual: 91.3, status: 'critical' },
  { metric: 'Network Adequacy', target: 97.0, actual: 96.8, status: 'warning' },
];

const PERIOD_PILLS = ['Last 30 Days', 'Last Quarter', 'Last 6 Months', 'YTD', 'Last Year'];

export default function ReportsV3() {
  const [tab, setTab] = useState<Tab>('OnDemand Query');
  const [prompt, setPrompt] = useState('');
  const [odPage, setOdPage] = useState(1);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('Last Quarter');

  const perPage = 10;
  const totalPages = Math.ceil(OD_ROWS.length / perPage);
  const pagedRows = OD_ROWS.slice((odPage - 1) * perPage, odPage * perPage);

  return (
    <>
      <Topbar title="Reports" />
      <main style={{ padding: '0 24px 48px' }}>

        {/* --- AI Prompt Hero --- */}
        <div className="v3-prompt" style={{
          maxWidth: 760, margin: '28px auto 0', padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(99,102,241,.06), rgba(167,139,250,.06))',
          borderRadius: 16, border: '1px solid rgba(99,102,241,.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <IconSparkles size={20} color="#6366F1" />
            <span className="v3-title" style={{ fontSize: 15 }}>AI Report Assistant</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              className="v3-input"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the report you need..."
              style={{
                flex: 1, height: 44, fontSize: 13.5, borderRadius: 12,
                padding: '0 16px', border: '1px solid rgba(99,102,241,.2)',
                background: '#fff',
              }}
              onKeyDown={e => e.key === 'Enter' && setTab('AI Report Builder')}
            />
            <button
              className="v3-btn-accent"
              onClick={() => setTab('AI Report Builder')}
              style={{
                height: 44, padding: '0 20px', borderRadius: 12, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer',
              }}
            >
              <IconSend size={14} /> Send
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {[
              'Show DEA expirations by state for Q1',
              'Network adequacy gap analysis',
              'Monthly pharmacy onboarding trends',
            ].map(s => (
              <button
                key={s}
                className="v3-btn-ghost"
                onClick={() => { setPrompt(s); setTab('AI Report Builder'); }}
                style={{
                  fontSize: 11.5, padding: '5px 12px', borderRadius: 20,
                  border: '1px solid rgba(99,102,241,.15)', cursor: 'pointer',
                  background: 'rgba(99,102,241,.04)', color: 'var(--v3-text-2)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* --- Tabs --- */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--v3-border)', margin: '28px 0 24px' }}>
          {TABS.map(t => (
            <button
              key={t}
              className="v3-tab"
              onClick={() => setTab(t)}
              style={{
                padding: '10px 22px', fontSize: 13, fontWeight: tab === t ? 600 : 400,
                color: tab === t ? '#6366F1' : 'var(--v3-text-3)',
                borderBottom: tab === t ? '2px solid #6366F1' : '2px solid transparent',
                background: 'none', border: 'none', borderBottomWidth: 2,
                borderBottomStyle: 'solid',
                borderBottomColor: tab === t ? '#6366F1' : 'transparent',
                cursor: 'pointer', transition: 'all .15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: OnDemand Query                                        */}
        {/* ============================================================ */}
        {tab === 'OnDemand Query' && (
          <div>
            {/* Filter section */}
            <div className="v3-card" style={{ padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <IconFilter size={16} color="#6366F1" />
                <span className="v3-title" style={{ fontSize: 14 }}>Query Filters</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {/* Row 1 */}
                <div>
                  <FieldLabel>Relationship Type</FieldLabel>
                  <Select><option value="">All</option>{RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}</Select>
                </div>
                <div>
                  <FieldLabel>Provider Type</FieldLabel>
                  <Select><option value="">All</option>{PROVIDER_TYPES.map(p => <option key={p}>{p}</option>)}</Select>
                </div>
                <div>
                  <FieldLabel>Languages</FieldLabel>
                  <MultiSelect options={LANGUAGES} height={80} />
                </div>
                <div>
                  <FieldLabel>Group Keys</FieldLabel>
                  <TextInput placeholder="Enter group keys..." />
                </div>

                {/* Row 2 */}
                <div>
                  <FieldLabel>Payment Center</FieldLabel>
                  <TextInput placeholder="Payment center..." />
                </div>
                <div>
                  <FieldLabel>City</FieldLabel>
                  <TextInput placeholder="City name..." />
                </div>
                <div>
                  <FieldLabel>Relationship Name</FieldLabel>
                  <TextInput placeholder="Relationship name..." />
                </div>
                <div>
                  <FieldLabel>Parent Organization</FieldLabel>
                  <Select><option value="">All</option>{PARENT_ORGS.map(p => <option key={p}>{p}</option>)}</Select>
                </div>

                {/* Row 3 */}
                <div>
                  <FieldLabel>State</FieldLabel>
                  <Select><option value="">All States</option>{US_STATES.map(s => <option key={s}>{s}</option>)}</Select>
                </div>
                <div>
                  <FieldLabel>Dispenser Class</FieldLabel>
                  <MultiSelect options={DISPENSER_CLASSES} height={80} />
                </div>
                <div>
                  <FieldLabel>Services</FieldLabel>
                  <MultiSelect options={SERVICES} height={80} />
                </div>
                <div>
                  <FieldLabel>ZIP Code</FieldLabel>
                  <TextInput placeholder="ZIP code..." />
                </div>

                {/* Row 4 */}
                <div>
                  <FieldLabel>County Code</FieldLabel>
                  <TextInput placeholder="County code..." />
                </div>
                <div>
                  <FieldLabel>24/7 Pharmacy</FieldLabel>
                  <Select>
                    <option value="">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </div>
                <div>
                  <FieldLabel>MSA</FieldLabel>
                  <TextInput placeholder="MSA code..." />
                </div>
                <div>
                  <FieldLabel>PMSA</FieldLabel>
                  <TextInput placeholder="PMSA code..." />
                </div>

                {/* Row 5 - checkboxes & status */}
                <div>
                  <FieldLabel>Include Inactive</FieldLabel>
                  <Select>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </Select>
                </div>
                <div>
                  <FieldLabel>Order By</FieldLabel>
                  <Select><option value="">Default</option>{ORDER_BY_OPTIONS.map(o => <option key={o}>{o}</option>)}</Select>
                </div>
                <div>
                  <FieldLabel>Status</FieldLabel>
                  <Select>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</Select>
                </div>
                <div />
              </div>

              {/* Date ranges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 16 }}>
                <DateRange label="Open Date Range" />
                <DateRange label="Close Date Range" />
                <DateRange label="DEA Expiry Range" />
                <DateRange label="Profile Update Range" />
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button className="v3-btn-accent" style={{
                  height: 38, padding: '0 24px', borderRadius: 8, fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer',
                }}>
                  <IconReport size={14} /> View Report
                </button>
                <button className="v3-btn-outline" style={{
                  height: 38, padding: '0 20px', borderRadius: 8, fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  background: 'transparent',
                }}>
                  <IconRefresh size={14} /> Reset
                </button>
                <button className="v3-btn-soft" style={{
                  height: 38, padding: '0 20px', borderRadius: 8, fontSize: 13, marginLeft: 'auto',
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                }}>
                  <IconDownload size={14} /> Export CSV
                </button>
              </div>
            </div>

            {/* Results table */}
            <div className="v3-card" style={{ padding: 0 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--v3-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="v3-title" style={{ fontSize: 14 }}>Query Results</span>
                <span className="v3-sub" style={{ fontSize: 12 }}>{OD_ROWS.length} records found</span>
              </div>
              <div className="v3-table-wrap">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: 'var(--v3-surface-2)' }}>
                      {['NCPDP ID', 'NPI', 'Pharmacy Name', 'City', 'State', 'ZIP', 'Type', 'Status', 'DEA Expiry'].map(h => (
                        <th key={h} className="v3-label" style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: 'var(--v3-text-3)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--v3-border)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#6366F1' }}>{r.ncpdp}</td>
                        <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono, monospace)', fontSize: 11.5 }}>{r.npi}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 500 }}>{r.name}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--v3-text-2)' }}>{r.city}</td>
                        <td style={{ padding: '10px 14px' }}>{r.state}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--v3-text-3)' }}>{r.zip}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className="v3-badge-default" style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6 }}>{r.type}</span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span
                            className={r.status === 'Active' ? 'v3-badge-green' : 'v3-badge-red'}
                            style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6 }}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--v3-text-3)' }}>{r.dea}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--v3-border)' }}>
                <span className="v3-sub" style={{ fontSize: 12 }}>
                  Showing {(odPage - 1) * perPage + 1}-{Math.min(odPage * perPage, OD_ROWS.length)} of {OD_ROWS.length}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="v3-btn-ghost"
                    disabled={odPage <= 1}
                    onClick={() => setOdPage(p => p - 1)}
                    style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--v3-border)', background: 'transparent', opacity: odPage <= 1 ? 0.4 : 1 }}
                  >
                    <IconChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={odPage === i + 1 ? 'v3-btn-accent' : 'v3-btn-ghost'}
                      onClick={() => setOdPage(i + 1)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, fontSize: 12, fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        border: odPage === i + 1 ? 'none' : '1px solid var(--v3-border)',
                        background: odPage === i + 1 ? undefined : 'transparent',
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="v3-btn-ghost"
                    disabled={odPage >= totalPages}
                    onClick={() => setOdPage(p => p + 1)}
                    style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--v3-border)', background: 'transparent', opacity: odPage >= totalPages ? 0.4 : 1 }}
                  >
                    <IconChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: AI Report Builder                                     */}
        {/* ============================================================ */}
        {tab === 'AI Report Builder' && (
          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, minHeight: 640 }}>
            {/* Left: Agent Chat */}
            <div className="v3-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <AgentChat
                agentName="Report Builder"
                agentId="AGT-25"
                gradient="linear-gradient(135deg,#7C3AED,#A78BFA)"
                suggestions={[
                  'Credential expiry report for Q1 2026',
                  'Network pharmacy additions by month',
                  'Compliance gap analysis by state',
                  'FWA attestation status summary',
                ]}
                welcomeMessage="I can build any report from your NCPDP data. Describe what you need - metrics, filters, time range - and I'll generate it live."
                getBotReply={(msg: string) =>
                  `Report generated successfully.\n\nAnalyzed 81,500 pharmacy records matching "${msg.slice(0, 50)}${msg.length > 50 ? '...' : ''}".\n\nThe preview panel on the right has been updated with your results. You can export the report or refine the criteria.`
                }
                hideHeader
                fluid
              />
            </div>

            {/* Right: Live report preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Preview header */}
              <div className="v3-hero-card" style={{
                padding: '18px 24px', borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(124,58,237,.08), rgba(167,139,250,.05))',
                border: '1px solid rgba(124,58,237,.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div className="v3-title" style={{ fontSize: 15, marginBottom: 2 }}>Q1 2026 Credential Expiry Report</div>
                  <div className="v3-sub" style={{ fontSize: 12 }}>Generated Mar 31, 2026 -- 81,500 pharmacies analyzed</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="v3-btn-soft" style={{ height: 34, padding: '0 14px', borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <IconRefresh size={13} /> Refresh
                  </button>
                  <button className="v3-btn-accent" style={{ height: 34, padding: '0 14px', borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}>
                    <IconDownload size={13} /> Export
                  </button>
                </div>
              </div>

              {/* 4 stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {EXPIRY_STATS.map(s => (
                  <div key={s.label} className="v3-card" style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <s.icon size={16} color={s.color} />
                      </div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--v3-text-1)', lineHeight: 1 }}>{s.value}</div>
                    <div className="v3-sub" style={{ fontSize: 11.5, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Expiring by Type */}
              <div className="v3-card" style={{ padding: '18px 20px' }}>
                <div className="v3-title" style={{ fontSize: 13, marginBottom: 14 }}>Expiring by Credential Type</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {EXPIRY_BY_TYPE.map(t => (
                    <div key={t.type} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 130, fontSize: 12, color: 'var(--v3-text-2)' }}>{t.type}</span>
                      <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--v3-surface-2)', overflow: 'hidden' }}>
                        <div style={{ width: `${t.pct}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#6366F1,#A78BFA)' }} />
                      </div>
                      <span style={{ width: 50, fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{t.count}</span>
                      <span style={{ width: 36, fontSize: 11, color: 'var(--v3-text-3)', textAlign: 'right' }}>{t.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* At-Risk States table */}
              <div className="v3-card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--v3-border)' }}>
                  <span className="v3-title" style={{ fontSize: 13 }}>At-Risk States</span>
                </div>
                <div className="v3-table-wrap">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: 'var(--v3-surface-2)' }}>
                        {['State', 'Expiring', 'Critical (30d)', 'Networks Affected'].map(h => (
                          <th key={h} className="v3-label" style={{ padding: '9px 16px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: 'var(--v3-text-3)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {AT_RISK_STATES.map(r => (
                        <tr key={r.state} style={{ borderBottom: '1px solid var(--v3-border)' }}>
                          <td style={{ padding: '9px 16px', fontWeight: 500 }}>{r.state}</td>
                          <td style={{ padding: '9px 16px', color: '#D97706', fontWeight: 600 }}>{r.expiring}</td>
                          <td style={{ padding: '9px 16px' }}>
                            <span className="v3-badge-red" style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6 }}>{r.critical}</span>
                          </td>
                          <td style={{ padding: '9px 16px', color: 'var(--v3-text-2)' }}>{r.networks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: Analytics                                             */}
        {/* ============================================================ */}
        {tab === 'Analytics' && (
          <div>
            {/* Period selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {PERIOD_PILLS.map(p => (
                <button
                  key={p}
                  className={analyticsPeriod === p ? 'v3-btn-accent' : 'v3-btn-ghost'}
                  onClick={() => setAnalyticsPeriod(p)}
                  style={{
                    height: 34, padding: '0 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                    border: analyticsPeriod === p ? 'none' : '1px solid var(--v3-border)',
                    background: analyticsPeriod === p ? undefined : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* 3-column charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
              {/* Bar Chart - Net Changes */}
              <div className="v3-card" style={{ padding: '18px 20px' }}>
                <div className="v3-title" style={{ fontSize: 13, marginBottom: 4 }}>Net Pharmacy Changes</div>
                <div className="v3-sub" style={{ fontSize: 11.5, marginBottom: 16 }}>Monthly additions vs removals</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={NET_CHANGES} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--v3-border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--v3-border)' }}
                      formatter={(val: unknown) => `${Math.abs(Number(val))}`}
                    />
                    <Bar dataKey="added" fill="#6366F1" radius={[4, 4, 0, 0]} name="Added" />
                    <Bar dataKey="removed" fill="#EF4444" radius={[4, 4, 0, 0]} name="Removed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart - Pharmacy Types */}
              <div className="v3-card" style={{ padding: '18px 20px' }}>
                <div className="v3-title" style={{ fontSize: 13, marginBottom: 4 }}>Pharmacy Types</div>
                <div className="v3-sub" style={{ fontSize: 11.5, marginBottom: 16 }}>Distribution by classification</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={PHARM_TYPES}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {PHARM_TYPES.map(entry => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--v3-border)' }}
                      formatter={(val: unknown) => `${Number(val).toLocaleString()}`}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Area Chart - Network Trend */}
              <div className="v3-card" style={{ padding: '18px 20px' }}>
                <div className="v3-title" style={{ fontSize: 13, marginBottom: 4 }}>Network Growth Trend</div>
                <div className="v3-sub" style={{ fontSize: 11.5, marginBottom: 16 }}>Total pharmacies over time</div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={NETWORK_TREND}>
                    <defs>
                      <linearGradient id="networkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--v3-border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                      domain={['dataMin - 500', 'dataMax + 500']}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--v3-border)' }}
                      formatter={(val: unknown) => `${Number(val).toLocaleString()}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="pharmacies"
                      stroke="#6366F1"
                      strokeWidth={2}
                      fill="url(#networkGrad)"
                      name="Pharmacies"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Coverage by State + Compliance Targets side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20 }}>
              {/* Coverage by State table */}
              <div className="v3-card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--v3-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="v3-title" style={{ fontSize: 13 }}>Coverage by State</span>
                  <span className="v3-sub" style={{ fontSize: 11 }}>Top 8 states by pharmacy count</span>
                </div>
                <div className="v3-table-wrap">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: 'var(--v3-surface-2)' }}>
                        {['State', 'Pharmacies', 'Coverage %', 'Change'].map(h => (
                          <th key={h} className="v3-label" style={{ padding: '9px 16px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: 'var(--v3-text-3)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COVERAGE_BY_STATE.map(r => (
                        <tr key={r.state} style={{ borderBottom: '1px solid var(--v3-border)' }}>
                          <td style={{ padding: '9px 16px', fontWeight: 500 }}>{r.state}</td>
                          <td style={{ padding: '9px 16px', fontWeight: 600, color: '#6366F1' }}>{r.pharmacies.toLocaleString()}</td>
                          <td style={{ padding: '9px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, maxWidth: 80, height: 6, borderRadius: 3, background: 'var(--v3-surface-2)', overflow: 'hidden' }}>
                                <div style={{ width: `${r.coverage}%`, height: '100%', borderRadius: 3, background: r.coverage >= 97 ? '#10B981' : '#F59E0B' }} />
                              </div>
                              <span style={{ fontSize: 12 }}>{r.coverage}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '9px 16px' }}>
                            <span style={{ color: '#059669', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 }}>
                              <IconTrendUp size={12} color="#059669" /> {r.change}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Compliance Targets */}
              <div className="v3-card" style={{ padding: '18px 20px' }}>
                <div className="v3-title" style={{ fontSize: 13, marginBottom: 16 }}>Compliance Targets</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {COMPLIANCE_TARGETS.map(t => (
                    <div key={t.metric}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--v3-text-1)' }}>{t.metric}</span>
                        <span className={
                          t.status === 'met' ? 'v3-badge-green' :
                          t.status === 'warning' ? 'v3-badge-yellow' : 'v3-badge-red'
                        } style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 6, textTransform: 'capitalize' }}>
                          {t.status === 'met' ? 'On Target' : t.status === 'warning' ? 'Near Miss' : 'Below Target'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--v3-surface-2)', overflow: 'hidden', position: 'relative' }}>
                          {/* Target marker */}
                          <div style={{
                            position: 'absolute', left: `${t.target}%`, top: -2, width: 2, height: 12,
                            background: 'var(--v3-text-3)', borderRadius: 1, zIndex: 2,
                          }} />
                          <div style={{
                            width: `${t.actual}%`, height: '100%', borderRadius: 4,
                            background: t.status === 'met' ? '#10B981' : t.status === 'warning' ? '#F59E0B' : '#EF4444',
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, width: 44, textAlign: 'right' }}>{t.actual}%</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--v3-text-3)', marginTop: 2 }}>Target: {t.target}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
}
