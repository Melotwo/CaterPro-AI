import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Plus, 
  Sparkles, 
  Check, 
  X, 
  Info, 
  Coins, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { CustomSupplier, CustomSupplierItem } from '../types';

interface CustomSupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSupplier: (supplier: CustomSupplier) => void;
  initialLocation?: string;
  defaultCategory?: 'produce' | 'meat' | 'seafood' | 'dairy' | 'bakery' | 'beverage' | 'equipment' | 'specialty';
}

const CATEGORY_OPTIONS: Array<{
  id: 'produce' | 'meat' | 'seafood' | 'dairy' | 'bakery' | 'beverage' | 'equipment' | 'specialty';
  label: string;
  emoji: string;
}> = [
  { id: 'meat', label: 'Wholesale Butchery & Meats', emoji: '🥩' },
  { id: 'produce', label: 'Fresh Produce & Farming', emoji: '🥬' },
  { id: 'seafood', label: 'Ocean & Seafood Merchants', emoji: '🦐' },
  { id: 'dairy', label: 'Artisan Dairy & Cheese', emoji: '🧀' },
  { id: 'bakery', label: 'Bakery & Grains', emoji: '🥖' },
  { id: 'beverage', label: 'Beverage Distributors', emoji: '🍷' },
  { id: 'equipment', label: 'Foodservice Depot / Cash & Carry', emoji: '🍳' },
  { id: 'specialty', label: 'Gourmet Specialty Importers', emoji: '✨' },
];

export const CustomSupplierFormModal: React.FC<CustomSupplierFormModalProps> = ({
  isOpen,
  onClose,
  onSaveSupplier,
  initialLocation = 'Mokopane, Limpopo',
  defaultCategory = 'meat'
}) => {
  const [name, setName] = useState('');
  const [phoneOrWhatsApp, setPhoneOrWhatsApp] = useState('+27 ');
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState<'produce' | 'meat' | 'seafood' | 'dairy' | 'bakery' | 'beverage' | 'equipment' | 'specialty'>(defaultCategory);
  const [suppliedItemsText, setSuppliedItemsText] = useState("Lamb Mince @ R110/kg");
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Helper parser for "Lamb Mince @ R110/kg, Beef Fillet @ R195/kg" or newline entries
  const parseSuppliedItems = (text: string): CustomSupplierItem[] => {
    const lines = text.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
    const parsed: CustomSupplierItem[] = [];

    for (const line of lines) {
      // Regex matches "Item Name @ R110/kg" or "Item Name - R110 per kg" or "Item Name R110/kg"
      const match = line.match(/(.+?)(?:@|-|:|\bat\b)?\s*R?\s*(\d+(?:\.\d+)?)\s*(?:\/|\s*per\s*)?\s*([a-zA-Z]+)?/i);
      if (match) {
        const itemName = match[1].trim().replace(/^[-*•\s]+/, '');
        const unitCost = parseFloat(match[2]);
        const unit = (match[3] || 'kg').toLowerCase().trim();
        parsed.push({
          itemName: itemName || 'Custom Sourced Item',
          unitCost: isNaN(unitCost) ? 0 : unitCost,
          unit: unit || 'kg',
          category,
          notes: line
        });
      } else if (line.trim()) {
        parsed.push({
          itemName: line.trim(),
          unitCost: 0,
          unit: 'unit',
          category,
          notes: line
        });
      }
    }

    return parsed.length > 0 ? parsed : [
      { itemName: text.trim() || 'Custom Provisions', unitCost: 110, unit: 'kg', category }
    ];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a Supplier Name (e.g. Uncle Joe\'s Meat Market).');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please enter a Location / Town (e.g. Mokopane).');
      return;
    }

    const parsedItems = parseSuppliedItems(suppliedItemsText);
    const selectedCategoryConfig = CATEGORY_OPTIONS.find(c => c.id === category);

    const newSupplier: CustomSupplier = {
      id: `custom-supp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      phoneOrWhatsApp: phoneOrWhatsApp.trim() || '+27',
      location: location.trim(),
      category,
      categoryLabel: selectedCategoryConfig?.label || 'Direct Custom Supplier',
      suppliedItems: parsedItems,
      rawText: suppliedItemsText.trim(),
      addedAt: new Date().toISOString(),
      isCustomFallback: true,
      notes: notes.trim()
    };

    onSaveSupplier(newSupplier);
    onClose();
  };

  const handleApplyPresetExample = () => {
    setName("Uncle Joe's Meat Market");
    setPhoneOrWhatsApp("+27 82 555 1234");
    setLocation("Mokopane, Limpopo");
    setCategory("meat");
    setSuppliedItemsText("Lamb Mince @ R110/kg\nBushveld Beef Fillet @ R195/kg\nFarmhouse Boerewors @ R95/kg");
    setNotes("Direct local butcher. Next-day delivery to Waterberg & Mokopane venues. Halal certified slaughter.");
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-teal-500/30">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>Add Custom Local Supplier</span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-lime-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Unlisted Fallback
                </span>
              </h3>
              <p className="text-[11px] text-teal-200 font-medium">
                Not on Google Maps? Save direct rates immediately into the active proposal cost model.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Example Button Bar */}
        <div className="px-4 py-2.5 bg-teal-50/70 border-b border-teal-100 flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] font-bold text-teal-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Quick Example Preset (Uncle Joe's Meat Market):
          </span>
          <button
            type="button"
            onClick={handleApplyPresetExample}
            className="text-[10px] font-black uppercase tracking-wider bg-white hover:bg-teal-100 text-teal-800 border border-teal-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            Load Example
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs font-bold text-slate-700 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Supplier Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>1. Supplier / Business Name *</span>
              <span className="text-slate-400 font-normal">e.g. Uncle Joe's Meat Market</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Uncle Joe's Meat Market"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Grid: Phone/WhatsApp + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Phone / WhatsApp */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>2. Phone / WhatsApp Number *</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={phoneOrWhatsApp}
                  onChange={(e) => setPhoneOrWhatsApp(e.target.value)}
                  placeholder="e.g. +27 82 555 1234"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Location / Town */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>3. Location / Town *</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mokopane, Limpopo"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Business Category Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              4. Business Wholesale Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-2xs font-black'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold'
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-[10px] truncate">{cat.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Supplied Items & Direct Unit Costs Template */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-lime-600" />
                <span>5. Supplied Items & Direct Unit Costs *</span>
              </label>
              <span className="text-[9px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Format: [Item] @ R[Price]/[Unit]
              </span>
            </div>
            
            <textarea
              rows={3}
              required
              value={suppliedItemsText}
              onChange={(e) => setSuppliedItemsText(e.target.value)}
              placeholder="e.g. Lamb Mince @ R110/kg&#10;Salmon Fillets @ R280/kg&#10;Extra Virgin Olive Oil @ R140/L"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all leading-relaxed"
            />
            
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              💡 <strong>Example:</strong> Enter <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-800 font-bold">Lamb Mince @ R110/kg</code>. CaterProAI will parse and link this unit rate directly to dishes like Lamb Koftas, Bobotie, and Bolognese for accurate per-plate costing.
            </p>
          </div>

          {/* Optional Delivery / HACCP Notes */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              6. Chef / Logistics Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Next-day refrigerated drop; Halal certified; 24h notice required"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-lime-500 to-teal-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save into Active Cost Model</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
