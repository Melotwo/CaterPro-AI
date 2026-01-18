
import React from 'react';
import { ChefHat, Sun, Moon, Bookmark, Zap, Facebook, LogOut } from 'lucide-react';

const Navbar: React.FC<{
  whopUrl: string;
  facebookUrl?: string;
  onThemeToggle: () => void;
  isDarkMode: boolean;
  onOpenSaved: () => void;
  savedCount: number;
  onOpenQrCode: () => void;
  onOpenInstall: () => void;
  onReset?: () => void;
  onViewLanding?: () => void;
  onViewPricing?: () => void;
}> = ({ whopUrl, facebookUrl, onThemeToggle, isDarkMode, onOpenSaved, savedCount, onOpenQrCode, onOpenInstall, onReset, onViewLanding, onViewPricing }) => (
  <nav role="navigation" aria-label="Main navigation" className="no-print bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 pt-[env(safe-area-inset-top)]">
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        <div 
            className={`flex items-center space-x-3 ${onViewLanding ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`} 
            onClick={onViewLanding}
            role={onViewLanding ? "button" : undefined}
            tabIndex={0}
        >
          <div className="relative">
             <ChefHat className="w-8 h-8 text-primary-500" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <span className="hidden sm:inline text-xl font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">CaterPro AI</span>
            <span className="inline sm:hidden text-lg font-bold text-slate-800 dark:text-slate-200">CaterPro</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-4">
          {/* THEME TOGGLE - NOW FULLY VISIBLE */}
          <button 
            onClick={onThemeToggle} 
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105 transition-all border border-slate-200 dark:border-slate-700"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {facebookUrl && (
             <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:scale-105 transition-all border border-blue-100 dark:border-blue-800 hidden xs:flex"
              title="Facebook Community"
            >
              <Facebook size={18} />
            </a>
          )}

           {onViewPricing && (
            <button 
                onClick={onViewPricing} 
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors border border-amber-200 dark:border-amber-700 shadow-sm" 
                title="View Plans"
            >
                <Zap size={16} className="fill-amber-400" />
                <span className="hidden md:inline">Upgrade</span>
            </button>
          )}

          <button onClick={onOpenSaved} className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-all" aria-label={`Saved menus (${savedCount})`}>
            <Bookmark size={20} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-black text-white shadow-lg">{savedCount}</span>
            )}
          </button>
          
          {onReset && (
            <button onClick={onReset} className="p-2 rounded-full text-slate-400 hover:text-red-500 transition-colors" title="Sign Out">
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
