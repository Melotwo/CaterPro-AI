import React, { useState, useRef, useEffect } from 'react';
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
  UserCheck, Swords, CalendarDays, ListTodo, Image as ImageIcon, Box, HelpCircle as QuestionIcon,
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
  Shield
} from 'lucide-react';
import ThumbnailStudio from './ThumbnailStudio';
import { generateClipperBriefFromApi } from '../services/geminiService';

interface FounderRoadmapProps {
  whopUrl: string;
  onOpenSocial?: (mode: 'create' | 'reel' | 'status') => void;
}

const OutreachLab: React.FC = () => {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} Copied!`);
    };

    const coldEmail = `Subject: [Company Name] x 2026 Catering Strategy (Sample Attached)

Hi [Name],

I noticed [Company Name] is scaling fast. I am a Hospitality Systems Architect and I’ve put together a sample catering proposal for your next team event using a new AI system I've built.

I've attached the full menu and a ZAR cost breakdown.

I’m looking to partner with 5 forward-thinking brands to help them automate their internal hospitality logistics. Would you be open to a 5-minute chat about how this system could save your office manager 15+ hours a month?

Best regards,
[Your Name]
Founder, CaterPro AI`;

    return (
        <div className="space-y-10 animate-slide-in">
            {/* GOOGLE SHEETS ORGANIZATION - MATCHES USER SCREENSHOT */}
            <div className="p-10 bg-indigo-600 text-white rounded-[3.5rem] border-4 border-indigo-400 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10"><TableProperties size={200} /></div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Master Scraper Sheet</h3>
                    <p className="text-sm font-bold text-indigo-100 uppercase tracking-widest mb-8">Official Layout for Google Sheets x Make.com</p>
                    
                    <div className="bg-white/10 rounded-[2.5rem] border border-white/20 overflow-hidden">
                        <table className="w-full text-left text-xs font-bold">
                            <thead className="bg-white/10 uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th className="px-6 py-4">Column</th>
                                    <th className="px-6 py-4">Header Name</th>
                                    <th className="px-6 py-4">Make.com Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {[
                                    { c: "A", h: "Full Name", a: "HubSpot: Contact Name" },
                                    { c: "B", h: "Company Name", a: "HubSpot: Create Company" },
                                    { c: "C", h: "Website URL", a: "Scraper: Extract Logo/Industry" },
                                    { c: "D", h: "Email", a: "Outreach: Send Value Bait" },
                                    { c: "E", h: "Phone Number", a: "WhatsApp: Immediate Follow-up" },
                                    { c: "F", h: "Status", a: "Set to 'Ready' to trigger Make.com" }
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 opacity-60">Col {row.c}</td>
                                        <td className="px-6 py-4 text-amber-300">{row.h}</td>
                                        <td className="px-6 py-4 text-indigo-100 italic">{row.a}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-8">
                        <button onClick={() => handleCopy("Full Name, Company Name, Website URL, Email, Phone Number, Status", "Headers")} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                            Copy Header Row for Google Sheets
                        </button>
                    </div>
                </div>
            </div>

            {/* EMAIL TEMPLATE CARD */}
            <div className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-lg"><Mail size={32} /></div>
                    <div>
                        <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">The "Value Bait" Email</h3>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">Pitch to Lauren Smith & Cate Wineburg</p>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed whitespace-pre-wrap">
                        {coldEmail}
                    </p>
                    <button 
                        onClick={() => handleCopy(coldEmail, 'Cold Email')}
                        className="mt-8 w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                    >
                        <Copy size={16} /> Copy Outreach Script
                    </button>
                </div>
            </div>
        </div>
    );
};

const SecurityHub: React.FC = () => {
    return (
        <div className="space-y-10 animate-slide-in">
            {/* SCAM SHIELD - CRITICAL ALERT */}
            <div className="p-10 bg-slate-950 text-white rounded-[3.5rem] border-4 border-red-500 shadow-[0_0_50px_-12px_rgba(239,68,68,0.5)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12"><ShieldX size={200} /></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-5">
                            <div className="p-5 bg-red-600 rounded-[2rem] shadow-xl animate-pulse">
                                <ShieldAlert size={36} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-white">Founder Security Kit</h3>
                                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-1">Scam Defense Protocol 2026</p>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                <Shield size={14} /> Active Protection: Enabled
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h5 className="text-sm font-black uppercase text-red-500 tracking-[0.2em] flex items-center gap-2">
                                <AlertTriangle size={18} /> Scammer Red Flags
                            </h5>
                            <div className="space-y-4">
                                {[
                                    { t: "Fake 'Human Verification'", d: "Links asking you to 'verify identity' to see an order. It's a password trap.", icon: Fingerprint },
                                    { t: "The 'Sofia' Pattern", d: "Aggressive messages like 'Did you see my order?' without an actual platform notification.", icon: Ghost },
                                    { t: "PDF/ZIP Requirements", d: "Never open .zip or .exe files from 'customers' - they contain malware.", icon: FileDown }
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
                            <h6 className="text-xl font-black uppercase tracking-tight mb-6 text-slate-900">Zero-Trust Workflow</h6>
                            <ol className="space-y-6">
                                {[
                                    { s: "Official Orders Only", d: "If an order doesn't show in your actual 'Active Orders' dashboard, it does not exist." },
                                    { s: "No Off-Platform Links", d: "Never click bit.ly or unknown domain links sent by 'customers'." },
                                    { s: "Block Instantly", d: "Scammers rely on your politeness. If it feels weird, block and report immediately." }
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
                            <div className="mt-10 pt-8 border-t border-slate-100">
                                <button onClick={() => window.open('https://www.fiverr.com/support/articles/360010978617-Safety-and-Security-Tips-for-Sellers', '_blank')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                                    <Info size={14} /> Official Safety Guide
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CRMArchitect: React.FC = () => {
    const slackMessageTemplate = `🚨 NEW CATERING LEAD DETECTED 🚨

🏢 Company: {{1.CompanyName}}
👤 Contact: {{1.FullName}}
📧 Email: {{1.Email}}
📱 WhatsApp: {{1.Phone}}

Action: Send "Value Bait" Proposal now.`;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Slack Template Copied!");
    };

    return (
        <div className="space-y-10 animate-slide-in">
            {/* MAKE.COM SLACK MODULE GUIDE */}
            <div className="p-10 bg-[#4A154B] text-white rounded-[3.5rem] border-4 border-white/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10"><MessageSquareDiff size={180} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
                            <Slack size={32} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">Make x Slack Integration</h3>
                            <p className="text-xs font-bold text-purple-200 uppercase tracking-widest mt-1">Configure your #caterpro-ai-lead-alerts</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h5 className="text-[10px] font-black uppercase text-purple-200 tracking-widest">Message Template (Copy/Paste):</h5>
                            <div className="bg-black/20 p-6 rounded-[2rem] border-2 border-dashed border-white/20">
                                <p className="text-xs font-bold font-mono whitespace-pre-wrap text-purple-100">
                                    {slackMessageTemplate}
                                </p>
                                <button 
                                    onClick={() => handleCopy(slackMessageTemplate)}
                                    className="mt-6 w-full py-4 bg-white text-[#4A154B] rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl"
                                >
                                    Copy Template
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-xs shrink-0">1</div>
                                <div>
                                    <p className="text-sm font-black text-white">Select "Post a Message"</p>
                                    <p className="text-xs text-purple-200 mt-1">In Make.com, add the Slack module and choose 'Create a Message'.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-xs shrink-0">2</div>
                                <div>
                                    <p className="text-sm font-black text-white">Link Channel ID</p>
                                    <p className="text-xs text-purple-200 mt-1">Select '#caterpro-ai-lead-alerts' from the dropdown list.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-xs shrink-0">3</div>
                                <div>
                                    <p className="text-sm font-black text-white">Automate the Ping</p>
                                    <p className="text-xs text-purple-200 mt-1">Now every time you mark a lead as 'Ready' in your sheet, your iPad will go "Knock-Brush"!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WhopWarRoom: React.FC = () => {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} Copied!`);
    };

    return (
        <div className="space-y-10 animate-slide-in">
            {/* POSTING DESTINATION MAP */}
            <div className="p-8 bg-slate-900 rounded-[3rem] text-white border-4 border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Navigation2 size={140} /></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-white">The "Where to Post" Map</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Match your App Outputs to these Platforms</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { output: 'Captions/Flex Posts', platform: 'Facebook Groups', icon: Facebook, color: 'text-blue-500' },
                            { output: 'Reel Scripts', platform: 'TikTok / Instagram', icon: Video, color: 'text-pink-500' },
                            { output: 'Gig Thumbnails', platform: 'Fiverr / Upwork', icon: ImageIcon, color: 'text-emerald-500' },
                            { output: 'Campaign Pitches', platform: 'Whop Discovery', icon: CampaignIcon, color: 'text-purple-500' }
                        ].map((item, i) => (
                            <div key={i} className="p-5 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col items-center text-center gap-3">
                                <item.icon className={item.color} size={28} />
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase">{item.output}</p>
                                    <p className="text-xs font-bold text-white">{item.platform}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FounderRoadmap: React.FC<FounderRoadmapProps> = ({ whopUrl, onOpenSocial }) => {
  const [activeTab, setActiveTab] = useState<'whop_war_room' | 'outreach' | 'crm_architect' | 'security' | 'assets'>('whop_war_room');

  return (
    <section id="founder-roadmap" className="mt-20 space-y-12 animate-slide-in scroll-mt-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
            <ShieldCheck className="text-primary-500 w-10 h-10" />
            War Room Console
          </h2>
          <p className="text-lg text-slate-500 font-medium mt-2">Aggressive setup for Whop, HubSpot, and Outreach.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar max-w-full">
            {[
                { id: 'whop_war_room', label: 'War Room', icon: Swords },
                { id: 'outreach', label: 'Outreach Lab', icon: Mail },
                { id: 'crm_architect', label: 'CRM Hub', icon: Database },
                { id: 'security', label: 'Security', icon: ShieldAlert },
                { id: 'assets', label: 'Asset Studio', icon: Layout }
            ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {activeTab === 'whop_war_room' && <WhopWarRoom />}

        {activeTab === 'outreach' && <OutreachLab />}

        {activeTab === 'crm_architect' && <CRMArchitect />}

        {activeTab === 'security' && <SecurityHub />}

        {activeTab === 'assets' && <ThumbnailStudio />}
      </div>
    </section>
  );
};

export default FounderRoadmap;
