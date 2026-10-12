# Product Requirements Document (PRD)

## Project Name: ReguScan AI
**Full Title:** Autonomous Regulatory Dossier Vetting & Verification System for NAFDAC  
**Version:** 1.0.0 (Production-Ready Edition)  
**Date:** October 2026  
**Target Agency:** National Agency for Food and Drug Administration and Control (NAFDAC), Federal Republic of Nigeria  
**Challenge Context:** Lagos Business School (LBS) / Nigeria AI Scaling Hub (NAISH) — Sovereign AI Deployment (SAID) Challenge  
**Author / Provider:** Teleiocraft Solutions Limited  

---

## 1. Executive Summary

**ReguScan AI** is an enterprise-grade regulatory intelligence platform engineered specifically for the National Agency for Food and Drug Administration and Control (NAFDAC). The system transforms the end-to-end product registration and dossier vetting process across three statutory directorates:
1. **Drug Registration & Regulatory Affairs (Drug R&R)**
2. **Food Registration & Regulatory Affairs (Food R&R)**
3. **Vaccines, Biologics & Medical Devices (VBM R&R)**

By pairing multimodal optical character recognition (OCR) and large language model parsing (Google Gemini 2.5 Flash) with strict statutory validation rules (British Pharmacopoeia, United States Pharmacopeia, Codex Alimentarius, and Nigerian Industrial Standards), ReguScan AI shortens the manual vetting cycle from **28–45 calendar days down to under 48 hours**. 

Crucially, ReguScan AI preserves **100% human-in-the-loop statutory governance**: AI solely handles automated cross-referencing and deficiency flagging, while authorized NAFDAC Regulatory Officers retain sovereign authority to grant formal registration numbers or dispatch statutory 30-day query notices under an immutable **Nigeria Data Protection Act (NDPA 2023)** audit trail.

---

## 2. Problem Statement & Statutory Mandate

### 2.1 The Current Operational Bottleneck
Under the **NAFDAC Act Cap N1 LFN 2004** and the **Food, Drugs and Related Products (Registration, etc.) Act**, every consumable, pharmaceutical, biologic, or medical device commercialized in Nigeria must undergo technical dossier evaluation before receiving a NAFDAC Registration Number.

Today, this process faces severe structural headwinds:
* **Massive Paperwork & Fragmentation:** Each dossier consists of 5 to 25 disparate technical documents (Quality Control Certificates of Analysis, CAC incorporation certificates, GMP inspection reports, packaging artwork, manufacturing licenses, stability data).
* **Extended Turnaround Times (TAT):** Manual cross-checking of batch numbers, manufacturer names, and chemical assay limits takes an average of 28 to 45 days per submission.
* **Toxic Contaminants & Public Health Risk:** Following global incidents of contaminated pediatric syrups (e.g., Diethylene Glycol and Ethylene Glycol poisoning), NAFDAC issued zero-tolerance directives. Manual inspection risks human error in detecting missing or uncertified excipient contaminant screens.
* **Backlogs & Economic Friction:** Delays in product approvals stifle domestic pharmaceutical industrialization, food security fortification mandates, and emergency health product access.

### 2.2 The Solution
ReguScan AI provides a **dual-space, role-based architecture** backed by cloud persistence (Supabase PostgreSQL + Storage) and multimodal AI to parse, cross-reference, and audit regulatory submissions automatically.

---

## 3. Goals & Key Performance Indicators (KPIs)

| Objective | Baseline (Manual Process) | Target with ReguScan AI |
| :--- | :--- | :--- |
| **Mean Dossier Vetting Cycle** | 28 – 45 Days | **< 48 Hours** (80–95% reduction) |
| **Document Completeness Checks** | 4 – 7 Days | **Instantaneous (< 10 seconds)** |
| **Excipient Contaminant (DEG/EG) Detection** | Prone to manual oversight | **100% Zero-Tolerance Automated Flagging** |
| **Statutory Query Letter Drafting** | 3 – 5 Days manual drafting | **One-Click Auto-Drafting (< 5 seconds)** |
| **Audit Traceability & Integrity** | Paper logbooks / fragmented spreadsheets | **100% SHA-256 Event Logging (NDPA 2023)** |

---

## 4. User Personas & Role-Based Access Control (RBAC)

The platform enforces strict separation between internal NAFDAC officers and external corporate applicants.

```
                                  ┌─────────────────────────────┐
                                  │   Intelligent Auth Portal   │
                                  └──────────────┬──────────────┘
                                                 │
                          ┌──────────────────────┴──────────────────────┐
                          ▼                                             ▼
            [@nafdac.gov.ng / Staff ID]                   [Corporate / Manufacturer Email]
     ┌──────────────────────────────────────┐     ┌───────────────────────────────────────────┐
     │  NAFDAC Regulatory Officer Space     │     │    Applicant Manufacturer Space           │
     ├──────────────────────────────────────┤     ├───────────────────────────────────────────┤
     │ • Cross-company national queue       │     │ • Private single-company portfolio        │
     │ • High-res OCR Canvas & Bounding Box │     │ • "+ Submit New Product Dossier" Wizard   │
     │ • Pharmacopoeial chemical validation │     │ • Official Certificate of Registration    │
     │ • Statutory approval / query station │     │ • 30-Day Query Response & Remedy Upload   │
     │ • Cryptographic audit ledger (NDPA)  │     │ • Real-time status tracker (In Review)    │
     └──────────────────────────────────────┘     └───────────────────────────────────────────┘
```

### Persona A: Authorized Regulatory Officer (Internal Staff)
* **Example:** *Pharm. Chinyere Nwosu, Chief Regulatory Officer (Drug R&R Directorate)*
* **Needs:** View all queued submissions across companies, inspect uploaded certificates with high resolution, compare laboratory assays against British Pharmacopoeia specifications, issue formal approvals with automatic NAFDAC number issuance, or dispatch deficiency queries.

### Persona B: Licensed Manufacturer / Importer (External Applicant)
* **Example:** *Dr. Olumide Johnson, Superintendent Pharmacist at Fidson Healthcare PLC (RC-104928)*
* **Needs:** Log into a private corporate dashboard, submit new product dossiers with mandatory document checklists, track vetting status in real-time, view/download official NAFDAC Registration Certificates, and submit rectified documents when queries are received.

---

## 5. System Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PRESENTATION LAYER                     │
│   • React 19 + TypeScript + Vite 6                                     │
│   • Tailwind CSS (Institutional Slate Blue #0f172a / Sovereign Theme)   │
│   • Lucide React Icons + Responsive Mobile-to-Desktop Layout           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                         INTELLIGENCE & AI LAYER                        │
│   • Google Gemini 2.5 Flash API (Multimodal Document OCR & NER)       │
│   • Dynamic Rule Engine: British Pharmacopoeia & Codex Alimentarius     │
│   • In-App AI Engine Configuration & Connectivity Tester               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                     DATABASE & STORAGE LAYER (SUPABASE)                │
│   • Supabase PostgreSQL (Profiles, Dossiers, Documents, Flags, Logs)  │
│   • Supabase Storage (Bucket: dossier-files for PDFs/Certificates)     │
│   • Row-Level Security (RLS) Policies Enforcing Role Isolation         │
│   • Local Storage High-Availability Fallback Mode                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Functional Requirements (FR)

### FR-1: Intelligent Single Authentication Gateway
* **FR-1.1:** A single login page (`IntelligentAuthPortal`) serves both NAFDAC staff and corporate applicants.
* **FR-1.2:** Dynamic email domain intelligence:
  * Typing `@nafdac.gov.ng` or prefix `naf-` automatically illuminates the **NAFDAC Staff Vetting Workstation** indicator.
  * Typing any manufacturer corporate domain (`@fidson.com`, `@flourmillsng.com`, etc.) automatically illuminates the **Applicant Manufacturer** indicator.
* **FR-1.3:** Built-in **1-Click Evaluator Personas** for reviewers, pitching judges, and demo evaluators:
  * *Pharm. Chinyere Nwosu* (NAFDAC Chief Officer, Drug R&R)
  * *Fidson Healthcare PLC* (Pharmaceutical Applicant, RC-104928)
  * *Flour Mills of Nigeria PLC* (Food Manufacturer, RC-023910)
* **FR-1.4:** Corporate Registration tab enabling new applicants to register their Legal Name, CAC RC Number, Superintendent Pharmacist, and corporate email.

### FR-2: Dedicated Applicant Manufacturer Workspace
* **FR-2.1:** Private company view filtered exclusively to the logged-in company’s products.
* **FR-2.2:** Real-time KPI summary: Total Filed Dossiers, Registered Products, Under Technical Vetting, and Deficiency Queries Received.
* **FR-2.3:** Live Status Table tracking every submitted product with directorate tags, file counts, and action triggers.
* **FR-2.4:** **Official Certificate of Registration Modal:** For approved dossiers, displays an authentic green-and-gold NAFDAC Certificate of Product Registration featuring the generated NAFDAC number and simulated Director-General sign-off.
* **FR-2.5:** **30-Day Deficiency Remedy Portal:** For queried dossiers, enables the company to review cited non-compliance clauses, upload replacement/rectified certificates (e.g., DEG/EG screening CoA, renewed premises license), and submit technical notes directly to the assigned officer.

### FR-3: Multi-Step Product Dossier Submission Wizard
* **FR-3.1:** Step 1: Directorate selection (`Drug R&R`, `Food R&R`, `VBM R&R`) + Commercial Brand Name, Active API / Chemical Formula, Dosage Form, and Packaging Unit.
* **FR-3.2:** Step 2: Drag-and-drop document intake supporting PDF, DOCX, PNG, JPG (up to 25 MB each) with mandatory document classification (CoA, CAC Incorporation, GMP Audit, Artwork).
* **FR-3.3:** Step 3: Automated submission into NAFDAC's active vetting queue with instantaneous dossier reference generation (`NAF/DR/2026/0XXX`).

### FR-4: Multimodal AI Parsing & Chemical Validation Engine
* **FR-4.1:** Automated extraction of critical metadata from uploaded certificates:
  * Issuing Laboratory Authority & ISO Accreditation status
  * Batch Number, Manufacturing Date, Expiration / Retest Date
  * Manufacturer entity vs. Applicant entity cross-referencing
* **FR-4.2:** **Analytical Assay Table Verification:**
  * Compares Found Result against Pharmacopoeial Specification limits (e.g., Amoxicillin 90.0%–110.0%, Paracetamol 95.0%–105.0%, Vitamin A fortification limits).
  * Automatically tags parameters as **PASS** or **DEFICIENT**.
* **FR-4.3:** **Zero-Tolerance Contaminant Screening:** Explicitly scans oral liquid excipients (glycerol, propylene glycol) for mandatory Diethylene Glycol (DEG) / Ethylene Glycol (EG) limit testing (< 0.10%). Automatically flags critical deficiency if omitted.

### FR-5: Visual Document Canvas with Interactive OCR Bounding Boxes
* **FR-5.1:** High-resolution simulated scanned certificate rendering with official security watermarks.
* **FR-5.2:** Zoom toolbar supporting 75% to 130% magnification.
* **FR-5.3:** Interactive OCR bounding layer highlighting key extracted entities on hover (Applicant Entity, Product Formulation, Tested Batch Reference, Laboratory Seal).

### FR-6: NAFDAC Officer Vetting Station & Statutory Decision Terminal
* **FR-6.1:** Comprehensive queue across all manufacturers operating in Nigeria.
* **FR-6.2:** Filters by Directorate (`Drug R&R`, `Food R&R`, `VBM R&R`) and compliance status (`Verified Compliant`, `Deficiency Flagged`, `Under Review`, `Approved`).
* **FR-6.3:** **Officer Decision Station:**
  * **Grant Regulatory Approval:** Authorizes the registration and issues a formal NAFDAC Registration Number formatted according to statutory coding (e.g., `04-8291` for drugs, `01-XXXX` for foods).
  * **Auto-Draft Official Query Notice:** Extracts all detected non-compliance flags and compiles an official 30-day statutory notice.
  * **Reject Dossier:** Declines registration for critical, un-remediated safety violations.

### FR-7: Automated 30-Day Regulatory Deficiency Notice Generator
* **FR-7.1:** Automatically formats an institutional letterhead notice:
  * Official Reference: `NAFDAC/R&R/DEF/[Dossier-Number]`
  * Addressed to: The Managing Director of the applicant company
  * Statutory Deadline: Calculated exactly 30 calendar days from generation date
* **FR-7.2:** Enumerates specific deficiency clauses, cited regulations (e.g., *NAFDAC Safety Directive Ref: NAF/DIR/P/08/23*), and required remediation actions.

### FR-8: NDPA 2023 Cryptographic Audit Trail
* **FR-8.1:** Every officer decision (inspection opened, assay verified, query dispatched, approval granted) is logged.
* **FR-8.2:** Each event record includes a unique Audit ID, ISO timestamp, officer identity, target dossier, statutory clause, and a cryptographic **SHA-256 hash** to prevent tampering or corruption.

---

## 7. Data Models & Database Architecture (Supabase)

### 7.1 Entity Relationship Model
```
┌─────────────────┐       1:N       ┌─────────────────────┐
│    profiles     ├────────────────►│      dossiers       │
└─────────────────┘                 └──────────┬──────────┘
                                               │
                          ┌────────────────────┼────────────────────┐
                      1:N │                1:N │                1:N │
                          ▼                    ▼                    ▼
                ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
                │ dossier_documents│ │ compliance_flags │ │    audit_logs    │
                └──────────────────┘ └──────────────────┘ └──────────────────┘
```

### 7.2 Core Tables Summary
* **`profiles`**: User ID, email, full name, role (`NAFDAC_OFFICER` vs `APPLICANT_COMPANY`), organization name, CAC RC number, directorate.
* **`dossiers`**: Dossier ID, dossier number, directorate, product name, generic formula, applicant details, status, compliance score, officer decisions (JSONB).
* **`dossier_documents`**: Document ID, foreign key to dossier, doc type, file size, storage URL, extracted entities (JSONB including chemical assay tables).
* **`compliance_flags`**: Flag ID, foreign key to dossier, severity (`CRITICAL`, `WARNING`), category, cited regulation, remediation remedy, resolution status.
* **`audit_logs`**: Immutable ledger with event timestamps, officer IDs, action descriptions, and SHA-256 integrity proofs.
* **`dossier-files` (Storage Bucket)**: Cloud storage bucket for submitted technical dossiers and laboratory certificates.

---

## 8. Non-Functional Requirements (NFR)

* **NFR-1 Performance & Latency:**
  * Initial page load: `< 1.2s` on 3G/4G Nigerian mobile and broadband networks.
  * AI extraction & verification: `< 3.5s` per multi-page document using Google Gemini 2.5 Flash.
  * Search and filter responsiveness: `< 50ms` on queues exceeding 1,000 dossiers.
* **NFR-2 Security & Data Sovereignty:**
  * **NDPA 2023 Compliance:** Strict privacy preservation of applicant proprietary chemical formulations and corporate trade secrets.
  * **Zero Hardcoded Secrets:** Dual-mode key security; API keys can be supplied via environment variables (`VITE_GEMINI_API_KEY`, `VITE_SUPABASE_URL`) or entered directly into the browser session.
* **NFR-3 Reliability & Offline Resilience:**
  * The application includes an automated fallback persistence engine: if Supabase connectivity is unconfigured or temporarily interrupted, the system automatically runs on local cache without throwing uncaught errors or blank screens.
* **NFR-4 Visual & UI Standards:**
  * Professional institutional aesthetic: Slate Navy (`#0f172a`), deep blues, pure white workspaces, 1px hairline borders.
  * Zero distracting animations, no frivolous gradients, strict adherence to government software standards.

---

## 9. Authentic Nigerian Regulatory Dossier Seeds

ReguScan AI includes authentic multi-directorate test cases reflecting current Nigerian market challenges:

1. **Drug R&R — *Amoxilife-Clav 625mg Tablets* (Fidson Healthcare PLC, RC-104928):**
   * *Status:* 98% Verified Compliant.
   * *Assay:* Amoxicillin 101.4% (Pass), Clavulanic Acid 99.8% (Pass).
2. **Drug R&R — *Tussipen Pediatric Syrup 100ml* (Apex Pharmaceuticals, RC-384910):**
   * *Status:* Deficiency Flagged (61% Score).
   * *Critical Violations:* Diethylene Glycol (DEG) / Ethylene Glycol screen omitted; PCN Premises Permit expired.
3. **Food R&R — *Golden Fields Fortified Wheat Flour 5kg* (Flour Mills of Nigeria, RC-023910):**
   * *Status:* 95% Verified Compliant.
   * *Micronutrients:* Vitamin A (Retinyl Palmitate) 32,400 IU/kg (Pass), Iron 42.1 mg/kg (Pass).
4. **VBM R&R — *SureCheck Malaria Pf/Pan Rapid Diagnostic Test* (Biomedix / SD Biosensor Korea):**
   * *Status:* Under Review (89% Score).
   * *Discrepancy:* WHO Prequalification matched; Foreign Manufacturer Power of Attorney expired.
5. **Drug R&R — *Yoyo Bitters Herbal Cleanser Extract 200ml* (Abllat Healthcare, RC-512903):**
   * *Status:* 94% Verified Compliant.
   * *Toxicology:* NIPRD acute toxicity LD50 > 5,000 mg/kg; Lead (Pb) < 0.05 ppm (Pass).

---

## 10. SAID / NAISH Challenge Alignment Matrix

| Challenge Requirement | ReguScan AI Implementation |
| :--- | :--- |
| **Document Vetting and Registration Solution** | End-to-end multimodal intake, parsing, and verification across Drug R&R, Food R&R, and VBM R&R. |
| **Sovereign Regulatory Alignment** | Programmed against British Pharmacopoeia (BP 2024), Codex Alimentarius, and NAFDAC Safety Directives. |
| **Human-in-the-Loop Governance** | Statutory decisions (Registration number issuance or query notice dispatch) are strictly executed by Authorized Officers. |
| **Enterprise Feasibility & Scalability** | Decoupled client-side React 19 architecture backed by Supabase PostgreSQL and scalable Gemini AI models. |
| **National Data Security** | Adherence to the Nigeria Data Protection Act (NDPA 2023) with cryptographic SHA-256 audit logs. |

---

## 11. Release & Deployment Metadata

* **Repository:** [https://github.com/Teleiosite/Reguscan-ai](https://github.com/Teleiosite/Reguscan-ai)
* **Production URL:** [https://reguscan-ai.vercel.app](https://reguscan-ai.vercel.app)
* **Vite Production Bundle:** `dist/assets/index-Ch7uli_y.js` (Zero compilation errors)
* **Database Target:** Supabase PostgreSQL (Migration: `supabase/schema.sql`)
* **License:** Institutional Proprietary for NAFDAC / Teleiocraft Solutions Limited
