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

    const structurePrompt = '{\n' +
      '  "menuTitle": "string",\n' +
      '  "description": "string",\n' +
      '  "appetizers": [\n' +
      '    {\n' +
      '      "dish": "string",\n' +
      '      "notes": "string",\n' +
      '      "price": 0,\n' +
      '      "cost": 0,\n' +
      '      "ingredients": [\n' +
      '        { "name": "string", "quantity": 0, "unit": "kg|L", "unitCost": 0 }\n' +
      '      ]\n' +
      '    }\n' +
      '  ],\n' +
      '  "mainCourses": [\n' +
      '    {\n' +
      '      "dish": "string",\n' +
      '      "notes": "string",\n' +
      '      "price": 0,\n' +
      '      "cost": 0,\n' +
      '      "ingredients": [\n' +
      '        { "name": "string", "quantity": 0, "unit": "kg|L", "unitCost": 0 }\n' +
      '      ]\n' +
      '    }\n' +
      '  ],\n' +
      '  "desserts": [\n' +
      '    {\n' +
      '      "dish": "string",\n' +
      '      "notes": "string",\n' +
      '      "price": 0,\n' +
      '      "cost": 0,\n' +
      '      "ingredients": [\n' +
      '        { "name": "string", "quantity": 0, "unit": "kg|L", "unitCost": 0 }\n' +
      '      ]\n' +
      '    }\n' +
      '  ],\n' +
      '  "shoppingList": [\n' +
      '    { "name": "string", "quantity": 0, "unit": "string", "unitPrice": 0, "linkedDish": "string" }\n' +
      '  ],\n' +
      '  "miseEnPlace": ["string"],\n' +
      '  "serviceNotes": ["string"],\n' +
      '  "deliveryLogistics": ["string"],\n' +
      '  "logistics": { "deliveryFee": 0 }\n' +
      '}';

    const prompt = `As an elite executive chef and high-end catering consultant, generate a premium custom catering menu for a ${params.eventType} with ${params.guestCount} guests.
${cuisineText}
${budgetText}

REQUIREMENTS:
1. Max 2-3 unique, visually striking dishes per category (appetizers, mainCourses, desserts).
2. Each dish must include realistic details, custom notes, estimated customer price, portion cost, and simple summary ingredients for precision costing.
3. Denominate all pricing & raw costs in South African Rand (ZAR).
4. Raw ingredient weights scaled correctly for ${params.guestCount} guests in kilograms (kg) or liters (L).
5. Output ONLY a valid JSON object matching the exact schema. Do not enclose in markdown or preface with conversational text:
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
    return { data: parsedData };

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

const getFallbackUrl = (normalizedText: string): string => {
  let selectedUrl = "https://images.unsplash.com/photo-1555244162-803834f70033"; // Default: catering/Other

  if (normalizedText.includes("braai") || normalizedText.includes("bbq") || normalizedText.includes("spit braai")) {
    selectedUrl = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1";
  } else if (normalizedText.includes("wedding") || normalizedText.includes("marriage")) {
    selectedUrl = "https://images.unsplash.com/photo-1519225421980-715cb0215aed";
  } else if (normalizedText.includes("cocktail") || normalizedText.includes("drink") || normalizedText.includes("bar") || normalizedText.includes("wine")) {
    selectedUrl = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002";
  } else if (normalizedText.includes("corporate") || normalizedText.includes("business") || normalizedText.includes("conference") || normalizedText.includes("meeting")) {
    selectedUrl = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0";
  } else if (normalizedText.includes("birthday") || normalizedText.includes("party") || normalizedText.includes("anniversary") || normalizedText.includes("celebration")) {
    selectedUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587";
  }

  return `${selectedUrl}?auto=format&fit=crop&w=1200&q=80&is_fallback=true`;
};

export const generateMenuImageFromApi = async (title: string, description: string, mainCourses?: string[]): Promise<string> => {
  const normalized = (title + " " + description + " " + (mainCourses?.join(" ") || "")).toLowerCase();
  const apiKey = getApiKey();

  if (!apiKey || apiKey.trim() === '') {
    console.warn("API Key is missing. Falling back to Unsplash mapping...");
    return getFallbackUrl(normalized);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    let promptText = `Professional high-end gourmet food plating photography of ${title}. ${description}`;
    if (mainCourses && mainCourses.length > 0) {
      promptText += `. Feat. ${mainCourses.join(', ')}`;
    }
    promptText += `. High quality studio food styling, soft focus background, editorial presentation, daylight lighting.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: promptText,
        numberOfImages: 1,
        aspectRatio: '16:9'
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
    if (base64Bytes) {
      return `data:image/jpeg;base64,${base64Bytes}`;
    }

    console.warn("Imagen generation returned empty images list. Falling back to Unsplash static mapping...");
    return getFallbackUrl(normalized);
  } catch (error: any) {
    console.error("Imagen generation failed (auth, limit, forbidden, or 403). Falling back cleanly to Unsplash mapping...", error);
    return getFallbackUrl(normalized);
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
