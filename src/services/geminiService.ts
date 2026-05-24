import { GoogleGenAI } from '@google/genai';

const getApiKey = (): string => {
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

    const prompt = 'As an expert catering consultant, generate a premium catering menu for a ' + params.eventType + ' for ' + params.guestCount + ' guests. ' + budgetText + ' ' + cuisineText + ' Return ONLY a JSON object. Keep descriptions concise. REQUIREMENTS: 1. Max 2-3 unique dishes per category (appetizers, mainCourses, desserts). 2. Each dish must include a summary ingredient list for costing. 3. Costs in South African Rand (ZAR). 4. All weights in kg or L. Structure: ' + structurePrompt;

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
    console.error('AI Generation failed:', error);
    
    let message = error.message || 'Unknown error occurred during AI generation.';
    const errorStr = JSON.stringify(error) + ' ' + String(error) + ' ' + (error.message || '');
    const isRateLimit = errorStr.includes('429') || 
                        errorStr.toUpperCase().includes('RESOURCE_EXHAUSTED') || 
                        errorStr.toLowerCase().includes('rate limit') ||
                        errorStr.toUpperCase().includes('QUOTA');
                        
    if (isRateLimit) {
      message = 'Quota Exceeded / Rate Limited (429 RESOURCE_EXHAUSTED). ' +
                'Since you upgraded to the Blaze plan, please make sure you generated and configured a NEW API key ' +
                'after linking billing, as older keys might still be restricted to the restricted Free Tier. ' +
                'Also, verify that the key you are using has Google AI Studio access enabled and is correctly set as VITE_GEMINI_API_KEY.';
    }
    
    return { error: message };
  }
};

export const generateMenuImageFromApi = async (_title: string, _description: string, _mainCourses?: string[]): Promise<string> => {
  return 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80';
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
