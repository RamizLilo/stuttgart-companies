"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { T } from "@/lib/i18n";
import { toCsv } from "@/lib/metrics";
import { download } from "@/lib/download";
import { useData } from "./DataProvider";
import { useFilters } from "./FilterProvider";

// Ctrl+K (or Cmd+K): jump to a page, switch language, pick a year, show or hide a company, copy the link or download the data.
export default function CommandPalette({ lang }) {
  const t = T[lang], u = t.ui, pal = u.palette;
  const router = useRouter();
  const path = usePathname() || `/${lang}`;
  const { companies, years, rows } = useData();
  const f = useFilters();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const input = useRef(null);
  const rest = path.replace(/^\/(en|de)/, "");

  useEffect(() => {
    const key = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); } };
    const show = () => setOpen(true);
    window.addEventListener("keydown", key);
    window.addEventListener("open-palette", show);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("open-palette", show); };
  }, []);

  useEffect(() => { if (open) { setQ(""); setIdx(0); setTimeout(() => input.current?.focus(), 0); } }, [open]);

  const items = useMemo(() => {
    const go = (p) => () => router.push(`/${lang}${p}${f.query}`);
    const list = [
      ...[["", "overview"], ["/profitability", "profitability"], ["/people", "people"], ["/report", "report"], ["/data", "data"], ["/method", "method"]]
        .map(([p, k]) => ({ group: pal.pages, label: t.nav[k], run: go(p) })),
      ...["en", "de"].map((l) => ({ group: pal.language, label: l === "en" ? "English" : "Deutsch", run: () => router.push(`/${l}${rest}${f.query}`) })),
      ...years.map((y) => ({ group: u.filterYear, label: `${u.filterYear} ${y}`, run: () => f.setYear(y) })),
      ...companies.map((c) => ({ group: u.filterCompanies, label: (f.selected.some((s) => s.key === c.key) ? pal.hide : pal.show)(c.short), run: () => f.toggle(c.key) })),
      { group: pal.actions, label: u.reset, run: f.reset },
      { group: pal.actions, label: u.share, run: () => navigator.clipboard?.writeText(window.location.href).catch(() => {}) },
      { group: pal.actions, label: t.data.csv, run: () => download("companies.csv", toCsv(rows), "text/csv") },
    ];
    return list;
  }, [t, u, pal, lang, rest, years, companies, rows, f, router]);

  const shown = items.filter((i) => `${i.group} ${i.label}`.toLowerCase().includes(q.trim().toLowerCase()));
  const run = (item) => { setOpen(false); item?.run(); };

  function onKey(e) {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(shown.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); run(shown[idx]); }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 p-4 pt-[12vh] print:hidden" onMouseDown={() => setOpen(false)}>
      <div role="dialog" aria-modal="true" aria-label={pal.title} onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKey}
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4">
          <Search size={16} className="text-slate-400" aria-hidden />
          <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setIdx(0); }} placeholder={pal.placeholder}
            aria-label={pal.placeholder} role="combobox" aria-expanded="true" aria-controls="palette-list"
            className="w-full py-3.5 text-sm outline-none" />
          <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-500">Esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
          {shown.length === 0 && <li className="px-3 py-6 text-center text-sm text-slate-500">{pal.none}</li>}
          {shown.map((item, i) => (
            <li key={`${item.group}${item.label}`} role="option" aria-selected={i === idx}
              onMouseEnter={() => setIdx(i)} onClick={() => run(item)}
              className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm ${i === idx ? "bg-slate-900 text-white" : "text-slate-800"}`}>
              <span>{item.label}</span>
              <span className={`text-xs ${i === idx ? "text-slate-300" : "text-slate-400"}`}>{item.group}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
