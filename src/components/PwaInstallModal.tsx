
import React, { useEffect, useRef } from 'react';
import { X, Share, Smartphone, MoreVertical, PlusSquare, ArrowRight, MousePointer2 } from 'lucide-react';

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

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl animate-fade-in"></div>
      <div ref={modalRef} className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden animate-scale-up">
        
        {/* Animated Tutorial Header */}
        <div className="bg-indigo-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-50"></div>
            <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Smartphone size={32} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Save App to iPad</h3>
                <p className="text-indigo-100 text-sm font-medium mt-1">Never lose your link again.</p>
            </div>
            
            {/* Visual Guide Animation (Simulation of the Video the user requested) */}
            <div className="mt-8 relative h-32 w-64 mx-auto bg-white/10 rounded-2xl border border-white/20 flex flex-col justify-end p-3 overflow-hidden">
                <div className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-md animate-pulse">
                    <Share size={12} />
                </div>
                <div className="space-y-1.5 opacity-50">
                    <div className="h-1.5 w-full bg-white/20 rounded-full"></div>
                    <div className="h-1.5 w-3/4 bg-white/20 rounded-full"></div>
                </div>
                <div className="mt-4 p-2 bg-indigo-500 rounded-lg flex items-center justify-between animate-bounce">
                    <div className="flex items-center gap-2">
                        <PlusSquare size={12} />
                        <div className="h-1.5 w-16 bg-white/40 rounded-full"></div>
                    </div>
                    <ArrowRight size={10} />
                </div>
                {/* Simulated Cursor */}
                <div className="absolute top-4 right-4 animate-[ping_3s_infinite] pointer-events-none">
                    <MousePointer2 size={24} className="text-white fill-white" />
                </div>
            </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800">
            {isIOS ? (
              <div className="space-y-5">
                  <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest text-center">iPad & iPhone Instructions</p>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 font-black text-xs">1</div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Tap the <span className="text-indigo-600">Share Icon</span> at the top of Safari.</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 font-black text-xs">2</div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Scroll down and select <span className="text-indigo-600">"Add to Home Screen"</span>.</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 font-black text-xs">3</div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Tap <span className="text-indigo-600">Add</span> to finish. It now looks like a real app!</p>
                    </li>
                  </ol>
              </div>
            ) : (
              <div className="space-y-5">
                 <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest text-center">Android & Chrome Instructions</p>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 font-black text-xs">1</div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Tap the <span className="text-indigo-600">Menu Icon</span> (three dots).</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 font-black text-xs">2</div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Select <span className="text-indigo-600">"Install App"</span> or <span className="text-indigo-600">"Add to Home screen"</span>.</p>
                    </li>
                  </ol>
              </div>
            )}
          </div>
          
          <button 
            onClick={onClose} 
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
          >
            I've Added It
          </button>
        </div>
      </div>
    </div>
  );
};

export default PwaInstallModal;
