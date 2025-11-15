import React, { useState } from 'react';
import { Menu, MenuSection, ShoppingListItem, RecommendedEquipment } from '../types.ts';
import { Pencil, Copy, Edit, CheckSquare, ListTodo, X, ShoppingCart } from 'lucide-react';
import { MENU_SECTIONS, EDITABLE_MENU_SECTIONS } from '../constants.ts';

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
}

// Updated to target a major South African retailer and be more generic.
const getAffiliateLink = (keywords: string) => {
    // This now points to Takealot. In a real-world scenario, you would integrate
    // with an affiliate program (e.g., OfferForge for Takealot) to generate
    // a trackable link here, potentially including a placeholder for your affiliate tag.
    return `https://www.takealot.com/all?qsearch=${encodeURIComponent(keywords)}`;
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
    menu, checkedItems, onToggleItem, isEditable, onEditItem, showToast, 
    isGeneratingImage, onUpdateShoppingItemQuantity, bulkSelectedItems, onToggleBulkSelect,
    onBulkCheck, onBulkUpdateQuantity, onClearBulkSelection, onSelectAllShoppingListItems
}) => {
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState('');

  if (!menu) return null;

  const handleCopySection = (title: string, items: string[] | ShoppingListItem[]) => {
    if (!items || items.length === 0) return;

    let textToCopy: string;

    if (typeof items[0] === 'string') {
       textToCopy = `${title}\n\n${(items as string[]).join('\n')}`;
    } else {
      const shoppingListItems = items as ShoppingListItem[];
      // Group by store, then by category for the text version
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
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{menu.menuTitle}</h2>
      <p className="text-slate-600 dark:text-slate-400 italic">{menu.description}</p>
      <hr className="border-slate-200 dark:border-slate-700" />
      
      {MENU_SECTIONS.map(({ title, key }, catIdx) => {
        const items = menu[key] || [];
        if (items.length === 0) return null;
        
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
             <div key={key} className="border-2 border-slate-100 dark:border-slate-800 rounded-xl">
              <div className="flex justify-between items-center p-4 sm:p-6 group">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="w-8 h-8 bg-primary-500 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {catIdx + 1}
                  </span>
                  {title}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                        setIsBulkEditMode(!isBulkEditMode);
                        if(isBulkEditMode) {
                            onClearBulkSelection();
                        }
                    }}
                    className="action-button"
                    aria-label={isBulkEditMode ? "Finish bulk editing" : "Start bulk editing"}
                  >
                    {isBulkEditMode ? <X size={16} className="mr-1" /> : <Edit size={16} className="mr-1" />}
                    {isBulkEditMode ? 'Done' : 'Bulk Edit'}
                  </button>
                  <button
                      // FIX: Cast `items` to `ShoppingListItem[]` to satisfy the `handleCopySection` function's parameter type.
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
                    <div key={store} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">{store}</h4>
                        <div className="mt-4 space-y-4">
                            {Object.entries(categories).map(([category, catItems]) => (
                                <div key={category}>
                                    <h5 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">{category}</h5>
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
                                                              className="mt-1 w-5 h-5 text-primary-500 rounded-md border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-400 cursor-pointer bg-white dark:bg-slate-900"
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
                                                            <span className={`transition-colors ${isChecked && !isBulkEditMode ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                                                {item.item}
                                                            </span>
                                                            {/* Affiliate marketing enhancement: display item description if available */}
                                                            {item.description && !isBulkEditMode && (
                                                                <p className={`text-xs mt-0.5 italic pl-1 transition-colors ${isChecked ? 'text-slate-400/80 dark:text-slate-500/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                                                {item.description}
                                                                </p>
                                                            )}
                                                            {isEditable ? (
                                                                <input
                                                                    type="text"
                                                                    value={item.quantity}
                                                                    onChange={(e) => onUpdateShoppingItemQuantity(item.originalIndex, e.target.value)}
                                                                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                                                                    className={`block text-xs mt-1 w-full max-w-[10rem] p-1 rounded-md bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 focus:ring-0 focus:outline-none transition-colors ${isChecked ? 'text-slate-400/80 dark:text-slate-500/80' : 'text-slate-600 dark:text-slate-300'}`}
                                                                    aria-label={`Quantity for ${item.item}`}
                                                                />
                                                            ) : (
                                                                <span className={`block text-xs transition-colors ${isChecked ? 'text-slate-400/80 dark:text-slate-500/80' : 'text-slate-500 dark:text-slate-400'}`}>
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
            <div key={key} className="border-2 border-slate-100 dark:border-slate-800 p-4 sm:p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4 group">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="w-8 h-8 bg-primary-500 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {catIdx + 1}
                  </span>
                  {title}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {equipmentItems.map((item, itemIdx) => (
                  <div key={itemIdx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start gap-4">
                      <h5 className="font-bold text-slate-800 dark:text-slate-200">{item.item}</h5>
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
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        return (
            <div key={key} className="border-2 border-slate-100 dark:border-slate-800 p-4 sm:p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4 group">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="w-8 h-8 bg-primary-500 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {catIdx + 1}
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
                                className="mt-1 w-5 h-5 text-primary-500 rounded-md border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-400 cursor-pointer bg-white dark:bg-slate-900"
                            />
                            <span className={`flex-1 transition-colors ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
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
            </div>
        )
      })}
      
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
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
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
  );
};

export default MarkdownRenderer;
