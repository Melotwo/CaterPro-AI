
import React, { useState, useEffect, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { GoogleGenAI, Chat } from '@google/genai';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES & INTERFACES ---

export interface IngredientCost {
  id?: string;
  name: string;
  unit: string;
  price: number;
  lastUpdated: any;
  userId: string;
}

export interface MenuItem {
  dish: string;
  notes: string;
  cat: 'Appetizers' | 'Main Courses' | 'Desserts';
  qctoModule?: string;
  imageUrl?: string;
  recipe?: string[];
}

export interface Menu {
  title: string;
  description: string;
  menu: MenuItem[];
  miseEnPlace: string[];
  serviceNotes: string[];
  deliveryLogistics: string[];
  costPerHead: number;
  logistics: { deliveryFee: number };
  imageQuery?: string;
  guestCount: number;
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
      message: 'The AI encountered an issue. Please refresh and try again.',
    };
    if (err instanceof Error) {
      const lowerCaseMessage = err.message.toLowerCase();
      if (lowerCaseMessage.includes('api key') || lowerCaseMessage.includes('permission denied')) {
          errorState = {
              title: 'API Configuration Alert',
              message: 'The AI service is unreachable. Check your API key.',
          };
      } else if (lowerCaseMessage.includes('billing') || lowerCaseMessage.includes('quota')) {
          errorState = {
              title: 'Service Limit Reached',
              message: "Your AI generation quota for today has been reached.",
          };
      } else {
        errorState.message = String(err.message);
      }
    }
    return errorState;
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
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200]"
    >
      <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20 backdrop-blur-xl">
        <span className="text-white">✨</span>
        <p className="text-sm font-black uppercase tracking-widest">{message}</p>
      </div>
    </motion.div>
  );
};

const PaymentModal: React.FC<{ isOpen: boolean; onClose: () => void; plan: SubscriptionPlan; onConfirm: () => void; price: string }> = ({ isOpen, onClose, plan, onConfirm, price }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const numericPrice = price.replace(/[^0-9.]/g, '');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md bg-slate-900 rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-8">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white capitalize tracking-tight">Unlock {plan}</h3>
                <p className="text-4xl font-black text-emerald-600 mt-2">{price}</p>
            </div>
            {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <span className="text-4xl animate-spin">⏳</span>
                    <p className="font-bold text-white">Verifying Transaction...</p>
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
      </motion.div>
    </div>
  );
};

const Dashboard: React.FC<{ onOpenModal: (type: string) => void }> = ({ onOpenModal }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
    {[
      { label: 'Plate Margin', value: '72.4%', icon: '🧮', color: 'emerald', type: 'cost' },
      { label: 'Food Waste', value: '-12%', icon: '♻️', color: 'amber', type: 'waste' },
      { label: 'HACCP Score', value: '98/100', icon: '🛡️', color: 'blue', type: 'compliance' }
    ].map((stat) => (
      <motion.div 
        key={stat.label}
        whileHover={{ scale: 1.02 }}
        onClick={() => onOpenModal(stat.type)}
        className="cursor-pointer bg-slate-900/50 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl group"
      >
        <div className="flex items-center justify-between mb-6">
          <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-2xl flex items-center justify-center text-${stat.color}-400 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
          <span className={`text-[10px] font-black text-${stat.color}-400 uppercase tracking-widest`}>{stat.label}</span>
        </div>
        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Live Metric</h4>
        <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
      </motion.div>
    ))}
  </div>
);

const HeroSection: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="relative pt-32 pb-20 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center max-w-4xl mx-auto mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">AI-Powered Culinary Intelligence</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8 uppercase italic"
        >
          Cook with <span className="text-emerald-500">Precision</span>, Lead with <span className="text-emerald-500">Profit</span>.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed italic"
        >
          The world's first AI-driven catering engine that automates costing, menu design, and compliance for modern chefs.
        </motion.p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart} 
            className="w-full sm:w-auto px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20"
          >
            Start Generating
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-12 py-6 bg-slate-900 text-white border border-white/10 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl"
          >
            View Demo
          </motion.button>
        </div>
      </div>
      <Dashboard onOpenModal={() => {}} />
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
    <div className="py-40 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-white tracking-tight uppercase italic mb-4">Choose Your Rank</h2>
          <p className="text-slate-500 font-medium italic">Scale your catering business with professional AI tools.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <motion.div 
              key={tier.id} 
              whileHover={{ scale: 1.05 }}
              className={`bg-slate-900/50 backdrop-blur-xl p-10 rounded-[3rem] border transition-all ${tier.popular ? 'border-emerald-500 shadow-2xl relative' : 'border-white/10 shadow-xl'}`}
            >
              {tier.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</span>}
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{tier.name}</h3>
              <p className="text-5xl font-black text-white mb-8">{tier.price}<span className="text-sm font-bold text-slate-500">/mo</span></p>
              <ul className="space-y-4 mb-10">
                {tier.features.map(f => <li key={f} className="text-sm font-medium text-slate-400 flex items-center gap-3"><span className="text-emerald-500">✅</span> {f}</li>)}
              </ul>
              <button onClick={() => onSelectPlan(tier.id as SubscriptionPlan, tier.price)} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${tier.popular ? 'bg-emerald-600 text-white shadow-xl hover:bg-emerald-700' : 'bg-white text-slate-950 hover:bg-emerald-500 hover:text-white'}`}>Select Plan</button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PlateCostCalculator: React.FC<{ ingredients: IngredientCost[]; onUpdate?: (cost: number) => void }> = ({ ingredients, onUpdate }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<{ id: string; quantity: number }[]>([]);
  const [markup, setMarkup] = useState(300);
  const totalCost = selectedIngredients.reduce((sum, item) => {
    const ing = ingredients.find(i => i.id === item.id);
    return sum + (ing ? ing.price * item.quantity : 0);
  }, 0);
  const suggestedPrice = totalCost * (markup / 100);

  useEffect(() => {
    if (onUpdate) onUpdate(suggestedPrice);
  }, [suggestedPrice, onUpdate]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[4rem] border border-white/10 shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">🧮</div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Plate Cost Engine</h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select 
            onChange={(e) => { if (e.target.value) { setSelectedIngredients([...selectedIngredients, { id: e.target.value, quantity: 1 }]); e.target.value = ''; } }}
            className="w-full p-4 rounded-2xl border border-white/10 bg-slate-800 text-white text-sm font-bold focus:border-emerald-500 outline-none"
          >
            <option value="">Add Ingredient...</option>
            {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
          </select>
          <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-black text-slate-500 uppercase">Markup %</span>
            <input type="number" value={markup} onChange={(e) => setMarkup(Number(e.target.value))} className="bg-transparent font-black text-white w-20 outline-none" />
          </div>
        </div>
        <div className="space-y-3">
          {selectedIngredients.map((item, idx) => {
            const ing = ingredients.find(i => i.id === item.id);
            return (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                <span className="font-bold text-white">{ing?.name}</span>
                <div className="flex items-center gap-4">
                  <input type="number" value={item.quantity} onChange={(e) => { const newItems = [...selectedIngredients]; newItems[idx].quantity = Number(e.target.value); setSelectedIngredients(newItems); }} className="w-16 bg-slate-900 border border-white/10 rounded-lg p-1 text-center font-bold text-white" />
                  <span className="text-xs font-bold text-slate-500">{ing?.unit}</span>
                  <button onClick={() => setSelectedIngredients(selectedIngredients.filter((_, i) => i !== idx))} className="text-red-400">✕</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Cost</p>
            <p className="text-3xl font-black text-white">R {totalCost.toFixed(2)}</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Suggested Price</p>
            <p className="text-4xl font-black text-emerald-500">R {suggestedPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShiftCalculatorModal: React.FC<{ isOpen: boolean; onClose: () => void; initialIngredients: ShiftIngredient[]; menuTitle: string; guestCount: number }> = ({ isOpen, onClose, initialIngredients, menuTitle, guestCount }) => {
  const [ingredients, setIngredients] = useState<ShiftIngredient[]>([]);
  useEffect(() => { if (isOpen) { setIngredients(initialIngredients); } }, [isOpen, initialIngredients]);
  const calculateTotal = () => ingredients.reduce((sum, item) => sum + (item.quantity * guestCount * item.unitPrice), 0);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-6xl h-full max-h-[90vh] bg-slate-900 border-2 border-emerald-500 rounded-[4rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-12 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">Executive Shift Breakdown</h2>
            <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mt-2">{menuTitle} ({guestCount} Guests)</p>
          </div>
          <button onClick={onClose} className="p-6 hover:bg-white/10 rounded-full text-slate-500 transition-all">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-12">
          <table className="w-full text-left">
            <thead>
              <tr className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/10">
                <th className="p-6">Ingredient</th>
                <th className="p-6">Qty / Guest</th>
                <th className="p-6">Total Qty</th>
                <th className="p-6">Unit Price</th>
                <th className="p-6 text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ingredients.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-white">{item.name}</td>
                  <td className="p-6 text-slate-400">{item.quantity} {item.unit}</td>
                  <td className="p-6 text-slate-400">{(item.quantity * guestCount).toFixed(2)} {item.unit}</td>
                  <td className="p-6 text-slate-400">R {item.unitPrice.toFixed(2)}</td>
                  <td className="p-6 text-right font-black text-white text-xl">R {(item.quantity * guestCount * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-12 bg-slate-950 border-t border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Shift Cost</p>
            <h3 className="text-6xl font-black text-white tracking-tighter">
              <span className="text-2xl text-emerald-500 mr-2">R</span>{calculateTotal().toLocaleString()}
            </h3>
          </div>
          <button onClick={onClose} className="px-16 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20">Close Breakdown</button>
        </div>
      </motion.div>
    </div>
  );
};

const RecipeGenerator: React.FC<{ menu: Menu; onUpdate: (updated: Menu) => void }> = ({ menu, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateRecipes = async () => {
    setIsGenerating(true);
    // Simulate AI logic for Mise en Place and Recipe generation
    setTimeout(() => {
      const newMise = [
        "Clean and portion all proteins to exact weight specifications.",
        "Prepare the base reductions for all sauces (4-hour simmer).",
        "Fine-dice all aromatics (mirepoix) for the main courses.",
        "Temper the chocolate for the desserts at exactly 31°C.",
        "Infuse the oils with fresh herbs for the appetizer garnishes."
      ];
      const updatedMenu = { ...menu, miseEnPlace: newMise };
      updatedMenu.menu = updatedMenu.menu.map(item => ({
        ...item,
        recipe: [
          `Step 1: Prepare ${item.dish} ingredients.`,
          `Step 2: Execute cooking technique for ${item.dish}.`,
          `Step 3: Plate and garnish according to chef standards.`
        ]
      }));
      onUpdate(updatedMenu);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-12 rounded-[4rem] border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">👨‍🍳</div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">AI Recipe Lab</h3>
        </div>
        <button 
          onClick={generateRecipes}
          disabled={isGenerating}
          className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all shadow-xl disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Recipes & Mise'}
        </button>
      </div>
      <div className="space-y-8">
        {menu.miseEnPlace.length > 0 ? (
          <>
            <div>
              <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4">Mise en Place</h4>
              <ul className="space-y-4">
                {menu.miseEnPlace.map((step, i) => (
                  <li key={i} className="flex gap-4 p-6 bg-slate-800/50 rounded-3xl border border-white/5 transition-all hover:border-emerald-500/30">
                    <span className="text-emerald-500 font-black text-lg">0{i + 1}</span>
                    <p className="text-slate-300 font-medium italic leading-relaxed">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4">Dish Instructions</h4>
              <div className="space-y-6">
                {menu.menu.map((item, idx) => (
                  <div key={idx} className="p-6 bg-slate-800/30 rounded-3xl border border-white/5">
                    <p className="font-black text-white uppercase text-sm mb-3">{item.dish}</p>
                    <ul className="space-y-2">
                      {item.recipe?.map((r, ri) => (
                        <li key={ri} className="text-xs text-slate-400 italic">• {r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-[3rem]">
            <p className="text-slate-500 font-bold italic">No recipes generated yet. Click the button above to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProposalDocument: React.FC<{ 
  proposal: Menu; 
  onUpdate: (updated: Menu) => void;
  formatCurrency: (amount: number) => string;
}> = ({ proposal, onUpdate, formatCurrency }) => {
  const handleItemChange = (index: number, field: keyof MenuItem, value: string) => {
    const newMenu = [...proposal.menu];
    newMenu[index] = { ...newMenu[index], [field]: value };
    onUpdate({ ...proposal, menu: newMenu });
  };

  const handleTitleChange = (value: string) => onUpdate({ ...proposal, title: value });
  const handleDescChange = (value: string) => onUpdate({ ...proposal, description: value });
  const handleCostChange = (value: number) => onUpdate({ ...proposal, costPerHead: value });
  const handleLogisticsChange = (value: number) => onUpdate({ ...proposal, logistics: { ...proposal.logistics, deliveryFee: value } });
  const handleGuestChange = (value: number) => onUpdate({ ...proposal, guestCount: value });

  const getFoodImage = (dish: string) => `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80&sig=${encodeURIComponent(dish)}`;

  return (
    <div id="proposal-content" className="bg-slate-900/80 backdrop-blur-2xl p-16 rounded-[4rem] shadow-2xl border border-white/10 mb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 -z-10 rounded-full blur-3xl" />
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
        <div className="flex-1">
          <input 
            value={proposal.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-5xl font-black text-white uppercase tracking-tight mb-4 bg-transparent border-none outline-none w-full focus:ring-2 focus:ring-emerald-500/20 rounded-xl"
            placeholder="Menu Title"
          />
          <textarea 
            value={proposal.description}
            onChange={(e) => handleDescChange(e.target.value)}
            className="text-slate-400 font-medium italic bg-transparent border-none outline-none w-full resize-none h-20 focus:ring-2 focus:ring-emerald-500/20 rounded-xl"
            placeholder="Description"
          />
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-2 justify-end mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Guests:</span>
            <input 
              type="number"
              value={proposal.guestCount}
              onChange={(e) => handleGuestChange(Number(e.target.value))}
              className="w-16 bg-slate-800 border border-white/10 rounded-lg p-1 text-center font-bold text-white text-xs"
            />
          </div>
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Drafted by CaterPro AI</p>
          <p className="text-sm font-bold text-slate-500">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          {['Appetizers', 'Main Courses', 'Desserts'].map(cat => (
            <div key={cat} className="space-y-8">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] border-b border-white/10 pb-4">{cat}</h4>
              <div className="space-y-10">
                {proposal.menu.filter(m => m.cat === cat).map((item, i) => {
                  const realIndex = proposal.menu.findIndex(x => x === item);
                  return (
                    <div key={i} className="group relative">
                      <div className="flex gap-6 items-start mb-4">
                        <img 
                          src={item.imageUrl || getFoodImage(item.dish)} 
                          alt={item.dish} 
                          className="w-32 h-32 rounded-[2rem] object-cover border border-white/10 shadow-lg"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'; }}
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <input 
                              value={item.dish}
                              onChange={(e) => handleItemChange(realIndex, 'dish', e.target.value)}
                              className="text-2xl font-black text-white uppercase tracking-tight bg-transparent border-none outline-none w-full focus:text-emerald-400 transition-colors"
                            />
                            {item.qctoModule && (
                              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                                {item.qctoModule}
                              </span>
                            )}
                          </div>
                          <textarea 
                            value={item.notes}
                            onChange={(e) => handleItemChange(realIndex, 'notes', e.target.value)}
                            className="text-slate-400 text-sm leading-relaxed font-medium italic bg-transparent border-none outline-none w-full resize-none h-12 focus:text-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          <div className="bg-slate-800/50 p-10 rounded-[3rem] border border-white/10 shadow-xl">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-8">Service & Logistics</h4>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Service Notes</p>
                <ul className="space-y-4">
                  {proposal.serviceNotes.map((s, i) => (
                    <li key={i} className="text-sm font-medium text-slate-300 flex gap-3">
                      <span className="text-emerald-500">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Delivery Logistics</p>
                <ul className="space-y-4">
                  {proposal.deliveryLogistics.map((d, i) => (
                    <li key={i} className="text-sm font-medium text-slate-300 flex gap-3">
                      <span className="text-emerald-500">•</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-emerald-600 p-10 rounded-[3rem] shadow-2xl shadow-emerald-600/20 text-white">
            <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Total Proposal Value</p>
            <div className="text-6xl font-black tracking-tighter mb-8">
              {formatCurrency((proposal.costPerHead * proposal.guestCount) + proposal.logistics.deliveryFee)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-[8px] font-black uppercase opacity-60">Per Head (Edit)</p>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black">R</span>
                  <input 
                    type="number"
                    value={proposal.costPerHead}
                    onChange={(e) => handleCostChange(Number(e.target.value))}
                    className="bg-transparent border-none outline-none text-xl font-black w-full"
                  />
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-[8px] font-black uppercase opacity-60">Logistics (Edit)</p>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black">R</span>
                  <input 
                    type="number"
                    value={proposal.logistics.deliveryFee}
                    onChange={(e) => handleLogisticsChange(Number(e.target.value))}
                    className="bg-transparent border-none outline-none text-xl font-black w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AiChatBot: React.FC<{ isPro: boolean }> = ({ isPro }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([{ role: 'model', content: "Hello Chef! I'm your AI Consultant. How can I help with your menu?" }]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const initializeChat = () => {
        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
            chatRef.current = ai.chats.create({ model: 'gemini-3-flash-preview', config: { systemInstruction: 'You are a professional AI Catering Consultant.' } });
        } catch (e) { console.error(e); }
    };

    useEffect(() => { if (isOpen && !chatRef.current) initializeChat(); }, [isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;
        const input = userInput;
        setUserInput('');
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setIsLoading(true);
        try {
            const responseStream = await chatRef.current!.sendMessageStream({ message: input });
            let currentResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);
            for await (const chunk of responseStream) {
                currentResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = currentResponse;
                    return newMessages;
                });
            }
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[380px] h-[600px] flex flex-col shadow-2xl border border-white/10 bg-slate-900 rounded-[3rem] overflow-hidden relative"
                    >
                        <header className="p-8 bg-slate-950 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">👨‍🍳</div>
                                <h2 className="text-white font-black text-sm uppercase tracking-widest">Chef Mentor</h2>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">✕</button>
                        </header>
                        <div className="flex-grow p-8 overflow-y-auto space-y-6 bg-slate-900/50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-[2rem] px-6 py-4 text-sm font-medium ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none'}`}>{msg.content}</div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <footer className="p-8 bg-slate-950 border-t border-white/5">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ask Chef AI..." className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 pr-16 text-sm text-white outline-none focus:border-emerald-500" />
                                <button type="submit" className="absolute right-2 top-2 w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center">➡️</button>
                            </form>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)} 
                className="w-20 h-20 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-600/30"
            >
                {isOpen ? <span className="text-2xl">✕</span> : <span className="text-3xl">💬</span>}
            </motion.button>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [viewMode, setViewMode] = useState('landing');
  const [ingredients, setIngredients] = useState<IngredientCost[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<Menu | null>(null);
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

  const formatCurrency = (amount: number) => `R ${amount.toLocaleString()}`;

  const generateProposal = async () => {
    setIsGenerating(true);
    setToastMessage('Chef AI is drafting your menu...');
    
    // Logic to fetch high-quality food images
    const getFoodImage = (query: string) => `https://images.unsplash.com/photo-${query.includes('salmon') ? '1467003909585-2f8a72700288' : query.includes('lamb') ? '1544025162-d76694265947' : query.includes('bass') ? '1534604973900-c41ab4c5d036' : '1559339352-11d035aa65de'}?auto=format&fit=crop&w=800&q=80`;

    setTimeout(() => {
      setProposal({
        title: "Gourmet Fusion Experience",
        description: "A high-end culinary journey blending local ingredients with modern techniques.",
        menu: [
          { dish: "Truffle Arancini", notes: "Crispy risotto balls with black truffle and parmesan.", cat: "Appetizers", qctoModule: "Module 4", imageUrl: getFoodImage("arancini") },
          { dish: "Citrus Cured Salmon", notes: "Fresh Atlantic salmon with grapefruit and dill.", cat: "Appetizers", imageUrl: getFoodImage("salmon") },
          { dish: "Pan-Seared Sea Bass", notes: "With lemon caper butter and seasonal greens.", cat: "Main Courses", qctoModule: "Module 7", imageUrl: getFoodImage("bass") },
          { dish: "Herb-Crusted Rack of Lamb", notes: "Slow-roasted with rosemary and garlic.", cat: "Main Courses", imageUrl: getFoodImage("lamb") },
          { dish: "Dark Chocolate Fondant", notes: "Warm center with vanilla bean gelato.", cat: "Desserts", imageUrl: getFoodImage("chocolate") },
          { dish: "Passion Fruit Sorbet", notes: "Refreshing palate cleanser.", cat: "Desserts", imageUrl: getFoodImage("sorbet") }
        ],
        miseEnPlace: [],
        serviceNotes: ["Serve appetizers on slate boards", "Main course plates must be warmed"],
        deliveryLogistics: ["Refrigerated transport required", "On-site setup 2 hours prior"],
        costPerHead: 450,
        logistics: { deliveryFee: 2500 },
        guestCount: 50
      });
      setIsGenerating(false);
      setViewMode('proposal');
      setToastMessage('Proposal generated successfully!');
    }, 2000);
  };

  const downloadPDF = async () => {
    const element = document.getElementById('proposal-content');
    if (!element) return;
    setToastMessage('Preparing your PDF...');
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#020617' });
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

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div onClick={() => setViewMode('landing')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-600/20 group-hover:scale-110 transition-transform">👨‍🍳</div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">CaterPro<span className="text-emerald-500">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {['Generator', 'Calculator', 'Pricing'].map(item => (
              <button 
                key={item} 
                onClick={() => setViewMode(item.toLowerCase())}
                className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${viewMode === item.toLowerCase() ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}
              >
                {item}
              </button>
            ))}
            <button onClick={() => setViewMode('generator')} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 hover:text-white transition-all shadow-xl">Get Started</button>
          </div>
        </div>
      </nav>
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {viewMode === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeroSection onStart={() => setViewMode('generator')} />
            </motion.div>
          )}

          {viewMode === 'generator' && (
            <motion.div 
              key="generator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-40 pb-20 max-w-7xl mx-auto px-6"
            >
              <div className="text-center mb-20">
                <h2 className="text-5xl font-black text-white tracking-tight uppercase italic mb-4">Menu Generator</h2>
                <p className="text-slate-500 font-medium italic">Describe your event and let AI handle the heavy lifting.</p>
              </div>
              <div className="max-w-2xl mx-auto bg-slate-900/50 backdrop-blur-xl p-12 rounded-[4rem] shadow-2xl border border-white/10">
                <div className="space-y-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Event Type</label>
                    <input type="text" placeholder="e.g. Wedding Gala..." className="w-full p-6 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Guest Count</label>
                    <input type="number" placeholder="50" className="w-full p-6 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500 transition-all" />
                  </div>
                  <button 
                    onClick={generateProposal}
                    disabled={isGenerating}
                    className="w-full py-8 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {isGenerating ? 'Chef AI is Drafting...' : 'Generate Proposal'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'proposal' && proposal && (
            <motion.div 
              key="proposal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pt-40 pb-20 max-w-7xl mx-auto px-6"
            >
              <ProposalDocument 
                proposal={proposal} 
                onUpdate={setProposal} 
                formatCurrency={formatCurrency} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                <RecipeGenerator menu={proposal} onUpdate={setProposal} />
                <PlateCostCalculator ingredients={ingredients} onUpdate={(suggested) => {
                  // Live link: update proposal cost if chef wants to use calculator result
                  // setProposal(prev => prev ? {...prev, costPerHead: suggested} : null);
                }} />
              </div>

              <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
                <button onClick={() => setViewMode('generator')} className="px-12 py-6 bg-slate-900 text-white border border-white/10 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl">New Draft</button>
                <button onClick={downloadPDF} className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-2xl">Download PDF</button>
                <button 
                  onClick={() => setShiftModal({ 
                    isOpen: true, 
                    ingredients: [
                      { name: 'Sea Bass', quantity: 0.2, unit: 'kg', unitPrice: 350 },
                      { name: 'Truffles', quantity: 0.01, unit: 'kg', unitPrice: 2500 },
                      { name: 'Rack of Lamb', quantity: 0.3, unit: 'kg', unitPrice: 420 },
                      { name: 'Microgreens', quantity: 0.05, unit: 'kg', unitPrice: 150 }
                    ], 
                    title: proposal.title 
                  })} 
                  className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20"
                >
                  Shift Breakdown
                </button>
              </div>
            </motion.div>
          )}

          {viewMode === 'calculator' && (
            <motion.div 
              key="calculator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pt-40 pb-20 max-w-4xl mx-auto px-6"
            >
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-white tracking-tight uppercase italic mb-4">Cost Calculator</h2>
                <p className="text-slate-500 font-medium italic">Precision costing for maximum profitability.</p>
              </div>
              <PlateCostCalculator ingredients={ingredients} />
              <button onClick={() => setViewMode('landing')} className="w-full mt-8 py-6 bg-slate-900 text-white border border-white/10 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all">Back to Home</button>
            </motion.div>
          )}

          {viewMode === 'pricing' && (
            <motion.div 
              key="pricing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PricingPage onSelectPlan={(plan: SubscriptionPlan, price: string) => setPaymentModal({ isOpen: true, plan, price })} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-950 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">👨‍🍳</div>
            <span className="text-xl font-black tracking-tighter uppercase italic">CaterPro<span className="text-emerald-500">AI</span></span>
          </div>
          <p className="text-slate-500 font-medium italic mb-8">Empowering chefs with AI-driven precision. Built for the Modern Kitchen.</p>
        </div>
      </footer>

      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      <AiChatBot isPro={true} />
      
      {paymentModal && (
        <PaymentModal 
          isOpen={paymentModal.isOpen} 
          onClose={() => setPaymentModal(null)} 
          plan={paymentModal.plan} 
          price={paymentModal.price} 
          onConfirm={() => {
            setPaymentModal(null);
            setToastMessage(`Welcome to the ${paymentModal.plan} tier!`);
          }} 
        />
      )}

      {shiftModal && proposal && (
        <ShiftCalculatorModal 
          isOpen={shiftModal.isOpen} 
          onClose={() => setShiftModal(null)} 
          initialIngredients={shiftModal.ingredients} 
          menuTitle={shiftModal.title} 
          guestCount={proposal.guestCount}
        />
      )}
    </div>
  );
}
