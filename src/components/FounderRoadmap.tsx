
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Smartphone, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, Linkedin, Briefcase, ExternalLink } from 'lucide-react';

interface FounderRoadmapProps {
  whopUrl: string;
}

const dailyTasks = [
  { id: 'college-mission', label: 'Monday College Mission (2 Locations)', highPriority: true },
  { id: 'demo-video', label: 'Record Screen Demo + Background Music', highPriority: true },
  { id: 'whop-post-1', label: 'Publish First Whop Post (DONE! 🤙🏿)', initialDone: true },
  { id: 'fb-sniper-mission', label: 'Comment Sniper Mission 🎯' },
  { id: 'remote-job-sync', label: 'Apply for 1 AI Operations Remote Job' },
  { id: 'whop-paypal', label: 'Verify PayPal Payouts', highPriority: true },
];

const jobSniperTemplates = [
  {
    title: "The Resume Context Sniper",
    description: "Matches your resume to a job description with high-impact keywords.",
    text: "Act as an expert technical recruiter. Compare my current resume details with this specific Job Description. Identify the top 5 'High Intent' keywords I am missing and rewrite my professional summary to highlight my experience building AI catering automation (CaterPro AI) to match their requirements perfectly. Job Description: [PASTE HERE]"
  },
  {
    title: "Cover Letter 'Hook' Sniper",
    description: "Creates a 3-sentence high-curiosity intro for LinkedIn DMs.",
    text: "Write a punchy 3-sentence introduction to a hiring manager for an AI Operations role. Mention that I built a full-stack AI catering assistant that handles automated costing for 100+ chefs. Goal: Show that I don't just use AI, I build systems with it."
  }
];

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'sniper' | 'marketing'>('growth');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['whop-post-1']));

  const toggleTask = (taskId: string) => {
    const newTasks = new Set(completedTasks);
    if (newTasks.has(taskId)) newTasks.delete(taskId);
    else newTasks.add(taskId);
    setCompletedTasks(newTasks);
  };

  const copyToClipboard = (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      alert(`${label} copied! Now paste this into Gemini or ChatGPT to sniper the job.`);
  };

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <div className="p-8 bg-slate-950 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-amber-500 text-[10px] font-black uppercase tracking-widest text-slate-900">Mission Active</div>
            </div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" /> Tumi's Dashboard
            </h2>
          </div>
          
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}>
                <Trophy size={14} /> Mission
            </button>
            <button onClick={() => setActiveTab('sniper')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'sniper' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500'}`}>
                <Crosshair size={14} /> Job Sniper
            </button>
            <button onClick={() => setActiveTab('marketing')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'marketing' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500'}`}>
                <Users size={14} /> CRM Tools
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'growth' && (
          <div className="animate-fade-in py-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Launch Priority List</h3>
                <span className="text-[10px] font-bold text-slate-400 italic">Updated Jan 2026</span>
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
                <div className="bg-amber-50/50 dark:bg-amber-900/10 p-8 rounded-[2rem] border-2 border-dashed border-amber-200 dark:border-amber-800 relative">
                    <Target className="text-amber-600 mb-4" />
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                        "Tumi, the mission is high-level automation. Every LinkedIn job application should mention the systems you built here. It shows you're in the top 1% of AI operators. 🤙🏿"
                    </p>
                    <div className="mt-8 flex gap-2">
                        <button onClick={() => setActiveTab('sniper')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Sniper a Job</button>
                        <a href="https://linkedin.com/jobs" target="_blank" rel="noopener" className="px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1">LinkedIn <ExternalLink size={10} /></a>
                    </div>
                </div>
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
                          <p className="text-sm text-slate-500 font-medium">Fast AI prompts to secure remote jobs while you build CaterPro.</p>
                      </div>
                  </div>
                  <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center gap-2 border border-green-200 dark:border-green-800">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Remote Optimized</span>
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
                           <Copy size={14} /> Copy AI Prompt
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
