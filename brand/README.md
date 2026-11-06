# Brand assets: Lakehouse Analytics

The newsletter's shared brand assets, so `aibi-substack-assets` (Step 3) can make visuals
that look like one publication.

## Two distinct brands

- **`identity/`: the newsletter's own look.** Logo, wordmark, cover, email banner, palette
  and fonts. Regenerate the SVGs and PNGs with `python3 brand/build_brand.py` (needs
  `rsvg-convert` and macOS for Avenir Next).
  - `logo.png` (tile, for the Substack avatar), `logo-transparent-dark.png` /
    `logo-transparent-light.png` (for overlays on light or dark backgrounds)
  - `wordmark.png` / `wordmark-light.png`, `cover.png`, `email-banner.png`
  - `palette.md`, `fonts.md`, `substack-basics.md` (paste-ready Substack copy)
- **`sunny-bay-roastery/`: the fictional coffee company** used as the running example in
  blog demos, GIFs, and screenshots. Holds `logo.png` and `palette.md`, sourced from the
  Databricks Dashboard in a Day repo. Reuse these for demo content so the example stays
  consistent. Do not mix it with the newsletter's own look.

## The mark

A house roof (Ember) over rising bars, standing on a water line (Lagoon): analytics,
in a house, on a lake. Read at 32 px it stays a roof plus bars, so it works as a favicon.
