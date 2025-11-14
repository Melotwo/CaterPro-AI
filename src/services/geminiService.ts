import { GoogleGenAI, Type } from "@google/genai";

export interface MenuGenerationParams {
  eventType: string;
  guestCount: string;
  budget: string;
  cuisine: string;
  dietaryRestrictions: string[];
}

export interface MenuGenerationResult {
  menuMarkdown: string;
  totalChecklistItems: number;
}

export const generateMenuFromApi = async ({
  eventType,
  guestCount,
  budget,
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
    },
    required: ['menuTitle', 'description', 'appetizers', 'mainCourses', 'sideDishes', 'dessert', 'serviceNotes'],
  };

  const systemInstruction = `You are a world-class catering consultant and event planner with experience from high-end hospitality brands like Disney. Your tone is professional, creative, and meticulous. Your entire response must conform to the provided JSON schema. Create a cohesive and detailed menu proposal based on the user's event criteria.`;

  let prompt = `
    Generate a complete catering menu proposal based on the following criteria:

    - **Event Type:** ${eventType}
    - **Number of Guests:** ${guestCount}
    - **Budget Level:** ${budget}
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
  
  const responseObject = JSON.parse(response.text);

  // Reconstruct the menu into a Markdown string for rendering
  let menuMarkdown = `## ${responseObject.menuTitle || 'Your Event Menu'}\n\n`;
  menuMarkdown += `*${responseObject.description || ''}*\n\n---\n\n`;

  const sections = {
    'Appetizers': responseObject.appetizers,
    'Main Courses': responseObject.mainCourses,
    'Side Dishes': responseObject.sideDishes,
    'Dessert': responseObject.dessert,
    'Service & Plating Notes': responseObject.serviceNotes,
  };

  let totalItems = 0;
  for (const [title, items] of Object.entries(sections)) {
    if (items && items.length > 0) {
      menuMarkdown += `## ${title}\n`;
      items.forEach((item: string) => {
          menuMarkdown += `* ${item}\n`;
          totalItems++;
      });
      menuMarkdown += '\n';
    }
  }

  return {
    menuMarkdown: menuMarkdown,
    totalChecklistItems: totalItems // Using this to represent total actionable items in the plan
  };
};