
import React, { useState } from 'react';
import { Facebook, Mail, Sparkles, Loader2 } from 'lucide-react';
import { automationService } from '../services/automationService';

const Footer: React.FC<{ facebookUrl?: string }> = ({ facebookUrl }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await automationService.triggerSignupWebhook({
        email,
        name,
        businessType: 'Newsletter Subscriber',
      });
      setIsSubscribed(true);
      setEmail('');
      setName('');
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Newsletter Section */}
        <div className="mb-12 glass-card noise-overlay p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                <Sparkles size={20} className="text-primary-500" />
                Stay in the Loop
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Get the latest culinary AI trends and scaling strategies.
              </p>
            </div>

            {isSubscribed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-sm animate-fade-in">
                You're on the list! 👨‍🍳
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-grow sm:w-40 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:border-primary-500 outline-none transition-all text-sm font-medium"
                />
                <input
                  type="email"
                  placeholder="chef@kitchen.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow sm:w-56 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:border-primary-500 outline-none transition-all text-sm font-medium"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          <p>&copy; 2026 CaterProAi. All rights reserved.</p>
          <p className="mt-1">Intelligent menu planning for catering professionals at caterproai.com</p>
          <p className="mt-2 font-bold text-slate-600 dark:text-slate-300">Contact: info@caterproai.com</p>
          
          <div className="mt-4 flex justify-center gap-4">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <span className="text-slate-300">|</span>
            <a href="/terms" className="hover:underline">Terms of Service</a>
          </div>
          
          {facebookUrl && (
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
            >
              <Facebook size={16} /> Join the Facebook Group
            </a>
          )}

          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            As an Amazon Associate, we earn from qualifying purchases. This site contains affiliate links.
          </p>
          <p className="mt-4 text-[10px] text-slate-300 dark:text-slate-600 font-mono">
            v1.0.3 &bull; 2026 Launch Build
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
