import React, { useState } from 'react';
import { ReguScanUser, UserRole } from '../types';
import { authService, DEMO_PROFILES } from '../services/authService';
import {
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  UserCheck,
  FileText,
  BadgeCheck,
  KeyRound,
  X
} from 'lucide-react';

interface IntelligentAuthPortalProps {
  onLoginSuccess: (user: ReguScanUser) => void;
  onBackToLanding: () => void;
}

export const IntelligentAuthPortal: React.FC<IntelligentAuthPortalProps> = ({
  onLoginSuccess,
  onBackToLanding
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [superintendentName, setSuperintendentName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot password state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  // Live intelligent role detection
  const detectedRole: UserRole = authService.detectRoleFromEmail(email || 'placeholder');
  const isEmailEntered = email.trim().length > 3 && email.includes('@');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email) {
      setErrorMsg('Please enter your official email address.');
      return;
    }

    try {
      const res = await authService.login(email);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!companyName || !rcNumber || !superintendentName || !email) {
      setErrorMsg('Please complete all required company registration fields.');
      return;
    }

    try {
      const res = await authService.registerCompany(
        companyName,
        rcNumber,
        superintendentName,
        email
      );
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Company registration failed.');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotStatus({ type: 'error', message: 'Please enter a valid official email address.' });
      return;
    }

    setForgotStatus({ type: 'loading', message: 'Verifying institutional account & dispatching reset instructions...' });
    try {
      const res = await authService.resetPassword(forgotEmail);
      if (res.success) {
        setForgotStatus({ type: 'success', message: res.message });
      } else {
        setForgotStatus({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setForgotStatus({ type: 'error', message: err.message || 'Failed to dispatch reset instructions.' });
    }
  };

  const handleQuickDemoLogin = async (profile: ReguScanUser) => {
    authService.setCurrentUser(profile);
    onLoginSuccess(profile);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar Return */}
      <div className="max-w-md w-full mx-auto px-4 mb-4">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Institutional Overview</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Institutional Crest / Logo */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg border border-blue-500">
            R
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-black tracking-tight text-white">
          ReguScan AI Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400 max-w-sm mx-auto">
          Unified Access Gateway for NAFDAC Regulatory Officers & Licensed Nigerian Manufacturers
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-slate-200 space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAuthMode('LOGIN');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                authMode === 'LOGIN'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('REGISTER');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                authMode === 'REGISTER'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register New Company
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800">
              {errorMsg}
            </div>
          )}

          {authMode === 'LOGIN' ? (
            /* Single Intelligent Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. regulatory@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Live Intelligent Detection Badge */}
                {isEmailEntered && (
                  <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Detected Portal:</span>
                    {detectedRole === 'NAFDAC_OFFICER' ? (
                      <span className="font-bold text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <ShieldCheck size={13} /> NAFDAC Officer Vetting Station
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Building2 size={13} /> Applicant / Manufacturer Space
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400">Default demo enabled</span>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotStatus({ type: 'idle', message: '' });
                      setIsForgotModalOpen(true);
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition"
              >
                <span>Authenticate & Open Portal</span>
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            /* New Company Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Company Legal Entity Name *
                </label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chi Pharmaceuticals Ltd"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  CAC Registration Number (RC) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RC-492019"
                  value={rcNumber}
                  onChange={e => setRcNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Superintendent Pharmacist / Contact Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pharm. Ibrahim Gambo"
                  value={superintendentName}
                  onChange={e => setSuperintendentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Official Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. regulatory@chipharm.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition"
              >
                <BadgeCheck size={14} />
                <span>Register Company & Enter Space</span>
              </button>
            </form>
          )}

          {/* Quick Demo Personas (Crucial for Reviewers & Judges) */}
          <div className="pt-4 border-t border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-blue-600" />
              <span>One-Click Evaluator Personas</span>
            </div>

            <div className="space-y-2">
              {/* NAFDAC Officer Persona */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(DEMO_PROFILES[0])}
                className="w-full p-2.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-blue-700" />
                    <span>NAFDAC Vetting Officer</span>
                  </div>
                  <div className="text-[10px] text-blue-700 font-medium mt-0.5">
                    Pharm. Chinyere Nwosu (Chief Officer, Drug R&R)
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-200/60 px-2 py-0.5 rounded">
                  Enter Vetting Station &rarr;
                </span>
              </button>

              {/* Applicant Pharma Persona */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(DEMO_PROFILES[2])}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 size={14} className="text-emerald-700" />
                    <span>Applicant Company: Fidson Healthcare PLC</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    RC-104928 • Pharmaceutical Manufacturer (Amoxilife)
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                  Enter Company Space &rarr;
                </span>
              </button>

              {/* Applicant Food Persona */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(DEMO_PROFILES[3])}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 size={14} className="text-amber-700" />
                    <span>Applicant Company: Flour Mills of Nigeria</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    RC-023910 • Food Manufacturer (Golden Fields)
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                  Enter Company Space &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound size={18} className="text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  NAFDAC Portal Credential Recovery
                </span>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600 mb-2">
                  <KeyRound size={22} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Forgot Your Portal Password?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your registered corporate or official NAFDAC email address. We will dispatch secure password reset instructions via Supabase Auth.
                </p>
              </div>

              {forgotStatus.type === 'success' ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Recovery Dispatch Sent</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {forgotStatus.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  {forgotStatus.type === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                      {forgotStatus.message}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Official Registered Email *
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. regulatory@company.com"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(false)}
                      className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotStatus.type === 'loading'}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      {forgotStatus.type === 'loading' ? (
                        <span>Dispatching...</span>
                      ) : (
                        <span>Send Recovery Link</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
