import React from 'react';
import { Check, Star, Zap, Briefcase, Phone, ArrowRight, GraduationCap, Building2 } from 'lucide-react';
import { SubscriptionPlan } from '../hooks/useAppSubscription';
import Footer from './Footer';

interface PricingPageProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

// Define explicit style maps for Tailwind to pick up
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

const tiers = [
  {
    name: 'Free',
    id: 'free',
    price: '$0',
    icon: Star,
    description: 'Perfect for daily use and individual meal prep.',
    features: [
      '3 Menu Generations per Day',
      'Basic Menu Export (PDF)',
      'Standard Theme',
      'Watermarked Documents',
    ],
    cta: 'Start for Free',
    colorKey: 'slate' as keyof typeof TIER_STYLES,
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
    colorKey: 'green' as keyof typeof TIER_STYLES,
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
    colorKey: 'amber' as keyof typeof TIER_STYLES,
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
      'Education & Training Hub',
    ],
    cta: 'Get Business',
    colorKey: 'royal' as keyof typeof TIER_STYLES,
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
              From individual meal planning to hospital catering and large events.
            </p>
          </div>

          {/* Adjusted grid for 4 items: lg:grid-cols-4 */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {tiers.map((tier) => {
              const styles = TIER_STYLES[tier.colorKey];
              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col rounded-2xl border p-6 shadow-sm h-full transition-transform hover:-translate-y-1 ${
                    tier.highlight 
                      ? `${styles.highlightBorder} bg-white dark:bg-slate-900 z-10 scale-105 md:scale-100 xl:scale-110` 
                      : `${styles.border} bg-white dark:bg-slate-900`
                  }`}
                >
                  {tier.highlight && (
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full px-4 py-1 text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap shadow-md ${styles.badge}`}>
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
                      tier.highlight ? styles.buttonHighlight : styles.button
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* High Ticket / Enterprise Section */}
            <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                LIMITED AVAILABILITY
              </div>
              <div className="px-6 py-10 md:p-12 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Briefcase className="h-8 w-8 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Founding Member Deal
                    </h2>
                    <p className="text-slate-400 text-sm">For Catering Business Owners</p>
                  </div>
                </div>
                
                <p className="text-slate-300 text-base mb-8 flex-grow">
                  Secure lifetime access to CaterPro AI plus a 1-on-1 business strategy setup. Stop paying monthly subscriptions and own your tools.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300 text-sm">
                    <Check className="h-4 w-4 text-amber-500 mr-3" />
                    <strong>Lifetime Access</strong> to Business Plan
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <Check className="h-4 w-4 text-amber-500 mr-3" />
                    1-on-1 Menu Engineering Call (60 min)
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <Check className="h-4 w-4 text-amber-500 mr-3" />
                    List of Top 50 Wedding Venues (SA)
                  </li>
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <a 
                    href="mailto:contact@caterpro.ai?subject=Founding Member Inquiry"
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-bold rounded-md text-slate-900 bg-amber-500 hover:bg-amber-400 transition-colors"
                  >
                    Get Lifetime Deal
                  </a>
                </div>
              </div>
            </div>

            {/* B2B / Education Section */}
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-lg relative">
              <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                INSTITUTIONAL
              </div>
              <div className="px-6 py-10 md:p-12 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <GraduationCap className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Schools & Healthcare
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Bulk Licenses for Students & Hospitals</p>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 text-base mb-8 flex-grow">
                  Equip your staff or students with industry-standard AI tools. Perfect for dieticians planning hospital menus or culinary schools.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
                    <Check className="h-4 w-4 text-primary-500 mr-3" />
                    Discounted Bulk Accounts
                  </li>
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
                    <Check className="h-4 w-4 text-primary-500 mr-3" />
                    Specialized Medical Diet Modules
                  </li>
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
                    <Check className="h-4 w-4 text-primary-500 mr-3" />
                    Invoice Payment Options
                  </li>
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <a 
                    href="mailto:contact@caterpro.ai?subject=Education License Inquiry"
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-slate-300 dark:border-slate-600 text-sm font-bold rounded-md text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Contact Sales
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
