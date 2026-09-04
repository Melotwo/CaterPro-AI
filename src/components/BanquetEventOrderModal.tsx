import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Menu, AllergenMatrixItem } from '../types';

export const OCTAGON_CLIP = 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)';

interface BanquetEventOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: Menu;
  margin: number;
}

export const BanquetEventOrderModal: React.FC<BanquetEventOrderModalProps> = ({
  isOpen,
  onClose,
  menu,
  margin
}) => {
  const beoRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [roomLocation, setRoomLocation] = useState(menu.roomLocation || 'Grand Ballroom & Garden Terrace');
  const [eventDate, setEventDate] = useState(menu.eventDate || new Date().toISOString().split('T')[0]);
  const [serviceTime, setEventTime] = useState(menu.eventTime || '18:30 for 19:00 Service');
  const [clientName, setClientName] = useState('Premier Corporate Hospitality');
  const [beoNumber] = useState(menu.beoNumber || `BEO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

  const covers = menu.guestCount || menu.covers || 100;
  const items = menu.menu || [];
  const appetizers = items.filter(i => i.cat === 'Appetizers');
  const mains = items.filter(i => i.cat === 'Main Courses');
  const desserts = items.filter(i => i.cat === 'Desserts');

  const totalCostPerHead = items.reduce((acc, cur) => acc + (cur.cost || 0), 0);
  const totalSellingPricePerHead = items.reduce((acc, cur) => acc + (cur.price || 0), 0);
  const deliveryOrSetupFee = menu.logistics?.deliveryFee || 0;
  const totalEventValue = (totalSellingPricePerHead * covers) + deliveryOrSetupFee;

  // Derive Allergen Matrix if not already explicitly present
  const matrix: AllergenMatrixItem[] = (menu.allergenMatrix && menu.allergenMatrix.length > 0)
    ? menu.allergenMatrix
    : items.map(d => {
        const textToScan = `${d.dish} ${d.notes || ''}`.toLowerCase();
        const hasGluten = /bread|flour|wheat|pasta|crust|pastry|brioche|croûte|crouton|batter|crumb/.test(textToScan);
        const hasDairy = /cheese|cream|butter|milk|yogurt|parmesan|mascarpone|brie|gouda/.test(textToScan);
        const hasNuts = /nut|almond|walnut|pecan|pistachio|peanut|cashew|praline/.test(textToScan);
        const hasEggs = /egg|mayo|aioli|hollandaise|custard|meringue|souffle/.test(textToScan);
        const hasShellfish = /prawn|shrimp|crab|lobster|mussel|clam|oyster|calamari/.test(textToScan);
        const hasFish = /salmon|trout|linefish|kingklip|hake|snapper|tuna|bass/.test(textToScan);
        const hasSoy = /soy|edamame|tofu|tamari/.test(textToScan);

        const dietaryTags: string[] = [];
        if (!/beef|pork|lamb|chicken|duck|meat|fish|salmon|prawn|shellfish/.test(textToScan)) {
          dietaryTags.push("Vegetarian");
          if (!hasDairy && !hasEggs) dietaryTags.push("Vegan");
        }
        if (!hasGluten) dietaryTags.push("Gluten-Free");
        if (!/pork|bacon|ham|prosciutto|lard/.test(textToScan)) dietaryTags.push("Halal-Friendly");

        return {
          dish: d.dish,
          category: d.cat,
          gluten: hasGluten,
          dairy: hasDairy,
          nuts: hasNuts,
          eggs: hasEggs,
          shellfish: hasShellfish,
          fish: hasFish,
          soy: hasSoy,
          dietary: dietaryTags,
          notes: d.notes || 'Banquet preparation standard'
        };
      });

  const handleExportPDF = async () => {
    if (!beoRef.current) return;
    setIsExporting(true);
    try {
      const element = beoRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#090d16'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Render multiple pages if long document
      if (pdfHeight > pageHeight) {
        let remainingHeight = pdfHeight;
        while (remainingHeight > 0) {
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          remainingHeight -= pageHeight;
          if (remainingHeight > 0) {
            pdf.addPage();
            position -= pageHeight;
          }
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`${beoNumber}_Banquet_Event_Order.pdf`);
    } catch (error) {
      console.error('BEO PDF Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} 
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-5xl bg-slate-950 border border-white/10 rounded-[3rem] shadow-2xl z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-6 md:px-10 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="text-lg font-black uppercase text-white tracking-tight">
                  Banquet Event Order (BEO)
                </h3>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Hotel F&B Operations & Kitchen Execution Specification
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-black uppercase text-xs tracking-wider transition-all flex items-center gap-2 shadow-lg"
                style={{ clipPath: OCTAGON_CLIP }}
              >
                {isExporting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Rendering PDF...
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    Download BEO PDF
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Printable BEO Body Container */}
          <div className="overflow-y-auto p-6 md:p-12 space-y-10 text-left">
            <div ref={beoRef} className="p-8 md:p-12 bg-slate-900/90 rounded-[2.5rem] border border-white/10 shadow-xl space-y-10">
              
              {/* Hotel & Document Header */}
              <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                      Hotel Food & Beverage Department
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                    {menu.title || "Executive Banquet Event Order"}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 italic">
                    {menu.description}
                  </p>
                </div>

                <div className="text-right shrink-0 bg-slate-800/60 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Document No.</p>
                  <p className="text-lg font-black text-emerald-400 tracking-wider">{beoNumber}</p>
                  <p className="text-[9px] text-slate-500 uppercase mt-1">Status: Confirmed / In Production</p>
                </div>
              </div>

              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-800/40 rounded-2xl border border-white/5 text-xs">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Event Type</label>
                  <span className="font-bold text-white uppercase">{menu.eventType || "Banquet"}</span>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Guaranteed Covers</label>
                  <span className="font-black text-emerald-400 text-sm">{covers} Pax</span>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Function Room</label>
                  <input
                    type="text"
                    value={roomLocation}
                    onChange={(e) => setRoomLocation(e.target.value)}
                    className="bg-transparent border-none text-slate-200 font-medium p-0 focus:ring-0 focus:text-white w-full"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Event Date & Service</label>
                  <div className="flex gap-1 text-slate-200">
                    <span>{eventDate}</span> • <span>{serviceTime}</span>
                  </div>
                </div>
              </div>

              {/* Section 1: Executive Menu Breakdown */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="text-emerald-400 text-sm">🍽️</span>
                  <h4 className="text-xs font-black uppercase text-white tracking-[0.2em]">
                    Section 1 • Executive Menu Breakdown
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Starters */}
                  <div className="bg-slate-800/30 p-5 rounded-2xl border border-white/5 space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest border-b border-white/5 pb-2">
                      Appetizers & Starters ({appetizers.length})
                    </h5>
                    {appetizers.map((item, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{item.dish}</span>
                          <span className="text-emerald-400">R{item.price}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 italic leading-relaxed">{item.notes}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mains */}
                  <div className="bg-slate-800/30 p-5 rounded-2xl border border-white/5 space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest border-b border-white/5 pb-2">
                      Main Courses ({mains.length})
                    </h5>
                    {mains.map((item, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{item.dish}</span>
                          <span className="text-emerald-400">R{item.price}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 italic leading-relaxed">{item.notes}</p>
                      </div>
                    ))}
                  </div>

                  {/* Desserts */}
                  <div className="bg-slate-800/30 p-5 rounded-2xl border border-white/5 space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest border-b border-white/5 pb-2">
                      Desserts & Pastry ({desserts.length})
                    </h5>
                    {desserts.map((item, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{item.dish}</span>
                          <span className="text-emerald-400">R{item.price}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 italic leading-relaxed">{item.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2: Statutory Allergen Matrix Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 text-sm">⚠️</span>
                    <h4 className="text-xs font-black uppercase text-white tracking-[0.2em]">
                      Section 2 • Statutory Allergen & Dietary Matrix
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Mandatory Hotel Food Safety Control
                  </span>
                </div>

                <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-950/60">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-800/70 border-b border-white/10 text-[9px] font-black uppercase text-slate-300 tracking-wider">
                        <th className="p-3.5">Dish / Course</th>
                        <th className="p-3.5 text-center">Gluten</th>
                        <th className="p-3.5 text-center">Dairy</th>
                        <th className="p-3.5 text-center">Nuts</th>
                        <th className="p-3.5 text-center">Eggs</th>
                        <th className="p-3.5 text-center">Shellfish</th>
                        <th className="p-3.5 text-center">Fish</th>
                        <th className="p-3.5 text-center">Soy</th>
                        <th className="p-3.5">Dietary Suitability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[11px]">
                      {matrix.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3.5 font-bold text-white whitespace-nowrap">
                            {row.dish}
                          </td>
                          <td className="p-3.5 text-center">
                            {row.gluten ? <span className="text-amber-400 font-black">YES</span> : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="p-3.5 text-center">
                            {row.dairy ? <span className="text-amber-400 font-black">YES</span> : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="p-3.5 text-center">
                            {row.nuts ? <span className="text-red-400 font-black">YES</span> : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="p-3.5 text-center">
                            {row.eggs ? <span className="text-amber-400 font-black">YES</span> : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="p-3.5 text-center">
                            {row.shellfish ? <span className="text-red-400 font-black">YES</span> : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="p-3.5 text-center">
                            {row.fish ? <span className="text-amber-400 font-black">YES</span> : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="p-3.5 text-center">
                            {row.soy ? <span className="text-amber-400 font-black">YES</span> : <span className="text-slate-600">--</span>}
                          </td>
                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1">
                              {(row.dietary && row.dietary.length > 0) ? (
                                row.dietary.map((d, di) => (
                                  <span key={di} className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                                    {d}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-500 text-[10px] italic">Standard Banquet</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Costing & Financial Metrics */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="text-emerald-400 text-sm">💰</span>
                  <h4 className="text-xs font-black uppercase text-white tracking-[0.2em]">
                    Section 3 • Hotel Costing & Financial Summary
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black uppercase text-slate-400">Total Covers</p>
                    <h5 className="text-2xl font-black text-white mt-1">{covers}</h5>
                  </div>
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black uppercase text-slate-400">Target Selling Price / Pax</p>
                    <h5 className="text-2xl font-black text-emerald-400 mt-1">R {totalSellingPricePerHead}</h5>
                  </div>
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black uppercase text-slate-400">Food Cost / Pax</p>
                    <h5 className="text-2xl font-black text-slate-300 mt-1">R {totalCostPerHead}</h5>
                  </div>
                  <div className="bg-emerald-600/20 p-4 rounded-2xl border border-emerald-500/30">
                    <p className="text-[9px] font-black uppercase text-emerald-300">Total BEO Billing (ZAR)</p>
                    <h5 className="text-2xl font-black text-white mt-1">R {totalEventValue.toLocaleString()}</h5>
                  </div>
                </div>
              </div>

              {/* Section 4: Scaled Hotel Shopping List & Supplies */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="text-emerald-400 text-sm">📦</span>
                  <h4 className="text-xs font-black uppercase text-white tracking-[0.2em]">
                    Section 4 • Bulk Hotel Supply & Procurement List
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {(menu.shoppingList || []).slice(0, 8).map((item: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-800/30 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{item.name || item.item}</p>
                        <p className="text-[10px] text-slate-400">{item.linkedDish ? `For: ${item.linkedDish}` : 'Kitchen stock'}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-400">{item.quantity} {item.unit}</span>
                        {item.unitPrice && <p className="text-[9px] text-slate-500">@ R{item.unitPrice}/{item.unit}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Kitchen Service & Mise En Place Schedule */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="text-emerald-400 text-sm">⏱️</span>
                  <h4 className="text-xs font-black uppercase text-white tracking-[0.2em]">
                    Section 5 • Kitchen Mise En Place & Service Directives
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                  <div className="bg-slate-800/30 p-5 rounded-2xl border border-white/5 space-y-3">
                    <h6 className="font-black uppercase text-[10px] text-emerald-400 tracking-wider">Mise En Place Timeline</h6>
                    <ul className="space-y-2">
                      {(menu.miseEnPlace || []).map((step: string, si: number) => (
                        <li key={si} className="flex gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-800/30 p-5 rounded-2xl border border-white/5 space-y-3">
                    <h6 className="font-black uppercase text-[10px] text-emerald-400 tracking-wider">Service Logistics & Staffing</h6>
                    <ul className="space-y-2">
                      {(menu.deliveryLogistics || []).map((log: string, li: number) => (
                        <li key={li} className="flex gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{log}</span>
                        </li>
                      ))}
                      {(menu.serviceNotes || []).map((note: string, ni: number) => (
                        <li key={`note-${ni}`} className="flex gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Statutory Sign-off Block */}
              <div className="border-t border-white/10 pt-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-400">
                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Executive Chef Sign-Off</p>
                  <div className="border-b border-white/20 pb-1 font-mono text-slate-300">
                    Chef de Cuisine / Exec Chef
                  </div>
                  <p className="text-[9px] text-slate-500">Date & Verification Stamp</p>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Banquet Operations Director</p>
                  <div className="border-b border-white/20 pb-1 font-mono text-slate-300">
                    Food & Beverage Manager
                  </div>
                  <p className="text-[9px] text-slate-500">Service Line & Staff Clearance</p>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Client Host Acceptance</p>
                  <div className="border-b border-white/20 pb-1 font-mono text-slate-300">
                    Client Representative
                  </div>
                  <p className="text-[9px] text-slate-500">Menu & Dietary Confirmation</p>
                </div>
              </div>

            </div>
          </div>

          {/* Footer controls */}
          <div className="p-6 border-t border-white/10 bg-slate-900/40 flex justify-between items-center text-xs text-slate-400">
            <span className="font-medium">
              Generated with CaterPro AI • Hotel BEO Standard Edition
            </span>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase text-xs tracking-wider transition-all"
              style={{ clipPath: OCTAGON_CLIP }}
            >
              Download PDF Document
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BanquetEventOrderModal;
