import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, AlertTriangle, Presentation, Printer, FileDown, Copy } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import MarkdownRenderer from './components/MarkdownRenderer.tsx';
import SavedMenusModal from './components/SavedChecklistsModal.tsx';
import Toast from './components/Toast.tsx';
import AiChatBot from './components/AiChatBot.tsx';
import QrCodeModal from './components/QrCodeModal.tsx';
import MultiSelectDropdown from './components/MultiSelectDropdown.tsx';
import GenerationHistory from './components/GenerationHistory.tsx';
import { exampleScenarios, CUISINES, DIETARY_RESTRICTIONS, EVENT_TYPES, GUEST_COUNT_OPTIONS, BUDGET_LEVELS } from './constants.ts';
import { SavedMenu, ErrorState, ValidationErrors, GenerationHistoryItem } from './types.ts';
import { getApiErrorState } from './services/errorHandler.ts';
import { generateMenuFromApi } from './services/geminiService.ts';


const LOADING_MESSAGES = [
  'Consulting with the master chefs...',
  'Designing your event experience...',
  'Finalizing the menu details...',
  'Preparing your proposal...',
];

// ========= MAIN APP COMPONENT =========
const App: React.FC = () => {
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [budget, setBudget] = useState('$$');
  const [cuisine, setCuisine] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
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
  }, []);

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
    setCuisine(scenario.cuisine);
    setDietaryRestrictions(scenario.dietaryRestrictions);
    setValidationErrors({});
  };

  const showToast = (message: string) => {
    setToastMessage(message);
  }

  const generateMenu = async () => {
    const newValidationErrors: ValidationErrors = {};
    if (!eventType) newValidationErrors.eventType = "Please select an event type.";
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
    setTotalChecklistItems(0);

    try {
      const result = await generateMenuFromApi({
        eventType,
        guestCount,
        budget,
        cuisine,
        dietaryRestrictions,
      });

      setTotalChecklistItems(result.totalChecklistItems);
      setMenu(result.menuMarkdown);

      const newHistoryItem: GenerationHistoryItem = {
        id: Date.now(),
        eventType,
        guestCount,
        cuisine,
        dietaryRestrictions,
        timestamp: new Date().toLocaleString(),
      };
      setGenerationHistory(prev => {
        const updatedHistory = [newHistoryItem, ...prev].slice(0, 10);
        localStorage.setItem('generationHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });

    } catch (e) {
      setError(getApiErrorState(e));
    } finally {
      setIsLoading(false);
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

  const completionPercentage = totalChecklistItems > 0 ? (checkedItems.size / totalChecklistItems) * 100 : 0;

  const saveMenu = () => {
    if (!menu) return;
    const title = menu.split('\n')[0].replace('## ', '').substring(0, 50);
    const newMenu: SavedMenu = {
      id: Date.now(),
      title: title,
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
      const wasDark = document.documentElement.classList.contains('dark');
      if (wasDark) document.documentElement.classList.remove('dark');
  
      html2canvas(input, {
        scale: 2,
        backgroundColor: wasDark ? '#0f172a' : '#ffffff',
        useCORS: true,
        onclone: (doc) => {
          doc.querySelectorAll('input[type=checkbox]').forEach(el => (el as HTMLElement).style.display = 'none');
          doc.querySelector('.print-area')?.classList.add('dark:bg-slate-900');
        }
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('caterpro-ai-menu.pdf');
  
        if(wasDark) document.documentElement.classList.add('dark');
      });
    }
  };

  const copyToClipboard = () => {
    if (menu) {
      navigator.clipboard.writeText(menu)
        .then(() => showToast('Menu copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  const handleHistoryItemClick = (item: GenerationHistoryItem) => {
    setEventType(item.eventType);
    setGuestCount(item.guestCount);
    setCuisine(item.cuisine);
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
              <select id="event-type" value={eventType} onChange={e => setEventType(e.target.value)} aria-required="true" className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-amber-500 focus:border-amber-500">
                <option value="" disabled>Select an event...</option>
                {EVENT_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              {validationErrors.eventType && <p className="text-red-500 text-sm mt-1">{validationErrors.eventType}</p>}
            </div>
            <div>
              <label htmlFor="guest-count" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Number of Guests <span className="text-red-500">*</span></label>
              <select id="guest-count" value={guestCount} onChange={e => setGuestCount(e.target.value)} aria-required="true" className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-amber-500 focus:border-amber-500">
                <option value="" disabled>Select guest range...</option>
                {GUEST_COUNT_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {validationErrors.guestCount && <p className="text-red-500 text-sm mt-1">{validationErrors.guestCount}</p>}
            </div>
             <div className="md:col-span-2">
              <label htmlFor="budget" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Budget Level</label>
              <select id="budget" value={budget} onChange={e => setBudget(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-amber-500 focus:border-amber-500">
                {BUDGET_LEVELS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="cuisine" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Cuisine Style <span className="text-red-500">*</span></label>
              <select id="cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} aria-required="true" className="mt-1 block w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-amber-500 focus:border-amber-500">
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
                <button key={scenario.title} onClick={() => handleExampleClick(scenario)} className="group text-left p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-800 transition-all">
                  <div className="flex items-start gap-4">
                    <scenario.IconComponent className="w-8 h-8 text-amber-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-300">{scenario.title}</h3>
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
              className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-slate-900 bg-amber-500 border border-transparent rounded-lg shadow-sm hover:bg-amber-600 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
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
          <section id="menu-results" aria-live="polite" className="mt-12 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                        <Presentation className="w-7 h-7 mr-3 text-green-500" />
                        Your Menu Proposal
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button onClick={saveMenu} className="no-print p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Save menu">
                            <Save size={18} />
                        </button>
                        <button onClick={copyToClipboard} className="no-print p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Copy menu text">
                            <Copy size={18} />
                        </button>
                        <button onClick={downloadPdf} className="no-print p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Download as PDF">
                            <FileDown size={18} />
                        </button>
                        <button onClick={() => window.print()} className="no-print p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Print menu">
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
                    <MarkdownRenderer text={menu} checkedItems={checkedItems} onToggleItem={handleToggleChecklistItem} />
                </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <SavedMenusModal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} savedMenus={savedMenus} onDelete={deleteMenu} />
      <QrCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
      <AiChatBot />
    </div>
  );
};

export default App;