import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  Download, 
  Sliders, 
  Eye, 
  Maximize2, 
  CheckCircle2, 
  Layers, 
  Sun, 
  Utensils, 
  Wine, 
  Image as ImageIcon 
} from 'lucide-react';
import { Menu } from '../types';

interface CulinaryVisualStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal?: Menu;
  onUpdateHeroImage?: (newImageUrl: string) => void;
  onNotify?: (message: string) => void;
}

export const EVENT_TYPES = [
  { id: 'wedding', label: 'Luxury Wedding Reception', mood: 'Romantic golden glow, soft floral backdrop, fairy light bokeh' },
  { id: 'banquet', label: 'Grand Gala & Awards Banquet', mood: 'Warm candlelight ballroom bokeh, silver cloche staging, luxury dinner setting' },
  { id: 'corporate', label: 'Corporate & Tech Summit', mood: 'Sharp crisp modern rim lighting, sleek contemporary tableware' },
  { id: 'vip-dinner', label: 'Private VIP Degustation', mood: 'Intimate low-key moody studio lighting, dramatic directional highlights' },
  { id: 'cocktail', label: 'Canapé Cocktail Soirée', mood: 'Effervescent lounge lighting, sparkling glassware, butler-passed silver trays' },
  { id: 'farm-to-table', label: 'Artisanal Farm-to-Table', mood: 'Bright natural window sunlight, rustic organic textures, vineyard view' }
];

export const PRIMARY_SUBJECTS = [
  { id: 'lamb-risotto', label: 'Herb-Crusted Karoo Lamb & Truffle Risotto', course: 'Main Course Plated', desc: 'Seared lamb cutlets on creamy wild truffle risotto with baby heirloom carrots & rosemary jus' },
  { id: 'seafood-kingklip', label: 'Pan-Seared Linefish & Wild Scallops', course: 'Coastal Seafood Plated', desc: 'Crisp-skin Cape kingklip, seared scallops, saffron velouté, and samphire greens' },
  { id: 'beef-fillet', label: 'Dry-Aged Beef Fillet with Marrow Glaze', course: 'Prime Red Meat Plated', desc: 'Center-cut beef fillet medallion, roasted shallot purée, pomme purée, and bordelaise reduction' },
  { id: 'canape-passed', label: 'Butler-Passed Smoked Salmon & Caviar Canapés', course: 'Appetizers & Bites', desc: 'Delicate brioche rounds with cold-smoked trout ribbons, chive crème fraîche, and lumpfish caviar' },
  { id: 'dessert-torte', label: 'Belgian Chocolate Torte & Cape Citrus Sorbet', course: 'Dessert Grand Finale', desc: 'Decadent dark chocolate ganache torte with candied kumquats and fynbos citrus sorbet shooter' }
];

export const PRESENTATION_STYLES = [
  { id: 'michelin-plated', label: 'Michelin-Star Plated Fine Dining', tag: 'Architectural & pristine' },
  { id: 'butler-silver', label: 'Butler-Passed Mirrored Silver Tray', tag: 'High-end reception' },
  { id: 'family-style', label: 'Contemporary Family-Style Platter', tag: 'Generous artisanal sharing' },
  { id: 'action-station', label: 'Live Chef Carving & Torching Station', tag: 'Culinary theater & smoke' },
  { id: 'tasting-flight', label: 'Multi-Course Degustation Flight', tag: 'Curated micro-portions' }
];

export const ATMOSPHERE_LIGHTING = [
  { id: 'candlelight-warm', label: 'Candlelight & Golden Hour Ballroom Bokeh', spec: '85mm f/1.4, 3200K, soft ambient glow' },
  { id: 'crisp-rim', label: 'Modern Architectural Rim Lighting', spec: '50mm f/1.8, 5000K, directional key light' },
  { id: 'natural-window', label: 'Bright Diffused Natural Sunlight', spec: '35mm f/2.0, 5600K, soft bounce fill' },
  { id: 'moody-low-key', label: 'Chiaroscuro Low-Key Moody Drama', spec: '90mm Macro f/2.8, deep shadows, glossy glazes' }
];

export const SURFACE_TEXTURES = [
  { id: 'charcoal-stoneware', label: 'Artisanal Charcoal Stoneware Ceramic', spec: 'Matte dark tactile plate with organic rim' },
  { id: 'limoges-porcelain', label: 'Polished Limoges White Fine Bone China', spec: 'Ultra-smooth reflective luxury rim' },
  { id: 'reclaimed-oak', label: 'Aged French Reclaimed Oak & Washed Linen', spec: 'Warm woodgrain grain and woven textile' },
  { id: 'nero-marble', label: 'Honed Nero Marquina Black Marble', spec: 'Subtle white veining and cool mineral surface' }
];

export const PREVIEW_ASSETS = [
  {
    id: 'gala-lamb-hero',
    title: 'Gala Banquet Herb-Crusted Lamb Cutlets & Truffle Risotto',
    url: '/images/gala_plated_dinner.jpg',
    eventType: 'Grand Gala & Awards Banquet',
    course: 'Main Course Plated',
    style: 'Michelin-Star Plated Fine Dining',
    atmosphere: 'Candlelight & Golden Hour Ballroom Bokeh',
    surface: 'Artisanal Charcoal Stoneware Ceramic',
    specs: '85mm f/1.4 • 1/160s • ISO 160 • Studio Tungsten & Candlelight Fill',
    badge: 'Freshly Rendered Master Asset'
  },
  {
    id: 'hotel-plated-alt',
    title: 'Hotel Banquet Plated Cutlet & Reduction Service',
    url: '/images/hotel_banquet_plated_dinner_1790839899546.jpg',
    eventType: 'Luxury Wedding Reception',
    course: 'Prime Plated Course',
    style: 'Synchronized Cloche Plating',
    atmosphere: 'Warm Ambient Banqueting Hall',
    surface: 'Polished Fine China',
    specs: '50mm f/1.8 • ISO 200 • Warm Ballroom Chandelier Ambient',
    badge: 'Executive Suite Standard'
  },
  {
    id: 'canape-reception',
    title: 'Butler-Passed Luxury Canapés & Cocktail Reception',
    url: '/images/canape_cocktail_reception_1790839889744.jpg',
    eventType: 'Canapé Cocktail Soirée',
    course: 'Butler-Passed Hors d\'oeuvres',
    style: 'Butler-Passed Mirrored Silver Tray',
    atmosphere: 'Sparkling Cocktail Lounge Lighting',
    surface: 'Brushed Silver Catering Salver',
    specs: '70mm f/2.8 • Handheld Reception Flash with Diffuser',
    badge: 'Cocktail & Welcome Standard'
  },
  {
    id: 'coastal-seafood',
    title: 'Franschhoek Salmon & Coastal Linefish Banquet',
    url: '/images/coastal_seafood_banquet_1790839949705.jpg',
    eventType: 'Seafood Gala & Coastal Banquet',
    course: 'Coastal Seafood Plated',
    style: 'Contemporary Nautical Plating',
    atmosphere: 'Bright Coastal Azure Lighting',
    surface: 'Sea-Salt Glazed Ceramic',
    specs: '85mm f/2.0 • Natural Sea-Mist Ambient Light',
    badge: 'Coastal Sourcing Standard'
  }
];

export const CulinaryVisualStudioModal: React.FC<CulinaryVisualStudioModalProps> = ({
  isOpen,
  onClose,
  proposal,
  onUpdateHeroImage,
  onNotify
}) => {
  const [selectedEventType, setSelectedEventType] = useState(EVENT_TYPES[1].id);
  const [selectedSubject, setSelectedSubject] = useState(PRIMARY_SUBJECTS[0].id);
  const [selectedStyle, setSelectedStyle] = useState(PRESENTATION_STYLES[0].id);
  const [selectedAtmosphere, setSelectedAtmosphere] = useState(ATMOSPHERE_LIGHTING[0].id);
  const [selectedSurface, setSelectedSurface] = useState(SURFACE_TEXTURES[0].id);
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [copiedFormula, setCopiedFormula] = useState(false);

  if (!isOpen) return null;

  const activeAsset = PREVIEW_ASSETS[activeAssetIndex] || PREVIEW_ASSETS[0];

  const currentEventTypeObj = EVENT_TYPES.find(e => e.id === selectedEventType) || EVENT_TYPES[0];
  const currentSubjectObj = PRIMARY_SUBJECTS.find(s => s.id === selectedSubject) || PRIMARY_SUBJECTS[0];
  const currentStyleObj = PRESENTATION_STYLES.find(s => s.id === selectedStyle) || PRESENTATION_STYLES[0];
  const currentAtmoObj = ATMOSPHERE_LIGHTING.find(a => a.id === selectedAtmosphere) || ATMOSPHERE_LIGHTING[0];
  const currentSurfaceObj = SURFACE_TEXTURES.find(s => s.id === selectedSurface) || SURFACE_TEXTURES[0];

  // Generated styling prompt formula following CaterProAI's photography constitution
  const promptFormula = `Commercial editorial food photography: ${currentSubjectObj.desc}. ${currentStyleObj.label} presentation on ${currentSurfaceObj.label}. ${currentAtmoObj.label} (${currentEventTypeObj.mood}), shallow depth of field, 85mm f/1.4 lens look, rich authentic culinary textures, glistening reduction glaze, micro-herb garnishes, warm banquet bokeh. Full-bleed edge-to-edge photography, no text, no watermarks, no borders.`;

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(promptFormula);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2500);
    if (onNotify) onNotify('Copied commercial photography prompt formula to clipboard!');
  };

  const handleApplyToProposal = () => {
    if (onUpdateHeroImage) {
      onUpdateHeroImage(activeAsset.url);
    }
    if (onNotify) {
      onNotify(`Applied "${activeAsset.title}" as active proposal cover asset!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[94vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lime-400 via-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 ring-2 ring-white/10">
              <Camera className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                  CaterProAI Visual Asset & Photography Studio
                </h3>
                <span className="text-[9px] font-black uppercase tracking-wider bg-lime-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Commercial Grade
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Editorial food styling, lighting design, and camera telemetry for luxury catering proposals
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
          
          {/* LEFT PANEL: Live Photography Asset Preview & Inspector (7 Cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 space-y-4 bg-slate-900 text-white flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-lime-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                  {activeAsset.badge}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeAsset.specs}
                </span>
              </div>

              {/* Master Full-Bleed Photograph Canvas */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-white/15 shadow-2xl group bg-slate-950">
                <img
                  src={activeAsset.url}
                  alt={activeAsset.title}
                  className="w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                />

                {/* Ambient Top & Bottom Gradients */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-lime-400" />
                  <span>Ultra-Realistic Commercial Asset</span>
                </div>

                {/* Floating Bottom Metadata Details */}
                <div className="absolute bottom-3 inset-x-3 text-left space-y-1">
                  <h4 className="text-sm sm:text-base font-black text-white drop-shadow-md">
                    {activeAsset.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-200">
                    <span className="bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded">
                      🍽️ {activeAsset.course}
                    </span>
                    <span className="bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded">
                      💡 {activeAsset.atmosphere.split(' ')[0]}
                    </span>
                    <span className="bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded font-mono">
                      📸 85mm f/1.4 Editorial
                    </span>
                  </div>
                </div>
              </div>

              {/* Asset Gallery Selector */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block text-left">
                  Available Studio Renderings:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {PREVIEW_ASSETS.map((asset, idx) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => setActiveAssetIndex(idx)}
                      className={`relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition-all cursor-pointer ${
                        activeAssetIndex === idx
                          ? 'border-lime-400 ring-2 ring-lime-400/30 scale-[1.02]'
                          : 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'
                      }`}
                    >
                      <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
                      {activeAssetIndex === idx && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
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
                <span>View Full Resolution</span>
              </a>

              <button
                type="button"
                onClick={handleApplyToProposal}
                className="px-5 py-2.5 bg-gradient-to-r from-lime-400 via-teal-400 to-cyan-400 hover:from-lime-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-teal-500/30 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Set as Proposal Cover Photo</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Dynamic Styling Parameters & Constitution (5 Cols) */}
          <div className="lg:col-span-5 p-4 sm:p-6 space-y-4 text-xs font-bold text-slate-700 bg-white">
            
            <div className="space-y-1 pb-2 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Dynamic Styling Parameters
              </span>
              <p className="text-[11px] text-slate-500 font-medium">
                Configure your event profile to formulate tailored commercial photography prompts.
              </p>
            </div>

            {/* 1. Event Type / Theme */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
                <span>1. Event Type / Theme</span>
                <span className="text-teal-700 font-mono text-[9px]">{currentEventTypeObj.label.split(' ')[0]}</span>
              </label>
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all"
              >
                {EVENT_TYPES.map(e => (
                  <option key={e.id} value={e.id}>{e.label}</option>
                ))}
              </select>
            </div>

            {/* 2. Primary Subject / Course */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
                <span>2. Primary Subject / Course</span>
                <span className="text-teal-700 font-mono text-[9px]">{currentSubjectObj.course}</span>
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all"
              >
                {PRIMARY_SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* 3. Presentation Style */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                3. Presentation Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all"
              >
                {PRESENTATION_STYLES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* 4. Visual Atmosphere & Lighting */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                4. Visual Atmosphere & Lighting
              </label>
              <select
                value={selectedAtmosphere}
                onChange={(e) => setSelectedAtmosphere(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all"
              >
                {ATMOSPHERE_LIGHTING.map(a => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>

            {/* 5. Plating & Surface Texture */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                5. Plating & Surface Texture
              </label>
              <select
                value={selectedSurface}
                onChange={(e) => setSelectedSurface(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all"
              >
                {SURFACE_TEXTURES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Prompt Formula Output Box */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-lime-600" />
                  Styling Formula for Studio Engine
                </span>
                <button
                  type="button"
                  onClick={handleCopyFormula}
                  className="text-[10px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                >
                  {copiedFormula ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormula ? 'Copied!' : 'Copy Formula'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 leading-relaxed max-h-24 overflow-y-auto">
                {promptFormula}
              </div>
            </div>

            {/* Creative & Styling Rules Badge */}
            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 text-[10px] text-teal-900 space-y-1">
              <span className="font-black uppercase tracking-wider block">
                Photography Constitution:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 font-medium">
                <li>Commercial 85mm f/1.4 editorial quality</li>
                <li>Realistic portion yields & micro-herb placement</li>
                <li>Zero text, zero watermarks, 100% full-bleed</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
export default CulinaryVisualStudioModal;
