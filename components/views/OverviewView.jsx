"use client";
import { T } from "@/lib/i18n";
import { makeFmt } from "@/lib/format";
import { useData } from "@/components/DataProvider";
import { PageHead, Card, Stat, Table } from "@/components/Ui";
import { GroupedBars } from "@/components/Charts";

export default function OverviewView({ lang }) {
  const t = T[lang], o = t.overview, fmt = makeFmt(t);
  const { companies, years, get } = useData();
  if (!years.length) return (<><PageHead title={o.title} /><Card><p className="text-sm text-slate-700">{t.empty}</p></Card></>);

  const first = years[0], last = years[years.length - 1];
  const revenueData = years.map((y) => ({ year: y, ...Object.fromEntries(companies.map((c) => [c.short, get(c.key, y).revenue])) }));

  const changes = companies.map((c) => ({ c, from: get(c.key, first).margin, to: get(c.key, last).margin }));
  const multi = years.length > 1;
  const allFell = multi && changes.every((x) => x.to < x.from);
  const biggest = [...changes].sort((a, b) => (a.to - a.from) - (b.to - b.from))[0];

  return (
    <>
      <PageHead title={o.title} sub={o.sub(first, last)} />
      <div className="grid gap-4 sm:grid-cols-3">
        {companies.map((c) => (
          <Stat key={c.key} color={c.color} label={o.revenueIn(c.short, last)} value={fmt.bn(get(c.key, last).revenue)}
            hint={`${o.marginHint} ${fmt.pct(get(c.key, last).margin)}`} />
        ))}
      </div>

      {multi && (
        <Card className="mt-6" title={o.says}>
          <p className="text-sm leading-relaxed text-slate-700">
            {allFell ? o.allFell(first, last) : ""}
            {biggest.to < biggest.from ? o.biggest(biggest.c.short, fmt.pct(biggest.from), fmt.pct(biggest.to)) : ""}
            {allFell ? o.revLess : ""}
          </p>
        </Card>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title={o.revChart}>
          <GroupedBars data={revenueData} series={companies} unit={` ${t.units.bn}`} locale={t.locale} na={t.na} />
        </Card>
        <Card title={o.marginTable}>
          <Table head={[o.company, ...years]} rows={companies.map((c) => [c.short, ...years.map((y) => fmt.pct(get(c.key, y).margin))])} />
          <p className="mt-3 text-xs text-slate-500">{o.marginNote}</p>
        </Card>
      </div>
    </>
  );
}
