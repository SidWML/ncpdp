'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import {
  IconFolder, IconZap, IconDatabase, IconWebhook, IconSearch, IconRefresh,
  IconDownload, IconCheck, IconX,
} from '@/components/ui/Icons';
import { FieldLabel, TextInput, Select, MultiSelect } from '@/components/ui/FormFields';
import { RELATIONSHIPS } from '@/lib/filter-options';

/* ─── Delivery methods ───────────────────────────────────────────── */
const deliveryMethods = [
  {
    name: 'SFTP File Delivery',
    status: 'active',
    desc: 'Legacy monthly flat file delivery via secure FTP',
    files: ['Full file (monthly)', 'Delta file (monthly)'],
    freshness: 'Monthly',
    Icon: IconFolder,
    iconBg: '#F0F7FF',
    iconColor: '#2968B0',
    tier: 'Essential+',
  },
  {
    name: 'REST API',
    status: 'active',
    desc: 'Modern RESTful pharmacy data endpoints',
    files: ['Single lookup', 'Bulk (up to 1,000)', 'Delta feed'],
    freshness: 'Daily / Real-time',
    Icon: IconZap,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    tier: 'Professional+',
  },
  {
    name: 'GraphQL API',
    status: 'active',
    desc: 'Flexible queries — request exactly the fields you need',
    files: ['Custom queries', 'Mutations', 'Subscriptions'],
    freshness: 'Real-time',
    Icon: IconDatabase,
    iconBg: '#D1FAE5',
    iconColor: '#059669',
    tier: 'Enterprise',
  },
  {
    name: 'Webhooks',
    status: 'coming',
    desc: 'Push notifications on pharmacy data change events',
    files: ['Pharmacy updates', 'Credential changes', 'Closures'],
    freshness: 'Instant',
    Icon: IconWebhook,
    iconBg: '#F0F7FF',
    iconColor: '#2968B0',
    tier: 'Enterprise',
  },
];

/* ─── Batch download mock data ───────────────────────────────────── */
const BATCH_RESULTS = [
  { ncpdp: '1234567', name: 'CareRx Pharmacy #0842',        store: '842',  npi: '1023847291' },
  { ncpdp: '2345678', name: 'SpecialtyRx Partners LLC',      store: '001',  npi: '2049182374' },
  { ncpdp: '3456789', name: 'MediCare Express Pharmacy',     store: '112',  npi: '3012847563' },
  { ncpdp: '4567890', name: 'Coastal Health Pharmacy',       store: '203',  npi: '4028374921' },
  { ncpdp: '5678901', name: 'Alpine Specialty Dispensary',   store: '047',  npi: '5019283847' },
  { ncpdp: '6789012', name: 'Midwest Chain Pharmacy #44',    store: '044',  npi: '6028374192' },
  { ncpdp: '7890123', name: 'SunHealth Compounding Center',  store: '301',  npi: '7019283746' },
  { ncpdp: '8901234', name: 'Pacific Infusion Services',     store: '188',  npi: '8028374019' },
  { ncpdp: '9012345', name: 'Capital Area Pharmacy Group',   store: '005',  npi: '9019283741' },
  { ncpdp: '0123456', name: 'Northeast Specialty Rx',        store: '072',  npi: '1023847292' },
];

const apiStats = [
  { label: 'Calls Today',  value: '1.24M',  pct: 67  },
  { label: 'Avg Latency',  value: '182ms',  pct: 36  },
  { label: 'Success Rate', value: '99.94%', pct: 100 },
  { label: 'Quota Used',   value: '67%',    pct: 67  },
];

type DelivTab = 'feeds' | 'batch';

/* Form components + filter constants imported from shared modules */
const FL = FieldLabel;
const Inp = TextInput;
const Sel = Select;

/* ─── Main ───────────────────────────────────────────────────────── */
export default function DeliveryPage() {
  const [tab, setTab]               = useState<DelivTab>('feeds');
  const [batchSearched, setBatchSearched] = useState(false);
  const [selected, setSelected]     = useState<string[]>([]);

  function toggleSelect(ncpdp: string) {
    setSelected(s => s.includes(ncpdp) ? s.filter(x => x !== ncpdp) : s.length < 50 ? [...s, ncpdp] : s);
  }
  function removeSelected(ncpdp: string) {
    setSelected(s => s.filter(x => x !== ncpdp));
  }
  const selectedPharmacies = BATCH_RESULTS.filter(r => selected.includes(r.ncpdp));

  return (
    <>
      <Topbar
        title="Data Feeds"
        subtitle="SFTP · REST API · GraphQL · Webhooks · Batch Download"
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary" style={{ fontSize: 12 }}>API Docs</button>
            <button className="btn-primary"   style={{ fontSize: 12 }}>Manage API Keys</button>
          </div>
        }
      />
      <main style={{ padding: '0 20px 40px' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', background: '#fff' }}>
          {([['feeds','Data Delivery'],['batch','Document Batch Download']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '12px 24px', fontSize: 13, fontWeight: tab === key ? 600 : 500,
              color: tab === key ? '#2968B0' : '#64748B',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: tab === key ? '2px solid #2968B0' : '2px solid transparent', marginBottom: -2,
            }}>{label}</button>
          ))}
        </div>

        <div style={{ paddingTop: 16 }}>

          {/* ── DATA DELIVERY TAB ── */}
          {tab === 'feeds' && (
            <div>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
                {apiStats.map(s => (
                  <div key={s.label} className="card" style={{ padding: '16px 18px' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{s.value}</div>
                    <Progress value={s.pct} color="var(--brand-600)" height={4}/>
                  </div>
                ))}
              </div>

              {/* Delivery methods */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginBottom: 14 }}>
                {deliveryMethods.map(d => (
                  <Card key={d.name}>
                    <CardBody style={{ padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                            background: d.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <d.Icon size={20} color={d.iconColor}/>
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.desc}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Badge variant={d.status === 'active' ? 'success' : 'neutral'} dot={d.status === 'active'}>
                            {d.status === 'active' ? 'Active' : 'Coming Soon'}
                          </Badge>
                          <Badge variant="brand">{d.tier}</Badge>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                        {d.files.map(f => <span key={f} className="badge badge-neutral">{f}</span>)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          Freshness: <strong style={{ color: 'var(--text-primary)' }}>{d.freshness}</strong>
                        </span>
                        <Button variant={d.status === 'active' ? 'primary' : 'secondary'} size="sm">
                          {d.status === 'active' ? 'Configure' : 'Notify Me'}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Migration roadmap */}
              <Card>
                <CardHeader title="SFTP Migration Roadmap" subtitle="Phased transition to modern API delivery"/>
                <CardBody style={{ padding: '16px 20px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                    {[
                      { phase: 'Phase 1', status: 'current', label: 'Keep SFTP + Launch APIs',     desc: 'No disruption. Both run in parallel.' },
                      { phase: 'Phase 2', status: 'next',    label: 'APIs Get Exclusive Features', desc: 'Daily freshness, alerts only via API.' },
                      { phase: 'Phase 3', status: 'future',  label: 'SFTP Marked Legacy',          desc: 'Guided migration support & tooling.' },
                      { phase: 'Phase 4', status: 'future',  label: 'SFTP Retired',                desc: 'Full API delivery, cost savings realized.' },
                    ].map(({ phase, status, label, desc }) => (
                      <div key={phase} style={{
                        padding: 14, borderRadius: 12,
                        border: `1px solid ${status === 'current' ? 'var(--brand-400)' : 'var(--border-light)'}`,
                        background: status === 'current' ? 'var(--brand-50)' : 'var(--surface-2)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: status === 'current' ? 'var(--brand-600)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{phase}</span>
                          {status === 'current' && <Badge variant="brand">Current</Badge>}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* ── DOCUMENT BATCH DOWNLOAD TAB ── */}
          {tab === 'batch' && (
            <div>
              {/* Search pharmacy form */}
              <Card style={{ marginBottom: 16 }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Search Pharmacy</div>
                  <a href="#" style={{ fontSize: 12, color: '#2968B0', fontWeight: 600 }}>Click here for Document Batch Download instructions</a>
                </div>
                <CardBody style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 12 }}>
                    <div><FL>NCPDP ID</FL><Inp placeholder="NCPDP ID"/></div>
                    <div><FL>Pharmacy Key</FL><Inp placeholder="Pharmacy Key"/></div>
                    <div><FL>DBA Name</FL><Inp placeholder="DBA Name"/></div>
                    <div><FL>Store #</FL><Inp placeholder="Store"/></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 12 }}>
                    <div><FL>Federal Tax ID</FL><Inp placeholder="Federal Tax ID"/></div>
                    <div><FL>State License</FL><Inp placeholder="State License"/></div>
                    <div><FL>NPI #</FL><Inp placeholder="NPI"/></div>
                    <div><FL>DEA #</FL><Inp placeholder="DEA"/></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 12 }}>
                    <div><FL>Address</FL><Inp placeholder="Address"/></div>
                    <div><FL>City</FL><Inp placeholder="City"/></div>
                    <div>
                      <FL>State</FL>
                      <Sel>
                        <option>-- Select State --</option>
                        {['Alabama','Alaska','Arizona','California','Colorado','Florida','Georgia','Illinois','Michigan','New York','Ohio','Pennsylvania','Texas','Washington'].map(s => (
                          <option key={s}>{s}</option>
                        ))}
                      </Sel>
                    </div>
                    <div><FL>ZIP</FL><Inp placeholder="ZIP"/></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
                    <div><FL>Phone #</FL><Inp placeholder="Phone"/></div>
                    <div><FL>Fax #</FL><Inp placeholder="Fax"/></div>
                    <div>
                      <FL>Relationship</FL>
                      <MultiSelect options={RELATIONSHIPS} height={70}/>
                    </div>
                    <div>
                      <FL>Status</FL>
                      <Sel><option>Active</option><option>Inactive</option><option>All</option></Sel>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                    <button className="btn-primary" onClick={() => setBatchSearched(true)} style={{ gap: 8, fontSize: 13, padding: '8px 24px' }}>
                      <IconSearch size={14} color="#fff"/> Search
                    </button>
                    <button className="btn-secondary" onClick={() => { setBatchSearched(false); setSelected([]); }} style={{ gap: 8, fontSize: 13, padding: '8px 20px' }}>
                      <IconRefresh size={14}/> Reset
                    </button>
                  </div>
                </CardBody>
              </Card>

              {/* Dual panel results */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                {/* Left: Searched Pharmacies */}
                <Card>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Searched Pharmacies</span>
                    {batchSearched && (
                      <button
                        onClick={() => setSelected(BATCH_RESULTS.slice(0,50).map(r => r.ncpdp))}
                        style={{ padding: '4px 12px', borderRadius: 4, border: '1px solid #B8D5F5', background: '#F0F7FF', color: '#2968B0', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Select All
                      </button>
                    )}
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Select up to 50 Pharmacies</span>
                  </div>
                  <CardBody style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ width: 36, padding: '8px 12px' }}/>
                          {['Pharmacy Name','NCPDP Provider ID','Store #','NPI'].map(h => (
                            <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#475569' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {!batchSearched ? (
                          <tr><td colSpan={5} style={{ textAlign: 'center', padding: 28, color: '#94A3B8', fontStyle: 'italic', fontSize: 12 }}>No records to display.</td></tr>
                        ) : BATCH_RESULTS.map((r, i) => (
                          <tr key={r.ncpdp} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA', borderTop: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={selected.includes(r.ncpdp)}
                                onChange={() => toggleSelect(r.ncpdp)}
                                style={{ width: 14, height: 14, cursor: 'pointer' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px', fontWeight: 500, color: '#1E293B', fontSize: 12 }}>{r.name}</td>
                            <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2968B0', fontWeight: 600, fontSize: 12 }}>{r.ncpdp}</td>
                            <td style={{ padding: '8px 12px', color: '#64748B' }}>{r.store}</td>
                            <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#64748B', fontSize: 12 }}>{r.npi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {batchSearched && (
                      <div style={{ padding: '8px 12px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', fontSize: 12, color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                        <span>50 items per page</span>
                        <span>1 – {BATCH_RESULTS.length} of {BATCH_RESULTS.length} items</span>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Right: Selected for download */}
                <Card>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      Pharmacies selected for Document Batch Download
                      <span style={{ fontWeight: 400, opacity: .7 }}> (maximum of 50)</span>
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setSelected([])} style={{ padding: '4px 12px', borderRadius: 4, border: '1px solid #B8D5F5', background: '#F0F7FF', color: '#2968B0', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Clear
                      </button>
                      <button
                        disabled={selected.length === 0}
                        style={{
                          padding: '4px 12px', borderRadius: 4, border: 'none', fontSize: 12, fontWeight: 600, cursor: selected.length > 0 ? 'pointer' : 'default',
                          background: selected.length > 0 ? '#10B981' : '#6B7280', color: '#fff',
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}
                      >
                        <IconDownload size={11} color="#fff"/> Next
                      </button>
                    </div>
                  </div>
                  <CardBody style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          {['Pharmacy Name','NCPDP Provider ID','Remove'].map(h => (
                            <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#475569' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPharmacies.length === 0 ? (
                          <tr><td colSpan={3} style={{ textAlign: 'center', padding: 28, color: '#94A3B8', fontStyle: 'italic', fontSize: 12 }}>No records to display.</td></tr>
                        ) : selectedPharmacies.map((r, i) => (
                          <tr key={r.ncpdp} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA', borderTop: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '8px 12px', fontWeight: 500, color: '#1E293B', fontSize: 12 }}>{r.name}</td>
                            <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 600, color: '#2968B0', fontSize: 12 }}>{r.ncpdp}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <button onClick={() => removeSelected(r.ncpdp)} style={{
                                width: 22, height: 22, borderRadius: 4, border: '1px solid #FECACA',
                                background: '#FEE2E2', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <IconX size={11} color="#DC2626"/>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {selected.length > 0 && (
                      <div style={{ padding: '8px 12px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', fontSize: 12, color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong style={{ color: '#2968B0' }}>{selected.length}</strong> selected (max 50)</span>
                        <span>{50 - selected.length} slots remaining</span>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
