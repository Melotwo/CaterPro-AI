// src/services/geminiService.ts

export interface MenuGenerationParams {
  eventType: string;
  guestCount: number;
  budgetRange: string;
  cuisineType: string;
  region: string; // Made dynamic for worldwide usage
  additionalNotes?: string;
  onProgress?: (message: string) => void;
}

export interface MenuItem {
  name: string;
  description: string;
  costPerHead: number;
  type: 'appetizer' | 'main' | 'dessert' | 'beverage';
}

export interface ServiceLogistics {
  staffRequired: string;
  equipmentNeeded: string[];
  serviceNotes: string[];
}

export interface GeneratedMenuProposal {
  title: string;
  description: string;
  targetProfitMargin: number;
  totalProposalValue: number;
  perHeadPrice: number;
  items: MenuItem[];
  logistics: ServiceLogistics;
}

export interface IngredientItem {
  name: string;
  amount: string;
  estimatedCost: number;
  checked: boolean;
}

const LOADING_MESSAGES = [
  "Preparing digital kitchen spaces...",
  "Analyzing regional ingredient availability parameters...",
  "Drafting custom culinary configurations...",
  "Calculating food ingredient yields and local expenditures...",
  "Optimizing targeted structural financial profit margins...",
  "Polishing final presentation proposal designs..."
];

export function getApiKey(): string {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

function cleanAndParseJson(rawText: string): any {
  try {
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) throw new Error("JSON brace missing.");
    return JSON.parse(rawText.slice(firstBrace, lastBrace + 1));
  } catch (error) {
    console.error("Raw payload failing parse sequence:", rawText);
    throw new Error("Failed to clear conversational formatting from JSON payload stream.");
  }
}

export async function generateMenuFromApi(params: MenuGenerationParams): Promise<GeneratedMenuProposal> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Missing client environment credential: VITE_GEMINI_API_KEY.");

  let currentStep = 0;
  if (params.onProgress) params.onProgress(LOADING_MESSAGES[0]);
  
  const progressInterval = setInterval(() => {
    if (params.onProgress && currentStep < LOADING_MESSAGES.length - 1) {
      currentStep++;
      params.onProgress(LOADING_MESSAGES[currentStep]);
    }
  }, 4000);

  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const promptText = `
      You are a premium catering enterprise financial strategist evaluating proposals for the region: "${params.region}".
      Build a detailed proposal based on:
      - Event Type: ${params.eventType}
      - Guests: ${params.guestCount}
      - Budget Tier: ${params.budgetRange}
      - Cuisine Profile: ${params.cuisineType}
      ${params.additionalNotes ? `- Directives: ${params.additionalNotes}` : ''}

      CRITICAL SYSTEM BOUNDARIES:
      1. Localize all financial data to the target currency standards of "${params.region}".
      2. The targetProfitMargin value MUST calculate natively between 72.4% and 81.4%.
      
      Return ONLY a clean JSON object conforming exactly to this schema pattern with no markdown wraps:
      {
        "title": "Creative Menu Package Name",
        "description": "Sophisticated marketing overview paragraph tailored to the client criteria.",
        "targetProfitMargin": 76.5,
        "totalProposalValue": 45000,
        "perHeadPrice": 450,
        "items": [
          { "name": "Dish Name", "description": "Artisanal menu item overview text.", "costPerHead": 45.00, "type": "main" }
        ],
        "logistics": {
          "staffRequired": "Staff distribution summary details.",
          "equipmentNeeded": ["Equipment 1"],
          "serviceNotes": ["Operational mandate 1"]
        }
      }
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });

    if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
    const data = await response.json();
    return cleanAndParseJson(data?.candidates?.[0]?.content?.parts?.[0]?.text || '');
  } finally {
    clearInterval(progressInterval);
  }
}

export async function generateMenuImageFromApi(title: string, eventType: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) return '';

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${apiKey}`;
    
    // Culture guard optimization checks
    let thematicFocus = "Bespoke luxury culinary photography food styling presentation of " + title;
    const cleanContext = (title + " " + eventType).toLowerCase();
    if (cleanContext.includes('braai') || cleanContext.includes('south african')) {
      thematicFocus = "A high-end luxury gourmet South African braai platter. Beautifully prepared flame-grilled boerewors, premium charred lamb chops, and grilled steaks sizzling with wood-fired smoke, upscale catering presentation";
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: thematicFocus + ", macro lens close-up photography, 5-star Michelin presentation format, crisp professional studio lighting profile, 8k resolution, highly detailed texture, vivid depth of field.",
        aspectRatio: "16:9",
        numberOfImages: 1,
        outputMimeType: "image/jpeg"
      })
    });

    if (!response.ok) throw new Error("Image node validation failure");
    const data = await response.json();
    const base64Bytes = data?.generatedImages?.[0]?.image?.imageBytes;
    
    if (!base64Bytes) throw new Error("Empty image payload byte configuration context.");
    return "data:image/jpeg;base64," + base64Bytes;
  } catch (error) {
    console.warn("Image generation error, dropping to standard dynamic abstract mesh asset runtime handler.");
    return "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80";
  }
}

export async function calculateIngredientBreakdown(itemName: string, region: string): Promise<IngredientItem[]> {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const promptText = `
      Take the menu item item: "${itemName}" for a catering operation located in "${region}".
      Break it down completely into an accurate list of raw ingredients needed to prepare it.
      Provide realistic amounts and wholesale costing metrics relative to local merchant conditions in "${region}".
      
      Return ONLY a raw JSON array conforming exactly to this structure pattern with no conversational markdown text:
      [
        { "name": "Raw Ingredient Name", "amount": "e.g. 500g or 2 Liters", "estimatedCost": 45.50, "checked": true }
      ]
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });

    if (!response.ok) throw new Error("Calculator backend endpoint failure logic.");
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    return JSON.parse(text.slice(firstBracket, lastBracket + 1)) as IngredientItem[];
  } catch (error) {
    console.error("Failed to fetch ingredient costing details dynamic rows:", error);
    return [];
  }
}
