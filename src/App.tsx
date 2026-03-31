import React, { useState, useEffect, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { GoogleGenAI, Chat } from '@google/genai';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { motion, AnimatePresence } from 'framer-motion';

// --- FIREBASE INITIALIZATION ---
// This assumes the file exists in your environment
import firebaseConfig from '../firebase-applet-config.json';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
  cost: number; // Internal production cost
  price: number; // Client-facing price
}

export interface Menu {
  title: string;
  description: string;
  menu: MenuItem[];
  miseEnPlace: string[];
  serviceNotes: string[];
  deliveryLogistics: string[];
  logistics: { deliveryFee: number };
  guestCount: number;
  heroImage?: string;
  showDeposit?: boolean;
  manualTotal?: number; // Manual override for budget
  manualPerHead?: number; // Manual override for per head
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
  linkedDish?: string;
}

// --- CONSTANTS ---

const DEMO_USER_ID = 'DEMO_USER';
// REPLACE THE STRING BELOW WITH YOUR LIVE PAYPAL CLIENT ID
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "Adp-3XYWNARTpkCw4rbtFUnFox3mMwZtWWRy-TprJ8sOrV8X9z4xtyobRHuCx848mseDoqATaUooheFz";
const WHOP_CHECKOUT_URL = "https://whop.com/caterpro-ai"; 
const HERO_FALLBACK = "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80";
const OCTAGON_CLIP = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';

// --- UTILS ---

const oklchToRgb = (oklchStr: string) => {
  if (oklchStr.includes('oklch')) {
    // Map common Tailwind v4 OKLCH values to Hex for PDF stability
    if (oklchStr.includes('0.796 0.265 162.49')) return '#10b981'; // emerald-500
    if (oklchStr.includes('0.129 0.042 264.695')) return '#020617'; // slate-950
    if (oklchStr.includes('0.746 0.16 232.661')) return '#0ea5e9'; // sky-500
    return '#10b981'; 
  }
  return oklchStr;
};

// --- COMPONENTS ---

const ProfitGauge: React.FC<{ margin: number }> = ({ margin }) => {
  const rotation = (Math.min(Math.max(margin, 0), 100) / 100) * 180 - 90;
  return (
    <div className="relative w-72 h-36 overflow-hidden mx-auto">
      <div className="absolute bottom-0 left-0 w-72 h-72 border-[14px] border-slate-800 rounded-full" />
      <motion.div 
        initial={{ rotate: -90 }}
        animate={{ rotate: rotation }}
        transition={{ type: 'spring', stiffness: 40, damping: 15 }}
        className="absolute bottom-0 left-1/2 w-1.5 h-36 bg-emerald-500 origin-bottom -translate-x-1/2 z-10"
      >
        <div className="w-5 h-5 bg-emerald-500 rounded-full -translate-x-[7.5px] -translate-y-2.5 shadow-2xl shadow-emerald-500/50 border-2 border-slate-950" />
      </motion.div>
      <div className="absolute bottom-0 left-0 w-72 h-72 border-[14px] border-transparent border-t-emerald-500 rounded-full opacity-20" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-60">Profit Margin</span>
        <p className="text-5xl font-black text-white tracking-tighter leading-none mt-1">{margin.toFixed(1)}%</p>
      </div>
    </div>
  );
};

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
        <span className="text-lg">⚡</span>
        <p className="text-sm font-black uppercase tracking-widest">{message}</p>
      </div>
    </motion.div>
  );
};

const PricingSection: React.FC = () => (
  <section className="py-24 bg-slate-950">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Executive Plans</h2>
        <p className="text-slate-400 opacity-60 italic mt-4">Scale your catering empire with AI-driven precision.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Commis', price: '$29', features: ['5 Proposals/mo', 'Basic Costing', 'Email Support'], link: WHOP_CHECKOUT_URL },
          { name: 'Chef de Partie', price: '$59', features: ['20 Proposals/mo', 'Advanced Analytics', 'Priority Support'], link: WHOP_CHECKOUT_URL },
          { name: 'Executive', price: '$99', features: ['Unlimited Proposals', 'AI Recipe Lab', 'Profit Gauges', 'Dedicated Manager'], popular: true, link: WHOP_CHECKOUT_URL }
        ].map((plan) => (
          <div key={plan.name} className={`relative p-12 rounded-[3.5rem] border ${plan.popular ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 bg-slate-900/40'} flex flex-col`}>
            {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>}
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{plan.name}</h3>
            <div className="text-4xl font-black text-white mb-8">{plan.price}<span className="text-sm opacity-60">/mo</span></div>
            <ul className="space-y-4 mb-12 flex-grow">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-slate-400 opacity-60">
                  <span className="text-emerald-500">✅</span> {f}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => window.location.href = plan.link}
              className={`w-full py-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${plan.popular ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-white text-slate-950 hover:bg-emerald-500 hover:text-white'}`}
              style={{ clipPath: OCTAGON_CLIP }}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ShiftCalculatorModal: React.FC<{ isOpen: boolean; onClose: () => void; initialIngredients: ShiftIngredient[]; guestCount: number; onUpdateDishCost: (dishName: string, newCost: number) => void }> = ({ isOpen, onClose, initialIngredients, guestCount, onUpdateDishCost }) => {
  const [ingredients, setIngredients] = useState<ShiftIngredient[]>([]);
  useEffect(() => { if (isOpen) setIngredients(initialIngredients); }, [isOpen, initialIngredients]);
  
  const handleUpdate = (idx: number, field: keyof ShiftIngredient, val: any) => {
    const n = [...ingredients]; 
    n[idx] = { ...n[idx], [field]: val }; 
    setIngredients(n);
    
    if (n[idx].linkedDish) {
      const dishIngredients = n.filter(i => i.linkedDish === n[idx].linkedDish);
      const dishCostPerHead = dishIngredients.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      onUpdateDishCost(n[idx].linkedDish, dishCostPerHead);
    }
  };

  const total = ingredients.reduce((sum, item) => sum + (item.quantity * guestCount * item.unitPrice), 0);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-6xl h-full max-h-[90vh] bg-slate-900/90 backdrop-blur-2xl border-2 border-emerald-500/30 rounded-[4rem] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-12 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl">🧮</div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Shift Breakdown</h2>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white transition-colors text-2xl">🗑️</button>
        </div>
        <div className="flex-1 overflow-y-auto p-12">
          <table className="w-full text-left">
            <thead><tr className="text-emerald-500 text-[10px] font-black uppercase border-b border-white/10"><th className="p-6">Ingredient</th><th className="p-6">Dish Link</th><th className="p-6">Qty/Guest</th><th className="p-6">Unit Price</th><th className="p-6 text-right">Total</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {ingredients.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-white"><input value={item.name} onChange={(e) => handleUpdate(idx, 'name', e.target.value)} className="bg-transparent outline-none focus:text-emerald-400 w-full" /></td>
                  <td className="p-6 text-slate-500 text-xs font-black uppercase italic opacity-60">{item.linkedDish || 'Unlinked'}</td>
                  <td className="p-6 text-slate-400 opacity-60"><input type="number" value={item.quantity} onChange={(e) => handleUpdate(idx, 'quantity', Number(e.target.value))} className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-20 text-white" /> {item.unit}</td>
                  <td className="p-6 text-slate-400 opacity-60">R <input type="number" value={item.unitPrice} onChange={(e) => handleUpdate(idx, 'unitPrice', Number(e.target.value))} className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-24 text-white" /></td>
                  <td className="p-6 text-right font-black text-white">R {(item.quantity * guestCount * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-12 bg-slate-950/50 border-t border-white/10 flex items-center justify-between">
          <div><p className="text-[10px] font-black text-slate-400 uppercase mb-2 opacity-60">Total Shift Cost</p><h3 className="text-6xl font-black text-white tracking-tighter">R {total.toLocaleString()}</h3></div>
          <button onClick={onClose} className="px-16 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 transition-all shadow-xl" style={{ clipPath: OCTAGON_CLIP }}>Confirm & Close</button>
        </div>
      </motion.div>
    </div>
  );
};

const ProposalDocument: React.FC<{ proposal: Menu; onUpdate: (updated: Menu) => void; margin: number }> = ({ proposal, onUpdate, margin }) => {
  const updateItem = (idx: number, field: keyof MenuItem, val: any) => { 
    const n = [...proposal.menu]; 
    n[idx] = { ...n[idx], [field]: val }; 
    onUpdate({ ...proposal, menu: n }); 
  };
  const updateRoot = (field: keyof Menu, val: any) => onUpdate({ ...proposal, [field]: val });
  const updateLogistics = (val: number) => onUpdate({ ...proposal, logistics: { ...proposal.logistics, deliveryFee: val } });

  const totalDishPrice = proposal.menu.reduce((sum, m) => sum + m.price, 0);
  const calculatedTotal = (totalDishPrice * proposal.guestCount) + proposal.logistics.deliveryFee;
  const displayTotal = proposal.manualTotal !== undefined ? proposal.manualTotal : calculatedTotal;
  const displayPerHead = proposal.manualPerHead !== undefined ? proposal.manualPerHead : totalDishPrice;
  const depositAmount = (displayTotal * 0.5).toFixed(2);

  return (
    <div id="proposal-content" className="bg-slate-900/60 backdrop-blur-2xl p-16 rounded-[4rem] shadow-2xl border border-white/10 mb-12 relative overflow-hidden">
      {/* Executive Dashboard: Profit Gauge */}
      <div className="absolute top-12 right-12 z-20 scale-75 origin-top-right hidden lg:block">
        <ProfitGauge margin={margin} />
      </div>

      {/* Single Hero Image Layout */}
      <div className="relative w-full h-[500px] mb-20 overflow-hidden">
        <img 
          src={proposal.heroImage || HERO_FALLBACK} 
          alt="Hero" 
          className="w-full h-full object-cover"
          style={{ clipPath: OCTAGON_CLIP }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-12 left-12">
           <h1 contentEditable suppressContentEditableWarning onBlur={(e) => updateRoot('title', e.currentTarget.textContent || '')} className="text-7xl font-black text-white uppercase tracking-tighter outline-none leading-none">
             {proposal.title}
           </h1>
           <div className="flex items-center gap-4 mt-6">
             <div className="h-px w-12 bg-emerald-500" />
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Executive Proposal</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
        <div className="max-w-xl">
          <p contentEditable suppressContentEditableWarning onBlur={(e) => updateRoot('description', e.currentTarget.textContent || '')} className="text-lg font-medium text-slate-400 italic outline-none opacity-60 leading-relaxed">
            {proposal.description}
          </p>
        </div>
        <div className="text-right space-y-2">
          <div className="flex items-center gap-3 justify-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">Guest Count:</span>
            <input 
              type="number" 
              value={proposal.guestCount} 
              onChange={(e) => updateRoot('guestCount', Number(e.target.value))} 
              className="w-20 bg-slate-800 border border-white/10 rounded-xl p-2 text-center font-black text-white text-sm" 
            />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-40 italic">Ref: CP-{Date.now().toString().slice(-6)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-16">
          {['Appetizers', 'Main Courses', 'Desserts'].map(cat => (
            <div key={cat} className="space-y-10">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] border-b border-white/10 pb-6 opacity-60">{cat}</h4>
              <div className="space-y-12">
                {proposal.menu.filter(m => m.cat === cat).map((item, i) => {
                  const idx = proposal.menu.findIndex(x => x === item);
                  return (
                    <div key={i} className="group relative">
                      <div className="flex items-baseline justify-between gap-6 mb-3">
                        <h3 contentEditable suppressContentEditableWarning onBlur={(e) => updateItem(idx, 'dish', e.currentTarget.textContent || '')} className="text-3xl font-black text-white uppercase tracking-tighter outline-none focus:text-emerald-400 transition-colors">
                          {item.dish}
                        </h3>
                        <div className="flex items-center gap-2 text-emerald-500 font-black italic text-lg">
                          <span className="opacity-60 text-sm">R</span>
                          <input 
                            type="number" 
                            value={item.price} 
                            onChange={(e) => updateItem(idx, 'price', Number(e.target.value))}
                            className="bg-transparent border-none outline-none w-20 text-right focus:text-white"
                          />
                          <span className="text-[10px] opacity-40 uppercase tracking-widest">pp</span>
                        </div>
                      </div>
                      <p contentEditable suppressContentEditableWarning onBlur={(e) => updateItem(idx, 'notes', e.currentTarget.textContent || '')} className="text-slate-400 text-sm italic outline-none opacity-60 group-hover:opacity-100 transition-opacity">
                        {item.notes}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-16">
          <div className="bg-slate-800/30 p-12 rounded-[3.5rem] border border-white/10 shadow-xl">
            <div className="flex items-center gap-4 mb-10">
              <span className="text-xl">🚚</span>
              <h4 className="text-xs font-black uppercase text-emerald-500 tracking-[0.3em]">Logistics & Service</h4>
            </div>
            <div className="space-y-10">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest opacity-60">Service Protocol</p>
                <ul className="space-y-5">
                  {proposal.serviceNotes.map((s, i) => (
                    <li key={i} contentEditable suppressContentEditableWarning onBlur={(e) => { const n = [...proposal.serviceNotes]; n[i] = e.currentTarget.textContent || ''; updateRoot('serviceNotes', n); }} className="text-sm font-medium text-slate-300 flex gap-4 outline-none group">
                      <span className="text-emerald-500 font-black opacity-40 group-hover:opacity-100">0{i+1}</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-10 border-t border-white/5">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest opacity-60">Delivery & Setup</p>
                <ul className="space-y-5">
                  {proposal.deliveryLogistics.map((d, i) => (
                    <li key={i} contentEditable suppressContentEditableWarning onBlur={(e) => { const n = [...proposal.deliveryLogistics]; n[i] = e.currentTarget.textContent || ''; updateRoot('deliveryLogistics', n); }} className="text-sm font-medium text-slate-300 flex gap-4 outline-none group">
                      <span className="text-emerald-500">🛡️</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Transparent Costing: Total Value Override */}
          <div className="bg-emerald-600 p-12 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-3 mb-6 opacity-60">
              <span className="text-sm">💰</span>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Total Proposal Value</p>
            </div>
            
            <div className="flex items-center gap-4 mb-10">
              <span className="text-5xl font-black">R</span>
              <input 
                type="number" 
                value={displayTotal} 
                onChange={(e) => updateRoot('manualTotal', Number(e.target.value))}
                className="text-8xl font-black tracking-tighter bg-transparent border-none outline-none w-full focus:ring-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-white/10 p-6 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black uppercase opacity-60 mb-2">Per Head (Edit)</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black">R</span>
                  <input 
                    type="number" 
                    value={displayPerHead} 
                    onChange={(e) => updateRoot('manualPerHead', Number(e.target.value))} 
                    className="bg-transparent border-none outline-none text-2xl font-black w-full" 
                  />
                </div>
              </div>
              <div className="bg-white/10 p-6 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black uppercase opacity-60 mb-2">Logistics (Edit)</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black">R</span>
                  <input 
                    type="number" 
                    value={proposal.logistics.deliveryFee} 
                    onChange={(e) => updateLogistics(Number(e.target.value))} 
                    className="bg-transparent border-none outline-none text-2xl font-black w-full" 
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">Enable Deposit Button</label>
              <button onClick={() => updateRoot('showDeposit', !proposal.showDeposit)} className={`w-14 h-7 rounded-full transition-all relative ${proposal.showDeposit ? 'bg-white' : 'bg-white/20'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full transition-all ${proposal.showDeposit ? 'left-8 bg-emerald-600' : 'left-1 bg-white'}`} />
              </button>
            </div>

            {proposal.showDeposit && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 text-center">Pay 50% Deposit Now (R {depositAmount})</p>
                <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
                  <PayPalButtons 
                    style={{ layout: "horizontal", height: 50, shape: "pill", label: "pay" }} 
                    createOrder={(data, actions) => actions.order.create({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: (Number(depositAmount) / 18).toFixed(2) } }] })} 
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [view, setView] = useState('landing');
  const [ingredients, setIngredients] = useState<IngredientCost[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [proposal, setProposal] = useState<Menu | null>(null);
  const [shiftModal, setShiftModal] = useState<{ isOpen: boolean; ingredients: ShiftIngredient[]; title: string } | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'ingredientCosts'), where('userId', '==', DEMO_USER_ID));
    return onSnapshot(q, (snap) => setIngredients(snap.docs.map(d => ({ id: d.id, ...d.data() } as IngredientCost))));
  }, []);

  const currentMargin = useMemo(() => {
    if (!proposal) return 72.4;
    const totalCost = proposal.menu.reduce((sum, m) => sum + (m.cost * proposal.guestCount), 0);
    const totalRevenue = proposal.manualTotal !== undefined ? proposal.manualTotal : (proposal.menu.reduce((sum, m) => sum + (m.price * proposal.guestCount), 0) + proposal.logistics.deliveryFee);
    const margin = ((totalRevenue - totalCost) / totalRevenue) * 100;
    return isNaN(margin) ? 0 : margin;
  }, [proposal]);

  const generate = async () => {
    setGenerating(true); setToast('Chef AI is drafting your menu...');
    setTimeout(() => {
      setProposal({
        title: "Gourmet Fusion Experience",
        description: "A high-end culinary journey blending local ingredients with modern techniques.",
        menu: [
          { dish: "Truffle Arancini", notes: "Risotto balls with black truffle.", cat: "Appetizers", cost: 25, price: 65 },
          { dish: "Citrus Cured Salmon", notes: "Fresh Atlantic salmon with grapefruit.", cat: "Appetizers", cost: 35, price: 85 },
          { dish: "Pan-Seared Sea Bass", notes: "With lemon caper butter.", cat: "Main Courses", cost: 75, price: 185 },
          { dish: "Herb-Crusted Rack of Lamb", notes: "Slow-roasted with rosemary.", cat: "Main Courses", cost: 95, price: 210 },
          { dish: "Dark Chocolate Fondant", notes: "Warm center with vanilla bean gelato.", cat: "Desserts", cost: 25, price: 75 }
        ],
        miseEnPlace: [], 
        serviceNotes: ["Serve appetizers on slate boards", "Main course plates must be warmed"], 
        deliveryLogistics: ["Refrigerated transport required"], 
        logistics: { deliveryFee: 2500 }, 
        guestCount: 50,
        heroImage: HERO_FALLBACK,
        showDeposit: false
      });
      setGenerating(false); setView('proposal'); setToast('Proposal generated!');
    }, 2000);
  };

  const exportPDF = async () => {
    const el = document.getElementById('proposal-content'); if (!el) return;
    setToast('Preparing PDF...');
    try {
      const canvas = await html2canvas(el, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#020617',
        onclone: (clonedDoc) => {
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const style = window.getComputedStyle(elements[i]);
            if (style.color.includes('oklch')) {
              (elements[i] as HTMLElement).style.color = oklchToRgb(style.color);
            }
            if (style.backgroundColor.includes('oklch')) {
              (elements[i] as HTMLElement).style.backgroundColor = oklchToRgb(style.backgroundColor);
            }
          }
        }
      });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const props = pdf.getImageProperties(img);
      const w = pdf.internal.pageSize.getWidth();
      const h = (props.height * w) / props.width;
      pdf.addImage(img, 'PNG', 0, 0, w, h);
      pdf.save('CaterProAI_Proposal.pdf');
      setToast('PDF downloaded!');
    } catch (err) { console.error(err); setToast('Export failed.'); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 relative">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/40 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div onClick={() => setView('landing')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform text-2xl">
              👨‍🍳
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase italic text-white">CaterPro<span className="text-emerald-500">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {[
              { id: 'generator', label: 'Generator', icon: '⚡' },
              { id: 'calculator', label: 'Calculator', icon: '🧮' }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setView(item.id)} 
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${view === item.id ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => window.location.href = WHOP_CHECKOUT_URL}
              className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-emerald-500 hover:text-white transition-all shadow-xl" 
              style={{ clipPath: OCTAGON_CLIP }}
            >
              Upgrade
            </button>
          </div>
        </div>
      </nav>
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative pt-40 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 rounded-full border border-sky-500/20 mb-12">
                    <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Executive Dashboard</span>
                  </motion.div>
                  
                  <div className="mb-16">
                    <ProfitGauge margin={currentMargin} />
                  </div>

                  <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-8 uppercase italic">
                    CaterPro<span className="text-emerald-500">AI</span>
                  </motion.h1>
                  <p className="text-xl font-medium text-slate-400 opacity-60 max-w-2xl mx-auto mb-12 italic">
                    Transparent costing. Stunning proposals. Zero-waste operations.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button onClick={() => setView('generator')} className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20 flex items-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
                      <span>⚡</span>
                      Start New Proposal
                    </button>
                    <button onClick={() => window.location.href = WHOP_CHECKOUT_URL} className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-2xl flex items-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
                      <span>🛡️</span>
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              </div>
              <PricingSection />
            </motion.div>
          )}
          
          {view === 'proposal' && proposal && (
            <motion.div key="proposal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="pt-40 pb-20 max-w-7xl mx-auto px-6">
              <ProposalDocument proposal={proposal} onUpdate={setProposal} margin={currentMargin} />
              <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
                <button onClick={() => setView('generator')} className="px-12 py-6 bg-slate-900/40 backdrop-blur-xl text-white border border-white/10 rounded-[2rem] font-black uppercase text-sm hover:bg-slate-800 transition-all" style={{ clipPath: OCTAGON_CLIP }}>New Draft</button>
                <button onClick={exportPDF} className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-2xl flex items-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
                  <span>📥</span>
                  Download PDF
                </button>
                <button onClick={() => setShiftModal({ 
                  isOpen: true, 
                  ingredients: [
                    { name: 'Sea Bass', quantity: 0.2, unit: 'kg', unitPrice: 350, linkedDish: 'Pan-Seared Sea Bass' }, 
                    { name: 'Truffles', quantity: 0.01, unit: 'kg', unitPrice: 2500, linkedDish: 'Truffle Arancini' }, 
                    { name: 'Rack of Lamb', quantity: 0.3, unit: 'kg', unitPrice: 420, linkedDish: 'Herb-Crusted Rack of Lamb' }
                  ], 
                  title: proposal.title 
                })} className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 transition-all shadow-2xl flex items-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
                  <span>🧮</span>
                  Shift Breakdown
                </button>
              </div>
            </motion.div>
          )}

          {view === 'generator' && (
            <motion.div key="generator" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-40 pb-20 max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-6xl font-black text-white uppercase italic mb-4 tracking-tighter">Menu Generator</h2>
                <p className="text-slate-400 font-medium italic opacity-60">Describe your event and let AI handle the heavy lifting.</p>
              </div>
              <div className="max-w-2xl mx-auto bg-slate-900/40 backdrop-blur-xl p-12 rounded-[4rem] shadow-2xl border border-white/10">
                <div className="space-y-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 opacity-60">Event Type</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl">🍴</span>
                      <input type="text" placeholder="e.g. Wedding Gala..." className="w-full p-6 pl-16 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 opacity-60">Guest Count</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl">👥</span>
                      <input type="number" placeholder="50" className="w-full p-6 pl-16 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500 transition-all" />
                    </div>
                  </div>
                  <button onClick={generate} disabled={generating} className="w-full py-8 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
                    {generating ? <span className="animate-spin">🔄</span> : <span>⚡</span>}
                    {generating ? 'Chef AI is Drafting...' : 'Generate Proposal'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'calculator' && (
            <motion.div key="calculator" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-40 pb-20 max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-6xl font-black text-white uppercase italic mb-4 tracking-tighter">Cost Calculator</h2>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[4rem] border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center text-xl">🧮</div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Quick Costing</h3>
                </div>
                <div className="space-y-6">
                  <select onChange={(e) => { if (e.target.value) setToast('Ingredient added!'); e.target.value = ''; }} className="w-full p-4 rounded-2xl bg-slate-800 text-white font-bold outline-none border border-white/10 text-sm">
                    <option value="">+ Add Ingredient...</option>
                    {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
                  </select>
                  <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 font-bold italic opacity-60">Add ingredients to calculate plate costs.</div>
                </div>
              </div>
              <button onClick={() => setView('landing')} className="w-full mt-8 py-6 bg-slate-900/40 backdrop-blur-xl text-white border border-white/10 rounded-[2rem] font-black uppercase text-sm hover:bg-slate-800 transition-all" style={{ clipPath: OCTAGON_CLIP }}>Back to Home</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-950 py-20 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl">
              👨‍🍳
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">CaterPro<span className="text-emerald-500">AI</span></span>
          </div>
          <p className="text-slate-500 font-medium italic mb-8 opacity-60">Empowering chefs with AI-driven precision. Built for the Modern Kitchen.</p>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <Toast message={toast} onDismiss={() => setToast(null)} />
      {shiftModal && proposal && (
        <ShiftCalculatorModal 
          isOpen={shiftModal.isOpen} 
          onClose={() => setShiftModal(null)} 
          initialIngredients={shiftModal.ingredients} 
          guestCount={proposal.guestCount} 
          onUpdateDishCost={(dishName, newCost) => {
            const n = [...proposal.menu];
            const idx = n.findIndex(m => m.dish === dishName);
            if (idx !== -1) {
              n[idx].cost = newCost;
              setProposal({ ...proposal, menu: n });
            }
          }} 
        />
      )}
    </div>
  );
}
