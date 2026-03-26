
import React, { useState } from 'react';
import { ArrowRight, BarChart3, PieChart, TrendingUp, DollarSign, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { QuickInfoModal } from './QuickInfoModal';

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
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden noise-bg">
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
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-20">
        {/* Left Content: The Message */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <Zap size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">The 12th Edition • Luxury Suite</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-anchor leading-[0.9] mb-8 text-charcoal">
            Chef in the <span className="text-[#10b981]">Kitchen.</span><br />
            AI in the <span className="italic font-serif">Office.</span>
          </h1>
          
          <p className="text-xl text-medium max-w-xl mb-12 leading-relaxed">
            Precision catering intelligence for the modern executive. Elevate your operations with Michelin-star standards and automated financial health.
          </p>
          
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={onStart}
              className="bg-charcoal text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl flex items-center gap-3 group"
            >
              Start Planning <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-slate-200 glass-card">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/chef${i}/100/100`} alt="Chef" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <span className="block text-xs font-black uppercase tracking-widest text-charcoal">Trusted by</span>
                <span className="text-[10px] text-medium">500+ Executive Chefs</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content: The 'Star of the Show' Dashboard */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card rounded-[3rem] p-8 shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-white/40 relative overflow-hidden group">
            {/* Abstract Chart Background */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <path d="M0,400 L50,350 L100,380 L150,300 L200,340 L250,250 L300,280 L350,200 L400,220 L400,400 Z" fill="url(#grad)" />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1 block">Financial Health</span>
                  <h3 className="text-2xl font-anchor text-charcoal">Menu Performance</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-charcoal flex items-center justify-center text-emerald-400 shadow-xl">
                  <TrendingUp size={24} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <button 
                  onClick={() => openModal('Net Margin', 'This represents your actual profit after all ingredient and operational costs are deducted, optimized for ZAR market rates.', 'cost')}
                  className="p-6 rounded-3xl bg-white/60 border border-white/80 text-left hover:scale-105 transition-all active:scale-95 min-h-[120px] flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <DollarSign size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Net Margin</span>
                  </div>
                  <span className="text-3xl font-anchor text-charcoal">68.4%</span>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <TrendingUp size={10} /> +12% vs LY
                  </div>
                </button>
                <button 
                  onClick={() => openModal('Yield Efficiency', 'This shows your Edible Portion (EP) vs As Purchased (AP) efficiency according to QCTO Module 5 standards.', 'waste')}
                  className="p-6 rounded-3xl bg-white/60 border border-white/80 text-left hover:scale-105 transition-all active:scale-95 min-h-[120px] flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                      <Zap size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Yield Efficiency</span>
                  </div>
                  <span className="text-3xl font-anchor text-charcoal">94.2%</span>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-600">
                    <BarChart3 size={10} /> QCTO Level 5
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-charcoal text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-charcoal">
                      <PieChart size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-widest">Wagyu Fusion</span>
                      <span className="text-[10px] text-emerald-400/90 font-bold uppercase tracking-widest">Top Performer</span>
                    </div>
                  </div>
                  <span className="font-anchor text-emerald-400">R1,250</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <BarChart3 size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-widest text-charcoal">Truffle Risotto</span>
                      <span className="text-[10px] text-medium">Steady Growth</span>
                    </div>
                  </div>
                  <span className="font-anchor text-charcoal">R850</span>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <button 
              onClick={() => openModal('QCTO Level 5', 'Your proposals are automatically mapped to QCTO Occupational Certificate: Chef (ID 101697) standards for Level 5 compliance.', 'compliance')}
              className="absolute -top-6 -right-6 w-32 h-32 bg-gold rounded-full flex items-center justify-center border-8 border-white shadow-2xl rotate-12 group-hover:rotate-0 transition-transform active:scale-95 cursor-pointer z-20"
            >
              <div className="text-center">
                <span className="block text-[10px] font-black uppercase tracking-widest text-white">QCTO</span>
                <span className="block text-xl font-anchor text-white">LEVEL 5</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
