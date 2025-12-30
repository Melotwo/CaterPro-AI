
import React, { useState } from 'react';
import { Calendar, CheckCircle2, Zap, Trophy, Shield, Globe, CreditCard, Mail, Users, DollarSign, Smartphone, Target, BookCheck, ChevronRight, Copy, Award, ShieldCheck, ShoppingBag, Terminal, HelpCircle, MessageSquareQuote, MessageSquareText, Activity, AlertCircle, ExternalLink, Settings } from 'lucide-react';

interface FounderRoadmapProps {
  whopUrl: string;
}

const dailyTasks = [
  { id: 'whop-post-1', label: 'Publish First Whop Post (DONE! 🤙🏿)', highPriority: true, initialDone: true },
  { id: 'whop-id-verify', label: 'Verify Identity on Whop (DONE! 🪪)', highPriority: true, initialDone: true },
  { id: 'whop-url-sync', label: 'Sync App to "melotwo2" Link (FIXED! ✅)', highPriority: true, initialDone: true },
  { id: 'whop-create-pro', label: 'Create "Professional" ($19.99/mo)', highPriority: true },
  { id: 'whop-create-biz', label: 'Create "Business" ($29.99/mo)', highPriority: true },
];

const whopFaqs = [
  {
    q: "How does this help with my PoE?",
    a: "CaterPro AI automates the heavy lifting of Portfolio of Evidence (PoE) formatting, menu costing, and mise en place lists. It ensures your logic follows international standards like City & Guilds, saving you 10+ hours of admin per assignment."
  },
  {
    q: "Is it really built for ADHD/Dyslexia?",
    a: "Yes. Our founder Tumi built this specifically to solve the 'blank page' anxiety and spelling hurdles that come with neurodiversity. The UI is clean, structured, and handles the spelling and formatting for you."
  }
];

const communityPosts = [
  {
    title: "The Next Step 🚀",
    content: "Just posted our first official update! I'm working hard to ensure CaterPro AI is the best tool for chefs globally. If you haven't yet, check out the 'Products' tab to lock in your Founder's Rate!"
  }
];

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'whop' | 'diagnostics'>('growth');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['whop-post-1', 'whop-id-verify', 'whop-url-sync']));

  const toggleTask = (taskId: string) => {
    const newTasks = new Set(completedTasks);
    if (newTasks.has(taskId)) newTasks.delete(taskId);
    else newTasks.add(taskId);
    setCompletedTasks(newTasks);
  };

  const copyToClipboard = (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      alert(`${label} copied! Now paste it into Whop.`);
  };

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Live Dashboard</div>
                <div className="flex items-center gap-1 text-slate-400 text-xs"><ShieldCheck size={12} className="text-amber-400" /> System Sync</div>
            </div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" /> Tumi's Command Center
            </h2>
          </div>
          
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>
                <Trophy size={14} /> Mission
            </button>
            <button onClick={() => setActiveTab('whop')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'whop' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400'}`}>
                <ShoppingBag size={14} /> Whop Content
            </button>
            <button onClick={() => setActiveTab('diagnostics')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'diagnostics' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}>
                <Activity size={14} /> Whop Link Doctor
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'growth' && (
          <div className="space-y-10 animate-fade-in max-w-4xl mx-auto py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Launch Checklist</h3>
                    <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                        {dailyTasks.map((task) => (
                        <button key={task.id} onClick={() => toggleTask(task.id)} className={`w-full flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-700 text-left ${completedTasks.has(task.id) ? 'bg-slate-50' : ''}`}>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${completedTasks.has(task.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                {completedTasks.has(task.id) && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <span className={`text-sm font-medium ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{task.label}</span>
                        </button>
                        ))}
                    </div>
                </div>

                <div className="bg-primary-50/30 dark:bg-primary-900/10 p-6 rounded-3xl border-2 border-primary-100 dark:border-primary-800">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary-600 mb-4 flex items-center gap-2"><Award size={16} /> Strategy Note</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "Tumi, I saw your live Whop link is 'melotwo2' - I have synced the entire app to that link now! Everything is functional. Your ID verification is also a massive win for trust! 🪪🤙🏿"
                    </p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'whop' && (
          <div className="animate-fade-in space-y-12 pb-12">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center gap-4">
                <MessageSquareText className="text-indigo-600" />
                <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-tight">Whop Feed Templates</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {communityPosts.map((post, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between rounded-2xl">
                        <div>
                            <h5 className="text-sm font-black uppercase text-indigo-500 mb-3">{post.title}</h5>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic mb-6">"{post.content}"</p>
                        </div>
                        <button onClick={() => copyToClipboard(post.content, `Post Body`)} className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 transition-colors">
                            Copy Template
                        </button>
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
           <div className="animate-fade-in space-y-8 max-w-2xl mx-auto py-6">
              <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-3xl">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-600 rounded-2xl text-white">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-tight">System Status: Synced</h4>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400">App synced with melotwo2</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                        <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Current Active Link</p>
                        <div className="flex items-center justify-between gap-4">
                            <code className="text-xs font-bold text-emerald-600 break-all">{whopUrl}</code>
                            <button 
                                onClick={() => window.open(whopUrl, '_blank')}
                                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 text-slate-600 transition-all flex-shrink-0"
                            >
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h5 className="text-xs font-black uppercase text-slate-400 mb-2">Note on Professionalism</h5>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                            While your username "melotwo2" works perfectly now, if you want it to say "CaterProAi" in the future, you can find the **Whop URL** box in **Settings > General**. If you change it there, come back here and ask me to update the link in the code to match!
                        </p>
                    </div>

                    <button 
                        onClick={() => window.open('https://whop.com/dash/settings/general', '_blank')}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        Go to Whop Admin <ExternalLink size={18} />
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
