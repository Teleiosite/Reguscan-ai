import React, { useState } from 'react';
import { DossierDocument } from '../types';
import {
  FileText,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  Building2
} from 'lucide-react';

interface DocumentViewerCanvasProps {
  document: DossierDocument;
  productName: string;
  applicantName: string;
}

export const DocumentViewerCanvas: React.FC<DocumentViewerCanvasProps> = ({
  document,
  productName,
  applicantName
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [highlightField, setHighlightField] = useState<string | null>(null);

  const entities = document.extractedEntities;

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-300 shadow-inner">
      {/* Document Canvas Toolbar */}
      <div className="bg-slate-800 text-slate-200 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-700">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-blue-400" />
          <span className="font-semibold text-white truncate max-w-[200px]">
            {document.name}
          </span>
          <span className="px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 font-mono text-[10px]">
            {document.fileSize}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(prev => Math.max(75, prev - 10))}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
          <span className="font-mono text-[11px] text-slate-400 w-9 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
          <div className="h-3 w-px bg-slate-700 mx-1"></div>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles size={11} /> OCR Bounding Layer Active
          </span>
        </div>
      </div>

      {/* Simulated High-Res Scanned Regulatory Certificate Canvas */}
      <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-200/80">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-xl bg-white shadow-xl rounded-sm border border-slate-300 p-8 text-slate-900 transition-transform duration-150 font-serif relative min-h-[620px]"
        >
          {/* Official Security Border & Watermark */}
          <div className="absolute inset-3 border-2 border-slate-300/80 pointer-events-none rounded-xs"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none font-sans font-black text-6xl rotate-[-30deg]">
            NAFDAC REGULATORY REPOSITORY
          </div>

          {/* Certificate Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 mb-5 font-sans">
            <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              FEDERAL REPUBLIC OF NIGERIA
            </div>
            <h3 className="text-base font-black tracking-tight text-slate-900 uppercase mt-0.5">
              {document.docType === 'CERTIFICATE_OF_ANALYSIS' && 'QUALITY CONTROL LABORATORY CERTIFICATE OF ANALYSIS'}
              {document.docType === 'CAC_INCORPORATION' && 'CORPORATE AFFAIRS COMMISSION CERTIFICATE OF INCORPORATION'}
              {document.docType === 'GMP_AUDIT_REPORT' && 'DIRECTORATE OF REGULATORY AFFAIRS GMP AUDIT CERTIFICATE'}
              {document.docType === 'PRODUCT_LABEL_ARTWORK' && 'FINISHED PRODUCT SECONDARY PACKAGING & LABEL ARTWORK'}
              {document.docType === 'FREE_SALE_CERTIFICATE' && 'WHO PREQUALIFICATION EVALUATION REPORT'}
              {document.docType === 'LETTER_OF_AUTHORIZATION' && 'MANUFACTURER POWER OF ATTORNEY & AUTHORIZATION'}
              {document.docType === 'MANUFACTURING_LICENSE' && 'PHARMACISTS COUNCIL OF NIGERIA ANNUAL PREMISES LICENSE'}
            </h3>
            <div className="text-[10px] text-slate-600 mt-1">
              Doc Ref: <span className="font-mono font-bold text-slate-800">{document.id}</span> • Status: <span className="font-semibold text-emerald-800">OFFICIAL SUBMISSION</span>
            </div>
          </div>

          {/* Certificate Content Body */}
          <div className="space-y-4 text-xs">
            {/* Entity Block with Bounding Box Highlights */}
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200 font-sans">
              <div
                onMouseEnter={() => setHighlightField('applicant')}
                onMouseLeave={() => setHighlightField(null)}
                className={`p-2 rounded transition-all cursor-pointer ${
                  highlightField === 'applicant'
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Applicant Entity</span>
                <span className="font-bold text-slate-900 text-xs">{applicantName}</span>
                <span className="text-[10px] text-blue-700 block font-mono">Matched against CAC Registry</span>
              </div>

              <div
                onMouseEnter={() => setHighlightField('product')}
                onMouseLeave={() => setHighlightField(null)}
                className={`p-2 rounded transition-all cursor-pointer ${
                  highlightField === 'product'
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Product Formulation</span>
                <span className="font-bold text-slate-900 text-xs">{productName}</span>
                <span className="text-[10px] text-emerald-700 block font-semibold">Active Dossier Subject</span>
              </div>
            </div>

            {/* Document Specific Data */}
            {entities.batchNumber && (
              <div
                onMouseEnter={() => setHighlightField('batch')}
                onMouseLeave={() => setHighlightField(null)}
                className={`p-2 rounded font-sans transition-all cursor-pointer ${
                  highlightField === 'batch'
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tested Batch Reference</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {entities.batchNumber}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    MFG: {entities.issueDate || '2026-09-15'} | EXP: {entities.expiryDate || '2029-09-14'}
                  </span>
                </div>
              </div>
            )}

            {/* Chemical Specification Table (if present) */}
            {entities.testedParameters && entities.testedParameters.length > 0 && (
              <div className="font-sans pt-1">
                <span className="text-[10px] font-bold uppercase text-slate-700 tracking-wider block mb-1.5">
                  Analytical Assay Results & Finished Product Specifications:
                </span>
                <table className="w-full text-[11px] border border-slate-300 text-left">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold text-[9px] uppercase">
                    <tr>
                      <th className="p-1.5 border-r border-slate-300">Analytical Test Parameter</th>
                      <th className="p-1.5 border-r border-slate-300">Batch Result</th>
                      <th className="p-1.5 border-r border-slate-300">Statutory Standard</th>
                      <th className="p-1.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {entities.testedParameters.map((param, i) => (
                      <tr
                        key={i}
                        className={`hover:bg-blue-50/50 ${
                          param.status === 'FAIL' ? 'bg-red-50 text-red-900' : ''
                        }`}
                      >
                        <td className="p-1.5 border-r border-slate-200 font-medium">{param.parameter}</td>
                        <td className="p-1.5 border-r border-slate-200 font-mono font-bold">{param.result}</td>
                        <td className="p-1.5 border-r border-slate-200 text-slate-600">{param.specification}</td>
                        <td className="p-1.5 text-center font-bold text-[10px]">
                          {param.status === 'PASS' ? (
                            <span className="text-emerald-700">PASS</span>
                          ) : (
                            <span className="text-red-700 underline">DEFICIENT</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Official Sign-off & Stamp Representation */}
            <div className="pt-6 mt-4 border-t border-slate-300 flex items-end justify-between font-sans">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Laboratory Authority</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">
                  {entities.issuingAuthority || 'Directorate of Laboratory Services'}
                </div>
                <div className="text-[10px] text-slate-500">ISO/IEC 17025 Certified</div>
              </div>

              {/* Simulated Stamp / Seal */}
              <div className="w-20 h-20 rounded-full border-2 border-blue-700/80 text-blue-800 flex flex-col items-center justify-center p-1 text-center rotate-[-12deg] select-none shadow-xs">
                <ShieldCheck size={16} className="text-blue-700" />
                <span className="text-[7px] font-black uppercase tracking-tighter leading-none mt-0.5">
                  VERIFIED BY OCR
                </span>
                <span className="text-[6px] font-mono mt-0.5">NDPA-2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
