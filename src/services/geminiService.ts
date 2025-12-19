
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
 */
export const generateMenuFromApi = async ({
  eventType,
  guestCount,
  budget,
  serviceStyle,
  cuisine,
  dietaryRestrictions,
}: MenuGenerationParams): Promise<MenuGenerationResult> => {
  
  const prompt = `
    You are an expert Michelin-star catering menu planner. 
    Create a professional, detailed menu proposal for:
    - Event: ${eventType}
    - Guests: ${guestCount}
    - Budget: ${budget}
    - Style: ${serviceStyle}
    - Cuisine: ${cuisine}
    - Restrictions: ${dietaryRestrictions.join(', ') || 'None'}

    STRICT RULES:
    1. Perfect culinary spelling (e.g., 'Hors d'oeuvres').
    2. Organize into shopping lists by category.
    3. Include delivery fees and mise en place.
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
        required: ["menuTitle", "description", "appetizers", "mainCourses"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI failed to generate menu content.");
  const menu: Menu = JSON.parse(text);

  const totalChecklistItems = [
    ...(menu.appetizers || []),
    ...(menu.mainCourses || []),
    ...(menu.shoppingList || []),
  ].length;
  
  return { menu, totalChecklistItems };
};

/**
 * Generates a high-end food photograph for a menu or product.
 */
export const generateMenuImageFromApi = async (title: string, description: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: `High-end cinematic culinary photograph of: "${title}". ${description}. Style: Professional food styling, soft natural lighting, shallow depth of field, neutral background. No text, no people, no watermarks.` }],
        }
    });
    
    // Safety check for candidates
    if (!response.candidates?.[0]?.content?.parts) {
        throw new Error("Image generation was blocked or failed.");
    }

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return part.inlineData.data;
    }
    throw new Error("No image data returned from AI.");
};

/**
 * Regenerates a specific menu item based on user instructions.
 */
export const regenerateMenuItemFromApi = async (originalText: string, instruction: string): Promise<string> => {
  const prompt = `Original menu item: "${originalText}". User instruction for modification: "${instruction}". Rewrite the menu item to reflect these changes. Keep it concise and professional.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  return response.text?.trim() || originalText;
};

/**
 * Generates educational content (Study Guide or Curriculum) based on culinary standards.
 */
export const generateStudyGuideFromApi = async (topic: string, curriculum: string, level: string, type: 'guide' | 'curriculum'): Promise<EducationContent> => {
  const prompt = `Generate a ${type === 'guide' ? 'detailed Study Guide' : 'Curriculum Syllabus'} for the topic: "${topic}". 
  Standard: ${curriculum}. Level: ${level}. 
  Include: Title, Overview, Modules (with title and 3-5 content bullet points each), Key Vocabulary, Assessment Criteria, and Practical Exercises.`;

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
              },
              required: ["title", "content"]
            }
          },
          keyVocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
          assessmentCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
          practicalExercises: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "curriculum", "level", "overview", "modules", "keyVocabulary", "assessmentCriteria", "practicalExercises"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI failed to generate educational content.");
  return JSON.parse(text);
};

export const generateSocialCaption = async (menuTitle: string, description: string, platform: string = 'instagram'): Promise<string> => {
    const prompt = `Write a viral ${platform} caption for: "${menuTitle}". Content: ${description}. Tone: Professional and enticing. Perfect spelling. Link: https://caterpro-ai.web.app/`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text?.trim() || "";
};

export const generateAssignmentEmail = async (menuTitle: string, menuDescription: string): Promise<string> => {
    const prompt = `Draft a professional email pitching CaterPro AI (an AI tool for chefs) to Limpopo Chefs Academy. Context: Built by a student with ADHD/Dyslexia to solve paperwork hurdles. Attached menu: ${menuTitle}.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text?.trim() || "";
};

export const generateSocialVideoFromApi = async (menuTitle: string, description: string): Promise<string> => {
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Vertical cinematic commercial for a catering event titled "${menuTitle}". Glistening gourmet food, professional plating, elegant vibe.`,
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
