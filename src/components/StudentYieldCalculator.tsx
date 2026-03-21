import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export const StudentYieldCalculator = () => {
  const [apWeight, setApWeight] = useState(''); // As Purchased
  const [epWeight, setEpWeight] = useState(''); // Edible Portion
  const [unitCost, setUnitCost] = useState('');

  const yieldPercentage = apWeight && epWeight ? (Number(epWeight) / Number(apWeight)) * 100 : 0;
  const trueCost = unitCost && yieldPercentage ? (Number(unitCost) / (yieldPercentage / 100)) : 0;

  return (
    <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl mt-8">
      <div className="flex items-center gap-3 mb-6 text-[#10b981]">
        <Calculator size={24} />
        <h3 className="font-bold text-xl tracking-tighter">Student Food Math Sandbox</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AP Weight (kg)</label>
          <input 
            type="number" 
            value={apWeight}
            onChange={(e) => setApWeight(e.target.value)}
            placeholder="e.g. 5.0"
            className="w-full bg-slate-50 p-4 rounded-xl text-black mt-2 outline-none border border-slate-200 focus:ring-2 focus:ring-[#10b981]"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EP Weight (kg)</label>
          <input 
            type="number" 
            value={epWeight}
            onChange={(e) => setEpWeight(e.target.value)}
            placeholder="e.g. 3.5"
            className="w-full bg-slate-50 p-4 rounded-xl text-black mt-2 outline-none border border-slate-200 focus:ring-2 focus:ring-[#10b981]"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AP Price (R/kg)</label>
          <input 
            type="number" 
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
            placeholder="e.g. 150"
            className="w-full bg-slate-50 p-4 rounded-xl text-black mt-2 outline-none border border-slate-200 focus:ring-2 focus:ring-[#10b981]"
          />
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="bg-[#10b981]/10 p-4 rounded-2xl border border-[#10b981]/20">
          <span className="text-[10px] font-bold text-[#10b981] uppercase">Yield Percentage</span>
          <div className="text-3xl font-black text-[#10b981]">{yieldPercentage.toFixed(1)}%</div>
          <p className="text-[10px] text-slate-500 mt-1 italic">WorldChefs Standard: AP / EP</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">True Cost (EP)</span>
          <div className="text-3xl font-black text-white">R {trueCost.toFixed(2)}</div>
          <p className="text-[10px] text-slate-400 mt-1 italic text-[#10b981]">Cost adjusted for waste</p>
        </div>
      </div>
    </div>
  );
};
