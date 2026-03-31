'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { FieldLabel, TextInput, Select, MultiSelect, DateRange, SectionTitle } from '@/components/ui/FormFields';
import { DataTable, EmptyState, CellMono, CellBold, CellMuted, CellStatus, CellViewBtn } from '@/components/ui/DataTable';
import type { ColumnDef } from '@/components/ui/DataTable';
import {
  IconSearch, IconRefresh, IconFilter, IconDownload, IconExternalLink, IconChevronDown,
} from '@/components/ui/Icons';
import {
  DISPENSER_CLASSES, PROVIDER_TYPES, RELATIONSHIPS, US_STATES, SEARCH_BY_OPTIONS,
} from '@/lib/filter-options';

/* ─── Types ─────────────────────────────────────────────────────── */
type Tab = 'search' | 'advanced';

/* ─── Static mock data ───────────────────────────────────────────── */
type PharmRow = { ncpdp: string; name: string; city: string; state: string; phone: string; status: string; type: string };
const PHARMACY_RESULTS: PharmRow[] = [
  { ncpdp: '1234567', name: 'CareRx Pharmacy #0842',          city: 'Los Angeles',   state: 'CA', phone: '(213) 555-0198', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '2345678', name: 'SpecialtyRx Partners LLC',        city: 'Houston',       state: 'TX', phone: '(713) 555-0412', status: 'Active',   type: 'Specialty' },
  { ncpdp: '3456789', name: 'MediCare Express Pharmacy',       city: 'Phoenix',       state: 'AZ', phone: '(602) 555-0837', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '4567890', name: 'Coastal Health Pharmacy',         city: 'Miami',         state: 'FL', phone: '(305) 555-0291', status: 'Active',   type: 'Compounding' },
  { ncpdp: '5678901', name: 'Alpine Specialty Dispensary',     city: 'Denver',        state: 'CO', phone: '(720) 555-0543', status: 'Inactive', type: 'Specialty' },
  { ncpdp: '6789012', name: 'Midwest Chain Pharmacy #44',      city: 'Chicago',       state: 'IL', phone: '(312) 555-0871', status: 'Active',   type: 'Chain' },
  { ncpdp: '7890123', name: 'SunHealth Compounding Center',    city: 'Orlando',       state: 'FL', phone: '(407) 555-0654', status: 'Active',   type: 'Compounding' },
  { ncpdp: '8901234', name: 'Pacific Infusion Services',       city: 'Seattle',       state: 'WA', phone: '(206) 555-0923', status: 'Active',   type: 'Infusion' },
  { ncpdp: '9012345', name: 'Capital Area Pharmacy Group',     city: 'Washington',    state: 'DC', phone: '(202) 555-0182', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '0123456', name: 'Northeast Specialty Rx',          city: 'Boston',        state: 'MA', phone: '(617) 555-0764', status: 'Inactive', type: 'Specialty' },
  { ncpdp: '1234568', name: 'Valley Pharmacy Solutions',       city: 'Nashville',     state: 'TN', phone: '(615) 555-0342', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '2345679', name: 'Lone Star Rx Network',            city: 'Dallas',        state: 'TX', phone: '(214) 555-0598', status: 'Active',   type: 'Chain' },
  { ncpdp: '3456790', name: 'Golden Gate Pharmacy',            city: 'San Francisco', state: 'CA', phone: '(415) 555-0237', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '4567891', name: 'Desert Sun Dispensary',           city: 'Tucson',        state: 'AZ', phone: '(520) 555-0489', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '5678902', name: 'Great Lakes Clinical Pharmacy',   city: 'Detroit',       state: 'MI', phone: '(313) 555-0731', status: 'Active',   type: 'Clinical' },
  { ncpdp: '6789013', name: 'Bayou Pharmacy Partners',         city: 'New Orleans',   state: 'LA', phone: '(504) 555-0862', status: 'Inactive', type: 'Community/Retail' },
  { ncpdp: '7890124', name: 'Rocky Mountain Infusion Ctr',    city: 'Salt Lake City', state: 'UT', phone: '(801) 555-0193', status: 'Active',   type: 'Infusion' },
  { ncpdp: '8901235', name: 'Empire State Pharmacy LLC',       city: 'New York',      state: 'NY', phone: '(212) 555-0447', status: 'Active',   type: 'Specialty' },
  { ncpdp: '9012346', name: 'Peach State Clinical Rx',         city: 'Atlanta',       state: 'GA', phone: '(404) 555-0689', status: 'Active',   type: 'Clinical' },
  { ncpdp: '0123457', name: 'Iron City Pharmacy Group',        city: 'Pittsburgh',    state: 'PA', phone: '(412) 555-0821', status: 'Active',   type: 'Chain' },
];

const PHARM_COLS: ColumnDef<PharmRow>[] = [
  { accessorKey: 'name',   header: 'Pharmacy DBA Name',  cell: ({ row }) => <span style={{ fontWeight: 500, color: '#111827' }}>{row.original.name}</span> },
  { accessorKey: 'ncpdp',  header: 'NCPDP Provider ID',  cell: ({ row }) => <CellMono>{row.original.ncpdp}</CellMono> },
  { accessorKey: 'city',   header: 'City',               cell: ({ row }) => <CellMuted>{row.original.city}</CellMuted> },
  { accessorKey: 'state',  header: 'State',              cell: ({ row }) => <CellBold>{row.original.state}</CellBold> },
  { accessorKey: 'phone',  header: 'Main Phone',         cell: ({ row }) => <CellMuted>{row.original.phone}</CellMuted> },
  { accessorKey: 'status', header: 'Status',             cell: ({ row }) => <CellStatus active={row.original.status === 'Active'}/> },
  { id: 'action',          header: '',                   cell: () => <CellViewBtn/>, enableSorting: false },
];


/* ─── Smart search ───────────────────────────────────────────────── */
const SMART_RESULTS = [
  { id: 'NPI-1023847', ncpdp: '1234567', name: 'CareRx Pharmacy #0842',       city: 'Los Angeles, CA',  type: 'Community/Retail', services: ['24/7','Drive-Through','Compounding'], dea: 'valid', fwa: 'pass', license: 'valid' },
  { id: 'NPI-2049182', ncpdp: '2345678', name: 'SpecialtyRx Partners LLC',     city: 'Houston, TX',      type: 'Specialty',        services: ['HIV/AIDS','Oncology','Mail Service'],              dea: 'valid', fwa: 'pass', license: 'valid' },
  { id: 'NPI-3012847', ncpdp: '3456789', name: 'MediCare Express Pharmacy',    city: 'Phoenix, AZ',      type: 'Community/Retail', services: ['24/7','Compounding'],                               dea: 'expiring', fwa: 'pass', license: 'valid' },
  { id: 'NPI-4028374', ncpdp: '4567890', name: 'Coastal Health Pharmacy',      city: 'Miami, FL',        type: 'Compounding',      services: ['Compounding','Specialty'],                         dea: 'valid', fwa: 'review', license: 'valid' },
  { id: 'NPI-5019283', ncpdp: '5678901', name: 'Alpine Specialty Dispensary',  city: 'Denver, CO',       type: 'Specialty',        services: ['HIV/AIDS','Infusion','Mail Service'],               dea: 'valid', fwa: 'pass', license: 'expiring' },
  { id: 'NPI-6028374', ncpdp: '6789012', name: 'Midwest Chain Pharmacy #44',   city: 'Chicago, IL',      type: 'Chain',            services: ['24/7','Drive-Through'],                             dea: 'valid', fwa: 'pass', license: 'valid' },
  { id: 'NPI-7019283', ncpdp: '7890123', name: 'SunHealth Compounding Center', city: 'Orlando, FL',      type: 'Compounding',      services: ['Compounding','Specialty','Long-Term Care'],         dea: 'valid', fwa: 'pass', license: 'valid' },
  { id: 'NPI-8028374', ncpdp: '8901234', name: 'Pacific Infusion Services',    city: 'Seattle, WA',      type: 'Infusion',         services: ['Home Infusion','Specialty'],                        dea: 'valid', fwa: 'fail', license: 'valid' },
];
const EXAMPLE_CHIPS = ['Find all specialty pharmacies in Texas','DEA registrations expiring in 30 days','Pharmacies with FWA attestation issues','24/7 pharmacies near ZIP 90210'];

const credBadge = (s: string) => {
  if (s === 'valid')    return <Badge variant="success">Valid</Badge>;
  if (s === 'expiring') return <Badge variant="warning">Expiring</Badge>;
  if (s === 'review')   return <Badge variant="warning">Review</Badge>;
  return <Badge variant="danger">Failed</Badge>;
};

/* ─── Main page ──────────────────────────────────────────────────── */
export default function SearchPage() {
  const [tab, setTab]             = useState<Tab>('search');
  const [advSearched, setAdvSearched] = useState(false);
  const [smartQuery, setSmartQuery]     = useState('');
  const [showFilters, setShowFilters]   = useState(false);

  const smartResults = (() => {
    if (!smartQuery.trim()) return SMART_RESULTS;
    const q = smartQuery.toLowerCase();
    const direct = SMART_RESULTS.filter(r =>
      r.name.toLowerCase().includes(q) || r.ncpdp.includes(q) ||
      r.city.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) || r.services.some(s => s.toLowerCase().includes(q))
    );
    if (direct.length > 0) return direct;
    const words = q.split(/\s+/).filter(w => w.length > 2);
    const nlp = SMART_RESULTS.filter(r => {
      const blob = `${r.name} ${r.city} ${r.type} ${r.services.join(' ')} ${r.dea} ${r.fwa} ${r.license} ${r.ncpdp}`.toLowerCase();
      return words.some(w => blob.includes(w));
    });
    return nlp.length > 0 ? nlp : SMART_RESULTS;
  })();

  const TABS: { key: Tab; label: string }[] = [
    { key: 'search',   label: 'Smart Search'    },
    { key: 'advanced', label: 'Advanced Search' },
  ];

  return (
    <>
      <Topbar
        title="Smart Search"
        subtitle="dataQ WebConnect — Pharmacy search, lookup, and real-time verification"
        actions={<button className="btn-secondary" style={{ fontSize: 12, gap: 5 }}><IconDownload size={13}/> Export Results</button>}
      />
      <main style={{ padding: '0 20px 40px' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', background: '#fff' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '12px 22px', fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? '#1B2B6B' : '#64748B',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: tab === t.key ? '2px solid #1B2B6B' : '2px solid transparent',
              marginBottom: -2,
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ paddingTop: 16 }}>

          {/* ── SMART SEARCH TAB ── */}
          {tab === 'search' && (
            <div>
              {/* Hero — compact */}
              <div style={{
                padding: '20px 24px 18px', marginBottom: 12,
                background: 'linear-gradient(135deg, #0F1A3E 0%, #1B2B6B 100%)',
                borderRadius: 10, border: '1px solid rgba(99,102,241,.15)',
              }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginBottom: 10 }}>
                  Search across 68,247 pharmacies by NCPDP ID, NPI, name, location, or natural language
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                      <IconSearch size={15} color="#94A3B8"/>
                    </div>
                    <input
                      type="text" value={smartQuery}
                      onChange={e => setSmartQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') setSmartQuery(smartQuery); }}
                      placeholder="Search by NCPDP ID, NPI, pharmacy name, city, state, ZIP..."
                      style={{
                        width: '100%', padding: '9px 14px 9px 36px', borderRadius: 8,
                        border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.07)',
                        color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <button className="btn-primary" style={{ padding: '9px 20px', fontSize: 12.5, fontWeight: 600, gap: 6, borderRadius: 8 }}>
                    <IconSearch size={13} color="#fff"/> Search
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {EXAMPLE_CHIPS.map(c => (
                    <button key={c} onClick={() => setSmartQuery(c)} style={{
                      padding: '3px 11px', borderRadius: 20,
                      border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)',
                      color: 'rgba(255,255,255,.5)', fontSize: 11, cursor: 'pointer',
                    }}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Filters toggle */}
              <button onClick={() => setShowFilters(f => !f)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff',
                color: '#6B7280', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                marginBottom: showFilters ? 0 : 10, width: '100%',
              }}>
                <IconFilter size={12}/> Filters
                <IconChevronDown size={11} color="#9CA3AF"/>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9CA3AF' }}>{smartResults.length} results</span>
              </button>
              {showFilters && (
                <Card style={{ marginBottom: 10, borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
                  <CardBody style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 8 }}>
                      <div><FieldLabel>Provider Type</FieldLabel><Select><option>All Types</option><option>Community/Retail</option><option>Specialty</option><option>Compounding</option><option>Chain</option><option>Infusion</option></Select></div>
                      <div><FieldLabel>State</FieldLabel><Select><option>All States</option><option>CA</option><option>TX</option><option>FL</option><option>NY</option><option>IL</option></Select></div>
                      <div><FieldLabel>DEA Status</FieldLabel><Select><option>All</option><option>Valid</option><option>Expiring</option><option>Expired</option></Select></div>
                      <div><FieldLabel>FWA Status</FieldLabel><Select><option>All</option><option>Pass</option><option>Review</option><option>Fail</option></Select></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                      <div><FieldLabel>Services</FieldLabel><Select><option>All</option><option>24/7</option><option>Drive-Through</option><option>Compounding</option></Select></div>
                      <div><FieldLabel>24/7</FieldLabel><Select><option>All</option><option>Yes</option><option>No</option></Select></div>
                      <div><FieldLabel>Accreditation</FieldLabel><Select><option>All</option><option>URAC</option><option>ACHC</option></Select></div>
                      <div><FieldLabel>Status</FieldLabel><Select><option>Active</option><option>Inactive</option><option>All</option></Select></div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Result rows — compact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 8, border: '1px solid #E5E7EB', overflow: 'hidden', background: '#E5E7EB' }}>
                {smartResults.map((r, idx) => (
                  <div key={r.ncpdp} style={{
                    padding: '10px 16px', background: idx % 2 === 0 ? '#fff' : '#FAFAFA',
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'background .08s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F0EEFF')}
                    onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#FAFAFA')}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{r.name}</span>
                        <Badge variant="info">{r.type}</Badge>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11.5, color: '#6B7280', marginBottom: 5 }}>
                        <span>{r.city}</span>
                        <span style={{ color: '#D1D5DB' }}>|</span>
                        <span>NCPDP: <strong style={{ color: '#4F46E5', fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>{r.ncpdp}</strong></span>
                        <span style={{ color: '#D1D5DB' }}>|</span>
                        <span>NPI: <strong style={{ fontFamily: 'ui-monospace, monospace', color: '#374151', fontSize: 11 }}>{r.id}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {r.services.map(s => (
                            <span key={s} style={{ padding: '1px 8px', borderRadius: 4, fontSize: 10.5, fontWeight: 500, background: '#F3F4F6', color: '#6B7280' }}>{s}</span>
                          ))}
                        </div>
                        <span style={{ color: '#E5E7EB' }}>|</span>
                        <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
                          <span style={{ color: '#6B7280' }}>DEA: {credBadge(r.dea)}</span>
                          <span style={{ color: '#6B7280' }}>FWA: {credBadge(r.fwa)}</span>
                          <span style={{ color: '#6B7280' }}>License: {credBadge(r.license)}</span>
                        </div>
                      </div>
                    </div>
                    <button style={{
                      padding: '5px 12px', borderRadius: 6, border: '1px solid #E5E7EB',
                      background: '#fff', color: '#4F46E5', fontSize: 11.5, fontWeight: 500,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.borderColor = '#C7D2FE'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                    >
                      View Profile <IconExternalLink size={10}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ADVANCED SEARCH TAB ── */}
          {tab === 'advanced' && (
            <div>
              <Card style={{ marginBottom: 14 }}>
                <div style={{ padding: '14px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1B2B6B' }}>Pharmacy Audit Search</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>Search with detailed filters across the entire pharmacy database</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-primary" onClick={() => setAdvSearched(true)} style={{ gap: 6, fontSize: 12.5, padding: '7px 22px' }}>
                      <IconSearch size={13} color="#fff"/> Search
                    </button>
                    <button className="btn-secondary" onClick={() => setAdvSearched(false)} style={{ gap: 6, fontSize: 12.5, padding: '7px 18px' }}>
                      <IconRefresh size={13}/> Reset
                    </button>
                  </div>
                </div>
                <CardBody style={{ padding: '20px 24px 24px' }}>
                  {/* Primary Search */}
                  <div style={{ marginBottom: 22 }}>
                    <SectionTitle>Primary Search</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 10, marginBottom: 10 }}>
                      <div><FieldLabel>Search by</FieldLabel><Select>{SEARCH_BY_OPTIONS.map(o => <option key={o}>{o}</option>)}</Select></div>
                      <div><FieldLabel>Search Value</FieldLabel><TextInput placeholder="Enter search value..."/></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                      <div><FieldLabel>Pharmacy DBA Name</FieldLabel><TextInput placeholder="DBA Name"/></div>
                      <div><FieldLabel>Store Number</FieldLabel><TextInput placeholder="Store #"/></div>
                      <div><FieldLabel>From Date</FieldLabel><TextInput placeholder="MM/DD/YYYY"/></div>
                      <div><FieldLabel>To Date</FieldLabel><TextInput placeholder="MM/DD/YYYY"/></div>
                    </div>
                  </div>
                  {/* Location */}
                  <div style={{ marginBottom: 22 }}>
                    <SectionTitle>Location</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                      <div><FieldLabel>Address</FieldLabel><TextInput placeholder="Street address"/></div>
                      <div><FieldLabel>City</FieldLabel><TextInput placeholder="City"/></div>
                      <div><FieldLabel>State</FieldLabel><MultiSelect options={US_STATES} height={88}/></div>
                      <div><FieldLabel>ZIP</FieldLabel><TextInput placeholder="ZIP Code"/></div>
                    </div>
                  </div>
                  {/* Classification */}
                  <div style={{ marginBottom: 22 }}>
                    <SectionTitle>Classification</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      <div><FieldLabel>Dispenser Class</FieldLabel><MultiSelect options={DISPENSER_CLASSES} height={100}/></div>
                      <div><FieldLabel>Provider Type</FieldLabel><MultiSelect options={PROVIDER_TYPES} height={100}/></div>
                      <div><FieldLabel>Relationship / Network</FieldLabel><MultiSelect options={RELATIONSHIPS} height={100}/></div>
                    </div>
                  </div>
                  {/* Date Ranges & Status */}
                  <div>
                    <SectionTitle>Date Ranges & Status</SectionTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                      <DateRange label="Open Date"/>
                      <DateRange label="Close Date"/>
                      <div><FieldLabel>Status</FieldLabel><Select><option>Active</option><option>Inactive</option><option>All</option></Select></div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#334155', cursor: 'pointer' }}>
                          <input type="checkbox" style={{ width: 15, height: 15 }}/>
                          Include Inactive
                        </label>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {advSearched
                ? <DataTable columns={PHARM_COLS} data={PHARMACY_RESULTS}/>
                : <EmptyState icon={<IconFilter size={22} color="#818CF8"/>} title="No results yet" subtitle="Set your filter criteria above and click Search to query the pharmacy database"/>
              }
            </div>
          )}


        </div>
      </main>
    </>
  );
}
