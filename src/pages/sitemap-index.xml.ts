import type { APIRoute } from 'astro';
import { games, guideTopics } from '../data/games';
import { siteOrigin } from '../lib/site';

export const GET: APIRoute = () => {
  const urls = [
    '',
    'games/',
    ...games.map((g) => `games/${g.slug}/`),
    ...guideTopics.map(([slug]) => `best/${slug}/`),
    'genre/action/',
    'genre/cards/',
    'genre/tactics/',
    'genre/shooter/',
    'genre/co-op/',
    'features/local-co-op/',
    'features/short-runs/',
    'features/offline-play/',
    'collections/hidden-gems/',
    'collections/under-20/',
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map((path) => `<url><loc>${siteOrigin}/${path}</loc></url>`)
    .join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
