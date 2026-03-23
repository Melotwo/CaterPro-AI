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
  
  // Generator State (Code B)
  const [guests, setGuests] = useState('50');
  const [style, setStyle] = useState('');
  const [dietary, setDietary] = useState('');
  const [eventType, setEventType] = useState('Corporate Event');
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

    // Check subscription limits (Code A integration)
    if (!recordGeneration()) return;

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Act as a Chef Operations manager. Create a comprehensive culinary workspace proposal for a ${eventType}.
      - Guests: ${guests}
      - Culinary Input: ${style}
      - Instructions: From the 'Culinary Input', identify the 'Cuisine' (e.g., Thai) and the 'Style' (e.g., Fusion). Use these to ensure Michelin-star accuracy in the menu and image query.
      - Dietary Requirements: ${dietary || "None specified"}

      Return a detailed JSON object with the following structure:
      { 
        "title": "string (e.g., Modern Thai Fusion Gala)", 
        "imageQuery": "string (food item for visual search, incorporating the identified cuisine and style)", 
        "menu": [{"cat": "Appetizers" | "Main Courses" | "Desserts", "dish": "string", "notes": "string"}], 
        "miseEnPlace": ["step1", "step2"], 
        "serviceNotes": ["note1", "note2"],
        "haccpSafety": [
          {"point": "Critical Control Point", "requirement": "e.g., Internal temp 75°C for poultry"}
        ],
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
              <div ref={proposalRef} className="bg-white">
                <div 
                  className="h-[60vh] w-full bg-cover bg-center flex items-end p-8 md:p-16 relative" 
                  style={{backgroundImage: proposalImage ? `url('data:image/png;base64,${proposalImage}')` : `url('https://picsum.photos/seed/${proposal?.imageQuery || 'gourmet-food'}/1920/1080')`}}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"/>
                  <div className="relative z-10">
                    <span className="text-[#10b981] font-black uppercase tracking-[0.4em] text-xs mb-4 block">{eventType}</span>
                    <h2 className="text-5xl md:text-8xl font-black relative z-10 tracking-tighter leading-none text-slate-900">{proposal?.title}</h2>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 px-6 -mt-20 relative z-20">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Menu Section */}
                    <div className="backdrop-blur-md bg-white/70 p-10 rounded-[2.5rem] border border-white/20 shadow-2xl">
                      <div className="flex items-center gap-3 mb-10 text-[#10b981]">
                        <Utensils size={28}/>
                        <h3 className="font-black text-3xl tracking-tighter text-slate-900">Menu Selection</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-12">
                        {['Appetizers', 'Main Courses', 'Desserts'].map(cat => (
                          <div key={cat} className="space-y-8">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-3">{cat}</h4>
                            {proposal?.menu.filter((m:any) => m.cat === cat).map((item:any, i:number) => (
                              <div key={i} className="group">
                                <h5 className="text-xl font-black group-hover:text-[#10b981] transition-colors text-slate-900 tracking-tight">{item.dish}</h5>
                                <p className="text-slate-500 text-sm leading-relaxed mt-2 font-medium">{item.notes}</p>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mise en Place & Service Notes Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="backdrop-blur-md bg-white/70 p-8 rounded-[2rem] border border-white/20 shadow-xl">
                        <div className="flex items-center gap-3 mb-6 text-[#10b981]">
                          <ClipboardList size={24}/>
                          <h3 className="font-black text-xl tracking-tight text-slate-900">Mise en Place</h3>
                        </div>
                        <ul className="space-y-4">
                          {proposal?.miseEnPlace?.map((step: string, i: number) => (
                            <li key={i} className="text-sm text-slate-600 flex gap-4 font-medium">
                              <span className="text-[#10b981] font-black">{String(i + 1).padStart(2, '0')}</span> {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="backdrop-blur-md bg-white/70 p-8 rounded-[2rem] border border-white/20 shadow-xl">
                        <div className="flex items-center gap-3 mb-6 text-[#10b981]">
                          <Sparkles size={24}/>
                          <h3 className="font-black text-xl tracking-tight text-slate-900">Service Notes</h3>
                        </div>
                        <ul className="space-y-4">
                          {proposal?.serviceNotes?.map((note: string, i: number) => (
                            <li key={i} className="text-sm text-slate-600 flex gap-4 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" /> {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* HACCP Safety Checklist */}
                    <div className="backdrop-blur-md bg-emerald-50/50 p-10 rounded-[2.5rem] border border-[#10b981]/10 shadow-xl">
                      <div className="flex items-center gap-3 mb-8 text-[#10b981]">
                        <ShieldCheck size={28}/>
                        <h3 className="font-black text-2xl tracking-tighter text-slate-900">HACCP Safety Checklist</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {proposal?.haccpSafety?.map((item: any, i: number) => (
                          <div key={i} className="bg-white/60 p-5 rounded-2xl border border-white/40">
                            <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest block mb-1">{item.point}</span>
                            <p className="text-sm text-slate-700 font-bold">{item.requirement}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shopping List Section */}
                    <div className="backdrop-blur-md bg-white/70 p-10 rounded-[2.5rem] border border-white/20 shadow-xl">
                      <div className="flex items-center gap-3 mb-10 text-[#10b981]">
                        <ShoppingCart size={28}/>
                        <h3 className="font-black text-3xl tracking-tighter text-slate-900">Smart Shopping List</h3>
                      </div>
                      <div className="grid md:grid-cols-3 gap-8">
                        {Object.entries(proposal?.shoppingList || {}).map(([cat, items]: [string, any]) => (
                          <div key={cat} className="space-y-5">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{cat}</h4>
                            <ul className="space-y-3">
                              {items.map((item: string, i: number) => (
                                <li key={i} className="text-sm text-slate-500 flex gap-3 font-medium">
                                  <span className="text-[#10b981]/40">•</span> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Costing Card */}
                    <div className="backdrop-blur-md bg-white/80 p-10 rounded-[2.5rem] border border-white/20 shadow-2xl sticky top-24">
                      <div className="flex items-center gap-3 mb-8 text-[#10b981]">
                        <Calculator size={28}/>
                        <h3 className="font-black text-2xl tracking-tighter text-slate-900">Live Costing</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Menu Cost</span>
                          <span className="text-slate-900 font-black text-lg">{formatCurrency(proposal?.costPerHead * Number(guests))}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Logistics</span>
                          <span className="text-slate-900 font-black text-lg">{formatCurrency(proposal?.logistics?.deliveryFee || 0)}</span>
                        </div>
                        <div className="pt-8 border-t border-slate-100">
                          <span className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] block mb-2">Total Proposal Value</span>
                          <div className={`text-5xl font-black text-[#10b981] tracking-tighter transition-transform duration-300 ${isTotalUpdating ? 'scale-105' : 'scale-100'}`}>
                            {formatCurrency((proposal?.costPerHead * Number(guests)) + (proposal?.logistics?.deliveryFee || 0))}
                          </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                          <span className="text-slate-500 text-xs font-bold uppercase">Cost Per Head</span>
                          <span className="text-[#10b981] font-black">{formatCurrency(proposal?.costPerHead)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Logistics Card */}
                    <div className="backdrop-blur-md bg-white/70 p-8 rounded-[2rem] border border-white/20 shadow-xl">
                      <div className="flex items-center gap-3 mb-6 text-[#10b981]">
                        <Package size={24}/>
                        <h3 className="font-black text-xl tracking-tight text-slate-900">Logistics & Prep</h3>
                      </div>
                      <div className="space-y-5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Setup Time</span>
                          <span className="text-slate-700 font-bold text-sm">{proposal?.logistics?.setupTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Staff Required</span>
                          <span className="text-slate-700 font-bold text-sm">{proposal?.logistics?.staffRequired} Personnel</span>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100">
                          <span className="text-slate-400 uppercase text-[10px] font-black tracking-widest block mb-4">Wine Pairings</span>
                          <div className="flex flex-wrap gap-2">
                            {proposal?.winePairings?.map((wine: string, i: number) => (
                              <span key={i} className="bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{wine}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
            </div>
          );
        }

        return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-20">
            <div className="w-full max-w-2xl backdrop-blur-md bg-white/70 p-12 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-white/20">
              <h2 className="text-4xl font-black text-slate-900 mb-2 text-center tracking-tighter">Command Center</h2>
              <p className="text-slate-400 text-center mb-12 uppercase tracking-[0.4em] text-[10px] font-black">Chef Operations v4.0</p>
              
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
          <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6 text-center">
            <div className="w-32 h-32 bg-[#10b981]/10 rounded-[2.5rem] flex items-center justify-center mb-12 border border-[#10b981]/20 rotate-12">
              <Trophy className="text-[#10b981]" size={64} />
            </div>
            <h2 className="text-6xl font-black mb-6 tracking-tighter">Proposal Finalized!</h2>
            <p className="text-slate-500 text-xl mb-16 max-w-xl font-medium">
              Your culinary roadmap has been locked in. The kitchen is ready for your command.
            </p>
            <div className="flex gap-6">
              <button 
                onClick={() => setViewMode('generator')}
                className="bg-gradient-to-br from-[#10b981] to-[#059669] text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                New Proposal
              </button>
              <button 
                onClick={() => setViewMode('landing')}
                className="bg-slate-100 text-slate-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Exit to Office
              </button>
            </div>
          </div>
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
        onAuthClick={() => setIsAuthModalOpen(true)}
        user={user}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {renderView()}
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
        <div className="fixed top-24 right-6 z-[55] flex gap-3">
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
