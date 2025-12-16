import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, CreditCard, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { SubscriptionPlan } from '../hooks/useAppSubscription';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// ============================================================================
// INSTRUCTIONS FOR REAL MONEY:
// 1. Log in to https://developer.paypal.com/dashboard/applications/live
// 2. Create an App (e.g., "CaterPro").
// 3. Copy the "Client ID".
// 4. Paste it inside the quotes below.
// ============================================================================
const PAYPAL_CLIENT_ID: string = "Adp-3XYWNARTpkCw4rbtFUnFox3mMwZtWWRy-TprJ8sOrV8X9z4xtyobRHuCx848mseDoqATaUooheFz"; 
// ============================================================================

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  onConfirm: () => void;
  price: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan, onConfirm, price }) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  // Clean price string for PayPal (remove $ and /mo)
  const numericPrice = price.replace(/[^0-9.]/g, '');
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setCardNumber('');
      setExpiry('');
      setCvc('');
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleSimulatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // SIMULATION DELAY
    setTimeout(() => {
        setLoading(false);
        onConfirm(); 
    }, 2000);
  };
  
  const isRealPaymentMode = PAYPAL_CLIENT_ID && PAYPAL_CLIENT_ID !== "YOUR_PAYPAL_CLIENT_ID_HERE";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[scale-up_0.2s_ease-out]">
        
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Secure Checkout</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="p-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{plan} Plan</h3>
                <p className="text-3xl font-extrabold text-primary-600 dark:text-primary-400 mt-2">{price}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Billed monthly. Cancel anytime.</p>
            </div>

            {isRealPaymentMode ? (
                // --- REAL PAYPAL BUTTONS ---
                <div className="min-h-[150px] flex flex-col justify-center">
                    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID }}>
                        <PayPalButtons 
                            style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [
                                        {
                                            amount: {
                                                currency_code: "USD",
                                                value: numericPrice,
                                            },
                                            description: `CaterPro AI - ${plan} Plan`
                                        },
                                    ],
                                });
                            }}
                            onApprove={async (data, actions) => {
                                if (actions.order) {
                                    const details = await actions.order.capture();
                                    console.log("Payment Successful:", details);
                                    onConfirm(); // Unlock the app
                                }
                            }}
                            onError={(err) => {
                                console.error("PayPal Error:", err);
                                alert("Payment failed. Please try again.");
                            }}
                        />
                    </PayPalScriptProvider>
                    <div className="text-center mt-4">
                        <p className="text-xs text-slate-400">Processed securely by PayPal.</p>
                    </div>
                </div>
            ) : (
                // --- SIMULATOR MODE (Fallback if no ID provided) ---
                <>
                    <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                        <strong>Simulator Mode:</strong> No real money will be charged. Add your PayPal Client ID in <code>src/components/PaymentModal.tsx</code> to accept real payments.
                    </p>
                    </div>

                    <form onSubmit={handleSimulatorSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase mb-1">Card Information</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input 
                                    type="text" 
                                    placeholder="4242 4242 4242 4242" 
                                    className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase mb-1">Expiry</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/YY" 
                                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase mb-1">CVC</label>
                                <input 
                                    type="text" 
                                    placeholder="123" 
                                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex gap-3 items-start mt-4">
                            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-800 dark:text-blue-200">
                                Secure 256-bit SSL encrypted.
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : null}
                            {loading ? 'Processing...' : `Pay ${price} & Start`}
                        </button>
                    </form>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
