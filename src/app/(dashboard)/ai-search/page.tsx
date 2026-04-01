'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/Badge';
import {
  IconSend, IconLogoBrain, IconSparkles, IconDatabase, IconShield, IconSearch,
  IconBarChart, IconNetwork, IconReport, IconZap, IconCheck, IconBot,
  IconBell, IconGlobe, IconStore, IconLock, IconRefresh, IconExternalLink,
  IconAlertTriangle, IconUser,
} from '@/components/ui/Icons';
import { pharmacyResults, agents, alerts, complianceMetrics, stateBreakdown } from '@/lib/mockData';

/* ── Types ─────────────────────────────────────────────────────────── */
interface Message {
  role: 'user' | 'assistant';
  text: string;
  time: string;
  agent?: { name: string; color: string };
  data?: React.ReactNode;
}

/* ── Agent detection ──────────────────────────────────────────────── */
function detectAgent(input: string) {
  const l = input.toLowerCase();
  if (l.includes('dea') || l.includes('expir') || l.includes('licen') || l.includes('creden'))
    return { name: 'Compliance Watchdog', color: '#DC2626' };
  if (l.includes('fwa') || l.includes('fraud') || l.includes('waste') || l.includes('risk'))
    return { name: 'FWA Risk Scoring', color: '#D97706' };
  if (l.includes('closure') || l.includes('closed'))
    return { name: 'Change Tracker', color: '#4F46E5' };
  if (l.includes('network') || l.includes('adequacy') || l.includes('coverage') || l.includes('gap'))
    return { name: 'Network Analyzer', color: '#059669' };
  if (l.includes('ownership') || l.includes('contract') || l.includes('transfer'))
    return { name: 'Contract Intelligence', color: '#8B5CF6' };
  if (l.includes('report') || l.includes('export') || l.includes('generat'))
    return { name: 'Custom Report Builder', color: '#06B6D4' };
  if (l.includes('compliance') || l.includes('audit') || l.includes('score'))
    return { name: 'Compliance Watchdog', color: '#DC2626' };
  if (l.includes('no surprise') || l.includes('nsa') || l.includes('cms'))
    return { name: 'No Surprises Assistant', color: '#10B981' };
  if (l.includes('alert') || l.includes('critical') || l.includes('urgent'))
    return { name: 'Compliance Watchdog', color: '#DC2626' };
  if (l.includes('agent') || l.includes('top') || l.includes('most used'))
    return { name: 'NCPDP Buddy', color: '#4F46E5' };
  if (l.includes('api') || l.includes('usage') || l.includes('call'))
    return { name: 'Subscriber Insight', color: '#06B6D4' };
  if (l.includes('find') || l.includes('search') || l.includes('look') || l.includes('pharmacy') || l.includes('show'))
    return { name: 'Pharmacy Finder', color: '#4F46E5' };
  if (l.includes('predict') || l.includes('desert') || l.includes('forecast'))
    return { name: 'Closure Prediction', color: '#8B5CF6' };
  if (l.includes('state') || l.includes('geographic') || l.includes('map'))
    return { name: 'Network Analyzer', color: '#059669' };
  if (l.includes('batch') || l.includes('download') || l.includes('bulk'))
    return { name: 'Batch Optimizer', color: '#10B981' };
  if (l.includes('onboard') || l.includes('setup') || l.includes('start'))
    return { name: 'Onboarding Agent', color: '#06B6D4' };
  return { name: 'NCPDP Buddy', color: '#4F46E5' };
}

/* ── Response builder ─────────────────────────────────────────────── */
function buildReply(input: string): { text: string; data?: React.ReactNode } {
  const l = input.toLowerCase();

  if (l.includes('dea') || l.includes('expir') || l.includes('creden')) {
    const results = pharmacyResults.filter(p => p.dea === 'Expiring' || p.dea === 'Expired');
    return {
      text: `Found **${results.length} pharmacies** with DEA credential issues across your network. TX leads with 482 affected, followed by CA (371) and FL (298).`,
      data: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.map(p => (
            <div key={p.id} style={{ padding: '11px 14px', borderRadius: 10, background: '#FAFBFF', border: '1px solid #EEF1F8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                <Badge variant={p.dea === 'Expired' ? 'danger' : 'warning'}>DEA {p.dea}</Badge>
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 3 }}>{p.city}, {p.state} · NPI: {p.npi} · {p.networks} network{p.networks !== 1 ? 's' : ''} affected</div>
            </div>
          ))}
          <div style={{ padding: '9px 14px', borderRadius: 10, background: '#FAFBFF', border: '1px solid #EEF1F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>Total affected across all states: <strong style={{ color: '#DC2626' }}>1,151</strong></span>
            <button className="btn-primary" style={{ fontSize: 11, padding: '4px 14px' }}>Export Full List</button>
          </div>
        </div>
      ),
    };
  }

  if (l.includes('fwa') || l.includes('fraud') || l.includes('risk')) {
    return {
      text: `FWA Risk Scoring agent identified **6 pharmacies** with elevated risk scores (>= 8.5/10) this quarter. Top 3 flagged for immediate review:`,
      data: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { name: 'Sunrise Drugs LLC', city: 'Las Vegas, NV', score: 9.2, flags: ['Billing anomaly', 'High refill rate'] },
            { name: 'FastRx Pharmacy',   city: 'Miami, FL',     score: 8.8, flags: ['Dispensing pattern', 'Ownership change'] },
            { name: 'QuickMeds #2041',   city: 'Houston, TX',   score: 8.6, flags: ['DEA mismatch'] },
          ].map((p, i) => (
            <div key={i} style={{ padding: '11px 14px', borderRadius: 10, background: '#FFFBF5', border: '1px solid #FDE68A', borderLeft: '3px solid #F59E0B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                <Badge variant="warning">Risk {p.score}</Badge>
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 3 }}>{p.city} · {p.flags.join(' · ')}</div>
            </div>
          ))}
        </div>
      ),
    };
  }

  if (l.includes('compliance') || l.includes('audit') || l.includes('score')) {
    return {
      text: `Compliance dashboard summary — overall score: **94/100**. All critical standards met. 2 areas need review before Apr 30 audit:`,
      data: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {complianceMetrics.map(m => {
            const isWarn = m.status === 'warning';
            return (
              <div key={m.label} style={{ padding: '11px 14px', borderRadius: 10, background: isWarn ? '#FFFBF5' : '#F0FDF4', border: `1px solid ${isWarn ? '#FDE68A' : '#A7F3D0'}`, borderLeft: `3px solid ${isWarn ? '#F59E0B' : '#10B981'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{m.label}</span>
                  <Badge variant={isWarn ? 'warning' : 'success'}>{m.score}%</Badge>
                </div>
                <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{m.detail}</div>
              </div>
            );
          })}
        </div>
      ),
    };
  }

  if (l.includes('network') || l.includes('adequacy') || l.includes('coverage') || l.includes('state') || l.includes('geographic')) {
    return {
      text: `Network analysis across 8 monitored states. Overall adequacy: **94.2%** — above CMS minimum of 90%. 2 states need attention:`,
      data: (
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #EEF1F8' }}>
          <table className="data-table" style={{ margin: 0 }}>
            <thead><tr><th>State</th><th>Pharmacies</th><th>Adequacy</th><th>Status</th></tr></thead>
            <tbody>
              {stateBreakdown.map(s => (
                <tr key={s.state}>
                  <td style={{ fontWeight: 700 }}>{s.state}</td>
                  <td>{s.count.toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>{s.pct}%</td>
                  <td><Badge variant={s.pct >= 80 ? 'success' : s.pct >= 60 ? 'warning' : 'danger'}>{s.pct >= 80 ? 'Pass' : s.pct >= 60 ? 'Review' : 'Fail'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    };
  }

  if (l.includes('closure') || l.includes('closed')) {
    return {
      text: `Change Tracker detected **3 pharmacy closures** this week. 2 impact active network contracts:`,
      data: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { name: 'Park Ave Pharmacy', city: 'New York, NY', date: 'Mar 29', networks: 2, impact: 'High' },
            { name: 'Sunset Drugs',      city: 'Phoenix, AZ',  date: 'Mar 28', networks: 1, impact: 'Medium' },
            { name: 'Family Care Rx',    city: 'Dallas, TX',   date: 'Mar 27', networks: 0, impact: 'None' },
          ].map((p, i) => (
            <div key={i} style={{ padding: '11px 14px', borderRadius: 10, background: '#FAFBFF', border: '1px solid #EEF1F8', borderLeft: `3px solid ${p.impact === 'High' ? '#DC2626' : p.impact === 'Medium' ? '#F59E0B' : '#94A3B8'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                <Badge variant={p.impact === 'High' ? 'danger' : p.impact === 'Medium' ? 'warning' : 'neutral'}>{p.impact}</Badge>
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{p.city} · Closed {p.date} · {p.networks} network{p.networks !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      ),
    };
  }

  if (l.includes('alert') || l.includes('critical') || l.includes('urgent')) {
    return {
      text: `There are **${alerts.filter(a => a.severity === 'critical').length} critical alerts** requiring immediate action, plus ${alerts.filter(a => a.severity === 'warning').length} warnings:`,
      data: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {alerts.map(a => (
            <div key={a.id} style={{ padding: '11px 14px', borderRadius: 10, background: '#FAFBFF', border: '1px solid #EEF1F8', borderLeft: `3px solid ${a.severity === 'critical' ? '#DC2626' : a.severity === 'warning' ? '#F59E0B' : '#3B82F6'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{a.title}</span>
                <Badge variant={a.severity === 'critical' ? 'danger' : a.severity === 'warning' ? 'warning' : 'info'}>{a.severity}</Badge>
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{a.pharmacy} · {a.location} · {a.time}</div>
            </div>
          ))}
        </div>
      ),
    };
  }

  if (l.includes('agent') || l.includes('top') || l.includes('most used')) {
    const top = agents.slice(0, 6);
    return {
      text: `Your **top 6 most-used agents** this month, totaling ${top.reduce((a, b) => a + b.uses, 0).toLocaleString()} interactions:`,
      data: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {top.map((a, i) => (
            <div key={a.id} style={{ padding: '10px 14px', borderRadius: 10, background: '#FAFBFF', border: '1px solid #EEF1F8', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#C7D2FE', width: 20 }}>#{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#111827' }}>{a.name}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{a.category}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5' }}>{a.uses.toLocaleString()}</span>
            </div>
          ))}
        </div>
      ),
    };
  }

  if (l.includes('api') || l.includes('usage') || l.includes('call')) {
    return {
      text: `API usage is **up 18% month-over-month** with 1.24M calls today. REST endpoints drive 67% of traffic.`,
      data: (
        <div style={{ padding: '14px 16px', borderRadius: 10, background: '#FAFBFF', border: '1px solid #EEF1F8' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0284C7', marginBottom: 8 }}>API Usage — March 2026</div>
          {[
            ['Calls Today', '1.24M'], ['Monthly Total', '28.4M'], ['REST Calls', '19.1M (67%)'],
            ['GraphQL Calls', '9.3M (33%)'], ['Avg Response Time', '48ms'], ['Error Rate', '0.02%'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
            </div>
          ))}
        </div>
      ),
    };
  }

  if (l.includes('no surprise') || l.includes('nsa') || l.includes('cms')) {
    return {
      text: `No Surprises Act: **38,569 pharmacies** validated for Q1 2026. 47 require manual fixes before Apr 15 deadline. Readiness: 99.1%.`,
      data: (
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Pass', count: '38,210', color: '#059669', bg: '#F0FDF4', border: '#A7F3D0' },
            { label: 'Warnings', count: '312', color: '#D97706', bg: '#FFFBF5', border: '#FDE68A' },
            { label: 'Failures', count: '47', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, padding: '14px', borderRadius: 10, textAlign: 'center', background: s.bg, border: `1px solid ${s.border}` }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      ),
    };
  }

  if (l.includes('report') || l.includes('export') || l.includes('generat')) {
    return {
      text: `Custom Report Builder is ready. Based on your query, I suggest a **Credential Expiry Report** for Q1 2026 covering 68,247 records.`,
      data: (
        <div style={{ padding: '14px 16px', borderRadius: 10, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#2563EB', marginBottom: 8 }}>Suggested Report Config</div>
          {[
            ['Report Type', 'DEA Expiry — Q1 2026'], ['Date Range', 'Jan 1 – Mar 31, 2026'],
            ['Scope', 'All 68,247 pharmacies'], ['Est. Records', '~1,180 matches'], ['Formats', 'PDF, Excel, CSV'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0', borderBottom: '1px solid rgba(191,219,254,.5)' }}>
              <span style={{ color: '#64748B' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
            </div>
          ))}
          <button className="btn-primary" style={{ width: '100%', marginTop: 10, justifyContent: 'center', fontSize: 12.5 }}>Generate Report Now</button>
        </div>
      ),
    };
  }

  if (l.includes('ownership') || l.includes('contract') || l.includes('transfer')) {
    return {
      text: `Contract Intelligence detected **4 ownership changes** this month. 2 are high priority requiring contract renegotiation:`,
      data: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { name: 'Green Valley Pharmacy', city: 'Seattle, WA', date: 'Mar 5', priority: 'High', networks: 3 },
            { name: 'Metro Drugs LLC',       city: 'Nashville, TN', date: 'Feb 28', priority: 'High', networks: 2 },
            { name: 'Pacific Health Rx',     city: 'San Diego, CA', date: 'Feb 20', priority: 'Low', networks: 1 },
            { name: 'Sunrise Holdings #3',   city: 'Phoenix, AZ', date: 'Feb 15', priority: 'Low', networks: 1 },
          ].map((p, i) => (
            <div key={i} style={{ padding: '11px 14px', borderRadius: 10, background: p.priority === 'High' ? '#FAF5FF' : '#FAFBFF', border: `1px solid ${p.priority === 'High' ? '#DDD6FE' : '#EEF1F8'}`, borderLeft: `3px solid ${p.priority === 'High' ? '#8B5CF6' : '#94A3B8'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                <Badge variant={p.priority === 'High' ? 'brand' : 'neutral'}>{p.priority}</Badge>
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{p.city} · {p.date} · {p.networks} contract{p.networks !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      ),
    };
  }

  if (l.includes('find') || l.includes('search') || l.includes('look') || l.includes('pharmacy') || l.includes('show')) {
    return {
      text: `Searched **68,247 pharmacy records**. Here are results matching your query:`,
      data: (
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #EEF1F8' }}>
          <table className="data-table" style={{ margin: 0 }}>
            <thead><tr><th>Pharmacy</th><th>City</th><th>Type</th><th>DEA</th><th>Networks</th></tr></thead>
            <tbody>
              {pharmacyResults.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.city}, {p.state}</td>
                  <td>{p.type}</td>
                  <td><Badge variant={p.dea === 'Active' ? 'success' : p.dea === 'Expiring' ? 'warning' : 'danger'}>{p.dea}</Badge></td>
                  <td>{p.networks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    };
  }

  return {
    text: `I have real-time access to **68,247 pharmacy records** across all 50 states, connected to all dataQ.ai tools and 33 specialized agents.\n\nI can help you with:\n\n• **WebConnect** — pharmacy search, profiles, credential verification\n• **Compliance** — DEA, license, FWA, No Surprises Act auditing\n• **Network Analysis** — adequacy scoring, coverage gaps, state breakdown\n• **Alerts** — real-time credential and compliance monitoring\n• **Reports** — on-demand custom report generation\n• **Agent Library** — run any of our 33 AI agents from here\n• **CHOW Tracker** — ownership change monitoring\n• **Batch Downloads** — bulk data export\n\nTry asking: *"Show pharmacies with DEA expiring"* or *"What's our compliance score?"*`,
  };
}

/* ── Helpers ───────────────────────────────────────────────────────── */
function now() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

function renderText(text: string) {
  return text.split('**').map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ fontWeight: 700 }}>{part}</strong>
      : part.split('\n').map((line, j) => <span key={`${i}-${j}`}>{line}{j < part.split('\n').length - 1 && <br/>}</span>)
  );
}

/* ── Category tabs with FAQ questions ─────────────────────────────── */
interface Category {
  key: string;
  label: string;
  Icon: React.ElementType;
  accent: string;
  questions: string[];
}

const CATEGORIES: Category[] = [
  {
    key: 'webconnect', label: 'WebConnect', Icon: IconSearch, accent: '#4F46E5',
    questions: [
      'Find all specialty pharmacies in California',
      'Look up pharmacy by NCPDP ID 1234567',
      'Show 24/7 pharmacies near Houston, TX',
      'List compounding pharmacies with URAC accreditation',
      'Search for pharmacies with drive-through service',
    ],
  },
  {
    key: 'ondemand', label: 'OnDemand Query', Icon: IconReport, accent: '#2563EB',
    questions: [
      'Generate a DEA expiry report for Q1 2026',
      'Export all specialty pharmacies as Excel',
      'Build a network coverage report for the Southwest',
      'Generate monthly compliance summary as PDF',
      'Create a custom dataset of LTC pharmacies by state',
    ],
  },
  {
    key: 'nosurprises', label: 'No Surprises', Icon: IconShield, accent: '#059669',
    questions: [
      'What is our No Surprises Act filing status?',
      'How many pharmacies need NSA validation fixes?',
      'Generate No Surprises Act report for Aetna Q1',
      'Show NSA readiness by network',
      'Which pharmacies failed NSA compliance this quarter?',
    ],
  },
  {
    key: 'audit', label: 'Pharmacy Audit', Icon: IconCheck, accent: '#10B981',
    questions: [
      'Run a full compliance audit across all networks',
      'Show pharmacies with DEA expiring in 30 days',
      'Which pharmacies have expired state licenses?',
      'What is our overall compliance audit score?',
      'Show credential gaps by state',
    ],
  },
  {
    key: 'chow', label: 'CHOW Tracker', Icon: IconStore, accent: '#8B5CF6',
    questions: [
      'Show recent ownership changes this month',
      'Which ownership transfers affect active contracts?',
      'List all CHOW events flagged as high priority',
      'Show ownership change history for Green Valley Pharmacy',
      'How many pharmacies changed ownership in Q1?',
    ],
  },
  {
    key: 'geographic', label: 'Geographic', Icon: IconGlobe, accent: '#06B6D4',
    questions: [
      'Network adequacy breakdown by state',
      'Which states are below CMS adequacy threshold?',
      'Show pharmacy desert zones in the Southeast',
      'How many pharmacies are in rural California counties?',
      'Map coverage gaps for my PBM network',
    ],
  },
  {
    key: 'batch', label: 'Batch Download', Icon: IconDatabase, accent: '#D97706',
    questions: [
      'Download all active pharmacy records as CSV',
      'Bulk export pharmacies in TX, FL, and CA',
      'How many records were exported today?',
      'Schedule a weekly batch download of chain pharmacies',
      'Export pharmacy demographics with custom field selection',
    ],
  },
  {
    key: 'fwa', label: 'FWA & Alerts', Icon: IconAlertTriangle, accent: '#DC2626',
    questions: [
      'Show pharmacies with elevated FWA risk scores',
      'Show all critical alerts requiring action',
      'Which pharmacies have billing anomalies?',
      'How many credential alerts are pending review?',
      'Run FWA attestation status check',
    ],
  },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function AISearchPage() {
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [typingAgent, setTypingAgent] = useState<{ name: string; color: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState('webconnect');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const hasMessages = messages.length > 0;
  const activeCat = CATEGORIES.find(c => c.key === activeTab) || CATEGORIES[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function send(text?: string) {
    const t = (text || input).trim();
    if (!t) return;
    setInput('');
    const agent = detectAgent(t);
    setMessages(m => [...m, { role: 'user', text: t, time: now() }]);
    setTyping(true);
    setTypingAgent(agent);

    setTimeout(() => {
      setTyping(false);
      setTypingAgent(null);
      const reply = buildReply(t);
      setMessages(m => [...m, { role: 'assistant', text: reply.text, time: now(), data: reply.data, agent }]);
    }, 800 + Math.random() * 600);
  }

  return (
    <>
      <Topbar title="AI Smart Search" subtitle="Unified AI intelligence across all dataQ.ai tools and data" />
      <main style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 84px)', background: '#FAFBFF' }}>

        {/* ── Empty state / welcome ─────────────────────────────── */}
        {!hasMessages && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', gap: 0 }}>

            {/* Logo mark */}
            <div style={{
              width: 72, height: 72, borderRadius: 22,
              background: 'linear-gradient(145deg, #4F46E5, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 40px rgba(79,70,229,.25), 0 0 0 1px rgba(79,70,229,.1)',
              marginBottom: 20,
            }}>
              <IconSparkles size={34} color="#fff"/>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-.5px' }}>
              What can I help you find?
            </h1>
            <p style={{ fontSize: 14, color: '#64748B', margin: '6px 0 0', textAlign: 'center', lineHeight: 1.5, maxWidth: 460 }}>
              Search across 68,247 pharmacy records, 33 AI agents, compliance data, and all dataQ.ai tools — powered by Claude.
            </p>

            {/* Input bar — hero position */}
            <div style={{ width: '100%', maxWidth: 640, marginTop: 28 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 0,
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 14,
                boxShadow: '0 4px 24px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.04)',
                padding: '4px 4px 4px 16px',
                transition: 'border-color .2s, box-shadow .2s',
              }}
                onFocus={() => {}}
              >
                <span style={{ color: '#94A3B8', display: 'flex', flexShrink: 0, marginRight: 10 }}>
                  <IconSparkles size={18} color="#A5B4FC"/>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask anything about your pharmacy network..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontSize: 14.5, color: '#0F172A', padding: '12px 0',
                  }}
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim()}
                  style={{
                    width: 42, height: 42, borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: input.trim() ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background .2s', flexShrink: 0,
                  }}
                >
                  <IconSend size={16} color={input.trim() ? '#fff' : '#94A3B8'}/>
                </button>
              </div>
            </div>

            {/* Category tabs */}
            <div style={{ width: '100%', maxWidth: 640, marginTop: 28 }}>
              <div style={{
                display: 'flex', gap: 2, padding: 3,
                background: '#F1F5F9', borderRadius: 12,
                overflowX: 'auto',
              }}>
                {CATEGORIES.map(cat => {
                  const isActive = activeTab === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveTab(cat.key)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                        padding: '8px 6px', borderRadius: 9, border: 'none', cursor: 'pointer',
                        background: isActive ? '#fff' : 'transparent',
                        boxShadow: isActive ? '0 1px 4px rgba(15,23,42,.08)' : 'none',
                        color: isActive ? cat.accent : '#64748B',
                        fontSize: 11.5, fontWeight: isActive ? 700 : 500,
                        transition: 'all .15s', whiteSpace: 'nowrap',
                      }}
                    >
                      <cat.Icon size={12} color={isActive ? cat.accent : '#94A3B8'}/>
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* FAQ questions for active tab */}
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 0 }}>
                {activeCat.questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => send(q)}
                    style={{
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 14px',
                      background: 'transparent', border: 'none',
                      borderBottom: i < activeCat.questions.length - 1 ? '1px solid #F1F5F9' : 'none',
                      borderRadius: i === 0 ? '10px 10px 0 0' : i === activeCat.questions.length - 1 ? '0 0 10px 10px' : 0,
                      transition: 'background .1s',
                      fontSize: 13.5, color: '#334155', lineHeight: 1.4,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{
                      width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                      background: activeCat.accent + '08',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <IconSend size={11} color={activeCat.accent}/>
                    </span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Conversation view ─────────────────────────────────── */}
        {hasMessages && (
          <>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    padding: '16px 0',
                    background: msg.role === 'assistant' ? '#fff' : 'transparent',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    {/* Avatar */}
                    {msg.role === 'assistant' ? (
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(79,70,229,.2)',
                      }}>
                        <IconSparkles size={17} color="#fff"/>
                      </div>
                    ) : (
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg, #E2E8F0, #CBD5E1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <IconUser size={15} color="#64748B"/>
                      </div>
                    )}

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                          {msg.role === 'assistant' ? 'dataQ.ai' : 'You'}
                        </span>
                        {msg.agent && msg.role === 'assistant' && (
                          <span style={{
                            fontSize: 10.5, fontWeight: 600, color: msg.agent.color,
                            background: msg.agent.color + '0D',
                            border: `1px solid ${msg.agent.color}20`,
                            padding: '2px 9px', borderRadius: 6,
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                          }}>
                            <IconSparkles size={9} color={msg.agent.color}/> {msg.agent.name}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>{msg.time}</span>
                      </div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.7, color: '#334155' }}>
                        {renderText(msg.text)}
                      </div>
                      {msg.data && <div style={{ marginTop: 12 }}>{msg.data}</div>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && typingAgent && (
                <div style={{ padding: '16px 0', background: '#fff', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(79,70,229,.2)',
                    }}>
                      <IconSparkles size={17} color="#fff"/>
                    </div>
                    <div style={{ paddingTop: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>dataQ.ai</span>
                        <span style={{
                          fontSize: 10.5, fontWeight: 600, color: typingAgent.color,
                          background: typingAgent.color + '0D', border: `1px solid ${typingAgent.color}20`,
                          padding: '2px 9px', borderRadius: 6,
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                        }}>
                          <IconSparkles size={9} color={typingAgent.color}/> {typingAgent.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {[0, 1, 2].map(j => (
                            <span key={j} style={{
                              width: 7, height: 7, borderRadius: '50%', background: '#A5B4FC',
                              display: 'inline-block', animation: `pdot 1.2s ease-in-out ${j * .2}s infinite`,
                            }}/>
                          ))}
                        </div>
                        <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 4 }}>Analyzing records...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Sticky input bar */}
            <div style={{ background: '#FAFBFF', borderTop: '1px solid #E8ECF4', padding: '12px 0 16px' }}>
              <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 0,
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: 14,
                  boxShadow: '0 4px 24px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.04)',
                  padding: '4px 4px 4px 16px',
                }}>
                  <span style={{ color: '#94A3B8', display: 'flex', flexShrink: 0, marginRight: 10 }}>
                    <IconSparkles size={16} color="#A5B4FC"/>
                  </span>
                  <input
                    type="text"
                    placeholder="Ask a follow-up question..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    style={{
                      flex: 1, border: 'none', outline: 'none', background: 'transparent',
                      fontSize: 14, color: '#0F172A', padding: '10px 0',
                    }}
                  />
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || typing}
                    style={{
                      width: 38, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: input.trim() ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#F1F5F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background .2s', flexShrink: 0,
                    }}
                  >
                    <IconSend size={15} color={input.trim() ? '#fff' : '#94A3B8'}/>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
