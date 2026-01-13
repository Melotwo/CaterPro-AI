
import React, { useState } from 'react';
import { BookOpen, Copy, Zap, CheckCircle2, Sparkles, Award, GraduationCap, Share2, Scale, MessageSquare, Phone, ShieldCheck, Info, Anchor, CreditCard, Mail, User, Globe, Users, Briefcase, Send, Camera, Building2, BellRing, RefreshCw, Play, PlayCircle, Layers, MousePointer2, Image as ImageIcon, Download, Loader2, ListTree, Activity, MessageSquareQuote, ChevronRight, Video, Search, TrendingUp, X, Mic2, ArrowRight, Book } from 'lucide-react';
import { generateCulinaryInfographic } from '../services/geminiService';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  // Set 'lifecycle' as the default tab so the script is visible immediately
  const [activeTab, setActiveTab] = useState<'growth' | 'lifecycle'>('lifecycle');
  const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);
  const [generatedSheet, setGeneratedSheet] = useState<string | null>(null);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);

  const loomScript = `[INTRO - 0:00-0:15]
"Hi there, I’m Tumi. Most chefs think they are in the service business, but in 2026, we are in the LIFECYCLE business. I’ve built a system that shifts you from 'Chef-for-hire' to 'Club Founder'."

[THE ANALOGY - 0:15-0:45]
"Think of your catering business like a Private Social Club. 
Phase 1: The Lobby. This is your community on Whop or Skool. We use AI to provide free value—like custom menu tips—to build trust before they ever book you.
Phase 2: The Dining Room. This is the conversion. My app generates professional, personalized proposals in 30 seconds to close the deal instantly.
Phase 3: The Lounge. This is after the event. We automate the follow-ups and loyalty rewards so they never look for another chef again."

[THE VALUE - 0:45-1:15]
"By using this lifecycle approach, you aren't just selling food; you are building a data-driven brand. I use analytics to track exactly what your audience wants so we stop guessing and start growing."

[CLOSE - 1:15-1:30]
"I'm looking for 5 serious chefs to join this founder-led community. If you're ready to move from chaos to systems, let's talk. Click the link below."`;
  
  const handleOpenScript = () => {
    setIsScriptModalOpen(true);
  };

  const handleCopyLoomScript = () => {
    navigator.clipboard.writeText(loomScript);
    onShowToast("Script Copied to Clipboard!");
  };

  const handleGenerateInfographic = async (type: 'comparison' | 'meat_chart') => {
      setIsGeneratingSheet(true);
      setGeneratedSheet(null);
      try {
          const base64 = await generateCulinaryInfographic(type);
          setGeneratedSheet(base64);
          onShowToast("Cheat Sheet Rendered!");
      } catch (err) {
          console.error(err);
          onShowToast("Render failed. Try again.");
      } finally {
          setIsGeneratingSheet(false);
      }
  };

  const handleCopyAcademyPitch = () => {
    const text = `Subject: AI Integration for Francois Ferreira Academy - Solving Student PoE Admin\n\nDear Admissions/Dean,\n\nI noticed you are recruiting for the Class of 2026. I am the founder of CaterPro AI, a system built specifically for culinary students to automate the 'Portfolio of Evidence' (PoE) admin grind.\n\nOur tool generates professional menus and food costing in local ZAR currency instantly. I would love to show you how we can reduce your students' paperwork stress by 80% so they can spend more time in the academy kitchens.\n\nBest regards,\nTumi | Founder, CaterPro AI\nhttps://caterpro-ai.web.app/`;
    navigator.clipboard.writeText(text);
    onShowToast("Academy Pitch Copied!");
  };

  return (
    <div id="research-hub-section" className="mt-12 animate-slide-in scroll-mt-24">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 bg-indigo-600 border-b border-indigo-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                    <Globe size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Strategy Command</h3>
                    <p className="text-indigo-100 text-xs font-medium">Growth Hub & Lifecycle Architect</p>
                </div>
            </div>
            <div className="flex bg-indigo-700/50 p-1 rounded-xl border border-indigo-500/30">
                <button 
                  onClick={() => setActiveTab('growth')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'growth' ? 'bg-white text-indigo-600' : 'text-indigo-200 hover:text-white'}`}
                >
                    Growth Hub
                </button>
                <button 
                  onClick={() => { setActiveTab('lifecycle'); setGeneratedSheet(null); }}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'lifecycle' ? 'bg-white text-indigo-600' : 'text-indigo-200 hover:text-white'}`}
                >
                    Lifecycle Studio
                </button>
            </div>
        </div>

        {activeTab === 'growth' ? (
          <div className="animate-fade-in">
            {/* 4-Step Strategy Breakdown */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-3 mb-6">
                    <PlayCircle className="text-red-500" />
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">The 4-Step Viral Formula</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <span className="text-[10px] font-black text-red-500 uppercase">Step 1: The Hook</span>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-2">"Stop typing catering proposals. It's 2026."</p>
                    </div>
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <span className="text-[10px] font-black text-blue-500 uppercase">Step 2: The Value</span>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-2">Show the screen generating a 100-guest menu instantly.</p>
                    </div>
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <span className="text-[10px] font-black text-emerald-500 uppercase">Step 3: The Proof</span>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-2">"I saved 15 hours this week using CaterPro AI."</p>
                    </div>
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <span className="text-[10px] font-black text-amber-500 uppercase">Step 4: The Ask</span>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-2">"Comment 'CHEF' for the free tool link."</p>
                    </div>
                </div>
            </div>

            {/* Infographic Generator */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                    <Camera className="text-indigo-500" />
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Social Cheat Sheet Studio</h4>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-xs text-slate-500 font-bold leading-relaxed">Generate high-density educational assets to build authority.</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button onClick={() => handleGenerateInfographic('comparison')} disabled={isGeneratingSheet} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl disabled:opacity-50">
                                {isGeneratingSheet ? <Loader2 size={16} className="animate-spin" /> : <Layers size={16} />} Chef vs Cook
                            </button>
                            <button onClick={() => handleGenerateInfographic('meat_chart')} disabled={isGeneratingSheet} className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl disabled:opacity-50">
                                {isGeneratingSheet ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} Meat Mapping
                            </button>
                        </div>
                    </div>
                    <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-4 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                        {generatedSheet ? <img src={`data:image/png;base64,${generatedSheet}`} className="w-full h-full object-contain" /> : <p className="text-xs font-black text-slate-400 uppercase">Visual Asset Preview</p>}
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-slate-200 dark:border-slate-700">
                        <GraduationCap className="text-indigo-600 mb-4" />
                        <h4 className="text-lg font-black uppercase">Academy Outreach</h4>
                        <p className="text-xs text-slate-500 font-bold mt-2">Automate student PoE admin to win 2026 enrollments.</p>
                        <button onClick={handleCopyAcademyPitch} className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
                            <Mail size={16} /> Copy Academy Pitch
                        </button>
                    </div>
                    <div className="p-8 bg-slate-100 dark:bg-slate-800 rounded-[2rem] border-2 border-slate-200 dark:border-slate-700">
                        <MousePointer2 className="text-red-600 mb-4" />
                        <h4 className="text-lg font-black uppercase">Viral Bait</h4>
                        <p className="text-xs text-slate-500 font-bold mt-2">The "Comment CHEF" hook for Instagram growth.</p>
                        <button onClick={() => { navigator.clipboard.writeText(`I just used AI to write a 5-course Wedding Proposal in 30 seconds. 🤯 Comment "CHEF" for the link.`); onShowToast("Hook Copied!"); }} className="w-full mt-4 py-4 bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
                            <Copy size={16} /> Copy Hook
                        </button>
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="p-8 animate-fade-in space-y-8">
              {/* Lifecycle Architect Header */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
                  <div className="max-w-md">
                      <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Active Campaign Script</span>
                      </div>
                      <h4 className="text-2xl font-black tracking-tight leading-none mb-2">Lifecycle Architect</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">Your "Club Founder" pitch script is ready for recording below.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button 
                        onClick={handleCopyLoomScript}
                        className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-slate-200"
                    >
                        <Copy size={14} /> Copy Script
                    </button>
                    <button 
                        onClick={handleOpenScript}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                        <Video size={18} /> Launch Full-Screen
                    </button>
                  </div>
              </div>

              {/* STORYBOARD PREVIEW - Simplified and expanded for iPad reading */}
              <div className="p-8 bg-indigo-600 dark:bg-indigo-900 rounded-[2.5rem] shadow-2xl border-4 border-indigo-400/30">
                  <div className="flex items-center gap-3 mb-8">
                      <Book className="text-white" size={24} />
                      <h5 className="text-lg font-black uppercase tracking-widest text-white">Loom Pitch Storyboard</h5>
                  </div>
                  <div className="p-8 sm:p-12 bg-white dark:bg-slate-900 rounded-[2rem] shadow-inner border border-white/20">
                      <p className="text-xl sm:text-3xl font-bold leading-relaxed text-slate-800 dark:text-slate-100 italic whitespace-pre-wrap">
                          {loomScript}
                      </p>
                  </div>
                  <div className="mt-8 flex items-center justify-center gap-3 text-[11px] font-black text-indigo-100 uppercase tracking-[0.2em]">
                      <Sparkles size={14} className="text-amber-400" /> Practice this delivery before hitting record
                  </div>
              </div>

              {/* Lifecycle Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="p-8 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] relative group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-500"><Search size={80} /></div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block">Phase 1: Awareness</span>
                      <h5 className="text-xl font-black mb-3 text-slate-900 dark:text-white">The Lobby</h5>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6">Build trust in your Whop/Skool community through free educational resources and "behind-the-scenes" process videos.</p>
                      <ul className="space-y-3">
                          {['Free Recipes', 'Culinary Tips', 'Community Q&A'].map(i => (
                              <li key={i} className="flex items-center gap-2 text-[10px] font-black text-slate-700 dark:text-slate-300">
                                  <CheckCircle2 size={12} className="text-emerald-500" /> {i}
                              </li>
                          ))}
                      </ul>
                  </div>

                  <div className="p-8 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] relative group border-indigo-500/20 shadow-indigo-500/5 shadow-2xl">
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-500"><CreditCard size={80} /></div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block">Phase 2: Conversion</span>
                      <h5 className="text-xl font-black mb-3 text-slate-900 dark:text-white">The Dining Room</h5>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6">Transition members into clients using CaterPro AI’s personalized proposals and streamlined booking logistics.</p>
                      <ul className="space-y-3">
                          {['Pro Proposals', 'Shopping Lists', 'Clear CTA Hub'].map(i => (
                              <li key={i} className="flex items-center gap-2 text-[10px] font-black text-slate-700 dark:text-slate-300">
                                  <CheckCircle2 size={12} className="text-emerald-500" /> {i}
                              </li>
                          ))}
                      </ul>
                  </div>

                  <div className="p-8 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] relative group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-500"><TrendingUp size={80} /></div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block">Phase 3: Loyalty</span>
                      <h5 className="text-xl font-black mb-3 text-slate-900 dark:text-white">The Lounge</h5>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6">Create the "Loyalty Loop" with automated follow-ups, referral bonuses, and exclusive ongoing club access.</p>
                      <ul className="space-y-3">
                          {['Auto Follow-up', 'Referral Rewards', 'VIP Feedback'].map(i => (
                              <li key={i} className="flex items-center gap-2 text-[10px] font-black text-slate-700 dark:text-slate-300">
                                  <CheckCircle2 size={12} className="text-emerald-500" /> {i}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
        )}
      </div>

      {/* Teleprompter Modal - Focused for Recording */}
      {isScriptModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div onClick={() => setIsScriptModalOpen(false)} className="fixed inset-0 bg-slate-900/95 backdrop-blur-2xl animate-fade-in"></div>
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl border-4 border-indigo-500/20 overflow-hidden animate-scale-up h-[85vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50"></div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">Loom Teleprompter</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleCopyLoomScript} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all text-slate-500" title="Copy to Clipboard">
                        <Copy size={20} />
                    </button>
                    <button onClick={() => setIsScriptModalOpen(false)} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-500 transition-all text-slate-500">
                        <X size={24} />
                    </button>
                </div>
            </div>
            <div className="flex-grow p-12 sm:p-24 overflow-y-auto custom-scrollbar flex flex-col items-center">
                <p className="text-3xl sm:text-5xl font-bold leading-relaxed text-slate-800 dark:text-slate-200 italic text-center whitespace-pre-wrap max-w-4xl tracking-tight">
                    {loomScript}
                </p>
            </div>
            <div className="p-8 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl">
                        <Mic2 className="text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Active Script</p>
                        <p className="text-xs font-bold text-white">"Club Founder" Transition Pitch</p>
                    </div>
                </div>
                <button 
                  onClick={() => setIsScriptModalOpen(false)}
                  className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
                >
                    Finish Recording <ArrowRight size={18} />
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchHub;
