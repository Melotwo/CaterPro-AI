import { Briefcase, Heart, PartyPopper } from 'lucide-react';
import { MenuSection } from './types.ts';

export const EVENT_TYPES = [
  'Corporate Lunch',
  'Wedding Reception',
  'Cocktail Party',
  'Birthday Dinner',
  'Holiday Gathering',
  'Private Brunch',
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
    dietaryRestrictions: ['Gluten-Free'],
  },
  {
    IconComponent: Heart,
    title: 'Elegant Wedding Dinner',
    eventType: 'Wedding Reception',
    guestCount: '51-100',
    cuisine: 'French',
    budget: '$$$',
    dietaryRestrictions: [],
  },
  {
    IconComponent: PartyPopper,
    title: 'Casual Birthday Party',
    eventType: 'Birthday Dinner',
    guestCount: '10-20',
    cuisine: 'Mexican',
    budget: '$',
    dietaryRestrictions: ['Vegetarian'],
  },
];

export const MENU_SECTIONS: { title: string; key: MenuSection }[] = [
    { title: 'Appetizers', key: 'appetizers' },
    { title: 'Main Courses', key: 'mainCourses' },
    { title: 'Side Dishes', key: 'sideDishes' },
    { title: 'Dessert', key: 'dessert' },
    { title: 'Service & Plating Notes', key: 'serviceNotes' },
    { title: 'Delivery & Logistics', key: 'deliveryLogistics' },
];

export const EDITABLE_MENU_SECTIONS: { title: string; key: MenuSection }[] = [
    { title: 'Appetizers', key: 'appetizers' },
    { title: 'Main Courses', key: 'mainCourses' },
    { title: 'Side Dishes', key: 'sideDishes' },
    { title: 'Dessert', key: 'dessert' },
];
