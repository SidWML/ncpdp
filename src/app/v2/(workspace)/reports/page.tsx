'use client';
import React, { useState } from 'react';
import { TopbarV2 } from '@/components/v2/TopbarV2';
import {
  IconReport, IconSparkles, IconBarChart, IconPieChart, IconFilter,
  IconDownload, IconRefresh, IconChevronLeft, IconChevronRight,
  IconAlertTriangle, IconCheck, IconSearch,
} from '@/components/ui/Icons';
import { FieldLabel, TextInput, Select, DateRange } from '@/components/ui/FormFields';
import {
  PROVIDER_TYPES, RELATIONSHIPS, DISPENSER_CLASSES, SERVICES,
  ORDER_BY_OPTIONS, LANGUAGES, PARENT_ORGS,
} from '@/lib/filter-options';
import { AgentChat } from '@/components/ui/AgentChat';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts';

/* ═══════════════════════════════════════════════════════════════════
   TABS
   ═══════════════════════════════════════════════════════════════════ */
const TABS = ['OnDemand Query', 'AI Report Builder', 'Analytics'] as const;
type Tab = (typeof TABS)[number];

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA — OnDemand Query Results
   ═══════════════════════════════════════════════════════════════════ */
const QUERY_RESULTS = [
  { dba: 'CareRx Pharmacy #0842',        ncpdp: '1234567', rel: 'CVS CAREMARK',    city: 'Dallas',        state: 'TX', dispenser: 'Chain Pharmacy',      open: '01/15/2019', status: 'Active' },
  { dba: 'Valley Rx Solutions',           ncpdp: '3987234', rel: 'EXPRESS SCRIPTS', city: 'Phoenix',       state: 'AZ', dispenser: 'Independent Pharmacy', open: '06/03/2017', status: 'Active' },
  { dba: 'Sunrise Compounding Center',    ncpdp: '5021847', rel: 'OPTUMRX',        city: 'Miami',         state: 'FL', dispenser: 'Specialty Pharmacy',    open: '11/22/2020', status: 'Active' },
  { dba: 'Bayou Pharmacy Partners',       ncpdp: '6789013', rel: 'HUMANA PHARMACY',city: 'New Orleans',   state: 'LA', dispenser: 'Independent Pharmacy', open: '03/08/2016', status: 'Inactive' },
  { dba: 'Mountain View Clinical Rx',     ncpdp: '9012847', rel: 'CIGNA HEALTHCARE',city: 'Denver',       state: 'CO', dispenser: 'Specialty Pharmacy',    open: '09/14/2021', status: 'Active' },
  { dba: 'Lakeside Mail Order Pharmacy',  ncpdp: '2345891', rel: 'MEDCO HEALTH',   city: 'Chicago',       state: 'IL', dispenser: 'Mail Service Pharmacy', open: '02/19/2018', status: 'Active' },
  { dba: 'Pacific Health Compounding',    ncpdp: '4567123', rel: 'WALGREENS',      city: 'San Diego',     state: 'CA', dispenser: 'Specialty Pharmacy',    open: '07/30/2019', status: 'Active' },
  { dba: 'Northeast LTC Pharmacy',        ncpdp: '7890234', rel: 'CVS CAREMARK',   city: 'Boston',        state: 'MA', dispenser: 'Long-Term Care Pharmacy', open: '04/12/2015', status: 'Active' },
  { dba: 'Heartland Franchise Rx',        ncpdp: '1357924', rel: 'EXPRESS SCRIPTS', city: 'Kansas City',  state: 'MO', dispenser: 'Franchise Pharmacy',   open: '08/25/2020', status: 'Active' },
  { dba: 'Capitol Infusion Services',     ncpdp: '2468013', rel: 'OPTUMRX',        city: 'Sacramento',    state: 'CA', dispenser: 'Specialty Pharmacy',    open: '12/01/2021', status: 'Active' },
  { dba: 'Tri-State Government Pharmacy', ncpdp: '3692581', rel: 'AETNA BETTER HEALTH', city: 'Trenton', state: 'NJ', dispenser: 'Government Pharmacy',  open: '05/17/2014', status: 'Active' },
  { dba: 'Coastal Chain Pharmacy #12',    ncpdp: '4813726', rel: 'WALGREENS',      city: 'Charleston',    state: 'SC', dispenser: 'Chain Pharmacy',       open: '10/09/2022', status: 'Active' },
  { dba: 'Redwood Alternate Dispensing',  ncpdp: '5924837', rel: 'CIGNA HEALTHCARE', city: 'Portland',   state: 'OR', dispenser: 'Alternate Dispensing Site', open: '01/28/2023', status: 'Active' },
  { dba: 'SunHealth Nuclear Pharmacy',    ncpdp: '6035948', rel: 'HUMANA PHARMACY',city: 'Houston',       state: 'TX', dispenser: 'Specialty Pharmacy',    open: '06/14/2017', status: 'Inactive' },
  { dba: 'Great Plains Pharmacy Group',   ncpdp: '7146059', rel: 'UNITED HEALTH GROUP', city: 'Omaha',   state: 'NE', dispenser: 'Independent Pharmacy', open: '03/22/2019', status: 'Active' },
];

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA — Analytics Charts
   ═══════════════════════════════════════════════════════════════════ */
const NET_CHANGE_DATA = [
  { month: 'Oct', added: 412, closed: -98,  net: 314  },
  { month: 'Nov', added: 387, closed: -124, net: 263  },
  { month: 'Dec', added: 291, closed: -87,  net: 204  },
  { month: 'Jan', added: 448, closed: -103, net: 345  },
  { month: 'Feb', added: 523, closed: -112, net: 411  },
  { month: 'Mar', added: 489, closed: -177, net: 312  },
];

const PHARMACY_TYPE_DATA = [
  { name: 'Chain',       value: 28412, pct: 41.6 },
  { name: 'Independent', value: 18247, pct: 26.7 },
  { name: 'Specialty',   value: 9148,  pct: 13.4 },
  { name: 'Mail Order',  value: 5421,  pct: 7.9  },
  { name: 'LTC',         value: 3892,  pct: 5.7  },
  { name: 'Other',       value: 3127,  pct: 4.6  },
];
const PIE_COLORS = ['#005C8D', '#005C8D', '#EC4899', '#F59E0B', '#76C799', '#94A3B8'];

const GROWTH_TREND = [
  { month: 'Apr 25', total: 63200 }, { month: 'May 25', total: 63800 },
  { month: 'Jun 25', total: 64100 }, { month: 'Jul 25', total: 64600 },
  { month: 'Aug 25', total: 65100 }, { month: 'Sep 25', total: 65500 },
  { month: 'Oct 25', total: 65800 }, { month: 'Nov 25', total: 66100 },
  { month: 'Dec 25', total: 66700 }, { month: 'Jan 26', total: 67200 },
  { month: 'Feb 26', total: 67800 }, { month: 'Mar 26', total: 81500 },
];

const COVERAGE_BY_STATE = [
  { state: 'California',    count: 6842, pct: 10.0, compliant: 96.2, change: '+48' },
  { state: 'Texas',         count: 5921, pct: 8.7,  compliant: 94.1, change: '+37' },
  { state: 'Florida',       count: 4813, pct: 7.1,  compliant: 93.8, change: '+29' },
  { state: 'New York',      count: 4502, pct: 6.6,  compliant: 97.1, change: '+18' },
  { state: 'Pennsylvania',  count: 3248, pct: 4.8,  compliant: 95.4, change: '+22' },
  { state: 'Illinois',      count: 3102, pct: 4.5,  compliant: 94.9, change: '+14' },
  { state: 'Ohio',          count: 2847, pct: 4.2,  compliant: 92.3, change: '+11' },
  { state: 'Georgia',       count: 2519, pct: 3.7,  compliant: 91.7, change: '+26' },
];

const COMPLIANCE_TARGETS = [
  { metric: 'DEA Registration',      target: '99%', current: '98.2%', status: 'on-track' },
  { metric: 'State License Valid',    target: '99%', current: '97.1%', status: 'at-risk' },
  { metric: 'NPI Verification',      target: '100%', current: '99.8%', status: 'on-track' },
  { metric: 'Accreditation Current',  target: '95%', current: '93.4%', status: 'at-risk' },
  { metric: 'FWA Attestation',       target: '98%', current: '96.9%', status: 'on-track' },
];

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA — AI Report Builder Preview
   ═══════════════════════════════════════════════════════════════════ */
const REPORT_STATS = [
  { label: 'Total Expiring', value: '1,247', color: '#EF4444' },
  { label: 'Within 30 Days', value: '312', color: '#F59E0B' },
  { label: 'States Affected', value: '38', color: '#005C8D' },
  { label: 'Networks Impacted', value: '14', color: '#0EA5E9' },
];

const EXPIRING_BY_TYPE = [
  { type: 'DEA Registration', count: 489, pct: 39.2 },
  { type: 'State License',    count: 394, pct: 31.6 },
  { type: 'Accreditation',    count: 218, pct: 17.5 },
  { type: 'NPI Verification', count: 146, pct: 11.7 },
];

const AT_RISK_STATES = [
  { state: 'California', expiring: 142, critical: 38, networks: 6 },
  { state: 'Texas',      expiring: 118, critical: 29, networks: 5 },
  { state: 'Florida',    expiring: 97,  critical: 24, networks: 4 },
  { state: 'New York',   expiring: 89,  critical: 21, networks: 7 },
  { state: 'Ohio',       expiring: 74,  critical: 18, networks: 3 },
];

/* ═══════════════════════════════════════════════════════════════════
   US STATES for dropdown
   ═══════════════════════════════════════════════════════════════════ */
const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('OnDemand Query');
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState<'7d' | '30d' | 'quarter' | 'year'>('30d');

  /* Filter state for OnDemand Query */
  const [filters, setFilters] = useState({
    relType: '', providerType: '', language: '', groupKeys: '',
    paymentCenter: '', city: '', relName: '', parentOrg: '',
    state: '', dispenserClass: '', services: '', zip: '',
    countyCode: '', is24_7: false, msa: '', pmsa: '',
    includeInactive: false, orderBy: '', status: 'Active',
    relStartFrom: '', relStartTo: '', relEndFrom: '', relEndTo: '',
    openFrom: '', openTo: '', closeFrom: '', closeTo: '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilters(f => ({ ...f, [k]: e.target.value }));
  const setCheck = (k: string) => () =>
    setFilters(f => ({ ...f, [k]: !(f as Record<string, unknown>)[k] }));

  function handleReset() {
    setFilters({
      relType: '', providerType: '', language: '', groupKeys: '',
      paymentCenter: '', city: '', relName: '', parentOrg: '',
      state: '', dispenserClass: '', services: '', zip: '',
      countyCode: '', is24_7: false, msa: '', pmsa: '',
      includeInactive: false, orderBy: '', status: 'Active',
      relStartFrom: '', relStartTo: '', relEndFrom: '', relEndTo: '',
      openFrom: '', openTo: '', closeFrom: '', closeTo: '',
    });
    setSearched(false);
  }

  const totalPages = 4;

  return (
    <>
      <TopbarV2 title="Reports" actions={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="v2b v2b-g" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
            <IconDownload size={12}/> Export
          </button>
        </div>
      }/>

      <main style={{ padding: '20px 24px 40px', minHeight: 'calc(100vh - 52px)' }}>

        {/*  Tab Bar  */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid var(--v2-border)' }}>
          {TABS.map(t => (
            <button
              key={t}
              className="v2-tab"
              onClick={() => { setActiveTab(t); }}
              style={{
                padding: '10px 20px', fontSize: 13, fontWeight: activeTab === t ? 600 : 400,
                color: activeTab === t ? 'var(--v2-primary)' : 'var(--v2-text-3)',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: activeTab === t ? '2px solid var(--v2-primary)' : '2px solid transparent',
                transition: 'color .15s, border-color .15s',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {t === 'OnDemand Query' && <IconFilter size={13}/>}
              {t === 'AI Report Builder' && <IconSparkles size={13} color={activeTab === t ? '#005C8D' : '#94A3B8'}/>}
              {t === 'Analytics' && <IconBarChart size={13}/>}
              {t}
            </button>
          ))}
        </div>

        {/* ═════════════════════════════════════════════════════════════
           TAB 1 — OnDemand Query
           ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'OnDemand Query' && (
          <div>
            {/* Filter Form */}
            <div className="v2c" style={{ padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <IconFilter size={15} color="var(--v2-primary)"/>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>Query Filters</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 18px' }}>
                {/* Row 1 */}
                <div>
                  <FieldLabel>Relationship Type</FieldLabel>
                  <Select value={filters.relType} onChange={set('relType')}>
                    <option value="">All</option>
                    {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Provider Type</FieldLabel>
                  <Select value={filters.providerType} onChange={set('providerType')}>
                    <option value="">All</option>
                    {PROVIDER_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Languages</FieldLabel>
                  <Select value={filters.language} onChange={set('language')}>
                    <option value="">All</option>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Group Keys</FieldLabel>
                  <TextInput placeholder="Enter group keys..." value={filters.groupKeys} onChange={set('groupKeys')}/>
                </div>

                {/* Row 2 */}
                <div>
                  <FieldLabel>Payment Center</FieldLabel>
                  <TextInput placeholder="Payment center..." value={filters.paymentCenter} onChange={set('paymentCenter')}/>
                </div>
                <div>
                  <FieldLabel>City</FieldLabel>
                  <TextInput placeholder="City..." value={filters.city} onChange={set('city')}/>
                </div>
                <div>
                  <FieldLabel>Relationship Name</FieldLabel>
                  <TextInput placeholder="Relationship name..." value={filters.relName} onChange={set('relName')}/>
                </div>
                <div>
                  <FieldLabel>Parent Organization</FieldLabel>
                  <Select value={filters.parentOrg} onChange={set('parentOrg')}>
                    <option value="">All</option>
                    {PARENT_ORGS.map(p => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </div>

                {/* Row 3 */}
                <div>
                  <FieldLabel>State</FieldLabel>
                  <Select value={filters.state} onChange={set('state')}>
                    <option value="">All</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Dispenser Class</FieldLabel>
                  <Select value={filters.dispenserClass} onChange={set('dispenserClass')}>
                    <option value="">All</option>
                    {DISPENSER_CLASSES.map(d => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Services</FieldLabel>
                  <Select value={filters.services} onChange={set('services')}>
                    <option value="">All</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>ZIP</FieldLabel>
                  <TextInput placeholder="ZIP code..." value={filters.zip} onChange={set('zip')}/>
                </div>

                {/* Row 4 */}
                <div>
                  <FieldLabel>County Code</FieldLabel>
                  <TextInput placeholder="County code..." value={filters.countyCode} onChange={set('countyCode')}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 22 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--v2-text-2)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filters.is24_7} onChange={setCheck('is24_7')} style={{ accentColor: 'var(--v2-primary)' }}/>
                    24/7
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--v2-text-2)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={filters.includeInactive} onChange={setCheck('includeInactive')} style={{ accentColor: 'var(--v2-primary)' }}/>
                    Include Inactive
                  </label>
                </div>
                <div>
                  <FieldLabel>MSA</FieldLabel>
                  <TextInput placeholder="MSA..." value={filters.msa} onChange={set('msa')}/>
                </div>
                <div>
                  <FieldLabel>PMSA</FieldLabel>
                  <TextInput placeholder="PMSA..." value={filters.pmsa} onChange={set('pmsa')}/>
                </div>
              </div>

              {/* Date Ranges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 18px', marginTop: 14 }}>
                <DateRange label="Relationship Start" fromValue={filters.relStartFrom} toValue={filters.relStartTo} onFromChange={set('relStartFrom')} onToChange={set('relStartTo')}/>
                <DateRange label="Relationship End" fromValue={filters.relEndFrom} toValue={filters.relEndTo} onFromChange={set('relEndFrom')} onToChange={set('relEndTo')}/>
                <DateRange label="Open Date" fromValue={filters.openFrom} toValue={filters.openTo} onFromChange={set('openFrom')} onToChange={set('openTo')}/>
                <DateRange label="Close Date" fromValue={filters.closeFrom} toValue={filters.closeTo} onFromChange={set('closeFrom')} onToChange={set('closeTo')}/>
              </div>

              {/* Order By + Status */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 18px', marginTop: 14 }}>
                <div>
                  <FieldLabel>Order By</FieldLabel>
                  <Select value={filters.orderBy} onChange={set('orderBy')}>
                    <option value="">Default</option>
                    {ORDER_BY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={filters.status} onChange={set('status')}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="All">All</option>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                <button className="v2b v2b-p" style={{ padding: '8px 28px', fontSize: 13, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => { setSearched(true); setPage(1); }}>
                  <IconSearch size={13} color="#fff"/> View Report
                </button>
                <button className="v2b v2b-g" style={{ padding: '8px 28px', fontSize: 13, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }} onClick={handleReset}>
                  <IconRefresh size={13}/> Reset
                </button>
              </div>
            </div>

            {/* Results Table */}
            {searched && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)' }}>
                    Results <span style={{ fontWeight: 400, color: 'var(--v2-text-3)' }}>— 15 of 2,847 records</span>
                  </div>
                  <button className="v2b v2b-g" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IconDownload size={11}/> Export CSV
                  </button>
                </div>
                <div className="v2-tw">
                  <table>
                    <thead>
                      <tr>
                        <th>Pharmacy DBA Name</th>
                        <th>NCPDP Provider ID</th>
                        <th>Rel. Type</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Dispenser Class</th>
                        <th>Open Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {QUERY_RESULTS.map(r => (
                        <tr key={r.ncpdp}>
                          <td style={{ fontWeight: 500, fontSize: 12.5 }}>{r.dba}</td>
                          <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: 'var(--v2-primary)' }}>{r.ncpdp}</td>
                          <td style={{ fontSize: 12 }}>{r.rel}</td>
                          <td style={{ fontSize: 12 }}>{r.city}</td>
                          <td style={{ fontSize: 12, fontWeight: 500 }}>{r.state}</td>
                          <td style={{ fontSize: 12 }}>{r.dispenser}</td>
                          <td style={{ fontSize: 12, color: 'var(--v2-text-3)' }}>{r.open}</td>
                          <td>
                            <span className={r.status === 'Active' ? 'v2g v2g-ok' : 'v2g v2g-err'}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 16 }}>
                  <button
                    className="v2b v2b-g"
                    style={{ padding: '5px 10px', fontSize: 11, borderRadius: 6 }}
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    <IconChevronLeft size={12}/>
                  </button>
                  {[1, 2, 3, 4].map(p => (
                    <button
                      key={p}
                      className={p === page ? 'v2b v2b-p' : 'v2b v2b-g'}
                      style={{ padding: '5px 12px', fontSize: 11, borderRadius: 6, minWidth: 32 }}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="v2b v2b-g"
                    style={{ padding: '5px 10px', fontSize: 11, borderRadius: 6 }}
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    <IconChevronRight size={12}/>
                  </button>
                  <span style={{ fontSize: 11, color: 'var(--v2-text-3)', marginLeft: 8 }}>
                    Page {page} of {totalPages}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
           TAB 2 — AI Report Builder
           ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'AI Report Builder' && (
          <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 140px)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--v2-border)' }}>

            {/* Left: Agent Chat */}
            <div style={{ width: '42%', minWidth: 340, borderRight: '1px solid var(--v2-border)', display: 'flex', flexDirection: 'column' }}>
              <AgentChat
                agentName="Report Builder"
                agentId="AGT-25"
                gradient="linear-gradient(135deg, #004870, #A855F7)"
                suggestions={[
                  'Generate Q1 2026 credential expiry report',
                  'Show pharmacy network growth by state',
                  'Build compliance summary for all networks',
                  'Create at-risk pharmacy report for DEA expirations',
                ]}
                welcomeMessage="Hi! I'm your AI Report Builder. I can generate custom reports from your NCPDP data — credential audits, network analysis, compliance summaries, and more. What would you like to build?"
                getBotReply={(msg: string) => {
                  if (msg.toLowerCase().includes('credential') || msg.toLowerCase().includes('expir')) {
                    return 'Report generated: Q1 2026 Credential Expiry Report\n\nFound 1,247 credentials expiring across 38 states, affecting 14 networks.\n\n312 are critical (within 30 days). I\'ve populated the preview panel with the full breakdown by type and at-risk states.';
                  }
                  if (msg.toLowerCase().includes('growth') || msg.toLowerCase().includes('network')) {
                    return 'Analyzed network growth data across all 50 states.\n\nNet pharmacy additions: +1,849 over the last 6 months. Top growth states: CA (+48), TX (+37), FL (+29).\n\nThe preview panel shows the full state-by-state breakdown.';
                  }
                  return `Analyzed 81,500 pharmacy records across 50 states.\nBuilding report for: "${msg.slice(0, 80)}${msg.length > 80 ? '...' : ''}".\n\nThe preview panel has been updated with the results.`;
                }}
                hideHeader={false}
                fluid
              />
            </div>

            {/* Right: Report Preview */}
            <div style={{ flex: 1, overflowY: 'auto', background: 'var(--v2-surface-2)', padding: '24px 28px' }}>
              {/* Report Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#004870', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
                    AI-Generated Report
                  </div>
                  <h2 className="v2-title" style={{ fontSize: 18, marginBottom: 4 }}>Q1 2026 Credential Expiry Report</h2>
                  <div className="v2-sub">Generated Mar 31, 2026 at 2:45 PM — 81,500 records analyzed</div>
                </div>
                <button className="v2b v2b-g" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <IconDownload size={11}/> Download PDF
                </button>
              </div>

              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                {REPORT_STATS.map(s => (
                  <div key={s.label} className="v2c" style={{ padding: '16px 18px', background: '#fff' }}>
                    <div className="v2-label" style={{ marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: s.color, letterSpacing: '-.5px' }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Expiring by Type */}
              <div className="v2c" style={{ padding: '18px 22px', marginBottom: 20, background: '#fff' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 14 }}>Expiring by Type</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {EXPIRING_BY_TYPE.map(item => (
                    <div key={item.type}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--v2-text)' }}>{item.type}</span>
                        <span style={{ fontSize: 12, color: 'var(--v2-text-3)' }}>{item.count} ({item.pct}%)</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: 'var(--v2-surface-2)' }}>
                        <div style={{ height: '100%', borderRadius: 3, width: `${item.pct}%`, background: item.pct > 30 ? '#EF4444' : item.pct > 15 ? '#F59E0B' : '#005C8D', transition: 'width .3s' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* At-Risk States Table */}
              <div className="v2c" style={{ padding: '18px 22px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>At-Risk States</div>
                  <span className="v2g v2g-err" style={{ fontSize: 10.5 }}>
                    <IconAlertTriangle size={11}/> 5 states flagged
                  </span>
                </div>
                <div className="v2-tw">
                  <table>
                    <thead>
                      <tr>
                        <th>State</th>
                        <th>Expiring</th>
                        <th>Critical (&lt;30d)</th>
                        <th>Networks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {AT_RISK_STATES.map(r => (
                        <tr key={r.state}>
                          <td style={{ fontWeight: 500, fontSize: 12.5 }}>{r.state}</td>
                          <td style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>{r.expiring}</td>
                          <td style={{ fontSize: 12 }}>
                            <span className="v2g v2g-err" style={{ fontSize: 10.5 }}>{r.critical}</span>
                          </td>
                          <td style={{ fontSize: 12 }}>{r.networks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
           TAB 3 — Analytics
           ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'Analytics' && (
          <div>
            {/* Period Selector */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: 'var(--v2-surface-2)', borderRadius: 8, padding: 3, width: 'fit-content' }}>
              {([['7d', '7 Days'], ['30d', '30 Days'], ['quarter', 'Quarter'], ['year', 'Year']] as const).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setPeriod(k)}
                  style={{
                    padding: '7px 18px', fontSize: 12, fontWeight: period === k ? 600 : 400,
                    color: period === k ? 'var(--v2-primary)' : 'var(--v2-text-3)',
                    background: period === k ? '#fff' : 'transparent',
                    border: period === k ? '1px solid var(--v2-border)' : '1px solid transparent',
                    borderRadius: 6, cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 3 Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 22 }}>

              {/* Bar Chart — Net Pharmacy Changes */}
              <div className="v2c" style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 4 }}>Net Pharmacy Changes</div>
                <div className="v2-sub" style={{ marginBottom: 12 }}>Monthly additions vs closures</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={NET_CHANGE_DATA} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--v2-border-lt)" vertical={false}/>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}/>
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
                    />
                    <Bar dataKey="added" fill="#76C799" radius={[3, 3, 0, 0]} name="Added"/>
                    <Bar dataKey="net" fill="#005C8D" radius={[3, 3, 0, 0]} name="Net"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart — Pharmacy Type Distribution */}
              <div className="v2c" style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 4 }}>Pharmacy Type Distribution</div>
                <div className="v2-sub" style={{ marginBottom: 12 }}>By dispenser class</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={PHARMACY_TYPE_DATA}
                      cx="50%" cy="50%"
                      innerRadius={45} outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {PHARMACY_TYPE_DATA.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: unknown, name: unknown) => [`${Number(val).toLocaleString()} (${PHARMACY_TYPE_DATA.find(d => d.name === String(name))?.pct ?? 0}%)`, String(name)]}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 11, color: '#64748B' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Area Chart — Network Growth Trend */}
              <div className="v2c" style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 4 }}>Network Growth Trend</div>
                <div className="v2-sub" style={{ marginBottom: 12 }}>Total active pharmacies — 12 months</div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={GROWTH_TREND}>
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#005C8D" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#005C8D" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--v2-border-lt)" vertical={false}/>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false}/>
                    <YAxis domain={[62000, 69000]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false}/>
                    <Tooltip
                      formatter={(val: unknown) => [Number(val).toLocaleString(), 'Pharmacies']}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#005C8D" strokeWidth={2} fill="url(#growthGrad)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Coverage by State + Compliance Targets */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

              {/* Coverage by State */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>Coverage by State</div>
                  <span className="v2-sub">Top 8 states by pharmacy count</span>
                </div>
                <div className="v2-tw">
                  <table>
                    <thead>
                      <tr>
                        <th>State</th>
                        <th>Pharmacies</th>
                        <th>% of Total</th>
                        <th>Compliant</th>
                        <th>Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COVERAGE_BY_STATE.map(s => (
                        <tr key={s.state}>
                          <td style={{ fontWeight: 500, fontSize: 12.5 }}>{s.state}</td>
                          <td style={{ fontSize: 12 }}>{s.count.toLocaleString()}</td>
                          <td style={{ fontSize: 12, color: 'var(--v2-text-3)' }}>{s.pct}%</td>
                          <td>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
                              color: s.compliant >= 95 ? 'var(--v2-green)' : '#D97706',
                              background: s.compliant >= 95 ? 'var(--v2-green-bg)' : '#FFFBEB',
                            }}>
                              {s.compliant}%
                            </span>
                          </td>
                          <td style={{ fontSize: 12, color: 'var(--v2-green)', fontWeight: 500 }}>{s.change}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Compliance Targets */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>Compliance Targets</div>
                  <span className="v2-sub">Q1 2026 performance</span>
                </div>
                <div className="v2c" style={{ padding: 0, overflow: 'hidden' }}>
                  {COMPLIANCE_TARGETS.map((t, i) => (
                    <div
                      key={t.metric}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                        borderBottom: i < COMPLIANCE_TARGETS.length - 1 ? '1px solid var(--v2-border-lt)' : 'none',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                        background: t.status === 'on-track' ? 'var(--v2-green-bg)' : '#FFFBEB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {t.status === 'on-track'
                          ? <IconCheck size={14} color="var(--v2-green)"/>
                          : <IconAlertTriangle size={14} color="#D97706"/>
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--v2-text)' }}>{t.metric}</div>
                        <div style={{ fontSize: 11, color: 'var(--v2-text-3)', marginTop: 1 }}>Target: {t.target}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: t.status === 'on-track' ? 'var(--v2-green)' : '#D97706' }}>
                          {t.current}
                        </div>
                        <span className={t.status === 'on-track' ? 'v2g v2g-ok' : 'v2g v2g-w'} style={{ fontSize: 10 }}>
                          {t.status === 'on-track' ? 'On Track' : 'At Risk'}
                        </span>
                      </div>
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
