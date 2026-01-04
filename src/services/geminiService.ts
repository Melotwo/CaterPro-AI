
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Menu, Supplier, EducationContent, ShoppingListItem, BeveragePairing } from "../types";

const safeParseMenuJson = (text: string): Menu => {
    try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);
        const ensureObjectArray = (arr: any) => 
            (Array.isArray(arr) ? arr.filter(i => i !== null && typeof i === 'object') : []);
        
        return {
            ...parsed,
            menuTitle: parsed.menuTitle || "New Menu Proposal",
            description: parsed.description || "A custom catering proposal designed just for you.",
            appetizers: ensureArray(parsed.appetizers),
            mainCourses: ensureArray(parsed.mainCourses),
            sideDishes: ensureArray(parsed.sideDishes),
            dessert: ensureArray(parsed.dessert),
            dietaryNotes: ensureArray(parsed.dietaryNotes),
            beveragePairings: ensureObjectArray(parsed.beveragePairings),
            miseEnPlace: ensureArray(parsed.miseEnPlace),
            serviceNotes: ensureArray(parsed.serviceNotes),
            deliveryLogistics: ensureArray(parsed.deliveryLogistics),
            shoppingList: ensureObjectArray(parsed.shoppingList),
            recommendedEquipment: ensureObjectArray(parsed.recommendedEquipment),
        };
    } catch (e) {
        console.error("JSON Parse Error. Raw text:", text);
        throw new Error("Invalid format. Please try again.");
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
  
  // Explicitly instructing the AI to apply the NotebookLM-derived strategies
  const strategyContext = params.strategyHook 
    ? `CRITICAL MARKETING STRATEGY CONTEXT: ${params.strategyHook}. 
       Ensure the menu descriptions use persuasive language aligned with these hooks. 
       If Lifecycle Marketing is mentioned, emphasize the journey. 
       If Hyper-targeting is mentioned, emphasize personalization for the specific audience.`
    : '';

  const prompt = `You are a Michelin-star catering and digital marketing strategist. 
  Create a professional menu proposal for ${params.eventType}. 
  Guest Count: ${params.guestCount}.
  Budget: ${params.budget}. 
  Cuisine: ${params.cuisine}. 
  Currency: ${params.currency}. 
  
  ${strategyContext}
  
  Return as JSON. Include categorized Shopping List with estimated costs in ${params.currency}. 
  Ensure menu item names are sophisticated and enticing.`;
  
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
          shoppingList: { 
            type: Type.ARRAY, 
            items: { 
                type: Type.OBJECT, 
                properties: { 
                    item: { type: Type.STRING }, 
                    quantity: { type: Type.STRING },
                    category: { type: Type.STRING },
                    store: { type: Type.STRING },
                    estimatedCost: { type: Type.STRING } 
                } 
            } 
          },
          miseEnPlace: { type: Type.ARRAY, items: { type: Type.STRING } },
          serviceNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          deliveryLogistics: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedEquipment: { 
            type: Type.ARRAY, 
            items: { 
                type: Type.OBJECT, 
                properties: { 
                    item: { type: Type.STRING }, 
                    description: { type: Type.STRING } 
                } 
            } 
          }
        },
        required: ["menuTitle", "description", "appetizers", "mainCourses", "shoppingList"]
      }
    }
  });
  return { menu: safeParseMenuJson(response.text), totalChecklistItems: 10 };
};

export const regenerateMenuItemFromApi = async (originalText: string, instruction: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Original menu item text: "${originalText}". Instruction: "${instruction}". Rewrite the text following the instruction. Return only the revised text.`,
    });
    return response.text?.trim() || originalText;
};

export const generateSocialCaption = async (menuTitle: string, description: string, platform: string = 'facebook'): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Write a viral ${platform} post for: "${menuTitle}". Content: ${description}. Tone: Professional. Link: https://caterpro-ai.web.app/`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text?.trim() || "";
};

export const generateWhatsAppStatus = async (menuTitle: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Write 3 different WhatsApp Status updates for Chef Tumi promoting "${menuTitle}". 
  Style: Short, local (SA/Global), and high curiosity. 
  Goal: Get friends and colleagues to ask "How did you make this?"`;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

export const generateVideoReelScript = async (menuTitle: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Write a 30-second TikTok/Reels Script for "${menuTitle}". 
  Include: 
  1. Hook: "POV: You're a chef who stopped spending Sundays on paperwork."
  2. The Process: Fast cut shots of the AI generating this menu.
  3. CTA: "Link in bio to lock in your Founder's rate."`;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

export const generateVideoReelScriptFromApi = generateVideoReelScript;

export const generateProvanceVSLScript = async (menuTitle: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Write a Greg Provance style VSL script for: "${menuTitle}". Focus on "Systems over Chaos".`;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

export const generateNewYearLaunchScript = async (menuTitle: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Write a Facebook Post and an 11 Labs Voiceover Script for Tumi's 2026 Launch. Topic: "${menuTitle}"`;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

export const generateMenuImageFromApi = async (title: string, description: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: `High-end professional culinary food photography of: "${title}". 4k, gourmet styling.` }],
        }
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return part.inlineData.data;
    }
    throw new Error("No image.");
};

// Fix: Implement missing generateStudyGuideFromApi function
export const generateStudyGuideFromApi = async (topic: string, curriculum: string, level: string, type: 'guide' | 'curriculum'): Promise<EducationContent> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Generate a professional ${type === 'guide' ? 'study guide' : 'curriculum syllabus'} for the topic: "${topic}".
  Standard: ${curriculum}. Level: ${level}.
  Include a title, overview, modules, key vocabulary, assessment criteria, and practical exercises. 
  Return as structured JSON.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
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
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "content"]
            }
          },
          keyVocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
          assessmentCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
          practicalExercises: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "overview", "modules", "keyVocabulary"]
      }
    }
  });
  return JSON.parse(response.text);
};

// Fix: Implement missing analyzeReceiptFromApi function
export const analyzeReceiptFromApi = async (base64: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64, mimeType: "image/jpeg" } },
        { text: "Analyze this receipt. Extract merchant name, date, total amount, and item categories. Return as JSON." }
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
        },
        required: ["merchant", "total"]
      }
    }
  });
  return JSON.parse(response.text);
};

// Fix: Implement missing analyzeLabelFromApi function
export const analyzeLabelFromApi = async (base64: string, dietaryRestrictions: string[]): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Scan this food label for these dietary restrictions: ${dietaryRestrictions.join(', ')}. 
  Provide a suitability score (1-10), flagged ingredients, and reasoning. Return as JSON.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64, mimeType: "image/jpeg" } },
        { text: prompt }
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
        },
        required: ["suitabilityScore", "flaggedIngredients", "reasoning"]
      }
    }
  });
  return JSON.parse(response.text);
};
