
import React from 'react';
// Added missing ShieldCheck and Info icons to the lucide-react import
import { BookOpen, Copy, Zap, CheckCircle2, Sparkles, Award, GraduationCap, Share2, Scale, MessageSquare, Phone, ShieldCheck, Info } from 'lucide-react';

const ResearchHub: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  
  const handleCopyPersonalPost = () => {
    const text = `👨‍🍳 TO MY FELLOW CULINARY STUDENTS & CHEFS 🇿🇦

We all know the stress of a Portfolio of Evidence (PoE). Spending 8 hours on Sunday writing menus, calculating costing, and trying to remember the City & Guilds standards instead of actually COOKING. 🔪🔥

I’m Tumi—I’ve been in the industry for 10 years (from Limpopo to Disney) and I know the struggle, especially if you deal with ADHD or Dyslexia like I do. Paperwork shouldn't stop a great chef.

That’s why I built the **CaterPro AI: Student Edition**.

Specifically designed for:
✅ TVET Occupational Programmes
✅ City & Guilds (Level 1-3)
✅ QCTO Culinary Assignments

What you get for R110/month:
🚀 UNLIMITED Menu Generations (No more writer's block)
📊 Full Shopping Lists & Costing (Automated for SA Rands)
🎓 AI Tutor Consultant (Ask any culinary question 24/7)
📄 Professional PDF Exports for your PoE

Stop the admin headache. Focus on the flavor. 

Get started here: https://caterpro-ai.web.app/
OR WhatsApp me if you're stuck: [INSERT YOUR NUMBER HERE]

#ChefLifeSA #TVETCulinary #CityAndGuilds #PoEStruggle #CaterProAI #SouthAfricanChefs #CulinaryStudent`;

    navigator.clipboard.writeText(text);
    onShowToast("High-Impact Post Copied!");
  };

  const handleCopyWhatsAppStatus = () => {
    const text = `🔥 SMASH YOUR CULINARY PoE! 🇿🇦
Writing menus & costing taking too long? 
CaterPro AI Student Edition is here!
✅ Unlimited Menus
✅ Full Costing (ZAR)
✅ R110/mo 
Specifically for City & Guilds / TVET.
Link in bio: https://caterpro-ai.web.app/`;
    
    navigator.clipboard.writeText(text);
    onShowToast("WhatsApp Status Copied!");
  };

  const handleCopyTvetPitchPrompt = () => {
    const text = `Draft a professional B2B partnership proposal for Waterberg TVET College regarding their 2026 NSF Occupational Culinary programmes. Highlight that CaterPro AI helps students with Dyslexia/ADHD automate the complex paperwork and menu costing required for their Portfolio of Evidence (PoE). Use a professional and community-focused tone.`;
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
                CITY & GUILDS COMPLIANT
            </div>
        </div>

        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Viral Student Post */}
                <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-primary-100 dark:border-primary-900 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Share2 size={18} className="text-primary-500" /> Viral FB Post
                        </h4>
                        <MessageSquare size={16} className="text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        The "Street-Smart" post. Personal, persuasive, and hits the City & Guilds pain points.
                    </p>
                    <button 
                        onClick={handleCopyPersonalPost}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy High-Impact Post
                    </button>
                </div>

                {/* WhatsApp Status */}
                <div className="space-y-4 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                            <Phone size={18} className="text-emerald-500" /> WhatsApp Status
                        </h4>
                        <Zap size={16} className="text-amber-500" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Short, punchy, and urgent. Perfect for a quick link-in-bio update.
                    </p>
                    <button 
                        onClick={handleCopyWhatsAppStatus}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Copy size={14} /> Copy Status Text
                    </button>
                </div>

                {/* Dean Outreach */}
                <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                            <Award size={18} className="text-blue-500" /> Dean Outreach
                        </h4>
                        <ShieldCheck size={16} className="text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Pitch to TVET Colleges. Mention the 100% Grade Google Certificate to build trust.
                    </p>
                    <button 
                        onClick={handleCopyTvetPitchPrompt}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Sparkles size={14} /> Copy Dean Pitch Prompt
                    </button>
                </div>
            </div>

            <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border-2 border-dashed border-primary-200 dark:border-primary-800 flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-primary-600 shadow-sm">
                    <Info size={20} />
                </div>
                <div>
                    <h5 className="text-xs font-black text-primary-900 dark:text-primary-100 uppercase tracking-widest">Tumi's Pro-Tip</h5>
                    <p className="text-[10px] text-primary-700 dark:text-primary-300 leading-relaxed mt-0.5 font-medium">
                        When you post on Facebook, add a photo of yourself in your Chef whites or a screenshot of a perfect menu generated by the app. Visuals increase engagement by 40%!
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchHub;
