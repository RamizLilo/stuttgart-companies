"use client";
import { useMemo, useState } from "react";
import { T } from "@/lib/i18n";
import { makeFmt } from "@/lib/format";
import { profitBn } from "@/lib/calc";
import { useData } from "@/components/DataProvider";
import { useFilters } from "@/components/FilterProvider";
import { PageHead, Card, Table } from "@/components/Ui";
import FilterBar from "@/components/FilterBar";
import ChartCard, { Segmented } from "@/components/ChartCard";
import { MetricChart, ScatterView } from "@/components/Charts";

export default function ProfitabilityView({ lang }) {
  const t = T[lang], p = t.profit, fmt = makeFmt(t);
  const { companies, years, get } = useData();
  const { year, selected } = useFilters();
  const [view, setView] = useState("margin");
  const [custom, setCustom] = useState(null); // null = use the margin of a reference year
  const [refYear, setRefYear] = useState(null);

  const legend = selected.map((c) => ({ name: c.short, color: c.color }));
  const val = (c, y) => {
    const r = get(c.key, y), prev = get(c.key, y - 1);
    if (view === "margin") return r.margin;
    if (view === "profit") return profitBn(r);
    return prev ? r.margin - prev.margin : null;
  };
  const data = useMemo(
    () => years.map((y) => ({ year: y, ...Object.fromEntries(selected.map((c) => [c.short, val(c, y)])) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [years, selected, view, get]
  );

  if (!years.length) return (<><PageHead title={p.title} /><Card><p className="text-sm text-slate-700">{t.empty}</p></Card></>);

  const f = { margin: fmt.pct, profit: fmt.n2, change: fmt.pp }[view];
  const all = companies.flatMap((c) => years.map((y) => get(c.key, y).margin));
  const lo = Math.min(...all), hi = Math.max(...all);
  const shade = (m) => `rgba(15, 23, 42, ${0.08 + (hi === lo ? 0.3 : ((m - lo) / (hi - lo)) * 0.55)})`;

  const ry = years.includes(refYear) ? refYear : years[0];
  const scatter = selected.map((c) => ({ short: c.short, color: c.color, points: years.map((y) => ({ x: get(c.key, y).revenue, y: get(c.key, y).margin, year: y })) }));

  return (
    <>
      <PageHead title={p.title} sub={p.sub} />
      <FilterBar lang={lang} />

      <Card title={p.heatTitle}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-slate-500">
              <th className="py-1 text-left text-[11px] font-medium sm:text-sm" />
              {years.map((y) => <th key={y} className={`px-1 py-1 text-center text-[11px] font-medium tabular-nums sm:text-sm ${y === year ? "text-slate-900" : ""}`}>{y}</th>)}
            </tr></thead>
            <tbody>
              {selected.map((c) => (
                <tr key={c.key}>
                  <th className="py-1 pr-2 text-left text-[11px] font-medium text-slate-900 sm:text-sm">{c.short}</th>
                  {years.map((y) => {
                    const m = get(c.key, y).margin;
                    return (
                      <td key={y} className="p-0.5">
                        <div className={`rounded-md px-1 py-2 text-center text-[11px] font-semibold tabular-nums sm:text-sm ${y === year ? "ring-2 ring-slate-900" : ""}`}
                          style={{ background: shade(m), color: (m - lo) / (hi - lo || 1) > 0.35 ? "#fff" : "#0f172a" }}>
                          {fmt.pct(m)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">{p.heatNote}</p>
      </Card>

      <ChartCard className="mt-6" title={`${p.chartTitle}: ${p.viewTitles[view]}`} pngLabel={t.ui.png} filename={`stuttgart-${view}.png`}
        legend={legend} note={view === "profit" ? p.profitNote : view === "change" ? p.changeNote : undefined}
        controls={<Segmented label="" value={view} onChange={setView} options={Object.entries(p.views)} />}>
        <MetricChart data={data} series={selected} kind={view === "margin" ? "line" : "bar"} fmt={f} na={t.na} />
      </ChartCard>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title={p.scatterTitle} pngLabel={t.ui.png} filename="stuttgart-revenue-vs-margin.png" legend={legend} note={p.scatterNote}>
          <ScatterView series={scatter} xLabel={p.xLabel} yLabel={p.yLabel} xFmt={fmt.n0} yFmt={fmt.pct} />
        </ChartCard>

        <Card title={p.simTitle}>
          <p className="mb-3 text-sm text-slate-700">{p.simText(year)}</p>
          <div className="mb-3 flex flex-wrap items-end gap-4">
            <label className="text-xs text-slate-500">
              {p.refYear}
              <select value={ry} onChange={(e) => { setRefYear(Number(e.target.value)); setCustom(null); }}
                className="mt-1 block rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800">
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <label className="min-w-[8rem] flex-1 text-xs text-slate-500">
              {p.custom}: <span className="font-semibold tabular-nums text-slate-900">{custom == null ? "–" : fmt.pct(custom)}</span>
              <input type="range" min="0" max="25" step="0.5" value={custom ?? 10} onChange={(e) => setCustom(Number(e.target.value))} className="mt-2 block w-full" />
            </label>
            {custom != null && <button onClick={() => setCustom(null)} className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">{p.useYear}</button>}
          </div>
          <Table head={[p.sim.company, p.sim.tested, p.sim.now, p.sim.profitNow, p.sim.profitIf, p.sim.gap]} hide={[2, 3]}
            rows={selected.map((c) => {
              const r = get(c.key, year);
              const tested = custom != null ? custom : get(c.key, ry).margin;
              const now = profitBn(r), ifp = (r.revenue * tested) / 100;
              return [c.short, fmt.pct(tested), fmt.pct(r.margin), fmt.n2(now), fmt.n2(ifp), `${ifp - now >= 0 ? "+" : "−"}${fmt.n2(Math.abs(ifp - now))}`];
            })} />
        </Card>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold text-slate-900">{p.detailsTitle}</h2>
      <div className="grid gap-4 xl:grid-cols-3">
        {selected.map((c) => {
          const rows = years.map((y) => get(c.key, y));
          return (
            <Card key={c.key}>
              <p className="flex items-center gap-2 font-semibold text-slate-900"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} /> {c.short}</p>
              <p className="mb-3 mt-1 text-xs text-slate-500">{p.measure}: {t.measure[rows[0].profitMeasure] || rows[0].profitMeasure}</p>
              <Table head={[p.year, `${p.revenue} (${t.units.bn})`, `${p.profit} (${t.units.bn})`, p.margin]}
                rows={rows.map((r) => [r.year, fmt.n1(r.revenue), r.profitUnit === "percent" ? t.na : fmt.n2(r.profitValue), fmt.pct(r.margin)])} />
            </Card>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">{p.note}</p>
    </>
  );
}
