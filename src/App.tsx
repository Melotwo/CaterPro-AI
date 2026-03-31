
import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { GoogleGenAI, Chat } from '@google/genai';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// --- TYPES & INTERFACES ---

export interface IngredientCost {
  id?: string;
  name: string;
  unit: string;
  price: number;
  lastUpdated: any;
  userId: string;
}

export interface DeliveryFeeStructure {
  baseFee: number;
  perUnitRate: number;
  unit: 'mile' | 'km';
  currency: string;
}

export interface MenuItemAnalysis {
  name: string;
  category: 'Star' | 'Plow Horse' | 'Puzzle' | 'Dog';
  profitMargin: number;
  popularityPotential: number;
  evocativeDescription: string;
}

export interface SalesScript {
  phase: 'before' | 'during' | 'after';
  hook: string;
  script: string;
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
  theme?: string;
  deliveryFeeStructure?: DeliveryFeeStructure;
  businessAnalysis?: MenuItemAnalysis[];
  safetyProtocols?: string[];
  haccpSafety?: { point: string; requirement: string }[];
  salesScripts?: SalesScript[];
  aiKeywords?: string[];
  costPerHead?: number;
  logistics?: { deliveryFee: number };
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

export interface ErrorState {
  title: string;
  message: string | React.ReactNode;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface ShiftIngredient {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export type SubscriptionPlan = 'free' | 'commis' | 'chef-de-partie' | 'sous-chef' | 'executive';

// --- CONSTANTS ---

const DEMO_USER_ID = 'DEMO_USER';
const PAYPAL_CLIENT_ID = "Adp-3XYWNARTpkCw4rbtFUnFox3mMwZtWWRy-TprJ8sOrV8X9z4xtyobRHuCx848mseDoqATaUooheFz";

// --- FIREBASE INITIALIZATION ---

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- SERVICES & UTILS ---

export const automationService = {
  triggerSignupWebhook: async (data: { email: string; name: string; businessType: string }) => {
    const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
    if (!webhookUrl) return;
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'CaterProAI_Signup', timestamp: new Date().toISOString() }),
      });
    } catch (err) {
      console.error("Webhook failed", err);
    }
  }
};

export const getApiErrorState = (err: unknown): ErrorState => {
    console.error("API Error Trace:", err);
    let errorState: ErrorState = {
      title: 'Action Required',
      message: 'The AI encountered an issue generating your proposal. Please refresh and try again.',
    };
    if (err instanceof Error) {
      const lowerCaseMessage = err.message.toLowerCase();
      if (lowerCaseMessage.includes('api key') || lowerCaseMessage.includes('permission denied')) {
          errorState = {
              title: 'API Configuration Alert',
              message: 'The AI service is unreachable. This usually means the API key is invalid or missing from the deployment environment.',
          };
      } else if (lowerCaseMessage.includes('billing') || lowerCaseMessage.includes('quota')) {
          errorState = {
              title: 'Service Limit Reached',
              message: "Your AI generation quota for today has been reached or your billing account is inactive.",
          };
      } else {
        errorState.message = String(err.message);
      }
    }
    return errorState;
};

// Mock Gemini Service Logic
const mockGeminiService = {
  analyzeMenuForCosting: async (_base64: string, _suppliers: string, currency: string): Promise<ScannedMenuCosting> => {
    return {
        menuItems: [
            { name: "Truffle Infused King Oyster Mushroom", identifiedIngredients: ["King Oyster Mushroom", "Truffle Oil"], estimatedPortionCost: "45.00", suggestedSupplier: "Local Organic Farm" },
            { name: "Pan-Seared Sea Bass", identifiedIngredients: ["Sea Bass", "Lemon", "Capers"], estimatedPortionCost: "85.00", suggestedSupplier: "Ocean Fresh" }
        ],
        totalEstimatedMenuCost: "130.00",
        marginAdvice: "Maintain a 75% margin for fine dining standards."
    };
  },
  analyzeReceiptFromApi: async (_base64: string) => ({ merchant: "Chef's Pantry", date: "2026-03-29", total: "1250.00", categories: ["Ingredients", "Kitchen Supplies"] }),
  analyzeLabelFromApi: async (_base64: string, _dietary: string[]) => ({ suitabilityScore: 9, flaggedIngredients: [], reasoning: "All ingredients are natural." }),
  extractIngredientsForShift: async (_miseEnPlace: string[], _menuTitle: string) => [
    { name: 'King Oyster Mushroom', quantity: 2, unit: 'kg', unitPrice: 150 },
    { name: 'Truffle Oil', quantity: 0.5, unit: 'L', unitPrice: 450 },
    { name: 'Sea Bass Fillets', quantity: 5, unit: 'kg', unitPrice: 320 }
  ]
};

// --- INLINED COMPONENTS ---

const Toast: React.FC<{ message: string | null; onDismiss: () => void }> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);
  if (!message) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
      <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
        <span className="text-emerald-400">✨</span>
        <p className="text-sm font-black uppercase tracking-widest">{message}</p>
      </div>
    </div>
  );
};

const QuickInfoModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; description: string; type: 'cost' | 'waste' | 'compliance' | 'general' }> = ({ isOpen, onClose, title, description, type }) => {
  if (!isOpen) return null;
  const getIcon = () => {
    switch (type) {
      case 'cost': return <span className="text-3xl">🧮</span>;
      case 'waste': return <span className="text-3xl">♻️</span>;
      case 'compliance': return <span className="text-3xl">🛡️</span>;
      default: return <span className="text-3xl">ℹ️</span>;
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 animate-fade-in">
      <div onClick={onClose} className="absolute inset-0" />
      <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 relative overflow-hidden shadow-2xl border-2 border-slate-200 animate-scale-up">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors p-2">✕</button>
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl border border-slate-100">{getIcon()}</div>
          <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter uppercase">{title}</h3>
          <p className="text-slate-600 text-lg leading-relaxed font-medium italic">{description}</p>
          <button onClick={onClose} className="mt-12 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl">Got it, Chef</button>
        </div>
      </div>
    </div>
  );
};

const PaymentModal: React.FC<{ isOpen: boolean; onClose: () => void; plan: SubscriptionPlan; onConfirm: () => void; price: string }> = ({ isOpen, onClose, plan, onConfirm, price }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const numericPrice = price.replace(/[^0-9.]/g, '');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900 opacity-70"></div>
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2 text-green-600">
                <span className="text-sm">🔒</span>
                <span className="text-xs font-black uppercase tracking-widest">Secure Checkout</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">✕</button>
        </div>
        <div className="p-8">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 capitalize tracking-tight">Unlock {plan}</h3>
                <p className="text-4xl font-black text-emerald-600 mt-2">{price}</p>
            </div>
            {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <span className="text-4xl animate-spin">⏳</span>
                    <p className="font-bold text-slate-900">Verifying Transaction...</p>
                </div>
            ) : (
                <div className="min-h-[150px] flex flex-col justify-center">
                    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
                        <PayPalButtons 
                            style={{ layout: "vertical", color: "black", shape: "pill", label: "pay" }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [{ amount: { currency_code: "USD", value: numericPrice }, description: `CaterPro AI - ${plan} Plan Subscription` }],
                                });
                            }}
                            onApprove={async (data, actions) => {
                                if (actions.order) {
                                    setIsProcessing(true);
                                    await actions.order.capture();
                                    onConfirm();
                                }
                            }}
                            onCancel={() => setIsProcessing(false)}
                            onError={(err) => { console.error("PayPal Error:", err); setIsProcessing(false); }}
                        />
                    </PayPalScriptProvider>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ onOpenModal: (type: 'cost' | 'waste' | 'compliance') => void }> = ({ onOpenModal }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in">
    <div onClick={() => onOpenModal('cost')} className="cursor-pointer bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl hover:border-emerald-500 transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">🧮</div>
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Costing</span>
      </div>
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Plate Margin</h4>
      <p className="text-4xl font-black text-slate-900 tracking-tighter">72.4%</p>
    </div>
    <div onClick={() => onOpenModal('waste')} className="cursor-pointer bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl hover:border-amber-500 transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">♻️</div>
        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Waste Tracker</span>
      </div>
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Food Waste</h4>
      <p className="text-4xl font-black text-slate-900 tracking-tighter">-12%</p>
    </div>
    <div onClick={() => onOpenModal('compliance')} className="cursor-pointer bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl hover:border-blue-500 transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">🛡️</div>
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Compliance</span>
      </div>
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">HACCP Score</h4>
      <p className="text-4xl font-black text-slate-900 tracking-tighter">98/100</p>
    </div>
  </div>
);

const HeroSection: React.FC<{ onStart: () => void; onOpenModal: (type: 'cost' | 'waste' | 'compliance') => void }> = ({ onStart, onOpenModal }) => (
  <div className="relative pt-32 pb-20 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center max-w-4xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">AI-Powered Culinary Intelligence</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8 uppercase italic">
          Cook with <span className="text-emerald-600">Precision</span>, Lead with <span className="text-emerald-600">Profit</span>.
        </h1>
        <p className="text-xl text-slate-600 font-medium mb-12 max-w-2xl mx-auto leading-relaxed italic">The world's first AI-driven catering engine that automates costing, menu design, and compliance for modern chefs.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button onClick={onStart} className="w-full sm:w-auto px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-600 transition-all shadow-2xl hover:scale-105 active:scale-95">Start Generating</button>
          <button onClick={() => onOpenModal('cost')} className="w-full sm:w-auto px-12 py-6 bg-white text-slate-900 border-2 border-slate-200 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:border-emerald-500 transition-all shadow-xl">View Demo</button>
        </div>
      </div>
      <Dashboard onOpenModal={onOpenModal} />
    </div>
  </div>
);

const PricingPage: React.FC<{ onSelectPlan: (plan: SubscriptionPlan, price: string) => void }> = ({ onSelectPlan }) => {
  const tiers = [
    { name: 'Commis', price: '$19', features: ['5 AI Generations/mo', 'Basic Costing', 'Standard Support'], id: 'commis' },
    { name: 'Chef de Partie', price: '$49', features: ['20 AI Generations/mo', 'Advanced Costing', 'Priority Support', 'Recipe Lab Access'], id: 'chef-de-partie', popular: true },
    { name: 'Executive', price: '$149', features: ['Unlimited Generations', 'Full CRM Integration', 'Custom Branding', 'Dedicated Mentor'], id: 'executive' }
  ];
  return (
    <div className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight uppercase italic mb-4">Choose Your Rank</h2>
          <p className="text-slate-500 font-medium italic">Scale your catering business with professional AI tools.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div key={tier.id} className={`bg-white p-10 rounded-[3rem] border-2 transition-all hover:scale-105 ${tier.popular ? 'border-emerald-500 shadow-2xl relative' : 'border-slate-100 shadow-xl'}`}>
              {tier.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</span>}
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">{tier.name}</h3>
              <p className="text-5xl font-black text-slate-900 mb-8">{tier.price}<span className="text-sm font-bold text-slate-400">/mo</span></p>
              <ul className="space-y-4 mb-10">
                {tier.features.map(f => <li key={f} className="text-sm font-medium text-slate-600 flex items-center gap-3"><span>✅</span> {f}</li>)}
              </ul>
              <button onClick={() => onSelectPlan(tier.id as SubscriptionPlan, tier.price)} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${tier.popular ? 'bg-emerald-600 text-white shadow-xl hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>Select Plan</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PlateCostCalculator: React.FC<{ ingredients: IngredientCost[] }> = ({ ingredients }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<{ id: string; quantity: number }[]>([]);
  const [markup, setMarkup] = useState(300);
  const totalCost = selectedIngredients.reduce((sum, item) => {
    const ing = ingredients.find(i => i.id === item.id);
    return sum + (ing ? ing.price * item.quantity : 0);
  }, 0);
  const suggestedPrice = totalCost * (markup / 100);
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">🧮</div>
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Plate Cost Engine</h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select 
            onChange={(e) => { if (e.target.value) { setSelectedIngredients([...selectedIngredients, { id: e.target.value, quantity: 1 }]); e.target.value = ''; } }}
            className="w-full p-4 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-bold focus:border-emerald-500 outline-none"
          >
            <option value="">Add Ingredient...</option>
            {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
          </select>
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border-2 border-slate-100">
            <span className="text-xs font-black text-slate-400 uppercase">Markup %</span>
            <input type="number" value={markup} onChange={(e) => setMarkup(Number(e.target.value))} className="bg-transparent font-black text-slate-900 w-20 outline-none" />
          </div>
        </div>
        <div className="space-y-3">
          {selectedIngredients.map((item, idx) => {
            const ing = ingredients.find(i => i.id === item.id);
            return (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900">{ing?.name}</span>
                <div className="flex items-center gap-4">
                  <input type="number" value={item.quantity} onChange={(e) => { const newItems = [...selectedIngredients]; newItems[idx].quantity = Number(e.target.value); setSelectedIngredients(newItems); }} className="w-16 bg-white border border-slate-200 rounded-lg p-1 text-center font-bold" />
                  <span className="text-xs font-bold text-slate-400">{ing?.unit}</span>
                  <button onClick={() => setSelectedIngredients(selectedIngredients.filter((_, i) => i !== idx))} className="text-red-400">✕</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pt-8 border-t-2 border-dashed border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Cost</p>
            <p className="text-3xl font-black text-slate-900">R {totalCost.toFixed(2)}</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Suggested Price</p>
            <p className="text-4xl font-black text-emerald-600">R {suggestedPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecipeGenerator: React.FC<{ dietaryRestrictions: string[], currency: string }> = ({ dietaryRestrictions, currency }) => {
  const [activeTab, setActiveTab] = useState<'receipt' | 'label' | 'menu'>('receipt');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [menuResult, setMenuResult] = useState<ScannedMenuCosting | null>(null);
  const [suppliers, setSuppliers] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    setResult(null);
    setMenuResult(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result?.toString().split(',')[1];
      if (!base64) return;
      try {
        if (activeTab === 'receipt') { setResult(await mockGeminiService.analyzeReceiptFromApi(base64)); }
        else if (activeTab === 'label') { setResult(await mockGeminiService.analyzeLabelFromApi(base64, dietaryRestrictions)); }
        else if (activeTab === 'menu') { setMenuResult(await mockGeminiService.analyzeMenuForCosting(base64, suppliers, currency)); }
      } catch (err) { console.error("Analysis failed", err); }
      finally { setIsAnalyzing(false); }
    };
    reader.readAsDataURL(file);
  };
  return (
    <section className="mt-16 animate-slide-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500 rounded-lg text-white"><span className="text-2xl">✨</span></div>
        <div>
          <h2 className="text-2xl font-black text-black opacity-100">Recipe Lab (Beta)</h2>
          <p className="text-sm text-black font-medium opacity-100">Vision AI Powered by Gemini 3</p>
        </div>
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
          {['receipt', 'menu', 'label'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab as any); setResult(null); setMenuResult(null); }} className={`flex-1 min-w-[150px] p-5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === tab ? 'bg-slate-50 text-amber-600 border-b-4 border-amber-600' : 'text-slate-500'}`}>
              {tab === 'receipt' ? '📄 Expenses' : tab === 'menu' ? '🍴 Menu Vision' : '🛡️ Allergens'}
            </button>
          ))}
        </div>
        <div className="p-8">
          {!result && !menuResult && !isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 text-slate-400"><span className="text-3xl">📷</span></div>
              <h4 className="text-lg font-bold text-slate-900">Upload Photo to Analyze</h4>
              <button onClick={() => fileInputRef.current?.click()} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-sm shadow-xl hover:scale-105 transition-all">Upload Photo</button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <span className="text-5xl animate-spin mb-4 text-amber-500">⏳</span>
              <p className="text-lg font-bold text-slate-900">Gemini Vision is Analyzing...</p>
            </div>
          ) : menuResult ? (
            <div className="animate-fade-in space-y-8">
              <div className="p-8 bg-pink-50 border-2 border-pink-100 rounded-[2rem]">
                <h5 className="text-2xl font-black text-pink-700 mb-6">Costing Intelligence</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuResult.menuItems.map((item, i) => (
                    <div key={i} className="p-5 bg-white rounded-2xl border border-pink-100 shadow-sm">
                      <h6 className="font-black text-slate-900 uppercase text-xs mb-2">{item.name}</h6>
                      <p className="text-[10px] font-black text-pink-500">{currency} {item.estimatedPortionCost} / p</p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setMenuResult(null)} className="w-full py-4 text-xs font-black uppercase text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">Scan New Menu</button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h5 className="text-2xl font-black text-slate-900">{result.merchant || 'Analysis Result'}</h5>
                <p className="text-4xl font-black text-amber-600 mt-4">R {result.total || result.suitabilityScore}</p>
              </div>
              <button onClick={() => setResult(null)} className="w-full py-4 mt-8 border-2 border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all text-xs uppercase">Scan Another</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const AiChatBot: React.FC<{ onAttemptAccess: () => boolean; isPro: boolean }> = ({ onAttemptAccess, isPro }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([{ role: 'model', content: "Hello! I'm your AI Catering Consultant. Ask me for advice!" }]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ErrorState | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => { if (isOpen && isPro) { inputRef.current?.focus(); if (!chatRef.current) { initializeChat(); } } }, [isOpen, isPro]);
    const handleToggleOpen = () => { if (isOpen) { setIsOpen(false); } else { if (onAttemptAccess()) { setIsOpen(true); } } };
    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
    useEffect(() => { scrollToBottom(); }, [messages, isLoading]);
    const initializeChat = () => {
        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
            chatRef.current = ai.chats.create({ model: 'gemini-3-flash-preview', config: { systemInstruction: 'You are a friendly AI Catering Consultant.' } });
        } catch (e) { setError(getApiErrorState(e)); }
    };
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = userInput.trim();
        if (!trimmedInput || isLoading) return;
        setError(null);
        setMessages(prev => [...prev, { role: 'user', content: trimmedInput }]);
        setUserInput('');
        setIsLoading(true);
        if (!chatRef.current) { setIsLoading(false); setError({ title: "Initialization Failed", message: "Chat has not been initialized." }); return; }
        try {
            const responseStream = await chatRef.current.sendMessageStream({ message: trimmedInput });
            let currentResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);
            for await (const chunk of responseStream) {
                currentResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'model') { newMessages[newMessages.length - 1].content = currentResponse; }
                    return newMessages;
                });
            }
        } catch (err) { setError(getApiErrorState(err)); } finally { setIsLoading(false); inputRef.current?.focus(); }
    };
    return (
        <div className="no-print fixed bottom-8 right-8 z-50 flex flex-col items-end gap-6">
            {isOpen && isPro && (
                <div className="w-[380px] h-[600px] flex flex-col shadow-2xl border border-slate-200 bg-white rounded-[3rem] overflow-hidden relative animate-slide-in">
                    <header className="flex-shrink-0 p-8 bg-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">👨‍🍳</div>
                            <div><h2 className="text-white font-black text-lg uppercase">Chef Mentor</h2></div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">✕</button>
                    </header>
                    <div className="flex-grow p-8 overflow-y-auto space-y-6 bg-slate-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                <div className={`max-w-[85%] rounded-[2rem] px-6 py-4 text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'}`}>{msg.content}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <footer className="flex-shrink-0 p-8 bg-white border-t border-slate-200">
                        <form onSubmit={handleSendMessage} className="relative">
                            <input ref={inputRef} type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ask about costing..." disabled={isLoading} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pr-16 text-sm font-medium outline-none" />
                            <button type="submit" disabled={isLoading || !userInput.trim()} className="absolute right-2 top-2 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">➡️</button>
                        </form>
                    </footer>
                </div>
            )}
            <button onClick={handleToggleOpen} className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                {isOpen ? <span>✕</span> : <span>💬</span>}
            </button>
        </div>
    );
};

const ShiftCalculatorModal: React.FC<{ isOpen: boolean; onClose: () => void; initialIngredients: ShiftIngredient[]; menuTitle: string }> = ({ isOpen, onClose, initialIngredients, menuTitle }) => {
  const [ingredients, setIngredients] = useState<ShiftIngredient[]>([]);
  useEffect(() => { if (isOpen) { setIngredients(initialIngredients); } }, [isOpen, initialIngredients]);
  const calculateTotal = () => ingredients.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 p-4">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-white border-2 border-emerald-500 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-3xl font-black text-slate-900">Executive Shift Breakdown</h2>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-full text-slate-400 transition-all">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <table className="w-full text-left">
            <thead><tr className="text-emerald-600 text-xs font-black uppercase tracking-widest"><th className="p-6">Ingredient</th><th className="p-6">Quantity</th><th className="p-6">Price</th><th className="p-6 text-right">Total</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {ingredients.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-6 font-bold">{item.name}</td>
                  <td className="p-6">{item.quantity} {item.unit}</td>
                  <td className="p-6">R {item.unitPrice}</td>
                  <td className="p-6 text-right font-black">R {(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <h3 className="text-5xl font-black text-slate-900"><span className="text-2xl text-emerald-600 mr-2">R</span>{calculateTotal().toFixed(2)}</h3>
          <button onClick={onClose} className="px-12 py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm">Close</button>
        </div>
      </div>
    </div>
  );
};

const ProposalDocument: React.FC<{ proposal: Menu; guests: string; formatCurrency: (amount: number) => string }> = ({ proposal, guests, formatCurrency }) => (
  <div id="proposal-content" className="bg-white p-16 rounded-[3rem] shadow-2xl border-2 border-slate-100 mb-12">
    <div className="flex justify-between items-start mb-12">
      <div>
        <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">{proposal.menuTitle}</h3>
        <p className="text-slate-500 font-medium italic">{proposal.description}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Drafted by CaterPro AI</p>
        <p className="text-sm font-bold text-slate-400">{new Date().toLocaleDateString()}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-6">Menu Selection</h4>
        <div className="space-y-8">
          <div><p className="text-[10px] font-black uppercase text-slate-400 mb-2">Appetizers</p><ul className="space-y-2">{proposal.appetizers.map(a => <li key={a} className="font-bold text-slate-900">{a}</li>)}</ul></div>
          <div><p className="text-[10px] font-black uppercase text-slate-400 mb-2">Main Courses</p><ul className="space-y-2">{proposal.mainCourses.map(m => <li key={m} className="font-bold text-slate-900">{m}</li>)}</ul></div>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-6">Service & Logistics</h4>
        <div className="space-y-8">
          <div><p className="text-[10px] font-black uppercase text-slate-400 mb-2">Service Notes</p><ul className="space-y-2">{proposal.serviceNotes.map(s => <li key={s} className="text-sm font-medium text-slate-600 italic">{s}</li>)}</ul></div>
          <div><p className="text-[10px] font-black uppercase text-slate-400 mb-2">Delivery</p><ul className="space-y-2">{proposal.deliveryLogistics.map(d => <li key={d} className="text-sm font-medium text-slate-600 italic">{d}</li>)}</ul></div>
        </div>
      </div>
    </div>
  </div>
);

const Navbar: React.FC<{ onViewChange: (view: string) => void; currentView: string }> = ({ onViewChange, currentView }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div onClick={() => onViewChange('landing')} className="flex items-center gap-3 cursor-pointer group">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-emerald-600 transition-colors">👨‍🍳</div>
        <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">CaterPro<span className="text-emerald-600">AI</span></span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {['Generator', 'Calculator', 'Pricing'].map(item => (
          <button key={item} onClick={() => onViewChange(item.toLowerCase())} className={`text-xs font-black uppercase tracking-widest transition-colors ${currentView === item.toLowerCase() ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-900'}`}>{item}</button>
        ))}
        <button onClick={() => onViewChange('generator')} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-lg">Get Started</button>
      </div>
    </div>
  </nav>
);

const Footer: React.FC<{ onViewChange: (view: string) => void }> = ({ onViewChange }) => (
  <footer className="bg-slate-900 text-white py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">👨‍🍳</div>
            <span className="text-xl font-black tracking-tighter uppercase italic">CaterPro<span className="text-emerald-400">AI</span></span>
          </div>
          <p className="text-slate-400 font-medium max-w-sm leading-relaxed italic">Empowering chefs and caterers with AI-driven precision.</p>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6">Platform</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-400">
            <li><button onClick={() => onViewChange('generator')} className="hover:text-white transition-colors">Menu Generator</button></li>
            <li><button onClick={() => onViewChange('calculator')} className="hover:text-white transition-colors">Cost Calculator</button></li>
            <li><button onClick={() => onViewChange('pricing')} className="hover:text-white transition-colors">Pricing Plans</button></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs font-bold text-slate-500">© 2026 CaterPro AI. Built for the Modern Kitchen.</p>
      </div>
    </div>
  </footer>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [viewMode, setViewMode] = useState('landing');
  const [ingredients, setIngredients] = useState<IngredientCost[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<Menu | null>(null);
  const [activeModal, setActiveModal] = useState<{ type: 'cost' | 'waste' | 'compliance' | 'general'; isOpen: boolean } | null>(null);
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; plan: SubscriptionPlan; price: string } | null>(null);
  const [shiftModal, setShiftModal] = useState<{ isOpen: boolean; ingredients: ShiftIngredient[]; title: string } | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'ingredientCosts'), where('userId', '==', DEMO_USER_ID));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IngredientCost));
      setIngredients(data);
    });
    return () => unsubscribe();
  }, []);

  const handleStart = () => setViewMode('generator');
  const handleOpenModal = (type: 'cost' | 'waste' | 'compliance') => setActiveModal({ type, isOpen: true });
  const handleSelectPlan = (plan: SubscriptionPlan, price: string) => setPaymentModal({ isOpen: true, plan, price });
  const formatCurrency = (amount: number) => `R ${amount.toFixed(2)}`;

  const generateProposal = async () => {
    setIsGenerating(true);
    setToastMessage('Chef AI is drafting your menu...');
    setTimeout(() => {
      setProposal({
        menuTitle: "Gourmet Fusion Experience",
        description: "A high-end culinary journey blending local ingredients with modern techniques.",
        appetizers: ["Truffle Arancini", "Citrus Cured Salmon"],
        mainCourses: ["Pan-Seared Sea Bass", "Herb-Crusted Rack of Lamb"],
        sideDishes: ["Roasted Root Vegetables", "Wild Mushroom Risotto"],
        dessert: ["Dark Chocolate Fondant", "Passion Fruit Sorbet"],
        beveragePairings: [{ menuItem: "Sea Bass", pairingSuggestion: "Chardonnay" }],
        miseEnPlace: ["Prep fish", "Make risotto base"],
        serviceNotes: ["Serve hot", "Garnish with microgreens"],
        deliveryLogistics: ["Refrigerated transport"],
        shoppingList: [{ store: "Local Market", category: "Produce", item: "Mushrooms", quantity: "2kg" }],
        recommendedEquipment: [{ item: "Sous Vide", description: "For lamb" }],
        costPerHead: 450,
        logistics: { deliveryFee: 250 }
      });
      setIsGenerating(false);
      setToastMessage('Proposal generated successfully!');
    }, 2000);
  };

  const downloadPDF = async () => {
    const element = document.getElementById('proposal-content');
    if (!element) return;
    setToastMessage('Preparing your PDF...');
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('CaterProAI_Proposal.pdf');
      setToastMessage('PDF downloaded!');
    } catch (err) { console.error(err); setToastMessage('PDF generation failed.'); }
  };

  const renderView = () => {
    switch (viewMode) {
      case 'generator':
        return (
          <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight uppercase italic mb-4">Menu Generator</h2>
              <p className="text-slate-500 font-medium italic">Describe your event and let AI handle the heavy lifting.</p>
            </div>
            {!proposal ? (
              <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border-2 border-slate-100">
                <div className="space-y-8">
                  <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Event Type</label><input type="text" placeholder="e.g. Wedding..." className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-sm font-bold outline-none" /></div>
                  <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Guest Count</label><input type="number" placeholder="50" className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-sm font-bold outline-none" /></div>
                  <button onClick={generateProposal} disabled={isGenerating} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50">{isGenerating ? 'Generating...' : 'Generate Proposal'}</button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <ProposalDocument proposal={proposal} guests="50" formatCurrency={formatCurrency} />
                <div className="flex justify-center gap-6">
                  <button onClick={() => setProposal(null)} className="px-12 py-6 bg-white text-slate-900 border-2 border-slate-200 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:border-emerald-500 transition-all shadow-xl">New Draft</button>
                  <button onClick={downloadPDF} className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-600 transition-all shadow-2xl">Download PDF</button>
                  <button onClick={async () => {
                    const ingredients = await mockGeminiService.extractIngredientsForShift(proposal.miseEnPlace, proposal.menuTitle);
                    setShiftModal({ isOpen: true, ingredients, title: proposal.menuTitle });
                  }} className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-700 transition-all shadow-2xl">Shift Breakdown</button>
                </div>
              </div>
            )}
            <RecipeGenerator dietaryRestrictions={[]} currency="R" />
          </div>
        );
      case 'calculator':
        return (
          <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
            <div className="text-center mb-16"><h2 className="text-5xl font-black text-slate-900 tracking-tight uppercase italic mb-4">Cost Calculator</h2></div>
            <PlateCostCalculator ingredients={ingredients} />
          </div>
        );
      case 'pricing': return <PricingPage onSelectPlan={handleSelectPlan} />;
      default: return <HeroSection onStart={handleStart} onOpenModal={handleOpenModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-200">
      <Navbar onViewChange={setViewMode} currentView={viewMode} />
      <main>{renderView()}</main>
      <Footer onViewChange={setViewMode} />
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      <AiChatBot onAttemptAccess={() => true} isPro={true} />
      {activeModal && (
        <QuickInfoModal 
          isOpen={activeModal.isOpen} 
          onClose={() => setActiveModal(null)} 
          title={activeModal.type === 'cost' ? 'Live Costing Engine' : activeModal.type === 'waste' ? 'Waste Management' : 'HACCP Compliance'}
          description={activeModal.type === 'cost' ? 'Real-time ingredient price tracking.' : activeModal.type === 'waste' ? 'AI-driven inventory tracking.' : 'Digital safety logs.'}
          type={activeModal.type}
        />
      )}
      {paymentModal && (
        <PaymentModal isOpen={paymentModal.isOpen} onClose={() => setPaymentModal(null)} plan={paymentModal.plan} price={paymentModal.price} onConfirm={() => { setPaymentModal(null); setToastMessage(`Welcome to ${paymentModal.plan}!`); }} />
      )}
      {shiftModal && (
        <ShiftCalculatorModal isOpen={shiftModal.isOpen} onClose={() => setShiftModal(null)} initialIngredients={shiftModal.ingredients} menuTitle={shiftModal.title} />
      )}
    </div>
  );
}
