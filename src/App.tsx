import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  ChefHat, ShoppingCart, Calculator, 
  ClipboardList, Utensils, ArrowRight, 
  Loader2, Download, MessageSquare, X, 
  Send, Sparkles, Trophy, Package, Zap,
  ShieldCheck, FileText, ExternalLink,
  Percent, Info, GraduationCap, Briefcase,
  Camera
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- INFRASTRUCTURE IMPORTS ---
import { useAuth } from './hooks/useAuth';
import { useAppSubscription, SubscriptionPlan } from './hooks/useAppSubscription';
import Navbar from './Navbar.tsx';
import Footer from './Footer.tsx';
import AuthModal from './AuthModal.tsx';
import PricingPage from './PricingPage.tsx';
import CostingLibrary from './CostingLibrary.tsx';
import PartnerDashboard from './PartnerDashboard.tsx';
import PrivacyPolicy from './PrivacyPolicy.tsx';
import TermsOfService from './TermsOfService.tsx';
import { StudentYieldCalculator } from './StudentYieldCalculator.tsx';
import { generateMenuImageFromApi, extractIngredientsForShift } from './services/geminiService';
import { ShiftCalculatorModal } from './ShiftCalculatorModal.tsx';
import { SuccessPage } from './SuccessPage.tsx';
import { ProposalDocument } from './ProposalDocument.tsx';
import HeroSection from './HeroSection';
import Dashboard from './Dashboard';
import RecipeGenerator from './RecipeGenerator';
import AiChatBot from './AiChatBot.tsx';
import { ShiftIngredient } from './types';

// --- INITIALIZE GOOGLE AI ---
const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || "";
  return key;
};
const apiKey = getApiKey();

// --- UTILS ---
const formatCurrency = (amount: number) => {
  return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export default function App() {
  // --- STATE & HOOKS ---
  const { user, loading: authLoading } = useAuth();
  const { subscription, selectPlan, canAccessFeature, recordGeneration } = useAppSubscription();
  
  const [viewMode, setViewMode] = useState<'landing' | 'generator' | 'pricing' | 'library' | 'privacy' | 'partner' | 'terms' | 'success' | 'recipe-lab'>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  
  // Generator State
  const [guests, setGuests] = useState('50');
  const [style, setStyle] = useState('');
  const [dietary, setDietary] = useState('');
  const [eventType, setEventType] = useState('Corporate Event');
  const [apCost, setApCost] = useState(''); // As Purchased Cost for Waste/Yield
  const [epYield, setEpYield] = useState(''); // Edible Portion Yield %
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<any>(null);
  const [proposalImage, setProposalImage] = useState<string | null>(null);
  const [isTotalUpdating, setIsTotalUpdating] = useState(false);
  const [isShiftCalculatorOpen, setIsShiftCalculatorOpen] = useState(false);
  const [shiftIngredients, setShiftIngredients] = useState<ShiftIngredient[]>([]);
  const [isShiftLoading, setIsShiftLoading] = useState(false);
  
  const handleOpenShiftCalculator = async () => {
    if (!proposal?.miseEnPlace) return;
    setIsShiftLoading(true);
    try {
      const ingredients = await extractIngredientsForShift(proposal.miseEnPlace, proposal.menuTitle);
      setShiftIngredients(ingredients);
      setIsShiftCalculatorOpen(true);
    } catch (err) {
      console.error("Failed to extract ingredients:", err);
    } finally {
      setIsShiftLoading(false);
    }
  };

  const proposalRef = useRef<HTMLDivElement>(null);

  // Trigger animation on total change
  useEffect(() => {
    if (proposal) {
      setIsTotalUpdating(true);
      const timer = setTimeout(() => setIsTotalUpdating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [guests, proposal?.logistics?.deliveryFee]);

  // --- WHOP LINKS ---
  const whopLinks = {
    commis: "https://whop.com/checkout/plan_1",
    chefDePartie: "https://whop.com/checkout/plan_2",
    sousChef: "https://whop.com/checkout/plan_3",
    executive: "https://whop.com/checkout/plan_4"
  };

  // --- GENERATION LOGIC ---
  async function generateProposal() {
    if (!apiKey) {
      alert("Gemini API Key is missing. Please configure it in the settings.");
      return;
    }

    if (isTrainingMode && (!apCost || !epYield)) {
      alert("Please enter AP Cost and EP Yield for QCTO compliance.");
      return;
    }

    // Check subscription limits
    if (!recordGeneration()) return;

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const trainingContext = isTrainingMode ? `
      - TRAINING MODE ACTIVE: Categorize every recipe according to QCTO Occupational Certificate: Chef (ID 101697) modules (e.g., Module 5: Operational Cost Control).
      - Include a "qctoModule" field for each menu item.
      - Calculate the cost difference between AP (As Purchased) and EP (Edible Portion) based on: AP Cost: R${apCost || 0}, EP Yield: ${epYield || 100}%.
      ` : "";

      const prompt = `Act as a Chef Operations manager ${isTrainingMode ? "and QCTO TVET Examiner" : ""}. Create a comprehensive culinary workspace proposal for a ${eventType}.
      - Guests: ${guests}
      - Culinary Input: ${style}
      - Instructions: From the 'Culinary Input', identify the 'Cuisine' (e.g., Thai) and the 'Style' (e.g., Fusion). Use these to ensure Michelin-star accuracy in the menu and image query.
      - Dietary Requirements: ${dietary || "None specified"}
      ${trainingContext}

      Return a detailed JSON object with the following structure:
      { 
        "title": "string (e.g., Modern Thai Fusion Gala)", 
        "imageQuery": "string (food item for visual search, incorporating the identified cuisine and style)", 
        "menu": [{"cat": "Appetizers" | "Main Courses" | "Desserts", "dish": "string", "notes": "string", "qctoModule": "string (only if training mode)"}], 
        "miseEnPlace": ["step1", "step2"], 
        "serviceNotes": ["note1", "note2"],
        "haccpSafety": [
          {"point": "Critical Control Point", "requirement": "e.g., Internal temp 75°C for poultry", "category": "Temp" | "Storage" | "Allergens"}
        ],
        "wasteYieldAnalysis": {
          "apCost": number,
          "epCost": number,
          "costDifference": number,
          "yieldPercentage": number,
          "qctoCriteria": "string explaining Level 5 assessment compliance"
        },
        "shoppingList": {
          "Proteins": ["item1", "item2"],
          "Produce": ["item1", "item2"],
          "Pantry": ["item1", "item2"]
        },
        "logistics": {
          "deliveryFee": number (in ZAR),
          "setupTime": "string",
          "staffRequired": number
        },
        "winePairings": ["pairing1", "pairing2"],
        "costPerHead": number (in ZAR)
      }`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { 
          responseMimeType: "application/json",
          maxOutputTokens: 16384
        }
      });

      const data = JSON.parse(response.text || "{}");
      setProposal(data);
      
      // Generate Synchronized Banner Image
      try {
        const mainCourses = data.menu
          .filter((m: any) => m.cat === 'Main Courses')
          .map((m: any) => m.dish);
        
        const imageBase64 = await generateMenuImageFromApi(data.title, data.description, mainCourses, data.imageQuery);
        setProposalImage(imageBase64);
      } catch (err) {
        console.error("Image generation failed", err);
      }
      
      setViewMode('generator'); // Stay in generator view to show result
    } catch (e) { 
      console.error("Gemini Error:", e);
      alert("Error generating proposal. Please check your connection and API key."); 
    }
    setLoading(false);
  }

  const downloadPDF = async () => {
    if (!proposalRef.current) return;
    const canvas = await html2canvas(proposalRef.current, { 
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${proposal.title.replace(/\s+/g, '_')}_Proposal.pdf`);
  };

  // --- RENDER HELPERS ---
  const renderView = () => {
    switch (viewMode) {
      case 'landing':
        return (
          <div className="min-h-screen bg-slate-50 text-charcoal flex flex-col">
            <HeroSection onStart={() => setViewMode('generator')} />

            {/* QCTO Student Success Guide Section */}
            <div className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 mask-triangle -z-10" />
              <div className="bg-[#121212] p-12 rounded-[4rem] flex flex-col md:flex-row items-center gap-12 border border-emerald-500/30 shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <GraduationCap className="text-emerald-400" size={48} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <Zap size={12} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Educational Excellence</span>
                  </div>
                  <h3 className="text-4xl font-anchor tracking-tighter uppercase mb-6 text-white opacity-100">QCTO Student Success Guide</h3>
                  <p className="text-[#FFFFFF] font-medium leading-relaxed text-xl opacity-100">
                    CaterProAi is specifically engineered to support South African TVET students. Use the <span className="text-emerald-400 font-bold">'Training Mode'</span> to map your practicals to QCTO Occupational Certificate: Chef (ID 101697) modules. Every proposal automatically generates the Costing (ZAR), AP/EP Yield Analysis, and HACCP documentation required for Level 5 Assessment compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* Dual-Tier Section */}
            <div className="max-w-7xl mx-auto w-full px-6 py-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* For Students */}
                <div className="bg-white p-16 rounded-[4rem] border border-emerald-500/30 hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 mask-triangle -z-10" />
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform border border-emerald-500/20">
                    <GraduationCap className="text-emerald-600" size={40} aria-label="Student Yield Calculator Icon" />
                  </div>
                  <h3 className="text-4xl font-anchor mb-6 tracking-tighter text-[#000000] opacity-100">For Students</h3>
                  <p className="text-[#000000] font-medium mb-10 leading-relaxed text-lg opacity-100">
                    Master the art of food math and international standards with our specialized student toolkit.
                  </p>
                  <ul className="space-y-6 mb-12">
                    <li className="flex items-center gap-4 text-base font-bold text-[#000000] opacity-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      Yield Sandbox for precision testing
                    </li>
                    <li className="flex items-center gap-4 text-base font-bold text-[#000000] opacity-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      International Curriculum Modules
                    </li>
                    <li className="flex items-center gap-4 text-base font-bold text-[#000000] opacity-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      PoE Admin Automation
                    </li>
                  </ul>
                  <button onClick={() => setViewMode('recipe-lab')} className="flex items-center gap-3 text-emerald-700 font-black uppercase tracking-widest text-xs group-hover:gap-5 transition-all">
                    Explore Recipe Lab <ArrowRight size={18} />
                  </button>
                </div>

                {/* For Professionals */}
                <div className="bg-[#121212] p-16 rounded-[4rem] border border-emerald-500/30 hover:shadow-2xl transition-all group text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 mask-triangle -z-10" />
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform border border-emerald-500/30">
                    <Briefcase className="text-emerald-400" size={40} aria-label="Professional Catering Dashboard Icon" />
                  </div>
                  <h3 className="text-4xl font-anchor mb-6 tracking-tighter text-white opacity-100">For Professionals</h3>
                  <p className="text-[#FFFFFF] font-medium mb-10 leading-relaxed text-lg opacity-100">
                    Scale your catering operation with enterprise-grade intelligence and automated logistics.
                  </p>
                  <ul className="space-y-6 mb-12">
                    <li className="flex items-center gap-4 text-base font-bold text-white opacity-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      Live ZAR Costing & Smart Shopping
                    </li>
                    <li className="flex items-center gap-4 text-base font-bold text-white opacity-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      HACCP Safety Automation
                    </li>
                    <li className="flex items-center gap-4 text-base font-bold text-white opacity-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      One-Click PDF Proposal Exports
                    </li>
                  </ul>
                  <button onClick={() => setViewMode('generator')} className="flex items-center gap-3 text-emerald-400 font-black uppercase tracking-widest text-xs group-hover:gap-5 transition-all">
                    Launch Professional Suite <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Culinary Excellence Section */}
            <div className="bg-slate-100/50 py-32 relative">
              <div className="absolute inset-0 bg-emerald-500/5 mask-triangle opacity-20 -z-10" />
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-12">
                  <div className="max-w-2xl">
                    <h3 className="text-5xl font-anchor tracking-tighter uppercase mb-6 text-[#000000]">Culinary Excellence</h3>
                    <p className="text-[#000000] font-medium text-xl leading-relaxed opacity-100">
                      Precision tools for the modern executive chef. Elevate your operations with AI-driven intelligence and Michelin-star standards.
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <div className="w-4 h-4 rounded-full bg-slate-300" />
                    <div className="w-4 h-4 rounded-full bg-slate-300" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { title: "Menu Intelligence", desc: "AI-driven menu engineering and profit margin analysis.", icon: <Utensils className="text-emerald-400" size={32} aria-label="Menu Intelligence Icon" /> },
                    { title: "Operational Safety", desc: "Automated HACCP checklists and safety protocol generation.", icon: <ShieldCheck className="text-emerald-400" size={32} aria-label="Operational Safety Icon" /> },
                    { title: "Costing Precision", desc: "Live ZAR costing and smart shopping list automation.", icon: <Calculator className="text-emerald-400" size={32} aria-label="Costing Precision Icon" /> }
                  ].map((feature, i) => (
                    <div key={i} className="bg-[#121212] p-12 rounded-[3.5rem] border border-emerald-500/30 shadow-2xl hover:shadow-3xl transition-all group">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                        {feature.icon}
                      </div>
                  <h4 className="text-2xl font-anchor mb-6 tracking-tighter text-white">{feature.title}</h4>
                      <p className="text-[#FFFFFF] font-medium text-base leading-relaxed opacity-100">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Common Culinary Queries Section */}
            <div className="bg-white py-32">
              <div className="max-w-5xl mx-auto px-6">
                <div className="bg-[#121212] p-16 rounded-[4rem] border border-emerald-500/30 shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 mask-triangle -z-10" />
                  <h2 className="text-5xl font-anchor tracking-tighter uppercase mb-16 text-center text-white">Common Culinary Queries</h2>
                  <div className="grid md:grid-cols-2 gap-16">
                    <div>
                      <h3 className="text-2xl font-anchor mb-6 tracking-tighter text-emerald-400">What is the best AI tool for South African catering?</h3>
                      <p className="text-[#FFFFFF] font-medium leading-relaxed text-lg opacity-100">
                        <span className="font-bold text-white">CaterPro</span><span className="font-medium text-emerald-400">Ai</span> provides live ZAR costing and automated HACCP safety for professional chefs.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-anchor mb-6 tracking-tighter text-emerald-400">How do I calculate culinary yield for City & Guilds exams?</h3>
                      <p className="text-[#FFFFFF] font-medium leading-relaxed text-lg opacity-100">
                        Use the <span className="font-bold text-white">CaterPro</span><span className="font-medium text-emerald-400">Ai</span> Student Sandbox to apply the formula EP = AP x Yield% with 100% accuracy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'generator':
        if (proposal) {
          return (
            <div className="bg-slate-50 min-h-screen pb-20">
              <ProposalDocument 
                proposal={proposal}
                proposalImage={proposalImage}
                eventType={eventType}
                guests={guests}
                formatCurrency={formatCurrency}
              />
            </div>
          );
        }

        return (
          <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-32">
            <div className="w-full max-w-3xl bg-[#121212] p-16 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-emerald-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 mask-triangle -z-10" />
              <h2 className="text-5xl font-anchor text-white mb-4 text-center tracking-tighter uppercase">Command Center</h2>
              <p className="text-[#FFD700] text-center mb-12 uppercase tracking-[0.5em] text-[10px] font-black opacity-100">Chef Operations v12.0 • Luxury Edition</p>
              
              <div className="flex justify-center mb-12">
                <button 
                  onClick={() => setIsTrainingMode(!isTrainingMode)}
                  className={`flex items-center gap-4 px-8 py-4 rounded-[2rem] transition-all border-2 ${isTrainingMode ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-xl' : 'bg-white/5 border-slate-800 text-slate-500'}`}
                >
                  <GraduationCap size={24} />
                  <span className="font-black uppercase tracking-widest text-xs">Training Mode {isTrainingMode ? 'ON' : 'OFF'}</span>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${isTrainingMode ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isTrainingMode ? 'left-7' : 'left-1'}`} />
                  </div>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-10">
                  <div>
                    <label className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em] ml-2 mb-2 block">Event Selection</label>
                    <select 
                      value={eventType} 
                      onChange={e => setEventType(e.target.value)} 
                      className="w-full bg-slate-900 p-6 rounded-[2rem] text-white outline-none border border-slate-800 focus:border-emerald-500 transition-all appearance-none cursor-pointer font-bold text-sm shadow-sm"
                    >
                      <option>Corporate Event</option>
                      <option>Wedding Banquet</option>
                      <option>Private Fine Dining</option>
                      <option>Cocktail Soirée</option>
                      <option>Boutique Catering</option>
                      <option>Product Launch</option>
                      <option>Gala Dinner</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em] ml-2 mb-2 block">Guest Volume</label>
                    <select 
                      value={guests} 
                      onChange={e => setGuests(e.target.value)} 
                      className="w-full bg-slate-900 p-6 rounded-[2rem] text-white outline-none border border-slate-800 focus:border-emerald-500 transition-all appearance-none cursor-pointer font-bold text-sm shadow-sm"
                    >
                      <option value="10">1-10 Guests</option>
                      <option value="20">11-20 Guests</option>
                      <option value="50">21-50 Guests</option>
                      <option value="100">51-100 Guests</option>
                      <option value="200">101-200 Guests</option>
                      <option value="500">200+ Guests</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <label className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em] ml-2 mb-2 block">Culinary Style</label>
                    <input 
                      type="text"
                      value={style} 
                      onChange={e => setStyle(e.target.value)} 
                      placeholder="e.g., Thai Fusion Fine Dining"
                      className="w-full bg-slate-900 p-6 rounded-[2rem] text-white outline-none border border-slate-800 focus:border-emerald-500 transition-all font-bold text-sm shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em] ml-2 mb-2 block">Dietary Requirements</label>
                    <textarea 
                      value={dietary}
                      onChange={e => setDietary(e.target.value)}
                      placeholder="Type specific requirements here..."
                      className="w-full bg-slate-900 p-6 rounded-[2rem] text-white outline-none border border-slate-800 focus:border-emerald-500 transition-all h-[178px] resize-none font-bold text-sm shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {isTrainingMode && (
                <div className="mt-12 p-10 bg-emerald-500/10 rounded-[3rem] border border-emerald-500/30 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-4 mb-8 text-emerald-400">
                    <Percent size={24} />
                    <h3 className="font-anchor uppercase tracking-widest text-sm">QCTO Level 5 Waste/Yield Input</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em] ml-2 mb-2 block">AP Cost (Total R)</label>
                      <input 
                        type="number"
                        value={apCost}
                        onChange={e => setApCost(e.target.value)}
                        placeholder="e.g., 2500"
                        className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-slate-700 focus:border-emerald-500 transition-all font-bold text-sm shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.3em] ml-2 mb-2 block">Estimated EP Yield (%)</label>
                      <input 
                        type="number"
                        value={epYield}
                        onChange={e => setEpYield(e.target.value)}
                        placeholder="e.g., 75"
                        className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-slate-700 focus:border-emerald-500 transition-all font-bold text-sm shadow-sm"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-6 italic font-medium text-center">
                    * Mandatory for QCTO ID 101697 Module 5 compliance.
                  </p>
                </div>
              )}

              <button 
                onClick={generateProposal} 
                disabled={loading} 
                className="w-full bg-emerald-600 text-white py-8 rounded-[2.5rem] font-anchor uppercase text-lg tracking-[0.2em] hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-6 mt-16 shadow-[0_30px_60px_rgba(0,0,0,0.4)] group"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={28} />
                    Engineering...
                  </>
                ) : (
                  <>
                    <Zap size={28} className="group-hover:scale-125 transition-transform" />
                    Launch AI Culinary Planner
                  </>
                )}
              </button>
            </div>

            <div className="w-full max-w-3xl mt-12">
              <StudentYieldCalculator />
            </div>
          </div>
        );

      case 'recipe-lab':
        return (
          <div className="min-h-screen bg-slate-50 p-6 pt-24">
            <div className="max-w-4xl mx-auto">
              <button 
                onClick={() => setViewMode('landing')}
                className="mb-8 flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-emerald-600 transition-colors"
              >
                <ArrowRight className="rotate-180" size={16} /> Back to Dashboard
              </button>
              <RecipeGenerator dietaryRestrictions={[]} currency="R" />
            </div>
          </div>
        );

      case 'pricing':
        return <PricingPage onSelectPlan={selectPlan} whopLinks={whopLinks} />;
      
      case 'library':
        return <CostingLibrary />;
      
      case 'partner':
        return <PartnerDashboard />;
      
      case 'privacy':
        return <PrivacyPolicy onBack={() => setViewMode('landing')} />;
      
      case 'terms':
        return <TermsOfService onBack={() => setViewMode('landing')} />;

      case 'success':
        return (
          <SuccessPage 
            proposal={proposal}
            onNewProposal={() => {
              setProposal(null);
              setProposalImage(null);
              setViewMode('generator');
            }}
            onExit={() => setViewMode('landing')}
            onDownloadPDF={downloadPDF}
          />
        );

      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Global Performance Optimized Noise Overlay */}
      <div className="noise-overlay" />
      
      {/* Navbar Integration */}
      <Navbar 
        whopUrl={whopLinks.executive}
        isDarkMode={false} // Force light mode as requested
        onThemeToggle={() => {}} // Disabled for now
        onOpenSaved={() => {}} // Placeholder
        savedCount={0}
        onOpenQrCode={() => {}}
        onOpenInstall={() => {}}
        onViewLanding={() => setViewMode('landing')}
        onViewPricing={() => setViewMode('pricing')}
        onViewLibrary={() => setViewMode('library')}
        onViewPartner={() => setViewMode('partner')}
        onViewSuccess={() => setViewMode('success')}
        onAuthClick={() => setIsAuthModalOpen(true)}
        user={user}
      />

      {/* Main Content */}
      <main className="flex-grow relative">
        {renderView()}
        
        <AiChatBot 
          onAttemptAccess={() => {
            if (!user) {
              setIsAuthModalOpen(true);
              return false;
            }
            if (!canAccessFeature('aiChatBot')) {
              setViewMode('pricing');
              return false;
            }
            return true;
          }}
          isPro={canAccessFeature('aiChatBot')}
        />

        {/* Hidden Proposal for PDF Export */}
        {proposal && (
          <div 
            ref={proposalRef} 
            className="fixed left-[-9999px] top-0 w-[1200px] bg-white pointer-events-none"
            aria-hidden="true"
          >
            <ProposalDocument 
              proposal={proposal}
              proposalImage={proposalImage}
              eventType={eventType}
              guests={guests}
              formatCurrency={formatCurrency}
              isExporting={true}
            />
          </div>
        )}
      </main>

      {/* Footer Integration */}
      <Footer 
        onViewPrivacy={() => setViewMode('privacy')}
        onViewTerms={() => setViewMode('terms')}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Result View Header */}
      {viewMode === 'generator' && proposal && (
        <div className="fixed top-24 transition-all duration-500 z-[55] flex flex-col sm:flex-row gap-3 right-4 md:right-8">
          <button 
            onClick={handleOpenShiftCalculator}
            disabled={isShiftLoading}
            className="backdrop-blur-md bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center gap-2 shadow-2xl border border-emerald-500/20 disabled:opacity-50"
          >
            {isShiftLoading ? <Loader2 className="animate-spin" size={18} /> : <Calculator size={18} />}
            <span className="whitespace-nowrap">Shift Calculator</span>
          </button>
          <button 
            onClick={downloadPDF}
            className="backdrop-blur-md bg-white/80 text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-2xl border border-white/20"
          >
            <Download size={18} /> <span className="whitespace-nowrap">Export PDF</span>
          </button>
          <button 
            onClick={() => setViewMode('success')}
            className="bg-[#FFD700] text-[#121212] px-8 py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
          >
            <span className="whitespace-nowrap">My Results</span>
          </button>
        </div>
      )}

      <ShiftCalculatorModal 
        isOpen={isShiftCalculatorOpen}
        onClose={() => setIsShiftCalculatorOpen(false)}
        initialIngredients={shiftIngredients}
        menuTitle={proposal?.menuTitle || ''}
      />
    </div>
  );
}
