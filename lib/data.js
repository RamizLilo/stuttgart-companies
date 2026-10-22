import fs from "node:fs";
import path from "node:path";

// Server only: reads the built-in dataset (data/companies_raw.csv) as text.
export function loadCsvText() {
  return fs.readFileSync(path.join(process.cwd(), "data", "companies_raw.csv"), "utf8");
}
