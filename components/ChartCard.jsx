"use client";
import { useRef, useState } from "react";
import { ImageDown } from "lucide-react";
import { chartToPng } from "@/lib/chartExport";

// A card around a chart: title, optional controls, and a button that saves the chart as PNG.
export default function ChartCard({ title, controls, legend = [], pngLabel, filename = "chart.png", note, children, className = "" }) {
  const box = useRef(null);
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try { await chartToPng(box.current, { title, legend, filename }); } catch { /* the chart stays as it is */ }
    setBusy(false);
  }
  return (
    <section className={`min-w-0 rounded-xl border border-slate-200 bg-white p-3 min-[400px]:p-4 sm:p-5 ${className}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {controls}
          <button onClick={save} disabled={busy} aria-label={pngLabel} title={pngLabel}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            <ImageDown size={14} aria-hidden /> PNG
          </button>
        </div>
      </div>
      <div ref={box}>{children}</div>
      {note && <p className="mt-3 text-xs text-slate-500">{note}</p>}
    </section>
  );
}

// Small segmented buttons (for example Bars / Lines)
export function Segmented({ value, onChange, options, label }) {
  return (
    <div role="group" aria-label={label} className="inline-flex overflow-hidden rounded-md border border-slate-300 text-xs font-medium">
      {options.map(([v, text]) => (
        <button key={v} onClick={() => onChange(v)} aria-pressed={value === v}
          className={`px-2.5 py-1.5 ${value === v ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-50"}`}>
          {text}
        </button>
      ))}
    </div>
  );
}
