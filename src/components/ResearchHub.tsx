
import React from 'react';
// Fixed: Added missing ArrowRight to the lucide-react imports
import { BookOpen, Copy, ExternalLink, Zap, Brain, Terminal, UserRound, CheckCircle2, Sparkles, Award, Target, MousePointer2, Link as LinkIcon, Info, MessageSquareQuote, GraduationCap, BarChart3, ShieldCheck, Trophy, BadgeCheck, ArrowRight } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const handleCopyGraduationPrompt = () => {
    const text = `I just completed 'Course 1: Foundations of Digital Marketing' in the Google Professional Certificate program with a 100% grade. I am building CaterPro AI. Draft a LinkedIn post that celebrates this milestone, mentions my 10 years of Disney Cruise Line experience, and explains how I'm applying these new skills to help chefs automate their paperwork. Use a professional but festive tone for Christmas Eve.`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Graduation Post Prompt Copied!");
  };

  const handleCopyVerificationGuide = () => {
    const text = `Explain the 'Identity Verification' process on Coursera for a professional certificate. What documents do I need, and how long does it usually take to get my certificate once verified? Also, explain the difference between a 'Course Certificate' and a 'Professional Certificate' in simple terms.`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Verification Guide Prompt Copied!");
  };

  const handleCopyStudyPrompt = () => {
    const text = `I am a culinary professional studying Digital Marketing. Please act as my tutor. Explain the following concept or answer this question using a culinary/kitchen analogy so it's easier for me to grasp with my ADHD/Dyslexia: [PASTE YOUR QUESTION HERE]`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Study Tutor Prompt Copied! Paste into AI Chat.");
  };

  return (
    <div id="research-hub-section" className="mt-12 animate-slide-in scroll-mt-24">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-lg text-white">
                    <Trophy size={20} />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Course 1 Graduation Lab</h3>
            </div>
            <a 
                href="https://www.coursera.org/settings/profile" 
                target="_blank" 
                className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline"
            >
                Confirm Identity Now <ExternalLink size={12} />
            </a>
        </div>

        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Milestone Celebrator */}
                <div className="space-y-4 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800">
                    <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                        <BadgeCheck size={18} className="text-amber-500" /> Milestone Post
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Celebrate your 100% grade. Draft a viral post for LinkedIn to share your victory.
                    </p>
                    <button 
                        onClick={handleCopyGraduationPrompt}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Post Prompt
                    </button>
                </div>

                {/* Verification Helper */}
                <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-blue-500" /> Unlock Certificate
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Confused about "Identity Verification"? Get a simple guide to unlocking your PDF.
                    </p>
                    <button 
                        onClick={handleCopyVerificationGuide}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Verification Guide
                    </button>
                </div>

                {/* Next Course Tutor */}
                <div className="space-y-4 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                    <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                        <ArrowRight size={18} className="text-emerald-500" /> Course 2 Tutor
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Ready for "Attract & Engage"? Use this to translate next-week's concepts early.
                    </p>
                    <button 
                        onClick={handleCopyStudyPrompt}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Sparkles size={14} /> Copy Tutor Prompt
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchHub;
