
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, Camera, ClipboardCheck, BookOpen, Building2, Presentation, Layout, Eye, MessageSquare, Sparkles } from 'lucide-react';

interface FounderRoadmapProps {
  whopUrl: string;
}

const dailyTasks = [
  { id: 'whop-optimize', label: 'Optimize Whop Discovery Tags (#Hospitality, #Catering, #Chefs)', highPriority: true },
  { id: 'b2b-pitch-academy', label: 'Email 5 Culinary Academy Deans (PoE Admin Solver)', highPriority: true },
  { id: 'b2b-pitch-corp', label: 'DM 3 Catering CEOs on LinkedIn (Systems over Chaos)', highPriority: true },
  { id: 'community-post', label: 'Share "AI Costing Hack" in Whop Lobby', initialDone: true },
];

const appPitchScripts = [
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
];

const whopDiscoveryTips = [
  {
    title: "Thumbnail Strategy",
    icon: Layout,
    tip: "Use high-contrast 'Executive' style thumbnails. Avoid generic food stock; show the dashboard or a pro proposal PDF. Look at 'Foodie'—they use bold text. We need 'CaterPro: The System' in large fonts."
  },
  {
    title: "Keyword Sniper",
    icon: Search,
    tip: "Tags for Discovery: #CateringSoftware, #ChefAdmin, #CulinaryAcademy, #HospitalityTech. When users search 'Hospitality', your title 'CaterPro AI: The Hospitality System' must trigger."
  },
  {
    title: "The 'Lobby' Hook",
    icon: Users,
    tip: "Offer a 'Free PoE Template' in your Whop Lobby. This captures students early. Once they see the automation, they upgrade to the full Business seat for their professional gigs."
  }
];

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'whop' | 'sniper' | 'video'>('whop');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['community-post']));
  const [selectedScript, setSelectedScript] = useState(appPitchScripts[0]);

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

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden scroll-mt-24" id="founder-control">
      {/* Premium Header */}
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
                <h2 className="text-3xl font-black uppercase tracking-tight leading-none">B2B Mastery</h2>
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-2">Whop Discovery & Enterprise Growth</p>
            </div>
          </div>
          
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar backdrop-blur-md">
            <button onClick={() => setActiveTab('whop')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'whop' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Eye size={14} /> Whop Discovery
            </button>
            <button onClick={() => setActiveTab('video')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'video' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Mic2 size={14} /> Pitch Studio
            </button>
            <button onClick={() => setActiveTab('sniper')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'sniper' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Crosshair size={14} /> B2B Sniper
            </button>
            <button onClick={() => setActiveTab('mission')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'mission' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Trophy size={14} /> Mission Control
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-12">
        {/* WHOP DISCOVERY TAB */}
        {activeTab === 'whop' && (
            <div className="animate-fade-in space-y-10">
                <div className="max-w-3xl">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
                        <Sparkles className="text-amber-500" /> Dominate the Discovery Page
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Based on your Whop screenshots, we need to stand out as the *only* automation system in a sea of generic food groups. Here is your competitive advantage strategy:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {whopDiscoveryTips.map((tip, i) => (
                        <div key={i} className="p-8 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] relative group hover:border-indigo-500/30 transition-all">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl w-fit mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <tip.icon className="text-indigo-600" size={24} />
                            </div>
                            <h4 className="text-lg font-black mb-3">{tip.title}</h4>
                            <p className="text-xs text-slate-500 font-bold leading-relaxed">{tip.tip}</p>
                        </div>
                    ))}
                </div>

                <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-white/20 rounded-3xl"><Users size={32} /></div>
                        <div>
                            <h4 className="text-xl font-black">Community Growth Loop</h4>
                            <p className="text-sm text-indigo-100 font-medium">Capture traffic, convert with AI, keep with community.</p>
                        </div>
                    </div>
                    <a href={whopUrl} target="_blank" className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        Open Whop Dashboard <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        )}

        {/* PITCH STUDIO TAB */}
        {activeTab === 'video' && (
            <div className="animate-fade-in space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-3">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Market Target</p>
                        {appPitchScripts.map(s => (
                            <button 
                                key={s.id}
                                onClick={() => setSelectedScript(s)}
                                className={`w-full p-5 rounded-2xl text-left transition-all border-2 ${selectedScript.id === s.id ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20' : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}
                            >
                                <h4 className={`text-sm font-black ${selectedScript.id === s.id ? 'text-indigo-600' : 'text-slate-600'}`}>{s.title}</h4>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{s.focus}</p>
                            </button>
                        ))}
                        <div className="p-6 bg-indigo-950 rounded-2xl border-2 border-indigo-500/20 mt-6 text-white">
                            <Monitor size={24} className="text-indigo-400 mb-3" />
                            <h5 className="text-xs font-black uppercase mb-1">iPad Recording Hack</h5>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-bold">Mic too soft? Record 'Silent Demo' reels with text overlays. Show the screen generating a menu, let the UI do the talking!</p>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-slate-950 rounded-[3rem] border-4 border-indigo-500/10 overflow-hidden shadow-2xl relative">
                            <div className="p-8 border-b border-white/5 bg-black/30 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                                    <h3 className="text-lg font-black text-white">{selectedScript.title}</h3>
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
                    <h3 className="p-6 border-b border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Daily B2B Roadmap</h3>
                    {dailyTasks.map((task) => (
                    <button key={task.id} onClick={() => toggleTask(task.id)} className={`w-full flex items-center gap-5 p-6 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-all ${completedTasks.has(task.id) ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                        <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${completedTasks.has(task.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                            {completedTasks.has(task.id) && <CheckCircle2 size={16} />}
                        </div>
                        <span className={`text-sm font-black text-left ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                            {task.label}
                            {task.highPriority && !completedTasks.has(task.id) && <span className="ml-3 text-[8px] bg-red-500 text-white px-2 py-1 rounded-md font-black tracking-widest">HIGH INTENT</span>}
                        </span>
                    </button>
                    ))}
                </div>
                <div className="bg-indigo-600 p-12 rounded-[2.5rem] flex flex-col justify-center items-center text-center shadow-2xl">
                    <Trophy className="text-white/40 mb-6" size={60} />
                    <p className="text-2xl font-black text-white leading-tight mb-6">
                        "Your Equity is the System."
                    </p>
                    <button onClick={() => setActiveTab('video')} className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                        Launch Pitch Studio
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
                       <h5 className="text-sm font-black uppercase text-indigo-600 tracking-widest mb-1">Academy Dean Sniper</h5>
                       <p className="text-[10px] text-slate-500 font-black mb-6 uppercase tracking-widest">Target: Student Retention</p>
                       <div className="p-6 bg-white dark:bg-slate-950 rounded-3xl text-[11px] text-slate-600 dark:text-slate-400 italic mb-8 border border-indigo-100 leading-relaxed font-bold">
                           "Dean [Name], I've analyzed the Class of 2026 onboarding. The biggest student stressor is the PoE admin grind—specifically food costing. I've built CaterPro AI to automate this. Students spend 10 more hours in the kitchen and 0 hours fighting with spreadsheets. Can we discuss a pilot for your next intake?"
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("Dean [Name], I've analyzed the Class of 2026 onboarding. The biggest student stressor is the PoE admin grind—specifically food costing. I've built CaterPro AI to automate this. Students spend 10 more hours in the kitchen and 0 hours fighting with spreadsheets. Can we discuss a pilot for your next intake?", "Academy Sniper")} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-indigo-700 transition-all">
                       <Copy size={16} /> Copy Sniper Email
                   </button>
                </div>

                <div className="p-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2.5rem] border-2 border-emerald-100 dark:border-emerald-800 flex flex-col justify-between h-full">
                   <div>
                       <h5 className="text-sm font-black uppercase text-emerald-600 tracking-widest mb-1">Catering Group CEO</h5>
                       <p className="text-[10px] text-slate-500 font-black mb-6 uppercase tracking-widest">Target: Profit Margin</p>
                       <div className="p-6 bg-white dark:bg-slate-950 rounded-3xl text-[11px] text-slate-600 dark:text-slate-400 italic mb-8 border border-emerald-100 leading-relaxed font-bold">
                           "Your team is currently losing 15% margin to manual admin decay. CaterPro AI allows your sales staff to generate high-end, client-ready proposals in 30 seconds. We turn your sales chaos into a data-driven system. I’m looking for one group to partner with for a 2026 rollout."
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("Your team is currently losing 15% margin to manual admin decay. CaterPro AI allows your sales staff to generate high-end, client-ready proposals in 30 seconds. We turn your sales chaos into a data-driven system. I’m looking for one group to partner with for a 2026 rollout.", "CEO Sniper")} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-emerald-700 transition-all">
                       <Copy size={16} /> Copy Sniper Email
                   </button>
                </div>
           </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
