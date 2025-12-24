
import React, { useState } from 'react';
import { Target, Linkedin, Share2, Search, TrendingUp, CheckCircle2, Award, ArrowRight, Zap, Globe, Link as LinkIcon } from 'lucide-react';

const MarketingRoadmap: React.FC = () => {
  const [missions, setMissions] = useState([
    { id: 1, title: 'Share 100% Grade on LinkedIn', category: 'Social', completed: false, icon: Award, action: 'Share Success' },
    { id: 2, title: 'Convert Direct Traffic to Referrals', category: 'Growth', completed: false, icon: LinkIcon, action: 'Pitch Schools' },
    { id: 3, title: 'Check Google Analytics Realtime', category: 'Data', completed: true, icon: TrendingUp, action: 'View Dashboard' },
    { id: 4, title: 'Analyze US vs SA User Intent', category: 'Search', completed: false, icon: Globe, action: 'View Stats' },
  ]);

  const handleShareCertificate = () => {
      const text = encodeURIComponent("I'm thrilled to share that I've achieved a 100% grade in the Google 'Maximize Productivity with AI Tools' certificate! 🎓✨\n\nI applied these skills to build CaterPro AI, a tool that helps chefs automate proposals and admin. Check it out at https://caterpro-ai.web.app/");
      window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, '_blank');
  };

  const handleScrollToResearch = () => {
    const hub = document.getElementById('research-hub-section');
    if (hub) hub.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mt-12 animate-slide-in">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Target size={160} />
        </div>
        
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-500 rounded-xl">
                    <Zap size={24} className="text-white fill-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-black">Marketing Mission Control</h3>
                    <p className="text-slate-400 text-sm font-medium">Powering your Google Digital Marketing Journey</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missions.map((mission) => (
                    <div key={mission.id} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl flex items-center justify-between group hover:border-primary-500/50 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${mission.completed ? 'bg-green-500/20 text-green-500' : 'bg-slate-700 text-slate-400'}`}>
                                <mission.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{mission.category}</p>
                                <h4 className={`text-sm font-bold ${mission.completed ? 'text-slate-400 line-through' : 'text-white'}`}>{mission.title}</h4>
                            </div>
                        </div>
                        
                        {mission.id === 1 ? (
                            <button 
                                onClick={handleShareCertificate}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg"
                            >
                                <Linkedin size={14} /> Share
                            </button>
                        ) : mission.id === 2 ? (
                            <button 
                                onClick={handleScrollToResearch}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg"
                            >
                                <LinkIcon size={14} /> Pitch
                            </button>
                        ) : mission.completed ? (
                            <CheckCircle2 size={20} className="text-green-500" />
                        ) : (
                            <ArrowRight size={20} className="text-slate-600 group-hover:text-primary-500 transition-colors" />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Globe size={16} /> Global SEO Rating: <span className="text-green-500">High</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 font-bold">Priority: Build Free Referrals</span>
                    <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 w-1/3"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingRoadmap;
