"use client";
import { T } from "@/lib/i18n";
import { makeFmt } from "@/lib/format";
import { useData } from "@/components/DataProvider";
import { PageHead, Card, Table } from "@/components/Ui";
import { GroupedBars } from "@/components/Charts";

export default function PeopleView({ lang }) {
  const t = T[lang], p = t.people, fmt = makeFmt(t);
  const { companies, years, get } = useData();
  if (!years.length) return (<><PageHead title={p.title} /><Card><p className="text-sm text-slate-700">{t.empty}</p></Card></>);
  const empData = years.map((y) => ({ year: y, ...Object.fromEntries(companies.map((c) => [c.short, get(c.key, y).employees])) }));

  return (
    <>
      <PageHead title={p.title} sub={p.sub} />
      <Card title={p.employees}>
        <Table head={[p.company, ...years]} rows={companies.map((c) => [c.short, ...years.map((y) => fmt.num(get(c.key, y).employees))])} />
      </Card>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title={p.chart}><GroupedBars data={empData} series={companies} digits={0} locale={t.locale} na={t.na} /></Card>
        <Card title={p.perEmp}>
          <Table head={[p.company, ...years]} rows={companies.map((c) => [c.short, ...years.map((y) => fmt.k(get(c.key, y).revenuePerEmployee))])} />
          <p className="mt-3 text-xs text-slate-500">{p.note}</p>
        </Card>
      </div>
    </>
  );
}
