
import React from 'react';
import { BookOpen, Copy, ExternalLink, Zap, Brain, Terminal, UserRound, CheckCircle2, Sparkles, Award, Target, MousePointer2, Link as LinkIcon } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const handleCopyCodeForAI = () => {
    const prompt = `I am building CaterPro AI. I have a ZAR 6000 Google Ads credit. Based on my current GA4 data (US and SA are my top markets), please generate a high-intent keyword list for my first ad campaign. Focus on keywords like 'Catering Menu Template' and 'Chef Productivity Tool'. Also, suggest how to structure my ads to target chefs with ADHD.`;
    
    navigator.clipboard.writeText(prompt);
    onShowToast("Ads Prompt Copied! Paste into Gemini or NotebookLM.");
  };

  const handleCopyBacklinkPitch = () => {
    const text = `Hi [Name], I'm Tumi, a former Disney Cruise Line chef and founder of CaterPro AI. I recently saw your article on [Topic] and loved it. I've built a free AI tool specifically for chefs to eliminate Sunday night paperwork stress. I'd love to offer your readers a special look at it in exchange for a mention or referral link on your resource page. It's built specifically for culinary professionals with ADHD/Dyslexia. Would you be open to a quick chat?`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Partnership Pitch Copied! Use this for Referrals.");
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
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Marketing Research Lab</h3>
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
                {/* Google Ads Tool */}
                <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <MousePointer2 size={18} className="text-blue-500" /> Google Ads Strategy
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Optimize your ZAR 6000 credit. Get high-intent keywords for the US & SA markets.
                    </p>
                    <button 
                        onClick={handleCopyCodeForAI}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Ads Keywords Prompt
                    </button>
                </div>

                {/* Backlink Tool */}
                <div className="space-y-4 p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800">
                    <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                        <LinkIcon size={18} className="text-purple-500" /> Backlink Architect
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Turn 0 Referrals into 50. Draft a partnership pitch for catering schools and bloggers.
                    </p>
                    <button 
                        onClick={handleCopyBacklinkPitch}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Partnership Pitch
                    </button>
                </div>

                {/* Grade Recovery Tool */}
                <div className="space-y-4 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800">
                    <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                        <Award size={18} className="text-amber-500" /> Grade Recovery Tool
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Coursera Course 2 Reflection. Optimized to link your Disney history to AI precision.
                    </p>
                    <button 
                        onClick={handleCopyGradeRecovery}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Sparkles size={14} /> Copy 100% Reflection
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchHub;
