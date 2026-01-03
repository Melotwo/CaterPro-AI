
import React, { useState, useEffect } from 'react';
import { X, Copy, Image as ImageIcon, Check, RefreshCw, Linkedin, Twitter, MessageCircle, Send, Film, Play, Zap, GraduationCap, ArrowRight, Loader2, Mail, Pin, Sparkles, Mic2, Layout, Video, ShieldCheck, Sparkle, Target, MessageSquareQuote, Smartphone, Camera } from 'lucide-react';
import { generateSocialCaption, generateMenuImageFromApi, generateVideoReelScript, generateWhatsAppStatus, generateProvanceVSLScript, generateNewYearLaunchScript } from '../services/geminiService';

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

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ 
  isOpen, onClose, image, menuTitle, menuDescription, initialMode = 'create', onImageGenerated
}) => {
  const [activeMode, setActiveMode] = useState<Mode>(initialMode);
  const [activePlatform, setActivePlatform] = useState<Platform>('tiktok');
  const [editedContent, setEditedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      setEditedContent('');
      if (initialMode === 'create') handleGenerate('tiktok');
      else handleGenerate();
    }
  }, [isOpen, initialMode]);

  const handleGenerate = async (platformOverride?: Platform) => {
    const platform = platformOverride || activePlatform;
    setIsGenerating(true);
    try {
      if (activeMode === 'create') {
        const caption = await generateSocialCaption(menuTitle, menuDescription, platform);
        setEditedContent(caption);
      } else if (activeMode === 'status') {
        const status = await generateWhatsAppStatus(menuTitle);
        setEditedContent(status);
      } else if (activeMode === 'reel') {
        const script = await generateVideoReelScript(menuTitle, menuDescription);
        setEditedContent(script);
      } else if (activeMode === 'provance') {
        const script = await generateProvanceVSLScript(menuTitle, menuDescription);
        setEditedContent(script);
      } else if (activeMode === 'newyear') {
        const script = await generateNewYearLaunchScript(menuTitle, menuDescription);
        setEditedContent(script);
      }
    } catch (e) {
      setEditedContent("AI is busy. Please try again.");
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
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[scale-up_0.2s_ease-out] flex flex-col h-[90dvh]">
        
        <button onClick={onClose} className="absolute top-5 right-5 p-2 z-20 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 rounded-full transition-colors shadow-sm">
          <X size={20} />
        </button>

        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 p-3 flex gap-2 overflow-x-auto no-scrollbar">
            <button onClick={() => {setActiveMode('reel'); handleGenerate();}} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'reel' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500'}`}>
                <Camera size={16} /> TikTok/Reel Script
            </button>
            <button onClick={() => {setActiveMode('status'); handleGenerate();}} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'status' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500'}`}>
                <Smartphone size={16} /> WhatsApp Status
            </button>
            <button onClick={() => {setActiveMode('provance'); handleGenerate();}} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'provance' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500'}`}>
                <ShieldCheck size={16} /> Provance Framework
            </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            <div className="md:w-1/2 bg-slate-50 dark:bg-slate-950 flex flex-col p-8 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-3xl border-4 border-primary-500/30 flex flex-col items-center text-center shadow-2xl">
                        <Play size={56} className="text-primary-500 mb-6 animate-pulse" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Social Video Lab</h3>
                        <p className="text-xs text-slate-400 mt-4 leading-relaxed font-medium">
                            Generate short-form content that converts. POV shots, fast editing cues, and psychological hooks for Chefs.
                        </p>
                    </div>
                    <button 
                        onClick={() => handleGenerate()} 
                        disabled={isGenerating} 
                        className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        {isGenerating ? 'Thinking...' : 'Regenerate Content'}
                    </button>
                </div>
            </div>

            <div className="md:w-1/2 flex flex-col bg-white dark:bg-slate-900">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Content Draft</h4>
                </div>
                <div className="flex-grow p-6 overflow-y-auto">
                    <textarea 
                        className="w-full h-full min-h-[300px] resize-none border-none focus:ring-0 bg-transparent text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-bold" 
                        value={editedContent} 
                        onChange={(e) => setEditedContent(e.target.value)} 
                    />
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button 
                        onClick={handleCopyText} 
                        disabled={!editedContent}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        {copiedText ? <Check size={20} /> : <Copy size={20} />} 
                        {copiedText ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal;
