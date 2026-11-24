# Game research packages

Each game is a self-contained content package:

```text
{three-digit-id}-{game-slug}/
  game.md
  {slug}-nintendo-switch-eshop-cover.jpg
  {slug}-nintendo-switch-eshop-cover.webp
  {slug}-nintendo-switch-2-eshop-cover.webp
```

`game.md` must use the frontmatter schema in `src/content.config.ts`. `image_file` is the cover filename. Astro validates it during the build. The cover is reused on the game detail page, directory thumbnail, and social metadata.

The public directory's editorial data in `src/data/games.ts` remains the fallback and supplies the site-specific playstyle, run-length, and recommendation fields.
