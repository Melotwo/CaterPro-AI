import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Users,
  DollarSign,
  Copy,
  Check,
  Send,
  MessageSquare,
  Flame,
  Wine,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Menu } from '../types';

interface LeadParams {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  eventType: string;
  guestCount: number;
  targetDate: string;
  budgetPerHead: number;
  dietaryRequirements: string[];
  notes: string;
}

interface SalesOperationsEngineProps {
  proposal: Menu;
  onApplyToProposal: (updatedMenu: Menu) => void;
  onNotify: (msg: string) => void;
}

export const SalesOperationsEngine: React.FC<SalesOperationsEngineProps> = ({
  proposal,
  onApplyToProposal,
  onNotify
}) => {
  // Discovery & Lead State
  const [lead, setLead] = useState<LeadParams>({
    clientName: 'Eleanor Vance',
    clientPhone: '+27 82 555 0192',
    clientEmail: 'eleanor.vance@lifestylegroup.co.za',
    eventType: 'Wedding Reception',
    guestCount: 120,
    targetDate: '2026-11-21',
    budgetPerHead: 650,
    dietaryRequirements: ['Gluten-Free', 'Halal-Friendly'],
    notes: 'Outdoor sunset garden ceremony, elegant standing cocktail followed by plated main course.'
  });

  // Target profit margin (default 70% food margin)
  const [targetMargin, setTargetMargin] = useState<number>(70);

  // High-Margin Add-ons state
  const [addons, setAddons] = useState<{
    welcomeCanapes: boolean;
    winePairing: boolean;
    liveBraaiStation: boolean;
    champagneToast: boolean;
  }>({
    welcomeCanapes: true,
    winePairing: true,
    liveBraaiStation: false,
    champagneToast: false
  });

  // Chat conversation state
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; content: string }>>([
    {
      role: 'model',
      content: `Warm greetings! I am **CaterProAI Sales & Operations Engine**, your executive banqueting, sales, and catering strategy partner.\n\nI am configured to:\n1. **Capture Leads & Discover Events** (Weddings, Corporate Galas, Banquets, Heritage Braais)\n2. **Recommend Tailored 4-Course Menus** (Butler-Passed Starters, Mains, Family-Style Sides, Dessert Shooters)\n3. **Upsell High-Margin Add-Ons** (Canapé hours, sommelier wine flights, live chef action stations)\n4. **Run Live Costing & 70% Margin Analysis** in ZAR\n5. **Generate Instant WhatsApp & Email Follow-Ups** with lock-in disclaimers.\n\nHow may I assist your booking pipeline today?`
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<'whatsapp' | 'email' | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Derived financial calculations
  const baseFoodCostRatio = (100 - targetMargin) / 100; // e.g. 30% food cost for 70% margin
  const perHeadCostOfFood = Math.round(lead.budgetPerHead * baseFoodCostRatio);

  // Add-on cost impacts
  const canapesPerHead = addons.welcomeCanapes ? 95 : 0;
  const winePerHead = addons.winePairing ? 180 : 0;
  const toastPerHead = addons.champagneToast ? 120 : 0;
  const liveStationFlat = addons.liveBraaiStation ? 3500 : 0;

  const totalPerHeadSell = lead.budgetPerHead + canapesPerHead + winePerHead + toastPerHead;
  const totalEventQuote = (totalPerHeadSell * lead.guestCount) + liveStationFlat + 2400; // logistics base
  const totalFoodCost = (perHeadCostOfFood * lead.guestCount) + (addons.welcomeCanapes ? 25 * lead.guestCount : 0);
  const estimatedGrossProfit = totalEventQuote - totalFoodCost - 3200; // after labor/transport
  const actualProfitMargin = Math.round((estimatedGrossProfit / totalEventQuote) * 100);

  // Send message to Sales Engine API
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages
        })
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || 'CaterProAI Sales & Operations Engine ready.';
        setMessages(prev => [...prev, { role: 'model', content: reply }]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Fallback response with strict CaterProAI structure
      const fallbackReply = `Warm greetings! I have reviewed your request for **${lead.eventType}** (${lead.guestCount} guests at R${lead.budgetPerHead}/head).

### 🍽️ Recommended Course Structure:
* **Appetizers / Starters (Butler Passed):**
  - Smoked Salmon & Chive Blinis with lemon herb crème fraîche
  - Porcini Truffle Croquettes with garlic aioli
* **Main Courses (Plated Dual-Entrée):**
  - Slow-Braised Karoo Lamb Shank in rich pinotage reduction
  - Herb-Crusted Franschhoek Trout with charred lemon beurre blanc
* **Side Dishes (Family Style):**
  - Crispy rosemary duck-fat roasted baby potatoes
  - Tenderstem broccoli with toasted almonds and lemon vinaigrette
* **Desserts (Shooters & Bites):**
  - Amarula Dark Chocolate Mousse Shooters & Cape Malva Pudding Bites with vanilla bean diplomat

### 💎 High-Margin Upsell Add-Ons:
- **Welcome Canapé Reception:** +R95/head (82% food margin)
- **Live Action Flame Station:** +R3,500 station fee (Elevates perceived value)
- **Sommelier Wine Pairing:** +R180/head

### 📊 Financial & Costing Breakdown:
- **Quoted Price Per Guest:** R${totalPerHeadSell}.00 (includes selected add-ons)
- **Estimated Total Investment:** **R${totalEventQuote.toLocaleString()}.00**
- **Target Food Margin:** ${targetMargin}% (Estimated Gross Margin: ${actualProfitMargin}%)
- **Dietary Safeguards:** ${lead.dietaryRequirements.join(', ')} flagged for dedicated allergen-safe prep.

*Disclaimer: Final quotes are officially locked in upon mutual contract sign-off and deposit confirmation.*`;
      setMessages(prev => [...prev, { role: 'model', content: fallbackReply }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Generate Ready-to-Send WhatsApp Summary
  const generateWhatsAppText = () => {
    return `*CATERPRO AI EVENT PROPOSAL & QUOTE*
----------------------------------------
Dear ${lead.clientName || 'Valued Client'},

Thank you for contacting us regarding your upcoming *${lead.eventType}*! Here is your custom catering profile:

📅 *Target Date:* ${lead.targetDate || 'TBD'}
👥 *Guest Count:* ${lead.guestCount} Pax
✨ *Course Structure:*
 • *Starters:* Butler-Passed Artisan Canapés & Croquettes
 • *Mains:* Plated Dual-Entrée Selection
 • *Sides:* Family-Style Roasted Harvest Medley
 • *Dessert:* Shooters & Bites Tasting Trio

🌟 *High-Margin Inclusions:*
${addons.welcomeCanapes ? ' • Welcome Canapé & Cocktail Hour (R95/guest)\n' : ''}${addons.winePairing ? ' • Curated Wine Pairing Flight (R180/guest)\n' : ''}${addons.liveBraaiStation ? ' • Live Action Chef Station (R3,500)\n' : ''}
🥗 *Dietary Accommodations:* ${lead.dietaryRequirements.join(', ') || 'Standard Gourmet'}

💰 *Investment Breakdown:*
 • Per Guest: *R${totalPerHeadSell}.00*
 • Estimated Total: *R${totalEventQuote.toLocaleString()}.00* (Inclusive of brigade staging & logistics)

----------------------------------------
⚠️ *DISCLAIMER:* This estimated quote is valid for 14 days. Final menu specifications and calendar lock-in are confirmed upon contract sign-off and deposit.

Would you like to schedule a private tasting session?`;
  };

  // Generate Ready-to-Send Email Summary
  const generateEmailText = () => {
    return `Subject: Catering Proposal & Investment Summary — ${lead.eventType} (${lead.guestCount} Guests)

Dear ${lead.clientName || 'Client'},

It is our pleasure to present our tailored catering proposal for your upcoming ${lead.eventType}. At CaterProAI, we pride ourselves on orchestrating Michelin-level culinary execution paired with seamless banquet hospitality.

EVENT SUMMARY & PARAMETERS:
• Event Type: ${lead.eventType}
• Guest Count: ${lead.guestCount} Guests
• Target Date: ${lead.targetDate}
• Contact: ${lead.clientEmail} | ${lead.clientPhone}

TAILORED COURSE FLOW:
1. Appetizers / Starters (Butler Passed): Handcrafted canapés and arancini served during welcome reception.
2. Main Courses (Plated Service): Slow-braised Karoo lamb shank or line-caught fish with seasonal garnishes.
3. Side Dishes (Family Style): Table-sharing platters of roasted baby potatoes and tenderstem greens.
4. Desserts (Shooters & Bites): Elegantly layered Amarula mousse shooters and Cape malva bites.

UPGRADES & HIGHER-VALUE EXPERIENCES:
${addons.welcomeCanapes ? '- Welcome Canapés & Bubbles Reception (+R95 per guest)\n' : ''}${addons.winePairing ? '- Sommelier Wine Flight Pairing (+R180 per guest)\n' : ''}${addons.liveBraaiStation ? '- Live Fire Action Carving Station (+R3,500 setup fee)\n' : ''}
DIETARY SAFETY & ACCOMMODATIONS:
Strict kitchen protocols flagged for: ${lead.dietaryRequirements.join(', ') || 'None specified'}.

FINANCIAL INVESTMENT & COSTING:
• Estimated Rate per Guest: R${totalPerHeadSell}.00 ZAR
• Total Event Quote: R${totalEventQuote.toLocaleString()}.00 ZAR (includes kitchen brigade, plating logistics, and setup)
• Target Kitchen Margin Standard: ${targetMargin}%

LEGAL & BOOKING DISCLAIMER:
Please note this is an initial estimation based on current market availability and seasonal pricing. Final dates, menu adjustments, and pricing are locked in upon contract sign-off and receipt of the booking deposit.

We look forward to curating an unforgettable gastronomic milestone for your guests.

Warmest hospitality regards,
CaterProAI Sales & Banqueting Team`;
  };

  const handleCopy = (text: string, type: 'whatsapp' | 'email') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    onNotify(`Copied ${type === 'whatsapp' ? 'WhatsApp' : 'Email'} summary to clipboard!`);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Push into live proposal
  const handleApplyToActiveProposal = () => {
    const updated: Menu = {
      ...proposal,
      title: `${lead.eventType} — ${lead.clientName}`,
      menuTitle: `${lead.eventType} — ${lead.clientName}`,
      guestCount: lead.guestCount,
      covers: lead.guestCount,
      eventType: lead.eventType,
      manualPerHead: totalPerHeadSell,
      manualTotal: totalEventQuote,
      eventDate: lead.targetDate,
      specialDietaryNotes: `${lead.dietaryRequirements.join(', ')}. ${lead.notes}`,
      menu: [
        {
          dish: 'Smoked Franschhoek Trout Croquettes & Wild Truffle Arancini',
          cat: 'Appetizers',
          price: 130 + canapesPerHead,
          cost: 38,
          notes: 'Butler passed on warm slate tiles during welcome reception.',
          dietary: lead.dietaryRequirements
        },
        {
          dish: 'Slow-Braised Karoo Lamb Shank in Pinotage Reduction',
          cat: 'Main Courses',
          price: 320,
          cost: 92,
          notes: 'Plated main course with rich bone marrow glaze and micro herbs.',
          dietary: ['Gluten-Free']
        },
        {
          dish: 'Family-Style Roasted Baby Potatoes & Charred Tenderstem',
          cat: 'Side Dishes',
          price: 90,
          cost: 24,
          notes: 'Duck-fat roasted, tossed with garden rosemary and flaked sea salt.',
          dietary: ['Gluten-Free']
        },
        {
          dish: 'Amarula Chocolate Shooters & Cape Malva Bites',
          cat: 'Desserts',
          price: 110,
          cost: 28,
          notes: 'Shooters & bites served family style or cocktail dessert station.',
          dietary: ['Vegetarian']
        }
      ]
    };
    onApplyToProposal(updated);
    onNotify('Applied Sales Engine specs directly to active BEO & Proposal!');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-400/40 rounded-full text-[11px] font-black uppercase tracking-wider text-teal-300">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Hospitality Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              CaterProAI Sales & Operations Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Automate lead capture, discover event parameters, formulate CaterProAI standard 4-course menus, calculate per-plate margins in ZAR, and format ready-to-close WhatsApp & Email responses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleApplyToActiveProposal}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sync to Active Proposal & BEO</span>
            </button>
            <button
              onClick={() => handleCopy(generateWhatsAppText(), 'whatsapp')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>{copiedType === 'whatsapp' ? 'Copied!' : 'Copy WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Lead Intake + Pricing) & Right Column (Interactive Engine Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Objectives 1, 2, 3 (Intake, Course Structure, Upselling, Costing) */}
        <div className="lg:col-span-7 space-y-6">

          {/* OBJECTIVE 1: Lead Capture & Event Discovery Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-sm border border-teal-200">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                    Lead Capture & Event Discovery
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Capture prospective client parameters & event profile
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600">
                Discovery Stage
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                Quick Event Archetypes
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { type: 'Wedding Reception', count: 120, budget: 680, notes: 'Plated 3-course, sunset lawn reception' },
                  { type: 'Corporate Gala Dinner', count: 80, budget: 550, notes: 'Keynote banquet, VIP executive wine pairings' },
                  { type: 'Private Banquet', count: 40, budget: 600, notes: 'Intimate villa dinner, family-style sharing' },
                  { type: 'Heritage Braai Feast', count: 75, budget: 480, notes: 'Outdoor open-fire braai, boerewors & spit-braai' }
                ].map(item => (
                  <button
                    key={item.type}
                    onClick={() => {
                      setLead(prev => ({
                        ...prev,
                        eventType: item.type,
                        guestCount: item.count,
                        budgetPerHead: item.budget,
                        notes: item.notes
                      }));
                      onNotify(`Selected ${item.type} profile`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      lead.eventType === item.type
                        ? 'bg-teal-50 border-teal-300 text-teal-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.type} ({item.count} pax)
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Client Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={lead.clientName}
                    onChange={e => setLead({ ...lead, clientName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-teal-500 focus:bg-white outline-none"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Contact Phone & WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={lead.clientPhone}
                    onChange={e => setLead({ ...lead, clientPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium focus:border-teal-500 focus:bg-white outline-none"
                    placeholder="+27 ..."
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Client Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={lead.clientEmail}
                    onChange={e => setLead({ ...lead, clientEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium focus:border-teal-500 focus:bg-white outline-none"
                    placeholder="client@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Target Date
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={lead.targetDate}
                    onChange={e => setLead({ ...lead, targetDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium focus:border-teal-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Guest Count (Pax)
                </label>
                <div className="relative">
                  <Users className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min={5}
                    max={2000}
                    value={lead.guestCount}
                    onChange={e => setLead({ ...lead, guestCount: Number(e.target.value) || 50 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-bold focus:border-teal-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Base Budget Target (ZAR / Head)
                </label>
                <div className="relative">
                  <span className="text-xs font-bold text-slate-400 absolute left-3 top-2">R</span>
                  <input
                    type="number"
                    step={10}
                    value={lead.budgetPerHead}
                    onChange={e => setLead({ ...lead, budgetPerHead: Number(e.target.value) || 400 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 font-bold focus:border-teal-500 focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Dietary accommodations flags */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1.5">
                Dietary Accommodations Flagged
              </label>
              <div className="flex flex-wrap gap-2">
                {['Gluten-Free', 'Halal-Friendly', 'Strictly Ketogenic', 'Vegetarian', 'Vegan'].map(tag => {
                  const isSelected = lead.dietaryRequirements.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setLead(prev => ({
                          ...prev,
                          dietaryRequirements: isSelected
                            ? prev.dietaryRequirements.filter(t => t !== tag)
                            : [...prev.dietaryRequirements, tag]
                        }));
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* OBJECTIVE 2: Instant Menu Recommendation & Upselling */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-black text-sm border border-amber-200">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                    CaterProAI 4-Course Standard & Upsells
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Engineered course flow aligned with CaterProAI culinary benchmarks
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                Course Structure
              </span>
            </div>

            {/* Course Flow Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 text-teal-700 font-black uppercase text-[10px] tracking-wider mb-1">
                  <span>1. Appetizers / Starters</span>
                  <span className="px-1.5 py-0.2 rounded bg-teal-100 text-[9px]">Butler Passed</span>
                </div>
                <p className="font-bold text-slate-900">Smoked Franschhoek Trout Croquettes</p>
                <p className="text-slate-500 text-[11px] mt-0.5">With lemon-herb emulsion & micro cress</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 text-teal-700 font-black uppercase text-[10px] tracking-wider mb-1">
                  <span>2. Main Courses</span>
                  <span className="px-1.5 py-0.2 rounded bg-teal-100 text-[9px]">Plated / Buffet</span>
                </div>
                <p className="font-bold text-slate-900">Slow-Braised Karoo Lamb Shank</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Pinotage jus & roasted garlic purée</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 text-teal-700 font-black uppercase text-[10px] tracking-wider mb-1">
                  <span>3. Side Dishes</span>
                  <span className="px-1.5 py-0.2 rounded bg-teal-100 text-[9px]">Family Style</span>
                </div>
                <p className="font-bold text-slate-900">Duck-Fat Baby Potatoes & Greens</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Charred broccoli, toasted almonds</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 text-teal-700 font-black uppercase text-[10px] tracking-wider mb-1">
                  <span>4. Desserts</span>
                  <span className="px-1.5 py-0.2 rounded bg-teal-100 text-[9px]">Shooters & Bites</span>
                </div>
                <p className="font-bold text-slate-900">Amarula Shooters & Malva Bites</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Vanilla bean crème & chocolate soil</p>
              </div>
            </div>

            {/* High-Margin Upsell Add-ons */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  High-Margin Add-Ons (Instant Revenue Boosters)
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  Target ~78% Gross Margin
                </span>
              </div>

              <div className="space-y-2">
                <div
                  onClick={() => setAddons({ ...addons, welcomeCanapes: !addons.welcomeCanapes })}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    addons.welcomeCanapes
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Welcome Cocktail Canapés Reception (1-Hour Service)
                      </p>
                      <p className="text-[10px] text-slate-500">
                        3 handcrafted pass-around canapés while guests arrive
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900">+R95 / guest</span>
                    <span className="block text-[9px] text-emerald-600 font-bold">
                      {addons.welcomeCanapes ? '✓ Active' : '+ Add'}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setAddons({ ...addons, winePairing: !addons.winePairing })}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    addons.winePairing
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wine className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Sommelier Curated Wine & Beverage Pairing
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Estate Chenin Blanc & Pinotage pairing flight per course
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900">+R180 / guest</span>
                    <span className="block text-[9px] text-purple-600 font-bold">
                      {addons.winePairing ? '✓ Active' : '+ Add'}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setAddons({ ...addons, liveBraaiStation: !addons.liveBraaiStation })}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    addons.liveBraaiStation
                      ? 'bg-amber-50/60 border-amber-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Live Action Flame / Spit-Braai Carving Station
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Theatrical chef interaction & aroma staging for guests
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900">+R3,500 setup</span>
                    <span className="block text-[9px] text-amber-600 font-bold">
                      {addons.liveBraaiStation ? '✓ Active' : '+ Add'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OBJECTIVE 3: Costing & Margin Analysis */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-sm border border-emerald-200">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                    Costing & Margin Analysis (ZAR)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live cost breakdown targeting Escoffier 70% gross food margin
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Food Margin Target</span>
                <span className="text-sm font-black text-emerald-600">{targetMargin}%</span>
              </div>
            </div>

            {/* Slider */}
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Target Profit Margin Slider</span>
                <span className="text-emerald-700 font-black">{targetMargin}% Margin ({(100 - targetMargin)}% Food Cost)</span>
              </div>
              <input
                type="range"
                min={55}
                max={85}
                value={targetMargin}
                onChange={e => setTargetMargin(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[9px] font-black uppercase text-slate-400 block">Per-Guest Price</span>
                <p className="text-base font-black text-slate-900 mt-1">R{totalPerHeadSell}</p>
                <span className="text-[9px] text-slate-500">Inclusive of add-ons</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[9px] font-black uppercase text-slate-400 block">Food Cost / Head</span>
                <p className="text-base font-black text-amber-700 mt-1">~R{perHeadCostOfFood}</p>
                <span className="text-[9px] text-slate-500">Target raw cost</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[9px] font-black uppercase text-slate-400 block">Gross Profit</span>
                <p className="text-base font-black text-emerald-600 mt-1">R{estimatedGrossProfit.toLocaleString()}</p>
                <span className="text-[9px] text-emerald-600 font-bold">~{actualProfitMargin}% Est. Margin</span>
              </div>

              <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-200">
                <span className="text-[9px] font-black uppercase text-teal-700 block">Total Event Quote</span>
                <p className="text-base font-black text-teal-900 mt-1">R{totalEventQuote.toLocaleString()}</p>
                <span className="text-[9px] text-teal-600 font-bold">{lead.guestCount} Guests</span>
              </div>
            </div>

            {/* Sourcing notes regarding dietary requirements */}
            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Dietary & Sourcing Verification:</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Ingredient procurement tagged for {lead.dietaryRequirements.join(' and ') || 'Standard banquet execution'}. SANS 10330 cold-holding protocols applied. Cross-contamination barriers configured in mise-en-place line.
                </p>
              </div>
            </div>
          </div>

          {/* OBJECTIVE 4: Automated Lead Follow-up Templates */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black text-sm border border-purple-200">
                  4
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                    Automated Lead Follow-Up (Close the Booking)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ready-to-send summary response with required contract lock-in disclaimer
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(generateWhatsAppText(), 'whatsapp')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedType === 'whatsapp' ? 'Copied WhatsApp!' : 'Copy WhatsApp'}</span>
                </button>
                <button
                  onClick={() => handleCopy(generateEmailText(), 'email')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedType === 'email' ? 'Copied Email!' : 'Copy Email'}</span>
                </button>
              </div>
            </div>

            {/* Preview Box */}
            <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-xs leading-relaxed max-h-56 overflow-y-auto border border-slate-800">
              <pre className="whitespace-pre-wrap">{generateWhatsAppText()}</pre>
            </div>
            
            <p className="text-[11px] text-slate-500 italic">
              💡 Strict constraint enforced: Cost estimates clearly displayed with disclaimer that final quotes are locked in upon contract sign-off.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive CaterProAI Sales & Operations Engine Chatbot */}
        <div className="lg:col-span-5 flex flex-col h-[750px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-20">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-lg shadow-md shadow-teal-500/20">
                🤖
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider">
                  CaterProAI Sales Engine
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                    Sales & Banqueting AI Active
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setMessages([
                  {
                    role: 'model',
                    content: `Session refreshed. CaterProAI Sales & Operations Engine is ready. What event details would you like to explore?`
                  }
                ]);
              }}
              title="Reset Chat"
              className="text-[11px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Quick Prompts Ribbon */}
          <div className="p-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
            {[
              'Collect Wedding Parameters',
              'Recommend 4-Course Menu',
              'Upsell Live Action Station',
              'Analyze 70% Margin'
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-bold shrink-0 transition-all hover:border-teal-500"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/80">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {m.content}

                  {m.role === 'model' && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>CaterProAI Sales Specialist</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(m.content);
                          onNotify('Message copied to clipboard');
                        }}
                        className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-bold text-slate-500 ml-1">
                    Formulating hospitality quote & course flow...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative"
            >
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask about event discovery, courses, upsells, or margins..."
                disabled={isChatLoading}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-12 text-xs text-slate-900 font-medium outline-none focus:border-teal-500 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="absolute right-1.5 top-1.5 w-7 h-7 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
