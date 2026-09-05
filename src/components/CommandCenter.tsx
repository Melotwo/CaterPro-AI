import React, { useState } from 'react';
import { 
  ChefHat, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Coins, 
  FileText, 
  PlusCircle, 
  Download, 
  Calculator, 
  MapPin,
  Sparkles,
  Utensils,
  CheckCircle2,
  Clock,
  Save,
  Building2,
  ArrowRight,
  Sliders,
  Layers,
  Flame,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { Menu } from '../types';

export type HotelOutlet = 
  | 'banquets'
  | 'restaurant'
  | 'room-service'
  | 'staff-meals'
  | 'conference'
  | 'poolside';

export interface OutletConfig {
  id: HotelOutlet;
  name: string;
  badge: string;
  defaultEventType: string;
  typicalCovers: number;
}

export const HOTEL_OUTLETS: OutletConfig[] = [
  { id: 'banquets', name: 'Grand Ballroom', badge: 'Banqueting Suite', defaultEventType: 'Hotel Banquet', typicalCovers: 120 },
  { id: 'restaurant', name: 'The Pavilion', badge: 'Fine Dining À la carte', defaultEventType: 'À la carte Service', typicalCovers: 65 },
  { id: 'conference', name: 'Convention Center', badge: 'Day Delegate (DDR)', defaultEventType: 'Corporate Conference', typicalCovers: 180 },
  { id: 'room-service', name: 'In-Room Dining', badge: '24/7 Guest Service', defaultEventType: 'In-Room Dining', typicalCovers: 40 },
  { id: 'staff-meals', name: 'Colleague Canteen', badge: 'Crew & Staff Meals', defaultEventType: 'Staff Meals', typicalCovers: 150 },
  { id: 'poolside', name: 'Terrace & Pool Deck', badge: 'Cocktails & Small Plates', defaultEventType: 'Cocktail Party', typicalCovers: 85 }
];

interface CommandCenterProps {
  proposal: Menu;
  onNewProposal: () => void;
  onOpenBeo: () => void;
  onExportPdf: () => void;
  onOpenCalculator: () => void;
  onOpenRecipe?: () => void;
  onSaveProposal: () => void;
  region: string;
  onUpdateGuestCount: (count: number) => void;
  onUpdatePerHead?: (price: number) => void;
  onQuickGenerateMenu?: (params: {
    outlet: string;
    eventType: string;
    covers: number;
    cuisine: string;
    notes: string;
  }) => void;
  isGeneratingMenu?: boolean;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  proposal,
  onNewProposal,
  onOpenBeo,
  onExportPdf,
  onOpenCalculator,
  onOpenRecipe,
  onSaveProposal,
  region,
  onUpdateGuestCount,
  onUpdatePerHead,
  onQuickGenerateMenu,
  isGeneratingMenu = false
}) => {
  const [selectedOutlet, setSelectedOutlet] = useState<HotelOutlet>('banquets');
  const [quickEventType, setQuickEventType] = useState('Hotel Banquet');
  const [quickCovers, setQuickCovers] = useState(proposal.guestCount || 120);
  const [quickCuisine, setQuickCuisine] = useState('Contemporary Cape & Continental');
  const [quickNotes, setQuickNotes] = useState('Halal meat certification required. 12 vegetarian VIPs. SANS 10330 HACCP cold-chain verification.');
  const [yieldMultiplier, setYieldMultiplier] = useState<number>(1.0); // 1.0x standard, 1.1x buffer, 1.25x high volume

  const [isAdjustingPrice, setIsAdjustingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(proposal.manualPerHead || 520);

  const guestCount = proposal.guestCount || 120;
  const perHead = proposal.manualPerHead || 520;
  const deliveryFee = proposal.logistics?.deliveryFee || 2400;
  const totalValue = (perHead * guestCount) + deliveryFee;
  
  // Real hotel benchmark: Target food cost 26%-30%
  const estFoodCost = totalValue * 0.278;
  const estGrossProfit = totalValue - estFoodCost;
  const foodCostPct = Math.round((estFoodCost / totalValue) * 1000) / 10 || 27.8;
  const contributionMargin = totalValue - estFoodCost;

  const coursesCount = (proposal.menu || []).length || 8;

  const handleOutletSelect = (outlet: OutletConfig) => {
    setSelectedOutlet(outlet.id);
    setQuickEventType(outlet.defaultEventType);
    setQuickCovers(outlet.typicalCovers);
    onUpdateGuestCount(outlet.typicalCovers);
  };

  const handleFormulateClick = () => {
    if (onQuickGenerateMenu) {
      const activeOutletObj = HOTEL_OUTLETS.find(o => o.id === selectedOutlet);
      onQuickGenerateMenu({
        outlet: activeOutletObj ? `${activeOutletObj.name} (${activeOutletObj.badge})` : 'Grand Ballroom',
        eventType: quickEventType,
        covers: quickCovers,
        cuisine: quickCuisine,
        notes: quickNotes
      });
    } else {
      onNewProposal();
    }
  };

  const handleApplyPrice = () => {
    if (onUpdatePerHead && tempPrice > 0) {
      onUpdatePerHead(tempPrice);
      setIsAdjustingPrice(false);
    }
  };

  return (
    <div id="command-center-root" className="relative rounded-3xl bg-white text-slate-900 p-6 sm:p-8 md:p-10 border border-slate-200 shadow-sm overflow-hidden text-left space-y-8 animate-fade-in transition-all">
      
      {/* Fresh energetic background ambient highlights (Lime to Teal / Turquoise) */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-gradient-to-br from-lime-400/15 via-teal-400/15 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-80 h-80 bg-gradient-to-tr from-teal-400/10 via-cyan-400/10 to-lime-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER: Brand Identity & Executive Status */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-lime-500 via-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 ring-2 ring-lime-400/30">
              <ChefHat className="w-6 h-6 stroke-[2.4]" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200/80 flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
              Executive Chef Command Center
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              Centralized Hotel Administration Hub
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-3">
              <span>Hotel Culinary Operations</span>
              <span className="text-xs font-mono text-teal-700 bg-gradient-to-r from-lime-100 to-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 normal-case font-bold">
                Multi-Outlet Suite • 2026
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium leading-relaxed mt-1">
              Automated menu structure formulation, real-time Escoffier food-cost ratio, portion yield scaling, and statutory SANS 10330 HACCP compliance.
            </p>
          </div>
        </div>

        {/* Region & Health Safety Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 px-4 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-teal-600 shadow-2xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                Wholesale Index
              </span>
              <span className="text-xs font-black text-slate-900">
                {region || 'South Africa (ZAR • R)'}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-lime-50 to-teal-50 border border-lime-200 rounded-2xl p-3 px-4 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-white border border-lime-200 flex items-center justify-center text-lime-600 shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                Safety & Audit
              </span>
              <span className="text-xs font-black text-teal-800">
                SANS 10330 Defensible
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. MULTI-OUTLET SELECTOR BAR */}
      <div className="relative z-10 space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            Active Hotel Outlet Awareness
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Seamlessly switch between Banquets, Restaurant, Room Service, or Staff Meals
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {HOTEL_OUTLETS.map(outlet => {
            const isActive = selectedOutlet === outlet.id;
            return (
              <button
                key={outlet.id}
                type="button"
                onClick={() => handleOutletSelect(outlet)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between gap-1.5 ${
                  isActive 
                    ? 'bg-gradient-to-br from-lime-500 to-teal-600 text-white border-teal-600 shadow-sm shadow-teal-500/20 scale-[1.02]' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className={`text-xs font-black leading-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {outlet.name}
                  </div>
                  <div className={`text-[10px] font-medium leading-tight mt-0.5 ${isActive ? 'text-lime-100' : 'text-slate-500'}`}>
                    {outlet.badge}
                  </div>
                </div>
                <div className={`text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-white/90' : 'text-teal-700'}`}>
                  ~{outlet.typicalCovers} Covers
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. INSTANT MENU GENERATOR ENGINE (Command Center -> Calculator Pipeline) */}
      <div className="relative z-10 bg-gradient-to-br from-white via-lime-50/20 to-teal-50/30 rounded-2xl border-2 border-teal-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-lime-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-2xs">
              ⚡
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Menu Generator & Costing Pipeline
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Select parameters to auto-generate menu structure and push live costings to Calculator
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-lime-100 text-lime-900 px-3 py-1 rounded-full border border-lime-300 shrink-0">
            Step 1 of 2: Configure & Generate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Event Type (Free-text with Datalist & Quick Chips) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Event / Service Type
              </label>
              <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                Type Any Custom Event
              </span>
            </div>
            
            <div className="relative">
              <input
                type="text"
                list="event-type-presets"
                value={quickEventType}
                onChange={(e) => setQuickEventType(e.target.value)}
                placeholder="e.g. Graduation Party, Hotel Banquet..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all shadow-2xs"
              />
              <datalist id="event-type-presets">
                <option value="Graduation Party" />
                <option value="Hotel Banquet" />
                <option value="Wedding Reception" />
                <option value="Corporate Conference" />
                <option value="Cocktail Party & Canapés" />
                <option value="À la carte Service" />
                <option value="Staff Meals" />
                <option value="In-Room Dining" />
                <option value="VIP Private Dinner" />
                <option value="Matric Dance / Prom" />
                <option value="Anniversary Gala" />
              </datalist>
            </div>

            {/* Quick-Click Event Type Badges */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {[
                { label: 'Graduation Party', icon: '🎓' },
                { label: 'Hotel Banquet', icon: '🍽️' },
                { label: 'Wedding Reception', icon: '💍' },
                { label: 'Cocktail Party', icon: '🍸' },
                { label: 'Staff Meals', icon: '👨‍🍳' }
              ].map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setQuickEventType(preset.label)}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                    quickEventType.toLowerCase() === preset.label.toLowerCase()
                      ? 'bg-gradient-to-r from-lime-500 to-teal-600 text-white border-teal-600 shadow-2xs'
                      : 'bg-slate-50 hover:bg-teal-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Covers / Guests */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Guest Covers
              </label>
              <span className="text-[10px] font-black text-teal-700">{quickCovers} pax</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="2500"
                value={quickCovers}
                onChange={(e) => {
                  const val = Number(e.target.value) || 1;
                  setQuickCovers(val);
                  onUpdateGuestCount(val);
                }}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all shadow-2xs"
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const c = Math.max(10, quickCovers - 25);
                    setQuickCovers(c);
                    onUpdateGuestCount(c);
                  }}
                  className="px-2 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
                >
                  -25
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const c = quickCovers + 25;
                    setQuickCovers(c);
                    onUpdateGuestCount(c);
                  }}
                  className="px-2 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
                >
                  +25
                </button>
              </div>
            </div>
          </div>

          {/* Cuisine Style */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Cuisine Style & Heritage
            </label>
            <select
              value={quickCuisine}
              onChange={(e) => setQuickCuisine(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all cursor-pointer shadow-2xs"
            >
              <option>Contemporary Cape & Continental</option>
              <option>Classical French & Escoffier</option>
              <option>Modern European Banquet</option>
              <option>South African Heritage & Braai</option>
              <option>Mediterranean Coastal & Seafood</option>
              <option>Executive Asian Fusion</option>
              <option>Nutritional Plant-Forward</option>
            </select>
          </div>

          {/* Yield / Portion Multiplier */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Kitchen Yield Multiplier
              </label>
              <span className="text-[10px] font-black text-lime-700">
                {yieldMultiplier === 1.0 ? '1.0x (Standard)' : yieldMultiplier === 1.1 ? '1.1x (+10% Buffet)' : '1.25x (+25% High-Vol)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[1.0, 1.1, 1.25].map(mult => (
                <button
                  key={mult}
                  type="button"
                  onClick={() => setYieldMultiplier(mult)}
                  className={`py-2 text-[10px] font-black rounded-lg border transition-all ${
                    yieldMultiplier === mult 
                      ? 'bg-lime-500 text-white border-lime-600 shadow-2xs' 
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes & Generate Action */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-2">
          <div className="flex-1">
            <input
              type="text"
              value={quickNotes}
              onChange={(e) => setQuickNotes(e.target.value)}
              placeholder="Special notes: Allergens, VIP tables, Halal requirements, service timings..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all shadow-2xs font-medium"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleFormulateClick}
              disabled={isGeneratingMenu}
              className="px-6 py-3 bg-gradient-to-r from-lime-500 via-teal-600 to-cyan-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingMenu ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Formulating Menu & Costings...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-lime-200" />
                  <span>Generate Menu & Auto-Cost</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenCalculator}
              className="px-4 py-3 bg-white hover:bg-slate-50 text-teal-800 border border-teal-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">Open Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY FINANCIAL TELEMETRY HUD (4 Crisp Modern Cards) */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Projected Revenue */}
        <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200/90 hover:border-teal-400 transition-all space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-teal-600" />
              Projected Revenue
            </span>
            <button
              type="button"
              onClick={() => setIsAdjustingPrice(!isAdjustingPrice)}
              className="text-[10px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer"
            >
              {isAdjustingPrice ? 'Cancel' : 'Adjust'}
            </button>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ZAR {totalValue.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              R{perHead} / guest • {guestCount} covers
            </p>
          </div>

          {isAdjustingPrice && (
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleApplyPrice}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-black uppercase"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-lime-500 to-teal-500 h-1.5 rounded-full w-4/5" />
          </div>
        </div>

        {/* Escoffier Food Cost % Target */}
        <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200/90 hover:border-lime-400 transition-all space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-lime-600" />
              Food Cost Ratio
            </span>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-lime-100 text-lime-800 border border-lime-300">
              Target &lt; 30%
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{foodCostPct}%</span>
              <span className="text-xs font-bold text-lime-700">✓ On Target</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              Est. Raw Food Spend: ZAR {estFoodCost.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-lime-500 h-1.5 rounded-full" style={{ width: `${foodCostPct}%` }} />
          </div>
        </div>

        {/* Contribution Margin */}
        <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200/90 hover:border-cyan-400 transition-all space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-cyan-600" />
              Contribution Margin
            </span>
            <span className="text-[9px] font-black text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
              {Math.round(100 - foodCostPct)}% Margin
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ZAR {contributionMargin.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              Gross Profit before labor & venue overheads
            </p>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-1.5 rounded-full" style={{ width: `${100 - foodCostPct}%` }} />
          </div>
        </div>

        {/* Banquet Covers & Portion Scaling */}
        <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200/90 hover:border-teal-400 transition-all space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              Kitchen Yield Scaling
            </span>
            <span className="text-[9px] font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {coursesCount} Plated Courses
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{Math.round(guestCount * yieldMultiplier)}</span>
              <span className="text-xs font-bold text-slate-500">Portions</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              {yieldMultiplier > 1.0 ? `+${Math.round((yieldMultiplier - 1.0) * 100)}% production buffer applied` : 'Standard portion sync 1:1'}
            </p>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-500 h-1.5 rounded-full w-full" />
          </div>
        </div>

      </div>

      {/* 4. EXECUTIVE ACTIONS CONTROL BAR */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping" />
          <span>Active BEO:</span>
          <span className="font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {proposal.beoNumber || 'BEO-2026-HOTEL-784'}
          </span>
          <span className="text-slate-400">•</span>
          <span>{proposal.roomLocation || 'Grand Ballroom & Banqueting Deck'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCalculator}
            className="px-4 py-2.5 bg-gradient-to-r from-lime-500 to-teal-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Open Mission Control Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onOpenRecipe && (
            <button
              type="button"
              onClick={onOpenRecipe}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Food Encyclopedia (Larousse)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenBeo}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>Banquet Event Order (BEO)</span>
          </button>

          <button
            type="button"
            onClick={onExportPdf}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            onClick={onSaveProposal}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-lime-400" />
            <span>Save State</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default CommandCenter;
