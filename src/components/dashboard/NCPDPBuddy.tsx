'use client';
import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { IconX, IconSend, IconBot, IconSparkles, IconDatabase, IconShield, IconSearch, IconBarChart, IconNetwork, IconReport, IconZap, IconCheck } from '@/components/ui/Icons';
import { pharmacyResults, agents, alerts } from '@/lib/mockData';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  time: string;
  agentName?: string;
  agentIcon?: string;
  data?: React.ReactNode;
}

const suggestions = [
  'DEA expiring in 30 days',
  'Network adequacy CA?',
  'FWA risk pharmacies',
  'Show top agents',
  'Recent closures',
  'Ownership changes',
];

/* ── Agent routing map ──────────────────────────────────────────────── */
function detectAgent(input: string): { name: string; icon: string; color: string } {
  const l = input.toLowerCase();
  if (l.includes('dea') || l.includes('expir') || l.includes('licen') || l.includes('creden') || l.includes('attestation'))
    return { name: 'Compliance Watchdog', icon: '🛡️', color: '#DC2626' };
  if (l.includes('fwa') || l.includes('fraud') || l.includes('waste') || l.includes('abuse') || l.includes('risk'))
    return { name: 'FWA Risk Scoring', icon: '🚨', color: '#D97706' };
  if (l.includes('closure') || l.includes('closed') || l.includes('close'))
    return { name: 'Change Tracker', icon: '📊', color: '#005C8D' };
  if (l.includes('network') || l.includes('adequacy') || l.includes('coverage') || l.includes('gap'))
    return { name: 'Network Analyzer', icon: '🔍', color: '#449055' };
  if (l.includes('ownership') || l.includes('contract') || l.includes('transfer'))
    return { name: 'Contract Intelligence', icon: '📝', color: '#005C8D' };
  if (l.includes('report') || l.includes('export') || l.includes('generat'))
    return { name: 'Custom Report Builder', icon: '📈', color: '#449055' };
  if (l.includes('search') || l.includes('find') || l.includes('look') || l.includes('show me'))
    return { name: 'Pharmacy Finder', icon: '🔎', color: '#005C8D' };
  if (l.includes('agent') || l.includes('top') || l.includes('most used'))
    return { name: 'NCPDP Buddy', icon: '💬', color: '#005C8D' };
  if (l.includes('alert') || l.includes('critical') || l.includes('urgent'))
    return { name: 'Compliance Watchdog', icon: '🛡️', color: '#DC2626' };
  if (l.includes('api') || l.includes('usage') || l.includes('call'))
    return { name: 'Subscriber Insight', icon: '🎯', color: '#449055' };
  if (l.includes('no surprise') || l.includes('nsa') || l.includes('cms'))
    return { name: 'No Surprises Assistant', icon: '⚖️', color: '#76C799' };
  if (l.includes('predict') || l.includes('forecast') || l.includes('desert'))
    return { name: 'Closure Prediction', icon: '🔮', color: '#005C8D' };
  return { name: 'NCPDP Buddy', icon: '💬', color: '#005C8D' };
}

/* ── Response builder ───────────────────────────────────────────────── */
function buildReply(input: string): { text: string; data?: React.ReactNode } {
  const l = input.toLowerCase();

  /* ── DEA / credentials / expiry ── */
  if (l.includes('dea') || l.includes('expir')) {
    const results = pharmacyResults.filter(p => p.dea === 'Expiring' || p.dea === 'Expired');
    return {
      text: `Found **${results.length} pharmacies** with DEA credential issues across your network. TX leads with 482 affected, followed by CA (371) and FL (298). Showing your flagged records:`,
      data: (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {results.map(p => (
            <div key={p.id} style={{ background: 'rgba(239,68,68,.06)', border: '1px solid #FECACA', borderRadius: 8, padding: '7px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0F172A' }}>{p.name}</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: p.dea === 'Expired' ? '#DC2626' : '#B45309', background: p.dea === 'Expired' ? '#FEE2E2' : '#FEF3C7', padding: '1px 7px', borderRadius: 9999 }}>
                  DEA {p.dea}
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>{p.city}, {p.state} · {p.networks} network{p.networks !== 1 ? 's' : ''} affected</div>
            </div>
          ))}
          <button style={{ marginTop: 4, fontSize: 11, fontWeight: 600, color: '#005C8D', background: '#E8F3F9', border: '1px solid #8FC2D8', borderRadius: 7, padding: '5px 10px', cursor: 'pointer' }}>
            Export Full Report →
          </button>
        </div>
      ),
    };
  }

  /* ── FWA / fraud ── */
  if (l.includes('fwa') || l.includes('fraud') || l.includes('risk')) {
    return {
      text: `Identified **6 pharmacies** with elevated FWA risk scores (≥ 8.5/10) in your network this quarter. Top 3 flagged for immediate review:`,
      data: (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { name: 'Sunrise Drugs LLC',  city: 'Las Vegas, NV',  score: 9.2, flags: ['Billing anomaly', 'High refill rate'] },
            { name: 'FastRx Pharmacy',    city: 'Miami, FL',      score: 8.8, flags: ['Dispensing pattern', 'Ownership change'] },
            { name: 'QuickMeds #2041',    city: 'Houston, TX',    score: 8.6, flags: ['DEA mismatch'] },
          ].map((p, i) => (
            <div key={i} style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '7px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0F172A' }}>{p.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#B45309', background: '#FEF3C7', padding: '1px 7px', borderRadius: 9999 }}>Risk {p.score}</span>
              </div>
              <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>{p.city} · {p.flags.join(' · ')}</div>
            </div>
          ))}
          <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2, padding: '5px 8px', background: '#F8FAFC', borderRadius: 7, border: '1px solid #E2E8F0' }}>
            3 more pharmacies at medium risk (6.0–8.4). Run the full FWA Risk Scoring agent for complete analysis.
          </div>
        </div>
      ),
    };
  }

  /* ── Closures ── */
  if (l.includes('closure') || l.includes('closed') || l.includes('recent close')) {
    return {
      text: `Detected **3 pharmacy closures** this week across your tracked networks. 2 impact active network contracts:`,
      data: (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { name: 'Park Ave Pharmacy',  city: 'New York, NY',  date: 'Mar 29', networks: 2, impact: 'High'   },
            { name: 'Sunset Drugs',       city: 'Phoenix, AZ',   date: 'Mar 28', networks: 1, impact: 'Medium' },
            { name: 'Family Care Rx',     city: 'Dallas, TX',    date: 'Mar 27', networks: 0, impact: 'None'   },
          ].map((p, i) => {
            const impactColor = p.impact === 'High' ? { bg: '#FEF2F2', text: '#DC2626' } : p.impact === 'Medium' ? { bg: '#FFFBEB', text: '#B45309' } : { bg: '#F8FAFC', text: '#64748B' };
            return (
              <div key={i} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '7px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0F172A' }}>{p.name}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: impactColor.text, background: impactColor.bg, padding: '1px 7px', borderRadius: 9999 }}>{p.impact} impact</span>
                </div>
                <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>{p.city} · Closed {p.date} · {p.networks} network{p.networks !== 1 ? 's' : ''} affected</div>
              </div>
            );
          })}
        </div>
      ),
    };
  }

  /* ── Network / adequacy ── */
  if (l.includes('network') || l.includes('adequacy') || l.includes('coverage') || l.includes('california') || l.includes(' ca ') || l.includes('ca?')) {
    return {
      text: `California network adequacy: **94.2%** — above minimum threshold of 90%. Rural access in Kern County is borderline at 79%. Recommendation: add 2 specialty pharmacies near Bakersfield.`,
      data: (
        <div style={{ marginTop: 8, background: '#F0FDF4', border: '1px solid #A7F3D0', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#449055', marginBottom: 6 }}>CA Network Summary</div>
          {[
            ['Total Pharmacies',   '8,420'],
            ['Adequacy Score', '94.2%'],
            ['ACHC Accredited',    '2,841'],
            ['Specialty Coverage', '98.1%'],
            ['Rural Access (Kern)','79% ⚠️'],
            ['Gaps Identified',    '2 zones'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '3px 0', borderBottom: '1px solid rgba(167,243,208,.5)' }}>
              <span style={{ color: '#64748B' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>{v}</span>
            </div>
          ))}
        </div>
      ),
    };
  }

  /* ── Ownership changes ── */
  if (l.includes('ownership') || l.includes('contract') || l.includes('transfer') || l.includes('change of owner')) {
    return {
      text: `Detected **4 ownership changes** this month that may trigger contract renegotiation. Contract Intelligence agent flagged 2 as high priority:`,
      data: (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { name: 'Green Valley Pharmacy',   city: 'Seattle, WA',   date: 'Mar 5', priority: 'High',   networks: 3 },
            { name: 'Metro Drugs LLC',         city: 'Nashville, TN', date: 'Feb 28', priority: 'High',  networks: 2 },
            { name: 'Pacific Health Rx',       city: 'San Diego, CA', date: 'Feb 20', priority: 'Low',   networks: 1 },
            { name: 'Sunrise Holdings #3',     city: 'Phoenix, AZ',   date: 'Feb 15', priority: 'Low',   networks: 1 },
          ].map((p, i) => (
            <div key={i} style={{ background: p.priority === 'High' ? '#FAF5FF' : '#F8FAFC', border: `1px solid ${p.priority === 'High' ? '#DDD6FE' : '#E2E8F0'}`, borderRadius: 8, padding: '7px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0F172A' }}>{p.name}</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: p.priority === 'High' ? '#004870' : '#64748B', background: p.priority === 'High' ? '#EDE9FE' : '#F1F5F9', padding: '1px 7px', borderRadius: 9999 }}>
                  {p.priority} Priority
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>{p.city} · {p.date} · {p.networks} active network contract{p.networks !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      ),
    };
  }

  /* ── Report generation ── */
  if (l.includes('report') || l.includes('export') || l.includes('generat')) {
    return {
      text: `Custom Report Builder is ready. Based on your query, I'd suggest a **Credential Expiry Report** for Q1 2026. I can generate it now — it will cover 81,500 records and be ready as PDF or Excel in about 2 seconds.`,
      data: (
        <div style={{ marginTop: 8, background: '#E8F3F9', border: '1px solid #8FC2D8', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#1474A4', marginBottom: 6 }}>Suggested Report Config</div>
          {[
            ['Report Type',    'DEA Expiry — Q1 2026'],
            ['Date Range',     'Jan 1 – Mar 31, 2026'],
            ['Scope',          'All 81,500 pharmacies'],
            ['Sections',       'By state · By type · At-risk'],
            ['Formats',        'PDF, Excel, CSV'],
            ['Est. Records',   '~1,180 matches'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '3px 0', borderBottom: '1px solid rgba(191,219,254,.6)' }}>
              <span style={{ color: '#64748B' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>{v}</span>
            </div>
          ))}
          <button style={{ marginTop: 8, width: '100%', fontSize: 11.5, fontWeight: 600, color: '#fff', background: '#1474A4', border: 'none', borderRadius: 7, padding: '6px 10px', cursor: 'pointer' }}>
            Generate Report Now →
          </button>
        </div>
      ),
    };
  }

  /* ── No Surprises Act / ── */
  if (l.includes('no surprise') || l.includes('nsa') || l.includes('cms')) {
    return {
      text: `No Surprises Act status: **38,569 pharmacies** validated for Q1 2026. 47 require manual fixes before the Apr 15 submission deadline. Overall readiness: 99.1%.`,
      data: (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { label: 'Pass',     count: '38,210', color: '#449055', bg: '#D1FAE5', border: '#A7F3D0' },
            { label: 'Warnings', count: '312',    color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
            { label: 'Failures', count: '47',     color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: s.bg + '80', border: `1px solid ${s.border}`, borderRadius: 8, padding: '7px 12px' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.count}</span>
            </div>
          ))}
          <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>Deadline: Apr 15, 2026 · Use No Surprises Assistant agent to auto-resolve warnings</div>
        </div>
      ),
    };
  }

  /* ── Alerts ── */
  if (l.includes('alert') || l.includes('critical') || l.includes('urgent')) {
    const crit = alerts.filter(a => a.severity === 'critical');
    return {
      text: `There are **${crit.length} critical alerts** requiring immediate action, plus 18 warnings and 27 informational alerts in your network:`,
      data: (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {crit.map(a => (
            <div key={a.id} style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '7px 10px' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#DC2626' }}>{a.title}</div>
              <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 1 }}>{a.pharmacy} · {a.location} · {a.networks} network{a.networks !== 1 ? 's' : ''} affected</div>
            </div>
          ))}
          <div style={{ fontSize: 10.5, color: '#64748B', padding: '5px 0' }}>+ 18 warnings · 27 info · Go to Alerts Center for full inbox</div>
        </div>
      ),
    };
  }

  /* ── Top agents ── */
  if (l.includes('agent') || l.includes('top') || l.includes('most used')) {
    const top = agents.slice(0, 5);
    return {
      text: `Your **top 5 most-used agents** this month, totaling ${top.reduce((a, b) => a + b.uses, 0).toLocaleString()} interactions:`,
      data: (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {top.map((a, i) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 10px' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', width: 16, textAlign: 'center' }}>#{i + 1}</span>
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: '#0F172A' }}>{a.name}</div>
                <div style={{ fontSize: 10.5, color: '#94A3B8' }}>{a.category}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#005C8D' }}>{a.uses.toLocaleString()}</span>
            </div>
          ))}
        </div>
      ),
    };
  }

  /* ── API / usage ── */
  if (l.includes('api') || l.includes('usage') || l.includes('call')) {
    return {
      text: `API usage is **up 18% month-over-month** with 1.24M calls today. REST endpoints are the primary driver. You're on track to exceed the monthly average for the first time this quarter.`,
      data: (
        <div style={{ marginTop: 8, background: '#E8F3F9', border: '1px solid #8FC2D8', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#005C8D', marginBottom: 6 }}>API Usage — March 2026</div>
          {[
            ['Calls Today',         '1.24M'],
            ['Monthly Total',       '28.4M'],
            ['REST Calls',          '19.1M (67%)'],
            ['GraphQL Calls',       '9.3M (33%)'],
            ['Avg Response Time',   '48ms'],
            ['Error Rate',          '0.02%'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '3px 0', borderBottom: '1px solid rgba(186,230,253,.5)' }}>
              <span style={{ color: '#64748B' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>{v}</span>
            </div>
          ))}
        </div>
      ),
    };
  }

  /* ── Pharmacy search ── */
  if (l.includes('find') || l.includes('search') || l.includes('look') || l.includes('show me')) {
    const sample = pharmacyResults.slice(0, 4);
    return {
      text: `Searched **81,500 pharmacy records** — here are 4 matching results. Use Smart Search for advanced filters (type, state, service, credential status).`,
      data: (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sample.map(p => (
            <div key={p.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '7px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0F172A' }}>{p.name}</span>
                <span style={{ fontSize: 10.5, color: '#005C8D', fontFamily: 'monospace', fontWeight: 700 }}>{p.id}</span>
              </div>
              <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>{p.city}, {p.state} · {p.type} · DEA {p.dea}</div>
            </div>
          ))}
          <a href="/search" style={{ marginTop: 4, display: 'block', fontSize: 11, fontWeight: 600, color: '#005C8D', background: '#E8F3F9', border: '1px solid #8FC2D8', borderRadius: 7, padding: '5px 10px', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}>
            Open Full Smart Search →
          </a>
        </div>
      ),
    };
  }

  /* ── Default / overview ── */
  return {
    text: `I have access to **81,500 pharmacy records** across all 50 states with real-time compliance data. Right now there are **2 subscriptions nearing expiration** in your network.\n\nI can help you with:\n• DEA & credential expiry tracking\n• Network adequacy analysis by state\n• FWA risk scoring & fraud flags\n• Pharmacy search & profile review\n• Ownership change monitoring\n• Compliance report generation\n• No Surprises Act readiness\n\nWhat would you like to explore?`,
  };
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderText(text: string) {
  return text.split('**').map((part, i) =>
    i % 2 === 1
      ? <strong key={i}>{part}</strong>
      : part.split('\n').map((line, j) => <span key={j}>{line}{j < part.split('\n').length - 1 && <br/>}</span>)
  );
}

/* ── Agent routing badge ────────────────────────────────────────────── */
function AgentBadge({ name, color }: { name: string; icon?: string; color: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10, fontWeight: 600,
      color, background: color + '15',
      border: `1px solid ${color}30`,
      padding: '2px 8px', borderRadius: 9999, marginBottom: 4,
    }}>
      <IconSparkles size={10} color={color}/>
      {name}
    </div>
  );
}

/* ── Component ──────────────────────────────────────────────────────── */
export function NCPDPBuddy() {
  const pathname = usePathname();
  const hideOnAgentRun = pathname.startsWith('/agents/run');

  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [typingAgent, setTypingAgent] = useState<{ name: string; icon: string; color: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    text: `Hi Sarah! I'm **NCPDP Buddy** — your AI assistant with real-time access to **81,500** pharmacy records.\n\nI can search pharmacies, analyze compliance, track credentials, assess FWA risk, and route tasks to any of our 33 specialized agents. What would you like to know?`,
    time: now(),
    agentName: 'NCPDP Buddy',
    agentIcon: 'sparkle',
  }]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function send(text?: string) {
    const t = (text || input).trim();
    if (!t) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: t, time: now() }]);

    const agent = detectAgent(t);
    setTyping(true);
    setTypingAgent(agent);

    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      setTyping(false);
      setTypingAgent(null);
      const reply = buildReply(t);
      setMessages(m => [...m, {
        role: 'assistant',
        text: reply.text,
        time: now(),
        data: reply.data,
        agentName: agent.name,
        agentIcon: agent.icon,
      }]);
    }, delay);
  }

  if (hideOnAgentRun) return null;

  return (
    <div className="buddy-bubble">
      {open && (
        <div style={{
          position: 'absolute',
          bottom: 64,
          right: 0,
          width: 380,
          maxHeight: 560,
          background: 'var(--surface)',
          borderRadius: 18,
          boxShadow: '0 20px 60px rgba(15,23,42,.2), 0 0 0 1px var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #005C8D, #004870)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconSparkles size={19} color="#fff"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1 }}>NCPDP Buddy</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }}/>
                Online · 81,500 records · 33 agents
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(255,255,255,.5)', background: 'rgba(255,255,255,.1)', padding: '2px 7px', borderRadius: 9999 }}>
                <IconDatabase size={9} color="rgba(255,255,255,.6)"/>
                Claude API
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.6)', padding: 2, display: 'flex' }}>
                <IconX size={14}/>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#005C8D,#004870)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <IconSparkles size={14} color="#fff"/>
                  </div>
                )}
                <div style={{ maxWidth: '82%' }}>
                  {msg.role === 'assistant' && msg.agentName && (
                    <AgentBadge name={msg.agentName} icon={msg.agentIcon || '💬'} color="#005C8D"/>
                  )}
                  <div style={{
                    background: msg.role === 'user' ? '#005C8D' : 'var(--surface-2)',
                    color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                    padding: '8px 11px',
                    borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '2px 12px 12px 12px',
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  }}>
                    {renderText(msg.text)}
                  </div>
                  {msg.data && <div style={{ marginTop: 4 }}>{msg.data}</div>}
                  <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 3, textAlign: msg.role === 'user' ? 'right' : 'left', paddingLeft: 2 }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {typing && typingAgent && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#005C8D,#004870)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13 }}>
                  {typingAgent.icon}
                </div>
                <div>
                  <AgentBadge name={typingAgent.name} icon={typingAgent.icon} color={typingAgent.color}/>
                  <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '8px 13px', borderRadius: '2px 12px 12px 12px', display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0, 1, 2].map(j => (
                      <span key={j} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block', animation: `pdot 1.2s ease-in-out ${j * .2}s infinite` }}/>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Suggestions */}
          <div style={{ padding: '0 12px 6px', display: 'flex', gap: 5, flexWrap: 'wrap', flexShrink: 0 }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} style={{
                fontSize: 10.5, fontWeight: 500, color: '#005C8D',
                background: '#E8F3F9', border: '1px solid #8FC2D8',
                borderRadius: 9999, padding: '3px 9px', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{s}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '6px 12px 12px', display: 'flex', gap: 7, borderTop: '1px solid var(--border-light)', flexShrink: 0 }}>
            <input
              className="input-base"
              placeholder="Ask about pharmacy data, agents, compliance…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              style={{ fontSize: 12.5, height: 38 }}
            />
            <button
              onClick={() => send()}
              className="btn-primary"
              style={{ padding: '0 13px', height: 38, borderRadius: 8, flexShrink: 0 }}
            >
              <IconSend size={13} color="#fff"/>
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: open ? '#005C8D' : 'linear-gradient(135deg, #005C8D, #004870)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(0,92,141,.38)',
          transition: 'transform .15s, box-shadow .15s',
          position: 'relative',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      >
        {open ? <IconX size={18} color="#fff"/> : <IconSparkles size={22} color="#fff"/>}
        {!open && (
          <span style={{
            position: 'absolute', top: -1, right: -1,
            width: 14, height: 14, borderRadius: '50%',
            background: '#76C799', border: '2px solid var(--bg)',
          }}/>
        )}
      </button>
    </div>
  );
}
