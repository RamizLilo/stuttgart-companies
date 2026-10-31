import OverviewView from "@/components/views/OverviewView";

export default async function Page({ params }) {
  const { lang } = await params;
  return <OverviewView lang={lang} />;
}
