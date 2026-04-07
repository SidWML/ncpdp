'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardBody } from '@/components/ui/Card';
import { FieldLabel, TextInput, Select, MultiSelect, DateRange, Accordion } from '@/components/ui/FormFields';
import { DataTable, EmptyState, CellMono, CellBold, CellMuted, CellStatus, CellViewBtn } from '@/components/ui/DataTable';
import type { ColumnDef } from '@/components/ui/DataTable';
import { IconSearch, IconRefresh, IconFilter, IconDownload } from '@/components/ui/Icons';
import {
  DISPENSER_CLASSES, PROVIDER_TYPES, RELATIONSHIPS, US_STATES, SEARCH_BY_OPTIONS,
} from '@/lib/filter-options';

/* ─── Static mock data ───────────────────────────────────────────── */
type PharmRow = { ncpdp: string; name: string; city: string; state: string; phone: string; status: string; type: string };
const PHARMACY_RESULTS: PharmRow[] = [
  { ncpdp: '0512345', name: 'Option Care Health',              city: 'Los Angeles',    state: 'CA', phone: '(213) 482-0198', status: 'Active',   type: 'Specialty' },
  { ncpdp: '0534567', name: 'Diplomat Pharmacy',               city: 'San Diego',      state: 'CA', phone: '(619) 231-4120', status: 'Active',   type: 'Specialty' },
  { ncpdp: '0578901', name: 'Rite Aid Pharmacy #5741',         city: 'San Francisco',  state: 'CA', phone: '(415) 362-2370', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '0545678', name: 'Alto Pharmacy',                   city: 'Oakland',        state: 'CA', phone: '(510) 879-4530', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '0589012', name: 'PharMerica Corporation',          city: 'San Jose',       state: 'CA', phone: '(408) 573-8370', status: 'Active',   type: 'Long-Term Care' },
  { ncpdp: '0556789', name: 'BrightSpring Health Services',    city: 'Sacramento',     state: 'CA', phone: '(916) 443-7230', status: 'Active',   type: 'Specialty' },
  { ncpdp: '0523456', name: 'Omnicare Pharmacy',               city: 'Fresno',         state: 'CA', phone: '(559) 229-3100', status: 'Active',   type: 'Long-Term Care' },
  { ncpdp: '0501234', name: 'CarePharma Holdings',             city: 'Long Beach',     state: 'CA', phone: '(562) 435-9230', status: 'Active',   type: 'Specialty' },
  { ncpdp: '2810042', name: 'Accredo Health Group',            city: 'Houston',        state: 'TX', phone: '(713) 654-4120', status: 'Active',   type: 'Specialty' },
  { ncpdp: '3401298', name: 'BioScrip Infusion Services',     city: 'Phoenix',        state: 'AZ', phone: '(602) 285-8370', status: 'Active',   type: 'Infusion' },
  { ncpdp: '1209834', name: 'Kindred Healthcare Pharmacy',    city: 'Chicago',        state: 'IL', phone: '(312) 476-8710', status: 'Active',   type: 'Long-Term Care' },
  { ncpdp: '5920187', name: 'Genoa Healthcare Pharmacy',      city: 'Miami',          state: 'FL', phone: '(305) 374-2910', status: 'Active',   type: 'Specialty' },
  { ncpdp: '0412893', name: 'Coram CVS Specialty Infusion',   city: 'Denver',         state: 'CO', phone: '(720) 891-5430', status: 'Active',   type: 'Infusion' },
  { ncpdp: '6701245', name: 'Shields Health Solutions',        city: 'Boston',         state: 'MA', phone: '(617) 610-7640', status: 'Active',   type: 'Specialty' },
  { ncpdp: '8832014', name: 'AdhereHealth Pharmacy',          city: 'Nashville',      state: 'TN', phone: '(615) 921-3420', status: 'Active',   type: 'Specialty' },
  { ncpdp: '2345890', name: 'Maxor National Pharmacy',        city: 'Dallas',         state: 'TX', phone: '(214) 631-5980', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '4519827', name: 'ProCare Pharmacy',               city: 'Seattle',        state: 'WA', phone: '(206) 832-9230', status: 'Active',   type: 'Specialty' },
  { ncpdp: '7623041', name: 'Orsini Specialty Pharmacy',      city: 'New York',       state: 'NY', phone: '(212) 389-4470', status: 'Active',   type: 'Specialty' },
  { ncpdp: '3290156', name: 'OnePoint Patient Care',          city: 'Atlanta',        state: 'GA', phone: '(404) 753-6890', status: 'Active',   type: 'Long-Term Care' },
  { ncpdp: '9014523', name: 'PharMerica Pittsburgh',          city: 'Pittsburgh',     state: 'PA', phone: '(412) 562-8210', status: 'Active',   type: 'Long-Term Care' },
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
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Pharmacy Audit Search</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>Search with detailed filters across the entire pharmacy database</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={() => setSearched(true)} style={{ gap: 6, fontSize: 13, padding: '8px 24px' }}>
                <IconSearch size={13} color="#fff"/> Search
              </button>
              <button className="btn-secondary" onClick={() => setSearched(false)} style={{ gap: 6, fontSize: 13, padding: '8px 20px' }}>
                <IconRefresh size={13}/> Reset
              </button>
            </div>
          </div>
          <CardBody style={{ padding: '16px 20px 20px' }}>
            <Accordion title="Primary Search" defaultOpen>
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
            </Accordion>
            <Accordion title="Location">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                <div><FieldLabel>Address</FieldLabel><TextInput placeholder="Street address"/></div>
                <div><FieldLabel>City</FieldLabel><TextInput placeholder="City"/></div>
                <div><FieldLabel>State</FieldLabel><MultiSelect options={US_STATES} height={88}/></div>
                <div><FieldLabel>ZIP</FieldLabel><TextInput placeholder="ZIP Code"/></div>
              </div>
            </Accordion>
            <Accordion title="Classification">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div><FieldLabel>Dispenser Class</FieldLabel><MultiSelect options={DISPENSER_CLASSES} height={100}/></div>
                <div><FieldLabel>Provider Type</FieldLabel><MultiSelect options={PROVIDER_TYPES} height={100}/></div>
                <div><FieldLabel>Relationship / Network</FieldLabel><MultiSelect options={RELATIONSHIPS} height={100}/></div>
              </div>
            </Accordion>
            <Accordion title="Date Ranges & Status">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                <DateRange label="Open Date"/>
                <DateRange label="Close Date"/>
                <div><FieldLabel>Status</FieldLabel><Select><option>Active</option><option>Inactive</option><option>All</option></Select></div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: 15, height: 15 }}/>
                    Include Inactive
                  </label>
                </div>
              </div>
            </Accordion>
          </CardBody>
        </Card>

        {/* Results */}
        {searched
          ? <DataTable columns={PHARM_COLS} data={PHARMACY_RESULTS}/>
          : <EmptyState icon={<IconFilter size={22} color="#5B9BD5"/>} title="No results yet" subtitle="Set your filter criteria above and click Search to query the pharmacy database"/>
        }
      </main>
    </>
  );
}
