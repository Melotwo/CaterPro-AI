import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Calculator, 
  FileCheck2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Download,
  School,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Menu } from '../../types';
import { StudentPoeEntry } from '../../types/academic';
import { INITIAL_STUDENT_POE } from '../../data/qctoCurriculum';
import QctoDisclaimerBanner from './QctoDisclaimerBanner';
import CurriculumMappingMatrix from './CurriculumMappingMatrix';
import LecturerLessonPlanGenerator from './LecturerLessonPlanGenerator';
import StudentPoeBuilder from './StudentPoeBuilder';
import FoodCostingDrills from './FoodCostingDrills';
import PoeExportModal from './PoeExportModal';

interface AcademicHubProps {
  proposal: Menu;
  onNotify?: (msg: string) => void;
  onOpenUpgrade?: () => void;
}

export const AcademicHub: React.FC<AcademicHubProps> = ({
  proposal,
  onNotify,
  onOpenUpgrade
}) => {
  const [activeAcademicTab, setActiveAcademicTab] = useState<'matrix' | 'lecturer' | 'poe' | 'drills'>('matrix');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportPoeData, setExportPoeData] = useState<StudentPoeEntry>(INITIAL_STUDENT_POE);

  const handleOpenExport = (poe: StudentPoeEntry) => {
    setExportPoeData(poe);
    setIsExportModalOpen(true);
  };

  return (
    <div id="academic-hub-container" className="space-y-8 text-left">
      
      {/* 1. Institutional QCTO Disclaimer Banner */}
      <QctoDisclaimerBanner />

      {/* 2. Top Academic Hub Header & Metric Quick-Stats */}
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors">
                <GraduationCap className="w-4 h-4" />
                QCTO / SAQA Academic Hub
              </span>
              <span className="px-3 py-1 rounded-full bg-red-950/40 text-red-400 border border-red-800/60 font-mono text-xs font-bold">
                South African Qualifications Companion
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                TVET & University Companion
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Institutional Culinary Education & Evidence Portal
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-3xl leading-relaxed">
              Equipping South African culinary academies, lecturers, and apprentice chefs with formal curriculum alignment, automated recipe costing workbooks, formative lesson plans, and verifiable Portfolios of Evidence (PoE).
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenExport(INITIAL_STUDENT_POE)}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-red-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Export Institutional Report</span>
            </button>

            {onOpenUpgrade && (
              <button
                type="button"
                onClick={onOpenUpgrade}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
              >
                <span>Institutional Academy Plans</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">3 Registered Qualifications</div>
            <div className="text-sm sm:text-base font-black text-red-400">SAQA 101697 • 102296 • 110644</div>
            <div className="text-[10px] text-slate-500">Chef (NQF 5), Cook (NQF 4), Kitchen Hand (NQF 3)</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Credits Covered</div>
            <div className="text-sm sm:text-base font-mono font-black text-emerald-400">840 SAQA Credits</div>
            <div className="text-[10px] text-slate-500">Knowledge, Practical & Workplace Modules</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Standards Compliance</div>
            <div className="text-sm sm:text-base font-black text-cyan-400">SANS 10330 / R638</div>
            <div className="text-[10px] text-slate-500">HACCP & 14-Allergen Safety Protocol</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Menu Integration</div>
            <div className="text-sm sm:text-base font-bold text-white line-clamp-1">
              {proposal.title || proposal.menuTitle || 'Banquet Event'}
            </div>
            <div className="text-[10px] text-red-400 font-mono">{proposal.guestCount || proposal.covers || 120} Covers Synced</div>
          </div>
        </div>
      </div>

      {/* 3. Primary Academic Navigation Tabs */}
      <div className="bg-slate-900/90 border border-white/10 p-2 rounded-2xl shadow-md flex flex-wrap items-center gap-1.5 text-xs font-bold">
        {[
          { id: 'matrix', label: 'Curriculum Mapping Matrix', icon: Layers, badge: 'QCTO Modules' },
          { id: 'lecturer', label: 'Lecturer Lesson Plan Generator', icon: BookOpen, badge: 'Briefs & Rubrics' },
          { id: 'poe', label: 'Student PoE Builder', icon: FileCheck2, badge: 'Evidence Files' },
          { id: 'drills', label: 'Food Costing Practical Drills', icon: Calculator, badge: 'Math Lab' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAcademicTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveAcademicTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-red-400'}`} />
              <span>{tab.label}</span>
              <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold ${
                isActive ? 'bg-red-950/80 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Active Sub-View */}
      <AnimatePresence mode="wait">
        {activeAcademicTab === 'matrix' && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <CurriculumMappingMatrix
              onOpenLessonPlanForModule={(moduleCode) => {
                setActiveAcademicTab('lecturer');
                if (onNotify) onNotify(`Switched to Lecturer Brief Generator for module ${moduleCode}.`);
              }}
            />
          </motion.div>
        )}

        {activeAcademicTab === 'lecturer' && (
          <motion.div
            key="lecturer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <LecturerLessonPlanGenerator
              proposal={proposal}
              onNotify={onNotify}
            />
          </motion.div>
        )}

        {activeAcademicTab === 'poe' && (
          <motion.div
            key="poe"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <StudentPoeBuilder
              proposal={proposal}
              onOpenExportModal={handleOpenExport}
              onNotify={onNotify}
            />
          </motion.div>
        )}

        {activeAcademicTab === 'drills' && (
          <motion.div
            key="drills"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FoodCostingDrills
              onNotify={onNotify}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Institutional Submission Export Modal */}
      <PoeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        poe={exportPoeData}
        onNotify={onNotify}
      />

    </div>
  );
};

export default AcademicHub;
