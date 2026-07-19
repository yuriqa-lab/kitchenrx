import type {
  MatchCriteria,
  MatchReason,
  MatchTimeBudget,
  Recipe,
  RecipeMatch,
} from "../types/recipe";

export const emptyMatchCriteria: MatchCriteria = {
  mealType: null,
  careContext: null,
  timeBudget: null,
  ingredient: null,
  nutrientId: null,
};

const timeLimits: Record<MatchTimeBudget, number> = {
  "15": 15,
  "30": 30,
  "45": 45,
};

export function hasMatchCriteria(criteria: MatchCriteria): boolean {
  return Object.values(criteria).some((value) => value !== null);
}

export function countMatchCriteria(criteria: MatchCriteria): number {
  return Object.values(criteria).filter((value) => value !== null).length;
}

export function findRecipeMatches(
  sourceRecipes: Recipe[],
  criteria: MatchCriteria,
  limit = 3,
): RecipeMatch[] {
  if (!hasMatchCriteria(criteria) || limit <= 0) return [];

  return sourceRecipes
    .filter((recipe) => matchesAllCriteria(recipe, criteria))
    .slice(0, limit)
    .map((recipe) => {
      const reasons = getMatchedReasons(recipe, criteria);
      return { recipe, score: reasons.length, reasons };
    });
}

function matchesAllCriteria(recipe: Recipe, criteria: MatchCriteria): boolean {
  return (
    (criteria.mealType === null || recipe.mealType === criteria.mealType)
    && (criteria.careContext === null || recipe.careContexts.includes(criteria.careContext))
    && (criteria.timeBudget === null || recipe.prepMinutes <= timeLimits[criteria.timeBudget])
    && (criteria.ingredient === null || recipe.featuredIngredients.includes(criteria.ingredient))
    && (criteria.nutrientId === null || recipe.nutrientTags.includes(criteria.nutrientId))
  );
}

function getMatchedReasons(recipe: Recipe, criteria: MatchCriteria): MatchReason[] {
  const reasons: MatchReason[] = [];

  if (criteria.careContext && recipe.careContexts.includes(criteria.careContext)) {
    reasons.push({ kind: "careContext", value: criteria.careContext });
  }
  if (criteria.timeBudget && recipe.prepMinutes <= timeLimits[criteria.timeBudget]) {
    reasons.push({ kind: "prepTime", minutes: recipe.prepMinutes });
  }
  if (criteria.ingredient && recipe.featuredIngredients.includes(criteria.ingredient)) {
    reasons.push({ kind: "ingredient", value: criteria.ingredient });
  }
  if (criteria.nutrientId && recipe.nutrientTags.includes(criteria.nutrientId)) {
    reasons.push({ kind: "nutrient", value: criteria.nutrientId });
  }
  if (criteria.mealType === recipe.mealType) {
    reasons.push({ kind: "mealType", value: recipe.mealType });
  }

  return reasons;
}
