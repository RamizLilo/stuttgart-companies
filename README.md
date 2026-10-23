# Stuttgart Companies: Financial Comparison

[Deutsch](README.de.md)

A small dashboard that compares three well-known companies from the Stuttgart region (Mercedes-Benz Group, Porsche AG, Bosch Group) for 2023 to 2025: revenue, operating margin and employees. All figures come from the companies' own published reports.

> Independent portfolio project. Not affiliated with the companies shown. No logos or brand material are used.

## Features

- **Filters:** choose a year and which companies to show. The choice is kept in the address (`?y=2024&c=bosch`), so a link opens the same view.
- **Command palette:** press Ctrl/⌘ + K to jump to a page, switch language or year, show or hide a company, copy the link or download the CSV.
- **Charts:** metric picker, bars or lines, revenue index (first year = 100), margin heatmap, revenue-vs-margin scatter plot, and a PNG download for every chart.
- **What-if calculator:** profit at another margin, as plain arithmetic (not a forecast).
- **People view:** employees, revenue and profit per employee, and which numbers the sources provide.
- **Report:** a long, scrollable report with a chapter for each company (profile, key figures, year-by-year table, chart). The button "Download PDF" opens the browser print dialog; choose "Save as PDF". Sample files: `docs/sample-report-en.pdf` and `docs/sample-report-de.pdf`.
- **Import:** load your own CSV file (same columns as `data/companies_raw.csv`). It is validated, with clear messages for wrong lines, and all pages and the report recalculate. The file stays in the browser and is not uploaded anywhere.
- **Export:** download the current dataset as CSV or JSON, or a CSV template.
- **Data explorer:** searchable and sortable table of all rows with their sources.
- **English and German**, desktop and phone.

## Question

How much do these companies sell, and how much of it is left as profit? Revenue changed little between 2023 and 2025, while the operating margin fell at all three companies.

## Data

- File: `data/companies_raw.csv` (10 rows: company, year, revenue, profit measure, profit, employees, source note)
- Sources: official investor, press and annual report pages, listed on the "Method" page and in `docs/data-sources.md`
- Missing values are left empty and never estimated
- Mercedes-Benz figures come from press releases and are described there as preliminary and unaudited

## Method

1. Collect revenue, profit and employee numbers by hand from the official pages.
2. Keep only 2023 to 2025, the years available for all three companies on a comparable basis.
3. Operating margin = profit / revenue. Bosch publishes the margin directly.
4. Revenue per employee = revenue / employees, only where both exist.

The profit measures differ (adjusted EBIT, operating result, EBIT margin from operations), so the comparison is about direction, not about who is better.

## Pages

Overview, Profitability, People, Report, Data and Method. Each page exists in English (`/en`) and German (`/de`) with a language switch. The start page `/` opens the language of the browser.

## Tech stack

Next.js 16 (App Router), React 19, Tailwind CSS 3, Recharts, lucide-react. Data is read from the CSV at build time. All texts are in `lib/i18n.js`.

![Overview](docs/screenshot.png)

![Report](docs/screenshot-report.png)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

Import the repository on vercel.com (Add New, Project) and click Deploy. No environment variables are needed.

## What I learned

Companies report profit in different ways, so a fair comparison starts with a common measure. Writing down the limits of the data is part of the analysis.
