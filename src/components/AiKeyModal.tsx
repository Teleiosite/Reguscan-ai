import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import {
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';

interface AiKeyModalProps {
  onClose: () => void;
}

export const AiKeyModal: React.FC<AiKeyModalProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setApiKey(aiService.getApiKey());
  }, []);

  const handleSave = () => {
    aiService.saveApiKey(apiKey);
    onClose();
  };

  const handleTest = async () => {
    setTestStatus('TESTING');
    setStatusMessage('Authenticating with Google Gemini 2.5 Flash...');
    const res = await aiService.testApiKey(apiKey);
    if (res.valid) {
      setTestStatus('SUCCESS');
      setStatusMessage(res.message);
    } else {
      setTestStatus('ERROR');
      setStatusMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-400" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                Google Gemini AI Configuration
              </div>
              <div className="text-[10px] text-slate-400">
                Multimodal OCR & Pharmacopoeia Verification Engine
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Google Gemini API Key
            </label>
            <div className="relative">
              <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={e => {
                  setApiKey(e.target.value);
                  setTestStatus('IDLE');
                }}
                className="w-full pl-8 pr-10 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Key is stored securely in your browser session.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline font-semibold flex items-center gap-1"
              >
                Get Gemini Key <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* Test Status Feedback */}
          {testStatus !== 'IDLE' && (
            <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
              testStatus === 'SUCCESS' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' :
              testStatus === 'ERROR' ? 'bg-red-50 border-red-300 text-red-900' :
              'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              {testStatus === 'SUCCESS' && <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />}
              {testStatus === 'ERROR' && <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />}
              {testStatus === 'TESTING' && <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5 animate-spin" />}
              <span className="font-medium leading-relaxed">{statusMessage}</span>
            </div>
          )}

          {/* Permanent Deployment Instructions (Vercel) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase">
              <Server size={13} className="text-slate-600" />
              <span>For Production (Vercel & .env):</span>
            </div>
            <div className="text-[11px] text-slate-600 space-y-1">
              <div>
                <strong>Local Development:</strong> Put in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">.env</code>:
              </div>
              <div className="font-mono bg-slate-800 text-emerald-400 p-2 rounded text-[10px]">
                VITE_GEMINI_API_KEY=your_gemini_api_key_here
              </div>
              <div className="pt-1">
                <strong>Vercel Production:</strong> Vercel &rarr; Project Settings &rarr; Environment Variables &rarr; Add <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">VITE_GEMINI_API_KEY</code>.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTest}
            disabled={testStatus === 'TESTING' || !apiKey}
            className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Sparkles size={13} className="text-blue-600" />
            <span>Test Connection</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
