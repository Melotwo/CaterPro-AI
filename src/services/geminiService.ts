// src/services/geminiService.ts

export interface MenuGenerationParams {
  eventType: string;
  guestCount: number;
  budgetRange: string;
  cuisineType: string;
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

// Loading message timeline rotation helper
const LOADING_MESSAGES = [
  "Preparing digital kitchen spaces...",
  "Analyzing regional South African market pricing guidelines...",
  "Drafting custom starter pairings...",
  "Calculating food ingredient yields and baseline expenditures...",
  "Optimizing financial target profit margins...",
  "Polishing culinary service logistics and staff requirements...",
  "Plating final visual presentation menus..."
];

/**
 * Clean raw API text response blocks by isolating the core JSON structure parameters
 */
function cleanAndParseJson(rawText: string): any {
  try {
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("Valid architectural JSON brackets bounding matrix not found in server string.");
    }
    
    const isolatedJson = rawText.slice(firstBrace, lastBrace + 1);
    return JSON.parse(isolatedJson);
  } catch (error) {
    console.error("String clean extraction parsing failure log:", rawText);
    throw new Error(`Failed to safely parse operational backend schema values: ${error instanceof Error ? error.message : 'Unknown Parse Event'}`);
  }
}

/**
 * Generate structural culinary menu proposals using production v1 endpoints
 */
export async function generateMenuFromApi(params: MenuGenerationParams): Promise<GeneratedMenuProposal> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing application runtime credential configuration: VITE_GEMINI_API_KEY is not set.");
  }

  // Initialize and cycle interface progress updates smoothly every 5 seconds
  let currentStep = 0;
  if (params.onProgress) {
    params.onProgress(LOADING_MESSAGES[0]);
  }
  
  const progressInterval = setInterval(() => {
    if (params.onProgress && currentStep < LOADING_MESSAGES.length - 1) {
      currentStep++;
      params.onProgress(LOADING_MESSAGES[currentStep]);
    }
  }, 5000);

  try {
    // Exact production API route bypassing local wrappers
    const endpointUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const promptText = `
      You are an expert executive catering strategist and financial analyst specializing in the South African hospitality sector.
      Generate a comprehensive, premium catering proposal based on the following metrics:
      - Event Framework Type: ${params.eventType}
      - Confirmed Guest Attendance Count: ${params.guestCount}
      - Selected Budget Allocation Tier: ${params.budgetRange}
      - Targeted Core Cuisine Styling Profile: ${params.cuisineType}
      ${params.additionalNotes ? `- Specific Strategic Directives: ${params.additionalNotes}` : ''}

      CRITICAL FINANCIAL BOUNDARIES:
      1. All currency metrics must be evaluated as integers or floats natively localized to South African Rand (ZAR) currency bounds.
      2. The pricing must mathematically display an elite, high-performing targetProfitMargin value set strictly between 72.4% and 81.4%.
      3. Calculate totalProposalValue and perHeadPrice dynamically to completely fulfill the selected budget range parameters.

      You must return ONLY a strictly valid JSON object conforming exactly to this model format, without any conversational introduction text or markdown code wrappers:
      {
        "title": "Distinctive Creative Title for the Catering Package",
        "description": "Sophisticated, market-optimized marketing proposal overview paragraph celebrating traditional profiles tailored for this guest matrix.",
        "targetProfitMargin": 78.5,
        "totalProposalValue": 25000,
        "perHeadPrice": 500,
        "items": [
          {
            "name": "Distinctive Dish Name (e.g., Miniature Beef Bobotie Tartlets)",
            "description": "Appealing culinary item description detailing local premium ingredients and presentation method.",
            "costPerHead": 12.50,
            "type": "appetizer"
          }
        ],
        "logistics": {
          "staffRequired": "Detailed operational staffing deployment ratio summary based on the total guest count.",
          "equipmentNeeded": ["Item 1", "Item 2"],
          "serviceNotes": ["Operational note 1", "Operational note 2"]
        }
      }
    `;

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 25000
        }
      })
    });

    if (!response.ok) {
      const errorPayload = await response.text();
      throw new Error(`GENERATION FAILED: HTTP ${response.status}: ${errorPayload}`);
    }

    const jsonResponse = await response.json();
    const candidateText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error("Empty content stream received from infrastructure generative text clusters.");
    }

    return cleanAndParseJson(candidateText) as GeneratedMenuProposal;

  } finally {
    clearInterval(progressInterval);
  }
}

/**
 * Generate native original culinary imagery via Imagen 3 production paths
 */
export async function generateMenuImageFromApi(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return getRandomFallbackImage(prompt);
  }

  try {
    const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${apiKey}`;

    const response = await fetch(imagenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        numberOfImages: 1,
        prompt: `${prompt}, professional commercial food styling, editorial luxury catering photography, shallow depth of field, 8k resolution, crisp clean lighting`,
        aspectRatio: "16:9",
        outputMimeType: "image/jpeg"
      })
    });

    if (!response.ok) {
      return getRandomFallbackImage(prompt);
    }

    const data = await response.json();
    const base64Image = data?.generatedImages?.[0]?.image?.imageBytes;

    if (!base64Image) {
      return getRandomFallbackImage(prompt);
    }

    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.warn("Imagen 3 generation pathway timed out or failed. Activating high-resolution local backup query.");
    return getRandomFallbackImage(prompt);
  }
}

/**
 * High-resolution fallback matrix mapping logic
 */
function getRandomFallbackImage(prompt: string): string {
  const cleanPrompt = prompt.toLowerCase();
  
  const fallbackMatrix = [
    { key: 'mediterranean', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80' },
    { key: 'wedding', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80' },
    { key: 'cocktail', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80' },
    { key: 'picnic', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80' },
    { key: 'braai', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80' },
    { key: 'south african', url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=1200&q=80' }
  ];

  const match = fallbackMatrix.find(item => cleanPrompt.includes(item.key));
  return match ? match.url : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80';
}
