export interface PricingTier {
  id: 'commis' | 'chef-de-partie' | 'sous-chef' | 'executive';
  name: string;
  badge?: string;
  tagline: string;
  priceZAR: number;
  billingPeriod: string;
  targetAudience: string;
  highlighted?: boolean;
  color: string;
  features: string[];
  ctaLabel: string;
}

// Centralized pricing configuration - easily adjustable anytime
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'commis',
    name: 'Commis',
    badge: 'Student Edition',
    tagline: 'Culinary Students & City & Guilds Apprentices',
    priceZAR: 149,
    billingPeriod: 'month',
    targetAudience: 'Occupational students, apprentice commis chefs, and culinary schools',
    color: 'emerald',
    features: [
      'City & Guilds & QCTO curriculum study guide generator',
      'Basic Recipe Card costing & Escoffier standard yields',
      'Statutory SANS 10330 HACCP safety templates',
      'South African ZAR wholesale ingredient benchmark index',
      'Student assignment PDF exports & flash cards',
      'Chef Mentor AI academic tutoring'
    ],
    ctaLabel: 'Select Commis Student'
  },
  {
    id: 'chef-de-partie',
    name: 'Chef de Partie',
    badge: 'Pro Station',
    tagline: 'Working Chefs & Independent Caterers',
    priceZAR: 299,
    billingPeriod: 'month',
    targetAudience: 'Line chefs, private dining chefs, and boutique catering founders',
    color: 'teal',
    features: [
      'Everything in Commis, plus:',
      'Live Plate Costing Engine with custom markup calculators',
      'Menu Engineering Profit Matrix (Stars, Plow Horses, Puzzles, Dogs)',
      'Automated Allergen Matrix (Gluten, Dairy, Nuts, Shellfish, Halal)',
      'Client proposal generation with instant ZAR totals',
      'High-resolution PDF proposal exports',
      'Offline Subterranean zero-signal capability'
    ],
    ctaLabel: 'Choose Chef de Partie'
  },
  {
    id: 'sous-chef',
    name: 'Sous Chef',
    badge: 'Most Popular',
    tagline: 'Busy Caterers & Boutique Hotels',
    priceZAR: 599,
    billingPeriod: 'month',
    targetAudience: 'High-volume banqueting teams, wedding caterers, and 4-star hotels',
    highlighted: true,
    color: 'lime',
    features: [
      'Everything in Chef de Partie, plus:',
      'Full Banquet Event Order (BEO) generation with production schedules',
      'Dynamic Yield & Portion Multipliers (1.0x to 1.5x buffer)',
      'Supplier-Sorted Hotel Shopping Lists (Butchery, Produce, Dairy, Dry Goods)',
      'Beverage & Wine Pairing recommendation matrix',
      'Direct copy formatted for Google Docs & Word banquet packs',
      'Priority kitchen support'
    ],
    ctaLabel: 'Upgrade to Sous Chef'
  },
  {
    id: 'executive',
    name: 'Executive Chef',
    badge: 'Hotel Enterprise',
    tagline: 'Full-Service Hotels & Multi-Outlet Resorts',
    priceZAR: 1250,
    billingPeriod: 'month',
    targetAudience: 'Executive Chefs, F&B Directors, and multi-outlet hospitality properties',
    color: 'cyan',
    features: [
      'Everything in Sous Chef, plus:',
      'Multi-Outlet Awareness (Restaurant, Banquets, Room Service, Staff Meals)',
      'Real-time Food Cost % and Contribution Margin telemetry',
      'Multi-user seats for Sous Chefs, Cost Controllers & Banquet Managers',
      'Custom hotel logo branding on BEOs & client proposals',
      'Direct Paystack corporate billing & VAT tax invoicing',
      'Dedicated Hospitality Onboarding & Disney Cruise Line standards'
    ],
    ctaLabel: 'Activate Executive Hotel Hub'
  }
];

export const DEFAULT_HOTEL_TIER = PRICING_TIERS[2]; // Sous Chef / Executive
