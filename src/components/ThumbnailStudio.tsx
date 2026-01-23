
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, Layout, Type, Sparkles, Image as ImageIcon, ShieldCheck, Zap, ArrowRight, Loader2, Eye, Search, AlertCircle, CheckCircle2, Maximize, Smartphone, AlertTriangle, Star, Save, X } from 'lucide-react';
import html2canvas from 'html2canvas';

const TEMPLATES = [
  { id: 'fiverr', name: 'Fiverr High-Click', bg: 'bg-amber-500', text: 'text-slate-900', accent: 'text-slate-700', border: 'border-slate-900', fiverrTag: true },
  { id: 'system', name: 'Executive System', bg: 'bg-indigo-600', text: 'text-white', accent: 'text-indigo-200', border: 'border-indigo-400' },
  { id: 'dark', name: 'Midnight ROI', bg: 'bg-slate-950', text: 'text-white', accent: 'text-primary-400', border: 'border-primary-500/30' },
];

const ThumbnailStudio: React.FC = () => {
  const [title, setTitle] = useState('HOSPITALITY AI SYSTEM');
  const [subtitle, setSubtitle] = useState('Automate Proposals in 30s');
  const [tag, setTag] = useState('2026 EDITION');
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showSafetyZone, setShowSafetyZone] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target?.result as string);
        setCapturedImageUrl(null); // Reset preview on change
      };
      reader.readAsDataURL(file);
    }
  };

  const exportThumbnail = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    setCapturedImageUrl(null);
    
    const wasSafetyOn = showSafetyZone;
    setShowSafetyZone(false);

    try {
      // Small delay to ensure any layout changes are settled
      await new Promise(r => setTimeout(r, 200));
      
      const canvas = await html2canvas(previewRef.current, {
        scale: 3, // High quality for Fiverr
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImageUrl(dataUrl);
      
      // Still try programmatic download for desktop users
      const link = document.createElement('a');
      link.download = `CaterPro_Fiverr_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
      setShowSafetyZone(wasSafetyOn);
    }
  };

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                <Layout size={28} />
            </div>
            <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Asset Studio</h3>
                <p className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mt-2">Conversion Engineering Lab</p>
            </div>
        </div>
        <p className="text-lg text-slate-500 font-medium leading-relaxed mt-6">
          Create high-contrast Fiverr Gig images. After clicking generate, **long-press the final image** to save it to your iPad Photos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start">
        <div className="space-y-6">
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700 space-y-8 shadow-inner">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">1. Dashboard Visual</label>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="group w-full py-10 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-3 text-xs font-bold text-slate-500 hover:border-indigo-500 transition-all"
              >
                {bgImage ? (
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                        <span className="text-emerald-600">Screenshot Loaded</span>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full group-hover:scale-110 transition-transform">
                            <Camera size={32} className="opacity-40" />
                        </div>
                        <span>Upload App Screenshot</span>
                    </>
                )}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">2. Visual Preset</label>
              <div className="grid grid-cols-3 gap-4">
                {TEMPLATES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => { setTemplate(t); setCapturedImageUrl(null); }}
                    className={`p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 transition-all flex flex-col items-center gap-3 ${template.id === t.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 shadow-md scale-105' : 'border-slate-200 dark:border-slate-700 text-slate-400 bg-white dark:bg-slate-800'}`}
                  >
                    <div className={`w-8 h-8 rounded-xl shadow-lg ${t.bg} border-2 border-white`}></div>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">3. Gig Text</label>
              <div className="space-y-3">
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => { setTitle(e.target.value.toUpperCase()); setCapturedImageUrl(null); }}
                    className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-black uppercase"
                />
                <input 
                    type="text" 
                    value={subtitle} 
                    onChange={(e) => { setSubtitle(e.target.value); setCapturedImageUrl(null); }}
                    className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
                onClick={exportThumbnail}
                disabled={isExporting || !bgImage}
                className="py-5 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all hover:bg-amber-600"
            >
                {isExporting ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                Generate Final Image
            </button>
            <button 
                onClick={() => setShowSimulator(!showSimulator)}
                className={`py-5 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-3 ${showSimulator ? 'bg-slate-950 text-white' : 'bg-white text-slate-600 border-slate-200'}`}
            >
                <Maximize size={20} /> Preview Grid
            </button>
          </div>

          {/* iPad Save Instructions Area */}
          {capturedImageUrl && (
              <div className="p-8 bg-emerald-50 dark:bg-emerald-900/20 border-4 border-emerald-500/30 rounded-[3rem] animate-slide-in">
                  <div className="flex items-center gap-3 mb-4 text-emerald-700 dark:text-emerald-400">
                      <Save size={24} />
                      <h4 className="font-black uppercase tracking-tight">Step 2: Save to iPad</h4>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium mb-6">
                      Your photo is ready below. **Hold your finger on the image** then select **"Save to Photos"**.
                  </p>
                  <div className="relative group">
                      <img 
                        src={capturedImageUrl} 
                        alt="Final Gig Asset" 
                        className="w-full rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none rounded-2xl">
                          <p className="text-white font-black text-xs uppercase tracking-widest">Hold to Save</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => setCapturedImageUrl(null)}
                    className="mt-6 w-full py-3 bg-white/50 text-emerald-800 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                      <X size={14} /> Clear Preview
                  </button>
              </div>
          )}
        </div>

        <div className="relative">
          <div className="sticky top-24 space-y-6">
            <div 
              ref={previewRef}
              className={`relative aspect-[1280/769] w-full rounded-[2rem] overflow-hidden shadow-2xl border-[8px] border-white dark:border-slate-800 ${template.bg}`}
            >
              {bgImage && (
                <div className="absolute inset-0 z-0">
                  <img src={bgImage} className="w-full h-full object-cover opacity-40 scale-125" alt="App Content" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${template.bg} via-transparent to-transparent opacity-80`}></div>
                </div>
              )}

              <div className="relative z-10 p-12 h-full flex flex-col justify-center max-w-[85%]">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                        <Sparkles className={template.text} size={28} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-[0.5em] ${template.accent}`}>{tag}</span>
                </div>
                
                <h4 className={`text-6xl font-black leading-[0.85] tracking-tighter ${template.text} mb-8`}>
                  {title}
                </h4>
                
                <p className={`text-2xl font-black italic opacity-95 ${template.text} leading-tight`}>
                  "{subtitle}"
                </p>

                {template.id === 'fiverr' && (
                    <div className="mt-10 flex items-center gap-4">
                        <div className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">PRO SELLER</div>
                        <div className="flex text-slate-900 gap-1"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                    </div>
                )}
              </div>

              <div className="absolute bottom-10 right-10 flex flex-col items-end">
                 <div className="bg-black/20 backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-white/10 shadow-2xl flex items-center gap-4">
                    <img src="/logo.svg" className="w-10 h-10 rounded-lg" alt="Logo" />
                    <p className="text-xs font-black text-white uppercase tracking-widest">CaterPro AI</p>
                 </div>
              </div>
            </div>

            {showSimulator && (
                <div className="p-8 bg-slate-100 dark:bg-slate-950 rounded-[2.5rem] border-4 border-dashed border-indigo-200 animate-slide-in">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-indigo-500 scale-105 relative z-10">
                            <div className={`h-24 ${template.bg} flex items-center justify-center`}>
                                <p className={`text-[8px] font-black uppercase text-center px-4 ${template.text}`}>{title}</p>
                            </div>
                            <div className="p-3">
                                <h5 className="text-[10px] font-black">CaterPro AI: Business Systems</h5>
                                <div className="text-amber-500 text-[8px] mt-1">★★★★★ (5.0)</div>
                            </div>
                        </div>
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden opacity-30 grayscale pointer-events-none">
                                <div className="h-24 bg-slate-200"></div>
                                <div className="p-3"><div className="h-2 bg-slate-100 w-3/4"></div></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailStudio;
