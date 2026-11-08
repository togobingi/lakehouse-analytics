---
name: aibi-substack-assets
description: Step 3 of the AI/BI Lakehouse Substack pipeline. Create the visuals for the monthly newsletter (https://aibilakehouse.substack.com) - brand-consistent screenshots, GIFs, and diagrams - including connecting to a demo workspace to build and capture a feature. Use when asked to "make a GIF/screenshot/diagram for the Substack", "build the visuals for this month's issue", or to fill the [ASSET: ...] placeholders in the draft. Reads draft.md and brand/, writes to the issue's assets/ folder. Cardinal rule (see NEWSLETTER.md): visuals must show only public features and contain no customer data.
---

# Step 3 — Assets

Create the visuals that fill the `[ASSET: ...]` placeholders in `draft.md`. Save them to
`issues/<YYYY-MM>/assets/` and replace each placeholder with the file reference. Shared
rules are in `NEWSLETTER.md`.

## Public-only rule for visuals

Every screenshot, GIF, and diagram must show only publicly available features and must
contain no customer data, no internal tooling, and no identifiable account. Scrub before
you save. When in doubt, do not use it.

## Brand identity

Apply the shared brand so assets look like one publication. Brand assets live in `brand/`
(logo, color palette, fonts, templates). Match the palette and fonts, place the logo per
the template, and keep captions in the newsletter voice. If `brand/` is not yet populated,
ask Robin for the assets rather than inventing a look.

## Diagrams

Use the installed diagram skills rather than hand-rolling:

- `fe-specialized-agents:mermaid-diagrams` for flowcharts, sequence, and architecture
  sketches (renders to PNG/SVG).
- `fe-specialized-agents:drawio-diagram` or `lucid-diagram` for richer architecture
  diagrams.

Keep diagrams simple: one concept, few boxes, brand colors.

## GIFs

For a concept animation (how a feature works, before vs after, a CLI building an
architecture), use the `aibi-substack-gif` skill: an HTML scene in the brand CI, rendered
frame by frame to GIF. For showing the real product UI, use one of these two paths:

1. **Clip a public video.** If Databricks YouTube shows the feature, cite the video and
   timestamp, and clip a short GIF from the public footage.
2. **Record it yourself** from the demo workspace (see below), then convert to GIF:
   - `ffmpeg -i clip.mov -vf "fps=12,scale=900:-1:flags=lanczos" -loop 0 out.gif`
   - or `gifski` for smaller, higher-quality output.
   Keep GIFs short (a few seconds) and small enough to load fast in email.

## Demo-workspace screenshots

To build and capture a feature working:

- Route Databricks work through the skills: load `databricks-core` first, then the
  product skill that matches the feature (for example `databricks-aibi-dashboards`,
  `databricks-data-discovery` for Genie, or `databricks-dbsql`).
- **Never auto-select a profile.** Pass `--profile <name>` and let the user choose. Prefer
  a clean, public-safe workspace (for example a free or sandbox profile) so nothing
  customer-specific can leak. `databricksfree` and `fe-sandbox-*` profiles are good
  candidates; confirm with Robin.
- Build the smallest example that demonstrates the GA/public feature, capture the
  screenshot, and crop to the relevant area.

## Output

For each placeholder in `draft.md`:

1. Create the asset in `assets/` with a clear name, for example `genie-followup.gif`,
   `dashboard-metric-view.png`.
2. Replace the `[ASSET: ...]` placeholder with a reference to the file and a one-line
   caption in the newsletter voice.
3. Note the public source for any screenshot or clip so it can be cited if needed.

Once the draft's visuals are in, it is ready for a human to publish, then for
`aibi-substack-promote` (Step 4).
