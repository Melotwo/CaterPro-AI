import React, { useState } from 'react';
import { 
  Clock, 
  GripVertical, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChefHat, 
  GlassWater, 
  Utensils, 
  Flame, 
  Cake, 
  RefreshCw, 
  Copy, 
  Check, 
  Calendar, 
  MapPin, 
  Layers,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Timer
} from 'lucide-react';
import { ServiceScheduleEvent } from '../types';

interface TimelineProps {
  events?: ServiceScheduleEvent[];
  onUpdateEvents: (events: ServiceScheduleEvent[]) => void;
  onNotify?: (message: string) => void;
  eventDate?: string;
  roomLocation?: string;
  beoNumber?: string;
}

const DEFAULT_BANQUET_EVENTS: ServiceScheduleEvent[] = [
  {
    id: 'ev-welcome',
    title: 'Welcome Drinks',
    time: '18:00',
    durationMinutes: 45,
    category: 'welcome',
    phase: 'Arrival & Reception',
    description: 'Butler-passed Cap Classique sparkling wine, bespoke botanical mocktails & artisan canapés.',
    responsibleTeam: 'Sommelier & Banqueting Captains',
    status: 'completed',
    temperatureControl: 'Chilled cellar service (6-8°C)',
    notes: 'VIP deck arrival; 2 trays allocated per zone'
  },
  {
    id: 'ev-starters',
    title: 'Starters Served',
    time: '19:15',
    durationMinutes: 40,
    category: 'starters',
    phase: 'First Course Service',
    description: 'Plated Roasted Heritage Beetroot Carpaccio & Pan-Seared Cape Scallops to all guest tables.',
    responsibleTeam: 'Cold Larder Brigade & Runners',
    status: 'active',
    temperatureControl: 'Plated fresh; cold-well holding at 4°C',
    notes: 'Verify Halal-certified plates on Tables 1 & 4'
  },
  {
    id: 'ev-mains',
    title: 'Main Course',
    time: '20:15',
    durationMinutes: 50,
    category: 'mains',
    phase: 'Hot Entrée Banquet Run',
    description: 'Synchronized cloche service: Herb-Crusted Karoo Lamb Cutlets & Wild Kingklip with Truffle Risotto.',
    responsibleTeam: 'Hot Line Pass & Service Brigade',
    status: 'scheduled',
    temperatureControl: 'Silver cloche holding (>65°C SANS 10330)',
    notes: '2-minute synchronized cloche lift on captain whistle'
  },
  {
    id: 'ev-dessert',
    title: 'Dessert',
    time: '21:15',
    durationMinutes: 40,
    category: 'dessert',
    phase: 'Sweet Grand Finale',
    description: 'Amarula & Belgian Chocolate Torte with Cape Citrus Tart & Fynbos Sorbet shooters.',
    responsibleTeam: 'Pastry Kitchen & Barista Team',
    status: 'scheduled',
    temperatureControl: 'Cold-chain pastry display (4°C)',
    notes: 'Warm berry coulis drizzled tableside'
  }
];

export const Timeline: React.FC<TimelineProps> = ({
  events = DEFAULT_BANQUET_EVENTS,
  onUpdateEvents,
  onNotify,
  eventDate = '2026-10-18',
  roomLocation = 'Grand Ballroom & Banqueting Deck',
  beoNumber = 'BEO-2026-HOTEL-784'
}) => {
  const currentEvents = events && events.length > 0 ? events : DEFAULT_BANQUET_EVENTS;

  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [copiedSchedule, setCopiedSchedule] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('Speeches & Champagne Toast');
  const [newEventTime, setNewEventTime] = useState('20:00');
  const [newEventDuration, setNewEventDuration] = useState(20);
  const [newEventCategory, setNewEventCategory] = useState<ServiceScheduleEvent['category']>('ceremony');
  const [newEventTeam, setNewEventTeam] = useState('Front of House MC & Captain');
  const [newEventDesc, setNewEventDesc] = useState('Welcome address, sponsor toast & award presentations.');

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedEventId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    // handled naturally on drop or container exit
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceId = draggedEventId || e.dataTransfer.getData('text/plain');
    if (!sourceId) return;

    const sourceIndex = currentEvents.findIndex(ev => ev.id === sourceId);
    if (sourceIndex === -1 || sourceIndex === targetIndex) {
      setDraggedEventId(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...currentEvents];
    const [movedItem] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    onUpdateEvents(reordered);
    setDraggedEventId(null);
    setDragOverIndex(null);

    if (onNotify) {
      onNotify(`Reordered "${movedItem.title}" in banquet timeline`);
    }
  };

  const handleDragEnd = () => {
    setDraggedEventId(null);
    setDragOverIndex(null);
  };

  // Move Up / Move Down buttons for accessible / mobile reordering
  const moveEvent = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentEvents.length) return;

    const reordered = [...currentEvents];
    const [item] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, item);

    onUpdateEvents(reordered);
    if (onNotify) {
      onNotify(`Moved "${item.title}" ${direction}`);
    }
  };

  // Adjust time (+/- 15 minutes)
  const adjustEventTime = (id: string, deltaMinutes: number) => {
    const updated = currentEvents.map(ev => {
      if (ev.id !== id) return ev;
      const [h, m] = ev.time.split(':').map(Number);
      let totalMins = (isNaN(h) ? 18 : h) * 60 + (isNaN(m) ? 0 : m) + deltaMinutes;
      if (totalMins < 0) totalMins += 24 * 60;
      totalMins = totalMins % (24 * 60);

      const newH = String(Math.floor(totalMins / 60)).padStart(2, '0');
      const newM = String(totalMins % 60).padStart(2, '0');
      return { ...ev, time: `${newH}:${newM}` };
    });
    onUpdateEvents(updated);
  };

  // Update specific event fields
  const handleUpdateEventField = (id: string, field: keyof ServiceScheduleEvent, value: any) => {
    const updated = currentEvents.map(ev => {
      if (ev.id === id) {
        return { ...ev, [field]: value };
      }
      return ev;
    });
    onUpdateEvents(updated);
  };

  // Delete event
  const handleDeleteEvent = (id: string) => {
    const ev = currentEvents.find(e => e.id === id);
    const updated = currentEvents.filter(e => e.id !== id);
    onUpdateEvents(updated);
    if (onNotify) {
      onNotify(`Removed "${ev?.title || 'event'}" from schedule`);
    }
  };

  // Reset to default banquet schedule
  const handleResetSchedule = () => {
    onUpdateEvents(DEFAULT_BANQUET_EVENTS);
    if (onNotify) {
      onNotify('Reset to standard 4-course banquet timeline');
    }
  };

  // Auto-align times sequentially starting from the first event
  const handleAutoAlignTimings = () => {
    if (currentEvents.length === 0) return;
    const [startH, startM] = currentEvents[0].time.split(':').map(Number);
    let currentMins = (isNaN(startH) ? 18 : startH) * 60 + (isNaN(startM) ? 0 : startM);

    const aligned = currentEvents.map((ev, idx) => {
      if (idx === 0) return ev;
      const prev = currentEvents[idx - 1];
      const spacing = prev.durationMinutes || 45;
      currentMins += spacing;

      const totalMod = currentMins % (24 * 60);
      const hStr = String(Math.floor(totalMod / 60)).padStart(2, '0');
      const mStr = String(totalMod % 60).padStart(2, '0');
      return {
        ...ev,
        time: `${hStr}:${mStr}`
      };
    });

    onUpdateEvents(aligned);
    if (onNotify) {
      onNotify('Synchronized course timings based on service pacing');
    }
  };

  // Add new event
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: ServiceScheduleEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim() || 'Service Stage',
      time: newEventTime || '19:00',
      durationMinutes: Number(newEventDuration) || 30,
      category: newEventCategory,
      phase: newEventTitle,
      description: newEventDesc.trim(),
      responsibleTeam: newEventTeam.trim(),
      status: 'scheduled',
      temperatureControl: newEventCategory === 'mains' ? 'Hot holding (>65°C)' : undefined
    };

    const updated = [...currentEvents, newEvent];
    onUpdateEvents(updated);
    setShowAddModal(false);
    if (onNotify) {
      onNotify(`Added "${newEvent.title}" to schedule`);
    }

    // Reset form fields
    setNewEventTitle('');
    setNewEventDesc('');
  };

  // Copy Run Sheet to Clipboard
  const handleCopyRunSheet = () => {
    const lines = [
      `=========================================`,
      `CATERPROAI BANQUET SERVICE RUN-SHEET`,
      `BEO: ${beoNumber}`,
      `Date: ${eventDate} | Venue: ${roomLocation}`,
      `=========================================`,
      ...currentEvents.map((ev, i) => 
        `[${ev.time}] (Stage ${i + 1}) ${ev.title.toUpperCase()}\n` +
        `  • Team: ${ev.responsibleTeam || 'Brigade'}\n` +
        `  • Details: ${ev.description || 'Standard service'}\n` +
        (ev.temperatureControl ? `  • SANS 10330 Temp: ${ev.temperatureControl}\n` : '') +
        (ev.notes ? `  • Notes: ${ev.notes}\n` : '')
      ),
      `=========================================`,
      `Verified by Executive Chef & Banqueting Manager`
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 2500);
    if (onNotify) {
      onNotify('Copied full banquet run-sheet to clipboard');
    }
  };

  // Visual category styling
  const getCategoryStyles = (category?: string) => {
    switch (category) {
      case 'welcome':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500 ring-emerald-200',
          icon: <GlassWater className="w-4 h-4 text-emerald-700" />
        };
      case 'starters':
        return {
          bg: 'bg-teal-500/10 border-teal-500/30 text-teal-900',
          badge: 'bg-teal-100 text-teal-800 border-teal-300',
          dot: 'bg-teal-500 ring-teal-200',
          icon: <Utensils className="w-4 h-4 text-teal-700" />
        };
      case 'mains':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-900',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500 ring-amber-200',
          icon: <Flame className="w-4 h-4 text-amber-700" />
        };
      case 'dessert':
        return {
          bg: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-900',
          badge: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
          dot: 'bg-fuchsia-500 ring-fuchsia-200',
          icon: <Cake className="w-4 h-4 text-fuchsia-700" />
        };
      case 'ceremony':
      default:
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-900',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          dot: 'bg-indigo-500 ring-indigo-200',
          icon: <Sparkles className="w-4 h-4 text-indigo-700" />
        };
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">✓ Completed</span>;
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-lime-100 text-lime-900 border border-lime-400 animate-pulse">● Live Serving</span>;
      case 'in_prep':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">⏳ In Prep</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">Scheduled</span>;
    }
  };

  // Calculate schedule summary
  const startTime = currentEvents[0]?.time || '18:00';
  const endTime = currentEvents[currentEvents.length - 1]?.time || '21:15';

  return (
    <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 sm:p-6 overflow-hidden space-y-5 text-left">
      
      {/* Ambient gradient ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-amber-500" />

      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-50 text-teal-700 rounded-lg border border-teal-200">
              <Clock className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wide text-slate-900 flex items-center gap-2">
              <span>Service Schedule & Course Timeline</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Drag & Drop Enabled
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual run-sheet: drag courses to sequence service stages. Timings synchronize with BEO and kitchen pass.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAutoAlignTimings}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Automatically space course service timings by recommended intervals"
          >
            <Timer className="w-3.5 h-3.5 text-teal-600" />
            <span>Auto-Align Times</span>
          </button>

          <button
            type="button"
            onClick={handleCopyRunSheet}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Copy formatted run sheet for service captains"
          >
            {copiedSchedule ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedSchedule ? 'Copied!' : 'Copy Run-Sheet'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stage</span>
          </button>

          <button
            type="button"
            onClick={handleResetSchedule}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Reset to standard hotel banquet sequence"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* HORIZONTAL TIMELINE VISUAL RIBBON */}
      <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4 border border-slate-200/80">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{eventDate}</span>
            <span className="text-slate-300">•</span>
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{roomLocation}</span>
          </span>
          <span className="font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[10px]">
            Span: {startTime} — {endTime} ({currentEvents.length} Service Stages)
          </span>
        </div>

        {/* Visual timeline nodes connecting track */}
        <div className="relative">
          {/* Track line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 z-0 hidden sm:block" />

          {/* Stepper Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
            {currentEvents.map((ev, idx) => {
              const styles = getCategoryStyles(ev.category);
              const isActive = ev.status === 'active';
              return (
                <div
                  key={ev.id}
                  className={`p-2.5 rounded-xl border transition-all text-left bg-white ${
                    isActive 
                      ? 'border-teal-500 shadow-sm ring-2 ring-teal-400/20' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                      {ev.time}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate" title={ev.title}>
                    {ev.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {ev.durationMinutes || 40} min • {ev.phase || 'Stage ' + (idx + 1)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DRAG AND DROP SERVICE EVENT CARDS LIST */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
          <span>Banquet Service Stages (Drag cards to reorder sequence)</span>
          <span className="text-[11px] text-slate-400">Total Run Time: ~4 Hours</span>
        </div>

        {currentEvents.map((ev, index) => {
          const styles = getCategoryStyles(ev.category);
          const isDragging = draggedEventId === ev.id;
          const isOver = dragOverIndex === index;
          const isEditing = editingEventId === ev.id;

          return (
            <div
              key={ev.id}
              draggable
              onDragStart={(e) => handleDragStart(e, ev.id)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative rounded-xl border transition-all duration-200 select-none ${
                isDragging 
                  ? 'opacity-40 scale-[0.98] border-dashed border-teal-500 bg-teal-50/50' 
                  : isOver 
                  ? 'border-teal-500 bg-teal-50/30 ring-2 ring-teal-400/30' 
                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Drag Grip + Order Number + Time */}
                <div className="flex items-center gap-3">
                  {/* Drag Handle */}
                  <div 
                    className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Drag to reorder event schedule"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Stage Index Badge */}
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-black flex items-center justify-center shrink-0 border border-slate-200">
                    {index + 1}
                  </span>

                  {/* Time Badge with quick adjust */}
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs sm:text-sm font-black text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      {ev.time}
                    </span>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => adjustEventTime(ev.id, 15)}
                        className="p-0.5 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded text-[9px] font-bold cursor-pointer leading-none"
                        title="Add 15 minutes"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustEventTime(ev.id, -15)}
                        className="p-0.5 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded text-[9px] font-bold cursor-pointer leading-none"
                        title="Subtract 15 minutes"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  {/* Icon & Category Badge */}
                  <div className="hidden xs:flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg border ${styles.bg}`}>
                      {styles.icon}
                    </span>
                  </div>

                  {/* Event Title & Team */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {ev.title}
                      </h4>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${styles.badge}`}>
                        {ev.category}
                      </span>
                      {getStatusBadge(ev.status)}
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {ev.description || 'Standard banquet service protocol'}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 flex-wrap">
                      <span className="font-medium text-slate-600">
                        Brigade: {ev.responsibleTeam || 'Service Staff'}
                      </span>
                      {ev.temperatureControl && (
                        <>
                          <span>•</span>
                          <span className="text-amber-700 font-medium flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            {ev.temperatureControl}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Controls: Quick Status Select + Up/Down buttons + Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  
                  {/* Status switcher */}
                  <select
                    value={ev.status || 'scheduled'}
                    onChange={(e) => handleUpdateEventField(ev.id, 'status', e.target.value)}
                    className="text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 cursor-pointer hover:border-slate-300"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_prep">In Prep</option>
                    <option value="active">Live Serving</option>
                    <option value="completed">Completed</option>
                  </select>

                  {/* Accessible Move Up / Move Down for Touch/Mobile */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveEvent(index, 'up')}
                      className={`p-1.5 hover:bg-slate-200 transition-colors cursor-pointer ${
                        index === 0 ? 'opacity-30 cursor-not-allowed' : 'text-slate-600'
                      }`}
                      title="Move event up in schedule"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === currentEvents.length - 1}
                      onClick={() => moveEvent(index, 'down')}
                      className={`p-1.5 hover:bg-slate-200 transition-colors border-l border-slate-200 cursor-pointer ${
                        index === currentEvents.length - 1 ? 'opacity-30 cursor-not-allowed' : 'text-slate-600'
                      }`}
                      title="Move event down in schedule"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove event from schedule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK PRESETS FOR HOSPITALITY BRIGADES */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-400">
          Quick Stage Inserts:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { title: 'Speeches & Toast', time: '20:00', cat: 'ceremony' as const, team: 'MC / Banquet Host', desc: 'Sponsor welcome toast and keynote address' },
            { title: 'Palate Cleanser Sorbet', time: '19:55', cat: 'starters' as const, team: 'Pastry Brigade', desc: 'Lemon & wild thyme granita intermezzo' },
            { title: 'Coffee & Mignardises', time: '21:45', cat: 'beverage' as const, team: 'Barista Service', desc: 'Espresso service and handmade chocolate petit fours' }
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const newEv: ServiceScheduleEvent = {
                  id: `ev-preset-${Date.now()}-${idx}`,
                  title: preset.title,
                  time: preset.time,
                  durationMinutes: 20,
                  category: preset.cat,
                  phase: preset.title,
                  description: preset.desc,
                  responsibleTeam: preset.team,
                  status: 'scheduled'
                };
                onUpdateEvents([...currentEvents, newEv]);
                if (onNotify) onNotify(`Added "${preset.title}" to banquet timeline`);
              }}
              className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 text-slate-700 rounded-lg border border-slate-200 transition-all cursor-pointer"
            >
              + {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* ADD SERVICE STAGE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-teal-50 text-teal-700 rounded-lg">
                  <Clock className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Add Service Stage
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stage Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Speeches & Champagne Toast"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newEventDuration}
                    onChange={(e) => setNewEventDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none cursor-pointer"
                  >
                    <option value="welcome">Welcome / Drinks</option>
                    <option value="starters">Starters / First Course</option>
                    <option value="mains">Main Course</option>
                    <option value="dessert">Dessert</option>
                    <option value="ceremony">Ceremony / Speeches</option>
                    <option value="beverage">Beverage Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brigade / Station
                  </label>
                  <input
                    type="text"
                    value={newEventTeam}
                    onChange={(e) => setNewEventTeam(e.target.value)}
                    placeholder="e.g. Pastry Brigade"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Service Protocol
                </label>
                <textarea
                  rows={2}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Instructions for service captains and kitchen pass..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-teal-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  Save Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Timeline;
