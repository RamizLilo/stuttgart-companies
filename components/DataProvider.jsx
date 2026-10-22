"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { parseCsvText, buildModel } from "@/lib/metrics";

const Ctx = createContext(null);
const KEY = "stuttgart-companies-import";

// Holds the dataset for all pages. Starts with the built-in CSV; a user can import another one.
export function DataProvider({ defaultCsv, children }) {
  const builtIn = useMemo(() => parseCsvText(defaultCsv).rows, [defaultCsv]);
  const [state, setState] = useState({ rows: builtIn, source: null });

  // Restore an earlier import (stays in this browser only)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved?.csv) {
        const r = parseCsvText(saved.csv);
        if (r.rows.length && !r.errors.length) setState({ rows: r.rows, source: saved.name || "import.csv" });
      }
    } catch { /* storage not available: keep the built-in data */ }
  }, []);

  const importCsv = useCallback((text, name) => {
    const r = parseCsvText(text);
    if (r.errors.length) return r;
    setState({ rows: r.rows, source: name });
    try { localStorage.setItem(KEY, JSON.stringify({ csv: text, name })); } catch { /* ignore */ }
    return r;
  }, []);

  const reset = useCallback(() => {
    setState({ rows: builtIn, source: null });
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  }, [builtIn]);

  const model = useMemo(() => buildModel(state.rows), [state.rows]);
  const value = useMemo(() => ({ ...model, source: state.source, importCsv, reset, builtInCount: builtIn.length }), [model, state.source, importCsv, reset, builtIn.length]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useData = () => useContext(Ctx);
