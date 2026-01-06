
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Smartphone, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText } from 'lucide-react';

interface FounderRoadmapProps {
  whopUrl: string;
}

const dailyTasks = [
  { id: 'hotsourced-apply', label: 'Apply to Hotsourced (Founder Associate Role)', highPriority: true },
  { id: 'college-mission', label: 'Monday College Mission (2 Locations)', highPriority: true },
  { id: 'demo-video', label: 'Record Screen Demo + Background Music', highPriority: true },
  { id: 'whop-post-1', label: 'Publish First Whop Post (DONE! 🤙🏿)', initialDone: true },
  { id: 'remote-job-sync', label: 'Verify PayPal Payouts', highPriority: true },
];

const jobSniperTemplates = [
  {
    id: 'hotsourced-cover',
    title: "Hotsourced Cover Letter",
    description: "Tailored for the Founder's Associate role (Systems over Chaos).",
    text: `Dear [Hiring Manager/Founder Name],

I am writing to apply for the Founder’s Commercial Associate role. I noticed your core objective is to "buy back" the CEO’s time—a mission that perfectly aligns with my recent work.

As a founder myself, I recently achieved a 100% grade in the Google 'Maximize Productivity with AI' certification. I didn't just study the theory; I applied it to build CaterPro AI—a full-stack platform that automates the "chaos" of culinary administration into a structured system for over 100 chefs.

I specialize in "Systems over Chaos." Whether it's managing complex stakeholder communications, optimizing operational deployment, or conducting international market research, my approach is always technologically proficient and solution-oriented. I don't just manage a calendar; I build the systems that ensure the calendar works for you.

I am ready to bring this bias-toward-action and my background in AI-driven efficiency to help hotsourced scale internationally.

Best regards,
Tumi`
  },
  {
    id: 'linkedin-hook',
    title: "LinkedIn DM Hook",
    description: "High-curiosity intro to send to the Founder directly.",
    text: "Hi [Name], I just saw the Founder’s Commercial Associate role. I recently built an AI system (CaterPro AI) specifically to 'buy back time' for culinary professionals, achieving a 100% grade in Google’s AI Productivity course along the way. I’d love to show you how I can apply that same 'Systems over Chaos' mindset to help you scale hotsourced. Do you have 5 minutes for a quick sync?"
  }
];

const updatedCV = `TUMELO HANNES SEROKA
+27 679 461 487 | turoka15@gmail.com | melotwo1@icloud.com
Mokopane, Limpopo, South Africa (Remote Ready)

PROFESSIONAL SUMMARY
Culinary Systems Architect & Founder with 15+ years of international operational expertise and a 100% proficiency rating in Advanced AI Productivity (Google Certified). Specialist in "Systems over Chaos"—leveraging LLMs and automation to buy back time for leadership and optimize commercial workflows. Proven track record in high-stakes environments (Disney Cruise Line) and as a tech-forward entrepreneur (CaterPro AI). Expert in international market research, cross-border logistics, and strategic stakeholder management.

CORE COMPETENCIES
• Strategic AI Automation (Gemini/GPT-4o)
• Founder Mindset & Commercial Strategy
• International Operational Logistics
• "Systems over Chaos" Workflow Design
• Executive Support & Time Management
• High-Intent Market Research

PROFESSIONAL EXPERIENCE

FOUNDER & SYSTEMS ARCHITECT | CaterPro AI
South Africa | Dec 2024 – Present
• Engineered a full-stack AI catering assistant using Google Gemini API to automate food costing, menu architecture, and marketing for culinary professionals.
• Successfully built a "buy back time" system that reduces administrative overhead by 80% for users.
• Managed the entire commercial lifecycle: product development, GitHub/Netlify deployment, and community growth via Whop and Facebook.

PRIVATE CHEF & OPERATIONS LEAD | Thabo Mashishi
South Africa | June 2024 – Present
• Orchestrate high-end culinary experiences while managing full-cycle procurement and vendor relations.
• Developed custom digital systems for inventory tracking and client communication to ensure 0% operational friction.

CHEF / OPERATIONS | Disney Cruise Line
International | Feb 2011 – July 2015
• Operated within high-volume, international culinary environments requiring extreme attention to detail and adherence to global safety/health standards.
• Thrived in a fast-paced, 24/7 setting, managing multi-cultural stakeholder expectations and executing complex logistics.
• Selected for cross-functional training in front-of-house service, demonstrating versatile commercial English and professional communication skills.

CHEF | Capricorn High School
South Africa | July 2016 – Dec 2021
• Managed kitchen inventory and staff for a high-volume student body.
• Streamlined procurement processes and food cost controls to improve institutional operational efficiency.

EDUCATION & CERTIFICATIONS

• CERTIFICATE: Maximize Productivity with AI Tools (100% Final Grade) | Google | 2024
• DIPLOMA: Culinary Arts | Prue Leith College of Food and Wine | 2007
• GRADE 12 (Matric): Hospitality Specialization | Transvalia Skool | 2005

TECHNICAL SKILLS
• AI/Tech: LLM Prompt Engineering, Gemini API Integration, GitHub/Deployment, UI/UX Design (React/Tailwind).
• Commercial: Market Research, Budgeting, Logistics, CRM Management (Klaviyo), Multi-currency Costing.
• Languages: English (Fluent), Sepedi (Native), Afrikaans (Fluent), Spanish (Basic).

ADDITIONAL INFORMATION
• Driver’s License: Code 10 | Willing to Travel | Tech-Equipped Remote Workspace.
• Declaration: I, Tumelo Hannes Seroka, declare that the above information is correct. I am a solution-oriented professional with a strong bias toward action.`;

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'sniper' | 'cv' | 'marketing'>('growth');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['whop-post-1']));

  const toggleTask = (taskId: string) => {
    const newTasks = new Set(completedTasks);
    if (newTasks.has(taskId)) newTasks.delete(taskId);
    else newTasks.add(taskId);
    setCompletedTasks(newTasks);
  };

  const copyToClipboard = (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      alert(`${label} copied! Now paste this into your application or document.`);
  };

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <div className="p-8 bg-slate-950 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-emerald-500 text-[10px] font-black uppercase tracking-widest text-white animate-pulse">2026 Ready</div>
            </div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" /> Founder Control
            </h2>
          </div>
          
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}>
                <Trophy size={14} /> Mission
            </button>
            <button onClick={() => setActiveTab('cv')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'cv' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500'}`}>
                <FileUser size={14} /> CV Architect
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
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Strategic Priority List</h3>
                <span className="text-[10px] font-bold text-slate-400 italic">Target: Hotsourced Expansion</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
                    {dailyTasks.map((task) => (
                    <button key={task.id} onClick={() => toggleTask(task.id)} className={`w-full flex items-center gap-4 p-5 border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-colors ${completedTasks.has(task.id) ? 'bg-green-50/50' : ''}`}>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${completedTasks.has(task.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                            {completedTasks.has(task.id) && <CheckCircle2 size={14} />}
                        </div>
                        <span className={`text-sm font-bold text-left ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{task.label}</span>
                    </button>
                    ))}
                </div>
                <div className="bg-primary-50/50 dark:bg-primary-900/10 p-8 rounded-[2rem] border-2 border-dashed border-primary-200 dark:border-primary-800 relative">
                    <Target className="text-primary-600 mb-4" />
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                        "Tumi, the Hotsourced role is waiting. Your CV is ready in the next tab. Copy it and land that interview. You're the perfect fit. 🎯"
                    </p>
                    <div className="mt-8 flex gap-2">
                        <button onClick={() => setActiveTab('cv')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Open CV Architect</button>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'cv' && (
            <div className="animate-fade-in space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-amber-500 rounded-3xl text-white shadow-xl shadow-amber-500/20"><FileUser size={32} /></div>
                        <div>
                            <h4 className="text-xl font-black uppercase tracking-tight">Founder's Commercial CV</h4>
                            <p className="text-sm text-slate-500 font-medium">Optimized for Remote Associate Roles & Founders.</p>
                        </div>
                    </div>
                    <button onClick={() => copyToClipboard(updatedCV, "CV Content")} className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2">
                        <Copy size={16} /> Copy Full CV Text
                    </button>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-700 max-h-[500px] overflow-y-auto custom-scrollbar">
                    <pre className="whitespace-pre-wrap font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {updatedCV}
                    </pre>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <BrainCircuit size={18} className="text-blue-500" />
                    <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">
                        Strategy: We positioned your Disney experience as "High-Volume International Operations" to match their global expansion goal.
                    </p>
                </div>
            </div>
        )}

        {activeTab === 'sniper' && (
           <div className="animate-fade-in space-y-8 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                      <div className="p-4 bg-primary-600 rounded-3xl text-white shadow-xl shadow-primary-500/20"><BrainCircuit size={32} /></div>
                      <div>
                          <h4 className="text-xl font-black uppercase tracking-tight">Outcome-Focused Sniper</h4>
                          <p className="text-sm text-slate-500 font-medium">Tailored for the Hotsourced Founder's Associate role.</p>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobSniperTemplates.map((template, i) => (
                    <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500/50 transition-all flex flex-col justify-between group">
                       <div>
                           <div className="flex items-center gap-2 mb-3">
                               <h5 className="text-xs font-black uppercase text-primary-500 tracking-widest">{template.title}</h5>
                           </div>
                           <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-4">{template.description}</p>
                           <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-[10px] text-slate-600 dark:text-slate-400 italic mb-6 leading-relaxed border border-slate-100 dark:border-slate-800">
                               "{template.text.substring(0, 80)}..."
                           </div>
                       </div>
                       <button onClick={() => copyToClipboard(template.text, template.title)} className="flex items-center justify-center gap-2 w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                           <Copy size={14} /> Copy Script
                       </button>
                    </div>
                  ))}
              </div>
           </div>
        )}

        {activeTab === 'marketing' && (
            <div className="animate-fade-in py-16 text-center max-w-lg mx-auto">
                <Search size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-6" />
                <h4 className="text-xl font-black uppercase mb-2">Connect Klaviyo to Unlock</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Automated LinkedIn engagement and CRM tracking for your remote job hunting missions. Coming in the v1.2 Build.
                </p>
                <button onClick={() => setActiveTab('growth')} className="mt-8 px-8 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest">Back to Mission</button>
            </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
