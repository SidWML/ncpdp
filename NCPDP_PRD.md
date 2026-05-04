# dataQ.ai — Product Requirements Document (PRD)

## NCPDP dataQ/resQ Modernization & Data Monetization Platform

**Version:** 1.0
**Date:** March 28, 2026
**Status:** Proposal — Draft for NCPDP Review
**Prepared by:** [Your Firm Name]
**Sponsor:** NCPDP CTO Office

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Vision & Objectives](#3-vision--objectives)
4. [Scope](#4-scope)
5. [Target Users](#5-target-users)
6. [User Journeys](#6-user-journeys)
7. [Feature Requirements](#7-feature-requirements)
8. [AI Agent Catalog](#8-ai-agent-catalog)
9. [Data Monetization Strategy](#9-data-monetization-strategy)
10. [Technology Architecture](#10-technology-architecture)
11. [SFTP Migration Roadmap](#11-sftp-migration-roadmap)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [AI Accuracy & Guardrails](#13-ai-accuracy--guardrails)
14. [Risks & Mitigations](#14-risks--mitigations)
15. [Success Metrics](#15-success-metrics)
18. [Appendices](#18-appendices)

---

## 1. Executive Summary

### The Opportunity

NCPDP's dataQ and resQ products are the authoritative source of pharmacy identification, demographic, and credentialing data in the United States. Serving ~300-600 subscribers — including every major PBM, health plan, pharmacy chain, EHR vendor, and government agency — these products generate significant annual revenue from a mature subscriber base.

However, the current platform was built in a pre-cloud, pre-AI era. Data is delivered via monthly SFTP flat files at a flat rate of ~$40K/year. The portal UX is dated, search capabilities are limited, and there is no API adoption to speak of. The platform delivers **bulk commodity data** when it should be delivering **real-time intelligence, workflow automation, and predictive analytics**.

### The Proposal: dataQ.ai

We propose transforming dataQ/resQ into **dataQ.ai** — an AI-powered pharmacy data intelligence platform that:

- Replaces the legacy portal with a **modern, responsive web application**
- Introduces **33 purpose-built AI agents** that automate pharmacy network management, credentialing, compliance monitoring, and data analysis
- Adds a **modern API layer** (REST/GraphQL) alongside existing SFTP delivery
- Implements **tiered pricing** (Essential / Professional / Enterprise) to unlock revenue growth
- Delivers **real-time alerts, analytics dashboards, and predictive insights** that transform dataQ/resQ from a data download tool into a mission-critical operational platform

### Expected Outcomes

| Metric | Current | Target |
|---|---|---|
| Annual data product revenue | Baseline | Significant growth target |
| Average revenue per subscriber | Baseline | Increased through tiered model |
| Platform engagement (MAU) | Low | 3x current |
| API adoption | <5% | 30% of subscribers |
| Support ticket volume | Baseline | 40% reduction |

### Next Steps

Timeline, investment, and team composition will be defined collaboratively following a Discovery phase. This ensures accurate scoping based on NCPDP's current technical landscape and priorities.


---

## 2. Problem Statement

### 2.1 What's Wrong Today

NCPDP's dataQ and resQ products sit at the center of US pharmacy data exchange. They are legally mandated, industry-standard, and have no direct competitor for authoritative pharmacy identification data. Despite this dominant market position, the platform has not evolved to match modern enterprise data platform expectations.

#### Current Pain Points

**For Subscribers (PBMs, Health Plans, IT Vendors):**

| Pain Point | Impact |
|---|---|
| Data delivered as monthly flat files via SFTP | Subscribers work with data that can be up to 30 days stale |
| Batch download limited to 50 pharmacies at a time | A PBM managing 70,000+ pharmacies requires 1,400+ batch operations |
| No real-time alerts or notifications | Pharmacy closures, credential expirations, ownership changes discovered only at next monthly file refresh |
| Rigid form-based queries (OnDemand, Pharmacy Audit) | Users must know which fields to filter — no natural language search, no saved queries, no smart recommendations |
| Duplicate/overlapping screens | OnDemand, No Surprises Report, and Pharmacy Audit have nearly identical forms — confusing UX |
| WebConnect limited to NCPDP ID search only | No fuzzy matching, no address search, no geographic radius search |
| No analytics or visualization | Results displayed in basic paginated HTML tables — no charts, maps, trends, or exportable dashboards |
| No API for system-to-system integration | Subscribers cannot programmatically access data; must rely on manual file downloads |

**For NCPDP (Business):**

| Pain Point | Impact |
|---|---|
| Flat pricing ($40K/year) with no usage-based upside | Revenue is capped regardless of how much value a customer extracts |
| No tiered product offering | A 10-person regional health plan pays the same as OptumRx |
| Low WebConnect/API adoption | Existing real-time capability exists but is underused — no revenue uplift |
| Manual support operations | productsupport@ncpdp.org handles queries that could be self-service |
| No visibility into customer usage patterns | Cannot identify upsell opportunities or at-risk subscribers |
| Aging technology stack | Difficult to add new features, maintain, or scale |

### 2.2 Why Now

While there is no immediate crisis, several market forces make proactive modernization strategically important:

1. **AI expectations are rising** — Enterprise customers increasingly expect AI-powered search, chatbots, and automation from their data platforms
2. **Real-time data is becoming table stakes** — Monthly batch delivery is increasingly misaligned with the speed of healthcare operations
3. **Alternative data sources are emerging** — CMS open data, NPI registry, state board websites, and commercial aggregators (LexisNexis, IQVIA) provide overlapping pharmacy data. NCPDP's advantage is authority and completeness — but that advantage erodes if the delivery experience is inferior
4. **Revenue growth requires product innovation** — With a mature subscriber base, the primary path to revenue growth is selling more value to existing customers through premium tiers and new capabilities
5. **Technology debt compounds** — The longer the current platform runs unchanged, the harder and more expensive modernization becomes

### 2.3 Who Has This Problem

Every organization in the US pharmacy supply chain that relies on NCPDP data:

- **~50-100 PBMs and health plans** managing pharmacy networks for 300M+ covered lives
- **70,000+ pharmacies** maintaining their profiles and credentials
- **~50-100 EHR/EMR vendors and e-prescribing networks** routing prescriptions
- **Federal and state agencies** (CMS, 50 state Medicaid programs, state boards of pharmacy)
- **~50-100 healthcare IT vendors and clearinghouses** processing pharmacy claims

---

## 3. Vision & Objectives

### 3.1 Vision Statement

**Transform dataQ/resQ from a static pharmacy data download service into dataQ.ai — an AI-powered pharmacy data intelligence platform that proactively delivers insights, automates workflows, and drives measurably better outcomes for every stakeholder in the pharmacy ecosystem.**

### 3.2 Strategic Objectives

| # | Objective | Measurable Target |
|---|---|---|
| O1 | Increase data product revenue | 50% growth within 18 months |
| O2 | Modernize the subscriber experience | Modern portal with AI agents, dashboards, and real-time alerts |
| O3 | Establish API-first data delivery | 30% of subscribers using APIs within 12 months |
| O4 | Create tiered monetization | Three product tiers with clear upgrade path |
| O5 | Improve pharmacy data quality | Profile completeness from ~70% to 90% |
| O6 | Reduce operational support burden | 40% reduction in support tickets via AI chatbot |
| O7 | Position NCPDP as an innovation leader | First healthcare SDO with AI-powered data platform |

### 3.3 Design Principles

1. **Intelligence over information** — Don't just deliver data; deliver insights, alerts, and recommendations
2. **Proactive over reactive** — The platform should tell users what they need to know before they ask
3. **Progressive modernization** — Preserve existing workflows (SFTP) while making the new path irresistibly better
4. **Segment-specific value** — Different user types see different views, agents, and capabilities
5. **Trust and accuracy first** — Every AI output must be traceable to verified source data
6. **Low floor, high ceiling** — Easy for basic users (search, browse), powerful for advanced users (APIs, analytics, agents)

---

## 4. Scope

### 4.1 In Scope

| Item | Description |
|---|---|
| dataQ portal modernization | Complete UI/UX redesign of all dataQ subscriber-facing pages |
| resQ portal modernization | Complete UI/UX redesign of all resQ subscriber-facing pages |
| AI Agent platform | 33 purpose-built AI agents across customer-facing and internal categories |
| AI Chatbot (NCPDP Buddy) | Always-on assistant for both subscribers and NCPDP internal staff |
| Modern API layer | REST and GraphQL APIs for programmatic data access |
| Tiered pricing model | Essential / Professional / Enterprise subscription tiers |
| Analytics dashboards | Visual dashboards with charts, maps, and trend analysis |
| Real-time alerts engine | Configurable push notifications for data changes and compliance events |
| Role Starter Kits | Pre-built prompt libraries by user role |
| Gamification (pharmacies only) | Profile completeness scoring to drive data quality |
| Success Stories section | Curated customer case studies |
| SFTP migration roadmap | Phased transition from SFTP to modern delivery |

### 4.2 Explicitly Out of Scope

| Item | Reason |
|---|---|
| NCPDP main website (ncpdp.org) | Separate property, not part of this initiative |
| Pharmacy data entry/intake process | How pharmacies submit profiles into the system is unchanged |
| HCIdea (prescriber database) | Separate product — potential future phase |
| NCPDP standards documents | Separate revenue stream (Telecommunication, SCRIPT, Batch standards) |
| Mobile native apps | Responsive web covers mobile needs; native apps not justified for this user base |
| International expansion | NCPDP data is US-only; no international requirements |

### 4.3 Future Phases (Out of Scope but Referenced)

| Item | Likely Timeline |
|---|---|
| Developer portal (self-service API keys, sandbox, SDKs) | Phase 2 |
| Webhook & event streaming | Phase 2 |
| FedRAMP certification | Phase 3 (when government segment prioritized) |
| HCIdea modernization | Future phase |
| Pharmacy data intake modernization | Future phase |

---

## 5. Target Users

### 5.1 Phased Segment Approach

| Phase | Segment | Rationale |
|---|---|---|
| **Phase 1** (Primary) | PBMs, Health Plans & Insurance Companies | Highest revenue per customer, smallest group to onboard, strongest upsell potential |
| **Phase 2** | Pharmacies + EHR/IT Vendors + Clearinghouses | Largest user count (pharmacies), most API-ready (IT vendors) |
| **Phase 3** | Government Agencies (CMS, State Medicaid) | Requires FedRAMP, longer sales cycles |

### 5.2 Phase 1 User Personas

#### Persona 1: Network Manager at a PBM

| Attribute | Detail |
|---|---|
| **Name** | Sarah Chen |
| **Title** | Director of Pharmacy Network Management |
| **Organization** | Mid-to-large PBM (manages 40,000+ pharmacy relationships) |
| **Responsibilities** | Build and maintain pharmacy networks, ensure network adequacy, manage credentialing, report to CMS |
| **Current workflow** | Downloads monthly dataQ flat file → loads into internal database → runs SQL queries → generates Excel reports → emails to compliance team |
| **Pain points** | Data is stale by the time she uses it; manual process takes 2-3 days each month; can't quickly answer "which pharmacies in my network lost their DEA this week?" |
| **What she wants** | Real-time alerts when pharmacy status changes, a dashboard showing network health at a glance, natural language queries instead of SQL |
| **Willingness to pay more** | High — if the platform saves her team 40+ hours/month, $75-100K is justified |

#### Persona 2: VP of Compliance at a Health Plan

| Attribute | Detail |
|---|---|
| **Name** | Michael Torres |
| **Title** | VP, Regulatory Compliance |
| **Organization** | Regional health plan (2M+ members) |
| **Responsibilities** | CMS network adequacy compliance, FWA program oversight, No Surprises Act reporting, audit readiness |
| **Current workflow** | Receives monthly dataQ file from IT team → cross-references with internal credentialing records in Excel → manually checks FWA attestation status → prepares quarterly CMS reports |
| **Pain points** | Audit preparation takes weeks; no single view of compliance status; discovers credential gaps after they become audit findings |
| **What he wants** | A compliance dashboard that shows real-time status, automated FWA tracking, alerts 90 days before credential expirations, one-click CMS report generation |
| **Willingness to pay more** | Very high — a single failed CMS audit costs more than the annual subscription |

#### Persona 3: Pharmacy Data Analyst at a Health Insurer

| Attribute | Detail |
|---|---|
| **Name** | Priya Patel |
| **Title** | Senior Data Analyst, Provider Network |
| **Organization** | National health insurance company |
| **Responsibilities** | Pharmacy network analytics, market analysis, competitive network benchmarking |
| **Current workflow** | Downloads dataQ files → imports to Tableau/Power BI → builds coverage maps → produces quarterly network reports |
| **Pain points** | Building geographic coverage maps from flat files is tedious; no built-in visualization; can't compare her network to market benchmarks |
| **What she wants** | Built-in analytics dashboards with geographic heat maps, trend analysis, benchmark comparisons, natural language report generation |
| **Willingness to pay more** | Moderate — would advocate internally for the upgrade if dashboards replace 2 weeks of manual work per quarter |

#### Persona 4: IT Integration Engineer

| Attribute | Detail |
|---|---|
| **Name** | David Kim |
| **Title** | Senior Integration Engineer |
| **Organization** | PBM or healthcare IT vendor |
| **Responsibilities** | Maintain pharmacy data pipelines, integrate dataQ into internal systems, ensure data freshness |
| **Current workflow** | SFTP script downloads monthly file → ETL pipeline parses and loads into data warehouse → reconciliation checks → manual error handling |
| **Pain points** | File format changes break pipelines; no change detection (must diff entire file); no API for real-time lookups; error handling is manual |
| **What he wants** | Clean REST/GraphQL APIs with proper documentation, delta feeds (only changed records), webhook notifications when data changes, a sandbox for testing |
| **Willingness to pay more** | Strong advocate for API tier — would push his org to upgrade to Enterprise |

### 5.3 Phase 2 User Personas (Reference Only)

#### Persona 5: Pharmacy Owner/Manager

| Attribute | Detail |
|---|---|
| **Name** | Maria Gonzalez |
| **Title** | Owner |
| **Organization** | Independent community pharmacy |
| **Responsibilities** | Maintain pharmacy profile and credentials, ensure network participation, comply with regulations |
| **Current workflow** | Logs into portal rarely → updates profile when reminded → manually tracks license renewals on a spreadsheet |
| **What she wants** | A mobile-friendly dashboard showing her profile completeness, automated renewal reminders, visibility into which networks she's in, guided credentialing |

#### Persona 6: Government Analyst

| Attribute | Detail |
|---|---|
| **Name** | James Washington |
| **Title** | Program Analyst |
| **Organization** | CMS Center for Medicare |
| **Responsibilities** | Monitor pharmacy access for Medicare beneficiaries, validate managed care plan network adequacy |
| **What he wants** | Population-level analytics, pharmacy desert identification, network adequacy validation tools |

---

## 6. User Journeys

### 6.1 Journey 1: Network Manager Discovers a Credential Gap (Current vs. dataQ.ai)

#### Current Journey (Pain)

```
1. Sarah downloads monthly dataQ flat file (day 1 of month)
2. IT team loads into internal database (day 2-3)
3. Sarah runs SQL query to check DEA registrations (day 3)
4. Discovers 15 pharmacies in her network have expired DEA (day 3)
5. Realizes the DEA expired 3 weeks ago — claims processed in the gap (day 3)
6. Manually notifies compliance team via email (day 3)
7. Compliance team scrambles to assess exposure (day 4-7)
8. Remediation actions taken (day 7-14)

Total time: 14 days. Exposure: 3+ weeks of claims through non-compliant pharmacies.
```

#### dataQ.ai Journey (Value)

```
1. Real-time alert fires: "ALERT: Pharmacy XYZ (NCPDP ID 1234567)
   DEA registration expired today. This pharmacy is in 3 of your networks."
   (Day 0, within hours)
2. Sarah clicks the alert → sees full pharmacy profile with credential timeline
3. She asks the Compliance Watchdog agent: "What's our exposure?
   How many claims did this pharmacy process in the last 7 days?"
4. Agent provides instant analysis with data
5. Sarah clicks "Notify Compliance Team" → auto-generated incident report sent
6. She asks: "Show me all other pharmacies in my network with DEA
   expiring in the next 90 days"
7. Agent generates a proactive risk report with renewal dates
8. Sarah sets up recurring alert: "Notify me 90 days before any
   DEA expiration in my network"

Total time: 30 minutes. Exposure: Same day. Future risk: Eliminated.
```

### 6.2 Journey 2: Compliance VP Prepares for CMS Audit (Current vs. dataQ.ai)

#### Current Journey (Pain)

```
1. Michael learns CMS audit is in 6 weeks (day 0)
2. Requests latest dataQ file from IT (day 1)
3. Cross-references pharmacy credentials against CMS requirements in Excel (day 2-10)
4. Discovers 200 pharmacies haven't completed FWA attestation (day 10)
5. Team manually contacts each pharmacy via email/fax (day 10-25)
6. Tracks responses in spreadsheet (day 10-35)
7. Compiles final report manually in Word/PowerPoint (day 35-40)
8. Submits to CMS (day 40)

Total time: 40 days. Quality: Error-prone. Stress level: Maximum.
```

#### dataQ.ai Journey (Value)

```
1. Michael logs into dataQ.ai dashboard (day 0)
2. Compliance Watchdog agent shows: "Audit Readiness Score: 87%.
   200 pharmacies pending FWA attestation. 15 pharmacies with
   credential gaps."
3. Michael clicks "Generate CMS Audit Report" → No Surprises Assistant
   produces a formatted compliance report in 60 seconds
4. He asks: "Send FWA attestation reminders to all 200 pending pharmacies"
5. Notification engine sends templated reminders with completion links
6. Dashboard updates in real-time as pharmacies complete attestations
7. Michael exports final report on day 30 — fully automated

Total time: Minimal active work. Quality: Audit-ready. Stress level: Low.
```

### 6.3 Journey 3: New Subscriber Onboarding (Current vs. dataQ.ai)

#### Current Journey (Pain)

```
1. Prospect contacts productinfo@ncpdp.org (day 0)
2. Account Executive responds via email (day 1-3)
3. Back-and-forth on requirements, pricing (day 3-14)
4. Contract signed (day 14-30)
5. Login credentials sent via email (day 30)
6. User logs in, sees the portal, has no idea where to start
7. Calls productsupport@ncpdp.org for help (day 31)
8. Support walks them through downloading their first file (day 31)
9. User figures out file format using Implementation Guide PDF (day 31-45)
10. First useful data extraction happens (day 45+)

Time to value: 45+ days.
```

#### dataQ.ai Journey (Value)

```
1. Prospect visits dataQ.ai landing page, sees interactive demo (day 0)
2. Self-service signup for Professional trial (day 0)
3. Onboarding Agent greets them: "Welcome! I see you're a health plan.
   Let me set up your dashboard for pharmacy network management."
4. Role Starter Kit loaded with relevant prompts (day 0)
5. User clicks first prompt: "Show me all pharmacies in Texas
   accepting Medicare Part D"
6. Instant results with map visualization (day 0)
7. NCPDP Buddy guides them through advanced features over first week
8. Account Executive follows up with premium upgrade conversation (day 7)

Time to value: 10 minutes.
```

### 6.4 Journey 4: Data Analyst Builds a Network Report (Current vs. dataQ.ai)

#### Current Journey (Pain)

```
1. Priya downloads dataQ flat file
2. Imports into Tableau (fights with column mappings)
3. Builds geographic coverage map manually
4. Runs separate queries for each metric (pharmacy count by state,
   specialty mix, 24/7 availability)
5. Formats report in PowerPoint
6. Total: 2-3 days per quarterly report
```

#### dataQ.ai Journey (Value)

```
1. Priya asks Custom Report Builder agent: "Generate a Q1 network
   coverage report for our Medicare Part D pharmacy network,
   including geographic heat map, specialty pharmacy distribution,
   and comparison to the previous quarter"
2. Agent generates interactive dashboard with all visualizations
3. Priya clicks "Export to PDF"
4. Total: 5 minutes
```

---

## 7. Feature Requirements

> All features and requirements are numbered with unique IDs for PM tracking. Priority tags: **[P0]** Must-have, **[P1]** Should-have, **[P2]** Nice-to-have.

### 7.1 Modern Portal / UI Redesign

#### FT-001: Home Dashboard [P0]

Replace the static 3-column announcement page with a personalized, role-specific dashboard.

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-001.01 | Live Updates Banner | Real-time ticker showing platform updates, data changes, agent updates | [P0] |
| FT-001.02 | Personalized Dashboard | Role-specific widgets — Network Manager sees network health, Compliance VP sees audit readiness | [P0] |
| FT-001.03 | Quick Actions | One-click access to most-used features based on user behavior | [P0] |
| FT-001.04 | Agent Shortcuts | Top 5 most-used agents with direct launch | [P0] |
| FT-001.05 | Alerts Summary | Count of unread alerts with severity indicators | [P0] |
| FT-001.06 | Success Stories | Curated customer case studies (managed by NCPDP) | [P1] |
| FT-001.07 | News & Updates | NCPDP announcements, regulatory updates, release notes | [P1] |

#### FT-002: Smart Search — replacing WebConnect [P0]

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-002.01 | Unified search bar | Single search across pharmacy name, NCPDP ID, NPI, address, city, state, ZIP | [P0] |
| FT-002.02 | Natural language search | "Specialty pharmacies in Houston open 24/7" | [P0] |
| FT-002.03 | Geographic search with map | Radius search with interactive map results | [P0] |
| FT-002.04 | Typeahead / autocomplete | Suggestions as user types | [P0] |
| FT-002.05 | Saved searches | Users can save and re-run frequent queries | [P1] |
| FT-002.06 | Search history | Recent searches for quick re-access | [P1] |
| FT-002.07 | Advanced filters | Expandable filter panel for precise queries (replaces Pharmacy Audit form) | [P0] |

#### FT-003: Agent Library Page [P0]

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-003.01 | Agent catalog | Grid/card view of all available agents with descriptions | [P0] |
| FT-003.02 | Category filters | Filter by: All, Network Management, Compliance, Credentialing, Data Delivery, Analytics, Search | [P0] |
| FT-003.03 | Favorites | Users can star frequently-used agents | [P1] |
| FT-003.04 | Usage stats | Show agent usage counts and growth trends | [P1] |
| FT-003.05 | Agent detail page | Full description, capabilities, example prompts, and launch button | [P0] |
| FT-003.06 | Top Agents leaderboard | Most popular agents this week/month | [P2] |

#### FT-004: Analytics Dashboard [P0]

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-004.01 | Network coverage heat map | Geographic visualization of pharmacy network | [P0] |
| FT-004.02 | Credential status overview | Pie/bar chart of credential states (active, expiring, expired) | [P0] |
| FT-004.03 | Trend charts | Pharmacy count over time, network growth/churn | [P0] |
| FT-004.04 | Compliance scorecard | FWA attestation rates, network adequacy scores | [P0] |
| FT-004.05 | Custom date ranges | Filter all dashboards by time period | [P0] |
| FT-004.06 | Export | PDF, Excel, PNG export of any dashboard | [P1] |
| FT-004.07 | Comparative benchmarks | Compare your network to industry averages | [P2] |

#### FT-005: Alerts & Notifications Center [P0]

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-005.01 | Alert inbox | Centralized view of all alerts with read/unread status | [P0] |
| FT-005.02 | Alert configuration | User defines which events trigger alerts (credential expiry, pharmacy closure, ownership change, etc.) | [P0] |
| FT-005.03 | Severity levels | Critical / Warning / Info classification | [P0] |
| FT-005.04 | Email delivery | Alerts also sent via email | [P0] |
| FT-005.05 | Alert history | Searchable archive of past alerts | [P1] |
| FT-005.06 | Team sharing | Share alert configurations across team members | [P2] |

#### FT-006: Role Starter Kits [P0]

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-006.01 | Pre-built prompt libraries | Curated prompts organized by role (PBM Network Manager, Compliance VP, Data Analyst, IT Engineer) | [P0] |
| FT-006.02 | Copy-to-agent | One-click to copy a prompt and launch the relevant agent | [P0] |
| FT-006.03 | Community prompts | Users can submit prompts for NCPDP review and publication | [P2] |

#### FT-007: OnDemand Report Builder — replacing current OnDemand [P0]

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-007.01 | Natural language query builder | "Show me all chain pharmacies in California opened after 2023" | [P0] |
| FT-007.02 | Visual filter builder | Modern multi-select dropdowns with search, replacing legacy list boxes | [P0] |
| FT-007.03 | Real-time results preview | See results updating as filters change (no page reload) | [P0] |
| FT-007.04 | Multiple export formats | CSV, Excel, PDF, JSON, API endpoint | [P0] |
| FT-007.05 | Saved reports | Save and schedule recurring reports | [P1] |
| FT-007.06 | Report sharing | Share reports with team members via link | [P1] |

#### FT-008: Pharmacy Profile Page [P0]

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-008.01 | Unified pharmacy view | Single page showing all dataQ demographics + resQ credentials for a pharmacy | [P0] |
| FT-008.02 | Credential timeline | Visual timeline of license/DEA/accreditation status history | [P0] |
| FT-008.03 | Network membership | Which PBM/payer networks this pharmacy belongs to | [P0] |
| FT-008.04 | Change history | Audit trail of all profile changes with timestamps | [P1] |
| FT-008.05 | Related pharmacies | Same ownership group / parent organization | [P1] |

#### FT-009: No Surprises Report — modernized [P0]

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-009.01 | Guided workflow | Step-by-step wizard replacing the current form | [P0] |
| FT-009.02 | Auto-fill from profile | Pre-populates known data, highlights gaps | [P0] |
| FT-009.03 | Compliance status indicator | Clear pass/fail/pending status | [P0] |
| FT-009.04 | Bulk processing | Process multiple pharmacies simultaneously | [P1] |

#### FT-010: User Profile & Preferences — modernized [P1]

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-010.01 | Modern profile management | Clean UI for account settings, replacing legacy form | [P1] |
| FT-010.02 | SSO / MFA support | Enterprise authentication | [P1] |
| FT-010.03 | Team management | Organization admins can manage users and permissions | [P1] |
| FT-010.04 | Notification preferences | Granular control over alert channels and frequency | [P1] |
| FT-010.05 | API key management | View and rotate API keys | [P1] |
| FT-010.06 | Usage dashboard | Track personal and organization API/agent usage | [P1] |

#### FT-011: Admin Tools — modernized [P1]

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-011.01 | Subscriber management | Modern admin interface replacing legacy Tools page | [P1] |
| FT-011.02 | Usage analytics | Dashboard showing subscriber activity, popular agents, data consumption | [P1] |
| FT-011.03 | Output file management | Modern file management replacing current interface | [P1] |
| FT-011.04 | Billing & subscription management | Self-service tier upgrades, invoice history | [P2] |

#### FT-012: Gamification — Pharmacy Profile Completeness [P1]

| Req ID | Element | Description | Priority |
|---|---|---|---|
| FT-012.01 | Profile Completeness Score | Percentage score showing how complete a pharmacy's profile is | [P1] |
| FT-012.02 | Missing field indicators | Clear callouts showing which fields are empty or outdated | [P1] |
| FT-012.03 | Progress incentives | "Complete your services list to improve your network visibility" | [P1] |
| FT-012.04 | Benchmarking | "Your profile is more complete than 73% of pharmacies in your state" | [P2] |

---

### 7.2 AI Chatbot — NCPDP Buddy

#### FT-013: NCPDP Buddy Chatbot [P0]

The cornerstone AI feature — an always-on conversational assistant available on every page.

| Req ID | Requirement | Description | Priority |
|---|---|---|---|
| FT-013.01 | Persistent chat widget | Available on every page via floating button or sidebar | [P0] |
| FT-013.02 | Natural language understanding | Understands pharmacy/healthcare domain terminology | [P0] |
| FT-013.03 | Data queries | "How many pharmacies closed in Texas last month?" — instant answer from dataQ | [P0] |
| FT-013.04 | Navigation assistance | "How do I download my output files?" — guides user to the right page | [P0] |
| FT-013.05 | Agent handoff | Recognizes complex requests and hands off to specialized agents | [P0] |
| FT-013.06 | Conversation history | Maintains context within and across sessions | [P0] |
| FT-013.07 | Source citations | Every data answer cites the source record and timestamp | [P0] |
| FT-013.08 | Internal mode | Separate mode for NCPDP support staff answering subscriber queries | [P0] |
| FT-013.09 | Suggested prompts | Shows contextual prompt suggestions based on current page | [P1] |
| FT-013.10 | Feedback mechanism | Thumbs up/down on every response for continuous improvement | [P1] |
| FT-013.11 | Multi-turn conversations | Supports complex back-and-forth: "Now filter those to only specialty pharmacies" | [P0] |

### 7.3 API Layer

#### FT-014: Modern API Layer (REST/GraphQL) [P0]

| Req ID | Requirement | Description | Priority |
|---|---|---|---|
| FT-014.01 | REST API | Standard RESTful endpoints for all pharmacy data operations | [P0] |
| FT-014.02 | GraphQL API | Flexible queries — subscribers request exactly the fields they need | [P0] |
| FT-014.03 | Authentication | OAuth 2.0 + API key authentication | [P0] |
| FT-014.04 | Rate limiting | Configurable per-tier rate limits | [P0] |
| FT-014.05 | Versioning | API versioning with deprecation policy | [P0] |
| FT-014.06 | Usage metering | Track API calls per subscriber for billing and analytics | [P0] |
| FT-014.07 | Basic documentation | API reference with examples (full developer portal in Phase 2) | [P0] |
| FT-014.08 | Pagination | Cursor-based pagination for large result sets | [P0] |
| FT-014.09 | Filtering & sorting | Query parameters matching all dataQ/resQ fields | [P0] |
| FT-014.10 | Bulk endpoints | Batch lookups (up to 1,000 pharmacies per request) | [P1] |
| FT-014.11 | Delta/changes endpoint | "Give me only records changed since [timestamp]" | [P1] |

---

## 8. AI Agent Catalog

### 8.1 Overview

dataQ.ai includes **33 purpose-built AI agents** organized into 7 categories. Each agent is designed for a specific task, trained on NCPDP data, and includes guardrails to ensure accuracy.

### 8.2 Customer-Facing Agents (25 agents)

#### Category 1: Search & Discovery (3 agents)

**AGT-01: NCPDP Buddy** [P0 — Phase 1a]
- **What it does:** General-purpose AI assistant for navigating the dataQ.ai platform, answering data questions, and guiding users to the right tools and agents
- **Value delivered:** Eliminates the learning curve for new users and reduces support tickets by 40%+. Users get instant answers instead of emailing productsupport@ncpdp.org
- **Example interactions:**
  - "How do I set up alerts for pharmacy closures?"
  - "What's the difference between dataQ and resQ?"
  - "Show me pharmacies in my network that are open 24/7"
- **Primary users:** All subscribers

**AGT-02: Pharmacy Finder** [P0 — Phase 1b]
- **What it does:** Advanced pharmacy search using natural language, fuzzy matching, geographic proximity, and multi-attribute filtering. Replaces and vastly improves WebConnect
- **Value delivered:** Reduces pharmacy lookup time from minutes (navigating forms, guessing field values) to seconds. Supports partial information: "I think the pharmacy name starts with 'Care' and it's near Dallas"
- **Example interactions:**
  - "Find all compounding pharmacies within 20 miles of ZIP 75201"
  - "Search for pharmacy with NPI ending in 4589"
  - "Show me government pharmacies in Alaska that offer immunizations"
- **Primary users:** PBMs, Health Plans, EHR vendors

**AGT-03: Pharmacy Comparison Agent** [P1 — Phase 1c]
- **What it does:** Side-by-side comparison of pharmacies across demographics, services, credentials, network membership, and compliance status
- **Value delivered:** Enables data-driven decisions for network inclusion, competitive analysis, and market research without manual Excel comparison
- **Example interactions:**
  - "Compare these 3 pharmacies on services, hours, and credential status"
  - "How does Pharmacy A's profile compare to the average community pharmacy in its ZIP code?"
- **Primary users:** PBMs, Health Plans, Analysts

#### Category 2: Network Management (5 agents)

**AGT-04: Network Analyzer** [P0 — Phase 1a]
- **What it does:** Analyzes pharmacy network composition, coverage, gaps, and trends. Provides geographic, demographic, and service-level analysis of any pharmacy network
- **Value delivered:** Replaces weeks of manual SQL/Excel analysis with instant interactive analysis. PBM network managers can answer board-level questions in real-time
- **Example interactions:**
  - "Analyze my Medicare Part D network coverage in Florida — where are the gaps?"
  - "What percentage of my network offers specialty pharmacy services?"
  - "Show me network growth/churn over the last 12 months"
- **Primary users:** PBMs, Health Plans

**AGT-05: Change Tracker** [P0 — Phase 1a]
- **What it does:** Monitors and reports all changes to pharmacy profiles within a subscriber's network or area of interest — new pharmacies, closures, ownership changes, address updates, service changes
- **Value delivered:** Eliminates the need to diff monthly flat files. Subscribers always know what changed without manual comparison. Critical for maintaining accurate pharmacy directories
- **Example interactions:**
  - "What pharmacies changed in my network this week?"
  - "Show me all pharmacy closures in California in the last 90 days"
  - "Alert me whenever a pharmacy in my network changes ownership"
- **Primary users:** PBMs, Health Plans, IT Vendors

**AGT-06: Network Adequacy Agent** [P1 — Phase 1b]
- **What it does:** Evaluates pharmacy network adequacy against CMS, state, and accreditation standards. Calculates geographic access metrics (time/distance to nearest pharmacy) for any population
- **Value delivered:** Automates network adequacy analysis that currently takes compliance teams weeks. Identifies specific ZIP codes or counties where adequacy standards are not met
- **Example interactions:**
  - "Does my network meet CMS Medicare Part D pharmacy access standards in all Texas counties?"
  - "Show me areas where members must travel more than 15 miles to reach an in-network pharmacy"
  - "What pharmacies could I add to fix the adequacy gap in rural Ohio?"
- **Primary users:** PBMs, Health Plans, Government

**AGT-07: Contract Intelligence Agent** [P1 — Phase 1c]
- **What it does:** Monitors pharmacy ownership changes, mergers, acquisitions, and parent organization restructuring that may trigger contract renegotiation or re-credentialing requirements
- **Value delivered:** Prevents revenue leakage from stale contracts and ensures network agreements reflect current pharmacy ownership
- **Example interactions:**
  - "Which pharmacies in my network changed ownership in Q1?"
  - "Alert me when any chain pharmacy in my network is acquired"
  - "Show me all pharmacies owned by [Parent Organization] across all my networks"
- **Primary users:** PBMs, Health Plans

**AGT-08: Formulary-Network Alignment Agent** [P1 — Phase 1c]
- **What it does:** Cross-references pharmacy capabilities (specialty, compounding, 340B, LTC) against formulary requirements and plan benefit designs to identify service gaps
- **Value delivered:** Ensures every drug on the formulary has adequate pharmacy network support for dispensing. Identifies specialty drug access gaps before they become member complaints
- **Example interactions:**
  - "Do I have enough specialty pharmacies to support my oncology formulary in the Southeast?"
  - "Which of my network pharmacies can compound pediatric medications?"
  - "Show me 340B pharmacies in my network and their covered entity affiliations"
- **Primary users:** PBMs, Health Plans

#### Category 3: Compliance & Regulatory (6 agents)

**AGT-09: Compliance Watchdog** [P0 — Phase 1a]
- **What it does:** Continuously monitors pharmacy credentials (licenses, DEA registrations, accreditations, FWA attestations) and flags compliance risks — expirations, lapses, gaps, and anomalies
- **Value delivered:** Transforms compliance from a reactive quarterly exercise to proactive continuous monitoring. Prevents CMS audit findings, reduces compliance team workload by 50%+
- **Example interactions:**
  - "Show me all pharmacies in my network with credentials expiring in the next 90 days"
  - "What's my overall FWA attestation completion rate?"
  - "Which pharmacies have a gap between their license expiration and renewal?"
- **Primary users:** PBMs, Health Plans, Government

**AGT-10: No Surprises Assistant** [P0 — Phase 1b]
- **What it does:** Automates No Surprises Act compliance reporting. Pre-fills report data, validates completeness, identifies missing information, and generates submission-ready reports
- **Value delivered:** Reduces No Surprises Act reporting from hours of manual form-filling to minutes. Eliminates data entry errors that trigger regulatory follow-ups
- **Example interactions:**
  - "Generate my No Surprises compliance report for Q1"
  - "Which pharmacies in my report have incomplete profiles?"
  - "Show me pharmacies that were updated since my last No Surprises submission"
- **Primary users:** Health Plans, Pharmacies

**AGT-11: Regulatory Summary Agent** [P1 — Phase 1b]
- **What it does:** Monitors and summarizes regulatory changes from CMS, state boards of pharmacy, and other regulatory bodies. Assesses impact on the subscriber's pharmacy network
- **Value delivered:** Subscribers learn about regulatory changes and their specific impact without reading 100-page Federal Register notices. Reduces regulatory surprise and compliance scrambles
- **Example interactions:**
  - "Summarize the latest CMS pharmacy access rule changes and how they affect my network"
  - "What new state pharmacy regulations took effect this quarter?"
  - "How many of my pharmacies are affected by the new DEA telemedicine prescribing rule?"
- **Primary users:** Government, PBMs, Health Plans

**AGT-12: FWA Risk Scoring Agent** [P1 — Phase 1c]
- **What it does:** Analyzes pharmacy profiles for fraud, waste, and abuse risk indicators — unusual patterns, credential gaps, attestation delays, dispensing class mismatches
- **Value delivered:** Proactive fraud detection that supplements existing FWA programs. Flags high-risk pharmacies before they become audit findings or enforcement actions
- **Example interactions:**
  - "Rank pharmacies in my network by FWA risk score"
  - "Which pharmacies have the most credential gaps over the past 2 years?"
  - "Show me pharmacies that changed dispenser class multiple times"
- **Primary users:** PBMs, Government

**AGT-13: Credential Lifecycle Manager** [P1 — Phase 1b]
- **What it does:** Tracks the complete lifecycle of every pharmacy credential — from initial issuance through renewal cycles. Generates re-credentialing workflows and tracks completion
- **Value delivered:** Automates the credentialing tracking process that currently requires spreadsheets and manual calendar reminders. Ensures no credential falls through the cracks
- **Example interactions:**
  - "Show me the credentialing timeline for Pharmacy XYZ"
  - "Generate re-credentialing tasks for all pharmacies with licenses expiring in Q2"
  - "What percentage of my network completed re-credentialing on time last year?"
- **Primary users:** PBMs, Pharmacies

**AGT-14: Provider Enrollment Verifier** [P1 — Phase 1c]
- **What it does:** Cross-references pharmacy enrollment status across Medicare, Medicaid, and commercial programs against their dataQ/resQ profile to identify discrepancies
- **Value delivered:** Prevents claims from pharmacies not properly enrolled. Catches enrollment gaps that would result in claim denials or audit findings
- **Example interactions:**
  - "Which pharmacies in my network are not enrolled in Medicare Part D?"
  - "Show me pharmacies billing Medicaid that have expired state licenses"
  - "Verify enrollment status for all pharmacies that joined my network in the last 6 months"
- **Primary users:** Government, PBMs

#### Category 4: Data Delivery & Integration (5 agents)

**AGT-15: Data Feed Builder** [P0 — Phase 1a]
- **What it does:** Converts natural language requirements into custom data feed configurations — field selection, filters, delivery format, refresh frequency. Replaces the manual process of configuring custom files
- **Value delivered:** Subscribers describe what they need in plain English and get a configured data feed in minutes instead of weeks of back-and-forth with NCPDP account executives
- **Example interactions:**
  - "I need a weekly feed of all pharmacy openings and closures in my 5-state territory, in JSON format"
  - "Set up a daily delta feed of credential changes for pharmacies in my network"
  - "Create a custom file with pharmacy demographics + DEA status for all specialty pharmacies"
- **Primary users:** IT Vendors, Clearinghouses, PBMs

**AGT-16: Directory Sync Agent** [P1 — Phase 1c]
- **What it does:** Compares a subscriber's internal pharmacy directory against NCPDP source data and identifies discrepancies — wrong addresses, outdated phone numbers, closed pharmacies still listed as active
- **Value delivered:** Ensures subscriber pharmacy directories are accurate without manual record-by-record comparison. Critical for EHR vendors whose directories drive prescription routing
- **Example interactions:**
  - "I'll upload my pharmacy directory — compare it against current NCPDP data"
  - "Show me all discrepancies between my records and NCPDP for pharmacies in New York"
  - "How many of my directory entries have outdated addresses?"
- **Primary users:** EHR/IT Vendors, Clearinghouses

**AGT-17: E-Prescribing Router Agent** [P2 — Phase 1c]
- **What it does:** Uses pharmacy capabilities data (services, specialties, hours, location) to recommend optimal pharmacy routing for prescriptions based on patient needs
- **Value delivered:** Improves prescription routing accuracy, reduces patient redirects, and ensures specialty prescriptions reach capable pharmacies
- **Example interactions:**
  - "Which pharmacies within 10 miles of this ZIP can fill a compounded prescription?"
  - "Find the nearest 24/7 pharmacy to this address that accepts Medicaid"
  - "Rank pharmacies by capability match for this specialty medication"
- **Primary users:** EHR Vendors, E-prescribing networks

**AGT-18: Data Quality Reconciler** [P1 — Phase 1c]
- **What it does:** Analyzes pharmacy data quality across the database — identifies incomplete profiles, stale records, conflicting information, and data anomalies
- **Value delivered:** Helps NCPDP and subscribers understand data quality. Subscribers can filter results by data quality score. NCPDP can prioritize outreach to pharmacies with poor data
- **Example interactions:**
  - "What's the data quality score for pharmacies in my network?"
  - "Show me pharmacies that haven't updated their profile in over 2 years"
  - "Which pharmacy records have conflicting address data?"
- **Primary users:** IT Vendors, NCPDP Internal

**AGT-19: Standards Migration Agent** [P2 — Phase 1c]
- **What it does:** When NCPDP releases new data standard versions (e.g., dataQ v3.0 → v3.1), analyzes the subscriber's current implementation and generates a detailed migration impact report and action plan
- **Value delivered:** Reduces standard version migration from a multi-week analysis project to an automated report. Accelerates adoption of new NCPDP standards
- **Example interactions:**
  - "What changed between dataQ v3.0 and v3.1 that affects my integration?"
  - "Generate a migration checklist for upgrading our dataQ implementation"
  - "Which of my data feeds will break with the new field format changes?"
- **Primary users:** IT Vendors, Clearinghouses

#### Category 5: Credentialing / resQ (3 agents)

**AGT-20: Credentialing Assist** [P0 — Phase 1b]
- **What it does:** Guides pharmacies through the resQ credentialing process step-by-step. Validates uploaded documents, checks for completeness, and flags errors before submission
- **Value delivered:** Reduces credentialing submission errors by 70%+, accelerates credentialing cycle time, eliminates back-and-forth between NCPDP and pharmacies on incomplete submissions
- **Example interactions:**
  - "What credentials do I need to submit for Medicare Part D enrollment?"
  - "I uploaded my DEA certificate — is it valid and complete?"
  - "What's missing from my credentialing application?"
- **Primary users:** Pharmacies, Pharmacy chains

**AGT-21: Profile Completeness Coach** [P1 — Phase 1b]
- **What it does:** Analyzes a pharmacy's dataQ profile and recommends specific updates to improve completeness, accuracy, and network visibility. Tied to the gamification system
- **Value delivered:** Directly improves data quality across the NCPDP database by motivating pharmacies to maintain current, complete profiles. More complete profiles = more valuable data for all subscribers
- **Example interactions:**
  - "What should I update on my profile to improve my completeness score?"
  - "Which fields are most important for being included in PBM networks?"
  - "How does my profile compare to other pharmacies in my area?"
- **Primary users:** Pharmacies

**AGT-22: Network Visibility Advisor** [P1 — Phase 1c]
- **What it does:** Analyzes a pharmacy's profile and credentials against PBM/payer network requirements and identifies which networks the pharmacy qualifies for but isn't currently in
- **Value delivered:** Helps pharmacies maximize their network participation and revenue. Incentivizes pharmacies to keep profiles current (directly tied to business benefit)
- **Example interactions:**
  - "Which PBM networks am I currently in?"
  - "What credentials am I missing to qualify for Express Scripts' specialty network?"
  - "Show me networks in my area that I could join based on my current credentials"
- **Primary users:** Pharmacies

#### Category 6: Analytics & Prediction (4 agents)

**AGT-23: Pharmacy Comparison Agent** (listed above in Search & Discovery)

**AGT-24: Pharmacy Desert Alert Agent** [P1 — Phase 1c]
- **What it does:** Monitors geographic pharmacy coverage and identifies areas at risk of becoming pharmacy deserts — communities losing pharmacy access due to closures, reduced hours, or population changes
- **Value delivered:** Critical for health equity and regulatory compliance. Enables proactive network management before access becomes a crisis. Essential for CMS network adequacy requirements
- **Example interactions:**
  - "Show me ZIP codes with only one pharmacy remaining"
  - "Which rural areas lost pharmacy access in the last 12 months?"
  - "Map pharmacy density per 10,000 population across my service area"
- **Primary users:** Government, Health Plans, PBMs

**AGT-25: Closure Prediction Agent** [P2 — Phase 1c]
- **What it does:** Uses historical patterns (declining profile updates, credential lapses, ownership changes, market factors) to predict which pharmacies are at elevated risk of closure
- **Value delivered:** Enables proactive network management — PBMs can identify backup pharmacies before a closure creates a gap. Government agencies can intervene to preserve access
- **Example interactions:**
  - "Which pharmacies in my network have the highest closure risk in the next 6 months?"
  - "What factors are contributing to the closure risk score for Pharmacy XYZ?"
  - "Show me the trend of pharmacy closures vs. openings in rural markets"
- **Primary users:** PBMs, Health Plans, Government

**AGT-26: Custom Report Builder** [P0 — Phase 1a]
- **What it does:** Generates formatted reports (PDF, Excel) from natural language descriptions. Replaces the rigid OnDemand form with conversational report creation
- **Value delivered:** Reduces report generation from hours/days to minutes. Non-technical users can create sophisticated reports without knowing database structure or query syntax
- **Example interactions:**
  - "Generate a quarterly network report for my Medicare Part D plan in Florida"
  - "Create a credential expiry report for all chain pharmacies in my network, grouped by state"
  - "Build a comparison report of my network's specialty pharmacy coverage vs. national benchmarks"
- **Primary users:** All subscribers

#### Category 7: Claims & Routing (2 agents)

**AGT-27: Claims Routing Optimizer** [P1 — Phase 1c]
- **What it does:** Validates pharmacy identifiers (NCPDP ID, NPI) in real-time during claim submission workflows. Flags stale, inactive, or mismatched pharmacy records before claims are processed
- **Value delivered:** Reduces claim rejections caused by outdated pharmacy data. Saves clearinghouses and PBMs the cost of claim rework and resubmission
- **Example interactions:**
  - "Validate this list of 500 NCPDP IDs against current active records"
  - "Which pharmacy IDs in this claim batch are inactive or deactivated?"
  - "Show me the current status for NCPDP ID 1234567 — is it valid for claims?"
- **Primary users:** Clearinghouses, PBMs

**AGT-28: Batch Download Optimizer** [P1 — Phase 1b]
- **What it does:** Replaces the current 50-pharmacy-at-a-time batch limit with intelligent bulk download packaging. Recommends optimal download strategies based on subscriber needs
- **Value delivered:** Eliminates the painful process of 1,400+ batch operations for large networks. Intelligently packages downloads by geography, network, or change status
- **Example interactions:**
  - "Download complete profiles for all 45,000 pharmacies in my network"
  - "Give me only pharmacies that changed since my last download"
  - "Package my download by state for our regional teams"
- **Primary users:** PBMs, Health Plans, IT Vendors

### 8.3 NCPDP Internal Agents (5 agents)

**AGT-29: Support Voice** [P1 — Phase 1c]
- **What it does:** AI-assisted support tool for NCPDP staff handling productsupport@ncpdp.org emails and calls. Suggests responses, pulls up relevant data, and drafts reply emails
- **Value delivered:** Reduces support response time from hours/days to minutes. Ensures consistent, accurate support responses. Enables junior staff to handle complex queries
- **Example interactions (internal):**
  - "Subscriber is asking why their custom file is missing column X — draft a response"
  - "Pull up the complete account history for Subscriber ABC"
  - "What are the most common support issues this week?"
- **Primary users:** NCPDP support staff

**AGT-30: Subscriber Sentiment Agent** [P1 — Phase 1c]
- **What it does:** Analyzes incoming support tickets and communications for tone, urgency, and satisfaction indicators. Flags at-risk subscribers showing frustration patterns
- **Value delivered:** Early warning system for subscriber churn. Enables proactive outreach to dissatisfied subscribers before they cancel
- **Example interactions (internal):**
  - "Which subscribers have submitted the most support tickets this month?"
  - "Flag any subscriber communications with negative sentiment"
  - "Show me the sentiment trend for our top 20 revenue subscribers"
- **Primary users:** NCPDP account management

**AGT-31: Subscriber Insight Agent** [P1 — Phase 1c]
- **What it does:** Analyzes subscriber usage patterns across the platform — which features they use, which agents they query, how often they log in — and generates upsell and engagement recommendations
- **Value delivered:** Data-driven account management. Identifies subscribers ready for tier upgrades and those at risk of churning. Directly supports the revenue growth target
- **Example interactions (internal):**
  - "Which Essential tier subscribers are using the platform heavily enough to upgrade?"
  - "Show me subscribers who haven't logged in for 60+ days"
  - "What features do our Enterprise subscribers use most?"
- **Primary users:** NCPDP sales and account management

**AGT-32: Data Curation Agent** [P2 — Phase 1c]
- **What it does:** Automatically packages and formats data for different subscriber segments. Generates segment-specific data products without manual intervention
- **Value delivered:** Enables NCPDP to create and deliver specialized data products efficiently. Supports the launch of new niche data offerings without proportional staff increases
- **Example interactions (internal):**
  - "Create a specialty pharmacy dataset for the oncology market"
  - "Package a 340B pharmacy directory with enhanced demographic data"
  - "Generate a state-specific pharmacy dataset for the Texas Medicaid RFP"
- **Primary users:** NCPDP product and sales teams

**AGT-33: Onboarding Agent** [P0 — Phase 1b]
- **What it does:** Guides new subscribers through platform setup — selecting their tier, configuring alerts, setting up data feeds, learning the agent library. Personalized based on subscriber type
- **Value delivered:** Reduces time-to-value from 45+ days to 10 minutes. Eliminates the need for manual onboarding calls. Increases subscriber satisfaction from day one
- **Example interactions:**
  - "Welcome! I see you're a regional health plan. Let me set up your dashboard for pharmacy network management."
  - "Here are the top 5 agents most popular with organizations like yours"
  - "Would you like me to configure weekly alerts for pharmacy credential changes in your network?"
- **Primary users:** New subscribers (all types)

**Agent 34: Audit Trail Agent** [P1 — Phase 1c]
- **What it does:** Tracks and reports on all data access and agent interactions across the platform. Generates compliance-ready audit logs showing who accessed what data and when
- **Value delivered:** Essential for regulated healthcare customers who must demonstrate data access controls. Supports HIPAA compliance and internal governance requirements
- **Example interactions:**
  - "Show me all data access by User X in the last 30 days"
  - "Generate a HIPAA-compliant audit report for Q1"
  - "Which users accessed pharmacy credential data this month?"
- **Primary users:** NCPDP compliance, subscriber compliance teams

> **Note:** The catalog totals 34 agents (25 customer-facing + 5 internal + Pharmacy Comparison listed in two categories + Audit Trail + Batch Download Optimizer + Custom Report Builder). The 33 count in the executive summary reflects unique agent builds, as Pharmacy Comparison Agent is listed in both Search & Discovery and Analytics categories but is a single agent.

### 8.4 Agent Delivery Schedule

| Phase | Sequence | Agents Delivered | Count |
|---|---|---|---|
| Phase 1a | Early | NCPDP Buddy, Network Analyzer, Compliance Watchdog, Change Tracker, Data Feed Builder, Custom Report Builder | 6 |
| Phase 1b | Mid | Credentialing Assist, No Surprises Assistant, Regulatory Summary, Credential Lifecycle Manager, Profile Completeness Coach, Pharmacy Finder, Onboarding Agent, Batch Download Optimizer | 8 |
| Phase 1c | Later | Remaining 19 agents | 19 |

---

## 9. Data Monetization Strategy

### 9.1 Current State

| Dimension | Current |
|---|---|
| Pricing model | Flat ~$40K/year for full file access |
| Delivery method | Monthly SFTP flat files (full file + delta) |
| Tiers | Effectively one tier — all subscribers get the same product |
| Revenue per subscriber | ~$40K (no variation) |
| Usage visibility | None — no tracking of how customers use the data |
| Upsell path | None — nothing to upgrade to |

### 9.2 Proposed Tiered Model

#### Tier 1: Essential — $40K/year

*Preserve the current offering for price-sensitive subscribers*

| Feature | Included |
|---|---|
| Monthly flat files (full + delta) via SFTP | Yes |
| Basic portal access (modernized UI) | Yes |
| NCPDP Buddy chatbot (limited to 50 queries/month) | Yes |
| WebConnect search (basic) | Yes |
| Email support | Yes |
| Data freshness | Monthly |

#### Tier 2: Professional — $75,000-$100,000/year

*The sweet spot — modern platform for network managers and compliance teams*

| Feature | Included |
|---|---|
| Everything in Essential | Yes |
| Full NCPDP Buddy (unlimited) | Yes |
| 10 core AI agents | Yes |
| Analytics dashboards | Yes |
| Real-time alerts & notifications | Yes |
| Role Starter Kits | Yes |
| OnDemand report builder (NL queries) | Yes |
| REST API access (10,000 calls/month) | Yes |
| Data freshness | Daily |
| Priority email + chat support | Yes |

#### Tier 3: Enterprise — $150,000-$250,000/year

*Full platform for large PBMs, national health plans, and sophisticated integrators*

| Feature | Included |
|---|---|
| Everything in Professional | Yes |
| All 33 AI agents | Yes |
| GraphQL API access (100,000 calls/month) | Yes |
| Webhooks & event streaming (Phase 2) | Yes |
| Custom report builder | Yes |
| Predictive analytics (closure prediction, risk scoring) | Yes |
| Dedicated customer success manager | Yes |
| Custom data feeds | Yes |
| Data freshness | Near real-time (15-60 minutes) |
| SLA-backed uptime guarantee (99.9%) | Yes |
| Phone support | Yes |

### 9.3 Migration Strategy for Existing Subscribers

| Action | Detail |
|---|---|
| **12-month free upgrade** | All existing $40K subscribers automatically upgraded to Professional tier for 12 months at no additional cost |
| **Rationale** | Drives adoption, builds habit, demonstrates value. After 12 months, subscribers who've experienced daily data freshness, agents, and dashboards will not want to downgrade |
| **Post-trial pricing** | After 12 months: continue at Professional ($75-100K) or downgrade to Essential ($40K with SFTP only) |
| **Enterprise sales** | Top 20-30 accounts receive white-glove Enterprise demos and custom pricing during the 12-month window |

### 9.4 Revenue Projection

| Scenario | Assumption | Projected Revenue |
|---|---|---|
| **Conservative** | 20% upgrade to Professional, 5% to Enterprise | $20.4M (+28%) |
| **Base case** | 30% Professional, 10% Enterprise | $24.2M (+51%) |
| **Optimistic** | 40% Professional, 15% Enterprise, 10% new subscribers | $29.8M (+86%) |

### 9.5 New Revenue Streams (Phase 2+)

| Stream | Description | Potential |
|---|---|---|
| API overage charges | Pay-per-call beyond tier limits | $500K-$1M/year |
| Premium analytics packages | Predictive models, benchmarking reports | $1-2M/year |
| Data quality certification | "NCPDP Verified" badge for pharmacies with 95%+ completeness | $500K/year |
| Custom agent development | Purpose-built agents for specific large customers | $200-500K per engagement |
| Marketplace / partner integrations | Third-party tools built on dataQ.ai APIs | Platform revenue share |

---

## 10. Technology Architecture

### 10.1 Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Web Portal   │  │  API Clients  │  │  SFTP (Legacy)     │  │
│  │  (Next.js)    │  │  (REST/GQL)   │  │  (Maintained)      │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘  │
└─────────┼─────────────────┼───────────────────┼──────────────┘
          │                 │                   │
┌─────────▼─────────────────▼───────────────────▼──────────────┐
│                    API GATEWAY                                │
│  Auth (OAuth 2.0) │ Rate Limiting │ Usage Metering │ CORS    │
└─────────────────────────┬────────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────┐
│                    APPLICATION LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  AI/Agent     │  │  Data         │  │  Notification      │  │
│  │  Service      │  │  Service      │  │  Service           │  │
│  │  (Claude API) │  │  (FastAPI)    │  │  (Alerts/Email)    │  │
│  └──────────────┘  └──────────────┘  └────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Search       │  │  Analytics    │  │  Auth              │  │
│  │  Service      │  │  Service      │  │  Service           │  │
│  │  (Elastic)    │  │  (Dashboards) │  │  (Auth0/Cognito)   │  │
│  └──────────────┘  └──────────────┘  └────────────────────┘  │
└─────────────────────────┬────────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────┐
│                    DATA LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  PostgreSQL   │  │ Elasticsearch │  │  Redis             │  │
│  │  (Primary DB) │  │ (Search/Geo)  │  │  (Cache/Sessions)  │  │
│  └──────────────┘  └──────────────┘  └────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                          │
│  │  S3/Blob      │  │  Vector DB    │                         │
│  │  (File Store) │  │  (Embeddings) │                         │
│  └──────────────┘  └──────────────┘                          │
└───────────────────��──────────────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────┐
│                    INFRASTRUCTURE                             │
│  AWS/Azure │ Kubernetes │ CI/CD │ Monitoring (Datadog)       │
│  Multi-region US │ Auto-scaling │ WAF │ DDoS Protection      │
└──────────────────────────────────────────────────────────────┘
```

### 10.2 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 14+ | Server-side rendering, React ecosystem, excellent performance |
| **UI Framework** | Tailwind CSS + Shadcn UI | Modern, accessible, rapid development |
| **Mapping** | Mapbox GL or Leaflet | Geographic visualizations, heat maps, radius search |
| **Charts** | Recharts or D3.js | Interactive dashboards and analytics |
| **Backend** | Python (FastAPI) | Best AI/ML ecosystem, async support, fast API development |
| **AI/LLM** | Claude API (Anthropic) | Best-in-class for agentic workflows, tool use, long context windows |
| **Vector Database** | Pinecone or pgvector | Semantic search and RAG for chatbot/agents |
| **Primary Database** | PostgreSQL 16+ | ACID compliance, JSON support, PostGIS for geographic queries |
| **Search Engine** | Elasticsearch 8+ | Full-text search, fuzzy matching, geographic queries, aggregations |
| **Cache** | Redis 7+ | Session management, rate limiting, real-time features |
| **File Storage** | AWS S3 / Azure Blob | Flat file storage and delivery (replacing SFTP) |
| **Authentication** | Auth0 or AWS Cognito | SSO, MFA, RBAC, OAuth 2.0, SAML |
| **API Gateway** | AWS API Gateway or Kong | Rate limiting, auth, usage metering, versioning |
| **Cloud Platform** | AWS or Azure | Healthcare-grade compliance, auto-scaling, multi-region |
| **Container Orchestration** | Kubernetes (EKS/AKS) | Microservices deployment, auto-scaling, resilience |
| **CI/CD** | GitHub Actions or GitLab CI | Automated testing, deployment, security scanning |
| **Monitoring** | Datadog or New Relic | APM, logging, SLA tracking, usage analytics |
| **Email/Notifications** | SendGrid or AWS SES | Transactional emails, alert delivery |

### 10.3 Key Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Monolith vs. Microservices | **Microservices** | Independent scaling of AI, search, and data services; team autonomy; fault isolation |
| REST vs. GraphQL | **Both** | REST for simple integrations (Professional tier); GraphQL for flexible queries (Enterprise tier) |
| Multi-tenant vs. Single-tenant | **Multi-tenant** | Cost-efficient; all subscribers share infrastructure with logical data isolation |
| Cloud provider | **AWS or Azure** | Both have healthcare compliance certifications; decision based on NCPDP's existing preference |
| AI model | **Claude (Anthropic)** | Superior tool-use capabilities for agentic workflows; strong safety/accuracy characteristics; long context for complex pharmacy queries |

---

## 11. SFTP Migration Roadmap

### 11.1 Phased Transition

| Phase | Sequence | SFTP Status | New Delivery | Strategy |
|---|---|---|---|---|
| **Phase 1** | Initial | Keep as-is (included in $40K Essential) | Launch REST/GraphQL APIs + cloud download (S3/Azure Blob) as premium add-on | No disruption. Customers choose. |
| **Phase 2** | Following | Still available but no new features added to flat files | APIs get exclusive new features (real-time alerts, webhooks, AI agents) | Create pull toward new platform |
| **Phase 3** | Mid-term | Mark as legacy — announce 18-month sunset timeline | Full feature parity + premium capabilities | Guided migration support |
| **Phase 4** | Long-term | Retire SFTP | All delivery through modern platform | Cost savings, full analytics |

### 11.2 Migration Support

| Support Element | Description |
|---|---|
| Migration guides | Step-by-step documentation for moving from flat files to APIs |
| Parallel operation | Subscribers can run SFTP and API simultaneously during migration |
| Data format mapping | API responses map directly to flat file field names for easy transition |
| Dedicated migration support | Engineering support for high-value subscribers during transition |
| Migration incentives | Discounted first year on Professional/Enterprise for early API adopters |

---

## 12. Non-Functional Requirements

### 12.1 Security & Compliance

| Requirement | Target | Priority |
|---|---|---|
| HIPAA compliance | Full compliance — BAA support, encryption, access controls, audit logging | [P0] |
| SOC 2 Type II certification | Achieve within 12 months of launch | [P0] |
| FedRAMP authorization | Roadmap item for government segment (Phase 3) | [P2] |
| Encryption at rest | AES-256 for all stored data | [P0] |
| Encryption in transit | TLS 1.3 for all communications | [P0] |
| Multi-factor authentication | Required for all users | [P0] |
| Single Sign-On (SSO) | SAML 2.0 and OIDC support for enterprise customers | [P1] |
| Role-based access control (RBAC) | Granular permissions by user role and data scope | [P0] |
| Penetration testing | Annual third-party penetration test | [P0] |
| Vulnerability scanning | Automated weekly scanning of all components | [P0] |
| Data residency | All data stored in US data centers only | [P0] |

### 12.2 Performance

| Requirement | Target | Priority |
|---|---|---|
| Page load time | < 2 seconds for dashboard and search pages | [P0] |
| API response time | < 500ms for single-record lookups; < 2s for complex queries | [P0] |
| Search response time | < 1 second for standard queries; < 3 seconds for geographic/complex | [P0] |
| Agent response time | First token < 2 seconds; complete response < 15 seconds | [P0] |
| Chatbot response time | First token < 1 second; complete response < 10 seconds | [P0] |
| Concurrent users | 2,000 concurrent (architected for 5,000+) | [P0] |
| File download speed | 100MB file in < 30 seconds | [P1] |
| Dashboard refresh | < 5 seconds for full dashboard reload | [P0] |

### 12.3 Availability & Reliability

| Requirement | Target | Priority |
|---|---|---|
| Uptime SLA | 99.9% (~8.7 hours downtime/year) | [P0] |
| Disaster recovery | Multi-region US deployment with automated failover | [P0] |
| Recovery Time Objective (RTO) | < 1 hour | [P0] |
| Recovery Point Objective (RPO) | < 15 minutes (no data loss beyond 15 min) | [P0] |
| Backup frequency | Daily full backups, continuous transaction logs | [P0] |
| Planned maintenance window | < 4 hours/month, off-peak only (Sundays 2-6 AM ET) | [P1] |

### 12.4 Scalability

| Requirement | Target | Priority |
|---|---|---|
| Concurrent users at launch | 2,000 | [P0] |
| Architected ceiling | 5,000+ without re-architecture | [P0] |
| API calls per second | 500 sustained, 2,000 burst | [P0] |
| Database size | Support 10M+ pharmacy records with full history | [P0] |
| Auto-scaling | Horizontal scaling based on load (Kubernetes HPA) | [P0] |

### 12.5 Data Freshness

| Tier | Freshness Target | Priority |
|---|---|---|
| Essential | Monthly (same as current) | [P0] |
| Professional | Daily (data updated every 24 hours) | [P0] |
| Enterprise | Near real-time (changes reflected within 15-60 minutes) | [P0] |

### 12.6 Browser & Device Support

| Requirement | Target | Priority |
|---|---|---|
| Desktop browsers | Chrome, Firefox, Safari, Edge (latest 2 versions) | [P0] |
| Responsive design | Full functionality on tablet and mobile | [P0] |
| Minimum screen width | 320px (mobile) | [P0] |
| Accessibility | WCAG 2.1 AA compliance | [P1] |

---

## 13. AI Accuracy & Guardrails

### 13.1 The Stakes

In healthcare data, AI accuracy is not optional. An incorrect pharmacy credential status could lead to:
- Claims processed through non-compliant pharmacies
- Failed CMS network adequacy audits
- Regulatory enforcement actions
- Patient safety risks (prescriptions routed to wrong pharmacy type)

### 13.2 Accuracy Framework

| Guardrail | Implementation | Priority |
|---|---|---|
| **Source-only responses** | All agents query exclusively from verified NCPDP database — no general knowledge, no web searches, no hallucinated data | [P0] |
| **Source citations** | Every data point in an agent response includes the source record ID and last-updated timestamp | [P0] |
| **Confidence scoring** | Agents flag low-confidence answers (ambiguous queries, partial matches) for human review | [P0] |
| **Human-in-the-loop for critical actions** | Compliance reports, credential status changes, and bulk operations require explicit user confirmation before execution | [P0] |
| **Audit trail** | Every agent interaction logged — query, response, data accessed, user, timestamp | [P0] |
| **No creative interpretation** | Agents do not infer, assume, or extrapolate beyond what the data explicitly states. "I don't have that information" is a valid response | [P0] |
| **Data recency warnings** | If the underlying data is older than the tier's freshness SLA, the agent warns the user | [P0] |
| **Feedback loop** | Thumbs up/down on every response, with flagged inaccuracies routed to NCPDP data quality team | [P1] |
| **Automated accuracy testing** | Regular automated tests comparing agent outputs against known-good query results | [P1] |
| **Model evaluation pipeline** | Continuous monitoring of agent accuracy, latency, and user satisfaction metrics | [P1] |

### 13.3 Accuracy Targets

| Metric | Target |
|---|---|
| Factual accuracy (data queries) | 99.9% — every data point must match the source database |
| Query interpretation accuracy | 95%+ — agent correctly understands what the user is asking |
| Harmful/misleading response rate | < 0.01% — near zero tolerance |
| "I don't know" rate | 5-10% — agents should acknowledge limitations rather than guess |

---

## 14. Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **AI accuracy errors** — agents return incorrect pharmacy data with compliance/regulatory consequences | Medium | Critical | Source-only responses, citation requirements, human confirmation for critical actions, continuous accuracy monitoring (see Section 13) |
| R2 | **NCPDP internal resistance** — staff or leadership outside the CTO champion resist change | Medium | High | Early stakeholder mapping, include NCPDP staff in design process, show internal agent benefits (support automation, subscriber insights) |
| R3 | **Data access delays** — difficulty getting access to actual dataQ/resQ data for development and testing | Medium | High | Negotiate data access in the SOW as a prerequisite, create synthetic test data as fallback, start with read-only access |
| R4 | **Integration complexity** — legacy backend systems harder to integrate than expected | Medium | High | Discovery phase includes thorough technical assessment, plan for adapter/wrapper patterns if legacy APIs are limited |
| R5 | **Customer adoption** — PBMs/health plans stick with flat file workflows despite new platform | Medium | Medium | 12-month free Professional upgrade removes cost barrier, Role Starter Kits reduce learning curve, Onboarding Agent guides first-time users |
| R6 | **Scope creep** — NCPDP requests additional features once they see what's possible | High | Medium | Clear scope in SOW, change request process, phased delivery keeps focus, regular priority reviews |
| R7 | **Timeline pressure** — Delivery timeline may be ambitious for the scope | Medium | Medium | Phased agent delivery (1a/1b/1c) creates early wins, core platform prioritized over all 33 agents |
| R8 | **Claude API dependency** — reliance on single AI provider | Low | Medium | Architecture supports model swapping, abstract AI layer, monitor Anthropic's reliability and pricing |
| R9 | **Competitive response** — alternative data providers (LexisNexis, IQVIA) launch similar AI features | Low | Medium | NCPDP's authoritative data position is defensible — competitors can't match the source-of-truth advantage. Speed to market matters. |
| R10 | **Cost management** — project costs exceed initial estimates | Medium | Medium | Fixed-scope SOW with change request process, clear deliverables, regular sprint reviews to catch overruns early |

---

## 15. Success Metrics

> Specific metric targets and measurement timelines will be refined during the Discovery phase based on current baseline data.

### 15.1 Primary KPI

| Metric | Baseline | Target | Target |
|---|---|---|---|
| **Annual data product revenue** | Current baseline | $20M (+25%) | $24M (+50%) |

### 15.2 Supporting KPIs

| # | Metric | Baseline | Target |
|---|---|---|---|
| 1 | Monthly active users on new portal | Current baseline (TBD) | 3x current |
| 2 | Agent interactions per month | 0 | 10,000+ |
| 3 | API adoption rate | <5% | 30% of subscribers |
| 4 | Average revenue per subscriber | Baseline | Increased through tiered model |
| 5 | Customer NPS score | TBD (likely no baseline) | 50+ |
| 6 | Support ticket volume | Current baseline | 40% reduction |
| 7 | Time to generate a report | ~10 minutes (manual) | < 30 seconds (via agents) |
| 8 | Pharmacy profile completeness | ~70% (estimated) | 90% |
| 9 | Tier upgrade conversion rate | N/A | 30% Essential → Professional |
| 10 | New subscriber acquisition | Current baseline | 15% growth |

### 15.3 Measurement Plan

| Metric | Data Source | Frequency |
|---|---|---|
| Revenue | NCPDP billing system | Monthly |
| MAU / engagement | Platform analytics (Datadog/Mixpanel) | Weekly |
| Agent interactions | Agent service logs | Daily |
| API adoption | API Gateway usage metrics | Weekly |
| ARPS | Revenue / subscriber count | Monthly |
| NPS | In-app survey (quarterly) | Quarterly |
| Support tickets | Support ticketing system | Weekly |
| Report generation time | Agent service logs | Continuous |
| Profile completeness | Database analytics | Monthly |
| Tier conversions | CRM / billing system | Monthly |
| New subscribers | CRM | Monthly |

---

## 18. Appendices

### Appendix A: Glossary

| Term | Definition |
|---|---|
| **NCPDP** | National Council for Prescription Drug Programs — ANSI-accredited Standards Development Organization |
| **dataQ** | NCPDP's pharmacy identification and demographics database product |
| **resQ** | NCPDP's pharmacy credentialing resource product |
| **dataQ.ai** | Proposed modernized platform name |
| **NCPDP ID** | Unique identifier assigned to every pharmacy in the US |
| **PBM** | Pharmacy Benefit Manager — manages prescription drug benefits for health plans |
| **FWA** | Fraud, Waste, and Abuse — CMS compliance program |
| **DEA** | Drug Enforcement Administration — issues registrations for controlled substance handling |
| **NPI** | National Provider Identifier — CMS-assigned healthcare provider ID |
| **CMS** | Centers for Medicare & Medicaid Services |
| **42 CFR Part 455** | Federal regulation requiring Medicaid provider screening and credentialing |
| **No Surprises Act** | Federal law protecting patients from unexpected medical bills |
| **HIPAA** | Health Insurance Portability and Accountability Act |
| **SOC 2** | Service Organization Control 2 — security compliance framework |
| **FedRAMP** | Federal Risk and Authorization Management Program — government cloud security standard |
| **SFTP** | Secure File Transfer Protocol — current data delivery method |
| **BAA** | Business Associate Agreement — HIPAA requirement for data handling |
| **MAU** | Monthly Active Users |
| **ARPS** | Average Revenue Per Subscriber |
| **NPS** | Net Promoter Score — customer satisfaction metric |

### Appendix B: Current Portal Page Inventory

| Current Page | Modernized Replacement | Status |
|---|---|---|
| Home (3-column announcements) | Personalized Dashboard with Live Updates, Agent Shortcuts, Alerts Summary | Replace |
| dataQ Files | Cloud Download Center + API access | Replace |
| OnDemand | Natural Language Report Builder | Replace |
| No Surprises Report | No Surprises Assistant (guided workflow) | Replace |
| WebConnect | Smart Search (unified, NL-powered) | Replace |
| Pharmacy Audit | Merged into Smart Search + Advanced Filters | Merge |
| My Preferences | Modern Profile & Settings | Redesign |
| Tools | Admin Dashboard | Redesign |
| Batch Download | Batch Download Optimizer agent + Bulk API | Replace |
| *(New)* Agent Library | — | New |
| *(New)* Analytics Dashboard | — | New |
| *(New)* Alerts Center | — | New |
| *(New)* Role Starter Kits | — | New |

### Appendix C: Competitive Landscape

| Competitor | Pharmacy Data Offering | NCPDP Advantage |
|---|---|---|
| **LexisNexis** | Provider data with pharmacy coverage | NCPDP is the authoritative source — LexisNexis sources from NCPDP |
| **IQVIA** | Pharmacy market data and analytics | Different focus (market intelligence vs. operational data). NCPDP has credentialing data IQVIA doesn't |
| **CMS NPPES (NPI Registry)** | Free NPI lookups | Limited to NPI data only — no credentials, no services, no relationships |
| **State Board Websites** | Individual pharmacy license lookups | Fragmented (50 states), no aggregation, no standardization |
| **Direct pharmacy APIs** | Individual chain pharmacy data | No industry-wide coverage, no standardization |

**NCPDP's defensible moat:** Only source that combines pharmacy identification + demographics + credentialing + network relationships in a single, authoritative, standardized, legally-mandated database. dataQ.ai adds intelligence, automation, and modern delivery on top of this unmatched data asset.

### Appendix D: Agent Catalog Quick Reference

| # | Agent Name | Category | Phase | Priority |
|---|---|---|---|---|
| 1 | NCPDP Buddy | Search & Discovery | 1a | [P0] |
| 2 | Pharmacy Finder | Search & Discovery | 1b | [P0] |
| 3 | Pharmacy Comparison | Search & Discovery | 1c | [P1] |
| 4 | Network Analyzer | Network Management | 1a | [P0] |
| 5 | Change Tracker | Network Management | 1a | [P0] |
| 6 | Network Adequacy | Network Management | 1b | [P1] |
| 7 | Contract Intelligence | Network Management | 1c | [P1] |
| 8 | Formulary-Network Alignment | Network Management | 1c | [P1] |
| 9 | Compliance Watchdog | Compliance & Regulatory | 1a | [P0] |
| 10 | No Surprises Assistant | Compliance & Regulatory | 1b | [P0] |
| 11 | Regulatory Summary | Compliance & Regulatory | 1b | [P1] |
| 12 | FWA Risk Scoring | Compliance & Regulatory | 1c | [P1] |
| 13 | Credential Lifecycle Manager | Compliance & Regulatory | 1b | [P1] |
| 14 | Provider Enrollment Verifier | Compliance & Regulatory | 1c | [P1] |
| 15 | Data Feed Builder | Data Delivery & Integration | 1a | [P0] |
| 16 | Directory Sync | Data Delivery & Integration | 1c | [P1] |
| 17 | E-Prescribing Router | Data Delivery & Integration | 1c | [P2] |
| 18 | Data Quality Reconciler | Data Delivery & Integration | 1c | [P1] |
| 19 | Standards Migration | Data Delivery & Integration | 1c | [P2] |
| 20 | Credentialing Assist | Credentialing (resQ) | 1b | [P0] |
| 21 | Profile Completeness Coach | Credentialing (resQ) | 1b | [P1] |
| 22 | Network Visibility Advisor | Credentialing (resQ) | 1c | [P1] |
| 23 | Pharmacy Desert Alert | Analytics & Prediction | 1c | [P1] |
| 24 | Closure Prediction | Analytics & Prediction | 1c | [P2] |
| 25 | Custom Report Builder | Analytics & Prediction | 1a | [P0] |
| 26 | Claims Routing Optimizer | Claims & Routing | 1c | [P1] |
| 27 | Batch Download Optimizer | Claims & Routing | 1b | [P1] |
| 28 | Support Voice | NCPDP Internal | 1c | [P1] |
| 29 | Subscriber Sentiment | NCPDP Internal | 1c | [P1] |
| 30 | Subscriber Insight | NCPDP Internal | 1c | [P1] |
| 31 | Data Curation | NCPDP Internal | 1c | [P2] |
| 32 | Onboarding Agent | NCPDP Internal | 1b | [P0] |
| 33 | Audit Trail Agent | NCPDP Internal | 1c | [P1] |

---

## Document History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | March 28, 2026 | [Your Firm Name] | Initial draft |

---

*This document is confidential and intended for NCPDP and [Your Firm Name] internal use only.*
