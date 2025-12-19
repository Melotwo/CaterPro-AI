
import React, { useState, useEffect } from 'react';
import { Calendar, GraduationCap, Layout, BookOpen, Clock, CheckCircle2, Zap, Rocket, Pin, Instagram, Briefcase, Plus, Target, Timer, TrendingUp, ChevronRight, ChefHat, PartyPopper, BookCheck } from 'lucide-react';

const FounderRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'growth' | 'tools'>('growth');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['pin1', 'reel', 'assignment1']));

  const toggleTask = (taskId: string) => {
    const newTasks = new Set(completedTasks);
    if (newTasks.has(taskId)) newTasks.delete(taskId);
    else newTasks.add(taskId);
    setCompletedTasks(newTasks);
  };

  const schedule = [
    { id: 'build', time: 'Deep Work (3h)', task: 'CaterPro AI Dev & Testing', icon: ChefHat, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'learn', time: 'Growth (3h)', task: 'Google Course 2: Productivity', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'post', time: 'Marketing (3h)', task: 'Assignment: AI Content Creation', icon: Pin, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  const dailyTasks = [
    { id: 'assignment1', label: 'Assignment: AI Social Content', platform: 'coursera' },
    { id: 'pin1', label: '1x Pinterest Pin (How-to AI)', platform: 'pinterest' },
    { id: 'reel', label: '1x Instagram Post (My Journey)', platform: 'instagram' },
    { id: 'notebook', label: 'Sync notes to NotebookLM', platform: 'study' },
  ];

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header Section */}
      <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-primary-500 text-[10px] font-black uppercase tracking-widest">Founder Portal</div>
                <div className="flex items-center gap-1 text-slate-400 text-xs"><Clock size={12} /> Active Goal: Course 2 (Productivity)</div>
            </div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" /> Melotwo's Roadmap
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-md">Using Course 2 to optimize your catering admin workflow.</p>
          </div>
          
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button onClick={() => setActiveTab('blueprint')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'blueprint' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Calendar size={14} /> Schedule
            </button>
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <GraduationCap size={14} /> Course Tracker
            </button>
            <button onClick={() => setActiveTab('tools')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'tools' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Layout size={14} /> Stack
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'blueprint' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Target size={16} /> Course 2 Blueprint
                </h3>
                <span className="text-[10px] font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">Module 2 Active</span>
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

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <TrendingUp size={18} className="text-primary-500" /> Mastery Momentum
                </h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Course 2 Completion</span>
                        <span className="font-bold">40%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 w-[40%] transition-all duration-500"></div>
                    </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <BookCheck size={16} /> Assignment Queue
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
              </div>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="space-y-10 animate-fade-in max-w-2xl mx-auto py-6">
            <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <GraduationCap className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 rounded-full p-1.5 shadow-lg border-2 border-white dark:border-slate-900">
                        <Zap size={14} />
                    </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Google AI Essentials</h3>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1 uppercase tracking-widest flex items-center justify-center gap-2">
                   <Clock size={16} /> Course 2 in Progress
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-green-500 shadow-sm opacity-60">
                    <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Course 1</span>
                         <CheckCircle2 size={16} className="text-green-500" />
                    </div>
                    <h4 className="font-bold text-sm">Introduction to AI</h4>
                    <p className="text-xs text-slate-500 mt-1">100% Complete</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-4 border-blue-500 shadow-xl shadow-blue-500/10 scale-105">
                    <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Course 2</span>
                         <Timer size={16} className="text-blue-500 animate-pulse" />
                    </div>
                    <h4 className="font-bold text-sm">Maximize Productivity</h4>
                    <p className="text-xs text-slate-500 mt-1">Currently in Module 2</p>
                    <div className="mt-4 w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[40%]"></div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 italic">"Productivity is about choosing the right AI partner for the right task."</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Active Study Source</p>
                        <h4 className="font-bold text-sm">NotebookLM Integration</h4>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
             <div className="group p-8 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500/30 transition-all hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl transition-transform group-hover:rotate-6 text-blue-500"><Layout size={24} /></div>
                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white">Notion</h4>
                        <p className="text-xs text-slate-500 font-medium">The Asset Library</p>
                    </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Store your recipes and Course 2 insights here.</p>
             </div>
             <div className="group p-8 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-purple-500/30 transition-all hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-2xl transition-transform group-hover:-rotate-6 text-purple-500"><BookOpen size={24} /></div>
                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white">NotebookLM</h4>
                        <p className="text-xs text-slate-500 font-medium">The Study Hub</p>
                    </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Upload notes to generate summaries and study guides instantly.</p>
             </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
