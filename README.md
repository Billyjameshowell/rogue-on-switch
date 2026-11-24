# Rogue On Switch

Source for [switchroguelikes.com](https://switchroguelikes.com), an independent directory of roguelikes and roguelites on Nintendo Switch. It is a static Astro site.

## Commands

Astro needs Node 22.23.4 or newer. CI uses Node 24.

| Command | What it does |
| :-- | :-- |
| `npm ci` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run check` | Type-check Astro and TypeScript files |
| `npm run build` | Build the site into `dist/` |
| `npm run check:urls` | Confirm the build points at `https://switchroguelikes.com` |
| `npm run visual-review` | Capture desktop and 390px screenshots of a running preview |

## Where things live

- `src/data/games.ts` holds every directory game: facts, release date, consoles and any written editorial. A game without a summary gets one built from its facts.
- `src/content/games/NNN-slug/` holds research packages (`game.md` plus the eShop cover). `src/data/directory.ts` folds a package's facts into its game.
- `src/assets/covers/{slug}.webp` holds eShop covers for games without a research package.
- `src/data/hubs.ts` defines the genre, best-of, feature and collection pages, and the sitemap reads the same lists.
- `internal/` holds private notes that are never imported into the site.

## Deploys

Every push to `main` runs `.github/workflows/astro.yml`, which type-checks, builds, runs the URL check and publishes to GitHub Pages. Pull requests run `visual-review.yml` and post screenshots.
