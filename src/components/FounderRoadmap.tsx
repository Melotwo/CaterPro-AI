
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, Camera, ClipboardCheck, BookOpen, Building2, Presentation, Layout, Eye, MessageSquare, Sparkles, Loader2, AlertCircle, ListChecks, Star, Settings2, HelpCircle, ShoppingBag, UserPlus, MessageCircle } from 'lucide-react';
import { generateWhopSEO } from '../services/geminiService';
import ThumbnailStudio from './ThumbnailStudio';

interface FounderRoadmapProps {
  whopUrl: string;
}

const CommunityRecruiter: React.FC = () => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text.trim());
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const scripts = [
        {
            id: 'public',
            title: 'Public Chat Sniper',
            subtitle: 'Use this in the "Whop Clips" chat',
            icon: MessageSquare,
            color: 'bg-indigo-600',
            text: `Hey guys! I’ve just finished the 2026 update for CaterPro AI. I’m looking for 3 active users to test the 7-Day Free Trial and give me an honest review in exchange for a "Founder" discount later. Anyone here working in the service/hospitality space?`
        },
        {
            id: 'dm',
            title: 'The Direct Partner DM',
            subtitle: 'For active members like Felix or Sean',
            icon: UserPlus,
            color: 'bg-emerald-600',
            text: `Chef! Noticed you were active in the Whop chat. I'm Tumi, building CaterPro AI. I’ve engineered a 2026 automation system for catering proposals. I’m looking for reliable partners to help me promote it—you keep 40% of every referral sale. Want to see the dashboard?`
        },
        {
            id: 'affiliate',
            title: 'Affiliate Recruitment',
            subtitle: 'Post this on your Twitter/IG bio',
            icon: TrendingUp,
            color: 'bg-amber-500',
            text: `Stop selling low-ticket tools. Join the CaterPro AI affiliate program on Whop. Help chefs escape the paperwork grind and earn recurring 40% commissions. 7-Day Free Trial active now for your audience. 🚀`
        }
    ];

    return (
        <div className="animate-fade-in space-y-10">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <UserPlus className="text-indigo-600" /> Community Recruiter
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Don't just sell—**Recruit.** Use these scripts to turn active Whop members into your marketing army.
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
                            {copied === script.id ? 'Copied Script' : 'Copy Script'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-10 bg-indigo-50 dark:bg-indigo-900/10 rounded-[3rem] border border-indigo-100 dark:border-indigo-800 flex flex-col sm:flex-row items-center gap-8">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-full shadow-2xl">
                    <Sparkles className="text-indigo-600" size={40} />
                </div>
                <div>
                    <h5 className="text-xl font-black text-indigo-900 dark:text-indigo-200">The "Beta Tester" Strategy</h5>
                    <p className="text-sm text-indigo-700/70 dark:text-indigo-400/70 mt-1 font-medium leading-relaxed">
                        Whop Discovery loves "Total Members." Even if someone uses the 7-Day Free Trial and cancels, they count as a member in the eyes of the algorithm. Your goal is to get as many people to click "Start Trial" as possible.
                    </p>
                </div>
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
                        <p className="mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest text-center">Copy & Paste into the Whop "About" Editor</p>
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
                        <div className="mt-12 p-6 bg-black/20 rounded-[2rem] border border-white/10">
                            <p className="text-xs font-bold leading-relaxed italic">
                                "The difference between a $10 tool and a $500 system is the quality of the sales page. We are building a system."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WhopSEOSniper: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [seoData, setSeoData] = useState<any>(null);
    const [niche, setNiche] = useState('Hospitality AI System');

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const data = await generateWhopSEO(niche);
            setSeoData(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-10">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <Crosshair className="text-red-500" /> Discovery Ranking Hub
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Whop's "Discover" feed is a search engine. To get listed, you must match the <span className="text-indigo-600 font-black italic">Search Intent</span> of people looking for AI and Catering tools.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700 shadow-xl">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block tracking-[0.3em]">1. Meta-Copy Sniper</label>
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input 
                            type="text" 
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            className="w-full pl-12 pr-6 py-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all font-black text-lg shadow-sm"
                            placeholder="Enter niche (e.g. AI Chef System)"
                        />
                    </div>
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} className="text-amber-400" />}
                        {isGenerating ? 'Analyzing Keyword Velocity...' : 'Generate Discovery Package'}
                    </button>

                    <div className="mt-12 space-y-6">
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                            <h4 className="text-[11px] font-black uppercase text-indigo-700 dark:text-indigo-400 tracking-[0.2em] flex items-center gap-2 mb-4">
                                <Settings2 size={18} /> Discovery Listing Checklist
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { t: 'Category Fix', d: 'Set Category to "Software > Productivity" (Not Other).', done: false },
                                    { t: '7-Day Trial', d: 'Verify "Free Trial" is enabled on all paid plans.', done: false },
                                    { t: 'Yearly Plan', d: 'Ensure "Yearly" payment option is active in Whop.', done: false },
                                    { t: 'Headline SEO', d: 'Must be under 80 chars & contain "Catering" + "AI".', done: false }
                                ].map(step => (
                                    <div key={step.t} className="flex items-start gap-4">
                                        <div className="mt-1 w-5 h-5 rounded-md border-2 border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-indigo-500">
                                            <CheckCircle2 size={12} className="opacity-0" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase leading-none">{step.t}</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">{step.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {seoData ? (
                        <div className="p-10 bg-indigo-600 text-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(79,70,229,0.4)] space-y-8 animate-slide-in relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                                <Trophy size={140} />
                            </div>
                            
                            <div className="relative z-10">
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2 block">Whop Discovery Headline</span>
                                <p className="text-2xl font-black leading-tight tracking-tight mt-1">{seoData.optimizedTitle}</p>
                                <button onClick={() => { navigator.clipboard.writeText(seoData.optimizedTitle); alert("Headline Copied!"); }} className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-100 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 transition-all">
                                    <Copy size={12} /> Copy Headline
                                </button>
                            </div>

                            <div className="relative z-10">
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-3 block">Discovery Search Tags</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {seoData.searchTags.map((tag: string) => (
                                        <span key={tag} className="px-4 py-2 bg-white/10 rounded-xl text-xs font-black border border-white/20 shadow-inner">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="relative z-10 p-6 bg-black/20 rounded-3xl border border-white/10">
                                <div className="flex items-center gap-2 mb-2 text-amber-300">
                                    <Star size={16} className="fill-amber-300" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Discovery Description</span>
                                </div>
                                <p className="text-xs text-indigo-100 mt-2 leading-relaxed italic font-medium">"{seoData.optimizedDescription}"</p>
                            </div>

                            <div className="p-4 bg-amber-500/20 rounded-2xl border border-amber-400/30 flex gap-4 relative z-10">
                                <AlertCircle size={20} className="text-amber-400 shrink-0" />
                                <p className="text-[10px] font-bold text-amber-100 leading-relaxed">
                                    <strong>Listing Tip:</strong> Whop users click on "Results" not "Tools". Your description must promise saved time or increased revenue.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900/20">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <HelpCircle className="text-slate-300" size={32} />
                            </div>
                            <h5 className="text-xl font-black text-slate-300 uppercase tracking-widest">Package Pending</h5>
                            <p className="text-sm font-bold text-slate-400 mt-3 max-w-xs leading-relaxed">Let Gemini scan your niche and build the perfect listing package for Whop Discovery.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'whop' | 'recruiter' | 'design' | 'store'>('whop');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['community-post']));

  const toggleTask = (taskId: string) => {
    const newTasks = new Set(completedTasks);
    if (newTasks.has(taskId)) newTasks.delete(taskId);
    else newTasks.add(taskId);
    setCompletedTasks(newTasks);
  };

  const copyToClipboard = (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      alert(`${label} copied!`);
  };

  const dailyTasks = [
    { id: 'whop-trial', label: 'Enable 7-Day Free Trial in Whop', highPriority: true },
    { id: 'whop-yearly', label: 'Add Yearly Payment Option (Save 20%)', highPriority: true },
    { id: 'whop-list-button', label: 'Confirm Visibility on Whop Discover', highPriority: true },
    { id: 'b2b-pitch-academy', label: 'Email 5 Culinary Schools (Free Access Offer)', highPriority: false },
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
            <button onClick={() => setActiveTab('store')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'store' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <ShoppingBag size={16} /> Store Architect
            </button>
            <button onClick={() => setActiveTab('recruiter')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'recruiter' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <UserPlus size={16} /> Recruiter Lab
            </button>
            <button onClick={() => setActiveTab('design')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'design' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Layout size={16} /> Asset Studio
            </button>
            <button onClick={() => setActiveTab('mission')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'mission' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <ClipboardCheck size={16} /> Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="p-10 sm:p-16">
        {activeTab === 'whop' && <WhopSEOSniper />}
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
                            {task.highPriority && !completedTasks.has(task.id) && <span className="ml-3 text-[9px] bg-red-500 text-white px-2.5 py-1 rounded-md font-black tracking-widest shadow-lg shadow-red-500/20">REQUIRED FOR DISCOVERY</span>}
                        </span>
                    </button>
                    ))}
                </div>
                <div className="bg-indigo-600 p-16 rounded-[3rem] flex flex-col justify-center items-center text-center shadow-[0_40px_80px_-15px_rgba(79,70,229,0.5)]">
                    <Award className="text-white/30 mb-8" size={80} />
                    <p className="text-3xl font-black text-white leading-tight mb-8">
                        "Trial leads to<br/>Conversion Velocity."
                    </p>
                    <p className="text-indigo-100 text-sm font-medium mb-10 leading-relaxed">
                        Whop Discover loves high-volume trials. It feeds the algorithm and builds your "Members" count instantly.
                    </p>
                    <button onClick={() => setActiveTab('recruiter')} className="px-12 py-6 bg-white text-indigo-600 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        Open Recruiter Lab
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
