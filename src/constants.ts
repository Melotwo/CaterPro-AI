
import { MenuSection, PpeProduct } from './types';

export const CURRENCIES = [
  { code: 'ZAR', symbol: 'R', label: 'South African Rand (R)' },
];

export const EVENT_TYPES = [
  'Christmas Day Feast 🎅',
  'Christmas Eve Dinner',
  'Holiday Office Party',
  'New Year\'s Eve Gala 🎆',
  'Corporate Lunch',
  'Wedding Reception',
  'Hospital / Patient Catering',
  'School Cafeteria / Canteen',
  'Retirement Home Meal Service',
  'Individual Meal Prep (Weekly)',
  'Cocktail Party',
  'Birthday Dinner',
  'Holiday Gathering',
  'Private Brunch',
  'Daily Specials Menu',
  'Café/Deli Menu',
  'Other...',
];

export const GUEST_COUNT_OPTIONS = [
  '1 (Individual)',
  '2-9 (Family/Small Group)',
  '10-20',
  '21-50',
  '21-50',
  '51-100',
  '100-500 (Institutional)',
  '500-1000 (Large Event)',
  '1000+ (Enterprise/Hospital)',
  '5000+ (Campus/Festival)',
];

export const BUDGET_LEVELS = [
    { value: 'R', label: 'Affordable / Economy' },
    { value: 'RR', label: 'Mid-Range / Professional' },
    { value: 'RRR', label: 'High-End / Luxurious' },
];

export const SERVICE_STYLES = [
  'Standard Catering',
  'Hospital Tray Service',
  'Cafeteria Line / Buffet',
  'Meal Prep Containers',
  'Upscale Elegant',
  'Fine Dining',
  'Michelin-Star Inspired',
  'Plated Service',
  'Family Style',
  'Food Stations',
  'Braai / BBQ',
];

export const CUISINES = [
  'Any / International',
  'South African',
  'Hungarian (Cruise Line Style) 🇭🇺',
  'African',
  'Croatian / Balkan',
  'Italian',
  'Mediterranean',
  'Mexican',
  'Chinese',
  'Indian',
  'Japanese',
  'Thai',
  'French',
  'Greek',
  'Spanish',
  'American',
];

export const DIETARY_RESTRICTIONS = [
  { category: 'Medical / Hospital', items: ['Diabetic Friendly', 'Renal Diet (Low Potassium/Phos)', 'Soft Food / Pureed / Dysphagia', 'Liquid Diet', 'Low Sodium (Cardiac)', 'High Protein (Recovery)', 'Neutropenic (Low bacteria)', 'Allergen-Free Zone'] },
  { category: 'Common', items: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'] },
  { category: 'Allergies', items: ['Nut-Free', 'Shellfish-Free', 'Soy-Free', 'Egg-Free'] },
  { category: 'Health', items: ['Low-Carb', 'Keto', 'Paleo', 'Halaal', 'Kosher'] },
];

export const CURRICULUM_STANDARDS = [
  { id: 'generic', label: 'General International Standard (Global)' },
  { id: 'city_guilds_sa', label: 'City & Guilds (South Africa/Intl)' },
  { id: 'qcto_sa', label: 'QCTO (South Africa - Occupational)' },
  { id: 'cia_usa', label: 'Culinary Institute of America (USA)' },
  { id: 'tafe_aus', label: 'TAFE (Australia)' },
];

export const EDUCATION_LEVELS = [
  'Beginner / Short Course',
  'Certificate (Level 1-2)',
  'Diploma (Level 3)',
  'Professional / Management',
];

export const EDUCATION_TOPICS = [
  'Food Safety & Hygiene',
  'Knife Skills & Prep',
  'Stocks, Soups & Sauces',
  'Meat & Poultry Preparation',
  'Fish & Shellfish',
  'Vegetable & Plant-Based Cookery',
  'Pastry & Baking Arts',
  'Menu Planning & Costing',
  'Hospitality Management',
  'Wine & Beverage Service',
  'Therapeutic Nutrition (Medical)',
];

export const exampleScenarios = [
  {
    icon: '🎁',
    title: 'Grand Christmas Feast 🎄',
    eventType: 'Christmas Day Feast 🎅',
    guestCount: '10-20',
    cuisine: 'Mediterranean',
    budget: 'RRR',
    serviceStyle: 'Family Style',
    dietaryRestrictions: ['Gluten-Free'],
  },
  {
    icon: '🎉',
    title: 'South African Wedding',
    eventType: 'Wedding Reception',
    guestCount: '51-100',
    cuisine: 'South African',
    budget: 'RRR',
    serviceStyle: 'Plated Service',
    dietaryRestrictions: [],
  },
  {
    icon: '💼',
    title: 'Modern Corporate Lunch',
    eventType: 'Corporate Lunch',
    guestCount: '21-50',
    cuisine: 'American',
    budget: 'RR',
    serviceStyle: 'Upscale Elegant',
    dietaryRestrictions: ['Gluten-Free'],
  },
  {
    icon: '🩺',
    title: 'Hospital Recovery Menu',
    eventType: 'Hospital / Patient Catering',
    guestCount: '100-500 (Institutional)',
    cuisine: 'Any / International',
    budget: 'R',
    serviceStyle: 'Hospital Tray Service',
    dietaryRestrictions: ['Low Sodium (Cardiac)', 'Soft Food / Pureed'],
  },
];

export const MENU_SECTIONS: { title: string; key: MenuSection }[] = [
    { title: 'Appetizers / Starters', key: 'appetizers' },
    { title: 'Main Courses', key: 'mainCourses' },
    { title: 'Side Dishes', key: 'sideDishes' },
    { title: 'Dessert', key: 'dessert' },
    { title: 'Dietary Accommodations', key: 'dietaryNotes' },
    { title: 'Beverage Pairings', key: 'beveragePairings' },
    { title: 'Mise en Place', key: 'miseEnPlace' },
    { title: 'Service & Plating Notes', key: 'serviceNotes' },
    { title: 'Delivery & Logistics', key: 'deliveryLogistics' },
    { title: 'Shopping List', key: 'shoppingList' },
    { title: 'Recommended Equipment & Supplies', key: 'recommendedEquipment' },
];

export const EDITABLE_MENU_SECTIONS: { title: string; key: MenuSection }[] = [
    { title: 'Appetizers', key: 'appetizers' },
    { title: 'Main Courses', key: 'mainCourses' },
    { title: 'Side Dishes', key: 'sideDishes' },
    { title: 'Dessert', key: 'dessert' },
];

export const RECOMMENDED_PRODUCTS: PpeProduct[] = [
  {
    id: 1,
    name: '8-Quart Chafing Dish Set',
    description: 'Stainless steel set with fuel holders to keep your main courses perfectly warm.',
    image: 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?auto=format&fit=crop&w=800&q=80',
    priceRange: 'RR',
  },
  {
    id: 2,
    name: 'Insulated Food Pan Carrier',
    description: 'Heavy-duty carrier that maintains safe food temperatures for hours during transport.',
    image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=800&q=80',
    priceRange: 'RRR',
  },
  {
    id: 3,
    name: 'Premium Disposable Dinnerware Set',
    description: 'Elegant plastic plates and cutlery for 100 guests. Looks like real china.',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80',
    priceRange: 'R',
  },
  {
    id: 4,
    name: '3-Tier Serving Stand',
    description: 'A beautiful and practical way to display appetizers, desserts, or small bites.',
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=800&q=80',
    priceRange: 'R',
  },
  {
    id: 5,
    name: 'Commercial Drink Dispenser',
    description: 'Two 3-gallon dispensers for serving cold beverages like iced tea or lemonade.',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
    priceRange: 'RR',
  },
  {
    id: 6,
    name: 'Portable Cambro GoBox',
    description: 'Top-loading insulated carrier, lightweight and perfect for smaller deliveries.',
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80',
    priceRange: 'RRR',
  },
];

export const PRICING_DATABASE: Record<string, { price: number; unit: string }> = {
  'Wagyu Brisket': { price: 350.00, unit: 'kg' },
  'Karoo Lamb': { price: 185.00, unit: 'kg' },
  'Potbrood Flour': { price: 22.50, unit: 'kg' },
  'Atlantic Salmon': { price: 420.00, unit: 'kg' },
  'Free Range Chicken': { price: 85.00, unit: 'kg' },
  'Beef Fillet': { price: 295.00, unit: 'kg' },
  'Pork Belly': { price: 115.00, unit: 'kg' },
  'King Prawns': { price: 380.00, unit: 'kg' },
  'Butter': { price: 120.00, unit: 'kg' },
  'Heavy Cream': { price: 65.00, unit: 'L' },
  'Olive Oil': { price: 185.00, unit: 'L' },
  'Basmati Rice': { price: 45.00, unit: 'kg' },
  'Micro Greens': { price: 35.00, unit: 'punnet' },
  'Truffle Oil': { price: 450.00, unit: 'unit' },
  'Saffron': { price: 1200.00, unit: 'unit' },
  'Potatoes': { price: 15.00, unit: 'kg' },
  'Onions': { price: 12.00, unit: 'kg' },
  'Garlic': { price: 140.00, unit: 'kg' },
  'Fresh Herbs': { price: 15.00, unit: 'bunch' },
  'Lemons': { price: 25.00, unit: 'kg' },
};

export const PROPOSAL_THEMES = {
  classic: {
    name: 'Classic Light',
    preview: ['bg-white', 'bg-slate-800', 'bg-primary-500', 'bg-slate-500'],
    classes: {
      container: 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 print:bg-white print:text-black',
      title: 'text-slate-900 dark:text-white print:text-black',
      description: 'text-slate-600 dark:text-slate-200 print:text-slate-600',
      hr: 'border-slate-200 dark:border-slate-800',
      sectionContainer: 'border-2 border-slate-100 dark:border-slate-800',
      sectionTitle: 'text-slate-900 dark:text-white',
      sectionIcon: 'bg-primary-500 text-white',
      card: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700',
      cardTitle: 'text-slate-800 dark:text-slate-200',
      cardText: 'text-slate-600 dark:text-slate-200',
      checkbox: 'text-primary-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-primary-400',
      checkedText: 'line-through text-slate-400 dark:text-slate-500',
      uncheckedText: 'text-slate-700 dark:text-slate-200',
      sourcingLink: 'text-primary-600 dark:text-primary-400 hover:underline',
      shoppingStoreTitle: 'text-slate-800 dark:text-slate-200',
      shoppingCategoryTitle: 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800',
    },
  },
  'modern-dark': {
    name: 'Modern Dark',
    preview: ['bg-slate-900', 'bg-white', 'bg-primary-500', 'bg-slate-400'],
    classes: {
      container: 'bg-slate-900 text-slate-200 print:bg-white print:text-black',
      title: 'text-white print:text-black',
      description: 'text-slate-400 print:text-slate-600',
      hr: 'border-slate-700',
      sectionContainer: 'border-2 border-slate-800',
      sectionTitle: 'text-white',
      sectionIcon: 'bg-primary-500 text-white',
      card: 'bg-slate-800/50 border-slate-700',
      cardTitle: 'text-slate-200',
      cardText: 'text-slate-400',
      checkbox: 'text-primary-500 border-slate-600 bg-slate-900 focus:ring-primary-400',
      checkedText: 'line-through text-slate-500',
      uncheckedText: 'text-slate-200',
      sourcingLink: 'text-primary-400 hover:underline',
      shoppingStoreTitle: 'text-slate-200',
      shoppingCategoryTitle: 'text-slate-400 border-slate-700',
    },
  },
  ocean: {
    name: 'Ocean Breeze',
    preview: ['bg-cyan-50', 'bg-cyan-800', 'bg-teal-500', 'bg-cyan-600'],
    classes: {
      container: 'bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-100 print:bg-white print:text-black',
      title: 'text-cyan-900 dark:text-white print:text-black',
      description: 'text-cyan-700 dark:text-cyan-100 print:text-slate-600',
      hr: 'border-cyan-200 dark:border-cyan-800',
      sectionContainer: 'border-2 border-cyan-100 dark:border-cyan-900',
      sectionTitle: 'text-cyan-900 dark:text-white',
      sectionIcon: 'bg-teal-500 text-white',
      card: 'bg-white dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800',
      cardTitle: 'text-cyan-900 dark:text-white',
      cardText: 'text-cyan-700 dark:text-cyan-100',
      checkbox: 'text-teal-500 border-cyan-300 dark:border-cyan-700 bg-white dark:bg-cyan-950 focus:ring-teal-400',
      checkedText: 'line-through text-cyan-400 dark:text-cyan-600',
      uncheckedText: 'text-cyan-800 dark:text-cyan-100',
      sourcingLink: 'text-teal-600 dark:text-teal-400 hover:underline',
      shoppingStoreTitle: 'text-cyan-900 dark:text-white',
      shoppingCategoryTitle: 'text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
    },
  },
  sunset: {
    name: 'Sunset Warmth',
    preview: ['bg-orange-50', 'bg-red-900', 'bg-amber-600', 'bg-orange-700'],
    classes: {
      container: 'bg-orange-50 dark:bg-orange-950 text-orange-900 dark:text-orange-100 print:bg-white print:text-black',
      title: 'text-red-900 dark:text-white print:text-black',
      description: 'text-orange-800 dark:text-orange-100 print:text-slate-600',
      hr: 'border-orange-200 dark:border-orange-900',
      sectionContainer: 'border-2 border-orange-100 dark:border-orange-900',
      sectionTitle: 'text-red-900 dark:text-white',
      sectionIcon: 'bg-amber-600 text-white',
      card: 'bg-white dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
      cardTitle: 'text-red-900 dark:text-white',
      cardText: 'text-orange-800 dark:text-orange-100',
      checkbox: 'text-amber-600 border-orange-300 dark:border-orange-700 bg-white dark:bg-orange-950 focus:ring-amber-500',
      checkedText: 'line-through text-orange-400 dark:text-orange-600',
      uncheckedText: 'text-orange-900 dark:text-orange-100',
      sourcingLink: 'text-amber-700 dark:text-amber-400 hover:underline',
      shoppingStoreTitle: 'text-red-900 dark:text-white',
      shoppingCategoryTitle: 'text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    },
  },
};
