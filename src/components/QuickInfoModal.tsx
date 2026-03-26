
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, ShieldCheck, Percent, Calculator } from 'lucide-react';

interface QuickInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type: 'cost' | 'waste' | 'compliance' | 'general';
}

export const QuickInfoModal: React.FC<QuickInfoModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  type
}) => {
  const getIcon = () => {
    switch (type) {
      case 'cost': return <Calculator className="text-emerald-500" size={32} />;
      case 'waste': return <Percent className="text-amber-500" size={32} />;
      case 'compliance': return <ShieldCheck className="text-emerald-500" size={32} />;
      default: return <Info className="text-blue-500" size={32} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card w-full max-w-lg rounded-[3rem] p-12 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] border-white/40"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 mask-triangle -z-10" />
            
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-slate-400 hover:text-charcoal transition-colors p-2"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl border border-slate-100">
                {getIcon()}
              </div>
              
              <h3 className="text-3xl font-anchor text-charcoal mb-6 tracking-tighter uppercase">{title}</h3>
              <p className="text-medium text-lg leading-relaxed font-medium italic">
                {description}
              </p>
              
              <button 
                onClick={onClose}
                className="mt-12 bg-charcoal text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl"
              >
                Got it, Chef
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
