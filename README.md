# KitchenRx

KitchenRx is a bilingual, care-oriented recipe and meal-support prototype by Yuriqa Lab. It helps people explore realistic meal ideas using practical contexts such as available energy, meal type, preparation effort, ingredients already on hand, and food-based nutrient context.

This is a browser-focused portfolio prototype with no application data backend, not a production medical service.

**Live demo:** [KitchenRx v3](https://kitchenrx-yuriqa-lab.lny-soul-bond.chatgpt.site/)

## Why it exists

Food preparation is more than a recipe. It also includes deciding what feels possible, coordinating a shared meal, planning for cleanup, and protecting familiar routines. KitchenRx explores how hospitality knowledge and human-centered interface design can make those everyday decisions calmer and more manageable.

## Features

- Complete Japanese and English interface and recipe switching without a page reload
- 27 locally stored recipes written for this prototype, with bilingual titles, descriptions, ingredients, steps, and practical notes
- Meal type, care context, ingredient, and saved-recipe filters
- Four food-context nutrient filters: lutein, zeaxanthin, vitamin E, and omega-3 fatty acids
- Typed links between highlighted ingredients, related nutrients, recipes, and named public sources
- Evidence strips on relevant recipe cards and an in-context route from each nutrient to matching recipes
- Accessible recipe details with ingredient rationale, public-source links, a food-information disclaimer, ingredients, preparation steps, and careful practical notes
- Save-for-later support stored only in the browser with safe malformed-data handling
- Language changes preserve active filters, saved recipes, and the open recipe
- A separately stored language preference, browser-language detection on first visit, and English fallback
- A saved-only recipe view
- Localized plain-text meal-list copying with success and error feedback
- Responsive layouts, visible focus states, reduced-motion support, and keyboard-friendly controls
- Visible privacy and non-medical disclaimers

## 90-second demo path

1. Select one of the four nutrient chips.
2. Review the food-context explanation, related ingredient, public sources, and matching-recipe count.
3. Choose **Related recipes / 関連レシピを見る**.
4. Inspect the nutrient evidence strip on the matching recipe card.
5. Open the recipe to see why the ingredient is included, then optionally save it to the meal list.

## Evidence and culinary review

KitchenRx keeps two trust signals separate:

- **Nutrition context:** named public sources support the displayed food-and-nutrient relationships. Source names and links are stored alongside the relevant bilingual content.
- **Culinary review:** recipe design and cooking steps are reviewed by the developer, a licensed cook and confectionery hygienist in Japan.

The culinary credentials are not presented as medical, dietetic, or nutrition-science credentials and are not used as evidence for health outcomes. KitchenRx does not claim to diagnose, treat, prevent, cure, or manage a condition, and it does not claim to improve or restore vision. It provides food and meal-planning information only and does not give supplement instructions.

## Tech stack

- React 19
- TypeScript
- Vite through the lightweight Vinext application runtime
- Next.js App Router components, built through the lightweight Vinext runtime
- Plain CSS
- Node.js built-in test runner
- `localStorage` for device-local saved recipe IDs and the independent language preference

No backend, authentication, database, external recipe API, analytics, tracking, or personal-data collection is used.

## Local development

Node.js 22.13 or newer is recommended.

```bash
npm install
npm run dev
```

Open the local address shown in the terminal.

## Production build

```bash
npm run build
```

Additional checks:

```bash
npm run typecheck
npm run lint
npm run test:logic
npm test
```

## Project structure

```text
app/
  components/       Interactive application and recipe detail UI
  data/             Stable recipe data with localized content
  i18n/             Japanese and English interface translations
  lib/              Filtering, localization, persistence parsing, and list formatting logic
  types/            Shared recipe and filter types
  globals.css       Complete visual system and responsive styles
  layout.tsx        Metadata and document shell
  page.tsx          Application entry point
public/              Social preview asset
docs/screenshots/    Current README screenshots
tests/               Logic and rendered-output checks
worker/              Static application runtime entry
```

## Privacy

KitchenRx runs locally in the browser. It does not collect or send personal data, health data, or browsing behavior. Saved recipe IDs remain in the current browser under `kitchenrx:saved-recipes:v1`. The independent language preference is stored under `kitchenrx:language:v1`. Both can be removed by clearing site storage.

## Non-medical disclaimer

**KitchenRx is a food-support prototype, not medical advice. For medical or diet-specific needs, consult a qualified professional.**

Recipe contexts such as “gentle meal,” “high protein,” and “low energy” describe practical meal-planning situations only. They are not diagnoses, treatments, or health-outcome claims.

## Yuriqa Lab connection

Yuriqa Lab explores practical intersections between AI, care systems, hospitality, food systems, and human-centered interfaces. KitchenRx is an experiment in translating those themes into a quiet, useful decision-support interface.

## OpenAI Build Week development

The recoverable pre-Build Week release is preserved at tag `build-week-baseline-v1.1`, commit `f7cca4a436b20b05a8e045335f524309ffca5589`. Build Week work continues on `build-week-amd`; it is not merged into `main` in this phase.

Codex accelerated implementation, bilingual data integration, testing, privacy review, screenshot production, and release documentation. GPT-5.6 was used for product-model design, claim-safety reasoning, Japanese and English copy review, interface review, and diff review. Yuriqa retained the product decisions, scope, evidence boundaries, and final review. See [BUILD_WEEK.md](BUILD_WEEK.md) for the public development record and source list.

## Project status

KitchenRx is a scoped bilingual portfolio prototype with 27 recipes written for this prototype. Its recipe collection remains local and illustrative. It has not undergone clinical validation and is not intended for medical use.

## Future improvements

- Broader recipe collections
- More flexible ingredient matching
- Improved meal-plan organization and printable lists
- Additional languages beyond Japanese and English
- Formal accessibility and usability testing
- Optional offline-first support

## Screenshots

### English overview and trust information

![KitchenRx English desktop overview showing the new meal-support hero image, purpose, privacy and non-medical notes, and the developer's culinary credentials](docs/screenshots/kitchenrx-hero-en.jpg)

### Nutrient discovery and matching recipes

<p align="center">
  <img src="docs/screenshots/kitchenrx-nutrient-guide-en.jpg" alt="KitchenRx English food-context guide showing all four nutrient chips, lutein information, public sources, disclaimer, matching-recipe count, and View related recipes button" width="49%">
  <img src="docs/screenshots/kitchenrx-nutrient-results-en.jpg" alt="KitchenRx English recipe results filtered to lutein, showing three matching image cards and their nutrient evidence strips" width="49%">
</p>

### Evidence-aware recipe detail

![KitchenRx English salmon recipe detail showing why the ingredient is included, related nutrient sources, disclaimer, ingredients, and preparation steps](docs/screenshots/kitchenrx-salmon-recipe-detail-en.jpg)

### Mobile saved recipes and meal list

<p align="center">
  <img src="docs/screenshots/kitchenrx-mobile-meal-list-en.jpg" alt="KitchenRx English mobile meal-list section showing two saved recipes and the plain-text copy action without horizontal overflow" width="390">
</p>

## License

Released under the MIT License. See [LICENSE](LICENSE).
