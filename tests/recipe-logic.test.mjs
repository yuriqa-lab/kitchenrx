import assert from "node:assert/strict";
import test from "node:test";
import { filterRecipes, formatMealList, parseSavedRecipeIds } from "../app/lib/recipeLogic.ts";

const samples = [
  {
    id: "rice",
    title: "Rice Bowl",
    mealType: "Lunch",
    careContexts: ["Quick preparation"],
    featuredIngredients: ["Rice", "Eggs"],
  },
  {
    id: "soup",
    title: "Tofu Soup",
    mealType: "Dinner",
    careContexts: ["Gentle meal", "Comfort food"],
    featuredIngredients: ["Tofu", "Soup"],
  },
];

const noFilters = { mealTypes: [], careContexts: [], ingredients: [] };

test("filtering combines groups and matches selected values broadly within a group", () => {
  const filters = {
    mealTypes: ["Lunch"],
    careContexts: ["Quick preparation", "Gentle meal"],
    ingredients: ["Eggs", "Tofu"],
  };
  assert.deepEqual(filterRecipes(samples, filters, false, new Set()).map(({ id }) => id), ["rice"]);
});

test("saved-only filtering returns only known saved recipes", () => {
  assert.deepEqual(filterRecipes(samples, noFilters, true, new Set(["soup"])).map(({ id }) => id), ["soup"]);
});

test("saved recipe parsing repairs malformed and unavailable values", () => {
  const validIds = new Set(["rice", "soup"]);
  assert.deepEqual(parseSavedRecipeIds('["rice","missing","rice"]', validIds), { ids: ["rice"], repaired: true });
  assert.deepEqual(parseSavedRecipeIds("not-json", validIds), { ids: [], repaired: true });
  assert.deepEqual(parseSavedRecipeIds(null, validIds), { ids: [], repaired: false });
});

test("meal list formatting creates readable plain text", () => {
  assert.equal(formatMealList([{ title: "Rice Bowl" }, { title: "Tofu Soup" }]), "KitchenRx Meal List\n\n- Rice Bowl\n- Tofu Soup");
});
