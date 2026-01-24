
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, AlertTriangle, FileDown, Sparkles, Megaphone, GraduationCap, Share2, Film, Mail, Search, Globe, Facebook, Lightbulb, Target, TrendingUp, BarChart3, HelpCircle, Info, ArrowRight, Calendar, ShieldCheck, RefreshCw, Smartphone, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MenuDisplay from './components/MenuDisplay';
import SavedChecklistsModal from './components/SavedChecklistsModal';
import Toast from './components/Toast';
import AiChatBot from './components/AiChatBot';
import QrCodeModal from './components/QrCodeModal';
import ShareModal from './components/ShareModal';
import SocialMediaModal, { Mode as SocialMode } from './components/SocialMediaModal';
import MultiSelectDropdown from './components/MultiSelectDropdown';
import GenerationHistory from './components/GenerationHistory';
import CustomizationModal from './components/CustomizationModal';
import EmailCapture from './components/EmailCapture';
import PricingPage from './components/PricingPage';
import UpgradeModal from './components/UpgradeModal';
import PwaInstallModal from './components/PwaInstallModal';
import LandingPage from './components/LandingPage';
import ResearchHub from './components/ResearchHub';
import FounderRoadmap from './components/FounderRoadmap';
import SEOHead from './components/SEOHead';
import MarketingRoadmap from './components/MarketingRoadmap';
import { useAppSubscription } from './hooks/useAppSubscription';
import { CUISINES, DIETARY_RESTRICTIONS, EVENT_TYPES, GUEST_COUNT_OPTIONS, BUDGET_LEVELS } from './constants';
import { SavedMenu, ErrorState, ValidationErrors, Menu, MenuSection } from './types';
import { getApiErrorState } from './services/apiErrorHandler';
import { generateMenuFromApi, generateMenuImageFromApi } from './services/geminiService';
import { analytics } from './services/analyticsManager';

const WHOP_STORE_URL = "https://whop.com/melotwo2"; 
const FACEBOOK_PAGE_URL = "https://facebook.com/CaterProAi"; 

type AppView = 'landing' | 'generator' | 'pricing';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<AppView>('landing');
  const [eventType, setEventType] = useState('');
  const [eventTypeSearch, setEventTypeSearch] = useState('');
  const [showEventResults, setShowEventResults] = useState(false);
  const [guestCount, setGuestCount] = useState('');
  const [budget, setBudget] = useState('$$');
  const [currency, setCurrency] = useState('ZAR'); 
  const [serviceStyle, setServiceStyle] = useState('Standard Catering');
  const [cuisine, setCuisine] = useState('');
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [strategyHook, setStrategyHook] = useState(''); 
  const [showCuisineResults, setShowCuisineResults] = useState(false);
  const [showStrategyGuide, setShowStrategyGuide] = useState(false);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [proposalTheme, setProposalTheme] = useState('classic');
  
  // Gating Logic for Founder Interface
  const [isFounderMode, setIsFounderMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const stored = localStorage.getItem('caterpro_is_founder');
    
    if (mode === 'founder' || stored === 'true') {
        localStorage.setItem('caterpro_is_founder', 'true');
        return true;
    }
    return false;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [error, setError] = useState<ErrorState | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) return storedTheme === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [savedMenus, setSavedMenus] = useState<SavedMenu[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [showRetentionBanner, setShowRetentionBanner] = useState(false);

  const { subscription, selectPlan, recordGeneration, setShowUpgradeModal, showUpgradeModal, attemptAccess, canAccessFeature } = useAppSubscription();

  const [isEmailCaptureModalOpen, setIsEmailCaptureModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialModalMode, setSocialModalMode] = useState<SocialMode>('create');

  const cuisineRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  // Standalone mode detection for retention
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (!isStandalone) {
        // Show retention banner after 5 seconds of browsing
        const timer = setTimeout(() => setShowRetentionBanner(true), 5000);
        return () => clearTimeout(timer);
    }
  }, []);

  const filteredCuisines = CUISINES.filter(c => 
    c.toLowerCase().includes((cuisineSearch || '').toLowerCase())
  );

  const filteredEvents = EVENT_TYPES.filter(e => 
    e.toLowerCase().includes((eventTypeSearch || '').toLowerCase())
  );

  useEffect(() => {
    analytics.track({ type: 'awareness_view', data: { page: viewMode } });
  }, [viewMode]);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingTimer(0);
      interval = setInterval(() => {
        setLoadingTimer(prev => prev + 1);
      }, 1000);
    } else {
      setLoadingTimer(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cuisineRef.current && !cuisineRef.current.contains(event.target as Node)) {
        setShowCuisineResults(false);
      }
      if (eventRef.current && !eventRef.current.contains(event.target as Node)) {
        setShowEventResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const STRATEGY_PRESETS = [
    { id: 'lifecycle', label: 'Lifecycle Marketing', icon: TrendingUp, text: 'Apply Lifecycle Marketing Strategy: Guide the customer interactions strategically before, during, and after purchase to build trust.' },
    { id: 'targeting', label: 'Hyper-Targeting', icon: Target, text: 'Apply Hyper-Targeted Content Strategy: Analyze specific segments (busy pros vs event hosts) and tailor the culinary hook to them.' },
    { id: 'data', label: 'Data-Driven', icon: BarChart3, text: 'Apply Data-Driven Strategy: Focus on measurable metrics and systems that track conversion over simple posting.' }
  ];

  const handleApplyPreset = (text: string) => {
    setStrategyHook(text);
    setToastMessage("Marketing Strategy Applied!");
    analytics.track({ type: 'founder_action', data: { actionName: 'apply_strategy_preset' } });
  };

  const handleOpenSocial = (mode: SocialMode) => {
    if (attemptAccess('socialMediaTools')) {
        setSocialModalMode(mode);
        setIsSocialModalOpen(true);
    }
  };

  const generateMenu = async () => {
    if (!recordGeneration()) return;
    
    const newValidationErrors: ValidationErrors = {};
    if (!eventType) newValidationErrors.eventType = "Select an event.";
    if (!guestCount) newValidationErrors.guestCount = "Select guests.";
    if (!cuisine) newValidationErrors.cuisine = "Search for a country or style.";
    setValidationErrors(newValidationErrors);
    if (Object.keys(newValidationErrors).length > 0) return;

    setIsLoading(true);
    setError(null);
    setMenu(null);

    analytics.track({ type: 'conversion_generate', data: { eventType, plan: subscription.plan } });

    try {
      const result = await generateMenuFromApi({
        eventType,
        guestCount,
        budget,
        serviceStyle,
        cuisine,
        dietaryRestrictions,
        currency,
        strategyHook,
      });
      
      const newMenu = { ...result.menu, theme: proposalTheme };
      setMenu(newMenu);
      setIsLoading(false);
      
      setIsGeneratingImage(true);
      try {
        const imageBase64 = await generateMenuImageFromApi(newMenu.menuTitle, newMenu.description);
        setMenu(prev => prev ? { ...prev, image: imageBase64 } : null);
      } catch (imgErr) {
        console.warn("Image generation failed", imgErr);
      } finally {
        setIsGeneratingImage(false);
      }
      
      if (!localStorage.getItem('caterpro_user_email')) setIsEmailCaptureModalOpen(true);
    } catch (e) {
      setError(getApiErrorState(e));
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased ${isDarkMode ? 'dark' : ''}`}>
      <SEOHead menu={menu} title={viewMode === 'landing' ? "The Chef's Secret Weapon" : "Generate Menu"} />
      
      {/* Smart Retention Banner */}
      {showRetentionBanner && (
        <div className="no-print bg-amber-500 py-3 px-4 text-white animate-fade-in relative z-[60] flex items-center justify-center gap-3">
             <Smartphone size={16} className="animate-bounce" />
             <p className="text-[10px] font-black uppercase tracking-widest leading-none">Don't lose your link! Save app to home screen now.</p>
             <button 
                onClick={() => setIsInstallModalOpen(true)}
                className="px-3 py-1 bg-white text-amber-600 rounded-full text-[9px] font-black uppercase hover:scale-105 transition-transform"
             >
                How To Save
             </button>
             <button onClick={() => setShowRetentionBanner(false)} className="absolute right-4 opacity-60 hover:opacity-100"><X size={14} /></button>
        </div>
      )}

      <Navbar 
        whopUrl={WHOP_STORE_URL}
        facebookUrl={FACEBOOK_PAGE_URL}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} 
        onOpenSaved={() => attemptAccess('saveMenus') && setIsSavedModalOpen(true)} 
        savedCount={savedMenus.length} 
        onOpenQrCode={() => setIsQrModalOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onReset={() => { 
            localStorage.removeItem('caterpro-subscription'); 
            localStorage.removeItem('caterpro_is_founder');
            window.location.href = window.location.pathname; 
        }}
        onViewLanding={() => setViewMode('landing')}
        onViewPricing={() => setViewMode('pricing')}
      />
      
      {viewMode === 'landing' && <LandingPage onGetStarted={() => setViewMode('generator')} />}

      {viewMode === 'pricing' && <PricingPage whopUrl={WHOP_STORE_URL} onSelectPlan={(p) => { selectPlan(p); setViewMode('generator'); }} currency={currency} />}

      {viewMode === 'generator' && (
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-16">
          {!menu && !isLoading && (
            <div className="space-y-12 animate-slide-in">
              <div className="text-center max-w-2xl mx-auto px-4">
                <h1 className="text-4xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Catering Command Center</h1>
                <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium text-lg">Define your culinary vision and strategy.</p>
              </div>

              {/* Founder Mode Badge (Only you see this) */}
              {isFounderMode && (
                  <div className="flex justify-center animate-bounce">
                      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border-2 border-indigo-400">
                          <ShieldCheck size={14} /> Founder Hub Active
                      </div>
                  </div>
              )}

              <div className="bg-white dark:bg-slate-900 p-6 sm:p-12 md:p-16 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 main-grid">
                  
                  <div className="space-y-1 relative" ref={eventRef}>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Event Selection</label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Type or select event (e.g. Wedding, Braai...)" 
                        value={eventTypeSearch || eventType}
                        onFocus={() => setShowEventResults(true)}
                        onChange={(e) => { setEventTypeSearch(e.target.value); setEventType(e.target.value); }}
                        className="w-full pl-12 pr-5 py-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold text-sm shadow-sm"
                      />
                    </div>
                    {showEventResults && filteredEvents.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl shadow-2xl max-h-64 overflow-y-auto">
                          {filteredEvents.map(e => (
                              <button key={e} onClick={() => { setEventType(e); setEventTypeSearch(e); setShowEventResults(false); }} className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-bold flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 last:border-0 dark:text-white">
                                  <Sparkles size={16} className="text-indigo-500" /> {e}
                              </button>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Guest Volume</label>
                    <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold text-sm shadow-sm">
                      <option value="">Select Capacity...</option>
                      {GUEST_COUNT_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1 relative full-width-tablet" ref={cuisineRef}>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Culinary Style</label>
                    <div className="relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search country or cuisine style..." 
                        value={cuisineSearch || cuisine}
                        onFocus={() => setShowCuisineResults(true)}
                        onChange={(e) => { setCuisineSearch(e.target.value); setCuisine(e.target.value); }}
                        className="w-full pl-12 pr-5 py-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold text-sm shadow-sm"
                      />
                    </div>
                    {showCuisineResults && filteredCuisines.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl shadow-2xl max-h-64 overflow-y-auto">
                          {filteredCuisines.map(c => (
                              <button key={c} onClick={() => { setCuisine(c); setCuisineSearch(c); setShowCuisineResults(false); }} className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-bold flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 last:border-0 dark:text-white">
                                  <Globe size={16} className="text-primary-500" /> {c}
                              </button>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Financial Setup</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold text-sm shadow-sm">
                       <option value="ZAR">South African Rand (R)</option>
                       <option value="USD">US Dollar ($)</option>
                       <option value="EUR">Euro (€)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 full-width-tablet space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                            <Lightbulb size={16} className="text-amber-500" /> 
                            Marketing Hook
                        </label>
                        <button 
                            onClick={() => setShowStrategyGuide(!showStrategyGuide)}
                            className="p-1 rounded-full text-slate-400 hover:text-primary-500 transition-colors"
                            title="Strategy Help"
                        >
                            <HelpCircle size={14} />
                        </button>
                      </div>
                      {/* Only visible for Founder/Business plans */}
                      {(isFounderMode || canAccessFeature('reelsMode')) && (
                        <div className="flex flex-wrap gap-2">
                            {STRATEGY_PRESETS.map(preset => (
                            <button 
                                key={preset.id}
                                onClick={() => handleApplyPreset(preset.text)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-primary-500 hover:text-white transition-all text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                                <preset.icon size={12} /> {preset.label}
                            </button>
                            ))}
                        </div>
                      )}
                    </div>
                    
                    {showStrategyGuide && (
                        <div className="bg-primary-50 dark:bg-primary-900/10 border-2 border-primary-100 dark:border-primary-800 p-6 rounded-[2rem] animate-slide-in">
                            <h4 className="text-sm font-black uppercase text-primary-700 dark:text-primary-400 mb-3 flex items-center gap-2">
                                <Info size={16} /> 2026 Strategy Playbook
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] leading-relaxed">
                                <div>
                                    <p className="font-black text-slate-800 dark:text-white uppercase tracking-widest mb-1">Lifecycle</p>
                                    <p className="text-slate-500 dark:text-slate-400">Guiding the customer before, during, and after. Focus on relationship building.</p>
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 dark:text-white uppercase tracking-widest mb-1">Targeting</p>
                                    <p className="text-slate-500 dark:text-slate-400">Laser-focus on specific needs (e.g., Busy Professionals vs Large Event Hosts).</p>
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 dark:text-white uppercase tracking-widest mb-1">Data-Driven</p>
                                    <p className="text-slate-500 dark:text-slate-400">Emphasize systems, accuracy, and measurable metrics over generic "food pics."</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <textarea 
                      value={strategyHook}
                      onChange={(e) => setStrategyHook(e.target.value)}
                      placeholder="Paste insights from NotebookLM or select a marketing strategy above..."
                      className="w-full p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold text-sm min-h-[140px] resize-none shadow-inner"
                    />
                  </div>

                  <div className="md:col-span-2 full-width-tablet pt-4">
                    <button onClick={generateMenu} className="w-full py-6 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center gap-3">
                      <Sparkles className="w-7 h-7" /> Launch Strategic AI Planner
                    </button>
                  </div>
                </div>
              </div>

              {/* Gated Founder Sections */}
              {isFounderMode && (
                  <>
                    <MarketingRoadmap />
                    <FounderRoadmap whopUrl={WHOP_STORE_URL} onOpenSocial={handleOpenSocial} />
                  </>
              )}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32 animate-pulse text-center">
                <Loader2 className="w-20 h-20 text-primary-500 animate-spin mb-8" />
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Orchestrating Business Intelligence...</h2>
                <p className="text-slate-500 mt-2 font-medium">Applying Menu Engineering logic and HACCP safety protocols.</p>
                
                {loadingTimer > 20 && (
                   <div className="mt-12 p-8 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-3xl max-w-md animate-slide-in">
                       <p className="text-sm font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-4">Taking too long?</p>
                       <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">The AI is struggling with this specific request. Try refreshing or simplifying your cuisine choice.</p>
                       <button 
                          onClick={() => window.location.reload()}
                          className="px-6 py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto"
                       >
                          <RefreshCw size={14} /> Force Restart
                       </button>
                   </div>
                )}
            </div>
          )}

          {menu && !isLoading && (
            <div className="space-y-12 animate-fade-in">
                <div className="no-print bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-3xl"><Sparkles className="text-primary-600 w-8 h-8" /></div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Marketing Hub Proposal</h3>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">HACCP & Margin Analysis Active</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setMenu(null)} className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">← New Event</button>
                        <button onClick={() => window.print()} className="px-8 py-3.5 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase flex items-center gap-2 shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
                           <FileDown size={18} /> Export Strategic PDF
                        </button>
                    </div>
                </div>

                <MenuDisplay 
                  menu={menu} 
                  checkedItems={checkedItems} 
                  onToggleItem={(k) => {
                      const next = new Set(checkedItems);
                      if (next.has(k)) next.delete(k); else next.add(k);
                      setCheckedItems(next);
                  }} 
                  isEditable={canAccessFeature('reelsMode')} 
                  onEditItem={() => {}} 
                  showToast={setToastMessage} 
                  isGeneratingImage={isGeneratingImage} 
                  onUpdateShoppingItemQuantity={() => {}} 
                  bulkSelectedItems={new Set()} 
                  onToggleBulkSelect={() => {}} 
                  onBulkCheck={() => {}} 
                  onBulkUpdateQuantity={() => {}} 
                  onClearBulkSelection={() => {}} 
                  onSelectAllShoppingListItems={() => {}} 
                  proposalTheme={proposalTheme} 
                  canAccessFeature={canAccessFeature} 
                  onAttemptAccess={attemptAccess} 
                  deliveryRadius="10" 
                  onDeliveryRadiusChange={() => {}} 
                  onCalculateFee={() => {}} 
                  calculatedFee={null} 
                  preferredCurrency={currency} 
                  onOpenSocialModal={handleOpenSocial}
                  onOpenShareModal={() => setIsShareModalOpen(true)}
                />
                
                {/* Gated Founder Sections (Duplicate for Result View) */}
                {isFounderMode && (
                    <>
                        <MarketingRoadmap />
                        <FounderRoadmap whopUrl={WHOP_STORE_URL} onOpenSocial={handleOpenSocial} />
                    </>
                )}
            </div>
          )}
        </main>
      )}

      <AiChatBot onAttemptAccess={() => attemptAccess('aiChatBot')} isPro={canAccessFeature('aiChatBot')} />
      <SavedChecklistsModal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} savedMenus={savedMenus} onDelete={(id) => setSavedMenus(prev => prev.filter(m => m.id !== id))} />
      <QrCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} shareUrl={window.location.href} menuTitle={menu?.menuTitle} />
      <EmailCapture isOpen={isEmailCaptureModalOpen} onClose={() => setIsEmailCaptureModalOpen(false)} onSave={(e, w) => { localStorage.setItem('caterpro_user_email', e); localStorage.setItem('caterpro_user_whatsapp', w); setToastMessage("Contact Sync Successful!"); }} />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} onUpgrade={(p) => { selectPlan(p); setViewMode('generator'); setShowUpgradeModal(false); }} onViewPricing={() => setViewMode('pricing')} />
      <SocialMediaModal isOpen={isSocialModalOpen} onClose={() => setIsSocialModalOpen(false)} image={menu?.image} menuTitle={menu?.menuTitle || ''} menuDescription={menu?.description || ''} initialMode={socialModalMode} onImageGenerated={(b) => setMenu(p => p ? { ...p, image: b } : null)} />
      <PwaInstallModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
      
      {viewMode !== 'pricing' && <Footer facebookUrl={FACEBOOK_PAGE_URL} />}
    </div>
  );
};

export default App;
