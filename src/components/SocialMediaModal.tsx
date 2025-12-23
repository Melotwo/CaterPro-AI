
import React, { useState, useEffect } from 'react';
import { X, Copy, Image as ImageIcon, Check, RefreshCw, Linkedin, Twitter, MessageCircle, Send, Film, Play, Zap, GraduationCap, ArrowRight, Loader2, Mail, Pin, Sparkles, Mic2, Layout, Video } from 'lucide-react';
import { generateSocialCaption, generateSocialVideoFromApi, generateAssignmentEmail, generateMenuImageFromApi, generatePodcastStoryboard, generateExplainerScript } from '../services/geminiService';

export type Mode = 'create' | 'pitch' | 'video' | 'podcast' | 'explainer';

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
      
      if (initialMode !== 'video' && initialMode !== 'podcast' && initialMode !== 'explainer') {
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
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[scale-up_0.2s_ease-out] flex flex-col h-[90dvh]">
        
        <button onClick={onClose} className="absolute top-5 right-5 p-2 z-20 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 rounded-full transition-colors shadow-sm">
          <X size={20} />
        </button>

        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 p-3 flex gap-2 overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setActiveMode('create')} 
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'create' ? 'bg-white dark:bg-slate-700 shadow-md text-primary-600' : 'text-slate-500'}`}
            >
                <ImageIcon size={16} /> Social Post
            </button>
            <button 
                onClick={() => setActiveMode('explainer')} 
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'explainer' ? 'bg-white dark:bg-slate-700 shadow-md text-amber-600' : 'text-slate-500'}`}
            >
                <Video size={16} /> Explainer Script
            </button>
            <button 
                onClick={() => setActiveMode('podcast')} 
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'podcast' ? 'bg-white dark:bg-slate-700 shadow-md text-amber-600' : 'text-slate-500'}`}
            >
                <Mic2 size={16} /> Podcast Storyboard
            </button>
            <button 
                onClick={() => setActiveMode('pitch')} 
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'pitch' ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600' : 'text-slate-500'}`}
            >
                <GraduationCap size={16} /> Assignment Pitch
            </button>
            <button 
                onClick={() => setActiveMode('video')} 
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'video' ? 'bg-white dark:bg-slate-700 shadow-md text-purple-600' : 'text-slate-500'}`}
            >
                <Film size={16} /> Reel Maker
            </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            <div className="md:w-1/2 bg-slate-50 dark:bg-slate-950 flex flex-col p-8 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
                {activeMode === 'create' ? (
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
                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Image Found</h4>
                                    <p className="text-xs text-slate-500 mt-2 mb-6">Create a high-end visual for your post.</p>
                                    <button 
                                        onClick={handleGenerateImage}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-primary-700 transition-all"
                                    >
                                        <Sparkles size={14} /> Generate AI Photo
                                    </button>
                                </div>
                            )}
                            {currentImage && !isGeneratingImage && (
                                <button 
                                    onClick={handleGenerateImage}
                                    className="absolute bottom-4 right-4 p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-primary-600 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Regenerate Photo"
                                >
                                    <RefreshCw size={20} />
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {(['instagram', 'linkedin', 'twitter', 'pinterest'] as Platform[]).map(p => (
                                <button 
                                    key={p} 
                                    onClick={() => { setActivePlatform(p); handleGenerate(p); }}
                                    className={`py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${activePlatform === p ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white dark:bg-slate-800 border-transparent text-slate-500'}`}
                                >
                                    {p === 'instagram' && <ImageIcon size={18} />}
                                    {p === 'linkedin' && <Linkedin size={18} />}
                                    {p === 'twitter' && <Twitter size={18} />}
                                    {p === 'pinterest' && <Pin size={18} />}
                                    <span className="text-[10px] font-bold uppercase">{p}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : activeMode === 'explainer' ? (
                    <div className="space-y-6">
                        <div className="bg-primary-50 dark:bg-primary-900/20 p-8 rounded-3xl border-2 border-primary-100 dark:border-primary-800 flex flex-col items-center text-center">
                            <Video size={48} className="text-primary-600 mb-4" />
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Explainer Architect</h3>
                            <p className="text-sm text-slate-500 mt-2">
                                I will write a script for your videographer that bridges **React Engineering** and **Food Safety HACCP**.
                            </p>
                        </div>
                        <button 
                            onClick={() => handleGenerate()} 
                            disabled={isGenerating} 
                            className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-primary-700 transition-all"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                            {isGenerating ? 'Architecting...' : 'Generate Explainer Script'}
                        </button>
                    </div>
                ) : activeMode === 'podcast' ? (
                    <div className="space-y-6">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-8 rounded-3xl border-2 border-amber-200 dark:border-amber-800 flex flex-col items-center text-center">
                            <Mic2 size={48} className="text-amber-600 mb-4" />
                            <h3 className="text-xl font-black text-amber-900 dark:text-amber-100">Podcast to Video Lab</h3>
                            <p className="text-sm text-amber-800 dark:text-amber-300 mt-2">
                                Turn your <strong>NotebookLM Deep Dive</strong> into a cinematic video. I will create a scene-by-scene storyboard.
                            </p>
                        </div>
                        <button 
                            onClick={() => handleGenerate()} 
                            disabled={isGenerating} 
                            className="w-full py-5 bg-amber-500 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-amber-600 transition-all"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Layout size={20} />}
                            {isGenerating ? 'Drafting Storyboard...' : 'Generate 60s Storyboard'}
                        </button>
                    </div>
                ) : activeMode === 'pitch' ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
                        <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
                            <GraduationCap className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-xl font-bold">Pitch to Limpopo Chefs</h3>
                            <p className="text-blue-100 text-sm mt-2">Drafting your Coursera assignment email.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6">
                        <div className="aspect-[9/16] w-full max-w-[280px] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center relative">
                            {videoUrl ? (
                                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-6">
                                    <Film size={48} className="text-slate-400 mx-auto mb-4" />
                                    <p className="text-xs font-bold text-slate-500">Ready to create a viral Reel</p>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => handleGenerate()} 
                            disabled={isGenerating} 
                            className="w-full max-w-sm py-4 bg-purple-600 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                            {isGenerating ? 'Generating Video...' : 'Create Cinematic Reel'}
                        </button>
                    </div>
                )}
            </div>

            <div className="md:w-1/2 flex flex-col bg-white dark:bg-slate-900">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">
                        {activeMode === 'podcast' || activeMode === 'explainer' ? 'Production Script' : 'AI Output'}
                    </h4>
                    {isGenerating && <Loader2 size={16} className="text-primary-500 animate-spin" />}
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto">
                    <textarea 
                        className="w-full h-full min-h-[300px] resize-none border-none focus:ring-0 bg-transparent text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium" 
                        value={editedContent} 
                        onChange={(e) => setEditedContent(e.target.value)} 
                        placeholder={isGenerating ? "Drafting..." : "Generate content to start editing..."}
                    />
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button 
                        onClick={handleCopyText} 
                        disabled={!editedContent}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {copiedText ? <Check size={20} /> : <Copy size={20} />} 
                        {copiedText ? 'Copied!' : 'Copy Content'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal;
