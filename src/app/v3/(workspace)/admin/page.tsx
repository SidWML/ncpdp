'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/v3/TopbarV3';
import {
  IconUser, IconUsers, IconKey, IconBell, IconShield, IconBarChart,
  IconCopy, IconCheck, IconPlus, IconCode, IconDatabase, IconServer,
  IconSettings, IconGlobe, IconLock, IconExternalLink, IconChevronRight,
} from '@/components/ui/Icons';

// -------------------------------------------------------------------
// Sidebar sections
// -------------------------------------------------------------------
const SECTIONS = [
  { key: 'profile',       label: 'Profile',        icon: IconUser },
  { key: 'team',          label: 'Team',           icon: IconUsers },
  { key: 'api',           label: 'API & Data',     icon: IconKey },
  { key: 'notifications', label: 'Notifications',  icon: IconBell },
  { key: 'security',      label: 'Security',       icon: IconShield },
  { key: 'billing',       label: 'Billing',        icon: IconBarChart },
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

// -------------------------------------------------------------------
// Team members
// -------------------------------------------------------------------
const TEAM = [
  { name: 'Sarah Chen',     email: 'sarah.chen@dataq.ai',     role: 'Owner',  status: 'Active',  joined: 'Jan 2024',  initials: 'SC', color: '#005C8D' },
  { name: 'Marcus Rivera',  email: 'marcus.r@dataq.ai',       role: 'Admin',  status: 'Active',  joined: 'Mar 2024',  initials: 'MR', color: '#449055' },
  { name: 'Priya Patel',    email: 'priya.p@dataq.ai',        role: 'Editor', status: 'Active',  joined: 'Jun 2024',  initials: 'PP', color: '#D97706' },
  { name: 'James Kim',      email: 'james.k@dataq.ai',        role: 'Viewer', status: 'Active',  joined: 'Sep 2024',  initials: 'JK', color: '#DC2626' },
  { name: 'Lisa Thompson',  email: 'lisa.t@dataq.ai',         role: 'Editor', status: 'Invited', joined: 'Mar 2026',  initials: 'LT', color: '#004870' },
];

// -------------------------------------------------------------------
// API stat cards
// -------------------------------------------------------------------
const API_STATS = [
  { label: 'Total Requests',  value: '1.24M',  sub: 'Last 30 days',  color: '#005C8D' },
  { label: 'Avg Latency',     value: '42ms',   sub: 'p95: 128ms',    color: '#449055' },
  { label: 'Success Rate',    value: '99.97%', sub: '342 errors',    color: '#1474A4' },
  { label: 'Active Keys',     value: '4',      sub: '2 production',  color: '#D97706' },
];

// -------------------------------------------------------------------
// API keys
// -------------------------------------------------------------------
const API_KEYS = [
  { name: 'Production - Primary',   key: 'dq_live_4f8a...b2c1',   created: 'Jan 12, 2024',  lastUsed: '2 min ago',  env: 'Production' },
  { name: 'Production - Backup',    key: 'dq_live_9e3d...a7f5',   created: 'Mar 08, 2024',  lastUsed: '3 days ago', env: 'Production' },
  { name: 'Staging',                key: 'dq_test_1b7c...d4e8',   created: 'Jun 22, 2024',  lastUsed: '1 hr ago',   env: 'Staging' },
  { name: 'Development',            key: 'dq_test_6a2f...c9b3',   created: 'Sep 15, 2024',  lastUsed: '5 min ago',  env: 'Development' },
];

// -------------------------------------------------------------------
// Rate limit tiers
// -------------------------------------------------------------------
const RATE_LIMITS = [
  { method: 'GET /pharmacies',          limit: '1,000 / min',   used: 842,   max: 1000 },
  { method: 'GET /pharmacies/:id',      limit: '2,000 / min',   used: 1204,  max: 2000 },
  { method: 'POST /search',             limit: '500 / min',     used: 267,   max: 500  },
  { method: 'GET /credentials',         limit: '800 / min',     used: 431,   max: 800  },
  { method: 'POST /bulk-export',        limit: '50 / hr',       used: 12,    max: 50   },
];

// -------------------------------------------------------------------
// REST endpoints
// -------------------------------------------------------------------
const ENDPOINTS = [
  { method: 'GET',    path: '/v2/pharmacies',           desc: 'List pharmacies with filtering' },
  { method: 'GET',    path: '/v2/pharmacies/:id',       desc: 'Get pharmacy by NCPDP ID' },
  { method: 'POST',   path: '/v2/search',               desc: 'Advanced pharmacy search' },
  { method: 'GET',    path: '/v2/credentials/:id',      desc: 'Credential status lookup' },
  { method: 'POST',   path: '/v2/bulk-export',           desc: 'Bulk data export' },
  { method: 'GET',    path: '/v2/networks/:id/coverage', desc: 'Network adequacy data' },
  { method: 'POST',   path: '/v2/webhooks',              desc: 'Register webhook endpoint' },
];

// -------------------------------------------------------------------
// Code examples
// -------------------------------------------------------------------
const CODE_EXAMPLES: Record<string, string> = {
  cURL: `curl -X GET "https://api.dataq.ai/v2/pharmacies?state=TX&type=retail" \\
  -H "Authorization: Bearer dq_live_4f8a...b2c1" \\
  -H "Content-Type: application/json"`,
  Python: `import requests

resp = requests.get(
    "https://api.dataq.ai/v2/pharmacies",
    headers={"Authorization": "Bearer dq_live_4f8a...b2c1"},
    params={"state": "TX", "type": "retail"},
)
data = resp.json()
print(f"Found {data['total']} pharmacies")`,
  JavaScript: `const resp = await fetch(
  "https://api.dataq.ai/v2/pharmacies?state=TX&type=retail",
  {
    headers: {
      Authorization: "Bearer dq_live_4f8a...b2c1",
      "Content-Type": "application/json",
    },
  }
);
const data = await resp.json();
console.log(\`Found \${data.total} pharmacies\`);`,
};

// -------------------------------------------------------------------
// Data feed cards
// -------------------------------------------------------------------
const DATA_FEEDS = [
  { name: 'Pharmacy Database Weekly', format: 'CSV / SFTP',    freq: 'Weekly - Mondays',  records: '81,500', status: 'Active',   color: '#449055' },
  { name: 'Credential Updates',       format: 'JSON / API',    freq: 'Real-time',         records: '~240/day', status: 'Active', color: '#005C8D' },
  { name: 'Network Changes',          format: 'XML / SFTP',    freq: 'Daily',             records: '~1,800',  status: 'Active',  color: '#1474A4' },
  { name: 'Compliance Alerts',        format: 'JSON / Webhook',freq: 'Real-time',         records: '~47/day', status: 'Active',  color: '#DC2626' },
];

// -------------------------------------------------------------------
// Notification channels
// -------------------------------------------------------------------
const NOTIF_CHANNELS = [
  { label: 'Credential Expiration Alerts',  email: true,  slack: true,  webhook: true  },
  { label: 'Network Change Notifications',  email: true,  slack: false, webhook: true  },
  { label: 'Compliance Risk Warnings',      email: true,  slack: true,  webhook: false },
  { label: 'API Usage Alerts',              email: false, slack: false, webhook: true  },
  { label: 'Weekly Summary Report',         email: true,  slack: false, webhook: false },
  { label: 'New Feature Announcements',     email: true,  slack: false, webhook: false },
];

// -------------------------------------------------------------------
// Audit log
// -------------------------------------------------------------------
const AUDIT_LOG = [
  { time: '2 min ago',   user: 'Sarah Chen',    action: 'Generated API key',          ip: '192.168.1.42' },
  { time: '1 hr ago',    user: 'Marcus Rivera',  action: 'Updated team member role',   ip: '10.0.0.15' },
  { time: '3 hr ago',    user: 'Priya Patel',    action: 'Exported 1,200 records',     ip: '172.16.0.8' },
  { time: 'Yesterday',   user: 'Sarah Chen',     action: 'Enabled SSO via Okta',       ip: '192.168.1.42' },
  { time: '2 days ago',  user: 'James Kim',      action: 'Viewed pharmacy NCP-001',    ip: '10.0.0.22' },
];

// -------------------------------------------------------------------
// Billing - plan comparison
// -------------------------------------------------------------------
const PLANS = [
  {
    name: 'Starter',     price: '$499/mo',  current: false,
    features: ['5,000 API calls/mo', '2 team seats', 'Weekly data feed', 'Email support'],
  },
  {
    name: 'Professional', price: '$1,299/mo', current: true,
    features: ['50,000 API calls/mo', '10 team seats', 'Daily data feed', 'Priority support', 'Webhook integrations', 'Custom reports'],
  },
  {
    name: 'Enterprise',   price: 'Custom',   current: false,
    features: ['Unlimited API calls', 'Unlimited seats', 'Real-time feed', 'Dedicated CSM', 'SLA guarantee', 'SSO / SAML', 'Custom integrations'],
  },
];

const INVOICES = [
  { date: 'Mar 1, 2026',  amount: '$1,299.00', status: 'Paid',    id: 'INV-2026-003' },
  { date: 'Feb 1, 2026',  amount: '$1,299.00', status: 'Paid',    id: 'INV-2026-002' },
  { date: 'Jan 1, 2026',  amount: '$1,299.00', status: 'Paid',    id: 'INV-2026-001' },
  { date: 'Dec 1, 2025',  amount: '$1,299.00', status: 'Paid',    id: 'INV-2025-012' },
  { date: 'Nov 1, 2025',  amount: '$1,299.00', status: 'Paid',    id: 'INV-2025-011' },
];

// ===================================================================
// Helpers
// ===================================================================
const methodColor = (m: string) => {
  if (m === 'GET')  return '#449055';
  if (m === 'POST') return '#1474A4';
  if (m === 'PUT')  return '#D97706';
  return '#005C8D';
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="v3-btn v3-btn-ghost"
      style={{ padding: '4px 8px' }}
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
    >
      {copied ? <IconCheck size={13} color="#449055"/> : <IconCopy size={13}/>}
    </button>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
        background: on ? 'var(--v3-accent)' : 'var(--v3-surface-3)',
        position: 'relative', transition: 'background .15s',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: on ? 20 : 2,
        width: 18, height: 18, borderRadius: 9, background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.15)', transition: 'left .15s',
      }}/>
    </button>
  );
}

// ===================================================================
// Main page
// ===================================================================
export default function AdminPage() {
  const [section, setSection] = useState<SectionKey>('profile');
  const [codeLang, setCodeLang] = useState<string>('cURL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [notifs, setNotifs] = useState(
    NOTIF_CHANNELS.map(n => ({ ...n }))
  );

  // -- Copy API key helper
  const copyKey = (k: string) => { navigator.clipboard.writeText(k); setCopiedKey(k); setTimeout(() => setCopiedKey(null), 1500); };

  // -- Toggle notification
  const toggleNotif = (idx: number, channel: 'email' | 'slack' | 'webhook') => {
    setNotifs(prev => prev.map((n, i) => i === idx ? { ...n, [channel]: !n[channel] } : n));
  };

  // -- Render current section
  const renderSection = () => {
    switch (section) {
      // ---------------------------------------------------------------
      // PROFILE
      // ---------------------------------------------------------------
      case 'profile':
        return (
          <div>
            <h2 className="v3-title" style={{ marginBottom: 20 }}>Profile Settings</h2>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: 'linear-gradient(135deg,#005C8D,#005C8D)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 700, color: '#fff',
              }}>SC</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--v3-text)' }}>Sarah Chen</div>
                <div className="v3-sub">Owner - dataq.ai</div>
              </div>
              <button className="v3-btn v3-btn-soft" style={{ marginLeft: 'auto' }}>Change Avatar</button>
            </div>

            {/* 2-column form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 700 }}>
              <div>
                <label className="v3-label">First Name</label>
                <input className="v3-input" defaultValue="Sarah"/>
              </div>
              <div>
                <label className="v3-label">Last Name</label>
                <input className="v3-input" defaultValue="Chen"/>
              </div>
              <div>
                <label className="v3-label">Email</label>
                <input className="v3-input" defaultValue="sarah.chen@dataq.ai"/>
              </div>
              <div>
                <label className="v3-label">Phone</label>
                <input className="v3-input" defaultValue="(602) 555-0142"/>
              </div>
              <div>
                <label className="v3-label">Organization</label>
                <input className="v3-input" defaultValue="NCPDP"/>
              </div>
              <div>
                <label className="v3-label">Role</label>
                <input className="v3-input" defaultValue="Platform Administrator" readOnly style={{ background: 'var(--v3-surface-2)' }}/>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="v3-label">Bio</label>
                <textarea className="v3-input" rows={3} defaultValue="Healthcare data platform lead with 12 years of experience in pharmacy network management and compliance." style={{ resize: 'vertical' }}/>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <button className="v3-btn v3-btn-accent">Save Changes</button>
            </div>
          </div>
        );

      // ---------------------------------------------------------------
      // TEAM
      // ---------------------------------------------------------------
      case 'team':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 className="v3-title">Team Members</h2>
              <button className="v3-btn v3-btn-accent"><IconPlus size={14}/> Invite Member</button>
            </div>

            {/* Seat usage bar */}
            <div className="v3-card" style={{ padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="v3-label" style={{ marginBottom: 0 }}>Seat Usage</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--v3-text)' }}>5 / 10 seats</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--v3-surface-2)', overflow: 'hidden' }}>
                <div style={{ width: '50%', height: '100%', borderRadius: 4, background: 'var(--v3-accent)' }}/>
              </div>
            </div>

            {/* Team table */}
            <div className="v3-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {TEAM.map((m, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700, color: '#fff',
                          }}>{m.initials}</div>
                          <div>
                            <div style={{ fontWeight: 550, fontSize: 13 }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--v3-text-3)' }}>{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="v3-badge v3-badge-gray">{m.role}</span></td>
                      <td>
                        <span className={`v3-badge ${m.status === 'Active' ? 'v3-badge-green' : 'v3-badge-amber'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--v3-text-3)', fontSize: 12 }}>{m.joined}</td>
                      <td>
                        <button className="v3-btn v3-btn-ghost" style={{ padding: '4px 8px' }}>
                          <IconSettings size={14}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // ---------------------------------------------------------------
      // API & DATA
      // ---------------------------------------------------------------
      case 'api':
        return (
          <div>
            <h2 className="v3-title" style={{ marginBottom: 20 }}>API & Data Management</h2>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
              {API_STATS.map((s, i) => (
                <div key={i} className="v3-card" style={{ padding: 18 }}>
                  <div className="v3-label">{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
                  <div className="v3-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* API Keys */}
            <div className="v3-section">API Keys</div>
            <div className="v3-table-wrap" style={{ marginBottom: 28 }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Key</th>
                    <th>Environment</th>
                    <th>Created</th>
                    <th>Last Used</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {API_KEYS.map((k, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 550 }}>{k.name}</td>
                      <td>
                        <code style={{ fontSize: 12, background: 'var(--v3-surface-2)', padding: '3px 8px', borderRadius: 6 }}>
                          {k.key}
                        </code>
                      </td>
                      <td>
                        <span className={`v3-badge ${k.env === 'Production' ? 'v3-badge-green' : 'v3-badge-gray'}`}>{k.env}</span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--v3-text-3)' }}>{k.created}</td>
                      <td style={{ fontSize: 12, color: 'var(--v3-text-3)' }}>{k.lastUsed}</td>
                      <td>
                        <button
                          className="v3-btn v3-btn-ghost"
                          style={{ padding: '4px 8px' }}
                          onClick={() => copyKey(k.key)}
                        >
                          {copiedKey === k.key ? <IconCheck size={13} color="#449055"/> : <IconCopy size={13}/>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rate Limits */}
            <div className="v3-section">Rate Limits</div>
            <div className="v3-card" style={{ padding: 20, marginBottom: 28 }}>
              {RATE_LIMITS.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: i < RATE_LIMITS.length - 1 ? 14 : 0 }}>
                  <code style={{ fontSize: 12, width: 200, flexShrink: 0, color: 'var(--v3-text-2)' }}>{r.method}</code>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--v3-surface-2)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(r.used / r.max) * 100}%`, height: '100%', borderRadius: 3,
                      background: r.used / r.max > 0.9 ? '#DC2626' : r.used / r.max > 0.7 ? '#D97706' : '#449055',
                    }}/>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--v3-text-3)', width: 120, textAlign: 'right' }}>
                    {r.used.toLocaleString()} / {r.limit}
                  </span>
                </div>
              ))}
            </div>

            {/* REST Endpoints */}
            <div className="v3-section">REST Endpoints</div>
            <div className="v3-table-wrap" style={{ marginBottom: 28 }}>
              <table>
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {ENDPOINTS.map((e, i) => (
                    <tr key={i}>
                      <td>
                        <span style={{
                          display: 'inline-block', padding: '2px 10px', borderRadius: 6,
                          fontSize: 11, fontWeight: 700, color: '#fff',
                          background: methodColor(e.method),
                        }}>{e.method}</span>
                      </td>
                      <td><code style={{ fontSize: 12.5 }}>{e.path}</code></td>
                      <td style={{ color: 'var(--v3-text-2)', fontSize: 13 }}>{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Code Examples */}
            <div className="v3-section">Code Examples</div>
            <div style={{ marginBottom: 8, display: 'flex', gap: 4 }}>
              {Object.keys(CODE_EXAMPLES).map(lang => (
                <button
                  key={lang}
                  className={`v3-tab ${codeLang === lang ? 'active' : ''}`}
                  onClick={() => setCodeLang(lang)}
                  style={{ borderBottom: 'none', padding: '6px 14px', borderRadius: 8 }}
                >
                  {lang}
                </button>
              ))}
            </div>
            <div style={{
              background: '#1E1E2E', borderRadius: 12, padding: 20, position: 'relative',
              fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
              fontSize: 12.5, lineHeight: 1.7, color: '#CDD6F4', overflowX: 'auto',
            }}>
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <CopyButton text={CODE_EXAMPLES[codeLang]}/>
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{CODE_EXAMPLES[codeLang]}</pre>
            </div>

            {/* Data Feeds */}
            <div className="v3-section" style={{ marginTop: 28 }}>Data Feeds</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {DATA_FEEDS.map((f, i) => (
                <div key={i} className="v3-card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: f.color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <IconDatabase size={16} color={f.color}/>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{f.name}</div>
                      <div className="v3-sub">{f.format}</div>
                    </div>
                    <span className="v3-badge v3-badge-green" style={{ marginLeft: 'auto' }}>{f.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--v3-text-3)' }}>
                    <span>Frequency: {f.freq}</span>
                    <span>Records: {f.records}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ---------------------------------------------------------------
      // NOTIFICATIONS
      // ---------------------------------------------------------------
      case 'notifications':
        return (
          <div>
            <h2 className="v3-title" style={{ marginBottom: 20 }}>Notification Preferences</h2>

            <div className="v3-card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--v3-border)' }}>
                    <th style={{ padding: '12px 18px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: 'var(--v3-text-3)' }}>Notification</th>
                    <th style={{ padding: '12px 18px', textAlign: 'center', fontSize: 12, fontWeight: 500, color: 'var(--v3-text-3)' }}>
                      <span className="v3-badge v3-badge-accent" style={{ fontSize: 10 }}>Email</span>
                    </th>
                    <th style={{ padding: '12px 18px', textAlign: 'center', fontSize: 12, fontWeight: 500, color: 'var(--v3-text-3)' }}>
                      <span className="v3-badge" style={{ fontSize: 10, background: '#C6E0EC', color: '#4338CA' }}>Slack</span>
                    </th>
                    <th style={{ padding: '12px 18px', textAlign: 'center', fontSize: 12, fontWeight: 500, color: 'var(--v3-text-3)' }}>
                      <span className="v3-badge v3-badge-gray" style={{ fontSize: 10 }}>Webhook</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notifs.map((n, i) => (
                    <tr key={i} style={{ borderBottom: i < notifs.length - 1 ? '1px solid var(--v3-border-lt)' : 'none' }}>
                      <td style={{ padding: '14px 18px', fontSize: 13.5, fontWeight: 500, color: 'var(--v3-text)' }}>{n.label}</td>
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}><Toggle on={n.email} onToggle={() => toggleNotif(i, 'email')}/></td>
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}><Toggle on={n.slack} onToggle={() => toggleNotif(i, 'slack')}/></td>
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}><Toggle on={n.webhook} onToggle={() => toggleNotif(i, 'webhook')}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // ---------------------------------------------------------------
      // SECURITY
      // ---------------------------------------------------------------
      case 'security':
        return (
          <div>
            <h2 className="v3-title" style={{ marginBottom: 20 }}>Security Settings</h2>

            {/* SSO */}
            <div className="v3-card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#E8F3F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconGlobe size={20} color="#005C8D"/>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Single Sign-On (SSO)</div>
                    <div className="v3-sub">SAML 2.0 via Okta</div>
                  </div>
                </div>
                <span className="v3-badge v3-badge-green">Enabled</span>
              </div>
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 500 }}>
                <div>
                  <label className="v3-label">SSO Provider</label>
                  <input className="v3-input" defaultValue="Okta" readOnly style={{ background: 'var(--v3-surface-2)' }}/>
                </div>
                <div>
                  <label className="v3-label">Domain</label>
                  <input className="v3-input" defaultValue="dataq.okta.com" readOnly style={{ background: 'var(--v3-surface-2)' }}/>
                </div>
              </div>
            </div>

            {/* MFA */}
            <div className="v3-card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconLock size={20} color="#449055"/>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Multi-Factor Authentication</div>
                    <div className="v3-sub">Required for all team members</div>
                  </div>
                </div>
                <span className="v3-badge v3-badge-green">Enforced</span>
              </div>
              <div style={{ marginTop: 14, fontSize: 13, color: 'var(--v3-text-2)' }}>
                All 5 team members have MFA enabled. Supported methods: Authenticator App, Hardware Key.
              </div>
            </div>

            {/* Session */}
            <div className="v3-card" style={{ padding: 20, marginBottom: 28 }}>
              <div className="v3-section">Session Settings</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 500 }}>
                <div>
                  <label className="v3-label">Session Timeout</label>
                  <select className="v3-input" defaultValue="30">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="v3-label">Max Concurrent Sessions</label>
                  <select className="v3-input" defaultValue="3">
                    <option value="1">1 session</option>
                    <option value="3">3 sessions</option>
                    <option value="5">5 sessions</option>
                    <option value="0">Unlimited</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Audit Log */}
            <div className="v3-section">Audit Log</div>
            <div className="v3-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_LOG.map((a, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 12, color: 'var(--v3-text-3)' }}>{a.time}</td>
                      <td style={{ fontWeight: 550 }}>{a.user}</td>
                      <td>{a.action}</td>
                      <td><code style={{ fontSize: 11.5, color: 'var(--v3-text-3)' }}>{a.ip}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // ---------------------------------------------------------------
      // BILLING
      // ---------------------------------------------------------------
      case 'billing':
        return (
          <div>
            <h2 className="v3-title" style={{ marginBottom: 20 }}>Billing & Plan</h2>

            {/* Current plan card */}
            <div className="v3-hero-card" style={{ padding: 24, marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Current Plan</div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>Professional</div>
                  <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>$1,299 / month - Billed annually</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>Next billing date</div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>Apr 1, 2026</div>
                </div>
              </div>
            </div>

            {/* Plan comparison */}
            <div className="v3-section">Compare Plans</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
              {PLANS.map((p, i) => (
                <div
                  key={i}
                  className="v3-card"
                  style={{
                    padding: 22,
                    border: p.current ? '2px solid var(--v3-accent)' : '1px solid var(--v3-border)',
                    position: 'relative',
                  }}
                >
                  {p.current && (
                    <span className="v3-badge v3-badge-accent" style={{ position: 'absolute', top: 12, right: 12, fontSize: 10 }}>
                      Current
                    </span>
                  )}
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--v3-text)', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--v3-accent)', marginBottom: 16 }}>{p.price}</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {p.features.map((f, fi) => (
                      <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--v3-text-2)', marginBottom: 8 }}>
                        <IconCheck size={14} color="#449055"/>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`v3-btn ${p.current ? 'v3-btn-soft' : 'v3-btn-accent'}`}
                    style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
                  >
                    {p.current ? 'Current Plan' : p.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>

            {/* Invoice History */}
            <div className="v3-section">Invoice History</div>
            <div className="v3-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {INVOICES.map((inv, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 550 }}>{inv.id}</td>
                      <td style={{ fontSize: 12, color: 'var(--v3-text-3)' }}>{inv.date}</td>
                      <td style={{ fontWeight: 600 }}>{inv.amount}</td>
                      <td><span className="v3-badge v3-badge-green">{inv.status}</span></td>
                      <td>
                        <button className="v3-btn v3-btn-ghost" style={{ padding: '4px 8px' }}>
                          <IconExternalLink size={13}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Topbar title="Administration" subtitle="Manage your account, team, and integrations"/>
      <div style={{ display: 'flex', padding: 24, gap: 24, minHeight: 'calc(100vh - 54px)' }}>
        {/* Left sidebar nav */}
        <nav style={{ width: 200, flexShrink: 0 }}>
          <div className="v3-card" style={{ padding: 8 }}>
            {SECTIONS.map(s => {
              const Icon = s.icon;
              const active = section === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSection(s.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '10px 14px', border: 'none', borderRadius: 10,
                    background: active ? 'var(--v3-accent-bg)' : 'transparent',
                    color: active ? 'var(--v3-accent)' : 'var(--v3-text-2)',
                    fontSize: 13.5, fontWeight: active ? 600 : 450,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all .1s',
                  }}
                >
                  <Icon size={16} color={active ? 'var(--v3-accent)' : 'var(--v3-text-3)'}/>
                  {s.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {renderSection()}
        </div>
      </div>
    </>
  );
}
