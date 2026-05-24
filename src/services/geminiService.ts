import { GoogleGenAI } from '@google/genai';

export const getApiKey = (): string => {
  // 4. Add a console.log that prints ALL available import.meta.env keys so we can debug
  console.log('Available import.meta.env keys:', Object.keys(import.meta.env || {}));

  // 1. Try reading the key from import.meta.env.VITE_GEMINI_API_KEY first
  let apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log('VITE_GEMINI_API_KEY status:', apiKey ? 'Found - length: ' + apiKey.length : 'MISSING');

  // 2. If that is empty, try reading from window.__APP_CONFIG__?.geminiKey as a fallback
  if (!apiKey || apiKey.trim() === '') {
    const windowConfig = (window as any).__APP_CONFIG__;
    const fallbackKey = windowConfig?.geminiKey;
    console.log('window.__APP_CONFIG__.geminiKey status:', fallbackKey ? 'Found - length: ' + fallbackKey.length : 'MISSING');
    
    // Check if it's not the un-substituted literal string fallback template
    if (fallbackKey && fallbackKey !== '%VITE_GEMINI_API_KEY%') {
      apiKey = fallbackKey;
    }
  }

  return apiKey || '';
};

const getGenAI = () => {
  const apiKey = getApiKey();
  
  // 3. Show a clear specific error message telling the user exactly what is missing
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      'API Key is missing. Tried reading VITE_GEMINI_API_KEY from environment, ' +
      'then window.__APP_CONFIG__.geminiKey fallback. Please set VITE_GEMINI_API_KEY ' +
      'in your system/env secrets.'
    );
  }
  
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

export const generateMenuFromApi = async (params: {
  eventType: string;
  guestCount: number;
  budget?: string;
  cuisine?: string;
}): Promise<{ data?: any; error?: string }> => {
  const retryLimit = 1;
  let attempt = 0;

  while (attempt <= retryLimit) {
    try {
      const ai = getGenAI();
      
      let budgetText = '';
      if (params.budget) {
        budgetText = 'Target Budget: ' + params.budget + '.';
      }
      
      let cuisineText = '';
      if (params.cuisine) {
        cuisineText = 'Cuisine Style: ' + params.cuisine + '.';
      }

      const structurePrompt = '{\n' +
        '  "menuTitle": "string",\n' +
        '  "description": "string",\n' +
        '  "appetizers": [\n' +
        '    {\n' +
        '      "dish": "string",\n' +
        '      "notes": "string",\n' +
        '      "price": 0,\n' +
        '      "cost": 0,\n' +
        '      "ingredients": [\n' +
        '        { "name": "string", "quantity": 0, "unit": "kg|L", "unitCost": 0 }\n' +
        '      ]\n' +
        '    }\n' +
        '  ],\n' +
        '  "mainCourses": [\n' +
        '    {\n' +
        '      "dish": "string",\n' +
        '      "notes": "string",\n' +
        '      "price": 0,\n' +
        '      "cost": 0,\n' +
        '      "ingredients": [\n' +
        '        { "name": "string", "quantity": 0, "unit": "kg|L", "unitCost": 0 }\n' +
        '      ]\n' +
        '    }\n' +
        '  ],\n' +
        '  "desserts": [\n' +
        '    {\n' +
        '      "dish": "string",\n' +
        '      "notes": "string",\n' +
        '      "price": 0,\n' +
        '      "cost": 0,\n' +
        '      "ingredients": [\n' +
        '        { "name": "string", "quantity": 0, "unit": "kg|L", "unitCost": 0 }\n' +
        '      ]\n' +
        '    }\n' +
        '  ],\n' +
        '  "shoppingList": [\n' +
        '    { "name": "string", "quantity": 0, "unit": "string", "unitPrice": 0, "linkedDish": "string" }\n' +
        '  ],\n' +
        '  "miseEnPlace": ["string"],\n' +
        '  "serviceNotes": ["string"],\n' +
        '  "deliveryLogistics": ["string"],\n' +
        '  "logistics": { "deliveryFee": 0 }\n' +
        '}';

      const prompt = `As an expert catering consultant, generate a premium catering menu for a ${params.eventType} for ${params.guestCount} guests. ${budgetText} ${cuisineText} Return ONLY a JSON object. Keep descriptions concise. REQUIREMENTS: 1. Max 2-3 unique dishes per category (appetizers, mainCourses, desserts). 2. Each dish must include a summary ingredient list for costing. 3. Costs in South African Rand (ZAR). 4. All weights in kg or L. Structure:\n${structurePrompt}`;

      const result = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          maxOutputTokens: 8000,
          temperature: 0.7
        }
      });

      const text = (result.text || '').replace(/```json|```/g, '').trim();
      if (!text) {
        return { error: 'The model returned an empty response.' };
      }
      return { data: JSON.parse(text) };
    } catch (error: any) {
      console.warn(`Menu generation attempt ${attempt + 1} failed:`, error);
      
      const errorStr = JSON.stringify(error) + ' ' + String(error) + ' ' + (error.message || '');
      const isRateLimit = errorStr.includes('429') || 
                          errorStr.toUpperCase().includes('RESOURCE_EXHAUSTED') || 
                          errorStr.toLowerCase().includes('rate limit') ||
                          errorStr.toUpperCase().includes('QUOTA');
                          
      if (isRateLimit && attempt < retryLimit) {
        console.log("Gemini API Rate Limit 429 reached. Pausing for 30 seconds before retrying...");
        await new Promise((resolve) => setTimeout(resolve, 30000));
        attempt++;
      } else {
        let message = error.message || 'Unknown error occurred during AI generation.';
        if (isRateLimit) {
          message = 'Quota Exceeded / Rate Limited (429 RESOURCE_EXHAUSTED). ' +
                    'Please verify your VITE_GEMINI_API_KEY limits, wait 30 seconds and retry.';
        }
        return { error: message };
      }
    }
  }
  return { error: 'Failed to generate menu proposal after automatic quota retries.' };
};

export const generateMenuImageFromApi = async (title: string, description: string, mainCourses?: string[]): Promise<string> => {
  const normalized = (title + " " + description + " " + (mainCourses?.join(" ") || "")).toLowerCase();
  
  // High quality professional culinary photos from Unsplash
  const images: { [key: string]: string } = {
    wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80",
    burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
    pasta: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
    steak: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    breakfast: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
    cocktail: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
    fingerfood: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=1200&q=80",
    chicken: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
    seafood: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80",
    braai: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    indian: "https://images.unsplash.com/photo-1585938338392-50a59970d2ee?auto=format&fit=crop&w=1200&q=80",
    mexican: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
    french: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=1200&q=80",
    catering: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80"
  };

  let selectedUrl = images.catering;

  if (normalized.includes("wedding") || normalized.includes("marriage")) {
    selectedUrl = images.wedding;
  } else if (normalized.includes("dessert") || normalized.includes("cake") || normalized.includes("sweet") || normalized.includes("pastry") || normalized.includes("chocolate")) {
    selectedUrl = images.dessert;
  } else if (normalized.includes("burger") || normalized.includes("sliders")) {
    selectedUrl = images.burger;
  } else if (normalized.includes("sushi") || normalized.includes("japanese") || normalized.includes("asian")) {
    selectedUrl = images.sushi;
  } else if (normalized.includes("pasta") || normalized.includes("italian") || normalized.includes("pizza") || normalized.includes("risotto")) {
    selectedUrl = images.pasta;
  } else if (normalized.includes("steak") || normalized.includes("beef") || normalized.includes("meat") || normalized.includes("lamb") || normalized.includes("grill")) {
    selectedUrl = images.steak;
  } else if (normalized.includes("salad") || normalized.includes("vegan") || normalized.includes("vegetarian") || normalized.includes("greens")) {
    selectedUrl = images.salad;
  } else if (normalized.includes("breakfast") || normalized.includes("brunch") || normalized.includes("egg") || normalized.includes("waffle") || normalized.includes("pancake")) {
    selectedUrl = images.breakfast;
  } else if (normalized.includes("cocktail") || normalized.includes("drink") || normalized.includes("wine") || normalized.includes("bar")) {
    selectedUrl = images.cocktail;
  } else if (normalized.includes("finger food") || normalized.includes("canape") || normalized.includes("tapas") || normalized.includes("platter") || normalized.includes("buffet") || normalized.includes("appetizer")) {
    selectedUrl = images.fingerfood;
  } else if (normalized.includes("chicken") || normalized.includes("poultry") || normalized.includes("turkey") || normalized.includes("duck")) {
    selectedUrl = images.chicken;
  } else if (normalized.includes("seafood") || normalized.includes("fish") || normalized.includes("salmon") || normalized.includes("prawn") || normalized.includes("trout")) {
    selectedUrl = images.seafood;
  } else if (normalized.includes("braai") || normalized.includes("shisa") || normalized.includes("bbq") || normalized.includes("south african")) {
    selectedUrl = images.braai;
  } else if (normalized.includes("indian") || normalized.includes("curry") || normalized.includes("spicy") || normalized.includes("tandoori")) {
    selectedUrl = images.indian;
  } else if (normalized.includes("mexican") || normalized.includes("taco") || normalized.includes("quesadilla") || normalized.includes("nacho")) {
    selectedUrl = images.mexican;
  } else if (normalized.includes("french") || normalized.includes("coq") || normalized.includes("croissant")) {
    selectedUrl = images.french;
  }

  return `${selectedUrl}?is_fallback=true`;
};

export const analyzeMenuForCosting = async (_base64: string, _suppliers: string, _currency: string): Promise<ScannedMenuCosting> => {
  return {
    menuItems: [],
    totalEstimatedMenuCost: '0.00',
    marginAdvice: ''
  };
};

export const extractIngredientsForShift = async (_miseEnPlace: string[], _menuTitle: string): Promise<any[]> => {
  return [];
};

export const regenerateMenuItemFromApi = async (oldText: string, _prompt: string): Promise<string> => {
  return oldText;
};

export const generateVideoFromApi = async (_prompt: string): Promise<string> => {
  return '';
};

export const generateWhatsAppStatus = async (_menuTitle: string): Promise<string> => {
  return '';
};

export const generateSocialCaption = async (_title: string, _desc: string, _platform: string): Promise<string> => {
  return '';
};

export const analyzeReceiptFromApi = async (_base64: string): Promise<any> => {
  return {};
};

export const analyzeLabelFromApi = async (_base64: string, _dietary: string[]): Promise<any> => {
  return {};
};

export const generateCulinaryInfographic = async (_type: string): Promise<string> => {
  return '';
};

export const generateStudyGuideFromApi = async (_topic: string, _curriculum: string, _level: string, _type: string): Promise<any> => {
  return {};
};

export interface ScannedMenuCosting {
  menuItems: {
    name: string;
    identifiedIngredients: string[];
    estimatedPortionCost: string;
    suggestedSupplier: string;
  }[];
  totalEstimatedMenuCost: string;
  marginAdvice: string;
}
