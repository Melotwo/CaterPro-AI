
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
  UserCog, Keyboard, Terminal, Sparkle, FileDown
} from 'lucide-react';
import ThumbnailStudio from './ThumbnailStudio';

interface FounderRoadmapProps {
  whopUrl: string;
  onOpenSocial?: (mode: 'create' | 'reel' | 'status') => void;
}

const FiverrCheatSheet: React.FC = () => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const selections = [
        { label: "Category", value: "Programming & Tech > AI Development" },
        { label: "Service Type", value: "AI Agents & Automation" },
        { label: "Model Expertise", value: "Gemini, OpenAI, Claude" },
        { label: "Programming", value: "TypeScript, Python, React" },
        { label: "Industry", value: "Hospitality, Food & Beverage, Events" }
    ];

    return (
        <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 border-4 border-indigo-200 dark:border-indigo-800 rounded-[3rem] space-y-6 animate-slide-in">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><Terminal size={24} /></div>
                <div>
                    <h4 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Fiverr Metadata Blueprint</h4>
                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mt-1">Exact Settings for Maximum ROI</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selections.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center group">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-sm font-black text-slate-800 dark:text-slate-200">{item.value}</p>
                        </div>
                        <button onClick={() => handleCopy(item.value)} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
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
                    {["CATERPROAI", "MENU ENGINEERING", "AI AUTOMATION", "HOSPITALITY", "GEMINI AI"].map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">{tag}</span>
                    ))}
                </div>
                <p className="text-[10px] text-slate-400 italic">Upload your Thumbnail Studio image to the Fiverr Gallery now.</p>
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
                        <h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">Teleprompter Mode</h3>
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
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Audio Focus Active</p>
                            <p className="text-sm font-bold text-white">Look at the camera lens, not the text.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl">
                        End Session
                    </button>
                </div>
            </div>
        </div>
    );
};

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl, onOpenSocial }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'morning' | 'assets'>('profile');
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState('');

  const morningScript = `[HOOK - 0:00]
"Hi there, my name is Tumelo (Melo) and I’m based in Mokopane in Limpopo."

[THE WHY - 0:15]
"After 15 years in high-performance sales, I realized the biggest bottleneck in hospitality isn't the talent—it's the boring admin paperwork."

[THE PROOF - 0:30]
"That's why I built CaterPro AI. I’ve architected a system that takes a 100-guest menu from 'chaos' to a professional, costed proposal in exactly 30 seconds."

[THE VISION - 0:45]
"I bridge the gap between human connection and AI efficiency. I'm not just selling software; I'm selling your time back."

[CLOSE - 1:00]
"Let's automate your office so you can get back to your kitchen. Thank you!"`;

  const handleOpenTeleprompter = (script: string) => {
    setCurrentScript(script);
    setIsTeleprompterOpen(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <section id="founder-roadmap" className="mt-20 space-y-12 animate-slide-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
            <ShieldCheck className="text-primary-500 w-10 h-10" />
            Founder Command Center
          </h2>
          <p className="text-lg text-slate-500 font-medium mt-2">Strategic blueprints for Melo's 2026 expansion.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-700">
            {[
                { id: 'profile', label: 'Gig Architect', icon: Briefcase },
                { id: 'morning', label: 'Morning Mission', icon: Video },
                { id: 'assets', label: 'Asset Studio', icon: Layout }
            ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {activeTab === 'profile' && (
            <div className="space-y-12 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FiverrCheatSheet />
                    <div className="p-10 bg-slate-900 text-white rounded-[3.5rem] relative overflow-hidden shadow-2xl border-4 border-indigo-500/20">
                        <div className="absolute top-0 right-0 p-12 opacity-5"><UserCog size={160} /></div>
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black uppercase tracking-tight mb-4">Gallery Master Checklist</h4>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium mb-8">
                                Upload these 3 items to the Fiverr screen you are looking at right now to build instant trust.
                            </p>
                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-black text-xs">1</div>
                                    <p className="text-xs font-bold">Main Image: Your "High-Click" Yellow Thumbnail</p>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-black text-xs">2</div>
                                    <p className="text-xs font-bold">Portfolio PDF: Generate a sample Wedding menu from this app</p>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-black text-xs">3</div>
                                    <p className="text-xs font-bold">Gig Video: Record the "Morning Mission" script on your iPad</p>
                                </div>
                            </div>
                            <button onClick={() => window.print()} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                                <FileDown size={18} /> Export Sample Portfolio PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'morning' && (
            <div className="space-y-12 animate-fade-in">
                <div className="p-12 bg-indigo-600 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border-4 border-indigo-400/30">
                    <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Video size={200} /></div>
                    <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto py-10">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                            <Mic2 size={40} className="text-white" />
                        </div>
                        <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none">The Morning Mission Script</h3>
                        <p className="text-lg text-indigo-100 font-medium mb-12">Use this for your Fiverr Introduction Video.</p>
                        
                        <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] shadow-inner border border-white/20 mb-12 text-left">
                            <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed italic whitespace-pre-wrap">
                                {morningScript}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <button onClick={() => handleOpenTeleprompter(morningScript)} className="flex-1 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">
                                <Maximize size={20} /> Open Teleprompter
                            </button>
                            <button onClick={() => handleCopy(morningScript)} className="flex-1 py-5 bg-indigo-500/30 backdrop-blur-md text-white border-2 border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500/50 transition-all flex items-center justify-center gap-3">
                                <Copy size={20} /> Copy Text
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary-500 rounded-lg text-white"><Lightbulb size={20} /></div>
                            <h4 className="text-sm font-black uppercase text-slate-800 dark:text-white">Recording Hack</h4>
                        </div>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed">
                            "Melo, record this on your iPad. Place the iPad on a stack of books so the camera is at eye level. This builds subconscious authority—the 'Professional' look."
                        </p>
                    </div>
                    <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-500 rounded-lg text-white"><Target size={20} /></div>
                            <h4 className="text-sm font-black uppercase text-slate-800 dark:text-white">Growth Objective</h4>
                        </div>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed">
                            "Aim for 1 video per day. Use the 'Teleprompter' to stay focused. Every video is a seed planted for a $1,000+ contract."
                        </p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'assets' && <ThumbnailStudio />}
      </div>
      
      <Teleprompter 
        script={currentScript} 
        isOpen={isTeleprompterOpen} 
        onClose={() => setIsTeleprompterOpen(false)} 
      />
    </section>
  );
};

const Maximize: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
);

export default FounderRoadmap;
