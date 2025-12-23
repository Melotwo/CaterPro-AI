
import React, { useState } from 'react';
import { Check, Star, Zap, Briefcase } from 'lucide-react';
import { SubscriptionPlan } from '../hooks/useAppSubscription';
import Footer from './Footer';
import PaymentModal from './PaymentModal';

interface PricingPageProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  currency?: string;
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
  green: {
    border: 'border-slate-200 dark:border-slate-700',
    highlightBorder: 'border-primary-500 ring-2 ring-primary-500',
    badge: 'bg-primary-600',
    icon: 'text-primary-600',
    button: 'bg-primary-50 text-primary-800 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-200 dark:hover:bg-primary-900/50',
    buttonHighlight: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md',
  },
  amber: {
    border: 'border-slate-200 dark:border-slate-700',
    highlightBorder: 'border-amber-500 ring-2 ring-amber-500',
    badge: 'bg-amber-500',
    icon: 'text-amber-500',
    button: 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/50',
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

const getTiers = (currency: string = 'ZAR') => {
  const isZar = currency === 'ZAR';
  const symbol = isZar ? 'R' : '$';
  
  return [
    {
      name: 'Free',
      id: 'free',
      price: symbol + '0',
      icon: Star,
      description: 'Test the AI and generate simple menus.',
      features: [
        '5 Menu Generations per Day',
        'Basic Menu Export (PDF)',
        'Standard Theme',
        'Watermarked Documents',
      ],
      cta: 'Current Plan',
      colorKey: 'slate' as keyof typeof TIER_STYLES,
    },
    {
      name: 'Starter',
      id: 'starter',
      price: symbol + (isZar ? '169' : '9'),
      priceSuffix: '/mo',
      icon: Zap,
      description: 'For private chefs and small events.',
      features: [
        'Unlimited Generations',
        'No Watermarks',
        'Commercial Usage Rights',
        'Standard Themes',
      ],
      cta: 'Get Starter',
      colorKey: 'green' as keyof typeof TIER_STYLES,
    },
    {
      name: 'Professional',
      id: 'professional',
      price: symbol + (isZar ? '349' : '19'),
      priceSuffix: '/mo',
      icon: Star,
      description: 'Tools for better presentation.',
      features: [
        'All Starter Features',
        'AI Food Photography',
        'Save up to 10 Menus',
        'AI Chat Consultant',
        'Beverage Pairings',
      ],
      cta: 'Go Professional',
      highlight: true,
      badge: 'Most Popular',
      colorKey: 'amber' as keyof typeof TIER_STYLES,
    },
    {
      name: 'Business',
      id: 'business',
      price: symbol + (isZar ? '549' : '29'),
      priceSuffix: '/mo',
      icon: Briefcase,
      description: 'Complete toolkit for companies.',
      features: [
        'All Professional Features',
        'Unlimited Saved Menus',
        'Shareable Proposal Links',
        'Suppliers & Education Hub',
        'Priority Support',
      ],
      cta: 'Get Business',
      colorKey: 'royal' as keyof typeof TIER_STYLES,
    },
  ];
};

const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan, currency = 'ZAR' }) => {
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan | null>(null);
  const [selectedPrice, setSelectedPrice] = useState('');

  const handleTierClick = (planId: string, price: string) => {
    if (planId === 'free') {
        onSelectPlan('free');
        return;
    }
    setSelectedPlanForPayment(planId as SubscriptionPlan);
    setSelectedPrice(price);
  };

  const handlePaymentSuccess = () => {
    if (selectedPlanForPayment) {
      onSelectPlan(selectedPlanForPayment);
      setSelectedPlanForPayment(null);
    }
  };

  const tiers = getTiers(currency);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pricing & Plans
            </h1>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
              Stop doing paperwork. Start cooking. Unlock your potential today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {tiers.map((tier) => {
              const styles = TIER_STYLES[tier.colorKey];
              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col rounded-2xl border p-6 shadow-sm h-full transition-all hover:shadow-xl ${
                    tier.highlight 
                      ? `${styles.highlightBorder} bg-white dark:bg-slate-900 z-10` 
                      : `${styles.border} bg-white dark:bg-slate-900`
                  }`}
                >
                  {tier.highlight && (
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full px-4 py-1 text-xs font-bold text-white uppercase tracking-wide shadow-md ${styles.badge}`}>
                      {tier.badge}
                    </div>
                  )}
                  
                  <div className="mb-4">
                      <tier.icon className={`w-8 h-8 ${styles.icon}`} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 min-h-[2.5rem]">{tier.description}</p>
                  
                  <div className="mt-6 mb-6">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{tier.price}</span>
                    {tier.priceSuffix && (
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{tier.priceSuffix}</span>
                    )}
                  </div>

                  <ul role="list" className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="ml-3 text-slate-600 dark:text-slate-300">{feature}</p>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleTierClick(tier.id, tier.price)}
                    className={`w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                      tier.highlight ? styles.buttonHighlight : styles.button
                    }`}
                  >
                    {tier.cta}
                  </button>
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
