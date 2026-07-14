import type {
  EvidenceIngredientId,
  EvidenceIngredientProfile,
  EvidenceSource,
  NutrientId,
  NutrientProfile,
} from "../types/recipe";

export const evidenceSources: EvidenceSource[] = [
  {
    id: "nei-areds2",
    name: "AREDS/AREDS2 Frequently Asked Questions",
    publisher: "National Eye Institute",
    url: "https://www.nei.nih.gov/eye-health-information/clinical-trials/age-related-eye-disease-studies-aredsareds2/aredsareds2-frequently-asked-questions",
  },
  {
    id: "nih-vitamin-e",
    name: "Vitamin E Fact Sheet for Consumers",
    publisher: "NIH Office of Dietary Supplements",
    url: "https://ods.od.nih.gov/factsheets/VitaminE-Consumer/",
  },
  {
    id: "nih-omega-3",
    name: "Omega-3 Fatty Acids Fact Sheet for Consumers",
    publisher: "NIH Office of Dietary Supplements",
    url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-Consumer/",
  },
  {
    id: "usda-fooddata-central",
    name: "FoodData Central",
    publisher: "U.S. Department of Agriculture",
    url: "https://fdc.nal.usda.gov/",
  },
];

export const nutrients: NutrientProfile[] = [
  {
    id: "lutein",
    translations: {
      en: {
        name: "Lutein",
        shortDescription: "A carotenoid found in foods such as dark leafy greens. KitchenRx uses it as a food-discovery label, without promising a health outcome.",
      },
      ja: {
        name: "ルテイン",
        shortDescription: "濃い緑色の葉物野菜などに含まれるカロテノイドです。KitchenRxでは、健康上の結果を約束せず、食材を知るための表示として扱います。",
      },
    },
    sourceIds: ["nei-areds2", "usda-fooddata-central"],
  },
  {
    id: "zeaxanthin",
    translations: {
      en: {
        name: "Zeaxanthin",
        shortDescription: "A carotenoid commonly discussed alongside lutein. Food amounts vary, so this guide uses broad ingredient connections rather than dose guidance.",
      },
      ja: {
        name: "ゼアキサンチン",
        shortDescription: "ルテインとともに取り上げられることの多いカロテノイドです。食品中の量には幅があるため、摂取量の指示ではなく食材との大まかな関係を示します。",
      },
    },
    sourceIds: ["nei-areds2", "usda-fooddata-central"],
  },
  {
    id: "vitaminE",
    translations: {
      en: {
        name: "Vitamin E",
        shortDescription: "A fat-soluble nutrient found in foods including nuts, seeds, oils, and some green vegetables. This guide describes food sources only.",
      },
      ja: {
        name: "ビタミンE",
        shortDescription: "ナッツ、種子、油、一部の緑色野菜などに含まれる脂溶性の栄養素です。ここでは食品に含まれる栄養情報だけを扱います。",
      },
    },
    sourceIds: ["nih-vitamin-e", "usda-fooddata-central"],
  },
  {
    id: "omega3",
    translations: {
      en: {
        name: "Omega-3 fatty acids",
        shortDescription: "A family of fatty acids that includes ALA, EPA, and DHA. Fatty fish such as salmon can provide EPA and DHA; this is food information, not supplement guidance.",
      },
      ja: {
        name: "オメガ3脂肪酸",
        shortDescription: "ALA、EPA、DHAなどを含む脂肪酸の総称です。鮭などの脂のある魚はEPAとDHAを含みますが、ここで扱うのは食品情報であり、サプリメントの案内ではありません。",
      },
    },
    sourceIds: ["nih-omega-3", "usda-fooddata-central"],
  },
];

export const evidenceIngredients: EvidenceIngredientProfile[] = [
  {
    id: "spinach",
    nutrientIds: ["lutein", "zeaxanthin", "vitaminE"],
    translations: {
      en: {
        name: "Spinach",
        whyIncluded: "Spinach is a practical leafy-green example for exploring the carotenoids lutein and zeaxanthin, and it also contributes vitamin E.",
      },
      ja: {
        name: "ほうれん草",
        whyIncluded: "ほうれん草は、ルテインとゼアキサンチンを含む葉物野菜の身近な例で、ビタミンEも含みます。",
      },
    },
    sourceIds: ["nih-vitamin-e", "usda-fooddata-central"],
  },
  {
    id: "almonds",
    nutrientIds: ["vitaminE"],
    translations: {
      en: {
        name: "Almonds",
        whyIncluded: "Almonds are a familiar food source of vitamin E and can be used in small amounts as a topping when they suit the eater.",
      },
      ja: {
        name: "アーモンド",
        whyIncluded: "アーモンドはビタミンEを含む身近な食品で、食べる人に合う場合は少量をトッピングとして使えます。",
      },
    },
    sourceIds: ["nih-vitamin-e", "usda-fooddata-central"],
  },
  {
    id: "salmon",
    nutrientIds: ["omega3"],
    translations: {
      en: {
        name: "Salmon",
        whyIncluded: "Salmon is a commonly available food source of the omega-3 fatty acids EPA and DHA.",
      },
      ja: {
        name: "鮭",
        whyIncluded: "鮭は、オメガ3脂肪酸のEPAとDHAを含む、手に入りやすい食品のひとつです。",
      },
    },
    sourceIds: ["nih-omega-3", "usda-fooddata-central"],
  },
  {
    id: "blueberries",
    nutrientIds: ["lutein", "zeaxanthin"],
    translations: {
      en: {
        name: "Blueberries",
        whyIncluded: "Blueberries provide a colorful fruit example in the ingredient guide. FoodData Central records carotenoid components including lutein and zeaxanthin; amounts vary by food entry.",
      },
      ja: {
        name: "ブルーベリー",
        whyIncluded: "色のある果物を知る例として掲載しています。FoodData Centralにはルテインやゼアキサンチンを含むカロテノイド成分が記録されていますが、量は食品データごとに異なります。",
      },
    },
    sourceIds: ["usda-fooddata-central"],
  },
];

const sourceById = new Map(evidenceSources.map((source) => [source.id, source]));

export function getEvidenceSources(sourceIds: string[]): EvidenceSource[] {
  return sourceIds.flatMap((sourceId) => {
    const source = sourceById.get(sourceId);
    return source ? [source] : [];
  });
}

export function getIngredientsForNutrient(nutrientId: NutrientId): EvidenceIngredientProfile[] {
  return evidenceIngredients.filter((ingredient) => ingredient.nutrientIds.includes(nutrientId));
}

export function getNutrientIdsForIngredients(ingredientIds: EvidenceIngredientId[]): NutrientId[] {
  const selected = new Set<NutrientId>();
  for (const ingredientId of ingredientIds) {
    const ingredient = evidenceIngredients.find((item) => item.id === ingredientId);
    ingredient?.nutrientIds.forEach((nutrientId) => selected.add(nutrientId));
  }
  return [...selected];
}
