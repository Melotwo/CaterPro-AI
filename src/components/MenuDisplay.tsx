
import React, { useState } from 'react';
import { Menu, MenuSection, ShoppingListItem, RecommendedEquipment, BeveragePairing } from '../types';
import { Pencil, Copy, Edit, CheckSquare, ListTodo, X, ShoppingCart, Wine, Calculator, RefreshCw, Truck, ChefHat, FileText, ClipboardCheck, Share2, Link as LinkIcon } from 'lucide-react';
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
  const [bulkQuantity, setBulkQuantity] = useState('');
  
  const theme = PROPOSAL_THEMES[proposalTheme as keyof typeof PROPOSAL_THEMES] || PROPOSAL_THEMES.classic;
  const t = theme.classes;

  if (!menu) return null;

  // Robust Encoding for iPad/Mobile Safari
  const safeEncode = (str: string) => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
    }));
  };

  const handleGenerateShareLink = () => {
    try {
        // We create a lightweight copy for sharing to avoid URL size limits
        const shareData = { ...menu };
        if (shareData.image && shareData.image.length > 50000) {
            // If image is too big, don't include it in URL to prevent iPad crash
            delete shareData.image; 
        }

        const jsonString = JSON.stringify(shareData);
        const encodedData = safeEncode(jsonString);
        const shareUrl = `${window.location.origin}${window.location.pathname}?view=${encodedData}`;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast("Magic Share Link copied! Reliable on all devices.");
        });
    } catch (e) {
        console.error("Failed to generate share link", e);
        showToast("Error generating link. Proposal might be too large.");
    }
  };

  const handleCopyForWorkspace = () => {
    let workspaceText = `--------------------------------------------------\n`;
    workspaceText += `CATERPRO AI: ${menu.menuTitle.toUpperCase()}\n`;
    workspaceText += `--------------------------------------------------\n\n`;
    workspaceText += `PROPOSAL OVERVIEW:\n${menu.description}\n\n`;

    workspaceText += `MENU SELECTION:\n`;
    workspaceText += `\nAPPETIZERS:\n${menu.appetizers.map(a => `• ${a}`).join('\n')}\n`;
    workspaceText += `\nMAIN COURSES:\n${menu.mainCourses.map(m => `• ${m}`).join('\n')}\n`;
    workspaceText += `\nSIDE DISHES:\n${menu.sideDishes?.map(s => `• ${s}`).join('\n') || 'None'}\n`;
    workspaceText += `\nDESSERT:\n${menu.dessert.map(d => `• ${d}`).join('\n')}\n\n`;

    workspaceText += `LOGISTICS & PREP:\n`;
    // Fix: Using Array.isArray and local variable to safely join dietary notes which might be unknown to compiler in this scope
    const dietaryNotesArr = menu.dietaryNotes as string[] | undefined;
    workspaceText += `\nDIETARY NOTES: ${Array.isArray(dietaryNotesArr) ? dietaryNotesArr.join(', ') : 'None'}\n`;
    workspaceText += `\nMISE EN PLACE:\n${menu.miseEnPlace.map(m => `• ${m}`).join('\n')}\n\n`;
    
    workspaceText += `SHOPPING LIST:\n`;
    const groupedData = menu.shoppingList.reduce((acc, item) => {
        const cat = item.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(`• ${item.item} (${item.quantity}) - Est: ${item.estimatedCost || 'N/A'}`);
        return acc;
    }, {} as Record<string, string[]>);
    
    Object.entries(groupedData).forEach(([cat, items]) => {
        workspaceText += `\n[${cat.toUpperCase()}]\n${items.join('\n')}\n`;
    });

    workspaceText += `\n\nGenerated via CaterPro AI - https://caterpro-ai.web.app/`;

    navigator.clipboard.writeText(workspaceText)
        .then(() => showToast("Structured proposal text copied for Google Docs!"))
        .catch(err => console.error('Failed to copy: ', err));
  };

  const handleCopySection = (title: string, items: any[]) => {
    if (!items || items.length === 0) return;
    let textToCopy: string;
    if (typeof items[0] === 'string') {
       textToCopy = `${title}\n\n${(items as string[]).map(i => `• ${i}`).join('\n')}`;
    } else if ('pairingSuggestion' in items[0]) {
      const pairingItems = items as BeveragePairing[];
      textToCopy = `${title}\n\n${pairingItems.map(p => `• ${p.menuItem}: ${p.pairingSuggestion}`).join('\n')}`;
    } else {
      const shoppingListItems = items as ShoppingListItem[];
      const groupedData = shoppingListItems.reduce((acc, item) => {
        const store = item.store || 'Uncategorized Store';
        const category = item.category || 'Other';
        if (!acc[store]) acc[store] = {};
        if (!acc[store][category]) acc[store][category] = [];
        acc[store][category].push(`• ${item.item} (${item.quantity})`);
        return acc;
      }, {} as Record<string, Record<string, string[]>>);

      textToCopy = `${title}\n\n` + Object.entries(groupedData).map(([store, categories]) => {
        const categoryBlocks = Object.entries(categories).map(([category, catItems]) => {
          return `${category}\n${catItems.join('\n')}`;
        }).join('\n\n');
        return `Store: ${store}\n${'='.repeat(store.length + 6)}\n${categoryBlocks}`;
      }).join('\n\n\n');
    }
    navigator.clipboard.writeText(textToCopy)
        .then(() => showToast(`'${title}' section copied!`))
        .catch(err => console.error('Failed to copy section: ', err));
  };
  
  const isSectionEditable = (key: MenuSection) => {
    return EDITABLE_MENU_SECTIONS.some(section => section.key === key);
  }

  return (
    <div className={`p-4 sm:p-6 theme-container ${t.container}`}>
      <div className="space-y-6">
      
      {!isReadOnlyView && (
      <div className="no-print bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <ClipboardCheck size={20} />
              </div>
              <div>
                  <h4 className="text-sm font-black text-blue-900 dark:text-blue-100">Catering Workspace</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Share with team or export to docs</p>
              </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
                onClick={handleGenerateShareLink}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 text-blue-600 border border-blue-200 dark:border-blue-700 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 hover:bg-blue-50"
            >
                <LinkIcon size={18} /> Share Link
            </button>
            <button 
                onClick={handleCopyForWorkspace}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95"
            >
                <FileText size={18} /> Copy for Docs
            </button>
          </div>
      </div>
      )}

      <div className="flex items-center justify-between border-b border-dashed border-slate-300 dark:border-slate-600 pb-4 mb-2">
         <div className="flex items-center gap-2">
            <ChefHat className={`w-6 h-6 ${t.title}`} />
            <span className={`text-sm font-bold uppercase tracking-wider ${t.description}`}>CaterPro AI Proposal</span>
         </div>
         <span className={`text-xs ${t.description}`}>{new Date().toLocaleDateString()}</span>
      </div>

      {isGeneratingImage && (
        <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
      )}
      {menu.image && !isGeneratingImage && (
         <div className="relative group">
             <img 
               src={`data:image/png;base64,${menu.image}`} 
               alt={menu.menuTitle}
               className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-md border border-slate-200 dark:border-slate-700"
             />
         </div>
      )}
      <h2 className={`text-3xl font-black tracking-tight ${t.title}`}>{menu.menuTitle}</h2>
      <p className={`text-lg leading-relaxed ${t.description} italic`}>{menu.description}</p>
      <hr className={t.hr} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {MENU_SECTIONS.map(({ title, key }, catIdx) => {
          const items = menu[key] || [];
          if (items.length === 0) return null;
          
          if (key === 'beveragePairings' && !canAccessFeature('beveragePairings')) return null;
          if (key === 'recommendedEquipment' && !canAccessFeature('recommendedEquipment')) return null;

          const isWideSection = ['shoppingList', 'recommendedEquipment', 'beveragePairings'].includes(key);
          const sectionClass = isWideSection ? 'lg:col-span-2' : '';

          if (key === 'beveragePairings') {
            const pairingItems = items as BeveragePairing[];
            return (
              <div key={key} className={`${t.sectionContainer} rounded-xl ${sectionClass}`}>
                <div className="flex justify-between items-center p-4 sm:p-6 group">
                  <h3 className={`text-lg font-bold ${t.sectionTitle} flex items-center gap-3`}>
                    <span className={`w-8 h-8 ${t.sectionIcon} rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                      <Wine size={16} />
                    </span>
                    {title}
                  </h3>
                </div>
                <div className="px-4 sm:px-6 pb-6 space-y-3">
                  {pairingItems.map((pairing, itemIdx) => {
                    const checkKey = `${key}-${itemIdx}`;
                    const isChecked = checkedItems.has(checkKey);
                    return (
                      <div key={checkKey} className={`p-4 ${t.card} rounded-lg`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          {!isReadOnlyView && (
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => onToggleItem(checkKey)}
                              className={`mt-1 w-5 h-5 rounded-md focus:ring-2 cursor-pointer ${t.checkbox}`}
                            />
                          )}
                          <div className="flex-1">
                            <h5 className={`font-bold transition-colors ${isChecked ? t.checkedText : t.cardTitle}`}>{pairing.menuItem}</h5>
                            <p className={`text-sm transition-colors mt-1 ${isChecked ? t.checkedText : t.cardText}`}>{pairing.pairingSuggestion}</p>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
          
          if (key === 'shoppingList') {
            const shoppingListItems = (items as ShoppingListItem[]).map((item, index) => ({...item, originalIndex: index}));
            
            const groupedByStoreThenCategory = shoppingListItems.reduce((acc, item) => {
              const store = item.store || 'Uncategorized Store';
              const category = item.category || 'Other';
              if (!acc[store]) acc[store] = {};
              if (!acc[store][category]) acc[store][category] = [];
              acc[store][category].push(item);
              return acc;
            }, {} as Record<string, Record<string, (ShoppingListItem & {originalIndex: number})[]>>);

            return (
               <div key={key} className={`${t.sectionContainer} rounded-xl ${sectionClass}`}>
                <div className="flex justify-between items-center p-4 sm:p-6 group">
                  <h3 className={`text-lg font-bold ${t.sectionTitle} flex items-center gap-3`}>
                    <span className={`w-8 h-8 ${t.sectionIcon} rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                        {catIdx + 1}
                    </span>
                    {title}
                  </h3>
                  {!isReadOnlyView && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                            if (onAttemptAccess('bulkEdit')) {
                              setIsBulkEditMode(!isBulkEditMode);
                              if(isBulkEditMode) onClearBulkSelection();
                            }
                        }}
                        className="action-button"
                      >
                        {isBulkEditMode ? <X size={16} className="mr-1" /> : <Edit size={16} className="mr-1" />}
                        {isBulkEditMode ? 'Done' : 'Bulk Edit'}
                      </button>
                      <button
                          onClick={() => handleCopySection(title, items as ShoppingListItem[])}
                          className="no-print no-copy p-2 rounded-full text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                          <Copy size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="px-4 sm:px-6 pb-6 space-y-4">
                  {Object.entries(groupedByStoreThenCategory).map(([store, categories]) => (
                      <div key={store} className={`${t.card} p-4 rounded-lg`}>
                          <h4 className={`text-lg font-bold ${t.shoppingStoreTitle}`}>{store}</h4>
                          <div className="mt-4 space-y-4">
                              {Object.entries(categories).map(([category, catItems]) => (
                                  <div key={category}>
                                      <h5 className={`text-sm font-bold uppercase tracking-wider ${t.shoppingCategoryTitle} mb-2 border-b pb-1`}>{category}</h5>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-2">
                                          {catItems.map((item) => {
                                              const checkKey = `${key}-${item.originalIndex}`;
                                              const isChecked = checkedItems.has(checkKey);
                                              const isSelectedForBulk = bulkSelectedItems.has(checkKey);
                                              
                                              return (
                                                  <div key={checkKey} className="flex items-center gap-2">
                                                      <div 
                                                          className={`flex-grow flex items-start gap-3 p-2 rounded-lg transition-colors border-2 ${isBulkEditMode ? (isSelectedForBulk ? 'bg-primary-100 dark:bg-primary-900/40 border-primary-300' : 'border-transparent hover:bg-slate-100') : 'border-transparent'}`} 
                                                          onClick={isBulkEditMode ? () => onToggleBulkSelect(checkKey) : undefined}
                                                      >
                                                          {!isBulkEditMode && !isReadOnlyView && (
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => onToggleItem(checkKey)}
                                                                className={`mt-1 w-5 h-5 rounded-md focus:ring-2 cursor-pointer ${t.checkbox}`}
                                                            />
                                                          )}
                                                          <div className="flex-1">
                                                              <div className="flex items-start gap-2">
                                                                  {(!isBulkEditMode && !isReadOnlyView) && <span className="text-primary-600 font-black text-lg leading-none mt-0.5">•</span>}
                                                                  <span className={`font-bold transition-colors ${isChecked && !isBulkEditMode ? t.checkedText : t.uncheckedText}`}>
                                                                      {item.item}
                                                                  </span>
                                                              </div>
                                                              {item.estimatedCost && !isBulkEditMode && (
                                                                  <p className={`text-xs mt-1 pl-4 font-bold text-amber-600 ${isChecked ? 'opacity-50' : ''}`}>Est: {item.estimatedCost}</p>
                                                              )}
                                                          </div>
                                                      </div>
                                                  </div>
                                              );
                                          })}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={key} className={`${t.sectionContainer} rounded-xl ${sectionClass}`}>
              <div className="flex justify-between items-center p-4 sm:p-6 group">
                <h3 className={`text-lg font-bold ${t.sectionTitle} flex items-center gap-3`}>
                  <span className={`w-8 h-8 ${t.sectionIcon} rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                    {catIdx + 1}
                  </span>
                  {title}
                </h3>
                {!isReadOnlyView && (
                <button
                    onClick={() => handleCopySection(title, items as string[])}
                    className="no-print no-copy p-2 rounded-full text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300"
                >
                    <Copy size={16} />
                </button>
                )}
              </div>
              <ul className="px-4 sm:px-6 pb-6 space-y-2">
                {(items as string[]).map((item, index) => {
                  const checkKey = `${key}-${index}`;
                  const isChecked = checkedItems.has(checkKey);
                  return (
                    <li key={checkKey} className={`flex items-start gap-3 p-3 rounded-lg border-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all ${isSectionEditable(key) && isEditable ? 'group/item' : ''}`}>
                      {!isReadOnlyView && (
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleItem(checkKey)}
                          className={`mt-1 w-5 h-5 rounded-md focus:ring-2 cursor-pointer ${t.checkbox}`}
                        />
                      )}
                      <div className="flex-1 flex items-center justify-between gap-4">
                        <span className={`text-sm sm:text-base leading-relaxed font-medium transition-colors ${isChecked ? t.checkedText : t.uncheckedText}`}>
                          {item}
                        </span>
                        {isSectionEditable(key) && isEditable && !isReadOnlyView && (
                           <button 
                             onClick={() => onEditItem(key, index)}
                             className="p-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-lg text-primary-600"
                           >
                             <Pencil size={14} />
                           </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default MenuDisplay;
