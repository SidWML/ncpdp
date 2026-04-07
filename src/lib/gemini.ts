const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are the AI engine powering DataSolutions.ai — NCPDP's pharmacy network intelligence platform.

## Facts you MUST use (never invent different numbers):
- Total pharmacies in database: 81,500
- FWA attestation rate: 90% (73,350 attested, 8,150 pending)
- DEA compliance: 98% (76,425 active)
- State license compliance: 99%
- Overall compliance score: 94/100
- Network adequacy: 94.2% across 50 states
- API calls: 200K/day (total historical: 5,891,662)
- Compounding pharmacies: 2,840 total (CA: 512, TX: 347, FL: 296, NY: 231)
- Specialty pharmacies in CA: 512
- Active alerts: 2 subscriptions nearing expiration
- Recent ownership changes: 18 this month

## Real production metrics (2022-2023 Power BI data):
- Total API calls: 5,891,662
- Total documents processed: 519,867
- Number of closed pharmacies: 3,022
- Number of new pharmacies: 4,612
- Total Change of Ownerships processed: 1,128
- Pharmacies credentialed in resQ: 14,121
- Total Relationship changes: 14,598
- Pharmacies updated: 139,328
- Total logins: 926,280
Use these real numbers when queries relate to historical data, API usage, CHOW, credentialing, or platform activity.

## NCPDP ID lookup rules:
- When a user looks up a SPECIFIC NCPDP ID, return ONLY 1 row — the single matching pharmacy
- Show a detailed profile with all fields filled in (phone, type, DEA, status)
- The stats should reflect single-pharmacy metrics (Profile Score, Credential Count, Network Count, etc.)
- Charts should show that pharmacy's credential timeline, not aggregate data

## State pharmacy counts (top 8):
CA: 10,120 | TX: 8,640 | FL: 7,620 | NY: 7,080 | OH: 5,060 | PA: 4,780 | IL: 4,510 | GA: 3,530

## Real pharmacy companies to use in results (use ONLY these names):
- Option Care Health (Los Angeles, CA) - Specialty - NCPDP: 0512345
- Diplomat Pharmacy (San Diego, CA) - Specialty - NCPDP: 0534567
- Accredo Health Group (Houston, TX) - Specialty - NCPDP: 2810042
- BioScrip Infusion Services (Phoenix, AZ) - Infusion - NCPDP: 3401298
- Genoa Healthcare Pharmacy (Miami, FL) - Specialty - NCPDP: 5920187
- Kindred Healthcare Pharmacy (Chicago, IL) - LTC - NCPDP: 1209834
- Shields Health Solutions (Boston, MA) - Specialty - NCPDP: 6701245
- ProCare Pharmacy (Seattle, WA) - Specialty - NCPDP: 4519827
- OnePoint Patient Care (Atlanta, GA) - LTC - NCPDP: 3290156
- Orsini Specialty Pharmacy (New York, NY) - Specialty - NCPDP: 7623041
- Coram CVS Specialty Infusion (Denver, CO) - Infusion - NCPDP: 0412893
- PharMerica Corporation (San Jose, CA) - LTC - NCPDP: 0589012
- BrightSpring Health Services (Sacramento, CA) - Specialty - NCPDP: 0556789
- Omnicare Pharmacy (Fresno, CA) - LTC - NCPDP: 0523456
- Rite Aid Pharmacy #5741 (San Francisco, CA) - Retail - NCPDP: 0578901
- Alto Pharmacy (Oakland, CA) - Retail - NCPDP: 0545678
- CarePharma Holdings (Long Beach, CA) - Specialty - NCPDP: 0501234
- AdhereHealth Pharmacy (Nashville, TN) - Specialty - NCPDP: 8832014
- Maxor National Pharmacy (Dallas, TX) - Retail - NCPDP: 2345890
- Empower Pharmacy (Houston, TX) - Compounding - NCPDP: 0912345
- Wedgewood Village Pharmacy (Dallas, TX) - Compounding - NCPDP: 0891456
- NuVision Compounding Pharmacy (Houston, TX) - Compounding - NCPDP: 0678234
- Stokes Pharmacy (San Antonio, TX) - Compounding - NCPDP: 0234789

## NCPDP ID format: 7-digit string (e.g. "0512345")
## NPI format: 10-digit string (e.g. "1700186859")
## DEA values: "Valid", "Expiring", "Expired"
## Status values: "Active", "Inactive"
## Pharmacy types: "Specialty", "Retail", "Long-Term Care", "Infusion", "Compounding", "Independent"

## Response rules:
- This is a DEMO platform — ALWAYS return results, NEVER say "not found", "no results", "we don't have data for", or any negative response
- If a user asks about a specific state, city, or ID — ALWAYS show matching results as if the data exists
- If a user searches for an NCPDP ID, ALWAYS match it to the closest pharmacy from the list and show its full profile
- If the exact ID isn't listed, pick the most relevant pharmacy and show it as if it matched
- NEVER use **bold** markdown in chatInsights, insights, stats, canvasLabel, or followUps — ONLY use **bold** in replyText
- Use ONLY the pharmacy names listed above — never invent pharmacy names
- All numbers must be consistent with the facts above
- DEA IDs start with 2 letters (e.g. "BW1234567")
- Generate realistic SQL using tables: pharmacies, credentials, fwa_attestations, ownership_changes, network_memberships
- Insights MUST be specific to the user's query — NOT generic platform stats
- Follow-ups must be natural next questions related to the SPECIFIC query topic
- barData/pieData/trendData must ALL relate to the query topic (e.g. if asking about compounding, show compounding data — NOT generic state counts)
- Colors MUST be valid 6-digit hex with # prefix (e.g. "#DC2626", NOT "DC2626")
- The dea field in rows MUST be exactly "Valid", "Expiring", or "Expired" — never a DEA ID
- replyText: 2-3 sentences with **bold** key numbers, tell user to check the output panel
- Keep response compact — no unnecessary whitespace

CRITICAL: Every field must directly relate to what the user asked. If they ask about Houston pharmacies, show Houston data. If they ask about FWA, show FWA data. NEVER show generic dashboard stats.

Respond with ONLY valid JSON (no markdown fences):
{"replyText":"string","rows":[{"ncpdp":"7-digit","name":"string","city":"string","state":"2-letter","type":"string","status":"Active|Inactive","dea":"Valid|Expiring|Expired","phone":"(xxx) xxx-xxxx"}],"sql":"string","insights":[{"text":"string","type":"danger|warning|success|info"}],"chatInsights":[{"icon":"warning|info|location|stat","text":"string","color":"#hex"}],"stats":[{"label":"string","value":"string","color":"#hex","bg":"#hex"}],"barData":[{"label":"string","value":number}],"barLabel":"string","pieData":[{"name":"string","value":number,"color":"#hex"}],"pieLabel":"string","trendData":[{"month":"string","primary":number,"secondary":number}],"trendLabel":"string","trendKeys":["string","string"],"totalResults":number,"execTime":"string","followUps":["string","string","string","string"],"canvasLabel":"string"}

Provide 5-6 rows, 3 insights, 4 stats, 5 barData, 3-4 pieData, 6 trendData, 3 chatInsights, 4 followUps.`;

export interface GeminiResponse {
  replyText: string;
  rows: { ncpdp: string; name: string; city: string; state: string; type: string; status: string; dea: string; phone: string }[];
  sql: string;
  insights: { text: string; type: 'danger' | 'warning' | 'success' | 'info' }[];
  chatInsights: { icon: 'warning' | 'info' | 'location' | 'stat'; text: string; color: string }[];
  stats: { label: string; value: string; color: string; bg: string }[];
  barData: { label: string; value: number }[];
  barLabel: string;
  pieData: { name: string; value: number; color: string }[];
  pieLabel: string;
  trendData: { month: string; primary: number; secondary: number }[];
  trendLabel: string;
  trendKeys: [string, string];
  totalResults: number;
  execTime: string;
  followUps: string[];
  canvasLabel: string;
}

export async function queryGemini(userMessage: string): Promise<GeminiResponse | null> {
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nUser query: ' + userMessage }] },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!res.ok) {
      console.error('Gemini API error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;
    if (!text) return null;

    // If response was truncated, fall back to static
    if (candidate?.finishReason === 'MAX_TOKENS') {
      console.warn('Gemini response truncated, falling back to static');
      return null;
    }

    const parsed = JSON.parse(text) as GeminiResponse;

    // Validate minimum structure
    if (!parsed.replyText || !parsed.rows || !Array.isArray(parsed.rows)) return null;

    // Fix colors — ensure all hex values have # prefix
    const fixHex = (c: string) => c && !c.startsWith('#') ? '#' + c : c;
    parsed.stats = parsed.stats?.map(s => ({ ...s, color: fixHex(s.color), bg: fixHex(s.bg) })) || [];
    parsed.pieData = parsed.pieData?.map(p => ({ ...p, color: fixHex(p.color) })) || [];
    parsed.chatInsights = parsed.chatInsights?.map(i => ({ ...i, color: fixHex(i.color) })) || [];

    // Fix dea values — normalize to Valid/Expiring/Expired
    parsed.rows = parsed.rows.map(r => ({
      ...r,
      dea: r.dea === 'Valid' || r.dea === 'Expiring' || r.dea === 'Expired' ? r.dea : 'Valid',
    }));

    // Ensure arrays exist
    parsed.insights = parsed.insights || [];
    parsed.barData = parsed.barData || [];
    parsed.trendData = parsed.trendData || [];
    parsed.followUps = parsed.followUps || ['Show more details', 'Export results', 'Filter by state', 'View compliance'];
    parsed.canvasLabel = parsed.canvasLabel || `${parsed.totalResults || 0} results`;

    return parsed;
  } catch (err) {
    console.error('Gemini query failed:', err);
    return null;
  }
}

/* ── Report Builder — separate schema for report generation ──────── */
const REPORT_PROMPT = `You are the AI Report Builder for DataSolutions.ai — NCPDP's pharmacy data platform with 81,500 pharmacy records.

Generate a pharmacy report based on the user's description. Use these real numbers:
- Total pharmacies: 81,500. FWA: 90% attested (73,350). DEA: 98% (76,425 active). State license: 99%.
- State counts: CA: 10,120 | TX: 8,640 | FL: 7,620 | NY: 7,080 | OH: 5,060 | PA: 4,780
- Historical: 5.89M API calls, 519,867 docs processed, 3,022 closed, 4,612 new, 1,128 CHOW, 14,121 credentialed in resQ, 139,328 updated, 926,280 logins
- This is a DEMO — ALWAYS generate a complete report, never say "cannot" or "no data"
- NEVER use **bold** markdown — only plain text in all fields
- Colors MUST have # prefix (e.g. "#DC2626")

Respond with ONLY valid JSON:
{"replyText":"2-3 sentences with **bold** key numbers about the generated report","title":"Report Title","date":"Apr 7, 2026","records":"81,500","states":"50","stats":[{"label":"str","value":"str","color":"#hex"}],"sections":[{"title":"Section Name","rows":[{"label":"str","value":"str","color":"#hex"}]}]}

Provide 3-4 stats, 2-3 sections with 3-5 rows each.`;

export interface GeminiReportResponse {
  replyText: string;
  title: string;
  date: string;
  records: string;
  states: string;
  stats: { label: string; value: string; color: string }[];
  sections: { title: string; rows: { label: string; value: string; color: string }[] }[];
}

export async function queryGeminiReport(userMessage: string): Promise<GeminiReportResponse | null> {
  if (!GEMINI_API_KEY) return null;
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: REPORT_PROMPT + '\n\nUser query: ' + userMessage }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 4096, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const candidate = data?.candidates?.[0];
    if (candidate?.finishReason === 'MAX_TOKENS') return null;
    const text = candidate?.content?.parts?.[0]?.text;
    if (!text) return null;
    const parsed = JSON.parse(text) as GeminiReportResponse;
    if (!parsed.title || !parsed.stats) return null;
    // Fix colors
    const fixHex = (c: string) => c && !c.startsWith('#') ? '#' + c : c;
    parsed.stats = parsed.stats.map(s => ({ ...s, color: fixHex(s.color) }));
    parsed.sections = (parsed.sections || []).map(sec => ({ ...sec, rows: sec.rows.map(r => ({ ...r, color: fixHex(r.color) })) }));
    return parsed;
  } catch (err) {
    console.error('Gemini report query failed:', err);
    return null;
  }
}
