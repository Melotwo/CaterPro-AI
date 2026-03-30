import React from 'react';

interface ProposalDocumentProps {
  proposal: any;
  proposalImage: string | null;
  eventType: string;
  guests: string;
  formatCurrency: (amount: number) => string;
  isExporting?: boolean;
}

const ProposalDocument: React.FC<ProposalDocumentProps> = ({
  proposal,
  proposalImage,
  eventType,
  guests,
  formatCurrency,
  isExporting = false
}) => {
  if (!proposal) return null;

  const bgClass = isExporting ? 'bg-white' : 'bg-slate-50';
  const cardClass = isExporting ? 'bg-white border-slate-200' : 'glass-card border-white/40';

  return (
    <div className={`min-h-screen ${bgClass}`} id="proposal-content">
      {/* Hero Section */}
      <div 
        className="h-[70vh] w-full bg-cover bg-center flex items-end p-8 md:p-24 relative overflow-hidden" 
        style={{backgroundImage: proposalImage ? `url('data:image/png;base64,${proposalImage}')` : `url('https://picsum.photos/seed/${proposal?.imageQuery || 'gourmet-food'}/1920/1080')`}}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent"/>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 -z-0" />
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6 backdrop-blur-md">
            <span className="text-emerald-400 text-xs">⚡</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">{eventType}</span>
          </div>
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none text-white uppercase drop-shadow-2xl">
            {proposal?.title}
          </h2>
          <div className="flex items-center gap-6 mt-8 text-white font-bold uppercase tracking-widest text-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍴</span>
              <span>{guests} Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <span className="text-gold">Level 5 Certified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 px-6 -mt-32 relative z-20 pb-32">
        <div className="lg:col-span-2 space-y-12">
          {/* Menu Section */}
          <div className={`${cardClass} p-16 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 -z-10" />
            <div className="flex items-center gap-4 mb-16 text-emerald-600">
              <span className="text-4xl">🍴</span>
              <h3 className="font-black text-4xl tracking-tighter text-charcoal dark:text-white uppercase">Menu Selection</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-16">
              {['Appetizers', 'Main Courses', 'Desserts'].map(cat => (
                <div key={cat} className="space-y-10">
                  <h4 className="text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-[0.4em] border-b border-slate-100 dark:border-slate-800 pb-4">{cat}</h4>
                  {proposal?.menu.filter((m:any) => m.cat === cat).map((item:any, i:number) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-start gap-4">
                        <h5 className="text-2xl font-black group-hover:text-emerald-600 transition-colors text-charcoal dark:text-white tracking-tight uppercase">{item.dish}</h5>
                        {item.qctoModule && (
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20 shrink-0">
                            {item.qctoModule}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-white/80 text-base leading-relaxed mt-4 font-medium italic">{item.notes}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Mise en Place & Service Notes Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className={`${cardClass} p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 -z-10" />
              <div className="flex items-center gap-4 mb-10 text-emerald-600">
                <span className="text-3xl">📋</span>
                <h3 className="font-black text-2xl tracking-tight text-charcoal dark:text-white uppercase">Mise en Place</h3>
              </div>
              <ul className="space-y-6">
                {proposal?.miseEnPlace?.map((step: string, i: number) => (
                  <li key={i} className="text-base text-slate-600 dark:text-white flex gap-6 font-medium leading-relaxed">
                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg">{String(i + 1).padStart(2, '0')}</span> {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${cardClass} p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 -z-10" />
              <div className="flex items-center gap-4 mb-10 text-emerald-600">
                <span className="text-3xl">✨</span>
                <h3 className="font-black text-2xl tracking-tight text-charcoal dark:text-white uppercase">Service Notes</h3>
              </div>
              <ul className="space-y-6">
                {proposal?.serviceNotes?.map((note: string, i: number) => (
                  <li key={i} className="text-base text-slate-600 dark:text-white flex gap-4 font-medium leading-relaxed">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* HACCP Safety & Quality Section */}
          <div className={`${cardClass} p-16 rounded-[4rem] border-emerald-500/20 shadow-2xl bg-emerald-500/5 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 -z-10" />
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4 text-emerald-600">
                <span className="text-4xl">🛡️</span>
                <h3 className="font-black text-3xl tracking-tighter text-charcoal dark:text-white uppercase">Safety & Quality (HACCP)</h3>
              </div>
              <div className="px-5 py-2 rounded-full bg-white dark:bg-slate-800 border border-emerald-500/20 shadow-sm">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Level 5 Compliant</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {proposal?.haccpSafety?.map((item: any, i: number) => (
                <div key={i} className="bg-white/80 dark:bg-slate-800/80 p-8 rounded-[2.5rem] border border-white/60 dark:border-slate-700 group hover:border-emerald-500/30 transition-all shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`w-3 h-3 rounded-full ${
                      item.category === 'Temp' ? 'bg-orange-500' : 
                      item.category === 'Storage' ? 'bg-blue-500' : 'bg-red-500'
                    } shadow-sm`} />
                    <span className="text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-widest">{item.category || 'General'}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] block mb-2">{item.point}</span>
                  <p className="text-lg text-charcoal dark:text-white font-bold leading-tight">{item.requirement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Waste & Yield Analysis (Training Mode) */}
          {proposal?.wasteYieldAnalysis && (
            <div className="bg-charcoal p-16 rounded-[4rem] shadow-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 -z-10" />
              <div className="flex items-center gap-4 mb-16 text-emerald-400">
                <span className="text-4xl">📊</span>
                <h3 className="font-black text-4xl tracking-tighter uppercase">Waste & Yield Analysis</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-16">
                <div className="space-y-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-3">AP Cost</span>
                      <div className="text-3xl font-black text-white">{formatCurrency(proposal.wasteYieldAnalysis.apCost)}</div>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-3">EP Cost</span>
                      <div className="text-3xl font-black text-emerald-400">{formatCurrency(proposal.wasteYieldAnalysis.epCost)}</div>
                    </div>
                  </div>
                  <div className="bg-emerald-500/10 p-10 rounded-[3rem] border border-emerald-500/20">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Cost Difference (Waste)</span>
                      <span className="text-3xl font-black text-white">{formatCurrency(proposal.wasteYieldAnalysis.costDifference)}</span>
                    </div>
                    <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                        style={{ width: `${proposal.wasteYieldAnalysis.yieldPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Yield: {proposal.wasteYieldAnalysis.yieldPercentage}%</span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Waste: {100 - proposal.wasteYieldAnalysis.yieldPercentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 relative">
                    <div className="absolute -top-6 -left-6 w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div className="flex items-center gap-3 mb-6 text-emerald-400">
                      <span className="text-xs font-black uppercase tracking-widest">QCTO Assessment Criteria</span>
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed font-medium italic">
                      "{proposal.wasteYieldAnalysis.qctoCriteria}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shopping List Section */}
          <div className={`${cardClass} p-16 rounded-[4rem] shadow-2xl relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 -z-10" />
            <div className="flex items-center gap-4 mb-16 text-emerald-600">
              <span className="text-4xl">🛒</span>
              <h3 className="font-black text-4xl tracking-tighter text-charcoal dark:text-white uppercase">Smart Shopping List</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {Object.entries(proposal?.shoppingList || {}).map(([cat, items]: [string, any]) => (
                <div key={cat} className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-[0.3em] border-b border-slate-100 dark:border-slate-800 pb-3">{cat}</h4>
                  <ul className="space-y-4">
                    {items.map((item: string, i: number) => (
                      <li key={i} className="text-base text-slate-700 dark:text-white flex gap-4 font-medium leading-tight">
                        <span className="text-emerald-600 dark:text-emerald-400 font-black">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Costing Card */}
          <div className={`${cardClass} p-12 rounded-[4rem] shadow-3xl sticky top-24 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 -z-10" />
            <div className="flex items-center gap-4 mb-10 text-emerald-600">
              <span className="text-3xl">🧮</span>
              <h3 className="font-black text-3xl tracking-tighter text-charcoal dark:text-white uppercase">Live Costing</h3>
            </div>
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-white text-[10px] font-black uppercase tracking-widest">Menu Cost</span>
                <span className="text-charcoal dark:text-white font-black text-2xl">{formatCurrency(proposal?.costPerHead * Number(guests))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-white text-[10px] font-black uppercase tracking-widest">Logistics</span>
                <span className="text-charcoal dark:text-white font-black text-2xl">{formatCurrency(proposal?.logistics?.deliveryFee || 0)}</span>
              </div>
              <div className="pt-10 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-700 dark:text-white text-[10px] uppercase font-black tracking-[0.4em] block mb-4">Total Proposal Value</span>
                <div className="text-6xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                  {formatCurrency((proposal?.costPerHead * Number(guests)) + (proposal?.logistics?.deliveryFee || 0))}
                </div>
              </div>
              <div className="pt-8">
                <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                  <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                    <span className="text-xs">📈</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Profit Margin: 65%</span>
                  </div>
                  <p className="text-[10px] text-slate-700 dark:text-white font-medium uppercase tracking-widest">Optimized for Executive Catering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDocument;
