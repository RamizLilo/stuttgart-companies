"use client";
import { T } from "@/lib/i18n";
import { makeFmt } from "@/lib/format";
import { useData } from "@/components/DataProvider";
import { PageHead, Card, Table } from "@/components/Ui";
import { MarginChart } from "@/components/Charts";

export default function ProfitabilityView({ lang }) {
  const t = T[lang], p = t.profit, fmt = makeFmt(t);
  const { companies, years, get } = useData();
  if (!years.length) return (<><PageHead title={p.title} /><Card><p className="text-sm text-slate-700">{t.empty}</p></Card></>);
  const chart = years.map((y) => ({ year: y, ...Object.fromEntries(companies.map((c) => [c.short, Number(get(c.key, y).margin.toFixed(1))])) }));

  return (
    <>
      <PageHead title={p.title} sub={p.sub} />
      <Card title={p.chart}><MarginChart data={chart} series={companies} locale={t.locale} /></Card>

      <h2 className="mb-3 mt-8 text-sm font-semibold text-slate-900">{p.figures}</h2>
      <div className="grid gap-4 xl:grid-cols-3">
        {companies.map((c) => {
          const rows = years.map((y) => get(c.key, y));
          return (
            <Card key={c.key}>
              <p className="flex items-center gap-2 font-semibold text-slate-900">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} /> {c.short}
              </p>
              <p className="mb-3 mt-1 text-xs text-slate-500">{p.measure}: {t.measure[rows[0].profitMeasure] || rows[0].profitMeasure}</p>
              <Table
                head={[p.year, `${p.revenue} (${t.units.bn})`, `${p.profit} (${t.units.bn})`, p.margin]}
                rows={rows.map((r) => [r.year, fmt.n1(r.revenue), r.profitUnit === "percent" ? t.na : fmt.n2(r.profitValue), fmt.pct(r.margin)])}
              />
            </Card>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">{p.note}</p>
    </>
  );
}
