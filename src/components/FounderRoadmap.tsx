
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, Camera, ClipboardCheck, BookOpen, Building2, Presentation, Layout, Eye, MessageSquare, Sparkles, Loader2, AlertCircle, ListChecks, Star } from 'lucide-react';
import { generateWhopSEO } from '../services/geminiService';
import ThumbnailStudio from './ThumbnailStudio';

interface FounderRoadmapProps {
  whopUrl: string;
}

const WhopSEOSniper: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [seoData, setSeoData] = useState<any>(null);
    const [niche, setNiche] = useState('Hospitality Automation System');

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
                    <Crosshair className="text-red-500" /> Whop Algorithm Sniper
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Whop rewards <span className="text-indigo-600 font-black italic">Conversion Velocity</span>. If people click your listing but don't join, you drop. If you use generic titles like "Chef Course," you're invisible.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700 shadow-xl">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block tracking-[0.3em]">Target Discovery Category</label>
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input 
                            type="text" 
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            className="w-full pl-12 pr-6 py-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all font-black text-lg shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} className="text-amber-400" />}
                        {isGenerating ? 'Analyzing Market Velocity...' : 'Generate Visibility DNA'}
                    </button>

                    <div className="mt-12 space-y-6">
                        <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                           <ListChecks size={18} className="text-indigo-500" /> High-Ranking Checklist
                        </h4>
                        <div className="space-y-4">
                            {[
                                { t: 'High-Density Title', desc: 'Must include "Hospitality", "AI", and "System".', done: true },
                                { t: 'Authority Description', desc: 'Explain the "System Over Chaos" logic.', done: false },
                                { t: 'Whop Tags (5)', desc: '#Hospitality, #Chef, #SaaS, #AI, #Automation', done: false },
                                { t: 'Free Value Hook', desc: 'Offer a 2026 PoE Template in your Whop Lobby.', done: false }
                            ].map(step => (
                                <div key={step.t} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:translate-x-1">
                                    <div className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${step.done ? 'bg-emerald-500 text-white' : 'border-2 border-slate-200 text-slate-200'}`}>
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white uppercase">{step.t}</p>
                                        <p className="text-[10px] text-slate-500 font-bold mt-1 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
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
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2 block">Optimized Listing Title</span>
                                <p className="text-2xl sm:text-3xl font-black leading-tight tracking-tight mt-1">{seoData.optimizedTitle}</p>
                                <button onClick={() => { navigator.clipboard.writeText(seoData.optimizedTitle); alert("Title Copied!"); }} className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-100 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 transition-all">
                                    <Copy size={12} /> Copy Title
                                </button>
                            </div>

                            <div className="relative z-10">
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-3 block">Discovery Tags</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {seoData.searchTags.map((tag: string) => (
                                        <span key={tag} className="px-4 py-2 bg-white/10 rounded-xl text-xs font-black border border-white/20 shadow-inner">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="relative z-10 p-6 bg-black/20 rounded-3xl border border-white/10">
                                <div className="flex items-center gap-2 mb-2 text-amber-300">
                                    <Star size={16} className="fill-amber-300" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Description Strategy</span>
                                </div>
                                <p className="text-xs text-indigo-100 mt-2 leading-relaxed italic font-medium">"{seoData.optimizedDescription}"</p>
                            </div>

                            <button 
                                onClick={() => { 
                                    navigator.clipboard.writeText(`Title: ${seoData.optimizedTitle}\n\nDescription: ${seoData.optimizedDescription}\n\nTags: ${seoData.searchTags.join(', ')}`);
                                    alert("Whop Visibility Package Copied!");
                                }}
                                className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all relative z-10"
                            >
                                Copy All Meta Data
                            </button>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900/20">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Rocket className="text-slate-300" size={32} />
                            </div>
                            <h5 className="text-xl font-black text-slate-300 uppercase tracking-widest">Visibility Off-Line</h5>
                            <p className="text-sm font-bold text-slate-400 mt-3 max-w-xs leading-relaxed">Choose your niche and generate the SEO package to appear in Whop Discovery.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'whop' | 'sniper' | 'video' | 'design'>('whop');
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
    { id: 'whop-optimize', label: 'Optimize Whop Discovery Tags (#Hospitality, #Catering, #Chefs)', highPriority: true },
    { id: 'thumbnail-high-contrast', label: 'Generate High-Contrast Studio Thumbnail', highPriority: true },
    { id: 'b2b-pitch-academy', label: 'Email 5 Culinary Academy Deans (PoE Admin Solver)', highPriority: true },
    { id: 'community-post', label: 'Share "AI Costing Hack" in Whop Lobby', initialDone: true },
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
                <Building2 size={32} className="text-white" />
            </div>
            <div>
                <h2 className="text-4xl font-black uppercase tracking-tight leading-none">Ranking Command</h2>
                <p className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Visibility Engineering & Growth</p>
            </div>
          </div>
          
          <div className="flex bg-slate-900/50 p-2 rounded-[1.5rem] border border-white/10 overflow-x-auto no-scrollbar backdrop-blur-md">
            <button onClick={() => setActiveTab('whop')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'whop' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Crosshair size={16} /> Visibility Sniper
            </button>
            <button onClick={() => setActiveTab('design')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'design' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Layout size={16} /> Thumbnail Lab
            </button>
            <button onClick={() => setActiveTab('sniper')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'sniper' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <TrendingUp size={16} /> Growth Strategy
            </button>
            <button onClick={() => setActiveTab('mission')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'mission' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Trophy size={16} /> Mission Control
            </button>
          </div>
        </div>
      </div>

      <div className="p-10 sm:p-16">
        {activeTab === 'whop' && <WhopSEOSniper />}
        {activeTab === 'design' && <ThumbnailStudio />}

        {/* MISSION CONTROL TAB */}
        {activeTab === 'mission' && (
          <div className="animate-fade-in py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[3rem] overflow-hidden shadow-inner">
                    <h3 className="p-8 border-b border-slate-100 dark:border-slate-700 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Daily Visibility Roadmap</h3>
                    {dailyTasks.map((task) => (
                    <button key={task.id} onClick={() => toggleTask(task.id)} className={`w-full flex items-center gap-6 p-8 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-all ${completedTasks.has(task.id) ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${completedTasks.has(task.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                            {completedTasks.has(task.id) && <CheckCircle2 size={18} />}
                        </div>
                        <span className={`text-base font-black text-left ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                            {task.label}
                            {task.highPriority && !completedTasks.has(task.id) && <span className="ml-3 text-[9px] bg-red-500 text-white px-2.5 py-1 rounded-md font-black tracking-widest shadow-lg shadow-red-500/20">RANKING CRITICAL</span>}
                        </span>
                    </button>
                    ))}
                </div>
                <div className="bg-indigo-600 p-16 rounded-[3rem] flex flex-col justify-center items-center text-center shadow-[0_40px_80px_-15px_rgba(79,70,229,0.5)]">
                    <Trophy className="text-white/30 mb-8" size={80} />
                    <p className="text-3xl font-black text-white leading-tight mb-8">
                        "Dominate the<br/>Discovery Feed."
                    </p>
                    <button onClick={() => setActiveTab('whop')} className="px-12 py-6 bg-white text-indigo-600 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        Launch Sniper Hub
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* GROWTH STRATEGY TAB */}
        {activeTab === 'sniper' && (
           <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-[3rem] border-2 border-indigo-100 dark:border-indigo-800 flex flex-col justify-between h-full shadow-lg">
                   <div>
                       <div className="p-3 bg-indigo-600 w-fit rounded-2xl mb-6 text-white shadow-lg"><MessageSquare size={24} /></div>
                       <h5 className="text-lg font-black uppercase text-indigo-700 dark:text-indigo-400 tracking-widest mb-1">Whop Viral Redirect</h5>
                       <p className="text-[11px] text-slate-500 font-black mb-8 uppercase tracking-widest">Share this with Beta Testers</p>
                       <div className="p-8 bg-white dark:bg-slate-950 rounded-[2.5rem] text-sm text-slate-700 dark:text-slate-300 italic mb-10 border border-indigo-100 leading-relaxed font-bold shadow-inner">
                           "I just released the 2026 Hospitality Automation System on Whop. Stop typing menus manually. I'm looking for 5 beta testers to use the tool for free and help me climb the discovery rankings. Link below!"
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("I just released the 2026 Hospitality Automation System on Whop. Stop typing menus manually. I'm looking for 5 beta testers to use the tool for free and help me climb the discovery rankings. Link below!", "Redirect Post")} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-700 transition-all">
                       <Copy size={20} /> Copy Campaign Post
                   </button>
                </div>

                <div className="p-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-[3rem] border-2 border-emerald-100 dark:border-emerald-800 flex flex-col justify-between h-full shadow-lg">
                   <div>
                       <div className="p-3 bg-emerald-600 w-fit rounded-2xl mb-6 text-white shadow-lg"><Users size={24} /></div>
                       <h5 className="text-lg font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest mb-1">Affiliate Growth Lab</h5>
                       <p className="text-[11px] text-slate-500 font-black mb-8 uppercase tracking-widest">Get others to rank for you</p>
                       <div className="p-8 bg-white dark:bg-slate-950 rounded-[2.5rem] text-sm text-slate-700 dark:text-slate-300 italic mb-10 border border-emerald-100 leading-relaxed font-bold shadow-inner">
                           "Hey! I see you have a big chef following. I've built a Whop product that automates their admin. Become an affiliate and I'll give you 30% of every subscription. Our tool solves the #1 pain point: Admin Stress."
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("Hey! I see you have a big chef following. I've built a Whop product that automates their admin. Become an affiliate and I'll give you 30% of every subscription. Our tool solves the #1 pain point: Admin Stress.", "Affiliate Pitch")} className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-700 transition-all">
                       <Copy size={20} /> Copy Affiliate DM
                   </button>
                </div>
           </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
