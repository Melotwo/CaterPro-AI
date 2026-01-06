
import React from 'react';

export interface DeliveryFeeStructure {
  baseFee: number;
  perUnitRate: number;
  unit: 'mile' | 'km';
  currency: string;
}

export interface SalesScript {
  phase: 'before' | 'during' | 'after';
  hook: string;
  script: string;
}

export interface Menu {
  menuTitle: string;
  description: string;
  appetizers: string[];
  mainCourses: string[];
  sideDishes: string[];
  dessert: string[];
  beveragePairings: BeveragePairing[];
  miseEnPlace: string[];
  serviceNotes: string[];
  deliveryLogistics: string[];
  shoppingList: ShoppingListItem[];
  recommendedEquipment: RecommendedEquipment[];
  dietaryNotes?: string[];
  image?: string;
  groundingChunks?: GroundingChunk[];
  theme?: string;
  deliveryFeeStructure?: DeliveryFeeStructure;
  /**
   * AI-generated sales scripts based on the marketing strategy chosen.
   */
  salesScripts?: SalesScript[];
  /**
   * Search intent keywords for ranking on ChatGPT/Perplexity.
   */
  aiKeywords?: string[];
}

export interface BeveragePairing {
  menuItem: string;
  pairingSuggestion: string;
}

export interface ShoppingListItem {
  store: string;
  category: string;
  item: string;
  quantity: string;
  description?: string;
  affiliateSearchTerm?: string;
  estimatedCost?: string;
  brandSuggestion?: string;
}

export interface RecommendedEquipment {
  item: string;
  description: string;
}

export interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
  };
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface SavedMenu {
  id: number;
  title: string;
  content: Menu;
  savedAt: string;
}

export interface PpeProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  priceRange: '$' | '$$' | '$$$';
}

export interface ErrorState {
  title: string;
  message: string | React.ReactNode;
}

export interface ValidationErrors {
  eventType?: string;
  guestCount?: string;
  cuisine?: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface GenerationHistoryItem {
  id: number;
  eventType: string;
  guestCount: string;
  cuisine: string;
  serviceStyle: string;
  dietaryRestrictions: string[];
  timestamp: string;
}

export type MenuSection =
  | 'appetizers'
  | 'mainCourses'
  | 'sideDishes'
  | 'dessert'
  | 'beveragePairings'
  | 'miseEnPlace'
  | 'serviceNotes'
  | 'deliveryLogistics'
  | 'shoppingList'
  | 'recommendedEquipment'
  | 'dietaryNotes';

export interface Supplier {
  name: string;
  specialty: string;
  mapsUri?: string;
  title?: string;
}

export interface EducationContent {
  title: string;
  curriculum: string;
  level: string;
  overview: string;
  modules: {
    title: string;
    content: string[];
  }[];
  keyVocabulary: string[];
  assessmentCriteria: string[];
  practicalExercises: string[];
}
