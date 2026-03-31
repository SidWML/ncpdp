'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { IconCheck, IconCopy, IconRefresh, IconPlus, IconUsers, IconKey, IconDatabase, IconBell, IconLock, IconUser } from '@/components/ui/Icons';

type Section = 'profile' | 'team' | 'notifications' | 'security' | 'apikeys' | 'usage' | 'billing';

const navItems: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: 'profile',       label: 'Profile',        icon: IconUser      },
  { key: 'team',          label: 'Team',            icon: IconUsers     },
  { key: 'notifications', label: 'Notifications',   icon: IconBell      },
  { key: 'security',      label: 'Security',        icon: IconLock      },
  { key: 'apikeys',       label: 'API Keys',        icon: IconKey       },
  { key: 'usage',         label: 'Usage',           icon: IconDatabase  },
  { key: 'billing',       label: 'Billing',         icon: IconDatabase  },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 42, height: 24, borderRadius: 9999, border: 'none', cursor: 'pointer', flexShrink: 0,
        background: on ? 'var(--brand-600)' : 'var(--border)', position: 'relative', transition: 'background .2s',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff',
        left: on ? 21 : 3, transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }}/>
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14, marginTop: 24, paddingBottom: 8, borderBottom: '1px solid var(--border-light)' }}>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</label>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [section, setSection]   = useState<Section>('profile');
  const [notifs, setNotifs]     = useState([true, true, true, true, true]);
  const [copied, setCopied]     = useState<string|null>(null);

  function toggleNotif(i: number) {
    setNotifs(prev => prev.map((v, idx) => idx === i ? !v : v));
  }

  function copy(id: string) {
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  const weeklyUsage = [165, 182, 198, 211, 224, 142, 118];
  const weekDays    = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxUsage    = Math.max(...weeklyUsage);

  return (
    <>
      <Topbar title="Settings & Preferences" subtitle="Manage your profile, team, notifications, and API access"/>
      <main style={{ padding: '16px 20px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>

          {/* ── Left nav ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navItems.map(({ key, label, icon: Icon }) => {
              const active = section === key;
              return (
                <button
                  key={key}
                  onClick={() => setSection(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    textAlign: 'left', padding: '9px 12px', borderRadius: 10,
                    background: active ? 'var(--brand-50)' : 'transparent',
                    color: active ? 'var(--brand-600)' : 'var(--text-secondary)',
                    fontWeight: active ? 600 : 500, fontSize: 13,
                    border: active ? '1px solid var(--brand-200)' : '1px solid transparent',
                    cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  <Icon size={14} color={active ? 'var(--brand-600)' : 'var(--text-muted)'}/>
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── Content ── */}
          <div>

            {/* ─── PROFILE ─── */}
            {section === 'profile' && (
              <Card>
                <CardBody style={{ padding: '24px 28px' }}>
                  {/* Avatar row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: 72, height: 72, borderRadius: 18, background: 'linear-gradient(135deg,#4F46E5,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff' }}>SC</div>
                      <button style={{ position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: '50%', background: 'var(--brand-600)', border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>+</span>
                      </button>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Sarah Chen</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>Director of Pharmacy Network Management</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <Badge variant="brand">Enterprise</Badge>
                        <Badge variant="success">Admin</Badge>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Subscriber ID</div>
                      <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-primary)' }}>ORG-28471</div>
                    </div>
                  </div>

                  <SectionTitle>Account Information</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Field label="First Name"><input className="input-base" defaultValue="Sarah" style={{ height: 38 }}/></Field>
                    <Field label="Last Name"><input className="input-base" defaultValue="Chen" style={{ height: 38 }}/></Field>
                    <Field label="Job Title"><input className="input-base" defaultValue="Director of Pharmacy Network Management" style={{ height: 38 }}/></Field>
                    <Field label="Organization">
                      <input className="input-base" defaultValue="National Health Partners PBM" disabled style={{ height: 38, opacity: .6, cursor: 'not-allowed' }}/>
                    </Field>
                    <Field label="Email"><input className="input-base" defaultValue="sarah.chen@nhp-pbm.com" style={{ height: 38 }}/></Field>
                    <Field label="Phone"><input className="input-base" defaultValue="(703) 555-4821" style={{ height: 38 }}/></Field>
                    <Field label="City"><input className="input-base" defaultValue="Arlington" style={{ height: 38 }}/></Field>
                    <Field label="State"><input className="input-base" defaultValue="Virginia" style={{ height: 38 }}/></Field>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                    <button className="btn-primary" style={{ fontSize: 13 }}>Save Changes</button>
                    <button className="btn-secondary" style={{ fontSize: 13 }}>Cancel</button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* ─── TEAM ─── */}
            {section === 'team' && (
              <Card>
                <CardBody style={{ padding: '24px 28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Team Members</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Manage who has access to your dataQ.ai organization</div>
                    </div>
                    <button className="btn-primary" style={{ gap: 5, fontSize: 12 }}>
                      <IconPlus size={13} color="#fff"/> Invite Member
                    </button>
                  </div>

                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Last Active</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { initials: 'SC', name: 'Sarah Chen',     email: 'sarah.chen@nhp-pbm.com',  role: 'Admin',    roleBadge: 'brand'   as const, last: 'Active now',  you: true  },
                        { initials: 'MT', name: 'Michael Torres', email: 'm.torres@nhp-pbm.com',    role: 'Member',   roleBadge: 'neutral' as const, last: '2 hours ago', you: false },
                        { initials: 'PP', name: 'Priya Patel',    email: 'p.patel@nhp-pbm.com',     role: 'Member',   roleBadge: 'neutral' as const, last: '1 day ago',   you: false },
                        { initials: 'DK', name: 'David Kim',      email: 'd.kim@nhp-pbm.com',       role: 'API Only', roleBadge: 'info'    as const, last: '3 days ago',  you: false },
                      ].map(m => (
                        <tr key={m.email}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#4F46E5,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{m.initials}</div>
                              <span style={{ fontWeight: 600 }}>{m.name}{m.you && <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 5 }}>(You)</span>}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{m.email}</td>
                          <td><Badge variant={m.roleBadge}>{m.role}</Badge></td>
                          <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{m.last}</td>
                          <td>
                            {!m.you && (
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button className="btn-ghost" style={{ fontSize: 11 }}>Edit</button>
                                <button className="btn-ghost" style={{ fontSize: 11, color: '#DC2626' }}>Remove</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                      <span>4 of 10 seats used (Enterprise)</span>
                      <span>40%</span>
                    </div>
                    <Progress value={40} color="var(--brand-600)" height={5}/>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* ─── NOTIFICATIONS ─── */}
            {section === 'notifications' && (
              <Card>
                <CardBody style={{ padding: '24px 28px' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Notification Preferences</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>Control which alerts you receive and how they're delivered</div>

                  <SectionTitle>Alert Categories</SectionTitle>
                  {[
                    { label: 'Critical Alerts',         desc: 'DEA expirations, pharmacy closures, network failures', delivery: ['Email', 'In-app'] },
                    { label: 'Warning Alerts',           desc: 'Credentials expiring, ownership changes',             delivery: ['Email', 'In-app'] },
                    { label: 'Informational Alerts',     desc: 'New openings, service updates, weekly summaries',     delivery: ['In-app']          },
                    { label: 'Weekly Network Summary',   desc: 'Every Monday 9:00 AM — full network digest',         delivery: ['Email']           },
                    { label: 'FWA Deadline Reminders',   desc: '90, 30, and 7 days before attestation deadline',     delivery: ['Email']           },
                  ].map((n, i) => (
                    <div key={n.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < 4 ? '1px solid var(--border-light)' : 'none' }}>
                      <Toggle on={notifs[i]} onChange={() => toggleNotif(i)}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{n.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{n.desc}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {n.delivery.map(d => (
                          <span key={d} style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 9999, background: notifs[i] ? '#EEF2FF' : 'var(--surface-2)', color: notifs[i] ? '#4F46E5' : 'var(--text-muted)', border: `1px solid ${notifs[i] ? '#C7D2FE' : 'var(--border)'}` }}>{d}</span>
                        ))}
                      </div>
                    </div>
                  ))}

                  <SectionTitle>Delivery Preferences</SectionTitle>
                  {[
                    { label: 'Daily Digest',  value: 'On · 8:00 AM ET' },
                    { label: 'Email Alerts',  value: 'Enabled' },
                    { label: 'Slack',         value: 'Connected · #pharmacy-ops' },
                  ].map(d => (
                    <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{d.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981' }}>{d.value}</span>
                    </div>
                  ))}
                </CardBody>
              </Card>
            )}

            {/* ─── SECURITY ─── */}
            {section === 'security' && (
              <Card>
                <CardBody style={{ padding: '24px 28px' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Security Settings</div>

                  <SectionTitle>Authentication</SectionTitle>
                  <div style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--surface-2)', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>SSO (SAML) via Okta</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>nhp-pbm.okta.com · Managed by IT</div>
                      </div>
                      <Badge variant="success" dot>Connected</Badge>
                    </div>
                    <button className="btn-secondary" style={{ fontSize: 12, marginTop: 12 }}>Manage SSO Settings</button>
                  </div>

                  <SectionTitle>Multi-Factor Authentication</SectionTitle>
                  <div style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--surface-2)', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Authenticator App</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Google Authenticator · Enrolled Jan 15, 2024</div>
                      </div>
                      <Badge variant="success" dot>Enabled</Badge>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-secondary" style={{ fontSize: 12 }}>Manage MFA</button>
                      <button className="btn-ghost" style={{ fontSize: 12 }}>View Backup Codes</button>
                    </div>
                  </div>

                  <SectionTitle>Active Sessions</SectionTitle>
                  <div style={{ padding: '14px 18px', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--surface-2)', marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Arlington, VA · Chrome · Mar 31, 2026</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>MacBook Pro · IP: 192.168.1.42</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', background: '#D1FAE5', padding: '2px 9px', borderRadius: 9999, border: '1px solid #A7F3D0' }}>This device</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" style={{ fontSize: 12 }}>View All Sessions</button>
                    <button className="btn-ghost" style={{ fontSize: 12, color: '#DC2626' }}>Force Sign Out All</button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* ─── API KEYS ─── */}
            {section === 'apikeys' && (
              <Card>
                <CardBody style={{ padding: '24px 28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>API Keys</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Manage authentication credentials for the dataQ.ai API</div>
                    </div>
                    <button className="btn-primary" style={{ gap: 5, fontSize: 12 }}>
                      <IconPlus size={13} color="#fff"/> Generate New Key
                    </button>
                  </div>

                  {[
                    { name: 'Production API Key', key: 'dq_prod_sk_••••••••••••••••7x9m', created: 'Jan 15, 2026', used: '2 hours ago', calls: '1,241,847', id: 'prod' },
                    { name: 'Sandbox / Testing',  key: 'dq_test_sk_••••••••••••••••3k2p', created: 'Jan 15, 2026', used: '5 days ago',  calls: '48,291',    id: 'test' },
                  ].map(k => (
                    <div key={k.id} style={{ padding: '18px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface-2)', marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 9, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconKey size={14} color="#10B981"/>
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{k.name}</span>
                        </div>
                        <Badge variant="success" dot>Active</Badge>
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--surface-3)', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{k.key}</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => copy(k.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                            {copied === k.id ? <><IconCheck size={11} color="#10B981"/> Copied</> : <><IconCopy size={11}/> Copy</>}
                          </button>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                            <IconRefresh size={11}/> Rotate
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 20, fontSize: 11.5, color: 'var(--text-muted)' }}>
                        <span>Created: <strong style={{ color: 'var(--text-secondary)' }}>{k.created}</strong></span>
                        <span>Last used: <strong style={{ color: 'var(--text-secondary)' }}>{k.used}</strong></span>
                        <span>Total calls: <strong style={{ color: 'var(--text-secondary)' }}>{k.calls}</strong></span>
                      </div>
                    </div>
                  ))}

                  <SectionTitle>Rate Limits by Plan</SectionTitle>
                  <table className="data-table">
                    <thead>
                      <tr><th>Plan</th><th>Calls / Month</th><th>Calls / Hour</th><th>GraphQL</th></tr>
                    </thead>
                    <tbody>
                      {[
                        { plan: 'Essential',    monthly: '10,000',    hourly: '100',       gql: false, current: false },
                        { plan: 'Professional', monthly: '100,000',   hourly: '1,000',     gql: true,  current: false },
                        { plan: 'Enterprise',   monthly: 'Unlimited', hourly: 'Unlimited', gql: true,  current: true  },
                      ].map(r => (
                        <tr key={r.plan} style={{ background: r.current ? '#EEF2FF' : undefined }}>
                          <td>
                            <span style={{ fontWeight: r.current ? 700 : 500 }}>{r.plan}</span>
                            {r.current && <span style={{ marginLeft: 8 }}><Badge variant="brand">Current</Badge></span>}
                          </td>
                          <td style={{ fontWeight: r.current ? 700 : 400 }}>{r.monthly}</td>
                          <td style={{ fontWeight: r.current ? 700 : 400 }}>{r.hourly}</td>
                          <td>{r.gql ? <IconCheck size={14} color="#10B981"/> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            )}

            {/* ─── USAGE ─── */}
            {section === 'usage' && (
              <Card>
                <CardBody style={{ padding: '24px 28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Usage & Quotas</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Billing period: Mar 1 – Mar 31, 2026</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-secondary" style={{ fontSize: 12 }}>View Full Report</button>
                      <button className="btn-ghost" style={{ fontSize: 12 }}>Download Invoice</button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
                    {[
                      { label: 'API Calls',         value: '1,241,847', sub: 'Unlimited (Enterprise)',  bar: 72,  color: '#4F46E5' },
                      { label: 'Agent Queries',      value: '482',       sub: 'Unlimited in Enterprise', bar: 0,   color: '#10B981' },
                      { label: 'Reports Generated',  value: '38',        sub: 'Unlimited in Enterprise', bar: 0,   color: '#06B6D4' },
                      { label: 'Data Exports',       value: '14',        sub: 'Unlimited in Enterprise', bar: 0,   color: '#8B5CF6' },
                    ].map(u => (
                      <div key={u.label} style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--surface-2)' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>{u.label}</div>
                        <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{u.value}</div>
                        <div style={{ fontSize: 11.5, color: '#10B981', fontWeight: 500, marginBottom: u.bar > 0 ? 10 : 0 }}>{u.sub}</div>
                        {u.bar > 0 && <Progress value={u.bar} color={u.color} height={5}/>}
                      </div>
                    ))}
                  </div>

                  <SectionTitle>API Calls — Last 7 Days</SectionTitle>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100, padding: '0 4px' }}>
                    {weeklyUsage.map((v, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 600 }}>{(v/1000).toFixed(0)}k</div>
                        <div style={{ width: '100%', borderRadius: '5px 5px 0 0', background: weekDays[i] === 'Fri' ? '#4F46E5' : '#C7D2FE', height: `${(v/maxUsage)*80}px`, minHeight: 4 }}/>
                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{weekDays[i]}</div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* ─── BILLING ─── */}
            {section === 'billing' && (
              <Card>
                <CardBody style={{ padding: '24px 28px' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Billing & Subscription</div>

                  <div style={{ background: 'linear-gradient(135deg, #0F1A3E, #1B2B6B)', borderRadius: 14, padding: '22px 24px', marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Current Plan</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Enterprise Tier</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginTop: 4 }}>$150,000 / year · Next billing: January 1, 2027</div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                          {['33 Agents', 'Real-time data', '99.9% SLA', 'Unlimited API', 'Priority Support'].map(f => (
                            <span key={f} style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(255,255,255,.6)', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', padding: '3px 9px', borderRadius: 9999 }}>{f}</span>
                          ))}
                        </div>
                      </div>
                      <Badge variant="success" dot>Active</Badge>
                    </div>
                  </div>

                  <SectionTitle>Invoice History</SectionTitle>
                  <table className="data-table">
                    <thead>
                      <tr><th>Period</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {[
                        { period: 'Jan 1, 2026 — Dec 31, 2026', amount: '$150,000', status: 'Active' },
                        { period: 'Jan 1, 2025 — Dec 31, 2025', amount: '$140,000', status: 'Paid'   },
                        { period: 'Jan 1, 2024 — Dec 31, 2024', amount: '$120,000', status: 'Paid'   },
                      ].map(inv => (
                        <tr key={inv.period}>
                          <td style={{ fontWeight: 500 }}>{inv.period}</td>
                          <td style={{ fontWeight: 700 }}>{inv.amount}</td>
                          <td><Badge variant={inv.status === 'Active' ? 'brand' : 'success'}>{inv.status}</Badge></td>
                          <td><button className="btn-ghost" style={{ fontSize: 11.5 }}>Download PDF</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: 24, padding: '16px 18px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Need to modify your plan?</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Talk to your account executive to adjust seats, features, or pricing.</div>
                    </div>
                    <button className="btn-secondary" style={{ fontSize: 12 }}>Talk to Sales</button>
                  </div>
                </CardBody>
              </Card>
            )}

          </div>
        </div>
      </main>
    </>
  );
}
