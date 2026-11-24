/** Directory SEO: one source for titles, list membership, and contextual anchors. */

export function plain(value) {
  return String(value ?? '')
    .replaceAll('\u2013', '-')
    .replaceAll('\u2014', ', ')
    .replaceAll('\u2018', "'")
    .replaceAll('\u2019', "'")
    .replaceAll('\u201c', '"')
    .replaceAll('\u201d', '"');
}

export function platformName(game) {
  return game.platform === 'Nintendo Switch 2' ? 'Nintendo Switch 2' : 'Nintendo Switch';
}

export function documentTitle(h1) {
  return `${h1} | Rogue On Switch`;
}

export function gameH1(game) {
  return `${game.title} on ${platformName(game)}`;
}

export function priceNumber(game) {
  const price = Number(String(game.price).replace(/[^0-9.]/g, ''));
  return Number.isFinite(price) ? price : null;
}

export function lowerMinutes(game) {
  const text = plain(game.runLength).toLowerCase();
  if (text.includes('hour')) return null;
  const match = text.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

export function coverFileName(slug, platform, ext) {
  const label = platform === 'Nintendo Switch 2' ? 'nintendo-switch-2' : 'nintendo-switch';
  return `${slug}-${label}-eshop-cover.${ext}`;
}

export function coverAlt(game) {
  const platform = platformName(game);
  const run = plain(game.runLength);
  const genre = plain(game.genre).toLowerCase();
  const classification = game.classification.toLowerCase();
  const kind = genre.includes(classification) ? genre : `${classification} ${genre}`;
  const article = /^[aeiou]/i.test(kind) ? 'an' : 'a';
  let alt = `Official Nintendo eShop cover art for ${game.title} on ${platform}, ${article} ${kind} with runs of ${run}.`;
  if (alt.length < 80) {
    alt = `Official Nintendo eShop cover art for ${game.title} on ${platform}, ${article} ${kind} with runs of ${run} and a regular US price of ${game.price}.`;
  }
  if (alt.length > 160) alt = `Official Nintendo eShop cover art for ${game.title} on ${platform}, ${article} ${kind}.`;
  if (alt.length > 160) alt = `Nintendo eShop cover art for ${game.title} on ${platform}.`;
  return alt;
}

export function fallbackCopy(game) {
  const platform = platformName(game);
  const run = plain(game.runLength);
  const kind = `${game.classification.toLowerCase()} ${plain(game.genre).toLowerCase()}`;
  const article = /^[aeiou]/i.test(kind) ? 'an' : 'a';
  const coop = game.coOp === 'No'
    ? 'Single-player only.'
    : game.coOp === 'Local'
      ? 'Local co-op is supported.'
      : game.coOp === 'Online'
        ? 'Online co-op is supported.'
        : `Co-op on the listing: ${plain(game.coOp)}.`;
  return {
    summary: `${game.title} is ${article} ${kind} on ${platform}. A typical run is ${run}, and the regular US price is ${game.price}. ${coop}`,
    bestFor: `${game.playstyle} players who want a ${game.classification.toLowerCase()} with ${run} runs at ${plain(game.difficulty).toLowerCase()} difficulty.`,
    skipIf: game.coOp === 'No'
      ? `You want co-op, or you need a run length outside ${run}.`
      : `You want a strictly single-player game, or you need a run length outside ${run}.`,
    progression: game.classification === 'Roguelike'
      ? 'A lost run starts over. What you keep is your knowledge of the systems.'
      : game.classification === 'Hybrid'
        ? 'Some of the loop resets each run and some of it stays. The Nintendo listing is the source for which is which.'
        : 'Upgrades you buy between runs stay with you, so a failed run can still leave the next one stronger.',
    switchNotes: `This ${platform} note is only the directory record. Confirm the current build on the Nintendo listing before you buy.`,
  };
}

const FLAGSHIP = ['hades', 'dead-cells', 'slay-the-spire', 'balatro', 'into-the-breach', 'enter-the-gungeon'];

const HOUSEHOLD = new Set([
  'hades',
  'dead-cells',
  'slay-the-spire',
  'balatro',
  'vampire-survivors',
  'enter-the-gungeon',
  'the-binding-of-isaac-repentance',
  'spelunky-2',
  'into-the-breach',
  'cult-of-the-lamb',
]);

const isBeginner = (game) => /^easy\b/i.test(game.difficulty);
const isDeckbuilder = (game) => game.playstyle === 'Cards' || /deck/i.test(game.genre);
const isLocalCoop = (game) => /local/i.test(game.coOp);
const isCoop = (game) => game.coOp !== 'No';
const isVeryShort = (game) => {
  const mins = lowerMinutes(game);
  return mins !== null && mins <= 20;
};
const isShortRun = (game) => {
  const mins = lowerMinutes(game);
  return mins !== null && mins <= 25;
};
const isUnder20 = (game) => {
  const price = priceNumber(game);
  return price !== null && price < 20;
};
const isHiddenGem = (game) => isUnder20(game) && !HOUSEHOLD.has(game.slug);

function byPrice(a, b) {
  const left = priceNumber(a) ?? 999;
  const right = priceNumber(b) ?? 999;
  return left-right || a.title.localeCompare(b.title);
}

function byRun(a, b) {
  const left = lowerMinutes(a) ?? 999;
  const right = lowerMinutes(b) ?? 999;
  return left-right || a.title.localeCompare(b.title);
}

export const guides = [
  {
    slug: 'best-roguelikes-on-nintendo-switch',
    h1: 'Best roguelikes on Nintendo Switch',
    description: 'A starter list of roguelikes and roguelites on Nintendo Switch, with one or two games for action, cards, tactics, and shooters.',
    question: 'Which roguelike on Nintendo Switch should you play first?',
    also: '/games/',
    picks: (games) => FLAGSHIP.map((slug) => games.find((game) => game.slug === slug)).filter(Boolean),
    answer: (game) => `${game.title} opens the starter list. It is a ${game.classification.toLowerCase()} on ${platformName(game)} at ${plain(game.price)}, with runs of ${plain(game.runLength)}.`,
  },
  {
    slug: 'best-roguelites-for-beginners',
    h1: 'Beginner roguelites on Nintendo Switch',
    description: 'Roguelites on Nintendo Switch whose difficulty is Easy or Easy to learn, with run length, price, and co-op.',
    question: 'Which roguelites on Nintendo Switch are easiest to start?',
    also: '/games/',
    picks: (games) => games.filter(isBeginner),
    answer: (game) => `${game.title} is the first Easy or Easy to learn game in the directory. It costs ${plain(game.price)} and a run is ${plain(game.runLength)}.`,
  },
  {
    slug: 'best-deckbuilding-roguelikes',
    h1: 'Deckbuilding roguelikes on Nintendo Switch',
    description: 'Deckbuilders and other card roguelikes on Nintendo Switch, with run length, regular US price, and co-op.',
    question: 'Which deckbuilders are on Nintendo Switch?',
    also: '/genre/cards/',
    picks: (games) => games.filter(isDeckbuilder),
    answer: (game) => `${game.title} is the first deckbuilder in the directory. It is listed at ${plain(game.price)} with runs of ${plain(game.runLength)}.`,
  },
  {
    slug: 'best-co-op-roguelites',
    h1: 'Co-op roguelites on Nintendo Switch',
    description: 'Roguelikes and roguelites on Nintendo Switch with local co-op, online co-op, or both, including the player note from each record.',
    question: 'Which roguelites on Nintendo Switch have co-op?',
    also: '/features/local-co-op/',
    picks: (games) => games.filter(isCoop),
    answer: (game) => `${game.title} is the first co-op game in the directory. Its co-op field says ${plain(game.coOp)}, and a run is ${plain(game.runLength)}.`,
  },
  {
    slug: 'best-roguelikes-for-short-sessions',
    h1: 'Short roguelike sessions on Nintendo Switch',
    description: 'The shortest Switch roguelikes and roguelites in the directory: listed runs that start at 20 minutes or less.',
    question: 'Which Switch roguelikes fit a short session?',
    also: '/features/short-runs/',
    picks: (games) => games.filter(isVeryShort).sort(byRun).slice(0, 8),
    answer: (game) => `${game.title} has one of the shortest listed runs, ${plain(game.runLength)}, at ${plain(game.price)}.`,
  },
  {
    slug: 'best-hidden-gems-under-20',
    h1: 'Hidden gem roguelikes under $20',
    description: 'Overlooked roguelikes and roguelites on Nintendo Switch listed under $20, with the household names left off this short list.',
    question: 'Which Switch roguelikes under $20 are easy to miss?',
    also: '/collections/hidden-gems/',
    picks: (games) => games.filter(isHiddenGem).sort(byPrice).slice(0, 8),
    answer: (game) => `${game.title} leads the overlooked list at ${plain(game.price)}, with runs of ${plain(game.runLength)}.`,
  },
];

export const genres = [
  { slug: 'action', playstyle: 'Action', h1: 'Action roguelikes on Nintendo Switch', description: 'Action roguelikes and roguelites on Nintendo Switch, with run length, regular US price, and co-op from the directory.', question: 'Which action roguelikes are on Nintendo Switch?', also: '/best/best-roguelikes-on-nintendo-switch/' },
  { slug: 'cards', playstyle: 'Cards', h1: 'Card roguelikes on Nintendo Switch', description: 'Card and deckbuilding roguelikes on Nintendo Switch, with run length, regular US price, and co-op.', question: 'Which card roguelikes are on Nintendo Switch?', also: '/best/best-deckbuilding-roguelikes/' },
  { slug: 'tactics', playstyle: 'Tactics', h1: 'Tactics roguelikes on Nintendo Switch', description: 'Tactics roguelikes on Nintendo Switch, including slower planning games, with price and run length.', question: 'Which tactics roguelikes are on Nintendo Switch?', also: '/best/best-roguelikes-on-nintendo-switch/' },
  { slug: 'shooter', playstyle: 'Shooter', h1: 'Shooter roguelikes on Nintendo Switch', description: 'Shooter roguelikes on Nintendo Switch, from short twin-stick runs to longer loot games, with price and co-op.', question: 'Which shooter roguelikes are on Nintendo Switch?', also: '/best/best-roguelikes-on-nintendo-switch/' },
  { slug: 'co-op', playstyle: 'Co-op', h1: 'Co-op playstyle roguelikes on Nintendo Switch', description: 'Games filed under the co-op playstyle on Nintendo Switch. The co-op guide also lists other playstyles that support a second player.', question: 'Which games are filed under co-op on Nintendo Switch?', also: '/best/best-co-op-roguelites/' },
];

export const features = [
  {
    slug: 'local-co-op',
    h1: 'Local co-op roguelites on Nintendo Switch',
    description: 'Local co-op roguelites on Nintendo Switch that you can play on one console, with run length and regular US price.',
    question: 'Which roguelites have local co-op on Nintendo Switch?',
    also: '/best/best-co-op-roguelites/',
    picks: (games) => games.filter(isLocalCoop),
  },
  {
    slug: 'short-runs',
    h1: 'Short session roguelikes on Nintendo Switch',
    description: 'Switch roguelikes and roguelites whose listed runs start at 25 minutes or less. The shorter starter list is linked above the full set.',
    question: 'Which Nintendo Switch roguelikes fit a short session?',
    also: '/best/best-roguelikes-for-short-sessions/',
    picks: (games) => games.filter(isShortRun).sort(byRun),
  },
  {
    slug: 'offline-play',
    h1: 'Offline roguelikes on Nintendo Switch',
    description: 'Single-player games and local-only co-op. Online co-op games stay on the co-op guide because a solo mode is not recorded for every one of them.',
    question: 'Which Switch roguelikes can you start offline?',
    also: '/best/best-co-op-roguelites/',
    picks: (games) => games.filter((game) => game.coOp === 'No' || game.coOp === 'Local'),
  },
];

export const collections = [
  {
    slug: 'hidden-gems',
    h1: 'Overlooked roguelikes under $20',
    description: 'The full list of overlooked Nintendo Switch roguelikes under $20. Household names are on the under-$20 collection instead.',
    question: 'Which overlooked Switch roguelikes cost under $20?',
    also: '/best/best-hidden-gems-under-20/',
    picks: (games) => games.filter(isHiddenGem).sort(byPrice),
  },
  {
    slug: 'under-20',
    h1: 'Roguelikes on Switch under $20',
    description: 'Every roguelike and roguelite in the directory with a regular US price under $20, including the well-known ones.',
    question: 'Which Switch roguelikes cost under $20?',
    also: '/collections/hidden-gems/',
    picks: (games) => games.filter(isUnder20).sort(byPrice),
  },
];

const PHRASES = {
  '/genre/action/': 'action roguelikes',
  '/genre/cards/': 'card roguelikes',
  '/genre/tactics/': 'tactics roguelikes',
  '/genre/shooter/': 'shooter roguelikes',
  '/genre/co-op/': 'co-op playstyle games',
  '/best/best-roguelikes-on-nintendo-switch/': 'starter roguelikes',
  '/best/best-roguelites-for-beginners/': 'beginner roguelites',
  '/best/best-deckbuilding-roguelikes/': 'deckbuilding roguelikes',
  '/best/best-co-op-roguelites/': 'co-op roguelites',
  '/best/best-roguelikes-for-short-sessions/': 'short session roguelikes',
  '/best/best-hidden-gems-under-20/': 'hidden gem roguelikes',
  '/features/local-co-op/': 'local co-op roguelites',
  '/features/short-runs/': 'short Switch runs',
  '/features/offline-play/': 'offline roguelikes',
  '/collections/hidden-gems/': 'overlooked cheap roguelikes',
  '/collections/under-20/': 'games under $20',
  '/games/': 'listed roguelikes',
};

const EXTRA_ANCHORS = {
  '/games/': ['all roguelikes on Nintendo Switch', 'the full roguelike directory', 'every game in the directory'],
  '/features/short-runs/': ['short session roguelikes on Switch'],
  '/collections/under-20/': ['roguelikes on Switch under $20'],
  '/features/local-co-op/': ['local co-op roguelites on Switch'],
};

function wordCount(anchor) {
  return anchor.trim().split(/\s+/).filter(Boolean).length;
}

function bankFor(href) {
  const phrase = PHRASES[href];
  if (!phrase) throw new Error(`No anchor phrase for ${href}`);
  const raw = [
    ...(EXTRA_ANCHORS[href] ?? []),
    `${phrase} on Nintendo Switch`,
    `the ${phrase} in this directory`,
    `${phrase} playable on Switch`,
    `these ${phrase} with prices`,
    `the Switch list of ${phrase}`,
    `${phrase} grouped by run length`,
    `${phrase} from the directory`,
    `the current ${phrase} list`,
    `${phrase} and what they cost`,
    `which ${phrase} fit a run`,
    `more ${phrase} on Switch`,
    `${phrase} for a Switch owner`,
    `the ${phrase} buying guide`,
    `${phrase} with co-op noted`,
    `a plain list of ${phrase}`,
    `${phrase} checked for Switch`,
  ];
  const kept = [];
  const seen = new Set();
  for (const anchor of raw) {
    const key = anchor.toLowerCase();
    const count = wordCount(anchor);
    if (count < 3 || count > 7 || seen.has(key)) continue;
    seen.add(key);
    kept.push(anchor);
  }
  if (kept.length < 8) throw new Error(`Anchor bank for ${href} only has ${kept.length}`);
  return kept;
}

const BANKS = Object.fromEntries(Object.keys(PHRASES).map((href) => [href, bankFor(href)]));

const CALLOUT = {
  '/best/best-roguelikes-on-nintendo-switch/': 'The starter list covers action, cards, tactics, and a shooter, and it opens with Hades.',
  '/best/best-roguelites-for-beginners/': 'The beginner list keeps games whose difficulty field is Easy or Easy to learn.',
  '/best/best-deckbuilding-roguelikes/': 'The deckbuilding list is every card game in the directory, with run length and the regular US price.',
  '/best/best-co-op-roguelites/': 'The co-op list is every directory game whose co-op field is not No.',
  '/best/best-roguelikes-for-short-sessions/': 'The short-session list keeps games whose listed runs start at 20 minutes or less.',
  '/best/best-hidden-gems-under-20/': 'The hidden-gem list is overlooked games under $20, without the household names.',
  '/features/local-co-op/': 'The local co-op list is games you can play with a second person on one Switch.',
  '/features/short-runs/': 'The short-run list keeps games whose listed runs start at 25 minutes or less.',
  '/features/offline-play/': 'The offline list is single-player games and local-only co-op, which do not require online play to start.',
  '/collections/hidden-gems/': 'The overlooked collection is the full under-$20 list with household names removed.',
  '/collections/under-20/': 'The under-$20 collection is every directory game with a regular US price below $20.',
  '/genre/action/': 'The action hub lists every action game in the directory.',
  '/genre/cards/': 'The card hub lists every card game in the directory.',
  '/genre/tactics/': 'The tactics hub lists every tactics game in the directory.',
  '/genre/shooter/': 'The shooter hub lists every shooter in the directory.',
  '/genre/co-op/': 'The co-op playstyle hub lists games filed under co-op, which is a smaller set than the full co-op guide.',
};

function hrefsForGame(game) {
  const hrefs = [];
  const add = (href) => {
    if (href && !hrefs.includes(href) && hrefs.length < 3) hrefs.push(href);
  };
  const genre = genres.find((item) => item.playstyle === game.playstyle);
  add(genre ? `/genre/${genre.slug}/` : null);
  if (isDeckbuilder(game)) add('/best/best-deckbuilding-roguelikes/');
  else if (isBeginner(game)) add('/best/best-roguelites-for-beginners/');
  else if (isShortRun(game)) add('/features/short-runs/');
  else add('/best/best-roguelikes-on-nintendo-switch/');
  if (isLocalCoop(game)) add('/features/local-co-op/');
  else if (isCoop(game)) add('/best/best-co-op-roguelites/');
  else if (isHiddenGem(game)) add('/collections/hidden-gems/');
  else if (isUnder20(game)) add('/collections/under-20/');
  else add('/features/offline-play/');
  return hrefs;
}

function takeFactory(requests) {
  const counts = new Map();
  const usedOnPage = new Set();
  const assigned = new Map();
  const ordered = [...requests].sort((a, b) => `${a.from}|${a.to}|${a.preferred ?? ''}`.localeCompare(`${b.from}|${b.to}|${b.preferred ?? ''}`));
  for (const request of ordered) {
    const options = [];
    if (request.preferred) options.push(request.preferred);
    options.push(...(BANKS[request.to] ?? []));
    const anchor = options.find((option) => {
      const key = option.toLowerCase();
      return wordCount(option) >= 3 && wordCount(option) <= 7 && (counts.get(key) ?? 0) < 3 && !usedOnPage.has(`${request.from}|${key}`);
    });
    if (!anchor) {
      throw new Error(`Ran out of anchors for ${request.to} from ${request.from}`);
    }
    const key = anchor.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
    usedOnPage.add(`${request.from}|${key}`);
    const id = `${request.from}|${request.to}|${request.slot}|${request.preferred ?? ''}`;
    assigned.set(id, anchor);
  }
  return (request) => assigned.get(`${request.from}|${request.to}|${request.slot}|${request.preferred ?? ''}`);
}

function siblingHrefs(list, index, hrefOf, skipHref) {
  const hrefs = [];
  for (let step = 1; step < list.length && hrefs.length < 2; step += 1) {
    const href = hrefOf(list[(index + step) % list.length]);
    if (!href || href === skipHref || hrefs.includes(href)) continue;
    hrefs.push(href);
  }
  return hrefs;
}

function sectionRequests(from, also, siblings, gamesDirectoryPreferred) {
  const targets = [also, ...siblings].filter((href, index, all) => href && href !== from && all.indexOf(href) === index);
  const requests = targets.map((to) => ({ from, to, slot: 'cross' }));
  if (!targets.includes('/games/')) requests.push({ from, to: '/games/', slot: 'cross', preferred: gamesDirectoryPreferred });
  return requests;
}

export function directoryPlan(games) {
  const requests = [];
  const push = (request) => requests.push(request);

  const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const guideHref = (slug) => `/best/${slug}/`;

  for (const game of games) {
    const from = `/games/${game.slug}/`;
    const targets = hrefsForGame(game);
    for (const to of targets.slice(0, 2)) push({ from, to, slot: 'inline' });
    push({ from, to: targets[2] ?? targets[0], slot: 'callout' });
  }

  const homeFilters = [
    { to: '/games/', preferred: 'all roguelikes on Nintendo Switch' },
    { to: '/features/short-runs/', preferred: 'short session roguelikes on Switch' },
    { to: '/collections/under-20/', preferred: 'roguelikes on Switch under $20' },
    { to: '/features/local-co-op/', preferred: 'local co-op roguelites on Switch' },
  ];
  for (const filter of homeFilters) push({ from: '/', to: filter.to, slot: 'home', preferred: filter.preferred });

  guides.slice(0, 3).forEach((guide) => {
    push({ from: '/', to: guideHref(guide.slug), slot: 'home', preferred: guide.h1 });
  });
  guides.slice(3).forEach((guide) => {
    push({ from: '/', to: guideHref(guide.slug), slot: 'home', preferred: guide.h1 });
  });

  for (const guide of guides) {
    const from = guideHref(guide.slug);
    const siblings = siblingHrefs(guides, guides.indexOf(guide), (item) => guideHref(item.slug), guide.also);
    for (const request of sectionRequests(from, guide.also, siblings, 'the full roguelike directory')) push(request);
  }

  for (const genre of genres) {
    const from = `/genre/${genre.slug}/`;
    const siblings = siblingHrefs(genres, genres.indexOf(genre), (item) => `/genre/${item.slug}/`, genre.also);
    for (const request of sectionRequests(from, genre.also, siblings, 'every game in the directory')) push(request);
  }

  for (const feature of features) {
    const from = `/features/${feature.slug}/`;
    const siblings = siblingHrefs(features, features.indexOf(feature), (item) => `/features/${item.slug}/`, feature.also);
    for (const request of sectionRequests(from, feature.also, siblings, 'the complete Switch directory')) push(request);
  }

  for (const collection of collections) {
    const from = `/collections/${collection.slug}/`;
    const siblings = siblingHrefs(collections, collections.indexOf(collection), (item) => `/collections/${item.slug}/`, collection.also);
    for (const request of sectionRequests(from, collection.also, siblings, 'every game in the directory')) push(request);
  }

  const anchorFor = takeFactory(requests);
  const link = (request) => ({ href: request.to, anchor: anchorFor(request) });

  const gameLinks = new Map(games.map((game) => {
    const from = `/games/${game.slug}/`;
    const targets = hrefsForGame(game);
    const inline = targets.slice(0, 2).map((to) => link({ from, to, slot: 'inline' }));
    const calloutTo = targets[2] ?? targets[0];
    return [game.slug, {
      inline,
      callout: {
        href: calloutTo,
        anchor: link({ from, to: calloutTo, slot: 'callout' }).anchor,
        body: CALLOUT[calloutTo],
      },
      related: games.filter((item) => item.playstyle === game.playstyle && item.slug !== game.slug).slice(0, 3),
    }];
  }));

  const crossLinks = (from, also, siblings) => {
    const targets = [also, ...siblings].filter((href, index, all) => href && href !== from && all.indexOf(href) === index);
    const links = targets.map((href) => link({ from, to: href, slot: 'cross' }));
    if (!targets.includes('/games/')) {
      const preferred = requests.find((request) => request.from === from && request.to === '/games/')?.preferred;
      links.push(link({ from, to: '/games/', slot: 'cross', preferred }));
    }
    return links;
  };

  return {
    home: {
      filters: homeFilters.map((filter) => link({ from: '/', to: filter.to, slot: 'home', preferred: filter.preferred })),
      cards: guides.slice(0, 3).map((guide) => ({
        href: guideHref(guide.slug),
        anchor: guide.h1,
        description: guide.description,
      })),
      more: guides.slice(3).map((guide) => ({
        href: guideHref(guide.slug),
        anchor: guide.h1,
      })),
    },
    game: (slug) => gameLinks.get(slug),
    guide: (slug) => {
      const guide = guideBySlug.get(slug);
      const picks = guide.picks(games);
      if (!picks.length) throw new Error(`No picks for /best/${slug}/`);
      const siblings = siblingHrefs(guides, guides.indexOf(guide), (item) => guideHref(item.slug), guide.also);
      return {
        ...guide,
        picks,
        links: crossLinks(guideHref(slug), guide.also, siblings),
      };
    },
    genre: (slug) => {
      const genre = genres.find((item) => item.slug === slug);
      const picks = games.filter((game) => game.playstyle === genre.playstyle);
      const siblings = siblingHrefs(genres, genres.indexOf(genre), (item) => `/genre/${item.slug}/`, genre.also);
      return {
        ...genre,
        picks,
        links: crossLinks(`/genre/${slug}/`, genre.also, siblings),
      };
    },
    feature: (slug) => {
      const feature = features.find((item) => item.slug === slug);
      const picks = feature.picks(games);
      if (!picks.length) throw new Error(`No picks for /features/${slug}/`);
      const siblings = siblingHrefs(features, features.indexOf(feature), (item) => `/features/${item.slug}/`, feature.also);
      return {
        ...feature,
        picks,
        links: crossLinks(`/features/${slug}/`, feature.also, siblings),
      };
    },
    collection: (slug) => {
      const collection = collections.find((item) => item.slug === slug);
      const picks = collection.picks(games);
      if (!picks.length) throw new Error(`No picks for /collections/${slug}/`);
      const siblings = siblingHrefs(collections, collections.indexOf(collection), (item) => `/collections/${item.slug}/`, collection.also);
      return {
        ...collection,
        picks,
        links: crossLinks(`/collections/${slug}/`, collection.also, siblings),
      };
    },
  };
}

export function editorialLinks(games) {
  const plan = directoryPlan(games);
  const links = [];
  const add = (from, to, anchor, slot) => links.push({ from, to, anchor, slot });

  for (const filter of plan.home.filters) add('/', filter.href, filter.anchor, 'home');
  for (const card of plan.home.cards) add('/', card.href, card.anchor, 'home');
  for (const more of plan.home.more) add('/', more.href, more.anchor, 'home');
  for (const genre of genres) add('/', `/genre/${genre.slug}/`, genre.playstyle, 'tile');
  for (const game of games.slice(0, 5)) add('/', `/games/${game.slug}/`, game.title, 'pick');
  add('/', '/games/hades/', 'Hades on Nintendo Switch', 'feature');
  for (const game of games) add('/games/', `/games/${game.slug}/`, game.title, 'pick');

  for (const game of games) {
    const from = `/games/${game.slug}/`;
    const model = plan.game(game.slug);
    for (const item of model.inline) add(from, item.href, item.anchor, 'inline');
    add(from, model.callout.href, model.callout.anchor, 'callout');
    for (const related of model.related) add(from, `/games/${related.slug}/`, related.title, 'related');
  }

  for (const guide of guides) {
    const model = plan.guide(guide.slug);
    const from = `/best/${guide.slug}/`;
    for (const pick of model.picks) add(from, `/games/${pick.slug}/`, pick.title, 'pick');
    for (const item of model.links) add(from, item.href, item.anchor, 'cross');
  }
  for (const genre of genres) {
    const model = plan.genre(genre.slug);
    const from = `/genre/${genre.slug}/`;
    for (const pick of model.picks) add(from, `/games/${pick.slug}/`, pick.title, 'pick');
    for (const item of model.links) add(from, item.href, item.anchor, 'cross');
  }
  for (const feature of features) {
    const model = plan.feature(feature.slug);
    const from = `/features/${feature.slug}/`;
    for (const pick of model.picks) add(from, `/games/${pick.slug}/`, pick.title, 'pick');
    for (const item of model.links) add(from, item.href, item.anchor, 'cross');
  }
  for (const collection of collections) {
    const model = plan.collection(collection.slug);
    const from = `/collections/${collection.slug}/`;
    for (const pick of model.picks) add(from, `/games/${pick.slug}/`, pick.title, 'pick');
    for (const item of model.links) add(from, item.href, item.anchor, 'cross');
  }
  return links;
}
