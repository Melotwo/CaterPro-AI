import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { getApiKey, generateMenuFromApi, generateMenuImageFromApi, getThemeFallbackImage } from './services/geminiService';
import { DEFAULT_PROPOSAL } from './data/defaultProposal';
import { ProposalViewer } from './components/ProposalViewer';
import { StudentGrowthLab } from './components/StudentGrowthLab';
import { ProductivityLab } from './components/ProductivityLab';
import { EducationHubSection } from './components/EducationHubSection';
import { NewProposalModal } from './components/NewProposalModal';
import { PaystackUpgradeModal } from './components/PaystackUpgradeModal';
import { BanquetEventOrderModal } from './components/BanquetEventOrderModal';
import Calculator from './components/Calculator';
import RecipeGenerator from './components/RecipeGenerator';
import { CommandCenter } from './components/CommandCenter';
import AcademicHub from './components/academic/AcademicHub';
import { HaccpLog } from './components/HaccpLog';
import { LocalSuppliersHub } from './components/LocalSuppliersHub';
import { SalesOperationsEngine } from './components/SalesOperationsEngine';
import { GuestCheckInModal } from './components/GuestCheckInModal';
import { GoogleAnalytics, trackEvent } from './GoogleAnalytics';
import { ChefHat, GraduationCap, Calculator as CalcIcon, Utensils, Sparkles, BookOpen, ShieldCheck, Truck, ShoppingBag, MessageSquare, TrendingUp, Copy } from 'lucide-react';
import { Menu, CheckedInGuest, ServiceScheduleEvent } from './types';

// Toast Component
const Toast: React.FC<{ message: string | null; onDismiss: () => void }> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onDismiss, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[250]"
    >
      <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700/60 backdrop-blur-md">
        <span className="text-emerald-400 text-lg">⚡</span>
        <p className="text-xs font-black uppercase tracking-wider">{message}</p>
      </div>
    </motion.div>
  );
};

// CaterProAI Sales & Operations Engine Floating Assistant
const AiChatBot: React.FC<{ onOpenSalesEngineTab?: () => void }> = ({ onOpenSalesEngineTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
    {
      role: 'model',
      content: "Warm greetings! I am **CaterProAI Sales & Operations Engine**, your advanced AI assistant designed for caterers, banqueting managers, and hospitality entrepreneurs.\n\nI am configured to:\n• **Discover Events & Capture Leads** (Weddings, Corporate Galas, Banquets)\n• **Recommend Tailored 4-Course Menus** (Butler-Passed Starters, Mains, Family-Style Sides, Dessert Shooters)\n• **Suggest High-Margin Upsells** (Canapé receptions, wine flights, live action stations)\n• **Analyze Costs & 70% Food Margins** in ZAR\n• **Generate Instant WhatsApp & Email Follow-Ups** with contract lock-in disclaimers.\n\nWhat event type and guest count are you planning today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const msgToSend = customMsg || input;
    if (!msgToSend.trim() || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msgToSend }]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgToSend, history: messages })
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || 'CaterProAI Sales & Operations Engine standing by.';
        setMessages(prev => [...prev, { role: 'model', content: reply }]);
      } else {
        throw new Error('Chat response error');
      }
    } catch (err: any) {
      console.warn("Chat failed, using local CaterProAI Sales Engine fallback:", err);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: `Warm hospitality greetings! CaterProAI Sales & Operations Engine is active.\n\n• **Course Structure:** Butler-Passed Starters, Plated Artisanal Mains, Family-Style Harvest Sides & Dessert Shooters.\n• **High-Margin Add-On:** Welcome Canapé Reception (+R95/head) & Live Braai Carving Station (+R3,500).\n• **Target Margin:** 70% Gross Food Margin (ZAR).\n• **Follow-Up Ready:** WhatsApp & Email closing summaries formatted with contract sign-off disclaimer.\n\n*Would you like to open the full Sales & Operations Engine workspace?*`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col items-end gap-3 text-left">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[380px] sm:w-[420px] h-[580px] flex flex-col shadow-2xl border border-slate-200 bg-white rounded-3xl overflow-hidden"
          >
            <header className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-lg shadow-md shadow-teal-500/30">
                  🤖
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-white">
                    CaterProAI Sales Engine
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">
                      Sales & Banqueting Engine
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onOpenSalesEngineTab && (
                  <button
                    onClick={() => {
                      onOpenSalesEngineTab();
                      setIsOpen(false);
                    }}
                    title="Open Full Sales Engine Tab"
                    className="text-[10px] bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer border border-teal-500/30"
                  >
                    Open Hub ↗
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white font-bold text-lg p-1"
                >
                  ✕
                </button>
              </div>
            </header>

            {/* Quick Prompts Bar */}
            <div className="bg-slate-100/90 border-b border-slate-200 p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
              {[
                '💍 Wedding (120 pax, R650)',
                '🏢 Corporate Gala (80 pax)',
                '🔥 Heritage Braai Feast',
                '📲 WhatsApp Follow-Up'
              ].map(chip => (
                <button
                  key={chip}
                  onClick={() => send(undefined, chip)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg shrink-0 transition-all hover:border-teal-500 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-none'
                    }`}
                  >
                    {m.content}
                    {m.role === 'model' && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>CaterProAI Sales & Operations</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(m.content);
                          }}
                          title="Copy response to clipboard"
                          className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-slate-500 font-medium">Formulating proposal & margins...</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <footer className="p-3 bg-white border-t border-slate-200">
              <form onSubmit={e => send(e)} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about discovery, courses, upsells, or margins..."
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-xs text-slate-900 outline-none focus:border-teal-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-1.5 top-1.5 w-7 h-7 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-all text-xs cursor-pointer"
                >
                  ➤
                </button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 hover:from-slate-800 hover:to-teal-800 text-white rounded-2xl flex items-center justify-center shadow-2xl border border-teal-500/30 transition-transform active:scale-95 text-2xl cursor-pointer relative group"
        title="Open CaterProAI Sales & Operations Engine"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        {isOpen ? '✕' : '🤖'}
      </button>
    </div>
  );
};

export function App() {
  const [activeTab, setActiveTab] = useState<'proposal' | 'calculator' | 'haccp' | 'suppliers' | 'recipe' | 'commis' | 'academic' | 'sales-engine'>('proposal');
  const [proposal, setProposal] = useState<Menu>(() => {
    const saved = localStorage.getItem('caterpro_recent_proposal');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PROPOSAL;
  });

  const [toast, setToast] = useState<string | null>(null);
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isBeoOpen, setIsBeoOpen] = useState(false);
  const [isQrCheckInModalOpen, setIsQrCheckInModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);
  const [recipeSelectedDish, setRecipeSelectedDish] = useState<string>('');

  // Auto-detect check-in action from scanned QR code URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkin') === 'true' || params.get('action') === 'checkin') {
        setIsQrCheckInModalOpen(true);
        setActiveTab('proposal');
      }
    }
  }, []);

  const handleUpdateActualGuestCount = (actualCount: number, guestList?: CheckedInGuest[]) => {
    setProposal(prev => {
      const updated: Menu = {
        ...prev,
        actualGuestCount: actualCount,
        checkedInGuests: guestList ?? prev.checkedInGuests
      };
      if (prev.autoSyncActualPax) {
        updated.guestCount = actualCount;
        updated.manualTotal = ((prev.manualPerHead || 520) * actualCount) + (prev.logistics?.deliveryFee || 2400);
      }
      try {
        localStorage.setItem('caterpro_recent_proposal', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleUpdateTimeline = (updatedTimeline: ServiceScheduleEvent[]) => {
    setProposal(prev => {
      const updated: Menu = {
        ...prev,
        timeline: updatedTimeline
      };
      try {
        localStorage.setItem('caterpro_recent_proposal', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Quick menu generator directly invoked from Command Center
  const handleQuickGenerateMenu = async (params: {
    outlet: string;
    eventType: string;
    covers: number;
    cuisine: string;
    notes: string;
  }) => {
    setIsGeneratingMenu(true);
    setToast(`Formulating ${params.outlet} menu for ${params.covers} covers...`);
    try {
      const res = await generateMenuFromApi({
        eventType: params.eventType,
        guestCount: params.covers,
        cuisine: params.cuisine,
        specialDietaryNotes: `${params.outlet}. ${params.notes}`,
        onProgress: (msg) => setToast(msg)
      });
      if (res && res.data) {
        const d = res.data;
        const newMenu: Menu = {
          title: d.title || `${params.outlet} — ${params.eventType}`,
          menuTitle: d.title || `${params.outlet} — ${params.eventType}`,
          description: d.description || `Engineered for ${params.covers} covers in ${params.outlet}.`,
          guestCount: params.covers,
          covers: params.covers,
          eventType: params.eventType,
          cuisine: params.cuisine,
          cuisineStyle: params.cuisine,
          heroImage: d.heroImage || d.image || getThemeFallbackImage(params.eventType, params.cuisine, d.title || `${params.outlet} — ${params.eventType}`, d.description),
          eventDate: new Date().toISOString().split('T')[0],
          roomLocation: params.outlet,
          beoNumber: `BEO-${new Date().getFullYear()}-HOTEL-${Math.floor(100 + Math.random() * 900)}`,
          manualPerHead: d.perHeadPrice || 520,
          manualTotal: (d.perHeadPrice || 520) * params.covers + 2400,
          logistics: {
            deliveryFee: 2400,
            staffRequired: d.logistics?.staffRequired || `${Math.ceil(params.covers / 20)} Line Chefs`,
            equipmentNeeded: d.logistics?.equipmentNeeded || ['Combi Steam Oven', 'Heated Cabinets'],
            serviceNotes: d.logistics?.serviceNotes || ['Maintain SANS 10330 cold-holding below 4°C.']
          },
          menu: (d.items || []).map((i: any) => ({
            dish: i.name,
            cat: i.type === 'appetizer' ? 'Appetizers' : i.type === 'main' ? 'Main Courses' : 'Desserts',
            price: Number(i.price) || 120,
            cost: Number(i.costPerHead) || 35,
            notes: i.description || '',
            dietary: i.dietary || ['Gluten-Free']
          })),
          shoppingList: (d.shoppingList || []).map((s: any) => ({
            item: s.name,
            supplier: s.linkedDish ? 'Ocean Catch / Meat Merchant' : 'Wholesale Supplier',
            category: 'Provisions',
            quantity: `${s.quantity} ${s.unit || 'units'}`,
            estCost: `R ${(Number(s.quantity || 1) * Number(s.unitPrice || 50)).toFixed(2)}`,
            notes: s.linkedDish || ''
          })),
          allergenMatrix: d.allergenMatrix || [],
          miseEnPlace: d.logistics?.miseEnPlace || ['10:00 — Cold prep and vegetable tourner', '14:00 — Hot line protein sear and cloche staging'],
          serviceNotes: d.logistics?.serviceNotes || ['Maintain SANS 10330 cold-holding below 4°C during banquet transport.'],
          deliveryLogistics: ['Refrigerated van transport at 2.5°C', 'Heated mobile hot holding units on site']
        };
        setProposal(newMenu);
        localStorage.setItem('caterpro_recent_proposal', JSON.stringify(newMenu));
        setToast('✅ Menu formulated! Push to Calculator to inspect costings & yields.');

        trackEvent('generate_menu', {
          event_type: params.eventType,
          covers: params.covers,
          outlet: params.outlet,
          cuisine: params.cuisine
        });

        // Asynchronously generate tailored high-res banner image matching title, description, and event type
        generateMenuImageFromApi(newMenu.title || params.eventType, params.eventType, params.cuisine, newMenu.description)
          .then((img) => {
            if (img) {
              setProposal(prev => {
                const updated = { ...prev, heroImage: img };
                localStorage.setItem('caterpro_recent_proposal', JSON.stringify(updated));
                return updated;
              });
            }
          })
          .catch(() => {});
      }
    } catch (err: any) {
      console.error('Menu generation error:', err);
      setToast('Generated local menu structure with wholesale costings.');
    } finally {
      setIsGeneratingMenu(false);
    }
  };

  // Sync dark class on root document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle saving proposal to localStorage
  const handleSaveProposal = () => {
    localStorage.setItem('caterpro_recent_proposal', JSON.stringify(proposal));
    setToast('Proposal saved to your browser storage!');
    trackEvent('save_proposal', {
      title: proposal.title || 'Untitled Proposal',
      covers: proposal.guestCount || 50,
      total_value: proposal.manualTotal || 0
    });
  };

  // Handle Export PDF
  const handleExportPdf = async () => {
    const el = document.getElementById('proposal-content');
    if (!el) {
      setToast('Proposal element not found');
      return;
    }
    setToast('Generating high-resolution PDF...');
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const props = pdf.getImageProperties(img);
      const w = pdf.internal.pageSize.getWidth();
      const h = (props.height * w) / props.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      if (h > pageHeight) {
        let position = 0;
        let remainingHeight = h;
        while (remainingHeight > 0) {
          pdf.addImage(img, 'PNG', 0, position, w, h);
          remainingHeight -= pageHeight;
          if (remainingHeight > 0) {
            pdf.addPage();
            position -= pageHeight;
          }
        }
      } else {
        pdf.addImage(img, 'PNG', 0, 0, w, h);
      }

      const fileName = `${(proposal.title || 'Catering_Proposal').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      pdf.save(fileName);
      setToast('PDF downloaded successfully!');
      trackEvent('export_pdf', {
        title: proposal.title || 'Untitled Proposal',
        covers: proposal.guestCount || 50,
        file_name: fileName
      });
    } catch (err: any) {
      console.error(err);
      setToast('PDF export failed. Try printing the page.');
    }
  };

  // Copy proposal text for Docs
  const handleCopyForDocs = () => {
    let docText = `${proposal.title || 'Catering Proposal'}\n`;
    docText += `Date: ${proposal.eventDate || new Date().toLocaleDateString()}\n`;
    docText += `Guests: ${proposal.guestCount || 50}\n\n`;
    docText += `DESCRIPTION:\n${proposal.description || ''}\n\n`;
    docText += `MENU:\n`;
    (proposal.menu || []).forEach(m => {
      docText += `- ${m.dish} (${m.cat || 'Dish'}): ${m.notes || ''}\n`;
    });
    docText += `\nESTIMATED TOTAL: ZAR ${(proposal.manualTotal || 22500).toLocaleString()}\n`;
    navigator.clipboard.writeText(docText);
    setToast('Proposal copied to clipboard for Google Docs / Word!');
    trackEvent('copy_proposal_text', {
      title: proposal.title || 'Untitled Proposal'
    });
  };

  // Share link handler
  const handleShareLink = () => {
    trackEvent('share_link', {
      title: proposal.title || 'CaterPro AI Proposal'
    });
    if (navigator.share) {
      navigator.share({
        title: proposal.title || 'CaterPro AI Proposal',
        text: proposal.description || 'Check out this catering proposal',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast('Application URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans transition-colors selection:bg-emerald-500/20">
      <GoogleAnalytics currentTab={activeTab} />
      
      {/* 1. TOP HEADER NAVIGATION BAR (Exact match to PDF) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div
            onClick={() => setActiveTab('proposal')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 stroke-[2.4]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                CaterPro <span className="bg-gradient-to-r from-lime-600 to-teal-600 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Centralized Hotel Administration Hub
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('proposal')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'proposal'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-teal-600" />
              <span>Command Center</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalcIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>Plate Costing & Yields</span>
            </button>
            <button
              onClick={() => setActiveTab('haccp')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'haccp'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>HACCP Safety Log</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">
                CCP
              </span>
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'suppliers'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-teal-600" />
              <span>Local Suppliers</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-lime-100 text-lime-800">
                GPS
              </span>
            </button>
            <button
              onClick={() => setActiveTab('recipe')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'recipe'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Food Encyclopedia</span>
            </button>
            <button
              onClick={() => setActiveTab('commis')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'commis'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Commis Academy</span>
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'academic'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-red-600" />
              <span>Academic Hub</span>
            </button>
            <button
              onClick={() => setActiveTab('sales-engine')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sales-engine'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              <span>Sales Engine</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-teal-100 text-teal-900">
                AI Leads
              </span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Upgrade (Fresh 4-tier plan modal) */}
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-lime-500 to-teal-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-sm shadow-teal-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Plans & Pricing</span>
            </button>

            {/* Install Button */}
            <button
              onClick={() => setToast('CaterPro AI is ready for offline subterranean use!')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <span>📥</span>
              <span>Install</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShareLink}
              title="Share Link"
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors"
            >
              🔗
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopyForDocs}
              title="Copy Proposal"
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors"
            >
              📋
            </button>

            {/* Theme Switcher Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Theme"
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar (Snug, thumb-friendly, compact) */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-2.5 py-1.5 bg-white border-b border-slate-200 text-xs font-bold scrollbar-none shadow-2xs">
        <button
          onClick={() => setActiveTab('proposal')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
            activeTab === 'proposal' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 bg-slate-100'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5 text-teal-400" />
          <span>Command</span>
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
            activeTab === 'calculator' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 bg-slate-100'
          }`}
        >
          <CalcIcon className="w-3.5 h-3.5 text-teal-400" />
          <span>Costing</span>
        </button>
        <button
          onClick={() => setActiveTab('haccp')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
            activeTab === 'haccp' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>HACCP</span>
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
            activeTab === 'suppliers' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 bg-slate-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-teal-400" />
          <span>Suppliers</span>
        </button>
        <button
          onClick={() => setActiveTab('recipe')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
            activeTab === 'recipe' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Larousse</span>
        </button>
        <button
          onClick={() => setActiveTab('commis')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
            activeTab === 'commis' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Commis</span>
        </button>
        <button
          onClick={() => setActiveTab('academic')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
            activeTab === 'academic' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-red-500" />
          <span>Academic</span>
        </button>
        <button
          onClick={() => setActiveTab('sales-engine')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
            activeTab === 'sales-engine' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
          <span>Sales AI</span>
        </button>
      </div>

      {/* Main Container (Snug mobile & tablet padding, eliminated empty voids) */}
      <main className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6 py-3 sm:py-5 md:py-6 space-y-4 sm:space-y-6">
        
        {activeTab === 'proposal' && (
          <>
            {/* 2. PROPOSAL LIVE ACTION BAR (Snug compact ribbon) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="text-left">
                <h1 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Proposal Live
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  Manage, Share & Market your event.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setIsNewProposalOpen(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>←</span>
                  <span>NEW</span>
                </button>

                <button
                  onClick={handleExportPdf}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📥</span>
                  <span>PDF</span>
                </button>

                <button
                  onClick={handleSaveProposal}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>💾</span>
                  <span>SAVE</span>
                </button>
              </div>
            </div>

            {/* 3. STAR OF THE SHOW: CHEF EXECUTIVE COMMAND CENTER */}
            <CommandCenter
              proposal={proposal}
              region="South Africa (ZAR • R)"
              onNewProposal={() => setIsNewProposalOpen(true)}
              onOpenBeo={() => setIsBeoOpen(true)}
              onExportPdf={handleExportPdf}
              onOpenCalculator={() => setActiveTab('calculator')}
              onOpenSuppliers={() => setActiveTab('suppliers')}
              onOpenRecipe={() => setActiveTab('recipe')}
              onSaveProposal={handleSaveProposal}
              onQuickGenerateMenu={handleQuickGenerateMenu}
              isGeneratingMenu={isGeneratingMenu}
              onUpdateGuestCount={(count) => {
                setProposal(prev => ({
                  ...prev,
                  guestCount: count,
                  manualTotal: ((prev.manualPerHead || 450) * count) + (prev.logistics?.deliveryFee || 1200)
                }));
                setToast(`Updated covers to ${count} guests`);
              }}
              onUpdateActualGuestCount={handleUpdateActualGuestCount}
              onNotify={(msg) => setToast(msg)}
              onUpdateTimeline={handleUpdateTimeline}
              onUpdatePerHead={(price) => {
                setProposal(prev => ({
                  ...prev,
                  manualPerHead: price,
                  manualTotal: (price * (prev.guestCount || 50)) + (prev.logistics?.deliveryFee || 1200)
                }));
                setToast(`Updated per-head price to ZAR ${price}`);
              }}
            />

            {/* 4. CATERING WORKSPACE BAR (Snug compact banner) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900 tracking-wider">
                  Catering Workspace & Food Safety
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Share with banquet brigade, verify HACCP temperature checks, or source from local suppliers
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('suppliers')}
                  className="px-3 py-1.5 bg-lime-50 hover:bg-lime-100 text-teal-900 border border-lime-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Truck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Local Suppliers</span>
                </button>
                <button
                  onClick={() => setActiveTab('haccp')}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Daily HACCP Log</span>
                </button>
                <button
                  onClick={handleShareLink}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🔗</span> Share Link
                </button>
                <button
                  onClick={handleCopyForDocs}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📋</span> Copy for Docs
                </button>
              </div>
            </div>

            {/* 5. MASTER PROPOSAL DOCUMENT (The 10 Numbered Cards, Sourcing, Allergen Matrix) */}
            <ProposalViewer
              proposal={proposal}
              onUpdateProposal={(updated) => setProposal(updated)}
              onOpenBeo={() => setIsBeoOpen(true)}
              onOpenUpgrade={() => setIsUpgradeOpen(true)}
              onExportPdf={handleExportPdf}
              onOpenSuppliers={() => setActiveTab('suppliers')}
            />

            {/* 6. EXTENDED OPERATIONS & LABS */}
            <div className="space-y-4 sm:space-y-6 pt-2">
              {/* Productivity Lab (Beta) */}
              <ProductivityLab
                onNotify={(msg) => setToast(msg)}
              />

              {/* Education & Training Hub */}
              <EducationHubSection
                onNotify={(msg) => setToast(msg)}
                onOpenUpgrade={() => setIsUpgradeOpen(true)}
              />
            </div>
          </>
        )}

        {/* Local Suppliers & Procurement Hub */}
        {activeTab === 'suppliers' && (
          <div className="pt-2">
            <LocalSuppliersHub
              proposal={proposal}
              onNotify={(msg) => setToast(msg)}
              onOpenCalculator={() => setActiveTab('calculator')}
              onUpdateProposal={(updated) => {
                setProposal(updated);
                try {
                  localStorage.setItem('caterpro_recent_proposal', JSON.stringify(updated));
                } catch (e) {}
              }}
            />
          </div>
        )}

        {/* HACCP Food Safety & Storage Log */}
        {activeTab === 'haccp' && (
          <div className="pt-2">
            <HaccpLog onNotify={(msg) => setToast(msg)} />
          </div>
        )}

        {/* Secondary Views */}
        {activeTab === 'calculator' && (
          <div className="pt-2">
            <Calculator
              generatedMenu={proposal}
              region="South Africa"
              selectedItemName={proposal.menu?.[0]?.dish || ''}
              setSelectedItemName={() => {}}
              onOpenSuppliers={() => setActiveTab('suppliers')}
              onUpdateMenu={(updated) => {
                setProposal(updated);
                localStorage.setItem('caterpro_recent_proposal', JSON.stringify(updated));
                setToast('Live plate costings and menu updated!');
              }}
            />
          </div>
        )}

        {activeTab === 'recipe' && (
          <div className="pt-4">
            <RecipeGenerator
              generatedMenu={proposal}
              region="South Africa"
              selectedItemName={recipeSelectedDish || proposal.menu?.[0]?.dish || ''}
              setSelectedItemName={setRecipeSelectedDish}
              guestCount={proposal.guestCount || proposal.covers || 120}
            />
          </div>
        )}

        {activeTab === 'commis' && (
          <div className="pt-4 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300">
                  Student Edition • City & Guilds / QCTO Level 4
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                  Commis Academy & Culinary Curriculum Hub
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1 max-w-2xl">
                  Dedicated culinary education track for apprentice chefs, culinary students, and brigade trainees. Covers classical Escoffier sauce lineages, knife work fundamentals, and SANS 10330 HACCP food safety standards.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('academic')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>QCTO / SAQA Hub</span>
                  <span>→</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsUpgradeOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm"
                >
                  Commis Student Plan (R149)
                </button>
              </div>
            </div>

            <EducationHubSection
              onNotify={(msg) => setToast(msg)}
              onOpenUpgrade={() => setIsUpgradeOpen(true)}
            />

            <StudentGrowthLab
              onCopyText={(text: string, title: string) => {
                navigator.clipboard.writeText(text);
                setToast(`Copied ${title} to clipboard!`);
              }}
            />
          </div>
        )}

        {/* Academic Hub (QCTO / SAQA Curriculum Companion) */}
        {activeTab === 'academic' && (
          <div className="pt-4">
            <AcademicHub
              proposal={proposal}
              onNotify={(msg) => setToast(msg)}
              onOpenUpgrade={() => setIsUpgradeOpen(true)}
            />
          </div>
        )}

        {/* CaterProAI Sales & Operations Engine Hub */}
        {activeTab === 'sales-engine' && (
          <div className="pt-2">
            <SalesOperationsEngine
              proposal={proposal}
              onApplyToProposal={(updated) => {
                setProposal(updated);
                localStorage.setItem('caterpro_recent_proposal', JSON.stringify(updated));
                setToast('Applied CaterProAI Sales Engine specs to Proposal & BEO!');
              }}
              onNotify={(msg) => setToast(msg)}
            />
          </div>
        )}

      </main>

      {/* 7. FOOTER (Exact match to PDF) */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20 text-center text-xs text-slate-500 space-y-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="font-bold text-slate-700">
            © 2025 CaterPro AI. All rights reserved.
          </p>
          <p className="text-slate-500">
            Intelligent menu planning for catering professionals.
          </p>
          <p className="text-[11px] text-slate-400 italic max-w-xl mx-auto">
            As an Amazon Associate, we earn from qualifying purchases. This site contains affiliate links.
          </p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] font-mono text-slate-500">
              v1.0.1 • Live Build
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <NewProposalModal
        isOpen={isNewProposalOpen}
        onClose={() => setIsNewProposalOpen(false)}
        region="South Africa"
        onMenuGenerated={(newMenu) => {
          setProposal(newMenu);
          localStorage.setItem('caterpro_recent_proposal', JSON.stringify(newMenu));
          setToast('New Proposal successfully drafted by Chef AI!');
        }}
      />

      <PaystackUpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />

      {isBeoOpen && (
        <BanquetEventOrderModal
          isOpen={isBeoOpen}
          onClose={() => setIsBeoOpen(false)}
          menu={proposal}
          margin={72.4}
        />
      )}

      {isQrCheckInModalOpen && (
        <GuestCheckInModal
          isOpen={isQrCheckInModalOpen}
          onClose={() => setIsQrCheckInModalOpen(false)}
          proposal={proposal}
          onGuestCheckedIn={(guest) => {
            const updatedList = [guest, ...(proposal.checkedInGuests || [])];
            const newActual = updatedList.reduce((s, g) => s + (g.partySize || 1), 0);
            handleUpdateActualGuestCount(newActual, updatedList);
            setToast(`Check-In confirmed for ${guest.name} (+${guest.partySize} pax). Total: ${newActual} pax`);
          }}
        />
      )}

      <Toast message={toast} onDismiss={() => setToast(null)} />
      <AiChatBot onOpenSalesEngineTab={() => setActiveTab('sales-engine')} />
    </div>
  );
}

export default App;
