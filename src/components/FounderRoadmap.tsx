
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Smartphone, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle } from 'lucide-react';

interface FounderRoadmapProps {
  whopUrl: string;
}

const dailyTasks = [
  { id: 'video-record', label: 'Record & Send: Price Real Estate Video (90s)', highPriority: true },
  { id: 'video-record-gattaca', label: 'Record & Send: Gattaca Video (2m)', highPriority: true },
  { id: 'domain-setup', label: 'Secure Business Domain (Neo.space)', highPriority: false },
  { id: 'whop-post-1', label: 'Publish First Whop Post (DONE! 🤙🏿)', initialDone: true },
];

const videoScripts = [
  {
    id: 'price-acquisitions',
    title: "Price Real Estate: Acquisitions VA",
    time: "60-90 Seconds",
    script: `Hi there! I’m Tumi Seroka, and I’m applying for the Acquisitions VA role because I don’t just understand real estate—I understand how to pivot a property into an asset.

My background in acquisitions isn’t just theoretical. I personally took a distressed 2-room family property in South Africa that was burdened with debt, negotiated the liquidation of that debt, and architected a plan to expand it into a 12-unit rental system for students and contractors. 

I’ve spent years making "offers" to homeowners and contractors where the stakes were personal. I know how to speak to people in high-stress situations, identify their pain points, and offer a solution that closes the deal.

Combined with my 5-star international communications background with Disney, I have the grit and the professional polish to represent Price Real Estate Investments during the US shift. I’m ready to close for you.`
  },
  {
    id: 'gattaca-closer',
    title: "Gattaca Holdings: Sales Closer",
    time: "2-3 Minutes",
    script: `Hello Gattaca Hiring Team! My name is Tumi Seroka.

What you need in a Sales Closer is someone who can handle "Systems over Chaos." My background is built on that exact foundation. 

For 15 years, I have operated in high-pressure environments—from managing international guest relations for Disney Cruise Line to operating my own residential portfolio. My biggest career win was taking a 2-room residential home with utility debt and scaling it into a 12-unit commercial rental business. 

That required more than just "selling." It required closing negotiations with contractors, managing municipal logistics, and convincing tenants of the value of my system. 

In my next career, I am looking to bring this "Asset Manager" mindset to the US Real Estate market. I want to work with a team like Gattaca that values high-intent scripting and measurable ROI. I am a self-starter who is 100% committed to the 3 PM to 2 AM SAST shift because that is when the best deals are closed in the US.

I’m not looking for a job; I’m looking for a portfolio to grow. Let’s close some deals together.`
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

TECHNICAL SKILLS
• Advanced Prompt Engineering, Real Estate CRM Workflows, Remote Sales Tooling.

Available for immediate placement in the US-Hours Shift.`;

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'sniper' | 'cv' | 'video'>('growth');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['whop-post-1']));

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
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <div className="p-8 bg-slate-950 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Home className="text-primary-500" /> Closing Control
            </h2>
            <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Active Target: Real Estate Acquisitions</p>
          </div>
          
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}>
                <Trophy size={14} /> Mission
            </button>
            <button onClick={() => setActiveTab('video')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'video' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500'}`}>
                <Video size={14} /> Video Studio
            </button>
            <button onClick={() => setActiveTab('cv')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'cv' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500'}`}>
                <FileUser size={14} /> Closer CV
            </button>
            <button onClick={() => setActiveTab('sniper')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'sniper' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500'}`}>
                <Crosshair size={14} /> Email Sniper
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'growth' && (
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
                        "Your voice is your most valuable asset. The video is the close."
                    </p>
                    <button onClick={() => setActiveTab('video')} className="px-6 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        Open Scripts <PlayCircle size={14} />
                    </button>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
            <div className="animate-fade-in space-y-8">
                <div className="flex items-center gap-3 border-b-2 border-slate-100 dark:border-slate-800 pb-4">
                    <Mic2 className="text-indigo-500" />
                    <h3 className="text-xl font-black uppercase">Video Pitch Studio</h3>
                </div>
                <div className="grid grid-cols-1 gap-8">
                    {videoScripts.map((v) => (
                        <div key={v.id} className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-lg font-black text-indigo-600 dark:text-indigo-400">{v.title}</h4>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Time: {v.time}</p>
                                </div>
                                <button onClick={() => copyToClipboard(v.script, v.title)} className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                    <Copy size={16} className="text-slate-400" />
                                </button>
                            </div>
                            <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 text-xl font-medium leading-relaxed text-slate-700 dark:text-slate-200 italic shadow-inner">
                                {v.script}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

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

        {activeTab === 'sniper' && (
           <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-slate-200 dark:border-slate-700 flex flex-col justify-between h-full">
                   <div>
                       <h5 className="text-xs font-black uppercase text-primary-500 tracking-widest mb-1">Acquisitions Pitch</h5>
                       <p className="text-[10px] text-slate-500 font-bold mb-4">For Price Real Estate Investments.</p>
                       <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-[11px] text-slate-600 dark:text-slate-400 italic mb-6 border border-slate-100 dark:border-slate-800">
                           "I am applying for the Acquisitions VA role because I personally transformed a distressed 2-room home into a 12-unit rental system..."
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard("RE-USE AUDIO SCRIPT CONTENT AS EMAIL COVER LETTER", "Email Template")} className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
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
