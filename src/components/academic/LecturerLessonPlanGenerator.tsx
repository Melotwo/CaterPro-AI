import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  Scale, 
  ShieldAlert, 
  Award, 
  ChefHat, 
  Download,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { Menu } from '../../types';
import { LecturerLessonPlan } from '../../types/academic';
import { generateLessonPlanFromMenu, QCTO_QUALIFICATIONS } from '../../data/qctoCurriculum';

interface LecturerLessonPlanGeneratorProps {
  proposal: Menu;
  onNotify?: (msg: string) => void;
}

export const LecturerLessonPlanGenerator: React.FC<LecturerLessonPlanGeneratorProps> = ({
  proposal,
  onNotify
}) => {
  const [targetQual, setTargetQual] = useState<'chef' | 'cook' | 'kitchen-hand'>('chef');
  const [lessonPlan, setLessonPlan] = useState<LecturerLessonPlan>(() => 
    generateLessonPlanFromMenu(proposal, 'chef')
  );
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'brief' | 'yield' | 'questions' | 'haccp' | 'rubric'>('brief');

  const handleRegenerate = (qualId: 'chef' | 'cook' | 'kitchen-hand') => {
    setTargetQual(qualId);
    const updated = generateLessonPlanFromMenu(proposal, qualId);
    setLessonPlan(updated);
    if (onNotify) onNotify(`Regenerated Lesson Plan for ${updated.qualificationTitle}`);
  };

  const handleCopyPlan = () => {
    const text = `
=====================================================
CATERPRO AI • QCTO CULINARY LECTURER LESSON PLAN
=====================================================
Title: ${lessonPlan.title}
Qualification: ${lessonPlan.qualificationTitle} (${lessonPlan.qualificationCode})
Simulated Banquet Covers: ${lessonPlan.coversToSimulate}
Classroom Duration: ${lessonPlan.durationHours} Hours

1. PRACTICAL OBJECTIVE & BRIEF:
${lessonPlan.practicalBrief.objective}
Time Allotment: ${lessonPlan.practicalBrief.timeAllotmentMinutes} Minutes

Required Equipment:
${lessonPlan.practicalBrief.equipmentNeeded.map(e => ` - ${e}`).join('\n')}

Ingredients Focus:
${lessonPlan.practicalBrief.ingredientsFocus.map(i => ` - ${i}`).join('\n')}

2. YIELD MANAGEMENT & STANDARDIZED COSTING SHEET:
${lessonPlan.yieldSheet.map(y => ` - ${y.item}: AP Qty: ${y.asPurchasedQty} | Trim Loss: ${y.prepLossPercent}% | Net EP: ${y.ediblePortionQty} | Portion Cost: R ${y.actualPortionCostZar.toFixed(2)}`).join('\n')}

3. STUDENT PRACTICAL EXERCISES:
${lessonPlan.studentExerciseQuestions.map((q, idx) => `Q${idx + 1} [${q.type.toUpperCase()}]: ${q.question}\nBenchmark Answer: ${q.benchmarkAnswer}\n`).join('\n')}

4. SANS 10330 CRITICAL CONTROL POINTS (CCPs):
${lessonPlan.haccpCcpPoints.map(c => ` - Step: ${c.step} | Limit: ${c.criticalLimit} | Hazard: ${c.hazard}`).join('\n')}

5. ASSESSOR GRADING RUBRIC:
${lessonPlan.gradingRubric.map(r => ` - ${r.criterion} (${r.weightPercent}%): ${r.descriptor}`).join('\n')}

Institutional Disclaimer:
CaterProAI provides digital facilitation, automated recipe costing, menu engineering tools, and PoE evidence logging to complement accredited TVET & Culinary College delivery.
=====================================================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onNotify) onNotify('Copied formal Lesson Plan to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="lecturer-lesson-plan-generator" className="space-y-6 text-left">
      
      {/* Header & Controls */}
      <div className="bg-slate-900/90 border border-white/10 p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Lecturer Brief & Assessment Generator
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mt-1">
            QCTO Practical Lesson Plan & Grading Brief
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5 max-w-2xl">
            Converts the active proposal menu ({proposal.title || proposal.menuTitle || 'Banquet Event'}) into TVET-compliant culinary practical worksheets and assessment rubrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyPlan}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Plan'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Qualification Selector */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950/60 p-2 rounded-2xl border border-white/10">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
          Target Curriculum:
        </span>
        {QCTO_QUALIFICATIONS.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => handleRegenerate(q.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              targetQual === q.id
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            {q.title.replace('Occupational Certificate: ', '')} (NQF {q.nqfLevel})
          </button>
        ))}
      </div>

      {/* Inner Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 pb-2 text-xs">
        {[
          { id: 'brief', label: 'Practical Brief & Objectives', icon: BookOpen },
          { id: 'yield', label: 'Yield Management Sheet', icon: Scale },
          { id: 'questions', label: 'Student Costing Exercises', icon: FileText },
          { id: 'haccp', label: 'SANS 10330 CCP Checklist', icon: ShieldAlert },
          { id: 'rubric', label: 'Assessor Grading Rubric', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* 1. Practical Brief */}
        {activeSection === 'brief' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  {lessonPlan.qualificationCode}
                </span>
                <h4 className="text-lg font-black text-white uppercase tracking-tight mt-1.5">
                  {lessonPlan.title}
                </h4>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 font-mono bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                <div>Duration: <strong className="text-amber-300">{lessonPlan.durationHours}h</strong></div>
                <div>•</div>
                <div>Simulated Covers: <strong className="text-emerald-300">{lessonPlan.coversToSimulate} pax</strong></div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-amber-400">
                Practical Learning Objective:
              </h5>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/70 p-4 rounded-2xl border border-white/5">
                {lessonPlan.practicalBrief.objective}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-2">
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                  <span>Classroom Equipment Requisition:</span>
                </h5>
                <ul className="space-y-1 text-xs text-slate-300">
                  {lessonPlan.practicalBrief.equipmentNeeded.map((eq, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-2">
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Core Ingredients & Commodities:</span>
                </h5>
                <ul className="space-y-1 text-xs text-slate-300">
                  {lessonPlan.practicalBrief.ingredientsFocus.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 2. Yield Management Sheet */}
        {activeSection === 'yield' && (
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">
                Classroom Yield Management & Trimming Loss Matrix
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated As-Purchased (AP) procurement vs Edible Portion (EP) requirements across {lessonPlan.coversToSimulate} banquet covers.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/90 text-slate-400 border-b border-white/10 uppercase text-[10px] font-black">
                    <th className="p-3">Dish / Commodity</th>
                    <th className="p-3">AP Requisition</th>
                    <th className="p-3">Prep Loss %</th>
                    <th className="p-3">EP Net Yield</th>
                    <th className="p-3">Cost / kg</th>
                    <th className="p-3">Portion Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {lessonPlan.yieldSheet.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="p-3 font-bold text-white">{row.item}</td>
                      <td className="p-3 font-mono text-amber-300">{row.asPurchasedQty}</td>
                      <td className="p-3 font-mono text-rose-400">{row.prepLossPercent}%</td>
                      <td className="p-3 font-mono text-emerald-300">{row.ediblePortionQty}</td>
                      <td className="p-3 font-mono text-slate-300">R {row.costPerKgZar}</td>
                      <td className="p-3 font-mono font-bold text-amber-400">R {row.actualPortionCostZar.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Student Costing Exercises */}
        {activeSection === 'questions' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">
                Student Cost-Per-Portion & HACCP Exercises
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Classroom evaluation prompts designed for formative PoE evidence files.
              </p>
            </div>

            <div className="space-y-3">
              {lessonPlan.studentExerciseQuestions.map((q, idx) => (
                <div key={q.id} className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-700/50">
                      Exercise {idx + 1} • {q.type.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                    {q.question}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                      Lecturer Benchmark Model Answer:
                    </span>
                    <p className="font-mono text-[11px] text-emerald-200">
                      {q.benchmarkAnswer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SANS 10330 CCP Checklist */}
        {activeSection === 'haccp' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">
                SANS 10330 HACCP Critical Control Points (CCP) Guide
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Operational food safety parameters enforced throughout banquet preparation and service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lessonPlan.haccpCcpPoints.map((ccp, idx) => (
                <div key={idx} className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 space-y-2.5">
                  <div className="text-[10px] font-black uppercase text-amber-400 font-mono">
                    CCP #{idx + 1}: {ccp.step}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400">Microbial Hazard:</div>
                    <div className="text-xs text-slate-200 font-medium">{ccp.hazard}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/20">
                    <div className="text-[10px] font-black uppercase text-rose-300">Mandatory Critical Limit:</div>
                    <div className="text-xs font-mono font-bold text-rose-200">{ccp.criticalLimit}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400">Monitoring Procedure:</div>
                    <div className="text-xs text-slate-300">{ccp.monitoringProcedure}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Grading Rubric */}
        {activeSection === 'rubric' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">
                QCTO Practical Assessor Grading Rubric
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Weighted assessment criteria compliant with South African occupational evaluation standards.
              </p>
            </div>

            <div className="space-y-2.5">
              {lessonPlan.gradingRubric.map((rubric, idx) => (
                <div key={idx} className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs font-black text-white uppercase">
                      {rubric.criterion}
                    </div>
                    <p className="text-xs text-slate-300 font-medium max-w-2xl">
                      {rubric.descriptor}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Weight:</span>
                    <span className="text-xs font-black font-mono text-amber-400">{rubric.weightPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LecturerLessonPlanGenerator;
