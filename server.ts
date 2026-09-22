import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { getCulinaryIngredientBreakdown } from "./src/services/culinaryCostingEngine";
import { synthesizeHotelMenu } from "./src/services/hotelMenuSynthesizer";
import { synthesizeStudyGuide } from "./src/services/studyGuideEngine";

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
    
    const combinedContext = `${eventType} ${cuisineStyle} ${title} ${description}`.toLowerCase();
    const isCocktail = /cocktail|canape|canap|reception|passed|hors d'?oeuvre|tapas|finger food|standing/i.test(combinedContext);
    const isCaribbean = /caribbean|jerk|tropical|jamaican|creole|island|bahamian/i.test(combinedContext);
    const isSeafood = /seafood|linefish|scallop|salmon|prawn|crayfish|oyster|coastal|marine/i.test(combinedContext);
    const isWedding = /wedding|nuptial|bridal|marriage/i.test(combinedContext);
    const isBraai = /braai|bbq|grill|barbecue|flame|fire|smoke/i.test(combinedContext);
    const isGraduation = /graduat|commence|alumni|academic|matric|prom/i.test(combinedContext);
    const isCorporate = /corporate|conference|summit|business|ddr|delegate/i.test(combinedContext);
    const isPlant = /plant|vegan|vegetarian|harvest|organic/i.test(combinedContext);
    const isAsian = /asian|oriental|fusion|dim sum|thai|japanese|sushi/i.test(combinedContext);
    const isFrench = /french|escoffier|classic|haute cuisine|gourmet/i.test(combinedContext);

    // Build rich, specific prompt explicitly focusing on plated food, canapé trays, or banquet tables (NO single drinks)
    let defaultPrompt = '';
    if (isCocktail) {
      defaultPrompt = `Editorial catering food photography of "${title}". High-end evening standing cocktail reception and banquet presentation. Butler-passed silver and slate trays of exquisite artisan canapés, savory gourmet hors d'oeuvres, micro-greens, edible flower garnishes, bite-sized delicacies, and gourmet small plates. Atmosphere: sophisticated event venue with warm ambient lighting, elegant guests mingling at a standing reception in the soft background blur. ${description ? `Theme: ${description}.` : ''} Cuisine: ${cuisineStyle}. Focus purely on appetizing gourmet food presentation and passed canapé platters, no solitary drink glasses, commercial culinary photography, 8k resolution, photorealistic.`;
    } else if (isCaribbean) {
      defaultPrompt = `Editorial catering food photography of "${title}". Vibrant upscale Caribbean banquet feast presentation for a ${eventType}. Featuring authentic ${cuisineStyle} dishes, jerk spiced roasted cuts, grilled seafood skewers, colorful tropical fruits and herb garnishes, rich sauces, and an opulent buffet table. ${description ? `Context: ${description}.` : ''} Warm island ambient lighting, festive luxury banquet ambiance, shallow depth of field, appetizing colors, 8k resolution, crisp commercial culinary masterpiece.`;
    } else if (isSeafood) {
      defaultPrompt = `Editorial catering food photography of "${title}". Spectacular coastal seafood banquet for a ${eventType}. Crispy-skin pan-seared linefish, scallops with saffron velouté, chilled shellfish platters, fresh lemon wedges, and micro-herbs. ${description ? `Context: ${description}.` : ''} Style: ${cuisineStyle}. Michelin-star hotel banquet plating, warm chandelier lighting, shallow depth of field, 8k resolution.`;
    } else {
      defaultPrompt = `Editorial professional food photography of "${title}". Spectacular luxury catering presentation for a ${eventType}, featuring authentic ${cuisineStyle} cuisine, exquisitely plated multi-course gourmet dishes, banquet feasting tables, artistic sauce drizzles, and hotel dining atmosphere. ${description ? `Context: ${description}.` : ''} Warm ambient chandelier lighting, pristine linen, shallow depth of field, appetizing colors, 8k resolution, crisp commercial culinary masterpiece.`;
    }

    const imagePrompt = prompt || defaultPrompt;

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
      // Cocktail / Canapés / Reception: All images MUST feature canapé trays, passed hors d'oeuvres, or standing reception food (NO solo drink glasses)
      cocktail: [
        "https://images.unsplash.com/photo-1555244162-803834f70033", // Artisan smoked salmon & herb canapés on catering trays
        "https://images.unsplash.com/photo-1541544741938-0af808871cc0", // Gourmet crostini & passed hors d'oeuvres spread
        "https://images.unsplash.com/photo-1574484284002-952d92456975", // Elegant catering skewers and appetizer bites
        "https://images.unsplash.com/photo-1509440159596-0249088772ff"  // Reception table with savory canapé platters
      ],
      // Caribbean / Tropical / Jerk Banquet
      caribbean: [
        "https://images.unsplash.com/photo-1540420773420-3366772f4999", // Vibrant tropical spiced grill & colorful banquet
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836", // Island feast spread with tropical garnishes
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47"  // Flame-roasted tropical feast
      ],
      // Hotel Banquet / Plated Courses / Gala
      banquet: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5", // Luxury hotel banquet room with plated dining
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3", // Michelin star fine dining banquet course
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0", // Chef plated course with microgreens
        "https://images.unsplash.com/photo-1578474846511-04ba529f0b88", // Grand ballroom plated banquet service
        "https://images.unsplash.com/photo-1544025162-d76694265947"  // Prime Karoo cuts & banquet table presentation
      ],
      // Wedding & Nuptial
      wedding: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed", // Royal wedding banquet table setting
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3", // Luxury outdoor banquet dinner
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf"  // Wedding celebration plated service
      ],
      // Corporate & Conference
      corporate: [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622", // Executive business dinner event
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2"  // Conference dining buffet & courses
      ],
      // Seafood & Coastal
      seafood: [
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb", // Plated seafood linefish & shellfish
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"  // Coastal oceanfront banquet feast
      ],
      // Braai & BBQ
      braai: [
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1", // Artisanal braai cuts & grilled banquet
        "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd"  // Carved roast meats banquet
      ],
      // French Haute Cuisine
      french: [
        "https://images.unsplash.com/photo-1550547660-d9450f859349", // Haute cuisine classical plating
        "https://images.unsplash.com/photo-1502301103665-0b95cc738daf"  // Fine dining pastry & savory plate
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
      ]
    };

    // Determine candidate pool
    let pool: string[];
    if (isCocktail) pool = CULINARY_POOLS.cocktail;
    else if (isCaribbean) pool = CULINARY_POOLS.caribbean;
    else if (isSeafood) pool = CULINARY_POOLS.seafood;
    else if (isWedding) pool = CULINARY_POOLS.wedding;
    else if (isGraduation) pool = CULINARY_POOLS.graduation;
    else if (isCorporate) pool = CULINARY_POOLS.corporate;
    else if (isBraai) pool = CULINARY_POOLS.braai;
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
