import { notFound } from "next/navigation";
import { AppShell } from "../../../../components/AppShell";
import { ArticleLayout } from "../../../../components/ArticleLayout";
import { getEntries, getEntryBySlug, siteText } from "../../../../lib/content";

export async function generateStaticParams() {
  return (await getEntries("projects", { lang: "en" })).map((entry) => ({ slug: entry.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntryBySlug("projects", slug, "en");
  if (!entry) notFound();
  return <AppShell text={siteText("en")}><ArticleLayout entry={entry} /></AppShell>;
}
