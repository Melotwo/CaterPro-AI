import React, { useState, useEffect } from 'react';
import { generateSocialCaption, generateVideoFromApi, generateWhatsAppStatus } from './geminiService';
import Toast from './Toast';

export type Mode = 'create' | 'pitch' | 'video' | 'status' | 'reel' | 'formula' | 'flex' | 'tiktok' | 'tags' | 'bio';

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
  const [toast, setToast] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      if (initialMode !== 'reel' && initialMode !== 'tags' && initialMode !== 'bio') {
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

  const bioTemplates = [
    { platform: 'TikTok', limit: 80, text: '👨‍🍳 Chef-Led Catering AI\n⏳ Save 15hrs admin/week\n🚀 Founder @CaterProAI\nFREE Tool 👇' },
    { platform: 'Instagram', limit: 150, text: '👨‍🍳 Chef-Led Catering AI\n🚀 Founder @CaterProAI\n⏳ Save 15hrs admin/week\n📋 Pro Proposals in 30s\n🇿🇦 Built for SA Chefs\nStart Free Sprint 👇' },
    { platform: 'Minimalist', limit: 80, text: '👨‍🍳 Catering Proposals in 30s\n🚀 Founder @CaterProAI\n🇿🇦 SA Chef Tech\nLink Below 👇' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/90 backdrop-blur-md animate-fade-in"></div>
      <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-none sm:rounded-[3.5rem] shadow-2xl overflow-hidden animate-scale-up flex flex-col h-full sm:h-[90dvh]">
        
        <div className="bg-slate-50 dark:bg-slate-800 p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Marketing & Strategy Console</h3>
            <button onClick={onClose} className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm hover:scale-110 transition-transform">✕</button>
        </div>

        <div className="flex bg-white dark:bg-slate-900 p-3 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar gap-3">
            {[
                { id: 'bio', icon: '👤', label: 'Bio Architect' },
                { id: 'tags', icon: '#', label: 'Tags' },
                { id: 'tiktok', icon: '🎤', label: 'TikTok Script' },
                { id: 'create', icon: '💬', label: 'Captions' },
                { id: 'flex', icon: '🚀', label: 'Flex' },
                { id: 'status', icon: '📱', label: 'WhatsApp' },
                { id: 'reel', icon: '📹', label: 'Reel Render' }
            ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => { setActiveMode(m.id as Mode); if(m.id !== 'reel' && m.id !== 'tags' && m.id !== 'bio') handleGenerate(); }}
                  className={`flex-1 min-w-[120px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${activeMode === m.id ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                >
                    <span className="text-base">{m.icon}</span> {m.label}
                </button>
            ))}
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            {activeMode === 'bio' ? (
                <div className="flex-grow p-10 overflow-y-auto custom-scrollbar space-y-10 bg-slate-50 dark:bg-slate-950">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-2xl">👤</span>
                        <h4 className="text-xl font-black uppercase tracking-tight">Character-Limited Bio Studio</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {bioTemplates.map((template, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{template.platform}</h5>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-md ${template.text.length > template.limit ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {template.text.length} / {template.limit}
                                        </span>
                                    </div>
                                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100 whitespace-pre-wrap italic leading-relaxed">
                                        "{template.text}"
                                    </p>
                                </div>
                                <button 
                                    onClick={() => { 
                                      navigator.clipboard.writeText(template.text); 
                                      setToast(`${template.platform} Bio Copied!`);
                                    }}
                                    className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                                >
                                    Copy Bio
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-800 rounded-2xl flex gap-4">
                        <span className="text-amber-600 shrink-0">⚠️</span>
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-400 leading-relaxed">
                            TikTok is strictly limited to 80 characters. If your bio is "too long," it usually means the invisible formatting characters (spaces/line breaks) are pushing you over. Use the TikTok template above—it's pre-measured.
                        </p>
                    </div>
                </div>
            ) : activeMode === 'tags' ? (
                <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                    <div className="md:w-2/3 p-10 overflow-y-auto custom-scrollbar space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-amber-500 text-xl">⚡</span>
                                <h5 className="text-sm font-black uppercase tracking-widest">2026 Viral Hooks</h5>
                            </div>
                            <div className="space-y-3">
                                {[
                                    "POV: You saved 15hrs of admin this week.",
                                    "Stop typing proposals. It's 2026.",
                                    "The 30-second rule for catering menus.",
                                    "ADHD vs. Catering Admin: The Cure.",
                                    "South African Chefs: Stop guessing margins."
                                ].map((hook, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => { 
                                          navigator.clipboard.writeText(hook); 
                                          setToast("Hook Copied!");
                                        }}
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-left text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-transparent hover:border-indigo-200"
                                    >
                                        {hook}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-indigo-500 text-xl">📢</span>
                                <h5 className="text-sm font-black uppercase tracking-widest">Pinterest Strategy</h5>
                            </div>
                            <div className="space-y-3">
                                {[
                                    "Master your catering margins (2026 Guide)",
                                    "How to cost a restaurant menu with AI",
                                    "Catering proposal architecture visual",
                                    "Chef-led automation for SA kitchens"
                                ].map((desc, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => { 
                                          navigator.clipboard.writeText(desc); 
                                          setToast("Description Copied!");
                                        }}
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-left text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-transparent hover:border-indigo-200"
                                    >
                                        {desc}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-indigo-500 text-2xl">#</span>
                        <h4 className="text-xl font-black uppercase tracking-tight">Optimized Hashtag Stacks</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                            {[
                                { label: 'The Viral Stack', tags: '#ChefLife #ChefAdmin #CulinaryArts #KitchenTech #Automation #Caterer #CaterProAI' },
                                { label: '2026 Growth Hooks', tags: '#CaterProAI #ChefTech #Automation #EntrepreneurLife #MzansiChefs #KitchenSystems' },
                                { label: 'Valentine’s Sprint', tags: '#Valentines2026 #PrivateChef #WeddingCaterer #EventPlanner #MenuDesign #RomanticDinner' },
                                { label: 'South Africa Niche', tags: '#SouthAfricaChefs #BraaiMaster #ZAR #JohannesburgCatering #CapeTownChefs #SABusiness' }
                            ].map((stack, i) => (
                                <div key={i} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 group">
                                    <div className="flex justify-between items-center mb-4">
                                        <h5 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{stack.label}</h5>
                                        <button 
                                            onClick={() => { 
                                              navigator.clipboard.writeText(stack.tags); 
                                              setToast("Stack Copied!");
                                            }}
                                            className="p-2 bg-white dark:bg-slate-900 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                        >
                                            <span className="text-slate-400 text-xs">📋</span>
                                        </button>
                                    </div>
                                    <p className="text-lg font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{stack.tags}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/3 bg-slate-50 dark:bg-slate-950 p-10 border-l border-slate-100 dark:border-slate-800 space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="text-amber-500 text-xl">@</span>
                            <h4 className="text-sm font-black uppercase tracking-widest">Target Mentions</h4>
                        </div>
                        <div className="space-y-3">
                            {[
                                { handle: '@Gemini', reason: 'Developer Reach' },
                                { handle: '@Whop', reason: 'Platform Support' },
                                { handle: '@Fiverr', reason: 'Freelance Boost' },
                                { handle: '@Google', reason: 'Tech Innovation' }
                            ].map((m, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => { 
                                      navigator.clipboard.writeText(m.handle); 
                                      setToast("Mention Copied!");
                                    }}
                                    className="w-full p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:scale-105 transition-all"
                                >
                                    <div>
                                        <p className="text-sm font-black text-slate-800 dark:text-white text-left">{m.handle}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">{m.reason}</p>
                                    </div>
                                    <span className="text-slate-300 group-hover:text-indigo-500 transition-colors text-xs">📋</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                {(activeMode === 'create' || activeMode === 'flex') && (
                    <div className="md:w-1/4 bg-slate-50 dark:bg-slate-950 p-4 border-r border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar flex md:flex-col gap-3">
                        {[
                            { id: 'whop', icon: '💬', label: 'Whop Forum' },
                            { id: 'facebook', icon: '📘', label: 'Facebook' },
                            { id: 'linkedin', icon: '🚀', label: 'LinkedIn' },
                            { id: 'instagram', icon: '📸', label: 'Instagram' },
                            { id: 'twitter', icon: '𝕏', label: 'X (Twitter)' }
                        ].map(p => (
                            <button 
                            key={p.id}
                            onClick={() => { setActivePlatform(p.id as Platform); handleGenerate(p.id as Platform); }}
                            className={`flex items-center gap-3 px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activePlatform === p.id ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md border-2 border-indigo-100 dark:border-indigo-900 scale-105' : 'text-slate-400 hover:text-slate-500'}`}
                            >
                                <span className="text-lg">{p.icon}</span> {p.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex-grow flex flex-col relative bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="flex-grow p-10 overflow-y-auto custom-scrollbar">
                        {isGenerating ? (
                            <div className="h-full flex flex-col items-center justify-center animate-pulse">
                                <div className="w-16 h-16 text-indigo-500 animate-spin mb-6 text-5xl flex items-center justify-center">⏳</div>
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
                            {copiedText ? '✅' : '📋'}
                            {copiedText ? 'Script Copied!' : 'Copy to Clipboard'}
                        </button>
                    </div>
                </div>
                </>
            )}
        </div>
      </div>

      <Toast 
        message={toast || ''} 
        onDismiss={() => setToast(null)} 
      />
    </div>
  );
};

export default SocialMediaModal;
