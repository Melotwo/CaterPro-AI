import { GoogleGenAI, Modality, Type } from "@google/genai";
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
    // 1. Try parsing directly
    return JSON.parse(text);
  } catch (e) {
    // 2. Try extracting from markdown ```json ... ```
    const match = text.match(/```json([\s\S]*?)```/);
    if (match) {
      return JSON.parse(match[1]);
    }
    // 3. Try extracting from markdown ``` ... ```
    const matchGeneric = text.match(/```([\s\S]*?)```/);
    if (matchGeneric) {
        try {
            return JSON.parse(matchGeneric[1]);
        } catch (e2) {
            // ignore
        }
    }
    throw new Error("Failed to parse JSON response from AI.");
  }
}

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
    You are an expert catering menu planner. Your task is to generate a complete, professional, and well-structured catering proposal based on the user's requirements.

    **Event Details:**
    - **Event Type:** ${eventType}
    - **Number of Guests:** ${guestCount}
    - **Budget Level:** ${budget} (Translate this to menu complexity and ingredient choices).
    - **Service Style:** ${serviceStyle}
    - **Cuisine Style:** ${cuisine}
    - **Dietary Restrictions:** ${dietaryRestrictions.join(', ') || 'None'}

    **Instructions:**
    1.  **Create a Full Menu:** Generate a cohesive menu with appetizers, main courses, sides, and dessert.
    2.  **Address Dietary Needs:** Explicitly state how restrictions are accommodated in 'dietaryNotes'.
    3.  **Create Checklists:** Provide 'Mise en Place', 'Service & Plating Notes', and 'Delivery & Logistics' checklists.
    4.  **Shopping List:** Group items logically by store type (e.g., 'Supermarket', 'Butcher'), then by category.
    5.  **Location & Currency:** If location data is available, infer the local currency (e.g., ZAR, USD, EUR) for the 'deliveryFeeStructure'. Default to USD if unknown.

    **IMPORTANT: OUTPUT FORMAT**
    You MUST return the response as a VALID JSON object. Do not include any conversational text before or after the JSON.
    
    The JSON structure must strictly follow this schema:
    {
      "menuTitle": "string",
      "description": "string",
      "appetizers": ["string"],
      "mainCourses": ["string"],
      "sideDishes": ["string"],
      "dessert": ["string"],
      "dietaryNotes": ["string"],
      "beveragePairings": [
        { "menuItem": "string", "pairingSuggestion": "string" }
      ],
      "miseEnPlace": ["string"],
      "serviceNotes": ["string"],
      "deliveryLogistics": ["string"],
      "shoppingList": [
        { 
          "store": "string", 
          "category": "string", 
          "item": "string", 
          "quantity": "string",
          "estimatedCost": "string",
          "brandSuggestion": "string"
        }
      ],
      "recommendedEquipment": [
        { "item": "string", "description": "string" }
      ],
      "deliveryFeeStructure": {
        "baseFee": number,
        "perUnitRate": number,
        "unit": "mile" | "km",
        "currency": "string"
      }
    }
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      // NOTE: We cannot use responseMimeType: 'application/json' when using googleMaps tools.
      // We must request JSON in the prompt and parse the text manually.
      tools: [{ googleMaps: {} }],
      toolConfig: latitude && longitude ? {
        retrievalConfig: {
          latLng: { latitude, longitude }
        }
      } : undefined
    }
  });

  if (!response.text) {
      throw new Error("AI returned an empty response.");
  }

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
    const prompt = `
      You are an expert chef modifying a menu item.
      Original item: "${originalItem}"
      Instruction: "${instruction}"
      Generate a new version of the menu item based on the instruction.
      Return ONLY the new item text, nothing else.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text.trim();
};

export const generateCustomMenuItemFromApi = async (description: string, category: string): Promise<string> => {
    const prompt = `
        You are an expert chef creating a new menu item.
        Description: "${description}"
        Category: "${category}"
        Return ONLY the item name and its brief description as a single string.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text.trim();
};

export const generateMenuImageFromApi = async (title: string, description: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: `Generate a photorealistic, high-end culinary photograph of a catering spread that perfectly matches this title and description. The style should be Michelin-star quality: elegant plating, dramatic but soft lighting, and professional food styling suitable for Instagram or a high-end portfolio. Do not include any text or logos. Title: "${title}". Description: "${description}".` }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image was generated.");
};

export const generateProductImageFromApi = async (productName: string, description: string): Promise<string> => {
    const prompt = `Professional product photography of ${productName}. ${description}. High resolution, studio lighting, photorealistic, commercial aesthetic, white background.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image was generated.");
};

export const findSuppliersNearby = async (latitude: number, longitude: number): Promise<Supplier[]> => {
    const prompt = "Find local catering suppliers, specialty food wholesalers, and commercial kitchen rental services near me. For each, provide its name and a brief description of its specialty.";

    // When using tools like Maps, we must handle the JSON manually if schema validation conflicts
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt + " Return the results as a JSON array of objects with 'name' and 'specialty' fields.",
        config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
                retrievalConfig: {
                    latLng: { latitude, longitude }
                }
            }
        },
    });
    
    // Use the same robust extractor
    const suppliers: Omit<Supplier, 'mapsUri' | 'title'>[] = extractJson(response.text);
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mappedSuppliers: Supplier[] = suppliers.map(supplier => {
        const matchingChunk = chunks.find(chunk => chunk.maps?.title?.toLowerCase().includes(supplier.name.toLowerCase()));
        return {
            ...supplier,
            mapsUri: matchingChunk?.maps?.uri,
            title: matchingChunk?.maps?.title,
        };
    });

    return mappedSuppliers;
};

export const generateStudyGuideFromApi = async (
  topic: string, 
  curriculum: string, 
  level: string, 
  type: 'guide' | 'curriculum'
): Promise<EducationContent> => {
  const prompt = `
    You are a professional Hospitality Educator and Curriculum Developer.
    
    **Task:** Create a ${type === 'guide' ? 'Student Study Guide' : 'Professional Curriculum Syllabus'}.
    **Subject:** ${topic}
    **Standard/Curriculum:** ${curriculum} (Pay strict attention to the terminology and standards used in this specific region/program).
    **Level:** ${level}

    **Requirements:**
    1. **Overview:** A brief introduction to the module.
    2. **Modules/Lessons:** Breakdown the topic into 4-6 key learning modules.
       - If type is 'guide': Provide summary notes and key concepts for studying.
       - If type is 'curriculum': Provide learning outcomes and lesson plan structures.
    3. **Key Vocabulary:** Important terms defined.
    4. **Assessment Criteria:** How the student will be judged (theoretical or practical).
    5. **Practical Exercises:** 3-5 concrete tasks or recipes to practice.

    **IMPORTANT:**
    Return the response as a valid JSON object matching this schema:
    {
      "title": "string",
      "curriculum": "string",
      "level": "string",
      "overview": "string",
      "modules": [{ "title": "string", "content": ["string"] }],
      "keyVocabulary": ["string"],
      "assessmentCriteria": ["string"],
      "practicalExercises": ["string"]
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: 'application/json'
    }
  });

  if (!response.text) throw new Error("No content generated.");
  return JSON.parse(response.text);
};
