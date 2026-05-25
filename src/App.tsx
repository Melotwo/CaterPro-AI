import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { getApiKey } from './services/geminiService';
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import RecipeGenerator from './components/RecipeGenerator';

// --- CONSTANTS ---
const WHOP_CHECKOUT_URL = "https://whop.com/caterpro-ai"; 
const OCTAGON_CLIP = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';

// --- CORE UTILITY OVERLAYS ---

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div className="h-12 w-12 rounded-full border-2 border-emerald-500 flex items-center justify-center overflow-hidden bg-white shadow-lg relative">
      <img src="/logo.png" alt="CaterPro AI" className="w-10 h-10 object-contain" />
    </div>
    <span className="text-2xl font-black tracking-tighter uppercase italic text-white">
      CaterPro<span className="text-emerald-500">AI</span>
    </span>
  </div>
);

const Toast: React.FC<{ message: string | null; onDismiss: () => void }> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);
  if (!message) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200]"
    >
      <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20 backdrop-blur-xl">
        <span className="text-xl">⚡</span>
        <p className="text-sm font-black uppercase tracking-widest">{message}</p>
      </div>
    </motion.div>
  );
};

const SavingsEstimator: React.FC = () => {
  const [monthlySpend, setMonthlySpend] = useState(50000);
  const savings = monthlySpend * 0.15; 
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl p-12 rounded-[4rem] border border-white/10 shadow-2xl mt-12 text-left">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-sky-500/20 rounded-2xl flex items-center justify-center text-sky-400 text-2xl">📈</div>
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Weight Audit Estimator</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">Monthly Food Spend (R)</label>
          <input 
            type="range" 
            min="10000" 
            max="500000" 
            step="5000" 
            value={monthlySpend} 
            onChange={(e) => setMonthlySpend(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xl font-black text-white italic">
            <span>R {monthlySpend.toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-emerald-600/10 border border-emerald-500/20 p-8 rounded-[3rem] text-center">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 opacity-60">Estimated Monthly Savings</p>
          <h4 className="text-5xl font-black text-emerald-400 tracking-tighter">R {savings.toLocaleString()}</h4>
          <p className="text-xs text-slate-400 italic mt-4 opacity-60">Based on 15% precision scaling efficiency</p>
        </div>
      </div>
    </div>
  );
};

const HeroSection: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="relative pt-32 pb-20 overflow-hidden text-center">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 rounded-full border border-sky-500/20 mb-12">
        <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Culinary Logic Engine</span>
      </motion.div>
      
      <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-8 uppercase italic">
        CaterPro<span className="text-emerald-500">AI</span>
      </motion.h1>
      <p className="text-xl font-medium text-slate-400 opacity-60 max-w-2xl mx-auto mb-12 italic text-center">
        Transparent costing. Stunning proposals. Zero-waste operations.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <button onClick={onStart} className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20 flex items-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
          <span className="text-xl">⚡</span>
          Start New Proposal
        </button>
        <button onClick={() => window.location.href = WHOP_CHECKOUT_URL} className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-2xl flex items-center gap-3" style={{ clipPath: OCTAGON_CLIP }}>
          <span className="text-xl">🛡️</span>
          Upgrade to Pro
        </button>
      </div>
    </div>
  </div>
);

const AiChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
    { role: 'model', content: "Welcome Chef! Ask me anything regarding menu adjustments, sauce lineages, regional pricing tips, or traditional French methodologies." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    if (isOpen && messages.length <= 1) { 
      const apiKey = getApiKey();
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'model', content: "Notice: The client-side API Key (VITE_GEMINI_API_KEY) was not found. Please set it in Settings > Secrets." }]);
      }
    } 
  }, [isOpen]);
  
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault(); if (!input.trim() || loading) return;
    const msg = input; setInput(''); setMessages(prev => [...prev, { role: 'user', content: msg }]); setLoading(true);
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error("Client API Key is missing. Please configure VITE_GEMINI_API_KEY.");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const promptHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...promptHistory,
          { role: 'user', parts: [{ text: msg }] }
        ],
        config: {
          systemInstruction: 'You are a professional and friendly AI Culinary Consultant. Answer questions about culinary disciplines, Esfcoffier guidelines, standard costing, and chef advice concisely and elegantly.'
        }
      });

      const reply = response.text || 'Chef AI did not return a response. Please try again.';
      setMessages(prev => [...prev, { role: 'model', content: reply }]);
    } catch (err: any) { 
      console.error("Chat failed:", err);
      setMessages(prev => [...prev, { role: 'model', content: `Catering consultant error: ${err.message || 'Check your API Key.'}` }]);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6 text-left">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-[380px] h-[600px] flex flex-col shadow-2xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] overflow-hidden">
            <header className="p-8 bg-slate-950 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 text-xl">👨‍🍳</div>
                <h2 className="text-white font-black text-sm uppercase tracking-widest">Chef Mentor</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors text-xl">🗑️</button>
            </header>
            <div className="flex-grow p-8 overflow-y-auto space-y-6 bg-slate-900/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[2rem] px-6 py-4 text-sm font-medium ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <footer className="p-8 bg-slate-950 border-t border-white/5">
              <form onSubmit={send} className="relative">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Chef AI..." className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 pr-16 text-sm text-white outline-none focus:border-emerald-500" />
                <button type="submit" className="absolute right-2 top-2 w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-all text-xl">➡️</button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} className="w-20 h-20 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-600/30 text-2xl">
        {isOpen ? '🗑️' : '💬'}
      </motion.button>
    </div>
  );
};

// --- MAIN ROOT STATE SYNCHRONIZER ---

function App() {
  const [view, setView] = useState('landing');
  const [generatedMenu, setGeneratedMenu] = useState<any | null>(null);
  const [menuImage, setMenuImage] = useState<string>('');
  const [operatingRegion, setOperatingRegion] = useState<string>('South Africa');
  const [selectedItemName, setSelectedItemName] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 relative">
      <NoiseOverlay />
      
      {/* Global Header Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/45 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div onClick={() => setView('landing')} className="cursor-pointer group">
            <Logo />
          </div>
          <div className="hidden md:flex items-center gap-10">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'calculator', label: 'Calculator', icon: '🧮' },
              { id: 'recipe', label: 'Recipe Studio', icon: '👨‍🍳' }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setView(item.id)} 
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${view === item.id ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <button onClick={() => window.location.href = WHOP_CHECKOUT_URL} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-emerald-500 hover:text-white transition-all shadow-xl" style={{ clipPath: OCTAGON_CLIP }}>Upgrade</button>
          </div>
        </div>
      </nav>
      
      {/* Animated Route Rendering Panels */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HeroSection onStart={() => setView('dashboard')} />
              <div className="max-w-7xl mx-auto px-6 pb-32">
                <SavingsEstimator />
              </div>
            </motion.div>
          )}
          {view === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pb-32">
              <Dashboard 
                generatedMenu={generatedMenu}
                setGeneratedMenu={setGeneratedMenu}
                menuImage={menuImage}
                setMenuImage={setMenuImage}
                region={operatingRegion}
                setRegion={setOperatingRegion}
                setSelectedItemName={setSelectedItemName}
              />
            </motion.div>
          )}
          {view === 'calculator' && (
            <motion.div key="calculator" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Calculator
                generatedMenu={generatedMenu}
                region={operatingRegion}
                selectedItemName={selectedItemName}
                setSelectedItemName={setSelectedItemName}
              />
            </motion.div>
          )}
          {(view === 'recipe' || view === 'recipe-generator') && (
            <motion.div key="recipe" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <RecipeGenerator
                generatedMenu={generatedMenu}
                region={operatingRegion}
                selectedItemName={selectedItemName}
                setSelectedItemName={setSelectedItemName}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Aesthetic Footer */}
      <footer className="bg-slate-950 py-20 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Logo />
          </div>
          <p className="text-slate-500 font-medium italic mb-8 opacity-60">Empowering chefs with AI-driven precision. Built for the Modern Kitchen.</p>
        </div>
      </footer>

      <Toast message={toast} onDismiss={() => setToast(null)} />
      <AiChatBot />
    </div>
  );
}

export default App;
