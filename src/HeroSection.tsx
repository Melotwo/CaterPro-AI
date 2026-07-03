import React, { useState } from 'react';
import QuickInfoModal from './QuickInfoModal';
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
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-white">
      <QuickInfoModal 
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo(prev => ({ ...prev, isOpen: false }))}
        title={modalInfo.title}
        description={modalInfo.description}
        type={modalInfo.type}
      />
      {/* Decorative Triangular Motifs - Solid Colors */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/10 mask-triangle rotate-12 -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 mask-triangle-inv -rotate-12 -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center pt-20 relative z-10">
        {/* Left Content: The Message */}
        <div className="text-left z-20 transition-all duration-700 ease-out">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <span className="text-emerald-600">⚡</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black opacity-100">The 12th Edition • Luxury Suite</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-anchor leading-[0.9] mb-8 text-black uppercase tracking-tighter opacity-100">
            PRECISION <span className="text-emerald">AI</span> FOR<br />
            MODERN <span className="italic font-serif text-emerald-600">CHEFS.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-black max-w-xl mb-12 leading-relaxed font-medium opacity-100">
            Automate proposals, analyze food costs, and generate Michelin-star recipes with our proprietary culinary intelligence engine.
          </p>
          
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={onStart}
              className="bg-dark text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-2xl flex items-center gap-3 group opacity-100"
            >
              Start Planning <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-emerald-500/30 bg-dark shadow-xl opacity-100">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-500/50 bg-slate-200 overflow-hidden flex items-center justify-center">
                    <span className="text-xl">👨‍🍳</span>
                  </div>
                ))}
              </div>
              <div className="text-left">
                <span className="block text-xs font-black uppercase tracking-widest text-white opacity-100">Trusted by</span>
                <span className="text-[10px] text-white font-bold uppercase tracking-widest opacity-100">500+ Executive Chefs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content: Dashboard */}
        <div className="relative lg:translate-x-8 xl:translate-x-16">
          <Dashboard onOpenModal={openModal} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
