import { GoogleGenAI } from '@google/genai';

const HERO_FALLBACK = 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80';

const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log('API Key status:', apiKey ? 'Found - length: ' + apiKey.length : 'MISSING');
  return apiKey || '';
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

export const generateMenuFromApi = async (params: {
  eventType: string;
  guestCount: number;
  budget?: string;
  cuisine?: string;
}): Promise<{ data?: any; error?: string }> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { error: 'API Key is missing. Please set VITE_GEMINI_API_KEY.' };
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = 'As an expert South African catering consultant, generate a premium catering menu for a ' +
      params.eventType + ' for ' + params.guestCount + ' guests. ' +
      'Budget: ' + (params.budget || 'Standard R250-R500pp') + '. ' +
      'Cuisine: ' + (params.cuisine || 'South African') + '. ' +
      'Return ONLY valid JSON with no markdown or backticks. Use this structure: ' +
      '{"menuTitle":"string","description":"string",' +
      '"appetizers":[{"dish":"string","notes":"string","price":0,"cost":0}],' +
      '"mainCourses":[{"dish":"string","notes":"string","price":0,"cost":0}],' +
      '"desserts":[{"dish":"string","notes":"string","price":0,"cost":0}],' +
      '"shoppingList":[{"name":"string","quantity":0,"unit":"string","unitPrice":0,"linkedDish":"string"}],' +
      '"miseEnPlace":["string"],' +
      '"serviceNotes":["string"],' +
      '"deliveryLogistics":["string"],' +
      '"logistics":{"deliveryFee":0}}';

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });

    const text = (result.text || '').replace(/```json|```/g, '').trim();
    if (!text) return { error: 'Empty response from AI' };
    return { data: JSON.parse(text) };
  } catch (error: any) {
    console.error('generateMenuFromApi error:', error);
    return { error: error.message || 'Generation failed' };
  }
};

export const generateMenuImageFromApi = async (
  _title: string,
  _description: string,
  _mainCourses?: string[]
): Promise<string> => {
  return HERO_FALLBACK;
};

export const analyzeMenuForCosting = async (
  _base64: string,
  _suppliers: string,
  _currency: string
): Promise<ScannedMenuCosting> => {
  return { menuItems: [], totalEstimatedMenuCost: '0.00', marginAdvice: '' };
};

export const extractIngredientsForShift = async (
  _miseEnPlace: string[],
  _menuTitle: string
): Promise<any[]> => { return []; };

export const regenerateMenuItemFromApi = async (
  oldText: string,
  _prompt: string
): Promise<string> => { return oldText; };

export const generateVideoFromApi = async (_prompt: string): Promise<string> => { return ''; };
export const generateWhatsAppStatus = async (_menuTitle: string): Promise<string> => { return ''; };
export const generateSocialCaption = async (_title: string, _desc: string, _platform: string): Promise<string> => { return ''; };
export const analyzeReceiptFromApi = async (_base64: string): Promise<any> => { return {}; };
export const analyzeLabelFromApi = async (_base64: string, _dietary: string[]): Promise<any> => { return {}; };
export const generateCulinaryInfographic = async (_type: string): Promise<string> => { return HERO_FALLBACK; };
export const generateStudyGuideFromApi = async (_topic: string, _curriculum: string, _level: string, _type: string): Promise<any> => { return {}; };
