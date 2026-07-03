
import React from 'react';
import founderImg from './founder.jpg';

const MeetTheFounder: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card noise-overlay p-8 sm:p-12 rounded-[3rem] relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {/* Image Container */}
            <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 shadow-2xl relative group">
              <span className="absolute text-6xl text-slate-300 dark:text-slate-600">👤</span>
              <img 
                id="founder-image" 
                src={founderImg} 
                alt="Founder" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                onError={(e) => {
                  const target = e.currentTarget;
                  // Fallback to a professional chef image if local is missing
                  target.src = "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80";
                }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              {/* Founder Badge */}
              <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-900 px-3 py-1 rounded-full shadow-lg border border-slate-100 dark:border-white/10 z-20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">Founder</span>
              </div>
            </div>

            <div className="space-y-6 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full w-fit mx-auto md:mx-0">
                  <span className="text-primary-500 text-xs">👨‍🍳</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">Meet the Founder</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit mx-auto md:mx-0">
                  <span className="text-emerald-500 text-xs animate-spin-slow">🧭</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Melotwo Culinary Intelligence</span>
                </div>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                High Seas to High-Tech.
              </h2>
              
              <div className="relative">
                <span className="absolute -top-4 -left-4 text-3xl opacity-20">"</span>
                <p className="text-lg sm:text-xl text-slate-900 dark:text-slate-100 font-medium leading-relaxed italic">
                  My journey began in the demanding kitchens of the Disney Cruise Line, where precision and global standards were the baseline. I built <span className="font-bold">CaterPro</span><span className="font-medium text-emerald">Ai</span> to bring that same level of elite operational excellence to every chef's office. By automating the complex admin of menu costing and yield management, we're shifting the culinary industry from manual chaos to intelligent systems.
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  📍 Johannesburg, South Africa
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetTheFounder;
