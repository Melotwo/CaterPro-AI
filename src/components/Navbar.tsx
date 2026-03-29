
import React from 'react';
import { ChefHat, Sun, Moon, Bookmark, Zap, Facebook, LogOut, Package, User, LogIn } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

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
  onViewLibrary?: () => void;
  onViewPartner?: () => void;
  onViewSuccess?: () => void;
  onAuthClick?: () => void;
  user?: FirebaseUser | null;
}> = ({ whopUrl, facebookUrl, onThemeToggle, isDarkMode, onOpenSaved, savedCount, onOpenQrCode, onOpenInstall, onReset, onViewLanding, onViewPricing, onViewLibrary, onViewPartner, onViewSuccess, onAuthClick, user }) => (
  <nav role="navigation" aria-label="Main navigation" className="no-print bg-white sticky top-0 z-50 border-b border-slate-200 pt-[env(safe-area-inset-top)] shadow-sm">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center h-24">
        <div 
            className={`flex items-center space-x-4 ${onViewLanding ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`} 
            onClick={onViewLanding}
            role={onViewLanding ? "button" : undefined}
            tabIndex={0}
        >
          <div className="relative group">
             <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <ChefHat className="w-10 h-10 text-emerald-600 relative z-10" aria-label="CaterProAi Logo Icon" />
             <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-charcoal rounded-full animate-pulse border-2 border-white"></div>
          </div>
          <div>
            <span className="text-3xl tracking-tighter whitespace-nowrap flex items-center font-anchor uppercase">
              <span className="text-charcoal">CaterPro</span>
              <span className="bg-gradient-to-br from-emerald-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">Ai</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-6">
          {onViewLibrary && (
            <button 
              onClick={onViewLibrary}
              className="p-3.5 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-500/5 transition-all group"
              title="Costing Library"
            >
              <Package size={24} className="group-hover:scale-110 transition-transform" />
            </button>
          )}

          {onViewPartner && (
            <button 
              onClick={onViewPartner}
              className="p-3.5 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-500/5 transition-all group"
              title="Partner Dashboard"
            >
              <Zap size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
            </button>
          )}

          {onViewSuccess && (
            <button 
              onClick={onViewSuccess}
              className="px-6 py-3 rounded-full border border-slate-200 text-[#000000] hover:border-emerald-500 hover:text-emerald-600 transition-all font-anchor text-[10px] uppercase tracking-[0.2em] bg-white shadow-sm opacity-100"
              title="My Results"
            >
              My Results
            </button>
          )}

          <button onClick={onOpenSaved} className="relative p-3.5 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-500/5 transition-all group" aria-label={`Saved menus (${savedCount})`}>
            <Bookmark size={24} className="group-hover:scale-110 transition-transform" />
            {savedCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-lg border-2 border-white">{savedCount}</span>
            )}
          </button>
          
          <button 
            onClick={onAuthClick}
            className={`px-8 py-3.5 rounded-full flex items-center gap-3 transition-all font-anchor text-xs uppercase tracking-[0.2em] shadow-2xl ${user ? 'bg-slate-100 text-[#000000] hover:bg-slate-200' : 'bg-[#FFD700] text-[#000000] hover:bg-amber-400 shadow-amber-200/20'}`}
            title={user ? "Sign Out" : "Sign In"}
          >
            {user ? <LogOut size={20} className="text-[#000000]" /> : <LogIn size={20} className="text-[#000000]" />}
            <span className="hidden lg:inline text-[#000000] opacity-100">{user ? 'Sign Out' : 'Sign In'}</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
