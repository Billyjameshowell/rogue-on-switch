import type { APIRoute } from 'astro';
import { games } from '../data/games';
import { collections, features, guides, playstyles } from '../data/hubs';
import { siteOrigin } from '../lib/site';

export const GET: APIRoute = () => {
  const paths = [
    '',
    'games/',
    ...games.map((game) => `games/${game.slug}/`),
    ...guides.map((hub) => `best/${hub.slug}/`),
    ...playstyles.map((style) => `genre/${style.slug}/`),
    ...features.map((hub) => `features/${hub.slug}/`),
    ...collections.map((hub) => `collections/${hub.slug}/`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${siteOrigin}/${path}</loc></url>`).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
