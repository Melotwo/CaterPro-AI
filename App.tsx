import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, AlertTriangle, Presentation, Printer, FileDown, Copy, Sparkles, PlusCircle, Link, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import MarkdownRenderer from './components/MarkdownRenderer.tsx';
import SavedMenusModal from './components/SavedChecklistsModal.tsx';
import Toast from './components/Toast.tsx';
import AiChatBot from './components/AiChatBot.tsx';
import QrCodeModal from './components/QrCodeModal.tsx';
import ShareModal from './components/ShareModal.tsx';
import MultiSelectDropdown from './components/MultiSelectDropdown.tsx';
import GenerationHistory from './components/GenerationHistory.tsx';
import CustomizationModal from './components/CustomizationModal.tsx';
import EmailCapture from './components/EmailCapture.tsx';
import { exampleScenarios, CUISINES, DIETARY_RESTRICTIONS, EVENT_TYPES, GUEST_COUNT_OPTIONS, BUDGET_LEVELS, SERVICE_STYLES, EDITABLE_MENU_SECTIONS } from './constants.ts';
import { SavedMenu, ErrorState, ValidationErrors, GenerationHistoryItem, Menu, MenuSection } from './types.ts';
import { getApiErrorState } from './services/errorHandler.ts';
import { generateMenuFromApi, generateCustomMenuItemFromApi, generateMenuImageFromApi } from './services/geminiService.ts';


const LOADING_MESSAGES = [
  'Consulting with the master chefs...',
  'Designing your event experience...',
  'Finalizing the menu details...',
  'Preparing your proposal...',
];

const CHECKED_ITEMS_STORAGE_KEY = 'caterpro-checked-items';

// ========= MAIN APP COMPONENT =========
const App: React.FC = () => {
  const [eventType, setEventType] = useState('');
  const [customEventType, setCustomEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [budget, setBudget] = useState('$$');
  const [serviceStyle, setServiceStyle] = useState('Standard Catering');
  const [cuisine, setCuisine] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  
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

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);
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
        
        setMenu(loadedMenu);
        const totalItems = [
          ...(loadedMenu.appetizers || []),
          ...(loadedMenu.mainCourses || []),
          ...(loadedMenu.sideDishes || []),
          ...(loadedMenu.dessert || []),
          ...(loadedMenu.serviceNotes || []),
          ...(loadedMenu.deliveryLogistics || []),
          ...(loadedMenu.shoppingList || []),
        ].length;
        setTotalChecklistItems(totalItems);
        
        // A new menu was loaded, so clear any previous checklist progress
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
        // No shared menu, so try to load any saved checklist progress
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

  // Save checklist progress to local storage
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
          // Error or permission denied
          resolve(null);
        }
      );
    });
  };

  const generateMenu = async () => {
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

      setTotalChecklistItems(result.totalChecklistItems);
      setMenu(result.menu);

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

      // Prompt for email if not already captured
      const storedEmail = localStorage.getItem('caterpro_user_email');
      if (!storedEmail) {
          setIsEmailCaptureModalOpen(true);
      }

      // Non-blocking call to generate the image
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
    if (!customItemDescription.trim()) return;

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
    if (!menu) return;
    const items = menu[section];
    // Ensure items is an array of strings before accessing
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

  // Bulk edit handlers
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
      Array.from(bulkSelectedItems).map(key => parseInt(key.split('-')[1], 10))
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


  const completionPercentage = totalChecklistItems > 0 ? (checkedItems.size / totalChecklistItems) * 100 : 0;

  const saveMenu = () => {
    if (!menu) return;
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
        const wasDark = document.documentElement.classList.contains('dark');
        
        // Temporarily switch to light mode for PDF generation if needed
        if (wasDark) {
            document.documentElement.classList.remove('dark');
        }

        // Use a higher scale for better resolution
        html2canvas(input, {
            scale: 3, // Increased scale for higher fidelity
            backgroundColor: '#ffffff',
            useCORS: true,
            onclone: (doc) => {
                // Ensure the background is white in the cloned document
                const printArea = doc.querySelector('.print-area');
                if(printArea) {
                    (printArea as HTMLElement).style.backgroundColor = '#ffffff';
                }
                // Remove elements that shouldn't be in the PDF
                doc.querySelectorAll('.no-print, .no-copy, .edit-btn').forEach(el => {
                    if(el && (el as HTMLElement).style) {
                        (el as HTMLElement).style.display = 'none';
                    }
                });
            }
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png', 0.95); // Use high-quality PNG
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            const ratio = canvasWidth / canvasHeight;
            const widthInPdf = pdfWidth - 20; // pdfWidth with 10mm margins
            const heightInPdf = widthInPdf / ratio;

            // Check if content exceeds page height
            if (heightInPdf > pdfHeight - 20) {
              // This is a simplified handling. For multi-page, a more complex logic is needed.
              console.warn("PDF content might be too long for a single page.");
            }

            const x = 10; // 10mm margin from left
            const y = 10; // 10mm margin from top

            pdf.addImage(imgData, 'PNG', x, y, widthInPdf, heightInPdf);
            pdf.save(`${menu?.menuTitle.replace(/\s/g, '_') || 'caterpro-ai-menu'}.pdf`);
            
            // Restore dark mode if it was originally enabled
            if (wasDark) {
                document.documentElement.classList.add('dark');
            }

        }).catch(err => {
            console.error("Error generating PDF:", err);
            showToast("Failed to generate PDF.");
             if (wasDark) {
                document.documentElement.classList.add('dark');
            }
        });
    }
  };

  const copyToClipboard = () => {
    if (menuRef.current) {
        // Create a temporary element to exclude non-copyable elements
        const tempDiv = menuRef.current.cloneNode(true) as HTMLElement;
        tempDiv.querySelectorAll('.no-copy').forEach(el => el.remove());
        const textToCopy = tempDiv.innerText || tempDiv.textContent || '';
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => showToast('Menu copied to clipboard!'))
            .catch(err => console.error('Failed to copy: ', err));
    }
  };

  const handleOpenShareModal = () => {
    if (!menu) return;
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

  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased ${isDarkMode ? 'dark' : ''}`}>
      <Navbar onThemeToggle={toggleTheme} isDarkMode={isDarkMode} onOpenSaved={() => setIsSavedModalOpen(true)} savedCount={savedMenus.length} onOpenQrCode={() => setIsQrModalOpen(true)} />
      
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header className="text-center animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            CaterPro AI
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            Your expert assistant for crafting unforgettable event menus. Instantly generate professional catering proposals.
          </p>
        </header>

        <section aria-labelledby="menu-generator" className="mt-12 bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <h2 id="menu-generator" className="sr-only">Menu Generator Form</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="event-type" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Event Type <span className="text-red-500">*</span></label>
              <select
                id="event-type"
                value={eventType}
                onChange={(e) => {
                  setEventType(e.target.value);
                  if (e.target.value !== 'Other...') {
                    setCustomEventType('');
                  }
                }}
                aria-required="true"
                className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="" disabled>Select an event...</option>
                {EVENT_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
              {eventType === 'Other...' && (
                <div className="mt-2 animate-slide-in" style={{ animationDuration: '0.3s' }}>
                  <label htmlFor="custom-event-type" className="sr-only">Custom Event Type</label>
                  <input
                    type="text"
                    id="custom-event-type"
                    value={customEventType}
                    onChange={(e) => setCustomEventType(e.target.value)}
                    placeholder="e.g., Baby Shower, Product Launch..."
                    className="block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              )}
              {validationErrors.eventType && <p className="text-red-500 text-sm mt-1">{validationErrors.eventType}</p>}
            </div>
            <div>
              <label htmlFor="guest-count" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Number of Guests <span className="text-red-500">*</span></label>
              <select id="guest-count" value={guestCount} onChange={e => setGuestCount(e.target.value)} aria-required="true" className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                <option value="" disabled>Select guest range...</option>
                {GUEST_COUNT_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {validationErrors.guestCount && <p className="text-red-500 text-sm mt-1">{validationErrors.guestCount}</p>}
            </div>
             <div>
              <label htmlFor="budget" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Budget Level</label>
              <select id="budget" value={budget} onChange={e => setBudget(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                {BUDGET_LEVELS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="service-style" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Service Style</label>
              <select id="service-style" value={serviceStyle} onChange={e => setServiceStyle(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                {SERVICE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="cuisine" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Cuisine Style <span className="text-red-500">*</span></label>
              <select id="cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} aria-required="true" className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                <option value="" disabled>Select a cuisine...</option>
                {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {validationErrors.cuisine && <p className="text-red-500 text-sm mt-1">{validationErrors.cuisine}</p>}
            </div>
            <div>
              <MultiSelectDropdown
                  label="Dietary Needs"
                  options={DIETARY_RESTRICTIONS}
                  selectedItems={dietaryRestrictions}
                  onChange={setDietaryRestrictions}
                  placeholder="e.g., Vegan, Gluten-Free..."
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Need inspiration? Try one of these scenarios:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {exampleScenarios.map(scenario => (
                <button key={scenario.title} onClick={() => handleExampleClick(scenario)} className="group text-left p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-slate-200 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 transition-all">
                  <div className="flex items-start gap-4">
                    <scenario.IconComponent className="w-8 h-8 text-primary-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300">{scenario.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{scenario.eventType}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 flex justify-center">
            <button
              onClick={generateMenu}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
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
        
        <GenerationHistory
          history={generationHistory}
          onItemClick={handleHistoryItemClick}
          onClear={handleClearHistory}
        />

        {error && (
          <div role="alert" className="mt-8 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 animate-slide-in">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400 flex-shrink-0 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">{error.title}</h3>
                <div className="text-sm text-red-700 dark:text-red-300 mt-1">{error.message}</div>
              </div>
            </div>
          </div>
        )}

        {menu && !isLoading && (
          <>
            <section id="menu-results" aria-live="polite" className="mt-12 animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                          <Presentation className="w-7 h-7 mr-3 text-green-500" />
                          Your Menu Proposal
                      </h2>
                      <div className="flex items-center space-x-2">
                          <button onClick={generateMenu} disabled={isLoading} className="no-print p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Regenerate all sections">
                              <RefreshCw size={18} />
                          </button>
                          <button onClick={handleOpenShareModal} disabled={isLoading} className="no-print p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Share menu">
                              <Link size={18} />
                          </button>
                          <button onClick={saveMenu} disabled={isLoading} className="no-print p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Save menu">
                              <Save size={18} />
                          </button>
                          <button onClick={copyToClipboard} disabled={isLoading} className="no-print p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Copy menu text">
                              <Copy size={18} />
                          </button>
                          <button onClick={downloadPdf} disabled={isLoading} className="no-print p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Download as PDF">
                              <FileDown size={18} />
                          </button>
                          <button onClick={() => window.print()} disabled={isLoading} className="no-print p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Print menu">
                              <Printer size={18} />
                          </button>
                      </div>
                  </div>

                  <div className="p-2 sm:p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${completionPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
                      </div>
                      <p className="text-xs text-right mt-1 text-slate-500 dark:text-slate-400">Proposal Checklist: {Math.round(completionPercentage)}% Complete ({checkedItems.size}/{totalChecklistItems})</p>
                  </div>

                  <div ref={menuRef} className="print-area p-4 sm:p-6 bg-white dark:bg-slate-900">
                      <MarkdownRenderer 
                        menu={menu} 
                        checkedItems={checkedItems} 
                        onToggleItem={handleToggleChecklistItem} 
                        isEditable={true}
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
                      />
                  </div>
              </div>
            </section>

            <section id="custom-item-generator" aria-labelledby="custom-item-title" className="mt-12 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
                  <h2 id="custom-item-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                      <Sparkles className="w-7 h-7 mr-3 text-primary-500" />
                      Add a Custom Item
                  </h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                      Describe a dish you have in mind, and our AI will write it up for your menu.
                  </p>
                  <div className="mt-6 space-y-4">
                      <div>
                          <label htmlFor="custom-item-desc" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Dish Description</label>
                          <textarea
                              id="custom-item-desc"
                              rows={3}
                              value={customItemDescription}
                              onChange={e => setCustomItemDescription(e.target.value)}
                              placeholder="e.g., A light, summery appetizer with strawberries, goat cheese, and a balsamic glaze."
                              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                      </div>
                      <div>
                          <label htmlFor="custom-item-cat" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Menu Category</label>
                          <select 
                              id="custom-item-cat"
                              value={customItemCategory}
                              onChange={e => setCustomItemCategory(e.target.value as MenuSection)}
                              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          >
                              {EDITABLE_MENU_SECTIONS.map(section => (
                                  <option key={section.key} value={section.key}>{section.title}</option>
                              ))}
                          </select>
                      </div>
                      <div className="text-right">
                          <button
                              onClick={handleGenerateCustomItem}
                              disabled={isGeneratingCustomItem || !customItemDescription.trim()}
                              className="inline-flex items-center justify-center px-6 py-2.5 text-base font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                              {isGeneratingCustomItem ? (
                                  <>
                                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                      <span>Adding...</span>
                                  </>
                              ) : (
                                <>
                                  <PlusCircle className="mr-2 h-5 w-5" />
                                  <span>Generate & Add Item</span>
                                </>
                              )}
                          </button>
                      </div>
                      {customItemError && (
                          <div role="alert" className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                            <div className="flex items-start">
                              <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mr-3" />
                              <div>
                                <h3 className="text-md font-semibold text-red-800 dark:text-red-200">{customItemError.title}</h3>
                                <div className="text-sm text-red-700 dark:text-red-300 mt-1">{customItemError.message}</div>
                              </div>
                            </div>
                          </div>
                      )}
                  </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      <SavedMenusModal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} savedMenus={savedMenus} onDelete={deleteMenu} />
      <QrCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
      <CustomizationModal 
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        itemToEdit={itemToEdit}
        onSave={handleSaveCustomization}
      />
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        shareUrl={shareUrl}
      />
      <EmailCapture
        isOpen={isEmailCaptureModalOpen}
        onClose={() => setIsEmailCaptureModalOpen(false)}
        onSave={handleEmailCapture}
      />
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
      <AiChatBot />
    </div>
  );
};

export default App;
