
import React, { useState, useEffect } from 'react';
import { X, Copy, Image as ImageIcon, Check, RefreshCw, Linkedin, Twitter, MessageCircle, Send, Film, Play, Zap, GraduationCap, ArrowRight, Loader2, Mail, Pin, Sparkles, Mic2, Layout, Video, ShieldCheck, Sparkle, Volume2, Facebook } from 'lucide-react';
import { generateSocialCaption, generateSocialVideoFromApi, generateAssignmentEmail, generateMenuImageFromApi, generatePodcastStoryboard, generateExplainerScript, generateProvanceVSLScript, generateNewYearLaunchScript } from '../services/geminiService';

export type Mode = 'create' | 'pitch' | 'video' | 'podcast' | 'explainer' | 'provance' | 'newyear' | 'bait';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | undefined;
  menuTitle: string;
  menuDescription: string;
  initialMode?: Mode;
  onImageGenerated?: (base64: string) => void;
}

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook';

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ 
  isOpen, onClose, image, menuTitle, menuDescription, initialMode = 'create', onImageGenerated
}) => {
  const [activeMode, setActiveMode] = useState<Mode>(initialMode);
  const [activePlatform, setActivePlatform] = useState<Platform>('facebook');
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
      
      if (initialMode !== 'video' && initialMode !== 'podcast' && initialMode !== 'explainer' && initialMode !== 'provance' && initialMode !== 'newyear' && initialMode !== 'bait') {
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
      if (activeMode === 'create') {
        const caption = await generateSocialCaption(menuTitle, menuDescription, platform);
        setEditedContent(caption);
      } else if (activeMode === 'newyear') {
        const script = await generateNewYearLaunchScript(menuTitle, menuDescription);
        setEditedContent(script);
      } else if (activeMode === 'provance') {
        const script = await generateProvanceVSLScript(menuTitle, menuDescription);
        setEditedContent(script);
      } else if (activeMode === 'bait') {
        const script = await generateSocialCaption(menuTitle, menuDescription, 'facebook');
        setEditedContent(script);
      }
    } catch (e) {
      setEditedContent("AI is busy. Please try again.");
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
            <button onClick={() => setActiveMode('bait')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'bait' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500'}`}>
                <MessageCircle size={16} /> FB Group Hook
            </button>
            <button onClick={() => setActiveMode('newyear')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'newyear' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>
                <Sparkle size={16} /> 2026 Launch
            </button>
            <button onClick={() => setActiveMode('provance')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'provance' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500'}`}>
                <ShieldCheck size={16} /> Provance Framework
            </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            <div className="md:w-1/2 bg-slate-50 dark:bg-slate-950 flex flex-col p-8 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
                {activeMode === 'bait' ? (
                   <div className="space-y-6">
                      <div className="bg-amber-500 text-white p-8 rounded-3xl border-4 border-amber-600/30 flex flex-col items-center text-center shadow-2xl">
                          <MessageCircle size={56} className="text-white mb-6 animate-bounce" />
                          <h3 className="text-2xl font-black uppercase tracking-tighter">Engagement Bait Lab</h3>
                          <p className="text-xs text-amber-900 mt-4 leading-relaxed font-bold">
                              This mode generates posts WITHOUT links. Why? Because links get blocked in groups. Use this to get 100+ comments, then reply with your link!
                          </p>
                      </div>
                      <button 
                          onClick={() => handleGenerate()} 
                          disabled={isGenerating} 
                          className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                          {isGenerating ? 'Drafting Hook...' : 'Build FB Group Hook'}
                      </button>
                   </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <button onClick={() => handleGenerate()} disabled={isGenerating} className="w-full max-w-sm py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl">
                            {isGenerating ? 'Thinking...' : 'Generate Content'}
                        </button>
                    </div>
                )}
            </div>

            <div className="md:w-1/2 flex flex-col bg-white dark:bg-slate-900">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Launch Architect Output</h4>
                </div>
                <div className="flex-grow p-6 overflow-y-auto">
                    <textarea 
                        className="w-full h-full min-h-[300px] resize-none border-none focus:ring-0 bg-transparent text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-bold" 
                        value={editedContent} 
                        onChange={(e) => setEditedContent(e.target.value)} 
                        placeholder="Your viral post will appear here..."
                    />
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button 
                        onClick={handleCopyText} 
                        disabled={!editedContent}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        {copiedText ? <Check size={20} /> : <Copy size={20} />} 
                        {copiedText ? 'Copied!' : 'Copy to Facebook'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal;
