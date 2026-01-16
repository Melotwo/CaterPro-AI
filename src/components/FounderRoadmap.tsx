
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, Camera, ClipboardCheck, BookOpen, Building2, Presentation } from 'lucide-react';

interface FounderRoadmapProps {
  whopUrl: string;
}

const dailyTasks = [
  { id: 'b2b-pitch-academy', label: 'Pitch to 5 Culinary Academies (Admin Reduction)', highPriority: true },
  { id: 'b2b-pitch-corp', label: 'Email 3 Corporate Catering Groups', highPriority: true },
  { id: 'app-reel-marketing', label: 'Generate Viral App Demo Reel', highPriority: true },
  { id: 'whop-community-update', label: 'Post 2026 Strategy Update on Whop', initialDone: true },
];

const appPitchScripts = [
  {
    id: 'academy-pitch',
    title: "Academy Pitch: The Student PoE Solver",
    focus: "Academy Admin & Student Stress",
    time: "90 Seconds",
    script: `Hi there! I’m Tumi, Founder of CaterPro AI. 

I’m reaching out because I know that for culinary academies, the biggest bottleneck isn't the cooking—it's the 'Portfolio of Evidence' admin. Students spend hours fighting with costing sheets and menu formatting instead of being in the kitchen.

I’ve built CaterPro AI to be the 'Digital Sous Chef' for your students. It automates professional menu proposals and shopping lists in local ZAR currency in under 30 seconds. 

By integrating this into your curriculum, you reduce student burnout, ensure 100% accuracy in food costing assignments, and position your academy as a 2026 tech-forward leader. 

I’d love to show your dean how we can implement this to reclaim 10 hours of teaching time per week. Let’s modernize your kitchen operations.`
  },
  {
    id: 'enterprise-pitch',
    title: "Enterprise Pitch: Systems Over Chaos",
    focus: "ROI & Scalable Operations",
    time: "2 Minutes",
    script: `Hello! I’m Tumi Seroka. 

Most catering businesses are losing 15% of their margin to 'Chaos'—slow proposals, inaccurate shopping lists, and manual logistics. 

I founded CaterPro AI to replace that chaos with Systems. Our platform allows your sales team to generate client-ready, high-end proposals and exact procurement lists instantly. 

We don't just 'save time'; we increase your 'Close Rate' because your clients get a Michelin-style proposal while your competitors are still typing their first draft. 

I am looking to partner with one forward-thinking catering group to implement our Enterprise Suite. If you are ready to scale without increasing your admin headcount, we need to talk. I bring a 'Founder Mindset' to your operations. Let's build your 2026 roadmap.`
  }
];

const b2bBusinessProposal = `CATERPRO AI | BUSINESS PROPOSAL 2026
EXECUTIVE SUMMARY: RECLAIMING MARGIN THROUGH AI AUTOMATION

THE PROBLEM:
Catering operations and culinary academies are burdened by "Manual Admin Decay." Menus, procurement lists, and student PoE requirements take up 40% of operational hours.

THE SOLUTION:
CaterPro AI (SaaS). A specialized LLM-driven engine that generates:
1. Professional Client Proposals (PDF/Link)
2. Categorized Shopping Lists (Store/Aisle optimized)
3. Service & Mise en Place Logistics
4. Marketing Reels & Social Captions

VALUE PROPOSITION:
• For Academies: 80% reduction in Student PoE admin.
• For Companies: 3x faster proposal turnaround; 15% improvement in procurement accuracy.

PRICING MODEL:
• Enterprise Seat: R549/mo (Business Tier)
• Academy Bulk License: Contact for Pilot Program pricing.

CONTACT:
Tumi Seroka | Founder
turoka15@gmail.com | +27 679 461 487`;

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'sniper' | 'proposal' | 'video'>('video');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['whop-community-update']));
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
      {/* Header with Navigation */}
      <div className="p-8 bg-slate-950 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
                <Building2 size={24} className="text-white" />
            </div>
            <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">B2B Growth Hub</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Selling CaterPro AI to the World</p>
            </div>
          </div>
          
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('video')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'video' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <Camera size={14} className="inline mr-2" /> App Pitch Studio
            </button>
            <button onClick={() => setActiveTab('mission')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'mission' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <Trophy size={14} className="inline mr-2" /> Daily Missions
            </button>
            <button onClick={() => setActiveTab('proposal')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'proposal' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <Presentation size={14} className="inline mr-2" /> One-Pager
            </button>
            <button onClick={() => setActiveTab('sniper')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'sniper' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <Crosshair size={14} className="inline mr-2" /> B2B Sniper
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* APP PITCH STUDIO TAB */}
        {activeTab === 'video' && (
            <div className="animate-fade-in space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Script Selector */}
                    <div className="lg:col-span-1 space-y-3">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Select Target Market</p>
                        {appPitchScripts.map(s => (
                            <button 
                                key={s.id}
                                onClick={() => setSelectedScript(s)}
                                className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${selectedScript.id === s.id ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20' : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}
                            >
                                <h4 className={`text-sm font-black ${selectedScript.id === s.id ? 'text-indigo-600' : 'text-slate-600'}`}>{s.title}</h4>
                                <p className="text-[10px] text-slate-400 mt-1">{s.time}</p>
                            </button>
                        ))}
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 mt-6">
                            <Monitor size={24} className="text-indigo-500 mb-2" />
                            <p className="text-[10px] font-bold text-indigo-800 dark:text-indigo-400">Pro Tip: Use these scripts to record video messages (Loom) for your B2B outreach.</p>
                        </div>
                    </div>

                    {/* Teleprompter View */}
                    <div className="lg:col-span-3">
                        <div className="bg-slate-950 rounded-[2.5rem] border-2 border-indigo-500/20 overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/10 bg-black/40 flex justify-between items-center">
                                <div>
                                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest">{selectedScript.focus}</span>
                                    <h3 className="text-lg font-black mt-2 text-white">{selectedScript.title}</h3>
                                </div>
                                <button onClick={() => copyToClipboard(selectedScript.script, "Script")} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-white">
                                    <Copy size={18} />
                                </button>
                            </div>
                            <div className="p-10 sm:p-20 text-center">
                                <p className="text-2xl sm:text-4xl font-bold leading-relaxed text-white italic whitespace-pre-wrap">
                                    {selectedScript.script}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* DAILY MISSIONS TAB */}
        {activeTab === 'mission' && (
          <div className="animate-fade-in py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden">
                    <h3 className="p-5 border-b border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-400">Business Dev Tasks</h3>
                    {dailyTasks.map((task) => (
                    <button key={task.id} onClick={() => toggleTask(task.id)} className={`w-full flex items-center gap-4 p-5 border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-colors ${completedTasks.has(task.id) ? 'bg-green-50/50' : ''}`}>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${completedTasks.has(task.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                            {completedTasks.has(task.id) && <CheckCircle2 size={14} />}
                        </div>
                        <span className={`text-sm font-bold text-left ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                            {task.label}
                            {task.highPriority && !completedTasks.has(task.id) && <span className="ml-2 text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded">HIGH INTENT</span>}
                        </span>
                    </button>
                    ))}
                </div>
                <div className="bg-primary-50/50 dark:bg-primary-900/10 p-8 rounded-[2rem] border-2 border-dashed border-primary-200 dark:border-primary-800 flex flex-col justify-center items-center text-center">
                    <TrendingUp className="text-primary-600 mb-4" size={40} />
                    <p className="text-lg font-black text-slate-800 dark:text-white leading-tight mb-4">
                        "Focus on the App. Build the Equity."
                    </p>
                    <button onClick={() => setActiveTab('video')} className="px-6 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        Start Pitching <PlayCircle size={14} />
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* PROPOSAL TAB */}
        {activeTab === 'proposal' && (
            <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center">
                    <h4 className="text-xl font-black uppercase">App Value Proposition (One-Pager)</h4>
                    <button onClick={() => copyToClipboard(b2bBusinessProposal, "Proposal")} className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-black uppercase flex items-center gap-2">
                        <Copy size={14} /> Copy One-Pager
                    </button>
                </div>
                <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 max-h-[600px] overflow-y-auto font-mono text-xs leading-relaxed">
                    <pre className="whitespace-pre-wrap">{b2bBusinessProposal}</pre>
                </div>
            </div>
        )}

        {/* B2B SNIPER TAB */}
        {activeTab === 'sniper' && (
           <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border-2 border-indigo-200 dark:border-indigo-800 flex flex-col justify-between h-full">
                   <div>
                       <h5 className="text-sm font-black uppercase text-indigo-600 tracking-widest mb-1">Academy Dean Outreach</h5>
                       <p className="text-[10px] text-slate-500 font-bold mb-4">Focus on Student PoE Admin reduction.</p>
                       <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl text-[11px] text-slate-600 dark:text-slate-400 italic mb-6 border border-indigo-100">
                           "I noticed your students are currently managing their Portfolio of Evidence (PoE) manually. I've built an AI system specifically to automate the costing and menu planning admin, reclaiming 10 hours of teaching time per week..."
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("I noticed your students are currently managing their Portfolio of Evidence (PoE) manually. I've built an AI system specifically to automate the costing and menu planning admin, reclaiming 10 hours of teaching time per week. I'd love to show you how we can integrate this into your curriculum.", "Academy Email")} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                       <Copy size={16} /> Copy Academy Email
                   </button>
                </div>

                <div className="p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] border-2 border-emerald-200 dark:border-emerald-800 flex flex-col justify-between h-full">
                   <div>
                       <h5 className="text-sm font-black uppercase text-emerald-600 tracking-widest mb-1">Catering CEO Pitch</h5>
                       <p className="text-[10px] text-slate-500 font-bold mb-4">Focus on Close Rates & Profit Margin.</p>
                       <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl text-[11px] text-slate-600 dark:text-slate-400 italic mb-6 border border-emerald-100">
                           "Your team is currently losing margin to slow manual proposals. CaterPro AI generates high-end, client-ready proposals in 30 seconds. We've seen close rates increase by 25% by hitting clients with a professional bid while competitors are still typing..."
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("Your team is currently losing margin to slow manual proposals. CaterPro AI generates high-end, client-ready proposals in 30 seconds. We've seen close rates increase by 25% by hitting clients with a professional bid while competitors are still typing. Can we discuss your 2026 digital roadmap?", "CEO Pitch Email")} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                       <Copy size={16} /> Copy CEO Pitch Email
                   </button>
                </div>
           </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
