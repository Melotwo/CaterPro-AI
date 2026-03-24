import React from 'react';
import { Trophy, Download, Share2, CheckCircle, GraduationCap, ArrowLeft, Home } from 'lucide-react';

interface SuccessPageProps {
  proposal: any;
  onNewProposal: () => void;
  onExit: () => void;
  onDownloadPDF: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ 
  proposal, 
  onNewProposal, 
  onExit, 
  onDownloadPDF 
}) => {
  const formatCurrency = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleWhatsAppShare = () => {
    const text = `*QCTO Level 5 Culinary Proposal: ${proposal?.title}*%0A%0A` +
      `*Total Cost:* ${formatCurrency(proposal?.costPerHead * 50)} (est. 50 guests)%0A` +
      `*Waste Percentage:* ${100 - (proposal?.wasteYieldAnalysis?.yieldPercentage || 100)}%%0A` +
      `*Status:* QCTO Level 5 Compliant%0A%0A` +
      `Generated via CaterProAi`;
    
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 py-24">
      <div className="w-full max-w-3xl bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#10b981] to-[#059669] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-black rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-8 border border-white/30 animate-bounce">
              <Trophy className="text-white" size={48} />
            </div>
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Proposal Finalized!</h2>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30">
              <GraduationCap className="text-white" size={18} />
              <span className="text-white font-black uppercase tracking-widest text-[10px]">QCTO Level 5 Compliant</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-12">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Financial Summary</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{formatCurrency(proposal?.costPerHead * 50)}</span>
                <span className="text-slate-400 font-bold text-sm">Total Est.</span>
              </div>
              <p className="text-slate-500 text-xs mt-2 font-medium">Based on 50 guests @ {formatCurrency(proposal?.costPerHead)}/head</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Yield Intelligence</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#10b981]">{100 - (proposal?.wasteYieldAnalysis?.yieldPercentage || 100)}%</span>
                <span className="text-slate-400 font-bold text-sm">Waste</span>
              </div>
              <p className="text-slate-500 text-xs mt-2 font-medium">Efficiency Rating: {proposal?.wasteYieldAnalysis?.yieldPercentage || 100}% Yield</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <button 
                onClick={onDownloadPDF}
                className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                <Download size={20} />
                Download PDF Portfolio
              </button>
              <button 
                onClick={handleWhatsAppShare}
                className="flex-1 bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                <Share2 size={20} />
                Share to WhatsApp
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={onNewProposal}
                className="bg-white text-slate-900 border-2 border-slate-100 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
              >
                <ArrowLeft size={20} />
                New Proposal
              </button>
              <button 
                onClick={onExit}
                className="bg-white text-slate-900 border-2 border-slate-100 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
              >
                <Home size={20} />
                Exit to Office
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <CheckCircle size={12} className="text-[#10b981]" />
            Verified for QCTO Occupational Certificate: Chef (ID 101697)
          </p>
        </div>
      </div>
    </div>
  );
};
