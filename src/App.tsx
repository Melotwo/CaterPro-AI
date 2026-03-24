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

// --- INFRASTRUCTURE IMPORTS (Code A) ---
import { useAuth } from './hooks/useAuth';
import { useAppSubscription, SubscriptionPlan } from './hooks/useAppSubscription';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import PricingPage from './components/PricingPage';
import CostingLibrary from './components/CostingLibrary';
import PartnerDashboard from './components/PartnerDashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { StudentYieldCalculator } from './components/StudentYieldCalculator';
import { generateMenuImageFromApi, extractIngredientsForShift } from './services/geminiService';
import { ShiftCalculatorModal } from './components/ShiftCalculatorModal';
import { SuccessPage } from './components/SuccessPage';
import { ProposalDocument } from './components/ProposalDocument';
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
  
  const [viewMode, setViewMode] = useState<'landing' | 'generator' | 'pricing' | 'library' | 'privacy' | 'partner' | 'terms' | 'success'>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  
  // Generator State (Code B)
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

  // Chat State (Code B)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const proposalRef = useRef<HTMLDivElement>(null);

  // Trigger animation on total change
  useEffect(() => {
    if (proposal) {
      setIsTotalUpdating(true);
      const timer = setTimeout(() => setIsTotalUpdating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [guests, proposal?.logistics?.deliveryFee]);

  // --- WHOP LINKS (Code A) ---
  const whopLinks = {
    commis: "https://whop.com/checkout/plan_1", // Replace with real links
    chefDePartie: "https://whop.com/checkout/plan_2",
    sousChef: "https://whop.com/checkout/plan_3",
    executive: "https://whop.com/checkout/plan_4"
  };

  // --- GENERATION LOGIC (Code B) ---
  async function generateProposal() {
    if (!apiKey) {
      alert("Gemini API Key is missing. Please configure it in the settings.");
      return;
    }

    if (isTrainingMode && (!apCost || !epYield)) {
      alert("Please enter AP Cost and EP Yield for QCTO compliance.");
      return;
    }

    // Check subscription limits (Code A integration)
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
      
      setChatMessages([{ role: 'model', text: `Chef, your ${data.title} proposal is ready. I've included a HACCP safety checklist for your protein handling. What's our next move?` }]);
      setViewMode('generator'); // Stay in generator view to show result
    } catch (e) { 
      console.error("Gemini Error:", e);
      alert("Error generating proposal. Please check your connection and API key."); 
    }
    setLoading(false);
  }

  async function handleChat() {
    if (!chatInput.trim() || isChatLoading) return;
    
    // Check if user has access to AI Chat (Code A integration)
    if (!canAccessFeature('aiChatBot')) {
      setViewMode('pricing');
      return;
    }

    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const chatPrompt = `You are a Chef Operations AI Consultant. The current proposal is for a ${eventType} (${style}) for ${guests} guests.
      Proposal Details: ${JSON.stringify(proposal)}
      User Question: ${chatInput}
      Provide a concise, professional chef-to-chef response. Focus on operational excellence and HACCP standards.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: chatPrompt }] }]
      });

      setChatMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Sorry Chef, I'm having trouble connecting to the office right now." }]);
    }
    setIsChatLoading(false);
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
          <div className="min-h-screen bg-white text-black flex flex-col">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center p-6 text-center pt-32 pb-20">
              <div className="flex flex-col items-center mb-12">
                <h1 className="text-6xl md:text-8xl tracking-tighter leading-none">
                  <span className="font-bold text-black">CaterPro</span>
                  <span className="font-medium bg-gradient-to-br from-[#10b981] to-[#34d399] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">Ai</span>
                </h1>
                <p className="text-slate-500 text-sm md:text-base font-black mt-4 uppercase tracking-[0.4em]">
                  Chef in the Kitchen. AI in the Office.
                </p>
              </div>
              <p className="text-slate-500 text-xl mb-12 max-w-2xl font-medium">
                The <span className="italic">Elegance</span> edition. Precision catering intelligence for the modern executive.
              </p>
              <button 
                onClick={() => setViewMode('generator')} 
                className="bg-gradient-to-br from-[#10b981] to-[#059669] text-black px-12 py-4 rounded-full font-black text-lg hover:scale-105 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] uppercase tracking-widest"
              >
                Start Planning
              </button>
            </div>

            {/* Dual-Tier Section */}
            <div className="max-w-7xl mx-auto w-full px-6 py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* For Students */}
                <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 hover:shadow-2xl transition-all group">
                  <div className="w-16 h-16 bg-[#10b981]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <GraduationCap className="text-[#10b981]" size={32} aria-label="Student Yield Calculator Icon" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tighter">For Students</h3>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    Master the art of food math and international standards with our specialized student toolkit.
                  </p>
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      Yield Sandbox for precision testing
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      International Curriculum Modules
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      PoE Admin Automation
                    </li>
                  </ul>
                  <button onClick={() => setViewMode('generator')} className="flex items-center gap-2 text-[#10b981] font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                    Explore Student Tools <ArrowRight size={16} />
                  </button>
                </div>

                {/* For Professionals */}
                <div className="bg-slate-900 p-12 rounded-[3rem] border border-slate-800 hover:shadow-2xl transition-all group text-white">
                  <div className="w-16 h-16 bg-[#10b981]/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Briefcase className="text-[#10b981]" size={32} aria-label="Professional Catering Dashboard Icon" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tighter">For Professionals</h3>
                  <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                    Scale your catering operation with enterprise-grade intelligence and automated logistics.
                  </p>
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      Live ZAR Costing & Smart Shopping
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      HACCP Safety Automation
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      One-Click PDF Proposal Exports
                    </li>
                  </ul>
                  <button onClick={() => setViewMode('generator')} className="flex items-center gap-2 text-[#10b981] font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                    Launch Professional Suite <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* QCTO Student Success Guide Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-10">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center shrink-0">
                  <GraduationCap className="text-emerald-600" size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter uppercase mb-4 text-emerald-900">QCTO Student Success Guide</h3>
                  <p className="text-emerald-800/80 font-medium leading-relaxed text-lg">
                    CaterProAi is specifically engineered to support South African TVET students. Use the 'Training Mode' to map your practicals to QCTO Occupational Certificate: Chef (ID 101697) modules. Every proposal automatically generates the Costing (ZAR), AP/EP Yield Analysis, and HACCP documentation required for Level 5 Assessment compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* Culinary Excellence Section */}
            <div className="bg-slate-50 py-24">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                  <div className="max-w-2xl">
                    <h3 className="text-4xl font-black tracking-tighter uppercase mb-4">Culinary Excellence</h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                      Precision tools for the modern executive chef. Elevate your operations with AI-driven intelligence and Michelin-star standards.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#10b981] animate-pulse" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: "Menu Intelligence", desc: "AI-driven menu engineering and profit margin analysis.", icon: <Utensils className="text-[#10b981]" aria-label="Menu Intelligence Icon" /> },
                    { title: "Operational Safety", desc: "Automated HACCP checklists and safety protocol generation.", icon: <ShieldCheck className="text-[#10b981]" aria-label="Operational Safety Icon" /> },
                    { title: "Costing Precision", desc: "Live ZAR costing and smart shopping list automation.", icon: <Calculator className="text-[#10b981]" aria-label="Costing Precision Icon" /> }
                  ].map((feature, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#10b981]/10 transition-colors">
                        {feature.icon}
                      </div>
                      <h4 className="text-xl font-black mb-4 tracking-tighter">{feature.title}</h4>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Common Culinary Queries Section */}
            <div className="bg-white py-24">
              <div className="max-w-4xl mx-auto px-6">
                <div className="backdrop-blur-md bg-white/70 p-12 rounded-[3rem] border border-slate-100 shadow-2xl">
                  <h2 className="text-4xl font-black tracking-tighter uppercase mb-12 text-center">Common Culinary Queries</h2>
                  <div className="space-y-12">
                    <div>
                      <h3 className="text-xl font-black mb-4 tracking-tighter text-[#10b981]">What is the best AI tool for South African catering?</h3>
                      <p className="text-slate-600 font-medium leading-relaxed">
                        <span className="font-bold">CaterPro</span><span className="font-medium text-[#10b981]">Ai</span> provides live ZAR costing and automated HACCP safety for professional chefs.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-black mb-4 tracking-tighter text-[#10b981]">How do I calculate culinary yield for City & Guilds exams?</h3>
                      <p className="text-slate-600 font-medium leading-relaxed">
                        Use the <span className="font-bold">CaterPro</span><span className="font-medium text-[#10b981]">Ai</span> Student Sandbox to apply the formula EP = AP x Yield% with 100% accuracy.
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
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-20">
            <div className="w-full max-w-2xl backdrop-blur-md bg-white/70 p-12 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-white/20">
              <h2 className="text-4xl font-black text-slate-900 mb-2 text-center tracking-tighter">Command Center</h2>
              <p className="text-slate-400 text-center mb-6 uppercase tracking-[0.4em] text-[10px] font-black">Chef Operations v4.0</p>
              
              <div className="flex justify-center mb-10">
                <button 
                  onClick={() => setIsTrainingMode(!isTrainingMode)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all border-2 ${isTrainingMode ? 'bg-[#10b981]/10 border-[#10b981] text-[#10b981]' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                >
                  <GraduationCap size={20} />
                  <span className="font-black uppercase tracking-widest text-xs">Training Mode {isTrainingMode ? 'ON' : 'OFF'}</span>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${isTrainingMode ? 'bg-[#10b981]' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isTrainingMode ? 'left-6' : 'left-1'}`} />
                  </div>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Selection</label>
                    <select 
                      value={eventType} 
                      onChange={e => setEventType(e.target.value)} 
                      className="w-full bg-white/50 p-5 rounded-2xl text-slate-900 mt-2 outline-none border border-slate-200 focus:border-[#10b981] transition-all appearance-none cursor-pointer font-bold text-sm"
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Guest Volume</label>
                    <select 
                      value={guests} 
                      onChange={e => setGuests(e.target.value)} 
                      className="w-full bg-white/50 p-5 rounded-2xl text-slate-900 mt-2 outline-none border border-slate-200 focus:border-[#10b981] transition-all appearance-none cursor-pointer font-bold text-sm"
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

                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Culinary Style</label>
                    <input 
                      type="text"
                      value={style} 
                      onChange={e => setStyle(e.target.value)} 
                      placeholder="e.g., Thai Fusion Fine Dining"
                      className="w-full bg-white/50 p-5 rounded-2xl text-slate-900 mt-2 outline-none border border-slate-200 focus:border-[#10b981] transition-all font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dietary Requirements</label>
                    <textarea 
                      value={dietary}
                      onChange={e => setDietary(e.target.value)}
                      placeholder="Type specific requirements here..."
                      className="w-full bg-white/50 p-5 rounded-2xl text-slate-900 outline-none border border-slate-200 mt-2 focus:border-[#10b981] transition-all h-[158px] resize-none font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              {isTrainingMode && (
                <div className="mt-8 p-8 bg-[#10b981]/5 rounded-[2rem] border border-[#10b981]/20 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-3 mb-6 text-[#10b981]">
                    <Percent size={20} />
                    <h3 className="font-black uppercase tracking-widest text-xs">QCTO Level 5 Waste/Yield Input</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AP Cost (Total R)</label>
                      <input 
                        type="number"
                        value={apCost}
                        onChange={e => setApCost(e.target.value)}
                        placeholder="e.g., 2500"
                        className="w-full bg-white p-4 rounded-xl text-slate-900 mt-2 outline-none border border-slate-200 focus:border-[#10b981] transition-all font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estimated EP Yield (%)</label>
                      <input 
                        type="number"
                        value={epYield}
                        onChange={e => setEpYield(e.target.value)}
                        placeholder="e.g., 75"
                        className="w-full bg-white p-4 rounded-xl text-slate-900 mt-2 outline-none border border-slate-200 focus:border-[#10b981] transition-all font-bold text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-4 italic font-medium">
                    * Mandatory for QCTO ID 101697 Module 5 compliance.
                  </p>
                </div>
              )}

              <button 
                onClick={generateProposal} 
                disabled={loading} 
                className="w-full bg-gradient-to-br from-[#10b981] to-[#059669] py-6 rounded-[2rem] font-black uppercase text-black tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-4 mt-12 shadow-[0_20px_40px_rgba(16,185,129,0.3)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap size={24} />
                    Launch AI Culinary Planner
                  </>
                )}
              </button>
            </div>

            <div className="w-full max-w-2xl">
              <StudentYieldCalculator />
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

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar Integration (Code A) */}
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
        
        {/* AI Chat Sidebar */}
        <div className={`fixed inset-y-0 right-0 w-96 bg-white/95 backdrop-blur-xl border-l border-slate-100 shadow-2xl transform transition-transform duration-500 ease-out z-[60] ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#10b981]/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-[#10b981]" size={20} />
                </div>
                <div>
                  <span className="font-black text-sm text-slate-900 block tracking-tight">AI Chef Consultant</span>
                  <span className="text-[10px] text-[#10b981] font-bold uppercase tracking-widest">Online</span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"><X size={18} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-gradient-to-br from-[#10b981] to-[#059669] text-black font-bold shadow-lg' : 'bg-slate-50 text-slate-700 border border-slate-100 font-medium'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-400 flex items-center gap-3 border border-slate-100 font-medium">
                    <Loader2 className="animate-spin" size={16} /> Chef is thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleChat()}
                  placeholder="Ask about HACCP or pairings..."
                  className="w-full bg-slate-50 p-4 pr-14 rounded-2xl text-sm text-slate-900 outline-none border border-slate-200 focus:border-[#10b981] transition-all font-medium"
                />
                <button 
                  onClick={handleChat}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#10b981] text-black rounded-xl flex items-center justify-center hover:brightness-110 transition-all shadow-md"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Chat Button */}
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#10b981] to-[#059669] text-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] flex items-center justify-center hover:scale-110 transition-all z-50 group"
          >
            <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
          </button>
        )}

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
            />
          </div>
        )}
      </main>

      {/* Footer Integration (Code A) */}
      <Footer 
        onViewPrivacy={() => setViewMode('privacy')}
        onViewTerms={() => setViewMode('terms')}
      />

      {/* Auth Modal (Code A) */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Result View Header (Code B) */}
      {viewMode === 'generator' && proposal && (
        <div className={`fixed top-24 transition-all duration-500 z-[55] flex gap-3 ${isChatOpen ? 'right-[408px]' : 'right-6'}`}>
          <button 
            onClick={handleOpenShiftCalculator}
            disabled={isShiftLoading}
            className="backdrop-blur-md bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center gap-2 shadow-2xl border border-emerald-500/20 disabled:opacity-50"
          >
            {isShiftLoading ? <Loader2 className="animate-spin" size={18} /> : <Calculator size={18} />}
            Open Shift Calculator
          </button>
          <button 
            onClick={downloadPDF}
            className="backdrop-blur-md bg-white/80 text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-2xl border border-white/20"
          >
            <Download size={18} /> Export PDF
          </button>
          <button 
            onClick={() => setViewMode('success')}
            className="bg-gradient-to-br from-[#10b981] to-[#059669] text-black px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
          >
            Finalize
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
