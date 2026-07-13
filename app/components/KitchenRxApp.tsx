"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { recipes } from "../data/recipes";
import { filterRecipes, formatMealList, parseSavedRecipeIds, SAVED_RECIPES_KEY } from "../lib/recipeLogic";
import {
  careContexts,
  ingredientFilters,
  mealTypes,
  type CareContext,
  type FilterState,
  type IngredientFilter,
  type MealType,
  type Recipe,
} from "../types/recipe";

const emptyFilters: FilterState = { mealTypes: [], careContexts: [], ingredients: [] };

type ToastState = { message: string; tone: "success" | "error" | "notice" } | null;

export function KitchenRxApp() {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [storageReady, setStorageReady] = useState(false);
  const validRecipeIds = useMemo(() => new Set(recipes.map((recipe) => recipe.id)), []);

  useEffect(() => {
    const restored = parseSavedRecipeIds(window.localStorage.getItem(SAVED_RECIPES_KEY), validRecipeIds);
    const restoreTask = window.setTimeout(() => {
      setSavedIds(new Set(restored.ids));
      setStorageReady(true);
      if (restored.repaired) {
        window.localStorage.removeItem(SAVED_RECIPES_KEY);
        setToast({ message: "Saved recipes were reset because the stored list could not be read.", tone: "notice" });
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
    () => filterRecipes(recipes, filters, savedOnly, savedIds),
    [filters, savedOnly, savedIds],
  );

  const activeFilterCount = filters.mealTypes.length + filters.careContexts.length + filters.ingredients.length;
  const savedRecipes = recipes.filter((recipe) => savedIds.has(recipe.id));

  function persistSaved(next: Set<string>) {
    setSavedIds(next);
    if (!storageReady) return;
    try {
      window.localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify([...next]));
    } catch {
      setToast({ message: "This browser could not store the change. It will not persist after a reload.", tone: "error" });
    }
  }

  function toggleSaved(recipe: Recipe) {
    const next = new Set(savedIds);
    const isRemoving = next.delete(recipe.id);
    if (!isRemoving) next.add(recipe.id);
    persistSaved(next);
    setToast({
      message: isRemoving ? `${recipe.title} removed from your saved list.` : `${recipe.title} saved for later.`,
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
  }

  async function copyMealList() {
    if (savedRecipes.length === 0) return;
    try {
      await copyText(formatMealList(savedRecipes));
      setToast({ message: "Meal list copied to your clipboard.", tone: "success" });
    } catch {
      setToast({ message: "The meal list could not be copied. Please check your browser permissions.", tone: "error" });
    }
  }

  return (
    <>
      <a className="skip-link" href="#recipe-explorer">Skip to recipe explorer</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top" aria-label="KitchenRx home">
            <span className="wordmark-mark" aria-hidden="true">K</span>
            <span>KitchenRx</span>
          </a>
          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#recipe-explorer">Recipes</a>
            <a href="#care-notes">Care notes</a>
            <a href="#about">About</a>
          </nav>
          <button
            className={`saved-header-button${savedOnly ? " is-active" : ""}`}
            type="button"
            aria-pressed={savedOnly}
            onClick={() => {
              setSavedOnly((value) => !value);
              document.querySelector("#recipe-explorer")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span aria-hidden="true">♡</span>
            Saved <span className="saved-count">{savedIds.size}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> A Yuriqa Lab prototype</p>
            <h1 id="hero-title">Food support for the day you actually have.</h1>
            <p className="hero-lede">
              KitchenRx helps you explore realistic meals by energy, ingredients, and everyday routines—without turning care into a clinical task.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#recipe-explorer">Explore the recipes <span aria-hidden="true">↓</span></a>
              <a className="text-link" href="#care-notes">Read the care approach <span aria-hidden="true">→</span></a>
            </div>
            <div className="hero-notices" aria-label="Important information">
              <p><strong>Food support, not medical advice.</strong> For medical or diet-specific needs, consult a qualified professional.</p>
              <p><strong>Private by design.</strong> This prototype runs locally in the browser. It does not collect or send personal data.</p>
            </div>
          </div>
          <div className="hero-board" aria-label="A sample of KitchenRx meal contexts">
            <div className="board-heading">
              <span>Today&apos;s care shelf</span>
              <span className="board-date">04 · SMALL STEPS</span>
            </div>
            <div className="board-card board-card-main">
              <p className="board-kicker">LOW-ENERGY LUNCH</p>
              <h2>Tofu, greens<br />&amp; rice soup</h2>
              <div className="board-meta"><span>18 min</span><span>one pot</span><span>flexible</span></div>
              <div className="bowl-illustration" aria-hidden="true"><span /><i /><b /></div>
            </div>
            <div className="board-grid">
              <div className="board-note"><span>01</span><p>Use what is already open.</p></div>
              <div className="board-note board-note-pink"><span>02</span><p>Leave fewer decisions for later.</p></div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="KitchenRx principles">
          <p>LOCAL SAMPLE RECIPES</p><span aria-hidden="true">✦</span>
          <p>NO ACCOUNT</p><span aria-hidden="true">✦</span>
          <p>NO TRACKING</p><span aria-hidden="true">✦</span>
          <p>CAREFUL LANGUAGE</p>
        </section>

        <section className="explorer section-shell" id="recipe-explorer" aria-labelledby="explorer-title">
          <div className="section-intro explorer-intro">
            <div>
              <p className="eyebrow"><span /> Recipe explorer</p>
              <h2 id="explorer-title">Start with what feels possible.</h2>
            </div>
            <p>Choose one or more practical contexts. Options within a group are matched broadly; groups work together to narrow the shelf.</p>
          </div>

          <div className="explorer-layout">
            <aside className="filter-panel" aria-label="Recipe filters">
              <div className="filter-panel-heading">
                <h3>Filter the shelf</h3>
                {(activeFilterCount > 0 || savedOnly) && <button className="clear-button" type="button" onClick={clearFilters}>Clear all</button>}
              </div>
              <FilterGroup<MealType>
                legend="Meal type"
                values={mealTypes}
                selected={filters.mealTypes}
                group="mealTypes"
                onToggle={toggleFilter}
              />
              <FilterGroup<CareContext>
                legend="Care context"
                values={careContexts}
                selected={filters.careContexts}
                group="careContexts"
                onToggle={toggleFilter}
              />
              <FilterGroup<IngredientFilter>
                legend="Available ingredient"
                values={ingredientFilters}
                selected={filters.ingredients}
                group="ingredients"
                onToggle={toggleFilter}
              />
              <label className="saved-toggle">
                <input type="checkbox" checked={savedOnly} onChange={(event) => setSavedOnly(event.target.checked)} />
                <span aria-hidden="true">♡</span>
                <span><strong>Saved recipes only</strong><small>{savedIds.size === 0 ? "Nothing saved yet" : `${savedIds.size} on your list`}</small></span>
              </label>
            </aside>

            <div className="results-area">
              <div className="results-toolbar">
                <p className="result-count" aria-live="polite"><strong>{visibleRecipes.length}</strong> {visibleRecipes.length === 1 ? "recipe" : "recipes"} on the shelf</p>
                {activeFilterCount > 0 && <p className="active-filter-note">{activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}</p>}
              </div>

              {visibleRecipes.length > 0 ? (
                <div className="recipe-grid">
                  {visibleRecipes.map((recipe, index) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
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
                  <h3>{savedOnly && savedIds.size === 0 ? "Your saved shelf is ready when you are." : "No recipes match this combination."}</h3>
                  <p>{savedOnly && savedIds.size === 0 ? "Save a recipe from the full shelf and it will stay on this device." : "Try removing one filter, or return to the full recipe shelf."}</p>
                  <button className="button button-secondary" type="button" onClick={clearFilters}>Show all recipes</button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="saved-plan section-shell" aria-labelledby="saved-title">
          <div className="saved-plan-card">
            <div>
              <p className="eyebrow eyebrow-light"><span /> Your meal list</p>
              <h2 id="saved-title">A small plan can be enough.</h2>
              <p>Save a few realistic options, then copy their titles as a simple list. Nothing leaves this browser.</p>
            </div>
            <div className="saved-plan-action">
              <p><strong>{savedIds.size}</strong> saved {savedIds.size === 1 ? "recipe" : "recipes"}</p>
              <button className="button button-cream" type="button" onClick={copyMealList} disabled={savedIds.size === 0} aria-describedby="copy-hint">Copy meal list</button>
              <small id="copy-hint">{savedIds.size === 0 ? "Save at least one recipe to copy a list." : "Copies recipe titles as plain text."}</small>
            </div>
          </div>
        </section>

        <section className="care-notes section-shell" id="care-notes" aria-labelledby="care-title">
          <div className="section-intro">
            <div>
              <p className="eyebrow"><span /> Care notes</p>
              <h2 id="care-title">Care often begins before cooking.</h2>
            </div>
            <p>Food support is also the work of making choices smaller, routines steadier, and shared meals easier to coordinate.</p>
          </div>
          <div className="notes-grid">
            <article><span>01</span><h3>Reduce the decision load</h3><p>Start with the energy and ingredients available today, not an ideal plan that asks for more.</p></article>
            <article><span>02</span><h3>Protect familiar routines</h3><p>Repeatable meals and flexible methods can help everyday food preparation feel more manageable.</p></article>
            <article><span>03</span><h3>Plan for the whole task</h3><p>Preparation, portioning, serving, and cleanup all shape whether a meal is genuinely practical.</p></article>
            <article><span>04</span><h3>Keep room for hospitality</h3><p>A useful digital tool can support a shared table without taking over the human choices around it.</p></article>
          </div>
        </section>

        <section className="about section-shell" id="about" aria-labelledby="about-title">
          <div className="about-card">
            <div className="about-mark" aria-hidden="true">YL</div>
            <div>
              <p className="eyebrow"><span /> Yuriqa Lab</p>
              <h2 id="about-title">A practical research prototype.</h2>
              <p>Yuriqa Lab explores the intersections of AI, care systems, hospitality, food systems, and human-centered interfaces. KitchenRx asks how thoughtful digital tools can translate hospitality knowledge into calmer everyday decisions.</p>
            </div>
            <p className="prototype-label">PROTOTYPE · V1<br />LOCAL-FIRST · 2026</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div><a className="wordmark footer-wordmark" href="#top"><span className="wordmark-mark" aria-hidden="true">K</span><span>KitchenRx</span></a><p>A care-oriented recipe and meal-support prototype by Yuriqa Lab.</p></div>
        <p className="footer-disclaimer">KitchenRx is a food-support prototype, not medical advice. For medical or diet-specific needs, consult a qualified professional.</p>
        <p className="footer-meta">No backend · No login · No data collection</p>
      </footer>

      {selectedRecipe && (
        <RecipeDialog recipe={selectedRecipe} saved={savedIds.has(selectedRecipe.id)} onSave={() => toggleSaved(selectedRecipe)} onClose={() => setSelectedRecipe(null)} />
      )}

      {toast && <div className={`toast toast-${toast.tone}`} role={toast.tone === "error" ? "alert" : "status"}>{toast.message}</div>}
    </>
  );
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
  onToggle: <K extends keyof FilterState>(group: K, value: FilterState[K][number]) => void;
}

function FilterGroup<T extends MealType | CareContext | IngredientFilter>({ legend, values, selected, group, onToggle }: FilterGroupProps<T>) {
  return (
    <fieldset className="filter-group">
      <legend>{legend}</legend>
      <div className="filter-options">
        {values.map((value) => (
          <label className="filter-chip" key={value}>
            <input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(group, value as never)} />
            <span>{value}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RecipeCard({ recipe, index, saved, onSave, onOpen }: { recipe: Recipe; index: number; saved: boolean; onSave: () => void; onOpen: () => void }) {
  return (
    <article className="recipe-card">
      <div className={`recipe-visual accent-${recipe.accent}`}>
        <span className="recipe-number">{String(index).padStart(2, "0")}</span>
        <span className="recipe-meal-type">{recipe.mealType}</span>
        <div className="plate-mark" aria-hidden="true"><i /><b /><span /></div>
      </div>
      <div className="recipe-card-body">
        <div className="recipe-time"><span aria-hidden="true">◷</span> {recipe.prepMinutes} min <span>·</span> {recipe.careContexts[0]}</div>
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
        <div className="tag-row" aria-label="Recipe contexts">
          {recipe.careContexts.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="recipe-card-actions">
          <button className="recipe-open" type="button" onClick={onOpen}>View recipe <span aria-hidden="true">→</span></button>
          <button className={`save-button${saved ? " is-saved" : ""}`} type="button" onClick={onSave} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${recipe.title}`}><span aria-hidden="true">{saved ? "♥" : "♡"}</span></button>
        </div>
      </div>
    </article>
  );
}

function RecipeDialog({ recipe, saved, onSave, onClose }: { recipe: Recipe; saved: boolean; onSave: () => void; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
        <button className="dialog-close" type="button" onClick={onClose} ref={closeButtonRef} aria-label="Close recipe details">×</button>
        <div className={`dialog-visual accent-${recipe.accent}`}><span>{recipe.mealType}</span><div className="plate-mark plate-mark-large" aria-hidden="true"><i /><b /><span /></div></div>
        <div className="dialog-content">
          <p className="eyebrow"><span /> {recipe.prepMinutes} minutes · {recipe.careContexts[0]}</p>
          <h2 id="dialog-title">{recipe.title}</h2>
          <p className="dialog-description" id="dialog-description">{recipe.description}</p>
          <div className="dialog-columns">
            <div><h3>Ingredients</h3><ul>{recipe.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul></div>
            <div><h3>Preparation</h3><ol>{recipe.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
          </div>
          <div className="why-note"><p className="why-label">Why this may help</p><p>{recipe.whyItMayHelp}</p><small>Practical food-support context only — not medical advice.</small></div>
          <div className="dialog-footer">
            <div className="tag-row">{recipe.featuredIngredients.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <button className={`button ${saved ? "button-secondary" : "button-primary"}`} type="button" onClick={onSave}>{saved ? "Remove from saved" : "Save for later"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
