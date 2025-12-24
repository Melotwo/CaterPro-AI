
import React from 'react';
import { BookOpen, Copy, ExternalLink, Zap, Brain, Terminal, UserRound, CheckCircle2, Sparkles, Award, Target, MousePointer2, Link as LinkIcon, Info, MessageSquareQuote } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const handleCopyBacklinkPitch = () => {
    const text = `Hi [Name], I'm Tumi, a former Disney Cruise Line chef and founder of CaterPro AI. I've built a free AI tool specifically for chefs to eliminate Sunday night paperwork stress. I noticed your resource page for culinary students and thought CaterPro would be a valuable free resource for them. It's built specifically for creators with ADHD/Dyslexia. Would you be open to adding a link to us? It would help chefs globally save time.`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Partnership Pitch Copied! Use this for Referrals.");
  };

  const handleCopyAdsGuide = () => {
    const text = `⚠️ GOOGLE ADS CAUTION: The ZAR 6000 credit is usually a 'Matching Credit'. You must SPEND ZAR 6000 to RECEIVE ZAR 6000. If budget is tight, focus on Organic Social and Referrals first. Use the 'Referral Pitch Architect' below to grow for free.`;
    
    navigator.clipboard.writeText(text);
    onShowToast("Ads Guide Copied to Clipboard.");
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
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Zero-Cost Growth Lab</h3>
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
                {/* Referral/Backlink Tool */}
                <div className="space-y-4 p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800">
                    <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                        <LinkIcon size={18} className="text-purple-500" /> Referral Architect
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Convert "Direct" traffic to "Referral". Pitch to culinary schools to get linked.
                    </p>
                    <button 
                        onClick={handleCopyBacklinkPitch}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <MessageSquareQuote size={14} /> Copy Outreach Pitch
                    </button>
                </div>

                {/* Ads Truth Tool */}
                <div className="space-y-4 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800">
                    <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                        <Info size={18} className="text-amber-500" /> Ads Credit Guide
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Read this before using your ZAR 6000 credit to avoid unexpected costs.
                    </p>
                    <button 
                        onClick={handleCopyAdsGuide}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Credit Guide
                    </button>
                </div>

                {/* Grade Recovery Tool */}
                <div className="space-y-4 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                    <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                        <Award size={18} className="text-emerald-500" /> Grade Recovery Tool
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Coursera Course 2 Reflection. Connect your Disney history to AI precision.
                    </p>
                    <button 
                        onClick={handleCopyGradeRecovery}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
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
