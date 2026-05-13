
import { GoogleGenAI } from "@google/genai";
import { ScannedMenuCosting } from "./types";

const getGenAI = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set. Please add it to your environment variables.");
    return new GoogleGenAI(apiKey);
};

const HERO_FALLBACK = "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80";

export const analyzeMenuForCosting = async (_base64: string, _suppliers: string, _currency: string): Promise<ScannedMenuCosting> => {
    return {
        menuItems: [
            {
                name: "Truffle Infused King Oyster Mushroom",
                identifiedIngredients: ["King Oyster Mushroom", "Truffle Oil", "Microgreens", "Garlic Butter"],
                estimatedPortionCost: "45.00",
                suggestedSupplier: "Local Organic Farm"
            }
        ],
        totalEstimatedMenuCost: "45.00",
        marginAdvice: "Maintain a 75% margin."
    };
};

export const extractIngredientsForShift = async (_miseEnPlace: string[], _menuTitle: string): Promise<any[]> => {
    return [
        { name: 'King Oyster Mushroom', quantity: 2, unit: 'kg', unitPrice: 150 },
        { name: 'Truffle Oil', quantity: 0.5, unit: 'L', unitPrice: 450 }
    ];
};

export const generateMenuFromApi = async (params: { eventType: string; guestCount: number }): Promise<any> => {
    try {
        const ai = getGenAI();
        const result = await ai.models.generateContent({ 
            model: "gemini-2.0-flash",
            contents: `
                As an expert catering consultant, generate a premium catering menu for a "${params.eventType}" for ${params.guestCount} guests.
                Return ONLY a JSON object. Keep descriptions concise.
                
                REQUIREMENTS:
                1. Max 2-3 unique dishes per category (appetizers, mainCourses, desserts).
                2. Each dish must include a summary ingredient list for costing.
                3. Costs in South African Rand (ZAR).
                4. All weights in kg or L.

                Structure:
                {
                  "menuTitle": "string",
                  "description": "string",
                  "appetizers": [{"dish": "string", "notes": "string", "price": number, "cost": number, "ingredients": [{"name": "string", "quantity": number, "unit": "kg|L", "unitCost": number}]}],
                  "mainCourses": [{"dish": "string", "notes": "string", "price": number, "cost": number, "ingredients": [{"name": "string", "quantity": number, "unit": "kg|L", "unitCost": number}]}],
                  "desserts": [{"dish": "string", "notes": "string", "price": number, "cost": number, "ingredients": [{"name": "string", "quantity": number, "unit": "kg|L", "unitCost": number}]}],
                  "shoppingList": [{"name": "string", "quantity": number, "unit": "string", "unitPrice": number, "linkedDish": "string"}],
                  "miseEnPlace": ["string"],
                  "serviceNotes": ["string"],
                  "deliveryLogistics": ["string"],
                  "logistics": { "deliveryFee": number }
                }
            `,
            config: {
                maxOutputTokens: 8000,
                temperature: 0.7
            }
        });

        const text = (result.text || "").replace(/```json|```/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Generation failed:", error);
        throw error;
    }
};

export const generateMenuImageFromApi = async (title: string, description: string, mainCourses?: string[]): Promise<string> => {
    try {
        const ai = getGenAI();
        const prompt = `Premium food photography of a high-end catering menu: ${title}. Description: ${description}. Featuring: ${mainCourses?.join(", ")}. Style: Luxe, appetizing, moody lighting, 8k resolution.`;

        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: prompt,
            config: { 
                responseModalities: ['IMAGE', 'TEXT'], 
                imageConfig: { aspectRatio: '16:9' } 
            }
        });

        for (const part of (result.candidates?.[0]?.content?.parts || [])) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
            if (part.fileData) {
                return (part.fileData as any).fileUri || "";
            }
        }

        return HERO_FALLBACK;
    } catch (error) {
        console.error("Image generation failed:", error);
        return HERO_FALLBACK;
    }
};

export const regenerateMenuItemFromApi = async (oldText: string, _prompt: string): Promise<string> => {
    return oldText;
};

export const generateVideoFromApi = async (_prompt: string): Promise<string> => {
    return "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";
};

export const generateWhatsAppStatus = async (menuTitle: string): Promise<string> => {
    return `Excited to launch our new menu: ${menuTitle}! 🍳✨`;
};

export const generateSocialCaption = async (title: string, _desc: string, platform: string): Promise<string> => {
    return `Check out our latest ${platform} update for ${title}! #Catering #FineDining`;
};

export const analyzeReceiptFromApi = async (_base64: string): Promise<any> => {
    return { merchant: "Chef's Pantry", total: "1250.00" };
};

export const analyzeLabelFromApi = async (_base64: string, _dietary: string[]): Promise<any> => {
    return { suitabilityScore: 9, reasoning: "Meets requirements." };
};

export const generateCulinaryInfographic = async (_type: string): Promise<string> => {
    return "https://images.unsplash.com/photo-1556910103-1c02745aae4d";
};

export const generateStudyGuideFromApi = async (topic: string, curriculum: string, level: string, type: string): Promise<any> => {
    return { title: `${type} for ${topic}` };
};
