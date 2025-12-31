
import React, { useState, useEffect } from 'react';
import { X, Copy, Image as ImageIcon, Check, RefreshCw, Linkedin, Twitter, MessageCircle, Send, Film, Play, Zap, GraduationCap, ArrowRight, Loader2, Mail, Pin, Sparkles, Mic2, Layout, Video, ShieldCheck, Sparkle } from 'lucide-react';
import { generateSocialCaption, generateSocialVideoFromApi, generateAssignmentEmail, generateMenuImageFromApi, generatePodcastStoryboard, generateExplainerScript, generateProvanceVSLScript, generateNewYearLaunchScript } from '../services/geminiService';

export type Mode = 'create' | 'pitch' | 'video' | 'podcast' | 'explainer' | 'provance' | 'newyear';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | undefined;
  menuTitle: string;
  menuDescription: string;
  initialMode?: Mode;
  onImageGenerated?: (base64: string) => void;
}

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'pinterest';

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ 
  isOpen, onClose, image, menuTitle, menuDescription, initialMode = 'create', onImageGenerated
}) => {
  const [activeMode, setActiveMode] = useState<Mode>(initialMode);
  const [activePlatform, setActivePlatform] = useState<Platform>('instagram');
  const [editedContent, setEditedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | undefined>(image);

  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      setEditedContent('');
      setVideoUrl(null);
      setCurrentImage(image);
      
      if (initialMode !== 'video' && initialMode !== 'podcast' && initialMode !== 'explainer' && initialMode !== 'provance' && initialMode !== 'newyear') {
        handleGenerate(activePlatform);
      }
    }
  }, [isOpen, initialMode, image]);

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
        const base64 = await generateMenuImageFromApi(menuTitle, menuDescription);
        setCurrentImage(base64);
        if (onImageGenerated) onImageGenerated(base64);
    } catch (e) {
        console.error("Failed to generate image", e);
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleGenerate = async (platformOverride?: Platform) => {
    const platform = platformOverride || activePlatform;
    setIsGenerating(true);
    try {
      if (activeMode === 'pitch') {
        const email = await generateAssignmentEmail(menuTitle, menuDescription);
        setEditedContent(email);
      } else if (activeMode === 'create') {
        const caption = await generateSocialCaption(menuTitle, menuDescription, platform);
        setEditedContent(caption);
      } else if (activeMode === 'video') {
        const url = await generateSocialVideoFromApi(menuTitle, menuDescription);
        setVideoUrl(url);
      } else if (activeMode === 'podcast') {
        const storyboard = await generatePodcastStoryboard(menuTitle, menuDescription);
        setEditedContent(storyboard);
      } else if (activeMode === 'explainer') {
        const script = await generateExplainerScript(menuTitle, menuDescription);
        setEditedContent(script);
      } else if (activeMode === 'provance') {
        const script = await generateProvanceVSLScript(menuTitle, menuDescription);
        setEditedContent(script);
      } else if (activeMode === 'newyear') {
        const script = await generateNewYearLaunchScript(menuTitle, menuDescription);
        setEditedContent(script);
      }
    } catch (e) {
      setEditedContent("AI is busy in the kitchen. Please try again in a moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    const content = editedContent || '';
    navigator.clipboard.writeText(content).then(() => {
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
            <button onClick={() => setActiveMode('newyear')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'newyear' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500'}`}>
                <Sparkle size={16} /> New Year 2025
            </button>
            <button onClick={() => setActiveMode('create')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'create' ? 'bg-white dark:bg-slate-700 shadow-md text-primary-600' : 'text-slate-500'}`}>
                <ImageIcon size={16} /> Social Post
            </button>
            <button onClick={() => setActiveMode('provance')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'provance' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500'}`}>
                <ShieldCheck size={16} /> Provance VSL
            </button>
            <button onClick={() => setActiveMode('explainer')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'explainer' ? 'bg-white dark:bg-slate-700 shadow-md text-emerald-600' : 'text-slate-500'}`}>
                <Video size={16} /> Explainer
            </button>
            <button onClick={() => setActiveMode('podcast')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'podcast' ? 'bg-white dark:bg-slate-700 shadow-md text-amber-600' : 'text-slate-500'}`}>
                <Mic2 size={16} /> Podcast Lab
            </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            <div className="md:w-1/2 bg-slate-50 dark:bg-slate-950 flex flex-col p-8 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
                {activeMode === 'newyear' ? (
                   <div className="space-y-6">
                      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-8 rounded-3xl border-4 border-indigo-500/30 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl"></div>
                          <Sparkle size={56} className="text-amber-400 mb-6 animate-pulse" />
                          <h3 className="text-2xl font-black uppercase tracking-tighter">New Year Launch Script</h3>
                          <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                              Position CaterPro AI as the #1 resolution for chefs in 2025. This script follows the Neil Patel "Direct & High Energy" framework.
                          </p>
                      </div>
                      <button 
                          onClick={() => handleGenerate()} 
                          disabled={isGenerating} 
                          className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95"
                      >
                          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="fill-white" />}
                          {isGenerating ? 'Writing Resolution...' : 'Build 2025 Launch Script'}
                      </button>
                   </div>
                ) : activeMode === 'create' ? (
                    <div className="space-y-6">
                        <div className="max-w-md mx-auto relative group">
                            {isGeneratingImage ? (
                                <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-primary-300 animate-pulse">
                                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
                                    <p className="text-xs font-bold text-slate-500">AI is styling your dish...</p>
                                </div>
                            ) : currentImage ? (
                                <img src={`data:image/png;base64,${currentImage}`} className="w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800" alt="Preview" />
                            ) : (
                                <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
                                    <ImageIcon size={48} className="text-slate-400 mb-4" />
                                    <button onClick={handleGenerateImage} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-primary-700 transition-all">
                                        <Sparkles size={14} /> Generate AI Photo
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {(['instagram', 'linkedin', 'twitter', 'pinterest'] as Platform[]).map(p => (
                                <button key={p} onClick={() => { setActivePlatform(p); handleGenerate(p); }} className={`py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${activePlatform === p ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white dark:bg-slate-800 border-transparent text-slate-500'}`}>
                                    <span className="text-[10px] font-bold uppercase">{p}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <button onClick={() => handleGenerate()} disabled={isGenerating} className="w-full max-w-sm py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl">
                            {isGenerating ? 'Drafting...' : 'Build Script'}
                        </button>
                    </div>
                )}
            </div>

            <div className="md:w-1/2 flex flex-col bg-white dark:bg-slate-900">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">AI Script Architect</h4>
                    {isGenerating && <Loader2 size={16} className="text-primary-500 animate-spin" />}
                </div>
                <div className="flex-grow p-6 overflow-y-auto">
                    <textarea 
                        className="w-full h-full min-h-[300px] resize-none border-none focus:ring-0 bg-transparent text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium" 
                        value={editedContent} 
                        onChange={(e) => setEditedContent(e.target.value)} 
                        placeholder={isGenerating ? "Drafting strategy..." : "Generate content to start editing..."}
                    />
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button 
                        onClick={handleCopyText} 
                        disabled={!editedContent}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {copiedText ? <Check size={20} /> : <Copy size={20} />} 
                        {copiedText ? 'Copied!' : 'Copy Script'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal;
