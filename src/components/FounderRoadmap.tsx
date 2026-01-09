
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Smartphone, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket, Video, Home, TrendingUp } from 'lucide-react';

interface FounderRoadmapProps {
  whopUrl: string;
}

const dailyTasks = [
  { id: 'gattaca-apply', label: 'Close the Deal: Apply to Gattaca Holdings', highPriority: true },
  { id: 'quickstart-apply', label: 'Apply to QuickStart PM', highPriority: false },
  { id: 'video-strategy', label: 'Film Step 1-4 Content Sequence', highPriority: true },
  { id: 'domain-setup', label: 'Secure Business Domain (Neo.space)', highPriority: true },
  { id: 'whop-post-1', label: 'Publish First Whop Post (DONE! 🤙🏿)', initialDone: true },
];

const jobSniperTemplates = [
  {
    id: 'real-estate-closer',
    title: "Gattaca Real Estate Pitch",
    description: "Tailored with your property conversion story.",
    text: `Dear Gattaca Holdings Hiring Team,

I am applying for the Real Estate Sales Closer role because I don't just talk about real estate—I live it.

While working internationally with Disney Cruise Line, I took over a distressed family property in a South African township. It was a 2-room home burdened with debt. Through discipline and strategic planning, I didn't just pay off the debt—I architected and built an additional 10 rooms to create a 12-unit rental system for students and contractors.

I taught myself how to manage tenants, handle commercial logistics, and maximize asset yield. This experience, combined with my high-pressure international operations background, makes me uniquely qualified to handle acquisition conversations with US homeowners. I understand that real estate is about more than just houses; it's about solving problems and securing futures.

I am ready to bring my 'Systems over Chaos' mindset and my proven negotiation skills to your US-aligned shift (3 PM - 2 AM SAST).

Best regards,
Tumi Seroka`
  },
  {
    id: 'quickstart-pitch',
    title: "QuickStart PM Pitch",
    description: "Tailored with PRAISE values.",
    text: `Dear QuickStart Hiring Team... [See CV Tab for Full Profile]`
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
  const [activeTab, setActiveTab] = useState<'growth' | 'sniper' | 'cv'>('growth');
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
            <button onClick={() => setActiveTab('cv')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'cv' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500'}`}>
                <FileUser size={14} /> Closer CV
            </button>
            <button onClick={() => setActiveTab('sniper')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'sniper' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500'}`}>
                <Crosshair size={14} /> Job Sniper
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
                        "Real Estate isn't about property. It's about solving the debt and chaos for the homeowner."
                    </p>
                    <button onClick={() => setActiveTab('sniper')} className="px-6 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        Get the Script <ArrowRight size={14} />
                    </button>
                </div>
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
              {jobSniperTemplates.map((template) => (
                <div key={template.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-slate-200 dark:border-slate-700 flex flex-col justify-between h-full">
                   <div>
                       <h5 className="text-xs font-black uppercase text-primary-500 tracking-widest mb-1">{template.title}</h5>
                       <p className="text-[10px] text-slate-500 font-bold mb-4">{template.description}</p>
                       <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-[11px] text-slate-600 dark:text-slate-400 italic mb-6 border border-slate-100 dark:border-slate-800">
                           "{template.text.substring(0, 150)}..."
                       </div>
                   </div>
                   <button onClick={() => copyToClipboard(template.text, template.title)} className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                       <Copy size={16} /> Copy Script
                   </button>
                </div>
              ))}
           </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
