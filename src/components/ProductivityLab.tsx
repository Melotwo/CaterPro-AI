
import React, { useState, useRef } from 'react';
import { Camera, FileText, ShieldAlert, Loader2, CheckCircle, AlertTriangle, Sparkles, TrendingUp, DollarSign, X, UtensilsCrossed, Building2 } from 'lucide-react';
import { analyzeReceiptFromApi, analyzeLabelFromApi, analyzeMenuForCosting } from '../services/geminiService';
import { ScannedMenuCosting } from '../types';

const ProductivityLab: React.FC<{ dietaryRestrictions: string[], currency: string }> = ({ dietaryRestrictions, currency }) => {
  const [activeTab, setActiveTab] = useState<'receipt' | 'label' | 'menu'>('receipt');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [menuResult, setMenuResult] = useState<ScannedMenuCosting | null>(null);
  const [suppliers, setSuppliers] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setResult(null);
    setMenuResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result?.toString().split(',')[1];
      if (!base64) return;

      try {
        if (activeTab === 'receipt') {
          const data = await analyzeReceiptFromApi(base64);
          setResult(data);
        } else if (activeTab === 'label') {
          const data = await analyzeLabelFromApi(base64, dietaryRestrictions);
          setResult(data);
        } else if (activeTab === 'menu') {
          const data = await analyzeMenuForCosting(base64, suppliers, currency);
          setMenuResult(data);
        }
      } catch (err) {
        console.error("Lab Analysis failed", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="mt-16 animate-slide-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500 rounded-lg text-white">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Productivity Lab (Beta)</h2>
          <p className="text-sm text-slate-500 font-medium">Vision AI Powered by Gemini 3</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => { setActiveTab('receipt'); setResult(null); }}
            className={`flex-1 min-w-[150px] p-5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'receipt' ? 'bg-slate-50 dark:bg-slate-800 text-amber-600 border-b-4 border-amber-600' : 'text-slate-500'}`}
          >
            <FileText size={18} /> Expenses
          </button>
          <button 
            onClick={() => { setActiveTab('menu'); setMenuResult(null); }}
            className={`flex-1 min-w-[150px] p-5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'menu' ? 'bg-slate-50 dark:bg-slate-800 text-pink-600 border-b-4 border-pink-600' : 'text-slate-500'}`}
          >
            <UtensilsCrossed size={18} /> Menu Vision
          </button>
          <button 
            onClick={() => { setActiveTab('label'); setResult(null); }}
            className={`flex-1 min-w-[150px] p-5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'label' ? 'bg-slate-50 dark:bg-slate-800 text-blue-600 border-b-4 border-blue-600' : 'text-slate-500'}`}
          >
            <ShieldAlert size={18} /> Allergens
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'menu' && !menuResult && !isAnalyzing && (
              <div className="mb-8 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-pink-600">
                      <Building2 size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Supplier Context (Optional)</span>
                  </div>
                  <textarea 
                    value={suppliers}
                    onChange={(e) => setSuppliers(e.target.value)}
                    placeholder="e.g. 'I use Bidfood for meat and Woolworths for garnish...'"
                    className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:border-pink-500 outline-none transition-all dark:text-white resize-none h-20"
                  />
              </div>
          )}

          {!result && !menuResult && !isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950/50">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg mb-4 text-slate-400">
                <Camera size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeTab === 'receipt' ? 'Analyze Supply Expenses' : activeTab === 'menu' ? 'Scan Menu for Costing' : 'Scan Ingredient Labels'}
              </h4>
              <p className="text-sm text-slate-500 max-w-xs mt-2 mb-8">
                {activeTab === 'receipt' 
                  ? 'Snap a photo of your receipt to automatically extract merchant data and totals.'
                  : activeTab === 'menu'
                  ? 'Photo an existing menu. AI will identify ingredients, estimate portion costs, and advice on margins.'
                  : 'Scan ingredient labels to instantly identify hidden allergens.'}
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`px-8 py-3 rounded-xl font-black text-sm shadow-xl hover:scale-105 transition-all text-white ${activeTab === 'menu' ? 'bg-pink-600' : 'bg-slate-900'}`}
              >
                Upload Photo
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <Loader2 className={`w-12 h-12 animate-spin mb-4 ${activeTab === 'menu' ? 'text-pink-500' : 'text-amber-500'}`} />
              <p className="text-lg font-bold text-slate-900 dark:text-white">Gemini Vision is Analyzing...</p>
              <p className="text-sm text-slate-500">Processing image data for {currency} costing.</p>
            </div>
          ) : menuResult ? (
              <div className="animate-fade-in space-y-8">
                  <div className="p-8 bg-pink-50 dark:bg-pink-900/10 border-2 border-pink-100 dark:border-pink-800 rounded-[2rem]">
                      <div className="flex justify-between items-center mb-6">
                        <h5 className="text-2xl font-black text-pink-700 dark:text-pink-400">Costing Intelligence</h5>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-pink-500">Total Est. Cost</p>
                            <p className="text-3xl font-black text-pink-600">{currency} {menuResult.totalEstimatedMenuCost}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {menuResult.menuItems.map((item, i) => (
                            <div key={i} className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-pink-100 dark:border-pink-900 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <h6 className="font-black text-slate-900 dark:text-white uppercase text-xs">{item.name}</h6>
                                    <span className="text-[10px] font-black text-pink-500">{currency} {item.estimatedPortionCost} / p</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {item.identifiedIngredients.map(ing => (
                                        <span key={ing} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-700 text-[9px] font-bold rounded-md text-slate-500 dark:text-slate-300">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-[9px] font-black text-pink-400 uppercase tracking-tighter flex items-center gap-1">
                                    <Building2 size={10} /> Source: {item.suggestedSupplier}
                                </p>
                            </div>
                        ))}
                      </div>
                  </div>
                  <div className="p-6 bg-slate-900 text-white rounded-[2rem] border border-white/10">
                      <h6 className="text-xs font-black uppercase text-pink-400 mb-2">Strategy Advice</h6>
                      <p className="text-sm font-medium italic">"{menuResult.marginAdvice}"</p>
                  </div>
                  <button onClick={() => setMenuResult(null)} className="w-full py-4 text-xs font-black uppercase text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all">Scan New Menu</button>
              </div>
          ) : (
            <div className="animate-fade-in">
              {activeTab === 'receipt' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Extracted Merchant</p>
                    <h5 className="text-2xl font-black text-slate-900 dark:text-white">{result.merchant}</h5>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><TrendingUp size={14} /> Recorded on {result.date}</p>
                    
                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Expense</p>
                      <h6 className="text-4xl font-black text-amber-600 flex items-center gap-1">
                        <span className="text-2xl font-black">R</span> {result.total}
                      </h6>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-sm font-black uppercase text-slate-400 tracking-widest">Auto-Categorized</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.categories && result.categories.map((cat: string) => (
                        <span key={cat} className="px-4 py-2 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 shadow-sm">
                          <CheckCircle size={12} className="text-green-500" /> {cat}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => setResult(null)}
                      className="w-full py-4 mt-8 border-2 border-slate-200 dark:border-slate-700 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all text-xs uppercase"
                    >
                      Scan Another Receipt
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Safety Score</p>
                    <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center mb-4">
                      <span className="text-4xl font-black text-blue-600">{result.suitabilityScore}</span>
                      <span className="text-xl font-bold text-blue-400">/10</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Suitability Assessment</p>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-500" /> Detected Concerns
                    </h5>
                    <div className="space-y-2">
                      {result.flaggedIngredients && result.flaggedIngredients.length > 0 ? (
                        result.flaggedIngredients.map((ing: string) => (
                          <div key={ing} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                            <X size={14} /> Flagged: {ing}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl text-xs font-bold text-green-700 dark:text-green-300 flex items-center gap-2">
                          <CheckCircle size={14} /> No restricted allergens found.
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 italic leading-relaxed pt-2">
                      <strong>AI Insight:</strong> {result.reasoning}
                    </p>
                    <button 
                      onClick={() => setResult(null)}
                      className="w-full py-4 mt-8 border-2 border-slate-200 dark:border-slate-700 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all text-xs uppercase"
                    >
                      Scan Another Label
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductivityLab;
