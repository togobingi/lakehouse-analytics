---
name: aibi-substack-research
description: Research candidate topics for the monthly AI/BI Lakehouse Substack newsletter at https://aibilakehouse.substack.com/. Use when asked to "research next Substack", "AI/BI Lakehouse newsletter topics", "what's new for the [Month] Substack", or for content ideas for the monthly Databricks AI/BI roundup. Discovers public Databricks updates from the prior month, filters out anything not publicly available, classifies each candidate as Main or Extras, and returns a markdown table for review. Research-only.
---

# AI/BI Lakehouse Substack — Research

Research the next monthly issue of the AI/BI Lakehouse Substack by discovering public Databricks updates from the prior calendar month and proposing candidate topics.

## Constraints

- **Public sources only.** Everything cited must be publicly available (blog, release notes, public docs, YouTube). Drop anything gated, internal, or unreleased. When in doubt, drop it and note why.
- **Two sections:** `Main` (substantial feature, has a blog/docs page with a screenshot or GIF, worth 100–200 words) and `Extras` (small announcement, vote/feedback link, webinar mention, community highlight).
- **Research-only.** Return a markdown table for review. Do not draft the final issue and do not modify any backlog.

## When to use

Roughly 1–2 weeks before the first calendar week of a new month. Default target month is the month that just ended (the one the upcoming first-week issue covers). Confirm with the user if ambiguous.

## Workflow

1. **Set the target month** (default: prior calendar month).
2. **Discover candidates** across public sources for AI/BI, Genie, dashboards, SQL warehousing, and Lakehouse updates published or announced in the target month:
   - databricks.com/blog — posts in the target month on AI/BI / dashboards / Genie / SQL.
   - Public release notes — AWS (`docs.databricks.com/aws/en/release-notes/`), Azure, GCP.
   - Databricks docs — new pages or "What's new" entries for the target month.
   - Databricks YouTube — `youtube.com/@Databricks` for new feature videos.
   - Past Substack issues at https://aibilakehouse.substack.com/ — to avoid repeating covered topics.
   For each finding capture: title, public URL, publication date, one-line summary.
3. **Filter for public availability.** Drop anything not public.
4. **Classify** each survivor as `Main` or `Extras`.
5. **Enrich** each with: canonical public link (prefer blog > docs > release notes), a plain-language 1-line description, and a suggested visual (docs screenshot, blog hero image, YouTube GIF + timestamp, or `gif` if a custom recording is needed).
6. **Output** a markdown table:

   ```
   | # | Section | Title | Link | Suggested Visual | Description |
   |---|---------|-------|------|------------------|-------------|
   | 1 | Main    | …     | …    | …                | …           |
   ```

   `Main` rows first (by relevance), `Extras` after. Below the table add **Dropped (non-public)** with reasons.

## Sources to prefer

| Source | Use for | URL |
|---|---|---|
| Databricks Blog | Major features, customer stories | https://www.databricks.com/blog |
| AWS Release Notes | New AI/BI features | https://docs.databricks.com/aws/en/release-notes/ |
| What's New (docs) | Feature index | https://docs.databricks.com/aws/en/release-notes/product/ |
| Past Substack issues | Dedupe | https://aibilakehouse.substack.com/ |
| Databricks YouTube | Demo videos | https://www.youtube.com/@Databricks |

## Tone

Descriptions in the output table should mirror the Substack voice: informational, practitioner-focused, "turn data into insights." Final drafting happens in a separate pass; this skill produces structured candidates, not finished prose. Baseline style rule: no em dashes.
