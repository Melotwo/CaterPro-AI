import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Image as ImageIcon, Check, RefreshCw, Smartphone, Linkedin, Twitter, Facebook, MessageCircle, Send, Film, Play, Download, Zap, Rocket, AlertCircle, Quote, Pin, UserCircle } from 'lucide-react';
import { generateSocialReply, generateSocialCaption, generateSocialVideoFromApi, generateViralHook, VideoStyle, generateFounderMarketingPost, generateInstagramBio } from '../services/geminiService';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | undefined;
  caption: string;
  onRegenerateCaption: () => void;
  isRegenerating: boolean;
  menuTitle: string;
  menuDescription: string;
  initialMode?: 'create' | 'reply' | 'video' | 'sell' | 'profile';
}

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'pinterest';
type Mode = 'create' | 'reply' | 'video' | 'sell' | 'profile';
type Tone = 'chef-to-chef' | 'professional' | 'supportive';

const PLATFORM_LIMITS = {
    twitter: 280,
    linkedin: 3000,
    instagram: 2200,
    facebook: 5000,
    pinterest: 500,
};

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ 
  isOpen, onClose, image, caption, onRegenerateCaption, isRegenerating, menuTitle, menuDescription, initialMode
}) => {
  const [activeMode, setActiveMode] = useState<Mode>('create');
  const [activePlatform, setActivePlatform] = useState<Platform>('linkedin');
  const [editedCaption, setEditedCaption] = useState(caption);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  
  const [viralHooks, setViralHooks] = useState('');
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  
  const [incomingComment, setIncomingComment] = useState('');
  const [replyContext, setReplyContext] = useState('');
  const [replyTone, setReplyTone] = useState<Tone>('chef-to-chef');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [videoStyle, setVideoStyle] = useState<VideoStyle>('cinematic');

  const [generatedBio, setGeneratedBio] = useState('');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedCaption(caption);
  }, [caption]);

  useEffect(() => {
    if (isOpen) {
      if (initialMode) setActiveMode(initialMode);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, initialMode]);

  const handlePlatformChange = async (platform: Platform) => {
      setActivePlatform(platform);
      try {
          setEditedCaption("Optimizing for " + platform + "...");
          let newCaption = '';
          if (activeMode === 'sell') {
              newCaption = await generateFounderMarketingPost(platform === 'facebook' ? 'instagram' : platform);
          } else {
              newCaption = await generateSocialCaption(menuTitle, menuDescription, platform === 'facebook' ? 'instagram' : platform);
          }
          setEditedCaption(newCaption);
      } catch (e) {
          setEditedCaption(caption); 
      }
  };

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
        const bio = await generateInstagramBio("Melotwo", "Saving chefs from the admin nightmare of holiday paperwork using AI. ADHD/Dyslexia-friendly tools.");
        setGeneratedBio(bio);
    } catch (e) {
        console.error(e);
    } finally {
        setIsGeneratingBio(false);
    }
  };
  
  const handleGenerateHooks = async () => {
      setIsGeneratingHooks(true);
      try {
          const hooks = await generateViralHook(menuTitle, menuDescription);
          setViralHooks(hooks);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingHooks(false);
      }
  };

  const handleGenerateReply = async () => {
      if (!incomingComment.trim()) return;
      setIsGeneratingReply(true);
      try {
          const reply = await generateSocialReply(incomingComment, replyContext, replyTone);
          setGeneratedReply(reply);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingReply(false);
      }
  };

  const handleGenerateVideo = async () => {
      setIsGeneratingVideo(true);
      setVideoError('');
      try {
          const url = await generateSocialVideoFromApi(menuTitle, menuDescription, videoStyle);
          setVideoUrl(url);
      } catch (e: any) {
          setVideoError(e.message || "Failed to generate video.");
      } finally {
          setIsGeneratingVideo(false);
      }
  };

  const handleCopyText = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyImage = async () => {
    if (!image) return;
    try {
      const response = await fetch(`data:image/png;base64,${image}`);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    } catch (err) {
      alert("Could not copy image. Right click > Save Image As...");
    }
  };

  const charLimit = PLATFORM_LIMITS[activePlatform] || 280;
  const isOverLimit = editedCaption.length > charLimit;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[scale-up_0.2s_ease-out] flex flex-col h-[90vh]">
        
        <button onClick={onClose} className="absolute top-3 right-3 p-2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors">
          <X size={20} />
        </button>

        <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 flex justify-center gap-2 overflow-x-auto">
            <button onClick={() => setActiveMode('create')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'create' ? 'bg-white dark:bg-slate-700 shadow text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>
                <ImageIcon size={18} /> Menu Post
            </button>
            <button onClick={() => setActiveMode('sell')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'sell' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>
                <Rocket size={18} /> Sell App
            </button>
            <button onClick={() => setActiveMode('profile')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'profile' ? 'bg-white dark:bg-slate-700 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>
                <UserCircle size={18} /> Bio Optimizer
            </button>
            <button onClick={() => setActiveMode('video')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'video' ? 'bg-white dark:bg-slate-700 shadow text-purple-600 dark:text-purple-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>
                <Film size={18} /> Reel Maker
            </button>
            <button onClick={() => setActiveMode('reply')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'reply' ? 'bg-white dark:bg-slate-700 shadow text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>
                <MessageCircle size={18} /> Reply Assistant
            </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        {activeMode === 'profile' ? (
            <div className="w-full flex flex-col p-8 bg-slate-50 dark:bg-slate-900/50 overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full text-center space-y-6">
                    <div className="bg-emerald-600 text-white p-8 rounded-2xl shadow-xl">
                        <UserCircle className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-xl font-bold">Fix Your Instagram Profile</h3>
                        <p className="text-emerald-100 text-sm mt-2">Your current bio is generic. Let's make it a high-converting machine that tells your founder story.</p>
                        <button onClick={handleGenerateBio} disabled={isGeneratingBio} className="mt-6 bg-white text-emerald-600 px-8 py-3 rounded-full font-black flex items-center gap-2 mx-auto hover:bg-emerald-50 shadow-lg disabled:opacity-50">
                            {isGeneratingBio ? <RefreshCw className="animate-spin" /> : <Zap size={18} />}
                            {isGeneratingBio ? 'Analyzing Brand...' : 'Generate Bio Options'}
                        </button>
                    </div>

                    {generatedBio && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-left animate-scale-up">
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Recommended Bios</h4>
                            <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-sm leading-loose">
                                {generatedBio}
                            </div>
                            <button onClick={() => handleCopyText(generatedBio, setCopiedText)} className="mt-6 w-full py-3 bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center gap-2">
                                {copiedText ? <Check size={18} /> : <Copy size={18} />} Copy All
                            </button>
                        </div>
                    )}
                </div>
            </div>
        ) : activeMode !== 'reply' ? (
            <>
                <div className="md:w-1/2 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center p-6 relative border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                    {activeMode === 'sell' ? (
                        <div className="max-w-sm w-full space-y-4">
                            <div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center">
                                <Rocket className="w-16 h-16 mb-4 animate-bounce" />
                                <h3 className="text-xl font-bold mb-2">Founder Launch Offer</h3>
                                <p className="text-indigo-100 text-sm">Join the first 50 chefs using CaterPro AI. Drop your lifetime link naturally in communities.</p>
                            </div>
                        </div>
                    ) : activeMode === 'create' ? (
                        image ? (
                            <div className="relative shadow-xl rounded-lg overflow-hidden group max-w-md w-full">
                                <img src={`data:image/png;base64,${image}`} alt="Post" className="w-full h-auto object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={handleCopyImage} className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                                        {copiedImage ? <Check size={18} /> : <ImageIcon size={18} />} {copiedImage ? 'Copied!' : 'Copy Image'}
                                    </button>
                                </div>
                            </div>
                        ) : <div className="text-slate-400 text-center"><ImageIcon size={48} className="mx-auto mb-2" /><p className="text-sm">No image available.</p></div>
                    ) : (
                        <div className="flex flex-col items-center w-full max-w-xs">
                            {videoUrl ? (
                                <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black w-full aspect-[9/16]">
                                    <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                                    <a href={videoUrl} download="caterpro.mp4" className="absolute bottom-4 right-4 p-2 bg-white/20 rounded-full backdrop-blur-md">
                                        <Download size={20} />
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl w-full">
                                    <Film size={48} className="mx-auto text-slate-300 mb-4" />
                                    <p className="text-slate-500 mb-6 text-sm">Generate Vertical Reel for TikTok/Reels.</p>
                                    <button onClick={handleGenerateVideo} disabled={isGeneratingVideo} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto disabled:opacity-50">
                                        {isGeneratingVideo ? <RefreshCw className="animate-spin" /> : <Play size={18} />}
                                        {isGeneratingVideo ? 'Generating...' : 'Create Reel'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="md:w-1/2 flex flex-col h-full bg-white dark:bg-slate-900">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex gap-2">
                                <button onClick={() => handlePlatformChange('linkedin')} className={`p-2 rounded-lg ${activePlatform === 'linkedin' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-700' : 'bg-slate-100 text-slate-400'}`}><Linkedin size={20} /></button>
                                <button onClick={() => handlePlatformChange('instagram')} className={`p-2 rounded-lg ${activePlatform === 'instagram' ? 'bg-pink-100 text-pink-600 ring-2 ring-pink-500' : 'bg-slate-100 text-slate-400'}`}><Smartphone size={20} /></button>
                                <button onClick={() => handlePlatformChange('pinterest')} className={`p-2 rounded-lg ${activePlatform === 'pinterest' ? 'bg-red-100 text-red-600 ring-2 ring-red-500' : 'bg-slate-100 text-slate-400'}`}><Pin size={20} /></button>
                                <button onClick={() => handlePlatformChange('twitter')} className={`p-2 rounded-lg ${activePlatform === 'twitter' ? 'bg-slate-200 text-slate-900 ring-2 ring-slate-900' : 'bg-slate-100 text-slate-400'}`}><Twitter size={20} /></button>
                                <button onClick={() => handlePlatformChange('facebook')} className={`p-2 rounded-lg ${activePlatform === 'facebook' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'bg-slate-100 text-slate-400'}`}><Facebook size={20} /></button>
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 rounded ${isOverLimit ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                {editedCaption.length} / {charLimit}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-grow p-4 overflow-y-auto">
                        <textarea className="w-full h-full resize-none border-none focus:ring-0 bg-transparent text-slate-700 dark:text-slate-300 text-sm leading-relaxed" value={editedCaption} onChange={(e) => setEditedCaption(e.target.value)} />
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-3">
                        <button onClick={() => handleCopyText(editedCaption, setCopiedText)} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center gap-2">
                            {copiedText ? <Check size={18} /> : <Copy size={18} />} {copiedText ? 'Copied!' : 'Copy Post Content'}
                        </button>
                    </div>
                </div>
            </>
        ) : (
            <div className="w-full h-full flex flex-col p-6 bg-slate-50 dark:bg-slate-900/50 overflow-y-auto">
                <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Quote className="text-amber-500 w-5 h-5" />
                            <h3 className="font-bold text-slate-800 dark:text-white">Community Reply Assistant</h3>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Incoming Post/Comment</label>
                            <textarea 
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none h-32 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white text-sm" 
                                placeholder='Paste the post or comment you want to respond to...' 
                                value={incomingComment} 
                                onChange={(e) => setIncomingComment(e.target.value)} 
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Tone of Voice</label>
                                <select 
                                    value={replyTone} 
                                    onChange={(e) => setReplyTone(e.target.value as Tone)}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
                                >
                                    <option value="chef-to-chef">Chef-to-Chef (Informal/Kitchen Slang)</option>
                                    <option value="professional">Professional (Expert/Polished)</option>
                                    <option value="supportive">Supportive (Encouraging/Kind)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Goal / Extra Context</label>
                                <input 
                                    type="text"
                                    placeholder="e.g., Mention Halal support..."
                                    value={replyContext}
                                    onChange={(e) => setReplyContext(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button onClick={handleGenerateReply} disabled={!incomingComment.trim() || isGeneratingReply} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 disabled:opacity-50 shadow-lg transition-transform active:scale-95">
                                {isGeneratingReply ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />} 
                                Craft Reply
                            </button>
                        </div>
                    </div>

                    {generatedReply && (
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-2 border-amber-100 dark:border-amber-900/30 animate-scale-up space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {generatedReply}
                            </div>
                            <button onClick={() => handleCopyText(generatedReply, setCopiedText)} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
                                {copiedText ? <Check size={18} /> : <Copy size={18} />} Copy Reply
                            </button>
                         </div>
                    )}
                </div>
            </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal;
