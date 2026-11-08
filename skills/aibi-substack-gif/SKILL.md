---
name: aibi-substack-gif
description: Build animated explainer GIFs for the Lakehouse Analytics Substack (https://aibilakehouse.substack.com) in the newsletter's corporate identity - a terminal or SQL window typing commands on one side while an architecture diagram or chart builds up step by step on the other. Use when asked to "make an explainer GIF", "animate how X works", "create a GIF like the Agent Bricks CLI one", or when an [ASSET: ...] placeholder needs a concept animation rather than a screen recording. Part of Step 3 (aibi-substack-assets). Writes an HTML scene to issues/<YYYY-MM>/assets/src/ and renders it to GIF (and MP4) with the renderer in this skill.
---

# Explainer GIFs

A concept animation, not a screen recording: one idea, 10 to 15 seconds, built from HTML
and rendered frame by frame. Reference style: the Agent Bricks CLI GIF (dark background,
a terminal typing `agentbricks init / dev / deploy` on the left, an architecture diagram
assembling on the right, connectors drawing in, a green check at the end).

Shared rules are in `NEWSLETTER.md`. This skill is a helper of `aibi-substack-assets`
(Step 3); use that skill for screenshots and screen recordings.

## Use the corporate identity (CI) from this repo

Every GIF must look like Lakehouse Analytics, not like Databricks and not like the
reference GIF. Do not invent colors or fonts. The CI lives in `brand/`:

- `brand/identity/palette.md`: Deep Lake background, Ember accent (the one highlight per
  frame), Lagoon secondary (success, "after" states), Mist and Sand text, Slate captions.
  Follow its contrast table: Ember and Lagoon on light backgrounds are for shapes only.
- `brand/identity/fonts.md`: Avenir Next for headlines and labels; monospace for code.
- `brand/identity/logo-transparent-dark.svg`: the mark, top left in the header.
- `brand/sunny-bay-roastery/`: the fictional coffee company for any demo data that appears
  inside a GIF (table names, product names, numbers). Never real customer data.

`render/brand.css` encodes the palette and fonts as CSS variables and ready-made parts.
If the brand changes, update `brand/identity/` first, then `brand.css`.

## The kit (all in this skill, in the repo)

```
skills/aibi-substack-gif/
  SKILL.md
  render/
    brand.css      CI as CSS: .stage .header .term .tree .group .box .chip .tile .badge
                   svg.wires (connectors) .bar-row (simple bar charts) .caption .footer
    timeline.js    deterministic animation: data-at, data-type, data-draw, data-count,
                   data-grow, data-class (see the header comment for every attribute)
    render.mjs     serves the repo root, screenshots each frame in headless Chrome,
                   assembles the GIF with ffmpeg (or gifski if installed), optional MP4
    package.json   playwright-core only (uses the installed Google Chrome, no download)
```

Worked example: `issues/2026-10/assets/src/parquet-v2.html` (SQL window on the left,
Parquet v1 vs v2 page skipping on the right). Copy it as the starting point.

## Workflow

1. **Pin the one idea.** Write the beat sheet first: 4 to 6 beats, each one sentence, with
   a time. Example: "0.5s type ALTER TABLE; 2.8s query appears; 3.3s v1 reads every page;
   4.9s v2 row appears; 6.2s v2 skips three pages; 10.9s three takeaways." The last beat
   is the takeaway and must be on screen for the final 2 to 3 seconds (`hold`).
2. **Check every claim against a public source** (cardinal rule 1). Put the source URLs in
   an HTML comment at the top of the scene. Label simplified diagrams as simplified. Never
   show performance numbers that are not published or measured by us.
3. **Write the scene** at `issues/<YYYY-MM>/assets/src/<name>.html`. Canvas is fixed at
   1200x675 (16:9, sharp in email and LinkedIn). Load the kit with absolute paths:
   ```html
   <link rel="stylesheet" href="/skills/aibi-substack-gif/render/brand.css">
   <script>window.SCENE = { duration: 13, fps: 15, hold: 2.5 };</script>
   <script src="/skills/aibi-substack-gif/render/timeline.js"></script>
   ```
   Position parts absolutely inside `.stage`. Give every element a `data-at` time. Draw
   connectors as `<path data-draw data-at=...>` in one `svg.wires` layer.
4. **Preview and check frames.**
   - Live: `node skills/aibi-substack-gif/render/render.mjs --serve <scene.html>` and open
     the printed URL (plays in real time, loops).
   - Stills: `... render.mjs <scene.html> --frame 4.8` writes a PNG of that moment. Look at
     3 or 4 key beats and the final frame before rendering the whole GIF.
5. **Render**, from the repo root:
   ```bash
   (cd skills/aibi-substack-gif/render && npm install)   # once
   node skills/aibi-substack-gif/render/render.mjs issues/<YYYY-MM>/assets/src/<name>.html \
     --out issues/<YYYY-MM>/assets/<name>.gif --mp4
   ```
   Target under 3 MB for the GIF. If larger: shorten, cut fps to 12, or drop gradients.
6. **Hand back to Step 3**: replace the `[ASSET: ...]` placeholder in `draft.md` with the
   GIF and a one-line caption in the newsletter voice. Commit the scene source with the GIF
   so Robin or Tobi can tweak a label and re-render.

## Framing a screen recording

For real product recordings (Kap, QuickTime), `render/frame.mjs` trims the clip, puts it into
a branded window under a header, adds a watermark pill (for example the engine name) and
timed badges, and encodes the GIF. Config is a small JSON next to the issue's assets; worked
examples: `issues/2026-10/assets/src/lakehouse-rt-dashboard.json` and
`lakehouse-dbsql-dashboard.json`.

```bash
node skills/aibi-substack-gif/render/frame.mjs issues/<YYYY-MM>/assets/src/<name>.json
```

To find cut points and timings, extract frames at 10 fps (`ffmpeg -i rec.gif -vf fps=10,scale=480:-1 f/%05d.png`),
diff consecutive frames per screen region (filter bar vs KPI tiles vs charts), and confirm
each event on a contact sheet. A click is the filter value changing; "data in X s" is the
time until the KPI tiles change. When comparing two recordings, use the same click order
and say in the badge what was measured.

## Style rules

- One accent per beat: the thing that just changed is Ember; everything else stays Mist,
  Slate, or Lagoon. "Before" states are Ember, "after" or success states are Lagoon.
- Motion is functional: fade and slide in (8 px), type at 18 to 26 chars per second,
  connectors draw in 0.3 to 0.6 s. No bounces, spins, or zooms.
- Leave room: at most about 12 boxes on screen, labels of 1 to 3 words, font sizes from
  `brand.css` (never below 10.5 px).
- Header: logo plus a title with one Ember word (`Parquet <em>v2</em>`); release status on
  the right (`GA`, `Public Preview`, `Beta`), taken from the docs.
- Text in the GIF follows `WRITING_STYLE.md` (no em dashes, plain words).
- Public-only: no workspace URLs, user names, internal tooling, or real accounts.

## Troubleshooting

- *Fonts look wrong*: Avenir Next ships with macOS; on other systems install Nunito Sans.
- *`chromium.launch` fails*: Google Chrome must be installed (renderer uses `channel: "chrome"`).
- *Blank frame or missing styles*: the scene must be inside the repo (the server roots
  there) and use the `/skills/...` absolute paths.
