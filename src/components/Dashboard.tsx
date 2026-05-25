import React from 'react';
import { motion } from 'framer-motion';
import { Menu, DashboardStats } from '../types';

interface DashboardViewProps {
  stats: DashboardStats;
  recent: Menu[];
  onGenerate: () => void;
  onSelectProposal: (menu: Menu) => void;
  region: string;
  setRegion: (region: string) => void;
}

const OCTAGON_CLIP = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const HERO_FALLBACK = "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80";

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recent,
  onGenerate,
  onSelectProposal,
  region,
  setRegion
}) => {
  return (
    <div id="dashboard-view-root" className="pt-32 max-w-7xl mx-auto px-6 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR: Globalized Command Center */}
        <div id="dashboard-sidebar" className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-xl space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Command Center</h3>
            </div>
            
            <div className="space-y-4">
              <label 
                id="region-input-label" 
                className="block text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60"
              >
                Target Localization
              </label>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-60">📍</span>
                <input 
                  id="region-input-field"
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. South Africa"
                  className="w-full p-4 pl-10 rounded-2xl border border-white/10 bg-slate-800/80 text-white font-bold outline-none focus:border-emerald-500 text-sm transition-all"
                />
              </div>
              
              <p className="text-[10px] text-slate-400 leading-relaxed italic opacity-70">
                Menu recipes and ingredient pricing models automatically adapt to current live wholesale data in <strong className="text-emerald-400">{region || 'your target region'}</strong>.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Live Cost Syncing</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Standard Currency</span>
                <span className="font-extrabold text-white uppercase">
                  {region.toLowerCase().includes('south africa') ? 'ZAR (R)' : 
                   region.toLowerCase().includes('united kingdom') || region.toLowerCase().includes('uk') || region.toLowerCase().includes('london') ? 'GBP (£)' :
                   region.toLowerCase().includes('europe') || region.toLowerCase().includes('france') || region.toLowerCase().includes('germany') || region.toLowerCase().includes('italy') || region.toLowerCase().includes('spain') ? 'EUR (€)' :
                   region.toLowerCase().includes('australia') ? 'AUD (A$)' : 'USD ($)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN VIEWS: Metric Grids and Proposals List */}
        <div id="dashboard-main-content" className="lg:col-span-3 space-y-12">
          {/* Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Proposals Generated', value: stats.totalProposals, sub: 'All time', icon: '📝' },
              { label: 'Est. Total Revenue', value: `R ${stats.totalRevenue.toLocaleString()}`, sub: 'ZAR', icon: '💰' },
              { label: 'Avg Profit Margin', value: `${stats.avgMargin.toFixed(1)}%`, sub: 'Calculated', icon: '📈' },
              { label: 'Last Event Type', value: stats.lastEventType || 'None Yet', sub: 'Recent', icon: '🏢' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-xl group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl">{stat.icon}</span>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
                </div>
                <h4 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h4>
                <p className="text-[10px] font-black text-emerald-500 uppercase opacity-40 mt-2">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Large CTA Card */}
          <div className="bg-emerald-600/10 border border-emerald-500/20 p-16 rounded-[4rem] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent opacity-50" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none">
                Draft your next <span className="text-emerald-500">Masterpiece</span>
              </h3>
              <p className="text-slate-400 font-medium italic max-w-md mx-auto opacity-70">
                Produce elite PDF proposals with live pricing localized to your client base in {region}.
              </p>
              <button onClick={onGenerate} className="px-16 py-8 bg-emerald-600 text-white rounded-[2.5rem] font-black uppercase text-sm hover:scale-105 transition-all shadow-2xl flex items-center gap-4 mx-auto" style={{ clipPath: OCTAGON_CLIP }}>
                <span className="text-2xl">⚡</span>
                Generate New Proposal
              </button>
            </div>
          </div>

          {/* Recent Proposals Grid */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Recent Proposals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recent.map((menu, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onSelectProposal(menu)} 
                  className="bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-white/10 overflow-hidden cursor-pointer group hover:scale-[1.02] transition-colors hover:border-emerald-500/30 transition-all"
                >
                  <div className="h-40 relative">
                    <img src={menu.heroImage || HERO_FALLBACK} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-80" />
                    {menu.heroImage?.includes('is_fallback=true') && (
                      <div className="absolute top-4 left-4 z-20 bg-slate-950/85 backdrop-blur-sm text-[8px] uppercase tracking-wider px-2.5 py-1 rounded-lg text-slate-400 font-bold border border-white/5">
                        Curated
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h5 className="font-black text-white uppercase italic truncate">{menu.title}</h5>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>{menu.guestCount} Guests</span>
                      <span className="text-emerald-500">R {(menu.manualTotal || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {recent.length === 0 && (
                <div className="col-span-3 py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem] text-slate-700 font-black italic uppercase tracking-widest">
                  No history yet. Start creating!
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default DashboardView;
