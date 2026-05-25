import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateIngredientBreakdown } from '../services/geminiService';
import { MenuItem, EngineeringItem, IngredientCost } from '../types';

interface CalculatorProps {
  generatedMenu: any;
  region: string;
  selectedItemName: string;
  setSelectedItemName: (name: string) => void;
}

const OCTAGON_CLIP = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';

// Sample ingredients fallback array for custom costing estimation
const DEFAULT_INGREDIENTS: IngredientCost[] = [
  { id: '1', name: 'Premium Beef Fillet', unit: 'kg', price: 290, lastUpdated: new Date(), userId: 'demo' },
  { id: '2', name: 'Fresh Atlantic Salmon', unit: 'kg', price: 340, lastUpdated: new Date(), userId: 'demo' },
  { id: '3', name: 'Salted Butter', unit: 'kg', price: 110, lastUpdated: new Date(), userId: 'demo' },
  { id: '4', name: 'Heavy Whipping Cream', unit: 'L', price: 85, lastUpdated: new Date(), userId: 'demo' },
  { id: '5', name: 'Organic Cake Flour', unit: 'kg', price: 25, lastUpdated: new Date(), userId: 'demo' },
  { id: '6', name: 'Madagascar Vanilla Beans', unit: 'ea', price: 45, lastUpdated: new Date(), userId: 'demo' },
  { id: '7', name: 'Fresh Rosemary & Herbs', unit: 'kg', price: 95, lastUpdated: new Date(), userId: 'demo' },
  { id: '8', name: 'Belgian Dark Chocolate', unit: 'kg', price: 180, lastUpdated: new Date(), userId: 'demo' }
];

export const PlateCostEngine: React.FC<{ ingredients: IngredientCost[]; onUpdate?: (cost: number) => void }> = ({ ingredients = DEFAULT_INGREDIENTS, onUpdate }) => {
  const [selected, setSelected] = useState<{ id: string; quantity: number }[]>([]);
  const [markup, setMarkup] = useState(300);
  const total = selected.reduce((sum, item) => sum + (ingredients.find(i => i.id === item.id)?.price || 0) * item.quantity, 0);
  const suggested = total * (markup / 100);
  
  useEffect(() => { if (onUpdate) onUpdate(suggested); }, [suggested, onUpdate]);
  
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[4rem] border border-white/10 shadow-2xl text-left">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 text-xl">🧮</div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Small Batch Costing</h3>
      </div>
      <div className="space-y-6">
        <select onChange={(e) => { if (e.target.value) setSelected([...selected, { id: e.target.value, quantity: 1 }]); e.target.value = ''; }} className="w-full p-4 rounded-2xl bg-slate-800 text-white font-bold outline-none border border-white/10 text-sm cursor-pointer">
          <option value="">+ Add Ingredient...</option>
          {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
        </select>
        <div className="space-y-3">
          {selected.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
              <span className="font-bold text-white text-xs">{ingredients.find(i => i.id === item.id)?.name}</span>
              <div className="flex items-center gap-4">
                <input type="number" step="any" value={item.quantity} onChange={(e) => { const n = [...selected]; n[idx].quantity = Number(e.target.value); setSelected(n); }} className="w-16 bg-slate-900 border border-white/10 rounded-lg p-1 text-center font-bold text-white text-xs" />
                <button onClick={() => setSelected(selected.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300 transition-colors text-xl">🗑️</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/10 flex justify-between items-center">
          <div><p className="text-[10px] font-black text-slate-400 uppercase opacity-60">Total Cost</p><p className="text-xl md:text-3xl font-black text-white tracking-tighter">R {total.toFixed(2)}</p></div>
          <div className="text-right"><p className="text-[10px] font-black text-emerald-500 uppercase opacity-60">Suggested Price</p><p className="text-2xl md:text-4xl font-black text-emerald-500 tracking-tighter">R {suggested.toFixed(2)}</p></div>
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
    <div className="bg-slate-900/40 backdrop-blur-xl p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-10 text-left">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 text-2xl">⚖️</div>
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Enhanced Cost Engine</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">Dish Identity</label>
          <input type="text" placeholder="Dish Name" value={dishName} onChange={(e) => setDishName(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-800 border border-white/10 text-white font-bold outline-none" />
          <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full p-4 rounded-2xl bg-slate-800 border border-white/10 text-white font-bold outline-none cursor-pointer">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/10 font-bold">
        <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Plate Cost</p>
          <h4 className="text-xl md:text-3xl font-black text-white">R {plateCost.toFixed(2)}</h4>
        </div>
        <div className="bg-emerald-600/10 p-6 rounded-3xl border border-emerald-500/20">
          <p className="text-[10px] font-black text-emerald-500 uppercase mb-2">Food Cost %</p>
          <h4 className="text-xl md:text-3xl font-black text-emerald-400">{foodCostPct.toFixed(1)}%</h4>
        </div>
        <div className="bg-sky-600/10 p-6 rounded-3xl border border-sky-500/20">
          <p className="text-[10px] font-black text-sky-500 uppercase mb-2">Contribution Margin</p>
          <h4 className="text-xl md:text-3xl font-black text-sky-400">R {margin.toFixed(2)}</h4>
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
    <div className={`p-8 bg-slate-900/40 rounded-[3rem] border border-white/5 flex flex-col h-full min-h-[400px] text-left`}>
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
        {data.length === 0 && <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-slate-700 font-bold uppercase italic text-[10px] tracking-widest py-10">No Items</div>}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center">
        <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Profit Matrix</h3>
        <p className="text-slate-500 font-medium italic opacity-60">Visualizing menu engineering performance metrics.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <Quadrant title="Stars" sub="High Profit / High Popularity" icon="⭐" data={quadrants.stars} color="text-emerald-400" />
        <Quadrant title="Puzzles" sub="High Profit / Low Popularity" icon="🧩" data={quadrants.puzzles} color="text-sky-400" />
        <Quadrant title="Plow Horses" sub="Low Profit / High Popularity" icon="🐴" data={quadrants.plow_horses} color="text-orange-400" />
        <Quadrant title="Dogs" sub="Low Profit / Low Popularity" icon="🦴" data={quadrants.dogs} color="text-red-400" />
      </div>
    </div>
  );
};

export const Calculator: React.FC<CalculatorProps> = ({
  generatedMenu,
  region,
  selectedItemName,
  setSelectedItemName
}) => {
  const [breakdown, setBreakdown] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [engineeringItems, setEngineeringItems] = useState<EngineeringItem[]>([]);

  // Local sync of Matrix engineering items
  useEffect(() => {
    const stored = localStorage.getItem('caterpro_matrix');
    if (stored) {
      setEngineeringItems(JSON.parse(stored));
    }
  }, []);

  const handleUpdateMatrix = (newItems: EngineeringItem[]) => {
    setEngineeringItems(newItems);
    localStorage.setItem('caterpro_matrix', JSON.stringify(newItems));
  };

  // Compile active menu items safely across legacy and modular elements
  const activeMenuItems = React.useMemo(() => {
    if (!generatedMenu) return [];
    const items = generatedMenu.menu || (generatedMenu as any).items || [];
    if (items.length > 0) {
      return items.map((item: any) => typeof item === 'string' ? item : (item.dish || item.name || ''));
    }
    
    const legacyAppetizers = generatedMenu.appetizers || [];
    const legacyMains = generatedMenu.mainCourses || [];
    const legacyDesserts = generatedMenu.dessert || [];
    
    return [...legacyAppetizers, ...legacyMains, ...legacyDesserts];
  }, [generatedMenu]);

  // Set the first item naturally if selectedItemName is blank
  useEffect(() => {
    if (activeMenuItems.length > 0 && !selectedItemName) {
      setSelectedItemName(activeMenuItems[0]);
    }
  }, [activeMenuItems, selectedItemName, setSelectedItemName]);

  // Handle selected item changed & fire client-side Gemini breakdown fetch
  useEffect(() => {
    if (!selectedItemName) {
      setBreakdown(null);
      return;
    }

    const fetchBreakdown = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await calculateIngredientBreakdown(selectedItemName, region);
        setBreakdown(data);
        
        const initialStates: Record<string, boolean> = {};
        if (data && data.ingredients) {
          data.ingredients.forEach((ing: any) => {
            initialStates[ing.name] = false;
          });
        }
        setCheckedIngredients(initialStates);
      } catch (err: any) {
        console.error("Failed to load recipe breakdown:", err);
        setError(err.message || 'Could not calculate recipe breakdown.');
      } finally {
        setLoading(false);
      }
    };

    fetchBreakdown();
  }, [selectedItemName, region]);

  // Compute total raw cost dynamically based on item checked states
  const totalCostOfChecklist = React.useMemo(() => {
    if (!breakdown || !breakdown.ingredients) return 0;
    return breakdown.ingredients.reduce((sum: number, ing: any) => {
      return sum + (ing.totalItemCost || (ing.unitPrice * ing.quantity) || 0);
    }, 0);
  }, [breakdown]);

  const checkedCount = React.useMemo(() => {
    return Object.values(checkedIngredients).filter(Boolean).length;
  }, [checkedIngredients]);

  const toggleCheckbox = (name: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div id="calculator-view-root" className="pt-40 pb-20 max-w-7xl mx-auto px-6 space-y-16">
      
      {/* Title block */}
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter">Kitchen Profits</h2>
        <p className="text-slate-400 font-medium italic opacity-60">Engineered for absolute food service precision.</p>
      </div>

      {/* Live Recipe Slicing Checklist */}
      <div id="live-recipe-checklist-section" className="bg-slate-900/60 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-10 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 text-2xl font-black">🔪</div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Live Recipe Slicer</h3>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Dynamic wholesale ingredient costing</p>
            </div>
          </div>

          <div className="w-full md:w-72">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Select Active Dish</p>
            <select
              id="active-dish-dropdown"
              value={selectedItemName}
              onChange={(e) => setSelectedItemName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-800 text-white font-black outline-none border border-white/10 text-sm focus:border-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">-- Choose Menu Item --</option>
              {activeMenuItems.map((item: string, idx: number) => (
                <option key={idx} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Display State */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              key="loading-recipe" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <span className="text-4xl animate-spin text-emerald-400">🔄</span>
              <p className="text-slate-400 font-black uppercase italic text-xs tracking-widest">Pricing ingredients in {region}...</p>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div 
              key="error-recipe" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl text-sm"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {!selectedItemName && !loading && !error && (
            <motion.div 
              key="empty-recipe"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="py-16 text-center border border-dashed border-white/10 rounded-[3rem] text-slate-500 font-black italic uppercase tracking-wider text-xs space-y-2"
            >
              <p className="text-2xl opacity-40">🥦</p>
              <p>Select a calculated menu item to expand its micro ingredients list and view margins in {region}.</p>
              {!generatedMenu && (
                <p className="text-[10px] text-slate-600 tracking-normal capitalize font-medium">Generate a professional proposal first to unlock automatic recipe parsing.</p>
              )}
            </motion.div>
          )}

          {breakdown && !loading && !error && (
            <motion.div 
              key="populated-recipe" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              {/* Left Column: Costing Calculations Summary */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-950/60 rounded-[3rem] p-8 border border-white/5 space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Target Dish</h4>
                    <p className="text-xl md:text-2xl font-black text-white uppercase italic leading-tight truncate">{breakdown.dishName || selectedItemName}</p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Regional Market</h4>
                    <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-wider uppercase rounded-lg">
                      📍 {breakdown.region || region}
                    </span>
                  </div>

                  {/* Calculator Box */}
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Estimated Sliced Cost</p>
                    <div className="p-6 bg-emerald-600/10 rounded-2xl border border-emerald-500/20">
                      <p className="text-xs font-black text-emerald-500 uppercase leading-none mb-1">Total Portion Price</p>
                      <h4 className="text-2xl md:text-4xl font-black text-emerald-400">
                        {breakdown.currencyCode || 'R'} {(breakdown.estimatedTotalCost || totalCostOfChecklist).toFixed(2)}
                      </h4>
                    </div>
                  </div>

                  {breakdown.regionalWholesaleAdvice && (
                    <div className="p-5 bg-slate-900 border border-white/5 rounded-2xl">
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span>💡</span> Culinary Strategy Advice
                      </p>
                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        "{breakdown.regionalWholesaleAdvice}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Columns: Interactive Recipes Checklist */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center bg-slate-900/40 p-5 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Preparation Checklist
                  </span>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">
                    {checkedCount} / {breakdown.ingredients?.length || 0} Ready
                  </span>
                </div>

                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 no-scrollbar">
                  {breakdown.ingredients?.map((ing: any, idx: number) => {
                    const isChecked = !!checkedIngredients[ing.name];
                    return (
                      <div 
                        key={idx} 
                        onClick={() => toggleCheckbox(ing.name)}
                        className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all cursor-pointer select-none ${isChecked ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300' : 'bg-slate-950/40 border-white/5 hover:border-white/10 text-white'}`}
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className={`p-1.5 rounded-xl border flex items-center justify-center transition-colors ${isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-white/25 text-transparent'}`}>
                             ✓
                          </div>
                          <div>
                            <p className={`font-bold text-xs md:text-sm transition-all ${isChecked ? 'line-through opacity-55 text-slate-500' : ''}`}>{ing.name}</p>
                            {ing.notes && <p className="text-[10px] text-slate-500 italic mt-0.5">{ing.notes}</p>}
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end shrink-0">
                          <p className="text-xs font-black text-slate-400">
                            {ing.quantity} {ing.unit}
                          </p>
                          <p className="text-[10px] font-extrabold text-emerald-500 uppercase mt-0.5">
                            {breakdown.currencyCode || 'R'} {(ing.totalItemCost || (ing.unitPrice * ing.quantity) || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid of calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">
        <EnhancedPlateCostCalculator onAddToMatrix={(item) => handleUpdateMatrix([...engineeringItems, item])} />
        <PlateCostEngine ingredients={DEFAULT_INGREDIENTS} />
      </div>

      {/* Matrix Engineering */}
      <MenuEngineeringMatrix items={engineeringItems} onRemove={(id) => handleUpdateMatrix(engineeringItems.filter(i => i.id !== id))} />

    </div>
  );
};

export default Calculator;
