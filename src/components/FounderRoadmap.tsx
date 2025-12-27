
import React, { useState } from 'react';
import { Calendar, GraduationCap, Layout, BookOpen, Clock, CheckCircle2, Zap, UserRound, Sparkles, TrendingUp, ChevronRight, BookCheck, Target, Anchor, Utensils, Copy, Info, Briefcase, Award, Linkedin, Twitter, AlertCircle, Video, Fingerprint, ArrowRight, BarChart3, MousePointer2, Gift, ShieldCheck, Trophy, Shield, Play, MapPin, Globe } from 'lucide-react';

const dailyTasks = [
  { id: 'module-4-final', label: 'Finish Module 4: Performance Measurement', highPriority: true },
  { id: 'tvet-pitch', label: 'Draft Waterberg TVET Partnership Pitch', highPriority: true },
  { id: 'hungarian-fusion', label: 'Draft Hungarian Fusion Cruise Menu Case Study', highPriority: false },
  { id: 'dad-cooking', label: 'Enjoy Dads Christmas Eve Cooking 🎄', highPriority: false },
];

const FounderRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'growth' | 'vault'>('growth');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['dad-cooking']));

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
    if (hub) {
      hub.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const schedule = [
    { id: 'tvet-local', time: 'Global Heritage', task: 'Cruise Line Standards Pitch', icon: Anchor, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'kpi-tracking', time: 'Module 4', task: 'Track "Time-to-Table" ROI', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'cert-unlocked', time: 'Tonight', task: 'Course 1 Graduation', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-blue-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Global Credibility Unlocked</div>
                <div className="flex items-center gap-1 text-slate-400 text-xs"><Anchor size={12} className="text-blue-400" /> International Cruise Standards</div>
            </div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" /> Tumi's Growth Engine
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-md">Bridging Google Certified Marketing with global culinary expertise.</p>
          </div>
          
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Trophy size={14} /> Course Status
            </button>
            <button onClick={() => setActiveTab('vault')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'vault' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Shield size={14} /> Local Moat
            </button>
            <button onClick={() => setActiveTab('blueprint')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'blueprint' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <Calendar size={14} /> Next Steps
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
                        <TrendingUp size={16} /> Performance Strategy
                    </h3>
                    <div className="space-y-3">
                        <button 
                            onClick={handleScrollToResearch}
                            className="w-full text-left flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border-2 border-blue-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/5 group"
                        >
                            <Anchor className="text-blue-500 group-hover:rotate-12 transition-transform" size={24} />
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-blue-900 dark:text-blue-100 uppercase">The Cruise Standard</h4>
                                <p className="text-[10px] text-blue-600 uppercase font-black">Pitch: "Global Compliance for Local Students"</p>
                            </div>
                            <ArrowRight size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button 
                            onClick={() => window.open('https://www.coursera.org/learn/foundations-of-digital-marketing-and-e-commerce/home/week/4', '_blank')}
                            className="w-full text-left flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border-2 border-red-500 shadow-lg shadow-red-500/10 transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Gift className="text-red-500 animate-bounce" size={24} />
                            <div>
                                <h4 className="font-black text-sm text-red-900 dark:text-red-100 flex items-center gap-2">
                                    Course 1 Graduation Tonight! <ArrowRight size={14} />
                                </h4>
                                <p className="text-[10px] text-red-600 uppercase font-black">Your final module is ready</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="bg-primary-50/30 dark:bg-primary-900/10 p-6 rounded-3xl border-2 border-primary-100 dark:border-primary-800">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary-600 mb-4 flex items-center gap-2">
                        <Award size={16} /> Progress Tracking
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-600 dark:text-slate-300">Google Foundations</span>
                            <span className="text-primary-600">88% (Almost Finished)</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 w-[88%] transition-all duration-1000"></div>
                        </div>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-primary-100 dark:border-primary-800">
                             <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                "Tumi, combining your Cruise heritage with Google's marketing data will make CaterPro AI unstoppable in the TVET space."
                             </p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="animate-fade-in py-4 max-w-4xl mx-auto space-y-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl border-2 border-blue-100 dark:border-blue-800 flex flex-col md:flex-row items-center gap-8">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-blue-600">
                    <Globe size={48} />
                </div>
                <div className="space-y-4 flex-1">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">The "Cruise Heritage" Moat</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        You have worked with chefs from **Hungary**, Croatia, and the US. You know how to manage a kitchen at scale. This is your most powerful selling point to the TVET Colleges.
                    </p>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-700 font-bold text-xs text-blue-800 dark:text-blue-300 italic">
                        "CaterPro AI: Built with International Cruise Line Standards to empower local South African talent."
                    </div>
                    <button onClick={() => handleCopy("CaterPro AI: Built with International Cruise Line Standards to empower local South African talent.", 'Global Moat')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-black shadow-lg">
                        <Copy size={14} /> Copy Global Moat
                    </button>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'blueprint' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Target size={16} /> Strategy Sprint
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
                <BookCheck size={16} /> Mission List
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
