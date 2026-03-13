
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, AlertTriangle, FileDown, Sparkles, Megaphone, GraduationCap, Share2, Film, Mail, Search, Globe, Facebook, Lightbulb, Target, TrendingUp, BarChart3, HelpCircle, Info, ArrowRight, Calendar, ShieldCheck, RefreshCw, Smartphone, X, Heart } from 'lucide-react';
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
import AuthModal from './components/AuthModal';
import CostingLibrary from './components/CostingLibrary';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { useAuth } from './hooks/useAuth';
import { auth, db, storage } from './firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FounderRoadmap from './components/FounderRoadmap';
import SEOHead from './components/SEOHead';
import MarketingRoadmap from './components/MarketingRoadmap';
import ProductivityLab from './components/ProductivityLab';
import GoogleAnalytics from './components/GoogleAnalytics';
import FacebookPixel from './components/FacebookPixel';
import ManyChatWidget from './components/ManyChatWidget';
import { useAppSubscription } from './hooks/useAppSubscription';
import { CUISINES, DIETARY_RESTRICTIONS, EVENT_TYPES, GUEST_COUNT_OPTIONS, BUDGET_LEVELS } from './constants';
import { SavedMenu, ErrorState, ValidationErrors, Menu, MenuSection } from './types';
import { getApiErrorState } from './services/apiErrorHandler';
import { generateMenuFromApi, generateMenuImageFromApi } from './services/geminiService';
import { analytics } from './services/analyticsManager';

const WHOP_STORE_URL = "https://whop.com/melotwo2"; 
const FACEBOOK_PAGE_URL = "https://facebook.com/CaterProAi"; 

type AppView = 'landing' | 'generator' | 'pricing' | 'library' | 'privacy' | 'terms';

export default function App() {
  const { user, isConfigured } = useAuth();
  const [viewMode, setViewMode] = useState<AppView>(() => {
    if (window.location.pathname === '/privacy') return 'privacy';
    if (window.location.pathname === '/terms') return 'terms';
    return 'generator';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (!isStandalone) {
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

  const regenerateImage = async () => {
      if (!menu) return;
      setIsGeneratingImage(true);
      try {
          const imageBase64 = await generateMenuImageFromApi(menu.menuTitle, menu.description);
          setMenu(prev => prev ? { ...prev, image: imageBase64 } : null);
          setToastMessage("Professional Visual Architected!");
      } catch (err) {
          console.error("Manual Image Regen failed", err);
          setToastMessage("AI Visual Engine busy. Try in a moment.");
      } finally {
          setIsGeneratingImage(false);
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
      let userIngredientCosts = null;
      if (user && db) {
        const q = query(collection(db, 'ingredientCosts'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        userIngredientCosts = querySnapshot.docs.map(doc => doc.data());
      }

      const result = await generateMenuFromApi({
        eventType,
        guestCount,
        budget,
        serviceStyle,
        cuisine,
        dietaryRestrictions,
        currency,
        strategyHook,
        userIngredientCosts: userIngredientCosts || undefined
      });
      
      const newMenu = { ...result.menu, theme: proposalTheme };
      setMenu(newMenu);
      setIsLoading(false); // Stop general loading, switch to image sub-loading
      
      setIsGeneratingImage(true);
      try {
        const imageBase64 = await generateMenuImageFromApi(newMenu.menuTitle, newMenu.description);
        setMenu(prev => prev ? { ...prev, image: imageBase64 } : null);
      } catch (imgErr) {
        console.warn("AI Image generation failed during auto-run", imgErr);
      } finally {
        setIsGeneratingImage(false);
      }
      
      {/* Email capture auto-popup removed */}
    } catch (e) {
      setError(getApiErrorState(e));
      setIsLoading(false);
    }
  };

  const handleUploadDishImage = async (file: File) => {
    if (!user || !menu || !storage) return;
    setIsLoading(true);
    try {
      const storageRef = ref(storage, `dishImages/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setMenu(prev => {
        if (!prev) return null;
        const dishImages = prev.dishImages || [];
        return { ...prev, dishImages: [...dishImages, downloadURL] };
      });
      setToastMessage("Dish photo uploaded successfully!");
    } catch (err) {
      console.error("Upload failed", err);
      setToastMessage("Failed to upload image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased ${isDarkMode ? 'dark' : ''}`}>
      {!isConfigured && (
        <div className="bg-amber-500 text-white px-4 py-2 text-center text-xs font-bold uppercase tracking-widest z-[100]">
          ⚠️ Firebase Configuration Missing. Please set your API keys in the environment variables.
        </div>
      )}
      <GoogleAnalytics />
      <FacebookPixel />
      <ManyChatWidget />
      <SEOHead 
        menu={menu} 
        title={viewMode === 'privacy' ? "Privacy Policy" : (viewMode === 'landing' ? "The Chef's Secret Weapon" : "Generate Menu")} 
      />
      
      {/* Banners removed to revert to original state */}

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
        onViewLibrary={() => setViewMode('library')}
        onAuthClick={() => {
          if (user) {
            if (auth) signOut(auth);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        user={user}
      />
      
      {viewMode === 'landing' && <LandingPage onGetStarted={() => setViewMode('generator')} />}

      {viewMode === 'pricing' && <PricingPage whopUrl={WHOP_STORE_URL} onSelectPlan={(p) => { selectPlan(p); setViewMode('generator'); }} currency={currency} />}

      {viewMode === 'library' && (
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-16">
          <CostingLibrary />
        </main>
      )}

      {viewMode === 'privacy' && (
        <PrivacyPolicy onBack={() => setViewMode('generator')} />
      )}

      {viewMode === 'terms' && (
        <TermsOfService onBack={() => setViewMode('generator')} />
      )}

      {viewMode === 'generator' && (
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-16">
          {!menu && !isLoading && (
            <div className="space-y-12 animate-slide-in">
              <div className="text-center max-w-2xl mx-auto px-4">
                <h1 className="text-4xl sm:text-7xl font-black text-high tracking-tight leading-tight">Catering Command Center</h1>
                <p className="mt-4 text-medium font-medium text-lg">Define your culinary vision and strategy.</p>
              </div>

              {isFounderMode && (
                  <div className="flex justify-center animate-bounce">
                      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border-2 border-indigo-400">
                          <ShieldCheck size={14} /> Founder Hub Active
                      </div>
                  </div>
              )}

              <div className="glass-card noise-overlay p-6 sm:p-12 md:p-16 rounded-[3rem] relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 main-grid">
                  
                  <div className="space-y-1 relative" ref={eventRef}>
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-low tracking-[0.2em] mb-2">
                      <Calendar size={12} className="text-low" />
                      Event Selection
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Type or select event (e.g. Wedding, Braai...)" 
                        value={eventTypeSearch || eventType}
                        onFocus={() => setShowEventResults(true)}
                        onChange={(e) => { setEventTypeSearch(e.target.value); setEventType(e.target.value); }}
                        className="w-full px-5 py-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold text-sm shadow-sm"
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
                    <label className="block text-[10px] font-black uppercase text-low tracking-[0.2em] mb-2">Guest Volume</label>
                    <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 focus:border-primary-500 outline-none transition-all text-high font-bold text-sm shadow-sm">
                      <option value="">Select Capacity...</option>
                      {GUEST_COUNT_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1 relative full-width-tablet" ref={cuisineRef}>
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-low tracking-[0.2em] mb-2">
                      <Search size={12} className="text-low" />
                      Culinary Style
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search country or cuisine style..." 
                        value={cuisineSearch || cuisine}
                        onFocus={() => setShowCuisineResults(true)}
                        onChange={(e) => { setCuisineSearch(e.target.value); setCuisine(e.target.value); }}
                        className="w-full px-5 py-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 focus:border-primary-500 outline-none transition-all text-high font-bold text-sm shadow-sm"
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
                    <label className="block text-[10px] font-black uppercase text-low tracking-[0.2em] mb-2">Service Style</label>
                    <select value={serviceStyle} onChange={(e) => setServiceStyle(e.target.value)} className="w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 focus:border-primary-500 outline-none transition-all text-high font-bold text-sm shadow-sm">
                      <option value="Standard Catering">Standard Catering</option>
                      <option value="Private Chef">Private Chef Experience</option>
                      <option value="Drop-off Only">Drop-off Only</option>
                      <option value="Buffet Style">Buffet Style</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-low tracking-[0.2em] mb-2">Budget Level</label>
                    <div className="flex gap-2">
                      {BUDGET_LEVELS.map(b => (
                        <button key={b.value} onClick={() => setBudget(b.value)} className={`flex-1 py-4 rounded-2xl border-2 font-black text-sm transition-all ${budget === b.value ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-low hover:border-primary-500'}`}>
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-low tracking-[0.2em] mb-2">Financial Setup</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 focus:border-primary-500 outline-none transition-all text-high font-bold text-sm shadow-sm">
                       <option value="ZAR">South African Rand (R)</option>
                       <option value="USD">US Dollar ($)</option>
                       <option value="EUR">Euro (€)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 full-width-tablet pt-4">
                    <button onClick={generateMenu} className="w-full py-6 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center gap-3">
                      <Sparkles className="w-7 h-7" /> Launch AI Culinary Planner
                    </button>
                  </div>
                </div>
              </div>

              {/* Roadmaps and labs removed to restore professional focus */}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32 animate-pulse text-center">
                <Loader2 className="w-20 h-20 text-primary-500 animate-spin mb-8" />
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Generating your Menu Proposal...</h2>
                <p className="text-slate-500 mt-2 font-medium">Crafting culinary excellence for your event.</p>
            </div>
          )}

          {menu && !isLoading && (
            <div className="space-y-12 animate-fade-in">
                <div className="no-print bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-3xl"><Sparkles className="text-primary-600 w-8 h-8" /></div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Menu Proposal</h3>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Ready for Client Delivery</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setMenu(null)} className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">← New Event</button>
                        <button onClick={() => window.print()} className="px-8 py-3.5 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase flex items-center gap-2 shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
                           <FileDown size={18} /> Export PDF
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
                  onRegenerateImage={regenerateImage}
                  onUploadDishImage={handleUploadDishImage}
                />
                
                {/* Roadmaps and labs removed to restore professional focus */}
            </div>
          )}
        </main>
      )}

      <AiChatBot onAttemptAccess={() => attemptAccess('aiChatBot')} isPro={canAccessFeature('aiChatBot')} />
      <SavedChecklistsModal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} savedMenus={savedMenus} onDelete={(id) => setSavedMenus(prev => prev.filter(m => m.id !== id))} />
      <QrCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} shareUrl={window.location.href} menuTitle={menu?.menuTitle} />
      <EmailCapture 
        isOpen={isEmailCaptureModalOpen} 
        onClose={() => setIsEmailCaptureModalOpen(false)} 
        onSave={(e, w) => { 
          localStorage.setItem('caterpro_user_email', e); 
          localStorage.setItem('caterpro_user_whatsapp', w); 
          setToastMessage("Contact Sync Successful!"); 
        }} 
        eventType={eventType}
        cuisine={cuisine}
      />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} onUpgrade={(p) => { selectPlan(p); setViewMode('generator'); setShowUpgradeModal(false); }} onViewPricing={() => setViewMode('pricing')} />
      <SocialMediaModal isOpen={isSocialModalOpen} onClose={() => setIsSocialModalOpen(false)} image={menu?.image} menuTitle={menu?.menuTitle || ''} menuDescription={menu?.description || ''} initialMode={socialModalMode} onImageGenerated={(b) => setMenu(p => p ? { ...p, image: b } : null)} />
      <PwaInstallModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
      
      {viewMode !== 'pricing' && <Footer facebookUrl={FACEBOOK_PAGE_URL} />}
    </div>
  );
};


