'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import {
  IconCheck, IconAlertTriangle, IconPlay, IconDownload,
  IconRefresh, IconX, IconChevronRight, IconBell, IconShield,
} from '@/components/ui/Icons';

const attestationStats = [
  { label: 'Attestation Required',  value: '81,500', color: '#005C8D', bg: '#E8F3F9', border: '#8FC2D8' },
  { label: 'Completed',             value: '73,350', color: '#76C799', bg: '#ECFDF5', border: '#A7F3D0' },
  { label: 'Pending (In Progress)', value: '4,891',  color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  { label: 'Overdue',               value: '1,172',  color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
];

const overdueList = [
  { id: 'NCP-0842', name: 'Wellness Pharmacy #0842',  location: 'Houston, TX',   deadline: 'Mar 1, 2026',  daysOver: 30, riskScore: 8.4, networks: 3 },
  { id: 'NCP-2190', name: 'Family First Rx',           location: 'Orlando, FL',   deadline: 'Mar 1, 2026',  daysOver: 30, riskScore: 7.1, networks: 2 },
  { id: 'NCP-3310', name: 'Metro Health Pharmacy',     location: 'Chicago, IL',   deadline: 'Mar 15, 2026', daysOver: 16, riskScore: 6.8, networks: 4 },
  { id: 'NCP-4471', name: 'Sunrise Specialty',         location: 'Phoenix, AZ',   deadline: 'Mar 15, 2026', daysOver: 16, riskScore: 5.2, networks: 1 },
  { id: 'NCP-5590', name: 'Harbor Rx Group',           location: 'San Diego, CA', deadline: 'Mar 20, 2026', daysOver: 11, riskScore: 4.9, networks: 2 },
];

const riskBands = [
  { label: 'High Risk (8–10)',   count: 6,   color: '#DC2626', bg: '#FEE2E2' },
  { label: 'Medium Risk (5–7)', count: 28,  color: '#D97706', bg: '#FEF3C7' },
  { label: 'Low Risk (1–4)',    count: 1138, color: '#76C799', bg: '#ECFDF5' },
];

const completionByNetwork = [
  { network: 'Aetna PBM',      pct: 96, count: '14,820 / 15,437' },
  { network: 'Cigna Pharmacy', pct: 93, count: '11,603 / 12,476' },
  { network: 'Express Scripts', pct: 88, count: '9,240 / 10,500' },
  { network: 'CVS Caremark',   pct: 91, count: '18,412 / 20,233' },
];

export default function FWAPage() {
  const [scanning, setScanning]   = useState(false);
  const [scanDone, setScanDone]   = useState(false);
  const [selected, setSelected]   = useState<string[]>([]);
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);

  function runScan() {
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanDone(true); }, 1800);
  }

  function sendReminders() {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); setSelected([]); }, 1200);
  }

  const completionPct = Math.round((73350 / 81500) * 100);

  return (
    <>
      <Topbar
        title="FWA Attestation Tracking"
        subtitle="Fraud, Waste & Abuse training compliance — Medicare Part D · Medicaid"
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary" style={{ fontSize: 12, gap: 4 }}>
              <IconDownload size={13}/> Export CSV
            </button>
            <button className="btn-primary" style={{ fontSize: 12, gap: 4 }} onClick={runScan} disabled={scanning}>
              {scanning ? (
                <><span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .8s linear infinite' }}/> Scanning…</>
              ) : (
                <><IconRefresh size={13} color="#fff"/> Run FWA Agent</>
              )}
            </button>
          </div>
        }
      />
      <main style={{ padding: '16px 20px 40px' }}>

        {sent && (
          <div style={{ marginBottom: 14, padding: '12px 16px', borderRadius: 8, background: '#D1FAE5', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#449055' }}>
            <IconCheck size={16} color="#449055"/>
            Reminder emails sent to 1,172 pharmacies with overdue attestations
          </div>
        )}

        {scanDone && !sent && (
          <div style={{ marginBottom: 14, padding: '12px 16px', borderRadius: 8, background: '#E8F3F9', border: '1px solid #8FC2D8', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#1474A4' }}>
            <IconShield size={16} color="#1474A4"/>
            FWA Risk Agent scan complete — 6 high-risk pharmacies identified, 34 medium-risk flagged
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }}>
          {attestationStats.map(s => (
            <div key={s.label} className="card" style={{ padding: '16px 16px', background: s.bg, border: `1px solid ${s.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: s.color, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Completion + networks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

          {/* Overall progress */}
          <Card>
            <CardHeader
              title="Overall Completion"
              subtitle="2026 Annual FWA Attestation Cycle"
              action={<Badge variant="warning" dot>Due Apr 30</Badge>}
            />
            <CardBody style={{ padding: '16px 20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 48, fontWeight: 700, color: '#005C8D', lineHeight: 1 }}>{completionPct}%</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>73,350 of 81,500 pharmacies</span>
              </div>
              <Progress value={completionPct} color="#005C8D" height={10}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                <span>Started Jan 1, 2026</span>
                <span>Deadline Apr 30, 2026</span>
              </div>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Completed', count: 73350, color: '#76C799', pct: 91.1 },
                  { label: 'In Progress', count: 4891, color: '#D97706', pct: 7.2  },
                  { label: 'Overdue',   count: 1172,  color: '#DC2626', pct: 1.7   },
                ].map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.color, flexShrink: 0 }}/>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{b.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: b.color }}>{b.count.toLocaleString()}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 36, textAlign: 'right' }}>{b.pct}%</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', gap: 4, fontSize: 12 }}
                  onClick={sendReminders}
                  disabled={sending}
                >
                  {sending ? (
                    <><span style={{ width: 11, height: 11, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .8s linear infinite' }}/> Sending…</>
                  ) : (
                    <><IconBell size={12} color="#fff"/> Send Bulk Reminders</>
                  )}
                </button>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>
                  <IconDownload size={12}/> Export Pending
                </button>
              </div>
            </CardBody>
          </Card>

          {/* By network */}
          <Card>
            <CardHeader title="Completion by Network" subtitle="Primary PBM networks"/>
            <CardBody style={{ padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {completionByNetwork.map(n => (
                <div key={n.network}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{n.network}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: n.pct >= 90 ? '#76C799' : '#D97706' }}>{n.pct}%</span>
                  </div>
                  <Progress value={n.pct} color={n.pct >= 90 ? '#76C799' : '#D97706'} height={6}/>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{n.count} attested</div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Overdue table + risk */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 12 }}>

          <Card>
            <CardHeader
              title="Overdue Pharmacies"
              badge={<Badge variant="danger">1,172 overdue</Badge>}
              action={
                selected.length > 0 ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-primary" style={{ fontSize: 12, padding: '4px 12px', gap: 4 }} onClick={sendReminders} disabled={sending}>
                      <IconBell size={12} color="#fff"/> Send Reminders ({selected.length})
                    </button>
                    <button onClick={() => setSelected([])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><IconX size={14}/></button>
                  </div>
                ) : (
                  <button className="btn-ghost" style={{ fontSize: 12 }}>View All</button>
                )
              }
            />
            <CardBody style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}><input type="checkbox" onChange={e => setSelected(e.target.checked ? overdueList.map(r => r.id) : [])} checked={selected.length === overdueList.length}/></th>
                    <th>Pharmacy</th>
                    <th>Deadline Missed</th>
                    <th>FWA Risk Score</th>
                    <th>Networks</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {overdueList.map(r => (
                    <tr key={r.id} style={{ background: selected.includes(r.id) ? '#FFF5F5' : undefined }}>
                      <td><input type="checkbox" checked={selected.includes(r.id)} onChange={() => setSelected(prev => prev.includes(r.id) ? prev.filter(s => s !== r.id) : [...prev, r.id])}/></td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.id} · {r.location}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>{r.deadline}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.daysOver} days overdue</div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: 13, fontWeight: 700,
                          color: r.riskScore >= 8 ? '#DC2626' : r.riskScore >= 5 ? '#D97706' : '#76C799',
                        }}>{r.riskScore.toFixed(1)}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>/ 10</span>
                      </td>
                      <td style={{ fontSize: 12 }}>{r.networks} network{r.networks > 1 ? 's' : ''}</td>
                      <td>
                        <button className="btn-ghost" style={{ fontSize: 12, gap: 4 }}>
                          <IconBell size={12}/> Remind
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>

          {/* FWA Risk Bands */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Card>
              <CardHeader title="Risk Bands" subtitle="Non-attested pharmacies"/>
              <CardBody style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {riskBands.map(b => (
                  <div key={b.label} style={{ padding: '12px', borderRadius: 8, background: b.bg, border: `1px solid ${b.color}22` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{b.label}</span>
                      <span style={{ fontSize: 18, fontWeight: 700, color: b.color }}>{b.count}</span>
                    </div>
                  </div>
                ))}
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, marginTop: 4 }}>
                  <IconChevronRight size={12}/> View FWA Risk Report
                </button>
              </CardBody>
            </Card>

            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(239,68,68,.06), rgba(245,158,11,.06))', border: '1px solid rgba(239,68,68,.15)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Powered by</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>AGT-11: FWA Risk Scoring</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>AI-powered fraud risk analysis across non-attested pharmacies</div>
            </div>
          </div>
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
