"use client";
import { useMemo, useState } from "react";
import { T } from "@/lib/i18n";
import { makeFmt } from "@/lib/format";
import { pctChange, profitPerEmployee } from "@/lib/calc";
import { useData } from "@/components/DataProvider";
import { useFilters } from "@/components/FilterProvider";
import { PageHead, Card, Table } from "@/components/Ui";
import FilterBar from "@/components/FilterBar";
import ChartCard, { Segmented } from "@/components/ChartCard";
import { MetricChart } from "@/components/Charts";

export default function PeopleView({ lang }) {
  const t = T[lang], p = t.people, fmt = makeFmt(t);
  const { years, get } = useData();
  const { selected } = useFilters();
  const [metric, setMetric] = useState("employees");
  const [kind, setKind] = useState("bar");

  const val = (c, y) => {
    const r = get(c.key, y);
    if (metric === "employees") return r.employees ?? null;
    if (metric === "rpe") return r.revenuePerEmployee;
    return profitPerEmployee(r);
  };
  const data = useMemo(
    () => years.map((y) => ({ year: y, ...Object.fromEntries(selected.map((c) => [c.short, val(c, y)])) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [years, selected, metric, get]
  );

  if (!years.length) return (<><PageHead title={p.title} /><Card><p className="text-sm text-slate-700">{t.empty}</p></Card></>);

  const f = metric === "employees" ? fmt.n0 : fmt.n0;
  const title = { employees: p.employees, rpe: p.rpe, ppe: p.ppe }[metric];
  const cov = selected.map((c) => ({ c, have: years.filter((y) => get(c.key, y).employees != null) }));
  const insights = selected.map((c) => {
    const ys = years.filter((y) => get(c.key, y).employees != null);
    if (ys.length < 2) return null;
    const a = ys[0], b = ys[ys.length - 1];
    return p.insight(c.short, a, fmt.n1(profitPerEmployee(get(c.key, a))), b, fmt.n1(profitPerEmployee(get(c.key, b))));
  }).filter(Boolean);

  return (
    <>
      <PageHead title={p.title} sub={p.sub} />
      <FilterBar lang={lang} />

      <ChartCard title={`${p.chartTitle}: ${title}`} pngLabel={t.ui.png} filename={`stuttgart-${metric}.png`}
        legend={selected.map((c) => ({ name: c.short, color: c.color }))} note={metric === "ppe" ? `${p.ppeNote} ${p.gapNote}` : p.gapNote}
        controls={<>
          <label className="sr-only" htmlFor="pe-metric">{p.metric}</label>
          <select id="pe-metric" value={metric} onChange={(e) => setMetric(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700">
            <option value="employees">{p.employees}</option><option value="rpe">{p.rpe}</option><option value="ppe">{p.ppe}</option>
          </select>
          <Segmented label="" value={kind} onChange={setKind} options={[["bar", "▮"], ["line", "∿"]]} />
        </>}>
        <MetricChart data={data} series={selected} kind={kind} fmt={f} na={t.na} />
      </ChartCard>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title={p.employees}>
          <Table head={[p.company, ...years]} rows={selected.map((c) => [c.short, ...years.map((y) => fmt.num(get(c.key, y).employees))])} />
        </Card>
        <Card title={p.rpe}>
          <Table head={[p.company, ...years]} rows={selected.map((c) => [c.short, ...years.map((y) => fmt.k(get(c.key, y).revenuePerEmployee))])} />
          <p className="mt-3 text-xs text-slate-500">{p.note}</p>
        </Card>
        <Card title={p.ppe}>
          <Table head={[p.company, ...years]} rows={selected.map((c) => [c.short, ...years.map((y) => { const v = profitPerEmployee(get(c.key, y)); return v == null ? t.na : fmt.n1(v); })])} />
          <p className="mt-3 text-xs text-slate-500">{p.ppeNote}</p>
        </Card>
        <Card title={p.changeTitle}>
          <Table head={[p.company, p.employees, ""]}
            rows={cov.map(({ c, have }) => {
              if (have.length < 2) return [c.short, t.na, "–"];
              const a = have[0], b = have[have.length - 1];
              return [c.short, fmt.chg(pctChange(get(c.key, a).employees, get(c.key, b).employees)), p.period(a, b)];
            })} hide={[2]} />
          {cov.some((x) => x.have.length < 2) && <p className="mt-3 text-xs text-slate-500">{p.none}</p>}
          <h3 className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-slate-500">{p.covTitle}</h3>
          <ul className="space-y-1 text-sm text-slate-700">
            {cov.map(({ c, have }) => <li key={c.key} className="flex justify-between gap-2"><span>{c.short}</span><span className="tabular-nums">{p.covText(have.length, years.length)}</span></li>)}
          </ul>
        </Card>
      </div>

      {insights.length > 0 && (
        <Card className="mt-6" title={p.says}>
          <ul className="space-y-1 text-sm text-slate-700">{insights.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </Card>
      )}
    </>
  );
}
