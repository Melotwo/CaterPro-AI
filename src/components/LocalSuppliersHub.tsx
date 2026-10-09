import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  ExternalLink, 
  Phone, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Building2, 
  CheckCircle2, 
  RefreshCw, 
  ShoppingBag, 
  ChefHat, 
  Copy, 
  ArrowRight,
  Plus,
  Coins,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { fetchLocalSuppliers, SupplierSearchResult } from '../services/geminiService';
import { VERIFIED_LOCAL_SUPPLIERS, LocalSupplier } from '../services/localSuppliersData';
import { Menu, CustomSupplier } from '../types';
import { CustomSupplierFormModal } from './CustomSupplierFormModal';
import { LocalPlateCostingTable } from './LocalPlateCostingTable';

interface LocalSuppliersHubProps {
  proposal?: Menu;
  onNotify?: (message: string) => void;
  onOpenCalculator?: () => void;
  onUpdateProposal?: (updated: Menu) => void;
  initialCategory?: string;
  initialQuery?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Suppliers', icon: '🛍️' },
  { id: 'meat', label: 'Wholesale Butchery', icon: '🥩' },
  { id: 'produce', label: 'Produce & Farms', icon: '🥬' },
  { id: 'seafood', label: 'Seafood Merchants', icon: '🦐' },
  { id: 'dairy', label: 'Dairy & Cheese', icon: '🧀' },
  { id: 'bakery', label: 'Bakery & Flour', icon: '🥖' },
  { id: 'beverage', label: 'Beverage Distributors', icon: '🍷' },
  { id: 'equipment', label: 'Foodservice Depot', icon: '🍳' },
  { id: 'specialty', label: 'Gourmet Importers', icon: '✨' },
];

const PRESET_CITIES = [
  'Mokopane',
  'Polokwane',
  'Cape Town',
  'Johannesburg',
  'Durban',
  'Pretoria'
];

export const LocalSuppliersHub: React.FC<LocalSuppliersHubProps> = ({
  proposal,
  onNotify,
  onOpenCalculator,
  onUpdateProposal,
  initialCategory = 'all',
  initialQuery = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [locationName, setLocationName] = useState<string>(() => {
    return proposal?.sourcingRegion || 'Mokopane, Limpopo';
  });
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SupplierSearchResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'all' | 'costing' | 'grounded' | 'custom'>('all');

  // Custom Suppliers list stored in proposal or local state
  const customSuppliersList = useMemo<CustomSupplier[]>(() => {
    return proposal?.customSuppliers || [];
  }, [proposal?.customSuppliers]);

  // Sync initial query if passed as props
  useEffect(() => {
    if (initialQuery) setSearchQuery(initialQuery);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  // Execute initial supplier search on mount
  useEffect(() => {
    handleSearchSuppliers();
  }, [selectedCategory]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      if (onNotify) onNotify('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setUserCoords(coords);
        setLocationName('Current GPS Location');
        setIsLocating(false);
        if (onNotify) onNotify('📍 GPS location locked. Searching nearby suppliers with Google Maps Grounding...');
        executeSearch(searchQuery, selectedCategory, 'Current GPS Location', coords);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setIsLocating(false);
        if (onNotify) onNotify('Could not acquire GPS position. Defaulting to regional search.');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const executeSearch = async (
    query: string, 
    category: string, 
    loc: string, 
    coords: { latitude: number; longitude: number } | null
  ) => {
    setIsSearching(true);
    try {
      const res = await fetchLocalSuppliers({
        query: query.trim(),
        category: category,
        location: loc,
        latLng: coords || undefined
      });
      setSearchResult(res);
      if (onNotify) {
        onNotify(`✅ Found ${res.mapsPlaces?.length || 0} local suppliers grounded with Google Maps.`);
      }
    } catch (err: any) {
      console.warn('Supplier search error:', err);
      if (onNotify) onNotify('Loaded verified wholesale directory.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSuppliers = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeSearch(searchQuery, selectedCategory, locationName, userCoords);
  };

  const handleCopySupplier = (supplier: { name: string; mapsUri?: string; specialty?: string; phone?: string; location?: string }) => {
    const text = `${supplier.name}\n${supplier.specialty || 'Wholesale Supplier'}\nLocation: ${supplier.location || 'Local'}\n${supplier.phone ? `Contact: ${supplier.phone}\n` : ''}${supplier.mapsUri ? `Google Maps: ${supplier.mapsUri}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(supplier.name);
    setTimeout(() => setCopiedId(null), 2500);
    if (onNotify) onNotify(`Copied details for ${supplier.name} to clipboard.`);
  };

  // Save custom supplier into the active proposal cost model
  const handleSaveCustomSupplier = (newSupplier: CustomSupplier) => {
    if (!proposal || !onUpdateProposal) return;

    const existing = proposal.customSuppliers || [];
    const updatedSuppliers = [newSupplier, ...existing];

    // If new supplier has price items, also link/synchronize directly to menu items or shoppingList
    const updatedMenu = { ...proposal };
    updatedMenu.customSuppliers = updatedSuppliers;
    updatedMenu.sourcingRegion = newSupplier.location || locationName;

    // Recalculate or synchronize menu items if matched
    if (updatedMenu.menu && updatedMenu.menu.length > 0) {
      const modifiedList = updatedMenu.menu.map((dish) => {
        const dishText = (dish.dish + ' ' + (dish.notes || '')).toLowerCase();
        for (const item of newSupplier.suppliedItems) {
          if (dishText.includes(item.itemName.toLowerCase())) {
            // Update estimated raw cost based on custom direct rate
            const approxKg = 0.22;
            const newCost = Math.round((item.unitCost * approxKg + 8) * 10) / 10;
            return {
              ...dish,
              cost: newCost,
              notes: `${dish.notes || ''} [Sourced: ${newSupplier.name} @ R${item.unitCost}/${item.unit}]`.trim()
            };
          }
        }
        return dish;
      });
      updatedMenu.menu = modifiedList;
    }

    onUpdateProposal(updatedMenu);
    if (onNotify) {
      onNotify(`🎉 "${newSupplier.name}" saved! Direct unit rates (${newSupplier.suppliedItems.map(i => `${i.itemName} @ R${i.unitCost}/${i.unit}`).join(', ')}) updated into active cost model.`);
    }
  };

  // Remove a custom supplier
  const handleDeleteCustomSupplier = (id: string) => {
    if (!proposal || !onUpdateProposal) return;
    const filtered = (proposal.customSuppliers || []).filter(s => s.id !== id);
    onUpdateProposal({
      ...proposal,
      customSuppliers: filtered
    });
    if (onNotify) onNotify('Custom supplier removed from proposal cost model.');
  };

  // Combine and deduplicate verified suppliers with Google Maps grounded places
  const displayedSuppliers = useMemo(() => {
    const directory = VERIFIED_LOCAL_SUPPLIERS;
    const maps = searchResult?.mapsPlaces || [];

    // Filter directory by category and query
    let filtered = directory;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.specialty.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.popularItems.some(i => i.toLowerCase().includes(q))
      );
    }

    return {
      directory: filtered,
      mapsPlaces: maps
    };
  }, [searchResult, selectedCategory, searchQuery]);

  return (
    <div id="local-suppliers-hub-root" className="max-w-7xl mx-auto space-y-4 sm:space-y-6 text-left animate-fade-in">
      
      {/* 1. HERO HEADER: CATERPROAI LOCAL SOURCING & SUPPLIER ENGINE */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 md:p-8 shadow-sm overflow-hidden">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-lime-400/15 via-teal-400/15 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lime-500 via-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 ring-2 ring-lime-400/30">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/80 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                CaterProAI Local Sourcing & Supplier Engine
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                Google Maps Grounding
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-3">
              <span>Local Sourcing & Procurement</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl font-medium leading-relaxed">
              Automated Google Maps Grounding locates nearby wholesale butchers, fresh produce markets, cash & carries, and beverage distributors. Match menu ingredients for accurate local plate costing, or add custom unlisted suppliers immediately into your active cost model.
            </p>
          </div>

          {/* Quick Context & Custom Supplier Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-lime-400 stroke-[3]" />
              <span>+ Add Custom Supplier</span>
            </button>

            {proposal && (
              <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 border border-slate-200 rounded-2xl p-3 space-y-1 shrink-0 text-left">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Active Proposal
                  </span>
                  <span className="text-[10px] font-mono font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-teal-200">
                    {proposal.beoNumber || 'BEO-2026-HOTEL'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1">
                  {proposal.title || 'Executive Banquet'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {proposal.covers || proposal.guestCount || 100} Covers • {proposal.sourcingRegion || locationName}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Highlights */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Grounded Suppliers
            </span>
            <span className="text-base font-black text-slate-900 font-mono">
              {displayedSuppliers.mapsPlaces.length + displayedSuppliers.directory.length + customSuppliersList.length} <span className="text-[11px] font-normal text-slate-500">places</span>
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Active City / Region
            </span>
            <span className="text-xs font-black text-teal-800 truncate block mt-0.5">
              {locationName}
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Custom Direct Vendors
            </span>
            <span className="text-xs font-black text-lime-700 block mt-0.5 font-mono">
              {customSuppliersList.length} Active in Model
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Plate Costing Accuracy
            </span>
            <span className="text-xs font-black text-emerald-700 block mt-0.5">
              Localized Regional ZAR
            </span>
          </div>
        </div>
      </div>

      {/* 2. TAB SUB-NAVIGATION BAR (ALL / COSTING / MAPS / CUSTOM) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/90 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveViewMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            <span>All Sourcing & Suppliers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('costing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'costing'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-lime-400" />
            <span>Local Plate Costing</span>
            <span className="text-[9px] font-black uppercase bg-lime-400 text-slate-950 px-1.5 py-0.2 rounded-full">
              ZAR
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('custom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'custom'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-teal-400" />
            <span>Custom Direct Vendors ({customSuppliersList.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsCustomModalOpen(true)}
          className="text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5 text-teal-600" />
          <span>Unlisted Supplier Fallback Template</span>
        </button>
      </div>

      {/* 3. SEARCH CONTROLS & LOCATION SELECTOR */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
        <form onSubmit={handleSearchSuppliers} className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredient or wholesaler (e.g. Lamb Mince, Salmon Fillets, Olive Oil, Uncle Joe's)..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-500 outline-none transition-all"
            />
          </div>

          {/* Location / City Input */}
          <div className="md:col-span-4 relative flex gap-1.5">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="City, suburb or region (e.g. Mokopane, Cape Town)..."
                className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-500 outline-none transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              title="Detect GPS Location"
              className="px-3 py-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Compass className={`w-3.5 h-3.5 text-teal-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">GPS</span>
            </button>
          </div>

          {/* Action Button */}
          <div className="md:col-span-3 flex gap-2">
            <button
              type="submit"
              disabled={isSearching}
              className="flex-1 py-2.5 bg-gradient-to-r from-lime-500 via-teal-600 to-cyan-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Grounding...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Locate Suppliers</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick City Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 text-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            Quick Towns & Hubs:
          </span>
          {PRESET_CITIES.map(city => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setLocationName(city);
                executeSearch(searchQuery, selectedCategory, city, null);
              }}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                locationName.toLowerCase().includes(city.toLowerCase().split(' ')[0])
                  ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-2xs font-black'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-lime-500 to-teal-600 text-white shadow-2xs scale-[1.01]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. LOCAL PLATE COSTING TABLE COMPONENT */}
      {(activeViewMode === 'all' || activeViewMode === 'costing') && proposal && (
        <LocalPlateCostingTable
          proposal={proposal}
          customSuppliers={customSuppliersList}
          currentRegion={locationName}
          onOpenCalculator={onOpenCalculator}
          onOpenAddSupplier={() => setIsCustomModalOpen(true)}
        />
      )}

      {/* 5. CUSTOM / UNLISTED SUPPLIER CARDS SECTION */}
      {customSuppliersList.length > 0 && (activeViewMode === 'all' || activeViewMode === 'custom') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-500" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Custom & Unlisted Local Suppliers (Direct Cost Model Sync)
              </h3>
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                {customSuppliersList.length} Active
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              <span>Add Another Custom Supplier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {customSuppliersList.map((supp) => (
              <div 
                key={supp.id}
                className="bg-white rounded-2xl border-2 border-lime-400/70 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-lime-400 text-slate-950 font-black text-[9px] uppercase px-2.5 py-0.5 rounded-bl-lg tracking-wider">
                  Direct Cost Sync
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {supp.categoryLabel || 'Direct Wholesale Butchery'}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">
                      {supp.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      <span>{supp.location}</span>
                    </p>
                  </div>

                  {/* Supplied Items & Direct Unit Costs Badges */}
                  <div className="bg-lime-50/60 rounded-xl p-2.5 border border-lime-200/80 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-teal-900 block">
                      Direct Supplied Items & Unit Costs:
                    </span>
                    <div className="space-y-1">
                      {supp.suppliedItems.map((itm, iIdx) => (
                        <div key={iIdx} className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-800">{itm.itemName}</span>
                          <span className="font-mono text-teal-800 bg-white px-2 py-0.5 rounded border border-lime-300">
                            R {itm.unitCost} / {itm.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {supp.notes && (
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{supp.notes}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs">
                    {supp.phoneOrWhatsApp && (
                      <a
                        href={`tel:${supp.phoneOrWhatsApp}`}
                        className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200"
                      >
                        <Phone className="w-3 h-3 text-teal-600" />
                        <span>{supp.phoneOrWhatsApp}</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopySupplier({
                        name: supp.name,
                        specialty: supp.suppliedItems.map(i => `${i.itemName} @ R${i.unitCost}/${i.unit}`).join(', '),
                        location: supp.location,
                        phone: supp.phoneOrWhatsApp
                      })}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Copy details"
                    >
                      {copiedId === supp.name ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomSupplier(supp.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs font-bold"
                      title="Remove from cost model"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. GEMINI GOOGLE MAPS EXECUTIVE ADVICE & INTELLIGENCE */}
      {searchResult?.text && (
        <div className="bg-gradient-to-br from-teal-50/50 via-white to-lime-50/30 rounded-2xl border border-teal-200/80 p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-teal-800">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              Procurement & Regional Supply Intelligence (Google Maps Grounded)
            </h3>
            <span className="text-[9px] font-bold bg-white text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
              Live Verified
            </span>
          </div>
          <div className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
            {searchResult.text}
          </div>
        </div>
      )}

      {/* 7. GOOGLE MAPS GROUNDED SUPPLIER CARDS & DIRECTORY */}
      {(activeViewMode === 'all' || activeViewMode === 'grounded') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span>Verified Regional Wholesale Suppliers</span>
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                {displayedSuppliers.mapsPlaces.length + displayedSuppliers.directory.length} Found
              </span>
            </h3>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
              Includes driving coordinates, certified phone lines, and SANS 10330 cold-chain ratings
            </span>
          </div>

          {/* Live Grounded Google Maps Places */}
          {displayedSuppliers.mapsPlaces.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>Google Maps Places Grounded for {locationName}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayedSuppliers.mapsPlaces.map((place, idx) => (
                  <div 
                    key={`maps-${idx}`} 
                    className="bg-white rounded-2xl border border-teal-200/90 hover:border-teal-400 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-3 text-left group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                          {place.name || place.title}
                        </h4>
                        <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center text-xs shrink-0 font-bold">
                          📍
                        </span>
                      </div>

                      {place.reviewSnippets && place.reviewSnippets.length > 0 && (
                        <p className="text-[11px] text-slate-600 font-medium line-clamp-3 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                          "{place.reviewSnippets[0]}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <a
                        href={place.mapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopySupplier(place)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Copy supplier details"
                      >
                        {copiedId === place.name ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Catering Wholesaler Directory Cards */}
          <div className="space-y-2.5 pt-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-teal-600" />
              <span>Commercial Butchery & Provisions Directory ({locationName})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {displayedSuppliers.directory.map(supplier => (
                <div
                  key={supplier.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-3 text-left group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                            {supplier.categoryLabel}
                          </span>
                          {supplier.haccpCertified && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              HACCP
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                          {supplier.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {supplier.address}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                      {supplier.specialty}
                    </p>

                    {/* Popular Ingredients */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {supplier.popularItems.slice(0, 3).map(item => (
                        <span
                          key={item}
                          className="text-[9px] font-bold bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                        >
                          {item}
                        </span>
                      ))}
                      {supplier.popularItems.length > 3 && (
                        <span className="text-[9px] text-slate-400 font-bold px-1 self-center">
                          +{supplier.popularItems.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Delivery & Ordering Specs */}
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1 text-[10px]">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 font-bold">
                          <Truck className="w-3 h-3 text-teal-600" />
                          Order Cutoff:
                        </span>
                        <span className="font-mono text-slate-800 font-bold">{supplier.orderCutoff}</span>
                      </div>
                      {supplier.minOrder && (
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-bold">Min Wholesale Order:</span>
                          <span className="font-mono font-bold text-teal-800">{supplier.minOrder}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions: Google Maps Link, Phone, and Copy */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={supplier.mapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>View on Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-1">
                      {supplier.phone && (
                        <a
                          href={`tel:${supplier.phone}`}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title={`Call ${supplier.name}: ${supplier.phone}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleCopySupplier(supplier)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Copy supplier details"
                      >
                        {copiedId === supplier.name ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. UNLISTED SUPPLIER TEMPLATE CALLOUT */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-lime-400 font-black text-sm">💡</span>
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              Sourcing from an Unlisted Butchery or Farmgate Supplier?
            </h4>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl font-medium leading-relaxed">
            If your local supplier isn't listed on Google Maps, use CaterProAI's simple fallback template. Enter their name, WhatsApp number, and direct unit costs (e.g. <em>Uncle Joe's Meat Market, Lamb Mince @ R110/kg</em>) to lock in immediate plate costings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCustomModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-lime-400 to-teal-400 hover:from-lime-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
        >
          Open Custom Supplier Template
        </button>
      </div>

      {/* 9. FOOTER INTEGRATION: PUSH TO CALCULATOR / SHOPPING LIST */}
      {onOpenCalculator && (
        <div className="bg-gradient-to-r from-lime-50 via-teal-50 to-cyan-50 rounded-2xl border border-teal-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
              <ChefHat className="w-4 h-4 text-teal-600" />
              Connect Supplies to Mission Control Calculator
            </span>
            <p className="text-[11px] text-slate-600 font-medium">
              Review portion costs, supplier assignments, and shopping list quantities calculated dynamically for your event covers.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCalculator}
            className="px-5 py-2.5 bg-gradient-to-r from-lime-500 to-teal-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Open Shopping Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Custom Supplier Entry Modal */}
      <CustomSupplierFormModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSaveSupplier={handleSaveCustomSupplier}
        initialLocation={locationName}
        defaultCategory={selectedCategory === 'all' ? 'meat' : selectedCategory as any}
      />
    </div>
  );
};
export default LocalSuppliersHub;
