# AI/BI Lakehouse Substack — how the pipeline works

The monthly AI/BI Lakehouse newsletter (https://aibilakehouse.substack.com), co-authored
by Robin and Tobi, is produced by four skills. They run at different times in the month
and hand off through a shared per-issue folder. This file holds the rules and conventions
they all share, so read it once; each skill points back here.

## The four skills

| Step | Skill | Does | Reads | Writes |
|---|---|---|---|---|
| 1 | `aibi-substack-research` | Discover and recommend topics (releases + Slack-sourced problems) | past issues | `research.md`, `selection.md` |
| 2 | `aibi-substack-draft` | Write the issue in the newsletter voice | `selection.md`, `WRITING_STYLE.md` | `draft.md` |
| 3 | `aibi-substack-assets` | Build screenshots, GIFs, diagrams | `draft.md`, `brand/` | files in `assets/` |
| 4 | `aibi-substack-promote` | Draft LinkedIn post + internal distribution | published URL, `draft.md` | `promo.md` |

Each skill is independently invokable, because the steps are separated in time (research
early, draft later, assets alongside, promotion after publish). The issue folder is the
glue.

## The issue folder (shared state)

Every issue lives in one folder that each skill reads from and writes to:

```
issues/<YYYY-MM>/          # e.g. issues/2026-09/  (the month the issue covers)
  research.md              # Step 1: candidate topics + Dropped(non-public)
  selection.md             # Step 1: the recommended lineup + rationale
  draft.md                 # Step 2: the post, with [ASSET: ...] placeholders
  assets/                  # Step 3: screenshots, gifs, diagrams
  promo.md                 # Step 4: LinkedIn copy + internal distribution plan
```

Default month is the calendar month that just ended. Create the folder if missing.

## Cardinal rules (apply in every step)

1. **Public sources only in what we publish.** Every claim, link, screenshot, GIF, and
   example must come from a publicly available source (blog, release notes, public docs,
   public YouTube). Drop anything gated, internal, or unreleased.
2. **Internal Slack is inspiration, never content.** You may search internal Slack to find
   real customer questions and problems worth writing about. Never quote a thread, name a
   customer, person, or account, or include anything identifiable. Reframe generically and
   back it with a public source before it goes in the draft.
3. **The issue is not just releases.** Blend three kinds of material: what shipped, a
   thought or perspective, and a real-world problem and solution. See `WRITING_STYLE.md`.
4. **Human in the loop.** These skills draft and prepare. Robin or Tobi reviews and
   publishes. Do not post to Substack, LinkedIn, or Slack without explicit approval.

## Where things live

- **Writing voice and mechanics:** `WRITING_STYLE.md` (repo root, shared with Tobi).
- **Brand assets:** `brand/` (logo, palette, fonts, templates).
- **Past issues (dedupe):** https://aibilakehouse.substack.com and prior `issues/` folders.
