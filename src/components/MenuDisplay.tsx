import React, { useState } from 'react';
import { Menu, MenuSection, ShoppingListItem, RecommendedEquipment, BeveragePairing } from '../types';
import { Pencil, Copy, Edit, CheckSquare, ListTodo, X, ShoppingCart, Wine, Calculator, RefreshCw, Truck, ChefHat, FileText, ClipboardCheck, Share2, Link as LinkIcon, DollarSign, Wallet, Megaphone, Target, Lightbulb, TrendingUp, BarChart3, HelpCircle, Info, ArrowRight, Calendar, ShieldCheck, Sparkles, FileDown, Video, MessageSquareQuote, Lock, Sparkle, EyeOff, Eye, BrainCircuit, Globe, ExternalLink, Camera, Instagram, Smartphone, BarChart4, ShieldAlert, Thermometer, Droplets, Layout, Palette, AlertTriangle } from 'lucide-react';
import { MENU_SECTIONS, EDITABLE_MENU_SECTIONS, PROPOSAL_THEMES } from '../constants';
import { analytics } from '../services/analyticsManager';

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
  onOpenShareModal?: () => void;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ 
    menu, checkedItems, onToggleItem, isEditable, onEditItem, showToast, 
    isGeneratingImage, onUpdateShoppingItemQuantity, bulkSelectedItems, onToggleBulkSelect,
    onBulkCheck, onBulkUpdateQuantity, onClearBulkSelection, onSelectAllShoppingListItems,
    proposalTheme, canAccessFeature, onAttemptAccess, isReadOnlyView = false,
    deliveryRadius, onDeliveryRadiusChange, onCalculateFee, calculatedFee, onRegenerateImage,
    preferredCurrency = 'ZAR', onOpenSocialModal, onOpenShareModal
}) => {
  const theme = PROPOSAL_THEMES[proposalTheme as keyof typeof PROPOSAL_THEMES] || PROPOSAL_THEMES.classic;
  const t = theme.classes;
  
  const [hideWatermark, setHideWatermark] = useState(false);
  const [clipperMode, setClipperMode] = useState(false);
  const [showBusinessIntel, setShowBusinessIntel] = useState(false);

  if (!menu) return null;

  const calculateTotal = (items: ShoppingListItem[]) => {
    return items.reduce((acc, item) => {
      if (!item.estimatedCost) return acc;
      const numericValue = parseFloat(item.estimatedCost.replace(/[^0-9.]/g, ''));
      return isNaN(numericValue) ? acc : acc + numericValue;
    }, 0);
  };

  const totalCost = Array.isArray(menu.shoppingList) ? calculateTotal(menu.shoppingList) : 0;

  const handleSourcingSearch = (e: React.MouseEvent | React.TouchEvent, item: string) => {
      e.preventDefault();
      e.stopPropagation();
      const query = encodeURIComponent(`buy ${item} catering supplies south africa`);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
      showToast(`Searching for ${item}...`);
  };

  const jumpToThumbnailStudio = () => {
    const section = document.getElementById('founder-roadmap');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        showToast("Opening Asset Studio below...");
    }
  };

  return (
    <div className={`p-4 sm:p-10 theme-container ${t.container} rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in relative transition-all duration-500`}>
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-dashed border-slate-200 dark:border-slate-700 pb-8 gap-4 mt-8">
         <div className="flex items-center gap-4">
            <ChefHat className={`w-10 h-10 ${t.title}`} />
            <div>
                <span className={`text-xs font-black uppercase tracking-[0.4em] block ${t.description} opacity-60 mb-1`}>Proposal Lifecycle Verified</span>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${t.description}`}>{new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
            </div>
         </div>
         <div className="flex items-center gap-2 no-print">
            <button onClick={() => onOpenShareModal?.()} className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Share2 size={16} /> Share
            </button>
            <button onClick={() => window.print()} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <FileDown size={20} className={t.description} />
            </button>
         </div>
      </div>

      <div className="text-center max-w-4xl mx-auto space-y-6 py-12">
        <h2 className={`text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter ${t.title} leading-[0.9]`}>{menu.menuTitle}</h2>
        <p className={`text-xl sm:text-2xl leading-relaxed ${t.description} font-medium italic opacity-80 px-4`}>"{menu.description}"</p>
      </div>
      
      {/* GRID START - Ensuring Sections 1, 2, 3 are visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch min-h-[400px]">
        {MENU_SECTIONS.map(({ title, key }, catIdx) => {
          // Filter out the wide management sections to keep the 4-grid clean
          const isWideSection = ['shoppingList', 'recommendedEquipment', 'beveragePairings', 'dietaryNotes', 'miseEnPlace', 'serviceNotes', 'deliveryLogistics'].includes(key);
          if (isWideSection) return null;

          const rawItems = menu[key as keyof Menu];
          // Fix: Explicitly cast to any[] to avoid union property access errors in dynamic rendering (lines 155 and 164)
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
                                <CheckSquare size={18} className="text-primary-500 mt-1 shrink-0" />
                                <span className="text-lg font-bold tracking-tight">{String(item)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="py-12 px-6 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-4">
                        <AlertTriangle className="text-amber-400 w-8 h-8" />
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest leading-relaxed">
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
            const items = Array.isArray(menu[key as keyof Menu]) ? menu[key as keyof Menu] : [];
            if (!section || items.length === 0) return null;

            return (
                <div key={key} className={`${t.sectionContainer} rounded-[2.5rem] md:col-span-2 shadow-xl overflow-hidden bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 mt-6`}>
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                        <div className={`p-3 ${t.sectionIcon} rounded-2xl`}><ClipboardCheck size={24} /></div>
                        <h3 className="text-2xl font-black">{section.title}</h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item, i) => (
                            <div key={i} className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</span>
                                <p className="text-sm font-bold">{String(item)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default MenuDisplay;
