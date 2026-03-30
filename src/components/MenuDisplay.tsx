import React, { useState, useMemo } from 'react';
import { Menu, MenuSection, ShoppingListItem, RecommendedEquipment, BeveragePairing, CloudMenu } from './types';
import { MENU_SECTIONS, EDITABLE_MENU_SECTIONS, PROPOSAL_THEMES, PRICING_DATABASE } from './constants';
import { analytics } from './analyticsManager';

interface MenuDisplayProps {
  menu: Menu;
  checkedItems: Set<string>;
  onToggleItem: (key: string) => void;
  isEditable: boolean;
  onEditItem: (section: MenuSection, index: number) => void;
  showToast: (message: string) => void;
  isGeneratingImage: boolean;
  onUpdateShoppingItemQuantity: (itemIndex: number, newQuantity: string) => void;
  bulkSelectedItems: Set<string>;
  onToggleBulkSelect: (key: string) => void;
  onBulkCheck: () => void;
  onBulkUpdateQuantity: (newQuantity: string) => void;
  onClearBulkSelection: () => void;
  onSelectAllShoppingListItems: () => void;
  proposalTheme: string;
  canAccessFeature: (feature: string) => boolean;
  onAttemptAccess: (feature: string) => boolean;
  isReadOnlyView?: boolean;
  deliveryRadius: string;
  onDeliveryRadiusChange: (value: string) => void;
  onCalculateFee: () => void;
  calculatedFee: string | null;
  onRegenerateImage?: () => void;
  onUploadDishImage?: (file: File) => void;
  preferredCurrency?: string;
  onOpenSocialModal?: (mode: 'reel' | 'status' | 'create') => void;
  onOpenShareModal?: () => void;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ 
    menu, checkedItems, onToggleItem, isEditable, onEditItem, showToast, 
    isGeneratingImage, onUpdateShoppingItemQuantity, bulkSelectedItems, onToggleBulkSelect,
    onBulkCheck, onBulkUpdateQuantity, onClearBulkSelection, onSelectAllShoppingListItems,
    proposalTheme, canAccessFeature, onAttemptAccess, isReadOnlyView = false,
    deliveryRadius, onDeliveryRadiusChange, onCalculateFee, calculatedFee, onRegenerateImage,
    onUploadDishImage, preferredCurrency = 'ZAR', onOpenSocialModal, onOpenShareModal
}) => {
  const theme = PROPOSAL_THEMES[proposalTheme as keyof typeof PROPOSAL_THEMES] || PROPOSAL_THEMES.classic;
  const t = theme.classes;

  // Scaling Logic
  const baseGuestCount = (menu as any).baseGuestCount || 50;
  const [scaledGuestCount, setScaledGuestCount] = useState(baseGuestCount);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  const [editingPrice, setEditingPrice] = useState<string | null>(null);

  const scaledShoppingList = useMemo(() => {
    if (!menu.shoppingList) return [];
    const factor = scaledGuestCount / baseGuestCount;
    
    return menu.shoppingList.map(item => {
      // Try to parse quantity if it's a number-like string
      const match = item.quantity.match(/^(\d+\.?\d*)\s*(.*)$/);
      let numericQuantity = 0;
      let unit = '';
      let scaledQuantityStr = item.quantity;

      if (match) {
        numericQuantity = parseFloat(match[1]);
        unit = match[2];
        const scaledNum = (numericQuantity * factor).toFixed(2);
        scaledQuantityStr = `${scaledNum} ${unit}`;
        numericQuantity = parseFloat(scaledNum);
      }

      // Get price from database or override
      const dbEntry = PRICING_DATABASE[item.item];
      const unitPrice = priceOverrides[item.item] || dbEntry?.price || 0;
      const totalPrice = numericQuantity * unitPrice;

      return { 
        ...item, 
        quantity: scaledQuantityStr,
        numericQuantity,
        unitPrice,
        totalPrice,
        unit: unit || dbEntry?.unit || 'unit'
      };
    });
  }, [menu.shoppingList, scaledGuestCount, baseGuestCount, priceOverrides]);

  const totalsByCategory = useMemo(() => {
    const totals: Record<string, number> = {};
    scaledShoppingList.forEach(item => {
      const cat = item.category || 'Other';
      totals[cat] = (totals[cat] || 0) + (item.totalPrice || 0);
    });
    return totals;
  }, [scaledShoppingList]);

  const grandTotal = useMemo(() => {
    return Object.values(totalsByCategory).reduce((sum, val) => sum + val, 0);
  }, [totalsByCategory]);

  if (!menu) return null;

  return (
    <div className={`p-0 theme-container ${t.container} rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in relative transition-all duration-500 overflow-hidden`}>
      
      {/* HERO SECTION: Image and Overlaid Title */}
      <div className="relative w-full aspect-[16/9] min-h-[300px] overflow-hidden group">
          {/* Background Image / Placeholder */}
          {isGeneratingImage ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse bg-slate-200 dark:bg-slate-900 z-10">
                  <span className="text-4xl animate-spin mb-4">⌛</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Architecting Food Photography...</p>
              </div>
          ) : menu.image ? (
              <img 
                src={`data:image/png;base64,${menu.image}`} 
                alt={menu.menuTitle}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
          ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                  <span className="text-6xl mb-4 opacity-10">🖼️</span>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Presentation Space Reserved</p>
                  {onRegenerateImage && (
                    <button 
                      onClick={onRegenerateImage}
                      className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-slate-700 dark:text-slate-200 transition-all"
                    >
                      Retry Visual
                    </button>
                  )}
              </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
          
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-20">
              <div className="px-4 py-2 bg-primary-500/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center gap-3">
                  <span className="text-xl text-white">👨‍🍳</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">CaterPro AI: Marketing Hub</span>
              </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 z-20 flex gap-2 no-print">
              <button onClick={() => onOpenShareModal?.()} className="p-3 bg-white/20 backdrop-blur-xl text-white hover:bg-white/40 rounded-2xl transition-all border border-white/20 shadow-lg" title="Share Strategy">
                  <span className="text-xl">📤</span>
              </button>
              <button onClick={() => window.print()} className="p-3 bg-white/20 backdrop-blur-xl text-white hover:bg-white/40 rounded-2xl transition-all border border-white/20 shadow-lg" title="Export Strategic PDF">
                  <span className="text-xl">📄</span>
              </button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-10 left-6 sm:left-10 right-6 sm:right-10 z-20 space-y-2">
              <div className="flex items-center gap-3 opacity-60">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Proposal Lifecycle Verified</span>
                <div className="h-px bg-white/30 flex-grow"></div>
                <span className="text-[10px] font-bold text-white whitespace-nowrap">{new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">{menu.menuTitle}</h2>
          </div>
      </div>

      {/* BODY CONTENT */}
      <div className="p-6 sm:p-10 lg:p-16 space-y-12">
        {/* Sub-Header / Description */}
        <div className="max-w-4xl mx-auto text-center">
            <p className={`text-xl sm:text-2xl leading-relaxed ${t.description} font-medium italic opacity-80 px-4`}>
              "{menu.description}"
            </p>
        </div>

        {/* GRID START - Core Menu Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch min-h-[400px]">
          
          {/* SCALING CONTROLS */}
          <div className="md:col-span-2 glass-card p-8 rounded-[2.5rem] border border-primary-100 dark:border-primary-900/30 bg-primary-50/30 dark:bg-primary-900/10 flex flex-col sm:flex-row items-center justify-between gap-6 no-print">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-500 text-white rounded-2xl shadow-lg">
                      <span className="text-2xl">👥</span>
                  </div>
                  <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">Dynamic Scaling Engine</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Adjust guest count to scale ingredients</p>
                  </div>
              </div>
              <div className="flex items-center gap-6 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 w-full sm:w-auto">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Guests:</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="1000" 
                    value={scaledGuestCount} 
                    onChange={(e) => setScaledGuestCount(parseInt(e.target.value))}
                    className="flex-grow sm:w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="px-4 py-2 bg-primary-600 text-white rounded-xl font-black text-lg min-w-[80px] text-center shadow-lg">
                      {scaledGuestCount}
                  </div>
              </div>
          </div>

          {MENU_SECTIONS.map(({ title, key }, catIdx) => {
            const isWideSection = ['shoppingList', 'recommendedEquipment', 'beveragePairings', 'dietaryNotes', 'miseEnPlace', 'serviceNotes', 'deliveryLogistics'].includes(key);
            if (isWideSection) return null;

            const rawItems = menu[key as keyof Menu];
            const items = (Array.isArray(rawItems) ? rawItems : []) as any[];

            return (
              <div key={key} className={`${t.sectionContainer} rounded-[2.5rem] shadow-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col`}>
                <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <h3 className={`text-xl sm:text-2xl font-black ${t.sectionTitle} flex items-center gap-4`}>
                    <span className={`w-10 h-10 sm:w-12 sm:h-12 ${t.sectionIcon} rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0 shadow-xl`}>
                      {catIdx + 1}
                    </span>
                    {title}
                  </h3>
                </div>
                <div className="p-6 sm:p-10 flex-grow">
                  {items.length > 0 ? (
                      <ul className="space-y-4">
                          {items.map((item, index) => (
                              <li key={`${key}-${index}`} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                  <span className="text-primary-500 mt-1 shrink-0">✅</span>
                                  <span className={`text-lg font-bold tracking-tight ${t.uncheckedText}`}>{String(item)}</span>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <div className="py-12 px-6 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-4">
                          <span className="text-amber-400 text-3xl">⚠️</span>
                          <p className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest leading-relaxed">
                              Section {catIdx + 1} Pending:<br/>AI Refinement Required
                          </p>
                      </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Dynamic Wide Sections (Logistics & Prep) */}
          {['beveragePairings', 'miseEnPlace', 'serviceNotes', 'deliveryLogistics'].map(key => {
              const section = MENU_SECTIONS.find(s => s.key === key);
              // Fix: Explicitly cast to any array to resolve property 'length' and 'map' errors on the union type of Menu properties.
              const items = (Array.isArray(menu[key as keyof Menu]) ? menu[key as keyof Menu] : []) as any[];
              if (!section || items.length === 0) return null;

              return (
                  <div key={key} className={`${t.sectionContainer} rounded-[2.5rem] md:col-span-2 shadow-xl overflow-hidden bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 mt-6`}>
                      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                          <div className={`p-3 ${t.sectionIcon} rounded-2xl`}><span className="text-2xl">📋</span></div>
                          <h3 className={`text-2xl font-black ${t.sectionTitle}`}>{section.title}</h3>
                      </div>
                      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {items.map((item, i) => (
                              <div key={i} className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-3">
                                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black shrink-0 dark:text-white">{i+1}</span>
                                  <p className={`text-sm font-bold ${t.uncheckedText}`}>{String(item)}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          })}
          {/* SHOPPING LIST SECTION */}
          <div className={`${t.sectionContainer} rounded-[2.5rem] md:col-span-2 shadow-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 mt-6`}>
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className={`p-3 ${t.sectionIcon} rounded-2xl`}><span className="text-2xl">🛒</span></div>
                      <div>
                          <h3 className={`text-2xl font-black ${t.sectionTitle}`}>Scaled Shopping List</h3>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Quantities adjusted for {scaledGuestCount} guests</p>
                      </div>
                  </div>
              </div>
              <div className="p-8">
                  {scaledShoppingList.length > 0 ? (
                      <div className="space-y-8">
                          {Array.from(new Set(scaledShoppingList.map(i => i.category || 'Other'))).map(category => {
                              const categoryItems = scaledShoppingList.filter(i => (i.category || 'Other') === category);
                              return (
                                  <div key={category} className="space-y-4">
                                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">{category}</h4>
                                      <div className="overflow-x-auto">
                                          <table className="w-full text-left border-collapse">
                                              <thead>
                                                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                                      <th className="py-3 px-4">Ingredient</th>
                                                      <th className="py-3 px-4 text-right">Qty</th>
                                                      <th className="py-3 px-4 text-right">Unit Price</th>
                                                      <th className="py-3 px-4 text-right">Total</th>
                                                  </tr>
                                              </thead>
                                              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                                  {categoryItems.map((item, i) => (
                                                      <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                          <td className="py-4 px-4">
                                                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.item}</p>
                                                          </td>
                                                          <td className="py-4 px-4 text-right">
                                                              <span className="text-sm font-black text-slate-900 dark:text-white">{item.quantity}</span>
                                                          </td>
                                                          <td className="py-4 px-4 text-right">
                                                              {editingPrice === item.item ? (
                                                                  <input 
                                                                      type="number"
                                                                      autoFocus
                                                                      defaultValue={item.unitPrice}
                                                                      onBlur={(e) => {
                                                                          const val = parseFloat(e.target.value);
                                                                          if (!isNaN(val)) {
                                                                              setPriceOverrides(prev => ({ ...prev, [item.item]: val }));
                                                                          }
                                                                          setEditingPrice(null);
                                                                      }}
                                                                      onKeyDown={(e) => {
                                                                          if (e.key === 'Enter') e.currentTarget.blur();
                                                                      }}
                                                                      className="w-20 px-2 py-1 bg-white dark:bg-slate-700 border border-primary-500 rounded text-right text-sm font-bold outline-none"
                                                                  />
                                                              ) : (
                                                                  <button 
                                                                      onClick={() => setEditingPrice(item.item)}
                                                                      className="text-sm font-black text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-2 py-1 rounded transition-colors flex items-center gap-1 ml-auto"
                                                                  >
                                                                      R{item.unitPrice.toFixed(2)}
                                                                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-1">✏️</span>
                                                                  </button>
                                                              )}
                                                          </td>
                                                          <td className="py-4 px-4 text-right">
                                                              <span className="text-sm font-black text-slate-900 dark:text-white">R{item.totalPrice.toFixed(2)}</span>
                                                          </td>
                                                      </tr>
                                                  ))}
                                              </tbody>
                                              <tfoot>
                                                  <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                                                      <td colSpan={3} className="py-3 px-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Sub-Total {category}</td>
                                                      <td className="py-3 px-4 text-right text-sm font-black text-slate-900 dark:text-white">R{totalsByCategory[category].toFixed(2)}</td>
                                                  </tr>
                                              </tfoot>
                                          </table>
                                      </div>
                                  </div>
                              );
                          })}

                          <div className="mt-8 p-6 bg-primary-600 rounded-3xl flex justify-between items-center shadow-xl shadow-primary-500/20">
                              <div className="flex items-center gap-3 text-white">
                                  <span className="text-2xl">🧮</span>
                                  <span className="text-sm font-black uppercase tracking-[0.2em]">Grand Total Estimate</span>
                              </div>
                              <div className="text-3xl font-black text-white tracking-tight">
                                  R{grandTotal.toFixed(2)}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="py-12 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                          <p className="text-sm font-bold text-slate-400">No shopping items generated.</p>
                      </div>
                  )}
              </div>
          </div>

          {/* DISH GALLERY SECTION */}
          <div className={`${t.sectionContainer} rounded-[2.5rem] md:col-span-2 shadow-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 mt-12`}>
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className={`p-3 ${t.sectionIcon} rounded-2xl`}><span className="text-2xl">📷</span></div>
                      <div>
                          <h3 className="text-2xl font-black">Dish Gallery</h3>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Showcase your actual creations</p>
                      </div>
                  </div>
                  {onUploadDishImage && (
                      <label className="cursor-pointer px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary-500/20">
                          <span className="text-sm">➕</span> Upload Dish Photo
                          <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) onUploadDishImage(file);
                              }}
                          />
                      </label>
                  )}
              </div>
              <div className="p-8">
                  {menu.dishImages && menu.dishImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {menu.dishImages.map((img, idx) => (
                              <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 group relative">
                                  <img src={img} alt={`Dish ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                                          <span className="text-xl">👁️</span>
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="py-16 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                          <span className="text-6xl mb-4 opacity-10">🖼️</span>
                          <p className="text-sm font-bold text-slate-400">No dish photos uploaded yet.</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Upload your work to build client trust</p>
                      </div>
                  )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDisplay;
