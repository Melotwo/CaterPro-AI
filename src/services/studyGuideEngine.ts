/**
 * Study Guide & Curriculum Synthesizer Engine
 * Generates authoritative educational guides and syllabi aligned with
 * City & Guilds (South Africa), QCTO Chef Occupational Qualifications,
 * DHET Hospitality N4-N6, and International Culinary Standards.
 */

import { EducationContent } from '../types';

export function synthesizeStudyGuide(
  topic: string,
  curriculum: string,
  level: string,
  docType: 'guide' | 'curriculum'
): EducationContent & { content: string } {
  const cleanTopic = topic || 'Menu Engineering & Food Costing';
  const cleanCurriculum = curriculum || 'City & Guilds (South Africa)';
  const cleanLevel = level || 'Level 2 / N4 Diploma';

  let overview = '';
  let modules: { title: string; content: string[] }[] = [];
  let keyVocabulary: string[] = [];
  let practicalExercises: string[] = [];
  let assessmentCriteria: string[] = [];

  const isCosting = /cost|menu|financ|margin|profit|gp|budget|yield/i.test(cleanTopic);
  const isSafety = /sans|haccp|safe|hygiene|temp|clean|audit/i.test(cleanTopic);
  const isSauces = /sauce|escoffier|mother|roux|velout|fond/i.test(cleanTopic);

  if (isCosting) {
    overview = `This authoritative module equips culinary trainees and commis chefs with foundational knowledge of menu engineering, wholesale ingredient yield factors (As-Purchased vs. Edible Portion), statutory SANS 10330 costing compliance, and real-world Gross Profit (GP%) benchmarks. Aligned with ${cleanCurriculum} standards.`;
    modules = [
      {
        title: "Module 1: Principles of Food Cost Percentage & GP%",
        content: [
          "Understanding the Escoffier benchmark: targeting food cost between 26% and 32% in commercial hotel operations.",
          "Mathematical derivation: Gross Profit % = ((Selling Price - Food Cost) / Selling Price) × 100.",
          "Distinguishing direct plate cost from operational hotel overheads (labor, energy, breakage)."
        ]
      },
      {
        title: "Module 2: Butchery Yield Testing & Edible Portion (EP) Calculations",
        content: [
          "Conducting a raw protein yield test on whole Karoo lamb shoulder and Atlantic linefish.",
          "Calculating the Edible Portion Cost: EP Cost = AP Purchase Cost / Yield Percentage.",
          "Repurposing trim, bones, and parings into stocks and reductions to prevent culinary shrinkage."
        ]
      },
      {
        title: "Module 3: Standardized Recipe Formulation & Cost Sheets",
        content: [
          "Structuring an unalterable Standard Recipe Card (SRC) with portion weights in grams/milliliters.",
          "Tracking seasonal price fluctuations in South African wholesale markets (ZAR).",
          "Applying buffer multipliers (1.10x for buffet service; 1.25x for high-volume banqueting)."
        ]
      },
      {
        title: "Module 4: Menu Psychology & High-Margin Item Positioning",
        content: [
          "Categorizing dishes into Stars, Plowhorses, Puzzles, and Dogs using Boston Consulting matrix principles.",
          "Strategic placement on banquet proposals and à la carte layouts to guide diner selection.",
          "Dietary upselling: formulating premium allergen-free and vegan choices with superior contribution margins."
        ]
      }
    ];
    keyVocabulary = [
      "Gross Profit (GP%)",
      "Edible Portion (EP)",
      "As Purchased (AP)",
      "Culinary Yield Factor",
      "Standard Recipe Card (SRC)",
      "Plate Costing",
      "Contribution Margin",
      "Shrinkage"
    ];
    practicalExercises = [
      "Calculate the EP cost per 180g portion of whole Scottish Salmon purchased at R280/kg with an 82% yield factor.",
      "Formulate a complete 3-course banquet cost sheet for 100 covers targeting exactly 76% Gross Profit.",
      "Conduct a variance audit between theoretical kitchen food cost and physical stocktake variance."
    ];
    assessmentCriteria = [
      "Candidate accurately computes Gross Profit % across 5 standard menu items without error.",
      "Candidate calculates As-Purchased to Edible-Portion conversion with 95%+ precision.",
      "Candidate outlines 3 mitigation protocols for kitchen food waste reduction under SANS standards."
    ];
  } else if (isSafety) {
    overview = `Comprehensive workplace training covering SANS 10330:2020 Hazard Analysis Critical Control Points (HACCP) within professional South African hotel kitchen brigades. Focuses on cold-chain integrity, allergen cross-contamination, and statutory audit readiness.`;
    modules = [
      {
        title: "Module 1: The 7 Principles of SANS 10330 HACCP",
        content: [
          "Conducting comprehensive hazard analysis for biological, chemical, and physical food risks.",
          "Identifying Critical Control Points (CCPs): cold-receiving, raw protein storage, thermal cook thresholds.",
          "Establishing critical limits: maintaining chilled holding strictly <4°C and hot holding at ≥65°C."
        ]
      },
      {
        title: "Module 2: Statutory Allergen Matrix Management",
        content: [
          "Tracking the 14 statutory major allergens: Gluten, Crustaceans, Eggs, Fish, Peanuts, Soy, Milk/Dairy, Nuts, Celery, Mustard, Sesame, Sulphites, Lupin, Molluscs.",
          "Preventing cross-contact via dedicated color-coded cutting boards and sanitized staging utensils.",
          "Executing emergency anaphylaxis reaction response procedures in front-of-house."
        ]
      },
      {
        title: "Module 3: Subterranean Kitchen Cold-Chain Auditing",
        content: [
          "Logging twice-daily digital temperature records for walk-in blast chillers and deep freezes.",
          "First-In, First-Out (FIFO) stock rotation protocols and indelible labeling conventions.",
          "Hygienic sanitation validation using ATP bioluminescence swab testing."
        ]
      }
    ];
    keyVocabulary = [
      "SANS 10330",
      "Critical Control Point (CCP)",
      "Danger Zone (5°C - 60°C)",
      "FIFO Stock Rotation",
      "Cross-Contact",
      "Cold-Chain Maintenance",
      "ATP Swab Audit"
    ];
    practicalExercises = [
      "Perform a simulated receipt inspection of chilled poultry delivery; identify 2 non-compliance parameters.",
      "Draft an Allergen Isolation Protocol for an event with severe peanut and shellfish allergies.",
      "Conduct a walk-in cold room thermometer calibration test using an ice-point slurry."
    ];
    assessmentCriteria = [
      "Candidate correctly defines CCP parameters and permissible corrective actions.",
      "Candidate demonstrates proper color-coded equipment selection for allergen staging.",
      "Candidate logs a mock 7-day HACCP cold-holding audit sheet adhering to SANS standards."
    ];
  } else if (isSauces) {
    overview = `An in-depth culinary masterclass on classical French gastronomy based on Auguste Escoffier and Larousse Gastronomique. Explores the genealogy of the Five French Mother Sauces, roux chemistry, and modern banquet execution.`;
    modules = [
      {
        title: "Module 1: The Five French Mother Sauces (Grandes Sauces)",
        content: [
          "Béchamel: White roux emulsified with scalded milk, infused with onion clouté and nutmeg.",
          "Velouté: Blond roux blended with light chicken, veal, or fish stock (white fond).",
          "Espagnole & Demi-Glace: Brown roux simmered with roasted veal fond, mirepoix, and tomato paste.",
          "Sauce Tomate: Classical rendered pork fat, aromatic mirepoix, San Marzano tomatoes, and blonde veal stock.",
          "Hollandaise: Warm emulsion of egg yolks, clarified butter, and lemon/shallot reduction."
        ]
      },
      {
        title: "Module 2: Derivative Compound Sauces (Petites Sauces)",
        content: [
          "Béchamel derivatives: Mornay (Gruyère/Parmesan), Soubise (caramelized onion puree), Nantua (crayfish butter).",
          "Velouté derivatives: Suprême (crème fraîche), Allemande (egg yolk liaison), Bercy (shallots and white wine).",
          "Hollandaise derivatives: Béarnaise (tarragon reduction), Mousseline (whipped cream), Choron (tomato reduction)."
        ]
      },
      {
        title: "Module 3: Roux Chemistry, Emulsions & Thermal Stabilization",
        content: [
          "Starch gelatinization curves for white, blond, and brown roux (equal parts clarified butter and flour).",
          "Phospholipid lecithin mechanics in preventing broken egg-butter emulsions.",
          "Banquet stabilization: maintaining sauces in insulated thermal holding without curdling or skin formation."
        ]
      }
    ];
    keyVocabulary = [
      "Béchamel",
      "Velouté",
      "Espagnole",
      "Hollandaise",
      "Sauce Tomate",
      "Roux Blanc / Blond / Brun",
      "Emulsion",
      "Onion Clouté",
      "Liaison"
    ];
    practicalExercises = [
      "Prepare 500ml of classical Velouté from scratch; evaluate coat consistency via the 'nappe' spoon test.",
      "Derive a Béarnaise sauce from warm egg emulsion and fresh tarragon reduction.",
      "Troubleshoot and rescue a broken Hollandaise emulsion using the warm water whisk technique."
    ];
    assessmentCriteria = [
      "Sauce achieves silky nappe consistency with zero starch graininess or raw flour taste.",
      "Hollandaise demonstrates gloss, proper volume expansion, and temperature stability at 55°C.",
      "Candidate recites all 5 mother sauces and at least 2 derivatives for each."
    ];
  } else {
    // General Culinary Arts Topic
    overview = `Comprehensive vocational syllabus and study guide for "${cleanTopic}", designed for hospitality students and apprentice chefs. Formulated according to ${cleanCurriculum} requirements for ${cleanLevel}.`;
    modules = [
      {
        title: `Module 1: Foundational Competencies in ${cleanTopic}`,
        content: [
          `Core theoretical principles governing ${cleanTopic} in modern high-volume hotel environments.`,
          "Classical knife techniques, mise-en-place organization, and station sanitization protocols.",
          "SANS 10330 cold-chain safety benchmarks and cross-contamination prevention."
        ]
      },
      {
        title: `Module 2: Technical Application & Practical Execution`,
        content: [
          "Step-by-step practical methods: thermal searing, braising, delicate par-cooking, and temperature holding.",
          "Portion control, kitchen yield scaling, and waste minimization.",
          "Plated presentation symmetry, color balance, and aromatic finishing."
        ]
      },
      {
        title: `Module 3: Costing & Commercial Quality Standards`,
        content: [
          "Calculating portion cost and contribution margin in commercial hotel brigades.",
          "Supplier communication, seasonal produce procurement, and wholesale price indexing (ZAR).",
          "Banquet Event Order (BEO) interpretation and brigade coordination."
        ]
      }
    ];
    keyVocabulary = [
      "Mise en Place",
      "SANS 10330",
      "Yield Percentage",
      "Food Cost Target",
      "HACCP Audit",
      "Portion Control",
      "Maillard Reaction"
    ];
    practicalExercises = [
      `Execute a 45-minute practical mise en place simulation centered on ${cleanTopic}.`,
      "Draft a standard recipe cost card with edible portion calculations for 50 covers.",
      "Conduct a peer station audit evaluating knife safety, hygiene, and time management."
    ];
    assessmentCriteria = [
      `Candidate demonstrates thorough mastery of core principles in ${cleanTopic}.`,
      "Practical work is executed cleanly within designated examination timeframes.",
      "Candidate complies with all health, safety, and allergen labeling regulations."
    ];
  }

  // Format full printable markdown
  const markdownContent = `# ${cleanTopic}
**Curriculum Standard:** ${cleanCurriculum}  
**Qualification Level:** ${cleanLevel}  
**Document Classification:** ${docType === 'curriculum' ? 'Official Course Syllabus & Accreditation Outline' : 'Candidate Self-Study Guide & Revision Dossier'}

---

## 1. Executive Course Overview
${overview}

---

## 2. Core Curriculum Modules
${modules.map((m, idx) => `
### ${m.title}
${m.content.map(c => `- ${c}`).join('\n')}
`).join('\n')}

---

## 3. Essential Technical Vocabulary
${keyVocabulary.map(v => `\`${v}\``).join(' • ')}

---

## 4. Practical Kitchen Assignments & Exercises
${practicalExercises.map((ex, i) => `${i + 1}. **${ex}**`).join('\n')}

---

## 5. Formal Assessment Criteria & Pass Benchmarks
${assessmentCriteria.map((crit, i) => `- [ ] ${crit}`).join('\n')}

---
*CaterPro AI • Commis Academy • Authorized Academic Dossier*
`;

  return {
    title: `${cleanTopic} Study Guide (${cleanCurriculum})`,
    curriculum: cleanCurriculum,
    level: cleanLevel,
    overview,
    modules,
    keyVocabulary,
    practicalExercises,
    assessmentCriteria,
    content: markdownContent
  };
}
