// Mock data for dataQ.ai dashboard demo

export const stats = [
  {
    id: 'pharmacies',
    label: 'Total Pharmacies',
    value: '68,247',
    delta: '+312',
    deltaDir: 'up' as const,
    deltaPeriod: 'this month',
    icon: 'store',
    color: 'brand',
  },
  {
    id: 'credentials',
    label: 'Active Credentials',
    value: '94.2%',
    delta: '+1.3%',
    deltaDir: 'up' as const,
    deltaPeriod: 'vs last month',
    icon: 'shield',
    color: 'success',
  },
  {
    id: 'alerts',
    label: 'Active Alerts',
    value: '47',
    delta: '-8',
    deltaDir: 'down' as const,
    deltaPeriod: 'since yesterday',
    icon: 'bell',
    color: 'warning',
  },
  {
    id: 'api',
    label: 'API Calls Today',
    value: '1.24M',
    delta: '+18%',
    deltaDir: 'up' as const,
    deltaPeriod: 'vs yesterday',
    icon: 'zap',
    color: 'violet',
  },
];

export const credentialStatus = [
  { label: 'Active',    value: 64238, color: '#10B981', pct: 94.1 },
  { label: 'Expiring',  value: 2841,  color: '#F59E0B', pct: 4.2  },
  { label: 'Expired',   value: 1168,  color: '#EF4444', pct: 1.7  },
];

export const networkTrend = [
  { month: 'Oct', count: 65800 },
  { month: 'Nov', count: 66200 },
  { month: 'Dec', count: 66750 },
  { month: 'Jan', count: 67100 },
  { month: 'Feb', count: 67620 },
  { month: 'Mar', count: 68247 },
];

export const stateBreakdown = [
  { state: 'CA', count: 8420, pct: 86 },
  { state: 'TX', count: 7180, pct: 73 },
  { state: 'FL', count: 6340, pct: 65 },
  { state: 'NY', count: 5890, pct: 60 },
  { state: 'OH', count: 4210, pct: 43 },
  { state: 'PA', count: 3980, pct: 41 },
  { state: 'IL', count: 3750, pct: 38 },
  { state: 'GA', count: 2940, pct: 30 },
];

export const alerts = [
  {
    id: 'a1',
    severity: 'critical' as const,
    title: 'DEA Registration Expired',
    pharmacy: 'Wellness Pharmacy #0842',
    location: 'Houston, TX',
    time: '2 min ago',
    networks: 3,
    read: false,
  },
  {
    id: 'a2',
    severity: 'critical' as const,
    title: 'State License Expired',
    pharmacy: 'CareFirst Pharmacy',
    location: 'Miami, FL',
    time: '14 min ago',
    networks: 2,
    read: false,
  },
  {
    id: 'a3',
    severity: 'warning' as const,
    title: 'DEA Expiring in 30 Days',
    pharmacy: 'MedPlus Pharmacy #1204',
    location: 'Chicago, IL',
    time: '1 hr ago',
    networks: 5,
    read: false,
  },
  {
    id: 'a4',
    severity: 'warning' as const,
    title: 'FWA Risk Score Elevated',
    pharmacy: 'Sunrise Drugs LLC',
    location: 'Las Vegas, NV',
    time: '3 hr ago',
    networks: 1,
    read: true,
  },
  {
    id: 'a5',
    severity: 'info' as const,
    title: 'Ownership Change Detected',
    pharmacy: 'Green Valley Pharmacy',
    location: 'Phoenix, AZ',
    time: '5 hr ago',
    networks: 4,
    read: true,
  },
  {
    id: 'a6',
    severity: 'info' as const,
    title: 'New Accreditation Added',
    pharmacy: 'Specialty Care Pharmacy',
    location: 'Boston, MA',
    time: '8 hr ago',
    networks: 2,
    read: true,
  },
];

export const agents = [
  // Phase 1a — P0 core
  { id: 'agt-01', name: 'NCPDP Buddy',          category: 'Search & Discovery',       phase: '1a', priority: 'P0', icon: '💬', desc: 'General-purpose AI assistant for navigating the platform, answering data questions, and guiding users.',          uses: 12840 },
  { id: 'agt-04', name: 'Network Analyzer',      category: 'Network Management',       phase: '1a', priority: 'P0', icon: '🔍', desc: 'Analyzes network composition, coverage, gaps, and trends with interactive visualizations.',                       uses: 9210  },
  { id: 'agt-05', name: 'Change Tracker',        category: 'Network Management',       phase: '1a', priority: 'P0', icon: '📊', desc: 'Monitors all pharmacy profile changes — closures, openings, ownership changes, credential updates.',                uses: 7830  },
  { id: 'agt-09', name: 'Compliance Watchdog',   category: 'Compliance & Regulatory',  phase: '1a', priority: 'P0', icon: '🛡️', desc: 'Continuously monitors pharmacy credentials and flags compliance risks in real-time.',                              uses: 6450  },
  { id: 'agt-15', name: 'Data Feed Builder',     category: 'Data Delivery',            phase: '1a', priority: 'P0', icon: '⚙️', desc: 'Converts natural language requirements into custom data feed configurations.',                                      uses: 4320  },
  { id: 'agt-25', name: 'Custom Report Builder', category: 'Analytics & Prediction',   phase: '1a', priority: 'P0', icon: '📈', desc: 'Generates formatted reports from natural language descriptions in minutes.',                                         uses: 5670  },
  // Phase 1b
  { id: 'agt-02', name: 'Pharmacy Finder',       category: 'Search & Discovery',       phase: '1b', priority: 'P0', icon: '🔎', desc: 'Advanced pharmacy search with natural language, fuzzy matching, geographic proximity.',                             uses: 3210  },
  { id: 'agt-10', name: 'No Surprises Assistant',category: 'Compliance & Regulatory',  phase: '1b', priority: 'P0', icon: '⚖️', desc: 'Automates No Surprises Act compliance reporting, reducing reporting from hours to minutes.',                        uses: 2890  },
  { id: 'agt-20', name: 'Credentialing Assist',  category: 'Credentialing (resQ)',     phase: '1b', priority: 'P0', icon: '🏆', desc: 'Guides pharmacies through resQ credentialing step-by-step, reducing errors by 70%+.',                              uses: 2540  },
  { id: 'agt-06', name: 'Network Adequacy',      category: 'Network Management',       phase: '1b', priority: 'P1', icon: '🗺️', desc: 'Evaluates network adequacy against CMS, state, and accreditation standards.',                                     uses: 1870  },
  { id: 'agt-11', name: 'Regulatory Summary',    category: 'Compliance & Regulatory',  phase: '1b', priority: 'P1', icon: '📋', desc: 'Monitors and summarizes regulatory changes with network impact assessment.',                                       uses: 1640  },
  { id: 'agt-13', name: 'Credential Lifecycle',  category: 'Compliance & Regulatory',  phase: '1b', priority: 'P1', icon: '🔄', desc: 'Tracks complete lifecycle of every pharmacy credential through renewal cycles.',                                   uses: 2210  },
  { id: 'agt-21', name: 'Profile Completeness',  category: 'Credentialing (resQ)',     phase: '1b', priority: 'P1', icon: '✅', desc: 'Analyzes pharmacy profile and recommends updates for completeness and visibility.',                                 uses: 1320  },
  { id: 'agt-27', name: 'Batch Optimizer',       category: 'Claims & Routing',         phase: '1b', priority: 'P1', icon: '⚡', desc: 'Intelligent bulk download replacing 50-pharmacy limit — process thousands at once.',                               uses: 980   },
  { id: 'agt-32', name: 'Onboarding Agent',      category: 'NCPDP Internal',           phase: '1b', priority: 'P0', icon: '🚀', desc: 'Guides new subscribers through platform setup, reducing time-to-value from 45 days to 10 minutes.',                uses: 1450  },
  // Phase 1c
  { id: 'agt-03', name: 'Pharmacy Comparison',   category: 'Search & Discovery',       phase: '1c', priority: 'P1', icon: '⚖️', desc: 'Side-by-side comparison across demographics, services, credentials, and networks.',                               uses: 760   },
  { id: 'agt-07', name: 'Contract Intelligence', category: 'Network Management',       phase: '1c', priority: 'P1', icon: '📝', desc: 'Monitors ownership changes that may trigger contract renegotiation.',                                              uses: 540   },
  { id: 'agt-08', name: 'Formulary Alignment',   category: 'Network Management',       phase: '1c', priority: 'P1', icon: '💊', desc: 'Cross-references pharmacy capabilities against formulary requirements.',                                           uses: 430   },
  { id: 'agt-12', name: 'FWA Risk Scoring',      category: 'Compliance & Regulatory',  phase: '1c', priority: 'P1', icon: '🚨', desc: 'Analyzes pharmacy profiles for fraud, waste, and abuse risk indicators.',                                         uses: 890   },
  { id: 'agt-14', name: 'Enrollment Verifier',   category: 'Compliance & Regulatory',  phase: '1c', priority: 'P1', icon: '✔️', desc: 'Cross-references enrollment across Medicare, Medicaid, and commercial programs.',                                  uses: 670   },
  { id: 'agt-16', name: 'Directory Sync',        category: 'Data Delivery',            phase: '1c', priority: 'P1', icon: '🔗', desc: 'Compares subscriber\'s internal pharmacy directory against NCPDP source data.',                                   uses: 320   },
  { id: 'agt-17', name: 'E-Prescribing Router',  category: 'Data Delivery',            phase: '1c', priority: 'P2', icon: '💌', desc: 'Recommends optimal pharmacy routing based on prescription type and capabilities.',                                  uses: 210   },
  { id: 'agt-18', name: 'Data Quality Reconciler',category: 'Data Delivery',           phase: '1c', priority: 'P1', icon: '🧹', desc: 'Analyzes pharmacy data quality, identifies incomplete profiles and anomalies.',                                    uses: 480   },
  { id: 'agt-19', name: 'Standards Migration',   category: 'Data Delivery',            phase: '1c', priority: 'P2', icon: '🔀', desc: 'Analyzes impact of NCPDP standard version changes on subscriber implementations.',                                 uses: 180   },
  { id: 'agt-22', name: 'Network Visibility',    category: 'Credentialing (resQ)',     phase: '1c', priority: 'P1', icon: '👁️', desc: 'Identifies networks the pharmacy qualifies for but isn\'t currently in.',                                         uses: 290   },
  { id: 'agt-23', name: 'Pharmacy Desert Alert', category: 'Analytics & Prediction',   phase: '1c', priority: 'P1', icon: '🏜️', desc: 'Monitors geographic pharmacy coverage and identifies at-risk areas.',                                             uses: 350   },
  { id: 'agt-24', name: 'Closure Prediction',    category: 'Analytics & Prediction',   phase: '1c', priority: 'P2', icon: '🔮', desc: 'Predicts pharmacies at elevated closure risk using historical patterns.',                                          uses: 270   },
  { id: 'agt-26', name: 'Claims Optimizer',      category: 'Claims & Routing',         phase: '1c', priority: 'P1', icon: '💳', desc: 'Validates pharmacy identifiers in real-time during claim submission.',                                             uses: 620   },
  { id: 'agt-28', name: 'Support Voice',         category: 'NCPDP Internal',           phase: '1c', priority: 'P1', icon: '🎙️', desc: 'AI-assisted support for handling emails and calls, reducing response time.',                                      uses: 410   },
  { id: 'agt-29', name: 'Subscriber Sentiment',  category: 'NCPDP Internal',           phase: '1c', priority: 'P1', icon: '💭', desc: 'Analyzes support tickets for tone, urgency, and satisfaction as early warning.',                                   uses: 240   },
  { id: 'agt-30', name: 'Subscriber Insight',    category: 'NCPDP Internal',           phase: '1c', priority: 'P1', icon: '🎯', desc: 'Analyzes usage patterns, generates upsell recommendations for account managers.',                                  uses: 380   },
  { id: 'agt-31', name: 'Data Curation',         category: 'NCPDP Internal',           phase: '1c', priority: 'P2', icon: '🗂️', desc: 'Automatically packages data for different subscriber segments.',                                                   uses: 120   },
  { id: 'agt-33', name: 'Audit Trail Agent',     category: 'NCPDP Internal',           phase: '1c', priority: 'P1', icon: '📜', desc: 'Tracks all data access and generates HIPAA-compliant audit logs for regulated customers.',                         uses: 560   },
];

export const agentCategories = [
  'All',
  'Search & Discovery',
  'Network Management',
  'Compliance & Regulatory',
  'Data Delivery',
  'Credentialing (resQ)',
  'Analytics & Prediction',
  'Claims & Routing',
  'NCPDP Internal',
];

export const activityFeed = [
  { id: 1, type: 'alert',   text: 'DEA expired: Wellness Pharmacy #0842, Houston TX',             time: '2m',  severity: 'critical' },
  { id: 2, type: 'agent',   text: 'Network Analyzer ran for PBM client — 3 gaps detected',        time: '8m',  severity: 'warning'  },
  { id: 3, type: 'api',     text: 'API bulk request: 1,200 pharmacy records exported',             time: '14m', severity: 'info'     },
  { id: 4, type: 'alert',   text: 'License expiring: MedPlus Pharmacy #1204, Chicago IL (30d)',    time: '1h',  severity: 'warning'  },
  { id: 5, type: 'report',  text: 'Monthly compliance report generated for Aetna',                 time: '2h',  severity: 'info'     },
  { id: 6, type: 'agent',   text: 'Compliance Watchdog: 47 credentials reviewed, 2 flagged',      time: '3h',  severity: 'warning'  },
  { id: 7, type: 'api',     text: 'New subscriber onboarded: Cigna Healthcare (Enterprise tier)',  time: '5h',  severity: 'success'  },
  { id: 8, type: 'report',  text: 'No Surprises Act report submitted: BlueCross BlueShield',       time: '6h',  severity: 'success'  },
];

export const tickerMessages = [
  '🔴 DEA expired: Wellness Pharmacy #0842 (Houston, TX) — 3 networks affected',
  '⚠️  47 credential expiration alerts pending review',
  '✅ Platform uptime: 99.97% — All systems operational',
  '📊 68,247 active pharmacy records — Updated daily',
  '🤖 12 AI agents processed 4,820 queries today',
  '⚠️  DEA expiring in 30 days: MedPlus Pharmacy #1204 (Chicago, IL)',
  '✅ No Surprises Act report submitted successfully for BlueCross',
  '📈 API adoption up 18% this month — 1.24M calls today',
];

export const complianceMetrics = [
  { label: 'Network Adequacy',    score: 96, status: 'pass'    as const, detail: '64 of 67 CMS standards met' },
  { label: 'DEA Compliance',      score: 98, status: 'pass'    as const, detail: '2 expired, 1,168 active'    },
  { label: 'FWA Attestations',    score: 91, status: 'warning' as const, detail: '6 pharmacies under review'  },
  { label: 'No Surprises Act',    score: 88, status: 'warning' as const, detail: '12 reports due this week'   },
  { label: 'State License',       score: 99, status: 'pass'    as const, detail: 'All jurisdictions current'  },
  { label: 'Accreditations',      score: 94, status: 'pass'    as const, detail: 'URAC, ACHC, PCAB tracked'   },
];

export const pharmacyResults = [
  { id: 'NCP-001', name: 'Wellness Pharmacy #0842',    city: 'Houston',     state: 'TX', type: 'Retail',    status: 'critical', npi: '1234567890', dea: 'Expired',  networks: 3 },
  { id: 'NCP-002', name: 'CareFirst Pharmacy',          city: 'Miami',       state: 'FL', type: 'Retail',    status: 'critical', npi: '2345678901', dea: 'Active',   networks: 2 },
  { id: 'NCP-003', name: 'MedPlus Pharmacy #1204',      city: 'Chicago',     state: 'IL', type: 'Retail',    status: 'warning',  npi: '3456789012', dea: 'Expiring', networks: 5 },
  { id: 'NCP-004', name: 'Sunrise Specialty Pharmacy',  city: 'Phoenix',     state: 'AZ', type: 'Specialty', status: 'active',   npi: '4567890123', dea: 'Active',   networks: 4 },
  { id: 'NCP-005', name: 'Green Valley Pharmacy',       city: 'Seattle',     state: 'WA', type: 'Retail',    status: 'active',   npi: '5678901234', dea: 'Active',   networks: 3 },
  { id: 'NCP-006', name: 'BioPharm Compounding',        city: 'Boston',      state: 'MA', type: 'Specialty', status: 'active',   npi: '6789012345', dea: 'Active',   networks: 6 },
  { id: 'NCP-007', name: 'QuickMeds Pharmacy',          city: 'Denver',      state: 'CO', type: 'Retail',    status: 'active',   npi: '7890123456', dea: 'Active',   networks: 2 },
  { id: 'NCP-008', name: 'LifeSource Pharmacy',         city: 'Atlanta',     state: 'GA', type: 'LTC',       status: 'warning',  npi: '8901234567', dea: 'Expiring', networks: 1 },
];

export interface PharmacyCredential {
  label: string;
  id: string;
  status: 'Active' | 'Expiring' | 'Expired';
  expires: string;
  pct: number;
}
export interface NetworkMembership {
  name: string;
  relId: string;
  since: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}
export interface PharmacyChange {
  date: string;
  type: 'Alert' | 'Update' | 'Network' | 'Credential' | 'Ownership';
  desc: string;
  color: string;
}
export interface PharmacyProfile {
  address: string;
  zip: string;
  phone: string;
  fax: string;
  dba: string;
  legalName: string;
  hours: string;
  profileScore: number;
  dispenserClass: string;
  services: string[];
  credentials: PharmacyCredential[];
  networkMemberships: NetworkMembership[];
  changes: PharmacyChange[];
}

export const pharmacyProfiles: Record<string, PharmacyProfile> = {
  'NCP-001': {
    address: '4821 Main Street, Suite 102',
    zip: '77002',
    phone: '(713) 555-0142',
    fax: '(713) 555-0143',
    dba: 'Wellness Pharmacy',
    legalName: 'Wellness Healthcare Corp LLC',
    hours: 'Mon–Sat 8AM–7PM · Sun Closed',
    profileScore: 61,
    dispenserClass: 'Community / Retail',
    services: ['Prescription Dispensing', 'OTC Sales', 'Medication Counseling', 'Immunizations'],
    credentials: [
      { label: 'DEA Registration',    id: 'BW1234567',    status: 'Expired',  expires: 'Feb 28, 2026', pct: 0  },
      { label: 'TX State License',    id: 'TX-PH-28442',  status: 'Active',   expires: 'Dec 31, 2026', pct: 75 },
      { label: 'Medicare Enrollment', id: 'MCR-00192',    status: 'Active',   expires: 'Mar 1, 2027',  pct: 88 },
      { label: 'FWA Attestation',     id: 'FWA-2026-001', status: 'Expired',  expires: 'Jan 1, 2026',  pct: 0  },
    ],
    networkMemberships: [
      { name: 'Aetna PBM Network',  relId: 'REL-AET-00421', since: 'Jan 2018', status: 'Active'    },
      { name: 'Express Scripts',    relId: 'REL-ESI-11293', since: 'Mar 2019', status: 'Active'    },
      { name: 'OptumRx Network',    relId: 'REL-OPT-00892', since: 'Jun 2020', status: 'Suspended' },
    ],
    changes: [
      { date: 'Mar 31, 2026', type: 'Alert',      desc: 'DEA registration expired — network access under review',       color: '#DC2626' },
      { date: 'Feb 15, 2026', type: 'Update',     desc: 'Phone number updated via resQ portal by pharmacy administrator', color: '#2968B0' },
      { date: 'Jan 8, 2026',  type: 'Network',    desc: 'Removed from OptumRx network pending DEA renewal',            color: '#D97706' },
      { date: 'Nov 4, 2025',  type: 'Credential', desc: 'FWA Attestation expired — follow-up required',                color: '#DC2626' },
    ],
  },
  'NCP-002': {
    address: '1200 Brickell Avenue',
    zip: '33131',
    phone: '(305) 555-0287',
    fax: '(305) 555-0288',
    dba: 'CareFirst Pharmacy',
    legalName: 'CareFirst Health Services Inc',
    hours: 'Mon–Fri 9AM–8PM · Sat 10AM–5PM · Sun Closed',
    profileScore: 72,
    dispenserClass: 'Community / Retail',
    services: ['Prescription Dispensing', 'OTC Sales', 'Compounding', 'Diabetes Management', 'Medication Therapy Management'],
    credentials: [
      { label: 'DEA Registration',    id: 'AC9876543',    status: 'Active',   expires: 'Sep 30, 2027', pct: 92 },
      { label: 'FL State License',    id: 'FL-PH-48821',  status: 'Expiring', expires: 'Apr 30, 2026', pct: 20 },
      { label: 'Medicare Enrollment', id: 'MCR-04481',    status: 'Active',   expires: 'Jun 1, 2027',  pct: 95 },
      { label: 'FWA Attestation',     id: 'FWA-2026-112', status: 'Active',   expires: 'Jan 1, 2027',  pct: 80 },
    ],
    networkMemberships: [
      { name: 'Humana PBM Network',  relId: 'REL-HUM-00312', since: 'May 2017', status: 'Active'   },
      { name: 'CVS/Caremark',        relId: 'REL-CVS-20091', since: 'Aug 2020', status: 'Active'   },
    ],
    changes: [
      { date: 'Mar 28, 2026', type: 'Alert',      desc: 'State license expiring in 33 days — renewal notice sent',      color: '#D97706' },
      { date: 'Mar 10, 2026', type: 'Update',     desc: 'Operating hours updated: extended Saturday hours added',         color: '#2968B0' },
      { date: 'Jan 22, 2026', type: 'Credential', desc: 'FWA Attestation renewed for 2026',                              color: '#10B981' },
    ],
  },
  'NCP-003': {
    address: '820 W Madison Street',
    zip: '60661',
    phone: '(312) 555-0399',
    fax: '(312) 555-0400',
    dba: 'MedPlus Pharmacy',
    legalName: 'MedPlus Pharmacy Group LLC',
    hours: 'Mon–Fri 8AM–9PM · Sat–Sun 10AM–6PM',
    profileScore: 84,
    dispenserClass: 'Community / Retail',
    services: ['Prescription Dispensing', 'OTC Sales', 'Immunizations', 'Medication Synchronization', 'Blister Packaging', 'Specialty Drugs'],
    credentials: [
      { label: 'DEA Registration',    id: 'BM3344512',    status: 'Expiring', expires: 'Apr 30, 2026', pct: 15 },
      { label: 'IL State License',    id: 'IL-PH-99241',  status: 'Active',   expires: 'Jun 30, 2027', pct: 88 },
      { label: 'Medicare Enrollment', id: 'MCR-07712',    status: 'Active',   expires: 'Dec 1, 2027',  pct: 97 },
      { label: 'FWA Attestation',     id: 'FWA-2026-089', status: 'Active',   expires: 'Jan 1, 2027',  pct: 80 },
      { label: 'URAC Accreditation',  id: 'URAC-24-8841', status: 'Active',   expires: 'Dec 31, 2026', pct: 72 },
    ],
    networkMemberships: [
      { name: 'Aetna PBM Network',  relId: 'REL-AET-03312', since: 'Feb 2016', status: 'Active' },
      { name: 'Express Scripts',    relId: 'REL-ESI-29871', since: 'Apr 2015', status: 'Active' },
      { name: 'OptumRx Network',    relId: 'REL-OPT-11202', since: 'Jan 2018', status: 'Active' },
      { name: 'Prime Therapeutics', relId: 'REL-PRM-00412', since: 'Mar 2021', status: 'Active' },
      { name: 'CVS/Caremark',       relId: 'REL-CVS-31009', since: 'Jul 2019', status: 'Active' },
    ],
    changes: [
      { date: 'Mar 29, 2026', type: 'Alert',      desc: 'DEA expiring in 30 days — auto-notification sent to administrator', color: '#D97706' },
      { date: 'Mar 1, 2026',  type: 'Update',     desc: 'Added Specialty Drugs service capability to profile',               color: '#2968B0' },
      { date: 'Dec 18, 2025', type: 'Credential', desc: 'URAC accreditation renewed — valid through Dec 2026',               color: '#10B981' },
      { date: 'Oct 5, 2025',  type: 'Network',    desc: 'Added to Prime Therapeutics specialty drug network',                color: '#10B981' },
    ],
  },
  'NCP-004': {
    address: '3550 N Central Avenue, Suite 200',
    zip: '85012',
    phone: '(602) 555-0512',
    fax: '(602) 555-0513',
    dba: 'Sunrise Specialty Pharmacy',
    legalName: 'Sunrise Health Solutions LLC',
    hours: 'Mon–Fri 8AM–6PM · 24/7 On-Call',
    profileScore: 97,
    dispenserClass: 'Specialty Pharmacy',
    services: ['Specialty Drug Dispensing', 'Medication Therapy Management', 'Prior Authorization Support', 'Oncology', 'Rare Disease', 'Infusion Services', 'Patient Education'],
    credentials: [
      { label: 'DEA Registration',    id: 'AS4412290',    status: 'Active',   expires: 'Nov 30, 2027', pct: 97 },
      { label: 'AZ State License',    id: 'AZ-PH-14892',  status: 'Active',   expires: 'Aug 31, 2027', pct: 94 },
      { label: 'Medicare Enrollment', id: 'MCR-08812',    status: 'Active',   expires: 'May 1, 2028',  pct: 98 },
      { label: 'FWA Attestation',     id: 'FWA-2026-224', status: 'Active',   expires: 'Jan 1, 2027',  pct: 80 },
      { label: 'URAC Accreditation',  id: 'URAC-24-2281', status: 'Active',   expires: 'Sep 30, 2027', pct: 91 },
      { label: 'ACHC Accreditation',  id: 'ACHC-24-0041', status: 'Active',   expires: 'Jul 31, 2027', pct: 88 },
    ],
    networkMemberships: [
      { name: 'Aetna Specialty Network',  relId: 'REL-AET-SP-0041', since: 'Mar 2018', status: 'Active' },
      { name: 'Humana Specialty',         relId: 'REL-HUM-SP-1122', since: 'Jun 2019', status: 'Active' },
      { name: 'Express Scripts Specialty',relId: 'REL-ESI-SP-0882', since: 'Jan 2017', status: 'Active' },
      { name: 'OptumRx Specialty',        relId: 'REL-OPT-SP-3312', since: 'Feb 2020', status: 'Active' },
    ],
    changes: [
      { date: 'Mar 20, 2026', type: 'Credential', desc: 'Annual URAC accreditation review — passed with commendation',    color: '#10B981' },
      { date: 'Feb 8, 2026',  type: 'Network',    desc: 'Added to Humana oncology specialty drug network',                color: '#10B981' },
      { date: 'Jan 15, 2026', type: 'Update',     desc: 'Rare Disease service capability added to profile',               color: '#2968B0' },
      { date: 'Nov 1, 2025',  type: 'Ownership',  desc: 'Partial ownership transfer — Sunrise Health Solutions LLC (80%)', color: '#6D28D9' },
    ],
  },
  'NCP-005': {
    address: '512 Pine Street NW',
    zip: '98101',
    phone: '(206) 555-0671',
    fax: '(206) 555-0672',
    dba: 'Green Valley Pharmacy',
    legalName: 'Green Valley Healthcare Partners LLC',
    hours: 'Mon–Fri 9AM–8PM · Sat 10AM–6PM · Sun 11AM–5PM',
    profileScore: 91,
    dispenserClass: 'Community / Retail',
    services: ['Prescription Dispensing', 'OTC Sales', 'Immunizations', 'Diabetes Management', 'Medication Synchronization', 'Compounding'],
    credentials: [
      { label: 'DEA Registration',    id: 'AG7712340',    status: 'Active',   expires: 'Jul 31, 2027', pct: 96 },
      { label: 'WA State License',    id: 'WA-PH-30012',  status: 'Active',   expires: 'Oct 31, 2027', pct: 97 },
      { label: 'Medicare Enrollment', id: 'MCR-12004',    status: 'Active',   expires: 'Sep 1, 2027',  pct: 94 },
      { label: 'FWA Attestation',     id: 'FWA-2026-198', status: 'Active',   expires: 'Jan 1, 2027',  pct: 80 },
    ],
    networkMemberships: [
      { name: 'Premera Blue Cross',   relId: 'REL-PBC-00771', since: 'Apr 2016', status: 'Active' },
      { name: 'OptumRx Network',      relId: 'REL-OPT-44012', since: 'Aug 2018', status: 'Active' },
      { name: 'Regence BlueCross',    relId: 'REL-RGB-00193', since: 'Nov 2020', status: 'Active' },
    ],
    changes: [
      { date: 'Mar 5, 2026',  type: 'Ownership',  desc: 'Change of ownership — Green Valley Healthcare Partners LLC',   color: '#6D28D9' },
      { date: 'Feb 20, 2026', type: 'Credential', desc: 'FWA Attestation renewed for 2026 — submitted via portal',      color: '#10B981' },
      { date: 'Jan 12, 2026', type: 'Update',     desc: 'Sunday hours added: 11AM–5PM',                                 color: '#2968B0' },
    ],
  },
  'NCP-006': {
    address: '200 Boylston Street',
    zip: '02116',
    phone: '(617) 555-0842',
    fax: '(617) 555-0843',
    dba: 'BioPharm Compounding',
    legalName: 'BioPharm Specialty Compounding LLC',
    hours: 'Mon–Fri 8AM–5PM · By Appointment',
    profileScore: 96,
    dispenserClass: 'Compounding / Specialty',
    services: ['Sterile Compounding', 'Non-Sterile Compounding', 'Specialty Drug Dispensing', 'Hormone Therapy', 'Veterinary Compounding', 'Oncology Compounding'],
    credentials: [
      { label: 'DEA Registration',    id: 'AB8824130',    status: 'Active',   expires: 'Dec 31, 2027', pct: 98 },
      { label: 'MA State License',    id: 'MA-PH-71223',  status: 'Active',   expires: 'Nov 30, 2026', pct: 85 },
      { label: 'Medicare Enrollment', id: 'MCR-19841',    status: 'Active',   expires: 'Aug 1, 2027',  pct: 93 },
      { label: 'FWA Attestation',     id: 'FWA-2026-077', status: 'Active',   expires: 'Jan 1, 2027',  pct: 80 },
      { label: 'PCAB Accreditation',  id: 'PCAB-24-0012', status: 'Active',   expires: 'Jun 30, 2026', pct: 60 },
    ],
    networkMemberships: [
      { name: 'Aetna PBM Network',    relId: 'REL-AET-08821', since: 'Jan 2015', status: 'Active' },
      { name: 'Tufts Health Plan',    relId: 'REL-TUF-00312', since: 'Mar 2017', status: 'Active' },
      { name: 'BCBS MA Network',      relId: 'REL-BCB-11004', since: 'Jun 2016', status: 'Active' },
      { name: 'Harvard Pilgrim',      relId: 'REL-HPH-00892', since: 'Feb 2019', status: 'Active' },
      { name: 'Express Scripts',      relId: 'REL-ESI-44112', since: 'Apr 2018', status: 'Active' },
      { name: 'OptumRx Specialty',    relId: 'REL-OPT-22013', since: 'Sep 2021', status: 'Active' },
    ],
    changes: [
      { date: 'Mar 15, 2026', type: 'Credential', desc: 'PCAB renewal in progress — submission deadline Jun 2026',       color: '#D97706' },
      { date: 'Feb 1, 2026',  type: 'Network',    desc: 'Added to OptumRx oncology specialty compounding network',       color: '#10B981' },
      { date: 'Jan 20, 2026', type: 'Update',     desc: 'Veterinary Compounding service added to profile',               color: '#2968B0' },
    ],
  },
  'NCP-007': {
    address: '1845 Blake Street',
    zip: '80202',
    phone: '(720) 555-0921',
    fax: '(720) 555-0922',
    dba: 'QuickMeds Pharmacy',
    legalName: 'QuickMeds Health Services LLC',
    hours: 'Mon–Sun 8AM–10PM',
    profileScore: 88,
    dispenserClass: 'Community / Retail',
    services: ['Prescription Dispensing', 'OTC Sales', 'Immunizations', 'Medication Synchronization', 'Point-of-Care Testing'],
    credentials: [
      { label: 'DEA Registration',    id: 'AQ2231890',    status: 'Active',   expires: 'Aug 31, 2027', pct: 94 },
      { label: 'CO State License',    id: 'CO-PH-55112',  status: 'Active',   expires: 'Jul 31, 2027', pct: 92 },
      { label: 'Medicare Enrollment', id: 'MCR-22108',    status: 'Active',   expires: 'Nov 1, 2027',  pct: 96 },
      { label: 'FWA Attestation',     id: 'FWA-2026-301', status: 'Active',   expires: 'Jan 1, 2027',  pct: 80 },
    ],
    networkMemberships: [
      { name: 'Rocky Mountain Health', relId: 'REL-RMH-00421', since: 'Feb 2019', status: 'Active' },
      { name: 'OptumRx Network',       relId: 'REL-OPT-55214', since: 'May 2020', status: 'Active' },
    ],
    changes: [
      { date: 'Mar 10, 2026', type: 'Update',     desc: 'Extended hours — now open 7 days/week 8AM–10PM',               color: '#2968B0' },
      { date: 'Feb 14, 2026', type: 'Credential', desc: 'FWA Attestation renewed for 2026',                              color: '#10B981' },
      { date: 'Dec 1, 2025',  type: 'Network',    desc: 'Added Point-of-Care Testing certification',                     color: '#10B981' },
    ],
  },
  'NCP-008': {
    address: '3300 Piedmont Road NE, Suite 400',
    zip: '30305',
    phone: '(404) 555-1042',
    fax: '(404) 555-1043',
    dba: 'LifeSource Pharmacy',
    legalName: 'LifeSource Long-Term Care LLC',
    hours: 'Mon–Fri 8AM–5PM · 24/7 On-Call for LTC',
    profileScore: 79,
    dispenserClass: 'Long-Term Care (LTC)',
    services: ['LTC Drug Dispensing', 'Blister Packaging', 'Medication Therapy Management', 'IV / Infusion', 'Hospice Support', 'Consulting Services'],
    credentials: [
      { label: 'DEA Registration',    id: 'AL5578120',    status: 'Expiring', expires: 'May 15, 2026', pct: 18 },
      { label: 'GA State License',    id: 'GA-PH-18842',  status: 'Active',   expires: 'Jan 31, 2027', pct: 90 },
      { label: 'Medicare Enrollment', id: 'MCR-30012',    status: 'Active',   expires: 'Jul 1, 2027',  pct: 92 },
      { label: 'FWA Attestation',     id: 'FWA-2026-412', status: 'Active',   expires: 'Jan 1, 2027',  pct: 80 },
    ],
    networkMemberships: [
      { name: 'Aetna LTC Network', relId: 'REL-AET-LTC-0012', since: 'Nov 2018', status: 'Active' },
    ],
    changes: [
      { date: 'Mar 25, 2026', type: 'Alert',      desc: 'DEA renewal due in 51 days — outreach initiated by Credentialing Assist', color: '#D97706' },
      { date: 'Feb 28, 2026', type: 'Credential', desc: 'FWA Attestation renewed for 2026 — LTC exemption applied',               color: '#10B981' },
      { date: 'Jan 5, 2026',  type: 'Network',    desc: 'LTC network adequacy review — passed all CMS criteria',                  color: '#10B981' },
    ],
  },
};
