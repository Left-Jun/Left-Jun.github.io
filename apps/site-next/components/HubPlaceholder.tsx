import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { Icon } from "./Icon";
import type { Lang, SiteEntry } from "../lib/content";

export function HubPlaceholder({ lang, projects }: { lang: Lang; projects: SiteEntry[] }) {
  const isEn = lang === "en";
  return (
    <>
      <section className="home-hero hub-hero">
        <p className="home-hero__eyebrow">{isEn ? "Coming next" : "下一阶段"}</p>
        <h1 className="home-hero__title">{isEn ? "Limenauts Project Hub" : "阈限开拓者项目大厅"}</h1>
        <p className="home-hero__summary">
          {isEn
            ? "This page is reserved for the future 2D navigation game. For now, it keeps a fast project fallback so every work remains reachable."
            : "这里预留给后续的 2D 导航小游戏。当前先保留轻量项目入口，确保所有作品仍然可以快速访问。"}
        </p>
        <div className="home-hero__actions">
          <Link className="home-action home-action--primary" href={isEn ? "/en/projects/" : "/projects/"}><Icon name="link" />{isEn ? "Back to Projects" : "返回项目列表"}</Link>
          <a className="home-action" href="/files/left-jun-portfolio.pdf"><Icon name="file" />{isEn ? "Portfolio PDF" : "作品集 PDF"}</a>
        </div>
      </section>
      <section className="home-section">
        <div className="home-section__header">
          <div>
            <p className="home-section__eyebrow">{isEn ? "Fallback Entries" : "备用入口"}</p>
            <h2>{isEn ? "Projects remain available" : "项目仍可直接浏览"}</h2>
          </div>
        </div>
        <div className="home-project-grid">
          {projects.slice(0, 3).map((entry) => <ProjectCard entry={entry} compact key={entry.ref} />)}
        </div>
      </section>
    </>
  );
}
