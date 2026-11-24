# Image audit

Detail covers and directory thumbnails still go through Astro's image pipeline. Source files were renamed, not recompressed, so the lighter delivery from the image pass stays in place.

| Check | Result |
| --- | --- |
| Filename | `{slug}-nintendo-switch-eshop-cover.{ext}`, or `nintendo-switch-2` when the directory record says Switch 2. Delivered URLs keep that name before the hash. |
| Alt text | Detail covers are 80-160 characters and name the game, platform, genre, and run length. They do not start with "Image of". |
| Thumbnails | `alt=""` in the games table. The game name is text in the same link. |
| Dimensions | Detail covers ship `width` and `height` from the file. Homepage thumbs are 104 by 60. |
| Loading | Detail cover is `loading="eager"` and `fetchpriority="high"`. Table thumbs are `loading="lazy"` and `decoding="async"`. |
| Homepage weight | The five featured thumbs in the built homepage are about 11 KB together. |
| Open Graph | The homepage now has an `og:image`. Game pages still use a 1200px JPG of the eShop cover. |

The homepage hero and the Hades feature panel are CSS backgrounds. Their files are `pixel-dungeon-gate-roguelike-homepage.webp` and `hades-underworld-feature-art.webp`. They are illustrations, not eShop covers, and they are not given a fake gameplay alt.
