
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
            salesScripts: ensureObjectArray(parsed.salesScripts),
            aiKeywords: ensureArray(parsed.aiKeywords)
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
  
  const strategyContext = params.strategyHook 
    ? `CRITICAL MARKETING STRATEGY: ${params.strategyHook}. 
       Implement a 'Before, During, After' customer lifecycle strategy in the sales scripts.`
    : '';

  const prompt = `You are a Michelin-star catering strategist. 
  Create a menu proposal for ${params.eventType}. 
  Guest Count: ${params.guestCount}. Budget: ${params.budget}. Cuisine: ${params.cuisine}. 
  
  ${strategyContext}
  
  Return JSON. 
  Include 'salesScripts' for the user (3 scripts: before, during, after purchase).
  Include 'aiKeywords' (5 keywords that will help this menu rank in ChatGPT/Perplexity AI search).
  Categorized Shopping List in ${params.currency}.`;
  
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
          salesScripts: {
              type: Type.ARRAY,
              items: {
                  type: Type.OBJECT,
                  properties: {
                      phase: { type: Type.STRING },
                      hook: { type: Type.STRING },
                      script: { type: Type.STRING }
                  }
              }
          },
          aiKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
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
        required: ["menuTitle", "description", "appetizers", "mainCourses", "salesScripts"]
      }
    }
  });
  return { menu: safeParseMenuJson(response.text) };
};

export const regenerateMenuItemFromApi = async (originalText: string, instruction: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Original text: "${originalText}". Instruction: "${instruction}". Revised text only.`,
    });
    return response.text?.trim() || originalText;
};

export const generateSocialCaption = async (menuTitle: string, description: string, platform: string = 'facebook'): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Write a viral ${platform} post for: "${menuTitle}". Content: ${description}. Link: https://caterpro-ai.web.app/`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text?.trim() || "";
};

export const generateWhatsAppStatus = async (menuTitle: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Write 3 curiosity-driven WhatsApp Status updates for "${menuTitle}".`;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

export const generateVideoFromApi = async (menuTitle: string, description: string, base64Image?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Cinematic professional food catering reel for "${menuTitle}". High-energy, gourmet transitions, 9:16 aspect ratio.`;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: base64Image ? {
      imageBytes: base64Image,
      mimeType: 'image/png',
    } : undefined,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '9:16'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video failed.");
  
  return `${downloadLink}&key=${getApiKey()}`;
};

export const generateProvanceVSLScript = async (menuTitle: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Write a VSL script for: "${menuTitle}". Focus on "Systems over Chaos".`;
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
  });
  return response.text?.trim() || "";
};

export const generateNewYearLaunchScript = async (menuTitle: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Write a 2026 launch script for Tumi. Topic: "${menuTitle}"`;
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
            parts: [{ text: `Professional gourmet culinary photography of: "${title}". 4k.` }],
        }
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return part.inlineData.data;
    }
    throw new Error("No image.");
};

/**
 * Specifically generates high-quality educational culinary infographics.
 */
export const generateCulinaryInfographic = async (type: 'comparison' | 'meat_chart'): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    let prompt = "";
    if (type === 'comparison') {
        prompt = "A high-quality educational vertical infographic poster titled 'CHEF vs COOK'. Vintage parchment texture. The left side shows a professional chef in a white toque and jacket with text bullets about 'Professional Training' and 'Kitchen Operations'. The right side shows a home cook in a simple apron with 'Practical Skills' and 'Recipe Execution'. Cinematic lighting, 4k detail, professional graphic design layout.";
    } else {
        prompt = "A high-resolution professional educational chart titled 'ANIMALS AND THEIR MEAT'. A clean grid-based infographic. Shows high-quality realistic animal photos (Cow, Pig, Sheep, Deer) on the left mapping to their corresponding raw meat cuts (Beef, Pork, Mutton, Venison) on the right. Professional studio food photography style, white background, scientific labels, ultra-detailed textures.";
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            imageConfig: {
                aspectRatio: "3:4"
            }
        }
    });
    
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return part.inlineData.data;
    }
    throw new Error("Infographic generation failed.");
};

export const generateStudyGuideFromApi = async (topic: string, curriculum: string, level: string, type: 'guide' | 'curriculum'): Promise<EducationContent> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Generate a ${type} for topic: "${topic}". Standard: ${curriculum}. Level: ${level}. Return structured JSON.`;
  
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

export const analyzeReceiptFromApi = async (base64: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64, mimeType: "image/jpeg" } },
        { text: "Analyze this receipt. Extract merchant, date, total. Return JSON." }
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

export const analyzeLabelFromApi = async (base64: string, dietaryRestrictions: string[]): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Scan this label for: ${dietaryRestrictions.join(', ')}. Return JSON with suitabilityScore (1-10), flaggedIngredients, and reasoning.`;
  
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
