'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/v3/TopbarV3';
import {
  IconShield, IconAlertTriangle, IconCheck, IconSend, IconDownload,
  IconCalendar, IconInfo, IconFileCheck, IconRefresh, IconChevronRight,
  IconSparkles, IconStore, IconShieldCheck, IconKey, IconUsers,
  IconZap, IconActivity,
} from '@/components/ui/Icons';
import { FieldLabel, Select, DateRange } from '@/components/ui/FormFields';
import { RELATIONSHIPS, PROVIDER_TYPES, US_STATES } from '@/lib/filter-options';

// -- DATA --

const HEALTH_SCORES = [
  { label: 'DEA Compliance', score: 98, total: '81,500', issues: '1,168 expiring', color: '#449055' },
  { label: 'Network Adequacy', score: 96, total: '42 networks', issues: '3 below threshold', color: '#449055' },
  { label: 'FWA Status', score: 91, total: '38,569', issues: '3,412 pending', color: '#D97706' },
  { label: 'NSA Readiness', score: 99, total: '12 filings', issues: '1 upcoming', color: '#449055' },
];

const TABS = ['Credentialing Queue', 'FWA Attestation', 'No Surprises Filing', 'Alerts'] as const;

// Tab 1: Credentialing Queue
const CRED_ROWS = [
  { id: 1,  pharmacy: 'CareRx Pharmacy #0842',       ncpdp: '1234567', type: 'DEA Renewal',     expiry: '2026-04-12', daysLeft: 11,  priority: 'urgent'  },
  { id: 2,  pharmacy: 'Valley Rx Solutions #2',       ncpdp: '3987234', type: 'State License',   expiry: '2026-04-18', daysLeft: 17,  priority: 'urgent'  },
  { id: 3,  pharmacy: 'Sunrise Compounding Ctr',      ncpdp: '5021847', type: 'Accreditation',   expiry: '2026-04-25', daysLeft: 24,  priority: 'high'    },
  { id: 4,  pharmacy: 'Mountain View Clinical Rx',    ncpdp: '9012847', type: 'DEA Renewal',     expiry: '2026-05-03', daysLeft: 32,  priority: 'high'    },
  { id: 5,  pharmacy: 'Bayou Pharmacy Partners',      ncpdp: '6789013', type: 'State License',   expiry: '2026-05-14', daysLeft: 43,  priority: 'medium'  },
  { id: 6,  pharmacy: 'PharmaPlus #227',              ncpdp: '2345891', type: 'DEA Renewal',     expiry: '2026-05-22', daysLeft: 51,  priority: 'medium'  },
  { id: 7,  pharmacy: 'Great Lakes Specialty Rx',     ncpdp: '8901234', type: 'Accreditation',   expiry: '2026-06-01', daysLeft: 61,  priority: 'medium'  },
  { id: 8,  pharmacy: 'SunHealth Compounding',        ncpdp: '4567890', type: 'State License',   expiry: '2026-06-15', daysLeft: 75,  priority: 'normal'  },
  { id: 9,  pharmacy: 'Pacific Coast Pharmacy',       ncpdp: '7890123', type: 'DEA Renewal',     expiry: '2026-06-28', daysLeft: 88,  priority: 'normal'  },
  { id: 10, pharmacy: 'Heartland Clinical Rx #44',    ncpdp: '3456789', type: 'Accreditation',   expiry: '2026-07-10', daysLeft: 100, priority: 'normal'  },
];

// Tab 2: FWA Attestation
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

// Tab 3: No Surprises Filing
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

// Tab 4: Alerts
const ALERT_ITEMS = [
  { id: 1, severity: 'critical', icon: IconAlertTriangle, title: 'DEA License Expired -- CareRx Pharmacy #0842',           desc: 'DEA registration expired on Mar 29. Pharmacy must cease dispensing controlled substances until renewed.', time: '2h ago',  ncpdp: '1234567' },
  { id: 2, severity: 'critical', icon: IconAlertTriangle, title: 'FWA Attestation Overdue -- 6 Pharmacies',                desc: 'Midwest Chain #44, SunHealth Compounding, and 4 others have missed their FWA attestation deadline.',     time: '3h ago',  ncpdp: 'Multiple' },
  { id: 3, severity: 'critical', icon: IconShield,        title: 'Network Adequacy Below Threshold -- Montana',            desc: 'Rural pharmacy count has fallen below mandated minimum. 2 counties now underserved.',                time: '5h ago',  ncpdp: 'N/A' },
  { id: 4, severity: 'warning',  icon: IconCalendar,      title: 'State License Expiring -- Valley Rx Solutions #2',       desc: 'State pharmacy license expires in 17 days. Renewal application has not been received.',                  time: '6h ago',  ncpdp: '3987234' },
  { id: 5, severity: 'warning',  icon: IconKey,           title: 'Accreditation Due -- Sunrise Compounding Ctr',           desc: 'ACHC accreditation expires in 24 days. Surveyor visit not yet scheduled.',                               time: '8h ago',  ncpdp: '5021847' },
  { id: 6, severity: 'warning',  icon: IconCalendar,      title: 'NSA Q1 2026 Filing Deadline Approaching',                desc: 'No Surprises Act quarterly filing due April 15. Report generation recommended within 7 days.',           time: '12h ago', ncpdp: 'N/A' },
  { id: 7, severity: 'info',     icon: IconInfo,          title: 'Credential Audit Completed -- AGT-12',                   desc: '89 DEA expirations and 112 license renewals identified across 32 states.',                               time: '1d ago',  ncpdp: 'N/A' },
  { id: 8, severity: 'info',     icon: IconCheck,         title: 'Weekly Network Change Report Available',                  desc: '247 pharmacy changes flagged across 12 states. 14 closures, 31 new openings, 202 profile updates.',      time: '1d ago',  ncpdp: 'N/A' },
  { id: 9, severity: 'info',     icon: IconFileCheck,     title: 'Q4 2025 NSA Filing Accepted',                     desc: 'Confirmation ID CMS-NSA-2025Q4-48291. Filing covered 38,104 pharmacies.',                                time: '2d ago',  ncpdp: 'N/A' },
];

// -- HELPERS --

function ScoreRing({ score, color, size = 52 }: { score: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--v3-surface-2)" strokeWidth={3.5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3.5}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fill={color}
        style={{ fontSize: 13, fontWeight: 700, transform: 'rotate(90deg)', transformOrigin: 'center' }}>
        {score}
      </text>
    </svg>
  );
}

function priorityBadge(p: string) {
  if (p === 'urgent') return <span className="v3-badge v3-badge-red">Urgent</span>;
  if (p === 'high')   return <span className="v3-badge v3-badge-amber">High</span>;
  if (p === 'medium') return <span className="v3-badge v3-badge-accent">Medium</span>;
  return <span className="v3-badge v3-badge-gray">Normal</span>;
}

function statusIcon(s: string) {
  if (s === 'pass') return <span className="v3-badge v3-badge-green" style={{ gap: 4 }}><IconCheck size={10} /> Pass</span>;
  if (s === 'warn') return <span className="v3-badge v3-badge-amber" style={{ gap: 4 }}><IconAlertTriangle size={10} /> Warn</span>;
  return <span className="v3-badge v3-badge-red" style={{ gap: 4 }}><IconAlertTriangle size={10} /> Fail</span>;
}

function InitialAvatar({ name, color }: { name: string; color: string }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8, background: `${color}14`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 700, color, flexShrink: 0,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

const AVATAR_COLORS = ['#005C8D', '#449055', '#DC2626', '#D97706', '#005C8D', '#004870', '#DB2777', '#449055', '#005C8D', '#DC2626'];

// -- MAIN PAGE --

export default function CompliancePageV3() {
  const [activeTab, setActiveTab] = useState(0);
  const [aiQuery, setAiQuery] = useState('');

  // Credentialing state
  const [credSelected, setCredSelected] = useState<number[]>([]);
  const toggleCred = (id: number) => setCredSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAllCred = () => setCredSelected(p => p.length === CRED_ROWS.length ? [] : CRED_ROWS.map(r => r.id));

  // FWA state
  const [fwaSelected, setFwaSelected] = useState<number[]>([]);
  const toggleFwa = (id: number) => setFwaSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAllFwa = () => setFwaSelected(p => p.length === FWA_OVERDUE.length ? [] : FWA_OVERDUE.map(r => r.id));

  // NSA wizard state
  const [nsaStep, setNsaStep] = useState(0);
  const [nsaFrom, setNsaFrom] = useState('2026-01-01');
  const [nsaTo, setNsaTo] = useState('2026-03-31');
  const [nsaRelType, setNsaRelType] = useState('');
  const [nsaProvType, setNsaProvType] = useState('');
  const [nsaState, setNsaState] = useState('');
  const [nsaSubmitted, setNsaSubmitted] = useState(false);

  // Alerts filter
  const [alertFilter, setAlertFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const filteredAlerts = alertFilter === 'all' ? ALERT_ITEMS : ALERT_ITEMS.filter(a => a.severity === alertFilter);

  return (
    <>
      <Topbar title="Compliance" />

      <main style={{ padding: '0 24px 40px' }}>

        {/* AI Prompt */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 0 24px' }}>
          <div className="v3-prompt" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconSparkles size={18} color="var(--v3-accent)" />
            <input
              className="v3-input"
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
              placeholder="Ask about compliance status, credentials, FWA, or No Surprises Act..."
              style={{ border: 'none', padding: 0, background: 'transparent', fontSize: 14, flex: 1, boxShadow: 'none' }}
            />
            <button className="v3-btn v3-btn-accent" style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12.5, flexShrink: 0 }}>
              <IconSend size={13} color="#fff" />
            </button>
          </div>
        </div>

        {/* Health Score Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {HEALTH_SCORES.map(h => (
            <div key={h.label} className="v3-card v3-card-hover" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <ScoreRing score={h.score} color={h.color} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="v3-label" style={{ marginBottom: 2 }}>{h.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v3-text)' }}>{h.total}</div>
                <div style={{ fontSize: 11, color: 'var(--v3-text-3)', marginTop: 2 }}>{h.issues}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--v3-border)', marginBottom: 22 }}>
          {TABS.map((t, i) => (
            <button key={t} className={`v3-tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
              {t}
            </button>
          ))}
        </div>

        {/* TAB 1: Credentialing Queue */}
        {activeTab === 0 && (
          <div>
            {/* Bulk actions bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <h2 className="v3-title" style={{ fontSize: 14, flex: 1 }}>
                Credentialing Queue
                <span style={{ fontWeight: 400, color: 'var(--v3-text-3)', marginLeft: 6 }}>({CRED_ROWS.length})</span>
              </h2>
              <button className="v3-btn v3-btn-accent" style={{ fontSize: 12, padding: '6px 14px' }} disabled={credSelected.length === 0}>
                <IconSend size={12} color="#fff" /> Send Reminders {credSelected.length > 0 && `(${credSelected.length})`}
              </button>
              <button className="v3-btn v3-btn-soft" style={{ fontSize: 12, padding: '6px 14px' }}>
                <IconDownload size={12} /> Export Queue
              </button>
            </div>

            <div className="v3-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" style={{ width: 15, height: 15, accentColor: 'var(--v3-accent)', cursor: 'pointer' }} checked={credSelected.length === CRED_ROWS.length} onChange={toggleAllCred} /></th>
                    <th>Pharmacy</th>
                    <th>NCPDP ID</th>
                    <th>Type</th>
                    <th>Expiry Date</th>
                    <th>Days Left</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {CRED_ROWS.map((r, idx) => (
                    <tr key={r.id} style={{ background: credSelected.includes(r.id) ? 'var(--v3-accent-bg)' : undefined }}>
                      <td><input type="checkbox" style={{ width: 15, height: 15, accentColor: 'var(--v3-accent)', cursor: 'pointer' }} checked={credSelected.includes(r.id)} onChange={() => toggleCred(r.id)} /></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <InitialAvatar name={r.pharmacy} color={AVATAR_COLORS[idx % AVATAR_COLORS.length]} />
                          <span style={{ fontWeight: 550 }}>{r.pharmacy}</span>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.ncpdp}</td>
                      <td>{r.type}</td>
                      <td>{r.expiry}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: r.daysLeft <= 14 ? 'var(--v3-red)' : r.daysLeft <= 30 ? 'var(--v3-amber)' : 'var(--v3-text)' }}>
                          {r.daysLeft}d
                        </span>
                      </td>
                      <td>{priorityBadge(r.priority)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: FWA Attestation */}
        {activeTab === 1 && (
          <div>
            {/* Overall Completion */}
            <div className="v3-card" style={{ padding: '18px 22px', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                <h2 className="v3-title" style={{ fontSize: 14, flex: 1 }}>Overall FWA Attestation Completion</h2>
                <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--v3-amber)' }}>91.1%</span>
              </div>
              <div style={{ height: 10, borderRadius: 5, background: 'var(--v3-surface-3)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '91.1%', borderRadius: 5, background: 'linear-gradient(90deg, var(--v3-accent), #76C799)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span className="v3-sub">58,290 of 64,081 pharmacies attested</span>
                <span className="v3-sub">5,791 remaining</span>
              </div>
            </div>

            {/* Network Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
              {FWA_NETWORKS.map(n => (
                <div key={n.name} className="v3-card v3-card-hover" style={{ padding: '16px 20px' }}>
                  <div className="v3-label" style={{ marginBottom: 8 }}>{n.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: n.pct >= 90 ? 'var(--v3-green)' : 'var(--v3-amber)' }}>{n.pct}%</span>
                    <span style={{ fontSize: 11, color: 'var(--v3-text-3)' }}>attested</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--v3-surface-3)', overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${n.pct}%`, borderRadius: 3, background: n.pct >= 90 ? 'var(--v3-green)' : 'var(--v3-amber)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--v3-text-3)' }}>{n.attested.toLocaleString()} / {n.total.toLocaleString()}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--v3-red)' }}>{(n.total - n.attested).toLocaleString()} pending</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Overdue Pharmacies Table */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <h3 className="v3-section" style={{ flex: 1, marginBottom: 0 }}>
                Overdue Pharmacies
                <span style={{ fontWeight: 400, color: 'var(--v3-text-3)', marginLeft: 6 }}>({FWA_OVERDUE.length})</span>
              </h3>
              <button className="v3-btn v3-btn-accent" style={{ fontSize: 12, padding: '6px 14px' }} disabled={fwaSelected.length === 0}>
                <IconSend size={12} color="#fff" /> Send Reminders {fwaSelected.length > 0 && `(${fwaSelected.length})`}
              </button>
            </div>

            <div className="v3-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" style={{ width: 15, height: 15, accentColor: 'var(--v3-accent)', cursor: 'pointer' }} checked={fwaSelected.length === FWA_OVERDUE.length} onChange={toggleAllFwa} /></th>
                    <th>Pharmacy</th>
                    <th>NCPDP ID</th>
                    <th>Network</th>
                    <th>Due Date</th>
                    <th>Days Overdue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {FWA_OVERDUE.map(r => (
                    <tr key={r.id} style={{ background: fwaSelected.includes(r.id) ? 'var(--v3-accent-bg)' : undefined }}>
                      <td><input type="checkbox" style={{ width: 15, height: 15, accentColor: 'var(--v3-accent)', cursor: 'pointer' }} checked={fwaSelected.includes(r.id)} onChange={() => toggleFwa(r.id)} /></td>
                      <td style={{ fontWeight: 550 }}>{r.pharmacy}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.ncpdp}</td>
                      <td>{r.network}</td>
                      <td>{r.dueDate}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--v3-red)' }}>{r.daysPast}d overdue</span>
                      </td>
                      <td>
                        <button className="v3-btn v3-btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }}>
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

        {/* TAB 3: No Surprises Filing */}
        {activeTab === 2 && (
          <div>
            {/* Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
              {['Select Period', 'Validate Data', 'Review Report', 'Submit Filing'].map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 15, fontSize: 12, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: nsaStep > i ? 'var(--v3-green)' : nsaStep === i ? 'var(--v3-accent)' : 'var(--v3-surface-3)',
                      color: nsaStep >= i ? '#fff' : 'var(--v3-text-3)',
                      transition: 'all .2s',
                    }}>
                      {nsaStep > i ? <IconCheck size={14} color="#fff" /> : i + 1}
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: nsaStep === i ? 600 : 400, color: nsaStep === i ? 'var(--v3-text)' : 'var(--v3-text-3)', whiteSpace: 'nowrap' }}>{s}</span>
                  </div>
                  {i < 3 && <div style={{ flex: 1, height: 2, background: nsaStep > i ? 'var(--v3-green)' : 'var(--v3-surface-3)', margin: '0 14px', borderRadius: 1, transition: 'background .2s' }} />}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Select Period */}
            {nsaStep === 0 && (
              <div className="v3-card" style={{ padding: 28 }}>
                <h3 className="v3-title" style={{ fontSize: 14, marginBottom: 20 }}>Select Filing Period & Filters</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
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
                  <button className="v3-btn v3-btn-accent" style={{ fontSize: 13 }} onClick={() => setNsaStep(1)}>
                    Validate Data <IconChevronRight size={12} color="#fff" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Validate Data */}
            {nsaStep === 1 && (
              <div className="v3-card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <h3 className="v3-title" style={{ fontSize: 14, flex: 1 }}>Data Validation Checks</h3>
                  <span className="v3-badge v3-badge-green">6 Passed</span>
                  <span className="v3-badge v3-badge-amber">1 Warning</span>
                  <span className="v3-badge v3-badge-red">1 Failed</span>
                </div>

                <div className="v3-table-wrap" style={{ marginBottom: 20 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Check</th>
                        <th>Status</th>
                        <th>Passed</th>
                        <th>Warnings</th>
                        <th>Failed</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {VALIDATION_CHECKS.map(v => (
                        <tr key={v.id}>
                          <td style={{ fontWeight: 500 }}>{v.check}</td>
                          <td>{statusIcon(v.status)}</td>
                          <td style={{ color: 'var(--v3-green)', fontWeight: 600 }}>{v.pass.toLocaleString()}</td>
                          <td style={{ color: v.warn > 0 ? 'var(--v3-amber)' : 'var(--v3-text-3)', fontWeight: v.warn > 0 ? 600 : 400 }}>{v.warn.toLocaleString()}</td>
                          <td style={{ color: v.fail > 0 ? 'var(--v3-red)' : 'var(--v3-text-3)', fontWeight: v.fail > 0 ? 600 : 400 }}>{v.fail.toLocaleString()}</td>
                          <td>
                            {v.canFix && (
                              <button className="v3-btn v3-btn-soft" style={{ fontSize: 11, padding: '3px 10px' }}>
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
                  <button className="v3-btn v3-btn-outline" style={{ fontSize: 13 }} onClick={() => setNsaStep(0)}>Back</button>
                  <button className="v3-btn v3-btn-accent" style={{ fontSize: 13 }} onClick={() => setNsaStep(2)}>
                    Review Report <IconChevronRight size={12} color="#fff" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Report */}
            {nsaStep === 2 && (
              <div className="v3-card" style={{ padding: 28 }}>
                <h3 className="v3-title" style={{ fontSize: 14, marginBottom: 20 }}>Report Preview -- Q1 2026</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 22 }}>
                  <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--v3-green-bg)' }}>
                    <div className="v3-label" style={{ marginBottom: 4 }}>Total Pharmacies</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--v3-green)' }}>38,569</div>
                  </div>
                  <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--v3-accent-bg)' }}>
                    <div className="v3-label" style={{ marginBottom: 4 }}>States Covered</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--v3-accent)' }}>48</div>
                  </div>
                  <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--v3-amber-bg)' }}>
                    <div className="v3-label" style={{ marginBottom: 4 }}>Data Warnings</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--v3-amber)' }}>614</div>
                  </div>
                </div>

                <div className="v3-label" style={{ marginBottom: 10, marginTop: 4 }}>Pharmacy Type Breakdown</div>
                <div className="v3-table-wrap" style={{ marginBottom: 20 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Pharmacy Type</th>
                        <th>Count</th>
                        <th>% of Total</th>
                        <th>Distribution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {NSA_BREAKDOWN.map(b => (
                        <tr key={b.type}>
                          <td style={{ fontWeight: 500 }}>{b.type}</td>
                          <td style={{ fontWeight: 600 }}>{b.count.toLocaleString()}</td>
                          <td>{b.pct}%</td>
                          <td>
                            <div style={{ height: 6, width: '100%', maxWidth: 160, borderRadius: 3, background: 'var(--v3-surface-3)', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${b.pct}%`, borderRadius: 3, background: 'var(--v3-accent)' }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button className="v3-btn v3-btn-outline" style={{ fontSize: 13 }} onClick={() => setNsaStep(1)}>Back</button>
                  <button className="v3-btn v3-btn-accent" style={{ fontSize: 13 }} onClick={() => setNsaStep(3)}>
                    Submit Filing <IconChevronRight size={12} color="#fff" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Submit / Success */}
            {nsaStep === 3 && (
              <div className="v3-card" style={{ padding: 28 }}>
                {!nsaSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: 16, background: 'var(--v3-accent-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                    }}>
                      <IconFileCheck size={28} color="var(--v3-accent)" />
                    </div>
                    <h3 className="v3-title" style={{ fontSize: 16, marginBottom: 8 }}>Ready to Submit</h3>
                    <p style={{ fontSize: 13, color: 'var(--v3-text-2)', maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6 }}>
                      You are about to submit the No Surprises Act Q1 2026 report to containing
                      data for <strong>38,569 pharmacies</strong> across <strong>48 states</strong>.
                      This action cannot be undone.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                      <button className="v3-btn v3-btn-outline" style={{ fontSize: 13 }} onClick={() => setNsaStep(2)}>Back</button>
                      <button className="v3-btn v3-btn-accent" style={{ fontSize: 13, padding: '8px 24px' }} onClick={() => setNsaSubmitted(true)}>
                        <IconSend size={13} color="#fff" /> Confirm & Submit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '36px 0' }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: 30, background: 'var(--v3-green-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                    }}>
                      <IconCheck size={28} color="var(--v3-green)" />
                    </div>
                    <h3 className="v3-title" style={{ fontSize: 16, marginBottom: 6 }}>Successfully Submitted</h3>
                    <p style={{ fontSize: 13, color: 'var(--v3-text-2)', marginBottom: 20, lineHeight: 1.5 }}>
                      Your No Surprises Act Q1 2026 report has been submitted successfully.
                    </p>
                    <div className="v3-card" style={{ display: 'inline-block', padding: '14px 28px', textAlign: 'left', boxShadow: 'var(--v3-shadow-md)' }}>
                      <div style={{ fontSize: 11, color: 'var(--v3-text-3)', marginBottom: 4 }}>Confirmation ID</div>
                      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'monospace', color: 'var(--v3-accent)' }}>CMS-NSA-2026Q1-59302</div>
                    </div>
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 10 }}>
                      <button className="v3-btn v3-btn-soft" style={{ fontSize: 12 }}>
                        <IconDownload size={12} /> Download Receipt
                      </button>
                      <button className="v3-btn v3-btn-accent" style={{ fontSize: 12 }} onClick={() => { setNsaStep(0); setNsaSubmitted(false); }}>
                        New Filing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Alerts */}
        {activeTab === 3 && (
          <div>
            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              {(['all', 'critical', 'warning', 'info'] as const).map(f => (
                <button
                  key={f}
                  className={`v3-btn ${alertFilter === f ? 'v3-btn-accent' : 'v3-btn-soft'}`}
                  style={{ fontSize: 12, padding: '6px 16px', textTransform: 'capitalize' }}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredAlerts.map(a => {
                const Icon = a.icon;
                const severityColor = a.severity === 'critical' ? 'var(--v3-red)' : a.severity === 'warning' ? 'var(--v3-amber)' : 'var(--v3-accent)';
                const severityBg = a.severity === 'critical' ? 'var(--v3-red-bg)' : a.severity === 'warning' ? 'var(--v3-amber-bg)' : 'var(--v3-accent-bg)';
                const severityBadgeCls = a.severity === 'critical' ? 'v3-badge-red' : a.severity === 'warning' ? 'v3-badge-amber' : 'v3-badge-accent';

                return (
                  <div
                    key={a.id}
                    className="v3-card"
                    style={{
                      padding: '16px 22px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      borderLeft: a.severity === 'critical' ? '3px solid var(--v3-red)' : undefined,
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, background: severityBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={16} color={severityColor} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className={`v3-badge ${severityBadgeCls}`} style={{ textTransform: 'capitalize' }}>{a.severity}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--v3-text)' }}>{a.title}</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: 'var(--v3-text-2)', margin: '0 0 6px', lineHeight: 1.5 }}>{a.desc}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 11, color: 'var(--v3-text-3)' }}>{a.time}</span>
                        {a.ncpdp !== 'N/A' && (
                          <span style={{ fontSize: 11, color: 'var(--v3-text-3)' }}>
                            NCPDP: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--v3-text-2)' }}>{a.ncpdp}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="v3-btn v3-btn-outline" style={{ fontSize: 11, padding: '5px 14px', flexShrink: 0 }}>
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
