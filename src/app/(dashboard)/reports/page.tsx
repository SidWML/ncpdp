'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import {
  IconDownload, IconRefresh, IconSearch,
} from '@/components/ui/Icons';
import { FieldLabel, TextInput, Select, DateRange, Accordion } from '@/components/ui/FormFields';
import {
  DISPENSER_CLASSES, PROVIDER_TYPES, RELATIONSHIPS, SERVICES,
  ORDER_BY_OPTIONS,
} from '@/lib/filter-options';

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

/* ─── Main page ──────────────────────────────────────────────────── */
export default function ReportsPage() {
  const [reporting, setReporting] = useState(false);
  const [reported,  setReported]  = useState(false);
  const [orderBy, setOrderBy]     = useState('Pharmacy NCPDP No');
  const [statusFilter, setStatusFilter] = useState('Active NCPDP IDs');
  const [perPage, setPerPage]     = useState(20);
  const [page, setPage]           = useState(0);

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
        title="OnDemand Query"
        subtitle="DataSolutions OnDemand — pharmacy data reporting with advanced filters"
        actions={
          <button className="btn-secondary" style={{ fontSize: 12, gap: 5 }}>
            <IconDownload size={13}/> Download All
          </button>
        }
      />
      <main style={{ padding: '16px 20px 40px' }}>
        <Card style={{ marginBottom: 16 }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>DataSolutions OnDemand</div>
          </div>
          <CardBody style={{ padding: '16px 20px 20px' }}>
            <Accordion title="Relationship & Provider" defaultOpen>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 12 }}>
                <div><FieldLabel>Relationship Type</FieldLabel><Select><option>--All--</option><option>Member</option><option>Network</option><option>Preferred</option></Select></div>
                <div><FieldLabel>Provider Type</FieldLabel><Select><option>--Select Provider Type--</option>{PROVIDER_TYPES.map(o => <option key={o}>{o}</option>)}</Select></div>
                <div><FieldLabel>Languages</FieldLabel><Select><option>--Select--</option><option>English</option><option>Spanish</option><option>Chinese</option><option>French</option></Select></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div><FieldLabel>Group Keys</FieldLabel><TextInput placeholder="Enter group key(s)"/></div>
                <div><FieldLabel>Payment Center</FieldLabel><Select><option>--All--</option><option>CVS CAREMARK</option><option>EXPRESS SCRIPTS</option><option>OPTUMRX</option></Select></div>
                <div><FieldLabel>Relationship Name</FieldLabel><Select><option>--All--</option>{RELATIONSHIPS.map(o => <option key={o}>{o}</option>)}</Select></div>
              </div>
            </Accordion>
            <Accordion title="Location & Classification">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 12 }}>
                <div><FieldLabel>Parent Organization</FieldLabel><Select><option>--All--</option><option>CVS Health</option><option>Walgreens Boots Alliance</option><option>Rite Aid</option></Select></div>
                <div><FieldLabel>State</FieldLabel><Select><option>--Select--</option><option>Alabama</option><option>Alaska</option><option>Arizona</option><option>California</option><option>Colorado</option><option>Florida</option><option>Georgia</option><option>Illinois</option><option>Michigan</option><option>New York</option><option>Ohio</option><option>Pennsylvania</option><option>Texas</option><option>Washington</option></Select></div>
                <div><FieldLabel>City</FieldLabel><TextInput placeholder="City"/></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
                <div><FieldLabel>Dispenser Class</FieldLabel><Select><option>--All--</option>{DISPENSER_CLASSES.map(o => <option key={o}>{o}</option>)}</Select></div>
                <div><FieldLabel>Services Available</FieldLabel><Select><option>--Select Service--</option>{SERVICES.map(o => <option key={o}>{o}</option>)}</Select></div>
                <div><FieldLabel>Zip</FieldLabel><TextInput placeholder="ZIP Code"/></div>
                <div><FieldLabel>County Code</FieldLabel><TextInput placeholder="County Code"/></div>
              </div>
            </Accordion>
            <Accordion title="Additional Filters">
              <div style={{ display: 'grid', gridTemplateColumns: '180px 180px 180px 1fr', gap: 14, alignItems: 'end' }}>
                <div><FieldLabel>24/7</FieldLabel><Select><option>--All--</option><option>Yes</option><option>No</option></Select></div>
                <div><FieldLabel>MSA</FieldLabel><TextInput placeholder="MSA Code"/></div>
                <div><FieldLabel>PMSA</FieldLabel><TextInput placeholder="PMSA Code"/></div>
                <div style={{ paddingBottom: 6 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: 14, height: 14 }}/> Include Inactive Relation
                  </label>
                </div>
              </div>
            </Accordion>
            <Accordion title="Date Ranges & Output">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 12 }}>
                <DateRange label="Relationship Start"/><DateRange label="Relationship End"/><DateRange label="Open Date"/><DateRange label="Close Date"/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 14 }}>
                <div><FieldLabel>Order By</FieldLabel><Select value={orderBy} onChange={e => setOrderBy(e.target.value)}>{ORDER_BY_OPTIONS.map(o => <option key={o}>{o}</option>)}</Select></div>
                <div><FieldLabel>Status</FieldLabel><Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>Active NCPDP IDs</option><option>Inactive NCPDP IDs</option><option>All NCPDP IDs</option></Select></div>
              </div>
            </Accordion>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
              <button className="btn-primary" onClick={handleViewReport} disabled={reporting} style={{ gap: 6, padding: '8px 28px', minWidth: 130 }}>
                {reporting ? <><IconRefresh size={14} color="#fff"/> Querying...</> : <><IconSearch size={14} color="#fff"/> View Report</>}
              </button>
              <button className="btn-secondary" onClick={() => { setReported(false); setPage(0); }} style={{ gap: 6, padding: '8px 24px' }}>
                <IconRefresh size={14}/> Reset
              </button>
            </div>
          </CardBody>
        </Card>

        {reported && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>Report Results — <span style={{ color: '#76C799' }}>{total.toLocaleString()} records found</span></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" style={{ fontSize: 12, gap: 4 }}><IconDownload size={12}/> Export CSV</button>
                <button className="btn-secondary" style={{ fontSize: 12, gap: 4 }}><IconDownload size={12}/> Export PDF</button>
              </div>
            </div>
            <div style={{ borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden', background: '#fff' }}>
              <table>
                <thead><tr>{['Pharmacy DBA Name','NCPDP Provider ID','Rel. Type','City','State','Dispenser Class','Open Date','Status'].map(h => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {visible.map(r => (
                    <tr key={r.ncpdp}>
                      <td style={{ fontWeight: 500 }}>{r.name}</td>
                      <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#005C8D', fontSize: 13 }}>{r.ncpdp}</td>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderTop: 'none', borderRadius: '0 0 8px 8px', fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
                <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(0); }} style={{ padding: '3px 6px', borderRadius: 4, border: '1px solid #CBD5E1', fontSize: 12, color: '#334155' }}>
                  {[20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span>items per page</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748B' }}>
                <span>{page * perPage + 1} – {Math.min(page * perPage + perPage, total)} of {total} items</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[
                    { lbl: '«', fn: () => setPage(0), dis: page === 0 },
                    { lbl: '‹', fn: () => setPage(page - 1), dis: page === 0 },
                    { lbl: '›', fn: () => setPage(page + 1), dis: page >= totalPages - 1 },
                    { lbl: '»', fn: () => setPage(totalPages - 1), dis: page >= totalPages - 1 },
                  ].map(b => (
                    <button key={b.lbl} onClick={b.fn} disabled={b.dis} style={{ width: 26, height: 26, borderRadius: 4, border: '1px solid #CBD5E1', background: b.dis ? '#F1F5F9' : '#fff', color: b.dis ? '#CBD5E1' : '#334155', fontSize: 13, fontWeight: 600, cursor: b.dis ? 'default' : 'pointer' }}>{b.lbl}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!reported && !reporting && (
          <div style={{ textAlign: 'center', padding: '48px 20px', border: '1px solid #E2E8F0', borderRadius: 8, background: '#FAFAFA' }}>
            <IconSearch size={36} color="#CBD5E1"/>
            <div style={{ marginTop: 12, fontSize: 13, color: '#CBD5E1', fontWeight: 600 }}>Set your query criteria above and click View Report</div>
          </div>
        )}
      </main>
    </>
  );
}
