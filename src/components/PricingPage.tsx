import React from 'react';
import { Check, Star, Zap, Briefcase, Building2 } from 'lucide-react';
import { SubscriptionPlan } from '../hooks/useAppSubscription';
import Footer from './Footer';

interface PricingPageProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

const tiers = [
  {
    name: 'Free',
    id: 'free',
    price: '$0',
    icon: Star,
    description: 'Perfect for daily use and testing the waters.',
    features: [
      '3 Menu Generations per Day',
      'Basic Menu Export (PDF)',
      'Standard Theme',
      'Watermarked Documents',
    ],
    cta: 'Start for Free',
    color: 'slate',
  },
  {
    name: 'Starter',
    id: 'starter',
    price: '$9',
    priceSuffix: '/mo',
    icon: Zap,
    description: 'Remove limits and branding.',
    features: [
      'Unlimited Generations',
      'No Watermarks',
      'Commercial Usage Rights',
      'Priority Generation Speed',
    ],
    cta: 'Get Starter',
    color: 'blue',
  },
  {
    name: 'Professional',
    id: 'professional',
    price: '$19',
    priceSuffix: '/mo',
    icon: Star,
    description: 'AI tools for better presentation.',
    features: [
      'All Starter Features',
      'AI Food Photography (Michelin Style)',
      'Save up to 10 Menus',
      'AI Chat Consultant',
      'Beverage Pairings',
    ],
    cta: 'Go Professional',
    highlight: true,
    badge: 'Most Popular',
    color: 'amber',
  },
  {
    name: 'Business',
    id: 'business',
    price: '$29',
    priceSuffix: '/mo',
    icon: Briefcase,
    description: 'Complete toolkit for caterers.',
    features: [
      'All Professional Features',
      'Unlimited Saved Menus',
      'Shareable Proposal Links',
      'Find Local Suppliers',
      'Bulk Shopping List Editor',
    ],
    cta: 'Get Business',
    color: 'purple',
  },
  {
    name: 'Enterprise',
    id: 'enterprise',
    price: '$99',
    priceSuffix: '/mo',
    icon: Building2,
    description: 'For agencies and large teams.',
    features: [
      'All Business Features',
      'White-Label Options',
      'API Access',
      'Dedicated Account Manager',
      'Custom Onboarding',
    ],
    cta: 'Contact Sales',
    color: 'slate',
  },
];

const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Plans for Every Stage
            </h1>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
              From daily menu inspiration to full-scale catering operations. 
              Unlock AI photography to give your dishes that Michelin-star look.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl border p-6 shadow-sm h-full transition-transform hover:-translate-y-1 ${
                  tier.highlight 
                    ? `border-${tier.color}-500 ring-2 ring-${tier.color}-500 bg-white dark:bg-slate-900 z-10 scale-105 md:scale-100 xl:scale-110` 
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                {tier.highlight && (
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-${tier.color}-500 px-4 py-1 text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap shadow-md`}>
                    {tier.badge}
                  </div>
                )}
                
                <div className="mb-4">
                    <tier.icon className={`w-8 h-8 text-${tier.color}-500`} />
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
                      <div className="flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                      </div>
                      <p className="ml-3 text-slate-600 dark:text-slate-300">{feature}</p>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectPlan(tier.id as SubscriptionPlan)}
                  className={`w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    tier.highlight
                      ? `bg-${tier.color}-500 text-white hover:bg-${tier.color}-600 shadow-md`
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
