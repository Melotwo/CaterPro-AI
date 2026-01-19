
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, Camera, ClipboardCheck, BookOpen, Building2, Presentation, Layout, Eye, MessageSquare, Sparkles, Loader2, AlertCircle, AlertTriangle, ListChecks, Star, Settings2, HelpCircle, ShoppingBag, UserPlus, MessageCircle, DollarSign, PieChart, Info, Smartphone, Check, MousePointer2, Activity, ShieldAlert, Instagram, Facebook, Link2, MessageSquareQuote, Flame, ShieldCheck as Shield } from 'lucide-react';
import { generateWhopSEO } from '../services/geminiService';
import ThumbnailStudio from './ThumbnailStudio';

interface FounderRoadmapProps {
  whopUrl: string;
  onOpenSocial?: (mode: 'create' | 'reel' | 'status') => void;
}

const RedditHub: React.FC = () => {
    const [copied, setCopied] = useState<string | null>(null);
    const [karmaDays, setKarmaDays] = useState(0);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text.trim());
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const subreddits = [
        { name: 'r/Chefit', focus: 'Pro Chefs & Techniques' },
        { name: 'r/KitchenConfidential', focus: 'Industry Culture (Be authentic)' },
        { name: 'r/foodtrucks', focus: 'Mobile Logistics' },
        { name: 'r/MealPrepSunday', focus: 'Efficiency & Systems' },
        { name: 'r/SaaS', focus: 'Builder Community' }
    ];

    return (
        <div className="animate-fade-in space-y-10">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <Flame className="text-orange-600" /> Reddit Growth Hub
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Melo, your research is 100% correct. Reddit is for <span className="italic font-bold">value</span>, not ads. Use this kit to build authority before dropping the link.
                </p>
            </div>

            {/* KARMA WARMUP TRACKER */}
            <div className="p-8 bg-slate-900 text-white rounded-[3rem] shadow-2xl border-4 border-indigo-500/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-tight mb-2">Phase 1: Karma Warmup</h4>
                        <p className="text-slate-400 text-sm font-medium">Day {karmaDays}/14 of helpful commenting. Do not post threads yet!</p>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(day => (
                            <button 
                                key={day} 
                                onClick={() => setKarmaDays(day)}
                                className={`w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${karmaDays >= day ? 'bg-indigo-500 text-white shadow-lg' : 'bg-slate-800 text-slate-600 border border-slate-700'}`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SUBREDDIT DIRECTORY */}
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Target Communities</h4>
                    {subreddits.map(sub => (
                        <div key={sub.name} className="p-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                            <div>
                                <p className="font-black text-slate-900 dark:text-white">{sub.name}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{sub.focus}</p>
                            </div>
                            <a 
                                href={`https://reddit.com/${sub.name}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 group-hover:text-indigo-500 transition-colors"
                            >
                                <ExternalLink size={18} />
                            </a>
                        </div>
                    ))}
                </div>

                {/* REDDIT VALUE SCRIPTS */}
                <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Value-First Scripts</h4>
                    
                    <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><MessageSquare size={80} /></div>
                        <h5 className="text-sm font-black uppercase tracking-widest mb-4">Tutorial Hook (Best for r/Chefit)</h5>
                        <p className="text-xs font-medium italic leading-relaxed mb-6">
                            "I spent years dreading the admin side of my catering business. Last month I decided to build an AI system to handle it. I managed to cut my proposal time by 80%. Here is the exact workflow I'm using now to stay in the kitchen instead of the office..."
                        </p>
                        <button onClick={() => handleCopy("I spent years dreading the admin side of my catering business. Last month I decided to build an AI system to handle it. I managed to cut my proposal time by 80%. Here is the exact workflow I'm using now to stay in the kitchen instead of the office...", "reddit-tutorial")} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                            {copied === 'reddit-tutorial' ? 'Copied Script' : 'Copy Reddit Script'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClippingBountyLab: React.FC = () => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text.trim());
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="animate-fade-in space-y-12">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <DollarSign className="text-emerald-500" /> Bounty & Lead Command
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Melo, your current outreach is **perfect**. You are providing the link immediately. Now, let's protect the brand and scale.
                </p>
            </div>

            {/* BRAND PROTECTION: RULES & REGS */}
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-4 border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-500 rounded-2xl text-white shadow-lg"><ShieldAlert size={24} /></div>
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">Clipper Rules & Regulations</h4>
                        <p className="text-[10px] font-black uppercase text-red-500 tracking-widest mt-2">Zero Tolerance for Brand Damage</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">The Clipper Code (Send this to them)</p>
                        <div className="space-y-3">
                            {[
                                "No Spamming: Do not post the same video more than 3 times a week.",
                                "No Fake Promises: Do not say the app is '100% Free Forever'.",
                                "Aesthetic Only: Use the provided high-res reels or recorded screen only.",
                                "Clear CTA: Must mention 'Link in Bio' or 'Join via dashboard'.",
                                "Social Handles: Tag @caterproai_ in every post for visibility."
                            ].map((rule, idx) => (
                                <div key={idx} className="flex gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">{idx+1}</div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{rule}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-slate-950 p-8 rounded-[2rem] text-white space-y-6">
                        <h5 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">Scaling Strategy: The "Waitlist"</h5>
                        <p className="text-xs font-medium text-slate-400 leading-relaxed">
                            Melo, when you hit Clipper #6, do not just say "Yes." Say this:
                        </p>
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl italic text-sm text-indigo-100 leading-relaxed">
                            "Chef! The Launch Team (First 5) is currently FULL. I'm moving you to the Priority Waitlist. As soon as a slot opens up based on performance, I'll send you your dashboard link. Show me an edit you've done before and I might fast-track you."
                        </div>
                        <p className="text-[10px] font-black uppercase text-amber-500">Why? Scarcity makes clippers work harder and stay loyal.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* INTEREST RESPONSE KIT (ONBOARDING) */}
                <div className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10"><MessageCircle size={120} /></div>
                    <div className="relative z-10">
                        <h4 className="text-xl font-black uppercase tracking-tight mb-6">Retention Scripts</h4>
                        <div className="space-y-6">
                            <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
                                <p className="text-[10px] font-black uppercase text-indigo-200 mb-2">The "Rules & Assets" Message</p>
                                <p className="text-sm font-bold italic leading-relaxed">"Legend, dashboard is live! Here is the code: No spam, tag @caterproai_, and use high-res assets only. I've attached the Content Kit below. Let's get these views!"</p>
                                <button onClick={() => handleCopy("Legend, dashboard is live! Here is the code: No spam, tag @caterproai_, and use high-res assets only. I've attached the Content Kit below. Let's get these views!", "rules-msg")} className="mt-4 text-[10px] font-black uppercase tracking-widest bg-white text-indigo-600 px-4 py-2 rounded-lg hover:scale-105 transition-transform">
                                    {copied === 'rules-msg' ? 'Copied!' : 'Copy Rules Message'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-8 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700 shadow-lg">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <Link2 size={18} className="text-indigo-500" /> Success Checklist
                        </h4>
                        <div className="space-y-4">
                            {[
                                { t: 'Rules Established', d: 'Always send the 5 rules immediately after they sign up.' },
                                { t: 'Waitlist Mode (Clipper #6+)', d: 'Stop auto-approving. Start vetting based on editing quality.' },
                                { t: 'Weekly Payout Call', d: 'Check Whop every Friday to see who is earning and send them a "Keep it up" DM.' }
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
                </div>
            </div>
        </div>
    );
};

const StorefrontAudit: React.FC = () => {
    const [copied, setCopied] = useState<string | null>(null);
    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text.trim());
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="animate-fade-in space-y-10">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <ShoppingBag className="text-indigo-600" /> Whop Store Polish
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Melo, your branding is coming together! Use these links to finish your Whop profile setup.
                </p>
            </div>

            {/* SOCIAL LINK SYNC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-2 border-pink-100 dark:border-pink-800 rounded-[2.5rem] shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl text-white shadow-lg">
                            <Instagram size={20} />
                        </div>
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Your Instagram</h4>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-pink-200 dark:border-pink-700">
                        <code className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate mr-2">instagram.com/caterproai_/</code>
                        <button onClick={() => handleCopy("https://www.instagram.com/caterproai_/", "ig")} className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl hover:scale-110 transition-transform">
                            {copied === 'ig' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-pink-600" />}
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-800 rounded-[2.5rem] shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-[#1877F2] rounded-2xl text-white shadow-lg">
                            <Facebook size={20} />
                        </div>
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Your Facebook</h4>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-blue-200 dark:border-blue-700">
                        <code className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate mr-2">facebook.com/CaterProAi</code>
                        <button onClick={() => handleCopy("https://www.facebook.com/CaterProAi", "fb")} className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl hover:scale-110 transition-transform">
                            {copied === 'fb' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-blue-600" />}
                        </button>
                    </div>
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
            title: 'Whop Clips Chat Hook',
            subtitle: 'Post this in the main Clipping Deals chat',
            icon: PlayCircle,
            color: 'bg-red-600',
            text: `I'm launching the first AI Catering System for 2026. I'm looking for 5 clippers to join my 'Launch Team'—paying $2 per 1k views + 30% recurring lifetime commission. The niche is empty and ready to blow. Who wants the dashboard link?`
        },
        {
            id: 'dm',
            title: 'Partner Acquisition DM',
            subtitle: 'For high-quality creators',
            icon: UserPlus,
            color: 'bg-emerald-600',
            text: `Chef! Noticed your edits are clean. I've built CaterPro AI—the first 'Lifecycle' system for catering pros. I'm looking for a lead partner. I'll give you a permanent 30% cut of every sub you bring in for life. Want to see the app?`
        },
        {
            id: 'alpha-test',
            title: 'Alpha Review Request',
            subtitle: 'Post in Hospitality chats',
            icon: Star,
            color: 'bg-amber-500',
            text: `Launching the 2026 Catering Command Center today. 7-Day FREE trial is active. I'm looking for honest reviews from chefs to help my ranking. If you drop a review, I'll send you a 30% lifetime discount code for your own setup.`
        }
    ];

    return (
        <div className="animate-fade-in space-y-10">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <UserPlus className="text-indigo-600" /> Recruitment Command
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Use these optimized scripts to build your salesforce. 30% lifetime commission is the "Gold Standard" for serious partners.
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

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl, onOpenSocial }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'whop' | 'recruiter' | 'design' | 'store' | 'bounty' | 'reddit'>('whop');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['community-post']));

  const toggleTask = (taskId: string) => {
    const newTasks = new Set(completedTasks);
    if (newTasks.has(taskId)) newTasks.delete(taskId);
    else newTasks.add(taskId);
    setCompletedTasks(newTasks);
  };

  const dailyTasks = [
    { id: 'whop-bio', label: 'Update Whop Bio (Copy from Polish Tab)', highPriority: true },
    { id: 'whop-links', label: 'Add Web App Link to Whop Links section', highPriority: true },
    { id: 'whop-socials', label: 'Add Instagram/Facebook icons to Storefront', highPriority: true },
    { id: 'whop-bounty-live', label: 'Post Bounty offer in Whop Clips chat', highPriority: true },
    { id: 'reddit-engage', label: 'Complete 3 helpful Reddit comments', highPriority: true },
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
            <button onClick={() => setActiveTab('reddit')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'reddit' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Flame size={16} /> Reddit Hub
            </button>
            <button onClick={() => setActiveTab('store')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'store' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <ShoppingBag size={16} /> Store Polish
            </button>
            <button onClick={() => setActiveTab('bounty')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'bounty' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <DollarSign size={16} /> Lead Command
            </button>
            <button onClick={() => setActiveTab('recruiter')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'recruiter' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <UserPlus size={16} /> Recruiter
            </button>
            <button onClick={() => setActiveTab('design')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'design' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Layout size={16} /> Assets
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
                
                {/* NEW VIRAL STUDIO ACCESS POINT */}
                <div className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity"><MessageSquareQuote size={140} /></div>
                    <div className="relative z-10 max-w-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20"><Sparkles size={24} /></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">AI Viral Content Generator</span>
                        </div>
                        <h4 className="text-3xl font-black mb-4">Need Captions for your Photo?</h4>
                        <p className="text-indigo-100 font-medium leading-relaxed mb-8">Launch the Caption Studio to generate optimized posts for Facebook, X, and Pinterest instantly.</p>
                        <button 
                            onClick={() => onOpenSocial?.('create')}
                            className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                        >
                            Open Caption Studio <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[3rem] border-2 border-amber-100 dark:border-amber-800 flex gap-6">
                    <AlertTriangle className="text-amber-500 shrink-0" size={32} />
                    <div>
                        <p className="font-black text-amber-900 dark:text-amber-200 uppercase tracking-widest">Crucial Insight</p>
                        <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1 font-medium leading-relaxed">
                            Your research shows competitors are earning **$13k/day**. Your advantage is **$2 Bounty + 30% Lifetime Cut.** Ensure your Whop pricing has the "7-Day Trial" turned ON to maximize conversion velocity.
                        </p>
                    </div>
                </div>
            </div>
        )}
        {activeTab === 'reddit' && <RedditHub />}
        {activeTab === 'store' && <StorefrontAudit />}
        {activeTab === 'bounty' && <ClippingBountyLab />}
        {activeTab === 'recruiter' && <CommunityRecruiter />}
        {activeTab === 'design' && <ThumbnailStudio />}
      </div>
    </section>
  );
};

export default FounderRoadmap;
