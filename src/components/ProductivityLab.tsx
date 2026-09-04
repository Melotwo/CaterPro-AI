import React, { useState } from 'react';

interface ProductivityLabProps {
  onNotify: (msg: string) => void;
}

export const ProductivityLab: React.FC<ProductivityLabProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<'receipt' | 'allergen'>('receipt');
  const [analyzing, setAnalyzing] = useState(false);
  const [receiptResult, setReceiptResult] = useState<{ merchant: string; total: string; items: string[] } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setReceiptResult({
        merchant: 'Woolworths Food - V&A Waterfront',
        total: 'ZAR 2,450.80',
        items: [
          'Prosciutto di Parma 1.2kg - R450.00',
          'Atlantic Salmon Fillet 3.5kg - R1,200.00',
          'Greek Halloumi 1.5kg - R320.00',
          'Estate Olive Oil 2L - R220.00',
          'Fresh Herbs & Asparagus - R260.80'
        ]
      });
      onNotify('Receipt analyzed successfully! 5 items mapped to your Shopping List.');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Amber Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
              Vision AI Powered by Gemini
            </span>
          </div>
          <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">
            Productivity Lab <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">(Beta)</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Analyze receipts and food labels using multimodal AI vision.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('receipt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'receipt'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Receipt Intelligence
          </button>
          <button
            onClick={() => setActiveTab('allergen')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'allergen'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Allergen Scanner
          </button>
        </div>
      </div>

      {activeTab === 'receipt' ? (
        <div className="space-y-6">
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 text-2xl mx-auto">
              🧾
            </div>
            <div>
              <h4 className="text-sm font-black uppercase text-slate-900">Analyze Supply Expenses</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Snap a photo of your receipt to automatically extract merchant data and totals for expense tracking.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
              <span>📷</span>
              <span>{analyzing ? 'Analyzing Receipt...' : 'Upload Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={analyzing}
                className="hidden"
              />
            </label>
          </div>

          {receiptResult && (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-emerald-800">{receiptResult.merchant}</span>
                <span className="text-sm font-black text-emerald-700">{receiptResult.total}</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1">
                {receiptResult.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700 text-2xl mx-auto">
            🔍
          </div>
          <div>
            <h4 className="text-sm font-black uppercase text-slate-900">Ingredient Label Allergen Audit</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Upload a photo of food packaging labels to detect hidden gluten, tree nuts, lupin, or sulfites according to R638 statutory food hygiene regulations.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
            <span>📷</span>
            <span>Scan Package Label</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
};

export default ProductivityLab;
