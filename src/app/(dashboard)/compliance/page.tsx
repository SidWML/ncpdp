'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { complianceMetrics } from '@/lib/mockData';
import { IconDownload, IconRefresh, IconPlay, IconCheck, IconInfo, IconChevronRight } from '@/components/ui/Icons';

const overallScore = 94;

const auditItems = [
  { item: 'DEA Registration Verification',  status: 'pass',    count: '64,238 active',    last: 'Mar 31, 2026' },
  { item: 'State License Currency',         status: 'pass',    count: '67,079 current',   last: 'Mar 31, 2026' },
  { item: 'ACHC Accreditation',             status: 'pass',    count: '12,840 accredited', last: 'Mar 30, 2026' },
  { item: 'FWA Attestation Collection',     status: 'warning', count: '6 pending review', last: 'Mar 29, 2026' },
  { item: 'No Surprises Act Reporting',     status: 'warning', count: '12 reports due',   last: 'Mar 28, 2026' },
  { item: 'Network Adequacy Standards', status: 'pass',    count: '96% compliance',   last: 'Mar 31, 2026' },
  { item: 'Medicare Part D Enrollment',     status: 'pass',    count: '41,200 verified',  last: 'Mar 30, 2026' },
  { item: 'Medicaid Provider Enrollment',   status: 'pass',    count: '38,950 current',   last: 'Mar 30, 2026' },
];

const statusConfig = {
  pass:    { color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0', label: 'Pass'   },
  warning: { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', label: 'Review' },
  fail:    { color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', label: 'Fail'   },
};

export default function CompliancePage() {
  const [selected, setSelected]   = useState<number | null>(null);
  const [scanning, setScanning]   = useState(false);
  const [scanDone, setScanDone]   = useState(false);

  function runScan() {
    setScanning(true);
    setScanDone(false);
    setTimeout(() => { setScanning(false); setScanDone(true); }, 2000);
  }

  return (
    <>
      <Topbar
        title="Compliance Dashboard"
        subtitle="DEA · FWA · Accreditation"
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary" style={{ fontSize: 12, gap: 5 }}>
              <IconDownload size={13}/> Export Report
            </button>
            <button className="btn-primary" onClick={runScan} style={{ fontSize: 12, gap: 5 }}>
              {scanning ? (
                <>
                  <span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}/>
                  Scanning…
                </>
              ) : (
                <><IconPlay size={12} color="#fff"/> Run Compliance Watchdog</>
              )}
            </button>
          </div>
        }
      />
      <main style={{ padding: '16px 20px 40px' }}>

        {scanDone && (
          <div style={{
            marginBottom: 16, padding: '12px 16px', borderRadius: 8,
            background: '#D1FAE5', border: '1px solid #A7F3D0',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#059669',
          }}>
            <IconCheck size={16} color="#059669"/>
            Compliance scan complete — 81,500 records reviewed, 18 items flagged for review
          </div>
        )}

        {/* Score + metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 12, marginBottom: 12 }}>

          {/* Score dial */}
          <Card style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '28px 24px', gap: 12,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Overall Score
            </div>
            <div style={{ position: 'relative', width: 110, height: 110 }}>
              <svg width="110" height="110" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--border-light)" strokeWidth="14"/>
                <circle cx="60" cy="60" r="48" fill="none" stroke="#10B981" strokeWidth="14"
                  strokeDasharray={`${(overallScore / 100) * 2 * Math.PI * 48} ${2 * Math.PI * 48}`}
                  strokeLinecap="round"/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{overallScore}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>
            <Badge variant="success" dot>Compliant</Badge>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
              Updated Mar 31, 2026<br/>Next audit Apr 30
            </div>
          </Card>

          {/* Metrics */}
          <Card>
            <CardHeader title="Compliance Metrics" subtitle="All monitored standards"/>
            <CardBody style={{ padding: '8px 16px 16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {complianceMetrics.map(m => {
                  const sc = statusConfig[m.status as keyof typeof statusConfig];
                  return (
                    <div
                      key={m.label}
                      style={{
                        background: 'var(--surface-2)', borderRadius: 12, padding: '12px 14px',
                        border: `1px solid ${m.status !== 'pass' ? sc.border : 'var(--border-light)'}`,
                        cursor: 'pointer', transition: 'border-color .15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{m.label}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: sc.color, background: sc.bg,
                          padding: '2px 8px', borderRadius: 4,
                        }}>
                          {sc.label}
                        </span>
                      </div>
                      <Progress value={m.score} color={sc.color} height={5}/>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.detail}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: sc.color }}>{m.score}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Audit checklist */}
        <Card>
          <CardHeader
            title="Compliance Audit Checklist"
            subtitle="Automated verification — all standards"
            action={
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last run: 2 hours ago</span>
                <button className="btn-secondary" onClick={runScan} style={{ fontSize: 12, gap: 5 }}>
                  <IconRefresh size={12}/> Re-run
                </button>
              </div>
            }
          />
          <CardBody style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  {['Standard', 'Status', 'Details', 'Last Verified', ''].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditItems.map((row, i) => {
                  const sc = statusConfig[row.status as keyof typeof statusConfig];
                  const isSelected = selected === i;
                  return (
                    <tr
                      key={i}
                      onClick={() => setSelected(isSelected ? null : i)}
                      style={{ background: isSelected ? '#F0F7FF' : undefined, cursor: 'pointer' }}
                    >
                      <td style={{ fontWeight: 600 }}>{row.item}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: 12, fontWeight: 600, color: sc.color, background: sc.bg,
                          padding: '4px 8px', borderRadius: 4,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.color, display: 'inline-block' }}/>
                          {sc.label}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{row.count}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{row.last}</td>
                      <td>
                        <button className="btn-ghost" style={{ fontSize: 12, gap: 4 }}>
                          <IconInfo size={11}/> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Detail expansion */}
            {selected !== null && (
              <div style={{
                margin: '0 16px 16px', padding: '14px 16px', borderRadius: 12,
                background: 'var(--surface-2)', border: '1px solid #B8D5F5',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {auditItems[selected].item} — Detail View
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[
                    { label: 'Records Checked',  value: '81,500' },
                    { label: 'Issues Found',     value: auditItems[selected].status === 'warning' ? '6' : '0' },
                    { label: 'Compliance Rate',  value: statusConfig[auditItems[selected].status as keyof typeof statusConfig].label === 'Pass' ? '99.8%' : '91.2%' },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center', padding: 12, background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{m.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button className="btn-primary" style={{ fontSize: 12, gap: 5 }}>
                    <IconChevronRight size={12} color="#fff"/> View Full Report
                  </button>
                  <button className="btn-secondary" style={{ fontSize: 12 }}>Export</button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
