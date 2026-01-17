
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, Layout, Type, Sparkles, Image as ImageIcon, ShieldCheck, Zap, ArrowRight, Loader2, Eye, Search, AlertCircle, CheckCircle2, Maximize, Smartphone } from 'lucide-react';
import html2canvas from 'html2canvas';

const TEMPLATES = [
  { id: 'system', name: 'Executive System', bg: 'bg-indigo-600', text: 'text-white', accent: 'text-indigo-200', border: 'border-indigo-400' },
  { id: 'academy', name: 'Academy Pro', bg: 'bg-emerald-600', text: 'text-white', accent: 'text-emerald-200', border: 'border-emerald-400' },
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
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setBgImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const exportThumbnail = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    
    // Hide safety zone before export
    const wasSafetyOn = showSafetyZone;
    setShowSafetyZone(false);

    try {
      // Small delay to allow state update
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(previewRef.current, {
        scale: 3, // Ultra-high resolution for Whop retina displays
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `CaterPro_Whop_Asset_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
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
          People buy software that looks <span className="text-indigo-600 font-black italic">Expensive</span>. Use this studio to wrap your app screenshots in professional branding that signals authority.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start">
        {/* Controls */}
        <div className="space-y-6">
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700 space-y-8 shadow-inner">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">1. Hero Screenshot</label>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="group w-full py-10 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-3 text-xs font-bold text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-all shadow-sm"
              >
                {bgImage ? (
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                        <span className="text-emerald-600">Image Synced</span>
                        <span className="text-[9px] text-slate-400 uppercase">Click to change</span>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full group-hover:scale-110 transition-transform">
                            <Camera size={32} className="opacity-40" />
                        </div>
                        <span>Upload Dashboard Screenshot</span>
                    </>
                )}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">2. Identity Presets</label>
              <div className="grid grid-cols-3 gap-4">
                {TEMPLATES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setTemplate(t)}
                    className={`p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 transition-all flex flex-col items-center gap-3 ${template.id === t.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 shadow-md scale-105' : 'border-slate-200 dark:border-slate-700 text-slate-400 bg-white dark:bg-slate-800 hover:border-slate-300'}`}
                  >
                    <div className={`w-8 h-8 rounded-xl shadow-lg ${t.bg} border-2 border-white dark:border-slate-700`}></div>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">3. Authority Copy</label>
              <div className="space-y-3">
                <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value.toUpperCase())}
                        placeholder="HOSPITALITY SYSTEM"
                        className="w-full pl-12 pr-4 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                </div>
                <input 
                    type="text" 
                    value={subtitle} 
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Benefit Statement"
                    className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
                onClick={exportThumbnail}
                disabled={isExporting || !bgImage}
                className="py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isExporting ? <Loader2 className="animate-spin" /> : <Download size={20} />}
                {isExporting ? 'Rendering...' : 'Download PNG'}
            </button>
            <button 
                onClick={() => setShowSimulator(!showSimulator)}
                className={`py-5 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-3 ${showSimulator ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
                <Maximize size={20} /> {showSimulator ? 'Exit Simulator' : 'Whop Simulator'}
            </button>
          </div>
          
          <div className="flex items-center justify-between px-2">
             <button 
                onClick={() => setShowSafetyZone(!showSafetyZone)}
                className="text-[10px] font-black uppercase text-indigo-500 flex items-center gap-2 hover:underline"
             >
                <AlertTriangle size={14} /> Toggle Safety Zones
             </button>
             <p className="text-[9px] text-slate-400 font-bold uppercase">Size: 1200x630 (Retina Optimized)</p>
          </div>
        </div>

        {/* Live Preview & Simulator */}
        <div className="relative">
          <div className="sticky top-24 space-y-6">
            <div 
              ref={previewRef}
              className={`relative aspect-[1200/630] w-full rounded-[3rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-[10px] border-white dark:border-slate-800 ${template.bg}`}
            >
              {/* Screenshot Layer */}
              {bgImage ? (
                <div className="absolute inset-0 z-0">
                  <img src={bgImage} className="w-full h-full object-cover opacity-60 scale-110" alt="App Content" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${template.bg} via-transparent to-transparent opacity-90`}></div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/5">
                   <ImageIcon size={240} />
                </div>
              )}

              {/* Layout Content */}
              <div className="relative z-10 p-12 lg:p-20 h-full flex flex-col justify-center max-w-[80%]">
                <div className="flex items-center gap-4 mb-8 lg:mb-12">
                    <div className="p-5 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                        <Sparkles className="text-amber-400" size={32} />
                    </div>
                    <span className={`text-sm font-black uppercase tracking-[0.6em] ${template.accent} drop-shadow-md`}>{tag}</span>
                </div>
                
                <h4 className={`text-6xl lg:text-8xl font-black leading-[0.8] tracking-tighter ${template.text} mb-8 lg:mb-12 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]`}>
                  {title || 'SYSTEM'}
                </h4>
                
                <p className={`text-2xl lg:text-4xl font-black italic opacity-95 ${template.text} drop-shadow-lg leading-tight`}>
                  "{subtitle || 'Your unfair advantage.'}"
                </p>

                <div className="mt-12 lg:mt-16 flex items-center gap-6">
                    <div className="px-10 py-5 bg-white text-slate-950 rounded-2xl text-base font-black uppercase tracking-widest shadow-2xl flex items-center gap-3">
                        Launch System <ArrowRight size={20} />
                    </div>
                    <div className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] ${template.accent}`}>
                        <ShieldCheck size={24} /> Verified AI
                    </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-16 right-16 flex flex-col items-end gap-4 animate-slide-in">
                 <div className="bg-black/30 backdrop-blur-2xl px-8 py-5 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-5">
                    <img src="/logo.svg" className="w-12 h-12 rounded-xl shadow-xl border-2 border-white/20" alt="Logo" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-indigo-300 tracking-[0.2em] mb-1">Architected By</p>
                        <p className="text-sm font-black text-white uppercase">CaterPro AI</p>
                    </div>
                 </div>
              </div>

              {/* Safety Zone Overlay */}
              {showSafetyZone && (
                  <div className="absolute inset-0 pointer-events-none z-50">
                      <div className="absolute inset-0 border-[40px] border-red-500/20"></div>
                      <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-red-500 text-white text-[8px] font-black p-1 rounded uppercase vertical-text">CROP ZONE</div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">WHOP TITLE OVERLAY AREA</div>
                  </div>
              )}
            </div>

            {/* Simulated Whop Discovery Grid */}
            {showSimulator && (
                <div className="p-10 bg-slate-100 dark:bg-slate-950 rounded-[3rem] border-4 border-dashed border-indigo-200 dark:border-indigo-900 animate-slide-in">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Search className="text-slate-400" size={20} />
                            <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Searching: Chef SaaS</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        {/* THE USER'S LISTING */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-indigo-500 ring-[12px] ring-indigo-500/10 scale-105 relative z-10">
                            <div className="absolute top-3 right-3 z-10">
                                <div className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Trending</div>
                            </div>
                            <div className={`h-32 ${template.bg} flex items-center justify-center relative overflow-hidden`}>
                                {bgImage && <img src={bgImage} className="absolute inset-0 object-cover opacity-20 scale-150" />}
                                <div className="relative z-10 text-center px-4">
                                    <p className="text-[10px] font-black text-white leading-none tracking-tighter uppercase drop-shadow-md">{title}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">CaterPro AI: Hospitality Solution</h5>
                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-amber-500 font-black">
                                    <span>★★★★★</span>
                                    <span className="text-slate-400 ml-1">4.9 (2k+)</span>
                                </div>
                            </div>
                        </div>

                        {/* COMPETITOR DUMMIES */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm grayscale opacity-30 pointer-events-none">
                                <div className="h-32 bg-slate-200 dark:bg-slate-800 flex items-center justify-center italic text-[10px] font-bold text-slate-400">
                                    Generic Food Photo
                                </div>
                                <div className="p-4">
                                    <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-3"></div>
                                    <div className="h-3 bg-slate-50 rounded-full w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-10">Simulator Mode: High Contrast wins attention</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailStudio;
