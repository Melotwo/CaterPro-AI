
import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, Camera, ClipboardCheck, BookOpen, Building2, Presentation, Layout, Eye, MessageSquare, Sparkles, Loader2, AlertCircle, AlertTriangle, ListChecks, Star, Settings2, HelpCircle, ShoppingBag, UserPlus, MessageCircle, DollarSign, PieChart, Info, Smartphone, Check, MousePointer2, Activity, ShieldAlert, Instagram, Facebook, Link2, MessageSquareQuote, Flame, Moon, Sun, Clock, ListChecks as ChecklistIcon, FileSearch, X, Pause, Play, Smartphone as IpadIcon, RefreshCw, Coffee, Calculator, Rocket as FreelanceIcon } from 'lucide-react';
import { generateWhopSEO, generateSocialCaption } from '../services/geminiService';
import ThumbnailStudio from './ThumbnailStudio';

interface FounderRoadmapProps {
  whopUrl: string;
  onOpenSocial?: (mode: 'create' | 'reel' | 'status') => void;
}

const FreelanceLab: React.FC = () => {
    const [hourlyRate, setHourlyRate] = useState(500); // ZAR
    const [projectHours, setProjectHours] = useState(5);
    const [isGeneratingGig, setIsGeneratingGig] = useState(false);
    const [gigResult, setGigResult] = useState<string | null>(null);

    const totalProject = hourlyRate * projectHours;

    const handleGenerateGig = async () => {
        setIsGeneratingGig(true);
        try {
            // Reusing social caption logic for a quick gig description
            const desc = await generateSocialCaption(
                "Catering Systems Specialist", 
                "I help catering businesses save 20 hours a week by implementing AI-powered menu generation and lifecycle sales systems.",
                "linkedin" 
            );
            setGigResult(`[UPWORK/FIVERR DESCRIPTION]\n\n"I am a Hospitality Systems Architect with 15 years of sales experience. I don't just plan menus; I build automated digital lifecycle systems for chefs. \n\nWhat I offer:\n- AI Menu Automation Setup\n- ZAR Sourcing & Costing Systems\n- High-Conversion Pitch Scripts\n\nStop the paperwork grind. Let's build your system."\n\n${desc}`);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGeneratingGig(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-12">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <FreelanceIcon className="text-indigo-600" /> Freelance Command
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Melo, your skill stack (Culinary + AI + Sales) is high-ticket. Use this lab to price your gigs and generate descriptions for Upwork or Fiverr.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Price Architect */}
                <div className="p-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-inner space-y-8">
                    <div className="flex items-center gap-3">
                        <Calculator className="text-indigo-500" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Project ROI Architect</h4>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Your Hourly Rate (ZAR)</label>
                            <input 
                                type="range" min="100" max="2000" step="50" 
                                value={hourlyRate} 
                                onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between mt-2 font-black text-indigo-600">
                                <span>R100</span>
                                <span className="text-xl">R{hourlyRate}</span>
                                <span>R2000</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Hours for Project</label>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setProjectHours(h => Math.max(1, h-1))} className="p-4 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm">-</button>
                                <span className="text-3xl font-black text-slate-900 dark:text-white">{projectHours}h</span>
                                <button onClick={() => setProjectHours(h => h+1)} className="p-4 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm">+</button>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Project Quote</p>
                            <h5 className="text-5xl font-black text-indigo-600 tracking-tighter">R{totalProject}</h5>
                            <p className="text-[10px] text-slate-500 font-medium mt-2">"Quote this for custom AI menu implementations."</p>
                        </div>
                    </div>
                </div>

                {/* Gig Architect */}
                <div className="p-8 bg-indigo-600 text-white rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-12 opacity-10"><Zap size={140} /></div>
                    <div className="relative z-10 space-y-6 flex-grow">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-indigo-200" />
                            <h4 className="text-sm font-black uppercase tracking-widest text-indigo-200">AI Gig Architect</h4>
                        </div>
                        
                        {gigResult ? (
                            <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-wrap h-64 overflow-y-auto custom-scrollbar">
                                {gigResult}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-indigo-100 font-bold mb-6">Need a killer Upwork profile or Fiverr gig description?</p>
                                <button 
                                    onClick={handleGenerateGig}
                                    disabled={isGeneratingGig}
                                    className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 mx-auto hover:scale-105 transition-all"
                                >
                                    {isGeneratingGig ? <Loader2 className="animate-spin" /> : <FreelanceIcon size={16} />} 
                                    Generate Description
                                </button>
                            </div>
                        )}
                    </div>
                    {gigResult && (
                        <button 
                            onClick={() => { navigator.clipboard.writeText(gigResult); alert("Copied!"); }}
                            className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"
                        >
                            <Copy size={16} /> Copy to Clipboard
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const MorningMission: React.FC = () => {
    const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
    const [isChatLabOpen, setIsChatLabOpen] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [fontSize, setFontSize] = useState(40);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const salesPitchScript = `[1. NAME + CITY]
"Hi there, my name is Tumelo (Melo) and I’m based in Mokopane in Limpopo the province."

[2. 15 YEARS OF SALES EXPERIENCE]
"I have 15 years of experience in high-performance sales and business development, specifically focusing on building and selling automated systems for the hospitality sector."

[3. THE WIN STORY]
"The deal that makes me most proud just wrapped up on my own project, CaterPro AI. I spotted how chefs were buried under endless paperwork, so I didn’t pitch a simple menu tool—I delivered a full digital lifecycle system. I handled everything from pinpointing their pain to rolling out a tailored AI solution that slashed their proposal time by 80%. What gets me is how it shows real sales isn’t about pushing products; it’s guiding customers from total chaos to smooth, automated growth."

[4. THE CLOSE]
"Thank you for the opportunity, and look forward to speaking soon."`;

    const chatFollowUp = `Hi Daniel, 

Following up on the video I submitted. I was reflecting on why I’m so drawn to this coffee sales role specifically. 

I recently saw a perspective that resonated with me: in an AI-driven world, the only way to stay 'AI-proof' is through genuine human connection. In hospitality, that happens when we 'break bread' or share a coffee. 

It reminds me of Howard Schultz’s observation that coffee lost its 'romance and theatre' when it optimized only for efficiency. My work with CaterPro AI is all about using technology to handle the boring metrics and efficiency in the background, specifically so that we, as salespeople, can focus on that 'theatre' and the human connection on the front end. 

I’m excited about the possibility of bringing that balance of technical systems and human-first sales to the team. Looking forward to hearing from you!

Best,
Melo`;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="p-10 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-[3rem] shadow-2xl border-4 border-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Moon size={160} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg"><Clock size={24} /></div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Tomorrow's Launch Sequence</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">Mission 1: The Sales Exec Application</h4>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => setIsPitchModalOpen(true)}
                                    className="w-full p-4 bg-indigo-600 border border-indigo-400 rounded-2xl flex items-start gap-4 group hover:bg-indigo-500 transition-all text-left shadow-lg shadow-indigo-500/20"
                                >
                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
                                        <PlayCircle size={14} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm text-white uppercase tracking-tight">Launch iPad Teleprompter</p>
                                        <p className="text-[10px] text-indigo-100 font-medium">Video Script submitted? Use this for practice.</p>
                                    </div>
                                    <ArrowRight size={16} className="ml-auto mt-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </button>
                                
                                <button 
                                    onClick={() => setIsChatLabOpen(true)}
                                    className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl flex items-start gap-4 group hover:bg-slate-700 transition-all text-left shadow-lg"
                                >
                                    <div className="p-1.5 bg-blue-500 rounded-lg shrink-0">
                                        <MessageSquare size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm text-white uppercase tracking-tight">Recruiter Chat Lab</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Rewritten "Human-Connection" Follow-up</p>
                                    </div>
                                    <Sparkles size={16} className="ml-auto mt-1 text-blue-400 animate-pulse" />
                                </button>

                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4 opacity-50">
                                    <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check size={12} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Submit nothing.eco Form</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Completed ✅</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Mission 2: App Final Polish</h4>
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] space-y-4">
                                <p className="text-sm font-medium leading-relaxed text-emerald-100">"Melo, the app is looking amazing. Tomorrow we just need to verify the **ZAR procurement calculation** accuracy and test one **Share Link** on a mobile device."</p>
                                <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                                    Final Launch Checklist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CHAT FOLLOW-UP MODAL */}
            {isChatLabOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div onClick={() => setIsChatLabOpen(false)} className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl animate-fade-in"></div>
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border-4 border-blue-500/30 overflow-hidden animate-scale-up flex flex-col">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-950 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><Coffee size={24} /></div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">LinkedIn Pivot Message</h3>
                                    <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Rewritten for Daniel Seligman</p>
                                </div>
                            </div>
                            <button onClick={() => setIsChatLabOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 italic text-slate-700 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                                {chatFollowUp}
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">
                                <Info size={16} /> Use this to show Daniel that you understand the "Ritual" of coffee sales.
                            </div>
                            <button 
                                onClick={() => handleCopy(chatFollowUp)}
                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                            >
                                <Copy size={18} /> Copy Message for LinkedIn
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[2.5rem] border-2 border-amber-100 dark:border-amber-800 flex gap-6 items-center">
                <div className="p-4 bg-amber-500 rounded-2xl text-white shadow-xl"><Trophy size={32} /></div>
                <div>
                    <h5 className="font-black text-amber-900 dark:text-amber-200 uppercase tracking-widest text-sm">Founder Mindset</h5>
                    <p className="text-sm text-amber-700/80 dark:text-amber-400/80 font-medium leading-relaxed">
                        If they ask about your sales experience in the interview, show them **CaterPro AI**. Tell them you built a digital lifecycle system to solve customer churn in the hospitality industry.
                    </p>
                </div>
            </div>

            {/* iPad-OPTIMIZED TELEPROMPTER MODAL */}
            {isPitchModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
                    <div onClick={() => setIsPitchModalOpen(false)} className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl animate-fade-in"></div>
                    <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 h-full sm:h-[90vh] sm:rounded-[4rem] shadow-2xl border-x sm:border-4 border-indigo-600/30 flex flex-col overflow-hidden animate-scale-up">
                        
                        {/* Header Area */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg animate-pulse"><Video size={24} /></div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Nothing.eco Application</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded tracking-widest">iPad Front Camera Optimized</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setFontSize(f => Math.min(f + 10, 80))} className="p-3 bg-white dark:bg-slate-800 border rounded-xl font-bold">A+</button>
                                <button onClick={() => setFontSize(f => Math.max(f - 10, 20))} className="p-3 bg-white dark:bg-slate-800 border rounded-xl font-bold">A-</button>
                                <button onClick={() => setIsPitchModalOpen(false)} className="p-3 bg-red-50 text-red-500 rounded-xl"><X size={24} /></button>
                            </div>
                        </div>

                        {/* iPad Multitasking Instructions (Dismissible) */}
                        {showInstructions && (
                            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/20 rounded-lg"><IpadIcon size={24} /></div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest">How to read while recording:</p>
                                        <p className="text-[11px] font-medium opacity-90">1. Open Camera App. 2. Swipe up for Dock. 3. Drag Safari to the side. 4. Record!</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowInstructions(false)} className="p-2 bg-white/10 rounded-full"><X size={16} /></button>
                            </div>
                        )}

                        {/* Teleprompter Content */}
                        <div 
                            ref={scrollContainerRef}
                            className="flex-grow p-10 sm:p-20 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 scroll-smooth"
                        >
                            <p 
                                style={{ fontSize: `${fontSize}px` }}
                                className="font-black leading-[1.3] text-slate-800 dark:text-slate-100 italic whitespace-pre-wrap max-w-4xl mx-auto text-center tracking-tight pb-40"
                            >
                                {salesPitchScript}
                            </p>
                        </div>

                        {/* Footer Controls */}
                        <div className="p-8 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/20 rounded-2xl"><Target className="text-emerald-400" /></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Target Duration</p>
                                    <p className="text-xs font-bold text-white uppercase tracking-tight">Under 2 Minutes</p>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button onClick={() => handleCopy(salesPitchScript)} className="flex-1 sm:flex-none px-8 py-5 bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Copy size={16} /> Copy
                                </button>
                                <button 
                                    onClick={() => {
                                        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                    }} 
                                    className="flex-1 sm:flex-none px-8 py-5 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={16} /> Reset
                                </button>
                                <button onClick={() => setIsPitchModalOpen(false)} className="flex-1 sm:flex-none px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                                    Ready to Record <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const WhopSEOArchitect: React.FC = () => {
    const [niche, setNiche] = useState('AI Catering System');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const data = await generateWhopSEO(niche);
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const copy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="animate-fade-in space-y-10">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <ChecklistIcon className="text-indigo-600" /> Whop SEO Architect
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Melo, your Whop checklist shows the title and description need more weight. Use this tool to generate **Checkpoint-Compliant** assets.
                </p>
            </div>

            <div className="flex gap-3 mb-10">
                <input 
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="flex-grow p-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your specific product niche..."
                />
                <button 
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} Optimize
                </button>
            </div>

            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-800 rounded-[2.5rem] relative group">
                            <span className="absolute top-4 right-4 px-2 py-1 bg-emerald-500 text-white text-[8px] font-black rounded uppercase">Title Check: PASS</span>
                            <h4 className="text-[10px] font-black uppercase text-emerald-600 mb-2">Optimized Title (20-30 Chars + Number)</h4>
                            <p className="text-xl font-black text-slate-900 dark:text-white mb-6">{result.title}</p>
                            <button onClick={() => copy(result.title, 'title')} className="w-full py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-black text-[10px] uppercase border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:bg-slate-50">
                                {copied === 'title' ? 'Copied!' : 'Copy Title'}
                            </button>
                        </div>
                        <div className="p-8 bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-800 rounded-[2.5rem]">
                            <h4 className="text-[10px] font-black uppercase text-blue-600 mb-2">Compelling Headline (50-80 Chars)</h4>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed mb-6">{result.headline}</p>
                            <button onClick={() => copy(result.headline, 'headline')} className="w-full py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-black text-[10px] uppercase border border-slate-200 dark:border-slate-700 shadow-sm">
                                {copied === 'headline' ? 'Copied!' : 'Copy Headline'}
                            </button>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><FileSearch size={140} /></div>
                        <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-4 tracking-widest">Benefit-Focused Description</h4>
                        <div className="text-xs text-slate-300 font-medium leading-relaxed whitespace-pre-wrap mb-8 h-64 overflow-y-auto custom-scrollbar pr-4">
                            {result.description}
                        </div>
                        <button onClick={() => copy(result.description, 'desc')} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-colors">
                            {copied === 'desc' ? 'Copied to Clipboard' : 'Copy Full Description'}
                        </button>
                    </div>
                </div>
            )}
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
        </div>
    );
};

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl, onOpenSocial }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'seo' | 'whop' | 'design' | 'bounty' | 'freelance'>('mission');

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
            <button onClick={() => setActiveTab('mission')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'mission' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Star size={16} /> Morning Mission
            </button>
            <button onClick={() => setActiveTab('freelance')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'freelance' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <FreelanceIcon size={16} /> Freelance Lab
            </button>
            <button onClick={() => setActiveTab('seo')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'seo' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <ChecklistIcon size={16} /> SEO Architect
            </button>
            <button onClick={() => setActiveTab('whop')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'whop' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Crosshair size={16} /> Store Audit
            </button>
            <button onClick={() => setActiveTab('bounty')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'bounty' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <DollarSign size={16} /> Lead Command
            </button>
            <button onClick={() => setActiveTab('design')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'design' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Layout size={16} /> Assets
            </button>
          </div>
        </div>
      </div>

      <div className="p-10 sm:p-16">
        {activeTab === 'mission' && <MorningMission />}
        {activeTab === 'freelance' && <FreelanceLab />}
        {activeTab === 'seo' && <WhopSEOArchitect />}
        {activeTab === 'whop' && (
            <div className="animate-fade-in space-y-10">
                <div className="max-w-3xl">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Discovery Audit</h3>
                    <p className="text-lg text-slate-500">The Whop algorithm prioritizes products that bring **New Users** to the platform. By setting up a clipping bounty, you generate hundreds of "New User" entries, pushing you to the top of the feed.</p>
                </div>
                
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
                            className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            Open Caption Studio <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        )}
        {activeTab === 'bounty' && <ClippingBountyLab />}
        {activeTab === 'design' && <ThumbnailStudio />}
      </div>
    </section>
  );
};

export default FounderRoadmap;
