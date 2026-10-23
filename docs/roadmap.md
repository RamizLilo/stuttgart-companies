# Roadmap (planned, not built yet)

The current version is complete and working. These are optional upgrades for a later session.

## Global
- Filter bar on Overview, Profitability and People: year buttons and company chips, state kept in the URL so a link can be shared
- Command palette (Ctrl/Cmd + K): jump to pages, toggle companies and years, download CSV, open the PDF print
- "Download PNG" button on every chart
- Animated number counters (respecting reduced motion)
- Dark mode (needs semantic colour variables first)

## Overview
- KPI tiles with change versus the previous year and a small sparkline
- "Of every 100 euros of revenue, how much is profit" bars
- Metric switch (revenue, margin, employees, revenue per employee) and bar or line switch
- Revenue index (first year = 100)
- Ranking table for the selected year

## Profitability
- Heatmap of margin by company and year
- Year-over-year margin change in percentage points
- Scatter plot: revenue against margin
- Margin gap calculator: what profit would be at an earlier margin (arithmetic illustration, not a forecast)

## People
- Profit per employee (revenue x margin / employees), revenue per employee, employee change with the period shown
- Coverage note where a number is missing

## Rules to keep
- Only features the real data supports; show gaps as n/a
- No invented numbers, no logos, no causes the sources do not give
- Every new text in English and German; test at 1440, 820, 390 and 320 px
