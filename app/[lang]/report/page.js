import { T } from "@/lib/i18n";
import ReportView from "@/components/views/ReportView";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: T[lang].nav.report };
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <ReportView lang={lang} />;
}
