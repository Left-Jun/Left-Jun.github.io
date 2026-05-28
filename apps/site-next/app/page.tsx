import { AppShell } from "../components/AppShell";
import { HomePage } from "../components/HomePage";
import { getEntries, relatedEntries, siteText } from "../lib/content";

export default async function Page() {
  const lang = "zh-cn";
  const text = siteText(lang);
  const allProjects = await getEntries("projects", { lang });
  const featured = allProjects.filter((entry) => entry.data.featured);
  const projects = (featured.length ? [...featured].sort((a, b) => (a.data.featuredWeight || 999) - (b.data.featuredWeight || 999)) : allProjects).slice(0, 3);
  const posts = (await getEntries("posts", { lang })).slice(0, 3);
  const planEntries = (await getEntries("plans")).slice(0, 2);
  const plans = await Promise.all(planEntries.map(async (entry) => ({
    entry,
    retrospective: (await relatedEntries(entry)).find((item) => item.section === "retrospectives")
  })));
  const records = Object.fromEntries(allProjects.map((entry) => [entry.slug, entry]));
  return (
    <AppShell text={text}>
      <HomePage lang={lang} text={text} projects={projects} posts={posts} plans={plans} records={records} />
    </AppShell>
  );
}
