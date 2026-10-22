import { T } from "@/lib/i18n";
import ProfitabilityView from "@/components/views/ProfitabilityView";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: T[lang].nav.profitability };
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <ProfitabilityView lang={lang} />;
}
