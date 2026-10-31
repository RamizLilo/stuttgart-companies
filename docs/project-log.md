# Decisions

- **Scope:** three companies, 2023 to 2025, a few metrics. Small enough to explain every number.
- **Sources:** only figures from the companies' own pages and reports, no logos, no brand colours. Each CSV row names its source (see `data-sources.md`).
- **Common measure:** operating margin = profit / revenue, because the companies report profit differently (adjusted EBIT, operating result, EBIT margin).
- **Gaps stay visible:** missing employee numbers are left empty and shown as n/a, never estimated.
- **Earlier years:** not mixed in, because reported and adjusted EBIT are not comparable.
- **Wording:** the text says what the numbers show and never claims a cause the sources do not give.
- **Languages:** `/en` and `/de`, numbers follow the language (132.2 vs 132,2).
- **Testing:** checked by hand at 1440, 820, 390 and 320 px width in both languages, plus CSV import with good and bad files.
