
import React, { useState } from 'react';
import { Calendar, CheckCircle2, Zap, Trophy, Shield, Globe, CreditCard, Mail, Users, DollarSign, Smartphone, Target, BookCheck, ChevronRight, Copy, Award, ShieldCheck, ShoppingBag, Terminal, HelpCircle, MessageSquareQuote } from 'lucide-react';

const dailyTasks = [
  { id: 'whop-delete-old', label: 'Delete "Melotwo Bliss" from Whop Products', highPriority: true },
  { id: 'whop-create-student', label: 'Create "Student Edition" ($5.99/mo)', highPriority: true },
  { id: 'whop-create-pro', label: 'Create "Professional" ($19.99/mo)', highPriority: true },
  { id: 'whop-create-biz', label: 'Create "Business" ($29.99/mo)', highPriority: true },
  { id: 'pwa-reinstall', label: 'Re-add app to home screen (Logo Fix)', highPriority: true },
];

const whopFaqs = [
  {
    q: "How does this help with my PoE?",
    a: "CaterPro AI automates the heavy lifting of Portfolio of Evidence (PoE) formatting, menu costing, and mise en place lists. It ensures your logic follows international standards like City & Guilds, saving you 10+ hours of admin per assignment."
  },
  {
    q: "Is it really built for ADHD/Dyslexia?",
    a: "Yes. Our founder Tumi built this specifically to solve the 'blank page' anxiety and spelling hurdles that come with neurodiversity. The UI is clean, structured, and handles the spelling and formatting for you."
  },
  {
    q: "Can I use it for my local currency?",
    a: "Absolutely. Whether you are in South Africa (ZAR), the USA (USD), or the UK (GBP), the AI adjusts its costing engine to your local market prices instantly."
  },
  {
    q: "What is the 'Early Bird' price?",
    a: "The current rates are for our Founder's Launch Phase. By joining now, you lock in these low rates forever, even when the public price increases next month."
  }
];

const whopProducts = [
  { 
    name: 'Student Edition', 
    headline: 'Founder\'s Deal: Automate your Culinary PoE & Costing.',
    price: '$5.99/mo', 
    desc: 'The AI Secret Weapon for Culinary Students. Automate your Portfolio of Evidence (PoE), precise food costing, and academic formatting. Built for City & Guilds/QCTO standards. Optimized for ADHD/Dyslexia.' 
  },
  { 
    name: 'Professional', 
    headline: 'Early Bird: The Ultimate Suite for Working Chefs.',
    price: '$19.99/mo', 
    desc: 'Everything in Student + NO Watermarks on PDFs, AI Food Photography, Sommelier Wine Pairings, and Unlimited Menu Generation. Professional sourcing lists in your local currency.' 
  },
  { 
    name: 'Business', 
    headline: 'VIP: Scale your Catering Brand with Viral AI Tools.',
    price: '$29.99/mo', 
    desc: 'Viral Reel Creator, Magic Share Links for clients, Global Supplier Hub, and priority 1-on-1 support for scaling your culinary business.' 
  },
];

const FounderRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'growth' | 'whop'>('growth');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set([]));

  const toggleTask = (taskId: string) => {
    const newTasks = new Set(completedTasks);
    if (newTasks.has(taskId)) newTasks.delete(taskId);
    else newTasks.add(taskId);
    setCompletedTasks(newTasks);
  };

  return (
    <section className="mt-16 animate-slide-in border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Live Dashboard</div>
                <div className="flex items-center gap-1 text-slate-400 text-xs"><ShieldCheck size={12} className="text-amber-400" /> Whop Sync Week</div>
            </div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" /> Tumi's Command Center
            </h2>
          </div>
          
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('growth')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'growth' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>
                <Trophy size={14} /> Mission
            </button>
            <button onClick={() => setActiveTab('whop')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'whop' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400'}`}>
                <ShoppingBag size={14} /> Whop Cheat Sheet
            </button>
            <button onClick={() => setActiveTab('blueprint')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'blueprint' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>
                <Calendar size={14} /> Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'growth' && (
          <div className="space-y-10 animate-fade-in max-w-4xl mx-auto py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Launch Checklist</h3>
                    <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                        {dailyTasks.map((task) => (
                        <button key={task.id} onClick={() => toggleTask(task.id)} className={`w-full flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-700 text-left ${completedTasks.has(task.id) ? 'bg-slate-50' : ''}`}>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${completedTasks.has(task.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                {completedTasks.has(task.id) && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <span className={`text-sm font-medium ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{task.label}</span>
                        </button>
                        ))}
                    </div>
                </div>

                <div className="bg-primary-50/30 dark:bg-primary-900/10 p-6 rounded-3xl border-2 border-primary-100 dark:border-primary-800">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary-600 mb-4 flex items-center gap-2"><Award size={16} /> Strategy Note</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "Tumi, the low prices are perfect for a **Founder's Launch**. Use the 'Early Bird' labels I added to the Whop descriptions. It tells global users: 'This is usually $50, but it's $19 for now because you are early.' It increases sales dramatically."
                    </p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'whop' && (
          <div className="animate-fade-in space-y-12 pb-12">
            {/* Products Section */}
            <div className="space-y-8">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center gap-4">
                    <Terminal className="text-indigo-600" />
                    <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-tight">Whop Product Content</p>
                </div>
                <div className="grid grid-cols-1 gap-8">
                    {whopProducts.map((p) => (
                        <div key={p.name} className="p-8 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl shadow-sm space-y-6">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
                                <h4 className="font-black text-xl text-slate-900 dark:text-white uppercase">{p.name}</h4>
                                <span className="text-lg font-black text-indigo-600">{p.price}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Headline</p>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <code className="text-[10px] font-bold text-indigo-500">{p.headline}</code>
                                            <button onClick={() => { navigator.clipboard.writeText(p.headline); }} className="p-1.5 hover:bg-white rounded-lg transition-colors"><Copy size={14}/></button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Description</p>
                                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 relative group">
                                            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed pr-8">{p.desc}</p>
                                            <button onClick={() => { navigator.clipboard.writeText(p.desc); }} className="absolute top-3 right-3 p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors shadow-sm"><Copy size={14}/></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-8">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-4">
                    <HelpCircle className="text-amber-600" />
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-100 uppercase tracking-tight">Whop FAQ Section (Copy These)</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {whopFaqs.map((faq, i) => (
                        <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-start mb-2">
                                <h5 className="text-xs font-black uppercase text-slate-400 tracking-widest">Question {i+1}</h5>
                                <button onClick={() => { navigator.clipboard.writeText(faq.q); }} className="text-amber-600 hover:text-amber-700"><Copy size={14}/></button>
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">{faq.q}</p>
                            <div className="flex justify-between items-start mb-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <h5 className="text-xs font-black uppercase text-slate-400 tracking-widest">Answer</h5>
                                <button onClick={() => { navigator.clipboard.writeText(faq.a); }} className="text-amber-600 hover:text-amber-700"><Copy size={14}/></button>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'blueprint' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                 <Globe className="text-blue-500 mb-3" />
                 <p className="text-[10px] font-black uppercase text-slate-500">Jan 7th</p>
                 <p className="text-sm font-bold">Register caterpro.ai</p>
              </div>
              <div className="p-5 bg-rose-50 dark:bg-rose-900/20 rounded-2xl">
                 <Mail className="text-rose-500 mb-3" />
                 <p className="text-[10px] font-black uppercase text-slate-500">Jan 14th</p>
                 <p className="text-sm font-bold">Klaviyo Email Flows</p>
              </div>
              <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                 <Users className="text-amber-500 mb-3" />
                 <p className="text-[10px] font-black uppercase text-slate-500">Jan 21st</p>
                 <p className="text-sm font-bold">Academy Partnership Pitch</p>
              </div>
           </div>
        )}
      </div>
    </section>
  );
};

export default FounderRoadmap;
