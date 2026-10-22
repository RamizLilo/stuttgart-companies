"use client";
import { Download, ArrowUp } from "lucide-react";
import { T } from "@/lib/i18n";
import { makeFmt } from "@/lib/format";
import { PROFILES } from "@/lib/profiles";
import { useData } from "@/components/DataProvider";
import { Card, Table } from "@/components/Ui";
import { MarginChart, PrintSafe } from "@/components/Charts";
import { SOURCES } from "./MethodView";

const pctChange = (a, b) => (a == null || b == null || a === 0 ? null : ((b - a) / a) * 100);

export default function ReportView({ lang }) {
  const t = T[lang], r = t.report, fmt = makeFmt(t);
  const { companies, years, get } = useData();

  if (!years.length) return <Card><p className="text-sm text-slate-700">{t.empty}</p></Card>;
  const first = years[0], last = years[years.length - 1];
  const multi = years.length > 1;

  // Numbers for the findings and the "what changed" table
  const rows = companies.map((c) => {
    const a = get(c.key, first), b = get(c.key, last);
    const emp = years.map((y) => get(c.key, y).employees).filter((v) => v != null);
    return {
      c, a, b,
      rev: pctChange(a.revenue, b.revenue),
      marginPp: b.margin - a.margin,
      marginRel: pctChange(a.margin, b.margin),
      emp: emp.length > 1 ? pctChange(emp[0], emp[emp.length - 1]) : null,
    };
  });
  const allFell = multi && rows.every((x) => x.marginPp < 0);
  const biggest = [...rows].sort((x, y) => x.marginPp - y.marginPp)[0];
  const revSmaller = multi && rows.every((x) => x.rev != null && x.marginRel != null && Math.abs(x.rev) < Math.abs(x.marginRel));
  const findings = [
    multi && (allFell ? r.fMargin(first, last) : r.fMarginMixed(first, last)),
    multi && biggest.marginPp < 0 && r.fBiggest(biggest.c.short, fmt.pct(biggest.a.margin), fmt.pct(biggest.b.margin)),
    revSmaller && r.fRevenue,
  ].filter(Boolean);

  const compareChart = years.map((y) => ({ year: y, ...Object.fromEntries(companies.map((c) => [c.short, Number(get(c.key, y).margin.toFixed(1))])) }));

  return (
    <article id="top" className="report mx-auto max-w-4xl">
      {/* Cover */}
      <header className="rounded-2xl bg-slate-900 p-8 text-white sm:p-12">
        <p className="text-xs uppercase tracking-widest text-slate-400">Stuttgart Companies</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">{r.title}</h1>
        <p className="mt-4 max-w-xl text-base text-slate-300">{r.sub(first, last)}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {companies.map((c) => (
            <span key={c.key} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} /> {c.short}
            </span>
          ))}
        </div>
        <p className="mt-8 text-xs text-slate-400">{r.status}</p>
        <div className="mt-6 print:hidden">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-100">
            <Download size={16} aria-hidden /> {r.pdf}
          </button>
          <p className="mt-2 text-xs text-slate-400">{r.pdfHint}</p>
        </div>
      </header>

      {/* Key findings */}
      {findings.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">{r.findings}</h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {findings.map((f, i) => (
              <li key={f} className="break-inside-avoid rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">
                <span className="mb-2 block text-2xl font-semibold text-slate-300">{i + 1}</span>{f}
              </li>
            ))}
          </ol>
        </section>
      )}

      {multi && (
        <section className="mt-8 break-inside-avoid">
          <Card title={r.changeTitle(first, last)}>
            <Table
              head={[r.company, r.cRevenue, r.cMargin, r.cEmployees]}
              rows={rows.map((x) => [x.c.short, x.rev == null ? t.na : fmt.chg(x.rev), fmt.pp(x.marginPp), x.emp == null ? t.na : fmt.chg(x.emp)])}
            />
          </Card>
        </section>
      )}

      {/* One chapter per company */}
      {companies.map((c, i) => {
        const prof = PROFILES[c.key];
        const own = years.map((y) => get(c.key, y));
        const a = own[0], b = own[own.length - 1];
        const rev = pctChange(a.revenue, b.revenue);
        const lineData = years.map((y) => ({ year: y, [c.short]: Number(get(c.key, y).margin.toFixed(1)) }));
        return (
          <section key={c.key} className="report-page mt-12">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} /> {r.chapter(i + 1)}
            </p>
            <h2 className="mt-1 text-3xl font-semibold text-slate-900">{c.short}</h2>

            <div className="mt-5 grid gap-4 lg:grid-cols-5">
              {prof && (
                <Card title={r.profile} className="break-inside-avoid lg:col-span-3">
                  <dl className="space-y-3 text-sm">
                    {prof.facts[lang].map(([k, v]) => (
                      <div key={k}><dt className="text-xs uppercase tracking-wide text-slate-500">{k}</dt><dd className="leading-relaxed text-slate-800">{v}</dd></div>
                    ))}
                  </dl>
                </Card>
              )}
              <div className={`grid gap-3 sm:grid-cols-3 ${prof ? "lg:col-span-2 lg:grid-cols-1" : "lg:col-span-5"}`}>
                <Kpi label={`${r.revenue} ${last}`} value={fmt.bn(b.revenue)} />
                <Kpi label={`${r.margin} ${last}`} value={fmt.pct(b.margin)} />
                <Kpi label={`${r.employees} ${last}`} value={fmt.num(b.employees)} />
              </div>
            </div>

            <Card className="mt-4 break-inside-avoid" title={r.years}>
              <Table hide={[2]}
                head={[r.year, `${r.revenue} (${t.units.bn})`, `${r.profit} (${t.units.bn})`, r.margin, r.employees]}
                rows={own.map((x) => [x.year, fmt.n1(x.revenue), x.profitUnit === "percent" ? t.na : fmt.n2(x.profitValue), fmt.pct(x.margin), fmt.num(x.employees)])}
              />
              <p className="mt-3 text-xs text-slate-500">{t.profit.measure}: {t.measure[a.profitMeasure] || a.profitMeasure}</p>
            </Card>

            {prof?.segments && (
              <Card className="mt-4 break-inside-avoid" title={`${r.segments} (${t.units.bn})`}>
                <Table
                  head={[r.company, ...Object.keys(prof.segments[0].v)]}
                  rows={prof.segments.map((s) => [s.name, ...Object.values(s.v).map((v) => fmt.n2(v))])}
                />
                <p className="mt-3 text-xs text-slate-500">{r.segNote}</p>
              </Card>
            )}

            {multi && (
              <>
                <Card className="mt-4 break-inside-avoid" title={t.profit.chart}>
                  <PrintSafe width={640}>{(w) => <MarginChart data={lineData} series={[c]} locale={t.locale} width={w} height={w ? 120 : 300} legend={false} />}</PrintSafe>
                </Card>
                {rev != null && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-700">
                    {r.takeaway(c.short, fmt.chg(rev), first, last, fmt.pct(a.margin), fmt.pct(b.margin))}
                  </p>
                )}
              </>
            )}

            {prof && (
              <p className="mt-4 text-xs text-slate-500">
                {r.sources}: {prof.sources.map(([n, u], k) => (
                  <span key={u}>{k ? " · " : ""}<a href={u} target="_blank" rel="noreferrer" className="break-words text-blue-700 underline">{n}</a></span>
                ))}
              </p>
            )}
          </section>
        );
      })}

      {/* Closing page */}
      <section className="report-page mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">{r.compare}</h2>
        <p className="mt-1 text-sm text-slate-600">{r.compareSub}</p>
        <Card className="mt-4 break-inside-avoid" title={t.profit.chart}>
          <PrintSafe width={640}>{(w) => <MarginChart data={compareChart} series={companies} locale={t.locale} width={w} height={w ? 220 : 300} />}</PrintSafe>
        </Card>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">{r.method}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{r.methodText}</p>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">{r.sources}</h2>
        <ul className="mt-2 space-y-1 text-xs text-slate-600">
          {SOURCES.map(([c, u], i) => <li key={u}>{c}: <a href={u} target="_blank" rel="noreferrer" className="break-words text-blue-700 underline">{t.method.src[i]}</a></li>)}
        </ul>
        <p className="mt-8 rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-600">{t.method.disc}</p>
        <a href="#top" className="mt-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 print:hidden"><ArrowUp size={14} aria-hidden /> {r.back}</a>
      </section>
    </article>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="break-inside-avoid rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
