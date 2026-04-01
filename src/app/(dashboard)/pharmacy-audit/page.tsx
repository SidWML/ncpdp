'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FieldLabel, TextInput, Select, MultiSelect, DateRange, SectionTitle } from '@/components/ui/FormFields';
import { DataTable, EmptyState, CellMono, CellBold, CellMuted, CellStatus, CellViewBtn } from '@/components/ui/DataTable';
import type { ColumnDef } from '@/components/ui/DataTable';
import { IconSearch, IconRefresh, IconFilter, IconDownload, IconSparkles } from '@/components/ui/Icons';
import { AgentChat } from '@/components/ui/AgentChat';
import { DISPENSER_CLASSES, PROVIDER_TYPES, RELATIONSHIPS, US_STATES, SEARCH_BY_OPTIONS } from '@/lib/filter-options';

type PharmRow = { ncpdp: string; name: string; city: string; state: string; phone: string; status: string; type: string };
const RESULTS: PharmRow[] = [
  { ncpdp: '1234567', name: 'CareRx Pharmacy #0842',        city: 'Los Angeles',   state: 'CA', phone: '(213) 555-0198', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '2345678', name: 'SpecialtyRx Partners LLC',      city: 'Houston',       state: 'TX', phone: '(713) 555-0412', status: 'Active',   type: 'Specialty' },
  { ncpdp: '3456789', name: 'MediCare Express Pharmacy',     city: 'Phoenix',       state: 'AZ', phone: '(602) 555-0837', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '4567890', name: 'Coastal Health Pharmacy',       city: 'Miami',         state: 'FL', phone: '(305) 555-0291', status: 'Active',   type: 'Compounding' },
  { ncpdp: '5678901', name: 'Alpine Specialty Dispensary',   city: 'Denver',        state: 'CO', phone: '(720) 555-0543', status: 'Inactive', type: 'Specialty' },
  { ncpdp: '6789012', name: 'Midwest Chain Pharmacy #44',    city: 'Chicago',       state: 'IL', phone: '(312) 555-0871', status: 'Active',   type: 'Chain' },
  { ncpdp: '7890123', name: 'SunHealth Compounding Center',  city: 'Orlando',       state: 'FL', phone: '(407) 555-0654', status: 'Active',   type: 'Compounding' },
  { ncpdp: '8901234', name: 'Pacific Infusion Services',     city: 'Seattle',       state: 'WA', phone: '(206) 555-0923', status: 'Active',   type: 'Infusion' },
  { ncpdp: '9012345', name: 'Capital Area Pharmacy Group',   city: 'Washington',    state: 'DC', phone: '(202) 555-0182', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '0123456', name: 'Northeast Specialty Rx',        city: 'Boston',        state: 'MA', phone: '(617) 555-0764', status: 'Inactive', type: 'Specialty' },
  { ncpdp: '1234568', name: 'Valley Pharmacy Solutions',     city: 'Nashville',     state: 'TN', phone: '(615) 555-0342', status: 'Active',   type: 'Community/Retail' },
  { ncpdp: '2345679', name: 'Lone Star Rx Network',          city: 'Dallas',        state: 'TX', phone: '(214) 555-0598', status: 'Active',   type: 'Chain' },
];

const COLS: ColumnDef<PharmRow>[] = [
  { accessorKey: 'name',   header: 'Pharmacy DBA Name',  cell: ({ row }) => <span style={{ fontWeight: 500, color: '#111827' }}>{row.original.name}</span> },
  { accessorKey: 'ncpdp',  header: 'NCPDP Provider ID',  cell: ({ row }) => <CellMono>{row.original.ncpdp}</CellMono> },
  { accessorKey: 'city',   header: 'City',               cell: ({ row }) => <CellMuted>{row.original.city}</CellMuted> },
  { accessorKey: 'state',  header: 'State',              cell: ({ row }) => <CellBold>{row.original.state}</CellBold> },
  { accessorKey: 'phone',  header: 'Main Phone',         cell: ({ row }) => <CellMuted>{row.original.phone}</CellMuted> },
  { accessorKey: 'status', header: 'Status',             cell: ({ row }) => <CellStatus active={row.original.status === 'Active'}/> },
  { id: 'action',          header: 'Action',             cell: () => <CellViewBtn/>, enableSorting: false },
];

export default function PharmacyAuditPage() {
  const [searched, setSearched] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <>
      <Topbar
        title="Pharmacy Audit"
        subtitle="Search and audit pharmacy records with detailed filters"
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
      <main style={{ display: 'flex', height: `calc(100vh - var(--topbar-h))`, padding: '0 20px' }}>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ padding: '14px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Search Pharmacy Audit</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>Filter across the full pharmacy database with multi-select criteria</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" onClick={() => setSearched(true)} style={{ gap: 6, fontSize: 12, padding: '8px 24px' }}>
                  <IconSearch size={13} color="#fff"/> Search
                </button>
                <button className="btn-secondary" onClick={() => setSearched(false)} style={{ gap: 6, fontSize: 12, padding: '8px 20px' }}>
                  <IconRefresh size={13}/> Reset
                </button>
              </div>
            </div>
            <CardBody style={{ padding: '20px 24px 24px' }}>
              <div style={{ marginBottom: 22 }}>
                <SectionTitle>Primary Search</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 140px 140px', gap: 10 }}>
                  <div><FieldLabel>Search by</FieldLabel><Select>{SEARCH_BY_OPTIONS.map(o => <option key={o}>{o}</option>)}</Select></div>
                  <div><FieldLabel>Search Value</FieldLabel><TextInput placeholder="Enter search value..."/></div>
                  <div><FieldLabel>From Date</FieldLabel><TextInput placeholder="MM/DD/YYYY"/></div>
                  <div><FieldLabel>To Date</FieldLabel><TextInput placeholder="MM/DD/YYYY"/></div>
                </div>
              </div>
              <div style={{ marginBottom: 22 }}>
                <SectionTitle>Details</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                  <div><FieldLabel>Pharmacy DBA Name</FieldLabel><TextInput placeholder="DBA Name"/></div>
                  <div><FieldLabel>Address</FieldLabel><TextInput placeholder="Street address"/></div>
                  <div><FieldLabel>Store Number</FieldLabel><TextInput placeholder="Store #"/></div>
                  <div><FieldLabel>City</FieldLabel><TextInput placeholder="City"/></div>
                </div>
              </div>
              <div style={{ marginBottom: 22 }}>
                <SectionTitle>Location & Classification</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                  <div><FieldLabel>State</FieldLabel><MultiSelect options={US_STATES} height={88}/></div>
                  <div><FieldLabel>Dispenser Class</FieldLabel><MultiSelect options={DISPENSER_CLASSES} height={88}/></div>
                  <div><FieldLabel>Provider Type</FieldLabel><MultiSelect options={PROVIDER_TYPES} height={88}/></div>
                  <div><FieldLabel>Relationship</FieldLabel><MultiSelect options={RELATIONSHIPS} height={88}/></div>
                </div>
              </div>
              <div>
                <SectionTitle>Date Ranges & Status</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                  <DateRange label="Open Date"/>
                  <DateRange label="Close Date"/>
                  <div><FieldLabel>ZIP</FieldLabel><TextInput placeholder="ZIP Code"/></div>
                  <div><FieldLabel>Status</FieldLabel><Select><option>Active</option><option>Inactive</option><option>All</option></Select></div>
                </div>
              </div>
            </CardBody>
          </Card>

          {searched
            ? <DataTable columns={COLS} data={RESULTS}/>
            : <EmptyState icon={<IconFilter size={22} color="#5B9BD5"/>} title="No results yet" subtitle="Set your filter criteria above and click Search to audit pharmacy records"/>
          }
        </div>

        {agentOpen && (
          <AgentChat
            agentName="Audit Agent"
            agentId="AGT-12"
            gradient="linear-gradient(135deg,#2968B0,#5B9BD5)"
            welcomeMessage="Hi Sarah! I'm your Pharmacy Audit Agent. I can search and audit pharmacy records, flag compliance issues, and generate audit reports. What would you like to audit today?"
            suggestions={[
              'Show all pharmacies that changed status in the last 90 days',
              'Find pharmacies with expired DEA in California',
              'Audit all specialty pharmacies opened after Jan 2024',
              'List pharmacies missing provider type classification',
            ]}
          />
        )}
      </main>
    </>
  );
}
