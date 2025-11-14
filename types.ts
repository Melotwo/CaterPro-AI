import React from 'react';

export interface Menu {
  menuTitle: string;
  description: string;
  appetizers: string[];
  mainCourses: string[];
  sideDishes: string[];
  dessert: string[];
  serviceNotes: string[];
  deliveryLogistics: string[];
}

export interface SavedMenu {
  id: number;
  title: string;
  content: Menu;
  savedAt: string;
}

// Fix: Add PpeProduct interface for unused product components to resolve type errors.
export interface PpeProduct {
  id: number;
  name: string;
  description: string;
  image: string;
}

/**
 * Defines the structure for displaying error messages to the user.
 */
export interface ErrorState {
  title:string;
  message: string | React.ReactNode;
}

/**
 * Defines the structure for form validation errors.
 */
export interface ValidationErrors {
    eventType?: string;
    guestCount?: string;
    cuisine?: string;
}

/**
 * Defines the structure for a chat message.
 */
export interface Message {
  role: 'user' | 'model';
  content: string;
}

/**
 * Defines the structure for an item in the generation history.
 */
export interface GenerationHistoryItem {
  id: number;
  eventType: string;
  guestCount: string;
  cuisine: string;
  dietaryRestrictions: string[];
  timestamp: string;
}

export type MenuSection = 'appetizers' | 'mainCourses' | 'sideDishes' | 'dessert' | 'serviceNotes' | 'deliveryLogistics';
