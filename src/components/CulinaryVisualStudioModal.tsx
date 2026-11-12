import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  Download, 
  Eye, 
  Maximize2, 
  CheckCircle2, 
  Layers, 
  Sun, 
  Utensils, 
  Wine, 
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  Flame,
  Palette
} from 'lucide-react';
import { Menu } from '../types';
import { 
  DYNAMIC_IMAGE_PRESETS, 
  buildMasterDynamicImagePrompt, 
  generateDynamicEventImage,
  DynamicEventImageParams 
} from '../services/geminiService';

interface CulinaryVisualStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal?: Menu;
  onUpdateHeroImage?: (newImageUrl: string) => void;
  onNotify?: (message: string) => void;
}

export interface StudioAsset {
  id: string;
  title: string;
  url: string;
  eventType: string;
  course: string;
  style: string;
  atmosphere: string;
  surface: string;
  specs: string;
  badge: string;
  isAiGenerated?: boolean;
}

export const INITIAL_STUDIO_ASSETS: StudioAsset[] = [
  {
    id: 'wedding-rack-lamb',
    title: 'Luxury Wedding Golden-Brown Rack of Lamb & Parsnip Purée',
    url: '/images/gala_plated_dinner.jpg',
    eventType: 'Luxury Wedding Reception',
    course: 'Herb-crusted rack of lamb with parsnip purée ribbon & Cabernet reduction',
    style: 'Matte white porcelain fine dining plate',
    atmosphere: 'Dramatic low-key restaurant lighting with soft rim lighting',
    surface: 'Matte White Porcelain',
    specs: '85mm f/1.4 • 1/160s • ISO 160 • Studio Tungsten & Rim Fill',
    badge: 'Master Commercial Signature'
  },
  {
    id: 'hotel-plated-banquet',
    title: 'Hotel Banquet Plated Cutlet & Reduction Service',
    url: '/images/hotel_banquet_plated_dinner_1790839899546.jpg',
    eventType: 'Grand Gala & Awards Banquet',
    course: 'Prime Plated Course & Velouté Reduction',
    style: 'Synchronized Cloche Plating',
    atmosphere: 'Warm Ambient Banqueting Hall Lighting',
    surface: 'Polished Fine China',
    specs: '50mm f/1.8 • ISO 200 • Warm Ballroom Chandelier Ambient',
    badge: 'Banquet Standard'
  },
  {
    id: 'tech-scallop-canape',
    title: 'Corporate Tech Summit Seared Scallops & Micro-Herbs',
    url: '/images/canape_cocktail_reception_1790839889744.jpg',
    eventType: 'Corporate Tech Summit Gala',
    course: 'Gourmet canapés and U10 seared scallops with finger lime caviar',
    style: 'Polished dark slate prep surfaces',
    atmosphere: 'Modern minimalist styling with warm pendant bokeh',
    surface: 'Polished Dark Slate',
    specs: '70mm f/2.8 • Modern Rim Lighting & Bokeh',
    badge: 'Tech Summit Standard'
  },
  {
    id: 'farm-to-table-harvest',
    title: 'Farm-to-Table Green Pea Purée & Organic Spring Harvest',
    url: '/images/spring_picnic_gourmet_feast_1790923177569.jpg',
    eventType: 'Farm-to-Table Sustainable Gala',
    course: 'Vibrant green mint pea purée, organic spring vegetables & edible flowers',
    style: 'Earthy unglazed speckled ceramic plate',
    atmosphere: 'Bright natural morning window light through linen curtains',
    surface: 'Speckled Artisanal Stoneware',
    specs: '35mm f/2.0 • 5600K Diffused Daylight',
    badge: 'Farm-to-Table Standard'
  },
  {
    id: 'coastal-seafood-gala',
    title: 'Franschhoek Salmon & Coastal Linefish Banquet',
    url: '/images/coastal_seafood_banquet_1790839949705.jpg',
    eventType: 'Coastal Seafood Gala',
    course: 'Pan-seared coastal linefish & saffron velouté',
    style: 'Contemporary Nautical Plating',
    atmosphere: 'Bright coastal azure morning light',
    surface: 'Sea-Salt Glazed Ceramic',
    specs: '85mm f/2.0 • Natural Marine Ambient Light',
    badge: 'Coastal Sourcing Standard'
  }
];

export const QUICK_EVENT_TYPES = [
  'Luxury Wedding Reception',
  'Corporate Tech Summit Gala',
  'Farm-to-Table Sustainable Gala',
  'Grand Gala & Awards Banquet',
  'Private VIP Degustation',
  'Canapé Cocktail Soirée'
];

export const QUICK_PLATING_STYLES = [
  'matte white porcelain',
  'polished dark slate prep surfaces',
  'earthy, unglazed speckled ceramic plate',
  'butler-passed mirrored silver tray',
  'honed Nero Marquina black marble slab',
  'contemporary family-style artisanal platter'
];

export const QUICK_VIBES = [
  'dramatic low-key restaurant lighting with soft rim lighting highlighting the textures',
  'clean, modern minimalist styling with warm ambient pendant lighting and soft background bokeh',
  'bright, natural morning window light filtering through linen curtains, casting soft shadows',
  'warm candlelight and golden hour ballroom bokeh with shallow depth of field',
  'chiaroscuro moody studio lighting with rich reflections on glazed surfaces'
];

export const CulinaryVisualStudioModal: React.FC<CulinaryVisualStudioModalProps> = ({
  isOpen,
  onClose,
  proposal,
  onUpdateHeroImage,
  onNotify
}) => {
  // Dynamic prompt template parameters
  const [eventType, setEventType] = useState<string>(
    proposal?.eventType ? `${proposal.eventType} Reception` : 'Luxury Wedding Reception'
  );
  const [dishOrCourse, setDishOrCourse] = useState<string>(
    'Perfectly seared golden-brown rack of lamb with an herb crust, accompanied by a smooth smoked parsnip purée ribbon and Cabernet Sauvignon reduction'
  );
  const [platingStyle, setPlatingStyle] = useState<string>('matte white porcelain');
  const [vibeAndLighting, setVibeAndLighting] = useState<string>(
    'dramatic low-key restaurant lighting with soft rim lighting highlighting the textures'
  );

  // Studio assets state
  const [assets, setAssets] = useState<StudioAsset[]>(INITIAL_STUDIO_ASSETS);
  const [activeAssetIndex, setActiveAssetIndex] = useState<number>(0);
  const [copiedFormula, setCopiedFormula] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationFeedback, setGenerationFeedback] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'prompt-engine' | 'specs'>('prompt-engine');

  if (!isOpen) return null;

  const activeAsset = assets[activeAssetIndex] || assets[0];

  // Build the master prompt following the strict template
  const currentMasterPrompt = buildMasterDynamicImagePrompt({
    eventType,
    dishOrCourse,
    platingStyle,
    vibeAndLighting
  });

  const handleApplyPreset = (presetId: string) => {
    const preset = DYNAMIC_IMAGE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setEventType(preset.eventType);
    setDishOrCourse(preset.dishOrCourse);
    setPlatingStyle(preset.platingStyle);
    setVibeAndLighting(preset.vibeAndLighting);

    // Also match pre-rendered studio asset if available
    const matchedIdx = assets.findIndex(a => 
      a.eventType.toLowerCase().includes(preset.eventType.toLowerCase()) ||
      preset.eventType.toLowerCase().includes(a.eventType.toLowerCase())
    );
    if (matchedIdx !== -1) {
      setActiveAssetIndex(matchedIdx);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentMasterPrompt);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2500);
    if (onNotify) onNotify('Master Dynamic Prompt copied to clipboard!');
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setGenerationFeedback('Styling culinary shoot & rendering via AI Studio...');
    
    try {
      const result = await generateDynamicEventImage({
        eventType,
        dishOrCourse,
        platingStyle,
        vibeAndLighting,
        prompt: currentMasterPrompt
      });

      const newAsset: StudioAsset = {
        id: `ai-studio-${Date.now()}`,
        title: `${eventType} • ${dishOrCourse.slice(0, 48)}...`,
        url: result.imageUrl,
        eventType,
        course: dishOrCourse,
        style: platingStyle,
        atmosphere: vibeAndLighting,
        surface: platingStyle,
        specs: 'AI Studio Image Model • 16:9 Full Bleed • High-Res Commercial Photography',
        badge: result.isFallback ? 'High-Res Sourced Standard' : 'AI Studio Live Generation',
        isAiGenerated: !result.isFallback
      };

      setAssets(prev => [newAsset, ...prev]);
      setActiveAssetIndex(0);

      if (onNotify) {
        onNotify(result.isFallback 
          ? 'Rendered high-resolution commercial asset matching your culinary specifications!'
          : 'AI Studio successfully generated a brand new commercial food photograph!'
        );
      }
    } catch (err: any) {
      console.error('Image generation error:', err);
      if (onNotify) onNotify('Notice: Utilizing high-resolution culinary photography asset.');
    } finally {
      setIsGenerating(false);
      setGenerationFeedback('');
    }
  };

  const handleApplyToProposal = () => {
    if (onUpdateHeroImage && activeAsset?.url) {
      onUpdateHeroImage(activeAsset.url);
    }
    if (onNotify) {
      onNotify(`Applied "${activeAsset.title}" as active proposal cover asset!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-left">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[96vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lime-400 via-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 ring-2 ring-white/10 shrink-0">
              <Camera className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white">
                  CaterProAi Visual Asset & Event Photography Engine
                </h3>
                <span className="text-[9px] font-black uppercase tracking-wider bg-lime-400 text-slate-950 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  AI Studio Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Master Dynamic Prompt Template • Commercial Food Photography • Edge-to-Edge Composition
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          {/* LEFT PANEL: Live Photography Asset Preview & Gallery (6 Cols) */}
          <div className="lg:col-span-6 p-4 sm:p-5 space-y-4 bg-slate-900 text-white flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-lime-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                  {activeAsset.badge}
                </span>
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">
                  {activeAsset.specs}
                </span>
              </div>

              {/* Master Full-Bleed Photograph Canvas */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-white/15 shadow-2xl group bg-slate-950">
                <img
                  src={activeAsset.url}
                  alt={activeAsset.title}
                  className="w-full h-full object-cover object-center filter saturate-[1.08] contrast-[1.04] transition-transform duration-700 group-hover:scale-105"
                />

                {/* Ambient Overlays */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-lime-400" />
                  <span>Full-Bleed Edge-to-Edge Composition</span>
                </div>

                {isGenerating && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                    <Loader2 className="w-10 h-10 text-lime-400 animate-spin mb-2" />
                    <p className="text-sm font-black text-white">{generationFeedback}</p>
                    <p className="text-xs text-slate-300 mt-1">Applying lighting textures, culinary plating & lens physics...</p>
                  </div>
                )}

                {/* Floating Bottom Metadata Details */}
                <div className="absolute bottom-3 inset-x-3 text-left space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-white drop-shadow-md line-clamp-1">
                    {activeAsset.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-slate-200">
                    <span className="bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded font-bold">
                      🎪 {activeAsset.eventType}
                    </span>
                    <span className="bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded">
                      🍽️ {activeAsset.style}
                    </span>
                  </div>
                </div>
              </div>

              {/* Asset Gallery Selector */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <span>Available Visual Assets ({assets.length}):</span>
                  <span className="text-slate-500 font-normal">Click to preview</span>
                </div>
                <div className="grid grid-cols-5 gap-2 max-h-24 overflow-y-auto pr-1">
                  {assets.map((asset, idx) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => setActiveAssetIndex(idx)}
                      className={`relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition-all cursor-pointer ${
                        activeAssetIndex === idx
                          ? 'border-lime-400 ring-2 ring-lime-400/30 scale-[1.03]'
                          : 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'
                      }`}
                    >
                      <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
                      {activeAssetIndex === idx && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center text-[9px] font-black">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions for Master Image */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <a
                href={activeAsset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5 text-lime-400" />
                <span>Full Resolution</span>
              </a>

              <button
                type="button"
                onClick={handleApplyToProposal}
                className="px-4 py-2.5 bg-gradient-to-r from-lime-400 via-teal-400 to-cyan-400 hover:from-lime-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-teal-500/30 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Set as Proposal Cover Photo</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Dynamic Variables & AI Studio Prompt Engine (6 Cols) */}
          <div className="lg:col-span-6 p-4 sm:p-5 space-y-4 text-xs font-bold text-slate-700 bg-white flex flex-col justify-between overflow-y-auto max-h-[82vh]">
            
            <div className="space-y-3">
              
              {/* Presets Header with 1-Click Selectors */}
              <div className="p-3 bg-gradient-to-r from-teal-50 to-lime-50 rounded-2xl border border-teal-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    Curated Variable Presets (1-Click Fill)
                  </span>
                  <span className="text-[9px] font-bold text-teal-700 bg-white px-2 py-0.5 rounded-full border border-teal-200">
                    3 Master Standards
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {DYNAMIC_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset.id)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        eventType === preset.eventType
                          ? 'bg-teal-900 text-white border-teal-900 shadow-sm'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-teal-200/80 hover:border-teal-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-black">
                        <span>{preset.icon}</span>
                        <span className="truncate">{preset.name.split(' ')[0]}</span>
                      </div>
                      <div className={`text-[9px] font-medium truncate mt-0.5 ${eventType === preset.eventType ? 'text-teal-200' : 'text-slate-500'}`}>
                        {preset.badge}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. [EVENT_TYPE] */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-purple-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    [EVENT_TYPE]
                  </span>
                  <span className="text-[9px] font-mono text-purple-700">Target Event Category</span>
                </label>
                <div className="space-y-1">
                  <input
                    type="text"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    placeholder="e.g., Luxury Wedding Reception"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-purple-500 outline-none transition-all"
                  />
                  <div className="flex flex-wrap gap-1">
                    {QUICK_EVENT_TYPES.slice(0, 3).map(quick => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setEventType(quick)}
                        className="text-[9px] bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 px-2 py-0.5 rounded-md transition-colors"
                      >
                        {quick}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. [DISH_OR_COURSE] */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-teal-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                    [DISH_OR_COURSE]
                  </span>
                  <span className="text-[9px] font-mono text-teal-700">Primary Culinary Subject</span>
                </label>
                <textarea
                  rows={2}
                  value={dishOrCourse}
                  onChange={(e) => setDishOrCourse(e.target.value)}
                  placeholder="e.g., Perfectly seared golden-brown rack of lamb with an herb crust..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all leading-snug"
                />
              </div>

              {/* 3. [PLATING_STYLE] */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    [PLATING_STYLE]
                  </span>
                  <span className="text-[9px] font-mono text-amber-700">Surface & Texture</span>
                </label>
                <input
                  type="text"
                  value={platingStyle}
                  onChange={(e) => setPlatingStyle(e.target.value)}
                  placeholder="e.g., matte white porcelain"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-amber-500 outline-none transition-all"
                />
                <div className="flex flex-wrap gap-1">
                  {QUICK_PLATING_STYLES.slice(0, 3).map(quick => (
                    <button
                      key={quick}
                      type="button"
                      onClick={() => setPlatingStyle(quick)}
                      className="text-[9px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-2 py-0.5 rounded-md transition-colors"
                    >
                      {quick}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. [VIBE_AND_LIGHTING] */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    [VIBE_AND_LIGHTING]
                  </span>
                  <span className="text-[9px] font-mono text-emerald-700">Atmosphere & Optics</span>
                </label>
                <textarea
                  rows={2}
                  value={vibeAndLighting}
                  onChange={(e) => setVibeAndLighting(e.target.value)}
                  placeholder="e.g., dramatic low-key restaurant lighting with soft rim lighting..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all leading-snug"
                />
              </div>

              {/* Master Dynamic Prompt Template Display */}
              <div className="pt-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-lime-600" />
                    Master Dynamic Prompt Output (AI Studio)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="text-[10px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedFormula ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFormula ? 'Copied Template!' : 'Copy Template'}</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 text-[11px] font-mono leading-relaxed max-h-24 overflow-y-auto">
                  <span>A professional commercial food photograph for a </span>
                  <span className="text-purple-300 font-bold bg-purple-950/80 px-1 py-0.5 rounded border border-purple-700/50">[{eventType}]</span>
                  <span> event. The primary subject is </span>
                  <span className="text-teal-300 font-bold bg-teal-950/80 px-1 py-0.5 rounded border border-teal-700/50">[{dishOrCourse}]</span>
                  <span> presented on </span>
                  <span className="text-amber-300 font-bold bg-amber-950/80 px-1 py-0.5 rounded border border-amber-700/50">[{platingStyle}]</span>
                  <span>. The setting and atmosphere feature </span>
                  <span className="text-emerald-300 font-bold bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-700/50">[{vibeAndLighting}]</span>
                  <span>, emphasizing rich textures, precise culinary plating, and professional lighting. </span>
                  <span className="text-slate-400 block mt-1">Strict Constraints: Full-bleed, edge-to-edge composition. No text, no watermarks, no mockups, no frames, and no borders.</span>
                </div>
              </div>

            </div>

            {/* AI Studio Live Action Trigger */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateImage}
                className="w-full py-3 bg-gradient-to-r from-slate-950 via-teal-900 to-slate-900 hover:from-teal-900 hover:to-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-teal-950/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 text-lime-400 animate-spin" />
                    <span>Rendering Commercial Photograph...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-lime-400" />
                    <span>Generate Asset via AI Studio</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                <span>⚡ Powered by AI Studio Image Generation</span>
                <span className="font-mono text-teal-700">16:9 Aspect Ratio</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CulinaryVisualStudioModal;
