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
      answer: "Yes! You can generate your first 50 menus completely for free. We want you to see the magic before you commit."
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
                  <span>Christmas Special 🎅</span>
                </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              You are a Chef. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-400">
                Not a Typist.
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              The global AI assistant for chefs who hate paperwork. Generate menus, shopping lists, and proposals in seconds—any cuisine, any country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onGetStarted}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary-600 rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl hover:scale-105 transition-all"
              >
                Write My Menu For Me
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span className="text-green-500 font-bold text-lg mr-1">✓</span> Join 50+ Chefs &bull; <span className="text-green-500 font-bold text-lg mx-1">✓</span> Global Cuisine Support
            </p>
          </div>
          
          <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl"></div>
             <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform rotate-1">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                </div>
                <div className="p-8">
                    <div className="space-y-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse delay-75"></div>
                        <div className="flex gap-4 mt-8">
                             <div className="flex-1 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg text-center">
                                 <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                 <p className="font-bold text-slate-800 dark:text-slate-200">Spelling Fixed</p>
                             </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- FOUNDER STORY --- */}
      <div className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/3">
                    <img src={imageSrc} alt="Founder" className="rounded-xl shadow-2xl border-slate-700 transform -rotate-2 w-full object-cover aspect-[3/4]" onError={handleImageError}/>
                </div>
                <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold mb-6">"I built this because paperwork shouldn't be a chef's barrier."</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-4">
                        Growing up with <strong>ADHD and Dyslexia</strong>, the "admin" side of catering was my biggest nightmare. I'd spend hours stressing over spelling "Hors d'oeuvres" instead of focusing on the flavor.
                    </p>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        I built <strong>CaterPro AI</strong> for every chef who is tired of the grind behind the computer.
                    </p>
                    <div className="mt-8 pt-8 border-t border-slate-700 flex gap-2">
                        <button onClick={() => handleShare('linkedin')} className="flex items-center gap-2 px-4 py-2 bg-[#0077b5] text-white rounded-lg hover:bg-[#006097] text-sm font-bold">
                            <Linkedin size={16} /> Share on LinkedIn
                        </button>
                        <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-slate-800 text-sm font-bold">
                            <Twitter size={16} /> Post on X
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- FAQ --- */}
      <div className="bg-white dark:bg-slate-900 py-16">
         <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Global Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center p-4 text-left font-bold hover:bg-slate-50 dark:hover:bg-slate-800">
                            {faq.question}
                            {openFaq === index ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        {openFaq === index && <div className="p-4 text-slate-600 dark:text-slate-400 border-t">{faq.answer}</div>}
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default LandingPage;
