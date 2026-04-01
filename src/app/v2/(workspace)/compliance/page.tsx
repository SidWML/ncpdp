'use client';
import React, { useState } from 'react';
import { TopbarV2 } from '@/components/v2/TopbarV2';
import {
  IconShield, IconAlertTriangle, IconCheck, IconSend, IconDownload,
  IconCalendar, IconInfo, IconFileCheck, IconRefresh, IconChevronRight,
  IconZap, IconStore, IconShieldCheck, IconActivity, IconKey, IconUsers,
} from '@/components/ui/Icons';
import { FieldLabel, TextInput, Select, DateRange } from '@/components/ui/FormFields';
import { RELATIONSHIPS, PROVIDER_TYPES, US_STATES } from '@/lib/filter-options';
import { Badge } from '@/components/ui/Badge';

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */

const HEALTH_SCORES = [
  { label: 'DEA Compliance', score: 98, total: '68,247', issues: '1,168 expiring', color: '#059669' },
  { label: 'Network Adequacy', score: 96, total: '42 networks', issues: '3 below threshold', color: '#059669' },
  { label: 'FWA Status', score: 91, total: '38,569', issues: '3,412 pending', color: '#D97706' },
  { label: 'NSA Readiness', score: 99, total: '12 filings', issues: '1 upcoming', color: '#059669' },
];

const TABS = ['Credentialing Queue', 'FWA Attestation', 'No Surprises Filing', 'Alerts'] as const;

/*  Tab 1: Credentialing Queue  */
const CRED_ROWS = [
  { id: 1, pharmacy: 'CareRx Pharmacy #0842',       ncpdp: '1234567', type: 'DEA Renewal',     expiry: '2026-04-12', daysLeft: 11,  priority: 'urgent'  },
  { id: 2, pharmacy: 'Valley Rx Solutions #2',       ncpdp: '3987234', type: 'State License',   expiry: '2026-04-18', daysLeft: 17,  priority: 'urgent'  },
  { id: 3, pharmacy: 'Sunrise Compounding Ctr',      ncpdp: '5021847', type: 'Accreditation',   expiry: '2026-04-25', daysLeft: 24,  priority: 'high'    },
  { id: 4, pharmacy: 'Mountain View Clinical Rx',    ncpdp: '9012847', type: 'DEA Renewal',     expiry: '2026-05-03', daysLeft: 32,  priority: 'high'    },
  { id: 5, pharmacy: 'Bayou Pharmacy Partners',      ncpdp: '6789013', type: 'State License',   expiry: '2026-05-14', daysLeft: 43,  priority: 'medium'  },
  { id: 6, pharmacy: 'PharmaPlus #227',              ncpdp: '2345891', type: 'DEA Renewal',     expiry: '2026-05-22', daysLeft: 51,  priority: 'medium'  },
  { id: 7, pharmacy: 'Great Lakes Specialty Rx',     ncpdp: '8901234', type: 'Accreditation',   expiry: '2026-06-01', daysLeft: 61,  priority: 'medium'  },
  { id: 8, pharmacy: 'SunHealth Compounding',        ncpdp: '4567890', type: 'State License',   expiry: '2026-06-15', daysLeft: 75,  priority: 'normal'  },
  { id: 9, pharmacy: 'Pacific Coast Pharmacy',       ncpdp: '7890123', type: 'DEA Renewal',     expiry: '2026-06-28', daysLeft: 88,  priority: 'normal'  },
  { id: 10, pharmacy: 'Heartland Clinical Rx #44',   ncpdp: '3456789', type: 'Accreditation',   expiry: '2026-07-10', daysLeft: 100, priority: 'normal'  },
];

/*  Tab 2: FWA Attestation  */
const FWA_NETWORKS = [
  { name: 'CVS CAREMARK',    pct: 94, total: 18472, attested: 17364 },
  { name: 'EXPRESS SCRIPTS',  pct: 89, total: 22104, attested: 19673 },
  { name: 'OPTUMRX',          pct: 92, total: 14203, attested: 13067 },
  { name: 'HUMANA',           pct: 88, total: 9302,  attested: 8186  },
];

const FWA_OVERDUE = [
  { id: 1, pharmacy: 'Midwest Chain #44',          ncpdp: '1122334', network: 'CVS CAREMARK',    dueDate: '2026-03-15', daysPast: 17 },
  { id: 2, pharmacy: 'SunHealth Compounding',       ncpdp: '4567890', network: 'EXPRESS SCRIPTS', dueDate: '2026-03-18', daysPast: 14 },
  { id: 3, pharmacy: 'Rapid Rx Solutions',          ncpdp: '5566778', network: 'HUMANA',          dueDate: '2026-03-20', daysPast: 12 },
  { id: 4, pharmacy: 'Harbor Specialty Pharmacy',   ncpdp: '6677889', network: 'OPTUMRX',         dueDate: '2026-03-22', daysPast: 10 },
  { id: 5, pharmacy: 'Prairie Health Rx',           ncpdp: '7788990', network: 'HUMANA',          dueDate: '2026-03-25', daysPast: 7  },
  { id: 6, pharmacy: 'Cascade Pharmacy Group',      ncpdp: '8899001', network: 'EXPRESS SCRIPTS', dueDate: '2026-03-28', daysPast: 4  },
];

/*  Tab 3: No Surprises Filing  */
const VALIDATION_CHECKS = [
  { id: 1, check: 'NPI format validation',         status: 'pass', pass: 38569, warn: 0,   fail: 0,   canFix: false },
  { id: 2, check: 'NCPDP ID cross-reference',      status: 'pass', pass: 38412, warn: 157, fail: 0,   canFix: false },
  { id: 3, check: 'Address geocode match',          status: 'warn', pass: 37891, warn: 614, fail: 64,  canFix: true  },
  { id: 4, check: 'DEA registration active',        status: 'pass', pass: 38201, warn: 368, fail: 0,   canFix: false },
  { id: 5, check: 'State license verification',     status: 'pass', pass: 38104, warn: 465, fail: 0,   canFix: false },
  { id: 6, check: 'Network participation confirmed',status: 'warn', pass: 37682, warn: 802, fail: 85,  canFix: true  },
  { id: 7, check: 'Pricing data completeness',      status: 'pass', pass: 38391, warn: 178, fail: 0,   canFix: false },
  { id: 8, check: 'Balance billing attestation',    status: 'fail', pass: 36104, warn: 1241,fail: 1224,canFix: true  },
];

const NSA_BREAKDOWN = [
  { type: 'Community / Retail',    count: 28471, pct: 73.8 },
  { type: 'Chain Pharmacy',        count: 5214,  pct: 13.5 },
  { type: 'Specialty Pharmacy',    count: 2104,  pct: 5.5  },
  { type: 'Mail Service Pharmacy', count: 1489,  pct: 3.9  },
  { type: 'Long-Term Care',        count: 891,   pct: 2.3  },
  { type: 'Other',                 count: 400,   pct: 1.0  },
];

const PAST_SUBMISSIONS = [
  { period: 'Q4 2025', date: '2026-01-14', status: 'Accepted', cmsId: 'CMS-NSA-2025Q4-48291' },
  { period: 'Q3 2025', date: '2025-10-12', status: 'Accepted', cmsId: 'CMS-NSA-2025Q3-39104' },
  { period: 'Q2 2025', date: '2025-07-11', status: 'Accepted', cmsId: 'CMS-NSA-2025Q2-27843' },
];

/*  Tab 4: Alerts  */
const ALERT_ITEMS = [
  { id: 1, severity: 'critical', icon: IconAlertTriangle, title: 'DEA License Expired — CareRx Pharmacy #0842',             desc: 'DEA registration expired on Mar 29. Pharmacy must cease dispensing controlled substances until renewed.', time: '2h ago',  ncpdp: '1234567' },
  { id: 2, severity: 'critical', icon: IconAlertTriangle, title: 'FWA Attestation Overdue — 6 Pharmacies',                   desc: 'Midwest Chain #44, SunHealth Compounding, and 4 others have missed their FWA attestation deadline.',     time: '3h ago',  ncpdp: 'Multiple' },
  { id: 3, severity: 'critical', icon: IconShield,        title: 'Network Adequacy Below Threshold — Montana',               desc: 'Rural pharmacy count has fallen below CMS-mandated minimum. 2 counties now underserved.',                time: '5h ago',  ncpdp: 'N/A' },
  { id: 4, severity: 'warning',  icon: IconCalendar,      title: 'State License Expiring — Valley Rx Solutions #2',          desc: 'State pharmacy license expires in 17 days. Renewal application has not been received.',                  time: '6h ago',  ncpdp: '3987234' },
  { id: 5, severity: 'warning',  icon: IconKey,           title: 'Accreditation Due — Sunrise Compounding Ctr',              desc: 'ACHC accreditation expires in 24 days. Surveyor visit not yet scheduled.',                               time: '8h ago',  ncpdp: '5021847' },
  { id: 6, severity: 'warning',  icon: IconCalendar,      title: 'NSA Q1 2026 Filing Deadline Approaching',                  desc: 'No Surprises Act quarterly filing due April 15. Report generation recommended within 7 days.',           time: '12h ago', ncpdp: 'N/A' },
  { id: 7, severity: 'info',     icon: IconInfo,          title: 'Credential Audit Completed — AGT-12',                      desc: '89 DEA expirations and 112 license renewals identified across 32 states.',                               time: '1d ago',  ncpdp: 'N/A' },
  { id: 8, severity: 'info',     icon: IconCheck,         title: 'Weekly Network Change Report Available',                    desc: '247 pharmacy changes flagged across 12 states. 14 closures, 31 new openings, 202 profile updates.',      time: '1d ago',  ncpdp: 'N/A' },
  { id: 9, severity: 'info',     icon: IconFileCheck,     title: 'Q4 2025 NSA Filing Accepted by CMS',                       desc: 'Confirmation ID CMS-NSA-2025Q4-48291. Filing covered 38,104 pharmacies.',                                time: '2d ago',  ncpdp: 'N/A' },
];

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function ScoreRing({ score, color, size = 56 }: { score: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--v2-surface-3)" strokeWidth={4} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fill={color}
        style={{ fontSize: 14, fontWeight: 700, transform: 'rotate(90deg)', transformOrigin: 'center' }}>
        {score}
      </text>
    </svg>
  );
}

function priorityBadge(p: string) {
  if (p === 'urgent') return <span className="v2g v2g-err">Urgent</span>;
  if (p === 'high')   return <span className="v2g v2g-w">High</span>;
  if (p === 'medium') return <span className="v2g v2g-p">Medium</span>;
  return <span className="v2g v2g-n">Normal</span>;
}

function statusIcon(s: string) {
  if (s === 'pass') return <span className="v2g v2g-ok" style={{ gap: 4 }}><IconCheck size={10} /> Pass</span>;
  if (s === 'warn') return <span className="v2g v2g-w"  style={{ gap: 4 }}><IconAlertTriangle size={10} /> Warn</span>;
  return <span className="v2g v2g-err" style={{ gap: 4 }}><IconAlertTriangle size={10} /> Fail</span>;
}

const th: React.CSSProperties = {
  padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--v2-text-3)',
  textTransform: 'uppercase', letterSpacing: '.04em', textAlign: 'left',
  borderBottom: '1px solid var(--v2-border)', background: 'var(--v2-surface-2)',
};

const td: React.CSSProperties = {
  padding: '10px 14px', fontSize: 13, color: 'var(--v2-text)', borderBottom: '1px solid var(--v2-border-lt)',
};

const cbx: React.CSSProperties = { width: 15, height: 15, accentColor: 'var(--v2-primary)', cursor: 'pointer' };

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState(0);

  /* Credentialing state */
  const [credSelected, setCredSelected] = useState<number[]>([]);
  const toggleCred = (id: number) => setCredSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAllCred = () => setCredSelected(p => p.length === CRED_ROWS.length ? [] : CRED_ROWS.map(r => r.id));

  /* FWA state */
  const [fwaSelected, setFwaSelected] = useState<number[]>([]);
  const toggleFwa = (id: number) => setFwaSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAllFwa = () => setFwaSelected(p => p.length === FWA_OVERDUE.length ? [] : FWA_OVERDUE.map(r => r.id));

  /* NSA wizard state */
  const [nsaStep, setNsaStep] = useState(0);
  const [nsaFrom, setNsaFrom] = useState('2026-01-01');
  const [nsaTo, setNsaTo] = useState('2026-03-31');
  const [nsaRelType, setNsaRelType] = useState('');
  const [nsaProvType, setNsaProvType] = useState('');
  const [nsaState, setNsaState] = useState('');
  const [nsaSubmitted, setNsaSubmitted] = useState(false);

  /* Alerts filter */
  const [alertFilter, setAlertFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filteredAlerts = alertFilter === 'all' ? ALERT_ITEMS : ALERT_ITEMS.filter(a => a.severity === alertFilter);

  return (
    <>
      <TopbarV2 title="Compliance" />

      <main style={{ padding: '20px 24px 40px' }}>

        {/*  Health Score Cards  */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {HEALTH_SCORES.map(h => (
            <div key={h.label} className="v2c" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <ScoreRing score={h.score} color={h.color} />
              <div style={{ flex: 1 }}>
                <div className="v2-label" style={{ marginBottom: 2 }}>{h.label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--v2-text)' }}>{h.total}</div>
                <div style={{ fontSize: 11, color: 'var(--v2-text-3)', marginTop: 2 }}>{h.issues}</div>
              </div>
            </div>
          ))}
        </div>

        {/*  Tab Bar  */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--v2-border)', marginBottom: 20 }}>
          {TABS.map((t, i) => (
            <button key={t} className={`v2-tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
              {t}
            </button>
          ))}
        </div>

        {/* ═══════════════ TAB 1: Credentialing Queue ═══════════════ */}
        {activeTab === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18 }}>
            {/* Table */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <h2 className="v2-title" style={{ fontSize: 14, flex: 1 }}>
                  Credentialing Queue
                  <span style={{ fontWeight: 400, color: 'var(--v2-text-3)', marginLeft: 6 }}>({CRED_ROWS.length})</span>
                </h2>
                <button className="v2b v2b-s" style={{ fontSize: 12, padding: '5px 12px' }} disabled={credSelected.length === 0}>
                  <IconSend size={12} /> Send Reminders {credSelected.length > 0 && `(${credSelected.length})`}
                </button>
                <button className="v2b v2b-s" style={{ fontSize: 12, padding: '5px 12px' }}>
                  <IconDownload size={12} /> Export Queue
                </button>
              </div>

              <div className="v2-tw">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={th}><input type="checkbox" style={cbx} checked={credSelected.length === CRED_ROWS.length} onChange={toggleAllCred} /></th>
                      <th style={th}>Pharmacy</th>
                      <th style={th}>NCPDP ID</th>
                      <th style={th}>Credential Type</th>
                      <th style={th}>Expiry Date</th>
                      <th style={th}>Days Left</th>
                      <th style={th}>Priority</th>
                      <th style={th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CRED_ROWS.map(r => (
                      <tr key={r.id} style={{ background: credSelected.includes(r.id) ? 'var(--v2-primary-bg)' : undefined }}>
                        <td style={td}><input type="checkbox" style={cbx} checked={credSelected.includes(r.id)} onChange={() => toggleCred(r.id)} /></td>
                        <td style={{ ...td, fontWeight: 550 }}>{r.pharmacy}</td>
                        <td style={{ ...td, fontFamily: 'monospace', fontSize: 12 }}>{r.ncpdp}</td>
                        <td style={td}>{r.type}</td>
                        <td style={td}>{r.expiry}</td>
                        <td style={td}>
                          <span style={{ fontWeight: 600, color: r.daysLeft <= 14 ? 'var(--v2-red)' : r.daysLeft <= 30 ? 'var(--v2-amber)' : 'var(--v2-text)' }}>
                            {r.daysLeft}d
                          </span>
                        </td>
                        <td style={td}>{priorityBadge(r.priority)}</td>
                        <td style={td}>
                          <button className="v2b v2b-g" style={{ fontSize: 11, padding: '3px 8px' }}>
                            Review <IconChevronRight size={10} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="v2c" style={{ padding: 20, height: 'fit-content' }}>
              <h3 className="v2-title" style={{ fontSize: 13, marginBottom: 16 }}>Upcoming Deadlines</h3>
              {[
                { label: 'Next 30 Days', count: 2, color: 'var(--v2-red)' },
                { label: 'Next 60 Days', count: 5, color: 'var(--v2-amber)' },
                { label: 'Next 90 Days', count: 8, color: 'var(--v2-primary)' },
              ].map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--v2-border-lt)' }}>
                  <span style={{ fontSize: 13, color: 'var(--v2-text-2)' }}>{d.label}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: d.color }}>{d.count}</span>
                </div>
              ))}

              <div style={{ marginTop: 20 }}>
                <h4 className="v2-label" style={{ marginBottom: 10 }}>By Credential Type</h4>
                {[
                  { type: 'DEA Renewal', count: 4 },
                  { type: 'State License', count: 3 },
                  { type: 'Accreditation', count: 3 },
                ].map(c => (
                  <div key={c.type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                    <span style={{ fontSize: 12, color: 'var(--v2-text-2)' }}>{c.type}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--v2-text)' }}>{c.count}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20 }}>
                <h4 className="v2-label" style={{ marginBottom: 10 }}>Quick Actions</h4>
                <button className="v2b v2b-p" style={{ width: '100%', fontSize: 12, padding: '7px 14px', marginBottom: 6, justifyContent: 'center' }}>
                  <IconSend size={12} /> Send All Reminders
                </button>
                <button className="v2b v2b-s" style={{ width: '100%', fontSize: 12, padding: '7px 14px', justifyContent: 'center' }}>
                  <IconRefresh size={12} /> Sync Credentials
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ TAB 2: FWA Attestation ═══════════════ */}
        {activeTab === 1 && (
          <div>
            {/* Overall Completion */}
            <div className="v2c" style={{ padding: '16px 20px', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                <h2 className="v2-title" style={{ fontSize: 14, flex: 1 }}>Overall FWA Attestation Completion</h2>
                <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--v2-amber)' }}>91.1%</span>
              </div>
              <div style={{ height: 10, borderRadius: 5, background: 'var(--v2-surface-3)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '91.1%', borderRadius: 5, background: 'linear-gradient(90deg, var(--v2-primary), #818CF8)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span className="v2-sub">58,290 of 64,081 pharmacies attested</span>
                <span className="v2-sub">5,791 remaining</span>
              </div>
            </div>

            {/* Network Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
              {FWA_NETWORKS.map(n => (
                <div key={n.name} className="v2c" style={{ padding: '16px 20px' }}>
                  <div className="v2-label" style={{ marginBottom: 8 }}>{n.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: n.pct >= 90 ? 'var(--v2-green)' : 'var(--v2-amber)' }}>{n.pct}%</span>
                    <span style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>attested</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--v2-surface-3)', overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${n.pct}%`, borderRadius: 3, background: n.pct >= 90 ? 'var(--v2-green)' : 'var(--v2-amber)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>{n.attested.toLocaleString()} / {n.total.toLocaleString()}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--v2-red)' }}>{(n.total - n.attested).toLocaleString()} pending</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Overdue Table */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <h3 className="v2-title" style={{ fontSize: 14, flex: 1 }}>
                Overdue Pharmacies
                <span style={{ fontWeight: 400, color: 'var(--v2-text-3)', marginLeft: 6 }}>({FWA_OVERDUE.length})</span>
              </h3>
              <button className="v2b v2b-p" style={{ fontSize: 12, padding: '5px 12px' }} disabled={fwaSelected.length === 0}>
                <IconSend size={12} /> Send Reminders {fwaSelected.length > 0 && `(${fwaSelected.length})`}
              </button>
            </div>

            <div className="v2-tw">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}><input type="checkbox" style={cbx} checked={fwaSelected.length === FWA_OVERDUE.length} onChange={toggleAllFwa} /></th>
                    <th style={th}>Pharmacy</th>
                    <th style={th}>NCPDP ID</th>
                    <th style={th}>Network</th>
                    <th style={th}>Due Date</th>
                    <th style={th}>Days Overdue</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {FWA_OVERDUE.map(r => (
                    <tr key={r.id} style={{ background: fwaSelected.includes(r.id) ? 'var(--v2-primary-bg)' : undefined }}>
                      <td style={td}><input type="checkbox" style={cbx} checked={fwaSelected.includes(r.id)} onChange={() => toggleFwa(r.id)} /></td>
                      <td style={{ ...td, fontWeight: 550 }}>{r.pharmacy}</td>
                      <td style={{ ...td, fontFamily: 'monospace', fontSize: 12 }}>{r.ncpdp}</td>
                      <td style={td}>{r.network}</td>
                      <td style={td}>{r.dueDate}</td>
                      <td style={td}>
                        <span style={{ fontWeight: 600, color: 'var(--v2-red)' }}>{r.daysPast}d overdue</span>
                      </td>
                      <td style={td}>
                        <button className="v2b v2b-g" style={{ fontSize: 11, padding: '3px 8px' }}>
                          Contact <IconChevronRight size={10} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════ TAB 3: No Surprises Filing ═══════════════ */}
        {activeTab === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18 }}>
            {/* Main Wizard */}
            <div>
              {/* Step Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
                {['Select Period', 'Validate Data', 'Review Report', 'Submit to CMS'].map((s, i) => (
                  <React.Fragment key={s}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 14, fontSize: 12, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: nsaStep > i ? 'var(--v2-green)' : nsaStep === i ? 'var(--v2-primary)' : 'var(--v2-surface-3)',
                        color: nsaStep >= i ? '#fff' : 'var(--v2-text-3)',
                      }}>
                        {nsaStep > i ? <IconCheck size={14} color="#fff" /> : i + 1}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: nsaStep === i ? 600 : 400, color: nsaStep === i ? 'var(--v2-text)' : 'var(--v2-text-3)', whiteSpace: 'nowrap' }}>{s}</span>
                    </div>
                    {i < 3 && <div style={{ flex: 1, height: 2, background: nsaStep > i ? 'var(--v2-green)' : 'var(--v2-surface-3)', margin: '0 12px' }} />}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Select Period */}
              {nsaStep === 0 && (
                <div className="v2c" style={{ padding: 24 }}>
                  <h3 className="v2-title" style={{ fontSize: 14, marginBottom: 18 }}>Select Filing Period & Filters</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <DateRange
                      label="Profile Last Updated Date"
                      required
                      fromValue={nsaFrom}
                      toValue={nsaTo}
                      onFromChange={(e) => setNsaFrom(e.target.value)}
                      onToChange={(e) => setNsaTo(e.target.value)}
                    />
                    <div>
                      <FieldLabel>Relationship Type</FieldLabel>
                      <Select value={nsaRelType} onChange={(e) => setNsaRelType(e.target.value)}>
                        <option value="">All Relationships</option>
                        {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                      </Select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                      <FieldLabel>Provider Type</FieldLabel>
                      <Select value={nsaProvType} onChange={(e) => setNsaProvType(e.target.value)}>
                        <option value="">All Provider Types</option>
                        {PROVIDER_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                      </Select>
                    </div>
                    <div>
                      <FieldLabel>State</FieldLabel>
                      <Select value={nsaState} onChange={(e) => setNsaState(e.target.value)}>
                        <option value="">All States</option>
                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button className="v2b v2b-p" style={{ fontSize: 13 }} onClick={() => setNsaStep(1)}>
                      Validate Data <IconChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Validate Data */}
              {nsaStep === 1 && (
                <div className="v2c" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <h3 className="v2-title" style={{ fontSize: 14, flex: 1 }}>Data Validation Checks</h3>
                    <span className="v2g v2g-ok">6 Passed</span>
                    <span className="v2g v2g-w">1 Warning</span>
                    <span className="v2g v2g-err">1 Failed</span>
                  </div>

                  <div className="v2-tw" style={{ marginBottom: 18 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={th}>Check</th>
                          <th style={th}>Status</th>
                          <th style={th}>Passed</th>
                          <th style={th}>Warnings</th>
                          <th style={th}>Failed</th>
                          <th style={th}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {VALIDATION_CHECKS.map(v => (
                          <tr key={v.id}>
                            <td style={{ ...td, fontWeight: 500 }}>{v.check}</td>
                            <td style={td}>{statusIcon(v.status)}</td>
                            <td style={{ ...td, color: 'var(--v2-green)', fontWeight: 600 }}>{v.pass.toLocaleString()}</td>
                            <td style={{ ...td, color: v.warn > 0 ? 'var(--v2-amber)' : 'var(--v2-text-3)', fontWeight: v.warn > 0 ? 600 : 400 }}>{v.warn.toLocaleString()}</td>
                            <td style={{ ...td, color: v.fail > 0 ? 'var(--v2-red)' : 'var(--v2-text-3)', fontWeight: v.fail > 0 ? 600 : 400 }}>{v.fail.toLocaleString()}</td>
                            <td style={td}>
                              {v.canFix && (
                                <button className="v2b v2b-s" style={{ fontSize: 11, padding: '3px 10px' }}>
                                  <IconRefresh size={10} /> Auto-Fix
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className="v2b v2b-s" style={{ fontSize: 13 }} onClick={() => setNsaStep(0)}>Back</button>
                    <button className="v2b v2b-p" style={{ fontSize: 13 }} onClick={() => setNsaStep(2)}>
                      Review Report <IconChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review Report */}
              {nsaStep === 2 && (
                <div className="v2c" style={{ padding: 24 }}>
                  <h3 className="v2-title" style={{ fontSize: 14, marginBottom: 18 }}>Report Preview — Q1 2026</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 18 }}>
                    <div style={{ padding: '12px 16px', borderRadius: 8, background: 'var(--v2-green-bg)' }}>
                      <div className="v2-label" style={{ marginBottom: 4 }}>Total Pharmacies</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--v2-green)' }}>38,569</div>
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: 8, background: 'var(--v2-primary-bg)' }}>
                      <div className="v2-label" style={{ marginBottom: 4 }}>States Covered</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--v2-primary)' }}>48</div>
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: 8, background: 'var(--v2-amber-bg)' }}>
                      <div className="v2-label" style={{ marginBottom: 4 }}>Data Warnings</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--v2-amber)' }}>614</div>
                    </div>
                  </div>

                  <h4 className="v2-label" style={{ marginBottom: 10, marginTop: 20 }}>Pharmacy Type Breakdown</h4>
                  <div className="v2-tw" style={{ marginBottom: 18 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={th}>Pharmacy Type</th>
                          <th style={th}>Count</th>
                          <th style={th}>% of Total</th>
                          <th style={th}>Distribution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {NSA_BREAKDOWN.map(b => (
                          <tr key={b.type}>
                            <td style={{ ...td, fontWeight: 500 }}>{b.type}</td>
                            <td style={{ ...td, fontWeight: 600 }}>{b.count.toLocaleString()}</td>
                            <td style={td}>{b.pct}%</td>
                            <td style={td}>
                              <div style={{ height: 6, width: '100%', maxWidth: 160, borderRadius: 3, background: 'var(--v2-surface-3)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${b.pct}%`, borderRadius: 3, background: 'var(--v2-primary)' }} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className="v2b v2b-s" style={{ fontSize: 13 }} onClick={() => setNsaStep(1)}>Back</button>
                    <button className="v2b v2b-p" style={{ fontSize: 13 }} onClick={() => setNsaStep(3)}>
                      Submit to CMS <IconChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Submit / Success */}
              {nsaStep === 3 && (
                <div className="v2c" style={{ padding: 24 }}>
                  {!nsaSubmitted ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <IconFileCheck size={48} color="var(--v2-primary)" />
                      <h3 className="v2-title" style={{ fontSize: 16, marginTop: 16, marginBottom: 8 }}>Ready to Submit</h3>
                      <p style={{ fontSize: 13, color: 'var(--v2-text-2)', maxWidth: 440, margin: '0 auto 20px' }}>
                        You are about to submit the No Surprises Act Q1 2026 report to CMS containing
                        data for <strong>38,569 pharmacies</strong> across <strong>48 states</strong>.
                        This action cannot be undone.
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                        <button className="v2b v2b-s" style={{ fontSize: 13 }} onClick={() => setNsaStep(2)}>Back</button>
                        <button className="v2b v2b-p" style={{ fontSize: 13, padding: '8px 24px' }} onClick={() => setNsaSubmitted(true)}>
                          <IconSend size={13} /> Confirm & Submit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '30px 0' }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 28, background: 'var(--v2-green-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                      }}>
                        <IconCheck size={28} color="var(--v2-green)" />
                      </div>
                      <h3 className="v2-title" style={{ fontSize: 16, marginBottom: 6 }}>Successfully Submitted</h3>
                      <p style={{ fontSize: 13, color: 'var(--v2-text-2)', marginBottom: 16 }}>
                        Your No Surprises Act Q1 2026 report has been submitted to CMS.
                      </p>
                      <div className="v2c" style={{ display: 'inline-block', padding: '12px 24px', textAlign: 'left', boxShadow: 'var(--v2-shadow-md)' }}>
                        <div style={{ fontSize: 11, color: 'var(--v2-text-3)', marginBottom: 4 }}>CMS Confirmation ID</div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: 'var(--v2-primary)' }}>CMS-NSA-2026Q1-59302</div>
                      </div>
                      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 10 }}>
                        <button className="v2b v2b-s" style={{ fontSize: 12 }}>
                          <IconDownload size={12} /> Download Receipt
                        </button>
                        <button className="v2b v2b-p" style={{ fontSize: 12 }} onClick={() => { setNsaStep(0); setNsaSubmitted(false); }}>
                          New Filing
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              {/* Filing Deadline */}
              <div className="v2c" style={{ padding: 20, marginBottom: 14 }}>
                <h4 className="v2-label" style={{ marginBottom: 10 }}>Filing Deadline</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--v2-amber-bg)' }}>
                  <IconCalendar size={18} color="var(--v2-amber)" />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--v2-amber)' }}>April 15, 2026</div>
                    <div style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>Q1 2026 — 14 days remaining</div>
                  </div>
                </div>
              </div>

              {/* Past Submissions */}
              <div className="v2c" style={{ padding: 20 }}>
                <h4 className="v2-label" style={{ marginBottom: 10 }}>Past Submissions</h4>
                {PAST_SUBMISSIONS.map(s => (
                  <div key={s.cmsId} style={{ padding: '10px 0', borderBottom: '1px solid var(--v2-border-lt)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)' }}>{s.period}</span>
                      <span className="v2g v2g-ok">{s.status}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>Filed {s.date}</div>
                    <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--v2-text-3)', marginTop: 2 }}>{s.cmsId}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ TAB 4: Alerts ═══════════════ */}
        {activeTab === 3 && (
          <div>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              {(['all', 'critical', 'warning', 'info'] as const).map(f => (
                <button
                  key={f}
                  className={`v2b ${alertFilter === f ? 'v2b-p' : 'v2b-s'}`}
                  style={{ fontSize: 12, padding: '5px 14px', textTransform: 'capitalize' }}
                  onClick={() => setAlertFilter(f)}
                >
                  {f === 'all' ? 'All' : f}
                  <span style={{ marginLeft: 4, opacity: .7 }}>
                    ({f === 'all' ? ALERT_ITEMS.length : ALERT_ITEMS.filter(a => a.severity === f).length})
                  </span>
                </button>
              ))}
            </div>

            {/* Alert List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredAlerts.map(a => {
                const Icon = a.icon;
                const severityColor = a.severity === 'critical' ? 'var(--v2-red)' : a.severity === 'warning' ? 'var(--v2-amber)' : 'var(--v2-primary)';
                const severityBg = a.severity === 'critical' ? 'var(--v2-red-bg)' : a.severity === 'warning' ? 'var(--v2-amber-bg)' : 'var(--v2-primary-bg)';
                const severityBadgeCls = a.severity === 'critical' ? 'v2g-err' : a.severity === 'warning' ? 'v2g-w' : 'v2g-p';

                return (
                  <div
                    key={a.id}
                    className="v2c"
                    style={{
                      padding: '14px 20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      borderLeft: a.severity === 'critical' ? `3px solid var(--v2-red)` : undefined,
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 8, background: severityBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={16} color={severityColor} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className={`v2g ${severityBadgeCls}`} style={{ textTransform: 'capitalize' }}>{a.severity}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)' }}>{a.title}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--v2-text-2)', margin: '0 0 6px', lineHeight: 1.5 }}>{a.desc}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>{a.time}</span>
                        {a.ncpdp !== 'N/A' && (
                          <span style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>
                            NCPDP: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--v2-text-2)' }}>{a.ncpdp}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="v2b v2b-s" style={{ fontSize: 11, padding: '5px 12px', flexShrink: 0 }}>
                      Resolve
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </>
  );
}
