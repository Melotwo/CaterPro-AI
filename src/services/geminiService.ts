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

// Instantiate the GoogleGenAI client once and reuse it for all API calls.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper function to extract JSON from Markdown code blocks
function extractJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/```json([\s\S]*?)```/);
    if (match) return JSON.parse(match[1]);
    const matchGeneric = text.match(/```([\s\S]*?)```/);
    if (matchGeneric) {
        try { return JSON.parse(matchGeneric[1]); } catch (e2) { }
    }
    throw new Error("Failed to parse JSON response from AI.");
  }
}

/**
 * Generates a full catering menu proposal.
 * Uses gemini-2.5-flash as it is the only model supporting googleMaps tool for now.
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
    You are an expert catering menu planner. 
    STRICT RULE: Spelling must be 100% accurate, especially for culinary terms (e.g., 'Hors d'oeuvres', 'Charcuterie').
    
    **Event Details:**
    - **Event Type:** ${eventType}
    - **Number of Guests:** ${guestCount}
    - **Budget Level:** ${budget} (Translate this to menu complexity and ingredient choices).
    - **Service Style:** ${serviceStyle}
    - **Cuisine Style:** ${cuisine}
    - **Dietary Restrictions:** ${dietaryRestrictions.join(', ') || 'None'}

    Return the response as a VALID JSON object matching the provided schema.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: latitude && longitude ? {
        retrievalConfig: {
          latLng: { latitude, longitude }
        }
      } : undefined
    }
  });

  if (!response.text) throw new Error("AI returned an empty response.");

  const menu: Menu = extractJson(response.text);

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
    const suppliers: Omit<Supplier, 'mapsUri' | 'title'>[] = extractJson(response.text);
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

export const generateSocialCaption = async (menuTitle: string, description: string, platform: 'instagram' | 'linkedin' | 'twitter' = 'instagram'): Promise<string> => {
    const prompt = `Write a viral ${platform} caption for: "${menuTitle}". ${description}. PERFECT SPELLING MANDATORY. NO TYPOS. Professional culinary vocabulary. Include Call to action: Visit https://caterpro-ai.web.app/`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text.trim();
};

export const generateSocialReply = async (comment: string): Promise<string> => {
    const prompt = `Write a professional, friendly reply to: "${comment}". Short, helpful, expert tone. PERFECT SPELLING.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text.trim();
};

export const generateViralHook = async (menuTitle: string, description: string): Promise<string> => {
    const prompt = `Generate 3 viral hooks for a video about: "${menuTitle}". 1: Secret, 2: Controversial, 3: Behind the Scenes. PERFECT SPELLING.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text.trim();
};

export const generateFounderMarketingPost = async (platform: 'linkedin' | 'twitter' | 'instagram'): Promise<string> => {
    const prompt = `
        Write a viral launch post for ${platform} for the app "CaterPro AI". 
        
        **ESSENTIAL CONTEXT:** 
        - Founder: Tumi Seroka. 
        - The Backstory: Tumi is a professional chef who struggled with Epilepsy, ADHD, and Dyslexia. Paperwork (menus/proposals) was a nightmare that caused massive anxiety.
        - The Product: CaterPro AI generates professional menus, shopping lists, and proposals in seconds.
        - THE OFFER: Tumi is looking for the **FIRST 50 FOUNDING MEMBERS** to join.
        - PRICE: $199 for LIFETIME ACCESS (No subscription).
        
        **PLATFORM RULES:**
        - LinkedIn: Professional, story-driven, emotional but focused on ROI. Use line breaks.
        - X/Twitter: High energy, punchy, thread-style or single post.
        - Instagram: Visual, lifestyle-focused, brief.
        
        **STRICT RULE:** 100% PERFECT SPELLING. NO TYPOS.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text.trim();
};

export type VideoStyle = 'cinematic' | 'vibrant' | 'minimalist';

export const generateSocialVideoFromApi = async (menuTitle: string, description: string, style: VideoStyle = 'cinematic'): Promise<string> => {
    const videoPrompt = `
        Cinematic, slow-motion vertical commercial for "${menuTitle}". ${description}. 
        Style: ${style}. 
        STRICT RULE: NO TEXT OVERLAYS. DO NOT GENERATE ANY WORDS OR LETTERS IN THE VIDEO SCENE. 
        Focus purely on high-end food textures, steam, and plating. 4K resolution.
    `;

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
    const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};
