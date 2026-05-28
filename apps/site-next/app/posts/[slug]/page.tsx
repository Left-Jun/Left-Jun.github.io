import { notFound } from "next/navigation";
import { AppShell } from "../../../components/AppShell";
import { ArticleLayout } from "../../../components/ArticleLayout";
import { getEntries, getEntryBySlug, siteText } from "../../../lib/content";

export async function generateStaticParams() {
  return (await getEntries("posts", { lang: "zh-cn" })).map((entry) => ({ slug: entry.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntryBySlug("posts", slug, "zh-cn");
  if (!entry) notFound();
  return <AppShell text={siteText("zh-cn")}><ArticleLayout entry={entry} /></AppShell>;
}
