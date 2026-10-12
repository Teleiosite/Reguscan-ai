import { RegulatoryDossier, ComplianceFlag, QueryLetterTemplate } from '../types';

export const vettingEngine = {
  // Re-calculate compliance score based on present documents and flags
  calculateComplianceScore: (dossier: RegulatoryDossier): number => {
    let score = 100;

    // Check mandatory documents
    const mandatoryDocs = dossier.documents.filter(d => d.isMandatory);
    const verifiedDocs = mandatoryDocs.filter(d => d.status === 'VERIFIED');
    const docRatio = mandatoryDocs.length > 0 ? verifiedDocs.length / mandatoryDocs.length : 1;

    score = Math.round(docRatio * 60); // 60% of score comes from mandatory doc presence

    // Deduct for flags
    dossier.flags.forEach(flag => {
      if (flag.severity === 'CRITICAL') score -= 25;
      else if (flag.severity === 'WARNING') score -= 10;
      else if (flag.severity === 'INFO') score -= 5;
    });

    return Math.max(0, Math.min(100, score));
  },

  // Generate an official NAFDAC Deficiency Query Letter
  generateQueryLetter: (
    dossier: RegulatoryDossier,
    officerName: string = 'Pharm. Chinyere Nwosu',
    officerDesignation: string = 'Chief Regulatory Officer, Directorate of Registration & Regulatory Affairs'
  ): QueryLetterTemplate => {
    const today = new Date();
    const deadline = new Date(today);
    deadline.setDate(deadline.getDate() + 30); // 30 calendar days

    const deficiencies = dossier.flags.map(f => ({
      title: f.title,
      clause: f.citedRegulation,
      remedy: f.suggestedAction
    }));

    return {
      dossierNumber: dossier.dossierNumber,
      applicantName: dossier.applicantName,
      productName: dossier.productName,
      date: today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      deadlineDate: deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      deficiencies,
      officerName,
      officerDesignation
    };
  },

  // Generate a mock official NAFDAC Registration Number upon approval
  generateNafdacNumber: (dossier: RegulatoryDossier): string => {
    const prefix = dossier.directorate === 'DRUG_RR' ? '04' : dossier.directorate === 'FOOD_RR' ? '01' : '03';
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randDigits}`;
  }
};
