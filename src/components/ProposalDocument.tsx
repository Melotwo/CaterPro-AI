import React from 'react';
import { Utensils, ClipboardList, Sparkles, ShieldCheck, Percent, GraduationCap, ShoppingCart, Calculator } from 'lucide-react';

interface ProposalDocumentProps {
  proposal: any;
  proposalImage: string | null;
  eventType: string;
  guests: string;
  formatCurrency: (amount: number) => string;
}

export const ProposalDocument: React.FC<ProposalDocumentProps> = ({
  proposal,
  proposalImage,
  eventType,
  guests,
  formatCurrency
}) => {
  if (!proposal) return null;

  return (
    <div className="bg-white">
      <div 
        className="h-[60vh] w-full bg-cover bg-center flex items-end p-8 md:p-16 relative" 
        style={{backgroundImage: proposalImage ? `url('data:image/png;base64,${proposalImage}')` : `url('https://picsum.photos/seed/${proposal?.imageQuery || 'gourmet-food'}/1920/1080')`}}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"/>
        <div className="relative z-10">
          <span className="text-[#10b981] font-black uppercase tracking-[0.4em] text-xs mb-4 block">{eventType}</span>
          <h2 className="text-5xl md:text-8xl font-black relative z-10 tracking-tighter leading-none text-slate-900">{proposal?.title}</h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 px-6 -mt-20 relative z-20 pb-20">
        <div className="lg:col-span-2 space-y-8">
          {/* Menu Section */}
          <div className="backdrop-blur-md bg-white/70 p-10 rounded-[2.5rem] border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-10 text-[#10b981]">
              <Utensils size={28}/>
              <h3 className="font-black text-3xl tracking-tighter text-slate-900">Menu Selection</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              {['Appetizers', 'Main Courses', 'Desserts'].map(cat => (
                <div key={cat} className="space-y-8">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-3">{cat}</h4>
                  {proposal?.menu.filter((m:any) => m.cat === cat).map((item:any, i:number) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-start">
                        <h5 className="text-xl font-black group-hover:text-[#10b981] transition-colors text-slate-900 tracking-tight">{item.dish}</h5>
                        {item.qctoModule && (
                          <span className="bg-[#10b981]/10 text-[#10b981] px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border border-[#10b981]/20">
                            {item.qctoModule}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed mt-2 font-medium">{item.notes}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Mise en Place & Service Notes Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="backdrop-blur-md bg-white/70 p-8 rounded-[2rem] border border-white/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6 text-[#10b981]">
                <ClipboardList size={24}/>
                <h3 className="font-black text-xl tracking-tight text-slate-900">Mise en Place</h3>
              </div>
              <ul className="space-y-4">
                {proposal?.miseEnPlace?.map((step: string, i: number) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-4 font-medium">
                    <span className="text-[#10b981] font-black">{String(i + 1).padStart(2, '0')}</span> {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className="backdrop-blur-md bg-white/70 p-8 rounded-[2rem] border border-white/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6 text-[#10b981]">
                <Sparkles size={24}/>
                <h3 className="font-black text-xl tracking-tight text-slate-900">Service Notes</h3>
              </div>
              <ul className="space-y-4">
                {proposal?.serviceNotes?.map((note: string, i: number) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-4 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" /> {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* HACCP Safety & Quality Section */}
          <div className="backdrop-blur-md bg-emerald-50/50 p-10 rounded-[2.5rem] border border-[#10b981]/10 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 text-[#10b981]">
                <ShieldCheck size={28}/>
                <h3 className="font-black text-2xl tracking-tighter text-slate-900">Safety & Quality (HACCP)</h3>
              </div>
              <span className="bg-white px-4 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Level 5 Compliant</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {proposal?.haccpSafety?.map((item: any, i: number) => (
                <div key={i} className="bg-white/60 p-5 rounded-2xl border border-white/40 group hover:border-[#10b981]/30 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${
                      item.category === 'Temp' ? 'bg-orange-500' : 
                      item.category === 'Storage' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category || 'General'}</span>
                  </div>
                  <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest block mb-1">{item.point}</span>
                  <p className="text-sm text-slate-700 font-bold">{item.requirement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Waste & Yield Analysis (Training Mode) */}
          {proposal?.wasteYieldAnalysis && (
            <div className="backdrop-blur-md bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white">
              <div className="flex items-center gap-3 mb-10 text-[#10b981]">
                <Percent size={28}/>
                <h3 className="font-black text-3xl tracking-tighter">Waste & Yield Analysis</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">AP Cost</span>
                      <div className="text-2xl font-black text-white">{formatCurrency(proposal.wasteYieldAnalysis.apCost)}</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">EP Cost</span>
                      <div className="text-2xl font-black text-[#10b981]">{formatCurrency(proposal.wasteYieldAnalysis.epCost)}</div>
                    </div>
                  </div>
                  <div className="bg-[#10b981]/10 p-8 rounded-[2rem] border border-[#10b981]/20">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-[#10b981]">Cost Difference (Waste)</span>
                      <span className="text-2xl font-black text-white">{formatCurrency(proposal.wasteYieldAnalysis.costDifference)}</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#10b981] h-full transition-all duration-1000" 
                        style={{ width: `${proposal.wasteYieldAnalysis.yieldPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Yield: {proposal.wasteYieldAnalysis.yieldPercentage}%</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Waste: {100 - proposal.wasteYieldAnalysis.yieldPercentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <div className="flex items-center gap-2 mb-4 text-[#10b981]">
                      <GraduationCap size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">QCTO Assessment Criteria</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-medium italic">
                      "{proposal.wasteYieldAnalysis.qctoCriteria}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shopping List Section */}
          <div className="backdrop-blur-md bg-white/70 p-10 rounded-[2.5rem] border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-10 text-[#10b981]">
              <ShoppingCart size={28}/>
              <h3 className="font-black text-3xl tracking-tighter text-slate-900">Smart Shopping List</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(proposal?.shoppingList || {}).map(([cat, items]: [string, any]) => (
                <div key={cat} className="space-y-5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{cat}</h4>
                  <ul className="space-y-3">
                    {items.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-slate-500 flex gap-3 font-medium">
                        <span className="text-[#10b981]/40">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Costing Card */}
          <div className="backdrop-blur-md bg-white/80 p-10 rounded-[2.5rem] border border-white/20 shadow-2xl sticky top-24">
            <div className="flex items-center gap-3 mb-8 text-[#10b981]">
              <Calculator size={28}/>
              <h3 className="font-black text-2xl tracking-tighter text-slate-900">Live Costing</h3>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Menu Cost</span>
                <span className="text-slate-900 font-black text-lg">{formatCurrency(proposal?.costPerHead * Number(guests))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Logistics</span>
                <span className="text-slate-900 font-black text-lg">{formatCurrency(proposal?.logistics?.deliveryFee || 0)}</span>
              </div>
              <div className="pt-8 border-t border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] block mb-2">Total Proposal Value</span>
                <div className="text-5xl font-black text-[#10b981] tracking-tighter">
                  {formatCurrency((proposal?.costPerHead * Number(guests)) + (proposal?.logistics?.deliveryFee || 0))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
