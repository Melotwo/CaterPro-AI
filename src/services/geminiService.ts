import { GoogleGenerativeAI } from "@google/generative-ai";

const HERO_FALLBACK = "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80";

const getApiKey = (): string => {
  const key = (import.meta as any).env?.VITE_GEMINI_API_KEY 
    ?? (window as any).__GEMINI_KEY__ 
    ?? '';
  return key;
};

export const generateMenuFromApi = async (params: { 
  eventType: string; 
  guestCount: number;
  budget?: string;
  cuisine?: string;
}): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { error: 'API key not found in environment' };
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a premium catering menu for a "${params.eventType}" for ${params.guestCount} guests. Budget: ${params.budget || 'Standard'}. Cuisine: ${params.cuisine || 'South African'}. Return ONLY valid JSON with this structure: {"menuTitle": "string", "description": "string", "appetizers": [{"dish": "string", "notes": "string", "price": number, "cost": number}], "mainCourses": [{"dish": "string", "notes": "string", "price": number, "cost": number}], "desserts": [{"dish": "string", "notes": "string", "price": number, "cost": number}], "miseEnPlace": ["string"], "serviceNotes": ["string"], "deliveryLogistics": ["string"], "shoppingList": [{"name": "string", "quantity": number, "unit": "string", "unitPrice": number, "linkedDish": "string"}], "logistics": {"deliveryFee": number}}`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return { data: JSON.parse(text) };
  } catch (error: any) {
    return { error: error.message || 'Generation failed' };
  }
};

export const generateMenuImageFromApi = async (
  title: string, 
  description: string, 
  mainCourses?: string[]
): Promise<string> => {
  return HERO_FALLBACK;
};

export const analyzeMenuForCosting = async (): Promise<any> => ({ menuItems: [], totalEstimatedMenuCost: '0', marginAdvice: '' });
export const extractIngredientsForShift = async (): Promise<any[]> => [];
export const regenerateMenuItemFromApi = async (oldText: string): Promise<string> => oldText;
export const generateVideoFromApi = async (): Promise<string> => '';
export const generateWhatsAppStatus = async (menuTitle: string): Promise<string> => `New menu: ${menuTitle}`;
export const generateSocialCaption = async (title: string, _desc: string, platform: string): Promise<string> => `Check out ${title} on ${platform}!`;
export const analyzeReceiptFromApi = async (): Promise<any> => ({});
export const analyzeLabelFromApi = async (): Promise<any> => ({});
export const generateCulinaryInfographic = async (): Promise<string> => HERO_FALLBACK;
export const generateStudyGuideFromApi = async (topic: string): Promise<any> => ({ title: topic });
