import React, { useState, useRef } from 'react';
import { Camera, FileText, ShieldAlert, Loader2, CheckCircle, AlertTriangle, Sparkles, TrendingUp, DollarSign, X } from 'lucide-react';
import { analyzeReceiptFromApi, analyzeLabelFromApi } from '../services/geminiService';

const ProductivityLab: React.FC<{ dietaryRestrictions: string[] }> = ({ dietaryRestrictions }) => {
  const [activeTab, setActiveTab] = useState<'receipt' | 'label'>('receipt');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result?.toString().split(',')[1];
      if (!base64) return;

      try {
        if (activeTab === 'receipt') {
          const data = await analyzeReceiptFromApi(base64);
          setResult(data);
        } else {
          const data = await analyzeLabelFromApi(base64, dietaryRestrictions);
          setResult(data);
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
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => { setActiveTab('receipt'); setResult(null); }}
            className={`flex-1 p-5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'receipt' ? 'bg-slate-50 dark:bg-slate-800 text-amber-600 border-b-4 border-amber-600' : 'text-slate-500'}`}
          >
            <FileText size={18} /> Receipt Intelligence
          </button>
          <button 
            onClick={() => { setActiveTab('label'); setResult(null); }}
            className={`flex-1 p-5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'label' ? 'bg-slate-50 dark:bg-slate-800 text-blue-600 border-b-4 border-blue-600' : 'text-slate-500'}`}
          >
            <ShieldAlert size={18} /> Allergen Scanner
          </button>
        </div>

        <div className="p-8">
          {!result && !isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950/50">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg mb-4 text-slate-400">
                <Camera size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeTab === 'receipt' ? 'Analyze Supply Expenses' : 'Scan Ingredient Labels'}
              </h4>
              <p className="text-sm text-slate-500 max-w-xs mt-2 mb-8">
                {activeTab === 'receipt' 
                  ? 'Snap a photo of your receipt to automatically extract merchant data and totals for expense tracking.'
                  : 'Scan ingredient labels to instantly identify hidden allergens based on your menu restrictions.'}
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-black text-sm shadow-xl hover:scale-105 transition-all"
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
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <p className="text-lg font-bold text-slate-900 dark:text-white">Gemini is Thinking...</p>
              <p className="text-sm text-slate-500">Extracting deep intelligence from your image.</p>
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
                        <DollarSign className="w-8 h-8" /> {result.total}
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
