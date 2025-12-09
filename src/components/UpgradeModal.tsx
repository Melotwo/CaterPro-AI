import React, { useEffect, useRef } from 'react';
import { X, Star, Lock } from 'lucide-react';
import { SubscriptionPlan } from '../hooks/useAppSubscription';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: SubscriptionPlan) => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements.length - 1];
      
      setTimeout(() => firstElement?.focus(), 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'Tab' && firstElement && lastElement) {
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
  
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="upgrade-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 transition-all animate-[scale-up_0.2s_ease-out] text-center p-8">
        <button onClick={onClose} className="absolute top-2 right-2 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
          <Lock className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
        </div>
        
        <h3 id="upgrade-modal-title" className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Upgrade to Unlock</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400">This is a premium feature. Upgrade your plan to gain access and streamline your workflow.</p>
        
        <div className="mt-6 space-y-4">
          <button 
            onClick={() => onUpgrade('pro')}
            className="w-full relative flex items-center justify-center rounded-lg border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/40 p-4 text-left hover:bg-primary-100 dark:hover:bg-primary-900/60"
          >
            <div className="absolute top-2 right-2 rounded-full bg-primary-500 px-3 py-1 text-xs font-bold text-white">
                Best Value
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-primary-800 dark:text-primary-200">
                <Star className="inline-block w-4 h-4 mr-1 text-amber-500" />
                Go Pro
              </p>
              <p className="text-sm text-primary-700 dark:text-primary-300">Unlock all features, including sharing and local chef finder.</p>
            </div>
          </button>
          
          <button 
            onClick={() => onUpgrade('premium')}
            className="w-full flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            <div className="flex-grow">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Go Premium
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Unlimited generations, save menus, and more.</p>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpgradeModal;
