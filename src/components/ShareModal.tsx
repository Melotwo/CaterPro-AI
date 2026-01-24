
import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Facebook, Linkedin, MessageSquare, Twitter, Globe, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  menuTitle?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl, menuTitle = "Catering Proposal" }) => {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&qzone=1&margin=10`;

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      setCopied(false);

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      setTimeout(() => firstElement.focus(), 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        triggerElementRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareActions = [
    { 
      name: 'WhatsApp', 
      icon: MessageSquare, 
      color: 'bg-[#25D366]', 
      link: `https://wa.me/?text=${encodeURIComponent(`Check out this ${menuTitle} I just generated with CaterPro AI: ${shareUrl}`)}` 
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      color: 'bg-[#0077b5]', 
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` 
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'bg-[#1877F2]', 
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` 
    },
    { 
      name: 'X (Twitter)', 
      icon: Twitter, 
      color: 'bg-black', 
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just architected a pro menu: ${menuTitle}`)}&url=${encodeURIComponent(shareUrl)}` 
    },
  ];

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="share-modal-title" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity animate-fade-in"></div>
      <div ref={modalRef} className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border-4 border-white dark:border-slate-800 transition-all animate-scale-up overflow-hidden">
        
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10"><Globe size={140} /></div>
            <div className="relative z-10">
                <h3 id="share-modal-title" className="text-3xl font-black uppercase tracking-tight leading-none mb-2">Share Strategy</h3>
                <p className="text-indigo-100 text-sm font-medium">Deliver this proposal to your client or community instantly.</p>
            </div>
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
                <X size={24} />
            </button>
        </div>

        <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {shareActions.map((action) => (
                    <a 
                        key={action.name}
                        href={action.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:scale-105 transition-transform"
                    >
                        <div className={`p-4 ${action.color} text-white rounded-2xl shadow-lg`}>
                            <action.icon size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{action.name}</span>
                    </a>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                <div className="bg-white p-3 rounded-2xl shadow-xl shrink-0">
                    <img src={qrCodeUrl} alt="QR Code" width="120" height="120" />
                </div>
                <div className="space-y-4 flex-grow text-center sm:text-left">
                    <div>
                        <h4 className="font-black uppercase text-xs tracking-widest text-indigo-600 mb-1">Direct Link</h4>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                             <input 
                                readOnly 
                                value={shareUrl} 
                                className="bg-transparent text-[10px] font-bold text-slate-500 w-full outline-none truncate" 
                             />
                             <button onClick={handleCopy} className="p-2 bg-slate-900 text-white rounded-lg active:scale-90 transition-transform">
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                             </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">
                        Anyone with this magic link can view the proposal without logging in.
                    </p>
                </div>
            </div>

            <button 
                onClick={onClose}
                className="w-full py-5 bg-slate-900 dark:bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all active:scale-95"
            >
                Done Sharing
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
