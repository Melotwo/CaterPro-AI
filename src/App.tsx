import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// --- FIXED IMPORTS (LAZY LOADING) ---
// These are handled via React.lazy to prevent build failures on missing/cased files
const PricingPage = React.lazy(() => import('./PricingPage'));
const CostingLibrary = React.lazy(() => import('./CostingLibrary'));
const PartnerDashboard = React.lazy(() => import('./PartnerDashboard'));
const PrivacyPolicy = React.lazy(() => import('./PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./TermsOfService'));
const StudentYieldCalculator = React.lazy(() => import('./StudentYieldCalculator'));
const ShiftCalculatorModal = React.lazy(() => import('./ShiftCalculatorModal'));
const SuccessPage = React.lazy(() => import('./SuccessPage'));
const ProposalDocument = React.lazy(() => import('./ProposalDocument'));
const HeroSection = React.lazy(() => import('./HeroSection'));
const Dashboard = React.lazy(() => import('./Dashboard'));
const RecipeGenerator = React.lazy(() => import('./RecipeGenerator'));
const AiChatBot = React.lazy(() => import('./AiChatBot'));

import { ShiftIngredient } from './types';

// --- PLATE COST CALCULATOR (YOUR CORE LOGIC) ---
const PlateCostCalculator: React.FC<{ ingredients: IngredientCost[] }> = ({ ingredients }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<{ id: string; qty: number }[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const totalCost = selectedIngredients.reduce((acc, curr) => {
    const ing = ingredients.find(i => i.id === curr.id);
    return acc + (ing ? ing.price * curr.qty : 0);
  }, 0);

  const addIngredient = (id: string) => {
    setSelectedIngredients([...selectedIngredients, { id, qty: 1 }]);
    setIsAdding(false);
  };

  const updateQty = (index: number, qty: number) => {
    const newItems = [...selectedIngredients];
    newItems[index].qty = qty;
    setSelectedIngredients(newItems);
  };

  const removeIngredient = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white dark:bg-dark p-12 rounded-[4rem] border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 mask-logo -z-10" />
      <div className="flex items-center gap-4 mb-12 text-emerald-600">
        <span className="text-4xl">🧮</span>
        <h3 className="font-black text-4xl tracking-tighter text-charcoal dark:text-white uppercase">Plate Cost Engine</h3>
      </div>
      
      <div className="space-y-6 mb-12">
        {selectedIngredients.map((item, index) => {
          const ing = ingredients.find(i => i.id === item.id);
          return (
            <div key={index} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-dark-soft rounded-3xl border border-slate-100 dark:border-white/5 group hover:border-emerald-500/30 transition-all">
              <div className="flex-grow">
                <span className="text-[10px] font-black text-charcoal dark:text-white uppercase tracking-widest block mb-1">{ing?.unit}</span>
                <span className="text-xl font-black text-charcoal dark:text-white uppercase tracking-tight">{ing?.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Quantity</span>
                  <input 
                    type="number" 
                    value={item.qty} 
                    onChange={(e) => updateQty(index, parseFloat(e.target.value))}
                    className="w-24 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl p-2 text-right font-black text-charcoal dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-col items-end min-w-[100px]">
                  <span className="text-[10px] font-black text-charcoal dark:text-white uppercase tracking-widest mb-1">Subtotal</span>
                  <span className="text-xl font-black text-charcoal dark:text-white">R{(ing ? ing.price * item.qty : 0).toFixed(2)}</span>
                </div>
                <button onClick={() => removeIngredient(index)} className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                  <span className="text-lg">🗑️</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setIsAdding(true)}
          className="px-10 py-5 bg-slate-100 dark:bg-dark-soft hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-charcoal dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 border-2 border-transparent hover:border-emerald-500/30"
        >
          <span className="text-xl">➕</span> Add Ingredient
        </button>
        
        <div className="text-right relative plate-cost-calc">
          <span className="text-[10px] font-black text-charcoal dark:text-white uppercase tracking-[0.4em] block mb-2">Final Plate Cost</span>
          <div className="text-6xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
            R{totalCost.toFixed(2)}
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-3xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-in">
            <div className="p-12">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black text-charcoal dark:text-white tracking-tighter uppercase">Select Ingredient</h2>
                <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-dark-soft rounded-full transition-colors">
                  <span className="text-2xl text-charcoal dark:text-white">❌</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {ingredients.map(ing => (
                  <button 
                    key={ing.id} 
                    onClick={() => addIngredient(ing.id!)}
                    className="p-6 text-left bg-slate-50 dark:bg-slate-800/50
