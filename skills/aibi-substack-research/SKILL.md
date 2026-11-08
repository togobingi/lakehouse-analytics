---
name: aibi-substack-research
description: Step 1 of the AI/BI Lakehouse Substack pipeline. Research candidate topics for the monthly newsletter (https://aibilakehouse.substack.com) and recommend the issue lineup. Use when asked to "research next Substack", "what's new for the [Month] issue", "find AI/BI Lakehouse newsletter topics", or for content ideas for the monthly Databricks AI/BI roundup. Pulls two streams - official public updates AND real customer questions/problems from internal Slack - so issues can be thoughts and real-world solutions, not just releases. Research and selection only; does not draft. Cardinal rule: Slack is inspiration only, everything published must be public and non-identifiable (see NEWSLETTER.md).
---

# Step 1 — Research and Selection

Discover candidate topics for the issue, classify them, and recommend a lineup. Research
and judgment only. Do not draft the post here. Shared rules and the issue-folder
convention are in `NEWSLETTER.md`; read it first.

## 1. Set the target month

Default to the calendar month that just ended (the one the upcoming first-week issue
covers). Confirm with the user if ambiguous. Create `issues/<YYYY-MM>/` if it does not
exist.

## 2. Discover candidates from two streams

An issue blends releases, perspectives, and real-world problems, so gather from both.

### Stream A — official public updates (what shipped)

Search public sources for AI/BI, Genie, dashboards, SQL warehousing, and Lakehouse
updates published or announced in the target month:

| Source | Use for | URL |
|---|---|---|
| Databricks Blog | Major features, customer stories | https://www.databricks.com/blog |
| AWS Release Notes | New AI/BI features | https://docs.databricks.com/aws/en/release-notes/ |
| What's New (docs) | Feature index | https://docs.databricks.com/aws/en/release-notes/product/ |
| Databricks YouTube | Demo videos (with timestamps) | https://www.youtube.com/@Databricks |
| Past Substack issues | Dedupe | https://aibilakehouse.substack.com |

For each finding capture: title, public URL, publication date, one-line summary,
availability (GA / Public Preview / Beta).

### Stream B — real customer questions and problems (thoughts and solutions)

Search internal Slack for recurring, interesting questions and pain points that a wider
audience would recognize. Use the Slack MCP tools or the `glean-search` skill.

- Start with the internal AI/BI customer-questions channel (ask Robin or Tobi which one;
  channel IDs and links stay out of this public repo), plus any other AI/BI or dashboards
  channels the user names.
- Look for: a question asked more than once, a workaround people share, a
  misunderstanding worth correcting, a pattern worth naming.
- **Inspiration only.** Record the generic theme and the underlying problem, never the
  thread, the customer, the person, or any identifiable detail. Each Slack-sourced idea
  must be reframable generically and backed by a public source before it can be published.

## 3. Filter for public availability

Drop anything that cannot be published under a public source: gated, internal,
pre-release, or customer-identifiable. When in doubt, drop it and note why.

## 4. Classify each survivor

Tag each candidate by content type and section:

- **Type:** `Release` (what shipped), `Perspective` (a thought or trend), or
  `Real-world` (a problem and solution).
- **Section:** `Main` (substantial, 150 to 250 words, has a visual) or `Extras` (a short
  announcement, vote/feedback link, webinar, or community highlight).

Dedupe against past issues.

## 5. Recommend the lineup

Do not just list candidates. Recommend the actual issue: pick the Main sections (aim for
a mix of types, not three releases) and the Extras, ordered by relevance, with a one-line
rationale each. Note what you deliberately left out.

## 6. Output

Write two files in the issue folder.

`research.md` — the full candidate table:

```
| # | Type | Section | Title | Public link | Suggested visual | Description |
|---|------|---------|-------|-------------|------------------|-------------|
```

Below it, a **Dropped (non-public)** list with reasons.

`selection.md` — the recommended lineup: the chosen Main sections and Extras in order,
each with its type, public link, suggested visual, and a one-line reason it made the cut.

Hand off to `aibi-substack-draft` (Step 2).
