
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, Camera, ClipboardCheck, BookOpen, Building2, Presentation, Layout, Eye, MessageSquare, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { generateWhopSEO } from '../services/geminiService';

interface FounderRoadmapProps {
  whopUrl: string;
}

const WhopSEOSniper: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [seoData, setSeoData] = useState<any>(null);
    const [niche, setNiche] = useState('Hospitality Automation');

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
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
                    <Crosshair className="text-red-500" /> Whop Discovery Sniper
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Based on your screenshots, you aren't appearing because your metadata is generic. Use this tool to generate "High-Density" keywords that Whop's crawler loves.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-700">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block tracking-widest">Store Niche/Focus</label>
                    <input 
                        type="text" 
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all font-bold mb-6"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                        {isGenerating ? 'Analyzing Algorithm...' : 'Generate Ranking Meta'}
                    </button>

                    <div className="mt-8 space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Mandatory Ranking Steps</h4>
                        {[
                            'Title must include "Hospitality" or "Catering"',
                            'Thumbnail must have BOLD contrast text',
                            'Tags: #Hospitality, #Chef, #SaaS, #AI',
                            'Add link to this app in store description'
                        ].map(step => (
                            <div key={step} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                                <CheckCircle2 size={16} className="text-emerald-500" /> {step}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    {seoData ? (
                        <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-2xl space-y-6 animate-slide-in">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Optimized Store Title</span>
                                <p className="text-xl font-black mt-1">{seoData.optimizedTitle}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Discovery Tags</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {seoData.searchTags.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold border border-white/20">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Thumbnail Design Lab</span>
                                <p className="text-xs text-indigo-100 mt-2 leading-relaxed italic">"{seoData.thumbnailIdea}"</p>
                            </div>
                            <button 
                                onClick={() => { 
                                    navigator.clipboard.writeText(`Title: ${seoData.optimizedTitle}\n\nDescription: ${seoData.optimizedDescription}\n\nTags: ${seoData.searchTags.join(', ')}`);
                                    alert("Whop SEO Data Copied!");
                                }}
                                className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
                            >
                                Copy All Meta
                            </button>
                        </div>
                    ) : (
                        <div className="h-full min-h-[300px] border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8">
                            <Search className="text-slate-300 mb-4" size={48} />
                            <p className="text-sm font-bold text-slate-400">Generate your Ranking Meta to see the strategy here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'whop' | 'sniper' | 'video'>('whop');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['community-post']));
  const [selectedScript, setSelectedScript] = useState([
    {
      id: 'b2b-enterprise',
      title: "B2B: The 'Systems over Chaos' Pitch",
      focus: "Enterprise ROI & Speed",
      time: "2 Minutes",
      script: `Hello! I’m Tumi Seroka. 
  
  Most catering businesses are losing 15% of their margin to "Chaos"—slow proposals, inaccurate shopping lists, and manual logistics. 
  
  I founded CaterPro AI to replace that chaos with Systems. Our platform allows your sales team to generate client-ready, high-end proposals and exact procurement lists instantly. 
  
  We don't just "save time"; we increase your "Close Rate" because your clients get a Michelin-style proposal while your competitors are still typing their first draft. 
  
  I am looking to partner with one forward-thinking catering group to implement our Enterprise Suite. If you are ready to scale without increasing your admin headcount, we need to talk. I bring a "Founder Mindset" to your operations. Let's build your 2026 roadmap.`
    },
    {
      id: 'academy-pitch',
      title: "Academy: The PoE Admin Solver",
      focus: "Student Success & Admin Reduction",
      time: "90 Seconds",
      script: `Hi there! I’m Tumi, Founder of CaterPro AI. 
  
  I’m reaching out because I know that for culinary academies, the biggest bottleneck isn't the cooking—it's the "Portfolio of Evidence" admin. Students spend hours fighting with costing sheets instead of being in the kitchen.
  
  I’ve built CaterPro AI to be the "Digital Sous Chef" for your students. It automates professional menu proposals and shopping lists in local ZAR currency in under 30 seconds. 
  
  By integrating this into your curriculum, you reduce student burnout and ensure 100% accuracy in food costing. I’d love to show your dean how we can implement this to reclaim 10 hours of teaching time per week.`
    }
  ][0]);

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
    { id: 'b2b-pitch-academy', label: 'Email 5 Culinary Academy Deans (PoE Admin Solver)', highPriority: true },
    { id: 'b2b-pitch-corp', label: 'DM 3 Catering CEOs on LinkedIn (Systems over Chaos)', highPriority: true },
    { id: 'community-post', label: 'Share "AI Costing Hack" in Whop Lobby', initialDone: true },
  ];

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden scroll-mt-24" id="founder-control">
      <div className="p-8 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Rocket size={160} />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                <Building2 size={28} className="text-white" />
            </div>
            <div>
                <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Ranking Command</h2>
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-2">Whop SEO Sniper & Growth Lab</p>
            </div>
          </div>
          
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar backdrop-blur-md">
            <button onClick={() => setActiveTab('whop')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'whop' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Crosshair size={14} /> Whop Sniper
            </button>
            <button onClick={() => setActiveTab('video')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'video' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Mic2 size={14} /> Pitch Studio
            </button>
            <button onClick={() => setActiveTab('sniper')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'sniper' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <TrendingUp size={14} /> B2B Sniper
            </button>
            <button onClick={() => setActiveTab('mission')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'mission' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Trophy size={14} /> Mission Control
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-12">
        {activeTab === 'whop' ? <WhopSEOSniper /> : null}

        {/* PITCH STUDIO TAB */}
        {activeTab === 'video' && (
            <div className="animate-fade-in space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-3">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Market Target</p>
                        <button className="w-full p-5 rounded-2xl text-left border-2 bg-indigo-50 border-indigo-500">
                           <h4 className="text-sm font-black text-indigo-600">B2B Enterprise Pitch</h4>
                           <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">ROI & Scalability</p>
                        </button>
                        <div className="p-6 bg-indigo-950 rounded-2xl border-2 border-indigo-500/20 mt-6 text-white">
                            <Monitor size={24} className="text-indigo-400 mb-3" />
                            <h5 className="text-xs font-black uppercase mb-1">Visual Visibility</h5>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-bold">People on Whop buy with their eyes. Your pitch must mention "Automation" and "Time Saved" as the core product.</p>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-slate-950 rounded-[3rem] border-4 border-indigo-500/10 overflow-hidden shadow-2xl relative">
                            <div className="p-8 border-b border-white/5 bg-black/30 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                                    <h3 className="text-lg font-black text-white">"Systems over Chaos" Script</h3>
                                </div>
                                <button onClick={() => copyToClipboard(selectedScript.script, "Pitch Script")} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white">
                                    <Copy size={18} />
                                </button>
                            </div>
                            <div className="p-12 sm:p-24 text-center">
                                <p className="text-2xl sm:text-4xl font-bold leading-relaxed text-slate-100 italic whitespace-pre-wrap tracking-tight">
                                    {selectedScript.script}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* MISSION CONTROL TAB */}
        {activeTab === 'mission' && (
          <div className="animate-fade-in py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] overflow-hidden">
                    <h3 className="p-6 border-b border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Daily Ranking Roadmap</h3>
                    {dailyTasks.map((task) => (
                    <button key={task.id} onClick={() => toggleTask(task.id)} className={`w-full flex items-center gap-5 p-6 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-all ${completedTasks.has(task.id) ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                        <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${completedTasks.has(task.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                            {completedTasks.has(task.id) && <CheckCircle2 size={16} />}
                        </div>
                        <span className={`text-sm font-black text-left ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                            {task.label}
                            {task.highPriority && !completedTasks.has(task.id) && <span className="ml-3 text-[8px] bg-red-500 text-white px-2 py-1 rounded-md font-black tracking-widest">RANKING CRITICAL</span>}
                        </span>
                    </button>
                    ))}
                </div>
                <div className="bg-indigo-600 p-12 rounded-[2.5rem] flex flex-col justify-center items-center text-center shadow-2xl">
                    <Trophy className="text-white/40 mb-6" size={60} />
                    <p className="text-2xl font-black text-white leading-tight mb-6">
                        "Dominate the Algorithm."
                    </p>
                    <button onClick={() => setActiveTab('whop')} className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                        Launch Sniper Hub
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* SNIPER TAB */}
        {activeTab === 'sniper' && (
           <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] border-2 border-indigo-100 dark:border-indigo-800 flex flex-col justify-between h-full">
                   <div>
                       <h5 className="text-sm font-black uppercase text-indigo-600 tracking-widest mb-1">Whop Redirect Script</h5>
                       <p className="text-[10px] text-slate-500 font-black mb-6 uppercase tracking-widest">Post this in FB Groups</p>
                       <div className="p-6 bg-white dark:bg-slate-950 rounded-3xl text-[11px] text-slate-600 dark:text-slate-400 italic mb-8 border border-indigo-100 leading-relaxed font-bold">
                           "I just released the 2026 Hospitality Automation System on Whop. Stop typing menus manually. I'm looking for 5 beta testers to use the tool for free and help me climb the discovery rankings. Link below!"
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("I just released the 2026 Hospitality Automation System on Whop. Stop typing menus manually. I'm looking for 5 beta testers to use the tool for free and help me climb the discovery rankings. Link below!", "Redirect Post")} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-indigo-700 transition-all">
                       <Copy size={16} /> Copy Post Script
                   </button>
                </div>

                <div className="p-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2.5rem] border-2 border-emerald-100 dark:border-emerald-800 flex flex-col justify-between h-full">
                   <div>
                       <h5 className="text-sm font-black uppercase text-emerald-600 tracking-widest mb-1">Affiliate Pitch</h5>
                       <p className="text-[10px] text-slate-500 font-black mb-6 uppercase tracking-widest">Get others to sell for you</p>
                       <div className="p-6 bg-white dark:bg-slate-950 rounded-3xl text-[11px] text-slate-600 dark:text-slate-400 italic mb-8 border border-emerald-100 leading-relaxed font-bold">
                           "Hey! I see you have a big chef following. I've built a Whop product that automates their admin. Become an affiliate and I'll give you 30% of every subscription. Our tool has 100% user retention because it solves a massive pain point."
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("Hey! I see you have a big chef following. I've built a Whop product that automates their admin. Become an affiliate and I'll give you 30% of every subscription. Our tool has 100% user retention because it solves a massive pain point.", "Affiliate Pitch")} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-emerald-700 transition-all">
                       <Copy size={16} /> Copy Affiliate DM
                   </button>
                </div>
           </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
