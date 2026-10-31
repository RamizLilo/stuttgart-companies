import { T } from "@/lib/i18n";
import MethodView from "@/components/views/MethodView";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: T[lang].nav.method };
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <MethodView lang={lang} />;
}
