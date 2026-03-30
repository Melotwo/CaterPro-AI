
import React, { useEffect, useRef, useState } from 'react';
import { SubscriptionPlan } from './App';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: SubscriptionPlan) => void;
  onViewPricing: () => void;
  whopLinks?: {
    commis: string;
    chefDePartie: string;
    sousChef: string;
    executive: string;
  };
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, onViewPricing, whopLinks }) => {
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
      const validCodes = ['CHEF2026', 'MELOTWO-FOUNDER', 'ADMIN-CHEF-2025', 'CATERPRO-VIP', 'SISTER-ACCESS', 'TVET-2026'];
      
      if (validCodes.includes(code)) {
          onUpgrade('executive');
          setPromoCode('');
          setShowPromo(false);
          onClose();
      } else {
          setPromoError('Invalid access code');
      }
  };

  const handleUpgradeClick = (plan: SubscriptionPlan, link?: string) => {
    if (link) {
        const win = window.open(link, '_blank');
        if (win) win.focus();
    }
    onUpgrade(plan);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/80 animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-all animate-[scale-up_0.2s_ease-out] overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 z-10">
          <span className="text-xl">✕</span>
        </button>

        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
             <div className="flex items-center justify-center gap-2 mb-3">
                 <span className="text-amber-500 animate-pulse">✨</span>
                 <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">7-Day Free Trial Available</span>
             </div>
             <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Upgrade Your Kitchen</h3>
             <p className="mt-1 text-slate-500 text-sm">Join the pro chefs and students using AI to grow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-slate-500 text-xl">🎓</span>
                    <h4 className="font-black text-base">Commis</h4>
                </div>
                <ul className="space-y-2 mb-6">
                    {['Academic PoE', 'Curriculum Map', 'Trial Included'].map(f => (
                        <li key={f} className="flex gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                            <span className="text-green-500">✅</span> {f}
                        </li>
                    ))}
                </ul>
                <button 
                    onClick={() => handleUpgradeClick('commis', whopLinks?.commis)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest"
                >
                    Start Your Journey
                </button>
            </div>

            <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-700 bg-amber-50/20 dark:bg-amber-900/10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-amber-500 text-xl">⚡</span>
                    <h4 className="font-black text-base">Chef de Partie</h4>
                </div>
                <ul className="space-y-2 mb-6">
                    {['Costing Engine', 'Shopping Lists', 'Trial Included'].map(f => (
                        <li key={f} className="flex gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                            <span className="text-green-500">✅</span> {f}
                        </li>
                    ))}
                </ul>
                <button 
                    onClick={() => handleUpgradeClick('chef-de-partie', whopLinks?.chefDePartie)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20"
                >
                    Upgrade Now
                </button>
            </div>

            <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-700 bg-blue-50/20 dark:bg-blue-900/10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-blue-500 text-xl">👥</span>
                    <h4 className="font-black text-base">Sous Chef</h4>
                </div>
                <ul className="space-y-2 mb-6">
                    {['Multi-user (3)', 'Cloud Storage', 'Trial Included'].map(f => (
                        <li key={f} className="flex gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                            <span className="text-green-500">✅</span> {f}
                        </li>
                    ))}
                </ul>
                <button 
                    onClick={() => handleUpgradeClick('sous-chef', whopLinks?.sousChef)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20"
                >
                    Upgrade Now
                </button>
            </div>

            <div className="p-6 bg-primary-50/20 dark:bg-primary-900/10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-primary-600 text-xl">💼</span>
                    <h4 className="font-black text-base">Executive</h4>
                </div>
                <ul className="space-y-2 mb-6">
                    {['Viral Video Creator', 'Unlimited Access', 'Trial Included'].map(f => (
                        <li key={f} className="flex gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                            <span className="text-green-500">✅</span> {f}
                        </li>
                    ))}
                </ul>
                <button 
                    onClick={() => handleUpgradeClick('executive', whopLinks?.executive)}
                    className="w-full py-2.5 rounded-xl bg-primary-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20"
                >
                    Upgrade Now
                </button>
            </div>
        </div>
        
        <div className="p-6 bg-slate-50 dark:bg-slate-900 flex flex-col items-center gap-4 border-t border-slate-100 dark:border-slate-700">
             {!showPromo ? (
                <button onClick={() => setShowPromo(true)} className="flex items-center gap-2 text-xs font-bold text-primary-600 hover:underline">
                    <span className="text-sm">🔑</span> Founder Access Code
                </button>
             ) : (
                 <div className="w-full max-w-xs flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Enter Code" 
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                        className={`w-full px-4 py-2 text-xs border-2 rounded-xl bg-white dark:bg-slate-800 ${promoError ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                    <button onClick={handleApplyPromo} className="px-4 py-2 text-xs font-black bg-slate-900 text-white rounded-xl">Unlock</button>
                 </div>
             )}
             {promoError && <p className="text-[10px] text-red-500 font-bold">{promoError}</p>}
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;

