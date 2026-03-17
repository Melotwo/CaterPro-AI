
import React, { useState } from 'react';
import { Check, Star, Zap, Briefcase, GraduationCap, ExternalLink, ShieldCheck, Globe, Clock, Lock, Sparkles, Users } from 'lucide-react';
import { SubscriptionPlan } from '../hooks/useAppSubscription';
import Footer from './Footer';
import PaymentModal from './PaymentModal';

interface PricingPageProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  currency?: string;
  whopLinks: {
    commis: string;
    chefDePartie: string;
    sousChef: string;
    executive: string;
  };
}

const TIER_STYLES = {
  slate: {
    border: 'border-slate-200 dark:border-slate-700',
    highlightBorder: 'border-slate-500 ring-2 ring-slate-500',
    badge: 'bg-slate-500',
    icon: 'text-slate-500',
    button: 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
    buttonHighlight: 'bg-slate-500 text-white hover:bg-slate-600 shadow-md',
  },
  blue: {
    border: 'border-slate-200 dark:border-slate-700',
    highlightBorder: 'border-indigo-500 ring-2 ring-indigo-500',
    badge: 'bg-indigo-600',
    icon: 'text-indigo-600',
    button: 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-200 dark:hover:bg-indigo-900/50',
    buttonHighlight: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20',
  },
  amber: {
    border: 'border-slate-200 dark:border-slate-700',
    highlightBorder: 'border-amber-500 ring-2 border-4 ring-amber-500',
    badge: 'bg-amber-500',
    icon: 'text-amber-500',
    button: 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-indigo-200 dark:hover:bg-amber-900/50',
    buttonHighlight: 'bg-amber-500 text-white hover:bg-amber-600 shadow-md',
  },
  royal: {
    border: 'border-slate-200 dark:border-slate-700',
    highlightBorder: 'border-primary-700 ring-2 ring-primary-700',
    badge: 'bg-primary-800',
    icon: 'text-primary-800 dark:text-primary-400',
    button: 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
    buttonHighlight: 'bg-primary-800 text-white hover:bg-primary-900 shadow-md',
  },
};

const formatPrice = (amount: number, currency: string) => {
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getTiers = (currency: string = 'ZAR', whopLinks: PricingPageProps['whopLinks'], period: 'monthly' | 'yearly') => {
  const isYearly = period === 'yearly';
  const discount = isYearly ? 0.8 : 1; // 20% discount for yearly
  
  const priceMap: Record<string, Record<string, number>> = {
    'commis': { 'ZAR': 199, 'USD': 11.99, 'GBP': 9.99, 'EUR': 10.99 },
    'chef-de-partie': { 'ZAR': 549, 'USD': 29.99, 'GBP': 24.99, 'EUR': 27.99 },
    'sous-chef': { 'ZAR': 1249, 'USD': 69.99, 'GBP': 54.99, 'EUR': 64.99 },
    'executive': { 'ZAR': 2499, 'USD': 139.99, 'GBP': 109.99, 'EUR': 129.99 },
  };

  const getPrice = (id: string) => {
    const basePrice = priceMap[id][currency] || priceMap[id]['USD'];
    const finalPrice = isYearly ? basePrice * 10 * discount : basePrice; // 10 months price for yearly
    return formatPrice(finalPrice, currency);
  };
  
  return [
    {
      name: 'The Commis',
      id: 'commis',
      price: getPrice('commis'),
      priceSuffix: isYearly ? '/yr' : '/mo',
      icon: GraduationCap,
      description: 'Student Edition - Academic PoE Automation & Curriculum Mapping.',
      features: [
        'Academic PoE Automation',
        'City & Guilds Curriculum Mapping',
        'Local Curriculum Alignment',
        'ADHD & Dyslexia Optimized UI',
        'Basic Menu Generation',
      ],
      cta: 'Start Your Journey',
      colorKey: 'slate' as keyof typeof TIER_STYLES,
      whopLink: whopLinks.commis,
      hasTrial: true,
    },
    {
      name: 'The Chef de Partie',
      id: 'chef-de-partie',
      price: getPrice('chef-de-partie'),
      priceSuffix: isYearly ? '/yr' : '/mo',
      icon: Zap,
      description: 'Professional Edition - Interactive Costing & Shopping Lists.',
      features: [
        'Everything in Commis',
        'Full Interactive Costing',
        'Dynamic Shopping Lists',
        'Standard AI Menus',
        'Scaling Engine (Auto-Portion)',
      ],
      cta: 'Upgrade Now',
      highlight: true,
      badge: 'MOST POPULAR',
      colorKey: 'amber' as keyof typeof TIER_STYLES,
      whopLink: whopLinks.chefDePartie,
      hasTrial: true,
    },
    {
      name: 'The Sous Chef',
      id: 'sous-chef',
      price: getPrice('sous-chef'),
      priceSuffix: isYearly ? '/yr' : '/mo',
      icon: Users,
      description: 'Growth Edition - Multi-user Collaboration & Cloud Storage.',
      features: [
        'Everything in Professional',
        'Multi-user (3 seats)',
        'Cloud Storage Engine',
        'Client Dashboard',
        'Priority Support',
      ],
      cta: 'Upgrade Now',
      colorKey: 'blue' as keyof typeof TIER_STYLES,
      whopLink: whopLinks.sousChef,
      hasTrial: true,
    },
    {
      name: 'The Executive',
      id: 'executive',
      price: getPrice('executive'),
      priceSuffix: isYearly ? '/yr' : '/mo',
      icon: Briefcase,
      description: 'Empire Edition - Full Suite & Viral Video Creator.',
      features: [
        'Everything in Growth',
        'Viral Video Creator',
        'Unlimited Access',
        'Custom Branding',
        'White-label Reports',
      ],
      cta: 'Upgrade Now',
      badge: isYearly ? 'Best Value' : 'Enterprise',
      colorKey: 'royal' as keyof typeof TIER_STYLES,
      whopLink: whopLinks.executive,
      hasTrial: true,
    },
  ];
};

const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan, currency = 'ZAR', whopLinks }) => {
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan | null>(null);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleTierClick = (tier: any) => {
    if (tier.id === 'free') {
        onSelectPlan('free');
        return;
    }
    
    if (tier.whopLink) {
        const win = window.open(tier.whopLink, '_blank');
        if (win) win.focus();
        onSelectPlan(tier.id as SubscriptionPlan);
        return;
    }

    setSelectedPlanForPayment(tier.id as SubscriptionPlan);
    setSelectedPrice(tier.price);
  };

  const handlePaymentSuccess = () => {
    if (selectedPlanForPayment) {
      onSelectPlan(selectedPlanForPayment);
      setSelectedPlanForPayment(null);
    }
  };

  const tiers = getTiers(currency, whopLinks, billingPeriod);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-4 bg-indigo-50 dark:bg-indigo-900/30 w-fit mx-auto px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-800">
                <Sparkles size={14} className="text-indigo-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-300">7-Day Free Trial Active on All Plans</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6">
              Pick Your Toolkit
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
              Start your 7-day trial. Zero commitment. Cancel anytime via Whop.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="mt-10 flex items-center justify-center gap-4">
                <span className={`text-sm font-black uppercase tracking-widest ${billingPeriod === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Monthly</span>
                <button 
                    onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                    className="relative w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors hover:bg-slate-300"
                >
                    <div className={`w-6 h-6 bg-indigo-600 rounded-full shadow-lg transform transition-transform duration-300 ${billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-0'}`}></div>
                </button>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-black uppercase tracking-widest ${billingPeriod === 'yearly' ? 'text-indigo-600' : 'text-slate-400'}`}>Yearly</span>
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-md uppercase tracking-tighter">Save 20%</span>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {tiers.map((tier) => {
              const styles = TIER_STYLES[tier.colorKey];
              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col rounded-[2.5rem] border p-8 shadow-sm h-full transition-all hover:shadow-xl ${
                    tier.highlight
                      ? `${styles.highlightBorder} bg-white dark:bg-slate-900 z-10 scale-105 shadow-[0_0_50px_-10px_rgba(245,158,11,0.5)] dark:shadow-[0_0_60px_-15px_rgba(245,158,11,0.4)]` 
                      : `${styles.border} bg-white dark:bg-slate-900`
                  }`}
                >
                  {(tier.badge) && (
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full px-5 py-1.5 text-[10px] font-black text-white uppercase tracking-widest shadow-lg ${styles.badge}`}>
                      {tier.badge}
                    </div>
                  )}
                  
                  <div className="mb-6 flex justify-between items-start">
                      <tier.icon className={`w-10 h-10 ${styles.icon}`} />
                      {tier.hasTrial && (
                          <div className="text-[10px] font-black text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded-lg uppercase tracking-widest">
                              Trial
                          </div>
                      )}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{tier.name}</h3>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 min-h-[2.5rem] font-medium leading-relaxed">{tier.description}</p>
                  
                  <div className="mt-6 mb-8">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">{tier.price}</span>
                    {tier.priceSuffix && (
                      <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter ml-1">{tier.priceSuffix}</span>
                    )}
                  </div>

                  <ul role="list" className="space-y-4 mb-10 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="ml-3 text-slate-900 dark:text-slate-200 font-medium">{feature}</p>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleTierClick(tier)}
                    className={`w-full rounded-2xl px-4 py-4 text-center text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      tier.highlight ? styles.buttonHighlight : styles.button
                    } active:scale-95`}
                  >
                    {tier.cta}
                    {tier.whopLink && <ExternalLink size={16} />}
                  </button>

                  <p className="mt-4 text-center text-[9px] font-bold text-slate-400 uppercase">Secure via Whop Marketplace</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      
      <PaymentModal 
        isOpen={!!selectedPlanForPayment} 
        onClose={() => setSelectedPlanForPayment(null)}
        plan={selectedPlanForPayment || 'chef-de-partie'}
        price={selectedPrice}
        onConfirm={handlePaymentSuccess}
      />
      
      <Footer />
    </div>
  );
};

export default PricingPage;
