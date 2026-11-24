#!/usr/bin/env node
// Internal link graph for this Astro directory.
// Usage:
//   node scripts/internal-link-graph.mjs --legacy > seo/internal-link-graph.before.json
//   node scripts/internal-link-graph.mjs > seo/internal-link-graph.json
//
// Header, footer, and breadcrumb links are sitewide chrome. They are not contextual.
// Money pages are the buying guides, genre hubs, feature hubs, collections, and /games/.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const SITE = (process.env.SITE ?? 'https://switchroguelikes.com').replace(/\/+$/, '');
const legacy = process.argv.includes('--legacy');

const slugify = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');

function parseGames() {
  const text = readFileSync('src/data/games.ts', 'utf8');
  const start = text.indexOf('const seed');
  const end = text.indexOf('export const games');
  const seed = text.slice(start, end);
  const chunks = seed.split(/\n  \{/).slice(1);
  return chunks.map((chunk) => {
    const pick = (key) => {
      const match = chunk.match(new RegExp(`${key}: '([^']*)'`));
      return match ? match[1] : '';
    };
    const title = pick('title');
    return {
      title,
      slug: slugify(title),
      playstyle: pick('playstyle'),
      genre: pick('genre'),
      classification: pick('classification'),
      runLength: pick('runLength'),
      price: pick('price'),
      coOp: pick('coOp'),
      difficulty: pick('difficulty'),
      platform: pick('platform') || 'Nintendo Switch',
    };
  });
}

function walk(dir, out = []) {
  let names;
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (name === 'game.md') out.push(path);
  }
  return out;
}

function markdownLinks() {
  const inbound = new Map();
  for (const file of walk('src/content/games')) {
    const text = readFileSync(file, 'utf8');
    const slug = text.match(/^slug:\s*"([^"]+)"/m)?.[1];
    if (!slug) continue;
    const from = `/games/${slug}/`;
    for (const match of text.matchAll(/\]\((\/[^)\s"'#?]*)/g)) {
      const to = match[1].replace(/\/+$/, '/') ;
      const normalized = to.length > 1 ? to.replace(/\/+$/, '') + '/' : to;
      if (normalized === from) continue;
      (inbound.get(normalized) ?? inbound.set(normalized, new Set()).get(normalized)).add(from);
    }
  }
  return inbound;
}

function add(inbound, from, to) {
  const target = to.length > 1 ? to.replace(/\/+$/, '') + (to.endsWith('/') ? '/' : '/') : to;
  const source = from.length > 1 ? from.replace(/\/+$/, '') + '/' : from;
  if (target === source) return;
  (inbound.get(target) ?? inbound.set(target, new Set()).get(target)).add(source);
}

function legacyLinks(games, inbound) {
  const guideSlugs = [
    'best-roguelikes-on-nintendo-switch',
    'best-roguelites-for-beginners',
    'best-deckbuilding-roguelikes',
    'best-co-op-roguelites',
    'best-roguelikes-for-short-sessions',
    'best-hidden-gems-under-20',
  ];
  const genres = [
    ['action', 'Action'],
    ['cards', 'Cards'],
    ['tactics', 'Tactics'],
    ['shooter', 'Shooter'],
    ['co-op', 'Co-op'],
  ];
  for (const [slug] of genres) add(inbound, '/', `/genre/${slug}/`);
  for (const slug of guideSlugs.slice(0, 3)) add(inbound, '/', `/best/${slug}/`);
  for (const game of games.slice(0, 5)) add(inbound, '/', `/games/${game.slug}/`);
  for (const slug of guideSlugs) {
    for (const game of games.slice(0, 6)) add(inbound, `/best/${slug}/`, `/games/${game.slug}/`);
  }
  for (const [slug, playstyle] of genres) {
    for (const game of games.filter((game) => game.playstyle === playstyle)) {
      add(inbound, `/genre/${slug}/`, `/games/${game.slug}/`);
    }
  }
  for (const game of games.filter((game) => game.coOp === 'Local')) {
    add(inbound, '/features/local-co-op/', `/games/${game.slug}/`);
  }
  for (const game of games.slice(0, 9)) {
    add(inbound, '/features/short-runs/', `/games/${game.slug}/`);
    add(inbound, '/features/offline-play/', `/games/${game.slug}/`);
  }
  const priceOf = (game) => Number(game.price.replace(/[^0-9.]/g, ''));
  for (const game of games.filter((game) => priceOf(game) < 20)) {
    add(inbound, '/collections/under-20/', `/games/${game.slug}/`);
  }
  for (const game of games.slice(10, 20)) add(inbound, '/collections/hidden-gems/', `/games/${game.slug}/`);
  for (const game of games) {
    const related = games.filter((item) => item.playstyle === game.playstyle && item.slug !== game.slug).slice(0, 3);
    for (const item of related) add(inbound, `/games/${game.slug}/`, `/games/${item.slug}/`);
  }
}

const MONEY = /^\/(games\/$|best\/|genre\/|features\/|collections\/)/;

const GUIDE_SLUGS = [
  'best-roguelikes-on-nintendo-switch',
  'best-roguelites-for-beginners',
  'best-deckbuilding-roguelikes',
  'best-co-op-roguelites',
  'best-roguelikes-for-short-sessions',
  'best-hidden-gems-under-20',
];
const GENRE_SLUGS = ['action', 'cards', 'tactics', 'shooter', 'co-op'];
const FEATURE_SLUGS = ['local-co-op', 'short-runs', 'offline-play'];
const COLLECTION_SLUGS = ['hidden-gems', 'under-20'];

function knownRoutes(games) {
  return [
    '/',
    '/games/',
    ...games.map((game) => `/games/${game.slug}/`),
    ...GUIDE_SLUGS.map((slug) => `/best/${slug}/`),
    ...GENRE_SLUGS.map((slug) => `/genre/${slug}/`),
    ...FEATURE_SLUGS.map((slug) => `/features/${slug}/`),
    ...COLLECTION_SLUGS.map((slug) => `/collections/${slug}/`),
  ];
}

function report(inbound, games, extra = {}) {
  const pages = new Map();
  const remember = (route) => {
    if (!pages.has(route)) pages.set(route, { route, contextualInbound: 0, linkedFrom: [] });
  };
  for (const route of knownRoutes(games)) remember(route);
  for (const [route, sources] of inbound) {
    remember(route);
    const row = pages.get(route);
    row.contextualInbound = sources.size;
    row.linkedFrom = [...sources].sort();
  }
  const rows = [...pages.values()]
    .map((row) => ({ ...row, money: MONEY.test(row.route) }))
    .sort((a, b) => a.contextualInbound - b.contextualInbound || a.route.localeCompare(b.route));
  const orphans = rows.filter((row) => row.money && row.contextualInbound < 3).map((row) => row.route);
  return {
    generatedAt: new Date().toISOString(),
    site: SITE,
    mode: legacy ? 'legacy' : 'current',
    note: 'Header, footer, and breadcrumb links are excluded. Counts are contextual body links only.',
    orphanMoneyPages: orphans,
    pages: rows,
    ...extra,
  };
}

const games = parseGames();
const inbound = markdownLinks();

if (legacy) {
  legacyLinks(games, inbound);
  console.log(JSON.stringify(report(inbound, games), null, 2));
} else {
  const hubs = await import(pathToFileURL(join(process.cwd(), 'src/lib/hubs.mjs')).href);
  const links = hubs.editorialLinks(games);
  for (const link of links) add(inbound, link.from, link.to);
  const anchorCounts = new Map();
  for (const link of links) {
    if (!link.anchor || link.slot === 'related' || link.slot === 'pick') continue;
    anchorCounts.set(link.anchor, (anchorCounts.get(link.anchor) ?? 0) + 1);
  }
  const overused = [...anchorCounts.entries()].filter(([, count]) => count > 3);
  if (overused.length) {
    console.error('Anchors reused more than 3 times:');
    for (const [anchor, count] of overused) console.error(`  ${count}  ${anchor}`);
    process.exit(1);
  }
  console.log(JSON.stringify(report(inbound, games, {
    editorialLinkCount: links.length,
    moneyAnchorCount: anchorCounts.size,
  }), null, 2));
}
