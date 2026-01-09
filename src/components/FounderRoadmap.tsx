
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Smartphone, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, Quote, ArrowRight, Rocket } from 'lucide-react';

interface FounderRoadmapProps {
  whopUrl: string;
}

const dailyTasks = [
  { id: 'quickstart-apply', label: 'Win the Game: Apply to QuickStart PM', highPriority: true },
  { id: 'hotsourced-apply', label: 'Apply to hotsourced (Founder Associate)', highPriority: false },
  { id: 'domain-setup', label: 'Secure Business Domain (Neo.space)', highPriority: true },
  { id: 'demo-video', label: 'Record 60s Demo showing "Product Roadmap"', highPriority: true },
  { id: 'whop-post-1', label: 'Publish First Whop Post (DONE! 🤙🏿)', initialDone: true },
];

const jobSniperTemplates = [
  {
    id: 'quickstart-pitch',
    title: "QuickStart PM Pitch",
    description: "Tailored with PRAISE values & 'Win the Game' philosophy.",
    text: `Dear QuickStart Hiring Team,

I am applying for the Product Manager role. My philosophy aligns perfectly with yours: I don't just want to 'Stay in the game'—I have spent my career building systems to 'Win' and 'Change' the game.

I am a Product Leader with 15 years of operational experience and a Google-certified 100% proficiency in AI Productivity. I recently architected and launched CaterPro AI—a workforce readiness platform for culinary professionals that automates the 'chaos' of admin into a high-margin product system.

At QuickStart, you value PRAISE (Passion, Respect, Accountability, Innovation, Speed, Execution). My build of CaterPro AI from scratch (Roadmap -> Tech Integration -> Whop Deployment) is a direct demonstration of 'Innovation, Speed, and Execution.' I understand how to manage a product lifecycle because I am currently living it as a founder.

I am ready to bring this 'Systems over Chaos' mindset to help QuickStart redefine the future of IT workforce development.

Best regards,
Tumi Seroka`
  },
  {
    id: 'hotsourced-cover',
    title: "hotsourced Cover Letter",
    description: "Tailored for the Founder Associate role.",
    text: `Dear hotsourced Team,

I am applying for the Founder’s Commercial Associate role because I have spent my career solving exactly what your CEO needs: replacing "chaos with systems."

As an operations specialist with 15 years of international experience (including 4 years scaling high-volume operations with Disney Cruise Line), I thrive in high-stakes environments. Recently, I achieved a 100% grade in Google’s 'Advanced AI Productivity' certification and applied those skills to build CaterPro AI—a full-stack system designed to buy back time for catering professionals.

I don’t just manage tasks; I build the systems that ensure the tasks never become chaos again. I am technologically proficient, bias-toward-action, and ready to help hotsourced scale its international operational footprint.

Best regards,
Tumelo (Tumi) Seroka`
  }
];

const commercialCV = `TUMELO HANNES SEROKA
+27 679 461 487 | turoka15@gmail.com
Mokopane, South Africa (Remote Ready)

PRODUCT LEADER & SYSTEMS ARCHITECT
Specializing in AI Product Roadmaps | Google Certified AI Productivity (100% Grade)

PROFESSIONAL SUMMARY
Entrepreneurial Product Manager with 15+ years of international operational experience. Expert at taking products from "Chaos to Systems." Founder of CaterPro AI, where I personally managed the full product lifecycle: from AI strategy (Gemini API) and roadmap development to commercial deployment and revenue growth. Proven track record in high-volume, high-stakes environments (Disney Cruise Line) where speed and execution are critical.

CORE COMPETENCIES
• Product Strategy: Roadmap Design, Feature Prioritization, Lifecycle Management.
• AI Integration: Advanced LLM Prompt Engineering, Gemini/GPT-4o Deployment.
• Commercial: Margin Optimization, B2B/B2C Sales Funnels, Market Research.
• Leadership: PRAISE-aligned Execution (Passion, Accountability, Innovation, Speed).

KEY EXPERIENCE

FOUNDER & PRODUCT OWNER | CaterPro AI 
South Africa | Dec 2024 – Present
• Visionary/Leader for an AI-powered workforce readiness platform for culinary professionals.
• Executed full product roadmap: integrated Gemini 2.5 API for automated culinary costing and marketing.
• Managed eCommerce deployment via Whop and PayPal, focusing on B2B revenue growth and margin protection.
• Built "Systems over Chaos" workflows that reduced user administrative overhead by 80%.

PRODUCT OPERATIONS | Disney Cruise Line
International | Feb 2011 – July 2015
• Directed high-volume international operations, ensuring product quality and service execution in a 24/7 environment.
• Optimized operational "margins" by managing complex logistics and supply chain workflows across global regions.
• Collaborated across cross-functional teams (hospitality, logistics, safety) to deliver 5-star product experiences.

EDUCATION & CERTIFICATIONS
• CERTIFICATE: Maximize Productivity with AI Tools (100% Final Grade) | Google | 2024
• DIPLOMA: Culinary Arts | Prue Leith College of Food and Wine | 2007

TECHNICAL SKILLS
• Product Management: Agile Roadmapping, KPI Tracking, CRM (Klaviyo).
• AI/Tech: LLM Architecture, GitHub Deployment, React/Tailwind UI.

Available for immediate remote placement as a Product/Systems Leader.`;

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
              <Zap className="text-amber-400 fill-amber-400" /> Founder Control
            </h2>
            <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Target: Financial Independence</p>
          </div>
          
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}>
                <Trophy size={14} /> Mission
            </button>
            <button onClick={() => setActiveTab('cv')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'cv' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500'}`}>
                <FileUser size={14} /> Product CV
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
                        "I don't just 'Stay in the game.' I build systems to 'Win' and 'Change' the game."
                    </p>
                    <button onClick={() => setActiveTab('sniper')} className="px-6 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        Win the Game <Rocket size={14} />
                    </button>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'cv' && (
            <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center">
                    <h4 className="text-xl font-black uppercase">Product Manager CV</h4>
                    <button onClick={() => copyToClipboard(commercialCV, "CV")} className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-black uppercase flex items-center gap-2">
                        <Copy size={14} /> Copy Full CV
                    </button>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed">
                    {commercialCV}
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
