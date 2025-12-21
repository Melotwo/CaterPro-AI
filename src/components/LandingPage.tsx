
import React, { useState } from 'react';
import { ChefHat, Check, ArrowRight, Star, Zap, Quote, ChevronDown, ChevronUp, HelpCircle, AlignLeft, Linkedin, Twitter, Brain, Heart, Gift, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const imageSrc = `/founder.jpg?v=${new Date().getTime()}`;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
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
      answer: "No. CaterPro AI is global. It generates menus based on any cuisine (from Balkan to South African) and calculates logistics for any region."
    },
    {
      question: "Is CaterPro AI really free to try?",
      answer: "Yes! You can generate your first few menus for free. We want you to see the magic before you commit to a pro plan."
    },
    {
      question: "I have Dyslexia/ADHD. Will this help?",
      answer: "I built this specifically for us. It handles the spelling, formatting, and organization that often causes us stress. It is 100% ADHD-friendly."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden pt-16 pb-12 lg:pt-24 lg:pb-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left z-10">
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-sm font-semibold animate-fade-in border border-primary-200 dark:border-primary-700">
                  <Globe size={14} />
                  <span>Global AI Assistant</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-bold animate-bounce border border-red-200 dark:border-red-700">
                  <Gift size={14} />
                  <span>Holiday Sale Live 🎁</span>
                </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              You are a Chef. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-400">
                Not a Typist.
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Stop spending your Sundays on paperwork. Generate menus, shopping lists, and professional proposals in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onGetStarted}
                className="inline-flex items-center justify-center px-10 py-5 text-lg font-black text-white bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-700 hover:scale-105 transition-all"
              >
                Start Your First Proposal
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
             <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform rotate-1 transition-transform hover:rotate-0 duration-500">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                </div>
                <div className="p-10">
                    <div className="space-y-6">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse delay-75"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse delay-150"></div>
                        <div className="pt-8">
                             <div className="p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500/20 rounded-2xl text-center">
                                 <Check className="w-10 h-10 text-green-500 mx-auto mb-3" />
                                 <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Proposal Validated</p>
                             </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- FOUNDER STORY --- */}
      <div className="bg-slate-950 text-white py-20 sm:py-32 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-12 items-center lg:items-start">
                <div className="w-full md:w-2/5 order-first md:order-last">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <img 
                            src={imageSrc} 
                            alt="Founder" 
                            className="relative rounded-2xl shadow-2xl w-full object-cover aspect-square md:aspect-[3/4]" 
                            onError={handleImageError}
                        />
                    </div>
                </div>
                
                <div className="w-full md:w-3/5 space-y-8">
                    <div className="inline-block p-3 bg-primary-500/10 rounded-2xl">
                        <Brain className="w-8 h-8 text-primary-500" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight italic">
                        "I built this because paperwork shouldn't be a chef's barrier."
                    </h2>
                    <div className="space-y-6 text-slate-400 text-lg leading-relaxed font-medium">
                        <p>
                            Growing up with <strong>ADHD and Dyslexia</strong>, the "admin" side of catering was my biggest nightmare. I'd spend hours stressing over spelling and organization instead of focusing on the flavor.
                        </p>
                        <p>
                            I built <strong>CaterPro AI</strong> for every chef who is tired of the grind behind the computer. It handles the spelling, the pricing, and the lists so you can get back to what you love.
                        </p>
                    </div>
                    <div className="pt-10 border-t border-slate-800 flex flex-wrap gap-3">
                        <button onClick={() => handleShare('linkedin')} className="flex items-center gap-2 px-6 py-3 bg-[#0077b5] text-white rounded-xl hover:bg-[#006097] text-sm font-black transition-all active:scale-95 shadow-lg shadow-blue-500/10">
                            <Linkedin size={18} /> Share My Story
                        </button>
                        <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-slate-100 text-sm font-black transition-all active:scale-95 shadow-lg shadow-white/10">
                            <Twitter size={18} /> Post on X
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- FAQ --- */}
      <div className="bg-white dark:bg-slate-900 py-24" id="faq">
         <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Common Questions</h2>
                <p className="text-slate-500 mt-2 font-medium">Everything you need to know about the chef's secret weapon.</p>
            </div>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-2 border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden transition-all hover:border-primary-500/30">
                        <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center p-6 text-left font-black text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <span className="pr-4">{faq.question}</span>
                            {openFaq === index ? <ChevronUp className="text-primary-500" /> : <ChevronDown className="text-slate-400" />}
                        </button>
                        {openFaq === index && (
                            <div className="p-6 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 animate-slide-in">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default LandingPage;
