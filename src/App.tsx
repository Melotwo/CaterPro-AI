import React, { useState, useEffect, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { db, auth } from './firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { GoogleGenAI, Chat } from '@google/genai';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { motion, AnimatePresence } from 'framer-motion';
import { generateMenuFromApi, generateMenuImageFromApi, getApiKey } from './services/geminiService';
import { Menu, MenuItem, Message, ShiftIngredient, DashboardStats, EngineeringItem, SubscriptionPlan, IngredientCost } from './types';

// --- CONSTANTS ---

const DEMO_USER_ID = 'DEMO_USER';
const WHOP_CHECKOUT_URL = "https://whop.com/caterpro-ai"; 
const HERO_FALLBACK = "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80";

// --- PAYPAL CONFIG ---
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "Adp-3XYWNARTpkCw4rbtFUnFox3mMwZtWWRy-TprJ8sOrV8X9z4xtyobRHuCx848mseDoqATaUooheFz";

// --- UTILS ---

const oklchToRgb = (oklchStr: string) => {
  if (oklchStr.includes('oklch')) {
    // Map common Tailwind v4 OKLCH values to Hex for PDF compatibility
    if (oklchStr.includes('0.796 0.265 162.49')) return '#10b981'; // emerald-500
    if (oklchStr.includes('0.129 0.042 264.695')) return '#020617'; // slate-950
    if (oklchStr.includes('0.746 0.16 232.661')) return '#0ea5e9'; // sky-500
    return '#10b981'; // Default fallback
  }
  return oklchStr;
};

const OCTAGON_CLIP = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';

// --- COMPONENTS ---

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div className="h-12 w-12 rounded-full border-2 border-emerald-500 overflow-hidden bg-white flex items-center justify-center shadow-lg relative">
      <img src="/logo.png" alt="CaterPro AI" className="w-10 h-10 object-contain" />
    </div>
    <span className="text-2xl font-black tracking-tighter uppercase italic text-white">
      CaterPro<span className="text-emerald-500">AI</span>
    </span>
  </div>
);

const SocialShareHub = ({ title }: { title: string }) => {
  const url = "caterproai.com";
  const text = `Check out this professional catering proposal from CaterProAi: ${title} - View at ${url}`;
  
  const share = (platform: string) => {
    let link = "";
    switch(platform) {
      case 'linkedin': link = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`; break;
      case 'facebook': link = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case 'whatsapp': link = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`; break;
      case 'x': link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`; break;
      case 'instagram': link = `https://www.instagram.com/`; break;
      default: break;
    }
    if (link) window.open(link, '_blank');
  };

  return (
    <div className="mt-12 p-10 bg-slate-800/40 rounded-[3rem] border border-white/10 text-center">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 opacity-60">Share Proposal Hub</p>
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-600', icon: '🔗' },
          { id: 'facebook', label: 'Facebook', color: 'bg-blue-800', icon: '👥' },
          { id: 'instagram', label: 'Instagram', color: 'bg-pink-600', icon: '📸' },
          { id: 'whatsapp', label: 'WhatsApp', color: 'bg-green-600', icon: '💬' },
          { id: 'x', label: 'X', color: 'bg-black', icon: '✖️' }
        ].map(p => (
          <button key={p.id} onClick={() => share(p.id)} className={`${p.color} text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center gap-2 hover:scale-105 transition-transform shadow-xl`}>
            <span>{p.icon}</span> {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const ProfitGauge: React.FC<{ margin: number }> = ({ margin }) => {
  const rotation = (Math.min(Math.max(margin, 0), 100) / 100) * 180 - 90;
  return (
    <div className="relative w-80 h-40 overflow-hidden mx-auto">
      <div className="absolute top-0 left-0 w-80 h-80 border-[16px] border-slate-800 rounded-full" />
      <motion.div 
        initial={{ rotate: -90 }}
        animate={{ rotate: rotation }}
        transition={{ type: 'spring', stiffness: 40, damping: 15 }}
        className="absolute bottom-0 left-1/2 w-1.5 h-40 bg-emerald-500 origin-bottom -translate-x-1/2 z-10"
      >
        <div className="w-6 h-6 bg-emerald-500 rounded-full -translate-x-[9px] -translate-y-3 shadow-2xl shadow-emerald-500/50 border-4 border-slate-950" />
      </motion.div>
      <div className="absolute top-0 left-0 w-80 h-80 border-[16px] border-transparent border-t-emerald-500 rounded-full opacity-20" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-60">Profit Margin</span>
        <p className="text-6xl font-black text-white tracking-tighter leading-none mt-2">{margin.toFixed(1)}%</p>
      </div>
    </div>
  );
};

const SavingsEstimator: React.FC = () => {
  const [monthlySpend, setMonthlySpend] = useState(50000);
  const savings = monthlySpend * 0.15; 
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl p-12 rounded-[4rem] border border-white/10 shadow-2xl mt-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-sky-500/20 rounded-2xl flex items-center justify-center text-sky-400 text-2xl">📈</div>
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Weight Audit Estimator</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">Monthly Food Spend (R)</label>
          <input 
            type="range" 
            min="10000" 
            max="500000" 
            step="5000" 
            value={monthlySpend} 
            onChange={(e) => setMonthlySpend(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xl font-black text-white italic">
            <span>R {monthlySpend.toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-emerald-600/10 border border-emerald-500/20 p-8 rounded-[3rem] text-center">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 opacity-60">Estimated Monthly Savings</p>
          <h4 className="text-5xl font-black text-emerald-400 tracking-tighter">R {savings.toLocaleString()}</h4>
          <p className="text-xs text-slate-400 italic mt-4 opacity-60">Based on 15% precision scaling efficiency</p>
        </div>
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
        <span className="text-xl">⚡</span>
        <p className="text-sm font-black uppercase tracking-widest">{message}</p>
      </div>
    </motion.div>
  );
};

const HeroSection: React.FC<{ onStart: () => void; margin: number }> = ({ onStart, margin }) => (
  <div className="relative pt-32 pb-20 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 rounded-full border border-sky-500/20 mb-12">
        <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Culinary Logic Engine</span>
      </motion.div>
      
      <div className="mb-16">
        <ProfitGauge margin={margin} />
      </div>

      <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-8 uppercase italic">
        CaterPro<span className="text-emerald-500">AI</span>
      </motion.h1>
      <p className="text-xl font-medium text-slate-400 opacity-60 max-w-2xl mx-auto mb-12 italic">
        Transparent costing. Stunning proposals. Zero-waste operations.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <button onClick={onStart} className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20 flex items-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
          <span className="text-xl">⚡</span>
          Start New Proposal
        </button>
        <button onClick={() => window.location.href = WHOP_CHECKOUT_URL} className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-2xl flex items-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
          <span className="text-xl">🛡️</span>
          Upgrade to Pro
        </button>
      </div>
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
    <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[4rem] border border-white/10 shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 text-xl">🧮</div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Small Batch Costing</h3>
      </div>
      <div className="space-y-6">
        <select onChange={(e) => { if (e.target.value) setSelected([...selected, { id: e.target.value, quantity: 1 }]); e.target.value = ''; }} className="w-full p-4 rounded-2xl bg-slate-800 text-white font-bold outline-none border border-white/10 text-sm">
          <option value="">+ Add Ingredient...</option>
          {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
        </select>
        <div className="space-y-3">
          {selected.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
              <span className="font-bold text-white">{ingredients.find(i => i.id === item.id)?.name}</span>
              <div className="flex items-center gap-4">
                <input type="number" value={item.quantity} onChange={(e) => { const n = [...selected]; n[idx].quantity = Number(e.target.value); setSelected(n); }} className="w-16 bg-slate-900 border border-white/10 rounded-lg p-1 text-center font-bold text-white text-xs" />
                <button onClick={() => setSelected(selected.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300 transition-colors text-xl">🗑️</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/10 flex justify-between items-center">
          <div><p className="text-[10px] font-black text-slate-400 uppercase opacity-60">Total Cost</p><p className="text-3xl font-black text-white tracking-tighter">R {total.toFixed(2)}</p></div>
          <div className="text-right"><p className="text-[10px] font-black text-emerald-500 uppercase opacity-60">Suggested Price</p><p className="text-4xl font-black text-emerald-500 tracking-tighter">R {suggested.toFixed(2)}</p></div>
        </div>
      </div>
    </div>
  );
};

const EnhancedPlateCostCalculator: React.FC<{ onAddToMatrix: (item: EngineeringItem) => void }> = ({ onAddToMatrix }) => {
  const [dishName, setDishName] = useState('');
  const [category, setCategory] = useState<'Appetizers' | 'Main Courses' | 'Desserts'>('Main Courses');
  const [menuPrice, setMenuPrice] = useState(0);
  const [unitsSold, setUnitsSold] = useState(0);
  const [ingredients, setIngredients] = useState<{ name: string; cost: number; qty: number; unit: string }[]>([
    { name: '', cost: 0, qty: 0, unit: 'kg' }
  ]);

  const plateCost = ingredients.reduce((sum, ing) => sum + (ing.cost * ing.qty), 0);
  const foodCostPct = menuPrice > 0 ? (plateCost / menuPrice) * 100 : 0;
  const margin = menuPrice - plateCost;

  const addIngredient = () => setIngredients([...ingredients, { name: '', cost: 0, qty: 0, unit: 'kg' }]);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index: number, field: string, value: any) => {
    const n = [...ingredients];
    n[index] = { ...n[index], [field]: value };
    setIngredients(n);
  };

  const handleAdd = () => {
    if (!dishName) return;
    onAddToMatrix({
      id: Math.random().toString(36).substr(2, 9),
      name: dishName,
      category,
      price: menuPrice,
      unitsSold,
      ingredients,
      totalCost: plateCost,
      foodCostPct,
      margin
    });
    setDishName('');
    setMenuPrice(0);
    setUnitsSold(0);
    setIngredients([{ name: '', cost: 0, qty: 0, unit: 'kg' }]);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 text-2xl">⚖️</div>
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Enhanced Cost Engine</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">Dish Identity</label>
          <input type="text" placeholder="Dish Name" value={dishName} onChange={(e) => setDishName(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-800 border border-white/10 text-white font-bold outline-none" />
          <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full p-4 rounded-2xl bg-slate-800 border border-white/10 text-white font-bold outline-none">
            <option value="Appetizers">Appetizers</option>
            <option value="Main Courses">Main Courses</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>
        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">Sales Performance</label>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Price (ZAR)</p>
              <input type="number" value={menuPrice} onChange={(e) => setMenuPrice(Number(e.target.value))} className="w-full p-4 rounded-2xl bg-slate-800 border border-white/10 text-white font-bold outline-none" />
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Units Sold</p>
              <input type="number" value={unitsSold} onChange={(e) => setUnitsSold(Number(e.target.value))} className="w-full p-4 rounded-2xl bg-slate-800 border border-white/10 text-white font-bold outline-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">Ingredient Breakdown</label>
          <button onClick={addIngredient} className="text-emerald-400 font-bold text-xs hover:text-emerald-300 transition-colors">+ Add Row</button>
        </div>
        {ingredients.map((ing, idx) => (
          <div key={idx} className="flex flex-wrap gap-4 items-end p-6 bg-slate-950/30 rounded-3xl border border-white/5">
            <div className="flex-1 min-w-[200px]">
              <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Ingredient</p>
              <input type="text" value={ing.name} onChange={(e) => updateIngredient(idx, 'name', e.target.value)} className="w-full bg-transparent border-b border-white/10 px-0 py-2 font-bold text-white outline-none" />
            </div>
            <div className="w-24">
              <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Cost (ZAR)</p>
              <input type="number" value={ing.cost} onChange={(e) => updateIngredient(idx, 'cost', Number(e.target.value))} className="w-full bg-transparent border-b border-white/10 px-0 py-2 font-bold text-white outline-none text-center" />
            </div>
            <div className="w-20">
              <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Qty</p>
              <input type="number" value={ing.qty} onChange={(e) => updateIngredient(idx, 'qty', Number(e.target.value))} className="w-full bg-transparent border-b border-white/10 px-0 py-2 font-bold text-white outline-none text-center" />
            </div>
            <div className="w-16">
              <p className="text-[8px] font-black text-slate-500 uppercase mb-2">Unit</p>
              <select value={ing.unit} onChange={(e) => updateIngredient(idx, 'unit', e.target.value)} className="w-full bg-transparent border-b border-white/10 px-0 py-2 font-bold text-white outline-none cursor-pointer">
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="ea">ea</option>
              </select>
            </div>
            {ingredients.length > 1 && (
              <button onClick={() => removeIngredient(idx)} className="pb-2 text-red-400/50 hover:text-red-400 transition-colors">🗑️</button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/10">
        <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Plate Cost</p>
          <h4 className="text-3xl font-black text-white">R {plateCost.toFixed(2)}</h4>
        </div>
        <div className="bg-emerald-600/10 p-6 rounded-3xl border border-emerald-500/20">
          <p className="text-[10px] font-black text-emerald-500 uppercase mb-2">Food Cost %</p>
          <h4 className="text-3xl font-black text-emerald-400">{foodCostPct.toFixed(1)}%</h4>
        </div>
        <div className="bg-sky-600/10 p-6 rounded-3xl border border-sky-500/20">
          <p className="text-[10px] font-black text-sky-500 uppercase mb-2">Contribution Margin</p>
          <h4 className="text-3xl font-black text-sky-400">R {margin.toFixed(2)}</h4>
        </div>
      </div>

      <button onClick={handleAdd} className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 transition-all shadow-xl" style={{ clipPath: OCTAGON_CLIP }}>
        Add to Menu Matrix
      </button>
    </div>
  );
};

const MenuEngineeringMatrix: React.FC<{ items: EngineeringItem[]; onRemove: (id: string) => void }> = ({ items, onRemove }) => {
  const avgProfit = items.length > 0 ? items.reduce((sum, i) => sum + i.margin, 0) / items.length : 0;
  const avgPopularity = items.length > 0 ? items.reduce((sum, i) => sum + i.unitsSold, 0) / items.length : 0;

  const quadrants = {
    stars: items.filter(i => i.margin >= avgProfit && i.unitsSold >= avgPopularity),
    plow_horses: items.filter(i => i.margin < avgProfit && i.unitsSold >= avgPopularity),
    puzzles: items.filter(i => i.margin >= avgProfit && i.unitsSold < avgPopularity),
    dogs: items.filter(i => i.margin < avgProfit && i.unitsSold < avgPopularity)
  };

  const Quadrant = ({ title, sub, icon, data, color }: { title: string; sub: string; icon: string; data: EngineeringItem[]; color: string }) => (
    <div className={`p-8 bg-slate-900/40 rounded-[3rem] border border-white/5 flex flex-col h-full min-h-[400px]`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className={`text-2xl font-black tracking-tighter uppercase ${color}`}>{title}</h4>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{sub}</p>
        </div>
        <span className="text-4xl filter grayscale opacity-20">{icon}</span>
      </div>
      <div className="flex-1 space-y-4">
        {data.map(item => (
          <div key={item.id} className="p-4 bg-slate-800/40 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-white text-sm uppercase italic">{item.name}</p>
              <button onClick={() => onRemove(item.id)} className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-[8px] font-black text-slate-500 uppercase">Margin</p>
                <p className="text-xs font-black text-emerald-400">R {item.margin.toFixed(0)}</p>
              </div>
              <div className="flex-1">
                <p className="text-[8px] font-black text-slate-500 uppercase">FC %</p>
                <p className="text-xs font-black text-sky-400">{item.foodCostPct.toFixed(0)}%</p>
              </div>
              <div className="flex-1">
                <p className="text-[8px] font-black text-slate-500 uppercase">Sold</p>
                <p className="text-xs font-black text-white">{item.unitsSold}</p>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-slate-700 font-bold uppercase italic text-[10px] tracking-widest">No Items</div>}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center">
        <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter">Profit Matrix</h3>
        <p className="text-slate-500 font-medium italic opacity-60">Visualizing menu engineering performance metrics.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-6">
        <Quadrant title="Stars" sub="High Profit / High Popularity" icon="⭐" data={quadrants.stars} color="text-emerald-400" />
        <Quadrant title="Puzzles" sub="High Profit / Low Popularity" icon="🧩" data={quadrants.puzzles} color="text-sky-400" />
        <Quadrant title="Plow Horses" sub="Low Profit / High Popularity" icon="🐴" data={quadrants.plow_horses} color="text-orange-400" />
        <Quadrant title="Dogs" sub="Low Profit / Low Popularity" icon="🦴" data={quadrants.dogs} color="text-red-400" />
      </div>
    </div>
  );
};

const DashboardView: React.FC<{ stats: DashboardStats; recent: Menu[]; onGenerate: () => void; onSelectProposal: (menu: Menu) => void }> = ({ stats, recent, onGenerate, onSelectProposal }) => (
  <div className="pt-32 max-w-7xl mx-auto px-6 space-y-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Proposals Generated', value: stats.totalProposals, sub: 'All time', icon: '📝' },
        { label: 'Est. Total Revenue', value: `R ${stats.totalRevenue.toLocaleString()}`, sub: 'ZAR', icon: '💰' },
        { label: 'Avg Profit Margin', value: `${stats.avgMargin.toFixed(1)}%`, sub: 'Calculated', icon: '📈' },
        { label: 'Last Event Type', value: stats.lastEventType || 'None Yet', sub: 'Recent', icon: '🏢' }
      ].map((stat, idx) => (
        <div key={idx} className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-xl group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
          </div>
          <h4 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h4>
          <p className="text-[10px] font-black text-emerald-500 uppercase opacity-40 mt-2">{stat.sub}</p>
        </div>
      ))}
    </div>

    <div className="bg-emerald-600/10 border border-emerald-500/20 p-16 rounded-[4rem] text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent opacity-50" />
      <div className="relative z-10">
        <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none">Draft your next <span className="text-emerald-500">Masterpiece</span></h3>
        <button onClick={onGenerate} className="px-16 py-8 bg-emerald-600 text-white rounded-[2.5rem] font-black uppercase text-sm hover:scale-105 transition-all shadow-2xl flex items-center gap-4 mx-auto" style={{ clipPath: OCTAGON_CLIP }}>
          <span className="text-2xl">⚡</span>
          Generate New Proposal
        </button>
      </div>
    </div>

    <div className="space-y-8">
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Recent Proposals</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recent.map((menu, idx) => (
          <div key={idx} onClick={() => onSelectProposal(menu)} className="bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-white/10 overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all">
            <div className="h-40 relative">
              <img src={menu.heroImage || HERO_FALLBACK} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-80" />
              {menu.heroImage?.includes('is_fallback=true') && (
                <div className="absolute top-4 left-4 z-20 bg-slate-950/85 backdrop-blur-sm text-[8px] uppercase tracking-wider px-2.5 py-1 rounded-lg text-slate-400 font-bold border border-white/5">
                  Curated
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h5 className="font-black text-white uppercase italic truncate">{menu.title}</h5>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>{menu.guestCount} Guests</span>
                <span className="text-emerald-500">R {(menu.manualTotal || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
        {recent.length === 0 && <div className="col-span-3 py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem] text-slate-700 font-black italic uppercase tracking-widest">No history yet. Start creating!</div>}
      </div>
    </div>
  </div>
);

const ShiftCalculatorModal: React.FC<{ isOpen: boolean; onClose: () => void; initialIngredients: ShiftIngredient[]; menuTitle: string; guestCount: number; onUpdateDishCost: (dishName: string, newCost: number) => void }> = ({ isOpen, onClose, initialIngredients, menuTitle, guestCount, onUpdateDishCost }) => {
  const [ingredients, setIngredients] = useState<ShiftIngredient[]>([]);
  useEffect(() => { if (isOpen) setIngredients(initialIngredients); }, [isOpen, initialIngredients]);
  
  const handleUpdate = (idx: number, field: keyof ShiftIngredient, val: any) => {
    const n = [...ingredients]; 
    n[idx] = { ...n[idx], [field]: val }; 
    setIngredients(n);
    
    if (n[idx].linkedDish) {
      const dishName = n[idx].linkedDish as string;
      const dishIngredients = n.filter(i => (i as any).linkedDish === dishName);
      const dishCostPerHead = dishIngredients.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      onUpdateDishCost(dishName, dishCostPerHead);
    }
  };

  const total = ingredients.reduce((sum, item) => sum + (item.quantity * guestCount * item.unitPrice), 0);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-6xl h-full max-h-[90vh] bg-slate-900/90 backdrop-blur-2xl border-2 border-emerald-500/30 rounded-[4rem] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-12 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 text-2xl">🧮</div>
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

const RecipeLab: React.FC<{ menu: Menu; onUpdate: (updated: Menu) => void }> = ({ menu, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const updated = { ...menu, miseEnPlace: ["Clean proteins", "Prepare reductions", "Dice aromatics"] };
      onUpdate(updated); setLoading(false);
    }, 1500);
  };

  const suggestVariations = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/suggest-variations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menu: menu.menu }),
      });

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const data = await res.json();
      const variations = data.variations || [];
      const updated = { ...menu, serviceNotes: [...menu.serviceNotes, ...variations] };
      onUpdate(updated);
    } catch (err) {
      console.warn("Server-side suggestVariations failed, falling back inline:", err);
      const variations = [
        "Vegan: Sub Salmon for Beetroot Carpaccio",
        "Gluten-Free: Use GF breadcrumbs for Arancini",
        "Halal: Ensure all meat is certified Halal"
      ];
      const updated = { ...menu, serviceNotes: [...menu.serviceNotes, ...variations] };
      onUpdate(updated);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl p-12 rounded-[4rem] border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 text-xl">🍴</div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">AI Recipe Lab</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={suggestVariations} disabled={aiLoading} className="px-4 py-2 bg-sky-600 text-white rounded-xl font-black uppercase text-[8px] hover:bg-sky-500 transition-all flex items-center gap-2">
            {aiLoading ? '🔄' : '✨'} Variations
          </button>
          <button onClick={generate} disabled={loading} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] disabled:opacity-50 hover:bg-emerald-500 transition-all flex items-center gap-2" style={{ clipPath: OCTAGON_CLIP }}>
            {loading ? <span className="animate-spin">🔄</span> : <span className="text-xl">⚡</span>}
            {loading ? 'Generating...' : 'Generate Mise en Place'}
          </button>
        </div>
      </div>
      <div className="space-y-8">
        {menu.miseEnPlace.length > 0 ? (
          <div><h4 className="text-xs font-black text-emerald-500 uppercase mb-4 tracking-widest opacity-60">Mise en Place</h4><ul className="space-y-4">{menu.miseEnPlace.map((s, i) => <li key={i} className="flex gap-4 p-6 bg-slate-800/30 rounded-3xl border border-white/5"><span className="text-emerald-500 font-black">0{i + 1}</span><p className="text-slate-300 italic">{s}</p></li>)}</ul></div>
        ) : <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 font-bold italic opacity-60">No recipes generated yet.</div>}
      </div>
    </div>
  );
};

const ProposalDocument: React.FC<{ proposal: Menu; onUpdate: (updated: Menu) => void; margin: number }> = ({ proposal, onUpdate, margin }) => {
  const updateItem = (idx: number, field: keyof MenuItem, val: any) => { 
    const menu = proposal.menu || [];
    const n = [...menu]; 
    n[idx] = { ...n[idx], [field]: val }; 
    onUpdate({ ...proposal, menu: n }); 
  };
  const updateRoot = (field: keyof Menu, val: any) => onUpdate({ ...proposal, [field]: val });
  const updateLogistics = (val: number) => onUpdate({ ...proposal, logistics: { ...(proposal.logistics || { deliveryFee: 0 }), deliveryFee: val } });

  const menu = proposal.menu || [];
  const totalDishPrice = menu.reduce((sum, m) => sum + (m.price || 0), 0);
  const calculatedTotal = (totalDishPrice * (proposal.guestCount || 0)) + (proposal.logistics?.deliveryFee || 0);
  
  const displayTotal = proposal.manualTotal !== undefined ? proposal.manualTotal : calculatedTotal;
  const displayPerHead = proposal.manualPerHead !== undefined ? proposal.manualPerHead : totalDishPrice;
  
  const depositAmount = (displayTotal * 0.5).toFixed(2);

  return (
    <div id="proposal-content" className="bg-slate-900/60 backdrop-blur-2xl p-16 rounded-[4rem] shadow-2xl border border-white/10 mb-12 relative overflow-hidden">
      {/* Floating Profit Gauge for real-time feedback */}
      <div className="absolute top-8 right-8 z-20 scale-50 origin-top-right opacity-80 hover:opacity-100 transition-opacity hidden lg:block">
        <ProfitGauge margin={margin} />
      </div>

      <div className="relative w-full h-[400px] mb-16 overflow-hidden">
        <img 
          src={proposal.heroImage || HERO_FALLBACK} 
          alt="Hero" 
          className="w-full h-full object-cover"
          style={{ clipPath: OCTAGON_CLIP }}
          onError={(e) => { (e.target as HTMLImageElement).src = HERO_FALLBACK; }}
          referrerPolicy="no-referrer"
        />
        {proposal.heroImage?.includes('is_fallback=true') && (
          <div className="absolute top-8 left-8 z-20 bg-slate-950/80 backdrop-blur-md px-4 py-2 border border-emerald-500/25 rounded-2xl flex items-center gap-2 text-xs text-slate-300 font-bold tracking-wide shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Curated Presentation Photo
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-8 left-8">
           <div contentEditable suppressContentEditableWarning onBlur={(e) => updateRoot('title', e.currentTarget.textContent || '')} className="text-6xl font-black text-white uppercase tracking-tighter outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-1">{proposal.title}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
        <div className="flex-1">
          <div contentEditable suppressContentEditableWarning onBlur={(e) => updateRoot('description', e.currentTarget.textContent || '')} className="text-slate-400 font-medium italic outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-1 opacity-60">{proposal.description}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-2 justify-end mb-2"><span className="text-[10px] font-black text-slate-400 uppercase opacity-60">Guests:</span><input type="number" value={proposal.guestCount} onChange={(e) => updateRoot('guestCount', Number(e.target.value))} className="w-16 bg-slate-800 border border-white/10 rounded-lg p-1 text-center font-bold text-white text-xs" /></div>
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Drafted by CaterPro AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          {['Appetizers', 'Main Courses', 'Desserts'].map(cat => (
            <div key={cat} className="space-y-8">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] border-b border-white/10 pb-4 opacity-60">{cat}</h4>
              <div className="space-y-10">
                {(proposal.menu || []).filter(m => m.cat === cat).map((item, i) => {
                  const idx = (proposal.menu || []).findIndex(x => x === item);
                  return (
                    <div key={i} className="group">
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <div contentEditable suppressContentEditableWarning onBlur={(e) => updateItem(idx, 'dish', e.currentTarget.textContent || '')} className="text-2xl font-black text-white uppercase outline-none focus:text-emerald-400 p-1 tracking-tighter">{item.dish}</div>
                        <div className="flex items-center gap-1 text-emerald-500 font-black italic text-sm">
                          <span>R</span>
                          <input 
                            type="number" 
                            value={item.price} 
                            onChange={(e) => updateItem(idx, 'price', Number(e.target.value))}
                            className="bg-transparent border-none outline-none w-16 text-right focus:text-white"
                          />
                          <span className="text-[10px] opacity-60">pp</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div contentEditable suppressContentEditableWarning onBlur={(e) => updateItem(idx, 'notes', e.currentTarget.textContent || '')} className="text-slate-400 text-sm italic outline-none focus:text-white p-1 opacity-60">{item.notes}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-40">Cost: R{item.cost}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-12">
          <div className="bg-slate-800/40 p-10 rounded-[3rem] border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-emerald-500 text-xl">🚚</span>
              <h4 className="text-xs font-black uppercase text-emerald-500 tracking-widest">Service & Logistics</h4>
            </div>
            <div className="space-y-8">
              <div><p className="text-[10px] font-black uppercase text-slate-400 mb-4 opacity-60">Service Notes</p><ul className="space-y-4">{proposal.serviceNotes.map((s, i) => <li key={i} contentEditable suppressContentEditableWarning onBlur={(e) => { const n = [...proposal.serviceNotes]; n[i] = e.currentTarget.textContent || ''; updateRoot('serviceNotes', n); }} className="text-sm font-medium text-slate-300 flex gap-3 outline-none focus:text-white"><span className="text-emerald-500">•</span> {s}</li>)}</ul></div>
              <div><p className="text-[10px] font-black uppercase text-slate-400 mb-4 opacity-60">Delivery Logistics</p><ul className="space-y-4">{proposal.deliveryLogistics.map((d, i) => <li key={i} contentEditable suppressContentEditableWarning onBlur={(e) => { const n = [...proposal.deliveryLogistics]; n[i] = e.currentTarget.textContent || ''; updateRoot('deliveryLogistics', n); }} className="text-sm font-medium text-slate-300 flex gap-3 outline-none focus:text-white"><span className="text-emerald-500">•</span> {d}</li>)}</ul></div>
            </div>
          </div>
          <div className="bg-emerald-600 p-10 rounded-[3rem] shadow-2xl text-white">
            <div className="flex items-center gap-2 mb-4 opacity-70">
              <span className="text-sm">💰</span>
              <p className="text-[10px] font-black uppercase tracking-widest">Total Proposal Value</p>
            </div>
            <div className="flex items-center gap-2 mb-8">
              <span className="text-4xl font-black">R</span>
              <input 
                type="number" 
                value={displayTotal} 
                onChange={(e) => updateRoot('manualTotal', Number(e.target.value))}
                className="text-7xl font-black tracking-tighter w-full bg-transparent border-none outline-none focus:ring-0"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-[8px] font-black uppercase opacity-60">Menu Price pp</p>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black">R</span>
                  <input 
                    type="number" 
                    value={displayPerHead} 
                    onChange={(e) => updateRoot('manualPerHead', Number(e.target.value))}
                    className="bg-transparent border-none outline-none text-xl font-black w-full"
                  />
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl"><p className="text-[8px] font-black uppercase opacity-60">Logistics (Edit)</p><div className="flex items-center gap-1"><span className="text-xl font-black">R</span><input type="number" value={proposal.logistics?.deliveryFee || 0} onChange={(e) => updateLogistics(Number(e.target.value))} className="bg-transparent border-none outline-none text-xl font-black w-full" /></div></div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-70">Enable Deposit Button</label>
              <button onClick={() => updateRoot('showDeposit', !proposal.showDeposit)} className={`w-12 h-6 rounded-full transition-all relative ${proposal.showDeposit ? 'bg-white' : 'bg-white/20'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${proposal.showDeposit ? 'left-7 bg-emerald-600' : 'left-1 bg-white'}`} />
              </button>
            </div>
            
            {proposal.showDeposit && (
              <div className="bg-white p-6 rounded-3xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 text-center">Pay 50% Deposit Now (R {depositAmount})</p>
                <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
                  <PayPalButtons style={{ layout: "horizontal", height: 45, shape: "pill", label: "pay" }} createOrder={(data, actions) => actions.order.create({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: (Number(depositAmount) / 18).toFixed(2) } }] })} />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
        </div>
      </div>
      <SocialShareHub title={proposal.title || 'Catering Proposal'} />
    </div>
  );
};

const AiChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'model', content: "Hello Chef! How can I help with your menu?" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { 
    if (isOpen && messages.length <= 1) { 
      // Checked if we have a connection and active server env
      fetch("/api/health").then(r => r.json()).then(data => {
        if (!data.hasApiKey) {
          setMessages(prev => [...prev, { role: 'model', content: "Notice: The server-side API Key is currently not set. Please add GEMINI_API_KEY to your environment variables." }]);
        }
      }).catch(() => {});
    } 
  }, [isOpen]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault(); if (!input.trim() || loading) return;
    const msg = input; setInput(''); setMessages(prev => [...prev, { role: 'user', content: msg }]); setLoading(true);
    try {
      const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await fetch(`/api/chat-stream?message=${encodeURIComponent(msg)}&history=${encodeURIComponent(JSON.stringify(historyPayload))}`);
      
      if (!response.ok) {
        throw new Error(`Chat connection failed: status ${response.status}`);
      }

      setMessages(prev => [...prev, { role: 'model', content: '' }]);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let full = '';

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkStr = decoder.decode(value || new Uint8Array(), { stream: !done });
          
          const lines = chunkStr.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (dataStr === "[DONE]") {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  full += parsed.text;
                  setMessages(prev => {
                    const n = [...prev];
                    n[n.length - 1].content = full;
                    return n;
                  });
                }
              } catch (e) {
                // Ignore partial JSON parsing errors
              }
            }
          }
        }
      }
    } catch (err: any) { 
      console.error("Chat streaming failed:", err);
      setMessages(prev => [...prev, { role: 'model', content: "Catering consultant is currently resting. Please verify your GEMINI_API_KEY is configured on the backend server." }]);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-[380px] h-[600px] flex flex-col shadow-2xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] overflow-hidden">
            <header className="p-8 bg-slate-950 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 text-xl">👨‍🍳</div>
                <h2 className="text-white font-black text-sm uppercase tracking-widest">Chef Mentor</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors text-xl">🗑️</button>
            </header>
            <div className="flex-grow p-8 overflow-y-auto space-y-6 bg-slate-900/50">{messages.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-[2rem] px-6 py-4 text-sm font-medium ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none'}`}>{m.content}</div></div>)}<div ref={endRef} /></div>
            <footer className="p-8 bg-slate-950 border-t border-white/5"><form onSubmit={send} className="relative"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Chef AI..." className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 pr-16 text-sm text-white outline-none focus:border-emerald-500" /><button type="submit" className="absolute right-2 top-2 w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-all text-xl">➡️</button></form></footer>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} className="w-20 h-20 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-600/30 text-2xl">
        {isOpen ? '🗑️' : '💬'}
      </motion.button>
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
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState(50);
  const [budget, setBudget] = useState('Standard (R250-R500pp)');
  const [cuisine, setCuisine] = useState('South African');

  // New features state
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalProposals: 0,
    totalRevenue: 0,
    avgMargin: 0,
    lastEventType: ''
  });
  const [recentProposals, setRecentProposals] = useState<Menu[]>([]);
  const [engineeringItems, setEngineeringItems] = useState<EngineeringItem[]>([]);

  useEffect(() => {
    // Load from localStorage
    const storedStats = localStorage.getItem('caterpro_stats');
    if (storedStats) setDashboardStats(JSON.parse(storedStats));

    const storedRecent = localStorage.getItem('caterpro_recent');
    if (storedRecent) setRecentProposals(JSON.parse(storedRecent));

    const storedItems = localStorage.getItem('caterpro_matrix');
    if (storedItems) setEngineeringItems(JSON.parse(storedItems));

    if (!db) return;
    const q = query(collection(db, 'ingredientCosts'), where('userId', '==', DEMO_USER_ID));
    return onSnapshot(q, (snap) => setIngredients(snap.docs.map(d => ({ id: d.id, ...d.data() } as IngredientCost))));
  }, []);

  useEffect(() => {
    localStorage.setItem('caterpro_stats', JSON.stringify(dashboardStats));
    localStorage.setItem('caterpro_recent', JSON.stringify(recentProposals));
    localStorage.setItem('caterpro_matrix', JSON.stringify(engineeringItems));
  }, [dashboardStats, recentProposals, engineeringItems]);

  const currentMargin = useMemo(() => {
    if (!proposal) return 72.4;
    const totalCost = (proposal.menu || []).reduce((sum, m) => sum + (m.cost * (proposal.guestCount || 0)), 0);
    const totalDishPrice = (proposal.menu || []).reduce((sum, m) => sum + m.price, 0);
    const calculatedTotal = (totalDishPrice * (proposal.guestCount || 0)) + (proposal.logistics?.deliveryFee || 0);
    const totalRevenue = proposal.manualTotal !== undefined ? proposal.manualTotal : calculatedTotal;
    const margin = ((totalRevenue - totalCost) / (totalRevenue || 1)) * 100;
    return isNaN(margin) ? 0 : margin;
  }, [proposal]);

  const generate = async () => {
    if (!eventType) { setToast('Please enter an event type.'); return; }
    setGenerating(true); setToast('Chef AI is drafting your menu...');
    try {
      const response = await generateMenuFromApi({ eventType, guestCount, budget, cuisine });
      
      if (response.error) {
        console.error("Menu Generation Error Object:", response);
        setToast(`Generation failed: ${response.error}`);
        return;
      }

      const data = response.data;
      // The generateMenuFromApi returns the full JSON object
      const menuData = data.menu || data; 
      
      const menuItems: MenuItem[] = [
        ...(menuData.appetizers || []).map((m: any) => ({ ...m, cat: 'Appetizers' })),
        ...(menuData.mainCourses || []).map((m: any) => ({ ...m, cat: 'Main Courses' })),
        ...(menuData.desserts || menuData.dessert || []).map((m: any) => ({ ...m, cat: 'Desserts' }))
      ];

      const heroImage = await generateMenuImageFromApi(
        menuData.menuTitle || "Catering Event", 
        menuData.description || "", 
        menuData.mainCourses?.map((m: any) => m.dish)
      );

      const totalDishPrice = menuItems.reduce((sum, m) => sum + (m.price || 0), 0);
      const deliveryFee = (menuData.logistics?.deliveryFee || 0);
      const totalRevenue = (totalDishPrice * guestCount) + deliveryFee;

      const newProposal: Menu = {
        title: menuData.menuTitle || eventType,
        description: menuData.description || "A custom tailored experience.",
        menu: menuItems,
        miseEnPlace: menuData.miseEnPlace || [],
        serviceNotes: menuData.serviceNotes || [],
        deliveryLogistics: menuData.deliveryLogistics || [],
        logistics: menuData.logistics || { deliveryFee: 0 },
        guestCount: guestCount,
        heroImage: heroImage || HERO_FALLBACK,
        shoppingList: menuData.shoppingList || [],
        manualTotal: totalRevenue,
        manualPerHead: totalDishPrice
      };

      setProposal(newProposal);

      // Update Dashboard Stats
      setDashboardStats(prev => {
        const newTotal = prev.totalProposals + 1;
        const newRevenue = prev.totalRevenue + totalRevenue;
        const currentPropMargin = currentMargin; 
        const newAvgMargin = prev.avgMargin === 0 ? currentPropMargin : (prev.avgMargin * (newTotal - 1) + currentPropMargin) / newTotal;
        return {
          totalProposals: newTotal,
          totalRevenue: newRevenue,
          avgMargin: newAvgMargin,
          lastEventType: eventType
        };
      });

      setRecentProposals(prev => [newProposal, ...prev].slice(0, 3));

      setView('proposal');
      if (heroImage && heroImage.includes('is_fallback=true')) {
        setToast('Proposal generated! Matched with beautiful curated culinary photography (AI generation quota exhausted/limited).');
      } else {
        setToast('Proposal generated!');
      }
    } catch (error: any) {
      console.error("Unexpected Application Error:", error);
      setToast(`An unexpected error occurred: ${error.message || 'Check console'}`);
    } finally {
      setGenerating(false);
    }
  };

  const saveProposalToCloud = async () => {
    if (!proposal) return;
    setToast('Saving to cloud...');
    try {
      if (proposal && proposal.menu) {
        console.log("Saving proposal to cloud (Placeholder):", proposal);
        setToast('Proposal saved (Simulation)!');
      }
    } catch (error: any) {
      console.error(error);
      setToast('Failed to save to cloud.');
    }
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
      <NoiseOverlay />
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/40 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div onClick={() => setView('landing')} className="cursor-pointer group">
            <Logo />
          </div>
          <div className="hidden md:flex items-center gap-10">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'generator', label: 'Generator', icon: '⚡' },
              { id: 'calculator', label: 'Calculator', icon: '🧮' },
              { id: 'education', label: 'Education', icon: '🎓' }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setView(item.id)} 
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${view === item.id ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <button onClick={() => window.location.href = WHOP_CHECKOUT_URL} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-emerald-500 hover:text-white transition-all shadow-xl" style={{ clipPath: OCTAGON_CLIP }}>Upgrade</button>
          </div>
        </div>
      </nav>
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HeroSection onStart={() => setView('dashboard')} margin={currentMargin} />
              <div className="max-w-7xl mx-auto px-6 pb-32">
                <SavingsEstimator />
              </div>
            </motion.div>
          )}
          {view === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pb-32">
              <DashboardView 
                stats={dashboardStats} 
                recent={recentProposals} 
                onGenerate={() => setView('generator')}
                onSelectProposal={(m) => { setProposal(m); setView('proposal'); }}
              />
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
                      <input 
                        type="text" 
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        placeholder="e.g. Wedding Gala..." 
                        className="w-full p-6 pl-16 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500 transition-all" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 opacity-60">Guest Count</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl">👥</span>
                      <input 
                        type="number" 
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        placeholder="50" 
                        className="w-full p-6 pl-16 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500 transition-all" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 opacity-60">Budget Range</label>
                      <select 
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full p-6 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500 transition-all appearance-none" 
                      >
                        <option>Budget (R150-R250pp)</option>
                        <option>Standard (R250-R500pp)</option>
                        <option>Premium (R500-R1000pp)</option>
                        <option>Executive (R1000pp+)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 opacity-60">Cuisine Type</label>
                      <select 
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                        className="w-full p-6 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500 transition-all appearance-none" 
                      >
                        <option>South African</option>
                        <option>Mediterranean</option>
                        <option>Asian Fusion</option>
                        <option>Continental</option>
                        <option>BBQ and Braai</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={generate} disabled={generating} className="w-full py-8 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
                    {generating ? <span className="animate-spin">🔄</span> : <span className="text-xl">⚡</span>}
                    {generating ? 'Chef AI is Drafting...' : 'Generate Proposal'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {view === 'proposal' && proposal && (
            <motion.div key="proposal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="pt-40 pb-20 max-w-7xl mx-auto px-6">
              <ProposalDocument proposal={proposal} onUpdate={setProposal} margin={currentMargin} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                <RecipeLab menu={proposal} onUpdate={setProposal} />
                <PlateCostEngine ingredients={ingredients} />
              </div>
              <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
                <button onClick={() => setView('generator')} className="px-12 py-6 bg-slate-900/40 backdrop-blur-xl text-white border border-white/10 rounded-[2rem] font-black uppercase text-sm hover:bg-slate-800 transition-all" style={{ clipPath: OCTAGON_CLIP }}>New Draft</button>
                <button onClick={saveProposalToCloud} className="px-12 py-6 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-600/30 transition-all flex items-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
                  <span className="text-xl">☁️</span>
                  Save to Cloud
                </button>
                <button onClick={exportPDF} className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-2xl flex items-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
                  <span className="text-xl">📥</span>
                  Download PDF
                </button>
                <button onClick={() => setShiftModal({ 
                  isOpen: true, 
                  ingredients: proposal.shoppingList || [], 
                  title: proposal.title || 'Proposal'
                })} className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 transition-all shadow-2xl flex items-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
                  <span className="text-xl">🧮</span>
                  Shift Breakdown
                </button>
              </div>
            </motion.div>
          )}
          {view === 'calculator' && (
            <motion.div key="calculator" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-40 pb-20 max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-6xl font-black text-white uppercase italic mb-4 tracking-tighter">Kitchen Profits</h2>
                <p className="text-slate-400 font-medium italic opacity-60">Engineered for absolute food service precision.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">
                <EnhancedPlateCostCalculator onAddToMatrix={(item) => setEngineeringItems([...engineeringItems, item])} />
                <PlateCostEngine ingredients={ingredients} />
              </div>

              <MenuEngineeringMatrix items={engineeringItems} onRemove={(id) => setEngineeringItems(engineeringItems.filter(i => i.id !== id))} />

              <button onClick={() => setView('dashboard')} className="w-full mt-8 py-6 bg-slate-900/40 backdrop-blur-xl text-white border border-white/10 rounded-[2rem] font-black uppercase text-sm hover:bg-slate-800 transition-all" style={{ clipPath: OCTAGON_CLIP }}>Back to Dashboard</button>
            </motion.div>
          )}
          {view === 'education' && (
            <motion.div key="education" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-40 pb-20 max-w-7xl mx-auto px-6">
              <div className="bg-slate-900/60 backdrop-blur-3xl p-12 rounded-[3rem] border border-white/10 text-center">
                <h2 className="text-4xl font-black text-white uppercase mb-4">Education Module</h2>
                <p className="text-slate-400 mb-8 text-xl">The Study Guide Generator is currently unavailable in this build.</p>
                <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full" />
              </div>
              <button onClick={() => setView('dashboard')} className="w-full mt-12 py-6 bg-slate-900/40 backdrop-blur-xl text-white border border-white/10 rounded-[2rem] font-black uppercase text-sm hover:bg-slate-800 transition-all" style={{ clipPath: OCTAGON_CLIP }}>Back to Dashboard</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-950 py-20 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Logo />
          </div>
          <p className="text-slate-500 font-medium italic mb-8 opacity-60">Empowering chefs with AI-driven precision. Built for the Modern Kitchen.</p>
        </div>
      </footer>

      <Toast message={toast} onDismiss={() => setToast(null)} />
      <AiChatBot />
      {shiftModal && proposal && <ShiftCalculatorModal isOpen={shiftModal.isOpen} onClose={() => setShiftModal(null)} initialIngredients={shiftModal.ingredients} menuTitle={shiftModal.title} guestCount={proposal.guestCount || 0} onUpdateDishCost={(dishName, newCost) => {
        const n = [...(proposal.menu || [])];
        const idx = n.findIndex(m => m.dish === dishName);
        if (idx !== -1) {
          n[idx].cost = newCost;
          setProposal({ ...proposal, menu: n });
        }
      }} />
    }
    </div>
  );
}
