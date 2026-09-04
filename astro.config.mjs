// @ts-check
import { defineConfig } from 'astro/config';

// Custom apex domain is served from `/`. Do not set a project-pages base
// (`/rogue-on-switch`); that path 404s on switchroguelikes.com.
// https://docs.astro.build/en/guides/deploy/github/#change-your-github-url-to-a-custom-domain
export default defineConfig({
  site: 'https://switchroguelikes.com',
});
