
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
            aiKeywords: ensureArray(parsed.aiKeywords),
            businessAnalysis: ensureObjectArray(parsed.businessAnalysis),
            safetyProtocols: ensureArray(parsed.safetyProtocols)
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

  const prompt = `You are a Michelin-star catering strategist and business consultant. 
  Create a menu proposal for ${params.eventType}. 
  Guest Count: ${params.guestCount}. Budget: ${params.budget}. Cuisine: ${params.cuisine}. 
  
  ${strategyContext}
  
  BUSINESS LOGIC REQUIREMENTS:
  1. MENU ENGINEERING: Identify which items are 'Stars' (high profit/popularity), 'Plow Horses', 'Puzzles', or 'Dogs'.
  2. EVOCATIVE DESCRIPTIONS: Use sensorially rich, nostalgia-driven descriptions for each dish to increase perceived value.
  3. SAFETY: Include HACCP (Hazard Analysis and Critical Control Points) protocols for cross-contamination and transport.
  
  Return JSON. Categorized Shopping List in ${params.currency}.`;
  
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
          businessAnalysis: {
              type: Type.ARRAY,
              items: {
                  type: Type.OBJECT,
                  properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING, description: 'Star, Plow Horse, Puzzle, or Dog' },
                      profitMargin: { type: Type.NUMBER, description: '1-10' },
                      popularityPotential: { type: Type.NUMBER, description: '1-10' },
                      evocativeDescription: { type: Type.STRING }
                  }
              }
          },
          safetyProtocols: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'HACCP Safety Checkpoints' },
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
        required: ["menuTitle", "description", "businessAnalysis", "safetyProtocols"]
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

export const generateWhopSEO = async (niche: string): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `You are a Whop Discovery SEO Expert. Generate high-performance listing assets for the niche: "${niche}".
    
    1. OPTIMIZED HEADLINE: Under 80 characters. Start with the Benefit. (e.g. AI Catering System: Automate Proposals).
    2. OPTIMIZED DESCRIPTION: Use the "Results-First" framework. Explain why a buyer will make more money or save time.
    3. SEARCH TAGS: 5 precise tags used on Whop (e.g. #Hospitality, #AI, #Automation).
    
    Return structured JSON.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    optimizedTitle: { type: Type.STRING },
                    optimizedDescription: { type: Type.STRING },
                    searchTags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["optimizedTitle", "optimizedDescription", "searchTags"]
            }
        }
    });
    return JSON.parse(response.text);
};

export const generateSocialCaption = async (menuTitle: string, description: string, platform: string = 'facebook'): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    let platformSpecific = "";
    if (platform === 'pinterest') {
        platformSpecific = "Write a high-converting Pinterest Pin description. Focus on aesthetic culinary keywords, visual appeal, and 'lifestyle' aspirations. Use 3 specific hashtags.";
    } else if (platform === 'reddit') {
        platformSpecific = "Write a long-form, value-first Reddit post for r/Chefit. Focus on a 'Case Study' format. Headline: How I cut catering paperwork by 80% with AI. Explain the workflow clearly. Avoid sounding like an ad. Mention the tool is free for chefs.";
    } else if (platform === 'twitter') {
        platformSpecific = "Write a short, punchy 2026 tweet with a curiosity-driven hook. Under 240 chars.";
    } else {
        platformSpecific = `Write a viral ${platform} post focusing on the ease of generating this menu instantly.`;
    }

    const prompt = `${platformSpecific} Topic: "${menuTitle}". Content: ${description}. Link: https://caterpro-ai.web.app/`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text?.trim() || "";
};

export const generateWhatsAppStatus = async (menuTitle: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Write 3 curiosity-driven WhatsApp Status updates for "${menuTitle}". Include emojis.`;
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
