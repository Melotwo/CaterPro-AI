import React, { useState } from 'react';
import { generateMenuFromApi, generateMenuImageFromApi } from '../services/geminiService';
import { Menu, MenuItem } from '../types';

interface NewProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuGenerated: (menu: Menu) => void;
  region: string;
}

export const NewProposalModal: React.FC<NewProposalModalProps> = ({
  isOpen,
  onClose,
  onMenuGenerated,
  region
}) => {
  const [eventType, setEventType] = useState('Cocktail Party');
  const [customEventType, setCustomEventType] = useState('');
  const [guestCount, setGuestCount] = useState(50);
  const [budget, setBudget] = useState('Standard (R250-R500pp)');
  const [cuisine, setCuisine] = useState('Mediterranean');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(['Keto', 'Gluten-Free']);
  const [specialDietaryNotes, setSpecialDietaryNotes] = useState('');
  const [generating, setGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Chef AI is drafting your menu...');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    const effectiveEventType = eventType === 'Other' ? (customEventType.trim() || 'Special Event') : eventType;
    setGenerating(true);
    setError(null);
    setStatusMessage('Chef AI is calculating recipe quantities & pricing in ZAR...');

    try {
      const response = await generateMenuFromApi({
        eventType: effectiveEventType,
        guestCount,
        budget,
        cuisine,
        region,
        dietaryRestrictions,
        specialDietaryNotes,
        onProgress: (msg) => setStatusMessage(msg)
      });

      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to formulate menu.');
      }

      const menuData = response.data;
      const menuItems: MenuItem[] = [
        ...(menuData.appetizers || []).map((m: any) => ({ ...m, cat: 'Appetizers' })),
        ...(menuData.mainCourses || []).map((m: any) => ({ ...m, cat: 'Main Courses' })),
        ...(menuData.desserts || menuData.dessert || []).map((m: any) => ({ ...m, cat: 'Desserts' }))
      ];

      const totalDishPrice = menuItems.reduce((sum, m) => sum + (m.price || 0), 0);
      const deliveryFee = menuData.logistics?.deliveryFee || 1200;
      const totalRevenue = (totalDishPrice * guestCount) + deliveryFee;

      const newProposal: any = {
        title: menuData.menuTitle || `${effectiveEventType} Proposal`,
        description: menuData.description || 'A custom tailored culinary experience.',
        menu: menuItems,
        miseEnPlace: menuData.miseEnPlace || [],
        serviceNotes: menuData.serviceNotes || [],
        deliveryLogistics: menuData.deliveryLogistics || [],
        logistics: menuData.logistics || { deliveryFee },
        guestCount: guestCount,
        covers: guestCount,
        eventType: effectiveEventType,
        beoNumber: `BEO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        roomLocation: 'Main Dining Room & Terrace',
        eventDate: new Date().toISOString().split('T')[0],
        allergenMatrix: menuData.allergenMatrix || [],
        shoppingList: menuData.shoppingList || [],
        manualTotal: totalRevenue,
        manualPerHead: totalDishPrice || 450,
        heroImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80'
      };

      try {
        const heroImg = await generateMenuImageFromApi(newProposal.title, effectiveEventType, cuisine);
        if (heroImg) newProposal.heroImage = heroImg;
      } catch (imgErr) {
        console.warn('Hero image generation fallback used');
      }

      onMenuGenerated(newProposal);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Generation issue. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const dietOptions = ['Gluten-Free', 'Halal', 'Keto', 'Vegan', 'Vegetarian', 'Nut-Free', 'Dairy-Free', 'Low-Sodium'];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">
              Draft New Catering Proposal
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Provide event specifications. Chef AI will engineer recipes, ZAR costing, and SANS 10330 safety.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
              >
                <option>Cocktail Party</option>
                <option>Banquet</option>
                <option>Wedding Reception</option>
                <option>Corporate Gala</option>
                <option>Private Chef Dinner</option>
                <option>Braai & BBQ Experience</option>
                <option>High Tea</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Guest Count
              </label>
              <input
                type="number"
                min="5"
                max="2000"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Cuisine Style
              </label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
              >
                <option>Mediterranean</option>
                <option>South African</option>
                <option>Modern European Banquet</option>
                <option>Asian Fusion</option>
                <option>BBQ & Braai</option>
                <option>French Classical</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Budget Tier
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
              >
                <option>Budget (R150-R250pp)</option>
                <option>Standard (R250-R500pp)</option>
                <option>Premium (R500-R1000pp)</option>
                <option>Executive (R1000pp+)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Dietary Guidelines
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {dietOptions.map(diet => {
                const isSelected = dietaryRestrictions.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setDietaryRestrictions(dietaryRestrictions.filter(d => d !== diet));
                      } else {
                        setDietaryRestrictions([...dietaryRestrictions, diet]);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{diet}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={specialDietaryNotes}
              onChange={(e) => setSpecialDietaryNotes(e.target.value)}
              placeholder="Special instructions: e.g. 5 Halal meals, zero peanut cross-contact"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm flex flex-col items-center justify-center gap-1 disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <span>{generating ? '⏳' : '⚡'}</span>
            <span>{generating ? 'Chef AI is Formulating...' : 'Generate Catering Proposal'}</span>
          </div>
          {generating && (
            <span className="text-[11px] text-emerald-200 font-normal">{statusMessage}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NewProposalModal;
