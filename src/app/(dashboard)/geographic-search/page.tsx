'use client';
import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FieldLabel, TextInput, Select, MultiSelect, DateRange, Accordion } from '@/components/ui/FormFields';
import { IconSearch, IconRefresh, IconDownload, IconSparkles, IconGlobe } from '@/components/ui/Icons';
import { AgentChat } from '@/components/ui/AgentChat';
import { DISPENSER_CLASSES, PROVIDER_TYPES, RELATIONSHIPS, US_STATES, SERVICES } from '@/lib/filter-options';

const GEO_DATA = [
  { state: 'California',   code: 'CA', total: 9842, required: 9500, coverage: 103.6, status: 'pass',   gap: 0   },
  { state: 'Texas',        code: 'TX', total: 8231, required: 8000, coverage: 102.9, status: 'pass',   gap: 0   },
  { state: 'Florida',      code: 'FL', total: 6184, required: 6000, coverage: 103.1, status: 'pass',   gap: 0   },
  { state: 'New York',     code: 'NY', total: 5492, required: 5500, coverage:  99.9, status: 'review', gap: 8   },
  { state: 'Pennsylvania', code: 'PA', total: 4103, required: 4200, coverage:  97.7, status: 'review', gap: 97  },
  { state: 'Illinois',     code: 'IL', total: 3987, required: 4000, coverage:  99.7, status: 'review', gap: 13  },
  { state: 'Ohio',         code: 'OH', total: 3741, required: 3800, coverage:  98.4, status: 'review', gap: 59  },
  { state: 'Michigan',     code: 'MI', total: 2983, required: 3100, coverage:  96.2, status: 'below',  gap: 117 },
  { state: 'Montana',      code: 'MT', total:  412, required:  500, coverage:  82.4, status: 'below',  gap: 88  },
  { state: 'Wyoming',      code: 'WY', total:  218, required:  280, coverage:  77.9, status: 'below',  gap: 62  },
  { state: 'North Dakota', code: 'ND', total:  287, required:  320, coverage:  89.7, status: 'below',  gap: 33  },
  { state: 'South Dakota', code: 'SD', total:  301, required:  330, coverage:  91.2, status: 'review', gap: 29  },
];

export default function GeographicSearchPage() {
  const [searched, setSearched] = useState(true);
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <>
      <Topbar
        title="Geographic Search"
        subtitle="Network adequacy analysis and geographic pharmacy coverage"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" onClick={() => setAgentOpen(o => !o)} style={{ fontSize: 12, gap: 5 }}>
              <IconSparkles size={14}/> {agentOpen ? 'Hide' : 'Ask'} Agent
            </button>
            <button className="btn-secondary" style={{ fontSize: 12, gap: 5 }}>
              <IconDownload size={13}/> Export
            </button>
          </div>
        }
      />
      <main style={{ display: 'flex', height: `calc(100vh - var(--topbar-h))`, padding: '0 20px' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>

          {/* Filter form — matching legacy Geographic Search */}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ padding: '14px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Geographic Filter</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>Filter pharmacies by location and classification to analyze coverage</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" onClick={() => setSearched(true)} style={{ gap: 6, fontSize: 12, padding: '8px 24px' }}>
                  <IconSearch size={13} color="#fff"/> Search
                </button>
                <button className="btn-secondary" style={{ gap: 6, fontSize: 12, padding: '8px 20px' }}>
                  <IconRefresh size={13}/> Reset
                </button>
              </div>
            </div>
            <CardBody style={{ padding: '16px 20px 20px' }}>
              <Accordion title="Search Criteria" defaultOpen>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><FieldLabel>Pharmacy DBA Name</FieldLabel><TextInput placeholder="Pharmacy DBA Name"/></div>
                  <div><FieldLabel>Address</FieldLabel><TextInput placeholder="Address"/></div>
                  <div><FieldLabel>Store Number</FieldLabel><TextInput placeholder="Store Number"/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div><FieldLabel>City</FieldLabel><TextInput placeholder="City"/></div>
                  <div><FieldLabel>State</FieldLabel><MultiSelect options={US_STATES} height={88}/></div>
                  <div><FieldLabel>ZIP</FieldLabel><TextInput placeholder="ZIP Code"/></div>
                </div>
              </Accordion>
              <Accordion title="Classification">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div><FieldLabel>Dispenser Class</FieldLabel><MultiSelect options={DISPENSER_CLASSES} height={88}/></div>
                  <div><FieldLabel>Provider Type</FieldLabel><MultiSelect options={PROVIDER_TYPES} height={88}/></div>
                  <div><FieldLabel>Relationship</FieldLabel><MultiSelect options={RELATIONSHIPS} height={88}/></div>
                </div>
              </Accordion>
              <Accordion title="Date Ranges & Status">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <DateRange label="Open Date"/>
                  <DateRange label="Close Date"/>
                  <div><FieldLabel>Status</FieldLabel><Select><option>Active</option><option>Inactive</option><option>All</option></Select></div>
                </div>
              </Accordion>
            </CardBody>
          </Card>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'States Meeting Adequacy', value: '3',   color: '#76C799', sub: 'coverage >= 100%' },
              { label: 'States Needing Review',   value: '5',   color: '#F59E0B', sub: 'coverage 90-99%'  },
              { label: 'Below Threshold',         value: '4',   color: '#EF4444', sub: 'coverage < 90%'   },
              { label: 'Total Network Gap',       value: '466', color: '#005C8D', sub: 'pharmacies needed' },
            ].map(s => (
              <Card key={s.label}>
                <CardBody style={{ padding: '14px 18px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{s.sub}</div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Results table */}
          <Card>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>Network Adequacy by State</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Select style={{ width: 'auto', fontSize: 12, padding: '4px 8px' }}>
                  <option>All Relationships</option><option>CVS CAREMARK</option><option>EXPRESS SCRIPTS</option><option>OPTUMRX</option>
                </Select>
                <button className="btn-secondary" style={{ fontSize: 12, gap: 4 }}><IconDownload size={12}/> Export</button>
              </div>
            </div>
            <CardBody style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    {['State','Code','Active Pharmacies','Required','Coverage %','Gap','Status'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {GEO_DATA.map(r => (
                    <tr key={r.code}>
                      <td style={{ fontWeight: 500 }}>{r.state}</td>
                      <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#005C8D', fontSize: 12 }}>{r.code}</td>
                      <td>{r.total.toLocaleString()}</td>
                      <td>{r.required.toLocaleString()}</td>
                      <td style={{ fontWeight: 600, color: r.coverage >= 100 ? '#76C799' : r.coverage >= 90 ? '#D97706' : '#DC2626' }}>
                        {r.coverage.toFixed(1)}%
                      </td>
                      <td style={{ color: r.gap === 0 ? '#CBD5E1' : '#DC2626', fontWeight: r.gap > 0 ? 600 : 400 }}>
                        {r.gap === 0 ? '\u2014' : `+${r.gap} needed`}
                      </td>
                      <td>
                        {r.status === 'pass'   && <Badge variant="success">Pass</Badge>}
                        {r.status === 'review' && <Badge variant="warning">Review</Badge>}
                        {r.status === 'below'  && <Badge variant="danger">Below</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>

        {agentOpen && (
          <AgentChat
            agentName="Network Analyzer"
            agentId="AGT-03"
            gradient="linear-gradient(135deg,#76C799,#449055)"
            icon={<IconGlobe size={18} color="#fff"/>}
            welcomeMessage="Hi Sarah! I'm your Network Analyzer Agent. I can analyze geographic coverage, identify pharmacy deserts, and generate network adequacy reports for regulatory. What coverage area should I analyze?"
            suggestions={[
              'Identify coverage gaps in rural California zip codes',
              'Which states are below 90% network adequacy threshold?',
              'Show specialty pharmacy deserts in the midwest',
              'Generate a network adequacy report for regulatory submission',
              'Find all counties without a 24/7 pharmacy within 15 miles',
            ]}
          />
        )}
      </main>
    </>
  );
}
