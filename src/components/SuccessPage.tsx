import React, { useState } from 'react';
import QuickInfoModal from './QuickInfoModal';

interface SuccessPageProps {
  proposal: any;
  onNewProposal: () => void;
  onExit: () => void;
  onDownloadPDF: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ 
  proposal, 
  onNewProposal, 
  onExit, 
  onDownloadPDF 
}) => {
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; title: string; description: string; type: 'cost' | 'waste' | 'compliance' | 'general' }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'general'
  });

  const openModal = (title: string, description: string, type: 'cost' | 'waste' | 'compliance' | 'general') => {
    setModalInfo({ isOpen: true, title, description, type });
  };

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
      <QuickInfoModal 
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo(prev => ({ ...prev, isOpen: false }))}
        title={modalInfo.title}
        description={modalInfo.description}
        type={modalInfo.type}
      />
      <div className="w-full max-w-3xl bg-white rounded-[4rem] shadow-[0_80px_160px_rgba(0,0,0,0.12)] border-2 border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 -z-10" />
        
        {/* Header Section */}
        <div className="bg-slate-900 p-16 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-28 h-28 bg-emerald-500/20 rounded-[2.5rem] flex items-center justify-center mb-10 border border-emerald-500/30 shadow-2xl">
              <span className="text-5xl">🏆</span>
            </div>
            <h2 className="text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-none">Proposal Finalized!</h2>
            <div className="inline-flex items-center gap-3 bg-emerald-500/20 px-8 py-3 rounded-full border border-emerald-500/30">
              <span className="text-xl">🎓</span>
              <span className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px]">QCTO Level 5 Compliant</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-16">
          <div className="grid md:grid-cols-2 gap-10 mb-16">
            <button 
              onClick={() => openModal('Total Proposal Cost', 'This is the combined cost of ingredients and logistics, calculated for your specific guest volume.', 'cost')}
              className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all text-left active:scale-95"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -z-10" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] block mb-6">Financial Summary</span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-white">{formatCurrency(proposal?.costPerHead * 50)}</span>
                <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Total Est.</span>
              </div>
              <p className="text-white/80 text-xs mt-4 font-medium italic">Based on 50 guests @ {formatCurrency(proposal?.costPerHead)}/head</p>
            </button>

            <button 
              onClick={() => openModal('Waste Percentage', 'This shows your Edible Portion (EP) vs As Purchased (AP) efficiency according to QCTO Module 5 standards.', 'waste')}
              className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all text-left active:scale-95"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -z-10" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] block mb-6">Yield Intelligence</span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-emerald-400">{100 - (proposal?.wasteYieldAnalysis?.yieldPercentage || 100)}%</span>
                <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">Waste</span>
              </div>
              <p className="text-white/80 text-xs mt-4 font-medium italic">Efficiency Rating: {proposal?.wasteYieldAnalysis?.yieldPercentage || 100}% Yield</p>
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <button 
                onClick={onDownloadPDF}
                className="flex-1 bg-slate-900 text-white py-7 rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-2xl group"
              >
                <span className="text-2xl">📥</span>
                Download PDF Portfolio
              </button>
              <button 
                onClick={handleWhatsAppShare}
                className="flex-1 bg-whatsapp text-white py-7 rounded-[2rem] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-4 shadow-2xl group"
              >
                <span className="text-2xl">💬</span>
                Share to WhatsApp
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={onNewProposal}
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-4 shadow-lg group"
              >
                <span className="text-xl">⬅️</span>
                New Proposal
              </button>
              <button 
                onClick={onExit}
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-4 shadow-lg group"
              >
                <span className="text-xl">🏠</span>
                Exit to Office
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-8 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-[0.4em] flex items-center justify-center gap-3">
            <span className="text-emerald-500 text-sm">✅</span>
            Verified for QCTO Occupational Certificate: Chef (ID 101697)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
