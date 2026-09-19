import { QctoQualification, CostingDrill, LecturerLessonPlan, StudentPoeEntry } from '../types/academic';
import { Menu } from '../types';

export const QCTO_QUALIFICATIONS: QctoQualification[] = [
  {
    id: 'chef',
    title: 'Occupational Certificate: Chef',
    saqaId: '101697',
    nqfLevel: 5,
    credits: 540,
    curriculumCode: '343401001',
    subFramework: 'OQSF (Occupational Qualifications Sub-Framework)',
    purpose: 'Qualifies candidates to plan, manage, and execute high-volume, fine-dining, and institutional culinary operations, including advanced menu engineering, culinary brigade leadership, and financial costing compliance.',
    targetRoles: ['Executive Chef', 'Sous Chef', 'Head Banquet Chef', 'Culinary Operations Manager', 'Catering Entrepreneur'],
    modules: [
      {
        code: 'KM-05',
        type: 'Knowledge',
        title: 'Food Costing, Yield Management & Menu Engineering',
        credits: 18,
        learningOutcomes: [
          'Calculate As-Purchased (AP) vs Edible-Portion (EP) yields across meat, poultry, seafood, and fresh produce.',
          'Formulate standardized recipe cost sheets in South African Rands (ZAR) incorporating wastage buffers.',
          'Execute Boston Consulting Group (BCG) menu matrix analysis (Stars, Plow Horses, Puzzles, Dogs) to optimize profitability.',
          'Determine target food cost percentages (28%–32%) and set menu selling prices using Gross Profit (GP) multipliers.'
        ],
        caterproToolAlignment: [
          {
            toolName: 'Plate Costing & Yields Calculator',
            description: 'Automated recipe costing engine with dynamic ZAR pricing, VAT calculations, and portion cost breakdown.',
            evidenceProduced: 'Standardized Costing Sheets, Margin vs Volume Matrix, Breakeven Analysis Reports'
          },
          {
            toolName: 'Larousse Yield Calculator',
            description: 'Scales classical Auguste Escoffier recipes dynamically to match proposal guest counts with automated unit conversions.',
            evidenceProduced: 'Commercial Batching Sheets, EP Yield Multiplier Logs'
          }
        ],
        assessmentCriteria: [
          'Calculates gross profit margins accurately to within 0.5% tolerance.',
          'Constructs standardized recipe card with all ingredient quantities, units, unit costs, and total cost per portion.',
          'Applies realistic trim wastage factors (10%–25%) based on butcher yield tests.'
        ]
      },
      {
        code: 'KM-01',
        type: 'Knowledge',
        title: 'Advanced Kitchen Operations & Classical Culinary Theories',
        credits: 24,
        learningOutcomes: [
          'Trace classical French culinary foundations and Auguste Escoffier five mother sauces lineages.',
          'Analyze regional and indigenous South African culinary heritage and modern fusion techniques.',
          'Understand thermal heat transfer, sous-vide vacuum kinetics, and Maillard reactions.'
        ],
        caterproToolAlignment: [
          {
            toolName: 'Food Encyclopedia (Larousse Gastronomique)',
            description: 'AI-grounded classical culinary dictionary explaining lexicon terms, mother sauce derivations, and classical techniques.',
            evidenceProduced: 'Lexicon Notes, Culinary Heritage Dossiers, Classical Technique Guides'
          }
        ],
        assessmentCriteria: [
          'Accurately identifies mother sauces and secondary derivative sauces.',
          'Demonstrates understanding of high-volume banquet temperature maintenance.'
        ]
      },
      {
        code: 'PM-06',
        type: 'Practical',
        title: 'Formulate Banquet Menus with Nutritional, Cultural & Allergen Compliance',
        credits: 22,
        learningOutcomes: [
          'Design multi-course banquet menus balancing textures, colors, cooking methods, and dietary requests.',
          'Construct complete 14-major-allergen risk management matrices conforming to SANS 10330 and R638 regulations.',
          'Draft formal Banquet Event Orders (BEO) specifying service timings, staff ratios, and equipment schedules.'
        ],
        caterproToolAlignment: [
          {
            toolName: 'Executive Command Center',
            description: 'Generates complete hotel-grade banquet proposals with room logistics, staffing ratios, and equipment needs.',
            evidenceProduced: 'Formal Banquet Event Orders (BEO), Client Proposals, Banquet Menus'
          },
          {
            toolName: 'Allergen Compliance Matrix',
            description: 'Automated 14-allergen cross-reference matrix identifying gluten, dairy, nuts, eggs, shellfish, and soy across all menu courses.',
            evidenceProduced: 'SANS 10330 Allergen Matrix, Cross-Contamination Mitigation Plans'
          }
        ],
        assessmentCriteria: [
          'Produces allergen matrix with 100% identification of specified common allergens.',
          'Formulates operational BEO containing setup times, service styles, and equipment manifests.'
        ]
      },
      {
        code: 'PM-02',
        type: 'Practical',
        title: 'Prepare, Cook and Plate Classical & Contemporary Multi-Course Dishes',
        credits: 45,
        learningOutcomes: [
          'Execute precision knife skills (brunoise, julienne, mirepoix, chiffonade) under time constraints.',
          'Master thermal sealing, braising, roasting, reduction sauces, and modern plating aesthetics.',
          'Organize cold-room mise en place staging in Gastronorm pans (GN 1/1).'
        ],
        caterproToolAlignment: [
          {
            toolName: 'Recipe Generator & Prep List',
            description: 'Generates step-by-step culinary execution briefs with HACCP critical control points and plating notes.',
            evidenceProduced: 'Kitchen Prep Checklists, Mise en Place Manifests, Plating Guidelines'
          }
        ],
        assessmentCriteria: [
          'Demonstrates proper knife cut dimensions to within ±1mm standard.',
          'Maintains hot food holding above 65°C and cold food holding below 4°C at all stages.'
        ]
      },
      {
        code: 'WM-01',
        type: 'Workplace',
        title: 'Manage Commercial Brigade Production & Kitchen Safety Compliance',
        credits: 60,
        learningOutcomes: [
          'Supervise brigade stations in a commercial hospitality or TVET kitchen environment.',
          'Implement HACCP SANS 10330 verification logs, probe thermometer calibrations, and chemical sanitization checks.',
          'Audit inventory movements, reduce plate scrapings, and manage food waste sustainably.'
        ],
        caterproToolAlignment: [
          {
            toolName: 'Student Portfolio of Evidence (PoE) Builder',
            description: 'Captures digital photo proofs, temperature logs, lecturer evaluations, and workplace hours logging.',
            evidenceProduced: 'Digital PoE File, Lecturer Signed Assessment Sheets, Workplace Logbooks'
          }
        ],
        assessmentCriteria: [
          'Evidence verified and signed off by certified TVET or academy culinary assessor.',
          'Accurate recording of temperature control logs and waste minimisation actions.'
        ]
      }
    ]
  },
  {
    id: 'cook',
    title: 'Occupational Certificate: Cook',
    saqaId: '102296',
    nqfLevel: 4,
    credits: 180,
    curriculumCode: '343401002',
    subFramework: 'OQSF (Occupational Qualifications Sub-Framework)',
    purpose: 'Prepares learners to produce, cook, and assemble hot and cold dishes in commercial restaurants, hotels, hospitals, and institutional catering units under chef supervision.',
    targetRoles: ['Line Cook', 'Commis Chef', 'Station Cook (Chef de Partie assistant)', 'Catering Cook'],
    modules: [
      {
        code: 'KM-02',
        type: 'Knowledge',
        title: 'Recipe Standardisation, Measurements & Portion Control',
        credits: 12,
        learningOutcomes: [
          'Understand metric conversions (grams to kilograms, millilitres to litres).',
          'Calculate portion yields from standard recipe formulations.',
          'Identify common culinary wastage factors and trim allowances.'
        ],
        caterproToolAlignment: [
          {
            toolName: 'Yield Calculator & Commercial Batching',
            description: 'Converts base recipes to target banquet sizes with automated unit conversions (g → kg, ml → L).',
            evidenceProduced: 'Scaled Batch Prep Lists, Commercial Unit Worksheets'
          }
        ],
        assessmentCriteria: [
          'Accurately calculates total raw ingredients needed for specified cover count.',
          'Demonstrates correct scale calibration and portioning ladle/scoop usage.'
        ]
      },
      {
        code: 'KM-03',
        type: 'Knowledge',
        title: 'Food Safety Principles, SANS 10330 & Safe Storage',
        credits: 10,
        learningOutcomes: [
          'Identify temperature danger zone (5°C to 60°C) and cross-contamination hazards.',
          'Execute proper FIFO (First In, First Out) stock rotation in walk-in fridges and dry stores.',
          'Understand South African R638 hygiene regulations for food premises.'
        ],
        caterproToolAlignment: [
          {
            toolName: 'HACCP & SANS 10330 Guidance',
            description: 'Provides critical control point alerts, temperature limits, and cold-chain protocols for large batches.',
            evidenceProduced: 'HACCP Verification Checklists, Storage Compliance Records'
          }
        ],
        assessmentCriteria: [
          'Stores raw proteins below cooked/ready-to-eat foods.',
          'Labels and dates all prepped items with clear expiry markers.'
        ]
      },
      {
        code: 'PM-03',
        type: 'Practical',
        title: 'Cook, Assemble, and Finish Hot and Cold Dishes',
        credits: 35,
        learningOutcomes: [
          'Prepare stocks, basic soups, starches, vegetables, and simple protein dishes.',
          'Assemble banquet plates following executive chef plating specification.',
          'Apply correct holding and reheating methods.'
        ],
        caterproToolAlignment: [
          {
            toolName: 'Recipe Generator & Classical Insights',
            description: 'Step-by-step guidance for cooking methods, thermal control, and classical finishing techniques.',
            evidenceProduced: 'Practical Cooking Step Checklists, Plating Proof Photos'
          }
        ],
        assessmentCriteria: [
          'Dishes cooked to safe core temperatures (poultry ≥74°C, reheated items ≥75°C).',
          'Uniform portion size maintained across 20+ continuous plates.'
        ]
      },
      {
        code: 'WM-02',
        type: 'Workplace',
        title: 'Operational Food Storage, FIFO Inventory & Wastage Reduction',
        credits: 40,
        learningOutcomes: [
          'Receive deliveries against purchase orders, checking temperatures and packaging integrity.',
          'Record daily wastage and scrapings to assist sous chef in ordering accuracy.',
          'Participate in commercial service shifts under head chef direction.'
        ],
        caterproToolAlignment: [
          {
            toolName: 'Shopping List & Supplier Management',
            description: 'Itemized ingredient lists organized by commercial supply categories with price estimates.',
            evidenceProduced: 'Delivery Checklists, Waste Audit Logs, Shift Attendance Logs'
          }
        ],
        assessmentCriteria: [
          'Identifies sub-standard goods upon receiving and follows rejection procedure.',
          'Complies with clean-as-you-go hygiene standards during production.'
        ]
      }
    ]
  },
  {
    id: 'kitchen-hand',
    title: 'Occupational Certificate: Kitchen Hand',
    saqaId: '110644',
    nqfLevel: 3,
    credits: 120,
    curriculumCode: '512201001',
    subFramework: 'OQSF (Occupational Qualifications Sub-Framework)',
    purpose: 'Equips learners with foundational kitchen cleanliness, hygiene, basic peeling/chopping, pot scullery, and waste segregation skills required to assist culinary brigades in professional hospitality kitchens.',
    targetRoles: ['Kitchen Hand', 'Kitchen Porter', 'Scullery Attendant', 'Apprentice Kitchen Assistant'],
    modules: [
      {
        code: 'KM-01',
        type: 'Knowledge',
        title: 'Kitchen Hygiene, Chemical Safety & Equipment Care',
        credits: 8,
        learningOutcomes: [
          'Identify color-coded cutting boards and cleaning cloths to prevent cross-contamination.',
          'Understand chemical dilution rates, Material Safety Data Sheets (MSDS), and PPE usage.',
          'Recognize basic kitchen equipment and safe wash-up operating procedures.'
        ],
        caterproToolAlignment: [
          {
            toolName: 'Commis Academy & Food Safety Modules',
            description: 'Foundational kitchen sanitation drills, color-code guides, and hygiene compliance reminders.',
            evidenceProduced: 'Chemical Handling Checklists, Sanitization Schedule Logs'
          }
        ],
        assessmentCriteria: [
          'Correctly pairs cutting board color to food item (Red: raw meat, Yellow: poultry, Blue: fish, Green: vegetables, White: dairy/bakery).',
          'Follows correct three-sink dishwashing method (Scrape, Wash 45°C, Rinse 50°C, Sanitize 77°C or chemical, Air-dry).'
        ]
      },
      {
        code: 'PM-01',
        type: 'Practical',
        title: 'Raw Ingredient Preparation, Washing, Peeling & Coarse Cutting',
        credits: 24,
        learningOutcomes: [
          'Wash, scrub, peel, and trim root vegetables, herbs, and fruits.',
          'Perform rough chopping and initial prep for stocks and mirepoix under chef supervision.',
          'Weigh and portion bulk items into pre-designated containers.'
        ],
        caterproToolAlignment: [
          {
            toolName: 'Larousse Mise en Place Guide',
            description: 'Illustrates proper peeling, trimming, and storage techniques to minimize unnecessary wastage.',
            evidenceProduced: 'Veg Prep Logs, Wastage Peeling Tests'
          }
        ],
        assessmentCriteria: [
          'Peels produce with less than 15% unnecessary flesh loss.',
          'Maintains sanitized prep area with waste bins cleared regularly.'
        ]
      },
      {
        code: 'WM-01',
        type: 'Workplace',
        title: 'Scullery Management, Waste Sorting & Cold Store Organization',
        credits: 30,
        learningOutcomes: [
          'Operate commercial conveyor or pass-through dishwashing machines according to manufacturer specs.',
          'Sort organic food waste, recyclable glass/cardboard, and general waste.',
          'Assist chefs with heavy stockpot handling and deep cleaning schedules.'
        ],
        caterproToolAlignment: [
          {
            toolName: 'Student Portfolio of Evidence (PoE) Builder',
            description: 'Records scullery operational checklists, supervisor endorsements, and practical cleaning sign-offs.',
            evidenceProduced: 'Scullery Task Completion Logs, Waste Segregation Proofs'
          }
        ],
        assessmentCriteria: [
          'Maintains scullery water temperatures and detergent dosing as per health guidelines.',
          'Logs hours verified by culinary lecturer or head kitchen steward.'
        ]
      }
    ]
  }
];

export const COSTING_DRILLS: CostingDrill[] = [
  {
    id: 'drill-1',
    title: "Butcher's Yield Test & Edible Portion (EP) Costing",
    category: 'Yield Calculation',
    qctoModuleRef: 'KM-05 (Occupational Certificate: Chef / SAQA 101697)',
    difficulty: 'Intermediate',
    scenario: "An executive chef orders a whole primal beef striploin (sirloin) weighing 8.4 kg at a purchase price (AP) of R185.00 per kg. After fabrication and boning, the chef produces 5.88 kg of clean steaks suitable for banquet service. The remaining 2.52 kg consists of usable trim for jus (1.2 kg valued at R40.00/kg) and pure fat/sinew waste (1.32 kg with R0 value).",
    givenData: {
      'Primal Weight (AP)': '8.40 kg',
      'Cost per kg (AP)': 'R 185.00',
      'Total Primal Cost': 'R 1,554.00',
      'Clean Steaks Yield (EP)': '5.88 kg',
      'Jus Trim Yield': '1.20 kg (valued at R40/kg = R48.00 credit)',
      'Waste / Sinew': '1.32 kg (R0 value)'
    },
    question: "Calculate the net cost per kg of the fabricated Edible Portion (EP) steaks in ZAR (rounded to two decimal places).",
    inputUnit: 'R / kg',
    expectedAnswer: 256.12,
    tolerance: 0.5,
    solutionSteps: [
      "Step 1: Calculate Total Purchase Cost = 8.40 kg × R185.00/kg = R1,554.00.",
      "Step 2: Deduct Salvage / Usable Trim Value = R1,554.00 - (1.20 kg × R40.00/kg) = R1,554.00 - R48.00 = R1,506.00 Net Steak Cost.",
      "Step 3: Divide Net Cost by Clean Steak Yield = R1,506.00 ÷ 5.88 kg = R256.12 per kg.",
      "Takeaway: The true cost of the steaks is R256.12/kg (not R185.00/kg), reflecting a 70% yield on clean meat."
    ],
    learningTakeaway: "In professional kitchen management, menu selling prices must always be calculated from the Edible Portion (EP) cost rather than the invoice As Purchased (AP) cost to prevent gross margin erosion."
  },
  {
    id: 'drill-2',
    title: 'Target Food Cost % & Menu Selling Price Formulation',
    category: 'Food Cost Percentage',
    qctoModuleRef: 'KM-05 (Occupational Certificate: Chef / SAQA 101697)',
    difficulty: 'Apprentice',
    scenario: "A culinary student is cost-engineering a signature Pan-Roasted Linefish dish. The total plate recipe cost (protein, sauce, starch, micro-garnish, and 5% seasoning buffer) comes to R68.60. The hotel's financial policy mandates a maximum Food Cost Percentage of 28.0% for all a la carte mains to cover kitchen labor and overheads.",
    givenData: {
      'Total Plate Cost': 'R 68.60',
      'Target Food Cost %': '28.0%',
      'VAT Rate (South Africa)': '15.0%'
    },
    question: "Calculate the menu selling price BEFORE VAT required to achieve exactly 28% food cost in ZAR.",
    inputUnit: 'ZAR (R)',
    expectedAnswer: 245.00,
    tolerance: 1.0,
    solutionSteps: [
      "Step 1: Formula for Selling Price (excl. VAT) = Plate Cost ÷ (Target Food Cost % ÷ 100).",
      "Step 2: Selling Price = R68.60 ÷ 0.28 = R245.00.",
      "Step 3: (Optional Verification): Food Cost % = R68.60 ÷ R245.00 = 0.28 (28.0%).",
      "Step 4: If inclusive of 15% South African VAT: R245.00 × 1.15 = R281.75 on customer bill."
    ],
    learningTakeaway: "Food cost percentage is an inverse calculation. Lower target food costs require higher pricing multipliers. A 28% target requires multiplying plate cost by approximately 3.57x."
  },
  {
    id: 'drill-3',
    title: 'Banquet Wastage Factor & Raw Purchasing Requirements',
    category: 'Wastage Factor',
    qctoModuleRef: 'KM-02 (Occupational Certificate: Cook / SAQA 102296)',
    difficulty: 'Intermediate',
    scenario: "A banqueting chef is catering a gala dinner for 220 covers. The menu features honey-glazed baby heirloom carrots. The standardized recipe specifies an Edible Portion (EP) of 85 grams of prepared, peeled, and trimmed carrots per guest. According to kitchen historical logs, peeling and topping baby carrots results in an 18% trimming wastage loss.",
    givenData: {
      'Guest Count': '220 Covers',
      'Portion Size (EP)': '85 g per guest',
      'Total EP Needed': '18.70 kg (220 × 0.085 kg)',
      'Prep Wastage Loss': '18.0%'
    },
    question: "How many kilograms of raw carrots (As Purchased - AP) must the chef order from the produce supplier to ensure sufficient yield? (Round to one decimal place)",
    inputUnit: 'kg',
    expectedAnswer: 22.8,
    tolerance: 0.2,
    solutionSteps: [
      "Step 1: Calculate total EP needed = 220 × 0.085 kg = 18.70 kg.",
      "Step 2: Calculate Yield Percentage = 100% - 18% wastage = 82% (0.82).",
      "Step 3: Formula: AP Needed = EP Needed ÷ Yield % = 18.70 kg ÷ 0.82 = 22.80 kg.",
      "Takeaway: Ordering only 18.7 kg would cause the kitchen to run out by 39 portions during service."
    ],
    learningTakeaway: "Never multiply the EP weight by the wastage percentage. You must divide the net requirement by the yield percentage (1 - wastage) to determine correct procurement orders."
  },
  {
    id: 'drill-4',
    title: 'Gross Profit (GP) Margin & Buffer Allowance Calculation',
    category: 'Buffer Margin',
    qctoModuleRef: 'KM-05 & PM-06 (Occupational Certificate: Chef / SAQA 101697)',
    difficulty: 'Master Chef',
    scenario: "A catering business sells a slow-braised Karoo lamb shank dinner at R340.00 per cover (exclusive of VAT). The standard recipe cost is R95.20. However, the chef must add a 6% buffer margin to cover kitchen seasoning, oil, tasting spoons, and plate wastage. Calculate the true Gross Profit Percentage (GP %) achieved on this dish.",
    givenData: {
      'Selling Price (excl VAT)': 'R 340.00',
      'Base Recipe Cost': 'R 95.20',
      'Kitchen Buffer Margin': '6.0% applied to base cost'
    },
    question: "Calculate the true Gross Profit Percentage (GP %) achieved on this dish (as a percentage, e.g. 70.3).",
    inputUnit: '%',
    expectedAnswer: 70.32,
    tolerance: 0.5,
    solutionSteps: [
      "Step 1: Calculate Total Cost with 6% buffer = R95.20 × 1.06 = R100.912.",
      "Step 2: Calculate Gross Profit = Selling Price - Total Cost = R340.00 - R100.91 = R239.09.",
      "Step 3: Calculate GP % = (Gross Profit ÷ Selling Price) × 100 = (R239.09 ÷ R340.00) × 100 = 70.32%.",
      "Step 4: Corresponding Food Cost % = 100% - 70.32% = 29.68% (comfortably inside standard hotel 30% ceiling)."
    ],
    learningTakeaway: "Buffer allowances (typically 4% to 8%) protect banqueting operations against ingredient micro-wastage, seasoning loss, and cooking yield shrink that are not accounted for on individual recipe lines."
  }
];

export const generateLessonPlanFromMenu = (menu: Menu, qualificationId: 'chef' | 'cook' | 'kitchen-hand' = 'chef'): LecturerLessonPlan => {
  const qual = QCTO_QUALIFICATIONS.find(q => q.id === qualificationId) || QCTO_QUALIFICATIONS[0];
  const covers = menu.guestCount || menu.covers || 50;
  const dishes = (menu.menu || []).map(m => m.dish);
  const primaryDish = dishes[0] || 'Seared Linefish & Pomme Purée';

  return {
    id: `LP-${Date.now()}`,
    title: `Practical Lesson Plan: ${menu.title || menu.menuTitle || 'Banquet Culinary Operations'}`,
    qualificationCode: `SAQA ID ${qual.saqaId} (NQF Level ${qual.nqfLevel})`,
    qualificationTitle: qual.title,
    nqfLevel: qual.nqfLevel,
    durationHours: 6,
    menuLinkedTitle: menu.title || menu.menuTitle || 'Executive Banquet Course',
    coversToSimulate: covers,
    practicalBrief: {
      objective: `Execute high-volume multi-course banquet production of ${primaryDish} and companion courses for ${covers} covers, integrating standardized recipe scaling, ZAR food costing verification, and SANS 10330 HACCP temperature controls.`,
      timeAllotmentMinutes: 240,
      equipmentNeeded: [
        'Commercial Combi Oven with core probe',
        'Blast Chiller / Rapid Chill Chamber',
        'Stainless Steel Gastronorm GN 1/1 Pans (65mm & 100mm)',
        'Calibrated Digital Probe Thermometers',
        'Dual-display Electronic Scales (accurate to 1g)',
        'Heavy-bottom Sauté Pans & Stainless Steel Whisks'
      ],
      ingredientsFocus: dishes.length > 0 ? dishes.slice(0, 4) : ['Fresh Linefish', 'Heirloom Root Vegetables', 'Farm Cream & Butter', 'Fresh Herbs']
    },
    yieldSheet: (menu.menu || []).slice(0, 4).map((item, idx) => ({
      item: item.dish,
      asPurchasedQty: `${(covers * 0.18).toFixed(1)} kg`,
      prepLossPercent: 12 + (idx * 3),
      ediblePortionQty: `${(covers * 0.15).toFixed(1)} kg`,
      costPerKgZar: Math.round((item.cost || 45) * 4.2),
      actualPortionCostZar: Number(item.cost || 45)
    })),
    studentExerciseQuestions: [
      {
        id: 'q1',
        question: `Calculate the total food cost in ZAR required to produce ${covers} portions of ${primaryDish} given a raw portion cost of R${(menu.menu?.[0]?.cost || 45).toFixed(2)}.`,
        type: 'costing',
        benchmarkAnswer: `Total Food Cost = ${covers} portions × R${(menu.menu?.[0]?.cost || 45).toFixed(2)} = R${(covers * (menu.menu?.[0]?.cost || 45)).toFixed(2)}.`
      },
      {
        id: 'q2',
        question: 'Identify two critical control points (CCPs) during banquet holding and specify the required core temperatures according to SANS 10330.',
        type: 'haccp',
        benchmarkAnswer: 'CCP 1: Cold holding of raw protein and finished cold starters must be kept ≤4°C. CCP 2: Hot holding on the banquet line must maintain core temperature ≥65°C.'
      },
      {
        id: 'q3',
        question: 'Explain how a 15% butchery trimming loss on your primary protein alters the cost per edible portion (EP).',
        type: 'technique',
        benchmarkAnswer: 'Trimming loss increases the true edible portion cost by a factor of 1 / (1 - 0.15) = 1.176x (+17.6%). The menu selling price must be derived from this inflated EP cost to preserve profit margin.'
      }
    ],
    haccpCcpPoints: [
      {
        step: 'Goods Receiving & Cold Store',
        hazard: 'Bacterial proliferation and broken cold chain',
        criticalLimit: 'Chilled produce ≤ 4°C, Frozen proteins ≤ -18°C',
        monitoringProcedure: 'Probe delivery items and record lot numbers in receiving register.'
      },
      {
        step: 'Thermal Cooking & Core Temp',
        hazard: 'Survival of vegetative pathogens (Salmonella, Listeria)',
        criticalLimit: 'Core temperature ≥ 74°C for at least 15 seconds',
        monitoringProcedure: 'Insert calibrated probe into thickest portion of meat and log on kitchen pass board.'
      },
      {
        step: 'Banquet Hot Holding',
        hazard: 'Spore germination of Clostridium perfringens in danger zone',
        criticalLimit: 'Hot holding temperature ≥ 65°C throughout service',
        monitoringProcedure: 'Check steam wells and hot cabinets every 30 minutes with calibrated probe.'
      }
    ],
    gradingRubric: [
      {
        criterion: 'Mise en Place & Knife Work Precision',
        weightPercent: 20,
        descriptor: 'Station cleanliness, uniform knife cuts (brunoise, chiffonade), proper board colors.'
      },
      {
        criterion: 'Cooking Technique & Thermal Mastery',
        weightPercent: 30,
        descriptor: 'Proper heat control, Maillard reaction, sauce emulsification, seasoning balance.'
      },
      {
        criterion: 'Costing, Yield & Scaling Accuracy',
        weightPercent: 25,
        descriptor: 'Correct application of wastage factors, yield scaling, and ZAR food cost calculations.'
      },
      {
        criterion: 'Plating Aesthetics & Temperature at Pass',
        weightPercent: 15,
        descriptor: 'Visual balance, clean rims, appropriate plate temperature, banquet uniformity.'
      },
      {
        criterion: 'SANS 10330 Sanitation & Safe Food Handling',
        weightPercent: 10,
        descriptor: 'Clean as you go, handwashing adherence, allergen segregation, accurate temp logs.'
      }
    ]
  };
};

export const INITIAL_STUDENT_POE: StudentPoeEntry = {
  id: 'POE-2026-0941',
  timestamp: new Date().toISOString(),
  studentName: 'Sipho Ndlovu',
  studentId: 'TVET-CUL-2024-883',
  institutionName: 'Tshwane South TVET College / Culinary Arts Institute',
  qualificationId: 'chef',
  saqaId: '101697',
  nqfLevel: 5,
  moduleFocus: 'KM-05: Food Costing, Yield Management & Menu Engineering (QCTO)',
  menuTitle: 'Executive 3-Course Banquet & High-Volume Costing Portfolio',
  guestCount: 120,
  totalFoodCostZar: 14880.00,
  sellingPriceZar: 53142.85,
  foodCostPercentage: 28.0,
  allergenChecklist: [
    { allergen: 'Gluten / Wheat', presentInMenu: true, mitigationPlan: 'Gluten-free rolls baked separately; dedicated prep table to avoid aerosol flour cross-contact.' },
    { allergen: 'Crustaceans / Shellfish', presentInMenu: false, mitigationPlan: 'No shellfish ordered for this banquet menu to eliminate severe anaphylaxis risks.' },
    { allergen: 'Eggs', presentInMenu: true, mitigationPlan: 'Pasteurized liquid egg used in emulsion dressings; clear signage on banquet cloches.' },
    { allergen: 'Dairy / Milk', presentInMenu: true, mitigationPlan: 'Lactose-free coconut emulsion alternative prepared for 6 registered vegan/dairy-intolerant guests.' },
    { allergen: 'Tree Nuts & Peanuts', presentInMenu: false, mitigationPlan: 'Strict nut-free facility policy during this banquet service.' },
    { allergen: 'Soybeans', presentInMenu: true, mitigationPlan: 'Certified non-GMO tamari sauce stored in clearly labeled allergen dispenser.' }
  ],
  practicalProofs: [
    {
      id: 'proof-1',
      title: 'Precision Brunoise Mirepoix Mise en Place',
      phase: 'Mise en Place',
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80',
      notes: 'Carrots, celery, and shallots cut to uniform 2mm brunoise for court-bouillon base. Trim wastage weighed at 14.2% and transferred to stock pot.',
      timestamp: '08:45 AM'
    },
    {
      id: 'proof-2',
      title: 'Pan-Searing & Core Thermal Probe Log',
      phase: 'Thermal Cooking',
      imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80',
      notes: 'Linefish seared on skin side for 3.5 mins. Core probe temperature verified at 74.8°C before transfer to heated holding cabinet at 68°C.',
      timestamp: '11:15 AM'
    },
    {
      id: 'proof-3',
      title: 'Finished Banquet Presentation Plate at Kitchen Pass',
      phase: 'Final Presentation',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
      notes: 'Finished presentation with glossy fynbos reduction, quenelle of herb purée, and micro-sorrel garnish. Approved by Head Chef for 120 covers.',
      timestamp: '12:30 PM'
    }
  ],
  reflectiveLog: "During the 120-cover simulation, our primary challenge was managing the 18% trimming loss on the raw beef tenderloin. By recalculating the edible portion cost using the CaterProAI Yield Calculator, we discovered our plate cost was R7.80 higher than estimated. We adjusted our portion size from 180g to 160g and enriched the starch component with local roasted root vegetables, keeping our food cost percentage at exactly 28.0% while maintaining high guest satisfaction.",
  lecturerVerification: {
    lecturerName: 'Chef M. van der Merwe (Assessor No. ED-7749)',
    lecturerId: 'TVET-ASSESSOR-1102',
    status: 'Competent',
    marksAwarded: 92,
    feedback: 'Exceptional evidence portfolio. The student demonstrated thorough grasp of As-Purchased vs Edible-Portion costing formulas, maintained rigorous SANS 10330 cold-chain logs, and executed consistent banquet plate presentation across the 120-cover brigade simulation.',
    signedAt: '2026-09-18 16:30 CAT'
  }
};
