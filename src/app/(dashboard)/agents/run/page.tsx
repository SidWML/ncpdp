'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/Badge';
import { agents } from '@/lib/mockData';
import {
  IconSearch, IconCpu, IconShield, IconDatabase,
  IconNetwork, IconBarChart, IconCheck, IconZap, IconSparkles,
  IconChevronRight, IconReport, IconDownload, IconCode, IconCopy, IconX,
  IconAlertTriangle,
} from '@/components/ui/Icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { AgentChat } from '@/components/ui/AgentChat';
import { SqlTab as SharedSqlTab, ChartsTab as SharedChartsTab, ExportTab as SharedExportTab, OutputPanel } from '@/components/ui/OutputPanel';
import type { ResultRow as SharedResultRow, QueryContext } from '@/components/ui/OutputPanel';
import { ChatThreadsSidebar, useThreads } from '@/components/ui/ChatThreads';
import type { ChatMessage } from '@/components/ui/AgentChat';
import { queryGemini } from '@/lib/gemini';
import type { GeminiResponse } from '@/lib/gemini';
import { useCallback, useRef } from 'react';

/* ── Category helpers ────────────────────────────────────────────── */
const catColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  'Search & Discovery':      { bg: '#E8F3F9', text: '#005C8D', border: '#8FC2D8', gradient: 'linear-gradient(135deg,#005C8D,#2D8AB5)' },
  'Network Management':      { bg: '#ECFDF5', text: '#449055', border: '#A7F3D0', gradient: 'linear-gradient(135deg,#449055,#A6DFB8)' },
  'Compliance & Regulatory': { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', gradient: 'linear-gradient(135deg,#DC2626,#F87171)' },
  'Data Delivery':           { bg: '#E8F3F9', text: '#1474A4', border: '#8FC2D8', gradient: 'linear-gradient(135deg,#1474A4,#60A5FA)' },
  'Credentialing (resQ)':    { bg: '#FFF7ED', text: '#D97706', border: '#FDE68A', gradient: 'linear-gradient(135deg,#D97706,#FBBF24)' },
  'Analytics & Prediction':  { bg: '#E8F3F9', text: '#005C8D', border: '#8FC2D8', gradient: 'linear-gradient(135deg,#005C8D,#2D8AB5)' },
  'Claims & Routing':        { bg: '#ECFDF5', text: '#76C799', border: '#A6DFB8', gradient: 'linear-gradient(135deg,#76C799,#A6DFB8)' },
  'NCPDP Internal':          { bg: '#E8F3F9', text: '#005C8D', border: '#8FC2D8', gradient: 'linear-gradient(135deg,#005C8D,#38BDF8)' },
};

const catIcon = (cat: string, size = 16) => {
  const icons: Record<string, React.ReactElement> = {
    'Search & Discovery':      <IconSearch size={size}/>,
    'Network Management':      <IconNetwork size={size}/>,
    'Compliance & Regulatory': <IconShield size={size}/>,
    'Data Delivery':           <IconDatabase size={size}/>,
    'Credentialing (resQ)':    <IconCheck size={size}/>,
    'Analytics & Prediction':  <IconBarChart size={size}/>,
    'Claims & Routing':        <IconZap size={size}/>,
    'NCPDP Internal':          <IconCpu size={size}/>,
  };
  return icons[cat] || <IconSparkles size={size}/>;
};

const suggestions: Record<string, string[]> = {
  'Search & Discovery': [
    'Find all pharmacies in Texas with expiring DEA registrations',
    'Show retail pharmacies in Miami within 10 miles',
    'List specialty pharmacies with ACHC accreditation in CA',
    'Find LTC pharmacies added in the last 30 days',
  ],
  'Compliance & Regulatory': [
    'Show all pharmacies with expired DEA in the South region',
    'List critical compliance alerts from the past 7 days',
    'Which pharmacies have incomplete FWA attestations?',
    'List independent pharmacies missing FWA attestation for 2026',
  ],
  'Network Management': [
    'Analyze network coverage gaps in Southeast states',
    'Show adequacy status for all contracted networks',
    'Which states fall below 90% network adequacy?',
    'Compare network composition for Q1 vs Q4 2025',
  ],
  'Analytics & Prediction': [
    'Predict pharmacy closures in rural Texas counties',
    'Show API usage trends for the past 6 months',
    'Identify pharmacy desert risk zones in Midwest',
    'Generate closure risk report for LTC pharmacies',
  ],
  'Data Delivery': [
    'Build a feed of all specialty pharmacies with DEA status',
    'Export network changes from the past 30 days',
    'Configure daily compliance alert delivery for Aetna',
    'Build daily profile change feed for BlueCross',
  ],
  'Credentialing (resQ)': [
    'Check credentialing status for Wellness Pharmacy #0842',
    'List pharmacies with incomplete resQ profiles',
    'Show credential renewal queue for next 90 days',
    'Find networks available for MedPlus Pharmacy #1204',
  ],
  'Claims & Routing': [
    'Validate NPI identifiers for claims batch #4821',
    'Show routing recommendations for specialty claims',
    'Find pharmacies eligible for bulk download optimization',
    'Analyze claim rejection patterns in Q1 2026',
  ],
  'NCPDP Internal': [
    'Generate audit trail for Aetna data access last 30 days',
    'Show subscriber usage patterns for Q1 2026',
    'List accounts with declining API activity',
    'Package standard dataset for enterprise subscriber',
  ],
};

const sqlByCategory: Record<string, string> = {
  'Search & Discovery': `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state,
       p.provider_type, c.dea_expires, c.dea_status,
       c.license_status, c.fwa_complete,
       COUNT(n.network_id) AS network_count
FROM pharmacies p
LEFT JOIN credentials c ON p.ncpdp_id = c.ncpdp_id
LEFT JOIN network_memberships n ON p.ncpdp_id = n.ncpdp_id
WHERE p.state = 'TX' AND c.dea_status = 'expiring'
GROUP BY p.ncpdp_id ORDER BY c.dea_expires ASC
LIMIT 247`,
  default: `SELECT p.ncpdp_id, p.pharmacy_name, p.city, p.state,
       p.provider_type, c.dea_status, c.license_status
FROM pharmacies p
LEFT JOIN credentials c ON p.ncpdp_id = c.ncpdp_id
WHERE p.active = true
ORDER BY p.pharmacy_name ASC
LIMIT 247`,
};

type Tab = 'results' | 'sql' | 'charts' | 'export';

/* ── Shared result data ──────────────────────────────────────────── */
const RESULT_ROWS = [
  { ncpdp: '0512345', name: 'Option Care Health',            city: 'Los Angeles', state: 'CA', type: 'Specialty',    status: 'Active',   dea: 'Valid',    phone: '(213) 482-0198' },
  { ncpdp: '2810042', name: 'Accredo Health Group',          city: 'Houston',     state: 'TX', type: 'Specialty',    status: 'Active',   dea: 'Expiring', phone: '(713) 654-4120' },
  { ncpdp: '3401298', name: 'BioScrip Infusion Services',   city: 'Phoenix',     state: 'AZ', type: 'Infusion',     status: 'Active',   dea: 'Valid',    phone: '(602) 285-8370' },
  { ncpdp: '5920187', name: 'Genoa Healthcare Pharmacy',    city: 'Miami',       state: 'FL', type: 'Specialty',    status: 'Active',   dea: 'Valid',    phone: '(305) 374-2910' },
  { ncpdp: '0412893', name: 'Coram CVS Specialty Infusion', city: 'Denver',      state: 'CO', type: 'Infusion',     status: 'Inactive', dea: 'Expired',  phone: '(720) 891-5430' },
  { ncpdp: '1209834', name: 'Kindred Healthcare Pharmacy',  city: 'Chicago',     state: 'IL', type: 'Long-Term Care', status: 'Active', dea: 'Valid',    phone: '(312) 476-8710' },
  { ncpdp: '6701245', name: 'Shields Health Solutions',      city: 'Boston',      state: 'MA', type: 'Specialty',    status: 'Active',   dea: 'Valid',    phone: '(617) 610-7640' },
  { ncpdp: '4519827', name: 'ProCare Pharmacy',             city: 'Seattle',     state: 'WA', type: 'Specialty',    status: 'Active',   dea: 'Valid',    phone: '(206) 832-9230' },
  { ncpdp: '3290156', name: 'OnePoint Patient Care',        city: 'Atlanta',     state: 'GA', type: 'Long-Term Care', status: 'Active', dea: 'Valid',    phone: '(404) 753-6890' },
  { ncpdp: '7623041', name: 'Orsini Specialty Pharmacy',    city: 'New York',    state: 'NY', type: 'Specialty',    status: 'Inactive', dea: 'Expiring', phone: '(212) 389-4470' },
];
type ResultRow = typeof RESULT_ROWS[number];

/* ── Detail drawer data ─────────────────────────────────────────── */
const PHARMACY_DETAILS: Record<string, {
  legalName: string; dba: string; npi: string; taxId: string;
  address: string; hours: string; opened: string;
  services: string[]; networks: { name: string; status: string }[];
  credentials: { type: string; status: string; expires: string }[];
  riskScore: number; profileScore: number;
}> = {
  '0512345': {
    legalName: 'Option Care Health Inc.', dba: 'Option Care Health', npi: '1700186859', taxId: '**-***4521',
    address: '3880 Kilroy Airport Way, Long Beach, CA 90806', hours: 'Mon-Fri 8AM-6PM', opened: '2008-03-15',
    services: ['Specialty Dispensing', 'Infusion Services', 'Oncology', 'Patient Hub'],
    networks: [{ name: 'Aetna', status: 'Active' }, { name: 'Express Scripts', status: 'Active' }, { name: 'OptumRx', status: 'Active' }],
    credentials: [{ type: 'DEA Registration', status: 'Valid', expires: '2027-06-30' }, { type: 'State License', status: 'Active', expires: '2026-12-31' }, { type: 'FWA Attestation', status: 'Complete', expires: '2026-09-15' }],
    riskScore: 12, profileScore: 94,
  },
  '2810042': {
    legalName: 'Accredo Health Group Inc.', dba: 'Accredo Health Group', npi: '1346374806', taxId: '**-***8734',
    address: '2500 CityWest Blvd, Houston, TX 77042', hours: 'Mon-Fri 7AM-7PM', opened: '2012-08-22',
    services: ['Specialty Dispensing', 'Prior Auth Support', 'Cold Chain', 'Patient Hub'],
    networks: [{ name: 'OptumRx', status: 'Active' }, { name: 'Humana', status: 'Active' }],
    credentials: [{ type: 'DEA Registration', status: 'Expiring', expires: '2026-05-15' }, { type: 'State License', status: 'Active', expires: '2027-03-31' }, { type: 'ACHC Accreditation', status: 'Active', expires: '2027-01-20' }],
    riskScore: 58, profileScore: 87,
  },
  '0412893': {
    legalName: 'Coram Healthcare Corporation', dba: 'Coram CVS Specialty Infusion', npi: '1518067230', taxId: '**-***2190',
    address: '7700 E Colfax Ave, Denver, CO 80220', hours: 'Closed', opened: '2016-11-01',
    services: ['Specialty Infusion', 'Home Infusion'],
    networks: [{ name: 'Aetna', status: 'Terminated' }, { name: 'Express Scripts', status: 'Terminated' }],
    credentials: [{ type: 'DEA Registration', status: 'Expired', expires: '2025-12-31' }, { type: 'State License', status: 'Expired', expires: '2025-09-30' }],
    riskScore: 92, profileScore: 31,
  },
};

const BAR_DATA = [
  { state: 'TX', count: 89 }, { state: 'CA', count: 72 }, { state: 'FL', count: 41 },
  { state: 'NY', count: 28 }, { state: 'OH', count: 17 }, { state: 'IL', count: 14 },
  { state: 'PA', count: 12 }, { state: 'WA', count: 9 },
];
const PIE_DATA = [
  { name: 'Community/Retail', value: 136, color: '#005C8D' },
  { name: 'Specialty',        value: 59,  color: '#76C799' },
  { name: 'Compounding',      value: 25,  color: '#F59E0B' },
  { name: 'Chain',            value: 18,  color: '#EF4444' },
  { name: 'Infusion',         value: 9,   color: '#005C8D' },
];
const TREND_DATA = [
  { month: 'Oct', active: 78200, new: 420, closed: 180 },
  { month: 'Nov', active: 79100, new: 510, closed: 210 },
  { month: 'Dec', active: 79800, new: 480, closed: 190 },
  { month: 'Jan', active: 80200, new: 620, closed: 240 },
  { month: 'Feb', active: 80900, new: 710, closed: 290 },
  { month: 'Mar', active: 81500, new: 680, closed: 310 },
];

/* ── AI Insights Banner ─────────────────────────────────────────── */
function InsightsBanner() {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const insights = [
    { id: 0, icon: <IconAlertTriangle size={14} color="#DC2626"/>, text: '2 pharmacies have expired DEA registrations requiring immediate action', severity: 'danger', bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
    { id: 1, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, text: '72% of results are from TX/CA — geographic concentration risk', severity: 'warning', bg: '#FFF7ED', border: '#FDE68A', color: '#92400E' },
    { id: 2, icon: <IconBarChart size={14} color="#449055"/>, text: '88% active rate across matched pharmacies (above 85% benchmark)', severity: 'success', bg: '#ECFDF5', border: '#A7F3D0', color: '#2A6936' },
    { id: 3, icon: <IconShield size={14} color="#005C8D"/>, text: '1 pharmacy has incomplete FWA attestation — compliance gap', severity: 'info', bg: '#E8F3F9', border: '#8FC2D8', color: '#1E40AF' },
  ];

  const visible = insights.filter(i => !dismissed.has(i.id));
  if (visible.length === 0) return null;

  return (
    <div style={{
      marginBottom: 16, padding: '14px 16px', borderRadius: 12,
      background: 'linear-gradient(135deg, #FAFBFC 0%, #E8F3F9 50%, #FAFBFC 100%)',
      border: '1px solid #E8EFF8',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: 'linear-gradient(135deg, #005C8D, #2D8AB5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconSparkles size={13} color="#fff"/>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>AI Analysis</span>
          <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>
            {visible.length} insight{visible.length !== 1 ? 's' : ''} detected
          </span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {visible.map(ins => (
          <div
            key={ins.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 8, background: ins.bg, border: `1px solid ${ins.border}`,
              transition: 'transform .12s',
              cursor: 'default',
            }}
          >
            <span style={{ flexShrink: 0 }}>{ins.icon}</span>
            <span style={{ fontSize: 12, color: ins.color, lineHeight: 1.4, flex: 1 }}>{ins.text}</span>
            <button
              onClick={() => setDismissed(d => new Set([...d, ins.id]))}
              style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 2, opacity: 0.4, transition: 'opacity .12s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
            >
              <IconX size={11} color={ins.color}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Pharmacy Detail Drawer ─────────────────────────────────────── */
function PharmacyDrawer({ row, onClose }: { row: ResultRow; onClose: () => void }) {
  const detail = PHARMACY_DETAILS[row.ncpdp];

  const statusColor = (s: string) =>
    s === 'Active' || s === 'Valid' || s === 'Complete' ? '#449055' :
    s === 'Expiring' || s === 'Pending' ? '#D97706' :
    '#DC2626';

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
      background: '#fff', boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
      zIndex: 100, display: 'flex', flexDirection: 'column',
      animation: 'slideInRight .2s ease-out',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #E2E8F0',
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>{row.name}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            NCPDP {row.ncpdp} · {row.city}, {row.state}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0',
            background: '#fff', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <IconX size={14} color="#64748B"/>
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {/* Risk + Profile scores */}
        {detail && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{
                padding: '12px 14px', borderRadius: 10,
                background: detail.riskScore > 60 ? '#FEF2F2' : detail.riskScore > 30 ? '#FFF7ED' : '#ECFDF5',
                border: `1px solid ${detail.riskScore > 60 ? '#FECACA' : detail.riskScore > 30 ? '#FDE68A' : '#A7F3D0'}`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em' }}>Risk Score</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: detail.riskScore > 60 ? '#DC2626' : detail.riskScore > 30 ? '#D97706' : '#449055', marginTop: 2 }}>
                  {detail.riskScore}
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8' }}>/100</span>
                </div>
              </div>
              <div style={{
                padding: '12px 14px', borderRadius: 10,
                background: '#E8F3F9', border: '1px solid #8FC2D8',
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em' }}>Profile Score</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#005C8D', marginTop: 2 }}>
                  {detail.profileScore}
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8' }}>%</span>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Details</div>
              {[
                { label: 'Legal Name', value: detail.legalName },
                { label: 'NPI', value: detail.npi },
                { label: 'Address', value: detail.address },
                { label: 'Hours', value: detail.hours },
                { label: 'Type', value: row.type },
                { label: 'Phone', value: row.phone },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', padding: '6px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ width: 100, fontSize: 12, color: '#94A3B8', fontWeight: 500, flexShrink: 0 }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: '#1E293B', fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Credentials */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Credentials</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {detail.credentials.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderRadius: 8, background: '#FAFBFC', border: '1px solid #F3F4F6',
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B' }}>{c.type}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>Expires {c.expires}</div>
                    </div>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      color: statusColor(c.status),
                      background: `${statusColor(c.status)}14`,
                    }}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Networks */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Networks</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {detail.networks.map((n, i) => (
                  <span key={i} style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                    border: `1px solid ${statusColor(n.status)}40`,
                    color: statusColor(n.status),
                    background: `${statusColor(n.status)}0A`,
                  }}>
                    {n.name} · {n.status}
                  </span>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Services</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {detail.services.map((s, i) => (
                  <span key={i} style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                    background: '#F3F4F6', color: '#475569',
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {!detail && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Basic Info</div>
            <div style={{ fontSize: 12, lineHeight: 1.6 }}>
              {row.name}<br/>
              {row.city}, {row.state} · {row.type}<br/>
              Phone: {row.phone}<br/>
              DEA: {row.dea} · Status: {row.status}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div style={{
        padding: '12px 20px', borderTop: '1px solid #E2E8F0', flexShrink: 0,
        display: 'flex', gap: 8,
      }}>
        <button className="btn-primary" style={{ flex: 1, fontSize: 12, justifyContent: 'center' }}>
          <IconShield size={13} color="#fff"/> Run Audit
        </button>
        <button className="btn-secondary" style={{ flex: 1, fontSize: 12, justifyContent: 'center' }}>
          <IconBarChart size={13}/> Compare
        </button>
      </div>

      <style>{`@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}

/* ── Results Tab ─────────────────────────────────────────────────── */
function ResultsTab({ agentName, resultRows, onRowClick }: { agentName: string; resultRows: ResultRow[]; onRowClick: (row: ResultRow) => void }) {
  const deaBadge = (s: string) =>
    s === 'Valid' ? <Badge variant="success">Valid</Badge> :
    s === 'Expiring' ? <span className="badge-pulse-warning"><Badge variant="warning">Expiring</Badge></span> :
    <span className="badge-pulse-danger"><Badge variant="danger">Expired</Badge></span>;

  return (
    <div>
      {/* AI Insights Banner */}
      <InsightsBanner/>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 18 }}>
        {[
          { label: 'Records Found',  value: '247',    color: '#005C8D', bg: '#E8F3F9' },
          { label: 'Execution Time', value: '0.83s',  color: '#76C799', bg: '#ECFDF5' },
          { label: 'Records Scanned',value: '81,500', color: '#334155', bg: '#F8FAFC' },
          { label: 'Active',         value: '218',    color: '#76C799', bg: '#ECFDF5' },
          { label: 'At Risk',        value: '29',     color: '#EF4444', bg: '#FEF2F2' },
        ].map(s => (
          <div key={s.label} style={{ padding: '12px 16px', borderRadius: 8, background: s.bg, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Results table */}
      <div style={{ borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden', background: '#fff' }}>
        <table>
          <thead>
            <tr>
              {['NCPDP ID','Pharmacy Name','City','State','Type','DEA','Phone','Status',''].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resultRows.map(r => (
              <tr
                key={r.ncpdp}
                onClick={() => onRowClick(r)}
                style={{ cursor: 'pointer', transition: 'background .08s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#E8F3F9')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#005C8D', fontSize: 13 }}>{r.ncpdp}</td>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td style={{ color: '#64748B' }}>{r.city}</td>
                <td style={{ fontWeight: 600 }}>{r.state}</td>
                <td>
                  <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: '#F1F5F9', color: '#475569' }}>{r.type}</span>
                </td>
                <td>{deaBadge(r.dea)}</td>
                <td style={{ color: '#94A3B8', fontSize: 13 }}>{r.phone}</td>
                <td><Badge variant={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge></td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    fontSize: 11, color: '#94A3B8', fontWeight: 500,
                    opacity: 0.6, transition: 'opacity .12s',
                  }}>
                    View <IconChevronRight size={10}/>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '8px 16px', borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#94A3B8', textAlign: 'right' }}>
          Showing <strong style={{ color: '#334155' }}>{resultRows.length}</strong> of <strong style={{ color: '#334155' }}>247</strong> entries
        </div>
      </div>
    </div>
  );
}

/* ── Helper: build a default QueryContext from local data ─────────── */
function makeCtx(sql: string, rows: ResultRow[]): QueryContext {
  return {
    rows: rows as SharedResultRow[],
    sql,
    insights: [
      { text: '2 pharmacies have expired DEA registrations requiring immediate action', type: 'danger' },
      { text: '88% active rate across matched pharmacies (above 85% benchmark)', type: 'success' },
      { text: '1 pharmacy has incomplete FWA attestation — compliance gap', type: 'info' },
    ],
    stats: [
      { label: 'Records Found', value: '247', color: '#005C8D', bg: '#E8F3F9' },
      { label: 'Execution Time', value: '0.83s', color: '#76C799', bg: '#ECFDF5' },
      { label: 'Records Scanned', value: '81,500', color: '#334155', bg: '#F8FAFC' },
      { label: 'Active', value: '218', color: '#76C799', bg: '#ECFDF5' },
      { label: 'At Risk', value: '29', color: '#EF4444', bg: '#FEF2F2' },
    ],
    barData: BAR_DATA.map(d => ({ label: d.state, value: d.count })),
    barLabel: 'Results by State',
    pieData: PIE_DATA,
    pieLabel: 'Distribution by Type',
    trendData: TREND_DATA.map(d => ({ month: d.month, primary: d.new, secondary: d.closed })),
    trendLabel: 'Network Trend (6 months)',
    trendKeys: ['New', 'Closed'],
    totalResults: 247,
    execTime: '0.83s',
    canvasLabel: '247 results found',
    followUps: ['Filter to active only', 'Show expired DEA', 'View compliance report', 'Compare by state'],
    chatInsights: [{ icon: 'warning' as const, text: '2 pharmacies have expired DEA licenses', color: '#DC2626' }, { icon: 'location' as const, text: 'Most results concentrated in Texas region', color: '#005C8D' }, { icon: 'stat' as const, text: '88% of matched pharmacies are currently active', color: '#449055' }],
  };
}

/* ── SQL Tab (shared) ─────────────────────────────────────────────── */
function SqlTab({ sql, resultRows }: { sql: string; resultRows: ResultRow[] }) {
  return <SharedSqlTab ctx={makeCtx(sql, resultRows)}/>;
}

/* ── Charts Tab (shared) ──────────────────────────────────────────── */
function ChartsTab({ sql, resultRows }: { sql: string; resultRows: ResultRow[] }) {
  return <SharedChartsTab ctx={makeCtx(sql, resultRows)}/>;
}

/* ── Export Tab (shared) ──────────────────────────────────────────── */
function ExportTab({ agentName, resultRows, sql }: { agentName: string; resultRows: ResultRow[]; sql: string }) {
  return <SharedExportTab title={agentName} ctx={makeCtx(sql, resultRows)}/>;
}

/* ── Main inner component ────────────────────────────────────────── */
function AgentRunInner() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent') ?? 'agt-01';
  const agent = agents.find(a => a.id.toLowerCase() === agentId.toLowerCase()) ?? agents[0];
  const cc = catColors[agent.category] ?? catColors['Search & Discovery'];
  const agentSuggestions = suggestions[agent.category] ?? suggestions['Search & Discovery'];
  const sql = sqlByCategory[agent.category] ?? sqlByCategory['default'];

  const [activeTab, setActiveTab] = useState<Tab>('results');
  const [chatWidth, setChatWidth] = useState(480);
  const [showOutput, setShowOutput] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ResultRow | null>(null);
  const [dynamicCtx, setDynamicCtx] = useState<QueryContext | null>(null);
  const [queryKey, setQueryKey] = useState(0);
  const [showThreads, setShowThreads] = useState(false);
  const [agentChatMsgs, setAgentChatMsgs] = useState<ChatMessage[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const threadMsgsRef = useRef<Map<string, ChatMessage[]>>(new Map());
  const threadState = useThreads('agents', agent.id);
  const lastGeminiRef = useRef<GeminiResponse | null>(null);

  function handleAgentMsgsChange(msgs: ChatMessage[]) {
    setAgentChatMsgs(msgs);
    const firstUser = msgs.find(m => m.role === 'user');
    if (firstUser && !activeThreadId) {
      const id = threadState.createThread(firstUser.text);
      setActiveThreadId(id);
      threadMsgsRef.current.set(id, msgs);
      return;
    }
    if (activeThreadId) threadMsgsRef.current.set(activeThreadId, msgs);
  }

  function handleSelectAgentThread(id: string) {
    if (activeThreadId) threadMsgsRef.current.set(activeThreadId, agentChatMsgs);
    const saved = threadMsgsRef.current.get(id) || [];
    setAgentChatMsgs(saved);
    setActiveThreadId(id);
    threadState.setActiveId(id);
    if (saved.length > 0) {
      setHasResults(true);
      const lastBot = [...saved].reverse().find(m => m.role === 'bot' && m.canvasData);
      if (lastBot?.canvasData) { setDynamicCtx(lastBot.canvasData as QueryContext); setQueryKey(k => k + 1); }
    }
  }

  function handleNewAgentChat() {
    if (activeThreadId) threadMsgsRef.current.set(activeThreadId, agentChatMsgs);
    setAgentChatMsgs([]);
    setActiveThreadId(null);
    setDynamicCtx(null);
    setShowOutput(false);
    setHasResults(false);
  }
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(420);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = chatWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const delta = ev.clientX - startX.current;
      const next = Math.max(300, Math.min(800, startW.current + delta));
      setChatWidth(next);
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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'results', label: 'Results' },
    { id: 'sql',     label: 'SQL Query' },
    { id: 'charts',  label: 'Charts' },
    { id: 'export',  label: 'Export' },
  ];

  function geminiToCtx(g: GeminiResponse): QueryContext {
    return {
      rows: g.rows as SharedResultRow[], sql: g.sql, insights: g.insights, stats: g.stats,
      barData: g.barData, barLabel: g.barLabel, pieData: g.pieData, pieLabel: g.pieLabel,
      trendData: g.trendData, trendLabel: g.trendLabel, trendKeys: g.trendKeys,
      totalResults: g.totalResults, execTime: g.execTime,
      followUps: g.followUps, canvasLabel: g.canvasLabel, chatInsights: g.chatInsights,
    };
  }

  const lastAgentQueryRef = useRef<string>('');
  const lastAgentCtxRef = useRef<QueryContext | null>(null);

  async function handleBotReply(msg: string): Promise<string> {
    const prevQuery = lastAgentQueryRef.current;
    const contextPrefix = prevQuery
      ? `Previous query: "${prevQuery}". This is a follow-up. `
      : '';
    lastAgentQueryRef.current = msg;

    const agentContext = `You are the "${agent.name}" agent (${agent.category}). ${agent.desc}. Focus your response on this agent's specialty. `;
    const gemini = await queryGemini(agentContext + contextPrefix + msg);
    if (gemini) {
      lastGeminiRef.current = gemini;
      const ctx = geminiToCtx(gemini);
      lastAgentCtxRef.current = ctx;
      setDynamicCtx(ctx);
      setQueryKey(k => k + 1);
      setHasResults(true);
      setShowOutput(true);
      return gemini.replyText;
    }
    // Fallback — reuse previous context for follow-up chips
    lastGeminiRef.current = null;
    if (lastAgentCtxRef.current) {
      setHasResults(true);
      setShowOutput(true);
      return `Applied filter: **${msg}**\n\nRefined the previous results based on your selection. Updated data is in the output panel →`;
    }
    const fallbackCtx = makeCtx(sql, RESULT_ROWS);
    lastAgentCtxRef.current = fallbackCtx;
    setDynamicCtx(fallbackCtx);
    setQueryKey(k => k + 1);
    setHasResults(true);
    setShowOutput(true);
    return `Analyzed **81,500** pharmacy records based on your query.\n\nResults are ready in the output panel with detailed breakdowns, charts, and export options.`;
  }

  function handleOpenCanvasAgent(_qId: number, _text: string, canvasData?: unknown) {
    if (canvasData) {
      setDynamicCtx(canvasData as QueryContext);
      setQueryKey(k => k + 1);
    }
    setShowOutput(true);
    setActiveTab('results');
  }

  function handleBotReplied(_msg: string) {
    const g = lastGeminiRef.current;
    if (g) { const c = geminiToCtx(g); return { insights: g.chatInsights, followUps: g.followUps, canvasLabel: g.canvasLabel, canvasData: c }; }
    const ctx = lastAgentCtxRef.current;
    if (ctx) return { insights: ctx.chatInsights, followUps: ctx.followUps, canvasLabel: ctx.canvasLabel, canvasData: ctx };
    return {
      insights: [
        { icon: 'stat' as const, text: '81,500 pharmacy records analyzed', color: '#449055' },
        { icon: 'info' as const, text: `Agent: ${agent.name} (${agent.category})`, color: '#005C8D' },
      ],
      followUps: agentSuggestions.slice(0, 4),
      canvasLabel: 'View results',
    };
  }

  function handleGetInsights() {
    return [
      { icon: 'stat' as const, text: '81,500 pharmacy records analyzed', color: '#449055' },
      { icon: 'info' as const, text: `Agent: ${agent.name}`, color: '#005C8D' },
    ];
  }

  function handleGetFollowUps() {
    return agentSuggestions.slice(0, 4);
  }

  function handleGetCanvasLabel() {
    return 'View results';
  }

  function handleOpenCanvas(_qId: number, _text: string, canvasData?: unknown) {
    if (canvasData) {
      setDynamicCtx(canvasData as QueryContext);
      setQueryKey(k => k + 1);
    }
    setShowOutput(true);
    setActiveTab('results');
  }

  return (
    <>
      <Topbar
        title={agent.name}
        subtitle={`${agent.id.toUpperCase()} · ${agent.category}`}
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary" onClick={() => setShowThreads(o => !o)} style={{ fontSize: 12, gap: 5 }}>
              {showThreads ? 'Hide' : 'Show'} Threads
            </button>
            <button
              className={showOutput ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setShowOutput(o => !o)}
              style={{ fontSize: 12, gap: 5 }}
            >
              <IconBarChart size={13} color={showOutput ? '#fff' : undefined}/>
              {showOutput ? 'Hide Output' : 'Show Output'}
            </button>
          </div>
        }
      />
      <main style={{ display: 'flex', height: `calc(100vh - var(--topbar-h))` }}>

        {/* Thread sidebar */}
        {showThreads && (
          <ChatThreadsSidebar
            threads={threadState.threads}
            activeId={activeThreadId}
            onSelect={handleSelectAgentThread}
            onNew={handleNewAgentChat}
            onDelete={(id) => { threadState.deleteThread(id); threadMsgsRef.current.delete(id); }}
            onClose={() => setShowThreads(false)}
          />
        )}

        {/* LEFT: Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', width: showOutput ? chatWidth : '100%', flexShrink: showOutput ? 0 : undefined, flex: showOutput ? undefined : 1, minHeight: 0, overflow: 'hidden', transition: 'width .2s ease' }}>
          <div style={{ padding: '8px 18px', borderBottom: '1px solid #F3F4F6', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/agents" style={{ display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none', color: '#9CA3AF', fontSize: 12, fontWeight: 500 }}>
              <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}><IconChevronRight size={12}/></span>
              Back to Agents
            </Link>
          </div>

          <AgentChat
            key={activeThreadId || 'new'}
            agentName={agent.name}
            agentId={agent.id.toUpperCase()}
            gradient={cc.gradient}
            icon={catIcon(agent.category, 18)}
            welcomeMessage={`Hi! I'm ${agent.name}. ${agent.desc}\n\nI can search, analyze, and compare data across 81,500 pharmacy records. Ask me anything or pick a query below.`}
            suggestions={agentSuggestions}
            messages={agentChatMsgs}
            onMessagesChange={handleAgentMsgsChange}
            getBotReply={handleBotReply}
            getInsights={handleGetInsights}
            getFollowUps={handleGetFollowUps}
            getCanvasLabel={handleGetCanvasLabel}
            onBotReplied={handleBotReplied}
            onOpenCanvas={handleOpenCanvas}
            hideHeader
            fluid
          />
        </div>

        {showOutput && (
          <>
            {/* Resize handle */}
            <div
              onMouseDown={onMouseDown}
              style={{
                width: 6, flexShrink: 0, cursor: 'col-resize',
                background: 'transparent', position: 'relative', zIndex: 10,
              }}
              onMouseEnter={e => { const line = e.currentTarget.firstElementChild as HTMLElement; if (line) line.style.background = '#2D8AB5'; }}
              onMouseLeave={e => { const line = e.currentTarget.firstElementChild as HTMLElement; if (line) line.style.background = '#E2E8F0'; }}
            >
              <div style={{
                position: 'absolute', left: 2, top: 0, bottom: 0, width: 2,
                background: '#E2E8F0', transition: 'background .15s',
              }}/>
              <div style={{
                position: 'absolute', left: -2, top: '50%', transform: 'translateY(-50%)',
                width: 10, height: 40, borderRadius: 5,
                background: '#CBD5E1', opacity: 0.6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="4" height="16" viewBox="0 0 4 16" fill="#94A3B8">
                  <circle cx="2" cy="3" r="1.2"/><circle cx="2" cy="8" r="1.2"/><circle cx="2" cy="13" r="1.2"/>
                </svg>
              </div>
            </div>

            {/* RIGHT: Results panel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FAFBFC', minWidth: 0 }}>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#fff', flexShrink: 0 }}>
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                    padding: '12px 20px', fontSize: 13, fontWeight: activeTab === t.id ? 600 : 500,
                    color: activeTab === t.id ? 'var(--text-primary)' : '#9CA3AF',
                    background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: activeTab === t.id ? '2px solid #005C8D' : '2px solid transparent',
                    marginBottom: -1,
                  }}>{t.label}</button>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {!hasResults ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 16, background: '#E8F3F9', border: '1px solid #C6E0EC',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                    }}>
                      <IconCpu size={28} color="#2D8AB5"/>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8', marginBottom: 6 }}>Ready to run</div>
                    <div style={{ fontSize: 13, color: '#CBD5E1', maxWidth: 320, lineHeight: 1.6 }}>
                      Send a message in the chat to run this agent. Results will appear here.
                    </div>
                  </div>
                ) : dynamicCtx ? (
                  /* Gemini-powered dynamic output */
                  <React.Fragment key={queryKey}>
                    {activeTab === 'results' && (
                      <div>
                        {/* Insights */}
                        <div style={{ marginBottom: 16, padding: '14px 16px', borderRadius: 12, background: 'linear-gradient(135deg, #FAFBFC 0%, #E8F3F9 50%, #FAFBFC 100%)', border: '1px solid #E8EFF8' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>
                            <IconSparkles size={12} color="#005C8D"/> AI Insights
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {dynamicCtx.insights.map((ins, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: ins.type === 'danger' ? '#FEF2F2' : ins.type === 'warning' ? '#FFF7ED' : ins.type === 'success' ? '#ECFDF5' : '#E8F3F9', border: `1px solid ${ins.type === 'danger' ? '#FECACA' : ins.type === 'warning' ? '#FDE68A' : ins.type === 'success' ? '#A7F3D0' : '#8FC2D8'}`, fontSize: 12, color: ins.type === 'danger' ? '#991B1B' : ins.type === 'warning' ? '#92400E' : ins.type === 'success' ? '#2A6936' : '#1E40AF', lineHeight: 1.4 }}>
                                {ins.type === 'danger' ? <IconAlertTriangle size={14} color="#DC2626"/> : <IconBarChart size={14} color={ins.type === 'success' ? '#449055' : '#005C8D'}/>}
                                <span style={{ flex: 1 }}>{ins.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${dynamicCtx.stats.length},1fr)`, gap: 10, marginBottom: 18 }}>
                          {dynamicCtx.stats.map(s => (
                            <div key={s.label} style={{ padding: '12px 16px', borderRadius: 8, background: s.bg, textAlign: 'center' }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
                              <div style={{ fontSize: 20, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
                            </div>
                          ))}
                        </div>
                        {/* Table */}
                        <ResultsTab agentName={agent.name} resultRows={dynamicCtx.rows as ResultRow[]} onRowClick={setSelectedRow}/>
                      </div>
                    )}
                    {activeTab === 'sql' && <SharedSqlTab ctx={dynamicCtx}/>}
                    {activeTab === 'charts' && <SharedChartsTab ctx={dynamicCtx}/>}
                    {activeTab === 'export' && <SharedExportTab title={agent.name} ctx={dynamicCtx}/>}
                  </React.Fragment>
                ) : (
                  /* Static fallback */
                  <>
                    {activeTab === 'results' && <ResultsTab agentName={agent.name} resultRows={RESULT_ROWS} onRowClick={setSelectedRow}/>}
                    {activeTab === 'sql' && <SqlTab sql={sql} resultRows={RESULT_ROWS}/>}
                    {activeTab === 'charts' && <ChartsTab sql={sql} resultRows={RESULT_ROWS}/>}
                    {activeTab === 'export' && <ExportTab agentName={agent.name} resultRows={RESULT_ROWS} sql={sql}/>}
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Pharmacy Detail Drawer */}
        {selectedRow && (
          <>
            <div
              onClick={() => setSelectedRow(null)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)',
                zIndex: 99, animation: 'fadeIn .15s ease-out',
              }}
            />
            <PharmacyDrawer row={selectedRow} onClose={() => setSelectedRow(null)}/>
          </>
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .badge-pulse-warning { animation: pulseWarning 2s ease-in-out infinite; display: inline-flex; }
        .badge-pulse-danger { animation: pulseDanger 2s ease-in-out infinite; display: inline-flex; }
        @keyframes pulseWarning { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.1); } }
        @keyframes pulseDanger { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.15); } }
      `}</style>
    </>
  );
}

export default function AgentRunPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>Loading agent...</div>}>
      <AgentRunInner/>
    </Suspense>
  );
}
