
import React, { useState } from 'react';
import { 
  CheckCircle2, Zap, Trophy, Target, Copy, Award, Users, Crosshair, BrainCircuit, Search, 
  Linkedin, Briefcase, ExternalLink, MailOpen, FileUser, FileText, Globe, ShieldCheck, 
  Quote, ArrowRight, Rocket, Video, Home, TrendingUp, Mic2, PlayCircle, Monitor, 
  Camera, ClipboardCheck, BookOpen, Building2, Presentation, Layout, Eye, MessageSquare, 
  Sparkles, Loader2, AlertCircle, AlertTriangle, ListChecks, Star, Settings2, HelpCircle, 
  ShoppingBag, UserPlus, MessageCircle, DollarSign, PieChart, Info, Smartphone, Check, 
  MousePointer2, Activity, ShieldAlert, Instagram, Facebook, Link2, MessageSquareQuote, 
  Flame, Moon, Sun, Clock, FileSearch, X, Pause, Play, RefreshCw, Coffee, Calculator, 
  Briefcase as UpworkIcon, ListOrdered, Lightbulb, ShoppingCart, Tag, FolderHeart, 
  UserCog, Keyboard, Terminal, Sparkle, FileDown, VideoOff, Scissors, Newspaper, Ghost, 
  UserCheck, Swords, CalendarDays, ListTodo, ImageIcon, Box, HelpCircle as QuestionIcon,
  UserPlus2, FileSignature as FileSignatureIcon,
  Trophy as CampaignIcon,
  Navigation2,
  Heart,
  Cpu,
  Share,
  Layers,
  PhoneCall,
  LayoutDashboard,
  ShieldX,
  CreditCard,
  History,
  Lock,
  MousePointer,
  Fingerprint,
  Database,
  Network,
  Slack,
  Workflow,
  Mail,
  TableProperties,
  ArrowUpRight,
  Bell,
  MessageSquareDiff,
  Shield,
  Filter,
  Terminal as ConsoleIcon,
  Globe2,
  MailPlus,
  Scale,
  FlameKindling,
  Calendar,
  ZapIcon,
  HeartOff
} from 'lucide-react';
import ThumbnailStudio from './ThumbnailStudio';

interface FounderRoadmapProps {
  whopUrl: string;
  onOpenSocial?: (mode: 'create' | 'reel' | 'status') => void;
}

const ValentineSprint: React.FC = () => {
    const scripts = [
        {
            title: "The 'Date Night' Hook",
            script: "Caption: 'Valentine’s Day is coming. Don’t spend it in the office doing admin. I just generated a 3-course Romantic Menu for 20 clients in 60 seconds. In Rands. Link in bio to save your love life. ❤️'",
            advice: "Post a high-quality photo of a dessert from the app on Instagram Reels."
        },
        {
            title: "The 'Pricing' Truth",
            script: "Post: 'Chefs: Are you charging enough for Valentine's? Most caterers lose money because they don't cost the micro-ingredients. My AI Scanner just identified a 15% margin leak in a standard menu. 🤯'",
            advice: "Record a TikTok using the new 'Menu Vision' scanner in the Productivity Lab."
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="p-10 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Heart size={200} /></div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Valentine's Growth Sprint</h3>
                    <p className="text-rose-100 text-sm font-medium max-w-lg mb-8">February is the highest search-volume month for 'Private Chefs'. Use these hooks to capture the 2026 romantic rush.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {scripts.map((s, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                                <h4 className="text-lg font-black mb-2">{s.title}</h4>
                                <p className="text-xs text-rose-50 mt-2 italic">"{s.script}"</p>
                                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-200">Tip: {s.advice}</span>
                                    <button onClick={() => { navigator.clipboard.writeText(s.script); alert("Valentine Script Copied!"); }} className="p-2 bg-white text-rose-600 rounded-lg"><Copy size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CRMArchitect: React.FC = () => {
    return (
        <div className="space-y-10 animate-slide-in">
            <div className="p-10 bg-[#4A154B] text-white rounded-[3.5rem] border-4 border-white/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10"><Slack size={180} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
                            <Workflow size={32} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">Lead Intelligence Hub</h3>
                            <p className="text-xs font-bold text-purple-200 uppercase tracking-widest mt-1">Make x HubSpot Mastery</p>
                        </div>
                    </div>

                    <div className="bg-white text-slate-900 p-8 rounded-[2.5rem] shadow-xl mb-10">
                         <div className="flex items-center gap-3 mb-6">
                            <Target size={24} className="text-purple-600" />
                            <h4 className="text-xl font-black uppercase tracking-tight">Understanding your Segments</h4>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
                                <h5 className="font-black text-xs text-red-500 uppercase mb-2">Not Engaged (27)</h5>
                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">These are people who saw your app 2 weeks ago but vanished. **Action:** Send them a Valentine's Early Bird discount code via HubSpot Email.</p>
                            </div>
                            <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-100">
                                <h5 className="font-black text-xs text-emerald-600 uppercase mb-2">Engaged (8)</h5>
                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">Hot leads! They are actively clicking. **Action:** Send them a personalized Loom video showing how the Pro plan works.</p>
                            </div>
                            <div className="p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-100">
                                <h5 className="font-black text-xs text-indigo-600 uppercase mb-2">Unsubscribed (0)</h5>
                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">Your content is relevant! Keep the frequency to 3 posts a week so you don't burn the list.</p>
                            </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h5 className="text-sm font-black uppercase text-purple-200 tracking-widest mb-4">Make.com Sync Logic:</h5>
                            <div className="bg-black/20 p-8 rounded-[2.5rem] border-2 border-dashed border-white/20">
                                <ol className="space-y-6 text-sm">
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0">1</div>
                                        <p className="text-purple-100 font-medium"><strong>App Webhook:</strong> Every email entered in the app is pushed to Make.com.</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-black text-xs shrink-0">2</div>
                                        <p className="text-purple-100 font-medium"><strong>HubSpot Module:</strong> Add a 'HubSpot: Create/Update Contact' module in Make.</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-black text-xs shrink-0">3</div>
                                        <p className="text-purple-100 font-medium"><strong>Automation:</strong> Your HubSpot Segments will auto-update every time someone uses the app.</p>
                                    </li>
                                </ol>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center space-y-8 bg-white/5 p-8 rounded-[3rem] border border-white/10">
                             <div className="text-center">
                                <h4 className="text-xl font-black uppercase tracking-tight mb-2">Domain Launch Reminder</h4>
                                <p className="text-xs text-purple-200 font-medium">Once you have the .COM domain, we will connect HubSpot to track every visit on your site.</p>
                             </div>
                             <button onClick={() => window.open('https://app-eu1.hubspot.com/', '_blank')} className="w-full py-5 bg-white text-[#4A154B] rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purple-50 transition-all">
                                Open HubSpot Dashboard <ExternalLink size={14} />
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OutreachLab: React.FC = () => {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} Copied!`);
    };

    const scrubberPrompt = `Format this data into a clean CSV-ready table with these EXACT headers:
Full Name, Company Name, Context, Website URL, Email, Phone Number, Status

Rules:
1. 'Context' should include the Facebook group name or post context.
2. Emails must be lowercase.
3. Set 'Status' to 'Pending' for all rows.
4. Clean the Company Name (remove "Inc", "Ltd", etc).
5. Output as a clean Markdown table.`;

    return (
        <div className="space-y-10 animate-slide-in">
            <div className="p-10 bg-indigo-600 text-white rounded-[3.5rem] border-4 border-indigo-400 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10"><TableProperties size={200} /></div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Master Scraper Sheet</h3>
                    <p className="text-sm font-bold text-indigo-100 uppercase tracking-widest mb-8">Direct Mapping for Hubspot Automation</p>
                    
                    <div className="bg-white/10 rounded-[2.5rem] border border-white/20 overflow-hidden">
                        <table className="w-full text-left text-xs font-bold">
                            <thead className="bg-white/10 uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th className="px-6 py-4">Col</th>
                                    <th className="px-6 py-4">Header</th>
                                    <th className="px-6 py-4">Make.com Target</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {[
                                    { c: "A", h: "Full Name", a: "Contact: First + Last" },
                                    { c: "B", h: "Company Name", a: "Account: Name" },
                                    { c: "C", h: "Context", a: "Activity: FB Group Note" },
                                    { c: "D", h: "Website URL", a: "Account: Domain" },
                                    { c: "E", h: "Email", a: "Trigger: Value Bait Email" },
                                    { c: "F", h: "Phone Number", a: "Trigger: SMS/WA Alert" },
                                    { c: "G", h: "Status", a: "Filter: Only if 'Ready'" }
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 opacity-60">{row.c}</td>
                                        <td className="px-6 py-4 text-amber-300">{row.h}</td>
                                        <td className="px-6 py-4 text-indigo-100 italic">{row.a}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-8">
                        <button onClick={() => handleCopy("Full Name, Company Name, Context, Website URL, Email, Phone Number, Status", "Headers")} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                            Copy 2026 Headers
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-10 bg-slate-900 text-white rounded-[3.5rem] border-4 border-emerald-500/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10"><ConsoleIcon size={160} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-emerald-500 rounded-3xl text-white shadow-lg"><Filter size={32} /></div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">The 2026 Scrubber</h3>
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-1">Paste into ChatGPT with your raw data</p>
                        </div>
                    </div>
                    
                    <div className="bg-black/40 p-8 rounded-[2.5rem] border-2 border-dashed border-white/20">
                        <p className="text-sm font-medium text-slate-300 italic leading-relaxed whitespace-pre-wrap">
                            "{scrubberPrompt}"
                        </p>
                        <button 
                            onClick={() => handleCopy(scrubberPrompt, 'ChatGPT Prompt')}
                            className="mt-8 w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all"
                        >
                            <Copy size={16} /> Copy GPT Prompt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SecurityHub: React.FC = () => {
    return (
        <div className="space-y-10 animate-slide-in">
            <div className="p-10 bg-slate-950 text-white rounded-[3.5rem] border-4 border-red-500 shadow-[0_0_50px_-12px_rgba(239,68,68,0.5)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12"><ShieldX size={200} /></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-5">
                            <div className="p-5 bg-red-600 rounded-[2rem] shadow-xl animate-pulse">
                                <ShieldAlert size={36} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-white">Scam Shield 2026</h3>
                                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-1">Founder Active Defense Protocol</p>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                <Shield size={14} /> LIVE THREAT detected
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h5 className="text-sm font-black uppercase text-red-500 tracking-[0.2em] flex items-center gap-2">
                                <AlertTriangle size={18} /> Critical Scam Red Flags
                            </h5>
                            <div className="space-y-4">
                                {[
                                    { t: "The 'Fake Review' Link", d: "Email says 'I ordered, review it here: [External Link]'. This is a trap to steal your login or install malware.", icon: Globe2 },
                                    { t: "Fake Verification Links", d: "URLs asking to 'verify your status' to see an order. Platforms never do this.", icon: Fingerprint },
                                    { t: "The WhatsApp Pivot", d: "Scammers ask to 'talk on WhatsApp' before an order is active. You lose all seller protection.", icon: Smartphone }
                                ].map((threat, i) => (
                                    <div key={i} className="p-5 bg-white/5 rounded-3xl border border-white/10 flex gap-4 items-start group hover:bg-white/10 transition-all">
                                        <div className="p-3 bg-red-500/20 rounded-xl text-red-500"><threat.icon size={20} /></div>
                                        <div>
                                            <p className="text-sm font-black text-white">{threat.t}</p>
                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">{threat.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white text-slate-950 p-10 rounded-[3rem] shadow-2xl relative">
                            <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-4 rounded-3xl shadow-xl">
                                <ShieldCheck size={28} />
                            </div>
                            <h6 className="text-xl font-black uppercase tracking-tight mb-6 text-slate-900">Zero-Trust Action Plan</h6>
                            <ol className="space-y-6">
                                {[
                                    { s: "1. Never Click Portfolio Links", d: "If someone sends a link to external sites, block them immediately." },
                                    { s: "2. Official Dashboard Only", d: "If it's not in the official 'Active Orders' tab, it doesn't exist." },
                                    { s: "3. Report the User", d: "Report the user for 'phishing' to get their account banned." }
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-slate-900">{i+1}</div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 leading-none mb-1">{step.s}</p>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WhopWarRoom: React.FC = () => {
    return (
        <div className="space-y-10 animate-slide-in">
            <div className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Scale size={180} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-emerald-500 rounded-3xl text-white shadow-lg"><Globe size={32} /></div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Domain Launch Strategy</h3>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Goal: caterproai.com (.COM Wins)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-[2.5rem] bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-800">
                             <h4 className="text-xl font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                <CheckCircle2 size={20} /> caterproai.com
                             </h4>
                             <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1 mb-4">The Professional Choice</p>
                             <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                <li className="flex gap-2">✅ <strong>$12/year</strong> via Namecheap</li>
                                <li className="flex gap-2">✅ Matches High-Ticket Proposals</li>
                                <li className="flex gap-2">✅ Standard for Global Outreach</li>
                             </ul>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 opacity-60">
                             <h4 className="text-xl font-black text-slate-500 flex items-center gap-2">
                                <X size={20} /> Rejected: caterpro.ai
                             </h4>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 mb-4">High Yearly Cost</p>
                             <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                <li className="flex gap-2">❌ <strong>$80+/year</strong> (Too expensive)</li>
                                <li className="flex gap-2">❌ Purely for Tech VCs</li>
                                <li className="flex gap-2">❌ Overkill for Client Trust</li>
                             </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border-4 border-indigo-500/30">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><FlameKindling size={160} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-primary-600 rounded-3xl shadow-lg">
                            <Rocket size={32} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">Firebase Launch Kit</h3>
                            <p className="text-xs font-black text-primary-400 uppercase tracking-widest mt-1">Connect your .COM & Zoho Email</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-3 mb-3 text-indigo-400">
                                <Globe2 size={20} />
                                <h5 className="text-[10px] font-black uppercase tracking-widest">1. Domain Connection</h5>
                            </div>
                            <p className="text-xs font-medium text-slate-300 leading-relaxed mb-4">Buy <strong>caterproai.com</strong> on Namecheap. In Firebase Console, go to <strong>Build &gt; Hosting</strong>. Click "Add Custom Domain" and copy the A Records to Namecheap.</p>
                            <button onClick={() => window.open('https://console.firebase.google.com/', '_blank')} className="px-4 py-2 bg-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">Firebase Console <ExternalLink size={10} /></button>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-3 mb-3 text-emerald-400">
                                <MailPlus size={20} />
                                <h5 className="text-[10px] font-black uppercase tracking-widest">2. Email Setup</h5>
                            </div>
                            <p className="text-xs font-medium text-slate-300 leading-relaxed mb-4">Sign up for <strong>Zoho Mail Lite</strong> ($1/mo). Follow their guide to add the MX and SPF records to your Namecheap DNS settings.</p>
                            <button onClick={() => window.open('https://www.zoho.com/mail/zohomail-pricing.html', '_blank')} className="px-4 py-2 bg-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">View Zoho <ExternalLink size={10} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl, onOpenSocial }) => {
  const [activeTab, setActiveTab] = useState<'valentine' | 'crm_architect' | 'outreach' | 'security' | 'whop_war_room' | 'assets'>('valentine');

  return (
    <section id="founder-roadmap" className="mt-20 space-y-12 animate-slide-in scroll-mt-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
            <ShieldCheck className="text-primary-500 w-10 h-10" />
            Founder Command
          </h2>
          <p className="text-lg text-slate-500 font-medium mt-2">Recovery sprint and business engineering hub.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar max-w-full">
            {[
                { id: 'valentine', label: 'Valentine Sprint', icon: Heart },
                { id: 'crm_architect', label: 'HubSpot Hub', icon: Target },
                { id: 'outreach', label: 'Outreach Lab', icon: Mail },
                { id: 'whop_war_room', label: 'Domain Kit', icon: Globe },
                { id: 'security', label: 'Defense', icon: ShieldAlert },
                { id: 'assets', label: 'Studio', icon: Layout }
            ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {activeTab === 'valentine' && <ValentineSprint />}
        {activeTab === 'crm_architect' && <CRMArchitect />}
        {activeTab === 'outreach' && <OutreachLab />}
        {activeTab === 'whop_war_room' && <WhopWarRoom />}
        {activeTab === 'security' && <SecurityHub />}
        {activeTab === 'assets' && <ThumbnailStudio />}
      </div>
    </section>
  );
};

export default FounderRoadmap;
