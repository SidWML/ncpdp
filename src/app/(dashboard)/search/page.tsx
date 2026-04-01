'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardBody } from '@/components/ui/Card';
import { FieldLabel, TextInput, Select, MultiSelect, DateRange, SectionTitle } from '@/components/ui/FormFields';
import { DataTable, EmptyState, CellMono, CellBold, CellMuted, CellStatus, CellViewBtn } from '@/components/ui/DataTable';
import type { ColumnDef } from '@/components/ui/DataTable';
import { IconSearch, IconRefresh, IconFilter, IconDownload } from '@/components/ui/Icons';
import {
  DISPENSER_CLASSES, PROVIDER_TYPES, RELATIONSHIPS, US_STATES, SEARCH_BY_OPTIONS,
} from '@/lib/filter-options';

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

/* ─── Page ────────────────────────────────────────────────────────── */
export default function SearchPage() {
  const [searched, setSearched] = useState(false);

  return (
    <>
      <Topbar
        title="WebConnect"
        subtitle="Pharmacy search, lookup, and real-time verification"
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary" style={{ fontSize: 12, gap: 5 }}><IconDownload size={13}/> Export Results</button>
          </div>
        }
      />
      <main style={{ padding: '16px 20px 40px' }}>

        {/* Search form */}
        <Card style={{ marginBottom: 14 }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1B2B6B' }}>Pharmacy Audit Search</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>Search with detailed filters across the entire pharmacy database</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={() => setSearched(true)} style={{ gap: 6, fontSize: 12.5, padding: '7px 22px' }}>
                <IconSearch size={13} color="#fff"/> Search
              </button>
              <button className="btn-secondary" onClick={() => setSearched(false)} style={{ gap: 6, fontSize: 12.5, padding: '7px 18px' }}>
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

        {/* Results */}
        {searched
          ? <DataTable columns={PHARM_COLS} data={PHARMACY_RESULTS}/>
          : <EmptyState icon={<IconFilter size={22} color="#818CF8"/>} title="No results yet" subtitle="Set your filter criteria above and click Search to query the pharmacy database"/>
        }
      </main>
    </>
  );
}
