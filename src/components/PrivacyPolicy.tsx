
import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8 sm:p-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to App
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
              <Shield className="text-primary-600 w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 font-medium">
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, generate a menu, or contact us for support. This may include your name, email address, and culinary preferences.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, including generating personalized catering menus and proposals via CaterProAi. We also use it to communicate with you about updates and promotions.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Data Security</h2>
              <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">4. Third-Party Services</h2>
              <p>We use third-party services like Firebase for authentication and data storage, and Google Gemini for AI content generation. These services have their own privacy policies.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at support@caterproai.com.</p>
            </section>
            
            <p className="text-sm text-slate-400 mt-12 italic">Last Updated: March 4, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
