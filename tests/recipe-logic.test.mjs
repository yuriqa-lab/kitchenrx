import assert from "node:assert/strict";
import test from "node:test";
import {
  evidenceIngredients,
  evidenceSources,
  getEvidenceSources,
  getIngredientsForNutrient,
  getNutrientIdsForIngredients,
  nutrients,
} from "../app/data/nutrition.ts";
import { recipes } from "../app/data/recipes.ts";
import { careContextLabels, getUiCopy, ingredientFilterLabels, mealTypeLabels } from "../app/i18n/translations.ts";
import { LANGUAGE_KEY, localizedValue, localizeRecipe, resolveInitialLanguage } from "../app/lib/localization.ts";
import { filterRecipes, formatMealList, parseSavedRecipeIds, SAVED_RECIPES_KEY } from "../app/lib/recipeLogic.ts";
import {
  careContexts,
  evidenceIngredientIds,
  ingredientFilters,
  mealTypes,
  nutrientIds,
} from "../app/types/recipe.ts";

const samples = [
  {
    id: "rice",
    mealType: "lunch",
    prepMinutes: 12,
    careContexts: ["quickPreparation"],
    featuredIngredients: ["rice", "eggs"],
    evidenceIngredients: [],
    nutrientTags: [],
    accent: "sage",
    translations: {
      en: { title: "Rice Bowl", description: "", ingredients: [], steps: [], whyItMayHelp: "" },
      ja: { title: "ごはんボウル", description: "", ingredients: [], steps: [], whyItMayHelp: "" },
    },
  },
  {
    id: "soup",
    mealType: "dinner",
    prepMinutes: 18,
    careContexts: ["gentleMeal", "comfortFood"],
    featuredIngredients: ["tofu", "soup"],
    evidenceIngredients: [],
    nutrientTags: [],
    accent: "pink",
    translations: {
      en: { title: "Tofu Soup", description: "", ingredients: [], steps: [], whyItMayHelp: "" },
      ja: { title: "豆腐スープ", description: "", ingredients: [], steps: [], whyItMayHelp: "" },
    },
  },
];

const noFilters = { mealTypes: [], careContexts: [], ingredients: [] };

test("filtering combines groups and matches selected values broadly within a group", () => {
  const filters = {
    mealTypes: ["lunch"],
    careContexts: ["quickPreparation", "gentleMeal"],
    ingredients: ["eggs", "tofu"],
  };
  assert.deepEqual(filterRecipes(samples, filters, false, new Set()).map(({ id }) => id), ["rice"]);
});

test("filtering results do not change with localized presentation data", () => {
  const translatedSamples = samples.map((recipe) => ({
    ...recipe,
    translations: { ...recipe.translations, ja: { ...recipe.translations.ja, title: `別名 ${recipe.id}` } },
  }));
  const filters = { mealTypes: [], careContexts: ["gentleMeal"], ingredients: ["tofu"] };
  assert.deepEqual(filterRecipes(samples, filters, false, new Set()).map(({ id }) => id), ["soup"]);
  assert.deepEqual(filterRecipes(translatedSamples, filters, false, new Set()).map(({ id }) => id), ["soup"]);
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

test("language selection prefers valid storage, then Japanese browser language, then English", () => {
  assert.equal(resolveInitialLanguage("ja", ["en-US"]), "ja");
  assert.equal(resolveInitialLanguage("en", ["ja-JP"]), "en");
  assert.equal(resolveInitialLanguage(null, ["fr-FR", "ja-JP"]), "ja");
  assert.equal(resolveInitialLanguage(null, ["fr-FR"]), "en");
  assert.equal(resolveInitialLanguage("unsupported", ["de-DE"]), "en");
});

test("missing Japanese content safely falls back to English", () => {
  assert.deepEqual(localizedValue({ en: { title: "Fallback" } }, "ja"), { title: "Fallback" });
});

test("meal list formatting uses localized headings and recipe titles", () => {
  assert.equal(formatMealList(samples, "en"), "KitchenRx Meal List\n\n- Rice Bowl\n- Tofu Soup");
  assert.equal(formatMealList(samples, "ja"), "KitchenRx 献立リスト\n\n- ごはんボウル\n- 豆腐スープ");
});

test("language and saved recipes use separate stable storage keys", () => {
  assert.equal(LANGUAGE_KEY, "kitchenrx:language:v1");
  assert.equal(SAVED_RECIPES_KEY, "kitchenrx:saved-recipes:v1");
  assert.notEqual(LANGUAGE_KEY, SAVED_RECIPES_KEY);
});

test("all 27 stable recipe records contain complete English and Japanese content", () => {
  assert.equal(recipes.length, 27);
  assert.equal(new Set(recipes.map(({ id }) => id)).size, 27);

  for (const recipe of recipes) {
    for (const language of ["en", "ja"]) {
      const content = recipe.translations[language];
      assert.ok(content.title.length > 0, `${recipe.id} is missing a ${language} title`);
      assert.ok(content.description.length > 0, `${recipe.id} is missing a ${language} description`);
      assert.ok(content.ingredients.length > 0, `${recipe.id} is missing ${language} ingredients`);
      assert.ok(content.steps.length > 0, `${recipe.id} is missing ${language} steps`);
      assert.ok(content.whyItMayHelp.length > 0, `${recipe.id} is missing a ${language} care note`);
    }
  }
});

test("Japanese display titles expose only intentional line-break opportunities", () => {
  for (const recipe of recipes) {
    const content = recipe.translations.ja;
    assert.ok(content.titleSegments?.length, `${recipe.id} is missing Japanese title segments`);
    assert.equal(
      content.titleSegments.join("").replaceAll(" ", ""),
      content.title.replaceAll(" ", ""),
      `${recipe.id} Japanese title segments do not reconstruct its title`,
    );
  }

  assert.deepEqual(recipes[23].translations.ja.titleSegments, ["いちごと豆腐の", "ヨーグルトカップ"]);
  assert.deepEqual(recipes.at(-1).translations.ja.titleSegments, ["ブルーベリーと", "アーモンドの", "オートミールボウル"]);

  const hero = getUiCopy("ja").hero;
  assert.deepEqual(hero.titleSegments, ["今日の自分に", "無理のない、", "食の支えを。"]);
  assert.equal(hero.titleSegments.join(""), hero.title);
});

test("Japanese interface copy protects short meaning units without changing English copy", () => {
  const japanese = getUiCopy("ja");
  const english = getUiCopy("en");

  assert.equal(japanese.hero.boardNoteOne, "今ある食材を活かす。");
  assert.deepEqual(japanese.hero.boardNoteOneSegments, ["今ある食材を", "活かす。"]);
  assert.equal(japanese.hero.boardNoteOneSegments.join(""), japanese.hero.boardNoteOne);
  assert.equal(japanese.hero.boardNoteTwo, "あとで迷う時間を減らす。");
  assert.deepEqual(japanese.hero.boardNoteTwoSegments, ["あとで迷う", "時間を減らす。"]);
  assert.equal(japanese.hero.boardNoteTwoSegments.join(""), japanese.hero.boardNoteTwo);
  assert.equal(japanese.hero.credentialTitle, "食の専門性を土台に。");
  assert.deepEqual(japanese.hero.credentialTitleSegments, ["食の専門性を", "土台に。"]);
  assert.equal(japanese.hero.credentialTitleSegments.join(""), japanese.hero.credentialTitle);
  assert.equal(japanese.hero.credentialText, "調理師・製菓衛生師の資格を持つ開発者が、レシピ設計と調理工程を確認しています。");
  assert.equal(japanese.hero.credentialTextSegments.join(""), japanese.hero.credentialText);
  assert.equal(japanese.mealPlan.title, "小さな計画でも、十分。");
  assert.deepEqual(japanese.mealPlan.titleSegments, ["小さな計画でも、", "十分。"]);
  assert.equal(japanese.mealPlan.titleSegments.join(""), japanese.mealPlan.title);
  assert.deepEqual(japanese.nutrition.titleSegments, ["料理の背景にある", "食材を知る。"]);
  assert.equal(japanese.nutrition.titleSegments.join(""), japanese.nutrition.title);
  assert.deepEqual(japanese.explorer.titleSegments, ["今できそうな", "ことから。"]);
  assert.equal(japanese.explorer.titleSegments.join(""), japanese.explorer.title);
  assert.deepEqual(japanese.careNotes.titleSegments, ["ケアは、", "調理の前から", "始まる。"]);
  assert.equal(japanese.careNotes.titleSegments.join(""), japanese.careNotes.title);
  assert.deepEqual(japanese.careNotes.notes[3].titleSegments, ["ホスピタリティの", "余白を残す"]);
  assert.equal(japanese.careNotes.notes[3].titleSegments.join(""), japanese.careNotes.notes[3].title);

  assert.equal(english.hero.boardNoteOne, "Use what is already open.");
  assert.equal(english.hero.boardNoteTwo, "Leave fewer decisions for later.");
  assert.equal(english.hero.credentialTitle, "Grounded in culinary expertise.");
  assert.equal(english.hero.credentialText, "Recipes and cooking steps are reviewed by the developer, a licensed cook and confectionery hygienist in Japan.");
  assert.equal(english.mealPlan.title, "A small plan can be enough.");
  assert.equal(english.explorer.title, "Start with what feels possible.");
  assert.equal(english.careNotes.title, "Care often begins before cooking.");
});

test("the original 24 IDs remain unchanged and the three Phase 2 IDs are appended in order", () => {
  assert.deepEqual(recipes.map(({ id }) => id), [
    "soft-egg-rice",
    "strawberry-oat-cup",
    "tofu-rice-soup",
    "lemon-chicken-tray",
    "tomato-tofu-pasta",
    "egg-vegetable-rice-bowl",
    "chicken-noodle-soup",
    "pear-yogurt-bowl",
    "tofu-egg-bites",
    "one-pan-vegetable-pasta",
    "ginger-tofu-rice",
    "tomato-egg-drop-soup",
    "banana-kinako-toast",
    "pumpkin-egg-rice-porridge",
    "vegetable-frittata-tray",
    "sesame-tofu-noodle-salad",
    "miso-tofu-soboro-rice",
    "chicken-vegetable-rice-balls",
    "chicken-vegetable-pasta-soup",
    "creamy-pumpkin-pasta-soup",
    "sheet-pan-sesame-tofu",
    "apple-cinnamon-compote",
    "savory-rice-egg-bites",
    "strawberry-tofu-yogurt-cup",
    "miso-salmon-rice-bowl",
    "spinach-almond-lemon-pasta",
    "blueberry-almond-oat-bowl",
  ]);
});

test("expanded recipe records have consistent structure and use every supported filter", () => {
  const seenMeals = new Set();
  const seenContexts = new Set();
  const seenIngredients = new Set();
  const englishTitles = new Set();
  const japaneseTitles = new Set();

  for (const recipe of recipes) {
    assert.ok(recipe.prepMinutes >= 5 && recipe.prepMinutes <= 60, `${recipe.id} has an implausible preparation time`);
    assert.ok(mealTypes.includes(recipe.mealType), `${recipe.id} has an unsupported meal type`);
    assert.ok(recipe.careContexts.length > 0, `${recipe.id} needs at least one care context`);
    assert.ok(recipe.featuredIngredients.length > 0, `${recipe.id} needs at least one ingredient filter`);
    assert.equal(recipe.translations.en.ingredients.length, recipe.translations.ja.ingredients.length, `${recipe.id} ingredient counts differ by language`);
    assert.equal(recipe.translations.en.steps.length, recipe.translations.ja.steps.length, `${recipe.id} step counts differ by language`);
    assert.ok(!englishTitles.has(recipe.translations.en.title), `${recipe.id} repeats an English title`);
    assert.ok(!japaneseTitles.has(recipe.translations.ja.title), `${recipe.id} repeats a Japanese title`);
    englishTitles.add(recipe.translations.en.title);
    japaneseTitles.add(recipe.translations.ja.title);
    seenMeals.add(recipe.mealType);
    recipe.careContexts.forEach((value) => {
      assert.ok(careContexts.includes(value), `${recipe.id} has an unsupported care context`);
      seenContexts.add(value);
    });
    recipe.featuredIngredients.forEach((value) => {
      assert.ok(ingredientFilters.includes(value), `${recipe.id} has an unsupported ingredient filter`);
      seenIngredients.add(value);
    });
  }

  assert.deepEqual([...seenMeals].sort(), [...mealTypes].sort());
  assert.deepEqual([...seenContexts].sort(), [...careContexts].sort());
  assert.deepEqual([...seenIngredients].sort(), [...ingredientFilters].sort());
});

test("27-recipe filter coverage includes the Phase 2 additions", () => {
  const counts = (values, getValues) => Object.fromEntries(values.map((value) => [value, recipes.filter((recipe) => getValues(recipe).includes(value)).length]));
  assert.deepEqual(counts(mealTypes, (recipe) => [recipe.mealType]), { breakfast: 6, lunch: 8, dinner: 8, snack: 5 });
  assert.deepEqual(counts(careContexts, (recipe) => recipe.careContexts), {
    lowEnergy: 7,
    gentleMeal: 12,
    familyMeal: 13,
    highProtein: 13,
    comfortFood: 7,
    quickPreparation: 14,
  });
  assert.deepEqual(counts(ingredientFilters, (recipe) => recipe.featuredIngredients), {
    rice: 10,
    eggs: 7,
    tofu: 8,
    chicken: 4,
    vegetables: 20,
    pasta: 7,
    soup: 6,
    fruit: 6,
  });
});

test("every one of the 27 recipes remains reachable through its combined filters", () => {
  for (const recipe of recipes) {
    const filters = {
      mealTypes: [recipe.mealType],
      careContexts: [recipe.careContexts[0]],
      ingredients: [recipe.featuredIngredients[0]],
    };
    const ids = filterRecipes(recipes, filters, false, new Set()).map(({ id }) => id);
    assert.ok(ids.includes(recipe.id), `${recipe.id} cannot be reached through its declared filters`);
  }
});

test("every listed ingredient in recipes 13–27 is used in the preparation steps in both languages", () => {
  const ingredientKeywords = {
    "banana-kinako-toast": { en: ["bread", "banana", "yogurt", "kinako", "honey"], ja: ["食パン", "バナナ", "ヨーグルト", "きなこ", "はちみつ"] },
    "pumpkin-egg-rice-porridge": { en: ["rice", "pumpkin", "broth", "egg", "soy sauce"], ja: ["ごはん", "かぼちゃ", "スープ", "卵", "しょうゆ"] },
    "vegetable-frittata-tray": { en: ["egg", "vegetable", "milk", "olive oil", "cheese", "black pepper"], ja: ["卵", "野菜", "牛乳", "オリーブ油", "チーズ", "黒こしょう"] },
    "sesame-tofu-noodle-salad": { en: ["pasta", "tofu", "cucumber", "carrot", "sesame paste", "soy sauce", "rice vinegar", "water"], ja: ["パスタ", "豆腐", "きゅうり", "にんじん", "練りごま", "しょうゆ", "米酢", "水"] },
    "miso-tofu-soboro-rice": { en: ["tofu", "rice", "carrot", "mushroom", "miso", "soy sauce", "water", "sesame oil"], ja: ["豆腐", "ごはん", "にんじん", "きのこ", "味噌", "しょうゆ", "水", "ごま油"] },
    "chicken-vegetable-rice-balls": { en: ["rice", "chicken", "carrot", "peas", "soy sauce", "sugar", "oil"], ja: ["ごはん", "鶏", "にんじん", "グリーンピース", "しょうゆ", "砂糖", "油"] },
    "chicken-vegetable-pasta-soup": { en: ["chicken", "broth", "pasta", "carrot", "celery", "peas", "thyme"], ja: ["鶏", "スープ", "パスタ", "にんじん", "セロリ", "グリーンピース", "タイム"] },
    "creamy-pumpkin-pasta-soup": { en: ["pumpkin", "pasta", "vegetable broth", "milk", "spinach", "thyme", "cheese"], ja: ["かぼちゃ", "パスタ", "野菜だし", "牛乳", "ほうれん草", "タイム", "チーズ"] },
    "sheet-pan-sesame-tofu": { en: ["tofu", "broccoli", "bell pepper", "cornstarch", "sesame oil", "soy sauce", "sesame seeds"], ja: ["豆腐", "ブロッコリー", "パプリカ", "片栗粉", "ごま油", "しょうゆ", "いりごま"] },
    "apple-cinnamon-compote": { en: ["apple", "water", "lemon juice", "cinnamon", "maple syrup"], ja: ["りんご", "水", "レモン汁", "シナモン", "メープルシロップ"] },
    "savory-rice-egg-bites": { en: ["rice", "egg", "vegetable", "cheese", "soy sauce", "oil"], ja: ["ごはん", "卵", "野菜", "チーズ", "しょうゆ", "油"] },
    "strawberry-tofu-yogurt-cup": { en: ["tofu", "yogurt", "strawberr", "honey", "lemon", "oats"], ja: ["豆腐", "ヨーグルト", "いちご", "はちみつ", "レモン", "オーツ"] },
    "miso-salmon-rice-bowl": { en: ["salmon", "rice", "broccoli", "carrot", "miso", "water", "soy sauce", "sesame oil"], ja: ["鮭", "ごはん", "ブロッコリー", "にんじん", "味噌", "水", "しょうゆ", "ごま油"] },
    "spinach-almond-lemon-pasta": { en: ["pasta", "almond", "olive oil", "garlic", "spinach", "lemon", "pasta water", "salt", "black pepper"], ja: ["パスタ", "アーモンド", "オリーブ油", "にんにく", "ほうれん草", "レモン", "ゆで汁", "塩", "黒こしょう"] },
    "blueberry-almond-oat-bowl": { en: ["oats", "milk", "blueberr", "almond", "cinnamon", "maple syrup"], ja: ["オートミール", "牛乳", "ブルーベリー", "アーモンド", "シナモン", "メープルシロップ"] },
  };

  for (const [id, languages] of Object.entries(ingredientKeywords)) {
    const recipe = recipes.find((candidate) => candidate.id === id);
    assert.ok(recipe, `${id} is missing`);
    for (const language of ["en", "ja"]) {
      const ingredientText = recipe.translations[language].ingredients.join(" ").toLowerCase();
      const stepText = recipe.translations[language].steps.join(" ").toLowerCase();
      for (const keyword of languages[language]) {
        assert.ok(ingredientText.includes(keyword.toLowerCase()), `${id} ${language} ingredient list is missing ${keyword}`);
        assert.ok(stepText.includes(keyword.toLowerCase()), `${id} ${language} steps do not use ${keyword}`);
      }
    }
  }
});

test("filter labels and recipe presentation translate without changing stable IDs", () => {
  assert.equal(mealTypeLabels.ja.breakfast, "朝食");
  assert.equal(careContextLabels.ja.quickPreparation, "手早く準備");
  assert.equal(ingredientFilterLabels.ja.vegetables, "野菜");
  assert.equal(mealTypeLabels.en.breakfast, "Breakfast");

  const source = recipes[0];
  const english = localizeRecipe(source, "en");
  const japanese = localizeRecipe(source, "ja");
  assert.equal(english.id, japanese.id);
  assert.notEqual(english.title, japanese.title);
  assert.equal(source.id, "soft-egg-rice");
});

test("nutrient and ingredient records are complete, bilingual, and source-backed", () => {
  assert.deepEqual(nutrients.map(({ id }) => id), [...nutrientIds]);
  assert.deepEqual(evidenceIngredients.map(({ id }) => id), [...evidenceIngredientIds]);
  assert.equal(new Set(evidenceSources.map(({ id }) => id)).size, evidenceSources.length);

  const validSourceIds = new Set(evidenceSources.map(({ id }) => id));
  for (const source of evidenceSources) {
    const url = new URL(source.url);
    assert.equal(url.protocol, "https:", `${source.id} must use HTTPS`);
    assert.ok(source.name.length > 0 && source.publisher.length > 0, `${source.id} needs a name and publisher`);
  }

  for (const nutrient of nutrients) {
    assert.ok(nutrient.translations.en.name.length > 0 && nutrient.translations.ja.name.length > 0);
    assert.ok(nutrient.translations.en.shortDescription.length > 0);
    assert.ok(nutrient.translations.ja.shortDescription.length > 0);
    assert.ok(nutrient.sourceIds.length > 0, `${nutrient.id} needs a source`);
    nutrient.sourceIds.forEach((sourceId) => assert.ok(validSourceIds.has(sourceId), `${nutrient.id} has an unknown source`));
  }

  for (const ingredient of evidenceIngredients) {
    assert.ok(ingredient.translations.en.name.length > 0 && ingredient.translations.ja.name.length > 0);
    assert.ok(ingredient.translations.en.whyIncluded.length > 0);
    assert.ok(ingredient.translations.ja.whyIncluded.length > 0);
    if (ingredient.id === "blueberries") {
      assert.deepEqual(ingredient.nutrientIds, [], "blueberries must remain an everyday-fruit example, not a direct source tag");
    } else {
      assert.ok(ingredient.nutrientIds.length > 0, `${ingredient.id} needs a nutrient mapping`);
    }
    ingredient.nutrientIds.forEach((nutrientId) => assert.ok(nutrientIds.includes(nutrientId)));
    ingredient.sourceIds.forEach((sourceId) => assert.ok(validSourceIds.has(sourceId), `${ingredient.id} has an unknown source`));
  }
});

test("nutrient selection filters ingredient evidence and recipes without changing established filters", () => {
  assert.deepEqual(getIngredientsForNutrient("lutein").map(({ id }) => id), ["spinach"]);
  assert.deepEqual(getIngredientsForNutrient("zeaxanthin").map(({ id }) => id), ["spinach"]);
  assert.deepEqual(getIngredientsForNutrient("vitaminE").map(({ id }) => id), ["spinach", "almonds"]);
  assert.deepEqual(getIngredientsForNutrient("omega3").map(({ id }) => id), ["salmon"]);
  assert.deepEqual(getNutrientIdsForIngredients(["spinach"]), ["lutein", "zeaxanthin", "vitaminE"]);
  assert.deepEqual(getNutrientIdsForIngredients(["salmon"]), ["omega3"]);
  assert.deepEqual(getNutrientIdsForIngredients(["blueberries"]), []);
  assert.equal(filterRecipes(recipes, noFilters, false, new Set()).length, 27);
  assert.deepEqual(filterRecipes(recipes, noFilters, false, new Set(), "omega3").map(({ id }) => id), ["miso-salmon-rice-bowl"]);
  assert.deepEqual(filterRecipes(recipes, noFilters, false, new Set(), "vitaminE").map(({ id }) => id), [
    "tomato-egg-drop-soup",
    "creamy-pumpkin-pasta-soup",
    "spinach-almond-lemon-pasta",
    "blueberry-almond-oat-bowl",
  ]);
});

test("recipe evidence tags match exact evidence ingredients while stable IDs remain unchanged", () => {
  const taggedRecipes = recipes.filter(({ nutrientTags }) => nutrientTags.length > 0);
  assert.deepEqual(taggedRecipes.map(({ id }) => id), [
    "tomato-egg-drop-soup",
    "creamy-pumpkin-pasta-soup",
    "miso-salmon-rice-bowl",
    "spinach-almond-lemon-pasta",
    "blueberry-almond-oat-bowl",
  ]);

  for (const recipe of recipes) {
    assert.ok(Array.isArray(recipe.evidenceIngredients));
    assert.ok(Array.isArray(recipe.nutrientTags));
    const expectedNutrients = getNutrientIdsForIngredients(recipe.evidenceIngredients);
    assert.deepEqual(recipe.nutrientTags, expectedNutrients, `${recipe.id} evidence tags are inconsistent`);
  }
});

test("Phase 2 recipes use the approved evidence relationships and practical methods", () => {
  const phaseTwo = recipes.slice(24);
  assert.deepEqual(phaseTwo.map(({ id }) => id), [
    "miso-salmon-rice-bowl",
    "spinach-almond-lemon-pasta",
    "blueberry-almond-oat-bowl",
  ]);
  assert.deepEqual(phaseTwo.map(({ evidenceIngredients }) => evidenceIngredients), [
    ["salmon"],
    ["spinach", "almonds"],
    ["blueberries", "almonds"],
  ]);
  assert.deepEqual(phaseTwo.map(({ nutrientTags }) => nutrientTags), [
    ["omega3"],
    ["lutein", "zeaxanthin", "vitaminE"],
    ["vitaminE"],
  ]);
  assert.deepEqual(phaseTwo.map(({ prepMinutes }) => prepMinutes), [28, 20, 10]);

  const combinedCopy = JSON.stringify(phaseTwo);
  assert.match(combinedCopy, /200°C \/ 400°F/);
  assert.match(combinedCopy, /12–15 minutes/);
  assert.match(combinedCopy, /2–3 minutes/);
  assert.match(combinedCopy, /about 5 minutes/);
  assert.doesNotMatch(combinedCopy, /\b(?:cures?|prevents?|treats?|restores? vision)\b/i);
  assert.doesNotMatch(combinedCopy, /治療|予防|視力回復|サプリメント/);
});

test("source lookup ignores unknown IDs and claim wording stays within food-information boundaries", () => {
  assert.deepEqual(getEvidenceSources(["missing-source"]), []);
  assert.equal(getEvidenceSources(["nih-vitamin-e"])[0].publisher, "NIH Office of Dietary Supplements");

  const evidenceCopy = JSON.stringify({ nutrients, evidenceIngredients, nutritionUi: [getUiCopy("en").nutrition, getUiCopy("ja").nutrition] });
  assert.doesNotMatch(evidenceCopy, /\b(?:cures?|prevents?|guarantees?|clinically proven|restores? vision)\b/i);
  assert.doesNotMatch(evidenceCopy, /治ります|治すことができます|予防します|視力が回復します/);
  assert.match(getUiCopy("en").nutrition.disclaimer, /not medical advice/i);
  assert.match(getUiCopy("ja").nutrition.disclaimer, /医療助言ではありません/);
});
