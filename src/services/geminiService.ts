
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Menu, Supplier, EducationContent, ShoppingListItem, BeveragePairing } from "../types";

/**
 * Utility to safely extract and parse JSON from an AI response string,
 * ensuring all collections are valid arrays to prevent UI rendering crashes.
 */
const safeParseMenuJson = (text: string): Menu => {
    try {
        // Remove markdown formatting if present
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        
        // Helper to ensure we have an array and never null/undefined
        const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);
        
        // Helper to ensure we have an array of valid objects
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
        throw new Error("The AI returned data in an invalid format. This occasionally happens with complex menus. Please try generating again.");
    }
};

const getApiKey = () => {
    const key = process.env.API_KEY;
    if (!key || key.trim() === '') {
        throw new Error("API Key is missing. If you are the developer, ensure GEMINI_API_KEY is configured in your hosting environment.");
    }
    return key;
};

export interface MenuGenerationParams {
  eventType: string;
  guestCount: string;
  budget: string;
  serviceStyle: string;
  cuisine: string;
  dietaryRestrictions: string[];
  currency: string;
  latitude?: number;
  longitude?: number;
}

export interface MenuGenerationResult {
  menu: Menu;
  totalChecklistItems: number;
}

export const generateMenuFromApi = async ({
  eventType,
  guestCount,
  budget,
  serviceStyle,
  cuisine,
  dietaryRestrictions,
  currency,
}: MenuGenerationParams): Promise<MenuGenerationResult> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `
    You are an expert Michelin-star catering menu planner and Sommelier. 
    Create a professional, detailed menu proposal for:
    - Event: ${eventType}
    - Guests: ${guestCount}
    - Budget: ${budget}
    - Style: ${serviceStyle}
    - Cuisine: ${cuisine}
    - Restrictions: ${dietaryRestrictions.join(', ') || 'None'}
    - LOCAL CURRENCY: ${currency} (STRICTLY USE THIS CURRENCY FOR ALL ESTIMATED COSTS)

    STRICT RULES:
    1. Perfect culinary spelling.
    2. Organize into shopping lists by category.
    3. Include delivery fees and mise en place using ${currency}.
    4. Provide Sommelier-level wine pairings with Body Profiles (Acidity, Tannins, Body).
    5. Ensure all currency symbols in the JSON output match ${currency}.
  `;
  
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
          dietaryNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          beveragePairings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                menuItem: { type: Type.STRING },
                pairingSuggestion: { type: Type.STRING },
                bodyProfile: { type: Type.STRING }
              }
            }
          },
          miseEnPlace: { type: Type.ARRAY, items: { type: Type.STRING } },
          serviceNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          deliveryLogistics: { type: Type.ARRAY, items: { type: Type.STRING } },
          shoppingList: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                store: { type: Type.STRING },
                category: { type: Type.STRING },
                item: { type: Type.STRING },
                quantity: { type: Type.STRING },
                description: { type: Type.STRING },
                estimatedCost: { type: Type.STRING },
                affiliateSearchTerm: { type: Type.STRING }
              }
            }
          },
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

  const text = response.text;
  if (!text) throw new Error("AI failed to generate menu content. Please try again.");
  const menu = safeParseMenuJson(text);
  
  return { menu, totalChecklistItems: 10 };
};

export const generateMenuImageFromApi = async (title: string, description: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: `High-end cinematic culinary photograph of: "${title}". ${description}. Style: Professional food styling, soft natural lighting, shallow depth of field, neutral background. No text, no people, no watermarks.` }],
        }
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return part.inlineData.data;
    }
    throw new Error("No image data returned from AI.");
};

export const generateSocialCaption = async (menuTitle: string, description: string, platform: string = 'instagram'): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Write a viral ${platform} caption for: "${menuTitle}". Content: ${description}. Tone: Professional and enticing. Perfect spelling. Link: https://caterpro-ai.web.app/`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text?.trim() || "";
};

export const generateNewYearLaunchScript = async (menuTitle: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `
    Write a 60-second high-energy "New Year 2026" Launch VSL script for: "${menuTitle}".
    Target: Chefs and Catering students.
    Theme: "Dominate 2026. Resolution for Operational Systems. Leave the 2025 Chaos Behind."
    
    Hook: "2026 is the year you stop being a typist and start being a CEO Chef."
    Body: Mention that CaterPro AI automates the paperwork that usually kills Sunday prep. Leave the outdated 2025 workflows in the past.
    Offer: "Lock in the Founder's Rate before the clock strikes midnight on 2026."
    
    Tone: Motivating, fast, professional.
  `;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

export const generateProvanceVSLScript = async (menuTitle: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Write a 60-90 second VSL following Greg Provance's framework for: "${menuTitle}". Focus on 'Systems vs Chaos' and building a legacy in 2026.`;
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
  const prompt = `Write a 60s explainer script for CaterPro AI focusing on React Logic and Food Safety standards for 2026.`;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

export const generateAssignmentEmail = async (menuTitle: string, menuDescription: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Draft an email to an academy dean about ${menuTitle}.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text?.trim() || "";
};

export const generateSocialVideoFromApi = async (menuTitle: string, description: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Vertical cinematic commercial for a catering event titled "${menuTitle}". High-end 2026 aesthetic.`,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '9:16' }
    });
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        const aiPoll = new GoogleGenAI({ apiKey: getApiKey() });
        operation = await aiPoll.operations.getVideosOperation({operation: operation});
    }
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    return `${videoUri}&key=${getApiKey()}`;
};

export const regenerateMenuItemFromApi = async (originalText: string, instruction: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Original menu item: "${originalText}". Instruction: "${instruction}". Rewrite the menu item professionally according to the instruction. Return only the revised text without any additional commentary.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  return response.text?.trim() || originalText;
};

export const generateStudyGuideFromApi = async (topic: string, curriculum: string, level: string, type: 'guide' | 'curriculum'): Promise<EducationContent> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Create a professional ${type === 'guide' ? 'study guide' : 'curriculum syllabus'} for the topic: "${topic}". 
  Curriculum Standard: ${curriculum}. 
  Education Level: ${level}. 
  Return the result in JSON format following the specified schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
        },
        required: ["title", "curriculum", "level", "overview", "modules"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate educational content.");
  return JSON.parse(text);
};

export const analyzeReceiptFromApi = async (base64: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64,
    },
  };
  const textPart = {
    text: "Analyze this receipt. Extract the merchant name, date (if visible), total amount, and categorize the expense. Return as JSON."
  };
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
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
  const text = response.text;
  if (!text) throw new Error("Failed to analyze receipt.");
  return JSON.parse(text);
};

export const analyzeLabelFromApi = async (base64: string, dietaryRestrictions: string[]): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64,
    },
  };
  const textPart = {
    text: `Analyze this food label for the following dietary restrictions: ${dietaryRestrictions.join(', ') || 'None'}. 
    Identify any flagged ingredients and provide a suitability score out of 10. Return as JSON.`
  };
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
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
  const text = response.text;
  if (!text) throw new Error("Failed to analyze label.");
  return JSON.parse(text);
};
