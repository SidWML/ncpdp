'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { RePieChart } from '@/components/charts/RePieChart';
import { ReAreaChart } from '@/components/charts/AreaChart';
import { ReBarChart } from '@/components/charts/ReBarChart';
import { credentialStatus, networkTrend, stateBreakdown } from '@/lib/mockData';
import { IconDownload, IconActivity } from '@/components/ui/Icons';

const pharmacyTypes = [
  { label: 'Retail',      value: 38420, pct: 56, color: '#4F46E5' },
  { label: 'Specialty',   value: 14720, pct: 22, color: '#06B6D4' },
  { label: 'LTC',         value: 8190,  pct: 12, color: '#10B981' },
  { label: 'Compounding', value: 4100,  pct: 6,  color: '#F59E0B' },
  { label: 'Mail Order',  value: 2817,  pct: 4,  color: '#8B5CF6' },
];

const apiTrend = [
  { label: 'Oct', value: 820000  },
  { label: 'Nov', value: 940000  },
  { label: 'Dec', value: 1010000 },
  { label: 'Jan', value: 1080000 },
  { label: 'Feb', value: 1150000 },
  { label: 'Mar', value: 1240000 },
];

const platformKpis = [
  { label: 'Monthly Active Users', value: '2,847',  delta: '+12%', green: true  },
  { label: 'Agent Interactions',   value: '48,290', delta: '+28%', green: true  },
  { label: 'Avg Session Duration', value: '14.2m',  delta: '+3m',  green: true  },
  { label: 'Support Tickets',      value: '234',    delta: '−38%', green: true  },
];

const complianceTargets = [
  { label: 'FWA Attestation',  value: 87.4, target: 95, gap: 3253, color: '#F59E0B' },
  { label: 'License Current',  value: 96.8, target: 99, gap: 1371, color: '#F59E0B' },
  { label: 'DEA Registration', value: 94.1, target: 98, gap: 2527, color: '#F59E0B' },
  { label: 'Accreditation',    value: 91.2, target: 95, gap: 3770, color: '#F59E0B' },
];

const coverageStates = [
  { state: 'California',   count: 8420, pct: 99.1, status: 'Pass',   trend: '+2.1%', up: true  },
  { state: 'Texas',        count: 7180, pct: 98.7, status: 'Pass',   trend: '+1.8%', up: true  },
  { state: 'Florida',      count: 6340, pct: 97.3, status: 'Pass',   trend: '+3.2%', up: true  },
  { state: 'New York',     count: 5890, pct: 99.4, status: 'Pass',   trend: '+0.5%', up: true  },
  { state: 'Pennsylvania', count: 3980, pct: 96.8, status: 'Pass',   trend: '−0.3%', up: false },
  { state: 'Illinois',     count: 3750, pct: 97.1, status: 'Pass',   trend: '+1.2%', up: true  },
  { state: 'Ohio',         count: 4210, pct: 94.2, status: 'Review', trend: '−1.1%', up: false },
  { state: 'Montana',      count: 312,  pct: 88.4, status: 'Below',  trend: '−2.3%', up: false },
];

const statusCfg = {
  Pass:   { color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
  Review: { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  Below:  { color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
};

const periods = ['7 Days', '30 Days', 'Quarter', 'Year'];
const chartTabs = ['Net Change', 'Openings', 'Closures'];

export default function AnalyticsPage() {
  const [period, setPeriod]       = useState('30 Days');
  const [chartTab, setChartTab]   = useState('Net Change');

  return (
    <>
      <Topbar
        title="Analytics"
        subtitle="Network intelligence, compliance trends & pharmacy landscape insights"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ fontSize: 12 }}>Export PDF</button>
            <button className="btn-primary" style={{ gap: 5, fontSize: 12 }}>
              <IconDownload size={13} color="#fff"/> Download Data
            </button>
          </div>
        }
      />
      <main style={{ padding: '16px 20px 40px' }}>

        {/* ── Period selector ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Network Performance Overview</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>68,247 pharmacies · 50 states · Real-time data</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Period:</span>
            <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)', padding: 3, gap: 2 }}>
              {periods.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: period === p ? 'var(--brand-600)' : 'transparent',
                    color: period === p ? '#fff' : 'var(--text-muted)',
                    transition: 'all .15s',
                  }}
                >{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── KPI cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Total Network',    value: '68,247', sub: '+312 this month',        bar: 72,  color: '#4F46E5', delta: '+0.5%', green: true  },
            { label: 'Credential Score', value: 'A−',     sub: '↑ from B+ last quarter', bar: 87,  color: '#10B981', delta: '+1.3%', green: true  },
            { label: 'Network Adequacy', value: '97.2%',  sub: '48 / 50 states meet CMS', bar: 97, color: '#4F46E5', delta: '+0.4%', green: true  },
            { label: 'Profile Complete', value: '84%',    sub: '↑ 4% this quarter',      bar: 84,  color: '#F59E0B', delta: '+4%',   green: true  },
          ].map(k => (
            <div key={k.label} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>{k.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-.5px' }}>{k.value}</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: k.green ? '#059669' : '#DC2626', background: k.green ? '#ECFDF5' : '#FEE2E2', border: `1px solid ${k.green ? '#A7F3D0' : '#FECACA'}`, padding: '1px 7px', borderRadius: 6 }}>{k.delta}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>{k.sub}</div>
              <Progress value={k.bar} color={k.color} height={4}/>
            </div>
          ))}
        </div>

        {/* ── Row 1: Network Growth + Credential Status ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <Card>
            <CardHeader
              title="Network Growth"
              subtitle="Active pharmacies — rolling 6 months"
              action={<Badge variant="success" dot>+2.2%</Badge>}
              icon={<IconActivity size={14}/>}
            />
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginBottom: 8 }}>
                {chartTabs.map(t => (
                  <button key={t} onClick={() => setChartTab(t)} style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 8, border: '1px solid',
                    cursor: 'pointer',
                    background: chartTab === t ? '#EEF2FF' : 'transparent',
                    color: chartTab === t ? '#4F46E5' : 'var(--text-muted)',
                    borderColor: chartTab === t ? '#C7D2FE' : 'var(--border)',
                    transition: 'all .15s',
                  }}>{t}</button>
                ))}
              </div>
              <ReAreaChart
                data={networkTrend.map(d => ({ label: d.month, value: d.count }))}
                color="#4F46E5"
                height={150}
                yDomain={[65000, 69000]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Credential Status"
              subtitle="DEA · License · Accreditation · FWA"
              icon={<IconActivity size={14}/>}
            />
            <CardBody style={{ padding: '12px 16px 16px' }}>
              <RePieChart
                segments={credentialStatus}
                innerRadius={52}
                outerRadius={72}
                centerLabel="94.2%"
                centerSub="active"
              />
              {/* Legend */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
                {credentialStatus.map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }}/>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label} <strong style={{ color: 'var(--text-primary)' }}>{s.value.toLocaleString()}</strong></span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── Row 2: Coverage table + Pharmacy Types + Compliance Targets ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 14, marginBottom: 16 }}>

          <Card>
            <CardHeader title="Coverage by State" subtitle="CMS network adequacy — Q1 2026"/>
            <CardBody style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>State</th>
                    <th>Pharmacies</th>
                    <th>Adequacy</th>
                    <th>Status</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {coverageStates.map(r => {
                    const sc = statusCfg[r.status as keyof typeof statusCfg];
                    return (
                      <tr key={r.state}>
                        <td style={{ fontWeight: 600 }}>{r.state}</td>
                        <td>{r.count.toLocaleString()}</td>
                        <td style={{ fontWeight: 700 }}>{r.pct}%</td>
                        <td>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, padding: '2px 7px', borderRadius: 9999 }}>{r.status}</span>
                        </td>
                        <td style={{ fontSize: 12, fontWeight: 600, color: r.up ? '#10B981' : '#DC2626' }}>{r.trend}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="By Type" subtitle="Network composition"/>
            <CardBody style={{ padding: '10px 16px 16px' }}>
              <RePieChart
                segments={pharmacyTypes}
                innerRadius={38}
                outerRadius={58}
                centerLabel="68k"
                centerSub="total"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                {pharmacyTypes.map(t => (
                  <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, flexShrink: 0 }}/>
                    <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{t.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.value.toLocaleString()}</span>
                    <span style={{ color: 'var(--text-muted)', width: 28, textAlign: 'right' }}>{t.pct}%</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Compliance Targets" subtitle="vs CMS benchmarks — Q1"/>
            <CardBody style={{ padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {complianceTargets.map(c => (
                <div key={c.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{c.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: c.value >= 95 ? '#10B981' : c.value >= 90 ? '#D97706' : '#DC2626' }}>{c.value}%</span>
                  </div>
                  <Progress value={c.value} color={c.value >= 95 ? '#10B981' : c.value >= 90 ? '#D97706' : '#DC2626'} height={5}/>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10.5, color: 'var(--text-muted)' }}>
                    <span>Target: {c.target}%</span>
                    <span style={{ color: '#DC2626', fontWeight: 600 }}>Gap: {c.gap.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* ── Row 3: Volume bar chart ── */}
        <Card style={{ marginBottom: 16 }}>
          <CardHeader
            title="Volume by State"
            subtitle="Top 8 states — pharmacy count"
            action={<button className="btn-secondary" style={{ fontSize: 12 }}>Full Network Report</button>}
          />
          <CardBody>
            <ReBarChart
              data={stateBreakdown.map(s => ({ label: s.state, value: s.count, color: '#4F46E5' }))}
              height={140}
            />
          </CardBody>
        </Card>

        {/* ── Row 4: API Volume + Platform KPIs ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Card>
            <CardHeader
              title="API Call Volume"
              subtitle="Monthly REST + GraphQL requests"
              action={<Badge variant="brand" dot>+18% MoM</Badge>}
              icon={<IconActivity size={14}/>}
            />
            <CardBody>
              <ReAreaChart
                data={apiTrend}
                color="#06B6D4"
                height={140}
                valueFormatter={(v: number) => `${(v/1000000).toFixed(1)}M`}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Platform KPIs" subtitle="Operational metrics — 30 days"/>
            <CardBody style={{ padding: '8px 20px 20px' }}>
              {platformKpis.map((k, i) => (
                <div
                  key={k.label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 0',
                    borderBottom: i < platformKpis.length - 1 ? '1px solid var(--border-light)' : 'none',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{k.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{k.value}</span>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700,
                      color: '#059669', background: '#ECFDF5',
                      border: '1px solid #A7F3D0', padding: '2px 7px', borderRadius: 6,
                    }}>{k.delta}</span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}
