
import React from 'react';
import { BookOpen, Copy, Zap, CheckCircle2, Sparkles, Award, GraduationCap, Share2, Scale, MessageSquare, Phone, ShieldCheck, Info, Anchor, CreditCard, Mail, User, Globe, Users, Briefcase, Send } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  
  const handleCopyCollegePitch = () => {
    const text = `Subject: Solving Portfolio of Evidence (PoE) hurdles for your Academy

Dear Dean,

I'm Tumi, founder of CaterPro AI. As a culinary professional with international cruise line experience, I built a tool that helps students solve the #1 barrier to graduation: The complex Portfolio of Evidence (PoE) paperwork.

CaterPro AI automates menu planning and precise costing to international standards (City & Guilds/QCTO), specifically supporting neurodivergent students (ADHD/Dyslexia). I'd love to show you how we can improve your academy's graduation rates.

Best,
Tumi | CaterPro AI`;
    navigator.clipboard.writeText(text);
    onShowToast("Global Dean Pitch Copied!");
  };

  const handleCopyWhopDescription = () => {
    const text = `The AI Secret Weapon for Chefs & Culinary Students Worldwide. Stop spending Sundays on admin. We automate professional menu planning, precise local currency food costing, and academic Portfolio of Evidence (PoE) paperwork. Built by an international chef to help you achieve global standards. Fully optimized for students with ADHD & Dyslexia. Join the kitchen of the future.`;
    navigator.clipboard.writeText(text);
    onShowToast("Global Bio Copied!");
  };

  return (
    <div id="research-hub-section" className="mt-12 animate-slide-in scroll-mt-24">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 bg-primary-600 border-b border-primary-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-primary-600">
                    <Globe size={20} />
                </div>
                <h3 className="font-black text-white uppercase tracking-tight text-sm">Global Growth Hub</h3>
            </div>
            <div className="px-3 py-1 bg-primary-500 rounded-full text-[10px] font-black text-white animate-pulse">
                INTERNATIONAL READY
            </div>
        </div>

        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* College Dean Pitch */}
                <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border-2 border-blue-200 dark:border-blue-900 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-blue-900 dark:text-white flex items-center gap-2">
                            <Users size={18} className="text-blue-500" /> Academy Deans
                        </h4>
                        <ShieldCheck size={16} className="text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Pitch to global culinary schools for PoE automation.
                    </p>
                    <button 
                        onClick={handleCopyCollegePitch}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Global Pitch
                    </button>
                </div>

                {/* Whop Global Bio */}
                <div className="space-y-4 p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                            <Briefcase size={18} className="text-indigo-500" /> Global Whop Bio
                        </h4>
                        <Zap size={16} className="text-amber-500" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        High-converting bio for international customers.
                    </p>
                    <button 
                        onClick={handleCopyWhopDescription}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Global Bio
                    </button>
                </div>

                {/* Authority Story */}
                <div className="space-y-4 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                            <Anchor size={18} className="text-emerald-500" /> International Moat
                        </h4>
                        <Sparkles size={16} className="text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Leveraging your cruise experience as a "Global Standard".
                    </p>
                    <button 
                        onClick={() => { navigator.clipboard.writeText("CaterPro AI: International culinary standards built by a chef with global cruise line rigor."); onShowToast("Authority Story Copied!"); }}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Authority Story
                    </button>
                </div>
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-3xl border-2 border-primary-500/20 flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-500">
                    <Globe size={32} />
                </div>
                <div className="flex-1">
                    <h5 className="text-sm font-black text-white uppercase tracking-widest">Global Payout Note</h5>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1 font-medium">
                        Whop handles currency conversion automatically. Your customers pay in their currency, and you receive your payouts in your preferred local bank account. Set your Whop Handle to <span className="text-primary-400 font-bold">CaterProAi</span> to go live.
                    </p>
                </div>
                <button 
                    onClick={() => window.open('https://whop.com/dash/settings/general', '_blank')}
                    className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-tight shadow-xl hover:scale-105 transition-transform"
                >
                    Whop Settings
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchHub;
