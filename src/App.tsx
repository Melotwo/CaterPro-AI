
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, AlertTriangle, Presentation, Printer, FileDown, Copy, Sparkles, PlusCircle, Link, ShoppingBag, ChefHat, ShieldCheck, Smartphone, X, Zap, FileText, MousePointerClick, Megaphone, Film, Rocket, Timer } from 'lucide-react';
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
import ProductCard from './components/ProductCard';
import QuoteModal from './components/QuoteModal';
import ProductSearchBar from './components/ProductSearchBar';
import FindChef from './components/FindChef';
import PricingPage from './components/PricingPage';
import UpgradeModal from './components/UpgradeModal';
import StudyGuideGenerator from './components/StudyGuideGenerator';
import PwaInstallModal from './components/PwaInstallModal';
import LandingPage from './components/LandingPage';
import FounderRoadmap from './components/FounderRoadmap';
import { useAppSubscription, type SubscriptionPlan } from './hooks/useAppSubscription';
import { exampleScenarios, CUISINES, DIETARY_RESTRICTIONS, EVENT_TYPES, GUEST_COUNT_OPTIONS, BUDGET_LEVELS, SERVICE_STYLES, EDITABLE_MENU_SECTIONS, RECOMMENDED_PRODUCTS, PROPOSAL_THEMES } from './constants';
import { SavedMenu, ErrorState, ValidationErrors, GenerationHistoryItem, Menu, MenuSection, PpeProduct, Supplier } from './types';
import { getApiErrorState } from './services/apiErrorHandler';
import { generateMenuFromApi, generateCustomMenuItemFromApi, generateMenuImageFromApi, findSuppliersNearby, generateSocialCaption } from './services/geminiService';

const LOADING_MESSAGES = [
  'Consulting with the master chefs...',
  'Designing your event experience...',
  'Finalizing the menu details...',
  'Preparing your proposal...',
];

const CHECKED_ITEMS_STORAGE_KEY = 'caterpro-checked-items';
const formInputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-950 transition-colors sm:text-sm text-slate-900 dark:text-white";

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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) return storedTheme === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [savedMenus, setSavedMenus] = useState<SavedMenu[]>([]);
  const [generationHistory, setGenerationHistory] = useState<GenerationHistoryItem[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [totalChecklistItems, setTotalChecklistItems] = useState(0);
  const [isAppVisible, setIsAppVisible] = useState(false);
  const [showPwaBanner, setShowPwaBanner] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const { subscription, selectPlan, recordGeneration, setShowUpgradeModal, showUpgradeModal, attemptAccess, generationsLeft, canAccessFeature, maxFreeGenerations } = useAppSubscription();

  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<{ section: MenuSection; index: number; text: string } | null>(null);
  const [bulkSelectedItems, setBulkSelectedItems] = useState<Set<string>>(new Set());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isEmailCaptureModalOpen, setIsEmailCaptureModalOpen] = useState(false);
  const [customItemDescription, setCustomItemDescription] = useState('');
  const [customItemCategory, setCustomItemCategory] = useState<MenuSection>('appetizers');
  const [isGeneratingCustomItem, setIsGeneratingCustomItem] = useState(false);
  const [customItemError, setCustomItemError] = useState<ErrorState | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PpeProduct | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[] | null>(null);
  const [isFindingSuppliers, setIsFindingSuppliers] = useState(false);
  const [findSuppliersError, setFindSuppliersError] = useState<ErrorState | null>(null);
  const [deliveryRadius, setDeliveryRadius] = useState('');
  const [calculatedFee, setCalculatedFee] = useState<string | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialCaption, setSocialCaption] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [socialModalMode, setSocialModalMode] = useState<'create' | 'reply' | 'video' | 'sell' | 'profile'>('create');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (localStorage.getItem('theme')) setIsDarkMode(isDark);
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

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const handleResetApp = () => {
    if (window.confirm("This will sign you out and return you to the landing page. Your saved menus will remain safe. Continue?")) {
        localStorage.removeItem('caterpro-subscription');
        window.location.reload();
    }
  };
  const handleViewLanding = () => {
      setShowLanding(true);
      setIsAppVisible(false);
  };

  const handleExampleClick = (scenario: typeof exampleScenarios[0]) => {
    setEventType(scenario.eventType);
    setGuestCount(scenario.guestCount);
    setBudget(scenario.budget);
    setServiceStyle(scenario.serviceStyle);
    setCuisine(scenario.cuisine);
    setDietaryRestrictions(scenario.dietaryRestrictions);
    setValidationErrors({});
    setCustomEventType('');
  };

  // Fix: Defined handleToggleChecklistItem to manage checked items state.
  const handleToggleChecklistItem = (key: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Fix: Defined handleOpenCustomizationModal to set the item being edited and open the modal.
  const handleOpenCustomizationModal = (section: MenuSection, index: number) => {
    if (!menu) return;
    const sectionItems = menu[section];
    if (sectionItems && Array.isArray(sectionItems) && typeof sectionItems[index] === 'string') {
      setItemToEdit({ section, index, text: sectionItems[index] as string });
      setIsCustomizationModalOpen(true);
    }
  };

  // Fix: Defined handleUpdateShoppingItemQuantity to update item quantities in the shopping list.
  const handleUpdateShoppingItemQuantity = (itemIndex: number, newQuantity: string) => {
    if (!menu || !menu.shoppingList) return;
    const newShoppingList = [...menu.shoppingList];
    newShoppingList[itemIndex] = { ...newShoppingList[itemIndex], quantity: newQuantity };
    setMenu({ ...menu, shoppingList: newShoppingList });
  };

  // Fix: Defined handleToggleBulkSelect to manage items selected for bulk actions.
  const handleToggleBulkSelect = (key: string) => {
    setBulkSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Fix: Defined handleUpgrade to handle subscription plan updates.
  const handleUpgrade = (plan: SubscriptionPlan) => {
    selectPlan(plan);
    setShowUpgradeModal(false);
    setToastMessage(`Successfully upgraded to ${plan}!`);
  };

  // Fix: Added handleSaveCustomization to persist changes from the CustomizationModal.
  const handleSaveCustomization = (section: MenuSection, index: number, newText: string) => {
    if (!menu) return;
    const sectionItems = menu[section];
    if (sectionItems && Array.isArray(sectionItems)) {
        const newItems = [...sectionItems];
        newItems[index] = newText;
        setMenu({ ...menu, [section]: newItems });
        setIsCustomizationModalOpen(false);
        setToastMessage("Item updated!");
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
      setMenu({ ...result.menu, theme: proposalTheme });
      setTotalChecklistItems(result.totalChecklistItems);
    } catch (e) {
      setError(getApiErrorState(e));
    } finally {
      setIsLoading(false);
    }
  };

  if (showLanding && !isAppVisible) {
      return (
        <>
            <Navbar 
                onThemeToggle={toggleTheme} 
                isDarkMode={isDarkMode} 
                onOpenSaved={() => attemptAccess('saveMenus') && setIsSavedModalOpen(true)} 
                savedCount={savedMenus.length} 
                onOpenQrCode={() => setIsQrModalOpen(true)}
                onOpenInstall={() => setIsInstallModalOpen(true)}
                onViewLanding={() => {}}
            />
            <LandingPage onGetStarted={() => {
                setShowLanding(false);
                if (localStorage.getItem('caterpro-subscription')) setIsAppVisible(true);
            }} />
            <Footer />
        </>
      );
  }

  if (!isAppVisible) return <PricingPage onSelectPlan={(p) => { selectPlan(p); setIsAppVisible(true); }} />;

  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased ${isDarkMode ? 'dark' : ''}`}>
      <Navbar 
        onThemeToggle={toggleTheme} 
        isDarkMode={isDarkMode} 
        onOpenSaved={() => attemptAccess('saveMenus') && setIsSavedModalOpen(true)} 
        savedCount={savedMenus.length} 
        onOpenQrCode={() => setIsQrModalOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onReset={handleResetApp}
        onViewLanding={handleViewLanding}
      />
      
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-[env(safe-area-inset-bottom)]">
        <header className="text-center animate-slide-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-200">CaterPro AI</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">Generate menus, shopping lists, and proposals for your food business.</p>
        </header>

        {/* FOUNDER ROADMAP DISPLAYED WHEN NO MENU IS ACTIVE */}
        {!menu && <FounderRoadmap />}

        <section className="mt-12 bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/80 animate-slide-in">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Start Your Next Proposal</h2>
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Event Type *</label>
                  <select value={eventType} onChange={(e) => setEventType(e.target.value)} className={formInputStyle}>
                    <option value="" disabled>Select an event...</option>
                    {EVENT_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                  {validationErrors.eventType && <p className="text-red-500 text-sm mt-1">{validationErrors.eventType}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Number of Guests *</label>
                  <select value={guestCount} onChange={e => setGuestCount(e.target.value)} className={formInputStyle}>
                    <option value="" disabled>Select guest range...</option>
                    {GUEST_COUNT_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cuisine Style *</label>
                  <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} className={formInputStyle}>
                    <option value="" disabled>Select a cuisine...</option>
                    {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={generateMenu} disabled={isLoading} className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 transition-all">
                {isLoading ? <Loader2 className="mr-2 animate-spin" /> : null}
                {isLoading ? 'Preparing Proposal...' : 'Generate Menu Proposal'}
              </button>
            </div>
        </section>

        {menu && (
          <section className="mt-12 animate-slide-in">
            <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
               <div ref={menuRef} className="print-area">
                <MenuDisplay 
                  menu={menu}
                  checkedItems={checkedItems}
                  onToggleItem={handleToggleChecklistItem}
                  isEditable={canAccessFeature('itemEditing')}
                  onEditItem={handleOpenCustomizationModal}
                  showToast={(m) => setToastMessage(m)}
                  isGeneratingImage={isGeneratingImage}
                  onUpdateShoppingItemQuantity={handleUpdateShoppingItemQuantity}
                  bulkSelectedItems={bulkSelectedItems}
                  onToggleBulkSelect={handleToggleBulkSelect}
                  onBulkCheck={() => {}}
                  onBulkUpdateQuantity={() => {}}
                  onClearBulkSelection={() => {}}
                  onSelectAllShoppingListItems={() => {}}
                  proposalTheme={proposalTheme}
                  canAccessFeature={canAccessFeature}
                  onAttemptAccess={(f) => attemptAccess(f)}
                  deliveryRadius={deliveryRadius}
                  onDeliveryRadiusChange={setDeliveryRadius}
                  onCalculateFee={() => {}}
                  calculatedFee={calculatedFee}
                />
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
      <SavedChecklistsModal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} savedMenus={savedMenus} onDelete={() => {}} />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} onUpgrade={handleUpgrade} />
      <CustomizationModal isOpen={isCustomizationModalOpen} onClose={() => setIsCustomizationModalOpen(false)} itemToEdit={itemToEdit} onSave={handleSaveCustomization} />
      <AiChatBot onAttemptAccess={() => attemptAccess('aiChatBot')} isPro={canAccessFeature('aiChatBot')} />
    </div>
  );
};

export default App;
