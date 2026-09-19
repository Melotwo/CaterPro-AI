import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ArrowRight, 
  Lightbulb, 
  Award, 
  TrendingUp, 
  FileCheck2,
  Percent,
  Scale
} from 'lucide-react';
import { COSTING_DRILLS } from '../../data/qctoCurriculum';
import { CostingDrill } from '../../types/academic';

interface FoodCostingDrillsProps {
  onNotify?: (msg: string) => void;
  onRecordDrillScore?: (drillId: string, score: number) => void;
}

export const FoodCostingDrills: React.FC<FoodCostingDrillsProps> = ({
  onNotify,
  onRecordDrillScore
}) => {
  const [activeDrillIndex, setActiveDrillIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, { answered: boolean; correct: boolean; message: string }>>({});
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  const currentDrill = COSTING_DRILLS[activeDrillIndex];
  const userVal = userInputs[currentDrill.id] || '';
  const result = results[currentDrill.id];
  const isSolutionVisible = showSolution[currentDrill.id];

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(userVal.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) {
      if (onNotify) onNotify('Please enter a valid numeric answer.');
      return;
    }

    const diff = Math.abs(num - currentDrill.expectedAnswer);
    const isCorrect = diff <= currentDrill.tolerance;

    setResults(prev => ({
      ...prev,
      [currentDrill.id]: {
        answered: true,
        correct: isCorrect,
        message: isCorrect
          ? `Correct! Expected ${currentDrill.expectedAnswer} ${currentDrill.inputUnit} (Tolerance ±${currentDrill.tolerance}).`
          : `Not quite. Your answer was ${num}. Expected around ${currentDrill.expectedAnswer} ${currentDrill.inputUnit}. Check the solution breakdown below!`
      }
    }));

    if (isCorrect) {
      setShowSolution(prev => ({ ...prev, [currentDrill.id]: true }));
      if (onNotify) onNotify(`✅ Excellent! QCTO ${currentDrill.qctoModuleRef} drill completed accurately.`);
      if (onRecordDrillScore) onRecordDrillScore(currentDrill.id, 100);
    } else {
      if (onNotify) onNotify(`Review the formula steps for ${currentDrill.category}.`);
    }
  };

  const handleResetDrill = () => {
    setUserInputs(prev => ({ ...prev, [currentDrill.id]: '' }));
    setResults(prev => {
      const next = { ...prev };
      delete next[currentDrill.id];
      return next;
    });
    setShowSolution(prev => ({ ...prev, [currentDrill.id]: false }));
  };

  const completedCount = Object.values(results).filter(r => r.correct).length;

  return (
    <div id="food-costing-drills" className="space-y-6 text-left">
      {/* Top Banner & Progress */}
      <div className="bg-slate-900/90 border border-white/10 p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-red-400" />
            <span className="text-xs font-black uppercase tracking-wider text-red-400">
              QCTO Module KM-05 & KM-02 Culinary Costing Drills
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mt-1">
            Food Costing & Menu Engineering Practical Lab
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Interactive mathematical simulations: Butcher yields, trim allowances, EP vs AP pricing, and Gross Profit targets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-slate-950/70 px-4 py-2 rounded-2xl border border-white/5">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase text-slate-400">Mastery Progress</div>
            <div className="text-sm font-black text-emerald-400">{completedCount} of {COSTING_DRILLS.length} Passed</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400 font-black text-xs">
            {Math.round((completedCount / COSTING_DRILLS.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Drill Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {COSTING_DRILLS.map((drill, idx) => {
          const isSelected = idx === activeDrillIndex;
          const status = results[drill.id];
          return (
            <button
              key={drill.id}
              type="button"
              onClick={() => setActiveDrillIndex(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-red-950/40 border-red-600/60 shadow-md ring-1 ring-red-600/30'
                  : 'bg-slate-900/60 border-white/5 hover:border-white/20 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Drill {idx + 1}
                </span>
                {status?.correct ? (
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passed
                  </span>
                ) : status?.answered ? (
                  <span className="text-[9px] font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Retry
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-slate-500">Unattempted</span>
                )}
              </div>

              <div className="text-xs font-black text-white line-clamp-1">
                {drill.title}
              </div>
              <div className="text-[10px] text-red-400/90 font-medium mt-0.5">
                {drill.category}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Drill Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Drill Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-800/60 text-[10px] font-mono font-bold">
                {currentDrill.qctoModuleRef}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-[10px] font-black uppercase">
                {currentDrill.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                currentDrill.difficulty === 'Apprentice'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  : currentDrill.difficulty === 'Intermediate'
                  ? 'bg-red-950/50 text-red-400 border border-red-800/50'
                  : 'bg-purple-950 text-purple-400 border border-purple-500/30'
              }`}>
                {currentDrill.difficulty} Level
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              {currentDrill.title}
            </h4>
          </div>

          <button
            type="button"
            onClick={handleResetDrill}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Drill</span>
          </button>
        </div>

        {/* Practical Kitchen Scenario */}
        <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
            <span>🔪</span> Practical Kitchen Simulation Scenario:
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {currentDrill.scenario}
          </p>

          {/* Given Data Table */}
          <div className="pt-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Given Operational Data:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(currentDrill.givenData).map(([key, val], dIdx) => (
                <div key={dIdx} className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400 font-medium">{key}</div>
                  <div className="text-xs font-mono font-bold text-red-300 mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question & Input Form */}
        <form onSubmit={handleCheckAnswer} className="space-y-4">
          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-800/40 space-y-2">
            <label className="text-xs sm:text-sm font-bold text-red-200 block">
              Question: {currentDrill.question}
            </label>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={userVal}
                  onChange={(e) => setUserInputs(prev => ({ ...prev, [currentDrill.id]: e.target.value }))}
                  placeholder={`Enter value (e.g. ${currentDrill.expectedAnswer})`}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/20 focus:border-red-500 focus:outline-none rounded-xl text-sm font-mono font-bold text-white shadow-inner"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                  {currentDrill.inputUnit}
                </span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Verify Calculation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowSolution(prev => ({ ...prev, [currentDrill.id]: !prev[currentDrill.id] }))}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Lightbulb className="w-3.5 h-3.5 text-red-400" />
                <span>{isSolutionVisible ? 'Hide Solution' : 'View Formula'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Feedback Alert */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                result.correct
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              {result.correct ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="text-xs font-black uppercase tracking-wider">
                  {result.correct ? 'Assessment Standard Achieved' : 'Calculation Discrepancy'}
                </div>
                <div className="text-xs font-medium leading-relaxed">
                  {result.message}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step-by-Step Solution Breakdown */}
        <AnimatePresence>
          {isSolutionVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-2 overflow-hidden"
            >
              <div className="bg-slate-950/90 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Curriculum Mathematical Breakdown:</span>
                </div>

                <div className="space-y-2">
                  {currentDrill.solutionSteps.map((step, sIdx) => (
                    <div key={sIdx} className="text-xs font-mono text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                      {step}
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-200">
                  <strong className="text-red-300 font-bold">Chef Assessor Takeaway: </strong>
                  {currentDrill.learningTakeaway}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default FoodCostingDrills;
