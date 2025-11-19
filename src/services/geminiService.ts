import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Menu, Supplier } from "../types.ts";

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
// This is more efficient than creating a new instance for every function call.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
      menuTitle: {
        type: Type.STRING,
        description: "A creative and appealing title for the event menu. e.g., 'An Elegant Tuscan Wedding Feast'.",
      },
      description: {
          type: Type.STRING,
          description: "A brief, one or two-sentence mouth-watering description of the overall menu concept."
      },
      appetizers: {
        type: Type.ARRAY,
        description: "A list of 2-3 appetizer options suitable for the event.",
        items: { type: Type.STRING },
      },
      mainCourses: {
        type: Type.ARRAY,
        description: "A list of 2 main course options (e.g., one meat, one vegetarian) that fit the theme.",
        items: { type: Type.STRING },
      },
      sideDishes: {
        type: Type.ARRAY,
        description: "A list of 2-3 side dishes that complement the main courses.",
        items: { type: Type.STRING },
      },
      dessert: {
        type: Type.ARRAY,
        description: "A list of 1-2 dessert options.",
        items: { type: Type.STRING },
      },
      dietaryNotes: {
        type: Type.ARRAY,
        description: "A list of notes explicitly stating how each dietary restriction was accommodated. For example, 'The risotto is made dairy-free by using olive oil and nutritional yeast.'",
        items: { type: Type.STRING },
      },
       beveragePairings: {
        type: Type.ARRAY,
        description: "Suggest a wine or non-alcoholic beverage pairing for each appetizer and main course. Each object should link a specific menu item to its suggested pairing.",
        items: {
          type: Type.OBJECT,
          properties: {
            menuItem: { type: Type.STRING, description: "The exact name of the appetizer or main course item from the generated menu." },
            pairingSuggestion: { type: Type.STRING, description: "The name of the suggested wine, beer, or non-alcoholic drink and a brief reason for the pairing." }
          },
          required: ["menuItem", "pairingSuggestion"],
        },
      },
      miseEnPlace: {
          type: Type.ARRAY,
          description: "A detailed checklist of prep tasks that need to be done before the event (e.g., 'chop vegetables', 'prepare sauces').",
          items: { type: Type.STRING },
      },
      serviceNotes: {
          type: Type.ARRAY,
          description: "Notes on how the food should be served and presented (e.g., 'serve main course on warm plates', 'garnish dessert with fresh mint').",
          items: { type: Type.STRING },
      },
      deliveryLogistics: {
        type: Type.ARRAY,
        description: "A checklist of logistics for delivery and setup (e.g., 'confirm venue access time', 'pack hot food in insulated carriers').",
        items: { type: Type.STRING },
      },
      shoppingList: {
        type: Type.ARRAY,
        description: "A comprehensive shopping list grouped by store, then by category (e.g., 'Produce', 'Meat', 'Pantry'). Include quantities appropriate for the guest count.",
        items: {
          type: Type.OBJECT,
          properties: {
            store: { type: Type.STRING, description: "The suggested store type (e.g., 'Local Supermarket', 'Butcher Shop', 'Specialty Spice Store')." },
            category: { type: Type.STRING, description: "The category of the item (e.g., 'Dairy & Eggs', 'Canned Goods')." },
            item: { type: Type.STRING, description: "The name of the ingredient or supply." },
            quantity: { type: Type.STRING, description: "The quantity needed (e.g., '2 lbs', '1 gallon', '3 bunches')." },
            description: { type: Type.STRING, description: "Optional: A brief, enticing description for specialty or hard-to-find items, useful for affiliate marketing." },
            affiliateSearchTerm: { type: Type.STRING, description: "Optional: A concise search term for finding this item online, optimized for affiliate links." },
            estimatedCost: { type: Type.STRING, description: "Optional: A rough cost estimate for the item, e.g., '$5-7'." },
            brandSuggestion: { type: Type.STRING, description: "Optional: A specific brand recommendation, e.g., 'King Arthur Flour'." },
          },
          required: ["store", "category", "item", "quantity"],
        },
      },
      recommendedEquipment: {
        type: Type.ARRAY,
        description: "A list of 2-3 essential pieces of equipment or supplies for this event (e.g., '8-Quart Chafing Dish', 'Insulated Beverage Dispenser'). These are for affiliate marketing.",
        items: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING, description: "The name of the equipment." },
            description: { type: Type.STRING, description: "A brief description of why it's useful for this event." },
          },
          required: ["item", "description"],
        },
      },
      deliveryFeeStructure: {
          type: Type.OBJECT,
          description: "A structured object for calculating delivery fees based on distance.",
          properties: {
            baseFee: { type: Type.NUMBER, description: "A flat base fee for any delivery." },
            perUnitRate: { type: Type.NUMBER, description: "The cost per mile or km." },
            unit: { type: Type.STRING, description: "The unit of distance, either 'mile' or 'km'." },
            currency: { type: Type.STRING, description: "The ISO 4217 currency code (e.g., 'USD', 'ZAR')." }
          },
          required: ["baseFee", "perUnitRate", "unit", "currency"],
      },
    },
    required: [
      "menuTitle", "description", "appetizers", "mainCourses", "sideDishes", "dessert",
      "dietaryNotes", "beveragePairings", "miseEnPlace", "serviceNotes", "deliveryLogistics", "shoppingList", "recommendedEquipment", "deliveryFeeStructure"
    ],
  };

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
    - **Budget Level:** ${budget} (Translate this to menu complexity and ingredient choices: $ = simple, delicious, budget-friendly; $$ = elegant, higher-quality ingredients; $$$ = luxurious, premium, and specialty ingredients).
    - **Service Style:** ${serviceStyle}
    - **Cuisine Style:** ${cuisine}
    - **Dietary Restrictions:** ${dietaryRestrictions.join(', ') || 'None'}

    **Instructions:**
    1.  **Create a Full Menu:** Generate a cohesive menu with appetizers, main courses, sides, and dessert. Ensure the menu fits all the event details provided.
    2.  **Address Dietary Needs:** For dietary restrictions, either make the whole menu compliant or offer specific, clearly labeled alternatives. In the 'dietaryNotes' section, you MUST explicitly state how each dietary restriction has been accommodated (e.g., "The main course is gluten-free by using cornstarch for the sauce," or "A vegan alternative for the dessert is available upon request."). This is crucial for client communication.
    3.  **Generate Checklists:** Provide detailed checklists for 'Mise en Place', 'Service & Plating Notes', and 'Delivery & Logistics'. These should be practical and actionable for a caterer.
    4.  **Create a Shopping List:** The shopping list is critical. It must be comprehensive. Group items logically by store type (e.g., 'Supermarket', 'Butcher'), then by category (e.g., 'Produce', 'Meat'). Calculate quantities that are appropriate for the specified number of guests.
    5.  **Suggest Pairings & Equipment:** Recommend beverage pairings and 2-3 essential pieces of catering equipment relevant to the menu.
    6.  **Location Grounding:** If latitude and longitude are provided, use this information to ground your suggestions for the shopping list (e.g., suggest store types that would exist in that region) and potentially suggest a local ingredient if relevant.
    7.  **Location-Aware Delivery Fee:** Critically, if latitude and longitude are provided, you MUST determine the country and use its local currency's ISO 4217 code (e.g., 'ZAR' for South Africa, 'USD' for the United States, 'EUR' for France). If no location is provided, default to 'USD'. Provide a reasonable fee structure with a base fee of around 15 units of the local currency and a per-unit rate of around 1.5. Also, determine if 'km' or 'mile' is the standard unit of distance for that country.

    Return the response ONLY in the specified JSON format.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      tools: [{ googleMaps: {} }],
      toolConfig: latitude && longitude ? {
        retrievalConfig: {
          latLng: { latitude, longitude }
        }
      } : undefined
    }
  });

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
    const prompt = `
      You are an expert chef modifying a menu item.
      Original item: "${originalItem}"
      Instruction: "${instruction}"
      Generate a new version of the menu item based on the instruction.
      Return ONLY the new item text, nothing else. For example, if the original is "Classic Beef Lasagna" and the instruction is "make it vegetarian", a good response would be "Mushroom and Spinach Lasagna with a Rich Tomato Sauce".
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
        Based on the description, create a concise, appealing menu item name and a brief description.
        Example: If the description is "A light, summery appetizer with strawberries, goat cheese, and a balsamic glaze.", a good response would be "Whipped Goat Cheese Crostini with Balsamic Strawberries".
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
            parts: [{ text: `Generate a photorealistic, appetizing, high-quality photograph of a catering spread that perfectly matches this title and description. Focus on beautiful lighting and presentation. Do not include any text or logos in the image. Title: "${title}". Description: "${description}".` }],
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

    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "The name of the business." },
                specialty: { type: Type.STRING, description: "A brief description of what the business specializes in (e.g., 'Wholesale produce supplier', 'Gourmet cheese and charcuterie importer')." },
            },
            required: ["name", "specialty"],
        },
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
            tools: [{ googleMaps: {} }],
            toolConfig: {
                retrievalConfig: {
                    latLng: { latitude, longitude }
                }
            }
        },
    });

    const suppliers: Omit<Supplier, 'mapsUri' | 'title'>[] = JSON.parse(response.text);
    
    // Correlate grounding chunks with the generated suppliers
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
