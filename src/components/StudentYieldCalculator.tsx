import React, { useState } from 'react';

const StudentYieldCalculator = () => {
  const [apWeight, setApWeight] = useState<string>('1000');
  const [epWeight, setEpWeight] = useState<string>('800');
  const [unitCost, setUnitCost] = useState<string>('150');

  const yieldPercentage = apWeight && epWeight ? (Number(epWeight) / Number(apWeight)) * 100 : 0;
  const trueCost = unitCost && yieldPercentage ? (Number(unitCost) / (yieldPercentage / 100)) : 0;
  const wasteCost = trueCost - Number(unitCost);

  return (
    <div className="bg-dark p-12 rounded-[3.5rem] border border-emerald-500/30 shadow-2xl relative overflow-hidden mt-12">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 -z-10" />
      
      <div className="flex items-center gap-4 mb-12 text-emerald-400">
        <span className="text-3xl">🧮</span>
        <h3 className="font-black text-3xl tracking-tighter text-white uppercase">AP/EP Yield Intelligence</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-6">
            <label className="block">
              <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em] mb-3 block">As Purchased (AP) Weight (g)</span>
              <input 
                type="number" 
                value={apWeight}
                onChange={(e) => setApWeight(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 font-black text-xl text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em] mb-3 block">Edible Portion (EP) Weight (g)</span>
              <input 
                type="number" 
                value={epWeight}
                onChange={(e) => setEpWeight(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 font-black text-xl text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em] mb-3 block">Cost per Kilogram (R)</span>
              <input 
                type="number" 
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 font-black text-xl text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -z-10" />
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Yield Efficiency</span>
              <div className="text-4xl font-black text-white">{yieldPercentage.toFixed(1)}%</div>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">AP Cost</span>
                <span className="font-black text-xl text-white">R{Number(unitCost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">EP Cost (True Cost)</span>
                <span className="font-black text-xl text-emerald-400">R{trueCost.toFixed(2)}</span>
              </div>
              <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Waste Cost Loss</span>
                <span className="font-black text-xl text-red-400">R{wasteCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 shrink-0">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">QCTO Student Tip</span>
              <p className="text-[10px] text-[#FFD700] font-medium leading-relaxed italic opacity-100">
                Always calculate EP cost to ensure your menu pricing covers actual ingredient usage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentYieldCalculator;
