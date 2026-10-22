"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutGrid, TrendingUp, Users, FileText, Database, Info, Menu, X } from "lucide-react";

const ITEMS = [
  { slug: "", key: "overview", icon: LayoutGrid },
  { slug: "/profitability", key: "profitability", icon: TrendingUp },
  { slug: "/people", key: "people", icon: Users },
  { slug: "/report", key: "report", icon: FileText },
  { slug: "/data", key: "data", icon: Database },
  { slug: "/method", key: "method", icon: Info },
];

export default function Sidebar({ lang, t }) {
  const path = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);
  const rest = path.replace(/^\/(en|de)/, "");
  const close = () => setOpen(false);

  const switcher = (
    <div className="inline-flex overflow-hidden rounded-md border border-white/20 text-xs font-medium" role="group" aria-label={t.language}>
      {["en", "de"].map((l) => (
        <Link key={l} href={`/${l}${rest}`} onClick={close} hrefLang={l} lang={l}
          aria-current={l === lang ? "true" : undefined}
          className={`px-2.5 py-1.5 uppercase ${l === lang ? "bg-white text-slate-900" : "text-slate-300 hover:bg-white/10"}`}>
          {l}
        </Link>
      ))}
    </div>
  );

  const nav = (
    <nav className="mt-6 space-y-1" aria-label="Main">
      {ITEMS.map(({ slug, key, icon: Icon }) => {
        const href = `/${lang}${slug}`;
        const active = path === href;
        return (
          <Link key={key} href={href} onClick={close} aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"}`}>
            <Icon size={18} aria-hidden /> {t.nav[key]}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div>
      <p className="text-base font-semibold text-white">Stuttgart Companies</p>
      <p className="text-xs text-slate-400">{t.brandSub}</p>
    </div>
  );

  const note = <p className="text-xs leading-relaxed text-slate-400">{t.note}</p>;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col justify-between bg-slate-900 p-5 lg:flex print:hidden">
        <div>
          {brand}
          <div className="mt-4">{switcher}</div>
          {nav}
        </div>
        {note}
      </aside>

      {/* Mobile top bar with a dropdown menu */}
      <header className="sticky top-0 z-30 bg-slate-900 lg:hidden print:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          {brand}
          <div className="flex items-center gap-2">
            {switcher}
            <button onClick={() => setOpen(!open)} aria-label={t.menu} aria-expanded={open} aria-controls="mobile-menu"
              className="rounded-md p-2 text-white">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open && (
          <div id="mobile-menu" className="absolute inset-x-0 top-full bg-slate-900 px-4 pb-5 shadow-xl">
            {nav}
            <div className="mt-5">{note}</div>
          </div>
        )}
      </header>
    </>
  );
}
