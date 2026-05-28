import { AppShell } from "../../components/AppShell";
import { ListPage } from "../../components/ListPage";
import { getEntries, getSectionPage, siteText } from "../../lib/content";

export default async function Page() {
  const lang = "zh-cn";
  return (
    <AppShell text={siteText(lang)}>
      <ListPage section="posts" sectionPage={await getSectionPage("posts", lang)} entries={await getEntries("posts", { lang })} />
    </AppShell>
  );
}
