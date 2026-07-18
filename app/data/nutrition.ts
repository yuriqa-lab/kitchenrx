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
        shortDescription: "Lutein is a carotenoid made by plants and found in foods such as spinach and other dark leafy greens. It is present in the retina and lens, where it may contribute to natural antioxidant and light-filtering functions. KitchenRx connects lutein with recipes that use spinach.",
      },
      ja: {
        name: "ルテイン",
        shortDescription: "ルテインは植物がつくるカロテノイドで、ほうれん草などの濃い緑色の葉物野菜に含まれます。網膜や水晶体にも存在し、抗酸化や光を吸収する働きがあると考えられています。KitchenRxでは、ほうれん草を使うレシピと結びつけています。",
      },
    },
    sourceIds: ["nei-areds2", "usda-fooddata-central"],
  },
  {
    id: "zeaxanthin",
    translations: {
      en: {
        name: "Zeaxanthin",
        shortDescription: "Zeaxanthin is a plant-made carotenoid found in green leafy vegetables and often discussed alongside lutein. It is present in the retina and lens, where it may contribute to natural antioxidant and light-filtering functions. KitchenRx connects zeaxanthin with recipes that use spinach.",
      },
      ja: {
        name: "ゼアキサンチン",
        shortDescription: "ゼアキサンチンは植物がつくるカロテノイドで、緑色の葉物野菜に含まれ、ルテインとともに取り上げられます。網膜や水晶体にも存在し、抗酸化や光を吸収する働きがあると考えられています。KitchenRxでは、ほうれん草を使うレシピと結びつけています。",
      },
    },
    sourceIds: ["nei-areds2", "usda-fooddata-central"],
  },
  {
    id: "vitaminE",
    translations: {
      en: {
        name: "Vitamin E",
        shortDescription: "Vitamin E is a fat-soluble nutrient found in almonds, seeds, vegetable oils, and some green vegetables. In the body, it acts as an antioxidant that helps protect cells from free-radical damage. KitchenRx connects vitamin E with recipes that use almonds or spinach.",
      },
      ja: {
        name: "ビタミンE",
        shortDescription: "ビタミンEは、アーモンド、種子、植物油、一部の緑色野菜などに含まれる脂溶性の栄養素です。体内では抗酸化物質として働き、細胞を酸化による損傷から守るのを助けます。KitchenRxでは、アーモンドやほうれん草を使うレシピと結びつけています。",
      },
    },
    sourceIds: ["nih-vitamin-e", "usda-fooddata-central"],
  },
  {
    id: "omega3",
    translations: {
      en: {
        name: "Omega-3 fatty acids",
        shortDescription: "Omega-3 fatty acids include ALA, EPA, and DHA. Fish such as salmon provide EPA and DHA; omega-3s are important components of the membranes surrounding cells and also provide energy. KitchenRx connects omega-3 fatty acids with recipes that use salmon.",
      },
      ja: {
        name: "オメガ3脂肪酸",
        shortDescription: "オメガ3脂肪酸には、ALA、EPA、DHAがあります。鮭などの魚にはEPAとDHAが含まれ、オメガ3脂肪酸は細胞を包む膜の重要な構成要素で、エネルギー源にもなります。KitchenRxでは、鮭を使うレシピと結びつけています。",
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
        whyIncluded: "Spinach wilts quickly into soups, pasta, and rice dishes. It is KitchenRx's main food connection for lutein and zeaxanthin and also contributes vitamin E.",
      },
      ja: {
        name: "ほうれん草",
        whyIncluded: "ほうれん草は短時間で火が通り、スープ、パスタ、ごはん料理へ取り入れやすい葉物野菜です。KitchenRxではルテインとゼアキサンチンの主な食材例とし、ビタミンEとのつながりも示します。",
      },
    },
    sourceIds: ["nei-areds2", "nih-vitamin-e", "usda-fooddata-central"],
  },
  {
    id: "almonds",
    nutrientIds: ["vitaminE"],
    translations: {
      en: {
        name: "Almonds",
        whyIncluded: "Almonds add crunch and a toasted flavor to pasta, oats, and other everyday dishes. They are KitchenRx's main food connection for vitamin E.",
      },
      ja: {
        name: "アーモンド",
        whyIncluded: "アーモンドは、パスタやオートミールなどに香ばしさと食感を加えられます。KitchenRxでは、ビタミンEとつながる主な食材として扱います。",
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
        whyIncluded: "Salmon works well in oven dishes and rice bowls and brings a rich, savory flavor. It is KitchenRx's food connection for the omega-3 fatty acids EPA and DHA.",
      },
      ja: {
        name: "鮭",
        whyIncluded: "鮭はオーブン料理やごはんボウルに使いやすく、うま味と食べ応えを加えられます。KitchenRxでは、オメガ3脂肪酸のEPAとDHAにつながる食材として扱います。",
      },
    },
    sourceIds: ["nih-omega-3", "usda-fooddata-central"],
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
