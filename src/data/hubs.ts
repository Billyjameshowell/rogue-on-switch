import type { DirectoryGame } from './directory';
import type { Playstyle } from './games';

/** A list page built from directory facts. `picks` keeps the directory's editorial order. */
export type Hub = { slug: string; title: string; description: string; picks: (games: DirectoryGame[]) => DirectoryGame[] };

const longestRunMinutes = ({ runLength }: DirectoryGame) => Number(runLength.match(/^\d+–(\d+) min$/)?.[1] ?? Infinity);
const priceUsd = ({ price }: DirectoryGame) => Number(price.replace(/[^0-9.]/g, ''));
const isShortRun = (game: DirectoryGame) => longestRunMinutes(game) <= 30;
const isUnder20 = (game: DirectoryGame) => priceUsd(game) < 20;
const isGentle = ({ difficulty }: DirectoryGame) => ['Easy', 'Easy to learn', 'Medium'].includes(difficulty);

export const playstyles: { slug: string; name: Playstyle; icon: 'action' | 'cards' | 'tactics' | 'shooter' | 'coop'; blurb: string }[] = [
  { slug: 'action', name: 'Action', icon: 'action', blurb: 'Fights reward fast reflexes and close combat.' },
  { slug: 'cards', name: 'Cards', icon: 'cards', blurb: 'You build a deck and win with careful card play.' },
  { slug: 'tactics', name: 'Tactics', icon: 'tactics', blurb: 'Grid battles reward careful planning.' },
  { slug: 'shooter', name: 'Shooter', icon: 'shooter', blurb: 'You clear rooms full of enemies and bullets.' },
  { slug: 'co-op', name: 'Co-op', icon: 'coop', blurb: 'Runs are built to share with friends.' },
];

export const guides: Hub[] = [
  { slug: 'best-roguelikes-on-nintendo-switch', title: 'Best Roguelikes on Nintendo Switch', description: 'These six games are the essential starting list from our directory.', picks: (games) => games.slice(0, 6) },
  { slug: 'best-roguelites-for-beginners', title: 'Best Roguelites for Beginners', description: 'These roguelites have medium or easier difficulty, and their upgrades carry between runs.', picks: (games) => games.filter((game) => game.classification === 'Roguelite' && isGentle(game)).slice(0, 6) },
  { slug: 'best-deckbuilding-roguelikes', title: 'Best Deckbuilding Roguelikes', description: 'Here is every card-based roguelike in our directory.', picks: (games) => games.filter((game) => game.playstyle === 'Cards') },
  { slug: 'best-co-op-roguelites', title: 'Best Co-op Roguelites', description: 'Each of these roguelites can be played with friends, locally or online.', picks: (games) => games.filter((game) => game.coOp !== 'No').slice(0, 9) },
  { slug: 'best-roguelikes-for-short-sessions', title: 'Best Roguelikes for Short Sessions', description: 'In each of these roguelikes, a typical run takes 30 minutes or less.', picks: (games) => games.filter(isShortRun) },
  { slug: 'best-hidden-gems-under-20', title: 'Best Hidden Gems Under $20', description: 'These affordable picks come from further down our list, and each costs under $20.', picks: (games) => games.slice(10).filter(isUnder20).slice(0, 6) },
];

export const features: Hub[] = [
  { slug: 'local-co-op', title: 'Best local co-op roguelites', description: 'Each of these Switch roguelikes and roguelites supports local co-op.', picks: (games) => games.filter((game) => game.coOp.includes('Local')) },
  { slug: 'short-runs', title: 'Roguelikes for short sessions', description: 'In each of these Switch roguelikes, a typical run takes 30 minutes or less.', picks: (games) => games.filter(isShortRun) },
  { slug: 'offline-play', title: 'Offline roguelikes for Switch', description: 'These Switch roguelikes and roguelites are our picks for playing away from Wi-Fi.', picks: (games) => games.slice(0, 9) },
];

export const collections: Hub[] = [
  { slug: 'hidden-gems', title: 'Hidden gems worth your next run', description: 'These ten Switch roguelikes come from further down our list.', picks: (games) => games.slice(10, 20) },
  { slug: 'under-20', title: 'The best roguelikes under $20', description: 'Each of these Switch roguelikes and roguelites has a regular US price under $20.', picks: (games) => games.filter(isUnder20) },
];
