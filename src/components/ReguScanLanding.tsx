import React, { useState } from 'react';
import {
  Shield,
  FileCheck2,
  Cpu,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Lock,
  ExternalLink,
  ChevronRight,
  Database,
  Building2,
  FileText
} from 'lucide-react';

interface ReguScanLandingProps {
  onEnterPortal: () => void;
}

export const ReguScanLanding: React.FC<ReguScanLandingProps> = ({ onEnterPortal }) => {
  const [activeSimDirectorate, setActiveSimDirectorate] = useState<'drug' | 'food' | 'vbm'>('drug');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Sovereign Gov Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="font-semibold text-slate-300">National Agency for Food and Drug Administration and Control (NAFDAC)</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">Regulatory Innovation & Intelligence Sandbox</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>NDPA 2023 Compliant</span>
            <span className="text-slate-600">•</span>
            <span>Directorate R&R</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-xs">
              R
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>ReguScan AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  NAFDAC Vetting System
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onEnterPortal}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Launch Officer Vetting Workstation</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-blue-400 text-xs font-semibold mb-6">
          <Cpu size={14} />
          <span>Automated Regulatory Dossier Processing Across Drug, Food & VBM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-5xl mx-auto leading-tight">
          Accelerating Regulatory Vetting From 45 Days to Under 48 Hours
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          ReguScan AI automates routine verification across <span className="text-white font-semibold">Drug R&R</span>, <span className="text-white font-semibold">Food R&R</span>, and <span className="text-white font-semibold">VBM R&R</span> while preserving statutory human officer governance for final registration approvals and deficiency queries.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnterPortal}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Open Regulatory Review Station</span>
            <ChevronRight size={16} />
          </button>
          <a
            href="#simulator"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <FileText size={16} className="text-blue-400" />
            <span>Interactive Vetting Simulator</span>
          </a>
        </div>

        {/* 4 Sovereign Metrics */}
        <div className="mt-16 pt-10 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">80–95%</div>
            <div className="text-xs text-slate-400 mt-1">Reduction in Processing Time</div>
          </div>
          <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">100%</div>
            <div className="text-xs text-slate-400 mt-1">Human Officer Decision Control</div>
          </div>
          <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">3 Directorates</div>
            <div className="text-xs text-slate-400 mt-1">Drug R&R • Food R&R • VBM R&R</div>
          </div>
          <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">Zero Trust</div>
            <div className="text-xs text-slate-400 mt-1">NDPA 2023 Encrypted & Audited</div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="simulator" className="py-16 bg-slate-950 border-t border-b border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Interactive Dossier Verification Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select a regulatory directorate to see how ReguScan AI extracts parameters, validates against NAFDAC gazettes, and flags compliance gaps.
            </p>

            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setActiveSimDirectorate('drug')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeSimDirectorate === 'drug'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Drug R&R (Paracetamol Extra 500mg)
              </button>
              <button
                onClick={() => setActiveSimDirectorate('food')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeSimDirectorate === 'food'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Food R&R (Fortified Wheat Flour 5kg)
              </button>
              <button
                onClick={() => setActiveSimDirectorate('vbm')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeSimDirectorate === 'vbm'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                VBM R&R (Malaria RDT Diagnostic)
              </button>
            </div>
          </div>

          {/* Simulator Card (Clean Slate Blue Interface) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {activeSimDirectorate === 'drug' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-blue-400 font-bold">DOSSIER REF: NAF/DR/2026/0419</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">Amoxilife-Clav 625mg Tablets (Fidson Healthcare PLC)</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    98% COMPLIANT
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">CAC Incorporation</span>
                    <div className="text-white font-medium mt-1 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>Fidson Healthcare PLC (RC-104928)</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Ingredient Assay</span>
                    <div className="text-white font-medium mt-1 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>101.4% (BP Limit: 90–110%)</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Premises & GMP Audit</span>
                    <div className="text-white font-medium mt-1 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>Valid until Nov 2027</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-950/40 border border-blue-900/60 rounded-lg text-xs text-blue-200 flex items-center justify-between">
                  <span>AI Officer Recommendation: <strong>Grant NAFDAC Registration Number</strong></span>
                  <button
                    onClick={onEnterPortal}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                  >
                    View in Dossier Terminal →
                  </button>
                </div>
              </div>
            )}

            {activeSimDirectorate === 'food' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-blue-400 font-bold">DOSSIER REF: NAF/FD/2026/1084</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">Golden Fields Fortified Whole Wheat Flour 5kg (Flour Mills of Nigeria)</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    95% COMPLIANT
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vitamin A Retinol Assay</span>
                    <div className="text-white font-medium mt-1 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>32,400 IU/kg (Target ≥ 30,000)</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Aflatoxin B1 Contaminant</span>
                    <div className="text-white font-medium mt-1 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>&lt; 2.0 ppb (Safety Limit ≤ 4.0 ppb)</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mandatory Packaging Mark</span>
                    <div className="text-white font-medium mt-1 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>National Fortification Eye Logo Verified</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-950/40 border border-blue-900/60 rounded-lg text-xs text-blue-200 flex items-center justify-between">
                  <span>AI Officer Recommendation: <strong>Fast-Track Certificate Issuance</strong></span>
                  <button
                    onClick={onEnterPortal}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                  >
                    View in Dossier Terminal →
                  </button>
                </div>
              </div>
            )}

            {activeSimDirectorate === 'vbm' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-blue-400 font-bold">DOSSIER REF: NAF/VBM/2026/0291</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">SureCheck Malaria Pf/Pan Antigen RDT (Biomedix / SD Biosensor)</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                    89% DEFICIENCY DETECTED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">WHO Prequalification</span>
                    <div className="text-white font-medium mt-1 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>WHO PQDx-0219 (Sensitivity &gt; 98.5%)</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-amber-900/50">
                    <span className="text-[10px] text-amber-400 uppercase font-semibold block">Letter of Authorization</span>
                    <div className="text-amber-300 font-medium mt-1 flex items-center gap-1.5">
                      <span>⚠️ Expired Dec 31, 2025</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cold Chain Storage</span>
                    <div className="text-white font-medium mt-1 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>Temperature Buffer (2°C – 30°C Verified)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-950/40 border border-amber-900/60 rounded-lg text-xs text-amber-200 flex items-center justify-between">
                  <span>AI Officer Recommendation: <strong>Issue Formal Deficiency Query Letter for Renewal Authorization</strong></span>
                  <button
                    onClick={onEnterPortal}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                  >
                    View in Dossier Terminal →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-xs text-slate-500 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 ReguScan AI — Developed by <span className="text-slate-300 font-semibold">Teleiocraft Solutions Limited</span> for NAFDAC.
          </div>
          <div className="flex gap-4 text-slate-400">
            <span>Drug R&R</span>
            <span>•</span>
            <span>Food R&R</span>
            <span>•</span>
            <span>VBM R&R</span>
            <span>•</span>
            <span>NDPA 2023 Protected</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
