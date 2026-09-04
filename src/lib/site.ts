/** Canonical production origin. Trailing slash stripped for safe URL joins. */
export const siteOrigin = String(import.meta.env.SITE ?? 'https://switchroguelikes.com').replace(
  /\/$/,
  '',
);
