import React, { useState } from 'react';
import {
  RegulatoryDossier,
  Directorate,
  DIRECTORATE_LABELS,
  DossierStatus
} from '../types';
import {
  Shield,
  FileCheck2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  Building2,
  ChevronRight,
  ExternalLink,
  Award,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface VettingDashboardProps {
  dossiers: RegulatoryDossier[];
  onSelectDossier: (dossierId: string) => void;
  activeDirectorate: Directorate | 'ALL';
  onChangeDirectorate: (dir: Directorate | 'ALL') => void;
}

export const VettingDashboard: React.FC<VettingDashboardProps> = ({
  dossiers,
  onSelectDossier,
  activeDirectorate,
  onChangeDirectorate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter dossiers
  const filteredDossiers = dossiers.filter(d => {
    const matchesDirectorate = activeDirectorate === 'ALL' || d.directorate === activeDirectorate;
    const matchesSearch =
      d.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.dossierNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesDirectorate && matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalCount = dossiers.length;
  const compliantCount = dossiers.filter(d => d.status === 'COMPLIANT' || d.status === 'APPROVED').length;
  const flaggedCount = dossiers.filter(d => d.status === 'DEFICIENCY_FLAGGED' || d.flags.length > 0).length;
  const pendingReviewCount = dossiers.filter(d => d.status === 'UNDER_OFFICER_REVIEW').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-600 text-white">
              Federal Republic of Nigeria
            </span>
            <span className="text-xs text-slate-400">NAFDAC Regulatory Dossier Command Center</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Regulatory Verification & Vetting Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            AI-assisted document parsing, OCR cross-match validation, and human-governed approvals across Drug, Food, and VBM directorates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700/60 px-4 py-2.5 rounded-xl text-right">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Active Session</div>
            <div className="text-xs font-bold text-blue-400 flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Pharm. Chinyere Nwosu (Chief Officer)
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Cards (Clean Slate Blue Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Active Dossiers</span>
            <FolderOpen size={18} className="text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold font-mono">100% Digital Ingestion</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified Compliant</span>
            <CheckCircle2 size={18} className="text-emerald-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{compliantCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Ready for final registration grant
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Deficiencies Flagged</span>
            <AlertTriangle size={18} className="text-amber-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{flaggedCount}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Missing CoAs or regulatory gaps
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mean Vetting Time</span>
            <Clock size={18} className="text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">18.4 hrs</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Down from <span className="line-through text-slate-400">28 days</span> manual cycle
          </div>
        </div>
      </div>

      {/* Directorate Selector Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-wrap gap-2 shadow-xs">
        <button
          onClick={() => onChangeDirectorate('ALL')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeDirectorate === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Directorates ({dossiers.length})
        </button>
        <button
          onClick={() => onChangeDirectorate('DRUG_RR')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeDirectorate === 'DRUG_RR'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Drug R&R</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 font-mono">
            {dossiers.filter(d => d.directorate === 'DRUG_RR').length}
          </span>
        </button>
        <button
          onClick={() => onChangeDirectorate('FOOD_RR')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeDirectorate === 'FOOD_RR'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Food R&R</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 font-mono">
            {dossiers.filter(d => d.directorate === 'FOOD_RR').length}
          </span>
        </button>
        <button
          onClick={() => onChangeDirectorate('VBM_RR')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeDirectorate === 'VBM_RR'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>VBM R&R (Vaccines & Devices)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 font-mono">
            {dossiers.filter(d => d.directorate === 'VBM_RR').length}
          </span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name, dossier ref, or applicant RC..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLIANT">Verified Compliant</option>
            <option value="DEFICIENCY_FLAGGED">Deficiency Flagged</option>
            <option value="UNDER_OFFICER_REVIEW">Under Officer Review</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>
      </div>

      {/* Dossier Queue Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Active Dossier Vetting Queue ({filteredDossiers.length})
          </div>
          <div className="text-[11px] text-slate-500">
            Showing verified regulatory submissions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">Dossier Ref & Directorate</th>
                <th className="py-3 px-4">Product Formulation / Name</th>
                <th className="py-3 px-4">Applicant & Manufacturer</th>
                <th className="py-3 px-4 text-center">AI Compliance Score</th>
                <th className="py-3 px-4">Vetting Status</th>
                <th className="py-3 px-4 text-right">Officer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDossiers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No dossiers matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredDossiers.map(dossier => {
                  const dirInfo = DIRECTORATE_LABELS[dossier.directorate];
                  return (
                    <tr
                      key={dossier.id}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                      onClick={() => onSelectDossier(dossier.id)}
                    >
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-blue-700 group-hover:text-blue-800 flex items-center gap-1.5">
                          <span>{dossier.dossierNumber}</span>
                        </div>
                        <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {dirInfo.code}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">
                          {dossier.productName}
                        </div>
                        {dossier.genericName && (
                          <div className="text-[11px] text-slate-500 truncate">
                            {dossier.genericName}
                          </div>
                        )}
                        {dossier.dosageForm && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {dossier.dosageForm}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Building2 size={13} className="text-slate-400 shrink-0" />
                          <span>{dossier.applicantName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {dossier.applicantRcNumber} • {dossier.countryOfOrigin}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`text-base font-extrabold font-mono ${
                            dossier.complianceScore >= 90
                              ? 'text-emerald-700'
                              : dossier.complianceScore >= 70
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          }`}>
                            {dossier.complianceScore}%
                          </span>
                          <span className="text-[9px] text-slate-400 uppercase font-semibold">
                            {dossier.documents.filter(d => d.status === 'VERIFIED').length}/{dossier.documents.length} Docs Pass
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {dossier.status === 'COMPLIANT' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 size={12} />
                            <span>Verified Compliant</span>
                          </span>
                        )}
                        {dossier.status === 'DEFICIENCY_FLAGGED' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertTriangle size={12} />
                            <span>{dossier.flags.length} Deficiency Flagged</span>
                          </span>
                        )}
                        {dossier.status === 'UNDER_OFFICER_REVIEW' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                            <Clock size={12} />
                            <span>Officer Review</span>
                          </span>
                        )}
                        {dossier.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900 text-white">
                            <Award size={12} className="text-emerald-400" />
                            <span>Registered</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDossier(dossier.id);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs border border-blue-200 transition-all"
                        >
                          <span>Inspect Dossier</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
