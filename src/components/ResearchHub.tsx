
import React from 'react';
import { BookOpen, Copy, ExternalLink, Zap, Brain, Terminal, UserRound, CheckCircle2, Sparkles } from 'lucide-react';

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

  const handleCopyIdentityPrompt = () => {
    const prompt = `Act as my Career Coach. Here is my Career Identity Statement:\n\n` +
      `"I am a Culinary Founder and AI Solutions Architect with 10+ years experience, including Disney Cruise Line. I bridge the gap between culinary expertise and technology."\n\n` +
      `Based on the Digital Marketing course notes I've uploaded, what are the 3 best 'Personal Branding' strategies I should use on LinkedIn to attract premium catering clients?`;
    
    navigator.clipboard.writeText(prompt);
    onShowToast("Identity Prompt Copied!");
  };

  return (
    <div className="mt-12 animate-slide-in">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
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
                        <Terminal size={18} className="text-indigo-500" /> NotebookLM Sync
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        To use NotebookLM effectively, provide it with your app context and your **Disney Cruise Line** culinary history.
                    </p>
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={handleCopyCodeForAI}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                        >
                            <Copy size={16} /> Copy Project & Background
                        </button>
                        <button 
                            onClick={handleCopyIdentityPrompt}
                            className="w-full py-3 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all active:scale-95"
                        >
                            <UserRound size={16} /> Copy Career Identity Prompt
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen size={18} className="text-indigo-500" /> Learning Bridge
                    </h4>
                    <div className="space-y-2">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-start gap-3">
                            <Sparkles size={16} className="text-indigo-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Career Statement Optimized</p>
                                <p className="text-[10px] text-indigo-600 dark:text-indigo-400">Highlights: Disney Cruise + 10yr Chef Exp.</p>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3 opacity-60">
                            <CheckCircle2 size={16} className="text-green-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Course Example: Sweet Treats Bakery</p>
                                <p className="text-[10px] text-slate-500">Completed in Hub</p>
                            </div>
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
