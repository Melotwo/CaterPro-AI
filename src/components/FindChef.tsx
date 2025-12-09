import React, { useState } from 'react';
import { ShoppingBag, MapPin, Loader2, AlertTriangle, Search, Lock } from 'lucide-react';
import { Supplier, ErrorState } from '../types';

interface FindChefProps {
  onFindChefs: () => void;
  chefs: Supplier[] | null;
  isLoading: boolean;
  error: ErrorState | null;
  isPro: boolean;
}

const FindChef: React.FC<FindChefProps> = ({ onFindChefs, chefs, isLoading, error, isPro }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChefs = chefs?.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="find-chef-section" aria-labelledby="find-chef-title" className="mt-16 animate-slide-in" style={{ animationDelay: '0.5s' }}>
      <div className="text-center">
        <h2 id="find-chef-title" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 mr-3 text-primary-500" />
          Find Local Suppliers
        </h2>
        <p className="mt-2 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
          Need ingredients or partners? Discover local wholesalers, specialty suppliers, and catering services.
        </p>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onFindChefs}
          disabled={isLoading || !isPro}
          className="w-full max-w-xs inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              {isPro ? <Search className="mr-2 h-5 w-5" /> : <Lock className="mr-2 h-5 w-5" />}
              <span>{isPro ? 'Search for Suppliers Near Me' : 'Upgrade to Pro to Search'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div role="alert" className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400 flex-shrink-0 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">{error.title}</h3>
              <div className="text-sm text-red-700 dark:text-red-300 mt-1">{error.message}</div>
            </div>
          </div>
        </div>
      )}

      {chefs && chefs.length > 0 && isPro && (
        <div className="mt-8">
          <div className="mb-6 max-w-lg mx-auto">
            <label htmlFor="supplier-search" className="sr-only">
              Filter suppliers
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                id="supplier-search"
                name="search"
                className="block w-full rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                placeholder="Filter by name or specialty..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredChefs && filteredChefs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredChefs.map((supplier, index) => (
                <div key={index} className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">{supplier.name}</h4>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{supplier.specialty}</p>
                  </div>
                  {supplier.mapsUri && (
                    <a
                      href={supplier.mapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/40 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/60"
                    >
                      <MapPin size={16} className="mr-2" />
                      View on Google Maps
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
             <div className="mt-6 text-center text-slate-500 dark:text-slate-400">
                <p>No suppliers match your filter criteria.</p>
             </div>
          )}
        </div>
      )}
      
      {chefs && chefs.length === 0 && !isLoading && isPro && (
          <div className="mt-6 text-center text-slate-500 dark:text-slate-400">
              <p>No suppliers were found in your immediate area. Try expanding your search.</p>
          </div>
      )}
    </section>
  );
};

export default FindChef;
