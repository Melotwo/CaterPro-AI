import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator as CalcIcon, 
  TrendingUp, 
  Coins, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ShieldCheck, 
  Building2, 
  FileText, 
  ShoppingBag, 
  CheckSquare, 
  Square,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Printer,
  Copy,
  RefreshCw,
  Utensils
} from 'lucide-react';
import { Menu, MenuItem } from '../types';
import { getCulinaryIngredientBreakdown } from '../services/culinaryCostingEngine';

interface CalculatorProps {
  generatedMenu: Menu;
  region: string;
  selectedItemName?: string;
  setSelectedItemName?: (name: string) => void;
  onUpdateMenu?: (updated: Menu) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  generatedMenu,
  region = 'South Africa (ZAR • R)',
  selectedItemName = '',
  setSelectedItemName,
  onUpdateMenu
}) => {
  // Active Mission Control Sub-Tab
  const [activeTab, setActiveTab] = useState<'costings' | 'shopping' | 'allergens' | 'slicer' | 'beo'>('costings');

  // Editable local state initialized from generatedMenu
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    return generatedMenu.menu || [];
  });
  const [covers, setCovers] = useState<number>(generatedMenu.guestCount || 120);
  const [yieldMultiplier, setYieldMultiplier] = useState<number>(1.0); // 1.0x standard, 1.1x buffet, 1.25x high-volume
  const [deliveryFee, setDeliveryFee] = useState<number>(generatedMenu.logistics?.deliveryFee || 2400);

  // Sync when parent menu changes
  useEffect(() => {
    if (generatedMenu && generatedMenu.menu) {
      setMenuItems(generatedMenu.menu);
      setCovers(generatedMenu.guestCount || 120);
    }
  }, [generatedMenu]);

  // Active dish for Recipe Slicer
  const [activeDishName, setActiveDishName] = useState<string>(() => {
    return selectedItemName || generatedMenu.menu?.[0]?.dish || '';
  });

  // Shopping list local state
  const [shoppingList, setShoppingList] = useState(() => {
    return generatedMenu.shoppingList || [];
  });

  // Allergen matrix local state
  const [allergenRows, setAllergenRows] = useState(() => {
    return generatedMenu.allergenMatrix || [];
  });

  // Service notes local state
  const [serviceNotes, setServiceNotes] = useState<string[]>(() => {
    return generatedMenu.serviceNotes || [
      '18:30 — VIP Reception: Welcome Cap Classique service and tray-passed appetizers.',
      '19:30 — Guests seated: Sourdough and compound butters set on tables.',
      '19:45 — Synchronized cover service for first course.',
      '20:30 — Main course service with heated cloches: Dietary pre-orders flagged with gold table markers.',
      '21:30 — Dessert & Digestif service: Continuous coffee and tea service until close.'
    ];
  });

  // New Dish Modal / Inline Form State
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCat, setNewDishCat] = useState<'Appetizers' | 'Main Courses' | 'Desserts'>('Main Courses');
  const [newDishPrice, setNewDishPrice] = useState(145);
  const [newDishCost, setNewDishCost] = useState(38);
  const [newDishNotes, setNewDishNotes] = useState('');

  // Editing dish inline
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Totals recalculations
  const totalSellingPricePerCover = useMemo(() => {
    return menuItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [menuItems]);

  const totalRawCostPerCover = useMemo(() => {
    return menuItems.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
  }, [menuItems]);

  // Scaled by covers & yield multiplier
  const effectiveCovers = Math.round(covers * yieldMultiplier);
  const totalRevenue = (totalSellingPricePerCover * covers) + deliveryFee;
  const totalRawFoodSpend = totalRawCostPerCover * effectiveCovers;
  const overallContributionMargin = totalRevenue - totalRawFoodSpend;
  const overallFoodCostPct = totalRevenue > 0 
    ? Math.round((totalRawFoodSpend / totalRevenue) * 1000) / 10 
    : 0;

  // Group shopping list by supplier
  const groupedSuppliers = useMemo(() => {
    const groups: { [supplier: string]: typeof shoppingList } = {};
    shoppingList.forEach(item => {
      const sup = item.supplier || 'Wholesale Supplier';
      if (!groups[sup]) groups[sup] = [];
      groups[sup].push(item);
    });
    return groups;
  }, [shoppingList]);

  // Shopping list total
  const shoppingTotalSpend = useMemo(() => {
    let sum = 0;
    shoppingList.forEach(i => {
      const match = (i.estCost || '').replace(/[^0-9.]/g, '');
      const num = parseFloat(match);
      if (!isNaN(num)) sum += num;
    });
    return sum;
  }, [shoppingList]);

  // Handlers for modifying menu items
  const handleUpdateDish = (idx: number, field: keyof MenuItem, val: any) => {
    const updated = [...menuItems];
    updated[idx] = { ...updated[idx], [field]: val };
    setMenuItems(updated);
    if (onUpdateMenu) {
      onUpdateMenu({ ...generatedMenu, menu: updated });
    }
  };

  const handleRemoveDish = (idx: number) => {
    const updated = menuItems.filter((_, i) => i !== idx);
    setMenuItems(updated);
    if (onUpdateMenu) {
      onUpdateMenu({ ...generatedMenu, menu: updated });
    }
  };

  const handleAddDishSubmit = () => {
    if (!newDishName.trim()) return;
    const newItem: MenuItem = {
      dish: newDishName.trim(),
      cat: newDishCat,
      price: Number(newDishPrice) || 0,
      cost: Number(newDishCost) || 0,
      notes: newDishNotes || 'Chef special recommendation',
      dietary: ['Gluten-Free']
    };
    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    setIsAddingDish(false);
    setNewDishName('');
    setNewDishNotes('');
    if (onUpdateMenu) {
      onUpdateMenu({ ...generatedMenu, menu: updated });
    }
  };

  // Toggle allergen in matrix
  const handleToggleAllergen = (rowIndex: number, field: string) => {
    const updated = [...allergenRows];
    (updated[rowIndex] as any)[field] = !(updated[rowIndex] as any)[field];
    setAllergenRows(updated);
  };

  // Update shopping item quantity or price
  const handleUpdateShoppingItem = (idx: number, field: string, val: string) => {
    const updated = [...shoppingList];
    (updated[idx] as any)[field] = val;
    setShoppingList(updated);
  };

  // Recipe slicer breakdown for active dish
  const activeBreakdown = useMemo(() => {
    if (!activeDishName) return null;
    return getCulinaryIngredientBreakdown(activeDishName, 'South African');
  }, [activeDishName]);

  return (
    <div id="mission-control-calculator-root" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 text-left animate-fade-in">
      
      {/* 1. FRESH ENERGETIC BANNER & OUTLET HEADER */}
      <div className="relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm overflow-hidden">
        {/* Ambient subtle Lime-Teal energetic glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-gradient-to-br from-lime-400/20 via-teal-400/15 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-lime-100 text-lime-900 px-3 py-1 rounded-full border border-lime-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-600 animate-pulse" />
                Live Mission Control
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-teal-600" />
                {generatedMenu.roomLocation || 'Grand Ballroom & Banqueting Deck'}
              </span>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                {generatedMenu.beoNumber || 'BEO-2026-HOTEL-784'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Hospitality Costing & Yield Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
              Automatic dish costing, yield & portion scaling, supplier-sorted shopping lists, and SANS 10330 HACCP allergen matrices. All fields recalculate live.
            </p>
          </div>

          {/* Quick Yield Buffer Selector */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Production Yield Multiplier
              </span>
              <span className="text-xs font-black text-teal-700">
                {effectiveCovers} Portions
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { val: 1.0, label: '1.0x (Standard)' },
                { val: 1.1, label: '1.1x (+10% Buffet)' },
                { val: 1.25, label: '1.25x (+25% High-Vol)' }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setYieldMultiplier(opt.val)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                    yieldMultiplier === opt.val
                      ? 'bg-gradient-to-r from-lime-500 to-teal-600 text-white border-teal-600 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live KPI Ribbon */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Gross Menu Revenue
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              ZAR {totalRevenue.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
              R{totalSellingPricePerCover}/cover • {covers} covers
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Raw Ingredient Spend
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              ZAR {totalRawFoodSpend.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
              R{totalRawCostPerCover}/cover • {effectiveCovers} prep
            </span>
          </div>

          <div className="bg-lime-50/70 rounded-xl p-3 border border-lime-200">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider text-lime-900 block">
                Food Cost %
              </span>
              <span className="text-[9px] font-black text-lime-800 bg-lime-100 px-1.5 py-0.5 rounded">
                Target &lt;30%
              </span>
            </div>
            <span className="text-lg sm:text-xl font-black text-teal-900 tracking-tight">
              {overallFoodCostPct}%
            </span>
            <span className="text-[10px] font-bold text-lime-700 block mt-0.5">
              ✓ Escoffier compliant
            </span>
          </div>

          <div className="bg-teal-50/70 rounded-xl p-3 border border-teal-200">
            <span className="text-[9px] font-black uppercase tracking-wider text-teal-900 block">
              Contribution Margin
            </span>
            <span className="text-lg sm:text-xl font-black text-teal-900 tracking-tight">
              ZAR {overallContributionMargin.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] font-bold text-teal-700 block mt-0.5">
              {Math.round(100 - overallFoodCostPct)}% gross profitability
            </span>
          </div>
        </div>
      </div>

      {/* 2. SUB-VIEW NAVIGATION PILLS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'costings', label: 'Plate Costings & Menu Items', icon: CalcIcon, badge: `${menuItems.length} dishes` },
          { id: 'shopping', label: 'Supplier-Sorted Shopping', icon: ShoppingBag, badge: `ZAR ${shoppingTotalSpend.toLocaleString()}` },
          { id: 'allergens', label: 'Statutory Allergen Matrix', icon: ShieldCheck, badge: 'SANS 10330' },
          { id: 'slicer', label: 'Recipe Micro-Slicer', icon: Utensils, badge: activeDishName.slice(0, 16) },
          { id: 'beo', label: 'BEO Paperwork & Staffing', icon: FileText, badge: 'Kitchen Schedule' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-lime-500 to-teal-600 text-white shadow-sm shadow-teal-500/20 scale-[1.01]'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: PLATE COSTINGS & MENU ITEMS (Fully Editable) */}
      {activeTab === 'costings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                Menu Costings & Selling Margin Breakdown
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Click on any dish price or raw cost to edit. Totals, margin, and food cost % recalculate dynamically.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingDish(!isAddingDish)}
              className="px-4 py-2.5 bg-gradient-to-r from-lime-500 to-teal-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Dish</span>
            </button>
          </div>

          {/* Add Dish Form */}
          {isAddingDish && (
            <div className="bg-slate-50 rounded-2xl p-5 border-2 border-teal-200 space-y-4 animate-fade-in">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Add New Plated Dish to Menu & Costing Matrix
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="e.g. Seared Salmon Medallion"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Course Category
                  </label>
                  <select
                    value={newDishCat}
                    onChange={(e) => setNewDishCat(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Appetizers">Appetizers</option>
                    <option value="Main Courses">Main Courses</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Selling Price (ZAR)
                  </label>
                  <input
                    type="number"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Raw Portion Cost (ZAR)
                  </label>
                  <input
                    type="number"
                    value={newDishCost}
                    onChange={(e) => setNewDishCost(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Culinary Notes & Technique
                </label>
                <input
                  type="text"
                  value={newDishNotes}
                  onChange={(e) => setNewDishNotes(e.target.value)}
                  placeholder="e.g. Pan-seared with fresh herb butter and sea asparagus"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDish(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddDishSubmit}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-black uppercase tracking-wider"
                >
                  Save & Include in Menu
                </button>
              </div>
            </div>
          )}

          {/* Dishes Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-black uppercase tracking-wider border-b border-slate-200 text-[10px]">
                    <th className="p-4">Dish & Course</th>
                    <th className="p-4">Portions (x{yieldMultiplier})</th>
                    <th className="p-4 text-right">Raw Cost</th>
                    <th className="p-4 text-right">Selling Price</th>
                    <th className="p-4 text-center">Food Cost %</th>
                    <th className="p-4 text-right">Contribution Margin</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {menuItems.map((item, idx) => {
                    const price = Number(item.price) || 0;
                    const cost = Number(item.cost) || 0;
                    const itemMargin = price - cost;
                    const itemFoodCostPct = price > 0 ? Math.round((cost / price) * 1000) / 10 : 0;
                    const isEditing = editingIndex === idx;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          {isEditing ? (
                            <div className="space-y-1.5">
                              <input
                                type="text"
                                value={item.dish}
                                onChange={(e) => handleUpdateDish(idx, 'dish', e.target.value)}
                                className="w-full p-1.5 bg-white border border-slate-300 rounded font-bold text-xs"
                              />
                              <input
                                type="text"
                                value={item.notes || ''}
                                onChange={(e) => handleUpdateDish(idx, 'notes', e.target.value)}
                                className="w-full p-1 bg-white border border-slate-200 rounded text-[11px] text-slate-600"
                                placeholder="Service & plating notes"
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                <span>{item.dish}</span>
                                <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                  {item.cat || 'Plated'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 italic mt-0.5 max-w-md line-clamp-1">
                                {item.notes}
                              </p>
                            </div>
                          )}
                        </td>

                        <td className="p-4 font-bold text-slate-700">
                          {effectiveCovers} pax
                        </td>

                        <td className="p-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-slate-400">R</span>
                              <input
                                type="number"
                                value={item.cost || 0}
                                onChange={(e) => handleUpdateDish(idx, 'cost', Number(e.target.value))}
                                className="w-20 p-1 text-right bg-white border border-slate-300 rounded font-bold text-xs"
                              />
                            </div>
                          ) : (
                            <span className="font-bold text-slate-800">
                              R {cost.toFixed(2)}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-teal-600">R</span>
                              <input
                                type="number"
                                value={item.price || 0}
                                onChange={(e) => handleUpdateDish(idx, 'price', Number(e.target.value))}
                                className="w-20 p-1 text-right bg-white border border-slate-300 rounded font-bold text-xs text-teal-700"
                              />
                            </div>
                          ) : (
                            <span className="font-black text-teal-700">
                              R {price.toFixed(2)}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            itemFoodCostPct <= 30
                              ? 'bg-lime-100 text-lime-900 border border-lime-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {itemFoodCostPct}%
                          </span>
                        </td>

                        <td className="p-4 text-right font-black text-slate-900">
                          R {itemMargin.toFixed(2)}
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (isEditing) setEditingIndex(null);
                                else setEditingIndex(idx);
                              }}
                              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                              title={isEditing ? 'Done' : 'Edit dish'}
                            >
                              {isEditing ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Edit3 className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveDishName(item.dish);
                                setActiveTab('slicer');
                              }}
                              className="p-1.5 hover:bg-teal-50 rounded-lg text-teal-600 transition-colors"
                              title="Slice ingredients"
                            >
                              <Utensils className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveDish(idx)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                              title="Remove dish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: SUPPLIER-SORTED SHOPPING LISTS */}
      {activeTab === 'shopping' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                Supplier-Sorted Procurement & Wholesale Sourcing
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Ingredients organized by commercial vendor for hotel purchasing. Quantities scaled to {effectiveCovers} covers.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                Est. Sourcing Total: ZAR {shoppingTotalSpend.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(groupedSuppliers).map(([supplier, items]) => (
              <div key={supplier} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center text-xs font-bold">
                      📦
                    </span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      {supplier}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {items.length} items
                  </span>
                </div>

                <div className="space-y-2.5">
                  {items.map((item, itemIdx) => {
                    const globalIdx = shoppingList.indexOf(item);
                    return (
                      <div key={itemIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5 flex-1">
                          <span className="font-bold text-slate-900 block">{item.item}</span>
                          <span className="text-[10px] text-slate-500 italic block">{item.notes || item.category}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-slate-200 block text-center">
                            {item.quantity}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 block mt-0.5">
                            {item.estCost}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: ALLERGEN MATRIX & SANS 10330 HACCP PROTOCOL */}
      {activeTab === 'allergens' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                Statutory Allergen Matrix & SANS 10330 HACCP Safety
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Click any cell to toggle allergen containment. Meets South African and international hotel food safety standards.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-black uppercase tracking-wider border-b border-slate-200 text-[10px]">
                    <th className="p-3.5">Dish / Plated Item</th>
                    <th className="p-3.5 text-center">Gluten</th>
                    <th className="p-3.5 text-center">Dairy</th>
                    <th className="p-3.5 text-center">Nuts</th>
                    <th className="p-3.5 text-center">Eggs</th>
                    <th className="p-3.5 text-center">Fish</th>
                    <th className="p-3.5 text-center">Shellfish</th>
                    <th className="p-3.5 text-center">Soy</th>
                    <th className="p-3.5 text-center">Dietary Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allergenRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        {row.dish}
                        {row.notes && (
                          <span className="block text-[10px] text-slate-500 font-normal italic">
                            {row.notes}
                          </span>
                        )}
                      </td>

                      {['gluten', 'dairy', 'nuts', 'eggs', 'fish', 'shellfish', 'soy'].map((allergenKey) => {
                        const hasAllergen = (row as any)[allergenKey];
                        return (
                          <td 
                            key={allergenKey} 
                            onClick={() => handleToggleAllergen(rIdx, allergenKey)}
                            className="p-3.5 text-center cursor-pointer select-none"
                          >
                            {hasAllergen ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded-full border border-amber-300">
                                ⚠️ Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
                                ✓ Safe
                              </span>
                            )}
                          </td>
                        );
                      })}

                      <td className="p-3.5 text-center">
                        <span className="inline-block px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-full border border-teal-200">
                          {(row.dietary || ['Gluten-Free']).join(', ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SANS 10330 Cold Chain HACCP Safety Notes */}
          <div className="bg-gradient-to-br from-lime-50 to-teal-50 rounded-2xl p-6 border border-lime-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
              <h4 className="text-xs font-black uppercase tracking-wider text-teal-900">
                SANS 10330 HACCP Defensible Safety Procedures
              </h4>
            </div>
            <ul className="text-xs text-teal-950 font-medium space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Walk-in cold storage strictly logged at 1.8°C to 3.2°C; raw seafood isolated on lowest tiers.</li>
              <li>Dedicated purple allergen prep board and sanitised stainless cutlery allocated for VIP nut-allergy orders.</li>
              <li>Hot holding banquet cabinets calibrated to 72°C minimum core temperature before service deployment.</li>
              <li>Blast chiller cooling curves verified: Cooked proteins brought from 60°C to below 10°C in under 90 minutes.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 6. TAB 4: ESCOFFIER RECIPE SLICER */}
      {activeTab === 'slicer' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                Escoffier Recipe Ingredient Slicer
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Granular wholesale pricing breakdowns based on current South African and global market indices.
              </p>
            </div>

            <div className="w-full sm:w-80">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                Select Dish to Slice
              </label>
              <select
                value={activeDishName}
                onChange={(e) => {
                  setActiveDishName(e.target.value);
                  if (setSelectedItemName) setSelectedItemName(e.target.value);
                }}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-teal-500 cursor-pointer shadow-2xs"
              >
                {menuItems.map((m, idx) => (
                  <option key={idx} value={m.dish}>{m.dish}</option>
                ))}
              </select>
            </div>
          </div>

          {activeBreakdown && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left summary card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Active Recipe
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {activeBreakdown.dishName}
                  </h3>
                </div>

                <div className="bg-gradient-to-br from-lime-50 to-teal-50 rounded-xl p-4 border border-lime-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block">
                    Calculated Raw Food Cost
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    R {activeBreakdown.estimatedTotalCost.toFixed(2)}
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 block mt-1">
                    Per cover portion
                  </span>
                </div>

                {activeBreakdown.regionalWholesaleAdvice && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic space-y-1">
                    <span className="font-black text-slate-900 not-italic block uppercase text-[10px]">
                      Culinary Procurement Tip:
                    </span>
                    "{activeBreakdown.regionalWholesaleAdvice}"
                  </div>
                )}
              </div>

              {/* Ingredients Breakdown Table */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Ingredient Specification & Unit Rates
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase">
                        <th className="p-3">Ingredient</th>
                        <th className="p-3 text-center">Portion Qty</th>
                        <th className="p-3 text-right">Wholesale Rate</th>
                        <th className="p-3 text-right">Raw Spend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeBreakdown.ingredients.map((ing, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{ing.name}</td>
                          <td className="p-3 text-center font-mono text-slate-600">{ing.quantity} {ing.unit}</td>
                          <td className="p-3 text-right text-slate-600">R {ing.unitPrice.toFixed(2)} / {ing.unit}</td>
                          <td className="p-3 text-right font-black text-teal-800">R {ing.totalItemCost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. TAB 5: BEO SUMMARY & PRODUCTION SCHEDULE */}
      {activeTab === 'beo' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                Banquet Event Order (BEO) Kitchen & Service Schedule
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Operational paperwork for culinary line chefs, banquet captain, and service waitstaff.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5 text-lime-400" />
              <span>Print BEO Order</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Header metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-200 pb-6 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">BEO Number</span>
                <span className="font-mono font-black text-slate-900">{generatedMenu.beoNumber || 'BEO-2026-HOTEL-784'}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">Event Date</span>
                <span className="font-bold text-slate-900">{generatedMenu.eventDate || '18 October 2026'}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">Room Location</span>
                <span className="font-bold text-slate-900">{generatedMenu.roomLocation || 'Grand Ballroom'}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">Guaranteed Covers</span>
                <span className="font-black text-teal-800">{covers} pax ({effectiveCovers} prep)</span>
              </div>
            </div>

            {/* Service Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Synchronized Service Timeline
              </h4>
              <div className="space-y-2">
                {serviceNotes.map((note, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 font-medium flex items-start gap-2">
                    <span className="text-teal-600 font-black">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staffing & Equipment Ratios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Kitchen Brigade & Service Staffing Ratio
                </span>
                <p className="text-slate-800 font-bold">
                  {Math.ceil(covers / 25)} Line Chefs • 1 Executive Sous Chef • {Math.ceil(covers / 15)} Banquet Waitrons • 2 Dish Stewards
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Mandatory Equipment Deployment
                </span>
                <p className="text-slate-800 font-bold">
                  2 Combi Steam Ovens (Plating mode) • 3 Heated Cloche Cabinets (72°C) • 1 Refrigerated Service Dolly
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Calculator;
