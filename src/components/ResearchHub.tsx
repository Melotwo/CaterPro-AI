
import React from 'react';
import { BookOpen, Copy, ExternalLink, Zap, Brain, Terminal, UserRound, CheckCircle2, Sparkles, Award, Target, MousePointer2, Link as LinkIcon, Info, MessageSquareQuote, GraduationCap, BarChart3, ShieldCheck, Trophy, BadgeCheck, ArrowRight, Shield, Play, FileText, Scale, MapPin, Share2 } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const handleCopyTvetPitchPrompt = () => {
    const text = `Draft a professional B2B partnership proposal for Waterberg TVET College regarding their 2026 NSF Occupational Culinary programmes. The proposal should: 1. Introduce me as a local Limpopo Chef with 10 years experience (Ex-Disney). 2. Highlight that CaterPro AI helps occupational students automate the complex paperwork and menu costing required for their Portfolio of Evidence (PoE). 3. Offer a demonstration to the hospitality department to show how this supports students with learning barriers like Dyslexia. Use a professional, respectful, and community-focused tone.`;
    
    navigator.clipboard.writeText(text);
    onShowToast("TVET Pitch Prompt Copied!");
  };

  const handleCopyViralPost = () => {
    const text = `🔥 STOP STRESSING OVER YOUR PoE! 🇿🇦👨‍🍳

Writing 20 menus and shopping lists for your culinary assignments shouldn't take all weekend. 

I built CaterPro AI specifically for South African students who need to smash their Portfolio of Evidence without the admin headache.

✅ UNLIMITED Menu Generations
✅ Full Shopping Lists & Costing
✅ AI Tutor Mode for culinary questions
✅ R110/month (Cheaper than a burger & chips!)

Designed for TVET, City & Guilds, and occupational learners.

Focus on the cooking, let the AI handle the paperwork.

Get the Student Edition now: https://caterpro-ai.web.app/`;

    navigator.clipboard.writeText(text);
    onShowToast("Viral Student Post Copied!");
  };

  const handleCopyContractPrompt = () => {
    const text = `Generate a 'Catering Service Agreement' template for CaterPro AI. I want to include terms for: 1. Cancellation Policy. 2. Final Guest Count deadlines. 3. Dietary restriction liability waiver. This document should look like it was written by a Pro Chef with 10 years experience. This helps me show my users that my app provides 'Business Systems', not just 'AI chat'.`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Contract Architect Prompt Copied!");
  };

  return (
    <div id="research-hub-section" className="mt-12 animate-slide-in scroll-mt-24">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                    <GraduationCap size={20} />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Student Growth Lab</h3>
            </div>
        </div>

        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Viral Student Post */}
                <div className="space-y-4 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800">
                    <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                        <Share2 size={18} className="text-amber-500" /> Viral Student Post
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Copy this persuasive post for your WhatsApp Status or Facebook to grab student attention.
                    </p>
                    <button 
                        onClick={handleCopyViralPost}
                        className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Persuasive Post
                    </button>
                </div>

                {/* TVET Pitch */}
                <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <Award size={18} className="text-blue-500" /> Dean Outreach
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Pitch to TVET Colleges. Show them how CaterPro AI helps students with their PoE paperwork.
                    </p>
                    <button 
                        onClick={handleCopyTvetPitchPrompt}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Sparkles size={14} /> Copy Dean Pitch Prompt
                    </button>
                </div>

                {/* Professionalism Lab */}
                <div className="space-y-4 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                    <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                        <Scale size={18} className="text-emerald-500" /> Contract Architect
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Create pro service agreements that build trust with high-end catering clients.
                    </p>
                    <button 
                        onClick={handleCopyContractPrompt}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Contract Prompt
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchHub;
