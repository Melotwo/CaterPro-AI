import React, { useState } from 'react';
import { Menu, MenuSection, ShoppingListItem, RecommendedEquipment, BeveragePairing } from '../types';
import { Pencil, Copy, Edit, CheckSquare, ListTodo, X, ShoppingCart, Wine, Calculator, RefreshCw, Truck, ChefHat, FileText, ClipboardCheck, Share2, Link as LinkIcon, DollarSign, Wallet, Megaphone, Target, Lightbulb, TrendingUp, BarChart3, HelpCircle, Info, ArrowRight, Calendar, ShieldCheck, Sparkles, FileDown, Video, MessageSquareQuote, Lock, Sparkle, EyeOff, Eye, BrainCircuit, Globe, ExternalLink, Camera, Instagram, Smartphone, BarChart4, ShieldAlert, Thermometer, Droplets, Layout, Palette, AlertTriangle, Loader2, ImageIcon } from 'lucide-react';
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
  
  if (!menu) return null;

  return (
    <div className={`p-0 theme-container ${t.container} rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in relative transition-all duration-500 overflow-hidden`}>
      
      {/* HERO SECTION: Image and Overlaid Title */}
      <div className="relative w-full aspect-[16/9] min-h-[300px] overflow-hidden group">
          {/* Background Image / Placeholder */}
          {isGeneratingImage ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse bg-slate-200 dark:bg-slate-900 z-10">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
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
                  <ImageIcon size={64} className="mb-4 opacity-10" />
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
                  <ChefHat className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">CaterPro AI: Marketing Hub</span>
              </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 z-20 flex gap-2 no-print">
              <button onClick={() => onOpenShareModal?.()} className="p-3 bg-white/20 backdrop-blur-xl text-white hover:bg-white/40 rounded-2xl transition-all border border-white/20 shadow-lg" title="Share Strategy">
                  <Share2 size={20} />
              </button>
              <button onClick={() => window.print()} className="p-3 bg-white/20 backdrop-blur-xl text-white hover:bg-white/40 rounded-2xl transition-all border border-white/20 shadow-lg" title="Export Strategic PDF">
                  <FileDown size={20} />
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
              // Fix: Explicitly cast to any array to resolve property 'length' and 'map' errors on the union type of Menu properties.
              const items = (Array.isArray(menu[key as keyof Menu]) ? menu[key as keyof Menu] : []) as any[];
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
    </div>
  );
};

export default MenuDisplay;
