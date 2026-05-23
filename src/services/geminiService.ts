import { GoogleGenAI } from "@google/genai";

const HERO_FALLBACK = "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80";

const getApiKey = (): string => {
  const key = (import.meta as any).env?.VITE_GEMINI_API_KEY ?? '';
  console.log('API Key check - length:', key ? key.length : 0, '- first 4 chars:', key ? key.substring(0, 4) : 'EMPTY');
  return key;
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
}): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { error: `API key not found. Available env keys: ${Object.keys((import.meta as any).env || {}).join(', ')}` };
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an expert South African catering consultant. Generate a premium catering menu for a "${params.eventType}" for ${params.guestCount} guests. Budget: ${params.budget || 'Standard (R250-R500pp)'}. Cuisine: ${params.cuisine || 'South African'}. Return ONLY valid JSON with no markdown, no backticks, no explanation. Use this exact structure:
{"menuTitle":"string","description":"string","appetizers":[{"dish":"string","notes":"string","price":0,"cost":0}],"mainCourses":[{"dish":"string","notes":"string","price":0,"cost":0}],"desserts":[{"dish":"string","notes":"string","price":0,"cost":0}],"miseEnPlace":["string"],"serviceNotes":["string"],"deliveryLogistics":["string"],"shoppingList":[{"name":"string","quantity":0,"unit":"string","unitPrice":0,"linkedDish":"string"}],"logistics":{"deliveryFee":0}}`
    });
    const raw = result.text || '';
    const text = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    return { data: parsed };
  } catch (error: any) {
    console.error('generateMenuFromApi error:', error);
    return { error: error.message || 'Generation failed' };
  }
};

export const generateMenuImageFromApi = async (
  title: string,
  description: string,
  mainCourses?: string[]
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return HERO_FALLBACK;
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Premium food photography of a high-end catering spread: ${title}. ${description}. Featuring: ${(mainCourses || []).join(', ')}. Luxurious, appetizing, moody professional lighting.`;
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: ["IMAGE", "TEXT"],
        imageConfig: { aspectRatio: "16:9" }
      }
    });
    for (const part of (result.candidates?.[0]?.content?.parts || [])) {
      if ((part as any).inlineData?.data) {
        return `data:${(part as any).inlineData.mimeType};base64,${(part as any).inlineData.data}`;
      }
