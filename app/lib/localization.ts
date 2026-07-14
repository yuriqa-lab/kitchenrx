import type { Language, Localized, LocalizedRecipe, Recipe } from "../types/recipe";

export const LANGUAGE_KEY = "kitchenrx:language:v1";

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "ja";
}

export function resolveInitialLanguage(storedValue: string | null, browserLanguages: readonly string[]): Language {
  if (isLanguage(storedValue)) return storedValue;
  return browserLanguages.some((value) => value.toLowerCase().startsWith("ja")) ? "ja" : "en";
}

export function localizedValue<T>(value: Localized<T>, language: Language): T {
  return value[language] ?? value.en;
}

export function localizeRecipe(recipe: Recipe, language: Language): LocalizedRecipe {
  return { ...recipe, ...localizedValue(recipe.translations, language) };
}
