import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Menu, Supplier, EducationContent, ShoppingListItem, BeveragePairing } from "../types";

const safeParseMenuJson = (text: string): Menu => {
    try {
        if (!text) throw new Error("Empty response from AI");
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        
        const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);
        const ensureObjectArray = (arr: any) => 
            (Array.isArray(arr) ? arr.filter(i => i !== null && typeof i === 'object') : []);
        
        // Intelligent Mapping: AI often returns singular or shortened keys for sections 1 & 2
        const appetizers = parsed.appetizers || parsed.appetizer || parsed.starters || parsed.starter || [];
        const mainCourses = parsed.mainCourses || parsed.mainCourse || parsed.mains || parsed.main || [];
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
  
  // STRICT PROMPT: Enforces filling all sections for the UI grid
  const prompt = `You are a Michelin catering strategist.
  
  TASK: Generate a COMPLETE menu proposal for:
  Event: ${params.eventType}. 
  Guests: ${params.guestCount}. 
  Budget: ${params.budget}. 
  Cuisine: ${params.cuisine}. 
  Marketing Strategy: ${params.strategyHook || 'standard'}.
  
  STRICT COMPLIANCE RULES:
  1. You MUST populate 'appetizers' (Section 1), 'mainCourses' (Section 2), and 'sideDishes' (Section 3).
  2. For a BRAAI/BBQ: Put grilled proteins in 'mainCourses'. Put biltong/breads in 'appetizers'. Put salads in 'sideDishes'.
  3. Minimum 3 high-quality items per section. DO NOT SKIP SECTIONS 1 OR 2.
  4. Currency: ${params.currency || 'ZAR'}.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 }, 
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
          businessAnalysis: {
              type: Type.ARRAY,
              items: {
                  type: Type.OBJECT,
                  properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      profitMargin: { type: Type.NUMBER },
                      popularityPotential: { type: Type.NUMBER },
                      evocativeDescription: { type: Type.STRING }
                  }
              }
          },
          safetyProtocols: { type: Type.ARRAY, items: { type: Type.STRING } },
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
                properties: { item: { type: Type.STRING }, description: { type: Type.STRING } } 
            } 
          }
        }
      }
    }
  });
  
  return { menu: safeParseMenuJson(response.text || "") };
};

export const generateClipperBriefFromApi = async (menuTitle: string, hookType: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Create a viral short-form video brief (TikTok/Reels) for my video editor.
    PRODUCT: CaterPro AI (Menu automation for chefs).
    CONTENT THEME: ${menuTitle}.
    HOOK STYLE: ${hookType}.
    
    Format as:
    1. THE HOOK (Text on screen + Voiceover)
    2. THE VISUAL STORYBOARD (What to show on screen)
    3. EDITING STYLE (Fast cuts, captions, emojis)
    4. CALL TO ACTION (Bio link info)`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text || "Brief generation failed.";
};

export const generateWhopSEO = async (niche: string): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Architect a WHOP Marketplace listing for: "${niche}".
    CRITICAL CHECKLIST:
    1. TITLE: 20-30 chars. MUST include a number (e.g. 2026, 7-Figure, +30%).
    2. HEADLINE: 50-80 chars. Benefit-focused.
    3. DESCRIPTION: 100-200 words. Use bullet points. Focus on outcomes, not features.
    4. URGENCY: Include "Limited founder slots" or "Trial active".
    5. FRESHNESS: Use "2026 Edition" or "Updated".
    
    Return JSON with fields: title, headline, description, tags.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    headline: { type: Type.STRING },
                    description: { type: Type.STRING },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    });
    return JSON.parse(response.text || "{}");
};

export const generateSocialCaption = async (menuTitle: string, description: string, platform: string = 'facebook'): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Viral ${platform} post for: "${menuTitle}". Content: ${description}.`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text?.trim() || "";
};

export const generateWhatsAppStatus = async (menuTitle: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `3 WhatsApp updates for "${menuTitle}". Emojis included.`,
      config: { thinkingConfig: { thinkingBudget: 0 } }
  });
  return response.text?.trim() || "";
};

export const generateMenuImageFromApi = async (title: string, description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `A high-quality, professional food photography shot of ${title}. ${description}. Elegant plating, cinematic lighting, gourmet catering style.` }] },
    config: {
        imageConfig: { aspectRatio: "16:9" }
    }
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  throw new Error("No image generated");
};

export const regenerateMenuItemFromApi = async (oldText: string, prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Update this menu item: "${oldText}" based on this request: "${prompt}". Return ONLY the updated menu item text.`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text?.trim() || oldText;
};

export const generateStudyGuideFromApi = async (topic: string, curriculum: string, level: string, type: 'guide' | 'curriculum'): Promise<EducationContent> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Create a professional ${type === 'guide' ? 'study guide' : 'curriculum syllabus'} for the topic "${topic}". 
    Standard: ${curriculum}. Level: ${level}.
    Include overview, core modules with points, key vocabulary, assessment criteria, and practical exercises.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 0 },
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
    return JSON.parse(response.text || "{}");
};

export const generateVideoFromApi = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '9:16'
    }
  });
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${getApiKey()}`;
};

export const analyzeReceiptFromApi = async (base64: string): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64 } },
                { text: 'Analyze this receipt and extract merchant name, date, total amount, and categorize the expenses. Return JSON.' }
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

export const analyzeLabelFromApi = async (base64: string, dietaryRestrictions: string[]): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64 } },
                { text: `Analyze this food label for the following dietary restrictions: ${dietaryRestrictions.join(', ')}. Provide a suitability score out of 10, flag restricted ingredients, and give reasoning. Return JSON.` }
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

export const generateCulinaryInfographic = async (type: 'comparison' | 'meat_chart'): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = type === 'comparison' 
        ? "Create a professional infographic comparing a 'Chef' vs a 'Cook'. High-contrast typography, minimalist design, educational layout."
        : "Create a professional culinary meat mapping chart showing primal cuts. Elegant technical drawing style, professional catering educational asset.";
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "4:3" } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("Infographic generation failed");
};
