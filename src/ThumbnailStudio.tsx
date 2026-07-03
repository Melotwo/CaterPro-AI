
import React, { useState, useRef, useEffect } from 'react';
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
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [showPhotoMode, setShowPhotoMode] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target?.result as string);
        setCapturedImageUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportThumbnail = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    setCapturedImageUrl(null);

    try {
      await new Promise(r => setTimeout(r, 300));
      
      const canvas = await html2canvas(previewRef.current, {
        scale: 4, // Ultra-high quality for Fiverr
        useCORS: true,
        backgroundColor: null,
        logging: false,
        allowTaint: true,
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setCapturedImageUrl(dataUrl);
      setShowPhotoMode(true); // Automatically open photo mode for easy saving
      
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                <span className="text-2xl">🖼️</span>
            </div>
            <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Asset Studio</h3>
                <p className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mt-2">Conversion Engineering Lab</p>
            </div>
        </div>
        <p className="text-lg text-slate-500 font-medium leading-relaxed mt-6">
          Create high-contrast Fiverr Gig images. Once generated, the **Photo Mode** will open. Hold down on the image to save it.
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
                        <span className="text-4xl">✅</span>
                        <span className="text-emerald-600 font-black uppercase tracking-widest">Image Ready</span>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full group-hover:scale-110 transition-transform text-3xl">
                            📷
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
                    className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 text-sm font-black uppercase focus:border-indigo-500 outline-none"
                />
                <input 
                    type="text" 
                    value={subtitle} 
                    onChange={(e) => { setSubtitle(e.target.value); setCapturedImageUrl(null); }}
                    className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 text-sm font-bold focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
                onClick={exportThumbnail}
                disabled={isExporting || !bgImage}
                className="py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all hover:bg-indigo-700"
            >
                {isExporting ? <span className="animate-spin">⏳</span> : <span className="text-xl">✨</span>}
                Generate Final Image
            </button>
            <button 
                onClick={() => setShowSimulator(!showSimulator)}
                className={`py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-3 ${showSimulator ? 'bg-slate-950 text-white' : 'bg-white text-slate-600 border-slate-200'}`}
            >
                <span className="text-xl">🔍</span> Preview Grid
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="sticky top-24 space-y-6">
            {/* THE ACTUAL PREVIEW ELEMENT */}
            <div 
              ref={previewRef}
              className={`relative aspect-[1280/769] w-full rounded-[2rem] overflow-hidden shadow-2xl border-[12px] border-white dark:border-slate-800 ${template.bg}`}
            >
              {bgImage && (
                <div className="absolute inset-0 z-0">
                  <img src={bgImage} className="w-full h-full object-cover opacity-30 scale-110" alt="App Content" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${template.bg} via-transparent to-transparent opacity-90`}></div>
                </div>
              )}

              {/* Spacing Fix: Container max-width set to 70% to guarantee no logo overlap */}
              <div className="relative z-10 p-12 h-full flex flex-col justify-center max-w-[70%]">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                        <span className={`${template.text} text-3xl`}>✨</span>
                    </div>
                    <span className={`text-sm font-black uppercase tracking-[0.5em] ${template.accent}`}>{tag}</span>
                </div>
                
                <h4 className={`text-6xl sm:text-7xl font-black leading-[0.8] tracking-tighter ${template.text} mb-10`}>
                  {title}
                </h4>
                
                <p className={`text-2xl sm:text-3xl font-black italic opacity-95 ${template.text} leading-tight`}>
                  "{subtitle}"
                </p>

                {template.id === 'fiverr' && (
                    <div className="mt-12 flex items-center gap-4">
                        <div className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">PRO SELLER</div>
                        <div className="flex text-slate-900 gap-1.5">⭐⭐⭐⭐⭐</div>
                    </div>
                )}
              </div>

              {/* Logo Isolated at Bottom Right with padding */}
              <div className="absolute bottom-12 right-12 flex flex-col items-end">
                 <div className="bg-white/10 backdrop-blur-2xl px-6 py-5 rounded-[2.5rem] border border-white/20 shadow-2xl flex items-center gap-4">
                    <img src="/logo.png" className="w-12 h-12 rounded-xl shadow-xl" alt="Logo" />
                    <p className={`text-xs font-black uppercase tracking-[0.2em] ${template.text}`}>CaterPro AI</p>
                 </div>
              </div>
            </div>

            {showSimulator && (
                <div className="p-10 bg-slate-100 dark:bg-slate-950 rounded-[3rem] border-4 border-dashed border-indigo-200 animate-slide-in">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-[6px] border-indigo-500 scale-105 relative z-10">
                            <div className={`h-32 ${template.bg} flex items-center justify-center p-4`}>
                                <p className={`text-[10px] font-black uppercase text-center ${template.text} leading-tight`}>{title}</p>
                            </div>
                            <div className="p-4">
                                <h5 className="text-[12px] font-black leading-none mb-1">CaterPro AI: Business Systems</h5>
                                <div className="text-amber-500 text-[10px]">★★★★★ (5.0)</div>
                            </div>
                        </div>
                        {[1].map(i => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden opacity-30 grayscale pointer-events-none border-2 border-slate-200">
                                <div className="h-32 bg-slate-200"></div>
                                <div className="p-4"><div className="h-3 bg-slate-100 w-3/4 rounded"></div></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* FULL SCREEN PHOTO MODE MODAL FOR IPAD SAVING */}
      {showPhotoMode && capturedImageUrl && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-10 animate-fade-in">
              <div className="max-w-4xl w-full flex flex-col gap-6">
                  <div className="flex justify-between items-center text-white">
                      <div className="flex items-center gap-4">
                          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl animate-bounce text-2xl">
                              🖼️
                          </div>
                          <div>
                              <h3 className="text-xl font-black uppercase tracking-tight">Photo Mode Active</h3>
                              <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Hold image below to save</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => setShowPhotoMode(false)}
                        className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white text-2xl"
                      >
                          ❌
                      </button>
                  </div>

                  <div className="relative group rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-black">
                      {/* This image tag is specifically styled for easy iOS context menu triggers */}
                      <img 
                        src={capturedImageUrl} 
                        alt="Hold to Save" 
                        className="w-full h-auto cursor-pointer select-none active:scale-[0.99] transition-transform"
                        onContextMenu={(e) => e.preventDefault()} // Prevents accidental menu on long tap if using custom triggers
                      />
                      <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                          <div className="flex items-center justify-center gap-3 text-white text-sm font-black uppercase tracking-widest">
                              <span className="animate-pulse">📱</span>
                              Long-press & Select "Save to Photos"
                          </div>
                      </div>
                  </div>

                  <button 
                    onClick={() => setShowPhotoMode(false)}
                    className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
                  >
                      Close Photo Mode
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default ThumbnailStudio;
