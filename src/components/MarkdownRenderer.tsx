import React from 'react';
import { Menu, MenuSection } from '../types.ts';
import { Pencil } from 'lucide-react';
import { MENU_SECTIONS } from '../constants.ts';

interface MarkdownRendererProps {
  menu: Menu;
  checkedItems: Set<string>;
  onToggleItem: (key: string) => void;
  isEditable: boolean;
  onEditItem: (section: MenuSection, index: number) => void;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ menu, checkedItems, onToggleItem, isEditable, onEditItem }) => {

  if (!menu) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{menu.menuTitle}</h2>
      <p className="text-slate-600 dark:text-slate-400 italic">{menu.description}</p>
      <hr className="border-slate-200 dark:border-slate-700" />
      
      {MENU_SECTIONS.map(({ title, key }, catIdx) => {
        const items = menu[key] || [];
        if (items.length === 0) return null;
        
        return (
            <div key={key} className="border-2 border-slate-100 dark:border-slate-800 p-4 sm:p-6 rounded-xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                 <span className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                     {catIdx + 1}
                 </span>
                {title}
              </h3>
              <div className="space-y-2">
                {items.map((item, itemIdx) => {
                  const checkKey = `${key}-${itemIdx}`;
                  const isChecked = checkedItems.has(checkKey);
                  return (
                    <div key={checkKey} className="flex items-start gap-3 group">
                        <label className="flex-grow flex items-start gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-colors border-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => onToggleItem(checkKey)}
                                className="mt-1 w-5 h-5 text-amber-500 rounded-md border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-amber-400 cursor-pointer bg-white dark:bg-slate-900"
                            />
                            <span className={`flex-1 transition-colors ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                {item}
                            </span>
                        </label>
                         {isEditable && (
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
    </div>
  );
};

export default MarkdownRenderer;
