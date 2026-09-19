import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Users, 
  Scale, 
  RotateCcw, 
  Copy, 
  Check, 
  Printer, 
  ChefHat, 
  Sparkles, 
  Plus, 
  Minus, 
  ThermometerSnowflake, 
  AlertCircle,
  Layers
} from 'lucide-react';
import { Menu } from '../types';

interface RecipeGeneratorProps {
  generatedMenu: Menu | null;
  region: string;
  selectedItemName: string;
  setSelectedItemName: (name: string) => void;
  guestCount?: number;
}

export interface MiseEnPlaceItem {
  item: string;
  specification?: string;
  quantity: string;
  prepTechnique?: string;
}

export interface ScaledMiseEnPlaceItem {
  item: string;
  specification?: string;
  originalQuantity: string;
  scaledQuantity: string;
  unit: string;
  prepTechnique?: string;
  isScalable: boolean;
}

export interface RecipeData {
  dishName: string;
  prepTime: string;
  cookTime: string;
  yield: string;
  basePax: number;
  culinaryIntroduction: string;
  miseEnPlace: MiseEnPlaceItem[];
  steps: { step: number; title: string; instruction: string }[];
  larousseInsights: { term: string; definition: string; motherSauceLinkage?: string }[];
  platedPresentationNotes: string;
}

/**
 * Extract numerical base yield from string (e.g. "10 Covers / Banquet", "50 Portions")
 */
export const parseBaseYield = (yieldStr?: string): number => {
  if (!yieldStr) return 10;
  const match = yieldStr.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    return num > 0 ? num : 10;
  }
  return 10;
};

/**
 * Scale ingredient quantity with smart commercial unit conversion (g -> kg, ml -> L)
 */
export const scaleIngredient = (
  itemObj: MiseEnPlaceItem,
  scaleFactor: number
): ScaledMiseEnPlaceItem => {
  const rawQty = (itemObj.quantity || '').trim();

  // If non-scalable (e.g. "to taste", "as needed", "pinch", "garnish", or empty)
  if (!rawQty || /to taste|as needed|for garnish|pinch|q\.s\./i.test(rawQty)) {
    return {
      item: itemObj.item,
      specification: itemObj.specification,
      originalQuantity: rawQty || 'To taste',
      scaledQuantity: rawQty || 'To taste',
      unit: '',
      prepTechnique: itemObj.prepTechnique,
      isScalable: false
    };
  }

  let numericVal: number | null = null;
  let unit = '';

  // Match fractions like "1 1/2" or "1/2" or "3/4"
  const fracMatch = rawQty.match(/^(\d+)?\s*(\d+)\/(\d+)\s*(.*)$/);
  if (fracMatch) {
    const whole = fracMatch[1] ? parseFloat(fracMatch[1]) : 0;
    const num = parseFloat(fracMatch[2]);
    const den = parseFloat(fracMatch[3]);
    numericVal = whole + (den !== 0 ? num / den : 0);
    unit = (fracMatch[4] || '').trim();
  } else {
    // Match decimal or integer with unit
    const stdMatch = rawQty.match(/^([\d.,]+)\s*(.*)$/);
    if (stdMatch) {
      const parsed = parseFloat(stdMatch[1].replace(/,/g, '.'));
      if (!isNaN(parsed)) {
        numericVal = parsed;
        unit = (stdMatch[2] || '').trim();
      }
    }
  }

  if (numericVal === null || isNaN(numericVal)) {
    return {
      item: itemObj.item,
      specification: itemObj.specification,
      originalQuantity: rawQty,
      scaledQuantity: rawQty,
      unit: '',
      prepTechnique: itemObj.prepTechnique,
      isScalable: false
    };
  }

  const rawScaled = numericVal * scaleFactor;
  const lowerUnit = unit.toLowerCase();
  let scaledFormatted = '';
  let scaledUnit = unit;

  // Grams to Kilograms conversion
  if (lowerUnit === 'g' || lowerUnit === 'gram' || lowerUnit === 'grams') {
    if (rawScaled >= 1000) {
      const kg = rawScaled / 1000;
      scaledUnit = 'kg';
      scaledFormatted = `${kg >= 10 ? kg.toFixed(1) : kg.toFixed(2).replace(/\.00$/, '')} kg`;
    } else {
      scaledUnit = 'g';
      scaledFormatted = `${rawScaled >= 10 ? Math.round(rawScaled) : rawScaled.toFixed(1)} g`;
    }
  } 
  // Millilitres to Litres conversion
  else if (lowerUnit === 'ml' || lowerUnit === 'milliliters' || lowerUnit === 'millilitres') {
    if (rawScaled >= 1000) {
      const l = rawScaled / 1000;
      scaledUnit = 'L';
      scaledFormatted = `${l >= 10 ? l.toFixed(1) : l.toFixed(2).replace(/\.00$/, '')} L`;
    } else {
      scaledUnit = 'ml';
      scaledFormatted = `${rawScaled >= 10 ? Math.round(rawScaled) : rawScaled.toFixed(1)} ml`;
    }
  } 
  // Kilograms
  else if (lowerUnit === 'kg' || lowerUnit === 'kilogram' || lowerUnit === 'kilograms') {
    scaledUnit = 'kg';
    scaledFormatted = `${rawScaled >= 10 ? rawScaled.toFixed(1) : rawScaled.toFixed(2).replace(/\.00$/, '')} kg`;
  } 
  // Litres
  else if (lowerUnit === 'l' || lowerUnit === 'liter' || lowerUnit === 'liters' || lowerUnit === 'litre' || lowerUnit === 'litres') {
    scaledUnit = 'L';
    scaledFormatted = `${rawScaled >= 10 ? rawScaled.toFixed(1) : rawScaled.toFixed(2).replace(/\.00$/, '')} L`;
  } 
  // Tablespoons
  else if (lowerUnit === 'tbsp' || lowerUnit === 'tablespoon' || lowerUnit === 'tablespoons') {
    scaledUnit = 'tbsp';
    scaledFormatted = `${rawScaled >= 10 ? Math.round(rawScaled) : rawScaled.toFixed(1)} tbsp`;
  } 
  // Teaspoons
  else if (lowerUnit === 'tsp' || lowerUnit === 'teaspoon' || lowerUnit === 'teaspoons') {
    scaledUnit = 'tsp';
    scaledFormatted = `${rawScaled >= 10 ? Math.round(rawScaled) : rawScaled.toFixed(1)} tsp`;
  } 
  // Cups
  else if (lowerUnit === 'cup' || lowerUnit === 'cups') {
    scaledUnit = rawScaled > 1 ? 'cups' : 'cup';
    scaledFormatted = `${rawScaled >= 10 ? rawScaled.toFixed(1) : rawScaled.toFixed(2).replace(/\.00$/, '')} ${scaledUnit}`;
  } 
  // Whole items, cloves, slices, pieces
  else {
    const cleanNum = rawScaled >= 10 ? Math.round(rawScaled) : (rawScaled % 1 === 0 ? rawScaled.toString() : rawScaled.toFixed(1));
    scaledFormatted = unit ? `${cleanNum} ${unit}` : `${cleanNum}`;
  }

  return {
    item: itemObj.item,
    specification: itemObj.specification,
    originalQuantity: rawQty,
    scaledQuantity: scaledFormatted,
    unit: scaledUnit,
    prepTechnique: itemObj.prepTechnique,
    isScalable: true
  };
};

const buildDefaultRecipe = (dish: string, regionName: string): RecipeData => ({
  dishName: dish || "Roasted Heritage Beetroot & Goat's Cheese Carpaccio",
  prepTime: "25 Minutes",
  cookTime: "20 Minutes",
  yield: "10 Covers / Escoffier Classical Base",
  basePax: 10,
  culinaryIntroduction: `Classical Escoffier and high-volume hotel formulation for ${dish || 'the selected banquet course'}, localized for ${regionName}.`,
  miseEnPlace: [
    { item: "Primary Protein / Core Produce", specification: "Trimmed, portioned & chilled <4°C", quantity: "1.2 kg", prepTechnique: "Precision Brunoise & Par-cook" },
    { item: "Cold-Pressed Virgin Olive Oil", specification: "Single-estate cold press", quantity: "120 ml", prepTechnique: "Emulsion binding" },
    { item: "Fresh Fine Herbs", specification: "Chervil, tarragon, flat-leaf parsley", quantity: "45 g", prepTechnique: "Delicate Chiffonade" },
    { item: "Kalahari Desert Crystal Salt", specification: "Mineral-rich unrefined salt", quantity: "15 g", prepTechnique: "Season to finish" },
    { item: "Aged Fynbos Honey Gastrique", specification: "Local artisanal honey reduction", quantity: "60 ml", prepTechnique: "Glossy drizzle reduction" },
    { item: "Artisanal Goat Chevin or Crumb", specification: "Cold room tempered 12°C", quantity: "250 g", prepTechnique: "Quenelle or gentle crumble" }
  ],
  steps: [
    { step: 1, title: "SANS 10330 Prep & Cold Chain Stabilization", instruction: "Sanitize stainless steel prep stations with approved chemical sanitizers. Maintain all cold ingredients at <4°C." },
    { step: 2, title: "Thermal Sealing & Reduction Development", instruction: "Execute core cooking over high heat to initiate Maillard development. Simmer reduction until coats back of spoon (nappé)." },
    { step: 3, title: "Commercial Banquet Assembly & Pass Inspection", instruction: "Portion onto warmed banquet china. Drizzle emulsified reduction diagonally and crown with fresh chiffonade herbs." }
  ],
  larousseInsights: [
    { term: "Brunoise", definition: "Precision 2mm fine dice ensuring uniform cooking surface and elegant mouthfeel.", motherSauceLinkage: "Velouté" },
    { term: "Emulsion", definition: "Suspension of two unmixable liquids stabilized by natural phospholipids.", motherSauceLinkage: "Hollandaise" },
    { term: "Nappé", definition: "Culinary texture describing a sauce thick enough to coat the back of a spoon evenly.", motherSauceLinkage: "Espagnole" }
  ],
  platedPresentationNotes: "Center portion cleanly on warm ceramic with vibrant herbal lustre, ensuring strict portion uniformity across all banquet covers."
});

export const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({
  generatedMenu,
  region,
  selectedItemName,
  setSelectedItemName,
  guestCount
}) => {
  // Proposal guest count (default to 120 or 50 if unspecified)
  const proposalGuests = useMemo(() => {
    return guestCount || generatedMenu?.guestCount || generatedMenu?.covers || 120;
  }, [guestCount, generatedMenu?.guestCount, generatedMenu?.covers]);

  // Scaled pax state: automatically initialized to proposal guests
  const [targetPax, setTargetPax] = useState<number>(proposalGuests);
  const [activeRecipe, setActiveRecipe] = useState<RecipeData | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customDish, setCustomDish] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Sync target pax whenever proposal guest count changes
  useEffect(() => {
    if (proposalGuests > 0) {
      setTargetPax(proposalGuests);
    }
  }, [proposalGuests]);

  // Compile active menu dishes from proposal
  const menuDishes = useMemo(() => {
    if (!generatedMenu) return [];
    const items = generatedMenu.menu || (generatedMenu as any).items || [];
    if (items.length > 0) {
      return items.map((item: any) => typeof item === 'string' ? item : (item.dish || item.name || ''));
    }
    return [];
  }, [generatedMenu]);

  // Handle first item setup and initial recipe mounting
  useEffect(() => {
    if (menuDishes.length > 0 && !selectedItemName) {
      setSelectedItemName(menuDishes[0]);
    }
  }, [menuDishes, selectedItemName, setSelectedItemName]);

  // Provide initial baseline recipe on mount so yield calculator is instantly active
  useEffect(() => {
    if (!activeRecipe) {
      const initialDish = selectedItemName || menuDishes[0] || "Roasted Heritage Beetroot & Goat's Cheese Carpaccio";
      setActiveRecipe(buildDefaultRecipe(initialDish, region));
    }
  }, [selectedItemName, menuDishes, region, activeRecipe]);

  // Calculate yield metrics
  const basePax = useMemo(() => {
    if (!activeRecipe) return 10;
    return activeRecipe.basePax || parseBaseYield(activeRecipe.yield) || 10;
  }, [activeRecipe]);

  const scaleFactor = useMemo(() => {
    if (!targetPax || basePax <= 0) return 1;
    return targetPax / basePax;
  }, [targetPax, basePax]);

  // Calculate scaled mise en place items
  const scaledMiseEnPlace: ScaledMiseEnPlaceItem[] = useMemo(() => {
    if (!activeRecipe || !activeRecipe.miseEnPlace) return [];
    return activeRecipe.miseEnPlace.map((item) => scaleIngredient(item, scaleFactor));
  }, [activeRecipe, scaleFactor]);

  const generateRecipe = async () => {
    const targetDish = isCustomMode ? customDish : selectedItemName;
    if (!targetDish || targetDish.trim() === '') {
      setError('Please select or write a dish name to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setCompletedSteps({});

    const benchmarks = [
      "Paging through Larousse Gastronomique volumes...",
      "Consulting Classical Escoffier directories...",
      "Tracing lineage of mother sauces applicable to the profile...",
      "Analyzing technical dictionary definition and techniques...",
      "Drafting premium instructions & classical micro adjustments...",
      `Formulating scaled commercial batching for ${targetPax} covers...`
    ];

    let bIdx = 0;
    setLoadingStep(benchmarks[0]);
    const progressTimer = setInterval(() => {
      bIdx++;
      if (bIdx < benchmarks.length) {
        setLoadingStep(benchmarks[bIdx]);
      } else {
        setLoadingStep("Curating the final Larousse Masterclass guide...");
      }
    }, 2400);

    try {
      const res = await fetch('/api/gemini/larousse-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishName: targetDish, region })
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          const d = json.data;
          const parsedBase = parseBaseYield(d.targetYield);
          
          setActiveRecipe({
            dishName: d.recipeTitle || targetDish,
            prepTime: d.prepTime || "25 mins",
            cookTime: d.cookTime || "20 mins",
            yield: d.targetYield || `${parsedBase} Covers / Base Portioning`,
            basePax: parsedBase,
            culinaryIntroduction: d.culinaryHeritage || `Classical Escoffier compilation for ${targetDish}.`,
            miseEnPlace: Array.isArray(d.miseEnPlace) ? d.miseEnPlace : [
              { item: "Primary Protein / Produce", specification: "Trimmed, portioned & chilled <4°C", quantity: "1.2 kg", prepTechnique: "Precision Brunoise & Par-cook" },
              { item: "Cold-Pressed Virgin Olive Oil", specification: "Single-estate cold press", quantity: "120 ml", prepTechnique: "Emulsion binding" },
              { item: "Fresh Fine Herbs", specification: "Chervil, tarragon, flat-leaf parsley", quantity: "45 g", prepTechnique: "Delicate Chiffonade" },
              { item: "Kalahari Desert Crystal Salt", specification: "Mineral-rich unrefined salt", quantity: "15 g", prepTechnique: "Season to finish" }
            ],
            steps: Array.isArray(d.executionSteps) ? d.executionSteps.map((s: any, idx: number) => ({
              step: s.stepNumber || idx + 1,
              title: s.title || `Phase ${idx + 1}`,
              instruction: s.instruction || ""
            })) : [
              { step: 1, title: "Station Sanitation & Setup", instruction: "Sanitize surfaces according to SANS 10330 standards. Maintain cold chain <4°C." },
              { step: 2, title: "Thermal Sealing", instruction: "Pan-sear over high heat to initiate Maillard development." },
              { step: 3, title: "Banquet Plating", instruction: "Center portion on warmed service plate, garnish with fresh herbs." }
            ],
            larousseInsights: d.larousseInsights || [
              { term: "Brunoise", definition: "Precision 2mm fine dice ensuring uniform cooking surface and elegant mouthfeel.", motherSauceLinkage: "Velouté" },
              { term: "Emulsion", definition: "Suspension of two unmixable liquids stabilized by natural phospholipids.", motherSauceLinkage: "Hollandaise" }
            ],
            platedPresentationNotes: d.platedPresentationNotes || "Precision plated banquet presentation adhering to classical symmetry and temperature retention."
          });
          return;
        }
      }
      throw new Error("Could not retrieve Larousse recipe from server.");
    } catch (err: any) {
      console.warn("Larousse recipe compilation fallback:", err);
      setActiveRecipe(buildDefaultRecipe(targetDish, region));
    } finally {
      clearInterval(progressTimer);
      setLoading(false);
    }
  };

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  // Copy scaled prep list to clipboard
  const copyScaledMiseEnPlace = () => {
    if (!activeRecipe) return;
    const lines = [
      `CATERPRO AI | SCALED BANQUET MISE EN PLACE`,
      `Dish: ${activeRecipe.dishName}`,
      `Target Banquet Yield: ${targetPax} Guests (${scaleFactor.toFixed(2)}x Scaling from ${basePax} Pax Base)`,
      `Local Culinary Region: ${region}`,
      `--------------------------------------------------`,
      ...scaledMiseEnPlace.map(m => {
        const spec = m.specification ? ` — ${m.specification}` : '';
        const tech = m.prepTechnique ? ` [${m.prepTechnique}]` : '';
        const baseRef = m.isScalable ? ` (Base: ${m.originalQuantity} @ ${basePax} Pax)` : '';
        return `• ${m.scaledQuantity} ${m.item}${spec}${tech}${baseRef}`;
      }),
      `--------------------------------------------------`,
      `SANS 10330 Safety Advisory: For ${targetPax} covers, hold batch below 4°C. Stage into Gastronorm GN 1/1 pans (depth ≤100mm).`
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const isProposalSync = targetPax === proposalGuests;

  return (
    <div id="recipe-generator-root" className="pt-4 pb-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      
      {/* Title Header with Yield Integration Badge */}
      <div className="text-center space-y-3 mb-8 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 p-8 sm:p-10 rounded-3xl border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full">
            <span className="text-amber-400 text-sm font-black animate-pulse">🏛️</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
              Food Encyclopedia & Larousse Gastronomique
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-300 text-[10px] font-black uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Automated Yield Calculator Active ({proposalGuests} Covers Synced)</span>
          </div>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
          Food Encyclopedia & Automated Yield Calculator
        </h2>
        <p className="text-amber-100/70 font-medium max-w-3xl mx-auto text-center text-xs sm:text-sm">
          Classical Auguste Escoffier formulations automatically scaled to the exact guest count from your proposal ({proposalGuests} covers), with intelligent unit conversions (g → kg, ml → L) and SANS 10330 commercial cold-chain compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Column: Dish Selection & Dedicated Yield Calculator Widget */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Dish Selection Card */}
          <div className="bg-slate-900/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-amber-500/20 shadow-xl space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <span className="text-xl">📓</span>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Encyclopedia Entry</h3>
                <p className="text-[10px] text-slate-400 font-medium">Select course or custom search</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Select Target Dish from Proposal
                </label>
                
                <select
                  id="larousse-dish-selector"
                  value={isCustomMode ? 'custom' : selectedItemName}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'custom') {
                      setIsCustomMode(true);
                      setCustomDish('');
                    } else {
                      setIsCustomMode(false);
                      setSelectedItemName(val);
                      if (activeRecipe?.dishName !== val) {
                        setActiveRecipe(buildDefaultRecipe(val, region));
                      }
                    }
                  }}
                  className="w-full p-3 rounded-xl bg-slate-800 text-white font-bold outline-none border border-white/15 text-xs focus:border-amber-400 transition-all cursor-pointer"
                >
                  {menuDishes.map((dish: string, idx: number) => (
                    <option key={idx} value={dish}>{dish}</option>
                  ))}
                  <option value="custom">-- Custom Reference / Search --</option>
                </select>
              </div>

              {/* Quick Classical Presets */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-black uppercase tracking-widest text-amber-400/80">
                  Popular Larousse Masterclasses
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Sole à la Meunière',
                    'Beef Bourguignon',
                    'Béchamel & Mother Sauces',
                    'Coq au Vin Classical',
                    'Crème Brûlée & Custards',
                    'Cape Malay Curry'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setIsCustomMode(true);
                        setCustomDish(preset);
                        setActiveRecipe(buildDefaultRecipe(preset, region));
                      }}
                      className="text-[9px] font-bold px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/20 transition-all text-left cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {isCustomMode && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-2"
                >
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Write Classical Dish Profile
                  </label>
                  <input
                    type="text"
                    value={customDish}
                    onChange={(e) => setCustomDish(e.target.value)}
                    placeholder="e.g. Sole Meunière, Coq au Vin, Sauce Hollandaise"
                    className="w-full p-3 rounded-xl bg-slate-800 text-white font-bold outline-none border border-white/15 text-xs focus:border-amber-400 transition-all"
                  />
                </motion.div>
              )}

              <button
                onClick={generateRecipe}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg disabled:opacity-45 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-sm">🔄</span>
                    <span>Consulting Archive...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Decode Classic</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Yield Calculator Controller */}
          <div className="bg-slate-900/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-emerald-500/30 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Yield Calculator</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Automatic batch scaling</p>
                </div>
              </div>

              {isProposalSync ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Proposal Synced
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTargetPax(proposalGuests)}
                  className="px-2 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer"
                  title="Reset to Proposal Guest Count"
                >
                  <RotateCcw className="w-3 h-3" />
                  Sync {proposalGuests}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Target Pax Stepper & Direct Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Target Banquet Covers</span>
                  <span className="text-emerald-400 font-mono font-bold">Base: {basePax} Pax</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTargetPax(prev => Math.max(1, prev - 10))}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-xs font-black transition-all cursor-pointer"
                    title="Minus 10 Covers"
                  >
                    -10
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetPax(prev => Math.max(1, prev - 1))}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-xs font-black transition-all cursor-pointer"
                    title="Minus 1 Cover"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={1}
                      max={5000}
                      value={targetPax}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setTargetPax(isNaN(val) || val < 1 ? 1 : val);
                      }}
                      className="w-full text-center py-2.5 px-3 rounded-xl bg-slate-950 text-white font-black text-lg border border-emerald-500/40 focus:border-emerald-400 outline-none"
                    />
                    <span className="absolute right-3 top-3 text-[10px] font-bold text-slate-500 uppercase pointer-events-none">
                      PAX
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTargetPax(prev => prev + 1)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-xs font-black transition-all cursor-pointer"
                    title="Plus 1 Cover"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetPax(prev => prev + 10)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-xs font-black transition-all cursor-pointer"
                    title="Plus 10 Covers"
                  >
                    +10
                  </button>
                </div>
              </div>

              {/* Quick Pax Presets */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Quick Banquet Scaling Presets
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: '10 Pax', val: 10 },
                    { label: '25 Pax', val: 25 },
                    { label: '50 Pax', val: 50 },
                    { label: '100 Pax', val: 100 },
                    { label: `${proposalGuests} (Prop)`, val: proposalGuests },
                    { label: '250 Pax', val: 250 }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTargetPax(p.val)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-black uppercase border transition-all cursor-pointer ${
                        targetPax === p.val
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-white/10'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multiplier Display Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Batch Multiplier:</span>
                  <span className="text-emerald-400 font-mono font-black text-sm">
                    {scaleFactor.toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Standard Batch:</span>
                  <span className="text-slate-300">{basePax} Portions</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Proposal Setting:</span>
                  <span className="text-amber-300 font-mono">{proposalGuests} Covers</span>
                </div>
              </div>

              {!isProposalSync && (
                <button
                  type="button"
                  onClick={() => setTargetPax(proposalGuests)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Proposal ({proposalGuests} Pax)</span>
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-bold">
              <span>LOCALIZED TO:</span>
              <span className="text-emerald-400 uppercase tracking-widest">{region}</span>
            </div>
          </div>
        </div>

        {/* Display / Masterclass View Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900/40 p-16 rounded-[4rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center py-32 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center text-emerald-400 font-bold" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Gemini Academy is Transcribing...</h3>
                <p className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-widest max-w-md">
                  {loadingStep}
                </p>
              </motion.div>
            )}

            {error && !loading && (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-3xl"
              >
                <h4 className="font-black uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                  <span>⚠️</span> Classical Library Error
                </h4>
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {activeRecipe && !loading && !error && (
              <motion.div 
                key="recipe-data"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Introduction & Yield Banner */}
                <div className="bg-slate-900/60 backdrop-blur-3xl p-8 sm:p-12 rounded-[3.5rem] border border-white/10 shadow-xl space-y-6 relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                        Larousse Classical Recipe & Live Yield Scale
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Scaled for {targetPax} Covers</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-white/10">
                        {scaleFactor.toFixed(2)}x Multiplier
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl sm:text-4xl font-extrabold uppercase italic tracking-tighter text-white">
                      {activeRecipe.dishName}
                    </h3>
                    <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase text-slate-400 tracking-wider mt-3">
                      <span className="flex items-center gap-1">⏱️ Prep: {activeRecipe.prepTime || "25 mins"}</span>
                      <span className="flex items-center gap-1">🔥 Cook: {activeRecipe.cookTime || "20 mins"}</span>
                      <span className="flex items-center gap-1">🏛️ Baseline: {basePax} Pax Standard Batch</span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        ⚡ Output: {targetPax} Plated Banquet Portions
                      </span>
                    </div>
                  </div>

                  {activeRecipe.culinaryIntroduction && (
                    <p className="text-slate-300 text-sm font-medium italic leading-relaxed border-t border-white/5 pt-6 opacity-85">
                      "{activeRecipe.culinaryIntroduction}"
                    </p>
                  )}
                </div>

                {/* Scaled Mise en Place & Ingredients Section */}
                <div className="bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-10 rounded-[3.5rem] border border-emerald-500/25 shadow-2xl space-y-6">
                  
                  {/* Card Header with Interactive Steppers & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">
                          Scaled Mise en Place & Batching
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black uppercase">
                          {targetPax} Pax ({scaleFactor.toFixed(2)}x)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        Ingredients dynamically adjusted from {basePax} portions to {targetPax} banquet covers with automatic unit shifts.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={copyScaledMiseEnPlace}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        title="Copy Scaled Prep List for Kitchen Brigade"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy Scaled List</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-teal-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        title="Print Kitchen Batch Sheet"
                      >
                        <Printer className="w-3.5 h-3.5 text-teal-400" />
                        <span>Print Sheet</span>
                      </button>
                    </div>
                  </div>

                  {/* Scaled Ingredients Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scaledMiseEnPlace.map((m, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-sm font-black text-white leading-tight">
                              {m.item}
                            </span>
                            {m.specification && (
                              <p className="text-[11px] text-slate-400 font-medium">
                                {m.specification}
                              </p>
                            )}
                          </div>

                          {/* Scaled Quantity Pill */}
                          <div className="shrink-0 text-right">
                            <span className="inline-block px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-black text-sm shadow-sm">
                              {m.scaledQuantity}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-[10px]">
                          {m.prepTechnique ? (
                            <span className="text-amber-300 font-semibold flex items-center gap-1">
                              <span className="text-amber-400">🔪</span> {m.prepTechnique}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">Mise en place ready</span>
                          )}

                          {m.isScalable && (
                            <span className="text-slate-500 font-mono text-[9px]">
                              Base: {m.originalQuantity} @ {basePax} pax
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Commercial Batching & Food Safety Notice */}
                  {targetPax >= 40 && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-start gap-3.5 text-xs text-teal-200">
                      <ThermometerSnowflake className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h5 className="font-black uppercase tracking-wider text-teal-300 text-xs">
                          SANS 10330 Commercial Batching Advisory ({targetPax} Covers)
                        </h5>
                        <p className="text-[11px] text-teal-200/80 leading-relaxed">
                          For batches exceeding 40 covers, distribute prepared ingredients across stainless steel Gastronorm GN 1/1 pans (depth ≤100mm) to guarantee core pull-down below 4°C within 4 hours.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Larousse Masterclass Insights & Execution Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Dictionary Lexicon Entry */}
                  <div className="lg:col-span-5 space-y-8">
                    <div id="larousse-masterclass-section" className="bg-amber-100 dark:bg-amber-950/25 border-2 border-amber-900/10 dark:border-amber-500/10 p-8 sm:p-10 rounded-[3rem] shadow-xl space-y-6">
                      <div className="flex items-center gap-3 border-b border-amber-900/10 dark:border-amber-500/10 pb-4">
                        <span className="text-2xl">📖</span>
                        <div>
                          <h4 className="text-lg font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight">
                            Larousse Masterclass
                          </h4>
                          <p className="text-[9px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-none">
                            Culinary Lexicon & Mother Sauces
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        {activeRecipe.larousseInsights?.map((insight: any, i: number) => (
                          <div key={i} className="space-y-1.5 border-b border-amber-900/5 dark:border-amber-500/5 pb-4 last:border-b-0 last:pb-0">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h5 className="font-extrabold text-amber-950 dark:text-amber-200 uppercase text-sm italic">
                                {insight.term}
                              </h5>
                              {insight.motherSauceLinkage && insight.motherSauceLinkage.toLowerCase() !== 'none' && (
                                <span className="px-2 py-0.5 bg-amber-600/15 text-amber-800 dark:text-amber-400 text-[8px] font-black uppercase tracking-widest rounded-md">
                                  Lineage: {insight.motherSauceLinkage}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-amber-900/85 dark:text-slate-300 leading-relaxed italic">
                              {insight.definition}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Plated Presentation Notes */}
                    {activeRecipe.platedPresentationNotes && (
                      <div className="bg-slate-900/40 border border-white/10 p-7 rounded-[2.5rem] space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">
                          🍽️ Plated Presentation Guidelines
                        </h4>
                        <p className="text-xs text-slate-300 italic leading-relaxed opacity-85">
                          {activeRecipe.platedPresentationNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Execution Steps */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.3em]">
                        Technical Prep Steps & HACCP
                      </h4>
                      <span className="text-[11px] text-slate-500 font-bold">
                        Click step when completed
                      </span>
                    </div>

                    <div className="space-y-4">
                      {activeRecipe.steps?.map((step: any, i: number) => {
                        const isDone = !!completedSteps[step.step];
                        return (
                          <div 
                            key={i}
                            onClick={() => toggleStep(step.step)}
                            className={`p-6 rounded-3xl border transition-all cursor-pointer select-none flex gap-5 items-start ${
                              isDone 
                                ? 'bg-slate-950/20 border-emerald-500/25 text-slate-300 opacity-60' 
                                : 'bg-slate-900/50 border-white/5 text-white hover:border-white/15'
                            }`}
                          >
                            <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${
                              isDone 
                                ? 'bg-emerald-500 border-emerald-500 text-slate-950 text-xs font-black' 
                                : 'border-white/20 text-transparent'
                            }`}>
                              ✓
                            </div>
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-baseline justify-between gap-4">
                                <h5 className={`font-extrabold uppercase text-xs tracking-tight ${
                                  isDone ? 'line-through text-slate-500' : 'text-slate-100'
                                }`}>
                                  0{step.step || (i + 1)}. {step.title}
                                </h5>
                              </div>
                              <p className={`text-xs leading-relaxed ${
                                isDone ? 'line-through opacity-50 font-medium' : 'text-slate-300 font-medium'
                              }`}>
                                {step.instruction}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

export default RecipeGenerator;
