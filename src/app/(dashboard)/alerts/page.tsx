'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertItem } from '@/components/dashboard/AlertItem';
import { alerts } from '@/lib/mockData';
import {
  IconAlertTriangle, IconBell, IconInfo, IconCheck, IconShieldCheck,
  IconZap, IconMessageSquare, IconGlobe, IconRefresh,
} from '@/components/ui/Icons';

const filters = ['All', 'Critical', 'Warning', 'Info', 'Unread'];

const summaryCards = [
  { label: 'Critical',  count: 2,   color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', Icon: IconAlertTriangle },
  { label: 'Warning',   count: 18,  color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', Icon: IconBell           },
  { label: 'Info',      count: 27,  color: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE', Icon: IconInfo           },
  { label: 'Resolved',  count: 142, color: '#059669', bg: '#D1FAE5', border: '#A7F3D0', Icon: IconCheck          },
];

const deliveryChannels = [
  { label: 'Email',   Icon: IconMessageSquare, active: true  },
  { label: 'Slack',   Icon: IconZap,           active: true  },
  { label: 'SMS',     Icon: IconGlobe,         active: false },
  { label: 'Webhook', Icon: IconRefresh,       active: false },
];

const alertConfig = [
  { label: 'DEA Expiration',        desc: '30-day & 7-day warnings',  on: true  },
  { label: 'License Expiration',    desc: '90-day & 30-day warnings', on: true  },
  { label: 'FWA Risk Score',        desc: 'When score exceeds 8.0',   on: true  },
  { label: 'Pharmacy Closure',      desc: 'Same-day notification',    on: true  },
  { label: 'Ownership Changes',     desc: 'Contract renegotiation',   on: false },
  { label: 'Network Adequacy Drop', desc: 'Below threshold alerts',   on: false },
];

export default function AlertsPage() {
  const [activeFilter, setActiveFilter]   = useState('All');
  const [toggles, setToggles]             = useState(alertConfig.map(c => c.on));

  const filtered = alerts.filter(a => {
    if (activeFilter === 'All')    return true;
    if (activeFilter === 'Unread') return !a.read;
    return a.severity === activeFilter.toLowerCase();
  });

  function toggle(i: number) {
    setToggles(prev => prev.map((v, idx) => idx === i ? !v : v));
  }

  return (
    <>
      <Topbar
        title="Alerts Center"
        subtitle="Real-time compliance & credential monitoring"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ fontSize: 12 }}>Configure Alerts</button>
            <button className="btn-primary" style={{ fontSize: 12 }}>Mark All Read</button>
          </div>
        }
      />
      <main style={{ padding: '16px 20px 40px' }}>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
          {summaryCards.map(c => (
            <button
              key={c.label}
              onClick={() => setActiveFilter(c.label === 'Resolved' ? 'All' : c.label)}
              className="card"
              style={{
                padding: '16px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                background: activeFilter === c.label ? c.bg : 'var(--surface)',
                border: activeFilter === c.label ? `1px solid ${c.border}` : '1px solid var(--border)',
                textAlign: 'left', width: '100%',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: c.bg, border: `1px solid ${c.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <c.Icon size={18} color={c.color}/>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.count}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>{c.label}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 12 }}>

          {/* Alert list */}
          <Card>
            <CardHeader
              title="Alert Inbox"
              badge={<Badge variant="danger">{alerts.filter(a => !a.read).length} unread</Badge>}
              action={
                <div style={{ display: 'flex', gap: 4 }}>
                  {filters.map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      style={{
                        fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 4,
                        cursor: 'pointer',
                        background: activeFilter === f ? 'var(--brand-600)' : 'transparent',
                        color: activeFilter === f ? '#fff' : 'var(--text-muted)',
                        borderColor: activeFilter === f ? 'var(--brand-600)' : 'var(--border)',
                        transition: 'all .15s',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              }
            />
            <CardBody style={{ padding: '0 16px 8px' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <IconShieldCheck size={28} color="var(--border)"/>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 12 }}>No alerts in this category</div>
                </div>
              ) : (
                filtered.map(a => <AlertItem key={a.id} {...a}/>)
              )}
            </CardBody>
          </Card>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Alert Config */}
            <Card>
              <CardHeader title="Alert Configuration" subtitle="Customize notifications"/>
              <CardBody style={{ padding: '8px 16px 16px' }}>
                {alertConfig.map(({ label, desc }, i) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 0', borderBottom: i < alertConfig.length - 1 ? '1px solid var(--border-light)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                    </div>
                    <button
                      onClick={() => toggle(i)}
                      style={{
                        width: 36, height: 20, borderRadius: 9999, border: 'none',
                        background: toggles[i] ? 'var(--brand-600)' : 'var(--border)',
                        position: 'relative', cursor: 'pointer', flexShrink: 0,
                        transition: 'background .2s',
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: 2,
                        left: toggles[i] ? 18 : 2,
                        width: 16, height: 16, borderRadius: '50%',
                        background: '#fff', transition: 'left .2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                      }}/>
                    </button>
                  </div>
                ))}
              </CardBody>
            </Card>

            {/* Delivery Channels */}
            <Card>
              <CardHeader title="Delivery Channels"/>
              <CardBody style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {deliveryChannels.map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <c.Icon size={14} color={c.active ? 'var(--brand-600)' : 'var(--text-muted)'}/>
                      {c.label}
                    </span>
                    <Badge variant={c.active ? 'success' : 'neutral'} dot={c.active}>
                      {c.active ? 'Active' : 'Off'}
                    </Badge>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
