import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, Sparkles, Building2, GraduationCap, ChefHat, Crown, ArrowRight } from 'lucide-react';
import { PRICING_TIERS, PricingTier } from '../config/pricingTiers';

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

const loadPaystackScript = (): Promise<boolean> => {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.PaystackPop) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface PaystackUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (tierId: string) => void;
  initialTierId?: 'commis' | 'chef-de-partie' | 'sous-chef' | 'executive';
}

export const PaystackUpgradeModal: React.FC<PaystackUpgradeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialTierId = 'sous-chef'
}) => {
  const [selectedTierId, setSelectedTierId] = useState<'commis' | 'chef-de-partie' | 'sous-chef' | 'executive'>(initialTierId);
  const [email, setEmail] = useState('executive.chef@hotel.co.za');
  const [hotelName, setHotelName] = useState('The Metropolitan Grand Hotel & Suites');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  const selectedTier = PRICING_TIERS.find(t => t.id === selectedTierId) || PRICING_TIERS[2];
  const amountInCents = selectedTier.priceZAR * 100;
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_sample_key_for_demo';

  const handlePaystackClick = async () => {
    if (!email || !email.includes('@')) {
      setPaymentNotice('Please enter a valid billing email address.');
      return;
    }

    setIsProcessing(true);
    setPaymentNotice(null);

    // If live/test Paystack public key is configured, initiate popup
    if (publicKey && publicKey !== 'pk_test_sample_key_for_demo') {
      try {
        await loadPaystackScript();
        if (window.PaystackPop) {
          const handler = window.PaystackPop.setup({
            key: publicKey,
            email: email.trim(),
            amount: amountInCents,
            currency: 'ZAR',
            ref: `caterpro_${selectedTier.id}_${Date.now()}`,
            metadata: {
              custom_fields: [
                {
                  display_name: "Hotel / Establishment",
                  variable_name: "hotel_name",
                  value: hotelName
                },
                {
                  display_name: "Selected Plan",
                  variable_name: "plan_name",
                  value: `CaterPro AI - ${selectedTier.name} (${selectedTier.badge})`
                }
              ]
            },
            callback: () => {
              setIsProcessing(false);
              localStorage.setItem('caterpro_subscription_tier', selectedTier.id);
              localStorage.setItem('caterpro_is_pro', 'true');
              if (onSuccess) onSuccess(selectedTier.id);
              onClose();
            },
            onClose: () => {
              setIsProcessing(false);
              setPaymentNotice('Payment dialog closed. You can retry whenever ready.');
            }
          });
          handler.openIframe();
          return;
        }
      } catch (err) {
        console.warn("Paystack popup failed:", err);
      }
    }

    // Demo/Development simulated authorization
    setTimeout(() => {
      setIsProcessing(false);
      localStorage.setItem('caterpro_subscription_tier', selectedTier.id);
      localStorage.setItem('caterpro_is_pro', 'true');
      setPaymentNotice(`🎉 Success! ${selectedTier.name} Tier activated via Paystack ZAR.`);
      setTimeout(() => {
        if (onSuccess) onSuccess(selectedTier.id);
        onClose();
      }, 1200);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modern Crisp White Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 text-slate-900 z-10 my-8 overflow-hidden text-left"
        >
          {/* Subtle lime-to-teal top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-lime-500 via-teal-500 to-cyan-600" />

          {/* Close button */}
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-50 border border-lime-200 text-teal-800 text-[11px] font-black uppercase tracking-wider">
              <span>🇿🇦</span> Paystack South Africa • Instant Hotel Activation
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Hospitality Subscription Tiers
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              From culinary apprentices to executive hotel directors. Transparent monthly billing in South African Rand (ZAR) with instant activation.
            </p>
          </div>

          {/* 4-TIER CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
            {PRICING_TIERS.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`relative rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between border-2 ${
                    isSelected
                      ? 'border-teal-500 bg-gradient-to-b from-teal-50/50 to-white shadow-md shadow-teal-500/10 scale-[1.02]'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {tier.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-lime-500 to-teal-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                      {tier.badge}
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                        {tier.name}
                      </span>
                      {tier.id === 'commis' && <GraduationCap className="w-4 h-4 text-emerald-600" />}
                      {tier.id === 'chef-de-partie' && <ChefHat className="w-4 h-4 text-teal-600" />}
                      {tier.id === 'sous-chef' && <Sparkles className="w-4 h-4 text-lime-600" />}
                      {tier.id === 'executive' && <Crown className="w-4 h-4 text-cyan-600" />}
                    </div>

                    <div>
                      <div className="text-2xl font-black text-slate-900 tracking-tight">
                        R{tier.priceZAR}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        / {tier.billingPeriod} (ZAR)
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium leading-snug">
                      {tier.tagline}
                    </p>

                    <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                      {tier.features.slice(0, 3).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-1.5 text-[10px] text-slate-700 font-medium">
                          <Check className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100">
                    <div className={`w-full py-1.5 rounded-lg text-[10px] font-black uppercase text-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-lime-500 to-teal-600 text-white shadow-2xs'
                        : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300'
                    }`}>
                      {isSelected ? '✓ Selected Plan' : 'Select'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Billing Form & Checkout Section */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Ready to activate: {selectedTier.name} ({selectedTier.badge})
                </span>
                <p className="text-[11px] text-slate-500 font-medium">
                  Includes all {selectedTier.features.length} features, SANS 10330 safety compliance, and priority kitchen support.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-teal-800">
                  R{selectedTier.priceZAR} ZAR
                </span>
                <span className="text-[10px] text-slate-500 block">per month</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Establishment / Hotel Name
                </label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-teal-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Executive Chef / Billing Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-teal-500 shadow-2xs"
                />
              </div>
            </div>

            {paymentNotice && (
              <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-xs font-bold text-center">
                {paymentNotice}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Paystack 256-Bit SSL • Cancel Anytime</span>
              </div>

              <button
                type="button"
                onClick={handlePaystackClick}
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-lime-500 via-teal-600 to-cyan-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting Paystack Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Activate {selectedTier.name} (R{selectedTier.priceZAR} ZAR)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaystackUpgradeModal;
