export function PageHead({ title, sub }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {sub && <p className="mt-1 max-w-3xl text-sm text-slate-600">{sub}</p>}
    </div>
  );
}

export function Card({ title, children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-xl border border-slate-200 bg-white p-3 min-[400px]:p-4 sm:p-5 ${className}`}>
      {title && <h2 className="mb-3 text-sm font-semibold text-slate-900">{title}</h2>}
      {children}
    </section>
  );
}

export function Button({ children, onClick, href, download, variant = "primary", className = "", ...rest }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors";
  const look = variant === "primary" ? "bg-slate-900 text-white hover:bg-slate-700" : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50";
  if (href) return <a href={href} download={download} className={`${base} ${look} ${className}`} {...rest}>{children}</a>;
  return <button type="button" onClick={onClick} className={`${base} ${look} ${className}`} {...rest}>{children}</button>;
}

export function Stat({ label, value, hint, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="flex items-center gap-2 text-sm text-slate-500">
        {color && <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />}
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// hide: column numbers that are left out on very small screens
export function Table({ head, rows, hide = [] }) {
  const xs = (i) => (hide.includes(i) ? "hidden sm:table-cell " : "");
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[11px] sm:text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>{head.map((h, i) => <th key={i} className={`${xs(i)}py-2 pl-1 font-medium first:pl-0 sm:pl-2 ${i ? "text-right" : ""}`}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0">
              {r.map((c, j) => <td key={j} className={`${xs(j)}py-2 pl-1 first:pl-0 sm:pl-2 ${j ? "whitespace-nowrap text-right tabular-nums" : "font-medium text-slate-900"}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
