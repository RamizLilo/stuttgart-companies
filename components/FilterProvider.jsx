"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useData } from "./DataProvider";

// Year and company selection shared by the Overview, Profitability and People pages.
// It is kept in the address (?y=2025&c=porsche,bosch) so that a link opens the same view.
const Ctx = createContext(null);
export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function FilterProvider({ children }) {
  const { companies, years } = useData();
  const [yearPick, setYearPick] = useState(null);   // null = latest shared year
  const [picked, setPicked] = useState(null);       // null = all companies, else a list of slugs

  // Read the address once, in the browser
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const y = Number(q.get("y"));
    if (y) setYearPick(y);
    const c = q.get("c");
    if (c) setPicked(c.split(",").filter(Boolean));
  }, []);

  const year = years.includes(yearPick) ? yearPick : years[years.length - 1] ?? null;
  const selected = useMemo(() => {
    const list = picked ? companies.filter((c) => picked.includes(slug(c.short))) : companies;
    return list.length ? list : companies;
  }, [companies, picked]);
  const prevYear = years[years.indexOf(year) - 1] ?? null;

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (yearPick && years.includes(yearPick) && yearPick !== years[years.length - 1]) p.set("y", yearPick);
    if (picked && selected.length !== companies.length) p.set("c", selected.map((c) => slug(c.short)).join(","));
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [yearPick, picked, years, selected, companies.length]);

  // Keep the address in sync without reloading the page
  useEffect(() => {
    const url = window.location.pathname + query + window.location.hash;
    window.history.replaceState(window.history.state, "", url);
  }, [query]);

  const toggle = useCallback((key) => {
    const current = selected.map((c) => c.key);
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    if (!next.length) return; // at least one company stays selected
    const list = companies.filter((c) => next.includes(c.key));
    setPicked(list.length === companies.length ? null : list.map((c) => slug(c.short)));
  }, [selected, companies]);

  const reset = useCallback(() => { setYearPick(null); setPicked(null); }, []);
  const isDefault = !yearPick && !picked;

  const value = useMemo(() => ({ year, setYear: setYearPick, prevYear, selected, toggle, reset, isDefault, query }),
    [year, prevYear, selected, toggle, reset, isDefault, query]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useFilters = () => useContext(Ctx);
