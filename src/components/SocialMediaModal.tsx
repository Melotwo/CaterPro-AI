
import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Facebook, Twitter, Instagram, Video, Loader2, Smartphone, MessageSquareQuote, Activity, Pin, Flame } from 'lucide-react';
import { generateSocialCaption, generateVideoFromApi, generateWhatsAppStatus } from '../services/geminiService';

export type Mode = 'create' | 'pitch' | 'video' | 'status' | 'reel' | 'formula';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | undefined;
  menuTitle: string;
  menuDescription: string;
  initialMode?: Mode;
  onImageGenerated?: (base64: string) => void;
}

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'tiktok' | 'pinterest' | 'reddit';

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ 
  isOpen, onClose, image, menuTitle, menuDescription, initialMode = 'create'
}) => {
  const [activeMode, setActiveMode] = useState<Mode>(initialMode);
  const [activePlatform, setActivePlatform] = useState<Platform>('facebook');
  const [editedContent, setEditedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      if (initialMode !== 'reel') {
        handleGenerate(initialMode === 'create' ? 'facebook' : undefined);
      }
    }
  }, [isOpen, initialMode]);

  const handleGenerate = async (platformOverride?: Platform) => {
    const platform = platformOverride || activePlatform;
    setIsGenerating(true);
    setEditedContent('');
    try {
      if (activeMode === 'create') {
        const caption = await generateSocialCaption(menuTitle || "CaterPro AI System", menuDescription || "Automating catering for 2026.", platform);
        setEditedContent(caption);
      } else if (activeMode === 'status') {
        const status = await generateWhatsAppStatus(menuTitle || "CaterPro AI");
        setEditedContent(status);
      } else if (activeMode === 'formula') {
        const formulaScript = `[HOOK]\n"Stop wasting time on ${menuTitle || 'admin'}. It's 2026."\n\n[VALUE]\n"I built an AI that generates full catering proposals in 30 seconds."\n\n[PROOF]\n"It's saved me 15 hours of typing this week."\n\n[OFFER]\n"Comment 'CHEF' below for the link."`;
        setEditedContent(formulaScript);
      }
    } catch (e: any) {
       setEditedContent("Strategy session timed out. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/90 backdrop-blur-md animate-fade-in"></div>
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-none sm:rounded-[3.5rem] shadow-2xl overflow-hidden animate-scale-up flex flex-col h-full sm:h-[90dvh]">
        
        <div className="bg-slate-50 dark:bg-slate-800 p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Marketing & Strategy Console</h3>
            <button onClick={onClose} className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm hover:scale-110 transition-transform"><X size={20} /></button>
        </div>

        <div className="flex bg-white dark:bg-slate-950 p-3 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar gap-3">
            {[
                { id: 'create', icon: MessageSquareQuote, label: 'Captions' },
                { id: 'formula', icon: Activity, label: 'Formula' },
                { id: 'status', icon: Smartphone, label: 'WhatsApp' },
                { id: 'reel', icon: Video, label: 'Reel Render' }
            ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => { setActiveMode(m.id as Mode); if(m.id !== 'reel') handleGenerate(); }}
                  className={`flex-1 min-w-[120px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${activeMode === m.id ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                >
                    <m.icon size={16} /> {m.label}
                </button>
            ))}
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            {activeMode === 'create' && (
                <div className="md:w-1/4 bg-slate-50 dark:bg-slate-950 p-4 border-r border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar flex md:flex-col gap-3">
                    {[
                        { id: 'facebook', icon: Facebook, label: 'Facebook' },
                        { id: 'twitter', icon: Twitter, label: 'X (Twitter)' },
                        { id: 'instagram', icon: Instagram, label: 'Instagram' },
                        { id: 'pinterest', icon: Pin, label: 'Pinterest' },
                        { id: 'reddit', icon: Flame, label: 'Reddit' }
                    ].map(p => (
                        <button 
                          key={p.id}
                          onClick={() => { setActivePlatform(p.id as Platform); handleGenerate(p.id as Platform); }}
                          className={`flex items-center gap-3 px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activePlatform === p.id ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md border-2 border-indigo-100 dark:border-indigo-900 scale-105' : 'text-slate-400 hover:text-slate-500'}`}
                        >
                            <p.icon size={18} /> {p.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-grow flex flex-col relative bg-white dark:bg-slate-900 overflow-hidden">
                <div className="flex-grow p-10 overflow-y-auto custom-scrollbar">
                    {isGenerating ? (
                        <div className="h-full flex flex-col items-center justify-center animate-pulse">
                            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-6" />
                            <p className="font-black text-slate-400 uppercase text-[10px] tracking-[0.4em]">Gemini is Architecting Post...</p>
                        </div>
                    ) : (
                        <textarea 
                            className="w-full h-full min-h-[350px] resize-none border-none focus:ring-0 bg-transparent text-slate-800 dark:text-slate-200 text-xl leading-relaxed font-medium" 
                            value={editedContent} 
                            onChange={(e) => setEditedContent(e.target.value)} 
                            placeholder="Select a platform to generate your 2026 strategy post."
                        />
                    )}
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                    <button 
                        onClick={() => { navigator.clipboard.writeText(editedContent); setCopiedText(true); setTimeout(() => setCopiedText(false), 2000); }}
                        disabled={!editedContent}
                        className="w-full py-6 bg-slate-950 dark:bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 transition-all"
                    >
                        {copiedText ? <Check size={20} /> : <Copy size={20} />}
                        {copiedText ? 'Post Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal;
