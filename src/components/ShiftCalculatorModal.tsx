
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, Copy, Check, Trash2, Plus } from 'lucide-react';
import { ShiftIngredient } from '../types';

interface ShiftCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIngredients: ShiftIngredient[];
  menuTitle: string;
}

export const ShiftCalculatorModal: React.FC<ShiftCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialIngredients,
  menuTitle
}) => {
  const [ingredients, setIngredients] = useState<ShiftIngredient[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIngredients(initialIngredients);
    }
  }, [isOpen, initialIngredients]);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updated = [...ingredients];
    updated[index].quantity = newQuantity;
    setIngredients(updated);
  };

  const handlePriceChange = (index: number, newPrice: number) => {
    const updated = [...ingredients];
    updated[index].unitPrice = newPrice;
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: 'New Ingredient', quantity: 1, unit: 'kg', unitPrice: 0 }]);
  };

  const calculateTotal = () => {
    return ingredients.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const copyToClipboard = () => {
    const text = ingredients
      .map(item => `${item.name}: ${item.quantity}${item.unit} @ R${item.unitPrice.toFixed(2)} = R${(item.quantity * item.unitPrice).toFixed(2)}`)
      .join('\n');
    
    const fullText = `Executive Shift Breakdown: ${menuTitle}\n\n${text}\n\nTotal Menu Cost: R${calculateTotal().toFixed(2)}`;
    
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 md:p-8"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-6xl h-full max-h-[90vh] bg-white/10 border border-white/20 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                  <Calculator size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Executive Shift Breakdown</h2>
                  <p className="text-emerald-400/60 font-medium">{menuTitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-4 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
              >
                <X size={32} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-emerald-400 text-xs font-black uppercase tracking-widest">
                      <th className="p-6">Ingredient Name</th>
                      <th className="p-6">Quantity Needed</th>
                      <th className="p-6">Unit Price (ZAR)</th>
                      <th className="p-6 text-right">Total Cost</th>
                      <th className="p-6 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ingredients.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-white/5 transition-colors">
                        <td className="p-6">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...ingredients];
                              updated[idx].name = e.target.value;
                              setIngredients(updated);
                            }}
                            className="bg-transparent border-none text-white font-bold focus:ring-0 w-full p-0"
                          />
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(idx, parseFloat(e.target.value) || 0)}
                              className="w-24 bg-white/10 border-white/20 rounded-xl text-white font-bold focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3"
                            />
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => {
                                const updated = [...ingredients];
                                updated[idx].unit = e.target.value;
                                setIngredients(updated);
                              }}
                              className="w-16 bg-transparent border-none text-white/60 font-medium focus:ring-0 p-0"
                            />
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">R</span>
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handlePriceChange(idx, parseFloat(e.target.value) || 0)}
                              className="w-32 bg-white/10 border-white/20 rounded-xl text-white font-bold focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3"
                            />
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <span className="text-xl font-black text-white">
                            R{(item.quantity * item.unitPrice).toLocaleString()}
                          </span>
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => removeIngredient(idx)}
                            className="p-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <button
                  onClick={addIngredient}
                  className="w-full p-6 flex items-center justify-center gap-2 text-emerald-400 hover:bg-white/5 transition-all font-bold uppercase tracking-widest text-xs"
                >
                  <Plus size={18} /> Add Custom Ingredient
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-white/5 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-widest mb-1">Total Shift Cost</p>
                  <h3 className="text-5xl font-black text-white tracking-tighter">
                    <span className="text-2xl text-emerald-400 mr-2">R</span>
                    {calculateTotal().toLocaleString()}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? 'COPIED TO CLIPBOARD' : 'COPY FOR WHATSAPP'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
