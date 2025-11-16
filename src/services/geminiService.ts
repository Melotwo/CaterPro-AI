import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Menu, ShoppingListItem, Chef, BeveragePairing } from "../types.ts";

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
       beveragePairings: {
        type: Type.ARRAY,
        description: "Suggest a wine or non-alcoholic beverage pairing for each appetizer and main course. Each object should link a specific menu item to its suggested pairing.",
        items: {
          type: Type.OBJECT,
          properties: {
            menuItem: { type: Type.STRING, description: "The exact name of the appetizer or main course item from the generated menu." },
            pairingSuggestion: { type: Type.STRING, description: "A concise beverage pairing suggestion. e.g., 'A crisp Sauvignon Blanc or a sparkling elderflower pressé'." }
          },
          required: ['menuItem', 'pairingSuggestion']
        }
      },
      miseEnPlace: {
        type: Type.ARRAY,
        description: "A detailed checklist of preparation tasks (mise en place) to be done hours or a day before the event. e.g., 'Wash and chop all vegetables for the salad', 'Prepare the marinade for the chicken', 'Pre-portion dessert garnishes'.",
        items: { type: Type.STRING },
      },
      serviceNotes: {
        type: Type.ARRAY,
        description: "Expert tips on plating, presentation, and service flow suitable for the event type. e.g., 'Serve appetizers on circulating platters'.",
        items: { type: Type.STRING },
      },
      deliveryLogistics: {
        type: Type.ARRAY,
        description: "A plan for delivery and setup. Include items like suggested delivery radius with fees (e.g., 'Standard Delivery (up to 10 miles): $25'), packaging notes for hot/cold items, and an on-site setup checklist. If user location is provided, suggest 1-2 specific, real local stores or online services for ingredient sourcing.",
        items: { type: Type.STRING },
      },
      shoppingList: {
        type: Type.ARRAY,
        description: "A comprehensive shopping list. For 3-5 key non-perishable or specialty items (e.g., high-quality olive oil, specific spices), provide an enticing `description`, a relevant `affiliateSearchTerm`, an `estimatedCost` in ZAR (e.g., 'R80 - R120'), and a `brandSuggestion` (e.g., 'Woolworths, Knorr'). For all other items, omit these four fields.",
        items: {
          type: Type.OBJECT,
          properties: {
            store: { type: Type.STRING, description: "The suggested store or type of store for purchasing the item. e.g., 'Local Grocer (e.g., Safeway)', 'Specialty Butcher', 'Online Spice Shop'." },
            category: { type: Type.STRING, description: "e.g., 'Produce', 'Meat & Seafood', 'Pantry'" },
            item: { type: Type.STRING, description: "e.g., 'Roma Tomatoes'" },
            quantity: { type: Type.STRING, description: "e.g., '5 lbs', '2 dozen', '1 bottle'" },
            description: { type: Type.STRING, description: "For key specialty items, a brief, enticing description of why this specific type of item is recommended." },
            affiliateSearchTerm: { type: Type.STRING, description: "For key specialty items, a search term optimized for South African e-commerce sites like Takealot (e.g., 'organic coconut milk')." },
            estimatedCost: { type: Type.STRING, description: "For key specialty items, provide an estimated cost range in South African Rand (ZAR), e.g., 'R 80 - R 120'." },
            brandSuggestion: { type: Type.STRING, description: "For key specialty items, suggest 1-2 specific, well-known brands available in major South African retailers like Woolworths, Pick n Pay, or Checkers." }
          },
          required: ['store', 'category', 'item', 'quantity']
        }
      },
      recommendedEquipment: {
        type: Type.ARRAY,
        description: "A list of 3-5 essential but potentially overlooked pieces of catering equipment or high-quality supplies relevant to the generated menu. For each item, provide a brief description of its use or why it's recommended.",
        items: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING, description: "The name of the equipment or supply. e.g., 'Insulated Food Pan Carrier', 'High-Quality Chef's Knife', 'Disposable Chafing Dishes'." },
            description: { type: Type.STRING, description: "A brief, helpful description. e.g., 'Crucial for maintaining safe food temperatures during transport and service.', 'A sharp, reliable knife is a chef's best friend for prep work.'." }
          },
          required: ['item', 'description']
        }
      }
    },
    required: ['menuTitle', 'description', 'appetizers', 'mainCourses', 'sideDishes', 'dessert', 'beveragePairings', 'miseEnPlace', 'serviceNotes', 'deliveryLogistics', 'shoppingList', 'recommendedEquipment'],
  };

  const systemInstruction = `You are a world-class catering consultant and event planner with experience from high-end hospitality brands like Disney. Your tone is professional, creative, and meticulous. Your entire response must conform to the provided JSON schema. Create a cohesive and detailed menu proposal based on the user's event criteria, including beverage pairings for appetizers and main courses, a practical delivery and logistics plan, a comprehensive shopping list with quantities appropriate for the number of guests, and a list of recommended equipment or supplies that would be helpful for executing this menu, which can be used for affiliate marketing.`;

  let prompt = `
    Generate a complete catering menu proposal based on the following criteria:

    - **Event Type:** ${eventType}
    - **Number of Guests:** ${guestCount}
    - **Budget Level:** ${budget}
    - **Service Style:** ${serviceStyle}
    - **Cuisine Style:** ${cuisine === 'Any' ? 'Be creative and globally inspired' : cuisine}
  `;

  if (dietaryRestrictions.length > 0) {
      prompt += `\n- **Important Dietary Restrictions to Accommodate:** ${dietaryRestrictions.join(', ')}. Ensure some options are suitable.`;
  }
  
  if (latitude && longitude) {
      prompt += `\n- **User Location:** Latitude ${latitude}, Longitude ${longitude}. Use this information to suggest specific, real local grocery stores or specialty shops in the 'Delivery & Logistics' section where the user could purchase the ingredients.`;
  }

  const config: any = {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
  };

  if (latitude && longitude) {
      config.tools = [{ googleMaps: {} }];
      config.toolConfig = {
          retrievalConfig: {
              latLng: {
                  latitude: latitude,
                  longitude: longitude
              }
          }
      };
  }


  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: config,
  });
  
  const menuObject: Menu = JSON.parse(response.text);

  // Extract grounding chunks and add them to the menu object
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
      menuObject.groundingChunks = groundingChunks;
  }

  const totalItems = [
    ...(menuObject.appetizers || []),
    ...(menuObject.mainCourses || []),
    ...(menuObject.sideDishes || []),
    ...(menuObject.dessert || []),
    ...(menuObject.beveragePairings || []),
    ...(menuObject.miseEnPlace || []),
    ...(menuObject.serviceNotes || []),
    ...(menuObject.deliveryLogistics || []),
    ...(menuObject.shoppingList || [])
  ].length;

  return {
    menu: menuObject,
    totalChecklistItems: totalItems
  };
};

export const regenerateMenuItemFromApi = async (originalItem: string, instruction: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
    Original menu item: "${originalItem}"
    User instruction: "${instruction}"
    
    Based on the user instruction, regenerate the menu item. Return only the new text for the menu item, without any labels or markdown.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            // Keep the response focused on the task
            temperature: 0.7,
            topP: 0.95,
        }
    });

    return response.text.trim();
};

export const generateCustomMenuItemFromApi = async (description: string, category: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `You are an expert menu writer for a high-end catering company. Your tone is creative and appealing.`;
    const prompt = `
    A user wants to add a custom item to their menu in the '${category}' section.
    Based on their description, create a single, compelling menu item. This should include a creative name and a brief, mouth-watering description.
    
    User's Description: "${description}"
    
    Return ONLY the new text for the menu item, formatted as a single string. Do not include any labels, markdown, or introductory phrases like "Here is the item:".
    For example, if the user describes a spicy shrimp taco, a good response would be: "Chili-Lime Shrimp Tacos: Pan-seared shrimp with a zesty chili-lime slaw, avocado crema, and fresh cilantro, served on a warm corn tortilla."
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.8,
        }
    });

    return response.text.trim();
};

export const generateMenuImageFromApi = async (menuTitle: string, description: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Generate a highly detailed, photorealistic image in the style of professional food photography with natural lighting. This image is for a menu proposal and should be beautiful, elegant, high-quality, and evoke a sense of fine dining or a celebratory event. Do not include any text, logos, or borders in the image.
    
    Menu Title: "${menuTitle}"
    Menu Description: "${description}"
    
    The image should visually capture the essence of this menu. For example, if it's an Italian wedding menu, an image of a beautifully set table in a rustic Tuscan villa would be appropriate. If it's a modern corporate lunch, a clean, bright shot of elegant, minimalist dishes would be suitable.`;

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

    throw new Error("No image data found in API response.");
};

export const findChefsNearby = async (latitude: number, longitude: number): Promise<Chef[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        Find up to 5 highly-rated professional chefs, personal chefs, or small catering businesses available for hire for private events near the provided location. 
        For each one, provide their name and a brief description of their specialty (e.g., "Italian cuisine", "Pastry expert", "Farm-to-table specialist").
        Format the output as a simple list. For example:
        - Chef John Doe: Specializes in modern French cuisine.
        - The Catering Co.: Known for large-scale corporate event catering.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
                retrievalConfig: {
                    latLng: { latitude, longitude }
                }
            }
        },
    });

    const textResponse = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Simple text parsing for the chef list
    const chefsFromText: Chef[] = textResponse.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => {
            const parts = line.replace('-', '').trim().split(':');
            const name = parts[0]?.trim() || 'Unknown Chef';
            const specialty = parts[1]?.trim() || 'No specialty listed.';
            return { name, specialty };
        });

    if (chefsFromText.length === 0 && groundingChunks.length > 0) {
        // Fallback to using only grounding chunks if text parsing fails
        return groundingChunks
            .filter(chunk => chunk.maps && chunk.maps.title)
            .map(chunk => ({
                name: chunk.maps!.title!,
                specialty: 'Catering service found nearby.',
                mapsUri: chunk.maps!.uri,
                title: chunk.maps!.title
            }));
    }

    // Try to match grounding chunks to the parsed text to add map links
    const chefsWithMaps: Chef[] = chefsFromText.map(chef => {
        const matchedChunk = groundingChunks.find(chunk => 
            chunk.maps && chunk.maps.title && chunk.maps.title.toLowerCase().includes(chef.name.toLowerCase())
        );
        return {
            ...chef,
            mapsUri: matchedChunk?.maps?.uri,
            title: matchedChunk?.maps?.title,
        };
    });

    return chefsWithMaps;
};
