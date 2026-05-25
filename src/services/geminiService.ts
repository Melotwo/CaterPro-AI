export function getApiKey(): string {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

/**
 * Clean markdown code block markers and aggressively slice string to first '{' and last '}'
 * before parsing it as valid JSON. Uses a secondary regex extraction fallback if needed.
 */
const cleanAndParseJson = (rawText: string): any => {
  // Strip markdown code block wrappers
  let cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  
  // Aggressively extract strictly everything from the first '{' to the last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (parseError: any) {
    console.warn("Standard JSON parse failed, utilizing secondary regex fallback...", parseError);
    // Secondary regex fallback to extract JSON object structure if text is surrounded by conversation
    const jsonRegex = /\{[\s\S]*\}/;
    const match = cleaned.match(jsonRegex);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (regexParseError: any) {
        console.error("Secondary regex parse fallback also failed:", regexParseError);
      }
    }
    throw new Error(`Invalid JSON output structure returned by the AI chef. Original error: ${parseError.message}`);
  }
};

export const generateMenuFromApi = async (params: {
  eventType: string;
  guestCount: number;
  budget?: string;
  cuisine?: string;
  onProgress?: (message: string) => void;
}): Promise<{ data?: any; error?: string }> => {
  // Loading/Progress steps to keep users engaged - ticked every 5 seconds
  const loadingSteps = [
    "Preparing digital kitchen spaces and gathering gourmet ingredients...",
    "Searching regional South African culinary guidelines...",
    "Analyzing regional South African market pricing...",
    "Designing custom starters tailored to your cuisine...",
    "Sculpting primary main courses and planning side options...",
    "Drafting elegant desserts and balancing flavor profiles...",
    "Conducting live portion costing in South African Rand (ZAR)...",
    "Defining step-by-step preparation steps & mise en place logistics...",
    "Structuring and finalizing the primary catering proposal document..."
  ];

  let stepIndex = 0;
  if (params.onProgress) {
    params.onProgress(loadingSteps[0]);
  }

  const intervalId = setInterval(() => {
    stepIndex++;
    if (params.onProgress && stepIndex < loadingSteps.length) {
      params.onProgress(loadingSteps[stepIndex]);
    } else if (params.onProgress) {
      params.onProgress("Adding exquisite decoration touches to proposal...");
    }
  }, 5000);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const apiKey = getApiKey();
    if (!apiKey || apiKey.trim() === '') {
      throw new Error(
        'API Key is missing. Please set VITE_GEMINI_API_KEY in your system/env secrets.'
      );
    }
    
    let cuisineText = '';
    if (params.cuisine) {
      cuisineText = `Cuisine Style/Culinary Theme: ${params.cuisine}. The dishes should reflect traditional seasonings, ingredients, and visual styles associated with ${params.cuisine}.`;
    }

    let budgetText = '';
    if (params.budget) {
      budgetText = `Target Budget: ${params.budget}. Ensure dishes, ingredients, and realistic portions fit perfectly into this scale.`;
    }

    const structurePrompt = `{
  "title": "string",
  "description": "string",
  "targetProfitMargin": number,
  "totalProposalValue": number,
  "perHeadPrice": number,
  "items": [
    {
      "name": "string",
      "description": "string",
      "costPerHead": number,
      "type": "appetizer | main | dessert | beverage"
    }
  ],
  "logistics": {
    "staffRequired": "string",
    "equipmentNeeded": ["string"],
    "serviceNotes": ["string"]
  }
}`;

    const prompt = `As an elite executive chef and high-end catering consultant, generate a premium culinary proposal for a ${params.eventType} with ${params.guestCount} guests.
${cuisineText}
${budgetText}

REQUIREMENTS:
1. Under "items", provide unique, gourmet dishes representing appetizers, main courses, and desserts.
2. For each items, configure "costPerHead" realistic for South African Rand (ZAR) raw values.
3. Denominate "totalProposalValue", "perHeadPrice", and raw costs in South African Rand (ZAR).
4. Output ONLY a valid JSON object matching this exact schema. Do not enclose in markdown description wrappers, and provide no additional conversation:
${structurePrompt}
5. Ensure the targetProfitMargin is a number representing a percent strictly configured in the highly profitable 72.4% to 81.4% range.`;

    const apiCallPromise = (async () => {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: 8000,
            temperature: 0.7
          }
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API Error (status ${response.status}):`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const json = await response.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || '';
    })();

    const text = await apiCallPromise;
    clearTimeout(timeoutId);

    if (!text || text.trim() === '') {
      return { error: 'The AI model returned an empty response. Please try modifying your query specifics.' };
    }

    clearInterval(intervalId);

    // Aggressive clean parsing suite
    const parsedData = cleanAndParseJson(text);

    // Deep mapping to make sure it contains EXACTLY what App.tsx wants to render without crashing
    const mappedData = {
      ...parsedData,
      menuTitle: parsedData.title || parsedData.menuTitle || "Premium Catering Proposal",
      description: parsedData.description || "A custom high-definition culinary journey.",
      targetProfitMargin: Number(parsedData.targetProfitMargin) || 75.5,
      appetizers: (parsedData.items || [])
        .filter((i: any) => i.type === 'appetizer')
        .map((i: any) => ({
          dish: i.name || "Gourmet Starter Plate",
          notes: i.description || "Fresh chef appetizer selection.",
          cost: Number(i.costPerHead) || 45,
          price: Number(i.price) || Math.round((Number(i.costPerHead) || 45) * 4.5),
          ingredients: i.ingredients || [
            { name: "Organic starter base options", quantity: 0.2, unit: "kg", unitCost: Number(i.costPerHead) || 45 }
          ]
        })),
      mainCourses: (parsedData.items || [])
        .filter((i: any) => i.type === 'main')
        .map((i: any) => ({
          dish: i.name || "Executive Main Sensation",
          notes: i.description || "Specially formulated recipe mains.",
          cost: Number(i.costPerHead) || 120,
          price: Number(i.price) || Math.round((Number(i.costPerHead) || 120) * 4.5),
          ingredients: i.ingredients || [
            { name: "Prime quality proteins and greens", quantity: 0.45, unit: "kg", unitCost: Number(i.costPerHead) || 120 }
          ]
        })),
      desserts: (parsedData.items || [])
        .filter((i: any) => i.type === 'dessert' || i.type === 'beverage')
        .map((i: any) => ({
          dish: i.name || "Decadent Confectionary Dessert",
          notes: i.description || "Premium chocolate or pastry finish.",
          cost: Number(i.costPerHead) || 35,
          price: Number(i.price) || Math.round((Number(i.costPerHead) || 35) * 4.5),
          ingredients: i.ingredients || [
            { name: "Elite baking ingredients & sugars", quantity: 0.15, unit: "kg", unitCost: Number(i.costPerHead) || 35 }
          ]
        })),
      shoppingList: (parsedData.items || []).map((i: any) => ({
        name: `Primary raw supplies for ${i.name || 'dish item'}`,
        quantity: Number(params.guestCount) || 10,
        unit: i.type === 'beverage' ? 'L' : 'kg',
        unitPrice: Math.round((Number(i.costPerHead) || 30) / 2),
        linkedDish: i.name || 'Gourmet Selection'
      })),
      miseEnPlace: (parsedData.logistics?.serviceNotes || []).map((note: string) => `Prep task: ${note}`),
      serviceNotes: parsedData.logistics?.serviceNotes || [],
      deliveryLogistics: [
        `Service Staff Assigned: ${parsedData.logistics?.staffRequired || "Head Chef & Catering Waiters"}`,
        `Specialized Equipment: ${(parsedData.logistics?.equipmentNeeded || []).join(', ') || "Standard hot buffet trays"}`
      ],
      logistics: {
        deliveryFee: 450, // Standard ZAR catering delivery logistics cost charge
        staffRequired: parsedData.logistics?.staffRequired,
        equipmentNeeded: parsedData.logistics?.equipmentNeeded,
        serviceNotes: parsedData.logistics?.serviceNotes
      }
    };

    return { data: mappedData };

  } catch (error: any) {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    console.error("Chef AI Generator failed:", error);
    
    const errorStr = String(error) + ' ' + (error.message || '') + ' ' + JSON.stringify(error);

    // 1. Timeout Errors
    if (error.name === 'AbortError' || errorStr.includes('TIMEOUT_ERROR')) {
      return { error: 'Catering Proposal Timeout (60-second limit exceeded). The digital kitchen taking too long. Please try again.' };
    }

    // 2. Quota & Rate Limit Errors (429 / RESOURCE_EXHAUSTED)
    const isRateLimit = errorStr.includes('429') || 
                        errorStr.toUpperCase().includes('RESOURCE_EXHAUSTED') || 
                        errorStr.toLowerCase().includes('rate limit') ||
                        errorStr.toUpperCase().includes('QUOTA');
    if (isRateLimit) {
      return { error: 'CaterPro AI engine is Rate Limited / Quota Limited (429 Resource Exhausted). Please wait a few seconds and try again.' };
    }

    // 3. Network Errors (Fetch failures, offlines)
    const isNetwork = errorStr.toLowerCase().includes('network') || 
                      errorStr.toLowerCase().includes('fetch') || 
                      errorStr.toLowerCase().includes('socket') ||
                      errorStr.toLowerCase().includes('dns') ||
                      errorStr.toLowerCase().includes('conn');
    if (isNetwork) {
      return { error: 'Unable to communicate with the kitchen. A connection/network error occurred. Please check your internet.' };
    }

    // 4. Fallback Generic
    return { error: error.message || 'An unexpected error occurred while drafting the menu.' };
  }
};

export async function generateMenuImageFromApi(title: string, eventType: string, _legacyMainCourses?: string[]): Promise<string> {
  const apiKey = getApiKey();

  // Fresh, dynamic, high-res abstract non-watermarked culinary presentation placeholder URL so we can instantly see if the API is hitting an error vs running successfully.
  const errorFallbackUrl = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80&is_fallback=true";

  if (!apiKey || apiKey.trim() === '') {
    console.warn("API Key is missing. Serving high-end visual backup placeholder...");
    return errorFallbackUrl;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: "Bespoke luxury food photography of " + title + " for a gourmet " + eventType + ". Plated culinary masterpiece, 5-star Michelin presentation, high-end food styling, macro lens close-up, dramatic professional studio lighting, 8k resolution, crisp textures, vivid depth of field.",
        aspectRatio: "16:9",
        numberOfImages: 1,
        outputMimeType: "image/jpeg"
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Imagen API Error (status ${response.status}):`, errText);
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const base64Bytes = data?.generatedImages?.[0]?.image?.imageBytes;
    if (!base64Bytes) {
      throw new Error("Image bytes missing in response");
    }

    return "data:image/jpeg;base64," + base64Bytes;
  } catch (error: any) {
    console.error("Imagen generation failed (auth, limit, forbidden, or 403). Falling back cleanly to Unsplash mapping...", error);
    return errorFallbackUrl;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const analyzeMenuForCosting = async (_base64: string, _suppliers: string, _currency: string): Promise<ScannedMenuCosting> => {
  return {
    menuItems: [],
    totalEstimatedMenuCost: '0.00',
    marginAdvice: ''
  };
};

export const extractIngredientsForShift = async (_miseEnPlace: string[], _menuTitle: string): Promise<any[]> => {
  return [];
};

export const regenerateMenuItemFromApi = async (oldText: string, _prompt: string): Promise<string> => {
  return oldText;
};

export const generateVideoFromApi = async (_prompt: string): Promise<string> => {
  return '';
};

export const generateWhatsAppStatus = async (_menuTitle: string): Promise<string> => {
  return '';
};

export const generateSocialCaption = async (_title: string, _desc: string, _platform: string): Promise<string> => {
  return '';
};

export const analyzeReceiptFromApi = async (_base64: string): Promise<any> => {
  return {};
};

export const analyzeLabelFromApi = async (_base64: string, _dietary: string[]): Promise<any> => {
  return {};
};

export const generateCulinaryInfographic = async (_type: string): Promise<string> => {
  return '';
};

export const generateStudyGuideFromApi = async (_topic: string, _curriculum: string, _level: string, _type: string): Promise<any> => {
  return {};
};

export interface ScannedMenuCosting {
  menuItems: {
    name: string;
    identifiedIngredients: string[];
    estimatedPortionCost: string;
    suggestedSupplier: string;
  }[];
  totalEstimatedMenuCost: string;
  marginAdvice: string;
}
