import React from 'react';
import { Check, Star } from 'lucide-react';
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
    description: 'Perfect for getting started and exploring basic features.',
    features: [
      '3 Menu Generations per Day',
      'Basic Menu Sections',
      'Classic Light Theme',
      'Download PDF with Watermark',
    ],
    cta: 'Continue with Free',
  },
  {
    name: 'Premium',
    id: 'premium',
    price: '$9',
    priceSuffix: '/ month',
    description: 'For professionals who need more power and customization.',
    features: [
      'Unlimited Menu Generations',
      'All Proposal Themes',
      'Save up to 10 Menus',
      'AI Beverage Pairings',
      'Recommended Equipment',
      'AI Chat Assistant',
      'Download PDF without Watermark',
    ],
    cta: 'Upgrade to Premium',
  },
  {
    name: 'Pro',
    id: 'pro',
    price: '$29',
    priceSuffix: '/ month',
    description: 'The ultimate toolkit for growing your catering business.',
    features: [
      'All Premium features',
      'Unlimited Saved Menus',
      'Shareable Proposal Links',
      'Find Local Suppliers Feature',
      'In-Place Menu Editing',
      'Bulk Shopping List Editing',
      'Generate Custom Menu Items',
    ],
    cta: 'Start Pro Trial',
    highlight: true,
    badge: '3 Months Free',
  },
];

const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Choose Your Plan
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Affordable plans for every food business, from spaza shops to professional caterers.
            </p>
          </div>

          <div className="mt-12 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:items-end">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl border p-8 shadow-sm ${
                  tier.highlight ? 'border-primary-500 ring-2 ring-primary-500' : 'border-slate-200 dark:border-slate-700'
                } bg-white dark:bg-slate-900`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 -translate-y-1/2 transform rounded-full bg-primary-500 px-4 py-1.5 text-sm font-semibold text-white">
                    <Star className="inline-block w-4 h-4 mr-1" />
                    Best Value
                  </div>
                )}
                {tier.badge && (
                  <div className="absolute top-8 right-8 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900">
                    {tier.badge}
                  </div>
                )}
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{tier.name}</h3>
                <p className="mt-4 text-slate-500 dark:text-slate-400 min-h-[3rem]">{tier.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{tier.price}</span>
                  {tier.priceSuffix && (
                    <span className="text-base font-medium text-slate-500 dark:text-slate-400">{tier.priceSuffix}</span>
                  )}
                </div>

                <ul role="list" className="mt-8 space-y-4 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" aria-hidden="true" />
                      </div>
                      <p className="ml-3 text-base text-slate-600 dark:text-slate-300">{feature}</p>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectPlan(tier.id as SubscriptionPlan)}
                  className={`mt-10 block w-full rounded-md px-6 py-3 text-center text-base font-medium transition-colors ${
                    tier.highlight
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/40 dark:text-primary-200 dark:hover:bg-primary-900/60'
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
