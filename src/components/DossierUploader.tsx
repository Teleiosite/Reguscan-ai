import React, { useState } from 'react';
import { Directorate, RegulatoryDossier, DossierDocument } from '../types';
import {
  UploadCloud,
  FileCheck2,
  FileText,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Shield,
  Loader2,
  X
} from 'lucide-react';

interface DossierUploaderProps {
  onAddDossier: (dossier: RegulatoryDossier) => void;
  onClose: () => void;
}

export const DossierUploader: React.FC<DossierUploaderProps> = ({
  onAddDossier,
  onClose
}) => {
  const [directorate, setDirectorate] = useState<Directorate>('DRUG_RR');
  const [productName, setProductName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantRc, setApplicantRc] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRunVetting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !applicantName) {
      alert('Please fill in product name and applicant details.');
      return;
    }

    setIsProcessing(true);

    // Simulated 3-stage OCR & Vetting Engine
    setProcessingStep('Extracting OCR Text & Bounding Coordinates...');
    await new Promise(r => setTimeout(r, 900));

    setProcessingStep('Validating Chemical Assays against British Pharmacopoeia (BP)...');
    await new Promise(r => setTimeout(r, 900));

    setProcessingStep('Cross-Referencing CAC, Pharmacist Permit & NAFDAC Gazettes...');
    await new Promise(r => setTimeout(r, 800));

    // Construct the verified Dossier
    const randId = Math.floor(100 + Math.random() * 900);
    const prefix = directorate === 'DRUG_RR' ? 'DR' : directorate === 'FOOD_RR' ? 'FD' : 'VBM';
    const dossierNumber = `NAF/${prefix}/2026/0${randId}`;

    const createdDocuments: DossierDocument[] = uploadedFiles.map((f, idx) => ({
      id: `doc-up-${idx}-${Date.now()}`,
      name: f.name,
      docType: f.name.toLowerCase().includes('coa') || f.name.toLowerCase().includes('analysis')
        ? 'CERTIFICATE_OF_ANALYSIS'
        : f.name.toLowerCase().includes('cac')
        ? 'CAC_INCORPORATION'
        : f.name.toLowerCase().includes('gmp')
        ? 'GMP_AUDIT_REPORT'
        : 'PRODUCT_LABEL_ARTWORK',
      fileSize: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString(),
      isMandatory: true,
      status: 'VERIFIED',
      extractedEntities: {
        issuingAuthority: 'National Quality Assurance Laboratory (NAFDAC Accredited)',
        batchNumber: `BN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        issueDate: '2026-09-01',
        expiryDate: '2029-08-31',
        manufacturerName: applicantName,
        testedParameters: [
          { parameter: 'Active Substance Assay', result: '99.4%', specification: '95.0% – 105.0%', status: 'PASS' },
          { parameter: 'Microbial Bioburden', result: 'Conforms to BP Limit', specification: 'Absence of Pathogens', status: 'PASS' },
          { parameter: 'Heavy Metals Screening', result: '< 5 ppm', specification: 'NMT 10 ppm', status: 'PASS' }
        ],
        rawTextExcerpt: `Verified electronic submission for ${productName}. Quality analysis passed all regulatory release specifications.`
      }
    }));

    // If no files uploaded, add 2 sample files automatically
    if (createdDocuments.length === 0) {
      createdDocuments.push(
        {
          id: `doc-up-sample-1`,
          name: `Certificate_of_Analysis_${productName.replace(/\s+/g, '_')}.pdf`,
          docType: 'CERTIFICATE_OF_ANALYSIS',
          fileSize: '2.1 MB',
          uploadDate: new Date().toISOString(),
          isMandatory: true,
          status: 'VERIFIED',
          extractedEntities: {
            issuingAuthority: 'Accredited QC Analytical Laboratory',
            batchNumber: 'BN-QC-2026-X1',
            testedParameters: [
              { parameter: 'Active Assay', result: '100.2%', specification: '95.0% – 105.0%', status: 'PASS' }
            ]
          }
        },
        {
          id: `doc-up-sample-2`,
          name: `CAC_Incorporation_${applicantName.replace(/\s+/g, '_')}.pdf`,
          docType: 'CAC_INCORPORATION',
          fileSize: '1.4 MB',
          uploadDate: new Date().toISOString(),
          isMandatory: true,
          status: 'VERIFIED',
          extractedEntities: {
            issuingAuthority: 'Corporate Affairs Commission',
            manufacturerName: applicantName
          }
        }
      );
    }

    const newDossier: RegulatoryDossier = {
      id: `dossier-${Date.now()}`,
      dossierNumber,
      directorate,
      productName,
      genericName: genericName || productName,
      dosageForm: dosageForm || 'Finished Product Package',
      applicantName,
      applicantRcNumber: applicantRc || `RC-${Math.floor(100000 + Math.random() * 900000)}`,
      manufacturerName: applicantName,
      countryOfOrigin: 'Nigeria',
      submissionDate: new Date().toISOString(),
      priority: 'STANDARD',
      status: 'COMPLIANT',
      complianceScore: 96,
      documents: createdDocuments,
      flags: [],
      assignedOfficer: 'Pharm. Chinyere Nwosu (Chief Regulatory Officer)'
    };

    setIsProcessing(false);
    onAddDossier(newDossier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UploadCloud size={18} className="text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Intake New Regulatory Dossier for AI Vetting
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleRunVetting} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Directorate Choice */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Select Regulatory Directorate *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDirectorate('DRUG_RR')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  directorate === 'DRUG_RR'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Drug R&R
              </button>
              <button
                type="button"
                onClick={() => setDirectorate('FOOD_RR')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  directorate === 'FOOD_RR'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Food R&R
              </button>
              <button
                type="button"
                onClick={() => setDirectorate('VBM_RR')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  directorate === 'VBM_RR'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                VBM R&R (Devices)
              </button>
            </div>
          </div>

          {/* Product & Entity Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Commercial Brand Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Paracetamol Extra 500mg"
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                value={productName}
                onChange={e => setProductName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Generic Name / API Formula
              </label>
              <input
                type="text"
                placeholder="e.g. Paracetamol + Caffeine"
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                value={genericName}
                onChange={e => setGenericName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Applicant Company Legal Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Emzor Pharmaceuticals Ltd"
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                value={applicantName}
                onChange={e => setApplicantName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                CAC RC Number
              </label>
              <input
                type="text"
                placeholder="e.g. RC-492019"
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                value={applicantRc}
                onChange={e => setApplicantRc(e.target.value)}
              />
            </div>
          </div>

          {/* Drag & Drop File Zone */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Upload Dossier PDFs & Certificates (CoA, CAC, GMP Audit, Artwork)
            </label>
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center bg-slate-50 transition-colors cursor-pointer"
            >
              <UploadCloud size={28} className="text-slate-400 mx-auto mb-2" />
              <div className="font-semibold text-slate-700 text-xs">
                Drag and drop dossier documents here, or{' '}
                <label className="text-blue-600 underline cursor-pointer">
                  browse files
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Supports PDF, DOCX, PNG, JPG (Max 25 MB each). Auto-extracts chemical assays and dates.
              </div>
            </div>

            {/* Uploaded File List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Files Queued for Vetting ({uploadedFiles.length}):
                </span>
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-slate-100 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={13} className="text-blue-600 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="text-slate-400 hover:text-red-600 text-xs ml-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center space-y-2">
              <Loader2 size={24} className="text-blue-600 animate-spin mx-auto" />
              <div className="font-bold text-blue-900 text-xs">
                {processingStep}
              </div>
              <div className="text-[10px] text-blue-700 font-mono">
                Computing NAFDAC Compliance Index...
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-2"
            >
              <Sparkles size={14} />
              <span>Initiate AI Document Vetting</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
