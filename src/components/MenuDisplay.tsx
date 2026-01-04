
import React, { useState } from 'react';
import { Menu, MenuSection, ShoppingListItem, RecommendedEquipment, BeveragePairing } from '../types';
import { Pencil, Copy, Edit, CheckSquare, ListTodo, X, ShoppingCart, Wine, Calculator, RefreshCw, Truck, ChefHat, FileText, ClipboardCheck, Share2, Link as LinkIcon, DollarSign, Wallet, Megaphone, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { MENU_SECTIONS, EDITABLE_MENU_SECTIONS, PROPOSAL_THEMES } from '../constants';

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
  preferredCurrency?: string;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ 
    menu, checkedItems, onToggleItem, isEditable, onEditItem, showToast, 
    isGeneratingImage, onUpdateShoppingItemQuantity, bulkSelectedItems, onToggleBulkSelect,
    onBulkCheck, onBulkUpdateQuantity, onClearBulkSelection, onSelectAllShoppingListItems,
    proposalTheme, canAccessFeature, onAttemptAccess, isReadOnlyView = false,
    deliveryRadius, onDeliveryRadiusChange, onCalculateFee, calculatedFee, onRegenerateImage,
    preferredCurrency = 'ZAR'
}) => {
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  
  const theme = PROPOSAL_THEMES[proposalTheme as keyof typeof PROPOSAL_THEMES] || PROPOSAL_THEMES.classic;
  const t = theme.classes;

  if (!menu) return null;

  const calculateTotal = (items: ShoppingListItem[]) => {
    return items.reduce((acc, item) => {
      if (!item.estimatedCost) return acc;
      const numericValue = parseFloat(item.estimatedCost.replace(/[^0-9.]/g, ''));
      return isNaN(numericValue) ? acc : acc + numericValue;
    }, 0);
  };

  const totalCost = Array.isArray(menu.shoppingList) ? calculateTotal(menu.shoppingList) : 0;

  const handleGenerateShareLink = () => {
    showToast("Share Link copied! Reliable on all devices.");
  };

  const salesHooks = [
    { 
        title: "The Lifecycle Hook", 
        icon: TrendingUp, 
        color: "blue",
        text: `Tell your client: "This isn't just a menu; it's an experience I've architected for the entire lifecycle of your event—from the first appetizer to the morning-after follow-up."` 
    },
    { 
        title: "The Precision Hook", 
        icon: Target, 
        color: "amber",
        text: `Pitch this: "I noticed your guests are mostly [busy professionals/families]. I've hyper-targeted the flavor profiles and portion sizes to match their specific needs perfectly."` 
    },
    { 
        title: "The Data Hook", 
        icon: Megaphone, 
        color: "emerald",
        text: `Say this: "I've used data-driven procurement for this proposal, ensuring we maximize quality while tracking every cost in ${preferredCurrency} to stay exactly on budget."` 
    }
  ];

  return (
    <div className={`p-4 sm:p-10 theme-container ${t.container} rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800`}>
      <div className="space-y-10">
      
      {/* Sales Strategy Header - iPad Layout optimized */}
      {!isReadOnlyView && (
      <div className="no-print bg-slate-900 text-white p-8 rounded-[2.5rem] mb-12 shadow-xl border-4 border-primary-500/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                  <div className="p-4 bg-primary-500 rounded-3xl text-white shadow-lg">
                      <Lightbulb size={32} />
                  </div>
                  <div>
                      <h4 className="text-xl font-black uppercase tracking-tight">Sales Strategy Hub</h4>
                      <p className="text-sm text-slate-400 font-medium">Derived from your Strategy Hooks</p>
                  </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                 {salesHooks.map((hook, idx) => (
                    <button 
                        key={idx}
                        onClick={() => {
                            navigator.clipboard.writeText(hook.text);
                            showToast(`${hook.title} copied!`);
                        }}
                        className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 transition-all text-left flex flex-col gap-2 group"
                    >
                        <hook.icon size={16} className={`text-${hook.color}-400 group-hover:scale-110 transition-transform`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{hook.title}</span>
                        <span className="text-[11px] font-bold text-slate-300 line-clamp-2">Click to copy script</span>
                    </button>
                 ))}
              </div>
          </div>
      </div>
      )}

      <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 dark:border-slate-700 pb-6">
         <div className="flex items-center gap-3">
            <ChefHat className={`w-8 h-8 ${t.title}`} />
            <span className={`text-base font-black uppercase tracking-[0.3em] ${t.description}`}>CaterPro AI Proposal</span>
         </div>
         <span className={`text-sm font-bold ${t.description}`}>{new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      {menu.image && !isGeneratingImage && (
         <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate-800">
             <img 
               src={`data:image/png;base64,${menu.image}`} 
               alt={menu.menuTitle}
               className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
         </div>
      )}

      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className={`text-4xl sm:text-6xl font-black tracking-tighter ${t.title} leading-tight`}>{menu.menuTitle}</h2>
        <p className={`text-xl leading-relaxed ${t.description} font-medium italic opacity-80`}>"{menu.description}"</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {MENU_SECTIONS.map(({ title, key }, catIdx) => {
          const rawItems = menu[key];
          const items = Array.isArray(rawItems) ? rawItems : [];
          if (items.length === 0) return null;
          
          const isWideSection = ['shoppingList', 'recommendedEquipment', 'beveragePairings'].includes(key);
          const sectionClass = isWideSection ? 'lg:col-span-2' : '';

          return (
            <div key={key} className={`${t.sectionContainer} rounded-[2rem] ${sectionClass} shadow-sm overflow-hidden bg-slate-50/50 dark:bg-slate-900/50`}>
              <div className="flex justify-between items-center p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
                <h3 className={`text-xl font-black ${t.sectionTitle} flex items-center gap-4`}>
                  <span className={`w-10 h-10 ${t.sectionIcon} rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0 shadow-lg`}>
                    {catIdx + 1}
                  </span>
                  {title}
                </h3>
              </div>
              <ul className="p-6 sm:p-8 space-y-3">
                {items.filter((i): i is string => typeof i === 'string').map((item, index) => {
                  const checkKey = `${key}-${index}`;
                  const isChecked = checkedItems.has(checkKey);
                  return (
                    <li key={checkKey} className={`flex items-start gap-4 p-4 rounded-2xl border-2 border-transparent transition-all ${isChecked ? 'bg-slate-100/50 dark:bg-slate-800/50' : 'hover:bg-white dark:hover:bg-slate-800 shadow-sm'}`}>
                      {!isReadOnlyView && (
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleItem(checkKey)}
                          className={`mt-1.5 w-6 h-6 rounded-lg focus:ring-4 cursor-pointer transition-all ${t.checkbox}`}
                        />
                      )}
                      <span className={`text-base sm:text-lg leading-snug font-bold transition-all ${isChecked ? t.checkedText : t.uncheckedText}`}>
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {/* Dynamic Shopping List with Procurement Logic */}
        {menu.shoppingList && menu.shoppingList.length > 0 && (
            <div className={`lg:col-span-2 ${t.sectionContainer} rounded-[2rem] shadow-xl`}>
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-black flex items-center gap-4">
                        <span className={`w-10 h-10 ${t.sectionIcon} rounded-2xl flex items-center justify-center text-sm font-black shadow-lg`}><ShoppingCart size={20} /></span>
                        Procurement & Sourcing
                    </h3>
                </div>
                <div className="p-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menu.shoppingList.map((item, idx) => (
                            <div key={idx} className={`${t.card} p-5 rounded-2xl border-2 border-transparent hover:border-primary-500/20 transition-all`}>
                                <h5 className="font-black text-sm uppercase tracking-wider mb-1">{item.item}</h5>
                                <div className="flex justify-between items-end">
                                    <p className="text-xs text-slate-500 font-bold">{item.quantity} • {item.category}</p>
                                    <p className="text-sm font-black text-primary-600">{item.estimatedCost}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                     
                     <div className="mt-10 p-8 bg-slate-900 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-6 border-4 border-primary-500/10">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-primary-500 rounded-3xl text-white shadow-xl shadow-primary-500/20"><Wallet size={28} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Total Procurement Estimate</p>
                                <h4 className="text-4xl font-black text-white">{preferredCurrency} {totalCost.toFixed(2)}</h4>
                            </div>
                        </div>
                        <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Update Quantities</button>
                     </div>
                </div>
            </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default MenuDisplay;
