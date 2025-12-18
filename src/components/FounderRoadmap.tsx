
import React, { useState } from 'react';
import { Calendar, GraduationCap, Layout, BookOpen, Clock, CheckCircle2, Zap, Rocket, Pin, Instagram, Briefcase } from 'lucide-react';

const FounderRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'growth' | 'tools'>('blueprint');

  const schedule = [
    { time: '08:00 - 10:00', task: 'Deep Work: Menu Generation & Testing', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { time: '10:30 - 12:00', task: 'Marketing: Generate & Schedule Pins/Reels', icon: Megaphone, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    { time: '13:00 - 14:30', task: 'Learning: Google AI Essentials Course', icon: GraduationCap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { time: '15:00 - 17:00', task: 'Outreach: Community Replies & Networking', icon: Rocket, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  ];

  return (
    <section className="mt-16 animate-slide-in border-t-4 border-primary-500 bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="text-primary-500" /> Founder Success Roadmap
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Scale CaterPro AI from local app to global brand.</p>
          </div>
          <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button onClick={() => setActiveTab('blueprint')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'blueprint' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-500'}`}>Weekly Blueprint</button>
            <button onClick={() => setActiveTab('growth')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'growth' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-500'}`}>Certification</button>
            <button onClick={() => setActiveTab('tools')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'tools' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-500'}`}>Tool Stack</button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'blueprint' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Calendar size={16} /> Daily Momentum Schedule
              </h3>
              {schedule.map((item, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all ${item.bg}`}>
                  <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">{item.time}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.task}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-primary-900 text-white p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                <Rocket className="absolute -bottom-4 -right-4 w-32 h-32 text-primary-800 opacity-50 rotate-12" />
                <div className="relative z-10">
                    <h4 className="text-xl font-black mb-2">Today's Goal</h4>
                    <p className="text-primary-100 text-sm">Post 2 Pins on Pinterest using the "Inspiration" tone. Focus on Christmas Menu ideas.</p>
                </div>
                <button className="mt-8 bg-white text-primary-900 px-6 py-2.5 rounded-full font-black text-sm w-fit hover:bg-primary-50 transition-colors">
                    Mark as Done
                </button>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="space-y-8 animate-fade-in max-w-2xl mx-auto py-4">
            <div className="text-center">
                <GraduationCap className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Google AI Essentials</h3>
                <p className="text-slate-500 text-sm">Target: Completion by end of next week.</p>
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase text-slate-400">
                    <span>Course Progress</span>
                    <span>15%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="bg-primary-500 h-full w-[15%] transition-all duration-1000"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <CheckCircle2 className="text-primary-500 mb-2" size={20} />
                    <h4 className="font-bold text-sm">Next Module:</h4>
                    <p className="text-xs text-slate-500">Mastering Prompt Engineering for Efficiency</p>
                </div>
                <a href="https://grow.google/ai-essentials/" target="_blank" className="p-4 bg-primary-600 text-white rounded-xl flex items-center justify-center font-black hover:bg-primary-700 transition-colors">
                    Continue Learning
                </a>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
             <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg"><Layout size={20} className="text-blue-500" /></div>
                    <h4 className="font-black text-slate-900 dark:text-white">Notion: The War Room</h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Store client feedback & requested cuisines.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Draft "Founder Story" variants for posts.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Track which Pinterest boards perform best.</li>
                </ul>
             </div>
             <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg"><BookOpen size={20} className="text-purple-500" /></div>
                    <h4 className="font-black text-slate-900 dark:text-white">NotebookLM: The Brain</h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Upload cooking manuals to improve prompt accuracy.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Create "Audio Overviews" for Reels/TikTok audio.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Summarize long health codes into app logic.</li>
                </ul>
             </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
import { Megaphone } from 'lucide-react';
