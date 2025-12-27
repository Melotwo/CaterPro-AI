
import React from 'react';
import { BookOpen, Copy, Zap, CheckCircle2, Sparkles, Award, GraduationCap, Share2, Scale, MessageSquare, Phone, ShieldCheck, Info, Anchor } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  
  const handleCopyPersonalPost = () => {
    const text = `👨‍🍳 TO MY FELLOW CULINARY STUDENTS & CHEFS 🇿🇦🇭🇺

I’ve been where you are. I remember my cruise line days, working alongside my Hungarian brothers (shoutout to my cruise fam! ⚓️), and the one thing we all hated? THE PAPERWORK. 

Spending 8 hours on Sunday writing 20 menus for your City & Guilds or QCTO Portfolio of Evidence (PoE) instead of mastering your knife skills is frustrating. 

I built **CaterPro AI** specifically for us. Whether you are dealing with ADHD/Dyslexia like me, or just tired of manual costing, I’ve got your back.

✅ UNLIMITED Menu Generations (City & Guilds Standards)
✅ Full Shopping Lists & Costing (ZAR)
✅ AI Tutor Mode (Ask any culinary question 24/7)
✅ Professional PDF Exports for your assignments

R110/month. That’s cheaper than a burger and chips, and it buys you your weekend back. 🔪🔥

Focus on the flavor, let the AI handle the admin.

Check it out: https://caterpro-ai.web.app/
WhatsApp me if you need help getting set up: [INSERT YOUR NUMBER]

#ChefLifeSA #TVETCulinary #CityAndGuilds #PoEStruggle #CaterProAI #SouthAfricanChefs #QCTO`;

    navigator.clipboard.writeText(text);
    onShowToast("Viral Post Copied!");
  };

  const handleCopyWhatsAppPitch = () => {
    const text = `🔥 STOP STRESSING OVER YOUR PoE! 🇿🇦
I built CaterPro AI to help SA students smash their City & Guilds assignments. 
✅ Get 20 menus & costing in seconds.
✅ R110/mo 
Check it out: https://caterpro-ai.web.app/`;
    
    navigator.clipboard.writeText(text);
    onShowToast("WhatsApp Pitch Copied!");
  };

  const handleCopyTvetPitchPrompt = () => {
    const text = `Draft a professional B2B partnership proposal for Waterberg TVET College regarding their 2026 NSF Occupational Culinary programmes. Highlight that CaterPro AI helps students with Dyslexia/ADHD automate the complex paperwork and menu costing required for their Portfolio of Evidence (PoE). Mention my 10 years of international cruise line experience as a quality guarantee.`;
    navigator.clipboard.writeText(text);
    onShowToast("Dean Pitch Prompt Copied!");
  };

  return (
    <div id="research-hub-section" className="mt-12 animate-slide-in scroll-mt-24">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 bg-primary-600 border-b border-primary-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-primary-600">
                    <GraduationCap size={20} />
                </div>
                <h3 className="font-black text-white uppercase tracking-tight text-sm">Student Growth Lab</h3>
            </div>
            <div className="px-3 py-1 bg-primary-500 rounded-full text-[10px] font-black text-white animate-pulse">
                QCTO & CITY & GUILDS READY
            </div>
        </div>

        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Viral Student Post */}
                <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-primary-100 dark:border-primary-900 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Share2 size={18} className="text-primary-500" /> Personal FB Post
                        </h4>
                        <MessageSquare size={16} className="text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        The "Cruise Line & Hungarian Heritage" post. Hits the City & Guilds pain points with authority.
                    </p>
                    <button 
                        onClick={handleCopyPersonalPost}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Viral Post
                    </button>
                </div>

                {/* WhatsApp Pitch */}
                <div className="space-y-4 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                            <Phone size={18} className="text-emerald-500" /> WhatsApp Pitch
                        </h4>
                        <Zap size={16} className="text-amber-500" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Perfect for sending directly to student groups or as a WhatsApp status.
                    </p>
                    <button 
                        onClick={handleCopyWhatsAppPitch}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy WhatsApp Text
                    </button>
                </div>

                {/* Dean Outreach */}
                <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                            <Anchor size={18} className="text-blue-500" /> Global Expert Pitch
                        </h4>
                        <ShieldCheck size={16} className="text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Pitch to TVET Deans. Mentions your Cruise Line & Google AI expertise to build instant trust.
                    </p>
                    <button 
                        onClick={handleCopyTvetPitchPrompt}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Sparkles size={14} /> Copy Global Pitch
                    </button>
                </div>
            </div>

            <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border-2 border-dashed border-primary-200 dark:border-primary-800 flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-primary-600 shadow-sm">
                    <Info size={20} />
                </div>
                <div>
                    <h5 className="text-xs font-black text-primary-900 dark:text-primary-100 uppercase tracking-widest">Tumi's Growth Tip</h5>
                    <p className="text-[10px] text-primary-700 dark:text-primary-300 leading-relaxed mt-0.5 font-medium">
                        "Mentioning my Hungarian friend from the cruise lines isn't just a story—it's a credential. It shows I've worked at the highest global level."
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchHub;
