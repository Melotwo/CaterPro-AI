import React, { useState } from 'react';
import { ArrowRight, BarChart3, PieChart, TrendingUp, DollarSign, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { QuickInfoModal } from './QuickInfoModal';
import Dashboard from './Dashboard';

const HeroSection: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; title: string; description: string; type: 'cost' | 'waste' | 'compliance' | 'general' }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'general'
  });

  const openModal = (title: string, description: string, type: 'cost' | 'waste' | 'compliance' | 'general') => {
    setModalInfo({ isOpen: true, title, description, type });
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-slate-50">
      <QuickInfoModal 
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo(prev => ({ ...prev, isOpen: false }))}
        title={modalInfo.title}
        description={modalInfo.description}
        type={modalInfo.type}
      />
      {/* Decorative Triangular Motifs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/5 mask-triangle rotate-12 -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 mask-triangle-inv -rotate-12 -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center pt-20 relative z-10">
        {/* Left Content: The Message */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left z-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <Zap size={14} className="text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#000000]">The 12th Edition • Luxury Suite</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-anchor leading-[0.9] mb-8 text-[#000000] uppercase tracking-tighter opacity-100">
            Chef in the <span className="text-[#10b981]">Kitchen.</span><br />
            AI in the <span className="italic font-serif">Office.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#000000] max-w-xl mb-12 leading-relaxed font-medium opacity-100">
            Precision catering intelligence for the modern executive. Elevate your operations with Michelin-star standards and automated financial health.
          </p>
          
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={onStart}
              className="bg-[#121212] text-[#FFD700] px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-2xl flex items-center gap-3 group"
            >
              Start Planning <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-emerald-500/30 bg-[#121212] shadow-xl">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-500/50 bg-slate-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/chef${i}/100/100`} alt="Chef" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <span className="block text-xs font-black uppercase tracking-widest text-[#FFD700]">Trusted by</span>
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">500+ Executive Chefs</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content: The 'Star of the Show' Dashboard - Repositioned for clear space */}
        <div className="relative lg:translate-x-8 xl:translate-x-16">
          <Dashboard onOpenModal={openModal} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
