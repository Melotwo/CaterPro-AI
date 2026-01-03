
import React from 'react';
import { BookOpen, Copy, Zap, CheckCircle2, Sparkles, Award, GraduationCap, Share2, Scale, MessageSquare, Phone, ShieldCheck, Info, Anchor, CreditCard, Mail, User, Globe, Users, Briefcase, Send, Camera } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  
  const handleCopyTikTokBio = () => {
    const text = `Chef Tumi | AI for Chefs 🔪\nHelping Culinary Students crush their PoE paperwork.\nStop typing. Start cooking. 2026 is here.\nFree Menu Generator below 👇`;
    navigator.clipboard.writeText(text);
    onShowToast("TikTok Bio Copied!");
  };

  const handleCopyCollegePitch = () => {
    const text = `Subject: Solving Portfolio of Evidence (PoE) hurdles for your Academy\n\nDear Dean,\n\nI'm Tumi, founder of CaterPro AI. I built a tool that helps students solve the #1 barrier to graduation: The complex Portfolio of Evidence (PoE) paperwork.\n\nBest,\nTumi | CaterPro AI`;
    navigator.clipboard.writeText(text);
    onShowToast("Dean Pitch Copied!");
  };

  const handleCopyWhopDescription = () => {
    const text = `The AI Secret Weapon for Chefs & Culinary Students. We automate professional menu planning and precise local currency food costing. Built by an international chef. Join the kitchen of the future.`;
    navigator.clipboard.writeText(text);
    onShowToast("Whop Bio Copied!");
  };

  return (
    <div id="research-hub-section" className="mt-12 animate-slide-in scroll-mt-24">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 bg-primary-600 border-b border-primary-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-primary-600">
                    <Globe size={20} />
                </div>
                <h3 className="font-black text-white uppercase tracking-tight text-sm">Growth & Bio Hub</h3>
            </div>
            <div className="px-3 py-1 bg-amber-500 rounded-full text-[10px] font-black text-white animate-pulse">
                GO LIVE: 2026
            </div>
        </div>

        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* TikTok Bio Vault */}
                <div className="space-y-4 p-6 bg-slate-900 text-white rounded-2xl border-2 border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Camera size={40} />
                    </div>
                    <h4 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-400" /> The Bio Vault
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">For TikTok & Socials</p>
                    <div className="p-3 bg-slate-800 rounded-xl text-[10px] text-slate-300 italic">
                        Chef Tumi | AI for Chefs 🔪...
                    </div>
                    <button 
                        onClick={handleCopyTikTokBio}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy TikTok Bio
                    </button>
                </div>

                {/* College Dean Pitch */}
                <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border-2 border-blue-200 dark:border-blue-900 shadow-sm">
                    <h4 className="text-lg font-bold text-blue-900 dark:text-white flex items-center gap-2">
                        <Users size={18} className="text-blue-500" /> Dean Outreach
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">Monday College Mission Pitch</p>
                    <button 
                        onClick={handleCopyCollegePitch}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Monday Pitch
                    </button>
                </div>

                {/* Whop Global Bio */}
                <div className="space-y-4 p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-sm">
                    <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                        <Briefcase size={18} className="text-indigo-500" /> Whop Global Bio
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">High-converting Whop summary.</p>
                    <button 
                        onClick={handleCopyWhopDescription}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Whop Bio
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchHub;
