import React, { useState, useEffect, useRef } from 'react';
import { X, Bookmark, Eye, Trash2, ArrowLeft } from 'lucide-react';
import { SavedMenu } from '../types';
import MenuDisplay from './MenuDisplay';

const SavedChecklistsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  savedMenus: SavedMenu[];
  onDelete: (id: number) => void;
}> = ({ isOpen, onClose, savedMenus, onDelete }) => {
  const [viewingMenu, setViewingMenu] = useState<SavedMenu | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      setTimeout(() => firstElement.focus(), 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        triggerElementRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setViewingMenu(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setCheckedItems(new Set());
  }, [viewingMenu]);

  if (!isOpen) return null;

  const toggleItem = (key: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(key)) {
      newChecked.delete(key);
    } else {
      newChecked.add(key);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="saved-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 transition-all animate-[scale-up_0.2s_ease-out] flex flex-col" style={{maxHeight: '85vh'}}>
        <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 id="saved-modal-title" className="text-lg font-semibold text-slate-900 dark:text-white truncate pr-4">
            {viewingMenu ? viewingMenu.title : 'Saved Menus'}
          </h3>
          {viewingMenu && (
            <button onClick={() => setViewingMenu(null)} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline flex-shrink-0">
              <ArrowLeft size={16} className="mr-1"/>
              Back to List
            </button>
          )}
          <button onClick={onClose} className="p-2 -ml-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {viewingMenu ? (
             <MenuDisplay 
                menu={viewingMenu.content} 
                checkedItems={checkedItems} 
                onToggleItem={toggleItem} 
                isEditable={false} 
                onEditItem={() => {}} // No-op for read-only view
                showToast={() => {}} // No-op for toast
                isGeneratingImage={false}
                onUpdateShoppingItemQuantity={() => {}} // No-op for read-only view
                bulkSelectedItems={new Set<string>()}
                onToggleBulkSelect={() => {}}
                onBulkCheck={() => {}}
                onBulkUpdateQuantity={() => {}}
                onClearBulkSelection={() => {}}
                onSelectAllShoppingListItems={() => {}}
                proposalTheme={viewingMenu.content.theme || 'classic'}
                canAccessFeature={() => true}
                onAttemptAccess={() => true}
                isReadOnlyView={true}
                deliveryRadius=""
                onDeliveryRadiusChange={() => {}}
                onCalculateFee={() => {}}
                calculatedFee={null}
              />
          ) : (
            <div className="p-6">
            {savedMenus.length > 0 ? (
              <ul className="space-y-3">
                {savedMenus.map((menu) => (
                  <li key={menu.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{menu.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Saved: {menu.savedAt}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setViewingMenu(menu)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label={`View ${menu.title}`}>
                            <Eye size={18} />
                        </button>
                        <button onClick={() => onDelete(menu.id)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400" aria-label={`Delete ${menu.title}`}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Bookmark className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                <h4 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">No Saved Menus Yet</h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Generate a menu and click the save icon to keep it here.</p>
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedChecklistsModal;
