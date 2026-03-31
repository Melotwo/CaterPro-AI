import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// --- PLATE COST CALCULATOR ---
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
                    className="p-6 text-left bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group"
                  >
                    <span className="text-[10px] font-black text-charcoal dark:text-white uppercase tracking-widest block mb-1">{ing.unit}</span>
                    <div className="text-lg font-black text-charcoal dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase">{ing.name}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-black mt-2">R{ing.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- END PLATE COST CALCULATOR ---

// --- INLINED INFRASTRUCTURE ---
export interface IngredientCost {
  id?: string;
  name: string;
  unit: string;
  price: number;
  lastUpdated: number;
}

// Automation Service
export interface AutomationUser {
  name: string;
  email: string;
  businessType?: string;
}

export const automationService = {
  async triggerSignupWebhook(user: AutomationUser): Promise<void> {
    const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
    if (!user || !webhookUrl) {
      console.warn("Automation Service: User data or VITE_MAKE_WEBHOOK_URL is missing.");
      return;
    }
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          source: 'CaterProAI_App',
          timestamp: new Date().toISOString(),
          environment: import.meta.env.MODE,
        }),
      });
      if (!response.ok) console.error(`Webhook failed with status: ${response.status}`);
    } catch (error) {
      console.error("Automation Service Error:", error);
    }
  }
};

// Navbar Component
const Navbar: React.FC<{
  whopUrl: string;
  facebookUrl?: string;
  onThemeToggle: () => void;
  isDarkMode: boolean;
  onOpenSaved: () => void;
  savedCount: number;
  onOpenQrCode: () => void;
  onOpenInstall: () => void;
  onReset?: () => void;
  onViewLanding?: () => void;
  onViewPricing?: () => void;
  onViewLibrary?: () => void;
  onViewCalculator?: () => void;
  onViewPartner?: () => void;
  onViewSuccess?: () => void;
}> = ({ whopUrl, facebookUrl, onThemeToggle, isDarkMode, onOpenSaved, savedCount, onOpenQrCode, onOpenInstall, onReset, onViewLanding, onViewPricing, onViewLibrary, onViewCalculator, onViewPartner, onViewSuccess }) => (
  <nav role="navigation" aria-label="Main navigation" className="no-print bg-white sticky top-0 z-50 border-b border-slate-200 pt-[env(safe-area-inset-top)] shadow-sm">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center h-24">
        <div 
            className={`flex items-center space-x-4 ${onViewLanding ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`} 
            onClick={onViewLanding}
            role={onViewLanding ? "button" : undefined}
            tabIndex={0}
        >
          <div className="relative group">
             <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <span className="text-4xl relative z-10" aria-label="CaterProAi Logo Icon">👨‍🍳</span>
             <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-charcoal rounded-full animate-pulse border-2 border-white"></div>
          </div>
          <div>
            <span className="text-3xl tracking-tighter whitespace-nowrap flex items-center font-anchor uppercase">
              <span className="text-charcoal">CaterPro</span>
              <span className="bg-gradient-to-br from-emerald-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">Ai</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-6">
          {onViewLibrary && (
            <button 
              onClick={onViewLibrary}
              className="p-3.5 rounded-2xl text-charcoal dark:text-white hover:text-emerald-600 hover:bg-emerald-500/5 transition-all group"
              title="Costing Library"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📦</span>
            </button>
          )}

          {onViewCalculator && (
            <button 
              onClick={onViewCalculator}
              className="p-3.5 rounded-2xl text-charcoal dark:text-white hover:text-emerald-600 hover:bg-emerald-500/5 transition-all group"
              title="Plate Cost Calculator"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🧮</span>
            </button>
          )}

          {onViewPartner && (
            <button 
              onClick={onViewPartner}
              className="p-3.5 rounded-2xl text-charcoal dark:text-white hover:text-emerald-600 hover:bg-emerald-500/5 transition-all group"
              title="Partner Dashboard"
            >
              <span className="text-2xl text-emerald-500 group-hover:scale-110 transition-transform">⚡</span>
            </button>
          )}

          {onViewSuccess && (
            <button 
              onClick={onViewSuccess}
              className="px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 text-charcoal dark:text-white hover:border-emerald-500 hover:text-emerald-600 transition-all font-anchor text-[10px] uppercase tracking-[0.2em] bg-white dark:bg-dark shadow-sm"
              title="My Results"
            >
              My Results
            </button>
          )}

          <button onClick={onOpenSaved} className="relative p-3.5 rounded-2xl text-charcoal dark:text-white hover:text-emerald-600 hover:bg-emerald-500/5 transition-all group" aria-label={`Saved menus (${savedCount})`}>
            <span className="text-2xl group-hover:scale-110 transition-transform">🔖</span>
            {savedCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-lg border-2 border-white">{savedCount}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  </nav>
);

// Footer Component
const Footer: React.FC<{ 
  facebookUrl?: string;
  onViewPrivacy?: () => void;
  onViewTerms?: () => void;
}> = ({ facebookUrl, onViewPrivacy, onViewTerms }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await automationService.triggerSignupWebhook({
        email,
        name,
        businessType: 'Newsletter Subscriber',
      });
      setIsSubscribed(true);
      setEmail('');
      setName('');
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="no-print bg-white border-t border-slate-100 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="mb-12 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black text-charcoal tracking-tight flex items-center justify-center md:justify-start gap-2">
                <span className="text-xl text-emerald">✨</span>
                Stay in the Loop
              </h3>
              <p className="text-sm text-charcoal font-medium mt-1">
                Get the latest culinary AI trends and scaling strategies.
              </p>
            </div>

            {isSubscribed ? (
              <div className="bg-emerald/10 border border-emerald/20 px-6 py-3 rounded-xl text-emerald font-bold text-sm animate-fade-in">
                You're on the list! 👨‍🍳
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-grow sm:w-40 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald outline-none transition-all text-sm font-medium"
                />
                <input
                  type="email"
                  placeholder="chef@kitchen.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow sm:w-56 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald outline-none transition-all text-sm font-medium"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-emerald hover:brightness-110 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <span className="animate-spin">⏳</span> : <span className="text-lg">✉️</span>}
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-charcoal">
          <p className="text-charcoal font-bold">&copy; 2026 <span className="font-bold">CaterPro</span><span className="font-medium text-emerald">Ai</span>. All rights reserved.</p>
          <p className="mt-1">Intelligent menu planning for catering professionals at caterproai.com</p>
          <p className="mt-2 font-bold text-charcoal">Contact: info@caterproai.com</p>
          
          <div className="mt-4 flex justify-center gap-4">
            <button onClick={() => onViewPrivacy?.()} className="hover:text-emerald transition-colors">Privacy Policy</button>
            <span className="text-emerald-500">|</span>
            <button onClick={() => onViewTerms?.()} className="hover:text-emerald transition-colors">Terms of Service</button>
          </div>
          
          {facebookUrl && (
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
            >
              <span className="text-lg">📘</span> Join the Facebook Group
            </a>
          )}

          <p className="mt-4 text-[10px] text-charcoal dark:text-white font-mono">
            v1.0.3 &bull; 2026 Launch Build
          </p>
        </div>
      </div>
    </footer>
  );
};

// Subscription Context
export type SubscriptionPlan = 'free' | 'commis' | 'chef-de-partie' | 'sous-chef' | 'executive';

export interface SubscriptionState {
  plan: SubscriptionPlan;
  generationsToday: number;
  lastGenerationDate: string | null;
}

const MAX_FREE_GENERATIONS = 5;

const getInitialState = (): SubscriptionState => {
  try {
    const storedState = localStorage.getItem('caterpro-subscription');
    if (storedState) {
      const parsed = JSON.parse(storedState);
      const today = new Date().toDateString();
      if (parsed.lastGenerationDate !== today) {
        parsed.generationsToday = 0;
        parsed.lastGenerationDate = today;
      }
      if (!['free', 'commis', 'chef-de-partie', 'sous-chef', 'executive'].includes(parsed.plan)) {
          parsed.plan = 'chef-de-partie';
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse subscription state", e);
  }
  return {
    plan: 'chef-de-partie',
    generationsToday: 0,
    lastGenerationDate: new Date().toDateString(),
  };
};

export const useAppSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionState>(getInitialState());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('caterpro-subscription', JSON.stringify(subscription));
  }, [subscription]);

  const selectPlan = (plan: SubscriptionPlan) => {
    setSubscription(prev => ({ ...prev, plan }));
  };

  const canAccessFeature = useCallback((feature: string): boolean => {
    const p = subscription.plan;
    const isPaid = p !== 'free';
    const isCommis = p === 'commis';
    const isChef = p === 'chef-de-partie';
    const isSous = p === 'sous-chef';
    const isExec = p === 'executive';
    
    const isProPlus = ['chef-de-partie', 'sous-chef', 'executive'].includes(p);
    const isGrowthPlus = ['sous-chef', 'executive'].includes(p);

    switch (feature) {
      case 'unlimitedGenerations': return isPaid;
      case 'noWatermark': return isProPlus; 
      case 'aiChatBot': return isPaid; 
      case 'saveMenus': return isPaid;
      case 'educationTools': return isCommis || isExec; 
      case 'costingEngine': return isProPlus;
      case 'shoppingLists': return isProPlus;
      case 'multiUser': return isGrowthPlus;
      case 'cloudStorage': return isGrowthPlus;
      case 'clientDashboard': return isGrowthPlus;
      case 'reelsMode': return isExec;
      case 'viralVideoCreator': return isExec;
      case 'beveragePairings': return isProPlus;
      default: return false;
    }
  }, [subscription.plan]);

  const recordGeneration = useCallback((): boolean => {
    const today = new Date().toDateString();
    let currentGenerations = subscription.generationsToday;
    
    if (subscription.lastGenerationDate !== today) {
        currentGenerations = 0;
    }
    
    if (canAccessFeature('unlimitedGenerations')) {
        setSubscription(prev => ({ ...prev, lastGenerationDate: today }));
        return true;
    }
    
    if (currentGenerations < MAX_FREE_GENERATIONS) {
        setSubscription(prev => ({ 
            ...prev, 
            generationsToday: currentGenerations + 1, 
            lastGenerationDate: today 
        }));
        return true;
    }
    
    setShowUpgradeModal(true);
    return false;
  }, [subscription, canAccessFeature]);

  const attemptAccess = (feature: string): boolean => {
      if (canAccessFeature(feature)) return true;
      setShowUpgradeModal(true);
      return false;
  };

  return { 
    subscription, 
    selectPlan,
    canAccessFeature,
    recordGeneration,
    showUpgradeModal,
    setShowUpgradeModal,
    attemptAccess
  };
};

// --- END INLINED INFRASTRUCTURE ---

// --- INFRASTRUCTURE IMPORTS ---
import PricingPage from './PricingPage';
import CostingLibrary from './CostingLibrary';
import PartnerDashboard from './PartnerDashboard';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import StudentYieldCalculator from './StudentYieldCalculator';
import ShiftCalculatorModal from './ShiftCalculatorModal';
import SuccessPage from './SuccessPage';
import ProposalDocument from './ProposalDocument';
import HeroSection from './HeroSection';
import Dashboard from './Dashboard';
import RecipeGenerator from './RecipeGenerator';
import AiChatBot from './AiChatBot';
import { ShiftIngredient } from './types';

// --- UTILS ---
const formatCurrency = (amount: number) => {
  return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

// --- MOCK DATA FOR DEMO ---
const MOCK_PROPOSAL = { 
  "title": "Michelin-Star Herb Crusted Lamb", 
  "imageQuery": "Michelin-Star Herb Crusted Lamb fine dining", 
  "menu": [
    {"cat": "Appetizers", "dish": "Truffle Infused King Oyster Mushroom", "notes": "With garlic butter and microgreens"},
    {"cat": "Main Courses", "dish": "Michelin-Star Herb Crusted Lamb", "notes": "With red wine jus and seasonal root vegetables"},
    {"cat": "Desserts", "dish": "Dark Chocolate Fondant", "notes": "With vanilla bean panna cotta"}
  ], 
  "miseEnPlace": ["Clean and slice mushrooms", "Prepare herb crust for lamb", "Reduce red wine for jus"], 
  "serviceNotes": ["Serve lamb immediately after resting", "Garnish with fresh microgreens"],
  "haccpSafety": [
    {"point": "Critical Control Point", "requirement": "Internal temp 63°C for medium-rare lamb", "category": "Temp"},
    {"point": "Storage", "requirement": "Store mushrooms at < 5°C", "category": "Storage"}
  ],
  "wasteYieldAnalysis": {
    "apCost": 2500,
    "epCost": 3333,
    "costDifference": 833,
    "yieldPercentage": 75,
    "qctoCriteria": "Level 5 assessment compliance met through detailed yield tracking."
  },
  "shoppingList": {
    "Proteins": ["Rack of Lamb"],
    "Produce": ["King Oyster Mushroom", "Microgreens", "Root Vegetables"],
    "Pantry": ["Truffle Oil", "Garlic Butter", "Red Wine"]
  },
  "logistics": {
    "deliveryFee": 500,
    "setupTime": "1 hour",
    "staffRequired": 2
  },
  "winePairings": ["Cabernet Sauvignon", "Pinot Noir"],
  "costPerHead": 450
};

export default function App() {
  // --- STATE & HOOKS ---
  const { selectPlan, canAccessFeature, recordGeneration } = useAppSubscription();
  
  const [viewMode, setViewMode] = useState<'landing' | 'generator' | 'pricing' | 'library' | 'privacy' | 'partner' | 'terms' | 'success' | 'recipe-lab' | 'calculator'>('landing');
  const [ingredients, setIngredients] = useState<IngredientCost[]>([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'ingredientCosts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIngredients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IngredientCost)));
    });
    return unsubscribe;
  }, []);

  const [isTrainingMode, setIsTrainingMode] = useState(false);
  
  // Generator State
  const [guests, setGuests] = useState('50');
  const [style, setStyle] = useState('');
  const [dietary, setDietary] = useState('');
  const [eventType, setEventType] = useState('Corporate Event');
  const [apCost, setApCost] = useState('');
  const [epYield, setEpYield] = useState('');
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<any>(null);
  const [proposalImage, setProposalImage] = useState<string | null>(null);
  const [isTotalUpdating, setIsTotalUpdating] = useState(false);
  const [isShiftCalculatorOpen, setIsShiftCalculatorOpen] = useState(false);
  const [shiftIngredients, setShiftIngredients] = useState<ShiftIngredient[]>([]);
  const [isShiftLoading, setIsShiftLoading] = useState(false);
  
  const handleOpenShiftCalculator = async () => {
    if (!proposal?.miseEnPlace) return;
    setIsShiftLoading(true);
    // Mock shift ingredients
    setTimeout(() => {
      setShiftIngredients([
        { name: 'Prawns', quantity: 5, unit: 'kg', unitPrice: 250 },
        { name: 'Short Ribs', quantity: 10, unit: 'kg', unitPrice: 180 }
      ]);
      setIsShiftCalculatorOpen(true);
      setIsShiftLoading(false);
    }, 1000);
  };

  const proposalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (proposal) {
      setIsTotalUpdating(true);
      const timer = setTimeout(() => setIsTotalUpdating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [guests, proposal?.logistics?.deliveryFee]);

  // --- WHOP LINKS ---
  const whopLinks = {
    commis: "https://whop.com/checkout/plan_1",
    chefDePartie: "https://whop.com/checkout/plan_2",
    sousChef: "https://whop.com/checkout/plan_3",
    executive: "https://whop.com/checkout/plan_4"
  };

  // --- GENERATION LOGIC (MOCKED FOR DEMO) ---
  async function generateProposal() {
    if (isTrainingMode && (!apCost || !epYield)) {
      alert("Please enter AP Cost and EP Yield for QCTO compliance.");
      return;
    }

    if (!recordGeneration()) return;

    setLoading(true);
    // Instant AI Generation Mock
    setProposal(MOCK_PROPOSAL);
    setProposalImage("https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80");
    setViewMode('generator');
    setLoading(false);
  }

  const downloadPDF = async () => {
    if (!proposalRef.current) return;
    const canvas = await html2canvas(proposalRef.current, { 
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const elements = clonedDoc.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i] as HTMLElement;
          const style = window.getComputedStyle(el);
          // Convert OKLCH or any other color to standard RGB for PDF stability
          // This fixes the Tailwind v4 OKLCH bug in html2canvas
          if (style.color.includes('oklch') || style.color.includes('var')) {
            el.style.color = 'rgb(17, 24, 39)';
          }
          if (style.backgroundColor.includes('oklch') || style.backgroundColor.includes('var')) {
            el.style.backgroundColor = 'rgb(255, 255, 255)';
          }
        }
      }
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${proposal.title.replace(/\s+/g, '_')}_Proposal.pdf`);
  };

  // --- RENDER HELPERS ---
  const renderView = () => {
    switch (viewMode) {
      case 'calculator':
        return (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-12 flex justify-between items-end">
              <div>
                <h2 className="text-6xl font-black text-charcoal dark:text-white tracking-tighter uppercase mb-2">Plate Costing</h2>
                <p className="text-charcoal dark:text-white font-bold text-xl">Precision engineering for your culinary margins.</p>
              </div>
              <button onClick={() => setViewMode('generator')} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                Back to Generator
              </button>
            </div>
            <PlateCostCalculator ingredients={ingredients} />
          </div>
        );
      case 'landing':
        return (
          <div className="min-h-screen bg-slate-50 text-charcoal flex flex-col">
            <HeroSection onStart={() => setViewMode('generator')} />

            {/* QCTO Student Success Guide Section */}
            <div className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 mask-triangle -z-10" />
              <div className="bg-dark p-12 rounded-[4rem] flex flex-col md:flex-row items-center gap-12 border border-emerald-500/30 shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <span className="text-4xl">🎓</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <span className="text-emerald-500">⚡</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Educational Excellence</span>
                  </div>
                  <h3 className="text-4xl font-anchor tracking-tighter uppercase mb-6 text-white">QCTO Student Success Guide</h3>
                  <p className="text-white font-medium leading-relaxed text-xl">
                    CaterProAi is specifically engineered to support South African TVET students. Use the <span className="text-emerald-400 font-bold">'Training Mode'</span> to map your practicals to QCTO Occupational Certificate: Chef (ID 101697) modules. Every proposal automatically generates the Costing (ZAR), AP/EP Yield Analysis, and HACCP documentation required for Level 5 Assessment compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* Dual-Tier Section */}
            <div className="max-w-7xl mx-auto w-full px-6 py-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* For Students */}
                <div className="bg-white p-16 rounded-[4rem] border border-emerald-500/30 hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 mask-triangle -z-10" />
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform border border-emerald-500/20">
                    <span className="text-4xl">🎓</span>
                  </div>
                  <h3 className="text-4xl font-anchor mb-6 tracking-tighter text-charcoal">For Students</h3>
                  <p className="text-charcoal font-medium mb-10 leading-relaxed text-lg">
                    Master the art of food math and international standards with our specialized student toolkit.
                  </p>
                  <ul className="space-y-6 mb-12">
                    <li className="flex items-center gap-4 text-base font-bold text-charcoal">
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      Yield Sandbox for precision testing
                    </li>
                    <li className="flex items-center gap-4 text-base font-bold text-charcoal">
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      International Curriculum Modules
                    </li>
                    <li className="flex items-center gap-4 text-base font-bold text-charcoal">
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      PoE Admin Automation
                    </li>
                  </ul>
                  <button onClick={() => setViewMode('recipe-lab')} className="flex items-center gap-3 text-emerald-700 font-black uppercase tracking-widest text-xs group-hover:gap-5 transition-all">
                    <span className="text-emerald-700">Explore Recipe Lab</span> <span className="text-emerald-700">→</span>
                  </button>
                </div>

                {/* For Professionals */}
                <div className="bg-dark p-16 rounded-[4rem] border border-emerald-500/30 hover:shadow-2xl transition-all group text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 mask-triangle -z-10" />
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform border border-emerald-500/30">
                    <span className="text-4xl">💼</span>
                  </div>
                  <h3 className="text-4xl font-anchor mb-6 tracking-tighter text-white">For Professionals</h3>
                  <p className="text-white font-medium mb-10 leading-relaxed text-lg">
                    Scale your catering operation with enterprise-grade intelligence and automated logistics.
                  </p>
                  <ul className="space-y-6 mb-12">
                    <li className="flex items-center gap-4 text-base font-bold text-white">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      Live ZAR Costing & Smart Shopping
                    </li>
                    <li className="flex items-center gap-4 text-base font-bold text-white">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      HACCP Safety Automation
                    </li>
                    <li className="flex items-center gap-4 text-base font-bold text-white">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      One-Click PDF Proposal Exports
                    </li>
                  </ul>
                  <button onClick={() => setViewMode('generator')} className="flex items-center gap-3 text-emerald-400 font-black uppercase tracking-widest text-xs group-hover:gap-5 transition-all">
                    Launch Professional Suite <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Culinary Excellence Section */}
            <div className="bg-slate-100/50 py-32 relative">
              <div className="absolute inset-0 bg-emerald-500/5 mask-triangle opacity-20 -z-10" />
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-12">
                  <div className="max-w-2xl">
                    <h3 className="text-5xl font-anchor tracking-tighter uppercase mb-6 text-charcoal">Culinary Excellence</h3>
                    <p className="text-charcoal font-medium text-xl leading-relaxed">
                      Precision tools for the modern executive chef. Elevate your operations with AI-driven intelligence and Michelin-star standards.
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <div className="w-4 h-4 rounded-full bg-slate-300" />
                    <div className="w-4 h-4 rounded-full bg-slate-300" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { title: "Menu Intelligence", desc: "AI-driven menu engineering and profit margin analysis.", icon: <span className="text-3xl">🍴</span> },
                    { title: "Operational Safety", desc: "Automated HACCP checklists and safety protocol generation.", icon: <span className="text-3xl">🛡️</span> },
                    { title: "Costing Precision", desc: "Live ZAR costing and smart shopping list automation.", icon: <span className="text-3xl">🧮</span> }
                  ].map((feature, i) => (
                    <div key={i} className="bg-dark p-12 rounded-[3.5rem] border border-emerald-500/30 shadow-2xl hover:shadow-3xl transition-all group">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                        {feature.icon}
                      </div>
                  <h4 className="text-2xl font-anchor mb-6 tracking-tighter text-white">{feature.title}</h4>
                      <p className="text-white font-medium text-base leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Common Culinary Queries Section */}
            <div className="bg-white py-32">
              <div className="max-w-5xl mx-auto px-6">
                <div className="bg-dark p-16 rounded-[4rem] border border-emerald-500/30 shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 mask-triangle -z-10" />
                  <h2 className="text-5xl font-anchor tracking-tighter uppercase mb-16 text-center text-white">Common Culinary Queries</h2>
                  <div className="grid md:grid-cols-2 gap-16">
                    <div>
                      <h3 className="text-2xl font-anchor mb-6 tracking-tighter text-emerald-400">What is the best AI tool for South African catering?</h3>
                      <p className="text-white font-medium leading-relaxed text-lg">
                        <span className="font-bold text-white">CaterPro</span><span className="font-medium text-emerald-400">Ai</span> provides live ZAR costing and automated HACCP safety for professional chefs.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-anchor mb-6 tracking-tighter text-emerald-400">How do I calculate culinary yield for City & Guilds exams?</h3>
                      <p className="text-white font-medium leading-relaxed text-lg">
                        Use the <span className="font-bold text-white">CaterPro</span><span className="font-medium text-emerald-400">Ai</span> Student Sandbox to apply the formula EP = AP x Yield% with 100% accuracy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'generator':
        if (proposal) {
          return (
            <div className="bg-slate-50 min-h-screen pb-20">
              <ProposalDocument 
                proposal={proposal}
                proposalImage={proposalImage}
                eventType={eventType}
                guests={guests}
                formatCurrency={formatCurrency}
              />
            </div>
          );
        }

        return (
          <div className="min-h-screen bg-slate-50 p-6 py-24">
            <div className="max-w-7xl mx-auto golden-triangle-grid gap-12">
              {/* Top Left: Logo/Brand Rhyming */}
              <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center text-center">
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 mask-logo -z-10" />
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-emerald-500/20">
                  <span className="text-5xl">👨‍🍳</span>
                </div>
                <h2 className="text-3xl font-anchor text-charcoal dark:text-white tracking-tighter uppercase mb-2">CaterProAi</h2>
                <p className="text-charcoal dark:text-white font-black text-[10px] uppercase tracking-[0.4em]">Elite Engineering</p>
              </div>

              {/* Middle: Command Center (The Core) */}
              <div className="md:col-span-2 bg-dark p-16 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-emerald-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 mask-triangle -z-10" />
              <h2 className="text-5xl font-anchor text-white mb-4 text-center tracking-tighter uppercase">Command Center</h2>
              <p className="text-gold text-center mb-12 uppercase tracking-[0.5em] text-[10px] font-black">Chef Operations v12.0 • Luxury Edition</p>
              
              <div className="flex justify-center mb-12">
                <button 
                  onClick={() => setIsTrainingMode(!isTrainingMode)}
                  className={`flex items-center gap-4 px-8 py-4 rounded-[2rem] transition-all border-2 ${isTrainingMode ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-xl' : 'bg-white/5 border-slate-200 dark:border-white/10 text-charcoal dark:text-white'}`}
                >
                  <span className="text-xl">🎓</span>
                  <span className="font-black uppercase tracking-widest text-xs">Training Mode {isTrainingMode ? 'ON' : 'OFF'}</span>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${isTrainingMode ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isTrainingMode ? 'left-7' : 'left-1'}`} />
                  </div>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-10">
                  <div>
                    <label className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-2 mb-2 block">Event Selection</label>
                    <select 
                      value={eventType} 
                      onChange={e => setEventType(e.target.value)} 
                      className="w-full bg-slate-900 p-6 rounded-[2rem] text-white outline-none border border-slate-800 focus:border-emerald-500 transition-all appearance-none cursor-pointer font-bold text-sm shadow-sm"
                    >
                      <option>Corporate Event</option>
                      <option>Wedding Banquet</option>
                      <option>Private Fine Dining</option>
                      <option>Cocktail Soirée</option>
                      <option>Boutique Catering</option>
                      <option>Product Launch</option>
                      <option>Gala Dinner</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-2 mb-2 block">Guest Volume</label>
                    <select 
                      value={guests} 
                      onChange={e => setGuests(e.target.value)} 
                      className="w-full bg-slate-900 p-6 rounded-[2rem] text-white outline-none border border-slate-800 focus:border-emerald-500 transition-all appearance-none cursor-pointer font-bold text-sm shadow-sm"
                    >
                      <option value="10">1-10 Guests</option>
                      <option value="20">11-20 Guests</option>
                      <option value="50">21-50 Guests</option>
                      <option value="100">51-100 Guests</option>
                      <option value="200">101-200 Guests</option>
                      <option value="500">200+ Guests</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <label className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-2 mb-2 block">Culinary Style</label>
                    <input 
                      type="text"
                      value={style} 
                      onChange={e => setStyle(e.target.value)} 
                      placeholder="e.g., Thai Fusion Fine Dining"
                      className="w-full bg-slate-900 p-6 rounded-[2rem] text-white outline-none border border-slate-800 focus:border-emerald-500 transition-all font-bold text-sm shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-2 mb-2 block">Dietary Requirements</label>
                    <textarea 
                      value={dietary}
                      onChange={e => setDietary(e.target.value)}
                      placeholder="Type specific requirements here..."
                      className="w-full bg-slate-900 p-6 rounded-[2rem] text-white outline-none border border-slate-800 focus:border-emerald-500 transition-all h-[178px] resize-none font-bold text-sm shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {isTrainingMode && (
                <div className="mt-12 p-10 bg-emerald-500/10 rounded-[3rem] border border-emerald-500/30 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-4 mb-8 text-emerald-400">
                    <span className="text-xl">%</span>
                    <h3 className="font-anchor uppercase tracking-widest text-sm">QCTO Level 5 Waste/Yield Input</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-2 mb-2 block">AP Cost (Total R)</label>
                      <input 
                        type="number"
                        value={apCost}
                        onChange={e => setApCost(e.target.value)}
                        placeholder="e.g., 2500"
                        className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-slate-700 focus:border-emerald-500 transition-all font-bold text-sm shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gold uppercase tracking-[0.3em] ml-2 mb-2 block">Estimated EP Yield (%)</label>
                      <input 
                        type="number"
                        value={epYield}
                        onChange={e => setEpYield(e.target.value)}
                        placeholder="e.g., 75"
                        className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-slate-700 focus:border-emerald-500 transition-all font-bold text-sm shadow-sm"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-charcoal dark:text-white mt-6 italic font-medium text-center">
                    * Mandatory for QCTO ID 101697 Module 5 compliance.
                  </p>
                </div>
              )}

              <button 
                onClick={generateProposal} 
                disabled={loading} 
                className="w-full bg-emerald-600 text-white py-8 rounded-[2.5rem] font-anchor uppercase text-lg tracking-[0.2em] hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-6 mt-16 shadow-[0_30px_60px_rgba(0,0,0,0.4)] group"
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-2xl">⏳</span>
                    Engineering...
                  </>
                ) : (
                  <>
                    <span className="text-2xl group-hover:scale-125 transition-transform">⚡</span>
                    Launch AI Culinary Planner
                  </>
                )}
              </button>
            </div>
            <div className="w-full max-w-3xl mt-12">
              <StudentYieldCalculator />
            </div>
          </div>
        </div>
      );

      case 'recipe-lab':
        return (
          <div className="min-h-screen bg-white dark:bg-dark p-6 pt-24">
            <div className="max-w-4xl mx-auto">
              <button 
                onClick={() => setViewMode('landing')}
                className="mb-8 flex items-center gap-2 text-charcoal dark:text-white font-bold uppercase tracking-widest text-xs hover:text-emerald-600 transition-colors"
              >
                <span className="rotate-180">→</span> Back to Dashboard
              </button>
              <RecipeGenerator dietaryRestrictions={[]} currency="R" />
            </div>
          </div>
        );

      case 'pricing':
        return <PricingPage onSelectPlan={selectPlan} whopLinks={whopLinks} />;
      
      case 'library':
        return <CostingLibrary />;
      
      case 'partner':
        return <PartnerDashboard />;
      
      case 'privacy':
        return <PrivacyPolicy onBack={() => setViewMode('landing')} />;
      
      case 'terms':
        return <TermsOfService onBack={() => setViewMode('landing')} />;

      case 'success':
        return (
          <SuccessPage 
            proposal={proposal}
            onNewProposal={() => {
              setProposal(null);
              setProposalImage(null);
              setViewMode('generator');
            }}
            onExit={() => setViewMode('landing')}
            onDownloadPDF={downloadPDF}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Navbar Integration */}
      <Navbar 
        whopUrl={whopLinks.executive}
        isDarkMode={false} // Force light mode as requested
        onThemeToggle={() => {}} // Disabled for now
        onOpenSaved={() => {}} // Placeholder
        savedCount={0}
        onOpenQrCode={() => {}}
        onOpenInstall={() => {}}
        onViewLanding={() => setViewMode('landing')}
        onViewPricing={() => setViewMode('pricing')}
        onViewLibrary={() => setViewMode('library')}
        onViewCalculator={() => setViewMode('calculator')}
        onViewPartner={() => setViewMode('partner')}
        onViewSuccess={() => setViewMode('success')}
      />

      {/* Main Content */}
      <main className="flex-grow relative">
        {renderView()}
        
        <AiChatBot 
          onAttemptAccess={() => {
            if (!canAccessFeature('aiChatBot')) {
              setViewMode('pricing');
              return false;
            }
            return true;
          }}
          isPro={canAccessFeature('aiChatBot')}
        />

        {/* Hidden Proposal for PDF Export */}
        {proposal && (
          <div 
            ref={proposalRef} 
            className="fixed left-[-9999px] top-0 w-[1200px] bg-white pointer-events-none"
            aria-hidden="true"
          >
            <ProposalDocument 
              proposal={proposal}
              proposalImage={proposalImage}
              eventType={eventType}
              guests={guests}
              formatCurrency={formatCurrency}
              isExporting={true}
            />
          </div>
        )}
      </main>

      {/* Footer Integration */}
      <Footer 
        onViewPrivacy={() => setViewMode('privacy')}
        onViewTerms={() => setViewMode('terms')}
      />

      {/* Result View Header */}
      {viewMode === 'generator' && proposal && (
        <div className="fixed top-24 transition-all duration-500 z-[55] flex flex-col sm:flex-row gap-3 right-4 md:right-8">
          <button 
            onClick={handleOpenShiftCalculator}
            disabled={isShiftLoading}
            className="bg-dark text-white px-6 py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-dark-soft transition-all flex items-center gap-2 shadow-2xl border border-emerald-500/20 disabled:opacity-50"
          >
            {isShiftLoading ? <span className="animate-spin text-lg">⏳</span> : <span className="text-lg">🧮</span>}
            <span className="whitespace-nowrap">Shift Calculator</span>
          </button>
          <button 
            onClick={downloadPDF}
            className="bg-white text-charcoal px-6 py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 shadow-2xl border border-slate-200"
          >
            <span className="text-lg">📥</span> <span className="whitespace-nowrap">Export PDF</span>
          </button>
          <button 
            onClick={() => setViewMode('success')}
            className="bg-gold text-charcoal px-8 py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
          >
            <span className="whitespace-nowrap">My Results</span>
          </button>
        </div>
      )}

      <ShiftCalculatorModal 
        isOpen={isShiftCalculatorOpen}
        onClose={() => setIsShiftCalculatorOpen(false)}
        initialIngredients={shiftIngredients}
        menuTitle={proposal?.menuTitle || ''}
      />
    </div>
  );
}
