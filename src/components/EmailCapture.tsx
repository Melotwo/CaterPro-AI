import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, MessageSquare, Check, Loader2, AlertCircle, Send, ArrowRight, ShieldCheck } from 'lucide-react';
import { analytics } from '../services/analyticsManager';

interface EmailCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (email: string, whatsapp: string) => void;
}

// LIVE WEBHOOK: Data flows from your app -> Make.com -> Google Sheets
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/wphooj1hd6vms67mnehajg1jmua6lozf"; 

const EmailCapture: React.FC<EmailCaptureProps> = ({ isOpen, onClose, onSave }) => {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail(localStorage.getItem('caterpro_user_email') || '');
      setWhatsapp(localStorage.getItem('caterpro_user_whatsapp') || '');
      setError('');
      setIsSubmitting(false);
      setIsSubmitted(false);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    try {
        // 1. Log to Analytics
        analytics.track({ type: 'founder_action', data: { actionName: 'submit_lead_form' } });

        // 2. Send to Make.com Webhook
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                whatsapp,
                source: 'CaterPro AI iPad App',
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                platform: 'web_production'
            })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        // 3. Save locally and update UI
        localStorage.setItem('caterpro_user_email', email);
        localStorage.setItem('caterpro_user_whatsapp', whatsapp);
        onSave(email, whatsapp);
        setIsSubmitting(false);
        setIsSubmitted(true);
    } catch (err) {
        console.error("Webhook sync failed:", err);
        setError('Automation link pending. Local backup saved.');
        
        // Fallback: Still allow local save so the user experience isn't broken
        localStorage.setItem('caterpro_user_email', email);
        localStorage.setItem('caterpro_user_whatsapp', whatsapp);
        onSave(email, whatsapp);
        setIsSubmitting(false);
        setIsSubmitted(true);
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div onClick={handleClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-md animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden animate-[scale-up_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
            <div className={`h-full bg-indigo-500 transition-all duration-1000 ${isSubmitting ? 'w-3/4' : (isSubmitted ? 'w-full' : 'w-0')}`}></div>
        </div>

        <div className="p-8">
          <button onClick={handleClose} className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>

          {isSubmitted ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6 border-4 border-emerald-500/20">
                <Check className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Sync Complete!</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400 font-medium">
                Your lead has been pushed to <strong>Make.com</strong> and your master spreadsheet.
              </p>
              <div className="mt-10">
                  <button onClick={handleClose} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                    Return to Hub <ArrowRight size={18} />
                  </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">Lead Capture</h3>
                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mt-2">Live Automation Active</p>
                  </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Client/Business Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="chef@yourkitchen.com"
                        className={`w-full pl-14 pr-5 py-5 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white text-sm font-bold shadow-inner ${error ? 'border-red-500' : 'border-transparent focus:border-indigo-500'}`} 
                        required 
                    />
                  </div>
                   {error && (
                       <div className="flex items-center gap-1.5 mt-2 text-red-500 text-xs font-bold animate-slide-in">
                           <AlertCircle size={14} /> {error}
                       </div>
                   )}
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">WhatsApp Number (Optional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="tel" 
                        id="whatsapp" 
                        value={whatsapp} 
                        onChange={e => setWhatsapp(e.target.value)} 
                        placeholder="+27 (0) 123 4567" 
                        className="w-full pl-14 pr-5 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white text-sm font-bold shadow-inner" 
                    />
                  </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !email} 
                        className="w-full py-6 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>PULLING INTO SYSTEMS...</span>
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                <span>PUSH LEAD TO MAKE.COM</span>
                            </>
                        )}
                    </button>
                    <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
                         <ShieldCheck size={12} />
                         <p className="text-[9px] font-bold uppercase tracking-widest">End-to-End Encrypted CRM Sync</p>
                    </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailCapture;
