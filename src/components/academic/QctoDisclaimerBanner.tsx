import React from 'react';
import { ShieldCheck, Info, Award, Landmark, ExternalLink } from 'lucide-react';

export const QctoDisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div 
      id="qcto-institutional-disclaimer-banner"
      className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden text-left"
    >
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-900/40 text-amber-300 border border-amber-700/50 text-[10px] font-black uppercase tracking-wider">
                QCTO / SAQA Institutional Framework
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/10 text-[9px] font-mono font-bold">
                South African Qualifications Authority
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                TVET & Academy Companion
              </span>
            </div>

            <p className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
              Institutional Digital Study Companion & Evidence Workspace
            </p>
            
            <p className="text-xs text-amber-200/90 leading-relaxed max-w-4xl font-medium">
              <strong className="text-amber-300 font-bold">Institutional Advisory: </strong> 
              CaterProAI provides digital facilitation, automated recipe costing, menu engineering tools, and PoE evidence logging to complement accredited TVET & Culinary College delivery. CaterProAI is not an accredited Skills Development Provider (SDP) issuing direct formal qualifications; it functions as an educational enablement workstation and digital evidence generator for registered culinary qualifications.
            </p>
          </div>
        </div>

        {!compact && (
          <div className="shrink-0 flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            <div className="text-right hidden lg:block">
              <div className="text-[10px] uppercase font-black tracking-wider text-slate-400">Curriculum Codes</div>
              <div className="text-xs font-mono font-bold text-amber-400">SAQA 101697 • 102296 • 110644</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-amber-500/20 flex items-center justify-center text-amber-400 text-base">
              🇿🇦
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QctoDisclaimerBanner;
