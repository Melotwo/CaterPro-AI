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
  Filter, 
  Copy, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { fetchLocalSuppliers, SupplierSearchResult } from '../services/geminiService';
import { VERIFIED_LOCAL_SUPPLIERS, LocalSupplier } from '../services/localSuppliersData';
import { Menu } from '../types';

interface LocalSuppliersHubProps {
  proposal?: Menu;
  onNotify?: (message: string) => void;
  onOpenCalculator?: () => void;
  initialCategory?: string;
  initialQuery?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Suppliers', icon: '🛍️' },
  { id: 'produce', label: 'Produce & Farms', icon: '🥬' },
  { id: 'meat', label: 'Wholesale Butchery', icon: '🥩' },
  { id: 'seafood', label: 'Seafood Merchants', icon: '🦐' },
  { id: 'dairy', label: 'Dairy & Cheese', icon: '🧀' },
  { id: 'bakery', label: 'Bakery & Flour', icon: '🥖' },
  { id: 'specialty', label: 'Gourmet Importers', icon: '✨' },
  { id: 'equipment', label: 'Foodservice Depot', icon: '🍳' },
];

const PRESET_CITIES = [
  'Cape Town',
  'Johannesburg',
  'Durban',
  'Stellenbosch & Paarl',
  'Pretoria'
];

export const LocalSuppliersHub: React.FC<LocalSuppliersHubProps> = ({
  proposal,
  onNotify,
  onOpenCalculator,
  initialCategory = 'all',
  initialQuery = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [locationName, setLocationName] = useState<string>('Cape Town, Western Cape');
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SupplierSearchResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
        if (onNotify) onNotify('📍 GPS location locked. Searching nearby suppliers...');
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

  const handleCopySupplier = (supplier: { name: string; mapsUri: string; specialty?: string }) => {
    const text = `${supplier.name}\n${supplier.specialty || 'Wholesale Supplier'}\nGoogle Maps: ${supplier.mapsUri}`;
    navigator.clipboard.writeText(text);
    setCopiedId(supplier.name);
    setTimeout(() => setCopiedId(null), 2500);
    if (onNotify) onNotify(`Copied details for ${supplier.name} to clipboard.`);
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
      
      {/* 1. HERO HEADER: PROCUREMENT & LOCAL SUPPLIERS */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 md:p-8 shadow-sm overflow-hidden">
        {/* Soft background ambient glow (Lime to Teal / Turquoise) */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-lime-400/15 via-teal-400/15 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lime-500 via-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 ring-2 ring-lime-400/30">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/80 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                Local Supplier Procurement Engine
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                Google Maps Grounded
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-3">
              <span>Local Suppliers & Wholesalers</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl font-medium leading-relaxed">
              Connect directly with verified regional produce markets, ethical butcheries, ocean seafood docks, and artisanal dairies. Every supplier includes certified Google Maps coordinates, delivery cutoffs, and cold-chain compliance.
            </p>
          </div>

          {/* Quick Context & Active BEO Sync */}
          {proposal && (
            <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 border border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-2 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Active BEO Sourcing Sync
                </span>
                <span className="text-[10px] font-mono font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-teal-200">
                  {proposal.beoNumber || 'BEO-2026-HOTEL'}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 line-clamp-1">
                {proposal.title || 'Executive Banquet'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {proposal.covers || 100} Covers • {proposal.roomLocation || 'Grand Ballroom'}
              </div>
            </div>
          )}
        </div>

        {/* Status Highlights */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Grounded Places
            </span>
            <span className="text-base font-black text-slate-900 font-mono">
              {displayedSuppliers.mapsPlaces.length + displayedSuppliers.directory.length} <span className="text-[11px] font-normal text-slate-500">suppliers</span>
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Active Region
            </span>
            <span className="text-xs font-black text-teal-800 truncate block mt-0.5">
              {locationName}
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Cold Chain Standard
            </span>
            <span className="text-xs font-black text-emerald-700 block mt-0.5">
              SANS 10330 / HACCP &lt;4°C
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Direct Ordering
            </span>
            <span className="text-xs font-black text-slate-800 block mt-0.5">
              Wholesale Lead &lt;24h
            </span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH CONTROLS & LOCATION SELECTOR */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
        <form onSubmit={handleSearchSuppliers} className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredient or wholesaler (e.g. Linefish, Karoo lamb, Stoneground flour)..."
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
                placeholder="City, suburb or region..."
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
            Quick Hubs:
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
                  ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-2xs'
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

      {/* 3. GEMINI MAPS EXECUTIVE COMMENTARY / ADVICE */}
      {searchResult?.text && (
        <div className="bg-gradient-to-br from-teal-50/50 via-white to-lime-50/30 rounded-2xl border border-teal-200/80 p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-teal-800">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              Procurement & Regional Supply Analysis
            </h3>
            <span className="text-[9px] font-bold bg-white text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
              Live Intelligence
            </span>
          </div>
          <div className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
            {searchResult.text}
          </div>
        </div>
      )}

      {/* 4. GOOGLE MAPS GROUNDED SUPPLIER CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <span>Verified Local Suppliers & Wholesalers</span>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
              {displayedSuppliers.mapsPlaces.length + displayedSuppliers.directory.length} Found
            </span>
          </h3>
          <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
            Click any Google Maps pin to view live business hours, reviews, and navigation
          </span>
        </div>

        {/* Live Grounded Google Maps Places */}
        {displayedSuppliers.mapsPlaces.length > 0 && (
          <div className="space-y-2.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-red-500" />
              <span>Google Maps Places Grounded for this Area</span>
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
                      <span>View on Google Maps</span>
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
            <span>Commercial Restaurant & Hotel Provisioning Directory</span>
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
                    <span>View on Google Maps</span>
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

        {displayedSuppliers.directory.length === 0 && displayedSuppliers.mapsPlaces.length === 0 && !isSearching && (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <span className="text-3xl">🔍</span>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              No Suppliers Found for "{searchQuery}" in {locationName}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try changing the search term, selecting a different category, or switching to one of the major distribution hubs like Cape Town or Johannesburg.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setLocationName('Cape Town, Western Cape');
                executeSearch('', 'all', 'Cape Town, Western Cape', null);
              }}
              className="mt-3 px-4 py-2 bg-white hover:bg-slate-100 text-teal-800 rounded-xl text-xs font-bold border border-slate-300 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. FOOTER INTEGRATION: PUSH TO CALCULATOR / SHOPPING LIST */}
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
    </div>
  );
};
