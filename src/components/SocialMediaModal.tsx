import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Facebook, Twitter, Instagram, Video, Loader2, Smartphone, MessageSquareQuote, Activity, Pin, Flame, Rocket, MessageSquare, Mic2 } from 'lucide-react';
import { generateSocialCaption, generateVideoFromApi, generateWhatsAppStatus } from '../services/geminiService';

export type Mode = 'create' | 'pitch' | 'video' | 'status' | 'reel' | 'formula' | 'flex' | 'tiktok';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | undefined;
  menuTitle: string;
  menuDescription: string;
  initialMode?: Mode;
  onImageGenerated?: (base64: string) => void;
}

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'tiktok' | 'pinterest' | 'reddit' | 'whop';

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ 
  isOpen, onClose, image, menuTitle, menuDescription, initialMode = 'create'
}) => {
  const [activeMode, setActiveMode] = useState<Mode>(initialMode);
  const [activePlatform, setActivePlatform] = useState<Platform>('whop');
  const [editedContent, setEditedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      if (initialMode !== 'reel') {
        handleGenerate(initialMode === 'create' ? 'whop' : undefined);
      }
    }
  }, [isOpen, initialMode]);

  const handleGenerate = async (platformOverride?: Platform) => {
    const platform = platformOverride || activePlatform;
    setIsGenerating(true);
    setEditedContent('');
    try {
      if (activeMode === 'tiktok') {
          const script = `[0:00-0:03] *Chef staring at a laptop looking frustrated*\n"POV: You're spending your weekend doing catering admin instead of cooking."\n\n[0:03-0:07] *Snap to your iPad showing CaterPro AI*\n"Meet CaterPro AI. I built this so you never have to type a proposal again."\n\n[0:07-0:12] *Quick cuts of the menu sections generating*\n"Portions. Costs in ZAR. HACCP safety. Done in 30 seconds."\n\n[0:12-0:15] *Final shot of a beautiful proposal*\n"Link in my bio to start for free. Let's get back in the kitchen. 🥂"`;
          setEditedContent(script);
      } else if (activeMode === 'create') {
        if (platform === 'whop') {
            const whopPost = `[COMMUNITY UPDATE: 2026 EDITION]\n\n"I didn't just build an app; I built a system for every chef in this group."\n\nI just finished the architecture for ${menuTitle || 'the new system'}. It now renders full proposals in under 30 seconds.\n\nI am currently looking for 3 ambitious clippers from this group to join my internal engine. I provide the assets, you provide the reach.\n\nDrop a 🥂 below if you are ready to scale with me.\n\n#CaterProAI #FounderLog #WhopCommunity`;
            setEditedContent(whopPost);
        } else {
            const caption = await generateSocialCaption(menuTitle || "CaterPro AI System", menuDescription || "Automating catering for 2026.", platform);
            setEditedContent(caption);
        }
      } else if (activeMode === 'flex') {
        const flexPost = `[FOUNDER LOG: DAY 12]\n\n"I stopped typing and started building. This is CaterPro AI."\n\nI just rendered a full ${menuTitle || 'Wedding'} Proposal in 30 seconds. In Rands. With HACCP safety checks ready for the health inspector.\n\nMost chefs are stuck in the office. I'm back in the kitchen because I built the office into an AI.\n\nWant to see the walkthrough? Comment "CHEF" below. 👇\n\n#ProofOfWork #ChefLife #CaterProAI`;
        setEditedContent(flexPost);
      } else if (activeMode === 'status') {
        const status = await generateWhatsAppStatus(menuTitle || "CaterPro AI");
        setEditedContent(status);
      } else if (activeMode === 'formula') {
        const formulaScript = `[HOOK]\n"Stop wasting time on ${menuTitle || 'admin'}. It's 2026."\n\n[VALUE]\n"I built an AI that generates full catering proposals in 30 seconds."\n\n[PROOF]\n"It's saved me 15 hours of typing this week."\n\n[OFFER]\n"Comment 'CHEF' below for the link."`;
        setEditedContent(formulaScript);
      } else if (activeMode === 'reel' || activeMode === 'video') {
        const videoUrl = await generateVideoFromApi(`A professional high-quality video for a catering business showcasing: ${menuTitle}. ${menuDescription}. Cinematic style, professional editing.`);
        setEditedContent(`Video Rendered Successfully!\n\nAccess your marketing asset here:\n${videoUrl}\n\nNote: This link includes your temporary access key. Please download the file immediately for your social media channels.`);
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

        <div className="flex bg-white dark:bg-slate-900 p-3 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar gap-3">
            {[
                { id: 'tiktok', icon: Mic2, label: 'TikTok Script' },
                { id: 'create', icon: MessageSquareQuote, label: 'Captions' },
                { id: 'flex', icon: Rocket, label: 'Founder Flex' },
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
            {(activeMode === 'create' || activeMode === 'flex') && (
                <div className="md:w-1/4 bg-slate-50 dark:bg-slate-950 p-4 border-r border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar flex md:flex-col gap-3">
                    {[
                        { id: 'whop', icon: MessageSquare, label: 'Whop Forum' },
                        { id: 'facebook', icon: Facebook, label: 'Facebook' },
                        { id: 'linkedin', icon: Rocket, label: 'LinkedIn' },
                        { id: 'instagram', icon: Instagram, label: 'Instagram' },
                        { id: 'twitter', icon: Twitter, label: 'X (Twitter)' }
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
                        {copiedText ? 'Script Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaModal;
