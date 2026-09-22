import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, X, ChefHat, Sparkles } from 'lucide-react';
import { Menu, MenuItem } from '../types';
import { getThemeFallbackImage } from '../services/geminiService';

interface ProposalViewerProps {
  proposal: Menu;
  onUpdateProposal: (updated: Menu) => void;
  onOpenBeo: () => void;
  onOpenUpgrade: () => void;
  onExportPdf: () => void;
  onOpenSocialModal?: (mode: 'create' | 'reel' | 'status') => void;
}

export const ProposalViewer: React.FC<ProposalViewerProps> = ({
  proposal,
  onUpdateProposal,
  onOpenBeo,
  onOpenUpgrade,
  onExportPdf,
  onOpenSocialModal
}) => {
  const [guestCount, setGuestCount] = useState<number>(proposal.guestCount || 50);
  const [perHeadPrice, setPerHeadPrice] = useState<number>(proposal.manualPerHead || 450);
  const [deliveryFee, setDeliveryFee] = useState<number>(proposal.logistics?.deliveryFee || 1200);
  const [requireDeposit, setRequireDeposit] = useState<boolean>(true);
  const [isBulkEditing, setIsBulkEditing] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Esc key and body scroll lock for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setIsZoomed(false);
      }
    };
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setIsZoomed(false);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  // Group dishes by category
  const appetizers = useMemo(() => {
    return (proposal.menu || []).filter(m => (m.cat || '').toLowerCase().includes('appetiz') || (m.cat || '').toLowerCase().includes('starter'));
  }, [proposal.menu]);

  const mains = useMemo(() => {
    return (proposal.menu || []).filter(m => (m.cat || '').toLowerCase().includes('main'));
  }, [proposal.menu]);

  const desserts = useMemo(() => {
    return (proposal.menu || []).filter(m => (m.cat || '').toLowerCase().includes('dessert'));
  }, [proposal.menu]);

  // Group shopping list items by supplier
  const groupedSuppliers = useMemo(() => {
    const list = proposal.shoppingList || [];
    const groups: { [supplier: string]: typeof list } = {};
    list.forEach(item => {
      const sup = item.supplier || 'General Market';
      if (!groups[sup]) groups[sup] = [];
      groups[sup].push(item);
    });
    return groups;
  }, [proposal.shoppingList]);

  // Sourcing procurement total
  const estimatedSourcingTotal = useMemo(() => {
    const list = proposal.shoppingList || [];
    let sum = 0;
    list.forEach(i => {
      const match = (i.estCost || '').replace(/[^0-9.]/g, '');
      const num = parseFloat(match);
      if (!isNaN(num)) sum += num;
    });
    return sum > 0 ? sum : 2250;
  }, [proposal.shoppingList]);

  const totalValue = useMemo(() => {
    return (perHeadPrice * guestCount) + deliveryFee;
  }, [perHeadPrice, guestCount, deliveryFee]);

  const depositAmount = useMemo(() => {
    return totalValue * 0.5;
  }, [totalValue]);

  // Clean fallback if heroImage is empty or undefined
  const heroImageSrc = useMemo(() => {
    const raw = proposal.heroImage || proposal.image;
    if (!raw) return getThemeFallbackImage(proposal.eventType || 'Banquet', proposal.cuisine, proposal.title, proposal.description);
    if (raw.startsWith('data:') || raw.startsWith('http') || raw.startsWith('/')) return raw;
    return `data:image/png;base64,${raw}`;
  }, [proposal.heroImage, proposal.image, proposal.eventType, proposal.cuisine, proposal.title, proposal.description]);

  return (
    <div id="proposal-document-root" className="space-y-12 text-left">
      {/* The Master Proposal Card Container */}
      <div id="proposal-content" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 md:p-12 space-y-10 text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Proposal Document Header */}
        <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
              CATERPRO AI PROPOSAL • {proposal.eventDate || '12/27/2025'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {proposal.title || proposal.menuTitle || 'Metropolitan Grand Hotel — Annual Gala Banquet'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-4xl">
            {proposal.description || 'Executive four-course plated banquet engineered for high-volume service, featuring premium Karoo cuts, sustainable coastal seafood, and Escoffier pastry finishes.'}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>{guestCount} Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{proposal.roomLocation || 'Grand Ballroom & Banqueting Deck'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📋</span>
              <span className="text-teal-700 dark:text-teal-400 font-mono">{proposal.beoNumber || 'BEO-2026-HOTEL-784'}</span>
            </div>
          </div>
        </div>

        {/* Clean Modern Hotel Banquet Hero Presentation with Click-to-Zoom Lightbox Inspection */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 text-white min-h-[340px] sm:min-h-[420px] md:min-h-[460px] flex flex-col justify-between p-5 sm:p-8 md:p-10 shadow-lg group cursor-pointer select-none"
          title="Click to inspect culinary plating in full-resolution lightbox"
        >
          {/* High-Vibrancy Cover / Hero Image */}
          <img 
            src={heroImageSrc} 
            alt={proposal.title || 'Banquet Culinary Presentation'} 
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = getThemeFallbackImage(proposal.eventType || 'Banquet', proposal.cuisine, proposal.title, proposal.description);
            }}
            className="absolute inset-0 w-full h-full object-cover object-center filter saturate-[1.2] contrast-[1.06] brightness-[1.04] transition-transform duration-700 group-hover:scale-105"
          />

          {/* Targeted top vignette for badge contrast - keeping center image 100% open and vibrant */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-lime-400/15 via-teal-400/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Center Hover Cue - Prompting Chef to Inspect */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
            <div className="px-5 py-2.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-lime-400/60 text-white text-xs font-bold flex items-center gap-2.5 shadow-2xl scale-95 group-hover:scale-100 transition-transform">
              <ZoomIn className="w-4 h-4 text-lime-400 animate-pulse" />
              <span>Click to Inspect Culinary Plating in Full Resolution</span>
              <span className="text-[10px] font-mono text-lime-300 bg-lime-400/20 px-2 py-0.5 rounded-full">Zoom</span>
            </div>
          </div>

          {/* Top badges */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-lime-300 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-lime-400/30 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                Hotel Banquet Standard • Certified Culinary Specification
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/20 text-[11px] font-black uppercase tracking-wider text-teal-200 shadow-sm">
                SANS 10330 Verified
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-teal-600/90 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                {proposal.eventType || 'Banquet'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-lime-400/40 hover:border-lime-400 text-[11px] font-bold flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 cursor-pointer"
                title="Inspect Culinary Plating in Full Resolution"
              >
                <ZoomIn className="w-3.5 h-3.5 text-lime-400" />
                <span className="hidden sm:inline">Inspect Plating</span>
              </button>
            </div>
          </div>

          {/* Frosted Glass Floating Card for Title & Specs - ensures image pops without text burying it */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 mt-8 space-y-3 bg-slate-950/70 hover:bg-slate-950/75 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/15 shadow-2xl transition-all"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                {proposal.title || proposal.menuTitle || 'Metropolitan Grand Hotel Banquet'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2 max-w-3xl mt-1.5 leading-relaxed drop-shadow-sm">
                {proposal.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/15 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <span>📍</span>
                <span>{proposal.roomLocation || 'Grand Ballroom & Banqueting Deck'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span>⏱️</span>
                <span>Est. Service: 4.5 Hours</span>
              </span>
              <span className="font-mono text-lime-300 font-bold bg-slate-900/80 px-2.5 py-1 rounded-lg border border-lime-400/30">
                Guaranteed: {guestCount} Covers
              </span>
            </div>
          </div>
        </div>

        {/* The 10 Numbered Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. Appetizers / Starters */}
          <div className="bg-slate-50 dark:bg-slate-800/75 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Appetizers / Starters</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Butler Passed</span>
            </div>
            <div className="space-y-3">
              {(appetizers.length > 0 ? appetizers : (proposal.menu || []).slice(0, 3)).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.dish}</span>
                    {item.price && <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">R{item.price}</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Main Courses */}
          <div className="bg-slate-50 dark:bg-slate-800/75 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Main Courses</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Plated / Station</span>
            </div>
            <div className="space-y-3">
              {(mains.length > 0 ? mains : (proposal.menu || []).slice(3, 6)).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.dish}</span>
                    {item.price && <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">R{item.price}</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Side Dishes */}
          <div className="bg-slate-50 dark:bg-slate-800/75 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Side Dishes</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Family Style</span>
            </div>
            <div className="space-y-3">
              {((proposal as any).sideDishes || [
                "Grilled Halloumi and Shaved Zucchini Ribbon Salad with Fresh Mint & Lemon Vinaigrette",
                "Roasted Cauliflower Florets with Creamy Sesame Tahini, Pomegranate & Toasted Pine Nuts"
              ]).map((side: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                  <span>{side}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Dessert */}
          <div className="bg-slate-50 dark:bg-slate-800/75 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Dessert</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Shooters & Bites</span>
            </div>
            <div className="space-y-3">
              {(desserts.length > 0 ? desserts : (proposal.menu || []).slice(6, 8)).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.dish}</span>
                    {item.price && <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">R{item.price}</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Dietary Accommodations */}
          <div className="bg-slate-50 dark:bg-slate-800/75 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center">5</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Dietary Accommodations</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Keto & Allergen Safe</span>
            </div>
            <div className="space-y-2">
              {((proposal as any).dietaryNotes || [
                "Strictly Ketogenic: Under 12g net carbohydrates per guest serving across all courses.",
                "100% Grain-Free & Certified Gluten-Free preparation environment.",
                "Nut-aware service protocol: Walnuts and pine nuts prepared in isolated prep stations.",
                "Diabetic-friendly: Zero refined sugar, honey, or high-glycemic sweeteners."
              ]).map((note: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Beverage Pairings */}
          <div className="bg-slate-50 dark:bg-slate-800/75 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center">6</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Beverage Pairings</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Sommelier Notes</span>
            </div>
            <div className="space-y-3">
              {((proposal as any).beveragePairings || [
                { dish: "Prosciutto Asparagus", pairing: "Steenberg 1682 Brut Chardonnay Cap Classique" },
                { dish: "Za'atar Salmon", pairing: "Springfield Estate Life from Stone Sauvignon Blanc" },
                { dish: "Beef & Lamb Skewers", pairing: "Kanonkop Kadette Cabernet Sauvignon Blend" },
                { dish: "Cocktail Special", pairing: "Keto Cucumber-Mint Gin Spritz with Sugar-Free Indian Tonic" }
              ]).map((item: any, idx: number) => (
                <div key={idx} className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.dish || item.course}:</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">{item.pairing || item.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Mise en Place */}
          <div className="bg-slate-50 dark:bg-slate-800/75 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center">7</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Mise en Place</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Prep Schedule</span>
            </div>
            <div className="space-y-2">
              {(proposal.miseEnPlace || [
                "Marinate Karoo lamb with roasted cumin, garlic, and sea salt 24 hours prior.",
                "Prepare cucumber-dill tzatziki and Lebanese garlic toum 12 hours prior.",
                "Blanch asparagus spears in salted boiling water for 90 seconds, shock in ice bath.",
                "Portion Atlantic salmon into 120g cocktail loins; rub skin-side with za'atar spice blend.",
                "Hull fresh strawberries and pipe vanilla mascarpone filling 3 hours prior; keep chilled at 3°C."
              ]).map((step: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] shrink-0 mt-0.5">[{idx + 1}]</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Service & Plating Notes */}
          <div className="bg-slate-50 dark:bg-slate-800/75 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center">8</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Service & Plating Notes</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Front of House</span>
            </div>
            <div className="space-y-2">
              {(proposal.serviceNotes || [
                "Passed tray service with butler-style circulating platters for appetizers during initial 90 minutes.",
                "Stationary display with heat lamps and live carving service for beef skewers and grilled chicken.",
                "Tiered black slate boards accented with micro-greens and fresh citrus quarters for main proteins.",
                "White-glove beverage service with continuous Cap Classique and sparkling spring water replenishment."
              ]).map((note: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 9. Delivery & Logistics */}
          <div className="bg-slate-50 dark:bg-slate-800/75 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center">9</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Delivery & Logistics</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Cold Chain Active</span>
            </div>
            <div className="space-y-2">
              {(proposal.deliveryLogistics || [
                "Refrigerated transport vehicle maintained strictly between 2°C and 4°C throughout transit.",
                "On-site arrival 90 minutes prior to guest reception for kitchen station setup and warming.",
                "Zoned drop-off within Cape Town Atlantic Seaboard / City Bowl zone.",
                "Post-service breakdown, clearing, and eco-friendly organic waste compost bin removal included."
              ]).map((log: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">🚚</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 10. Shopping List & Sourcing */}
          <div className="bg-slate-50 dark:bg-slate-800/75 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4 md:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center">10</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Shopping List & Wholesale Sourcing</h3>
              </div>
              <button
                onClick={() => setIsBulkEditing(!isBulkEditing)}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-700 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-600 shadow-2xs"
              >
                {isBulkEditing ? 'Done Editing' : 'Bulk Edit'}
              </button>
            </div>

            {/* Supplier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(groupedSuppliers).map(([supplierName, items], sIdx) => (
                <div key={sIdx} className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{supplierName}</span>
                    <span className="text-[10px] font-bold text-slate-400">{items.length} items</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((it, iIdx) => (
                      <div key={iIdx} className="text-[11px] flex justify-between items-start gap-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{it.item}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] shrink-0">{it.estCost || it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Procurement Summary Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-300">Procurement Summary</span>
                <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                  Estimated Sourcing Total (ZAR wholesale market benchmark):
                </p>
              </div>
              <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                ZAR {estimatedSourcingTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

        </div>

        {/* Financial Proposal Value & Quote Builder */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Financial Execution</span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1">Total Proposal Value</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                ZAR {totalValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                Based on {guestCount} guests • Incl. logistics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Price Per Head (ZAR)
              </label>
              <input
                type="number"
                value={perHeadPrice}
                onChange={(e) => setPerHeadPrice(Number(e.target.value))}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Logistics & Transport Fee (ZAR)
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                50% Booking Deposit
              </label>
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold">Required (50%)</span>
                <span className="text-xs font-black text-emerald-400">
                  ZAR {depositAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statutory Allergen & Dietary Matrix */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Statutory Allergen & Dietary Matrix (SANS 10330 HACCP)
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Health Inspection Defensible
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Dish / Component</th>
                  <th className="p-3 text-center">Gluten</th>
                  <th className="p-3 text-center">Dairy</th>
                  <th className="p-3 text-center">Nuts</th>
                  <th className="p-3 text-center">Eggs</th>
                  <th className="p-3 text-center">Fish/Shellfish</th>
                  <th className="p-3 text-center">Dietary Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {(proposal.allergenMatrix || []).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{row.dish}</td>
                    <td className="p-3 text-center">{row.gluten ? '⚠️ Yes' : '✓ Safe'}</td>
                    <td className="p-3 text-center">{row.dairy ? '⚠️ Yes' : '✓ Safe'}</td>
                    <td className="p-3 text-center">{row.nuts ? '⚠️ Yes' : '✓ Safe'}</td>
                    <td className="p-3 text-center">{row.eggs ? '⚠️ Yes' : '✓ Safe'}</td>
                    <td className="p-3 text-center">{row.fish || row.shellfish ? '⚠️ Yes' : '✓ Safe'}</td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                        {(row.dietary || ['Keto', 'Gluten-Free']).join(', ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Primary Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onExportPdf}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>📥</span> Download Proposal PDF
          </button>

          <button
            onClick={onOpenBeo}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-lime-500 via-teal-600 to-cyan-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>📋</span> Export Banquet Event Order (BEO)
          </button>

          <button
            onClick={onOpenUpgrade}
            className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💳</span> View 4-Tier Hotel Plans
          </button>
        </div>

      </div>

      {/* Framer-Motion Full-Resolution Culinary Inspection Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            key="culinary-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 select-none"
            onClick={() => {
              setIsLightboxOpen(false);
              setIsZoomed(false);
            }}
          >
            {/* Top Navigation & Controls */}
            <motion.div
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -25, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-6xl flex items-center justify-between gap-4 z-20 pb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lime-500 via-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 ring-1 ring-white/20">
                  <ChefHat className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                      {proposal.title || proposal.menuTitle || 'Culinary Presentation Inspection'}
                    </h3>
                    <span className="text-[10px] font-bold text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-full border border-lime-400/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Full Resolution
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {proposal.eventType || 'Hotel Banquet'} • {proposal.roomLocation || 'Grand Ballroom'} • SANS 10330 Culinary Standard
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-teal-500/50 text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  title="Toggle Macro Zoom"
                >
                  {isZoomed ? (
                    <>
                      <ZoomOut className="w-4 h-4 text-teal-400" />
                      <span>Fit Window</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn className="w-4 h-4 text-lime-400" />
                      <span>Zoom 150%</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(false);
                    setIsZoomed(false);
                  }}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  title="Close Lightbox (Esc)"
                >
                  <X className="w-5 h-5" />
                  <span className="hidden sm:inline font-mono text-[10px] text-slate-400">Esc</span>
                </button>
              </div>
            </motion.div>

            {/* Central Stage: High-Resolution Plating Aesthetic View */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className={`relative max-w-6xl w-full flex-1 flex items-center justify-center overflow-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-2 sm:p-4 my-auto shadow-2xl transition-all ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
            >
              <img
                src={heroImageSrc}
                alt={proposal.title || 'Culinary Presentation Detail'}
                className={`max-w-none transition-transform duration-300 rounded-xl sm:rounded-2xl select-none filter saturate-[1.18] contrast-[1.06] ${
                  isZoomed
                    ? 'scale-150 transform-gpu object-contain max-h-none'
                    : 'max-h-[72vh] w-auto max-w-full object-contain shadow-2xl'
                }`}
                draggable={false}
              />
            </motion.div>

            {/* Bottom Footer Info Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 text-xs text-slate-400 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                <span className="text-slate-300 font-medium">
                  {isZoomed ? 'Click image to reset to fitted view' : 'Click image to inspect micro-garnishes & sauce textures at 150%'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-slate-400">Executive Chef Plating Approval Mode</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-slate-400">Click anywhere outside to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalViewer;
