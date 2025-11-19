import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, MessageSquare, Check, Loader2 } from 'lucide-react';

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
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      // Reset state when modal opens
      setEmail('');
      setWhatsapp('');
      setError('');
      setIsSubmitting(false);
      setIsSubmitted(false);

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      setTimeout(() => firstElement.focus(), 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
        if (e.key === 'Tab') {
          // Tab trapping logic
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
  }, [isOpen]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const validateEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    // Simulate a submission
    setTimeout(() => {
      onSave(email, whatsapp);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  if (!isOpen) return null;
  
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="email-capture-title" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={handleClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 transition-all animate-[scale-up_0.2s_ease-out]">
        <div className="p-6 sm:p-8 text-center">
          {isSubmitted ? (
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <h3 id="email-capture-title" className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Thank You!</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">A link to your proposal will be sent to your email shortly.</p>
              <button onClick={handleClose} className="mt-6 w-full inline-flex justify-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-primary-600 focus:outline-none sm:text-sm">
                Close
              </button>
            </div>
          ) : (
            <>
              <h3 id="email-capture-title" className="text-lg font-semibold text-slate-900 dark:text-white">Get Your Proposal</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Enter your details below to receive a shareable link to this menu proposal.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative mt-1">
                    <Mail className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-slate-400" />
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white sm:text-sm" />
                  </div>
                   {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700 dark:text-slate-300">WhatsApp Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <div className="relative mt-1">
                    <MessageSquare className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-slate-400" />
                    <input type="tel" id="whatsapp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+1 (555) 123-4567" className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white sm:text-sm" />
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0 pt-2">
                    <button type="button" onClick={handleClose} className="w-full sm:w-auto inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-base font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600">
                        Maybe Later
                    </button>
                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Saving...' : 'Send Link'}
                    </button>
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
