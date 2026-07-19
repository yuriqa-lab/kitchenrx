import assert from "node:assert/strict";
import test from "node:test";
import { recipes } from "../app/data/recipes.ts";
import { getUiCopy } from "../app/i18n/translations.ts";
import {
  countMatchCriteria,
  emptyMatchCriteria,
  findRecipeMatches,
  hasMatchCriteria,
} from "../app/lib/recipeMatch.ts";

const baseTranslation = {
  title: "Test recipe",
  description: "Test description",
  ingredients: ["Test ingredient"],
  steps: ["Test step"],
  whyItMayHelp: "Test note",
};

function makeRecipe(overrides) {
  return {
    id: "test-recipe",
    mealType: "lunch",
    prepMinutes: 20,
    careContexts: ["quickPreparation"],
    featuredIngredients: ["rice"],
    evidenceIngredients: [],
    nutrientTags: [],
    accent: "sage",
    translations: { en: baseTranslation, ja: { ...baseTranslation, title: "テストレシピ" } },
    ...overrides,
  };
}

test("KitchenRx Match requires at least one selected condition", () => {
  assert.equal(hasMatchCriteria(emptyMatchCriteria), false);
  assert.equal(countMatchCriteria(emptyMatchCriteria), 0);
  assert.deepEqual(findRecipeMatches(recipes, emptyMatchCriteria), []);
});

test("15-minute filtering includes 15 minutes and excludes 16 minutes or more", () => {
  const source = [
    makeRecipe({ id: "fifteen", prepMinutes: 15 }),
    makeRecipe({ id: "sixteen", prepMinutes: 16 }),
    makeRecipe({ id: "forty", prepMinutes: 40 }),
  ];

  const matches = findRecipeMatches(source, { ...emptyMatchCriteria, timeBudget: "15" });
  assert.deepEqual(matches.map(({ recipe }) => recipe.id), ["fifteen"]);
  assert.equal(matches[0].score, 1);
  assert.deepEqual(matches[0].reasons, [{ kind: "prepTime", minutes: 15 }]);
});

test("30-minute filtering includes 30 minutes and excludes 31 minutes or more", () => {
  const source = [
    makeRecipe({ id: "thirty", prepMinutes: 30 }),
    makeRecipe({ id: "thirty-one", prepMinutes: 31 }),
  ];

  assert.deepEqual(
    findRecipeMatches(source, { ...emptyMatchCriteria, timeBudget: "30" }).map(({ recipe }) => recipe.id),
    ["thirty"],
  );
});

test("45-minute filtering includes 45 minutes and excludes longer recipes", () => {
  const source = [
    makeRecipe({ id: "forty-five", prepMinutes: 45 }),
    makeRecipe({ id: "forty-six", prepMinutes: 46 }),
  ];

  assert.deepEqual(
    findRecipeMatches(source, { ...emptyMatchCriteria, timeBudget: "45" }).map(({ recipe }) => recipe.id),
    ["forty-five"],
  );
});

test("recipes with a different meal type are excluded", () => {
  const source = [
    makeRecipe({ id: "snack", mealType: "snack" }),
    makeRecipe({ id: "dinner", mealType: "dinner" }),
  ];

  assert.deepEqual(
    findRecipeMatches(source, { ...emptyMatchCriteria, mealType: "snack" }).map(({ recipe }) => recipe.id),
    ["snack"],
  );
});

test("recipes without the selected care context are excluded", () => {
  const source = [
    makeRecipe({ id: "gentle", careContexts: ["gentleMeal"] }),
    makeRecipe({ id: "family", careContexts: ["familyMeal"] }),
  ];

  assert.deepEqual(
    findRecipeMatches(source, { ...emptyMatchCriteria, careContext: "gentleMeal" }).map(({ recipe }) => recipe.id),
    ["gentle"],
  );
});

test("recipes without the selected ingredient are excluded", () => {
  const source = [
    makeRecipe({ id: "tofu", featuredIngredients: ["tofu"] }),
    makeRecipe({ id: "chicken", featuredIngredients: ["chicken"] }),
  ];

  assert.deepEqual(
    findRecipeMatches(source, { ...emptyMatchCriteria, ingredient: "tofu" }).map(({ recipe }) => recipe.id),
    ["tofu"],
  );
});

test("every selected nutrient excludes recipes without its existing connection", () => {
  for (const nutrientId of ["lutein", "zeaxanthin", "vitaminE", "omega3"]) {
    const matches = findRecipeMatches(recipes, { ...emptyMatchCriteria, nutrientId }, 27);
    const expectedIds = recipes.filter((recipe) => recipe.nutrientTags.includes(nutrientId)).map(({ id }) => id);

    assert.deepEqual(matches.map(({ recipe }) => recipe.id), expectedIds);
    assert.ok(matches.every(({ recipe }) => recipe.nutrientTags.includes(nutrientId)));
  }
});

test("multiple selected conditions use AND matching", () => {
  const criteria = {
    mealType: "dinner",
    careContext: "familyMeal",
    timeBudget: "30",
    ingredient: "vegetables",
    nutrientId: "lutein",
  };
  const source = [
    makeRecipe({ id: "all", mealType: "dinner", prepMinutes: 30, careContexts: ["familyMeal"], featuredIngredients: ["vegetables"], nutrientTags: ["lutein"] }),
    makeRecipe({ id: "wrong-meal", mealType: "lunch", prepMinutes: 30, careContexts: ["familyMeal"], featuredIngredients: ["vegetables"], nutrientTags: ["lutein"] }),
    makeRecipe({ id: "wrong-care", mealType: "dinner", prepMinutes: 30, careContexts: ["quickPreparation"], featuredIngredients: ["vegetables"], nutrientTags: ["lutein"] }),
    makeRecipe({ id: "too-slow", mealType: "dinner", prepMinutes: 31, careContexts: ["familyMeal"], featuredIngredients: ["vegetables"], nutrientTags: ["lutein"] }),
    makeRecipe({ id: "wrong-ingredient", mealType: "dinner", prepMinutes: 30, careContexts: ["familyMeal"], featuredIngredients: ["rice"], nutrientTags: ["lutein"] }),
    makeRecipe({ id: "wrong-nutrient", mealType: "dinner", prepMinutes: 30, careContexts: ["familyMeal"], featuredIngredients: ["vegetables"], nutrientTags: ["omega3"] }),
  ];

  const matches = findRecipeMatches(source, criteria);
  assert.deepEqual(matches.map(({ recipe }) => recipe.id), ["all"]);
  assert.equal(matches[0].score, 5);
  assert.equal(matches[0].reasons.length, 5);
});

test("fewer than three exact matches are not padded with non-matching recipes", () => {
  const source = [
    makeRecipe({ id: "exact", mealType: "snack", prepMinutes: 10 }),
    makeRecipe({ id: "wrong-meal", mealType: "lunch", prepMinutes: 10 }),
    makeRecipe({ id: "too-slow", mealType: "snack", prepMinutes: 20 }),
  ];
  const criteria = { ...emptyMatchCriteria, mealType: "snack", timeBudget: "15" };

  assert.deepEqual(findRecipeMatches(source, criteria).map(({ recipe }) => recipe.id), ["exact"]);
});

test("exact matches keep existing recipe order and stop at the requested limit", () => {
  const source = ["first", "second", "third", "fourth"].map((id) => makeRecipe({ id, mealType: "snack" }));
  const firstRun = findRecipeMatches(source, { ...emptyMatchCriteria, mealType: "snack" });
  const secondRun = findRecipeMatches(source, { ...emptyMatchCriteria, mealType: "snack" });

  assert.deepEqual(firstRun.map(({ recipe }) => recipe.id), ["first", "second", "third"]);
  assert.deepEqual(secondRun, firstRun);
});

test("scores and reasons include only selected conditions that actually match", () => {
  const [match] = findRecipeMatches(
    [makeRecipe({ id: "dinner-vegetables", mealType: "dinner", featuredIngredients: ["vegetables"] })],
    { ...emptyMatchCriteria, mealType: "dinner", ingredient: "vegetables" },
  );

  assert.equal(match.score, 2);
  assert.deepEqual(match.reasons, [
    { kind: "ingredient", value: "vegetables" },
    { kind: "mealType", value: "dinner" },
  ]);
});

test("no-preference fields do not filter otherwise matching recipes", () => {
  const source = [
    makeRecipe({ id: "breakfast", mealType: "breakfast", prepMinutes: 15, careContexts: ["lowEnergy"], featuredIngredients: ["fruit"] }),
    makeRecipe({ id: "dinner", mealType: "dinner", prepMinutes: 10, careContexts: ["familyMeal"], featuredIngredients: ["chicken"], nutrientTags: ["omega3"] }),
  ];
  const criteria = { ...emptyMatchCriteria, timeBudget: "15" };

  assert.deepEqual(findRecipeMatches(source, criteria).map(({ recipe }) => recipe.id), ["breakfast", "dinner"]);
});

test("zero exact matches produce an empty result instead of a nearby fallback", () => {
  const source = [makeRecipe({ id: "breakfast", mealType: "breakfast" })];
  assert.deepEqual(findRecipeMatches(source, { ...emptyMatchCriteria, mealType: "snack" }), []);
});

test("Match interface copy and time choices are exact in English and Japanese", () => {
  const english = getUiCopy("en").match;
  const japanese = getUiCopy("ja").match;

  assert.equal(english.title, "Find a meal for today");
  assert.equal(japanese.title, "今日の一皿を見つける");
  assert.equal(
    english.description,
    "Select one or more conditions to see up to three recipes that match all of your selections.",
  );
  assert.equal(
    japanese.description,
    "今日の条件をひとつ以上選ぶと、選択したすべての条件に一致するレシピを3件まで表示します。",
  );
  assert.deepEqual(english.timeLabels, { "15": "Up to 15 minutes", "30": "Up to 30 minutes", "45": "Up to 45 minutes" });
  assert.deepEqual(japanese.timeLabels, { "15": "15分以内", "30": "30分以内", "45": "45分以内" });
  assert.equal(english.noPreference, "No preference");
  assert.equal(japanese.noPreference, "指定なし");
  assert.equal(english.emptyTitle, "No recipes match all of these conditions.");
  assert.equal(english.emptyText, "Remove one condition and try again.");
  assert.equal(japanese.emptyTitle, "すべての条件に一致するレシピがありません。");
  assert.equal(japanese.emptyText, "条件を一つ解除して、もう一度お試しください。");
});
