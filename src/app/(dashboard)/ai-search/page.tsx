'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/Badge';
import {
  IconSend, IconLogoBrain, IconSparkles, IconDatabase, IconShield, IconSearch,
  IconBarChart, IconNetwork, IconReport, IconZap, IconCheck, IconBot,
  IconBell, IconGlobe, IconStore, IconLock, IconRefresh, IconExternalLink,
  IconAlertTriangle, IconUser, IconChevronRight,
} from '@/components/ui/Icons';
import { pharmacyResults, agents, alerts, complianceMetrics, stateBreakdown } from '@/lib/mockData';
import { AgentChat } from '@/components/ui/AgentChat';
import { OutputPanel } from '@/components/ui/OutputPanel';
import type { QueryContext } from '@/components/ui/OutputPanel';
import { queryGemini } from '@/lib/gemini';
import type { GeminiResponse } from '@/lib/gemini';

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
  if (l.includes('fwa') || l.includes('fraud') || l.includes('waste') || l.includes('attest'))
    return { name: 'FWA Risk Scoring', color: '#D97706' };
  if (l.includes('closure') || l.includes('closed'))
    return { name: 'Change Tracker', color: '#2968B0' };
  if (l.includes('network') || l.includes('adequacy') || l.includes('coverage') || l.includes('gap'))
    return { name: 'Network Analyzer', color: '#059669' };
  if (l.includes('ownership') || l.includes('contract') || l.includes('transfer'))
    return { name: 'Contract Intelligence', color: '#2968B0' };
  if (l.includes('report') || l.includes('export') || l.includes('generat'))
    return { name: 'Custom Report Builder', color: '#06B6D4' };
  if (l.includes('compliance') || l.includes('audit') || l.includes('score'))
    return { name: 'Compliance Watchdog', color: '#DC2626' };
  if (l.includes('compound') || l.includes('sterile'))
    return { name: 'Pharmacy Finder', color: '#059669' };
  if (l.includes('alert') || l.includes('critical') || l.includes('urgent'))
    return { name: 'Compliance Watchdog', color: '#DC2626' };
  if (l.includes('agent') || l.includes('top') || l.includes('most used'))
    return { name: 'NCPDP Buddy', color: '#2968B0' };
  if (l.includes('api') || l.includes('usage') || l.includes('call'))
    return { name: 'Subscriber Insight', color: '#06B6D4' };
  if (l.includes('find') || l.includes('search') || l.includes('look') || l.includes('pharmacy') || l.includes('show'))
    return { name: 'Pharmacy Finder', color: '#2968B0' };
  if (l.includes('predict') || l.includes('desert') || l.includes('forecast'))
    return { name: 'Closure Prediction', color: '#2968B0' };
  if (l.includes('state') || l.includes('geographic') || l.includes('map'))
    return { name: 'Network Analyzer', color: '#059669' };
  if (l.includes('batch') || l.includes('download') || l.includes('bulk'))
    return { name: 'Batch Optimizer', color: '#10B981' };
  if (l.includes('onboard') || l.includes('setup') || l.includes('start'))
    return { name: 'Onboarding Agent', color: '#06B6D4' };
  return { name: 'NCPDP Buddy', color: '#2968B0' };
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
            <div key={p.id} style={{ padding: '12px 16px', borderRadius: 8, background: '#FAFBFF', border: '1px solid #EEF1F8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                <Badge variant={p.dea === 'Expired' ? 'danger' : 'warning'}>DEA {p.dea}</Badge>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>{p.city}, {p.state} · NPI: {p.npi} · {p.networks} network{p.networks !== 1 ? 's' : ''} affected</div>
            </div>
          ))}
          <div style={{ padding: '8px 16px', borderRadius: 8, background: '#FAFBFF', border: '1px solid #EEF1F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>Total affected across all states: <strong style={{ color: '#DC2626' }}>1,151</strong></span>
            <button className="btn-primary" style={{ fontSize: 11, padding: '4px 14px' }}>Export Full List</button>
          </div>
        </div>
      ),
    };
  }

  if (l.includes('fwa') || l.includes('fraud') || l.includes('waste') || l.includes('attest')) {
    const missing2026 = l.includes('2026') || l.includes('not completed');
    const missing2025 = l.includes('2025');
    const recent = l.includes('last 30') || l.includes('attested');
    if (missing2025 || missing2026) {
      const year = missing2025 ? '2025' : '2026';
      return {
        text: `Found **${missing2025 ? '1,420' : '8,150'} independent pharmacies** that have not completed FWA attestation for ${year}:`,
        data: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'Total Independent', count: '24,450', color: '#2968B0', bg: '#F0F7FF', border: '#B8D5F5' },
                { label: `Missing ${year}`, count: missing2025 ? '1,420' : '8,150', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
                { label: `Attested ${year}`, count: missing2025 ? '23,030' : '16,300', color: '#059669', bg: '#F0FDF4', border: '#A7F3D0' },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, padding: '14px', borderRadius: 8, textAlign: 'center', background: s.bg, border: `1px solid ${s.border}` }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {[
              { name: 'Sunrise Drugs LLC',    city: 'Las Vegas, NV', type: 'Independent', deadline: `Jan 1, ${year}` },
              { name: 'FastRx Pharmacy',      city: 'Miami, FL',     type: 'Independent', deadline: `Jan 1, ${year}` },
              { name: 'Valley Health Rx',     city: 'Dallas, TX',    type: 'Independent', deadline: `Jan 1, ${year}` },
            ].map((p, i) => (
              <div key={i} style={{ padding: '12px 16px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', borderLeft: '3px solid #DC2626' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                  <Badge variant="danger">Missing</Badge>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>{p.city} · {p.type} · Deadline: {p.deadline}</div>
              </div>
            ))}
          </div>
        ),
      };
    }
    return {
      text: recent
        ? `**4,218 pharmacies** completed FWA attestation in the last 30 days. 73,350 of 81,500 total pharmacies (90%) are currently attested.`
        : `FWA attestation status: **73,350 of 81,500 pharmacies** (90%) have completed attestation. 8,150 independent pharmacies still pending for 2026.`,
      data: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'Attested', count: '73,350', color: '#059669', bg: '#F0FDF4', border: '#A7F3D0' },
              { label: 'Pending', count: '6,480', color: '#D97706', bg: '#FFFBF5', border: '#FDE68A' },
              { label: 'Not Started', count: '1,670', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, padding: '14px', borderRadius: 8, textAlign: 'center', background: s.bg, border: `1px solid ${s.border}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {recent && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: '#F0FDF4', border: '1px solid #A7F3D0' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#059669', marginBottom: 4 }}>Last 30 Days — 4,218 New Attestations</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>TX: 612 · CA: 548 · FL: 441 · NY: 389 · IL: 312 · Others: 1,916</div>
            </div>
          )}
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
              <div key={m.label} style={{ padding: '12px 16px', borderRadius: 8, background: isWarn ? '#FFFBF5' : '#F0FDF4', border: `1px solid ${isWarn ? '#FDE68A' : '#A7F3D0'}`, borderLeft: `3px solid ${isWarn ? '#F59E0B' : '#10B981'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{m.label}</span>
                  <Badge variant={isWarn ? 'warning' : 'success'}>{m.score}%</Badge>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{m.detail}</div>
              </div>
            );
          })}
        </div>
      ),
    };
  }

  if (l.includes('network') || l.includes('adequacy') || l.includes('coverage') || l.includes('state') || l.includes('geographic')) {
    return {
      text: `Network analysis across 8 monitored states. Overall adequacy: **94.2%** — above minimum threshold of 90%. 2 states need attention:`,
      data: (
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #EEF1F8' }}>
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
            <div key={i} style={{ padding: '12px 16px', borderRadius: 8, background: '#FAFBFF', border: '1px solid #EEF1F8', borderLeft: `3px solid ${p.impact === 'High' ? '#DC2626' : p.impact === 'Medium' ? '#F59E0B' : '#94A3B8'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                <Badge variant={p.impact === 'High' ? 'danger' : p.impact === 'Medium' ? 'warning' : 'neutral'}>{p.impact}</Badge>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{p.city} · Closed {p.date} · {p.networks} network{p.networks !== 1 ? 's' : ''}</div>
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
            <div key={a.id} style={{ padding: '12px 16px', borderRadius: 8, background: '#FAFBFF', border: '1px solid #EEF1F8', borderLeft: `3px solid ${a.severity === 'critical' ? '#DC2626' : a.severity === 'warning' ? '#F59E0B' : '#3B82F6'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{a.title}</span>
                <Badge variant={a.severity === 'critical' ? 'danger' : a.severity === 'warning' ? 'warning' : 'info'}>{a.severity}</Badge>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{a.pharmacy} · {a.location} · {a.time}</div>
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
            <div key={a.id} style={{ padding: '12px 16px', borderRadius: 8, background: '#FAFBFF', border: '1px solid #EEF1F8', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#B8D5F5', width: 20 }}>#{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{a.name}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{a.category}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#2968B0' }}>{a.uses.toLocaleString()}</span>
            </div>
          ))}
        </div>
      ),
    };
  }

  if (l.includes('api') || l.includes('usage') || l.includes('call')) {
    return {
      text: `API usage is **up 12% month-over-month** with 200K calls today. REST endpoints drive 67% of traffic.`,
      data: (
        <div style={{ padding: '16px', borderRadius: 8, background: '#FAFBFF', border: '1px solid #EEF1F8' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0284C7', marginBottom: 8 }}>API Usage — April 2026</div>
          {[
            ['Calls Today', '200K'], ['Monthly Total', '4.6M'], ['REST Calls', '3.1M (67%)'],
            ['GraphQL Calls', '1.5M (33%)'], ['Avg Response Time', '48ms'], ['Error Rate', '0.02%'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
            </div>
          ))}
        </div>
      ),
    };
  }

  if (l.includes('compound')) {
    const stateMatch = l.match(/\b(texas|virginia|california|florida|new york|ohio|illinois)\b/i);
    const stateName = stateMatch ? stateMatch[1].charAt(0).toUpperCase() + stateMatch[1].slice(1) : null;
    return {
      text: stateName
        ? `Found **${stateName === 'Texas' ? '347' : stateName === 'Virginia' ? '124' : stateName === 'California' ? '512' : '218'} compounding pharmacies** in ${stateName}. Showing top results:`
        : `There are **2,840 compounding pharmacies** across 81,500 total records. Top states: CA (512), TX (347), FL (296), NY (231).`,
      data: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { name: 'BioPharm Compounding',       city: stateName === 'Virginia' ? 'Richmond, VA' : stateName === 'Texas' ? 'Houston, TX' : 'Boston, MA', type: 'Sterile & Non-Sterile', services: 'Oncology · Hormone Therapy' },
            { name: 'Precision Compounding Rx',    city: stateName === 'Virginia' ? 'Arlington, VA' : stateName === 'Texas' ? 'Dallas, TX' : 'San Diego, CA', type: 'Non-Sterile', services: 'Veterinary · Dermatology' },
            { name: 'SpectraCare Pharmacy',        city: stateName === 'Virginia' ? 'Virginia Beach, VA' : stateName === 'Texas' ? 'Austin, TX' : 'Chicago, IL', type: 'Sterile', services: 'Infusion · Pain Management' },
          ].map((p, i) => (
            <div key={i} style={{ padding: '12px 16px', borderRadius: 8, background: '#F0FDF4', border: '1px solid #A7F3D0', borderLeft: '3px solid #059669' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                <Badge variant="success">{p.type}</Badge>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>{p.city} · {p.services}</div>
            </div>
          ))}
          <div style={{ padding: '8px 16px', borderRadius: 8, background: '#FAFBFF', border: '1px solid #EEF1F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>Showing 3 of {stateName ? (stateName === 'Texas' ? '347' : stateName === 'Virginia' ? '124' : stateName === 'California' ? '512' : '218') : '2,840'} compounding pharmacies</span>
            <button className="btn-primary" style={{ fontSize: 11, padding: '4px 14px' }}>View All</button>
          </div>
        </div>
      ),
    };
  }

  if (l.includes('report') || l.includes('export') || l.includes('generat')) {
    return {
      text: `Custom Report Builder is ready. Based on your query, I suggest a **Credential Expiry Report** for Q1 2026 covering 81,500 records.`,
      data: (
        <div style={{ padding: '16px', borderRadius: 8, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#2968B0', marginBottom: 8 }}>Suggested Report Config</div>
          {[
            ['Report Type', 'DEA Expiry — Q1 2026'], ['Date Range', 'Jan 1 – Mar 31, 2026'],
            ['Scope', 'All 81,500 pharmacies'], ['Est. Records', '~1,180 matches'], ['Formats', 'PDF, Excel, CSV'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: '1px solid rgba(191,219,254,.5)' }}>
              <span style={{ color: '#64748B' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
            </div>
          ))}
          <button className="btn-primary" style={{ width: '100%', marginTop: 10, justifyContent: 'center', fontSize: 13 }}>Generate Report Now</button>
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
            <div key={i} style={{ padding: '12px 16px', borderRadius: 8, background: p.priority === 'High' ? '#F0F7FF' : '#FAFBFF', border: `1px solid ${p.priority === 'High' ? '#B8D5F5' : '#EEF1F8'}`, borderLeft: `3px solid ${p.priority === 'High' ? '#2968B0' : '#94A3B8'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                <Badge variant={p.priority === 'High' ? 'brand' : 'neutral'}>{p.priority}</Badge>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{p.city} · {p.date} · {p.networks} contract{p.networks !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      ),
    };
  }

  /* ── NCPDP ID lookup ── */
  if (l.includes('ncpdp id') || l.includes('ncpdp provider') || l.match(/\blook\s*up\b.*\b\d{7}\b/)) {
    const idMatch = input.match(/\b(\d{7})\b/);
    const id = idMatch ? idMatch[1] : '0512345';
    const found = pharmacyResults.find(p => p.id === id);
    return {
      text: found
        ? `Found pharmacy **${found.name}** (NCPDP ID: ${id}) in ${found.city}, ${found.state}.`
        : `Found pharmacy record for NCPDP ID **${id}**:`,
      data: (
        <div style={{ padding: '16px', borderRadius: 8, background: '#FAFBFF', border: '1px solid #EEF1F8' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#2968B0', marginBottom: 10 }}>Pharmacy Profile — {id}</div>
          {[
            ['DBA Name', found?.name || 'Option Care Health'],
            ['Location', found ? `${found.city}, ${found.state}` : 'Los Angeles, CA'],
            ['NPI', found?.npi || '1700186859'],
            ['Type', found?.type || 'Specialty'],
            ['DEA Status', found?.dea || 'Active'],
            ['Networks', String(found?.networks || 5)],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
            </div>
          ))}
        </div>
      ),
    };
  }

  /* ── 24/7 pharmacies ── */
  if (l.includes('24/7') || l.includes('24 hour') || l.includes('open late')) {
    const cityMatch = l.match(/(?:near|in)\s+([a-z\s]+?)(?:,|\s+tx|\s+ca|\s+fl|$)/i);
    const city = cityMatch ? cityMatch[1].trim() : 'your area';
    return {
      text: `Found **38 pharmacies** open 24/7 near ${city}. Filtered from 81,500 records:`,
      data: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { name: 'CVS Pharmacy #4182', city: 'Houston, TX', hours: '24/7', type: 'Retail', networks: 8 },
            { name: 'Walgreens #12044', city: 'Houston, TX', hours: '24/7', type: 'Retail', networks: 6 },
            { name: 'HEB Pharmacy #0281', city: 'Sugar Land, TX', hours: '24/7', type: 'Retail', networks: 5 },
          ].map((p, i) => (
            <div key={i} style={{ padding: '12px 16px', borderRadius: 8, background: '#FAFBFF', border: '1px solid #EEF1F8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                <Badge variant="success">{p.hours}</Badge>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>{p.city} · {p.type} · {p.networks} networks</div>
            </div>
          ))}
          <div style={{ padding: '8px 16px', borderRadius: 8, background: '#FAFBFF', border: '1px solid #EEF1F8', fontSize: 12, color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Showing 3 of 38 results</span>
            <button className="btn-primary" style={{ fontSize: 11, padding: '4px 14px' }}>View All</button>
          </div>
        </div>
      ),
    };
  }

  /* ── Specialty pharmacies by state ── */
  if (l.includes('specialty') && (l.includes('california') || l.includes(' ca') || l.includes('find') || l.includes('list') || l.includes('show'))) {
    const caResults = pharmacyResults.filter(p => p.type === 'Specialty');
    return {
      text: `Found **${caResults.length > 0 ? '512' : '512'} specialty pharmacies** in California. Showing top results from 81,500 records:`,
      data: (
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #EEF1F8' }}>
          <table className="data-table" style={{ margin: 0 }}>
            <thead><tr><th>Pharmacy</th><th>City</th><th>Type</th><th>DEA</th><th>Networks</th></tr></thead>
            <tbody>
              {pharmacyResults.filter(p => p.type === 'Specialty' || p.state === 'CA').slice(0, 6).map(p => (
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
          <div style={{ padding: '8px 16px', borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Showing 6 of 512 specialty pharmacies in CA</span>
            <button className="btn-primary" style={{ fontSize: 11, padding: '4px 14px' }}>Export Full List</button>
          </div>
        </div>
      ),
    };
  }

  /* ── Batch download / export ── */
  if (l.includes('download') || l.includes('bulk') || l.includes('batch') || l.includes('csv') || l.includes('export pharm') || l.includes('export demo')) {
    const isSchedule = l.includes('schedule') || l.includes('weekly');
    const stateFilter = l.match(/\b(tx|fl|ca|ny|il)\b/gi);
    return {
      text: isSchedule
        ? `Scheduled **weekly batch download** every Monday at 6:00 AM ET. Estimated 81,500 records per run.`
        : `Batch download ready. **${stateFilter ? stateFilter.length * 8200 : 81500} records** ${stateFilter ? `for ${stateFilter.join(', ').toUpperCase()}` : 'across all states'} prepared for export:`,
      data: (
        <div style={{ padding: '16px', borderRadius: 8, background: '#FAFBFF', border: '1px solid #EEF1F8' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#D97706', marginBottom: 8 }}>{isSchedule ? 'Scheduled Job Config' : 'Export Details'}</div>
          {(isSchedule
            ? [['Schedule', 'Every Monday 6:00 AM ET'], ['Format', 'CSV'], ['Records', '~81,500 per run'], ['Filter', 'Chain pharmacies only'], ['Delivery', 'SFTP + email notification'], ['Status', 'Active']]
            : [['Records', stateFilter ? `${stateFilter.length * 8200}` : '81,500'], ['States', stateFilter ? stateFilter.join(', ').toUpperCase() : 'All 50'], ['Format', 'CSV'], ['File Size', stateFilter ? '~48 MB' : '~210 MB'], ['Includes', 'Demographics, credentials, networks'], ['Status', 'Ready to download']]
          ).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
            </div>
          ))}
          <button className="btn-primary" style={{ width: '100%', marginTop: 10, justifyContent: 'center', fontSize: 13 }}>
            {isSchedule ? 'View Scheduled Jobs' : 'Download Now'}
          </button>
        </div>
      ),
    };
  }

  /* ── Desert / rural / coverage gaps ── */
  if (l.includes('desert') || l.includes('rural') || l.includes('gap') || l.includes('underserved')) {
    return {
      text: `Identified **12 pharmacy desert zones** across the network. 3 are in the Southeast with critical access gaps:`,
      data: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { zone: 'Rural East Texas (7 counties)', pop: '182,000', pharmacies: 4, gap: 'Critical', needed: 8 },
            { zone: 'South Georgia corridor', pop: '94,000', pharmacies: 2, gap: 'Critical', needed: 5 },
            { zone: 'Central Appalachia (WV/KY)', pop: '127,000', pharmacies: 6, gap: 'Moderate', needed: 4 },
          ].map((z, i) => (
            <div key={i} style={{ padding: '12px 16px', borderRadius: 8, background: z.gap === 'Critical' ? '#FEF2F2' : '#FFFBF5', border: `1px solid ${z.gap === 'Critical' ? '#FECACA' : '#FDE68A'}`, borderLeft: `3px solid ${z.gap === 'Critical' ? '#DC2626' : '#F59E0B'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{z.zone}</span>
                <Badge variant={z.gap === 'Critical' ? 'danger' : 'warning'}>{z.gap}</Badge>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>Pop: {z.pop} · {z.pharmacies} pharmacies · Need {z.needed} more</div>
            </div>
          ))}
        </div>
      ),
    };
  }

  /* ── Generic pharmacy search ── */
  if (l.includes('find') || l.includes('search') || l.includes('look') || l.includes('pharmacy') || l.includes('show')) {
    return {
      text: `Searched **81,500 pharmacy records**. Here are results matching your query:`,
      data: (
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #EEF1F8' }}>
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
    text: `I have real-time access to **81,500 pharmacy records** across all 50 states, connected to all dataQ.ai tools and 33 specialized agents.\n\nI can help you with:\n\n• **WebConnect** — pharmacy search, profiles, credential verification\n• **Compliance** — DEA, license, FWA attestation auditing\n• **Network Analysis** — adequacy scoring, coverage gaps, state breakdown\n• **Alerts** — real-time credential and compliance monitoring\n• **Reports** — on-demand custom report generation\n• **Agent Library** — run any of our 33 AI agents from here\n• **CHOW Tracker** — ownership change monitoring\n• **Batch Downloads** — bulk data export\n\nTry asking: *"Show pharmacies with DEA expiring"* or *"What's our compliance score?"*`,
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
    key: 'webconnect', label: 'WebConnect', Icon: IconSearch, accent: '#2968B0',
    questions: [
      'Find all specialty pharmacies in California',
      'Look up pharmacy by NCPDP ID 0512345',
      'Show 24/7 pharmacies near Houston, TX',
      'List compounding pharmacies in Texas',
      'Show compounding pharmacies in Virginia',
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
    key: 'compounding', label: 'Compounding', Icon: IconShield, accent: '#059669',
    questions: [
      'List all compounding pharmacies in Texas',
      'Show compounding pharmacies in Virginia',
      'How many compounding pharmacies are in California?',
      'Find sterile compounding pharmacies near Houston',
      'Which states have the most compounding pharmacies?',
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
    key: 'chow', label: 'CHOW Tracker', Icon: IconStore, accent: '#2968B0',
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
      'Which states are below the adequacy threshold?',
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
      'Show pharmacies that attested FWA in the last 30 days',
      'List independent pharmacies missing FWA attestation for 2025',
      'Which independent pharmacies have not completed FWA attestation for 2026?',
      'Show all critical alerts requiring action',
      'Run FWA attestation status check',
    ],
  },
];

/* ── Build reply text for AgentChat ───────────────────────────────── */
function buildBotReply(msg: string): string {
  const l = msg.toLowerCase();
  if (l.includes('dea') || l.includes('expir') || l.includes('creden'))
    return `Found **247 pharmacies** with DEA credential issues across your network.\n\nTX leads with 89 affected, followed by CA (72) and FL (41). 2 have expired DEA requiring immediate action.\n\nDetailed results with risk scoring are in the output panel →`;
  if (l.includes('fwa') || l.includes('fraud') || l.includes('waste') || l.includes('attest'))
    return `FWA attestation status: **73,350 of 81,500 pharmacies** (90%) have completed attestation.\n\n8,150 independent pharmacies still pending for 2026. TX has the most missing (1,220), followed by CA (980) and FL (840).\n\nFull breakdown in the output panel →`;
  if (l.includes('compliance') || l.includes('audit') || l.includes('score'))
    return `Compliance dashboard summary — overall score: **94/100**.\n\nAll critical standards met. DEA compliance: 98%. FWA attestation: 90%. 2 areas need review before Apr 30 audit.\n\nDetailed metrics in the output panel →`;
  if (l.includes('network') || l.includes('adequacy') || l.includes('coverage') || l.includes('geographic'))
    return `Network analysis across 8 monitored states. Overall adequacy: **94.2%** — above minimum threshold of 90%.\n\n6 states flagged for review. 3 coverage gaps identified in Southeast.\n\nState-by-state breakdown in the output panel →`;
  if (l.includes('compound'))
    return `Found **2,840 compounding pharmacies** across 81,500 total records.\n\nTop states: CA (512), TX (347), FL (296), NY (231). Both sterile and non-sterile facilities included.\n\nResults table in the output panel →`;
  if (l.includes('specialty') || l.includes('california'))
    return `Found **512 specialty pharmacies** in California from 81,500 records.\n\nTop cities: Los Angeles (94), San Diego (67), San Francisco (58), Sacramento (42). Filtered by active DEA.\n\nFull results in the output panel →`;
  if (l.includes('report') || l.includes('export') || l.includes('generat'))
    return `Custom Report Builder is ready. Suggested: **Credential Expiry Report** for Q1 2026.\n\nScope: All 81,500 pharmacies. Estimated: ~1,180 matches. Available as PDF, Excel, or CSV.\n\nExport options in the output panel →`;
  if (l.includes('ownership') || l.includes('contract') || l.includes('chow') || l.includes('transfer'))
    return `Contract Intelligence detected **18 ownership changes** this month.\n\n4 are high priority requiring contract renegotiation. Green Valley Pharmacy and Metro Drugs flagged for immediate review.\n\nCHOW details in the output panel →`;
  if (l.includes('download') || l.includes('bulk') || l.includes('batch') || l.includes('csv'))
    return `Batch download prepared. **81,500 records** ready for export across all states.\n\nAvailable formats: CSV (~210 MB), JSON (~340 MB), SQL query. SFTP delivery or direct download.\n\nExport options in the output panel →`;
  if (l.includes('closure') || l.includes('closed') || l.includes('desert') || l.includes('rural'))
    return `Identified **12 pharmacy desert zones** across the network. 3 in Southeast with critical access gaps.\n\nRural East TX has only 4 pharmacies for 182,000 population. Closure prediction model flagged 18 high-risk pharmacies.\n\nAnalysis in the output panel →`;
  if (l.includes('alert') || l.includes('critical'))
    return `There are **2 active subscriptions nearing expiration**. No critical compliance violations detected.\n\nBoth flagged for renewal review. Overall alert volume down from last month.\n\nAlert details in the output panel →`;
  if (l.includes('api') || l.includes('usage'))
    return `API usage is **up 12% month-over-month** with 200K calls today.\n\nREST endpoints drive 67% of traffic. Peak hour: 10-11 AM ET. Top endpoint: /pharmacy/search.\n\nUsage charts in the output panel →`;
  if (l.includes('ncpdp id') || l.includes('look up'))
    return `Found pharmacy record for the requested NCPDP ID.\n\nProfile includes DBA name, NPI, DEA status, network memberships, and credential history.\n\nFull profile in the output panel →`;
  if (l.includes('24/7') || l.includes('24 hour'))
    return `Found **38 pharmacies** open 24/7 near the requested area.\n\nIncludes major chains (CVS, Walgreens, HEB) and independents. Filtered from 81,500 records.\n\nResults table in the output panel →`;
  return `Searched **81,500 pharmacy records** based on your query.\n\nFound 247 matching results with detailed profiles, credential status, and network memberships.\n\nFull results with charts, SQL, and export options in the output panel →`;
}

/* ── Build query-specific output context ──────────────────────────── */
function buildQueryContext(msg: string): QueryContext {
  const l = msg.toLowerCase();

  /* DEA / Credentials */
  if (l.includes('dea') || l.includes('expir') || l.includes('creden')) return {
    rows: [
      { ncpdp: '2810042', name: 'Accredo Health Group', city: 'Houston', state: 'TX', type: 'Specialty', status: 'Active', dea: 'Expiring', phone: '(713) 654-4120' },
      { ncpdp: '0556789', name: 'BrightSpring Health Services', city: 'Sacramento', state: 'CA', type: 'Specialty', status: 'Active', dea: 'Expiring', phone: '(916) 443-7230' },
      { ncpdp: '0501234', name: 'CarePharma Holdings', city: 'Long Beach', state: 'CA', type: 'Specialty', status: 'Active', dea: 'Expiring', phone: '(562) 435-9230' },
      { ncpdp: '0412893', name: 'Coram CVS Specialty Infusion', city: 'Denver', state: 'CO', type: 'Infusion', status: 'Inactive', dea: 'Expired', phone: '(720) 891-5430' },
      { ncpdp: '7623041', name: 'Orsini Specialty Pharmacy', city: 'New York', state: 'NY', type: 'Specialty', status: 'Inactive', dea: 'Expired', phone: '(212) 389-4470' },
      { ncpdp: '8832014', name: 'AdhereHealth Pharmacy', city: 'Nashville', state: 'TN', type: 'Specialty', status: 'Active', dea: 'Expiring', phone: '(615) 921-3420' },
    ],
    sql: `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state, c.dea_status, c.dea_expires
FROM pharmacies p JOIN credentials c ON p.ncpdp_id = c.ncpdp_id
WHERE c.dea_status IN ('Expiring','Expired')
ORDER BY c.dea_expires ASC LIMIT 247`,
    insights: [
      { text: '2 pharmacies have expired DEA — removed from active dispensing', type: 'danger' },
      { text: '4 DEA registrations expiring within 60 days — renewal notices sent', type: 'warning' },
      { text: 'TX has 89 expiring DEAs — highest concentration nationally', type: 'info' },
    ],
    stats: [
      { label: 'DEA Issues', value: '247', color: '#DC2626', bg: '#FEF2F2' },
      { label: 'Expired', value: '2', color: '#DC2626', bg: '#FEF2F2' },
      { label: 'Expiring <30d', value: '89', color: '#D97706', bg: '#FFF7ED' },
      { label: 'Expiring <90d', value: '156', color: '#D97706', bg: '#FFF7ED' },
    ],
    barData: [{ label: 'TX', value: 89 }, { label: 'CA', value: 72 }, { label: 'FL', value: 41 }, { label: 'NY', value: 28 }, { label: 'TN', value: 17 }],
    barLabel: 'DEA Issues by State',
    pieData: [{ name: 'Expiring <30d', value: 89, color: '#DC2626' }, { name: 'Expiring 30-60d', value: 67, color: '#F59E0B' }, { name: 'Expiring 60-90d', value: 89, color: '#2968B0' }, { name: 'Expired', value: 2, color: '#111827' }],
    pieLabel: 'DEA Expiry Timeline',
    trendData: [{ month: 'Oct', primary: 18, secondary: 42 }, { month: 'Nov', primary: 22, secondary: 38 }, { month: 'Dec', primary: 15, secondary: 51 }, { month: 'Jan', primary: 28, secondary: 44 }, { month: 'Feb', primary: 31, secondary: 40 }, { month: 'Mar', primary: 24, secondary: 47 }],
    trendLabel: 'Monthly DEA Expirations vs Renewals',
    trendKeys: ['Expired', 'Renewed'],
    totalResults: 247, execTime: '0.62s',
    canvasLabel: '247 DEA issues found',
    followUps: ['Show only expired DEA', 'Filter by state: TX', 'Export DEA expiry report', 'View renewal queue'],
    chatInsights: [{ icon: 'warning', text: '2 pharmacies have fully expired DEA — network access suspended', color: '#DC2626' }, { icon: 'location', text: 'Texas leads with 89 DEA issues — 36% of total', color: '#2968B0' }, { icon: 'stat', text: '156 renewals due within 90 days — auto-notifications sent', color: '#059669' }],
  };

  /* FWA / Attestation */
  if (l.includes('fwa') || l.includes('fraud') || l.includes('waste') || l.includes('attest')) return {
    rows: [
      { ncpdp: '0842901', name: 'Sunrise Drugs LLC', city: 'Las Vegas', state: 'NV', type: 'Independent', status: 'Active', dea: 'Valid', phone: '(702) 384-1120' },
      { ncpdp: '1290455', name: 'FastRx Pharmacy', city: 'Miami', state: 'FL', type: 'Independent', status: 'Active', dea: 'Valid', phone: '(305) 221-8840' },
      { ncpdp: '3451082', name: 'Valley Health Rx', city: 'Dallas', state: 'TX', type: 'Independent', status: 'Active', dea: 'Valid', phone: '(214) 748-3920' },
      { ncpdp: '5501340', name: 'QuickMeds #2041', city: 'Houston', state: 'TX', type: 'Independent', status: 'Active', dea: 'Valid', phone: '(713) 529-4110' },
      { ncpdp: '7820112', name: 'Family First Rx', city: 'Orlando', state: 'FL', type: 'Independent', status: 'Active', dea: 'Valid', phone: '(407) 812-3340' },
      { ncpdp: '6102894', name: 'Harbor Rx Group', city: 'San Diego', state: 'CA', type: 'Independent', status: 'Active', dea: 'Valid', phone: '(619) 291-7720' },
    ],
    sql: `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state, f.attestation_year, f.status
FROM pharmacies p JOIN fwa_attestations f ON p.ncpdp_id = f.ncpdp_id
WHERE p.pharmacy_type = 'Independent' AND f.status != 'Complete'
ORDER BY f.attestation_year DESC, p.state LIMIT 8150`,
    insights: [
      { text: '8,150 independent pharmacies missing FWA attestation for 2026', type: 'danger' },
      { text: '90% overall attestation rate — 73,350 of 81,500 attested', type: 'success' },
      { text: 'TX has 1,220 missing attestations — highest gap by state', type: 'warning' },
    ],
    stats: [
      { label: 'Total Pharmacies', value: '81,500', color: '#2968B0', bg: '#F0F7FF' },
      { label: 'Attested', value: '73,350', color: '#059669', bg: '#ECFDF5' },
      { label: 'Pending', value: '6,480', color: '#D97706', bg: '#FFF7ED' },
      { label: 'Not Started', value: '1,670', color: '#DC2626', bg: '#FEF2F2' },
    ],
    barData: [{ label: 'TX', value: 1220 }, { label: 'CA', value: 980 }, { label: 'FL', value: 840 }, { label: 'NY', value: 620 }, { label: 'IL', value: 510 }],
    barLabel: 'Missing FWA Attestations by State',
    pieData: [{ name: 'Attested', value: 73350, color: '#059669' }, { name: 'Pending', value: 6480, color: '#F59E0B' }, { name: 'Not Started', value: 1670, color: '#DC2626' }],
    pieLabel: 'FWA Attestation Status',
    trendData: [{ month: 'Oct', primary: 3200, secondary: 9800 }, { month: 'Nov', primary: 3800, secondary: 9200 }, { month: 'Dec', primary: 4100, secondary: 8900 }, { month: 'Jan', primary: 4600, secondary: 8600 }, { month: 'Feb', primary: 3900, secondary: 8400 }, { month: 'Mar', primary: 4218, secondary: 8150 }],
    trendLabel: 'Monthly Attestations vs Remaining Gap',
    trendKeys: ['New Attestations', 'Still Missing'],
    totalResults: 8150, execTime: '1.12s',
    canvasLabel: '8,150 missing attestations',
    followUps: ['Show only 2026 missing', 'Filter TX independents', 'Export non-attested list', 'View attestation trend'],
    chatInsights: [{ icon: 'warning', text: '8,150 independent pharmacies have not completed FWA for 2026', color: '#DC2626' }, { icon: 'stat', text: '90% overall attestation rate — 73,350 of 81,500 complete', color: '#059669' }, { icon: 'location', text: 'TX has largest gap: 1,220 missing attestations', color: '#2968B0' }],
  };

  /* Compliance / Audit */
  if (l.includes('compliance') || l.includes('audit') || l.includes('score')) return {
    rows: complianceMetrics.map((m, i) => ({
      ncpdp: `METRIC-${i}`, name: m.label, city: '', state: '', type: m.status === 'pass' ? 'Pass' : 'Review', status: m.status === 'pass' ? 'Active' : 'Inactive', dea: `${m.score}%`, phone: m.detail,
    })),
    sql: `SELECT metric_name, score, status, detail, last_checked
FROM compliance_dashboard
WHERE report_period = 'Q1-2026'
ORDER BY score ASC`,
    insights: [
      { text: 'Overall compliance score 94/100 — all critical standards met', type: 'success' },
      { text: 'FWA attestation at 90% — 8,150 pharmacies still pending', type: 'warning' },
      { text: 'DEA compliance at 98% — 2 expired registrations flagged', type: 'info' },
    ],
    stats: [
      { label: 'Overall Score', value: '94', color: '#059669', bg: '#ECFDF5' },
      { label: 'DEA', value: '98%', color: '#059669', bg: '#ECFDF5' },
      { label: 'FWA', value: '90%', color: '#D97706', bg: '#FFF7ED' },
      { label: 'State License', value: '99%', color: '#059669', bg: '#ECFDF5' },
    ],
    barData: complianceMetrics.map(m => ({ label: m.label.slice(0, 12), value: m.score })),
    barLabel: 'Compliance Scores by Category',
    pieData: [{ name: 'Passing', value: 4, color: '#059669' }, { name: 'Warning', value: 2, color: '#F59E0B' }],
    pieLabel: 'Standards Status',
    trendData: [{ month: 'Oct', primary: 91, secondary: 3 }, { month: 'Nov', primary: 92, secondary: 2 }, { month: 'Dec', primary: 93, secondary: 2 }, { month: 'Jan', primary: 93, secondary: 2 }, { month: 'Feb', primary: 94, secondary: 2 }, { month: 'Mar', primary: 94, secondary: 2 }],
    trendLabel: 'Compliance Score Trend',
    trendKeys: ['Score', 'Issues'],
    totalResults: 6, execTime: '0.34s',
    canvasLabel: '6 compliance metrics',
    followUps: ['Show FWA details', 'DEA compliance breakdown', 'Generate compliance PDF', 'Compare Q1 vs Q4'],
    chatInsights: [{ icon: 'stat', text: 'Overall score 94/100 — above 90 benchmark', color: '#059669' }, { icon: 'warning', text: 'FWA attestation at 90% — below 95% target', color: '#D97706' }, { icon: 'info', text: 'Next audit deadline: April 30, 2026', color: '#2968B0' }],
  };

  /* Network / Geographic / Adequacy */
  if (l.includes('network') || l.includes('adequacy') || l.includes('coverage') || l.includes('geographic') || l.includes('desert') || l.includes('rural') || l.includes('gap')) return {
    rows: stateBreakdown.map(s => ({
      ncpdp: s.state, name: `${s.state} Network`, city: '', state: s.state, type: s.pct >= 80 ? 'Pass' : 'Review', status: s.pct >= 80 ? 'Active' : 'Inactive', dea: `${s.pct}%`, phone: s.count.toLocaleString() + ' pharmacies',
    })),
    sql: `SELECT state, COUNT(*) AS pharmacy_count,
       ROUND(COUNT(*) * 100.0 / required_count, 1) AS adequacy_pct
FROM pharmacies p JOIN state_requirements r ON p.state = r.state
WHERE p.active = true
GROUP BY p.state ORDER BY adequacy_pct ASC`,
    insights: [
      { text: 'Overall adequacy 94.2% — above 90% minimum threshold', type: 'success' },
      { text: '12 pharmacy desert zones identified — 3 critical in Southeast', type: 'danger' },
      { text: 'Rural East TX has only 4 pharmacies for 182K population', type: 'warning' },
    ],
    stats: [
      { label: 'States Analyzed', value: '50', color: '#2968B0', bg: '#F0F7FF' },
      { label: 'Adequate', value: '44', color: '#059669', bg: '#ECFDF5' },
      { label: 'Below Threshold', value: '6', color: '#DC2626', bg: '#FEF2F2' },
      { label: 'Desert Zones', value: '12', color: '#D97706', bg: '#FFF7ED' },
    ],
    barData: stateBreakdown.map(s => ({ label: s.state, value: s.count })),
    barLabel: 'Pharmacy Count by State',
    pieData: [{ name: 'Exceeds (>95%)', value: 28, color: '#059669' }, { name: 'Meets (90-95%)', value: 16, color: '#2968B0' }, { name: 'Below (<90%)', value: 6, color: '#DC2626' }],
    pieLabel: 'Adequacy Distribution',
    trendData: [{ month: 'Oct', primary: 78200, secondary: 3200 }, { month: 'Nov', primary: 79100, secondary: 2900 }, { month: 'Dec', primary: 79800, secondary: 2700 }, { month: 'Jan', primary: 80200, secondary: 2500 }, { month: 'Feb', primary: 80900, secondary: 2300 }, { month: 'Mar', primary: 81500, secondary: 2100 }],
    trendLabel: 'Network Growth vs Underserved Areas',
    trendKeys: ['Active Pharmacies', 'Underserved Pop (K)'],
    totalResults: 50, execTime: '0.91s',
    canvasLabel: '50 states analyzed',
    followUps: ['Show desert zones only', 'Filter below-threshold states', 'Export adequacy report', 'View rural county detail'],
    chatInsights: [{ icon: 'stat', text: 'Overall adequacy 94.2% — 44 of 50 states meet threshold', color: '#059669' }, { icon: 'warning', text: '12 pharmacy desert zones — 3 critical in Southeast', color: '#DC2626' }, { icon: 'location', text: 'Rural East TX: 4 pharmacies serving 182,000 population', color: '#D97706' }],
  };

  /* Compounding */
  if (l.includes('compound')) return {
    rows: [
      { ncpdp: '0678234', name: 'NuVision Compounding Pharmacy', city: 'Houston', state: 'TX', type: 'Sterile', status: 'Active', dea: 'Valid', phone: '(713) 781-4200' },
      { ncpdp: '0891456', name: 'Wedgewood Village Pharmacy', city: 'Dallas', state: 'TX', type: 'Non-Sterile', status: 'Active', dea: 'Valid', phone: '(214) 521-8900' },
      { ncpdp: '0234789', name: 'Stokes Pharmacy', city: 'San Antonio', state: 'TX', type: 'Sterile & Non-Sterile', status: 'Active', dea: 'Valid', phone: '(210) 349-1700' },
      { ncpdp: '0456123', name: 'PCCA Member Pharmacy', city: 'Austin', state: 'TX', type: 'Non-Sterile', status: 'Active', dea: 'Valid', phone: '(512) 467-3200' },
      { ncpdp: '0912345', name: 'Empower Pharmacy', city: 'Houston', state: 'TX', type: 'Sterile', status: 'Active', dea: 'Valid', phone: '(832) 678-4100' },
      { ncpdp: '0345678', name: 'Valor Compounding Pharmacy', city: 'Fort Worth', state: 'TX', type: 'Non-Sterile', status: 'Active', dea: 'Valid', phone: '(817) 292-3800' },
    ],
    sql: `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state, p.compounding_type
FROM pharmacies p
WHERE p.dispenser_class LIKE '%Compounding%'
  AND p.state = 'TX' AND p.active = true
ORDER BY p.city, p.pharmacy_name LIMIT 347`,
    insights: [
      { text: '347 compounding pharmacies in Texas — 3rd largest state for compounding', type: 'info' },
      { text: '142 sterile, 205 non-sterile facilities in TX', type: 'success' },
      { text: 'Houston metro has 89 compounding pharmacies — highest concentration', type: 'info' },
    ],
    stats: [
      { label: 'TX Compounding', value: '347', color: '#059669', bg: '#ECFDF5' },
      { label: 'Sterile', value: '142', color: '#2968B0', bg: '#F0F7FF' },
      { label: 'Non-Sterile', value: '205', color: '#D97706', bg: '#FFF7ED' },
      { label: 'National Total', value: '2,840', color: '#334155', bg: '#F8FAFC' },
    ],
    barData: [{ label: 'CA', value: 512 }, { label: 'TX', value: 347 }, { label: 'FL', value: 296 }, { label: 'NY', value: 231 }, { label: 'OH', value: 178 }],
    barLabel: 'Compounding Pharmacies by State',
    pieData: [{ name: 'Sterile', value: 142, color: '#2968B0' }, { name: 'Non-Sterile', value: 205, color: '#10B981' }],
    pieLabel: 'Compounding Type (TX)',
    trendData: [{ month: 'Oct', primary: 328, secondary: 12 }, { month: 'Nov', primary: 332, secondary: 8 }, { month: 'Dec', primary: 335, secondary: 10 }, { month: 'Jan', primary: 339, secondary: 6 }, { month: 'Feb', primary: 343, secondary: 9 }, { month: 'Mar', primary: 347, secondary: 7 }],
    trendLabel: 'TX Compounding Growth',
    trendKeys: ['Active', 'New Openings'],
    totalResults: 347, execTime: '0.48s',
    canvasLabel: '347 compounding pharmacies',
    followUps: ['Filter sterile only', 'Show Houston metro', 'Compare TX vs CA', 'Export compounding list'],
    chatInsights: [{ icon: 'stat', text: '347 compounding pharmacies in Texas — 3rd largest state', color: '#059669' }, { icon: 'info', text: '142 sterile + 205 non-sterile facilities', color: '#2968B0' }, { icon: 'location', text: 'Houston metro leads with 89 compounding pharmacies', color: '#2968B0' }],
  };

  /* Specialty / California */
  if (l.includes('specialty') || l.includes('california')) return {
    rows: pharmacyResults.filter(p => p.state === 'CA').map(p => ({ ncpdp: p.id, name: p.name, city: p.city, state: p.state, type: p.type, status: p.status === 'active' ? 'Active' : 'Active', dea: p.dea === 'Active' ? 'Valid' : p.dea, phone: '—' })),
    sql: `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state, p.provider_type, c.dea_status
FROM pharmacies p JOIN credentials c ON p.ncpdp_id = c.ncpdp_id
WHERE p.state = 'CA' AND p.provider_type = 'Specialty' AND p.active = true
ORDER BY p.city, p.pharmacy_name LIMIT 512`,
    insights: [
      { text: '512 specialty pharmacies active in California', type: 'success' },
      { text: 'Los Angeles metro leads with 94 specialty facilities', type: 'info' },
      { text: '3 pharmacies have DEA expiring within 30 days', type: 'warning' },
    ],
    stats: [
      { label: 'CA Specialty', value: '512', color: '#2968B0', bg: '#F0F7FF' },
      { label: 'Los Angeles', value: '94', color: '#059669', bg: '#ECFDF5' },
      { label: 'San Diego', value: '67', color: '#059669', bg: '#ECFDF5' },
      { label: 'San Francisco', value: '58', color: '#059669', bg: '#ECFDF5' },
    ],
    barData: [{ label: 'LA', value: 94 }, { label: 'SD', value: 67 }, { label: 'SF', value: 58 }, { label: 'SAC', value: 42 }, { label: 'SJ', value: 38 }, { label: 'Other', value: 213 }],
    barLabel: 'CA Specialty Pharmacies by City',
    pieData: [{ name: 'Oncology', value: 128, color: '#DC2626' }, { name: 'Infusion', value: 96, color: '#2968B0' }, { name: 'Rare Disease', value: 74, color: '#10B981' }, { name: 'HIV/Hep', value: 62, color: '#F59E0B' }, { name: 'Other', value: 152, color: '#94A3B8' }],
    pieLabel: 'Specialty Focus Areas (CA)',
    trendData: [{ month: 'Oct', primary: 488, secondary: 12 }, { month: 'Nov', primary: 493, secondary: 8 }, { month: 'Dec', primary: 498, secondary: 10 }, { month: 'Jan', primary: 502, secondary: 6 }, { month: 'Feb', primary: 508, secondary: 9 }, { month: 'Mar', primary: 512, secondary: 7 }],
    trendLabel: 'CA Specialty Pharmacy Growth',
    trendKeys: ['Active', 'New Openings'],
    totalResults: 512, execTime: '0.71s',
    canvasLabel: '512 specialty pharmacies',
    followUps: ['Filter Los Angeles only', 'Show oncology focus', 'Export CA specialty list', 'Compare by city'],
    chatInsights: [{ icon: 'stat', text: '512 active specialty pharmacies in California', color: '#059669' }, { icon: 'location', text: 'Los Angeles leads with 94 specialty facilities', color: '#2968B0' }, { icon: 'warning', text: '3 pharmacies have DEA expiring within 30 days', color: '#D97706' }],
  };

  /* CHOW / Ownership */
  if (l.includes('ownership') || l.includes('contract') || l.includes('chow') || l.includes('transfer')) return {
    rows: [
      { ncpdp: '7820112', name: 'HealthMart RX', city: 'Phoenix', state: 'AZ', type: 'Ownership Change', status: 'Active', dea: 'Valid', phone: '(602) 271-3300' },
      { ncpdp: '1290455', name: 'Wellness Drug Store', city: 'Miami', state: 'FL', type: 'Ownership Change', status: 'Active', dea: 'Valid', phone: '(305) 221-8840' },
      { ncpdp: '6455901', name: 'Valley Health Pharmacy', city: 'Fresno', state: 'CA', type: 'Ownership Change', status: 'Active', dea: 'Valid', phone: '(559) 229-3100' },
      { ncpdp: '3451082', name: 'Green Valley Pharmacy', city: 'Seattle', state: 'WA', type: 'Ownership Change', status: 'Active', dea: 'Valid', phone: '(206) 555-0671' },
    ],
    sql: `SELECT p.ncpdp_id, p.pharmacy_name, o.old_owner, o.new_owner, o.change_date, o.status
FROM pharmacies p JOIN ownership_changes o ON p.ncpdp_id = o.ncpdp_id
WHERE o.change_date >= NOW() - INTERVAL '30 days'
ORDER BY o.change_date DESC`,
    insights: [
      { text: '18 ownership changes detected this month — 4 high priority', type: 'warning' },
      { text: '2 changes require contract renegotiation with PBM networks', type: 'danger' },
      { text: 'All changed pharmacies maintained active DEA status', type: 'success' },
    ],
    stats: [
      { label: 'Total CHOW', value: '18', color: '#D97706', bg: '#FFF7ED' },
      { label: 'High Priority', value: '4', color: '#DC2626', bg: '#FEF2F2' },
      { label: 'Processed', value: '12', color: '#059669', bg: '#ECFDF5' },
      { label: 'Pending', value: '6', color: '#D97706', bg: '#FFF7ED' },
    ],
    barData: [{ label: 'CA', value: 5 }, { label: 'TX', value: 4 }, { label: 'FL', value: 3 }, { label: 'AZ', value: 2 }, { label: 'WA', value: 2 }, { label: 'Other', value: 2 }],
    barLabel: 'Ownership Changes by State',
    pieData: [{ name: 'Completed', value: 12, color: '#059669' }, { name: 'Under Review', value: 4, color: '#F59E0B' }, { name: 'Pending', value: 2, color: '#DC2626' }],
    pieLabel: 'CHOW Processing Status',
    trendData: [{ month: 'Oct', primary: 12, secondary: 8 }, { month: 'Nov', primary: 15, secondary: 10 }, { month: 'Dec', primary: 10, secondary: 6 }, { month: 'Jan', primary: 14, secondary: 9 }, { month: 'Feb', primary: 16, secondary: 11 }, { month: 'Mar', primary: 18, secondary: 12 }],
    trendLabel: 'Monthly Ownership Changes',
    trendKeys: ['Total Changes', 'Processed'],
    totalResults: 18, execTime: '0.29s',
    canvasLabel: '18 ownership changes',
    followUps: ['Show high priority only', 'Filter pending review', 'Export CHOW report', 'View contract impact'],
    chatInsights: [{ icon: 'warning', text: '4 high-priority ownership changes require contract renegotiation', color: '#DC2626' }, { icon: 'stat', text: '12 of 18 changes fully processed — 6 still pending', color: '#D97706' }, { icon: 'info', text: 'All changed pharmacies maintained active DEA status', color: '#059669' }],
  };

  /* Batch / Download / Export */
  if (l.includes('download') || l.includes('bulk') || l.includes('batch') || l.includes('csv') || l.includes('export pharm') || l.includes('export demo')) return {
    rows: pharmacyResults.slice(0, 8).map(p => ({ ncpdp: p.id, name: p.name, city: p.city, state: p.state, type: p.type, status: 'Active', dea: p.dea === 'Active' ? 'Valid' : p.dea, phone: '—' })),
    sql: `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state, p.provider_type,
       c.dea_status, c.license_status, p.phone, p.address
FROM pharmacies p LEFT JOIN credentials c ON p.ncpdp_id = c.ncpdp_id
WHERE p.active = true
ORDER BY p.state, p.pharmacy_name`,
    insights: [
      { text: '81,500 records ready for batch export across all 50 states', type: 'success' },
      { text: 'Estimated file size: ~210 MB for CSV, ~340 MB for JSON', type: 'info' },
      { text: 'Last full export: 2 days ago — 412 records updated since', type: 'info' },
    ],
    stats: [
      { label: 'Total Records', value: '81,500', color: '#2968B0', bg: '#F0F7FF' },
      { label: 'CSV Size', value: '~210 MB', color: '#334155', bg: '#F8FAFC' },
      { label: 'Last Export', value: '2d ago', color: '#059669', bg: '#ECFDF5' },
      { label: 'Updated Since', value: '412', color: '#D97706', bg: '#FFF7ED' },
    ],
    barData: stateBreakdown.map(s => ({ label: s.state, value: s.count })),
    barLabel: 'Records by State',
    pieData: [{ name: 'Retail', value: 48200, color: '#2968B0' }, { name: 'Specialty', value: 18400, color: '#10B981' }, { name: 'LTC', value: 8900, color: '#F59E0B' }, { name: 'Other', value: 6000, color: '#94A3B8' }],
    pieLabel: 'Export by Pharmacy Type',
    trendData: [{ month: 'Oct', primary: 420, secondary: 180 }, { month: 'Nov', primary: 510, secondary: 210 }, { month: 'Dec', primary: 480, secondary: 190 }, { month: 'Jan', primary: 620, secondary: 240 }, { month: 'Feb', primary: 710, secondary: 290 }, { month: 'Mar', primary: 680, secondary: 310 }],
    trendLabel: 'Monthly New vs Deactivated',
    trendKeys: ['New Records', 'Deactivated'],
    totalResults: 81500, execTime: '2.41s',
    canvasLabel: '81,500 records ready',
    followUps: ['Download CSV now', 'Filter TX, FL, CA only', 'Schedule weekly export', 'View export history'],
    chatInsights: [{ icon: 'stat', text: '81,500 records prepared for batch export', color: '#059669' }, { icon: 'info', text: 'Estimated CSV file size: ~210 MB across all states', color: '#2968B0' }, { icon: 'info', text: '412 records updated since last export 2 days ago', color: '#D97706' }],
  };

  /* Report / Generate */
  if (l.includes('report') || l.includes('generat')) return {
    rows: pharmacyResults.slice(0, 6).map(p => ({ ncpdp: p.id, name: p.name, city: p.city, state: p.state, type: p.type, status: 'Active', dea: p.dea === 'Active' ? 'Valid' : p.dea, phone: '—' })),
    sql: `SELECT p.ncpdp_id, p.pharmacy_name, p.state, c.dea_status, c.dea_expires,
       c.license_status, f.fwa_status
FROM pharmacies p JOIN credentials c ON p.ncpdp_id = c.ncpdp_id
LEFT JOIN fwa_attestations f ON p.ncpdp_id = f.ncpdp_id
WHERE c.dea_expires BETWEEN '2026-01-01' AND '2026-03-31'
ORDER BY c.dea_expires ASC`,
    insights: [
      { text: 'Report scope: 1,180 pharmacies with DEA expiring Q1 2026', type: 'info' },
      { text: 'Available as PDF, Excel, or CSV — auto-generated in ~2 seconds', type: 'success' },
    ],
    stats: [
      { label: 'Report Scope', value: '1,180', color: '#2968B0', bg: '#F0F7FF' },
      { label: 'Period', value: 'Q1 2026', color: '#334155', bg: '#F8FAFC' },
      { label: 'Formats', value: '3', color: '#059669', bg: '#ECFDF5' },
      { label: 'Gen Time', value: '~2s', color: '#10B981', bg: '#ECFDF5' },
    ],
    barData: [{ label: 'Jan', value: 380 }, { label: 'Feb', value: 420 }, { label: 'Mar', value: 380 }],
    barLabel: 'DEA Expirations by Month (Q1)',
    pieData: [{ name: 'Retail', value: 680, color: '#2968B0' }, { name: 'Specialty', value: 340, color: '#10B981' }, { name: 'LTC', value: 160, color: '#F59E0B' }],
    pieLabel: 'Report Breakdown by Type',
    trendData: [{ month: 'Q4-24', primary: 1050, secondary: 920 }, { month: 'Q1-25', primary: 1120, secondary: 980 }, { month: 'Q2-25', primary: 980, secondary: 890 }, { month: 'Q3-25', primary: 1060, secondary: 940 }, { month: 'Q4-25', primary: 1140, secondary: 1010 }, { month: 'Q1-26', primary: 1180, secondary: 0 }],
    trendLabel: 'Quarterly DEA Expiry Volume',
    trendKeys: ['Expiring', 'Renewed on Time'],
    totalResults: 1180, execTime: '0.55s',
    canvasLabel: '1,180 in report scope',
    followUps: ['Generate PDF now', 'Export as Excel', 'Narrow to specialty only', 'Add FWA status column'],
    chatInsights: [{ icon: 'info', text: '1,180 pharmacies with DEA expiring in Q1 2026', color: '#2968B0' }, { icon: 'stat', text: 'Report auto-generates in ~2 seconds — PDF, Excel, CSV', color: '#059669' }],
  };

  /* Default / general search */
  return {
    rows: pharmacyResults.map(p => ({ ncpdp: p.id, name: p.name, city: p.city, state: p.state, type: p.type, status: 'Active', dea: p.dea === 'Active' ? 'Valid' : p.dea, phone: '—' })),
    sql: `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state, p.provider_type, c.dea_status
FROM pharmacies p LEFT JOIN credentials c ON p.ncpdp_id = c.ncpdp_id
WHERE p.active = true ORDER BY p.pharmacy_name ASC LIMIT 247`,
    insights: [
      { text: '247 results found across 81,500 pharmacy records', type: 'info' },
      { text: '94% of matched pharmacies have active DEA registrations', type: 'success' },
    ],
    stats: [
      { label: 'Results', value: '247', color: '#2968B0', bg: '#F0F7FF' },
      { label: 'Exec Time', value: '0.83s', color: '#10B981', bg: '#ECFDF5' },
      { label: 'Scanned', value: '81,500', color: '#334155', bg: '#F8FAFC' },
      { label: 'Active', value: '232', color: '#059669', bg: '#ECFDF5' },
    ],
    barData: [{ label: 'CA', value: 72 }, { label: 'TX', value: 56 }, { label: 'FL', value: 38 }, { label: 'NY', value: 24 }, { label: 'IL', value: 18 }, { label: 'Other', value: 39 }],
    barLabel: 'Results by State',
    pieData: [{ name: 'Specialty', value: 128, color: '#2968B0' }, { name: 'Retail', value: 62, color: '#10B981' }, { name: 'LTC', value: 34, color: '#F59E0B' }, { name: 'Infusion', value: 23, color: '#06B6D4' }],
    pieLabel: 'Results by Type',
    trendData: [{ month: 'Oct', primary: 78200, secondary: 420 }, { month: 'Nov', primary: 79100, secondary: 510 }, { month: 'Dec', primary: 79800, secondary: 480 }, { month: 'Jan', primary: 80200, secondary: 620 }, { month: 'Feb', primary: 80900, secondary: 710 }, { month: 'Mar', primary: 81500, secondary: 680 }],
    trendLabel: 'Network Growth (6 months)',
    trendKeys: ['Active', 'New'],
    totalResults: 247, execTime: '0.83s',
    canvasLabel: '247 results found',
    followUps: ['Filter to active only', 'Show expired DEA', 'Export results as CSV', 'Compare by state'],
    chatInsights: [{ icon: 'stat', text: '247 matching results across 81,500 records', color: '#2968B0' }, { icon: 'info', text: '94% of matched pharmacies have active DEA registrations', color: '#059669' }],
  };
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function AISearchPage() {
  const [hasQueried, setHasQueried] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [chatWidth, setChatWidth] = useState(480);
  const [activeTab, setActiveTab] = useState('webconnect');
  const [queryCtx, setQueryCtx] = useState<QueryContext | null>(null);
  const [input, setInput] = useState('');
  const [queryKey, setQueryKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(480);

  const activeCat = CATEGORIES.find(c => c.key === activeTab) || CATEGORIES[0];

  /* Transition to chat mode on first query */
  function startQuery(text: string) {
    if (!text.trim()) return;
    setHasQueried(true);
    /* Don't show output yet — handleBotReply will open it after the typing animation */
    /* Small delay lets React mount AgentChat before we try to send */
    setTimeout(() => {
      const chatInput = document.querySelector<HTMLTextAreaElement>('[data-search-chat] textarea');
      if (chatInput) {
        const nativeSet = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
        nativeSet?.call(chatInput, text);
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(() => {
          chatInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }, 50);
      }
    }, 100);
  }

  const lastGeminiRef = useRef<GeminiResponse | null>(null);

  function geminiToCtx(g: GeminiResponse): QueryContext {
    return {
      rows: g.rows,
      sql: g.sql,
      insights: g.insights,
      stats: g.stats,
      barData: g.barData,
      barLabel: g.barLabel,
      pieData: g.pieData,
      pieLabel: g.pieLabel,
      trendData: g.trendData,
      trendLabel: g.trendLabel,
      trendKeys: g.trendKeys,
      totalResults: g.totalResults,
      execTime: g.execTime,
      followUps: g.followUps,
      canvasLabel: g.canvasLabel,
      chatInsights: g.chatInsights,
    };
  }

  async function handleBotReply(msg: string): Promise<string> {
    // Try Gemini first
    const gemini = await queryGemini(msg);
    if (gemini) {
      lastGeminiRef.current = gemini;
      const ctx = geminiToCtx(gemini);
      setQueryCtx(ctx);
      setQueryKey(k => k + 1);
      setShowOutput(true);
      return gemini.replyText;
    }
    // Fallback to static
    lastGeminiRef.current = null;
    const ctx = buildQueryContext(msg);
    setQueryCtx(ctx);
    setQueryKey(k => k + 1);
    setShowOutput(true);
    return buildBotReply(msg);
  }

  function handleBotReplied(msg: string) {
    const g = lastGeminiRef.current;
    if (g) {
      return {
        insights: g.chatInsights,
        followUps: g.followUps,
        canvasLabel: g.canvasLabel,
      };
    }
    // Fallback
    const ctx = buildQueryContext(msg);
    return {
      insights: ctx.chatInsights,
      followUps: ctx.followUps,
      canvasLabel: ctx.canvasLabel,
    };
  }

  function handleGetInsights(msg: string) {
    return buildQueryContext(msg).chatInsights;
  }

  function handleGetFollowUps(msg: string) {
    return buildQueryContext(msg).followUps;
  }

  function handleGetCanvasLabel(msg: string) {
    return buildQueryContext(msg).canvasLabel;
  }

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = chatWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const delta = ev.clientX - startX.current;
      setChatWidth(Math.max(320, Math.min(800, startW.current + delta)));
    };
    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [chatWidth]);

  return (
    <>
      <Topbar
        title="AI Smart Search"
        subtitle="Unified AI intelligence across all dataQ.ai tools and data"
        actions={hasQueried ? (
          <button
            className={showOutput ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setShowOutput(o => !o)}
            style={{ fontSize: 12, gap: 5 }}
          >
            <IconBarChart size={13} color={showOutput ? '#fff' : undefined}/>
            {showOutput ? 'Hide Output' : 'Show Output'}
          </button>
        ) : undefined}
      />

      <main style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-h, 56px))', background: '#FAFBFF' }}>

        {/* ── Landing / Welcome ──────────────────────────────────── */}
        {!hasQueried && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

              {/* Hero */}
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: 'linear-gradient(145deg, #2968B0, #3A7EC8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 12px 40px rgba(41,104,176,.2)',
                marginBottom: 18,
              }}>
                <IconSparkles size={30} color="#fff"/>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-.4px' }}>
                What can I help you find?
              </h1>
              <p style={{ fontSize: 14, color: '#64748B', margin: '6px 0 0', textAlign: 'center', lineHeight: 1.5, maxWidth: 440 }}>
                Search across 81,500 pharmacy records, 33 AI agents, and all dataQ.ai tools
              </p>

              {/* Search bar */}
              <div style={{ width: '100%', maxWidth: 620, marginTop: 24 }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14,
                  boxShadow: '0 4px 20px rgba(15,23,42,.06)',
                  padding: '4px 4px 4px 16px',
                  transition: 'border-color .2s, box-shadow .2s',
                }}>
                  <IconSparkles size={17} color="#B8D5F5"/>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask anything about your pharmacy network..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') startQuery(input); }}
                    style={{
                      flex: 1, border: 'none', outline: 'none', background: 'transparent',
                      fontSize: 14.5, color: '#0F172A', padding: '11px 12px',
                    }}
                  />
                  <button
                    onClick={() => startQuery(input)}
                    disabled={!input.trim()}
                    style={{
                      width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: input.trim() ? 'linear-gradient(135deg, #2968B0, #3A7EC8)' : '#F1F5F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background .2s', flexShrink: 0,
                    }}
                  >
                    <IconSend size={15} color={input.trim() ? '#fff' : '#94A3B8'}/>
                  </button>
                </div>
              </div>

              {/* Category cards grid */}
              <div style={{ width: '100%', marginTop: 36 }}>
                {/* Category selector row */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
                  {CATEGORIES.map(cat => {
                    const active = activeTab === cat.key;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setActiveTab(cat.key)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '7px 14px', borderRadius: 10, cursor: 'pointer',
                          border: 'none',
                          background: active ? cat.accent : 'transparent',
                          color: active ? '#fff' : '#64748B',
                          fontSize: 12.5, fontWeight: active ? 600 : 500,
                          transition: 'all .15s',
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F1F5F9'; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <cat.Icon size={13} color={active ? '#fff' : '#94A3B8'}/>
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Active category — suggestions as cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: activeCat.questions.length <= 3 ? 'repeat(3,1fr)' : 'repeat(2,1fr)',
                  gap: 10,
                }}>
                  {activeCat.questions.map((q, i) => (
                    <button
                      key={`${activeTab}-${i}`}
                      onClick={() => startQuery(q)}
                      style={{
                        textAlign: 'left', cursor: 'pointer',
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '14px 16px',
                        background: '#fff',
                        border: '1px solid #E8ECF2',
                        borderRadius: 14,
                        transition: 'all .2s',
                        fontSize: 13.5, color: '#334155', lineHeight: 1.45,
                        boxShadow: '0 1px 2px rgba(15,23,42,.03)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = activeCat.accent + '60';
                        e.currentTarget.style.background = activeCat.accent + '04';
                        e.currentTarget.style.boxShadow = `0 2px 8px ${activeCat.accent}14, 0 0 0 1px ${activeCat.accent}20`;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#E8ECF2';
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(15,23,42,.03)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 1,
                        background: `linear-gradient(135deg, ${activeCat.accent}12, ${activeCat.accent}06)`,
                        border: `1px solid ${activeCat.accent}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <IconSend size={12} color={activeCat.accent}/>
                      </span>
                      <span style={{ paddingTop: 4 }}>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Chat + Output split ────────────────────────────────── */}
        {hasQueried && (
          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            {/* LEFT: Chat */}
            <div data-search-chat style={{
              display: 'flex', flexDirection: 'column',
              width: showOutput ? chatWidth : '100%',
              flexShrink: showOutput ? 0 : undefined,
              flex: showOutput ? undefined : 1,
              minHeight: 0, overflow: 'hidden', transition: 'width .2s ease',
            }}>
              <AgentChat
                agentName="AI Smart Search"
                agentId="SEARCH"
                gradient="linear-gradient(135deg, #2968B0, #3A7EC8)"
                icon={<IconSparkles size={18} color="#fff"/>}
                welcomeMessage={`Hi Sarah! I'm your **AI Smart Search** assistant with real-time access to **81,500** pharmacy records and 33 specialized agents.\n\nAsk me anything — results will appear in the output panel alongside charts, SQL, and export options.`}
                suggestions={activeCat.questions.slice(0, 4)}
                getBotReply={handleBotReply}
                getInsights={handleGetInsights}
                getFollowUps={handleGetFollowUps}
                getCanvasLabel={handleGetCanvasLabel}
                onBotReplied={handleBotReplied}
                onOpenCanvas={() => { if (queryCtx) setShowOutput(true); }}
                hideHeader
                fluid
              />
            </div>

            {/* Resize handle */}
            {showOutput && (
              <div
                onMouseDown={onMouseDown}
                style={{ width: 6, flexShrink: 0, cursor: 'col-resize', background: 'transparent', position: 'relative', zIndex: 10 }}
                onMouseEnter={e => { const line = e.currentTarget.firstElementChild as HTMLElement; if (line) line.style.background = '#5B9BD5'; }}
                onMouseLeave={e => { const line = e.currentTarget.firstElementChild as HTMLElement; if (line) line.style.background = '#E2E8F0'; }}
              >
                <div style={{ position: 'absolute', left: 2, top: 0, bottom: 0, width: 2, background: '#E2E8F0', transition: 'background .15s' }}/>
                <div style={{ position: 'absolute', left: -2, top: '50%', transform: 'translateY(-50%)', width: 10, height: 40, borderRadius: 5, background: '#CBD5E1', opacity: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="4" height="16" viewBox="0 0 4 16" fill="#94A3B8"><circle cx="2" cy="3" r="1.2"/><circle cx="2" cy="8" r="1.2"/><circle cx="2" cy="13" r="1.2"/></svg>
                </div>
              </div>
            )}

            {/* RIGHT: Output panel */}
            {showOutput && queryCtx && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <OutputPanel key={queryKey} ctx={queryCtx} title="AI Smart Search"/>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
