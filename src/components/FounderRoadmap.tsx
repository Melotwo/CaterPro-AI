
import React, { useState, useEffect } from 'react';
import { Calendar, GraduationCap, Layout, BookOpen, Clock, CheckCircle2, Zap, Rocket, Pin, Instagram, Briefcase, Plus, Target, Timer, TrendingUp, ChevronRight } from 'lucide-react';

const FounderRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'growth' | 'tools'>('blueprint');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (taskId: string) => {
    const newTasks = new Set(completedTasks);
    if (newTasks.has(taskId)) newTasks.delete(taskId);
    else newTasks.add(taskId);
    setCompletedTasks(newTasks);
  };

  const schedule = [
    { id: 'build', time: 'Deep Work (3h)', task: 'Develop & Test New Cuisines', icon: ChefHat, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'learn', time: 'Growth (3h)', task: 'Google AI Essentials Course', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'post', time: 'Marketing (3h)', task: 'Schedule Pinterest & Reels', icon: Pin, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  const dailyTasks = [
    { id: 'pin1', label: '1x "Inspiration" Pin (Menu Idea)', platform: 'pinterest' },
    { id: 'pin2', label: '1x "How-To" Pin (Kitchen Tip)', platform: 'pinterest' },
    { id: 'reel', label: '1x Behind-the-scenes Reel', platform: 'instagram' },
    { id: 'reply', label: 'Reply to 5 comments in Chef Groups', platform: 'community' },
  ];

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header Section */}
      <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-primary-500 text-[10px] font-black uppercase tracking-widest">Founder Portal</div>
                <div className="flex items-center gap-1 text-slate-400 text-xs"><Clock size={12} /> Last active: Today</div>
            </div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" /> Melotwo's Roadmap
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-md">Your command center for balancing kitchen work, Google certifications, and viral marketing.</p>
          </div>
          
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button onClick={() => setActiveTab('blueprint')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'blueprint' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Calendar size={14} /> Schedule
            </button>
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <GraduationCap size={14} /> Learning
            </button>
            <button onClick={() => setActiveTab('tools')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'tools' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Layout size={14} /> Tools
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'blueprint' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* The 3-3-3 Schedule */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Target size={16} /> Daily 3-3-3 Blueprint
                </h3>
                <span className="text-[10px] font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">ADHD Friendly</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {schedule.map((item) => (
                  <div key={item.id} className={`p-5 rounded-2xl border-2 border-transparent transition-all hover:scale-105 shadow-sm ${item.bg}`}>
                    <item.icon className={`w-6 h-6 mb-3 ${item.color}`} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.time}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.task}</p>
                  </div>
                ))}
              </div>

              {/* Weekly Goal Progress */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <TrendingUp size={18} className="text-primary-500" /> Current Momentum
                </h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Weekly Content Goal (Pins/Reels)</span>
                        <span className="font-bold">4 / 15</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 w-[26%] transition-all duration-500"></div>
                    </div>
                </div>
              </div>
            </div>

            {/* Daily Posting Checklist */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Pin size={16} /> Today's Posting Queue
              </h3>
              <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                {dailyTasks.map((task) => (
                  <button 
                    key={task.id} 
                    onClick={() => toggleTask(task.id)}
                    className={`w-full flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-700 transition-colors text-left group ${completedTasks.has(task.id) ? 'bg-slate-50 dark:bg-slate-900/50' : 'hover:bg-slate-50 dark:hover:bg-slate-900/30'}`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${completedTasks.has(task.id) ? 'bg-primary-500 border-primary-500' : 'border-slate-300'}`}>
                      {completedTasks.has(task.id) && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                      {task.label}
                    </span>
                    <ChevronRight size={14} className="ml-auto text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
                    <button className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:underline">
                        <Plus size={14} /> Add Custom Task
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="space-y-10 animate-fade-in max-w-2xl mx-auto py-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Google AI Essentials</h3>
                <p className="text-slate-500 text-sm mt-1">Foundational certification for the new age of business.</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Progress Tracker</span>
                    <span className="text-sm font-black text-blue-600">15% Complete</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-full w-[15%] transition-all duration-1000"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Up Next</p>
                        <h4 className="font-bold text-sm leading-tight">Module 2: Maximizing Productivity with AI</h4>
                    </div>
                    <a href="https://grow.google/ai-essentials/" target="_blank" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95">
                        Resume Learning
                    </a>
                </div>
            </div>

            <div className="text-center">
                <p className="text-xs text-slate-500 flex items-center justify-center gap-1 italic">
                    <BookOpen size={12} /> Pro-tip: Sync your course notes with NotebookLM for faster studying.
                </p>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
             <div className="group p-8 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500/30 transition-all hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl transition-transform group-hover:rotate-6"><Layout size={24} className="text-blue-500" /></div>
                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white">Notion</h4>
                        <p className="text-xs text-slate-500 font-medium">The Asset Library</p>
                    </div>
                </div>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <div className="mt-1"><CheckCircle2 size={14} className="text-blue-500" /></div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Save your favorite <strong>AI-generated recipes</strong> and pricing models.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1"><CheckCircle2 size={14} className="text-blue-500" /></div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Track <strong>SOPs</strong> for your kitchen staff to follow.</p>
                    </li>
                </ul>
             </div>
             <div className="group p-8 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-purple-500/30 transition-all hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-2xl transition-transform group-hover:-rotate-6"><BookOpen size={24} className="text-purple-500" /></div>
                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white">NotebookLM</h4>
                        <p className="text-xs text-slate-500 font-medium">The Research Brain</p>
                    </div>
                </div>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <div className="mt-1"><CheckCircle2 size={14} className="text-purple-500" /></div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Upload <strong>Catering Manuals</strong> to create an instant "Ask the Expert" tool.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1"><CheckCircle2 size={14} className="text-purple-500" /></div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Turn your business plan into a <strong>Study Podcast</strong> to listen while cooking.</p>
                    </li>
                </ul>
             </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;

import { ChefHat, Megaphone } from 'lucide-react';
