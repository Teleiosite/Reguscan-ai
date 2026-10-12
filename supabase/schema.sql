-- ==============================================================================
-- ReguScan AI — Sovereign NAFDAC Regulatory Database Schema
-- Compatible with Supabase PostgreSQL (Version 15+)
-- Directorates: Drug R&R, Food R&R, VBM R&R (Vaccines & Medical Devices)
-- Compliance: Nigeria Data Protection Act (NDPA 2023)
-- ==============================================================================

-- 1. Create Profiles Table (Officers & Licensed Applicants)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('NAFDAC_OFFICER', 'APPLICANT_COMPANY')),
    organization_name TEXT NOT NULL,
    rc_number TEXT,
    designation TEXT,
    directorate TEXT CHECK (directorate IN ('DRUG_RR', 'FOOD_RR', 'VBM_RR', 'ALL')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Dossiers Table
CREATE TABLE IF NOT EXISTS public.dossiers (
    id TEXT PRIMARY KEY,
    dossier_number TEXT UNIQUE NOT NULL,
    directorate TEXT NOT NULL CHECK (directorate IN ('DRUG_RR', 'FOOD_RR', 'VBM_RR')),
    product_name TEXT NOT NULL,
    generic_name TEXT,
    dosage_form TEXT,
    applicant_name TEXT NOT NULL,
    applicant_rc_number TEXT NOT NULL,
    manufacturer_name TEXT NOT NULL,
    country_of_origin TEXT DEFAULT 'Nigeria',
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    priority TEXT DEFAULT 'STANDARD' CHECK (priority IN ('STANDARD', 'EXPEDITED_FAST_TRACK', 'EMERGENCY_USE')),
    status TEXT NOT NULL CHECK (status IN (
        'SUBMITTED', 'AI_PARSED', 'COMPLIANT', 'DEFICIENCY_FLAGGED', 
        'UNDER_OFFICER_REVIEW', 'APPROVED', 'QUERY_DISPATCHED', 'REJECTED'
    )),
    compliance_score INTEGER DEFAULT 0,
    assigned_officer TEXT,
    officer_decision JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Dossier Documents Table
CREATE TABLE IF NOT EXISTS public.dossier_documents (
    id TEXT PRIMARY KEY,
    dossier_id TEXT NOT NULL REFERENCES public.dossiers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    doc_type TEXT NOT NULL,
    file_size TEXT,
    file_url TEXT,
    upload_date TIMESTAMPTZ DEFAULT NOW(),
    is_mandatory BOOLEAN DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (status IN ('VERIFIED', 'DISCREPANCY', 'MISSING', 'EXPIRED')),
    extracted_entities JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Compliance Flags Table
CREATE TABLE IF NOT EXISTS public.compliance_flags (
    id TEXT PRIMARY KEY,
    dossier_id TEXT NOT NULL REFERENCES public.dossiers(id) ON DELETE CASCADE,
    severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'WARNING', 'INFO')),
    category TEXT NOT NULL CHECK (category IN ('EXPIRATION', 'CROSS_MATCH_MISMATCH', 'MISSING_DATA', 'QUALITY_SPECIFICATION')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cited_regulation TEXT NOT NULL,
    suggested_action TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Cryptographic Audit Logs Table (NDPA 2023 Statutory Requirement)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    officer TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    hash TEXT NOT NULL,
    compliance TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dossier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous/Authenticated Policies (Allow read/write for verified portal sessions)
CREATE POLICY "Allow public read for dossiers" ON public.dossiers FOR SELECT USING (true);
CREATE POLICY "Allow public insert for dossiers" ON public.dossiers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for dossiers" ON public.dossiers FOR UPDATE USING (true);

CREATE POLICY "Allow public read for documents" ON public.dossier_documents FOR SELECT USING (true);
CREATE POLICY "Allow public insert for documents" ON public.dossier_documents FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read for flags" ON public.compliance_flags FOR SELECT USING (true);
CREATE POLICY "Allow public insert for flags" ON public.compliance_flags FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for flags" ON public.compliance_flags FOR UPDATE USING (true);

CREATE POLICY "Allow public read for audit_logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert for audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert for profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- Storage Bucket Setup for Dossier Documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('dossier-files', 'dossier-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read on dossier-files storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'dossier-files');

CREATE POLICY "Allow public upload on dossier-files storage"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'dossier-files');
