
import React from 'react';
import { BookOpen, Copy, ExternalLink, Zap, Brain, Terminal, UserRound, CheckCircle2, Sparkles, Award, Target, MousePointer2, Link as LinkIcon, Info, MessageSquareQuote, GraduationCap, BarChart3, ShieldCheck } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const handleCopyKPIPrompt = () => {
    const text = `I am in Module 4 of the Google Digital Marketing course. I am building CaterPro AI. Please explain these metrics (KPIs) in simple 'Chef Language': Conversion Rate, Bounce Rate, and Cost Per Click. Then, suggest 3 specific KPIs I should track for my catering app to know if my marketing is successful.`;
    
    navigator.clipboard.writeText(text);
    onShowToast("KPI Architect Prompt Copied!");
  };

  const handleCopyEthicsPrompt = () => {
    const text = `Explain the importance of 'Data Ethics' for a small catering software founder. My app handles customer emails and event locations. What are the 3 golden rules of data ethics I should follow to build trust with chefs? (Reference the Module 4 Data Ethics reading).`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Data Ethics Prompt Copied!");
  };

  const handleCopyStudyPrompt = () => {
    const text = `I am a culinary professional studying Digital Marketing. Please act as my tutor. Explain the following concept or answer this question using a culinary/kitchen analogy so it's easier for me to grasp with my ADHD/Dyslexia: [PASTE YOUR QUESTION HERE]`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Study Tutor Prompt Copied! Paste into AI Chat.");
  };

  return (
    <div id="research-hub-section" className="mt-12 animate-slide-in scroll-mt-24">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 bg-indigo-50 dark:bg-indigo-800/20 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg text-white">
                    <Brain size={20} />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Module 4 Research Lab</h3>
            </div>
            <a 
                href="https://notebooklm.google.com/" 
                target="_blank" 
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
                Open NotebookLM <ExternalLink size={12} />
            </a>
        </div>

        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* KPI Architect */}
                <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <BarChart3 size={18} className="text-blue-500" /> KPI Architect
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Measure your success. Translate "Module 4" metrics into simple Chef Language.
                    </p>
                    <button 
                        onClick={handleCopyKPIPrompt}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy KPI Prompt
                    </button>
                </div>

                {/* Data Ethics Lab */}
                <div className="space-y-4 p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800">
                    <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-purple-500" /> Data Ethics Lab
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Learn how to handle data safely. Build trust with your fellow chefs.
                    </p>
                    <button 
                        onClick={handleCopyEthicsPrompt}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Ethics Prompt
                    </button>
                </div>

                {/* Study & FET Lab */}
                <div className="space-y-4 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800">
                    <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                        <GraduationCap size={18} className="text-amber-500" /> Study Tutor
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Use this to "translate" any question into Chef Language for easier learning.
                    </p>
                    <button 
                        onClick={handleCopyStudyPrompt}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
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
