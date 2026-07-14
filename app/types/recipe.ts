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
  translations: Localized<RecipeContent>;
  accent: "green" | "pink" | "gold" | "sage";
}

export interface LocalizedRecipe extends Omit<Recipe, "translations">, RecipeContent {}

export interface FilterState {
  mealTypes: MealType[];
  careContexts: CareContext[];
  ingredients: IngredientFilter[];
}
