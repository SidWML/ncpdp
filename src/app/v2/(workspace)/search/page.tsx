'use client';
import React, { useState } from 'react';
import { TopbarV2 } from '@/components/v2/TopbarV2';
import {
  IconSearch, IconChevronRight, IconX, IconDownload, IconFilter,
  IconMap, IconGlobe, IconCheck, IconAlertTriangle, IconRefresh,
} from '@/components/ui/Icons';
import { FieldLabel, TextInput, Select, MultiSelect, DateRange } from '@/components/ui/FormFields';
import {
  DISPENSER_CLASSES, PROVIDER_TYPES, RELATIONSHIPS,
  US_STATES, SEARCH_BY_OPTIONS, SERVICES,
} from '@/lib/filter-options';
import { Badge } from '@/components/ui/Badge';

/*  Mock pharmacy data  */
const PHARMACIES = [
  { id: '1234567', name: 'CareRx Pharmacy',           city: 'Dallas',         state: 'TX', type: 'Retail',      npi: '1234567890', phone: '(214) 555-0101', dea: 'Active',  fwa: 'Compliant',  license: 'TX-PH-38291', address: '4521 Main St, Dallas, TX 75201' },
  { id: '2345678', name: 'Sunrise Compounding Center', city: 'Phoenix',        state: 'AZ', type: 'Compounding', npi: '2345678901', phone: '(602) 555-0202', dea: 'Active',  fwa: 'Compliant',  license: 'AZ-PH-17482', address: '8901 E Camelback Rd, Phoenix, AZ 85016' },
  { id: '3456789', name: 'Valley Rx Solutions',        city: 'San Jose',       state: 'CA', type: 'Retail',      npi: '3456789012', phone: '(408) 555-0303', dea: 'Expiring',fwa: 'Review',     license: 'CA-PH-92014', address: '1234 Winchester Blvd, San Jose, CA 95128' },
  { id: '4567890', name: 'Mountain View Clinical Rx',  city: 'Denver',         state: 'CO', type: 'Specialty',   npi: '4567890123', phone: '(303) 555-0404', dea: 'Active',  fwa: 'Compliant',  license: 'CO-PH-44821', address: '7700 E Colfax Ave, Denver, CO 80220' },
  { id: '5678901', name: 'Bayou Pharmacy Partners',    city: 'New Orleans',    state: 'LA', type: 'Retail',      npi: '5678901234', phone: '(504) 555-0505', dea: 'Expired', fwa: 'Alert',      license: 'LA-PH-20193', address: '3300 Canal St, New Orleans, LA 70119' },
  { id: '6789012', name: 'Great Lakes Specialty Rx',   city: 'Chicago',        state: 'IL', type: 'Specialty',   npi: '6789012345', phone: '(312) 555-0606', dea: 'Active',  fwa: 'Compliant',  license: 'IL-PH-65890', address: '200 N Michigan Ave, Chicago, IL 60601' },
  { id: '7890123', name: 'SunHealth Compounding',      city: 'Miami',          state: 'FL', type: 'Compounding', npi: '7890123456', phone: '(305) 555-0707', dea: 'Active',  fwa: 'Compliant',  license: 'FL-PH-33421', address: '1500 Brickell Ave, Miami, FL 33129' },
  { id: '8901234', name: 'Pacific Coast Pharmacy',     city: 'Seattle',        state: 'WA', type: 'Mail Order',  npi: '8901234567', phone: '(206) 555-0808', dea: 'Active',  fwa: 'Compliant',  license: 'WA-PH-78201', address: '400 Pine St, Seattle, WA 98101' },
  { id: '9012345', name: 'Heartland Drug Store',       city: 'Omaha',          state: 'NE', type: 'Retail',      npi: '9012345678', phone: '(402) 555-0909', dea: 'Active',  fwa: 'Compliant',  license: 'NE-PH-10472', address: '1212 Dodge St, Omaha, NE 68102' },
  { id: '0123456', name: 'Northeast Clinical Pharmacy',city: 'Boston',         state: 'MA', type: 'Specialty',   npi: '0123456789', phone: '(617) 555-1010', dea: 'Active',  fwa: 'Review',     license: 'MA-PH-55930', address: '75 State St, Boston, MA 02109' },
  { id: '1122334', name: 'Peach State Pharmacy',       city: 'Atlanta',        state: 'GA', type: 'Retail',      npi: '1122334455', phone: '(404) 555-1111', dea: 'Active',  fwa: 'Compliant',  license: 'GA-PH-44201', address: '200 Peachtree St NW, Atlanta, GA 30303' },
  { id: '2233445', name: 'Rocky Mountain Rx',          city: 'Salt Lake City', state: 'UT', type: 'Retail',      npi: '2233445566', phone: '(801) 555-1212', dea: 'Expiring',fwa: 'Compliant',  license: 'UT-PH-89102', address: '50 S Main St, Salt Lake City, UT 84101' },
];

/*  Geographic data  */
const GEO_DATA = [
  { state: 'California',     code: 'CA', active: 8412, required: 8000, pct: 105.2, gap: 0,   status: 'Exceeds' },
  { state: 'Texas',          code: 'TX', active: 6891, required: 7000, pct: 98.4,  gap: 109, status: 'Review' },
  { state: 'Florida',        code: 'FL', active: 5234, required: 5200, pct: 100.7, gap: 0,   status: 'Meets' },
  { state: 'New York',       code: 'NY', active: 4987, required: 4800, pct: 103.9, gap: 0,   status: 'Exceeds' },
  { state: 'Illinois',       code: 'IL', active: 3201, required: 3400, pct: 94.1,  gap: 199, status: 'Below' },
  { state: 'Pennsylvania',   code: 'PA', active: 3102, required: 3000, pct: 103.4, gap: 0,   status: 'Exceeds' },
  { state: 'Ohio',           code: 'OH', active: 2890, required: 2900, pct: 99.7,  gap: 10,  status: 'Review' },
  { state: 'Georgia',        code: 'GA', active: 2456, required: 2500, pct: 98.2,  gap: 44,  status: 'Review' },
  { state: 'North Carolina', code: 'NC', active: 2312, required: 2200, pct: 105.1, gap: 0,   status: 'Exceeds' },
  { state: 'Michigan',       code: 'MI', active: 2105, required: 2300, pct: 91.5,  gap: 195, status: 'Below' },
  { state: 'Arizona',        code: 'AZ', active: 1890, required: 1800, pct: 105.0, gap: 0,   status: 'Meets' },
  { state: 'Washington',     code: 'WA', active: 1744, required: 1900, pct: 91.8,  gap: 156, status: 'Below' },
];

/*  CHOW data  */
const CHOW_PROCESSED = [
  { oldId: '1001234', oldName: 'Smith Family Pharmacy',   closeDate: '01/15/2026', newId: '1101234', newName: 'Rite Aid #4421',             openDate: '01/20/2026' },
  { oldId: '1002345', oldName: 'Green Valley Drug',       closeDate: '01/18/2026', newId: '1102345', newName: 'CVS Pharmacy #8832',         openDate: '01/25/2026' },
  { oldId: '1003456', oldName: 'Main Street Apothecary',  closeDate: '02/01/2026', newId: '1103456', newName: 'Walgreens #12091',           openDate: '02/05/2026' },
  { oldId: '1004567', oldName: 'MedPlus Rx',              closeDate: '02/10/2026', newId: '1104567', newName: 'Optum Pharmacy NW',          openDate: '02/14/2026' },
  { oldId: '1005678', oldName: 'Corner Drug Co',          closeDate: '02/22/2026', newId: '1105678', newName: 'Cigna Home Delivery',        openDate: '02/28/2026' },
  { oldId: '1006789', oldName: 'Heritage Pharmacy',       closeDate: '03/01/2026', newId: '1106789', newName: 'Express Scripts #209',       openDate: '03/05/2026' },
  { oldId: '1007890', oldName: 'Lakeside Drugs',          closeDate: '03/08/2026', newId: '1107890', newName: 'Amazon Pharmacy FL',         openDate: '03/12/2026' },
  { oldId: '1008901', oldName: 'Pioneer Pharmacy',        closeDate: '03/12/2026', newId: '1108901', newName: 'Costco Pharmacy #441',       openDate: '03/18/2026' },
  { oldId: '1009012', oldName: 'Westside Clinical Rx',    closeDate: '03/19/2026', newId: '1109012', newName: 'Humana Pharmacy SE',         openDate: '03/22/2026' },
  { oldId: '1009123', oldName: 'Liberty Rx Partners',     closeDate: '03/25/2026', newId: '1109123', newName: 'United Health Pharmacy #88', openDate: '03/29/2026' },
];

const CHOW_UNPROCESSED = [
  { oldId: '2001234', oldName: 'Maple Leaf Pharmacy',    closeDate: '03/28/2026', newId: '2101234', newName: 'Pending Assignment',    openDate: '—' },
  { oldId: '2002345', oldName: 'Oak Street Drug',        closeDate: '03/29/2026', newId: '2102345', newName: 'Pending Assignment',    openDate: '—' },
  { oldId: '2003456', oldName: 'Harbor View Rx',         closeDate: '03/30/2026', newId: '2103456', newName: 'Pending Assignment',    openDate: '—' },
  { oldId: '2004567', oldName: 'Sunrise Health Drugs',   closeDate: '03/31/2026', newId: '—',       newName: 'Under Review',          openDate: '—' },
  { oldId: '2005678', oldName: 'Cascade Pharmacy',       closeDate: '03/31/2026', newId: '—',       newName: 'Under Review',          openDate: '—' },
];

/*  Batch search results  */
const BATCH_RESULTS = PHARMACIES.slice(0, 8);

/*  Styles  */
const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', fontSize: 12.5,
};
const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '10px 14px', fontWeight: 600,
  color: 'var(--v2-text-3)', fontSize: 11, textTransform: 'uppercase',
  letterSpacing: '.04em', borderBottom: '1px solid var(--v2-border)',
  background: 'var(--v2-surface-2)',
};
const tdStyle: React.CSSProperties = {
  padding: '10px 14px', borderBottom: '1px solid var(--v2-border-lt)',
  color: 'var(--v2-text)',
};

const deaBadge = (s: string) => {
  if (s === 'Active')   return <span className="v2g v2g-ok">Active</span>;
  if (s === 'Expiring') return <span className="v2g v2g-w">Expiring</span>;
  return <span className="v2g v2g-err">Expired</span>;
};

const typeBadge = (t: string) => <span className="v2g v2g-p">{t}</span>;

const geoStatusBadge = (s: string) => {
  if (s === 'Exceeds') return <span className="v2g v2g-ok">Exceeds</span>;
  if (s === 'Meets')   return <span className="v2g v2g-ok">Meets</span>;
  if (s === 'Review')  return <span className="v2g v2g-w">Review</span>;
  return <span className="v2g v2g-err">Below</span>;
};

/* ═══════════════════════════════════════════════════════════════════ */
export default function SearchPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailPanel, setDetailPanel] = useState<typeof PHARMACIES[0] | null>(null);
  const [chowSubTab, setChowSubTab] = useState(0);

  // Advanced Filters state
  const [advSearchBy, setAdvSearchBy] = useState('');
  const [advSearchValue, setAdvSearchValue] = useState('');
  const [advCity, setAdvCity] = useState('');
  const [advZip, setAdvZip] = useState('');
  const [advStates, setAdvStates] = useState<string[]>([]);
  const [advDispenser, setAdvDispenser] = useState<string[]>([]);
  const [advProvider, setAdvProvider] = useState<string[]>([]);
  const [advRelationship, setAdvRelationship] = useState<string[]>([]);

  // Batch Download state
  const [batchSearchId, setBatchSearchId] = useState('');
  const [batchDba, setBatchDba] = useState('');
  const [batchState, setBatchState] = useState('');
  const [batchNpi, setBatchNpi] = useState('');
  const [batchDea, setBatchDea] = useState('');
  const [batchSelected, setBatchSelected] = useState<string[]>([]);

  const filteredPharmacies = searchQuery
    ? PHARMACIES.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.includes(searchQuery) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : PHARMACIES;

  const tabs = ['All Results', 'Advanced Filters', 'Geographic', 'Ownership Changes', 'Batch Download'];

  const geoSummary = {
    meeting: GEO_DATA.filter(g => g.status === 'Meets' || g.status === 'Exceeds').length,
    review:  GEO_DATA.filter(g => g.status === 'Review').length,
    below:   GEO_DATA.filter(g => g.status === 'Below').length,
    gap:     GEO_DATA.reduce((sum, g) => sum + g.gap, 0),
  };

  return (
    <>
      <TopbarV2
        title="Search"
        subtitle={`${filteredPharmacies.length.toLocaleString()} results found`}
      />

      <div style={{ padding: '20px 24px', position: 'relative' }}>
        {/*  Search bar  */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <span style={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none', display: 'flex',
          }}>
            <IconSearch size={18} color="var(--v2-text-3)" />
          </span>
          <input
            className="v2i"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search pharmacies by name, NCPDP ID, city, or state..."
            style={{
              paddingLeft: 44, height: 48, fontSize: 15, borderRadius: 28,
              background: 'var(--v2-surface)', boxShadow: 'var(--v2-shadow-md)',
              border: '1px solid var(--v2-border)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                padding: 4, borderRadius: 4,
              }}
            >
              <IconX size={16} color="var(--v2-text-3)" />
            </button>
          )}
        </div>

        {/*  Tab bar  */}
        <div style={{
          display: 'flex', gap: 0, borderBottom: '1px solid var(--v2-border)', marginBottom: 20,
        }}>
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`v2-tab${activeTab === i ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ═══ TAB 0: All Results ════════════════════════════════ */}
        {activeTab === 0 && (
          <div style={{ display: 'flex', gap: 0 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {filteredPharmacies.map(p => (
                <div
                  key={p.id}
                  onClick={() => setDetailPanel(p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', cursor: 'pointer',
                    borderBottom: '1px solid var(--v2-border-lt)',
                    background: detailPanel?.id === p.id ? 'var(--v2-primary-bg)' : 'transparent',
                    transition: 'background .1s',
                  }}
                  onMouseEnter={e => { if (detailPanel?.id !== p.id) (e.currentTarget as HTMLDivElement).style.background = 'var(--v2-surface-2)'; }}
                  onMouseLeave={e => { if (detailPanel?.id !== p.id) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--v2-text)' }}>{p.name}</span>
                      {typeBadge(p.type)}
                      {deaBadge(p.dea)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--v2-text-3)' }}>
                      <span>{p.city}, {p.state}</span>
                      <span style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                        fontSize: 11.5, color: 'var(--v2-primary)', fontWeight: 600,
                        background: 'var(--v2-primary-bg)', padding: '1px 6px', borderRadius: 4,
                      }}>
                        {p.id}
                      </span>
                    </div>
                  </div>
                  <IconChevronRight size={16} color="var(--v2-text-3)" />
                </div>
              ))}
              {filteredPharmacies.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--v2-text-3)', fontSize: 14 }}>
                  No pharmacies match your search.
                </div>
              )}
            </div>

            {/*  Detail slide-in panel  */}
            {detailPanel && (
              <div style={{
                width: 380, flexShrink: 0, borderLeft: '1px solid var(--v2-border)',
                background: 'var(--v2-surface)', padding: '20px 22px',
                position: 'sticky', top: 52, height: 'calc(100vh - 52px)', overflowY: 'auto',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div>
                    <h2 className="v2-title" style={{ fontSize: 16, marginBottom: 4 }}>{detailPanel.name}</h2>
                    <div className="v2-sub">{detailPanel.address}</div>
                  </div>
                  <button
                    onClick={() => setDetailPanel(null)}
                    style={{ background: 'var(--v2-surface-2)', border: 'none', borderRadius: 6, padding: 5, cursor: 'pointer', display: 'flex' }}
                  >
                    <IconX size={14} color="var(--v2-text-2)" />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                  {typeBadge(detailPanel.type)}
                  {deaBadge(detailPanel.dea)}
                  {detailPanel.fwa === 'Compliant' && <span className="v2g v2g-ok">FWA Compliant</span>}
                  {detailPanel.fwa === 'Review' && <span className="v2g v2g-w">FWA Review</span>}
                  {detailPanel.fwa === 'Alert' && <span className="v2g v2g-err">FWA Alert</span>}
                </div>

                {[
                  { label: 'NCPDP Provider ID', value: detailPanel.id, mono: true },
                  { label: 'NPI', value: detailPanel.npi, mono: true },
                  { label: 'Phone', value: detailPanel.phone },
                  { label: 'Provider Type', value: detailPanel.type },
                  { label: 'DEA Status', value: detailPanel.dea },
                  { label: 'FWA Status', value: detailPanel.fwa },
                  { label: 'State License', value: detailPanel.license, mono: true },
                  { label: 'City', value: detailPanel.city },
                  { label: 'State', value: detailPanel.state },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--v2-border-lt)' }}>
                    <span className="v2-label" style={{ marginBottom: 0, fontSize: 12 }}>{f.label}</span>
                    <span style={{
                      fontSize: 12.5, fontWeight: 550, color: 'var(--v2-text)',
                      fontFamily: f.mono ? 'ui-monospace, SFMono-Regular, monospace' : 'inherit',
                    }}>
                      {f.value}
                    </span>
                  </div>
                ))}

                <button className="v2b v2b-p" style={{ width: '100%', justifyContent: 'center', marginTop: 20, borderRadius: 8, padding: '10px 0' }}>
                  View Full Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB 1: Advanced Filters ═══════════════════════════ */}
        {activeTab === 1 && (
          <div>
            <div className="v2c" style={{ padding: 24, marginBottom: 20 }}>
              {/* Primary Search */}
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--v2-text-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
                Primary Search
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div>
                  <FieldLabel>Search By</FieldLabel>
                  <Select value={advSearchBy} onChange={e => setAdvSearchBy(e.target.value)}>
                    <option value="">-- Select --</option>
                    {SEARCH_BY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Search Value</FieldLabel>
                  <TextInput placeholder="Enter search value..." value={advSearchValue} onChange={e => setAdvSearchValue(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>Open Date From</FieldLabel>
                  <TextInput placeholder="MM/DD/YYYY" type="text" />
                </div>
                <div>
                  <FieldLabel>Open Date To</FieldLabel>
                  <TextInput placeholder="MM/DD/YYYY" type="text" />
                </div>
              </div>

              {/* Location */}
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--v2-text-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
                Location
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div>
                  <FieldLabel>Address</FieldLabel>
                  <TextInput placeholder="Street address..." />
                </div>
                <div>
                  <FieldLabel>City</FieldLabel>
                  <TextInput placeholder="City name..." value={advCity} onChange={e => setAdvCity(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>State</FieldLabel>
                  <MultiSelect options={US_STATES} height={80} value={advStates} onChange={setAdvStates} />
                </div>
                <div>
                  <FieldLabel>Zip Code</FieldLabel>
                  <TextInput placeholder="Zip..." value={advZip} onChange={e => setAdvZip(e.target.value)} />
                </div>
              </div>

              {/* Classification */}
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--v2-text-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
                Classification
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div>
                  <FieldLabel>Dispenser Class</FieldLabel>
                  <MultiSelect options={DISPENSER_CLASSES} height={96} value={advDispenser} onChange={setAdvDispenser} />
                </div>
                <div>
                  <FieldLabel>Provider Type</FieldLabel>
                  <MultiSelect options={PROVIDER_TYPES} height={96} value={advProvider} onChange={setAdvProvider} />
                </div>
                <div>
                  <FieldLabel>Relationship / Network</FieldLabel>
                  <MultiSelect options={RELATIONSHIPS} height={96} value={advRelationship} onChange={setAdvRelationship} />
                </div>
              </div>

              {/* Date Ranges & Status */}
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--v2-text-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
                Date Ranges &amp; Status
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
                <DateRange label="Close Date Range" />
                <DateRange label="Last Update Range" />
                <div>
                  <FieldLabel>Status</FieldLabel>
                  <Select>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="All">All</option>
                  </Select>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="v2b v2b-p">
                  <IconSearch size={14} color="#fff" /> Search
                </button>
                <button className="v2b v2b-s" onClick={() => {
                  setAdvSearchBy(''); setAdvSearchValue(''); setAdvCity(''); setAdvZip('');
                  setAdvStates([]); setAdvDispenser([]); setAdvProvider([]); setAdvRelationship([]);
                }}>
                  <IconRefresh size={14} /> Reset
                </button>
              </div>
            </div>

            {/* Results table */}
            <div className="v2-tw">
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>NCPDP ID</th>
                    <th style={thStyle}>Pharmacy Name</th>
                    <th style={thStyle}>City</th>
                    <th style={thStyle}>State</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>NPI</th>
                    <th style={thStyle}>DEA</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PHARMACIES.map(p => (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => { setActiveTab(0); setDetailPanel(p); }}>
                      <td style={{ ...tdStyle, fontFamily: 'ui-monospace, SFMono-Regular, monospace', color: 'var(--v2-primary)', fontWeight: 600 }}>{p.id}</td>
                      <td style={{ ...tdStyle, fontWeight: 550 }}>{p.name}</td>
                      <td style={tdStyle}>{p.city}</td>
                      <td style={tdStyle}>{p.state}</td>
                      <td style={tdStyle}>{typeBadge(p.type)}</td>
                      <td style={{ ...tdStyle, fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 11.5 }}>{p.npi}</td>
                      <td style={tdStyle}>{deaBadge(p.dea)}</td>
                      <td style={tdStyle}><span className="v2g v2g-ok">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ TAB 2: Geographic ═════════════════════════════════ */}
        {activeTab === 2 && (
          <div>
            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'States Meeting Adequacy', value: geoSummary.meeting, color: 'var(--v2-green)', bg: 'var(--v2-green-bg)', icon: <IconCheck size={18} color="var(--v2-green)" /> },
                { label: 'Needing Review',          value: geoSummary.review,  color: 'var(--v2-amber)', bg: 'var(--v2-amber-bg)', icon: <IconAlertTriangle size={18} color="var(--v2-amber)" /> },
                { label: 'Below Threshold',         value: geoSummary.below,   color: 'var(--v2-red)',   bg: 'var(--v2-red-bg)',   icon: <IconAlertTriangle size={18} color="var(--v2-red)" /> },
                { label: 'Total Network Gap',       value: geoSummary.gap,     color: 'var(--v2-text)',  bg: 'var(--v2-surface-2)', icon: <IconGlobe size={18} color="var(--v2-text-2)" /> },
              ].map(c => (
                <div key={c.label} className="v2c" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.icon}
                    </div>
                    <span className="v2-label" style={{ marginBottom: 0 }}>{c.label}</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: c.color, letterSpacing: '-0.02em' }}>
                    {c.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Geographic table */}
            <div className="v2-tw">
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>State</th>
                    <th style={thStyle}>Code</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Active Pharmacies</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Required</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Coverage %</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Gap</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {GEO_DATA.map(g => (
                    <tr key={g.code}>
                      <td style={{ ...tdStyle, fontWeight: 550 }}>{g.state}</td>
                      <td style={{ ...tdStyle, fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontWeight: 600 }}>{g.code}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{g.active.toLocaleString()}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{g.required.toLocaleString()}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: g.pct >= 100 ? 'var(--v2-green)' : g.pct >= 95 ? 'var(--v2-amber)' : 'var(--v2-red)' }}>
                        {g.pct.toFixed(1)}%
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: g.gap > 0 ? 'var(--v2-red)' : 'var(--v2-text-3)' }}>
                        {g.gap > 0 ? `-${g.gap}` : '—'}
                      </td>
                      <td style={tdStyle}>{geoStatusBadge(g.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ TAB 3: Ownership Changes (CHOW) ══════════════════ */}
        {activeTab === 3 && (
          <div>
            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button
                className={`v2-tab${chowSubTab === 0 ? ' active' : ''}`}
                onClick={() => setChowSubTab(0)}
                style={{ borderBottom: 'none', borderRadius: 8, padding: '8px 18px', background: chowSubTab === 0 ? 'var(--v2-primary-bg)' : 'var(--v2-surface-2)' }}
              >
                Processed <span style={{ marginLeft: 6, fontWeight: 700, fontSize: 11, opacity: .7 }}>15,086</span>
              </button>
              <button
                className={`v2-tab${chowSubTab === 1 ? ' active' : ''}`}
                onClick={() => setChowSubTab(1)}
                style={{ borderBottom: 'none', borderRadius: 8, padding: '8px 18px', background: chowSubTab === 1 ? 'var(--v2-primary-bg)' : 'var(--v2-surface-2)' }}
              >
                Unprocessed <span style={{ marginLeft: 6, fontWeight: 700, fontSize: 11, color: 'var(--v2-red)' }}>247</span>
              </button>
            </div>

            <div className="v2-tw">
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Old NCPDP</th>
                    <th style={thStyle}>Old Name</th>
                    <th style={thStyle}>Close Date</th>
                    <th style={thStyle}>New NCPDP</th>
                    <th style={thStyle}>New Name</th>
                    <th style={thStyle}>Open Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(chowSubTab === 0 ? CHOW_PROCESSED : CHOW_UNPROCESSED).map(c => (
                    <tr key={c.oldId}>
                      <td style={{ ...tdStyle, fontFamily: 'ui-monospace, SFMono-Regular, monospace', color: 'var(--v2-red)', fontWeight: 600 }}>{c.oldId}</td>
                      <td style={{ ...tdStyle, fontWeight: 550 }}>{c.oldName}</td>
                      <td style={tdStyle}>{c.closeDate}</td>
                      <td style={{ ...tdStyle, fontFamily: 'ui-monospace, SFMono-Regular, monospace', color: 'var(--v2-green)', fontWeight: 600 }}>{c.newId}</td>
                      <td style={{ ...tdStyle, fontWeight: 550 }}>{c.newName}</td>
                      <td style={tdStyle}>{c.openDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ TAB 4: Batch Download ═════════════════════════════ */}
        {activeTab === 4 && (
          <div>
            {/* Search form */}
            <div className="v2c" style={{ padding: 20, marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 16 }}>
                <div>
                  <FieldLabel>NCPDP ID</FieldLabel>
                  <TextInput placeholder="e.g. 1234567" value={batchSearchId} onChange={e => setBatchSearchId(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>DBA Name</FieldLabel>
                  <TextInput placeholder="Pharmacy name..." value={batchDba} onChange={e => setBatchDba(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>State</FieldLabel>
                  <Select value={batchState} onChange={e => setBatchState(e.target.value)}>
                    <option value="">All States</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>NPI</FieldLabel>
                  <TextInput placeholder="NPI number..." value={batchNpi} onChange={e => setBatchNpi(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>DEA #</FieldLabel>
                  <TextInput placeholder="DEA number..." value={batchDea} onChange={e => setBatchDea(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>Status</FieldLabel>
                  <Select>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="All">All</option>
                  </Select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="v2b v2b-p">
                  <IconSearch size={14} color="#fff" /> Search
                </button>
                <button className="v2b v2b-s" onClick={() => { setBatchSearchId(''); setBatchDba(''); setBatchState(''); setBatchNpi(''); setBatchDea(''); }}>
                  <IconRefresh size={14} /> Reset
                </button>
              </div>
            </div>

            {/* Dual panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Left: Search Results */}
              <div className="v2c" style={{ overflow: 'hidden' }}>
                <div style={{
                  padding: '12px 16px', borderBottom: '1px solid var(--v2-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--v2-surface-2)',
                }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--v2-text)' }}>Search Results</span>
                  <span className="v2-sub">{BATCH_RESULTS.length} found</span>
                </div>
                {BATCH_RESULTS.map(p => {
                  const isSelected = batchSelected.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 16px', borderBottom: '1px solid var(--v2-border-lt)',
                        background: isSelected ? 'var(--v2-primary-bg)' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (isSelected) {
                          setBatchSelected(batchSelected.filter(x => x !== p.id));
                        } else if (batchSelected.length < 50) {
                          setBatchSelected([...batchSelected, p.id]);
                        }
                      }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                        border: isSelected ? '2px solid var(--v2-primary)' : '2px solid var(--v2-border)',
                        background: isSelected ? 'var(--v2-primary)' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isSelected && <IconCheck size={12} color="#fff" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 550, color: 'var(--v2-text)' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>
                          <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace', color: 'var(--v2-primary)' }}>{p.id}</span>
                          {' '}&middot;{' '}{p.city}, {p.state}
                        </div>
                      </div>
                      {typeBadge(p.type)}
                    </div>
                  );
                })}
              </div>

              {/* Right: Selected for download */}
              <div className="v2c" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  padding: '12px 16px', borderBottom: '1px solid var(--v2-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--v2-surface-2)',
                }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--v2-text)' }}>Selected for Download</span>
                  <span className="v2-sub">{batchSelected.length} / 50 max</span>
                </div>
                <div style={{ flex: 1, minHeight: 200 }}>
                  {batchSelected.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--v2-text-3)', fontSize: 13 }}>
                      Select pharmacies from the left panel to add them here.
                    </div>
                  )}
                  {batchSelected.map(id => {
                    const p = PHARMACIES.find(x => x.id === id);
                    if (!p) return null;
                    return (
                      <div
                        key={id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px', borderBottom: '1px solid var(--v2-border-lt)',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 550, color: 'var(--v2-text)' }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>
                            <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace', color: 'var(--v2-primary)' }}>{p.id}</span>
                            {' '}&middot;{' '}{p.city}, {p.state}
                          </div>
                        </div>
                        <button
                          onClick={() => setBatchSelected(batchSelected.filter(x => x !== id))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 4 }}
                        >
                          <IconX size={14} color="var(--v2-text-3)" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div style={{
                  padding: '12px 16px', borderTop: '1px solid var(--v2-border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <button
                    className="v2b v2b-s"
                    onClick={() => setBatchSelected([])}
                    style={{ fontSize: 12 }}
                  >
                    Clear All
                  </button>
                  <button
                    className="v2b v2b-p"
                    style={{ fontSize: 12 }}
                    disabled={batchSelected.length === 0}
                  >
                    <IconDownload size={14} color="#fff" /> Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
