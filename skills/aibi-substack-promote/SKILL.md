---
name: aibi-substack-promote
description: Step 4 of the AI/BI Lakehouse Substack pipeline. Promote a published monthly issue (https://aibilakehouse.substack.com) - draft a LinkedIn post plus a promo GIF, and plan internal distribution. Use when asked to "promote the Substack", "draft the LinkedIn post for the newsletter", or "share this month's issue internally". Reads the published URL and draft.md, writes promo.md. Cardinal rule (see NEWSLETTER.md): public content only, and a human posts - do not publish to LinkedIn or Slack without explicit approval.
---

# Step 4 — Promotion

Draft the promotion for a published issue. Drafting and planning only; a human posts.
Shared rules are in `NEWSLETTER.md`.

## Before you start

- Get the published Substack URL for this issue from the user.
- Read `draft.md` for the content, hooks, and assets already created.

## LinkedIn post

Draft a post that earns the click without giving everything away:

- **Hook first line.** A concrete question or the single most interesting takeaway. No
  "excited to share".
- **Body (short).** Two to four lines on what is inside and who it helps. Newsletter
  voice, no hype, no em dashes.
- **Link.** The public Substack URL.
- **Promo GIF.** Reuse or adapt an asset from `assets/` (see `aibi-substack-assets`). One
  short, on-brand GIF that shows the most compelling feature.
- **Hashtags.** A few relevant ones (for example Databricks, AI/BI, data analytics). Keep
  it tasteful.

Write two or three variants so Robin and Tobi can pick.

## Internal distribution

Plan where and how to share internally so colleagues can amplify:

- Suggest relevant internal Slack channels and a one-line framing for each.
- Keep the framing public-safe: link the public post, no internal-only spin that would be
  awkward if forwarded.
- Use the `slack-messaging` skill to compose, but do not send without explicit approval.

## Output

Write `promo.md` in the issue folder:

- The LinkedIn variants (with the chosen promo GIF referenced from `assets/`).
- The internal distribution plan (channels + framing).

Flag anything that still needs a human decision (which variant, which channels, timing).
