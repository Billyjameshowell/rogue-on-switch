import type { APIRoute } from 'astro';
import { games } from '../data/games';
import { collections, features, genres, guides } from '../lib/hubs.mjs';
import { siteOrigin } from '../lib/site';

export const GET: APIRoute = () => {
  const urls = [
    '',
    'games/',
    ...games.map((game) => `games/${game.slug}/`),
    ...guides.map((guide) => `best/${guide.slug}/`),
    ...genres.map((genre) => `genre/${genre.slug}/`),
    ...features.map((feature) => `features/${feature.slug}/`),
    ...collections.map((collection) => `collections/${collection.slug}/`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map((path) => `<url><loc>${siteOrigin}/${path}</loc></url>`)
    .join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
