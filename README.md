# KitchenRx

KitchenRx is a care-oriented recipe and meal-support prototype by Yuriqa Lab. It helps people explore realistic meal ideas using practical contexts such as available energy, meal type, preparation effort, and ingredients already on hand.

This is a frontend-only portfolio prototype, not a production medical service.

## Why it exists

Food preparation is more than a recipe. It also includes deciding what feels possible, coordinating a shared meal, planning for cleanup, and protecting familiar routines. KitchenRx explores how hospitality knowledge and human-centered interface design can make those everyday decisions calmer and more manageable.

## Features

- 12 original, locally stored sample recipes
- Meal type, care context, and ingredient filters
- Combined filters, result counts, clear-all controls, and an empty state
- Accessible recipe details with ingredients, preparation steps, and careful practical notes
- Save-for-later support stored only in the browser with safe malformed-data handling
- A saved-only recipe view
- Plain-text meal-list copying with success and error feedback
- Responsive layouts, visible focus states, reduced-motion support, and keyboard-friendly controls
- Visible privacy and non-medical disclaimers

## Tech stack

- React 19
- TypeScript
- Vite through the lightweight Vinext application runtime
- Next-compatible App Router components
- Plain CSS
- Node.js built-in test runner
- `localStorage` for device-local saved recipe IDs

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
  data/             Original local recipe collection
  lib/              Filtering, persistence parsing, and list formatting logic
  types/            Shared recipe and filter types
  globals.css       Complete visual system and responsive styles
  layout.tsx        Metadata and document shell
  page.tsx          Application entry point
public/              Social preview asset
tests/               Logic and rendered-output checks
worker/              Static application runtime entry
```

## Privacy

KitchenRx runs locally in the browser. It does not collect or send personal data, health data, or browsing behavior. Saved recipe IDs remain in the current browser through `localStorage` and can be removed by unsaving recipes or clearing site storage.

## Non-medical disclaimer

**KitchenRx is a food-support prototype, not medical advice. For medical or diet-specific needs, consult a qualified professional.**

Recipe contexts such as “gentle meal,” “high protein,” and “low energy” describe practical meal-planning situations only. They are not diagnoses, treatments, or health-outcome claims.

## Yuriqa Lab connection

Yuriqa Lab explores practical intersections between AI, care systems, hospitality, food systems, and human-centered interfaces. KitchenRx is an experiment in translating those themes into a quiet, useful decision-support interface.

## Project status

KitchenRx is a scoped v1 prototype and portfolio project. Its recipe collection is intentionally small, local, and illustrative. It has not undergone clinical validation and is not intended for medical use.

## Future improvements

- Richer original recipe collections
- More flexible ingredient matching
- Improved meal-plan organization and printable lists
- Multilingual support
- Formal accessibility and usability testing
- Optional offline-first support

## Screenshots

Screenshots can be added here in a future release. No screenshot files are included in v1.

## License

Released under the MIT License. See [LICENSE](LICENSE).
