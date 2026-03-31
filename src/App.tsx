import React, { useState, useEffect, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, onSnapshot, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
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
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";

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
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-slate-900 rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-white capitalize">Unlock {plan}</h3>
          <p className="text-4xl font-black text-emerald-600 mt-2">{price}</p>
        </div>
        {isProcessing ? (
          <div className="flex flex-col items-center py-10 space-y-4">
            <span className="text-4xl animate-spin">⏳</span>
            <p className="font-bold text-white">Verifying...</p>
          </div>
        ) : (
          <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
            <PayPalButtons style={{ layout: "vertical", shape: "pill" }} createOrder={(data, actions) => actions.order.create({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: price.replace('$', '') } }] })} onApprove={async (data, actions) => { setIsProcessing(true); await actions.order?.capture(); onConfirm(); }} onCancel={() => setIsProcessing(false)} />
          </PayPalScriptProvider>
        )}
        <button onClick={onClose} className="w-full mt-4 text-slate-500 font-bold text-sm">Cancel</button>
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
      <motion.div key={stat.label} whileHover={{ scale: 1.02 }} onClick={() => onOpenModal(stat.type)} className="cursor-pointer bg-slate-900/50 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl group">
        <div className="flex items-center justify-between mb-6">
          <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-2xl flex items-center justify-center text-${stat.color}-400`}>{stat.icon}</div>
          <span className={`text-[10px] font-black text-${stat.color}-400 uppercase tracking-widest`}>{stat.label}</span>
        </div>
        <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
      </motion.div>
    ))}
  </div>
);

const HeroSection: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="relative pt-32 pb-20 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-8">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">AI-Powered Culinary Intelligence</span>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8 uppercase italic">
        Cook with <span className="text-emerald-500">Precision</span>, Lead with <span className="text-emerald-500">Profit</span>.
      </motion.h1>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
        <button onClick={onStart} className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20">Start Generating</button>
      </div>
    </div>
  </div>
);

const PricingPage: React.FC<{ onSelectPlan: (plan: SubscriptionPlan, price: string) => void }> = ({ onSelectPlan }) => (
  <div className="py-40 bg-slate-950 max-w-7xl mx-auto px-6">
    <div className="text-center mb-20">
      <h2 className="text-5xl font-black text-white tracking-tight uppercase italic mb-4">Choose Your Rank</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { name: 'Commis', price: '$19', id: 'commis', features: ['5 AI Generations/mo', 'Basic Costing'] },
        { name: 'Chef de Partie', price: '$49', id: 'chef-de-partie', popular: true, features: ['20 AI Generations/mo', 'Advanced Costing', 'Recipe Lab'] },
        { name: 'Executive', price: '$149', id: 'executive', features: ['Unlimited Generations', 'Full CRM', 'Custom Branding'] }
      ].map((tier) => (
        <motion.div key={tier.id} whileHover={{ scale: 1.05 }} className={`bg-slate-900/50 backdrop-blur-xl p-10 rounded-[3rem] border ${tier.popular ? 'border-emerald-500 shadow-2xl' : 'border-white/10 shadow-xl'}`}>
          <h3 className="text-2xl font-black text-white uppercase mb-2">{tier.name}</h3>
          <p className="text-5xl font-black text-white mb-8">{tier.price}</p>
          <ul className="space-y-4 mb-10">
            {tier.features.map(f => <li key={f} className="text-sm font-medium text-slate-400 flex items-center gap-3"><span className="text-emerald-500">✅</span> {f}</li>)}
          </ul>
          <button onClick={() => onSelectPlan(tier.id as SubscriptionPlan, tier.price)} className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs bg-emerald-600 text-white hover:bg-emerald-700">Select Plan</button>
        </motion.div>
      ))}
    </div>
  </div>
);

const PlateCostEngine: React.FC<{ ingredients: IngredientCost[]; onUpdate?: (cost: number) => void }> = ({ ingredients, onUpdate }) => {
  const [selected, setSelected] = useState<{ id: string; quantity: number }[]>([]);
  const [markup, setMarkup] = useState(300);
  const total = selected.reduce((sum, item) => sum + (ingredients.find(i => i.id === item.id)?.price || 0) * item.quantity, 0);
  const suggested = total * (markup / 100);
  useEffect(() => { if (onUpdate) onUpdate(suggested); }, [suggested, onUpdate]);
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[4rem] border border-white/10 shadow-2xl">
      <h3 className="text-2xl font-black text-white uppercase mb-8">Plate Cost Engine</h3>
      <div className="space-y-6">
        <select onChange={(e) => { if (e.target.value) setSelected([...selected, { id: e.target.value, quantity: 1 }]); e.target.value = ''; }} className="w-full p-4 rounded-2xl bg-slate-800 text-white font-bold outline-none border border-white/10">
          <option value="">Add Ingredient...</option>
          {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
        </select>
        <div className="space-y-3">
          {selected.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5">
              <span className="font-bold text-white">{ingredients.find(i => i.id === item.id)?.name}</span>
              <div className="flex items-center gap-4">
                <input type="number" value={item.quantity} onChange={(e) => { const n = [...selected]; n[idx].quantity = Number(e.target.value); setSelected(n); }} className="w-16 bg-slate-900 border border-white/10 rounded-lg p-1 text-center font-bold text-white" />
                <button onClick={() => setSelected(selected.filter((_, i) => i !== idx))} className="text-red-400">✕</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/10 flex justify-between items-center">
          <div><p className="text-[10px] font-black text-slate-500 uppercase">Total Cost</p><p className="text-3xl font-black text-white">R {total.toFixed(2)}</p></div>
          <div className="text-right"><p className="text-[10px] font-black text-emerald-500 uppercase">Suggested Price</p><p className="text-4xl font-black text-emerald-500">R {suggested.toFixed(2)}</p></div>
        </div>
      </div>
    </div>
  );
};

const ShiftCalculatorModal: React.FC<{ isOpen: boolean; onClose: () => void; initialIngredients: ShiftIngredient[]; menuTitle: string; guestCount: number; onUpdateCost: (newCost: number) => void }> = ({ isOpen, onClose, initialIngredients, menuTitle, guestCount, onUpdateCost }) => {
  const [ingredients, setIngredients] = useState<ShiftIngredient[]>([]);
  useEffect(() => { if (isOpen) setIngredients(initialIngredients); }, [isOpen, initialIngredients]);
  const handleUpdate = (idx: number, field: keyof ShiftIngredient, val: any) => {
    const n = [...ingredients]; n[idx] = { ...n[idx], [field]: val }; setIngredients(n);
    const total = n.reduce((sum, item) => sum + (item.quantity * guestCount * item.unitPrice), 0);
    onUpdateCost(total / guestCount);
  };
  const total = ingredients.reduce((sum, item) => sum + (item.quantity * guestCount * item.unitPrice), 0);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-6xl h-full max-h-[90vh] bg-slate-900 border-2 border-emerald-500 rounded-[4rem] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-12 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-4xl font-black text-white uppercase">Shift Breakdown</h2>
          <button onClick={onClose} className="p-6 text-slate-500">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-12">
          <table className="w-full text-left">
            <thead><tr className="text-emerald-500 text-[10px] font-black uppercase border-b border-white/10"><th className="p-6">Ingredient</th><th className="p-6">Qty/Guest</th><th className="p-6">Unit Price</th><th className="p-6 text-right">Total</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {ingredients.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="p-6 font-bold text-white"><input value={item.name} onChange={(e) => handleUpdate(idx, 'name', e.target.value)} className="bg-transparent outline-none focus:text-emerald-400 w-full" /></td>
                  <td className="p-6 text-slate-400"><input type="number" value={item.quantity} onChange={(e) => handleUpdate(idx, 'quantity', Number(e.target.value))} className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-20 text-white" /> {item.unit}</td>
                  <td className="p-6 text-slate-400">R <input type="number" value={item.unitPrice} onChange={(e) => handleUpdate(idx, 'unitPrice', Number(e.target.value))} className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-24 text-white" /></td>
                  <td className="p-6 text-right font-black text-white">R {(item.quantity * guestCount * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-12 bg-slate-950 border-t border-white/10 flex items-center justify-between">
          <div><p className="text-[10px] font-black text-slate-500 uppercase mb-2">Total Shift Cost</p><h3 className="text-6xl font-black text-white tracking-tighter">R {total.toLocaleString()}</h3></div>
          <button onClick={onClose} className="px-16 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm">Close</button>
        </div>
      </motion.div>
    </div>
  );
};

const RecipeLab: React.FC<{ menu: Menu; onUpdate: (updated: Menu) => void }> = ({ menu, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const updated = { ...menu, miseEnPlace: ["Clean proteins", "Prepare reductions", "Dice aromatics"], menu: menu.menu.map(m => ({ ...m, recipe: ["Prep ingredients", "Cook to temp", "Plate and garnish"] })) };
      onUpdate(updated); setLoading(false);
    }, 1500);
  };
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-12 rounded-[4rem] border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-2xl font-black text-white uppercase">AI Recipe Lab</h3>
        <button onClick={generate} disabled={loading} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] disabled:opacity-50">{loading ? 'Generating...' : 'Generate Recipes'}</button>
      </div>
      <div className="space-y-8">
        {menu.miseEnPlace.length > 0 ? (
          <>
            <div><h4 className="text-xs font-black text-emerald-500 uppercase mb-4">Mise en Place</h4><ul className="space-y-4">{menu.miseEnPlace.map((s, i) => <li key={i} className="flex gap-4 p-6 bg-slate-800/50 rounded-3xl border border-white/5"><span className="text-emerald-500 font-black">0{i + 1}</span><p className="text-slate-300 italic">{s}</p></li>)}</ul></div>
            <div><h4 className="text-xs font-black text-emerald-500 uppercase mb-4">Dish Instructions</h4><div className="space-y-6">{menu.menu.map((m, i) => <div key={i} className="p-6 bg-slate-800/30 rounded-3xl border border-white/5"><p className="font-black text-white uppercase text-sm mb-3">{m.dish}</p><ul className="space-y-2">{m.recipe?.map((r, ri) => <li key={ri} className="text-xs text-slate-400 italic">• {r}</li>)}</ul></div>)}</div></div>
          </>
        ) : <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 font-bold italic">No recipes generated yet.</div>}
      </div>
    </div>
  );
};

const ProposalDocument: React.FC<{ proposal: Menu; onUpdate: (updated: Menu) => void }> = ({ proposal, onUpdate }) => {
  const updateItem = (idx: number, field: keyof MenuItem, val: string) => { const n = [...proposal.menu]; n[idx] = { ...n[idx], [field]: val }; onUpdate({ ...proposal, menu: n }); };
  const updateRoot = (field: keyof Menu, val: any) => onUpdate({ ...proposal, [field]: val });
  const updateLogistics = (val: number) => onUpdate({ ...proposal, logistics: { ...proposal.logistics, deliveryFee: val } });
  const getFoodImage = (dish: string) => `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80&sig=${encodeURIComponent(dish)}`;

  return (
    <div id="proposal-content" className="bg-slate-900/80 backdrop-blur-2xl p-16 rounded-[4rem] shadow-2xl border border-white/10 mb-12 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
        <div className="flex-1">
          <div contentEditable suppressContentEditableWarning onBlur={(e) => updateRoot('title', e.currentTarget.textContent || '')} className="text-5xl font-black text-white uppercase tracking-tight mb-4 outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-1">{proposal.title}</div>
          <div contentEditable suppressContentEditableWarning onBlur={(e) => updateRoot('description', e.currentTarget.textContent || '')} className="text-slate-400 font-medium italic outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-1">{proposal.description}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-2 justify-end mb-2"><span className="text-[10px] font-black text-slate-500 uppercase">Guests:</span><input type="number" value={proposal.guestCount} onChange={(e) => updateRoot('guestCount', Number(e.target.value))} className="w-16 bg-slate-800 border border-white/10 rounded-lg p-1 text-center font-bold text-white text-xs" /></div>
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Drafted by CaterPro AI</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          {['Appetizers', 'Main Courses', 'Desserts'].map(cat => (
            <div key={cat} className="space-y-8">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] border-b border-white/10 pb-4">{cat}</h4>
              <div className="space-y-10">
                {proposal.menu.filter(m => m.cat === cat).map((item, i) => {
                  const idx = proposal.menu.findIndex(x => x === item);
                  return (
                    <div key={i} className="flex gap-6 items-start">
                      <img src={item.imageUrl || getFoodImage(item.dish)} alt={item.dish} className="w-32 h-32 rounded-[2rem] object-cover border border-white/10 shadow-lg" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }} referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <div contentEditable suppressContentEditableWarning onBlur={(e) => updateItem(idx, 'dish', e.currentTarget.textContent || '')} className="text-2xl font-black text-white uppercase outline-none focus:text-emerald-400 p-1">{item.dish}</div>
                        <div contentEditable suppressContentEditableWarning onBlur={(e) => updateItem(idx, 'notes', e.currentTarget.textContent || '')} className="text-slate-400 text-sm italic outline-none focus:text-white p-1">{item.notes}</div>
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
            <h4 className="text-xs font-black uppercase text-emerald-500 mb-8">Service & Logistics</h4>
            <div className="space-y-8">
              <div><p className="text-[10px] font-black uppercase text-slate-500 mb-4">Service Notes</p><ul className="space-y-4">{proposal.serviceNotes.map((s, i) => <li key={i} contentEditable suppressContentEditableWarning onBlur={(e) => { const n = [...proposal.serviceNotes]; n[i] = e.currentTarget.textContent || ''; updateRoot('serviceNotes', n); }} className="text-sm font-medium text-slate-300 flex gap-3 outline-none focus:text-white"><span className="text-emerald-500">•</span> {s}</li>)}</ul></div>
              <div><p className="text-[10px] font-black uppercase text-slate-500 mb-4">Delivery Logistics</p><ul className="space-y-4">{proposal.deliveryLogistics.map((d, i) => <li key={i} contentEditable suppressContentEditableWarning onBlur={(e) => { const n = [...proposal.deliveryLogistics]; n[i] = e.currentTarget.textContent || ''; updateRoot('deliveryLogistics', n); }} className="text-sm font-medium text-slate-300 flex gap-3 outline-none focus:text-white"><span className="text-emerald-500">•</span> {d}</li>)}</ul></div>
            </div>
          </div>
          <div className="bg-emerald-600 p-10 rounded-[3rem] shadow-2xl text-white">
            <p className="text-[10px] font-black uppercase mb-4 opacity-70">Total Proposal Value (Edit)</p>
            <div className="flex items-center gap-2 mb-8">
              <span className="text-4xl font-black">R</span>
              <input 
                type="number" 
                value={(proposal.costPerHead * proposal.guestCount) + proposal.logistics.deliveryFee} 
                onChange={(e) => {
                  const newTotal = Number(e.target.value);
                  const newCostPerHead = (newTotal - proposal.logistics.deliveryFee) / proposal.guestCount;
                  updateRoot('costPerHead', newCostPerHead);
                }}
                className="bg-transparent border-none outline-none text-6xl font-black tracking-tighter w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl"><p className="text-[8px] font-black uppercase opacity-60">Per Head (Edit)</p><div className="flex items-center gap-1"><span className="text-xl font-black">R</span><input type="number" value={proposal.costPerHead} onChange={(e) => updateRoot('costPerHead', Number(e.target.value))} className="bg-transparent border-none outline-none text-xl font-black w-full" /></div></div>
              <div className="bg-white/10 p-4 rounded-2xl"><p className="text-[8px] font-black uppercase opacity-60">Logistics (Edit)</p><div className="flex items-center gap-1"><span className="text-xl font-black">R</span><input type="number" value={proposal.logistics.deliveryFee} onChange={(e) => updateLogistics(Number(e.target.value))} className="bg-transparent border-none outline-none text-xl font-black w-full" /></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AiChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'model', content: "Hello Chef! How can I help with your menu?" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (isOpen && !chatRef.current) { const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY }); chatRef.current = ai.chats.create({ model: 'gemini-3-flash-preview', config: { systemInstruction: 'You are a professional AI Catering Consultant.' } }); } }, [isOpen]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault(); if (!input.trim() || loading) return;
    const msg = input; setInput(''); setMessages(prev => [...prev, { role: 'user', content: msg }]); setLoading(true);
    try {
      const res = await chatRef.current!.sendMessageStream({ message: msg });
      let full = ''; setMessages(prev => [...prev, { role: 'model', content: '' }]);
      for await (const chunk of res) { full += chunk.text; setMessages(prev => { const n = [...prev]; n[n.length - 1].content = full; return n; }); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-[380px] h-[600px] flex flex-col shadow-2xl border border-white/10 bg-slate-900 rounded-[3rem] overflow-hidden">
            <header className="p-8 bg-slate-950 flex items-center justify-between border-b border-white/5"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">👨‍🍳</div><h2 className="text-white font-black text-sm uppercase">Chef Mentor</h2></div><button onClick={() => setIsOpen(false)} className="text-slate-500">✕</button></header>
            <div className="flex-grow p-8 overflow-y-auto space-y-6 bg-slate-900/50">{messages.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-[2rem] px-6 py-4 text-sm font-medium ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none'}`}>{m.content}</div></div>)}<div ref={endRef} /></div>
            <footer className="p-8 bg-slate-950 border-t border-white/5"><form onSubmit={send} className="relative"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Chef AI..." className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 pr-16 text-sm text-white outline-none focus:border-emerald-500" /><button type="submit" className="absolute right-2 top-2 w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center">➡️</button></form></footer>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} className="w-20 h-20 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-600/30">{isOpen ? '✕' : '💬'}</motion.button>
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
  const [payModal, setPayModal] = useState<{ isOpen: boolean; plan: SubscriptionPlan; price: string } | null>(null);
  const [shiftModal, setShiftModal] = useState<{ isOpen: boolean; ingredients: ShiftIngredient[]; title: string } | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'ingredientCosts'), where('userId', '==', DEMO_USER_ID));
    return onSnapshot(q, (snap) => setIngredients(snap.docs.map(d => ({ id: d.id, ...d.data() } as IngredientCost))));
  }, []);

  const generate = async () => {
    setGenerating(true); setToast('Chef AI is drafting your menu...');
    setTimeout(() => {
      setProposal({
        title: "Gourmet Fusion Experience",
        description: "A high-end culinary journey blending local ingredients with modern techniques.",
        menu: [
          { dish: "Truffle Arancini", notes: "Risotto balls with black truffle.", cat: "Appetizers" },
          { dish: "Citrus Cured Salmon", notes: "Fresh Atlantic salmon with grapefruit.", cat: "Appetizers" },
          { dish: "Pan-Seared Sea Bass", notes: "With lemon caper butter.", cat: "Main Courses" },
          { dish: "Herb-Crusted Rack of Lamb", notes: "Slow-roasted with rosemary.", cat: "Main Courses" },
          { dish: "Dark Chocolate Fondant", notes: "Warm center with vanilla bean gelato.", cat: "Desserts" }
        ],
        miseEnPlace: [], serviceNotes: ["Serve appetizers on slate boards", "Main course plates must be warmed"], deliveryLogistics: ["Refrigerated transport required"], costPerHead: 450, logistics: { deliveryFee: 2500 }, guestCount: 50
      });
      setGenerating(false); setView('proposal'); setToast('Proposal generated!');
    }, 2000);
  };

  const exportPDF = async () => {
    const el = document.getElementById('proposal-content'); if (!el) return;
    setToast('Preparing PDF...');
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#020617' });
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
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div onClick={() => setView('landing')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">👨‍🍳</div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">CaterPro<span className="text-emerald-500">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {['Generator', 'Calculator', 'Pricing'].map(item => <button key={item} onClick={() => setView(item.toLowerCase())} className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${view === item.toLowerCase() ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}>{item}</button>)}
            <button onClick={() => setView('generator')} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-emerald-500 hover:text-white transition-all">Get Started</button>
          </div>
        </div>
      </nav>
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {view === 'landing' && <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HeroSection onStart={() => setView('generator')} /></motion.div>}
          {view === 'generator' && (
            <motion.div key="generator" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-40 pb-20 max-w-7xl mx-auto px-6">
              <div className="text-center mb-20"><h2 className="text-5xl font-black text-white uppercase italic mb-4">Menu Generator</h2><p className="text-slate-500 font-medium italic">Describe your event and let AI handle the heavy lifting.</p></div>
              <div className="max-w-2xl mx-auto bg-slate-900/50 backdrop-blur-xl p-12 rounded-[4rem] shadow-2xl border border-white/10">
                <div className="space-y-10">
                  <div><label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Event Type</label><input type="text" placeholder="e.g. Wedding Gala..." className="w-full p-6 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500" /></div>
                  <div><label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Guest Count</label><input type="number" placeholder="50" className="w-full p-6 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500" /></div>
                  <button onClick={generate} disabled={generating} className="w-full py-8 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 transition-all shadow-2xl disabled:opacity-50">{generating ? 'Chef AI is Drafting...' : 'Generate Proposal'}</button>
                </div>
              </div>
            </motion.div>
          )}
          {view === 'proposal' && proposal && (
            <motion.div key="proposal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="pt-40 pb-20 max-w-7xl mx-auto px-6">
              <ProposalDocument proposal={proposal} onUpdate={setProposal} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12"><RecipeLab menu={proposal} onUpdate={setProposal} /><PlateCostEngine ingredients={ingredients} /></div>
              <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
                <button onClick={() => setView('generator')} className="px-12 py-6 bg-slate-900 text-white border border-white/10 rounded-[2rem] font-black uppercase text-sm">New Draft</button>
                <button onClick={exportPDF} className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-2xl">Download PDF</button>
                <button onClick={() => setShiftModal({ isOpen: true, ingredients: [{ name: 'Sea Bass', quantity: 0.2, unit: 'kg', unitPrice: 350 }, { name: 'Truffles', quantity: 0.01, unit: 'kg', unitPrice: 2500 }, { name: 'Rack of Lamb', quantity: 0.3, unit: 'kg', unitPrice: 420 }], title: proposal.title })} className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 transition-all shadow-2xl">Shift Breakdown</button>
              </div>
            </motion.div>
          )}
          {view === 'calculator' && <motion.div key="calculator" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-40 pb-20 max-w-4xl mx-auto px-6"><div className="text-center mb-16"><h2 className="text-5xl font-black text-white uppercase italic mb-4">Cost Calculator</h2></div><PlateCostEngine ingredients={ingredients} /><button onClick={() => setView('landing')} className="w-full mt-8 py-6 bg-slate-900 text-white border border-white/10 rounded-[2rem] font-black uppercase text-sm">Back to Home</button></motion.div>}
          {view === 'pricing' && <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PricingPage onSelectPlan={(p, pr) => setPayModal({ isOpen: true, plan: p, price: pr })} /></motion.div>}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-950 py-20 border-t border-white/5"><div className="max-w-7xl mx-auto px-6 text-center"><div className="flex items-center justify-center gap-3 mb-8"><div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">👨‍🍳</div><span className="text-xl font-black tracking-tighter uppercase italic">CaterPro<span className="text-emerald-500">AI</span></span></div><p className="text-slate-500 font-medium italic mb-8">Empowering chefs with AI-driven precision. Built for the Modern Kitchen.</p></div></footer>

      <Toast message={toast} onDismiss={() => setToast(null)} />
      <AiChatBot />
      {payModal && <PaymentModal isOpen={payModal.isOpen} onClose={() => setPayModal(null)} plan={payModal.plan} price={payModal.price} onConfirm={() => { setPayModal(null); setToast(`Welcome to ${payModal.plan}!`); }} />}
      {shiftModal && proposal && <ShiftCalculatorModal isOpen={shiftModal.isOpen} onClose={() => setShiftModal(null)} initialIngredients={shiftModal.ingredients} menuTitle={shiftModal.title} guestCount={proposal.guestCount} onUpdateCost={(newCost) => setProposal(prev => prev ? { ...prev, costPerHead: newCost } : null)} />}
    </div>
  );
}
