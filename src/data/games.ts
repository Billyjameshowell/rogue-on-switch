export type Playstyle = 'Action' | 'Cards' | 'Tactics' | 'Shooter' | 'Co-op';

export const playstyleColor: Record<Playstyle, string> = { Action: 'var(--action)', Cards: 'var(--cards)', Tactics: 'var(--tactics)', Shooter: 'var(--shooter)', 'Co-op': 'var(--coop)' };

export type Console = 'switch' | 'switch-2';

export type Game = {
  slug: string; title: string; playstyle: Playstyle; genre: string; classification: 'Roguelike' | 'Roguelite' | 'Hybrid';
  summary: string; runLength: string; price: string; coOp: string; difficulty: string;
  /** Nintendo US store page and the date its facts were last checked. Games with a research package take both from it instead. */
  sourceUrl?: string; lastChecked?: string;
  /** Written editorial. A page shows each section only when it has been written for that game. */
  bestFor?: string; skipIf?: string; progression?: string; switchNotes?: string;
  /** Nintendo US eShop release date (ISO). */
  releaseDate: string;
  /** Native Nintendo versions. 'switch-2' means a Switch 2 game or a Switch 2 Edition, not backward compatibility. */
  consoles: Console[];
};

// A row without a summary gets one built from its own facts (see `games` below).
const seed: (Omit<Game, 'slug' | 'summary'> & Partial<Pick<Game, 'summary'>>)[] = [
  { title: 'Hades', releaseDate: '2020-09-17', consoles: ['switch'], playstyle: 'Action', genre: 'Action', classification: 'Roguelite', runLength: '30–60 min', price: '$24.99', coOp: 'No', difficulty: 'Medium' },
  { title: 'Dead Cells', releaseDate: '2018-08-07', consoles: ['switch'], playstyle: 'Action', genre: 'Metroidvania', classification: 'Roguelite', runLength: '30–50 min', price: '$24.99', coOp: 'No', difficulty: 'Hard' },
  { title: 'Slay the Spire', releaseDate: '2019-06-06', consoles: ['switch'], playstyle: 'Cards', genre: 'Deckbuilding', classification: 'Roguelike', runLength: '30–90 min', price: '$24.99', coOp: 'No', difficulty: 'Medium' },
  { title: 'Balatro', releaseDate: '2024-02-20', consoles: ['switch'], playstyle: 'Cards', genre: 'Poker deckbuilder', classification: 'Roguelike', runLength: '20–45 min', price: '$14.99', coOp: 'No', difficulty: 'Easy to learn' },
  { title: 'Into the Breach', releaseDate: '2018-08-28', consoles: ['switch'], playstyle: 'Tactics', genre: 'Tactics', classification: 'Roguelike', runLength: '20–45 min', price: '$14.99', coOp: 'No', difficulty: 'Hard' },
  { title: 'The Last Spell', releaseDate: '2023-03-09', consoles: ['switch'], playstyle: 'Tactics', genre: 'Tactical defense', classification: 'Roguelite', runLength: '45–90 min', price: '$24.99', coOp: 'No', difficulty: 'Hard', sourceUrl: 'https://www.nintendo.com/us/store/products/the-last-spell-switch/', lastChecked: '2026-11-18' },
  { title: 'Vampire Survivors', releaseDate: '2023-08-17', consoles: ['switch'], playstyle: 'Action', genre: 'Bullet heaven', classification: 'Roguelite', runLength: '15–30 min', price: '$4.99', coOp: 'Local' , difficulty: 'Easy' },
  { title: 'Enter the Gungeon', releaseDate: '2017-12-14', consoles: ['switch'], playstyle: 'Shooter', genre: 'Twin-stick shooter', classification: 'Roguelike', runLength: '30–60 min', price: '$14.99', coOp: 'Local', difficulty: 'Hard' },
  { title: 'Risk of Rain 2', releaseDate: '2019-08-30', consoles: ['switch'], playstyle: 'Shooter', genre: 'Third-person shooter', classification: 'Roguelite', runLength: '45–120 min', price: '$24.99', coOp: 'Online', difficulty: 'Medium' },
  { title: 'Spelunky 2', releaseDate: '2021-08-26', consoles: ['switch'], playstyle: 'Action', genre: 'Platformer', classification: 'Roguelike', runLength: '15–40 min', price: '$19.99', coOp: 'Local', difficulty: 'Very hard' },
  { title: 'Cult of the Lamb', releaseDate: '2022-08-11', consoles: ['switch', 'switch-2'], playstyle: 'Action', genre: 'Action management', classification: 'Roguelite', runLength: '20–40 min', price: '$24.99', coOp: 'Local', difficulty: 'Easy' },
  { title: 'Children of Morta', releaseDate: '2019-11-20', consoles: ['switch'], playstyle: 'Co-op', genre: 'Action RPG', classification: 'Roguelite', runLength: '20–45 min', price: '$21.99', coOp: 'Local', difficulty: 'Medium' },
  { title: 'Ember Knights', releaseDate: '2023-07-18', consoles: ['switch'], playstyle: 'Co-op', genre: 'Action', classification: 'Roguelite', runLength: '20–35 min', price: '$19.99', coOp: 'Local', difficulty: 'Medium', sourceUrl: 'https://www.nintendo.com/us/store/products/ember-knights-switch/', lastChecked: '2026-11-18' },
  { title: 'Wizard of Legend', releaseDate: '2018-05-15', consoles: ['switch'], playstyle: 'Co-op', genre: 'Spell action', classification: 'Roguelite', runLength: '20–40 min', price: '$15.99', coOp: 'Local', difficulty: 'Hard' },
  { title: 'Dicey Dungeons', releaseDate: '2020-12-15', consoles: ['switch'], playstyle: 'Cards', genre: 'Dice deckbuilder', classification: 'Roguelike', runLength: '20–35 min', price: '$14.99', coOp: 'No', difficulty: 'Medium' },
  { title: 'Monster Train', releaseDate: '2021-08-19', consoles: ['switch'], playstyle: 'Cards', genre: 'Deckbuilding', classification: 'Roguelite', runLength: '35–60 min', price: '$24.99', coOp: 'No', difficulty: 'Medium' },
  { title: 'Wildfrost', releaseDate: '2023-04-12', consoles: ['switch'], playstyle: 'Cards', genre: 'Deckbuilding', classification: 'Roguelike', runLength: '25–45 min', price: '$19.99', coOp: 'No', difficulty: 'Hard', sourceUrl: 'https://www.nintendo.com/us/store/products/wildfrost-switch/', lastChecked: '2026-11-18' },
  { title: 'Loop Hero', releaseDate: '2021-12-09', consoles: ['switch'], playstyle: 'Tactics', genre: 'Auto-battler', classification: 'Roguelite', runLength: '25–50 min', price: '$14.99', coOp: 'No', difficulty: 'Medium' },
  { title: 'Crown Trick', releaseDate: '2020-10-16', consoles: ['switch'], playstyle: 'Tactics', genre: 'Dungeon tactics', classification: 'Roguelike', runLength: '30–60 min', price: '$29.99', coOp: 'No', difficulty: 'Medium', sourceUrl: 'https://www.nintendo.com/us/store/products/crown-trick-switch/', lastChecked: '2026-11-18' },
  { title: 'Shovel Knight Dig', releaseDate: '2022-09-23', consoles: ['switch'], playstyle: 'Action', genre: 'Platformer', classification: 'Roguelite', runLength: '15–30 min', price: '$24.99', coOp: 'No', difficulty: 'Medium', sourceUrl: 'https://www.nintendo.com/us/store/products/shovel-knight-dig-switch/', lastChecked: '2026-11-18' },
  { title: 'Rogue Legacy 2', releaseDate: '2022-11-09', consoles: ['switch'], playstyle: 'Action', genre: 'Platformer', classification: 'Roguelite', runLength: '15–35 min', price: '$24.99', coOp: 'No', difficulty: 'Medium' },
  { title: 'Have a Nice Death', releaseDate: '2023-03-22', consoles: ['switch'], playstyle: 'Action', genre: 'Action platformer', classification: 'Roguelite', runLength: '20–45 min', price: '$24.99', coOp: 'No', difficulty: 'Hard', sourceUrl: 'https://www.nintendo.com/us/store/products/have-a-nice-death-switch/', lastChecked: '2026-11-18' },
  { title: 'Neon Abyss', releaseDate: '2020-07-14', consoles: ['switch'], playstyle: 'Shooter', genre: 'Platform shooter', classification: 'Roguelite', runLength: '25–45 min', price: '$19.99', coOp: 'No', difficulty: 'Medium' },
  { title: 'Skul: The Hero Slayer', releaseDate: '2021-10-21', consoles: ['switch'], playstyle: 'Action', genre: 'Action platformer', classification: 'Roguelite', runLength: '25–50 min', price: '$19.99', coOp: 'No', difficulty: 'Hard' },
  { title: 'The Binding of Isaac: Repentance', releaseDate: '2017-03-17', consoles: ['switch'], playstyle: 'Shooter', genre: 'Twin-stick shooter', classification: 'Roguelike', runLength: '25–50 min', price: '$59.99', coOp: 'Local', difficulty: 'Hard' },
  { title: 'Nuclear Throne', releaseDate: '2019-03-20', consoles: ['switch'], playstyle: 'Shooter', genre: 'Twin-stick shooter', classification: 'Roguelike', runLength: '15–30 min', price: '$11.99', coOp: 'Local', difficulty: 'Hard', sourceUrl: 'https://www.nintendo.com/us/store/products/nuclear-throne-switch/', lastChecked: '2026-11-18' },
  { title: 'Downwell', releaseDate: '2019-01-31', consoles: ['switch'], playstyle: 'Action', genre: 'Vertical shooter', classification: 'Roguelike', runLength: '10–20 min', price: '$2.99', coOp: 'No', difficulty: 'Hard', sourceUrl: 'https://www.nintendo.com/us/store/products/downwell-switch/', lastChecked: '2026-11-18' },
  { title: 'Crypt of the NecroDancer', releaseDate: '2018-02-01', consoles: ['switch'], playstyle: 'Action', genre: 'Rhythm dungeon', classification: 'Roguelike', runLength: '15–30 min', price: '$19.99', coOp: 'Local', difficulty: 'Hard', sourceUrl: 'https://www.nintendo.com/us/store/products/crypt-of-the-necrodancer-nintendo-switch-edition-switch/', lastChecked: '2026-11-18' },
  { title: 'Darkest Dungeon', releaseDate: '2018-01-18', consoles: ['switch'], playstyle: 'Tactics', genre: 'Turn-based RPG', classification: 'Roguelite', runLength: '30–60 min', price: '$24.99', coOp: 'No', difficulty: 'Hard' },
  { title: 'Griftlands', releaseDate: '2021-06-04', consoles: ['switch'], playstyle: 'Cards', genre: 'Deckbuilding', classification: 'Roguelite', runLength: '45–90 min', price: '$19.99', coOp: 'No', difficulty: 'Medium' },
  { title: 'One Step From Eden', releaseDate: '2020-03-26', consoles: ['switch'], playstyle: 'Action', genre: 'Deckbuilding action', classification: 'Roguelite', runLength: '20–40 min', price: '$19.99', coOp: 'Local', difficulty: 'Hard', sourceUrl: 'https://www.nintendo.com/us/store/products/one-step-from-eden-switch/', lastChecked: '2026-11-18' },
  { title: 'Fights in Tight Spaces', releaseDate: '2023-05-25', consoles: ['switch'], playstyle: 'Tactics', genre: 'Deckbuilding tactics', classification: 'Roguelike', runLength: '25–45 min', price: '$24.99', coOp: 'No', difficulty: 'Medium', sourceUrl: 'https://www.nintendo.com/us/store/products/fights-in-tight-spaces-switch/', lastChecked: '2026-11-18' },
  { title: 'Tangledeep', releaseDate: '2019-01-31', consoles: ['switch'], playstyle: 'Tactics', genre: 'Dungeon crawler', classification: 'Roguelike', runLength: '30–60 min', price: '$19.99', coOp: 'No', difficulty: 'Medium', sourceUrl: 'https://www.nintendo.com/us/store/products/tangledeep-switch/', lastChecked: '2026-11-18' },
  { title: 'Flame in the Flood', releaseDate: '2017-10-12', consoles: ['switch'], playstyle: 'Tactics', genre: 'Survival', classification: 'Roguelite', runLength: '20–45 min', price: '$14.99', coOp: 'No', difficulty: 'Medium', sourceUrl: 'https://www.nintendo.com/us/store/products/the-flame-in-the-flood-complete-edition-switch/', lastChecked: '2026-11-18' },
  { title: 'Streets of Rogue', releaseDate: '2019-07-12', consoles: ['switch'], playstyle: 'Co-op', genre: 'Immersive sim', classification: 'Roguelite', runLength: '20–40 min', price: '$19.99', coOp: 'Local', difficulty: 'Medium', sourceUrl: 'https://www.nintendo.com/us/store/products/streets-of-rogue-switch/', lastChecked: '2026-11-18' },
  { title: 'Ship of Fools', releaseDate: '2022-11-22', consoles: ['switch'], playstyle: 'Co-op', genre: 'Action', classification: 'Roguelite', runLength: '20–40 min', price: '$14.99', coOp: 'Local', difficulty: 'Medium', sourceUrl: 'https://www.nintendo.com/us/store/products/ship-of-fools-switch/', lastChecked: '2026-11-18' },
  { title: 'Ravenswatch', releaseDate: '2025-01-23', consoles: ['switch'], playstyle: 'Co-op', genre: 'Action RPG', classification: 'Roguelite', runLength: '30–60 min', price: '$24.99', coOp: 'Online', difficulty: 'Hard', sourceUrl: 'https://www.nintendo.com/us/store/products/ravenswatch-switch/', lastChecked: '2026-11-18' },
  { title: 'Astral Ascent', releaseDate: '2023-11-14', consoles: ['switch', 'switch-2'], playstyle: 'Action', genre: 'Action platformer', classification: 'Roguelite', runLength: '25–50 min', price: '$24.99', coOp: 'Local', difficulty: 'Medium', sourceUrl: 'https://www.nintendo.com/us/store/products/astral-ascent-switch/', lastChecked: '2026-11-18' },
  { title: 'Warm Snow', releaseDate: '2023-10-20', consoles: ['switch'], playstyle: 'Action', genre: 'Action RPG', classification: 'Roguelite', runLength: '25–50 min', price: '$19.99', coOp: 'No', difficulty: 'Medium', sourceUrl: 'https://www.nintendo.com/us/store/products/warm-snow-switch/', lastChecked: '2026-11-18' },
  { title: 'Hades II', releaseDate: '2025-09-25', consoles: ['switch', 'switch-2'], playstyle: 'Action', genre: 'Action', classification: 'Roguelite', runLength: '25–45 min', price: '$29.99', coOp: 'No', difficulty: 'Medium',
    bestFor: 'Players who finished Hades and want a longer story, more weapons, and two routes, down through the Underworld or up to the surface.',
    skipIf: 'You want a short game you can finish in a weekend, since the story unfolds across dozens of escape attempts.',
    progression: 'Melinoë keeps Arcana cards, weapon aspects, familiars, and resources gathered with her tools, so every failed run still moves the story and her power forward.',
    switchNotes: 'Switch runs at 60fps and 720p. A Switch 2 runs it at 120fps and 1080p docked or 60fps handheld, and owners of the Switch version get the Switch 2 upgrade free.',
    lastChecked: '2026-11-18' },
  { title: 'Absolum', releaseDate: '2025-10-09', consoles: ['switch', 'switch-2'], playstyle: 'Action', genre: 'Beat em up', classification: 'Roguelite', runLength: '45–60 min', price: '$24.99', coOp: 'Local and online', difficulty: 'Medium',
    bestFor: 'Fans of Streets of Rage 4, from the same team, who want a fantasy brawler with branching routes and a second player on the couch or online.',
    skipIf: 'You want runs under half an hour, since a full run usually takes close to an hour.',
    progression: 'Runs earn permanent warrior upgrades, new items, and quests, and those carry over even when a co-op partner joins your game.',
    switchNotes: 'Supports two players on one system or online. The free Switch 2 Edition upgrade runs at 60fps with a higher resolution and adds local GameShare.',
    lastChecked: '2026-11-18' },
  { title: 'BALL x PIT', releaseDate: '2025-10-15', consoles: ['switch', 'switch-2'], playstyle: 'Action', genre: 'Brick-breaker', classification: 'Roguelite', runLength: '12–20 min', price: '$14.99', coOp: 'No', difficulty: 'Easy to learn',
    bestFor: 'Players who want a Vampire Survivors style power curve built on a brick-breaker, in runs short enough for a lunch break.',
    skipIf: 'You dislike grinding. Some levels stay out of reach until the town raises your damage.',
    progression: 'Resources from each run build and upgrade more than 70 buildings in New Ballbylon, which add heroes and permanent bonuses.',
    switchNotes: 'Single player. The Switch 2 Edition is a free upgrade that raises resolution and frame rate.',
    lastChecked: '2026-11-18' },
  { title: 'Barony', releaseDate: '2023-08-01', consoles: ['switch'], playstyle: 'Co-op', genre: 'First-person dungeon crawler', classification: 'Roguelike', runLength: '2–5 hours', price: '$19.99', coOp: 'Local and online', difficulty: 'Hard',
    bestFor: 'Groups of up to four who want a classic permadeath dungeon crawl in first person, with split-screen or online crossplay.',
    skipIf: 'You want guidance or a relaxing game. Barony has permadeath, cryptic floors, and very little explanation at the start.',
    progression: 'Almost nothing carries over. Power comes from learning the 13 classes, the monsters, and the traps.',
    switchNotes: 'Supports one to four players in split-screen, local wireless, or online play, with crossplay against PC.',
    lastChecked: '2026-11-18' },
  { title: 'Deadzone: Rogue', releaseDate: '2026-03-17', consoles: ['switch-2'], playstyle: 'Shooter', genre: 'First-person shooter', classification: 'Roguelite', runLength: '25–45 min', price: '$24.99', coOp: 'Online', difficulty: 'Medium',
    bestFor: 'Switch 2 owners who want a first-person shooter roguelite with gyro aiming and online co-op for up to three.',
    skipIf: 'You own the original Switch. The game is a Switch 2 exclusive on Nintendo hardware.',
    progression: 'Permanent upgrades to shields, elements, and perks carry between runs, so later runs start stronger.',
    switchNotes: 'Switch 2 only. Reviews report a Consistent mode that targets 30fps and a Responsive mode that targets about 40fps, plus gyro and mouse aiming.',
    lastChecked: '2026-11-18' },
  { title: 'Blue Prince', releaseDate: '2026-03-03', consoles: ['switch-2'], playstyle: 'Tactics', genre: 'Puzzle adventure', classification: 'Hybrid', runLength: '15–60 min', price: '$29.99', coOp: 'No', difficulty: 'Medium',
    bestFor: 'Puzzle fans who like taking notes and enjoy a mystery that reveals itself over many short days.',
    skipIf: 'You want combat or a classic roguelike. Blue Prince has neither enemies nor health.',
    progression: 'The manor resets every day, but what you learn stays with you, along with a few permanent upgrades to the estate.',
    switchNotes: 'Switch 2 only, and single player.',
    lastChecked: '2026-11-18' },
  { title: 'Caves of Qud', releaseDate: '2026-02-16', consoles: ['switch'], playstyle: 'Tactics', genre: 'Turn-based RPG', classification: 'Roguelike', runLength: 'Hours per character', price: '$29.99', coOp: 'No', difficulty: 'Hard',
    bestFor: 'Players who want a traditional turn-based roguelike with deep simulation, odd mutations, and a huge open world.',
    skipIf: 'You want fast action or clear goals, since the game expects you to experiment and read a lot.',
    progression: 'In Classic mode death is permanent. Roleplay mode lets you return to checkpoints in settlements if you prefer a softer run.',
    switchNotes: 'Single player with touch screen support. A free Switch 2 Edition upgrade has been announced without a digital release date.',
    lastChecked: '2026-11-18' },
  { title: 'Moonlighter', releaseDate: '2018-11-05', consoles: ['switch'], playstyle: 'Action', genre: 'Action RPG', classification: 'Roguelite', runLength: '10–20 min', price: '$24.99', coOp: 'No', difficulty: 'Medium',
    bestFor: 'Players who like a shop to run between dungeon dives and enjoy setting prices as much as fighting.',
    skipIf: 'You want deep combat variety. Most of the depth sits in the shop and crafting loop.',
    progression: 'Gold from the shop pays for village upgrades, gear, and enchantments, so each dive starts stronger than the last.',
    switchNotes: 'Single player. The Between Dimensions expansion is sold separately.',
    lastChecked: '2026-11-18' },
  { title: 'For The King', releaseDate: '2019-05-09', consoles: ['switch'], playstyle: 'Tactics', genre: 'Tabletop RPG', classification: 'Roguelite', runLength: '1–2 hours', price: '$24.99', coOp: 'Local and online', difficulty: 'Hard',
    bestFor: 'Groups of two or three who want a turn-based tabletop adventure on one Switch or online, and solo players who like managing a whole party.',
    skipIf: 'You dislike luck deciding fights, since dice-style rolls drive much of the combat.',
    progression: 'Lore earned in every adventure, win or lose, buys new characters, items, and encounters in the Lore Store.',
    switchNotes: 'Local co-op passes one controller between turns. Reviews and player reports mention small handheld text and occasional crashes.',
    lastChecked: '2026-11-18' },
  { title: 'UFO 50', releaseDate: '2025-08-07', consoles: ['switch'], playstyle: 'Cards', genre: 'Game collection', classification: 'Hybrid', runLength: 'Varies by game', price: '$24.99', coOp: 'Local', difficulty: 'Medium',
    bestFor: 'Card roguelike fans who want Party House, a deckbuilder we rate as highly as Balatro, plus 49 more retro games in one purchase.',
    skipIf: 'You want one long roguelite with permanent upgrades. UFO 50 is a collection, and only a few of its games are roguelikes.',
    progression: 'Each game stands alone. Party House, Velgress, and Campanella 2 reset fully when a run ends.',
    switchNotes: 'One Switch game with 50 games inside. About half support local multiplayer for up to three players on one system.',
    lastChecked: '2026-11-18' },
  { title: 'PlateUp!', releaseDate: '2024-02-15', consoles: ['switch'], playstyle: 'Co-op', genre: 'Cooking', classification: 'Roguelite', runLength: '30+ min', price: '$19.99', coOp: 'Local and online', difficulty: 'Medium',
    bestFor: 'Couples and friends who finished Overcooked and want a co-op kitchen that never runs out of levels.',
    skipIf: 'You want low-stress co-op. After day 3, one customer who walks out ends the whole run.',
    progression: 'Completing day 15 lets you save the restaurant as a franchise for a harder follow-up run, or keep going in overtime.',
    switchNotes: 'Up to four players on one Switch or online.',
    lastChecked: '2026-11-18' },
  { title: 'Monster Train 2', releaseDate: '2025-05-21', consoles: ['switch'], playstyle: 'Cards', genre: 'Deckbuilding', classification: 'Roguelite', runLength: '35–60 min', price: '$24.99', coOp: 'No', difficulty: 'Medium',
    summary: 'Monster Train 2 is a deckbuilding roguelite where you defend three floors of a train from Titans with five new clans of angels and demons.',
    bestFor: 'Players who finished Monster Train and want new clans, a new train, and fresh challenge modes.',
    skipIf: 'You prefer simpler card games, because each turn asks you to plan across three floors.',
    progression: 'Clan levels add new cards and upgrades between runs.',
    switchNotes: 'Launched on Switch on May 21, 2025.',
    sourceUrl: 'https://www.nintendo.com/us/store/products/monster-train-2-switch/', lastChecked: '2026-11-18' },
  { title: 'Moonlighter 2: The Endless Vault', releaseDate: '2026-09-02', consoles: ['switch-2'], playstyle: 'Action', genre: 'Action RPG', classification: 'Roguelite', runLength: 'Varies by dungeon', price: '$29.99', coOp: 'No', difficulty: 'Medium',
    summary: 'Moonlighter 2: The Endless Vault is the sequel to Moonlighter, with dungeon dives for relics and a shop in the village of Tresna to sell them.',
    bestFor: 'Moonlighter fans with a Switch 2 who want the same shop and dungeon loop in a new village.',
    skipIf: 'You own only the original Switch. The sequel is on Switch 2.',
    progression: 'Sales fund the shop and the village, which pay for new weapons, armor, and decorations.',
    switchNotes: 'Released digitally on Switch 2 on September 2, 2026.',
    sourceUrl: 'https://www.nintendo.com/us/store/products/moonlighter-2-the-endless-vault-switch-2/', lastChecked: '2026-11-18' },
  { title: 'Star of Providence', releaseDate: '2025-02-20', consoles: ['switch'], playstyle: 'Shooter', genre: 'Top-down shooter', classification: 'Roguelike', runLength: 'Varies by route', price: '$14.99', coOp: 'No', difficulty: 'Hard',
    summary: 'Star of Providence is a top-down shooter where a lone ship descends through procedurally generated floors of an abandoned facility.',
    bestFor: 'Players who liked Enter the Gungeon or The Binding of Isaac and want another floor-by-floor shooter.',
    skipIf: 'You want a gentle difficulty curve.',
    switchNotes: 'Launched on Switch on February 20, 2025, published by Bigmode.',
    sourceUrl: 'https://www.nintendo.com/us/store/products/star-of-providence-switch/', lastChecked: '2026-11-18' },
];

export const consoleNames: Record<Console, string> = { switch: 'Nintendo Switch', 'switch-2': 'Nintendo Switch 2' };

const releaseFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const formatReleaseDate = (iso: string) => releaseFormat.format(new Date(`${iso}T00:00:00Z`));

// Keeps acronyms such as RPG in capitals.
const lowerGenre = (genre: string) => genre.split(' ').map((word) => (word === word.toUpperCase() ? word : word.toLowerCase())).join(' ');
const coOpPhrase: Record<string, string> = { No: 'It has no co-op mode', Local: 'It supports local co-op', Online: 'It supports online co-op', 'Local and online': 'It supports local and online co-op' };

export const games: Game[] = seed.map((game) => ({
  slug: game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''),
  summary: `${game.title} is a ${game.classification.toLowerCase()} ${lowerGenre(game.genre)} game on Nintendo Switch. ${coOpPhrase[game.coOp]}, and a typical run takes ${game.runLength.toLowerCase()}.`,
  ...game,
}));
