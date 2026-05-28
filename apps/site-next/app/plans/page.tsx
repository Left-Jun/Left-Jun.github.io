import { AppShell } from "../../components/AppShell";
import { ListPage } from "../../components/ListPage";
import { getEntries, getSectionPage, siteText } from "../../lib/content";

export default async function Page() {
  const lang = "zh-cn";
  return (
    <AppShell text={siteText(lang)}>
      <ListPage section="plans" sectionPage={await getSectionPage("plans", lang)} entries={await getEntries("plans")} />
    </AppShell>
  );
}
