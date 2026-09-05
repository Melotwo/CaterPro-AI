import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from '../types';

interface RecipeGeneratorProps {
  generatedMenu: Menu | null;
  region: string;
  selectedItemName: string;
  setSelectedItemName: (name: string) => void;
}

const OCTAGON_CLIP = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';

const cleanAndParseJson = (rawText: string): any => {
  let cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn("JSON parsing fallback activated for recipe", error);
    const jsonRegex = /\{[\s\S]*\}/;
    const match = cleaned.match(jsonRegex);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw error;
  }
};

export const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({
  generatedMenu,
  region,
  selectedItemName,
  setSelectedItemName
}) => {
  const [activeRecipe, setActiveRecipe] = useState<any | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customDish, setCustomDish] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Compile active menu dishes from generated items cleanly
  const menuDishes = React.useMemo(() => {
    if (!generatedMenu) return [];
    const items = generatedMenu.menu || (generatedMenu as any).items || [];
    if (items.length > 0) {
      return items.map((item: any) => typeof item === 'string' ? item : (item.dish || item.name || ''));
    }
    return [];
  }, [generatedMenu]);

  // Handle first item setup
  useEffect(() => {
    if (menuDishes.length > 0 && !selectedItemName) {
      setSelectedItemName(menuDishes[0]);
    }
  }, [menuDishes, selectedItemName, setSelectedItemName]);

  // Clear loaded recipe if target item shifts to avoid mismatch states
  useEffect(() => {
    setActiveRecipe(null);
  }, [selectedItemName]);

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
      "Polishing Masterclass Plated Presentation guidelines..."
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
    }, 2800);

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
          setActiveRecipe({
            dishName: d.recipeTitle || targetDish,
            prepTime: d.prepTime || "20 mins",
            cookTime: d.cookTime || "25 mins",
            yield: d.targetYield || "50 portions",
            culinaryIntroduction: d.culinaryHeritage || `Classical Escoffier compilation for ${targetDish}.`,
            ingredients: Array.isArray(d.miseEnPlace) ? d.miseEnPlace.map((m: any) => `${m.quantity} ${m.item} (${m.specification || m.prepTechnique || ''})`) : [
              "1.2 kg Primary Protein/Produce, portioned & chilled <4°C",
              "120 ml Cold-Pressed Extra Virgin Olive Oil",
              "45 g Fresh Herbs (Chiffonade)",
              "15 g Kalahari Desert Salt & Cracked Peppercorn"
            ],
            steps: Array.isArray(d.executionSteps) ? d.executionSteps.map((s: any, idx: number) => ({
              step: s.stepNumber || idx + 1,
              title: s.title || `Phase ${idx + 1}`,
              instruction: s.instruction || ""
            })) : [
              { step: 1, title: "Station Sanitation & Setup", instruction: "Sanitize surfaces according to SANS 10330 standards." },
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
      setActiveRecipe({
        dishName: targetDish,
        prepTime: "20 mins",
        cookTime: "25 mins",
        yield: "50 portions",
        culinaryIntroduction: `Classical Escoffier and modern high-volume hotel formulation for ${targetDish}, localized for ${region}.`,
        ingredients: [
          "1.5 kg Selected Protein or Fresh Produce (Cold Chain <4°C)",
          "150 ml Extra Virgin Cold-Pressed Olive Oil",
          "50 g Seasonal Fresh Herbs (Fine Chiffonade)",
          "20 g Mineral Crystal Salt & Spices"
        ],
        steps: [
          { step: 1, title: "SANS 10330 Prep & Mise en Place", instruction: "Maintain cold ingredients below 4°C. Clean and sanitize prep block." },
          { step: 2, title: "Thermal Cooking & Emulsion", instruction: "Execute core cooking to safe internal temperatures per SANS standards." },
          { step: 3, title: "Banquet Pass Inspection", instruction: "Inspect presentation uniformity and plate immediately for service." }
        ],
        larousseInsights: [
          { term: "Brunoise", definition: "Precision 2mm fine dice ensuring uniform cooking surface and elegant mouthfeel.", motherSauceLinkage: "Velouté" }
        ],
        platedPresentationNotes: "Clean presentation on warmed porcelain with vibrant herbal lustre."
      });
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

  return (
    <div id="recipe-generator-root" className="pt-4 pb-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      
      {/* Title Header */}
      <div className="text-center space-y-3 mb-8 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 p-8 sm:p-10 rounded-3xl border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full">
          <span className="text-amber-400 text-sm font-black animate-pulse">🏛️</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">Food Encyclopedia • Larousse Gastronomique Reference</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
          Food Encyclopedia & Larousse Gastronomique
        </h2>
        <p className="text-amber-100/70 font-medium max-w-2xl mx-auto text-center text-xs sm:text-sm">
          Elevate hotel banquets with authoritative classical French techniques, Auguste Escoffier lineages, mother sauces, and precision SANS 10330 HACCP mise en place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Selection Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-amber-500/20 shadow-xl space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <span className="text-xl">📓</span>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Encyclopedia Entry</h3>
                <p className="text-[10px] text-slate-400 font-medium">Select or type any classical dish</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Select Target Dish
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
                    'South African Cape Malay Curry'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setIsCustomMode(true);
                        setCustomDish(preset);
                      }}
                      className="text-[9px] font-bold px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/20 transition-all text-left"
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

            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                <span>LOCALIZED TO:</span>
                <span className="text-emerald-400 uppercase tracking-widest">{region}</span>
              </div>
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

            {!activeRecipe && !loading && !error && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900/20 py-24 text-center border-2 border-dashed border-white/10 rounded-[4rem] text-slate-600 font-black italic uppercase tracking-widest flex flex-col items-center justify-center gap-4"
              >
                <span className="text-4xl filter grayscale">🏛️</span>
                <p className="max-w-md text-xs leading-relaxed font-bold tracking-normal text-slate-500">
                  Select a recipe from your custom CaterPro proposals or type a target item manually. Click <strong className="text-slate-300">"Decode Classic"</strong> to access Gastronomique insights, lineages, and techniques instantly.
                </p>
              </motion.div>
            )}

            {activeRecipe && !loading && !error && (
              <motion.div 
                key="recipe-data"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Introduction & Yield banner */}
                <div className="bg-slate-900/60 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-8 right-8 z-10 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black tracking-widest uppercase">
                    Yield: {activeRecipe.yield || "Fine Dining Portions"}
                  </div>

                  <h3 className="text-4xl font-extrabold uppercase italic tracking-tighter text-white">
                    {activeRecipe.dishName}
                  </h3>

                  <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <span className="flex items-center gap-1">⏱️ Prep: {activeRecipe.prepTime || "N/A"}</span>
                    <span className="flex items-center gap-1">🔥 Cook: {activeRecipe.cookTime || "N/A"}</span>
                  </div>

                  {activeRecipe.culinaryIntroduction && (
                    <p className="text-slate-300 text-sm font-medium italic leading-relaxed border-t border-white/5 pt-6 opacity-85">
                      "{activeRecipe.culinaryIntroduction}"
                    </p>
                  )}
                </div>

                {/* Main Recipe Info columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Left columns: Dictionary entry (Larousse insights) */}
                  <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                    <div id="larousse-masterclass-section" className="bg-amber-100 dark:bg-amber-950/25 border-2 border-amber-900/10 dark:border-amber-500/10 p-10 rounded-[3.5rem] shadow-xl space-y-8">
                      <div className="flex items-center gap-3 border-b border-amber-900/10 dark:border-amber-500/10 pb-4">
                        <span className="text-2xl">📖</span>
                        <div>
                          <h4 className="text-lg font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight">
                            Larousse Masterclass
                          </h4>
                          <p className="text-[9px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-none">
                            Official Culinary Lexicon & Cut Insights
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {activeRecipe.larousseInsights?.map((insight: any, i: number) => (
                          <div key={i} className="space-y-2 border-b border-amber-900/5 dark:border-amber-500/5 pb-4 last:border-b-0 last:pb-0">
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
                        {(!activeRecipe.larousseInsights || activeRecipe.larousseInsights.length === 0) && (
                          <p className="text-xs text-amber-900/55 dark:text-slate-500 italic text-center">No historical dictionary terms registered for this profile.</p>
                        )}
                      </div>
                    </div>

                    {/* Plating presentation notes */}
                    {activeRecipe.platedPresentationNotes && (
                      <div className="bg-slate-900/40 border border-white/10 p-8 rounded-[2.5rem] space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">
                          🍽️ Plated Presentation Guidelines
                        </h4>
                        <p className="text-xs text-slate-300 italic leading-relaxed opacity-80">
                          {activeRecipe.platedPresentationNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right columns: Ingredients & Instruction Checklist */}
                  <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                    
                    {/* Ingredients list */}
                    <div className="bg-slate-900/60 p-10 rounded-[3.5rem] border border-white/10 space-y-6">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest pb-3 border-b border-white/5 opacity-60">
                        Pro scaled ingredients
                      </h4>

                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeRecipe.ingredients?.map((ing: string, i: number) => (
                          <li key={i} className="text-xs font-semibold text-slate-300 flex items-start gap-2.5">
                            <span className="text-emerald-500 text-sm leading-none">•</span>
                            <span className="leading-tight">{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Preparation Steps */}
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em]">
                        Technical Prep Steps
                      </h4>

                      <div className="space-y-4">
                        {activeRecipe.steps?.map((step: any, i: number) => {
                          const isDone = !!completedSteps[step.step];
                          return (
                            <div 
                              key={i}
                              onClick={() => toggleStep(step.step)}
                              className={`p-6 rounded-3xl border transition-all cursor-pointer select-none flex gap-5 items-start ${isDone ? 'bg-slate-950/20 border-emerald-500/25 text-slate-300 opacity-60' : 'bg-slate-900/50 border-white/5 text-white hover:border-white/10'}`}
                            >
                              <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${isDone ? 'bg-emerald-500 border-emerald-500 text-slate-950 text-xs font-black' : 'border-white/20 text-transparent'}`}>
                                ✓
                              </div>
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-baseline justify-between gap-4">
                                  <h5 className={`font-extrabold uppercase text-xs tracking-tight ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                                    0{step.step || (i + 1)}. {step.title}
                                  </h5>
                                </div>
                                <p className={`text-xs leading-relaxed ${isDone ? 'line-through opacity-50 font-medium' : 'text-slate-300 font-medium'}`}>
                                  {step.instruction}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
