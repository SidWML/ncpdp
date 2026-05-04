'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/Badge';
import {
  IconSparkles, IconSend, IconDownload, IconCheck, IconReport,
  IconUser, IconRefresh, IconDatabase, IconShield, IconBarChart,
} from '@/components/ui/Icons';
import { queryGeminiReport } from '@/lib/gemini';
import type { GeminiReportResponse } from '@/lib/gemini';
import { ChatThreadsSidebar, useThreads } from '@/components/ui/ChatThreads';

/* ── Types ─────────────────────────────────────────────────────────── */
interface Msg { id: number; role: 'user' | 'bot'; text: string; reportData?: ReportData }
interface ReportData {
  title: string; date: string; records: string; states: string;
  stats: { label: string; value: string; color: string }[];
  sections: { title: string; rows: { label: string; value: string; color: string }[] }[];
}

/* ── Report templates ─────────────────────────────────────────────── */
const REPORT_MAP: Record<string, ReportData> = {
  credential: {
    title: 'Q1 2026 Credential Expiry Report', date: 'Mar 31, 2026', records: '81,500', states: '50',
    stats: [
      { label: 'Total Pharmacies', value: '81,500', color: '#005C8D' },
      { label: 'Credentials Expiring', value: '234', color: '#F59E0B' },
      { label: 'Multi-Expiry Risk', value: '12', color: '#EF4444' },
      { label: 'States with Issues', value: '23', color: '#76C799' },
    ],
    sections: [
      { title: 'Expiring by Type', rows: [
        { label: 'DEA Registration', value: '89', color: '#005C8D' },
        { label: 'State License', value: '112', color: '#F59E0B' },
        { label: 'Accreditation', value: '33', color: '#76C799' },
      ]},
      { title: 'Top States at Risk', rows: [
        { label: 'Texas', value: '28 expiring', color: '#DC2626' },
        { label: 'California', value: '24 expiring', color: '#DC2626' },
        { label: 'Florida', value: '19 expiring', color: '#F59E0B' },
        { label: 'New York', value: '16 expiring', color: '#F59E0B' },
        { label: 'Pennsylvania', value: '14 expiring', color: '#F59E0B' },
      ]},
    ],
  },
  fwa: {
    title: 'FWA Attestation Status Report', date: 'Mar 31, 2026', records: '81,500', states: '50',
    stats: [
      { label: 'Total Pharmacies', value: '81,500', color: '#005C8D' },
      { label: 'FWA Pass', value: '67,841', color: '#76C799' },
      { label: 'Under Review', value: '359', color: '#F59E0B' },
      { label: 'Failed', value: '47', color: '#EF4444' },
    ],
    sections: [
      { title: 'Risk Distribution', rows: [
        { label: 'Low Risk (0-3)', value: '64,210', color: '#76C799' },
        { label: 'Medium Risk (4-6)', value: '3,631', color: '#F59E0B' },
        { label: 'High Risk (7-8)', value: '359', color: '#F97316' },
        { label: 'Critical (9-10)', value: '47', color: '#EF4444' },
      ]},
      { title: 'Top Flags', rows: [
        { label: 'Billing anomaly', value: '142 pharmacies', color: '#DC2626' },
        { label: 'Dispensing pattern', value: '98 pharmacies', color: '#F59E0B' },
        { label: 'Ownership change', value: '67 pharmacies', color: '#005C8D' },
        { label: 'DEA mismatch', value: '52 pharmacies', color: '#F59E0B' },
      ]},
    ],
  },
  network: {
    title: 'Network Adequacy Analysis', date: 'Mar 31, 2026', records: '81,500', states: '50',
    stats: [
      { label: 'Overall Adequacy', value: '94.2%', color: '#76C799' },
      { label: 'States Passing', value: '45', color: '#005C8D' },
      { label: 'States at Risk', value: '5', color: '#F59E0B' },
      { label: 'Coverage Gaps', value: '12 zones', color: '#EF4444' },
    ],
    sections: [
      { title: 'By Region', rows: [
        { label: 'Northeast', value: '96.1%', color: '#76C799' },
        { label: 'Southeast', value: '92.8%', color: '#76C799' },
        { label: 'Midwest', value: '91.4%', color: '#F59E0B' },
        { label: 'Southwest', value: '93.6%', color: '#76C799' },
        { label: 'West', value: '95.3%', color: '#76C799' },
      ]},
      { title: 'Gap Zones', rows: [
        { label: 'Rural TX (Kern)', value: '79% — needs 3 pharmacies', color: '#EF4444' },
        { label: 'Rural GA (Clinch)', value: '82% — needs 2 pharmacies', color: '#F59E0B' },
        { label: 'Rural MT (Garfield)', value: '74% — needs 4 pharmacies', color: '#EF4444' },
      ]},
    ],
  },
  nosurprises: {
    title: 'No Surprises Act Filing — Q1 2026', date: 'Mar 31, 2026', records: '38,569', states: '50',
    stats: [
      { label: 'Validated', value: '38,569', color: '#76C799' },
      { label: 'Pass', value: '38,210', color: '#449055' },
      { label: 'Warnings', value: '312', color: '#F59E0B' },
      { label: 'Failures', value: '47', color: '#EF4444' },
    ],
    sections: [
      { title: 'Filing Status', rows: [
        { label: 'Aetna', value: 'Filed — Pass', color: '#76C799' },
        { label: 'BlueCross BlueShield', value: 'Filed — Pass', color: '#76C799' },
        { label: 'Cigna', value: 'Pending — 3 warnings', color: '#F59E0B' },
        { label: 'UnitedHealth', value: 'Due Apr 15', color: '#F59E0B' },
      ]},
    ],
  },
};

const DEFAULT_REPORT = REPORT_MAP.credential;

/* ── Detect report type from query ───────────────────────────────── */
function detectReport(text: string): { key: string; reply: string } {
  const l = text.toLowerCase();
  if (l.includes('fwa') || l.includes('fraud') || l.includes('attestation'))
    return { key: 'fwa', reply: 'Generated your **FWA Attestation Status Report**. 81,500 pharmacies analyzed — 47 critical risk, 359 under review. Preview is loaded on the right.' };
  if (l.includes('network') || l.includes('adequacy') || l.includes('coverage') || l.includes('gap'))
    return { key: 'network', reply: 'Generated **Network Adequacy Analysis**. Overall adequacy: 94.2% across 50 states. 12 coverage gap zones identified. Preview loaded.' };
  if (l.includes('no surprise') || l.includes('nsa') || l.includes('filing'))
    return { key: 'nosurprises', reply: 'Generated **No Surprises Act Filing — Q1 2026**. 38,569 pharmacies validated. 2 networks pending submission before Apr 15 deadline.' };
  if (l.includes('dea') || l.includes('credential') || l.includes('expir') || l.includes('license'))
    return { key: 'credential', reply: 'Generated **Q1 2026 Credential Expiry Report**. 234 credentials expiring across 23 states. 12 pharmacies flagged for multi-expiry risk. Preview loaded.' };
  if (l.includes('specialty') || l.includes('california') || l.includes('export') || l.includes('excel'))
    return { key: 'credential', reply: 'Report generated with your custom criteria. 247 records matched — preview loaded on the right. You can download as PDF or Excel.' };
  return { key: 'credential', reply: 'Report updated with your changes. Preview has been refreshed on the right panel. You can download or further refine the criteria.' };
}

/* ── Suggestions ──────────────────────────────────────────────────── */
const TEMPLATES = [
  { label: 'Credential Expiry', desc: 'DEA, license & accreditation status', query: 'Generate a Q1 2026 credential expiry report grouped by state' },
  { label: 'FWA Risk Assessment', desc: 'Fraud, waste & abuse scoring', query: 'Generate FWA attestation status report for all networks' },
  { label: 'Network Adequacy', desc: 'adequacy by region', query: 'Network adequacy analysis with coverage gaps' },
  { label: 'No Surprises Act', desc: 'NSA compliance filing', query: 'Generate No Surprises Act filing report for Q1' },
  { label: 'Specialty Pharmacies', desc: 'Custom filtered export', query: 'Export all specialty pharmacies in CA and TX as Excel' },
  { label: 'Monthly Summary', desc: 'Compliance overview', query: 'Generate monthly compliance summary report' },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function AIReportsPage() {
  const [msgs, setMsgs]       = useState<Msg[]>([]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [report, setReport]   = useState<ReportData | null>(null);
  const [fmt, setFmt]         = useState('PDF');
  const [showThreads, setShowThreads] = useState(false);
  const threadState = useThreads('ai-reports');
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMessages = msgs.length > 0;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  async function send(text?: string) {
    const t = (text || input).trim();
    if (!t || typing) return;
    setInput('');
    setMsgs(m => [...m, { id: Date.now(), role: 'user', text: t }]);
    setTyping(true);

    // Try Gemini first
    const gemini = await queryGeminiReport(t);
    if (gemini) {
      const rd: ReportData = { title: gemini.title, date: gemini.date, records: gemini.records, states: gemini.states, stats: gemini.stats, sections: gemini.sections };
      setReport(rd);
      setTyping(false);
      setMsgs(m => [...m, { id: Date.now() + 1, role: 'bot', text: gemini.replyText, reportData: rd }]);
      return;
    }

    // Fallback to static
    const { key, reply } = detectReport(t);
    const rd = REPORT_MAP[key] || DEFAULT_REPORT;
    setReport(rd);
    setTyping(false);
    setMsgs(m => [...m, { id: Date.now() + 1, role: 'bot', text: reply, reportData: rd }]);
  }

  function renderBold(text: string) {
    return text.split('**').map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
  }

  return (
    <>
      <Topbar
        title="AI Report Builder"
        subtitle="Describe what you need — generate instant reports from all DataSolutions.ai data"
        actions={hasMessages ? (
          <button className="btn-secondary" onClick={() => setShowThreads(o => !o)} style={{ fontSize: 12, gap: 5 }}>
            {showThreads ? 'Hide' : 'Show'} Threads
          </button>
        ) : undefined}
      />
      <main style={{ display: 'flex', height: 'calc(100vh - 84px)', background: '#FAFBFC' }}>

        {/* Thread sidebar */}
        {showThreads && (
          <ChatThreadsSidebar
            threads={threadState.threads}
            activeId={threadState.activeId}
            onSelect={(id) => threadState.setActiveId(id)}
            onNew={() => threadState.createThread('New report')}
            onDelete={(id) => threadState.deleteThread(id)}
            onClose={() => setShowThreads(false)}
          />
        )}

        {/* ── LEFT: Chat panel ──────────────────────────────── */}
        <div style={{ width: report ? 420 : '100%', maxWidth: report ? 420 : 700, margin: report ? 0 : '0 auto', display: 'flex', flexDirection: 'column', background: '#fff', borderRight: report ? '1px solid #E8ECF4' : 'none', transition: 'width .3s' }}>

          {/* Empty state */}
          {!hasMessages && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(145deg, #005C8D, #1474A4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(0,92,141,.25)', marginBottom: 18 }}>
                <IconReport size={28} color="#fff"/>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-.3px' }}>What report do you need?</h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0', textAlign: 'center', lineHeight: 1.5, maxWidth: 380 }}>
                Describe your report in plain English. I'll pull data from all tools — compliance, network, FWA, pharmacy records — and generate it instantly.
              </p>

              {/* Input */}
              <div style={{ width: '100%', maxWidth: 440, marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, boxShadow: '0 4px 24px rgba(15,23,42,.06)', padding: '4px 4px 4px 16px' }}>
                  <span style={{ display: 'flex', marginRight: 10 }}><IconSparkles size={16} color="#8FC2D8"/></span>
                  <input type="text" placeholder="e.g. DEA expiry report by state for Q1..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: '#0F172A', padding: '11px 0' }}/>
                  <button onClick={() => send()} disabled={!input.trim()} style={{ width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer', background: input.trim() ? 'linear-gradient(135deg,#005C8D,#1474A4)' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s', flexShrink: 0 }}>
                    <IconSend size={15} color={input.trim() ? '#fff' : '#94A3B8'}/>
                  </button>
                </div>
              </div>

              {/* Format row */}
              <div style={{ display: 'flex', gap: 6, marginTop: 14, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>Format:</span>
                {['PDF', 'Excel', 'CSV', 'JSON', 'API'].map(f => (
                  <button key={f} onClick={() => setFmt(f)} style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 6, border: '1px solid', cursor: 'pointer', borderColor: fmt === f ? '#005C8D' : '#E2E8F0', background: fmt === f ? '#E8F3F9' : '#fff', color: fmt === f ? '#005C8D' : '#94A3B8', transition: 'all .15s' }}>{f}</button>
                ))}
              </div>

              {/* Templates */}
              <div style={{ width: '100%', maxWidth: 440, marginTop: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Templates</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {TEMPLATES.map(t => (
                    <button key={t.label} onClick={() => send(t.query)} style={{ padding: '12px', textAlign: 'left', background: '#fff', border: '1px solid #E8ECF4', borderRadius: 8, cursor: 'pointer', transition: 'border-color .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#8FC2D8'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8ECF4'; }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{t.label}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {hasMessages && (
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {msgs.map(m => (
                  <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
                    {m.role === 'bot' ? (
                      <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: 'linear-gradient(135deg,#005C8D,#1474A4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconSparkles size={14} color="#fff"/>
                      </div>
                    ) : (
                      <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconUser size={13} color="#64748B"/>
                      </div>
                    )}
                    <div style={{ flex: 1, paddingTop: 2 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: m.role === 'bot' ? '#005C8D' : '#64748B', marginBottom: 3 }}>
                        {m.role === 'bot' ? 'Report Builder' : 'You'}
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.6, color: '#334155' }}>{renderBold(m.text)}</div>
                      {m.role === 'bot' && m.reportData && (
                        <button
                          onClick={() => setReport(m.reportData!)}
                          style={{
                            marginTop: 6, padding: '5px 10px', borderRadius: 7,
                            background: '#E8F3F9', border: '1px solid #8FC2D8',
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#005C8D',
                            transition: 'background .12s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#C6E0EC')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#E8F3F9')}
                        >
                          <IconSparkles size={11} color="#005C8D"/>
                          {m.reportData.title.slice(0, 30)}{m.reportData.title.length > 30 ? '...' : ''}
                          <span style={{ fontSize: 11, color: '#2D8AB5', fontWeight: 500 }}>Open in Canvas</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#005C8D,#1474A4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconSparkles size={14} color="#fff"/>
                    </div>
                    <div style={{ paddingTop: 6, display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[0,1,2].map(j => <span key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8FC2D8', display: 'inline-block', animation: `pdot 1.2s ease-in-out ${j*.2}s infinite` }}/>)}
                      <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 6 }}>Generating report...</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef}/>
              </div>

              {/* Format + input */}
              <div style={{ padding: '8px 16px 14px', borderTop: '1px solid #F1F5F9', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                  {['PDF','Excel','CSV','JSON','API'].map(f => (
                    <button key={f} onClick={() => setFmt(f)} style={{ padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid', cursor: 'pointer', borderColor: fmt === f ? '#005C8D' : '#E2E8F0', background: fmt === f ? '#E8F3F9' : '#fff', color: fmt === f ? '#005C8D' : '#94A3B8' }}>{f}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Refine or describe another report..." style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', color: '#0F172A' }}/>
                  <button onClick={() => send()} disabled={!input.trim() || typing} style={{ width: 38, height: 38, borderRadius: 8, background: input.trim() ? 'linear-gradient(135deg,#005C8D,#1474A4)' : '#F1F5F9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconSend size={14} color={input.trim() ? '#fff' : '#94A3B8'}/>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT: Report preview ─────────────────────────── */}
        {report && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', background: '#FAFBFC' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>{report.title}</h2>
                  <Badge variant="success" dot>Generated</Badge>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                  {report.date} · {report.records} pharmacies · {report.states} states · Format: {fmt}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-primary" style={{ fontSize: 12, gap: 5 }}><IconDownload size={12} color="#fff"/> Download {fmt}</button>
                <button className="btn-secondary" style={{ fontSize: 12, gap: 5 }}><IconRefresh size={12}/> Refresh</button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${report.stats.length},1fr)`, gap: 10, marginBottom: 20 }}>
              {report.stats.map(s => (
                <div key={s.label} style={{ padding: '16px', borderRadius: 12, background: '#fff', border: '1px solid #E8ECF4' }}>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Sections */}
            {report.sections.map((sec, si) => (
              <div key={si} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8ECF4', marginBottom: 14, overflow: 'hidden' }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                  {sec.title}
                </div>
                <div style={{ padding: '6px 0' }}>
                  {sec.rows.map((row, ri) => (
                    <div key={ri} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 18px', borderBottom: ri < sec.rows.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                      <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Footer */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: '#94A3B8', fontSize: 12, marginTop: 8 }}>
              <IconDatabase size={12} color="#94A3B8"/> Data sourced from 81,500 pharmacy records
              <span style={{ margin: '0 4px' }}>·</span>
              <IconShield size={12} color="#94A3B8"/> HIPAA compliant
              <span style={{ margin: '0 4px' }}>·</span>
              <IconBarChart size={12} color="#94A3B8"/> Powered by Claude
            </div>
          </div>
        )}
      </main>
    </>
  );
}
