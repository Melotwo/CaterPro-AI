
import React, { useState } from 'react';
import { Calendar, CheckCircle2, Zap, Trophy, Shield, Globe, CreditCard, Mail, Users, DollarSign, Smartphone, Target, BookCheck, ChevronRight, Copy, Award, ShieldCheck, ShoppingBag, Terminal, HelpCircle, MessageSquareQuote, MessageSquareText, Activity, AlertCircle, ExternalLink, Settings, Wallet, Video, Linkedin, MessageSquarePlus, Sparkle } from 'lucide-react';

interface FounderRoadmapProps {
  whopUrl: string;
}

const dailyTasks = [
  { id: 'whop-post-1', label: 'Publish First Whop Post (DONE! 🤙🏿)', highPriority: true, initialDone: true },
  { id: 'whop-id-verify', label: 'Verify Identity on Whop (DONE! 🪪)', highPriority: true, initialDone: true },
  { id: 'whop-newyear-vsl', label: 'Record New Year Screen Demo (VSL)', highPriority: true },
  { id: 'whop-post-launch', label: 'Post 2025 Reel (All Platforms)', highPriority: true },
  { id: 'whop-linkedin-greg', label: 'Reply to Greg Provance on LinkedIn', highPriority: true },
  { id: 'whop-paypal', label: 'Connect PayPal for Payouts', highPriority: true },
];

const linkedinTemplates = [
  {
    title: "New Year 'Resolution' Hook",
    text: "Resolution for 2025: Less chaos, more systems. I’m helping chefs automate their paperwork hurdles with CaterPro AI so they can focus on leadership, not spreadsheets."
  },
  {
    title: "The 'Provance' System Reply",
    text: "Spot on! Greg, as you always say, a restaurant without a system is just an expensive hobby. I’m building CaterPro AI to be the 'System' that handles the chaos."
  }
];

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'whop' | 'marketing'>('growth');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['whop-post-1', 'whop-id-verify', 'whop-url-sync']));

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
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse">2025 Launch Mode</div>
                <div className="flex items-center gap-1 text-slate-400 text-xs"><ShieldCheck size={12} className="text-amber-400" /> System Active</div>
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
            <button onClick={() => setActiveTab('marketing')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'marketing' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400'}`}>
                <Sparkle size={14} /> 2025 Marketing
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
                        "Tumi, the New Year launch is perfect. Use the 'New Year 2025' script in the Marketing Lab. It’s designed to push people into action right now while they are motivated. Record your screen while the AI is generating a menu—it’s magic to watch!"
                    </p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'marketing' && (
           <div className="animate-fade-in space-y-8 max-w-4xl mx-auto py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-3xl">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-blue-600 rounded-2xl text-white">
                          <Linkedin size={24} />
                      </div>
                      <div>
                          <h4 className="font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight text-sm">Provance Authority Lab</h4>
                          <p className="text-[10px] text-blue-700 dark:text-blue-400">Authority Templates</p>
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      {linkedinTemplates.map((template, i) => (
                        <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-800">
                           <h5 className="text-[10px] font-black uppercase text-blue-500 mb-2">{template.title}</h5>
                           <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3 italic">"{template.text}"</p>
                           <button 
                             onClick={() => copyToClipboard(template.text, template.title)}
                             className="w-full py-2 bg-blue-50 dark:bg-blue-800/40 text-blue-600 dark:text-blue-300 rounded-lg font-black text-[9px] uppercase tracking-widest"
                           >
                             Copy Template
                           </button>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-6 bg-slate-900 text-white border-2 border-slate-800 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkle size={80} className="text-amber-400" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-amber-500 rounded-2xl text-white">
                            <Video size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-white uppercase tracking-tight text-sm">2025 Launch Hook</h4>
                            <p className="text-[10px] text-slate-400">Neil Patel Style Energy</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[11px] text-slate-300 italic leading-relaxed">
                            "Start 2025 with a system, not chaos. Most chefs fail because they drown in admin. I built CaterPro AI to take that weight off your shoulders."
                        </p>
                        <button 
                            onClick={() => copyToClipboard("Stop being a typist. Start being a Chef again in 2025. Lock in your Founder's rate today.", "2025 Launch Hook")}
                            className="w-full py-3 bg-amber-500 text-white rounded-xl font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2"
                        >
                            Copy 2025 Launch Hook <Copy size={14} />
                        </button>
                    </div>
                </div>
              </div>
           </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
