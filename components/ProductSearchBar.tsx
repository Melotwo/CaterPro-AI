import React from 'react';
import { Search } from 'lucide-react';

interface ProductSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mt-8 mb-4 max-w-lg mx-auto">
      <label htmlFor="product-search" className="sr-only">
        Search for products
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
        <input
          id="product-search"
          name="search"
          className="block w-full rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
          placeholder="Search supplies by name..."
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProductSearchBar;
