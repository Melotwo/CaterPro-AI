
import React, { useState, useEffect } from 'react';
import { X, Copy, Image as ImageIcon, Check, RefreshCw, Linkedin, Twitter, MessageCircle, Send, Film, Play, Zap, GraduationCap, ArrowRight, Loader2, Mail, Pin, Sparkles, Mic2, Layout, Video, ShieldCheck, Sparkle, Target, MessageSquareQuote, Smartphone, Camera, Facebook, Download, AlertTriangle, Key } from 'lucide-react';
import { generateSocialCaption, generateVideoFromApi, generateWhatsAppStatus, generateProvanceVSLScript, generateNewYearLaunchScript } from '../services/geminiService';

export type Mode = 'create' | 'pitch' | 'video' | 'podcast' | 'explainer' | 'provance' | 'newyear' | 'bait' | 'sniper' | 'status' | 'reel';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | undefined;
  menuTitle: string;
  menuDescription: string;
  initialMode?: Mode;
  onImageGenerated?: (base64: string) => void;
}

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'tiktok';

const LOADING_MESSAGES = [
  "Analyzing culinary profile...",
  "Visualizing cinematic plating...",
  "Orchestrating transitions...",
  "Applying 2026 aesthetic filters...",
  "Polishing gourmet visual effects...",
  "Readying your high-intent reel..."
];

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ 
  isOpen, onClose, image, menuTitle, menuDescription, initialMode = 'create', onImageGenerated
}) => {
  const [activeMode, setActiveMode] = useState<Mode>(initialMode);
  const [activePlatform, setActivePlatform] = useState<Platform>('tiktok');
  const [editedContent, setEditedContent] = useState('');
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copiedText, setCopiedText] = useState(false);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      setEditedContent('');
      if (videoBlobUrl) URL.revokeObjectURL(videoBlobUrl);
      setVideoBlobUrl(null);
      setNeedsApiKey(false);
      
      if (initialMode !== 'reel') {
        handleGenerate(initialMode === 'create' ? 'facebook' : undefined);
      }
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    let interval: any;
    if (isGenerating && activeMode === 'reel') {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isGenerating, activeMode]);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
        setNeedsApiKey(false);
        handleGenerate();
    }
  };

  const handleGenerate = async (platformOverride?: Platform) => {
    const platform = platformOverride || activePlatform;
    
    if (activeMode === 'reel') {
        const hasKey = await window.aistudio?.hasSelectedApiKey?.();
        if (!hasKey) {
            setNeedsApiKey(true);
            return;
        }
    }

    setIsGenerating(true);
    setLoadingStep(0);
    try {
      if (activeMode === 'create') {
        const caption = await generateSocialCaption(menuTitle, menuDescription, platform);
        setEditedContent(caption);
      } else if (activeMode === 'status') {
        const status = await generateWhatsAppStatus(menuTitle);
        setEditedContent(status);
      } else if (activeMode === 'reel') {
        const url = await generateVideoFromApi(menuTitle, menuDescription, image);
        // Robust fetch to ensure CORS and authentication work inside <video>
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setVideoBlobUrl(blobUrl);
      } else if (activeMode === 'provance') {
        const script = await generateProvanceVSLScript(menuTitle, menuDescription);
        setEditedContent(script);
      } else if (activeMode === 'newyear') {
        const script = await generateNewYearLaunchScript(menuTitle, menuDescription);
        setEditedContent(script);
      }
    } catch (e: any) {
      if (e.message?.includes("Requested entity was not found")) {
          setNeedsApiKey(true);
      } else {
          setEditedContent("AI is busy refining your strategy. Please try again in a few seconds.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(editedContent || '').then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-md animate-[fade-in_0.2s_ease-out]"></div>
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[scale-up_0.2s_ease-out] flex flex-col h-[90dvh]">
        
        <button onClick={onClose} className="absolute top-5 right-5 p-2 z-20 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 rounded-full transition-colors shadow-sm">
          <X size={20} />
        </button>

        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 p-3 flex gap-2 overflow-x-auto no-scrollbar">
            <button onClick={() => {setActiveMode('reel'); setVideoBlobUrl(null); setNeedsApiKey(false);}} className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'reel' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <Video size={16} /> Viral Video Reel
            </button>
            <button onClick={() => {setActiveMode('create'); handleGenerate('facebook');}} className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'create' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <MessageSquareQuote size={16} /> Marketing Captions
            </button>
            <button onClick={() => {setActiveMode('status'); handleGenerate();}} className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'status' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <Smartphone size={16} /> WhatsApp Status
            </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            <div className="md:w-2/5 bg-slate-50 dark:bg-slate-950 flex flex-col p-8 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-[2rem] border-4 border-primary-500/30 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkle size={40} className="animate-spin-slow" />
                        </div>
                        <Play size={56} className="text-primary-500 mb-6 animate-pulse" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Content Lab</h3>
                        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed font-black uppercase tracking-widest">
                            2026 Strategy Optimized
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Quality Check</h4>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                           <ShieldCheck size={14} className="text-emerald-500" /> Professional Grade
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                           <Video size={14} className="text-primary-500" /> Google Veo Render
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                           <Facebook size={14} className="text-blue-500" /> Social Optimized
                        </div>
                    </div>

                    <button 
                        onClick={() => handleGenerate()} 
                        disabled={isGenerating} 
                        className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                        {isGenerating ? 'Rendering Media...' : (videoBlobUrl ? 'Re-Generate' : 'Render Viral Reel')}
                    </button>
                </div>
            </div>

            <div className="md:w-3/5 flex flex-col bg-white dark:bg-slate-900 relative">
                {needsApiKey && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 p-8 text-center animate-fade-in">
                        <div className="p-6 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 mb-6">
                            <Key size={48} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Paid API Key Required</h4>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm font-medium">
                            Video rendering requires a valid paid API key from Google AI Studio. Please select your key to begin.
                        </p>
                        <button 
                            onClick={handleSelectKey}
                            className="px-12 py-5 bg-slate-950 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
                        >
                            Select Your Key
                        </button>
                    </div>
                )}

                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                        {activeMode === 'reel' ? 'Studio Preview' : 'Draft Editor'}
                    </h4>
                </div>

                <div className="flex-grow p-8 overflow-y-auto flex flex-col items-center justify-center">
                    {activeMode === 'reel' ? (
                        videoBlobUrl ? (
                            <div className="w-full h-full max-w-[360px] aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-slate-100 dark:border-slate-800 group relative">
                                <video 
                                    src={videoBlobUrl} 
                                    controls 
                                    autoPlay 
                                    loop 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href={videoBlobUrl} download={`${menuTitle}_Reel.mp4`} className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                                        <Download size={20} />
                                    </a>
                                </div>
                            </div>
                        ) : isGenerating ? (
                            <div className="text-center space-y-6">
                                <div className="relative">
                                    <div className="w-24 h-24 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
                                    <Play size={32} className="absolute inset-0 m-auto text-primary-500 animate-pulse" />
                                </div>
                                <div>
                                    <h5 className="text-xl font-black text-slate-900 dark:text-white mb-2">{LOADING_MESSAGES[loadingStep]}</h5>
                                    <p className="text-sm text-slate-500 font-medium">Veo 3.1 Fast is building your assets.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                    <Video size={40} />
                                </div>
                                <h5 className="text-lg font-black text-slate-400 uppercase tracking-widest">Ready to Render</h5>
                                <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto font-medium">Transform this menu into a cinematic 9:16 vertical reel automatically.</p>
                            </div>
                        )
                    ) : (
                        <textarea 
                            className="w-full h-full min-h-[300px] resize-none border-none focus:ring-0 bg-transparent text-slate-800 dark:text-slate-200 text-lg leading-relaxed font-medium" 
                            value={editedContent} 
                            onChange={(e) => setEditedContent(e.target.value)} 
                            placeholder={isGenerating ? "AI is architecting content..." : "Click generate to see your viral captions."}
                        />
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    {activeMode === 'reel' ? (
                        <button 
                            disabled={!videoBlobUrl || isGenerating}
                            className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black shadow-xl hover:bg-primary-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            <Download size={20} /> Save Reel to Device
                        </button>
                    ) : (
                        <button 
                            onClick={handleCopyText} 
                            disabled={!editedContent || isGenerating}
                            className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            {copiedText ? <Check size={20} className="text-green-400" /> : <Copy size={20} />} 
                            {copiedText ? 'Copied Successfully!' : 'Copy to Social Media'}
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal;
