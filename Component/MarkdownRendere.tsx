import React, { useState } from 'react';
import { Menu, MenuSection, ShoppingListItem, RecommendedEquipment, BeveragePairing } from '../types.ts';
import { Pencil, Copy, Edit, CheckSquare, ListTodo, X, ShoppingCart, Wine, Calculator } from 'lucide-react';
import { MENU_SECTIONS, EDITABLE_MENU_SECTIONS, PROPOSAL_THEMES } from '../constants.ts';

interface MarkdownRendererProps {
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
}

const getAffiliateLink = (keywords: string) => {
    return `https://www.takealot.com/all?qsearch=${encodeURIComponent(keywords)}`;
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
    menu, checkedItems, onToggleItem, isEditable, onEditItem, showToast, 
    isGeneratingImage, onUpdateShoppingItemQuantity, bulkSelectedItems, onToggleBulkSelect,
    onBulkCheck, onBulkUpdateQuantity, onClearBulkSelection, onSelectAllShoppingListItems,
    proposalTheme, canAccessFeature, onAttemptAccess, isReadOnlyView = false,
    deliveryRadius, onDeliveryRadiusChange, onCalculateFee, calculatedFee
}) => {
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState('');
  
  const theme = PROPOSAL_THEMES[proposalTheme as keyof typeof PROPOSAL_THEMES] || PROPOSAL_THEMES.classic;
  const t = theme.classes;

  if (!menu) return null;

  const handleCopySection = (title: string, items: any[]) => {
    if (!items || items.length === 0) return;

    let textToCopy: string;

    if (typeof items[0] === 'string') {
       textToCopy = `${title}\n\n${(items as string[]).join('\n')}`;
    } else if ('pairingSuggestion' in items[0]) {
      const pairingItems = items as BeveragePairing[];
      textToCopy = `${title}\n\n${pairingItems.map(p => `- ${p.menuItem}: ${p.pairingSuggestion}`).join('\n')}`;
    } else {
      const shoppingListItems = items as ShoppingListItem[];
      const groupedData = shoppingListItems.reduce((acc, item) => {
        const store = item.store || 'Uncategorized Store';
        const category = item.category || 'Other';
        if (!acc[store]) acc[store] = {};
        if (!acc[store][category]) acc[store][category] = [];
        acc[store][category].push(`- ${item.item} (${item.quantity})`);
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
  
  const handleApplyBulkQuantity = () => {
    if (bulkQuantity.trim()) {
        onBulkUpdateQuantity(bulkQuantity.trim());
        setBulkQuantity('');
    }
  };

  return (
    <div className={`p-4 sm:p-6 theme-container ${t.container}`}>
      <div className="space-y-6">
      {isGeneratingImage && (
        <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
      )}
      {menu.image && !isGeneratingImage && (
         <img 
           src={`data:image/png;base64,${menu.image}`} 
           alt={menu.menuTitle}
           className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-md border border-slate-200 dark:border-slate-700"
         />
      )}
      <h2 className={`text-2xl font-bold ${t.title}`}>{menu.menuTitle}</h2>
      <p className={`${t.description} italic`}>{menu.description}</p>
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
                  <button
                      onClick={() => handleCopySection(title, items)}
                      className="no-print no-copy p-2 rounded-full text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300"
                      aria-label={`Copy ${title} section`}
                  >
                      <Copy size={16} />
                  </button>
                </div>
                <div className="px-4 sm:px-6 pb-6 space-y-3">
                  {pairingItems.map((pairing, itemIdx) => {
                    const checkKey = `${key}-${itemIdx}`;
                    const isChecked = checkedItems.has(checkKey);
                    return (
                      <div key={checkKey} className={`p-4 ${t.card} rounded-lg`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggleItem(checkKey)}
                            className={`mt-1 w-5 h-5 rounded-md focus:ring-2 cursor-pointer ${t.checkbox}`}
                          />
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

              if (!acc[store]) {
                acc[store] = {};
              }
              if (!acc[store][category]) {
                acc[store][category] = [];
              }
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                          if (onAttemptAccess('bulkEdit')) {
                            setIsBulkEditMode(!isBulkEditMode);
                            if(isBulkEditMode) {
                                onClearBulkSelection();
                            }
                          }
                      }}
                      className="action-button"
                      aria-label={isBulkEditMode ? "Finish bulk editing" : "Start bulk editing"}
                    >
                      {isBulkEditMode ? <X size={16} className="mr-1" /> : <Edit size={16} className="mr-1" />}
                      {isBulkEditMode ? 'Done' : 'Bulk Edit'}
                    </button>
                    <button
                        onClick={() => handleCopySection(title, items as ShoppingListItem[])}
                        className="no-print no-copy p-2 rounded-full text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300"
                        aria-label={`Copy ${title} section`}
                    >
                        <Copy size={16} />
                    </button>
                  </div>
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
                                              
                                              const itemContainerClasses = `flex-grow flex items-start gap-3 p-2 rounded-lg transition-colors border-2 ${
                                                  isBulkEditMode 
                                                  ? `cursor-pointer ${isSelectedForBulk ? 'bg-primary-100 dark:bg-primary-900/40 border-primary-300 dark:border-primary-700' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}` 
                                                  : 'border-transparent'
                                              }`;

                                              return (
                                                  <div key={checkKey} className="flex items-center gap-2">
                                                      <div 
                                                          className={itemContainerClasses} 
                                                          onClick={isBulkEditMode ? () => onToggleBulkSelect(checkKey) : undefined}
                                                          role={isBulkEditMode ? 'checkbox' : undefined}
                                                          aria-checked={isBulkEditMode ? isSelectedForBulk : undefined}
                                                          tabIndex={isBulkEditMode ? 0 : -1}
                                                          onKeyDown={isBulkEditMode ? (e) => (e.key === ' ' || e.key === 'Enter') && onToggleBulkSelect(checkKey) : undefined}
                                                      >
                                                          {!isBulkEditMode && (
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => onToggleItem(checkKey)}
                                                                className={`mt-1 w-5 h-5 rounded-md focus:ring-2 cursor-pointer ${t.checkbox}`}
                                                                aria-label={`Mark ${item.item} as purchased`}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                          )}
                                                          {isBulkEditMode && (
                                                              <div className={`mt-1 w-5 h-5 flex-shrink-0 border-2 rounded-md flex items-center justify-center transition-all ${isSelectedForBulk ? 'bg-primary-500 border-primary-500' : 'bg-white dark:bg-slate-800 border-slate-400'}`}>
                                                                  {isSelectedForBulk && <CheckSquare className="w-4 h-4 text-white" />}
                                                              </div>
                                                          )}
                                                          <div className="flex-1">
                                                              <span className={`transition-colors ${isChecked && !isBulkEditMode ? t.checkedText : t.uncheckedText}`}>
                                                                  {item.item}
                                                              </span>
                                                              {(item.brandSuggestion || item.estimatedCost) && !isBulkEditMode && (
                                                                  <div className={`mt-1.5 pl-1 text-xs space-y-1 transition-colors ${isChecked ? 'opacity-70' : ''} ${t.cardText}`}>
                                                                      {item.estimatedCost && (
                                                                          <p><strong className={`font-semibold ${t.cardTitle}`}>Est. Cost:</strong> {item.estimatedCost}</p>
                                                                      )}
                                                                      {item.brandSuggestion && (
                                                                          <p><strong className={`font-semibold ${t.cardTitle}`}>Brands:</strong> {item.brandSuggestion}</p>
                                                                      )}
                                                                  </div>
                                                              )}
                                                              {item.description && !isBulkEditMode && (
                                                                  <p className={`text-xs mt-1.5 italic pl-1 transition-colors ${isChecked ? 'opacity-70' : ''} ${t.cardText}`}>
                                                                  {item.description}
                                                                  </p>
                                                              )}
                                                              {isEditable ? (
                                                                  <input
                                                                      type="text"
                                                                      value={item.quantity}
                                                                      onChange={(e) => onUpdateShoppingItemQuantity(item.originalIndex, e.target.value)}
                                                                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                                                                      className={`block text-xs mt-1 w-full max-w-[10rem] p-1 rounded-md bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 focus:ring-0 focus:outline-none transition-colors ${isChecked ? 'opacity-70' : ''} ${t.cardText}`}
                                                                      aria-label={`Quantity for ${item.item}`}
                                                                  />
                                                              ) : (
                                                                  <span className={`block text-xs transition-colors ${isChecked ? 'opacity-70' : ''} ${t.cardText}`}>
                                                                      {item.quantity}
                                                                  </span>
                                                              )}
                                                          </div>
                                                      </div>
                                                      {!isBulkEditMode && (
                                                          <a
                                                              href={getAffiliateLink(item.affiliateSearchTerm || item.item)}
                                                              target="_blank"
                                                              rel="noopener noreferrer sponsored"
                                                              onClick={(e) => e.stopPropagation()}
                                                              className="no-copy p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex-shrink-0"
                                                              aria-label={`Shop for ${item.item}`}
                                                          >
                                                              <ShoppingCart size={16} />
                                                          </a>
                                                      )}
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
                {isBulkEditMode && (
                  <div className="sticky bottom-0 mt-4 p-3 bg-primary-50 dark:bg-slate-950 border-t-2 border-slate-200 dark:border-slate-700 rounded-b-xl animate-toast-in">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <p className="font-semibold text-sm text-primary-800 dark:text-primary-200">
                              {bulkSelectedItems.size} item(s) selected
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                              <button onClick={onSelectAllShoppingListItems} className="action-button text-xs !px-2 !py-1">Select All</button>
                              <button onClick={onClearBulkSelection} className="action-button text-xs !px-2 !py-1">Clear</button>
                          </div>
                      </div>
                       <div className="mt-3 pt-3 border-t border-primary-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                              type="text"
                              placeholder="Set quantity..."
                              value={bulkQuantity}
                              onChange={(e) => setBulkQuantity(e.target.value)}
                              className="w-full sm:w-auto flex-grow px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                              aria-label="Set quantity for selected items"
                          />
                          <button onClick={handleApplyBulkQuantity} className="action-button">Apply Qty</button>
                          <button onClick={onBulkCheck} className="action-button flex-shrink-0">
                              <CheckSquare size={16} className="mr-1.5" /> Mark Purchased
                          </button>
                       </div>
                  </div>
                )}
              </div>
            )
          }

          if (key === 'recommendedEquipment') {
            const equipmentItems = items as RecommendedEquipment[];
            return (
              <div key={key} className={`${t.sectionContainer} p-4 sm:p-6 rounded-xl ${sectionClass}`}>
                <div className="flex justify-between items-center mb-4 group">
                  <h3 className={`text-lg font-bold ${t.sectionTitle} flex items-center gap-3`}>
                    <span className={`w-8 h-8 ${t.sectionIcon} rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                        {catIdx + 1}
                    </span>
                    {title}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {equipmentItems.map((item, itemIdx) => (
                    <div key={itemIdx} className={`p-4 ${t.card} rounded-lg`}>
                      <div className="flex justify-between items-start gap-4">
                        <h5 className={`font-bold ${t.cardTitle}`}>{item.item}</h5>
                        <a
                          href={getAffiliateLink(item.item)}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="flex-shrink-0 inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-full shadow-sm transition-colors"
                          aria-label={`Shop for ${item.item}`}
                        >
                          <ShoppingCart size={14} className="mr-1.5" />
                          Shop Now
                        </a>
                      </div>
                      <p className={`text-sm ${t.cardText} mt-2`}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          return (
              <div key={key} className={`${t.sectionContainer} p-4 sm:p-6 rounded-xl ${sectionClass}`}>
                <div className="flex justify-between items-center mb-4 group">
                  <h3 className={`text-lg font-bold ${t.sectionTitle} flex items-center gap-3`}>
                    <span className={`w-8 h-8 ${t.sectionIcon} rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                        {key === 'miseEnPlace' ? <ListTodo size={16} /> : (catIdx + 1)}
                    </span>
                    {title}
                  </h3>
                  <button
                      onClick={() => handleCopySection(title, items as string[])}
                      className="no-print no-copy p-2 rounded-full text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300"
                      aria-label={`Copy ${title} section`}
                  >
                      <Copy size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {(items as string[]).map((item, itemIdx) => {
                    const checkKey = `${key}-${itemIdx}`;
                    const isChecked = checkedItems.has(checkKey);
                    return (
                      <div key={checkKey} className="flex items-start gap-3 group">
                          <label className="flex-grow flex items-start gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-colors border-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => onToggleItem(checkKey)}
                                  className={`mt-1 w-5 h-5 rounded-md focus:ring-2 cursor-pointer ${t.checkbox}`}
                              />
                              <span className={`flex-1 transition-colors ${isChecked ? t.checkedText : t.uncheckedText}`}>
                                  {item}
                              </span>
                          </label>
                           {isEditable && isSectionEditable(key) && (
                              <button
                                  onClick={() => onEditItem(key, itemIdx)}
                                  className="edit-btn no-copy mt-2 p-2 rounded-full text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300"
                                  aria-label={`Edit ${item}`}
                              >
                                  <Pencil size={16} />
                              </button>
                          )}
                      </div>
                    );
                  })}
                </div>
                 {!isReadOnlyView && key === 'deliveryLogistics' && menu.deliveryFeeStructure && (
                    <div className="mt-4 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                        <h4 className={`font-bold ${t.cardTitle} flex items-center gap-2`}><Calculator size={16} /> Delivery Fee Calculator</h4>
                        <p className={`text-xs mt-1 mb-3 ${t.cardText}`}>
                            Enter the delivery distance to estimate the fee.
                            (Base: {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: menu.deliveryFeeStructure.currency }).format(menu.deliveryFeeStructure.baseFee)} + {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: menu.deliveryFeeStructure.currency }).format(menu.deliveryFeeStructure.perUnitRate)}/{menu.deliveryFeeStructure.unit})
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                                type="number"
                                value={deliveryRadius}
                                onChange={(e) => onDeliveryRadiusChange(e.target.value)}
                                placeholder={`Distance in ${menu.deliveryFeeStructure.unit}s`}
                                className="flex-grow px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                aria-label={`Distance in ${menu.deliveryFeeStructure.unit}s`}
                            />
                            <button onClick={onCalculateFee} className="action-button flex-shrink-0">Calculate Fee</button>
                        </div>
                        {calculatedFee && (
                            <p className="mt-3 font-bold text-lg text-primary-600 dark:text-primary-400 animate-slide-in" style={{animationDuration: '0.3s'}}>
                                Estimated Fee: <span className="p-2 bg-primary-50 dark:bg-primary-900/50 rounded-md">{calculatedFee}</span>
                            </p>
                        )}
                    </div>
                 )}
              </div>
          )
        })}
      </div>
      
      {menu.groundingChunks && menu.groundingChunks.length > 0 && (
        <div className="mt-8 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
          <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Sourcing & Location Information
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {menu.groundingChunks.map((chunk, index) => {
              const source = chunk.maps || chunk.web;
              if (!source || !source.uri) return null;
              return (
                <li key={index}>
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className={t.sourcingLink}>
                    {source.title || source.uri}
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Powered by Google Maps and Search for relevant, local results.
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default MarkdownRenderer;
