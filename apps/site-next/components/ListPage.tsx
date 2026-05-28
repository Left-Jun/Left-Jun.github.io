import { PostCard } from "./PostCard";
import { ProjectCard } from "./ProjectCard";
import { ProjectListControls } from "./ProjectListControls";
import type { Section, SiteEntry } from "../lib/content";

export function ListPage({ section, sectionPage, entries }: { section: Section; sectionPage: any; entries: SiteEntry[] }) {
  const isProjects = section === "projects";
  const data = sectionPage.data || {};
  const lang = sectionPage.lang === "en" ? "en" : "zh-cn";
  const isEn = lang === "en";

  if (isProjects) {
    const countSuffix = data.countSuffix || (isEn ? "projects" : "个项目");
    const gameLabel = data.gameFilterLabel || (isEn ? "Game Development" : "游戏开发");
    const embeddedLabel = data.embeddedFilterLabel || (isEn ? "Embedded Development" : "嵌入式开发");
    const singleLabel = data.singleViewLabel || (isEn ? "Single" : "单列");
    const gridLabel = data.gridViewLabel || (isEn ? "Grid" : "网格");

    return (
      <>
        <ProjectListControls />
        <header className="project-hero">
          <div className="section-card project-section-card">
            <div className="section-details">
              <h3 className="section-count">{entries.length} {countSuffix}</h3>
              <div className="project-section-heading">
                <h1 className="section-term">{data.title || section}</h1>
                {data.description && <h2 className="section-description">{data.description}</h2>}
              </div>
              <div className="project-section-actions">
                <div className="project-filter-toggle" role="group" aria-label={data.filterAriaLabel || (isEn ? "Filter project categories" : "筛选项目分类")}>
                  <button className="project-filter-toggle__button" type="button" data-filter-target="game">{gameLabel}</button>
                  <button className="project-filter-toggle__button" type="button" data-filter-target="embedded">{embeddedLabel}</button>
                </div>
                <div className="project-view-toggle" role="group" aria-label={data.viewAriaLabel || (isEn ? "Switch project display mode" : "切换项目展示方式")}>
                  <button className="project-view-toggle__button is-active" type="button" data-view-target="single">{singleLabel}</button>
                  <button className="project-view-toggle__button" type="button" data-view-target="grid">{gridLabel}</button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="article-page project-index-layout">
          <div className="article-layout">
            <section className="project-showcase" data-view="single">
              <div className="project-list">
                {entries.map((entry) => <ProjectCard entry={entry} key={entry.ref} />)}
              </div>
            </section>
            <aside className="sidebar right-sidebar sticky project-index-sidebar">
              <section className="widget project-type-widget">
                <div className="widget-icon" aria-hidden="true">◇</div>
                <h2 className="widget-title section-title">{data.typeTitle || (isEn ? "Project Types" : "项目类型")}</h2>
                <div className="project-index-type-list" role="group" aria-label={data.filterAriaLabel || (isEn ? "Filter project categories" : "筛选项目分类")}>
                  <button className="project-index-type-button" type="button" data-filter-target="game">{gameLabel}</button>
                  <button className="project-index-type-button" type="button" data-filter-target="embedded">{embeddedLabel}</button>
                </div>
              </section>
              <section className="widget project-index-widget">
                <div className="widget-icon" aria-hidden="true">⌁</div>
                <h2 className="widget-title section-title">{data.indexTitle || (isEn ? "Project Index" : "项目索引")}</h2>
                <ol className="project-index-list">
                  {entries.map((entry) => (
                    <li key={entry.ref}>
                      <a href={`#project-${entry.slug}`}>{entry.data.title}</a>
                    </li>
                  ))}
                </ol>
              </section>
            </aside>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="project-section-card section-card">
        <div className="section-details">
          <div className="project-section-heading">
            <h1 className="section-term">{data.title || section}</h1>
            {data.description && <p className="section-description">{data.description}</p>}
          </div>
        </div>
      </section>
      <section className="article-list article-list--compact">
        {entries.map((entry) => <PostCard entry={entry} key={entry.ref} />)}
      </section>
    </>
  );
}
