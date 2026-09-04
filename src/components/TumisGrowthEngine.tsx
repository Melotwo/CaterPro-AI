import React, { useState } from 'react';

export const TumisGrowthEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'moat' | 'next'>('status');

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-700">
              Waterberg TVET 2026 Drive
            </span>
          </div>
          <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tight">
            Tumi's Growth Engine
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Bridging Google Certified Marketing with local culinary education.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {[
            { id: 'status', label: 'Course Status' },
            { id: 'moat', label: 'Local Moat' },
            { id: 'next', label: 'Next Steps' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block mb-1">
                Local Opportunity Detected
              </span>
              <h4 className="text-base font-black text-slate-900">
                Waterberg TVET College (Limpopo)
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Offers Hospitality & Catering Services N4-N6 diplomas. Needs practical digital tools for QCTO occupational training.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block mb-1">
                Performance Strategy
              </span>
              <h4 className="text-base font-black text-slate-900">
                TVET Alignment
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Align CaterPro AI outputs with DHET (Department of Higher Education and Training) assessment criteria for culinary math.
              </p>
            </div>
          </div>

          {/* Pitch Strategy */}
          <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block mb-1">
              Pitch: "Automation for Occupational Students"
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "We teach culinary students how to calculate plate margins, scale batch recipes, and generate HACCP food safety checklists using AI — giving them an immediate edge in 4-star and 5-star hotel kitchens."
            </p>
          </div>

          {/* Progress Tracking */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-700">Google Foundations Certification</span>
              <span className="text-xs font-black text-emerald-600">88% (Almost Finished)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[88%]" />
            </div>
          </div>

          {/* Graduation Alert Notice */}
          <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-sm flex items-start gap-4">
            <span className="text-2xl shrink-0">🎓</span>
            <div>
              <h5 className="text-sm font-black uppercase tracking-wider">Module 4 Graduation Alert</h5>
              <p className="text-xs text-purple-100 mt-1 leading-relaxed">
                Tumi, using the TVET opportunity as a case study for Module 4 will help you pass with flying colors. It's real-world business thinking!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'moat' && (
        <div className="space-y-4">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="text-sm font-black text-slate-900 uppercase mb-2">🇿🇦 The South African Wholesale Advantage</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generic global AI tools don't understand ZAR wholesale pricing, Karoo lamb yields, or DHET TVET grading rubric requirements. CaterPro AI is anchored specifically to South African culinary realities.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="text-sm font-black text-slate-900 uppercase mb-2">🛡️ Offline-First Subterranean Architecture</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed to preserve cached recipe matrices and proposal templates so chefs working in remote lodges and deep underground mining dining facilities can operate with zero signal.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'next' && (
        <div className="space-y-4">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase">1. Waterberg TVET Proposal Packet</h4>
              <p className="text-xs text-slate-500 mt-1">Generate automated sample syllabus aligned with City & Guilds standard.</p>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Ready</span>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase">2. LinkedIn Certificate Announcement</h4>
              <p className="text-xs text-slate-500 mt-1">Publish Google AI Productivity 100% Grade credential to build immediate authority.</p>
            </div>
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">In Progress</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TumisGrowthEngine;
