import { PostCard } from "./PostCard";
import { ProjectCard } from "./ProjectCard";
import type { Section, SiteEntry } from "../lib/content";

export function ListPage({ section, sectionPage, entries }: { section: Section; sectionPage: any; entries: SiteEntry[] }) {
  const isProjects = section === "projects";
  return (
    <>
      <section className="project-section-card section-card">
        <div className="section-details">
          <div className="project-section-heading">
            <h1 className="section-term">{sectionPage.data?.title || section}</h1>
            {sectionPage.data?.description && <p className="section-description">{sectionPage.data.description}</p>}
          </div>
        </div>
      </section>
      {isProjects ? (
        <section className="project-showcase" data-view="single">
          <div className="project-list">
            {entries.map((entry) => <ProjectCard entry={entry} key={entry.ref} />)}
          </div>
        </section>
      ) : (
        <section className="article-list article-list--compact">
          {entries.map((entry) => <PostCard entry={entry} key={entry.ref} />)}
        </section>
      )}
    </>
  );
}
