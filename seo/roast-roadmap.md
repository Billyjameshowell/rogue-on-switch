# SEO roast roadmap: switchroguelikes.com (2026-11-24)

Verdict: Google could already crawl the site. The buying guides could not rank, because six different URLs published the same six games.

Checked live on 2026-11-24: `robots.txt` allows every crawler and points at the sitemap, and `/no-such-page-xyz` returns 404. No locale tree. No adult media. Prices are in the HTML.

| # | Tier | Issue | Revenue impact | Fix | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | REVENUE | All six `/best/` guides listed the same first six games | Buying-guide queries competed with each other and with the homepage | Each guide now filters the directory: starter set, easy difficulty, deckbuilders, co-op, runs that start at 20 minutes or less, overlooked games under $20 | agent | shipped in PR |
| 2 | REVENUE | `/features/short-runs/` and `/features/offline-play/` both listed the first nine games, with no run-length or offline rule | Those URLs promised a filter the page did not apply | Short runs are games whose listed run starts at 25 minutes or less. Offline is single-player or local-only co-op | agent | shipped in PR |
| 3 | REVENUE | Titles and H1s disagreed. The homepage H1 did not say roguelike. Genre H1s said "runs on Switch" while the title said "Best". Switch 2 exclusives were titled as Switch | The query the page should win was not the text in the H1 | Title, H1, and description now name the same query. Switch 2 exclusives say Switch 2 | agent | shipped in PR |
| 4 | REVENUE | 17 money pages had fewer than 3 contextual body links | Guides and hubs were only in the header, so they inherited almost no page context | Game pages, guides, genres, features, and collections now link to each other in the body. See `seo/internal-links-report.md` | agent | shipped in PR |
| 5 | REVENUE | Games without a research note shared one template, including an unverified line that handheld text and controls are comfortable | Thin, repeated copy on the long tail of game pages | Fallback copy uses only the directory fields: genre, run length, price, co-op, difficulty. The comfort claim is gone | agent | shipped in PR |
| 6 | REVENUE | Cover `alt` was "Hades cover art" and files were named `cover.jpg` | Image search and screen readers got almost nothing from the art | Keyword filenames, 80-160 character alts, width and height, eager hero covers, lazy thumbnails | agent | shipped in PR |
| 7 | COMPOUNDING | No backlink or referring-domain count was available in this run | Money keywords can stall even after the on-page fixes | Do not buy links from this roadmap. Next step is a real referring-domain check, then editorial mentions from Switch sites | Billy | next |
| 8 | COMPOUNDING | Many Switch performance notes are still the directory fallback, not a hands-on check | Players and answer engines cannot quote frame rate, text size, or load times for those games | Add a checked note only when someone has played that build. Do not invent one | Billy | next |

## Fluff (ignore until the rows above are reviewed)

- `robots.txt` points at `/sitemap-index.xml`, and that URL returns a urlset rather than a sitemap index. It is valid XML and already returns 200. Renaming it does not change who can crawl the site.
- Table thumbnails keep an empty `alt` because the game name is the text in the same link. A second description would be read twice.

## Verify

- `curl -A Bingbot https://switchroguelikes.com/robots.txt` already returns `Allow: /` on production. This PR does not change that file.
- `curl -s -o /dev/null -w '%{http_code}' https://switchroguelikes.com/no-such-page-xyz` returned 404.
- After this PR is merged, the same checks should still pass, and view-source on a game page should show the US price in the facts row and in the `Offer` JSON-LD.
