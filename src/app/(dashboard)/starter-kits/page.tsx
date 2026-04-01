'use client';
import React from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IconPlay, IconDownload, IconBook, IconUsers, IconArrowRight, IconChevronRight } from '@/components/ui/Icons';

const kits = [
  {
    role: 'PBM Network Director',
    persona: 'Sarah Chen',
    avatar: 'SC',
    gradient: 'linear-gradient(135deg, #2968B0, #3A7EC8)',
    desc: 'Manage pharmacy network compliance, coverage gaps, and contract renewals at scale.',
    agents: ['Network Analyzer', 'Compliance Watchdog', 'Pharmacy Finder', 'Change Tracker'],
    prompts: [
      'Show me all DEA registrations expiring in the next 30 days across my network',
      'Identify coverage gaps in rural California zip codes',
      'Find specialty pharmacies with URAC accreditation in Texas',
      'Which pharmacies had ownership changes in the last 90 days?',
      'Generate a network adequacy report for Q1 2026 CMS submission',
      'Flag any pharmacies with 3 or more compliance issues this quarter',
    ],
    workflows: [
      { label: 'Monthly Compliance Audit',      steps: 4, time: '~8 min' },
      { label: 'CMS Network Adequacy Filing',   steps: 5, time: '~15 min' },
      { label: 'DEA Renewal Campaign',          steps: 3, time: '~5 min' },
    ],
    tier: 'Enterprise',
  },
  {
    role: 'Compliance VP',
    persona: 'Michael Torres',
    avatar: 'MT',
    gradient: 'linear-gradient(135deg, #10B981, #06B6D4)',
    desc: 'Automate regulatory reporting, FWA risk detection, and No Surprises Act filings.',
    agents: ['Compliance Watchdog', 'FWA Risk Scoring', 'No Surprises Assistant', 'Custom Report Builder'],
    prompts: [
      'Run a complete FWA risk scan on pharmacies that missed attestation deadline',
      'Generate the Q1 No Surprises Act CMS filing for our primary PBM network',
      'Show all pharmacies flagged for fraud risk in the last 6 months',
      'Which states are below 90% network adequacy threshold?',
      'Create a compliance scorecard for board presentation',
      'Alert me when any pharmacy DEA expires in my network',
    ],
    workflows: [
      { label: 'FWA Attestation Campaign',       steps: 3, time: '~10 min' },
      { label: 'No Surprises Act Quarterly Filing', steps: 5, time: '~20 min' },
      { label: 'Executive Compliance Report',    steps: 2, time: '~3 min' },
    ],
    tier: 'Professional',
  },
  {
    role: 'Data Analyst',
    persona: 'Priya Patel',
    avatar: 'PP',
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    desc: 'Explore pharmacy data, build custom analyses, and export structured datasets.',
    agents: ['Custom Report Builder', 'Analytics Agent', 'Pharmacy Finder', 'Data Quality Agent'],
    prompts: [
      'Export all specialty pharmacies in CA, TX, FL with their accreditation status as CSV',
      'Show pharmacy growth trends by state for the last 12 months',
      'Compare retail vs specialty pharmacy counts by region',
      'What is the average DEA renewal rate across networks?',
      'Find all pharmacies opened after January 2024 with their NCPDP IDs',
      'Build a pivot table of pharmacy types by state',
    ],
    workflows: [
      { label: 'Monthly Analytics Report',      steps: 3, time: '~6 min' },
      { label: 'State-Level Coverage Analysis',  steps: 4, time: '~8 min' },
      { label: 'Custom Data Export Pipeline',    steps: 2, time: '~4 min' },
    ],
    tier: 'Professional',
  },
  {
    role: 'IT / Integration Engineer',
    persona: 'David Kim',
    avatar: 'DK',
    gradient: 'linear-gradient(135deg, #3A7EC8, #0EA5E9)',
    desc: 'Set up API integrations, configure webhooks, and automate data pipelines.',
    agents: ['API Agent', 'Data Delivery Agent', 'Webhook Manager', 'Integration Assistant'],
    prompts: [
      'Show me the REST endpoint for bulk pharmacy lookup with authentication example',
      'How do I set up a daily delta feed for pharmacy credential changes?',
      'Generate a Python script to pull all expiring DEA registrations via API',
      'What are the GraphQL schema fields for pharmacy profiles?',
      'Configure a webhook to notify our system when a pharmacy in our network closes',
      'Migrate our SFTP batch job to the REST API — what is the equivalent endpoint?',
    ],
    workflows: [
      { label: 'REST API Integration Setup',    steps: 4, time: '~12 min' },
      { label: 'SFTP to API Migration Guide',   steps: 6, time: '~25 min' },
      { label: 'Webhook Configuration',         steps: 3, time: '~8 min' },
    ],
    tier: 'Enterprise',
  },
];

const tierBadge = (tier: string) => tier === 'Enterprise'
  ? <Badge variant="brand">Enterprise</Badge>
  : <Badge variant="info">Professional</Badge>;

export default function StarterKitsPage() {
  return (
    <>
      <Topbar
        title="Starter Kits"
        subtitle="Role-based prompt libraries & workflows — get up to speed in minutes"
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary" style={{ fontSize: 12, gap: 5 }}>
              <IconDownload size={13}/> Download All Kits
            </button>
          </div>
        }
      />
      <main style={{ padding: '16px 20px 40px' }}>

        {/* Intro banner */}
        <div style={{
          marginBottom: 16, padding: '16px 20px',
          background: 'var(--surface-2)',
          borderRadius: 14, border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Jump-start your AI workflow</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Each kit includes curated prompts, recommended agents, and step-by-step workflows tailored to your role.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#2968B0' }}>4</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Roles</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }}/>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#34D399' }}>24</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Prompts</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }}/>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#F59E0B' }}>12</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Workflows</div>
            </div>
          </div>
        </div>

        {/* Kit cards — 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {kits.map(kit => (
            <Card key={kit.role} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Kit header */}
              <div style={{
                padding: '20px 20px 16px',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: kit.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, color: '#fff',
                }}>
                  {kit.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{kit.role}</span>
                    {tierBadge(kit.tier)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{kit.desc}</div>
                </div>
              </div>

              <CardBody style={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Agents */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Recommended Agents</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {kit.agents.map(a => (
                      <span key={a} style={{
                        fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 4,
                        background: '#F0F7FF', color: '#2968B0',
                      }}>{a}</span>
                    ))}
                  </div>
                </div>

                {/* Prompts */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Sample Prompts</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {kit.prompts.slice(0, 4).map(p => (
                      <div
                        key={p}
                        style={{
                          padding: '7px 12px', borderRadius: 8, fontSize: 12,
                          color: 'var(--text-secondary)', background: 'var(--surface-2)',
                          border: '1px solid var(--border-light)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 8,
                          transition: 'border-color .15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#B8D5F5')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-light)')}
                      >
                        <span style={{ color: '#5B9BD5', flexShrink: 0, fontSize: 12 }}>›</span>
                        {p}
                      </div>
                    ))}
                    {kit.prompts.length > 4 && (
                      <div style={{ fontSize: 12, color: '#2968B0', fontWeight: 600, paddingLeft: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        +{kit.prompts.length - 4} more prompts <IconChevronRight size={11}/>
                      </div>
                    )}
                  </div>
                </div>

                {/* Workflows */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Guided Workflows</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {kit.workflows.map(w => (
                      <div
                        key={w.label}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                          borderRadius: 8, border: '1px solid var(--border-light)', cursor: 'pointer',
                          background: 'var(--surface-2)',
                        }}
                      >
                        <div style={{ width: 24, height: 24, borderRadius: 7, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <IconPlay size={10} color="#059669"/>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{w.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{w.steps} steps · {w.time}</div>
                        </div>
                        <IconArrowRight size={13} color="var(--text-muted)"/>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 4 }}>
                  <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12, gap: 5 }}>
                    <IconPlay size={12} color="#fff"/> Start Kit
                  </button>
                  <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12, gap: 5 }}>
                    <IconDownload size={12}/> Download PDF
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 14, padding: '14px 20px', borderRadius: 14,
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Need a custom starter kit for your team?</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>NCPDP solution engineers can build role-specific kits tailored to your workflows.</div>
          </div>
          <button className="btn-primary" style={{ fontSize: 12, gap: 5 }}>
            <IconUsers size={13} color="#fff"/> Contact Solutions Team
          </button>
        </div>
      </main>
    </>
  );
}
