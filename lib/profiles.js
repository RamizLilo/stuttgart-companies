// Short company profiles for the Report page. Every fact has a source link.
// Facts were read from the pages listed in `sources`; nothing is copied word for word.
export const PROFILES = {
  "Mercedes-Benz Group": {
    facts: {
      en: [
        ["Headquarters", "Stuttgart"],
        ["Origin", "Formed in 1926 as Daimler-Benz (merger of Benz & Cie. and Daimler-Motoren-Gesellschaft); named Mercedes-Benz Group since 1 February 2022"],
        ["Divisions", "Mercedes-Benz Cars, Mercedes-Benz Vans and Mercedes-Benz Mobility (financial services)"],
        ["Listing", "Frankfurt Stock Exchange, part of the DAX"],
      ],
      de: [
        ["Hauptsitz", "Stuttgart"],
        ["Ursprung", "1926 als Daimler-Benz gegründet (Fusion von Benz & Cie. und Daimler-Motoren-Gesellschaft); seit 1. Februar 2022 unter dem Namen Mercedes-Benz Group"],
        ["Sparten", "Mercedes-Benz Cars, Mercedes-Benz Vans und Mercedes-Benz Mobility (Finanzdienstleistungen)"],
        ["Börse", "Frankfurter Wertpapierbörse, Teil des DAX"],
      ],
    },
    // Adjusted EBIT by division, billion euros (preliminary)
    segments: [
      { name: "Cars", v: { 2024: 8.7, 2025: 4.8 } },
      { name: "Vans", v: { 2024: 2.8, 2025: 1.75 } },
      { name: "Mobility", v: { 2024: 1.134, 2025: 1.267 } },
    ],
    sources: [
      ["Wikipedia: Mercedes-Benz Group", "https://en.wikipedia.org/wiki/Mercedes-Benz_Group"],
      ["Mercedes-Benz Group investor page, results 2025", "https://group.mercedes-benz.com/investors/reports-news/annual-reports/2025/"],
    ],
  },
  "Porsche AG": {
    facts: {
      en: [
        ["Headquarters", "Stuttgart"],
        ["Listing", "Frankfurt Stock Exchange since 29 September 2022, at the time Europe's largest IPO by market value"],
        ["Ownership", "Volkswagen Group holds 75% and Porsche SE 12.5%, as published by Porsche"],
        ["Deliveries", "279,449 vehicles in 2025 (310,718 in 2024). Macan 84,328 and 911 51,583 in 2025"],
      ],
      de: [
        ["Hauptsitz", "Stuttgart"],
        ["Börse", "Frankfurter Wertpapierbörse seit dem 29. September 2022, damals der größte Börsengang Europas nach Marktwert"],
        ["Eigentümer", "Der Volkswagen Konzern hält 75 % und die Porsche SE 12,5 %, laut Angaben von Porsche"],
        ["Auslieferungen", "279.449 Fahrzeuge im Jahr 2025 (310.718 im Jahr 2024). Macan 84.328 und 911 51.583 im Jahr 2025"],
      ],
    },
    sources: [
      ["Porsche: Who owns Porsche?", "https://www.porsche.com/stories/mobility/who-owns-porsche/"],
      ["Porsche: 2025 at a glance", "https://newsroom.porsche.com/en/annual-sustainability-report/from-the-company/2025-at-a-glance/"],
    ],
  },
  "Bosch Group": {
    facts: {
      en: [
        ["Headquarters", "Stuttgart"],
        ["Origin", "Founded in 1886 in Stuttgart by Robert Bosch as a workshop for precision mechanics and electrical engineering"],
        ["Ownership", "Not listed on a stock exchange. The charitable Robert Bosch Stiftung holds about 94% of the share capital"],
        ["Business sectors", "Mobility, Industrial Technology, Consumer Goods, Energy and Building Technology"],
        ["2025 in brief", "About 6,300 patents registered, about 12 billion euros spent on research, development and investment, and 2.7 billion euros set aside for restructuring"],
      ],
      de: [
        ["Hauptsitz", "Stuttgart"],
        ["Ursprung", "1886 von Robert Bosch in Stuttgart als Werkstatt für Feinmechanik und Elektrotechnik gegründet"],
        ["Eigentümer", "Nicht börsennotiert. Die gemeinnützige Robert Bosch Stiftung hält rund 94 % des Stammkapitals"],
        ["Unternehmensbereiche", "Mobility, Industrial Technology, Consumer Goods, Energy and Building Technology"],
        ["2025 in Kürze", "Rund 6.300 Patente angemeldet, rund 12 Milliarden Euro für Forschung, Entwicklung und Investitionen, und 2,7 Milliarden Euro für Restrukturierung zurückgestellt"],
      ],
    },
    sources: [
      ["Bosch Group corporate profile 2026", "https://www.bosch.co.jp/publications/bosch-group-corporate-profile/2026-bosch-group-corporate-profile-en-01.pdf"],
      ["Bosch key data for the 2025 business year", "https://www.bosch-presse.de/pressportal/us/en/image-30341.html"],
    ],
  },
};
