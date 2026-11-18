import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const games = defineCollection({
  loader: glob({ base: './src/content/games', pattern: '**/game.md' }),
  schema: z.object({
    id: z.string().regex(/^\d{3}$/),
    name: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    official_website: z.url(),
    // Omit for games with no Switch release yet; the page then says so instead of linking a store.
    nintendo_switch_url: z.url().optional(),
    release_date: z.string(),
    release_date_iso: z.string().date().optional(),
    price_usd: z.number().nonnegative().optional(),
    genres: z.array(z.string()).min(1),
    players: z.string(),
    developer: z.string(),
    publisher: z.string(),
    short_description: z.string().min(20),
    image_file: z.string().regex(/^cover\.(png|jpe?g|webp)$/),
    image_source: z.url(),
    last_verified: z.string().date(),
  }),
});

export const collections = { games };
