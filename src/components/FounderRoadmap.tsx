
import React, { useState } from 'react';
import { CheckCircle2, Zap, Trophy, Smartphone, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search } from 'lucide-react';

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
    title: "Resume Application Sniper",
    text: "Act as an expert recruiter. Compare my resume with this Job Description. Identify the top 3 high-impact keywords I am missing and rewrite my summary to perfectly align with their 'Business Intelligence' and 'Automation' requirements in a professional tone. Job Description starts now: "
  },
  {
    title: "Cover Letter 'Hook' Generator",
    text: "Write a short, punchy 3-sentence intro for a remote job application. Mention that I built an AI-automated catering platform for 100+ users. Make me sound efficient and data-driven."
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
      alert(`${label} copied! Paste this into Gemini to finish the job.`);
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
          
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}>
                <Trophy size={14} /> Mission
            </button>
            <button onClick={() => setActiveTab('sniper')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'sniper' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500'}`}>
                <Crosshair size={14} /> Job Sniper
            </button>
            <button onClick={() => setActiveTab('marketing')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'marketing' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500'}`}>
                <Users size={14} /> CRM Tools
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'growth' && (
          <div className="animate-fade-in py-4 max-w-3xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Monday Priority List</h3>
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
                <div className="bg-amber-50/50 dark:bg-amber-900/10 p-8 rounded-[2rem] border-2 border-dashed border-amber-200 dark:border-amber-800">
                    <Target className="text-amber-600 mb-4" />
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                        "Tumi, direct sales at the colleges is the only mission. One Dean saying 'Yes' is worth 100 Facebook likes. Focus there first. 🤙🏿"
                    </p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'sniper' && (
           <div className="animate-fade-in space-y-8 max-w-3xl">
              <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary-600 rounded-3xl text-white shadow-xl shadow-primary-500/20"><BrainCircuit size={32} /></div>
                  <div>
                      <h4 className="text-xl font-black uppercase">Outcome-Focused Sniper</h4>
                      <p className="text-sm text-slate-500">Fast AI prompts to secure remote jobs while you build CaterPro.</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                  {jobSniperTemplates.map((template, i) => (
                    <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-primary-500/50 transition-all">
                       <h5 className="text-xs font-black uppercase text-primary-500 tracking-widest mb-2">{template.title}</h5>
                       <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">"{template.text}"</p>
                       <button onClick={() => copyToClipboard(template.text, template.title)} className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                           <Copy size={14} /> Copy AI Prompt
                       </button>
                    </div>
                  ))}
              </div>
           </div>
        )}

        {activeTab === 'marketing' && (
            <div className="animate-fade-in py-10 text-center">
                <Search size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Connect CRM to Unlock</p>
            </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
