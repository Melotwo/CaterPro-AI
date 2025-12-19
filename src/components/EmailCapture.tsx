
import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, MessageSquare, Check, Loader2, AlertCircle, Send, ArrowRight } from 'lucide-react';

interface EmailCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (email: string, whatsapp: string) => void;
}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    // Simulate API storage / Email triggering
    setTimeout(() => {
      onSave(email, whatsapp);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div onClick={handleClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-md animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-[scale-up_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
            <div className={`h-full bg-primary-500 transition-all duration-1000 ${isSubmitting ? 'w-3/4' : (isSubmitted ? 'w-full' : 'w-0')}`}></div>
        </div>

        <div className="p-8">
          <button onClick={handleClose} className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>

          {isSubmitted ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
                <Check className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Proposal Ready!</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                We've saved your info. A link to this menu has been prepared for <strong>{email}</strong>.
              </p>
              <div className="mt-8 space-y-3">
                  <button onClick={handleClose} className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-lg shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                    Open My Dashboard <ArrowRight size={18} />
                  </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
                    <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Send Proposal</h3>
                    <p className="text-sm text-slate-500 font-medium">Get a professional PDF and link.</p>
                  </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Personal/Business Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="chef@yourkitchen.com"
                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all dark:text-white text-sm font-medium ${error ? 'border-red-500' : 'border-transparent focus:border-primary-500'}`} 
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
                  <label htmlFor="whatsapp" className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">WhatsApp Number (Optional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="tel" 
                        id="whatsapp" 
                        value={whatsapp} 
                        onChange={e => setWhatsapp(e.target.value)} 
                        placeholder="+27 (0) 123 4567" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 rounded-2xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all dark:text-white text-sm font-medium" 
                    />
                  </div>
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !email} 
                        className="w-full py-4 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-700 text-white rounded-2xl font-black shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                <span>Get My Proposal Now</span>
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-4 px-4 leading-relaxed">
                        By clicking, you agree to receive your menu proposal via email. We respect your privacy.
                    </p>
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
