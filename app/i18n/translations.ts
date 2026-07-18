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
    sourceTitle: string;
    sourceText: string;
    privacyTitle: string;
    privacyText: string;
    credentialTitle: string;
    credentialTitleSegments?: string[];
    credentialText: string;
    credentialTextSegments?: string[];
    boardLabel: string;
    boardImageAlt: string;
    boardHeading: string;
    boardDate: string;
    boardKicker: string;
    boardRecipe: string;
    boardRecipeSegments?: string[];
    boardTime: string;
    boardOnePot: string;
    boardFlexible: string;
    boardNoteOne: string;
    boardNoteOneSegments?: string[];
    boardNoteTwo: string;
    boardNoteTwoSegments?: string[];
  };
  principlesLabel: string;
  principles: string[];
  nutrition: {
    eyebrow: string;
    title: string;
    titleSegments?: string[];
    description: string;
    chipLabel: string;
    ingredientHeading: string;
    whyIngredient: string;
    sources: string;
    openSource: (publisher: string) => string;
    disclaimer: string;
    recipeTagsLabel: string;
    relatedRecipeCount: (count: number) => string;
    viewRelatedRecipes: string;
    demoHint: string;
  };
  ingredientChoiceTip: {
    title: string;
    description: string;
  };
  explorer: {
    eyebrow: string;
    title: string;
    titleSegments?: string[];
    description: string;
    visualDisclaimer: string;
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
    nutrientResultTitle: (nutrient: string) => string;
    nutrientResultText: string;
    removeNutrientFilter: string;
  };
  mealPlan: {
    eyebrow: string;
    title: string;
    titleSegments?: string[];
    description: string;
    savedCount: (count: number) => string;
    copy: string;
    emptyHint: string;
    readyHint: string;
  };
  careNotes: {
    eyebrow: string;
    title: string;
    titleSegments?: string[];
    description: string;
    notes: Array<{ title: string; titleSegments?: string[]; text: string }>;
  };
  about: { eyebrow: string; title: string; text: string; prototypeLabel: string; localFirstLabel: string };
  footer: { description: string; disclaimer: string };
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
    lede: "KitchenRx helps you explore realistic meals by energy, ingredients, and everyday routines, then save a few options for the days ahead.",
    explore: "Explore food & nutrients",
    careApproach: "Browse all recipes",
    noticesLabel: "Why you can trust the shelf",
    sourceTitle: "Named public sources.",
    sourceText: "Food-and-nutrient connections show the public sources used for this prototype.",
    privacyTitle: "Private by design.",
    privacyText: "Saved recipes and language preferences stay in this browser.",
    credentialTitle: "Grounded in culinary expertise.",
    credentialText: "Recipes and cooking steps are reviewed by the developer, a licensed cook and confectionery hygienist in Japan.",
    boardLabel: "A sample of KitchenRx meal contexts",
    boardImageAlt: "A salmon grain bowl with spinach, almonds, and blueberries arranged nearby",
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
  principlesLabel: "KitchenRx at a glance",
  principles: ["BILINGUAL", "27 RECIPES", "SAVED ON DEVICE", "PUBLIC SOURCES"],
  nutrition: {
    eyebrow: "Food & nutrient guide",
    title: "Explore the ingredients behind the meal.",
    description: "Choose a nutrient to see a short food-based explanation, connected ingredients, and the public sources used for this prototype.",
    chipLabel: "Choose a nutrient to explore",
    ingredientHeading: "Ingredient connections",
    whyIngredient: "How this ingredient works in the dish",
    sources: "Sources",
    openSource: (publisher) => `Read source from ${publisher}`,
    disclaimer: "Reference information for choosing foods and meals. It does not provide treatment or supplement dosing guidance.",
    recipeTagsLabel: "Food nutrient connections",
    relatedRecipeCount: (count) => `${count} ${count === 1 ? "recipe" : "recipes"} with a connected ingredient`,
    viewRelatedRecipes: "View related recipes",
    demoHint: "Next, open a recipe to see why its ingredients are included and review the public sources.",
  },
  ingredientChoiceTip: {
    title: "Ideas for choosing ingredients",
    description: "Combining dark leafy greens, colorful vegetables, fruit, fish, beans, nuts, and whole grains can bring a wider range of nutrients into everyday meals. When it suits the recipe, olive oil or another plant oil can also be used.",
  },
  explorer: {
    eyebrow: "Recipe explorer",
    title: "Start with what feels possible.",
    description: "Choose one or more practical contexts. Options within a group are matched broadly; groups work together to narrow the shelf.",
    visualDisclaimer: "Recipe visuals are illustrative images created for this prototype.",
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
    nutrientResultTitle: (nutrient) => `Recipes connected to ${nutrient}`,
    nutrientResultText: "These recipes use an ingredient connected to the selected nutrient in the KitchenRx food guide.",
    removeNutrientFilter: "Remove nutrient filter",
  },
  mealPlan: {
    eyebrow: "Your meal list",
    title: "A small plan can be enough.",
    description: "Save a few realistic options and copy their titles as a simple list. Saved items remain in this browser.",
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
    disclaimer: "KitchenRx is a food and meal-planning prototype. For medical or diet-specific needs, consult a qualified professional.",
  },
  recipe: {
    minutes: (minutes) => `${minutes} min`,
    contextsLabel: "Recipe contexts",
    view: "View recipe",
    saveLabel: (title) => `Save ${title} to the meal list`,
    removeLabel: (title) => `Remove ${title} from the meal list`,
    close: "Close recipe details",
    ingredients: "Ingredients",
    preparation: "Preparation",
    why: "Why this recipe is practical",
    saveForLater: "Save to meal list",
    removeFromSaved: "Remove from meal list",
  },
  toast: {
    savedDataReset: "Saved recipes were reset because the stored list could not be read.",
    storageFailed: "This browser could not store the change. It will not persist after a reload.",
    recipeSaved: (title) => `${title} saved to your meal list.`,
    recipeRemoved: (title) => `${title} removed from your meal list.`,
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
    lede: "KitchenRxは、今日の元気、手元の食材、いつもの暮らしに合わせて、現実的な食事を探すためのツールです。選びやすい候補を見つけ、できることから献立に残せます。",
    explore: "食材と栄養素を見る",
    careApproach: "すべてのレシピを見る",
    noticesLabel: "信頼につながる情報",
    sourceTitle: "公的な出典を明記。",
    sourceText: "食品と栄養素のつながりには、参照した公的資料を表示します。",
    privacyTitle: "プライバシーを前提に。",
    privacyText: "保存したレシピと言語設定は、このブラウザ内に保たれます。",
    credentialTitle: "食の専門性を土台に。",
    credentialTitleSegments: ["食の専門性を", "土台に。"],
    credentialText: "調理師・製菓衛生師の資格を持つ開発者が、レシピ設計と調理工程を確認しています。",
    credentialTextSegments: ["調理師・製菓衛生師の", "資格を持つ開発者が、", "レシピ設計と調理工程を", "確認しています。"],
    boardLabel: "KitchenRxの食事場面の例",
    boardImageAlt: "鮭と穀物のボウルのそばに、ほうれん草、アーモンド、ブルーベリーを並べたイメージ",
    boardHeading: "本日のケア棚",
    boardDate: "04 · 小さな一歩",
    boardKicker: "元気がない日の昼食",
    boardRecipe: "豆腐と青菜のごはんスープ",
    boardRecipeSegments: ["豆腐と青菜の", "ごはんスープ"],
    boardTime: "18分",
    boardOnePot: "鍋ひとつ",
    boardFlexible: "アレンジ自在",
    boardNoteOne: "今ある食材を活かす。",
    boardNoteOneSegments: ["今ある食材を", "活かす。"],
    boardNoteTwo: "あとで迷う時間を減らす。",
    boardNoteTwoSegments: ["あとで迷う", "時間を減らす。"],
  },
  principlesLabel: "KitchenRxの特徴",
  principles: ["日英対応", "27レシピ", "端末内に保存", "公的出典つき"],
  nutrition: {
    eyebrow: "食材と栄養素ガイド",
    title: "料理の背景にある食材を知る。",
    titleSegments: ["料理の背景にある", "食材を知る。"],
    description: "栄養素を選ぶと、食品を中心にした短い説明、関連する食材、このプロトタイプで参照した公開資料を確認できます。",
    chipLabel: "知りたい栄養素を選択",
    ingredientHeading: "関連する食材",
    whyIngredient: "料理での食材の役割",
    sources: "出典",
    openSource: (publisher) => `${publisher}の出典を開く`,
    disclaimer: "食品と献立を選ぶための参考情報です。治療やサプリメントの用量は案内しません。",
    recipeTagsLabel: "食品と栄養素のつながり",
    relatedRecipeCount: (count) => `関連食材を使うレシピ ${count}件`,
    viewRelatedRecipes: "関連レシピを見る",
    demoHint: "次にレシピを開くと、食材を掲載する理由と公的な出典を確認できます。",
  },
  ingredientChoiceTip: {
    title: "食材を選ぶときのヒント",
    description: "濃い緑色の葉物野菜、色の濃い野菜、果物、魚、豆類、ナッツ、全粒穀物などを組み合わせると、さまざまな栄養素を日々の料理へ取り入れやすくなります。料理に合う場合は、オリーブ油などの植物油も選べます。",
  },
  explorer: {
    eyebrow: "レシピ検索",
    title: "今できそうなことから。",
    titleSegments: ["今できそうな", "ことから。"],
    description: "暮らしに合う条件を複数選べます。同じ項目内では幅広く探し、異なる項目を組み合わせると候補を絞り込めます。",
    visualDisclaimer: "レシピ画像は、本プロトタイプ用に作成したイメージ画像です。",
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
    nutrientResultTitle: (nutrient) => `${nutrient}とつながるレシピ`,
    nutrientResultText: "選択した栄養素と、KitchenRxの食材ガイドで結びつけた食材を使うレシピです。",
    removeNutrientFilter: "栄養素の絞り込みを解除",
  },
  mealPlan: {
    eyebrow: "献立リスト",
    title: "小さな計画でも、十分。",
    titleSegments: ["小さな計画でも、", "十分。"],
    description: "無理のない候補をいくつか保存し、レシピ名の一覧としてコピーできます。保存した内容は、このブラウザ内に残ります。",
    savedCount: () => "件のレシピを保存",
    copy: "献立リストをコピー",
    emptyHint: "レシピを1件以上保存するとコピーできます。",
    readyHint: "レシピ名をプレーンテキストでコピーします。",
  },
  careNotes: {
    eyebrow: "ケアの考え方",
    title: "ケアは、調理の前から始まる。",
    titleSegments: ["ケアは、", "調理の前から", "始まる。"],
    description: "食の支援には、選択肢を絞って迷いを減らし、いつもの流れを守りながら、一緒に食べる準備を整えることも含まれます。",
    notes: [
      { title: "判断の負担を減らす", text: "理想の献立からではなく、今日の元気と、今ある食材から始めます。" },
      { title: "慣れた流れを守る", text: "繰り返し作れる料理と柔軟な手順は、毎日の食事づくりを少し扱いやすくします。" },
      { title: "食事全体の作業を見る", text: "調理だけでなく、取り分け、配膳、片づけまで含めて、現実的な食事かどうかを考えます。" },
      { title: "人と食べる時間を守る", titleSegments: ["人と食べる時間を", "守る"], text: "デジタルツールは食事の主役にならず、人と食べる時間や日々の選択を静かに支えます。" },
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
    disclaimer: "KitchenRxは食材と献立の情報を提供するプロトタイプです。医療上または個別の食事制限については、資格を持つ専門家へご相談ください。",
  },
  recipe: {
    minutes: (minutes) => `${minutes}分`,
    contextsLabel: "レシピの特徴",
    view: "レシピを見る",
    saveLabel: (title) => `${title}を献立リストに保存する`,
    removeLabel: (title) => `${title}を献立リストから外す`,
    close: "レシピ詳細を閉じる",
    ingredients: "材料",
    preparation: "作り方",
    why: "このレシピが役立つ場面",
    saveForLater: "献立リストに保存",
    removeFromSaved: "献立リストから外す",
  },
  toast: {
    savedDataReset: "保存済みレシピのデータを読み込めなかったため、一覧をリセットしました。",
    storageFailed: "このブラウザに変更を保存できませんでした。再読み込み後には引き継がれません。",
    recipeSaved: (title) => `${title}を献立リストに保存しました。`,
    recipeRemoved: (title) => `${title}を献立リストから外しました。`,
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
