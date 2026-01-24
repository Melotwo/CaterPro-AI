
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
  UserCheck, Swords, CalendarDays
} from 'lucide-react';
import ThumbnailStudio from './ThumbnailStudio';
import { generateClipperBriefFromApi } from '../services/geminiService';

interface FounderRoadmapProps {
  whopUrl: string;
  onOpenSocial?: (mode: 'create' | 'reel' | 'status') => void;
}

const WhopWarRoom: React.FC = () => {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} Copied to iPad Clipboard!`);
    };

    return (
        <div className="space-y-10 animate-slide-in">
            {/* ALERT: HOW TO BEAT COMPETITORS */}
            <div className="p-8 bg-amber-500 rounded-[3rem] text-white shadow-2xl border-4 border-white dark:border-slate-800 flex flex-col md:flex-row items-center gap-8">
                <div className="p-5 bg-white/20 rounded-[2rem]"><Swords size={48} /></div>
                <div>
                    <h4 className="text-2xl font-black uppercase tracking-tight leading-none mb-2">The "Get Bigger" Edge</h4>
                    <p className="text-sm font-bold opacity-90 leading-relaxed">
                        Competitors sell "Calculators." You sell **"Freedom."** Focus your marketing on the AI thinking FOR the chef, not just doing math.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Reddit Lead Gen Card - REDESIGNED FOR MAX VISIBILITY */}
                <div className="p-10 bg-white dark:bg-slate-900 border-4 border-orange-500 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 text-orange-500"><Ghost size={120} /></div>
                    <div className="flex items-center gap-5 mb-10">
                        <div className="p-4 bg-orange-500 rounded-[1.5rem] text-white shadow-xl"><Search size={32} /></div>
                        <div>
                            <h4 className="text-2xl font-black uppercase text-slate-900 dark:text-white">Reddit Lead Gen</h4>
                            <p className="text-xs font-black uppercase text-orange-500 tracking-[0.2em]">OfficeX Form Fill</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">1. Search Query</label>
                                <button onClick={() => handleCopy('catering menu help OR menu costing software OR "chef" admin stress OR culinary student help', 'Reddit Query')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase hover:bg-orange-500 hover:text-white transition-all">
                                    <Copy size={12} /> Copy Answer
                                </button>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-slate-100 dark:border-slate-800 font-bold text-sm">
                                catering menu help OR menu costing software OR "chef" admin stress OR culinary student help
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">2. AI Filter Prompt</label>
                                <button onClick={() => handleCopy('Identify professional chefs, caterers, or culinary students expressing frustration with manual paperwork, food costing errors, or slow menu creation. Approve only if they are asking for tools, advice, or a better system to handle admin.', 'Reddit Filter')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase hover:bg-orange-500 hover:text-white transition-all">
                                    <Copy size={12} /> Copy Answer
                                </button>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-slate-100 dark:border-slate-800 italic text-xs leading-relaxed text-slate-500">
                                "Identify professional chefs, caterers, or culinary students expressing frustration with manual paperwork..."
                            </div>
                        </div>
                    </div>
                </div>

                {/* Affiliate Recruitment Card */}
                <div className="p-10 bg-white dark:bg-slate-900 border-4 border-emerald-500 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 text-emerald-500"><TrendingUp size={120} /></div>
                    <div className="flex items-center gap-5 mb-10">
                        <div className="p-4 bg-emerald-500 rounded-[1.5rem] text-white shadow-xl"><Users size={32} /></div>
                        <div>
                            <h4 className="text-2xl font-black uppercase text-slate-900 dark:text-white">Affiliate Hub</h4>
                            <p className="text-xs font-black uppercase text-emerald-500 tracking-[0.2em]">Clipper Recruitment</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border-2 border-emerald-100 dark:border-emerald-800 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Commission Rate</p>
                                <p className="text-4xl font-black text-slate-900 dark:text-white">30% <span className="text-sm text-slate-400">Lifetime</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Target Payout</p>
                                <p className="text-xl font-black text-emerald-600">30 Days</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recruitment Pitch</label>
                                <button onClick={() => handleCopy('Earn 30% passive income for life. We built the #1 AI system for chefs to delete their admin stress. Massive market in SA, US, and UK. We provide the viral scripts and professional thumbnails for you.', 'Affiliate Pitch')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all">
                                    <Copy size={12} /> Copy Answer
                                </button>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-slate-100 dark:border-slate-800 font-bold text-sm leading-tight">
                                Earn 30% passive income for life. We built the #1 AI system for chefs to delete their admin stress...
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SOCIAL CONTENT PLANNER - NEW FRESH CONTENT */}
            <div className="p-12 bg-slate-950 text-white rounded-[4rem] border-4 border-indigo-500/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><CalendarDays size={160} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-2xl shadow-indigo-500/20"><Activity size={32} /></div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">Social Content Roadmap</h3>
                            <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Fresh LinkedIn & Facebook Posts</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6">
                            <div className="flex items-center gap-3 text-blue-400">
                                <Linkedin size={20} />
                                <h5 className="font-black uppercase text-xs tracking-widest">LinkedIn (Professional Edge)</h5>
                            </div>
                            <p className="text-sm font-medium leading-relaxed text-slate-300">
                                **Post Idea:** "Chef burnout isn't just about the heat in the kitchen; it's the cold paperwork in the office. I built CaterPro AI to give chefs their Sundays back. 100% Google Grade AI logic. #CulinaryTech #2026"
                            </p>
                            <button onClick={() => handleCopy('Chef burnout isn\'t just about the heat in the kitchen; it\'s the cold paperwork in the office. I built CaterPro AI to give chefs their Sundays back. 100% Google Grade AI logic. #CulinaryTech #2026', 'LinkedIn Post')} className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Copy Text</button>
                        </div>

                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6">
                            <div className="flex items-center gap-3 text-indigo-400">
                                <Facebook size={20} />
                                <h5 className="font-black uppercase text-xs tracking-widest">Facebook (The Screen Recording)</h5>
                            </div>
                            <p className="text-sm font-medium leading-relaxed text-slate-300">
                                **Post Idea:** Use your screen recording! **Overlay Text:** "Watch my AI build a 100-guest menu in 30 seconds while I drink my coffee. ☕️🇿🇦 Stop typing, start cooking."
                            </p>
                            <button onClick={() => handleCopy('Watch my AI build a 100-guest menu in 30 seconds while I drink my coffee. ☕️🇿🇦 Stop typing, start cooking. Try it free here: [Link]', 'Facebook Post')} className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Copy Text</button>
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
            <div className="p-10 bg-slate-950 text-white rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><Scissors size={120} /></div>
                <div className="relative z-10">
                    <h4 className="text-2xl font-black uppercase tracking-tight mb-2">Clipping Team Command</h4>
                    <p className="text-slate-400 text-sm font-medium mb-8">Manage UGC creators and automate their editing briefs.</p>
                    
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
                    <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border-2 border-amber-100 dark:border-amber-800 flex items-start gap-4">
                        <Info className="text-amber-600 shrink-0 mt-1" />
                        <div>
                            <p className="text-xs font-black uppercase text-amber-700 dark:text-amber-400 mb-1">Founder Tip</p>
                            <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">Send this brief via Discord or WhatsApp to your clippers. It guarantees the video stays focused on ROI, not just pretty colors.</p>
                        </div>
                    </div>
                </div>
            )}
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
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                Live Preview
            </div>
        </div>
    );
};

const FiverrCheatSheet: React.FC = () => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const selections = [
        { label: "Category", value: "Programming & Tech > AI Development" },
        { label: "Service Type", value: "AI Agents & Automation" },
        { label: "Model Expertise", value: "Gemini, OpenAI, Claude" },
        { label: "Programming", value: "TypeScript, React, Python" },
        { label: "Industry", value: "Hospitality, Food & Beverage" }
    ];

    return (
        <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 border-4 border-indigo-200 dark:border-indigo-800 rounded-[3rem] space-y-6 animate-slide-in">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><Terminal size={24} /></div>
                <div>
                    <h4 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Fiverr Gig Metadata</h4>
                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mt-1">Copy-Paste these settings</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selections.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center group">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-sm font-black text-slate-800 dark:text-slate-200">{item.value}</p>
                        </div>
                        <button onClick={() => handleCopy(item.value)} className="p-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            <Copy size={14} className="text-indigo-500" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-amber-400">
                    <Tag size={18} />
                    <h5 className="text-xs font-black uppercase tracking-widest">Targeted Search Tags</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                    {["CATERPROAI", "MENU COSTING", "AI AGENT", "HOSPITALITY", "GEMINI"].map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">{tag}</span>
                    ))}
                </div>
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
  const [activeTab, setActiveTab] = useState<'assets' | 'whop_war_room' | 'morning' | 'profile' | 'clipping'>('whop_war_room');
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [isSelfieBubbleOpen, setIsSelfieBubbleOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState('');

  const morningScript = `[INTRO - 0:00]
"Hi there, my name is Melo and I’m based in Limpopo."

[THE WHY - 0:15]
"I know how stressful catering admin is. That's why I built CaterPro AI."

[THE PROOF - 0:30]
"Look at this: a full Wedding menu generated in 30 seconds, costed in Rands, with safety protocols ready to print."

[CLOSE - 0:45]
"I'm here to save your time. Click below and let's start your first proposal. Thank you!"`;

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
                { id: 'whop_war_room', label: 'Whop War Room', icon: Swords },
                { id: 'assets', label: 'Asset Studio', icon: Layout },
                { id: 'clipping', label: 'Clipping Hub', icon: Scissors },
                { id: 'morning', label: 'Video Script', icon: Video },
                { id: 'profile', label: 'Fiverr Meta', icon: Briefcase }
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

        {activeTab === 'assets' && <ThumbnailStudio />}
        
        {activeTab === 'clipping' && <ClippingHub />}

        {activeTab === 'morning' && (
            <div className="space-y-12 animate-fade-in">
                <div className="p-12 bg-indigo-600 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border-4 border-indigo-400/30">
                    <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Video size={200} /></div>
                    <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto py-10">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                            <Mic2 size={40} className="text-white" />
                        </div>
                        <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none">Fiverr Intro Script</h3>
                        <p className="text-lg text-indigo-100 font-medium mb-12">Turn on the Face Bubble and record on your iPad.</p>
                        
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

export default FounderRoadmap;
