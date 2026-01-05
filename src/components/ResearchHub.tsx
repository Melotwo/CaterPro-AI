
import React, { useState } from 'react';
import { BookOpen, Copy, Zap, CheckCircle2, Sparkles, Award, GraduationCap, Share2, Scale, MessageSquare, Phone, ShieldCheck, Info, Anchor, CreditCard, Mail, User, Globe, Users, Briefcase, Send, Camera, Building2, BellRing } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [notified, setNotified] = useState(false);
  
  const handleCopyTikTokBio = () => {
    const text = `Chef Tumi | AI for Chefs 🔪\nHelping Culinary Students crush their PoE paperwork.\nStop typing. Start cooking. 2026 is here.\nFree Menu Generator below 👇`;
    navigator.clipboard.writeText(text);
    onShowToast("TikTok Bio Copied!");
  };

  const handleCopyAcademyPitch = () => {
    const text = `Subject: AI Integration for Francois Ferreira Academy - Solving Student PoE Admin\n\nDear Admissions/Dean,\n\nI noticed you are recruiting for the Class of 2026. I am the founder of CaterPro AI, a system built specifically for culinary students to automate the 'Portfolio of Evidence' (PoE) admin grind.\n\nOur tool generates professional menus and food costing in local ZAR currency instantly. I would love to show you how we can reduce your students' paperwork stress by 80% so they can spend more time in the academy kitchens.\n\nBest regards,\nTumi | Founder, CaterPro AI\nhttps://caterpro-ai.web.app/`;
    navigator.clipboard.writeText(text);
    onShowToast("Academy Pitch Copied!");
  };

  const handleCopyWhopDescription = () => {
    const text = `The AI Secret Weapon for Chefs & Culinary Students. We automate professional menu planning and precise local currency food costing. Built by an international chef. Join the kitchen of the future.`;
    navigator.clipboard.writeText(text);
    onShowToast("Whop Bio Copied!");
  };

  const handleNotifyMe = () => {
      setNotified(true);
      onShowToast("Tracking Francois Ferreira Outreach...");
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

        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Specific Academy Outreach */}
                <div className="space-y-4 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Building2 size={60} />
                    </div>
                    <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                        <GraduationCap size={24} />
                        <h4 className="text-lg font-black uppercase tracking-tight">Academy Outreach</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">Tailored pitch for Francois Ferreira Academy 2026 Class.</p>
                    <div className="flex flex-col gap-2 pt-2">
                        <button 
                            onClick={handleCopyAcademyPitch}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                        >
                            <Mail size={16} /> Copy Academy Pitch
                        </button>
                        <button 
                            onClick={handleNotifyMe}
                            className={`w-full py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${notified ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                        >
                            {notified ? <CheckCircle2 size={14} /> : <BellRing size={14} />}
                            {notified ? 'Outreach Tracked' : 'Notify Me of Replies'}
                        </button>
                    </div>
                </div>

                {/* TikTok Bio Vault */}
                <div className="space-y-4 p-8 bg-slate-950 text-white rounded-[2rem] border-2 border-slate-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Camera size={60} />
                    </div>
                    <div className="flex items-center gap-3 text-amber-400">
                        <Sparkles size={24} />
                        <h4 className="text-lg font-black uppercase tracking-tight">Social Bio Lab</h4>
                    </div>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed">Viral conversion bios for TikTok and LinkedIn stories.</p>
                    <div className="pt-2">
                        <button 
                            onClick={handleCopyTikTokBio}
                            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                        >
                            <Copy size={16} /> Copy TikTok Bio
                        </button>
                    </div>
                </div>

                {/* Whop Global Bio */}
                <div className="space-y-4 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm group">
                    <div className="flex items-center gap-3 text-emerald-600">
                        <Briefcase size={24} />
                        <h4 className="text-lg font-black uppercase tracking-tight">Storefront SEO</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">High-converting description for your Whop marketplace.</p>
                    <div className="pt-2">
                        <button 
                            onClick={handleCopyWhopDescription}
                            className="w-full py-4 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                        >
                            <Copy size={16} /> Copy Whop Bio
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
