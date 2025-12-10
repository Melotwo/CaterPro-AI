import { Briefcase, Heart, PartyPopper } from 'lucide-react';
import { MenuSection, PpeProduct } from './types';

export const EVENT_TYPES = [
  'Corporate Lunch',
  'Wedding Reception',
  'Cocktail Party',
  'Birthday Dinner',
  'Holiday Gathering',
  'Private Brunch',
  'Daily Specials Menu',
  'Café/Deli Menu',
  'Other...',
];

export const GUEST_COUNT_OPTIONS = [
  '10-20',
  '21-50',
  '51-100',
  '100+',
];

export const BUDGET_LEVELS = [
    { value: '$', label: '$ - Casual & Affordable' },
    { value: '$$', label: '$$ - Mid-Range & Elegant' },
    { value: '$$$', label: '$$$ - High-End & Luxurious' },
];

export const SERVICE_STYLES = [
  'Standard Catering',
  'Upscale Elegant',
  'Fine Dining',
  'Michelin-Star Inspired',
  'Buffet Style',
  'Plated Service',
  'Family Style',
  'Food Stations',
];

export const CUISINES = [
  'Any',
  'Italian',
  'Mexican',
  'Chinese',
  'Indian',
  'Japanese',
  'Thai',
  'French',
  'Greek',
  'Spanish',
  'American',
  'Mediterranean',
];

export const DIETARY_RESTRICTIONS = [
  { category: 'Common', items: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'] },
  { category: 'Allergies', items: ['Nut-Free', 'Shellfish-Free', 'Soy-Free', 'Egg-Free'] },
  { category: 'Health', items: ['Low-Carb', 'Low-Fat', 'Low-Sodium', 'Sugar-Free'] },
];

export const exampleScenarios = [
  {
    IconComponent: Briefcase,
    title: 'Modern Corporate Lunch',
    eventType: 'Corporate Lunch',
    guestCount: '21-50',
    cuisine: 'American',
    budget: '$$',
    serviceStyle: 'Upscale Elegant',
    dietaryRestrictions: ['Gluten-Free'],
  },
  {
    IconComponent: Heart,
    title: 'Elegant Wedding Dinner',
    eventType: 'Wedding Reception',
    guestCount: '51-100',
    cuisine: 'French',
    budget: '$$$',
    serviceStyle: 'Fine Dining',
    dietaryRestrictions: [],
  },
  {
    IconComponent: PartyPopper,
    title: 'Casual Birthday Party',
    eventType: 'Birthday Dinner',
    guestCount: '10-20',
    cuisine: 'Mexican',
    budget: '$',
    serviceStyle: 'Standard Catering',
    dietaryRestrictions: ['Vegetarian'],
  },
];

export const MENU_SECTIONS: { title: string; key: MenuSection }[] = [
    { title: 'Appetizers', key: 'appetizers' },
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
    priceRange: '$$',
  },
  {
    id: 2,
    name: 'Insulated Food Pan Carrier',
    description: 'Heavy-duty carrier that maintains safe food temperatures for hours during transport.',
    image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=800&q=80',
    priceRange: '$$$',
  },
  {
    id: 3,
    name: 'Premium Disposable Dinnerware Set',
    description: 'Elegant plastic plates and cutlery for 100 guests. Looks like real china.',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80',
    priceRange: '$',
  },
  {
    id: 4,
    name: '3-Tier Serving Stand',
    description: 'A beautiful and practical way to display appetizers, desserts, or small bites.',
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=800&q=80', // Reliable tiered stand image
    priceRange: '$',
  },
  {
    id: 5,
    name: 'Commercial Drink Dispenser',
    description: 'Two 3-gallon dispensers for serving cold beverages like iced tea or lemonade.',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
    priceRange: '$$',
  },
  {
    id: 6,
    name: 'Portable Cambro GoBox',
    description: 'Top-loading insulated carrier, lightweight and perfect for smaller deliveries.',
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80',
    priceRange: '$$$',
  },
];

export const PROPOSAL_THEMES = {
  classic: {
    name: 'Classic Light',
    preview: ['bg-white', 'bg-slate-800', 'bg-primary-500', 'bg-slate-500'],
    classes: {
      container: 'bg-white text-slate-700 print:bg-white print:text-black',
      title: 'text-slate-900 print:text-black',
      description: 'text-slate-600 print:text-slate-600',
      hr: 'border-slate-200',
      sectionContainer: 'border-2 border-slate-100',
      sectionTitle: 'text-slate-900',
      sectionIcon: 'bg-primary-500 text-white',
      card: 'bg-slate-50 border-slate-200',
      cardTitle: 'text-slate-800',
      cardText: 'text-slate-600',
      checkbox: 'text-primary-500 border-slate-300 bg-white focus:ring-primary-400',
      checkedText: 'line-through text-slate-400',
      uncheckedText: 'text-slate-700',
      sourcingLink: 'text-primary-600 hover:underline',
      shoppingStoreTitle: 'text-slate-800',
      shoppingCategoryTitle: 'text-slate-500 border-slate-200',
    },
  },
  'modern-dark': {
    name: 'Modern Dark',
    preview: ['bg-slate-900', 'bg-white', 'bg-primary-500', 'bg-slate-400'],
    classes: {
      container: 'bg-slate-900 text-slate-300 print:bg-white print:text-black',
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
      uncheckedText: 'text-slate-300',
      sourcingLink: 'text-primary-400 hover:underline',
      shoppingStoreTitle: 'text-slate-200',
      shoppingCategoryTitle: 'text-slate-400 border-slate-700',
    },
  },
  ocean: {
    name: 'Ocean Breeze',
    preview: ['bg-cyan-50', 'bg-cyan-800', 'bg-teal-500', 'bg-cyan-600'],
    classes: {
      container: 'bg-cyan-50 text-cyan-800 print:bg-white print:text-black',
      title: 'text-cyan-900 print:text-black',
      description: 'text-cyan-700 print:text-slate-600',
      hr: 'border-cyan-200',
      sectionContainer: 'border-2 border-cyan-100',
      sectionTitle: 'text-cyan-900',
      sectionIcon: 'bg-teal-500 text-white',
      card: 'bg-white border-cyan-200',
      cardTitle: 'text-cyan-900',
      cardText: 'text-cyan-700',
      checkbox: 'text-teal-500 border-cyan-300 bg-white focus:ring-teal-400',
      checkedText: 'line-through text-cyan-400',
      uncheckedText: 'text-cyan-800',
      sourcingLink: 'text-teal-600 hover:underline',
      shoppingStoreTitle: 'text-cyan-900',
      shoppingCategoryTitle: 'text-cyan-600 border-cyan-200',
    },
  },
  sunset: {
    name: 'Sunset Warmth',
    preview: ['bg-orange-50', 'bg-red-900', 'bg-amber-600', 'bg-orange-700'],
    classes: {
      container: 'bg-orange-50 text-orange-900 print:bg-white print:text-black',
      title: 'text-red-900 print:text-black',
      description: 'text-orange-800 print:text-slate-600',
      hr: 'border-orange-200',
      sectionContainer: 'border-2 border-orange-100',
      sectionTitle: 'text-red-900',
      sectionIcon: 'bg-amber-600 text-white',
      card: 'bg-white border-orange-200',
      cardTitle: 'text-red-900',
      cardText: 'text-orange-800',
      checkbox: 'text-amber-600 border-orange-300 bg-white focus:ring-amber-500',
      checkedText: 'line-through text-orange-400',
      uncheckedText: 'text-orange-900',
      sourcingLink: 'text-amber-700 hover:underline',
      shoppingStoreTitle: 'text-red-900',
      shoppingCategoryTitle: 'text-orange-700 border-orange-200',
    },
  },
};
