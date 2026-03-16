
import React from 'react';
import { GraduationCap, Zap, Briefcase, Users, Check, ArrowRight, Sparkles } from 'lucide-react';

interface FeatureTier {
  name: string;
  id: string;
  price: string;
  description: string;
  features: string[];
  icon: any;
  color: string;
  whopLink: string;
}

const TIERS: FeatureTier[] = [
  {
    name: 'The Commis',
    id: 'commis',
    price: 'R149/mo',
    description: 'Student Edition - Academic PoE Automation & Curriculum Mapping.',
    features: [
      'Academic PoE Automation',
      'City & Guilds Mapping',
      'Local Curriculum Alignment',
      'ADHD Optimized UI',
      'Basic Menu Generation',
    ],
    icon: GraduationCap,
    color: 'slate',
    whopLink: 'https://whop.com/melotwo2',
  },
  {
    name: 'The Chef de Partie',
    id: 'chef-de-partie',
    price: 'R449/mo',
    description: 'Professional Edition - Interactive Costing & Shopping Lists.',
    features: [
      'Everything in Commis',
      'Full Interactive Costing',
      'Dynamic Shopping Lists',
      'Standard AI Menus',
      'Scaling Engine',
    ],
    icon: Zap,
    color: 'amber',
    whopLink: 'https://whop.com/melotwo2',
  },
  {
    name: 'The Sous Chef',
    id: 'sous-chef',
    price: 'R749/mo',
    description: 'Growth Edition - Multi-user Collaboration & Cloud Storage.',
    features: [
      'Everything in Professional',
      'Multi-user (3 seats)',
      'Cloud Storage Engine',
      'Client Dashboard',
      'Priority Support',
    ],
    icon: Users,
    color: 'blue',
    whopLink: 'https://whop.com/melotwo2',
  },
  {
    name: 'The Executive',
    id: 'executive',
    price: 'R949/mo',
    description: 'Empire Edition - Full Suite & Viral Video Creator.',
    features: [
      'Everything in Growth',
      'Viral Video Creator',
      'Unlimited Access',
      'Custom Branding',
      'White-label Reports',
    ],
    icon: Briefcase,
    color: 'indigo',
    whopLink: 'https://whop.com/melotwo2',
  },
];

const FeaturesList: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Upgrade Your Toolkit</h2>
          <p className="text-sm text-slate-500 dark:text-white/60 font-medium">Unlock professional features to scale your catering business.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800">
          <Sparkles size={12} />
          <span className="text-[10px] font-black uppercase tracking-widest">7-Day Free Trial</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TIERS.map((tier) => (
          <div 
            key={tier.id}
            className="group relative bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors`}>
                <tier.icon size={24} className="text-slate-900 dark:text-white group-hover:text-indigo-600" />
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white">{tier.price}</span>
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{tier.name}</h3>
            <p className="text-xs text-slate-500 dark:text-white/60 font-medium mb-6 leading-relaxed">{tier.description}</p>

            <ul className="space-y-3 mb-8">
              {tier.features.slice(0, 4).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <Check size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a 
              href={tier.whopLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all active:scale-95"
            >
              Upgrade Now
              <ArrowRight size={14} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesList;
