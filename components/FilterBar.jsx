"use client";
import { useState } from "react";
import { Link2, RotateCcw, Check } from "lucide-react";
import { T } from "@/lib/i18n";
import { useData } from "./DataProvider";
import { useFilters } from "./FilterProvider";

// Year and company filters above the data pages. Everything here is also in the address, so a link keeps the view.
export default function FilterBar({ lang }) {
  const u = T[lang].ui;
  const { companies, years } = useData();
  const f = useFilters();
  const [copied, setCopied] = useState(false);

  async function share() {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* no clipboard access */ }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 print:hidden">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{u.filterYear}</span>
        <div role="group" aria-label={u.filterYear} className="inline-flex overflow-hidden rounded-md border border-slate-300 text-sm">
          {years.map((y) => (
            <button key={y} onClick={() => f.setYear(y)} aria-pressed={f.year === y}
              className={`px-3 py-1.5 tabular-nums ${f.year === y ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-50"}`}>
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{u.filterCompanies}</span>
        {companies.map((c) => {
          const on = f.selected.some((s) => s.key === c.key);
          return (
            <button key={c.key} onClick={() => f.toggle(c.key)} aria-pressed={on}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${on ? "border-slate-400 bg-slate-50 text-slate-900" : "border-slate-200 text-slate-400"}`}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: on ? c.color : "#cbd5e1" }} /> {c.short}
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {!f.isDefault && (
          <button onClick={f.reset} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
            <RotateCcw size={14} aria-hidden /> {u.reset}
          </button>
        )}
        <button onClick={share} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {copied ? <Check size={14} aria-hidden /> : <Link2 size={14} aria-hidden />} <span role="status">{copied ? u.copied : u.share}</span>
        </button>
      </div>
    </div>
  );
}
