import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, AlertTriangle, Presentation, Printer, FileDown, Copy, Sparkles, PlusCircle, Link, RefreshCw, ShoppingBag, ChefHat, ShieldCheck, Smartphone, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import MarkdownRenderer from './components/MarkdownRenderer.tsx';
import SavedChecklistsModal from './components/SavedChecklistsModal.tsx';
import Toast from './components/Toast.tsx';
import AiChatBot from './components/AiChatBot.tsx';
import QrCodeModal from './components/QrCodeModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import MultiSelectDropdown from './components/MultiSelectDropdown.tsx';
import GenerationHistory from './components/GenerationHistory.tsx';
import CustomizationModal from './components/CustomizationModal.tsx';
import EmailCapture from './components/EmailCapture.tsx';
import ProductCard from './components/ProductCard.tsx';
import QuoteModal from './components/QuoteModal.tsx';
import ProductSearchBar from './components/ProductSearchBar.tsx';
import FindChef from './components/FindChef.tsx';
import PricingPage from './components/PricingPage.tsx';
import UpgradeModal from './components/UpgradeModal.tsx';
import { useSubscription, SubscriptionPlan } from './hooks/useSubscription.ts';
import { exampleScenarios, CUISINES, DIETARY_RESTRICTIONS, EVENT_TYPES, GUEST_COUNT_OPTIONS, BUDGET_LEVELS, SERVICE_STYLES, EDITABLE_MENU_SECTIONS, RECOMMENDED_PRODUCTS, PROPOSAL_THEMES } from './constants.ts';
import { SavedMenu, ErrorState, ValidationErrors, GenerationHistoryItem, Menu, MenuSection, PpeProduct, Supplier } from './types.ts';
import { getApiErrorState } from './services/errorHandler.ts';
import { generateMenuFromApi, generateCustomMenuItemFromApi, generateMenuImageFromApi, findSuppliersNearby } from './services/geminiService.ts';


const LOADING_MESSAGES = [
  'Consulting with the master chefs...',
  'Designing your event experience...',
  'Finalizing the menu details...',
  'Preparing your proposal...',
];

const CHECKED_ITEMS_STORAGE_KEY = 'caterpro-checked-items';

const formInputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-950 transition-colors sm:text-sm";


// ========= MAIN APP COMPONENT =========
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
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const { 
    subscription, 
    selectPlan, 
    recordGeneration, 
    showUpgradeModal, 
    setShowUpgradeModal, 
    attemptAccess, 
    generationsLeft,
    canAccessFeature
  } = useSubscription();


  // State for the item customization modal
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<{ section: MenuSection; index: number; text: string } | null>(null);
  
  // State for bulk shopping list editing
  const [bulkSelectedItems, setBulkSelectedItems] = useState<Set<string>>(new Set());

  // State for sharing
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // State for email capture
  const [isEmailCaptureModalOpen, setIsEmailCaptureModalOpen] = useState(false);

  // State for the new custom item generator
  const [customItemDescription, setCustomItemDescription] = useState('');
  const [customItemCategory, setCustomItemCategory] = useState<MenuSection>('appetizers');
  const [isGeneratingCustomItem, setIsGeneratingCustomItem] = useState(false);
  const [customItemError, setCustomItemError] = useState<ErrorState | null>(null);
  
  // State for products and quote modal
  const [selectedBudget, setSelectedBudget] = useState<'All' | '$' | '$$' | '$$$'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PpeProduct | null>(null);

  // State for suppliers feature
  const [suppliers, setSuppliers] = useState<Supplier[] | null>(null);
  const [isFindingSuppliers, setIsFindingSuppliers] = useState(false);
  const [findSuppliersError, setFindSuppliersError] = useState<ErrorState | null>(null);

  // State for delivery fee calculator
  const [deliveryRadius, setDeliveryRadius] = useState('');
  const [calculatedFee, setCalculatedFee] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);

    const hasSelectedPlan = localStorage.getItem('caterpro-subscription');
    if (hasSelectedPlan) {
      setIsAppVisible(true);
    }
    
    const pwaBannerDismissed = localStorage.getItem('pwaBannerDismissed');
    if (!pwaBannerDismissed) {
        setShowPwaBanner(true);
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
    try {
      const storedMenus = localStorage.getItem('savedMenus');
      if (storedMenus) {
        setSavedMenus(JSON.parse(storedMenus));
      }
      const storedHistory = localStorage.getItem('generationHistory');
      if (storedHistory) {
        setGenerationHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse data from localStorage", e);
    }
    
    if (window.location.hash && window.location.hash.startsWith('#share=')) {
      try {
        const encodedString = window.location.hash.substring(7);
        const base64String = decodeURIComponent(encodedString);
        const binaryString = atob(base64String);
        const utf8Bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          utf8Bytes[i] = binaryString.charCodeAt(i);
        }
        const jsonString = new TextDecoder().decode(utf8Bytes);
        const loadedMenu: Menu = JSON.parse(jsonString);
        
        // If user has a plan, show app, otherwise show pricing page with a toast
        if (localStorage.getItem('caterpro-subscription')) {
          setIsAppVisible(true);
        }

        setMenu(loadedMenu);
        if (loadedMenu.theme) {
            setProposalTheme(loadedMenu.theme);
        }
        const totalItems = [
          ...(loadedMenu.appetizers || []),
          ...(loadedMenu.mainCourses || []),
          ...(loadedMenu.sideDishes || []),
          ...(loadedMenu.dessert || []),
          ...(loadedMenu.dietaryNotes || []),
          ...(loadedMenu.beveragePairings || []),
          ...(loadedMenu.miseEnPlace || []),
          ...(loadedMenu.serviceNotes || []),
          ...(loadedMenu.deliveryLogistics || []),
          ...(loadedMenu.shoppingList || []),
        ].length;
        setTotalChecklistItems(totalItems);
        
        setCheckedItems(new Set());
        localStorage.removeItem(CHECKED_ITEMS_STORAGE_KEY);

        showToast("Menu loaded from share link!");
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (error) {
        console.error("Failed to load menu from share link:", error);
        setError({
          title: "Invalid Share Link",
          message: "The provided share link is corrupted or invalid. Please check the link and try again."
        });
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } else {
        try {
            const storedCheckedItems = localStorage.getItem(CHECKED_ITEMS_STORAGE_KEY);
            if (storedCheckedItems) {
                setCheckedItems(new Set(JSON.parse(storedCheckedItems)));
            }
        } catch(e) {
            console.error("Failed to load checked items from localStorage", e);
        }
    }

  }, []);

  useEffect(() => {
    localStorage.setItem(CHECKED_ITEMS_STORAGE_KEY, JSON.stringify(Array.from(checkedItems)));
  }, [checkedItems]);


  useEffect(() => {
    let messageInterval: number | undefined;
    if (isLoading) {
      setLoadingMessage(LOADING_MESSAGES[0]);
      let index = 0;
      messageInterval = window.setInterval(() => {
        index = (index + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[index]);
      }, 2000);
    }
    return () => {
      if (messageInterval) clearInterval(messageInterval);
    };
  }, [isLoading]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    selectPlan(plan);
    setIsAppVisible(true);
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    selectPlan(plan);
    setShowUpgradeModal(false);
    showToast(`Successfully upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`);
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);

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

  const showToast = (message: string) => {
    setToastMessage(message);
  }

  const getUserLocation = (): Promise<{ lat: number; lon: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          resolve(null);
        }
      );
    });
  };

  const generateMenu = async () => {
    if (!recordGeneration()) return;

    const newValidationErrors: ValidationErrors = {};
    if (!eventType) {
      newValidationErrors.eventType = "Please select an event type.";
    } else if (eventType === 'Other...' && !customEventType.trim()) {
      newValidationErrors.eventType = "Please specify your custom event type.";
    }
    if (!guestCount) newValidationErrors.guestCount = "Please select a guest count.";
    if (!cuisine) newValidationErrors.cuisine = "Please select a cuisine type.";
    
    setValidationErrors(newValidationErrors);

    if (Object.keys(newValidationErrors).length > 0) {
        return;
    }

    setIsLoading(true);
    setError(null);
    setMenu(null);
    setCheckedItems(new Set());
    setBulkSelectedItems(new Set());
    setTotalChecklistItems(0);
    setDeliveryRadius('');
    setCalculatedFee(null);

    const finalEventType = eventType === 'Other...' ? customEventType : eventType;
    const location = await getUserLocation();

    try {
      const result = await generateMenuFromApi({
        eventType: finalEventType,
        guestCount,
        budget,
        serviceStyle,
        cuisine,
        dietaryRestrictions,
        latitude: location?.lat,
        longitude: location?.lon,
      });
      
      const menuWithTheme = { ...result.menu, theme: proposalTheme };
      setMenu(menuWithTheme);
      setTotalChecklistItems(result.totalChecklistItems);

      const newHistoryItem: GenerationHistoryItem = {
        id: Date.now(),
        eventType: finalEventType,
        guestCount,
        cuisine,
        serviceStyle,
        dietaryRestrictions,
        timestamp: new Date().toLocaleString(),
      };
      setGenerationHistory(prev => {
        const updatedHistory = [newHistoryItem, ...prev].slice(0, 10);
        localStorage.setItem('generationHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });

      const storedEmail = localStorage.getItem('caterpro_user_email');
      if (!storedEmail) {
          setIsEmailCaptureModalOpen(true);
      }
      
      if (!localStorage.getItem('pwaBannerDismissed')) {
          setShowPwaBanner(true);
      }


      (async () => {
        setIsGeneratingImage(true);
        try {
            const image = await generateMenuImageFromApi(result.menu.menuTitle, result.menu.description);
            setMenu(prevMenu => prevMenu ? { ...prevMenu, image } : null);
        } catch (imageError) {
            console.error("Failed to generate menu image:", imageError);
        } finally {
            setIsGeneratingImage(false);
        }
      })();

    } catch (e) {
      setError(getApiErrorState(e));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCustomItem = async () => {
    if (!attemptAccess('customItemGeneration') || !customItemDescription.trim()) return;

    setIsGeneratingCustomItem(true);
    setCustomItemError(null);
    try {
        const newItem = await generateCustomMenuItemFromApi(customItemDescription, customItemCategory);
        setMenu(prevMenu => {
            if (!prevMenu) return null;
            const updatedMenu = { ...prevMenu };
            const currentSection = (updatedMenu[customItemCategory] as string[]) || [];
            const updatedSection = [...currentSection, newItem];
            (updatedMenu as any)[customItemCategory] = updatedSection;
            return updatedMenu;
        });
        setTotalChecklistItems(prev => prev + 1);
        setCustomItemDescription('');
        showToast('Custom item added successfully!');
    } catch (e) {
        setCustomItemError(getApiErrorState(e));
    } finally {
        setIsGeneratingCustomItem(false);
    }
  };


  const handleToggleChecklistItem = (key: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(key)) {
      newChecked.delete(key);
    } else {
      newChecked.add(key);
    }
    setCheckedItems(newChecked);
  };
  
  const handleOpenCustomizationModal = (section: MenuSection, index: number) => {
    if (!attemptAccess('itemEditing') || !menu) return;
    const items = menu[section];
    if (Array.isArray(items) && typeof items[index] === 'string') {
        const text = items[index] as string;
        setItemToEdit({ section, index, text });
        setIsCustomizationModalOpen(true);
    }
  };

  const handleSaveCustomization = (section: MenuSection, index: number, newText: string) => {
    if (!menu) return;

    const updatedMenu = { ...menu };
    const sectionItems = updatedMenu[section];

    if (Array.isArray(sectionItems)) {
        const updatedSection = [...sectionItems];
        updatedSection[index] = newText;
        (updatedMenu as any)[section] = updatedSection;
        
        setMenu(updatedMenu);
    }
    
    setIsCustomizationModalOpen(false);
    showToast('Menu item updated successfully!');
  };

  const handleUpdateShoppingItemQuantity = (originalIndex: number, newQuantity: string) => {
      setMenu(prevMenu => {
          if (!prevMenu) return null;
          
          const updatedShoppingList = [...prevMenu.shoppingList];
          if (updatedShoppingList[originalIndex]) {
              updatedShoppingList[originalIndex] = {
                  ...updatedShoppingList[originalIndex],
                  quantity: newQuantity,
              };
          }

          return {
              ...prevMenu,
              shoppingList: updatedShoppingList,
          };
      });
  };

  const handleToggleBulkSelect = (key: string) => {
    setBulkSelectedItems(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(key)) {
        newSelection.delete(key);
      } else {
        newSelection.add(key);
      }
      return newSelection;
    });
  };

  const handleClearBulkSelection = () => setBulkSelectedItems(new Set());

  const handleSelectAllShoppingListItems = () => {
    if (!menu) return;
    const allItemKeys = new Set(menu.shoppingList.map((_, index) => `shoppingList-${index}`));
    setBulkSelectedItems(allItemKeys);
  };

  const handleBulkCheck = () => {
    setCheckedItems(prev => {
        const newChecked = new Set(prev);
        bulkSelectedItems.forEach(item => newChecked.add(item));
        return newChecked;
    });
    showToast(`${bulkSelectedItems.size} items marked as purchased.`);
  };

  const handleBulkUpdateQuantity = (newQuantity: string) => {
    if (!menu || !newQuantity.trim() || bulkSelectedItems.size === 0) return;

    const selectedIndices = new Set(
      Array.from(bulkSelectedItems).map((key: string) => parseInt(key.split('-')[1], 10))
    );

    const updatedShoppingList = menu.shoppingList.map((item, index) => {
      if (selectedIndices.has(index)) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setMenu(prev => prev ? { ...prev, shoppingList: updatedShoppingList } : null);
    showToast(`${selectedIndices.size} item quantities updated.`);
  };

  const handleFindSuppliers = async () => {
    if (!attemptAccess('findSuppliers')) return;

    setIsFindingSuppliers(true);
    setFindSuppliersError(null);
    setSuppliers(null);

    try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;

        const foundSuppliers = await findSuppliersNearby(latitude, longitude);
        setSuppliers(foundSuppliers);
    } catch (err: any) {
        let errorState: ErrorState;
        if (err.code === err.PERMISSION_DENIED) {
            errorState = {
                title: "Location Access Denied",
                message: "To find suppliers near you, please enable location services in your browser settings and try again."
            };
        } else {
             errorState = getApiErrorState(err);
        }
        setFindSuppliersError(errorState);
    } finally {
        setIsFindingSuppliers(false);
    }
  };

  const handleCalculateFee = () => {
    if (!menu?.deliveryFeeStructure || deliveryRadius === '') {
      setCalculatedFee(null);
      return;
    }
    const radius = parseFloat(deliveryRadius);
    if (isNaN(radius) || radius < 0) {
      setCalculatedFee('Invalid distance');
      return;
    }
    const { baseFee, perUnitRate, currency } = menu.deliveryFeeStructure;
    const totalFee = baseFee + radius * perUnitRate;
    setCalculatedFee(
      new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(totalFee)
    );
  };


  const completionPercentage = totalChecklistItems > 0 ? (checkedItems.size / totalChecklistItems) * 100 : 0;

  const saveMenu = () => {
    if (!attemptAccess('saveMenus') || !menu) return;

    const maxSaved = subscription.plan === 'premium' ? 10 : Infinity;
    if (savedMenus.length >= maxSaved) {
        showToast('You have reached your limit for saved menus. Upgrade to Pro for unlimited saves.');
        setShowUpgradeModal(true);
        return;
    }

    const newMenu: SavedMenu = {
      id: Date.now(),
      title: menu.menuTitle,
      content: menu,
      savedAt: new Date().toLocaleDateString(),
    };
    const updatedMenus = [newMenu, ...savedMenus];
    setSavedMenus(updatedMenus);
    localStorage.setItem('savedMenus', JSON.stringify(updatedMenus));
    showToast('Menu proposal saved successfully!');
  };

  const deleteMenu = (id: number) => {
    const updatedMenus = savedMenus.filter(c => c.id !== id);
    setSavedMenus(updatedMenus);
    localStorage.setItem('savedMenus', JSON.stringify(updatedMenus));
    showToast('Menu deleted.');
  };
  
  const downloadPdf = () => {
    const input = menuRef.current;
    if (input) {
        showToast("Preparing your PDF...");
        
        html2canvas(input, {
            scale: 2,
            useCORS: true,
            onclone: (doc) => {
                const themeKey = menu?.theme || 'classic';
                if (themeKey === 'modern-dark') {
                  const container = doc.querySelector('.theme-container') as HTMLElement;
                   if (container) {
                       container.style.backgroundColor = 'white';
                       container.style.color = 'black';
                       doc.querySelectorAll('.print\\:text-black').forEach(el => (el as HTMLElement).style.color = 'black');
                       doc.querySelectorAll('.print\\:bg-white').forEach(el => (el as HTMLElement).style.backgroundColor = 'white');
                   }
                }
                doc.querySelectorAll('.no-print, .no-copy, .edit-btn').forEach(el => {
                    if(el && (el as HTMLElement).style) {
                        (el as HTMLElement).style.display = 'none';
                    }
                });
            }
        }).then(canvas => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            if (!canAccessFeature('noWatermark')) {
              pdf.setFontSize(10);
              pdf.setTextColor(150);
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              pdf.text('Generated with CaterPro AI', pageWidth / 2, pageHeight - 10, { align: 'center' });
            }

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const widthInPdf = pdfWidth - 20;
            const heightInPdf = widthInPdf / ratio;
            
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 10, 10, widthInPdf, heightInPdf);

            pdf.save(`${menu?.menuTitle.replace(/\s/g, '_') || 'caterpro-ai-menu'}.pdf`);
            
        }).catch(err => {
            console.error("Error generating PDF:", err);
            showToast("Failed to generate PDF.");
        });
    }
  };

  const copyToClipboard = () => {
    if (menuRef.current) {
        const tempDiv = menuRef.current.cloneNode(true) as HTMLElement;
        tempDiv.querySelectorAll('.no-copy').forEach(el => el.remove());
        const textToCopy = tempDiv.innerText || tempDiv.textContent || '';
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => showToast('Menu copied to clipboard!'))
            .catch(err => console.error('Failed to copy: ', err));
    }
  };

  const handleOpenShareModal = () => {
    if (!attemptAccess('shareableLinks') || !menu) return;
    try {
      const jsonString = JSON.stringify(menu);
      const utf8Bytes = new TextEncoder().encode(jsonString);
      let binary = '';
      utf8Bytes.forEach(byte => { binary += String.fromCharCode(byte); });
      const base64String = btoa(binary);

      const encodedString = encodeURIComponent(base64String);
      const url = `${window.location.origin}${window.location.pathname}#share=${encodedString}`;
      setShareUrl(url);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error("Failed to create share link:", error);
      showToast("Could not create share link.");
    }
  };


  const handleHistoryItemClick = (item: GenerationHistoryItem) => {
    const isPredefined = EVENT_TYPES.includes(item.eventType);
    if (isPredefined) {
        setEventType(item.eventType);
        setCustomEventType('');
    } else {
        setEventType('Other...');
        setCustomEventType(item.eventType);
    }
    setGuestCount(item.guestCount);
    setCuisine(item.cuisine);
    setServiceStyle(item.serviceStyle);
    setDietaryRestrictions(item.dietaryRestrictions);
    setMenu(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setGenerationHistory([]);
    localStorage.removeItem('generationHistory');
    showToast('Generation history cleared.');
  };
  
  const handleEmailCapture = (email: string, whatsapp: string) => {
    localStorage.setItem('caterpro_user_email', email);
    if (whatsapp) {
      localStorage.setItem('caterpro_user_whatsapp', whatsapp);
    }
    setIsEmailCaptureModalOpen(false);
    showToast('Thank you! Your information has been saved.');
  };

  const handleGetQuote = (product: PpeProduct) => {
    setSelectedProduct(product);
    setIsQuoteModalOpen(true);
  };
  
  if (!isAppVisible) {
    return <PricingPage onSelectPlan={handleSelectPlan} />;
  }

  const handleDismissPwaBanner = () => {
      setShowPwaBanner(false);
      localStorage.setItem('pwaBannerDismissed', 'true');
  }

  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased ${isDarkMode ? 'dark' : ''}`}>
      <Navbar onThemeToggle={toggleTheme} isDarkMode={isDarkMode} onOpenSaved={() => attemptAccess('saveMenus') && setIsSavedModalOpen(true)} savedCount={savedMenus.length} onOpenQrCode={() => setIsQrModalOpen(true)} />
      
       {showPwaBanner && (
         <div className="no-print fixed bottom-2 left-2 z-50 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-4 animate-toast-in max-w-sm">
           <Smartphone className="w-6 h-6 text-primary-500 flex-shrink-0" />
           <p className="text-sm text-slate-700 dark:text-slate-300">
             For quick access, add this app to your home screen!
           </p>
           <button onClick={handleDismissPwaBanner} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex-shrink-0">
             <X size={16} className="text-slate-500" />
           </button>
         </div>
       )}

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header className="text-center animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-200">
             CaterPro AI
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Generate menus, shopping lists, and proposals for your food business.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span>{subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan</span>
            {!canAccessFeature('unlimitedGenerations') && (
              <span>&bull; {generationsLeft} generations left today</span>
            )}
          </div>
        </header>

        <section aria-labelledby="menu-generator-title" className="mt-12 bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/80 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <h2 id="menu-generator-title" className="text-2xl font-bold text-slate-900 dark:text-white">Get started with CaterPro AI</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Fill out your event details to generate a complete proposal.</p>
            
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="event-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Event Type <span className="text-red-500">*</span></label>
                  <select id="event-type" value={eventType} onChange={(e) => { setEventType(e.target.value); if (e.target.value !== 'Other...') setCustomEventType(''); }} aria-required="true" className={formInputStyle}>
                    <option value="" disabled>Select an event...</option>
                    {EVENT_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                  {eventType === 'Other...' && (
                    <div className="mt-2 animate-slide-in" style={{ animationDuration: '0.3s' }}>
                      <label htmlFor="custom-event-type" className="sr-only">Custom Event Type</label>
                      <input type="text" id="custom-event-type" value={customEventType} onChange={(e) => setCustomEventType(e.target.value)} placeholder="e.g., Baby Shower..." className={formInputStyle} required />
                    </div>
                  )}
                  {validationErrors.eventType && <p className="text-red-500 text-sm mt-1">{validationErrors.eventType}</p>}
                </div>
                <div>
                  <label htmlFor="guest-count" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Number of Guests <span className="text-red-500">*</span></label>
                  <select id="guest-count" value={guestCount} onChange={e => setGuestCount(e.target.value)} aria-required="true" className={formInputStyle}>
                    <option value="" disabled>Select guest range...</option>
                    {GUEST_COUNT_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {validationErrors.guestCount && <p className="text-red-500 text-sm mt-1">{validationErrors.guestCount}</p>}
                </div>
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Budget Level</label>
                  <select id="budget" value={budget} onChange={e => setBudget(e.target.value)} className={formInputStyle}>
                    {BUDGET_LEVELS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="service-style" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Service Style</label>
                  <select id="service-style" value={serviceStyle} onChange={e => setServiceStyle(e.target.value)} className={formInputStyle}>
                    {SERVICE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="cuisine" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cuisine Style <span className="text-red-500">*</span></label>
                  <select id="cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} aria-required="true" className={formInputStyle}>
                    <option value="" disabled>Select a cuisine...</option>
                    {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {validationErrors.cuisine && <p className="text-red-500 text-sm mt-1">{validationErrors.cuisine}</p>}
                </div>
                <div className="md:col-span-2">
                  <MultiSelectDropdown
                    label="Dietary Needs"
                    options={DIETARY_RESTRICTIONS}
                    selectedItems={dietaryRestrictions}
                    onChange={setDietaryRestrictions}
                    placeholder="e.g., Vegan, Gluten-Free..."
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 pt-6 border-t border-slate-200 dark:border-slate-700">
                <fieldset>
                  <legend className="block text-sm font-medium text-slate-700 dark:text-slate-300">Proposal Theme</legend>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(PROPOSAL_THEMES).map(([key, theme]) => (
                      <div key={key}>
                        <input
                          type="radio"
                          id={`theme-${key}`}
                          name="proposal-theme"
                          value={key}
                          checked={proposalTheme === key}
                          onChange={(e) => {
                            if (key !== 'classic' && !attemptAccess('allThemes')) return;
                            setProposalTheme(e.target.value)
                          }}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`theme-${key}`}
                          className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            proposalTheme === key ? 'border-primary-500 ring-2 ring-primary-500' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                          } ${key !== 'classic' && !canAccessFeature('allThemes') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {key !== 'classic' && !canAccessFeature('allThemes') && <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 rounded-lg"></div>}
                          <div className="flex space-x-1 mb-2">
                            {theme.preview.map((color, i) => (
                              <div key={i} className={`w-4 h-4 rounded-full ${color}`}></div>
                            ))}
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{theme.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
            
            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 flex flex-col items-center">
              <button
                onClick={generateMenu}
                disabled={isLoading}
                className="w-full max-w-xs inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-slate-900"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>{loadingMessage}</span>
                  </>
                ) : (
                  'Generate Menu Proposal'
                )}
              </button>
            </div>
          </section>

        <section aria-labelledby="next-steps-title" className="mt-12 animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <h2 id="next-steps-title" className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Or, start with an example
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exampleScenarios.map(scenario => (
              <button 
                key={scenario.title} 
                onClick={() => handleExampleClick(scenario)} 
                className="w-full text-left p-4 bg-white dark:bg-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <scenario.IconComponent className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{scenario.title}</span>
              </button>
            ))}
          </div>
        </section>
        
        <GenerationHistory 
          history={generationHistory}
          onItemClick={handleHistoryItemClick}
          onClear={handleClearHistory}
        />

        {error && (
          <div role="alert" className="mt-8 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400 flex-shrink-0 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">{error.title}</h3>
                <div className="text-sm text-red-700 dark:text-red-300 mt-1">{error.message}</div>
              </div>
            </div>
          </div>
        )}

        {menu && (
          <section aria-labelledby="generated-menu-title" className="mt-12 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
              <div className="no-print p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 rounded-t-lg sticky top-16 z-30 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h2 id="generated-menu-title" className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Presentation className="w-7 h-7 mr-3 text-primary-500 flex-shrink-0" />
                    Your Menu Proposal
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={saveMenu} className="action-button"><Save size={16} className="mr-1.5" />Save</button>
                    <button onClick={downloadPdf} className="action-button"><FileDown size={16} className="mr-1.5" />PDF</button>
                    <button onClick={() => window.print()} className="action-button"><Printer size={16} className="mr-1.5" />Print</button>
                    <button onClick={copyToClipboard} className="action-button"><Copy size={16} className="mr-1.5" />Copy Text</button>
                    <button onClick={handleOpenShareModal} className="action-button"><Link size={16} className="mr-1.5" />Share</button>
                  </div>
                </div>
                <div className="mt-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-primary-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                    <p className="text-right text-sm font-medium text-slate-600 dark:text-slate-400 mt-1.5">
                        {Math.round(completionPercentage)}% Complete ({checkedItems.size} / {totalChecklistItems} items)
                    </p>
                </div>
              </div>
              
              <div ref={menuRef} className="print-area">
                <MarkdownRenderer 
                  menu={menu}
                  checkedItems={checkedItems}
                  onToggleItem={handleToggleChecklistItem}
                  isEditable={canAccessFeature('itemEditing')}
                  onEditItem={handleOpenCustomizationModal}
                  showToast={showToast}
                  isGeneratingImage={isGeneratingImage}
                  onUpdateShoppingItemQuantity={handleUpdateShoppingItemQuantity}
                  bulkSelectedItems={bulkSelectedItems}
                  onToggleBulkSelect={handleToggleBulkSelect}
                  onBulkCheck={handleBulkCheck}
                  onBulkUpdateQuantity={handleBulkUpdateQuantity}
                  onClearBulkSelection={handleClearBulkSelection}
                  onSelectAllShoppingListItems={handleSelectAllShoppingListItems}
                  proposalTheme={proposalTheme}
                  canAccessFeature={canAccessFeature}
                  onAttemptAccess={(feature) => attemptAccess(feature)}
                  deliveryRadius={deliveryRadius}
                  onDeliveryRadiusChange={setDeliveryRadius}
                  onCalculateFee={handleCalculateFee}
                  calculatedFee={calculatedFee}
                />
              </div>

               {canAccessFeature('customItemGeneration') && (
                  <div className="no-print p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 rounded-b-lg">
                      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><PlusCircle className="w-5 h-5 text-primary-500" /> Add a Custom Menu Item</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Describe a dish, and our AI chef will add it to your menu.</p>
                      <div className="flex flex-col md:flex-row gap-2 items-stretch">
                          <input
                              type="text"
                              value={customItemDescription}
                              onChange={(e) => setCustomItemDescription(e.target.value)}
                              placeholder="e.g., Spicy mango and avocado salad..."
                              className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm sm:text-sm"
                          />
                          <select value={customItemCategory} onChange={(e) => setCustomItemCategory(e.target.value as MenuSection)} className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm sm:text-sm">
                              {EDITABLE_MENU_SECTIONS.map(s => <option key={s.key} value={s.key}>{s.title}</option>)}
                          </select>
                          <button onClick={handleGenerateCustomItem} disabled={isGeneratingCustomItem || !customItemDescription.trim()} className="action-button flex-shrink-0">
                              {isGeneratingCustomItem ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
                              Generate & Add
                          </button>
                      </div>
                      {customItemError && (
                          <div role="alert" className="mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                              <p className="text-sm font-semibold text-red-800 dark:text-red-200">{customItemError.title}</p>
                          </div>
                      )}
                  </div>
               )}
            </div>
          </section>
        )}

        <FindChef 
          onFindChefs={handleFindSuppliers} 
          chefs={suppliers} 
          isLoading={isFindingSuppliers} 
          error={findSuppliersError} 
          isPro={canAccessFeature('findSuppliers')}
        />
        
        <section aria-labelledby="recommended-products-title" className="mt-16 animate-slide-in" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
             <h2 id="recommended-products-title" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center">
                <ChefHat className="w-8 h-8 mr-3 text-primary-500" />
                Recommended Catering Supplies
             </h2>
             <p className="mt-2 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
               Browse essential equipment and supplies. Get a quote for your bulk order needs.
             </p>
          </div>
          
          <ProductSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {RECOMMENDED_PRODUCTS
              .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(product => (
              <ProductCard key={product.id} product={product} onGetQuote={handleGetQuote} />
            ))}
          </div>
        </section>


      </main>

      <Footer />
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
      <SavedChecklistsModal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} savedMenus={savedMenus} onDelete={deleteMenu} />
      <QrCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} shareUrl={shareUrl} />
      <AiChatBot onAttemptAccess={() => attemptAccess('aiChatBot')} isPro={canAccessFeature('aiChatBot')} />
      <CustomizationModal isOpen={isCustomizationModalOpen} onClose={() => setIsCustomizationModalOpen(false)} itemToEdit={itemToEdit} onSave={handleSaveCustomization} />
      <EmailCapture isOpen={isEmailCaptureModalOpen} onClose={() => setIsEmailCaptureModalOpen(false)} onSave={handleEmailCapture} />
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} product={selectedProduct} />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} onUpgrade={handleUpgrade} />

    </div>
  );
};

export default App;
