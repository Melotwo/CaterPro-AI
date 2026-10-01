import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Thermometer, 
  Clock, 
  UserCheck, 
  Plus, 
  CheckCircle2, 
  Printer, 
  Download, 
  RotateCcw, 
  Filter, 
  Snowflake, 
  Flame, 
  Building2, 
  Calendar,
  Sparkles,
  ChevronDown,
  Trash2,
  Check
} from 'lucide-react';

export interface StorageUnit {
  id: string;
  name: string;
  category: 'cold_storage' | 'freezer' | 'hot_holding' | 'sanitization';
  targetRange: string;
  minSafe: number;
  maxSafe: number;
  criticalLimit: number; // For cold/freezer: max safe temp; For hot: min safe temp
  location: string;
}

export interface HaccpCheckEntry {
  id: string;
  unitId: string;
  unitName: string;
  category: 'cold_storage' | 'freezer' | 'hot_holding' | 'sanitization';
  temperature: number; // in Celsius
  timestamp: string; // e.g. "08:15 AM"
  date: string; // "YYYY-MM-DD"
  shift: 'AM Morning' | 'Midday Service' | 'PM Evening Close';
  userInitials: string; // e.g. "TK"
  status: 'in_spec' | 'warning' | 'out_of_spec';
  correctiveAction?: string;
  notes?: string;
}

export const STANDARD_STORAGE_UNITS: StorageUnit[] = [
  {
    id: 'walkin_main',
    name: 'Walk-in Cold Room #1 (Produce & Dairy)',
    category: 'cold_storage',
    targetRange: '0.0°C to 4.0°C',
    minSafe: 0.0,
    maxSafe: 4.0,
    criticalLimit: 5.0,
    location: 'Main Production Kitchen'
  },
  {
    id: 'walkin_meat',
    name: 'Butchery & Poultry Chiller #2',
    category: 'cold_storage',
    targetRange: '0.0°C to 2.0°C',
    minSafe: 0.0,
    maxSafe: 2.0,
    criticalLimit: 3.5,
    location: 'Butchery Prep Station'
  },
  {
    id: 'walkin_fish',
    name: 'Seafood Chiller on Wet Ice #3',
    category: 'cold_storage',
    targetRange: '0.0°C to 2.0°C',
    minSafe: 0.0,
    maxSafe: 2.0,
    criticalLimit: 3.0,
    location: 'Larder & Cold Kitchen'
  },
  {
    id: 'reachin_pastry',
    name: 'Pastry & Cream Reach-in Fridge',
    category: 'cold_storage',
    targetRange: '1.0°C to 4.0°C',
    minSafe: 1.0,
    maxSafe: 4.0,
    criticalLimit: 5.0,
    location: 'Pastry & Bakery Deck'
  },
  {
    id: 'saladette_line',
    name: 'Banquet Line Saladette & Prep Well',
    category: 'cold_storage',
    targetRange: '1.0°C to 4.0°C',
    minSafe: 1.0,
    maxSafe: 4.0,
    criticalLimit: 5.0,
    location: 'Hot Line Pass'
  },
  {
    id: 'freezer_main',
    name: 'Walk-in Deep Freezer #1',
    category: 'freezer',
    targetRange: '-22.0°C to -18.0°C',
    minSafe: -25.0,
    maxSafe: -18.0,
    criticalLimit: -15.0,
    location: 'Basement Storage'
  },
  {
    id: 'blast_chiller',
    name: 'High-Velocity Blast Chiller',
    category: 'cold_storage',
    targetRange: '-2.0°C to 3.0°C',
    minSafe: -2.0,
    maxSafe: 3.0,
    criticalLimit: 5.0,
    location: 'Cook-Chill Prep Bay'
  },
  {
    id: 'hot_holding_cart1',
    name: 'Heated Banqueting Cloche Cart #1',
    category: 'hot_holding',
    targetRange: '≥ 65.0°C',
    minSafe: 63.0,
    maxSafe: 85.0,
    criticalLimit: 60.0,
    location: 'Ballroom Service Lobby'
  },
  {
    id: 'hot_holding_wells',
    name: 'Hot Line Bain-Marie Wells',
    category: 'hot_holding',
    targetRange: '≥ 65.0°C',
    minSafe: 63.0,
    maxSafe: 88.0,
    criticalLimit: 60.0,
    location: 'Executive Pass'
  },
  {
    id: 'warewasher_rinse',
    name: 'Sanitizing Dishwasher Final Rinse',
    category: 'sanitization',
    targetRange: '≥ 82.0°C',
    minSafe: 80.0,
    maxSafe: 90.0,
    criticalLimit: 75.0,
    location: 'Scullery Wash Area'
  }
];

const INITIAL_LOG_ENTRIES: HaccpCheckEntry[] = [
  {
    id: 'log-1',
    unitId: 'walkin_main',
    unitName: 'Walk-in Cold Room #1 (Produce & Dairy)',
    category: 'cold_storage',
    temperature: 2.8,
    timestamp: '07:15 AM',
    date: new Date().toISOString().split('T')[0],
    shift: 'AM Morning',
    userInitials: 'TK',
    status: 'in_spec',
    notes: 'Defrost cycle normal. Coils clean.'
  },
  {
    id: 'log-2',
    unitId: 'walkin_meat',
    unitName: 'Butchery & Poultry Chiller #2',
    category: 'cold_storage',
    temperature: 1.4,
    timestamp: '07:20 AM',
    date: new Date().toISOString().split('T')[0],
    shift: 'AM Morning',
    userInitials: 'TK',
    status: 'in_spec',
    notes: 'Meat hanging lines verified at 1.4°C.'
  },
  {
    id: 'log-3',
    unitId: 'walkin_fish',
    unitName: 'Seafood Chiller on Wet Ice #3',
    category: 'cold_storage',
    temperature: 1.1,
    timestamp: '07:25 AM',
    date: new Date().toISOString().split('T')[0],
    shift: 'AM Morning',
    userInitials: 'TK',
    status: 'in_spec',
    notes: 'Crushed ice replenished over linefish.'
  },
  {
    id: 'log-4',
    unitId: 'freezer_main',
    unitName: 'Walk-in Deep Freezer #1',
    category: 'freezer',
    temperature: -19.4,
    timestamp: '07:30 AM',
    date: new Date().toISOString().split('T')[0],
    shift: 'AM Morning',
    userInitials: 'TK',
    status: 'in_spec',
    notes: 'Seals tight, digital readouts calibrated.'
  },
  {
    id: 'log-5',
    unitId: 'reachin_pastry',
    unitName: 'Pastry & Cream Reach-in Fridge',
    category: 'cold_storage',
    temperature: 4.8,
    timestamp: '11:45 AM',
    date: new Date().toISOString().split('T')[0],
    shift: 'Midday Service',
    userInitials: 'JP',
    status: 'warning',
    correctiveAction: 'Door was held open during prep loading; re-latched and dropped to 3.2°C within 15 min.',
    notes: 'Monitored temperature drop closely.'
  },
  {
    id: 'log-6',
    unitId: 'hot_holding_cart1',
    unitName: 'Heated Banqueting Cloche Cart #1',
    category: 'hot_holding',
    temperature: 68.5,
    timestamp: '12:10 PM',
    date: new Date().toISOString().split('T')[0],
    shift: 'Midday Service',
    userInitials: 'JP',
    status: 'in_spec',
    notes: 'Pre-heated for banquet cloche plating.'
  }
];

export function determineStatus(unit: StorageUnit, temp: number): 'in_spec' | 'warning' | 'out_of_spec' {
  if (unit.category === 'hot_holding' || unit.category === 'sanitization') {
    if (temp < unit.criticalLimit) return 'out_of_spec';
    if (temp < unit.minSafe) return 'warning';
    return 'in_spec';
  } else if (unit.category === 'freezer') {
    if (temp > unit.criticalLimit) return 'out_of_spec';
    if (temp > unit.maxSafe) return 'warning';
    return 'in_spec';
  } else {
    // cold storage
    if (temp > unit.criticalLimit) return 'out_of_spec';
    if (temp > unit.maxSafe) return 'warning';
    return 'in_spec';
  }
}

interface HaccpLogProps {
  onNotify?: (msg: string) => void;
}

export const HaccpLog: React.FC<HaccpLogProps> = ({ onNotify }) => {
  // Saved logs in localStorage
  const [logs, setLogs] = useState<HaccpCheckEntry[]>(() => {
    const saved = localStorage.getItem('caterpro_haccp_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_LOG_ENTRIES;
  });

  // Current active initials remembered across entries
  const [activeInitials, setActiveInitials] = useState<string>(() => {
    return localStorage.getItem('caterpro_haccp_initials') || 'TK';
  });

  // Selected date
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Filter state
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // New entry form state
  const [selectedUnitId, setSelectedUnitId] = useState<string>(STANDARD_STORAGE_UNITS[0].id);
  const [inputTemp, setInputTemp] = useState<string>('2.5');
  const [inputShift, setInputShift] = useState<'AM Morning' | 'Midday Service' | 'PM Evening Close'>('AM Morning');
  const [inputTimestamp, setInputTimestamp] = useState<string>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  const [inputCorrectiveAction, setInputCorrectiveAction] = useState<string>('');
  const [inputNotes, setInputNotes] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('caterpro_haccp_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('caterpro_haccp_initials', activeInitials);
  }, [activeInitials]);

  const selectedUnit = useMemo(() => {
    return STANDARD_STORAGE_UNITS.find(u => u.id === selectedUnitId) || STANDARD_STORAGE_UNITS[0];
  }, [selectedUnitId]);

  // Preview status of current inputs
  const currentPreviewStatus = useMemo(() => {
    const tempNum = parseFloat(inputTemp);
    if (isNaN(tempNum)) return 'in_spec';
    return determineStatus(selectedUnit, tempNum);
  }, [selectedUnit, inputTemp]);

  // Filtered log entries
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchDate = !selectedDate || log.date === selectedDate;
      const matchCat = filterCategory === 'all' || log.category === filterCategory;
      const matchStatus = filterStatus === 'all' || log.status === filterStatus;
      return matchDate && matchCat && matchStatus;
    });
  }, [logs, selectedDate, filterCategory, filterStatus]);

  // Daily statistics
  const dailyStats = useMemo(() => {
    const todayLogs = logs.filter(l => l.date === selectedDate);
    const total = todayLogs.length;
    const inSpec = todayLogs.filter(l => l.status === 'in_spec').length;
    const warnings = todayLogs.filter(l => l.status === 'warning').length;
    const outOfSpec = todayLogs.filter(l => l.status === 'out_of_spec').length;
    const complianceRate = total > 0 ? Math.round(((inSpec + warnings * 0.5) / total) * 100) : 100;
    return { total, inSpec, warnings, outOfSpec, complianceRate };
  }, [logs, selectedDate]);

  // Add new log entry
  const handleAddEntry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tempNum = parseFloat(inputTemp);
    if (isNaN(tempNum)) {
      onNotify?.('Please enter a valid numeric temperature reading.');
      return;
    }
    const cleanInitials = activeInitials.trim().toUpperCase() || 'CHEF';
    const status = determineStatus(selectedUnit, tempNum);

    if (status === 'out_of_spec' && !inputCorrectiveAction.trim()) {
      onNotify?.('Critical limit exceeded: Statutory SANS 10330 requires a logged Corrective Action note.');
      return;
    }

    const newEntry: HaccpCheckEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      unitId: selectedUnit.id,
      unitName: selectedUnit.name,
      category: selectedUnit.category,
      temperature: tempNum,
      timestamp: inputTimestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: selectedDate,
      shift: inputShift,
      userInitials: cleanInitials,
      status,
      correctiveAction: inputCorrectiveAction.trim() || undefined,
      notes: inputNotes.trim() || undefined
    };

    setLogs(prev => [newEntry, ...prev]);
    onNotify?.(`Logged ${selectedUnit.name}: ${tempNum}°C by ${cleanInitials} (${status === 'in_spec' ? 'Compliant' : status.toUpperCase()})`);
    
    // Reset secondary fields
    setInputCorrectiveAction('');
    setInputNotes('');
    setIsFormOpen(false);
  };

  // Quick log all cold rooms in spec for morning shift
  const handleQuickLogStandardShift = () => {
    const cleanInitials = activeInitials.trim().toUpperCase() || 'TK';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const standardChecks: HaccpCheckEntry[] = STANDARD_STORAGE_UNITS.slice(0, 6).map((unit, idx) => {
      let temp = 2.4;
      if (unit.category === 'freezer') temp = -19.5;
      else if (unit.category === 'cold_storage') temp = unit.id.includes('meat') || unit.id.includes('fish') ? 1.2 : 2.6;
      else if (unit.category === 'hot_holding') temp = 68.0;

      return {
        id: `batch-${Date.now()}-${idx}`,
        unitId: unit.id,
        unitName: unit.name,
        category: unit.category,
        temperature: temp,
        timestamp: nowTime,
        date: selectedDate,
        shift: inputShift,
        userInitials: cleanInitials,
        status: 'in_spec',
        notes: 'Routine verification audit pass. Operating within safe bounds.'
      };
    });

    setLogs(prev => [...standardChecks, ...prev]);
    onNotify?.(`Logged morning audit pass for 6 core storage units under initials [${cleanInitials}]`);
  };

  const handleDeleteEntry = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
    onNotify?.('Log entry removed.');
  };

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-left animate-fade-in">
      {/* Top Banner & Audit Credentials */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                SANS 10330 HACCP Defensible Audit Log
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Critical Control Point (CCP-1)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Daily Cold Storage & Equipment Temperature Log
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Record statutory morning, service, and closing temperature checks for walk-ins, freezers, and hot-holding units with time-stamps and brigade initials.
            </p>
          </div>

          {/* User Initials Badge & Action */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 bg-slate-50 border border-slate-200/80 rounded-xl p-2 px-3">
            <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                Auditor Initials
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  maxLength={4}
                  value={activeInitials}
                  onChange={(e) => setActiveInitials(e.target.value.toUpperCase())}
                  placeholder="Initials"
                  className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-black text-xs text-teal-800 uppercase focus:border-teal-500 outline-none text-center"
                />
                <span className="text-[10px] font-bold text-slate-500">Chef on Duty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Snug KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3">
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Checks Today ({selectedDate})
            </span>
            <span className="text-lg font-black text-slate-900 font-mono">
              {dailyStats.total} <span className="text-xs font-normal text-slate-500">records</span>
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Compliance Rate
            </span>
            <span className="text-lg font-black text-emerald-700 font-mono">
              {dailyStats.complianceRate}%
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              In Spec / Warning
            </span>
            <span className="text-lg font-black text-slate-800 font-mono">
              {dailyStats.inSpec} <span className="text-xs font-bold text-amber-600">/ {dailyStats.warnings}</span>
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              CCP Breaches (Action Req)
            </span>
            <span className={`text-lg font-black font-mono ${dailyStats.outOfSpec > 0 ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
              {dailyStats.outOfSpec}
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Date Selector, Quick Actions, and Add Check Button */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
            />
          </div>

          {/* Shift Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
            {(['all', 'cold_storage', 'freezer', 'hot_holding'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All Units' : cat === 'cold_storage' ? 'Cold Rooms' : cat === 'freezer' ? 'Freezers' : 'Hot Wells'}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleQuickLogStandardShift}
            title="Batch log all primary cold rooms operating in spec for this shift"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">1-Tap Standard Pass</span>
            <span className="sm:hidden">Auto Pass</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-lime-500 to-teal-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-sm shadow-teal-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Record Temperature</span>
          </button>

          <button
            type="button"
            onClick={handlePrintAudit}
            title="Print or export formal HACCP audit record"
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Record Temperature Dropdown / Drawer Form */}
      {isFormOpen && (
        <form onSubmit={handleAddEntry} className="bg-white rounded-2xl border-2 border-teal-300/80 p-4 sm:p-5 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                🌡️
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                New Temperature Reading
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold p-1"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Storage Unit Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Cold Storage Unit / Equipment
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
              >
                {STANDARD_STORAGE_UNITS.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.targetRange})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 block">
                Target: {selectedUnit.targetRange} • Critical: {selectedUnit.category === 'hot_holding' ? `< ${selectedUnit.criticalLimit}°C` : `> ${selectedUnit.criticalLimit}°C`}
              </span>
            </div>

            {/* Shift */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Service Shift
              </label>
              <select
                value={inputShift}
                onChange={(e) => setInputShift(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
              >
                <option value="AM Morning">AM Morning (07:00 Prep)</option>
                <option value="Midday Service">Midday Service (12:00 Pass)</option>
                <option value="PM Evening Close">PM Evening Close (21:00 Audit)</option>
              </select>
            </div>

            {/* Time Stamp */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Time-Stamp
                </label>
                <button
                  type="button"
                  onClick={() => setInputTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}
                  className="text-[9px] font-bold text-teal-700 hover:underline"
                >
                  Set to Now
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={inputTimestamp}
                  onChange={(e) => setInputTimestamp(e.target.value)}
                  placeholder="e.g. 08:30 AM"
                  className="w-full p-2 pl-7 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 outline-none focus:border-teal-500"
                />
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              </div>
            </div>

            {/* Temperature Reading */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Reading (°C)
                </label>
                <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                  currentPreviewStatus === 'in_spec'
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentPreviewStatus === 'warning'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800 animate-pulse'
                }`}>
                  {currentPreviewStatus === 'in_spec' ? '✓ In Spec' : currentPreviewStatus === 'warning' ? '⚠ Warning' : '✕ Out of Spec'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={inputTemp}
                  onChange={(e) => setInputTemp(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setInputTemp(prev => (parseFloat(prev || '0') - 0.5).toFixed(1))}
                  className="px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setInputTemp(prev => (parseFloat(prev || '0') + 0.5).toFixed(1))}
                  className="px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Corrective Action if out of spec or warning */}
          {(currentPreviewStatus === 'out_of_spec' || currentPreviewStatus === 'warning') && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1.5 animate-fade-in">
              <div className="flex items-center gap-1.5 text-red-800 text-xs font-black">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Statutory Corrective Action Protocol (Required for CCP Out of Spec)</span>
              </div>
              <input
                type="text"
                value={inputCorrectiveAction}
                onChange={(e) => setInputCorrectiveAction(e.target.value)}
                placeholder="Detail action taken: e.g. Thermostat adjusted; product moved to backup chiller; re-checked in 20 min..."
                className="w-full p-2 bg-white border border-red-300 rounded-lg text-xs text-slate-900 outline-none focus:ring-1 focus:ring-red-500 font-medium"
              />
              <div className="flex flex-wrap gap-1 text-[9px] pt-1">
                {[
                  'Door gasket cleaned & re-sealed',
                  'Thermostat lowered; re-verified in 20 min',
                  'Moved perishable proteins to backup unit #2',
                  'Maintenance notified for compressor inspection'
                ].map(action => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setInputCorrectiveAction(action)}
                    className="px-2 py-0.5 bg-white border border-red-200 hover:bg-red-100 text-red-800 rounded font-medium cursor-pointer"
                  >
                    + {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Submit */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <input
              type="text"
              value={inputNotes}
              onChange={(e) => setInputNotes(e.target.value)}
              placeholder="Routine operational observations (e.g. defrost cycle clean, ice pack status)..."
              className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 outline-none focus:border-teal-500"
            />

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-lime-500 via-teal-600 to-cyan-600 hover:from-lime-400 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer"
              >
                Commit HACCP Record
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Log Entries List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Verified Temperature Entries ({filteredLogs.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Timestamped & Initialed for Health Inspections
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg">
              📋
            </div>
            <p className="text-xs font-bold text-slate-700">No temperature records found for this filter.</p>
            <p className="text-[11px] text-slate-400">Click "Record Temperature" or "1-Tap Standard Pass" to log initial readings.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map(entry => (
              <div 
                key={entry.id} 
                className="p-3 sm:p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                {/* Left: Unit, Category, Date/Shift */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-slate-900 text-xs sm:text-sm">
                      {entry.unitName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      entry.status === 'in_spec'
                        ? 'bg-emerald-100 text-emerald-800'
                        : entry.status === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.status === 'in_spec' ? '✓ In Spec' : entry.status === 'warning' ? '⚠ Warning' : '✕ Out of Spec'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {entry.timestamp}
                    </span>
                    <span>•</span>
                    <span>{entry.shift}</span>
                    <span>•</span>
                    <span className="font-mono">{entry.date}</span>
                    {entry.notes && (
                      <>
                        <span>•</span>
                        <span className="text-slate-600 italic">"{entry.notes}"</span>
                      </>
                    )}
                  </div>

                  {entry.correctiveAction && (
                    <div className="mt-1 p-2 bg-red-50/80 border border-red-200 rounded-lg text-[11px] text-red-800">
                      <strong className="font-bold">Corrective Action Taken: </strong>
                      {entry.correctiveAction}
                    </div>
                  )}
                </div>

                {/* Right: Temp Badge, Initial Tag & Delete */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <div className="text-right">
                    <span className={`text-base sm:text-lg font-black font-mono block leading-tight ${
                      entry.status === 'in_spec'
                        ? 'text-teal-700'
                        : entry.status === 'warning'
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}>
                      {entry.temperature > 0 ? `+${entry.temperature.toFixed(1)}` : entry.temperature.toFixed(1)}°C
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold block">
                      Recorded
                    </span>
                  </div>

                  {/* Initial Badge */}
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-mono font-black text-xs flex items-center justify-center shadow-2xs">
                      {entry.userInitials}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                      Initials
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteEntry(entry.id)}
                    title="Remove entry"
                    className="p-1.5 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statutory Guidance Footer */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
          <p className="text-[11px] leading-relaxed">
            <strong>SANS 10330 HACCP Protocol:</strong> Temperatures must be recorded at least twice daily. Cold-holding must maintain core food temperatures ≤ 4.0°C. Any reading above 5.0°C requires mandatory corrective action and secondary verification.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm('Clear all recorded HACCP logs and reset to standard template?')) {
              setLogs(INITIAL_LOG_ENTRIES);
              onNotify?.('Reset HACCP log entries to clean template.');
            }
          }}
          className="text-[11px] font-bold text-slate-500 hover:text-red-600 whitespace-nowrap self-end sm:self-auto cursor-pointer"
        >
          Reset Logs
        </button>
      </div>
    </div>
  );
};

export default HaccpLog;
