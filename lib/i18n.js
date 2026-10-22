import { EXTRA } from "./i18n-extra";

// All visible texts, in English and German.
export const LANGS = ["en", "de"];
export const isLang = (l) => LANGS.includes(l);

export const T = {
  en: {
    locale: "en-US",
    siteTitle: "Stuttgart Companies, Financial Comparison",
    siteDesc: "Revenue, operating margin and employees of three companies from the Stuttgart region, 2023 to 2025, from public reports.",
    brandSub: "Financial comparison, 2023 to 2025",
    note: "Independent portfolio project. Not affiliated with the companies shown. Figures come from their published reports.",
    menu: "Menu", language: "Language",
    nav: { overview: "Overview", profitability: "Profitability", people: "People", report: "Report", method: "Method" },
    units: { bn: "bn €", k: "k €", people: "employees", pp: "pp" },
    na: "n/a",
    measure: {
      "adjusted EBIT": "adjusted EBIT",
      "operating result": "operating result",
      "EBIT margin from operations": "EBIT margin from operations",
    },
    overview: {
      title: "Overview",
      sub: (a, b) => `How much do three well-known companies from the Stuttgart region sell, and how much of it is left as profit? Figures for ${a} to ${b}.`,
      revenueIn: (c, y) => `${c}, revenue ${y}`,
      marginHint: "Operating margin",
      says: "What the numbers say",
      allFell: (a, b) => `The operating margin fell at all three companies between ${a} and ${b}. `,
      biggest: (c, from, to) => `The largest drop is at ${c}, from ${from} to ${to}. `,
      revRange: (a, b) => `Over the same period revenue changed between ${a} and ${b}. `,
      noCause: "The reports used here do not break the causes down, so this page does not claim a reason.",
      revChart: "Revenue by year (billion €)",
      marginTable: "Operating margin (% of revenue)",
      company: "Company",
      marginNote: "Margin = profit divided by revenue. The three companies define profit slightly differently, see Method.",
    },
    profit: {
      title: "Profitability",
      sub: "Profit as a share of revenue. A company can sell more and still earn less, so this is the number to watch.",
      chart: "Operating margin by year",
      figures: "The figures behind the chart",
      year: "Year", revenue: "Revenue", profit: "Profit", margin: "Margin",
      measure: "Profit measure",
      note: "For Mercedes-Benz and Porsche the margin is calculated (profit / revenue). Bosch publishes the margin itself, not an absolute profit.",
    },
    people: {
      title: "People",
      sub: "How many people work at each company, and how much revenue there is per employee. \"n/a\" means the number was not in the sources used.",
      employees: "Employees",
      chart: "Employees (where available)",
      perEmp: "Revenue per employee (thousand €)",
      company: "Company",
      note: "Revenue divided by employees. Use it to compare a company with itself over time. Between companies it is only a rough guide: the groups differ in business mix, and headcount definitions are not identical (Mercedes-Benz \"around 166,000\", Porsche at the reporting date, Bosch at year end).",
    },
    method: {
      title: "Method",
      sub: "Where the numbers come from, how they were prepared and what this page cannot tell you.",
      methodTitle: "Method",
      steps: (n) => [
        `Revenue, profit and employee numbers were taken by hand from each company's own published pages and reports (${n} rows in total).`,
        "Each row keeps a note of its source. Missing values stay empty and are never estimated.",
        "Only 2023 to 2025 is shown, because these are the years available for all three companies on a comparable basis.",
        "Operating margin = profit / revenue. Bosch publishes the margin directly, the other two are calculated.",
        "Revenue per employee = revenue / employees, shown only where both numbers exist.",
      ],
      limitsTitle: "Limits",
      limits: [
        "Profit is defined differently: adjusted EBIT (Mercedes-Benz), operating result (Porsche), EBIT margin from operations (Bosch). The margins are close in meaning but not identical.",
        "Mercedes-Benz figures come from press releases and are described there as preliminary and unaudited.",
        "The companies differ in size and business mix, so the comparison is about direction, not about who is better.",
        "The data shows what changed, not why. No causes are claimed.",
      ],
      sourcesTitle: "Sources",
      src: [
        "Investor page, results 2025 (revenue, adjusted EBIT 2024 and 2025)",
        "2023 results press release (revenue, adjusted EBIT, employees)",
        "2025 at a glance (revenue, operating result 2024 and 2025)",
        "Combined Management Report 2025 (employees 2024 and 2025)",
        "Annual press conference, financial year 2024 (2023 figures)",
        "Key data 2025 (revenue, margin, employees)",
        "Key data 2023 (revenue, margin, employees)",
      ],
      discTitle: "Disclaimer",
      disc: "This is an independent portfolio project. It is not affiliated with, endorsed by or connected to the companies shown. Company names are used only to identify the published figures. No logos or other brand material are used.",
    },
  },

  de: {
    locale: "de-DE",
    siteTitle: "Unternehmen aus Stuttgart, Finanzvergleich",
    siteDesc: "Umsatz, operative Marge und Mitarbeitende von drei Unternehmen aus der Region Stuttgart, 2023 bis 2025, aus öffentlichen Berichten.",
    brandSub: "Finanzvergleich, 2023 bis 2025",
    note: "Unabhängiges Portfolio-Projekt. Keine Verbindung zu den gezeigten Unternehmen. Die Zahlen stammen aus deren veröffentlichten Berichten.",
    menu: "Menü", language: "Sprache",
    nav: { overview: "Überblick", profitability: "Rentabilität", people: "Mitarbeitende", report: "Bericht", method: "Methode" },
    units: { bn: "Mrd. €", k: "Tsd. €", people: "Mitarbeitende", pp: "PP" },
    na: "k. A.",
    measure: {
      "adjusted EBIT": "bereinigtes EBIT",
      "operating result": "operatives Ergebnis",
      "EBIT margin from operations": "EBIT-Marge aus dem operativen Geschäft",
    },
    overview: {
      title: "Überblick",
      sub: (a, b) => `Wie viel verkaufen drei bekannte Unternehmen aus der Region Stuttgart, und wie viel davon bleibt als Gewinn? Zahlen für ${a} bis ${b}.`,
      revenueIn: (c, y) => `${c}, Umsatz ${y}`,
      marginHint: "Operative Marge",
      says: "Was die Zahlen zeigen",
      allFell: (a, b) => `Die operative Marge ist bei allen drei Unternehmen zwischen ${a} und ${b} gesunken. `,
      biggest: (c, from, to) => `Der stärkste Rückgang zeigt sich bei ${c}, von ${from} auf ${to}. `,
      revRange: (a, b) => `Im selben Zeitraum veränderte sich der Umsatz zwischen ${a} und ${b}. `,
      noCause: "Die verwendeten Berichte schlüsseln die Ursachen nicht auf, deshalb nennt diese Seite keinen Grund.",
      revChart: "Umsatz je Jahr (Mrd. €)",
      marginTable: "Operative Marge (% vom Umsatz)",
      company: "Unternehmen",
      marginNote: "Marge = Gewinn geteilt durch Umsatz. Die drei Unternehmen definieren Gewinn leicht unterschiedlich, siehe Methode.",
    },
    profit: {
      title: "Rentabilität",
      sub: "Gewinn als Anteil am Umsatz. Ein Unternehmen kann mehr verkaufen und trotzdem weniger verdienen, deshalb ist dies die Zahl, auf die es ankommt.",
      chart: "Operative Marge je Jahr",
      figures: "Die Zahlen hinter dem Diagramm",
      year: "Jahr", revenue: "Umsatz", profit: "Gewinn", margin: "Marge",
      measure: "Gewinnkennzahl",
      note: "Bei Mercedes-Benz und Porsche wird die Marge berechnet (Gewinn / Umsatz). Bosch veröffentlicht die Marge selbst, keinen absoluten Gewinn.",
    },
    people: {
      title: "Mitarbeitende",
      sub: "Wie viele Menschen bei jedem Unternehmen arbeiten und wie viel Umsatz auf eine Person entfällt. \"k. A.\" bedeutet, dass die Zahl in den verwendeten Quellen nicht enthalten war.",
      employees: "Mitarbeitende",
      chart: "Mitarbeitende (soweit verfügbar)",
      perEmp: "Umsatz je Mitarbeitendem (Tsd. €)",
      company: "Unternehmen",
      note: "Umsatz geteilt durch Mitarbeitende. Am besten vergleicht man ein Unternehmen mit sich selbst im Zeitverlauf. Zwischen Unternehmen ist es nur ein grober Anhaltspunkt: Die Konzerne unterscheiden sich im Geschäftsmix, und die Definitionen der Mitarbeitendenzahl sind nicht identisch (Mercedes-Benz \"rund 166.000\", Porsche zum Stichtag, Bosch zum Jahresende).",
    },
    method: {
      title: "Methode",
      sub: "Woher die Zahlen stammen, wie sie aufbereitet wurden und was diese Seite nicht aussagen kann.",
      methodTitle: "Methode",
      steps: (n) => [
        `Umsatz, Gewinn und Mitarbeitendenzahlen wurden von Hand von den veröffentlichten Seiten und Berichten der Unternehmen übernommen (insgesamt ${n} Zeilen).`,
        "Jede Zeile enthält einen Quellenhinweis. Fehlende Werte bleiben leer und werden nicht geschätzt.",
        "Gezeigt werden nur 2023 bis 2025, weil diese Jahre für alle drei Unternehmen vergleichbar vorliegen.",
        "Operative Marge = Gewinn / Umsatz. Bosch veröffentlicht die Marge direkt, bei den anderen beiden wird sie berechnet.",
        "Umsatz je Mitarbeitendem = Umsatz / Mitarbeitende, nur wenn beide Werte vorliegen.",
      ],
      limitsTitle: "Grenzen",
      limits: [
        "Der Gewinn ist unterschiedlich definiert: bereinigtes EBIT (Mercedes-Benz), operatives Ergebnis (Porsche), EBIT-Marge aus dem operativen Geschäft (Bosch). Die Margen sind inhaltlich nah beieinander, aber nicht identisch.",
        "Die Zahlen von Mercedes-Benz stammen aus Pressemitteilungen und sind dort als vorläufig und ungeprüft gekennzeichnet.",
        "Die Unternehmen unterscheiden sich in Größe und Geschäftsmix, der Vergleich zeigt deshalb die Richtung und nicht, wer besser ist.",
        "Die Daten zeigen, was sich geändert hat, nicht warum. Es werden keine Ursachen behauptet.",
      ],
      sourcesTitle: "Quellen",
      src: [
        "Investor-Seite, Ergebnisse 2025 (Umsatz, bereinigtes EBIT 2024 und 2025)",
        "Pressemitteilung Ergebnisse 2023 (Umsatz, bereinigtes EBIT, Mitarbeitende)",
        "2025 im Überblick (Umsatz, operatives Ergebnis 2024 und 2025)",
        "Zusammengefasster Lagebericht 2025 (Mitarbeitende 2024 und 2025)",
        "Jahrespressekonferenz, Geschäftsjahr 2024 (Zahlen für 2023)",
        "Kennzahlen 2025 (Umsatz, Marge, Mitarbeitende)",
        "Kennzahlen 2023 (Umsatz, Marge, Mitarbeitende)",
      ],
      discTitle: "Hinweis",
      disc: "Dies ist ein unabhängiges Portfolio-Projekt. Es steht in keiner Verbindung zu den gezeigten Unternehmen und wird von ihnen weder unterstützt noch gebilligt. Firmennamen dienen nur dazu, die veröffentlichten Zahlen zuzuordnen. Es werden keine Logos oder sonstiges Markenmaterial verwendet.",
    },
  },
};

// Merge the Report and Data texts into the main dictionary
for (const l of LANGS) {
  T[l].nav = { ...T[l].nav, ...EXTRA[l].nav };
  T[l].units = { ...T[l].units, ...EXTRA[l].units };
  T[l].empty = EXTRA[l].empty;
  T[l].report = EXTRA[l].report;
  T[l].data = EXTRA[l].data;
}
