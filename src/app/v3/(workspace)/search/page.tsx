'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/v3/TopbarV3';
import {
  IconSearch, IconSend, IconChevronRight, IconChevronDown, IconFilter,
  IconDownload, IconMap, IconStore, IconSparkles, IconX, IconCheck,
  IconReport, IconShield, IconGlobe, IconRefresh,
} from '@/components/ui/Icons';
import { FieldLabel, TextInput, Select, MultiSelect, DateRange } from '@/components/ui/FormFields';
import {
  DISPENSER_CLASSES, PROVIDER_TYPES, US_STATES, SEARCH_BY_OPTIONS,
  STATUS_OPTIONS, ORDER_BY_OPTIONS, SERVICES, RELATIONSHIPS,
} from '@/lib/filter-options';

// -- Avatar colors for pharmacy initials
const AVATAR_COLORS = [
  '#6366F1','#8B5CF6','#EC4899','#F43F5E','#F97316','#EAB308',
  '#22C55E','#14B8A6','#06B6D4','#3B82F6','#A855F7','#D946EF',
];

// -- Pharmacy data
const PHARMACIES = [
  { id: '0542187', name: 'Valley Care Pharmacy', city: 'Phoenix', state: 'AZ', type: 'Community', dea: 'Active', npi: '1234567890', phone: '(602) 555-0142', address: '1420 N Central Ave', zip: '85004', parent: 'Independent', open: '03/15/2008' },
  { id: '0891234', name: 'Sunrise Health Rx', city: 'San Diego', state: 'CA', type: 'Specialty', dea: 'Active', npi: '2345678901', phone: '(619) 555-0198', address: '8880 Rio San Diego Dr', zip: '92108', parent: 'CVS Health', open: '11/22/2012' },
  { id: '1032456', name: 'MedExpress Pharmacy', city: 'Dallas', state: 'TX', type: 'Mail Service', dea: 'Expiring', npi: '3456789012', phone: '(214) 555-0265', address: '3200 Main St', zip: '75226', parent: 'Optum Rx', open: '06/01/2015' },
  { id: '0673891', name: 'PharmaPlus Solutions', city: 'Chicago', state: 'IL', type: 'Community', dea: 'Active', npi: '4567890123', phone: '(312) 555-0334', address: '500 W Madison St', zip: '60661', parent: 'Walgreens', open: '01/10/2005' },
  { id: '1245678', name: 'CareFirst Rx', city: 'Miami', state: 'FL', type: 'Long-Term Care', dea: 'Active', npi: '5678901234', phone: '(305) 555-0411', address: '200 S Biscayne Blvd', zip: '33131', parent: 'Independent', open: '09/18/2018' },
  { id: '0987654', name: 'Northwest Compounding', city: 'Seattle', state: 'WA', type: 'Compounding', dea: 'Expired', npi: '6789012345', phone: '(206) 555-0523', address: '4001 Aurora Ave N', zip: '98103', parent: 'Independent', open: '04/05/2010' },
  { id: '0456321', name: 'Heritage Drug Store', city: 'Boston', state: 'MA', type: 'Community', dea: 'Active', npi: '7890123456', phone: '(617) 555-0688', address: '75 State St', zip: '02109', parent: 'Rite Aid', open: '08/22/1998' },
  { id: '1178432', name: 'Pacific Specialty Rx', city: 'Portland', state: 'OR', type: 'Specialty', dea: 'Active', npi: '8901234567', phone: '(503) 555-0741', address: '1022 SW Salmon St', zip: '97205', parent: 'Cigna Healthcare', open: '02/14/2020' },
  { id: '0334567', name: 'Central Infusion Care', city: 'Denver', state: 'CO', type: 'Home Infusion', dea: 'Active', npi: '9012345678', phone: '(720) 555-0812', address: '1700 Broadway', zip: '80290', parent: 'Independent', open: '07/30/2016' },
  { id: '0765432', name: 'Greenfield Pharmacy', city: 'Atlanta', state: 'GA', type: 'Community', dea: 'Expiring', npi: '0123456789', phone: '(404) 555-0999', address: '3393 Peachtree Rd NE', zip: '30326', parent: 'Independent', open: '12/01/2011' },
  { id: '1456789', name: 'Metro Health Drugs', city: 'New York', state: 'NY', type: 'Community', dea: 'Active', npi: '1122334455', phone: '(212) 555-1020', address: '420 Lexington Ave', zip: '10170', parent: 'CVS Health', open: '05/19/2003' },
  { id: '0298765', name: 'SunCoast Rx Center', city: 'Tampa', state: 'FL', type: 'Specialty', dea: 'Active', npi: '2233445566', phone: '(813) 555-1155', address: '100 N Tampa St', zip: '33602', parent: 'Walgreens', open: '10/08/2017' },
];

// -- Ownership changes data
const OWNERSHIP_CHANGES_PROCESSED = [
  { date: '03/22/2026', oldName: 'Smith Family Pharmacy', oldId: '0542100', newName: 'Rite Aid #4421', newId: '0542100', state: 'AZ', status: 'Completed' },
  { date: '03/18/2026', oldName: 'Quick Care Rx', oldId: '0891200', newName: 'CVS Pharmacy #8812', newId: '0891200', state: 'CA', status: 'Completed' },
  { date: '03/15/2026', oldName: 'Village Drug', oldId: '1032400', newName: 'Walgreens #1190', newId: '1032400', state: 'TX', status: 'Completed' },
  { date: '03/10/2026', oldName: 'Elm Street Pharmacy', oldId: '0673800', newName: 'MedPoint Rx', newId: '0673800', state: 'IL', status: 'Completed' },
  { date: '03/05/2026', oldName: 'Harbor Health Rx', oldId: '1245600', newName: 'Optum Rx #3301', newId: '1245600', state: 'FL', status: 'Completed' },
];

const OWNERSHIP_CHANGES_UNPROCESSED = [
  { date: '03/28/2026', oldName: 'Pine Valley Drugs', oldId: '0987600', newName: 'Pending Review', newId: 'TBD', state: 'WA', status: 'Under Review' },
  { date: '03/26/2026', oldName: 'Lakeside Pharmacy', oldId: '0456300', newName: 'Pending Review', newId: 'TBD', state: 'MA', status: 'Under Review' },
  { date: '03/25/2026', oldName: 'Downtown Rx Plus', oldId: '1178400', newName: 'Pending Review', newId: 'TBD', state: 'OR', status: 'Submitted' },
  { date: '03/24/2026', oldName: 'Country Health Drugs', oldId: '0334500', newName: 'Pending Review', newId: 'TBD', state: 'CO', status: 'Under Review' },
  { date: '03/23/2026', oldName: 'Meadow Creek Rx', oldId: '0765400', newName: 'Pending Review', newId: 'TBD', state: 'GA', status: 'Submitted' },
];

// -- Geographic adequacy data
const GEO_STATS = [
  { label: 'States Analyzed', value: '50', sub: 'All US states', color: '#6366F1' },
  { label: 'CMS Adequate', value: '44', sub: '88% meeting criteria', color: '#059669' },
  { label: 'Coverage Gaps', value: '12', sub: 'Counties below threshold', color: '#D97706' },
  { label: 'Avg Coverage', value: '94.2%', sub: '+1.3% vs last quarter', color: '#3B82F6' },
];

const GEO_TABLE = [
  { state: 'California', pharmacies: 8247, coverage: 98.2, gap: 3, status: 'Adequate' },
  { state: 'Texas', pharmacies: 6891, coverage: 96.8, gap: 5, status: 'Adequate' },
  { state: 'Florida', pharmacies: 5432, coverage: 97.1, gap: 2, status: 'Adequate' },
  { state: 'New York', pharmacies: 4987, coverage: 99.1, gap: 0, status: 'Adequate' },
  { state: 'Illinois', pharmacies: 3654, coverage: 95.4, gap: 4, status: 'Adequate' },
  { state: 'Pennsylvania', pharmacies: 3421, coverage: 93.8, gap: 6, status: 'Review' },
  { state: 'Ohio', pharmacies: 2987, coverage: 91.2, gap: 8, status: 'Review' },
  { state: 'Georgia', pharmacies: 2876, coverage: 94.6, gap: 3, status: 'Adequate' },
  { state: 'Michigan', pharmacies: 2654, coverage: 89.7, gap: 11, status: 'Gap' },
  { state: 'North Carolina', pharmacies: 2543, coverage: 92.3, gap: 7, status: 'Review' },
  { state: 'Arizona', pharmacies: 1987, coverage: 96.5, gap: 2, status: 'Adequate' },
  { state: 'Washington', pharmacies: 1876, coverage: 97.8, gap: 1, status: 'Adequate' },
];

// -- Mode pills
const MODES = [
  { label: 'Search', icon: IconSearch, color: '#6366F1' },
  { label: 'Reports', icon: IconReport, color: '#059669' },
  { label: 'Compliance', icon: IconShield, color: '#DC2626' },
];

// -- Tabs
const TABS = ['All Results', 'Advanced Filters', 'Geographic', 'Ownership Changes', 'Batch Download'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [activeMode, setActiveMode] = useState(0);
  const [selectedPharmacy, setSelectedPharmacy] = useState<typeof PHARMACIES[0] | null>(null);

  // Advanced filters state
  const [searchBy, setSearchBy] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterClasses, setFilterClasses] = useState<string[]>([]);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);

  // Ownership sub-tab
  const [ownershipTab, setOwnershipTab] = useState<'processed' | 'unprocessed'>('processed');

  // Batch download state
  const [batchSearch, setBatchSearch] = useState('');
  const [batchSelected, setBatchSelected] = useState<string[]>([]);

  function deaBadge(status: string) {
    if (status === 'Active') return 'v3-badge v3-badge-green';
    if (status === 'Expiring') return 'v3-badge v3-badge-amber';
    return 'v3-badge v3-badge-red';
  }

  function geoStatusBadge(status: string) {
    if (status === 'Adequate') return 'v3-badge v3-badge-green';
    if (status === 'Review') return 'v3-badge v3-badge-amber';
    return 'v3-badge v3-badge-red';
  }

  function toggleBatch(id: string) {
    if (batchSelected.includes(id)) {
      setBatchSelected(batchSelected.filter(x => x !== id));
    } else if (batchSelected.length < 50) {
      setBatchSelected([...batchSelected, id]);
    }
  }

  return (
    <>
      <Topbar
        title="Search"
        subtitle={`${PHARMACIES.length.toLocaleString()} results found`}
      />
      <main style={{ padding: '0 24px 48px' }}>

        {/* ============================================================ */}
        {/* AI SEARCH HERO                                               */}
        {/* ============================================================ */}
        <div style={{ maxWidth: 740, margin: '0 auto', paddingTop: 44, paddingBottom: 32, textAlign: 'center' }}>
          {/* Sparkle icon */}
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg,#6366F1,#A78BFA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 4px 20px rgba(99,102,241,.2)',
          }}>
            <IconSparkles size={24} color="#fff"/>
          </div>

          <h1 style={{
            fontSize: 22, fontWeight: 700, color: 'var(--v3-text)',
            margin: '0 0 6px', letterSpacing: '-.3px', lineHeight: 1.35,
          }}>
            Search the NCPDP Database
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--v3-text-3)', margin: '0 0 24px', lineHeight: 1.5 }}>
            68,247 pharmacies across all 50 states. Ask anything or use filters below.
          </p>

          {/* AI Prompt input */}
          <div className="v3-prompt" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconSparkles size={18} color="var(--v3-accent)"/>
              <input
                className="v3-input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search pharmacies by NCPDP ID, name, city, state, or ask a question..."
                style={{
                  flex: 1, border: 'none', padding: '10px 0',
                  fontSize: 15, background: 'transparent', borderRadius: 0,
                  outline: 'none',
                }}
              />
              <button
                className="v3-btn v3-btn-accent"
                style={{ borderRadius: 12, padding: '10px 18px', flexShrink: 0 }}
              >
                <IconSend size={15}/>
              </button>
            </div>
          </div>

          {/* Mode pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
            {MODES.map((m, idx) => (
              <button
                key={m.label}
                className={`v3-btn ${activeMode === idx ? 'v3-btn-accent' : 'v3-btn-soft'}`}
                onClick={() => setActiveMode(idx)}
                style={{ borderRadius: 20, padding: '6px 16px', fontSize: 12.5 }}
              >
                <m.icon size={13} color={activeMode === idx ? '#fff' : m.color}/>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* TABS                                                         */}
        {/* ============================================================ */}
        <div style={{ borderBottom: '1px solid var(--v3-border)', marginBottom: 24, display: 'flex', gap: 0 }}>
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              className={`v3-tab ${activeTab === idx ? 'active' : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: ALL RESULTS                                           */}
        {/* ============================================================ */}
        {activeTab === 0 && (
          <div style={{ display: 'flex', gap: 20 }}>
            {/* Results list */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PHARMACIES.map((p, idx) => (
                <div
                  key={p.id}
                  className="v3-card v3-card-hover"
                  onClick={() => setSelectedPharmacy(p)}
                  style={{
                    padding: '14px 18px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer',
                    borderLeft: selectedPharmacy?.id === p.id ? '3px solid var(--v3-accent)' : '3px solid transparent',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 700, color: '#fff',
                  }}>
                    {p.name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v3-text)', marginBottom: 2 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--v3-text-3)' }}>
                      {p.city}, {p.state}
                    </div>
                  </div>

                  {/* NCPDP ID */}
                  <div style={{
                    fontFamily: 'monospace', fontSize: 13, fontWeight: 600,
                    color: 'var(--v3-accent)', letterSpacing: '.03em',
                  }}>
                    {p.id}
                  </div>

                  {/* Type badge */}
                  <span className="v3-badge v3-badge-gray">{p.type}</span>

                  {/* DEA badge */}
                  <span className={deaBadge(p.dea)}>DEA: {p.dea}</span>

                  {/* Chevron */}
                  <IconChevronRight size={16} color="var(--v3-text-3)"/>
                </div>
              ))}
            </div>

            {/* Detail slide-in panel */}
            {selectedPharmacy && (
              <div
                className="v3-card"
                style={{
                  width: 380, flexShrink: 0,
                  padding: 0, position: 'sticky', top: 70, alignSelf: 'flex-start',
                  maxHeight: 'calc(100vh - 90px)', overflowY: 'auto',
                }}
              >
                {/* Panel header */}
                <div style={{
                  padding: '20px 22px 16px',
                  borderBottom: '1px solid var(--v3-border)',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: AVATAR_COLORS[PHARMACIES.indexOf(selectedPharmacy) % AVATAR_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 700, color: '#fff',
                  }}>
                    {selectedPharmacy.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--v3-text)', marginBottom: 4 }}>
                      {selectedPharmacy.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className="v3-badge v3-badge-accent">
                        NCPDP: {selectedPharmacy.id}
                      </span>
                      <span className={deaBadge(selectedPharmacy.dea)}>
                        DEA: {selectedPharmacy.dea}
                      </span>
                    </div>
                  </div>
                  <button
                    className="v3-btn v3-btn-ghost"
                    onClick={() => setSelectedPharmacy(null)}
                    style={{ padding: 6, borderRadius: 8 }}
                  >
                    <IconX size={16}/>
                  </button>
                </div>

                {/* Panel body */}
                <div style={{ padding: '18px 22px' }}>
                  {[
                    { l: 'NPI', v: selectedPharmacy.npi },
                    { l: 'Phone', v: selectedPharmacy.phone },
                    { l: 'Address', v: `${selectedPharmacy.address}, ${selectedPharmacy.city}, ${selectedPharmacy.state} ${selectedPharmacy.zip}` },
                    { l: 'Type', v: selectedPharmacy.type },
                    { l: 'Parent Organization', v: selectedPharmacy.parent },
                    { l: 'Open Date', v: selectedPharmacy.open },
                  ].map(row => (
                    <div key={row.l} style={{ marginBottom: 14 }}>
                      <div className="v3-label">{row.l}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--v3-text)' }}>{row.v}</div>
                    </div>
                  ))}

                  <div style={{ borderTop: '1px solid var(--v3-border)', paddingTop: 16, marginTop: 8, display: 'flex', gap: 8 }}>
                    <button className="v3-btn v3-btn-accent" style={{ flex: 1, borderRadius: 10, justifyContent: 'center' }}>
                      <IconReport size={14}/> Full Profile
                    </button>
                    <button className="v3-btn v3-btn-outline" style={{ borderRadius: 10 }}>
                      <IconDownload size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: ADVANCED FILTERS                                      */}
        {/* ============================================================ */}
        {activeTab === 1 && (
          <div>
            <div className="v3-card" style={{ padding: 24, marginBottom: 24 }}>
              {/* Primary Search */}
              <div className="v3-section" style={{ marginBottom: 16 }}>Primary Search</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 16, marginBottom: 28 }}>
                <div>
                  <FieldLabel>Search By</FieldLabel>
                  <Select value={searchBy} onChange={e => setSearchBy(e.target.value)}>
                    <option value="">-- Select --</option>
                    {SEARCH_BY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Search Value</FieldLabel>
                  <TextInput placeholder="Enter value..." value={searchValue} onChange={e => setSearchValue(e.target.value)}/>
                </div>
                <div>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="v3-section" style={{ marginBottom: 16 }}>Location</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
                <div>
                  <FieldLabel>State</FieldLabel>
                  <Select value={filterState} onChange={e => setFilterState(e.target.value)}>
                    <option value="">All States</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>City</FieldLabel>
                  <TextInput placeholder="City name..." value={filterCity} onChange={e => setFilterCity(e.target.value)}/>
                </div>
                <div>
                  <FieldLabel>ZIP Code</FieldLabel>
                  <TextInput placeholder="ZIP code..."/>
                </div>
              </div>

              {/* Classification */}
              <div className="v3-section" style={{ marginBottom: 16 }}>Classification</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                <div>
                  <FieldLabel>Dispenser Class</FieldLabel>
                  <MultiSelect options={DISPENSER_CLASSES} value={filterClasses} onChange={setFilterClasses} height={120}/>
                </div>
                <div>
                  <FieldLabel>Provider Type</FieldLabel>
                  <MultiSelect options={PROVIDER_TYPES} value={filterTypes} onChange={setFilterTypes} height={120}/>
                </div>
              </div>

              {/* Date Ranges */}
              <div className="v3-section" style={{ marginBottom: 16 }}>Date Ranges</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
                <DateRange label="Open Date"/>
                <DateRange label="Close Date"/>
                <DateRange label="Last Updated"/>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="v3-btn v3-btn-soft" style={{ borderRadius: 10 }}>
                  <IconRefresh size={14}/> Reset
                </button>
                <button className="v3-btn v3-btn-accent" style={{ borderRadius: 10 }}>
                  <IconSearch size={14}/> Search
                </button>
              </div>
            </div>

            {/* Results table */}
            <div className="v3-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>NCPDP ID</th>
                    <th>Pharmacy Name</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Type</th>
                    <th>DEA Status</th>
                    <th>NPI</th>
                  </tr>
                </thead>
                <tbody>
                  {PHARMACIES.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--v3-accent)', fontWeight: 600 }}>{p.id}</td>
                      <td style={{ fontWeight: 550 }}>{p.name}</td>
                      <td>{p.city}</td>
                      <td>{p.state}</td>
                      <td><span className="v3-badge v3-badge-gray">{p.type}</span></td>
                      <td><span className={deaBadge(p.dea)}>DEA: {p.dea}</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--v3-text-2)' }}>{p.npi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: GEOGRAPHIC                                            */}
        {/* ============================================================ */}
        {activeTab === 2 && (
          <div>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {GEO_STATS.map(s => (
                <div key={s.label} className="v3-card" style={{ padding: '20px 22px' }}>
                  <div className="v3-label" style={{ marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: '-.02em', marginBottom: 4 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--v3-text-3)' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Adequacy table */}
            <div className="v3-section" style={{ marginBottom: 12 }}>
              <IconGlobe size={15} color="var(--v3-accent)"/>
              <span style={{ marginLeft: 8 }}>Network Adequacy by State</span>
            </div>
            <div className="v3-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>State</th>
                    <th>Pharmacies</th>
                    <th>Coverage %</th>
                    <th>Coverage Bar</th>
                    <th>Gaps</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {GEO_TABLE.map(r => (
                    <tr key={r.state}>
                      <td style={{ fontWeight: 550 }}>{r.state}</td>
                      <td>{r.pharmacies.toLocaleString()}</td>
                      <td style={{ fontWeight: 600, color: r.coverage >= 95 ? 'var(--v3-green)' : r.coverage >= 90 ? 'var(--v3-amber)' : 'var(--v3-red)' }}>
                        {r.coverage}%
                      </td>
                      <td style={{ width: 140 }}>
                        <div style={{ height: 6, borderRadius: 3, background: 'var(--v3-surface-2)', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 3, width: `${r.coverage}%`,
                            background: r.coverage >= 95 ? 'var(--v3-green)' : r.coverage >= 90 ? 'var(--v3-amber)' : 'var(--v3-red)',
                          }}/>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: r.gap > 0 ? 'var(--v3-amber)' : 'var(--v3-green)' }}>{r.gap}</td>
                      <td><span className={geoStatusBadge(r.status)}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: OWNERSHIP CHANGES                                     */}
        {/* ============================================================ */}
        {activeTab === 3 && (
          <div>
            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button
                className={`v3-btn ${ownershipTab === 'processed' ? 'v3-btn-accent' : 'v3-btn-soft'}`}
                onClick={() => setOwnershipTab('processed')}
                style={{ borderRadius: 10 }}
              >
                <IconCheck size={14}/> Processed ({OWNERSHIP_CHANGES_PROCESSED.length})
              </button>
              <button
                className={`v3-btn ${ownershipTab === 'unprocessed' ? 'v3-btn-accent' : 'v3-btn-soft'}`}
                onClick={() => setOwnershipTab('unprocessed')}
                style={{ borderRadius: 10 }}
              >
                <IconStore size={14}/> Unprocessed ({OWNERSHIP_CHANGES_UNPROCESSED.length})
              </button>
            </div>

            <div className="v3-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Old Pharmacy</th>
                    <th>Old NCPDP</th>
                    <th>New Pharmacy</th>
                    <th>New NCPDP</th>
                    <th>State</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(ownershipTab === 'processed' ? OWNERSHIP_CHANGES_PROCESSED : OWNERSHIP_CHANGES_UNPROCESSED).map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontSize: 12, color: 'var(--v3-text-2)' }}>{row.date}</td>
                      <td style={{ fontWeight: 550 }}>{row.oldName}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--v3-accent)', fontWeight: 600 }}>{row.oldId}</td>
                      <td style={{ fontWeight: 550 }}>{row.newName}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--v3-accent)', fontWeight: 600 }}>{row.newId}</td>
                      <td>{row.state}</td>
                      <td>
                        <span className={`v3-badge ${row.status === 'Completed' ? 'v3-badge-green' : row.status === 'Submitted' ? 'v3-badge-accent' : 'v3-badge-amber'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: BATCH DOWNLOAD                                        */}
        {/* ============================================================ */}
        {activeTab === 4 && (
          <div>
            {/* Batch search form */}
            <div className="v3-card" style={{ padding: '18px 22px', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Search Pharmacies for Download</FieldLabel>
                  <TextInput
                    placeholder="Search by name, NCPDP ID, state..."
                    value={batchSearch}
                    onChange={e => setBatchSearch(e.target.value)}
                  />
                </div>
                <div style={{ width: 160 }}>
                  <FieldLabel>State</FieldLabel>
                  <Select>
                    <option value="">All States</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
                <button className="v3-btn v3-btn-accent" style={{ borderRadius: 10, height: 36 }}>
                  <IconSearch size={14}/> Search
                </button>
              </div>
            </div>

            {/* Dual panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Left: search results with checkboxes */}
              <div>
                <div className="v3-section" style={{ marginBottom: 10 }}>
                  <IconSearch size={14} color="var(--v3-accent)"/>
                  <span style={{ marginLeft: 6 }}>Search Results</span>
                </div>
                <div className="v3-table-wrap" style={{ maxHeight: 500, overflowY: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 36 }}></th>
                        <th>NCPDP ID</th>
                        <th>Pharmacy Name</th>
                        <th>State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PHARMACIES.map(p => {
                        const checked = batchSelected.includes(p.id);
                        return (
                          <tr key={p.id} onClick={() => toggleBatch(p.id)} style={{ cursor: 'pointer' }}>
                            <td>
                              <div style={{
                                width: 18, height: 18, borderRadius: 4,
                                border: checked ? '2px solid var(--v3-accent)' : '2px solid var(--v3-border)',
                                background: checked ? 'var(--v3-accent)' : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                {checked && <IconCheck size={12} color="#fff"/>}
                              </div>
                            </td>
                            <td style={{ fontFamily: 'monospace', color: 'var(--v3-accent)', fontWeight: 600, fontSize: 12 }}>{p.id}</td>
                            <td style={{ fontWeight: 500, fontSize: 13 }}>{p.name}</td>
                            <td style={{ fontSize: 12.5 }}>{p.state}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: selected for download */}
              <div>
                <div className="v3-section" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>
                    <IconDownload size={14} color="var(--v3-accent)"/>
                    <span style={{ marginLeft: 6 }}>Selected for Download</span>
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--v3-text-3)' }}>
                    {batchSelected.length} / 50 max
                  </span>
                </div>
                <div className="v3-card" style={{ minHeight: 300, padding: 0 }}>
                  {batchSelected.length === 0 ? (
                    <div style={{
                      padding: '60px 24px', textAlign: 'center', color: 'var(--v3-text-3)',
                    }}>
                      <IconDownload size={32} color="var(--v3-text-4)"/>
                      <div style={{ marginTop: 12, fontSize: 13.5, fontWeight: 500 }}>No pharmacies selected</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Click rows on the left to add them</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                        {batchSelected.map(id => {
                          const p = PHARMACIES.find(x => x.id === id);
                          if (!p) return null;
                          return (
                            <div
                              key={id}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 18px',
                                borderBottom: '1px solid var(--v3-border-lt)',
                              }}
                            >
                              <div style={{
                                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                                background: AVATAR_COLORS[PHARMACIES.indexOf(p) % AVATAR_COLORS.length],
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, fontWeight: 700, color: '#fff',
                              }}>
                                {p.name.charAt(0)}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 550, color: 'var(--v3-text)' }}>{p.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--v3-text-3)' }}>{p.id} | {p.city}, {p.state}</div>
                              </div>
                              <button
                                className="v3-btn v3-btn-ghost"
                                onClick={() => toggleBatch(id)}
                                style={{ padding: 4, borderRadius: 6 }}
                              >
                                <IconX size={14} color="var(--v3-text-3)"/>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--v3-border)', display: 'flex', gap: 10 }}>
                        <button className="v3-btn v3-btn-accent" style={{ flex: 1, borderRadius: 10, justifyContent: 'center' }}>
                          <IconDownload size={14}/> Download {batchSelected.length} Profiles
                        </button>
                        <button
                          className="v3-btn v3-btn-soft"
                          onClick={() => setBatchSelected([])}
                          style={{ borderRadius: 10 }}
                        >
                          Clear All
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
}
