// Pure functions (run in the browser and on the server): CSV parsing, validation, derived numbers.

export const COLUMNS = ["company", "fiscal_year", "revenue_eur_bn", "profit_measure", "profit_value", "profit_unit", "employees", "source_note"];
export const REQUIRED = COLUMNS.slice(0, 6);
export const UNITS = ["EUR bn", "percent"];

const SHORT = { "Mercedes-Benz Group": "Mercedes-Benz", "Porsche AG": "Porsche", "Bosch Group": "Bosch" };
const PALETTE = ["#334155", "#2563eb", "#d97706", "#0d9488", "#9333ea", "#dc2626"];

// Small CSV reader that understands quoted fields ("a, b") and both line endings
function readCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}

function derive(r) {
  // Bosch reports a margin (percent). For the others the margin is profit / revenue.
  const margin = r.profitUnit === "percent" ? r.profitValue : (r.profitValue / r.revenue) * 100;
  return { ...r, margin, revenuePerEmployee: r.employees ? (r.revenue * 1e9) / r.employees / 1e3 : null };
}

// Returns { rows, errors }. Every error is { code, ...details }, translated by the page.
export function parseCsvText(text) {
  const errors = [];
  const table = readCsv(String(text || ""));
  if (table.length < 2) return { rows: [], errors: [{ code: "empty" }] };

  const head = table[0].map((h) => h.trim());
  const missing = REQUIRED.filter((c) => !head.includes(c));
  if (missing.length) return { rows: [], errors: missing.map((col) => ({ code: "missingColumn", col })) };

  const idx = Object.fromEntries(head.map((h, i) => [h, i]));
  const seen = new Set();
  const rows = [];
  table.slice(1).forEach((cells, n) => {
    const line = n + 2;
    const get = (c) => (idx[c] == null ? "" : (cells[idx[c]] ?? "").trim());
    const num = (c) => (get(c) === "" ? NaN : Number(get(c)));
    const company = get("company");
    const year = num("fiscal_year");
    const revenue = num("revenue_eur_bn");
    const profitValue = num("profit_value");
    const unit = get("profit_unit");
    const employees = get("employees") === "" ? null : num("employees");

    let ok = true;
    const bad = (code, extra = {}) => { errors.push({ code, line, ...extra }); ok = false; };
    if (!company) bad("noCompany");
    if (!Number.isInteger(year) || year < 1990 || year > 2100) bad("badNumber", { col: "fiscal_year" });
    if (!(revenue > 0)) bad("badNumber", { col: "revenue_eur_bn" });
    if (Number.isNaN(profitValue)) bad("badNumber", { col: "profit_value" });
    if (!UNITS.includes(unit)) bad("badUnit", { value: unit });
    if (employees !== null && !(Number.isInteger(employees) && employees > 0)) bad("badNumber", { col: "employees" });
    if (ok) {
      const key = `${company}|${year}`;
      if (seen.has(key)) bad("duplicate", { company, year });
      seen.add(key);
    }
    if (ok) {
      rows.push(derive({
        company, year, revenue, profitMeasure: get("profit_measure"), profitValue, profitUnit: unit,
        employees, note: get("source_note"),
      }));
    }
  });
  if (!errors.length && !rows.length) errors.push({ code: "empty" });
  return { rows, errors };
}

// Everything the pages need: companies with colours, the years all companies share, and a lookup.
export function buildModel(rows) {
  const keys = [...new Set(rows.map((r) => r.company))];
  const companies = keys.map((key, i) => ({ key, short: SHORT[key] || key, color: PALETTE[i % PALETTE.length] }));
  const sets = keys.map((k) => new Set(rows.filter((r) => r.company === k).map((r) => r.year)));
  const years = sets.length
    ? [...sets[0]].filter((y) => sets.every((s) => s.has(y))).sort((a, b) => a - b)
    : [];
  const get = (company, year) => rows.find((r) => r.company === company && r.year === year);
  return { rows, companies, years, get };
}

const esc = (v) => (/[",\n\r]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const toRecord = (r) => ({
  company: r.company, fiscal_year: r.year, revenue_eur_bn: r.revenue, profit_measure: r.profitMeasure,
  profit_value: r.profitValue, profit_unit: r.profitUnit, employees: r.employees ?? "", source_note: r.note ?? "",
});

export function toCsv(rows) {
  const lines = rows.map((r) => COLUMNS.map((c) => esc(toRecord(r)[c])).join(","));
  return [COLUMNS.join(","), ...lines].join("\n") + "\n";
}
export const toJson = (rows) => JSON.stringify(rows.map(toRecord), null, 2) + "\n";
export const TEMPLATE_CSV =
  COLUMNS.join(",") + "\n" +
  "Example Company,2024,10.5,operating result,1.2,EUR bn,5000,Annual report 2024 (link or page)\n" +
  "Example Company,2025,11.0,operating result,1.4,EUR bn,5100,Annual report 2025 (link or page)\n";
