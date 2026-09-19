import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  Scale, 
  ShieldCheck, 
  ChefHat, 
  FileText,
  Clock,
  Briefcase
} from 'lucide-react';
import { QCTO_QUALIFICATIONS } from '../../data/qctoCurriculum';
import { QctoQualification, QctoModule } from '../../types/academic';

interface CurriculumMappingMatrixProps {
  onSelectQualification?: (qualId: string) => void;
  onOpenLessonPlanForModule?: (moduleCode: string) => void;
}

export const CurriculumMappingMatrix: React.FC<CurriculumMappingMatrixProps> = ({
  onSelectQualification,
  onOpenLessonPlanForModule
}) => {
  const [activeQualId, setActiveQualId] = useState<'chef' | 'cook' | 'kitchen-hand'>('chef');
  const [filterType, setFilterType] = useState<'all' | 'Knowledge' | 'Practical' | 'Workplace'>('all');
  const [selectedModule, setSelectedModule] = useState<QctoModule | null>(null);

  const activeQual = QCTO_QUALIFICATIONS.find(q => q.id === activeQualId) || QCTO_QUALIFICATIONS[0];

  const filteredModules = activeQual.modules.filter(m => {
    if (filterType === 'all') return true;
    return m.type === filterType;
  });

  return (
    <div id="curriculum-mapping-matrix" className="space-y-6 text-left">
      
      {/* Qualification Selector Header Tabs */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-400">
                Registered QCTO Occupational Qualifications Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Select qualification to inspect curriculum module alignments, SAQA descriptors, and CaterProAI evidence tools.
            </p>
          </div>

          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-white/5">
            QCTO Curriculum Code Alignment 2025/2026
          </span>
        </div>

        {/* 3 Registered Qualification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {QCTO_QUALIFICATIONS.map((qual) => {
            const isSelected = qual.id === activeQualId;
            return (
              <button
                key={qual.id}
                type="button"
                onClick={() => {
                  setActiveQualId(qual.id);
                  setSelectedModule(null);
                  if (onSelectQualification) onSelectQualification(qual.id);
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-950/50 via-slate-900 to-amber-900/30 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-white/5 hover:border-white/20 hover:bg-slate-800/50 text-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-700/50">
                    SAQA ID {qual.saqaId}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    NQF Level {qual.nqfLevel}
                  </span>
                </div>

                <h4 className="text-sm font-black text-white uppercase tracking-tight line-clamp-1 mb-1">
                  {qual.title}
                </h4>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="font-semibold text-emerald-400">{qual.credits} Credits</span>
                  <span>•</span>
                  <span className="truncate">{qual.modules.length} Modules Mapped</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Qualification Overview Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-amber-900/30 text-amber-400 border border-amber-700/50 text-[10px] font-black uppercase tracking-wider">
                SAQA ID {activeQual.saqaId}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                NQF Level {activeQual.nqfLevel}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 text-[10px] font-mono font-bold">
                {activeQual.credits} Total Credits
              </span>
              <span className="px-2.5 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                Code: {activeQual.curriculumCode}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              {activeQual.title}
            </h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-3xl mt-2">
              {activeQual.purpose}
            </p>
          </div>

          <div className="lg:text-right shrink-0 space-y-1 bg-slate-950/50 p-3.5 rounded-2xl border border-white/5">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Industry Roles</div>
            <div className="flex flex-wrap lg:justify-end gap-1.5 max-w-xs">
              {activeQual.targetRoles.map((role, idx) => (
                <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-200 border border-amber-500/20">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Module Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-white/10 text-xs">
            {(['all', 'Knowledge', 'Practical', 'Workplace'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === t
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All Modules' : `${t} (${activeQual.modules.filter(m => m.type === t).length})`}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            Showing <strong className="text-white">{filteredModules.length}</strong> modules aligned with CaterProAI tools
          </span>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredModules.map((mod) => {
            const isModSelected = selectedModule?.code === mod.code;
            return (
              <div
                key={mod.code}
                onClick={() => setSelectedModule(isModSelected ? null : mod)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                  isModSelected
                    ? 'bg-amber-950/20 border-amber-500/50 ring-1 ring-amber-500/30 shadow-lg'
                    : 'bg-slate-950/60 border-white/10 hover:border-amber-500/30 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                      mod.type === 'Knowledge' 
                        ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700/50' 
                        : mod.type === 'Practical'
                        ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50'
                        : 'bg-purple-900/40 text-purple-300 border border-purple-700/50'
                    }`}>
                      {mod.code} • {mod.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {mod.credits} Credits
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    {isModSelected ? 'Collapse' : 'Details'} <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isModSelected ? 'rotate-90' : ''}`} />
                  </span>
                </div>

                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2">
                  {mod.title}
                </h4>

                {/* CaterProAI Tool Badges */}
                <div className="space-y-2 mb-3">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    CaterProAI Evidence Tool:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.caterproToolAlignment.map((tool, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-900/30 text-amber-300 border border-amber-700/40 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {tool.toolName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expandable Module Details */}
                <AnimatePresence>
                  {isModSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-white/10 space-y-3 overflow-hidden text-xs"
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                          Key Learning Outcomes:
                        </span>
                        <ul className="space-y-1 text-slate-300 list-disc list-inside">
                          {mod.learningOutcomes.map((lo, lIdx) => (
                            <li key={lIdx} className="text-[11px] leading-relaxed">
                              {lo}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                          Digital Evidence Produced:
                        </span>
                        {mod.caterproToolAlignment.map((tool, tIdx) => (
                          <div key={tIdx} className="text-[11px] text-slate-300">
                            <strong className="text-white">{tool.toolName}:</strong> {tool.evidenceProduced}
                          </div>
                        ))}
                      </div>

                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                          Assessment Criteria:
                        </span>
                        <ul className="space-y-1 text-slate-400">
                          {mod.assessmentCriteria.map((ac, aIdx) => (
                            <li key={aIdx} className="text-[10px] flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{ac}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {onOpenLessonPlanForModule && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenLessonPlanForModule(mod.code);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer mt-2"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Generate Lesson Plan for {mod.code}</span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CurriculumMappingMatrix;
