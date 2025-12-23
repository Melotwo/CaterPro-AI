
import React from 'react';
import { BookOpen, Copy, ExternalLink, Zap, Brain, Terminal, UserRound, CheckCircle2, Sparkles, Award, Target } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const handleCopyCodeForAI = () => {
    const prompt = `I am building CaterPro AI. Here is my current project context for my NotebookLM research:\n\n` +
      `Project: AI-powered Catering Proposal Generator\n` +
      `Founder Background: 10+ years hospitality (Disney Cruise Line & Personal Chef)\n` +
      `Stack: React, Gemini API, Tailwind CSS\n` +
      `Current Goal: Applying Google Digital Marketing Course principles to grow user base.\n\n` +
      `Please analyze my Coursera notes and tell me how to improve my app's conversion rate based on my unique culinary background.`;
    
    navigator.clipboard.writeText(prompt);
    onShowToast("Context Copied! Paste into NotebookLM.");
  };

  const handleCopyGradeRecovery = () => {
    const text = `I feel loyal to Apple because their digital marketing consistently emphasizes a lifestyle of creativity and simplicity, which resonates with my values as a founder. A specific example of their impact was a personalized email campaign for the iPad Pro that highlighted its utility for creative professionals, which directly influenced my decision to purchase one for my culinary business development. In my experience, the most effective digital marketing uses data-driven personalization and seamless cross-platform storytelling to build trust. I am excited to use this certificate program to learn how to apply these professional SEO and data-driven strategies to help scale my own app, CaterPro AI, to reach and help chefs globally. My unique selling point is my 10 years of experience at Disney Cruise Line, combined with a radical focus on accessible engineering for other chefs with ADHD.`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Reflection (100% Version) Copied!");
  };

  return (
    <div id="research-hub-section" className="mt-12 animate-slide-in scroll-mt-24">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 bg-indigo-50 dark:bg-indigo-800/20 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg text-white">
                    <Brain size={20} />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">AI Research Hub</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Award size={18} className="text-amber-500" /> Grade Recovery Tool
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        The Coursera AI Coach needs specific links to marketing tactics. Use this optimized reflection to hit 100%.
                    </p>
                    <button 
                        onClick={handleCopyGradeRecovery}
                        className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Sparkles size={16} /> Copy 100% Reflection Text
                    </button>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Terminal size={18} className="text-indigo-500" /> NotebookLM Sync
                    </h4>
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={handleCopyCodeForAI}
                            className="w-full py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <Copy size={16} /> Copy Project Context
                        </button>
                    </div>
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-start gap-3">
                        <Target size={16} className="text-indigo-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Identity Goal</p>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400">Linking Disney Experience to AI Growth</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchHub;
