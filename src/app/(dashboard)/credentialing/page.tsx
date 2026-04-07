'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import {
  IconCheck, IconAlertTriangle, IconCalendar, IconRefresh,
  IconDownload, IconPlay, IconChevronRight, IconShieldCheck, IconX,
} from '@/components/ui/Icons';

const credTypes = [
  { label: 'DEA Registration',   total: 81500, active: 76425, expiring: 3390, expired: 1685, color: '#2968B0', bg: '#F0F7FF', pct: 93.8 },
  { label: 'State License',      total: 81500, active: 79870, expiring: 1140, expired: 490,  color: '#10B981', bg: '#ECFDF5', pct: 98.0 },
  { label: 'ACHC Accreditation', total: 14720, active: 13940, expiring: 498,  expired: 282,  color: '#06B6D4', bg: '#ECFEFF', pct: 94.7 },
  { label: 'ACHC / PCAB',        total: 8190,  active: 7820,  expiring: 241,  expired: 129,  color: '#2968B0', bg: '#F0F7FF', pct: 95.5 },
];

const renewalQueue = [
  { id: 'NCP-0842', name: 'Wellness Pharmacy #0842',  location: 'Houston, TX',    type: 'DEA Registration',  expires: 'Apr 2, 2026',   daysLeft: 2,  priority: 'urgent'  },
  { id: 'NCP-1290', name: 'MedPlus Pharmacy',          location: 'Phoenix, AZ',    type: 'ACHC Accreditation', expires: 'Apr 8, 2026',   daysLeft: 8,  priority: 'high'    },
  { id: 'NCP-3451', name: 'Care First Pharmacy',       location: 'Dallas, TX',     type: 'State License',     expires: 'Apr 15, 2026',  daysLeft: 15, priority: 'high'    },
  { id: 'NCP-5501', name: 'Valley Health Pharmacy',    location: 'Fresno, CA',     type: 'DEA Registration',  expires: 'Apr 22, 2026',  daysLeft: 22, priority: 'medium'  },
  { id: 'NCP-7820', name: 'Precision Pharmacy',        location: 'Columbus, OH',   type: 'ACHC',              expires: 'Apr 28, 2026',  daysLeft: 28, priority: 'medium'  },
  { id: 'NCP-2210', name: 'Harbor View Rx',            location: 'San Diego, CA',  type: 'State License',     expires: 'May 5, 2026',   daysLeft: 35, priority: 'normal'  },
];

const recentActivity = [
  { action: 'DEA Renewed',      pharmacy: 'Sunrise Specialty Pharmacy', time: '2h ago',  icon: '✓', color: '#10B981' },
  { action: 'License Flagged',  pharmacy: 'Community Care Rx #44',      time: '4h ago',  icon: '!', color: '#D97706' },
  { action: 'ACHC Renewed',     pharmacy: 'Metro Health Pharmacy',       time: '6h ago',  icon: '✓', color: '#10B981' },
  { action: 'DEA Expiring',     pharmacy: 'North Star Pharmacy',         time: '8h ago',  icon: '!', color: '#D97706' },
  { action: 'New Enrollment',   pharmacy: 'Riverside Pharmacy Group',    time: '1d ago',  icon: '+', color: '#2968B0' },
];

const priorityCfg = {
  urgent: { color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', label: 'Urgent' },
  high:   { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', label: 'High'   },
  medium: { color: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE', label: 'Medium' },
  normal: { color: '#059669', bg: '#D1FAE5', border: '#A7F3D0', label: 'Normal' },
};

export default function CredentialingPage() {
  const [activeTab, setActiveTab]   = useState<'queue' | 'overview' | 'history'>('queue');
  const [scanning, setScanning]     = useState(false);
  const [scanDone, setScanDone]     = useState(false);
  const [selected, setSelected]     = useState<string[]>([]);

  function runScan() {
    setScanning(true);
    setScanDone(false);
    setTimeout(() => { setScanning(false); setScanDone(true); }, 1800);
  }

  function toggleSelect(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'queue',    label: `Renewal Queue (${renewalQueue.length})` },
    { key: 'overview', label: 'Credential Types' },
    { key: 'history',  label: 'Recent Activity' },
  ];

  return (
    <>
      <Topbar
        title="Credentialing (resQ)"
        subtitle="Pharmacy credential lifecycle management — AGT-13 · AGT-20"
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary" style={{ fontSize: 12, gap: 4 }}>
              <IconDownload size={13}/> Export Report
            </button>
            <button className="btn-primary" style={{ fontSize: 12, gap: 4 }} onClick={runScan} disabled={scanning}>
              {scanning ? (
                <><span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .8s linear infinite' }}/> Scanning…</>
              ) : (
                <><IconRefresh size={13} color="#fff"/> Run Credential Scan</>
              )}
            </button>
          </div>
        }
      />
      <main style={{ padding: '16px 20px 40px' }}>

        {scanDone && (
          <div style={{ marginBottom: 14, padding: '12px 16px', borderRadius: 8, background: '#D1FAE5', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#059669' }}>
            <IconCheck size={16} color="#059669"/>
            Credential scan complete — 81,500 records verified · 4,001 action items identified
          </div>
        )}

        {/* Summary strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }}>
          {[
            { label: 'Active Credentials', value: '153,087', delta: '+312 this week', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
            { label: 'Expiring (30 days)', value: '4,472',   delta: 'Across all types', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
            { label: 'Expired',            value: '1,845',   delta: 'Require renewal',  color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
            { label: 'Scan Coverage',      value: '100%',    delta: 'Daily automated',  color: '#2968B0', bg: '#F0F7FF', border: '#B8D5F5' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '16px 16px', background: s.bg, border: `1px solid ${s.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: s.color, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: s.color, opacity: .7 }}>{s.delta}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>

          {/* Main */}
          <Card style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Tab nav */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', padding: '0 20px' }}>
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    fontSize: 13, fontWeight: 600, padding: '12px 16px',
                    color: activeTab === t.key ? '#2968B0' : 'var(--text-muted)',
                    background: 'none', border: 'none',
                    borderBottom: `2px solid ${activeTab === t.key ? '#2968B0' : 'transparent'}`,
                    cursor: 'pointer', transition: 'all .15s',
                  }}
                >{t.label}</button>
              ))}
            </div>

            <CardBody style={{ padding: 0, flex: 1 }}>

              {activeTab === 'queue' && (
                <>
                  {selected.length > 0 && (
                    <div style={{ padding: '12px 20px', background: '#F0F7FF', borderBottom: '1px solid #B8D5F5', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#2968B0' }}>{selected.length} selected</span>
                      <button className="btn-primary" style={{ fontSize: 12, padding: '4px 12px', gap: 4 }}><IconPlay size={12} color="#fff"/> Send Bulk Reminders</button>
                      <button className="btn-secondary" style={{ fontSize: 12, padding: '4px 12px' }}>Export Selected</button>
                      <button onClick={() => setSelected([])} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><IconX size={14}/></button>
                    </div>
                  )}
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: 36 }}><input type="checkbox" onChange={e => setSelected(e.target.checked ? renewalQueue.map(r => r.id) : [])} checked={selected.length === renewalQueue.length}/></th>
                        <th>Pharmacy</th>
                        <th>Credential Type</th>
                        <th>Expires</th>
                        <th>Priority</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {renewalQueue.map(r => {
                        const pc = priorityCfg[r.priority as keyof typeof priorityCfg];
                        return (
                          <tr key={r.id} style={{ background: selected.includes(r.id) ? '#F0F7FF' : undefined }}>
                            <td><input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)}/></td>
                            <td>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.id} · {r.location}</div>
                            </td>
                            <td style={{ fontSize: 12 }}>{r.type}</td>
                            <td>
                              <div style={{ fontWeight: 600, color: r.daysLeft <= 7 ? '#DC2626' : r.daysLeft <= 30 ? '#D97706' : 'var(--text-primary)', fontSize: 12 }}>{r.expires}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.daysLeft}d remaining</div>
                            </td>
                            <td>
                              <span style={{ fontSize: 12, fontWeight: 600, color: pc.color, background: pc.bg, padding: '2px 8px', borderRadius: 4 }}>
                                {pc.label}
                              </span>
                            </td>
                            <td>
                              <button className="btn-ghost" style={{ fontSize: 12, gap: 4 }}>
                                <IconChevronRight size={12}/> Renew
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              )}

              {activeTab === 'overview' && (
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {credTypes.map(c => (
                    <div key={c.label} style={{ padding: '16px', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--surface-2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{c.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Total tracked: {c.total.toLocaleString()}</div>
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 700, color: c.color }}>{c.pct}%</span>
                      </div>
                      <Progress value={c.pct} color={c.color} height={6}/>
                      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                        {[
                          { label: 'Active',    value: c.active,   color: '#10B981' },
                          { label: 'Expiring',  value: c.expiring, color: '#D97706' },
                          { label: 'Expired',   value: c.expired,  color: '#DC2626' },
                        ].map(s => (
                          <div key={s.label}>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: s.color }}>{s.value.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'history' && (
                <div style={{ padding: '8px 20px 16px' }}>
                  {recentActivity.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: `${a.color}18`, border: `1px solid ${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: a.color }}>
                        {a.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{a.action}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.pharmacy}</div>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Timeline */}
            <Card>
              <CardHeader title="Upcoming Deadlines" subtitle="Next 60 days"/>
              <CardBody style={{ padding: '8px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '2 expiring today',     days: 0,  color: '#DC2626' },
                  { label: '18 expiring this week', days: 7,  color: '#D97706' },
                  { label: '312 in next 30 days',  days: 30, color: '#2563EB' },
                  { label: '892 in next 60 days',  days: 60, color: '#2968B0' },
                ].map(d => (
                  <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }}/>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{d.label}</span>
                    <button className="btn-ghost" style={{ fontSize: 12, padding: '2px 8px' }}>View</button>
                  </div>
                ))}
              </CardBody>
            </Card>

            {/* Agents */}
            <Card>
              <CardHeader title="Active Agents"/>
              <CardBody style={{ padding: '8px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { id: 'AGT-13', name: 'Credential Lifecycle Manager', status: 'Running', color: '#10B981' },
                  { id: 'AGT-20', name: 'Credentialing Assist',         status: 'Idle',    color: '#2968B0' },
                ].map(a => (
                  <div key={a.id} style={{ padding: '12px 12px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{a.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: a.color }}>{a.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.id}</div>
                  </div>
                ))}
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>Open Agent Library</button>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
