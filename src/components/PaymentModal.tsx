
import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { SubscriptionPlan } from '../hooks/useAppSubscription';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID: string = "Adp-3XYWNARTpkCw4rbtFUnFox3mMwZtWWRy-TprJ8sOrV8X9z4xtyobRHuCx848mseDoqATaUooheFz"; 

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  onConfirm: () => void;
  price: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan, onConfirm, price }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Clean price string for PayPal (remove $ and /mo)
  const numericPrice = price.replace(/[^0-9.]/g, '');

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[scale-up_0.2s_ease-out]">
        
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2 text-green-600">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Secure Checkout</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="p-8">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white capitalize tracking-tight">Unlock {plan}</h3>
                <p className="text-4xl font-black text-primary-600 dark:text-primary-400 mt-2">{price}</p>
                <p className="text-sm text-slate-500 mt-1">Instant Access & Priority Generation</p>
            </div>

            {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                    <p className="font-bold text-slate-900 dark:text-white">Verifying Transaction...</p>
                </div>
            ) : (
                <div className="min-h-[150px] flex flex-col justify-center">
                    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
                        <PayPalButtons 
                            style={{ layout: "vertical", color: "black", shape: "pill", label: "pay" }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [
                                        {
                                            amount: {
                                                currency_code: "USD",
                                                value: numericPrice,
                                            },
                                            description: `CaterPro AI - ${plan} Plan Subscription`
                                        },
                                    ],
                                });
                            }}
                            onApprove={async (data, actions) => {
                                if (actions.order) {
                                    setIsProcessing(true);
                                    await actions.order.capture();
                                    onConfirm(); // Success! Unlock features
                                }
                            }}
                            onCancel={() => {
                                setIsProcessing(false);
                            }}
                            onError={(err) => {
                                console.error("PayPal Error:", err);
                                setIsProcessing(false);
                            }}
                        />
                    </PayPalScriptProvider>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-center gap-2">
                <ShieldCheck className="text-slate-400 w-4 h-4" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Encrypted SSL Payment via PayPal</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
