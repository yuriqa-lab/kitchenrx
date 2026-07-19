"use client";

import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  evidenceIngredients,
  getEvidenceSources,
  getIngredientsForNutrient,
  nutrients,
} from "../data/nutrition";
import { recipes } from "../data/recipes";
import {
  careContextLabels,
  getUiCopy,
  ingredientFilterLabels,
  mealTypeLabels,
} from "../i18n/translations";
import {
  LANGUAGE_KEY,
  localizeRecipe,
  resolveInitialLanguage,
} from "../lib/localization";
import { countMatchCriteria, emptyMatchCriteria, findRecipeMatches } from "../lib/recipeMatch";
import { filterRecipes, formatMealList, parseSavedRecipeIds, SAVED_RECIPES_KEY } from "../lib/recipeLogic";
import {
  careContexts,
  ingredientFilters,
  matchTimeBudgets,
  mealTypes,
  type CareContext,
  type FilterState,
  type IngredientFilter,
  type Language,
  type LocalizedRecipe,
  type MatchCriteria,
  type MatchReason,
  type MatchTimeBudget,
  type MealType,
  type NutrientId,
  type Recipe,
  type RecipeMatch,
} from "../types/recipe";

const emptyFilters: FilterState = { mealTypes: [], careContexts: [], ingredients: [] };

type ToastState = { message: string; tone: "success" | "error" | "notice" } | null;
type Copy = ReturnType<typeof getUiCopy>;

function SegmentedText({ text, segments }: { text: string; segments?: string[] }) {
  if (!segments?.length) return text;

  return (
    <>
      {segments.map((segment, index) => (
        <Fragment key={`${segment}-${index}`}>
          {index > 0 && <wbr />}
          <span className="display-phrase">{segment}</span>
        </Fragment>
      ))}
    </>
  );
}

export function KitchenRxApp() {
  const [language, setLanguage] = useState<Language>("en");
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedNutrientId, setSelectedNutrientId] = useState<NutrientId>("lutein");
  const [recipeNutrientFilter, setRecipeNutrientFilter] = useState<NutrientId | null>(null);
  const [matchCriteria, setMatchCriteria] = useState<MatchCriteria>(emptyMatchCriteria);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [storageReady, setStorageReady] = useState(false);
  const nutrientResultsRef = useRef<HTMLDivElement>(null);
  const validRecipeIds = useMemo(() => new Set(recipes.map((recipe) => recipe.id)), []);
  const copy = getUiCopy(language);
  const selectedNutrient = nutrients.find((nutrient) => nutrient.id === selectedNutrientId) ?? nutrients[0];
  const selectedNutrientContent = selectedNutrient.translations[language] ?? selectedNutrient.translations.en;
  const selectedIngredients = getIngredientsForNutrient(selectedNutrientId);
  const selectedNutrientRecipeCount = recipes.filter((recipe) => recipe.nutrientTags.includes(selectedNutrientId)).length;
  const filteredNutrient = nutrients.find((nutrient) => nutrient.id === recipeNutrientFilter) ?? null;
  const filteredNutrientContent = filteredNutrient
    ? filteredNutrient.translations[language] ?? filteredNutrient.translations.en
    : null;

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
    const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const initialLanguage = resolveInitialLanguage(storedLanguage, browserLanguages);
    const languageTask = window.setTimeout(() => {
      setLanguage(initialLanguage);
      document.documentElement.lang = initialLanguage;
    }, 0);
    return () => window.clearTimeout(languageTask);
  }, []);

  useEffect(() => {
    const restored = parseSavedRecipeIds(window.localStorage.getItem(SAVED_RECIPES_KEY), validRecipeIds);
    const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
    const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const initialCopy = getUiCopy(resolveInitialLanguage(storedLanguage, browserLanguages));
    const restoreTask = window.setTimeout(() => {
      setSavedIds(new Set(restored.ids));
      setStorageReady(true);
      if (restored.repaired) {
        window.localStorage.removeItem(SAVED_RECIPES_KEY);
        setToast({ message: initialCopy.toast.savedDataReset, tone: "notice" });
      }
    }, 0);
    return () => window.clearTimeout(restoreTask);
  }, [validRecipeIds]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const visibleRecipes = useMemo(
    () => filterRecipes(recipes, filters, savedOnly, savedIds, recipeNutrientFilter),
    [filters, savedOnly, savedIds, recipeNutrientFilter],
  );
  const recipeMatches = useMemo(() => findRecipeMatches(recipes, matchCriteria), [matchCriteria]);

  const activeFilterCount = filters.mealTypes.length + filters.careContexts.length + filters.ingredients.length + (recipeNutrientFilter ? 1 : 0);
  const savedRecipes = recipes.filter((recipe) => savedIds.has(recipe.id));

  function changeLanguage(nextLanguage: Language) {
    if (nextLanguage === language) return;
    setLanguage(nextLanguage);
    setToast(null);
    document.documentElement.lang = nextLanguage;
    try {
      window.localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    } catch {
      setToast({ message: getUiCopy(nextLanguage).toast.languageStorageFailed, tone: "notice" });
    }
  }

  function persistSaved(next: Set<string>) {
    setSavedIds(next);
    if (!storageReady) return;
    try {
      window.localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify([...next]));
    } catch {
      setToast({ message: copy.toast.storageFailed, tone: "error" });
    }
  }

  function toggleSaved(recipe: Recipe) {
    const next = new Set(savedIds);
    const isRemoving = next.delete(recipe.id);
    if (!isRemoving) next.add(recipe.id);
    persistSaved(next);
    const title = localizeRecipe(recipe, language).title;
    setToast({
      message: isRemoving ? copy.toast.recipeRemoved(title) : copy.toast.recipeSaved(title),
      tone: "success",
    });
  }

  function toggleFilter<K extends keyof FilterState>(group: K, value: FilterState[K][number]) {
    setFilters((current) => {
      const values = current[group] as Array<FilterState[K][number]>;
      const nextValues = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
      return { ...current, [group]: nextValues };
    });
  }

  function clearFilters() {
    setFilters(emptyFilters);
    setSavedOnly(false);
    setRecipeNutrientFilter(null);
  }

  function showRelatedRecipes() {
    setFilters(emptyFilters);
    setSavedOnly(false);
    setRecipeNutrientFilter(selectedNutrientId);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        nutrientResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        nutrientResultsRef.current?.focus({ preventScroll: true });
      });
    });
  }

  async function copyMealList() {
    if (savedRecipes.length === 0) return;
    try {
      await copyText(formatMealList(savedRecipes, language));
      setToast({ message: copy.toast.copySuccess, tone: "success" });
    } catch {
      setToast({ message: copy.toast.copyFailed, tone: "error" });
    }
  }

  return (
    <>
      <a className="skip-link" href="#recipe-explorer">{copy.skipLink}</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top" aria-label={copy.homeLabel}>
            <span className="wordmark-mark" aria-hidden="true">K</span>
            <span>KitchenRx</span>
          </a>
          <nav className="site-nav" aria-label={copy.primaryNavigationLabel}>
            <a href="#recipe-explorer">{copy.nav.recipes}</a>
            <a href="#care-notes">{copy.nav.careNotes}</a>
            <a href="#about">{copy.nav.about}</a>
          </nav>
          <div className="language-switcher" role="group" aria-label={copy.languageSwitcherLabel}>
            <button type="button" lang="ja" aria-pressed={language === "ja"} onClick={() => changeLanguage("ja")}>
              {language === "ja" && <span aria-hidden="true">✓</span>} 日本語
            </button>
            <button type="button" lang="en" aria-pressed={language === "en"} onClick={() => changeLanguage("en")}>
              {language === "en" && <span aria-hidden="true">✓</span>} English
            </button>
          </div>
          <button
            className={`saved-header-button${savedOnly ? " is-active" : ""}`}
            type="button"
            aria-pressed={savedOnly}
            onClick={() => {
              setRecipeNutrientFilter(null);
              setSavedOnly((value) => !value);
              document.querySelector("#recipe-explorer")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span aria-hidden="true">♡</span>
            {copy.saved} <span className="saved-count">{savedIds.size}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> {copy.hero.eyebrow}</p>
            <h1 id="hero-title"><SegmentedText text={copy.hero.title} segments={copy.hero.titleSegments} /></h1>
            <p className="hero-lede">{copy.hero.lede}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#nutrition-guide">{copy.hero.explore} <span aria-hidden="true">↓</span></a>
              <a className="text-link" href="#recipe-explorer">{copy.hero.careApproach} <span aria-hidden="true">→</span></a>
            </div>
            <div className="hero-notices" aria-label={copy.hero.noticesLabel}>
              <p><strong>{copy.hero.sourceTitle}</strong> {copy.hero.sourceText}</p>
              <p><strong>{copy.hero.privacyTitle}</strong> {copy.hero.privacyText}</p>
              <p className="credential-notice"><strong><SegmentedText text={copy.hero.credentialTitle} segments={copy.hero.credentialTitleSegments} /></strong>{" "}<SegmentedText text={copy.hero.credentialText} segments={copy.hero.credentialTextSegments} /></p>
            </div>
          </div>
          <div className="hero-board" aria-label={copy.hero.boardLabel}>
            <div className="board-heading">
              <span>{copy.hero.boardHeading}</span>
              <span className="board-date">{copy.hero.boardDate}</span>
            </div>
            <div className="board-card board-card-main board-photo-card">
              {/* The source is already sized and compressed for this static, browser-focused build. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hero-image"
                src="/images/hero/kitchenrx-hero.webp"
                width="1672"
                height="941"
                alt={copy.hero.boardImageAlt}
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div className="board-grid">
              <div className="board-note"><span>01</span><p><SegmentedText text={copy.hero.boardNoteOne} segments={copy.hero.boardNoteOneSegments} /></p></div>
              <div className="board-note board-note-pink"><span>02</span><p><SegmentedText text={copy.hero.boardNoteTwo} segments={copy.hero.boardNoteTwoSegments} /></p></div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label={copy.principlesLabel}>
          {copy.principles.map((principle, index) => (
            <span className="trust-item" key={principle}>
              <p>{principle}</p>{index < copy.principles.length - 1 && <i aria-hidden="true">✦</i>}
            </span>
          ))}
        </section>

        <MatchSection
          criteria={matchCriteria}
          matches={recipeMatches}
          language={language}
          copy={copy}
          savedIds={savedIds}
          onCriteriaChange={setMatchCriteria}
          onOpen={setSelectedRecipe}
          onSave={toggleSaved}
        />

        <section className="nutrition-guide section-shell" id="nutrition-guide" aria-labelledby="nutrition-title">
          <div className="section-intro nutrition-intro">
            <div>
              <p className="eyebrow"><span /> {copy.nutrition.eyebrow}</p>
              <h2 id="nutrition-title"><SegmentedText text={copy.nutrition.title} segments={copy.nutrition.titleSegments} /></h2>
            </div>
            <p>{copy.nutrition.description}</p>
          </div>

          <div className="nutrient-chips" role="group" aria-label={copy.nutrition.chipLabel}>
            {nutrients.map((nutrient) => {
              const content = nutrient.translations[language] ?? nutrient.translations.en;
              return (
                <button
                  type="button"
                  key={nutrient.id}
                  aria-pressed={selectedNutrientId === nutrient.id}
                  onClick={() => setSelectedNutrientId(nutrient.id)}
                >
                  {content.name}
                </button>
              );
            })}
          </div>

          <div className="nutrition-panel">
            <div className="nutrient-summary">
              <p className="nutrition-index">{String(nutrients.indexOf(selectedNutrient) + 1).padStart(2, "0")}</p>
              <h3>{selectedNutrientContent.name}</h3>
              <div className="nutrient-description">
                <p>{selectedNutrientContent.shortDescription}</p>
              </div>
              <SourceLinks sourceIds={selectedNutrient.sourceIds} copy={copy} />
              <div className="nutrition-action">
                <p>{copy.nutrition.relatedRecipeCount(selectedNutrientRecipeCount)}</p>
                <button className="button button-primary" type="button" onClick={showRelatedRecipes}>
                  {copy.nutrition.viewRelatedRecipes} <span aria-hidden="true">→</span>
                </button>
                <small>{copy.nutrition.demoHint}</small>
              </div>
            </div>

            <div className="ingredient-connections">
              <h3>{copy.nutrition.ingredientHeading}</h3>
              <div className="ingredient-evidence-grid">
                {selectedIngredients.map((ingredient) => {
                  const content = ingredient.translations[language] ?? ingredient.translations.en;
                  return (
                    <article key={ingredient.id}>
                      <p className="why-label">{copy.nutrition.whyIngredient}</p>
                      <h4>{content.name}</h4>
                      <p>{content.whyIncluded}</p>
                      <SourceLinks sourceIds={ingredient.sourceIds} copy={copy} />
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="nutrition-reference-note">{copy.nutrition.disclaimer}</p>
        </section>

        <aside className="ingredient-choice-tip section-shell" aria-labelledby="ingredient-choice-tip-title">
          <h2 id="ingredient-choice-tip-title">{copy.ingredientChoiceTip.title}</h2>
          <p>{copy.ingredientChoiceTip.description}</p>
        </aside>

        <section className="explorer section-shell" id="recipe-explorer" aria-labelledby="explorer-title">
          <div className="section-intro explorer-intro">
            <div>
              <p className="eyebrow"><span /> {copy.explorer.eyebrow}</p>
              <h2 id="explorer-title"><SegmentedText text={copy.explorer.title} segments={copy.explorer.titleSegments} /></h2>
            </div>
            <p>{copy.explorer.description}</p>
          </div>
          <p className="recipe-visual-disclaimer">{copy.explorer.visualDisclaimer}</p>

          <div className="explorer-layout">
            <aside className="filter-panel" aria-label={copy.explorer.filterPanelLabel}>
              <div className="filter-panel-heading">
                <h3>{copy.explorer.filterHeading}</h3>
                {(activeFilterCount > 0 || savedOnly) && <button className="clear-button" type="button" onClick={clearFilters}>{copy.explorer.clearAll}</button>}
              </div>
              <FilterGroup<MealType>
                legend={copy.explorer.mealType}
                values={mealTypes}
                selected={filters.mealTypes}
                group="mealTypes"
                getLabel={(value) => mealTypeLabels[language][value]}
                onToggle={toggleFilter}
              />
              <FilterGroup<CareContext>
                legend={copy.explorer.careContext}
                values={careContexts}
                selected={filters.careContexts}
                group="careContexts"
                getLabel={(value) => careContextLabels[language][value]}
                onToggle={toggleFilter}
              />
              <FilterGroup<IngredientFilter>
                legend={copy.explorer.ingredient}
                values={ingredientFilters}
                selected={filters.ingredients}
                group="ingredients"
                getLabel={(value) => ingredientFilterLabels[language][value]}
                onToggle={toggleFilter}
              />
              <label className="saved-toggle">
                <input type="checkbox" checked={savedOnly} onChange={(event) => setSavedOnly(event.target.checked)} />
                <span aria-hidden="true">♡</span>
                <span><strong>{copy.explorer.savedOnly}</strong><small>{savedIds.size === 0 ? copy.explorer.nothingSaved : copy.explorer.savedOnList(savedIds.size)}</small></span>
              </label>
            </aside>

            <div className="results-area">
              {recipeNutrientFilter && filteredNutrientContent && (
                <div className="nutrient-result-banner" tabIndex={-1} ref={nutrientResultsRef}>
                  <div>
                    <span>{copy.nutrition.eyebrow}</span>
                    <strong>{copy.explorer.nutrientResultTitle(filteredNutrientContent.name)}</strong>
                    <p>{copy.explorer.nutrientResultText}</p>
                  </div>
                  <button type="button" onClick={() => setRecipeNutrientFilter(null)} aria-label={copy.explorer.removeNutrientFilter}>×</button>
                </div>
              )}
              <div className="results-toolbar">
                <p className="result-count" aria-live="polite">{copy.explorer.resultCount(visibleRecipes.length)}</p>
                {activeFilterCount > 0 && <p className="active-filter-note">{copy.explorer.activeFilters(activeFilterCount)}</p>}
              </div>

              {visibleRecipes.length > 0 ? (
                <div className="recipe-grid">
                  {visibleRecipes.map((recipe, index) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      language={language}
                      copy={copy}
                      index={recipes.indexOf(recipe) + 1 || index + 1}
                      saved={savedIds.has(recipe.id)}
                      onSave={() => toggleSaved(recipe)}
                      onOpen={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state" role="status">
                  <span aria-hidden="true">○</span>
                  <h3>{savedOnly && savedIds.size === 0 ? copy.explorer.emptySavedTitle : copy.explorer.emptyResultsTitle}</h3>
                  <p>{savedOnly && savedIds.size === 0 ? copy.explorer.emptySavedText : copy.explorer.emptyResultsText}</p>
                  <button className="button button-secondary" type="button" onClick={clearFilters}>{copy.explorer.showAll}</button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="saved-plan section-shell" aria-labelledby="saved-title">
          <div className="saved-plan-card">
            <div>
              <p className="eyebrow eyebrow-light"><span /> {copy.mealPlan.eyebrow}</p>
              <h2 id="saved-title"><SegmentedText text={copy.mealPlan.title} segments={copy.mealPlan.titleSegments} /></h2>
              <p>{copy.mealPlan.description}</p>
            </div>
            <div className="saved-plan-action">
              <p><strong>{savedIds.size}</strong> {copy.mealPlan.savedCount(savedIds.size)}</p>
              <button className="button button-cream" type="button" onClick={copyMealList} disabled={savedIds.size === 0} aria-describedby="copy-hint">{copy.mealPlan.copy}</button>
              <small id="copy-hint">{savedIds.size === 0 ? copy.mealPlan.emptyHint : copy.mealPlan.readyHint}</small>
            </div>
          </div>
        </section>

        <section className="care-notes section-shell" id="care-notes" aria-labelledby="care-title">
          <div className="section-intro">
            <div>
              <p className="eyebrow"><span /> {copy.careNotes.eyebrow}</p>
              <h2 id="care-title"><SegmentedText text={copy.careNotes.title} segments={copy.careNotes.titleSegments} /></h2>
            </div>
            <p>{copy.careNotes.description}</p>
          </div>
          <div className="notes-grid">
            {copy.careNotes.notes.map((note, index) => (
              <article key={note.title}><span>{String(index + 1).padStart(2, "0")}</span><h3><SegmentedText text={note.title} segments={note.titleSegments} /></h3><p>{note.text}</p></article>
            ))}
          </div>
        </section>

        <section className="about section-shell" id="about" aria-labelledby="about-title">
          <div className="about-card">
            <div className="about-mark" aria-hidden="true">YL</div>
            <div>
              <p className="eyebrow"><span /> {copy.about.eyebrow}</p>
              <h2 id="about-title">{copy.about.title}</h2>
              <p>{copy.about.text}</p>
            </div>
            <p className="prototype-label">{copy.about.prototypeLabel}<br />{copy.about.localFirstLabel}</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div><a className="wordmark footer-wordmark" href="#top" aria-label={copy.homeLabel}><span className="wordmark-mark" aria-hidden="true">K</span><span>KitchenRx</span></a><p>{copy.footer.description}</p></div>
        <p className="footer-disclaimer">{copy.footer.disclaimer}</p>
      </footer>

      {selectedRecipe && (
        <RecipeDialog
          recipe={selectedRecipe}
          language={language}
          copy={copy}
          saved={savedIds.has(selectedRecipe.id)}
          onSave={() => toggleSaved(selectedRecipe)}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {toast && <div className={`toast toast-${toast.tone}`} role={toast.tone === "error" ? "alert" : "status"}>{toast.message}</div>}
    </>
  );
}

interface MatchSectionProps {
  criteria: MatchCriteria;
  matches: RecipeMatch[];
  language: Language;
  copy: Copy;
  savedIds: Set<string>;
  onCriteriaChange: (criteria: MatchCriteria) => void;
  onOpen: (recipe: Recipe) => void;
  onSave: (recipe: Recipe) => void;
}

function MatchSection({ criteria, matches, language, copy, savedIds, onCriteriaChange, onOpen, onSave }: MatchSectionProps) {
  const selectedCount = countMatchCriteria(criteria);

  function updateCriterion<Key extends keyof MatchCriteria>(key: Key, value: MatchCriteria[Key]) {
    onCriteriaChange({ ...criteria, [key]: value });
  }

  return (
    <section className="match-section section-shell" id="kitchenrx-match" aria-labelledby="match-title">
      <div className="match-shell">
        <div className="match-intro">
          <p className="eyebrow"><span /> {copy.match.eyebrow}</p>
          <h2 id="match-title"><SegmentedText text={copy.match.title} segments={copy.match.titleSegments} /></h2>
          <p>{copy.match.description}</p>
        </div>

        <div className="match-form" role="group" aria-label={copy.match.formLabel}>
          <MatchSelect
            id="match-meal-type"
            label={copy.match.mealType}
            noPreference={copy.match.noPreference}
            value={criteria.mealType ?? ""}
            onChange={(value) => updateCriterion("mealType", value ? value as MealType : null)}
          >
            {mealTypes.map((value) => <option key={value} value={value}>{mealTypeLabels[language][value]}</option>)}
          </MatchSelect>
          <MatchSelect
            id="match-care-context"
            label={copy.match.careContext}
            noPreference={copy.match.noPreference}
            value={criteria.careContext ?? ""}
            onChange={(value) => updateCriterion("careContext", value ? value as CareContext : null)}
          >
            {careContexts.map((value) => <option key={value} value={value}>{careContextLabels[language][value]}</option>)}
          </MatchSelect>
          <MatchSelect
            id="match-time-budget"
            label={copy.match.timeBudget}
            noPreference={copy.match.noPreference}
            value={criteria.timeBudget ?? ""}
            onChange={(value) => updateCriterion("timeBudget", value ? value as MatchTimeBudget : null)}
          >
            {matchTimeBudgets.map((value) => <option key={value} value={value}>{copy.match.timeLabels[value]}</option>)}
          </MatchSelect>
          <MatchSelect
            id="match-ingredient"
            label={copy.match.ingredient}
            noPreference={copy.match.noPreference}
            value={criteria.ingredient ?? ""}
            onChange={(value) => updateCriterion("ingredient", value ? value as IngredientFilter : null)}
          >
            {ingredientFilters.map((value) => <option key={value} value={value}>{ingredientFilterLabels[language][value]}</option>)}
          </MatchSelect>
          <MatchSelect
            id="match-nutrient"
            label={copy.match.nutrient}
            noPreference={copy.match.noPreference}
            value={criteria.nutrientId ?? ""}
            onChange={(value) => updateCriterion("nutrientId", value ? value as NutrientId : null)}
          >
            {nutrients.map((nutrient) => {
              const content = nutrient.translations[language] ?? nutrient.translations.en;
              return <option key={nutrient.id} value={nutrient.id}>{content.name}</option>;
            })}
          </MatchSelect>
        </div>

        <div className="match-status">
          <p aria-live="polite">{selectedCount > 0 ? copy.match.selectedCount(selectedCount) : copy.match.promptText}</p>
          {selectedCount > 0 && <button type="button" onClick={() => onCriteriaChange(emptyMatchCriteria)}>{copy.match.clear}</button>}
        </div>

        {selectedCount === 0 ? (
          <div className="match-prompt" role="status">
            <span aria-hidden="true">✦</span>
            <div><h3>{copy.match.promptTitle}</h3><p>{copy.match.promptText}</p></div>
          </div>
        ) : matches.length > 0 ? (
          <div className="match-results" id="match-results" aria-live="polite">
            <div className="match-results-heading">
              <h3>{copy.match.resultsTitle}</h3>
              <p>{copy.match.resultsSummary(matches.length)}</p>
            </div>
            <div className="match-grid">
              {matches.map((match) => (
                <MatchResultCard
                  key={match.recipe.id}
                  match={match}
                  language={language}
                  copy={copy}
                  saved={savedIds.has(match.recipe.id)}
                  onOpen={() => onOpen(match.recipe)}
                  onSave={() => onSave(match.recipe)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="match-prompt" role="status">
            <span aria-hidden="true">○</span>
            <div><h3>{copy.match.emptyTitle}</h3><p>{copy.match.emptyText}</p></div>
          </div>
        )}
      </div>
    </section>
  );
}

interface MatchSelectProps {
  id: string;
  label: string;
  noPreference: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

function MatchSelect({ id, label, noPreference, value, onChange, children }: MatchSelectProps) {
  return (
    <label className="match-field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{noPreference}</option>
        {children}
      </select>
    </label>
  );
}

interface MatchResultCardProps {
  match: RecipeMatch;
  language: Language;
  copy: Copy;
  saved: boolean;
  onOpen: () => void;
  onSave: () => void;
}

function MatchResultCard({ match, language, copy, saved, onOpen, onSave }: MatchResultCardProps) {
  const content = localizeRecipe(match.recipe, language);
  return (
    <article className="match-card">
      <div className="match-card-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/recipes/${match.recipe.id}.webp`} width="1200" height="960" alt={content.title} loading="lazy" decoding="async" />
      </div>
      <div className="match-card-body">
        <p className="match-score"><span aria-hidden="true">✦</span> {copy.match.matchScore(match.score)}</p>
        <h4><SegmentedText text={content.title} segments={content.titleSegments} /></h4>
        <ul className="match-reasons">
          {match.reasons.map((reason, index) => <li key={`${reason.kind}-${index}`}>{formatMatchReason(reason, language, copy)}</li>)}
        </ul>
        <div className="match-card-actions">
          <button className="recipe-open" type="button" onClick={onOpen}>{copy.recipe.view} <span aria-hidden="true">→</span></button>
          <button className={`save-button${saved ? " is-saved" : ""}`} type="button" onClick={onSave} aria-pressed={saved} aria-label={saved ? copy.recipe.removeLabel(content.title) : copy.recipe.saveLabel(content.title)}><span aria-hidden="true">{saved ? "♥" : "♡"}</span></button>
        </div>
      </div>
    </article>
  );
}

function formatMatchReason(reason: MatchReason, language: Language, copy: Copy): string {
  switch (reason.kind) {
    case "mealType": return copy.match.reasonMealType(mealTypeLabels[language][reason.value]);
    case "careContext": return copy.match.reasonCareContext(careContextLabels[language][reason.value]);
    case "prepTime": return copy.match.reasonPrepTime(reason.minutes);
    case "ingredient": return copy.match.reasonIngredient(ingredientFilterLabels[language][reason.value]);
    case "nutrient": {
      const nutrient = nutrients.find((item) => item.id === reason.value);
      const content = nutrient?.translations[language] ?? nutrient?.translations.en;
      return copy.match.reasonNutrient(content?.name ?? reason.value);
    }
  }
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    let timeoutId = 0;
    try {
      await Promise.race([
        navigator.clipboard.writeText(value),
        new Promise<never>((_, reject) => {
          timeoutId = window.setTimeout(() => reject(new Error("Clipboard request timed out")), 1500);
        }),
      ]);
      return;
    } catch {
      // Fall through to the browser-compatible selection method below.
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("Copy is unavailable");
}

interface FilterGroupProps<T extends MealType | CareContext | IngredientFilter> {
  legend: string;
  values: readonly T[];
  selected: T[];
  group: keyof FilterState;
  getLabel: (value: T) => string;
  onToggle: <K extends keyof FilterState>(group: K, value: FilterState[K][number]) => void;
}

function FilterGroup<T extends MealType | CareContext | IngredientFilter>({ legend, values, selected, group, getLabel, onToggle }: FilterGroupProps<T>) {
  return (
    <fieldset className="filter-group">
      <legend>{legend}</legend>
      <div className="filter-options">
        {values.map((value) => (
          <label className="filter-chip" key={value}>
            <input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(group, value as never)} />
            <span>{getLabel(value)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface RecipeCardProps {
  recipe: Recipe;
  language: Language;
  copy: Copy;
  index: number;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}

function RecipeCard({ recipe, language, copy, index, saved, onSave, onOpen }: RecipeCardProps) {
  const content = localizeRecipe(recipe, language);
  return (
    <article className="recipe-card">
      <div className="recipe-visual">
        {/* Pre-optimized static WebP keeps card loading predictable on the Worker build. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/recipes/${recipe.id}.webp`}
          width="1200"
          height="960"
          alt={content.title}
          loading="lazy"
          decoding="async"
        />
        <span className="recipe-number">{String(index).padStart(2, "0")}</span>
        <span className="recipe-meal-type">{mealTypeLabels[language][recipe.mealType]}</span>
      </div>
      <div className="recipe-card-body">
        <div className="recipe-time"><span aria-hidden="true">◷</span> {copy.recipe.minutes(recipe.prepMinutes)} <span>·</span> {careContextLabels[language][recipe.careContexts[0]]}</div>
        {recipe.nutrientTags.length > 0 && (
          <div className="nutrient-tag-row" aria-label={copy.nutrition.recipeTagsLabel}>
            <i aria-hidden="true">✦</i>
            {recipe.nutrientTags.map((nutrientId) => {
              const nutrient = nutrients.find((item) => item.id === nutrientId);
              if (!nutrient) return null;
              const nutrientContent = nutrient.translations[language] ?? nutrient.translations.en;
              return <span key={nutrientId}>{nutrientContent.name}</span>;
            })}
          </div>
        )}
        <h3><SegmentedText text={content.title} segments={content.titleSegments} /></h3>
        <p>{content.description}</p>
        <div className="tag-row" aria-label={copy.recipe.contextsLabel}>
          {recipe.careContexts.slice(0, 2).map((tag) => <span key={tag}>{careContextLabels[language][tag]}</span>)}
        </div>
        <div className="recipe-card-actions">
          <button className="recipe-open" type="button" onClick={onOpen}>{copy.recipe.view} <span aria-hidden="true">→</span></button>
          <button className={`save-button${saved ? " is-saved" : ""}`} type="button" onClick={onSave} aria-pressed={saved} aria-label={saved ? copy.recipe.removeLabel(content.title) : copy.recipe.saveLabel(content.title)}><span aria-hidden="true">{saved ? "♥" : "♡"}</span></button>
        </div>
      </div>
    </article>
  );
}

interface RecipeDialogProps {
  recipe: Recipe;
  language: Language;
  copy: Copy;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
}

function RecipeDialog({ recipe, language, copy, saved, onSave, onClose }: RecipeDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const content: LocalizedRecipe = localizeRecipe(recipe, language);
  const recipeEvidenceIngredients = recipe.evidenceIngredients.flatMap((ingredientId) => {
    const ingredient = evidenceIngredients.find((item) => item.id === ingredientId);
    return ingredient ? [ingredient] : [];
  });
  const recipeEvidenceSourceIds = [...new Set(recipeEvidenceIngredients.flatMap((ingredient) => ingredient.sourceIds))];

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    document.body.classList.add("dialog-open");

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hasAttribute("disabled"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("dialog-open");
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="recipe-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description" ref={dialogRef}>
        <button className="dialog-close" type="button" onClick={onClose} ref={closeButtonRef} aria-label={copy.recipe.close}>×</button>
        <div className="dialog-visual">
          {/* Reuse the pre-optimized card asset without requesting another transformed image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/images/recipes/${recipe.id}.webp`} width="1200" height="960" alt={content.title} decoding="async" />
          <span>{mealTypeLabels[language][recipe.mealType]}</span>
        </div>
        <div className="dialog-content">
          <p className="eyebrow"><span /> {copy.recipe.minutes(recipe.prepMinutes)} · {careContextLabels[language][recipe.careContexts[0]]}</p>
          <h2 id="dialog-title"><SegmentedText text={content.title} segments={content.titleSegments} /></h2>
          <p className="dialog-description" id="dialog-description">{content.description}</p>
          <div className="dialog-columns">
            <div><h3>{copy.recipe.ingredients}</h3><ul>{content.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul></div>
            <div><h3>{copy.recipe.preparation}</h3><ol>{content.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
          </div>
          <div className="why-note"><p className="why-label">{copy.recipe.why}</p><p>{content.whyItMayHelp}</p></div>
          {recipeEvidenceIngredients.length > 0 && (
            <div className="recipe-evidence-note">
              <p className="why-label">{copy.nutrition.recipeTagsLabel}</p>
              <div className="recipe-evidence-nutrients" aria-label={copy.nutrition.recipeTagsLabel}>
                {recipe.nutrientTags.map((nutrientId) => {
                  const nutrient = nutrients.find((item) => item.id === nutrientId);
                  if (!nutrient) return null;
                  const nutrientContent = nutrient.translations[language] ?? nutrient.translations.en;
                  return <span key={nutrient.id}>{nutrientContent.name}</span>;
                })}
              </div>
              <div className="recipe-evidence-ingredients">
                {recipeEvidenceIngredients.map((ingredient) => {
                  const ingredientContent = ingredient.translations[language] ?? ingredient.translations.en;
                  return (
                    <article key={ingredient.id}>
                      <h3>{ingredientContent.name}</h3>
                      <p>{ingredientContent.whyIncluded}</p>
                    </article>
                  );
                })}
              </div>
              <SourceLinks sourceIds={recipeEvidenceSourceIds} copy={copy} />
            </div>
          )}
          <div className="dialog-footer">
            <div className="tag-row" aria-label={copy.explorer.ingredient}>{recipe.featuredIngredients.map((tag) => <span key={tag}>{ingredientFilterLabels[language][tag]}</span>)}</div>
            <button className={`button ${saved ? "button-secondary" : "button-primary"}`} type="button" onClick={onSave}>{saved ? copy.recipe.removeFromSaved : copy.recipe.saveForLater}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceLinks({ sourceIds, copy }: { sourceIds: string[]; copy: Copy }) {
  const sources = getEvidenceSources(sourceIds);
  return (
    <div className="source-links" aria-label={copy.nutrition.sources}>
      <span>{copy.nutrition.sources}</span>
      {sources.map((source) => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          aria-label={copy.nutrition.openSource(source.publisher)}
        >
          {source.publisher} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}
