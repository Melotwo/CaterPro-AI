import React from 'react';

interface StudentGrowthLabProps {
  onCopyText: (text: string, title: string) => void;
}

export const StudentGrowthLab: React.FC<StudentGrowthLabProps> = ({ onCopyText }) => {
  const viralPostText = `POV: You're doing a City & Guilds qualification in Hospitality, but you spend 4 hours every weekend typing up recipes, calculating food costs, and organizing allergen sheets. 😅\n\nI built CaterPro AI specifically for South African chefs & students to generate full, costed catering proposals in ZAR with statutory allergen matrices in 30 seconds.\n\nStop drowning in admin. Get back to cooking. Check out CaterPro AI: https://caterproai.com`;

  const whatsAppText = `Hey Chefs & Hospitality Students! 👨‍🍳 Stop spending your entire weekend on costing calculations and recipe paperwork. Check out CaterPro AI — it generates complete catering proposals with South African Rand costing in 30 seconds: https://caterproai.com 🇿🇦`;

  const deanOutreachText = `Subject: Modernizing Culinary Curriculum with Automated Costing Tools (City & Guilds Aligned)\n\nDear Head of Culinary / TVET Dean,\n\nI am reaching out regarding how occupational culinary students can bridge the gap between classroom theory and real-world commercial kitchen admin. Having achieved a 100% grade in the Google Productivity with AI certification, I architected CaterPro AI to teach students practical yield calculations, menu engineering, and statutory allergen governance.\n\nI would love to explore introducing a guided workshop for your 2026 students.\n\nWarm regards,\nTumi & the CaterPro AI Team`;

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">Student Growth Lab</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Empower culinary apprentices and students with automated curriculum materials and outreach scripts.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
            City & Guilds Compliant
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Viral FB Post */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-bold text-lg">📱</span>
              <h4 className="text-sm font-black uppercase text-slate-800">Viral FB Post</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The 'Street-Smart' post. Personal, persuasive, and hits the City & Guilds pain points."
            </p>
          </div>
          <button
            onClick={() => onCopyText(viralPostText, 'Viral Facebook Post')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>📋</span> Copy High-Impact Post
          </button>
        </div>

        {/* WhatsApp Status */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-600 font-bold text-lg">💬</span>
              <h4 className="text-sm font-black uppercase text-slate-800">WhatsApp Status</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Short, punchy, and urgent. Perfect for a quick link-in-bio update."
            </p>
          </div>
          <button
            onClick={() => onCopyText(whatsAppText, 'WhatsApp Status')}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>💬</span> Copy Status Text
          </button>
        </div>

        {/* Dean Outreach */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-purple-600 font-bold text-lg">🏫</span>
              <h4 className="text-sm font-black uppercase text-slate-800">Dean Outreach</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Pitch to TVET Colleges. Mention the 100% Grade Google Certificate to build trust."
            </p>
          </div>
          <button
            onClick={() => onCopyText(deanOutreachText, 'Dean Pitch Prompt')}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>✉️</span> Copy Dean Pitch Prompt
          </button>
        </div>
      </div>

      {/* Pro Tip Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
        <span className="text-2xl shrink-0">💡</span>
        <div>
          <h5 className="text-xs font-black uppercase tracking-wider text-amber-900">Tumi's Pro-Tip:</h5>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            When you post on Facebook, add a photo of yourself in your Chef whites or a screenshot of a perfect menu generated by the app. Visuals increase engagement by 40%!
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentGrowthLab;
