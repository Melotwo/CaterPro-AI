
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Menu, Supplier, EducationContent, ShoppingListItem, BeveragePairing } from "../types";

/**
 * Utility to safely extract and parse JSON from an AI response string,
 * ensuring all collections are valid arrays to prevent UI rendering crashes.
 */
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
  const prompt = `You are a Michelin-star catering planner. Create a professional menu proposal for ${params.eventType}. Budget: ${params.budget}. Cuisine: ${params.cuisine}. Currency: ${params.currency}. Return as JSON.`;
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
          shoppingList: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, estimatedCost: { type: Type.STRING } } } }
        }
      }
    }
  });
  return { menu: safeParseMenuJson(response.text), totalChecklistItems: 10 };
};

export const generateMenuImageFromApi = async (title: string, description: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: `High-end cinematic culinary photograph of: "${title}". ${description}. Professional food styling.` }],
        }
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return part.inlineData.data;
    }
    throw new Error("No image data.");
};

export const generateSocialCaption = async (menuTitle: string, description: string, platform: string = 'instagram'): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Write a viral ${platform} post for: "${menuTitle}". Tone: Authoritative (Greg Provance) and High Energy (Neil Patel). 
    INSTRUCTIONS:
    1. Start with a hook about leaving the "Manual Chaos" in 2025.
    2. Explain how this "System" (CaterPro AI) works.
    3. End with a CTA to lock in the Founder's Rate.
    4. Link: https://caterpro-ai.web.app/`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text?.trim() || "";
};

export const generateNewYearLaunchScript = async (menuTitle: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `
    Write a Facebook Post and an 11 Labs Voiceover Script for Tumi's 2026 Launch.
    Topic: "${menuTitle}"
    
    FACEBOOK POST STRUCTURE:
    - [Hook] Stop being a typist. Start being a CEO Chef in 2026. 🚀
    - [The Problem] Mention the Sunday night paperwork grind.
    - [The Solution] CaterPro AI - The operational system for caterers.
    - [CTA] Join the Founder's Circle.
    
    VOICEOVER (11 LABS):
    - Fast-paced, high energy. Focus on "Precision & Speed".
  `;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

export const generateProvanceVSLScript = async (menuTitle: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Write a Greg Provance style VSL script for: "${menuTitle}". Focus on "Systems over Chaos".`;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

export const generatePodcastStoryboard = async (menuTitle: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Create a 60s storyboard for: "${menuTitle}".`;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

export const generateExplainerScript = async (menuTitle: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Write a script for CaterPro AI focusing on React Logic and Food Safety.`;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

// Fix: Added missing regenerateMenuItemFromApi function
/**
 * Regenerates a specific menu item based on user instructions.
 */
export const regenerateMenuItemFromApi = async (originalText: string, instruction: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Original menu item: "${originalText}". User instruction: "${instruction}". Rewrite the menu item to incorporate the instruction while maintaining a professional michelin-star catering tone. Return only the updated text.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text?.trim() || originalText;
};

// Fix: Added missing generateStudyGuideFromApi function
/**
 * Generates an educational study guide or curriculum document.
 */
export const generateStudyGuideFromApi = async (topic: string, curriculum: string, level: string, type: 'guide' | 'curriculum'): Promise<EducationContent> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Create a comprehensive ${type} for: "${topic}". Curriculum: "${curriculum}". Level: "${level}". Return as JSON.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
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
                            }
                        }
                    },
                    keyVocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
                    assessmentCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
                    practicalExercises: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    });
    
    return JSON.parse(response.text || '{}');
};

// Fix: Added missing generateSocialVideoFromApi function
/**
 * Generates a high-energy video script for social media reels/TikTok.
 */
export const generateSocialVideoFromApi = async (menuTitle: string, description: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Write a short, engaging video script (TikTok/Reel style) for: "${menuTitle}". ${description}. Include visual cues and high-energy narration.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text?.trim() || "";
};

// Fix: Added missing generateAssignmentEmail function
/**
 * Generates a formal assignment email for culinary students.
 */
export const generateAssignmentEmail = async (menuTitle: string, description: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Write a formal assignment email for a culinary student regarding: "${menuTitle}". ${description}. Clearly outline expectations for their Portfolio of Evidence (PoE).`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text?.trim() || "";
};

// Fix: Added missing analyzeReceiptFromApi function
/**
 * Uses Multimodal AI to extract data from a photographed receipt.
 */
export const analyzeReceiptFromApi = async (base64Image: string): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                { text: 'Analyze this receipt image. Extract merchant name, date, total amount, and item categories. Return as JSON.' }
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
    return JSON.parse(response.text || '{}');
};

// Fix: Added missing analyzeLabelFromApi function
/**
 * Uses Multimodal AI to scan ingredient labels for dietary restrictions.
 */
export const analyzeLabelFromApi = async (base64Image: string, dietaryRestrictions: string[]): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                { text: `Scan this food label for the following dietary restrictions: ${dietaryRestrictions.join(', ')}. Return a JSON object with suitabilityScore (0-10), flaggedIngredients (array), and reasoning (string).` }
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
    return JSON.parse(response.text || '{}');
};
