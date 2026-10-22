"use client";
import { useMemo, useRef, useState } from "react";
import { Upload, Download, RotateCcw, FileSpreadsheet, ArrowUpDown } from "lucide-react";
import { T } from "@/lib/i18n";
import { makeFmt } from "@/lib/format";
import { COLUMNS, toCsv, toJson, TEMPLATE_CSV } from "@/lib/metrics";
import { useData } from "@/components/DataProvider";
import { PageHead, Card } from "@/components/Ui";

function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const btn = "inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50";

export default function DataView({ lang }) {
  const t = T[lang], d = t.data, fmt = makeFmt(t);
  const { rows, companies, years, source, importCsv, reset } = useData();
  const [result, setResult] = useState(null); // { ok, count } or { errors }
  const [drag, setDrag] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState({ key: "company", dir: 1 });
  const fileRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    if (file.size > 1_000_000) { setResult({ errors: [{ code: "empty" }] }); return; }
    const text = await file.text();
    const r = importCsv(text, file.name);
    setResult(r.errors.length ? { errors: r.errors } : { count: r.rows.length });
  }

  const view = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = rows.filter((r) => !needle || `${r.company} ${r.note} ${r.profitMeasure}`.toLowerCase().includes(needle));
    const val = (r) => ({ company: r.company, year: r.year, revenue: r.revenue, measure: r.profitMeasure, margin: r.margin, employees: r.employees ?? -1, note: r.note })[sort.key];
    return [...list].sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * sort.dir);
  }, [rows, q, sort]);

  const head = ["company", "year", "revenue", "measure", "profit", "margin", "employees", "note"];
  const sortable = new Set(["company", "year", "revenue", "measure", "margin", "employees", "note"]);

  return (
    <>
      <PageHead title={d.title} sub={d.sub} />

      <Card title={d.current}>
        <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
          <FileSpreadsheet size={16} aria-hidden /> {source ? d.imported(source) : d.builtIn}
        </p>
        <p className="mt-1 text-sm text-slate-600">{d.stats(rows.length, companies.length, years.length ? years.join(", ") : d.noYears)}</p>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title={d.importTitle}>
          <p className="text-sm leading-relaxed text-slate-600">{d.importText}</p>
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]); }}
            className={`mt-4 rounded-xl border-2 border-dashed p-6 text-center ${drag ? "border-blue-500 bg-blue-50" : "border-slate-300"}`}>
            <button onClick={() => fileRef.current?.click()} className={btn}><Upload size={16} aria-hidden /> {d.choose}</button>
            <p className="mt-2 text-xs text-slate-500">{d.dropHint}</p>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="sr-only" aria-label={d.choose}
              onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }} />
          </div>

          {result?.count != null && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{d.ok(result.count)}</p>}
          {result?.errors && (
            <div role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              <p className="font-medium">{d.fail}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.errors.slice(0, 8).map((e, i) => <li key={i}>{d.errors[e.code](e)}</li>)}
                {result.errors.length > 8 && <li>… +{result.errors.length - 8}</li>}
              </ul>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => download("template.csv", TEMPLATE_CSV, "text/csv")} className={btn}><Download size={16} aria-hidden /> {d.template}</button>
            {source && <button onClick={() => { reset(); setResult(null); }} className={btn}><RotateCcw size={16} aria-hidden /> {d.reset}</button>}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title={d.exportTitle}>
            <p className="text-sm text-slate-600">{d.exportText}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => download("companies.csv", toCsv(rows), "text/csv")} className={btn}><Download size={16} aria-hidden /> {d.csv}</button>
              <button onClick={() => download("companies.json", toJson(rows), "application/json")} className={btn}><Download size={16} aria-hidden /> {d.json}</button>
            </div>
          </Card>
          <Card title={d.columns}>
            <dl className="space-y-2 text-sm">
              {COLUMNS.map((c) => (
                <div key={c} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                  <dt className="font-mono text-xs text-slate-900 sm:w-40 sm:shrink-0">{c}</dt>
                  <dd className="text-slate-600">{d.colHelp[c]}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      <Card className="mt-6" title={d.tableTitle}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={d.search} aria-label={d.search}
          className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:max-w-xs" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                {head.map((k) => (
                  <th key={k} className="py-2 pr-3 font-medium" aria-sort={sort.key === k ? (sort.dir > 0 ? "ascending" : "descending") : undefined}>
                    {sortable.has(k) ? (
                      <button onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? -s.dir : 1 }))} className="inline-flex items-center gap-1 hover:text-slate-900">
                        {d.cols[k]} <ArrowUpDown size={12} aria-hidden />
                      </button>
                    ) : d.cols[k]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {view.map((r) => (
                <tr key={`${r.company}${r.year}`} className="border-b border-slate-100 align-top last:border-0">
                  <td className="py-2 pr-3 font-medium text-slate-900">{r.company}</td>
                  <td className="py-2 pr-3 tabular-nums">{r.year}</td>
                  <td className="py-2 pr-3 tabular-nums">{fmt.n1(r.revenue)}</td>
                  <td className="py-2 pr-3">{t.measure[r.profitMeasure] || r.profitMeasure}</td>
                  <td className="py-2 pr-3 tabular-nums">{r.profitUnit === "percent" ? t.na : fmt.n2(r.profitValue)}</td>
                  <td className="py-2 pr-3 tabular-nums">{fmt.pct(r.margin)}</td>
                  <td className="py-2 pr-3 tabular-nums">{fmt.num(r.employees)}</td>
                  <td className="py-2 text-xs text-slate-500">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">{d.showing(view.length, rows.length)}</p>
      </Card>
    </>
  );
}
