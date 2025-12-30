
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, AlertTriangle, FileDown, Sparkles, Megaphone, GraduationCap, Share2, Film, Mail, Search, Globe } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MenuDisplay from './components/MenuDisplay';
import SavedChecklistsModal from './components/SavedChecklistsModal';
import Toast from './components/Toast';
import AiChatBot from './components/AiChatBot';
import QrCodeModal from './components/QrCodeModal';
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

// --- MASTER CONFIGURATION ---
// Tumi: Change this to match your Whop Store URL (e.g., https://whop.com/caterproai)
const WHOP_STORE_URL = "https://whop.com/CaterProAi"; 

type AppView = 'landing' | 'generator' | 'pricing';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<AppView>('landing');
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [budget, setBudget] = useState('$$');
  const [currency, setCurrency] = useState('ZAR'); 
  const [serviceStyle, setServiceStyle] = useState('Standard Catering');
  const [cuisine, setCuisine] = useState('');
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [showCuisineResults, setShowCuisineResults] = useState(false);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [proposalTheme, setProposalTheme] = useState('classic');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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
  const [toastMessage, setToastMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const { subscription, selectPlan, recordGeneration, setShowUpgradeModal, showUpgradeModal, attemptAccess, canAccessFeature } = useAppSubscription();

  const [isEmailCaptureModalOpen, setIsEmailCaptureModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialModalMode, setSocialModalMode] = useState<SocialMode>('create');

  const cuisineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cuisineRef.current && !cuisineRef.current.contains(event.target as Node)) {
        setShowCuisineResults(false);
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

  const filteredCuisines = CUISINES.filter(c => 
    c.toLowerCase().includes(cuisineSearch.toLowerCase())
  );

  const handleStartFromLanding = () => {
      if (!localStorage.getItem('caterpro-subscription')) selectPlan('free');
      setViewMode('generator');
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

    try {
      const result = await generateMenuFromApi({
        eventType,
        guestCount,
        budget,
        serviceStyle,
        cuisine,
        dietaryRestrictions,
        currency,
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
      
      <Navbar 
        whopUrl={WHOP_STORE_URL}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} 
        onOpenSaved={() => attemptAccess('saveMenus') && setIsSavedModalOpen(true)} 
        savedCount={savedMenus.length} 
        onOpenQrCode={() => setIsQrModalOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onReset={() => { localStorage.removeItem('caterpro-subscription'); window.location.reload(); }}
        onViewLanding={() => setViewMode('landing')}
        onViewPricing={() => setViewMode('pricing')}
      />
      
      {viewMode === 'landing' && <LandingPage onGetStarted={handleStartFromLanding} />}

      {viewMode === 'pricing' && <PricingPage whopUrl={WHOP_STORE_URL} onSelectPlan={(p) => { selectPlan(p); setViewMode('generator'); }} currency={currency} />}

      {viewMode === 'generator' && (
        <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-bold text-red-800 dark:text-red-200">{error.title}</h3>
                    <div className="text-sm text-red-700 dark:text-red-300 mt-1">{error.message}</div>
                </div>
            </div>
          )}

          {!menu && !isLoading && (
            <div className="space-y-8 animate-slide-in">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">What are we cooking?</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Search for any country or culinary style.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-widest">Event Type</label>
                  <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold text-sm">
                    <option value="">Select Event...</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-widest">Guest Count</label>
                  <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold text-sm">
                    <option value="">Select Guests...</option>
                    {GUEST_COUNT_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="space-y-1 relative" ref={cuisineRef}>
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-widest">Country or Cuisine</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. Italy, USA, South Africa..." 
                      value={cuisineSearch || cuisine}
                      onFocus={() => setShowCuisineResults(true)}
                      onChange={(e) => { setCuisineSearch(e.target.value); setCuisine(e.target.value); }}
                      className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold text-sm"
                    />
                  </div>
                  {showCuisineResults && filteredCuisines.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                        {filteredCuisines.map(c => (
                            <button key={c} onClick={() => { setCuisine(c); setCuisineSearch(c); setShowCuisineResults(false); }} className="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-bold flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 last:border-0 dark:text-white">
                                <Globe size={14} className="text-primary-500" /> {c}
                            </button>
                        ))}
                    </div>
                  )}
                  {validationErrors.cuisine && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{validationErrors.cuisine}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-widest">Preferred Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold text-sm">
                     <option value="ZAR">South African Rand (R)</option>
                     <option value="USD">US Dollar ($)</option>
                     <option value="GBP">British Pound (£)</option>
                     <option value="EUR">Euro (€)</option>
                     <option value="HUF">Hungarian Forint (Ft)</option>
                  </select>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button onClick={generateMenu} className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6" /> Generate Professional Proposal
                  </button>
                </div>
              </div>
              <FounderRoadmap whopUrl={WHOP_STORE_URL} />
              <ResearchHub onShowToast={setToastMessage} />
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 animate-pulse">
                <Loader2 className="w-16 h-16 text-primary-500 animate-spin mb-6" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Curating your masterwork...</h2>
            </div>
          )}

          {menu && !isLoading && (
            <div className="space-y-8 animate-fade-in">
                <div className="no-print bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl"><Sparkles className="text-primary-600 w-6 h-6" /></div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Proposal Ready</h3>
                            <p className="text-sm text-slate-500 font-medium">Ready for your client or Academy PoE.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setMenu(null)} className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase text-slate-600 dark:text-slate-300">← New</button>
                        <button onClick={generateMenu} className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-lg">
                           <FileDown size={14} /> PDF Export
                        </button>
                    </div>
                </div>

                <MenuDisplay menu={menu} checkedItems={checkedItems} onToggleItem={(k) => {
                    const next = new Set(checkedItems);
                    if (next.has(k)) next.delete(k); else next.add(k);
                    setCheckedItems(next);
                }} isEditable={canAccessFeature('reelsMode')} onEditItem={() => {}} showToast={setToastMessage} isGeneratingImage={isGeneratingImage} onUpdateShoppingItemQuantity={() => {}} bulkSelectedItems={new Set()} onToggleBulkSelect={() => {}} onBulkCheck={() => {}} onBulkUpdateQuantity={() => {}} onClearBulkSelection={() => {}} onSelectAllShoppingListItems={() => {}} proposalTheme={proposalTheme} canAccessFeature={canAccessFeature} onAttemptAccess={attemptAccess} deliveryRadius="10" onDeliveryRadiusChange={() => {}} onCalculateFee={() => {}} calculatedFee={null} preferredCurrency={currency} />
                
                <MarketingRoadmap />
                <FounderRoadmap whopUrl={WHOP_STORE_URL} />
                <ResearchHub onShowToast={setToastMessage} />
            </div>
          )}
        </main>
      )}

      <AiChatBot onAttemptAccess={() => attemptAccess('aiChatBot')} isPro={canAccessFeature('aiChatBot')} />
      <SavedChecklistsModal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} savedMenus={savedMenus} onDelete={(id) => setSavedMenus(prev => prev.filter(m => m.id !== id))} />
      <QrCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
      <EmailCapture isOpen={isEmailCaptureModalOpen} onClose={() => setIsEmailCaptureModalOpen(false)} onSave={(e, w) => { localStorage.setItem('caterpro_user_email', e); localStorage.setItem('caterpro_user_whatsapp', w); setToastMessage("Contact Sync Successful!"); }} />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} onUpgrade={(p) => { selectPlan(p); setViewMode('generator'); setShowUpgradeModal(false); }} onViewPricing={() => setViewMode('pricing')} />
      <SocialMediaModal isOpen={isSocialModalOpen} onClose={() => setIsSocialModalOpen(false)} image={menu?.image} menuTitle={menu?.menuTitle || ''} menuDescription={menu?.description || ''} initialMode={socialModalMode} onImageGenerated={(b) => setMenu(p => p ? { ...p, image: b } : null)} />
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
      
      {/* Footer rendered once for all views except pricing which has its own */}
      {viewMode !== 'pricing' && <Footer />}
    </div>
  );
};

export default App;
