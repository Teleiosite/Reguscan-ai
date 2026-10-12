// ReguScan AI - NAFDAC Regulatory Types & Interfaces

export type Directorate = 'DRUG_RR' | 'FOOD_RR' | 'VBM_RR';

export const DIRECTORATE_LABELS: Record<Directorate, { title: string; subtitle: string; code: string }> = {
  DRUG_RR: {
    title: 'Drug Registration & Regulatory Affairs',
    subtitle: 'Human & Veterinary Pharmaceuticals, Active Pharmaceutical Ingredients (APIs)',
    code: 'DRUG-RR'
  },
  FOOD_RR: {
    title: 'Food Registration & Regulatory Affairs',
    subtitle: 'Packaged Foods, Beverages, Nutrients & Agricultural Inputs',
    code: 'FOOD-RR'
  },
  VBM_RR: {
    title: 'Vaccines, Biologics & Medical Devices',
    subtitle: 'In Vitro Diagnostics, Implants, Biopharmaceuticals & Vaccines',
    code: 'VBM-RR'
  }
};

export type DossierStatus =
  | 'SUBMITTED'
  | 'AI_PARSED'
  | 'COMPLIANT'
  | 'DEFICIENCY_FLAGGED'
  | 'UNDER_OFFICER_REVIEW'
  | 'APPROVED'
  | 'QUERY_DISPATCHED'
  | 'REJECTED';

export type DocumentType =
  | 'CERTIFICATE_OF_ANALYSIS'
  | 'CERTIFICATE_OF_PHARMACEUTICAL_PRODUCT'
  | 'CAC_INCORPORATION'
  | 'MANUFACTURING_LICENSE'
  | 'GMP_AUDIT_REPORT'
  | 'PRODUCT_LABEL_ARTWORK'
  | 'LETTER_OF_AUTHORIZATION'
  | 'SUPERVISING_PHARMACIST_ANNUAL_PERMIT'
  | 'STABILITY_TESTING_DATA'
  | 'FREE_SALE_CERTIFICATE';

export interface DossierDocument {
  id: string;
  name: string;
  docType: DocumentType;
  fileSize: string;
  uploadDate: string;
  isMandatory: boolean;
  status: 'VERIFIED' | 'DISCREPANCY' | 'MISSING' | 'EXPIRED';
  extractedEntities: {
    issuingAuthority?: string;
    issueDate?: string;
    expiryDate?: string;
    batchNumber?: string;
    manufacturerName?: string;
    testedParameters?: Array<{ parameter: string; result: string; specification: string; status: 'PASS' | 'FAIL' }>;
    rawTextExcerpt?: string;
  };
}

export interface ComplianceFlag {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'EXPIRATION' | 'CROSS_MATCH_MISMATCH' | 'MISSING_DATA' | 'QUALITY_SPECIFICATION';
  title: string;
  description: string;
  citedRegulation: string;
  suggestedAction: string;
  resolved?: boolean;
}

export interface RegulatoryDossier {
  id: string;
  dossierNumber: string; // e.g., NAF/DR/2026/0419
  directorate: Directorate;
  productName: string;
  genericName?: string;
  dosageForm?: string; // e.g., 500mg Film-Coated Tablet
  applicantName: string;
  applicantRcNumber: string;
  manufacturerName: string;
  countryOfOrigin: string;
  submissionDate: string;
  priority: 'STANDARD' | 'EXPEDITED_FAST_TRACK' | 'EMERGENCY_USE';
  status: DossierStatus;
  complianceScore: number; // 0 - 100
  documents: DossierDocument[];
  flags: ComplianceFlag[];
  assignedOfficer?: string;
  officerDecision?: {
    action: 'APPROVED' | 'QUERIED' | 'REJECTED';
    officerName: string;
    decidedAt: string;
    officialComments: string;
    generatedNaFDACNumber?: string;
    queryDeadline?: string;
  };
}

// User & Session Types for ReguScan AI
export interface ReguScanUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'VETTING_OFFICER' | 'DIRECTOR' | 'APPLICANT';
  directorate: Directorate | 'ALL';
  organization: string;
}

export interface QueryLetterTemplate {
  dossierNumber: string;
  applicantName: string;
  productName: string;
  date: string;
  deadlineDate: string;
  deficiencies: Array<{ title: string; clause: string; remedy: string }>;
  officerName: string;
  officerDesignation: string;
}
