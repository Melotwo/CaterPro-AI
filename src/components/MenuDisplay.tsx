
import React, { useState } from 'react';
import { Menu, MenuSection, ShoppingListItem, RecommendedEquipment, BeveragePairing } from '../types';
import { Pencil, Copy, Edit, CheckSquare, ListTodo, X, ShoppingCart, Wine, Calculator, RefreshCw, Truck, ChefHat, FileText, ClipboardCheck, Share2, Link as LinkIcon, DollarSign, Wallet, Megaphone, Target, Lightbulb, TrendingUp, BarChart3, HelpCircle, Info, ArrowRight, Calendar, ShieldCheck, Sparkles, FileDown, Video, MessageSquareQuote, Lock, Sparkle, EyeOff, Eye, BrainCircuit, Globe, ExternalLink, Camera, Instagram, Smartphone, BarChart4, ShieldAlert, Thermometer, Droplets, Layout, Palette } from 'lucide-react';
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

  const handleSocialAction = (mode: 'reel' | 'status' | 'create') => {
    analytics.track({ type: 'founder_action', data: { actionName: `open_social_${mode}` } });
    onOpenSocialModal?.(mode);
  };

  return (
    <div className={`p-4 sm:p-10 theme-container ${t.container} rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in relative transition-all duration-500 ${clipperMode ? 'scale-[0.98] ring-[20px] ring-indigo-600/20' : ''}`}>
      
      {!isReadOnlyView && (
      <div className="no-print space-y-6">
          <div className="bg-amber-500 p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border-4 border-white dark:border-slate-800 animate-bounce cursor-pointer" onClick={jumpToThumbnailStudio}>
              <div className="flex items-center gap-4 text-white">
                  <div className="p-3 bg-white/20 rounded-2xl"><Palette size={32} /></div>
                  <div>
                      <h4 className="text-xl font-black uppercase tracking-tight leading-none">Ready for Fiverr?</h4>
                      <p className="text-[10px] font-black uppercase opacity-90 tracking-widest mt-1">Create your high-click gig thumbnail now</p>
                  </div>
              </div>
              <button className="px-8 py-3 bg-white text-amber-600 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">Open Asset Studio</button>
          </div>

          <div className="bg-slate-950 text-white p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden group border border-white/10 shadow-indigo-500/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles size={120} />
              </div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="max-w-md">
                      <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20">
                              <Megaphone size={24} className="text-white" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400">Hub Command Center</span>
                      </div>
                      <h4 className="text-3xl font-black tracking-tight leading-none mb-2">Lifecycle Intelligence</h4>
                      <p className="text-slate-400 text-sm font-medium">Use Data-Driven Menu Engineering to identify high-margin 'Star' items.</p>
                      
                      <div className="mt-8 flex flex-wrap gap-3">
                          <button 
                            onClick={() => { setShowBusinessIntel(!showBusinessIntel); analytics.track({ type: 'founder_action', data: { actionName: 'toggle_intel' } }); }}
                            className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${showBusinessIntel ? 'bg-amber-500 text-white' : 'bg-white text-slate-950 hover:bg-slate-100'}`}
                          >
                            <BarChart4 size={18} /> 
                            {showBusinessIntel ? 'Exit Intel Mode' : 'Profit Engineering'} 
                          </button>
                          <button 
                            onClick={() => handleSocialAction('reel')}
                            className="flex items-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                          >
                            <Video size={18} /> 
                            Render Marketing Asset 
                          </button>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-1/2">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                       <div className="flex items-center gap-2 mb-2 text-indigo-400">
                          <BrainCircuit size={16} />
                          <span className="text-[10px] font-black uppercase">Lifecycle ROI</span>
                       </div>
                       <p className="text-xs text-slate-400 leading-relaxed font-medium">AI identifies which dishes build long-term 'Lounge' loyalty.</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                       <div className="flex items-center gap-2 mb-2 text-amber-400">
                          <Target size={16} />
                          <span className="text-[10px] font-black uppercase">Golden Triangle</span>
                       </div>
                       <p className="text-xs text-slate-400 leading-relaxed font-medium">Visualizing eye-movement patterns to optimize item placement.</p>
                    </div>
                  </div>
              </div>
          </div>
      </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-dashed border-slate-200 dark:border-slate-700 pb-8 gap-4 mt-8">
         <div className="flex items-center gap-4">
            <ChefHat className={`w-10 h-10 ${t.title}`} />
            <div>
                <span className={`text-xs font-black uppercase tracking-[0.4em] block ${t.description} opacity-60 mb-1`}>Lifecycle Authorized</span>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck size={12} /> Strategic Hub Build
                    </span>
                    <span className={`text-sm font-bold ${t.description}`}>{new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
            </div>
         </div>
         
         <div className="flex items-center gap-2 no-print">
            <button 
                onClick={() => onOpenShareModal?.()} 
                className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2 border border-indigo-100 dark:border-indigo-800"
                title="Share Proposal"
            >
                <Share2 size={16} />
                <span className="hidden xs:inline">Share</span>
            </button>
            <button onClick={() => window.print()} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-colors" title="Print/Export">
                <FileDown size={20} className={t.description} />
            </button>
         </div>
      </div>

      {menu.image && !isGeneratingImage && (
         <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl border-8 border-white dark:border-slate-800 transition-transform hover:scale-[1.01] duration-700 mt-8">
             <img 
               src={`data:image/png;base64,${menu.image}`} 
               alt={menu.menuTitle}
               className="w-full h-auto max-h-[600px] object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
             
             <div className={`absolute bottom-8 left-8 right-8 text-white transition-opacity duration-500 ${hideWatermark ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex items-center gap-3 mb-3 bg-black/20 backdrop-blur-md w-fit px-4 py-2 rounded-2xl border border-white/20">
                    <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-lg shadow-xl" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-90">CaterPro AI: Marketing Hub</span>
                </div>
                <h3 className="text-3xl font-black tracking-tight">{menu.menuTitle}</h3>
             </div>
         </div>
      )}

      <div className="text-center max-w-4xl mx-auto space-y-6 py-12">
        <h2 className={`text-5xl sm:text-7xl font-black tracking-tighter ${t.title} leading-[0.9]}`}>{menu.menuTitle}</h2>
        <div className="flex justify-center gap-2">
            {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary-500 opacity-20"></div>)}
        </div>
        <p className={`text-2xl leading-relaxed ${t.description} font-medium italic opacity-80 px-4`}>"{menu.description}"</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {MENU_SECTIONS.map(({ title, key }, catIdx) => {
          const rawItems = menu[key];
          const items = Array.isArray(rawItems) ? rawItems : [];
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
              <ul className="p-8 sm:p-10 space-y-6">
                {items.filter((i): i is string => typeof i === 'string').map((item, index) => {
                  const checkKey = `${key}-${index}`;
                  const isChecked = checkedItems.has(checkKey);
                  const analysis = menu.businessAnalysis?.find(a => a.name.includes(item.split(':')[0]) || item.includes(a.name));

                  return (
                    <li key={checkKey} className={`flex items-start gap-5 p-6 rounded-[2.5rem] border-2 border-transparent transition-all ${isChecked ? 'bg-slate-100/50 dark:bg-slate-800/50' : 'hover:bg-white dark:hover:bg-slate-800 shadow-md'}`}>
                      {!isReadOnlyView && (
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleItem(checkKey)}
                          className={`mt-1.5 w-8 h-8 rounded-2xl focus:ring-4 cursor-pointer transition-all ${t.checkbox}`}
                        />
                      )}
                      <div className="space-y-2">
                        <span className={`text-xl sm:text-2xl font-black tracking-tight transition-all ${isChecked ? t.checkedText : t.uncheckedText}`}>
                            {item}
                        </span>
                        {analysis?.evocativeDescription && (
                            <p className="text-sm italic text-slate-500 font-medium leading-relaxed">
                                {analysis.evocativeDescription}
                            </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {menu.safetyProtocols && menu.safetyProtocols.length > 0 && (
            <div className="lg:col-span-2 border-4 border-red-500/20 bg-red-50/20 dark:bg-red-900/10 rounded-[3rem] shadow-xl overflow-hidden mt-6">
                <div className="p-10 border-b border-red-200 dark:border-red-900 flex items-center justify-between bg-white dark:bg-slate-900/50">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-red-500 rounded-3xl text-white shadow-xl"><ShieldAlert size={28} /></div>
                        <div>
                            <h3 className="text-2xl font-black uppercase text-red-900 dark:text-red-200 tracking-tight">HACCP Safety Command</h3>
                            <p className="text-xs font-black text-red-600 uppercase tracking-widest mt-1">Hazard Analysis & Critical Control Points</p>
                        </div>
                    </div>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        {menu.safetyProtocols.map((protocol, idx) => (
                            <div key={idx} 
                                onClick={() => onToggleItem(`haccp-${idx}`)}
                                className={`flex gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${checkedItems.has(`haccp-${idx}`) ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/30 opacity-60' : 'bg-white dark:bg-slate-800 border-red-100 dark:border-red-800 shadow-sm hover:border-red-500/50'}`}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={checkedItems.has(`haccp-${idx}`) ? true : false} 
                                    readOnly
                                    className="w-5 h-5 rounded-lg text-emerald-600"
                                />
                                <p className={`text-sm font-bold leading-relaxed ${checkedItems.has(`haccp-${idx}`) ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>{protocol}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-red-100 dark:border-red-800 space-y-6">
                        <div className="flex items-center gap-3 text-red-600 mb-2">
                            <Thermometer size={24} />
                            <h5 className="font-black uppercase tracking-widest text-sm">Critical Temperature Logs</h5>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-bold text-slate-500 uppercase">Reception Temp:</span>
                                <span className="text-xs font-black">&lt; 4°C</span>
                            </div>
                            <div className="flex justify-between p-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-bold text-slate-500 uppercase">Service Temp (Hot):</span>
                                <span className="text-xs font-black">&gt; 65°C</span>
                            </div>
                            <div className="flex justify-between p-3">
                                <span className="text-xs font-bold text-slate-500 uppercase">Cooling Curve:</span>
                                <span className="text-xs font-black">2h (60°C to 21°C)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {menu.shoppingList && menu.shoppingList.length > 0 && (
            <div className={`lg:col-span-2 ${t.sectionContainer} rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 overflow-hidden border-2 border-slate-100 dark:border-slate-800 mt-6`}>
                <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-5">
                        <div className={`p-4 ${t.sectionIcon} rounded-3xl shadow-xl`}><ShoppingCart size={28} /></div>
                        <div>
                            <h3 className="text-2xl font-black">Procurement & Sourcing</h3>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Calculated in {preferredCurrency} (Click items to source)</p>
                        </div>
                    </div>
                </div>
                <div className="p-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {menu.shoppingList.map((item, idx) => (
                            <button 
                                key={idx} 
                                onClick={(e) => handleSourcingSearch(e, item.item)}
                                onTouchEnd={(e) => handleSourcingSearch(e, item.item)}
                                className={`${t.card} p-6 rounded-[2.5rem] border-2 border-transparent hover:border-primary-500 transition-all shadow-sm group text-left w-full active:scale-95 touch-manipulation`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h5 className="font-black text-sm uppercase tracking-wider text-slate-400 group-hover:text-primary-500 transition-colors">{item.item}</h5>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink size={14} className="text-primary-500" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.quantity} • {item.category}<br/><span className="text-[10px] opacity-60">Source: {item.store || 'Local Market'}</span></p>
                                    <p className="text-lg font-black text-primary-600">{item.estimatedCost}</p>
                                </div>
                            </button>
                        ))}
                     </div>
                     
                     <div className="mt-12 p-10 bg-slate-950 rounded-[3rem] flex flex-col sm:flex-row items-center justify-between gap-8 border-4 border-primary-500/10 shadow-inner">
                        <div className="flex items-center gap-6">
                            <div className="p-5 bg-primary-500 rounded-[2rem] text-white shadow-2xl shadow-primary-500/30"><Wallet size={36} /></div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Procurement Budget (est.)</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-black text-slate-400 uppercase">{preferredCurrency}</span>
                                    <h4 className="text-5xl font-black text-white tracking-tighter">{totalCost.toFixed(2)}</h4>
                                </div>
                            </div>
                        </div>
                        <button className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Export List</button>
                     </div>
                </div>
            </div>
        )}
        
        {menu.recommendedEquipment && menu.recommendedEquipment.length > 0 && (
            <div className={`lg:col-span-2 ${t.sectionContainer} rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 overflow-hidden border-2 border-slate-100 dark:border-slate-800 mt-6`}>
                 <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-5">
                        <div className={`p-4 bg-indigo-500 rounded-3xl shadow-xl text-white`}><ClipboardCheck size={28} /></div>
                        <div>
                            <h3 className="text-2xl font-black">Equipment & Supplies</h3>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Inventory Required (Click to find suppliers)</p>
                        </div>
                    </div>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menu.recommendedEquipment.map((eq, idx) => (
                        <button 
                            key={idx} 
                            onClick={(e) => handleSourcingSearch(e, eq.item)}
                            onTouchEnd={(e) => handleSourcingSearch(e, eq.item)}
                            className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-transparent hover:border-indigo-500 transition-all flex items-start gap-4 text-left active:scale-95 group touch-manipulation"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <LinkIcon size={18} />
                            </div>
                            <div>
                                <h5 className="font-black text-slate-900 dark:text-white">{eq.item}</h5>
                                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{eq.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MenuDisplay;
