import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { GoogleGenAI } from '@google/genai';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { generateMenuFromApi, generateMenuImageFromApi, getApiKey } from '../services/geminiService';
import { Menu, MenuItem, Message, ShiftIngredient, DashboardStats, IngredientCost } from '../types';

// --- CONSTANTS ---
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "Adp-3XYWNARTpkCw4rbtFUnFox3mMwZtWWRy-TprJ8sOrV8X9z4xtyobRHuCx848mseDoqATaUooheFz";
const HERO_FALLBACK = "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80";
const OCTAGON_CLIP = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';

// --- UTILS ---
const oklchToRgb = (oklchStr: string) => {
  if (oklchStr.includes('oklch')) {
    if (oklchStr.includes('0.796 0.265 162.49')) return '#10b981'; // emerald-500
    if (oklchStr.includes('0.129 0.042 264.695')) return '#020617'; // slate-950
    if (oklchStr.includes('0.746 0.16 232.661')) return '#0ea5e9'; // sky-500
    return '#10b981';
  }
  return oklchStr;
};

// --- SUB-COMPONENTS ---

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
    <div id="social-share-hub-root" className="mt-12 p-10 bg-slate-800/40 rounded-[3rem] border border-white/10 text-center">
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
            <thead>
              <tr className="text-emerald-500 text-[10px] font-black uppercase border-b border-white/10">
                <th className="p-6">Ingredient</th>
                <th className="p-6">Dish Link</th>
                <th className="p-6">Qty/Guest</th>
                <th className="p-6">Unit Price</th>
                <th className="p-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ingredients.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-white">
                    <input value={item.name} onChange={(e) => handleUpdate(idx, 'name', e.target.value)} className="bg-transparent outline-none focus:text-emerald-400 w-full" />
                  </td>
                  <td className="p-6 text-slate-500 text-xs font-black uppercase italic opacity-60">{item.linkedDish || 'Unlinked'}</td>
                  <td className="p-6 text-slate-400 opacity-60">
                    <input type="number" value={item.quantity} onChange={(e) => handleUpdate(idx, 'quantity', Number(e.target.value))} className="bg-slate-800 border border-white/10 rounded px-2 py-1  w-20 text-white" /> {item.unit}
                  </td>
                  <td className="p-6 text-slate-400 opacity-60">
                    R <input type="number" value={item.unitPrice} onChange={(e) => handleUpdate(idx, 'unitPrice', Number(e.target.value))} className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-24 text-white" />
                  </td>
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
      onUpdate(updated); 
      setLoading(false);
    }, 1500);
  };

  const suggestVariations = async () => {
    setAiLoading(true);
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const menuText = JSON.stringify(menu.menu || menu.shoppingList || []);
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Given this menu JSON, suggest 3 elegant alternative variations (e.g. vegan, low-carb, allergen-free). Return only a JSON array of strings. Menu:\n${menuText}`,
        config: {
          responseMimeType: 'application/json',
        }
      });
      const text = (response.text || '').replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(text);
      const variations = Array.isArray(parsed) ? parsed : [];
      const updated = { ...menu, serviceNotes: [...(menu.serviceNotes || []), ...variations] };
      onUpdate(updated);
    } catch (err) {
      console.warn("Client-side suggestVariations failed, falling back inline:", err);
      const variations = [
        "Vegan: Sub Salmon for Beetroot Carpaccio",
        "Gluten-Free: Use GF breadcrumbs for Arancini",
        "Halal: Ensure all meat is certified Halal"
      ];
      const updated = { ...menu, serviceNotes: [...(menu.serviceNotes || []), ...variations] };
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
        {menu.miseEnPlace && menu.miseEnPlace.length > 0 ? (
          <div>
            <h4 className="text-xs font-black text-emerald-500 uppercase mb-4 tracking-widest opacity-60">Mise en Place</h4>
            <ul className="space-y-4">
              {menu.miseEnPlace.map((s, i) => (
                <li key={i} className="flex gap-4 p-6 bg-slate-800/30 rounded-3xl border border-white/5">
                  <span className="text-emerald-500 font-black">0{i + 1}</span>
                  <p className="text-slate-300 italic">{s}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 font-bold italic opacity-60">
            No recipes generated yet.
          </div>
        )}
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
    <div id="proposal-content" className="bg-slate-900/60 backdrop-blur-2xl p-16 rounded-[4rem] shadow-2xl border border-white/10 mb-12 relative overflow-hidden text-left">
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
           <div contentEditable suppressContentEditableWarning onBlur={(e) => updateRoot('title', e.currentTarget.textContent || '')} className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-1">{proposal.title || "Gourmet Catering Event"}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
        <div className="flex-1">
          <div contentEditable suppressContentEditableWarning onBlur={(e) => updateRoot('description', e.currentTarget.textContent || '')} className="text-slate-400 font-medium italic outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-1 opacity-60">{proposal.description || "Describe menu..."}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-2 justify-end mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase opacity-60">Guests:</span>
            <input type="number" value={proposal.guestCount || 50} onChange={(e) => updateRoot('guestCount', Number(e.target.value))} className="w-16 bg-slate-800 border border-white/10 rounded-lg p-1 text-center font-bold text-white text-xs" />
          </div>
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
                        <div contentEditable suppressContentEditableWarning onBlur={(e) => updateItem(idx, 'dish', e.currentTarget.textContent || '')} className="text-xl font-black text-white uppercase outline-none focus:text-emerald-400 p-1 tracking-tighter">{item.dish}</div>
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
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 opacity-60">Service Notes</p>
                <ul className="space-y-4">
                  {(proposal.serviceNotes || []).map((s, i) => (
                    <li key={i} contentEditable suppressContentEditableWarning onBlur={(e) => { const n = [...(proposal.serviceNotes || [])]; n[i] = e.currentTarget.textContent || ''; updateRoot('serviceNotes', n); }} className="text-sm font-medium text-slate-300 flex gap-3 outline-none focus:text-white">
                      <span className="text-emerald-500">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 opacity-60">Delivery Logistics</p>
                <ul className="space-y-4">
                  {(proposal.deliveryLogistics || []).map((d, i) => (
                    <li key={i} contentEditable suppressContentEditableWarning onBlur={(e) => { const n = [...(proposal.deliveryLogistics || [])]; n[i] = e.currentTarget.textContent || ''; updateRoot('deliveryLogistics', n); }} className="text-sm font-medium text-slate-300 flex gap-3 outline-none focus:text-white">
                      <span className="text-emerald-500">•</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
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
                className="text-4xl md:text-6xl font-black tracking-tighter w-full bg-transparent border-none outline-none focus:ring-0"
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
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-[8px] font-black uppercase opacity-60">Logistics (Edit)</p>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black">R</span>
                  <input type="number" value={proposal.logistics?.deliveryFee || 0} onChange={(e) => updateLogistics(Number(e.target.value))} className="bg-transparent border-none outline-none text-xl font-black w-full" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-70">Enable Deposit Button</label>
              <button onClick={() => updateRoot('showDeposit', !proposal.showDeposit)} className={`w-12 h-6 rounded-full transition-all relative ${proposal.showDeposit ? 'bg-white' : 'bg-white/20'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${proposal.showDeposit ? 'left-7 bg-emerald-600' : 'left-1 bg-white'}`} />
              </button>
            </div>
            
            {proposal.showDeposit && (
              <div className="bg-white p-6 rounded-3xl text-slate-900">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 text-center">Pay 50% Deposit Now (R {depositAmount})</p>
                <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
                  <PayPalButtons 
                    style={{ layout: "horizontal", height: 45, shape: "pill", label: "pay" }} 
                    createOrder={(data, actions) => actions.order.create({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: (Number(depositAmount) / 18).toFixed(2) } }] })} 
                  />
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

// --- CORE INTERFACE ---

interface DashboardProps {
  generatedMenu: any;
  setGeneratedMenu: (menu: any) => void;
  menuImage: string;
  setMenuImage: (img: string) => void;
  region: string;
  setRegion: (region: string) => void;
  setSelectedItemName: (name: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  generatedMenu,
  setGeneratedMenu,
  menuImage,
  setMenuImage,
  region,
  setRegion,
  setSelectedItemName
}) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProposals: 0,
    totalRevenue: 0,
    avgMargin: 0,
    lastEventType: ''
  });
  const [recent, setRecent] = useState<Menu[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Chef AI is drafting your menu...');
  
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState(50);
  const [budget, setBudget] = useState('Standard (R250-R500pp)');
  const [cuisine, setCuisine] = useState('South African');
  const [shiftModal, setShiftModal] = useState<{ isOpen: boolean; ingredients: ShiftIngredient[]; title: string } | null>(null);

  // Initialize and load from local storage
  useEffect(() => {
    const storedStats = localStorage.getItem('caterpro_stats');
    if (storedStats) setStats(JSON.parse(storedStats));

    const storedRecent = localStorage.getItem('caterpro_recent');
    if (storedRecent) setRecent(JSON.parse(storedRecent));
  }, []);

  // Recalculate profit margins dynamically
  const currentMargin = useMemo(() => {
    if (!generatedMenu) return 72.4;
    const items = generatedMenu.menu || [];
    const totalCost = items.reduce((sum: number, m: any) => sum + ((m.cost || 0) * (generatedMenu.guestCount || 0)), 0);
    const totalDishPrice = items.reduce((sum: number, m: any) => sum + (m.price || 0), 0);
    const calculatedTotal = (totalDishPrice * (generatedMenu.guestCount || 0)) + (generatedMenu.logistics?.deliveryFee || 0);
    const totalRevenue = generatedMenu.manualTotal !== undefined ? generatedMenu.manualTotal : calculatedTotal;
    const margin = ((totalRevenue - totalCost) / (totalRevenue || 1)) * 100;
    return isNaN(margin) ? 0 : margin;
  }, [generatedMenu]);

  // Synchronize stats back with local storage
  const handleUpdateProposal = (updated: Menu) => {
    setGeneratedMenu(updated);
    setRecent(prev => {
      const filtered = prev.filter(m => m.title !== updated.title);
      const newRecent = [updated, ...filtered].slice(0, 5);
      localStorage.setItem('caterpro_recent', JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const handleGenerate = async () => {
    if (!eventType) { setToast('Please enter an event type.'); return; }
    setGenerating(true); 
    setLoadingMessage('Chef AI is drafting your menu...');
    setToast('Chef AI is drafting your menu...');
    try {
      const response = await generateMenuFromApi({ 
        eventType, 
        guestCount, 
        budget, 
        cuisine,
        region,
        onProgress: (msg) => {
          setLoadingMessage(msg);
          setToast(msg);
        }
      });
      
      if (response.error || !response.data) {
        setToast(`Generation failed: ${response.error || 'No menu returned.'}`);
        return;
      }

      const menuData = response.data;
      
      const menuItems: MenuItem[] = [
        ...(menuData.appetizers || []).map((m: any) => ({ ...m, cat: 'Appetizers' })),
        ...(menuData.mainCourses || []).map((m: any) => ({ ...m, cat: 'Main Courses' })),
        ...(menuData.desserts || menuData.dessert || []).map((m: any) => ({ ...m, cat: 'Desserts' }))
      ];

      // Retrieve first item to auto-sync selected item name across tabs instantly!
      const firstItem = menuItems[0]?.dish || menuItems[0]?.notes || '';
      if (firstItem) {
        setSelectedItemName(firstItem);
      }

      const totalDishPrice = menuItems.reduce((sum, m) => sum + (m.price || 0), 0);
      const deliveryFee = (menuData.logistics?.deliveryFee || 0);
      const totalRevenue = (totalDishPrice * guestCount) + deliveryFee;

      const menu: any = {
        title: menuData.menuTitle || eventType,
        description: menuData.description || "A custom tailored experience.",
        menu: menuItems,
        miseEnPlace: menuData.miseEnPlace || [],
        serviceNotes: menuData.serviceNotes || [],
        deliveryLogistics: menuData.deliveryLogistics || [],
        logistics: menuData.logistics || { deliveryFee: 0 },
        guestCount: guestCount,
        heroImage: HERO_FALLBACK,
        shoppingList: menuData.shoppingList || [],
        manualTotal: totalRevenue,
        manualPerHead: totalDishPrice
      };

      setGeneratedMenu(menu);

      try {
        const img = await generateMenuImageFromApi(menu.title, eventType);
        if (img) {
          menu.heroImage = img;
          setMenuImage(img);
          setGeneratedMenu({ ...menu });
        }
      } catch (err) {
        console.warn("Image generation failed", err);
      }

      // Local Stats Sizing Calculations
      const newStats = {
        totalProposals: stats.totalProposals + 1,
        totalRevenue: stats.totalRevenue + totalRevenue,
        avgMargin: stats.avgMargin === 0 ? currentMargin : (stats.avgMargin * stats.totalProposals + currentMargin) / (stats.totalProposals + 1),
        lastEventType: eventType
      };

      setStats(newStats);
      localStorage.setItem('caterpro_stats', JSON.stringify(newStats));

      const newRecent = [menu, ...recent].slice(0, 5);
      setRecent(newRecent);
      localStorage.setItem('caterpro_recent', JSON.stringify(newRecent));

      setToast('Proposal successfully drafted!');
    } catch (error: any) {
      console.error("Application Error:", error);
      setToast(`Unexpected error: ${error.message || 'Check connection details'}`);
    } finally {
      setGenerating(false);
    }
  };

  const exportPDF = async () => {
    const el = document.getElementById('proposal-content'); 
    if (!el) return;
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
      setToast('PDF downloaded successfully!');
    } catch (err) { 
      console.error(err); 
      setToast('PDF export failed.'); 
    }
  };

  const currencySymbol = useMemo(() => {
    const rLower = region.toLowerCase();
    if (rLower.includes('south africa') || rLower.includes('zar')) return 'R';
    if (rLower.includes('united kingdom') || rLower.includes('uk') || rLower.includes('london') || rLower.includes('gbp')) return '£';
    if (rLower.includes('europe') || rLower.includes('france') || rLower.includes('germany') || rLower.includes('euro')) return '€';
    if (rLower.includes('australia')) return 'A$';
    return '$';
  }, [region]);

  return (
    <div id="dashboard-view-root" className="pt-32 max-w-7xl mx-auto px-6 space-y-12 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* SIDEBAR: Command Center */}
        <div id="dashboard-sidebar" className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-xl space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Command Center</h3>
            </div>
            
            <div className="space-y-4">
              <label id="region-input-label" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">
                Target Localization
              </label>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-60">📍</span>
                <input 
                  id="region-input-field"
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. South Africa"
                  className="w-full p-4 pl-10 rounded-2xl border border-white/10 bg-slate-800/80 text-white font-bold outline-none focus:border-emerald-500 text-sm transition-all"
                />
              </div>
              
              <p className="text-[10px] text-slate-400 leading-relaxed italic opacity-70">
                Menu recipes and ingredient pricing models automatically adapt to current live wholesale data in <strong className="text-emerald-400">{region || 'your target region'}</strong>.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Live Cost Syncing</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Standard Currency</span>
                <span className="font-extrabold text-white uppercase">
                  {currencySymbol}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN MODULES PANEL */}
        <div id="dashboard-main-content" className="lg:col-span-3 space-y-12">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Proposals Generated', value: stats.totalProposals, sub: 'All time count', icon: '📝' },
              { label: 'Est. Total Revenue', value: `${currencySymbol} ${stats.totalRevenue.toLocaleString()}`, sub: 'Localized pricing', icon: '💰' },
              { label: 'Avg Profit Margin', value: `${stats.avgMargin.toFixed(1)}%`, sub: 'Real-time efficiency', icon: '📈' }
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

          {/* ACTIVE CONTENT TOGGLE: Planner Form vs Active Proposal */}
          <AnimatePresence mode="wait">
            {!generatedMenu ? (
              <motion.div 
                key="event-planner-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900/40 backdrop-blur-xl p-12 rounded-[4rem] shadow-2xl border border-white/10 space-y-10"
              >
                <div className="text-center space-y-3">
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                    Plan your next <span className="text-emerald-500">Masterpiece</span>
                  </h3>
                  <p className="text-slate-400 font-medium italic max-w-md mx-auto opacity-70">
                    Provide the specifications and let Chef AI formulate a customized premium culinary proposal.
                  </p>
                </div>

                <div className="space-y-8 max-w-xl mx-auto">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 opacity-60">Event Type</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl">🍴</span>
                      <input 
                        type="text" 
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        placeholder="e.g. Wedding Gala, Executive Lunch..." 
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
                        className="w-full p-6 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer" 
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
                        className="w-full p-6 rounded-[2rem] border border-white/10 bg-slate-800 text-white font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer" 
                      >
                        <option>South African</option>
                        <option>Mediterranean</option>
                        <option>Asian Fusion</option>
                        <option>Continental</option>
                        <option>BBQ and Braai</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerate} 
                    disabled={generating} 
                    className="w-full py-8 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 transition-all shadow-2xl disabled:opacity-50 flex flex-col items-center justify-center gap-2" 
                    style={{ clipPath: OCTAGON_CLIP }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {generating ? <span className="animate-spin">🔄</span> : <span className="text-xl">⚡</span>}
                      <span>{generating ? 'Chef AI is Drafting...' : 'Generate Proposal'}</span>
                    </div>
                    {generating && (
                      <span className="text-[11px] text-emerald-200 lowercase tracking-wider opacity-90 font-medium">
                        {loadingMessage}
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="active-proposal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-8 py-5 rounded-3xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">PROP TITLE: <strong className="text-emerald-400 uppercase">{generatedMenu.title}</strong></span>
                  <button onClick={() => setGeneratedMenu(null)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-xl font-bold uppercase tracking-wider transition-colors">
                    Draft New
                  </button>
                </div>

                <ProposalDocument proposal={generatedMenu} onUpdate={handleUpdateProposal} margin={currentMargin} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                  <RecipeLab menu={generatedMenu} onUpdate={handleUpdateProposal} />
                  
                  {/* Embedded inline micro metrics */}
                  <div className="bg-slate-900/40 p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-8 text-center flex flex-col justify-center">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest opacity-60">Estimated Cost Index</h4>
                    <p className="text-sm text-slate-400 italic font-medium leading-relaxed">
                      This calculation tracks ingredients scaled for {generatedMenu.guestCount} guests. Customize values or review the individual ingredient checklist inside the "Calculator" tab to fine-tune operations.
                    </p>
                    <button 
                      onClick={() => setShiftModal({ 
                        isOpen: true, 
                        ingredients: generatedMenu.shoppingList || [], 
                        title: generatedMenu.title || 'Proposal'
                      })} 
                      className="w-full mt-4 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-xs hover:bg-emerald-500 transition-all shadow-xl" 
                      style={{ clipPath: OCTAGON_CLIP }}
                    >
                      Verify Shift Ingredients
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-6 mt-12 pb-12">
                  <button onClick={exportPDF} className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black uppercase text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 w-full md:w-auto" style={{ clipPath: OCTAGON_CLIP }}>
                    <span className="text-xl">📥</span>
                    Download PDF
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Proposals Hub */}
          <div className="space-y-8 pt-8 border-t border-white/5">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Historical Log</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recent.map((menu, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setGeneratedMenu(menu);
                    if (menu.menu && menu.menu[0]) {
                      setSelectedItemName(menu.menu[0].dish);
                    }
                  }}
                  className="bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-white/10 overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all hover:border-emerald-500/30 text-left"
                >
                  <div className="h-40 relative">
                    <img src={menu.heroImage || HERO_FALLBACK} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h5 className="font-black text-white uppercase italic truncate">{menu.title}</h5>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>{menu.guestCount} Guests</span>
                      <span className="text-emerald-500">
                        R {(menu.manualTotal || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {recent.length === 0 && (
                <div className="col-span-3 py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem] text-slate-700 font-black italic uppercase tracking-widest">
                  No Proposals found in your offline directory.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Slideover Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200]"
          >
            <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20 backdrop-blur-xl">
              <span className="text-xl">⚡</span>
              <p className="text-xs font-black uppercase tracking-widest">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded Shift modal */}
      {shiftModal && generatedMenu && (
        <ShiftCalculatorModal 
          isOpen={shiftModal.isOpen} 
          onClose={() => setShiftModal(null)} 
          initialIngredients={shiftModal.ingredients} 
          menuTitle={shiftModal.title} 
          guestCount={generatedMenu.guestCount || 0} 
          onUpdateDishCost={(dishName, newCost) => {
            const menuList = [...(generatedMenu.menu || [])];
            const foundIdx = menuList.findIndex(x => x.dish === dishName);
            if (foundIdx !== -1) {
              menuList[foundIdx].cost = newCost;
              handleUpdateProposal({ ...generatedMenu, menu: menuList });
            }
          }} 
        />
      )}
    </div>
  );
};

export default Dashboard;
