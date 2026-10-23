"use client";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { T } from "@/lib/i18n";
import { makeFmt } from "@/lib/format";
import { pctChange, profitBn } from "@/lib/calc";
import { useData } from "@/components/DataProvider";
import { useFilters } from "@/components/FilterProvider";
import { PageHead, Card, Table } from "@/components/Ui";
import FilterBar from "@/components/FilterBar";
import ChartCard, { Segmented } from "@/components/ChartCard";
import { MetricChart } from "@/components/Charts";
import Num from "@/components/Num";
import Spark from "@/components/Spark";

function Delta({ value, text, prevLabel }) {
  if (value == null) return null;
  const up = value >= 0, Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-700" : "text-rose-700"}`}>
      <Icon size={14} aria-hidden /> {text} <span className="font-normal text-slate-500">{prevLabel}</span>
    </span>
  );
}

export default function OverviewView({ lang }) {
  const t = T[lang], o = t.overview, fmt = makeFmt(t);
  const { companies, years, get } = useData();
  const { year, prevYear, selected } = useFilters();
  const [metric, setMetric] = useState("revenue");
  const [kind, setKind] = useState("bar");

  const first = years[0], last = years[years.length - 1];
  const value = (c, y, m) => {
    const r = get(c.key, y);
    if (!r) return null;
    if (m === "rpe") return r.revenuePerEmployee;
    if (m === "index") {
      const base = years.map((yy) => get(c.key, yy)).find((x) => x && x.revenue);
      return base && r.revenue ? (r.revenue / base.revenue) * 100 : null;
    }
    return r[m] ?? null;
  };
  const metricFmt = { revenue: fmt.n1, margin: fmt.pct, employees: fmt.n0, rpe: fmt.n0, index: fmt.n0 }[metric];
  const chartData = useMemo(
    () => years.map((y) => ({ year: y, ...Object.fromEntries(selected.map((c) => [c.short, value(c, y, metric)])) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [years, selected, metric, get]
  );

  if (!years.length) return (<><PageHead title={o.title} /><Card><p className="text-sm text-slate-700">{t.empty}</p></Card></>);

  const metricTitle = metric === "index" ? o.metrics.index(first) : o.metrics[metric];
  const ranking = [...selected].sort((a, b) => get(b.key, year).margin - get(a.key, year).margin);
  const changes = selected.map((c) => ({ c, from: get(c.key, first).margin, to: get(c.key, last).margin }));
  const multi = years.length > 1 && selected.length > 0;
  const allFell = multi && changes.every((x) => x.to < x.from);
  const allMove = multi && changes.every((x) => x.to !== x.from);
  const biggest = [...changes].sort((a, b) => (a.to - a.from) - (b.to - b.from))[0];

  return (
    <>
      <PageHead title={o.title} sub={o.sub(first, last)} />
      <FilterBar lang={lang} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {selected.map((c) => {
          const r = get(c.key, year), p = prevYear ? get(c.key, prevYear) : null;
          const vs = o.vs(prevYear);
          return (
            <section key={c.key} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5" style={{ borderTop: `3px solid ${c.color}` }}>
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-900">{c.short}</h2>
                <Spark values={years.map((y) => get(c.key, y).revenue)} color={c.color} />
              </div>
              <p className="mt-3 text-xs text-slate-500">{o.revenue}</p>
              <p className="text-2xl font-semibold tabular-nums text-slate-900"><Num value={r.revenue} format={fmt.bn} na={t.na} /></p>
              {p && <Delta value={pctChange(p.revenue, r.revenue)} text={fmt.chg(pctChange(p.revenue, r.revenue) ?? 0)} prevLabel={vs} />}
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <dt className="text-xs text-slate-500">{o.margin}</dt>
                  <dd className="font-semibold tabular-nums text-slate-900"><Num value={r.margin} format={fmt.pct} na={t.na} /></dd>
                  {p && <Delta value={r.margin - p.margin} text={fmt.pp(r.margin - p.margin)} prevLabel="" />}
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{o.employees}</dt>
                  <dd className="font-semibold tabular-nums text-slate-900"><Num value={r.employees} format={fmt.n0} na={t.na} /></dd>
                  {p && p.employees != null && r.employees != null && (
                    <Delta value={pctChange(p.employees, r.employees)} text={fmt.chg(pctChange(p.employees, r.employees))} prevLabel="" />
                  )}
                </div>
              </dl>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">{o.hundredTitle(year)}</p>
                <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={o.hundredText(fmt.n1(r.margin))}>
                  <div style={{ width: `${Math.max(0, Math.min(100, r.margin))}%`, background: c.color }} />
                </div>
                <p className="mt-1 text-xs font-medium text-slate-700">{o.hundredText(fmt.n1(r.margin))}</p>
              </div>
            </section>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-500">{o.hundredNote}</p>

      <ChartCard className="mt-6" title={`${o.chartTitle}: ${metricTitle}`} pngLabel={t.ui.png}
        filename={`stuttgart-${metric}.png`} legend={selected.map((c) => ({ name: c.short, color: c.color }))}
        note={metric === "index" ? `${o.indexNote(first)} ${o.gapNote}` : o.gapNote}
        controls={<>
          <label className="sr-only" htmlFor="ov-metric">{o.metric}</label>
          <select id="ov-metric" value={metric} onChange={(e) => setMetric(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700">
            {Object.keys(o.short).map((m) => <option key={m} value={m}>{o.short[m]}</option>)}
          </select>
          {metric !== "index" && <Segmented label="" value={kind} onChange={setKind} options={[["bar", o.kinds.bar], ["line", o.kinds.line]]} />}
        </>}>
        <MetricChart data={chartData} series={selected} kind={metric === "index" ? "line" : kind} fmt={metricFmt} na={t.na} />
      </ChartCard>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title={o.rankTitle(year)}>
          <Table head={[o.rank, o.company, o.margin, o.change]}
            rows={ranking.map((c, i) => {
              const r = get(c.key, year), p = prevYear ? get(c.key, prevYear) : null;
              return [i + 1, c.short, fmt.pct(r.margin), p ? fmt.pp(r.margin - p.margin) : t.na];
            })} />
          <p className="mt-3 text-xs text-slate-500">{o.marginNote}</p>
        </Card>
        {multi && (
          <Card title={o.says}>
            <p className="text-sm leading-relaxed text-slate-700">
              {allFell ? o.allFell(first, last, selected.length) : allMove ? o.mixed(first, last) : ""}
              {biggest && biggest.to < biggest.from ? o.biggest(biggest.c.short, fmt.pct(biggest.from), fmt.pct(biggest.to)) : ""}
              {allFell ? o.revLess : ""}
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
