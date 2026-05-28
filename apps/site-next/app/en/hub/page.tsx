import { AppShell } from "../../../components/AppShell";
import { HubPlaceholder } from "../../../components/HubPlaceholder";
import { getEntries, siteText } from "../../../lib/content";

export default async function Page() {
  const lang = "en";
  return (
    <AppShell text={siteText(lang)}>
      <HubPlaceholder lang={lang} projects={await getEntries("projects", { lang })} />
    </AppShell>
  );
}
