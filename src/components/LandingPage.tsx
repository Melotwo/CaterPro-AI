
import React, { useState } from 'react';
import { ChefHat, Check, ArrowRight, Star, Zap, Quote, ChevronDown, ChevronUp, HelpCircle, AlignLeft, Linkedin, Twitter, Brain, Heart, Gift, Globe, Rocket } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const imageSrc = `/founder.jpg?v=${new Date().getTime()}`;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleScrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-plans');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      onGetStarted(); // Fallback to generator view
    }
  };

  const handleShare = (platform: 'linkedin' | 'twitter') => {
      const url = "https://caterpro-ai.web.app/";
      const text = encodeURIComponent("I just launched CaterPro AI! It helps chefs write catering proposals and shopping lists automatically. Check it out:");
      if (platform === 'linkedin') {
          window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}%20${url}`, '_blank');
      } else {
          window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.currentTarget;
      if (target.src.includes('unsplash')) {
          target.style.display = 'none';
      } else {
          target.src = "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80";
      }
  };

  const faqs = [
    {
      question: "Is this for a specific country?",
      answer: "No. CaterPro AI is global. It generates menus based on any cuisine (from Balkan to South African) and calculates logistics for any region with local currency support."
    },
    {
      question: "Is CaterPro AI really free to try?",
      answer: "Yes! You can generate your first few menus for free. We want you to see the magic before you commit to a founder's plan."
    },
    {
      question: "I have Dyslexia/ADHD. Will this help?",
      answer: "I built this specifically for us. It handles the spelling, formatting, and organization that often causes us stress. It is 100% ADHD-friendly and visually structured."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden pt-16 pb-12 lg:pt-24 lg:pb-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left z-10">
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                <button 
                  onClick={handleScrollToPricing}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs font-black animate-fade-in border-2 border-primary-200 dark:border-primary-700 hover:scale-105 transition-transform shadow-lg shadow-primary-500/10 cursor-pointer"
                >
                  <Globe size={14} className="animate-spin-slow" />
                  <span>Global AI Assistant</span>
                </button>
                <button 
                  onClick={handleScrollToPricing}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-black border-2 border-indigo-400 hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20 cursor-pointer"
                >
                  <Rocket size={14} />
                  <span>Founder's Launch Live 🚀</span>
                </button>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-[0.9]">
              You are a Chef. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500">
                Not a Typist.
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Stop spending your Sundays on paperwork. Generate menus, shopping lists, and professional proposals in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onGetStarted}
                className="inline-flex items-center justify-center px-12 py-5 text-lg font-black text-white bg-primary-600 rounded-2xl shadow-2xl shadow-primary-500/30 hover:bg-primary-700 hover:scale-105 transition-all"
              >
                Start Your First Proposal
                <ArrowRight className="ml-2 w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-16 lg:mt-0 relative px-4">
             <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border-4 border-slate-100 dark:border-slate-800 overflow-hidden transform lg:rotate-2 transition-transform hover:rotate-0 duration-700">
                <div className="bg-slate-50 dark:bg-slate-800 p-5 border-b-2 border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                </div>
                <div className="p-12">
                    <div className="space-y-8">
                        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4 animate-pulse"></div>
                        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-full animate-pulse delay-75"></div>
                        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-2/3 animate-pulse delay-150"></div>
                        <div className="pt-12">
                             <div className="p-10 bg-emerald-50 dark:bg-emerald-900/20 border-4 border-dashed border-emerald-500/30 rounded-[2rem] text-center">
                                 <Check className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                 <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Proposal Validated</p>
                                 <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-2 font-bold">Local Currency Costing Sync: OK</p>
                             </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- FOUNDER STORY --- */}
      <div className="bg-slate-950 text-white py-24 sm:py-40 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-16 items-center lg:items-start">
                <div className="w-full md:w-2/5 order-first md:order-last">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <img 
                            src={imageSrc} 
                            alt="Founder Tumi" 
                            className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-square md:aspect-[4/5] border-2 border-white/10" 
                            onError={handleImageError}
                        />
                    </div>
                </div>
                
                <div className="w-full md:w-3/5 space-y-10">
                    <div className="inline-block p-4 bg-primary-500/10 rounded-2xl">
                        <Brain className="w-10 h-10 text-primary-500" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[0.9] italic tracking-tight">
                        "I built this because paperwork shouldn't be a chef's barrier."
                    </h2>
                    <div className="space-y-8 text-slate-400 text-xl leading-relaxed font-medium">
                        <p>
                            Growing up with <strong>ADHD and Dyslexia</strong>, the "admin" side of catering was my biggest nightmare. I'd spend hours stressing over spelling and organization instead of focusing on the flavor.
                        </p>
                        <p>
                            I built <strong>CaterPro AI</strong> for every chef who is tired of the grind behind the computer. It handles the spelling, the pricing, and the lists so you can get back to what you love.
                        </p>
                    </div>
                    <div className="pt-12 border-t border-slate-800 flex flex-wrap gap-4">
                        <button onClick={() => handleShare('linkedin')} className="flex items-center gap-3 px-8 py-4 bg-[#0077b5] text-white rounded-2xl hover:bg-[#006097] text-sm font-black transition-all active:scale-95 shadow-xl shadow-blue-500/20">
                            <Linkedin size={20} /> Share My Story
                        </button>
                        <button onClick={() => handleShare('twitter')} className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl hover:bg-slate-100 text-sm font-black transition-all active:scale-95 shadow-xl shadow-white/10">
                            <Twitter size={20} /> Post on X
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- FAQ --- */}
      <div className="bg-white dark:bg-slate-900 py-32" id="faq">
         <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Common Questions</h2>
                <p className="text-slate-500 mt-4 text-lg font-medium">Everything you need to know about the chef's secret weapon.</p>
            </div>
            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-4 border-slate-50 dark:border-slate-800 rounded-[2rem] overflow-hidden transition-all hover:border-primary-500/20 shadow-sm">
                        <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center p-8 text-left font-black text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <span className="pr-4 text-lg">{faq.question}</span>
                            {openFaq === index ? <ChevronUp className="text-primary-500 w-6 h-6" /> : <ChevronDown className="text-slate-400 w-6 h-6" />}
                        </button>
                        {openFaq === index && (
                            <div className="p-8 text-slate-600 dark:text-slate-400 border-t-2 border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 animate-slide-in text-lg font-medium leading-relaxed">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
         </div>
      </div>
      
      {/* Target for scrolling to pricing */}
      <div id="pricing-plans" className="pb-20"></div>
    </div>
  );
};

export default LandingPage;
