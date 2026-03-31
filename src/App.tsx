import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// --- FIXED IMPORTS (LAZY LOADING) ---
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

// --- INTERFACES ---
export interface IngredientCost {
  id?: string;
  name: string;
  unit: string;
  price: number;
  lastUpdated: number;
}

export interface AutomationUser {
  name: string;
  email: string;
  businessType?: string;
}

// --- PLATE COST CALCULATOR COMPONENT ---
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
      <div className="flex items-center gap-4 mb-12 text-emerald-600">
        <span className="text-4xl">🧮</span>
        <h3 className="font-black text-4xl tracking-tighter text-charcoal dark:text-white uppercase">Plate Cost Engine</h3>
      </div>
      <div className="space-y-6 mb-12">
        {selectedIngredients.map((item, index) => {
          const ing = ingredients.find(i => i.id === item.id);
          return (
            <div key={index} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-dark-soft rounded-3xl border border-slate-100 dark:border-white/5">
              <div className="flex-grow">
                <span className="text-[10px] font-black text-charcoal dark:text-white uppercase tracking-widest block mb-1">{ing?.unit}</span>
                <span className="text-xl font-black text-charcoal dark:text-white uppercase tracking-tight">{ing?.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <input 
                  type="number" 
                  value={item.qty} 
                  onChange={(e) => updateQty(index, parseFloat(e.target.value))}
                  className="w-24 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl p-2 text-right font-black"
                />
                <div className="min-w-[100px] text-right">
                  <span className="text-xl font-black">R{(ing ? ing.price * item.qty : 0).toFixed(2)}</span>
                </div>
                <button onClick={() => removeIngredient(index)} className="p-3 text-red-400">🗑️</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center pt-12 border-t border-slate-100">
        <button onClick={() => setIsAdding(true)} className="px-10 py-5 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest">
          ➕ Add Ingredient
        </button>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Final Plate Cost</span>
          <div className="text-6xl font-black text-emerald-600">R{totalCost.toFixed(2)}</div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-12">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black uppercase">Select Ingredient</h2>
              <button onClick={() => setIsAdding(false)} className="text-2xl">❌</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto">
              {ingredients.map(ing => (
                <button key={ing.id} onClick={() => addIngredient(ing.id!)} className="p-6 text-left bg-slate-50 rounded-2xl border-2 hover:border-emerald-500">
                  <div className="font-black uppercase">{ing.name}</div>
                  <div className="text-emerald-600 font-black">R{ing.price.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'generator' | 'pricing' | 'library' | 'calculator'>('landing');
  const [ingredients, setIngredients] = useState<IngredientCost[]>([]);
  const DEMO_USER_ID = 'DEMO_USER';

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'ingredientCosts'), where('userId', '==', DEMO_USER_ID));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIngredients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IngredientCost)));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={<div className="flex h-screen items-center justify-center font-black text-emerald-500">LOADING CATERPRO...</div>}>
        {viewMode === 'landing' && (
          <div className="flex flex-col items-center justify-center min-h-screen">
             <HeroSection onStart={() => setViewMode('generator')} />
             <button onClick={() => setViewMode('calculator')} className="mt-8 px-8 py-4 bg-emerald-500 text-white rounded-full font-black uppercase">
               Try Plate Cost Engine
             </button>
          </div>
        )}

        {viewMode === 'generator' && (
          <div className="p-12">
            <Dashboard onBack={() => setViewMode('landing')} />
          </div>
        )}

        {viewMode === 'calculator' && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-12 flex justify-between items-end">
              <h2 className="text-6xl font-black tracking-tighter uppercase">Plate Costing</h2>
              <button onClick={() => setViewMode('landing')} className="px-8 py-4 bg-slate-100 rounded-2xl font-black uppercase text-xs">
                Back Home
              </button>
            </div>
            <PlateCostCalculator ingredients={ingredients} />
          </div>
        )}
      </Suspense>
    </div>
  );
}
