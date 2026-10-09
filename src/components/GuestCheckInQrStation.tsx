import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Calendar, 
  Clock, 
  Trash2, 
  RotateCcw, 
  FileSpreadsheet, 
  Sliders, 
  Smartphone,
  Info
} from 'lucide-react';
import { CheckedInGuest, Menu } from '../types';
import { GuestCheckInModal } from './GuestCheckInModal';

interface GuestCheckInQrStationProps {
  proposal: Menu;
  onUpdateGuestCount: (count: number) => void;
  onUpdateActualGuestCount?: (actualCount: number, guestList?: CheckedInGuest[]) => void;
  onNotify?: (message: string) => void;
}

export const GuestCheckInQrStation: React.FC<GuestCheckInQrStationProps> = ({
  proposal,
  onUpdateGuestCount,
  onUpdateActualGuestCount,
  onNotify
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoSync, setAutoSync] = useState<boolean>(proposal.autoSyncActualPax ?? false);
  const [recentGuests, setRecentGuests] = useState<CheckedInGuest[]>(proposal.checkedInGuests || []);

  const plannedCovers = proposal.guestCount || 120;
  
  // Calculate total checked-in actual headcount
  const actualHeadcount = recentGuests.reduce((sum, g) => sum + (g.partySize || 1), 0);
  const attendancePct = plannedCovers > 0 ? Math.min(100, Math.round((actualHeadcount / plannedCovers) * 100)) : 0;
  const remainingExpected = Math.max(0, plannedCovers - actualHeadcount);

  // Sync internal state if proposal.checkedInGuests changes from outside
  useEffect(() => {
    if (proposal.checkedInGuests && proposal.checkedInGuests.length !== recentGuests.length) {
      setRecentGuests(proposal.checkedInGuests);
    }
  }, [proposal.checkedInGuests]);

  // Construct check-in URL
  const getCheckInUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://caterproai.app';
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    const beo = encodeURIComponent(proposal.beoNumber || 'BEO-2026-HOTEL-784');
    const title = encodeURIComponent(proposal.title || proposal.menuTitle || 'Hotel Banquet');
    return `${origin}${path}?checkin=true&beo=${beo}&event=${title}`;
  };

  // Generate QR code when proposal parameters change
  useEffect(() => {
    const url = getCheckInUrl();
    QRCode.toDataURL(url, {
      width: 480,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(urlData => setQrDataUrl(urlData))
      .catch(err => {
        console.error('Failed to generate QR Code:', err);
      });
  }, [proposal.beoNumber, proposal.title, proposal.menuTitle, proposal.roomLocation]);

  const notify = (msg: string) => {
    if (onNotify) {
      onNotify(msg);
    }
  };

  // Handle a new guest checking in
  const handleGuestCheckedIn = (newGuest: CheckedInGuest) => {
    const updatedList = [newGuest, ...recentGuests];
    setRecentGuests(updatedList);
    const newActualCount = updatedList.reduce((sum, g) => sum + (g.partySize || 1), 0);

    // Update parent proposal actualGuestCount
    if (onUpdateActualGuestCount) {
      onUpdateActualGuestCount(newActualCount, updatedList);
    }

    // If auto-sync is turned on, update proposal's planned guestCount to match actual
    if (autoSync) {
      onUpdateGuestCount(newActualCount);
      notify(`Check-In: ${newGuest.name} (+${newGuest.partySize}). Proposal covers scaled to ${newActualCount} pax.`);
    } else {
      notify(`Check-In: ${newGuest.name} (+${newGuest.partySize}). Actual attendance: ${newActualCount}/${plannedCovers} pax.`);
    }
  };

  // Remove a guest check-in
  const handleRemoveGuest = (guestId: string) => {
    const target = recentGuests.find(g => g.id === guestId);
    const updatedList = recentGuests.filter(g => g.id !== guestId);
    setRecentGuests(updatedList);
    const newActualCount = updatedList.reduce((sum, g) => sum + (g.partySize || 1), 0);

    if (onUpdateActualGuestCount) {
      onUpdateActualGuestCount(newActualCount, updatedList);
    }

    if (autoSync) {
      onUpdateGuestCount(newActualCount);
    }

    notify(`Removed check-in entry: ${target?.name || 'Guest'}`);
  };

  // Reset all check-ins
  const handleResetAttendance = () => {
    if (window.confirm('Reset all checked-in guests for this event?')) {
      setRecentGuests([]);
      if (onUpdateActualGuestCount) {
        onUpdateActualGuestCount(0, []);
      }
      notify('Attendance roster reset to 0.');
    }
  };

  // Quick simulate check-in for instant user demonstration
  const handleQuickSimulate = (coversToAdd: number = 2, role: string = 'VIP Guest') => {
    const demoNames = [
      'Dr. Sipho Dlamini',
      'Annelize & Johan Roux',
      'Kagiso Ndlovu (Sasol)',
      'Chef Tariq Al-Mansoor',
      'Elena Rostova & Guest',
      'Thabo & Zola Mokoena'
    ];
    const pickedName = demoNames[Math.floor(Math.random() * demoNames.length)];
    const dietaries = ['Standard', 'Gluten-Free', 'Strictly Halal', 'Vegetarian'];
    const tables = ['Table 2 (VIP)', 'Table 4', 'Table 7', 'Table 9', 'Balcony Deck'];

    const simulated: CheckedInGuest = {
      id: `chk-sim-${Date.now()}`,
      name: `${pickedName} (${role})`,
      partySize: coversToAdd,
      dietary: dietaries[Math.floor(Math.random() * dietaries.length)],
      tableOrSeat: tables[Math.floor(Math.random() * tables.length)],
      notes: 'Quick test check-in via Command Center station',
      checkedInAt: new Date().toISOString(),
      checkInMethod: 'qr_scan'
    };

    handleGuestCheckedIn(simulated);
  };

  // Force sync actual to proposal covers now
  const handleForceSyncToProposal = () => {
    onUpdateGuestCount(actualHeadcount);
    notify(`Proposal covers successfully synced to actual check-in count (${actualHeadcount} pax).`);
  };

  // Copy URL to clipboard
  const handleCopyLink = () => {
    const url = getCheckInUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      notify('Guest check-in portal link copied to clipboard.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Download QR code image file
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${(proposal.beoNumber || 'BEO').toLowerCase()}-checkin-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    notify('QR code image downloaded.');
  };

  // Export roster as CSV
  const handleExportCsv = () => {
    if (recentGuests.length === 0) {
      notify('No checked-in guests to export.');
      return;
    }

    const headers = ['Guest ID', 'Name', 'Party Size', 'Table/Seat', 'Dietary', 'Notes', 'Checked In At', 'Method'];
    const rows = recentGuests.map(g => [
      g.id,
      `"${g.name.replace(/"/g, '""')}"`,
      g.partySize,
      `"${(g.tableOrSeat || '').replace(/"/g, '""')}"`,
      `"${(g.dietary || '').replace(/"/g, '""')}"`,
      `"${(g.notes || '').replace(/"/g, '""')}"`,
      new Date(g.checkedInAt).toLocaleString(),
      g.checkInMethod || 'qr_scan'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${proposal.beoNumber || 'BEO'}-guest-attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Guest attendance roster exported as CSV.');
  };

  // Print Banquet Table Tent / Placard
  const handlePrintTableTent = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      notify('Please allow popups to print table tent placard.');
      return;
    }

    const eventTitle = proposal.title || proposal.menuTitle || 'Hotel Banquet Event';
    const beoNo = proposal.beoNumber || 'BEO-2026-HOTEL-784';
    const location = proposal.roomLocation || 'Grand Ballroom & Banqueting Deck';
    const eventDate = proposal.eventDate || new Date().toLocaleDateString('en-ZA');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Guest Check-In Tent Card — ${eventTitle}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              margin: 0;
              padding: 20px;
              background: #fff;
              text-align: center;
            }
            .tent-card {
              border: 3px double #0d9488;
              border-radius: 24px;
              padding: 40px 30px;
              max-width: 620px;
              margin: 0 auto;
              box-shadow: 0 10px 25px rgba(0,0,0,0.06);
            }
            .header-tag {
              display: inline-block;
              background: #f0fdf4;
              color: #166534;
              border: 1px solid #bbf7d0;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 2px;
              padding: 6px 16px;
              border-radius: 999px;
              margin-bottom: 16px;
            }
            h1 {
              font-size: 26px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: -0.5px;
              margin: 0 0 10px 0;
              color: #0f172a;
            }
            .meta {
              font-size: 13px;
              color: #64748b;
              margin-bottom: 25px;
              font-weight: 600;
            }
            .qr-frame {
              display: inline-block;
              padding: 20px;
              background: #ffffff;
              border: 2px solid #e2e8f0;
              border-radius: 20px;
              margin: 10px auto 25px auto;
              box-shadow: 0 8px 16px rgba(0,0,0,0.04);
            }
            .qr-frame img {
              width: 260px;
              height: 260px;
              display: block;
            }
            .instructions {
              background: #f8fafc;
              border-radius: 16px;
              padding: 18px 24px;
              margin: 0 auto 20px auto;
              border: 1px solid #e2e8f0;
              max-width: 480px;
            }
            .instructions h3 {
              margin: 0 0 6px 0;
              font-size: 15px;
              color: #0f172a;
              font-weight: 800;
            }
            .instructions p {
              margin: 0;
              font-size: 12px;
              color: #475569;
              line-height: 1.5;
            }
            .footer-notes {
              font-size: 10px;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 25px;
            }
            @media print {
              body { padding: 0; }
              .tent-card { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="tent-card">
            <div class="header-tag">Executive Banquet Registration</div>
            <h1>${eventTitle}</h1>
            <div class="meta">
              <span>${location}</span> • <span>${eventDate}</span> • <span>${beoNo}</span>
            </div>

            <div class="qr-frame">
              <img src="${qrDataUrl}" alt="Guest Check-In QR Code" />
            </div>

            <div class="instructions">
              <h3>📱 Scan with Phone Camera to Check In</h3>
              <p>
                Open your smartphone camera or QR reader, point at the code above, and tap the notification link to register your party and confirm dietary accommodations.
              </p>
            </div>

            <div class="footer-notes">
              Powered by CaterProAI Banquet Operations Engine • SANS 10330 Defensible
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="relative z-10 bg-gradient-to-br from-white via-teal-50/20 to-lime-50/20 rounded-3xl border-2 border-teal-300/80 p-4 sm:p-6 shadow-sm text-slate-900 space-y-5">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-teal-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-600 to-lime-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
              <QrCode className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-900 bg-teal-100/80 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Guest Check-In QR Portal & Live Attendance
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
              {proposal.beoNumber || 'BEO-2026-HOTEL-784'}
            </span>
          </div>
          <h3 className="text-base sm:text-xl font-black uppercase tracking-tight text-slate-900">
            Real-Time Guest Check-In & Headcount Telemetry
          </h3>
          <p className="text-xs text-slate-600 font-medium max-w-2xl">
            Guests scan the QR code to check in and register dietary requests. Actual headcount automatically updates the proposal, scaling food spend and banquet logistics.
          </p>
        </div>

        {/* Live Status Tag */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Station Live: {actualHeadcount} Arrived</span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-teal-600 to-lime-600 hover:from-teal-500 hover:to-lime-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Launch Check-In Kiosk</span>
          </button>
        </div>
      </div>

      {/* Main Grid: QR Code Display + Telemetry HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column (5 cols): High-Contrast QR Code Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                Scan With Any Smartphone
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                High-Res Dynamic QR
              </span>
            </div>

            {/* QR Code Container */}
            <div className="relative mx-auto w-52 sm:w-60 aspect-square p-3 bg-white rounded-2xl border-2 border-teal-200 shadow-inner flex items-center justify-center group">
              {qrDataUrl ? (
                <>
                  <img
                    src={qrDataUrl}
                    alt="Banquet Guest Check-In QR"
                    className="w-full h-full object-contain rounded-lg transition-transform group-hover:scale-102"
                  />
                  {/* Luxury CaterPro Center Badge */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-11 h-11 rounded-xl bg-slate-900/90 text-white border-2 border-lime-400 flex items-center justify-center text-xs font-black shadow-lg">
                      CP
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <span className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  Generating QR...
                </div>
              )}
            </div>

            <div className="text-center mt-3">
              <div className="text-xs font-black uppercase text-slate-900 tracking-tight">
                {proposal.title || proposal.menuTitle || 'Hotel Banquet'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                {proposal.roomLocation || 'Grand Ballroom'} • {proposal.beoNumber || 'BEO-784'}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-1.5 pt-4 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={handleDownloadQr}
              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-[10px] font-bold border border-slate-200 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
              title="Download QR code image file"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Download PNG</span>
            </button>

            <button
              type="button"
              onClick={handlePrintTableTent}
              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-[10px] font-bold border border-slate-200 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
              title="Print Banquet Table Tent / Reception Card"
            >
              <Printer className="w-3.5 h-3.5 text-lime-600" />
              <span>Print Placard</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-[10px] font-bold border border-slate-200 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
              title="Copy guest check-in portal link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-black">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column (7 cols): Telemetry Metrics & Headcount Sync Engine */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Headcount Stat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            {/* 1. Planned Covers */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Planned Covers
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-mono">
                {plannedCovers}
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Guaranteed in BEO
              </span>
            </div>

            {/* 2. Actual Checked-in (LIVE) */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-3.5 shadow-md shadow-teal-600/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100 block">
                  Actual Check-In
                </span>
                <span className="w-2 h-2 rounded-full bg-lime-300 animate-ping" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1 font-mono flex items-baseline gap-1.5">
                <span>{actualHeadcount}</span>
                <span className="text-xs font-bold text-emerald-200">Pax</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-100">
                {attendancePct}% Room Arrived
              </span>
            </div>

            {/* 3. Remaining Expected */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Remaining Expected
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-mono">
                {remainingExpected}
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Pending Arrival
              </span>
            </div>

          </div>

          {/* Attendance Progress Bar */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>Banquet Hall Occupancy Progress</span>
              </span>
              <span className="font-mono font-black text-teal-800">
                {actualHeadcount} / {plannedCovers} ({attendancePct}%)
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-lime-500 via-teal-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${attendancePct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>0 Pax (Doors Open)</span>
              <span>Final Headcount Lock-In</span>
            </div>
          </div>

          {/* Headcount Synchronization Controls */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                  Proposal Headcount Synchronization
                </span>
                <p className="text-[10px] text-slate-600">
                  Scale menu revenue, food portion yields, and kitchen orders according to checked-in count.
                </p>
              </div>

              {/* Auto Sync Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none self-start sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAutoSync(checked);
                    if (checked && actualHeadcount > 0) {
                      onUpdateGuestCount(actualHeadcount);
                      notify(`Auto-Sync activated! Proposal covers updated to ${actualHeadcount} pax.`);
                    } else {
                      notify('Auto-Sync disabled.');
                    }
                  }}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  Auto-Sync Proposal
                </span>
              </label>
            </div>

            {/* Manual Sync + Simulation Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/80">
              <button
                type="button"
                onClick={handleForceSyncToProposal}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                <span>Sync Actual ({actualHeadcount} Pax) to Proposal</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSimulate(2, 'VIP Guest')}
                className="px-3 py-1.5 bg-white hover:bg-teal-50 text-teal-800 border border-teal-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Simulate quick scan to test automatic proposal update"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Simulate Scan (+2 Guests)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSimulate(1, 'Single Walk-in')}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <span>+1 Walk-in</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* RECENT CHECK-INS ROSTER FEED */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Live Arrival Roster ({recentGuests.length} Check-In Entries • {actualHeadcount} Total Pax)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            {recentGuests.length > 0 && (
              <button
                type="button"
                onClick={handleResetAttendance}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Log</span>
              </button>
            )}
          </div>
        </div>

        {recentGuests.length === 0 ? (
          <div className="text-center py-6 text-slate-400 space-y-2">
            <p className="text-xs font-medium">No guests checked in yet for this event.</p>
            <p className="text-[10px]">Scan the QR code or use "Launch Check-In Kiosk" above to record guest arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {recentGuests.map((guest) => (
              <div 
                key={guest.id}
                className="bg-slate-50/80 hover:bg-teal-50/40 rounded-xl p-2.5 border border-slate-200/90 transition-all flex items-start justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                    <span>{guest.name}</span>
                    <span className="text-[9px] font-black uppercase bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded shrink-0">
                      +{guest.partySize} {guest.partySize === 1 ? 'Pax' : 'Pax'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2">
                    <span>{guest.tableOrSeat || 'General'}</span>
                    <span>•</span>
                    <span className="text-teal-700 font-bold">{guest.dietary || 'Standard'}</span>
                  </div>
                  {guest.notes && (
                    <div className="text-[9px] text-slate-500 italic truncate max-w-[200px]">
                      "{guest.notes}"
                    </div>
                  )}
                  <div className="text-[8px] text-slate-400 font-mono">
                    {new Date(guest.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveGuest(guest.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Remove check-in entry"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guest Check-In Modal Portal */}
      <GuestCheckInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        proposal={proposal}
        onGuestCheckedIn={handleGuestCheckedIn}
      />

    </div>
  );
};

export default GuestCheckInQrStation;
