import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { MenuSection } from '../types';
import { regenerateMenuItemFromApi } from '../services/geminiService';
import { getApiErrorState } from '../services/errorHandler';
import { ErrorState } from '../types';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit: { section: MenuSection; index: number; text: string } | null;
  onSave: (section: MenuSection, index: number, newText: string) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
  onSave,
}) => {
  const [editedText, setEditedText] = useState('');
  const [regenPrompt, setRegenPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && itemToEdit) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      setEditedText(itemToEdit.text);
      setRegenPrompt('');
      setError(null);
      
      setTimeout(() => modalRef.current?.querySelector('textarea')?.focus(), 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        triggerElementRef.current?.focus();
      };

    }
  }, [isOpen, itemToEdit, onClose]);

  if (!isOpen || !itemToEdit) return null;

  const handleRegenerate = async () => {
    if (!regenPrompt.trim()) return;
    setIsRegenerating(true);
    setError(null);
    try {
      const newItemText = await regenerateMenuItemFromApi(itemToEdit.text, regenPrompt);
      setEditedText(newItemText);
    } catch (e) {
      setError(getApiErrorState(e));
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = () => {
    onSave(itemToEdit.section, itemToEdit.index, editedText);
  };
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customization-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 transition-all animate-[scale-up_0.2s_ease-out]"
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 id="customization-modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            Customize Item
          </h3>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="item-text" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Menu Item Text
            </label>
            <textarea
              id="item-text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <label htmlFor="regen-prompt" className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
              <Sparkles className="w-4 h-4 mr-2 text-primary-500" />
              Regenerate with AI (Optional)
            </label>
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">e.g., "make it gluten-free", "add a spicy kick", "change chicken to salmon"</p>
            <div className="flex gap-2">
              <input
                id="regen-prompt"
                type="text"
                value={regenPrompt}
                onChange={(e) => setRegenPrompt(e.target.value)}
                placeholder="Enter instruction..."
                className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating || !regenPrompt.trim()}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isRegenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Regenerate
              </button>
            </div>
             {error && (
              <div role="alert" className="mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mr-2" />
                  <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200">{error.title}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-md shadow-sm hover:bg-primary-600"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
