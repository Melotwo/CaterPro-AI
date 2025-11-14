import { GoogleGenAI, Type } from "@google/genai";
import { Menu } from "../types.ts";

export interface MenuGenerationParams {
  eventType: string;
  guestCount: string;
  budget: string;
  serviceStyle: string;
  cuisine: string;
  dietaryRestrictions: string[];
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
      serviceNotes: {
        type: Type.ARRAY,
        description: "Expert tips on plating, presentation, and service flow suitable for the event type. e.g., 'Serve appetizers on circulating platters'.",
        items: { type: Type.STRING },
      },
      deliveryLogistics: {
        type: Type.ARRAY,
        description: "A plan for delivery and setup. Include items like suggested delivery radius with fees (e.g., 'Standard Delivery (up to 10 miles): $25'), packaging notes for hot/cold items, and an on-site setup checklist.",
        items: { type: Type.STRING },
      },
    },
    required: ['menuTitle', 'description', 'appetizers', 'mainCourses', 'sideDishes', 'dessert', 'serviceNotes', 'deliveryLogistics'],
  };

  const systemInstruction = `You are a world-class catering consultant and event planner with experience from high-end hospitality brands like Disney. Your tone is professional, creative, and meticulous. Your entire response must conform to the provided JSON schema. Create a cohesive and detailed menu proposal based on the user's event criteria, including a practical delivery and logistics plan.`;

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

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
    },
  });
  
  const menuObject: Menu = JSON.parse(response.text);

  const totalItems = [
    ...(menuObject.appetizers || []),
    ...(menuObject.mainCourses || []),
    ...(menuObject.sideDishes || []),
    ...(menuObject.dessert || []),
    ...(menuObject.serviceNotes || []),
    ...(menuObject.deliveryLogistics || [])
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
