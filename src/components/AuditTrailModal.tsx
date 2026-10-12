import React from 'react';
import { ShieldCheck, Lock, Key, Terminal, FileCode2, CheckCircle2, Clock } from 'lucide-react';

interface AuditTrailModalProps {
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ onClose }) => {
  const auditLogs = [
    {
      id: 'AUD-88219-01',
      timestamp: '2026-10-12T13:42:10.104Z',
      officer: 'Pharm. Chinyere Nwosu (ID: NAF-CRO-041)',
      action: 'DOSSIER_INSPECTION_OPENED',
      target: 'NAF/DR/2026/0419 (Amoxilife-Clav 625mg)',
      hash: 'sha256:8bfa3198cd5a09f871e411b988f018a38b5774a38dfc20819c991a0984f112e0',
      compliance: 'NDPA 2023 Sec 24(1)'
    },
    {
      id: 'AUD-88219-02',
      timestamp: '2026-10-12T13:43:55.882Z',
      officer: 'System AI Engine (ReguScan v1.0.4)',
      action: 'CHEMICAL_ASSAY_VERIFIED',
      target: 'Amoxicillin Trihydrate BP 101.4% (Pass)',
      hash: 'sha256:77ae12b409c918231aa87ef048b9911e893208fb011e4f9011a9e87311c87aa1',
      compliance: 'British Pharmacopoeia 2024'
    },
    {
      id: 'AUD-88219-03',
      timestamp: '2026-10-12T13:45:02.401Z',
      officer: 'Dr. Kabir Aliyu (ID: NAF-PRO-019)',
      action: 'DEFICIENCY_QUERY_DISPATCHED',
      target: 'NAF/DR/2026/0420 (Tussipen Pediatric)',
      hash: 'sha256:92cb71a4819e992983ba874f11e9912089fb011ef99811ab987311c87ff9',
      compliance: 'Zero-Tolerance DEG/EG Directive'
    },
    {
      id: 'AUD-88219-04',
      timestamp: '2026-10-12T13:47:19.912Z',
      officer: 'Pharm. Chinyere Nwosu (ID: NAF-CRO-041)',
      action: 'STATUTORY_APPROVAL_GRANTED',
      target: 'NAF/DR/2026/0419 (Reg No: 04-8291)',
      hash: 'sha256:34ef81a4991c992983ba874f11e9912089fb011ef99811ab987311c87ab2',
      compliance: 'NAFDAC Drug Act Cap N1 LFN 2004'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                Cryptographic Regulatory Audit Trail
              </div>
              <div className="text-[10px] text-slate-400">
                Nigeria Data Protection Act (NDPA 2023) Statutory Record
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Immutable Officer Activity Ledger</span>
              <span className="text-[11px] text-slate-500">
                All dossier reviews, queries, and grants are stamped with SHA-256 integrity proofs to eliminate fraud and tampering.
              </span>
            </div>
            <div className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300">
              LEDGER VERIFIED
            </div>
          </div>

          <div className="space-y-3">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-700">{log.id}</span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock size={11} /> {new Date(log.timestamp).toLocaleTimeString()} • {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-slate-900">{log.action.replace(/_/g, ' ')}</div>
                  <span className="text-[10px] font-semibold text-slate-500">{log.compliance}</span>
                </div>

                <div className="text-[11px] text-slate-600">
                  Officer: <span className="font-semibold text-slate-800">{log.officer}</span> | Target: <span className="font-medium text-slate-900">{log.target}</span>
                </div>

                <div className="pt-1.5 border-t border-slate-100 text-[10px] font-mono text-slate-400 truncate">
                  Hash: {log.hash}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
};
