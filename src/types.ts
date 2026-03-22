
import React from 'react';

export interface DeliveryFeeStructure {
  baseFee: number;
  perUnitRate: number;
  unit: 'mile' | 'km';
  currency: string;
}

export interface MenuItemAnalysis {
  name: string;
  category: 'Star' | 'Plow Horse' | 'Puzzle' | 'Dog';
  profitMargin: number; // 1-10
  popularityPotential: number; // 1-10
  evocativeDescription: string;
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
  dishImages?: string[];
  groundingChunks?: GroundingChunk[];
  theme?: string;
  deliveryFeeStructure?: DeliveryFeeStructure;
  businessAnalysis?: MenuItemAnalysis[];
  safetyProtocols?: string[];
  haccpSafety?: { point: string; requirement: string }[];
  salesScripts?: SalesScript[];
  aiKeywords?: string[];
  ingredients?: CloudIngredient[]; // Added for scaling
  labor?: CloudLabor; // Added for costing
}

export interface ScannedMenuCosting {
  menuItems: {
    name: string;
    identifiedIngredients: string[];
    estimatedPortionCost: string;
    suggestedSupplier: string;
  }[];
  totalEstimatedMenuCost: string;
  marginAdvice: string;
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

export interface CloudMenu extends Menu {
  id?: string;
  userId: string;
  baseGuestCount: number;
  currentGuestCount: number;
  eventDate?: string;
  createdAt: string;
  updatedAt: string;
  ingredients?: CloudIngredient[];
  labor?: CloudLabor;
}

export interface CloudIngredient {
  name: string;
  baseQuantity: number;
  unit: string;
  category?: string;
  yieldPercentage?: number;
  estimatedCost?: number;
}

export interface CloudLabor {
  estimatedPrepTime: number;
  hourlyRate: number;
}

export interface SavedMenu {
  id: string; // Changed from number to string for Firestore IDs
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

export interface ShiftIngredient {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
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
