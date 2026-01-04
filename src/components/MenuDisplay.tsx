
import React, { useState } from 'react';
import { Menu, MenuSection, ShoppingListItem, RecommendedEquipment, BeveragePairing } from '../types';
import { Pencil, Copy, Edit, CheckSquare, ListTodo, X, ShoppingCart, Wine, Calculator, RefreshCw, Truck, ChefHat, FileText, ClipboardCheck, Share2, Link as LinkIcon, DollarSign, Wallet, Megaphone, Target, Lightbulb, TrendingUp, ShieldCheck, Sparkles, FileDown, Video, MessageSquareQuote, Lock } from 'lucide-react';
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
  onOpenSocialModal?: (mode: 'reel' | 'status' | 'create') => void;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ 
    menu, checkedItems, onToggleItem, isEditable, onEditItem, showToast, 
    isGeneratingImage, onUpdateShoppingItemQuantity, bulkSelectedItems, onToggleBulkSelect,
    onBulkCheck, onBulkUpdateQuantity, onClearBulkSelection, onSelectAllShoppingListItems,
    proposalTheme, canAccessFeature, onAttemptAccess, isReadOnlyView = false,
    deliveryRadius, onDeliveryRadiusChange, onCalculateFee, calculatedFee, onRegenerateImage,
    preferredCurrency = 'ZAR', onOpenSocialModal
}) => {
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

  const salesHooks = [
    { 
        title: "Lifecycle Script", 
        icon: TrendingUp, 
        color: "blue",
        script: `Tell the client: "This proposal covers the full customer lifecycle. I've architected the flavor progression to maintain engagement from the first bite to the final dessert."` 
    },
    { 
        title: "Targeting Script", 
        icon: Target, 
        color: "amber",
        script: `Say this: "I've hyper-targeted this menu for your specific guest profile. Every ingredient was chosen to resonate with their preferences and dietary expectations."` 
    },
    { 
        title: "Systems Script", 
        icon: ShieldCheck, 
        color: "emerald",
        script: `Pitch this: "We use a data-driven system to ensure 100% procurement accuracy. This allows us to guarantee the quality and cost in ${preferredCurrency} without any last-minute chaos."` 
    }
  ];

  const handleSocialAction = (mode: 'reel' | 'status' | 'create') => {
    if (onAttemptAccess('socialMediaTools')) {
        onOpenSocialModal?.(mode);
    }
  };

  return (
    <div className={`p-4 sm:p-10 theme-container ${t.container} rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in`}>
      <div className="space-y-10">
      
      {/* Sales Accelerator Hub - RESTRICTED TO PAID CUSTOMERS */}
      {!isReadOnlyView && (
      <div className="no-print bg-slate-950 text-white p-8 sm:p-12 rounded-[2.5rem] mb-12 relative overflow-hidden group border border-white/10">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-md">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20">
                          <Megaphone size={24} className="text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400">Paid Strategy Tools</span>
                  </div>
                  <h4 className="text-3xl font-black tracking-tight leading-none mb-2">Social Media Studio</h4>
                  <p className="text-slate-400 text-sm font-medium">Turn this menu into a viral Facebook Reel or high-engagement status.</p>
                  
                  <div className="mt-8 flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleSocialAction('reel')}
                        className="flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 group/reel"
                      >
                        {!canAccessFeature('socialMediaTools') && <Lock size={12} className="opacity-60" />}
                        <Video size={16} /> 
                        Generate Viral Reel 
                        <span className="px-1.5 py-0.5 rounded bg-amber-400 text-[8px] text-slate-900 ml-1">Paid</span>
                      </button>
                      <button 
                        onClick={() => handleSocialAction('status')}
                        className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95"
                      >
                        {!canAccessFeature('socialMediaTools') && <Lock size={12} className="opacity-60" />}
                        <MessageSquareQuote size={16} /> Caption Sniper
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-3/4">
                 {salesHooks.map((hook, idx) => (
                    <button 
                        key={idx}
                        onClick={() => {
                            navigator.clipboard.writeText(hook.script);
                            showToast(`${hook.title} copied!`);
                        }}
                        className="p-5 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all text-left flex flex-col gap-3 group/btn"
                    >
                        <div className={`p-2 w-fit rounded-xl bg-${hook.color}-500/20 text-${hook.color}-400 group-hover/btn:scale-110 transition-transform`}>
                            <hook.icon size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">{hook.title}</span>
                            <span className="text-[11px] font-bold text-slate-300 line-clamp-2 leading-relaxed">Copy Sales Pitch</span>
                        </div>
                    </button>
                 ))}
              </div>
          </div>
      </div>
      )}

      {/* Proposal Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-dashed border-slate-200 dark:border-slate-700 pb-8 gap-4">
         <div className="flex items-center gap-4">
            <ChefHat className={`w-10 h-10 ${t.title}`} />
            <div>
                <span className={`text-xs font-black uppercase tracking-[0.4em] block ${t.description} opacity-60 mb-1`}>Official Proposal</span>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck size={12} /> Strategy Optimized
                    </span>
                    <span className={`text-sm font-bold ${t.description}`}>{new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
            </div>
         </div>
         <div className="flex gap-2 no-print">
            <button onClick={() => window.print()} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-colors" title="Print/Export">
                <FileDown size={20} className={t.description} />
            </button>
            <button onClick={() => showToast("Public link shared!")} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-colors" title="Share Link">
                <Share2 size={20} className={t.description} />
            </button>
         </div>
      </div>

      {menu.image && !isGeneratingImage && (
         <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl border-8 border-white dark:border-slate-800 transition-transform hover:scale-[1.01] duration-700">
             <img 
               src={`data:image/png;base64,${menu.image}`} 
               alt={menu.menuTitle}
               className="w-full h-auto max-h-[600px] object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
             <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">AI Visual Concept</p>
                <h3 className="text-3xl font-black tracking-tight">{menu.menuTitle}</h3>
             </div>
         </div>
      )}

      <div className="text-center max-w-4xl mx-auto space-y-6 py-8">
        <h2 className={`text-5xl sm:text-7xl font-black tracking-tighter ${t.title} leading-[0.9]`}>{menu.menuTitle}</h2>
        <div className="flex justify-center gap-2">
            {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary-500 opacity-20"></div>)}
        </div>
        <p className={`text-2xl leading-relaxed ${t.description} font-medium italic opacity-80 px-4`}>"{menu.description}"</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {MENU_SECTIONS.map(({ title, key }, catIdx) => {
          const items = Array.isArray(menu[key]) ? menu[key] : [];
          if (items.length === 0) return null;
          
          const isWideSection = ['shoppingList', 'recommendedEquipment', 'beveragePairings'].includes(key);
          const sectionClass = isWideSection ? 'lg:col-span-2' : '';

          return (
            <div key={key} className={`${t.sectionContainer} rounded-[2.5rem] ${sectionClass} shadow-xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-slate-800`}>
              <div className="flex justify-between items-center p-8 sm:p-10 border-b border-slate-100 dark:border-slate-800">
                <h3 className={`text-2xl font-black ${t.sectionTitle} flex items-center gap-5`}>
                  <span className={`w-12 h-12 ${t.sectionIcon} rounded-3xl flex items-center justify-center text-lg font-black flex-shrink-0 shadow-xl`}>
                    {catIdx + 1}
                  </span>
                  {title}
                </h3>
              </div>
              <ul className="p-8 sm:p-10 space-y-4">
                {items.filter((i): i is string => typeof i === 'string').map((item, index) => {
                  const checkKey = `${key}-${index}`;
                  const isChecked = checkedItems.has(checkKey);
                  return (
                    <li key={checkKey} className={`flex items-start gap-5 p-5 rounded-3xl border-2 border-transparent transition-all ${isChecked ? 'bg-slate-100/50 dark:bg-slate-800/50' : 'hover:bg-white dark:hover:bg-slate-800 shadow-md'}`}>
                      {!isReadOnlyView && (
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleItem(checkKey)}
                          className={`mt-1.5 w-7 h-7 rounded-xl focus:ring-4 cursor-pointer transition-all ${t.checkbox}`}
                        />
                      )}
                      <span className={`text-lg sm:text-xl leading-snug font-bold tracking-tight transition-all ${isChecked ? t.checkedText : t.uncheckedText}`}>
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {/* Dynamic Shopping List */}
        {menu.shoppingList && menu.shoppingList.length > 0 && (
            <div className={`lg:col-span-2 ${t.sectionContainer} rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 overflow-hidden border-2 border-slate-100 dark:border-slate-800`}>
                <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-5">
                        <div className={`p-4 ${t.sectionIcon} rounded-3xl shadow-xl`}><ShoppingCart size={28} /></div>
                        <div>
                            <h3 className="text-2xl font-black">Procurement Master List</h3>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Sourced in {preferredCurrency}</p>
                        </div>
                    </div>
                </div>
                <div className="p-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {menu.shoppingList.map((item, idx) => (
                            <div key={idx} className={`${t.card} p-6 rounded-[2rem] border-2 border-transparent hover:border-primary-500/20 transition-all shadow-sm group`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h5 className="font-black text-sm uppercase tracking-wider text-slate-400 group-hover:text-primary-500 transition-colors">{item.item}</h5>
                                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.quantity} • {item.category}<br/><span className="text-[10px] opacity-60">Source: {item.store || 'Market'}</span></p>
                                    <p className="text-lg font-black text-primary-600">{item.estimatedCost}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                     
                     <div className="mt-12 p-10 bg-slate-950 rounded-[3rem] flex flex-col sm:flex-row items-center justify-between gap-8 border-4 border-primary-500/10 shadow-inner">
                        <div className="flex items-center gap-6">
                            <div className="p-5 bg-primary-500 rounded-[2rem] text-white shadow-2xl shadow-primary-500/30"><Wallet size={36} /></div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Total Financial Commitment</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-black text-slate-400 uppercase">{preferredCurrency}</span>
                                    <h4 className="text-5xl font-black text-white tracking-tighter">{totalCost.toFixed(2)}</h4>
                                </div>
                            </div>
                        </div>
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
