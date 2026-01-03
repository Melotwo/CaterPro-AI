
import React, { useState } from 'react';
import { Calendar, CheckCircle2, Zap, Trophy, Shield, Globe, CreditCard, Mail, Users, DollarSign, Smartphone, Target, BookCheck, ChevronRight, Copy, Award, ShieldCheck, ShoppingBag, Terminal, HelpCircle, MessageSquareQuote, MessageSquareText, Activity, AlertCircle, ExternalLink, Settings, Wallet, Video, Linkedin, MessageSquarePlus, Sparkle, Facebook, ExternalLink as LinkIcon } from 'lucide-react';

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

const fbTemplates = [
  {
    title: "The 'College Dean' Intro",
    text: "I'm Tumi, I'm here to speak with the Dean regarding automating the Portfolio of Evidence paperwork for your culinary students."
  }
];

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl }) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'whop' | 'marketing'>('growth');
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
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-amber-500 text-[10px] font-black uppercase tracking-widest animate-pulse text-slate-900">2026 Mission Active</div>
            </div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" /> Tumi's Dashboard
            </h2>
          </div>
          
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>
                <Trophy size={14} /> Mission
            </button>
            <button onClick={() => setActiveTab('marketing')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'marketing' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400'}`}>
                <Smartphone size={14} /> Monday Prep
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'growth' && (
          <div className="space-y-10 animate-fade-in max-w-4xl mx-auto py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Launch Prep 2026</h3>
                    <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                        {dailyTasks.map((task) => (
                        <div key={task.id} className={`w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 text-left ${completedTasks.has(task.id) ? 'bg-slate-50' : ''}`}>
                            <button onClick={() => toggleTask(task.id)} className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${completedTasks.has(task.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                    {completedTasks.has(task.id) && <CheckCircle2 size={12} className="text-white" />}
                                </div>
                                <span className={`text-sm font-medium ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{task.label}</span>
                            </button>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="bg-amber-50/30 dark:bg-amber-900/10 p-6 rounded-3xl border-2 border-amber-100 dark:border-amber-800">
                    <h3 className="text-sm font-black uppercase tracking-widest text-amber-600 mb-4 flex items-center gap-2"><Target size={16} /> Strategy Note</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "Tumi, ignore the YouTube analytics noise. Monday is your day of power. Getting those college emails is direct sales. One 'Yes' from a Dean changes everything. Keep your eyes on the prize. 🤙🏿"
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
                          <Users size={24} />
                      </div>
                      <h4 className="font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight text-sm">Monday Visit Script</h4>
                   </div>
                   <div className="space-y-3">
                      {fbTemplates.map((template, i) => (
                        <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-800">
                           <h5 className="text-[10px] font-black uppercase text-blue-500 mb-2">{template.title}</h5>
                           <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3 italic">"{template.text}"</p>
                           <button onClick={() => copyToClipboard(template.text, template.title)} className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-black text-[9px] uppercase">Copy Pitch</button>
                        </div>
                      ))}
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
