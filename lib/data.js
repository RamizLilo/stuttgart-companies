import fs from "node:fs";
import path from "node:path";

// Server only: reads data/companies_raw.csv
export function loadCsvText() {
  return fs.readFileSync(path.join(process.cwd(), "data", "companies_raw.csv"), "utf8");
}
