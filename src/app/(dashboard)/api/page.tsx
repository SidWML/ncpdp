'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import {
  IconCopy, IconRefresh, IconPlus, IconCheck, IconCode,
  IconExternalLink, IconKey,
} from '@/components/ui/Icons';

const apiKeys = [
  { name: 'Production API Key',    key: 'dq_live_••••••••••••••••••••••••••••••2f4a', created: 'Jan 15, 2024', lastUsed: '2 min ago',  calls: '1,241,847', status: 'active' },
  { name: 'Staging / Testing',     key: 'dq_test_••••••••••••••••••••••••••••••9c2b', created: 'Mar 10, 2026', lastUsed: '1 hour ago', calls: '48,291',    status: 'active' },
  { name: 'Webhook Signing Secret', key: 'whsec_••••••••••••••••••••••••••••••••7d1e', created: 'Feb 5, 2026',  lastUsed: 'Never',      calls: '0',         status: 'inactive' },
];

const usageData = [
  { label: 'Mon', value: 165000 },
  { label: 'Tue', value: 182000 },
  { label: 'Wed', value: 198000 },
  { label: 'Thu', value: 211000 },
  { label: 'Fri', value: 224000 },
  { label: 'Sat', value: 142000 },
  { label: 'Sun', value: 118000 },
];

const endpoints = [
  { method: 'GET',    path: '/v2/pharmacies',              desc: 'Search pharmacies with filters',         calls: '824,291' },
  { method: 'GET',    path: '/v2/pharmacies/{ncpdp_id}',   desc: 'Get pharmacy by NCPDP ID',               calls: '312,480' },
  { method: 'GET',    path: '/v2/pharmacies/delta',        desc: 'Delta feed — changes since timestamp',   calls: '88,142'  },
  { method: 'POST',   path: '/v2/pharmacies/bulk',         desc: 'Bulk lookup (up to 1,000 IDs)',          calls: '14,720'  },
  { method: 'GET',    path: '/v2/credentials/{ncpdp_id}',  desc: 'Credential status for a pharmacy',      calls: '9,841'   },
  { method: 'GET',    path: '/v2/networks/{rel_id}',       desc: 'Network membership details',             calls: '4,280'   },
  { method: 'POST',   path: '/graphql',                    desc: 'GraphQL query endpoint',                 calls: '2,193'   },
];

const methodColors: Record<string, { color: string; bg: string }> = {
  GET:  { color: '#059669', bg: '#D1FAE5' },
  POST: { color: '#2563EB', bg: '#DBEAFE' },
  PUT:  { color: '#D97706', bg: '#FEF3C7' },
  DEL:  { color: '#DC2626', bg: '#FEE2E2' },
};

const codeExamples: Record<string, string> = {
  curl: `curl -X GET "https://api.dataq.ai/v2/pharmacies?state=TX&dea_status=expiring&limit=50" \\
  -H "Authorization: Bearer dq_live_..." \\
  -H "Content-Type: application/json"`,
  python: `import dataqai

client = dataqai.Client(api_key="dq_live_...")
results = client.pharmacies.search(
    state="TX",
    dea_status="expiring",
    limit=50
)
for pharmacy in results:
    print(pharmacy.name, pharmacy.dea_expires)`,
  javascript: `const { DataQClient } = require('@ncpdp/dataqai');

const client = new DataQClient({ apiKey: 'dq_live_...' });

const results = await client.pharmacies.search({
  state: 'TX',
  deaStatus: 'expiring',
  limit: 50,
});

results.forEach(p => console.log(p.name, p.deaExpires));`,
};

export default function APIPage() {
  const [copied, setCopied]         = useState<string | null>(null);
  const [codeLang, setCodeLang]     = useState<'curl' | 'python' | 'javascript'>('curl');
  const [showKey, setShowKey]       = useState<string | null>(null);

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  const maxCalls = Math.max(...usageData.map(d => d.value));

  return (
    <>
      <Topbar
        title="API Access"
        subtitle="REST · GraphQL · Webhooks — programmatic pharmacy data access"
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary" style={{ fontSize: 12, gap: 5 }}>
              <IconExternalLink size={13}/> API Docs
            </button>
            <button className="btn-primary" style={{ fontSize: 12, gap: 5 }}>
              <IconPlus size={13} color="#fff"/> New API Key
            </button>
          </div>
        }
      />
      <main style={{ padding: '16px 20px 40px' }}>

        {/* Usage stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }}>
          {[
            { label: 'Calls Today',    value: '1.24M',   pct: 67,  color: '#4F46E5' },
            { label: 'Avg Latency',    value: '182ms',   pct: 36,  color: '#10B981' },
            { label: 'Success Rate',   value: '99.94%',  pct: 100, color: '#10B981' },
            { label: 'Monthly Quota',  value: '67% used',pct: 67,  color: '#D97706' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{s.value}</div>
              <Progress value={s.pct} color={s.color} height={4}/>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

          {/* API Keys */}
          <Card>
            <CardHeader
              title="API Keys"
              subtitle="Manage your authentication credentials"
              action={<button className="btn-ghost" style={{ fontSize: 11.5, gap: 4 }}><IconPlus size={11}/> New Key</button>}
            />
            <CardBody style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {apiKeys.map(k => (
                <div key={k.name} style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--surface-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: k.status === 'active' ? '#D1FAE5' : 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconKey size={13} color={k.status === 'active' ? '#10B981' : 'var(--text-muted)'}/>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{k.name}</span>
                    </div>
                    <Badge variant={k.status === 'active' ? 'success' : 'neutral'} dot={k.status === 'active'}>
                      {k.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div
                    style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface-3)', padding: '6px 10px', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}
                    onClick={() => setShowKey(showKey === k.name ? null : k.name)}
                  >
                    <span>{showKey === k.name ? k.key.replace(/•+/, 'sk_real_key_hidden_for_display') : k.key}</span>
                    <button
                      onClick={e => { e.stopPropagation(); copyToClipboard(k.key, k.name); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 2 }}
                    >
                      {copied === k.name ? <IconCheck size={12} color="#10B981"/> : <IconCopy size={12}/>}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>Created {k.created}</span>
                    <span>Last used {k.lastUsed} · {k.calls} calls</span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Weekly Usage Chart */}
          <Card>
            <CardHeader
              title="API Call Volume"
              subtitle="Last 7 days"
              action={<Badge variant="brand" dot>+18% WoW</Badge>}
            />
            <CardBody style={{ padding: '16px 20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, marginBottom: 8 }}>
                {usageData.map(d => (
                  <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                    <div
                      style={{
                        width: '100%', borderRadius: '4px 4px 0 0',
                        background: d.label === 'Fri' ? '#4F46E5' : '#C7D2FE',
                        height: `${(d.value / maxCalls) * 100}%`,
                        minHeight: 4,
                        transition: 'height .3s',
                      }}
                    />
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginTop: 12 }}>
                {[
                  { label: 'Total This Week', value: '1,240,000' },
                  { label: 'Avg Per Day',     value: '177,143' },
                  { label: 'Peak Day',        value: 'Friday' },
                  { label: 'Peak Hour',       value: '10–11 AM ET' },
                ].map(m => (
                  <div key={m.label} style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Endpoints + Code examples */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

          {/* Endpoint catalog */}
          <Card>
            <CardHeader title="REST Endpoints" subtitle="v2 API · All endpoints"/>
            <CardBody style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Path</th>
                    <th>Description</th>
                    <th>Calls/mo</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map(ep => {
                    const mc = methodColors[ep.method] || methodColors.GET;
                    return (
                      <tr key={ep.path}>
                        <td>
                          <span style={{ fontSize: 10, fontWeight: 800, color: mc.color, background: mc.bg, padding: '2px 6px', borderRadius: 4, letterSpacing: '.04em' }}>
                            {ep.method}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: 11.5, color: '#4F46E5' }}>{ep.path}</td>
                        <td style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{ep.desc}</td>
                        <td style={{ fontSize: 12, fontWeight: 600 }}>{ep.calls}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
          </Card>

          {/* Code examples */}
          <Card>
            <CardHeader
              title="Quick Start"
              subtitle="Search pharmacies with DEA expiring in TX"
              icon={<IconCode size={14}/>}
            />
            <CardBody style={{ padding: '12px 16px 16px' }}>
              {/* Language tabs */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {(['curl', 'python', 'javascript'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setCodeLang(lang)}
                    style={{
                      fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 8, cursor: 'pointer',
                      background: codeLang === lang ? '#0F1A3E' : 'var(--surface-2)',
                      color: codeLang === lang ? '#818CF8' : 'var(--text-muted)',
                      border: `1px solid ${codeLang === lang ? 'rgba(99,102,241,.3)' : 'var(--border)'}`,
                      transition: 'all .15s',
                      textTransform: 'capitalize',
                    }}
                  >{lang}</button>
                ))}
                <button
                  onClick={() => copyToClipboard(codeExamples[codeLang], 'code')}
                  style={{ marginLeft: 'auto', background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                >
                  {copied === 'code' ? <><IconCheck size={11} color="#10B981"/> Copied</> : <><IconCopy size={11}/> Copy</>}
                </button>
              </div>

              <pre style={{
                background: '#0F1A3E', color: '#A5B4FC', fontSize: 11.5,
                lineHeight: 1.7, padding: '14px 16px', borderRadius: 12,
                overflow: 'auto', fontFamily: 'monospace', margin: 0,
                border: '1px solid rgba(99,102,241,.2)',
                maxHeight: 200,
              }}>
                {codeExamples[codeLang]}
              </pre>

              <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Rate Limits</div>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-secondary)' }}>
                  <span>Essential: <strong>1,000/hr</strong></span>
                  <span>Professional: <strong>10,000/hr</strong></span>
                  <span>Enterprise: <strong>Unlimited</strong></span>
                </div>
              </div>

              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, marginTop: 10, gap: 5 }}>
                <IconExternalLink size={12}/> Full API Documentation
              </button>
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}

