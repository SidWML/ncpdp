import type { QueryContext } from '@/components/ui/OutputPanel';

/* ── Shorthand row builders ──────────────────────────────────────── */
type R = QueryContext['rows'][number];
const r = (ncpdp: string, name: string, city: string, state: string, type: string, dea = 'Valid', status = 'Active', phone = '—'): R => ({ ncpdp, name, city, state, type, status, dea, phone });

/* ── Shorthand context builder ───────────────────────────────────── */
function c(p: Partial<QueryContext> & Pick<QueryContext, 'rows' | 'sql' | 'insights' | 'stats' | 'barData' | 'barLabel' | 'pieData' | 'pieLabel' | 'canvasLabel' | 'followUps' | 'chatInsights'>): QueryContext {
  return {
    trendData: [{ month: 'Oct', primary: 0, secondary: 0 }, { month: 'Nov', primary: 0, secondary: 0 }, { month: 'Dec', primary: 0, secondary: 0 }, { month: 'Jan', primary: 0, secondary: 0 }, { month: 'Feb', primary: 0, secondary: 0 }, { month: 'Mar', primary: 0, secondary: 0 }],
    trendLabel: 'Trend', trendKeys: ['Primary', 'Secondary'], totalResults: p.rows.length, execTime: '0.5s', ...p,
  };
}

/* ================================================================= */
/*  REPLY TEXT — one per suggestion                                   */
/* ================================================================= */
export const SUGGESTION_REPLIES: Record<string, string> = {
  /* ── WebConnect ── */
  'Find all specialty pharmacies in California':
    'Found **512 specialty pharmacies** in California.\n\nLos Angeles leads with 94, followed by San Diego (67) and San Francisco (58). All filtered by active DEA.\n\nFull results in the output panel →',
  'Look up pharmacy by NCPDP ID 0512345':
    'Found **Option Care Health** (NCPDP ID: 0512345) in Los Angeles, CA.\n\nSingle pharmacy profile loaded with credentials, network memberships, and compliance history.\n\nFull profile in the output panel →',
  'Show 24/7 pharmacies near Houston, TX':
    'Found **38 pharmacies** open 24/7 near Houston, TX.\n\nCVS (14 locations), Walgreens (12), HEB (6), Kroger (4), and 2 independents. All have valid DEA.\n\nFull list in the output panel →',
  'List compounding pharmacies in Texas':
    'Found **347 compounding pharmacies** in Texas.\n\n142 sterile and 205 non-sterile. Houston leads with 89 locations.\n\nDetailed list in the output panel →',
  'Show compounding pharmacies in Virginia':
    'Found **124 compounding pharmacies** in Virginia.\n\nRichmond leads with 28, Arlington (22), Virginia Beach (18).\n\nFull list in the output panel →',

  /* ── OnDemand ── */
  'Generate a DEA expiry report for Q1 2026':
    'Report generated: **1,180 pharmacies** with DEA expiring in Q1 2026.\n\nJanuary: 380, February: 420, March: 380. Available as PDF, Excel, CSV.\n\nReport preview in the output panel →',
  'Export all specialty pharmacies as Excel':
    'Excel export ready: **4,820 specialty pharmacies** across 50 states.\n\nIncludes credentials, networks, and contact info. File size: ~18 MB.\n\nExport options in the output panel →',
  'Build a network coverage report for the Southwest':
    'Coverage report: **4 Southwest states** analyzed (AZ, NM, TX, NV).\n\nAZ: 98.4% adequate, NM: 88.1% (below threshold), TX: 102.9%, NV: 91.2%.\n\nFull report in the output panel →',
  'Generate monthly compliance summary as PDF':
    'Compliance summary generated for **March 2026**.\n\nOverall score: 94/100. DEA: 98%, FWA: 90%, State License: 99%. 2 areas need review.\n\nPDF preview in the output panel →',
  'Create a custom dataset of LTC pharmacies by state':
    'Dataset created: **3,420 LTC pharmacies** across 50 states.\n\nCA leads with 412, TX: 358, FL: 296. Includes bed count, services, and credentials.\n\nDataset preview in the output panel →',

  /* ── Compounding (shared with WebConnect where text matches) ── */
  'List all compounding pharmacies in Texas':
    'Found **347 compounding pharmacies** in Texas.\n\n142 sterile and 205 non-sterile. Houston leads with 89 locations.\n\nDetailed list in the output panel →',
  'How many compounding pharmacies are in California?':
    'California has **512 compounding pharmacies** — the most in the US.\n\n198 sterile, 314 non-sterile. LA County leads with 124 facilities.\n\nBreakdown in the output panel →',
  'Find sterile compounding pharmacies near Houston':
    'Found **42 sterile compounding pharmacies** in the Houston metro.\n\nAll have valid DEA. 28 are ACHC accredited, 18 PCAB certified.\n\nFull list in the output panel →',
  'Which states have the most compounding pharmacies?':
    'Top states: **CA (512)**, TX (347), FL (296), NY (231), OH (178).\n\n2,840 total compounding pharmacies across all 50 states.\n\nState breakdown in the output panel →',

  /* ── Pharmacy Audit ── */
  'Run a full compliance audit across all networks':
    'Compliance audit complete across **81,500 pharmacies**.\n\nOverall score: 94/100. DEA: 98%, FWA: 90%, State License: 99%. 2 areas flagged.\n\nFull audit in the output panel →',
  'Show pharmacies with DEA expiring in 30 days':
    'Found **89 pharmacies** with DEA expiring within 30 days.\n\nTX leads with 24, CA: 18, FL: 14. All have been sent renewal notifications.\n\nExpiry list in the output panel →',
  'Which pharmacies have expired state licenses?':
    'Found **490 pharmacies** with expired state licenses.\n\nFL: 82, TX: 71, CA: 64. All flagged for immediate remediation.\n\nFull list in the output panel →',
  'What is our overall compliance audit score?':
    'Overall compliance score: **94 out of 100**.\n\nDEA: 98%, FWA attestation: 90%, State License: 99%, Accreditations: 94%.\n\nScore breakdown in the output panel →',
  'Show credential gaps by state':
    'Credential gap analysis across **50 states**.\n\nMT has the largest gap (22%), followed by WV (18%) and AK (16%). 44 states above threshold.\n\nState breakdown in the output panel →',

  /* ── CHOW ── */
  'Show recent ownership changes this month':
    'Found **18 ownership changes** this month.\n\n4 high priority, 12 processed, 6 pending review. AZ and FL have the most activity.\n\nCHOW list in the output panel →',
  'Which ownership transfers affect active contracts?':
    'Found **4 ownership changes** affecting active contracts.\n\n2 require contract renegotiation, 2 under legal review. Networks: Aetna, OptumRx, Humana.\n\nContract impact in the output panel →',
  'List all CHOW events flagged as high priority':
    'Found **4 high-priority CHOW events** this month.\n\nAll involve pharmacies with 3+ network contracts. Immediate attention required.\n\nPriority list in the output panel →',
  'Show ownership change history for Green Valley Pharmacy':
    '**Green Valley Pharmacy** (Seattle, WA) had 1 ownership change on Mar 5, 2026.\n\nNew entity: Green Valley Healthcare Partners LLC. Status: Processed.\n\nFull history in the output panel →',
  'How many pharmacies changed ownership in Q1?':
    '**48 ownership changes** in Q1 2026 — 18 this month alone.\n\n36 processed, 8 under review, 4 pending. Historical total: 1,128.\n\nQ1 details in the output panel →',

  /* ── Geographic ── */
  'Network adequacy breakdown by state':
    'Adequacy analysis across **50 states**.\n\n44 meet the 90% threshold. 6 below: MT (78%), WV (82%), AK (84%), ND (85%), WY (86%), NM (88%).\n\nState map in the output panel →',
  'Which states are below the adequacy threshold?':
    '**6 states** fall below the 90% adequacy threshold.\n\nMT: 78%, WV: 82%, AK: 84%, ND: 85%, WY: 86%, NM: 88%. All primarily rural gaps.\n\nDetails in the output panel →',
  'Show pharmacy desert zones in the Southeast':
    'Found **12 pharmacy desert zones** in the Southeast.\n\n3 critical: Rural East TX (7 counties), South GA corridor, Central AL. Combined gap: 182K underserved.\n\nDesert map in the output panel →',
  'How many pharmacies are in rural California counties?':
    '**1,840 pharmacies** in rural California counties (18.2% of CA total).\n\nKern County leads with 142, followed by Tulare (98) and Fresno (86).\n\nCounty breakdown in the output panel →',
  'Map coverage gaps for my PBM network':
    'Coverage gap analysis for your PBM network: **8 gap zones** identified.\n\n3 critical (rural TX, GA, AL), 5 moderate. 466 pharmacies needed to close all gaps.\n\nGap map in the output panel →',

  /* ── Batch Download ── */
  'Download all active pharmacy records as CSV':
    'CSV download prepared: **81,500 active pharmacy records**.\n\nFile size: ~210 MB. Includes demographics, credentials, and networks.\n\nDownload in the output panel →',
  'Bulk export pharmacies in TX, FL, and CA':
    'Bulk export ready: **26,380 pharmacies** in TX (8,640), FL (7,620), CA (10,120).\n\nFile size: ~68 MB. All formats available.\n\nExport options in the output panel →',
  'How many records were exported today?':
    '**3 batch exports** completed today — 24,600 records total.\n\n2 CSV exports and 1 JSON. Total data: 48.2 MB.\n\nExport history in the output panel →',
  'Schedule a weekly batch download of chain pharmacies':
    'Weekly batch scheduled: **every Monday at 6:00 AM ET**.\n\n~34,200 chain pharmacy records per run. Delivery: SFTP + email notification.\n\nSchedule config in the output panel →',
  'Export pharmacy demographics with custom field selection':
    'Custom export builder loaded: **81,500 records** with selectable fields.\n\nAvailable fields: Demographics, credentials, networks, services, hours, contacts.\n\nField selector in the output panel →',

  /* ── FWA ── */
  'Show pharmacies that attested FWA in the last 30 days':
    '**4,218 pharmacies** completed FWA attestation in the last 30 days.\n\nTX: 612, CA: 548, FL: 441, NY: 389. 90% overall attestation rate.\n\nAttestation list in the output panel →',
  'List independent pharmacies missing FWA attestation for 2025':
    'Found **1,420 independent pharmacies** missing FWA attestation for 2025.\n\nTX: 218, CA: 186, FL: 154. All past the Jan 1, 2025 deadline.\n\nMissing list in the output panel →',
  'Which independent pharmacies have not completed FWA attestation for 2026?':
    'Found **8,150 independent pharmacies** missing FWA attestation for 2026.\n\nTX: 1,220, CA: 980, FL: 840. Deadline: Jan 1, 2026.\n\nPending list in the output panel →',
  'Show all critical alerts requiring action':
    '**2 subscriptions nearing expiration** — no critical compliance violations.\n\nBoth flagged for renewal review. Overall alert volume is down from last month.\n\nAlert details in the output panel →',
  'Run FWA attestation status check':
    'FWA status: **73,350 of 81,500 pharmacies** (90%) attested.\n\n6,480 pending, 1,670 not started. TX has the largest gap (1,220 missing).\n\nFull status in the output panel →',
};

/* ================================================================= */
/*  QUERY CONTEXTS — one per suggestion                               */
/* ================================================================= */
export const SUGGESTION_CONTEXTS: Record<string, QueryContext> = {

  /* ───────── WebConnect ───────── */

  'Find all specialty pharmacies in California': c({
    rows: [r('0512345','Option Care Health','Los Angeles','CA','Specialty'), r('0534567','Diplomat Pharmacy','San Diego','CA','Specialty'), r('0556789','BrightSpring Health Services','Sacramento','CA','Specialty'), r('0501234','CarePharma Holdings','Long Beach','CA','Specialty'), r('0589012','PharMerica Corporation','San Jose','CA','LTC')],
    sql: `SELECT * FROM pharmacies WHERE state = 'CA' AND provider_type = 'Specialty' AND active = true ORDER BY city`,
    insights: [{ text: '512 specialty pharmacies in California', type: 'success' }, { text: 'Los Angeles leads with 94 facilities', type: 'info' }, { text: '3 DEA expirations in next 30 days', type: 'warning' }],
    stats: [{ label: 'CA Specialty', value: '512', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Los Angeles', value: '94', color: '#059669', bg: '#ECFDF5' }, { label: 'San Diego', value: '67', color: '#059669', bg: '#ECFDF5' }, { label: 'San Francisco', value: '58', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: 'LA', value: 94 }, { label: 'SD', value: 67 }, { label: 'SF', value: 58 }, { label: 'SAC', value: 42 }, { label: 'SJ', value: 38 }], barLabel: 'CA Specialty by City',
    pieData: [{ name: 'Oncology', value: 128, color: '#DC2626' }, { name: 'Infusion', value: 96, color: '#2968B0' }, { name: 'Rare Disease', value: 74, color: '#10B981' }, { name: 'Other', value: 214, color: '#94A3B8' }], pieLabel: 'Specialty Focus (CA)',
    trendData: [{ month: 'Oct', primary: 488, secondary: 12 }, { month: 'Nov', primary: 493, secondary: 8 }, { month: 'Dec', primary: 498, secondary: 10 }, { month: 'Jan', primary: 502, secondary: 6 }, { month: 'Feb', primary: 508, secondary: 9 }, { month: 'Mar', primary: 512, secondary: 7 }], trendLabel: 'CA Specialty Growth', trendKeys: ['Active', 'New'],
    totalResults: 512, execTime: '0.71s', canvasLabel: '512 specialty in CA',
    followUps: ['Filter Los Angeles only', 'Show oncology focus', 'Export CA specialty list', 'Show expiring DEA'],
    chatInsights: [{ icon: 'stat', text: '512 specialty pharmacies in California', color: '#059669' }, { icon: 'location', text: 'Los Angeles metro: 94 facilities', color: '#2968B0' }, { icon: 'warning', text: '3 DEA expirations within 30 days', color: '#D97706' }],
  }),

  'Look up pharmacy by NCPDP ID 0512345': c({
    rows: [r('0512345','Option Care Health','Los Angeles','CA','Specialty','Valid','Active','(213) 482-0198')],
    sql: `SELECT * FROM pharmacies p JOIN credentials c ON p.ncpdp_id = c.ncpdp_id WHERE p.ncpdp_id = '0512345'`,
    insights: [{ text: 'Option Care Health — NCPDP 0512345 — Active', type: 'success' }, { text: 'DEA Valid · 5 network memberships · Profile score 94', type: 'info' }],
    stats: [{ label: 'NCPDP ID', value: '0512345', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Profile Score', value: '94', color: '#059669', bg: '#ECFDF5' }, { label: 'Credentials', value: '4', color: '#334155', bg: '#F8FAFC' }, { label: 'Networks', value: '5', color: '#2968B0', bg: '#F0F7FF' }],
    barData: [{ label: 'DEA', value: 100 }, { label: 'License', value: 100 }, { label: 'FWA', value: 100 }, { label: 'Medicare', value: 100 }], barLabel: 'Credential Compliance (%)',
    pieData: [{ name: 'Active', value: 4, color: '#059669' }], pieLabel: 'Credential Status',
    trendData: [{ month: 'Oct', primary: 92, secondary: 0 }, { month: 'Nov', primary: 93, secondary: 0 }, { month: 'Dec', primary: 94, secondary: 1 }, { month: 'Jan', primary: 94, secondary: 0 }, { month: 'Feb', primary: 94, secondary: 0 }, { month: 'Mar', primary: 94, secondary: 0 }], trendLabel: 'Profile Score History', trendKeys: ['Score', 'Alerts'],
    totalResults: 1, execTime: '0.08s', canvasLabel: 'Profile: Option Care Health',
    followUps: ['Show credential history', 'View network memberships', 'Run compliance audit', 'Check FWA attestation'],
    chatInsights: [{ icon: 'stat', text: 'Option Care Health — Los Angeles, CA', color: '#059669' }, { icon: 'info', text: 'DEA Valid · Specialty · 5 networks', color: '#2968B0' }],
  }),

  'Show 24/7 pharmacies near Houston, TX': c({
    rows: [r('0481201','CVS Pharmacy #4182','Houston','TX','Retail','Valid','Active','(713) 524-3800'), r('0492310','Walgreens #12044','Houston','TX','Retail','Valid','Active','(713) 661-2490'), r('0503412','HEB Pharmacy #0281','Sugar Land','TX','Retail','Valid','Active','(281) 242-7100'), r('0514523','Walgreens #05918','Katy','TX','Retail','Valid','Active','(281) 391-2830'), r('0525634','CVS Pharmacy #6891','Pearland','TX','Retail','Valid','Active','(281) 485-9120'), r('0536745','Kroger Pharmacy #0542','Houston','TX','Retail','Valid','Active','(713) 789-4200')],
    sql: `SELECT * FROM pharmacies WHERE state = 'TX' AND hours_of_operation LIKE '%24/7%' AND city ILIKE '%Houston%' ORDER BY pharmacy_name`,
    insights: [{ text: '38 pharmacies open 24/7 in Houston metro', type: 'success' }, { text: 'All have valid DEA and active credentials', type: 'success' }, { text: 'CVS and Walgreens cover 68% of 24/7 locations', type: 'info' }],
    stats: [{ label: '24/7 Pharmacies', value: '38', color: '#059669', bg: '#ECFDF5' }, { label: 'Houston Metro', value: 'TX', color: '#2968B0', bg: '#F0F7FF' }, { label: 'DEA Valid', value: '100%', color: '#059669', bg: '#ECFDF5' }, { label: 'Avg Networks', value: '6.3', color: '#334155', bg: '#F8FAFC' }],
    barData: [{ label: 'CVS', value: 14 }, { label: 'Walgreens', value: 12 }, { label: 'HEB', value: 6 }, { label: 'Kroger', value: 4 }, { label: 'Other', value: 2 }], barLabel: '24/7 by Chain (Houston)',
    pieData: [{ name: 'Retail', value: 32, color: '#2968B0' }, { name: 'Specialty', value: 4, color: '#10B981' }, { name: 'Compounding', value: 2, color: '#F59E0B' }], pieLabel: '24/7 Pharmacy Types',
    trendData: [{ month: 'Oct', primary: 34, secondary: 2 }, { month: 'Nov', primary: 35, secondary: 1 }, { month: 'Dec', primary: 35, secondary: 3 }, { month: 'Jan', primary: 36, secondary: 1 }, { month: 'Feb', primary: 37, secondary: 2 }, { month: 'Mar', primary: 38, secondary: 1 }], trendLabel: '24/7 Count (Houston)', trendKeys: ['Open 24/7', 'New'],
    totalResults: 38, execTime: '0.41s', canvasLabel: '38 open 24/7 Houston',
    followUps: ['Show CVS only', 'Filter Houston city limits', 'Export 24/7 list', 'Show with drive-through'],
    chatInsights: [{ icon: 'stat', text: '38 pharmacies open 24/7 in Houston metro', color: '#059669' }, { icon: 'location', text: 'CVS (14) and Walgreens (12) lead', color: '#2968B0' }, { icon: 'info', text: 'All have valid DEA registrations', color: '#059669' }],
  }),

  'List compounding pharmacies in Texas': c({
    rows: [r('0912345','Empower Pharmacy','Houston','TX','Compounding','Valid','Active','(832) 678-4100'), r('0678234','NuVision Compounding Pharmacy','Houston','TX','Compounding','Valid','Active','(713) 781-4200'), r('0891456','Wedgewood Village Pharmacy','Dallas','TX','Compounding','Valid','Active','(214) 521-8900'), r('0234789','Stokes Pharmacy','San Antonio','TX','Compounding','Valid','Active','(210) 349-1700'), r('0456123','PCCA Member Pharmacy','Austin','TX','Compounding')],
    sql: `SELECT * FROM pharmacies WHERE state = 'TX' AND dispenser_class LIKE '%Compounding%' AND active = true ORDER BY city`,
    insights: [{ text: '347 compounding pharmacies in Texas', type: 'success' }, { text: 'Houston leads with 89 facilities', type: 'info' }, { text: '142 sterile, 205 non-sterile', type: 'info' }],
    stats: [{ label: 'TX Compounding', value: '347', color: '#059669', bg: '#ECFDF5' }, { label: 'Sterile', value: '142', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Non-Sterile', value: '205', color: '#D97706', bg: '#FFF7ED' }, { label: 'Houston', value: '89', color: '#334155', bg: '#F8FAFC' }],
    barData: [{ label: 'Houston', value: 89 }, { label: 'Dallas', value: 62 }, { label: 'San Antonio', value: 48 }, { label: 'Austin', value: 41 }, { label: 'Fort Worth', value: 34 }], barLabel: 'TX Compounding by City',
    pieData: [{ name: 'Sterile', value: 142, color: '#2968B0' }, { name: 'Non-Sterile', value: 205, color: '#10B981' }], pieLabel: 'Compounding Type (TX)',
    trendData: [{ month: 'Oct', primary: 328, secondary: 12 }, { month: 'Nov', primary: 332, secondary: 8 }, { month: 'Dec', primary: 335, secondary: 10 }, { month: 'Jan', primary: 339, secondary: 6 }, { month: 'Feb', primary: 343, secondary: 9 }, { month: 'Mar', primary: 347, secondary: 7 }], trendLabel: 'TX Compounding Growth', trendKeys: ['Active', 'New'],
    totalResults: 347, execTime: '0.48s', canvasLabel: '347 compounding in TX',
    followUps: ['Filter sterile only', 'Show Houston metro', 'Export TX list', 'Compare TX vs CA'],
    chatInsights: [{ icon: 'stat', text: '347 compounding pharmacies in Texas', color: '#059669' }, { icon: 'location', text: 'Houston leads with 89 facilities', color: '#2968B0' }, { icon: 'info', text: '142 sterile + 205 non-sterile', color: '#2968B0' }],
  }),

  'Show compounding pharmacies in Virginia': c({
    rows: [r('0771234','Professional Compounding Centers','Richmond','VA','Compounding'), r('0782345','Pace Pharmacy','Arlington','VA','Compounding'), r('0793456','Nova Compounding Pharmacy','Virginia Beach','VA','Compounding'), r('0804567','Blue Ridge Apothecary','Roanoke','VA','Compounding'), r('0815678','Shenandoah Compounding','Charlottesville','VA','Compounding')],
    sql: `SELECT * FROM pharmacies WHERE state = 'VA' AND dispenser_class LIKE '%Compounding%' AND active = true ORDER BY city`,
    insights: [{ text: '124 compounding pharmacies in Virginia', type: 'success' }, { text: 'Richmond (28) and Arlington (22) lead', type: 'info' }],
    stats: [{ label: 'VA Compounding', value: '124', color: '#059669', bg: '#ECFDF5' }, { label: 'Richmond', value: '28', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Arlington', value: '22', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Sterile', value: '48', color: '#334155', bg: '#F8FAFC' }],
    barData: [{ label: 'Richmond', value: 28 }, { label: 'Arlington', value: 22 }, { label: 'VA Beach', value: 18 }, { label: 'Roanoke', value: 14 }, { label: 'Other', value: 42 }], barLabel: 'VA Compounding by City',
    pieData: [{ name: 'Sterile', value: 48, color: '#2968B0' }, { name: 'Non-Sterile', value: 76, color: '#10B981' }], pieLabel: 'Compounding Type (VA)',
    trendData: [{ month: 'Oct', primary: 118, secondary: 4 }, { month: 'Nov', primary: 119, secondary: 2 }, { month: 'Dec', primary: 120, secondary: 3 }, { month: 'Jan', primary: 121, secondary: 1 }, { month: 'Feb', primary: 122, secondary: 3 }, { month: 'Mar', primary: 124, secondary: 2 }], trendLabel: 'VA Compounding Growth', trendKeys: ['Active', 'New'],
    totalResults: 124, execTime: '0.38s', canvasLabel: '124 compounding in VA',
    followUps: ['Filter Richmond only', 'Show sterile', 'Export VA list', 'Compare VA vs MD'],
    chatInsights: [{ icon: 'stat', text: '124 compounding pharmacies in Virginia', color: '#059669' }, { icon: 'location', text: 'Richmond leads with 28 facilities', color: '#2968B0' }],
  }),

  /* ───────── OnDemand ───────── */

  'Generate a DEA expiry report for Q1 2026': c({
    rows: [r('2810042','Accredo Health Group','Houston','TX','Specialty','Expiring'), r('0556789','BrightSpring Health Services','Sacramento','CA','Specialty','Expiring'), r('0501234','CarePharma Holdings','Long Beach','CA','Specialty','Expiring'), r('0412893','Coram CVS Specialty Infusion','Denver','CO','Infusion','Expired','Inactive'), r('7623041','Orsini Specialty Pharmacy','New York','NY','Specialty','Expiring')],
    sql: `SELECT * FROM pharmacies p JOIN credentials c ON p.ncpdp_id = c.ncpdp_id WHERE c.dea_expires BETWEEN '2026-01-01' AND '2026-03-31' ORDER BY c.dea_expires ASC`,
    insights: [{ text: '1,180 DEA expirations in Q1 2026', type: 'warning' }, { text: 'January: 380, February: 420, March: 380', type: 'info' }, { text: 'Report available as PDF, Excel, CSV', type: 'success' }],
    stats: [{ label: 'Q1 Expiring', value: '1,180', color: '#DC2626', bg: '#FEF2F2' }, { label: 'January', value: '380', color: '#D97706', bg: '#FFF7ED' }, { label: 'February', value: '420', color: '#D97706', bg: '#FFF7ED' }, { label: 'March', value: '380', color: '#D97706', bg: '#FFF7ED' }],
    barData: [{ label: 'Jan', value: 380 }, { label: 'Feb', value: 420 }, { label: 'Mar', value: 380 }], barLabel: 'DEA Expirations by Month (Q1)',
    pieData: [{ name: 'Retail', value: 680, color: '#2968B0' }, { name: 'Specialty', value: 340, color: '#10B981' }, { name: 'LTC', value: 160, color: '#F59E0B' }], pieLabel: 'Expiring by Type',
    trendData: [{ month: 'Q4-24', primary: 1050, secondary: 920 }, { month: 'Q1-25', primary: 1120, secondary: 980 }, { month: 'Q2-25', primary: 980, secondary: 890 }, { month: 'Q3-25', primary: 1060, secondary: 940 }, { month: 'Q4-25', primary: 1140, secondary: 1010 }, { month: 'Q1-26', primary: 1180, secondary: 0 }], trendLabel: 'Quarterly DEA Expiry', trendKeys: ['Expiring', 'Renewed'],
    totalResults: 1180, execTime: '0.55s', canvasLabel: '1,180 DEA expiring Q1',
    followUps: ['Download PDF report', 'Export as Excel', 'Filter specialty only', 'Show renewed on time'],
    chatInsights: [{ icon: 'warning', text: '1,180 pharmacies with DEA expiring Q1 2026', color: '#DC2626' }, { icon: 'info', text: 'February has the highest count: 420', color: '#2968B0' }],
  }),

  'Export all specialty pharmacies as Excel': c({
    rows: [r('0512345','Option Care Health','Los Angeles','CA','Specialty'), r('2810042','Accredo Health Group','Houston','TX','Specialty'), r('6701245','Shields Health Solutions','Boston','MA','Specialty'), r('4519827','ProCare Pharmacy','Seattle','WA','Specialty'), r('5920187','Genoa Healthcare Pharmacy','Miami','FL','Specialty')],
    sql: `SELECT * FROM pharmacies WHERE provider_type = 'Specialty' AND active = true ORDER BY state, city`,
    insights: [{ text: '4,820 specialty pharmacies ready for export', type: 'success' }, { text: 'Export includes credentials, networks, contacts', type: 'info' }],
    stats: [{ label: 'Specialty Total', value: '4,820', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Format', value: 'Excel', color: '#059669', bg: '#ECFDF5' }, { label: 'File Size', value: '~18 MB', color: '#334155', bg: '#F8FAFC' }, { label: 'States', value: '50', color: '#334155', bg: '#F8FAFC' }],
    barData: [{ label: 'CA', value: 512 }, { label: 'TX', value: 380 }, { label: 'FL', value: 340 }, { label: 'NY', value: 290 }, { label: 'Other', value: 3298 }], barLabel: 'Specialty by State',
    pieData: [{ name: 'Oncology', value: 1200, color: '#DC2626' }, { name: 'Infusion', value: 980, color: '#2968B0' }, { name: 'Rare Disease', value: 640, color: '#10B981' }, { name: 'Other', value: 2000, color: '#94A3B8' }], pieLabel: 'Specialty Types',
    totalResults: 4820, execTime: '1.2s', canvasLabel: '4,820 specialty — export',
    followUps: ['Download Excel now', 'Filter CA only', 'Add credential columns', 'Export as CSV'],
    chatInsights: [{ icon: 'stat', text: '4,820 specialty pharmacies across 50 states', color: '#059669' }, { icon: 'info', text: 'Includes DEA, license, FWA, network data', color: '#2968B0' }],
  }),

  'Build a network coverage report for the Southwest': c({
    rows: [r('3401298','BioScrip Infusion Services','Phoenix','AZ','Infusion'), r('2810042','Accredo Health Group','Houston','TX','Specialty'), r('0912345','Empower Pharmacy','Houston','TX','Compounding'), r('2345890','Maxor National Pharmacy','Dallas','TX','Retail')],
    sql: `SELECT state, COUNT(*) AS count, ROUND(COUNT(*)*100.0/required,1) AS adequacy FROM pharmacies p JOIN state_requirements r ON p.state = r.state WHERE p.state IN ('AZ','NM','TX','NV') GROUP BY state`,
    insights: [{ text: 'Southwest: 4 states analyzed', type: 'info' }, { text: 'NM at 88.1% — below 90% threshold', type: 'danger' }, { text: 'TX and AZ exceed requirements', type: 'success' }],
    stats: [{ label: 'AZ Adequacy', value: '98.4%', color: '#059669', bg: '#ECFDF5' }, { label: 'NM Adequacy', value: '88.1%', color: '#DC2626', bg: '#FEF2F2' }, { label: 'TX Adequacy', value: '102.9%', color: '#059669', bg: '#ECFDF5' }, { label: 'NV Adequacy', value: '91.2%', color: '#D97706', bg: '#FFF7ED' }],
    barData: [{ label: 'TX', value: 8640 }, { label: 'AZ', value: 1890 }, { label: 'NV', value: 1420 }, { label: 'NM', value: 980 }], barLabel: 'Pharmacy Count (Southwest)',
    pieData: [{ name: 'Exceeds', value: 2, color: '#059669' }, { name: 'Meets', value: 1, color: '#2968B0' }, { name: 'Below', value: 1, color: '#DC2626' }], pieLabel: 'Adequacy Status',
    totalResults: 4, execTime: '0.62s', canvasLabel: 'Southwest coverage report',
    followUps: ['Show NM gap details', 'Export coverage report', 'Add county breakdown', 'Compare with Southeast'],
    chatInsights: [{ icon: 'warning', text: 'New Mexico at 88.1% — below 90% threshold', color: '#DC2626' }, { icon: 'stat', text: 'TX and AZ exceed adequacy requirements', color: '#059669' }],
  }),

  'Generate monthly compliance summary as PDF': c({
    rows: [r('METRIC','DEA Compliance','—','—','98%'), r('METRIC','FWA Attestation','—','—','90%'), r('METRIC','State License','—','—','99%'), r('METRIC','Accreditations','—','—','94%')],
    sql: `SELECT metric_name, score, status, detail FROM compliance_dashboard WHERE report_period = '2026-03'`,
    insights: [{ text: 'Overall score: 94/100 — all critical met', type: 'success' }, { text: 'FWA at 90% — below 95% target', type: 'warning' }],
    stats: [{ label: 'Overall', value: '94/100', color: '#059669', bg: '#ECFDF5' }, { label: 'DEA', value: '98%', color: '#059669', bg: '#ECFDF5' }, { label: 'FWA', value: '90%', color: '#D97706', bg: '#FFF7ED' }, { label: 'License', value: '99%', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: 'DEA', value: 98 }, { label: 'FWA', value: 90 }, { label: 'License', value: 99 }, { label: 'Accred', value: 94 }], barLabel: 'Compliance Scores (%)',
    pieData: [{ name: 'Pass', value: 3, color: '#059669' }, { name: 'Warning', value: 1, color: '#F59E0B' }], pieLabel: 'Standards Status',
    totalResults: 4, execTime: '0.34s', canvasLabel: 'March compliance summary',
    followUps: ['Download PDF', 'Show FWA details', 'Compare with February', 'Export all metrics'],
    chatInsights: [{ icon: 'stat', text: 'Overall compliance: 94/100', color: '#059669' }, { icon: 'warning', text: 'FWA attestation at 90% — review needed', color: '#D97706' }],
  }),

  'Create a custom dataset of LTC pharmacies by state': c({
    rows: [r('0589012','PharMerica Corporation','San Jose','CA','Long-Term Care'), r('1209834','Kindred Healthcare Pharmacy','Chicago','IL','Long-Term Care'), r('3290156','OnePoint Patient Care','Atlanta','GA','Long-Term Care'), r('0523456','Omnicare Pharmacy','Fresno','CA','Long-Term Care')],
    sql: `SELECT state, COUNT(*) AS count FROM pharmacies WHERE provider_type = 'Long-Term Care' AND active = true GROUP BY state ORDER BY count DESC`,
    insights: [{ text: '3,420 LTC pharmacies across 50 states', type: 'success' }, { text: 'CA leads with 412, TX: 358, FL: 296', type: 'info' }],
    stats: [{ label: 'LTC Total', value: '3,420', color: '#2968B0', bg: '#F0F7FF' }, { label: 'CA', value: '412', color: '#059669', bg: '#ECFDF5' }, { label: 'TX', value: '358', color: '#059669', bg: '#ECFDF5' }, { label: 'FL', value: '296', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: 'CA', value: 412 }, { label: 'TX', value: 358 }, { label: 'FL', value: 296 }, { label: 'NY', value: 248 }, { label: 'IL', value: 220 }], barLabel: 'LTC Pharmacies by State',
    pieData: [{ name: 'CA', value: 412, color: '#2968B0' }, { name: 'TX', value: 358, color: '#10B981' }, { name: 'FL', value: 296, color: '#F59E0B' }, { name: 'Other', value: 2354, color: '#94A3B8' }], pieLabel: 'LTC Distribution',
    totalResults: 3420, execTime: '0.66s', canvasLabel: '3,420 LTC pharmacies',
    followUps: ['Filter CA only', 'Export LTC dataset', 'Add bed count field', 'Show with services'],
    chatInsights: [{ icon: 'stat', text: '3,420 LTC pharmacies in database', color: '#059669' }, { icon: 'location', text: 'CA (412), TX (358), FL (296) are top 3', color: '#2968B0' }],
  }),

  /* ───────── Compounding (extras — shared entries above) ───────── */

  'How many compounding pharmacies are in California?': c({
    rows: [r('0612345','BioPharm Compounding','Los Angeles','CA','Compounding'), r('0623456','Bay Area Compounding','San Francisco','CA','Compounding'), r('0634567','Pacific Compounding Rx','San Diego','CA','Compounding'), r('0645678','Valley Compounding','Fresno','CA','Compounding'), r('0656789','SoCal Sterile Pharmacy','Long Beach','CA','Compounding')],
    sql: `SELECT * FROM pharmacies WHERE state = 'CA' AND dispenser_class LIKE '%Compounding%' AND active = true ORDER BY city`,
    insights: [{ text: '512 compounding pharmacies in California — #1 in US', type: 'success' }, { text: 'LA County leads with 124 facilities', type: 'info' }],
    stats: [{ label: 'CA Compounding', value: '512', color: '#059669', bg: '#ECFDF5' }, { label: 'Sterile', value: '198', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Non-Sterile', value: '314', color: '#D97706', bg: '#FFF7ED' }, { label: 'LA County', value: '124', color: '#334155', bg: '#F8FAFC' }],
    barData: [{ label: 'LA', value: 124 }, { label: 'SF', value: 82 }, { label: 'SD', value: 68 }, { label: 'SAC', value: 52 }, { label: 'Other', value: 186 }], barLabel: 'CA Compounding by City',
    pieData: [{ name: 'Sterile', value: 198, color: '#2968B0' }, { name: 'Non-Sterile', value: 314, color: '#10B981' }], pieLabel: 'Compounding Type (CA)',
    totalResults: 512, execTime: '0.44s', canvasLabel: '512 compounding in CA',
    followUps: ['Show LA County only', 'Filter sterile', 'Compare CA vs TX', 'Export CA list'],
    chatInsights: [{ icon: 'stat', text: '512 compounding pharmacies in California', color: '#059669' }, { icon: 'location', text: 'LA County: 124 — largest concentration', color: '#2968B0' }],
  }),

  'Find sterile compounding pharmacies near Houston': c({
    rows: [r('0912345','Empower Pharmacy','Houston','TX','Sterile Compounding','Valid','Active','(832) 678-4100'), r('0678234','NuVision Compounding Pharmacy','Houston','TX','Sterile Compounding','Valid','Active','(713) 781-4200'), r('0671234','Houston Sterile Compounding','Houston','TX','Sterile Compounding'), r('0682345','Gulf Coast Compounding','Galveston','TX','Sterile Compounding'), r('0693456','Lone Star Sterile Rx','Sugar Land','TX','Sterile Compounding')],
    sql: `SELECT * FROM pharmacies WHERE state = 'TX' AND dispenser_class = 'Sterile Compounding' AND (city ILIKE '%Houston%' OR county IN (SELECT county FROM zip_codes WHERE city = 'Houston'))`,
    insights: [{ text: '42 sterile compounding in Houston metro', type: 'success' }, { text: '28 ACHC accredited, 18 PCAB certified', type: 'info' }],
    stats: [{ label: 'Sterile (Houston)', value: '42', color: '#059669', bg: '#ECFDF5' }, { label: 'DEA Valid', value: '100%', color: '#059669', bg: '#ECFDF5' }, { label: 'ACHC', value: '28', color: '#2968B0', bg: '#F0F7FF' }, { label: 'PCAB', value: '18', color: '#334155', bg: '#F8FAFC' }],
    barData: [{ label: 'Houston', value: 28 }, { label: 'Sugar Land', value: 6 }, { label: 'Katy', value: 4 }, { label: 'Galveston', value: 2 }, { label: 'Pearland', value: 2 }], barLabel: 'Sterile Compounding (Houston)',
    pieData: [{ name: 'Oncology', value: 14, color: '#DC2626' }, { name: 'Pain Mgmt', value: 12, color: '#F59E0B' }, { name: 'Hormone', value: 10, color: '#10B981' }, { name: 'Other', value: 6, color: '#94A3B8' }], pieLabel: 'Sterile Specialization',
    totalResults: 42, execTime: '0.36s', canvasLabel: '42 sterile Houston',
    followUps: ['Show ACHC accredited', 'Filter oncology', 'Export list', 'Compare with Dallas'],
    chatInsights: [{ icon: 'stat', text: '42 sterile compounding in Houston metro', color: '#059669' }, { icon: 'info', text: '28 ACHC accredited, 18 PCAB certified', color: '#2968B0' }],
  }),

  'Which states have the most compounding pharmacies?': c({
    rows: [r('0000000','California','—','CA','512 pharmacies'), r('0000000','Texas','—','TX','347 pharmacies'), r('0000000','Florida','—','FL','296 pharmacies'), r('0000000','New York','—','NY','231 pharmacies'), r('0000000','Ohio','—','OH','178 pharmacies'), r('0000000','Pennsylvania','—','PA','164 pharmacies')],
    sql: `SELECT state, COUNT(*) AS count FROM pharmacies WHERE dispenser_class LIKE '%Compounding%' AND active = true GROUP BY state ORDER BY count DESC`,
    insights: [{ text: '2,840 compounding pharmacies across US', type: 'success' }, { text: 'CA leads with 512, TX second with 347', type: 'info' }],
    stats: [{ label: 'US Total', value: '2,840', color: '#2968B0', bg: '#F0F7FF' }, { label: '#1 CA', value: '512', color: '#059669', bg: '#ECFDF5' }, { label: '#2 TX', value: '347', color: '#059669', bg: '#ECFDF5' }, { label: '#3 FL', value: '296', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: 'CA', value: 512 }, { label: 'TX', value: 347 }, { label: 'FL', value: 296 }, { label: 'NY', value: 231 }, { label: 'OH', value: 178 }, { label: 'PA', value: 164 }], barLabel: 'Compounding by State',
    pieData: [{ name: 'CA', value: 512, color: '#2968B0' }, { name: 'TX', value: 347, color: '#10B981' }, { name: 'FL', value: 296, color: '#F59E0B' }, { name: 'NY', value: 231, color: '#DC2626' }, { name: 'Other', value: 1454, color: '#94A3B8' }], pieLabel: 'National Share',
    totalResults: 2840, execTime: '0.52s', canvasLabel: '2,840 compounding US',
    followUps: ['Show CA breakdown', 'Compare sterile vs non-sterile', 'Filter by accreditation', 'Export national list'],
    chatInsights: [{ icon: 'stat', text: '2,840 compounding pharmacies in the US', color: '#059669' }, { icon: 'location', text: 'CA (512), TX (347), FL (296) are top 3', color: '#2968B0' }],
  }),

  /* ───────── Pharmacy Audit ───────── */

  'Run a full compliance audit across all networks': c({
    rows: [r('METRIC','DEA Compliance','—','—','98%'), r('METRIC','FWA Attestation','—','—','90%'), r('METRIC','State License','—','—','99%'), r('METRIC','Accreditations','—','—','94%'), r('METRIC','Network Adequacy','—','—','94.2%')],
    sql: `SELECT metric_name, score, status FROM compliance_dashboard ORDER BY score ASC`,
    insights: [{ text: 'Overall score: 94/100 — all critical met', type: 'success' }, { text: 'FWA at 90% needs attention', type: 'warning' }, { text: '81,500 pharmacy records audited', type: 'info' }],
    stats: [{ label: 'Overall', value: '94/100', color: '#059669', bg: '#ECFDF5' }, { label: 'DEA', value: '98%', color: '#059669', bg: '#ECFDF5' }, { label: 'FWA', value: '90%', color: '#D97706', bg: '#FFF7ED' }, { label: 'License', value: '99%', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: 'DEA', value: 98 }, { label: 'License', value: 99 }, { label: 'Accred', value: 94 }, { label: 'FWA', value: 90 }, { label: 'Adequacy', value: 94 }], barLabel: 'Compliance Scores (%)',
    pieData: [{ name: 'Pass', value: 4, color: '#059669' }, { name: 'Warning', value: 1, color: '#F59E0B' }], pieLabel: 'Audit Status',
    totalResults: 5, execTime: '1.8s', canvasLabel: 'Full audit — 94/100',
    followUps: ['Show FWA details', 'Export audit report', 'Compare with Q4', 'View DEA breakdown'],
    chatInsights: [{ icon: 'stat', text: 'Overall compliance: 94/100', color: '#059669' }, { icon: 'warning', text: 'FWA attestation at 90% — below target', color: '#D97706' }],
  }),

  'Show pharmacies with DEA expiring in 30 days': c({
    rows: [r('2810042','Accredo Health Group','Houston','TX','Specialty','Expiring','Active','(713) 654-4120'), r('0556789','BrightSpring Health Services','Sacramento','CA','Specialty','Expiring'), r('0501234','CarePharma Holdings','Long Beach','CA','Specialty','Expiring'), r('8832014','AdhereHealth Pharmacy','Nashville','TN','Specialty','Expiring'), r('7623041','Orsini Specialty Pharmacy','New York','NY','Specialty','Expiring')],
    sql: `SELECT * FROM pharmacies p JOIN credentials c ON p.ncpdp_id = c.ncpdp_id WHERE c.dea_status = 'Expiring' AND c.dea_expires <= CURRENT_DATE + 30 ORDER BY c.dea_expires ASC`,
    insights: [{ text: '89 DEA expirations in next 30 days', type: 'danger' }, { text: 'TX leads with 24, CA: 18, FL: 14', type: 'warning' }, { text: 'All sent renewal notifications', type: 'info' }],
    stats: [{ label: 'Expiring <30d', value: '89', color: '#DC2626', bg: '#FEF2F2' }, { label: 'TX', value: '24', color: '#D97706', bg: '#FFF7ED' }, { label: 'CA', value: '18', color: '#D97706', bg: '#FFF7ED' }, { label: 'FL', value: '14', color: '#D97706', bg: '#FFF7ED' }],
    barData: [{ label: 'TX', value: 24 }, { label: 'CA', value: 18 }, { label: 'FL', value: 14 }, { label: 'NY', value: 10 }, { label: 'TN', value: 8 }, { label: 'Other', value: 15 }], barLabel: 'DEA Expiring <30d by State',
    pieData: [{ name: 'Specialty', value: 42, color: '#2968B0' }, { name: 'Retail', value: 28, color: '#10B981' }, { name: 'LTC', value: 12, color: '#F59E0B' }, { name: 'Other', value: 7, color: '#94A3B8' }], pieLabel: 'Expiring by Type',
    totalResults: 89, execTime: '0.42s', canvasLabel: '89 DEA expiring 30d',
    followUps: ['Show TX only', 'Export expiry list', 'Send bulk renewal notices', 'Show 60-day window'],
    chatInsights: [{ icon: 'warning', text: '89 DEA expirations within 30 days', color: '#DC2626' }, { icon: 'location', text: 'TX leads with 24 expirations', color: '#2968B0' }],
  }),

  'Which pharmacies have expired state licenses?': c({
    rows: [r('0412893','Coram CVS Specialty Infusion','Denver','CO','Infusion','Expired','Inactive'), r('7623041','Orsini Specialty Pharmacy','New York','NY','Specialty','Expired','Inactive'), r('0000000','Metro Health Pharmacy','Chicago','IL','Retail','Expired','Inactive'), r('0000000','Sunrise Drugs LLC','Las Vegas','NV','Independent','Expired','Inactive')],
    sql: `SELECT * FROM pharmacies p JOIN credentials c ON p.ncpdp_id = c.ncpdp_id WHERE c.license_status = 'Expired' ORDER BY p.state`,
    insights: [{ text: '490 pharmacies with expired state licenses', type: 'danger' }, { text: 'FL: 82, TX: 71, CA: 64', type: 'warning' }],
    stats: [{ label: 'Expired Licenses', value: '490', color: '#DC2626', bg: '#FEF2F2' }, { label: 'FL', value: '82', color: '#D97706', bg: '#FFF7ED' }, { label: 'TX', value: '71', color: '#D97706', bg: '#FFF7ED' }, { label: 'CA', value: '64', color: '#D97706', bg: '#FFF7ED' }],
    barData: [{ label: 'FL', value: 82 }, { label: 'TX', value: 71 }, { label: 'CA', value: 64 }, { label: 'NY', value: 48 }, { label: 'IL', value: 42 }, { label: 'Other', value: 183 }], barLabel: 'Expired Licenses by State',
    pieData: [{ name: 'Retail', value: 210, color: '#2968B0' }, { name: 'Independent', value: 142, color: '#10B981' }, { name: 'Specialty', value: 86, color: '#F59E0B' }, { name: 'Other', value: 52, color: '#94A3B8' }], pieLabel: 'Expired by Type',
    totalResults: 490, execTime: '0.58s', canvasLabel: '490 expired licenses',
    followUps: ['Show FL only', 'Export expired list', 'Send remediation alerts', 'Show recently expired'],
    chatInsights: [{ icon: 'warning', text: '490 pharmacies with expired state licenses', color: '#DC2626' }, { icon: 'location', text: 'FL leads with 82 expired', color: '#2968B0' }],
  }),

  'What is our overall compliance audit score?': c({
    rows: [r('METRIC','DEA Compliance','—','—','98%'), r('METRIC','FWA Attestation','—','—','90%'), r('METRIC','State License','—','—','99%'), r('METRIC','Accreditations','—','—','94%')],
    sql: `SELECT metric_name, score FROM compliance_dashboard WHERE report_period = 'Q1-2026' ORDER BY score ASC`,
    insights: [{ text: 'Overall: 94/100 — above 90 benchmark', type: 'success' }, { text: 'FWA at 90% — below 95% target', type: 'warning' }],
    stats: [{ label: 'Overall', value: '94/100', color: '#059669', bg: '#ECFDF5' }, { label: 'DEA', value: '98%', color: '#059669', bg: '#ECFDF5' }, { label: 'FWA', value: '90%', color: '#D97706', bg: '#FFF7ED' }, { label: 'License', value: '99%', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: 'DEA', value: 98 }, { label: 'License', value: 99 }, { label: 'Accred', value: 94 }, { label: 'FWA', value: 90 }], barLabel: 'Compliance Scores',
    pieData: [{ name: 'Pass', value: 3, color: '#059669' }, { name: 'Warning', value: 1, color: '#F59E0B' }], pieLabel: 'Audit Status',
    totalResults: 4, execTime: '0.18s', canvasLabel: 'Score: 94/100',
    followUps: ['Show FWA details', 'Compare with Q4', 'Export score report', 'View historical trend'],
    chatInsights: [{ icon: 'stat', text: 'Overall compliance: 94/100', color: '#059669' }, { icon: 'warning', text: 'FWA at 90% — needs attention', color: '#D97706' }],
  }),

  'Show credential gaps by state': c({
    rows: [r('0000000','Montana','—','MT','78% adequacy','Expired','Inactive'), r('0000000','West Virginia','—','WV','82% adequacy','Expired','Inactive'), r('0000000','Alaska','—','AK','84% adequacy','Expiring'), r('0000000','North Dakota','—','ND','85% adequacy','Expiring'), r('0000000','Wyoming','—','WY','86% adequacy','Expiring'), r('0000000','New Mexico','—','NM','88% adequacy','Expiring')],
    sql: `SELECT state, credential_gap_pct, gap_count FROM state_credential_analysis WHERE credential_gap_pct > 10 ORDER BY credential_gap_pct DESC`,
    insights: [{ text: '6 states below 90% credential threshold', type: 'danger' }, { text: 'MT has largest gap at 22%', type: 'warning' }, { text: '44 states meet or exceed requirements', type: 'success' }],
    stats: [{ label: 'Below Threshold', value: '6', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Worst Gap', value: 'MT 22%', color: '#DC2626', bg: '#FEF2F2' }, { label: 'States OK', value: '44', color: '#059669', bg: '#ECFDF5' }, { label: 'National Avg', value: '94.2%', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: 'MT', value: 22 }, { label: 'WV', value: 18 }, { label: 'AK', value: 16 }, { label: 'ND', value: 15 }, { label: 'WY', value: 14 }, { label: 'NM', value: 12 }], barLabel: 'Credential Gap % by State',
    pieData: [{ name: 'Above 95%', value: 32, color: '#059669' }, { name: '90-95%', value: 12, color: '#2968B0' }, { name: 'Below 90%', value: 6, color: '#DC2626' }], pieLabel: 'State Distribution',
    totalResults: 6, execTime: '0.72s', canvasLabel: '6 states with gaps',
    followUps: ['Show MT details', 'Export gap report', 'View rural breakdown', 'Compare with last quarter'],
    chatInsights: [{ icon: 'warning', text: '6 states below 90% credential threshold', color: '#DC2626' }, { icon: 'stat', text: '44 states meet requirements — 94.2% national avg', color: '#059669' }],
  }),

  /* ───────── CHOW ───────── */

  'Show recent ownership changes this month': c({
    rows: [r('0000000','HealthMart RX','Phoenix','AZ','Ownership Change'), r('0000000','Wellness Drug Store','Miami','FL','Ownership Change'), r('0000000','Valley Health Pharmacy','Fresno','CA','Ownership Change'), r('0000000','Green Valley Pharmacy','Seattle','WA','Ownership Change')],
    sql: `SELECT * FROM ownership_changes WHERE change_date >= CURRENT_DATE - 30 ORDER BY change_date DESC`,
    insights: [{ text: '18 ownership changes this month', type: 'warning' }, { text: '4 high priority, 12 processed, 6 pending', type: 'info' }],
    stats: [{ label: 'This Month', value: '18', color: '#D97706', bg: '#FFF7ED' }, { label: 'High Priority', value: '4', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Processed', value: '12', color: '#059669', bg: '#ECFDF5' }, { label: 'Pending', value: '6', color: '#D97706', bg: '#FFF7ED' }],
    barData: [{ label: 'AZ', value: 4 }, { label: 'FL', value: 3 }, { label: 'CA', value: 3 }, { label: 'WA', value: 2 }, { label: 'TX', value: 2 }, { label: 'Other', value: 4 }], barLabel: 'CHOW by State',
    pieData: [{ name: 'Processed', value: 12, color: '#059669' }, { name: 'Under Review', value: 4, color: '#F59E0B' }, { name: 'Pending', value: 2, color: '#DC2626' }], pieLabel: 'CHOW Status',
    totalResults: 18, execTime: '0.29s', canvasLabel: '18 CHOW this month',
    followUps: ['Show high priority', 'Filter pending only', 'Export CHOW report', 'View contract impact'],
    chatInsights: [{ icon: 'warning', text: '18 ownership changes this month — 4 high priority', color: '#D97706' }, { icon: 'stat', text: '12 processed, 6 still pending review', color: '#2968B0' }],
  }),

  'Which ownership transfers affect active contracts?': c({
    rows: [r('0000000','HealthMart RX','Phoenix','AZ','Contract Impact — 3 networks'), r('0000000','Wellness Drug Store','Miami','FL','Contract Impact — 2 networks')],
    sql: `SELECT o.*, COUNT(n.network_id) AS affected_networks FROM ownership_changes o JOIN network_memberships n ON o.ncpdp_id = n.ncpdp_id WHERE o.change_date >= CURRENT_DATE - 30 AND n.status = 'Active' GROUP BY o.id HAVING COUNT(n.network_id) > 0`,
    insights: [{ text: '4 ownership changes affect active contracts', type: 'danger' }, { text: '2 require contract renegotiation', type: 'warning' }, { text: 'Networks: Aetna, OptumRx, Humana impacted', type: 'info' }],
    stats: [{ label: 'Contract Impact', value: '4', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Renegotiation', value: '2', color: '#D97706', bg: '#FFF7ED' }, { label: 'Legal Review', value: '2', color: '#D97706', bg: '#FFF7ED' }, { label: 'Networks Hit', value: '5', color: '#2968B0', bg: '#F0F7FF' }],
    barData: [{ label: 'Aetna', value: 2 }, { label: 'OptumRx', value: 2 }, { label: 'Humana', value: 1 }], barLabel: 'Affected Networks',
    pieData: [{ name: 'Renegotiation', value: 2, color: '#DC2626' }, { name: 'Legal Review', value: 2, color: '#F59E0B' }], pieLabel: 'Action Required',
    totalResults: 4, execTime: '0.24s', canvasLabel: '4 contract impacts',
    followUps: ['Show Aetna impact', 'View renegotiation details', 'Export contract report', 'Notify account managers'],
    chatInsights: [{ icon: 'warning', text: '4 ownership changes affect active contracts', color: '#DC2626' }, { icon: 'info', text: 'Aetna, OptumRx, Humana networks impacted', color: '#2968B0' }],
  }),

  'List all CHOW events flagged as high priority': c({
    rows: [r('0000000','HealthMart RX','Phoenix','AZ','High Priority — 3 networks'), r('0000000','Wellness Drug Store','Miami','FL','High Priority — 2 networks'), r('0000000','Metro Health Pharmacy','Chicago','IL','High Priority — 4 networks'), r('0000000','Sunrise Holdings #3','Phoenix','AZ','High Priority — 2 networks')],
    sql: `SELECT * FROM ownership_changes WHERE priority = 'High' AND change_date >= CURRENT_DATE - 30 ORDER BY change_date DESC`,
    insights: [{ text: '4 high-priority CHOW events this month', type: 'danger' }, { text: 'All involve 2+ network contracts', type: 'warning' }],
    stats: [{ label: 'High Priority', value: '4', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Networks Affected', value: '11', color: '#D97706', bg: '#FFF7ED' }, { label: 'Avg Networks', value: '2.8', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Action Needed', value: 'Immediate', color: '#DC2626', bg: '#FEF2F2' }],
    barData: [{ label: 'AZ', value: 2 }, { label: 'FL', value: 1 }, { label: 'IL', value: 1 }], barLabel: 'High Priority CHOW by State',
    pieData: [{ name: '3+ Networks', value: 2, color: '#DC2626' }, { name: '2 Networks', value: 2, color: '#F59E0B' }], pieLabel: 'Network Impact',
    totalResults: 4, execTime: '0.15s', canvasLabel: '4 high-priority CHOW',
    followUps: ['View contract details', 'Assign to team', 'Export priority list', 'Show processing timeline'],
    chatInsights: [{ icon: 'warning', text: '4 high-priority CHOW events requiring action', color: '#DC2626' }, { icon: 'info', text: '11 network contracts affected total', color: '#2968B0' }],
  }),

  'Show ownership change history for Green Valley Pharmacy': c({
    rows: [r('0000000','Green Valley Pharmacy','Seattle','WA','Ownership Change — Mar 5, 2026')],
    sql: `SELECT * FROM ownership_changes WHERE ncpdp_id = (SELECT ncpdp_id FROM pharmacies WHERE pharmacy_name ILIKE '%Green Valley%') ORDER BY change_date DESC`,
    insights: [{ text: 'Green Valley: 1 ownership change (Mar 5, 2026)', type: 'info' }, { text: 'New entity: Green Valley Healthcare Partners LLC', type: 'info' }],
    stats: [{ label: 'Pharmacy', value: 'Green Valley', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Location', value: 'Seattle, WA', color: '#334155', bg: '#F8FAFC' }, { label: 'CHOW Events', value: '1', color: '#D97706', bg: '#FFF7ED' }, { label: 'Status', value: 'Processed', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: '2024', value: 0 }, { label: '2025', value: 0 }, { label: '2026', value: 1 }], barLabel: 'CHOW History',
    pieData: [{ name: 'Processed', value: 1, color: '#059669' }], pieLabel: 'Status',
    totalResults: 1, execTime: '0.08s', canvasLabel: 'Green Valley CHOW',
    followUps: ['Show full profile', 'Check credentials', 'View network memberships', 'Show all WA CHOW'],
    chatInsights: [{ icon: 'info', text: '1 ownership change — Mar 5, 2026', color: '#2968B0' }, { icon: 'stat', text: 'New owner: Green Valley Healthcare Partners LLC', color: '#059669' }],
  }),

  'How many pharmacies changed ownership in Q1?': c({
    rows: [r('0000000','January 2026','—','—','14 changes'), r('0000000','February 2026','—','—','16 changes'), r('0000000','March 2026','—','—','18 changes')],
    sql: `SELECT DATE_TRUNC('month', change_date) AS month, COUNT(*) FROM ownership_changes WHERE change_date BETWEEN '2026-01-01' AND '2026-03-31' GROUP BY month`,
    insights: [{ text: '48 ownership changes in Q1 2026', type: 'warning' }, { text: '1,128 total CHOW processed historically', type: 'info' }],
    stats: [{ label: 'Q1 Total', value: '48', color: '#D97706', bg: '#FFF7ED' }, { label: 'March', value: '18', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Processed', value: '36', color: '#059669', bg: '#ECFDF5' }, { label: 'Pending', value: '12', color: '#D97706', bg: '#FFF7ED' }],
    barData: [{ label: 'Jan', value: 14 }, { label: 'Feb', value: 16 }, { label: 'Mar', value: 18 }], barLabel: 'Q1 CHOW by Month',
    pieData: [{ name: 'Processed', value: 36, color: '#059669' }, { name: 'Review', value: 8, color: '#F59E0B' }, { name: 'Pending', value: 4, color: '#DC2626' }], pieLabel: 'Q1 Status',
    totalResults: 48, execTime: '0.22s', canvasLabel: '48 CHOW Q1 2026',
    followUps: ['Show high priority', 'Filter by state', 'Compare Q1 vs Q4 2025', 'Export Q1 report'],
    chatInsights: [{ icon: 'stat', text: '48 ownership changes in Q1 2026', color: '#D97706' }, { icon: 'info', text: 'Historical total: 1,128 CHOW processed', color: '#2968B0' }],
  }),

  /* ───────── Geographic ───────── */

  'Network adequacy breakdown by state': c({
    rows: [r('0000000','California','—','CA','10,120 pharmacies — 105%'), r('0000000','Texas','—','TX','8,640 pharmacies — 103%'), r('0000000','Florida','—','FL','7,620 pharmacies — 101%'), r('0000000','Montana','—','MT','412 pharmacies — 82%'), r('0000000','Wyoming','—','WY','218 pharmacies — 78%'), r('0000000','N. Dakota','—','ND','287 pharmacies — 90%')],
    sql: `SELECT state, pharmacy_count, required, ROUND(pharmacy_count*100.0/required,1) AS adequacy_pct FROM state_adequacy ORDER BY adequacy_pct ASC`,
    insights: [{ text: '44 of 50 states meet 90% adequacy', type: 'success' }, { text: '6 states below threshold — primarily rural', type: 'danger' }],
    stats: [{ label: 'States OK', value: '44', color: '#059669', bg: '#ECFDF5' }, { label: 'Below 90%', value: '6', color: '#DC2626', bg: '#FEF2F2' }, { label: 'National', value: '94.2%', color: '#059669', bg: '#ECFDF5' }, { label: 'Pharmacies', value: '81,500', color: '#2968B0', bg: '#F0F7FF' }],
    barData: [{ label: 'CA', value: 105 }, { label: 'TX', value: 103 }, { label: 'FL', value: 101 }, { label: 'ND', value: 90 }, { label: 'MT', value: 82 }, { label: 'WY', value: 78 }], barLabel: 'Adequacy % by State',
    pieData: [{ name: 'Exceeds', value: 28, color: '#059669' }, { name: 'Meets', value: 16, color: '#2968B0' }, { name: 'Below', value: 6, color: '#DC2626' }], pieLabel: 'Adequacy Distribution',
    totalResults: 50, execTime: '0.91s', canvasLabel: '50 states analyzed',
    followUps: ['Show below-threshold only', 'View county detail', 'Export adequacy report', 'Show pharmacy deserts'],
    chatInsights: [{ icon: 'stat', text: '44 of 50 states meet 90% threshold', color: '#059669' }, { icon: 'warning', text: '6 states below: MT, WV, AK, ND, WY, NM', color: '#DC2626' }],
  }),

  'Which states are below the adequacy threshold?': c({
    rows: [r('0000000','Montana','—','MT','78% — Gap: 88'), r('0000000','West Virginia','—','WV','82% — Gap: 117'), r('0000000','Alaska','—','AK','84% — Gap: 62'), r('0000000','North Dakota','—','ND','85% — Gap: 33'), r('0000000','Wyoming','—','WY','86% — Gap: 62'), r('0000000','New Mexico','—','NM','88% — Gap: 44')],
    sql: `SELECT state, adequacy_pct, required - pharmacy_count AS gap FROM state_adequacy WHERE adequacy_pct < 90 ORDER BY adequacy_pct ASC`,
    insights: [{ text: '6 states below 90% adequacy threshold', type: 'danger' }, { text: 'Total gap: 406 pharmacies needed', type: 'warning' }],
    stats: [{ label: 'Below Threshold', value: '6', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Worst', value: 'MT 78%', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Total Gap', value: '406', color: '#D97706', bg: '#FFF7ED' }, { label: 'All Rural', value: 'Yes', color: '#334155', bg: '#F8FAFC' }],
    barData: [{ label: 'WY', value: 78 }, { label: 'MT', value: 82 }, { label: 'AK', value: 84 }, { label: 'ND', value: 85 }, { label: 'WY', value: 86 }, { label: 'NM', value: 88 }], barLabel: 'Below-Threshold States (%)',
    pieData: [{ name: 'Critical (<85%)', value: 3, color: '#DC2626' }, { name: 'Review (85-90%)', value: 3, color: '#F59E0B' }], pieLabel: 'Severity',
    totalResults: 6, execTime: '0.34s', canvasLabel: '6 states below 90%',
    followUps: ['Show MT county detail', 'View rural access data', 'Export gap report', 'Plan remediation'],
    chatInsights: [{ icon: 'warning', text: '6 states below 90% — all primarily rural', color: '#DC2626' }, { icon: 'stat', text: '406 total pharmacies needed to close gaps', color: '#D97706' }],
  }),

  'Show pharmacy desert zones in the Southeast': c({
    rows: [r('0000000','Rural East Texas','7 counties','TX','4 pharmacies / 182K pop'), r('0000000','South Georgia corridor','3 counties','GA','2 pharmacies / 94K pop'), r('0000000','Central Alabama','4 counties','AL','6 pharmacies / 127K pop')],
    sql: `SELECT zone_name, county_count, state, pharmacy_count, population FROM pharmacy_deserts WHERE region = 'Southeast' ORDER BY pharmacy_count ASC`,
    insights: [{ text: '12 pharmacy deserts in Southeast', type: 'danger' }, { text: '3 critical — combined 182K underserved', type: 'warning' }],
    stats: [{ label: 'Desert Zones', value: '12', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Critical', value: '3', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Population', value: '403K', color: '#D97706', bg: '#FFF7ED' }, { label: 'Pharmacies Needed', value: '16', color: '#2968B0', bg: '#F0F7FF' }],
    barData: [{ label: 'TX', value: 4 }, { label: 'GA', value: 3 }, { label: 'AL', value: 2 }, { label: 'MS', value: 2 }, { label: 'SC', value: 1 }], barLabel: 'Desert Zones by State',
    pieData: [{ name: 'Critical', value: 3, color: '#DC2626' }, { name: 'Moderate', value: 5, color: '#F59E0B' }, { name: 'Low', value: 4, color: '#2968B0' }], pieLabel: 'Severity Level',
    totalResults: 12, execTime: '0.68s', canvasLabel: '12 SE desert zones',
    followUps: ['Show TX detail', 'View population data', 'Export desert report', 'Plan outreach'],
    chatInsights: [{ icon: 'warning', text: '12 pharmacy deserts in Southeast region', color: '#DC2626' }, { icon: 'location', text: 'Rural East TX: 4 pharmacies for 182K people', color: '#D97706' }],
  }),

  'How many pharmacies are in rural California counties?': c({
    rows: [r('0000000','Kern County','Bakersfield','CA','142 pharmacies'), r('0000000','Tulare County','Visalia','CA','98 pharmacies'), r('0000000','Fresno County','Fresno','CA','86 pharmacies'), r('0000000','Merced County','Merced','CA','52 pharmacies'), r('0000000','Kings County','Hanford','CA','38 pharmacies')],
    sql: `SELECT county, COUNT(*) AS count FROM pharmacies WHERE state = 'CA' AND county IN (SELECT county FROM rural_designations WHERE state = 'CA') GROUP BY county ORDER BY count DESC`,
    insights: [{ text: '1,840 pharmacies in rural CA counties (18.2%)', type: 'info' }, { text: 'Kern County leads with 142', type: 'info' }],
    stats: [{ label: 'Rural CA', value: '1,840', color: '#2968B0', bg: '#F0F7FF' }, { label: '% of CA', value: '18.2%', color: '#334155', bg: '#F8FAFC' }, { label: 'Kern County', value: '142', color: '#059669', bg: '#ECFDF5' }, { label: 'Rural Counties', value: '28', color: '#334155', bg: '#F8FAFC' }],
    barData: [{ label: 'Kern', value: 142 }, { label: 'Tulare', value: 98 }, { label: 'Fresno', value: 86 }, { label: 'Merced', value: 52 }, { label: 'Kings', value: 38 }], barLabel: 'Rural CA by County',
    pieData: [{ name: 'Urban CA', value: 8280, color: '#2968B0' }, { name: 'Rural CA', value: 1840, color: '#10B981' }], pieLabel: 'Urban vs Rural (CA)',
    totalResults: 1840, execTime: '0.54s', canvasLabel: '1,840 rural CA pharmacies',
    followUps: ['Show Kern County detail', 'Compare rural vs urban', 'Export rural list', 'View coverage gaps'],
    chatInsights: [{ icon: 'stat', text: '1,840 pharmacies in rural CA — 18.2% of state', color: '#2968B0' }, { icon: 'location', text: 'Kern County leads with 142 pharmacies', color: '#059669' }],
  }),

  'Map coverage gaps for my PBM network': c({
    rows: [r('0000000','Rural East TX','7 counties','TX','Critical — need 8 more'), r('0000000','South GA','3 counties','GA','Critical — need 5 more'), r('0000000','Central AL','4 counties','AL','Moderate — need 3 more'), r('0000000','W. Virginia','6 counties','WV','Moderate — need 4 more')],
    sql: `SELECT zone_name, state, county_count, severity, pharmacies_needed FROM coverage_gaps WHERE network_id = (SELECT id FROM networks WHERE name = 'PBM Primary') ORDER BY severity DESC`,
    insights: [{ text: '8 coverage gap zones in PBM network', type: 'danger' }, { text: '466 pharmacies needed to close all gaps', type: 'warning' }],
    stats: [{ label: 'Gap Zones', value: '8', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Critical', value: '3', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Moderate', value: '5', color: '#D97706', bg: '#FFF7ED' }, { label: 'Needed', value: '466', color: '#2968B0', bg: '#F0F7FF' }],
    barData: [{ label: 'TX', value: 8 }, { label: 'GA', value: 5 }, { label: 'WV', value: 4 }, { label: 'AL', value: 3 }, { label: 'MS', value: 2 }], barLabel: 'Pharmacies Needed by State',
    pieData: [{ name: 'Critical', value: 3, color: '#DC2626' }, { name: 'Moderate', value: 5, color: '#F59E0B' }], pieLabel: 'Gap Severity',
    totalResults: 8, execTime: '0.82s', canvasLabel: '8 PBM coverage gaps',
    followUps: ['Show critical zones', 'View TX detail', 'Export gap analysis', 'Identify recruitment targets'],
    chatInsights: [{ icon: 'warning', text: '8 coverage gaps in your PBM network', color: '#DC2626' }, { icon: 'stat', text: '466 pharmacies needed to close all gaps', color: '#D97706' }],
  }),

  /* ───────── Batch Download ───────── */

  'Download all active pharmacy records as CSV': c({
    rows: [r('0512345','Option Care Health','Los Angeles','CA','Specialty'), r('2810042','Accredo Health Group','Houston','TX','Specialty'), r('6701245','Shields Health Solutions','Boston','MA','Specialty'), r('1209834','Kindred Healthcare Pharmacy','Chicago','IL','Long-Term Care'), r('4519827','ProCare Pharmacy','Seattle','WA','Specialty')],
    sql: `SELECT * FROM pharmacies WHERE active = true ORDER BY state, pharmacy_name`,
    insights: [{ text: '81,500 records ready for CSV download', type: 'success' }, { text: 'File size: ~210 MB', type: 'info' }],
    stats: [{ label: 'Records', value: '81,500', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Format', value: 'CSV', color: '#059669', bg: '#ECFDF5' }, { label: 'File Size', value: '~210 MB', color: '#334155', bg: '#F8FAFC' }, { label: 'States', value: '50', color: '#334155', bg: '#F8FAFC' }],
    barData: [{ label: 'CA', value: 10120 }, { label: 'TX', value: 8640 }, { label: 'FL', value: 7620 }, { label: 'NY', value: 7080 }, { label: 'OH', value: 5060 }], barLabel: 'Records by State (Top 5)',
    pieData: [{ name: 'Retail', value: 48200, color: '#2968B0' }, { name: 'Specialty', value: 18400, color: '#10B981' }, { name: 'LTC', value: 8900, color: '#F59E0B' }, { name: 'Other', value: 6000, color: '#94A3B8' }], pieLabel: 'Export by Type',
    totalResults: 81500, execTime: '2.41s', canvasLabel: '81,500 records — CSV',
    followUps: ['Download now', 'Filter by state', 'Export as JSON', 'Schedule weekly'],
    chatInsights: [{ icon: 'stat', text: '81,500 pharmacy records ready', color: '#059669' }, { icon: 'info', text: 'CSV format, ~210 MB file size', color: '#2968B0' }],
  }),

  'Bulk export pharmacies in TX, FL, and CA': c({
    rows: [r('0512345','Option Care Health','Los Angeles','CA','Specialty'), r('2810042','Accredo Health Group','Houston','TX','Specialty'), r('5920187','Genoa Healthcare Pharmacy','Miami','FL','Specialty'), r('0912345','Empower Pharmacy','Houston','TX','Compounding'), r('0578901','Rite Aid Pharmacy #5741','San Francisco','CA','Retail')],
    sql: `SELECT * FROM pharmacies WHERE state IN ('TX','FL','CA') AND active = true ORDER BY state, city`,
    insights: [{ text: '26,380 pharmacies in TX, FL, CA combined', type: 'success' }, { text: 'CA: 10,120 · TX: 8,640 · FL: 7,620', type: 'info' }],
    stats: [{ label: 'Total', value: '26,380', color: '#2968B0', bg: '#F0F7FF' }, { label: 'CA', value: '10,120', color: '#059669', bg: '#ECFDF5' }, { label: 'TX', value: '8,640', color: '#059669', bg: '#ECFDF5' }, { label: 'FL', value: '7,620', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: 'CA', value: 10120 }, { label: 'TX', value: 8640 }, { label: 'FL', value: 7620 }], barLabel: 'Records by State',
    pieData: [{ name: 'CA', value: 10120, color: '#2968B0' }, { name: 'TX', value: 8640, color: '#10B981' }, { name: 'FL', value: 7620, color: '#F59E0B' }], pieLabel: 'State Distribution',
    totalResults: 26380, execTime: '1.4s', canvasLabel: '26,380 in TX/FL/CA',
    followUps: ['Download CSV', 'Add more states', 'Filter specialty only', 'Export as JSON'],
    chatInsights: [{ icon: 'stat', text: '26,380 pharmacies across TX, FL, CA', color: '#059669' }, { icon: 'info', text: 'CA: 10,120 · TX: 8,640 · FL: 7,620', color: '#2968B0' }],
  }),

  'How many records were exported today?': c({
    rows: [r('BATCH','Batch #4821 — CSV','8,200 records','—','Completed'), r('BATCH','Batch #4820 — JSON','10,400 records','—','Completed'), r('BATCH','Batch #4819 — CSV','6,000 records','—','Completed')],
    sql: `SELECT * FROM export_history WHERE created_at >= CURRENT_DATE ORDER BY created_at DESC`,
    insights: [{ text: '3 exports today — 24,600 records', type: 'success' }, { text: 'Total size: 48.2 MB', type: 'info' }],
    stats: [{ label: 'Exports Today', value: '3', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Records', value: '24,600', color: '#059669', bg: '#ECFDF5' }, { label: 'Total Size', value: '48.2 MB', color: '#334155', bg: '#F8FAFC' }, { label: 'Formats', value: 'CSV, JSON', color: '#334155', bg: '#F8FAFC' }],
    barData: [{ label: 'Mon', value: 18200 }, { label: 'Tue', value: 22400 }, { label: 'Wed', value: 19800 }, { label: 'Thu', value: 24600 }], barLabel: 'Exports This Week',
    pieData: [{ name: 'CSV', value: 2, color: '#2968B0' }, { name: 'JSON', value: 1, color: '#10B981' }], pieLabel: 'Format',
    totalResults: 3, execTime: '0.12s', canvasLabel: '3 exports today',
    followUps: ['Show weekly history', 'Download latest', 'Schedule recurring', 'View failed exports'],
    chatInsights: [{ icon: 'stat', text: '3 batch exports completed today', color: '#059669' }, { icon: 'info', text: '24,600 records in CSV and JSON', color: '#2968B0' }],
  }),

  'Schedule a weekly batch download of chain pharmacies': c({
    rows: [r('SCHEDULE','Weekly Chain Export','Monday 6:00 AM ET','—','Active')],
    sql: `INSERT INTO scheduled_exports (name, frequency, filter, format, delivery) VALUES ('Weekly Chain Export', 'weekly_monday_0600', 'pharmacy_type = Chain', 'CSV', 'SFTP + email')`,
    insights: [{ text: 'Scheduled: Every Monday 6:00 AM ET', type: 'success' }, { text: '~34,200 chain pharmacy records per run', type: 'info' }],
    stats: [{ label: 'Schedule', value: 'Weekly', color: '#059669', bg: '#ECFDF5' }, { label: 'Day', value: 'Monday', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Records', value: '~34,200', color: '#334155', bg: '#F8FAFC' }, { label: 'Delivery', value: 'SFTP', color: '#334155', bg: '#F8FAFC' }],
    barData: [{ label: 'CVS', value: 9800 }, { label: 'Walgreens', value: 8600 }, { label: 'Rite Aid', value: 4200 }, { label: 'Kroger', value: 3800 }, { label: 'Other', value: 7800 }], barLabel: 'Chain Pharmacies by Parent',
    pieData: [{ name: 'CVS', value: 9800, color: '#DC2626' }, { name: 'Walgreens', value: 8600, color: '#2968B0' }, { name: 'Rite Aid', value: 4200, color: '#10B981' }, { name: 'Other', value: 11600, color: '#94A3B8' }], pieLabel: 'Chain Distribution',
    totalResults: 34200, execTime: '0.08s', canvasLabel: 'Weekly chain export',
    followUps: ['View schedule config', 'Add email recipients', 'Change to daily', 'Add filter criteria'],
    chatInsights: [{ icon: 'stat', text: 'Scheduled: Monday 6 AM ET weekly', color: '#059669' }, { icon: 'info', text: '~34,200 chain pharmacy records per export', color: '#2968B0' }],
  }),

  'Export pharmacy demographics with custom field selection': c({
    rows: [r('0512345','Option Care Health','Los Angeles','CA','Specialty'), r('2810042','Accredo Health Group','Houston','TX','Specialty'), r('1209834','Kindred Healthcare Pharmacy','Chicago','IL','Long-Term Care')],
    sql: `SELECT ncpdp_id, pharmacy_name, city, state, zip, phone, fax, provider_type, dispenser_class, hours, services FROM pharmacies WHERE active = true ORDER BY state`,
    insights: [{ text: '81,500 records with custom field selection', type: 'success' }, { text: '12 demographic fields available', type: 'info' }],
    stats: [{ label: 'Records', value: '81,500', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Fields', value: '12', color: '#059669', bg: '#ECFDF5' }, { label: 'Formats', value: 'CSV/JSON', color: '#334155', bg: '#F8FAFC' }, { label: 'Custom', value: 'Yes', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: 'Name/Addr', value: 81500 }, { label: 'Phone/Fax', value: 79200 }, { label: 'Hours', value: 68400 }, { label: 'Services', value: 52100 }], barLabel: 'Field Completeness',
    pieData: [{ name: 'Complete', value: 68400, color: '#059669' }, { name: 'Partial', value: 11200, color: '#F59E0B' }, { name: 'Minimal', value: 1900, color: '#DC2626' }], pieLabel: 'Profile Completeness',
    totalResults: 81500, execTime: '0.9s', canvasLabel: 'Custom demographics',
    followUps: ['Select fields', 'Preview first 100', 'Download CSV', 'Filter by state'],
    chatInsights: [{ icon: 'stat', text: '81,500 records with 12 demographic fields', color: '#059669' }, { icon: 'info', text: 'Choose fields: name, address, phone, hours, services, etc.', color: '#2968B0' }],
  }),

  /* ───────── FWA & Alerts ───────── */

  'Show pharmacies that attested FWA in the last 30 days': c({
    rows: [r('0512345','Option Care Health','Los Angeles','CA','Specialty'), r('2810042','Accredo Health Group','Houston','TX','Specialty'), r('6701245','Shields Health Solutions','Boston','MA','Specialty'), r('4519827','ProCare Pharmacy','Seattle','WA','Specialty'), r('2345890','Maxor National Pharmacy','Dallas','TX','Retail')],
    sql: `SELECT p.* FROM pharmacies p JOIN fwa_attestations f ON p.ncpdp_id = f.ncpdp_id WHERE f.attestation_date >= CURRENT_DATE - 30 AND f.status = 'Complete' ORDER BY f.attestation_date DESC`,
    insights: [{ text: '4,218 attested in last 30 days', type: 'success' }, { text: 'TX: 612, CA: 548, FL: 441', type: 'info' }, { text: '90% overall attestation rate', type: 'success' }],
    stats: [{ label: 'Last 30 Days', value: '4,218', color: '#059669', bg: '#ECFDF5' }, { label: 'TX', value: '612', color: '#2968B0', bg: '#F0F7FF' }, { label: 'CA', value: '548', color: '#2968B0', bg: '#F0F7FF' }, { label: 'Overall Rate', value: '90%', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: 'TX', value: 612 }, { label: 'CA', value: 548 }, { label: 'FL', value: 441 }, { label: 'NY', value: 389 }, { label: 'IL', value: 312 }], barLabel: 'Attestations by State (30d)',
    pieData: [{ name: 'Attested', value: 73350, color: '#059669' }, { name: 'Pending', value: 6480, color: '#F59E0B' }, { name: 'Not Started', value: 1670, color: '#DC2626' }], pieLabel: 'FWA Status',
    totalResults: 4218, execTime: '0.68s', canvasLabel: '4,218 attested 30d',
    followUps: ['Show TX detail', 'Filter newly attested', 'Export attested list', 'Compare with prior month'],
    chatInsights: [{ icon: 'stat', text: '4,218 pharmacies attested in last 30 days', color: '#059669' }, { icon: 'info', text: 'TX: 612, CA: 548, FL: 441', color: '#2968B0' }],
  }),

  'List independent pharmacies missing FWA attestation for 2025': c({
    rows: [r('0842901','Sunrise Drugs LLC','Las Vegas','NV','Independent'), r('1290455','FastRx Pharmacy','Miami','FL','Independent'), r('3451082','Valley Health Rx','Dallas','TX','Independent'), r('5501340','QuickMeds #2041','Houston','TX','Independent')],
    sql: `SELECT * FROM pharmacies p JOIN fwa_attestations f ON p.ncpdp_id = f.ncpdp_id WHERE p.pharmacy_type = 'Independent' AND f.attestation_year = 2025 AND f.status != 'Complete' ORDER BY p.state`,
    insights: [{ text: '1,420 independents missing 2025 attestation', type: 'danger' }, { text: 'All past Jan 1, 2025 deadline', type: 'warning' }],
    stats: [{ label: 'Missing 2025', value: '1,420', color: '#DC2626', bg: '#FEF2F2' }, { label: 'TX', value: '218', color: '#D97706', bg: '#FFF7ED' }, { label: 'CA', value: '186', color: '#D97706', bg: '#FFF7ED' }, { label: 'FL', value: '154', color: '#D97706', bg: '#FFF7ED' }],
    barData: [{ label: 'TX', value: 218 }, { label: 'CA', value: 186 }, { label: 'FL', value: 154 }, { label: 'NY', value: 128 }, { label: 'IL', value: 104 }], barLabel: 'Missing 2025 by State',
    pieData: [{ name: 'Attested 2025', value: 23030, color: '#059669' }, { name: 'Missing 2025', value: 1420, color: '#DC2626' }], pieLabel: '2025 Attestation',
    totalResults: 1420, execTime: '0.58s', canvasLabel: '1,420 missing 2025',
    followUps: ['Show TX detail', 'Send reminder notices', 'Export missing list', 'Compare with 2026'],
    chatInsights: [{ icon: 'warning', text: '1,420 independents missing 2025 FWA', color: '#DC2626' }, { icon: 'location', text: 'TX: 218, CA: 186, FL: 154', color: '#2968B0' }],
  }),

  'Which independent pharmacies have not completed FWA attestation for 2026?': c({
    rows: [r('0842901','Sunrise Drugs LLC','Las Vegas','NV','Independent'), r('1290455','FastRx Pharmacy','Miami','FL','Independent'), r('3451082','Valley Health Rx','Dallas','TX','Independent'), r('5501340','QuickMeds #2041','Houston','TX','Independent'), r('7820112','Family First Rx','Orlando','FL','Independent')],
    sql: `SELECT * FROM pharmacies p JOIN fwa_attestations f ON p.ncpdp_id = f.ncpdp_id WHERE p.pharmacy_type = 'Independent' AND f.attestation_year = 2026 AND f.status != 'Complete' ORDER BY p.state`,
    insights: [{ text: '8,150 independents missing 2026 attestation', type: 'danger' }, { text: 'TX has largest gap: 1,220 missing', type: 'warning' }, { text: '90% overall rate — 73,350 of 81,500', type: 'info' }],
    stats: [{ label: 'Missing 2026', value: '8,150', color: '#DC2626', bg: '#FEF2F2' }, { label: 'TX', value: '1,220', color: '#D97706', bg: '#FFF7ED' }, { label: 'CA', value: '980', color: '#D97706', bg: '#FFF7ED' }, { label: 'FL', value: '840', color: '#D97706', bg: '#FFF7ED' }],
    barData: [{ label: 'TX', value: 1220 }, { label: 'CA', value: 980 }, { label: 'FL', value: 840 }, { label: 'NY', value: 620 }, { label: 'IL', value: 510 }], barLabel: 'Missing 2026 by State',
    pieData: [{ name: 'Attested', value: 73350, color: '#059669' }, { name: 'Pending', value: 6480, color: '#F59E0B' }, { name: 'Not Started', value: 1670, color: '#DC2626' }], pieLabel: '2026 Status',
    totalResults: 8150, execTime: '1.12s', canvasLabel: '8,150 missing 2026',
    followUps: ['Show TX detail', 'Filter not started', 'Send bulk reminders', 'Export missing list'],
    chatInsights: [{ icon: 'warning', text: '8,150 independents missing 2026 FWA', color: '#DC2626' }, { icon: 'location', text: 'TX: 1,220 · CA: 980 · FL: 840', color: '#2968B0' }],
  }),

  'Show all critical alerts requiring action': c({
    rows: [r('ALERT','Subscription A — Expiring Apr 15','—','—','Warning'), r('ALERT','Subscription B — Expiring Apr 22','—','—','Warning')],
    sql: `SELECT * FROM alerts WHERE severity IN ('critical','warning') AND status = 'Active' ORDER BY created_at DESC`,
    insights: [{ text: '2 subscriptions nearing expiration', type: 'warning' }, { text: 'No critical compliance violations', type: 'success' }],
    stats: [{ label: 'Active Alerts', value: '2', color: '#D97706', bg: '#FFF7ED' }, { label: 'Critical', value: '0', color: '#059669', bg: '#ECFDF5' }, { label: 'Warnings', value: '2', color: '#D97706', bg: '#FFF7ED' }, { label: 'Status', value: 'Pending', color: '#D97706', bg: '#FFF7ED' }],
    barData: [{ label: 'Sub Expiry', value: 2 }, { label: 'DEA', value: 0 }, { label: 'FWA', value: 0 }, { label: 'License', value: 0 }], barLabel: 'Alerts by Type',
    pieData: [{ name: 'Warning', value: 2, color: '#F59E0B' }, { name: 'Critical', value: 0, color: '#DC2626' }], pieLabel: 'Alert Severity',
    totalResults: 2, execTime: '0.06s', canvasLabel: '2 active alerts',
    followUps: ['View subscription details', 'Renew subscriptions', 'Check alert history', 'Configure notifications'],
    chatInsights: [{ icon: 'warning', text: '2 subscriptions nearing expiration', color: '#D97706' }, { icon: 'stat', text: 'No critical compliance violations detected', color: '#059669' }],
  }),

  'Run FWA attestation status check': c({
    rows: [r('STATUS','Attested','73,350','—','90%'), r('STATUS','Pending','6,480','—','8%'), r('STATUS','Not Started','1,670','—','2%')],
    sql: `SELECT status, COUNT(*) AS count, ROUND(COUNT(*)*100.0/81500,1) AS pct FROM fwa_attestations WHERE attestation_year = 2026 GROUP BY status`,
    insights: [{ text: '90% attestation rate — 73,350 of 81,500', type: 'success' }, { text: '8,150 still pending for 2026', type: 'warning' }, { text: 'TX has largest gap: 1,220', type: 'info' }],
    stats: [{ label: 'Attested', value: '73,350', color: '#059669', bg: '#ECFDF5' }, { label: 'Pending', value: '6,480', color: '#D97706', bg: '#FFF7ED' }, { label: 'Not Started', value: '1,670', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Rate', value: '90%', color: '#059669', bg: '#ECFDF5' }],
    barData: [{ label: 'TX', value: 1220 }, { label: 'CA', value: 980 }, { label: 'FL', value: 840 }, { label: 'NY', value: 620 }, { label: 'IL', value: 510 }], barLabel: 'Missing Attestation by State',
    pieData: [{ name: 'Attested', value: 73350, color: '#059669' }, { name: 'Pending', value: 6480, color: '#F59E0B' }, { name: 'Not Started', value: 1670, color: '#DC2626' }], pieLabel: 'FWA Status',
    trendData: [{ month: 'Oct', primary: 64200, secondary: 17300 }, { month: 'Nov', primary: 66800, secondary: 14700 }, { month: 'Dec', primary: 68400, secondary: 13100 }, { month: 'Jan', primary: 70100, secondary: 11400 }, { month: 'Feb', primary: 71800, secondary: 9700 }, { month: 'Mar', primary: 73350, secondary: 8150 }], trendLabel: 'Attestation Progress', trendKeys: ['Attested', 'Remaining'],
    totalResults: 81500, execTime: '0.88s', canvasLabel: '90% FWA attested',
    followUps: ['Show pending list', 'Filter TX missing', 'Send reminders', 'Export FWA report'],
    chatInsights: [{ icon: 'stat', text: '73,350 of 81,500 (90%) attested for 2026', color: '#059669' }, { icon: 'warning', text: '8,150 still pending — TX: 1,220 missing', color: '#D97706' }],
  }),
};
