import React, { useState, useEffect } from 'react';
import { RegulatoryDossier, Directorate, ReguScanUser } from './types';
import { INITIAL_DOSSIERS } from './data/initialDossiers';
import { authService } from './services/authService';
import { dossierService } from './services/dossierService';
import { isSupabaseConfigured } from './services/supabase';
import { VettingDashboard } from './components/VettingDashboard';
import { DossierInspectionView } from './components/DossierInspectionView';
import { ReguScanLanding } from './components/ReguScanLanding';
import { IntelligentAuthPortal } from './components/IntelligentAuthPortal';
import { ApplicantDashboard } from './components/ApplicantDashboard';
import { AuditTrailModal } from './components/AuditTrailModal';
import {
  ShieldCheck,
  Building2,
  LogOut,
  FolderOpen,
  ArrowRight,
  UserCheck,
  Award,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<ReguScanUser | null>(() => authService.getCurrentUser());
  const [viewMode, setViewMode] = useState<'LANDING' | 'AUTH' | 'OFFICER_DASHBOARD' | 'OFFICER_INSPECTION' | 'APPLICANT_DASHBOARD'>(() => {
    const existing = authService.getCurrentUser();
    if (!existing) return 'LANDING';
    return existing.role === 'NAFDAC_OFFICER' ? 'OFFICER_DASHBOARD' : 'APPLICANT_DASHBOARD';
  });

  const [dossiers, setDossiers] = useState<RegulatoryDossier[]>(INITIAL_DOSSIERS);
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  const [activeDirectorate, setActiveDirectorate] = useState<Directorate | 'ALL'>('ALL');
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState(false);

  // Load dossiers from Supabase or local cache on mount
  useEffect(() => {
    dossierService.fetchDossiers().then(fetched => {
      if (fetched && fetched.length > 0) {
        setDossiers(fetched);
      }
    });
  }, []);

  const selectedDossier = dossiers.find(d => d.id === selectedDossierId) || null;

  // Login handler
  const handleLoginSuccess = (user: ReguScanUser) => {
    setCurrentUser(user);
    if (user.role === 'NAFDAC_OFFICER') {
      setViewMode('OFFICER_DASHBOARD');
    } else {
      setViewMode('APPLICANT_DASHBOARD');
    }
  };

  // Logout handler
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setViewMode('AUTH');
  };

  // Add new dossier from either Officer or Applicant
  const handleAddNewDossier = (newDossier: RegulatoryDossier) => {
    setDossiers(prev => [newDossier, ...prev]);
    dossierService.saveDossier(newDossier);
  };

  // Update existing dossier (after approval, query, or remedy submission)
  const handleUpdateDossier = (updated: RegulatoryDossier) => {
    setDossiers(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    dossierService.updateDossier(updated);
  };

  // Inspection navigation
  const handleSelectDossier = (dossierId: string) => {
    setSelectedDossierId(dossierId);
    setViewMode('OFFICER_INSPECTION');
  };

  // VIEW 1: LANDING PAGE
  if (viewMode === 'LANDING') {
    return (
      <ReguScanLanding
        onEnterPortal={() => {
          if (currentUser) {
            setViewMode(currentUser.role === 'NAFDAC_OFFICER' ? 'OFFICER_DASHBOARD' : 'APPLICANT_DASHBOARD');
          } else {
            setViewMode('AUTH');
          }
        }}
      />
    );
  }

  // VIEW 2: INTELLIGENT SINGLE AUTH PORTAL
  if (viewMode === 'AUTH') {
    return (
      <IntelligentAuthPortal
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setViewMode('LANDING')}
      />
    );
  }

  // VIEW 3 & 4: AUTHENTICATED PORTALS (OFFICER OR APPLICANT)
  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-900 flex flex-col">
      {/* Top Institutional Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('LANDING')}
              className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm hover:bg-blue-500 transition"
              title="Return to Public Landing Page"
            >
              R
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  ReguScan AI
                </span>
                {currentUser?.role === 'NAFDAC_OFFICER' ? (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1">
                    <ShieldCheck size={11} /> NAFDAC Vetting Command Center
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <Building2 size={11} /> Applicant Manufacturer Space
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400">
                {currentUser?.role === 'NAFDAC_OFFICER'
                  ? 'National Agency for Food & Drug Administration and Control (NAFDAC)'
                  : `${currentUser?.organizationName || 'Licensed Entity'} • NAFDAC Dossier Portal`}
              </div>
            </div>
          </div>

          {/* Right Session & Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser?.role === 'NAFDAC_OFFICER' && (
              <>
                <button
                  onClick={() => setIsAuditTrailOpen(true)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span className="hidden sm:inline">NDPA 2023 Audit Trail</span>
                </button>

                <button
                  onClick={() => setViewMode('OFFICER_DASHBOARD')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'OFFICER_DASHBOARD'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Dossier Queue
                </button>
              </>
            )}

            {currentUser?.role === 'APPLICANT_COMPANY' && (
              <button
                onClick={() => setViewMode('APPLICANT_DASHBOARD')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white"
              >
                My Product Dossiers
              </button>
            )}

            <button
              onClick={() => setViewMode('LANDING')}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 hidden md:block transition"
            >
              Public Overview
            </button>

            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

            {/* User Profile Badge */}
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-200">
                {currentUser?.name || 'Active User'}
              </div>
              <div className="text-[10px] text-blue-400 font-medium truncate max-w-[180px]">
                {currentUser?.role === 'NAFDAC_OFFICER'
                  ? 'NAFDAC Chief Officer'
                  : currentUser?.rcNumber || 'Licensed Manufacturer'}
              </div>
            </div>

            {/* Logout / Switch Role Button */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 border border-slate-700 transition"
              title="Sign Out / Switch Portal"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* OFFICER DASHBOARD */}
        {viewMode === 'OFFICER_DASHBOARD' && (
          <VettingDashboard
            dossiers={dossiers}
            onSelectDossier={handleSelectDossier}
            activeDirectorate={activeDirectorate}
            onChangeDirectorate={setActiveDirectorate}
            onOpenUploader={() => {}}
            onOpenAuditTrail={() => setIsAuditTrailOpen(true)}
          />
        )}

        {/* OFFICER INSPECTION VIEW */}
        {viewMode === 'OFFICER_INSPECTION' && selectedDossier && (
          <DossierInspectionView
            dossier={selectedDossier}
            onBack={() => setViewMode('OFFICER_DASHBOARD')}
            onUpdateDossier={handleUpdateDossier}
          />
        )}

        {/* APPLICANT COMPANY DASHBOARD */}
        {viewMode === 'APPLICANT_DASHBOARD' && currentUser && (
          <ApplicantDashboard
            currentUser={currentUser}
            dossiers={dossiers}
            onAddNewDossier={handleAddNewDossier}
            onUpdateDossier={handleUpdateDossier}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Audit Trail Modal (for NAFDAC compliance) */}
      {isAuditTrailOpen && (
        <AuditTrailModal onClose={() => setIsAuditTrailOpen(false)} />
      )}

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>
              © 2026 ReguScan AI • Teleiocraft Solutions Limited for NAFDAC.
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
              isSupabaseConfigured
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-700 border border-slate-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{isSupabaseConfigured ? 'Supabase PostgreSQL Connected' : 'Production Persistence Engine Active'}</span>
            </span>
          </div>

          <span className="font-mono text-[11px] text-slate-400">
            Directorates: Drug R&R | Food R&R | VBM R&R (Secured under NDPA 2023)
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
