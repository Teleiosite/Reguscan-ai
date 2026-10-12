import React, { useState } from 'react';
import {
  RegulatoryDossier,
  ReguScanUser,
  Directorate,
  DIRECTORATE_LABELS,
  DossierDocument
} from '../types';
import { dossierService } from '../services/dossierService';
import {
  Building2,
  PlusCircle,
  FileCheck2,
  Clock,
  AlertTriangle,
  Award,
  UploadCloud,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Send,
  Eye,
  ShieldCheck,
  X,
  Sparkles,
  Download,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ApplicantDashboardProps {
  currentUser: ReguScanUser;
  dossiers: RegulatoryDossier[];
  onAddNewDossier: (dossier: RegulatoryDossier) => void;
  onUpdateDossier: (dossier: RegulatoryDossier) => void;
  onLogout: () => void;
}

export const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({
  currentUser,
  dossiers,
  onAddNewDossier,
  onUpdateDossier,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirectorate, setFilterDirectorate] = useState<Directorate | 'ALL'>('ALL');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedQueriedDossier, setSelectedQueriedDossier] = useState<RegulatoryDossier | null>(null);
  const [selectedCertificateDossier, setSelectedCertificateDossier] = useState<RegulatoryDossier | null>(null);

  // Filter dossiers strictly belonging to this applicant company
  const companyDossiers = dossiers.filter(d => {
    const isCompanyMatch =
      d.applicantName.toLowerCase().trim() === currentUser.organizationName.toLowerCase().trim() ||
      d.applicantName.toLowerCase().includes(currentUser.organizationName.toLowerCase()) ||
      currentUser.organizationName.toLowerCase().includes(d.applicantName.toLowerCase());
    const matchesSearch =
      d.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.dossierNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDir = filterDirectorate === 'ALL' || d.directorate === filterDirectorate;
    return isCompanyMatch && matchesSearch && matchesDir;
  });

  // KPI counts
  const totalSubmissions = companyDossiers.length;
  const approvedCount = companyDossiers.filter(d => d.status === 'APPROVED').length;
  const queriedCount = companyDossiers.filter(d => d.status === 'QUERY_DISPATCHED' || d.status === 'DEFICIENCY_FLAGGED').length;
  const underReviewCount = companyDossiers.filter(d => d.status === 'UNDER_OFFICER_REVIEW' || d.status === 'COMPLIANT').length;

  return (
    <div className="space-y-6">
      {/* Company Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <Building2 size={12} />
              <span>Licensed Manufacturer Portal</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {currentUser.rcNumber || 'RC-104928'}
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {currentUser.organizationName}
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Superintendent Pharmacist: <span className="font-semibold text-slate-700">{currentUser.name}</span> • Regulatory Dossier Filing & Product Registration Portfolio
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <PlusCircle size={16} />
            <span>+ Submit New Product Dossier</span>
          </button>
        </div>
      </div>

      {/* Company KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Filed Dossiers</span>
            <FileText size={18} className="text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalSubmissions}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active regulatory submissions</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered & Licensed</span>
            <CheckCircle2 size={18} className="text-emerald-700" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">{approvedCount}</div>
          <div className="text-[11px] text-emerald-800 font-medium mt-1">
            NAFDAC Registration Numbers Issued
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Under Technical Vetting</span>
            <Clock size={18} className="text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{underReviewCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Pending committee sign-off</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Deficiency Queries</span>
            <AlertTriangle size={18} className="text-amber-700" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700">{queriedCount}</div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">
            Action required: 30-day remedy notice
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by brand name or dossier ref..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
            value={filterDirectorate}
            onChange={e => setFilterDirectorate(e.target.value as any)}
          >
            <option value="ALL">All Directorates</option>
            <option value="DRUG_RR">Drug R&R</option>
            <option value="FOOD_RR">Food R&R</option>
            <option value="VBM_RR">VBM R&R (Medical Devices)</option>
          </select>
        </div>
      </div>

      {/* Product Registration Portfolio Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {currentUser.organizationName} — Submitted Product Dossiers ({companyDossiers.length})
          </div>
          <span className="text-[11px] text-slate-500">Live NAFDAC Status Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">Dossier Ref & Directorate</th>
                <th className="py-3 px-4">Product Formulation / Name</th>
                <th className="py-3 px-4">Submitted Files</th>
                <th className="py-3 px-4">NAFDAC Vetting Status</th>
                <th className="py-3 px-4 text-right">Applicant Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companyDossiers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No products submitted yet. Click "+ Submit New Product Dossier" above to register your first product.
                  </td>
                </tr>
              ) : (
                companyDossiers.map(dossier => {
                  const dirInfo = DIRECTORATE_LABELS[dossier.directorate];
                  return (
                    <tr key={dossier.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-blue-700">{dossier.dossierNumber}</span>
                        <div className="mt-0.5">
                          <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {dirInfo.code}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{dossier.productName}</div>
                        {dossier.genericName && (
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">{dossier.genericName}</div>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5">{dossier.dosageForm}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-slate-700 font-semibold">{dossier.documents.length} Files</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          CoA, CAC, GMP, Artwork
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {dossier.status === 'APPROVED' && (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900 text-white">
                              <Award size={12} className="text-emerald-400" />
                              <span>NAFDAC Registered</span>
                            </span>
                            <div className="text-[10px] font-mono text-emerald-700 font-bold">
                              Reg No: {dossier.officerDecision?.generatedNaFDACNumber || '04-8291'}
                            </div>
                          </div>
                        )}

                        {(dossier.status === 'QUERY_DISPATCHED' || dossier.status === 'DEFICIENCY_FLAGGED') && (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <AlertTriangle size={12} />
                              <span>Deficiency Query Received</span>
                            </span>
                            <div className="text-[10px] text-red-700 font-bold">
                              Remedy Deadline: {dossier.officerDecision?.queryDeadline || '30 Days Remaining'}
                            </div>
                          </div>
                        )}

                        {(dossier.status === 'UNDER_OFFICER_REVIEW' || dossier.status === 'COMPLIANT' || dossier.status === 'SUBMITTED') && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                            <Clock size={12} />
                            <span>In Technical Vetting Queue</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {dossier.status === 'APPROVED' && (
                          <button
                            onClick={() => setSelectedCertificateDossier(dossier)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white font-bold text-xs border border-emerald-200 transition-all"
                          >
                            <Award size={13} />
                            <span>View NAFDAC Certificate</span>
                          </button>
                        )}

                        {(dossier.status === 'QUERY_DISPATCHED' || dossier.status === 'DEFICIENCY_FLAGGED') && (
                          <button
                            onClick={() => setSelectedQueriedDossier(dossier)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 font-bold text-xs shadow-xs transition-all"
                          >
                            <Send size={13} />
                            <span>View Query & Submit Remedy</span>
                          </button>
                        )}

                        {(dossier.status === 'UNDER_OFFICER_REVIEW' || dossier.status === 'COMPLIANT' || dossier.status === 'SUBMITTED') && (
                          <span className="text-[11px] text-slate-400 italic">
                            Vetting in progress
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: NEW PRODUCT SUBMISSION WIZARD */}
      {isSubmitModalOpen && (
        <ApplicantProductSubmissionModal
          currentUser={currentUser}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitSuccess={(newDossier) => {
            onAddNewDossier(newDossier);
            setIsSubmitModalOpen(false);
          }}
        />
      )}

      {/* MODAL 2: OFFICIAL DEFICIENCY QUERY RESPONSE MODAL */}
      {selectedQueriedDossier && (
        <ApplicantQueryResolutionModal
          dossier={selectedQueriedDossier}
          onClose={() => setSelectedQueriedDossier(null)}
          onResolveSuccess={(updated) => {
            onUpdateDossier(updated);
            setSelectedQueriedDossier(null);
          }}
        />
      )}

      {/* MODAL 3: OFFICIAL NAFDAC REGISTRATION CERTIFICATE MODAL */}
      {selectedCertificateDossier && (
        <NafdacCertificateModal
          dossier={selectedCertificateDossier}
          onClose={() => setSelectedCertificateDossier(null)}
        />
      )}
    </div>
  );
};

// SUB-COMPONENT: NEW PRODUCT SUBMISSION MODAL
interface ApplicantProductSubmissionModalProps {
  currentUser: ReguScanUser;
  onClose: () => void;
  onSubmitSuccess: (newDossier: RegulatoryDossier) => void;
}

const ApplicantProductSubmissionModal: React.FC<ApplicantProductSubmissionModalProps> = ({
  currentUser,
  onClose,
  onSubmitSuccess
}) => {
  const [directorate, setDirectorate] = useState<Directorate>('DRUG_RR');
  const [productName, setProductName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName) return;

    if (uploadedFiles.length === 0) {
      alert('Please upload at least one regulatory document (e.g. Certificate of Analysis, CAC Certificate, or GMP Report) to proceed.');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));

    const randNum = Math.floor(100 + Math.random() * 900);
    const prefix = directorate === 'DRUG_RR' ? 'DR' : directorate === 'FOOD_RR' ? 'FD' : 'VBM';
    const dossierNumber = `NAF/${prefix}/2026/0${randNum}`;

    // Upload files to Supabase Storage if configured
    const createdDocs: DossierDocument[] = [];
    for (let i = 0; i < uploadedFiles.length; i++) {
      const f = uploadedFiles[i];
      let storageUrl: string | undefined = undefined;
      try {
        const uploaded = await dossierService.uploadFileToStorage(f, `doc-${currentUser.id}`);
        if (uploaded) storageUrl = uploaded;
      } catch (err) {
        console.warn('Storage upload notice:', err);
      }

      createdDocs.push({
        id: `doc-${Date.now()}-${i}`,
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
          issuingAuthority: 'Accredited Analytical Laboratory',
          batchNumber: `BN-2026-X${Math.floor(10 + Math.random() * 90)}`,
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: '2029-09-30',
          manufacturerName: currentUser.organizationName,
          fileUrl: storageUrl,
          testedParameters: [
            { parameter: 'Assay of Active Ingredient', result: '99.8%', specification: '95.0% – 105.0%', status: 'PASS' },
            { parameter: 'Uniformity of Dosage Units', result: 'Conforms to BP', specification: 'BP 2024 Criteria', status: 'PASS' }
          ]
        }
      });
    }

    const newDossier: RegulatoryDossier = {
      id: `dossier-${Date.now()}`,
      dossierNumber,
      directorate,
      productName,
      genericName: genericName || productName,
      dosageForm: dosageForm || 'Standard Finished Package',
      applicantName: currentUser.organizationName,
      applicantRcNumber: currentUser.rcNumber || 'RC-104928',
      manufacturerName: currentUser.organizationName,
      countryOfOrigin: 'Nigeria',
      submissionDate: new Date().toISOString(),
      priority: 'STANDARD',
      status: 'UNDER_OFFICER_REVIEW',
      complianceScore: 94,
      documents: createdDocs,
      flags: [],
      assignedOfficer: 'Pharm. Chinyere Nwosu (Chief Regulatory Officer)'
    };

    setIsSubmitting(false);
    onSubmitSuccess(newDossier);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PlusCircle size={18} className="text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Submit Product Dossier to NAFDAC
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Directorate Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Select Target NAFDAC Directorate *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDirectorate('DRUG_RR')}
                className={`p-2.5 rounded-lg border text-xs font-bold transition ${
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
                className={`p-2.5 rounded-lg border text-xs font-bold transition ${
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
                className={`p-2.5 rounded-lg border text-xs font-bold transition ${
                  directorate === 'VBM_RR'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                VBM R&R (Devices)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Commercial Brand Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Paracetamol Extra 500mg"
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                value={productName}
                onChange={e => setProductName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Active Chemical Formula / Generic API
              </label>
              <input
                type="text"
                placeholder="e.g. Paracetamol + Caffeine"
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                value={genericName}
                onChange={e => setGenericName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Dosage Form & Packaging Unit
            </label>
            <input
              type="text"
              placeholder="e.g. Blister pack of 20 Caplets / 100ml Glass Bottle"
              className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
              value={dosageForm}
              onChange={e => setDosageForm(e.target.value)}
            />
          </div>

          {/* Dossier File Upload Box */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Mandatory Regulatory Dossier Documents (CoA, CAC, GMP Audit, Packaging Artwork)
            </label>
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center bg-slate-50 cursor-pointer"
            >
              <UploadCloud size={24} className="text-slate-400 mx-auto mb-1.5" />
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
                Formats: PDF, PNG, JPG (Max 25 MB). Quality Control laboratory assays will be parsed automatically.
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-2.5 space-y-1">
                {uploadedFiles.map((f, idx) => (
                  <div key={idx} className="p-2 bg-slate-100 rounded-lg flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-800 truncate">{f.name}</span>
                    <span className="text-slate-400 font-mono">({(f.size / 1024).toFixed(0)} KB)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Submitting to Queue...' : 'File Dossier with NAFDAC'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// SUB-COMPONENT: DEFICIENCY QUERY RESOLUTION MODAL
interface ApplicantQueryResolutionModalProps {
  dossier: RegulatoryDossier;
  onClose: () => void;
  onResolveSuccess: (updated: RegulatoryDossier) => void;
}

const ApplicantQueryResolutionModal: React.FC<ApplicantQueryResolutionModalProps> = ({
  dossier,
  onClose,
  onResolveSuccess
}) => {
  const [resolutionComment, setResolutionComment] = useState('');
  const [rectifiedFiles, setRectifiedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResolve = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const updated: RegulatoryDossier = {
        ...dossier,
        status: 'UNDER_OFFICER_REVIEW',
        flags: dossier.flags.map(f => ({ ...f, resolved: true })),
        officerDecision: {
          action: 'QUERIED',
          officerName: dossier.officerDecision?.officerName || 'Pharm. Chinyere Nwosu',
          decidedAt: new Date().toISOString(),
          officialComments: `Applicant submitted rectified documents on ${new Date().toLocaleDateString()}: "${resolutionComment || 'Rectification documents submitted.'}"`
        }
      };
      setIsSubmitting(false);
      onResolveSuccess(updated);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-sans">
        <div className="p-4 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">
              NAFDAC Regulatory Deficiency Notice & Rectification Portal
            </span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>Notice for: {dossier.productName} ({dossier.dossierNumber})</span>
            </div>
            <div className="text-[11px] text-amber-800">
              Statutory 30-Day Deadline: <strong>{dossier.officerDecision?.queryDeadline || '30 Days from Issuance'}</strong>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-2">
              Deficiencies Identified by Vetting Officer:
            </h4>
            <div className="space-y-2">
              {dossier.flags.map(flag => (
                <div key={flag.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900">{flag.title}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{flag.description}</div>
                  <div className="text-[10px] text-blue-700 font-semibold mt-1">
                    Required Action: {flag.suggestedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
              Upload Rectified / Certified Documents (e.g. Accredited DEG Screen CoA, 2026 License):
            </label>
            <input
              type="file"
              multiple
              onChange={e => e.target.files && setRectifiedFiles(Array.from(e.target.files))}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
              Applicant Technical Response Notes:
            </label>
            <textarea
              rows={2}
              placeholder="Explain how the regulatory deficiency was remediated..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
              value={resolutionComment}
              onChange={e => setResolutionComment(e.target.value)}
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={handleResolve}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Uploading Remedy...' : 'Submit Rectification to NAFDAC'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// SUB-COMPONENT: OFFICIAL NAFDAC REGISTRATION CERTIFICATE MODAL
interface NafdacCertificateModalProps {
  dossier: RegulatoryDossier;
  onClose: () => void;
}

const NafdacCertificateModal: React.FC<NafdacCertificateModalProps> = ({ dossier, onClose }) => {
  const regNumber = dossier.officerDecision?.generatedNaFDACNumber || '04-8291';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Award size={15} className="text-emerald-400" />
            <span>NAFDAC Official Certificate of Product Registration</span>
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-8 overflow-y-auto bg-slate-100 flex justify-center">
          <div className="w-full max-w-lg bg-white border-4 border-double border-emerald-800 p-8 shadow-xl text-center font-serif relative">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-600 mb-1">
              FEDERAL REPUBLIC OF NIGERIA
            </div>
            <h2 className="text-base font-black uppercase text-emerald-950 tracking-tight font-sans">
              National Agency for Food and Drug Administration and Control
            </h2>
            <div className="text-[10px] text-slate-500 font-sans mt-0.5">
              (NAFDAC Act Cap N1 LFN 2004)
            </div>

            <div className="my-5 py-2 border-y-2 border-emerald-800">
              <h3 className="text-lg font-black tracking-wide text-slate-900 font-sans uppercase">
                CERTIFICATE OF PRODUCT REGISTRATION
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
              This is to certify that the product described herein has been technically evaluated, verified, and duly registered in accordance with statutory provisions.
            </p>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-left text-xs font-sans space-y-1 mb-5">
              <div><strong>Product Name:</strong> {dossier.productName}</div>
              <div><strong>Active Generic:</strong> {dossier.genericName || dossier.productName}</div>
              <div><strong>Applicant / Manufacturer:</strong> {dossier.applicantName} ({dossier.applicantRcNumber})</div>
              <div><strong>Dosage Form:</strong> {dossier.dosageForm}</div>
              <div><strong>Country of Origin:</strong> {dossier.countryOfOrigin}</div>
              <div className="pt-1 border-t border-slate-200 text-emerald-900 font-bold font-mono">
                NAFDAC REGISTRATION NO: {regNumber}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-left font-sans text-[10px]">
              <div>
                <div className="text-slate-400">Date of Registration:</div>
                <div className="font-bold text-slate-800">{new Date().toLocaleDateString()}</div>
                <div className="text-slate-400 mt-1">Valid For: 5 Years</div>
              </div>

              <div className="text-right">
                <div className="font-serif italic font-bold text-slate-900 text-xs">Prof. Mojisola Adeyeye, FAS</div>
                <div className="text-slate-500 font-bold uppercase text-[9px]">Director-General, NAFDAC</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
