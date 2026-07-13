export const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

export const careContexts = [
  "Low energy",
  "Gentle meal",
  "Family meal",
  "High protein",
  "Comfort food",
  "Quick preparation",
] as const;

export const ingredientFilters = [
  "Rice",
  "Eggs",
  "Tofu",
  "Chicken",
  "Vegetables",
  "Pasta",
  "Soup",
  "Fruit",
] as const;

export type MealType = (typeof mealTypes)[number];
export type CareContext = (typeof careContexts)[number];
export type IngredientFilter = (typeof ingredientFilters)[number];

export interface Recipe {
  id: string;
  title: string;
  description: string;
  mealType: MealType;
  prepMinutes: number;
  careContexts: CareContext[];
  featuredIngredients: IngredientFilter[];
  ingredients: string[];
  steps: string[];
  whyItMayHelp: string;
  accent: "green" | "pink" | "gold" | "sage";
}

export interface FilterState {
  mealTypes: MealType[];
  careContexts: CareContext[];
  ingredients: IngredientFilter[];
}
