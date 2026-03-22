
import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsOfService({ onBack }: { onBack: () => void }) {
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
              <FileText className="text-primary-600 w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Terms of Service</h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 font-medium">
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
              <p>By accessing or using CaterProAi, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on CaterProAi's website for personal, non-commercial transitory viewing only.</p>
              <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>Attempt to decompile or reverse engineer any software contained on CaterProAi's website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Disclaimer</h2>
              <p>The materials on CaterProAi's website are provided on an 'as is' basis. CaterProAi makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">4. Limitations</h2>
              <p>In no event shall CaterProAi or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CaterProAi's website.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">5. Accuracy of Materials</h2>
              <p>The materials appearing on CaterProAi's website could include technical, typographical, or photographic errors. CaterProAi does not warrant that any of the materials on its website are accurate, complete or current.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">6. Links</h2>
              <p>CaterProAi has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CaterProAi of the site.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">7. Modifications</h2>
              <p>CaterProAi may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">8. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
            </section>
            
            <p className="text-sm text-slate-400 mt-12 italic">Last Updated: March 11, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
