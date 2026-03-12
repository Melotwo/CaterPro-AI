
import { GoogleGenAI, Type } from "@google/genai";
import { Menu, ScannedMenuCosting } from "../types";

const safeParseMenuJson = (text: string): Menu => {
    try {
        if (!text) throw new Error("Empty response from AI");
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        
        const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);
        const ensureObjectArray = (arr: any) => 
            (Array.isArray(arr) ? arr.filter(i => i !== null && typeof i === 'object') : []);
        
        const appetizers = parsed.appetizers || parsed.appetizer || parsed.starters || parsed.starter || parsed.firstCourse || [];
        const mainCourses = parsed.mainCourses || parsed.mainCourse || parsed.mains || parsed.main || parsed.entrees || [];
        const sideDishes = parsed.sideDishes || parsed.sideDish || parsed.sides || parsed.side || [];
        const dessert = parsed.dessert || parsed.desserts || [];
        
        // Ensure we have at least some content if the AI was lazy
        const finalAppetizers = ensureArray(appetizers);
        const finalMainCourses = ensureArray(mainCourses);
        const finalSideDishes = ensureArray(sideDishes);
        const finalDessert = ensureArray(dessert);

        return {
            ...parsed,
            menuTitle: parsed.menuTitle || "New Menu Proposal",
            description: parsed.description || "A custom catering proposal designed just for you.",
            appetizers: finalAppetizers,
            mainCourses: finalMainCourses,
            sideDishes: finalSideDishes,
            dessert: finalDessert,
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
        throw new Error("The AI response was malformed. Please try again with a slightly different request.");
    }
};

const getApiKey = () => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key || key.trim() === '') {
        throw new Error("API Key is missing.");
    }
    return key;
};

export const analyzeMenuForCosting = async (base64: string, suppliers: string, currency: string): Promise<ScannedMenuCosting> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64 } },
                { text: `Analyze this menu image for food product costing. 
                         Currency: ${currency}. 
                         Supplier Context: ${suppliers || 'Standard Market Rates'}. 
                         Return JSON with menuItems (identifiedIngredients, estimatedPortionCost, suggestedSupplier), totalEstimatedMenuCost, and marginAdvice.` }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    menuItems: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                identifiedIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                                estimatedPortionCost: { type: Type.STRING },
                                suggestedSupplier: { type: Type.STRING }
                            }
                        }
                    },
                    totalEstimatedMenuCost: { type: Type.STRING },
                    marginAdvice: { type: Type.STRING }
                }
            }
        }
    });
    return JSON.parse(response.text || "{}");
};

export const generateMenuFromApi = async (params: any): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  const costContext = params.userIngredientCosts 
    ? `\nUSER SPECIFIC INGREDIENT COSTS (Use these for accurate costing): ${JSON.stringify(params.userIngredientCosts)}`
    : '';

  const prompt = `You are a Michelin-star catering consultant.
  
  TASK: Generate a COMPLETE, high-end menu proposal for:
  Event: ${params.eventType}. 
  Guests: ${params.guestCount}. 
  Budget: ${params.budget}. 
  Cuisine: ${params.cuisine}. 
  Marketing Strategy: ${params.strategyHook || 'standard'}.${costContext}
  
  STRICT COMPLIANCE RULES:
  1. YOU MUST populate 'appetizers', 'mainCourses', 'sideDishes', AND 'dessert'.
  2. Each section MUST contain at least 3-4 distinct, high-quality items.
  3. For BBQ/Braai: Section 1 is bread/biltong/small bites. Section 2 is THE MEATS. Section 3 is salads/veg.
  4. DO NOT LEAVE ANY SECTION EMPTY.
  5. Currency: ${params.currency || 'ZAR'}.
  6. If USER SPECIFIC INGREDIENT COSTS are provided, prioritize using those prices in the 'estimatedCost' fields of the 'shoppingList'.`;
  
  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
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
            },
            required: ["menuTitle", "description", "appetizers", "mainCourses", "sideDishes", "dessert"]
          }
        }
      });
      
      const menu = safeParseMenuJson(response.text || "");
      
      // Basic validation to ensure sections aren't empty
      if (menu.appetizers.length > 0 && menu.mainCourses.length > 0) {
        return { menu };
      }
      
      console.warn(`Attempt ${attempts + 1} produced empty sections. Retrying...`);
      attempts++;
    } catch (e) {
      console.error(`Attempt ${attempts + 1} failed:`, e);
      attempts++;
      if (attempts === maxAttempts) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  throw new Error("The AI is having trouble generating a complete menu. Please try again.");
};

export const generateMenuImageFromApi = async (title: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const cleanTitle = title.replace(/[^\w\s]/gi, '');
  const imagePrompt = `Professional food photography of ${cleanTitle}. Cinematic lighting, michelin-star presentation, macro shot, blurred background, elegant plating on a ceramic dish. Gourmet catering style. No people.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) return part.inlineData.data;
    }
    throw new Error("No image part in response");
  } catch (err) {
    console.error("Image Gen Logic Error:", err);
    throw err;
  }
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
        if (part.inlineData?.data) return part.inlineData.data;
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
