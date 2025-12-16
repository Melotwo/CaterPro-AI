import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Image as ImageIcon, Check, RefreshCw, Smartphone, Linkedin, Twitter, Facebook, MessageCircle, Send } from 'lucide-react';
import { generateSocialReply, generateSocialCaption } from '../services/geminiService';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | undefined;
  caption: string;
  onRegenerateCaption: () => void;
  isRegenerating: boolean;
  menuTitle: string;
  menuDescription: string;
}

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook';
type Mode = 'create' | 'reply';

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ 
  isOpen, onClose, image, caption, onRegenerateCaption, isRegenerating, menuTitle, menuDescription
}) => {
  const [activeMode, setActiveMode] = useState<Mode>('create');
  const [activePlatform, setActivePlatform] = useState<Platform>('instagram');
  const [editedCaption, setEditedCaption] = useState(caption);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  
  // Reply State
  const [incomingComment, setIncomingComment] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedCaption(caption);
  }, [caption]);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handlePlatformChange = async (platform: Platform) => {
      setActivePlatform(platform);
      if (activeMode === 'create') {
          // Trigger regeneration for specific platform style
          // In a real app, we might want to debounce this or let user click regenerate
          // For now, let's just update the placeholder or visual state
      }
  };

  const handleRegenerateForPlatform = async () => {
      // Logic to call API with platform specific prompt
      // This assumes onRegenerateCaption in parent is generic, so we might need a local call here
      // But for now, we will use the local service directly to override parent behavior for cleaner UX
      try {
          // We can't set the parent loading state, so we use a local one visually if needed
          const newCaption = await generateSocialCaption(menuTitle, menuDescription, activePlatform === 'facebook' ? 'instagram' : activePlatform);
          setEditedCaption(newCaption);
      } catch (e) {
          console.error(e);
      }
  };

  const handleGenerateReply = async () => {
      if (!incomingComment.trim()) return;
      setIsGeneratingReply(true);
      try {
          const reply = await generateSocialReply(incomingComment);
          setGeneratedReply(reply);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingReply(false);
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
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    } catch (err) {
      console.error("Failed to copy image:", err);
      alert("Could not copy image. Right click > Save Image As...");
    }
  };
  
  const openPlatform = () => {
      let url = '';
      const text = encodeURIComponent(editedCaption);
      
      switch(activePlatform) {
          case 'linkedin':
              url = `https://www.linkedin.com/feed/`; // Cannot pre-fill post text easily on web
              break;
          case 'twitter':
              url = `https://twitter.com/intent/tweet?text=${text}`;
              break;
          case 'facebook':
              url = `https://www.facebook.com/`;
              break;
          case 'instagram':
              url = `https://www.instagram.com/`;
              break;
      }
      window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div ref={modalRef} className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[scale-up_0.2s_ease-out] flex flex-col h-[90vh]">
        
        <button onClick={onClose} className="absolute top-3 right-3 p-2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors">
          <X size={20} />
        </button>

        {/* Top Bar: Mode Switcher */}
        <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 flex justify-center gap-2">
            <button 
                onClick={() => setActiveMode('create')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeMode === 'create' ? 'bg-white dark:bg-slate-700 shadow text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}
            >
                <ImageIcon size={18} />
                Create Post
            </button>
            <button 
                onClick={() => setActiveMode('reply')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeMode === 'reply' ? 'bg-white dark:bg-slate-700 shadow text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}
            >
                <MessageCircle size={18} />
                Lead Reply Assistant
            </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        
        {activeMode === 'create' ? (
            <>
                {/* Left Side: Image Preview */}
                <div className="md:w-1/2 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center p-6 relative border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                    {image ? (
                        <div className="relative shadow-xl rounded-lg overflow-hidden group max-w-md w-full">
                            <img 
                                src={`data:image/png;base64,${image}`} 
                                alt="Social Media Post" 
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    onClick={handleCopyImage}
                                    className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform hover:scale-105"
                                >
                                    {copiedImage ? <Check size={18} /> : <ImageIcon size={18} />}
                                    {copiedImage ? 'Copied!' : 'Copy Image'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-slate-400">
                            <ImageIcon size={48} className="mb-2" />
                            <p>No image generated</p>
                        </div>
                    )}
                    <p className="mt-4 text-xs text-slate-400 text-center max-w-xs">
                        Tip: LinkedIn and X prefer you to upload the image file directly. Click "Copy Image" then paste it (Ctrl+V) into the post creator.
                    </p>
                </div>

                {/* Right Side: Caption Editor */}
                <div className="md:w-1/2 flex flex-col h-full bg-white dark:bg-slate-900">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-2">
                                <button onClick={() => handlePlatformChange('instagram')} className={`p-2 rounded-lg transition-colors ${activePlatform === 'instagram' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 ring-2 ring-pink-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`} title="Instagram">
                                    <Smartphone size={20} />
                                </button>
                                <button onClick={() => handlePlatformChange('facebook')} className={`p-2 rounded-lg transition-colors ${activePlatform === 'facebook' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 ring-2 ring-blue-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`} title="Facebook">
                                    <Facebook size={20} />
                                </button>
                                <button onClick={() => handlePlatformChange('linkedin')} className={`p-2 rounded-lg transition-colors ${activePlatform === 'linkedin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-2 ring-blue-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`} title="LinkedIn">
                                    <Linkedin size={20} />
                                </button>
                                <button onClick={() => handlePlatformChange('twitter')} className={`p-2 rounded-lg transition-colors ${activePlatform === 'twitter' ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white ring-2 ring-slate-900 dark:ring-slate-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`} title="X (Twitter)">
                                    <Twitter size={20} />
                                </button>
                            </div>
                            <button 
                                onClick={handleRegenerateForPlatform}
                                disabled={isRegenerating}
                                className="text-xs flex items-center gap-1 text-slate-500 hover:text-primary-500 disabled:opacity-50 font-medium"
                            >
                                <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
                                Rewrite for {activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-grow p-4 overflow-y-auto">
                        <textarea 
                            className="w-full h-full min-h-[300px] resize-none border-none focus:ring-0 bg-transparent text-slate-700 dark:text-slate-300 font-sans text-sm leading-relaxed"
                            value={editedCaption}
                            onChange={(e) => setEditedCaption(e.target.value)}
                            placeholder="Generating caption..."
                        ></textarea>
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-3">
                        <button 
                            onClick={() => handleCopyText(editedCaption, setCopiedText)}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            {copiedText ? <Check size={18} /> : <Copy size={18} />}
                            {copiedText ? 'Copied!' : 'Copy Caption'}
                        </button>
                        
                        <button 
                            onClick={openPlatform}
                            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors border-2 ${
                                activePlatform === 'linkedin' ? 'border-[#0077b5] text-[#0077b5] hover:bg-[#0077b5] hover:text-white' :
                                activePlatform === 'twitter' ? 'border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black' :
                                activePlatform === 'facebook' ? 'border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white' :
                                'border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white'
                            }`}
                        >
                            Open {activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)} & Post
                        </button>
                    </div>
                </div>
            </>
        ) : (
            // REPLY MODE
            <div className="w-full h-full flex flex-col p-6 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-3xl mx-auto w-full flex flex-col h-full gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                            <MessageCircle className="text-amber-500" />
                            Paste User Comment
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Paste a comment from Facebook or LinkedIn. The AI will write a reply to convert them into a lead.</p>
                        <textarea 
                            className="flex-grow w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
                            placeholder='e.g., "This menu looks amazing! Do you do weddings in Chicago?"'
                            value={incomingComment}
                            onChange={(e) => setIncomingComment(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end">
                            <button 
                                onClick={handleGenerateReply}
                                disabled={!incomingComment.trim() || isGeneratingReply}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                            >
                                {isGeneratingReply ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                                Generate Reply
                            </button>
                        </div>
                    </div>

                    {generatedReply && (
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-2 border-amber-100 dark:border-amber-900/30 animate-scale-up">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                <Check className="text-green-500" />
                                Suggested Reply
                            </h3>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 mb-4 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {generatedReply}
                            </div>
                            <button 
                                onClick={() => handleCopyText(generatedReply, setCopiedText)}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                {copiedText ? <Check size={18} /> : <Copy size={18} />}
                                {copiedText ? 'Copied!' : 'Copy Reply'}
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
