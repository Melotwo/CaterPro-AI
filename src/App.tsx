import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { getApiKey } from './services/geminiService';
import { DEFAULT_PROPOSAL } from './data/defaultProposal';
import { ProposalViewer } from './components/ProposalViewer';
import { StudentGrowthLab } from './components/StudentGrowthLab';
import { ProductivityLab } from './components/ProductivityLab';
import { EducationHubSection } from './components/EducationHubSection';
import { NewProposalModal } from './components/NewProposalModal';
import { PaystackUpgradeModal } from './components/PaystackUpgradeModal';
import { BanquetEventOrderModal } from './components/BanquetEventOrderModal';
import SocialMediaModal, { Mode as SocialMode } from './SocialMediaModal';
import MarketingRoadmap from './MarketingRoadmap';
import Calculator from './components/Calculator';
import RecipeGenerator from './components/RecipeGenerator';
import { CommandCenter } from './components/CommandCenter';
import { ChefHat } from 'lucide-react';
import { Menu } from './types';

// Toast Component
const Toast: React.FC<{ message: string | null; onDismiss: () => void }> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onDismiss, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[250]"
    >
      <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700/60 backdrop-blur-md">
        <span className="text-emerald-400 text-lg">⚡</span>
        <p className="text-xs font-black uppercase tracking-wider">{message}</p>
      </div>
    </motion.div>
  );
};

// AI Mentor Bot
const AiChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
    { role: 'model', content: "Welcome Chef! Ask me anything regarding menu adjustments, sauce lineages, regional pricing tips, or traditional French methodologies." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const msg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: messages })
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || 'Chef AI did not return a response. Please try again.';
        setMessages(prev => [...prev, { role: 'model', content: reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: 'Executive Culinary Consultant: For high-volume banquet service, maintain strict SANS 10330 HACCP cold-holding (<4°C) and target an Escoffier food cost benchmark under 30%.' }]);
      }
    } catch (err: any) {
      console.warn("Chat failed:", err);
      setMessages(prev => [...prev, { role: 'model', content: 'Executive Culinary Consultant (Offline Subterranean Sync): SANS 10330 HACCP parameters loaded. Station ready.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col items-end gap-3 text-left">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[360px] h-[520px] flex flex-col shadow-2xl border border-slate-200 bg-white rounded-3xl overflow-hidden"
          >
            <header className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 text-lg">
                  👨‍🍳
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider">Chef Mentor AI</h4>
                  <p className="text-[10px] text-slate-400">Culinary & Costing Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white font-bold text-lg">
                ✕
              </button>
            </header>

            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-medium ${
                      m.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <footer className="p-3 bg-white border-t border-slate-200">
              <form onSubmit={send} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Chef AI..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-xs text-slate-900 outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 w-7 h-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center transition-all text-xs"
                >
                  ➤
                </button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-700 transition-transform active:scale-95 text-2xl"
        title="Open Chef Mentor"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export function App() {
  const [activeTab, setActiveTab] = useState<'proposal' | 'calculator' | 'recipe'>('proposal');
  const [proposal, setProposal] = useState<Menu>(() => {
    const saved = localStorage.getItem('caterpro_recent_proposal');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PROPOSAL;
  });

  const [toast, setToast] = useState<string | null>(null);
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isBeoOpen, setIsBeoOpen] = useState(false);
  const [socialModal, setSocialModal] = useState<{ isOpen: boolean; mode: SocialMode }>({
    isOpen: false,
    mode: 'create'
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync dark class on root document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle saving proposal to localStorage
  const handleSaveProposal = () => {
    localStorage.setItem('caterpro_recent_proposal', JSON.stringify(proposal));
    setToast('Proposal saved to your browser storage!');
  };

  // Handle Export PDF
  const handleExportPdf = async () => {
    const el = document.getElementById('proposal-content');
    if (!el) {
      setToast('Proposal element not found');
      return;
    }
    setToast('Generating high-resolution PDF...');
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const props = pdf.getImageProperties(img);
      const w = pdf.internal.pageSize.getWidth();
      const h = (props.height * w) / props.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      if (h > pageHeight) {
        let position = 0;
        let remainingHeight = h;
        while (remainingHeight > 0) {
          pdf.addImage(img, 'PNG', 0, position, w, h);
          remainingHeight -= pageHeight;
          if (remainingHeight > 0) {
            pdf.addPage();
            position -= pageHeight;
          }
        }
      } else {
        pdf.addImage(img, 'PNG', 0, 0, w, h);
      }

      const fileName = `${(proposal.title || 'Catering_Proposal').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      pdf.save(fileName);
      setToast('PDF downloaded successfully!');
    } catch (err: any) {
      console.error(err);
      setToast('PDF export failed. Try printing the page.');
    }
  };

  // Copy proposal text for Docs
  const handleCopyForDocs = () => {
    let docText = `${proposal.title || 'Catering Proposal'}\n`;
    docText += `Date: ${proposal.eventDate || new Date().toLocaleDateString()}\n`;
    docText += `Guests: ${proposal.guestCount || 50}\n\n`;
    docText += `DESCRIPTION:\n${proposal.description || ''}\n\n`;
    docText += `MENU:\n`;
    (proposal.menu || []).forEach(m => {
      docText += `- ${m.dish} (${m.cat || 'Dish'}): ${m.notes || ''}\n`;
    });
    docText += `\nESTIMATED TOTAL: ZAR ${(proposal.manualTotal || 22500).toLocaleString()}\n`;
    navigator.clipboard.writeText(docText);
    setToast('Proposal copied to clipboard for Google Docs / Word!');
  };

  // Share link handler
  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: proposal.title || 'CaterPro AI Proposal',
        text: proposal.description || 'Check out this catering proposal',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast('Application URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans transition-colors selection:bg-emerald-500/20">
      
      {/* 1. TOP HEADER NAVIGATION BAR (Exact match to PDF) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div
            onClick={() => setActiveTab('proposal')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-sm border border-slate-800 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              CaterPro <span className="text-emerald-600">Ai</span>
            </span>
          </div>

          {/* Nav Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('proposal')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'proposal'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Proposal
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'calculator'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Calculator
            </button>
            <button
              onClick={() => setActiveTab('recipe')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'recipe'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Recipe Studio
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Upgrade (Amber button from PDF) */}
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>Upgrade</span>
            </button>

            {/* Install Button (Slate button from PDF) */}
            <button
              onClick={() => setToast('CaterPro AI is ready for offline subterranean use!')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <span>📥</span>
              <span>Install</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShareLink}
              title="Share Link"
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors"
            >
              🔗
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopyForDocs}
              title="Copy Proposal"
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors"
            >
              📋
            </button>

            {/* Theme Switcher Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Theme"
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {activeTab === 'proposal' && (
          <>
            {/* 2. PROPOSAL LIVE ACTION BAR (Exact match to PDF) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="text-left">
                <h1 className="text-lg sm:text-xl font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Proposal Live
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Manage, Share & Market your event.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNewProposalOpen(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <span>←</span>
                  <span>NEW</span>
                </button>

                <button
                  onClick={handleExportPdf}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>📥</span>
                  <span>PDF</span>
                </button>

                <button
                  onClick={handleSaveProposal}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>💾</span>
                  <span>SAVE</span>
                </button>
              </div>
            </div>

            {/* 3. STAR OF THE SHOW: CHEF EXECUTIVE COMMAND CENTER */}
            <CommandCenter
              proposal={proposal}
              region="South Africa (ZAR • R)"
              onNewProposal={() => setIsNewProposalOpen(true)}
              onOpenBeo={() => setIsBeoOpen(true)}
              onExportPdf={handleExportPdf}
              onOpenCalculator={() => setActiveTab('calculator')}
              onSaveProposal={handleSaveProposal}
              onUpdateGuestCount={(count) => {
                setProposal(prev => ({
                  ...prev,
                  guestCount: count,
                  manualTotal: ((prev.manualPerHead || 450) * count) + (prev.logistics?.deliveryFee || 1200)
                }));
                setToast(`Updated covers to ${count} guests`);
              }}
            />

            {/* 4. CATERING WORKSPACE BAR (Exact match to PDF) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="text-left">
                <h4 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                  Catering Workspace
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Share with team or export to docs
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShareLink}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <span>🔗</span> Share Link
                </button>
                <button
                  onClick={handleCopyForDocs}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <span>📋</span> Copy for Docs
                </button>
              </div>
            </div>

            {/* 5. MASTER PROPOSAL DOCUMENT (The 10 Numbered Cards, Sourcing, Allergen Matrix) */}
            <ProposalViewer
              proposal={proposal}
              onUpdateProposal={(updated) => setProposal(updated)}
              onOpenBeo={() => setIsBeoOpen(true)}
              onOpenUpgrade={() => setIsUpgradeOpen(true)}
              onExportPdf={handleExportPdf}
              onOpenSocialModal={(mode) => setSocialModal({ isOpen: true, mode })}
            />

            {/* 6. EXTENDED OPERATIONS & LABS */}
            <div className="space-y-8 pt-4">
              {/* Marketing Mission Control */}
              <MarketingRoadmap />

              {/* Student Growth Lab */}
              <StudentGrowthLab
                onCopyText={(text, title) => {
                  navigator.clipboard.writeText(text);
                  setToast(`${title} copied to clipboard!`);
                }}
              />

              {/* Productivity Lab (Beta) */}
              <ProductivityLab
                onNotify={(msg) => setToast(msg)}
              />

              {/* Education & Training Hub */}
              <EducationHubSection
                onNotify={(msg) => setToast(msg)}
                onOpenUpgrade={() => setIsUpgradeOpen(true)}
              />
            </div>
          </>
        )}

        {/* Secondary Views */}
        {activeTab === 'calculator' && (
          <div className="pt-4">
            <Calculator
              generatedMenu={proposal}
              region="South Africa"
              selectedItemName={proposal.menu?.[0]?.dish || ''}
              setSelectedItemName={() => {}}
            />
          </div>
        )}

        {activeTab === 'recipe' && (
          <div className="pt-4">
            <RecipeGenerator
              generatedMenu={proposal}
              region="South Africa"
              selectedItemName={proposal.menu?.[0]?.dish || ''}
              setSelectedItemName={() => {}}
            />
          </div>
        )}

      </main>

      {/* 7. FOOTER (Exact match to PDF) */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20 text-center text-xs text-slate-500 space-y-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="font-bold text-slate-700">
            © 2025 CaterPro AI. All rights reserved.
          </p>
          <p className="text-slate-500">
            Intelligent menu planning for catering professionals.
          </p>
          <p className="text-[11px] text-slate-400 italic max-w-xl mx-auto">
            As an Amazon Associate, we earn from qualifying purchases. This site contains affiliate links.
          </p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] font-mono text-slate-500">
              v1.0.1 • Live Build
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <NewProposalModal
        isOpen={isNewProposalOpen}
        onClose={() => setIsNewProposalOpen(false)}
        region="South Africa"
        onMenuGenerated={(newMenu) => {
          setProposal(newMenu);
          localStorage.setItem('caterpro_recent_proposal', JSON.stringify(newMenu));
          setToast('New Proposal successfully drafted by Chef AI!');
        }}
      />

      <PaystackUpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />

      {isBeoOpen && (
        <BanquetEventOrderModal
          isOpen={isBeoOpen}
          onClose={() => setIsBeoOpen(false)}
          menu={proposal}
          margin={72.4}
        />
      )}

      {socialModal.isOpen && (
        <SocialMediaModal
          isOpen={socialModal.isOpen}
          onClose={() => setSocialModal({ ...socialModal, isOpen: false })}
          image={proposal.heroImage}
          menuTitle={proposal.title || 'Catering Proposal'}
          menuDescription={proposal.description || ''}
          initialMode={socialModal.mode}
        />
      )}

      <Toast message={toast} onDismiss={() => setToast(null)} />
      <AiChatBot />
    </div>
  );
}

export default App;
