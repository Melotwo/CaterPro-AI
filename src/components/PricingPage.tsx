
import React, { useState } from 'react';
import { Check, Star, Zap, Briefcase, GraduationCap, ExternalLink, ShieldCheck, Globe, Clock, Lock, Sparkles } from 'lucide-react';
import { SubscriptionPlan } from '../hooks/useAppSubscription';
import Footer from './Footer';
import PaymentModal from './PaymentModal';

interface PricingPageProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  currency?: string;
  whopUrl: string;
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

const getTiers = (currency: string = 'ZAR', whopUrl: string, period: 'monthly' | 'yearly') => {
  const isZar = currency === 'ZAR';
  const isYearly = period === 'yearly';
  const symbol = isZar ? 'R' : (currency === 'EUR' ? '€' : (currency === 'GBP' ? '£' : '$'));
  
  return [
    {
      name: 'Free',
      id: 'free',
      price: symbol + '0',
      icon: Star,
      description: 'Explore the AI basics.',
      features: [
        '5 Generations per Day',
        'Basic PDF Export',
        'Global Cuisine Support',
      ],
      cta: 'Current Plan',
      colorKey: 'slate' as keyof typeof TIER_STYLES,
    },
    {
      name: 'Student Edition',
      id: 'student',
      price: isYearly 
        ? symbol + (isZar ? '1100' : '59.90')
        : symbol + (isZar ? '110' : '5.99'),
      priceSuffix: isYearly ? '/yr' : '/mo',
      icon: GraduationCap,
      description: 'The Academy Secret Weapon.',
      features: [
        'UNLIMITED Generations',
        'AI Tutor (Ask any PoE question)',
        'ADHD/Dyslexia Helper Mode',
        'Direct Support via Whop',
      ],
      cta: 'Start 7-Day Trial',
      badge: isYearly ? 'Save 16%' : 'Free Trial',
      colorKey: 'blue' as keyof typeof TIER_STYLES,
      whopLink: whopUrl,
      hasTrial: true,
    },
    {
      name: 'Professional',
      id: 'professional',
      price: isYearly 
        ? symbol + (isZar ? '3490' : '199.90')
        : symbol + (isZar ? '349' : '19.99'),
      priceSuffix: isYearly ? '/yr' : '/mo',
      icon: Zap,
      description: 'For Working Caterers.',
      features: [
        'Everything in Student',
        'NO Watermarks on PDFs',
        'AI Food Photography',
        'Sommelier AI Pairings',
      ],
      cta: 'Start 7-Day Trial',
      highlight: true,
      badge: isYearly ? '2 Months Free' : 'Free Trial',
      colorKey: 'amber' as keyof typeof TIER_STYLES,
      whopLink: whopUrl,
      hasTrial: true,
    },
    {
      name: 'Business',
      id: 'business',
      price: isYearly 
        ? symbol + (isZar ? '5490' : '299.90')
        : symbol + (isZar ? '549' : '29.99'),
      priceSuffix: isYearly ? '/yr' : '/mo',
      icon: Briefcase,
      description: 'The Ultimate Suite.',
      features: [
        'Everything in Pro',
        'Viral Video Reel Creator',
        'Magic Share Links',
        'Global Supply Hub',
      ],
      cta: 'Start 7-Day Trial',
      badge: isYearly ? 'Best Value' : 'Free Trial',
      colorKey: 'royal' as keyof typeof TIER_STYLES,
      whopLink: whopUrl,
      hasTrial: true,
    },
  ];
};

const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan, currency = 'ZAR', whopUrl }) => {
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

  const tiers = getTiers(currency, whopUrl, billingPeriod);

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
                      ? `${styles.highlightBorder} bg-white dark:bg-slate-900 z-10 scale-105` 
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
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 min-h-[2.5rem] font-medium leading-relaxed">{tier.description}</p>
                  
                  <div className="mt-6 mb-8">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">{tier.price}</span>
                    {tier.priceSuffix && (
                      <span className="text-xs font-black text-slate-400 uppercase tracking-tighter ml-1">{tier.priceSuffix}</span>
                    )}
                  </div>

                  <ul role="list" className="space-y-4 mb-10 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="ml-3 text-slate-600 dark:text-slate-300 font-medium">{feature}</p>
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
        plan={selectedPlanForPayment || 'starter'}
        price={selectedPrice}
        onConfirm={handlePaymentSuccess}
      />
      
      <Footer />
    </div>
  );
};

export default PricingPage;
