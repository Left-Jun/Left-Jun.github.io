import Link from "next/link";
import type { SiteEntry } from "../lib/content";

export function ProjectCard({ entry, compact = false }: { entry: SiteEntry; compact?: boolean }) {
  const image = entry.asset(entry.data.image);
  const video = entry.asset(entry.data.coverVideo);
  const type = String(entry.data.portfolioType || "project").toLowerCase();
  const tags = entry.data.tags || [];
  const roles = entry.data.roleTags || [];

  return (
    <article className="project-card" data-project-type={type}>
      <Link href={entry.url}>
        {(image || video) && (
          <div className="project-card__image">
            {video ? (
              <video autoPlay muted loop playsInline poster={image || undefined} style={{ objectPosition: entry.data.imagePosition || "center" }}>
                <source src={video} />
              </video>
            ) : (
              <img src={image} alt="" loading="lazy" style={{ objectPosition: entry.data.imagePosition || "center" }} />
            )}
          </div>
        )}
        <div className="project-card__content">
          <h3 className="project-card__title">{entry.data.title}</h3>
          <p className="project-card__description">{entry.data.description}</p>
          {!compact && roles.length > 0 && (
            <div className="project-card__roles">
              {roles.map((role: string) => <span className="project-card__role" key={role}>{role}</span>)}
            </div>
          )}
          <div className="project-card__tags">
            {tags.slice(0, compact ? 3 : 7).map((tag: string) => <span className="project-card__tag" key={tag}>{tag}</span>)}
          </div>
        </div>
      </Link>
    </article>
  );
}
