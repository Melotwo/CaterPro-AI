import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, DollarSign, Zap } from 'lucide-react';

interface DashboardProps {
  onOpenModal: (title: string, description: string, type: 'cost' | 'waste' | 'compliance' | 'general') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onOpenModal }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="relative"
    >
      {/* Solid Charcoal Background with Emerald Border */}
      <div className="bg-[#121212] rounded-[3rem] p-8 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-2 border-emerald-500/50 relative overflow-hidden group">
        {/* Abstract Chart Background - Slightly visible for texture */}
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
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
              <span className="text-base font-black uppercase tracking-[0.3em] text-[#FFD700] mb-1 block opacity-100">Financial Health</span>
              <h3 className="text-3xl font-anchor text-white uppercase tracking-tighter opacity-100">Menu Performance</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl border border-emerald-500/30">
              <TrendingUp size={28} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            {/* Total Cost Widget */}
            <button 
              onClick={() => onOpenModal('Total Cost', 'This is the comprehensive financial breakdown of your menu, including ingredient costs, labor, and overheads adjusted for ZAR market rates.', 'cost')}
              className="p-8 rounded-3xl bg-[#1a1a1a] border border-emerald-500/30 text-left hover:scale-105 transition-all active:scale-95 min-h-[140px] flex flex-col justify-between shadow-2xl group/btn"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover/btn:bg-emerald-500 group-hover/btn:text-white transition-colors">
                  <DollarSign size={20} />
                </div>
                <span className="text-base font-black uppercase tracking-widest text-[#FFFFFF] opacity-100">Total Cost</span>
              </div>
              <span className="text-4xl font-anchor text-white opacity-100">R42,500</span>
              <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-400 opacity-100">
                <TrendingUp size={12} /> Optimized for Profit
              </div>
            </button>

            {/* Waste % Widget */}
            <button 
              onClick={() => onOpenModal('Waste %', 'Automated yield analysis calculates exactly how much of your raw ingredients (AP) becomes usable product (EP), minimizing financial leakage.', 'waste')}
              className="p-8 rounded-3xl bg-[#1a1a1a] border border-emerald-500/30 text-left hover:scale-105 transition-all active:scale-95 min-h-[140px] flex flex-col justify-between shadow-2xl group/btn"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover/btn:bg-amber-500 group-hover/btn:text-white transition-colors">
                  <Zap size={20} />
                </div>
                <span className="text-base font-black uppercase tracking-widest text-[#FFFFFF] opacity-100">Waste %</span>
              </div>
              <span className="text-4xl font-anchor text-[#FFD700] opacity-100">12.4%</span>
              <div className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-400 opacity-100">
                <BarChart3 size={12} /> Below Industry Avg
              </div>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 rounded-2xl bg-[#1a1a1a] text-white border border-emerald-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <PieChart size={24} />
                </div>
                <div>
                  <span className="block text-base font-black uppercase tracking-widest text-white opacity-100">Wagyu Fusion</span>
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest opacity-100">Top Performer</span>
                </div>
              </div>
              <span className="text-2xl font-anchor text-emerald-400 opacity-100">R1,250</span>
            </div>
            <div className="flex items-center justify-between p-6 rounded-2xl bg-[#1a1a1a] border border-emerald-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <span className="block text-base font-black uppercase tracking-widest text-white opacity-100">Truffle Risotto</span>
                  <span className="text-xs text-[#FFD700] font-bold uppercase tracking-widest opacity-100">Steady Growth</span>
                </div>
              </div>
              <span className="text-2xl font-anchor text-white opacity-100">R850</span>
            </div>
          </div>
        </div>

        {/* Floating Badges */}
        <button 
          onClick={() => onOpenModal('QCTO Level 5', 'Your proposals are automatically mapped to QCTO Occupational Certificate: Chef (ID 101697) standards for Level 5 compliance.', 'compliance')}
          className="absolute -top-6 -right-6 w-36 h-36 bg-[#FFD700] rounded-full flex items-center justify-center border-8 border-[#121212] shadow-2xl rotate-12 group-hover:rotate-0 transition-transform active:scale-95 cursor-pointer z-20"
        >
          <div className="text-center">
            <span className="block text-xs font-black uppercase tracking-widest text-black">QCTO</span>
            <span className="block text-2xl font-anchor text-black">LEVEL 5</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default Dashboard;
