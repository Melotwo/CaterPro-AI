
import React, { useEffect, useRef, useState } from 'react';
import { X, Star, Briefcase, Check, Gift } from 'lucide-react';
import { SubscriptionPlan } from '../hooks/useAppSubscription';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: SubscriptionPlan) => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShowPromo(false);
      setPromoCode('');
      setPromoError('');
    }
  }, [isOpen]);
  
  const handleApplyPromo = () => {
      const code = promoCode.trim().toUpperCase();
      // Special Founder & Admin Codes
      if (['MELOTWO-FOUNDER', 'VIP', 'ADMIN', 'SISTER-ACCESS'].includes(code)) {
          onUpgrade('business');
          setPromoCode('');
          setShowPromo(false);
          onClose();
      } else {
          setPromoError('Invalid code');
      }
  };

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-all animate-[scale-up_0.2s_ease-out] overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 z-10">
          <X size={20} />
        </button>

        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50">
             <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Upgrade Your Kitchen</h3>
             <p className="mt-1 text-slate-500 text-sm">Join the pro chefs using AI to grow their business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                    <Star className="text-amber-500" />
                    <h4 className="font-black text-lg">Professional</h4>
                </div>
                <ul className="space-y-3 mb-8">
                    {['AI Food Photos', 'Save 10 Menus', 'AI Consultant'].map(f => (
                        <li key={f} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Check size={16} className="text-green-500" /> {f}
                        </li>
                    ))}
                </ul>
                <button 
                    onClick={() => { window.location.href='/#pricing'; onClose(); }}
                    className="w-full py-3 rounded-2xl bg-amber-500 text-white font-black text-sm shadow-lg shadow-amber-500/20"
                >
                    View Pricing
                </button>
            </div>

            <div className="p-8 bg-primary-50/20 dark:bg-primary-900/10">
                <div className="flex items-center gap-3 mb-6">
                    <Briefcase className="text-primary-600" />
                    <h4 className="font-black text-lg">Business</h4>
                </div>
                <ul className="space-y-3 mb-8">
                    {['Unlimited Storage', 'Suppliers Hub', 'Pro Tools'].map(f => (
                        <li key={f} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Check size={16} className="text-green-500" /> {f}
                        </li>
                    ))}
                </ul>
                <button 
                    onClick={() => { window.location.href='/#pricing'; onClose(); }}
                    className="w-full py-3 rounded-2xl bg-primary-600 text-white font-black text-sm shadow-lg shadow-primary-500/20"
                >
                    Get Business
                </button>
            </div>
        </div>
        
        <div className="p-6 bg-slate-50 dark:bg-slate-900 flex flex-col items-center gap-4">
             {!showPromo ? (
                <button onClick={() => setShowPromo(true)} className="flex items-center gap-2 text-xs font-bold text-primary-600 hover:underline">
                    <Gift size={14} /> Redem Access Code
                </button>
             ) : (
                 <div className="w-full max-w-xs flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Founder/Promo Code" 
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                        className={`w-full px-4 py-2 text-xs border-2 rounded-xl bg-white dark:bg-slate-800 ${promoError ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                    <button onClick={handleApplyPromo} className="px-4 py-2 text-xs font-black bg-slate-900 text-white rounded-xl">Apply</button>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
