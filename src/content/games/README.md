# Game research packages

Each game is a self-contained content package:

```text
{three-digit-id}-{game-slug}/
  game.md
  cover.jpg | cover.png | cover.webp
```

`game.md` must use the frontmatter schema in `src/content.config.ts`. Astro validates it during the build. The cover is automatically reused on the game detail page, directory thumbnail, and social metadata. Put new researcher output directly in this folder; no code changes are required for a matching directory game.

The public directory's editorial data in `src/data/games.ts` remains the fallback and supplies the site-specific playstyle, run-length, and recommendation fields. Release dates and console support (Switch, Switch 2) live only in `games.ts`.

Directory games without a package can still have a cover: save Nintendo's US eShop art as `src/assets/covers/{site-slug}.webp` (1200x675).
