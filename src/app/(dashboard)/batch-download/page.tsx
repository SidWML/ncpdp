'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardBody } from '@/components/ui/Card';
import { FieldLabel, TextInput, Select, MultiSelect } from '@/components/ui/FormFields';
import { IconSearch, IconRefresh, IconDownload, IconX, IconSparkles } from '@/components/ui/Icons';
import { AgentChat } from '@/components/ui/AgentChat';
import { RELATIONSHIPS, US_STATES } from '@/lib/filter-options';

const RESULTS = [
  { ncpdp: '1234567', name: 'CareRx Pharmacy #0842',        store: '842', npi: '1023847291' },
  { ncpdp: '2345678', name: 'SpecialtyRx Partners LLC',      store: '001', npi: '2049182374' },
  { ncpdp: '3456789', name: 'MediCare Express Pharmacy',     store: '112', npi: '3012847563' },
  { ncpdp: '4567890', name: 'Coastal Health Pharmacy',       store: '203', npi: '4028374921' },
  { ncpdp: '5678901', name: 'Alpine Specialty Dispensary',   store: '047', npi: '5019283847' },
  { ncpdp: '6789012', name: 'Midwest Chain Pharmacy #44',    store: '044', npi: '6028374192' },
  { ncpdp: '7890123', name: 'SunHealth Compounding Center',  store: '301', npi: '7019283746' },
  { ncpdp: '8901234', name: 'Pacific Infusion Services',     store: '188', npi: '8028374019' },
  { ncpdp: '9012345', name: 'Capital Area Pharmacy Group',   store: '005', npi: '9019283741' },
  { ncpdp: '0123456', name: 'Northeast Specialty Rx',        store: '072', npi: '1023847292' },
];

export default function BatchDownloadPage() {
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [agentOpen, setAgentOpen] = useState(false);

  function toggleSelect(ncpdp: string) {
    setSelected(s => s.includes(ncpdp) ? s.filter(x => x !== ncpdp) : s.length < 50 ? [...s, ncpdp] : s);
  }
  const selectedPharmacies = RESULTS.filter(r => selected.includes(r.ncpdp));

  return (
    <>
      <Topbar
        title="Document Batch Download"
        subtitle="Search pharmacies and download credential documents in bulk (up to 50)"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" onClick={() => setAgentOpen(o => !o)} style={{ fontSize: 12, gap: 5 }}>
              <IconSparkles size={14}/> {agentOpen ? 'Hide' : 'Ask'} Agent
            </button>
            <a href="#" style={{ fontSize: 12, color: '#4F46E5', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              Download Instructions
            </a>
          </div>
        }
      />
      <main style={{ display: 'flex', height: `calc(100vh - var(--topbar-h))`, padding: '0 20px' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>

          {/* Search form */}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1B2B6B' }}>Search Pharmacy</div>
            </div>
            <CardBody style={{ padding: '18px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 12 }}>
                <div><FieldLabel>NCPDP ID</FieldLabel><TextInput placeholder="NCPDP ID"/></div>
                <div><FieldLabel>Pharmacy Key</FieldLabel><TextInput placeholder="Pharmacy Key"/></div>
                <div><FieldLabel>DBA Name</FieldLabel><TextInput placeholder="DBA Name"/></div>
                <div><FieldLabel>Store #</FieldLabel><TextInput placeholder="Store"/></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 12 }}>
                <div><FieldLabel>Federal Tax ID</FieldLabel><TextInput placeholder="Federal Tax ID"/></div>
                <div><FieldLabel>State License</FieldLabel><TextInput placeholder="State License"/></div>
                <div><FieldLabel>NPI #</FieldLabel><TextInput placeholder="NPI"/></div>
                <div><FieldLabel>DEA #</FieldLabel><TextInput placeholder="DEA"/></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 12 }}>
                <div><FieldLabel>Address</FieldLabel><TextInput placeholder="Address"/></div>
                <div><FieldLabel>City</FieldLabel><TextInput placeholder="City"/></div>
                <div><FieldLabel>State</FieldLabel><Select><option>-- Select State --</option>{US_STATES.map(s => <option key={s}>{s}</option>)}</Select></div>
                <div><FieldLabel>ZIP</FieldLabel><TextInput placeholder="ZIP"/></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 18 }}>
                <div><FieldLabel>Phone #</FieldLabel><TextInput placeholder="Phone"/></div>
                <div><FieldLabel>Fax #</FieldLabel><TextInput placeholder="Fax"/></div>
                <div><FieldLabel>Relationship</FieldLabel><MultiSelect options={RELATIONSHIPS} height={70}/></div>
                <div><FieldLabel>Status</FieldLabel><Select><option>Active</option><option>Inactive</option><option>All</option></Select></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                <button className="btn-primary" onClick={() => setSearched(true)} style={{ gap: 6, fontSize: 13, padding: '7px 24px' }}>
                  <IconSearch size={14} color="#fff"/> Search
                </button>
                <button className="btn-secondary" onClick={() => { setSearched(false); setSelected([]); }} style={{ gap: 6, fontSize: 13, padding: '7px 20px' }}>
                  <IconRefresh size={14}/> Reset
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Dual panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Left: Search results */}
            <Card>
              <div style={{ padding: '10px 16px', background: '#1B2B6B', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>Searched Pharmacies</span>
                {searched && (
                  <button onClick={() => setSelected(RESULTS.map(r => r.ncpdp))} style={{
                    padding: '3px 10px', borderRadius: 5, border: '1px solid #C7D2FE',
                    background: '#EEF2FF', color: '#4F46E5', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}>Select All</button>
                )}
              </div>
              <CardBody style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <th style={{ width: 36, padding: '8px 12px' }}/>
                      {['Pharmacy Name','NCPDP ID','Store #','NPI'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: '#475569' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {!searched ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: 28, color: '#94A3B8', fontStyle: 'italic', fontSize: 12 }}>No records to display.</td></tr>
                    ) : RESULTS.map((r, i) => (
                      <tr key={r.ncpdp} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA', borderTop: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '7px 12px', textAlign: 'center' }}>
                          <input type="checkbox" checked={selected.includes(r.ncpdp)} onChange={() => toggleSelect(r.ncpdp)} style={{ width: 14, height: 14, cursor: 'pointer' }}/>
                        </td>
                        <td style={{ padding: '7px 10px', fontWeight: 500, color: '#1E293B', fontSize: 12 }}>{r.name}</td>
                        <td style={{ padding: '7px 10px', fontFamily: 'monospace', color: '#4F46E5', fontWeight: 700, fontSize: 11 }}>{r.ncpdp}</td>
                        <td style={{ padding: '7px 10px', color: '#64748B' }}>{r.store}</td>
                        <td style={{ padding: '7px 10px', fontFamily: 'monospace', color: '#64748B', fontSize: 11 }}>{r.npi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>

            {/* Right: Selected */}
            <Card>
              <div style={{ padding: '10px 16px', background: '#1B2B6B', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>
                  Selected for Download <span style={{ fontWeight: 400, opacity: .7 }}>(max 50)</span>
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setSelected([])} style={{ padding: '3px 10px', borderRadius: 5, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Clear</button>
                  <button disabled={selected.length === 0} style={{
                    padding: '3px 12px', borderRadius: 5, border: 'none', fontSize: 11, fontWeight: 700,
                    cursor: selected.length > 0 ? 'pointer' : 'default',
                    background: selected.length > 0 ? '#10B981' : '#6B7280', color: '#fff',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}><IconDownload size={11} color="#fff"/> Next</button>
                </div>
              </div>
              <CardBody style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      {['Pharmacy Name','NCPDP Provider ID','Remove'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 11, color: '#475569' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPharmacies.length === 0 ? (
                      <tr><td colSpan={3} style={{ textAlign: 'center', padding: 28, color: '#94A3B8', fontStyle: 'italic', fontSize: 12 }}>No records to display.</td></tr>
                    ) : selectedPharmacies.map((r, i) => (
                      <tr key={r.ncpdp} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA', borderTop: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '7px 12px', fontWeight: 500, color: '#1E293B', fontSize: 12 }}>{r.name}</td>
                        <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#4F46E5', fontSize: 11 }}>{r.ncpdp}</td>
                        <td style={{ padding: '7px 12px' }}>
                          <button onClick={() => setSelected(s => s.filter(x => x !== r.ncpdp))} style={{
                            width: 22, height: 22, borderRadius: 4, border: '1px solid #FECACA',
                            background: '#FEE2E2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}><IconX size={11} color="#DC2626"/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {selected.length > 0 && (
                  <div style={{ padding: '6px 12px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', fontSize: 11, color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong style={{ color: '#4F46E5' }}>{selected.length}</strong> selected</span>
                    <span>{50 - selected.length} slots remaining</span>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        {agentOpen && (
          <AgentChat
            agentName="Download Agent"
            agentId="AGT-14"
            gradient="linear-gradient(135deg,#10B981,#06B6D4)"
            welcomeMessage="Hi Sarah! I'm your Document Download Agent. I can help you find pharmacies and batch-download their credential documents. Tell me what you need!"
            suggestions={[
              'Download all documents for pharmacies in California',
              'Find and batch-download credential docs for specialty pharmacies',
              'Get DEA documents for all pharmacies in my network',
              'Download CHOW documents for recent ownership changes',
            ]}
          />
        )}
      </main>
    </>
  );
}
