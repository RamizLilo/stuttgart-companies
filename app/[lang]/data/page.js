import { T } from "@/lib/i18n";
import DataView from "@/components/views/DataView";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: T[lang].nav.data };
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <DataView lang={lang} />;
}
