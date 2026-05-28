import { AppShell } from "../../../components/AppShell";
import { ListPage } from "../../../components/ListPage";
import { getEntries, getSectionPage, siteText } from "../../../lib/content";

export default async function Page() {
  const lang = "en";
  return (
    <AppShell text={siteText(lang)}>
      <ListPage section="projects" sectionPage={await getSectionPage("projects", lang)} entries={await getEntries("projects", { lang })} />
    </AppShell>
  );
}
