
import React from 'react';
import { Users, Gift, TrendingUp, ArrowRight, ExternalLink, DollarSign, Award } from 'lucide-react';

const PartnerProgram: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-bold mb-6">
            <Award size={16} />
            <span>CaterPro AI Partner Program</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-high mb-6 tracking-tight">
            Grow Your Business by <span className="text-primary-500">Helping Others Grow</span>
          </h2>
          <p className="text-xl text-medium max-w-2xl mx-auto">
            Join our exclusive partner program on Whop. Refer other caterers to CaterPro AI and earn recurring commissions for every successful referral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Users className="text-blue-500" size={32} />,
              title: "Invite Caterers",
              description: "Share your unique Whop referral link with your network, colleagues, or social media followers."
            },
            {
              icon: <TrendingUp className="text-emerald-500" size={32} />,
              title: "Earn 30% Commission",
              description: "Get a 30% recurring commission for every month your referrals stay subscribed to CaterPro AI."
            },
            {
              icon: <Gift className="text-purple-500" size={32} />,
              title: "Exclusive Rewards",
              description: "Top partners get early access to new AI features, private coaching, and branding assets."
            }
          ].map((item, index) => (
            <div key={index} className="glass-card noise-overlay p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="relative z-10">
                <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-2xl w-fit shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-high mb-4">{item.title}</h3>
                <p className="text-medium leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card noise-overlay p-10 md:p-16 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <h3 className="text-3xl font-black text-high mb-6">Ready to start earning?</h3>
            <p className="text-lg text-medium mb-8">
              Our partner dashboard on Whop provides real-time tracking, marketing materials, and instant payouts. It takes less than 2 minutes to set up.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://whop.com/caterpro-ai/affiliate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-primary-500/20 transition-all active:scale-95"
              >
                Join Partner Program <ExternalLink size={18} />
              </a>
              <button className="px-8 py-4 bg-white dark:bg-slate-800 text-high border border-slate-200 dark:border-slate-700 rounded-2xl font-black hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2">
                Learn More <ArrowRight size={18} />
              </button>
            </div>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-white/20 dark:border-slate-700/50 text-center">
              <div className="text-3xl font-black text-primary-500 mb-1">30%</div>
              <div className="text-xs font-bold text-low uppercase tracking-widest">Commission</div>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-white/20 dark:border-slate-700/50 text-center">
              <div className="text-3xl font-black text-blue-500 mb-1">90d</div>
              <div className="text-xs font-bold text-low uppercase tracking-widest">Cookie Life</div>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-white/20 dark:border-slate-700/50 text-center col-span-2">
              <div className="flex items-center justify-center gap-2 text-2xl font-black text-emerald-500 mb-1">
                <DollarSign size={24} /> Monthly
              </div>
              <div className="text-xs font-bold text-low uppercase tracking-widest">Payouts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerProgram;
