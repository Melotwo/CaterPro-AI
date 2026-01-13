
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Smartphone, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, Camera, ClipboardCheck, BookOpen } from 'lucide-react';

interface FounderRoadmapProps {
  whopUrl: string;
}

const dailyTasks = [
  { id: 'video-record-price', label: 'Record Loom: Price Real Estate (Acquisitions)', highPriority: true },
  { id: 'video-record-gattaca', label: 'Record Loom: Gattaca (Sales Closer)', highPriority: true },
  { id: 'cv-update', label: 'Send AI-Optimized CV to Gattaca', highPriority: true },
  { id: 'whop-post-1', label: 'Publish First Whop Post (DONE! 🤙🏿)', initialDone: true },
];

const videoScripts = [
  {
    id: 'price-acquisitions',
    title: "Price Real Estate: Acquisitions VA",
    focus: "Acquisition Grit & Asset Expansion",
    time: "90 Seconds",
    script: `Hi Price Real Estate Team! I’m Tumi Seroka.

I’m applying for the Acquisitions VA role because I don’t just understand real estate—I understand how to pivot a property into an asset. 

My background isn’t just theoretical. I personally took a distressed 2-room family property in South Africa that was burdened with debt, negotiated the liquidation of that debt, and architected a plan to expand it into a 12-unit rental system for students and contractors. 

I’ve spent years making "offers" where the stakes were personal. I know how to speak to people in high-stress situations, identify their pain points, and offer a solution that closes the deal.

Combined with my 5-star international communications background with Disney, I have the grit and the professional polish to represent Price Real Estate during the US shift. I am ready to close for you.`
  },
  {
    id: 'gattaca-closer',
    title: "Gattaca Holdings: Sales Closer",
    focus: "Closing Psychology & Global Experience",
    time: "2 Minutes",
    script: `Hello Gattaca Hiring Team! My name is Tumi Seroka.

What you need in a Sales Closer is someone who can handle "Systems over Chaos." 

For 15 years, I have operated in high-pressure environments—from managing international guest relations for Disney Cruise Line to operating my own residential portfolio. My biggest career win was taking a 2-room home with utility debt and scaling it into a 12-unit commercial rental business. 

That required more than just "selling." It required closing negotiations with contractors, managing municipal logistics, and convincing tenants of the value of my system. 

I am 100% committed to the 3 PM to 2 AM SAST shift because I know that is when the best deals are closed in the US market. I bring a "Founder Mindset" to every call. I’m not looking for a job; I’m looking for a portfolio to grow. Let’s close some deals together.`
  }
];

const realEstateCV = `TUMELO HANNES SEROKA
+27 679 461 487 | turoka15@gmail.com
Mokopane, South Africa (Remote Ready)

REAL ESTATE SALES CLOSER & ASSET OPERATOR
Specializing in Distressed Asset Pivot | International Client Communications

PROFESSIONAL SUMMARY
Results-driven Sales and Operations professional with 15+ years of international experience. Proven track record in "Closing" complex situations: notably pivoting a 2-room high-debt residential property into a 12-unit income-generating student housing system. Expert in high-stakes communication (Disney Cruise Line) and AI-driven workflow optimization. Committed to the 3PM-2AM SAST shift for US market alignment.

CORE COMPETENCIES
• Real Estate: Asset Management, Property Scaling, Yield Optimization.
• Sales: Closing, Negotiation, Conflict Resolution, High-Intent Scripting.
• Communication: International Stakeholder Management, US-aligned English Proficiency.
• Tech: AI Productivity (100% Google Certified), CRM Management.

KEY EXPERIENCE

ASSET MANAGER | Residential Rental Portfolio
South Africa | 2015 – Present
• Orchestrated the commercial expansion of a township property from 2 rooms to 12 rooms.
• Managed the total liquidation of utility debt through strategic financial planning.
• Successfully marketed and closed monthly rental agreements with contractors and students, maintaining 90%+ occupancy.
• Developed local sourcing systems for maintenance and construction, reducing overhead by 30%.

COMMERCIAL OPERATIONS | Disney Cruise Line
International | Feb 2011 – July 2015
• Managed high-volume client relations in a 5-star international environment.
• Navigated complex, fast-paced commercial scenarios where clear communication was vital for safety and satisfaction.
• Represented a global brand with strict adherence to quality and performance metrics.

EDUCATION & CERTIFICATIONS
• CERTIFICATE: Maximize Productivity with AI Tools (100% Final Grade) | Google | 2024
• DIPLOMA: Culinary Arts | Prue Leith College of Food and Wine | 2007

Available for immediate placement in the US-Hours Shift.`;

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'sniper' | 'cv' | 'video'>('video');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['whop-post-1']));
  const [selectedScript, setSelectedScript] = useState(videoScripts[0]);

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
            <div className="p-3 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20">
                <Target size={24} className="text-white" />
            </div>
            <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Closing Control</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Real Estate VA & Sales Pitch Hub</p>
            </div>
          </div>
          
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('video')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'video' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <Camera size={14} className="inline mr-2" /> Loom Studio
            </button>
            <button onClick={() => setActiveTab('mission')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'mission' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <Trophy size={14} className="inline mr-2" /> Daily Tasks
            </button>
            <button onClick={() => setActiveTab('cv')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'cv' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <FileUser size={14} className="inline mr-2" /> Closer CV
            </button>
            <button onClick={() => setActiveTab('sniper')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'sniper' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <Crosshair size={14} className="inline mr-2" /> Email Sniper
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* LOOM STUDIO TAB */}
        {activeTab === 'video' && (
            <div className="animate-fade-in space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Script Selector */}
                    <div className="lg:col-span-1 space-y-3">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Select Target</p>
                        {videoScripts.map(s => (
                            <button 
                                key={s.id}
                                onClick={() => setSelectedScript(s)}
                                className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${selectedScript.id === s.id ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20' : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}
                            >
                                <h4 className={`text-sm font-black ${selectedScript.id === s.id ? 'text-indigo-600' : 'text-slate-600'}`}>{s.title}</h4>
                                <p className="text-[10px] text-slate-400 mt-1">{s.time}</p>
                            </button>
                        ))}
                        <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-800 mt-6">
                            <Mic2 size={24} className="text-amber-500 mb-2" />
                            <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400">Pro Tip: Look into the lens, not the script. Use your iPad as a teleprompter!</p>
                        </div>
                    </div>

                    {/* Teleprompter View */}
                    <div className="lg:col-span-3">
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
                                <div>
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest">{selectedScript.focus}</span>
                                    <h3 className="text-lg font-black mt-2">{selectedScript.title}</h3>
                                </div>
                                <button onClick={() => copyToClipboard(selectedScript.script, "Script")} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-indigo-100 transition-colors">
                                    <Copy size={18} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="p-10 sm:p-16 text-center">
                                <p className="text-2xl sm:text-4xl font-medium leading-relaxed text-slate-800 dark:text-slate-200 italic">
                                    {selectedScript.script}
                                </p>
                                <div className="mt-12 flex justify-center items-center gap-4">
                                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recording Mode Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PLAIN TEXT SCRIPT REVIEW FOR EASY COPY-PASTE */}
                <div className="mt-16 border-t border-slate-100 dark:border-slate-800 pt-16">
                    <div className="flex items-center gap-3 mb-8">
                        <BookOpen className="text-indigo-500" />
                        <h4 className="text-xl font-black uppercase">Direct Script Review (Plain Text)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {videoScripts.map((s) => (
                            <div key={s.id} className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 relative group">
                                <h5 className="text-sm font-black uppercase text-indigo-500 mb-4 tracking-widest">{s.title}</h5>
                                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {s.script}
                                </div>
                                <button 
                                    onClick={() => copyToClipboard(s.script, s.title)}
                                    className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    <Copy size={14} /> Copy This Script
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* DAILY TASKS TAB */}
        {activeTab === 'mission' && (
          <div className="animate-fade-in py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden">
                    <h3 className="p-5 border-b border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-400">Tactical Tasks</h3>
                    {dailyTasks.map((task) => (
                    <button key={task.id} onClick={() => toggleTask(task.id)} className={`w-full flex items-center gap-4 p-5 border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-colors ${completedTasks.has(task.id) ? 'bg-green-50/50' : ''}`}>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${completedTasks.has(task.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                            {completedTasks.has(task.id) && <CheckCircle2 size={14} />}
                        </div>
                        <span className={`text-sm font-bold text-left ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                            {task.label}
                            {task.highPriority && !completedTasks.has(task.id) && <span className="ml-2 text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded">URGENT</span>}
                        </span>
                    </button>
                    ))}
                </div>
                <div className="bg-primary-50/50 dark:bg-primary-900/10 p-8 rounded-[2rem] border-2 border-dashed border-primary-200 dark:border-primary-800 flex flex-col justify-center items-center text-center">
                    <Quote className="text-primary-600 mb-4 opacity-30" />
                    <p className="text-lg font-black text-slate-800 dark:text-white leading-tight mb-4">
                        "Close the day before the day closes you."
                    </p>
                    <button onClick={() => setActiveTab('video')} className="px-6 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        Open Teleprompter <PlayCircle size={14} />
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* CV TAB */}
        {activeTab === 'cv' && (
            <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center">
                    <h4 className="text-xl font-black uppercase">Real Estate Sales CV</h4>
                    <button onClick={() => copyToClipboard(realEstateCV, "CV")} className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-black uppercase flex items-center gap-2">
                        <Copy size={14} /> Copy CV
                    </button>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed">
                    {realEstateCV}
                </div>
            </div>
        )}

        {/* SNIPER TAB */}
        {activeTab === 'sniper' && (
           <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-slate-200 dark:border-slate-700 flex flex-col justify-between h-full">
                   <div>
                       <h5 className="text-xs font-black uppercase text-indigo-500 tracking-widest mb-1">Acquisitions Cover Letter</h5>
                       <p className="text-[10px] text-slate-500 font-bold mb-4">Optimized for Price Real Estate.</p>
                       <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-[11px] text-slate-600 dark:text-slate-400 italic mb-6 border border-slate-100 dark:border-slate-800">
                           "I am applying for the Acquisitions VA role because I personally transformed a distressed 2-room home into a 12-unit rental system. I understand property expansion and utility debt liquidation firsthand..."
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("I am applying for the Acquisitions VA role because I personally transformed a distressed 2-room home into a 12-unit rental system. I understand property expansion and utility debt liquidation firsthand. My background at Disney Cruise Line gives me the international professional polish to handle your US-based homeowners.", "Email Template")} className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                       <Copy size={16} /> Copy Email
                   </button>
                </div>
           </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
