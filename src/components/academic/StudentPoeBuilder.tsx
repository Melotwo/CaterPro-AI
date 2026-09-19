import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderCheck, 
  Upload, 
  Camera, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  User, 
  School, 
  Calendar, 
  ChefHat,
  Scale
} from 'lucide-react';
import { Menu } from '../../types';
import { StudentPoeEntry, PracticalPhotoProof } from '../../types/academic';
import { INITIAL_STUDENT_POE, QCTO_QUALIFICATIONS } from '../../data/qctoCurriculum';

interface StudentPoeBuilderProps {
  proposal: Menu;
  onOpenExportModal: (poe: StudentPoeEntry) => void;
  onNotify?: (msg: string) => void;
}

export const StudentPoeBuilder: React.FC<StudentPoeBuilderProps> = ({
  proposal,
  onOpenExportModal,
  onNotify
}) => {
  const [poe, setPoe] = useState<StudentPoeEntry>(() => {
    const saved = localStorage.getItem('caterpro_student_poe');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      ...INITIAL_STUDENT_POE,
      menuTitle: proposal.title || proposal.menuTitle || INITIAL_STUDENT_POE.menuTitle,
      guestCount: proposal.guestCount || proposal.covers || INITIAL_STUDENT_POE.guestCount
    };
  });

  const [newProofTitle, setNewProofTitle] = useState('');
  const [newProofPhase, setNewProofPhase] = useState<'Mise en Place' | 'Thermal Cooking' | 'Final Presentation' | 'HACCP Temperature Log'>('Mise en Place');
  const [newProofNotes, setNewProofNotes] = useState('');
  const [isAddingProof, setIsAddingProof] = useState(false);

  // Sync with current active proposal
  const handleSyncWithProposal = () => {
    const covers = proposal.guestCount || proposal.covers || 120;
    const perHead = proposal.manualPerHead || 450;
    const foodCost = (proposal.menu || []).reduce((sum, item) => sum + (item.cost || 35), 0) * covers;
    const sellingPrice = perHead * covers;
    const fcPercent = sellingPrice > 0 ? (foodCost / sellingPrice) * 100 : 28.0;

    setPoe(prev => ({
      ...prev,
      menuTitle: proposal.title || proposal.menuTitle || 'Executive Banquet Course',
      guestCount: covers,
      totalFoodCostZar: Math.round(foodCost),
      sellingPriceZar: Math.round(sellingPrice),
      foodCostPercentage: parseFloat(fcPercent.toFixed(1))
    }));

    if (onNotify) onNotify('Synced PoE values with active proposal menu!');
  };

  const handleSavePoe = () => {
    localStorage.setItem('caterpro_student_poe', JSON.stringify(poe));
    if (onNotify) onNotify('Saved Portfolio of Evidence locally!');
  };

  const handleAddPhotoProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProofTitle.trim()) return;

    const sampleImages = [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80',
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
      'https://images.unsplash.com/photo-1507048297686-2a6c8e3a24ea?w=600&q=80'
    ];
    const randomImg = sampleImages[poe.practicalProofs.length % sampleImages.length];

    const newProof: PracticalPhotoProof = {
      id: `proof-${Date.now()}`,
      title: newProofTitle,
      phase: newProofPhase,
      imageUrl: randomImg,
      notes: newProofNotes || 'Logged during culinary workshop simulation.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPoe(prev => ({
      ...prev,
      practicalProofs: [...prev.practicalProofs, newProof]
    }));

    setNewProofTitle('');
    setNewProofNotes('');
    setIsAddingProof(false);
    if (onNotify) onNotify(`Added practical proof: ${newProof.title}`);
  };

  const handleDeleteProof = (id: string) => {
    setPoe(prev => ({
      ...prev,
      practicalProofs: prev.practicalProofs.filter(p => p.id !== id)
    }));
    if (onNotify) onNotify('Removed practical photo proof.');
  };

  return (
    <div id="student-poe-builder" className="space-y-6 text-left">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-white/10 p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
              QCTO Workplace & Practical Evidence Logging
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mt-1">
            Student Portfolio of Evidence (PoE) Builder
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5 max-w-2xl">
            Compile your verified culinary evidence dossier: recipe costing logs, allergen management checklists, photo proofs, and reflective learning summaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSyncWithProposal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sync with Menu</span>
          </button>

          <button
            type="button"
            onClick={handleSavePoe}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FolderCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Save PoE</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenExportModal(poe)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Institutional Report</span>
          </button>
        </div>
      </div>

      {/* Student & Qualification Metadata Form */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/10 pb-3">
          <User className="w-4 h-4 text-amber-400" />
          <span>Learner & Institutional Enrollment Details</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Student Full Name</label>
            <input
              type="text"
              value={poe.studentName}
              onChange={(e) => setPoe({ ...poe, studentName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 focus:border-amber-400 focus:outline-none rounded-xl text-xs font-bold text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Student ID / Learner No.</label>
            <input
              type="text"
              value={poe.studentId}
              onChange={(e) => setPoe({ ...poe, studentId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 focus:border-amber-400 focus:outline-none rounded-xl text-xs font-mono font-bold text-amber-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Institution / TVET College</label>
            <input
              type="text"
              value={poe.institutionName}
              onChange={(e) => setPoe({ ...poe, institutionName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 focus:border-amber-400 focus:outline-none rounded-xl text-xs font-bold text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Qualification Target</label>
            <select
              value={poe.qualificationId}
              onChange={(e) => {
                const q = QCTO_QUALIFICATIONS.find(item => item.id === e.target.value);
                if (q) {
                  setPoe({
                    ...poe,
                    qualificationId: q.id,
                    saqaId: q.saqaId,
                    nqfLevel: q.nqfLevel
                  });
                }
              }}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 focus:border-amber-400 focus:outline-none rounded-xl text-xs font-bold text-white cursor-pointer"
            >
              {QCTO_QUALIFICATIONS.map(q => (
                <option key={q.id} value={q.id}>
                  {q.title} (SAQA {q.saqaId} • NQF {q.nqfLevel})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Curriculum Module Focus</label>
            <input
              type="text"
              value={poe.moduleFocus}
              onChange={(e) => setPoe({ ...poe, moduleFocus: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 focus:border-amber-400 focus:outline-none rounded-xl text-xs font-bold text-white"
            />
          </div>
        </div>
      </div>

      {/* Culinary Financial & Menu Costing Verification */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Formative Menu & Food Costing Verification (KM-05)</span>
          </h4>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            ZAR Currency Standardized
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
            <div className="text-[10px] font-bold text-slate-400">Linked Banquet Menu</div>
            <div className="text-xs font-black text-white line-clamp-1">{poe.menuTitle}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
            <div className="text-[10px] font-bold text-slate-400">Guest Count / Covers</div>
            <div className="text-xs font-mono font-bold text-amber-400">{poe.guestCount} Covers</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
            <div className="text-[10px] font-bold text-slate-400">Calculated Food Cost</div>
            <div className="text-xs font-mono font-bold text-emerald-400">R {poe.totalFoodCostZar.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
            <div className="text-[10px] font-bold text-slate-400">Achieved Food Cost %</div>
            <div className="text-xs font-mono font-black text-cyan-400">{poe.foodCostPercentage}% Target</div>
          </div>
        </div>
      </div>

      {/* Allergen Management Checklist */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/10 pb-3">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>SANS 10330 / R638 Allergen Risk Mitigation Plan</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {poe.allergenChecklist.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.allergen}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                  item.presentInMenu 
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30' 
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {item.presentInMenu ? 'Present in Menu' : 'Excluded'}
                </span>
              </div>
              <input
                type="text"
                value={item.mitigationPlan}
                onChange={(e) => {
                  const updated = [...poe.allergenChecklist];
                  updated[idx].mitigationPlan = e.target.value;
                  setPoe({ ...poe, allergenChecklist: updated });
                }}
                placeholder="Kitchen mitigation plan..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-[11px] text-slate-300 focus:border-amber-400 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Practical Photo Proofs Gallery */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Verified Practical Photo Evidence</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual proofs across Mise en Place, Cooking kinetics, Core Probe Logs, and Plated service.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingProof(!isAddingProof)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Photo Proof</span>
          </button>
        </div>

        {/* Add Proof Form */}
        <AnimatePresence>
          {isAddingProof && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddPhotoProof}
              className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-3 overflow-hidden"
            >
              <div className="text-xs font-black uppercase tracking-wider text-amber-400">
                Log New Culinary Evidence Record
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Proof Title</label>
                  <input
                    type="text"
                    required
                    value={newProofTitle}
                    onChange={(e) => setNewProofTitle(e.target.value)}
                    placeholder="e.g. Julienne Cut Calibration Test"
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Culinary Phase</label>
                  <select
                    value={newProofPhase}
                    onChange={(e) => setNewProofPhase(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="Mise en Place">Mise en Place</option>
                    <option value="Thermal Cooking">Thermal Cooking</option>
                    <option value="Final Presentation">Final Presentation</option>
                    <option value="HACCP Temperature Log">HACCP Temperature Log</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Technical Notes / Temperatures</label>
                  <input
                    type="text"
                    value={newProofNotes}
                    onChange={(e) => setNewProofNotes(e.target.value)}
                    placeholder="Record knife accuracy, core probe reading (e.g. 74.5°C), or yield variance..."
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingProof(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider"
                >
                  Save Proof to Dossier
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Proof Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {poe.practicalProofs.map((proof) => (
            <div key={proof.id} className="bg-slate-950/80 rounded-2xl border border-white/10 overflow-hidden group">
              <div className="h-40 relative overflow-hidden bg-slate-900">
                <img
                  src={proof.imageUrl}
                  alt={proof.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[9px] font-mono font-bold text-amber-300 border border-white/10">
                  {proof.phase}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteProof(proof.id)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-slate-950/80 text-rose-400 hover:bg-rose-950 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove proof"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 space-y-2 text-left">
                <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400">
                  <span className="font-mono">{proof.timestamp}</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Assessed
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white line-clamp-1">{proof.title}</h5>
                <p className="text-[11px] text-slate-300 font-medium line-clamp-2">{proof.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reflective Learning Journal */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2 border-b border-white/10 pb-3">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Student Reflective Learning Journal (QCTO Workplace Criteria)</span>
        </h4>
        <p className="text-xs text-slate-400">
          Reflect on operational challenges, thermal holding deviations, yield trimming variances, and solutions implemented during the brigade simulation.
        </p>
        <textarea
          rows={4}
          value={poe.reflectiveLog}
          onChange={(e) => setPoe({ ...poe, reflectiveLog: e.target.value })}
          className="w-full p-4 bg-slate-950 border border-white/10 focus:border-amber-400 focus:outline-none rounded-2xl text-xs sm:text-sm text-slate-200 leading-relaxed font-medium"
        />
      </div>

      {/* Lecturer Assessor Feedback Box */}
      <div className="bg-slate-950/90 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">✍️</span>
            <h5 className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Official Assessor Sign-off & Verification Status
            </h5>
          </div>

          <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
            {poe.lecturerVerification.status} (Score: {poe.lecturerVerification.marksAwarded}%)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Assessor Name</div>
            <div className="font-bold text-white mt-0.5">{poe.lecturerVerification.lecturerName}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Verification Timestamp</div>
            <div className="font-mono text-amber-300 mt-0.5">{poe.lecturerVerification.signedAt}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-300 italic">
          "{poe.lecturerVerification.feedback}"
        </div>
      </div>

    </div>
  );
};

export default StudentPoeBuilder;
