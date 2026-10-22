"use client";
import { T } from "@/lib/i18n";
import { useData } from "@/components/DataProvider";
import { PageHead, Card } from "@/components/Ui";

export const SOURCES = [
  ["Mercedes-Benz Group", "https://group.mercedes-benz.com/investors/reports-news/annual-reports/2025/"],
  ["Mercedes-Benz Group", "https://www.businesswire.com/news/home/20240221094253/en/"],
  ["Porsche AG", "https://newsroom.porsche.com/en/annual-sustainability-report/from-the-company/2025-at-a-glance/"],
  ["Porsche AG", "https://newsroom.porsche.com/assets/uploads/documents/Combined_Management_Report_2025_Porsche_AG.pdf"],
  ["Porsche AG", "https://newsroom.porsche.com/en/2025/company/porsche-annual-press-conference-financial-year-2024-annual-and-sustainability-report-38687.html"],
  ["Bosch Group", "https://www.bosch-presse.de/pressportal/us/en/image-30341.html"],
  ["Bosch Group", "https://www.bosch-presse.de/pressportal/de/en/key-data-of-the-2023-business-year-264539.html"],
];

export default function MethodView({ lang }) {
  const m = T[lang].method;
  const { rows } = useData();
  return (
    <>
      <PageHead title={m.title} sub={m.sub} />
      <div className="space-y-6">
        <Card title={m.methodTitle}>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">{m.steps(rows.length).map((s) => <li key={s}>{s}</li>)}</ol>
        </Card>
        <Card title={m.limitsTitle}>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">{m.limits.map((s) => <li key={s}>{s}</li>)}</ul>
        </Card>
        <Card title={m.sourcesTitle}>
          <ul className="space-y-2 text-sm">
            {SOURCES.map(([c, u], i) => (
              <li key={u}><span className="font-medium text-slate-900">{c}: </span>
                <a href={u} target="_blank" rel="noreferrer" className="break-words text-blue-700 underline">{m.src[i]}</a></li>
            ))}
          </ul>
        </Card>
        <Card title={m.discTitle}><p className="text-sm leading-relaxed text-slate-700">{m.disc}</p></Card>
      </div>
    </>
  );
}
