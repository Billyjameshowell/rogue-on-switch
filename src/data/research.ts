import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { coverFileName } from '../lib/hubs.mjs';
import { games, type Game } from './games';

export type ResearchGame = CollectionEntry<'games'>;
// Every directory game can have a cover. Research packages keep theirs in the package folder;
// games without a package use src/assets/covers/{site-slug}.webp. All are Nintendo US eShop art.
export type GameAsset = { entry?: ResearchGame; cover?: ImageMetadata };

const packageCovers = import.meta.glob('../content/games/**/*-eshop-cover.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, ImageMetadata>;

const directoryCovers = import.meta.glob('../assets/covers/*-eshop-cover.webp', {
  eager: true,
  import: 'default',
}) as Record<string, ImageMetadata>;

// Research has two intentional edition names that differ from the public directory.
const researchAliases: Record<string, string> = {
  'the-binding-of-isaac-repentance': 'the-binding-of-isaac-afterbirth-plus',
  'monster-train': 'monster-train-first-class',
};

export async function getResearchBySiteSlug() {
  const entries = await getCollection('games');
  const byResearchSlug = new Map(entries.map((entry) => [entry.data.slug, entry]));
  return new Map(games.flatMap((game) => {
    const entry = byResearchSlug.get(researchAliases[game.slug] ?? game.slug);
    return entry ? [[game.slug, entry] as const] : [];
  }));
}

export async function getGameAssetsBySiteSlug() {
  const researchBySiteSlug = await getResearchBySiteSlug();

  return new Map<string, GameAsset>(
    games.map((game) => {
      const entry = researchBySiteSlug.get(game.slug);
      const cover = entry
        ? Object.entries(packageCovers).find(([path]) => path.endsWith(`/${entry.data.image_file}`))?.[1]
        : directoryCovers[`../assets/covers/${coverFileName(game.slug, game.platform, 'webp')}`];
      return [game.slug, { entry, cover }];
    }),
  );
}

export function researchFacts(game: Game, research?: ResearchGame) {
  if (!research) return null;
  return {
    ...game,
    title: research.data.name,
    summary: research.data.short_description,
    price: `$${research.data.price_usd.toFixed(2)}`,
    genre: research.data.genres.join(', '),
    sourceUrl: research.data.nintendo_switch_url,
    lastChecked: research.data.last_verified,
  };
}
