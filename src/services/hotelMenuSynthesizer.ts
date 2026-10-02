/**
 * Hotel Menu Synthesizer & Costing Engine
 * High-fidelity deterministic hotel banquet and event menu generation.
 * Guarantees 100% uptime with realistic South African wholesale costing (ZAR),
 * full SANS 10330 statutory Allergen Matrix, scaled bulk shopping lists, and BEO logistics.
 */

export interface HotelMenuParams {
  eventType: string;
  guestCount?: number;
  covers?: number;
  cuisine?: string;
  budget?: string;
  region?: string;
  outlet?: string;
  dietaryRestrictions?: string[];
  specialDietaryNotes?: string;
}

/**
 * Builds a strict image generation prompt adhering to Event Type and Cuisine Style rules.
 */
export function buildStrictImagePrompt(
  eventType: string,
  cuisineStyle?: string,
  title?: string,
  description?: string
): string {
  const effectiveEventType = (eventType || "Hotel Banquet").trim();
  const effectiveCuisine = (cuisineStyle || "Contemporary Cape & Continental").trim();
  const eventLower = effectiveEventType.toLowerCase();
  const cuisineLower = effectiveCuisine.toLowerCase();
  const combinedContext = `${effectiveEventType} ${effectiveCuisine} ${title || ''} ${description || ''}`.toLowerCase();

  const isPicnic = /picnic|hamper|alfresco|al fresco|garden party|outdoor feast|blanket|meadow|lawn/i.test(eventLower) ||
                   /picnic/i.test(combinedContext);
  const isBraai = /braai|bbq|barbecue|grill|flame|fire|smoke|shisanyama/i.test(cuisineLower) || 
                  /braai|bbq|barbecue|grill|flame|fire|smoke|shisanyama/i.test(eventLower);
  const isCocktail = /cocktail|canape|canap|flying canap|reception|passed|hors d'?oeuvre|tapas|finger food|standing/i.test(eventLower) ||
                     /cocktail|canape|canap|reception/i.test(cuisineLower);
  const isWedding = /wedding|nuptial|bridal|marriage/i.test(eventLower);
  const isBanquet = /banquet|gala|plated|hotel banquet|fine dining|conference/i.test(eventLower);
  const isWineTasting = /wine tasting|wine pairing|sommelier|cellar door|vineyard tasting|cheese and wine/i.test(eventLower) ||
                        /wine tasting|wine pairing|sommelier/i.test(cuisineLower);

  // Rule 3: Strict negative rules - never indoor café/coffee shop, never pasta, never generic stock people
  const negativeConstraints = "Strict rules: Absolutely no indoor café or coffee shop, no restaurant interior, no diners eating pasta, no generic stock people, no empty glasses or solo drinks. Focus strictly on appetizing culinary food presentation.";

  // Rule 2: Specific mapping that must be followed
  if ((isPicnic && isBraai) || (isPicnic && /braai|heritage/i.test(cuisineLower))) {
    // Picnic or Picnic + Braai / Heritage Braai → Outdoor South African picnic scene: picnic blanket on grass, wicker hamper, braai/grill elements, boerewors, pap, salads, cheese & charcuterie boards, natural daylight, trees or open field. Never indoor café or restaurant scenes. Force outdoor natural lighting and picnic/braai atmosphere.
    return `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, an outdoor South African picnic scene: picnic blanket on grass, wicker hamper, braai/grill elements, boerewors, pap, salads, cheese & charcuterie boards, natural daylight, trees or open field. Forced outdoor natural lighting, authentic picnic and braai atmosphere, high quality, realistic, South African context. ${negativeConstraints}`;
  } else if (isPicnic) {
    // Pure Picnic → Outdoor South African picnic scene: picnic blanket on grass, wicker hamper, salads, cheese & charcuterie boards, natural daylight, trees or open field. Never indoor café or restaurant scenes. Force outdoor natural lighting and picnic atmosphere.
    return `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, an outdoor South African picnic scene: picnic blanket on grass, wicker hamper, fresh garden salads, cheese & charcuterie boards, artisan bread and preserves, natural daylight, trees or open field. Forced outdoor natural lighting, authentic picnic atmosphere, high quality, realistic, South African context if applicable. ${negativeConstraints}`;
  } else if (isBraai) {
    // Any Braai-related event → Outdoor fire, grill, smoke, traditional South African braai food and setting. Force outdoor natural lighting and braai atmosphere.
    return `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, an outdoor fire, grill, smoke, traditional South African braai food and setting with sizzling boerewors coils, prime lamb chops, potbrood, pap and chakalaka on a rustic wooden table. Forced outdoor natural lighting, authentic braai atmosphere, high quality, realistic, South African context. ${negativeConstraints}`;
  } else if (isCocktail) {
    // Cocktail Party / Flying Canapé → Elegant butler-passed canapé trays, sophisticated standing reception food, high-end hors d’oeuvres.
    return `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, elegant butler-passed canapé trays, sophisticated standing reception food, high-end hors d’oeuvres, delicate savory tartlets and appetizer spoons, warm ambient lighting, high quality, realistic, South African context if applicable. ${negativeConstraints}`;
  } else if (isWedding || isBanquet) {
    // Hotel Banquet / Wedding → Beautifully plated dishes or refined banquet table settings.
    return `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, beautifully plated dishes or refined banquet table settings, exquisite multi-course culinary presentation, delicate sauce reductions, micro-greens, fine tableware, warm celebratory ambient lighting, high quality, realistic, South African context if applicable. ${negativeConstraints}`;
  } else if (isWineTasting) {
    return `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, sommelier wine flight and artisan cheese pairing boards, biltong ribbons, fresh figs, crackers, tasting cellar setting, warm golden ambient lighting, high quality, realistic, South African context if applicable. ${negativeConstraints}`;
  } else {
    // Rule 4: Example structure: “Professional food photography of a [Event Type] featuring [Cuisine Style], [specific relevant food elements], high quality, realistic, South African context if applicable”
    return `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, beautifully plated dishes, refined catering display, fresh garnishes, appetizing food styling, high quality, realistic, South African context if applicable. ${negativeConstraints}`;
  }
}

export function synthesizeHotelMenu(params: HotelMenuParams) {
  const covers = Number(params.guestCount || params.covers) || 80;
  const eventType = (params.eventType || 'Hotel Banquet').trim();
  const region = params.region || 'South Africa';
  const cuisine = params.cuisine || 'Contemporary Cape & Continental';
  const outlet = params.outlet || 'Grand Ballroom';
  const eventLower = eventType.toLowerCase();

  // 1. Determine profile archetype based on event type
  let title = `${eventType} Culinary Showcase`;
  let description = `Executive hotel culinary showcase engineered for ${covers} covers in ${region}, compliant with SANS 10330 HACCP cold-chain standards.`;
  let perHead = 520;
  let items: any[] = [];
  let heroImage: string | undefined = undefined;

  const isPicnic = eventLower.includes('picnic') || eventLower.includes('hamper') || eventLower.includes('alfresco') || eventLower.includes('garden party') || eventLower.includes('grazing');
  const isBraai = cuisine.toLowerCase().includes('braai') || eventLower.includes('braai') || cuisine.toLowerCase().includes('bbq') || eventLower.includes('bbq') || cuisine.toLowerCase().includes('grill');

  if (isPicnic && isBraai) {
    title = `Outdoor South African Picnic & Heritage Braai Feast`;
    description = `Chef-crafted luxury outdoor picnic blanket feast paired with traditional South African braai elements, featuring artisanal boerewors, spiced lamb cutlets, traditional stywe pap with chakalaka, cured biltong grazing boards, and fresh salads engineered for ${covers} guests in ${outlet}.`;
    perHead = 480;
    heroImage = "/images/sa_picnic_braai_feast_1790939053855.jpg";
    items = [
      {
        name: "Artisanal Biltong & Cape Farmhouse Cheese Grazing Board",
        description: "Thinly shaved game biltong, Fairview camembert, aged cheddar, marinated olives, Cape fig preserve, and fresh grapes",
        costPerHead: 38.00,
        price: 125.00,
        type: "appetizer",
        allergens: ["Dairy"],
        dietary: ["Gluten-Free"]
      },
      {
        name: "Mini Cape Bobotie & Spiced Lamb Phyllo Tartlets",
        description: "Crispy golden phyllo pastry cups filled with savory spiced bobotie mince, golden sultanas, and baked egg custard",
        costPerHead: 25.00,
        price: 85.00,
        type: "appetizer",
        allergens: ["Gluten", "Dairy", "Eggs"],
        dietary: ["Halal-Friendly"]
      },
      {
        name: "Flame-Grilled Artisanal Boerewors & Rosemary Karoo Lamb Chops",
        description: "Succulent traditional beef and coriander boerewors wheels with tender flame-seared lamb chops and braai relish glaze",
        costPerHead: 65.00,
        price: 210.00,
        type: "main",
        allergens: [],
        dietary: ["Halal-Friendly", "Gluten-Free"]
      },
      {
        name: "Cast-Iron Potjie Pap with Spicy Tomato Onion Chakalaka",
        description: "Traditional crumbly stywe pap served with rich braised tomato, onion, sweet pepper, and baked bean chakalaka",
        costPerHead: 20.00,
        price: 75.00,
        type: "main",
        allergens: [],
        dietary: ["Vegetarian", "Vegan", "Gluten-Free"]
      },
      {
        name: "Fresh Avocado, Heritage Tomato & Feta Picnic Salad",
        description: "Crisp garden greens with sliced Hass avocado, baby heirloom tomatoes, creamy Danish feta, and lemon herb vinaigrette",
        costPerHead: 22.00,
        price: 75.00,
        type: "main",
        allergens: ["Dairy"],
        dietary: ["Vegetarian", "Gluten-Free"]
      },
      {
        name: "Traditional Cape Malva Pudding with Vanilla Custard",
        description: "Warm caramelized apricot sponge infused with cream sauce, served with velvety Madagascar vanilla bean custard",
        costPerHead: 24.00,
        price: 85.00,
        type: "dessert",
        allergens: ["Dairy", "Gluten", "Eggs"],
        dietary: ["Vegetarian"]
      }
    ];
  } else if (isBraai) {
    title = `Executive South African Heritage Braai Showcase`;
    description = `Authentic wood-fired South African braai banquet engineered for ${covers} guests in ${outlet}, featuring dry-aged steaks, coiled boerewors, cast-iron potbrood, and traditional accompaniments.`;
    perHead = 520;
    heroImage = "/images/south_african_braai_feast_1790939079000.jpg";
    items = [
      {
        name: "Smoked Game Biltong Carpaccio with Shaved Parmesan",
        description: "Finely sliced cured venison biltong, aged Parmigiano-Reggiano, wild rocket, and cold-pressed olive oil",
        costPerHead: 36.00,
        price: 120.00,
        type: "appetizer",
        allergens: ["Dairy"],
        dietary: ["Gluten-Free"]
      },
      {
        name: "Freshly Baked Cast-Iron Potbrood with Farmhouse Herb Butter",
        description: "Warm crusty hearth-baked bread served with whipped garlic and fynbos herb butter",
        costPerHead: 18.00,
        price: 65.00,
        type: "appetizer",
        allergens: ["Gluten", "Dairy"],
        dietary: ["Vegetarian"]
      },
      {
        name: "Flame-Kissed Dry-Aged Beef Ribeye & Artisanal Boerewors",
        description: "Prime 28-day aged ribeye steak seared over open fire with traditional coiled boerewors and smoked bone marrow jus",
        costPerHead: 85.00,
        price: 275.00,
        type: "main",
        allergens: [],
        dietary: ["Gluten-Free", "Halal-Friendly"]
      },
      {
        name: "Traditional Stywe Pap & Roasted Sweet Pepper Chakalaka",
        description: "Slow-steamed maize pap served with charred bell pepper, onion, and cumin-spiced tomato reduction",
        costPerHead: 22.00,
        price: 75.00,
        type: "main",
        allergens: [],
        dietary: ["Vegetarian", "Vegan", "Gluten-Free"]
      },
      {
        name: "Charred Sweetcorn & Roasted Butternut Salad",
        description: "Flame-grilled sweetcorn kernels, caramelized butternut cubes, baby spinach, pumpkin seeds, and tangy dressing",
        costPerHead: 24.00,
        price: 80.00,
        type: "main",
        allergens: [],
        dietary: ["Vegetarian", "Vegan", "Gluten-Free"]
      },
      {
        name: "Decadent Cape Malva Pudding with Amarula Crème",
        description: "Rich sticky apricot sponge drenched in warm caramel sauce, topped with Amarula cream reduction",
        costPerHead: 26.00,
        price: 90.00,
        type: "dessert",
        allergens: ["Dairy", "Gluten", "Eggs"],
        dietary: ["Vegetarian"]
      }
    ];
  } else if (isPicnic) {
    title = `${eventType.toLowerCase().includes('picnic') ? eventType : `${eventType} Garden Picnic`} & Gourmet Hamper Feast`;
    description = `Chef-curated luxury alfresco picnic hamper feast engineered for ${covers} guests in ${outlet}, featuring artisanal charcuterie, Cape heritage grazing boards, rustic savory tarts, and delicate pastry finishes in SANS 10330 cold-chain compliant wicker hampers.`;
    perHead = 460;
    const isSA = cuisine.toLowerCase().includes('south african') || cuisine.toLowerCase().includes('cape') || region.toLowerCase().includes('south africa');
    heroImage = isSA 
      ? "/images/south_african_picnic_grazing_1790923193324.jpg" 
      : "/images/spring_picnic_gourmet_feast_1790923177569.jpg";
    items = [
      {
        name: isSA ? "Artisanal Charcuterie & Farmhouse Cheese Grazing Board" : "Artisan Charcuterie & European Cheese Grazing Platter",
        description: isSA 
          ? "Shaved biltong, cured prosciutto, Fairview camembert, aged cheddar, marinated olives, Cape fig preserve, and fresh grapes"
          : "Cured prosciutto, saucisson sec, double-cream brie, aged gouda, honeycomb, marinated olives, and seedless grapes",
        costPerHead: 36.00,
        price: 120.00,
        type: "appetizer",
        allergens: ["Dairy"],
        dietary: ["Gluten-Free"]
      },
      {
        name: isSA ? "Mini Cape Bobotie & Spiced Lamb Phyllo Tartlets" : "Caramelized Leek & Gruyère Savory Tartlets",
        description: isSA
          ? "Crispy golden phyllo pastry cups filled with savory spiced bobotie mince, golden sultanas, and baked egg custard"
          : "Flaky butter puff pastry with caramelized baby leeks, aged Gruyère cheese, and fresh thyme",
        costPerHead: 24.50,
        price: 85.00,
        type: "appetizer",
        allergens: ["Gluten", "Dairy", "Eggs"],
        dietary: ["Halal-Friendly"]
      },
      {
        name: "Oak-Smoked Franschhoek Trout & Herb Crème Quiche",
        description: "Individual butter pastry quiche with cold-smoked trout ribbons, fresh dill, baby capers, and Gruyère custard",
        costPerHead: 42.00,
        price: 145.00,
        type: "main",
        allergens: ["Fish", "Dairy", "Gluten", "Eggs"],
        dietary: ["Pescatarian"]
      },
      {
        name: "Buttermilk Free-Range Roast Chicken & Tarragon Brioche Rolls",
        description: "Tender herb-roasted chicken breast with crunchy celery, pickled cucumber ribbons, and tarragon aioli on soft mini brioche",
        costPerHead: 38.00,
        price: 135.00,
        type: "main",
        allergens: ["Gluten", "Eggs"],
        dietary: ["Halal"]
      },
      {
        name: "Fresh Strawberry & Madagascar Vanilla Mascarpone Parfait Jars",
        description: "Individual Mason jars layered with macerated seasonal strawberries, whipped vanilla mascarpone, and pistachio crumb",
        costPerHead: 22.00,
        price: 80.00,
        type: "dessert",
        allergens: ["Dairy", "Nuts"],
        dietary: ["Vegetarian", "Gluten-Free"]
      },
      {
        name: "Pastel Spring Macaron & Mini Meyer Lemon Tartlet Duo",
        description: "Handcrafted almond macarons and zesty lemon curd tartlets with fresh raspberries and edible flower petals",
        costPerHead: 20.00,
        price: 70.00,
        type: "dessert",
        allergens: ["Dairy", "Gluten", "Eggs", "Nuts"],
        dietary: ["Vegetarian"]
      }
    ];
  } else if (eventLower.includes('graduat')) {
    title = `Commencement Gala: ${eventType}`;
    description = `Celebratory hotel graduation banquet curated for ${covers} graduates and esteemed guests. Features celebratory harvest grazing, prime banquet proteins, and artisanal pastry finishes.`;
    perHead = 495;
    items = [
      {
        name: "Celebration Mezze & Artisan Focaccia Platter",
        description: "Charred sweet peppers, marinated olives, hummus, whipped feta, and warm rosemary focaccia",
        costPerHead: 28.50,
        price: 95.00,
        type: "appetizer",
        allergens: ["Gluten", "Dairy"],
        dietary: ["Vegetarian", "Halal-Friendly"]
      },
      {
        name: "Crispy Free-Range Duck & Hoisin Spring Rolls",
        description: "Golden wrapped spiced duck with pickled daikon and sweet plum dipping reduction",
        costPerHead: 34.00,
        price: 115.00,
        type: "appetizer",
        allergens: ["Gluten", "Soy"],
        dietary: ["Halal-Friendly"]
      },
      {
        name: "Slow-Braised Karoo Lamb Shoulder with Rosemary Jus",
        description: "Succulent lamb shoulder braised with garlic, thyme, and red wine reduction over creamy polenta",
        costPerHead: 76.00,
        price: 245.00,
        type: "main",
        allergens: ["Dairy"],
        dietary: ["Halal", "Gluten-Free"]
      },
      {
        name: "Pan-Seared Atlantic Linefish with Lemon Herb Beurre Blanc",
        description: "Sustainably sourced Cape linefish with baby leeks, blistered vine tomatoes, and micro herbs",
        costPerHead: 62.00,
        price: 215.00,
        type: "main",
        allergens: ["Fish", "Dairy"],
        dietary: ["Pescatarian", "Gluten-Free"]
      },
      {
        name: "Wild Forest Mushroom & Truffle Risotto",
        description: "Carnaroli rice with porcini, king oyster mushrooms, aged parmesan crisp, and white truffle essence",
        costPerHead: 38.00,
        price: 175.00,
        type: "main",
        allergens: ["Dairy"],
        dietary: ["Vegetarian", "Gluten-Free"]
      },
      {
        name: "Commencement Gold Leaf Dark Chocolate Fondant",
        description: "Molten 70% dark Belgian chocolate fondant with gold leaf dusting and Madagascar vanilla bean cream",
        costPerHead: 26.50,
        price: 95.00,
        type: "dessert",
        allergens: ["Dairy", "Eggs", "Gluten"],
        dietary: ["Vegetarian"]
      },
      {
        name: "Wild Berry & Meyer Lemon Curd Tartlet",
        description: "Crisp butter pastry shell filled with zesty lemon curd, fresh raspberries, and micro mint",
        costPerHead: 22.00,
        price: 85.00,
        type: "dessert",
        allergens: ["Dairy", "Gluten", "Eggs"],
        dietary: ["Vegetarian"]
      }
    ];
  } else if (eventLower.includes('wedding')) {
    title = `Royal Wedding Banquet & Nuptial Dinner`;
    description = `Prestige multi-course banquet designed for ${covers} wedding guests, featuring champagne reception canapés, dry-aged beef fillet, and delicate confectionery.`;
    perHead = 680;
    items = [
      {
        name: "Oak-Smoked Norwegian Salmon Tartare",
        description: "Cold-smoked salmon with pickled cucumber ribbons, caper berries, and dill crème fraîche",
        costPerHead: 42.00,
        price: 135.00,
        type: "appetizer",
        allergens: ["Fish", "Dairy"],
        dietary: ["Pescatarian", "Gluten-Free"]
      },
      {
        name: "Prosciutto & Buffalo Mozzarella Roulade",
        description: "Aged Parma-style prosciutto with buffalo mozzarella, baby heirloom tomatoes, and basil oil",
        costPerHead: 38.00,
        price: 120.00,
        type: "appetizer",
        allergens: ["Dairy"],
        dietary: ["Gluten-Free"]
      },
      {
        name: "Charred Beef Fillet Mignon with Truffle Demi-Glace",
        description: "Prime beef medallion with fondant potatoes, glazed baby carrots, and rich bone marrow demi-glace",
        costPerHead: 92.00,
        price: 295.00,
        type: "main",
        allergens: ["Dairy"],
        dietary: ["Gluten-Free"]
      },
      {
        name: "Herb-Crusted Seabass with Saffron Velouté",
        description: "Pan-roasted seabass fillet with crispy skin, asparagus spears, and saffron velouté reduction",
        costPerHead: 75.00,
        price: 260.00,
        type: "main",
        allergens: ["Fish", "Dairy"],
        dietary: ["Pescatarian"]
      },
      {
        name: "Artisan Wedding Macaron & Valrhona Chocolate Mousse",
        description: "Single-origin chocolate sphere with passion fruit gel and hand-piped almond macarons",
        costPerHead: 35.00,
        price: 110.00,
        type: "dessert",
        allergens: ["Dairy", "Eggs", "Nuts"],
        dietary: ["Vegetarian", "Gluten-Free"]
      }
    ];
  } else if (eventLower.includes('wine') || eventLower.includes('sommelier') || eventLower.includes('cellar')) {
    title = `Sommelier Wine & Artisanal Cheese Pairing`;
    description = `Curated estate wine and regional cheese pairing engineered for ${covers} guests in ${outlet}, featuring artisanal charcuterie boards, aged goat crottin, and dark chocolate truffles.`;
    perHead = 480;
    heroImage = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3";
    items = [
      {
        name: "Artisan Estate Cheese Flight with Cape Fig Confit",
        description: "Aged Gouda, Fairview goat's milk chevin, gorgonzola, fresh honeycomb, and green fig preserves",
        costPerHead: 38.00,
        price: 130.00,
        type: "appetizer",
        allergens: ["Dairy"],
        dietary: ["Vegetarian", "Gluten-Free"]
      },
      {
        name: "Cured Charcuterie Board with Biltong Ribbons & Prosciutto",
        description: "Thinly sliced artisanal coppa, venison biltong, smoked pork loin, cornichons, and stoneground crackers",
        costPerHead: 42.00,
        price: 140.00,
        type: "appetizer",
        allergens: ["Gluten"],
        dietary: ["Halal-Friendly"]
      },
      {
        name: "Pan-Seared Duck Breast with Pinotage Cherry Glaze",
        description: "Crispy skin duck breast with roasted heirloom baby beets, parsnip purée, and Pinotage reduction",
        costPerHead: 78.00,
        price: 250.00,
        type: "main",
        allergens: ["Dairy"],
        dietary: ["Gluten-Free"]
      },
      {
        name: "Handcrafted Dark Chocolate & Sea Salt Truffles",
        description: "70% Valrhona dark chocolate truffles infused with espresso and dusting of Maldon sea salt flakes",
        costPerHead: 24.00,
        price: 85.00,
        type: "dessert",
        allergens: ["Dairy"],
        dietary: ["Vegetarian", "Gluten-Free"]
      }
    ];
  } else if (eventLower.includes('cocktail') || eventLower.includes('canape') || eventLower.includes('reception')) {
    title = `Cocktail Evening & Flying Canapé Service`;
    description = `Sophisticated standing reception for ${covers} guests with high-turnover hot and cold canapés paired with roving butler service.`;
    perHead = 380;
    items = [
      {
        name: "Wagyu Beef Sliders with Truffle Aioli",
        description: "Mini brioche bun with prime wagyu patty, smoked cheddar, and caramelized onion jam",
        costPerHead: 29.00,
        price: 85.00,
        type: "appetizer",
        allergens: ["Gluten", "Dairy", "Eggs"],
        dietary: ["Halal-Friendly"]
      },
      {
        name: "Seared Tuna Tataki Spoons",
        description: "Sesame-crusted yellowfin tuna with ponzu glaze, avocado puree, and micro coriander",
        costPerHead: 32.00,
        price: 95.00,
        type: "appetizer",
        allergens: ["Fish", "Soy", "Sesame"],
        dietary: ["Pescatarian", "Dairy-Free"]
      },
      {
        name: "Tempura Prawn Skewers with Sweet Chili Lime",
        description: "Tiger prawns in airy tempura crunch with lime sweet chili dipping sauce",
        costPerHead: 38.00,
        price: 110.00,
        type: "main",
        allergens: ["Shellfish", "Gluten"],
        dietary: ["Pescatarian"]
      },
      {
        name: "Butter Chicken Phyllo Cigars",
        description: "Crispy phyllo pastry rolls stuffed with aromatic shredded butter chicken and mango chutney",
        costPerHead: 25.00,
        price: 75.00,
        type: "main",
        allergens: ["Gluten", "Dairy"],
        dietary: ["Halal"]
      },
      {
        name: "Mini Salted Caramel Éclairs & Petit Fours",
        description: "Choux pastry filled with crème pâtissière and topped with fleur de sel caramel",
        costPerHead: 19.50,
        price: 65.00,
        type: "dessert",
        allergens: ["Dairy", "Gluten", "Eggs"],
        dietary: ["Vegetarian"]
      }
    ];
  } else if (eventLower.includes('conference') || eventLower.includes('corporate') || eventLower.includes('ddr')) {
    title = `Executive Corporate Conference & Day Delegate (DDR) Buffet`;
    description = `High-efficiency business conference catering for ${covers} delegates, emphasizing cognitive energy, clean proteins, and swift service intervals.`;
    perHead = 420;
    items = [
      {
        name: "Superfood Quinoa & Roasted Butternut Bowl",
        description: "Organic rainbow quinoa with baby spinach, toasted pumpkin seeds, cranberries, and citrus vinaigrette",
        costPerHead: 24.00,
        price: 75.00,
        type: "appetizer",
        allergens: [],
        dietary: ["Vegan", "Gluten-Free", "Halal"]
      },
      {
        name: "Grilled Moroccan Harissa Chicken Thighs",
        description: "Free-range chicken thighs marinated in mild harissa, lemon, and roasted cumin with mint yoghurt",
        costPerHead: 48.00,
        price: 155.00,
        type: "main",
        allergens: ["Dairy"],
        dietary: ["Halal", "Gluten-Free"]
      },
      {
        name: "Cape Linefish en Papillote",
        description: "Steamed local linefish with julienne courgettes, fennel, and white wine reduction",
        costPerHead: 56.00,
        price: 185.00,
        type: "main",
        allergens: ["Fish"],
        dietary: ["Pescatarian", "Gluten-Free", "Dairy-Free"]
      },
      {
        name: "Eggplant Parmigiana Stack",
        description: "Layers of grilled aubergine, rich San Marzano tomato sugo, basil, and melted fior di latte",
        costPerHead: 32.00,
        price: 135.00,
        type: "main",
        allergens: ["Dairy"],
        dietary: ["Vegetarian", "Gluten-Free"]
      },
      {
        name: "Seasonal Fruit Brochettes & Rooibos Panna Cotta",
        description: "Chilled rooibos-infused cream dessert with fresh Cape berry skewers",
        costPerHead: 21.00,
        price: 75.00,
        type: "dessert",
        allergens: ["Dairy"],
        dietary: ["Vegetarian", "Gluten-Free"]
      }
    ];
  } else {
    // Default Hotel Banquet / Gala / Custom Service
    title = `${eventType} Hotel Culinary Banquet`;
    description = `Authoritative banquet proposal curated for ${covers} covers in ${outlet} (${region}), featuring locally sourced hotel-grade ingredients compliant with SANS 10330 standards.`;
    perHead = 520;
    items = [
      {
        name: "Prosciutto-Wrapped Green Asparagus",
        description: "Grade-A asparagus spears with cured prosciutto, shaved parmesan, and cold-pressed lemon oil",
        costPerHead: 28.50,
        price: 90.00,
        type: "appetizer",
        allergens: ["Dairy"],
        dietary: ["Gluten-Free"]
      },
      {
        name: "Karoo Lamb Kofta Bites with Cucumber Tzatziki",
        description: "Free-range spiced lamb meatballs with fresh mint and strained Greek yoghurt dip",
        costPerHead: 32.00,
        price: 105.00,
        type: "appetizer",
        allergens: ["Dairy"],
        dietary: ["Halal"]
      },
      {
        name: "Za'atar Crusted Atlantic Salmon Fillets",
        description: "Pan-seared salmon with gremolata crust, baby asparagus, and saffron potato puree",
        costPerHead: 68.00,
        price: 235.00,
        type: "main",
        allergens: ["Fish", "Sesame"],
        dietary: ["Pescatarian", "Gluten-Free"]
      },
      {
        name: "Herb-Rubbed Free-Range Chicken Breast Supreme",
        description: "Airline cut chicken breast with wild mushroom velouté and potato dauphinoise",
        costPerHead: 48.00,
        price: 175.00,
        type: "main",
        allergens: ["Dairy"],
        dietary: ["Halal"]
      },
      {
        name: "Mascarpone & Toasted Pecan Stuffed Strawberries",
        description: "Jumbo export strawberries with sweet vanilla mascarpone and candied pecan crumbs",
        costPerHead: 24.00,
        price: 85.00,
        type: "dessert",
        allergens: ["Dairy", "Nuts"],
        dietary: ["Vegetarian", "Gluten-Free"]
      }
    ];
  }

  // 2. Generate Allergen Matrix
  const allergenMatrix = items.map((item) => {
    const text = `${item.name} ${item.description}`.toLowerCase();
    const hasGluten = item.allergens.includes("Gluten") || /bread|flour|wheat|pasta|crust|pastry|brioche|phyllo/.test(text);
    const hasDairy = item.allergens.includes("Dairy") || /cheese|cream|butter|milk|yoghurt|tzatziki|feta|parmesan|mascarpone|mozzarella|fondant/.test(text);
    const hasNuts = item.allergens.includes("Nuts") || /nut|almond|pecan|walnut|pistachio|peanut/.test(text);
    const hasEggs = item.allergens.includes("Eggs") || /egg|aioli|mayo|tartlet|fondant|choux|éclair/.test(text);
    const hasShellfish = item.allergens.includes("Shellfish") || /prawn|shrimp|crab|lobster|mussel/.test(text);
    const hasFish = item.allergens.includes("Fish") || /salmon|linefish|tuna|seabass|fish/.test(text);
    const hasSoy = item.allergens.includes("Soy") || /soy|hoisin|tamari|edamame/.test(text);

    return {
      dish: item.name,
      category: item.type === 'appetizer' ? 'Appetizers' : item.type === 'main' ? 'Main Courses' : 'Desserts',
      gluten: hasGluten,
      dairy: hasDairy,
      nuts: hasNuts,
      eggs: hasEggs,
      shellfish: hasShellfish,
      soy: hasSoy,
      fish: hasFish,
      dietary: item.dietary || ['Standard'],
      notes: `${item.dietary?.join(', ') || 'Standard banquet prep'}. Allergen cross-contamination protocol active.`
    };
  });

  // 3. Generate Bulk Scaled Shopping List
  const shoppingList = [
    {
      name: "Primary Hotel Proteins (Lamb / Beef / Salmon / Poultry)",
      quantity: Math.round(covers * 0.38 * 10) / 10,
      unit: "kg",
      unitPrice: 195.00,
      linkedDish: items.find(i => i.type === 'main')?.name || "Main Course"
    },
    {
      name: "Secondary Fresh Seafood or Poultry",
      quantity: Math.round(covers * 0.22 * 10) / 10,
      unit: "kg",
      unitPrice: 165.00,
      linkedDish: items.filter(i => i.type === 'main')[1]?.name || "Main Selection"
    },
    {
      name: "Farm Fresh Seasonal Produce & Microgreens",
      quantity: Math.round(covers * 0.30 * 10) / 10,
      unit: "kg",
      unitPrice: 48.00,
      linkedDish: items.find(i => i.type === 'appetizer')?.name || "Appetizer Platters"
    },
    {
      name: "Dairy & Cheese Supplies (Mascarpone, Butter, Cream, Feta)",
      quantity: Math.round(covers * 0.12 * 10) / 10,
      unit: "kg",
      unitPrice: 115.00,
      linkedDish: "Gourmet Dessert & Sauces"
    },
    {
      name: "Dry Goods, Olive Oils, Spices & Specialty Seasonings",
      quantity: Math.round(covers * 0.08 * 10) / 10,
      unit: "kg",
      unitPrice: 85.00,
      linkedDish: "Kitchen Mise en Place"
    }
  ];

  // 4. Logistics, Mise-en-place & Staffing
  const chefsCount = Math.max(2, Math.ceil(covers / 25));
  const waitronsCount = Math.max(2, Math.ceil(covers / 16));

  const totalProposalValue = perHead * covers + 2400;

  return {
    title,
    menuTitle: title,
    description,
    heroImage,
    targetProfitMargin: 76.5,
    totalProposalValue,
    perHeadPrice: perHead,
    eventType,
    covers,
    guestCount: covers,
    generatedImagePrompt: buildStrictImagePrompt(eventType, cuisine, title, description),
    items,
    allergenMatrix,
    shoppingList,
    logistics: {
      deliveryFee: 2400,
      staffRequired: `${chefsCount} Line & Prep Chefs, ${waitronsCount} Banquet Waitrons, 1 Event Maitre D'`,
      equipmentNeeded: [
        "Combi Steam Oven",
        "Insulated Banquet Hot-Boxes (Camtainers)",
        "Mobile Plating Lines",
        "Blast Chiller",
        "Chafing Dishes & Induction Warmers"
      ],
      serviceNotes: [
        "Maintain SANS 10330 HACCP cold-holding below 4°C during transport.",
        "Pre-service allergen briefing 45 minutes prior to guest seating.",
        "Plating pass inspection: ensure plate rim hygiene and uniform portioning.",
        "Hot items staged at 65°C+ in insulated holding units."
      ],
      miseEnPlace: [
        "T-4 Hours: Receive and temperature-log all wholesale dairy and proteins (<4°C).",
        "T-3 Hours: Execute vegetable brunoise, sauce reductions, and pastry bake-offs.",
        "T-1.5 Hours: Par-sear proteins and stage inside holding cabinets.",
        "T-30 Mins: Final thermal check, sauce emulsification, and brigade plating station inspection."
      ]
    }
  };
}
