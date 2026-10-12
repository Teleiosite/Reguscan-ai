import React, { useState } from 'react';
import {
  RegulatoryDossier,
  DossierDocument,
  ComplianceFlag,
  QueryLetterTemplate,
  DIRECTORATE_LABELS
} from '../types';
import { vettingEngine } from '../services/vettingEngine';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Calendar,
  ShieldCheck,
  Send,
  XCircle,
  FileCheck2,
  Download,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

import { DocumentViewerCanvas } from './DocumentViewerCanvas';

interface DossierInspectionViewProps {
  dossier: RegulatoryDossier;
  onBack: () => void;
  onUpdateDossier: (updated: RegulatoryDossier) => void;
}

export const DossierInspectionView: React.FC<DossierInspectionViewProps> = ({
  dossier,
  onBack,
  onUpdateDossier
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    dossier.documents[0]?.id || ''
  );
  const [docViewMode, setDocViewMode] = useState<'CANVAS' | 'EXTRACTED'>('CANVAS');
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [queryLetter, setQueryLetter] = useState<QueryLetterTemplate | null>(null);
  const [officerNote, setOfficerNote] = useState('');
  const [decisionSuccess, setDecisionSuccess] = useState<string | null>(null);

  const selectedDoc = dossier.documents.find(d => d.id === selectedDocId) || dossier.documents[0];
  const dirInfo = DIRECTORATE_LABELS[dossier.directorate];

  // Officer Action Handlers
  const handleApprove = () => {
    const nafdacNumber = vettingEngine.generateNafdacNumber(dossier);
    const updated: RegulatoryDossier = {
      ...dossier,
      status: 'APPROVED',
      officerDecision: {
        action: 'APPROVED',
        officerName: 'Pharm. Chinyere Nwosu',
        decidedAt: new Date().toISOString(),
        officialComments: officerNote || 'Full regulatory vetting completed. Documents comply with Good Manufacturing Practice and Finished Product Specifications.',
        generatedNaFDACNumber: nafdacNumber
      }
    };
    onUpdateDossier(updated);
    setDecisionSuccess(`Dossier Approved! NAFDAC Registration Number issued: ${nafdacNumber}`);
  };

  const handleOpenQueryModal = () => {
    const letter = vettingEngine.generateQueryLetter(dossier);
    setQueryLetter(letter);
    setIsQueryModalOpen(true);
  };

  const handleDispatchQuery = () => {
    const updated: RegulatoryDossier = {
      ...dossier,
      status: 'QUERY_DISPATCHED',
      officerDecision: {
        action: 'QUERIED',
        officerName: 'Pharm. Chinyere Nwosu',
        decidedAt: new Date().toISOString(),
        officialComments: officerNote || 'Regulatory compliance query dispatched to applicant with 30-day remediation timeline.',
        queryDeadline: queryLetter?.deadlineDate
      }
    };
    onUpdateDossier(updated);
    setIsQueryModalOpen(false);
    setDecisionSuccess('Deficiency Query Letter dispatched to applicant via NAFDAC Portal and WhatsApp notification.');
  };

  const handleReject = () => {
    const updated: RegulatoryDossier = {
      ...dossier,
      status: 'REJECTED',
      officerDecision: {
        action: 'REJECTED',
        officerName: 'Pharm. Chinyere Nwosu',
        decidedAt: new Date().toISOString(),
        officialComments: officerNote || 'Registration declined due to failure to meet critical NAFDAC safety criteria.'
      }
    };
    onUpdateDossier(updated);
    setDecisionSuccess('Application formally declined with regulatory audit record preserved.');
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-700">
                {dossier.dossierNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                {dirInfo.code}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                dossier.status === 'APPROVED' ? 'bg-slate-900 text-white' :
                dossier.status === 'COMPLIANT' ? 'bg-emerald-100 text-emerald-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {dossier.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              {dossier.productName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">AI Compliance Index</span>
            <span className={`text-xl font-extrabold font-mono ${
              dossier.complianceScore >= 90 ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {dossier.complianceScore}% Verified
            </span>
          </div>
        </div>
      </div>

      {decisionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            <span>{decisionSuccess}</span>
          </div>
          <button onClick={() => setDecisionSuccess(null)} className="text-emerald-700 underline text-xs">Dismiss</button>
        </div>
      )}

      {/* Main Split-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE (Submitted Dossier Documents & High-Res Inspection Viewer) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} className="text-blue-600" />
              <span>Dossier Repository ({dossier.documents.length} Files)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Applicant: {dossier.applicantName}
            </span>
          </div>

          {/* Document Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-100/60 p-1.5 gap-1.5">
            {dossier.documents.map(doc => {
              const isSelected = doc.id === selectedDocId;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-blue-700 font-bold border border-slate-200 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {doc.status === 'VERIFIED' ? (
                    <CheckCircle2 size={13} className="text-emerald-700" />
                  ) : (
                    <AlertTriangle size={13} className="text-amber-700" />
                  )}
                  <span className="truncate max-w-[140px]">{doc.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Document Inspection Window */}
          {selectedDoc && (
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedDoc.name}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Type: <span className="font-semibold text-slate-700">{selectedDoc.docType.replace(/_/g, ' ')}</span> • Size: {selectedDoc.fileSize}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex">
                    <button
                      onClick={() => setDocViewMode('CANVAS')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        docViewMode === 'CANVAS'
                          ? 'bg-white text-blue-700 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Visual Canvas (OCR)
                    </button>
                    <button
                      onClick={() => setDocViewMode('EXTRACTED')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        docViewMode === 'EXTRACTED'
                          ? 'bg-white text-blue-700 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Extracted Data
                    </button>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    selectedDoc.status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {selectedDoc.status}
                  </span>
                </div>
              </div>

              {/* View 1: High-Res Scanned Regulatory Certificate Canvas with OCR bounding highlights */}
              {docViewMode === 'CANVAS' && (
                <DocumentViewerCanvas
                  document={selectedDoc}
                  productName={dossier.productName}
                  applicantName={dossier.applicantName}
                />
              )}

              {/* View 2: Extracted Entity Summary Box */}
              {docViewMode === 'EXTRACTED' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-blue-600" />
                  <span>AI Extracted Document Metadata</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {selectedDoc.extractedEntities.issuingAuthority && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Issuing Authority</span>
                      <span className="text-slate-800 font-medium">{selectedDoc.extractedEntities.issuingAuthority}</span>
                    </div>
                  )}
                  {selectedDoc.extractedEntities.batchNumber && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tested Batch #</span>
                      <span className="text-slate-900 font-bold font-mono">{selectedDoc.extractedEntities.batchNumber}</span>
                    </div>
                  )}
                  {selectedDoc.extractedEntities.issueDate && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Issue Date</span>
                      <span className="text-slate-800">{selectedDoc.extractedEntities.issueDate}</span>
                    </div>
                  )}
                  {selectedDoc.extractedEntities.expiryDate && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Expiry / Validity</span>
                      <span className="text-slate-800 font-mono">{selectedDoc.extractedEntities.expiryDate}</span>
                    </div>
                  )}
                </div>

                {/* Lab Parameter Comparison Table (if Certificate of Analysis) */}
                {selectedDoc.extractedEntities.testedParameters && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-700 block mb-2">
                      Laboratory Chemical Specification Checks:
                    </span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-200/70 text-slate-700 font-semibold text-[10px] uppercase">
                          <tr>
                            <th className="py-1.5 px-2.5">Parameter</th>
                            <th className="py-1.5 px-2.5">Found Result</th>
                            <th className="py-1.5 px-2.5">NAFDAC / BP Specification</th>
                            <th className="py-1.5 px-2.5 text-center">Outcome</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {selectedDoc.extractedEntities.testedParameters.map((param, idx) => (
                            <tr key={idx} className="hover:bg-white">
                              <td className="py-1.5 px-2.5 font-medium text-slate-800">{param.parameter}</td>
                              <td className="py-1.5 px-2.5 font-mono text-slate-900">{param.result}</td>
                              <td className="py-1.5 px-2.5 text-slate-500">{param.specification}</td>
                              <td className="py-1.5 px-2.5 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  param.status === 'PASS'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {param.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedDoc.extractedEntities.rawTextExcerpt && (
                  <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded text-[11px] text-slate-600 font-mono leading-relaxed">
                    "{selectedDoc.extractedEntities.rawTextExcerpt}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

        {/* RIGHT PANE (Compliance Cross-Verification & Officer Decision Station) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Regulatory Flags & Deficiency Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-blue-600" />
                <span>Automated Compliance Findings ({dossier.flags.length})</span>
              </h3>
            </div>

            {dossier.flags.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <CheckCircle2 size={24} className="text-emerald-700 mx-auto mb-2" />
                <h5 className="text-xs font-bold text-emerald-900">Zero Deficiencies Detected</h5>
                <p className="text-[11px] text-emerald-700 mt-1">
                  All mandatory criteria, certificates, and quality control specifications match the NAFDAC standard.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dossier.flags.map(flag => (
                  <div
                    key={flag.id}
                    className={`p-3.5 rounded-lg border text-xs ${
                      flag.severity === 'CRITICAL'
                        ? 'bg-red-50/70 border-red-200 text-red-900'
                        : 'bg-amber-50/70 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <AlertTriangle size={14} className={flag.severity === 'CRITICAL' ? 'text-red-700' : 'text-amber-700'} />
                      <span>{flag.title}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed mb-2 text-slate-700">
                      {flag.description}
                    </p>
                    <div className="pt-2 border-t border-slate-200/60 text-[10px] space-y-0.5">
                      <div className="text-slate-500 font-semibold">
                        Cited Regulation: <span className="text-slate-800">{flag.citedRegulation}</span>
                      </div>
                      <div className="text-blue-700 font-semibold">
                        Remedy: {flag.suggestedAction}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Human-in-the-Loop Officer Decision Terminal */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Officer Decision Station
              </span>
              <span className="text-[10px] text-slate-400">Statutory Governance</span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              As the Authorized Vetting Officer, record your formal regulatory recommendation. All actions are cryptographically logged under NDPA 2023 audit requirements.
            </p>

            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                Officer Directive Notes (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="Enter internal vetting comments or specific directives for the registration committee..."
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                value={officerNote}
                onChange={e => setOfficerNote(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                onClick={handleApprove}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 size={15} />
                <span>Grant Regulatory Approval</span>
              </button>

              <button
                onClick={handleOpenQueryModal}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Send size={15} />
                <span>Auto-Draft Official Query Notice (Deficiency)</span>
              </button>

              <button
                onClick={handleReject}
                className="w-full py-2 px-4 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <XCircle size={14} />
                <span>Reject Dossier (Critical Violation)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Query Letter Modal */}
      {isQueryModalOpen && queryLetter && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  NAFDAC Formal Regulatory Deficiency Notice
                </span>
              </div>
              <button
                onClick={() => setIsQueryModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-serif leading-relaxed text-slate-800">
              <div className="text-center border-b border-slate-200 pb-4">
                <h3 className="font-sans font-black text-sm uppercase text-slate-900 tracking-wider">
                  National Agency for Food and Drug Administration and Control
                </h3>
                <div className="font-sans text-[11px] text-slate-500 mt-0.5">
                  Directorate of Registration and Regulatory Affairs (R&R)
                </div>
                <div className="font-mono text-[11px] text-blue-700 font-bold mt-1">
                  REF NO: NAFDAC/R&R/DEF/{queryLetter.dossierNumber.replace(/\//g, '-')}
                </div>
              </div>

              <div className="space-y-1">
                <div><strong>Date:</strong> {queryLetter.date}</div>
                <div><strong>To:</strong> The Managing Director, {queryLetter.applicantName}</div>
                <div><strong>Product:</strong> {queryLetter.productName}</div>
                <div><strong>Statutory Deadline:</strong> <span className="text-red-700 font-bold">{queryLetter.deadlineDate} (30 Days)</span></div>
              </div>

              <p>
                Following technical vetting of your application dossier for product registration, please be notified that the following regulatory deficiencies were identified and require prompt rectification:
              </p>

              <div className="space-y-2.5 my-3 pl-2 border-l-2 border-amber-400">
                {queryLetter.deficiencies.map((def, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <div className="font-sans font-bold text-slate-900">{idx + 1}. {def.title}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">Statutory Standard: {def.clause}</div>
                    <div className="text-[11px] text-blue-700 font-medium mt-0.5">Required Action: {def.remedy}</div>
                  </div>
                ))}
              </div>

              <p>
                You are advised to upload the requested rectification documents through the ReguScan AI Applicant Portal within 30 days of this notice to prevent formal revocation of your application.
              </p>

              <div className="pt-4 border-t border-slate-200 font-sans">
                <div className="font-bold text-slate-900">{queryLetter.officerName}</div>
                <div className="text-slate-500 text-[11px]">{queryLetter.officerDesignation}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setIsQueryModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100"
              >
                Back to Inspection
              </button>
              <button
                onClick={handleDispatchQuery}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-2"
              >
                <Send size={13} />
                <span>Sign & Dispatch Query to Applicant</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
