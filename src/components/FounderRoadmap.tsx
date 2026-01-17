
import React, { useState } from 'react';
/* Added AlertTriangle to the imports */
import { CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, Camera, ClipboardCheck, BookOpen, Building2, Presentation, Layout, Eye, MessageSquare, Sparkles, Loader2, AlertCircle, AlertTriangle, ListChecks, Star, Settings2, HelpCircle, ShoppingBag, UserPlus, MessageCircle, DollarSign, PieChart } from 'lucide-react';
import { generateWhopSEO } from '../services/geminiService';
import ThumbnailStudio from './ThumbnailStudio';

interface FounderRoadmapProps {
  whopUrl: string;
}

const ClippingBountyLab: React.FC = () => {
    const [budget, setBudget] = useState(100);
    const [viewRate, setViewRate] = useState(0.05); // $0.05 per view

    const potentialViews = (budget / viewRate).toLocaleString();

    return (
        <div className="animate-fade-in space-y-10">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <DollarSign className="text-emerald-500" /> Clipping Bounty Lab
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Whop clippers don't work for free. Use this to calculate your "Content Reward" budget to attract high-quality creators.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700 shadow-xl space-y-8">
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block tracking-[0.3em]">Total Testing Budget ($)</label>
                        <input 
                            type="range" min="50" max="1000" step="50"
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between mt-2 font-black text-slate-900 dark:text-white">${budget}</div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block tracking-[0.3em]">Bounty Rate (per 1,000 views)</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 5, 10].map(rate => (
                                <button 
                                    key={rate} 
                                    onClick={() => setViewRate(rate/1000)}
                                    className={`py-3 rounded-xl border-2 font-black text-xs ${viewRate === rate/1000 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400'}`}
                                >
                                    ${rate}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-indigo-600 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10"><TrendingUp size={100} /></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Target Reach</p>
                        <h4 className="text-5xl font-black">{potentialViews} <span className="text-xl opacity-60">Views</span></h4>
                        <p className="text-xs mt-4 text-indigo-100 font-medium">Estimated traffic based on current Whop bounty standards.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-8 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700 shadow-lg">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <PieChart size={18} className="text-indigo-500" /> Why this works
                        </h4>
                        <div className="space-y-4">
                            {[
                                { t: 'Leverage Community', d: 'Clippers are already on Whop looking for products to promote.' },
                                { t: 'Fixed Cost ROI', d: 'You only pay for actual views recorded by the Whop system.' },
                                { t: 'Viral Potential', d: 'One good clip can generate thousands in recurring SaaS revenue.' }
                            ].map(i => (
                                <div key={i.t} className="flex gap-4">
                                    <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                                    <div>
                                        <p className="font-black text-xs uppercase text-slate-800 dark:text-white">{i.t}</p>
                                        <p className="text-[10px] text-slate-500 font-bold mt-1 leading-relaxed">{i.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <a href="https://whop.com/melotwo2" target="_blank" className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        Set Bounty in Whop Dashboard <ExternalLink size={18} />
                    </a>
                </div>
            </div>
        </div>
    );
};

const CommunityRecruiter: React.FC = () => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text.trim());
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const scripts = [
        {
            id: 'clipper-invite',
            title: 'The Clipper Bounty',
            subtitle: 'Post this in "Whop Clips" chat',
            icon: PlayCircle,
            color: 'bg-red-600',
            text: `I'm launching a new AI SaaS for Chefs. Looking for 5 Clippers to join the Launch Team. Paying $5 per 1k views + 40% recurring commissions. The hospitality niche is wide open right now. DM me for the link!`
        },
        {
            id: 'dm',
            title: 'Direct High-Ticket DM',
            subtitle: 'For power-users on the leaderboard',
            icon: UserPlus,
            color: 'bg-emerald-600',
            text: `Chef! Noticed you're moving weight in the clips chat. I've built CaterPro AI—the first automation system for large-scale catering. I'm looking for a lead affiliate to own this category. 40% cut for you. Want a demo?`
        },
        {
            id: 'review-swap',
            title: 'The Ranking Sniper',
            subtitle: 'To boost Discovery Rank',
            icon: Star,
            color: 'bg-amber-500',
            text: `Who here wants to test the 2026 Hospitality Command Center? 7-Day Free Trial is live. I'm looking for reviews to help my Discovery ranking. If you drop a review, I'll give you a permanent 30% discount code.`
        }
    ];

    return (
        <div className="animate-fade-in space-y-10">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <UserPlus className="text-indigo-600" /> Recruitment Command
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Turn the Whop community into your salesforce. Don't sell the app—**sell the opportunity to earn.**
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {scripts.map((script) => (
                    <div key={script.id} className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl group hover:border-indigo-500/30 transition-all">
                        <div>
                            <div className={`w-12 h-12 ${script.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                                <script.icon size={24} />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none">{script.title}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{script.subtitle}</p>
                            
                            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 italic text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                "{script.text}"
                            </div>
                        </div>

                        <button 
                            onClick={() => handleCopy(script.text, script.id)}
                            className={`w-full mt-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${copied === script.id ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                            {copied === script.id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                            {copied === script.id ? 'Copied' : 'Copy Script'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StoreArchitect: React.FC = () => {
    const [copied, setCopied] = useState<string | null>(null);

    const storeMarkdown = `
# 🍽️ CaterPro AI: The 2026 Catering Command Center

**Stop spending Sundays on admin. Start spending them on your craft.**

CaterPro AI is the first "Lifecycle" automation system built by chefs, for chefs. Whether you are a culinary student tackling PoE paperwork or a pro managing high-volume weddings, this is your unfair advantage.

### 🚀 WHY CHEFS CHOOSE CATERPRO:
*   **Instant Proposals:** Generate 5-course professional menus in < 30 seconds.
*   **Precision Costing:** Automated shopping lists in local ZAR/USD/EUR currency.
*   **ADHD-Friendly:** Visually structured, distraction-free, and optimized for inclusive learning.
*   **Viral Marketing:** Built-in "Reel Creator" to drive traffic to your business.

### 💎 WHAT'S INSIDE THE SYSTEM:
1.  **AI Menu Architect:** Michelin-star logic for any event type.
2.  **Sourcing Intelligence:** Smart shopping lists organized by aisle.
3.  **The Growth Lab:** Ready-to-use social media scripts and viral hooks.
4.  **Consultant Bot:** 24/7 access to your personal AI culinary strategist.

---
**Join the future of the kitchen. Start your 7-Day Free Trial today.**
    `;

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text.trim());
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="animate-fade-in space-y-10">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <ShoppingBag className="text-indigo-600" /> Storefront Architect
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Your Whop store page is your 24/7 salesperson. Use this **Structured Markdown** to transform your page from "Basic" to "Premium."
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="p-8 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Step 1: The Bio</span>
                            <button 
                                onClick={() => handleCopy("The AI Secret Weapon for Chefs. Automate Proposals, Costing, & PoE Admin in 30 seconds. 7-Day Free Trial Active. 🚀", "bio")}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                            >
                                {copied === 'bio' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                            </button>
                        </div>
                        <p className="text-sm font-bold leading-relaxed italic">
                            "The AI Secret Weapon for Chefs. Automate Proposals, Costing, & PoE Admin in 30 seconds. 7-Day Free Trial Active. 🚀"
                        </p>
                    </div>

                    <div className="p-8 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[3rem] shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Step 2: The About Section (Markdown)</span>
                            <button 
                                onClick={() => handleCopy(storeMarkdown, "about")}
                                className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-all rounded-xl"
                            >
                                {copied === 'about' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                            </button>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 h-64 overflow-y-auto no-scrollbar">
                            <pre className="text-[10px] text-slate-500 font-mono whitespace-pre-wrap leading-relaxed">
                                {storeMarkdown.trim()}
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="sticky top-24 p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Layout size={180} />
                        </div>
                        <h4 className="text-2xl font-black mb-6">Visual Advice</h4>
                        <div className="space-y-6">
                            {[
                                { t: 'Retina Cover', d: 'Your banner must be high-contrast. Use the "Dark ROI" template from our Studio.' },
                                { t: 'Emoji Power', d: 'Use emojis as bullet points. They act as visual anchors for mobile users.' },
                                { t: 'Call to Action', d: 'Always end with "Start your 7-Day Free Trial".' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-[10px] font-black">{i+1}</div>
                                    <div>
                                        <p className="font-black text-sm uppercase tracking-wide">{item.t}</p>
                                        <p className="text-xs text-indigo-100 mt-1 font-medium leading-relaxed">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'whop' | 'recruiter' | 'design' | 'store' | 'bounty'>('whop');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['community-post']));

  const toggleTask = (taskId: string) => {
    const newTasks = new Set(completedTasks);
    if (newTasks.has(taskId)) newTasks.delete(taskId);
    else newTasks.add(taskId);
    setCompletedTasks(newTasks);
  };

  const dailyTasks = [
    { id: 'whop-trial', label: 'Enable 7-Day Free Trial in Whop', highPriority: true },
    { id: 'whop-bounty', label: 'Set Clipping Bounty Budget ($2 per 1k views)', highPriority: true },
    { id: 'whop-yearly', label: 'Add Yearly Payment Option (Save 20%)', highPriority: true },
    { id: 'b2b-pitch-academy', label: 'Email 5 Culinary Schools', highPriority: false },
  ];

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden scroll-mt-24" id="founder-control">
      <div className="p-10 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <TrendingUp size={200} />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-500/20">
                <Rocket size={32} className="text-white" />
            </div>
            <div>
                <h2 className="text-4xl font-black uppercase tracking-tight leading-none">Ranking Command</h2>
                <p className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Whop Discovery Accelerator</p>
            </div>
          </div>
          
          <div className="flex bg-slate-900/50 p-2 rounded-[1.5rem] border border-white/10 overflow-x-auto no-scrollbar backdrop-blur-md">
            <button onClick={() => setActiveTab('whop')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'whop' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Crosshair size={16} /> Visibility
            </button>
            <button onClick={() => setActiveTab('bounty')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'bounty' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <DollarSign size={16} /> Bounty Lab
            </button>
            <button onClick={() => setActiveTab('store')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'store' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <ShoppingBag size={16} /> Storefront
            </button>
            <button onClick={() => setActiveTab('recruiter')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'recruiter' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <UserPlus size={16} /> Recruiter
            </button>
            <button onClick={() => setActiveTab('design')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'design' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Layout size={16} /> Assets
            </button>
            <button onClick={() => setActiveTab('mission')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'mission' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <ClipboardCheck size={16} /> Checklist
            </button>
          </div>
        </div>
      </div>

      <div className="p-10 sm:p-16">
        {activeTab === 'whop' && (
            <div className="animate-fade-in space-y-10">
                <div className="max-w-3xl">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Discovery Strategy</h3>
                    <p className="text-lg text-slate-500">The Whop algorithm prioritizes products that bring **New Users** to the platform. By setting up a clipping bounty, you generate hundreds of "New User" entries, pushing you to the top of the feed.</p>
                </div>
                <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[3rem] border-2 border-amber-100 dark:border-amber-800 flex gap-6">
                    <AlertTriangle className="text-amber-500 shrink-0" size={32} />
                    <div>
                        <p className="font-black text-amber-900 dark:text-amber-200 uppercase tracking-widest">Crucial Insight</p>
                        <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1 font-medium leading-relaxed">
                            Your research shows people are earning **$13k/day** in Hospitality. Your advantage is **Accessibility.** Ensure your Whop pricing has the "7-Day Trial" and "Yearly" options turned ON to maximize conversion velocity.
                        </p>
                    </div>
                </div>
            </div>
        )}
        {activeTab === 'bounty' && <ClippingBountyLab />}
        {activeTab === 'store' && <StoreArchitect />}
        {activeTab === 'recruiter' && <CommunityRecruiter />}
        {activeTab === 'design' && <ThumbnailStudio />}

        {/* MISSION CONTROL TAB */}
        {activeTab === 'mission' && (
          <div className="animate-fade-in py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[3rem] overflow-hidden shadow-inner">
                    <h3 className="p-8 border-b border-slate-100 dark:border-slate-700 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Manual Dashboard Actions</h3>
                    {dailyTasks.map((task) => (
                    <button key={task.id} onClick={() => toggleTask(task.id)} className={`w-full flex items-center gap-6 p-8 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-all ${completedTasks.has(task.id) ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${completedTasks.has(task.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                            {completedTasks.has(task.id) && <CheckCircle2 size={18} />}
                        </div>
                        <span className={`text-base font-black text-left ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                            {task.label}
                            {task.highPriority && !completedTasks.has(task.id) && <span className="ml-3 text-[9px] bg-red-500 text-white px-2.5 py-1 rounded-md font-black tracking-widest shadow-lg shadow-red-500/20">REQUIRED</span>}
                        </span>
                    </button>
                    ))}
                </div>
                <div className="bg-indigo-600 p-16 rounded-[3rem] flex flex-col justify-center items-center text-center shadow-[0_40px_80px_-15px_rgba(79,70,229,0.5)]">
                    <Award className="text-white/30 mb-8" size={80} />
                    <p className="text-3xl font-black text-white leading-tight mb-8">
                        "Clips drive views.<br/>Views drive trials."
                    </p>
                    <button onClick={() => setActiveTab('bounty')} className="px-12 py-6 bg-white text-indigo-600 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        Launch Bounty Lab
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
