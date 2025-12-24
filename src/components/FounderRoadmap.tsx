
import React, { useState } from 'react';
import { Calendar, GraduationCap, Layout, BookOpen, Clock, CheckCircle2, Zap, UserRound, Sparkles, TrendingUp, ChevronRight, BookCheck, Target, Anchor, Utensils, Copy, Info, Briefcase, Award, Linkedin, Twitter, AlertCircle, Video, Fingerprint, ArrowRight, BarChart3, MousePointer2, Gift } from 'lucide-react';

const dailyTasks = [
  { id: 'module-4-final', label: 'Finish Module 4: Measure Success', highPriority: true },
  { id: 'data-ethics', label: 'Complete Data Ethics Reading', highPriority: false },
  { id: 'exam-prep', label: 'Review Module 1-4 for Final Assessment', highPriority: true },
  { id: 'festive-post', label: 'Post Christmas Eve Founder Update', highPriority: true },
  { id: 'analytics-setup', label: 'Confirm GA4 Tag is firing correctly' },
];

const FounderRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'growth' | 'vault'>('growth');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['notebook']));

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

  const handleScrollToResearch = () => {
    const hub = document.getElementById('research-hub-section');
    if (hub) hub.scrollIntoView({ behavior: 'smooth' });
  };

  const linkedinHeadline = "Culinary Founder & AI Solutions Architect | 10+ Years Hospitality Expertise | Ex-Disney Cruise Line";
  const courseraBio = "Founder of CaterPro AI. 10+ years in hospitality (Disney Cruise Line). Applying AI to solve admin stress for chefs. 100% Grade in Google AI Productivity.";
  const brandStatement = "I bridge the gap between world-class culinary excellence and cutting-edge software engineering. As a chef with ADHD/Dyslexia, my brand is built on radical accessibility: creating tools that remove administrative friction so creators can focus on their craft.";

  const schedule = [
    { id: 'build', time: 'Final Push', task: 'Complete Course 2 Final', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 'learn', time: 'Module 4', task: 'Measuring Performance', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'identity', time: 'Festive', task: 'Holiday Brand Message', icon: Gift, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-amber-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Certification Sprint</div>
                <div className="flex items-center gap-1 text-slate-400 text-xs"><Gift size={12} className="text-red-400" /> Goal: Finish before Christmas</div>
            </div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" /> Tumi's Final Push
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-md">The "Closing Shift" of Google Digital Marketing</p>
          </div>
          
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <GraduationCap size={14} /> Week 4 Status
            </button>
            <button onClick={() => setActiveTab('vault')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'vault' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <UserRound size={14} /> Brand Vault
            </button>
            <button onClick={() => setActiveTab('blueprint')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'blueprint' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Calendar size={14} /> Sprints
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
                        <TrendingUp size={16} /> Measuring Success
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border-2 border-emerald-500">
                            <BarChart3 className="text-emerald-500" size={24} />
                            <div>
                                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-100 uppercase">Module 4 KPIs</h4>
                                <p className="text-[10px] text-emerald-600 uppercase font-black">Performance Marketing Mastered</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleScrollToResearch}
                            className="w-full text-left flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border-2 border-red-500 shadow-lg shadow-red-500/10 transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Gift className="text-red-500 animate-bounce" size={24} />
                            <div>
                                <h4 className="font-black text-sm text-red-900 dark:text-red-100 flex items-center gap-2">
                                    Christmas Eve Goal <ArrowRight size={14} />
                                </h4>
                                <p className="text-[10px] text-red-600 uppercase font-black">Certification unlocked tonight!</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="bg-primary-50/30 dark:bg-primary-900/10 p-6 rounded-3xl border-2 border-primary-100 dark:border-primary-800">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary-600 mb-4 flex items-center gap-2">
                        <GraduationCap size={16} /> Course 2 Final Progress
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-600 dark:text-slate-300">Foundations of Digital Marketing</span>
                            <span className="text-primary-600">Overall: 85%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 w-[85%] transition-all duration-1000"></div>
                        </div>
                        <ul className="text-[11px] space-y-2 mt-4 text-slate-500 font-medium">
                            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500" /> Module 3: Social & Email (100%)</li>
                            <li className="flex items-center gap-2 text-primary-600 font-black"><Clock size={12} className="animate-spin" /> Module 4: Measure Success (In Progress)</li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="animate-fade-in py-4 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700 h-fit space-y-6">
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                    <Linkedin size={18} />
                    <p className="text-xs font-bold uppercase tracking-widest">LinkedIn Optimization</p>
                </div>
                
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Headline</h4>
                        <button onClick={() => handleCopy(linkedinHeadline, 'Headline')} className="p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-primary-600">
                            <Copy size={14} />
                        </button>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                        {linkedinHeadline}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <Fingerprint size={16} className="text-primary-500" /> Brand Identity Statement
                        </h4>
                        <button onClick={() => handleCopy(brandStatement, 'Brand Statement')} className="p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-primary-600">
                            <Copy size={14} />
                        </button>
                    </div>
                    <div className="p-4 bg-primary-600 text-white rounded-xl text-xs leading-relaxed italic font-medium">
                        "{brandStatement}"
                    </div>
                </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-3xl border-2 border-blue-100 dark:border-blue-800 h-fit">
                <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                    <Award size={18} />
                    <p className="text-xs font-bold uppercase tracking-widest">Coursera Profile Sync</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Bio / Summary</h4>
                            <button onClick={() => handleCopy(courseraBio, 'Coursera Bio')} className="p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-blue-600">
                                <Copy size={14} />
                            </button>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm italic text-slate-600 dark:text-slate-300">
                            {courseraBio}
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
                  <Target size={16} /> Finals Sprint
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
                <BookCheck size={16} /> Focus List
              </h3>
              <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                {dailyTasks.map((task) => (
                  <button 
                    key={task.id} 
                    onClick={() => toggleTask(task.id)}
                    className={`w-full flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-700 transition-colors text-left group ${completedTasks.has(task.id) ? 'bg-slate-50 dark:bg-slate-900/50' : 'hover:bg-slate-50 dark:hover:bg-slate-900/30'} ${task.highPriority ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${completedTasks.has(task.id) ? 'bg-primary-500 border-primary-500' : 'border-slate-300'}`}>
                      {completedTasks.has(task.id) && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'} ${task.highPriority ? 'font-black text-amber-700 dark:text-amber-400' : ''}`}>
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
