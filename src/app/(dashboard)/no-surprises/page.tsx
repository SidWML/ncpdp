'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  IconCheck, IconAlertTriangle, IconDownload, IconRefresh, IconSearch, IconChevronRight,
} from '@/components/ui/Icons';
import { FieldLabel, TextInput, Select, DateRange } from '@/components/ui/FormFields';
import {
  PROVIDER_TYPES, RELATIONSHIPS, DISPENSER_CLASSES, SERVICES, PARENT_ORGS, LANGUAGES,
} from '@/lib/filter-options';

/* ─── Step config ────────────────────────────────────────────────── */
const STEPS = [
  { label: 'Query & Filter',   desc: 'Set filter criteria'          },
  { label: 'Validate Data',    desc: 'Automated data checks'        },
  { label: 'Review Report',    desc: 'Preview before submitting'    },
  { label: 'Submit to CMS',    desc: 'File electronically'          },
];

/* ─── Validation checks ──────────────────────────────────────────── */
const CHECKS = [
  { label: 'Profile Last Updated Date',    detail: 'All pharmacies have profiles updated within required timeframe',   status: 'pass', pass: 38569, total: 38569 },
  { label: 'Active NCPDP ID Status',       detail: 'All pharmacies have active NCPDP identifiers',                    status: 'pass', pass: 38569, total: 38569 },
  { label: 'Address Completeness',         detail: 'Street, city, state, ZIP all populated',                          status: 'pass', pass: 38569, total: 38569 },
  { label: 'Phone Number Verified',        detail: '312 pharmacies have unverified or potentially outdated numbers',   status: 'warn', pass: 38257, total: 38569 },
  { label: 'Provider Type Classification', detail: '47 pharmacies missing required provider type — must fix',          status: 'fail', pass: 38522, total: 38569 },
  { label: 'Dispenser Class Populated',    detail: 'All pharmacies have dispenser class assigned',                     status: 'pass', pass: 38569, total: 38569 },
  { label: 'Accreditation Currency',       detail: 'URAC/ACHC status current within 12 months',                       status: 'pass', pass: 38569, total: 38569 },
  { label: 'Hours of Operation',           detail: '89 pharmacies missing weekend hours — warning only',               status: 'warn', pass: 38480, total: 38569 },
];

const PAST = [
  { period: 'Q4 2025', submitted: 'Jan 14, 2026', count: '37,890', status: 'accepted', cms: 'CMS-NSA-Q42025-0847' },
  { period: 'Q3 2025', submitted: 'Oct 12, 2025', count: '37,210', status: 'accepted', cms: 'CMS-NSA-Q32025-0612' },
  { period: 'Q2 2025', submitted: 'Jul 11, 2025', count: '36,840', status: 'accepted', cms: 'CMS-NSA-Q22025-0388' },
];

const DISP_CLASSES = DISPENSER_CLASSES;

/* Form components imported from @/components/ui/FormFields */
const FL = FieldLabel;
const Sel = Select;
const Inp = TextInput;
const DRange = DateRange;

const statusCfg = {
  pass: { color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
  warn: { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  fail: { color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
};

/* ─── Main ───────────────────────────────────────────────────────── */
export default function NoSurprisesPage() {
  const [step, setStep]     = useState(0);
  const [querying, setQuerying] = useState(false);
  const [queried, setQueried]   = useState(false);
  const [fixing, setFixing] = useState(false);
  const [fixed, setFixed]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const checks = fixed
    ? CHECKS.map(c => ({ ...c, status: 'pass' as const, pass: c.total }))
    : CHECKS;

  const hasFailure = checks.some(c => c.status === 'fail');

  function handleQuery() {
    setQuerying(true);
    setTimeout(() => { setQuerying(false); setQueried(true); }, 900);
  }

  function handleFix() {
    setFixing(true);
    setTimeout(() => { setFixing(false); setFixed(true); }, 1600);
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  function goToStep(i: number) {
    // Auto-set prerequisites when jumping ahead
    if (i >= 1 && !queried) { setQueried(true); }
    if (i >= 2 && !fixed)   { setFixed(true); }
    setStep(i);
  }

  return (
    <>
      <Topbar
        title="No Surprises Report"
        subtitle="CMS No Surprises Act — pharmacy network directory filing"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ fontSize: 12, gap: 5 }}>
              <IconDownload size={13}/> Download Template
            </button>
          </div>
        }
      />
      <main style={{ padding: '16px 20px 40px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>

        {/* ── Main content ── */}
        <div>
          {/* Step progress */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 0 }}>
            {STEPS.map((s, i) => {
              const completed = i < step;
              const active = i === step;
              return (
                <React.Fragment key={s.label}>
                  <div
                    onClick={() => goToStep(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                      opacity: !active && !completed ? 0.7 : 1,
                      transition: 'opacity .15s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={e => { if (!active && !completed) e.currentTarget.style.opacity = '0.7'; }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 600, flexShrink: 0,
                      background: completed ? '#10B981' : active ? '#1E5690' : '#E2E8F0',
                      color: completed || active ? '#fff' : '#94A3B8',
                      transition: 'all .15s',
                    }}>
                      {completed ? <IconCheck size={13} color="#fff"/> : i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#1E5690' : completed ? '#10B981' : '#94A3B8' }}>{s.label}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>{s.desc}</div>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, borderRadius: 1, background: completed ? '#10B981' : '#E2E8F0', margin: '0 12px', transition: 'background .15s' }}/>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* ── STEP 0: Query & Filter ── */}
          {step === 0 && (
            <Card>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>No Surprises Report — Query Filter</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Configure pharmacy filter criteria. Profile Last Updated Date is required.
                </div>
              </div>
              <CardBody style={{ padding: '18px 24px' }}>

                {/* Required: Profile Last Updated Date */}
                <div style={{ marginBottom: 18 }}>
                  <DRange label="Profile Last Updated Date" required/>
                </div>

                <div style={{ height: 1, background: '#E2E8F0', marginBottom: 18 }}/>

                {/* Row 1 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <FL>Relationship Type</FL>
                    <Sel><option>--All--</option><option>Member</option><option>Network</option><option>Preferred</option></Sel>
                  </div>
                  <div>
                    <FL>Provider Type</FL>
                    <Sel><option>--Select Provider Type--</option>{PROVIDER_TYPES.map(o => <option key={o}>{o}</option>)}</Sel>
                  </div>
                  <div>
                    <FL>Languages</FL>
                    <Sel><option>--Select--</option><option>English</option><option>Spanish</option><option>Chinese</option><option>French</option></Sel>
                  </div>
                </div>

                {/* Row 2 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 6 }}>
                  <div>
                    <FL>Group Keys</FL>
                    <Inp placeholder="Enter group key(s)"/>
                  </div>
                  <div>
                    <FL>Payment Center</FL>
                    <Sel><option>--All--</option><option>CVS CAREMARK</option><option>EXPRESS SCRIPTS</option><option>OPTUMRX</option></Sel>
                  </div>
                  <div>
                    <FL>City</FL>
                    <Inp placeholder="City"/>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1, height: 1, background: '#E2E8F0' }}/>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: '#E2E8F0' }}/>
                </div>

                {/* Row 3 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <FL>Relationship Name</FL>
                    <Sel><option>--All--</option>{RELATIONSHIPS.map(o => <option key={o}>{o}</option>)}</Sel>
                  </div>
                  <div>
                    <FL>Parent Organization</FL>
                    <Sel><option>--All--</option><option>CVS Health</option><option>Walgreens Boots Alliance</option><option>Rite Aid</option></Sel>
                  </div>
                  <div>
                    <FL>State</FL>
                    <Sel>
                      <option>--Select--</option>
                      {['Alabama','Alaska','Arizona','California','Colorado','Florida','Georgia','Illinois','Michigan','New York','Ohio','Pennsylvania','Texas','Washington'].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </Sel>
                  </div>
                </div>

                {/* Row 4 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <FL>Dispenser Class</FL>
                    <Sel><option>--All--</option>{DISP_CLASSES.map(o => <option key={o}>{o}</option>)}</Sel>
                  </div>
                  <div>
                    <FL>Services Available</FL>
                    <Sel><option>--Select Service--</option>{SERVICES.map(o => <option key={o}>{o}</option>)}</Sel>
                  </div>
                  <div>
                    <FL>ZIP</FL>
                    <Inp placeholder="ZIP Code"/>
                  </div>
                </div>

                {/* Row 5: Date ranges */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <DRange label="Open Date"/>
                  <DRange label="Close Date"/>
                  <div>
                    <FL>24/7</FL>
                    <Sel><option>--All--</option><option>Yes</option><option>No</option></Sel>
                  </div>
                </div>

                {/* Row 6 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 18 }}>
                  <div>
                    <FL>Status</FL>
                    <Sel><option>Active NCPDP IDs</option><option>Inactive NCPDP IDs</option><option>All NCPDP IDs</option></Sel>
                  </div>
                  <div>
                    <FL>Order By</FL>
                    <Sel><option>Profile Last Update Date</option><option>Pharmacy NCPDP No</option><option>Pharmacy DBA Name</option><option>State</option></Sel>
                  </div>
                  <div style={{ paddingTop: 20 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ width: 14, height: 14 }}/>
                      Include Inactive Relation
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                  <button
                    className="btn-primary"
                    onClick={handleQuery}
                    disabled={querying}
                    style={{ gap: 6, padding: '8px 28px', minWidth: 140 }}
                  >
                    {querying ? <><IconRefresh size={14} color="#fff"/> Querying...</> : <><IconSearch size={14} color="#fff"/> View Report</>}
                  </button>
                  <button className="btn-secondary" onClick={() => setQueried(false)} style={{ gap: 6, padding: '8px 24px' }}>
                    <IconRefresh size={14}/> Reset
                  </button>
                </div>

                {/* Pharmacy count result */}
                {queried && (
                  <div style={{
                    marginTop: 16, padding: '14px 18px', borderRadius: 8,
                    background: '#F0FDF4', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <IconCheck size={18} color="#10B981"/>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>38,569 pharmacies matched your filter criteria</div>
                        <div style={{ fontSize: 12, color: '#047857', marginTop: 2 }}>Q1 2026 — Jan 1 through Mar 31, 2026</div>
                      </div>
                    </div>
                    <button className="btn-primary" onClick={() => goToStep(1)} style={{ gap: 6, fontSize: 12 }}>
                      Next: Validate Data <IconChevronRight size={13} color="#fff"/>
                    </button>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* ── STEP 1: Validate Data ── */}
          {step === 1 && (
            <Card>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Data Validation — 38,569 Pharmacies</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Running automated compliance checks</div>
                </div>
                {!fixed && hasFailure && (
                  <button className="btn-primary" onClick={handleFix} disabled={fixing} style={{ gap: 6, fontSize: 12 }}>
                    {fixing ? <><IconRefresh size={12} color="#fff"/> Fixing...</> : <><IconCheck size={12} color="#fff"/> Auto-Fix All Issues</>}
                  </button>
                )}
              </div>
              <CardBody style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {checks.map(c => {
                    const cfg = statusCfg[c.status as keyof typeof statusCfg];
                    const pct = Math.round((c.pass / c.total) * 100);
                    return (
                      <div key={c.label} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                        borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`,
                      }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {c.status === 'pass'
                            ? <IconCheck size={13} color={cfg.color}/>
                            : <IconAlertTriangle size={13} color={cfg.color}/>
                          }
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{c.label}</div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>{c.detail}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{pct}%</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{c.pass.toLocaleString()} / {c.total.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'space-between' }}>
                  <button className="btn-secondary" onClick={() => goToStep(0)} style={{ gap: 6, fontSize: 12 }}>Back</button>
                  <button
                    className="btn-primary"
                    onClick={() => goToStep(2)}
                    disabled={!fixed && hasFailure}
                    style={{ gap: 6, fontSize: 12, opacity: (!fixed && hasFailure) ? 0.5 : 1 }}
                  >
                    Next: Review Report <IconChevronRight size={13} color="#fff"/>
                  </button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* ── STEP 2: Review Report ── */}
          {step === 2 && (
            <Card>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Report Preview — Q1 2026</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Review before submitting to CMS</div>
              </div>
              <CardBody style={{ padding: '20px 24px' }}>
                {/* Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 18 }}>
                  {[
                    { label: 'Pharmacies in Report', value: '38,569',  color: '#2968B0' },
                    { label: 'Reporting Period',      value: 'Q1 2026', color: 'var(--text-primary)' },
                    { label: 'Validation Status',     value: 'Passed',  color: '#10B981' },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '14px 16px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Pharmacy type breakdown */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', marginBottom: 10 }}>Pharmacy Type Breakdown</div>
                  {[
                    { type: 'Community / Retail',   count: 21340, pct: 55 },
                    { type: 'Specialty',             count: 9214,  pct: 24 },
                    { type: 'Mail Service',          count: 3857,  pct: 10 },
                    { type: 'Compounding',           count: 2314,  pct: 6  },
                    { type: 'Long-Term Care',        count: 1844,  pct: 5  },
                  ].map(r => (
                    <div key={r.type} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 7 }}>
                      <div style={{ fontSize: 12, color: '#475569', width: 160, flexShrink: 0 }}>{r.type}</div>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#E2E8F0', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${r.pct}%`, background: '#2968B0', borderRadius: 3 }}/>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#2968B0', width: 60, textAlign: 'right' }}>
                        {r.count.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'space-between' }}>
                  <button className="btn-secondary" onClick={() => goToStep(1)} style={{ gap: 6, fontSize: 12 }}>Back</button>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" style={{ gap: 6, fontSize: 12 }}><IconDownload size={12}/> Download Preview</button>
                    <button className="btn-primary" onClick={() => goToStep(3)} style={{ gap: 6, fontSize: 12 }}>
                      Next: Submit to CMS <IconChevronRight size={13} color="#fff"/>
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* ── STEP 3: Submit ── */}
          {step === 3 && (
            <Card>
              <CardBody style={{ padding: '32px 24px', textAlign: 'center' }}>
                {!submitted ? (
                  <>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Ready to Submit to CMS</div>
                    <div style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
                      You are about to electronically file the Q1 2026 No Surprises Act report<br/>
                      for <strong>38,569 pharmacies</strong> to the Centers for Medicare & Medicaid Services.
                    </div>
                    <div style={{
                      padding: '14px 20px', borderRadius: 8, background: '#FEF9C3', border: '1px solid #FDE047',
                      marginBottom: 24, textAlign: 'left', fontSize: 12, color: '#713F12',
                    }}>
                      <strong>Deadline:</strong> March 31, 2026 — Today is the deadline. Submit immediately to avoid late filing penalties.
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                      <button className="btn-secondary" onClick={() => goToStep(2)} style={{ fontSize: 12 }}>Back</button>
                      <button className="btn-primary" onClick={handleSubmit} style={{ gap: 6, fontSize: 13, padding: '8px 28px' }}>
                        <IconCheck size={14} color="#fff"/> Submit to CMS Now
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%', background: '#D1FAE5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                    }}>
                      <IconCheck size={28} color="#10B981"/>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#065F46', marginBottom: 8 }}>
                      Successfully Submitted to CMS
                    </div>
                    <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
                      Your Q1 2026 No Surprises Act report has been filed electronically.
                    </div>
                    <div style={{
                      display: 'inline-block', padding: '10px 20px', borderRadius: 8,
                      background: '#F0FDF4', border: '1px solid #A7F3D0', marginBottom: 20,
                    }}>
                      <div style={{ fontSize: 12, color: '#047857', fontWeight: 600, marginBottom: 2 }}>CMS Confirmation ID</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#065F46' }}>CMS-NSA-Q12026-1104</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button className="btn-secondary" style={{ gap: 5, fontSize: 12 }}><IconDownload size={12}/> Download Receipt</button>
                      <button className="btn-secondary" onClick={() => { setStep(0); setQueried(false); setFixed(false); setSubmitted(false); setQuerying(false); setFixing(false); }} style={{ fontSize: 12 }}>New Submission</button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Deadline card */}
          <Card>
            <CardBody style={{ padding: '16px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 10 }}>Filing Deadline</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#DC2626' }}>Today</div>
              <div style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>Q1 2026 — Due Mar 31, 2026</div>
              <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', fontSize: 12, color: '#B91C1C' }}>
                File before 11:59 PM ET to avoid late filing penalties.
              </div>
            </CardBody>
          </Card>

          {/* Past submissions */}
          <Card>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>Past Submissions</div>
            </div>
            <CardBody style={{ padding: '10px 14px' }}>
              {PAST.map(r => (
                <div key={r.cms} style={{ padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{r.period}</span>
                    <Badge variant="success">Accepted</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{r.count} pharmacies · {r.submitted}</div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#94A3B8', marginTop: 2 }}>{r.cms}</div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Agent */}
          <Card>
            <CardBody style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2968B0,#5B9BD5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconSearch size={13} color="#fff"/>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>No Surprises Assistant</div>
                  <div style={{ fontSize: 12, color: '#10B981' }}>AGT-08 · Active</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
                AI-powered assistance for your NSA filing. Ask questions or get help with data validation.
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, marginTop: 10, gap: 5 }}>
                Launch Agent
              </button>
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}
