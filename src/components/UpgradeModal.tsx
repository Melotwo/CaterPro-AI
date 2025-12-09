import React, { useEffect, useRef } from 'react';
import { X, Star, Briefcase, Check } from 'lucide-react';
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
      <div ref={modalRef} className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-all animate-[scale-up_0.2s_ease-out] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-purple-600"></div>
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 z-10" aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="p-8 text-center border-b border-slate-100 dark:border-slate-700">
             <h3 id="upgrade-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">Unlock Full Potential</h3>
             <p className="mt-2 text-slate-600 dark:text-slate-400">Choose the plan that fits your growth.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
            {/* Professional Plan */}
            <div className="p-6 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-600 dark:text-amber-400">
                        <Star size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">Professional</h4>
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">$19 / month</p>
                    </div>
                </div>
                <ul className="space-y-3 mb-6">
                    <li className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span><strong>AI Food Photography</strong> (Michelin Style)</span>
                    </li>
                    <li className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span>Save up to 10 Menus</span>
                    </li>
                    <li className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span>AI Chat Consultant</span>
                    </li>
                </ul>
                <button 
                    onClick={() => onUpgrade('professional')}
                    className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm transition-all hover:shadow-md"
                >
                    Upgrade to Professional
                </button>
            </div>

            {/* Business Plan */}
            <div className="p-6 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold px-2 py-1 rounded-full">
                    BEST VALUE
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 dark:text-purple-400">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">Business</h4>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">$29 / month</p>
                    </div>
                </div>
                <ul className="space-y-3 mb-6">
                    <li className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span><strong>Unlimited</strong> Saved Menus</span>
                    </li>
                    <li className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span>Shareable Client Links</span>
                    </li>
                    <li className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span>Find Local Suppliers</span>
                    </li>
                </ul>
                <button 
                    onClick={() => onUpgrade('business')}
                    className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm transition-all hover:shadow-md"
                >
                    Upgrade to Business
                </button>
            </div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 text-center">
             <button onClick={() => onUpgrade('starter')} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline">
                 Just need to remove watermarks? Get Starter for $9/mo
             </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
