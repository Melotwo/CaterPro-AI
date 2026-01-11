
import React, { useState } from 'react';
import { BookOpen, Copy, Zap, CheckCircle2, Sparkles, Award, GraduationCap, Share2, Scale, MessageSquare, Phone, ShieldCheck, Info, Anchor, CreditCard, Mail, User, Globe, Users, Briefcase, Send, Camera, Building2, BellRing, RefreshCw, Play, PlayCircle, Layers, MousePointer2, Image as ImageIcon, Download, Loader2 } from 'lucide-react';
import { generateCulinaryInfographic } from '../services/geminiService';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [notified, setNotified] = useState(false);
  const [reminded, setReminded] = useState(false);
  const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);
  const [generatedSheet, setGeneratedSheet] = useState<string | null>(null);
  
  const handleCopyTikTokBio = () => {
    const text = `Chef Tumi | AI for Chefs 🔪\nHelping Culinary Students crush their PoE paperwork.\nStop typing. Start cooking. 2026 is here.\nFree Menu Generator below 👇`;
    navigator.clipboard.writeText(text);
    onShowToast("TikTok Bio Copied!");
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

  const handleCopyLeadMagnetHook = () => {
    const text = `I just used AI to write a 5-course Wedding Proposal in 30 seconds (with a full shopping list). 🤯\n\nIf you want the exact system I used to save 4 hours of admin today, comment "CHEF" below and I'll send you the link for free.`;
    navigator.clipboard.writeText(text);
    onShowToast("Lead Magnet Hook Copied!");
  };

  const handleNotifyMe = () => {
      setNotified(true);
      onShowToast("Tracking outreach...");
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
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">2026 Growth Hub</h3>
                    <p className="text-indigo-100 text-xs font-medium">Strategic Outreach & Social Assets</p>
                </div>
            </div>
            <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-amber-400 rounded-full text-[10px] font-black text-slate-900 shadow-lg">MISSION ACTIVE</span>
            </div>
        </div>

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

        {/* --- NEW: SOCIAL CHEAT SHEET STUDIO --- */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
                <Camera className="text-indigo-500" />
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Social Cheat Sheet Studio</h4>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                        Generate educational charts for TikTok and Instagram to build authority. Based on your references.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                            onClick={() => handleGenerateInfographic('comparison')}
                            disabled={isGeneratingSheet}
                            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isGeneratingSheet ? <Loader2 size={16} className="animate-spin" /> : <Layers size={16} />}
                            Chef vs Cook Card
                        </button>
                        <button 
                            onClick={() => handleGenerateInfographic('meat_chart')}
                            disabled={isGeneratingSheet}
                            className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isGeneratingSheet ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                            Animal Meat Chart
                        </button>
                    </div>
                </div>

                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-[2rem] overflow-hidden border-4 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    {generatedSheet ? (
                        <>
                            <img src={`data:image/png;base64,${generatedSheet}`} alt="Generated Content" className="w-full h-full object-contain" />
                            <div className="absolute bottom-4 right-4">
                                <a 
                                    href={`data:image/png;base64,${generatedSheet}`} 
                                    download="CaterPro_CheatSheet.png"
                                    className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all border border-white/20"
                                >
                                    <Download size={20} />
                                </a>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-6">
                            {isGeneratingSheet ? (
                                <div className="space-y-3">
                                    <Loader2 size={32} className="animate-spin text-indigo-500 mx-auto" />
                                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Rendering Cinematic Visual...</p>
                                </div>
                            ) : (
                                <>
                                    <ImageIcon size={48} className="text-slate-300 mx-auto mb-4" />
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Preview Your Social Asset</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {/* Specific Academy Outreach */}
                <div className="space-y-4 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                    <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                        <GraduationCap size={24} />
                        <h4 className="text-lg font-black uppercase tracking-tight">Academy Outreach</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">Target: Francois Ferreira Academy. Focused on PoE automation.</p>
                    <div className="flex flex-col gap-2 pt-2">
                        <button 
                            onClick={handleCopyAcademyPitch}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                        >
                            <Mail size={16} /> Send Pitch Email
                        </button>
                    </div>
                </div>

                {/* Lead Magnet Tool */}
                <div className="space-y-4 p-8 bg-slate-100 dark:bg-slate-800 rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                    <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                        <MousePointer2 size={24} />
                        <h4 className="text-lg font-black uppercase tracking-tight">Lead Magnet Bait</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">The "Comment CHEF" bait. Use this as your video caption.</p>
                    <div className="pt-2">
                        <button 
                            onClick={handleCopyLeadMagnetHook}
                            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                        >
                            <Copy size={16} /> Copy Video Hook
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchHub;
