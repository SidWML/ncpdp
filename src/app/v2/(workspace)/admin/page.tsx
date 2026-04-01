'use client';
import React, { useState } from 'react';
import { TopbarV2 } from '@/components/v2/TopbarV2';
import {
  IconUser, IconUsers, IconBell, IconKey, IconCode, IconDatabase,
  IconCopy, IconCheck, IconDownload, IconShield, IconSettings,
} from '@/components/ui/Icons';

/*  Section Nav  */
const SECTIONS = [
  { key: 'profile',       label: 'Profile',       icon: IconUser },
  { key: 'team',          label: 'Team',           icon: IconUsers },
  { key: 'api',           label: 'API & Data',     icon: IconKey },
  { key: 'notifications', label: 'Notifications',  icon: IconBell },
  { key: 'security',      label: 'Security',       icon: IconShield },
  { key: 'billing',       label: 'Billing',        icon: IconSettings },
] as const;
type Section = typeof SECTIONS[number]['key'];

/*  Team Data  */
const TEAM = [
  { name: 'Sarah Chen',      email: 'sarah.chen@dataq.ai',      role: 'Admin',   lastActive: '2 min ago',  status: 'active' },
  { name: 'Marcus Rivera',   email: 'marcus.r@dataq.ai',        role: 'Editor',  lastActive: '18 min ago', status: 'active' },
  { name: 'Priya Sharma',    email: 'priya.sharma@dataq.ai',    role: 'Viewer',  lastActive: '1 hr ago',   status: 'active' },
  { name: 'James Okafor',    email: 'james.o@dataq.ai',         role: 'Editor',  lastActive: 'Yesterday',  status: 'active' },
  { name: 'Emily Nakamura',  email: 'emily.n@dataq.ai',         role: 'Viewer',  lastActive: '3 days ago', status: 'inactive' },
];

/*  API Endpoints  */
const ENDPOINTS = [
  { method: 'GET',  path: '/v1/pharmacies/{ncpdp}',        desc: 'Retrieve pharmacy by NCPDP ID' },
  { method: 'GET',  path: '/v1/pharmacies/search',         desc: 'Search pharmacies with filters' },
  { method: 'POST', path: '/v1/pharmacies/batch',          desc: 'Batch lookup up to 500 IDs' },
  { method: 'GET',  path: '/v1/compliance/credentials',    desc: 'DEA, license, accreditation status' },
  { method: 'POST', path: '/v1/reports/generate',          desc: 'Generate compliance or network report' },
  { method: 'GET',  path: '/v1/network/changes',           desc: 'Recent pharmacy network changes' },
];

/*  Rate Limits  */
const RATE_LIMITS = [
  { tier: 'Standard',   rps: '100',   daily: '500K',  burst: '200' },
  { tier: 'Professional', rps: '500', daily: '2M',    burst: '1,000' },
  { tier: 'Enterprise', rps: '2,000', daily: '10M',   burst: '5,000' },
];

/*  Code Examples  */
const CODE_EXAMPLES: Record<string, string> = {
  curl: `curl -X GET "https://api.dataq.ai/v1/pharmacies/1234567" \\
  -H "Authorization: Bearer dq_prod_sk_...abc123" \\
  -H "Content-Type: application/json"`,
  python: `import requests

resp = requests.get(
    "https://api.dataq.ai/v1/pharmacies/1234567",
    headers={"Authorization": "Bearer dq_prod_sk_...abc123"}
)
pharmacy = resp.json()
print(pharmacy["name"], pharmacy["status"])`,
  javascript: `const res = await fetch(
  "https://api.dataq.ai/v1/pharmacies/1234567",
  {
    headers: {
      "Authorization": "Bearer dq_prod_sk_...abc123",
      "Content-Type": "application/json",
    },
  }
);
const pharmacy = await res.json();
console.log(pharmacy.name, pharmacy.status);`,
};

/*  Feeds  */
const FEEDS = [
  { name: 'SFTP',     status: 'Connected', statusColor: 'var(--v2-green)', bg: 'var(--v2-green-bg)', desc: 'Daily flat-file delivery at 02:00 UTC', icon: IconDatabase },
  { name: 'REST API', status: 'Active',    statusColor: 'var(--v2-green)', bg: 'var(--v2-green-bg)', desc: 'Real-time access — 2,000 req/s',         icon: IconCode },
  { name: 'GraphQL',  status: 'Beta',      statusColor: 'var(--v2-amber)', bg: 'var(--v2-amber-bg)', desc: 'Flexible queries — schema explorer',     icon: IconKey },
  { name: 'Webhooks', status: 'Configured',statusColor: 'var(--v2-green)', bg: 'var(--v2-green-bg)', desc: '4 active hooks — 99.8% delivery rate',   icon: IconBell },
];

/*  Invoices  */
const INVOICES = [
  { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: '$12,500.00', status: 'Paid' },
  { id: 'INV-2026-002', date: 'Feb 1, 2026', amount: '$12,500.00', status: 'Paid' },
  { id: 'INV-2026-001', date: 'Jan 1, 2026', amount: '$12,500.00', status: 'Paid' },
  { id: 'INV-2025-012', date: 'Dec 1, 2025', amount: '$11,000.00', status: 'Paid' },
  { id: 'INV-2025-011', date: 'Nov 1, 2025', amount: '$11,000.00', status: 'Paid' },
];

/*  Notification Prefs  */
const NOTIF_PREFS = [
  { key: 'email_alerts',     label: 'Email Alerts',           desc: 'Receive daily digest of account activity',      channels: ['Email'] },
  { key: 'slack_notifs',     label: 'Slack Notifications',    desc: 'Push critical alerts to Slack channel',         channels: ['Slack'] },
  { key: 'dea_expirations',  label: 'DEA Expirations',        desc: 'Alert 90/60/30 days before expiration',         channels: ['Email', 'Slack'] },
  { key: 'license_renewals', label: 'License Renewals',       desc: 'Notify when state licenses need renewal',       channels: ['Email', 'SMS'] },
  { key: 'network_changes',  label: 'Network Changes',        desc: 'Ownership, closure, and status changes',        channels: ['Email', 'Slack'] },
  { key: 'fwa_deadlines',    label: 'FWA Deadlines',          desc: 'Fraud, waste, abuse attestation reminders',     channels: ['Email', 'Slack', 'SMS'] },
  { key: 'api_threshold',    label: 'API Threshold Alerts',   desc: 'Notify when API usage exceeds 80% of quota',   channels: ['Email', 'Slack'] },
];

/*  Plan Comparison  */
const PLANS = [
  { name: 'Starter',      price: '$2,500/mo',  api: '500K calls',  users: '3',  support: 'Email',     sla: '99.5%' },
  { name: 'Professional', price: '$6,500/mo',  api: '2M calls',    users: '10', support: 'Priority',  sla: '99.9%' },
  { name: 'Enterprise',   price: '$12,500/mo', api: '10M calls',   users: '25', support: 'Dedicated', sla: '99.99%' },
];

/*  Audit Log  */
const AUDIT_LOG = [
  { time: 'Today, 09:14 AM',      user: 'Sarah Chen',     action: 'Rotated Production API Key',     ip: '192.168.1.42' },
  { time: 'Today, 08:30 AM',      user: 'Marcus Rivera',  action: 'Exported compliance report',      ip: '10.0.0.15' },
  { time: 'Yesterday, 04:22 PM',  user: 'Priya Sharma',   action: 'Updated notification settings',   ip: '172.16.0.8' },
  { time: 'Yesterday, 11:05 AM',  user: 'Sarah Chen',     action: 'Invited james.o@dataq.ai',        ip: '192.168.1.42' },
  { time: 'Mar 28, 02:00 AM',     user: 'System',         action: 'Automated SFTP delivery completed',ip: '—' },
];

/* ═══════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [section, setSection] = useState<Section>('profile');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showProdKey, setShowProdKey] = useState(false);
  const [showSandboxKey, setShowSandboxKey] = useState(false);
  const [codeLang, setCodeLang] = useState<'curl' | 'python' | 'javascript'>('curl');
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    email_alerts: true, slack_notifs: true, dea_expirations: true,
    license_renewals: true, network_changes: false, fwa_deadlines: true, api_threshold: true,
  });

  const prodKey = 'dq_prod_sk_8f2a9c4b7e1d3f6a0b5c8e2d4f7a1b3c';
  const sandboxKey = 'dq_sbox_sk_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d';

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  /*  Shared styles  */
  const card: React.CSSProperties = { padding: '20px 24px' };
  const sectionTitle: React.CSSProperties = { fontSize: 16, fontWeight: 600, color: 'var(--v2-text)', letterSpacing: '-.02em', marginBottom: 16 };
  const fieldLabel: React.CSSProperties = { fontSize: 11.5, fontWeight: 500, color: 'var(--v2-text-3)', marginBottom: 5, display: 'block' };
  const methodBadge = (m: string): React.CSSProperties => ({
    fontSize: 10, fontWeight: 700, fontFamily: 'ui-monospace, monospace', padding: '2px 6px',
    borderRadius: 4, display: 'inline-block', minWidth: 36, textAlign: 'center',
    background: m === 'GET' ? 'var(--v2-green-bg)' : 'var(--v2-primary-bg)',
    color: m === 'GET' ? 'var(--v2-green)' : 'var(--v2-primary)',
  });
  const toggleSwitch = (on: boolean): React.CSSProperties => ({
    width: 36, height: 20, borderRadius: 10, background: on ? 'var(--v2-primary)' : 'var(--v2-surface-3)',
    position: 'relative', cursor: 'pointer', transition: 'background .15s', flexShrink: 0, border: 'none',
  });
  const toggleKnob = (on: boolean): React.CSSProperties => ({
    position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: 8,
    background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.15)', transition: 'left .15s',
  });

  /* ═══ Section renderers ═══ */

  const renderProfile = () => (
    <div>
      <div style={sectionTitle}>Profile Settings</div>

      {/* Avatar */}
      <div className="v2c" style={{ ...card, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>SC</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--v2-text)' }}>Sarah Chen</div>
          <div style={{ fontSize: 12, color: 'var(--v2-text-3)', marginTop: 2 }}>Admin &middot; NCPDP Enterprise</div>
        </div>
        <button className="v2b v2b-s" style={{ fontSize: 12 }}>Change Photo</button>
      </div>

      {/* Form */}
      <div className="v2c" style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
          {[
            { label: 'First Name', value: 'Sarah' },
            { label: 'Last Name',  value: 'Chen' },
            { label: 'Email',      value: 'sarah.chen@dataq.ai' },
            { label: 'Role',       value: 'Admin' },
            { label: 'Company',    value: 'NCPDP' },
            { label: 'Phone',      value: '+1 (480) 555-0142' },
            { label: 'Timezone',   value: 'America/Phoenix (MST)' },
            { label: 'Language',   value: 'English (US)' },
          ].map(f => (
            <div key={f.label}>
              <label style={fieldLabel}>{f.label}</label>
              <input className="v2i" defaultValue={f.value} style={{ fontSize: 13 }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="v2b v2b-p" style={{ fontSize: 13 }}>Save Changes</button>
        </div>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={sectionTitle}>Team Management</div>
        <button className="v2b v2b-p" style={{ fontSize: 12 }}><IconUsers size={13} color="#fff" /> Invite Member</button>
      </div>

      {/* Seat usage */}
      <div className="v2c" style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--v2-text)' }}>Seat Usage</span>
          <span style={{ fontSize: 12, color: 'var(--v2-text-3)' }}>8 of 15 seats used</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--v2-surface-2)', overflow: 'hidden' }}>
          <div style={{ width: '53.3%', height: '100%', borderRadius: 3, background: 'var(--v2-primary)' }} />
        </div>
      </div>

      {/* Table */}
      <div className="v2-tw">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--v2-border)' }}>
              {['NAME', 'EMAIL', 'ROLE', 'LAST ACTIVE', 'STATUS'].map(h => (
                <th key={h} style={{ padding: '10px 16px', fontSize: 10.5, fontWeight: 600, color: 'var(--v2-text-3)', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TEAM.map(m => (
              <tr key={m.email} style={{ borderBottom: '1px solid var(--v2-border-lt)' }}>
                <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 500, color: 'var(--v2-text)' }}>{m.name}</td>
                <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--v2-text-2)' }}>{m.email}</td>
                <td style={{ padding: '10px 16px' }}><span className={`v2g ${m.role === 'Admin' ? 'v2g-p' : 'v2g-n'}`}>{m.role}</span></td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--v2-text-3)' }}>{m.lastActive}</td>
                <td style={{ padding: '10px 16px' }}>
                  <span className={`v2g ${m.status === 'active' ? 'v2g-ok' : 'v2g-n'}`}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.status === 'active' ? 'var(--v2-green)' : 'var(--v2-text-3)', display: 'inline-block' }} />
                    {m.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderApi = () => (
    <div>
      <div style={sectionTitle}>API & Data Management</div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Calls Today', value: '1.24M', sub: '+18% vs yesterday', color: 'var(--v2-primary)' },
          { label: 'Avg Latency', value: '182ms', sub: 'p99: 340ms', color: 'var(--v2-green)' },
          { label: 'Success Rate', value: '99.94%', sub: '0.06% error rate', color: 'var(--v2-green)' },
          { label: 'Quota Used', value: '67%', sub: '6.7M of 10M', color: 'var(--v2-amber)' },
        ].map(s => (
          <div key={s.label} className="v2c" style={{ padding: '16px 20px' }}>
            <div className="v2-label">{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, letterSpacing: '-.5px', margin: '4px 0 2px' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--v2-text-3)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* API Keys */}
      <div className="v2c" style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 14 }}>API Keys</div>
        {[
          { id: 'prod', label: 'Production', key: prodKey, show: showProdKey, toggle: () => setShowProdKey(!showProdKey), prefix: 'dq_prod_sk_' },
          { id: 'sandbox', label: 'Sandbox', key: sandboxKey, show: showSandboxKey, toggle: () => setShowSandboxKey(!showSandboxKey), prefix: 'dq_sbox_sk_' },
        ].map(k => (
          <div key={k.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: k.id === 'prod' ? '1px solid var(--v2-border-lt)' : 'none' }}>
            <div style={{ width: 90 }}>
              <span className={`v2g ${k.id === 'prod' ? 'v2g-ok' : 'v2g-w'}`}>{k.label}</span>
            </div>
            <div style={{
              flex: 1, fontFamily: 'ui-monospace, monospace', fontSize: 12, padding: '6px 10px',
              background: 'var(--v2-surface-2)', borderRadius: 6, color: 'var(--v2-text-2)',
              letterSpacing: '.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {k.show ? k.key : `${k.prefix}${'*'.repeat(24)}`}
            </div>
            <button className="v2b v2b-g" onClick={k.toggle} style={{ fontSize: 11, padding: '4px 8px' }}>
              {k.show ? 'Hide' : 'Show'}
            </button>
            <button className="v2b v2b-g" onClick={() => copyKey(k.key, k.id)} style={{ fontSize: 11, padding: '4px 8px' }}>
              {copiedKey === k.id ? <><IconCheck size={12} color="var(--v2-green)" /> Copied</> : <><IconCopy size={12} /> Copy</>}
            </button>
          </div>
        ))}
      </div>

      {/* Rate Limits */}
      <div className="v2c" style={{ marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px 0', fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>Rate Limits</div>
        <div style={{ padding: '12px 24px 16px' }}>
          <div className="v2-tw">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--v2-border)' }}>
                  {['TIER', 'REQUESTS/SEC', 'DAILY LIMIT', 'BURST'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 10.5, fontWeight: 600, color: 'var(--v2-text-3)', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RATE_LIMITS.map(r => (
                  <tr key={r.tier} style={{ borderBottom: '1px solid var(--v2-border-lt)', background: r.tier === 'Enterprise' ? 'var(--v2-primary-bg)' : 'transparent' }}>
                    <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: r.tier === 'Enterprise' ? 600 : 400, color: 'var(--v2-text)' }}>
                      {r.tier} {r.tier === 'Enterprise' && <span className="v2g v2g-p" style={{ marginLeft: 6 }}>Current</span>}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 12.5, fontFamily: 'ui-monospace, monospace', color: 'var(--v2-text-2)' }}>{r.rps}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12.5, fontFamily: 'ui-monospace, monospace', color: 'var(--v2-text-2)' }}>{r.daily}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12.5, fontFamily: 'ui-monospace, monospace', color: 'var(--v2-text-2)' }}>{r.burst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* REST Endpoint Catalog */}
      <div className="v2c" style={{ marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px 0', fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>REST Endpoint Catalog</div>
        <div style={{ padding: '12px 24px 16px' }}>
          <div className="v2-tw">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--v2-border)' }}>
                  {['METHOD', 'ENDPOINT', 'DESCRIPTION'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 10.5, fontWeight: 600, color: 'var(--v2-text-3)', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ENDPOINTS.map(e => (
                  <tr key={e.path} style={{ borderBottom: '1px solid var(--v2-border-lt)' }}>
                    <td style={{ padding: '10px 16px' }}><span style={methodBadge(e.method)}>{e.method}</span></td>
                    <td style={{ padding: '10px 16px', fontSize: 12.5, fontFamily: 'ui-monospace, monospace', color: 'var(--v2-primary)', fontWeight: 500 }}>{e.path}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--v2-text-2)' }}>{e.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="v2c" style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>Code Examples</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['curl', 'python', 'javascript'] as const).map(l => (
              <button key={l} onClick={() => setCodeLang(l)}
                className={`v2b ${codeLang === l ? 'v2b-p' : 'v2b-s'}`}
                style={{ fontSize: 11, padding: '4px 10px', textTransform: 'capitalize' }}
              >{l}</button>
            ))}
          </div>
        </div>
        <div style={{
          background: '#1E1E2E', borderRadius: 8, padding: '16px 20px', position: 'relative',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, lineHeight: 1.6,
          color: '#CDD6F4', overflowX: 'auto', whiteSpace: 'pre',
        }}>
          <button onClick={() => copyKey(CODE_EXAMPLES[codeLang], 'code')}
            style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#94A3B8' }}>
            {copiedKey === 'code' ? <><IconCheck size={11} color="#10B981" /> Copied</> : <><IconCopy size={11} /> Copy</>}
          </button>
          {CODE_EXAMPLES[codeLang]}
        </div>
      </div>

      {/* Data Feeds */}
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 12 }}>Data Feeds</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
        {FEEDS.map(f => (
          <div key={f.name} className="v2c" style={{ ...card, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <f.icon size={16} color={f.statusColor} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-text)' }}>{f.name}</span>
                <span className="v2g v2g-ok" style={{ color: f.statusColor, background: f.bg }}>{f.status}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--v2-text-3)', marginTop: 4 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div>
      <div style={sectionTitle}>Notification Preferences</div>
      <div className="v2c" style={card}>
        {NOTIF_PREFS.map((n, idx) => (
          <div key={n.key} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0',
            borderBottom: idx < NOTIF_PREFS.length - 1 ? '1px solid var(--v2-border-lt)' : 'none',
          }}>
            <button style={toggleSwitch(!!notifs[n.key])}
              onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}>
              <div style={toggleKnob(!!notifs[n.key])} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--v2-text)' }}>{n.label}</div>
              <div style={{ fontSize: 12, color: 'var(--v2-text-3)', marginTop: 2 }}>{n.desc}</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {n.channels.map(c => (
                <span key={c} className="v2g v2g-n" style={{ fontSize: 10 }}>{c}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div>
      <div style={sectionTitle}>Security</div>

      {/* SSO */}
      <div className="v2c" style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>Single Sign-On (SSO)</div>
            <div style={{ fontSize: 12, color: 'var(--v2-text-3)', marginTop: 2 }}>Configure SAML 2.0 or OIDC provider</div>
          </div>
          <span className="v2g v2g-ok">Configured</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={fieldLabel}>Identity Provider</label>
            <input className="v2i" defaultValue="Okta" style={{ fontSize: 13 }} />
          </div>
          <div>
            <label style={fieldLabel}>SSO Domain</label>
            <input className="v2i" defaultValue="ncpdp.okta.com" style={{ fontSize: 13 }} />
          </div>
        </div>
      </div>

      {/* MFA */}
      <div className="v2c" style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>Multi-Factor Authentication</div>
            <div style={{ fontSize: 12, color: 'var(--v2-text-3)', marginTop: 2 }}>Require MFA for all team members</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="v2g v2g-ok">Enforced</span>
            <button className="v2b v2b-s" style={{ fontSize: 12 }}>Configure</button>
          </div>
        </div>
      </div>

      {/* Session Timeout */}
      <div className="v2c" style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)', marginBottom: 12 }}>Session Settings</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <div>
            <label style={fieldLabel}>Session Timeout</label>
            <select className="v2i" defaultValue="30" style={{ fontSize: 13 }}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
          <div>
            <label style={fieldLabel}>Max Sessions</label>
            <select className="v2i" defaultValue="3" style={{ fontSize: 13 }}>
              <option value="1">1 session</option>
              <option value="3">3 sessions</option>
              <option value="5">5 sessions</option>
              <option value="0">Unlimited</option>
            </select>
          </div>
          <div>
            <label style={fieldLabel}>IP Allowlist</label>
            <input className="v2i" defaultValue="192.168.1.0/24" style={{ fontSize: 13 }} />
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="v2c" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>Audit Log</div>
          <button className="v2b v2b-s" style={{ fontSize: 11 }}><IconDownload size={12} /> Export</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderTop: '1px solid var(--v2-border)', borderBottom: '1px solid var(--v2-border)' }}>
              {['TIME', 'USER', 'ACTION', 'IP ADDRESS'].map(h => (
                <th key={h} style={{ padding: '10px 16px', fontSize: 10.5, fontWeight: 600, color: 'var(--v2-text-3)', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.04em', background: 'var(--v2-surface-2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOG.map((a, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--v2-border-lt)' }}>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--v2-text-3)' }}>{a.time}</td>
                <td style={{ padding: '10px 16px', fontSize: 12.5, fontWeight: 500, color: 'var(--v2-text)' }}>{a.user}</td>
                <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--v2-text-2)' }}>{a.action}</td>
                <td style={{ padding: '10px 16px', fontSize: 12, fontFamily: 'ui-monospace, monospace', color: 'var(--v2-text-3)' }}>{a.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div>
      <div style={sectionTitle}>Billing & Plans</div>

      {/* Current Plan */}
      <div className="v2c" style={{ ...card, marginBottom: 16, border: '1px solid var(--v2-primary-m)', background: 'linear-gradient(135deg, var(--v2-primary-bg) 0%, #fff 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--v2-text)' }}>Enterprise Plan</span>
              <span className="v2g v2g-p">Current</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--v2-text-3)', marginTop: 4 }}>$12,500/mo &middot; Billed annually &middot; Renews Jan 1, 2027</div>
          </div>
          <button className="v2b v2b-s" style={{ fontSize: 12 }}>Manage Plan</button>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="v2c" style={{ overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>Plan Comparison</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderTop: '1px solid var(--v2-border)', borderBottom: '1px solid var(--v2-border)' }}>
              {['PLAN', 'PRICE', 'API CALLS', 'USERS', 'SUPPORT', 'SLA'].map(h => (
                <th key={h} style={{ padding: '10px 16px', fontSize: 10.5, fontWeight: 600, color: 'var(--v2-text-3)', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.04em', background: 'var(--v2-surface-2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLANS.map(p => (
              <tr key={p.name} style={{ borderBottom: '1px solid var(--v2-border-lt)', background: p.name === 'Enterprise' ? 'var(--v2-primary-bg)' : 'transparent' }}>
                <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: p.name === 'Enterprise' ? 600 : 400, color: 'var(--v2-text)' }}>
                  {p.name} {p.name === 'Enterprise' && <span className="v2g v2g-p" style={{ marginLeft: 6 }}>Current</span>}
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: 'var(--v2-text)' }}>{p.price}</td>
                <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--v2-text-2)' }}>{p.api}</td>
                <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--v2-text-2)' }}>{p.users}</td>
                <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--v2-text-2)' }}>{p.support}</td>
                <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--v2-text-2)' }}>{p.sla}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoices */}
      <div className="v2c" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v2-text)' }}>Invoice History</div>
          <button className="v2b v2b-s" style={{ fontSize: 11 }}><IconDownload size={12} /> Download All</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderTop: '1px solid var(--v2-border)', borderBottom: '1px solid var(--v2-border)' }}>
              {['INVOICE', 'DATE', 'AMOUNT', 'STATUS', ''].map((h, i) => (
                <th key={i} style={{ padding: '10px 16px', fontSize: 10.5, fontWeight: 600, color: 'var(--v2-text-3)', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.04em', background: 'var(--v2-surface-2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid var(--v2-border-lt)' }}>
                <td style={{ padding: '10px 16px', fontSize: 12.5, fontFamily: 'ui-monospace, monospace', fontWeight: 500, color: 'var(--v2-primary)' }}>{inv.id}</td>
                <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--v2-text-2)' }}>{inv.date}</td>
                <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: 'var(--v2-text)' }}>{inv.amount}</td>
                <td style={{ padding: '10px 16px' }}><span className="v2g v2g-ok">{inv.status}</span></td>
                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                  <button className="v2b v2b-g" style={{ fontSize: 11, padding: '3px 6px' }}><IconDownload size={12} /> PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (section) {
      case 'profile':       return renderProfile();
      case 'team':          return renderTeam();
      case 'api':           return renderApi();
      case 'notifications': return renderNotifications();
      case 'security':      return renderSecurity();
      case 'billing':       return renderBilling();
    }
  };

  return (
    <>
      <TopbarV2 title="Admin" />

      <main style={{ display: 'flex', padding: '20px 24px 40px', gap: 24 }}>

        {/*  Left sidebar nav  */}
        <nav style={{ width: 200, flexShrink: 0 }}>
          <div className="v2c" style={{ padding: 8, position: 'sticky', top: 72 }}>
            {SECTIONS.map(s => {
              const active = section === s.key;
              return (
                <button key={s.key} onClick={() => setSection(s.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: active ? 'var(--v2-primary-bg)' : 'transparent',
                    color: active ? 'var(--v2-primary)' : 'var(--v2-text-2)',
                    fontSize: 13, fontWeight: active ? 600 : 450, fontFamily: 'inherit',
                    transition: 'all .1s', textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--v2-surface-2)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <s.icon size={15} color={active ? 'var(--v2-primary)' : 'var(--v2-text-3)'} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/*  Main content  */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {renderSection()}
        </div>
      </main>
    </>
  );
}
