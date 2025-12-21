
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, AlertTriangle, Printer, FileDown, Copy, Sparkles, Megaphone, GraduationCap, ChevronRight, Coins, Share2, Film, Mail } from 'lucide-react';
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
import SocialMediaModal from './components/SocialMediaModal';
import MultiSelectDropdown from './components/MultiSelectDropdown';
import GenerationHistory from './components/GenerationHistory';
import CustomizationModal from './components/CustomizationModal';
import EmailCapture from './components/EmailCapture';
import PricingPage from './components/PricingPage';
import UpgradeModal from './components/UpgradeModal';
import PwaInstallModal from './components/PwaInstallModal';
import LandingPage from './components/LandingPage';
import ProductivityLab from './components/ProductivityLab';
import StudyGuideGenerator from './components/StudyGuideGenerator';
import SEOHead from './components/SEOHead';
import { useAppSubscription } from './hooks/useAppSubscription';
import { CUISINES, DIETARY_RESTRICTIONS, EVENT_TYPES, GUEST_COUNT_OPTIONS, BUDGET_LEVELS, SERVICE_STYLES, CURRENCIES } from './constants';
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
  const [currency, setCurrency] = useState('ZAR');
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

  const handleStartFromLanding = () => {
      setShowLanding(false);
      if (!localStorage.getItem('caterpro-subscription')) {
          selectPlan('free');
      }
      setIsAppVisible(true);
  };

  const openSocialCreator = (mode: 'create' | 'pitch' | 'video') => {
      if (mode === 'video' || mode === 'pitch') {
          if (!attemptAccess('educationTools')) return;
      }
      setSocialModalMode(mode);
      setIsSocialModalOpen(true);
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

  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased ${isDarkMode ? 'dark' : ''}`}>
      <SEOHead menu={menu} title={showLanding ? "The Chef's Secret Weapon" : "Generate Menu"} />
      
      <Navbar 
        onThemeToggle={toggleTheme} isDarkMode={isDarkMode} 
        onOpenSaved={() => attemptAccess('saveMenus') && setIsSavedModalOpen(true)} 
        savedCount={savedMenus.length} 
        onOpenQrCode={() => setIsQrModalOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onReset={() => { localStorage.removeItem('caterpro-subscription'); window.location.reload(); }}
        onViewLanding={() => { setShowLanding(true); setIsAppVisible(false); }}
      />
      
      {showLanding && !isAppVisible ? (
        <>
            <LandingPage onGetStarted={handleStartFromLanding} />
            <Footer />
        </>
      ) : !isAppVisible ? (
        <PricingPage onSelectPlan={(p) => { selectPlan(p); setIsAppVisible(true); }} currency={currency} />
      ) : (
        <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800">
                <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400 flex-shrink-0 mr-3" />
                    <div>
                        <h3 className="text-lg font-bold text-red-800 dark:text-red-200">{error.title}</h3>
                        <div className="text-sm text-red-700 dark:text-red-300 mt-1">{error.message}</div>
                    </div>
                </div>
            </div>
          )}

          {!menu && !isLoading && (
            <div className="space-y-8 animate-slide-in">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">What are we cooking?</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Design your perfect menu in seconds with AI.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Event Type</label>
                  <select 
                    value={eventType} 
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white"
                  >
                    <option value="">Select Event...</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {validationErrors.eventType && <p className="text-red-500 text-xs font-bold mt-1">{validationErrors.eventType}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Guest Count</label>
                  <select 
                    value={guestCount} 
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white"
                  >
                    <option value="">Select Guests...</option>
                    {GUEST_COUNT_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {validationErrors.guestCount && <p className="text-red-500 text-xs font-bold mt-1">{validationErrors.guestCount}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Cuisine Style</label>
                  <select 
                    value={cuisine} 
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white"
                  >
                    <option value="">Select Cuisine...</option>
                    {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {validationErrors.cuisine && <p className="text-red-500 text-xs font-bold mt-1">{validationErrors.cuisine}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Budget Level</label>
                  <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    {BUDGET_LEVELS.map(b => (
                      <button 
                        key={b.value}
                        onClick={() => setBudget(b.value)}
                        className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${budget === b.value ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500'}`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                   <MultiSelectDropdown 
                      label="Dietary Restrictions"
                      options={DIETARY_RESTRICTIONS}
                      selectedItems={dietaryRestrictions}
                      onChange={setDietaryRestrictions}
                      placeholder="Add restrictions..."
                   />
                </div>

                <div className="md:col-span-2 pt-4">
                  <button 
                    onClick={generateMenu}
                    className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-6 h-6" /> Generate Full Menu Proposal
                  </button>
                </div>
              </div>

              <GenerationHistory 
                history={[]} 
                onItemClick={() => {}} 
                onClear={() => {}} 
              />
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 animate-pulse">
                <Loader2 className="w-16 h-16 text-primary-500 animate-spin mb-6" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{loadingMessage}</h2>
                <p className="text-slate-500 mt-2 font-medium">This usually takes about 10-15 seconds.</p>
            </div>
          )}

          {menu && !isLoading && (
            <div className="space-y-8 animate-fade-in">
                {/* Dashboard Action Header */}
                <div className="no-print bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
                            <Sparkles className="text-primary-600 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Proposal Live</h3>
                            <p className="text-sm text-slate-500 font-medium">Manage, Share & Market your event.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        <button onClick={() => setMenu(null)} className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase text-slate-600 dark:text-slate-300">← New</button>
                        <button onClick={handleDownloadPDF} className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-lg">
                            {isExporting ? <Loader2 className="animate-spin" size={14} /> : <FileDown size={14} />} PDF
                        </button>
                        <button onClick={() => setIsSavedModalOpen(true)} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase flex items-center gap-2"><Save size={14} /> Save</button>
                    </div>
                </div>

                {/* Social & Marketing Creator (The Missing Part) */}
                <div className="no-print bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:rotate-12 transition-transform">
                        <Megaphone size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-black uppercase tracking-widest">Growth Engine</span>
                        </div>
                        <h4 className="text-2xl font-black mb-1">Social Media Creator</h4>
                        <p className="text-indigo-100 text-sm mb-8 max-w-md">Turn this menu into a viral marketing campaign. Generate captions, reels, and academic pitches.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button onClick={() => openSocialCreator('create')} className="flex items-center justify-center gap-2 py-4 px-6 bg-white text-indigo-700 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all">
                                <Share2 size={18} /> Social Posts
                            </button>
                            <button onClick={() => openSocialCreator('video')} className="flex items-center justify-center gap-2 py-4 px-6 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-white/20 transition-all">
                                <Film size={18} /> Cinematic Reel
                            </button>
                            <button onClick={() => openSocialCreator('pitch')} className="flex items-center justify-center gap-2 py-4 px-6 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-white/20 transition-all">
                                <Mail size={18} /> Pitch Email
                            </button>
                        </div>
                    </div>
                </div>

                <div ref={menuRef} className="rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <MenuDisplay 
                        menu={menu}
                        checkedItems={checkedItems}
                        onToggleItem={(key) => {
                            const newChecked = new Set(checkedItems);
                            if (newChecked.has(key)) newChecked.delete(key);
                            else newChecked.add(key);
                            setCheckedItems(newChecked);
                        }}
                        isEditable={subscription.plan === 'business'}
                        onEditItem={(section, index) => {
                             setItemToEdit({ section, index, text: (menu[section] as string[])[index] });
                             setIsCustomizationModalOpen(true);
                        }}
                        showToast={setToastMessage}
                        isGeneratingImage={isGeneratingImage}
                        onUpdateShoppingItemQuantity={(index, qty) => {
                            const newShoppingList = [...menu.shoppingList];
                            newShoppingList[index].quantity = qty;
                            setMenu({ ...menu, shoppingList: newShoppingList });
                        }}
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
                    />
                </div>
                
                <ProductivityLab dietaryRestrictions={dietaryRestrictions} />
                <StudyGuideGenerator isPro={subscription.plan === 'business'} onAttemptAccess={() => setShowUpgradeModal(true)} />
            </div>
          )}
        </main>
      )}

      <Footer />
      <AiChatBot onAttemptAccess={() => attemptAccess('aiChatBot')} isPro={canAccessFeature('aiChatBot')} />
      
      <SavedChecklistsModal 
        isOpen={isSavedModalOpen} 
        onClose={() => setIsSavedModalOpen(false)} 
        savedMenus={savedMenus} 
        onDelete={(id) => setSavedMenus(prev => prev.filter(m => m.id !== id))} 
      />

      <QrCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
      <CustomizationModal 
        isOpen={isCustomizationModalOpen} 
        onClose={() => setIsCustomizationModalOpen(false)} 
        itemToEdit={itemToEdit} 
        onSave={(section, index, text) => {
            const newSection = [...(menu![section] as string[])];
            newSection[index] = text;
            setMenu({ ...menu!, [section]: newSection });
            setIsCustomizationModalOpen(false);
        }} 
      />
      <EmailCapture 
        isOpen={isEmailCaptureModalOpen} 
        onClose={() => setIsEmailCaptureModalOpen(false)} 
        onSave={(email, whatsapp) => {
            localStorage.setItem('caterpro_user_email', email);
            localStorage.setItem('caterpro_user_whatsapp', whatsapp);
            setIsEmailCaptureModalOpen(false);
            setToastMessage("Settings saved!");
        }} 
      />
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        onUpgrade={(p) => { selectPlan(p); setShowUpgradeModal(false); }} 
      />
      <PwaInstallModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
      <SocialMediaModal 
        isOpen={isSocialModalOpen} 
        onClose={() => setIsSocialModalOpen(false)} 
        image={menu?.image}
        menuTitle={menu?.menuTitle || ''}
        menuDescription={menu?.description || ''}
        initialMode={socialModalMode}
      />
      
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
    </div>
  );
};

export default App;
