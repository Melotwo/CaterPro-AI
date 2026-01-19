
import React, { useState } from 'react';
import { Menu, MenuSection, ShoppingListItem, RecommendedEquipment, BeveragePairing } from '../types';
import { Pencil, Copy, Edit, CheckSquare, ListTodo, X, ShoppingCart, Wine, Calculator, RefreshCw, Truck, ChefHat, FileText, ClipboardCheck, Share2, Link as LinkIcon, DollarSign, Wallet, Megaphone, Target, Lightbulb, TrendingUp, ShieldCheck, Sparkles, FileDown, Video, MessageSquareQuote, Lock, Sparkle, EyeOff, Eye, BrainCircuit, Globe, ExternalLink, Camera, Instagram, Smartphone, BarChart4, ShieldAlert, Thermometer, Droplets } from 'lucide-react';
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

  const handleSocialAction = (mode: 'reel' | 'status' | 'create') => {
    if (onAttemptAccess('socialMediaTools')) {
        analytics.track({ type: 'founder_action', data: { actionName: `social_${mode}` } });
        onOpenSocialModal?.(mode);
    }
  };

  return (
    <div className={`p-4 sm:p-10 theme-container ${t.container} rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in relative transition-all duration-500 ${clipperMode ? 'scale-[0.98] ring-[20px] ring-indigo-600/20' : ''}`}>
      
      {!isReadOnlyView && (
      <div className="no-print space-y-6">
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

      {showBusinessIntel && menu.businessAnalysis && (
          <div className="no-print animate-slide-in p-8 bg-amber-50 dark:bg-amber-900/10 border-4 border-amber-400/30 rounded-[3rem] shadow-2xl space-y-8 mt-6">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg"><BarChart4 size={24} /></div>
                      <div>
                          <h4 className="text-xl font-black uppercase tracking-tight text-amber-900 dark:text-amber-200">Profitability Matrix</h4>
                          <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mt-1">Applying Menu Engineering Quadrants</p>
                      </div>
                  </div>
                  <button onClick={() => setShowBusinessIntel(false)} className="p-2 hover:bg-amber-100 rounded-full"><X size={20} className="text-amber-600" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {menu.businessAnalysis.map((item, idx) => (
                      <div key={idx} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-700 shadow-sm group hover:scale-105 transition-all">
                          <div className={`w-fit px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 ${
                              item.category === 'Star' ? 'bg-emerald-500 text-white' : 
                              item.category === 'Plow Horse' ? 'bg-indigo-500 text-white' : 
                              item.category === 'Puzzle' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                              {item.category}
                          </div>
                          <h5 className="font-black text-sm text-slate-900 dark:text-white leading-tight mb-2">{item.name}</h5>
                          <div className="flex items-center justify-between mt-4 border-t border-slate-100 dark:border-slate-700 pt-3">
                              <div>
                                  <p className="text-[8px] font-black text-slate-400 uppercase">Margin</p>
                                  <div className="flex gap-0.5 mt-1">
                                      {[...Array(5)].map((_, i) => <div key={i} className={`h-1 w-2 rounded-full ${i < Math.round(item.profitMargin/2) ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-700'}`}></div>)}
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="text-[8px] font-black text-slate-400 uppercase">Popularity</p>
                                  <div className="flex gap-0.5 mt-1 justify-end">
                                      {[...Array(5)].map((_, i) => <div key={i} className={`h-1 w-2 rounded-full ${i < Math.round(item.popularityPotential/2) ? 'bg-indigo-500' : 'bg-slate-100 dark:bg-slate-700'}`}></div>)}
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
              
              <div className="p-6 bg-slate-950 rounded-[2rem] text-white flex flex-col md:flex-row items-center gap-6">
                   <div className="p-4 bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-500/20"><Target size={32} /></div>
                   <div>
                        <h6 className="font-black uppercase tracking-widest text-indigo-400">The Golden Triangle Advice</h6>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed mt-1">The center of this proposal should feature the <strong>{menu.businessAnalysis.find(i => i.category === 'Star')?.name || 'main entree'}</strong>. Customers look here first.</p>
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
            <button onClick={() => window.print()} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-colors" title="Print/Export">
                <FileDown size={20} className={t.description} />
            </button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast("Link Copied!"); }} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-colors" title="Share Link">
                <Share2 size={20} className={t.description} />
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
        <h2 className={`text-5xl sm:text-7xl font-black tracking-tighter ${t.title} leading-[0.9]`}>{menu.menuTitle}</h2>
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
                        <span className={`text-xl sm:text-2xl leading-tight font-black tracking-tight transition-all ${isChecked ? t.checkedText : t.uncheckedText}`}>
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
                            <div key={idx} className="flex gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-red-100 dark:border-red-800 shadow-sm">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-black shrink-0">{idx+1}</div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{protocol}</p>
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
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Calculated in {preferredCurrency}</p>
                        </div>
                    </div>
                </div>
                <div className="p-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {menu.shoppingList.map((item, idx) => (
                            <div key={idx} className={`${t.card} p-6 rounded-[2.5rem] border-2 border-transparent hover:border-primary-500/20 transition-all shadow-sm group`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h5 className="font-black text-sm uppercase tracking-wider text-slate-400 group-hover:text-primary-500 transition-colors">{item.item}</h5>
                                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.quantity} • {item.category}<br/><span className="text-[10px] opacity-60">Source: {item.store || 'Local Market'}</span></p>
                                    <p className="text-lg font-black text-primary-600">{item.estimatedCost}</p>
                                </div>
                            </div>
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
      </div>
    </div>
  );
};

export default MenuDisplay;
