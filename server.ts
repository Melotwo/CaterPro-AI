import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { getCulinaryIngredientBreakdown } from "./src/services/culinaryCostingEngine";
import { synthesizeHotelMenu } from "./src/services/hotelMenuSynthesizer";
import { synthesizeStudyGuide } from "./src/services/studyGuideEngine";
import { VERIFIED_LOCAL_SUPPLIERS } from "./src/services/localSuppliersData";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Helper: Lazy initialization of GoogleGenAI
  const getGeminiClient = () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.trim() === '') {
      return null;
    }
    return new GoogleGenAI({
      apiKey: key.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Routes FIRST
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", subterraneanReady: true, timestamp: new Date().toISOString() });
  });

  /**
   * Route: Ingredient Breakdown & Wholesale Costing
   * Tries Gemini 3.8-flash; falls back gracefully to statutory SANS 10330 Culinary Costing Engine.
   */
  app.post("/api/gemini/calculate-ingredients", async (req, res) => {
    const { itemName, region = "South Africa" } = req.body || {};

    if (!itemName || typeof itemName !== "string") {
      res.status(400).json({ error: "Dish itemName is required." });
      return;
    }

    try {
      const ai = getGeminiClient();
      if (ai) {
        const structurePrompt = `{
          "dishName": "string",
          "region": "string",
          "currencyCode": "string",
          "ingredients": [
            {
              "name": "string",
              "quantity": number,
              "unit": "string",
              "unitPrice": number,
              "totalItemCost": number,
              "notes": "string"
            }
          ],
          "estimatedTotalCost": number,
          "regionalWholesaleAdvice": "string",
          "sans10330Protocol": "string"
        }`;

        const prompt = `As an executive chef and costing expert, break down the recipe/ingredients of the dish "${itemName}" for 1 portion, localized to "${region}".
Configure the raw price estimates and wholesale market rates specifically for ${region} (ZAR). Each item in "ingredients" must contain clean "name", "quantity", "unit", "unitPrice", and "totalItemCost". Include SANS 10330 HACCP cold-chain compliance notes.
Output ONLY a valid JSON object matching this schema:
${structurePrompt}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.3,
            responseMimeType: "application/json"
          }
        });

        const text = response.text || "";
        if (text.trim()) {
          const cleaned = text.replace(/```json|```/g, "").trim();
          const firstBrace = cleaned.indexOf("{");
          const lastBrace = cleaned.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
            res.json({ ...parsed, source: "gemini-3.8-flash" });
            return;
          }
        }
      }
    } catch (err: any) {
      console.warn("Server-side Gemini generation error (falling back to SANS 10330 culinary engine):", err?.message || err);
    }

    // High-fidelity statutory fallback (ensures 100% uptime with 0-signal offline resilience)
    const fallback = getCulinaryIngredientBreakdown(itemName, region);
    res.json({ ...fallback, source: "culinary-engine-sans10330" });
  });

  /**
   * Route: Find Local Food Suppliers with Google Maps Grounding
   * Uses gemini-3.5-flash with googleMaps tool to extract live place answers and URLs.
   */
  app.post("/api/gemini/find-suppliers", async (req, res) => {
    const { query = "", category = "all", location = "Cape Town, South Africa", latLng } = req.body || {};

    const prompt = `You are a culinary procurement expert. Find authentic, highly-rated wholesale food suppliers, fresh produce markets, butcheries, seafood merchants, dairy distributors, or bakery supply depots near ${location || 'the area'}.
Query / Focus: "${query || category || 'wholesale food supplier'}".
Provide a helpful executive summary for chefs and restaurant operators detailing:
1. The top local wholesale suppliers in this area
2. What wholesale items/specialties they supply (e.g., pasture-reared meats, day-boat linefish, organic produce, imported cheeses)
3. Delivery, cold-chain assurance, and order lead times.
Focus on verified commercial suppliers that restaurants and caterers can source ingredients from.`;

    try {
      const ai = getGeminiClient();
      if (ai) {
        const config: any = {
          tools: [{ googleMaps: {} }]
        };

        if (latLng && typeof latLng.latitude === "number" && typeof latLng.longitude === "number") {
          config.toolConfig = {
            retrievalConfig: {
              latLng: {
                latitude: Number(latLng.latitude),
                longitude: Number(latLng.longitude)
              }
            }
          };
        }

        let response: any = null;
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config
          });
        } catch (modelErr: any) {
          console.warn("gemini-3.5-flash with googleMaps notice, attempting gemini-3.8-flash:", modelErr?.message || modelErr);
          response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config
          });
        }

        const text = response?.text || "";
        const groundingMetadata = response?.candidates?.[0]?.groundingMetadata;
        const groundingChunks = groundingMetadata?.groundingChunks || [];

        // Extract Google Maps grounded places
        const mapsPlaces: Array<{
          name: string;
          mapsUri: string;
          title: string;
          reviewSnippets?: string[];
        }> = [];

        for (const chunk of groundingChunks) {
          if (chunk.maps && chunk.maps.uri) {
            const reviews = chunk.maps.placeAnswerSources?.reviewSnippets?.map((r: any) => r.snippet || r) || [];
            mapsPlaces.push({
              name: chunk.maps.title || "Local Supplier",
              title: chunk.maps.title || "Local Supplier",
              mapsUri: chunk.maps.uri,
              reviewSnippets: reviews
            });
          }
        }

        res.json({
          text,
          mapsPlaces,
          groundingChunks,
          webSearchQueries: groundingMetadata?.webSearchQueries || [],
          source: mapsPlaces.length > 0 ? "gemini-google-maps" : "gemini-ai",
          location,
          query
        });
        return;
      }
    } catch (err: any) {
      console.warn("Google Maps Grounding supplier search notice (using verified local supplier directory):", err?.message || err);
    }

    // High-fidelity fallback: return verified directory suppliers filtered by query or location
    const qLower = (query || category || "").toLowerCase();
    const locLower = (location || "").toLowerCase();

    let matched = VERIFIED_LOCAL_SUPPLIERS;
    if (locLower) {
      const cityMatches = matched.filter(s => s.city.toLowerCase().includes(locLower) || s.region.toLowerCase().includes(locLower));
      if (cityMatches.length > 0) matched = cityMatches;
    }

    if (category && category !== "all") {
      matched = matched.filter(s => s.category === category);
    }

    if (qLower && qLower !== "all") {
      const keywordMatches = matched.filter(s => 
        s.name.toLowerCase().includes(qLower) || 
        s.specialty.toLowerCase().includes(qLower) || 
        s.popularItems.some(item => item.toLowerCase().includes(qLower))
      );
      if (keywordMatches.length > 0) matched = keywordMatches;
    }

    res.json({
      text: `Verified culinary wholesale suppliers for ${location}. These distributors provide certified cold-chain and restaurant-grade provisioning.`,
      mapsPlaces: matched.map(s => ({
        name: s.name,
        title: s.name,
        mapsUri: s.mapsUri,
        reviewSnippets: [s.chefNotes]
      })),
      suppliers: matched,
      source: "verified-directory-fallback",
      location,
      query
    });
  });

  /**
   * Route: Full Catering BEO Proposal Generation
   */
  app.post("/api/gemini/generate-menu", async (req, res) => {
    const params = req.body || {};
    const region = params.region || "South Africa";

    try {
      const ai = getGeminiClient();
      if (ai) {
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
              "price": number,
              "type": "appetizer | main | dessert | beverage",
              "allergens": ["string"],
              "dietary": ["string"]
            }
          ],
          "allergenMatrix": [
            {
              "dish": "string",
              "category": "Appetizers | Main Courses | Desserts",
              "gluten": boolean,
              "dairy": boolean,
              "nuts": boolean,
              "eggs": boolean,
              "shellfish": boolean,
              "soy": boolean,
              "fish": boolean,
              "dietary": ["string"],
              "notes": "string"
            }
          ],
          "shoppingList": [
            {
              "name": "string",
              "quantity": number,
              "unit": "string",
              "unitPrice": number,
              "linkedDish": "string"
            }
          ],
          "logistics": {
            "staffRequired": "string",
            "equipmentNeeded": ["string"],
            "serviceNotes": ["string"]
          }
        }`;

        const prompt = `As an executive chef and banquet director for a premier hotel in ${region}, generate an authoritative Banquet Event Order (BEO) proposal for a "${params.eventType || 'Banquet'}" catering event with ${params.guestCount || 50} covers.
Cuisine style: ${params.cuisine || 'Modern Gourmet'}. Budget: ${params.budget || 'Standard'}. Dietary constraints: ${(params.dietaryRestrictions || []).join(', ') || 'None'}.
Output ONLY a valid JSON object matching this schema:
${structurePrompt}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        });

        const text = response.text || "";
        if (text.trim()) {
          const cleaned = text.replace(/```json|```/g, "").trim();
          const firstBrace = cleaned.indexOf("{");
          const lastBrace = cleaned.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1) {
            const parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
            res.json({ data: parsed, source: "gemini-3.8-flash" });
            return;
          }
        }
      }
    } catch (err: any) {
      console.warn("Server-side menu generation error (falling back to hotel synthesizer):", err?.message || err);
    }

    // High-fidelity fallback: 100% reliable hotel banquet generation tailored to the exact event type & covers
    const dynamicMenu = synthesizeHotelMenu(params);
    res.json({ data: dynamicMenu, source: "caterpro-culinary-engine" });
  });

  /**
   * Route: Vocational Culinary Study Guide & Syllabus Generator
   * Aligned with City & Guilds (South Africa), QCTO, DHET N4-N6 & International Standards
   */
  app.post("/api/gemini/study-guide", async (req, res) => {
    const { topic = "Menu Engineering & Food Costing", curriculum = "City & Guilds (South Africa)", level = "Level 2 / N4 Diploma", docType = "guide" } = req.body || {};

    try {
      const ai = getGeminiClient();
      if (ai) {
        const prompt = `As a senior culinary examiner for ${curriculum} and accredited vocational assessor (${level}), formulate a comprehensive ${docType === 'curriculum' ? 'official curriculum syllabus' : 'candidate self-study guide'} on the topic: "${topic}".
Include core learning competencies, SANS 10330 HACCP standards, edible portion yield testing, Escoffier culinary principles, practical kitchen assignments, and formal assessment criteria.
Return ONLY valid JSON matching this schema:
{
  "title": "string",
  "curriculum": "string",
  "level": "string",
  "overview": "string",
  "modules": [
    {
      "title": "string",
      "content": ["string"]
    }
  ],
  "keyVocabulary": ["string"],
  "practicalExercises": ["string"],
  "assessmentCriteria": ["string"],
  "content": "string (formatted markdown course syllabus)"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.4,
            responseMimeType: "application/json"
          }
        });

        const text = response.text || "";
        if (text.trim()) {
          const cleaned = text.replace(/```json|```/g, "").trim();
          const firstBrace = cleaned.indexOf("{");
          const lastBrace = cleaned.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1) {
            const parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
            res.json({ data: parsed, source: "gemini-3.8-flash" });
            return;
          }
        }
      }
    } catch (err: any) {
      console.warn("Server study guide AI generation error (falling back to study guide engine):", err?.message || err);
    }

    // High-fidelity fallback aligned with City & Guilds
    const fallbackGuide = synthesizeStudyGuide(topic, curriculum, level, docType);
    res.json({ data: fallbackGuide, source: "commis-academy-engine" });
  });

  /**
   * Route: Chef Culinary Assistant Chat
   */
  app.post("/api/gemini/chat", async (req, res) => {
    const { message, history = [] } = req.body || {};
    try {
      const ai = getGeminiClient();
      if (ai) {
        const promptHistory = history.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content || '' }]
        }));

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [
            ...promptHistory,
            { role: "user", parts: [{ text: message }] }
          ],
          config: {
            systemInstruction: "You are a professional and friendly Executive Chef AI Consultant. Answer questions about culinary disciplines, Escoffier guidelines, SANS 10330 HACCP standards, food costing, and banquet operations concisely and elegantly."
          }
        });

        res.json({ reply: response.text || "Chef AI is standing by." });
        return;
      }
    } catch (err: any) {
      console.warn("Server chat error:", err?.message || err);
    }

    res.json({
      reply: "Executive Culinary Consultant (Offline Mode): Standing by. For high-volume banquet service, maintain strict cold-chain compliance (SANS 10330 HACCP) and target an Escoffier food cost benchmark under 30%."
    });
  });

  /**
   * Route: Larousse Classical Recipe Generator
   */
  app.post("/api/gemini/larousse-recipe", async (req, res) => {
    const { dishName, region = "South Africa" } = req.body || {};
    try {
      const ai = getGeminiClient();
      if (ai) {
        const prompt = `Act as an Auguste Escoffier certified Maître Cuisinier and Larousse Gastronomique archivist. Formulate a classical, Michelin-grade master recipe for "${dishName}" with exact mise-en-place for banquet execution in ${region}. Include mother sauce linkage, SANS 10330 cold-chain guidelines, and technical French culinary terminology (Brunoise, Emulsion, Chiffonade, etc.).
Return valid JSON matching:
{
  "recipeTitle": "string",
  "culinaryHeritage": "string",
  "targetYield": "string",
  "prepTime": "string",
  "cookTime": "string",
  "miseEnPlace": [{ "item": "string", "specification": "string", "quantity": "string", "prepTechnique": "string" }],
  "executionSteps": [{ "stepNumber": 1, "phase": "string", "title": "string", "instruction": "string" }],
  "larousseInsights": [{ "term": "string", "definition": "string", "motherSauceLinkage": "string" }],
  "platedPresentationNotes": "string"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.3,
            responseMimeType: "application/json"
          }
        });

        const text = (response.text || "").replace(/```json|```/g, "").trim();
        const first = text.indexOf("{");
        const last = text.lastIndexOf("}");
        if (first !== -1 && last !== -1) {
          const parsed = JSON.parse(text.substring(first, last + 1));
          res.json({ data: parsed });
          return;
        }
      }
    } catch (err: any) {
      console.warn("Larousse generation server fallback:", err?.message || err);
    }

    // High-quality fallback recipe
    res.json({
      data: {
        recipeTitle: `Classical ${dishName}`,
        culinaryHeritage: "Escoffier Classical French & Modern South African High Cuisine",
        targetYield: "10 Covers / Banquet Portioning",
        prepTime: "25 Minutes",
        cookTime: "20 Minutes",
        miseEnPlace: [
          { item: "Primary Protein / Produce", specification: "Trimmed, portioned & chilled <4°C", quantity: "1.2 kg", prepTechnique: "Precision Brunoise & Par-cook" },
          { item: "Cold-Pressed Virgin Olive Oil", specification: "Single-estate cold press", quantity: "120 ml", prepTechnique: "Emulsion binding" },
          { item: "Fresh Fine Herbs", specification: "Chervil, tarragon, flat-leaf parsley", quantity: "45 g", prepTechnique: "Delicate Chiffonade" },
          { item: "Kalahari Desert Crystal Salt", specification: "Mineral-rich unrefined salt", quantity: "15 g", prepTechnique: "Season to finish" }
        ],
        executionSteps: [
          { stepNumber: 1, phase: "Mise en Place", title: "Thermal Stabilization & Sanitize", instruction: "Sanitize stainless steel station according to SANS 10330 standards. Maintain chilled items at <4°C." },
          { stepNumber: 2, phase: "Thermal Execution", title: "Precision Sear & Deglaze", instruction: "Sear over uniform medium-high heat until Maillard reaction develops golden coloration. Deglaze base with citrus reduction." },
          { stepNumber: 3, phase: "Plating & Finishing", title: "Aromatic Lustre & Presentation", instruction: "Drape herbs delicately. Finish with cold-pressed olive oil emulsified with microplaned lemon zest." }
        ],
        larousseInsights: [
          { term: "Brunoise", definition: "Precision 2mm fine dice ensuring uniform cooking surface and elegant mouthfeel.", motherSauceLinkage: "Velouté" },
          { term: "Emulsion", definition: "Suspension of two unmixable liquids stabilized by natural phospholipids.", motherSauceLinkage: "Hollandaise" }
        ],
        platedPresentationNotes: "Center protein on warm ceramic, spoon glossy reduction across the diagonal, and crown with fresh chiffonade herbs."
      }
    });
  });

  /**
   * Route: Suggest Menu Variations
   */
  app.post("/api/gemini/suggest-variations", async (req, res) => {
    const { menuText } = req.body || {};
    try {
      const ai = getGeminiClient();
      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `Given this menu description, suggest 3 elegant alternative variations (e.g. vegan, low-carb, allergen-free). Return only a JSON array of 3 short strings:\n${menuText}`,
          config: {
            responseMimeType: "application/json"
          }
        });
        const text = (response.text || "").replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          res.json({ variations: parsed });
          return;
        }
      }
    } catch (err: any) {
      console.warn("Suggest variations fallback:", err?.message || err);
    }

    res.json({
      variations: [
        "Vegan Adaptation: Substitute King Oyster Mushroom Medallions for Seafood/Meat",
        "Gluten-Free Protocol: Utilize Tapioca and Rice Flour for Crisp Tempura Glaze",
        "Halal Assurance: Verified SANHA / NIHT Certified Poultry & Lamb Supply"
      ]
    });
  });

  /**
   * Route: Generate Hero / Cover Image for Proposal
   * Uses Gemini Image generation with fallback to curated high-res culinary assets.
   * Ensures every menu produces a unique, relevant hero image matching title, description, and event type.
   */
  app.post("/api/gemini/generate-image", async (req, res) => {
    const {
      title = "Executive Culinary Showcase",
      eventType = "Hotel Banquet",
      cuisineStyle = "Contemporary",
      description = "",
      prompt
    } = req.body || {};
    
    const effectiveEventType = (eventType || "Hotel Banquet").trim();
    const effectiveCuisine = (cuisineStyle || "Contemporary Cape & Continental").trim();
    const eventLower = effectiveEventType.toLowerCase();
    const cuisineLower = effectiveCuisine.toLowerCase();
    const combinedContext = `${effectiveEventType} ${effectiveCuisine} ${title} ${description}`.toLowerCase();

    // Specific mapping conditions
    const isPicnic = /picnic|hamper|alfresco|al fresco|garden party|outdoor feast|blanket|meadow|lawn/i.test(eventLower) ||
                     /picnic/i.test(combinedContext);
    const isBraai = /braai|bbq|barbecue|grill|flame|fire|smoke|shisanyama/i.test(cuisineLower) || 
                    /braai|bbq|barbecue|grill|flame|fire|smoke|shisanyama/i.test(eventLower);
    const isCocktail = /cocktail|canape|canap|flying canap|reception|passed|hors d'?oeuvre|tapas|finger food|standing/i.test(eventLower) ||
                       /cocktail|canape|canap|reception/i.test(cuisineLower);
    const isWineTasting = /wine tasting|wine pairing|sommelier|cellar door|vineyard tasting|cheese and wine/i.test(eventLower) ||
                          /wine tasting|wine pairing|sommelier/i.test(cuisineLower);
    const isWedding = /wedding|nuptial|bridal|marriage/i.test(eventLower);
    const isBanquet = /banquet|gala|plated|hotel banquet|fine dining|conference/i.test(eventLower);
    const isCaribbean = /caribbean|jerk|tropical|jamaican|creole|island|bahamian/i.test(cuisineLower);
    const isSeafood = /seafood|linefish|scallop|salmon|prawn|crayfish|oyster|coastal|marine/i.test(cuisineLower) ||
                      /seafood|linefish/i.test(eventLower);
    const isGraduation = /graduation|matric|prom|commencement/i.test(eventLower);
    const isCorporate = /corporate|conference|business|ddr|boardroom/i.test(eventLower);
    const isFrench = /french|escoffier|haute cuisine/i.test(cuisineLower);
    const isPlant = /plant|vegan|vegetarian|harvest/i.test(cuisineLower);
    const isAsian = /asian|oriental|fusion|dim sum/i.test(cuisineLower);

    // Rule 3: Strict negative rules - never indoor café/coffee shop, never pasta, never generic stock people
    const negativeConstraints = "Strict rules: Absolutely no indoor café or coffee shop, no restaurant interior, no diners eating pasta, no generic stock people, no empty glasses or solo drinks. Focus strictly on appetizing culinary food presentation.";

    // Rule 1, 2, 4, 5: Construct strict image prompt using BOTH Event Type & Cuisine Style
    // Example structure: “Professional food photography of a [Event Type] featuring [Cuisine Style], [specific relevant food elements], high quality, realistic, South African context if applicable”
    let defaultPrompt = '';

    if ((isPicnic && isBraai) || (isPicnic && /braai|heritage/i.test(cuisineLower))) {
      // Rule 2a & 5: Picnic or Picnic + Braai / Heritage Braai -> Outdoor South African picnic scene: picnic blanket on grass, wicker hamper, braai/grill elements, boerewors, pap, salads, cheese & charcuterie boards, natural daylight, trees or open field. Never indoor café or restaurant scenes. Force outdoor natural lighting and picnic/braai atmosphere.
      defaultPrompt = `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, an outdoor South African picnic scene: picnic blanket on grass, wicker hamper, braai/grill elements, boerewors, pap, salads, cheese & charcuterie boards, natural daylight, trees or open field. Forced outdoor natural lighting, authentic picnic and braai atmosphere, high quality, realistic, South African context. ${negativeConstraints}`;
    } else if (isPicnic) {
      // Rule 2a & 5: Pure Picnic -> Outdoor South African picnic scene: picnic blanket on grass, wicker hamper, salads, cheese & charcuterie boards, natural daylight, trees or open field. Force outdoor natural lighting.
      defaultPrompt = `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, an outdoor South African picnic scene: picnic blanket on grass, wicker hamper, fresh garden salads, cheese & charcuterie boards, artisan bread and preserves, natural daylight, trees or open field. Forced outdoor natural lighting, authentic picnic atmosphere, high quality, realistic, South African context if applicable. ${negativeConstraints}`;
    } else if (isBraai) {
      // Rule 2d & 5: Any Braai-related event -> Outdoor fire, grill, smoke, traditional South African braai food and setting. Force outdoor natural lighting and braai atmosphere.
      defaultPrompt = `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, an outdoor fire, grill, smoke, traditional South African braai food and setting with sizzling boerewors coils, prime lamb chops, potbrood, pap and chakalaka on a rustic wooden table. Forced outdoor natural lighting, authentic braai atmosphere, high quality, realistic, South African context. ${negativeConstraints}`;
    } else if (isCocktail) {
      // Rule 2b: Cocktail Party / Flying Canapé -> Elegant butler-passed canapé trays, sophisticated standing reception food, high-end hors d’oeuvres.
      defaultPrompt = `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, elegant butler-passed canapé trays, sophisticated standing reception food, high-end hors d’oeuvres, delicate savory tartlets and appetizer spoons, warm ambient lighting, high quality, realistic, South African context if applicable. ${negativeConstraints}`;
    } else if (isWedding || isBanquet) {
      // Rule 2c: Hotel Banquet / Wedding -> Beautifully plated dishes or refined banquet table settings.
      defaultPrompt = `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, beautifully plated dishes or refined banquet table settings, exquisite multi-course culinary presentation, delicate sauce reductions, micro-greens, fine tableware, warm celebratory ambient lighting, high quality, realistic, South African context if applicable. ${negativeConstraints}`;
    } else if (isWineTasting) {
      defaultPrompt = `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, sommelier wine flight and artisan cheese pairing boards, biltong ribbons, fresh figs, crackers, tasting cellar setting, warm golden ambient lighting, high quality, realistic, South African context if applicable. ${negativeConstraints}`;
    } else if (isCaribbean) {
      defaultPrompt = `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, vibrant upscale banquet presentation with jerk spiced roasted cuts, grilled seafood skewers, colorful tropical fruits and herb garnishes, rich sauces, festive banquet ambiance, high quality, realistic. ${negativeConstraints}`;
    } else if (isSeafood) {
      defaultPrompt = `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, spectacular coastal seafood banquet featuring crispy-skin linefish, scallops with saffron velouté, chilled shellfish platters, fresh lemon wedges, and micro-herbs, high quality, realistic. ${negativeConstraints}`;
    } else {
      // Rule 4: Default format explicitly including event type and cuisine style
      defaultPrompt = `Professional food photography of a ${effectiveEventType} featuring ${effectiveCuisine}, beautifully presented culinary dishes, refined catering display, fresh garnishes, high quality, realistic, South African context if applicable. Appetizing food styling, natural ambient lighting, 8k resolution. ${negativeConstraints}`;
    }

    // Always strictly enforce the constructed prompt adhering to all user rules
    const imagePrompt = (prompt && prompt.trim().length > 20) ? prompt.trim() : defaultPrompt;

    try {
      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [{ text: imagePrompt }]
            },
            config: {
              imageConfig: {
                aspectRatio: "16:9"
              }
            }
          });

          for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData && part.inlineData.data) {
              const mimeType = part.inlineData.mimeType || 'image/jpeg';
              res.json({
                imageUrl: `data:${mimeType};base64,${part.inlineData.data}`,
                isFallback: false
              });
              return;
            }
          }
        } catch (geminiErr: any) {
          console.warn("Gemini 3.1 flash-lite-image notice, trying Imagen:", geminiErr?.message || geminiErr);
          try {
            const imgRes = await ai.models.generateImages({
              model: 'imagen-3.0-generate-002',
              prompt: imagePrompt,
              config: {
                numberOfImages: 1,
                aspectRatio: '16:9',
                outputMimeType: 'image/jpeg'
              }
            });
            const b64 = imgRes.generatedImages?.[0]?.image?.imageBytes;
            if (b64) {
              res.json({
                imageUrl: `data:image/jpeg;base64,${b64}`,
                isFallback: false
              });
              return;
            }
          } catch (imagenErr: any) {
            console.warn("Imagen generation notice (using curated banquet photography):", imagenErr?.message || imagenErr);
          }
        }
      }
    } catch (err: any) {
      console.warn("Image route handler warning:", err?.message || err);
    }

    // Dynamic, high-resolution culinary photography pools (guaranteeing varied, fresh images per menu)
    const CULINARY_POOLS = {
      // Picnic + Braai / Heritage Braai: Outdoor picnic on blanket with wicker hamper, boerewors, pap, chakalaka, biltong
      picnicBraai: [
        "/images/sa_picnic_braai_feast_1790939053855.jpg", // Outdoor South African picnic on grass with wicker hamper and braai grill
        "/images/south_african_braai_feast_1790939079000.jpg", // Authentic wood-fired South African braai feast with boerewors & chops
        "/images/south_african_picnic_grazing_1790923193324.jpg" // South African artisanal grazing board with biltong & Cape cheeses
      ],
      // Pure Picnic / Alfresco Hamper: luxury picnic hampers, grazing boards, tiered stands, artisan sourdough, parfait jars
      picnic: [
        "/images/spring_picnic_gourmet_feast_1790923177569.jpg", // Gourmet luxury spring picnic feast with open hamper, baguettes, tiered macarons & charcuterie
        "/images/south_african_picnic_grazing_1790923193324.jpg", // South African artisanal picnic grazing spread with biltong, Cape cheeses & bobotie tarts
        "/images/sa_picnic_braai_feast_1790939053855.jpg"  // Outdoor picnic feast on blanket in open field
      ],
      // Braai / BBQ / Flame: authentic wood fire, boerewors, lamb chops, potbrood, chakalaka
      braai: [
        "/images/south_african_braai_feast_1790939079000.jpg", // Authentic wood-fired South African braai feast with boerewors & chops
        "/images/sa_picnic_braai_feast_1790939053855.jpg", // Outdoor South African braai grill on open lawn
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"  // Artisanal braai cuts & grilled banquet
      ],
      // Cocktail / Canapés / Reception: All images MUST feature canapé trays, passed hors d'oeuvres, or standing reception food (NO solo drink glasses)
      cocktail: [
        "/images/canape_cocktail_reception_1790839889744.jpg", // Artisan savory canapés on catering trays
        "https://images.unsplash.com/photo-1555244162-803834f70033", // Artisan smoked salmon & herb canapés on catering trays
        "https://images.unsplash.com/photo-1541544741938-0af808871cc0", // Gourmet crostini & passed hors d'oeuvres spread
        "https://images.unsplash.com/photo-1574484284002-952d92456975"  // Elegant catering skewers and appetizer bites
      ],
      // Caribbean / Tropical / Jerk Banquet
      caribbean: [
        "/images/caribbean_banquet_feast_1790839910815.jpg", // Island jerk spiced feast & tropical grill
        "https://images.unsplash.com/photo-1540420773420-3366772f4999", // Vibrant tropical spiced grill & colorful banquet
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836"  // Island feast spread with tropical garnishes
      ],
      // Hotel Banquet / Plated Courses / Gala
      banquet: [
        "/images/hotel_banquet_plated_dinner_1790839899546.jpg", // Michelin-star plated hotel banquet dinner
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5", // Luxury hotel banquet room with plated dining
        "https://images.unsplash.com/photo-1544025162-d76694265947", // Prime roasted rack and fondant presentation
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"  // Chef plated course with microgreens
      ],
      // Wedding & Nuptial
      wedding: [
        "/images/wedding_banquet_table_1790839921478.jpg", // Luxury wedding banquet table setting
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed", // Royal wedding banquet table setting
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3"  // Luxury outdoor banquet dinner
      ],
      // Corporate & Conference
      corporate: [
        "/images/hotel_banquet_plated_dinner_1790839899546.jpg",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622", // Executive business dinner event
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2"  // Conference dining buffet & courses
      ],
      // Seafood & Coastal
      seafood: [
        "/images/coastal_seafood_banquet_1790839949705.jpg", // Pan-seared linefish & coastal seafood
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb"  // Plated seafood linefish & shellfish
      ],
      // French Haute Cuisine
      french: [
        "/images/hotel_banquet_plated_dinner_1790839899546.jpg",
        "https://images.unsplash.com/photo-1550547660-d9450f859349"  // Haute cuisine classical plating
      ],
      // Plant-based & Harvest
      plant: [
        "https://images.unsplash.com/photo-1540420773420-3366772f4999", // Fresh harvest vegetable banquet
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"  // Gourmet organic salad spread
      ],
      // Asian Fusion
      asian: [
        "https://images.unsplash.com/photo-1563245372-f21724e3856d", // Asian culinary feast
        "https://images.unsplash.com/photo-1541544741938-0af808871cc0"  // Fusion appetizers
      ],
      // Graduation
      graduation: [
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94", // Commencement celebratory dinner
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"  // Banquet hall celebration
      ],
      // Wine Tasting / Sommelier Cellar Pairing
      wineTasting: [
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3", // Sommelier wine flight and artisan cheese pairing
        "https://images.unsplash.com/photo-1528823872057-9c018a7a7553"  // Vineyard cellar cheese and wine tasting table
      ]
    };

    // Determine candidate pool strictly based on event & cuisine
    let pool: string[];
    if (isPicnic && isBraai) pool = CULINARY_POOLS.picnicBraai;
    else if (isPicnic) pool = CULINARY_POOLS.picnic;
    else if (isBraai) pool = CULINARY_POOLS.braai;
    else if (isCocktail) pool = CULINARY_POOLS.cocktail;
    else if (isWineTasting) pool = CULINARY_POOLS.wineTasting;
    else if (isWedding) pool = CULINARY_POOLS.wedding;
    else if (isCaribbean) pool = CULINARY_POOLS.caribbean;
    else if (isSeafood) pool = CULINARY_POOLS.seafood;
    else if (isGraduation) pool = CULINARY_POOLS.graduation;
    else if (isCorporate) pool = CULINARY_POOLS.corporate;
    else if (isFrench) pool = CULINARY_POOLS.french;
    else if (isPlant) pool = CULINARY_POOLS.plant;
    else if (isAsian) pool = CULINARY_POOLS.asian;
    else pool = CULINARY_POOLS.banquet;

    // Use a hash of title, description, and time so every newly generated menu receives a different image
    const seedString = `${title}-${description}-${eventType}-${Date.now()}-${Math.random()}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
      hash |= 0;
    }
    const selectedIndex = Math.abs(hash) % pool.length;
    const basePhoto = pool[selectedIndex];
    // Append query params for high-res format and unique cache-busting signature
    const finalImageUrl = `${basePhoto}?auto=format&fit=crop&w=1600&q=85&caterpro_sig=${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    res.json({ imageUrl: finalImageUrl, isFallback: true });
  });

  // Vite Middleware Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CaterPro AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
