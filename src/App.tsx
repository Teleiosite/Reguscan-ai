import React, { useState } from 'react';
import { RegulatoryDossier, Directorate } from './types';
import { INITIAL_DOSSIERS } from './data/initialDossiers';
import { VettingDashboard } from './components/VettingDashboard';
import { DossierInspectionView } from './components/DossierInspectionView';
import { ReguScanLanding } from './components/ReguScanLanding';
import { DossierUploader } from './components/DossierUploader';
import { AuditTrailModal } from './components/AuditTrailModal';
import {
  Shield,
  FileCheck2,
  FolderOpen,
  LogOut,
  Building2,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  UploadCloud,
  ShieldCheck
} from 'lucide-react';

export function App() {
  const [viewMode, setViewMode] = useState<'LANDING' | 'DASHBOARD' | 'INSPECTION'>('LANDING');
  const [dossiers, setDossiers] = useState<RegulatoryDossier[]>(INITIAL_DOSSIERS);
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  const [activeDirectorate, setActiveDirectorate] = useState<Directorate | 'ALL'>('ALL');
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState(false);

  const selectedDossier = dossiers.find(d => d.id === selectedDossierId) || null;

  const handleSelectDossier = (dossierId: string) => {
    setSelectedDossierId(dossierId);
    setViewMode('INSPECTION');
  };

  const handleUpdateDossier = (updated: RegulatoryDossier) => {
    setDossiers(prev => prev.map(d => (d.id === updated.id ? updated : d)));
  };

  if (viewMode === 'LANDING') {
    return <ReguScanLanding onEnterPortal={() => setViewMode('DASHBOARD')} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-900 flex flex-col">
      {/* Institutional Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('LANDING')}
              className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm"
            >
              R
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  ReguScan AI
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
                  NAFDAC Dossier Vetting
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                National Agency for Food & Drug Administration and Control
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsUploaderOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-2xs transition"
            >
              <UploadCloud size={14} />
              <span className="hidden sm:inline">+ Intake Dossier</span>
              <span className="sm:hidden">+ Intake</span>
            </button>

            <button
              onClick={() => setIsAuditTrailOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="hidden sm:inline">Audit Trail</span>
            </button>

            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

            <button
              onClick={() => setViewMode('DASHBOARD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'DASHBOARD'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Queue
            </button>
            <button
              onClick={() => setViewMode('LANDING')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all border border-slate-800 hover:border-slate-700 hidden md:flex items-center gap-1"
            >
              <span>Public Portal</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-200">Pharm. Chinyere Nwosu</div>
              <div className="text-[10px] text-blue-400 font-medium">Chief Regulatory Officer</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-xs">
              CN
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {viewMode === 'DASHBOARD' && (
          <VettingDashboard
            dossiers={dossiers}
            onSelectDossier={handleSelectDossier}
            activeDirectorate={activeDirectorate}
            onChangeDirectorate={setActiveDirectorate}
            onOpenUploader={() => setIsUploaderOpen(true)}
            onOpenAuditTrail={() => setIsAuditTrailOpen(true)}
          />
        )}

        {viewMode === 'INSPECTION' && selectedDossier && (
          <DossierInspectionView
            dossier={selectedDossier}
            onBack={() => setViewMode('DASHBOARD')}
            onUpdateDossier={handleUpdateDossier}
          />
        )}
      </main>

      {/* Modals */}
      {isUploaderOpen && (
        <DossierUploader
          onAddDossier={(newDossier) => {
            setDossiers(prev => [newDossier, ...prev]);
            setSelectedDossierId(newDossier.id);
            setViewMode('INSPECTION');
          }}
          onClose={() => setIsUploaderOpen(false)}
        />
      )}

      {isAuditTrailOpen && (
        <AuditTrailModal onClose={() => setIsAuditTrailOpen(false)} />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 ReguScan AI • Teleiocraft Solutions Limited for NAFDAC.
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Directorates: Drug R&R | Food R&R | VBM R&R (Secured under NDPA 2023)
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
