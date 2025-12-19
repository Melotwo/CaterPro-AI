
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Menu, Supplier, EducationContent } from "../types";

export interface MenuGenerationParams {
  eventType: string;
  guestCount: string;
  budget: string;
  serviceStyle: string;
  cuisine: string;
  dietaryRestrictions: string[];
  latitude?: number;
  longitude?: number;
}

export interface MenuGenerationResult {
  menu: Menu;
  totalChecklistItems: number;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a full catering menu proposal using Gemini 3 Flash.
 * Uses responseSchema to ensure valid JSON matching the Menu interface.
 */
export const generateMenuFromApi = async ({
  eventType,
  guestCount,
  budget,
  serviceStyle,
  cuisine,
  dietaryRestrictions,
  latitude,
  longitude,
}: MenuGenerationParams): Promise<MenuGenerationResult> => {
  
  const prompt = `
    You are an expert Michelin-star catering menu planner. 
    Create a professional, detailed menu proposal for the following event:
    
    - Event Type: ${eventType}
    - Guests: ${guestCount}
    - Budget: ${budget}
    - Service: ${serviceStyle}
    - Cuisine: ${cuisine}
    - Dietary Restrictions: ${dietaryRestrictions.join(', ') || 'None'}

    STRICT RULES:
    1. Spelling must be 100% accurate (e.g., 'Hors d'oeuvres', 'Mise en place').
    2. The menu must be sophisticated and appropriate for the budget level.
    3. Include a detailed shopping list organized by store/category.
    4. Provide beverage pairings for specific items.
    5. Include precise Mise en place and service notes.
    6. Include a 'deliveryFeeStructure' for logic calculations.
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
                pairingSuggestion: { type: Type.STRING }
              }
            }
          },
          miseEnPlace: { type: Type.ARRAY, items: { type: Type.STRING } },
          serviceNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          deliveryLogistics: { type: Type.ARRAY, items: { type: Type.STRING } },
          deliveryFeeStructure: {
            type: Type.OBJECT,
            properties: {
              baseFee: { type: Type.NUMBER },
              perUnitRate: { type: Type.NUMBER },
              unit: { type: Type.STRING },
              currency: { type: Type.STRING }
            }
          },
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
                affiliateSearchTerm: { type: Type.STRING },
                estimatedCost: { type: Type.STRING },
                brandSuggestion: { type: Type.STRING }
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
      },
      tools: [{ googleSearch: {} }]
    }
  });

  if (!response.text) throw new Error("AI returned an empty response.");

  const menu: Menu = JSON.parse(response.text);

  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    menu.groundingChunks = response.candidates[0].groundingMetadata.groundingChunks;
  }

  const totalChecklistItems = [
    ...(menu.appetizers || []),
    ...(menu.mainCourses || []),
    ...(menu.sideDishes || []),
    ...(menu.dessert || []),
    ...(menu.dietaryNotes || []),
    ...(menu.beveragePairings || []),
    ...(menu.miseEnPlace || []),
    ...(menu.serviceNotes || []),
    ...(menu.deliveryLogistics || []),
    ...(menu.shoppingList || []),
  ].length;
  
  return { menu, totalChecklistItems };
};

export const regenerateMenuItemFromApi = async (originalItem: string, instruction: string): Promise<string> => {
    const prompt = `You are a Michelin-star chef. Instruction: "${instruction}". Original item: "${originalItem}". Return ONLY the new text. PERFECT SPELLING MANDATORY.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text.trim();
};

export const generateCustomMenuItemFromApi = async (description: string, category: string): Promise<string> => {
    const prompt = `Create a professional menu item for ${category} based on: "${description}". Return as "Name: Description". PERFECT SPELLING.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text.trim();
};

export const generateMenuImageFromApi = async (title: string, description: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: `Generate a photorealistic, high-end culinary photograph of: "${title}". ${description}. Style: Michelin-star quality, dramatic lighting, professional food styling. NO TEXT OR LOGOS IN IMAGE.` }],
        }
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return part.inlineData.data;
    }
    throw new Error("No image was generated.");
};

export const generateProductImageFromApi = async (productName: string, description: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Professional product photography of ${productName}. ${description}. Studio lighting, clean white background, photorealistic.`,
        config: { numberOfImages: 1, aspectRatio: '1:1', outputMimeType: 'image/png' },
    });
    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    throw new Error("No image was generated.");
};

export const findSuppliersNearby = async (latitude: number, longitude: number): Promise<Supplier[]> => {
    const prompt = "Find local catering suppliers near me. Return as JSON array with 'name' and 'specialty'.";
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleMaps: {} }],
            toolConfig: { retrievalConfig: { latLng: { latitude, longitude } } }
        },
    });
    
    const suppliers: Omit<Supplier, 'mapsUri' | 'title'>[] = JSON.parse(response.text);
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return suppliers.map(supplier => {
        const matchingChunk = chunks.find(chunk => chunk.maps?.title?.toLowerCase().includes(supplier.name.toLowerCase()));
        return { ...supplier, mapsUri: matchingChunk?.maps?.uri, title: matchingChunk?.maps?.title };
    });
};

export const generateStudyGuideFromApi = async (topic: string, curriculum: string, level: string, type: 'guide' | 'curriculum'): Promise<EducationContent> => {
  const prompt = `Create a ${type === 'guide' ? 'Student Study Guide' : 'Professional Curriculum Syllabus'} for ${topic}. Standard: ${curriculum}. Level: ${level}. Return valid JSON. PERFECT SPELLING.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          curriculum: { type: Type.STRING },
          level: { type: Type.STRING },
          overview: { type: Type.STRING },
          modules: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
          keyVocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
          assessmentCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
          practicalExercises: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  if (!response.text) throw new Error("No content generated.");
  return JSON.parse(response.text);
};

export const generateSocialCaption = async (menuTitle: string, description: string, platform: string = 'instagram'): Promise<string> => {
    const prompt = `
        Write a viral ${platform} caption for: "${menuTitle}". 
        Context: ${description}. 
        Goal: Show off the menu and drive traffic to https://caterpro-ai.web.app/.
        Tone: Professional, enticing, and chef-focused. 
        PERFECT SPELLING MANDATORY.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text.trim();
};

export const generateAssignmentEmail = async (menuTitle: string, menuDescription: string): Promise<string> => {
    const prompt = `
        You are a student doing a Coursera assignment. You have built an AI catering assistant called "CaterPro AI".
        Write a professional email to an educator at "Limpopo Chefs Academy".
        
        **GOAL:** Share a menu proposal you generated as proof of your project and ask them to try the tool to see if it could help their students overcome administrative hurdles.
        
        **CONTEXT:** Mention you have ADHD/Dyslexia and built this to handle spelling and logistics—things that used to be a barrier for you.
        **MENU ATTACHED:** ${menuTitle} (${menuDescription}).
        
        **STRICT RULES:**
        1. Subject: Needs to be catchy and professional.
        2. Tone: Respectful, visionary, and professional.
        3. PERFECT SPELLING MANDATORY (especially culinary terms).
        4. Include placeholders [My Name].
        5. Do not mention "Gemini" or "Google"—focus on the tool's impact.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text.trim();
};

export const generateSocialVideoFromApi = async (menuTitle: string, description: string): Promise<string> => {
    const videoPrompt = `A high-end cinematic vertical commercial for a catering menu titled "${menuTitle}". 
    The scene should show steam rising from gourmet food, elegant table settings, and a professional chef's hands garnishing a dish. 
    The lighting should be dramatic and appetizing. No text. 9:16 aspect ratio.`;
    
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '9:16' }
    });
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({operation: operation});
    }
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed.");
    return `${videoUri}&key=${process.env.API_KEY}`;
};
