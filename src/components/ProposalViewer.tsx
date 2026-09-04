import React, { useState, useMemo } from 'react';
import { Menu, MenuItem } from '../types';

interface ProposalViewerProps {
  proposal: Menu;
  onUpdateProposal: (updated: Menu) => void;
  onOpenBeo: () => void;
  onOpenUpgrade: () => void;
  onExportPdf: () => void;
  onOpenSocialModal?: (mode: 'create' | 'reel' | 'status') => void;
}

export const ProposalViewer: React.FC<ProposalViewerProps> = ({
  proposal,
  onUpdateProposal,
  onOpenBeo,
  onOpenUpgrade,
  onExportPdf,
  onOpenSocialModal
}) => {
  const [guestCount, setGuestCount] = useState<number>(proposal.guestCount || 50);
  const [perHeadPrice, setPerHeadPrice] = useState<number>(proposal.manualPerHead || 450);
  const [deliveryFee, setDeliveryFee] = useState<number>(proposal.logistics?.deliveryFee || 1200);
  const [requireDeposit, setRequireDeposit] = useState<boolean>(true);
  const [isBulkEditing, setIsBulkEditing] = useState<boolean>(false);

  // Group dishes by category
  const appetizers = useMemo(() => {
    return (proposal.menu || []).filter(m => (m.cat || '').toLowerCase().includes('appetiz') || (m.cat || '').toLowerCase().includes('starter'));
  }, [proposal.menu]);

  const mains = useMemo(() => {
    return (proposal.menu || []).filter(m => (m.cat || '').toLowerCase().includes('main'));
  }, [proposal.menu]);

  const desserts = useMemo(() => {
    return (proposal.menu || []).filter(m => (m.cat || '').toLowerCase().includes('dessert'));
  }, [proposal.menu]);

  // Group shopping list items by supplier
  const groupedSuppliers = useMemo(() => {
    const list = proposal.shoppingList || [];
    const groups: { [supplier: string]: typeof list } = {};
    list.forEach(item => {
      const sup = item.supplier || 'General Market';
      if (!groups[sup]) groups[sup] = [];
      groups[sup].push(item);
    });
    return groups;
  }, [proposal.shoppingList]);

  // Sourcing procurement total
  const estimatedSourcingTotal = useMemo(() => {
    const list = proposal.shoppingList || [];
    let sum = 0;
    list.forEach(i => {
      const match = (i.estCost || '').replace(/[^0-9.]/g, '');
      const num = parseFloat(match);
      if (!isNaN(num)) sum += num;
    });
    return sum > 0 ? sum : 2250;
  }, [proposal.shoppingList]);

  const totalValue = useMemo(() => {
    return (perHeadPrice * guestCount) + deliveryFee;
  }, [perHeadPrice, guestCount, deliveryFee]);

  const depositAmount = useMemo(() => {
    return totalValue * 0.5;
  }, [totalValue]);

  return (
    <div id="proposal-document-root" className="space-y-12 text-left">
      {/* The Master White Proposal Card Container */}
      <div id="proposal-content" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 md:p-12 space-y-10">
        
        {/* Proposal Document Header */}
        <div className="space-y-4 border-b border-slate-100 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
              CATERPRO AI PROPOSAL • {proposal.eventDate || '12/27/2025'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {proposal.title || proposal.menuTitle || 'Mediterranean Keto Cocktail Soirée'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-4xl">
            {proposal.description || 'An elegant, low-carb Mediterranean menu designed for high-end cocktail service, focusing on healthy fats, premium proteins, and fresh herbs.'}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>{guestCount} Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{proposal.roomLocation || 'Garden Terrace & Sunset Pavilion'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📋</span>
              <span className="text-emerald-700">{proposal.beoNumber || 'BEO-2025-8842'}</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-200 aspect-[21/9] max-h-96">
          <img
            src={proposal.heroImage || 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80'}
            alt={proposal.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">
            High Seas Standard • Verified 2026
          </div>
        </div>

        {/* The 10 Numbered Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. Appetizers / Starters */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Appetizers / Starters</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Butler Passed</span>
            </div>
            <div className="space-y-3">
              {(appetizers.length > 0 ? appetizers : (proposal.menu || []).slice(0, 3)).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.dish}</span>
                    {item.price && <span className="text-[11px] font-bold text-emerald-700">R{item.price}</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 italic leading-relaxed">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Main Courses */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Main Courses</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plated / Station</span>
            </div>
            <div className="space-y-3">
              {(mains.length > 0 ? mains : (proposal.menu || []).slice(3, 6)).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.dish}</span>
                    {item.price && <span className="text-[11px] font-bold text-emerald-700">R{item.price}</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 italic leading-relaxed">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Side Dishes */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Side Dishes</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Family Style</span>
            </div>
            <div className="space-y-3">
              {((proposal as any).sideDishes || [
                "Grilled Halloumi and Shaved Zucchini Ribbon Salad with Fresh Mint & Lemon Vinaigrette",
                "Roasted Cauliflower Florets with Creamy Sesame Tahini, Pomegranate & Toasted Pine Nuts"
              ]).map((side: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{side}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Dessert */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Dessert</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shooters & Bites</span>
            </div>
            <div className="space-y-3">
              {(desserts.length > 0 ? desserts : (proposal.menu || []).slice(6, 8)).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.dish}</span>
                    {item.price && <span className="text-[11px] font-bold text-emerald-700">R{item.price}</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 italic leading-relaxed">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Dietary Accommodations */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">5</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Dietary Accommodations</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Keto & Allergen Safe</span>
            </div>
            <div className="space-y-2">
              {((proposal as any).dietaryNotes || [
                "Strictly Ketogenic: Under 12g net carbohydrates per guest serving across all courses.",
                "100% Grain-Free & Certified Gluten-Free preparation environment.",
                "Nut-aware service protocol: Walnuts and pine nuts prepared in isolated prep stations.",
                "Diabetic-friendly: Zero refined sugar, honey, or high-glycemic sweeteners."
              ]).map((note: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-600 font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Beverage Pairings */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">6</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Beverage Pairings</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sommelier Notes</span>
            </div>
            <div className="space-y-3">
              {((proposal as any).beveragePairings || [
                { dish: "Prosciutto Asparagus", pairing: "Steenberg 1682 Brut Chardonnay Cap Classique" },
                { dish: "Za'atar Salmon", pairing: "Springfield Estate Life from Stone Sauvignon Blanc" },
                { dish: "Beef & Lamb Skewers", pairing: "Kanonkop Kadette Cabernet Sauvignon Blend" },
                { dish: "Cocktail Special", pairing: "Keto Cucumber-Mint Gin Spritz with Sugar-Free Indian Tonic" }
              ]).map((item: any, idx: number) => (
                <div key={idx} className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900">{item.dish || item.course}:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">{item.pairing || item.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Mise en Place */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">7</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Mise en Place</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prep Schedule</span>
            </div>
            <div className="space-y-2">
              {(proposal.miseEnPlace || [
                "Marinate Karoo lamb with roasted cumin, garlic, and sea salt 24 hours prior.",
                "Prepare cucumber-dill tzatziki and Lebanese garlic toum 12 hours prior.",
                "Blanch asparagus spears in salted boiling water for 90 seconds, shock in ice bath.",
                "Portion Atlantic salmon into 120g cocktail loins; rub skin-side with za'atar spice blend.",
                "Hull fresh strawberries and pipe vanilla mascarpone filling 3 hours prior; keep chilled at 3°C."
              ]).map((step: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-600 font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-400 font-mono text-[10px] shrink-0 mt-0.5">[{idx + 1}]</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Service & Plating Notes */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">8</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Service & Plating Notes</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Front of House</span>
            </div>
            <div className="space-y-2">
              {(proposal.serviceNotes || [
                "Passed tray service with butler-style circulating platters for appetizers during initial 90 minutes.",
                "Stationary display with heat lamps and live carving service for beef skewers and grilled chicken.",
                "Tiered black slate boards accented with micro-greens and fresh citrus quarters for main proteins.",
                "White-glove beverage service with continuous Cap Classique and sparkling spring water replenishment."
              ]).map((note: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-600 font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 9. Delivery & Logistics */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">9</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Delivery & Logistics</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cold Chain Active</span>
            </div>
            <div className="space-y-2">
              {(proposal.deliveryLogistics || [
                "Refrigerated transport vehicle maintained strictly between 2°C and 4°C throughout transit.",
                "On-site arrival 90 minutes prior to guest reception for kitchen station setup and warming.",
                "Zoned drop-off within Cape Town Atlantic Seaboard / City Bowl zone.",
                "Post-service breakdown, clearing, and eco-friendly organic waste compost bin removal included."
              ]).map((log: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-600 font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-blue-600 font-bold">🚚</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 10. Shopping List & Sourcing */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4 md:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">10</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Shopping List & Wholesale Sourcing</h3>
              </div>
              <button
                onClick={() => setIsBulkEditing(!isBulkEditing)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs"
              >
                {isBulkEditing ? 'Done Editing' : 'Bulk Edit'}
              </button>
            </div>

            {/* Supplier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(groupedSuppliers).map(([supplierName, items], sIdx) => (
                <div key={sIdx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">{supplierName}</span>
                    <span className="text-[10px] font-bold text-slate-400">{items.length} items</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((it, iIdx) => (
                      <div key={iIdx} className="text-[11px] flex justify-between items-start gap-2">
                        <span className="text-slate-700 font-medium">{it.item}</span>
                        <span className="text-slate-500 font-mono text-[10px] shrink-0">{it.estCost || it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Procurement Summary Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Procurement Summary</span>
                <p className="text-xs text-emerald-900 font-medium">
                  Estimated Sourcing Total (ZAR wholesale market benchmark):
                </p>
              </div>
              <span className="text-lg font-black text-emerald-700">
                ZAR {estimatedSourcingTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

        </div>

        {/* Financial Proposal Value & Quote Builder */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Financial Execution</span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1">Total Proposal Value</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                ZAR {totalValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                Based on {guestCount} guests • Incl. logistics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Price Per Head (ZAR)
              </label>
              <input
                type="number"
                value={perHeadPrice}
                onChange={(e) => setPerHeadPrice(Number(e.target.value))}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Logistics & Transport Fee (ZAR)
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                50% Booking Deposit
              </label>
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold">Required (50%)</span>
                <span className="text-xs font-black text-emerald-400">
                  ZAR {depositAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statutory Allergen & Dietary Matrix */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Statutory Allergen & Dietary Matrix (SANS 10330 HACCP)
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Health Inspection Defensible
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Dish / Component</th>
                  <th className="p-3 text-center">Gluten</th>
                  <th className="p-3 text-center">Dairy</th>
                  <th className="p-3 text-center">Nuts</th>
                  <th className="p-3 text-center">Eggs</th>
                  <th className="p-3 text-center">Fish/Shellfish</th>
                  <th className="p-3 text-center">Dietary Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(proposal.allergenMatrix || []).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{row.dish}</td>
                    <td className="p-3 text-center">{row.gluten ? '⚠️ Yes' : '✓ Safe'}</td>
                    <td className="p-3 text-center">{row.dairy ? '⚠️ Yes' : '✓ Safe'}</td>
                    <td className="p-3 text-center">{row.nuts ? '⚠️ Yes' : '✓ Safe'}</td>
                    <td className="p-3 text-center">{row.eggs ? '⚠️ Yes' : '✓ Safe'}</td>
                    <td className="p-3 text-center">{row.fish || row.shellfish ? '⚠️ Yes' : '✓ Safe'}</td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                        {(row.dietary || ['Keto', 'Gluten-Free']).join(', ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Primary Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 border-t border-slate-100">
          <button
            onClick={onExportPdf}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>📥</span> Download Proposal PDF
          </button>

          <button
            onClick={onOpenBeo}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>📋</span> Export Banquet Event Order (BEO)
          </button>

          <button
            onClick={onOpenUpgrade}
            className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>💳</span> Hotel Pro Upgrade
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProposalViewer;
