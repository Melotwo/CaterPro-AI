import { Menu } from '../types';

export const DEFAULT_PROPOSAL: Menu = {
  title: "Metropolitan Grand Hotel — Annual Gala Banquet",
  menuTitle: "Metropolitan Grand Hotel — Annual Gala Banquet",
  description: "Executive four-course plated banquet engineered for high-volume service, featuring premium Karoo cuts, sustainable coastal seafood, and Escoffier pastry finishes.",
  guestCount: 120,
  covers: 120,
  eventType: "Hotel Banquet",
  eventDate: "2026-10-18",
  roomLocation: "Grand Ballroom & Banqueting Deck • Tables 1-12",
  beoNumber: "BEO-2026-HOTEL-784",
  heroImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85",
  manualPerHead: 520,
  manualTotal: 64800,
  logistics: {
    deliveryFee: 2400
  },
  menu: [
    {
      dish: "Roasted Heritage Beetroot & Goat's Cheese Carpaccio",
      notes: "Thinly shaved golden and ruby beets, whipped chevin goat cheese, candied walnuts, baby wild rocket, and aged fynbos honey reduction.",
      cat: "Appetizers",
      price: 85,
      cost: 22,
      dietary: ["Vegetarian", "Gluten-Free"]
    },
    {
      dish: "Pan-Seared Cape West Coast Scallops with Cauliflower Silk",
      notes: "Sustainably caught scallops, smooth cauliflower velouté, chorizo crumb oil, and fresh pea shoots.",
      cat: "Appetizers",
      price: 110,
      cost: 34,
      dietary: ["Gluten-Free", "Pescatarian"]
    },
    {
      dish: "Smoked Karoo Springbok Loin Carpaccio",
      notes: "Cold-smoked venison loin, shaved Parmigiano-Reggiano, caper berries, and cold-pressed extra virgin olive oil.",
      cat: "Appetizers",
      price: 95,
      cost: 28,
      dietary: ["Gluten-Free", "Halal"]
    },
    {
      dish: "Herb-Crusted Karoo Lamb Cutlets with Pinotage Jus",
      notes: "Rosemary and garlic crust, fondant potatoes, butter-glazed baby rainbow carrots, and rich Pinotage wine reduction.",
      cat: "Main Courses",
      price: 185,
      cost: 56,
      dietary: ["Halal", "Gluten-Free"]
    },
    {
      dish: "Pan-Roasted Wild Kingklip with Lemon Beurre Blanc",
      notes: "Line-caught Cape kingklip fillet, crushed new potatoes with fresh dill, sautéed sea greens, and citrus emulsion.",
      cat: "Main Courses",
      price: 165,
      cost: 48,
      dietary: ["Gluten-Free", "Pescatarian"]
    },
    {
      dish: "Wild Forest Mushroom & Truffle Risotto (Vegetarian Main)",
      notes: "Arborio rice slowly simmered with porcini stock, sautéed wild mushrooms, white truffle oil, and shaved aged Pecorino.",
      cat: "Main Courses",
      price: 130,
      cost: 32,
      dietary: ["Vegetarian", "Gluten-Free"]
    },
    {
      dish: "Amarula & Dark Belgian Chocolate Silk Torte",
      notes: "70% single-origin Belgian dark chocolate ganache infused with Cape Amarula cream, pistachio crumb, and raspberry coulis.",
      cat: "Desserts",
      price: 75,
      cost: 20,
      dietary: ["Vegetarian"]
    },
    {
      dish: "Cape Citrus Tart with Burnt Meringue & Fynbos Sorbet",
      notes: "Tangy lemon and blood orange curd, shortbread crust, torched Italian meringue, and indigenous fynbos herb sorbet.",
      cat: "Desserts",
      price: 65,
      cost: 16,
      dietary: ["Vegetarian"]
    }
  ],
  sideDishes: [
    "Butter-Glazed Seasonal Baby Vegetables (Rainbow carrots, tenderstem broccoli, sugarsnap peas)",
    "Dauphinoise Potatoes Layered with Heavy Cream, Roasted Garlic & Fresh Thyme",
    "Artisan Sourdough Rolls with Whipped Salted Estate Butter & Roasted Garlic Tapenade"
  ],
  dietaryNotes: [
    "Strict Halal meat sourcing certified by NIHT / MJC on all Karoo lamb and beef cuts.",
    "Certified Gluten-Free stations implemented for designated VIP guests with dedicated utensils.",
    "Nut-aware kitchen isolation: Candied walnuts and pistachio preparations handled in pastry station.",
    "SANS 10330 HACCP verified: Seafood and poultry stored in separate 2°C walk-in chillers."
  ],
  beveragePairings: [
    {
      dish: "Beetroot Carpaccio & Scallops",
      pairing: "Krone Night Nectar Blanc de Blancs Cap Classique (Crisp effervescence with minerality)"
    },
    {
      dish: "Pan-Roasted Wild Kingklip",
      pairing: "Hamilton Russell Vineyards Chardonnay (Elegant oak, pear, and citrus backbone)"
    },
    {
      dish: "Herb-Crusted Karoo Lamb",
      pairing: "Meerlust Rubicon Cabernet Sauvignon / Merlot Blend (Velvety tannins and dark berry notes)"
    },
    {
      dish: "Dark Chocolate Amarula Torte",
      pairing: "Klein Constantia Vin de Constance (Legendary Cape dessert wine with dried apricot and spice)"
    }
  ],
  miseEnPlace: [
    "T-48H: Receive certified Karoo lamb racks and portion to 180g cutlets; vacuum-seal with rosemary and garlic.",
    "T-24H: Prepare Pinotage veal stock reduction; simmer for 18 hours until glossy nappe consistency.",
    "T-12H: Par-bake Dauphinoise potatoes in combi steam oven at 160°C; press and chill for clean banquet portioning.",
    "T-6H: Shell and dry West Coast scallops on paper towel; keep under refrigeration at 2°C.",
    "T-3H: Whip chevin goat cheese mousse and pipe into pastry piping bags; reserve cold.",
    "T-1H: Pre-warm hot banquet holding cabinets to 72°C in plating line for synchronized service."
  ],
  serviceNotes: [
    "18:30 — VIP Reception: Welcome Cap Classique service and tray-passed appetizers.",
    "19:30 — Guests seated in Grand Ballroom: Sourdough and compound butters set on tables.",
    "19:45 — Synchronized cover service for first course (tables 1 to 12 served within 6 minutes).",
    "20:30 — Main course service with heated cloches: Dietary pre-orders flagged with gold table markers.",
    "21:30 — Dessert & Digestif service: Continuous coffee and tea service until close."
  ],
  deliveryLogistics: [
    "Internal Hotel Service Corridor routes reserved for banquet trolleys from Main Production Kitchen.",
    "Refrigerated holding cabinet in Grand Ballroom service pantry maintained strictly at 3°C.",
    "Banquet Captain and 8 dedicated waitrons assigned per 3 tables (1:15 service ratio).",
    "Post-banquet china, silver, and glassware breakdown directed to primary flight dishwashing suite."
  ],
  shoppingList: [
    {
      item: "Karoo Lamb Racks (Export Quality)",
      supplier: "Wholesale Butchery",
      category: "Meat & Poultry",
      quantity: "24.0 kg",
      estCost: "R 7,200.00",
      notes: "French trimmed, vacuum packed"
    },
    {
      item: "Wild Cape Kingklip Fillets",
      supplier: "Ocean Catch Seafood Merchant",
      category: "Seafood",
      quantity: "22.0 kg",
      estCost: "R 5,500.00",
      notes: "Skin-off, pin-boned, day-boat fresh"
    },
    {
      item: "Cape West Coast Scallops",
      supplier: "Ocean Catch Seafood Merchant",
      category: "Seafood",
      quantity: "6.0 kg",
      estCost: "R 2,400.00",
      notes: "U10 dry pack, roe-off"
    },
    {
      item: "Fresh Heritage Golden & Ruby Beets",
      supplier: "Fresh Produce Market",
      category: "Fresh Produce",
      quantity: "15.0 kg",
      estCost: "R 450.00",
      notes: "Uniform size for mandoline slicing"
    },
    {
      item: "Tenderstem Broccoli & Baby Carrots",
      supplier: "Fresh Produce Market",
      category: "Fresh Produce",
      quantity: "18.0 kg",
      estCost: "R 720.00",
      notes: "Pre-trimmed, grade 1"
    },
    {
      item: "Chevin Goat Cheese & Aged Pecorino",
      supplier: "Cold-Chain Dairy & Cheese",
      category: "Dairy & Cheese",
      quantity: "8.0 kg",
      estCost: "R 1,600.00",
      notes: "Local artisan dairy"
    },
    {
      item: "Heavy Cream & Salted Estate Butter",
      supplier: "Cold-Chain Dairy & Cheese",
      category: "Dairy & Cheese",
      quantity: "14.0 L/kg",
      estCost: "R 1,120.00",
      notes: "38% whipping cream"
    },
    {
      item: "Belgian Dark Chocolate (70% Callebaut)",
      supplier: "Dry Goods & Bakery Depot",
      category: "Pastry & Dry Goods",
      quantity: "8.0 kg",
      estCost: "R 1,440.00",
      notes: "Callets for smooth ganache"
    },
    {
      item: "Arborio Rice & White Truffle Oil",
      supplier: "Dry Goods & Bakery Depot",
      category: "Pantry & Spices",
      quantity: "6.0 kg",
      estCost: "R 680.00",
      notes: "Italian export grade"
    }
  ],
  allergenMatrix: [
    { dish: "Heritage Beetroot & Goat's Cheese", gluten: false, dairy: true, nuts: true, eggs: false, shellfish: false, fish: false, soy: false, dietary: ["Vegetarian", "Gluten-Free"], notes: "Chevin goat cheese, walnuts" },
    { dish: "Pan-Seared Cape Scallops", gluten: false, dairy: true, nuts: false, eggs: false, shellfish: true, fish: false, soy: false, dietary: ["Gluten-Free", "Pescatarian"], notes: "Shellfish, dairy in puree" },
    { dish: "Karoo Springbok Loin Carpaccio", gluten: false, dairy: true, nuts: false, eggs: false, shellfish: false, fish: false, soy: false, dietary: ["Gluten-Free", "Halal"], notes: "Parmigiano-Reggiano flakes" },
    { dish: "Herb-Crusted Karoo Lamb Cutlets", gluten: false, dairy: true, nuts: false, eggs: false, shellfish: false, fish: false, soy: false, dietary: ["Halal", "Gluten-Free"], notes: "Gluten-free herb crust, butter in jus" },
    { dish: "Pan-Roasted Wild Kingklip", gluten: false, dairy: true, nuts: false, eggs: false, shellfish: false, fish: true, soy: false, dietary: ["Gluten-Free", "Pescatarian"], notes: "Fish, lemon beurre blanc butter" },
    { dish: "Wild Forest Mushroom Risotto", gluten: false, dairy: true, nuts: false, eggs: false, shellfish: false, fish: false, soy: false, dietary: ["Vegetarian", "Gluten-Free"], notes: "Pecorino cheese" },
    { dish: "Amarula & Belgian Chocolate Torte", gluten: true, dairy: true, nuts: true, eggs: true, shellfish: false, fish: false, soy: true, dietary: ["Vegetarian"], notes: "Cream, liqueur, pistachio, eggs" },
    { dish: "Cape Citrus Tart & Fynbos Sorbet", gluten: true, dairy: true, nuts: false, eggs: true, shellfish: false, fish: false, soy: false, dietary: ["Vegetarian"], notes: "Shortbread crust, egg meringue" }
  ]
};
