import type { APIRoute } from 'astro';
import { games } from '../data/games';
import { collections, features, genres, guides } from '../lib/hubs.mjs';
import { siteOrigin } from '../lib/site';

export const GET: APIRoute = () => {
  const lines = [
    '# Rogue On Switch',
    '',
    'Independent directory of roguelikes and roguelites on Nintendo Switch.',
    `Games in the directory: ${games.length}`,
    '',
    '## Guides',
    ...guides.map((guide) => `- [${guide.h1}](${siteOrigin}/best/${guide.slug}/)`),
    '',
    '## Genres',
    ...genres.map((genre) => `- [${genre.h1}](${siteOrigin}/genre/${genre.slug}/)`),
    '',
    '## Features',
    ...features.map((feature) => `- [${feature.h1}](${siteOrigin}/features/${feature.slug}/)`),
    '',
    '## Collections',
    ...collections.map((collection) => `- [${collection.h1}](${siteOrigin}/collections/${collection.slug}/)`),
    '',
    '## Games',
    ...games.map((game) => `- [${game.title}](${siteOrigin}/games/${game.slug}/)`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
