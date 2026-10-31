import { T } from "@/lib/i18n";
import PeopleView from "@/components/views/PeopleView";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: T[lang].nav.people };
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <PeopleView lang={lang} />;
}
