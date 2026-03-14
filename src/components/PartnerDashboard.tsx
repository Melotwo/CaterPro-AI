
import React from 'react';
import { Share2, Users, Wallet, Copy, ExternalLink, Megaphone, TrendingUp, HandCoins } from 'lucide-react';

const PartnerDashboard: React.FC = () => {
  const referralLink = "https://whop.com/caterproai?aff=YOUR_ID";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    // In a real app, you'd show a toast here
  };

  return (
    <div className="glass-card noise-overlay p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500 text-white rounded-2xl shadow-lg">
              <HandCoins size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Partner Dashboard</h3>
              <p className="text-xs font-bold text-slate-500 dark:text-white/60 uppercase tracking-widest">Grow with CaterProAI</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              Active Partner
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-lg font-medium text-slate-900 dark:text-white/80 leading-snug">
              Help other chefs save 10 hours a week. Earn <span className="text-emerald-500 dark:text-emerald-400 font-black">R165/month passive income</span> for every friend who joins the Standard Tier.
            </p>
            <div className="flex items-center gap-4 text-sm font-bold text-slate-500 dark:text-white/60">
              <div className="flex items-center gap-1.5">
                <Users size={16} className="text-indigo-500 dark:text-indigo-400" />
                Unlimited Referrals
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={16} className="text-emerald-500 dark:text-emerald-400" />
                Scaling Rewards
              </div>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-black/20 rounded-3xl p-6 border border-slate-200 dark:border-white/5 space-y-4">
            <label className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Your Referral Link</label>
            <div className="flex items-center gap-2 bg-white dark:bg-black/40 p-3 rounded-xl border border-slate-200 dark:border-white/10">
              <code className="text-xs text-indigo-600 dark:text-indigo-300 truncate flex-grow">{referralLink}</code>
              <button 
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-400 dark:text-white/60 hover:text-slate-900 dark:hover:text-white/100"
              >
                <Copy size={16} />
              </button>
            </div>
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
              Access Whop Dashboard <ExternalLink size={14} />
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-white/5 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-1">Clicks</p>
            <p className="text-xl font-black text-slate-900 dark:text-white/100">0</p>
          </div>
          <div className="text-center border-x border-slate-200 dark:border-white/5">
            <p className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-1">Signups</p>
            <p className="text-xl font-black text-slate-900 dark:text-white/100">0</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-1">Earnings</p>
            <p className="text-xl font-black text-emerald-500 dark:text-emerald-400">R0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
