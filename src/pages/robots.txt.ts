import type { APIRoute } from 'astro';
import { siteOrigin } from '../lib/site';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap-index.xml\n`);
