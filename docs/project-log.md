# Project log

A short record of what was done and why, in order.

## Step 1: Idea and scope
- Goal: a small, honest dashboard comparing well-known companies from the Stuttgart region.
- Decision: use only public figures from official reports, no logos or brand colours, and a clear disclaimer: independent portfolio project, not affiliated with the companies.
- Decision: keep it small (three companies, a few metrics) so the logic is easy to explain.

## Step 2: First data collection
- Collected revenue, profit and employees for the latest two years from each company's official page.
- Saved in `data/companies_raw.csv`; each row names its source (see `docs/data-sources.md`).
- Finding: the three companies report profit differently, so a common measure (operating margin) is needed.

- Added Porsche headcount for 2024 and 2025 from the Combined Management Report 2025. Only the two latest years are covered in that report, so a trend over five years needs the older annual reports.

## Step 3: Older years
- Added 2023 (and 2022 for Mercedes-Benz) from official press pages and reports.
- Decision: the dashboard covers 2023 to 2025 for all three companies. Earlier years were not mixed in because the profit measures differ (reported vs adjusted EBIT).
- Decision: keep gaps visible (empty cells) instead of estimating missing employee numbers.

## Step 4: Dashboard
- Built a Next.js site that reads `data/companies_raw.csv` at build time.
- Pages: Overview, Profitability, People, Data & method, with a sidebar menu.
- Design: plain, one neutral dark sidebar, three chart colours that are not brand colours, no logos.
- Rule for the text: say what the numbers show, never claim a cause the sources do not give.
- Tested at 1440 px and 390 px width, no horizontal scroll.

## Step 5: Two languages and a mobile check
- Moved the pages under `/en` and `/de`; texts live in `lib/i18n.js`; numbers follow the language (132.2 vs 132,2).
- `proxy.js` sends `/` to the browser language.
- Profit table split per company so it fits on phones; units moved into headers.
- Tested at 1440, 820, 390 and 320 px width: no horizontal scroll, no console errors.

## Step 6: Report, import and export
- Added a Report page (cover, key findings, one chapter per company, comparison). Company profile facts are in `lib/profiles.js`, each with a source link; facts were read from the companies' own pages (Mercedes-Benz facts from Wikipedia).
- PDF export uses the browser print dialog with a print stylesheet (A4, one chapter per page). Sample PDFs are in `docs/`.
- Added a Data page: import a CSV (validated, errors listed by line), export CSV and JSON, download a template, and a searchable, sortable table.
- All pages now read the data from one place (`components/DataProvider.jsx`), so an imported file updates every page and the report.
- Renamed the old "Data & method" page to "Method".
- Tested: import of good and bad files, export, reset, round trip of the exported file, 12 pages at 1440, 820, 390 and 320 px, PDF page count.

## Next
- Create the GitHub repository and deploy on Vercel.
- Add the project in the portfolio Admin (Code and Live Demo links, screenshot).
- Optional: more years from the audited annual reports; a German version of the pages.

## Upgrade 3 (2026-10-23)
- Added shared filters (year, companies) synced to the URL, a command palette (Ctrl/⌘+K), PNG export for charts.
- Overview, Profitability and People rebuilt: KPI cards with trend lines and changes, "of every 100 €" bars, metric picker, index chart, ranking, margin heatmap, scatter plot, what-if calculator, profit per employee.
- Tested at 1440, 820, 390 and 320 px in EN and DE with no page overflow; report PDFs still 5 pages. The data table scrolls sideways on phones on purpose.
- Kept the rule: no causes are claimed, only what the figures show.
