import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Users, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Utensils, 
  AlertCircle,
  X,
  UserCheck,
  Building2,
  FileText
} from 'lucide-react';
import { CheckedInGuest, Menu } from '../types';

interface GuestCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Menu;
  onGuestCheckedIn: (guest: CheckedInGuest) => void;
}

export const GuestCheckInModal: React.FC<GuestCheckInModalProps> = ({
  isOpen,
  onClose,
  proposal,
  onGuestCheckedIn
}) => {
  const [guestName, setGuestName] = useState('');
  const [partySize, setPartySize] = useState<number>(1);
  const [tableOrSeat, setTableOrSeat] = useState('');
  const [dietary, setDietary] = useState('Standard');
  const [customDietary, setCustomDietary] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastCheckedIn, setLastCheckedIn] = useState<CheckedInGuest | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const finalDietary = dietary === 'Other' ? (customDietary.trim() || 'Custom Dietary') : dietary;

    const newGuest: CheckedInGuest = {
      id: `chk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: guestName.trim(),
      partySize: Math.max(1, partySize),
      dietary: finalDietary,
      tableOrSeat: tableOrSeat.trim() || 'General Seating',
      notes: notes.trim(),
      checkedInAt: new Date().toISOString(),
      checkInMethod: 'qr_scan'
    };

    onGuestCheckedIn(newGuest);
    setLastCheckedIn(newGuest);
    setIsSuccess(true);
  };

  const handleResetForNext = () => {
    setGuestName('');
    setPartySize(1);
    setTableOrSeat('');
    setDietary('Standard');
    setCustomDietary('');
    setNotes('');
    setIsSuccess(false);
    setLastCheckedIn(null);
  };

  const dietaryOptions = [
    'Standard',
    'Vegetarian',
    'Vegan',
    'Strictly Halal',
    'Kosher Certified',
    'Gluten-Free',
    'Nut Allergy',
    'Other'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left my-8">
        
        {/* Top ambient luxury bar */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-lime-300 bg-lime-950/40 px-2 py-0.5 rounded-full border border-lime-400/30">
              Live Guest Check-In Portal
            </span>
            <span className="text-[10px] font-mono text-teal-200">
              {proposal.beoNumber || 'BEO-2026-HOTEL'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            {proposal.title || proposal.menuTitle || 'Banquet Event Check-In'}
          </h2>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              {proposal.roomLocation || 'Grand Ballroom'}
            </span>
            {proposal.eventDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                {proposal.eventDate}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {isSuccess && lastCheckedIn ? (
            <div className="text-center py-6 space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Check-In Verified • Actual Pax Updated
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Welcome, {lastCheckedIn.name}!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your party of <strong className="text-slate-800">{lastCheckedIn.partySize} {lastCheckedIn.partySize === 1 ? 'guest' : 'guests'}</strong> has been registered. The executive chef and banquet team have been notified.
                </p>
              </div>

              {/* Summary card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500 font-medium">Assigned Seating:</span>
                  <span className="font-bold text-slate-900">{lastCheckedIn.tableOrSeat}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500 font-medium">Dietary Specification:</span>
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {lastCheckedIn.dietary}
                  </span>
                </div>
                {lastCheckedIn.notes && (
                  <div className="flex justify-between pt-0.5">
                    <span className="text-slate-500 font-medium">Notes:</span>
                    <span className="font-bold text-slate-700">{lastCheckedIn.notes}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleResetForNext}
                  className="flex-1 py-3 bg-gradient-to-r from-lime-500 to-teal-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Check In Next Guest
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close Portal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Full Name / Principal Guest *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Sipho Sithole or Dr. Sarah Connor"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Party Size */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Party Size (Total Covers)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value) || 1)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-center text-slate-900 focus:border-teal-500 focus:bg-white outline-none"
                    />
                    <div className="flex gap-1 shrink-0">
                      {[1, 2, 4].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPartySize(num)}
                          className={`px-2.5 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            partySize === num
                              ? 'bg-teal-600 text-white border-teal-700'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          }`}
                        >
                          +{num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table / Seating Area */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Table / Seating Zone
                  </label>
                  <input
                    type="text"
                    value={tableOrSeat}
                    onChange={(e) => setTableOrSeat(e.target.value)}
                    placeholder="e.g. Table 4 (VIP) or Deck A"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Dietary Accommodation */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>Dietary Requirements</span>
                  <span className="text-[9px] text-teal-600 font-bold">Passed to Kitchen Staff</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {dietaryOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDietary(opt)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        dietary === opt
                          ? 'bg-teal-600 text-white border-teal-700 shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {dietary === 'Other' && (
                  <input
                    type="text"
                    value={customDietary}
                    onChange={(e) => setCustomDietary(e.target.value)}
                    placeholder="Please specify specific allergies or religious dietary requests..."
                    className="w-full mt-2 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 outline-none focus:border-teal-500"
                  />
                )}
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Special Notes / Accommodations
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. High chair needed, celebrating anniversary, VIP delegation..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:border-teal-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!guestName.trim()}
                  className="w-full py-3 bg-gradient-to-r from-lime-500 via-teal-600 to-cyan-600 hover:from-lime-400 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Confirm Guest Check-In ({partySize} {partySize === 1 ? 'Cover' : 'Covers'})</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                  Automatically updates actual banquet covers in the executive proposal and BEO.
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
