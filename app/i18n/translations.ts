import type { CareContext, IngredientFilter, Language, MealType } from "../types/recipe";

interface UiCopy {
  skipLink: string;
  homeLabel: string;
  primaryNavigationLabel: string;
  languageSwitcherLabel: string;
  nav: { recipes: string; careNotes: string; about: string };
  saved: string;
  hero: {
    eyebrow: string;
    title: string;
    titleSegments?: string[];
    lede: string;
    explore: string;
    careApproach: string;
    noticesLabel: string;
    disclaimerTitle: string;
    disclaimerText: string;
    privacyTitle: string;
    privacyText: string;
    boardLabel: string;
    boardHeading: string;
    boardDate: string;
    boardKicker: string;
    boardRecipe: string;
    boardRecipeSegments?: string[];
    boardTime: string;
    boardOnePot: string;
    boardFlexible: string;
    boardNoteOne: string;
    boardNoteTwo: string;
  };
  principlesLabel: string;
  principles: string[];
  nutrition: {
    eyebrow: string;
    title: string;
    description: string;
    chipLabel: string;
    ingredientHeading: string;
    whyIngredient: string;
    sources: string;
    openSource: (publisher: string) => string;
    foodInfoTitle: string;
    disclaimer: string;
    recipeTagsLabel: string;
  };
  explorer: {
    eyebrow: string;
    title: string;
    description: string;
    filterPanelLabel: string;
    filterHeading: string;
    clearAll: string;
    mealType: string;
    careContext: string;
    ingredient: string;
    savedOnly: string;
    nothingSaved: string;
    savedOnList: (count: number) => string;
    resultCount: (count: number) => string;
    activeFilters: (count: number) => string;
    emptySavedTitle: string;
    emptyResultsTitle: string;
    emptySavedText: string;
    emptyResultsText: string;
    showAll: string;
  };
  mealPlan: {
    eyebrow: string;
    title: string;
    description: string;
    savedCount: (count: number) => string;
    copy: string;
    emptyHint: string;
    readyHint: string;
  };
  careNotes: {
    eyebrow: string;
    title: string;
    description: string;
    notes: Array<{ title: string; text: string }>;
  };
  about: { eyebrow: string; title: string; text: string; prototypeLabel: string; localFirstLabel: string };
  footer: { description: string; disclaimer: string; meta: string };
  recipe: {
    minutes: (minutes: number) => string;
    contextsLabel: string;
    view: string;
    saveLabel: (title: string) => string;
    removeLabel: (title: string) => string;
    close: string;
    ingredients: string;
    preparation: string;
    why: string;
    safety: string;
    saveForLater: string;
    removeFromSaved: string;
  };
  toast: {
    savedDataReset: string;
    storageFailed: string;
    recipeSaved: (title: string) => string;
    recipeRemoved: (title: string) => string;
    copySuccess: string;
    copyFailed: string;
    languageStorageFailed: string;
  };
  mealListTitle: string;
}

const en: UiCopy = {
  skipLink: "Skip to recipe explorer",
  homeLabel: "KitchenRx home",
  primaryNavigationLabel: "Primary navigation",
  languageSwitcherLabel: "Language selection",
  nav: { recipes: "Recipes", careNotes: "Care notes", about: "About" },
  saved: "Saved",
  hero: {
    eyebrow: "A Yuriqa Lab prototype",
    title: "Food support for the day you actually have.",
    lede: "KitchenRx helps you explore realistic meals by energy, ingredients, and everyday routines—without turning care into a clinical task.",
    explore: "Explore the recipes",
    careApproach: "Read the care approach",
    noticesLabel: "Important information",
    disclaimerTitle: "Food support, not medical advice.",
    disclaimerText: "For medical or diet-specific needs, consult a qualified professional.",
    privacyTitle: "Private by design.",
    privacyText: "This prototype runs locally in the browser. It does not collect or send personal data.",
    boardLabel: "A sample of KitchenRx meal contexts",
    boardHeading: "Today's care shelf",
    boardDate: "04 · SMALL STEPS",
    boardKicker: "LOW-ENERGY LUNCH",
    boardRecipe: "Tofu, greens & rice soup",
    boardTime: "18 min",
    boardOnePot: "one pot",
    boardFlexible: "flexible",
    boardNoteOne: "Use what is already open.",
    boardNoteTwo: "Leave fewer decisions for later.",
  },
  principlesLabel: "KitchenRx principles",
  principles: ["LOCAL SAMPLE RECIPES", "NO ACCOUNT", "NO TRACKING", "CAREFUL LANGUAGE"],
  nutrition: {
    eyebrow: "Food & nutrient guide",
    title: "Explore the ingredients behind the meal.",
    description: "Choose a nutrient to see a short food-based explanation, connected ingredients, and the public sources used for this prototype.",
    chipLabel: "Choose a nutrient to explore",
    ingredientHeading: "Ingredient connections",
    whyIngredient: "Why this ingredient is included",
    sources: "Sources",
    openSource: (publisher) => `Read source from ${publisher}`,
    foodInfoTitle: "Food information only",
    disclaimer: "This guide supports food discovery. It is not medical advice, does not promise changes to vision or health, and does not provide supplement instructions.",
    recipeTagsLabel: "Related food nutrients",
  },
  explorer: {
    eyebrow: "Recipe explorer",
    title: "Start with what feels possible.",
    description: "Choose one or more practical contexts. Options within a group are matched broadly; groups work together to narrow the shelf.",
    filterPanelLabel: "Recipe filters",
    filterHeading: "Filter the shelf",
    clearAll: "Clear all",
    mealType: "Meal type",
    careContext: "Care context",
    ingredient: "Available ingredient",
    savedOnly: "Saved recipes only",
    nothingSaved: "Nothing saved yet",
    savedOnList: (count) => `${count} on your list`,
    resultCount: (count) => `${count} ${count === 1 ? "recipe" : "recipes"} on the shelf`,
    activeFilters: (count) => `${count} active ${count === 1 ? "filter" : "filters"}`,
    emptySavedTitle: "Your saved shelf is ready when you are.",
    emptyResultsTitle: "No recipes match this combination.",
    emptySavedText: "Save a recipe from the full shelf and it will stay on this device.",
    emptyResultsText: "Try removing one filter, or return to the full recipe shelf.",
    showAll: "Show all recipes",
  },
  mealPlan: {
    eyebrow: "Your meal list",
    title: "A small plan can be enough.",
    description: "Save a few realistic options, then copy their titles as a simple list. Nothing leaves this browser.",
    savedCount: (count) => `saved ${count === 1 ? "recipe" : "recipes"}`,
    copy: "Copy meal list",
    emptyHint: "Save at least one recipe to copy a list.",
    readyHint: "Copies recipe titles as plain text.",
  },
  careNotes: {
    eyebrow: "Care notes",
    title: "Care often begins before cooking.",
    description: "Food support is also the work of making choices smaller, routines steadier, and shared meals easier to coordinate.",
    notes: [
      { title: "Reduce the decision load", text: "Start with the energy and ingredients available today, not an ideal plan that asks for more." },
      { title: "Protect familiar routines", text: "Repeatable meals and flexible methods can help everyday food preparation feel more manageable." },
      { title: "Plan for the whole task", text: "Preparation, portioning, serving, and cleanup all shape whether a meal is genuinely practical." },
      { title: "Keep room for hospitality", text: "A useful digital tool can support a shared table without taking over the human choices around it." },
    ],
  },
  about: {
    eyebrow: "Yuriqa Lab",
    title: "A practical research prototype.",
    text: "Yuriqa Lab explores the intersections of AI, care systems, hospitality, food systems, and human-centered interfaces. KitchenRx asks how thoughtful digital tools can translate hospitality knowledge into calmer everyday decisions.",
    prototypeLabel: "PROTOTYPE · V1.1",
    localFirstLabel: "LOCAL-FIRST · 2026",
  },
  footer: {
    description: "A care-oriented recipe and meal-support prototype by Yuriqa Lab.",
    disclaimer: "KitchenRx is a food-support prototype, not medical advice. For medical or diet-specific needs, consult a qualified professional.",
    meta: "No backend · No login · No data collection",
  },
  recipe: {
    minutes: (minutes) => `${minutes} min`,
    contextsLabel: "Recipe contexts",
    view: "View recipe",
    saveLabel: (title) => `Save ${title}`,
    removeLabel: (title) => `Remove ${title}`,
    close: "Close recipe details",
    ingredients: "Ingredients",
    preparation: "Preparation",
    why: "Why this may help",
    safety: "Practical food-support context only — not medical advice.",
    saveForLater: "Save for later",
    removeFromSaved: "Remove from saved",
  },
  toast: {
    savedDataReset: "Saved recipes were reset because the stored list could not be read.",
    storageFailed: "This browser could not store the change. It will not persist after a reload.",
    recipeSaved: (title) => `${title} saved for later.`,
    recipeRemoved: (title) => `${title} removed from your saved list.`,
    copySuccess: "Meal list copied to your clipboard.",
    copyFailed: "The meal list could not be copied. Please check your browser permissions.",
    languageStorageFailed: "The language changed, but this browser could not remember the preference.",
  },
  mealListTitle: "KitchenRx Meal List",
};

const ja: UiCopy = {
  skipLink: "レシピ検索へ移動",
  homeLabel: "KitchenRx ホーム",
  primaryNavigationLabel: "メインナビゲーション",
  languageSwitcherLabel: "言語選択",
  nav: { recipes: "レシピ", careNotes: "ケアの考え方", about: "Yuriqa Lab" },
  saved: "保存済み",
  hero: {
    eyebrow: "Yuriqa Lab プロトタイプ",
    title: "今日の自分に無理のない、食の支えを。",
    titleSegments: ["今日の自分に", "無理のない、", "食の支えを。"],
    lede: "KitchenRxは、今日の元気、手元の食材、いつもの暮らしに合わせて、現実的な食事を探すためのツールです。ケアを難しい作業に変えず、できることから選べます。",
    explore: "レシピを探す",
    careApproach: "ケアの考え方を読む",
    noticesLabel: "大切なお知らせ",
    disclaimerTitle: "食の支援であり、医療助言ではありません。",
    disclaimerText: "医療上または個別の食事制限に関する相談は、資格を持つ専門家へご相談ください。",
    privacyTitle: "プライバシーを前提に。",
    privacyText: "このプロトタイプはブラウザ内で動作し、個人データを収集・送信しません。",
    boardLabel: "KitchenRxの食事場面の例",
    boardHeading: "本日のケア棚",
    boardDate: "04 · 小さな一歩",
    boardKicker: "元気がない日の昼食",
    boardRecipe: "豆腐と青菜のごはんスープ",
    boardRecipeSegments: ["豆腐と青菜の", "ごはんスープ"],
    boardTime: "18分",
    boardOnePot: "鍋ひとつ",
    boardFlexible: "アレンジ自在",
    boardNoteOne: "今ある食材から使う。",
    boardNoteTwo: "あとの判断を少し減らす。",
  },
  principlesLabel: "KitchenRxの基本方針",
  principles: ["ローカルのサンプルレシピ", "アカウント不要", "追跡なし", "慎重な表現"],
  nutrition: {
    eyebrow: "食材と栄養素ガイド",
    title: "料理の背景にある食材を知る。",
    description: "栄養素を選ぶと、食品を中心にした短い説明、関連する食材、このプロトタイプで参照した公開資料を確認できます。",
    chipLabel: "知りたい栄養素を選択",
    ingredientHeading: "関連する食材",
    whyIngredient: "なぜこの食材を掲載するのか",
    sources: "出典",
    openSource: (publisher) => `${publisher}の出典を開く`,
    foodInfoTitle: "食生活上の情報です",
    disclaimer: "このガイドは食材を知るためのもので、医療助言ではありません。視力や健康状態の変化を約束せず、サプリメントの服用方法も案内しません。",
    recipeTagsLabel: "関連する食品由来の栄養素",
  },
  explorer: {
    eyebrow: "レシピ検索",
    title: "今できそうなことから。",
    description: "暮らしに合う条件をひとつ以上選べます。同じ項目内では広めに探し、複数の項目を組み合わせると候補を絞れます。",
    filterPanelLabel: "レシピの絞り込み",
    filterHeading: "条件で絞り込む",
    clearAll: "すべて解除",
    mealType: "食事の種類",
    careContext: "ケアの場面",
    ingredient: "手元の食材",
    savedOnly: "保存したレシピのみ",
    nothingSaved: "まだ保存されていません",
    savedOnList: (count) => `${count}件を保存中`,
    resultCount: (count) => `${count}件のレシピ`,
    activeFilters: (count) => `${count}個の条件を選択中`,
    emptySavedTitle: "保存したレシピは、ここに並びます。",
    emptyResultsTitle: "この条件に合うレシピはありません。",
    emptySavedText: "レシピを保存すると、この端末のブラウザに一覧が残ります。",
    emptyResultsText: "条件をひとつ外すか、すべてのレシピに戻ってみてください。",
    showAll: "すべてのレシピを見る",
  },
  mealPlan: {
    eyebrow: "献立リスト",
    title: "小さな計画だけでも、十分。",
    description: "無理のない候補をいくつか保存し、レシピ名だけのシンプルな一覧としてコピーできます。情報がブラウザの外へ送られることはありません。",
    savedCount: () => "件のレシピを保存",
    copy: "献立リストをコピー",
    emptyHint: "レシピを1件以上保存するとコピーできます。",
    readyHint: "レシピ名をプレーンテキストでコピーします。",
  },
  careNotes: {
    eyebrow: "ケアの考え方",
    title: "ケアは、調理の前から始まる。",
    description: "食の支援には、選択肢を小さくし、いつもの流れを守り、一緒に食べる準備をしやすくすることも含まれます。",
    notes: [
      { title: "判断の負担を減らす", text: "理想の献立からではなく、今日の元気と、今ある食材から始めます。" },
      { title: "慣れた流れを守る", text: "繰り返し作れる料理と柔軟な手順は、毎日の食事づくりを少し扱いやすくします。" },
      { title: "食事全体の作業を見る", text: "調理だけでなく、取り分け、配膳、片づけまで含めて、現実的な食事かどうかを考えます。" },
      { title: "ホスピタリティの余白を残す", text: "デジタルツールは、人が囲む食卓を奪わず、日々の選択を静かに支えます。" },
    ],
  },
  about: {
    eyebrow: "Yuriqa Lab",
    title: "実践のための研究プロトタイプ。",
    text: "Yuriqa Labは、AI、ケアシステム、ホスピタリティ、食の仕組み、人間中心のインターフェースが交わる場所を探究しています。KitchenRxは、ホスピタリティの知識を、穏やかな日々の判断へつなぐデジタルツールのあり方を考える試みです。",
    prototypeLabel: "プロトタイプ · V1.1",
    localFirstLabel: "ローカル優先 · 2026",
  },
  footer: {
    description: "Yuriqa Labによる、ケアを軸にしたレシピ・食事支援プロトタイプ。",
    disclaimer: "KitchenRxは食の支援を目的としたプロトタイプであり、医療助言ではありません。医療上または個別の食事制限に関する相談は、資格を持つ専門家へご相談ください。",
    meta: "バックエンドなし · ログインなし · データ収集なし",
  },
  recipe: {
    minutes: (minutes) => `${minutes}分`,
    contextsLabel: "レシピの特徴",
    view: "レシピを見る",
    saveLabel: (title) => `${title}を保存する`,
    removeLabel: (title) => `${title}を保存から外す`,
    close: "レシピ詳細を閉じる",
    ingredients: "材料",
    preparation: "作り方",
    why: "このレシピが役立つ場面",
    safety: "日々の食事を支えるための情報であり、医療助言ではありません。",
    saveForLater: "あとで見るに保存",
    removeFromSaved: "保存から外す",
  },
  toast: {
    savedDataReset: "保存済みレシピのデータを読み込めなかったため、一覧をリセットしました。",
    storageFailed: "このブラウザに変更を保存できませんでした。再読み込み後には引き継がれません。",
    recipeSaved: (title) => `${title}を保存しました。`,
    recipeRemoved: (title) => `${title}を保存から外しました。`,
    copySuccess: "献立リストをクリップボードへコピーしました。",
    copyFailed: "献立リストをコピーできませんでした。ブラウザの権限をご確認ください。",
    languageStorageFailed: "表示言語は切り替わりましたが、このブラウザに設定を保存できませんでした。",
  },
  mealListTitle: "KitchenRx 献立リスト",
};

export const uiTranslations: Record<Language, UiCopy> = { en, ja };

export const mealTypeLabels: Record<Language, Record<MealType, string>> = {
  en: { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" },
  ja: { breakfast: "朝食", lunch: "昼食", dinner: "夕食", snack: "間食" },
};

export const careContextLabels: Record<Language, Record<CareContext, string>> = {
  en: {
    lowEnergy: "Low energy",
    gentleMeal: "Gentle meal",
    familyMeal: "Family meal",
    highProtein: "High protein",
    comfortFood: "Comfort food",
    quickPreparation: "Quick preparation",
  },
  ja: {
    lowEnergy: "元気がない日",
    gentleMeal: "やさしい食事",
    familyMeal: "家族の食事",
    highProtein: "たんぱく質を意識",
    comfortFood: "ほっとする料理",
    quickPreparation: "手早く準備",
  },
};

export const ingredientFilterLabels: Record<Language, Record<IngredientFilter, string>> = {
  en: { rice: "Rice", eggs: "Eggs", tofu: "Tofu", chicken: "Chicken", vegetables: "Vegetables", pasta: "Pasta", soup: "Soup", fruit: "Fruit" },
  ja: { rice: "ごはん", eggs: "卵", tofu: "豆腐", chicken: "鶏肉", vegetables: "野菜", pasta: "パスタ", soup: "スープ", fruit: "果物" },
};

export function getUiCopy(language: Language): UiCopy {
  return uiTranslations[language] ?? uiTranslations.en;
}
