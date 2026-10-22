import "../globals.css";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { DataProvider } from "@/components/DataProvider";
import { loadCsvText } from "@/lib/data";
import { T, LANGS, isLang } from "@/lib/i18n";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: { default: T[lang].siteTitle, template: `%s | Stuttgart Companies` }, description: T[lang].siteDesc };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang];
  return (
    <html lang={lang}>
      <body>
        <DataProvider defaultCsv={loadCsvText()}>
          <Sidebar lang={lang} t={{ nav: t.nav, brandSub: t.brandSub, note: t.note, menu: t.menu, language: t.language }} />
          <main className="px-4 py-6 sm:px-8 lg:ml-64 lg:py-10 print:m-0 print:p-0">
            {children}
          </main>
        </DataProvider>
      </body>
    </html>
  );
}
