---
name: monthly-coffee-sales
description: Monthly sales review for Sunny Bay Roastery. Use when someone asks how coffee sales did last month, for a monthly sales report or summary, month-over-month or year-over-year revenue and profit, which products, categories, stores, or channels drove the change, or "what happened in sales this month". Queries the governed metric view sm_fact_coffee_sales_genie.
---

# Monthly coffee sales review (Sunny Bay Roastery)

Produce a short, consistent monthly sales review. Every number comes from the governed
metric view, so it matches the Sales Report dashboard.

## Data

- Metric view: `aibi_lakehouse_substack_catalog.gold.sm_fact_coffee_sales_genie`
- Query measures with `MEASURE(<name>)` and group by dimensions. Never `SELECT *`, never
  re-implement a measure from the base tables.
- Measures: `total_gross_revenue_usd` (headline "sales"), `total_net_revenue_usd`,
  `total_profit_usd`, `total_orders`, `total_quantity_sold`, `total_cost_of_goods_usd`.
- Dimensions: `date` (use `DATE_TRUNC('MONTH', date)` for months), `product_category`,
  `product_subcategory`, `product_name`, `store_name`, `store_city`, `store_type`,
  `store_online`, `customer_channel_preference`, `customer_loyalty_segment`.

## Which month

- "Last month" or no month given: the latest **complete** calendar month in the data.
  Find the latest date with `SELECT MAX(date) AS max_date FROM <metric view>`; if it is
  not the last day of its month, use the month before.
- Compare against the previous month (MoM) and the same month last year (YoY) when it
  exists. Say so if YoY data is missing; do not guess.

## Steps

1. **Headline KPIs** for the month, previous month, and same month last year: gross
   revenue, profit, profit margin (`profit / gross revenue`), orders, average order value
   (`gross revenue / orders`).
   ```sql
   SELECT DATE_TRUNC('MONTH', date) AS month,
          MEASURE(total_gross_revenue_usd) AS gross_revenue,
          MEASURE(total_profit_usd)        AS profit,
          MEASURE(total_orders)            AS orders
   FROM aibi_lakehouse_substack_catalog.gold.sm_fact_coffee_sales_genie
   WHERE date >= :month_start - INTERVAL 12 MONTHS AND date < :month_start + INTERVAL 1 MONTH
   GROUP BY ALL ORDER BY month
   ```
2. **Drivers of the change** (MoM gross revenue delta), top 3 positive and top 3 negative,
   by `product_category`, then by `store_name`. Report the delta in USD and its share of
   the total change.
3. **Channel mix**: share of gross revenue online vs in-store (`store_online`), this month
   vs previous month.
4. **Trend**: gross revenue by month for the trailing 12 months as a line chart.

## Output format

Answer in this order, short:

1. One-sentence verdict: "October gross revenue was $X, up/down Y% vs September (Z% YoY)."
2. A KPI table: metric | this month | previous month | MoM % | YoY %.
3. "What drove it": up to 3 bullets, each with a product category or store and its USD
   contribution.
4. The 12-month trend chart.
5. One suggested follow-up question the user could ask next.

Rules: USD with thousands separators and no cents for amounts above $1,000; percentages
with one decimal; call out if a change is driven by one store or product alone. Keep
causes to what the data shows; do not invent reasons (weather, campaigns) that are not
in the data.
