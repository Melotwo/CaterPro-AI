import React, { useEffect, useRef } from 'react';
import { X, Share, Smartphone, MoreVertical, PlusSquare } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[scale-up_0.2s_ease-out]">
        <div className="p-6">
          <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={20} />
          </button>

          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mb-3">
              <Smartphone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Install CaterPro AI</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Add to your home screen for the full app experience. No App Store download required.
            </p>
          </div>

          <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
            {isIOS ? (
              // iOS Instructions
              <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-xs">1</span>
                  <span>Tap the <strong>Share</strong> button in your browser bar.</span>
                  <Share size={16} className="text-blue-500" />
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-xs">2</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                  <PlusSquare size={16} className="text-slate-500" />
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-xs">3</span>
                  <span>Tap <strong>Add</strong> to finish.</span>
                </li>
              </ol>
            ) : (
              // Android / Chrome Instructions
              <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-xs">1</span>
                  <span>Tap the <strong>Menu</strong> (three dots) icon.</span>
                  <MoreVertical size={16} className="text-slate-500" />
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-xs">2</span>
                  <span>Select <strong>Install App</strong> or <strong>Add to Home screen</strong>.</span>
                  <Smartphone size={16} className="text-slate-500" />
                </li>
              </ol>
            )}
          </div>
          
          <button onClick={onClose} className="mt-6 w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default PwaInstallModal;
