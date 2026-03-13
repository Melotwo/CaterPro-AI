
import React from 'react';
import { User, MapPin, ChefHat, Quote } from 'lucide-react';

const MeetTheFounder: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card noise-overlay p-8 sm:p-12 rounded-[3rem] relative overflow-hidden border border-white/10 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {/* Image Placeholder */}
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-4 border-white/10 overflow-hidden shrink-0 shadow-inner">
              <User size={64} className="text-slate-400 dark:text-slate-600" />
              {/* <img src="/founder.jpg" alt="Founder" className="w-full h-full object-cover" /> */}
            </div>

            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full">
                <ChefHat size={14} className="text-primary-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">Meet the Founder</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-white/100 tracking-tight leading-tight">
                Built by a Chef, for Chefs.
              </h2>
              
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 w-8 h-8 text-white/10 opacity-20" />
                <p className="text-lg sm:text-xl text-white/60 font-medium leading-relaxed italic">
                  As a South African entrepreneur, I saw firsthand how manual portioning and costing were draining the creativity out of our local kitchens. I built CaterProAI to automate the "boring" admin, giving chefs back the 10+ hours a week they need to focus on what truly matters: the food. We're on a mission to modernize the catering industry across Mzansi and beyond, one menu at a time.
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
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
