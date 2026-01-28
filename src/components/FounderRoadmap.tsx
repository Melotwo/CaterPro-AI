import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, 
  Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, 
  Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, 
  Camera, ClipboardCheck, BookOpen, Building2, Presentation, Layout, Eye, MessageSquare, 
  Sparkles, Loader2, AlertCircle, AlertTriangle, ListChecks, Star, Settings2, HelpCircle, 
  ShoppingBag, UserPlus, MessageCircle, DollarSign, PieChart, Info, Smartphone, Check, 
  MousePointer2, Activity, ShieldAlert, Instagram, Facebook, Link2, MessageSquareQuote, 
  Flame, Moon, Sun, Clock, FileSearch, X, Pause, Play, RefreshCw, Coffee, Calculator, 
  Briefcase as UpworkIcon, ListOrdered, Lightbulb, ShoppingCart, Tag, FolderHeart, 
  UserCog, Keyboard, Terminal, Sparkle, FileDown, VideoOff, Scissors, Newspaper, Ghost,
  UserCheck, Swords, CalendarDays, ListTodo, Image as ImageIcon, Box, HelpCircle as QuestionIcon,
  UserPlus2, FileSignature as FileSignatureIcon,
  Trophy as CampaignIcon,
  Navigation2,
  Heart,
  Cpu,
  Share,
  Layers,
  PhoneCall,
  LayoutDashboard,
  ShieldX,
  CreditCard,
  History,
  Lock,
  MousePointer
} from 'lucide-react';
import ThumbnailStudio from './ThumbnailStudio';
import { generateClipperBriefFromApi } from '../services/geminiService';

interface FounderRoadmapProps {
  whopUrl: string;
  onOpenSocial?: (mode: 'create' | 'reel' | 'status') => void;
}

const SecurityHub: React.FC = () => {
    return (
        <div className="space-y-10 animate-slide-in">
            {/* SCAM SHIELD - CRITICAL ALERT */}
            <div className="p-10 bg-slate-950 text-white rounded-[3.5rem] border-4 border-red-500 shadow-[0_0_50px_-12px_rgba(239,68,68,0.5)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12"><ShieldX size={200} /></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-5">
                            <div className="p-5 bg-red-600 rounded-[2rem] shadow-xl animate-pulse">
                                <ShieldAlert size={36} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight">Scam Shield 2026</h3>
                                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-1">Active Defense Protocol</p>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                <Activity size={14} /> Intelligence Log: Updated 1m ago
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h5 className="text-sm font-black uppercase text-red-500 tracking-[0.2em] flex items-center gap-2">
                                <AlertTriangle size={18} /> High-Level Threats Detected
                            </h5>
                            <div className="space-y-4">
                                {[
                                    { t: "The 'View My Order' Link", d: "Links like 'galerymedia.com' or 'bit.ly' sent via chat. They steal your login.", icon: MousePointer },
                                    { t: "Outside Payment Request", d: "Asking to pay via WhatsApp or direct bank transfer to 'verify'.", icon: CreditCard },
                                    { t: "Fake PDF Attachments", d: "Files named 'Order_Details.exe' or 'Requirement.zip'. Never open these.", icon: FileDown }
                                ].map((threat, i) => (
                                    <div key={i} className="p-5 bg-white/5 rounded-3xl border border-white/10 flex gap-4 items-start group hover:bg-white/10 transition-all">
                                        <div className="p-3 bg-red-500/20 rounded-xl text-red-500"><threat.icon size={20} /></div>
                                        <div>
                                            <p className="text-sm font-black text-white">{threat.t}</p>
                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">{threat.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white text-slate-950 p-10 rounded-[3rem] shadow-2xl relative">
                            <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-4 rounded-3xl shadow-xl">
                                <ShieldCheck size={28} />
                            </div>
                            <h6 className="text-xl font-black uppercase tracking-tight mb-6">Safe Gig Workflow</h6>
                            <ol className="space-y-6">
                                {[
                                    { s: "Step 1: Check the Dashboard", d: "If the order isn't in your 'Active Orders' tab, it doesn't exist." },
                                    { s: "Step 2: Never Click External Links", d: "Real clients send requirements via the platform's internal uploader." },
                                    { s: "Step 3: Verify the Profile", d: "Scammers usually have brand new accounts with no reviews." }
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs">{i+1}</div>
                                        <div>
                                            <p className="text-sm font-black leading-none mb-1">{step.s}</p>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                            <div className="mt-10 pt-8 border-t border-slate-100">
                                <button onClick={() => window.open('https://www.fiverr.com/support/articles/360010978617-Safety-and-Security-Tips-for-Sellers', '_blank')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                                    <Info size={14} /> Official Platform Safety Guide
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GIG MONITOR */}
            <div className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-slate-100 dark:border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-lg"><History size={32} /></div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Gig Verification Log</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Monitoring incoming leads</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Systems OK</span>
                    </div>
                </div>
                
                <div className="p-20 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[4rem]">
                    <Lock className="mx-auto text-slate-200 dark:text-slate-700 mb-6" size={80} />
                    <h5 className="text-2xl font-black text-slate-400">Secure Order Vault</h5>
                    <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">No verified orders found. Real client data will appear here once confirmed by the Whop/Fiverr API.</p>
                </div>
            </div>
        </div>
    );
};

const AutomationLab: React.FC = () => {
    return (
        <div className="space-y-10 animate-slide-in">
            {/* MAKE.COM FLOW */}
            <div className="p-10 bg-slate-950 text-white rounded-[3.5rem] border-4 border-indigo-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10"><Cpu size={160} className="text-indigo-400" /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-indigo-600 rounded-3xl shadow-lg"><Layers size={32} /></div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">System Workflow</h3>
                            <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mt-1">Your 2026 Tech Stack Logic</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-black">01</div>
                            <h5 className="text-sm font-black uppercase tracking-widest text-white">Capture (The App)</h5>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Chef enters email in <strong>CaterPro AI</strong>. This is the "Trigger."</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 font-black">02</div>
                            <h5 className="text-sm font-black uppercase tracking-widest text-white">Distribute (Make)</h5>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Make.com sends data to <strong>Google Sheets</strong> and your <strong>CRM</strong>.</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-black">03</div>
                            <h5 className="text-sm font-black uppercase tracking-widest text-white">Nurture (Klaviyo)</h5>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Customer gets an automated <strong>"Welcome"</strong> email with their menu PDF.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CRM STRATEGY CARD */}
            <div className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-emerald-500 rounded-3xl text-white shadow-lg"><LayoutDashboard size={32} /></div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">CRM Selection: HubSpot</h3>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Recommended for Catering Sales</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Why HubSpot?</h5>
                        <ul className="space-y-4">
                            {[
                                "Free mobile app to manage leads on the go",
                                "One-click email tracking (know when they open the menu)",
                                "Simple 'Pipeline' view to drag and drop deals",
                                "Integrates perfectly with Make.com"
                            ].map((f, i) => (
                                <li key={i} className="flex gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="text-emerald-500 shrink-0" size={18} /> {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
                        <PhoneCall className="mx-auto text-indigo-500 mb-4" size={48} />
                        <h6 className="font-black uppercase text-sm mb-2">The 2026 Sales Move</h6>
                        <p className="text-xs text-slate-500 leading-relaxed">When a lead hits your sheet via Make, use the HubSpot app to <strong>WhatsApp them immediately</strong> while they are still in 'Aha!' mode.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GigArchitect: React.FC = () => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Gig Text Copied!");
    };

    const gigDescription = `I am a Hospitality Systems Architect specializing in AI-driven procurement and menu logic. 

I will build you a custom AI system that:
- Renders 5-course proposals in <30 seconds
- Calculates ZAR/USD food costing instantly
- Organizes shopping lists by store category
- Integrates with your CRM for lead capture

Stop wasting 15+ hours a week on office admin. Let me architect your digital kitchen.`;

    return (
        <div className="space-y-10 animate-slide-in">
            <div className="p-10 bg-indigo-600 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border-4 border-indigo-400/30">
                <div className="absolute top-0 right-0 p-10 opacity-10"><Briefcase size={160} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-white/20 rounded-2xl"><Award size={32} /></div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">Fiverr Gig Architect</h3>
                            <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest mt-1">Convert your profile into orders</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-black/20 p-6 rounded-3xl border border-white/10">
                                <h5 className="text-[10px] font-black uppercase text-indigo-200 mb-4">Recommended Gig Title</h5>
                                <p className="text-xl font-black leading-tight italic">
                                    "I will build a custom AI menu automation system for your catering business"
                                </p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-3xl border border-white/10">
                                <h5 className="text-[10px] font-black uppercase text-indigo-200 mb-4">Gig Description (Copy/Paste)</h5>
                                <p className="text-xs font-medium leading-relaxed italic text-indigo-50">
                                    {gigDescription}
                                </p>
                                <button onClick={() => handleCopy(gigDescription)} className="mt-4 w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest">Copy Description</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Step-by-Step Launch</h5>
                            {[
                                "Go to 'Asset Studio' and render Image 1 (Yellow Theme)",
                                "Capture a video showing your app in action for the Gig Video",
                                "Set pricing: Basic ($50), Standard ($95), Premium ($250)",
                                "Use keywords: Catering AI, Menu Automation, Hospitality Systems"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/20">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-black text-[10px] text-white">{i+1}</div>
                                    <p className="text-xs font-bold text-white">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CampaignHunter: React.FC = () => {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} Copied!`);
    };

    const campaignPitch = `Hi there! I am the founder of CaterPro AI (a SaaS for hospitality automation). I am a specialist in "Proof of Work" content. I don't just post; I build systems. I can create a professional UGC walkthrough for your campaign that demonstrates high-level utility and authority. Ready to start immediately.`;

    const dmFollowUp = `Hey Nathan! Stoked to be here. I've already architected the 'Proof of Work' walkthrough for CaterPro AI. Where's the best spot to drop my first submission for the V2 rewards?`;

    return (
        <div className="space-y-10 animate-slide-in">
            {/* DM STRATEGY - SPECIFIC TO USER SCREENSHOT */}
            <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 border-4 border-indigo-500/20 rounded-[3rem] relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><MessageSquare size={24} /></div>
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-tight">The "Clip Farm" DM Reply</h4>
                        <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mt-1">Reply to Nathan Johnson with this</p>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-100 dark:border-slate-800 shadow-sm">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 italic leading-relaxed">
                        "{dmFollowUp}"
                    </p>
                    <button 
                        onClick={() => handleCopy(dmFollowUp, 'DM Reply')}
                        className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline"
                    >
                        <Copy size={14} /> Copy Reply Text
                    </button>
                </div>
            </div>

            {/* WHOP CAMPAIGN STRATEGY */}
            <div className="p-10 bg-slate-950 text-white rounded-[3.5rem] border-4 border-purple-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10"><CampaignIcon size={160} className="text-purple-400" /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-purple-600 rounded-3xl shadow-lg"><Zap size={32} /></div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">Campaign Hunter</h3>
                            <p className="text-xs font-bold text-purple-300 uppercase tracking-widest mt-1">Winning Whop Discovery Campaigns</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                                <h5 className="text-[10px] font-black uppercase text-purple-400 mb-2">The "Founder Pitch" (Post to Whop Forms)</h5>
                                <p className="text-sm font-medium leading-relaxed italic text-slate-300">
                                    "{campaignPitch}"
                                </p>
                                <button 
                                    onClick={() => handleCopy(campaignPitch, 'Founder Pitch')}
                                    className="mt-4 w-full py-3 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                >
                                    Copy Pitch Template
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Whop Checklist</h5>
                            {[
                                "Filter by 'CPM' for high payouts",
                                "Look for 'Product' tag (Matches CaterPro style)",
                                "Toggle 'Verified' to hide low-quality gigs",
                                "Join 'Clip Farm Chat' for internal leaks"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-black text-[10px] text-white">{i+1}</div>
                                    <p className="text-xs font-bold text-slate-300">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WhopWarRoom: React.FC = () => {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} Copied!`);
    };

    return (
        <div className="space-y-10 animate-slide-in">
            {/* POSTING DESTINATION MAP */}
            <div className="p-8 bg-slate-900 rounded-[3rem] text-white border-4 border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Navigation2 size={140} /></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">The "Where to Post" Map</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Match your App Outputs to these Platforms</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { output: 'Captions/Flex Posts', platform: 'Facebook Groups', icon: Facebook, color: 'text-blue-500' },
                            { output: 'Reel Scripts', platform: 'TikTok / Instagram', icon: Video, color: 'text-pink-500' },
                            { output: 'Gig Thumbnails', platform: 'Fiverr / Upwork', icon: ImageIcon, color: 'text-emerald-500' },
                            { output: 'Campaign Pitches', platform: 'Whop Discovery', icon: CampaignIcon, color: 'text-purple-500' }
                        ].map((item, i) => (
                            <div key={i} className="p-5 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col items-center text-center gap-3">
                                <item.icon className={item.color} size={28} />
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase">{item.output}</p>
                                    <p className="text-xs font-bold">{item.platform}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* NEW: WAITING ROOM STRATEGY CARD */}
            <div className="p-10 bg-slate-950 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border-4 border-slate-800">
                <div className="absolute top-0 right-0 p-10 opacity-10"><Clock size={140} className="animate-spin-slow" /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-amber-500 rounded-3xl shadow-lg animate-pulse"><Activity size={32} /></div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">The Waiting Room</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">What to do while your application is pending</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                            <h5 className="text-[10px] font-black uppercase text-amber-500 tracking-widest">1. Monitor Submission Forms</h5>
                            <p className="text-xs text-slate-300 leading-relaxed">In the Whop sidebar, keep an eye on the <strong>Submission Forms</strong> link. This is where active campaign requirements usually update.</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                            <h5 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">2. Join "Clip Farm Chat"</h5>
                            <p className="text-xs text-slate-300 leading-relaxed">Engagement is everything. Introduce yourself in the chat as a "CaterPro AI Systems Founder." It builds massive authority.</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                            <h5 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">3. Proof of Work</h5>
                            <p className="text-xs text-slate-300 leading-relaxed">Don't just wait. Go to the <strong>Asset Studio</strong> tab and render 3 more thumbnails. Have your portfolio ready for the moment they reply.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClippingHub: React.FC = () => {
    const [briefTopic, setBriefTopic] = useState('HOSPITALITY AI SYSTEM');
    const [hookStyle, setHookStyle] = useState('Aggressive / Call-out');
    const [isGenerating, setIsGenerating] = useState(false);
    const [brief, setBrief] = useState('');

    const handleGenerateBrief = async () => {
        setIsGenerating(true);
        try {
            const result = await generateClipperBriefFromApi(briefTopic, hookStyle);
            setBrief(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8 animate-slide-in">
            {/* FINDING CLIPPERS GUIDE */}
            <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white border-4 border-indigo-500/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-45"><Users size={160} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-indigo-600 rounded-2xl"><Search size={32} /></div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Clipper Hiring Manual</h3>
                            <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Where to find world-class editors for $5-$15</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                            <h5 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Option A: Marketplace</h5>
                            <p className="text-xs text-slate-300 leading-relaxed">Search for <strong>"Short Form Video Editor"</strong> on Fiverr or Upwork. Look for people in Pakistan, India, or Philippines for the best ROI.</p>
                            <button onClick={() => window.open('https://www.fiverr.com/search/gigs?query=short%20form%20video%20editor', '_blank')} className="px-4 py-2 bg-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest">Open Fiverr Search</button>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                            <h5 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Option B: Community</h5>
                            <p className="text-xs text-slate-300 leading-relaxed">Go to the <strong>"Affiliates"</strong> or <strong>"Clip Farm"</strong> discord. There is usually a #hiring channel where hungry clippers post their portfolios.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* V2 CONTENT REWARDS CHEAT SHEET */}
            <div className="p-10 bg-emerald-600 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border-4 border-emerald-400">
                <div className="absolute top-0 right-0 p-10 opacity-10"><Trophy size={140} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-white/20 rounded-2xl"><Flame size={32} /></div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">V2 Discovery Guide</h3>
                            <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Master the Whop Discover Campaigns</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black uppercase text-emerald-200 tracking-widest">Current Strategy: Discovery</h5>
                            <p className="text-sm font-medium leading-relaxed">
                                You are looking at the <strong>Discover Campaigns</strong> dashboard. While waiting for your submission, look for campaigns tagged with <span className="px-2 py-0.5 bg-black/30 rounded text-emerald-300">UGC</span> or <span className="px-2 py-0.5 bg-black/30 rounded text-indigo-300">PRODUCT</span>.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/20">
                                <CheckCircle2 size={20} className="text-emerald-300" />
                                <p className="text-xs font-bold">Check "Verified" Toggle on Whop</p>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/20">
                                <CheckCircle2 size={20} className="text-emerald-300" />
                                <p className="text-xs font-bold">Look for 'Scene Society' Badges</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-10 bg-slate-950 text-white rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><Scissors size={120} /></div>
                <div className="relative z-10">
                    <h4 className="text-2xl font-black uppercase tracking-tight mb-2">Clipping Team Command</h4>
                    <p className="text-slate-400 text-sm font-medium mb-8">Generate the brief below and send it to your hire.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Video Topic</label>
                            <input 
                                value={briefTopic}
                                onChange={(e) => setBriefTopic(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Hook Style</label>
                            <select 
                                value={hookStyle}
                                onChange={(e) => setHookStyle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 outline-none"
                            >
                                <option>Aggressive / Call-out</option>
                                <option>Curiosity Gap</option>
                                <option>Educational / Tutorial</option>
                                <option>Result-First / Flex</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerateBrief}
                        disabled={isGenerating}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                        {isGenerating ? 'Architecting Brief...' : 'Generate Editor Brief'}
                    </button>
                </div>
            </div>

            {brief && (
                <div className="p-8 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h5 className="font-black uppercase text-xs tracking-widest text-slate-400">Final Clipper Instructions</h5>
                        <button 
                            onClick={() => { navigator.clipboard.writeText(brief); }}
                            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-indigo-600 hover:bg-slate-100"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap font-medium leading-relaxed text-slate-700 dark:text-slate-300 italic p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-dashed border-slate-200">
                            {brief}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const HighTicketPitch: React.FC = () => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Text Copied!");
    };

    const applicationText = `I am a South Africa-based founder currently scaling a B2B AI SaaS platform. I own the entire content engine, from video tutorial production to technical SEO. My strength lies in taking complex AI workflows and turning them into simple, educational content that drives user adoption. I'm ready to bring this founder-level ownership to your product's education strategy.`;

    const q1 = "3+ years of technical operations and founder-led content generation.";
    const q2 = "Yes. As founder of CaterPro AI, I own the entire education engine. I architected the UI/UX tooltips and produced the full video tutorial series for our menu dashboard, ensuring complex culinary logistics are simple for users.";
    const q3 = "I defined the 'Lifecycle Marketing' roadmap for my own SaaS, then personally wrote the technical logic for the AI-generated proposals and the marketing status scripts used by our community to drive engagement.";

    return (
        <div className="space-y-10 animate-slide-in">
            {/* FINDING CUSTOMERS HUB */}
            <div className="p-10 bg-slate-950 text-white rounded-[3.5rem] border-4 border-primary-500/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Target size={160} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-primary-600 rounded-2xl"><Users size={32} /></div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Customer Sourcing Hub</h3>
                            <p className="text-xs font-bold text-primary-300 uppercase tracking-widest">Where to find catering clients today</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-center">
                            <Building2 className="text-primary-500 mx-auto mb-2" size={24} />
                            <h5 className="text-[10px] font-black uppercase mb-1">Corporate Parks</h5>
                            <p className="text-[9px] text-slate-400">Offer 'Monday Menu Prep' automation for office managers.</p>
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-center">
                            <Heart className="text-pink-500 mx-auto mb-2" size={24} />
                            <h5 className="text-[10px] font-black uppercase mb-1">Wedding Venues</h5>
                            <p className="text-[9px] text-slate-400">Partner with venues to generate instant menus for couples.</p>
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-center">
                            <ShoppingBag className="text-amber-500 mx-auto mb-2" size={24} />
                            <h5 className="text-[10px] font-black uppercase mb-1">Local Delis</h5>
                            <p className="text-[9px] text-slate-400">Help them automate their 'Daily Specials' costing.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-10 bg-blue-600 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border-4 border-blue-400">
                <div className="absolute top-0 right-0 p-10 opacity-10"><LucideFileSignature size={140} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-white/20 rounded-2xl"><Users size={32} /></div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">LinkedIn Application Kit</h3>
                            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">For Marketing Manager (Remote)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-blue-200 tracking-widest">About Me Section</label>
                            <div className="p-6 bg-black/20 rounded-3xl border border-white/10 text-sm font-medium leading-relaxed italic">
                                "{applicationText}"
                            </div>
                            <button onClick={() => handleCopy(applicationText)} className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                                Copy Main Intro
                            </button>
                        </div>

                        <div className="space-y-6">
                            {[
                                { l: "Years of SaaS Content", v: q1 },
                                { l: "Concrete Example", v: q2 },
                                { l: "Strategic & Hands-on", v: q3 }
                            ].map((item, idx) => (
                                <div key={idx} className="p-5 bg-white rounded-3xl border-4 border-blue-300 relative group">
                                    <p className="text-[9px] font-black uppercase text-blue-600 mb-2">{item.l}</p>
                                    <p className="text-xs font-bold text-slate-800 leading-relaxed pr-8">{item.v}</p>
                                    <button onClick={() => handleCopy(item.v)} className="absolute top-4 right-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SelfieBubble: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        if (isOpen) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
                .then(s => {
                    setStream(s);
                    if (videoRef.current) videoRef.current.srcObject = s;
                })
                .catch(err => console.error("Camera access denied", err));
        } else {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        }
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-10 right-10 z-[100] group">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl bg-slate-900 ring-4 ring-indigo-500/20">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover scale-x-[-1]"
                />
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

const FiverrCheatSheet: React.FC = () => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 border-4 border-indigo-200 dark:border-indigo-800 rounded-[3rem] space-y-6 animate-slide-in">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><Terminal size={24} /></div>
                <div>
                    <h4 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Fiverr Meta Settings</h4>
                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mt-1">Select these in your Gig editor</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { label: "Category", value: "Programming & Tech > AI Development" },
                    { label: "Service Type", value: "AI Agents & Automation" },
                    { label: "Expertise", value: "Gemini, React, TypeScript" },
                    { label: "Industry", value: "Hospitality, Food & Beverage" }
                ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center group">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{item.label}</p>
                            <p className="text-sm font-black">{item.value}</p>
                        </div>
                        <button onClick={() => handleCopy(item.value)} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            <Copy size={14} className="text-indigo-500" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Teleprompter: React.FC<{ script: string; isOpen: boolean; onClose: () => void }> = ({ script, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div onClick={onClose} className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl animate-fade-in"></div>
            <div className="relative w-full max-w-5xl bg-black rounded-[4rem] border-4 border-indigo-500/20 shadow-2xl overflow-hidden h-[85vh] flex flex-col animate-scale-up">
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-slate-900">
                    <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                        <h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">Recording Mode</h3>
                    </div>
                    <button onClick={onClose} className="p-4 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-all">
                        <X size={28} />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-12 sm:p-24 custom-scrollbar text-center">
                    <p className="text-4xl sm:text-6xl font-black text-white leading-[1.3] whitespace-pre-wrap italic tracking-tight opacity-90">
                        {script}
                    </p>
                    <div className="h-64"></div>
                </div>
                <div className="p-10 bg-slate-900 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-indigo-400">
                        <Mic2 size={32} />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Audio Focus</p>
                            <p className="text-sm font-bold text-white">Eye level with iPad camera.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl">
                        Done Recording
                    </button>
                </div>
            </div>
        </div>
    );
};

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl, onOpenSocial }) => {
  const [activeTab, setActiveTab] = useState<'security' | 'assets' | 'whop_war_room' | 'morning' | 'profile' | 'clipping' | 'pitch' | 'campaigns' | 'automation' | 'gig_architect'>('whop_war_room');
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [isSelfieBubbleOpen, setIsSelfieBubbleOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState('');

  const morningScript = `[SCENE: iPad Hand-held Shot - pointing at the screen]

[INTRO - 0:00]
"Hi there, my name is Melo. I'm a founder building automation systems for chefs."

[STAGE DIRECTION: Scroll through a generated menu]
"Look at this. This is real 'Proof of Work'. I'm using AI to architect full catering proposals in under 30 seconds."

[THE WHY - 0:15]
"I know how stressful the admin grind is. That's why I'm applying to these campaigns. I want to show you how to scale using these exact tools."

[STAGE DIRECTION: Point at the Shopping List/Costing section]
"Instant ZAR costing. HACCP protocols. It's all built-in. I'm ready to bring this level of authority to your product."

[CLOSE - 0:45]
"I'm currently remote-ready and looking to partner with high-level B2B brands. Click below and let's build something."`;

  const handleOpenTeleprompter = (script: string) => {
    setCurrentScript(script);
    setIsTeleprompterOpen(true);
  };

  return (
    <section id="founder-roadmap" className="mt-20 space-y-12 animate-slide-in scroll-mt-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
            <ShieldCheck className="text-primary-500 w-10 h-10" />
            War Room Console
          </h2>
          <p className="text-lg text-slate-500 font-medium mt-2">Aggressive setup for Whop and Social Media.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar max-w-full">
            {[
                { id: 'whop_war_room', label: 'War Room', icon: Swords },
                { id: 'security', label: 'Security Hub', icon: ShieldAlert },
                { id: 'automation', label: 'Systems Lab', icon: Cpu },
                { id: 'gig_architect', label: 'Gig Architect', icon: Award },
                { id: 'assets', label: 'Asset Studio', icon: Layout },
                { id: 'campaigns', label: 'Whop Hunter', icon: Target },
                { id: 'clipping', label: 'Clipping Hub', icon: Scissors },
                { id: 'pitch', label: 'High-Ticket', icon: UserPlus2 },
                { id: 'morning', label: 'Video Script', icon: Video },
                { id: 'profile', label: 'Meta Tags', icon: Briefcase }
            ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {activeTab === 'whop_war_room' && <WhopWarRoom />}

        {activeTab === 'security' && <SecurityHub />}
        
        {activeTab === 'automation' && <AutomationLab />}

        {activeTab === 'gig_architect' && <GigArchitect />}

        {activeTab === 'assets' && <ThumbnailStudio />}
        
        {activeTab === 'campaigns' && <CampaignHunter />}
        
        {activeTab === 'clipping' && <ClippingHub />}

        {activeTab === 'pitch' && <HighTicketPitch />}

        {activeTab === 'morning' && (
            <div className="space-y-12 animate-fade-in">
                <div className="p-12 bg-indigo-600 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border-4 border-indigo-400/30">
                    <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Video size={200} /></div>
                    <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto py-10">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                            <Mic2 size={40} className="text-white" />
                        </div>
                        <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none">Proof of Work Script</h3>
                        <p className="text-lg text-indigo-100 font-medium mb-12">Hand-held recording for Whop applications.</p>
                        
                        <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] shadow-inner border border-white/20 mb-12 text-left">
                            <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed italic whitespace-pre-wrap">
                                {morningScript}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <button 
                                onClick={() => setIsSelfieBubbleOpen(!isSelfieBubbleOpen)} 
                                className={`py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 ${isSelfieBubbleOpen ? 'bg-red-500 text-white' : 'bg-white text-indigo-600 hover:scale-105'}`}
                            >
                                {isSelfieBubbleOpen ? <VideoOff size={20} /> : <Camera size={20} />} 
                                {isSelfieBubbleOpen ? 'Turn Off Face Bubble' : 'Turn On Face Bubble'}
                            </button>
                            <button 
                                onClick={() => handleOpenTeleprompter(morningScript)} 
                                className="py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Maximize size={20} /> Open Teleprompter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'profile' && (
            <div className="space-y-12 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FiverrCheatSheet />
                    <div className="p-10 bg-slate-900 text-white rounded-[3.5rem] relative overflow-hidden shadow-2xl border-4 border-indigo-500/20">
                        <div className="absolute top-0 right-0 p-12 opacity-5"><UserCog size={160} /></div>
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black uppercase tracking-tight mb-4">Gallery Final List</h4>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium mb-8">
                                Upload these 3 items to the Fiverr screen now:
                            </p>
                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-black text-xs">1</div>
                                    <p className="text-xs font-bold">Image 1: Yellow "High-Click" Thumbnail</p>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-black text-xs">2</div>
                                    <p className="text-xs font-bold">Image 2: Screenshot of Shopping List</p>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-black text-xs">3</div>
                                    <p className="text-xs font-bold">Document: PDF Portfolio of Sample Menus</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
      
      <Teleprompter 
        script={currentScript} 
        isOpen={isTeleprompterOpen} 
        onClose={() => setIsTeleprompterOpen(false)} 
      />
      <SelfieBubble 
        isOpen={isSelfieBubbleOpen} 
        onClose={() => setIsSelfieBubbleOpen(false)} 
      />
    </section>
  );
};

const Maximize: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
);

const LucideFileSignature: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><path d="M17 17h5"/><path d="M3 7h2"/><path d="M9 17h2"/><path d="M15 7h2"/><path d="M21 7v10"/><path d="M3 7v10"/></svg>
);

export default FounderRoadmap;
