export const languages = ["en", "ja"] as const;
export const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;

export const careContexts = [
  "lowEnergy",
  "gentleMeal",
  "familyMeal",
  "highProtein",
  "comfortFood",
  "quickPreparation",
] as const;

export const ingredientFilters = [
  "rice",
  "eggs",
  "tofu",
  "chicken",
  "vegetables",
  "pasta",
  "soup",
  "fruit",
] as const;

export type Language = (typeof languages)[number];
export type MealType = (typeof mealTypes)[number];
export type CareContext = (typeof careContexts)[number];
export type IngredientFilter = (typeof ingredientFilters)[number];
export type Localized<T> = { en: T; ja?: T };

export const nutrientIds = ["lutein", "zeaxanthin", "vitaminE", "omega3"] as const;
export const evidenceIngredientIds = ["spinach", "almonds", "salmon"] as const;

export type NutrientId = (typeof nutrientIds)[number];
export type EvidenceIngredientId = (typeof evidenceIngredientIds)[number];

export interface RecipeContent {
  title: string;
  titleSegments?: string[];
  description: string;
  ingredients: string[];
  steps: string[];
  whyItMayHelp: string;
}

export interface Recipe {
  id: string;
  mealType: MealType;
  prepMinutes: number;
  careContexts: CareContext[];
  featuredIngredients: IngredientFilter[];
  evidenceIngredients: EvidenceIngredientId[];
  nutrientTags: NutrientId[];
  translations: Localized<RecipeContent>;
  accent: "green" | "pink" | "gold" | "sage";
}

export interface EvidenceSource {
  id: string;
  name: string;
  publisher: string;
  url: string;
}

export interface NutrientContent {
  name: string;
  shortDescription: string;
}

export interface NutrientProfile {
  id: NutrientId;
  translations: Localized<NutrientContent>;
  sourceIds: string[];
}

export interface EvidenceIngredientContent {
  name: string;
  whyIncluded: string;
}

export interface EvidenceIngredientProfile {
  id: EvidenceIngredientId;
  nutrientIds: NutrientId[];
  translations: Localized<EvidenceIngredientContent>;
  sourceIds: string[];
}

export interface LocalizedRecipe extends Omit<Recipe, "translations">, RecipeContent {}

export interface FilterState {
  mealTypes: MealType[];
  careContexts: CareContext[];
  ingredients: IngredientFilter[];
}
