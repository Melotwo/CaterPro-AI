
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, Camera, ClipboardCheck, BookOpen, Building2, Presentation, Layout, Eye, MessageSquare, Sparkles, Loader2, AlertCircle, ListChecks, Star, Settings2, HelpCircle } from 'lucide-react';
import { generateWhopSEO } from '../services/geminiService';
import ThumbnailStudio from './ThumbnailStudio';

interface FounderRoadmapProps {
  whopUrl: string;
}

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
                <Crosshair size={16} /> Visibility Hub
            </button>
            <button onClick={() => setActiveTab('design')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'design' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Layout size={16} /> Asset Studio
            </button>
            <button onClick={() => setActiveTab('mission')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'mission' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <ClipboardCheck size={16} /> Dashboard Checklist
            </button>
            <button onClick={() => setActiveTab('sniper')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'sniper' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <TrendingUp size={16} /> Conversion Lab
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
                       <h5 className="text-lg font-black uppercase text-indigo-700 dark:text-indigo-400 tracking-widest mb-1">Whop Viral Strategy</h5>
                       <p className="text-[11px] text-slate-500 font-black mb-8 uppercase tracking-widest">Growth Loop Post</p>
                       <div className="p-8 bg-white dark:bg-slate-950 rounded-[2.5rem] text-sm text-slate-700 dark:text-slate-300 italic mb-10 border border-indigo-100 leading-relaxed font-bold shadow-inner">
                           "I just updated the 2026 Catering Command Center on Whop. You can now try the system for 7 days FREE. I'm looking for reviews to help my Discovery ranking. Link in bio!"
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("I just updated the 2026 Catering Command Center on Whop. You can now try the system for 7 days FREE. I'm looking for reviews to help my Discovery ranking. Link in bio!", "Review Post")} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-700 transition-all">
                       <Copy size={20} /> Copy "Free Trial" Post
                   </button>
                </div>

                <div className="p-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-[3rem] border-2 border-emerald-100 dark:border-emerald-800 flex flex-col justify-between h-full shadow-lg">
                   <div>
                       <div className="p-3 bg-emerald-600 w-fit rounded-2xl mb-6 text-white shadow-lg"><Users size={24} /></div>
                       <h5 className="text-lg font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest mb-1">Affiliate Fuel</h5>
                       <p className="text-[11px] text-slate-500 font-black mb-8 uppercase tracking-widest">Recruit others to rank for you</p>
                       <div className="p-8 bg-white dark:bg-slate-950 rounded-[2.5rem] text-sm text-slate-700 dark:text-slate-300 italic mb-10 border border-emerald-100 leading-relaxed font-bold shadow-inner">
                           "Chef! I've built a system that automates our admin. Become an affiliate on Whop—tell people they can try it for FREE for 7 days. You keep 40% of every sale after that."
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("Chef! I've built a system that automates our admin. Become an affiliate on Whop—tell people they can try it for FREE for 7 days. You keep 40% of every sale after that.", "Affiliate DM")} className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-700 transition-all">
                       <Copy size={20} /> Copy Recruiter DM
                   </button>
                </div>
           </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
