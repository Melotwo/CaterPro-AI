
import React, { useState, useEffect } from 'react';
import { X, Copy, Image as ImageIcon, Check, RefreshCw, Linkedin, Twitter, MessageCircle, Send, Film, Play, Zap, GraduationCap, ArrowRight, Loader2, Mail, Pin } from 'lucide-react';
import { generateSocialCaption, generateSocialVideoFromApi, generateAssignmentEmail } from '../services/geminiService';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | undefined;
  menuTitle: string;
  menuDescription: string;
  initialMode?: Mode;
}

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'pinterest';
type Mode = 'create' | 'pitch' | 'video';

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ 
  isOpen, onClose, image, menuTitle, menuDescription, initialMode = 'create'
}) => {
  const [activeMode, setActiveMode] = useState<Mode>(initialMode);
  const [activePlatform, setActivePlatform] = useState<Platform>('instagram');
  const [editedContent, setEditedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      setEditedContent('');
      setVideoUrl(null);
      
      if (initialMode === 'pitch') {
        handleGenerate('instagram');
      } else if (initialMode === 'create') {
        handleGenerate('instagram');
      }
    }
  }, [isOpen, initialMode]);

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
      }
    } catch (e) {
      setEditedContent("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(editedContent).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  const handleModeChange = (mode: Mode) => {
    setActiveMode(mode);
    setEditedContent('');
    setVideoUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[scale-up_0.2s_ease-out] flex flex-col h-[90dvh]">
        
        <button onClick={onClose} className="absolute top-5 right-5 p-2 z-20 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 rounded-full transition-colors">
          <X size={20} />
        </button>

        {/* Tab Navigation */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 p-3 flex gap-2 overflow-x-auto no-scrollbar">
            <button 
                onClick={() => handleModeChange('create')} 
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'create' ? 'bg-white dark:bg-slate-700 shadow-md text-primary-600' : 'text-slate-500'}`}
            >
                <ImageIcon size={16} /> Social Post
            </button>
            <button 
                onClick={() => handleModeChange('pitch')} 
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'pitch' ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600' : 'text-slate-500'}`}
            >
                <GraduationCap size={16} /> Assignment Pitch
            </button>
            <button 
                onClick={() => handleModeChange('video')} 
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'video' ? 'bg-white dark:bg-slate-700 shadow-md text-purple-600' : 'text-slate-500'}`}
            >
                <Film size={16} /> Reel Maker
            </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            {/* Left Panel: Preview/Controls */}
            <div className="md:w-1/2 bg-slate-50 dark:bg-slate-950 flex flex-col p-8 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
                {activeMode === 'pitch' ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
                        <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
                            <GraduationCap className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-xl font-bold">Pitch to Limpopo Chefs</h3>
                            <p className="text-blue-100 text-sm mt-2">Drafing your Coursera assignment for <strong>info@limpopochefs.co.za</strong>.</p>
                        </div>
                        <button 
                            onClick={() => handleGenerate()} 
                            disabled={isGenerating} 
                            className="w-full max-w-sm bg-white dark:bg-slate-800 text-blue-600 px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg border-2 border-blue-100 dark:border-blue-900 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                            {isGenerating ? 'Drafting Email...' : 'Regenerate Assignment Draft'}
                        </button>
                    </div>
                ) : activeMode === 'create' ? (
                    <div className="space-y-6">
                        <div className="max-w-md mx-auto relative group">
                            {image ? (
                                <img src={`data:image/png;base64,${image}`} className="w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800" alt="Preview" />
                            ) : (
                                <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                                    <ImageIcon size={48} className="text-slate-400" />
                                </div>
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
                        <button 
                            onClick={() => handleGenerate()} 
                            disabled={isGenerating} 
                            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                            {isGenerating ? 'Writing AI Content...' : `Write for ${activePlatform}`}
                        </button>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6">
                        <div className="aspect-[9/16] w-full max-w-[280px] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center relative">
                            {isGenerating ? (
                                <div className="text-center p-6">
                                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                                    <p className="text-xs font-bold text-slate-500 animate-pulse">Veo AI is painting your scene...</p>
                                </div>
                            ) : videoUrl ? (
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
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by Google Veo</p>
                    </div>
                )}
            </div>

            {/* Right Panel: Content Editor */}
            <div className="md:w-1/2 flex flex-col bg-white dark:bg-slate-900">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">
                        {activeMode === 'pitch' ? 'Email Content' : 'AI Content Output'}
                    </h4>
                    {isGenerating && <Loader2 size={16} className="text-primary-500 animate-spin" />}
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto">
                    {isGenerating && !editedContent ? (
                        <div className="space-y-4">
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full animate-pulse delay-75"></div>
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6 animate-pulse delay-150"></div>
                        </div>
                    ) : (
                        <textarea 
                            className="w-full h-full min-h-[300px] resize-none border-none focus:ring-0 bg-transparent text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium" 
                            value={editedContent} 
                            onChange={(e) => setEditedContent(e.target.value)} 
                            placeholder={isGenerating ? "Drafting..." : "Generate content to start editing..."}
                        />
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button 
                        onClick={handleCopyText} 
                        disabled={!editedContent}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {copiedText ? <Check size={20} /> : (activeMode === 'pitch' ? <Mail size={20} /> : <Copy size={20} />)} 
                        {copiedText ? 'Copied!' : (activeMode === 'pitch' ? 'Copy Email to Clipboard' : 'Copy Content')}
                    </button>
                    {activeMode === 'pitch' && (
                        <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-tighter">
                            Send to info@limpopochefs.co.za
                        </p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal
