
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, AlertTriangle, Printer, FileDown, Copy, Sparkles, Megaphone, GraduationCap, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MenuDisplay from './components/MenuDisplay';
import SavedChecklistsModal from './components/SavedChecklistsModal';
import Toast from './components/Toast';
import AiChatBot from './components/AiChatBot';
import QrCodeModal from './components/QrCodeModal';
import ShareModal from './components/ShareModal';
import SocialMediaModal from './components/SocialMediaModal';
import MultiSelectDropdown from './components/MultiSelectDropdown';
import GenerationHistory from './components/GenerationHistory';
import CustomizationModal from './components/CustomizationModal';
import EmailCapture from './components/EmailCapture';
import PricingPage from './components/PricingPage';
import UpgradeModal from './components/UpgradeModal';
import PwaInstallModal from './components/PwaInstallModal';
import LandingPage from './components/LandingPage';
import FounderRoadmap from './components/FounderRoadmap';
import ProductivityLab from './components/ProductivityLab';
import { useAppSubscription, type SubscriptionPlan } from './hooks/useAppSubscription';
import { CUISINES, DIETARY_RESTRICTIONS, EVENT_TYPES, GUEST_COUNT_OPTIONS, BUDGET_LEVELS, SERVICE_STYLES } from './constants';
import { SavedMenu, ErrorState, ValidationErrors, Menu, MenuSection } from './types';
import { getApiErrorState } from './services/apiErrorHandler';
import { generateMenuFromApi, generateMenuImageFromApi } from './services/geminiService';

const LOADING_MESSAGES = [
  'Consulting with the master chefs...',
  'Designing your event experience...',
  'Finalizing the menu details...',
  'Preparing your proposal...',
  'Organizing your shopping list...',
];

const App: React.FC = () => {
  const [eventType, setEventType] = useState('');
  const [customEventType, setCustomEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [budget, setBudget] = useState('$$');
  const [serviceStyle, setServiceStyle] = useState('Standard Catering');
  const [cuisine, setCuisine] = useState('');
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
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isAppVisible, setIsAppVisible] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const { subscription, selectPlan, recordGeneration, setShowUpgradeModal, showUpgradeModal, attemptAccess, canAccessFeature } = useAppSubscription();

  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<{ section: MenuSection; index: number; text: string } | null>(null);
  const [isEmailCaptureModalOpen, setIsEmailCaptureModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialModalMode, setSocialModalMode] = useState<'create' | 'pitch' | 'video'>('create');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSelectedPlan = localStorage.getItem('caterpro-subscription');
    if (hasSelectedPlan) {
      setIsAppVisible(true);
      setShowLanding(false);
    }
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

  useEffect(() => {
    if (isLoading) {
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[i]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  const handleDownloadPDF = async () => {
    if (!menuRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(menuRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: isDarkMode ? '#020617' : '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${menu?.menuTitle.replace(/\s+/g, '_') || 'Catering_Proposal'}.pdf`);
      setToastMessage("PDF downloaded successfully!");
    } catch (e) {
      console.error("PDF Export failed:", e);
      setToastMessage("Failed to generate PDF. Try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const generateMenu = async () => {
    if (!recordGeneration()) return;
    const newValidationErrors: ValidationErrors = {};
    if (!eventType) newValidationErrors.eventType = "Please select an event type.";
    if (!guestCount) newValidationErrors.guestCount = "Please select a guest count.";
    if (!cuisine) newValidationErrors.cuisine = "Please select a cuisine type.";
    setValidationErrors(newValidationErrors);
    if (Object.keys(newValidationErrors).length > 0) return;

    setIsLoading(true);
    setError(null);
    setMenu(null);
    try {
      const result = await generateMenuFromApi({
        eventType: eventType === 'Other...' ? customEventType : eventType,
        guestCount,
        budget,
        serviceStyle,
        cuisine,
        dietaryRestrictions,
      });
      
      const newMenu = { ...result.menu, theme: proposalTheme };
      setMenu(newMenu);
      setIsLoading(false); // Text is done, now we handle the image in background

      // Trigger Background Image Generation
      setIsGeneratingImage(true);
      try {
        const imageBase64 = await generateMenuImageFromApi(newMenu.menuTitle, newMenu.description);
        setMenu(prev => prev ? { ...prev, image: imageBase64 } : null);
      } catch (imgErr) {
        console.warn("Auto image generation failed", imgErr);
      } finally {
        setIsGeneratingImage(false);
      }
      
      if (!localStorage.getItem('caterpro_user_email')) {
          setIsEmailCaptureModalOpen(true);
      }
    } catch (e) {
      setError(getApiErrorState(e));
      setIsLoading(false);
    }
  };

  const handleOpenSocialModal = (mode: typeof socialModalMode) => {
    setSocialModalMode(mode);
    setIsSocialModalOpen(true);
  };

  if (showLanding && !isAppVisible) {
      return (
        <>
            <Navbar 
                onThemeToggle={toggleTheme} isDarkMode={isDarkMode} 
                onOpenSaved={() => attemptAccess('saveMenus') && setIsSavedModalOpen(true)} 
                savedCount={savedMenus.length} 
                onOpenQrCode={() => setIsQrModalOpen(true)}
                onOpenInstall={() => setIsInstallModalOpen(true)}
                onViewLanding={() => {}}
            />
            <LandingPage onGetStarted={() => { setShowLanding(false); if (localStorage.getItem('caterpro-subscription')) setIsAppVisible(true); }} />
            <Footer />
        </>
      );
  }

  if (!isAppVisible) return <PricingPage onSelectPlan={(p) => { selectPlan(p); setIsAppVisible(true); }} />;

  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased ${isDarkMode ? 'dark' : ''}`}>
      <Navbar 
        onThemeToggle={toggleTheme} isDarkMode={isDarkMode} 
        onOpenSaved={() => attemptAccess('saveMenus') && setIsSavedModalOpen(true)} 
        savedCount={savedMenus.length} 
        onOpenQrCode={() => setIsQrModalOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onReset={() => { localStorage.removeItem('caterpro-subscription'); window.location.reload(); }}
        onViewLanding={() => { setShowLanding(true); setIsAppVisible(false); }}
      />
      
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header className="text-center animate-slide-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-200">CaterPro AI</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Intelligent catering paperwork for busy chefs.</p>
        </header>

        {!menu && <FounderRoadmap />}

        <section className="mt-12 bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700/80 animate-slide-in">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">New Proposal</h2>
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Event Type *</label>
                  <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm">
                    <option value="" disabled>Select an event...</option>
                    {EVENT_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                  {validationErrors.eventType && <p className="text-red-500 text-sm mt-1">{validationErrors.eventType}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Guests *</label>
                  <select value={guestCount} onChange={e => setGuestCount(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm">
                    <option value="" disabled>Select range...</option>
                    {GUEST_COUNT_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cuisine Style *</label>
                  <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm">
                    <option value="" disabled>Select cuisine...</option>
                    {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-slide-in">
                   <div className="flex gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-red-800 dark:text-red-200">{error.title}</p>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error.message}</p>
                      </div>
                   </div>
                </div>
              )}

              <button 
                onClick={generateMenu} 
                disabled={isLoading} 
                className="w-full inline-flex items-center justify-center px-6 py-4 text-lg font-black text-white bg-primary-600 rounded-2xl shadow-xl hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                {isLoading ? loadingMessage : 'Generate Proposal'}
              </button>
            </div>
        </section>

        {/* 
          NotebookLM Suggestion Lab - Moved here so it's always visible 
          even before a menu is generated, helping with discovery.
        */}
        <ProductivityLab dietaryRestrictions={dietaryRestrictions} />

        {menu && (
          <section className="mt-12 animate-slide-in">
             <div className="mb-4 flex flex-wrap items-center gap-2 no-print">
                <button onClick={() => handleOpenSocialModal('pitch')} className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm shadow-lg transition-all active:scale-95">
                    <GraduationCap size={18} /> Draft Assignment Email
                </button>
                <button onClick={handleDownloadPDF} disabled={isExporting} className="flex items-center gap-2 py-3 px-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-md border border-slate-200 dark:border-slate-700">
                    {isExporting ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
                    Download PDF
                </button>
                <button onClick={() => handleOpenSocialModal('create')} className="flex items-center gap-2 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                    <Megaphone size={18} /> Social Post
                </button>
             </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
               <div ref={menuRef} className="print-area">
                <MenuDisplay 
                  menu={menu}
                  checkedItems={checkedItems}
                  onToggleItem={(k) => setCheckedItems(prev => {
                    const next = new Set(prev);
                    if (next.has(k)) next.delete(k); else next.add(k);
                    return next;
                  })}
                  isEditable={canAccessFeature('itemEditing')}
                  onEditItem={(s, i) => {
                    const items = menu[s];
                    if (items && Array.isArray(items)) {
                      setItemToEdit({ section: s, index: i, text: items[i] as string });
                      setIsCustomizationModalOpen(true);
                    }
                  }}
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
                  deliveryRadius=""
                  onDeliveryRadiusChange={() => {}}
                  onCalculateFee={() => {}}
                  calculatedFee={null}
                />
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
      <EmailCapture isOpen={isEmailCaptureModalOpen} onClose={() => setIsEmailCaptureModalOpen(false)} onSave={(e, w) => { localStorage.setItem('caterpro_user_email', e); localStorage.setItem('caterpro_user_whatsapp', w); setIsEmailCaptureModalOpen(false); }} />
      <SocialMediaModal 
        isOpen={isSocialModalOpen} 
        onClose={() => setIsSocialModalOpen(false)} 
        image={menu?.image} 
        menuTitle={menu?.menuTitle || ''} 
        menuDescription={menu?.description || ''} 
        initialMode={socialModalMode} 
        onImageGenerated={(b64) => setMenu(prev => prev ? { ...prev, image: b64 } : null)}
      />
      <SavedChecklistsModal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} savedMenus={savedMenus} onDelete={() => {}} />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} onUpgrade={(p) => { selectPlan(p); setShowUpgradeModal(false); }} />
      <CustomizationModal isOpen={isCustomizationModalOpen} onClose={() => setIsCustomizationModalOpen(false)} itemToEdit={itemToEdit} onSave={(s, i, t) => {
        if (!menu) return;
        const newItems = [...(menu[s] as any[])];
        newItems[i] = t;
        setMenu({ ...menu, [s]: newItems });
        setIsCustomizationModalOpen(false);
      }} />
      <AiChatBot onAttemptAccess={() => attemptAccess('aiChatBot')} isPro={canAccessFeature('aiChatBot')} />
    </div>
  );
};

export default App;
