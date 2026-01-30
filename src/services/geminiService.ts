import { GoogleGenAI, Type } from "@google/genai";
import { Menu } from "../types";

const safeParseMenuJson = (text: string): Menu => {
    try {
        if (!text) throw new Error("Empty response from AI");
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        
        const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);
        const ensureObjectArray = (arr: any) => 
            (Array.isArray(arr) ? arr.filter(i => i !== null && typeof i === 'object') : []);
        
        // Intelligent Mapping: Fix for missing sections 1 & 2
        // If the AI uses different keys, we map them back to your standard keys
        const appetizers = parsed.appetizers || parsed.appetizer || parsed.starters || parsed.starter || parsed.firstCourse || [];
        const mainCourses = parsed.mainCourses || parsed.mainCourse || parsed.mains || parsed.main || parsed.entrees || [];
        const sideDishes = parsed.sideDishes || parsed.sideDish || parsed.sides || parsed.side || [];
        const dessert = parsed.dessert || parsed.desserts || [];
        
        return {
            ...parsed,
            menuTitle: parsed.menuTitle || "New Menu Proposal",
            description: parsed.description || "A custom catering proposal designed just for you.",
            appetizers: ensureArray(appetizers),
            mainCourses: ensureArray(mainCourses),
            sideDishes: ensureArray(sideDishes),
            dessert: ensureArray(dessert),
            dietaryNotes: ensureArray(parsed.dietaryNotes),
            beveragePairings: ensureObjectArray(parsed.beveragePairings),
            miseEnPlace: ensureArray(parsed.miseEnPlace),
            serviceNotes: ensureArray(parsed.serviceNotes),
            deliveryLogistics: ensureArray(parsed.deliveryLogistics),
            shoppingList: ensureObjectArray(parsed.shoppingList),
            recommendedEquipment: ensureObjectArray(parsed.recommendedEquipment),
            salesScripts: ensureObjectArray(parsed.salesScripts),
            aiKeywords: ensureArray(parsed.aiKeywords),
            businessAnalysis: ensureObjectArray(parsed.businessAnalysis),
            safetyProtocols: ensureArray(parsed.safetyProtocols)
        };
    } catch (e) {
        console.error("JSON Parse Error. Raw text:", text);
        throw new Error("Generation interrupted. Try a simpler request.");
    }
};

const getApiKey = () => {
    const key = process.env.API_KEY;
    if (!key || key.trim() === '') {
        throw new Error("API Key is missing.");
    }
    return key;
};

export const generateMenuFromApi = async (params: any): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  const prompt = `You are a Michelin-star catering consultant.
  
  TASK: Generate a COMPLETE menu proposal for:
  Event: ${params.eventType}. 
  Guests: ${params.guestCount}. 
  Budget: ${params.budget}. 
  Cuisine: ${params.cuisine}. 
  Marketing Strategy: ${params.strategyHook || 'standard'}.
  
  STRICT COMPLIANCE RULES:
  1. YOU MUST populate 'appetizers' (Section 1), 'mainCourses' (Section 2), AND 'sideDishes' (Section 3).
  2. For BBQ/Braai: Section 1 is bread/biltong/small bites. Section 2 is THE MEATS. Section 3 is salads/veg.
  3. DO NOT LEAVE SECTIONS 1 OR 2 EMPTY.
  4. Currency: ${params.currency || 'ZAR'}.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          menuTitle: { type: Type.STRING },
          description: { type: Type.STRING },
          appetizers: { type: Type.ARRAY, items: { type: Type.STRING } },
          mainCourses: { type: Type.ARRAY, items: { type: Type.STRING } },
          sideDishes: { type: Type.ARRAY, items: { type: Type.STRING } },
          dessert: { type: Type.ARRAY, items: { type: Type.STRING } },
          safetyProtocols: { type: Type.ARRAY, items: { type: Type.STRING } },
          shoppingList: { 
            type: Type.ARRAY, 
            items: { 
                type: Type.OBJECT, 
                properties: { 
                    item: { type: Type.STRING }, 
                    quantity: { type: Type.STRING },
                    category: { type: Type.STRING },
                    estimatedCost: { type: Type.STRING } 
                } 
            } 
          },
          miseEnPlace: { type: Type.ARRAY, items: { type: Type.STRING } },
          serviceNotes: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  
  return { menu: safeParseMenuJson(response.text || "") };
};

export const generateMenuImageFromApi = async (title: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `A high-quality food photography shot of ${title}. ${description}.` }] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return part.inlineData.data;
  }
  throw new Error("No image generated");
};

export const regenerateMenuItemFromApi = async (oldText: string, prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Update this menu item: "${oldText}" based on: "${prompt}". Return ONLY the text.`,
    });
    return response.text?.trim() || oldText;
};

export const generateVideoFromApi = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '9:16' }
  });
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${getApiKey()}`;
};

export const generateWhatsAppStatus = async (menuTitle: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `3 WhatsApp updates for "${menuTitle}". Emojis included.`,
  });
  return response.text?.trim() || "";
};

export const generateSocialCaption = async (title: string, desc: string, platform: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Viral ${platform} post for: "${title}". Content: ${desc}.`,
    });
    return response.text?.trim() || "";
};

export const analyzeReceiptFromApi = async (base64: string): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64 } },
                { text: 'Extract merchant, date, total, and categories from this receipt. Return JSON.' }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    merchant: { type: Type.STRING },
                    date: { type: Type.STRING },
                    total: { type: Type.STRING },
                    categories: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    });
    return JSON.parse(response.text || "{}");
};

export const analyzeLabelFromApi = async (base64: string, dietary: string[]): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64 } },
                { text: `Analyze this label for: ${dietary.join(', ')}. Return suitability score, flagged items, and reasoning as JSON.` }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suitabilityScore: { type: Type.NUMBER },
                    flaggedIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    reasoning: { type: Type.STRING }
                }
            }
        }
    });
    return JSON.parse(response.text || "{}");
};

export const generateCulinaryInfographic = async (type: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = type === 'comparison' 
        ? "Culinary infographic: Chef vs Cook."
        : "Culinary infographic: Meat cuts mapping.";
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "4:3" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return part.inlineData.data;
    }
    throw new Error("Infographic failed");
};

export const generateStudyGuideFromApi = async (topic: string, curriculum: string, level: string, type: string): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a professional ${type} for ${topic}. Standard: ${curriculum}. Level: ${level}. Return JSON.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    curriculum: { type: Type.STRING },
                    level: { type: Type.STRING },
                    overview: { type: Type.STRING },
                    modules: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { title: { type: Type.STRING }, content: { type: Type.ARRAY, items: { type: Type.STRING } } }
                        }
                    },
                    keyVocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
                    practicalExercises: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    });
    return JSON.parse(response.text || "{}");
};
