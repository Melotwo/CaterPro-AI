
import React, { useState } from 'react';
import { Calendar, GraduationCap, Layout, BookOpen, Clock, CheckCircle2, Zap, UserRound, Sparkles, TrendingUp, ChevronRight, BookCheck, Target, Anchor, Utensils, Copy, Info } from 'lucide-react';

const dailyTasks = [
  { id: 'notebook', label: 'NotebookLM Vision Features' },
  { id: 'identity-doc', label: 'Career Identity Statement' },
  { id: 'disney-milestone', label: 'Disney Cruise Line Milestone' },
  { id: 'marketing-module', label: 'Complete Digital Marketing Module 2' },
  { id: 'proposal-demo', label: 'Record Catering Proposal Demo' },
];

const FounderRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'growth' | 'vault'>('growth');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['notebook', 'identity-doc', 'disney-milestone']));

  const toggleTask = (taskId: string) => {
    const newTasks = new Set(completedTasks);
    if (newTasks.has(taskId)) newTasks.delete(taskId);
    else newTasks.add(taskId);
    setCompletedTasks(newTasks);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const linkedinHeadline = "Culinary Founder & AI Solutions Architect | 10+ Years Hospitality Expertise | Ex-Disney Cruise Line";
  const linkedinAbout = "I am a Culinary Founder and AI Solutions Architect with over 10 years of experience in the global hospitality industry—from the front-of-house to the high-pressure kitchens of Disney Cruise Line. My greatest strengths are perseverance and creative innovation; I have a unique talent for transforming complex workflows into intuitive, beautiful tools like CaterPro AI. I am passionate about the intersection of culinary arts and technology, and I value honesty, respect, and the efficiency that gives people back their most precious resource: time.";

  const schedule = [
    { id: 'build', time: 'Deep Work', task: 'NotebookLM Vision Features', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 'learn', time: 'Course 2', task: 'Digital Marketing Foundations', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'identity', time: 'Branding', task: 'Finalize Career Identity Doc', icon: UserRound, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-primary-500 text-[10px] font-black uppercase tracking-widest">Digital Marketing Path</div>
                <div className="flex items-center gap-1 text-slate-400 text-xs"><Clock size={12} /> Goal: Brand Clarity</div>
            </div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" /> Melotwo's Roadmap
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-md">10+ Years Culinary Expertise | AI Solutions Architect</p>
          </div>
          
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <GraduationCap size={14} /> Course Tracker
            </button>
            <button onClick={() => setActiveTab('vault')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'vault' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <UserRound size={14} /> Brand Vault
            </button>
            <button onClick={() => setActiveTab('blueprint')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'blueprint' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Calendar size={14} /> Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'growth' && (
          <div className="space-y-10 animate-fade-in max-w-4xl mx-auto py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <TrendingUp size={16} /> Career Milestones
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                            <Anchor className="text-blue-500" size={24} />
                            <div>
                                <h4 className="font-bold text-sm">Disney Cruise Line Expert</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-black">International Standard Training</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                            <Utensils className="text-primary-500" size={24} />
                            <div>
                                <h4 className="font-bold text-sm">10+ Years Kitchen Leadership</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-black">Front-to-Back House Mastery</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-primary-50/30 dark:bg-primary-900/10 p-6 rounded-3xl border-2 border-primary-100 dark:border-primary-800">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary-600 mb-4 flex items-center gap-2">
                        <GraduationCap size={16} /> Course 2 Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-600 dark:text-slate-300">Foundations of Digital Marketing</span>
                            <span className="text-primary-600">Module 1: 25%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 w-1/4"></div>
                        </div>
                        <ul className="text-[11px] space-y-2 mt-4 text-slate-500 font-medium">
                            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500" /> Career Identity Statement drafted</li>
                            <li className="flex items-center gap-2 text-slate-400"><Clock size={12} /> Submit Course 2 Practice Activity</li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="animate-fade-in py-4 max-w-3xl mx-auto space-y-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4 text-primary-600 dark:text-primary-400">
                    <Info size={18} />
                    <p className="text-xs font-bold uppercase tracking-widest">LinkedIn Optimization Guide</p>
                </div>
                
                <div className="space-y-6">
                    {/* Headline Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">1. Your Headline</h4>
                            <button onClick={() => handleCopy(linkedinHeadline, 'Headline')} className="p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-primary-600">
                                <Copy size={14} />
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">Punchy & Keyword-rich. Paste this in the "Headline" box.</p>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-200">
                            {linkedinHeadline}
                        </div>
                    </div>

                    {/* About Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">2. Your "About" Summary</h4>
                            <button onClick={() => handleCopy(linkedinAbout, 'About summary')} className="p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-primary-600">
                                <Copy size={14} />
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">The Story. Paste this in the "About" section on your profile.</p>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm italic leading-relaxed text-slate-600 dark:text-slate-400">
                            {linkedinAbout}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'blueprint' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Target size={16} /> Founder Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {schedule.map((item) => (
                  <div key={item.id} className={`p-5 rounded-2xl border-2 border-transparent transition-all hover:scale-105 shadow-sm ${item.bg}`}>
                    <item.icon className={`w-6 h-6 mb-3 ${item.color}`} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.time}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.task}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <BookCheck size={16} /> Goal Tracking
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
      </div>
    </section>
  );
};

export default FounderRoadmap;
