
import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Image as ImageIcon, Check, RefreshCw, Smartphone, Linkedin, Twitter, Facebook, MessageCircle, Send, Film, Play, Download, Zap, Rocket, AlertCircle, Quote, Pin, UserCircle, ExternalLink, GraduationCap } from 'lucide-react';
import { generateSocialReply, generateSocialCaption, generateSocialVideoFromApi, generateViralHook, VideoStyle, generateFounderMarketingPost, generateInstagramBio, generateAssignmentEmail } from '../services/geminiService';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | undefined;
  caption: string;
  onRegenerateCaption: () => void;
  isRegenerating: boolean;
  menuTitle: string;
  menuDescription: string;
  initialMode?: 'create' | 'reply' | 'video' | 'sell' | 'profile' | 'pitch';
}

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'pinterest' | 'email';
type Mode = 'create' | 'reply' | 'video' | 'sell' | 'profile' | 'pitch';

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ 
  isOpen, onClose, image, caption, onRegenerateCaption, isRegenerating, menuTitle, menuDescription, initialMode
}) => {
  const [activeMode, setActiveMode] = useState<Mode>('create');
  const [activePlatform, setActivePlatform] = useState<Platform>('linkedin');
  const [editedCaption, setEditedCaption] = useState(caption);
  const [pinTitle, setPinTitle] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  
  const [isGeneratingAssignment, setIsGeneratingAssignment] = useState(false);

  useEffect(() => {
    if (caption.includes('TITLE:')) {
        const parts = caption.split('DESCRIPTION:');
        setPinTitle(parts[0].replace('TITLE:', '').trim());
        setEditedCaption(parts[1]?.trim() || '');
    } else {
        setEditedCaption(caption);
    }
  }, [caption]);

  useEffect(() => {
    if (isOpen) {
      if (initialMode) setActiveMode(initialMode);
      if (initialMode === 'pitch') handleGenerateAssignment();
    }
  }, [isOpen, initialMode]);

  const handleGenerateAssignment = async () => {
    setIsGeneratingAssignment(true);
    try {
        const email = await generateAssignmentEmail(menuTitle, menuDescription);
        setEditedCaption(email);
        setActivePlatform('email');
    } catch (e) {
        setEditedCaption("Failed to generate assignment email.");
    } finally {
        setIsGeneratingAssignment(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"></div>
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[scale-up_0.2s_ease-out] flex flex-col h-[90dvh]">
        
        <button onClick={onClose} className="absolute top-5 right-5 p-2 z-20 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 rounded-full transition-colors">
          <X size={20} />
        </button>

        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 p-3 flex gap-2 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveMode('create')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'create' ? 'bg-white dark:bg-slate-700 shadow-md text-primary-600' : 'text-slate-500'}`}>
                <ImageIcon size={16} /> Social Post
            </button>
            <button onClick={() => setActiveMode('pitch')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'pitch' ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600' : 'text-slate-500'}`}>
                <GraduationCap size={16} /> Assignment Pitch
            </button>
            <button onClick={() => setActiveMode('video')} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeMode === 'video' ? 'bg-white dark:bg-slate-700 shadow-md text-purple-600' : 'text-slate-500'}`}>
                <Film size={16} /> Reel Maker
            </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            <div className="md:w-1/2 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
                {activeMode === 'pitch' ? (
                    <div className="max-w-sm w-full text-center space-y-6">
                        <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl">
                            <GraduationCap className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-xl font-bold">Pitch to Limpopo Chefs</h3>
                            <p className="text-blue-100 text-sm mt-2">This tool drafts your Coursera assignment email to <strong>info@limpopochefs.co.za</strong> including your menu details.</p>
                            <button onClick={handleGenerateAssignment} disabled={isGeneratingAssignment} className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 mx-auto hover:bg-blue-50 shadow-lg disabled:opacity-50">
                                {isGeneratingAssignment ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                                {isGeneratingAssignment ? 'Writing...' : 'Regenerate Draft'}
                            </button>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-left">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Recipient</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Limpopo Chefs Academy</p>
                            <p className="text-xs text-blue-500">info@limpopochefs.co.za</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-md w-full">
                        {image && <img src={`data:image/png;base64,${image}`} className="w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800" />}
                    </div>
                )}
            </div>

            <div className="md:w-1/2 flex flex-col bg-white dark:bg-slate-900">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Draft Content</h4>
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto">
                    <textarea 
                        className="w-full h-full min-h-[300px] resize-none border-none focus:ring-0 bg-transparent text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium" 
                        value={editedCaption} 
                        onChange={(e) => setEditedCaption(e.target.value)} 
                        placeholder="Drafting..."
                    />
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button onClick={() => handleCopyText(editedCaption)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                        {copiedText ? <Check size={20} /> : <Copy size={20} />} {copiedText ? 'Copied to Clipboard!' : 'Copy Assignment Email'}
                    </button>
                    {activeMode === 'pitch' && (
                        <p className="text-center text-[10px] text-slate-400 mt-4 font-bold">
                            Copy this and paste into your email client to send to info@limpopochefs.co.za
                        </p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal;
