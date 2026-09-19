import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Printer, 
  Download, 
  FileCheck2, 
  Award, 
  ShieldCheck, 
  Calendar, 
  User, 
  School, 
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { StudentPoeEntry } from '../../types/academic';

interface PoeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  poe: StudentPoeEntry;
  onNotify?: (msg: string) => void;
}

export const PoeExportModal: React.FC<PoeExportModalProps> = ({
  isOpen,
  onClose,
  poe,
  onNotify
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(poe, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `QCTO_PoE_${poe.studentId}_${poe.saqaId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (onNotify) onNotify('Downloaded QCTO PoE evidence package in JSON format.');
  };

  const handleCopySummary = () => {
    const text = `
ACADEMIC CULINARY PORTFOLIO OF EVIDENCE (PoE) & PRACTICAL SUBMISSION REPORT
----------------------------------------------------------------------------
Student Name: ${poe.studentName}
Student ID / Learner No: ${poe.studentId}
Institution: ${poe.institutionName}
Qualification: SAQA ID ${poe.saqaId} (NQF Level ${poe.nqfLevel})
Curriculum Module: ${poe.moduleFocus}
Linked Menu: ${poe.menuTitle} (${poe.guestCount} Covers)
Calculated Food Cost: R ${poe.totalFoodCostZar.toFixed(2)} (${poe.foodCostPercentage}% of Selling Price R ${poe.sellingPriceZar.toFixed(2)})
Allergens Handled: ${poe.allergenChecklist.filter(a => a.presentInMenu).map(a => a.allergen).join(', ')}
Practical Proofs: ${poe.practicalProofs.length} verified submissions
Assessor Status: ${poe.lecturerVerification.status} (${poe.lecturerVerification.marksAwarded}%)
Assessor Signature: ${poe.lecturerVerification.lecturerName} [${poe.lecturerVerification.signedAt}]

DISCLAIMER:
CaterProAI provides digital facilitation, automated recipe costing, menu engineering tools, and PoE evidence logging to complement accredited TVET & Culinary College delivery.
----------------------------------------------------------------------------
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onNotify) onNotify('Copied PoE summary report to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-300 my-auto"
      >
        {/* Modal Action Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-950/40 text-red-400 border border-red-800/60 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white">
                Academic Culinary PoE & Practical Submission Report
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                SAQA ID {poe.saqaId} • NQF Level {poe.nqfLevel} • Formal Institutional Export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Copy Summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download JSON Package"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-red-600/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-left font-sans text-xs text-slate-800 printable-poe-report">
          
          {/* Institutional Header Banner */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-300 font-mono text-[10px] font-black uppercase">
                  QCTO • SAQA Portfolio of Evidence
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono">
                  Dossier Ref: {poe.id}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 mt-1.5">
                Practical Culinary Evidence Submission Report
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Accredited Qualification Assessment Dossier • TVET & Culinary College Delivery
              </p>
            </div>

            <div className="text-right shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="text-[10px] font-black uppercase text-slate-500">Submission Date</div>
              <div className="text-xs font-mono font-bold text-slate-900">{new Date(poe.timestamp).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="text-[10px] font-bold text-emerald-700 mt-1">Assessor Status: Verified</div>
            </div>
          </div>

          {/* Institutional Advisory Callout */}
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-950 leading-relaxed font-medium">
            <strong className="font-bold">Institutional Advisory: </strong>
            CaterProAI provides digital facilitation, automated recipe costing, menu engineering tools, and PoE evidence logging to complement accredited TVET & Culinary College delivery.
          </div>

          {/* Section 1: Candidate & Qualification Dossier */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <User className="w-3.5 h-3.5 text-red-600" />
              <span>Section 1: Candidate & Educational Institution Credentials</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Student Name</div>
                <div className="font-bold text-slate-900 mt-0.5">{poe.studentName}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Student ID / Learner No.</div>
                <div className="font-mono font-bold text-red-700 mt-0.5">{poe.studentId}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Institution / College</div>
                <div className="font-bold text-slate-900 mt-0.5">{poe.institutionName}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Registered Qualification</div>
                <div className="font-bold text-slate-900 mt-0.5">SAQA {poe.saqaId} (NQF {poe.nqfLevel})</div>
              </div>

              <div className="col-span-2 sm:col-span-4 pt-2 border-t border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">QCTO Curriculum Module Focus</div>
                <div className="font-semibold text-slate-800 mt-0.5">{poe.moduleFocus}</div>
              </div>
            </div>
          </div>

          {/* Section 2: Formative Recipe Costing & Menu Financials */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Section 2: Menu Engineering & Food Costing Verification (KM-05)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Linked Banquet Course</div>
                <div className="font-bold text-slate-900 mt-0.5">{poe.menuTitle}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Simulated Covers</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{poe.guestCount} Guests</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Total Raw Food Cost (ZAR)</div>
                <div className="font-mono font-bold text-emerald-700 mt-0.5">R {poe.totalFoodCostZar.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Achieved Food Cost %</div>
                <div className="font-mono font-black text-red-700 mt-0.5">{poe.foodCostPercentage}% (Target: 28%–32%)</div>
              </div>
            </div>
          </div>

          {/* Section 3: Allergen Safety Compliance Matrix */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>Section 3: SANS 10330 / R638 Allergen Risk Mitigation Plan</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 uppercase text-[10px] font-black border-b border-slate-200">
                    <th className="p-2.5">Regulated Allergen</th>
                    <th className="p-2.5">Presence Status</th>
                    <th className="p-2.5">Cross-Contamination Mitigation Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {poe.allergenChecklist.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold text-slate-900">{item.allergen}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.presentInMenu ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.presentInMenu ? 'Present in Menu' : 'Not Present'}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-700">{item.mitigationPlan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Verified Photo Proofs */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>📷</span>
              <span>Section 4: Practical Photo Evidence Dossier</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {poe.practicalProofs.map((proof) => (
                <div key={proof.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <div className="h-28 bg-slate-200">
                    <img src={proof.imageUrl} alt={proof.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2.5 space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                      <span>{proof.phase}</span>
                      <span>{proof.timestamp}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{proof.title}</div>
                    <div className="text-[11px] text-slate-600 line-clamp-2">{proof.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Student Reflective Journal */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Section 5: Candidate Reflective Learning Summary
            </h3>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
              "{poe.reflectiveLog}"
            </div>
          </div>

          {/* Section 6: Official Assessor Sign-Off & Verification Box */}
          <div className="border-2 border-slate-900 rounded-2xl p-5 bg-slate-50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 pb-3">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Section 6: Certified TVET / Academy Assessor Sign-Off
                </h4>
                <p className="text-[11px] text-slate-600">
                  Verification of workplace simulation and portfolio authenticity.
                </p>
              </div>

              <div className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-mono text-xs font-black uppercase tracking-wider">
                Assessment Outcome: {poe.lecturerVerification.status} ({poe.lecturerVerification.marksAwarded}%)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Assessor Name & Registration</span>
                <span className="font-bold text-slate-900">{poe.lecturerVerification.lecturerName}</span>
                <span className="block text-slate-600 font-mono text-[10px]">Assessor ID: {poe.lecturerVerification.lecturerId}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Verification & Digital Timestamp</span>
                <span className="font-mono font-bold text-slate-900">{poe.lecturerVerification.signedAt}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Assessor Formal Comments:</span>
                <p className="text-slate-800 italic mt-0.5">"{poe.lecturerVerification.feedback}"</p>
              </div>

              <div className="sm:col-span-2 pt-4 border-t border-slate-300 grid grid-cols-2 gap-8">
                <div>
                  <div className="border-b border-slate-400 h-8 flex items-end font-serif italic text-slate-800 text-sm">
                    {poe.lecturerVerification.lecturerName.split('(')[0]}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-slate-500">Official Assessor Signature</span>
                </div>

                <div>
                  <div className="border-b border-slate-400 h-8 flex items-end font-serif italic text-slate-800 text-sm">
                    {poe.studentName}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-slate-500">Candidate Signature</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[10px] text-slate-500 space-y-1 pt-2">
            <p>Generated by CaterProAI Academic Companion Portal • System Build v1.0.1 • SAQA / QCTO Digital Study & Evidence Workspace</p>
            <p className="italic">This document serves as an institutional evidence artifact for compilation into the formal QCTO qualification dossier.</p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default PoeExportModal;
