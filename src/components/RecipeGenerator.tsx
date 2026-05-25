import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { getApiKey } from '../services/geminiService';
import { Menu } from '../types';

interface RecipeGeneratorViewProps {
  generatedMenu: Menu | null;
  activeRecipe: any | null;
  setActiveRecipe: (recipe: any | null) => void;
  region: string;
  setView: (view: string) => void;
}

const OCTAGON_CLIP = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';

// Helper function to clean and parse JSON
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

export const RecipeGeneratorView: React.FC<RecipeGeneratorViewProps> = ({
  generatedMenu,
  activeRecipe,
  setActiveRecipe,
  region,
  setView
}) => {
  const [selectedDish, setSelectedDish] = useState('');
  const [customDish, setCustomDish] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Dynamic menu item compiler
  const menuDishes = React.useMemo(() => {
    if (!generatedMenu) return [];
    const items = generatedMenu.menu || (generatedMenu as any).items || [];
    if (items.length > 0) {
      return items.map((item: any) => typeof item === 'string' ? item : (item.dish || item.name || ''));
    }
    return [];
  }, [generatedMenu]);

  // Set default selection if menu dishes exist
  useEffect(() => {
    if (menuDishes.length > 0 && !selectedDish) {
      setSelectedDish(menuDishes[0]);
    }
  }, [menuDishes]);

  const generateRecipe = async () => {
    const targetDish = selectedDish === 'custom' ? customDish : selectedDish;
    if (!targetDish || targetDish.trim() === '') {
      setError('Please select or write a dish name to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setCompletedSteps({});

    // Chef milestone progress updates to engage users
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
      const apiKey = getApiKey();
      if (!apiKey || apiKey.trim() === '') {
        throw new Error("VITE_GEMINI_API_KEY is not configured inside system or env secrets.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You must act as a digital mirror of the Larousse Gastronomique Encyclopedia.
You are generating a professional, high-end production recipe layout and technical culinary notes for the dish "${targetDish}".
The chef is localizing operations in the target region: "${region}".

Along with the standard preparation instructions, provide a dedicated JSON array field named 'larousseInsights' detailing the classical French culinary techniques, mother sauce lineages, or technical dictionary terms applicable to this specific dish profile.

Format the response strictly as a JSON object matching this schema. Provide no other conversation or markdown wrappers around JSON:
{
  "dishName": "string",
  "prepTime": "string",
  "cookTime": "string",
  "yield": "string description (e.g., 50 portions)",
  "culinaryIntroduction": "A classical historical, technical, or traditional introduction to this dish profile from the Larousse perspective.",
  "ingredients": [
    "string depicting ingredients with scaled quantities for upscale food service"
  ],
  "steps": [
    {
      "step": number,
      "title": "string (e.g., Blanching the protein, Reduction stage)",
      "instruction": "string detailing exact execution instructions"
    }
  ],
  "larousseInsights": [
    {
      "term": "string (e.g., Brunoise, Emulsion, Roux, Espagnole, Chiffonade, Monopolize, Deglaze)",
      "definition": "string explaining how the term applies to this specific dish and its classical French context",
      "motherSauceLinkage": "string (e.g. Allemande, Béchamel, Velouté, Espagnole, Tomate, Hollandaise, or None)"
    }
  ],
  "platedPresentationNotes": "string detailing precise, highly disciplined classical presentation guidelines for a plated banquet"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      if (!responseText.trim()) {
        throw new Error("The Larousse Engine returned an empty response. Please verify your query structure.");
      }

      const parsedRecipe = cleanAndParseJson(responseText);
      setActiveRecipe(parsedRecipe);
    } catch (err: any) {
      console.error("Larousse recipe compilation failed:", err);
      setError(err.message || 'Classical recipe generation failed.');
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
    <div id="recipe-generator-root" className="pt-40 pb-20 max-w-7xl mx-auto px-6 space-y-12">
      
      {/* Title Header */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/15 border border-emerald-500/25 rounded-full">
          <span className="text-emerald-400 text-sm font-black animate-pulse">🏛️</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Classical Knowledge Library</span>
        </div>
        <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
          Larousse Gastronomique Engine
        </h2>
        <p className="text-slate-400 font-medium italic opacity-60 max-w-xl mx-auto">
          Elevate banquets with verified classical techniques, mother sauce structures, and timeless culinary discipline of French gastronomes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        
        {/* Selection / Parameters Sidebar Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-xl space-y-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <span className="text-2xl">📓</span>
              <h3 className="text-lg font-black text-white uppercase tracking-tighter">Banquet Scribe</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">
                  Select Target Dish
                </label>
                
                <select
                  id="larousse-dish-selector"
                  value={selectedDish}
                  onChange={(e) => {
                    setSelectedDish(e.target.value);
                    if (e.target.value !== 'custom') {
                      setCustomDish('');
                    }
                  }}
                  className="w-full p-4 rounded-xl bg-slate-800 text-white font-extrabold outline-none border border-white/10 text-xs focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {menuDishes.map((dish: string, idx: number) => (
                    <option key={idx} value={dish}>{dish}</option>
                  ))}
                  <option value="custom">-- Custom Reference --</option>
                </select>
              </div>

              {selectedDish === 'custom' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-3"
                >
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">
                    Write Classical Dish Profile
                  </label>
                  <input
                    type="text"
                    value={customDish}
                    onChange={(e) => setCustomDish(e.target.value)}
                    placeholder="e.g. Sole Meunière, Coq au Vin"
                    className="w-full p-4 rounded-xl bg-slate-800 text-white font-extrabold outline-none border border-white/10 text-xs focus:border-emerald-500 transition-all"
                  />
                </motion.div>
              )}

              <button
                onClick={generateRecipe}
                disabled={loading}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-wider transition-all shadow-xl disabled:opacity-45 flex items-center justify-center gap-2"
                style={{ clipPath: OCTAGON_CLIP }}
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
          
          <button 
            onClick={() => setView('dashboard')} 
            className="w-full py-5 bg-slate-900/40 border border-white/10 text-slate-400 hover:text-white rounded-[2rem] font-black uppercase text-xs transition-all"
            style={{ clipPath: OCTAGON_CLIP }}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Recipe Display / Masterclass View Panel */}
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
                  <div className="lg:col-span-5 space-y-8">
                    <div id="larousse-masterclass-section" className="bg-amber-100 dark:bg-amber-950/25 border-2 border-amber-900/10 dark:border-amber-500/10 p-10 rounded-[3.5rem] shadow-xl space-y-8">
                      <div className="flex items-center gap-3 border-b border-amber-900/10 dark:border-amber-500/10 pb-4">
                        <span className="text-2xl">📖</span>
                        <div>
                          <h4 className="text-lg font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight">
                            Larousse Notes
                          </h4>
                          <p className="text-[9px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-none">
                            Official Culinary Lexicon
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
                          <p className="text-xs text-amber-900/55 dark:text-slate-500 italic">No historical dictionary terms registered for this profile.</p>
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
                  <div className="lg:col-span-7 space-y-8">
                    
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

export default RecipeGeneratorView;
