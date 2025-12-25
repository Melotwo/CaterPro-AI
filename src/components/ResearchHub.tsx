
import React from 'react';
import { BookOpen, Copy, ExternalLink, Zap, Brain, Terminal, UserRound, CheckCircle2, Sparkles, Award, Target, MousePointer2, Link as LinkIcon, Info, MessageSquareQuote, GraduationCap, BarChart3, ShieldCheck, Trophy, BadgeCheck, ArrowRight, Shield, Play, FileText, Scale, MapPin } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const handleCopyTvetPitchPrompt = () => {
    const text = `Draft a professional B2B partnership proposal for Waterberg TVET College regarding their 2026 NSF Occupational Culinary programmes. The proposal should: 1. Introduce me as a local Limpopo Chef with 10 years experience (Ex-Disney). 2. Highlight that CaterPro AI helps occupational students automate the complex paperwork and menu costing required for their Portfolio of Evidence (PoE). 3. Offer a demonstration to the hospitality department to show how this supports students with learning barriers like Dyslexia. Use a professional, respectful, and community-focused tone.`;
    
    navigator.clipboard.writeText(text);
    onShowToast("TVET Pitch Prompt Copied!");
  };

  const handleCopyVideoPrompt = () => {
    const text = `I just watched two expert videos on 'Starting a Catering Business' and 'Catering Marketing'. The key takeaways are: 1. Logistics and Contracts are as important as food. 2. Trust is the primary product. Based on these insights, help me refine the 'Service Notes' section of CaterPro AI. How can I add professional 'Event Logistics Checklists' (like loading dock info, power requirements, and cleanup terms) that make my menus look more professional and less generic?`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Video Insight Prompt Copied!");
  };

  const handleCopyContractPrompt = () => {
    const text = `Generate a 'Catering Service Agreement' template for CaterPro AI. I want to include terms for: 1. Cancellation Policy. 2. Final Guest Count deadlines. 3. Dietary restriction liability waiver. This document should look like it was written by a Pro Chef with 10 years experience. This helps me show my users that my app provides 'Business Systems', not just 'AI chat'.`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Contract Architect Prompt Copied!");
  };

  const handleCopyStudyPrompt = () => {
    const text = `I am a culinary professional studying Digital Marketing. Please act as my tutor. Explain the following concept or answer this question using a culinary/kitchen analogy so it's easier for me to grasp with my ADHD/Dyslexia: [PASTE YOUR QUESTION HERE]`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Study Tutor Prompt Copied!");
  };

  return (
    <div id="research-hub-section" className="mt-12 animate-slide-in scroll-mt-24">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                    <MapPin size={20} />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Waterberg TVET Outreach Lab</h3>
            </div>
            <a 
                href="https://www.studentroom.co.za/waterberg-tvet-college-opens-2026-nsf-occupational-programme-applications/#google_vignette" 
                target="_blank" 
                className="text-[10px] font-black text-blue-600 uppercase hover:underline flex items-center gap-1"
            >
                View Announcement <ExternalLink size={10} />
            </a>
        </div>

        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* TVET Pitch */}
                <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <Award size={18} className="text-blue-500" /> Institution Pitch
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Pitch to Waterberg TVET. Show them how CaterPro AI helps students with their PoE paperwork.
                    </p>
                    <button 
                        onClick={handleCopyTvetPitchPrompt}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Sparkles size={14} /> Copy TVET Pitch Prompt
                    </button>
                </div>

                {/* Logistics Lab */}
                <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText size={18} className="text-red-500" /> Logistics Moat
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Improve your menus with "Event Logistics" to show you offer more than just recipes.
                    </p>
                    <button 
                        onClick={handleCopyVideoPrompt}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Play size={14} /> Copy Logistics Prompt
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
