---
name: aibi-substack-draft
description: Step 2 of the AI/BI Lakehouse Substack pipeline. Write the monthly newsletter issue (https://aibilakehouse.substack.com) from the selected topic lineup, in the newsletter's own voice. Use when asked to "draft this month's Substack", "write the [Month] AI/BI Lakehouse issue", or to turn selected topics into a post. Reads selection.md from the issue folder and WRITING_STYLE.md. Produces a draft with [ASSET: ...] placeholders for Step 3. Cardinal rules in NEWSLETTER.md: public sources only, no customer-identifiable content, human publishes.
---

# Step 2 — Writing

Draft the issue from the selected lineup, in the newsletter voice. Shared rules and the
issue-folder convention are in `NEWSLETTER.md`.

## Before you write

- Read `selection.md` (from Step 1) for the chosen lineup.
- Read `WRITING_STYLE.md` (repo root). It is the single source of truth for voice, tone,
  length, and mechanics. Follow it. Do not import a personal or account writing style.
- Confirm every Main section still has a public source. Anything Slack-sourced must be
  reframed generically and backed by a public link before it goes in.

## Issue structure

1. **Intro hook (2 to 4 sentences).** Lead with the single most interesting thing in the
   issue, or a question the reader has probably asked. Set up what this issue covers.
2. **Main sections (2 to 4, ~150 to 250 words each).** One idea per section, with a
   subhead. Mix content types (release, perspective, real-world), do not stack three
   releases. Each Main section:
   - Opens with the "so what" for a practitioner.
   - Explains the thing concretely (what it does, when to reach for it).
   - Links the public source inline.
   - Ends near a visual placeholder (see below).
3. **Extras (short bullets).** One to three sentences each with a link.
4. **Close.** A takeaway, something to try, or a question to reply with.

## Length

Roughly 600 to 1000 words total. Respect the inbox. If it runs long, cut a Main section
to Extras rather than trimming every section thin.

## Asset placeholders

Where a visual belongs, drop a placeholder instead of hunting for the image now. Step 3
(`aibi-substack-assets`) fills these in.

```
[ASSET: gif | screenshot | diagram — short description of what it should show]
```

Example: `[ASSET: gif — Genie answering a follow-up question in context]`.

## Mechanics reminders (full list in WRITING_STYLE.md)

- No em dashes. Use commas, colons, periods, or parentheses.
- Active voice, plain words, short paragraphs.
- Product names and availability (GA / Public Preview / Beta) exact.
- Links inline on the noun, not as bare URLs.
- No customer names, internal links, or unreleased features.

## Output

Write `draft.md` in the issue folder: the full post with `[ASSET: ...]` placeholders in
place. Flag any spot where you were unsure of a fact or a public source so a human can
check it. Hand off to `aibi-substack-assets` (Step 3).
