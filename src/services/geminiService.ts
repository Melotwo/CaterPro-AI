export function getApiKey(): string {
  let apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  
  // Dev/Fallback key detection for preview environments
  if (!apiKey || apiKey.trim() === '') {
    const windowConfig = (window as any).__APP_CONFIG__;
    const fallbackKey = windowConfig?.geminiKey;
    if (fallbackKey && fallbackKey !== '%VITE_GEMINI_API_KEY%') {
      apiKey = fallbackKey;
    }
  }
  return apiKey;
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
        'API Key is missing. Tried reading VITE_GEMINI_API_KEY from environment, ' +
        'then window.__APP_CONFIG__.geminiKey fallback. Please set VITE_GEMINI_API_KEY ' +
        'in your system/env secrets.'
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
${structurePrompt}`;

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

export const generateMenuImageFromApi = async (title: string, description: string, mainCourses?: string[]): Promise<string> => {
  const normalized = (title + " " + description + " " + (mainCourses?.join(" ") || "")).toLowerCase();
  const apiKey = getApiKey();

  // Premium, beautiful, watermark-free high-res backup images inside the catch/fallback block
  const triggerFallbackUrl = () => {
    let selectedUrl = "https://images.unsplash.com/photo-1555244162-803834f70033"; // Default: high-end plated banquet
    if (normalized.includes("braai") || normalized.includes("bbq") || normalized.includes("spit braai")) {
      selectedUrl = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"; // Splendid grilling selection
    } else if (normalized.includes("wedding") || normalized.includes("marriage")) {
      selectedUrl = "https://images.unsplash.com/photo-1519225421980-715cb0215aed"; // Premium wedding feast style
    } else if (normalized.includes("cocktail") || normalized.includes("drink") || normalized.includes("bar") || normalized.includes("wine")) {
      selectedUrl = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"; // Sleek elegant cocktails
    } else if (normalized.includes("corporate") || normalized.includes("business") || normalized.includes("conference") || normalized.includes("meeting")) {
      selectedUrl = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"; // Exceptional plated catering
    } else if (normalized.includes("birthday") || normalized.includes("party") || normalized.includes("anniversary") || normalized.includes("celebration")) {
      selectedUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587"; // Delectable desserts, celebration mood
    }
    return `${selectedUrl}?auto=format&fit=crop&w=1200&q=80&is_fallback=true`;
  };

  if (!apiKey || apiKey.trim() === '') {
    console.warn("API Key is missing. Falling back safely to high-res gourmet backups...");
    return triggerFallbackUrl();
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
        instances: [
          {
            prompt: "Bespoke luxury food photography of " + title + ". Plated gourmet culinary masterpiece, 5-star Michelin presentation, high-end food styling, macro lens close-up, dramatic professional studio lighting, 8k resolution, crisp textures."
          }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "16:9",
          outputMimeType: "image/jpeg"
        }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Imagen API Error (status ${response.status}):`, errText);
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const base64Bytes = data?.predictions?.[0]?.bytesBase64Encoded;
    if (base64Bytes) {
      return "data:image/jpeg;base64," + base64Bytes;
    }

    console.warn("Imagen generation predictions list empty. Utilizing fallback...");
    return triggerFallbackUrl();
  } catch (error: any) {
    console.error("Imagen generation failed (auth, limit, forbidden, or 403). Falling back cleanly to Unsplash mapping...", error);
    return triggerFallbackUrl();
  } finally {
    clearTimeout(timeoutId);
  }
};

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
