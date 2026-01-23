
import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, Camera, ClipboardCheck, BookOpen, Building2, Presentation, Layout, Eye, MessageSquare, Sparkles, Loader2, AlertCircle, AlertTriangle, ListChecks, Star, Settings2, HelpCircle, ShoppingBag, UserPlus, MessageCircle, DollarSign, PieChart, Info, Smartphone, Check, MousePointer2, Activity, ShieldAlert, Instagram, Facebook, Link2, MessageSquareQuote, Flame, Moon, Sun, Clock, ListChecks as ChecklistIcon, FileSearch, X, Pause, Play, Smartphone as IpadIcon, RefreshCw, Coffee, Calculator, Rocket as FreelanceIcon, Briefcase as UpworkIcon, ListOrdered, Lightbulb, ShoppingCart, Tag, FolderHeart, UserCog } from 'lucide-react';
import { generateWhopSEO, generateSocialCaption } from '../services/geminiService';
import ThumbnailStudio from './ThumbnailStudio';

interface FounderRoadmapProps {
  whopUrl: string;
  onOpenSocial?: (mode: 'create' | 'reel' | 'status') => void;
}

const FiverrProfileArchitect: React.FC = () => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const profileBio = "I bridge the gap between high-stakes asset management and 2026 AI efficiency. \n\nWith over 15 years of experience in high-performance sales, real estate portfolio management, and commercial operations (including Disney Cruise Line), I architect digital systems that solve the 'boring' admin grind for the hospitality sector. \n\nI am the founder of CaterPro AI, a specialized tool that automates menu engineering, food costing (ZAR/USD), and HACCP compliance. Whether you are a catering group looking to slash proposal time by 80% or a business owner needing sales lifecycle automation, I build the systems that drive your ROI.";

    return (
        <div className="animate-fade-in space-y-8 p-8 bg-slate-900 text-white rounded-[3rem] border-4 border-emerald-500/20 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5"><UserCog size={160} /></div>
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg"><UserCog size={24} /></div>
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-tight">Fiverr Profile Pivot</h4>
                        <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mt-1">Bridging Sales & AI</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Profile Tagline (1 sentence)</p>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                            <span className="text-sm font-bold">Hospitality Systems Architect | AI Automation Specialist</span>
                            <button onClick={() => handleCopy("Hospitality Systems Architect | AI Automation Specialist")} className="p-2 hover:bg-white/10 rounded-lg"><Copy size={14} /></button>
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Professional Bio (The "Pivot")</p>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 italic text-sm leading-relaxed text-slate-300">
                            {profileBio}
                        </div>
                        <button 
                            onClick={() => handleCopy(profileBio)}
                            className="mt-4 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all"
                        >
                            <Copy size={16} /> Copy Pivot Bio
                        </button>
                    </div>

                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl">
                        <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Skills to Add:</p>
                        <div className="flex flex-wrap gap-2">
                            {['AI Automation', 'Gemini API', 'Prompt Engineering', 'SaaS Development', 'Hospitality Management', 'Sales Lifecycle Strategy'].map(s => (
                                <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold text-slate-300 uppercase">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FiverrGigArchitect: React.FC = () => {
    const gigData = {
        title: "I will build a custom AI Menu Engineering system for your catering business",
        description: "Stop wasting hours on manual proposals. I will architect a custom AI system powered by Gemini that generates:\n\n- Professional Menu Proposals\n- Automated Costing & Shopping Lists\n- HACCP Safety Protocols\n- Multi-Currency (ZAR/USD) Procurement Logic\n\nAs a 15-year hospitality veteran and Systems Architect, I don't just build code; I build ROI. Let's automate your kitchen admin for 2026.",
        packages: [
            { name: "The Starter System", price: "$150", delivery: "3 Days", feat: "Basic AI Menu Generator + PDF Export" },
            { name: "Pro Architect", price: "$450", delivery: "7 Days", feat: "Full Procurement Logic + ZAR/USD Costing" },
            { name: "Enterprise Hub", price: "$1,200", delivery: "14 Days", feat: "Full Lifecycle Automation + CRM Sync" }
        ]
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-lg text-white"><ShoppingCart size={20} /></div>
                    <h4 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Fiverr Gig Architect</h4>
                </div>
                <div className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Step 2: Create Gigs</div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Gig Title</p>
                        <h5 className="font-bold text-slate-900 dark:text-white mb-4">{gigData.title}</h5>
                        <button onClick={() => handleCopy(gigData.title)} className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1.5 hover:underline">
                            <Copy size={12} /> Copy Title
                        </button>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Gig Description</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed mb-4">{gigData.description}</p>
                        <button onClick={() => handleCopy(gigData.description)} className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1.5 hover:underline">
                            <Copy size={12} /> Copy Description
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pricing Strategy (ZAR/USD ROI)</p>
                    {gigData.packages.map((pkg, i) => (
                        <div key={i} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center">
                            <div>
                                <h6 className="font-black text-slate-900 dark:text-white text-sm">{pkg.name}</h6>
                                <p className="text-[10px] text-slate-500 font-bold">{pkg.feat}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-emerald-600">{pkg.price}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase">{pkg.delivery}</p>
                            </div>
                        </div>
                    ))}
                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
                        <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed italic">
                            "Melo, on Fiverr, use the **Asset Studio** (Assets tab) to create a thumbnail with the 'Midnight ROI' template. It makes your gig look like a premium software product."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RegistrationWalkthrough: React.FC = () => {
    const steps = [
        { 
            num: "8-9", 
            title: "Upwork Done", 
            action: "Submitted.", 
            why: "Your hourly consulting branch is live." 
        },
        { 
            num: "Fiverr", 
            title: "Profile Polish", 
            action: "Add the 'Pivot' Bio.", 
            why: "Leveraging your Real Estate background builds instant trust for high-ticket contracts." 
        }
    ];

    return (
        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-500 rounded-lg text-white"><ListOrdered size={20} /></div>
                <h4 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Profile Roadmap</h4>
            </div>
            <div className="space-y-4">
                {steps.map((s, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border-2 transition-all ${idx === 1 ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black uppercase text-indigo-500 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm">Step {s.num}</span>
                            {idx === 1 && <div className="flex items-center gap-1.5 text-indigo-600"><Sparkles size={14} /> <span className="text-[10px] font-black uppercase">Active</span></div>}
                        </div>
                        <h5 className="font-black text-slate-900 dark:text-white mb-2">{s.title}</h5>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mb-4">{s.action}</p>
                        <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                            <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-500 italic font-medium leading-relaxed">{s.why}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FreelanceLab: React.FC = () => {
    const [activeFreelanceTab, setActiveFreelanceTab] = useState<'upwork' | 'fiverr'>('fiverr');
    const [hourlyRate, setHourlyRate] = useState(55); 

    return (
        <div className="animate-fade-in space-y-12">
            <div className="max-w-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                        <FreelanceIcon className="text-indigo-600" /> Freelance Command
                    </h3>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        Melo, use these tools to bridge your 15 years of sales experience into the AI world.
                    </p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <button onClick={() => setActiveFreelanceTab('upwork')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFreelanceTab === 'upwork' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Upwork</button>
                    <button onClick={() => setActiveFreelanceTab('fiverr')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFreelanceTab === 'fiverr' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Fiverr</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {activeFreelanceTab === 'upwork' ? (
                        <>
                            <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-10"><ShieldCheck size={140} /></div>
                                <div className="relative z-10 text-center py-10">
                                    <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-6" />
                                    <h4 className="text-2xl font-black uppercase tracking-tight mb-2">Upwork Profile Sent!</h4>
                                    <p className="text-sm text-indigo-100 font-medium">Keep your email open for the approval notification.</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <FiverrProfileArchitect />
                            <FiverrGigArchitect />
                        </>
                    )}
                </div>

                <div className="space-y-8">
                    <RegistrationWalkthrough />
                    <div className="p-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-inner space-y-8">
                        <div className="flex items-center gap-3">
                            <Calculator className="text-indigo-500" />
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Profit Focus</h4>
                        </div>
                        <div className="space-y-6">
                            <div className="pt-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Standard Gig Delivery</p>
                                <h5 className="text-4xl font-black text-emerald-600 tracking-tighter">$450</h5>
                                <p className="text-[10px] text-slate-500 font-medium mt-2">"This is why we architect, we don't just work."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MorningMission: React.FC = () => {
    const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
    const [isChatLabOpen, setIsChatLabOpen] = useState(false);
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

            {/* iPad Teleprompter Modal */}
            {isPitchModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
                    <div onClick={() => setIsPitchModalOpen(false)} className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl animate-fade-in"></div>
                    <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 h-full sm:h-[90vh] sm:rounded-[4rem] shadow-2xl border-x sm:border-4 border-indigo-600/30 flex flex-col overflow-hidden animate-scale-up">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg animate-pulse"><Video size={24} /></div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Teleprompter Mode</h3>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setFontSize(f => Math.min(f + 10, 80))} className="p-3 bg-white dark:bg-slate-800 border rounded-xl font-bold">A+</button>
                                <button onClick={() => setFontSize(f => Math.max(f - 10, 20))} className="p-3 bg-white dark:bg-slate-800 border rounded-xl font-bold">A-</button>
                                <button onClick={() => setIsPitchModalOpen(false)} className="p-3 bg-red-50 text-red-500 rounded-xl"><X size={24} /></button>
                            </div>
                        </div>
                        <div ref={scrollContainerRef} className="flex-grow p-10 sm:p-20 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 text-center">
                            <p style={{ fontSize: `${fontSize}px` }} className="font-black leading-[1.3] text-slate-800 dark:text-slate-100 italic whitespace-pre-wrap max-w-4xl mx-auto pb-40">
                                {salesPitchScript}
                            </p>
                        </div>
                        <div className="p-8 bg-slate-950 flex justify-center">
                            <button onClick={() => handleCopy(salesPitchScript)} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Copy Script & Close</button>
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

    return (
        <div className="animate-fade-in space-y-10">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <ChecklistIcon className="text-indigo-600" /> Whop SEO Architect
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">Melo, use this to optimize your store description before the official launch.</p>
            </div>
            <div className="flex gap-3 mb-10">
                <input value={niche} onChange={(e) => setNiche(e.target.value)} className="flex-grow p-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold outline-none" />
                <button onClick={handleGenerate} disabled={isLoading} className="px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">{isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}</button>
            </div>
            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 rounded-[2.5rem] relative group">
                        <h4 className="text-[10px] font-black uppercase text-emerald-600 mb-2">Optimized Title</h4>
                        <p className="text-xl font-black text-slate-900 dark:text-white">{result.title}</p>
                    </div>
                    <div className="p-8 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-4 tracking-widest">Store Description</h4>
                        <div className="text-xs text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">{result.description}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl, onOpenSocial }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'seo' | 'whop' | 'design' | 'bounty' | 'freelance'>('mission');

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden scroll-mt-24" id="founder-control">
      <div className="p-10 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><TrendingUp size={200} /></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-500/20"><Rocket size={32} className="text-white" /></div>
            <div>
                <h2 className="text-4xl font-black uppercase tracking-tight leading-none">Ranking Command</h2>
                <p className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Discovery Accelerator</p>
            </div>
          </div>
          <div className="flex bg-slate-900/50 p-2 rounded-[1.5rem] border border-white/10 overflow-x-auto no-scrollbar backdrop-blur-md">
            <button onClick={() => setActiveTab('mission')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'mission' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}>Morning Mission</button>
            <button onClick={() => setActiveTab('freelance')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'freelance' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Freelance Lab</button>
            <button onClick={() => setActiveTab('seo')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'seo' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>SEO Architect</button>
            <button onClick={() => setActiveTab('whop')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'whop' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Store Audit</button>
            <button onClick={() => setActiveTab('design')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'design' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Assets</button>
          </div>
        </div>
      </div>
      <div className="p-10 sm:p-16">
        {activeTab === 'mission' && <MorningMission />}
        {activeTab === 'freelance' && <FreelanceLab />}
        {activeTab === 'seo' && <WhopSEOArchitect />}
        {activeTab === 'whop' && <div className="text-center py-20"><p className="text-slate-500 italic">Discovery Audit logic pending final Whop dashboard connection.</p></div>}
        {activeTab === 'design' && <ThumbnailStudio />}
      </div>
    </section>
  );
};

export default FounderRoadmap;
