
import React from 'react';
import { BookOpen, Copy, ExternalLink, Zap, Brain, Terminal, FileText, CheckCircle2 } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const handleCopyCodeForAI = () => {
    const prompt = `I am building CaterPro AI. Here is my current project context for my NotebookLM research:\n\n` +
      `Project: AI-powered Catering Proposal Generator\n` +
      `Stack: React, Gemini API, Tailwind CSS\n` +
      `Current Goal: Applying Google Digital Marketing Course principles to grow user base.\n\n` +
      `Please analyze my Coursera notes and tell me how to improve my app's conversion rate.`;
    
    navigator.clipboard.writeText(prompt);
    onShowToast("Context Copied! Paste into NotebookLM.");
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
                        To use NotebookLM effectively, you need to provide it with your app's "Context." Use the button below to copy a pre-formatted summary of your project.
                    </p>
                    <button 
                        onClick={handleCopyCodeForAI}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={16} /> Copy Project Context for AI
                    </button>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen size={18} className="text-indigo-500" /> Learning Bridge
                    </h4>
                    <div className="space-y-2">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                            <CheckCircle2 size={16} className="text-green-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Course Example: Sweet Treats Bakery</p>
                                <p className="text-[10px] text-slate-500">Catering Translation: Automated Client Proposals</p>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                            <Zap size={16} className="text-amber-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Next Mission: SEO Keywords</p>
                                <p className="text-[10px] text-slate-500">Targeting: "Catering Pretoria", "Chef Proposals"</p>
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
