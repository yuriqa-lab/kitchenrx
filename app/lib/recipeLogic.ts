import type { FilterState, Language, Recipe } from "../types/recipe";

export const SAVED_RECIPES_KEY = "kitchenrx:saved-recipes:v1";

export function filterRecipes(recipes: Recipe[], filters: FilterState, savedOnly: boolean, savedIds: Set<string>): Recipe[] {
  return recipes.filter((recipe) => {
    if (savedOnly && !savedIds.has(recipe.id)) return false;

    const matchesMeal = filters.mealTypes.length === 0 || filters.mealTypes.includes(recipe.mealType);
    const matchesContext =
      filters.careContexts.length === 0 ||
      filters.careContexts.some((context) => recipe.careContexts.includes(context));
    const matchesIngredient =
      filters.ingredients.length === 0 ||
      filters.ingredients.some((ingredient) => recipe.featuredIngredients.includes(ingredient));

    return matchesMeal && matchesContext && matchesIngredient;
  });
}

export function formatMealList(recipes: Pick<Recipe, "translations">[], language: Language): string {
  const title = language === "ja" ? "KitchenRx 献立リスト" : "KitchenRx Meal List";
  return `${title}\n\n${recipes.map((recipe) => `- ${(recipe.translations[language] ?? recipe.translations.en).title}`).join("\n")}`;
}

export function parseSavedRecipeIds(rawValue: string | null, validIds: Set<string>): { ids: string[]; repaired: boolean } {
  if (rawValue === null) return { ids: [], repaired: false };

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return { ids: [], repaired: true };

    const ids = [...new Set(parsed.filter((value): value is string => typeof value === "string" && validIds.has(value)))];
    return { ids, repaired: ids.length !== parsed.length };
  } catch {
    return { ids: [], repaired: true };
  }
}
