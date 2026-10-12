import { RegulatoryDossier } from '../types';

export const INITIAL_DOSSIERS: RegulatoryDossier[] = [
  {
    id: 'dossier-001',
    dossierNumber: 'NAF/DR/2026/0419',
    directorate: 'DRUG_RR',
    productName: 'Amoxilife-Clav 625mg Tablets',
    genericName: 'Amoxicillin Trihydrate & Potassium Clavulanate',
    dosageForm: '625mg Film-Coated Tablet (Blister pack of 14)',
    applicantName: 'Fidson Healthcare PLC',
    applicantRcNumber: 'RC-104928',
    manufacturerName: 'Fidson Healthcare PLC (Ota Manufacturing Plant)',
    countryOfOrigin: 'Nigeria',
    submissionDate: '2026-10-08T09:15:00.000Z',
    priority: 'EXPEDITED_FAST_TRACK',
    status: 'COMPLIANT',
    complianceScore: 98,
    assignedOfficer: 'Pharm. Chinyere Nwosu (Chief Regulatory Officer)',
    documents: [
      {
        id: 'doc-101',
        name: 'Certificate_of_Analysis_Batch_AMX26.pdf',
        docType: 'CERTIFICATE_OF_ANALYSIS',
        fileSize: '2.4 MB',
        uploadDate: '2026-10-08T09:16:00.000Z',
        isMandatory: true,
        status: 'VERIFIED',
        extractedEntities: {
          issuingAuthority: 'Quality Control Laboratory, Fidson Ota Plant (ISO 17025 Accredited)',
          issueDate: '2026-09-15',
          expiryDate: '2029-09-14',
          batchNumber: 'BN-AMX-2026-09A',
          manufacturerName: 'Fidson Healthcare PLC',
          testedParameters: [
            { parameter: 'Assay (Amoxicillin)', result: '101.4%', specification: '90.0% – 110.0%', status: 'PASS' },
            { parameter: 'Assay (Clavulanate Potassium)', result: '99.8%', specification: '90.0% – 110.0%', status: 'PASS' },
            { parameter: 'Dissolution Rate (Q at 30 min)', result: '92.6%', specification: 'NLT 80%', status: 'PASS' },
            { parameter: 'Disintegration Time', result: '8 mins 40 secs', specification: 'NMT 15 mins', status: 'PASS' },
            { parameter: 'Microbial Limit Test', result: 'Within BP Limits', specification: 'Absence of E. coli & Salmonella', status: 'PASS' }
          ],
          rawTextExcerpt: 'Certificate of Analysis: Product conforms with British Pharmacopoeia (BP 2024) specifications for Finished Dosage Forms.'
        }
      },
      {
        id: 'doc-102',
        name: 'CAC_Certificate_Incorporation.pdf',
        docType: 'CAC_INCORPORATION',
        fileSize: '1.1 MB',
        uploadDate: '2026-10-08T09:16:30.000Z',
        isMandatory: true,
        status: 'VERIFIED',
        extractedEntities: {
          issuingAuthority: 'Corporate Affairs Commission (CAC) Nigeria',
          issueDate: '1995-03-13',
          manufacturerName: 'Fidson Healthcare PLC'
        }
      },
      {
        id: 'doc-103',
        name: 'GMP_Audit_Inspection_Compliance.pdf',
        docType: 'GMP_AUDIT_REPORT',
        fileSize: '4.8 MB',
        uploadDate: '2026-10-08T09:17:00.000Z',
        isMandatory: true,
        status: 'VERIFIED',
        extractedEntities: {
          issuingAuthority: 'NAFDAC Directorate of Regulatory Affairs & GMP Inspections',
          issueDate: '2025-11-20',
          expiryDate: '2027-11-19',
          rawTextExcerpt: 'Manufacturing facility conforms to WHO Good Manufacturing Practices (cGMP) for solid oral dosage formulations.'
        }
      },
      {
        id: 'doc-104',
        name: 'Product_Artwork_Primary_Secondary_Packaging.pdf',
        docType: 'PRODUCT_LABEL_ARTWORK',
        fileSize: '8.2 MB',
        uploadDate: '2026-10-08T09:17:45.000Z',
        isMandatory: true,
        status: 'VERIFIED',
        extractedEntities: {
          rawTextExcerpt: 'Contains active warning: Prescription Only Medicine (PoM). Storage below 25°C in dry conditions.'
        }
      }
    ],
    flags: []
  },
  {
    id: 'dossier-002',
    dossierNumber: 'NAF/DR/2026/0420',
    directorate: 'DRUG_RR',
    productName: 'Tussipen Pediatric Expectorant Syrup 100ml',
    genericName: 'Diphenhydramine HCl, Ammonium Chloride, Sodium Citrate',
    dosageForm: 'Oral Syrup 100ml Amber Bottle',
    applicantName: 'Apex Pharmaceuticals Limited',
    applicantRcNumber: 'RC-384910',
    manufacturerName: 'Apex Formulations Ltd, Kano Industrial Estate',
    countryOfOrigin: 'Nigeria',
    submissionDate: '2026-10-09T11:40:00.000Z',
    priority: 'STANDARD',
    status: 'DEFICIENCY_FLAGGED',
    complianceScore: 61,
    assignedOfficer: 'Dr. Kabir Aliyu (Principal Regulatory Officer)',
    documents: [
      {
        id: 'doc-201',
        name: 'Certificate_of_Analysis_Tussipen.pdf',
        docType: 'CERTIFICATE_OF_ANALYSIS',
        fileSize: '1.8 MB',
        uploadDate: '2026-10-09T11:41:00.000Z',
        isMandatory: true,
        status: 'DISCREPANCY',
        extractedEntities: {
          issuingAuthority: 'In-house Testing Lab, Apex Kano',
          issueDate: '2026-09-02',
          expiryDate: '2028-09-01',
          batchNumber: 'TP-SYR-0926',
          testedParameters: [
            { parameter: 'Diphenhydramine HCl Assay', result: '98.5%', specification: '95.0% – 105.0%', status: 'PASS' },
            { parameter: 'Diethylene Glycol (DEG) / Ethylene Glycol (EG) Screen', result: 'NOT REPORTED', specification: 'NMT 0.10% (Zero Tolerance)', status: 'FAIL' },
            { parameter: 'Heavy Metals Limit', result: 'NOT TESTED', specification: 'NMT 10 ppm', status: 'FAIL' }
          ]
        }
      },
      {
        id: 'doc-202',
        name: 'CAC_Registration_Apex.pdf',
        docType: 'CAC_INCORPORATION',
        fileSize: '890 KB',
        uploadDate: '2026-10-09T11:41:30.000Z',
        isMandatory: true,
        status: 'VERIFIED',
        extractedEntities: {
          issuingAuthority: 'Corporate Affairs Commission',
          issueDate: '2012-08-14'
        }
      },
      {
        id: 'doc-203',
        name: 'Manufacturing_Premises_License.pdf',
        docType: 'MANUFACTURING_LICENSE',
        fileSize: '1.5 MB',
        uploadDate: '2026-10-09T11:42:00.000Z',
        isMandatory: true,
        status: 'EXPIRED',
        extractedEntities: {
          issuingAuthority: 'Pharmacists Council of Nigeria (PCN)',
          expiryDate: '2025-12-31'
        }
      }
    ],
    flags: [
      {
        id: 'flag-201',
        severity: 'CRITICAL',
        category: 'QUALITY_SPECIFICATION',
        title: 'Missing Mandatory Diethylene Glycol (DEG) Contaminant Testing',
        description: 'Under NAFDAC Mandatory Oral Liquid Safety Circular 2023, all oral syrups containing glycerol/propylene glycol must test for Diethylene Glycol (DEG) and Ethylene Glycol (EG). Certificate of Analysis does not report this parameter.',
        citedRegulation: 'NAFDAC Safety Directive Ref: NAF/DIR/P/08/23 (Zero-Tolerance DEG/EG Screening)',
        suggestedAction: 'Require applicant to submit an independent accredited lab CoA certifying DEG/EG < 0.10% w/w.'
      },
      {
        id: 'flag-202',
        severity: 'CRITICAL',
        category: 'EXPIRATION',
        title: 'Manufacturing Premises License Expired',
        description: 'PCN Annual Premises Permit expired on 31st December 2025. Current valid 2026 renewal receipt or certificate is missing.',
        citedRegulation: 'NAFDAC Drug and Related Products Registration Regulations 2021, Sec 3(1)(c)',
        suggestedAction: 'Require applicant to provide valid 2026 PCN Superintendent Pharmacist and Premises License.'
      }
    ]
  },
  {
    id: 'dossier-003',
    dossierNumber: 'NAF/FD/2026/1084',
    directorate: 'FOOD_RR',
    productName: 'Golden Fields Fortified Whole Wheat Flour 5kg',
    genericName: 'Fortified Whole Grain Wheat Flour (Vitamin A & Micronutrients)',
    dosageForm: 'Food Grade Moisture-Barrier Polyethylene Bag (5kg)',
    applicantName: 'Flour Mills of Nigeria PLC',
    applicantRcNumber: 'RC-023910',
    manufacturerName: 'Flour Mills of Nigeria (Apapa Central Mill)',
    countryOfOrigin: 'Nigeria',
    submissionDate: '2026-10-10T14:20:00.000Z',
    priority: 'STANDARD',
    status: 'COMPLIANT',
    complianceScore: 95,
    assignedOfficer: 'Mr. Babatunde Sanusi (Chief Food Safety Officer)',
    documents: [
      {
        id: 'doc-301',
        name: 'CoA_Wheat_Flour_Nutrient_Profile.pdf',
        docType: 'CERTIFICATE_OF_ANALYSIS',
        fileSize: '3.1 MB',
        uploadDate: '2026-10-10T14:21:00.000Z',
        isMandatory: true,
        status: 'VERIFIED',
        extractedEntities: {
          issuingAuthority: 'Central Analytical Laboratory, Flour Mills Apapa',
          batchNumber: 'FMN-WF-26-88',
          testedParameters: [
            { parameter: 'Vitamin A (Retinyl Palmitate)', result: '32,400 IU/kg', specification: 'NLT 30,000 IU/kg', status: 'PASS' },
            { parameter: 'Iron (NaFeEDTA)', result: '42.1 mg/kg', specification: '40.0 – 50.0 mg/kg', status: 'PASS' },
            { parameter: 'Folic Acid', result: '2.6 mg/kg', specification: '2.0 – 3.0 mg/kg', status: 'PASS' },
            { parameter: 'Moisture Content', result: '13.1%', specification: 'NMT 14.5%', status: 'PASS' },
            { parameter: 'Aflatoxin B1', result: '< 2.0 ppb', specification: 'NMT 4.0 ppb', status: 'PASS' }
          ]
        }
      },
      {
        id: 'doc-302',
        name: 'Packaging_Label_Mandatory_Fortification_Eye.pdf',
        docType: 'PRODUCT_LABEL_ARTWORK',
        fileSize: '6.5 MB',
        uploadDate: '2026-10-10T14:22:00.000Z',
        isMandatory: true,
        status: 'VERIFIED',
        extractedEntities: {
          rawTextExcerpt: 'Features National Fortification Logo (Eye with Diamond mark), Best Before date, Net Weight 5kg, and NAFDAC Registration Number placeholder.'
        }
      }
    ],
    flags: []
  },
  {
    id: 'dossier-004',
    dossierNumber: 'NAF/VBM/2026/0291',
    directorate: 'VBM_RR',
    productName: 'SureCheck Malaria Pf/Pan Antigen Rapid Diagnostic Test (RDT)',
    genericName: 'In Vitro Immunochromatographic Diagnostic Device',
    dosageForm: 'Cassette Test Kit (25 Tests/Kit with Buffer & Pipettes)',
    applicantName: 'Biomedix Technologies West Africa Ltd',
    applicantRcNumber: 'RC-772910',
    manufacturerName: 'SD Biosensor Korea Inc. (Suwon Facility)',
    countryOfOrigin: 'South Korea',
    submissionDate: '2026-10-11T16:00:00.000Z',
    priority: 'EXPEDITED_FAST_TRACK',
    status: 'UNDER_OFFICER_REVIEW',
    complianceScore: 89,
    assignedOfficer: 'Dr. Zainab Shehu (Head of Biologics & Medical Devices)',
    documents: [
      {
        id: 'doc-401',
        name: 'WHO_Prequalification_Public_Report.pdf',
        docType: 'FREE_SALE_CERTIFICATE',
        fileSize: '5.6 MB',
        uploadDate: '2026-10-11T16:01:00.000Z',
        isMandatory: true,
        status: 'VERIFIED',
        extractedEntities: {
          issuingAuthority: 'World Health Organization (WHO PQP-IVD)',
          issueDate: '2024-05-18',
          expiryDate: '2027-05-17',
          rawTextExcerpt: 'WHO Prequalified In Vitro Diagnostic (Reference PQDx-0219). Sensitivity > 98.5%, Specificity > 99.0%.'
        }
      },
      {
        id: 'doc-402',
        name: 'Letter_of_Exclusive_Authorization_Nigeria.pdf',
        docType: 'LETTER_OF_AUTHORIZATION',
        fileSize: '1.2 MB',
        uploadDate: '2026-10-11T16:02:00.000Z',
        isMandatory: true,
        status: 'DISCREPANCY',
        extractedEntities: {
          issuingAuthority: 'SD Biosensor Legal Affairs Division, Seoul',
          issueDate: '2023-01-10',
          expiryDate: '2025-12-31'
        }
      }
    ],
    flags: [
      {
        id: 'flag-401',
        severity: 'WARNING',
        category: 'EXPIRATION',
        title: 'Manufacturer Authorization Letter Expired',
        description: 'Manufacturer Power of Attorney / Letter of Exclusive Authorization expired on 31st December 2025. Current notarized renewal covering 2026–2028 is required.',
        citedRegulation: 'NAFDAC Medical Devices Registration Guidelines (Imported Devices), Sec 5(a)',
        suggestedAction: 'Request authenticated and apostilled Manufacturer Authorization extension letter.'
      }
    ]
  }
];
