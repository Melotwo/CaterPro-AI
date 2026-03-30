import React from 'react';

interface QuickInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type: 'cost' | 'waste' | 'compliance' | 'general';
}

const QuickInfoModal: React.FC<QuickInfoModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  type
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'cost': return <span className="text-3xl">🧮</span>;
      case 'waste': return <span className="text-3xl">♻️</span>;
      case 'compliance': return <span className="text-3xl">🛡️</span>;
      default: return <span className="text-3xl">ℹ️</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark bg-opacity-90 animate-fade-in">
      <div
        onClick={onClose}
        className="absolute inset-0"
      />
      <div
        className="bg-white w-full max-w-lg rounded-[3rem] p-12 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] border-2 border-slate-200 animate-scale-up"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 -z-10" />
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors p-2"
        >
          <span className="text-xl">✕</span>
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl border border-slate-100">
            {getIcon()}
          </div>
          
          <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter uppercase">{title}</h3>
          <p className="text-slate-600 text-lg leading-relaxed font-medium italic">
            {description}
          </p>
          
          <button 
            onClick={onClose}
            className="mt-12 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl"
          >
            Got it, Chef
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickInfoModal;
