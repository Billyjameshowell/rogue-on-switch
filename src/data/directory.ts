import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { games, type Game } from './games';

export type ResearchGame = CollectionEntry<'games'>;

/** One directory game with its research package (when written) folded into its facts, plus its cover. */
export type DirectoryGame = Game & { sourceUrl: string; lastChecked: string; research?: ResearchGame; cover?: ImageMetadata };

// Every cover is Nintendo US eShop art. Research packages keep theirs in the package folder;
// games without a package use src/assets/covers/{site-slug}.webp.
const packageCovers = import.meta.glob('../content/games/**/cover.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }) as Record<string, ImageMetadata>;
const directoryCovers = import.meta.glob('../assets/covers/*.webp', { eager: true, import: 'default' }) as Record<string, ImageMetadata>;

// Research has two intentional edition names that differ from the public directory.
const researchAliases: Record<string, string> = {
  'the-binding-of-isaac-repentance': 'the-binding-of-isaac-afterbirth-plus',
  'monster-train': 'monster-train-first-class',
};

function withResearch(game: Game, research?: ResearchGame): DirectoryGame {
  if (research) {
    const { data } = research;
    return {
      ...game,
      title: data.name,
      summary: data.short_description,
      price: `$${data.price_usd.toFixed(2)}`,
      genre: data.genres.join(', '),
      sourceUrl: data.nintendo_switch_url,
      lastChecked: data.last_verified,
      research,
      cover: Object.entries(packageCovers).find(([path]) => path.includes(`/${data.id}-`))?.[1],
    };
  }
  if (!game.sourceUrl || !game.lastChecked) throw new Error(`${game.title} needs a research package or a sourceUrl and lastChecked in games.ts`);
  return { ...game, sourceUrl: game.sourceUrl, lastChecked: game.lastChecked, cover: directoryCovers[`../assets/covers/${game.slug}.webp`] };
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Genre tags plus the classification, each listed once, for the directory table. */
export const genreLine = ({ genre, classification }: DirectoryGame) =>
  [...new Map([...genre.split(', '), classification].map((tag) => [tag.toLowerCase(), capitalize(tag)])).values()].join(', ');

let directory: Promise<DirectoryGame[]> | undefined;

/** The whole directory in editorial order. Built once per build and shared by every page. */
export function getDirectory() {
  directory ??= getCollection('games').then((entries) => {
    const bySlug = new Map(entries.map((entry) => [entry.data.slug, entry]));
    return games.map((game) => withResearch(game, bySlug.get(researchAliases[game.slug] ?? game.slug)));
  });
  return directory;
}
