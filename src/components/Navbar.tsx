
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
  onAuthClick?: () => void;
  user?: FirebaseUser | null;
}> = ({ whopUrl, facebookUrl, onThemeToggle, isDarkMode, onOpenSaved, savedCount, onOpenQrCode, onOpenInstall, onReset, onViewLanding, onViewPricing, onViewLibrary, onViewPartner, onAuthClick, user }) => (
  <nav role="navigation" aria-label="Main navigation" className="no-print bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 pt-[env(safe-area-inset-top)]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center h-20">
        <div 
            className={`flex items-center space-x-3 ${onViewLanding ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`} 
            onClick={onViewLanding}
            role={onViewLanding ? "button" : undefined}
            tabIndex={0}
        >
          <div className="relative">
             <ChefHat className="w-8 h-8 text-[#10b981]" aria-label="CaterProAi Logo Icon" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full animate-pulse"></div>
          </div>
          <div>
            <span className="text-2xl tracking-tighter whitespace-nowrap flex items-center">
              <span className="font-bold text-black">CaterPro</span>
              <span className="font-medium bg-gradient-to-br from-[#10b981] to-[#34d399] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]">Ai</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {onViewLibrary && (
            <button 
              onClick={onViewLibrary}
              className="p-3 rounded-xl text-slate-400 hover:text-[#10b981] hover:bg-slate-50 transition-all"
              title="Costing Library"
            >
              <Package size={22} />
            </button>
          )}

          {onViewPartner && (
            <button 
              onClick={onViewPartner}
              className="p-3 rounded-xl text-slate-400 hover:text-[#10b981] hover:bg-slate-50 transition-all"
              title="Partner Dashboard"
            >
              <Zap size={22} className="text-[#10b981]" />
            </button>
          )}

          <button onClick={onOpenSaved} className="relative p-3 rounded-xl text-slate-400 hover:text-[#10b981] hover:bg-slate-50 transition-all" aria-label={`Saved menus (${savedCount})`}>
            <Bookmark size={22} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#10b981] text-[10px] font-black text-black shadow-lg">{savedCount}</span>
            )}
          </button>
          
          <button 
            onClick={onAuthClick}
            className={`px-6 py-2.5 rounded-full flex items-center gap-2 transition-all font-bold text-sm uppercase tracking-widest ${user ? 'bg-slate-100 text-black hover:bg-slate-200' : 'bg-[#10b981] text-black hover:brightness-110 shadow-lg shadow-[#10b981]/20'}`}
            title={user ? "Sign Out" : "Sign In"}
          >
            {user ? <LogOut size={18} /> : <LogIn size={18} />}
            <span className="hidden md:inline">{user ? 'Sign Out' : 'Sign In'}</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
