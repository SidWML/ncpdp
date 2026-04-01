import React from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { StatCard } from '@/components/dashboard/StatCard';
import { AlertItem } from '@/components/dashboard/AlertItem';
import { AgentCard } from '@/components/dashboard/AgentCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RePieChart } from '@/components/charts/RePieChart';
import { ReAreaChart } from '@/components/charts/AreaChart';
import { Progress } from '@/components/ui/Progress';
import {
  stats, alerts, agents, credentialStatus,
  networkTrend, stateBreakdown,
} from '@/lib/mockData';
import Link from 'next/link';
import {
  IconStore, IconShieldCheck, IconBell, IconZap,
  IconDownload, IconTrendUp, IconChevronRight,
} from '@/components/ui/Icons';

const statIcons = [
  <IconStore       size={18} key="s"/>,
  <IconShieldCheck size={18} key="c"/>,
  <IconBell        size={18} key="b"/>,
  <IconZap         size={18} key="z"/>,
];
const statColorMap = ['brand', 'success', 'warning', 'violet'] as const;
const sparkSets = [
  [40,55,48,62,58,70,66,75,72,80],
  [88,90,91,92,90,93,94,93,95,94],
  [32,28,41,38,50,42,55,47,48,47],
  [1.0,1.05,1.1,0.95,1.15,1.08,1.18,1.20,1.22,1.24],
];

const healthMetrics = [
  { label: 'DEA Compliance',   score: 98, color: '#059669', detail: '64,238 active'            },
  { label: 'Network Adequacy', score: 96, color: '#2968B0', detail: '64 / 67 CMS standards'    },
  { label: 'FWA Status',       score: 91, color: '#D97706', detail: '6 pharmacies under review' },
  { label: 'NSA Readiness',    score: 99, color: '#2563EB', detail: '38,522 validated'          },
];

const recentChanges = [
  { id: 'NCP-0842', name: 'CareRx Pharmacy #0842',   type: 'Pharmacy Closed',   date: 'Mar 29', impact: '3 networks affected',    badge: 'danger',  label: 'Action'   },
  { id: 'NCP-1290', name: 'Wellness Drug Store',      type: 'Ownership Change',  date: 'Mar 28', impact: 'Contract review needed', badge: 'warning', label: 'Review'   },
  { id: 'NCP-3451', name: 'MedFirst Pharmacy',        type: 'New Opening',       date: 'Mar 27', impact: 'Added to 2 networks',   badge: 'success', label: 'Active'   },
  { id: 'NCP-5501', name: 'PharmaPlus #42',           type: 'DEA Expiring',      date: 'Mar 26', impact: 'Renewal required',       badge: 'warning', label: 'Expiring' },
  { id: 'NCP-7820', name: 'HealthMart RX',            type: 'Services Updated',  date: 'Mar 25', impact: '340B program added',     badge: 'info',    label: 'Info'     },
];

export default function DashboardPage() {
  const topAlerts = alerts.slice(0, 5);
  const topAgents = agents.slice(0, 5);

  return (
    <>
      <Topbar
        title=""
        subtitle=""
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary">Last 30 Days</button>
            <Link href="/reports" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ gap: 6 }}>
                <IconDownload size={14} color="#fff"/> Export Report
              </button>
            </Link>
          </div>
        }
      />

      <main style={{ padding: '24px 24px 48px' }}>

        {/* ── Greeting ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-.3px' }}>
              Good morning, Sarah
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Tuesday, March 31, 2026 · Here&apos;s your pharmacy network overview
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#059669' }}>
            <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block' }}/>
            Real-time · Updated just now
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <StatCard
              key={s.id}
              label={s.label}
              value={s.value}
              delta={s.delta}
              deltaDir={s.deltaDir}
              deltaPeriod={s.deltaPeriod}
              icon={statIcons[i]}
              color={statColorMap[i]}
              sparkData={sparkSets[i]}
            />
          ))}
        </div>

        {/* ── Row 1: charts ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <Card>
            <CardHeader
              title="Network Growth"
              subtitle="Active pharmacies — 6 months"
              action={<Badge variant="success" dot>Live</Badge>}
            />
            <CardBody>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-.5px' }}>68,247</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <IconTrendUp size={11} color="#059669"/> +2.2%
                </span>
              </div>
              <ReAreaChart
                data={networkTrend.map(d => ({ label: d.month, value: d.count }))}
                color="#2968B0"
                height={120}
                yDomain={[65000, 69000]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Credential Status"
              subtitle="DEA · License · Accreditation"
              action={
                <Link href="/compliance" style={{ textDecoration: 'none' }}>
                  <button className="btn-ghost">Details</button>
                </Link>
              }
            />
            <CardBody style={{ padding: '14px 20px 20px' }}>
              <RePieChart
                segments={credentialStatus}
                innerRadius={52}
                outerRadius={72}
                centerLabel="94.2%"
                centerSub="compliant"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Top States" subtitle="By pharmacy count"/>
            <CardBody style={{ padding: '10px 20px 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stateBreakdown.map(s => (
                  <Progress
                    key={s.state}
                    value={s.pct}
                    label={`${s.state} · ${s.count.toLocaleString()}`}
                    color="var(--brand-600)"
                    height={4}
                    showLabel
                  />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── Compliance health — clean card ── */}
        <div className="card" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
          marginBottom: 24,
          padding: '20px 24px',
        }}>
          {healthMetrics.map(m => (
            <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
                <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="26" cy="26" r="20" fill="none" stroke="var(--border)" strokeWidth="4"/>
                  <circle cx="26" cy="26" r="20" fill="none" stroke={m.color} strokeWidth="4"
                    strokeDasharray={`${(m.score/100)*2*Math.PI*20} ${2*Math.PI*20}`}
                    strokeLinecap="round"/>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {m.score}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{m.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{m.detail}</div>
                <div style={{ marginTop: 6, height: 3, width: 84, background: 'var(--surface-3)', borderRadius: 9999 }}>
                  <div style={{ width: `${m.score}%`, height: '100%', background: m.color, borderRadius: 9999 }}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent Network Changes ── */}
        <Card style={{ marginBottom: 24 }}>
          <CardHeader
            title="Recent Network Changes"
            subtitle="Last 7 days · Tracked by AGT-05 Change Tracker"
            badge={<Badge variant="neutral">47 this week</Badge>}
          />
          <CardBody style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pharmacy</th>
                  <th>NCPDP ID</th>
                  <th>Change Type</th>
                  <th>Date</th>
                  <th>Impact</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentChanges.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.name}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>{r.id}</td>
                    <td>{r.type}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.date}</td>
                    <td>{r.impact}</td>
                    <td>
                      <Badge variant={r.badge as 'danger'|'warning'|'success'|'info'|'neutral'}>{r.label}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 13,
              color: 'var(--text-muted)',
            }}>
              <span>Showing 5 of 47 changes · Powered by Change Tracker (AGT-05)</span>
              <Link href="/alerts" style={{ textDecoration: 'none' }}>
                <button className="btn-ghost" style={{ gap: 4 }}>
                  View All Changes <IconChevronRight size={12}/>
                </button>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* ── Row 2: alerts · agents · feed ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'stretch' }}>

          {/* Active Alerts */}
          <Card style={{ display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title="Active Alerts"
              badge={<Badge variant="danger">47</Badge>}
              action={
                <Link href="/alerts" style={{ textDecoration: 'none' }}>
                  <button className="btn-ghost">View all</button>
                </Link>
              }
            />
            <CardBody style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                {topAlerts.map(a => <AlertItem key={a.id} {...a}/>)}
              </div>
              <div style={{
                marginTop: 12, marginBottom: 16, padding: '12px 14px',
                background: 'var(--surface-2)', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>47 total alerts this month</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>2 critical · 3 unread · Updated now</div>
                </div>
                <Link href="/alerts" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ padding: '6px 12px', gap: 4 }}>
                    <IconChevronRight size={12}/> Inbox
                  </button>
                </Link>
              </div>
            </CardBody>
          </Card>

          {/* Top Agents */}
          <Card style={{ display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title="Top Agents"
              subtitle="Most used this month"
              action={
                <Link href="/agents" style={{ textDecoration: 'none' }}>
                  <button className="btn-ghost">All 33</button>
                </Link>
              }
            />
            <CardBody style={{ padding: '10px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {topAgents.map(a => <AgentCard key={a.id} {...a} compact/>)}
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8 }}>Categories</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {['Search', 'Network', 'Compliance', 'Analytics', 'Data'].map(cat => (
                    <span key={cat} style={{ fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 4, background: 'var(--surface-3)', color: 'var(--text-muted)' }}>{cat}</span>
                  ))}
                </div>
                <Link href="/agents" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    Browse Agent Library →
                  </button>
                </Link>
              </div>
            </CardBody>
          </Card>

          {/* Activity Feed */}
          <Card style={{ display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title="Activity Feed"
              subtitle="Platform activity stream"
              action={<Badge variant="info" dot>Streaming</Badge>}
            />
            <CardBody style={{ padding: '12px 20px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <ActivityFeed/>
              </div>
              <div style={{
                marginTop: 12, marginBottom: 16, padding: '10px 14px',
                background: 'var(--surface-2)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block' }}/>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Live · 24 events today</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Auto-refresh 30s</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── Quick actions ── */}
        <div className="card" style={{ marginTop: 16, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginRight: 4 }}>Quick Actions</span>
          {[
            { label: 'Search Pharmacies', href: '/search'     },
            { label: 'Analytics',         href: '/analytics'  },
            { label: 'Compliance Report', href: '/compliance' },
            { label: 'Build Report',      href: '/reports'    },
            { label: 'Data Delivery',     href: '/delivery'   },
            { label: 'FWA Attestation',   href: '/fwa'        },
          ].map(({ label, href }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">{label}</button>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
