
import React from 'react';
import { User, MapPin, ChefHat, Quote } from 'lucide-react';
import founderImg from '../founder.jpg';

const MeetTheFounder: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card noise-overlay p-8 sm:p-12 rounded-[3rem] relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {/* Image Container */}
            <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 shadow-2xl relative group">
              <User className="absolute w-20 h-20 text-slate-300 dark:text-slate-600" />
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full">
                <ChefHat size={14} className="text-primary-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">Meet the Founder</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Built by a Chef, for Chefs.
              </h2>
              
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 w-8 h-8 text-primary-500/20 dark:text-white/10" />
                <p className="text-lg sm:text-xl text-slate-900 dark:text-slate-100 font-medium leading-relaxed italic">
                  As a South African entrepreneur, I built CaterProAI to solve the manual portioning and costing headaches that drain the creativity out of our local kitchens. My mission is to help Mzansi's chefs reclaim 10+ hours a week and significantly increase their margins through smart automation. We're empowering the next generation of culinary talent to focus on their craft while we handle the scaling engine.
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  <MapPin size={14} />
                  Johannesburg, South Africa
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
