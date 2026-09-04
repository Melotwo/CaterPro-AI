import { Menu } from '../types';

export const DEFAULT_PROPOSAL: Menu = {
  title: "Mediterranean Keto Cocktail Soirée",
  menuTitle: "Mediterranean Keto Cocktail Soirée",
  description: "An elegant, low-carb Mediterranean menu designed for high-end cocktail service, focusing on healthy fats, premium proteins, and fresh herbs.",
  guestCount: 50,
  covers: 50,
  eventType: "Cocktail Party",
  eventDate: "2025-12-27",
  roomLocation: "Garden Terrace & Sunset Pavilion",
  beoNumber: "BEO-2025-8842",
  heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
  manualPerHead: 450,
  manualTotal: 22500,
  logistics: {
    deliveryFee: 1200
  },
  menu: [
    {
      dish: "Prosciutto-wrapped Asparagus with Lemon-Infused Olive Oil",
      notes: "Crisp blanched asparagus spears wrapped in aged Italian prosciutto, drizzled with cold-pressed olive oil.",
      cat: "Appetizers",
      price: 75,
      cost: 24,
      dietary: ["Keto", "Gluten-Free", "Dairy-Free"]
    },
    {
      dish: "Lamb Kofta Bites with Cucumber-Dill Tzatziki",
      notes: "Spiced Karoo ground lamb with fresh mint, garlic, and rich Greek yoghurt tzatziki sauce.",
      cat: "Appetizers",
      price: 85,
      cost: 28,
      dietary: ["Keto", "Gluten-Free", "Halal"]
    },
    {
      dish: "Whipped Feta and Kalamata Olive Tapenade on Cucumber Rounds",
      notes: "Creamy feta cheese whip paired with briny olive relish on crisp English cucumber slices.",
      cat: "Appetizers",
      price: 65,
      cost: 18,
      dietary: ["Keto", "Vegetarian", "Gluten-Free"]
    },
    {
      dish: "Za'atar Crusted Salmon Fillets with Gremolata",
      notes: "Pan-roasted Atlantic salmon portions coated with Middle Eastern za'atar spice and citrus herb gremolata.",
      cat: "Main Courses",
      price: 165,
      cost: 58,
      dietary: ["Keto", "Gluten-Free", "Pescatarian"]
    },
    {
      dish: "Herb-Rubbed Grilled Chicken Thighs with Garlic Toum",
      notes: "Free-range chicken thighs marinated in oregano, lemon, and garlic, served with fluffy Lebanese toum.",
      cat: "Main Courses",
      price: 110,
      cost: 36,
      dietary: ["Keto", "Gluten-Free", "Dairy-Free", "Halal"]
    },
    {
      dish: "Mediterranean Beef Skewers with Chimichurri",
      notes: "Charcoal-grilled prime beef tenderloin skewers drizzled with vibrant parsley-oregano chimichurri.",
      cat: "Main Courses",
      price: 135,
      cost: 48,
      dietary: ["Keto", "Gluten-Free", "Dairy-Free"]
    },
    {
      dish: "Mascarpone & Toasted Walnut Stuffed Strawberries",
      notes: "Fresh Cape strawberries filled with lightly sweetened mascarpone cream and crushed golden walnuts.",
      cat: "Desserts",
      price: 55,
      cost: 19,
      dietary: ["Keto", "Vegetarian", "Gluten-Free"]
    },
    {
      dish: "Sugar-Free Dark Chocolate Avocado Mousse Shooters",
      notes: "Rich 85% cocoa mousse whipped with ripe Haas avocados and unsweetened vanilla cream.",
      cat: "Desserts",
      price: 60,
      cost: 20,
      dietary: ["Keto", "Vegan", "Gluten-Free", "Dairy-Free"]
    }
  ],
  sideDishes: [
    "Grilled Halloumi and Shaved Zucchini Ribbon Salad with Fresh Mint & Lemon Vinaigrette",
    "Roasted Cauliflower Florets with Creamy Sesame Tahini, Pomegranate & Toasted Pine Nuts"
  ],
  dietaryNotes: [
    "Strictly Ketogenic: Under 12g net carbohydrates per guest serving across all courses.",
    "100% Grain-Free & Certified Gluten-Free preparation environment.",
    "Nut-aware service protocol: Walnuts and pine nuts prepared in isolated prep stations.",
    "Diabetic-friendly: Zero refined sugar, honey, or high-glycemic sweeteners."
  ],
  beveragePairings: [
    {
      dish: "Prosciutto-wrapped Asparagus",
      pairing: "Steenberg 1682 Brut Chardonnay Cap Classique (Crisp mineral acidity cuts through prosciutto richness)"
    },
    {
      dish: "Za'atar Crusted Salmon",
      pairing: "Springfield Estate Life from Stone Sauvignon Blanc (Flinty lemon notes complement za'atar herbs)"
    },
    {
      dish: "Lamb Kofta & Beef Skewers",
      pairing: "Kanonkop Kadette Cabernet Sauvignon / Pinotage blend (Full-bodied South African red with berry notes)"
    },
    {
      dish: "Cocktail Special",
      pairing: "Keto Cucumber-Mint Gin Spritz with Sugar-Free Indian Tonic and Fresh Lime"
    }
  ],
  miseEnPlace: [
    "Marinate Karoo lamb with roasted cumin, coriander seeds, garlic, and sea salt 24 hours prior.",
    "Prepare cucumber-dill tzatziki and Lebanese garlic toum 12 hours prior to allow flavors to meld.",
    "Blanch asparagus spears in salted boiling water for 90 seconds, shock in ice bath, and wrap in prosciutto.",
    "Portion Atlantic salmon into 120g cocktail loins; rub skin-side with za'atar spice blend.",
    "Hull fresh strawberries and pipe vanilla mascarpone filling 3 hours prior to guest arrival; keep chilled at 3°C."
  ],
  serviceNotes: [
    "Passed tray service with butler-style circulating platters for appetizers during the initial 90 minutes.",
    "Stationary display with heat lamps and live carving service for beef skewers and grilled chicken thighs.",
    "Tiered black slate boards accented with micro-greens and fresh citrus quarters for main proteins.",
    "White-glove beverage service with continuous Cap Classique and sparkling spring water replenishment."
  ],
  deliveryLogistics: [
    "Refrigerated transport vehicle maintained strictly between 2°C and 4°C throughout transit.",
    "On-site arrival 90 minutes prior to guest reception for kitchen station setup and equipment warming.",
    "Zoned drop-off within Cape Town Atlantic Seaboard / City Bowl zone.",
    "Post-service breakdown, clearing, and eco-friendly organic waste compost bin removal included."
  ],
  shoppingList: [
    {
      item: "Prosciutto di Parma (Aged)",
      supplier: "Woolworths",
      category: "Charcuterie",
      quantity: "1.2 kg",
      estCost: "R 450.00",
      notes: "Thinly sliced, imported"
    },
    {
      item: "Fresh Atlantic Salmon Fillets",
      supplier: "Woolworths",
      category: "Seafood",
      quantity: "3.5 kg",
      estCost: "R 1,200.00",
      notes: "Skin on, pin-boned"
    },
    {
      item: "Imported Greek Halloumi & Feta",
      supplier: "Woolworths",
      category: "Dairy",
      quantity: "1.5 kg",
      estCost: "R 320.00",
      notes: "Authentic brine-packed"
    },
    {
      item: "Prime Karoo Lamb Mince (80/20)",
      supplier: "Local Butcher",
      category: "Meat",
      quantity: "2.5 kg",
      estCost: "R 380.00",
      notes: "Coarse double grind"
    },
    {
      item: "A-Grade Beef Tenderloin Skewers",
      supplier: "Local Butcher",
      category: "Meat",
      quantity: "3.0 kg",
      estCost: "R 540.00",
      notes: "Pre-skewered 40g bites"
    },
    {
      item: "Free-Range Deboned Chicken Thighs",
      supplier: "Local Butcher",
      category: "Poultry",
      quantity: "3.0 kg",
      estCost: "R 310.00",
      notes: "Skin-on"
    },
    {
      item: "Cold Pressed Extra Virgin Olive Oil",
      supplier: "Checkers",
      category: "Pantry",
      quantity: "2.0 L",
      estCost: "R 220.00",
      notes: "Estate bottled"
    },
    {
      item: "Fresh Asparagus & Baby Zucchini",
      supplier: "Checkers",
      category: "Produce",
      quantity: "4.0 kg",
      estCost: "R 280.00",
      notes: "Farm fresh bunches"
    },
    {
      item: "Tahini, Za'atar & Toasted Pine Nuts",
      supplier: "Checkers",
      category: "Dry Goods",
      quantity: "1.0 kg",
      estCost: "R 190.00",
      notes: "Lebanese grade"
    },
    {
      item: "Strawberries, Lemons & Greek Yoghurt",
      supplier: "Checkers",
      category: "Produce / Dairy",
      quantity: "3.0 kg",
      estCost: "R 180.00",
      notes: "Grade 1 berries"
    }
  ],
  allergenMatrix: [
    { dish: "Prosciutto-wrapped Asparagus", gluten: false, dairy: false, nuts: false, eggs: false, shellfish: false, fish: false, soy: false, dietary: ["Keto", "Gluten-Free", "Dairy-Free"] },
    { dish: "Lamb Kofta Bites", gluten: false, dairy: true, nuts: false, eggs: false, shellfish: false, fish: false, soy: false, dietary: ["Keto", "Gluten-Free", "Halal"] },
    { dish: "Whipped Feta on Cucumber", gluten: false, dairy: true, nuts: false, eggs: false, shellfish: false, fish: false, soy: false, dietary: ["Keto", "Vegetarian", "Gluten-Free"] },
    { dish: "Za'atar Crusted Salmon", gluten: false, dairy: false, nuts: false, eggs: false, shellfish: false, fish: true, soy: false, dietary: ["Keto", "Gluten-Free", "Pescatarian"] },
    { dish: "Herb-Rubbed Grilled Chicken", gluten: false, dairy: false, nuts: false, eggs: false, shellfish: false, fish: false, soy: false, dietary: ["Keto", "Gluten-Free", "Dairy-Free", "Halal"] },
    { dish: "Mediterranean Beef Skewers", gluten: false, dairy: false, nuts: false, eggs: false, shellfish: false, fish: false, soy: false, dietary: ["Keto", "Gluten-Free", "Dairy-Free"] },
    { dish: "Mascarpone Stuffed Strawberries", gluten: false, dairy: true, nuts: true, eggs: false, shellfish: false, fish: false, soy: false, dietary: ["Keto", "Vegetarian", "Gluten-Free"] },
    { dish: "Dark Chocolate Avocado Mousse", gluten: false, dairy: false, nuts: false, eggs: false, shellfish: false, fish: false, soy: false, dietary: ["Keto", "Vegan", "Gluten-Free", "Dairy-Free"] }
  ]
};
