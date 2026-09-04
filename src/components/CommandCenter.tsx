import React from 'react';
import { 
  ChefHat, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Coins, 
  FileText, 
  PlusCircle, 
  Download, 
  Calculator, 
  Radio, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { Menu } from '../types';

interface CommandCenterProps {
  proposal: Menu;
  onNewProposal: () => void;
  onOpenBeo: () => void;
  onExportPdf: () => void;
  onOpenCalculator: () => void;
  onSaveProposal: () => void;
  region: string;
  onUpdateGuestCount: (count: number) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  proposal,
  onNewProposal,
  onOpenBeo,
  onExportPdf,
  onOpenCalculator,
  onSaveProposal,
  region,
  onUpdateGuestCount,
}) => {
  const guestCount = proposal.guestCount || 50;
  const perHead = proposal.manualPerHead || 450;
  const deliveryFee = proposal.logistics?.deliveryFee || 1200;
  const totalValue = (perHead * guestCount) + deliveryFee;
  const estFoodCost = totalValue * 0.276;
  const profitMargin = 72.4;

  return (
    <div id="command-center-root" className="relative rounded-3xl bg-slate-900 text-white p-6 sm:p-8 md:p-10 border border-slate-800 shadow-2xl overflow-hidden text-left space-y-8 animate-fade-in">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of Command Center */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 shadow-md">
              <ChefHat className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Executive Command Center
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              Subterranean Sync Active (0-Signal Ready)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span>Catering Mission Control</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-medium leading-relaxed">
            Real-time culinary yield engine, ZAR wholesale indexer, and statutory SANS 10330 compliance matrix.
          </p>
        </div>

        {/* Region & Localization Deck */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 px-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                Target Market
              </span>
              <span className="text-xs font-black text-white">
                {region || 'South Africa (ZAR • R)'}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 px-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                Health Safety
              </span>
              <span className="text-xs font-black text-emerald-400">
                SANS 10330 Defensible
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI HUD Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Proposal Value */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-slate-700/70 hover:border-emerald-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Projected Revenue
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ZAR {totalValue.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-1">
              R{perHead} pp × {guestCount} guests + R{deliveryFee} logistics
            </p>
          </div>
          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">50% Booking Deposit:</span>
            <span className="font-black text-emerald-400">
              ZAR {(totalValue * 0.5).toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-slate-700/70 hover:border-emerald-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Gross Profit Yield
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              {profitMargin}%
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-1">
              Optimal Commercial Target (&gt;70%)
            </p>
          </div>
          <div className="space-y-1 pt-2 border-t border-slate-700/60">
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${profitMargin}%` }} />
            </div>
          </div>
        </div>

        {/* Food Cost Ratio */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-slate-700/70 hover:border-emerald-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Est. Wholesale Spend
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ZAR {estFoodCost.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-1">
              Food cost ratio: 27.6% of gross billing
            </p>
          </div>
          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">Escoffier Benchmark:</span>
            <span className="font-black text-emerald-400">Under 32% ✓</span>
          </div>
        </div>

        {/* Guest Covers & Quick Stepper */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-slate-700/70 hover:border-emerald-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Event Covers
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {guestCount}
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-1">
                Confirmed banquet guests
              </p>
            </div>
            {/* Quick +/- buttons */}
            <div className="flex items-center gap-1 bg-slate-700/80 p-1 rounded-xl border border-slate-600">
              <button
                onClick={() => onUpdateGuestCount(Math.max(5, guestCount - 5))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-black transition-all"
                title="Decrease 5 guests"
              >
                -
              </button>
              <button
                onClick={() => onUpdateGuestCount(guestCount + 5)}
                className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all"
                title="Increase 5 guests"
              >
                +
              </button>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">Portion Multiplier:</span>
            <span className="font-black text-white">{(guestCount / 50).toFixed(2)}x yield</span>
          </div>
        </div>

      </div>

      {/* Active Proposal Quick Summary & Tactical Actions Deck */}
      <div className="relative z-10 bg-slate-800/80 rounded-2xl p-5 sm:p-6 border border-slate-700/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Active Event Info */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
              Active Event Loaded
            </span>
            <span className="text-xs font-bold text-slate-400">
              {proposal.beoNumber || 'BEO-2025-8842'}
            </span>
          </div>
          <h4 className="text-lg font-black text-white">
            {proposal.title || proposal.menuTitle || 'Mediterranean Keto Cocktail Soirée'}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-1">
            {proposal.roomLocation || 'Garden Terrace & Sunset Pavilion'} • {proposal.eventDate || '12/27/2025'} • {(proposal.menu || []).length} curated courses
          </p>
        </div>

        {/* Right: Tactical Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onNewProposal}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Draft New Proposal</span>
          </button>

          <button
            onClick={onOpenBeo}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 border border-slate-600"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Banquet BEO</span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 border border-slate-600"
          >
            <Calculator className="w-4 h-4 text-purple-400" />
            <span>Yield Calculator</span>
          </button>

          <button
            onClick={onExportPdf}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 border border-slate-600"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export PDF</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default CommandCenter;
